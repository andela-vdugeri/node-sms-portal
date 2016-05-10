'use strict';

var fs = require('fs'),
  path = require('path'),
  Sequelize = require('sequelize'),
  lodash = require('lodash'),
  env = process.env.NODE_ENV || 'development',
  config = require('../config/config')[env],
  db = {},
  bcrypt = require('bcrypt'),
  sequelize;

var options = {
  logging: false,
  dialect: 'postgres'
};

if (env === 'production') {
  options.dialectOptions = {
    ssl: true
  };
}

sequelize = new Sequelize(config.database.url, options);

fs
  .readdirSync(__dirname)
  .filter(function (file) {
    return (file.indexOf('.') !== 0) && (file !== 'index.js');
  })
  .forEach(function (file) {
    var model = sequelize.import(path.join(__dirname, file));
    db[model.name] = model;
  });

  Object.keys(db).forEach(function (modelName) {
    if ('associate' in db[modelName]) {
      db[modelName].associate(db);
    }
  });

  module.exports = lodash.extend({
    sequelize: sequelize,
    Sequelize: Sequelize,
    bcrypt: bcrypt
  }, db);
