/**
 * Created by Verem on 17/05/16.
 */
'use strict';

var models = require('../models'),
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
    var attrs = _.pick(req.body, 'message', 'sendTime', 'receivers', 'user_id');
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

  edit: function (req, res) {
    models.ScheduledSms.findById(req.params.id).then(function (sms) {
      if (sms) {
        sms.sendTime = req.body.sendTime;
        sms.receivers = req.body.receivers;
        sms.message = req.body.message;

        sms.save().then(function (_sms) {
          res.status(200).json(_sms);
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
