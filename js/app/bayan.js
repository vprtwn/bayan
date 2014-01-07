define(['lib/teoria', 'lib/subcollider', 'lib/keyboard', 'lib/timbre'],
function(teoria, sc, KeyboardJS, T) {

  console.log(sc.midicps(69));

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

  var keys = {};
  var lastKeyUp = 'backspace';
  var octave = 5;
  var layout = LAYOUT_CR;

  // SYNTH put this in a module
  var synth = T("SynthDef").play();
  synth.def = function(opts) {
    var VCO = T("sin", {freq:opts.freq});

    var cutoff = T("env", {table:[8000, [opts.freq, 500]]}).bang();
    var VCF    = T("lpf", {cutoff:cutoff, Q:5}, VCO);

    var EG  = T("adsr", {a:15, d:500, s:0.45, r:15, lv:0.2});
    var VCA = EG.append(VCF).bang();

    return VCA;
  };

  function Bayan(canvas) {
    this.canvas = canvas;
  }

  // Class methods
  Bayan.keyForEvent = function(e) {
    var keyCode = e.keyCode ? e.keyCode : e.which;
    var names = KeyboardJS.key.name(keyCode);
    return names[names.length - 1];
  }

  Bayan.midiNumberForKey = function(k) {
    var midiNumber = layout[k];
    if (midiNumber === undefined) {
      return -1;
    }
    midiNumber = midiNumber + octave*12;
    return midiNumber;
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
    if (keys[k]) {
      return;
    }
    // Prevent '-' and '=' keys from triggering 'backspace' and 'v'
    // Tested in Chrome, not sure about other browsers
    if (k === 'backspace'
        || (k === 'v'
            && (keys['-'] || keys['=']
                || lastKeyUp === '-' || lastKeyUp === '='))) {
      delete keys['v'];
      delete keys['backspace'];
      return;
    }
    keys[k] = true;

    var midiNumber = Bayan.midiNumberForKey(k);
    if (midiNumber < 0) {
      return;
    }
    var note = teoria.note.fromMIDI(midiNumber);
    var freq = sc.Scale.chromatic("equal").degreeToFreq(midiNumber, (0).midicps(), octave);
    console.log(midiNumber + note.toString() + " " + freq);
    synth.noteOn(midiNumber);
  }

  Bayan.prototype.keyUp = function(e) {
    e.preventDefault();
    // Silence keys not in layout
    if (k === 'backspace') {//!layout[k]) {
      return;
    }
    var k = Bayan.keyForEvent(e);
    delete keys[k];
    lastKeyUp = k;

    var midiNumber = Bayan.midiNumberForKey(k);
    if (midiNumber < 0) {
      return;
    }

    synth.noteOff(midiNumber);
  }

  return Bayan;
});
