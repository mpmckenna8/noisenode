var d3 = require('d3');
var Keycode = require('keycode');
var makeSound = require('./sound.js');
var keyBoarder = require('./helpers/keyboarder.js')
var playNote = require('./helpers/playnote.js')
var endNote = require('./helpers/stopnote.js')
let adjustGain = require('./helpers/adjustGain.js')

let configs = require('./helpers/configs.js')

let context = null;
let constantNode = null;

let frequencyFromNoteNumber = require('./helpers/frequencyFromNoteNumber')

context = new (window.AudioContext || window.webkitAudioContext)();

let midiAccess;
// Check for midi access and either set up midi events or alert.
if (navigator.requestMIDIAccess) {
  console.log('you got midi access')
  navigator.requestMIDIAccess().then( onMIDIInit, onMIDIReject );
}
else {
  alert("No MIDI support present in your browser.  You're gonna have a bad time.")
  console.log('no midi support for you')
}


function hookUpMIDIInput() {
  var haveAtLeastOneDevice=false;
    var inputs=midiAccess.inputs.values();

// to log midi devices
console.log('connected midi devices: ')
  for( q of inputs ) {
    console.log(q);
   }


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
  console.log('midi event happend', event, event.data[2])

  // Mask off the lower nibble (MIDI channel, which we don't care about)
  switch ( event.data[0] & 0xf0 ) {
    case 0x90:
      if (event.data[2]!=0 ) {  // if velocity != 0, this is a note-on message

        // basically think I need to make a Sound thing then add it
      noteOn(event.data[1]);

      console.log('it on note', event, event.data[1])

        return;
      }
      // if velocity == 0, fall thru: it's a note-off.  MIDI's weird, ya'll.
    case 0x80:
        console.log('it off ernan', event, event.data[0], 'note code = ', event.data[1])

      //noteOff(event.data[1]);
      return;
  }
}

var audioCtx = new (AudioContext || webkitAudioContext)();

var noteObj = require('./loadscalefreqs.js');

let Sound = makeSound(audioCtx );

function noteOn(noteNumber) {
      var keyobj = keymaps.find(function(d){
          return (d.frequency - frequencyFromNoteNumber(noteNumber) ) < .24;
        })
        // new sounds
        let sound = Sound(frequencyFromNoteNumber(noteNumber), configs.waveForm)
         //{  noteNumber: makeSound(frequencyFromNoteNumber(noteNumber), 'triangle')}
        let freq = frequencyFromNoteNumber(noteNumber);
        // here I should be able to get this
      console.log('new note on', noteNumber, freq, keyobj)
}

// this should get called on midi key up but doesn't currently do anythign.
function noteOff(noteNumber) {
// need to turn the midi note note Off
}

// I think it's very possible just to have both be going at the same time
var keyBoardInputMode = "qwerty";
var qwertykeymapper = require('./helpers/qwertys.js');


configs.SetUpSvg()
configs.svgopts.SetkeyboardWidth();

 // Table of notes with correspending keyboard codes. Frequencies are in hertz.
    // The notes start from middle C
 // right now only using qwerty, but want to allow mapping from web midi devices too!
var keymaps = qwertykeymapper(configs.svgopts.onNote);
console.log('keymaps', keymaps)


configs.BuildKeyboard(keyBoarder, keymaps, keyBoardInputMode, audioCtx);

var controlKeys = {
  "shiftDownStep": ",",
  "shiftUpStep": "."
}



var detectKey = function(event) {
  var keyCode = event.keyCode || event.target.getAttribute('data-key');

    var keyobj = keymaps.find(function(d){
      return d.keyMap === keyCode;
    })

  console.log('keyobj = ', keyobj)

    // if it's a playable note play it
   if(typeof keyobj !== 'undefined') {

     if(keyobj.key.sound.pressed === false) {
        configs.playing.qwerty.push(keyobj);
        playNote(keyCode, keyobj)
      }
   }
   // if it's a , then step down
  else if( keyCode === Keycode(controlKeys.shiftDownStep)){
    var onIndex = noteObj.findIndex(function(ele) {
      return ele.name === configs.svgopts.onNote;
    })

    configs.svgopts.onNote = noteObj[ onIndex  -  1 ].name
    keymaps = qwertykeymapper(configs.svgopts.onNote);
    keyBoarder.refreshKeys(keymaps, configs.svgopts.keyboardWidth, configs.svgopts.keyboardHeight, keyBoardInputMode,audioCtx);
  }
  // it it's a . then step up and redo the keyboard
  else if ( keyCode == Keycode(controlKeys.shiftUpStep) ) {
    console.log('move up step')
    var onIndex = noteObj.findIndex(function(ele) {
      return ele.name === configs.svgopts.onNote;
    })

    configs.svgopts.onNote = noteObj[ onIndex  +  1 ].name;
    keymaps = qwertykeymapper(configs.svgopts.onNote);
    keyBoarder.refreshKeys(keymaps, configs.svgopts.keyboardWidth, configs.svgopts.keyboardHeight, keyBoardInputMode,audioCtx);
  }
}


var waveFormSelector = document.getElementById('soundType');
// Check for changes in the waveform selector and update all oscillators with the selected type
var setWaveform = function(event) {
  console.log('waveformchanged')
    for(var keyobjec of keymaps) {
      console.log('changing waveform', keyobjec)
      keyobjec.key.sound.waver = this.value;
    //  keyobjec.key.sound.osc.type = this.value;
    }
    configs.SetWaveForm(this.value)
    this.blur();
};

waveFormSelector.addEventListener('change', setWaveform);

function gainchange(event) {
  console.log('adjusting the gain', event.target.value);
  adjustGain(keymaps, event.target.value)
}

function attackChange(event) {
  console.log('attack change, event=', event)
  configs.SetAttackValue(event.target.value);

  for(var keyobjec of keymaps) {
    console.log(keyobjec)
    keyobjec.key.sound.attack = event.target.value;
  //  keyobjec.key.sound.osc.type = this.value;
  }
}



configs.volumeControl.addEventListener("input", gainchange, false);
configs.attackInput.addEventListener("input", attackChange, false);
configs.releaseInput.addEventListener("input", configs.ReleaseChange, false);



// listeners to play notes on key presses
window.addEventListener('keydown', detectKey);


window.addEventListener('keyup', function(event) {
  //  console.log(keymaps)
  var keyCode = event.keyCode || event.target.getAttribute('data-key');
  var playIndex = 0;
  var keyobj = configs.playing.qwerty.find(function(d, i){
  //  console.log('index number', i)
    playIndex = i;
    if(d){
    return d.keyMap === keyCode
    }
    return false;
  })
  if(keyobj) {

    configs.playing.qwerty.splice(playIndex, 1);
    endNote(keyCode, keyobj);

  }

});
