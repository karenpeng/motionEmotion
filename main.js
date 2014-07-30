var debugCanvas = document.getElementById("debugCanvas");
var myCanvas = document.getElementById("myCanvas");

var detectPoints = new DetectPoints(debugCanvas);
var drawPoints = new DrawPoints(myCanvas);
//var cornerDetect = new CornerDetect(debugCanvas);

var data = new Data();

function setup() {
		detectPoints.init();
		//cornerDetect.init();
}

function update() {
		detectPoints.draw();
		drawPoints.getPoints(detectPoints.points, detectPoints.width, detectPoints.height);
		drawPoints.draw();
		data.getPoints(drawPoints.vertices);
		//console.log(drawPoints.vertices.length)
		data.getAvg();
		data.getTotalDist();
		//console.log(data.points.length, data.avgX, data.avgY)
		// console.log(data.totalDist)

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