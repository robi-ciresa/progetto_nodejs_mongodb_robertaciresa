const Order = require('../models/orders');
const Article = require('../models/articles');
const User = require('../models/users')

// Otteni tutti gli ordini con filtri opzionali
exports.getOrders = async (req, res) => {
    try {
        const { user, articles, date } = req.query;
        const filter = {};

        if (user) {
            filter.user = user;
        }
        if (articles) {
            filter.articles = { $in: articles.split(',') };
        }
        if (date) {
            const startDate = new Date(date);
            startDate.setUTCHours(0, 0, 0, 0);
            const endDate = new Date(date);
            endDate.setUTCHours(23, 59, 59, 999); // passaggio necessario perchè tenga conto di tutta la giornata

            filter.orderDate = {
                $gte: startDate,
                $lte: endDate
            };
        }

        const orders = await Order.find(filter).populate('user').populate('articles');
        
        if (orders.length === 0) {
            return res.status(404).json({ error: 'No orders found' });
        }
        
        res.json(orders);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Ottieni un ordine specifico per ID
exports.getOrderperID = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate('user').populate('articles');
        
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        
        res.json(order);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Crea un nuovo ordine
exports.createOrder = async (req, res) => {
    try {
        const { user, articles } = req.body;

        if (!user) {
            return res.status(400).json({ error: 'User is required' });
        }
    
        if (articles.length === 0) {
            return res.status(400).json({ message: 'Order must contain at least one article' });
        }
    
        const unavailableArticles = await Article.find({ _id: { $in: articles } , isAvailable: false });
        
        if (unavailableArticles.length > 0) {
            const titles = unavailableArticles.map(article => article.title).join(', ');
            return res.status(400).json({ message: `The following articles are not available: ${titles}` });
        }

        await Article.updateMany({ _id: { $in: articles } }, { $set: { isAvailable: false } });

        const newOrder = new Order({
            user,
            articles
        });
        
        await newOrder.save();
        res.status(201).json(newOrder);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Aggiorna un ordine esistente
exports.updateOrder = async (req, res) => {
    try {
        const { articles } = req.body;
    
        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        if (!articles || articles.length === 0) {
            return res.status(400).json({ message: 'Order must contain at least one article' });
        }

        const oldArticles = order.articles.map(article => article.toString());
        const newArticles = articles.map(article => article.toString());

        const articlesToAdd = newArticles.filter(article => !oldArticles.includes(article));
        const articlesToRemove = oldArticles.filter(article => !newArticles.includes(article));

        const unavailableArticlesToAdd = await Article.find({ 
            _id: { $in: articlesToAdd }, 
            isAvailable: false 
        });

        if (unavailableArticlesToAdd.length > 0) {
            const titles = unavailableArticlesToAdd.map(article => article.title).join(', ');
            return res.status(400).json({ message: `The following articles are not available: ${titles}` });
        }

        await Article.updateMany({ _id: { $in: articlesToAdd } }, { $set: { isAvailable: false } });
        await Article.updateMany({ _id: { $in: articlesToRemove } }, { $set: { isAvailable: true } });

        order.articles = articles;
        const updatedOrder = await order.save();

        res.json(updatedOrder);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Elimina un ordine esistente
exports.deleteOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        await Article.updateMany({ _id: { $in: order.articles } }, { $set: { isAvailable: true } });

        await Order.findByIdAndDelete(req.params.id);
        
        res.json({ message: 'Order deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
