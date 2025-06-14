const db = require('../services/database').config;

let saveMessage = (senderId, receiverId, content) => new Promise((resolve, reject) => {
    const sql = "INSERT INTO messages (sender_id, receiver_id, content) VALUES (?, ?, ?)";
    db.query(sql, [senderId, receiverId, content], (err, result) => {
        if (err) reject(err);
        else resolve(result.insertId);
    });
});

let getRecentChats = (userId) => new Promise((resolve, reject) => {
    const sql = `
        SELECT m1.*, u.username AS other_username FROM messages m1
                                                           JOIN (
            SELECT
                LEAST(sender_id, receiver_id) AS user1,
                GREATEST(sender_id, receiver_id) AS user2,
                MAX(id) AS max_id
            FROM messages
            WHERE sender_id = ? OR receiver_id = ?
            GROUP BY user1, user2
        ) m2 ON m1.id = m2.max_id
                                                           JOIN user u ON u.id = IF(m1.sender_id = ?, m1.receiver_id, m1.sender_id)
        WHERE m1.sender_id = ? OR m1.receiver_id = ?
        ORDER BY m1.timestamp DESC
            LIMIT 20
    `;
    db.query(sql, [userId, userId, userId, userId, userId], (err, results) => {
        if (err) reject(err);
        else resolve(results);
    });
});

let getChatHistory = (userId, otherUserId) => new Promise((resolve, reject) => {
    const sql = `
        SELECT * FROM messages
        WHERE (sender_id = ? AND receiver_id = ?)
           OR (sender_id = ? AND receiver_id = ?)
        ORDER BY timestamp ASC
    `;
    db.query(sql, [userId, otherUserId, otherUserId, userId], (err, results) => {
        if (err) reject(err);
        else resolve(results);
    });
});

module.exports = { saveMessage, getRecentChats, getChatHistory };