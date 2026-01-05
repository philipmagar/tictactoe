const router = require("express").Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("../db");

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

router.post("/register", async (req, res) => {
  const { username, password } = req.body;
  const hash = await bcrypt.hash(password, 10);

  try {
    await pool.query(
      "INSERT INTO users (username, password_hash) VALUES ($1, $2)",
      [username, hash]
    );
    res.sendStatus(201);
  } catch {
    res.status(400).json({ error: "Username taken" });
  }
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const { rows } = await pool.query("SELECT * FROM users WHERE username=$1", [username]);
  if (!rows.length) return res.sendStatus(401);

  const valid = await bcrypt.compare(password, rows[0].password_hash);
  if (!valid) return res.sendStatus(401);

  const token = jwt.sign({ userId: rows[0].id }, JWT_SECRET, { expiresIn: "1d" });
  res.json({ token, username: rows[0].username, elo: rows[0].elo });
});

module.exports = router;
