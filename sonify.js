var scale = [0, 2, 4, 7, 9];
var root = 60;

Tone.Transport.loop = true;
Tone.Transport.setLoopStart('0:0');
Tone.Transport.setLoopEnd('2:0');
Tone.Transport.setBpm(155);
Tone.Transport.start();
Tone.Transport.setInterval(onStep, '32n');
Tone.Transport.setInterval(kickDrum, '0:0:2');
Tone.Transport.setInterval(snareDrum, '0:1:0');
Tone.Transport.setInterval(agogoHigh, '1:0:0');
Tone.Transport.setInterval(agogoLow, '0:2:0');
Tone.Transport.setTimeline(kickDrum, '0:3:3');

function onStep() {
  if (typeof(detectPoints.points) !== 'undefined'){
    if (detectPoints.points.length > 5) {
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


//player onload callback
function playerLoaded(player){
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

function agogoHigh(){
  agogoHigh.start();
}

function agogoLow() {
  agogoLow.start();
}

function playLead(thePts){
  synth.setPitch(thePts.length);
  synth.triggerAttack();
}


var Synth = function() {
  this.freq = 440;
  this.osc0 = new Tone.Oscillator(440, 'sine');
  this.osc1 = new Tone.Oscillator(880, 'square');
  //sync the two frequencies
  this.osc1.frequency.sync(this.osc0.frequency);

  //create the envelopes
  this.ampEnvelope = new Tone.Envelope(0.01, 0.1, 0.5, 0.5, 0, 0.3);
  this.freqEnvelope = new Tone.Envelope(0.4, 0, 1, 0.8, 0, 1200);

  //the filter
  this.lowpass = Tone.context.createBiquadFilter();
  this.lowpass.type = "lowpass";
  this.lowpass.Q.value = 12;

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

  //connect it to the output
  this.amplitude.toMaster();
  this.lowpass.toMaster();

  //start the oscillators
  this.osc0.start();
  this.osc1.start();
}

Synth.prototype.triggerAttack = function(){
  this.ampEnvelope.triggerAttack();
  this.freqEnvelope.triggerAttack();
  this.isPlaying = true;
}

Synth.prototype.triggerRelease = function(){
  this.ampEnvelope.triggerRelease();
  this.freqEnvelope.triggerRelease();
  this.isPlaying = false;
}

Synth.prototype.setPitch = function(p){
  var pitchPos = p % scale.length;
  var midiPitch = root + scale[pitchPos];
  var freq = midiToFreq(midiPitch);
  this.osc0.frequency.exponentialRampToValueNow(freq, 0.1);
}

synth = new Synth();

midiToFreq = function(m) {
    return 440 * Math.pow(2, (m-69)/12.0);
};