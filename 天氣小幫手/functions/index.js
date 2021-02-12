'use strict';

// Import the Dialogflow module from the Actions on Google client library.
const {
    dialogflow,
    SimpleResponse,
    Button,
    List,
    Image,
    BasicCard,
    Suggestions
} = require('actions-on-google');

const functions = require('firebase-functions');
const app = dialogflow({ debug: true });

var iconv = require('iconv-lite');
var FetchStream = require("fetch").FetchStream;
const replaceString = require('replace-string');
var getJSON = require('get-json');
var request = require('request');

var converter = require('./report_convert.json');
var links = require('./link_convert.json');
var county_list = require('./county_list.json');
var reports = require('./fetch.js');
var main_reports = require('./main_fetch.js');

var county_array = ["臺北市", "新北市", "基隆市", "桃園市", "新竹縣", "新竹市", "苗栗縣", "新竹市", "臺中市", "南投縣", "彰化縣", "雲林縣", "嘉義縣", "嘉義市", "臺南市", "高雄市", "屏東縣", "宜蘭縣", "花蓮縣", "臺東縣", "金門縣", "澎湖縣", "連江縣"];
var vacation_array = ["阿里山", "日月潭", "明德水庫", "鯉魚潭水庫", "雪霸國家公園觀霧遊憩區", "參天國家風景區", "大雪山國家森林遊樂區", "台中港", "塔塔加", "奧萬大", "清境農場", "惠蓀林場"];
var word1 = "";
var word2 = "";

function ReportTime(input) {

    input = replaceString(input, '-', '/');
    input = replaceString(input, 'T', ' ');
    input = input.split('+')[0];
    return input;
}

function getDay(num) {
    var today = new Date();
    var nowTime = today.getTime() + 8 * 3600 * 1000;
    var ms = 24 * 3600 * 1000 * num;
    today.setTime(parseInt(nowTime + ms));
    var oMoth = (today.getMonth() + 1).toString();
    var oDay = today.getDate().toString();
    return oMoth + '月' + oDay + '日';
}

function reduceSIZE(input) {
    input = replaceString(input, '．', '.');
    input = replaceString(input, '０', '0');
    input = replaceString(input, '１', '1');
    input = replaceString(input, '２', '2');
    input = replaceString(input, '３', '3');
    input = replaceString(input, '４', '4');
    input = replaceString(input, '５', '5');
    input = replaceString(input, '６', '6');
    input = replaceString(input, '７', '7');
    input = replaceString(input, '８', '8');
    input = replaceString(input, '９', '9');
    return input;
}

const SelectContexts = {
    parameter: 'county_select',
}

app.intent('今日天氣概況', (conv) => {

    return new Promise(

        function(resolve, reject) {

            if (conv.user.raw.profile === undefined) {
                var fetch = new FetchStream("https://opendata.cwb.gov.tw/fileapi/opendata/MFC/F-C0032-031.FW50", { disableDecoding: true });

                fetch.on("data", function(chunk) {
                    resolve(iconv.decode(chunk, 'BIG5'));
                });
            } else { resolve("測試回傳成功") }
        }).then(function(final_data) {

        word1 = county_array[parseInt(Math.random() * 11)];
        word2 = county_array[11 + parseInt(Math.random() * 10)];

        console.log(final_data)

        var temp = main_reports.generator(final_data)

        conv.ask(new SimpleResponse({ "speech": `<speak><p><s>以下是中央氣象局，在${temp[0]}所發布的天氣概況。<break time="0.5s"/>${temp[1]}</s></p></speak>`, "text": '下面是來自氣象局的最新消息' }));

        if (conv.screen) {

            conv.ask(new BasicCard({
                "title": '全台天氣概況',
                "subtitle": temp[2],
                "text": temp[3],
                "buttons": new Button({ "title": "前往中央氣象局看詳細報告", "url": "https://www.cwb.gov.tw/V8/C/W/index.html", }),
            }));

            conv.ask(new Suggestions('查看各個區域', '查看天氣十日報', '如何加入日常安排', '👋 掰掰'));

            conv.user.storage.direct = false;
            conv.user.storage.station = "全臺";
        } else {
            conv.ask(`<speak><p><s>接著，你可以試著問我各縣市的天氣報告，例如<break time="0.25s"/>${word1}天氣如何?</s></p></speak>`)
            conv.noInputs = ["請試著問我，" + word1 + "天氣如何?", "請試著問我要查詢的縣市", "很抱歉，我幫不上忙"];
        }


    }).catch(function(error) {
        console.log(error)
        word1 = county_array[parseInt(Math.random() * 11)];

        conv.ask(new SimpleResponse({
            "speech": `<speak><p><s>糟糕，獲取全台的天氣報告發生一點小狀況。</s><s>但別擔心，你可以試著查詢縣市的天氣資訊</s><s>例如，請試著問我<break time="0.2s"/>${word1}天氣如何?</s></p></speak>`,
            "text": '獲取全台預報發生錯誤，\n請試著查詢縣市的天氣。'
        }));
        conv.ask(new BasicCard({
            "image": new Image({ "url": "https://i.imgur.com/Is5e4Ab.png", alt: 'Pictures', }),
            "title": '數據加載發生問題',
            "subtitle": '請過一段時間後再回來查看',
            display: 'CROPPED',
        }));
        conv.ask(new Suggestions('查看各個區域', '查看天氣十日報', '如何加入日常安排', '👋 掰掰'));
        conv.user.storage.direct = false;

    });
});

