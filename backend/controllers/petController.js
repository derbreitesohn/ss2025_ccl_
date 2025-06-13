const petModel = require("../models/petModel");
const req = require("express/lib/request");
const res = require("express/lib/response");


function getPets(req, res, next) {
    petModel.getPets()
        .then(pets => res.json( pets))
        .catch(err => res.sendStatus(500));
}

function getPet(req, res, next) {
    petModel.getPet(req.params.id)
        .then(pet => res.json(pet))
        .catch(err => res.status(404).send(err.message));
}

function editPet(req, res, next) {
    petModel.getPet(req.params.id)
        .then(pet => res.json(pet))
        .catch(err => res.sendStatus(500));
}

function updatePet(req, res, next) {
    petModel.updatePet(req.body)
        .then(pet => res.json( pet))
        .catch(err => res.sendStatus(500));
}

function addPet(req, res, next) {
    const emptyPet = {
        user_id: '',
        name: '',
        breed: '',
        age: '',
        gender: '',
        weight: '',
        color: '',
        location: '',
        about: '',
        pet_picture: ''
    };
    res.json(emptyPet);
}

function savePet(req, res, next) {
    const newPet = req.body;

    petModel.savePet(newPet)
        .then(() => res.json({register:"DONE"}))
        .catch(err => res.status(500).send('Error saving pet: ' + err.message));
}

function deletePet(req, res, next) {
    petModel.deletePet(req.params.id)
        .then(() => res.json({register:"DONE"}))
        .catch(err => res.status(500).send('Error deleting pet: ' + err.message));
}

module.exports = {
    getPets,
    getPet,
    editPet,
    updatePet,
    addPet,
    savePet,
    deletePet,
}