# Tic-Tac-Toe Online

A real-time multiplayer Tic-Tac-Toe game built with the PERN stack (PostgreSQL, Express, React, Node.js). This application features live matchmaking, an Elo rating system, and a global leaderboard.

## Features

- **Real-Time Gameplay**: Play against other users instantly using Socket.io.
- **Matchmaking System**: Automatically finds opponents with a similar Elo rating (+/- 100).
- **Elo Rating**: Competitive ranking system that updates after every ranked match.
- **Leaderboard**: Live view of the top 10 players by Elo.
- **User Authentication**: Secure signup and login functionality.
- **Game History**: Detailed tracking of games, moves, and outcomes in PostgreSQL.

## Tech Stack

- **Frontend**: React, Socket.io Client
- **Backend**: Node.js, Express, Socket.io
- **Database**: PostgreSQL
- **Security**: JWT (JSON Web Tokens), bcrypt (Password Hashing)

## Prerequisites

- Node.js (v14 or higher)
- PostgreSQL

## Setup & Installation

### 1. Database Setup

Create a PostgreSQL database and run the schema script found in `server/database.sql`.

```sql
psql -U postgres
CREATE DATABASE tictactoe_db;
\c tictactoe_db
\i server/database.sql
```

### 2. server Setup

Navigate to the server directory and install dependencies:

```bash
cd server
npm install
```

Create a `.env` file in the `server` directory with the following variables:

```env
# Example .env configuration
DB_USER=your_postgres_user
DB_PASSWORD=your_postgres_password
DB_HOST=localhost
DB_PORT=5432
DB_NAME=tictactoe_db
JWT_SECRET=your_super_secret_jwt_key
```

Start the server:

```bash
npm start
# Server runs on http://localhost:3001
```

### 3. Client Setup

Navigate to the client directory and install dependencies:

```bash
cd client
npm install
```

Start the React application:

```bash
npm start
# Client runs on http://localhost:3000
```

## How to Play

1.  **Register/Login**: Create an account to start tracking your score.
2.  **Find Match**: Click the "Find Match" or "Play" button to enter the matchmaking queue.
3.  **Play**: You will be paired with an opponent close to your rank. Win games to increase your Elo!
4.  **Leaderboard**: Check the leaderboard to see where you stand among the top players.
