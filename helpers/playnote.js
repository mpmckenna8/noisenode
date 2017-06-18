// see if this shows up
var d3 = require('d3');

var playNote = function(keyCode, keyobj) {
    // event.preventDefault();
     if(typeof keyobj !== 'undefined') {
         // Pipe sound to output (AKA speakers)
        keyobj.key.sound.play();

         // Highlight key playing
         d3.select('#key' + keyCode)
          .attr('fill', 'red')
    //     notesByKeyCode[keyCode].key.html.className = 'key playing';
     }
 };

module.exports = playNote;
