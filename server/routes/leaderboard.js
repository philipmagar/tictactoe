const router = require("express").Router();
const pool = require("../db");

router.get("/", async (req, res) => {
  const { rows } = await pool.query(`
    SELECT username, elo, wins, losses, draws, games_played
    FROM users
    ORDER BY elo DESC
    LIMIT 10
  `);
  res.json(rows);
});

module.exports = router;
