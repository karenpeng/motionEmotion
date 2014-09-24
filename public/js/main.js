var debugCanvas = document.getElementById("debugCanvas");
var myCanvas = document.getElementById("myCanvas");

var detectPoints = new DetectPoints(debugCanvas);
var drawPoints = new DrawPoints(myCanvas);

if (bgActive) {
  var bgCanvas = document.getElementById("bgCanvas");
  var bgShapes = new BgShapes(bgCanvas);
}

var data = new Data();

// var stats = new Stats();
// stats.setMode(0);
// // Align top-left
// stats.domElement.style.position = 'absolute';
// stats.domElement.style.left = '0px';
// stats.domElement.style.top = '0px';

// document.body.appendChild(stats.domElement);

// var timer = 0;
// var startCounting = false;
var maxThreshold = 15;
var frameRate = 30;

var myEmotion = new MyClmTracker();
var startCountingEmoji = false;
var emojiTimer = 0;

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
    drawPoints.makeTriangle(curEmotion);
  }

  drawPoints.draw();

  // if (drawPoints.myTriangles.length > 0) {
  //   if (drawPoints.myTriangles[0].alpha < 0.64) {
  //     startCounting = true;
  //   } else {
  //     startCounting = false;
  //     timer = 0;
  //   }
  // }

  // if (startCounting) {
  //   timer++;
  // }

  // if (timer === 1) {
  //   freezeCallback();
  // }

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

  if (drawPoints.myTriangles.length <= 1 || data.triangleAlpha < 0.05) {
    myEmotion.update();
    curEmotion = myEmotion.maxEmo;
  }

  if (preEmotion !== curEmotion) {
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
    }
    setNewEmo(curEmotion);
    preEmotion = curEmotion;
    startCountingEmoji = true;
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

function loop(callback) {
  setTimeout(function () {
    requestAnimationFrame(function () {
      loop(callback);
    });
    //stats.begin();
    callback();
    //stats.end();

  }, 1000 / frameRate);
}

setup();
setTimeout(function () {
  //do nothing;
}, 200);
loop(update);