app.intent('查詢各縣市的天氣概況', (conv) => {

    word1 = county_array[parseInt(Math.random() * 21)];
    word2 = county_array[parseInt(Math.random() * 21)];
    var word3 = vacation_array[parseInt(Math.random() * 11)];
    conv.noInputs = ["請試著問我，" + word1 + "天氣如何?", "請試著問我要查詢的縣市", "很抱歉，我幫不上忙"];

    conv.contexts.set(SelectContexts.parameter, 5);
    conv.ask(new SimpleResponse({
        "speech": `<speak><p><s>點選下方選項或詢問我來查看指定縣市今明兩天的天氣報告</s><s>你可以試著問<break time="0.2s"/>${word1}天氣如何?</s></p></speak>`,
        "text": '點選下方縣市選項或開口詢問，\n來存取今明兩天的天氣報告!'
    }));

    conv.ask(new List({ items: county_list }));
    conv.ask(new Suggestions(word1 + '天氣如何?', '我想看' + word2, '如何加入日常安排'));
    conv.ask(new Suggestions('查看全台概況', '查看天氣十日報', '👋 掰掰'));
    conv.user.storage.direct = false;
    conv.user.storage.station = "全臺";

});


app.intent('縣市選擇結果', (conv, params, option) => {
    return new Promise(

        function(resolve, reject) {

            if (county_array.indexOf(option) !== -1) {

                getJSON('https://opendata.cwb.gov.tw/fileapi/v1/opendataapi/F-C0032-' + converter[option] + '?Authorization=CWB-D48B64A0-8BCB-497F-96E3-BD5EB63CF502&downloadType=WEB&format=JSON')
                    .then(function(response) {
                        resolve([response.cwbopendata.dataset.parameterSet.parameter, response.cwbopendata.dataset.datasetInfo.issueTime])
                    }).catch(function(error) {
                        var reason = new Error('資料獲取失敗');
                        reject(reason)
                    });
            } else { reject("無法辨識使用者所要求的查詢") }

        }).then(function(final_data) {

        var temp = reports.generator(final_data[0], option, conv.input.raw)

        conv.ask(new SimpleResponse({
            "speech": `<speak><p><s>以下是${option}的天氣報告<break time="1s"/>${temp[1]}</s></p></speak>`,
            "text": '下面是「' + option + '」的天氣概況'
        }));

        if (conv.screen) {

            conv.ask(new BasicCard({
                "title": option,
                "subtitle": temp[2],
                "text": temp[0] + "  \n  \n**發布時間** • " + ReportTime(final_data[1]),
                "buttons": new Button({ "title": "前往中央氣象局看詳細報告", "url": "https://www.cwb.gov.tw/V8/C/W/County/County.html?CID=" + links[option], }),
            }));

            conv.ask(new Suggestions('如何加入日常安排', '查看各個區域', '查看天氣十日報', '👋 掰掰'));
            conv.user.storage.station = option;

            if (conv.user.storage.direct !== false) { conv.expectUserResponse = false } //告知Google助理結束對話

        } else { conv.close(`<speak><p><s>下次有需要時，可以對我說<break time="0.5s"/>叫天氣小幫手查詢${option}的天氣<break time="0.5s"/>下次見</s></p></speak>`); }

    }).catch(function(error) {
        console.log(error)
        word1 = county_array[parseInt(Math.random() * 11)];
        word2 = county_array[11 + parseInt(Math.random() * 10)];

        if (conv.screen) {
            conv.ask(new SimpleResponse({
                "speech": `<speak><p><s>抱歉，發生一點小狀況</s><s>請試著問我<break time="0.2s"/>${word1}天氣如何?</s></p></speak>`,
                "text": '發生一點小狀況，請再試一次!',
            }));

            if (conv.screen) {
                var output = {
                    "title": "語音查詢範例",
                    "subtitle": "透過對話存取縣市報告",
                    "text": " • *「" + word1 + "天氣如何?」*  \n • *「幫我查詢" + word2 + "」*  \n • *「我想知道" + county_array[parseInt(Math.random() * 21)] + "怎樣」*  \n • *「幫我找" + county_array[parseInt(Math.random() * 21)] + "」*  \n • *「我想看" + county_array[parseInt(Math.random() * 21)] + "」*  \n • *「" + county_array[parseInt(Math.random() * 21)] + "天氣好嗎?」*  \n • *「我要查" + county_array[parseInt(Math.random() * 21)] + "」*"
                }
            } else {
                var output = {
                    "title": "發生一點狀況",
                }
            }
            conv.ask(new BasicCard({
                "title": "語音查詢範例",
                "subtitle": "透過對話存取縣市報告",
                "text": " • *「" + word1 + "天氣如何?」*  \n • *「幫我查詢" + word2 + "」*  \n • *「我想知道" + county_array[parseInt(Math.random() * 21)] + "怎樣」*  \n • *「幫我找" + county_array[parseInt(Math.random() * 21)] + "」*  \n • *「我想看" + county_array[parseInt(Math.random() * 21)] + "」*  \n • *「" + county_array[parseInt(Math.random() * 21)] + "天氣好嗎?」*  \n • *「我要查" + county_array[parseInt(Math.random() * 21)] + "」*",
            }));
            conv.ask(new Suggestions(word1 + '天氣如何?', '幫我查詢' + word2));
            conv.ask(new Suggestions('查看全台概況', '查看天氣十日報', '👋 掰掰'));

        } else {
            conv.ask(`<speak><p><s>抱歉，發生一點小狀況</s><s>請稍後再試</s></p></speak>`);
            conv.expectUserResponse = false;
        }

        if (conv.user.storage.direct !== false) { conv.expectUserResponse = false } //告知Google助理結束對話
    });
});


