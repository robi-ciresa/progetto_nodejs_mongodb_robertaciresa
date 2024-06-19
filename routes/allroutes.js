const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');
const articleController = require('../controllers/articleController');
const orderController = require('../controllers/orderController');
const jsonController = require('../controllers/jsonController');

// Rotte per utenti
router.use('/users', userController);

// Rotte per articoli
router.use('/articles', articleController);

// Rotte per ordini
router.use('/orders', orderController);

// Rotte JSON
router.use('/json', jsonController);

module.exports = router;
