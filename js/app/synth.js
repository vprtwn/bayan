define(['lib/timbre'],
function(T) {

  var synthDef;

  function Synth() {
    this.synthDef = T("SynthDef").play();
    this.synthDef.def = function(opts) {
      var VCO = T("tri", {freq:opts.freq});

      var eq = T("eq", {
        params:{lpf:[700,0,-24]}
      }, VCO);

      var EG  = T("adsr", {a:15, d:0, s:0.1, r:0.1, lv:0.1});
      var VCA = EG.append(eq).bang();

      return VCA;
    };
  }

  Synth.prototype.noteOn = function(midiNumber) {
    this.synthDef.noteOn(midiNumber);
  }

  Synth.prototype.noteOff = function(midiNumber) {
    this.synthDef.noteOff(midiNumber);
  }

  return Synth;
});
