var d3 = require('d3');

 var endNote = function(keyCode, keyobj) {

     if(typeof keyobj !== 'undefined') {
         // Kill connection to output
         keyobj.key.sound.stop();

         // Remove key highlight
         var keysel = d3.select('#key' + keyCode);
         var keyclass = keysel.attr('class');

          keysel.attr('fill', function(d){
      //      console.log('inkeyclass', d);
            if(d.sharp === true) {
               return 'yellow';
            }
            else{
              return 'green'
            }
          })

        }
 };

module.exports = endNote;
