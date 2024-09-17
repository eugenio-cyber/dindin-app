const { Pool } = require("pg");
const { url, user, host, database, password, port } = require("./credentials");

const pool = new Pool({
  url: url,
  user: user,
  host: host,
  database: database,
  password: password,
  ssl: true,
  port: port,
});

const query = (text, param) => {
  return pool.query(text, param);
};

module.exports = {
  query,
};
