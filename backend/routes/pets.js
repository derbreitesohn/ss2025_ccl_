const express = require("express");
const router = express.Router();
const petController = require('../controllers/petController')
//const authenticationService = require('../services/authentication');

//router.use(authenticationService.authenticateJWT); //runs before every route

router.get("/", petController.getPets);
router.get('/add', petController.addPet);
router.post('/add', petController.savePet);
router.get('/:id', petController.getPet);

router.get('/:id/edit', petController.editPet);
router.post('/:id', petController.updatePet);

router.post(':id/delete', petController.deletePet);

module.exports = router;