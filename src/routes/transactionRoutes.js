const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');
const authMiddleware = require('../middlewares/authMiddleware');
const authorizeRoles = require('../middlewares/authorizeRoles');
const validate = require('../middlewares/validate');
const { transactionCreateSchema } = require('../validations/transactionValidations');

// Retrieve all transactions (ADMIN ONLY)
router.get('/', authMiddleware.authenticate, authorizeRoles(['admin']), transactionController.getAllTransactions);

// Retrieve current user's transactions
router.get('/me', authMiddleware.authenticate, transactionController.getCurrentUserTransactions);

// Retrieve all transactions of a given user (ADMIN ONLY)
router.get('/user/:userEmail', authMiddleware.authenticate, authorizeRoles(['admin']), transactionController.getTransactionsByUser);

// Retrieve a specific transaction
router.get('/:id', authMiddleware.authenticate, transactionController.getTransactionById);

// Create a new transaction
router.post('/', authMiddleware.authenticate, validate(transactionCreateSchema), transactionController.createTransaction);

// Update an existing transaction
router.put('/:id', authMiddleware.authenticate, transactionController.updateTransaction);

// Delete a transaction
router.delete('/:id', authMiddleware.authenticate, transactionController.deleteTransaction);

module.exports = router;
