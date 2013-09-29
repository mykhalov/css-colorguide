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

Parser.ApplicationController = Ember.ArrayController.extend({
  actions: {
    clear: function () {
      this
        .set('inputString', '')
        .set('model', []);
    },
    parse: function () {
      var inputString = this.get('inputString');
      var swatches = [];

      Parser.COLOR_SCHEMES.forEach(function (scheme) {
        (inputString.match(scheme) || []).forEach(addToSwatches);
      });

      function addToSwatches(value) {
        var keyColor = jQuery.Color(value).toRgbaString(); // normalize color
        var swatch = swatches.findBy('color', keyColor);

        swatch ?
          swatch.incrementProperty('occurences') :
          swatches.push(Parser.Swatch.create({ color: keyColor }));
      }

      this.set('model', swatches);
    }
  },
  sortProperties: ['occurences'],
  sortAscending: false
});
