const Cancha = require('../models/Cancha');
const Horario = require('../models/Horario');

exports.verCanchas = async (req, res) => {
    const canchas = await Cancha.findAll({ include: 'TipoCancha' });
    res.render('cliente/listado', { canchas });
};
exports.verDisponibilidad = async (req, res) => {
    const { id } = req.params;
    const { fecha } = req.query; 

    let where = {
        cancha_id: id,
        disponible: true
    };

    if (fecha) {
        where.fecha = fecha;
    }

    const horarios = await Horario.findAll({ where });

    res.render('cliente/horarios', { horarios, fecha, cancha_id: id });
};