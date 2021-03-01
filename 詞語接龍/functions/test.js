var text_library = require('./text_library.json');

var keys = Object.keys(text_library);
var output_array = [];


for (var i = 0; i < keys.length; i++) {

    var word_list = text_library[keys[i]];
    for (var j = 0; j < word_list.length; j++) {

        var last_word = word_list[j].split('').pop();

        if (text_library[last_word] === undefined && output_array.indexOf(last_word) === -1) {
            output_array.push(last_word)
        }
    }

}

console.log(output_array)

const fs = require('fs-extra')

// With a callback:
fs.writeJson('./output.json', { output: output_array }, err => {
    if (err) return console.error(err)
    console.log('success!')
})