var price_type = require("./price_type.json");
var number_row = ["super", "special", "first", "addition"];

function generator(input) {

    var number_show = [];

    for (var i = 0; i < number_row.length; i++) {

        var temp = input[number_row[i]];

        var process_array = [];
        // console.log(temp)
        for (var j = 0; j < Object.keys(temp).length; j++) {
            var array = []
            if (j === 0) { array.push(price_type[number_row[i]]) } else { array.push(" ") }
            array = array.concat(temp.slice(j, j + 2))
            if (array.length === 2) { array.push(" ") }
            process_array.push(array)
            j++
            //  console.log(j)
        }

        for (var k = 0; k < process_array.length; k++) {
            number_show.push({
                "cells": process_array[k],
                "dividerAfter": false,
            })
        }
    }

    return number_show
}
module.exports = { generator }