const Pool = require('pg').Pool;

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'crorepati',
    password: 'anshul',
    port: 5432,
})