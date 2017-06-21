// export sound function
function makeSound(audioCtx) {

  function Sound(frequency, type) {
      this.osc = audioCtx.createOscillator(); // Create oscillator node
      this.filter = audioCtx.destination;

      this.revNode = audioCtx.createConvolver();

      this.pressed = false; // flag to indicate if sound is playing

      /* Set default configuration for sound */
      if(typeof frequency !== 'undefined') {
          /* Set frequency. If it's not set, the default is used (440Hz) */
          this.osc.frequency.value = frequency;
      }

      this.amp = audioCtx.createGain()
      this.amp.gain.value = 1.0;
    //  this.amp.connect(this.filter)
      this.envelope = audioCtx.createGain()
      this.osc.connect(this.amp)
      /* Set waveform type. Default is actually 'sine' but triangle sounds better :) */
      this.osc.type = type || 'triangle';

      /* Start playing the sound. You won't hear it yet as the oscillator node needs to be
      piped to output (AKA your speakers). */
      this.osc.start(0);
    };




  Sound.prototype.setGain = function(gainval) {
    this.amp.gain.value = gainval;
  }

  Sound.prototype.setFilter = function(type, freqVal) {
    // make and set the this.filter here to something more interesting
    var filly = audioCtx.createBiquadFilter();
    filly.connect(audioCtx.destination)
    filly.type = "highpass";
    filly.frequency.value = 2000;
    this.filter = filly;

  }




  Sound.prototype.play = function() {
      if(!this.pressed) {
          this.pressed = true;
            var startTime = audioCtx.currentTime
            var endTime = startTime + 8;


            this.envelope.connect(this.filter)
            this.envelope.gain.value = 0

            // setTargetAtTime arguments are
    //        var AudioParam = AudioParam.setTargetAtTime(target, startTime, timeConstant)
            this.envelope.gain.setTargetAtTime(1, startTime, 0.1)
            this.envelope.gain.setTargetAtTime(0, endTime, 0.5)

          //  this.osc.connect(this.envelope)
            var vibrato = audioCtx.createGain();
            vibrato.gain.value = 400;
            vibrato.connect(this.osc.detune);

            var lfo = audioCtx.createOscillator();
            lfo.connect(vibrato);
            lfo.frequency.value = 1;

            lfo.start(startTime);
            lfo.stop(endTime);

            this.amp.connect(this.envelope);

      }
  };

  Sound.prototype.stop = function() {

      this.pressed = false;
      this.envelope.disconnect();

  };

  return Sound;
}

  module.exports = makeSound;
