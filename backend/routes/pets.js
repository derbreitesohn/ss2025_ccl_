const express = require("express");
const router = express.Router();
const petController = require('../controllers/petController')
const authenticationService = require('../services/authentication');
const petModel = require('../models/petModel');
const requireOwner = require('../services/requireOwner');
const ownsPet = requireOwner(id => petModel.getPet(id));

router.use(authenticationService.authenticateJWT);

router.get("/", petController.getPets);
router.get('/add', petController.addPet);
router.post('/add', petController.savePet);
router.get('/:id', ownsPet, petController.getPet);

router.get('/:id/edit', ownsPet, petController.editPet);
router.post('/:id', ownsPet, petController.updatePet);

router.post('/:id/delete', ownsPet, petController.deletePet);

module.exports = router;
