define(['lib/teoria', 'lib/keyboard'],
function(teoria, KeyboardJS) {

  function Bayan(canvas) {
    this.canvas = canvas;
    this.canvas.focus();
    this.canvas.addEventListener('keydown', this.keyDown);
    this.canvas.addEventListener('keyup', this.keyUp);
  }

  // Class methods
  Bayan.keyForEvent = function(e) {
    var keyCode = e.keyCode ? e.keyCode : e.which;
    var names = KeyboardJS.key.name(keyCode);
    return names[names.length - 1];
  }

  // Instance methods
  Bayan.prototype.keyDown = function(e) {
    e.preventDefault();
    var k = Bayan.keyForEvent(e);
    if (!this.keys) {
      this.keys = {};
    }
    if (this.keys[k]) {
      return;
    }
    this.keys[k] = true;

    console.log('down ' + k);
  }

  Bayan.prototype.keyUp = function(e) {
    e.preventDefault();
    var k = Bayan.keyForEvent(e);
    if (!this.keys) {
      this.keys = {};
    }
    this.keys[k] = false;

    console.log('up ' + k);
  }

  return Bayan;
});
