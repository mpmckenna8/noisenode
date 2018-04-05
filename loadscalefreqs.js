
var fs = require('fs')

var fidat = fs.readFileSync('ScaleFreqs/nineocts.csv').toString();

var notes = fidat.split('\n')

function Noter(name, frequency) {

  this.name = name;
  this.frequency = +frequency
}

var notes = notes.map(function(d,i){
  var splitnote = d.split(',')

  return new Noter(splitnote[0], splitnote[1])
})

//console.log('file reading', notes)

module.exports = notes;
