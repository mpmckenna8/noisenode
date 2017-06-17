// a function to make a sound attribute for each key
function keysound(Sound, waveForm) {



return function Key(keyCode, noteName, keyName, frequency) {
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
}

module.exports = keysound;
