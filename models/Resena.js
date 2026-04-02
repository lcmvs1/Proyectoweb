const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Resena = sequelize.define('Resena', {
  calificacion: { 
    type: DataTypes.INTEGER, 
    validate: { min: 1, max: 5 } 
  },
  comentario: { 
    type: DataTypes.TEXT 
  },
  reserva_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, { 
  tableName: 'resenas' 
});

module.exports = Resena;