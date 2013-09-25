Parser = Ember.Application.create();

Parser.Swatch = Ember.Object.extend({
  color: '',
  occurences: 0,
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
      var inputString = this.get('inputString');

      // Define color schemes used in CSS
      var colorSchemes = [
        /#[0-9A-Fa-f]{3}([0-9A-Fa-f]{3})?/g,
        /rgb\(\d{1,3},\s*\d{1,3},\s*\d{1,3}\)/g,
        /rgba\(\d{1,3},\s*\d{1,3},\s*\d{1,3},\s*0?\.\d+\)/g,
        /hsl\(\d{1,3},\s*\d{1,3}%,\s*\d{1,3}%\)/g,
        /hsla\(\d{1,3},\s*\d{1,3}%,\s*\d{1,3}%,\s*0?\.\d+\)/g
      ];

      var matches = [];

      // Match every color scheme
      colorSchemes.forEach(function (scheme) {
        matches = matches.concat(inputString.match(scheme) || []);
      });

      var swatches = {};

      // Count occurences of each color
      matches.forEach(function (value) {
        var color = Color(value).rgbString();
        swatches[color] = (swatches[color] || 0) + 1;
      });

      var swatchesArray = [];

      // Create an arrays of Swatch objects
      Object.keys(swatches).forEach(function (key) {
        swatchesArray.push(Parser.Swatch.create({
          color: key,
          occurences: swatches[key]
        }));
      });

      // Sort by occurences
      swatchesArray.sort(function (a, b) {
        return b.get('occurences') - a.get('occurences');
      });

      this.set('swatches', swatchesArray);
    }
  }
});
