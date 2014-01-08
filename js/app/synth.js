define(['lib/timbre'],
function(T) {

  var synthDef;

  function Synth() {
    this.synthDef = T("SynthDef").play();
    this.synthDef.def = function(opts) {
      var VCO = T("sin", {freq:opts.freq});

      var cutoff = T("env", {table:[8000, [opts.freq, 500]]}).bang();
      var VCF    = T("lpf", {cutoff:cutoff, Q:5}, VCO);

      var EG  = T("adsr", {a:15, d:500, s:0.45, r:15, lv:0.1});
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
