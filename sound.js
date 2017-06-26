// export sound function
function makeSound(audioCtx) {

  function Sound(frequency, type) {
      this.osc = audioCtx.createOscillator(); // Create oscillator node
      this.filter = audioCtx.destination;

      this.revNode = audioCtx.createConvolver();

      this.pressed = false; // flag to indicate if sound is playing
      this.startTime = 0;
      this.endTime = 2;

      /* Set default configuration for sound */
      if(typeof frequency !== 'undefined') {
          /* Set frequency. If it's not set, the default is used (440Hz) */
          this.osc.frequency.value = frequency;
      }

      this.amp = audioCtx.createGain()
      this.amp.gain.value = 1.0;
      this.gainSetting = 1.0
    //  this.amp.connect(this.filter)
      this.envelope = audioCtx.createGain()

      this.envelope.gain.value = 1;

      this.osc.connect(this.amp)
      /* Set waveform type. Default is actually 'sine' but triangle sounds better :) */
      this.osc.type = type || 'triangle';

      /* Start playing the sound. You won't hear it yet as the oscillator node needs to be
      piped to output (AKA your speakers). */

      this.lfo;

      this.startTime = 0;
      this.endTime = 2;

      this.osc.start(0);

    };




  Sound.prototype.setGain = function(gainval) {
    this.amp.gain.value = gainval;
    this.gainSetting = gainval;

  }

  Sound.prototype.setFilter = function(type, freqVal) {
    // make and set the this.filter here to something more interesting
    var filly = audioCtx.createBiquadFilter();
    filly.connect(audioCtx.destination)
    filly.type = "highpass";
    filly.frequency.value = 20;
    this.filter = filly;

  }

Sound.prototype.setEnvelope = function(startTime, endTime) {

  this.envelope.connect(this.filter)
  this.envelope.gain.value = 0

  //        var AudioParam = AudioParam.setTargetAtTime(target, startTime, timeConstant)
  this.envelope.gain.setTargetAtTime(1, this.startTime, 0.1)

  this.envelope.gain.setTargetAtTime(0, this.endTime + 4, 0.2)

}

Sound.prototype.setVibrater = function(vibGain) {

  this.vibrato = audioCtx.createGain();
  vibrato.gain.value = vibGain;
  vibrato.connect(this.osc.detune);

  var lfo = audioCtx.createOscillator();
  lfo.connect(vibrato);
  lfo.frequency.value = 14;

  lfo.start(this.startTime);
  lfo.stop(this.endTime + 4);

}



Sound.prototype.play = function() {
    if(!this.pressed) {

      this.amp.gain.value = this.gainSetting;


        this.pressed = true;

          this.startTime = audioCtx.currentTime
          this.endTime = this.startTime + 2;

        if( document.querySelector('input[value="vibrato"]').checked ){

            this.setEnvelope();

            var vibrato = audioCtx.createGain();
            vibrato.gain.value = 400;
            vibrato.connect(this.osc.detune);
            this.lfo = audioCtx.createOscillator();

            this.lfo.connect(vibrato);
            this.lfo.frequency.value = 14;

            this.lfo.start(this.startTime);
            this.lfo.stop(this.endTime + 2);

            this.amp.connect(this.envelope);

          }
          else{

            this.amp.connect(this.filter);

          }

      }
  };



  Sound.prototype.stop = function() {
      this.pressed = false;
    //  this.osc.stop(2)
  //  this.amp.disconnect();
    let discon = () => this.amp.disconnect();
    //this.osc.gain.value = 1;

    this.amp.gain.setTargetAtTime(0, audioCtx.currentTime , .3)

//discon()
  //  var discon = this.amp.disconnect;
      setTimeout(function() {
      //  console.log('want to make it disconnect')
      discon();
      //  this.amp.disconnect();
    }, (1000 ) );
    //  this.amp.disconnect();
  };

  return Sound;
}

module.exports = makeSound;
