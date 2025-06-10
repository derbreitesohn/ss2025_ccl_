const express = require("express");

const userModel = require("../models/userModel");
const petModel = require("../models/petModel");
const listingModel = require("../models/listingModel");

const userController = require("../controllers/userController");
const petController = require("../controllers/petController");
const listingController = require("../controllers/listingController");

const router = express.Router();
const authenticationService = require('../services/authentication');

router.get("/", (req, res) => {
    res.render("index", {title: "Express"})
});

router.get('/register', userController.loadRegister);
router.post('/register', userController.register);
router.post("/", (req, res) => {
    console.log(req.body);
    res.send("Received a POST request");
});