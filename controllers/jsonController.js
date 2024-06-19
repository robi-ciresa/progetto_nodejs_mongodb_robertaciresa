const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Order = require('../models/order');
const Article = require('../models/article');

// Endpoint per restituire tutti gli utenti in formato JSON
router.get('/users', async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Endpoint per restituire tutti gli ordini in formato JSON
router.get('/orders', async (req, res) => {
    try {
        const orders = await Order.find().populate('user').populate('articles');
        res.json(orders);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Endpoint per restituire tutti gli articoli in formato JSON
router.get('/articles', async (req, res) => {
    try {
        const articles = await Article.find();
        res.json(articles);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Endpoint per filtrare gli ordini
router.get('/orders/filter', async (req, res) => {
    try {
        const { articleId, date } = req.query;
        const query = {};

        if (date) {
            const startOfDay = new Date(date);
            startOfDay.setUTCHours(0, 0, 0, 0);
            const endOfDay = new Date(date);
            endOfDay.setUTCHours(23, 59, 59, 999);

            query.orderDate = { $gte: startOfDay, $lte: endOfDay };
        }

        if (articleId) {
            query.articles = articleId;
        }

        const orders = await Order.find(query).populate('user').populate('articles');
        res.json(orders);
    } catch (err) {
        console.error("Errore durante il filtro degli ordini:", err);
        res.status(500).json({ error: err.message });
    }
});

// Endpoint per filtrare gli utenti
router.get('/users/filter', async (req, res) => {
    try {
        const { firstName, lastName, email } = req.query;
        const query = {};

        if (firstName) {
            query.firstName = { $regex: new RegExp(firstName, 'i') };
        }

        if (lastName) {
            query.lastName = { $regex: new RegExp(lastName, 'i') };
        }

        if (email) {
            query.email = { $regex: new RegExp(email, 'i') };
        }

        const users = await User.find(query);
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Endpoint per filtrare gli articoli
router.get('/articles/filter', async (req, res) => {
    try {
        const { title, size } = req.query;
        const query = {};

        if (title) {
            query.title = { $regex: new RegExp(title, 'i') };
        }

        if (size) {
            query.size = size;
        }

        const articles = await Article.find(query);
        res.json(articles);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
