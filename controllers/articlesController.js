const Article = require('../models/articles');

// Funzione per convertire un buffer in base64
function bufferToBase64(buffer) {
    return buffer.toString('base64');
}

// Ottieni articoli con filtri opzionali
exports.getArticles = async (req, res) => {
    const { title, size } = req.query;
    const filter = {};

    if (title) {
        filter.title = { $regex: new RegExp(title, 'i') };
    }
    if (size) {
        filter.size = size;
    }

    try {
        const articles = await Article.find(filter);
        
        if (articles.length === 0) {
            return res.status(404).json({ message: 'No articles found' });
        }

        res.json(articles);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Ottieni un articolo per ID
exports.getArticleByID = async (req, res) => {
    try {
        const article = await Article.findById(req.params.id);
        
        if (!article) {
            return res.status(404).json({ message: 'Article not found' });
        }
        
        res.json(article);
    } catch (err) {
            res.status(500).json({ message: err.message });
    }    
};

// Crea un nuovo articolo
exports.createArticle = async (req, res) => {
    const { title, size, images, isAvailable } = req.body;

    if (!title || !size) {
        return res.status(400).json({ error: 'Title and size are required' });
    }

    const imagesWithBuffer = images.map(image => ({
        data: Buffer.from(image.data, 'base64'),
        contentType: image.contentType,
        description: image.description || ''
    }));

    const newArticle = new Article({
        title,
        size,
        images: imagesWithBuffer,
        isAvailable: isAvailable || true
    });

    try {
        const savedArticle = await newArticle.save();
        res.status(201).json(savedArticle);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Aggiorna un articolo esistente
exports.updateArticle =async (req, res) => {
    const { title, size, images, isAvailable } = req.body;

    const imagesWithBuffer = images.map(image => ({
        data: Buffer.from(image.data, 'base64'),
        contentType: image.contentType,
        description: image.description || ''
    }));

    try {
        const updatedArticle = await Article.findByIdAndUpdate(req.params.id, {
            title,
            size,
            images: imagesWithBuffer,
            isAvailable: isAvailable || true
        }, { new: true });
        
        if (!updatedArticle) {
            return res.status(404).json({ message: 'Article not found' });
        }
        
        res.json(updatedArticle);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Elimina un articolo esistente
exports.deleteArticle = async (req, res) => {
    try {
        const deletedArticle = await Article.findByIdAndDelete(req.params.id);
        
        if (!deletedArticle) {
            return res.status(404).json({ message: 'Article not found' });
        }
        
        res.json({ message: 'Article deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};