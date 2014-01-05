define(['lib/teoria', 'lib/keyboard'],
function(teoria, KeyboardJS) {

  // mappings from key names ('q') to midi notes (1)
  // "Western European" (type C), right handed.
  var MAPPING_CR =
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

  var keys = {};
  var lastKeyUp = 'backspace';
  var octave = 0;

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
  }

  Bayan.prototype.keyDown = function(e) {
    e.preventDefault();
    var k = Bayan.keyForEvent(e);
    // Prevent key repeat
    if (keys[k]) {
      return;
    }
    // Prevent '-' and '=' keys from triggering 'backspace' and 'v'
    // Tested in Chrome, not sure about other browsers
    if (k == 'backspace'
        || (k == 'v'
            && (keys['-'] || keys['=']
                || lastKeyUp == '-' || lastKeyUp == '='))) {
      delete keys['v'];
      delete keys['backspace'];
      return;
    }
    keys[k] = true;

    console.log(keys);
  }

  Bayan.prototype.keyUp = function(e) {
    e.preventDefault();
    var k = Bayan.keyForEvent(e);
    delete keys[k];
    // Silence backspace
    if (k == 'backspace') {
      return;
    }

    lastKeyUp = k;
    console.log('up ' + k);
  }

  return Bayan;
});
