const userModel = require("../models/userModel"); //calls model to get or modify data
const req = require("express/lib/request");
const res = require("express/lib/response");


function getUsers(req,res,next) {
    userModel.getUsers()
        .then( users => res.json({ users: users }))
        .catch( err => res.sendStatus(500))
}

function getUser(req, res, next) {
    userModel.getUser(req.params.id)
        .then(user => res.json({ users: user }))
        .catch(err => res.status(404).send(err.message));
}

function editUser(req, res, next) {
    userModel.getUser(req.params.id)
        .then(user => res.json({ editUser: user }))
        .catch(err =>  res.sendStatus(500));
}

function updateUser(req, res, next) {
    userModel.updateUser(req.body)
        .then(user => res.json({ users: users }))
        .catch(err =>  res.sendStatus(500));
}

function addUser(req, res, next) {
    const emptyUser = {
        name: '',
        username: '',
        email: '',
        location: '',
        profile_picture: '',
        about: '',
        password: '',
        created_at: new Date(),

    };
    res.json({ user: emptyUser });
}

function saveUser(req, res, next) {
    const newUser = req.body;

    userModel.saveUser(newUser)
        .then(() => res.redirect('/'))
        .catch(err => res.status(500).send('Error saving user: ' + err.message));
}

function loadRegister(req, res, next) {
    const emptyUser = {
        name: '',
        username: '',
        email: '',
        location: '',
        profile_picture: '',
        about: '',
        password: '',
        created_at: new Date(),
    };
    res.json({ user: emptyUser });
}


function deleteUser(req, res, next) {
    userModel.deleteUser(req.params.id) //gets id and passes to model function
        .then(() => res.redirect('/'))
        .catch(err => res.status(500).send('Error deleting user: ' + err.message));
}



function getPets(req, res, next) {
    userModel.getPets()
        .then(pets => res.json({ pets: pets }))
        .catch(err => res.sendStatus(500));
}

function getPet(req, res, next) {
    userModel.getPet(req.params.id)
        .then(pet => res.json({ pets: pet }))
        .catch(err => res.status(404).send(err.message));
}

function editPet(req, res, next) {
    userModel.getPet(req.params.id)
        .then(pet => res.json({ editPet: pet }))
        .catch(err => res.sendStatus(500));
}

function updatePet(req, res, next) {
    userModel.updatePet(req.body)
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

    userModel.savePet(newPet)
        .then(() => res.redirect('/profile'))
        .catch(err => res.status(500).send('Error saving pet: ' + err.message));
}

function deletePet(req, res, next) {
    userModel.deletePet(req.params.id)
        .then(() => res.redirect('/profile'))
        .catch(err => res.status(500).send('Error deleting pet: ' + err.message));
}




module.exports = {
    getUsers,
    getUser,
    editUser,
    updateUser,
    addUser,
    saveUser,
    loadRegister,
    register,
    deleteUser,
    getPets,
    getPet,
    editPet,
    updatePet,
    addPet,
    savePet,
    deletePet
}