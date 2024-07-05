const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();

const usersRoutes = require('./routes/usersRoutes');
const articlesRoutes = require('./routes/articlesRoutes');
const ordersRoutes = require('./routes/ordersRoutes');

const app = express();
const port = process.env.PORT || 3000;

// Middleware per il parsing del body delle richieste
app.use(bodyParser.json());

// Utilizzo delle rotte
app.use('/users', usersRoutes);
app.use('/articles', articlesRoutes);
app.use('/orders', ordersRoutes);

if (process.env.NODE_ENV !== 'test') {
    const mongoose = require('mongoose');
    const MONGODB_URI = process.env.MONGODB_URI;

    mongoose.connect(MONGODB_URI)
        .then(() => console.log('Connected to MongoDB'))
        .catch(err => console.error('Could not connect to MongoDB', err));
    
    app.listen(port, () => {
        console.log(`Server running on port ${port}`);
    });
}

module.exports = app;