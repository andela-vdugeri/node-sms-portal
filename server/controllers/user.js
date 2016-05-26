'use strict';

var _ = require('lodash'),
  models = require('../models'),
  logger = require('winston'),
  bcrypt = require('bcrypt'),
  jwt = require('jwt-simple'),
  moment = require('moment'),
  env = process.env.NODE_ENV || 'development',
  config = require('../config/config')[env];


var generateToken = function (user, cb) {
  var expires = moment().add(7, 'days').valueOf();
  var token = jwt.encode({
    iss: user.id,
    exp: expires
  }, config.token.secret);

  cb(null, token, expires);
};

module.exports = {

  index: function (req, res) {
    models.User.findAll().then(function (users) {
      res.status(200).json(users);
    }).catch(function (err) {
      logger.error(err.message);
      res.status(500).json(err);
    });
  },

  show: function (req, res) {
    var id = req.params.id;
    models.User.findOne({
      where: {
        id: id
      }
    }).then(function (user) {
      if (user) {
        res.status(200).json(user);
      } else {
        res.status(404).json({ message: 'User not found' });
      }
    }).catch(function (err) {
      logger.error(err.message);
      res.status(500).json(err);
    });
  },

  new: function (req, res) {
    var attrs = _.pick(req.body, 'username', 'email', 'password', 'firstName', 'lastName');

    models.User.create(attrs).then(function (user) {
      res.status(200).json(user);
    }).catch(function (err) {
      res.status(500).json(err);
    });
  },

  edit: function (req, res) {
    var id = req.params.id;

    models.User.findById(id).then(function (user) {
      if (user) {
        user.email = req.body.user.email;
        user.username  = req.body.user.username;
        user.firstName = req.body.user.firstName;
        user.lastName = req.body.user.lastName;

        user.save().then(function (_user) {
          res.status(200).json(_user);
        }).catch(function (err) {
          logger.error(err.message);
          res.status(500).json(err);
        });
      } else {
        res.status(404).json({ message: 'User not found' });
      }
    }).catch(function (err) {
      logger.error(err.message);
      res.status(500).json(err);
    });
  },

  delete: function (req, res) {
    models.User.findOne({
      where: {
        id: req.params.id
      }
    }).then(function (user) {
      if (user) {
        user.destroy().then(function () {
          res.status(200).json({ message: 'User removed' });
        }).catch(function (err) {
          logger.error(err.message);
          res.status(500).json(err);
        });
      } else {
        res.status(404).json({ message: 'User not found' });
      }
    }).catch(function (err) {
      logger.error(err.message);
      res.status(500).json(err);
    });
  },

  login: function (req, res) {
    var username = req.body.username,
      password = req.body.password;

    models.User.findOne({
      where: {
        username: username
      }
    }).then(function (user) {
      if (!user) {
        res.status(404).json({ message: 'Wrong username or password' });
      }
      bcrypt.compare(password, user.password, function (err, _res) {
        if (err) {
          logger.error(err.message);
          res.status(500).json(err);
        }
        generateToken(user, function (_err, token, expires) {
          if (_err) {
            logger.error(_err.message);
            res.status(500).json(_err);
          }
          res.status(200).json({ user: user.toJson(), token: token, expires: expires });
        });
      });
    }).catch(function (err) {
      logger.error(err.message);
      res.status(500).json(err);
    });
  },

  logout: function (req, res) {

  }
};
