'use strict';

// load controllers
var userController = require('./user'),
  messageController = require('./message'),
  scheduleController = require('./schedule'),
  roleController = require('./role'),
  paymentController = require('./payment'),
  pricingController = require('./pricing'),
  subscriptionController = require('./subscription'),
  transactionController = require('./transaction'),
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

 // schedule routes
  app.get('/api/v1/schedules', scheduleController.index);
  app.post('/api/v1/schedules', scheduleController.new);
  app.put('/api/v1/schedules/:id', scheduleController.edit);
  app.get('/api/v1/schedules/:id', scheduleController.show);
  app.delete('/api/v1/schedules/:id', scheduleController.delete);

  // payment routes
  app.get('/api/v1/payments', paymentController.index);
  app.post('/api/v1/payments', paymentController.new);
  app.put('/api/v1/payments/:id', paymentController.edit);
  app.get('/api/v1/payments/:id', paymentController.show);
  app.delete('/api/v1/payments/:id', paymentController.delete);

  // pricing routes
  app.get('/api/v1/pricings', pricingController.index);
  app.post('/api/v1/pricings', pricingController.new);
  app.get('/api/v1/pricings/:id', pricingController.show);
  app.put('/api/v1/pricings/:id', pricingController.edit);
  app.delete('/api/v1/pricings/:id', pricingController.delete);

  // role routes
  app.get('/api/v1/roles/', roleController.index);
  app.post('/api/v1/roles', roleController.new);
  app.get('/api/v1/roles/:id', roleController.show);
  app.put('/api/v1/roles/:id', roleController.edit);
  app.delete('/api/v1/roles/:id', roleController.delete);

  // subscription routes
  app.get('/api/v1/subscriptions', subscriptionController.index);
  app.post('/api/v1/subscriptions', subscriptionController.new);
  app.get('/api/v1/subscriptions/:id', subscriptionController.show);
  app.put('/api/v1/subscriptions/:id', subscriptionController.edit);
  app.delete('/api/v1/subscriptions/:id', subscriptionController.delete);
};
