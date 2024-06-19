const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ImageSchema = new Schema({
    url: {
        type: String,
        required: true
    },
    description: {
        type: String,
        default: ''
    }
});

const ArticleSchema = new Schema({
    title: {
        type: String,
        required: true,
        unique: true
    },
    size: {
        type: String,
        required: true
    },
    images: [ImageSchema],
    isAvailable: {
        type: Boolean,
        default: true
    }
});

module.exports = mongoose.model('Article', ArticleSchema);
