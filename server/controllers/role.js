'use strict';

var models = require('../models'),
  _ = require('lodash'),
  logger = require('winston');


module.exports = {
  index: function (req, res) {
    models.Role.findAll().then(function (roles) {
      res.status(200).json(roles);
    }).catch(function (err) {
      logger.error(err.message);
      res.status(500).json(err);
    });
  },

  new: function (req, res) {
    var attrs = _.pick(req.body, 'name');
    models.Role.create(attrs).then(function (role) {
      res.status(200).json(role);
    }).catch(function (err) {
      logger.error(err.message);
      res.status(500).json(err);
    });
  },

  show: function (req, res) {
    models.Role.findById(req.params.id).then(function (role) {
      if (role) {
        res.satus(200).json(role);
      } else {
        res.status(404).json({ message: 'Role not found' });
      }
    }).catch(function (err) {
      logger.error(err.message);
      res.status(500).json(err);
    });
  },

  edit: function (req, res) {

  },

  delete: function (req, res) {
    models.Role.findById(req.params.id).then(function (role) {
      if (role) {
        role.destroy().then(function () {
          res.status(200).json({ message: 'Role removed' });
        }).catch(function (err) {
          logger.error(err.message);
          res.status(500).json(err);
        });
      } else {
        res.status(404).json({ message: 'Role not found' });
      }
    }).catch(function (err) {
      logger.error(err.message);
      res.status(500).json(err);
    });
  }
};
