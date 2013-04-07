/*jslint nomen: true, unparam: true, indent: 2, browser: true */
/*global define */
define([
  'jquery',
  'underscore',
  'backbone',
  'handlebars',
  'text!../../assets/templates/controls.html'
], function ($, _, Backbone, H, controlsTpl) {

  var ControlsView = Backbone.View.extend({
    el: '#control-panel',
    template: H.compile(controlsTpl),

    events: {
      'click .route': 'selectDirection'
    },

    initialize: function () {
      this.model.on('change:bus', this.render, this);
    },

    selectDirection: function (e) {
      console.log('Select direction event');
    },

    render: function () {
      var html = this.template(this.model.toJSON());
      this.$el.html(html);
      this.model.set('direction', 1);
      return this;
    }
  });
  return ControlsView;
});