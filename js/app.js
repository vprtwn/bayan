requirejs.config({
  baseURL: 'js',
  paths: {
    lib: 'lib',
    app: 'app'
  },
  shim: {
    'lib/teoria' : {
      exports: 'teoria'
    },
    'lib/subcollider' : {
      exports: 'sc'
    },
    'lib/timbre' : {
      exports: 'T'
    },
    'lib/easeljs' : {
      exports: 'createjs'
    }
  }
});

requirejs(['app/bayan'],
function (Bayan) {

  var canvas = document.getElementById('bayan');
  var context = canvas.getContext('2d');
  var textArea = document.getElementById('bayan-textarea');
  var bayan = new Bayan(canvas, textArea);

  window.addEventListener('resize', onResize, false);
  onResize();

  function onResize() {
    w = window.innerWidth;
    h = window.innerHeight;
    bayan.resize(w, h);
  }


});