app.intent('預設罐頭回覆', (conv) => {
    word1 = county_array[parseInt(Math.random() * 11)];
    word2 = county_array[11 + parseInt(Math.random() * 10)];
    conv.noInputs = ["請試著問我，" + word1 + "天氣如何?", "請試著問我要查詢的縣市", "很抱歉，我幫不上忙"];

    if (conv.input.type === "VOICE") { //如果輸入是語音，則顯示錯誤處理方法
        conv.ask(new SimpleResponse({
            "speech": `<speak><p><s>抱歉，我不懂你的意思</s><s>請試著問我<break time="0.2s"/>${word1}天氣如何?<break time="0.2s"/>或<break time="0.2s"/>幫我查詢${word2}</s></p></speak>`,
            "text": '試著提問來快速存取縣市的天氣報告，\n或點選建議卡片來進行操作!'
        }));
        if (conv.screen) {
            conv.ask(new BasicCard({
                "title": "語音查詢範例",
                "subtitle": "以下是你可以嘗試的指令",
                "text": " • *「" + word1 + "天氣如何?」*  \n • *「幫我查詢" + word2 + "」*  \n • *「我想知道" + county_array[parseInt(Math.random() * 21)] + "怎樣」*  \n • *「幫我找" + county_array[parseInt(Math.random() * 21)] + "」*  \n • *「我想看" + county_array[parseInt(Math.random() * 21)] + "」*  \n • *「" + county_array[parseInt(Math.random() * 21)] + "天氣好嗎?」*  \n • *「我要查" + county_array[parseInt(Math.random() * 21)] + "」*",
            }));
            conv.ask(new Suggestions(word1 + '天氣如何?', '幫我查詢' + word2));
        } else {
            conv.ask(`<speak><p><s>或對我說<break time="0.2s"/>區域查詢<break time="0.2s"/>查看縣市的天氣報告</s></p></speak>`);
        }
        conv.noInputs = ["請試著問我，" + word1 + "天氣如何?", "請試著問我要查詢的縣市", "很抱歉，我幫不上忙"];

    } else {
        conv.ask('抱歉，我不懂你的意思，\n請點選建議卡片來進行操作。');
    }
    conv.ask(new Suggestions('查看全台概況', '查看天氣十日報', '如何加入日常安排', '👋 掰掰'));

});


