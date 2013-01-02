/*
 * metroly.js - NYC MTA BustTime API Wrapper
 * @author: Eddie Flores <eddflrs@gmail.com>
 * @dependency: jQuery v.1.7.x
 */


var Metroly = Metroly || {

	// MTA BusTime API
	api_key: "36ad9e86-f0b4-4831-881c-55c8d44473b3",
	api_url: "http://bustime.mta.info/api/siri/",
	api_search_url: "http://bustime.mta.info/api/search"

};


Metroly.GPS_BUS_LINES = 
[
	{"busLine": "B61"},
	{"busLine": "B63"},
	{"busLine": "B82"},
	{"busLine": "B6"},	
	{"busLine": "Q44"},
	{"busLine": "Q44"},
	{"busLine": "Q44"},
	{"busLine": "Q24"},
	{"busLine": "Bx62"},
	{"busLine": "Bx42"},
	{"busLine": "Bx21"},
	{"busLine": "S1"},
	{"busLine": "S12"},
	{"busLine": "X12"},
	{"busLine": "X1"},
	{"busLine": "X2"}
];

/*
 *	Gets all vechicles on the given busLine
 */
Metroly.getAllVehicles = function(busLine, fn) {
	console.log("Getting all vehicles");
	
	// vehicle monitoring url
	var vm_url = this.api_url + "vehicle-monitoring.json";

	var data = {
		"key": this.api_key,
		"LineRef": busLine,
		"OperatorRef": "MTA NYCT"
	};

	$.ajax({
		type: "GET",
		url: vm_url,
		data: data,
		dataType: "jsonp",
		success: function(data) {
			console.log("We got that data!");

			var vehicles = data.Siri.ServiceDelivery
				.VehicleMonitoringDelivery[0].VehicleActivity;

			// DEBUG
			console.log(vehicles);
			
			console.log("We about to call it back!!");
			fn(vehicles);
			console.log("We called it back!");
		},
		error: function() {
			alert("Request failed!");
		}
	});
}

/*
 * Gets the route for the given busLine as an array of polylines
 */ 
 Metroly.getBusRoute = function(busLine, fn) {
 	console.log("getBusRoute got this: " + busLine);
 	console.log("api_url: " + Metroly["api_search_url"]);

 	var data = {
 		"q": busLine
 	};

 	$.ajax({
 		type: "GET",
 		url: this.api_search_url,
 		data: data,
 		dataType: "jsonp",
 		success: function(data) {
 			var decodedPolylines = [];

 			var directions = data.searchResults.matches[0].directions;
 			var numDirections = directions.length;

 			for (var i = 0; i < numDirections; i += 1) {
 				var numPolylines = directions[i].polylines.length;

 				for (var j = 0; j < numPolylines; j += 1) {
 					var polyline = directions[i].polylines[j];
		 			var routePoints = Metroly.decodePolyline(polyline); 				
		 			decodedPolylines.push(routePoints);
 				}
 			} 			 
 			// Invoke callback with array of polylines
			fn(decodedPolylines);
 		},
 		error: function() {
			console.log("Error getting the busRoute request!");
 		}
 	});
 };

 Metroly.decodePolyline = function(encoded) {
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
};