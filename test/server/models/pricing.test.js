'use strict';

var should = require('should'),
  models = require('../../../server/models');


describe('Pricing model', function () {
  var pricing;

  beforeEach(function (done) {
    pricing = {
      unitPrice: 1.30
    };

    models.Pricing.destroy({ where: {} }).then(function () {
      done();
    })
  });

  afterEach(function (done) {
    models.Pricing.destroy({ where: {} }).then(function () {
      done();
    });
  });

  it('should create a pricing policy in the database', function (done) {
    models.Pricing.create(pricing).then(function (price) {
      should.exist(price);
      Number(price.unitPrice).should.equal(pricing.unitPrice);
      done();
    });
  });

  it('should have instance method toJson that removes timestamps from response', function (done) {
    models.Pricing.create(pricing).then(function (price) {
      var priceJSON = price.toJson();
      should.not.exist(priceJSON.created_at);
      should.not.exist(priceJSON.updated_at);
      done();
    });
  });

  it('should find a pricing policy', function (done) {
    models.Pricing.create(pricing).then(function (price) {
      models.Pricing.findOne({
        where: {
          id: price.id
        }
      }).then(function (_price) {
        should.exist(_price);
        Number(_price.unitPrice).should.equal(pricing.unitPrice);
        _price.id.should.equal(price.id);
        done();
      });
    });
  });

  it('should update a pricing policy', function (done) {
    models.Pricing.create(pricing).then(function (price) {
      price.unitPrice = 2.0;
      price.save().then(function (_price) {
        Number(_price.unitPrice).should.equal(2.0);
        done();
      });
    });
  });

  it('should delete a pricing policy in the database', function (done) {
    models.Pricing.create(pricing).then(function (price) {
      models.Pricing.destroy({
        where: {
          id: price.id
        }
      }).then(function () {
        models.Pricing.findOne({
          where: {
            id: price.id
          }
        }).then(function (_price) {
          should.not.exist(_price);
          done();
        });
      });
    });
  });
});
