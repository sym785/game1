var SETTINGS = require("./SETTINGS.js");
var BaseObject = require("./BaseObject.js");

var DIR = { RIGHT : 1, LEFT : -1};
var COLLUSION_TYPE = {NO_COLLUSION : -1, VERTICAL : 1, HORIZONTAL : 2};

function Ball() {
  BaseObject.call(this);

  this.status.x = (SETTINGS.WIDTH - SETTINGS.BALL.WIDTH) * 0.5;
  this.status.y = (SETTINGS.HEIGHT - SETTINGS.BALL.HEIGHT) * 0.5;
  this.dx = 1;
  this.dy = 1;
  this.speed = 2;
  this.status.shape = "rectangle";
  this.status.width = SETTINGS.BALL.WIDTH;
  this.status.height = SETTINGS.BALL.HEIGHT;
  this.status.color = "#000000";
}

Ball.prototype = new BaseObject();
Ball.prototype.constructor = Ball;
Ball.prototype.update = function(objects) {
  this.status.x += this.dx * this.speed;
  this.status.y += this.dy * this.speed;
  if (this.status.x <= 0 - this.status.width * 2) {
    this.dx = Math.abs(this.dx);
  }
  if (this.status.x + this.status.width >= SETTINGS.WIDTH + this.status.width * 2) {
    this.dx = -Math.abs(this.dx);
  }
  if (this.status.y <= 0 + SETTINGS.BORDER_WIDTH) {
    this.dy = Math.abs(this.dy);
  }
  if (this.status.y + this.status.height >= SETTINGS.HEIGHT - SETTINGS.BORDER_WIDTH) {
    this.dy = -Math.abs(this.dy);
  }

  var headingTo = (this.dx > 0)? (DIR.RIGHT) : (DIR.LEFT);

  for (var object in objects) {
    var status = objects[object].status;
    if (object != "ball") {
      var collusionType = ballCollunsionCheck(this.status, status, headingTo, Math.abs(this.dx));
      switch (collusionType) {
        case COLLUSION_TYPE.NO_COLLUSION :
          break;
        case COLLUSION_TYPE.VERTICAL :
          this.dy = bounce(this.status.y + this.status.height / 2, status.y + status.height / 2, this.dy);
          break;
        case COLLUSION_TYPE.HORIZONTAL :
          this.dx = bounce(this.status.x + this.status.width / 2, status.x + status.width / 2, this.dx);
          break;
      }
    }
  }
};

module.exports = Ball;

function bounce (x, y, v) {
  return x < y ? -Math.abs(v) : Math.abs(v);
}

function ballCollunsionCheck(ball, player, headingTo, xVelocity) {
  var adj = -headingTo * xVelocity; // previous x coordinate

  if (pointSquareCollusionCheck(ball.x, ball.y, player)) {
    return pointSquareCollusionCheck(adj + ball.x, ball.y, player)? COLLUSION_TYPE.VERTICAL : COLLUSION_TYPE.HORIZONTAL;
  }
  if (pointSquareCollusionCheck(ball.x + ball.width, ball.y, player)) {
    return pointSquareCollusionCheck(adj + ball.x + ball.width, ball.y, player)? COLLUSION_TYPE.VERTICAL : COLLUSION_TYPE.HORIZONTAL;
  }
  if (pointSquareCollusionCheck(ball.x, ball.y + ball.height, player)) {
    return pointSquareCollusionCheck(adj + ball.x, ball.y + ball.height, player)? COLLUSION_TYPE.VERTICAL : COLLUSION_TYPE.HORIZONTAL;
  }
  if (pointSquareCollusionCheck(ball.x + ball.width, ball.y + ball.height, player)) {
    return pointSquareCollusionCheck(adj + ball.x + ball.width, ball.y + ball.height, player)? COLLUSION_TYPE.VERTICAL : COLLUSION_TYPE.HORIZONTAL;
  }

  return COLLUSION_TYPE.NO_COLLUSION;
}

function pointSquareCollusionCheck(x, y, square) {
  if (x >= square.x && x <= square.x + square.width && y >= square.y && y <= square.y + square.height) {
    return true;
  }

  return false;
}
