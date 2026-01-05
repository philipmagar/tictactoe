require("dotenv").config();
const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
const pool = require("./db");

const authRoutes = require("./routes/auth");
const leaderboardRoutes = require("./routes/leaderboard");

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/leaderboard", leaderboardRoutes);

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });
const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

const wins = [
  [0,1,2],[3,4,5],[6,7,8],
  [0,3,6],[1,4,7],[2,5,8],
  [0,4,8],[2,4,6]
];

function expectedScore(rA, rB){return 1/(1+Math.pow(10,(rB-rA)/400));}
function calcElo(rating, expected, score, k=32){return Math.round(rating + k*(score - expected));}
function checkWinner(board){
  for(const [a,b,c] of wins) if(board[a] && board[a]===board[b] && board[a]===board[c]) return board[a];
  return board.includes(null)? null:"draw";
}

// Socket.IO authentication
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  try{
    const payload = jwt.verify(token, JWT_SECRET);
    socket.userId = payload.userId;
    next();
  }catch{ next(new Error("Unauthorized")); }
});

const queue = [];

io.on("connection", socket => {
  console.log(`Socket connected: ${socket.id}, UserID: ${socket.userId}`);
  
  socket.on("disconnect", () => {
    console.log(`Socket disconnected: ${socket.id}`);
    const idx = queue.findIndex(p => p.socketId === socket.id);
    if(idx !== -1) {
        queue.splice(idx, 1);
        console.log("Removed from queue");
    }
  });

  socket.on("findMatch", async () => {
    console.log(`Find Match requested by ${socket.id}`);
    // Check if already in queue to prevent duplicates
    if(queue.find(p => p.socketId === socket.id)) return;

    try {
        const { rows } = await pool.query("SELECT elo, username FROM users WHERE id=$1",[socket.userId]);
        if (rows.length === 0) return;
        
        const playerData = { socketId: socket.id, userId: socket.userId, elo: rows[0].elo, username: rows[0].username };
        console.log(`Player ${playerData.username} (${playerData.elo}) searching... Queue size: ${queue.length}`);

        // Prevent playing against yourself in dev (if using same user in 2 tabs)
        // const opponentIndex = queue.findIndex(p => Math.abs(p.elo-playerData.elo)<=100 && p.userId !== playerData.userId);
        
        // For testing purposes, allow playing against yourself if using different sockets
        const opponentIndex = queue.findIndex(p => Math.abs(p.elo-playerData.elo)<=100 && p.socketId !== playerData.socketId);

        if(opponentIndex!==-1){
          const opponent = queue.splice(opponentIndex,1)[0];
          console.log(`Match found: ${playerData.username} vs ${opponent.username}`);
          startGame(playerData, opponent);
        }else {
            queue.push(playerData);
            console.log("Added to queue");
        }
    } catch (err) {
        console.error("Matchmaking error:", err);
    }
  });

  async function startGame(p1,p2){
    try {
        const { rows } = await pool.query("INSERT INTO games (status,current_turn,ranked) VALUES ('active','X',true) RETURNING id");
    const gameId = rows[0].id;
    await pool.query("INSERT INTO game_players (game_id,user_id,symbol) VALUES ($1,$2,'X')", [gameId,p1.userId]);
    await pool.query("INSERT INTO game_players (game_id,user_id,symbol) VALUES ($1,$2,'O')", [gameId,p2.userId]);
    
    // Join both players to the game room
    const s1 = io.sockets.sockets.get(p1.socketId);
    const s2 = io.sockets.sockets.get(p2.socketId);
    if(s1) s1.join(gameId.toString());
    if(s2) s2.join(gameId.toString());

    [p1,p2].forEach(p=>io.to(p.socketId).emit("startGame",{ gameId, player: p===p1?'X':'O' }));
    } catch (err) {
      console.error("StartGame error:", err);
    }
  }

  socket.on("move", async ({ gameId, position }) => {
    const gameRes = await pool.query("SELECT * FROM games WHERE id=$1",[gameId]);
    if(gameRes.rows[0].status!=='active') return;

    const movesRes = await pool.query("SELECT position,player FROM moves WHERE game_id=$1",[gameId]);
    const board = Array(9).fill(null); movesRes.rows.forEach(m=>board[m.position]=m.player);
    if(board[position]) return;

    const playerSymbol = board.filter(v=>v).length%2===0?'X':'O';
    await pool.query("INSERT INTO moves (game_id,player,position) VALUES ($1,$2,$3)", [gameId, playerSymbol, position]);
    board[position] = playerSymbol;

    // Always emit the update first so clients see the move
    io.to(gameId.toString()).emit("update",{position,player:playerSymbol});

    const result = checkWinner(board);
    if(result){
      await pool.query("UPDATE games SET status='finished', winner=$1 WHERE id=$2",[result==='draw'?null:result, gameId]);
      if(gameRes.rows[0].ranked) await updateElo(gameId, result);
      // Emit gameOver after a small delay to ensure update is processed first
      setTimeout(() => {
        io.to(gameId.toString()).emit("gameOver", result);
      }, 100);
    }else{
      const nextTurn = playerSymbol==='X'?'O':'X';
      await pool.query("UPDATE games SET current_turn=$1 WHERE id=$2",[nextTurn,gameId]);
    }
  });

  async function updateElo(gameId,result){
    const playersRes = await pool.query(`
      SELECT u.id, u.elo, gp.symbol FROM game_players gp
      JOIN users u ON u.id=gp.user_id WHERE gp.game_id=$1
    `,[gameId]);
    const playerX = playersRes.rows.find(p=>p.symbol==='X');
    const playerO = playersRes.rows.find(p=>p.symbol==='O');

    const scoreX = result==='draw'?0.5:result==='X'?1:0;
    const scoreO = 1-scoreX;

    const newEloX = calcElo(playerX.elo, expectedScore(playerX.elo, playerO.elo), scoreX);
    const newEloO = calcElo(playerO.elo, expectedScore(playerO.elo, playerX.elo), scoreO);

    await pool.query(`
      UPDATE users SET 
        elo = CASE
          WHEN id=$1 THEN $2
          WHEN id=$3 THEN $4
          ELSE elo
        END,
        games_played = games_played+1,
        wins = wins+$5,
        losses = losses+$6,
        draws = draws+$7
      WHERE id IN ($1,$3)
    `,[playerX.id,newEloX,playerO.id,newEloO,scoreX===1?1:0,scoreX===0?1:0,scoreX===0.5?1:0]);

    const leaderboard = await pool.query(`
      SELECT username,elo,wins,losses,draws FROM users ORDER BY elo DESC LIMIT 10
    `);
    io.emit("leaderboardUpdate", leaderboard.rows);
  }
});

server.listen(3001,()=>console.log("Server running on 3001"));

