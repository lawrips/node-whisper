'use strict'
// required modules
const fs = require('fs'),
    program = require('commander');


// setup options
var argFile = '';
program
  .option('-f, --file [file]', 'the filename to send to whisper')
  .option('-t, --text [text]', 'provide a string rather than a file')
  .option('-u, --url [url]', 'optional: overrides destination server (developers only)')
  .option('-e, --encoding [encoding]', 'optional: specifies encoding (default is utf-8')
  .parse(process.argv);

// check for params 
if (!program.file && !program.text) {
    program.outputHelp();
    process.exit(1);
} 

// whisper config + instance
var config = require('../config/cli.json');
if (program.url) {
    config.developerUrl = program.url;
}
let Whisper = require('../index.js')
let whisper = new Whisper(config);

var text = program.file ? fs.readFileSync(program.file, program.encoding || 'utf8') : program.text;
whisper.set(text, (err, result) => {
    if (err) console.log(err);
    else {
        console.log(result.webUrl);
    }
})