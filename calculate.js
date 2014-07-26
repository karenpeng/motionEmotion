(function (exports) {

  function Data() {
    this.points = [];
    this.avgX;
    this.avgY;
    this.totalSize;
  }

  Data.prototype.getPoints = function (points) {
    //console.log(points)
    //if (points.length !== 0) {
    this.points = [];
    for (var i = 0; i < points.length; i++) {
      this.points[i] = [points[i][0], points[i][1]];
    }
    // }
  }

  Data.prototype.getAvg = function () {
    //if (this.points.length !== 0) {
    var sumX = 0;
    var sumY = 0;
    for (var i = 0; i < this.points.length; i++) {
      sumX += this.points[i][0];
      sumY += this.points[i][1];
    }
    this.avgX = Math.floor(sumX / this.points.length);
    this.avgY = Math.floor(sumY / this.points.length);
    //console.log(this.avgX, this.avgY)
    //}
  }

  Data.prototype.getSize = function () {
    // for (var j = 0; j<  ){

    // }
  }

  exports.Data = Data;

})(this);