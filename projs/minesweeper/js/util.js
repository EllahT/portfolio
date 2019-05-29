'use strict'

function getRandomColor() {
  var letters = '0123456789ABCDEF'.split('');
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

function getRandomIntInclusive(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getClassName(location) {
	var cellClass = 'cell' + location.i + '-' + location.j;
	return cellClass;
}

function disableRightClick() {
  if (document.addEventListener) { 
    document.addEventListener('contextmenu', function(e) {
        e.preventDefault();
    }, false);
  } else { 
    document.attachEvent('oncontextmenu', function() {
        window.event.returnValue = false;
    });
  }
}