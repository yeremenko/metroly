/*global define */
/*jslint nomen: true, unparam: true, indent: 2 */

define([
  'backbone',
  'views/mapView',
  'views/controlsView',
  'models/mapModel'
], function (Backbone, MapView, ControlsView, MapModel) {
  "use strict";

  var AppView,
    apiKey = '36ad9e86-f0b4-4831-881c-55c8d44473b3',
    mapModel = new MapModel({apiKey: apiKey}),
    controlsView = new ControlsView({model: mapModel}),
    mapView = new MapView({model: mapModel});

  AppView = Backbone.View.extend({

    initialize: function () {

    },

    selectBus: function (bus) {
      mapModel.set('bus', bus);
    },

    selectDirection: function (direction) {
      mapModel.set('direction', direction);
    }
  });

  return AppView;
});