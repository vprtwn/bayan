// Module
var Bayan = (function() {
  var canvas;
  var audioContext;
  var oscillators;
  var gainNode;
  var keysDown;

  // Constructor
  var Bayan = function() {
    canvas = document.getElementById('bayan');
    audioContext = new webkitAudioContext();
    keysDown = {}

    Bayan.setupEventListeners();
  }

  // Key object
  function Key() {
  }
  Key.keyCodeForEvent = function(e) {
    return e.keyCode ? e.keyCode : e.which;
  }

  // Event listeners
  Bayan.setupEventListeners = function() {
    canvas.focus();
    canvas.addEventListener('keydown', Bayan.keyDown);
    canvas.addEventListener('keyup', Bayan.keyUp);
  }

  // Event callbacks
  Bayan.keyDown = function(e) {
    var keycode = Key.keyCodeForEvent(e);
    if (keysDown[keycode]) {
      return;
    }
    keysDown[keycode] = true;

    e.preventDefault();

    console.log(keycode);
  }

  Bayan.keyUp = function(e) {
    var keycode = Key.keyCodeForEvent(e);
    keysDown[keycode] = false;

    console.log(keycode);
  }


  return Bayan;
})();

// Initialize the page.
window.onload = function() {
  var bayan = new Bayan();
}