app.intent('快速查詢縣市資訊', (conv, { county }) => {

    if (conv.input.raw.indexOf('新北') !== -1) { county = "新北市"; }

    return new Promise(

        function(resolve, reject) {

            if (county_array.indexOf(county) !== -1) {

                getJSON('https://opendata.cwb.gov.tw/fileapi/v1/opendataapi/F-C0032-' + converter[county] + '?Authorization=CWB-D48B64A0-8BCB-497F-96E3-BD5EB63CF502&downloadType=WEB&format=JSON')
                    .then(function(response) {
                        resolve([response.cwbopendata.dataset.parameterSet.parameter, response.cwbopendata.dataset.datasetInfo.issueTime])
                    }).catch(function(error) {
                        var reason = new Error('資料獲取失敗');
                        reject(reason)
                    });
            } else if (county === "全臺") {
                var fetch = new FetchStream("https://opendata.cwb.gov.tw/fileapi/opendata/MFC/F-C0032-031.FW50", { disableDecoding: true });

                fetch.on("data", function(chunk) { resolve(iconv.decode(chunk, 'BIG5')); });
            } else { reject("無法辨識使用者所要求的查詢") }

        }).then(function(final_data) {

        if (county_array.indexOf(county) !== -1) {

            var temp = reports.generator(final_data[0], county, conv.input.raw)

            conv.ask(new SimpleResponse({
                "speech": `<speak><p><s>以下是${county}的天氣報告<break time="1s"/>${temp[1]}</s></p></speak>`,
                "text": '下面是「' + county + '」的天氣概況'
            }));

            if (conv.screen) {

                conv.ask(new BasicCard({
                    "title": county,
                    "subtitle": temp[2],
                    "text": temp[0] + "  \n  \n**發布時間** • " + ReportTime(final_data[1]),
                    "buttons": new Button({ "title": "前往中央氣象局看詳細報告", "url": "https://www.cwb.gov.tw/V8/C/W/County/County.html?CID=" + links[county], }),
                }));

                conv.ask(new Suggestions('如何加入日常安排', '查看各個區域', '查看天氣十日報', '👋 掰掰'));
                conv.user.storage.station = county;

                if (conv.user.storage.direct !== false) { conv.expectUserResponse = false } //告知Google助理結束對話

            } else { conv.expectUserResponse = false }

        } else {

            var temp = main_reports.generator(final_data)

            conv.ask(new SimpleResponse({ "speech": `<speak><p><s>以下是中央氣象局，在${temp[0]}所發布的天氣概況。<break time="0.5s"/>${temp[1]}</s></p></speak>`, "text": '下面是來自氣象局的最新消息' }));

            if (conv.screen) {

                conv.ask(new BasicCard({
                    "title": '全台天氣概況',
                    "subtitle": temp[2],
                    "text": temp[3],
                    "buttons": new Button({ "title": "前往中央氣象局看詳細報告", "url": "https://www.cwb.gov.tw/V8/C/W/index.html", }),
                }));

                conv.ask(new Suggestions('查看各個區域', '查看天氣十日報', '👋 掰掰'));

                if (conv.user.storage.direct !== false) { conv.expectUserResponse = false } //告知Google助理結束對話

            } else { conv.expectUserResponse = false }
        }
    }).catch(function(error) {
        console.log(error)

        if (conv.screen) {

            if (conv.user.storage.direct === false) {
                word1 = county_array[parseInt(Math.random() * 11)];
                word2 = county_array[11 + parseInt(Math.random() * 10)];

                conv.ask(new SimpleResponse({
                    "speech": `<speak><p><s>抱歉，發生一點小狀況</s><s>請試著問我<break time="0.2s"/>${word1}天氣如何?</s></p></speak>`,
                    "text": '發生一點小狀況，請再試一次!',
                }));
                conv.ask(new Suggestions(word1 + '天氣如何?', '幫我查詢' + word2));
                conv.ask(new Suggestions('查看全台概況', '查看天氣十日報', '👋 掰掰'));

                var output = {
                    "title": "語音查詢範例",
                    "subtitle": "透過對話存取縣市報告",
                    "text": " • *「" + word1 + "天氣如何?」*  \n • *「幫我查詢" + word2 + "」*  \n • *「我想知道" + county_array[parseInt(Math.random() * 21)] + "怎樣」*  \n • *「幫我找" + county_array[parseInt(Math.random() * 21)] + "」*  \n • *「我想看" + county_array[parseInt(Math.random() * 21)] + "」*  \n • *「" + county_array[parseInt(Math.random() * 21)] + "天氣好嗎?」*  \n • *「我要查" + county_array[parseInt(Math.random() * 21)] + "」*",
                }
            } else {
                var output = {
                    "image": new Image({ "url": "https://i.imgur.com/Is5e4Ab.png", alt: 'Pictures', }),
                    "title": '數據加載發生問題',
                    "subtitle": '請過一段時間後再回來查看',
                    display: 'CROPPED',
                }
            }
            conv.ask(new BasicCard(output));

        } else {
            conv.ask(`<speak><p><s>抱歉，發生一點小狀況</s><s>請稍後再試</s></p></speak>`);
            conv.expectUserResponse = false;
        }

        if (conv.user.storage.direct !== false) { conv.expectUserResponse = false } //告知Google助理結束對話

    });
});


