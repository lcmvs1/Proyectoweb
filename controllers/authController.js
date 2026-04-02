const bcrypt = require('bcryptjs');
const Usuario = require('../models/Usuario');

// REGISTRO
exports.registrar = async (req, res) => {
    try {
        const { nombre, email, contrasena } = req.body;

        // 1. Encriptar la contraseña (seguridad ante todo)
        const hash = await bcrypt.hash(contrasena, 10);

        // 2. Guardar en la base de datos
        await Usuario.create({
            nombre,
            email,
            contrasena: hash,
            rol: 'cliente' // Por defecto todos son clientes
        });

        res.redirect('/login');
    } catch (error) {
        console.error(error);
        res.render('registro', { error: 'El correo ya está registrado o hubo un error.' });
    }
};

// INICIO DE SESIÓN
exports.iniciarSesion = async (req, res) => {
    try {
        const { email, contrasena } = req.body;

        // 1. Buscar al usuario por email
        const usuario = await Usuario.findOne({ where: { email } });

        // 2. Si existe, comparar contraseñas
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

        // 👇 IMPORTANTE: este solo se ejecuta si falla login
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