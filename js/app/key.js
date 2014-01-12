define(['lib/easeljs', 'lib/teoria'],
function(createjs) {
  var W = 30;
  var H = W;
  var RADIUS = 5;
  var UP_COLOR = "#000000";
  var DOWN_COLOR = "#FF0000";

  function Key(x, y, midi, keyname, stage) {
    this.x = x;
    this.y = y;
    this.midi = midi;
    this.keyname = keyname;
    this.stage = stage;
    this.shape = new createjs.Shape();
    this.shape.graphics.beginFill(UP_COLOR).drawRoundRect(this.x, this.y, Key.width(), Key.width(), RADIUS);
    this.stage.addChild(this.shape);
    this.stage.update();
  }

  // Class methods
  Key.width = function() {
    return W;
  }

  // Instance methods
  Key.prototype.keyDown = function() {
    // this.shape.graphics.clear().beginFill(DOWN_COLOR).drawRoundRect(this.x, this.y, Key.width(), Key.width(), RADIUS);
  }

  Key.prototype.keyUp = function() {
    // this.shape.graphics.clear().beginFill(UP_COLOR).drawRoundRect(this.x, this.y, Key.width(), Key.width(), RADIUS);
  }

  return Key;

});
