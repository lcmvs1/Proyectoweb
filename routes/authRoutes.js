const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Vistas
router.get('/registro', (req, res) => res.render('registro', { error: null }));
router.get('/login', (req, res) => res.render('login', { error: null }));

// Acciones (POST)
router.post('/registro', authController.registrar);
router.post('/login', authController.iniciarSesion);
router.get('/salir', authController.cerrarSesion);

module.exports = router;