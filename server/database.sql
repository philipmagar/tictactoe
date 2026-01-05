CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    elo INTEGER DEFAULT 1200,
    games_played INTEGER DEFAULT 0,
    wins INTEGER DEFAULT 0,
    losses INTEGER DEFAULT 0,
    draws INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS games (
    id SERIAL PRIMARY KEY,
    status VARCHAR(20) DEFAULT 'active', -- 'active' or 'finished'
    current_turn VARCHAR(1) DEFAULT 'X',
    ranked BOOLEAN DEFAULT TRUE,
    winner VARCHAR(1), -- 'X', 'O', or NULL for draw
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS game_players (
    id SERIAL PRIMARY KEY,
    game_id INTEGER REFERENCES games(id),
    user_id INTEGER REFERENCES users(id),
    symbol VARCHAR(1) NOT NULL -- 'X' or 'O'
);

CREATE TABLE IF NOT EXISTS moves (
    id SERIAL PRIMARY KEY,
    game_id INTEGER REFERENCES games(id),
    player VARCHAR(1) NOT NULL, -- 'X' or 'O'
    position INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
