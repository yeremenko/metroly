/*jslint nomen: true, unparam: true, indent: 2, browser: true */
/*global define */

define([
  'underscore',
  'backbone',
  'busesnyc'
], function (_, Backbone, MtaBusTime) {

  var MapModel = Backbone.Model.extend({
    defaults: {
      bus: '',
      route: 0 // 0 or 1
    },

    initialize: function () {
      var apiKey = this.get('apiKey');
      this.mta = new MtaBusTime(apiKey);
      this.busesChangedCbs = [];
      this.routeChangedCbs = [];
      this.on('change:bus', this.getBuses, this);
    },

    getBuses: function () {
      var bus = this.get('bus'), self = this;
      this.mta.getBuses(bus, null, function (buses) {
        self.notifyBusesChanged(buses);
      });
    },

    onBusesChanged: function (cb, ctx) {
      this.busesChangedCbs.push(_.bind(cb, ctx));
    },

    onRouteChanged: function (cb, ctx) {
      this.routeChangedCbs.push(_.bind(cb, ctx));
    },

    notifyBusesChanged: function (buses) {
      var i, cbs = this.busesChangedCbs, cbsLength = cbs.length;
      for (i = 0; i < cbsLength; i += 1) {
        cbs[i](buses);
      }
    },

    notifyRouteChanged: function (route) {
      var i, cbs = this.routeChangedCbs, cbsLength = cbs.length;
      for (i = 0; i < cbsLength; i += 1) {
        cbs[i](route);
      }
    }
  });

  return MapModel;
});