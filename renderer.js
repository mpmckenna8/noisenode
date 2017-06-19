var d3 = require('d3');
var Keycode = require('keycode');

var makeSound = require('./sound.js');

var keyBoarder = require('./helpers/keyboarder.js')
var playNote = require('./helpers/playnote.js')

var endNote = require('./helpers/stopnote.js')
let constantNode = null;


console.log('need to make noise happen');
var audioCtx = new (window.AudioContext || window.webkitAudioContext)(); //new (AudioContext || webkitAudioContext)();

var Sound = makeSound(audioCtx);
var keysound = require('./keysound.js')


//constantNode = audioCtx.createConstantSource();


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

var onNote = "G#4";
var stepsInOctave = 12;

svg.attr('height', height).attr('width', width);
   // Table of notes with correspending keyboard codes. Frequencies are in hertz.
    // The notes start from middle C

// right now only using qwerty, but want to allow mapping from web midi devices too!
var keymaps = qwertykeymapper(onNote);
console.log('keymaps', keymaps)

buildKeyboard();

function buildKeyboard() {
      keyBoarder.addKeyboard(margin, height, width, keyboardHeight)
      keyBoarder.refreshKeys(keymaps, keyboardWidth, keyboardHeight, keyBoardInputMode,audioCtx);
//        addKeys(keymaps);
}


var controlKeys = {
  "shiftDownStep": ",",
  "shiftUpStep": "."
}



var detectKey = function(event) {
  var keyCode = event.keyCode || event.target.getAttribute('data-key');

  var keyobj = keymaps.find(function(d){
    return d.keyMap === keyCode
  })

    // if it's a playable note play it
   if(typeof keyobj !== 'undefined') {
     playNote(keyCode, keyobj)
   }

   // if it's a , then step down
  else if( keyCode === Keycode(controlKeys.shiftDownStep)){
    var onIndex = noteObj.findIndex(function(ele) {
      return ele.name === onNote;
    })
    onNote = noteObj[ onIndex  -  1 ].name
    keymaps = qwertykeymapper(onNote);
    keyBoarder.refreshKeys(keymaps, keyboardWidth, keyboardHeight, keyBoardInputMode,audioCtx);

  //  addKeys();
//    console.log('need to step around ', noteObj)
  }
  // it it's a . then step up and redo the keyboard
  else if ( keyCode == Keycode(controlKeys.shiftUpStep) ) {
    console.log('move up step')
    var onIndex = noteObj.findIndex(function(ele) {
      return ele.name === onNote;
    })

    onNote = noteObj[ onIndex  +  1 ].name;
  //  console.log('onnote, ', onNote)
    keymaps = qwertykeymapper(onNote);
  //  console.log(keymaps);
  keyBoarder.refreshKeys(keymaps, keyboardWidth, keyboardHeight, keyBoardInputMode,audioCtx);

//    addKeys(keymaps);
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
window.addEventListener('keyup', function(event) {
  var keyCode = event.keyCode || event.target.getAttribute('data-key');
  var keyobj = keymaps.find(function(d){
    return d.keyMap === keyCode
  })
  //console.log('turn off', keyobj)
  endNote(keyCode, keyobj);
});
