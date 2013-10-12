/*global define */

define(['jquery', 'backbone', 'application'], function ($, Backbone, App) {
  "use strict";

  var Router, self = this;

  Router = Backbone.Router.extend({
    routes: {
      'bus/:bus': 'selectBus',
      'bus/:bus/:dir': 'selectDirection',
      '*default': 'default'
    }
  });

  Router.initialize = function () {
    var router = new Router();
    var app = new App();

    $(function () {
      router.on('route:selectBus', function (busline) {
        app.selectBus(busline);
      });

      router.on('route:selectDirection', function (bus, dir) {
        app.selectBus(bus);
        app.selectDirection(dir);
      });

      router.on('route:default', function (action) {
        app.toHomeState();
      });
    });

    Backbone.history.start({pushState: false});
  };

  return Router;
});