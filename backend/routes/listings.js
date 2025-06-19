const express = require("express");
const router = express.Router();
const listingController = require('../controllers/listingController')
const authenticationService = require('../services/authentication');

router.get('/', listingController.getListings);
router.get('/add', listingController.addListing);
router.post('/add', listingController.saveListing);
router.get('/mine', authenticationService.authenticateJWT, listingController.getMyListings);
router.get('/:id', listingController.getListing);

router.use(authenticationService.authenticateJWT);

router.get('/:id/edit', listingController.editListing);
router.post('/:id', listingController.updateListing);
router.post('/:id/delete', listingController.deleteListing);

module.exports = router;