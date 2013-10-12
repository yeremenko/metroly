var routes = {};

routes.home = function (req, res) {

  console.log('home view requested');

  if (req.user) {
    return res.redirect('/users/' + req.user.profile.username);
  }
  res.render('home');
};


routes.getBuses = function (req, res) {

  var city = req.params.city;

  var buses = {
    nyc: {
      brooklyn: ['b63'],
      x: ['x1']
    }
  };


  res.send(JSON.stringify(city ? buses[city] : buses));

};


module.exports = routes;