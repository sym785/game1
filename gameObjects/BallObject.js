var SETTINGS = require("./SETTINGS.js");
var BaseObject = require("./BaseObject.js");

function Ball() {
  BaseObject.call(this);

  this.status.x = (SETTINGS.WIDTH - SETTINGS.BALL.WIDTH) * 0.5;
  this.status.y = (SETTINGS.HEIGHT - SETTINGS.BALL.HEIGHT) * 0.5;
  this.dx = 1;
  this.dy = 1;
  this.status.shape = "rectangle";
  this.status.width = SETTINGS.BALL.WIDTH;
  this.status.height = SETTINGS.BALL.HEIGHT;
  this.status.color = "#000000";
}

Ball.prototype = new BaseObject();
Ball.prototype.constructor = Ball;
Ball.prototype.update = function() {
  this.status.x += this.dx;
  this.status.y += this.dy;

  if (this.status.x <= 0 || this.status.x + this.status.width >= SETTINGS.WIDTH) {
    this.dx *= -1;
  }

  if (this.status.y <= 0 || this.status.y + this.status.height >= SETTINGS.HEIGHT) {
    this.dy *= -1;
  }
};

module.exports = Ball;
