const Pool = require('pg').Pool

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'geraldo',
  password: 'idmf7798',
  port: 5432
});

module.exports = pool;