const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        maxlength: 200
    },
    content: {
        type: String,
        required: true
    },
    excerpt: {
        type: String,
        maxlength: 300
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    tags: [{
        type: String,
        trim: true,
        lowercase: true
    }],
    featuredImage: {
        type: String,
        default: ''
    },
    published: {
        type: Boolean,
        default: true
    },
    likes: {
        type: Number,
        default: 0
    },
    views: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

// Criar excerpt automaticamente se não fornecido
postSchema.pre('save', function(next) {
    if (!this.excerpt && this.content) {
        this.excerpt = this.content.replace(/<[^>]+>/g, '').substring(0, 150) + '...';
    }
    next();
});

module.exports = mongoose.model('Post', postSchema);