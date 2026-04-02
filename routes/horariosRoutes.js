const express = require('express');
const router = express.Router();

const Horario = require('../models/Horario');
const Cancha = require('../models/Cancha');
const Reserva = require('../models/Reserva');
const Usuario = require('../models/Usuario');
const Resena = require('../models/Resena');



router.get('/horarios', async (req, res) => {

    const horarios = await Horario.findAll({
        include: [
            { model: Cancha },
            {
                model: Reserva,
                include: [
                    {
                        model: Resena,
                        include: [Usuario]
                    }
                ]
            }
        ]
    });

    const canchas = await Cancha.findAll();

    res.render('cliente/horarios', {
        horarios,
        canchas,
        fecha: null, // 👈 IMPORTANTE para evitar error
        usuario: {
            id: req.session.usuarioId,
            nombre: req.session.usuarioNombre,
            rol: req.session.usuarioRol
        }
    });
});



router.get('/canchas/:id/horarios', async (req, res) => {

    const cancha = await Cancha.findByPk(req.params.id);
    const { fecha } = req.query;

    // 🔥 FILTRO DINÁMICO
    let where = {
        cancha_id: req.params.id
    };

    if (fecha) {
        where.fecha = fecha;
    }

    const horarios = await Horario.findAll({
        where,
        include: [
            { model: Cancha },
            {
                model: Reserva,
                include: [
                    {
                        model: Resena,
                        include: [Usuario]
                    }
                ]
            }
        ]
    });

    const canchas = await Cancha.findAll();

    res.render('cliente/horarios', {
        cancha,
        horarios,
        canchas,
        fecha, // 👈 YA FUNCIONA EL INPUT
        usuario: {
            id: req.session.usuarioId,
            nombre: req.session.usuarioNombre,
            rol: req.session.usuarioRol
        }
    });
});


// CREAR HORARIO (SOLO ADMIN)
router.post('/horarios', async (req, res) => {

    if (req.session.usuarioRol !== 'admin') {
        return res.redirect('/horarios');
    }

    const { cancha_id, fecha, hora_inicio, hora_fin } = req.body;

    await Horario.create({
        cancha_id,
        fecha,
        hora_inicio,
        hora_fin,
        disponible: true
    });

    res.redirect('/horarios');
});


// ELIMINAR (SOLO ADMIN)
router.post('/admin/horarios/eliminar/:id', async (req, res) => {

    if (req.session.usuarioRol !== 'admin') {
        return res.redirect('/horarios');
    }

    const { id } = req.params;

    await Reserva.destroy({
        where: { horario_id: id }
    });

    await Horario.destroy({
        where: { id }
    });

    res.redirect('/horarios');
});


module.exports = router;