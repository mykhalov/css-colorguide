function normalizeHex(color) {
  var digits = color.toLowerCase().split('');
  return digits.length === 7 ? digits.join('') : digits[0] + digits[1] + digits[1] + digits[2] + digits[2] + digits[3] + digits[3];
}

document.addEventListener('DOMContentLoaded', function () {
  if (localStorage.input) {
    document.getElementById('css').value = localStorage.input;
  }

  document.getElementById('css').oninput = function () {
    localStorage.input = this.value;
  }

  window.onreset = function () {
    delete localStorage.input;
  }
});

document.forms[0].onsubmit = function (e) {
  var css = document.getElementById('css').value;
  var matches = css.match(/#[0-9A-Fa-f]{3}([0-9A-Fa-f]{3})?/g);
  var res = {};

  matches.forEach(function (i) {
    i = normalizeHex(i);
    res[i] ? res[i]++ : res[i] = 1;
  });

  var result = document.createElement('div');
  result.id = 'result'

  for (var x in res) {
    var div = document.createElement('div');
    div.className = 'color';
    div.style.backgroundColor = x;
    div.title = x + ' (' + res[x] + ')';
    if (x === '#ffffff') {
      div.style.boxShadow = 'inset 0 0 0 1px #eee';
    }
    result.appendChild(div)
  }
  document.body.appendChild(result);
  location.href = '#result';
  e.preventDefault();
};