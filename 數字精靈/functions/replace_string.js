const replaceString = require('replace-string');
var nzhhk = require("nzh/hk"); //引入繁体中文數字轉換器

function input(input, locale) {

    if (input.match(/^[0-9]+$/) !== null) { input = replaceString(input, '萬', '0000'); }

    if (locale.indexOf('zh') !== -1) {

        var num_comapre = input.replace(/\s+/g, '');

        if (parseInt(num_comapre) > 10000) {

            if (input === "7 11") { input = "71" }
            input = replaceString(input, '0 1', '1');
            input = replaceString(input, '0 2', '2');
            input = replaceString(input, '0 3', '3');
            input = replaceString(input, '0 4', '4');
            input = replaceString(input, '0 5', '5');
            input = replaceString(input, '0 6', '6');
            input = replaceString(input, '0 7', '7');
            input = replaceString(input, '0 8', '8');
            input = replaceString(input, '0 9', '9');

        }

        if (input.length === 1) {

            if (["林", "零"].indexOf(input) !== -1) { input = 0; }
            else if (["什", "食"].indexOf(input) !== -1) { input = 10; }
            else if (["爸"].indexOf(input) !== -1) { input = 8; }

        }
        else {
            input = input.replace(/\s+/g, '');//消除輸入字串中的空格
            input = replaceString(input, '奇異', '七億');
            input = replaceString(input, 'e', '億');
            input = replaceString(input, '義', '億');
            input = replaceString(input, '以前', '一千');
            input = replaceString(input, '佰', '百');
            input = replaceString(input, '元', '萬');
            input = replaceString(input, '仟', '千');
            input = replaceString(input, '壹', '一');
            input = replaceString(input, '貳', '二');
            input = replaceString(input, '兩', '二');
            input = replaceString(input, '參', '三');
            input = replaceString(input, '肆', '四');
            input = replaceString(input, '是', '四');
            input = replaceString(input, '伍', '五');
            input = replaceString(input, '若', '六');
            input = replaceString(input, '陸', '六');
            input = replaceString(input, '柒', '七');
            input = replaceString(input, '捌', '八');
            input = replaceString(input, '玖', '九');
            input = replaceString(input, '拾', '十');
            input = replaceString(input, '森林', '30');
            input = replaceString(input, '三菱', '30');
            input = replaceString(input, '爸', '8');
            input = replaceString(input, '酒', '9');
            input = replaceString(input, '乘', '');
            input = replaceString(input, '-', '');
        }

        if (isNaN(input) === true) {
            var temp=input.replace(/\D+/gi, "");
            input = nzhhk.decodeS(input);  //若輸入為中文數字，則藉由模組進行轉換
            if (input === 0) {
                if(temp.length>0){input=temp;}
                else{input = "";}
            }
        }
    }
    else {
        //其餘語系則單純藉由篩選數字，去除其他不必要輸入
        input = input.replace(/\D+/gi, "")
    }

    return input
}

module.exports = { input }
