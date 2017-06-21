// adjust gain function here;

function adjustGain(keyobjs, newgain) {
   console.log('adjust the gain on, ', keyobjs)
   for( i of keyobjs ) {
       console.log(i)
       i.key.sound.setGain(newgain);
   }
}

module.exports = adjustGain;
