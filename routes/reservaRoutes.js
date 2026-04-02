const express = require('express');
const router = express.Router();

const reservaController = require('../controllers/reservaController');
router.get('/cliente/mis-reservas', reservaController.misReservas);
router.get('/reserva/:horario_id', reservaController.reservar);
router.post('/reserva/cancelar/:id', reservaController.cancelar);

const Reserva = require('../models/Reserva');
const Horario = require('../models/Horario');

router.post('/reservar/:horario_id', async (req, res) => {

    const usuario_id = req.session.usuarioId;
    const { horario_id } = req.params;

    const horario = await Horario.findByPk(horario_id);

    if (!horario || !horario.disponible) {
        return res.redirect('/horarios');
    }

    // BUSCAR SI YA EXISTE
    let reserva = await Reserva.findOne({
        where: { horario_id }
    });

    if (reserva) {

        // SI YA EXISTE → REUTILIZAR
        reserva.estado = 'confirmada';
        reserva.usuario_id = usuario_id;
        await reserva.save();

    } else {

        // SI NO EXISTE → CREAR
        await Reserva.create({
            usuario_id,
            horario_id,
            estado: 'confirmada'
        });
    }

    horario.disponible = false;
    await horario.save();

    res.redirect('/horarios');
});


router.post('/cancelar-reserva/:id', async (req, res) => {

    const reserva = await Reserva.findByPk(req.params.id);

    if (!reserva) {
        return res.redirect('/horarios');
    }

    if (reserva.usuario_id !== req.session.usuarioId) {
        return res.redirect('/horarios');
    }

    reserva.estado = 'cancelada';
    await reserva.save();

    const horario = await Horario.findByPk(reserva.horario_id);
    if (horario) {
        horario.disponible = true;
        await horario.save();
    }

    res.redirect('/horarios');
});


module.exports = router;