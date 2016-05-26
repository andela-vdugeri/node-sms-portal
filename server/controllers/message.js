'use strict';

var models = require('../models'),
  logger = require('winston'),
  env = process.env.NODE_ENV || 'development',
  needle = require('needle'),
  request = require('request'),
  config = require('../config/config')[env];


process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;
module.exports = {
  index: function (req, res) {
    models.Message.findAll().then(function (messages) {
      res.status(200).json(messages);
    }).catch(function (err) {
      logger.error(err.message);
      res.status(500).json(err);
    });
  },

  new: function (req, res) {
    var attrs = _.pick(req.body, 'message', 'user_id', 'transaction_id');
    models.Message.create(attrs).then(function (message) {
      res.status(200).json(message);
    }).catch(function (err) {
      logger.error(err.message);
      res.status(500).json(err);
    });
  },

  show: function (req, res) {
    models.Message.findById(req.params.id).then(function (message) {
      if (message) {
        res.status(200).json(message);
      }
      res.status(404).json({ message: 'Message not found' });
    }).catch(function (err) {
      logger.error(err.message);
      res.status(500).json(err);
    });
  },

  edit: function (req, res) {
    models.Message.findById(req.params.id).then(function (message) {
      if (message) {
        message.body = req.para.message;
        message.user_id = req.param.user_id;
        message.transaction_id = req.params.transaction_id;
        message.save().then(function (_message) {
          res.status(200).json(_message);
        }).catch(function (err) {
          logger.error(err.message);
          res.status(500).json(err);
        });
      } else {
        res.status(404).json({ message: 'Message not found' });
      }
    }).catch(function (err) {
      logger.error(err.message);
      res.status(500).json(err);
    })
  },

  delete: function (req, res) {
    models.Message.findById(req.params.id).then(function (message) {
      if (message) {
        message.destroy().then(function () {
          res.status(200).json({ message: 'Message deleted' });
        }).catch(function (err) {
          res.status(500).json(err);
        });
      } else {
        res.status(404).json({ message: 'Message not found' });
      }
    }).catch(function (err) {
      logger.error(err.message);
      res.status(500).json(err);
    });
  },

  send: function (req, res) {
    var data = req.body,
      url = config.infobip.host + config.infobip.sms.endPoint,
      options = {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Host: config.infobip.host,
          Authorization: 'Basic ' + new Buffer(config.infobip.username +
            ':' + config.infobip.password).toString('base64'),
          'Content-Length': Buffer.byteLength(data)
        }
      };

    needle.post(url, {}, options, function (err, _res, body) {
      if (err) {
        logger.error(err.message);
        res.status(500).json(err);
      } else {
        if (_res.statusCode !== 200) {
          res.status(_res.statusCode).json(body);
        } else {
          res.status(200).json(body);
        }
      }
    });
  }

};
