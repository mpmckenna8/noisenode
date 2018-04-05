// to help with the qwerty key mapping when making a keyboard with sharp stuff

/*
The sharp keys will only be necessary sometimes

Sharps     q   w   e   r   t   y   u   i   o   p
base keys    a   s   d   f   g    h   j  k   l   ;

so like between b and c there will be no sharp
*/

// a function which takes a starting note for the base keys and
// creates a nice keyboard mapping to notes obj for using in making noise
var keycode = require('keycode');
var noteObj = require('../loadscalefreqs.js');


var baseKeys = ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';'];

var sharps = ['q',  'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'];

var keyCount = 0;
var baseCount = 0;

var onIndex = -1;


function keyboardmap(startNote) {
  let keymap = [];
  baseCount = 0;
  onIndex = -1;
  //console.log('maping object')

  console.log("notes index", noteObj.findIndex(function(ele) {
  //  console.log(ele.name, startNote)
    return ele.name === startNote;
  }))

  onIndex = noteObj.findIndex(function(ele) {
    return ele.name === startNote;
  })

  var startkey = (startNote[1] === '#' ) ? 'q' : 'a';

    while( baseCount < baseKeys.length){
      var finote = noteObj[onIndex];
      finote = makefinalNote(finote);
      keymap.push(finote)
    //  console.log(baseCount)
    //    baseCount = baseCount + 1;
    }
  return keymap;
}


function makefinalNote(onNote) {
  var notey = onNote;
    if( onNote.name[1] == "#" ) {
      notey.keyMap = keycode(sharps[baseCount])
      notey.keyboardKey = sharps[baseCount];
      notey.sharp = true;
    }
    else{
      notey.keyMap = keycode(baseKeys[baseCount]);
      notey.keyboardKey = baseKeys[baseCount];
      notey.sharp = false;
      baseCount = baseCount + 1;
    }
  keyCount = keyCount + 1;
  onIndex = onIndex + 1;
  return notey
}

module.exports = keyboardmap;

//console.log( keyboardmap("C4") );
