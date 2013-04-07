/*jslint nomen: true, unparam: true, indent: 2, browser: true */
/*global define */
define([
  'jquery',
  'underscore',
  'backbone',
  'leaflet'
], function ($, _, Backbone, L) {

  var locations = {
    bronx:        [40.832359, -73.892670],
    brooklyn:     [40.650000, -73.950000],
    manhattan:    [40.764785, -73.975067],
    statenIsland: [40.581315, -74.154968],
    queens:       [40.755424, -73.876877],

    /* Maximum map bounds for nyc */
    SWBound: [40.477666, -74.308777],
    NEBound: [40.908739, -73.712769]
  };

  var defaultLocation = locations.brooklyn;
  var defaultZoomLevel = 13;

  var tilesUrl = 'http://{s}.tile.cloudmade.com/23b30a5239c3475d9babd947f2b7a12b/22677/256/{z}/{x}/{y}.png';

  var circleOptions = {
    color: 'red',
    fillColor: '#f03',
    fillOpacity: 0.7
  };

  var LocatorIcon = L.Icon.extend({
    options: {
      iconUrl: '../../assets/images/icon_set/locator_icon.png',
      shadowUrl: '../../assets/images/icon_set/locator_icon_shadow.png',
      iconSize: [26, 40],
      shadowSize: [13, 29],
      iconAnchor: [13, 40],
      shadowAnchor: [-1, 29],
      popupAnchor: [1, -40]
    }
  });

  var cloudmadeTiles = new L.TileLayer(tilesUrl, {
    maxZoom: 16,
    minZoom: 11
  });

  var maxBounds = new L.LatLngBounds(locations.SWBound, locations.NEBound);

  var MapView = Backbone.View.extend({
    el: '#map',

    initialize: function () {
      this.initMap();
      $(window).bind("resize", _.bind(this.ensureMapHeight, this));
      this.model.on("change:bus", this.busChanged, this);
      this.model.on("change:direction", this.directionChanged, this);
    },

    initMap: function () {
      this.ensureMapHeight();
      this.map = L.map(this.el);
      this.map.setView(defaultLocation, defaultZoomLevel);
      this.ensureMapHeight();
      cloudmadeTiles.addTo(this.map);
      this.map.setMaxBounds(maxBounds);
    },

    ensureMapHeight: function () {
      var newHeight = $(window).height();
      $("#map").css("height", newHeight);
    },

    busChanged: function () {
      var bus = this.model.get('bus');
      console.log('The bus selected is now: ', bus);
    },

    directionChanged: function () {
      var dir = this.model.get('direction');
      console.log('The direction is now', dir);
    },

    selectBus: function (bus) {
      this.model.set('bus', bus);
    },

    render: function () {
      return this;
    }
  });

  return MapView;
});