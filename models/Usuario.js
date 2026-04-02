const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Usuario = sequelize.define('Usuario', {
  nombre: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, unique: true, allowNull: false },
  contrasena: { type: DataTypes.STRING, allowNull: false },
  rol: { type: DataTypes.ENUM('admin', 'cliente'), defaultValue: 'cliente' }
}, { tableName: 'usuarios' });

module.exports = Usuario;