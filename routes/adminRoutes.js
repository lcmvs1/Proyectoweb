const express = require('express');
const router = express.Router();
const { esAdmin } = require('../middlewares/auth');
const Cancha = require('../models/Cancha');
const TipoCancha = require('../models/TipoCancha');


router.get('/admin/canchas', esAdmin, async (req, res) => {

    const canchas = await Cancha.findAll({
        include: {
            model: TipoCancha,
            attributes: ['id', 'nombre']
        }
    });

    const tipos = await TipoCancha.findAll();

    res.render('admin/canchas', { canchas, tipos });
});


router.post('/admin/canchas', esAdmin, async (req, res) => {
    const { nombre, precio_por_hora, tipo_id } = req.body;
    await Cancha.create({ nombre, precio_por_hora, tipo_id });
    res.redirect('/admin/canchas');
});

module.exports = router;