// thank you Audun Mathias Øygard for clmtrackr!
// http://auduno.github.io/clmtrackr/examples/clm_emotiondetection.html

(function (exports) {

  function MyClmTracker() {

  }

  MyClmTracker.prototype.init = function () {
    this.ctrack = new clm.tracker({
      useWebGL: true
    });

    this.ctrack.init(pModel);

    var vid = document.getElementsByTagName('video')[0];
    this.ctrack.start(vid);

    this.ec = new emotionClassifier();
    this.ec.init(emotionModel);
    this.emotionData = this.ec.getBlank();

    this.maxEmo = null;
  };
  // called by animation loop
  MyClmTracker.prototype.update = function () {
    var cp = this.ctrack.getCurrentParameters();
    var er = this.ec.meanPredict(cp);
    this.maxEmo = null;
    var maxVal = 0.3;
    if (er.length > 0) {
      var that = this;
      er.forEach(function (item) {
        if (item.value > maxVal) {
          that.maxEmo = item.emotion;
          maxVal = item.value;
        }
      });
    }
  };

  exports.MyClmTracker = MyClmTracker;

})(this);