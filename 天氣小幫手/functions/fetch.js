var i = 0;
var pre_report = "";
var temp_report = "";
var report_context = "";
var output_context = "";
const replaceString = require('replace-string');
var size_table = require('./reduce_size.json');

function textindexer(input) {
    var k = 0;
    var j = 0;
    var indexarray = ["明德", "今明", "明顯", "明晨"];
    for (j = 0; j < indexarray.length; j++) {
        if (input.indexOf(indexarray[j]) !== -1) { k++; }
    }

    return k
}

function getHour() {
    var today = new Date();
    var nowTime = today.getTime() + 8 * 3600 * 1000;
    today.setTime(parseInt(nowTime));
    var oHour = today.getHours();

    return oHour
}

function reduceSIZE(input) {

    var temp = Object.keys(size_table);
    for (var i = 0; i < temp.length; i++) {
        input = replaceString(input, temp[i], size_table[temp[i]]);
    }
    return input;
}

function generator(final_data, county, input) {

    report_context = "";
    output_context = "";
    temp_report = "";
    pre_report = "";

    for (i = 1; i < final_data.length; i++) {

        if (county === "基隆市") {
            if (final_data[i].parameterValue.indexOf('預報總結') !== -1) {
                output_context = final_data[i + 1].parameterValue;
                report_context = output_context;
                break;
            }
        } else {
            report_context = report_context + final_data[i].parameterValue;
            if (output_context.length === 0 && final_data[i].parameterValue.indexOf('今') !== -1) {

                output_context = final_data[i].parameterValue;
                output_context = output_context.replace(/[（|\(]\S+[）|\)]/gm, "");
                output_context = output_context.replace(/[今]+[（|\(]+[\d]+[）|\)]+[日]/gm, "今天");

                console.log("今日:" + output_context)
            }
            //檢測是否存在明日的預報資訊，如果存在則以明日的預報優先
            if (pre_report.length === 0 && final_data[i].parameterValue.indexOf('明') !== -1 && textindexer(final_data[i].parameterValue) === 0) {

                pre_report = final_data[i].parameterValue;
                pre_report = pre_report.replace(/[（|\(]\S+[）|\)]/gm, "");
                pre_report = pre_report.replace(/[明]+[（|\(]+[\d]+[）|\)]+[日]/gm, "明天");
            }
            if (temp_report.length === 0) {
                temp_report = final_data[i].parameterValue;
                temp_report = temp_report.replace(/[（|\(]\S+[）|\)]/gm, "");
            }

            if (final_data[i + 1] !== undefined) {
                report_context = report_context + "  \n  \n";
            }
        }
    }

    if (county !== "基隆市") {
        //收尾語音輸出的報告
        if (pre_report.length !== 0) { output_context = pre_report; }
        if (output_context.length === 0 && pre_report.length === 0) { output_context = reduceSIZE(temp_report); }
        //收尾文字輸出的報告格式
        report_context = reduceSIZE(report_context);
    }
    //針對特定地點的客製化輸出

    if (input.indexOf('阿里山') !== -1) {
        county = "阿里山";
        report_context = final_data[4].parameterValue;
        output_context = report_context;
    } else if (input.indexOf('日月潭') !== -1) {
        county = "日月潭";
        report_context = "日月潭地區" + output_context.split('日月潭地區')[1];
        output_context = report_context;
    } else if (input.indexOf('明德') !== -1 || input.indexOf('鯉魚潭') !== -1 || input.indexOf('雪霸') != -1) {
        var temp = final_data[4].parameterValue.split("；");
        if (input.indexOf("明德") !== -1) {
            county = "明德水庫";
            report_context = temp[0].split('日）')[1];
        } else if (input.indexOf("鯉魚潭") !== -1) {
            county = "鯉魚潭水庫";
            report_context = temp[1];
        } else if (input.indexOf("雪霸") !== -1) {
            county = "雪霸國家公園觀霧遊憩區";
            report_context = temp[2];
        }
        output_context = report_context;
    } else if (input.indexOf('參天') !== -1 || input.indexOf('梨山') !== -1 || input.indexOf('大雪山') != -1 || input.indexOf('臺中港') != -1 || input.indexOf('台中港') !== -1) {
        var temp = final_data[4].parameterValue.split("；");
        if (input.indexOf('參天') !== -1 || input.indexOf('梨山') !== -1) {
            county = "參天國家風景區";
            report_context = "參天國家風景區" + temp[0].split(')')[1];
        } else if (input.indexOf("大雪山") !== -1) {
            county = "大雪山國家森林遊樂區";
            report_context = temp[1];
        } else if (input.indexOf("臺中港") !== -1 || input.indexOf('台中港') !== -1) {
            county = "臺中港";
            report_context = temp[2];
        }
        output_context = report_context;
    } else if (input.indexOf('塔塔加') !== -1 || input.indexOf('奧萬大') !== -1 || input.indexOf('清境') != -1 || input.indexOf('惠蓀林場') != -1) {
        county = "仁愛信義山區";
        report_context = "仁愛信義山區" + (output_context.split("仁愛信義山區")[1]).split("。")[0];
        output_context = report_context;
    }

    var subtitle = final_data[0].parameterValue;
    subtitle = subtitle.replace(/[，\；]/gi, "•");
    subtitle = subtitle.replace(/[。\【\】]/gi, "");
    subtitle = subtitle.replace(/\r\n/gi, "");

    if (subtitle.indexOf(')日') !== -1) { subtitle = subtitle.split(')日')[1]; }
    if (subtitle.indexOf('）日') !== -1) { subtitle = subtitle.split('）日')[1]; }

    var hour_now = getHour();
    if (hour_now < 6) {
        report_context = replaceString(report_context, '今天', '昨天')
        report_context = replaceString(report_context, '明天', '今天')
        output_context = replaceString(output_context, '明天', '今天')
    }

    return [report_context, output_context, subtitle]

}

module.exports = { generator }