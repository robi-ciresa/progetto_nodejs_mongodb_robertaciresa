const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');

// Endpoint per ottenere tutti gli utenti
router.get('/', usersController.getUsers);

// Endpoint per ottenere un utente specifico per ID
router.get('/:id', usersController.getUsersperID);

// Endpoint per creare un nuovo utente
router.post('/', usersController.createUser);

// Endpoint per modificare un utente esistente
router.put('/:id', usersController.updateUser);

// Endpoint per eliminare un utente esistente
router.delete('/:id', usersController.deleteUser);

module.exports = router;
