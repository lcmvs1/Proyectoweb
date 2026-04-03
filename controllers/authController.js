const bcrypt = require('bcryptjs');
const Usuario = require('../models/Usuario');


exports.registrar = async (req, res) => {
    try {
        const { nombre, email, contrasena } = req.body;

        // Encripta la contraseña 
        const hash = await bcrypt.hash(contrasena, 10);

        await Usuario.create({
            nombre,
            email,
            contrasena: hash,
            rol: 'cliente' 
        });

        res.redirect('/login');
    } catch (error) {
        console.error(error);
        res.render('registro', { error: 'El correo ya está registrado o hubo un error.' });
    }
};


exports.iniciarSesion = async (req, res) => {
    try {
        const { email, contrasena } = req.body;

        const usuario = await Usuario.findOne({ where: { email } });

        if (usuario && await bcrypt.compare(contrasena, usuario.contrasena)) {

            req.session.usuarioId = usuario.id;
            req.session.usuarioNombre = usuario.nombre;
            req.session.usuarioRol = usuario.rol;

            return req.session.save(() => {

                if (usuario.rol === 'admin') {
                    return res.redirect('/');
                } else {
                    return res.redirect('/cliente/canchas');
                }

            });
        }

        return res.render('login', { error: 'Correo o contraseña incorrectos.' });
    } catch (error) {
        console.error(error);
        res.render('login', { error: error.message });
    }
};

exports.cerrarSesion = (req, res) => {
    req.session.destroy(() => {
        res.clearCookie('connect.sid');
        res.redirect('/login');
    });
};