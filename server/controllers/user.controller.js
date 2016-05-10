'use strict';

var _ = require('lodash'),
  models = require('../models'),
  logger = require('winston'),
  bcrypt = require('bcrypt');

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
        res.status(404).json({ message: 'User not found'});
      }
    }).catch(function (err) {
      logger.error(err.message);
      res.status(500).json(err);
    });
  }
};
