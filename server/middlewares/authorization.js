'use strict';

var jwt = require('jwt-simple'),
  env = process.env.NODE_ENV || 'development',
  moment = require('moment'),
  config = require('../config/config')[env];

module.exports = {
  authenticated: function (req, res, next) {
    var token, decoded;
    token = (req.body && req.body.accessToken)
      || (req.query && req.query.accessToken)
      || (req.headers['x-access-token']);

    if(token) {
      try {
        decoded = jwt.decode(token, config.token.secret);
        if (decoded && decoded.exp >= moment()) {
          next();
        } else {
          res.status(500).json({ message: 'Authentication failed' });
        }
      } catch(err) {
        res.status(403).json({ message: 'Unauthorized' });
      }
    } else {
      res.status(401).json({ message: 'Unauthorized' });
    }
  }
};
