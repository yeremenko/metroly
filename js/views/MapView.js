define([
	'jquery',
	'underscore',
	'backbone',
	'handlebars',
	'leaflet',
	'metroly'
], function($, _, Backbone, Handlebars, L, metroly) {
	
	var locations = {
		bronx:        [40.832359, -73.892670],
		brooklyn:     [40.650000, -73.950000],
		manhattan:    [40.764785, -73.975067],
		statenIsland: [40.581315, -74.154968],
		queens:       [40.755424, -73.876877],

		/* Maximum map bounds for nyc */
		SWBound: [40.477666, -74.308777],
		NEBound: [40.908739, -73.712769],
	};

	var tilesUrl = 'http://{s}.tile.cloudmade.com/23b30a5239c3475d9babd947f2b7a12b/22677/256/{z}/{x}/{y}.png';

	var circleOptions = {
	    color: 'red',
	    fillColor: '#f03',
	    fillOpacity: 0.7
	};

	var LocatorIcon = L.Icon.extend({
	    options: {
	            iconUrl: 'images/icon_set/locator_icon.png',
	            shadowUrl: 'images/icon_set/locator_icon_shadow.png',
	            iconSize: [26, 40],
	            shadowSize: [13, 29],
	            iconAnchor: [13, 40],
	            shadowAnchor: [-1, 29],
	            popupAnchor: [1, -40]
	    }
	});

	var layers = {
		direction1: {
			busesLayer: new L.LayerGroup(),
			routeLayer: new L.LayerGroup(),
		},
		direction2: {
			busesLayer: new L.LayerGroup(),
			routeLayer: new L.LayerGroup()
		}
	}

    var MapView = Backbone.View.extend({
		el: "#map",
		map: {},

		initialize: function() {
			this.initMap();
			$(window).bind("resize", _.bind(this.ensureMapHeight, this));
            console.log("initialized MapView");
            this.model.on("change:selectedRoute", _.bind(this.selectedRouteChanged, this));
        },

        selectedRouteChanged: function() {
            console.log("The selectd route changed");
           this.showBuses(this.model.get('selectedRoute'));
        },

		ensureMapHeight: function() {
			console.log("Ensuring map height");
			var newHeight = $(window).height() - $("#main-header").height();
			$("#map").css("height", newHeight);
		},

		initMap: function() {
            this.ensureMapHeight();

            this.map = L.map(this.el);
			this.map.setView(locations.brooklyn, 13);

			// this.map.addLayer(busesLayer);

			this.initMapListeners();

	        // Add the tiles layer
	        var cloudmade = new L.TileLayer(tilesUrl, {
            	maxZoom: 16, 
            	minZoom: 11,
            }).addTo(this.map);

	        // Set maximum bounds to nyc metro area
	        var bounds = new L.LatLngBounds(locations.SWBound, locations.NEBound);
	        this.map.setMaxBounds(bounds);

	        // TODO: Leave here for now...
			this.geoLocate();	 
//			this.showBuses("B63");
		},

		initMapListeners: function() {
			var self = this;			
			
			this.map.on("locationerror", function() {
				console.log("Location error");
				L.circle(locations.brooklyn, 100, circleOptions).addTo(self.map);
			});

			this.map.on("locationfound", function(locData) {
				console.log("Location found");

	            var lat = locData.latlng.lat;
                var lng = locData.latlng.lng;
				L.circle([lat, lng], 40, circleOptions).addTo(self.map);
			});
		},

		render: function() {
			console.log("MapView rendered");
			return this;
		},

		geoLocate: function() {
	        this.map.locate({
	                setView: true,
	                maxZoom: 15,
	                watch: false
	        });
		},

		showBuses: function(busLine) {
            this.resetLayers();
			metroly.getBuses(busLine.toUpperCase(), _.bind(this.markBuses, this));
			metroly.getRoute(busLine, _.bind(this.showRoute, this));
		},

		markBuses: function(buses) {


			console.log("markBuses requested: " + buses.length);

			for (var i = 0; i < buses.length; i += 1) {
			        var bus = buses[i].MonitoredVehicleJourney;
			        
			        var lat = bus.VehicleLocation.Latitude;
			        var lng = bus.VehicleLocation.Longitude;
			        var bearing = bus.Bearing;

			        var locator_icon = new LocatorIcon();
			        var iconUrl = '';

			        if (bearing >= 67.5 && bearing < 112.5) {
			                iconUrl = 'images/icon_set/icon_n.png';  // N               
			        } else if (bearing >= 112.5 && bearing < 157.5) {
			                iconUrl = 'images/icon_set/icon_nw.png'; // NW
			        } else if (bearing >= 157.5 && bearing < 202.5) {
			                iconUrl = 'images/icon_set/icon_w.png';  // W
			        } else if (bearing >= 202.5 && bearing < 247.5) {
			                iconUrl = 'images/icon_set/icon_sw.png'; // SW
			        } else if (bearing >= 247.5 && bearing < 292.5) {
			                iconUrl = 'images/icon_set/icon_s.png';  // S
			        } else if (bearing >= 292.5 && bearing < 337.5) {
			                iconUrl = 'images/icon_set/icon_se.png'; // SE
			        } else if (bearing >= 337.5 || bearing < 22.5) {
			                iconUrl = 'images/icon_set/icon_e.png';  // E
			        } else if (bearing >= 22.5 && bearing < 67.5) {
			                iconUrl = 'images/icon_set/icon_ne.png'; // NE
			        }

			        if (iconUrl !== '') {
			                locator_icon = new LocatorIcon({iconUrl: iconUrl});
			        }

			        var marker = L.marker([lat, lng], {icon: locator_icon});

			        var markerInfo = "<p><strong>"+ bus.PublishedLineName + "</strong> &rarr; " + bus.DestinationName +"</p>";

			        marker.bindPopup(markerInfo);

			        if (bus.DirectionRef === "0") {
			        	layers.direction1.busesLayer.addLayer(marker);
			        } else if (bus.DirectionRef === "1") {
			        	layers.direction2.busesLayer.addLayer(marker);
			        }

			        console.log("Marked bus");
			}

			this.map.addLayer(layers.direction1.busesLayer);
			this.map.addLayer(layers.direction2.busesLayer);
		},

		showRoute: function(route) {

			console.log("This is the route");
			console.log(route);

			var that = this;

//			_.each(route.routeDirections, function(routeDirection) {
            for (var i = 0; i < route.routeDirections.length; i += 1) {
                var routeDirection = route.routeDirections[i];
				var latlngs = [];
                _.each(routeDirection.polylines[0], function(point){
                    var latlng = new L.LatLng(point[0], point[1]);
                    latlngs.push(latlng);
                });
				var routeLine = new L.Polyline(latlngs, {color: 'green', weight: 4, smoothFactor: 1.2});
//				that.map.addLayer(routeLine);
                var layersDirection = layers['direction'+ (i+1)];
                layersDirection.routeLayer.addLayer(routeLine);
			}
            this.map.addLayer(layers.direction1.routeLayer);
            this.map.addLayer(layers.direction2.routeLayer);
		},

        resetLayers: function() {
            this.map.removeLayer(layers.direction1.busesLayer);
            this.map.removeLayer(layers.direction2.busesLayer);

            this.map.removeLayer(layers.direction1.routeLayer);
            this.map.removeLayer(layers.direction2.routeLayer);

            layers.direction1.busesLayer = new L.LayerGroup();
            layers.direction1.routeLayer = new L.LayerGroup();
            layers.direction2.busesLayer = new L.LayerGroup();
            layers.direction2.routeLayer = new L.LayerGroup();
        },

	});

	return MapView;
});