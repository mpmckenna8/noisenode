var d3 = require('d3')

module.exports =  {
    volumeControl: document.querySelector("#volumeControl"),
  //  envelopeMaster: document.querySelector("#envelopeMaster"),
    attackInput: document.querySelector("#attackControl"),
    releaseInput: document.querySelector("#releaseControl"),
    attackValue: 1.0,
    setAttackValue: function(val) {
      this.attackValue = val;
    },
    releaseValue: 1.0,
    playing: {
      qwerty:[],
      midi: []
    },
    svg: d3.select('#keySVG'),
    svgopts: {
      width: 520,
      height:220,
      margin: 20,
      keyboardHeight: 80,
      keyboardWidth: 500,
      SetkeyboardWidth: function() {
        console.log('this kbwdith, ', this.width)
        this.keyboardWidth =  (this.width - this.margin * 2) },
      onNote:"G#4",
      setpsInOctate: 12

    },
    SetUpSvg: function() {
    //  console.log('setupsvg, ', this.svgopts)

      this.svg.attr('height', this.svgopts.height)
        .attr('width', this.svgopts.width);
    },

    BuildKeyboard: function(keyBoarder, keymaps, keyBoardInputMode, audioCtx ) {
      console.log('buildkeyboard, ', this.svgopts)

      keyBoarder.addKeyboard(this.svgopts.margin, this.svgopts.height, this.svgopts.width, this.svgopts.keyboardHeight, this.svg)
      keyBoarder.refreshKeys(keymaps, this.svgopts.keyboardWidth, this.svgopts.keyboardHeight, keyBoardInputMode, audioCtx, this.svg);
    }
  }
