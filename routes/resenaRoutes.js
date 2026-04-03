const express = require('express');
const router = express.Router();
const resenaController = require('../controllers/resenaController');


router.post('/resena', resenaController.crearResena);

module.exports = router;