'use strict';

var should = require('should'),
  models = require('../../../server/models'),
  moment = require('moment');


describe('SchdeduledSms model', function () {
  var user,
    mockSchedule;

  beforeEach(function (done) {
    user = {
      username: 'jonsnow',
      email: 'jonsnow@got.com',
      password: 'youknonothingjonsnow',
      firstName: 'Jon',
      lastName: 'Snow'
    };

    mockSchedule = {
      message: 'This is a test message',
      sendTime: moment(),
      receivers: ['2323232', '23290909', '9898982787'],
      sent: false
    };

    models.ScheduledSms.destroy({ where: {} }).then(function () {
      models.User.destroy({ where: {} }).then(function () {
        models.User.create(user).then(function (user) {
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

  it('should have toJson instance method that deletes timestamps from response', function (done) {
    models.ScheduledSms.create(mockSchedule).then(function (schedule) {
      var scheduleJSON = schedule.toJson();
      should.not.exist(scheduleJSON.created_at);
      should.not.exist(scheduleJSON.updated_at);
      done();
    });
  });

  it('should create a schedule in the database', function (done) {
    models.ScheduledSms.create(mockSchedule).then(function (schedule) {
      should.exist(schedule);
      schedule.message.should.equal(mockSchedule.message);
      schedule.sent.should.equal(mockSchedule.sent);
      schedule.receivers.should.be.instanceOf(Array);
      schedule.receivers[0].should.equal(mockSchedule.receivers[0]);
      done();
    });
  });

  it('should find a schedule in the database', function (done) {
    models.ScheduledSms.create(mockSchedule).then(function (schedule) {
      models.ScheduledSms.findOne({
        where: {
          id: schedule.id
        }
      }).then(function (_schedule) {
        _schedule.message.should.equal(mockSchedule.message);
        _schedule.receivers.should.be.instanceOf(Array);
        done();
      });
    });
  });

  it('should udpate a schedule in the database', function (done) {
    models.ScheduledSms.create(mockSchedule).then(function (schedule) {
      schedule.message = 'This is an updated message';
      schedule.save().then(function (_schedule) {
        should.exist(_schedule);
        _schedule.message.should.equal('This is an updated message');
        done();
      });
    });
  });

  it('should delete a schedule in the database', function (done) {
    models.ScheduledSms.create(mockSchedule).then(function (schedule) {
      models.ScheduledSms.destroy({
        where: {
          id: schedule.id
        }
      }).then(function () {
        models.ScheduledSms.findOne({
          where: {
            id: schedule.id
          }
        }).then(function (_schedule) {
          should.not.exist(_schedule);
          done();
        });
      });
    });
  });
});
