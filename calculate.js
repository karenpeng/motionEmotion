(function (exports) {

  function Calculate() {
    this.points = [];
  }

  Calculate.prototype.getPoints = function (points) {
    this.points = [];
    for (var i = 0; i < points.length; i++) {
      this.points[i] = [points[i].x, points[i].y];
    }
  }

  Calculate.prototype.getAve = function () {
    var sumX = 0;
    var sumY = 0;
    for (var i = 0; i < this.points.length; i++) {
      var sumX += this.points[i].x;
      var sumY += this.points[i].y;
    }
    var aveX = sumX / this.points.length;
    var aveY = sumY / this.points.length;
    var positionData = {
      "aveX": aveX,
      "aveY": aveY
    }
    return positionData;
  }

  Calculate.prototype.getSize = function () {
    for (var)
  }

  exports.Calculate = Calculate;

})(this);