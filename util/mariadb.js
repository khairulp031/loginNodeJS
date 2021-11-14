const env = require('node-env-file');
env('.env');

const mariadb = require('mariadb');
const pool = mariadb.createPool({
    connectionLimit: process.env.MARIADB_CONNECTION_LIMIT,
    host: process.env.MARIADB_HOST,
    port: process.env.MARIADB_PORT,
    user: process.env.MARIADB_USER,
    password: process.env.MARIADB_PASSWORD,
    database: process.env.MARIADB_DB
});

module.exports.pool = pool;
