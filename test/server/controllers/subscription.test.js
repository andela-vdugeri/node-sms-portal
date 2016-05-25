'use strict';


var httpMocks = require('node-mocks-http'),
  subscriptionController = require('../../../server/controllers/subscription'),
  should = require('should'),
  Q = require('q'),
  models = require('../../../server/models'),
  res, req,
  mockUser, mockSubscription;

describe('Subscription controller', function () {
  mockSubscription = {
    messageUnits: 22
  };

  mockUser = {
    username: 'JohnDoe',
    password: 'super-secret-password',
    email: 'testuser@example.com',
    firstName: 'John',
    lastName: 'Doe'
  };

  beforeEach(function (done) {
    res = httpMocks.createResponse({
      eventEmitter: require('events').EventEmitter
    });

    models.User.create(mockUser).then(function (user) {
      mockSubscription.user_id = user.id;
      done();
    });
  });

  afterEach(function (done) {
    models.User.destroy({ where: {} }).then(function () {
      done();
    });
  });

  describe('#index', function () {
    beforeEach(function (done) {
      models.Subscription.create(mockSubscription).then(function () {
        done();
      });
    });

    afterEach(function (done) {
      models.Subscription.destroy({ where: {} }).then(function () {
        done();
      });
    });

    describe('No Errors', function () {
      it('should find all subscriptions in the database', function (done) {
        req = httpMocks.createRequest();
        subscriptionController.index(req, res);
        res.on('end', function () {
          var data = JSON.parse(res._getData());
          res.statusCode.should.equal(200);
          data.should.be.instanceOf(Array);
          data[0].messageUnits.should.equal(mockSubscription.messageUnits);
          data[0].user_id.should.equal(mockSubscription.user_id);
          done();
        });
      });
    });

    describe('Errors', function () {
      var error = { message: 'An error occured' },
        promise = models.Subscription.findAll;

      beforeEach(function (done) {
        var deferred = Q.defer();
        models.Subscription.findAll = function () {
          return deferred.promise;
        };
        deferred.reject(error);
        done();
      });

      afterEach(function  (done) {
        models.Subscription.findAll = promise;
        done();
      });

      it('should return status code 500', function (done) {
        req = httpMocks.createRequest();
        subscriptionController.index(req, res);
        res.on('end', function () {
          var data = JSON.parse(res._getData());
          res.statusCode.should.equal(500);
          data.message.should.equal(error.message);
          done();
        });
      });
    });
  });

  describe('#new', function () {
    describe('No Errors', function () {
      it('should create a subscription record in the database', function (done) {
        req = httpMocks.createRequest({
          body: mockSubscription
        });

        subscriptionController.new(req, res);
        res.on('end', function () {
          var data = JSON.parse(res._getData());
          res.statusCode.should.equal(200);
          data.messageUnits.should.equal(mockSubscription.messageUnits);
          data.user_id.should.equal(mockSubscription.user_id);
          done();
        });
      });
    });

    describe('Errors', function () {
      var error = { message: 'An error occured' },
        promise = models.Subscription.create;

      beforeEach(function (done) {
        var deferred = Q.defer();
        models.Subscription.create = function () {
          return deferred.promise;
        };
        deferred.reject(error);
        done();
      });

      afterEach(function (done) {
        models.Subscription.create = promise;
        done();
      });

      it('should return a 500 status code', function(done) {
        req = httpMocks.createRequest({
          body: mockSubscription
        });

        subscriptionController.new(req, res);
        res.on('end', function () {
          var data = JSON.parse(res._getData());
          res.statusCode.should.equal(500);
          data.message.should.equal(error.message);
          done();
        });
      });
    });
  });

  describe('#show', function () {
    var id;
    beforeEach(function (done) {
      models.Subscription.create(mockSubscription).then(function (sub) {
        id = sub.id;
        done();
      });
    });

    afterEach(function (done) {
      models.Subscription.destroy({ where: {} }).then(function () {
        done();
      });
    });

    describe('No errors', function () {
      it('should find a subscription record', function (done) {
        req = httpMocks.createRequest({
          params: {
            id: id
          }
        });
        subscriptionController.show(req, res);
        res.on('end', function () {
          var data = JSON.parse(res._getData());
          data.messageUnits.should.equal(mockSubscription.messageUnits);
          data.user_id.should.equal(mockSubscription.user_id);
          done();
        });
      });
    });

    describe('Errors', function () {
      var promise = models.Subscription.findById,
        error = { message: 'An error occured' };

      beforeEach(function (done) {
        var deferred = Q.defer();
        models.Subscription.findById = function () {
          return deferred.promise;
        };
        deferred.reject(error);
        done();
      });

      afterEach(function (done) {
        models.Subscription.findById = promise;
        done();
      });
      it('should return status code 500 ', function (done) {
        req = httpMocks.createRequest({
          params: {
            id: id
          }
        });
        subscriptionController.show(req, res);
        res.on('end', function () {
          var data = JSON.parse(res._getData());
          res.statusCode.should.equal(500);
          data.message.should.equal(error.message);
          done();
        });
      });
    });
  });

  describe('#edit', function () {
    var updatedSubscription = { messageUnits: 44 },
      subId;

    beforeEach(function (done) {
      models.Subscription.create(mockSubscription).then(function (subscription) {
        subId = subscription.id;
        updatedSubscription.user_id = subscription.user_id;
        done();
      });
    });

    afterEach(function (done) {
      models.Subscription.destroy({ where: {} }).then(function () {
        done();
      });
    });

    describe('No Errors', function () {
      it('should update a subscription record', function (done) {
        req = httpMocks.createRequest({
          params: {
            id: subId
          },
          body: updatedSubscription
        });

        subscriptionController.edit(req, res);
        res.on('end', function () {
          var data = JSON.parse(res._getData());
          res.statusCode.should.equal(200);
          data.messageUnits.should.equal(updatedSubscription.messageUnits);
          done();
        });
      });

      it('should return 404 status code for inexistend record', function (done) {
        req = httpMocks.createRequest({
          params: {
            id: 2323232
          }
        });

        subscriptionController.edit(req, res);
        res.on('end', function () {
          var data = JSON.parse(res._getData());
          res.statusCode.should.equal(404);
          data.message.should.equal('Subscription data not found');
          done();
        });
      });
    });

    describe('Errors', function () {
      var error = { message: 'An error occured' };
      describe('Find fails', function () {
        var promise = models.Subscription.findById;
        beforeEach(function (done) {
          var deferred = Q.defer();
          models.Subscription.findById = function () {
            return deferred.promise;
          };
          deferred.reject(error);
          done();
        });

        afterEach(function (done) {
          models.Subscription.findById = promise;
          done();
        });

        it ('should return a  500 status code', function (done) {
          req = httpMocks.createRequest();
          subscriptionController.edit(req, res);
          res.on('end', function () {
            var data = JSON.parse(res._getData());
            res.statusCode.should.equal(500);
            data.message.should.equal(error.message);
            done();
          });
        });
      });

      describe('Update fails', function () {
        var promise = models.Subscription.Instance.prototype.save;
        beforeEach(function (done) {
          var deferred = Q.defer();
          models.Subscription.Instance.prototype.save = function () {
            return deferred.promise;
          };
          deferred.reject(error);
          done();
        });

        afterEach(function (done) {
          models.Subscription.Instance.prototype.save = promise;
          done();
        });

        it('should return a 500 stauts code', function (done) {
          req = httpMocks.createRequest({
            params: {
              id: subId
            },
            body: updatedSubscription
          });

          subscriptionController.edit(req, res);
          res.on('end', function () {
            var data = JSON.parse(res._getData());
            res.statusCode.should.equal(500);
            data.message.should.equal(error.message);
            done();
          });
        });
      });
    });
  });

  describe('#delete', function () {
    var id;

    beforeEach(function (done) {
      models.Subscription.create(mockSubscription).then(function (sub) {
        id = sub.id;
        done();
      });
    });

    describe('No Errors', function () {
      it('should delete a subscription from the database', function (done) {
        req = httpMocks.createRequest({
          params: {
            id: id
          }
        });

        subscriptionController.delete(req, res);
        res.on('end', function () {
          var data = JSON.parse(res._getData());
          res.statusCode.should.equal(200);
          data.message.should.equal('Subscription data deleted');
          done();
        });
      });

      it('should return a 404', function (done) {
        req = httpMocks.createRequest({
          params: {
            id: 34342323
          }
        });

        subscriptionController.delete(req, res);
        res.on('end', function () {
          var data = JSON.parse(res._getData());
          res.statusCode.should.equal(404);
          data.message.should.equal('Subscription data does not exist');
          done();
        });
      });
    });

    describe('Errors', function () {
      var error = { message: 'An error occured' };
      describe('find fails', function () {
        var promise = models.Subscription.findById;
        beforeEach(function (done) {
          var deferred = Q.defer();
          models.Subscription.findById = function () {
            return deferred.promise;
          };
          deferred.reject(error);
          done();
        });

        afterEach(function (done) {
          models.Subscription.findById = promise;
          done();
        });

        it('should return a 500 status code', function (done) {
          req = httpMocks.createRequest({
            params: {
              id: 2323232
            }
          });

          subscriptionController.delete(req, res);
          res.on('end', function () {
            var data = JSON.parse(res._getData());
            res.statusCode.should.equal(500);
            data.message.should.be.exactly(error.message);
            done();
          });
        });
      });
      describe('Destroy fails', function () {
        var promise = models.Subscription.Instance.prototype.destroy;
        beforeEach(function (done) {
          var deferred = Q.defer();
          models.Subscription.Instance.prototype.destroy = function () {
            return deferred.promise;
          };
          deferred.reject(error);
          done();
        });

        afterEach(function (done) {
          models.Subscription.Instance.prototype.destroy = promise;
          done();
        });
        it('should return status code 500', function (done) {
          req = httpMocks.createRequest({
            params: {
              id: id
            }
          });
          subscriptionController.delete(req, res);
          res.on('end', function () {
            var data = JSON.parse(res._getData());
            res.statusCode.should.equal(500);
            data.message.should.equal(error.message);
            done();
          });
        });
      });
    });
  });
});
