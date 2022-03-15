const { Sequelize, DataTypes } = require('sequelize');
const config = require('../config/config');

module.exports = {
  
  debug: false  // Active/désactive les console.log et les log SQL
};

const sequelizeConfig = {
    database : process.env.DATABASE_DEV,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    dialect: 'mysql' /* one of 'mysql' | 'mariadb' | 'postgres' | 'mssql' */
};

const sequelize = new Sequelize( sequelizeConfig.database, sequelizeConfig.username, sequelizeConfig.password, { 
    host: sequelizeConfig.host,
    dialect: sequelizeConfig.dialect 
  });

sequelize.authenticate()
  .then(() => {
      sequelize.sync()
          .then(()=>console.log('All models were synchronized successfully !'))
          .catch((error)=> console.log(error)); 
  })
  .catch((error)=> console.log(`Failed to access database : ${error}`));

module.exports = sequelize;