/* global Ember */

Parser = Ember.Application.create();

Parser.COLOR_SCHEMES = [
  /#[0-9A-Fa-f]{3}([0-9A-Fa-f]{3})?/g,
  /rgb\(\d{1,3},\s*\d{1,3},\s*\d{1,3}\)/g,
  /rgba\(\d{1,3},\s*\d{1,3},\s*\d{1,3},\s*0?\.\d+\)/g,
  /hsl\(\d{1,3},\s*\d{1,3}%,\s*\d{1,3}%\)/g,
  /hsla\(\d{1,3},\s*\d{1,3}%,\s*\d{1,3}%,\s*0?\.\d+\)/g
];

Parser.Swatch = Ember.Object.extend({
  occurences: 1,
  style: function () {
    return 'background-color:' + this.get('color');
  }.property('color'),
  title: function () {
    return this.get('color') + ' ×' + this.get('occurences');
  }.property('color', 'occurences')
});

Parser.ApplicationController = Ember.Controller.extend({
  actions: {
    clear: function () {
      this.set('inputString', '');
    },
    parse: function () {
      var inputString = this.get('inputString') || '';

      Parser.COLOR_SCHEMES.forEach(function (scheme) {
        var colors = inputString.match(scheme);

        if (colors) {
          colors.forEach(Parser.SwatchesController.push);
        }
      });
    }
  }
});

Parser.SwatchesController = Ember.ArrayController.extend({
  push: function (color) {
    var key = jQuery.Color(color).toRgbaString();
    var swatch = this.get('model').findBy('color', key);

    swatch ?
      swatch.incrementProperty('occurences') :
      swatches.push(Parser.Swatch.create({ color: key }));

    this.set('model', swatches);
  },
  sortProperties: ['occurences'],
  sortAscending: false
});
