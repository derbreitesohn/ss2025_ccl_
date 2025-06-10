const express = require("express");
const router = express.Router();
const userController = require('../controllers/userController')
const authenticationService = require('../services/authentication');

router.use(authenticationService.authenticateJWT); //runs before every route

router.get('/', userController.getListings);
router.get('/add', userController.addListing);
router.post('/add', userController.saveListing);
router.get('/:id', userController.getListing);

router.get('/:id/edit', userController.editListing);
router.post('/:id', userController.updateListing);

router.post('/:id/delete', userController.deleteListing);

module.exports = router;