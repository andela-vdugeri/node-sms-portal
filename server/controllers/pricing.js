'use strict';


var models = require('../models'),
  logger = require('winston'),
  _ = require('lodash');


module.exports = {

  index: function (req, res) {
    models.Pricing.findAll().then(function (pricings) {
      if (pricings.length) {
        res.status(200).json(pricings);
      } else {
        res.status(404).json({ message: 'No pricing found' });
      }
    }).catch(function (err) {
      logger.error(err.message);
      res.status(500).json(err);
    });
  },

  new: function (req, res) {
    var attrs = _.pick(req.body, 'unitPrice');
    models.Pricing.create(attrs).then(function (pricing) {
      res.status(200).json(pricing);
    }).catch(function (err) {
      logger.error(err.message);
      res.status(500).json(err);
    });
  },

  show: function (req, res) {
    models.Pricing.findById(req.params.id).then(function (price) {
      if (price) {
        res.status(200).json(price);
      } else {
        res.status(404).json({ message: 'Not found' });
      }
    }).catch(function (err) {
      logger.error(err.message);
      res.status(500).json(err);
    });
  },

  edit: function (req, res) {
    models.Pricing.findById(req.params.id).then(function (price) {
      if (price) {
        price.unitPrice = req.body.unitPrice;
        price.save().then(function (_price) {
          res.status(200).json(_price);
        }).catch(function (err) {
          logger.error(err.message);
          res.status(500).json(err);
        });
      } else {
        res.status(404).json({ message: 'No record found' });
      }
    }).catch(function (err) {
      logger.error(err.message);
      res.status(500).json(err);
    });
  },

  delete: function (req, res) {
    models.Pricing.findById(req.params.id).then(function (price) {
      if (price) {
        price.destroy().then(function () {
          res.status(200).json({ message: 'Price settings removed' });
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
  }
};
