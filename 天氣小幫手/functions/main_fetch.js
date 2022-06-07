const replaceString = require("replace-string");
var size_table = require("./reduce_size.json");
var request = require('request');
var cheerio = require('cheerio');

function getHour() {
    var today = new Date();
    var nowTime = today.getTime() + 8 * 3600 * 1000;
    // var nowTime = today.getTime();
    today.setTime(parseInt(nowTime));
    var oHour = today.getHours();

    return oHour
}

function getDate(num) {
    var today = new Date();
    var nowTime = today.getTime() + 8 * 3600 * 1000;
    var ms = 24 * 3600 * 1000 * num;
    today.setTime(parseInt(nowTime + ms));
    var oDay = today.getDate().toString();
    return oDay;
}

var replace_dict = {
    "今": "昨",
    "明": "今",
    "昨年": "今年",
    "今顯": "明顯",
}

function change_date(input) {

    var replace_list = Object.keys(replace_dict);

    //發布時間是晚間11點但已跨至「明天」的內容修正
    for (var i = 0; i < replace_list.length; i++) {
        input = replaceString(input, replace_list[i], replace_dict[replace_list[i]])
    }


    return input
}

function reduceSIZE(input) {
    var temp = Object.keys(size_table);
    for (var i = 0; i < temp.length; i++) {
        input = replaceString(input, temp[i], size_table[temp[i]]);
    }
    return input;
}

async function generator() {

    return new Promise(
        function(resolve, reject) {
            request('https://www.cwb.gov.tw/Data/js/fcst/W50_Data.js?', function(err, response, body) {
                var $ = cheerio.load(body, { decodeEntities: false });
                var temp = $.text();
                temp = temp.replace(/.+[=][{]/gm, "{");
                temp = replaceString(temp, "'", '"');
                // console.log(temp)
                var FCJsonObj = JSON.parse(temp);
                resolve(FCJsonObj['W50'])
            });
        }).then(function(input) {
        

        // console.log(input)

        var report_time = reduceSIZE(input.DataTime);

        var pulish_hour = parseInt(report_time.split(' ')[1].split(':')[0]);
        var pulish_min = parseInt(report_time.split(' ')[1].split(':')[1]);
        var pulish_date = parseInt(report_time.split(' ')[0].split('/')[1]);

        if ([1, 2, 3, 4, 5, 6, 7, 8].indexOf(pulish_hour) !== -1) {
            var output_time = "今天清晨" + pulish_hour + "點";
        } else if ([8, 9, 10, 11, 12, 13, 14].indexOf(pulish_hour) !== -1) {
            var output_time = "今天早上" + pulish_hour + "點";
        } else if ([15, 16, 17, 18, 19, 20].indexOf(pulish_hour) !== -1) {
            var output_time = "今天晚間" + pulish_hour % 12 + "點";
        } else if ([21, 22, 23].indexOf(pulish_hour) !== -1) {
            var output_time = "今天晚上" + pulish_hour % 12 + "點";
            if (getDate(-1).toString() === pulish_date.toString()) { output_time = "昨日晚上" + pulish_hour % 12 + "點"; }
        }
        
        output_time += pulish_min+"分"

        var report_array = input.Content;
        // console.log(report_array)
        if (input.Title.indexOf('】') !== -1) {
            var subtitle = input.Title.split('】')[0].replace(/[\。|\【|\】]/gi, "");

            if (input.Title.split('】')[1].length !== 0) {
                report_array = [input.Title.split('】')[1]].concat(report_array)
            }
        } else {
            var subtitle = input.Title.replace(/[\。|\【|\】]/gi, "");
        }

        // if (hour_now < 11 && output_time.indexOf('昨日') !== -1) {
        //     subtitle = change_date(subtitle);
        // }

        var display_report = "";
        var output_contect = "";

        for (i = 0; i < report_array.length; i++) {

            if (display_report.length !== 0) { display_report = display_report + "  \n  \n"; }

            console.log(report_array[i])

            var report = reduceSIZE(report_array[i]);

            var temp = report.replace(/\s/gm, ""); //去除空格

            // if (hour_now < 11 && output_time.indexOf('昨日') !== -1) {
            //     temp = change_date(temp);
            // }

            //建立顯示於卡片上的文字
            if (display_report.length === 0) {
                display_report = temp + "。";
            } else if (display_report.length !== 0) { display_report = display_report + temp; }

            //為口語化輸出減少部分內容
            var temp = temp.replace(/[）|\)]/mig, "\n");
            temp = temp.replace(/[（|\()]\S+[\r\n]/g, "");

            //「去除昨日的預報資訊」
            if (output_contect.length === 0) {
                output_contect = temp;
            } else if (output_contect.length !== 0) {
                output_contect = output_contect + '</s><break time="0.3s"/><s>' + temp;
            }

            if (report_array[i + 1] !== undefined) {
                if (report_array[i + 1].indexOf("https://airtw.epa.gov.tw") !== -1) { break; }

            }
        }

        console.log(display_report)

        display_report = display_report + "  \n  \n**發布時間** • " + report_time;
        display_report = replaceString(display_report, '。。', '。');
        output_contect = replaceString(output_contect, '都會區', '督會區');
        return [output_time, output_contect, subtitle, display_report]
    });
}
module.exports = { generator }