/* jshint quotmark: single, indent: 2 */

function normalize(color) {
  'use strict';

  if (color.length === 4) {
    var chars = color.split('');
    color = chars[0] +
      chars[1] + chars[1] +
      chars[2] + chars[2] +
      chars[3] + chars[3];
  }

  return color.toLowerCase();
}

document.addEventListener('DOMContentLoaded', function () {
  'use strict';

  var inputElement = document.getElementById('css');
  var resultElement = document.getElementById('result-container');

  var source = document.getElementById('swatches-template').innerHTML;
  var template = Handlebars.compile(source);

  if (localStorage.input) {
    inputElement.value = localStorage.input;
  }

  inputElement.oninput = function () {
    localStorage.input = this.value;
  };

  window.onreset = function () {
    delete localStorage.input;
  };

  document.forms[0].onsubmit = function (e) {
    var matches = inputElement.value.match(/#[0-9A-Fa-f]{3}([0-9A-Fa-f]{3})?/g) || [];
    var swatches = {};

    matches.forEach(function (color) {
      color = normalize(color);
      swatches[color] = (swatches[color] || 0) + 1;
    });

    // TODO: Sort swatches by times used

    resultElement.innerHTML = template({
      colorsFound: Boolean(matches.length), 
      swatches: swatches
    });

    location.href = '#result';

    e.preventDefault();
  };
});