app.intent('全台天氣概要', (conv) => {

    return new Promise(

        function(resolve, reject) {

            var fetch = new FetchStream("https://opendata.cwb.gov.tw/fileapi/opendata/MFC/F-C0032-031.FW50", { disableDecoding: true });

            fetch.on("data", function(chunk) { resolve(iconv.decode(chunk, 'BIG5')); });

        }).then(function(final_data) {
        var temp = main_reports.generator(final_data)

        conv.ask(new SimpleResponse({ "speech": `<speak><p><s>以下是中央氣象局，在${temp[0]}所發布的天氣概況。<break time="0.5s"/>${temp[1]}</s></p></speak>`, "text": '下面是來自氣象局的最新消息' }));

        if (conv.screen) {

            conv.ask(new BasicCard({
                "title": '全台天氣概況',
                "subtitle": temp[2],
                "text": temp[3],
                "buttons": new Button({ "title": "前往中央氣象局看詳細報告", "url": "https://www.cwb.gov.tw/V8/C/W/index.html", }),
            }));

            conv.ask(new Suggestions('查看各個區域', '查看天氣十日報', '👋 掰掰'));

            if (conv.user.storage.direct !== false) { conv.expectUserResponse = false } //告知Google助理結束對話

        } else { conv.expectUserResponse = false }
    }).catch(function(error) {
        console.log(error)

        if (conv.screen) {

            if (conv.user.storage.direct === false) {
                word1 = county_array[parseInt(Math.random() * 11)];
                word2 = county_array[11 + parseInt(Math.random() * 10)];

                conv.ask(new SimpleResponse({
                    "speech": `<speak><p><s>抱歉，發生一點小狀況</s><s>請試著問我<break time="0.2s"/>${word1}天氣如何?</s></p></speak>`,
                    "text": '發生一點小狀況，請再試一次!',
                }));
                conv.ask(new Suggestions(word1 + '天氣如何?', '幫我查詢' + word2));
                conv.ask(new Suggestions('查看全台概況', '查看天氣十日報', '👋 掰掰'));

                var output = {
                    "title": "語音查詢範例",
                    "subtitle": "透過對話存取縣市報告",
                    "text": " • *「" + word1 + "天氣如何?」*  \n • *「幫我查詢" + word2 + "」*  \n • *「我想知道" + county_array[parseInt(Math.random() * 21)] + "怎樣」*  \n • *「幫我找" + county_array[parseInt(Math.random() * 21)] + "」*  \n • *「我想看" + county_array[parseInt(Math.random() * 21)] + "」*  \n • *「" + county_array[parseInt(Math.random() * 21)] + "天氣好嗎?」*  \n • *「我要查" + county_array[parseInt(Math.random() * 21)] + "」*"
                }
            } else {
                var output = {
                    "image": new Image({ "url": "https://i.imgur.com/Is5e4Ab.png", alt: 'Pictures', }),
                    "title": '數據加載發生問題',
                    "subtitle": '請過一段時間後再回來查看',
                    "display": 'CROPPED'
                }
            }
            conv.ask(new BasicCard(output));

        } else {
            conv.ask(`<speak><p><s>抱歉，發生一點小狀況</s><s>請稍後再試</s></p></speak>`);
            conv.expectUserResponse = false;
        }

        if (conv.user.storage.direct !== false) { conv.expectUserResponse = false } //告知Google助理結束對話
    });

});


