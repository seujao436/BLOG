const express = require('express');
const { body } = require('express-validator');
const {
    getPosts,
    getPost,
    createPost,
    updatePost,
    deletePost,
    likePost
} = require('../controllers/postController');
const { auth, adminAuth, softAuth } = require('../middleware/auth');

const router = express.Router();

// Validações
const postValidation = [
    body('title').isLength({ min: 1, max: 200 }).withMessage('Título deve ter entre 1 e 200 caracteres'),
    body('content').isLength({ min: 1 }).withMessage('Conteúdo é obrigatório')
];

// Rotas públicas
router.get('/', softAuth, getPosts);
router.get('/:id', getPost);

// Rotas protegidas
router.post('/:id/like', auth, likePost);

// Rotas apenas para admin
router.post('/', auth, adminAuth, postValidation, createPost);
router.put('/:id', auth, adminAuth, updatePost);
router.delete('/:id', auth, adminAuth, deletePost);

module.exports = router;