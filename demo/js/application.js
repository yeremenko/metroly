/*jslint nomen: true, unparam: true, indent: 2 */
/*global define */
define([
  'backbone',
  'views/mapView',
  'views/controlsView',
  'models/mapModel'
], function (Backbone, MapView, ControlsView, MapModel) {
  "use strict";

  var mapModel, mapView, controlsView, AppView;

  mapModel = new MapModel();
  controlsView = new ControlsView({model: mapModel});
  mapView = new MapView({model: mapModel});

  AppView = Backbone.View.extend({

    initialize: function () {
      console.log('Inited AppView');
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