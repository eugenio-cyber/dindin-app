const { Pool } = require('pg');
const data = require('./credentials');

const pool = new Pool({
    user: data.user,
    host: 'localhost',
    database: 'dindin',
    password: data.password,
    port: 5432
});

const query = (text, param) => {
    return pool.query(text, param);
}

module.exports = {
    query
}