const replaceString = require("replace-string");
var size_table = require("./reduce_size.json");

function getHour() {
    var today = new Date();
    var nowTime = today.getTime() + 8 * 3600 * 1000;
    today.setTime(parseInt(nowTime));
    var oHour = today.getHours();

    return oHour
}

function textindexer(input) {
    var k = 0;
    var j = 0;
    var indexarray = ["明德", "今明", "明顯", "明晨"];
    for (j = 0; j < indexarray.length; j++) {
        if (input.indexOf(indexarray[j]) !== -1) { k++; }
    }

    return k
}

function reduceSIZE(input) {
    var temp = Object.keys(size_table);
    for (var i = 0; i < temp.length; i++) {
        input = replaceString(input, temp[i], size_table[temp[i]]);
    }
    return input;
}

function generator(input) {

    var hour_now = getHour();

    var report_time = reduceSIZE(input);
    report_time = (report_time.split("發布時間：")[1]).split("分")[0] + "分";

    if (report_time.indexOf("6時") !== -1) { var output_time = "今天清晨六點"; } else if (report_time.indexOf("11時") !== -1) { var output_time = "今天早上十一點"; } else if (report_time.indexOf("19時") !== -1) { var output_time = "今天晚間七點"; } else if (report_time.indexOf("23時") !== -1) {
        var output_time = "今天晚上十一點";
        if (hour_now < 11) { output_time = "昨日晚上十一點"; }
    }

    var subtitle = (input.split("【")[1]).split("】")[0];
    subtitle = subtitle.replace(/[。]/gi, "");
    subtitle = subtitle.replace(/\r\n/gi, "");

    report_array = input.replace(/\r\n/gi, "").split("。");

    var display_report = "";
    var output_contect = "";

    for (i = 1; i < report_array.length; i++) {

        if (display_report.length !== 0) { display_report = display_report + "  \n  \n"; }

        var report = reduceSIZE(report_array[i]);
        report = report.replace(/\s/gm, "");
        var temp = report;

        var replace_dict = {
            "今": "昨",
            "明": "今",
            "昨年": "今年",
            "今顯": "明顯",
        }
        var replace_list = Object.keys(replace_dict);

        //發布時間是晚間11點但已跨至「明天」的內容修正
        if (hour_now < 11 && report_time.indexOf("23時") !== -1) {
            for (var i = 0; i < replace_list.length; i++) {
                temp = replaceString(temp, replace_list[i], replace_dict[replace_list[i]])
            }
        }

        //建立顯示於卡片上的文字
        if (display_report.length === 0 && temp.indexOf("今天") !== -1) {
            display_report = temp + "。";
        } else if (display_report.length !== 0) { display_report = display_report + temp; }

        //為口語化輸出減少部分內容
        var temp = temp.replace(/[）|\)]/mig, "\n");
        var temp = temp.replace(/[（|\()]\S+[\r\n]/g, "");

        //「去除昨日的預報資訊」
        if (output_contect.length === 0 && temp.indexOf("今天") !== -1) {
            output_contect = temp;
        } else if (output_contect.length !== 0) {
            output_contect = output_contect + "</s><break time="
            0.3 s "/><s>" + temp;
        }

        if (report_array[i + 1].indexOf("根據環保署") !== -1) { break; }

    }

    display_report = display_report + "  \n  \n**發布時間** • " + report_time;

    return [output_time, output_contect, subtitle, display_report]

}
module.exports = { generator }