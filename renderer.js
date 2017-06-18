var d3 = require('d3');
var Keycode = require('keycode');

var makeSound = require('./sound.js');
var playNote = require('./helpers/playnote.js')

console.log('need to make noise happen');
var audioCtx = new (AudioContext || webkitAudioContext)();

var Sound = makeSound(audioCtx);
var keysound = require('./keysound.js')

var Key = keysound(Sound);
var noteObj = require('./loadscalefreqs.js');

var keyBoardInputMode = "qwerty";
var qwertykeymapper = require('./helpers/qwertys.js');

//var noters = noteObj();
var svg = d3.select('#keySVG')

var width = 520;
var height = 220;
var margin = 20;
var keyboardHeight = 80;
var keyboardWidth  = width-margin*2;

var onNote = "A4";
var stepsInOctave = 12;

svg.attr('height', height).attr('width', width)
   // Table of notes with correspending keyboard codes. Frequencies are in hertz.
    // The notes start from middle C
var keymaps = qwertykeymapper(onNote);

    console.log('keymaps', keymaps)


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

        addKeys(noteObj);

}


function addKeys(notes){

    d3.selectAll('.keys').remove();

    var noteKeys = Object.keys(notes);
    var keyboard = d3.select('#keyboardG')
    var keybuff = 8;
    var keyWidth = keyboardWidth/10  - keybuff*2;

    if(keyBoardInputMode === 'qwerty'){
      keyWidth = keyboardWidth/10  - keybuff*3
    }

    console.log('keymap', keymaps)
    var baseCo = 0;


    keyboard.selectAll('.keys')
      .data(keymaps)
      .enter()
      .append('rect')
      .attr('height', function(d) {
        if(!d.sharp){

        return keyboardHeight - keybuff * 4

      }
      else return keyboardHeight - keybuff * 5
      })
      .attr('width', keyWidth)
      .attr('fill', function(d, i){
        if(d.sharp) {
          return 'yellow'
        }
        return 'green'
      })
      .attr('y', function(d, i){
        if(d.sharp){
          return 0;
        }
        return 10;
      })
    .attr('x', function(d,i){
      var bump = 0;
      if(!d.sharp){
        baseCo = baseCo + 1;
      }
      else {
        bump = keyWidth/2 + 4
      }
        return -2 + bump + baseCo * (keyWidth + keybuff) + baseCo *keybuff;
    })
    .attr('class', "keys")
    .attr('id', function(d,i) {
      return 'key' + d.keyMap;
    })
    .attr('sharper', function(d){
      return d.sharp;
    })
    .each(function(d,i){
//      console.log(d)
      var note = d;
      keymaps[i].key = Key(d, '', '', d.frequency)
      // need to setFilter somewhere else with some solid arguments, especially like the time changing ones
      keymaps[i].key.sound.setFilter();
    })

}





 var endNote = function(event) {
     var keyCode = event.keyCode || event.target.getAttribute('data-key');
     var keyobj = keymaps.find(function(d){
       return d.keyMap === keyCode
     })

     if(typeof keyobj !== 'undefined') {
         // Kill connection to output
         keyobj.key.sound.stop();

         // Remove key highlight
         var keysel = d3.select('#key' + keyCode);
         var keyclass = keysel.attr('class');

          keysel.attr('fill', function(d){
            console.log('inkeyclass', d);
            if(d.sharp === true) {
               return 'yellow';
            }
            else{
              return 'green'
            }
          })

        }
 };


var controlKeys = {
  ",": "shiftDownStep",
  ",": "shiftUpStep"
}


var detectKey = function(event) {
  var keyCode = event.keyCode || event.target.getAttribute('data-key');

  var keyobj = keymaps.find(function(d){
    return d.keyMap === keyCode
  })

   if(typeof keyobj !== 'undefined') {
     playNote(keyCode, keyobj)
   }

  if( keyCode === Keycode(',') || keyCode == Keycode('.')){
    console.log('need to step around ', noteObj)
  }

}

 var waveFormSelector = document.getElementById('soundType');

 var setWaveform = function(event) {

         for(var keyCode of keymaps) {
             keyCode.key.sound.osc.type = this.value;
         }
         // Unfocus selector so value is not accidentally updated again while playing keys
         this.blur();
    };


     // Check for changes in the waveform selector and update all oscillators with the selected type
waveFormSelector.addEventListener('change', setWaveform);

// listeners to play notes on key presses
window.addEventListener('keydown', detectKey);
window.addEventListener('keyup', endNote);
