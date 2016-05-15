'use strict';

var models = require('../models'),
  _ = require('lodash'),
  logger = require('winston');


module.exports = {
  index: function (req, res) {
    models.Transaction.findAll().then(function (trans) {
      res.status(200).json(trans);
    }).catch(function (err) {
      logger.error(err.message);
      res.status(500).json(err);
    });
  },

  new: function (req, res) {
    var attrs = _.pick(req.body, 'receivers', 'messageUnits', 'user_id');
    models.Transaction.create(attrs).then(function (trans) {
      res.status(200).json(trans);
    }).catch(function (err) {
      logger.error(err.message);
      res.status(500).json(err);
    });
  },

  show: function (req, res) {
    models.Transaction.findById(req.params.id).then(function (trans) {
      if (trans) {
        res.status(200).json(trans);
      } else {
        res.status(404).json({ message: 'Transaction record not found' });
      }
    }).catch(function (err) {
      logger.error(err.message);
      res.status(500).json(err);
    });
  },

  edit: function (req, res) {
    models.Transaction.findById(req.params.id).then(function (trans) {
      if (trans) {
        trans.receivers = req.body.receivers;
        trans.messageUnits = req.body.messageUnits;
        trans.user_id = req.body.user_id;

        trans.save().then(function (_trans) {
          res.status(200).json(_trans);
        }).catch(function (err) {
          logger.error(err.message);
          res.status(500).json(err);
        });
      } else {
        res.status(404).json({ message: 'Transaction records not found' });
      }
    }).catch(function (err) {
      logger.error(err.messgae);
      res.status(500).json(err);
    });
  },

  delete: function (req, res) {
    models.Transaction.findById(req.params.id).then(function (trans) {
      if (trans) {
        trans.destroy().then(function () {
          res.status(200).json({ message: 'Transaction record deleted' });
        }).catch(function (err) {
          logger.error(err.message);
          res.status(500).json(err);
        });
      } else {
        res.status(404).json({ message: 'Transaction record not found' });
      }
    }).catch(function (err) {
      logger.error(err.message);
      res.status(500).json(err);
    });
  }
};
