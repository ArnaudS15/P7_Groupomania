//----------------------- fichier utilisant dotenv library pour charger les fichiers .env -----------------------// 

// import de dotenv
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({
    path: path.resolve(__dirname, "../.env")
});

// exports pour retrouver les valeurs contenues dans fichier .env
module.exports = {
    NODE_ENV : process.env.NODE_ENV || 'dev',
    JWT_TOKEN : process.env.JWT_TOKEN,

  "dev": {
    "username": process.env.DB_USERNAME,
    "password": process.env.DB_PASSWORD,
    "database": process.env.DATABASE_DEV,
    "host": process.env.DB_HOST,
    "dialect": "mysql"
  },
  "test": {
    "username": process.env.DB_USERNAME,
    "password": process.env.DB_PASSWORD,
    "database": process.env.DATABASE_TEST,
    "host": process.env.DB_HOST,
    "dialect": "mysql"
  },
  "prod": {
    "username": process.env.DB_USERNAME,
    "password": process.env.DB_PASSWORD,
    "database": process.env.DATABASE_PROD,
    "host": process.env.DB_HOST,
    "dialect": "mysql"
  }
}