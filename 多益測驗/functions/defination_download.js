var Owlbot = require('owlbot-js');
var word_dict = require('./toeic.json');
var word_list = Object.keys(word_dict);
var getJSON = require('get-json');
const fs = require('fs-extra')

var output = {};

var k = 52;

//for (var i = 0; i < 4; i++) {
for (var i = k * 100; i < (100 * (k + 1) + 1); i++) {
    console.log(word_list[i])
    if (i % 10 ===0 ){console.log(i)}
    getJSON('https://api.dictionaryapi.dev/api/v2/entries/en_US/' + word_list[i], function(error, response) {

        if (response !== undefined) {
            fs.outputJson('./defination/' + response[0].word + '.json', response[0], err => {
                //console.log(err) // => null
            })
        }

    }).catch(function(error) {

        console.log(error)

    });;


}