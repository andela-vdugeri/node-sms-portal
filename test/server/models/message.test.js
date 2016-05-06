'use strict';

var should = require('should'),
  models = require('../../../server/models');


describe('Message model', function () {
  var mockMessage,
    mockTrans,
    mockUser;

  beforeEach(function (done) {
    mockUser = {
      username: 'jonsnow',
      email: 'jonsnow@got.com',
      password: 'youknonothingjonsnow',
      firstName: 'Jon',
      lastName: 'Snow'
    };
    mockTrans = {
      messageUnits: 22,
      receivers: ['2323232', '232323232', '989898982932']
    };
    mockMessage = {
      body: 'Sample message'
    };

    models.Message.destroy({ where: {} }).then(function () {
      models.Transaction.destroy({ where: {} }).then(function () {
        models.User.destroy({ where: {} }).then(function () {
          models.User.create(mockUser).then(function (user) {
            mockTrans.user_id = user.id;
            mockMessage.user_id = user.id;
            models.Transaction.create(mockTrans).then(function (trans) {
              mockMessage.transaction_id = trans.id;
              done();
            });
          });
        });
      });
    });
  });

  afterEach(function (done) {
    models.Message.destroy({ where: {} }).then(function () {
      models.Transaction.destroy({ where: {} }).then(function () {
        models.User.destroy({ where: {} }).then(function () {
          done();
        });
      });
    });
  });

  it('should create a message in the database', function (done) {
    models.Message.create(mockMessage).then(function (message) {
      should.exist(message);
      message.body.should.equal(mockMessage.body);
      message.user_id.should.equal(mockMessage.user_id);
      message.transaction_id.should.equal(mockMessage.transaction_id);
      done();
    });
  });

  it('should have toJson instance method that removes timestamps', function (done) {
    models.Message.create(mockMessage).then(function (message) {
      var messageJSON = message.toJson();
      should.not.exist(messageJSON.created_at);
      should.not.exist(messageJSON.updated_at);
      done();
    });
  });

  it('should find a message in the database', function (done) {
    models.Message.create(mockMessage).then(function (message) {
      models.Message.findOne({
        where: {
          id: message.id
        }
      }).then(function (_message) {
        should.exist(_message);
        _message.body.should.equal(mockMessage.body);
        _message.user_id.should.equal(mockMessage.user_id);
        done();
      });
    });
  });

  it('should update a message', function (done) {
    models.Message.create(mockMessage).then(function (message) {
      message.body = 'Updated sample message';
      message.save().then(function (_message) {
        _message.body.should.equal('Updated sample message');
        done();
      });
    });
  });

  it('should delete a message', function (done) {
    models.Message.create(mockMessage).then(function (message) {
      models.Message.destroy({
        where: {
          id: message.id
        }
      }).then(function () {
        models.Message.findOne({
          where: {
            id: message.id
          }
        }).then(function (_message) {
          should.not.exist(_message);
          done();
        });
      });
    });
  });
});
