const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const TipoCancha = require('./TipoCancha');

const Cancha = sequelize.define('Cancha', {
  nombre: { type: DataTypes.STRING, allowNull: false },
  precio_por_hora: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  estado: { type: DataTypes.ENUM('activa', 'inactiva'), defaultValue: 'activa' }
}, { tableName: 'canchas' });

// Relación
Cancha.belongsTo(TipoCancha, { foreignKey: 'tipo_id' });
TipoCancha.hasMany(Cancha, { foreignKey: 'tipo_id' });

module.exports = Cancha;