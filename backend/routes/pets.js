const express = require("express");
const router = express.Router();
const userController = require('../controllers/userController')
const authenticationService = require('../services/authentication');

router.use(authenticationService.authenticateJWT); //runs before every route

router.get('/', userController.getPets);
router.get('/add', userController.addPet);
router.post('/add', userController.savePet);
router.get('/:id', userController.getPet);

router.get('/:id/edit', userController.editPet);
router.post('/:id', userController.updatePet);

router.post('/:id/delete', userController.deletePet);

module.exports = router;