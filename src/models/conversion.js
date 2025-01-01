const { query, generateId } = require('../utils/db');

class Conversion {
    static async save(userId, baseRate, targetRate, baseValue, convertedValue, date) {
        const id = generateId();
        await query(
            'INSERT INTO conversions (id, user_id, base_rate, target_rate, base_value, converted_value, conversion_date) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [id, userId, baseRate, targetRate, baseValue, convertedValue, date]
        );
        return id;
    }

    static async getByUserId(userId) {
        return query(
            'SELECT * FROM conversions WHERE user_id = ? ORDER BY conversion_date DESC',
            [userId]
        );
    }

    static async remove(id, userId) {
        const result = await query(
            'DELETE FROM conversions WHERE id = ? AND user_id = ?',
            [id, userId]
        );
        return result.affectedRows > 0;
    }
}

module.exports = Conversion;