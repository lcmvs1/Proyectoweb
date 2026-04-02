const { Sequelize } = require('sequelize');
require('dotenv').config();

// Configuración de la conexión
const sequelize = new Sequelize(
  process.env.DB_NAME, // Nombre de la base de datos
  process.env.DB_USER, // Usuario (ej: root)
  process.env.DB_PASS, // Contraseña
  {
    host: process.env.DB_HOST,
    port: 3307,
    dialect: 'mysql', // O 'postgres', 'sqlite', etc.
    logging: false    // Para que no llene la consola de SQL
  }
);

module.exports = sequelize;