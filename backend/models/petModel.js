const db = require('../services/database').config;


let getPets = () => new Promise((resolve, reject) => {
    db.query('SELECT * FROM pets', function (err, pets, fields) {
        if (err) {
            reject(err);
        } else {
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

    let sql = "INSERT INTO pets (user_id, name, pet_type, animal, breed, age, gender, weight, color, location, about, pet_picture) VALUES (" +
        db.escape(petData.user_id) + "," +
        db.escape(petData.name) + "," +
        db.escape(petData.pet_type) + "," +
        db.escape(petData.animal) + "," +
        db.escape(petData.breed) + "," +
        db.escape(petData.age) + "," +
        db.escape(petData.gender) + "," +
        db.escape(petData.weight) + "," +
        db.escape(petData.color) + "," +
        db.escape(petData.location) + "," +
        db.escape(petData.about) + "," +
        db.escape(petData.pet_picture) + ")";

    db.query(sql, function (err, result) {
        if (err) {
            reject(err);
        } else {
            resolve({ ...petData, id: result.insertId });
        }
    });
});

let updatePet = (petData) => new Promise((resolve, reject) => {

    let sql = "UPDATE pets SET " +
        "user_id = " + db.escape(petData.user_id) +
        ", name = " + db.escape(petData.name) +
        ", pet_type = " + db.escape(petData.pet_type) +
        ", animal = " + db.escape(petData.animal) +
        ", breed = " + db.escape(petData.breed) +
        ", age = " + db.escape(petData.age) +
        ", gender = " + db.escape(petData.gender) +
        ", weight = " + db.escape(petData.weight) +
        ", color = " + db.escape(petData.color) +
        ", location = " + db.escape(petData.location) +
        ", about = " + db.escape(petData.about) +
        ", pet_picture = " + db.escape(petData.pet_picture) +
        " WHERE id = " + parseInt(petData.id);

    db.query(sql, function (err, result, fields) {
        if (err) {
            return reject(err);
        }
        resolve(petData);
    });
});

let deletePet = (id) => new Promise((resolve, reject) => {
    const sql = "DELETE FROM pets WHERE id = ?";
    db.query(sql, [id], function (err, result) {
        if (err) {
            reject(err);
        } else {
            resolve();
        }
    });
});

module.exports = {
    getPets,
    getPet,
    savePet,
    updatePet,
    deletePet,
}
