// This backbone app's main module

define([
	'jquery',
	'underscore',
	'backbone',
	'router',
], function($, _, Backbone, Router) {

	var initialize = function() {
        Router.initialize();
    };

	return {
		initialize: initialize
	};
});