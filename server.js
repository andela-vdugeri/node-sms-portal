'use strict';


var cookieParser = require('cookie-parser'),
  express = require('express'),
  bodyParser = require('body-parser'),
  models = require('./server/models'),
  controllers = require('./server/controllers'),
  app = express(),
  env = process.env.NODE_ENV || 'development',
  config = require('./server/config/config')[env],
  t = require('moment'),
  cors = require('cors'),
  logger = require('winston');


app.set('port', process.env.PORT || 3000);
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(cors());
app.use(function (req, res, next) {
  if (env === 'development') {
    logger.info(t().format('HH:MM'), req.method, req.url, req.socket.bytesRead);
  }
  // tell the client the authentication url
  res.cookie('authUrl', config.auth.url);

  // onto the next
  next();
});

app.use(express.static(process.cwd() + '/public'));


models.sequelize.sync().then(function () {
  // load server routes
  controllers(app);
  // fire up the server
  app.listen(app.get('port'), function () {
    logger.info('>> magic happens on port ' + app.get('port'));
  });
});
