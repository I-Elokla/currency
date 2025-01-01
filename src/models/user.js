const { query, generateId } = require('../utils/db');
const bcrypt = require('bcryptjs');

class User {
    static async findByUsername(username) {
        const users = await query('SELECT * FROM users WHERE username = ?', [username]);
        return users[0];
    }

    static async create(username, password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        const id = generateId();
        await query(
            'INSERT INTO users (id, username, password) VALUES (?, ?, ?)',
            [id, username, hashedPassword]
        );
        return id;
    }

    static async validatePassword(password, hashedPassword) {
        return bcrypt.compare(password, hashedPassword);
    }
}

module.exports = User;