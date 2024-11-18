// src/routes/transactionRoutes.js
const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');

const { authenticate } = require('../middlewares/authMiddleware');

/**
 * @swagger
 * /api/transactions/create:
 *   post:
 *     summary: Create a new transaction
 *     description: Creates a new transaction by providing sender, receiver, and amount.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               sender:
 *                 type: string
 *                 format: objectId
 *               receiver:
 *                 type: string
 *                 format: objectId
 *               amount:
 *                 type: number
 *     responses:
 *       201:
 *         description: Transaction created successfully
 *       400:
 *         description: Invalid data
 *       500:
 *         description: Server error
 */
router.post('/create', authenticate, transactionController.createTransaction);

module.exports = router;
