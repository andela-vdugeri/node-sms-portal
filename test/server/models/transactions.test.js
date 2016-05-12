'use strict';


var should = require('should'),
  models = require('../../../server/models');


describe('Tranasction model', function () {
  var mockTrans,
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

    models.Transaction.destroy({ where: {}}).then(function () {
      models.User.destroy({ where: {}}).then(function () {
        models.User.create(mockUser).then(function (user) {
          mockTrans.user_id = user.id;
          done();
        });
      });
    });
  });

  afterEach(function (done) {
    models.Transaction.destroy({ where: {}}).then(function () {
      models.User.destroy({ where: {}}).then(function () {
        done();
      });
    });
  });

  it ('should create a transaction in the database', function (done) {
    models.Transaction.create(mockTrans).then(function (trans) {
      should.exist(trans);
      trans.user_id.should.equal(mockTrans.user_id);
      trans.messageUnits.should.equal(mockTrans.messageUnits);
      trans.receivers.should.be.instanceOf(Array);
      trans.receivers[0].should.equal(mockTrans.receivers[0]);
      done();
    });
  });

  it('should have toJson instance method', function (done) {
    models.Transaction.create(mockTrans).then(function (trans) {
      var transJSON = trans.toJson();
      should.not.exist(transJSON.created_at);
      should.not.exist(transJSON.updated_at);
      done();
    });
  });

  it('should update a transaction in the database', function (done) {
    models.Transaction.create(mockTrans).then(function (trans) {
      trans.messageUnits = 44;
      trans.save().then(function (_trans) {
        should.exist(_trans);
        _trans.messageUnits.should.equal(44);
        done();
      });
    });
  });

  it('should find a transaction', function (done) {
    models.Transaction.create(mockTrans).then(function (trans) {
      models.Transaction.findOne({
        where: {
          id: trans.id
        }
      }).then(function (_trans) {
        should.exist(_trans);
        _trans.messageUnits.should.equal(mockTrans.messageUnits);
        _trans.receivers.should.be.instanceOf(Array);
        done();
      });
    });
  });

  it('should delete a transation in the database', function (done) {
    models.Transaction.create(mockTrans).then(function (trans) {
      models.Transaction.destroy({
        where: {
          id: trans.id
        }
      }).then(function () {
        models.Transaction.findOne({
          where: {
            id: trans.id
          }
        }).then(function (_trans) {
          should.not.exist(_trans);
          done();
        });
      });
    });
  });
});
