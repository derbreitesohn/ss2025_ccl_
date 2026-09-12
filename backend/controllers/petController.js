const petModel = require("../models/petModel");
const req = require("express/lib/request");
const res = require("express/lib/response");

function getPets(req, res, next) {
    petModel.getPets()
        .then(pets => res.json(pets.filter(pet => String(pet.user_id) === String(req.user.id))))
        .catch(err => res.sendStatus(500));
}

function getPet(req, res, next) {
    if (req.record) return res.json(req.record);
    petModel.getPet(req.params.id)
        .then(pet => res.json(pet))
        .catch(err => res.status(404).send(err.message));
}

function editPet(req, res, next) {
    if (req.record) return res.json(req.record);
    petModel.getPet(req.params.id)
        .then(pet => res.json(pet))
        .catch(err => res.sendStatus(500));
}

function updatePet(req, res, next) {
    petModel.updatePet({ ...req.record, ...req.body, id: req.params.id, user_id: req.user.id })
        .then(pet => res.json( pet))
        .catch(err => res.sendStatus(500));
}

function addPet(req, res, next) {
    const emptyPet = {
        user_id: '',
        name: '',
        pet_type: '',
        animal: '',
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
    if (typeof req.body?.name !== 'string' || !req.body.name.trim() || typeof req.body?.animal !== 'string' || !req.body.animal.trim()) {
        return res.status(400).json({ error: 'Please enter a name and animal.' });
    }
    const newPet = { ...req.body, user_id: req.user.id, animal: req.body.animal.trim().toLowerCase(), about: req.body.about || '', pet_picture: req.body.pet_picture || '' };

    petModel.savePet(newPet)
        .then(pet => res.json({ register: "DONE", pet }))
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
