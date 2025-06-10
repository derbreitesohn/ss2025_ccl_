const petModel = require("../models/petModel");
const req = require("express/lib/request");
const res = require("express/lib/response");


function getPets(req, res, next) {
    petModel.getPets()
        .then(pets => res.json({ pets: pets }))
        .catch(err => res.sendStatus(500));
}

function getPet(req, res, next) {
    petModel.getPet(req.params.id)
        .then(pet => res.json({ pets: pet }))
        .catch(err => res.status(404).send(err.message));
}

function editPet(req, res, next) {
    petModel.getPet(req.params.id)
        .then(pet => res.json({ editPet: pet }))
        .catch(err => res.sendStatus(500));
}

function updatePet(req, res, next) {
    petModel.updatePet(req.body)
        .then(pet => res.json({ pets: pet }))
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
        created_at: new Date(),
        pet_picture: ''
    };
    res.json({ pet: emptyPet });
}

function savePet(req, res, next) {
    const newPet = req.body;

    petModel.savePet(newPet)
        .then(() => res.redirect('/profile'))
        .catch(err => res.status(500).send('Error saving pet: ' + err.message));
}

function deletePet(req, res, next) {
    petModel.deletePet(req.params.id)
        .then(() => res.redirect('/profile'))
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