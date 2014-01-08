define(['lib/teoria', 'lib/subcollider', 'lib/keyboard', 'lib/timbre', 'app/synth'],
function(teoria, sc, KeyboardJS, T, Synth) {

  // mappings from key names ('q') to midi notes (0)
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

  function Bayan(canvas) {
    self = this;
    this.keys = {};
    this.lastKeyUp = 'backspace';
    this.canvas = canvas;
    this.octave = 5;
    this.layout = LAYOUT_CR;
  }

  // Class methods
  Bayan.keyForEvent = function(e) {
    var keyCode = e.keyCode ? e.keyCode : e.which;
    var names = KeyboardJS.key.name(keyCode);
    return names[names.length - 1];
  }

  Bayan.midiNumberForKey = function(k) {
    var midiNumber = self.layout[k];
    if (midiNumber === undefined) {
      return -1;
    }
    midiNumber = midiNumber + self.octave*12;
    return midiNumber;
  }

  // Instance methods
  Bayan.prototype.init = function() {
    this.canvas.focus();

    // 'this' refers to the element the event originates from.
    // http://jibbering.com/faq/notes/closures
    var self = this;
    // Key down handler
    this.canvas.onkeydown = function(e) {
      e.preventDefault();
      var k = Bayan.keyForEvent(e);
      // Prevent key repeat
      if (self.keys[k]) {
        return;
      }
      // Prevent '-' and '=' keys from triggering 'backspace' and 'v'
      // Tested in Chrome, not sure about other browsers
      if (k === 'backspace'
          || (k === 'v'
              && (self.keys['-'] || self.keys['=']
                  || self.lastKeyUp === '-' || self.lastKeyUp === '='))) {
        delete self.keys['v'];
        delete self.keys['backspace'];
        return;
      }
      self.keys[k] = true;

      var midiNumber = Bayan.midiNumberForKey(k);
      if (midiNumber < 0) {
        return;
      }

      var note = teoria.note.fromMIDI(midiNumber);
      var freq = sc.Scale.chromatic("equal").degreeToFreq(midiNumber, (0).midicps(), self.octave);
      console.log(midiNumber + note.toString() + " " + freq);

      self.synth.noteOn(midiNumber);
    }

    // Key up handler
    this.canvas.onkeyup = function(e) {
      e.preventDefault();
      // silence backspace
      if (k === 'backspace') {
        return;
      }
      var k = Bayan.keyForEvent(e);
      delete self.keys[k];
      self.lastKeyUp = k;

      var midiNumber = Bayan.midiNumberForKey(k);
      if (midiNumber < 0) {
        return;
      }
      self.synth.noteOff(midiNumber);
    }

    this.synth = new Synth();
  }

  return Bayan;
});
