const db = require('../services/database').config;

let getListings = () => new Promise((resolve, reject) => {
    db.query('SELECT * FROM listings', function (err, listings) {
        if (err) {
            reject(err);
        } else {
            resolve(listings);
        }
    });
});

let getListing = (id) => new Promise((resolve, reject) => {
    db.query('SELECT * FROM listings WHERE id = ?', [id], function (err, listing) {
        if (err) {
            reject(err);
        } else if (listing.length === 0) {
            reject(new Error("Error 404: Listing not found"));
        } else {
            resolve(listing[0]);
        }
    });
});

let saveListing = (listingData) => new Promise((resolve, reject) => {
    let sql = "INSERT INTO listings (user_id, pet_id, pet_name, animal, breed, age, gender, weight, color, location, about, photo_url, listing_type) VALUES (" +
        db.escape(listingData.user_id) + "," +
        db.escape(listingData.pet_id) + "," +
        db.escape(listingData.pet_name) + "," +
        db.escape(listingData.animal) + "," +
        db.escape(listingData.breed) + "," +
        db.escape(listingData.age) + "," +
        db.escape(listingData.gender) + "," +
        db.escape(listingData.weight) + "," +
        db.escape(listingData.color) + "," +
        db.escape(listingData.location) + "," +
        db.escape(listingData.about) + "," +
        db.escape(listingData.photo_url) + "," +
        db.escape(listingData.listing_type) + ")";

    db.query(sql, function (err, result) {
        if (err) {
            reject(err);
        } else {
            resolve({ ...listingData, id: result.insertId });
        }
    });
});

let updateListing = (listingData) => new Promise((resolve, reject) => {
    let sql = "UPDATE listings SET " +
        "user_id = " + db.escape(listingData.user_id) +
        ", pet_id = " + db.escape(listingData.pet_id) +
        ", pet_name = " + db.escape(listingData.pet_name) +
        ", animal = " + db.escape(listingData.animal) +
        ", breed = " + db.escape(listingData.breed) +
        ", age = " + db.escape(listingData.age) +
        ", gender = " + db.escape(listingData.gender) +
        ", weight = " + db.escape(listingData.weight) +
        ", color = " + db.escape(listingData.color) +
        ", location = " + db.escape(listingData.location) +
        ", about = " + db.escape(listingData.about) +
        ", photo_url = " + db.escape(listingData.photo_url) +
        ", listing_type = " + db.escape(listingData.listing_type) +
        " WHERE id = " + parseInt(listingData.id);

    db.query(sql, function (err, result) {
        if (err) {
            reject(err);
        } else {
            resolve(listingData);
        }
    });
});

let deleteListing = (id) => new Promise((resolve, reject) => {
    const sql = "DELETE FROM listings WHERE id = ?";
    db.query(sql, [id], function (err, result) {
        if (err) {
            reject(err);
        } else {
            resolve();
        }
    });
});

//based on userId
let getListingsByUserId = (userId) => new Promise((resolve, reject) => {
    db.query('SELECT * FROM listings WHERE user_id = ?', [userId], function (err, listings) {
        if (err) {
            reject(err);
        } else {
            resolve(listings);
        }
    });
});

module.exports = {
    getListings,
    getListing,
    saveListing,
    updateListing,
    deleteListing,
    getListingsByUserId,
};

