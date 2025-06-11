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

function register(req, res, next) {
    const newUser = req.body;

    userModel.saveUser(newUser)
        .then(() => res.redirect('/'))
        .catch(err => res.status(500).send('Error saving user: ' + err.message));
}

function deleteUser(req, res, next) {
    userModel.deleteUser(req.params.id) //gets id and passes to model function
        .then(() => res.redirect('/'))
        .catch(err => res.status(500).send('Error deleting user: ' + err.message));
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
}