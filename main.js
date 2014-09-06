var debugCanvas = document.getElementById("debugCanvas");
var myCanvas = document.getElementById("myCanvas");

var detectPoints = new DetectPoints(debugCanvas);
var drawPoints = new DrawPoints(myCanvas);
var preDetectPoints = [];

var data = new Data();

var timer = 0;
var startCounting = false;
var maxThreshold = 18;

function setup() {
  detectPoints.init();
}

function update() {

  detectPoints.draw();

  if (detectPoints.points.length < maxThreshold) {
    if (detectPoints.points.length < 3) {
      //console.log("no movement :(");
    } else {
      drawPoints.updatePoints(detectPoints.points, detectPoints.width,
        detectPoints.height);
      drawPoints.makeTriangle();
    }
  }

  drawPoints.draw();

  data.getPoints(drawPoints.vertices);

  data.getTriangleNum(drawPoints.myTriangles.length);
  //console.log(data.triangleNumber);

  data.getAvg();
  data.getTotalDist();

}

function loop(callback) {
  requestAnimationFrame(function () {
    loop(callback);
  });
  callback();
}

setup();
loop(update);