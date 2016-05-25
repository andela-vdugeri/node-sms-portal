'use strict';


var _ = require('lodash'),
  models = require('../models'),
  logger = require('winston');


module.exports = {

  index: function (req, res) {
    models.Payment.findAll().then(function (payments) {
      if (payments.length) {
        res.status(200).json(payments);
      } else {
        res.status(404).json({ message: 'No records found' });
      }
    }).catch(function (err) {
      logger.error(err.message);
      res.status(500).json(err);
    });
  },

  new: function (req, res) {
    var attrs = _.pick(req.body, 'amount', 'description', 'username');
    models.Payment.create(attrs).then(function (payment) {
      res.status(200).json(payment);
    }).catch(function (err) {
      logger.error(err.message);
      res.status(500).json(err);
    });
  },

  show: function (req, res) {
    models.Payment.findById(req.params.id).then(function (payment) {
      if (payment) {
        res.status(200).json(payment);
      } else {
        res.status(404).json({ message: 'No payment found' });
      }
    }).catch(function (err) {
      logger.error(err.message);
      res.status(500).json(err);
    });
  },

  edit: function (req, res) {
    models.Payment.findById(req.params.id).then(function (payment) {
      if (payment) {
        payment.amount = req.body.amount;
        payment.description = req.body.description;
        payment.username = req.body.username;
        payment.save().then(function (_payment) {
          res.status(200).json(_payment);
        }).catch(function (err) {
          logger.error(err.message);
          res.status(500).json(err);
        });
      } else {
        res.status(404).json({ message: 'Not found' });
      }
    }).catch(function (err) {
      logger.error(err.message);
      res.status(500).json(err);
    });
  },

  delete: function (req, res) {
    models.Payment.findById(req.params.id).then(function (payment) {
      if (payment) {
        payment.destroy().then(function () {
          res.status(200).json({ message: 'Payment removed' });
        }).catch(function (err) {
          logger.error(err.message);
          res.status(500).json(err);
        });
      } else {
        res.status(404).json({ message: 'Payment record not found' });
      }
    }).catch(function (err) {
      logger.error(err.message);
      res.status(500).json(err);
    });
  }
};
