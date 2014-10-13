(function (exports) {

  function colorDiff(colorA, colorB) {
    var rDiff = Math.abs(colorA[0] - colorB[0]);
    var gDiff = Math.abs(colorA[1] - colorB[1]);
    var bDiff = Math.abs(colorA[2] - colorB[2]);
    var aveDiff = (rDiff + gDiff + bDiff) / 3;
    return aveDiff;
  }

  function DetectPoints(can) {
    this.can = can;
    this.ctx = this.can.getContext('2d');
    this.sampleRate = 4;
    this.width = this.can.width;
    this.height = this.can.height;
    this.currentColorX = [];
    this.previousColorX = [];
    this.currentColorY = [];
    this.previousColorY = [];
    this.colorDiffShrehold = 40;
    this.points = [];
  }

  DetectPoints.prototype.init = function () {
    for (var j = 0; j < this.height; j += this.sampleRate) {
      for (var i = 0; i < this.width; i += this.sampleRate) {
        this.previousColorX.push([0, 0, 0, 255]);
      }
    }

    for (var ii = 0; ii < this.width; ii += this.sampleRate) {
      for (var jj = 0; jj < this.height; jj += this.sampleRate) {
        this.previousColorY.push([0, 0, 0, 255]);
      }
    }
  };

  DetectPoints.prototype.draw = function () {

    this.ctx.save();
    this.ctx.translate(this.width, 0);
    this.ctx.scale(-1, 1);
    if (WEBCAM.localMediaStream) {
      this.ctx.drawImage(WEBCAM.video, 0, 0, this.width, this.height);
    }
    this.ctx.restore();

    var index = 0;
    var index2 = 0;

    var rawPointsX = [];
    var rawPointsY = [];

    if (WEBCAM.localMediaStream) {
      for (var j = 0; j < this.height; j += this.sampleRate) {
        for (var i = 0; i < this.width; i += this.sampleRate) {
          var dataX = this.ctx.getImageData(i, j, 1, 1).data;
          this.currentColorX[index] = dataX;
          var colorDifferenceX = colorDiff(this.previousColorX[index], this.currentColorX[
            index]);
          if (colorDifferenceX > this.colorDiffShrehold) {
            rawPointsX.push([i, j]);
          }
          this.previousColorX[index] = this.currentColorX[index];
          index++;

        }
      }

      for (var ii = 0; ii < this.width; ii += this.sampleRate) {
        for (var jj = 0; jj < this.height; jj += this.sampleRate) {
          var dataY = this.ctx.getImageData(ii, jj, 1, 1).data;
          this.currentColorY[index2] = dataY;
          var colorDifferenceY = colorDiff(this.previousColorY[index2], this.currentColorY[
            index2]);
          if (colorDifferenceY > this.colorDiffShrehold) {
            rawPointsY.push([ii, jj]);
          }
          this.previousColorY[index2] = this.currentColorY[index2];
          index2++;

        }
      }

      var getIndexes = [];
      var afterX = [];
      var afterY = [];
      for (var it = 1; it < rawPointsX.length - 1; it++) {
        if (rawPointsX[it][0] + this.sampleRate !== rawPointsX[it + 1][0] ||
          rawPointsX[it][0] - this.sampleRate !== rawPointsX[it - 1][0]) {
          afterX.push([rawPointsX[it][0], rawPointsX[it][1]]);
        }
      }

      for (var itt = 1; itt < rawPointsY.length - 1; itt++) {
        if (rawPointsY[itt][1] + this.sampleRate !== rawPointsY[itt + 1][1] ||
          rawPointsY[itt][1] - this.sampleRate !== rawPointsY[itt - 1][1]) {
          afterY.push([rawPointsY[itt][0], rawPointsY[itt][1]]);
        }
      }
      this.points = [];
      if (afterX.length !== 0 && afterY.length !== 0) {
        for (var x = 0; x < afterX.length; x++) {
          for (var y = 0; y < afterY.length; y++) {
            if (afterX[x][0] === afterY[y][0] && afterX[x][1] === afterY[y][1]) {
              this.points.push(new Point(afterX[x][0], afterX[x][1],
                "#ff00ff"));
            }

          }
        }
      }
    }

    //for debuging changes detection
    /*
    if (this.points !== []) {
      for (var k = 0; k < this.points.length - 1; k++) {
        this.points[k].render(this.can, 2);
      }
    }
*/
  };

  function Point(x, y, fillStyle) {
    this.x = x;
    this.y = y;
    this.fillStyle = fillStyle;
  }
  Point.prototype.render = function (can, radius) {
    ctx = can.getContext("2d");
    ctx.fillStyle = this.fillStyle;
    ctx.fillRect(this.x, this.y, radius, radius);
  };

  exports.DetectPoints = DetectPoints;

})(this);