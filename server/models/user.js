'use strict';

var bcrypt = require('bcrypt');

module.exports = function (sequelize, DataTypes) {
  var User = sequelize.define('User', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    username: { type: DataTypes.STRING, unique: true },
    email: { type: DataTypes.STRING, unque: true },
    password: { type: DataTypes.STRING },
    firstName: { type: DataTypes.STRING },
    lastName: { type: DataTypes.STRING },
  }, {
    underscored: true,
    instanceMethods: {
      toJson: function () {
        var value = this.get();
        delete value.created_at;
        delete value.updated_at;
        delete value.password;
        return value;
      }
    },

    classMethods: {
      associate: function (models) {
        User.hasMany(models.Role);
        User.hasMany(models.Payment);
        User.hasMany(models.Transaction);
        User.hasMany(models.ScheduledSms);
      }
    }
  });

  User.beforeCreate(function (user, options, next) {
    bcrypt.hash(user.password, 10, function (err, hash) {
      if (err) {
        next(err);
      }
      user.password = hash;
      next();
    });
  });

  return User;
};
