define(['lib/teoria', 'lib/subcollider', 'lib/keyboard', 'lib/timbre', 'lib/easeljs', 'app/synth'],
function(teoria, sc, KeyboardJS, T, createjs, Synth) {

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
    self = this;
    this.keyboard = QWERTY.map(function (r) {
      return r.map(function (e) {
        var circle = new createjs.Shape();
        circle.graphics.beginFill("red").drawCircle(0,0,40);
        circle.x = e.charCodeAt(0);
        self.stage.addChild(circle);
        self.stage.update();
        return circle
      });
    });

    this.stage.update();
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
    // 'this' refers to the element the event originates from.
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
    document.onkeyup = function(e) {
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

  Bayan.prototype.redraw = function () {
    this.stage.update();
  }

  return Bayan;
});
