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
            this.model.on("change:route", _.bind(this.render, this));
            // this.model.on("change:directionId", _.bind(this.selectDirection, this));
            this.render();
        },

        events: {
            "click .route":  "selectDirection"
        },

        selectDirection: function(evt) {
            console.log("Selected direction clicked");
            var $element = $(evt.target);
            var currDirectionId = $element.data('direction');

            var prevDirectionId = this.model.get('directionId');
            if (prevDirectionId !== currDirectionId)  {
                console.log("Why you no change?");
                $(".route").removeClass('route-selected');                
                $element.addClass('route-selected');
                this.model.set('directionId', currDirectionId);            
            }
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
            this.model.set('directionId', 0);            
            $("[data-direction=0]").addClass("route-selected");
            return this;
        }
    });

    return mapControlsView;
});