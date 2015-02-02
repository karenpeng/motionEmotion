var debugCanvas = document.getElementById("debugCanvas");
var myCanvas = document.getElementById("myCanvas");
var context = myCanvas.getContext("2d");
var vid = document.getElementById("videoSource");
var startTimer = 0;
//context.globalCompositeOperation = "multipy";

var detectPoints = new DetectPoints(debugCanvas);
var drawPoints = new DrawPoints(myCanvas);

if (bgActive) {
  var bgCanvas = document.getElementById("bgCanvas");
  var bgShapes = new BgShapes(bgCanvas);
}

var data = new Data();

var maxThreshold = 15;
var frameRate = 30;

var myEmotion = new MyClmTracker();
var startCountingEmoji = false;
var emojiTimer = 1;

var emoji = document.getElementById("emoji");

var preEmotion = null;
var curEmotion = 'happy';

function freezeCallback() {
  console.log("freeze!");
}

function setup() {
  detectPoints.init();
  myEmotion.init();
}

function lightUpTriangle(triangleNumber, fadeTime) {
  if (drawPoints.myTriangles && typeof (drawPoints.myTriangles[triangleNumber]) !==
    'undefined') {
    drawPoints.myTriangles[triangleNumber].lightnessOffset = 50;
    drawPoints.myTriangles[triangleNumber].lightnessDecay = 50 / (fadeTime *
      frameRate);
  }
}

function update() {
  if (bgShapes) {
    bgShapes.update();
    bgShapes.draw();
  }
  detectPoints.draw();

  if (detectPoints.points.length >= 3 && detectPoints.points.length <
    maxThreshold) {
    drawPoints.updatePoints(detectPoints.points, detectPoints.width,
      detectPoints.height);
    drawPoints.makeTriangle(preEmotion);
  }

  drawPoints.draw();

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

  data.getAvg();
  data.getTotalDist();

  if ((drawPoints.myTriangles.length <= 1 || data.triangleAlpha < 0.05) && emojiTimer === 0) {
    if (startTimer === 0) {
      //console.log("ouch!");
      myEmotion.ctrack.start(vid);
      startTimer++;
    }
    myEmotion.update();
    curEmotion = myEmotion.maxEmo;
  } else {
    myEmotion.ctrack.stop();
    startTimer = 0;
  }

  if (preEmotion !== curEmotion && curEmotion !== null) {
    switch (curEmotion) {
    case 'happy':
      emoji.innerHTML = '<img src="img/happy.png" width="60">';
      break;
    case 'sad':
      emoji.innerHTML = '<img src="img/sad.png" width="60">';
      break;
    case 'surprised':
      emoji.innerHTML = '<img src="img/surprise.png" width="60">';
      break;
    case 'angry':
      emoji.innerHTML = '<img src="img/angry.png" width="60">';
      break;
    default:
      emoji.innerHTML = null;
      break;
    }
    setNewEmo(curEmotion);
    preEmotion = curEmotion;
    startCountingEmoji = true;
    //console.log(curEmotion);
  }

  if (startCountingEmoji) {
    emojiTimer++;
  }

  if (emojiTimer > 20) {
    emoji.innerHTML = null;
    startCountingEmoji = false;
    emojiTimer = 0;
  }
}

function resize() {
  drawPoints.resize();
}

window.addEventListener('resize', resize, false);

var frameRate = 0;

function loop(callback) {
  requestAnimationFrame(function () {
    loop(callback);
  });

  if (frameRate % 3 === 0) {
    callback();
  }
  frameRate++;
  //console.log(frameRate);
}

setup();
setTimeout(function () {
  loop(update);
}, 1000);
setTimeout(function () {
  document.getElementById("reminder").style.display = "none";
}, 3500);
