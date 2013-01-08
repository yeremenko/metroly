define([
    'jquery',
    'underscore',
    'backbone',
    'router',
], function($, _, Backbone, Router) {

    var MapVM = Backbone.Model.extend({
        defaults: {
            selectedRoute: "",
            isLive: false
        }
    });

    return MapVM;
});