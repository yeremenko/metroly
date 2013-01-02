define([
	'jquery',
	'underscore',
	'backbone',
	'handlebars',
	'views/MapView'
], function($, _, Backbone, Handlebars, MapView) {

    var map = new MapView();

	var AppView = Backbone.View.extend({
		initialize: function() {
			console.log("Initialized AppView");
            this.render();
		},
		render: function() {
			console.log("Rendered AppView.");
			return this;
		},
        showBus: function(busLine) {
            map.showBuses(busLine);
        }
	});

	return AppView;
});