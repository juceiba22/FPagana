const fs = require('fs');
const pdf = require('pdf-parse');

let dataBuffer = fs.readFileSync('script.pdf');

pdf(dataBuffer).then(function(data) {
    fs.writeFileSync('script_extracted.txt', data.text);
    console.log("Extracted successfully.");
}).catch(e => console.error(e));
