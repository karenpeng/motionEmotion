var debugCanvas = document.getElementById("debugCanvas");
var myCanvas = document.getElementById("myCanvas");

var detectPoints = new DetectPoints(debugCanvas);
var drawPoints = new DrawPoints(myCanvas);

var data = new Data();

var timer = 0;
var startCounting = false;
var maxThreshold = 18;

function freezeCallback() {
  //console.log("freeze!");
}

function setup() {
  detectPoints.init();
}

function update() {

  detectPoints.draw();

  if (detectPoints.points.length < maxThreshold) {
    if (detectPoints.points.length < 3) {} else {
      drawPoints.updatePoints(detectPoints.points, detectPoints.width,
        detectPoints.height);
      drawPoints.makeTriangle();
    }
  }

  drawPoints.draw();
  if (drawPoints.myTriangles.length > 0) {
    if (drawPoints.myTriangles[0].alpha < 0.64) {
      startCounting = true;
    } else {
      startCounting = false;
      timer = 0;
    }
  }

  if (startCounting) {
    timer++;
  }

  if (timer === 1) {
    freezeCallback();
  }

  data.getPoints(drawPoints.vertices);
  //console.log(data.points);

  data.getPointsNum(drawPoints.vertices.length);
  //console.log(data.pointNumber);
  if (drawPoints.myTriangles.length > 0) {
    data.getTriangleAlpha(drawPoints.myTriangles[0].alpha);
  } else {
    data.triangleAlpha = 0;
  }
  //console.log(data.triangleAlpha);

  data.getTriangleNum(drawPoints.myTriangles.length);
  //console.log(data.triangleNumber);

  data.getAvg();
  data.getTotalDist();

}

function loop(callback) {
  requestAnimationFrame(function () {
    loop(callback);
  });
  // if (vid) {
  //   var context = myCanvas.getContext('2d');
  //   context.clearRect(0,0,myCanvas.width,myCanvas.height);
  //   context.drawImage(vid,0,0,myCanvas.width,myCanvas.height);
  //   context.putImageData(grayscale(context.getImageData(0,0,myCanvas.width,myCanvas.height)),0,0);
  // }

  callback();

  if (typeof (emoLoop) !== 'undefined') {
    emoLoop();
  }

}

setup();
setTimeout(function () {
  //do nothing;
}, 1000);
loop(update);