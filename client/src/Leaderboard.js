import { useEffect, useState } from "react";
import { socket } from "./socket";

export default function Leaderboard(){
  const [players,setPlayers]=useState([]);
  useEffect(()=>{
    fetch("http://localhost:3001/api/leaderboard")
      .then(res=>{
        if(!res.ok) throw new Error("Failed");
        return res.json();
      })
      .then(setPlayers)
      .catch(err=>console.error("Leaderboard fetch error:", err));
    socket.on("leaderboardUpdate", setPlayers);
    return ()=>socket.off("leaderboardUpdate");
  },[]);
  return(
    <div style={{
      textAlign:"center", 
      marginTop:"20px",
      display: 'flex',
      justifyContent: 'center'
    }}>
      <div style={{
        background: 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(10px)',
        borderRadius: '15px',
        padding: '20px',
        boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        width: '90%',
        maxWidth: '600px',
        border: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <h2 style={{ color: '#fff', marginBottom: '1rem' }}>🏆 Leaderboard</h2>
        <div style={{ overflowX: 'auto' }}>
          <table style={{width:"100%", borderCollapse:"collapse", color: '#ddd'}}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.2)' }}>
                <th style={{ padding: '10px' }}>Rank</th>
                <th style={{ padding: '10px' }}>Player</th>
                <th style={{ padding: '10px' }}>ELO</th>
                <th style={{ padding: '10px' }}>Wins</th>
                <th style={{ padding: '10px' }}>Losses</th>
                <th style={{ padding: '10px' }}>Draws</th>
              </tr>
            </thead>
            <tbody>
              {players.map((p,i)=>(
                <tr key={p.username} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <td style={{ padding: '10px' }}>{i+1}</td>
                  <td style={{ padding: '10px' }}>{p.username}</td>
                  <td style={{ padding: '10px' }}>{p.elo}</td>
                  <td style={{ padding: '10px' }}>{p.wins}</td>
                  <td style={{ padding: '10px' }}>{p.losses}</td>
                  <td style={{ padding: '10px' }}>{p.draws}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
