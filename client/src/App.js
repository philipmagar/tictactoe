import { useState, useEffect } from "react";
import Board from "./Board";
import Leaderboard from "./Leaderboard";
import Auth from "./Auth";
import { socket } from "./socket";
import SinglePlayerBoard from "./SinglePlayerBoard";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const username = localStorage.getItem("username");
    if (token && username) {
      setUser({ username });
      connectSocket(token);
    }
  }, []);

  const connectSocket = (token) => {
    socket.auth = { token };
    socket.connect();
  };

  const handleLogin = (userData) => {
    setUser({ username: userData.username });
    connectSocket(userData.token);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    setUser(null);
    socket.disconnect();
  };

  const [mode, setMode] = useState(null); // 'single', 'multi', or null

  const handleModeSelect = (selectedMode) => {
    setMode(selectedMode);
    if (selectedMode === 'multi' && user?.token) {
        // Ensure socket is connected if selecting multiplayer
        if (!socket.connected) socket.connect();
    }
  };

  const handleBackToMenu = () => {
    setMode(null);
    if (socket.connected) {
        // Optional: disconnect socket or leave queue if needed
        // socket.disconnect(); 
    }
  };

  return (
    <div className="app-container">
      <header>
        <h1>Tic Tac Toe</h1>
        {user && (
          <div className="user-info">
            <span>Welcome, <b>{user.username}</b></span>
            <button onClick={handleLogout} className="logout-btn">Logout</button>
          </div>
        )}
      </header>
      
      <main>
        {!user ? (
          <Auth onLogin={handleLogin} />
        ) : (
          <>
            {!mode && (
              <div className="mode-selection">
                <h2>Choose Game Mode</h2>
                <div className="mode-buttons">
                    <button className="mode-btn" onClick={() => handleModeSelect('single')}>
                        🤖 Single Player
                    </button>
                    <button className="mode-btn" onClick={() => handleModeSelect('multi')}>
                        ⚔️ Multiplayer
                    </button>
                </div>
              </div>
            )}

            {mode === 'single' && (
                <SinglePlayerBoard onBack={handleBackToMenu} />
            )}

            {mode === 'multi' && (
              <div className="game-container">
                <div className="multiplayer-wrapper">
                    <button className="back-btn-small" onClick={handleBackToMenu}>← Back</button>
                    <Board />
                </div>
                <Leaderboard />
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}

export default App;