app.intent('十日報資訊', (conv) => {

    return new Promise(

        function(resolve, reject) {

            request('https://www.cwb.gov.tw/Data/js/fcst/W51_Data.js?', function(err, response, body) {

                if (!err && response.statusCode == 200) {
                    var data = body.split('=')[1];
                    data = data.replace(/'/gi, '"');
                    data = JSON.parse(data).Content[0];
                    data = data.replace(/\s/gi, '');
                    data = data.replace(/[<]+[a-z]+[/>]/gm, "");
                    data = data.replace(/[>]/gm, "");
                    resolve(data.split('。'));
                } else { reject(err) }
            });
        }).then(function(final_data) {

        var output_content = "";
        var display_content = "";

        for (var i = 0; i < final_data.length - 1; i++) {

            if (final_data[i].indexOf('根據環保署') !== -1) { break; }

            var temp = reduceSIZE(final_data[i]);
            if (display_content.length > 0) { display_content = display_content + "  \n  \n"; }

            output_content = output_content + temp + '</s><break time="0.3s"/><s>';
            display_content = display_content + temp + "。";

        }

        output_content = output_content.replace(/[）]/mig, "\n");
        output_content = output_content.replace(/[（]\S+[\r\n]/g, "");

        conv.ask(new SimpleResponse({ "speech": `<speak><p><s>以下是中央氣象局，所發布的天氣10日報。<break time="0.5s"/>${output_content}</s></p></speak>`, "text": '下面是來自氣象局的最新消息' }));

        if (conv.screen) {

            conv.ask(new BasicCard({
                "title": '天氣10日報',
                "subtitle": getDay(1) + " ~ " + getDay(9),
                "text": display_content,
                "buttons": new Button({ "title": "前往中央氣象局看詳細報告", "url": "https://www.cwb.gov.tw/V8/C/W/index.html", }),
            }));

            conv.ask(new Suggestions('查看各個區域', '查看全台概況', '👋 掰掰'));

            if (conv.user.storage.direct !== false) { conv.expectUserResponse = false } //告知Google助理結束對話

        } else { conv.expectUserResponse = false }

    }).catch(function(error) {
        console.log(error)

        if (conv.screen) {

            if (conv.user.storage.direct === false) {
                word1 = county_array[parseInt(Math.random() * 11)];
                word2 = county_array[11 + parseInt(Math.random() * 10)];

                conv.ask(new SimpleResponse({
                    "speech": `<speak><p><s>抱歉，發生一點小狀況</s><s>請試著問我<break time="0.2s"/>${word1}天氣如何?</s></p></speak>`,
                    "text": '發生一點小狀況，請再試一次!',
                }));
                conv.ask(new Suggestions(word1 + '天氣如何?', '幫我查詢' + word2));
                conv.ask(new Suggestions('查看全台概況', '查看天氣十日報', '👋 掰掰'));

                var output = {
                    "title": "語音查詢範例",
                    "subtitle": "透過對話存取縣市報告",
                    "text": " • *「" + word1 + "天氣如何?」*  \n • *「幫我查詢" + word2 + "」*  \n • *「我想知道" + county_array[parseInt(Math.random() * 21)] + "怎樣」*  \n • *「幫我找" + county_array[parseInt(Math.random() * 21)] + "」*  \n • *「我想看" + county_array[parseInt(Math.random() * 21)] + "」*  \n • *「" + county_array[parseInt(Math.random() * 21)] + "天氣好嗎?」*  \n • *「我要查" + county_array[parseInt(Math.random() * 21)] + "」*"
                };
            } else {
                var output = {
                    "image": new Image({ "url": "https://i.imgur.com/Is5e4Ab.png", alt: 'Pictures', }),
                    "title": '數據加載發生問題',
                    "subtitle": '請過一段時間後再回來查看',
                    display: 'CROPPED'
                };

                conv.expectUserResponse = false;
            }

            conv.ask(new BasicCard(output));

        } else {
            conv.ask(`<speak><p><s>抱歉，發生一點小狀況</s><s>請稍後再試</s></p></speak>`);
            conv.expectUserResponse = false;
        }

        if (conv.user.storage.direct !== false) { conv.expectUserResponse = false } //告知Google助理結束對話
    });

});


app.intent('加入日常安排', (conv) => {

    var choose_station = conv.user.storage.station;

    conv.ask(new SimpleResponse({
        "speech": `<speak><p><s>透過加入日常安排，你可以快速存取所需縣市之預報資訊。</s><s>舉例來說，如果你把${choose_station}加入日常安排。你即可隨時呼叫我查詢該縣市的最新天氣報告!</s><s>以下為詳細說明</s></p></speak>`,
        "text": '以下為詳細說明，請查照'
    }));

    conv.ask(new BasicCard({
        "title": '將「' + choose_station + '」的天氣報告加入日常安排',
        display: 'CROPPED',
        "subtitle": '1.點擊畫面右上方大頭貼 > 點擊[設定]\n2.切換到[Google助理]分頁 > 點擊[日常安排]\n3.點擊[新增日常安排]\n4.「新增指令(必填)」輸入「天氣報告」\n5.「新增動作」輸入\n「叫天氣小精靈查詢' + choose_station + '」\n6.輸入完成後點擊「儲存」\n7.現在，你可以透過說出或輸入「天氣報告」來快速查詢' + choose_station + '的天氣報告!',
    }));

    conv.ask(new Suggestions('查看' + choose_station + '的天氣概況'));
    conv.ask(new Suggestions('查看全台概況', '查看天氣十日報', '👋 掰掰'));

});


app.intent('結束對話', (conv) => {
    conv.user.storage = {}; //離開同時清除暫存資料
    conv.ask('希望能幫上一點忙!');
    conv.ask(new SimpleResponse({ "speech": '下次見', "text": '下次見 👋', }));
    conv.close(new BasicCard({
        "title": '感謝您的使用!',
        "text": '如果有任何需要改進的地方，  \n歡迎到簡介頁面評分或給予反饋，謝謝!',
        "buttons": new Button({ "title": '開啟本程式的商店頁面', "url": 'https://assistant.google.com/services/a/uid/000000971a4ed57e', }),
    }));
});


// Set the DialogflowApp object to handle the HTTPS POST request.
exports.tw_weather_helper = functions.https.onRequest(app);