define([
	'jquery',
	'underscore',
	'backbone',
	'handlebars',
	'views/MapView',
    'viewmodels/MapVM'
], function($, _, Backbone, Handlebars, MapView, MapVM) {

    var mapVM = new MapVM();
    var map = new MapView({model: mapVM});

	var AppView = Backbone.View.extend({
		initialize: function() {
			console.log("Initialized AppView");
            this.render();
		},
		render: function() {
			console.log("Rendered AppView.");
			return this;
		},
        selectBus: function(busLine) {
            map.model.set({selectedRoute: busLine});
        }
	});

	return AppView;
});