'use strict';

var models = require('../models'),
  logger = require('winston');



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
  }
};
