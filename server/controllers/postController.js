const Post = require('../models/Post');
const { validationResult } = require('express-validator');

// Obter todos os posts
exports.getPosts = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        // Se o usuário for admin, mostra todos os posts, senão, apenas os publicados
        const query = (req.user?.role === 'admin') ? {} : { published: true };

        const posts = await Post.find(query)
            .populate('author', 'name email')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await Post.countDocuments(query);

        res.json({
            success: true,
            posts,
            pagination: {
                current: page,
                pages: Math.ceil(total / limit),
                total
            }
        });
    } catch (error) {
        console.error('Erro ao obter posts:', error);
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
};

// Obter post por ID
exports.getPost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
            .populate('author', 'name email');

        if (!post || !post.published) {
            return res.status(404).json({ message: 'Post não encontrado' });
        }

        // Incrementar views
        post.views += 1;
        await post.save();

        res.json({
            success: true,
            post
        });
    } catch (error) {
        console.error('Erro ao obter post:', error);
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
};

// Criar novo post (apenas admin)
exports.createPost = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { title, content, tags, featuredImage, published } = req.body;

        const post = await Post.create({
            title,
            content,
            tags: tags || [],
            featuredImage: featuredImage || '',
            author: req.user._id,
            published: published || false
        });

        const populatedPost = await Post.findById(post._id)
            .populate('author', 'name email');

        res.status(201).json({
            success: true,
            post: populatedPost,
            message: 'Post criado com sucesso'
        });
    } catch (error) {
        console.error('Erro ao criar post:', error);
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
};

// Atualizar post (apenas admin)
exports.updatePost = async (req, res) => {
    try {
        const { title, content, tags, featuredImage, published } = req.body;

        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ message: 'Post não encontrado' });
        }

        // Atualizar campos
        post.title = title || post.title;
        post.content = content || post.content;
        post.tags = tags || post.tags;
        post.featuredImage = featuredImage || post.featuredImage;
        if (typeof published === 'boolean') {
            post.published = published;
        }

        await post.save();

        const updatedPost = await Post.findById(post._id)
            .populate('author', 'name email');

        res.json({
            success: true,
            post: updatedPost,
            message: 'Post atualizado com sucesso'
        });
    } catch (error) {
        console.error('Erro ao atualizar post:', error);
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
};

// Deletar post (apenas admin)
exports.deletePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ message: 'Post não encontrado' });
        }

        await Post.findByIdAndDelete(req.params.id);

        res.json({
            success: true,
            message: 'Post deletado com sucesso'
        });
    } catch (error) {
        console.error('Erro ao deletar post:', error);
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
};

// Curtir post
exports.likePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ message: 'Post não encontrado' });
        }

        post.likes += 1;
        await post.save();

        res.json({
            success: true,
            likes: post.likes,
            message: 'Post curtido'
        });
    } catch (error) {
        console.error('Erro ao curtir post:', error);
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
};