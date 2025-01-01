const pool = require('../config/database');
const { v4: uuidv4 } = require('uuid');

async function query(sql, params) {
    const [rows] = await pool.execute(sql, params);
    return rows;
}

function generateId() {
    return uuidv4();
}

module.exports = {
    query,
    generateId
};