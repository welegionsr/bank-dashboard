const express = require('express');
const router = express.Router();

// Sample route
router.get('/', (req, res) => {
    res.send('Welcome to the Bank Service API');
});

module.exports = router;