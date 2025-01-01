const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');
const authMiddleware = require('../middlewares/authMiddleware');
const authorizeRoles = require('../middlewares/authorizeRoles');

// Retrieve all transactions
router.get('/', authMiddleware.authenticate, authorizeRoles(['admin']), transactionController.getAllTransactions);

// Retrieve all transactions of a given user
router.get('/user/:userEmail', authMiddleware.authenticate, transactionController.getTransactionsByUser);

// Retrieve a specific transaction
router.get('/:id', authMiddleware.authenticate, transactionController.getTransactionById);

// Create a new transaction
router.post('/', authMiddleware.authenticate, transactionController.createTransaction);

// Update an existing transaction
router.put('/:id', authMiddleware.authenticate, transactionController.updateTransaction);

// Delete a transaction
router.delete('/:id', authMiddleware.authenticate, transactionController.deleteTransaction);

module.exports = router;
