/*jslint nomen: true, unparam: true, indent: 2 */
/*global define */
define([
  'jquery',
  'underscore',
  'backbone',
  'handlebars',
  'leaflet'
], function ($, _, Backbone, H, L) {
  "use strict";

  /* -- Models -- */

  /* -- Views -- */

  var MapView = Backbone.View.extend({

    el: "#map",

    initialize: function () {

    }
  });

  var AppView = Backbone.View.extend({
    selectBus: function (bus) {
      console.log('Will select ', bus);
    }
  });
  return AppView;
});