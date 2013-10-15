/* global Ember */

Parser = Ember.Application.create();

Parser.COLOR_SCHEMES = [
  /#[0-9a-f]{3}([0-9a-f]{3})?/gi,
  /rgb\(\d{1,3},\s*\d{1,3},\s*\d{1,3}\)/gi,
  /rgba\(\d{1,3},\s*\d{1,3},\s*\d{1,3},\s*\d*\.\d+\)/gi,
  /hsl\(\d{1,3},\s*\d{1,3}%,\s*\d{1,3}%\)/gi,
  /hsla\(\d{1,3},\s*\d{1,3}%,\s*\d{1,3}%,\s*\d*\.\d+\)/gi,
  /black|silver|gr(a|e)y|white|maroon|red|purple|fuchsia|green|lime|olive|yellow|navy|blue|teal|aqua|orange|aliceblue|antiquewhite|aquamarine|azure|beige|bisque|blanchedalmond|blueviolet|brown|burlywood|cadetblue|chartreuse|chocolate|coral|cornflowerblue|cornsilk|crimson|darkblue|darkcyan|darkgoldenrod|darkgr(a|e)y|darkgreen|darkkhaki|darkmagenta|darkolivegreen|darkorange|darkorchid|darkred|darksalmon|darkseagreen|darkslateblue|darkslategr(a|e)y|darkturquoise|darkviolet|deeppink|deepskyblue|dimgr(a|e)y|dodgerblue|firebrick|floralwhite|forestgreen|gainsboro|ghostwhite|gold|goldenrod|greenyellow|honeydew|hotpink|indianred|indigo|ivory|khaki|lavender|lavenderblush|lawngreen|lemonchiffon|lightblue|lightcoral|lightcyan|lightgoldenrodyellow|lightgr(a|e)y|lightgreen|lightpink|lightsalmon|lightseagreen|lightskyblue|lightslategr(a|e)y|lightsteelblue|lightyellow|limegreen|linen|mediumaquamarine|mediumblue|mediumorchid|mediumpurple|mediumseagreen|mediumslateblue|mediumspringgreen|mediumturquoise|mediumvioletred|midnightblue|mintcream|mistyrose|moccasin|navajowhite|oldlace|olivedrab|orangered|orchid|palegoldenrod|palegreen|paleturquoise|palevioletred|papayawhip|peachpuff|peru|pink|plum|powderblue|rosybrown|royalblue|saddlebrown|salmon|sandybrown|seagreen|seashell|sienna|skyblue|slateblue|slategr(a|e)y|snow|springgreen|steelblue|tan|thistle|tomato|turquoise|violet|wheat|whitesmoke|yellowgreen/gi
];

Parser.Swatch = DS.Model.extend({
  color: DS.attr('string'),
  occurences: DS.attr('number', { defaultValue: 1 })
});

Parser.ApplicationAdapter = DS.LSAdapter.extend();

Parser.Router.map(function () {
  this.resource('swatches', { path: '/' });
});

Parser.SwatchesRoute = Ember.Route.extend({
  model: function () {
    return this.store.find('swatch');
  }
});

Parser.ApplicationController = Ember.Controller.extend({
  needs: ['swatches'],
  swatchesController: Ember.computed.alias('controllers.swatches'),
  actions: {
    clear: function () {
      this.set('inputString', '');
      this.get('swatchesController').get('model').clear();
    },
    parse: function () {
      var inputString = this.get('inputString') || '';
      var swatchesController = this.get('swatchesController');

      swatchesController.get('model').clear();

      Parser.COLOR_SCHEMES.forEach(function (scheme) {
        var colors = inputString.match(scheme) || [];

        colors.forEach(swatchesController.get('push'), swatchesController);
      });

      swatchesController.get('model').save();
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
