'use strict';

var should = require('should'),
  models = require('../../../server/models');


describe('Role model', function () {
  var mockRole;

  beforeEach(function (done) {
    mockRole = {
      name: 'user'
    };

    models.Role.destroy({ where: {} }).then(function () {
      done();
    });
  });

  afterEach(function (done) {
    models.Role.destroy({ where: {} }).then(function () {
      done();
    });
  });

  it('should create a role in the database', function (done) {
    models.Role.create(mockRole).then(function (role) {
      should.exist(role);
      role.name.should.equal(mockRole.name);
      done();
    });
  });

  it('should have a toJson instance methods that removes timestamps', function (done) {
    models.Role.create(mockRole).then(function (role) {
      var roleJSON = role.toJson();
      should.not.exist(roleJSON.created_at);
      should.not.exist(roleJSON.updated_at);
      done();
    });
  });

  it('should find a role in the database', function (done) {
    models.Role.create(mockRole).then(function (role) {
      models.Role.findOne({
        where: {
          id: role.id
        }
      }).then(function (_role) {
        should.exist(_role);
        _role.name.should.equal(mockRole.name);
        done();
      });
    });
  });

  it('should update a role in the database', function (done) {
    models.Role.create(mockRole).then(function (role) {
      role.name = 'Admin';
      role.save().then(function (_role) {
        _role.name.should.equal('Admin');
        done();
      });
    });
  });

  it('should delete a role in the database', function (done) {
    models.Role.create(mockRole).then(function (role) {
      models.Role.destroy({
        where: {
          id: role.id
        }
      }).then(function () {
        models.Role.findOne({
          where: {
            id: role.id
          }
        }).then(function (_role) {
          should.not.exist(_role);
          done();
        });
      });
    });
  });
});
