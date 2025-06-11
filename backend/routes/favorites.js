const express = require("express");
const router = express.Router();
const favoriteController = require('../controllers/favoriteController');
//const authenticationService = require('../services/authentication');

//router.use(authenticationService.authenticateJWT); // applies to all routes below

router.get('/', favoriteController.getFavorites);
router.post('/:listingId', favoriteController.addFavorite);
router.delete('/:listingId', favoriteController.removeFavorite);
router.get('/:listingId/check', favoriteController.isFavorited);

module.exports = router;