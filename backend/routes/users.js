const express = require("express");
const router = express.Router();
const userController = require('../controllers/userController')
const authenticationService = require('../services/authentication');

// Public routes (no auth required)
router.get('/', userController.getUsers);
router.get('/add', userController.addUser);
router.post('/add', userController.saveUser);

// Protected routes (auth required)
router.get('/me', authenticationService.authenticateJWT, userController.getCurrentUser);
router.get('/:id', userController.getUser);
router.get('/:id/edit', userController.editUser);
router.post('/:id', userController.updateUser);
router.post('/:id/delete', userController.deleteUser);

module.exports = router;