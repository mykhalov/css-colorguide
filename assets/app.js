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
  var resultElement = document.querySelector('[data-id=result]');

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
    var colors = inputElement.value.match(/#[0-9A-Fa-f]{3}([0-9A-Fa-f]{3})?/g);
    var swatches = {};

    if (colors) {
      colors.forEach(function (color) {
        color = normalize(color);
        swatches[color] = (swatches[color] || 0) + 1;
      });

      // TODO: Sort swatches by times used

      var resultString = '<h2>Colors</h2>';

      Object.keys(swatches).forEach(function (color) {
        var shadow = (color === '#ffffff') ? 'inset 0 0 0 1px #eee' : 'none';

        resultString += '<div class="color" ' +
          'title="' + color + ' ×' + swatches[color] + '" ' +
          'style="background-color:' + color + ';box-shadow:' + shadow + '"></div>';
      });

      resultElement.innerHTML = resultString;
    } else {
      resultElement.innerHTML = '<p class="alert alert-warning">Can\'t find colors in given CSS.</p>';
    }

    resultElement.removeAttribute('hidden');
    resultElement.id = 'result';
    location.href = '#result';

    e.preventDefault();
  };
});
