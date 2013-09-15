/* global Handlebars, Color */

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

    matches.forEach(function (value) {
      var color = Color(value).hexString().toLowerCase();
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
