const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Reserva = sequelize.define('Reserva', {
  estado: { 
    type: DataTypes.ENUM('confirmada', 'cancelada'), 
    defaultValue: 'confirmada' 
  },
  horario_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true //  evita duplicados
  }
}, {
  tableName: 'reservas'
});

module.exports = Reserva;