/*
 * @desc: metroly.js - NYC MTA BusTime API Wrapper
 * @author: eddflrs@gmail.com (Eddie Flores)
 * @fileoverview: Depends on jQuery for $.ajax.
 * @date: December 13, 2012
 */

(function(window) {

	var mta_api = {
		// MTA BusTime API
		key: "36ad9e86-f0b4-4831-881c-55c8d44473b3", // Your API key here
		url: "http://bustime.mta.info/api/siri/",
		search_url: "http://bustime.mta.info/api/search"
	};

	var metroly = {

		setApiKey: function(apiKey) {
			mta_api.key = apiKey;
		},

		getBuses: function(busLine, callback) {
			// vehicle monitoring url
			var vm_url = mta_api.url + "vehicle-monitoring.json";

			var data = {
				"key": mta_api.key,
				"LineRef": busLine,
				"OperatorRef": "MTA NYCT"
			};

			$.ajax({
				type: "GET",
				url: vm_url,
				data: data,
				dataType: "jsonp",
				success: function(data) {

					console.log("Buses response looks like this: ");
					console.log(data);

					var vehicles = data.Siri.ServiceDelivery
						.VehicleMonitoringDelivery[0].VehicleActivity;

					callback(vehicles);
				},
				error: function() {
					console.log("Request failed!");
				}
			});
		},

		getRoute: function(busLine, callback) {
		 	var data = {
		 		"q": busLine
		 	};

		 	var that = this;

		 	$.ajax({
		 		type: "GET",
		 		url: mta_api.search_url,
		 		data: data,
		 		dataType: "jsonp",
		 		success: function(data) {

		 			var routeDirections = [];

                    console.log("Got the data: ");
		 			console.log(data);

		 			var directions = data.searchResults.matches[0].directions;
		 			var numDirections = directions.length;

		 			for (var i = 0; i < numDirections; i += 1) {

		 				var directionPoints = [];

		 				var numPolylines = directions[i].polylines.length;
		 				for (var j = 0; j < numPolylines; j += 1) {
		 					var polyline = directions[i].polylines[j];
				 			var routePoints = that.decodePolyline(polyline); 				
				 			directionPoints.push(routePoints);
		 				}

		 				var destination = directions[i].destination;
		 				var directionId = directions[i].directionId;
		 				var routeDirection = new that.RouteDirection(destination, directionId, directionPoints);

		 				routeDirections.push(routeDirection);
		 			} 			 

		 			var routeId = data.searchResults.matches[0].id;
		 			var longname= data.searchResults.matches[0].longName;
		 			var shortname= data.searchResults.matches[0].shortName;
		 			var description= data.searchResults.matches[0].description;

		 			var route = new that.Route(routeId, routeDirections, longname, shortname, description);
					
					callback(route);
		 		},
		 		error: function() {
					console.log("Error getting the busRoute request!");
		 		}
		 	});			
		},

		decodePolyline: function(encoded) {
			var len = encoded.length;
			var index = 0;
			var array = [];
			var lat = 0;
			var lng = 0;

			while (index < len) {
				var b;
				var shift = 0;
				var result = 0;
				do {
					b = encoded.charCodeAt(index++) - 63;
					result |= (b & 0x1f) << shift;
					shift += 5;
				} while (b >= 0x20);
				var dlat = ((result & 1) ? ~(result >> 1) : (result >> 1));
				lat += dlat;

				shift = 0;
				result = 0;
				do {
					b = encoded.charCodeAt(index++) - 63;
					result |= (b & 0x1f) << shift;
					shift += 5;
				} while (b >= 0x20);
				var dlng = ((result & 1) ? ~(result >> 1) : (result >> 1));
				lng += dlng;

				array.push([lat * 1e-5, lng * 1e-5]);
			}
			return array;			
		},

		/**
		 * Creates an instance of a RouteDirection.
		 * @constructor
		 * @param {string} destination
		 * @param {string} directionId
		 * @param {Array} polylines An array of arrays containing latitude and longitude.
		 */
		RouteDirection: function(destination, directionId, polylines) {
			this.destination = destination;
			this.directionId = directionId;
			this.polylines = polylines;
		},

		/**
		 * Creates an instance of a Route.
		 * @constructor
		 * @param {string} id
		 * @param {Array<RouteDirection>} routeDirections
		 * @param {string} longname
		 * @param {string} shortname
		 * @param {string} description
		 */
		Route: function(id, routeDirections, longname, shortname, description) {
			this.id = id;
			this.routeDirections = routeDirections;
			this.longname = longname;
			this.shortname = shortname;
			this.description = description;
		},

	};

	window.metroly = metroly;

	// AMD definition
	define("metroly", ["jquery"], function() {
		return metroly;
	});

})(window);