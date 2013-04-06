define([
	'jquery',
	'underscore',
	'backbone',
	'handlebars',
	'views/MapView',
    'viewmodels/MapVM',
    'views/MapControlsView'
], function($, _, Backbone, Handlebars, MapView, MapVM, MapControlsView) {

    var mapVM = new MapVM();
    var map = new MapView({model: mapVM});
    var mapControls = new MapControlsView({model: mapVM});

	var AppView = Backbone.View.extend({
		initialize: function() {
			console.log("Initialized AppView");
            this.render();
		},
		render: function() {
			console.log("Rendered AppView.");
			return this;
		},
        selectRoute: function(busLine) {
            mapVM.selectRoute(busLine);
        }
	});

	return AppView;
});