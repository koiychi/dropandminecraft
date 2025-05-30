const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

module.exports = async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');  // Simple test query
    res.status(200).json({ time: result.rows[0].now });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to connect to database' });
  }
};
