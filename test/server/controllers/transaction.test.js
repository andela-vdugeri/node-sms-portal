'use strict';

var transactionController = require('../../../server/controllers/transaction'),
  models = require('../../../server/models'),
  httpMocks = require('node-mocks-http'),
  should = require('should'),
  Q = require('q');


describe('Transaction controller', function () {
  var mockUser,
    mockTransaction,
    res,
    userId,
    error;

  beforeEach(function (done) {
    mockUser = {
      username: 'jonsnow',
      email: 'jonsnow@got.com',
      password: 'youknonothingjonsnow',
      firstName: 'Jon',
      lastName: 'Snow'
    };

    mockTransaction = {
      messageUnits: 22,
      receivers: ['2323232', '232323232', '989898982932']
    };

    res = httpMocks.createResponse({
      eventEmitter: require('events').EventEmitter
    });

    error = { message: 'An error occured' };

    models.User.create(mockUser).then(function (user) {
      mockTransaction.user_id = user.id
      userId = user.id;
      done();
    });
  });

  afterEach(function (done) {
    models.Transaction.destroy({ where: {} }).then(function () {
      models.User.destroy({ where: {} }).then(function () {
        done();
      });
    });
  });

  describe('#index', function () {
    beforeEach(function (done) {
      models.Transaction.create(mockTransaction).then(function () {
        done();
      });
    });

    describe('No Errors', function () {
      it('should fetch all transaction records', function (done) {
        var req = httpMocks.createRequest();
        transactionController.index(req, res);

        res.on('end', function () {
          var data = JSON.parse(res._getData());
          should.exist(data);
          data.length.should.equal(1);
          done();
        });
      });
    });

    describe('Errors', function () {
      var promise = models.Transaction.findAll;

      before(function () {
        var deferred = Q.defer();
        models.Transaction.findAll = function () {
          return deferred.promise;
        };
        deferred.reject(error);
      });

      after(function () {
        models.Transaction.findAll = promise;
      });

      it('should return status code 500', function (done) {
        var req = httpMocks.createRequest();
        transactionController.index(req, res);
        res.on('end', function () {
          var data = JSON.parse(res._getData());
          res.statusCode.should.equal(500);
          data.message.should.be.exactly(error.message);
          done();
        });
      });
    });
  });

  describe('#new', function () {
    beforeEach(function (done) {
      models.Transaction.destroy({ where: {} }).then(function () {
        done();
      });
    });

    describe('No Errors', function () {
      it('should create a transaction record', function (done) {
        var req = httpMocks.createRequest({
          body: {
            recivers: ['123232', '232323', '232423231'],
            messageUnits: 22,
            user_id: userId
          }
        });

        transactionController.new(req, res);
        res.on('end', function () {
          var data = JSON.parse(res._getData());
          should.exist(data);
          data.messageUnits.should.equal(22);
          res.statusCode.should.equal(200);
          done();
        });
      });
    });

    describe('Errors', function () {
      var promise = models.Transaction.create;
      before(function () {
        var deferred = Q.defer();
        models.Transaction.create = function () {
          return deferred.promise;
        };
        deferred.reject(error);
      });

      after(function () {
        models.Transaction.create = promise;
      });

      it('should return status code 500', function (done) {
        var req = httpMocks.createRequest();
        transactionController.new(req, res);
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
      models.Transaction.create(mockTransaction).then(function (trans) {
        id = trans.id;
        done();
      });
    });

    afterEach(function (done) {
      models.Transaction.destroy({ where: {} }).then(function () {
        done();
      });
    });

    describe('No Errors', function () {
      it('should find a Transaction from the  database', function (done) {
        var req = httpMocks.createRequest({
          params: {
            id: id
          }
        });
        transactionController.show(req, res);
        res.on('end', function () {
          var data = JSON.parse(res._getData());
          data.messageUnits.should.equal(mockTransaction.messageUnits);
          data.receivers.should.be.instanceOf(Array);
          done();
        });
      });
      it('should return 404 for inexistent record', function (done) {
        var req = httpMocks.createRequest({
          params: {
            id: 2323232
          }
        });
        transactionController.show(req, res);
        res.on('end', function () {
          var data = JSON.parse(res._getData());
          res.statusCode.should.equal(404);
          data.message.should.equal('Transaction record not found');
          done();
        });
      });
    });

    describe('Errors', function () {
      var promise = models.Transaction.findById;

      beforeEach(function (done) {
        var deferred = Q.defer();
        models.Transaction.findById = function () {
          return deferred.promise;
        };
        deferred.reject(error);
        done();
      });

      afterEach(function (done) {
        models.Transaction.findById = promise;
        done();
      });

      it('should return status code 500', function (done) {
        var req = httpMocks.createRequest({
          params: {
            id: id
          }
        });
        transactionController.show(req, res);
        res.on('end', function () {
          var data = JSON.parse(res._getData());
          // res.statusCode.should.eqaual(500);
          data.message.should.equal(error.message);
          done();
        });
      });
    });
  });

  describe('#edit', function () {
    var id, updatedTransaction;

    beforeEach(function (done) {
      updatedTransaction = {
        messageUnits: 24,
        receivers: ['2323232', '232323232', '989898982932', '34343434343'],
        user_id: userId
      }
      models.Transaction.create(mockTransaction).then(function (trans) {
        id = trans.id;
        done();
      });
    });

    afterEach(function (done) {
      models.Transaction.destroy({ where: {} }).then(function () {
        done();
      });
    });

    describe('No errors', function () {
      it('should update a transaction', function (done) {
        var req = httpMocks.createRequest({
          params: {
            id: id
          },
          body: updatedTransaction
        });

        transactionController.edit(req, res);
        res.on('end', function () {
          var data = JSON.parse(res._getData());
          res.statusCode.should.equal(200);
          should.exist(data);
          data.messageUnits.should.equal(updatedTransaction.messageUnits);
          data.receivers.length.should.equal(updatedTransaction.receivers.length);
          done();
        });
      });

      it('should return 404 for non-existent record', function (done) {
        var req = httpMocks.createRequest({
          params: {
            id: 223232
          },
          body: updatedTransaction
        });

        transactionController.edit(req, res);
        res.on('end', function () {
          var data = JSON.parse(res._getData());
          res.statusCode.should.equal(404);
          data.message.should.equal('Transaction records not found');
          done();
        });
      });
    });

    describe('Errors', function () {
      describe('Find by id fails', function () {
        var promise = models.Transaction.findById;
        before(function () {
          var deferred = Q.defer();
          models.Transaction.findById = function () {
            return deferred.promise;
          }
          deferred.reject(error);
        });

        after(function () {
          models.Transaction.findById = promise;
        });

        it('should return status code 500', function (done) {
          var req = httpMocks.createRequest();
          transactionController.edit(req, res);
          res.on('end', function () {
            var data = JSON.parse(res._getData());
            res.statusCode.should.equal(500);
            data.message.should.equal(error.message);
            done();
          });
        });
      })

      describe('Update fails', function () {
        var promise = models.Transaction.Instance.prototype.save;
        beforeEach(function (done) {
          var deferred = Q.defer();
          models.Transaction.Instance.prototype.save = function () {
            return deferred.promise;
          }
          deferred.reject(error);
          done();
        });

        afterEach(function (done) {
          models.Transaction.Instance.prototype.save = promise;
          done();
        });
        it('should return 500 status code', function (done) {
          var req = httpMocks.createRequest({
            params: {
              id: id
            }
          });
          transactionController.edit(req, res);
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
    var id, req;
    beforeEach(function (done) {
      models.Transaction.create(mockTransaction).then(function (trans) {
        id = trans.id;
        done();
      });
    });

    afterEach(function (done) {
      models.Transaction.destroy({ where: {}}).then(function () {
        done();
      });
    });

    describe('No errors', function () {
      it('should delete a transaction record', function (done) {
        req = httpMocks.createRequest({
          params: {
            id: id
          }
        });

        transactionController.delete(req, res);
        res.on('end', function () {
          var data = JSON.parse(res._getData());
          res.statusCode.should.equal(200);
          data.message.should.equal('Transaction record deleted');
          done();
        });
      });

      it('should return a 404 for inexistent record', function (done) {
        req = httpMocks.createRequest({
          params: {
            id: 2321224
          }
        });

        transactionController.delete(req, res);
        res.on('end', function () {
          var data = JSON.parse(res._getData());
          res.statusCode.should.equal(404);
          data.message.should.equal('Transaction record not found');
          done();
        });
      });
    });

    describe('Errors', function (done) {
      describe('Find by id fails', function () {
        var promise = models.Transaction.findById;
        before(function () {
          var deferred = Q.defer();
          models.Transaction.findById = function () {
            return deferred.promise;
          };
          deferred.reject(error);
        });

        after(function () {
          models.Transaction.findById = promise;
        });

        it('should return status code 500', function (done) {
          var req = httpMocks.createRequest();
          transactionController.delete(req, res);
          res.on('end', function () {
            var data = JSON.parse(res._getData());
            res.statusCode.should.equal(500);
            data.message.should.equal(error.message);
            done();
          });
        });
      });
      describe('Delete fails', function () {
        var promise = models.Transaction.Instance.prototype.destroy;
        before(function () {
          var deferred = Q.defer();
          models.Transaction.Instance.prototype.destroy = function () {
            return deferred.promise;
          };
          deferred.reject(error);
        });

        after(function () {
          models.Transaction.Instance.prototype.destroy = promise;
        });

        it('should return a  500 status code', function (done) {
          var req = httpMocks.createRequest({
            params: {
              id: id
            }
          });
          transactionController.delete(req, res);
          res.on('end', function () {
            var data = JSON.parse(res._getData());
            //data.message.statusCode.should.equal(500);
            data.message.should.equal(error.message);
            done();
          });
        });
      });
    });
  });
});
