const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');
const { registerLimiter } = require('../middlewares/rateLimitMiddleware');

// Retrieve all users
router.get('/', authMiddleware.authenticate, userController.getAllUsers);

// Retrieve logged-in user details
router.get('/me', authMiddleware.authenticate, userController.getCurrentUser);

// retrieve contacts of user
router.get('/:id/contacts', authMiddleware.authenticate, userController.getUserContacts);

// Add contact to a user
router.post('/:id/contacts', authMiddleware.authenticate, userController.addUserContact);

// Retrieve a specific user
router.get('/:id', authMiddleware.authenticate, userController.getUserById);

// Create a new user
router.post('/', registerLimiter, userController.createUser);

// Update an existing user
router.put('/:id', authMiddleware.authenticate, userController.updateUser);

// Delete a contact from a user
router.delete('/:id/contacts/:contactId', authMiddleware.authenticate, userController.deleteUserContact);

// Delete a user
router.delete('/:id', authMiddleware.authenticate, userController.deleteUser);


module.exports = router;
