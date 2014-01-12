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
  var bayan = new Bayan(canvas);
  bayan.init();

  window.addEventListener('resize', resizeCanvas, false);
  resizeCanvas();

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerWidth * 0.33;
    bayan.redraw();
  }

  function redraw() {
    context.strokeStyle = 'blue';
    context.lineWidth = '5';
    context.strokeRect(0, 0, window.innerWidth, window.innerHeight);
  }

});

