const express = require("express");
const router = express.Router();
const listingController = require('../controllers/listingController')
const authenticationService = require('../services/authentication');
const listingModel = require('../models/listingModel');
const requireOwner = require('../services/requireOwner');
const ownsListing = requireOwner(id => listingModel.getListing(id));

router.get('/', listingController.getListings);
router.get('/add', authenticationService.authenticateJWT, listingController.addListing);
router.post('/add', authenticationService.authenticateJWT, listingController.saveListing);
router.get('/mine', authenticationService.authenticateJWT, listingController.getMyListings); //get listing from current user
router.get('/:id', listingController.getListing);

router.use(authenticationService.authenticateJWT);

router.get('/:id/edit', ownsListing, listingController.editListing);
router.post('/:id', ownsListing, listingController.updateListing);
router.post('/:id/delete', ownsListing, listingController.deleteListing);

module.exports = router;
