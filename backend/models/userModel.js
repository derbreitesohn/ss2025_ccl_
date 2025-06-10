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

// PET FUNCTIONS

let getPets = () => new Promise((resolve, reject) => {
    db.query('SELECT * FROM pets', function (err, pets, fields) {
        if (err) {
            reject(err);
        } else {
            console.log(pets);
            resolve(pets);
        }
    });
});

let getPet = (id) => new Promise((resolve, reject) => {
    db.query('SELECT * FROM pets WHERE id = ?', [id], function (err, pet, fields) {
        if (err) {
            reject(err);
        } else if (pet.length === 0) {
            reject(new Error("Error 404: Pet not found"));
        } else {
            resolve(pet[0]);
        }
    });
});

let savePet = (petData) => new Promise((resolve, reject) => {
    let sql = "INSERT INTO pets (user_id, name, breed, age, gender, weight, color, location, about, created_at, pet_picture) VALUES (" +
        db.escape(petData.user_id) + "," +
        db.escape(petData.name) + "," +
        db.escape(petData.breed) + "," +
        db.escape(petData.age) + "," +
        db.escape(petData.gender) + "," +
        db.escape(petData.weight) + "," +
        db.escape(petData.color) + "," +
        db.escape(petData.location) + "," +
        db.escape(petData.about) + "," +
        db.escape(petData.created_at) + "," +
        db.escape(petData.pet_picture) + ")";

    console.log(sql);
    db.query(sql, function (err, result) {
        if (err) {
            reject(err);
        } else {
            console.log("Pet added with ID: " + result.insertId);
            resolve(petData);
        }
    });
});

let updatePet = (petData) => new Promise((resolve, reject) => {
    let sql = "UPDATE pets SET " +
        "user_id = " + db.escape(petData.user_id) +
        ", name = " + db.escape(petData.name) +
        ", breed = " + db.escape(petData.breed) +
        ", age = " + db.escape(petData.age) +
        ", gender = " + db.escape(petData.gender) +
        ", weight = " + db.escape(petData.weight) +
        ", color = " + db.escape(petData.color) +
        ", location = " + db.escape(petData.location) +
        ", about = " + db.escape(petData.about) +
        ", created_at = " + db.escape(petData.created_at) +
        ", pet_picture = " + db.escape(petData.pet_picture) +
        " WHERE id = " + parseInt(petData.id);

    console.log(sql);
    db.query(sql, function (err, result, fields) {
        if (err) {
            reject(err);
        }
        console.log(result.affectedRows + " rows have been affected");
        resolve(petData);
    });
});

let deletePet = (id) => new Promise((resolve, reject) => {
    const sql = "DELETE FROM pets WHERE id = ?";
    db.query(sql, [id], function (err, result) {
        if (err) {
            reject(err);
        } else {
            console.log("Deleted pet with ID: " + id);
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
    getPets,
    getPet,
    savePet,
    updatePet,
    deletePet,

};