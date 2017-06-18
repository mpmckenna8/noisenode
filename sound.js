// export sound function
function makeSound(audioCtx) {

  function Sound(frequency, type) {
      this.osc = audioCtx.createOscillator(); // Create oscillator node
      this.filter = audioCtx.destination;
      this.pressed = false; // flag to indicate if sound is playing

      /* Set default configuration for sound */
      if(typeof frequency !== 'undefined') {
          /* Set frequency. If it's not set, the default is used (440Hz) */
          this.osc.frequency.value = frequency;
      }

      this.amp = audioCtx.createGain()
      this.amp.gain.value = .2;
    //  this.amp.connect(this.filter)

      this.osc.connect(this.amp)
      /* Set waveform type. Default is actually 'sine' but triangle sounds better :) */
      this.osc.type = type || 'triangle';

      /* Start playing the sound. You won't hear it yet as the oscillator node needs to be
      piped to output (AKA your speakers). */
      this.osc.start(0);
    };

  Sound.prototype.setFilter = function(type, freqVal) {
    // make and set the this.filter here to something more interesting
    var filly = audioCtx.createBiquadFilter();
    filly.connect(audioCtx.destination)
    filly.type = "highpass";
    filly.frequency.value = 100;
    this.filter = filly;
  }

  Sound.prototype.play = function() {
      if(!this.pressed) {
          this.pressed = true;
          this.amp.connect(this.filter);
      }
  };

  Sound.prototype.stop = function() {
      this.pressed = false;
      this.amp.disconnect();
  };
  return Sound;
}

  module.exports = makeSound;
