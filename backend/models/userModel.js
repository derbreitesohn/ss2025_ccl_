const db = require('../services/database').config;
const bcrypt = require('bcrypt');

let getUsers = () => new Promise((resolve, reject) => {
    db.query('SELECT * FROM user', function (err, users, fields) {
        if (err) {
            reject(err);
        } else {
            console.log(users);
            resolve(users);
        }
    });
});


let getUser = (id) => new Promise((resolve, reject) => {
    db.query('SELECT * FROM user WHERE id = ?', [id], function (err, user, fields) {
        if (err) {
            reject(err);
        } else if (user.length === 0) {
            reject(new Error("Error 404: User not found"));
        } else {
            resolve(user[0]);
        }
    });
});

let saveUser = (userData) => new Promise(async(resolve, reject) => {
    userData.password = await bcrypt.hash(userData.password, 10);

    let sql = "INSERT INTO user (name, username, email, location, profile_picture, about, created_at, password) VALUES (" +
        db.escape(userData.name) + "," +
        db.escape(userData.username) + "," +
        db.escape(userData.email) + "," +
        db.escape(userData.location) + "," +
        db.escape(userData.profile_picture) + "," +
        db.escape(userData.about) + "," +
        db.escape(userData.created_at) + "," +
        db.escape(userData.password) + ")";

    console.log(sql);
    db.query(sql, function (err, result) { //sends sql command to the db, callback function with two arguments
        if (err) {
            reject(err); //reject promise
        } else {
            console.log("User added with ID: " + result.insertId); //contains id of newly inserted user
            resolve(userData);
        }
    });
});

let updateUser = (userData) => new Promise(async (resolve, reject) => {
    userData.password = await bcrypt.hash(userData.password, 10);

    let sql = "UPDATE user SET " +
        "name = " + db.escape(userData.name) +
        ", username = " + db.escape(userData.username) +
        ", email = " + db.escape(userData.email) +
        ", location = " + db.escape(userData.location) +
        ", profile_picture = " + db.escape(userData.profile_picture) +
        ", about = " + db.escape(userData.about) +
        ", created_at = " + db.escape(userData.created_at) +
        ", password = " + db.escape(userData.password) +
        " WHERE id = " + parseInt(userData.id);
    console.log(sql);
    db.query(sql, function (err, result, fields) {
        if (err) {
            reject(err);
        }
        console.log(result.affectedRows + " rows have been affected");
        resolve(userData);
    });
});

let deleteUser = (id) => new Promise((resolve, reject) => {
    const sql = "DELETE FROM user WHERE id = ?";
    db.query(sql, [id], function (err, result) {
        if (err) {
            reject(err);
        } else {
            console.log("Deleted user with ID: " + id);
            resolve();
        }
    });
});







module.exports = {
    getUsers,
    getUser,
    saveUser,
    updateUser,
    deleteUser,
};