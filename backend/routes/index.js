const express = require("express");

const userModel = require("../models/userModel");
const petModel = require("../models/petModel");
const listingModel = require("../models/listingModel");
const favoriteModel = require("../models/favoriteModel");

const userController = require("../controllers/userController");
const petController = require("../controllers/petController");
const listingController = require("../controllers/listingController");
const favoriteController = require("../controllers/favoriteController");
const router = express.Router();
const authenticationService = require('../services/authentication');

router.get("/", (req, res) => {
    res.json({title: "Express"})
});

router.get('/register', userController.loadRegister);
router.post('/register', userController.register);

router.route('/login')
    .get((req, res) => {
        res.render('login');
    })
    .post(async (req, res) => {
        try {
            const users = await userModel.getUsers();
            await authenticationService.authenticateUser(req.body, users, res);
        } catch (err) {
            console.error("Login error:", err);
            res.status(500).json({ error: "Internal server error" });
        }
    });

router.get('/logout', (req, res) => {
    res.cookie('accessToken', '', {maxAge: 0});
    res.redirect('/');
})

module.exports = router;