const Resena = require('../models/Resena');
const Reserva = require('../models/Reserva');
const Horario = require('../models/Horario');


exports.crearResena = async (req, res) => {

  const { cancha_id, reserva_id, calificacion, comentario } = req.body;
  const usuario_id = req.session.usuarioId;

  try {

    const reserva = await Reserva.findByPk(reserva_id, {
      include: [Horario]
    });

  
    if (!reserva) {
      return res.redirect('/cliente/mis-reservas?error=Reserva no encontrada');
    }

    //  No es del usuario
    if (reserva.usuario_id !== usuario_id) {
      return res.redirect('/cliente/mis-reservas?error=No tienes permiso para esta reserva');
    }

    const ahora = new Date();
    const fecha = reserva.Horario.fecha;
    const horaFin = reserva.Horario.hora_fin;

    const fechaISO = typeof fecha === 'object'
      ? fecha.toISOString().split('T')[0]
      : fecha;

    const finTurno = new Date(`${fechaISO}T${horaFin}`);

    const yaExiste = await Resena.findOne({
      where: { reserva_id }
    });

    if (yaExiste) {
      return res.redirect('/cliente/mis-reservas?error=Ya reseñaste esta reserva');
    }

    if (ahora < finTurno) {
      return res.redirect('/cliente/mis-reservas?error=No puedes reseñar un turno que no ha pasado');
    }

    await Resena.create({
      calificacion,
      comentario,
      cancha_id,
      usuario_id,
      reserva_id
    });

    return res.redirect('/cliente/mis-reservas?ok=Reseña creada correctamente');

  } catch (error) {
    console.log(error);
    return res.redirect('/cliente/mis-reservas?error=Error al guardar la reseña');
  }
};