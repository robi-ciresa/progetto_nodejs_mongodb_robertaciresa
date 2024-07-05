const express = require('express');
const router = express.Router();
const ordersController = require('../controllers/ordersController');

// Endpoint per ottenere tutti gli ordini
router.get('/', ordersController.getOrders);

// Endpoint per ottenere un ordine specifico per ID
router.get('/:id', ordersController.getOrderperID);

// Endpoint per creare un nuovo ordine
router.post('/', ordersController.createOrder);

// Endpoint per modificare un ordine esistente
router.put('/:id', ordersController.updateOrder);

// Endpoint per eliminare un ordine esistente
router.delete('/:id', ordersController.deleteOrder);

module.exports = router;
