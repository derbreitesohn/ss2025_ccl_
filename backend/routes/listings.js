const express = require("express");
const router = express.Router();
const listingController = require('../controllers/listingController')
const authenticationService = require('../services/authentication');

router.use(authenticationService.authenticateJWT); //runs before every route

router.get('/listings', listingController.getListings);
router.get('/listings/add', listingController.addListing);
router.post('/listings/add', listingController.saveListing);
router.get('/listings/:id', listingController.getListing);

router.get('/listings/:id/edit', listingController.editListing);
router.post('/listings/:id', listingController.updateListing);

router.post('/listings/:id/delete', listingController.deleteListing);


module.exports = router;