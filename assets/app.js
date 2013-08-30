function normalize(color) {
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
        swatches[color] ? swatches[color]++ : swatches[color] = 1;
      });

      // TODO: Sort swatches by times used

      resultElement.innerHTML = '<h2>Colors</h2>';

      for (var color in swatches) {
        if (swatches.hasOwnProperty(color)) {
          var swatchElement = document.createElement('div');

          swatchElement.className = 'color';
          swatchElement.title = color + ' ×' + swatches[color];

          swatchElement.style.backgroundColor = color;
          if (color === '#ffffff') {
            swatchElement.style.boxShadow = 'inset 0 0 0 1px #eee';
          }

          resultElement.appendChild(swatchElement);
        }
      }
    } else {
      resultElement.innerHTML = '<p class="alert alert-warning">Can\'t find colors in given CSS.</p>';
    }

    resultElement.removeAttribute('hidden');
    resultElement.id = 'result';
    location.href = '#result';

    e.preventDefault();
  };
});
