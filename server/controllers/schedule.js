/**
 * Created by Verem on 17/05/16.
 */
'use strict';

var models = require('../models/scheduled_sms'),
  logger = require('winston'),
  _ = require('lodash');


module.exports = {
  index: function (req, res) {
    models.ScheduledSms.findAll().then(function (scheduledSms) {
      res.status(200).json(scheduledSms);
    }).catch(function (err) {
      logger.error(err.message);
      res.status(500).json(err);
    });
  },

  new: function (req, res) {
    var attrs = _.pick(req.body, 'message', 'sendTime', 'receivers');
    models.ScheduledSms.create(attrs).then(function (scheduledSms) {
      res.status(200).json(scheduledSms);
    }).catch(function (err) {
      logger.error(err.message);
      res.status(500).json(err);
    });
  },

  show: function (req, res) {
    models.ScheduledSms.findById(req.params.id).then(function (scheduledSms) {
      if (scheduledSms) {
        res.status(200).json(scheduledSms);
      } else {
        res.status(404).json({ message: 'Scheduled sms not found' });
      }
    }).catch(function (err) {
      logger.error(err.message);
      res.status(500).json(err);
    });
  },

  destroy: function (req, res) {
    models.ScheduledSms.findById(req.params.id).then(function (scheduledSms) {
      if (scheduledSms) {
        scheduledSms.destroy().then(function () {
          res.status(200).json({ message: 'Scheduled sms deleted' });
        }).catch(function (err) {
          logger.error(err.message);
          res.status(500).json(err);
        });
      } else {
        res.status(404).json({ message: 'Scheduled sms bot found' });
      }
    }).catch(function (err) {
      logger.error(err.message);
      res.status(500).json(err);
    });
  }
};
