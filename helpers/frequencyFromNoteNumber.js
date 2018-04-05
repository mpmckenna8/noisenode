module.exports = frequencyFromNoteNumber;

// I think this is to do from the midi value but not sure
function frequencyFromNoteNumber( note ) {
  return 440 * Math.pow(2,(note-69)/12);
}
