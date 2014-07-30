var myCanvas = document.getElementById("myCanvas");
var width = myCanvas.width;
var height = myCanvas.height;
var maxDistance = Math.sqrt(Math.pow(width, 2) + Math.pow(height, 2));

var scale = [0, 2, 4, 7, 9, 12, 14, 16, 19, 21, 24];
var root = 48;
var lopassFreq = 0; // freq of the lowpass ramp;

Tone.Transport.loop = true;
Tone.Transport.setLoopStart('0:0');
Tone.Transport.setLoopEnd('2:0');
Tone.Transport.setBpm(98);
Tone.Transport.start();
Tone.Transport.setInterval(onStep, '64n');
Tone.Transport.setInterval(sStep, '16n');
// Tone.Transport.setInterval(kickDrum, '0:0:2');
// Tone.Transport.setInterval(snareDrum, '0:1:0');
// Tone.Transport.setInterval(agogoHigh, '1:0:0');
// Tone.Transport.setInterval(agogoLow, '0:2:0');
// Tone.Transport.setTimeline(kickDrum, '0:3:3');

var step = 0;

function onStep() {
  if (typeof (detectPoints.points) !== 'undefined') {
    if (detectPoints.points.length > 2) {
      playLead(detectPoints.points);
    } else {
      synth.triggerRelease();
    }
  }
}

var kick = new Tone.Player('sounds/505/kick.mp3', playerLoaded);
var snare = new Tone.Player('sounds/505/snare.mp3', playerLoaded);
var agogoHigh = new Tone.Player('sounds/505/agogoHigh.mp3', playerLoaded);
var agogoLow = new Tone.Player('sounds/505/agogoLow.mp3', playerLoaded);

// kick.pattern = [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0];
// snare.pattern = [0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, ];
agogoHigh.pattern = [0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1];
agogoLow.pattern = [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0];
kick.pattern = [1, 0, 0, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 0, 0];
snare.pattern = [0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, ];

var drums = [kick, snare, agogoHigh, agogoLow]

function sStep() {
  for (var i = 0; i < drums.length; i++) {
    if (drums[i].pattern[step] == 1) {
      drums[i].start();
    }
  }
  step++;
  if (step >= 16) {
    step = 0;
  }
}

//player onload callback
function playerLoaded(player) {
  //able to be retriggered before the file is done playing
  player.retrigger = true;
  player.toMaster();
}

function kickDrum() {
  kick.start();
}

function snareDrum() {
  snare.start();
}

function agogoHigh() {
  agogoHigh.start();
}

function agogoLow() {
  agogoLow.start();
}

function playLead(thePts) {
  // change the filter based on maxDistance

  lopassFreq = map(data.totalDist, 0, maxDistance, 0, 1200);

  //  synth.lowpass.frequency.exponentialRampToValueAtTime(lopassFreq, Tone.Master.now() );

  synth.setPitch(thePts.length);
  synth.triggerAttack();
}

var Synth = function () {
  this.freq = 440;
  this.osc0 = new Tone.Oscillator(440, 'sine');
  this.osc1 = new Tone.Oscillator(880, 'square');
  //sync the two frequencies
  this.osc1.frequency.sync(this.osc0.frequency);

  //create the envelopes
  this.ampEnvelope = new Tone.Envelope(0.01, 0.1, 0.5, 0.5, 0, 0.2);
  this.freqEnvelope = new Tone.Envelope(0.01, 0, .8, 0.1, 0, lopassFreq);

  //the filter
  this.lowpass = Tone.context.createBiquadFilter();
  this.lowpass.type = "lowpass";
  this.lowpass.Q.value = 40;

  //the amplitude
  this.amplitude = Tone.context.createGain();
  //connect to the amplitudes and the filters
  this.osc0.connect(this.amplitude);
  this.osc1.connect(this.amplitude);
  this.osc0.connect(this.lowpass);
  this.osc1.connect(this.lowpass);

  //connect the envelopes
  this.ampEnvelope.connect(this.amplitude.gain);
  this.freqEnvelope.connect(this.lowpass.frequency);

  this.output = Tone.context.createGain();
  this.output.gain.value = .2;
  this.amplitude.connect(this.output);
  //connect it to the output
  this.output.toMaster();
  this.lowpass.toMaster();

  //start the oscillators
  this.osc0.start();
  this.osc1.start();
}

Synth.prototype.triggerAttack = function () {
  this.ampEnvelope.triggerAttack();
  this.freqEnvelope.triggerAttack();
  this.isPlaying = true;
}

Synth.prototype.triggerRelease = function () {
  this.ampEnvelope.triggerRelease();
  this.freqEnvelope.triggerRelease();
  this.isPlaying = false;
}

Synth.prototype.setPitch = function (p) {
  var pitchPos = Math.floor(map(data.avgY, 0, height, scale.length, 0));
  var midiPitch = root + scale[pitchPos];
  var freq = midiToFreq(midiPitch);
  this.osc0.frequency.exponentialRampToValueNow(freq, 0.1);
}

synth = new Synth();

midiToFreq = function (m) {
  return 440 * Math.pow(2, (m - 69) / 12.0);
};

FMSynth = function () {
  this.signal = new Tone.Signal;
  this.add1 = new Tone.Add
  this.osc1 = new Tone.Oscillator(440, 'sine');

  this.signal.connect(add1);
  this.add1.connect(this.osc1.frequency);
}

FMSynth.prototype.setPitch = function (p) {
  this.signal.exponentialRampToValueNow(freq, 0.1);
};

function map(para, orMin, orMax, tarMin, tarMax) {
  var ratio = (para - orMin) / (orMax - orMin);
  var tarValue = ratio * (tarMax - tarMin) + tarMin;
  return tarValue;
}