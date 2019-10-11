const Pool = require('pg').Pool
const database = require('database');

const pool = new Pool({
  user: database.user,
  host: database.host,
  database: database.database,
  password: database.password,
  port: database.port
});

module.exports = pool;