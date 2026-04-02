require('dotenv').config();
const express = require('express');
const session = require('express-session');
const path = require('path');
const sequelize = require('./config/database');

const Usuario = require('./models/Usuario');
const TipoCancha = require('./models/TipoCancha');
const Cancha = require('./models/Cancha');
const Horario = require('./models/Horario');
const Reserva = require('./models/Reserva');
const Resena = require('./models/Resena');


const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(session({
    secret: process.env.SESSION_SECRET || 'lucianaaaaaaaa',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 3600000 } // 
}));


// Relación Cancha <-> Tipo
TipoCancha.hasMany(Cancha, { foreignKey: 'tipo_id' });
Cancha.belongsTo(TipoCancha, { foreignKey: 'tipo_id' });

// Relación Cancha <-> Horarios
Cancha.hasMany(Horario, { foreignKey: 'cancha_id' });
Horario.belongsTo(Cancha, { foreignKey: 'cancha_id' });

// Relación Usuario <-> Reservas
Usuario.hasMany(Reserva, { foreignKey: 'usuario_id' });
Reserva.belongsTo(Usuario, { foreignKey: 'usuario_id' });

// Relación Horario <-> Reserva (Un horario tiene una reserva)
Horario.hasOne(Reserva, { foreignKey: 'horario_id' });
Reserva.belongsTo(Horario, { foreignKey: 'horario_id' });

// Relación Reseñas (Con Usuario y Cancha)
Usuario.hasMany(Resena, { foreignKey: 'usuario_id' });
Resena.belongsTo(Usuario, { foreignKey: 'usuario_id' });
Cancha.hasMany(Resena, { foreignKey: 'cancha_id' });
Resena.belongsTo(Cancha, { foreignKey: 'cancha_id' });

// Relación Reserva <-> Reseña
Reserva.hasOne(Resena, { foreignKey: 'reserva_id' });
Resena.belongsTo(Reserva, { foreignKey: 'reserva_id' });


app.use((req, res, next) => {
    res.locals.usuario = req.session.usuarioId ? {
        id: req.session.usuarioId,
        nombre: req.session.usuarioNombre,
        rol: req.session.usuarioRol
    } : null;
    res.locals.error = null;
    res.locals.success = null;
    next();
});

app.use('/', require('./routes/authRoutes'));
app.use('/', require('./routes/adminRoutes'));
app.use('/', require('./routes/clientesRoutes'));
app.use('/', require('./routes/horariosRoutes'));
app.use('/', require('./routes/reservaRoutes'));
app.use('/', require('./routes/resenaRoutes'));

app.get('/', async (req, res) => {
    if (!req.session.usuarioId) return res.redirect('/login');

    const canchas = await require('./models/Cancha').findAll();

    res.render('cliente/canchas', { canchas });
});



const PORT = process.env.PORT || 3000;

sequelize.sync({ alter: true })
    .then(() => {
        console.log('Base de datos conectada y Relaciones creadas.');
        app.listen(PORT, () => {
            console.log(`Servidor backend listo en: http://localhost:${PORT}`);
        });
    })
    .catch(err => {
        console.error('Error fatal al iniciar backend:', err);
    });