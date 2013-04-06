// Main entry point for require.js

require.config({
	paths: {
		jquery: 'libs/jquery-1.7.2.min',
		underscore: 'libs/underscore-min',
		backbone: 'libs/backbone-min',
		handlebars: 'libs/handlebars',		
		handlebarsRuntime: 'libs/handlebars.runtime',
		leaflet: 'libs/leaflet/leaflet',
		metroly: 'libs/metroly',
	},
	shim: {
		backbone : {
			deps: ['underscore', 'jquery'],
			exports: 'Backbone'
		},
		underscore : {
			exports: '_'
		},
		handlebars: {
			deps: ['handlebarsRuntime'],
			exports: 'Handlebars'
		},
		leaflet: {
			exports: 'L'
		}


	}
});

require(['app'], function(App) {
	App.initialize();
});