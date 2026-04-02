const Reserva = require('../models/Reserva');
const Horario = require('../models/Horario');
const Resena = require('../models/Resena');

//  RESERVAR
exports.reservar = async (req, res) => {
  try {
    const usuario_id = req.session.usuarioId;
    const { horario_id } = req.params;

    const horario = await Horario.findByPk(horario_id);

    if (!horario) {
      return res.redirect('/cliente/canchas?error=Horario no existe');
    }

    if (!horario.disponible) {
      return res.redirect('/cliente/canchas?error=Horario ocupado');
    }

    const existe = await Reserva.findOne({
      where: { horario_id }
    });

    if (existe) {
      return res.redirect('/cliente/canchas?error=Ya reservado');
    }

    await Reserva.create({
      usuario_id,
      horario_id,
      estado: 'confirmada'
    });

    horario.disponible = false;
    await horario.save();

    return res.redirect('/cliente/mis-reservas?ok=Reserva realizada correctamente');

  } catch (error) {
    console.log(error);
    return res.redirect('/cliente/canchas?error=Error al reservar');
  }
};




exports.cancelar = async (req, res) => {
  try {
    const { id } = req.params;

    const reserva = await Reserva.findByPk(id);

    if (!reserva) {
      return res.redirect('/cliente/mis-reservas?error=Reserva no existe');
    }

   
    await Resena.destroy({
      where: { reserva_id: id }
    });


    await reserva.destroy();


    const horario = await Horario.findByPk(reserva.horario_id);

    if (horario) {
      horario.disponible = true;
      await horario.save();
    }

    return res.redirect('/cliente/mis-reservas?ok=Reserva eliminada correctamente');

  } catch (error) {
    console.log(error);
    return res.redirect('/cliente/mis-reservas?error=Error al cancelar');
  }
};



exports.misReservas = async (req, res) => {
  try {
    const usuario_id = req.session.usuarioId;

    const reservas = await Reserva.findAll({
      where: { usuario_id },
      include: [
        {
          model: Horario,
          include: ['Cancha']
        },
        {
          association: 'Resena', //  IMPORTANTE para mostrar reseñas
          include: ['Usuario']
        }
      ],
      order: [['id', 'DESC']]
    });

    res.render('cliente/mis-reservas', {
      reservas,
      query: req.query, //  CLAVE PARA ALERTAS
      usuario: {
        id: req.session.usuarioId,
        nombre: req.session.usuarioNombre,
        rol: req.session.usuarioRol
      }
    });

  } catch (error) {
    console.log(error);
    res.send('Error al cargar reservas');
  }
};