/*jslint nomen: true, unparam: true, indent: 2, browser: true */
/*global define */
define([
  'backbone'
], function (Backbone) {

  var MapModel = Backbone.Model.extend({
    defaults: {
      bus: '',
      direction: 1,
      route: {
        shortname: 'Shorty'
      }
    }
  });

  return MapModel;
});