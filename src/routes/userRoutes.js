const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');

// Retrieve all users
router.get('/', authMiddleware.authenticate, userController.getAllUsers);

// Retrieve a specific user
router.get('/:id', authMiddleware.authenticate, userController.getUserById);

// Create a new user
router.post('/', userController.createUser);

// Update an existing user
router.put('/:id', authMiddleware.authenticate, userController.updateUser);

// Delete a user
router.delete('/:id', authMiddleware.authenticate, userController.deleteUser);

module.exports = router;
