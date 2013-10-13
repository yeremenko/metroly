var routes = {};

routes.init = function (app, mongoose) {
  routes.app = app;
  routes.mongoose = mongoose;
};

routes.home = function (req, res) {

  console.log('home view requested');

  if (req.user) {
    return res.redirect('/users/' + req.user.profile.username);
  }
  res.render('home');
};

// XX Figure out how to a nice way to break the coupling between MTA and routes.getBuses.
var mta = require('./scripts/mta-buses');

routes.getBuses = function (req, res) {
  var city = req.params.city;
  var BusLine = routes.mongoose.model('BusLine');

  res.contentType('application/json')

  BusLine.find({city: city}, function (err, buses) {
    console.log('called back with this ', buses);
    if (buses.length > 0) {
      return res.send(JSON.stringify(mta.sortDbByBorough(buses)));
    } else {
      return res.send(JSON.stringify({error: 'Invalid request'}));
    }
  });
};

module.exports = routes;