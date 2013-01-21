define([
    'jquery',
    'underscore',
    'backbone',
    'metroly'
], function($, _, Backbone, metroly) {

    var MapVM = Backbone.Model.extend({
        defaults: {
            route: undefined,
            directionId: 0,
            isLive: false,
            isFavorite: false
        },

        selectRoute: function(routeId) {        
            metroly.getRoute(routeId, _.bind(function(route) {                
                this.set("route", route);
            }, this));
        }
    });

    return MapVM;
});