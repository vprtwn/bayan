define(['lib/easeljs', 'lib/teoria'],
function(createjs, teoria) {
  var W = window.innerWidth/16;
  var H = W;
  var TEXT_PADDING = W*0.1;
  var RADIUS = 10;
  var FONT = W*0.3 + "px Helvetica";
  var TEXT_COLOR = "#FFFFFF";
  var BLACK_COLOR = "#2c3e50";
  var WHITE_COLOR = "#bdc3c7";
  var BLUE_COLOR = "#01BEFF";
  var YELLOW_COLOR = "#f1c40f";

  function Key(x, y, midiNumber, keyName, stage) {
    this.x = x;
    this.y = y;
    this.midiNumber = midiNumber;
    this.keyName = keyName;
    this.stage = stage;
    this.shape = new createjs.Shape();

    // Using name and cursor to pass state in event callbacks.
    this.shape.name = keyName;
    this.shape.cursor = "up";

    var keyColor = WHITE_COLOR;
    if (this.isBlack() === true) {
      keyColor = BLACK_COLOR;
    }
    this.shape.graphics.beginFill(keyColor).drawRoundRect(this.x, this.y, Key.width(), Key.width(), RADIUS);
    this.stage.addChild(this.shape);

    this.text = new createjs.Text(keyName.toUpperCase(), FONT, TEXT_COLOR);
    this.text.x = x + TEXT_PADDING;
    this.text.y = y + TEXT_PADDING;
    this.text.baseline = "top";
    this.stage.addChild(this.text);

    this.stage.update();
  }

  // Class methods
  Key.width = function() {
    return W;
  }

  // Instance methods
  Key.prototype.isBlack = function() {
    var m = this.midiNumber % 12;
    return m === 1 || m === 3 || m === 6 || m === 8 || m === 10;
  }

  Key.prototype.keyDown = function() {
    this.shape.graphics.clear().beginFill(BLUE_COLOR).drawRoundRect(this.x, this.y, Key.width(), Key.width(), RADIUS);
    this.stage.update();
  }

  Key.prototype.keyUp = function() {
    var keyColor = WHITE_COLOR;
    if (this.isBlack() === true) {
      keyColor = BLACK_COLOR;
    }
    this.shape.graphics.clear().beginFill(keyColor).drawRoundRect(this.x, this.y, Key.width(), Key.width(), RADIUS);
    this.stage.update();
  }

  return Key;

});
