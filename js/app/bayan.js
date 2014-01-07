define(['lib/teoria', 'lib/subcollider', 'lib/keyboard', 'lib/timbre'],
function(teoria, sc, KeyboardJS, T) {

  console.log(sc.midicps(69));
  T("sin", {freq:880, mul:0.5}).play();

  // mappings from key names ('q') to midi notes (1)
  // "Western European" (type C), right handed.
  var LAYOUT_CR =
  {']':0,  '\'':1,  '/':2,
   '=':14,  '[':3,  ';':4,  '.':5,
   '-':17,  'p':6,  'l':7,  ',':8,
   '0':20,  'o':9, 'k':10, 'm':11,
   '9':23,  'i':12, 'j':13, 'n':14,
   '8':26,  'u':15, 'h':16, 'b':17,
   '7':29,  'y':18, 'g':19, 'v':20,
   '6':32,  't':21, 'f':22, 'c':23,
   '5':35,  'r':24, 'd':25, 'x':26,
   '4':38,  'e':27, 's':28, 'z':29,
   '3':41,  'w':30, 'a':31};

  var keys = {};
  var lastKeyUp = 'backspace';
  var octave = 1;
  var layout = LAYOUT_CR;

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
    // Prevent key repeat and silence keys not in layout
    if (keys[k]) {// || !layout[k]) {
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

    var midiNote = layout[k];
    if (midiNote == undefined) {
      return;
    }
    var note = teoria.note.fromMIDI(midiNote + octave*12);
    var freq = sc.Scale.chromatic().degreeToFreq(midiNote, (12).midicps(), octave);
    console.log(note.toString() + " " + freq);
  }

  Bayan.prototype.keyUp = function(e) {
    e.preventDefault();
    // Silence keys not in layout
    if (k == 'backspace') {//!layout[k]) {
      return;
    }
    var k = Bayan.keyForEvent(e);
    delete keys[k];
    lastKeyUp = k;

    var midiNote = layout[k];
    if (midiNote == undefined) {
      return;
    }
    // console.log('up ' + k);
  }

  return Bayan;
});
