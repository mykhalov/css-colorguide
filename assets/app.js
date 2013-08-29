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

    colors.forEach(function (color) {
      color = normalize(color);
      swatches[color] ? swatches[color]++ : swatches[color] = 1;
    });

    var resultElement = document.createElement('div');
    resultElement.id = 'result';

    // TODO: Sort swatches by times used

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

    document.body.appendChild(resultElement);
    location.href = '#result';

    e.preventDefault();
  };
});
