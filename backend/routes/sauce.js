const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

const sauceCtrl = require('../controllers/sauce');

// route pour l'affichage de l'ensemble des sauces
router.get('/', auth, sauceCtrl.getAllSauce);

// route pour la création d'une sauce
router.post('/', auth, multer, sauceCtrl.createSauce);

// route pour la suppression d'une sauce
router.delete('/:id', auth, sauceCtrl.deleteSauce);

// route pour l'affichage d'une sauce
router.get('/:id', auth, sauceCtrl.getOneSauce);

// route pour la modification d'une sauce
router.put('/:id', auth, multer, sauceCtrl.modifySauce);

// route pour lker ou disliker une sauce
router.post('/:id/like', auth, sauceCtrl.likeSauce);

module.exports = router;