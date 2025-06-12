const { Pool } = require("pg");

const pool = new Pool({
  user: "timetracker",
  host: "127.0.0.1",
  database: "timetracker",
  password: "timetracker",
  port: 5432,
});

module.exports = pool;
