var debugCanvas = document.getElementById("debugCanvas");
var myCanvas = document.getElementById("myCanvas");

var detectPoints = new DetectPoints(debugCanvas);
var drawPoints = new DrawPoints(myCanvas);
var cornerDetect = new CornerDetect(debugCanvas);

function setup() {
		detectPoints.init();
		cornerDetect.init();
}

function update() {
		detectPoints.draw();
		drawPoints.getPoints(detectPoints.points, detectPoints.width, detectPoints.height);
		drawPoints.draw();
		cornerDetect.tick();
}

function loop(callback) {
		requestAnimationFrame(function () {
				loop(callback);
		});
		callback();
}

setup();
loop(update);

// window.onload = function(){

// };

//dat.gui
// var fizzyText = function(){
// 	detectPoints.threshold = 80;
// 	this.changes_sensitivity = 80;
// 	cornerDetect.threshold = 40;
// 	this.corner_sensitivity = 40;
// 	this.debug = true;
// }

// var text = new FizzyText();
// var gui = new dat.GUI();
// gui.add(text, 'changes_sensitivity', 60, 100).step(1);
// gui.add(text, 'corner_sensitivity', 20, 60).step(1);
// gui.add(text, 'changes_sensitivity', 60, 100).step(1);
// gui.add(text, 'corner_sensitivity', 20, 60).step(1);
// gui.add(text, 'debug');