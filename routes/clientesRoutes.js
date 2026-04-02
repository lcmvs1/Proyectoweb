const express = require('express');
const router = express.Router();
const Cancha = require('../models/Cancha');
const TipoCancha = require('../models/TipoCancha');
const clienteController = require('../controllers/clienteController');

router.get('/canchas', async (req, res) => {

    const canchas = await Cancha.findAll({
        include: TipoCancha
    });

    const tipos = await TipoCancha.findAll();

    res.render("/admin/canchas", {
        canchas,
        tipos
    });
});
router.get('/cliente/canchas', async (req, res) => {
    const canchas = await Cancha.findAll();
    res.render('cliente/canchas', { canchas });
});
router.get('/cliente/:id/horarios', clienteController.verDisponibilidad);

module.exports = router;