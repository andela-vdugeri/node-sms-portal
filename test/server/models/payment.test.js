'use strict';

var should = require('should'),
  models = require('../../../server/models');


describe('Payment model', function () {
  var mockUser,
    mockPayment;

  beforeEach(function (done) {
    mockUser = {
      username: 'jonsnow',
      email: 'jonsnow@got.com',
      password: 'youknonothingjonsnow',
      firstName: 'Jon',
      lastName: 'Snow'
    };

    mockPayment = {
      amount: 2000,
      description: 'Payment for 4000 units',
      username: 'Testuser',
      status: false
    };

    models.Payment.destroy({ where: {} }).then(function () {
      models.User.destroy({ where: {} }).then(function () {
        models.User.create(mockUser).then(function (user) {
          mockPayment.user_id = user.id;
          done();
        });
      });
    });
  });

  afterEach(function(done) {
    models.Payment.destroy({ where: {} }).then(function () {
      models.User.destroy( {where: {} }).then(function () {
        done();
      });
    });
  });

  it('should create a payment record', function (done) {
    models.Payment.create(mockPayment).then(function (payment) {
      should.exist(payment);
      payment.amount.should.equal(mockPayment.amount);
      payment.username.should.equal(mockPayment.username);
      done();
    });
  });

  it('should have a toJson instance method that removes timestamps from response', function (done) {
    models.Payment.create(mockPayment).then(function (payment) {
      var paymentJSON = payment.toJson();
      should.not.exist(paymentJSON.created_at);
      should.not.exist(paymentJSON.updated_at);
      done();
    });
  });
});
