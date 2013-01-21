define([
    'jquery',
    'underscore',
    'backbone',
    'handlebars',
    'text!templates/controlpanel.hbs.html'
], function($, _, Backbone, Handlebars, tpl) {

    var mapControlsView = Backbone.View.extend({
        el: "#control-panel",
        template: Handlebars.compile(tpl),

        initialize: function() {
            Handlebars.registerHelper('listDirections', this.listDirectionsHelper);
            this.model.on("change", _.bind(this.render, this));
            this.render();
        },

        events: {
            "click .route":  "selectDirection"
        },

        selectDirection: function(evt) {
            $(".route").removeClass('route-selected');                    
            var $element = $(evt.target);
            var directionId = $element.data('direction');
            $element.addClass('route-selected');
            this.model.set('directionId', directionId);            

        },


        /* Handlebars helper to handle presentation of route directions */        
        listDirectionsHelper: function(metrolyRoutes, options) {
            var orderedRoutes = _.sortBy(metrolyRoutes, function(metrolyRoute) {
                return metrolyRoute.directionId;
            });

            var out = "<div id='bus-number'>";
            _.each(orderedRoutes, function(route){                
                out += "<div>";
                out += "<a class='route' data-direction='"+ route.directionId +"'>";
                out += options.fn(route);
                out += "</a>";
                out += "</div>";
            });
            out += "</div>"

            return out;
        },

        render: function() {
            var html = this.template(this.model.toJSON());
            this.$el.html(html);
            return this;
        }
    });

    return mapControlsView;
});