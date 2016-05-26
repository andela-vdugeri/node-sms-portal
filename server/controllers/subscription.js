'use strict';


var models = require('../models'),
  logger = require('winston'),
  _ = require('lodash');


module.exports = {

  index: function (req, res) {
    models.Subscription.findAll().then(function (subscriptions) {
      res.status(200).json(subscriptions);
    }).catch(function (err) {
      logger.error(err.message);
      res.status(500).json(err);
    });
  },

  new: function (req, res) {
    var attrs = _.pick(req.body, 'messageUnits', 'user_id');
    models.Subscription.create(attrs).then(function (sub) {
      res.status(200).json(sub);
    }).catch(function (err) {
      logger.error(err.message);
      res.status(500).json(err);
    });
  },

  show: function (req, res) {
    models.Subscription.findById(req.params.id).then(function (sub) {
      res.status(200).json(sub);
    }).catch(function (err) {
      logger.error(err.message);
      res.status(500).json(err);
    });
  },

  edit: function (req, res) {
    models.Subscription.findById(req.params.id).then(function (subscription) {
      if (subscription) {
        subscription.messageUnits = req.body.messageUnits;
        subscription.user_id = req.body.user_id;
        subscription.save().then(function (sub) {
          res.status(200).json(sub);
        }).catch(function (err) {
          logger.error(err.message);
          res.status(500).json(err);
        });
      } else {
        res.status(404).json({ message: 'Subscription data not found' });
      }
    }).catch(function (err) {
      logger.error(err.message);
      res.status(500).json(err);
    });
  },

  delete: function (req, res) {
    models.Subscription.findById(req.params.id).then(function (sub) {
      if (sub) {
        sub.destroy().then(function () {
          res.status(200).json({ message: 'Subscription data deleted' });
        }).catch(function (err) {
          logger.error(err.message);
          res.status(500).json(err);
        });
      } else {
        res.status(404).json({ message: 'Subscription data does not exist' });
      }
    }).catch(function (err) {
      logger.error(err.message);
      res.status(500).json(err);
    });
  }
};
