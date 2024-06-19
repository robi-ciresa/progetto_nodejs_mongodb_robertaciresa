const express = require('express');
const router = express.Router();
const User = require('../models/user');

// Visualizza tutti gli utenti
router.get('/', async (req, res) => {
    try {
        const users = await User.find();
        res.render('users/index', { users });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Crea un nuovo utente
router.post('/', async (req, res) => {
    try {
        const { firstName, lastName, email } = req.body;

        const newUser = new User({
            firstName,
            lastName,
            email
        });

        await newUser.save();

        res.redirect('/users');
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Modifica un utente esistente
router.put('/:id', async (req, res) => {
    try {
        const { firstName, lastName, email } = req.body;
        
        if (!firstName && !lastName && !email) {
            return res.status(400).json({ error: 'Devi fornire almeno uno tra nome, cognome o email per modificare l\'utente.' });
        }

        const updateFields = {};
        if (firstName) updateFields.firstName = firstName;
        if (lastName) updateFields.lastName = lastName;
        if (email) updateFields.email = email;

        const updatedUser = await User.findByIdAndUpdate(req.params.id, updateFields, { new: true });

        if (!updatedUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.redirect('/users');
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Elimina un utente esistente
router.delete('/:id', async (req, res) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.params.id);

        if (!deletedUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.redirect('/users');
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
