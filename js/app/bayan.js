define(['lib/teoria', 'lib/subcollider', 'lib/keyboard', 'lib/timbre', 'lib/easeljs', 'app/synth', 'app/key'],
function (teoria, sc, KeyboardJS, T, createjs, Synth, Key) {

  // mappings from qwerty key names ('q') to midi notes (0)
  // Bayan, left to right
  var LAYOUT_BL =
  {'q':0,  'a':1,   'z':2,
   '2':14, 'w':3,   's':4,  'x':5,
   '3':17, 'e':6,   'd':7,  'c':8,
   '4':20, 'r':9,   'f':10, 'v':11,
   '5':23, 't':12,  'g':13, 'b':14,
   '6':26, 'y':15,  'h':16, 'n':17,
   '7':29, 'u':18,  'j':19, 'm':20,
   '8':32, 'i':21,  'k':22, ',':23,
   '9':35, 'o':24,  'l':25, '.':26,
   '0':38, 'p':27,  ';':28, '/':29,
   '-':41, '[':30,  '\'':31};

  var QWERTY =
  [['2','3','4','5','6','7','8','9','0','-'],
   ['q','w','e','r','t','y','u','i','o','p','['],
   ['a','s','d','f','g','h','j','k','l',';','\''],
   ['z','x','c','v','b','n','m',',','.','/']];


  function Bayan(canvas) {
    this.keys = {};
    this.lastKeyUp = 'backspace';
    this.canvas = canvas;
    this.octave = 5;
    this.layout = LAYOUT_BL;
    this.stage = new createjs.Stage(canvas);
    this.keyboard = {};
  }

  // Class methods
  Bayan.keyForEvent = function(e) {
    var keyCode = e.keyCode ? e.keyCode : e.which;
    var names = KeyboardJS.key.name(keyCode);
    return names[names.length - 1];
  }


  // Instance methods
  Bayan.prototype.midiNumberForKey = function(k) {
    var midiNumber = this.layout[k];
    if (midiNumber === undefined) {
      return -1;
    }
    midiNumber = midiNumber + this.octave*12;
    return midiNumber;
  }


  Bayan.prototype.init = function() {
    // in an event handler, 'this' refers to the element the event originates from.
    // http://jibbering.com/faq/notes/closures
    var self = this;
    // Key down handler
    document.onkeydown = function(e) {
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

      var midiNumber = self.midiNumberForKey(k);
      if (midiNumber < 0) {
        return;
      }

      var note = teoria.note.fromMIDI(midiNumber);
      var freq = sc.Scale.chromatic("equal").degreeToFreq(midiNumber, (0).midicps(), self.octave);
      console.log(midiNumber + note.toString() + " " + freq);

      self.synth.noteOn(midiNumber);
    }

    // Key up handler
    document.onkeyup = function(e) {
      e.preventDefault();
      // silence backspace
      if (k === 'backspace') {
        return;
      }
      var k = Bayan.keyForEvent(e);
      delete self.keys[k];
      self.lastKeyUp = k;

      var midiNumber = self.midiNumberForKey(k);
      if (midiNumber < 0) {
        return;
      }
      self.synth.noteOff(midiNumber);
    }

    this.synth = new Synth();
    this.createKeyboard();
  }

  Bayan.prototype.createKeyboard = function () {
    var width = Key.width();
    var padding = width*0.1;
    for (var r = 0; r < QWERTY.length; r++) {
      for (var c = 0; c < QWERTY[r].length; c++) {
        key = QWERTY[r][c];
        var xOffset = 0;
        switch (r) {
          case 0:
          case 2:
            xOffset = width*0.5;
            break;
          case 3:
            xOffset = width;
            break;
          case 1:
          default:
            break;
        }
        console.log(key);
        this.keyboard[key] = Key(c*(Key.width() + padding) + xOffset, r*(Key.width() + padding),
                                    this.midiNumberForKey(key), key,
                                    this.stage);
      }
    }
  }

  Bayan.prototype.redraw = function () {
    this.stage.update();
  }

  return Bayan;
});
