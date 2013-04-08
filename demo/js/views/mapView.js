/*jslint nomen: true, unparam: true, indent: 2, browser: true */
/*global define */
define([
  'jquery',
  'underscore',
  'backbone',
  'leaflet'
], function ($, _, Backbone, L) {

  // 36ad9e86-f0b4-4831-881c-55c8d44473b3

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

  var createLocatorIcon = function (bearing) {
    var locator_icon = new LocatorIcon(),
      iconUrl = '',
      imagesBasePath = '../../assets/images/icon_set/';

    if (bearing >= 67.5 && bearing < 112.5) {
      iconUrl = imagesBasePath + 'icon_n.png';  // N
    } else if (bearing >= 112.5 && bearing < 157.5) {
      iconUrl = imagesBasePath + 'icon_nw.png'; // NW
    } else if (bearing >= 157.5 && bearing < 202.5) {
      iconUrl = imagesBasePath + 'icon_w.png';  // W
    } else if (bearing >= 202.5 && bearing < 247.5) {
      iconUrl = imagesBasePath + 'icon_sw.png'; // SW
    } else if (bearing >= 247.5 && bearing < 292.5) {
      iconUrl = imagesBasePath + 'icon_s.png';  // S
    } else if (bearing >= 292.5 && bearing < 337.5) {
      iconUrl = imagesBasePath + 'icon_se.png'; // SE
    } else if (bearing >= 337.5 || bearing < 22.5) {
      iconUrl = imagesBasePath + 'icon_e.png';  // E
    } else if (bearing >= 22.5 && bearing < 67.5) {
      iconUrl = imagesBasePath + 'icon_ne.png'; // NE
    }

    if (iconUrl !== '') {
      locator_icon = new LocatorIcon({iconUrl: iconUrl});
    }

    return locator_icon;
  };

  var MapView = Backbone.View.extend({
    el: '#map',

    initialize: function () {
      this.initMap();
      $(window).bind("resize", _.bind(this.ensureMapHeight, this));
      this.model.onBusesChanged(this.showBuses, this);
      this.model.onRouteChanged(this.showRoute, this);
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

    selectBus: function (bus) {
      this.model.set('bus', bus);
    },

    showBuses: function (buses) {
      var i, bus, lat, lng, locatorIcon, marker, markerInfo, bearing, layer,
        busesLength = buses.length;

      layer = new L.LayerGroup();

      for (i = 0; i < busesLength; i += 1) {
        bus = buses[i].MonitoredVehicleJourney;
        lat = bus.VehicleLocation.Latitude;
        lng = bus.VehicleLocation.Longitude;
        bearing = bus.Bearing;
        locatorIcon = createLocatorIcon(bearing);
        marker = L.marker([lat, lng], {icon: locatorIcon});
        markerInfo = "<p><strong>" + bus.PublishedLineName + "</strong> &rarr; " + bus.DestinationName + "</p>";
        marker.bindPopup(markerInfo);
        layer.addLayer(marker);
      }

      layer.addTo(this.map);
    },

    showRoute: function (route) {
      console.log('Will show this route on the map', route);
    },

    render: function () {
      return this;
    }
  });

  return MapView;
});