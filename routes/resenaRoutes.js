const express = require('express');
const router = express.Router();
const resenaController = require('../controllers/resenaController');

// crear reseña
router.post('/resena', resenaController.crearResena);

module.exports = router;