// export sound function
function makeSound(audioCtx) {

  function Sound(frequency, type) {

      this.osc; //= audioCtx.createOscillator(); // Create oscillator node
      this.filter = audioCtx.destination;
      this.revNode = audioCtx.createConvolver();
      this.pressed = false; // flag to indicate if sound is playing
      this.startTime = 0;
      this.endTime = 2;
      this.freq = 440;
      this.release = document.querySelector("#releaseControl").value;

      console.log('relasein , ', this.release)
  //    console.log('attackin , ', document.querySelector("#attackControl").value)
      this.attack = document.querySelector("#attackControl").value;

      /* Set default configuration for sound */
      if(typeof frequency !== 'undefined') {
          /* Set frequency. If it's not set, the default is used (440Hz) */
    //      this.osc.frequency.value = frequency;
          this.freq = frequency;
      }

      this.amp = audioCtx.createGain()
      this.amp.gain.value = 1.0;
      this.gainSetting = 1.0
    //  this.amp.connect(this.filter)
      this.envelope = audioCtx.createGain()

      this.envelope.gain.value = 0;

      this.waver = type || 'triangle';
    //  this.osc.connect(this.amp)
      /* Set waveform type. Default is actually 'sine' but triangle sounds better :) */

      /* Start playing the sound. You won't hear it yet as the oscillator node needs to be
      piped to output (AKA your speakers). */

      this.lfo;

      this.startTime = 0;
      this.endTime = 2;
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
    filly.frequency.value = 10;
    this.filter = filly;

  }

Sound.prototype.setEnvelope = function(startTime, endTime) {
  this.envelope.connect(this.filter)
  this.envelope.gain.value = 0

  //        var AudioParam = AudioParam.setTargetAtTime(target, startTime, timeConstant)
  this.envelope.gain.setTargetAtTime(1, audioCtx.currentTime, this.attack)
//  this.envelope.gain.setTargetAtTime(0, this.endTime + 4, 0.2)

}

Sound.prototype.setVibrater = function(vibGain) {

  this.vibrato = audioCtx.createGain();
  vibrato.gain.value = vibGain;
  vibrato.connect(this.osc.detune);

  var lfo = audioCtx.createOscillator();
  lfo.connect(vibrato);
  lfo.frequency.value = this.freq * 10;

  lfo.start(this.startTime);
  lfo.stop(this.endTime + 2);

}


Sound.prototype.play = function() {
  // Create oscillator node on each play because the other way is hard to do envelopes with
    if(!this.pressed) {

      this.osc = audioCtx.createOscillator();

      this.amp.disconnect();

      this.osc.frequency.value = this.freq;
      this.osc.type = this.waver;

      this.osc.start()

      this.amp.gain.cancelScheduledValues(0);
      this.amp.gain.value = this.gainSetting;

      this.pressed = true;

      this.startTime = audioCtx.currentTime
      this.endTime = this.startTime + 2;


      this.osc.connect(this.amp)

        if( document.querySelector('input[value="envelope"]').checked ) {
          this.setEnvelope();

          if( document.querySelector('input[value="vibrato"]').checked ){
              var vibrato = audioCtx.createGain();
              vibrato.gain.value = 50;
              vibrato.connect(this.osc.detune);
              this.lfo = audioCtx.createOscillator();

              this.lfo.connect(vibrato);
              this.lfo.frequency.value = 14;

              this.lfo.start(this.startTime);
              this.lfo.stop(this.endTime + 2);

              this.amp.connect(this.envelope);

            }
            else{
              console.log('simplesplay with envelope but no vibrato')
              this.amp.connect(this.envelope);
            }

        }
        else {
          if( document.querySelector('input[value="vibrato"]').checked ){
              var vibrato = audioCtx.createGain();
              vibrato.gain.value = 400;
              vibrato.connect(this.osc.detune);
              this.lfo = audioCtx.createOscillator();

              this.lfo.connect(vibrato);
              this.lfo.frequency.value = 14;

              this.lfo.start(this.startTime);
              this.lfo.stop(this.endTime + 2);

              this.amp.connect(this.filter);
            }
          else{
            console.log('simplesplay')
            this.amp.connect(this.filter);
          }
        }
      }
  };


  Sound.prototype.stop = function() {
    this.pressed = false;

  //  let discon = () => this.amp.disconnect(audioCtx.currentTime+3);
  //this.osc.gain.value = 1;
    if( document.querySelector('input[value="envelope"]').checked ) {
      this.envelope.gain.cancelScheduledValues(0);
      this.amp.gain.cancelScheduledValues(0);
// this will make it immediately stop  this.amp.gain.value = 0;
  //  this.amp.gain.setTargetAtTime(0, audioCtx.currentTime , .3)
      this.envelope.gain.setTargetAtTime(0, audioCtx.currentTime, this.release)

      this.osc.stop( audioCtx.currentTime + 10 * this.release )

      let thisosc = this.osc;
      // disconnect the oscillator after 5 seconds

    }
    else {
        this.osc.stop( audioCtx.currentTime);
    }

    window.setTimeout(()=>{
      console.log('disconnecting oscillator')
      this.osc.disconnect();
    }, 5000)
  };
  return Sound;
}

module.exports = makeSound;
