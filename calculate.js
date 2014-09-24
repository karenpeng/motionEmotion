(function (exports) {

  function calsize(maxX, minX, maxY, minY) {
    var dx = maxX - minX;
    var dy = maxY - minY;
    var dist = Math.floor(Math.sqrt(dx * dx + dy * dy));
    return dist;
  }

  function Data() {
    this.points = [];
    this.avgX;
    this.avgY;
    this.totalDist;
    this.maxX = 0;
    this.minX = 10000;
    this.maxY = 0;
    this.minY = 10000;
  }

  Data.prototype.getPoints = function (points) {
    this.points = [];
    for (var i = 0; i < points.length; i++) {
      this.points[i] = [points[i][0], points[i][1]];
    }
  };

  Data.prototype.getPointsNum = function (pLength) {
    this.pointNumber = pLength;
  };

  Data.prototype.getTriangleNum = function (triLength) {
    this.triangleNumber = triLength;
  };

  Data.prototype.getTriangleAlpha = function (alpha) {
    this.triangleAlpha = alpha;
  };

  Data.prototype.getAvg = function () {
    var sumX = 0;
    var sumY = 0;
    for (var i = 0; i < this.points.length; i++) {
      sumX += this.points[i][0];
      sumY += this.points[i][1];
    }
    this.avgX = Math.floor(sumX / this.points.length);
    this.avgY = Math.floor(sumY / this.points.length);
  };

  Data.prototype.getTotalDist = function () {
    if (this.points.length !== 0) {
      this.maxX = 0;
      this.minX = 10000;
      this.maxY = 0;
      this.minY = 10000;
      var maxXi, minXi, maxYi, minYi;
      for (var j = 0; j < this.points.length; j++) {
        p = this.points[j];
        if (p[0] > this.maxX) {
          this.maxX = p[0];
          maxXi = j;
        }
        if (p[0] < this.minX) {
          this.minX = p[0];
          minXi = j;
        }
        if (p[1] > this.maxY) {
          this.maxY = p[1];
          maxYi = j;
        }
        if (p[1] < this.minY) {
          this.minY = p[1];
          minYi = j;
        }
      }
      //console.log(maxX, minX, maxY, minY);
      var dist = calsize(this.maxX, this.minX, this.maxY, this.minY);
      this.totalDist = dist;
    } else {
      this.totalDist = 0;
    }
  };

  exports.Data = Data;

})(this);