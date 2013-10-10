/* global Ember */

Parser = Ember.Application.create();

Parser.COLOR_SCHEMES = [
  /#[0-9A-Fa-f]{3}([0-9A-Fa-f]{3})?/g,
  /rgb\(\d{1,3},\s*\d{1,3},\s*\d{1,3}\)/g,
  /rgba\(\d{1,3},\s*\d{1,3},\s*\d{1,3},\s*0?\.\d+\)/g,
  /hsl\(\d{1,3},\s*\d{1,3}%,\s*\d{1,3}%\)/g,
  /hsla\(\d{1,3},\s*\d{1,3}%,\s*\d{1,3}%,\s*0?\.\d+\)/g
];

Parser.ApplicationController = Ember.Controller.extend({
  needs: ['swatches'],
  swatchesController: Ember.computed.alias('controllers.swatches'),
  actions: {
    clear: function () {
      this.set('inputString', '');
      this.get('swatchesController').set('content', []);
    },
    parse: function () {
      var inputString = this.get('inputString') || '';
      var swatchesController = this.get('swatchesController').set('content', []);

      Parser.COLOR_SCHEMES.forEach(function (scheme) {
        var colors = inputString.match(scheme);

        if (colors) {
          colors.forEach(swatchesController.push, swatchesController);
        }
      });
    }
  }
});

Parser.SwatchesController = Ember.ArrayController.extend({
  push: function (color) {
    var key = jQuery.Color(color).toRgbaString();
    var swatch = this.findBy('color', key);

    swatch ?
      swatch.incrementProperty('occurences') :
      this.addObject({ color: key, occurences: 1 });
  },
  itemController: 'swatch',
  sortProperties: ['occurences'],
  sortAscending: false
});

Parser.SwatchController = Ember.ObjectController.extend({
  style: function () {
    return 'background-color:' + this.get('color');
  }.property('color'),
  title: function () {
    return this.get('color') + ' ×' + this.get('occurences');
  }.property('color', 'occurences')
});
