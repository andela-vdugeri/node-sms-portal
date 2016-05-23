'use strict';

var Q = require('q'),
  models = require('../../../server/models'),
  should = require('should'),
  httpMocks = require('node-mocks-http'),
  userController = require('../../../server/controllers/user');


describe('User controller', function () {
  var mockUsers,
    res;

  beforeEach(function (done) {
    mockUsers = [{
      username: 'JohnDoe',
      password: 'super-secret-password',
      email: 'testuser@example.com',
      firstName: 'John',
      lastName: 'Doe'
    }, {
      username: 'JaneDoe',
      password: 'super-awesome-password',
      email: 'janedoe@test.com',
      firstName: 'Jane',
      lastName: 'Doe',
    }, {
      username: 'Sally',
      password: 'Youcantseeme',
      email: 'sally@example.com',
      firstName: 'Sally',
      lastName: 'Classified'
    }];

    res = httpMocks.createResponse({
      eventEmitter: require('events').EventEmitter
    });

    models.sequelize.sync({ force: true }).then(function () {
      done();
    });
  });

  describe('#index', function () {
    beforeEach(function (done) {
      models.User.destroy({ where: {} }).then(function () {
        models.User.bulkCreate(mockUsers).then(function (users) {
          done();
        });
      });
    });

    afterEach(function (done) {
      models.User.destroy({ where: {} }).then(function () {
        done();
      });
    });

    describe('No Errors', function () {
      it('should return all users in the database', function (done) {
        var req = httpMocks.createRequest();
        userController.index(req, res);
        res.on('end', function () {
          var data = JSON.parse(res._getData());
          data.should.be.instanceOf(Array);
          data.length.should.equal(3);
          data[0].username.should.equal(mockUsers[0].username);
          done();
        });
      });
    });

    describe('Errors', function () {
      var promise = models.User.findAll(),
        error = { message: 'An error occured' };

      before(function () {
        var deferred = Q.defer();
        models.User.findAll = function () {
          return deferred.promise;
        };
        deferred.reject(error);
      });

      after(function () {
        models.User.findAll = promise;
      });

      it('should return a 500 status code', function () {
        var req = httpMocks.createRequest();
        userController.index(req, res);
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
    describe('No Error', function () {
      it('should create a new user in the database', function (done) {
        var req = httpMocks.createRequest({
          body: mockUsers[0]
        });

        userController.new(req, res);
        res.on('end', function () {
          var data = JSON.parse(res._getData());
          should.exist(data);
          data.username.should.equal(mockUsers[0].username);
          data.firstName.should.equal(mockUsers[0].firstName);
          done();
        });
      });
    });

    describe('Errors', function () {
      var promise = models.User.create,
        error = { message: 'An error occured'};

      before(function () {
        var deferred = Q.defer();
        models.User.create = function () {
          return deferred.promise
        };
        deferred.reject(error);
      });

      after(function () {
        models.User.create = promise;
      });

      it('should respond with a 500 status code', function(done) {
        var req = httpMocks.createRequest({
          body: mockUsers[0]
        });
        userController.new(req, res);
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
      models.User.create(mockUsers[0]).then(function (user) {
        id = user.id;
        done();
      });
    });

    afterEach(function (done) {
      models.User.destroy({ where: {} }).then(function () {
        done();
      });
    });

    describe('No errors', function () {

      it('should fetch a user', function (done) {
        var req = httpMocks.createRequest({
          params: {
            id: id
          }
        });
        userController.show(req, res);
        res.on('end', function () {
          var data = JSON.parse(res._getData());
          should.exist(data);
          res.statusCode.should.equal(200);
          data.username.should.equal(mockUsers[0].username);
          data.firstName.should.equal(mockUsers[0].firstName);
          done();
        });
      });

      it('should return 404 for inexistent user', function (done) {
        var req = httpMocks.createRequest({
          params: {
            id: 1232423
          }
        });
        userController.show(req, res);
        res.on('end', function () {
          var data = JSON.parse(res._getData());
          res.statusCode.should.equal(404);
          data.message.should.equal('User not found');
          done();
        });
      });
    });

    describe('Errors', function () {
      var promise = models.User.findOne,
        error = { message: 'An error occured'};

      before(function () {
        var deferred = Q.defer();
        models.User.findOne = function () {
          return deferred.promise;
        }
        deferred.reject(error);
      });

      after(function () {
        models.User.findOne = promise;
      });

      it('should return status code 500', function (done) {
        var req = httpMocks.createRequest();
        userController.show(req, res);
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
    var id;

    beforeEach(function (done) {
      models.User.destroy({ where: {} }).then(function () {
        models.User.create(mockUsers[1]).then(function (_user) {
          id = _user.id;
          done();
        });
      });
    });

    afterEach(function (done) {
      models.User.destroy({ where: {} }).then(function () {
        done();
      });
    });

    describe('No Errors', function () {
      var user = {
        email: 'updatedemail@example.com',
        firstName: 'UpdatedFirstName',
        lastName: 'UpdatedLastName',
        username: 'UpdatedUsername'
      };

      it('should find and edit a user', function (done) {
        var req = httpMocks.createRequest({
          params: {
            id: id
          },
          body: {
            user: user
          }
        });

        userController.edit(req, res);
        res.on('end', function () {
          var data = JSON.parse(res._getData());
          res.statusCode.should.equal(200);
          should.exist(data);
          data.username.should.equal(user.username);
          data.firstName.should.equal(user.firstName);
          done();
        });
      });

      it('should respond with a 404 status code', function (done) {
        var req = httpMocks.createRequest({
          params: {
            id: 2121312
          }
        });

        userController.edit(req, res);
        res.on('end', function () {
          var data = JSON.parse(res._getData());
          res.statusCode.should.equal(404);
          data.message.should.equal('User not found');
          done();
        });
      });
    });

    describe('Errors', function () {
      var error = { message: 'An error occured' },
        promise = models.User.findById;

      before(function () {
        var deferred = Q.defer();
        models.User.findById = function () {
          return deferred.promise;
        }
        deferred.reject(error);
      });

      after(function () {
        models.User.findById = promise;
      });

      it ('should respond with status code 500', function (done) {
        var req = httpMocks.createRequest({
          params: {
            id: id
          }
        });

        userController.edit(req, res);
        res.on('end', function () {
          var data = JSON.parse(res._getData());
          res.statusCode.should.equal(500);
          data.message.should.equal(error.message);
          done();
        });
      });
    });
  });

  describe('#delete', function () {
    var id;
    beforeEach(function (done) {
      models.User.create(mockUsers[0]).then(function (user) {
        id = user.id;
        done();
      });
    });

    afterEach(function (done) {
      models.User.destroy({ where: {} }).then(function () {
        done();
      });
    });

    describe('No errors', function () {

      it('should delete a user', function (done) {
        var req = httpMocks.createRequest({
          params: {
            id: id
          }
        });
        userController.delete(req, res);
        res.on('end', function () {
          var data = JSON.parse(res._getData());
          res.statusCode.should.equal(200);
          data.message.should.equal('User removed');
          done();
        });
      });

      it('should return 404 for inexistent user', function (done) {
        var req = httpMocks.createRequest({
          params: {
            id: 3434343
          }
        });
        userController.delete(req, res);
        res.on('end', function () {
          var data = JSON.parse(res._getData());
          res.statusCode.should.equal(404);
          data.message.should.equal('User not found');
          done();
        });
      });
    });

    describe('Errors', function () {
      var error = { message: 'An error occured'};

      describe('find user fails', function () {
        var promise = models.User.findOne;

        before(function () {
          var deferred = Q.defer();
          models.User.findOne = function () {
            return deferred.promise;
          }
          deferred.reject(error);
        });

        after(function () {
          models.User.findOne = promise;
        });

        it ('should return status code 500', function (done) {
          var req = httpMocks.createRequest({
            params: {
              id: id
            }
          });
          userController.delete(req, res);
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

  describe('#login', function () {
    var username, password;
    beforeEach(function (done) {
      models.User.destroy({ where: {} }).then(function () {
        models.User.create(mockUsers[2]).then(function (user) {
          username = user.username;
          password = mockUsers[2].password;
          done();
        });
      });
    });

    afterEach(function (done) {
      models.User.destroy({ where: {} }).then(function () {
        done();
      });
    });

    describe('No Errors', function () {
      it('should validate a user', function (done) {
        var req = httpMocks.createRequest({
          body: {
            username: username,
            password: password
          }
        });
        userController.login(req, res);
        res.on('end', function () {
          var data = JSON.parse(res._getData());
          should.exist(data);
          data.user.username.should.equal(mockUsers[2].username);
          should.exist(data.token);
          should.exist(data.expires);
          done();
        });
      });
    });
  });
});
