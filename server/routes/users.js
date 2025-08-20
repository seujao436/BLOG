const express = require('express');
const User = require('../models/User');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Obter todos os usuários (apenas para referência)
router.get('/', auth, async (req, res) => {
    try {
        const users = await User.find().select('-password').limit(10);
        res.json({
            success: true,
            users
        });
    } catch (error) {
        console.error('Erro ao obter usuários:', error);
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
});

module.exports = router;