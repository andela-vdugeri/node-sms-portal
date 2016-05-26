'use strict';

var moment = require('moment'),
  should = require('should'),
  httpMocks = require('node-mocks-http'),
  Q = require('q'),
  models = require('../../../server/models'),
  scheduleController = require('../../../server/controllers/schedule'),
  res, error,
  mockUser, mockSchedule;


describe('Schedule Controller', function () {
  mockUser = {
    username: 'JohnDoe',
    password: 'super-secret-password',
    email: 'testuser@example.com',
    firstName: 'John',
    lastName: 'Doe'
  };

  mockSchedule = {
    message: 'Test message',
    sendTime: moment().add(1, 'days').valueOf(),
    receivers: ['343534343', '3535363434', '57578567565']
  };

  res = httpMocks.createResponse({
    eventEmitter: require('events').EventEmitter
  });

  error = { message: 'An error occured' };

  beforeEach(function (done) {
    models.ScheduledSms.destroy({ where: {} }).then(function () {
      models.User.destroy({ where: {} }).then(function () {
        models.User.create(mockUser).then(function (user) {
          mockSchedule.user_id = user.id;
          done();
        });
      });
    });
  });

  afterEach(function (done) {
    models.ScheduledSms.destroy({ where: {} }).then(function () {
      models.User.destroy({ where: {} }).then(function () {
        done();
      });
    });
  });

  describe('#index', function () {
    describe('No Errors', function () {
      it('should fetch all schedules in the database', function (done) {
        var req = httpMocks.createRequest();
        scheduleController.index(req, res);
        res.on('end', function () {
          var data = JSON.parse(res._getData());
          res.statusCode.should.equal(200);
          data.should.be.instanceOf(Array);
          done();
        });
      });
    });
  });
});
