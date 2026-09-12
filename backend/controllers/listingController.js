const listingModel = require("../models/listingModel");
const petModel = require("../models/petModel");
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
    if (req.record) return res.json(req.record);
    listingModel.getListing(req.params.id)
        .then(listing => res.json( listing))
        .catch(err => res.sendStatus(500));
}

function updateListing(req, res, next) {
    listingModel.updateListing({ ...req.record, ...req.body, id: req.params.id, user_id: req.user.id, pet_id: req.record.pet_id })
        .then(listing => res.json({ listing }))
        .catch(err => res.sendStatus(500));
}

function addListing(req, res, next) {
    const emptyListing = {
        user_id: '',
        pet_id: '',
        pet_name: '',
        animal: '',
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

async function saveListing(req, res, next) {
    if (typeof req.body?.pet_name !== 'string' || !req.body.pet_name.trim() ||
        typeof req.body?.animal !== 'string' || !req.body.animal.trim() ||
        !['adoption', 'playdate'].includes(req.body.listing_type)) {
        return res.status(400).json({ error: 'Please enter a pet name, animal, and listing type.' });
    }
    let petId = req.body.pet_id;
    if (petId == null || petId === '') petId = null;
    else if (!Number.isSafeInteger(Number(petId)) || Number(petId) <= 0) {
        return res.status(400).json({ error: 'Please choose a valid pet.' });
    }
    try {
        if (petId !== null) {
            const pet = await petModel.getPet(petId);
            if (String(pet.user_id) !== String(req.user.id)) {
                return res.status(403).json({ error: 'Please choose one of your own pets.' });
            }
        }
        const listing = await listingModel.saveListing({ ...req.body,
            user_id: req.user.id, pet_id: petId, animal: req.body.animal.trim().toLowerCase(),
        });
        res.json({ register: 'DONE', listing });
    } catch (err) {
        if (err.message?.includes('404')) return res.status(404).json({ error: 'That pet no longer exists.' });
        next(err);
    }
}


function deleteListing(req, res, next) {
    listingModel.deleteListing(req.params.id)
        .then(() => res.json({register:"DONE"}))
        .catch(err => res.status(500).send('Error deleting listing: ' + err.message));
}

function getMyListings(req, res, next) {
    const userId = req.user.id;
    listingModel.getListingsByUserId(userId)
        .then(listings => res.json({ listings }))
        .catch(err => res.sendStatus(500));
}

module.exports = {
    getListings,
    getListing,
    editListing,
    updateListing,
    addListing,
    saveListing,
    deleteListing,
    getMyListings,
};
