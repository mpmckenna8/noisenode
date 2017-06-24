var d3 = require('d3');
var makeSound = require('../sound.js');
var keysound = require('../keysound.js')

//var Key = keysound(Sound);


var keyBoardBuilder = {
	addKeyboard: function(margin, height, width, keyboardHeight ) {

		this.svg.append('g')
      		.attr('transform', function(){
          		return "translate(" + margin + "," + (height/2-keyboardHeight/2) +
              			")"
       		})
        	.attr('id', 'keyboardG')
        	.append('rect').attr('height', keyboardHeight)
        	.attr('width', width-margin*2)

	},
	refreshKeys: function (notes, keyboardWidth, keyboardHeight, keyBoardInputMode, audioCtx){

		var Sound = makeSound(audioCtx);
  		var Key = keysound(Sound);



    	d3.selectAll('.keyg').remove();
  //  var noteKeys = Object.keys(notes);
    	var keyboard = d3.select('#keyboardG')
	    var keybuff = 8;
    	var keyWidth = keyboardWidth/10  - keybuff*2;

    	if(keyBoardInputMode === 'qwerty'){
      		keyWidth = keyboardWidth/10  - keybuff*3
    	}

   	 console.log('keymaping', notes)
    	var baseCo = 0;

    	var keygs = keyboard.selectAll('.keys')
      		.data(notes)
      		.enter()
      		.append('g')
					.attr('transform', function(d, i){
						var transX = 0;
						var transY = 0;
						var bump = 0;
						if(!d.sharp){
							baseCo = baseCo + 1;
						}
						else {
							bump = keyWidth/2 + 4
						}
						transX = -2 + bump + baseCo * (keyWidth + keybuff) + baseCo *keybuff;

						return "translate(" + transX + "," + transY + ")"
					})
					.attr('class', 'keyg')



		keygs.append('rect')
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

	return 0// -2 + bump + baseCo * (keyWidth + keybuff) + baseCo *keybuff;
})
.attr('class', "keys")
.attr('id', function(d,i) {
		return 'key' + d.keyMap;
})
.attr('sharper', function(d){
	return d.sharp;
})
.each(function(d,i){
//      	console.log(d)
		var note = d;
		notes[i].key = Key(d, '', '', d.frequency)
		// need to setFilter somewhere else with some solid arguments, especially like the time changing ones
		notes[i].key.sound.setFilter();
})


	},
	svg: function() {
		var svg = d3.select('#keySVG')
		return svg;
	}()
}

module.exports = keyBoardBuilder
