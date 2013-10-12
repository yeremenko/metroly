var express = require('express')
  , mongoose = require('mongoose')
  , http = require('http')
  , jade = require('jade')
  , path = require('path')
  , routes = require('./routes')
  , config = require('./config')['prod']

var app = express();

mongoose.connect(config.MONGO_URL);
require('./schemas.js')(app, mongoose);

app.configure(function () {
  app.engine('jade', jade.__express);

  app.set('port', config.PORT);
  app.set('ip', config.IP);
  app.set('views', './templates');
  app.set('view engine', 'jade');
  app.set('strict routing', true);

  app.use(express.static(path.join(__dirname, 'public')));
  app.use(express.methodOverride());
  app.use(express.cookieParser());
  app.use(express.bodyParser());
  app.use(express.cookieParser());
  app.use(express.session({ secret: 'keyboard secret' }));
});

app.get('/', routes.home);
app.get('/v1/buses/:city', routes.getBuses);

function ensureAuthenticated(req, res, next) {
  console.log('Ensure auth called');
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/#login');
}

app.listen(app.get('port'), app.get('ip'));
console.log('Listening on ' + app.get('ip') + ':' + app.get('port') + ' ...');