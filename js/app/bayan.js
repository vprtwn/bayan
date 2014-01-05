define(['lib/teoria', 'lib/keyboard'],
function(teoria, KeyboardJS) {

  // mappings from key names ('q') to midi notes (1)
  // "Western European" (type C), right handed.
  var mappingCR =
  {']':1,  '\'':2,  '/':3,
   '=':15,  '[':4,  ';':5,  '.':6,
   '-':18,  'p':7,  'l':8,  ',':9,
   '0':21,  'o':10, 'k':11, 'm':12,
   '9':24,  'i':13, 'j':14, 'n':15,
   '8':27,  'u':16, 'h':17, 'b':18,
   '7':30,  'y':19, 'g':20, 'v':21,
   '6':33,  't':22, 'f':23, 'c':24,
   '5':36,  'r':25, 'd':26, 'x':27,
   '4':39,  'e':28, 's':29, 'z':30,
   '3':42,  'w':31, 'a':32};

  function Bayan(canvas) {
    this.canvas = canvas;
  }

  // Class methods
  Bayan.keyForEvent = function(e) {
    var keyCode = e.keyCode ? e.keyCode : e.which;
    var names = KeyboardJS.key.name(keyCode);
    return names[names.length - 1];
  }

  // Instance methods
  Bayan.prototype.init = function() {
    this.canvas.focus();
    this.canvas.addEventListener('keydown', this.keyDown);
    this.canvas.addEventListener('keyup', this.keyUp);
    this.keys = {};
  }

  Bayan.prototype.keyDown = function(e) {
    e.preventDefault();
    var k = Bayan.keyForEvent(e);
    // Why doesn't init work?
    if (!this.keys) {
      this.keys = {};
    }
    // Prevent key repeat
    if (this.keys[k]) {
      return;
    }
    // Prevent '-' and '=' keys from triggering 'backspace' and 'v'
    // Tested in Chrome, not sure about other browsers
    if (k == 'backspace'
        || (k == 'v'
            && (this.keys['-'] || this.keys['=']
                || this.lastKeyUp == '-' || this.lastKeyUp == '='))) {
      delete this.keys['v'];
      delete this.keys['backspace'];
      return;
    }
    this.keys[k] = true;

    console.log(this.keys);
  }

  Bayan.prototype.keyUp = function(e) {
    e.preventDefault();
    var k = Bayan.keyForEvent(e);
    if (!this.keys) {
      this.keys = {};
    }
    delete this.keys[k];
    // Silence backspace
    if (k == 'backspace') {
      return;
    }

    this.lastKeyUp = k;
    console.log('up ' + k);
  }

  return Bayan;
});
