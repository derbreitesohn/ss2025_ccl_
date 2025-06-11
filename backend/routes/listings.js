const express = require("express");
const router = express.Router();
const listingController = require('../controllers/listingController')
//const authenticationService = require('../services/authentication');

//router.use(authenticationService.authenticateJWT);

router.get('/', listingController.getListings);
router.get('/add', listingController.addListing);
router.post('/add', listingController.saveListing);
router.get('/:id', listingController.getListing);

router.get('/:id/edit', listingController.editListing);
router.post('/:id', listingController.updateListing);

router.post('/:id/delete', listingController.deleteListing);


module.exports = router;