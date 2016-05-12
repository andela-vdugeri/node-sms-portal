'use strict';

var should = require('should'),
  models = require('../../../server/models');


describe('User model', function () {
  var mockUser = {
    username: 'jonsnow',
    email: 'jonsnow@got.com',
    password: 'youknonothingjonsnow',
    firstName: 'Jon',
    lastName: 'Snow'
  };
  beforeEach(function (done) {
    models.sequelize.sync().then(function () {
      models.User.destroy({ where: {}}).then(function () {
        done();
      });
    });
  });

  afterEach(function (done) {
    models.User.destroy({ where: {}}).then(function () {
      done();
    });
  });

  it('should create a user in the database', function (done) {
    models.User.create(mockUser).then(function (user) {
      should.exist(user);
      user.username.should.equal(mockUser.username);
      user.firstName.should.equal(mockUser.firstName);
      done();
    });
  });

  it('should have a toJson instance method', function (done) {
    models.User.create(mockUser).then(function (user) {
      var userJSON = user.toJson();
      should.not.exist(userJSON.created_at);
      should.not.exist(userJSON.updated_at);
      done();
    });
  });

  it('should update a user in the database', function (done) {
    models.User.create(mockUser).then(function (user) {
      user.username = 'newUsername',
      user.save().then(function (_user) {
        should.exist(_user);
        _user.username.should.equal('newUsername');
        done();
      });
    });
  });

  it('should find a user in the database', function (done) {
    models.User.create(mockUser).then(function (user) {
      models.User.findOne({
        where: {
          id: user.id
        }
      }).then (function (_user) {
        should.exist(_user);
        _user.username.should.equal(mockUser.username);
        _user.lastName.should.equal(mockUser.lastName);
        done();
      });
    });
  });

  it('should delete a user in the database', function (done) {
    models.User.create(mockUser).then(function (user) {
      models.User.destroy({
        where: {
          id: user.id
        }
      }).then(function () {
        models.User.findOne({
          where: {
            id: user.id
          }
        }).then(function (_user) {
          should.not.exist(_user);
          done();
        });
      });
    });
  });
});
