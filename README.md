# 🎮 Tic-Tac-Toe Online: The Ultimate Neon Challenge
A high-performance, real-time multiplayer Tic-Tac-Toe experience. Built with the **PERN** stack (PostgreSQL, Express, React, Node.js), this application features a sleek glassmorphic UI, competitive matchmaking, and an Elo-based ranking system.

---

## ✨ Features

- 🌐 **Real-Time Multiplayer**: Seamless gameplay powered by **Socket.io**.
- 🏆 **Elo Rating System**: Competitive ranking that adjusts based on your performance.
- 📊 **Live Leaderboard**: Real-time updates for the top 10 global players.
- 🤝 **Smart Matchmaking**: Finds opponents within ±100 Elo range automatically.
- 🔐 **Secure Authentication**: JWT-based auth with encrypted password storage.
- 📱 **Responsive Design**: Optimized for both Desktop and Mobile browsers.
- ✨ **Modern UI**: Glassmorphism, smooth transitions, and a premium neon aesthetic.

---

## 🚀 Tech Stack

### Frontend
- **React.js**: Functional components with Hooks.
- **Socket.io-client**: For bi-directional event-based communication.
- **Vanilla CSS**: Custom design system with glassmorphic elements.
- **Vercel**: Optimized frontend deployment.

### Backend
- **Node.js & Express**: Scalable REST APIs and Socket management.
- **Socket.io**: Real-time game state synchronization.
- **PostgreSQL**: Robust relational data storage.
- **JWT & Bcrypt**: Secure session management and hashing.
- **Render**: Backend and Database hosting.

---

## 🛠️ Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/philipmagar/tictactoe.git
cd tictactoe
```

### 2. Database Configuration
Ensure you have **PostgreSQL** installed. Run the schema migrations:
```bash
cd server
# If using psql CLI:
psql -U postgres -f database.sql
```

### 3. Server Setup
```bash
cd server
npm install
```
Create a `.env` file in the `/server` directory:
```env
DATABASE_URL=postgres://user:password@localhost:5432/tictactoe
JWT_SECRET=your_super_secret_key
PORT=3001
```
Start the server:
```bash
npm start
```

### 4. Client Setup
```bash
cd ../client
npm install
```
Start the development server:
```bash
npm start
```
The app will be running at `http://localhost:3000`.

---

## 🎮 How to Play

1. **Sign Up**: Create your unique username and secure password.
2. **Find Match**: Click the **"Find Match"** button. The system will pair you with a compatible opponent.
3. **The Game**: 'X' goes first. The goal is to get three of your symbols in a row (horizontal, vertical, or diagonal).
4. **Rank Up**: Winning matches increases your Elo. Check the **Leaderboard** to see your standing!

---

## 🎨 UI Showcase

*(Add your screenshots here!)*

> **Note**: This project uses a custom glassmorphic design system for a premium feel.

---

## 🤝 Contributing

Contributions are welcome!
1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---
