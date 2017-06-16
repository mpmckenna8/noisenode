var d3 = require('d3');


console.log('need to make noise happen');
var audioCtx = new (AudioContext || webkitAudioContext)();

var makeSound = require('./sound.js');
var Sound = makeSound(audioCtx);

var svg = d3.select('#keySVG')

var width = 520;
var height = 520;

var margin = 20;

var keyboardHeight = 80;

var keyboardWidth  = width-margin*2;

svg.attr('height', height).attr('width', width)
   // .attr('fill', 'orange')

   // Table of notes with correspending keyboard codes. Frequencies are in hertz.
    // The notes start from middle C
    var notesByKeyCode = {
        65: { noteName: 'c4', frequency: 261.6, keyName: 'a' },
        83: { noteName: 'd4', frequency: 293.7, keyName: 's' },
        68: { noteName: 'e4', frequency: 329.6, keyName: 'd' },
        70: { noteName: 'f4', frequency: 349.2, keyName: 'f' },
        71: { noteName: 'g4', frequency: 392, keyName: 'g' },
        72: { noteName: 'a5', frequency: 440, keyName: 'h' },
        74: { noteName: 'b5', frequency: 493.9, keyName: 'j' },
        75: { noteName: 'c5', frequency: 523.3, keyName: 'k' },
        76: { noteName: 'd5', frequency: 587.3, keyName: 'l' },
        186: { noteName: 'e5', frequency: 659.3, keyName: ';' }
    };


buildKeyboard();

function buildKeyboard() {

    svg.append('g')
        .attr('transform', function(){
            return "translate(" + margin + "," + (height/2-keyboardHeight/2) +
            ")"
        })
        .attr('id', 'keyboardG')
        .append('rect').attr('height', keyboardHeight)
        .attr('width', width-margin*2)


        addKeys(notesByKeyCode);


}




function addKeys(notes){
    d3.selectAll('.keys').remove();
    var noteKeys = Object.keys(notes);
    var keyboard = d3.select('#keyboardG')
    var keybuff = 8;
    var keyWidth = keyboardWidth/noteKeys.length  - keybuff*3;

console.log(noteKeys)
  //  for( i in notes) {
    keyboard.selectAll('.keys')
        .data(noteKeys)
        .enter()
        .append('rect')
        .attr('height', keyboardHeight - keybuff * 4)
        .attr('width', keyWidth)
        .attr('fill', 'green')
        .attr('y', 10)
        .attr('x', function(d,i){
          return 10 + i * (keyWidth + keybuff) + i*keybuff
        })
			  .attr('class', "keys")
        .attr('id', function(d,i) {
          return 'key' + d;
        })
        .each(function(d,i){
          console.log(d)
          var note = notesByKeyCode[d];
          note.key = new Key(d, '', '', note.frequency)
        })

			 // .attr('id', );
    //}
}

function Key(keyCode, noteName, keyName, frequency) {
  //  var keyHTML = document.createElement('div');
    var keySound = new Sound(frequency, 'triangle');

    /* Cheap way to map key on touch screens */
  //  keyHTML.setAttribute('data-key', keyCode);

    /* Style the key */
  //  keyHTML.className = 'key';
  //  keyHTML.innerHTML = noteName + '<br><span>' + keyName + '</span>';

    return {
      //  html: keyHTML,
        sound: keySound
    };
}




var playNote = function(event) {
    // event.preventDefault();

     var keyCode = event.keyCode || event.target.getAttribute('data-key');

     if(typeof notesByKeyCode[keyCode] !== 'undefined') {
         // Pipe sound to output (AKA speakers)
         notesByKeyCode[keyCode].key.sound.play();

         // Highlight key playing
         d3.select('#key' + keyCode)
          .attr('fill', 'red')
    //     notesByKeyCode[keyCode].key.html.className = 'key playing';
     }
 };

 var endNote = function(event) {
     var keyCode = event.keyCode || event.target.getAttribute('data-key');

     if(typeof notesByKeyCode[keyCode] !== 'undefined') {
         // Kill connection to output
         notesByKeyCode[keyCode].key.sound.stop();

         // Remove key highlight
         d3.select('#key' + keyCode)
          .attr('fill', 'green')
        }
 };

 var waveFormSelector = document.getElementById('soundType');


 var setWaveform = function(event) {
         for(var keyCode in notesByKeyCode) {
             notesByKeyCode[keyCode].key.sound.osc.type = this.value;
         }

         // Unfocus selector so value is not accidentally updated again while playing keys
         this.blur();
     };

     // Check for changes in the waveform selector and update all oscillators with the selected type
waveFormSelector.addEventListener('change', setWaveform);

// listeners to play notes on key presses
window.addEventListener('keydown', playNote);
window.addEventListener('keyup', endNote);
