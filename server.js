'use strict';

var env = process.env.NODE_ENV | 'development',
  config = require('./server/config/config'),
  cookieParser = require('cookie-parser'),
  express = require('express'),
  bodyParser = require('body-parser'),
  models = require('./server/models'),
  controllers = require('./server/controllers'),
  app = express();


app.set('port', process.env.PORT || 3000);
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));


models.sequelize.sync().then(function () {
  controllers(app);

  app.listen(app.get('port'), function () {
    console.log('>> magic happens on port ' + app.get('port'));
  });
});
