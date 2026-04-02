exports.esAdmin = (req, res, next) => {
    if (req.session.usuarioId && req.session.usuarioRol === 'admin') {
        return next();
    }
    res.status(403).send('Acceso denegado. Se requiere ser Administrador.');
};

exports.estaAutenticado = (req, res, next) => {
    if (req.session.usuarioId) {
        return next();
    }
    res.redirect('/login');
};