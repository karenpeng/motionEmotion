var myCanvas = document.getElementById("myCanvas");
var width = myCanvas.width;
var height = myCanvas.height;
var maxDistance = Math.sqrt(Math.pow(width, 2) + Math.pow(height, 2));
var prevTriangles;

var root = 48;
var scale = [0, 2, 4, 7, 9, 12, 14, 16, 19, 21, 24, 26, 28, 31, 33, 36];
var pentatonic = [0, 2, 4, 7, 9, 12, 14, 16, 19, 21, 24, 26, 28, 31, 33, 36];
var major = [0, 4, 7, 12, 16, 19, 24, 28, 31];
var minor = [0, 3, 7, 12, 15, 19, 24, 27, 31];
var harMinor = [0, 2, 3, 5, 7, 8, 11, 12, 14, 15, 17, 19, 20, 23, 24];
var sus = [0, 5, 7, 12, 17, 19, 24, 29, 31];
var minSev = [0, 3, 7, 10, 12, 15, 19, 22];
var octaves = [-24, -12, 0, 12, 24, 36, 48];

var direction = 0;

/*
  Set these to false initially if you want to wait for an emotion
  before playing sound.
 */
var arpActive = true;
var bassActive = true;

/*
  Play a sound when we have a new emotion
 */
function setNewEmo(emotion) {
  if (emotion !== null) {
    arpActive = true;
    bassActive = true;
  }
  direction = Math.floor(Math.random() * 2);
  //console.log(emotion);
  switch (emotion) {
  case 'happy':
    disposeNoise();
    emoSound = agogoLow;
    Tone.Transport.setBpm(100);
    bass.setPreset('Pizz');
    root = 48;
    scale = pentatonic;
    bass.filterEnvelope.setMax(700);
    bass.filter.Q.setValue(7);
    break;
  case 'sad':
    disposeNoise();
    emoSound = kick;
    bass.setPreset('Bassy');
    Tone.Transport.setBpm(50);
    bass.filterEnvelope.setMax(700);
    bass.filter.Q.setValue(7);
    root = 45;
    scale = sus;
    break;
  case 'surprised':
    disposeNoise();
    emoSound = agogoHigh;
    bass.setPreset('BrassCircuit');
    Tone.Transport.setBpm(150);
    bass.filterEnvelope.setMax(700);
    bass.filter.Q.setValue(7);
    root = 52;
    scale = minSev;
    break;
  case 'angry':
    makeNoise();
    emoSound = hh;
    bass.setPreset('Barky');
    Tone.Transport.setBpm(66.69);
    bass.envelope.sustain = 0.5;
    bass.filterEnvelope.setMax(2000);
    bass.filter.Q.setValue(100);
    root = 46;
    scale = octaves;
    break;
  }
  Tone.Transport.setTimeout(function (time) {
    playNewEmoSound(time);
  }, '16n');
}

var kick = new Tone.Player('sounds/505/snare.mp3', playerLoaded);
var agogoHigh = new Tone.Player('sounds/505/agogoHigh.mp3', playerLoaded);
var agogoLow = new Tone.Player('sounds/505/agogoLow.mp3', playerLoaded);
var hh = new Tone.Player('sounds/505/hh.mp3', playerLoaded);
var kickFilter = new Tone.Filter();
kickFilter.frequency.setValue(1000);
var kickPong = new Tone.PingPongDelay('8t');
var kickPongTwo = new Tone.PingPongDelay('16n');
kickPongTwo.setFeedback(0.8);
kick.fan(kick.output, kickPongTwo, kickFilter);
agogoHigh.fan(agogoHigh.output, kickPongTwo, kickFilter);
agogoLow.fan(agogoLow.output, kickPongTwo, kickFilter);
hh.fan(hh.output, kickPongTwo, kickFilter);
kickFilter.connect(kickPongTwo);
var b = Tone.context.createGain();
kickPongTwo.connect(kickPong);
kickPong.connect(b);
b.gain.value = 0.2;
b.toMaster();

function playerLoaded(player) {
  //able to be retriggered before the file is done playing
  player.retrigger = true;
  player.connect(kickPong);
}

var emoSound = kick;

function playNewEmoSound(time) {
  emoSound.start(time);
}

Tone.Transport.loop = true;
Tone.Transport.setLoopStart('0:0');
Tone.Transport.setLoopEnd('2:0');
Tone.Transport.setBpm(100);
Tone.Transport.start();
Tone.Transport.setInterval(triggerBass, '32n');
Tone.Transport.setInterval(triggerArp, '16n');

var step = 0;

var arpStep = 0;
var arp = new Tone.FMSynth();
var pingPong = new Tone.PingPongDelay('8n');
pingPong.setFeedback(0.8);
arp.connect(pingPong);
arpFilter = new Tone.Filter();
pingPong.connect(arpFilter);
arpFilter.toMaster();
arpFilter.frequency.setValue(1500);

function triggerArp(time) {
  if (arpActive) {
    var n = midiToFreq(root + scale[arpStep % scale.length]);
    arp.triggerAttack(n, time, data.triangleAlpha);
    arp.triggerRelease(n, time + arp.toSeconds('16n'));

    switch (direction) {
    case 0:
      arpStep++;
      break;
    case 1:
      arpStep--;
      break;
    }
    if (arpStep >= data.triangleNumber) {
      arpStep = 0;
    } else if (arpStep < 0) {
      arpStep = data.triangleNumber;
    }

    lightUpTriangle(arpStep, arp.toSeconds('16n'));
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

// Noise
var noise = new Tone.Noise();
noise.connect(bass.filter);
noise.setVolume(-100);
noise.start();

var qOffset = 0;

function makeNoise() {
  noise.output.gain.exponentialRampToValueAtTime(5, noise.now());
  qOffset = 4;
  bass.envelope.attack = 0.5;
  bass.envelope.sustain = 0.1;
}

function disposeNoise() {
  bass.envelope.attack = 0.01;
  bass.envelope.sustain = 0.9;
  qOffset = 0;
  bass.filter.setType('lowpass');
  noise.output.gain.exponentialRampToValueAtTime(0.0001, noise.now())
}

function triggerBass(time) {
  if (bassActive) {
    var offset = -24;
    var bassQ = map(data.totalDist, 0, maxDistance, 5, 8) + qOffset;
    if (data.avgX < width / 3) {
      offset = 24;
      bass.filterEnvelope.setMax(2000);
      bass.filter.Q.setValue(bassQ - 4);
    } else {
      bass.filterEnvelope.setMax(data.totalDist + 200);
      bass.filter.Q.setValue(bassQ);
    }
    if (qOffset > 1) {
      bass.filterEnvelope.setMax((height - data.maxY) * 10);
      bass.filter.Q.setValue(bassQ - 4);
    }
    if (data.triangleAlpha > 0.5) {
      var pitchPos = Math.floor(map(data.avgY, 0, height, scale.length, 0));
      var midiPitch = root + offset + scale[pitchPos];
      var freq = midiToFreq(midiPitch);
      bass.frequency.exponentialRampToValueNow(freq, '64n');
      if (!bassIsOn) {
        bass.triggerEnvelopeAttack(time);
        bassIsOn = true;
      }
    } else {
      bass.triggerRelease(time);
      bassIsOn = false;
    }
  }
}

midiToFreq = function (m) {
  return 440 * Math.pow(2, (m - 69) / 12.0);
};