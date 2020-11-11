var cheerio = require('cheerio');
const request = require('request');
var moment = require('moment-timezone');
var locate = ["Taipei", "Hsinchu", "Taichung", "Tainan", "Kaohsiung"]
const replaceString = require('replace-string');

async function getBloodstatus(num) {
    return new Promise(
        function(resolve, reject) {
            request('http://www.blood.org.tw/Internet/main/index.aspx', function(error, response, body) {
                const $ = cheerio.load(body)
                resolve($('#blood-table tbody tr').toString())
            })
        }).then(function(final_data) {

        var json = { PublishTime: moment().tz('Asia/Taipei').format() };
        var origin = final_data.replace(/<[a-z]+>/gi, "");
        origin = origin.replace('scope="col"', "");
        origin = origin.replace(/\s/gi, "");

        var array = origin.split('imgsrc');
        //console.log(array)
        var status = [];
        for (var i = 2; i < array.length; i++) {
            if (array[i].indexOf('StorageIcon001') !== -1) { status.push('empty') } else if (array[i].indexOf('StorageIcon002') !== -1) { status.push('medium') } else if (array[i].indexOf('StorageIcon003') !== -1) { status.push('full') }
        }

        var temp = {}
        for (var j = 0; j < status.length; j++) {
            if (j % 4 === 0) { temp = {} }
            temp[j % 4] = status[((j % 4) * 5) + parseInt(j / 4)]
            if (j % 4 === 3) {
                // console.log(temp)
                json[locate[parseInt(j / 4)]] = temp
            }
        }

        var PublishTime_modify = json.PublishTime.split('+')[0];
        PublishTime_modify = replaceString(PublishTime_modify, '-', '/');
        json.PublishTime = replaceString(PublishTime_modify, 'T', ' ');

        return json

    }).catch(function(error) {
        return error
    });
};

module.exports = { getBloodstatus }