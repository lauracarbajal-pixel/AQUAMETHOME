require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Ejemplo: listar casas
app.get('/casas', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM casas');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al consultar casas' });
  }
});

app.get('/lecturas', async (req, res) => {
  try {
    const { rows } = await pool.query(
      'SELECT * FROM lecturas ORDER BY 1 DESC LIMIT 100'
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Error al consultar lecturas' });
  }
});

app.get('/alertas', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM alertas');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Error al consultar alertas' });
  }
});

app.listen(process.env.PORT, '0.0.0.0', () =>
  console.log(`API corriendo en puerto ${process.env.PORT}`)
);