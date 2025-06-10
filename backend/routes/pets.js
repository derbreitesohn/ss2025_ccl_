const express = require("express");
const router = express.Router();
const petController = require('../controllers/petController')
const authenticationService = require('../services/authentication');

router.use(authenticationService.authenticateJWT); //runs before every route

router.get('/pets', petController.getPets);
router.get('/pets/add', petController.addPet);
router.post('/pets/add', petController.savePet);
router.get('/pets/:id', petController.getPet);

router.get('/pets/:id/edit', petController.editPet);
router.post('/pets/:id', petController.updatePet);

router.post('/pets/:id/delete', petController.deletePet);

module.exports = router;