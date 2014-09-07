var myCanvas = document.getElementById("myCanvas");
var width = myCanvas.width;
var height = myCanvas.height;
var maxDistance = Math.sqrt(Math.pow(width, 2) + Math.pow(height, 2));

var scale = [0, 2, 4, 7, 9, 12, 14, 16, 19, 21, 24, 26, 28, 31, 33, 36];
var pentatonic = [0, 2, 4, 7, 9, 12, 14, 16, 19, 21, 24, 26, 28, 31, 33, 36];
var major = [0, 4, 7, 12, 16, 19, 24, 28, 31];
var minor = [0, 3, 7, 12, 15, 19, 24, 27, 31];
var sus = [0, 5, 7, 12, 17, 19, 24, 29, 31];
var minSev = [0, 3, 7, 10, 12, 15, 19, 22];
var direction = 0;

function setScale(emotion) {
  direction = Math.floor(Math.random() * 2);
  switch(emotion) {
    case 'happy':
      Tone.Transport.setBpm(100);
      root = 48;
      scale = pentatonic;
      break;
    case 'sad':
      Tone.Transport.setBpm(50);
      root = 45;
      scale = sus;
      break;
    case 'surprised':
      Tone.Transport.setBpm(150);
      root = 52;
      scale = sus;
      break;
    case 'angry':
      Tone.Transport.setBpm(66.69);
      root = 46;
      scale = minSev;
      break;
  }
}

var root = 48;

Tone.Transport.loop = true;
Tone.Transport.setLoopStart('0:0');
Tone.Transport.setLoopEnd('2:0');
Tone.Transport.setBpm(100);
Tone.Transport.start();
Tone.Transport.setInterval(triggerBass, '32n');
Tone.Transport.setInterval(triggerArp, '16n');

Tone.Transport.setInterval(kick, 1 * Tone.Transport.toSeconds('1n'));
var kick = new Tone.Player('sounds/505/kick.mp3', playerLoaded);
var kickPong = new Tone.PingPongDelay('16n');
kickPong.setFeedback(0.8);
var kickFilter = new Tone.Filter();
kickPong.connect(kickFilter);
kickFilter.toMaster();

function kick() {
  kick.start();
}

function playerLoaded(player) {
  //able to be retriggered before the file is done playing
  player.retrigger = true;
  player.connect(kickPong);
}

var step = 0;

var prevTriangles;

var arpStep = 0;
var arp = new Tone.FMSynth();
var pingPong = new Tone.PingPongDelay('8n');
pingPong.setFeedback(0.5);
arp.connect(pingPong);
arpFilter = new Tone.Filter();
pingPong.connect(arpFilter);
arpFilter.toMaster();
arpFilter.frequency.setValue(1500);

function triggerArp(time) {
  var n = midiToFreq( root + scale [arpStep % scale.length] );
  arp.triggerAttack(n, time, data.triangleAlpha);
  arp.triggerRelease(n, time + arp.toSeconds('16n') );

  switch(direction) {
    case 0:
      arpStep++;
      break;
    case 1:
      arpStep--;
      break;
    // case 2:
    //   arpStep = Math.floor(Math.random() * scale.length);
    //   break;
  }
  if (arpStep >= data.triangleNumber) {
    arpStep = 0;
  } else if (arpStep < 0) {
    arpStep = data.triangleNumber;
  }
}

var bass = new Tone.MonoSynth();
bass.setPreset('Bassy');
bass.toMaster();
bass.setVolume(-16);
bass.filterEnvelope.setMax(700);
bass.filter.Q.setValue(7);
bass.envelope.release = 3;
var bassIsOn = false;

function triggerBass(time) {
  if (data.triangleAlpha > 0.5) {
    var bassQ = map(data.avgX, 0, height, 1, 8);
    bass.filterEnvelope.setMax(bassQ * 150);
    bass.filter.Q.setValue(bassQ);
    var pitchPos = Math.floor(map(data.avgY, 0, height, scale.length, 0));
    var midiPitch = root - 36 + scale[pitchPos];
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