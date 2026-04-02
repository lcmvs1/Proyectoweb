const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Cancha = require('./Cancha');

// 1. DEFINIR MODELO PRIMERO
const Horario = sequelize.define('Horario', {
  fecha: { type: DataTypes.DATEONLY, allowNull: false },
  hora_inicio: { type: DataTypes.TIME, allowNull: false },
  hora_fin: { type: DataTypes.TIME, allowNull: false },
  disponible: { type: DataTypes.BOOLEAN, defaultValue: true }
}, {
  tableName: 'horarios',
  timestamps: false
});

// 2. LUEGO RELACIONES
Horario.belongsTo(Cancha, { foreignKey: 'cancha_id' });
Cancha.hasMany(Horario, { foreignKey: 'cancha_id' });

// 3. EXPORTAR
module.exports = Horario;