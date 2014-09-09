// thank you Audun Mathias Øygard for clmtrackr!
// http://auduno.github.io/clmtrackr/examples/clm_emotiondetection.html

var ctrack = new clm.tracker({
  useWebGL: true
});

ctrack.init(pModel);

var vid = document.getElementsByTagName('video')[0];
ctrack.start(vid);

var ec = new emotionClassifier();
ec.init(emotionModel);
var emotionData = ec.getBlank();

var currentEmo;
var prevEmo;
var maxEmo = null;

// called by animation loop
function emoLoop() {
  var cp = ctrack.getCurrentParameters();
  var er = ec.meanPredict(cp);
  // var maxEmo = null;
  var maxVal = 0.7;
  for (var i in er) {
    if (er[i].value > maxVal) {
      maxEmo = er[i].emotion;
      maxVal = er[i].value;
    }
  }
  if (maxEmo !== prevEmo) {
    setNewEmo(maxEmo);
    EmotionizeTriangle(maxEmo);
    currentEmo = maxEmo;
    prevEmo = maxEmo;
  }
}