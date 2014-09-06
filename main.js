var debugCanvas = document.getElementById("debugCanvas");
var myCanvas = document.getElementById("myCanvas");

var detectPoints = new DetectPoints(debugCanvas);
var drawPoints = new DrawPoints(myCanvas);
//var cornerDetect = new CornerDetect(debugCanvas);
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
  //console.log(drawPoints.vertices.length)
  data.getAvg();
  data.getTotalDist();
  //console.log(data.points.length, data.avgX, data.avgY)
  //console.log(data.totalDist)

  //cornerDetect.tick();

}

function loop(callback) {
  requestAnimationFrame(function () {
    loop(callback);
  });
  callback();
}

setup();
loop(update);