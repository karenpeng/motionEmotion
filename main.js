var debugCanvas = document.getElementById("debugCanvas");
var myCanvas = document.getElementById("myCanvas");

var detectPoints = new DetectPoints(debugCanvas);
var drawPoints = new DrawPoints(myCanvas);

var data = new Data();

var timer = 0;
var startCounting = false;
var maxThreshold = 18;
var frameRate = 30;

var globalEmotion = null;
var lastGlobalEmotion = null;
var startCountingEmoji = false;
var emojiTimer = 0;

var emoji = document.getElementById("emoji");

function freezeCallback() {
  //console.log("freeze!");
}

function setup() {
  detectPoints.init();
}

function lightUpTriangle(triangleNumber, fadeTime) {
  if (drawPoints.myTriangles && typeof (drawPoints.myTriangles[triangleNumber]) !==
    'undefined') {
    drawPoints.myTriangles[triangleNumber].lightnessOffset = 50;
    drawPoints.myTriangles[triangleNumber].lightnessDecay = 50 / (fadeTime *
      frameRate);
  }
}

function EmotionizeTriangle(emotion) {
  globalEmotion = emotion;
}

//var lastLoop = new Date();

//var frameRate = document.getElementById("fps");

function update() {
  // var thisLoop = new Date();
  // var fps = 1000 / (thisloop - lastLoop);
  // lastLoop = thisLoop;
  // frameRate.innerHTML = fps.toString();

  detectPoints.draw();

  if (detectPoints.points.length < maxThreshold) {
    if (detectPoints.points.length < 3) {} else {
      drawPoints.updatePoints(detectPoints.points, detectPoints.width,
        detectPoints.height);
      drawPoints.makeTriangle(globalEmotion);
    }
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

  if (lastGlobalEmotion !== globalEmotion) {
    switch (globalEmotion) {
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
    lastGlobalEmotion = globalEmotion;
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

  if (typeof (emoLoop) !== 'undefined' && drawPoints.myTriangles.length <= 1) {
    emoLoop();
  }

}

function loop(callback) {
  setTimeout(function () {
    requestAnimationFrame(function () {
      loop(callback);
    });
    callback();
  }, 1000 / frameRate);
}

setup();
setTimeout(function () {
  //do nothing;
}, 1000);
loop(update);