const User = require('../models/users');

// Ottieni tutti gli utenti con filtri opzionali
exports.getUsers = async (req, res) => {
    try {
        let query = {};

        if (req.query.firstName) {
         query.firstName = { $regex: new RegExp(req.query.firstName, 'i') };
        }
        if (req.query.lastName) {
            query.lastName = { $regex: new RegExp(req.query.lastName, 'i') };
        }
        if (req.query.email) {
            query.email = { $regex: new RegExp(req.query.email, 'i') };
        }

        const users = await User.find(query);

        if (users.length === 0) {
            return res.status(404).json({ error: 'No users found' });
        }

        res.json(users);
    } catch (err) {
        res.status(500).json({ error: err.message }); 
    }
};

// Ottieni un utente specifico per ID
exports.getUsersperID = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Crea un nuovo utente
exports.createUser = async (req, res) => {
    try {
        const { firstName, lastName, email } = req.body;

        if (!firstName || !lastName || !email) {
            return res.status(400).json({ error: 'First name, last name, and email are required' });
        }

        const newUser = new User({
            firstName,
            lastName,
            email
        });

        await newUser.save();
        res.status(201).json(newUser);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Modifica un utente esistente
exports.updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { firstName, lastName, email } = req.body;

        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        if (firstName) user.firstName = firstName;
        if (lastName) user.lastName = lastName;
        if (email) user.email = email;

        await user.save();
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Elimina un utente esistente
exports.deleteUser =  async (req, res) => {
    try {
        const { id } = req.params;

        const user = await User.findByIdAndDelete(id);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({ message: 'User deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};