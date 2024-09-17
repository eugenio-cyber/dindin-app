const { Pool } = require("pg");
const { user, host, database, password, port } = require("./credentials");

const pool = new Pool({
  user: user,
  host: host,
  database: database,
  password: password,
  port: port,
});

const query = (text, param) => {
  return pool.query(text, param);
};

module.exports = {
  query,
};
