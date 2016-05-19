'use strict';


var httpMocks = require('node-mocks-http'),
  subscriptionController = require('../../../server/controllers/subscription.controller'),
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
      models.Subscription.create(mockSubscription).then(function (subscription) {
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

      it ('should return status code 500', function (done) {
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
  });
});
