const express = require("express");
const { Pool } = require("pg");

const app = express();
const port = 3000;

// Configuração do pool de conexão com o PostgreSQL
const pool = new Pool({
  user: "postgres", // Substitua pelo seu usuário do PostgreSQL
  host: "localhost",
  database: "clinica",
  password: "root", // Substitua pela sua senha do PostgreSQL
  port: 5432,
});

// Middleware para interpretar o JSON
app.use(express.json());

// Rota para consultar todos os tutores
app.get("/tutores", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM tutores");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Erro ao consultar tutores");
  }
});

// Rota para consultar todos os pets
app.get("/pets", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM pets");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Erro ao consultar pets");
  }
});

// Rota para consultar todos os pets internados
app.get("/pets/internados", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT p.nome AS pet_nome, i.data_internamento, i.data_alta, i.observacoes
      FROM pets p
      JOIN internamentos i ON p.id = i.pet_id
      WHERE i.data_alta IS NULL
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Erro ao consultar pets internados");
  }
});

// Rota para consultar todos os pets com tratamentos
app.get("/pets/tratamentos", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT p.nome AS pet_nome, t.data_tratamento, t.descricao
      FROM pets p
      JOIN tratamentos t ON p.id = t.pet_id
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Erro ao consultar pets com tratamentos");
  }
});

// Rota para consultar todos os pets que tiveram altas
app.get("/pets/altas", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT p.nome AS pet_nome, i.data_internamento, i.data_alta
      FROM pets p
      JOIN internamentos i ON p.id = i.pet_id
      WHERE i.data_alta IS NOT NULL
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Erro ao consultar pets que tiveram altas");
  }
});

// Inicia a conexão com o banco e o servidor
pool
  .connect()
  .then(() => {
    app.listen(port, () => {
      console.log("conectado com sucesso ao banco de dados");
      console.log(`Servidor rodando em http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.error("Erro ao conectar ao banco de dados", err);
    process.exit(1); // Encerra o processo caso a conexão falhe
  });
