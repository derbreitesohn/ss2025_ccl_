const db = require('../services/database').config;

//liking a listing
function addFavorite(userId, listingId) {
    const sql = "INSERT INTO user_favorites (user_id, listing_id, created_at) VALUES (?, ?, NOW())";
    return new Promise((resolve, reject) => {
        db.query(sql, [userId, listingId], (err, result) => {
            if (err) {
                console.error('Error adding favorite:', err);
                reject(err);
            } else {
                resolve({ success: true, insertId: result.insertId });
            }
        });
    });
}

function removeFavorite(userId, listingId) {
    const sql = "DELETE FROM user_favorites WHERE user_id = ? AND listing_id = ?";
    return new Promise((resolve, reject) => {
        db.query(sql, [userId, listingId], (err, result) => {
            if (err) {
                console.error('Error removing favorite:', err);
                reject(err);
            } else {
                resolve({ success: true, affectedRows: result.affectedRows });
            }
        });
    });
}
//determine where a listing is favorited
function isFavorited(userId, listingId) {
    const sql = "SELECT COUNT(*) AS count FROM user_favorites WHERE user_id = ? AND listing_id = ?";
    return new Promise((resolve, reject) => {
        db.query(sql, [userId, listingId], (err, results) => {
            if (err) {
                console.error('Error checking if favorited:', err);
                reject(err);
            } else {
                resolve(results[0].count > 0);
            }
        });
    });
}

function getFavoritesByUser(userId) {
    const sql = `
        SELECT l.*, uf.created_at as favorited_at
        FROM listings l
        JOIN user_favorites uf ON l.id = uf.listing_id
        WHERE uf.user_id = ?
        ORDER BY uf.created_at DESC`;
    return new Promise((resolve, reject) => {
        db.query(sql, [userId], (err, listings) => {
            if (err) {
                console.error('Error getting user favorites:', err);
                reject(err);
            } else {
                resolve(listings);
            }
        });
    });
}

// Optional: Get favorite count for a user
function getFavoriteCount(userId) {
    const sql = "SELECT COUNT(*) AS count FROM user_favorites WHERE user_id = ?";
    return new Promise((resolve, reject) => {
        db.query(sql, [userId], (err, results) => {
            if (err) {
                console.error('Error getting favorite count:', err);
                reject(err);
            } else {
                resolve(results[0].count);
            }
        });
    });
}

module.exports = {
    addFavorite,
    removeFavorite,
    isFavorited,
    getFavoritesByUser,
    getFavoriteCount
};