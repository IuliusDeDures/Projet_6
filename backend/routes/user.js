const express = require('express');
const router = express.Router();

const password = require('../middleware/password-validator');
const userCtrl = require('../controllers/user');

// route pour l'inscription d'un nouvel utilisateur
router.post('/signup', password, userCtrl.signup);

// route pour la connection d'un utilisateur 
router.post('/login', userCtrl.login);

module.exports = router;