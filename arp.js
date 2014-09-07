var myCanvas = document.getElementById("myCanvas");
var width = myCanvas.width;
var height = myCanvas.height;
var maxDistance = Math.sqrt(Math.pow(width, 2) + Math.pow(height, 2));

var scale = [0, 2, 4, 7, 9, 12, 14, 16, 19, 21, 24, 26, 28, 31, 33, 36];
var root = 48;

Tone.Transport.loop = true;
Tone.Transport.setLoopStart('0:0');
Tone.Transport.setLoopEnd('2:0');
Tone.Transport.setBpm(98);
Tone.Transport.start();
Tone.Transport.setInterval(triggerBass, '32n');
Tone.Transport.setInterval(triggerArp, '16n');

var step = 0;

var prevTriangles;

var arpStep = 0;
var arp = new Tone.FMSynth();
var pingPong = new Tone.PingPongDelay('8n');
pingPong.setFeedback(0.7);
arp.connect(pingPong);
pingPong.toMaster();

function triggerArp(time) {
  var n = midiToFreq( root + scale [arpStep] );
  arp.triggerAttack(n, time, data.triangleAlpha);
  arp.triggerRelease(n, time + arp.toSeconds('16n') );
  arpStep++;
  if (arpStep >= data.triangleNumber) {
    arpStep = 0;
  }
}

var bass = new Tone.MonoSynth();
bass.setPreset('Bassy');
bass.toMaster();
bass.setVolume(-16);
bass.filterEnvelope.setMax(1000);
bass.filter.Q.setValue(7);
// bass.filter.setRolloff(-24);
var bassIsOn = false;

function triggerBass(time) {
  if (data.triangleAlpha > 0.2) {
    var pitchPos = Math.floor(map(data.avgY, 0, height, scale.length, 0));
    var midiPitch = root - 48 + scale[pitchPos];
    var freq = midiToFreq(midiPitch);
    bass.frequency.exponentialRampToValueNow(freq, '64n');
    if (!bassIsOn) {
      bass.triggerEnvelopeAttack(time);
      bassIsOn = true;
    }
  }
  else {
    bass.triggerRelease(time);
    bassIsOn = false;
  }
}


midiToFreq = function (m) {
  return 440 * Math.pow(2, (m - 69) / 12.0);
};

function map(para, orMin, orMax, tarMin, tarMax) {
  var ratio = (para - orMin) / (orMax - orMin);
  var tarValue = ratio * (tarMax - tarMin) + tarMin;
  return tarValue;
}

function freezeCallback() {
  // update number of steps in the arp
  // arp from previous freeze
}