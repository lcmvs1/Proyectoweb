const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const TipoCancha = sequelize.define('TipoCancha', {
  nombre: { type: DataTypes.STRING, allowNull: false }
}, { tableName: 'tipos_canchas', timestamps: false });

module.exports = TipoCancha;