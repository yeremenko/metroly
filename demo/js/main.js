/* Entry point for require.js */

require.config({
  paths: {
    jquery: '../assets/libs/jquery.min',
    underscore: '../assets/libs/underscore.min',
    backbone: '../assets/libs/backbone.min',
    handlebars: '../assets/libs/handlebars',
    leaflet: '../assets/libs/leaflet/leaflet'
  },
  shim: {
    backbone: {
      deps: ['underscore', 'jquery'],
      exports: 'Backbone'
    },
    underscore: {
      exports: '_'
    },
    handlebars: {
      exports: 'Handlebars'
    },
    leaflet: {
      exports: 'L'
    }
  }
});

require(['router'], function (Router) {
  Router.initialize();
});