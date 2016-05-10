'use strict';

var should = require('should'),
  models = require('../../../server/models');



describe('Subscription model', function () {
  var mockUser,
    mockSubscription;

  beforeEach(function (done) {
    mockUser = {
      username: 'jonsnow',
      email: 'jonsnow@got.com',
      password: 'youknonothingjonsnow',
      firstName: 'Jon',
      lastName: 'Snow'
    };

    mockSubscription = {
      messageUnits: 22
    };

    models.Subscription.destroy({ where: {}}).then(function () {
      models.Subscription.destroy({ where: {}}).then(function () {
        models.User.create(mockUser).then(function (user) {
          mockSubscription.user_id = user.id;
          done();
        });
      });
    });
  });

  afterEach(function (done) {
    models.Subscription.destroy({ where: {}}).then(function () {
      models.User.destroy({ where: {} }).then(function () {
        done();
      });
    });
  });

  it('should create a subscription in the database', function (done) {
    models.Subscription.create(mockSubscription).then(function (sub) {
      should.exist(sub);
      sub.user_id.should.equal(mockSubscription.user_id);
      sub.messageUnits.should.equal(mockSubscription.messageUnits);
      done();
    });
  });

  it('should have toJson instance method that removes timestamps', function (done) {
    models.Subscription.create(mockSubscription).then(function (sub) {
      var subJSON = sub.toJson();
      should.not.exist(subJSON.created_at);
      should.not.exist(subJSON.updated_at);
      done();
    });
  });

  it('should update a subecription in the database', function (done) {
    models.Subscription.create(mockSubscription).then(function (sub) {
      sub.messageUnits = 33;
      sub.save().then(function (_sub) {
        should.exist(_sub);
        _sub.messageUnits.should.not.equal(mockSubscription.messageUnits);
        _sub.messageUnits.should.equal(33);
        done();
      });
    });
  });

  it('should find a subscription record', function (done) {
    models.Subscription.create(mockSubscription).then(function (sub) {
      models.Subscription.findOne({
        where: {
          id: sub.id
        }
      }).then(function (_sub) {
        should.exist(_sub);
        _sub.messageUnits.should.equal(mockSubscription.messageUnits);
        _sub.user_id.should.equal(mockSubscription.user_id);
        done();
      });
    });
  });

  it('should delete a subscription record', function (done) {
    models.Subscription.create(mockSubscription).then(function (sub) {
      models.Subscription.destroy({
        where: {
          id: sub.id
        }
      }).then(function () {
        models.Subscription.findOne({
          where: {
            id: sub.id
          }
        }).then(function (_sub) {
          should.not.exist(_sub);
          done();
        });
      });
    });
  });
});
