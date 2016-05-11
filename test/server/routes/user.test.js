// 'use strict';
//
// var _ = require('lodash'),
//   request = require('supertest'),
//   express = require('express'),
//   bodyParser = require('body-parser'),
//   models = require('../../../server/models'),
//   app = express();
//
//
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({
//   extended: true
// }));
//
// require('../../../server/controllers')(app);
//
// describe('User routes', function () {
//   var mockUsers = [{
//     username: 'JohnDoe',
//     password: 'super-secret-password',
//     email: 'testuser@example.com',
//     firstName: 'John',
//     lastName: 'Doe'
//   }, {
//     username: 'JaneDoe',
//     password: 'super-awesome-password',
//     email: 'janedoe@test.com',
//     firstName: 'Jane',
//     lastName: 'Doe',
//   }, {
//     username: 'Sally',
//     password: 'Youcantseeme',
//     email: 'sally@example.com',
//     firstName: 'Sally',
//     lastName: 'Classified'
//   }];
//
//   beforeEach(function (done) {
//     models.User.bulkCreate(mockUsers).then(function (users) {
//       done();
//     });
//   });
//
//   afterEach(function (done) {
//     models.User.destroy({ where: {} }).then(function () {
//       done();
//     });
//   });
//
//   describe('GET /users', function () {
//     it('should return all users', function (done) {
//       request(app)
//         .get('/api/v1/users')
//         .expect(200)
//         .end(function (err, res) {
//           if (err) {
//             return done(err);
//           }
//           res.body.length.should.equal(3);
//           done();
//         });
//     });
//   });
// });
