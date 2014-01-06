requirejs.config({
  baseURL: 'js',
  paths: {
    lib: 'lib',
    app: 'app'
  },
  shim: {
    'lib/teoria' : {
      exports: 'teoria'
    }
  }
});

requirejs(['app/bayan'],
function (Bayan) {

  var canvas = document.getElementById('bayan');
  var bayan = new Bayan(canvas);
  bayan.init();

});

