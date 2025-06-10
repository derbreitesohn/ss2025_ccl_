const express = require("express");
const router = express.Router();
const favoriteController = require('../controllers/favoriteController');
const authenticationService = require('../services/authentication');

router.use(authenticationService.authenticateJWT); // applies to all routes below

router.get('/favorites', favoriteController.getFavorites);
router.post('/favorites/:listingId', favoriteController.addFavorite);
router.delete('/favorites/:listingId', favoriteController.removeFavorite);
router.get('/favorites/:listingId/check', favoriteController.isFavorited);

module.exports = router;