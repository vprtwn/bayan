define(['lib/timbre'],
function(T) {

  var synthDef;

  function Synth() {
    this.synthDef = T("SynthDef").play();
    this.synthDef.def = function(opts) {
      var VCO = T("sin", {freq:opts.freq});

      var cutoff = T("env", {table:[440, [440, 500], [1660, 250]]}).bang();
      var VCF    = T("lpf", {cutoff:1079, Q:1}, VCO);

      var EG  = T("adsr", {a:15, d:0, s:0.2, r:0, lv:0.1});
      var VCA = EG.append(VCF).bang();

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
