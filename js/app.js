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
    }
  }
});

requirejs(['app/bayan'],
function (Bayan) {

  var canvas = document.getElementById('bayan');
  var bayan = new Bayan(canvas);
  bayan.init();

});

