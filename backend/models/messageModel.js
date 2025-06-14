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
        SELECT m.*, u.username AS other_username
        FROM messages m
                 JOIN user u ON u.id = IF(m.sender_id = ?, m.receiver_id, m.sender_id)
        WHERE m.sender_id = ? OR m.receiver_id = ?
        ORDER BY m.timestamp DESC
            LIMIT 20
    `;
    db.query(sql, [userId, userId, userId], (err, results) => {
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