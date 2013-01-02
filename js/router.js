define([
	'jquery',
	'underscore',
	'backbone',
    'views/AppView'

], function($, _, Backbone, AppView) {

	var AppRouter = Backbone.Router.extend({
		routes: {
            'nyc/bus/:bus': 'selectBusLine',
			'*actions': 'defaultAction'
		}
	});

	var initialize = function() {
		var app_router = new AppRouter();

        var app = new AppView();

        app_router.on('route:selectBusLine', function(busLine) {
            app.showBus(busLine);
        });

		app_router.on('route:defaultAction', function() {

		});

		Backbone.history.start({pushState: false});
	};

	return {
		initialize : initialize
	};
});