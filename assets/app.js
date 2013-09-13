/* jshint quotmark: single, indent: 2 */
/* global Handlebars */

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

  var inputElement = document.getElementById('input');
  var outputElement = document.getElementById('output');
  var templateElement = document.getElementById('template');

  var template = Handlebars.compile(templateElement.innerHTML);

  if (localStorage.input) {
    inputElement.value = localStorage.input;
  }

  inputElement.oninput = function () {
    localStorage.input = this.value;
  };

  window.onreset = function () {
    delete localStorage.input;
    outputElement.innerHTML = '';
  };

  document.forms[0].onsubmit = function (e) {
    var matches = inputElement.value.match(/#[0-9A-Fa-f]{3}([0-9A-Fa-f]{3})?/g) || [];
    var swatches = {};

    matches.forEach(function (color) {
      color = normalize(color);
      swatches[color] = (swatches[color] || 0) + 1;
    });

    // TODO: Sort swatches by times used

    outputElement.innerHTML = template({
      colorsFound: Boolean(matches.length), 
      swatches: swatches
    });

    location.href = '#result';

    e.preventDefault();
  };
});
