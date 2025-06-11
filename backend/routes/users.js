const express = require("express");
const router = express.Router();
const userController = require('../controllers/userController')
//const authenticationService = require('../services/authentication');

//router.use(authenticationService.authenticateJWT); //runs before every route

router.get('/', userController.getUsers);
router.get('/add', userController.addUser);
router.post('/add', userController.saveUser);
router.get('/:id', userController.getUser);

router.get('/:id/edit', userController.editUser);
router.post('/:id', userController.updateUser);

router.post('/:id/delete', userController.deleteUser);

module.exports = router;