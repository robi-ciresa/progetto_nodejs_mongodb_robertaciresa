const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const routes = require('./routes/allroutes');
const jsonRoutes = require('./controllers/jsonController');

const PORT = process.env.PORT || 3000;
const DB_URL = process.env.DB_URL;

// Connessione al database
mongoose.connect(DB_URL).then(() => {
    console.log('Connected to MongoDB Atlas');
}).catch(err => {
    console.error('Error connecting to MongoDB Atlas:', err.message);
});

// Middleware
app.use(methodOverride('_method'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Configurazione del motore di template EJS
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Definizione delle rotte
app.use('/', routes);
app.use('/json', jsonRoutes);

// Avvio del server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

module.exports = app;
