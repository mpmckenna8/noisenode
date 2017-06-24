var d3 = require('d3');
var Keycode = require('keycode');

var makeSound = require('./sound.js');

var keyBoarder = require('./helpers/keyboarder.js')
var playNote = require('./helpers/playnote.js')

var endNote = require('./helpers/stopnote.js')
let adjustGain = require('./helpers/adjustGain.js')

let volumeControl = document.querySelector("#volumeControl");


let context = null;
let constantNode = null;

context = new (window.AudioContext || window.webkitAudioContext)();

var activeNotes = {};	// the stack of actively-pressed keys


let midiAccess;


if (navigator.requestMIDIAccess)
  navigator.requestMIDIAccess().then( onMIDIInit, onMIDIReject );
else
  alert("No MIDI support present in your browser.  You're gonna have a bad time.")


function hookUpMIDIInput() {
  var haveAtLeastOneDevice=false;
    var inputs=midiAccess.inputs.values();

  //  for( q of inputs ) {
    //  console.log(q);
  //  }


  for ( var input = inputs.next(); input && !input.done; input = inputs.next()) {
      input.value.onmidimessage = MIDIMessageEventHandler;
      haveAtLeastOneDevice = true;
    }
    var badtime = document.getElementById("badtime");
    if (badtime)
      badtime.style.visibility = haveAtLeastOneDevice ?
        "hidden" : "visible";
}

function onMIDIInit(midi) {
  midiAccess = midi;
  hookUpMIDIInput();
  midiAccess.onstatechange=hookUpMIDIInput;
}

function onMIDIReject(err) {
  alert("The MIDI system failed to start.  You're gonna have a bad time.");
}

function MIDIMessageEventHandler(event) {

  console.log(event, event.data[2])
  // Mask off the lower nibble (MIDI channel, which we don't care about)
  switch ( event.data[0] & 0xf0 ) {
    case 0x90:
      if (event.data[2]!=0 ) {  // if velocity != 0, this is a note-on message
  //      noteOn(event.data[1]);
     console.log('it on note', event, event.data[1])

        return;
      }
      // if velocity == 0, fall thru: it's a note-off.  MIDI's weird, ya'll.
    case 0x80:
        console.log('it off ernan', event, event.data[0], 'note code = ', event.data[1])

//      noteOff(event.data[1]);
      return;
  }
}


function frequencyFromNoteNumber( note ) {
  return 440 * Math.pow(2,(note-69)/12);
}





// pretty bummed https://developer.mozilla.org/en-US/docs/Web/API/AudioContext/createConstantSource#Browser_compatibility
// createConstantSource() isn't working
//var constantSourceNode = AudioContext.createConstantSource()

console.log('need to make noise happen');
var audioCtx = new (AudioContext || webkitAudioContext)();

var Sound = makeSound(audioCtx);
var keysound = require('./keysound.js')


//constantNode = audioCtx.createConstantSource();


var Key = keysound(Sound);

var noteObj = require('./loadscalefreqs.js');



		function noteOn(noteNumber) {

      var playnote = {noteNumber: makeSound(frequencyFromNoteNumber(noteNumber), 'triangle')}
			activeNotes.push( playnote );
      console.log(activeNotes)

		//	oscillator.frequency.cancelScheduledValues(0);
		//	oscillator.frequency.setTargetAtTime( frequencyFromNoteNumber(noteNumber), 0, portamento );
	//		envelope.gain.cancelScheduledValues(0);
	//		envelope.gain.setTargetAtTime(1.0, 0, attack);
		}

function noteOff(noteNumber) {
  var position = activeNotes.indexOf(noteNumber);
  if (position!=-1) {
  //  activeNotes.splice(position,1);
  }
  if (activeNotes.length==0) {	// shut off the envelope
  //  envelope.gain.cancelScheduledValues(0);
  //  envelope.gain.setTargetAtTime(0.0, 0, release );
  } else {
  //  oscillator.frequency.cancelScheduledValues(0);
  //  oscillator.frequency.setTargetAtTime( frequencyFromNoteNumber(activeNotes[activeNotes.length-1]), 0, portamento );
  }
}

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


  var playnote = {}
  playnote = { origfreq: frequencyFromNoteNumber(keyCode), key:  Key(keyCode, '', '', frequencyFromNoteNumber(keyCode)) }


  activeNotes[keyCode] =  playnote ;

  console.log(activeNotes)

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

function gainchange(event) {
  console.log(event.target.value);
  adjustGain(keymaps, event.target.value)
}


volumeControl.addEventListener("input", gainchange, false);

// Check for changes in the waveform selector and update all oscillators with the selected type
waveFormSelector.addEventListener('change', setWaveform);


// listeners to play notes on key presses
window.addEventListener('keydown', detectKey);
window.addEventListener('keyup', function(event) {

  console.log(keymaps)
  var keyCode = event.keyCode || event.target.getAttribute('data-key');
  var keyobj = keymaps.find(function(d){
    return d.keyMap === keyCode
  })
  //console.log('turn off', keyobj)
  endNote(keyCode, keyobj);
});
