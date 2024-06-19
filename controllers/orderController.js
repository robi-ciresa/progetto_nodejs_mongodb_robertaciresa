const express = require('express');
const router = express.Router();
const Order = require('../models/order');
const User = require('../models/user');
const Article = require('../models/article');

// Visualizza tutti gli ordini
router.get('/', async (req, res) => {
    try {
        const { filterDate, filterArticle } = req.query;
        const query = {};

        if (filterDate) {
            const startDate = new Date(filterDate);
            startDate.setUTCHours(0, 0, 0, 0);
            const endDate = new Date(filterDate);
            endDate.setUTCHours(23, 59, 59, 999);

            query.orderDate = { $gte: startDate, $lte: endDate };
        }

        if (filterArticle) {
            query.articles = filterArticle;
        }

        const filteredOrders = await Order.find(query).populate('user').populate('articles');
        const orders = await Order.find().populate('user').populate('articles');
        const users = await User.find();
        const articles = await Article.find();

        res.render('orders/index', { orders, users, articles, filteredOrders });
    } catch (err) {
        console.error("Errore durante il rendering degli ordini:", err);
        res.status(500).json({ error: err.message });
    }
});


// Crea un nuovo ordine
router.post('/', async (req, res) => {
    try {
        const { userId, articleIds } = req.body;

        if (!userId || !articleIds) {
            return res.status(400).json({ error: 'Assicurati di selezionare un utente e almeno un articolo.' });
        }

        const normalizedArticleIds = Array.isArray(articleIds) ? articleIds : [articleIds];

        const newOrder = new Order({
            user: userId,
            articles: normalizedArticleIds
        });

        await newOrder.save();

        await Article.updateMany(
            { _id: { $in: normalizedArticleIds } },
            { $set: { isAvailable: false } }
        );

        res.redirect('/orders');
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Modifica un ordine esistente
router.put('/:id', async (req, res) => {
    try {
        const { articleIds } = req.body;

        const articleArray = Array.isArray(articleIds) ? articleIds : [articleIds];

        if (!articleArray || articleArray.length === 0) {
            return res.status(400).send('L\'ordine deve avere almeno un articolo.');
        }

        const existingOrder = await Order.findById(req.params.id).populate('articles');

        if (!existingOrder) {
            return res.status(404).send('Ordine non trovato.');
        }

        const currentArticleIds = existingOrder.articles.map(article => article._id.toString());

        const addedArticles = articleArray.filter(id => !currentArticleIds.includes(id));
        const removedArticles = currentArticleIds.filter(id => !articleArray.includes(id));

        await Article.updateMany(
            { _id: { $in: addedArticles } },
            { $set: { isAvailable: false } }
        );

        await Article.updateMany(
            { _id: { $in: removedArticles } },
            { $set: { isAvailable: true } }
        );

        const updatedOrder = await Order.findByIdAndUpdate(
            req.params.id,
            { articles: articleArray },
            { new: true }
        );

        res.redirect('/orders');
    } catch (err) {
        res.status(400).send(err.message);
    }
});

// Elimina un ordine esistente
router.delete('/:id', async (req, res) => {
    try {
        const orderToDelete = await Order.findById(req.params.id).populate('articles');

        if (!orderToDelete) {
            return res.status(404).send('Ordine non trovato.');
        }

        const articleIds = orderToDelete.articles.map(article => article._id);
        await Article.updateMany(
            { _id: { $in: articleIds } },
            { $set: { isAvailable: true } }
        );

        await Order.findByIdAndDelete(req.params.id);

        res.redirect('/orders');
    } catch (err) {
        res.status(400).send(err.message);
    }
});

module.exports = router;
