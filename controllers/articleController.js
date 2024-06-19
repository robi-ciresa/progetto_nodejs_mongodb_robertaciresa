const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const Article = require('../models/article');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const fileExtension = path.extname(file.originalname);
        cb(null, uuidv4() + fileExtension);
    }
});
const upload = multer({ storage: storage });

// Visualizza tutti gli articoli
router.get('/', async (req, res) => {
    try {
        const articles = await Article.find();
        res.render('articles/index', { articles });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Crea un nuovo articolo
router.post('/', upload.fields([
    { name: 'image1', maxCount: 1 },
    { name: 'image2', maxCount: 1 },
    { name: 'image3', maxCount: 1 }
]), async (req, res) => {
    try {
        const { title, size } = req.body;
        const images = [];

        if (req.files['image1']) {
            images.push({ url: `/uploads/${req.files['image1'][0].filename}`, description: '' });
        }
        if (req.files['image2']) {
            images.push({ url: `/uploads/${req.files['image2'][0].filename}`, description: '' });
        }
        if (req.files['image3']) {
            images.push({ url: `/uploads/${req.files['image3'][0].filename}`, description: '' });
        }

        const newArticle = new Article({
            title,
            size,
            images
        });

        await newArticle.save();

        res.redirect('/articles');
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Modifica un articolo esistente
router.put('/:id', upload.fields([
    { name: 'image1', maxCount: 1 },
    { name: 'image2', maxCount: 1 },
    { name: 'image3', maxCount: 1 }
]), async (req, res) => {
    try {
        const { title, size } = req.body;

        const article = await Article.findById(req.params.id);

        if (!article) {
            return res.status(404).json({ error: 'Article not found' });
        }

        article.title = title;
        article.size = size;

        if (req.files['image1']) {
            article.images.push({ url: `/uploads/${req.files['image1'][0].filename}`, description: '' });
        }
        if (req.files['image2']) {
            article.images.push({ url: `/uploads/${req.files['image2'][0].filename}`, description: '' });
        }
        if (req.files['image3']) {
            article.images.push({ url: `/uploads/${req.files['image3'][0].filename}`, description: '' });
        }

        await article.save();

        res.redirect('/articles');
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Elimina un articolo esistente
router.delete('/:id', async (req, res) => {
    try {
        const deletedArticle = await Article.findByIdAndDelete(req.params.id);

        if (!deletedArticle) {
            return res.status(404).json({ error: 'Article not found' });
        }

        res.redirect('/articles');
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
