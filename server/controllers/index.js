'use strict';

// load controllers
var userController = require('./user.controller');

module.exports = function (app) {
  app.get('/api/v1/users', userController.index);
  app.post('/api/v1/users', userController.new);
  app.get('/api/v1/users/:id', userController.show);
  app.put('/api/v1/users/:id', userController.edit);
  app.delete('/api/v1/users/:id', userController.delete);
};
