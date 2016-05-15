'use strict';

// load controllers
var userController = require('./user.controller'),
  messageController = require('./message.controller'),
  transactionController = require('./transaction.controller'),
  acl = require('../middlewares/authorization');

module.exports = function (app) {
  // user routes
  app.post('/api/v1/auth/login', userController.login);
  app.get('/api/v1/auth/logout', userController.logout);
  app.get('/api/v1/users', userController.index);
  app.post('/api/v1/users', userController.new);
  app.get('/api/v1/users/:id', acl.authenticated, userController.show);
  app.put('/api/v1/users/:id', acl.authenticated, userController.edit);
  app.delete('/api/v1/users/:id', userController.delete);

  // message routes
  app.get('/api/v1/messages', messageController.index);
  app.post('/api/v1/messages', messageController.new);
  app.get('/api/v1/messages/:id', messageController.show);
  app.put('/api/v1/messages/:id', messageController.edit);
  app.post('/api/v1/messages/send', messageController.send);
  app.delete('/api/v1/messages/:id', messageController.delete);

  // transaction routes
  app.get('/api/v1/transactions', transactionController.index);
  app.post('/api/v1/transactions', transactionController.new);
  app.put('/api/v1/transactions/:id', transactionController.edit);
  app.get('/api/v1/transactions/:id', transactionController.show);
  app.delete('/api/v1/transactions/:id', transactionController.delete);
};
