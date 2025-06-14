const listingModel = require("../models/listingModel");
const req = require("express/lib/request");
const res = require("express/lib/response");


function getListings(req, res, next) {
    listingModel.getListings()
        .then(listings => res.json({ listings }))
        .catch(err => res.sendStatus(500));
}

function getListing(req, res, next) {
    listingModel.getListing(req.params.id)
        .then(listing => res.json({ listing }))
        .catch(err => res.status(404).send(err.message));
}

function editListing(req, res, next) {
    listingModel.getListing(req.params.id)
        .then(listing => res.json( listing))
        .catch(err => res.sendStatus(500));
}

function updateListing(req, res, next) {
    listingModel.updateListing(req.body)
        .then(listing => res.json({ listing }))
        .catch(err => res.sendStatus(500));
}

function addListing(req, res, next) {
    const emptyListing = {
       // user_id: '',
        pet_name: '',
        breed: '',
        age: '',
        gender: '',
        weight: '',
        color: '',
        location: '',
        about: '',
        photo_url: '',
        listing_type: ''
    };
    res.json(emptyListing);
}

function saveListing(req, res, next) {
    console.log("🔥 DEBUG: req.body = ", req.body);
    if (!req.body) {
        return res.status(400).json({ error: "No body received" });
    }

    const newListing = req.body;

    listingModel.saveListing(newListing)
        .then(() => res.json({ register: "DONE" }))
        .catch(err => res.status(500).send('Error saving listing: ' + err.message));
}


function deleteListing(req, res, next) {
    listingModel.deleteListing(req.params.id)
        .then(() => res.json({register:"DONE"}))
        .catch(err => res.status(500).send('Error deleting listing: ' + err.message));
}

module.exports = {
    getListings,
    getListing,
    editListing,
    updateListing,
    addListing,
    saveListing,
    deleteListing
};
