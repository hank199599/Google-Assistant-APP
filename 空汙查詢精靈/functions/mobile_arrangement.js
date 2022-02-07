var contry_row = [
    "臺北",
    "新北",
    "永和",
    "桃園",
    "新竹",
    "苗栗",
    "臺中",
    "彰化",
    "南投",
    "雲林",
    "嘉義",
    "臺南",
    "高雄",
    "屏東",
    "宜蘭",
    "花蓮",
    "臺東",
]

/**
 * 這是相加的功能
 * 
 * @param {List} station_array 輸入現有的監測站矩陣
 * @returns 經篩選後，屬於行動測站的監測站列表
 */
function machine(station_array) {

    var output = {};
    var results = [];
    console.log(station_array.length)

    for (var i = 0; i < contry_row.length; i++) {
        if (output[contry_row[i]] === undefined) { output[contry_row[i]] = [] }

        for (var j = 0; j < station_array.length; j++) {
            if (station_array[j].indexOf(contry_row[i]) !== -1 && station_array[j].indexOf("(") !== -1) {
                output[contry_row[i]] = output[contry_row[i]].concat([station_array[j]])
            }
        }
        if (output[contry_row[i]].length === 0) { delete output[contry_row[i]] } else {
            results = results.concat(output[contry_row[i]])
        }
    }
    return results
}

module.exports = {
    machine
}