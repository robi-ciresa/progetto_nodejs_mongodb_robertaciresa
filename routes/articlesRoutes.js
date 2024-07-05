const express = require('express');
const router = express.Router();
const articlesController = require('../controllers/articlesController');

// Endpoint per ottenere gli articoli con filtri opzionali
router.get('/', articlesController.getArticles);

// Endpoint per ottenere un articolo specifico per ID
router.get('/:id', articlesController.getArticleByID);

// Endpoint per creare un nuovo articolo
router.post('/', articlesController.createArticle);

// Endpoint per modificare un articolo esistente
router.put('/:id', articlesController.updateArticle);

// Endpoint per eliminare un articolo esistente
router.delete('/:id', articlesController.deleteArticle);

module.exports = router;
