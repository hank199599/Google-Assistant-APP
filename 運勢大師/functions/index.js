'use strict';

// Import the Dialogflow module from the Actions on Google client library.
const {
    dialogflow,
    Permission,
    Suggestions,
    SimpleResponse,
    Button,
    Image,
    List,
    BasicCard,
    Carousel,
    Table
} = require('actions-on-google');

// Import the firebase-functions package for deployment.
const functions = require('firebase-functions');
const replaceString = require('replace-string');
const i18n = require('i18n');

var admin = require("firebase-admin");
var data_geter = require("./fetch.js");
var translator = require('./translator.js'); //用於翻譯文字為廣東話形式的函式
const app = dialogflow({ debug: true });

var admin = require("firebase-admin");
var serviceAccount = require("./config/hank199599-firebase-adminsdk-fc9jb-2c7a58cc61.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://hank199599.firebaseio.com"
});

i18n.configure({
    locales: ['zh-TW', 'zh-HK'],
    directory: __dirname + '/locales',
    defaultLocale: 'zh-TW',
});
app.middleware((conv) => {
    i18n.setLocale(conv.user.locale);
});


const database = admin.database();
var astro_changer = require("./astro.json");
var astro_list = {};
var i = 0;
var day = 0;
var astro_array = [];
var astro_array_tw = ["水瓶座", "雙魚座", "牡羊座", "金牛座", "雙子座", "巨蟹座", "獅子座", "處女座", "天秤座", "天蠍座", "射手座", "摩羯座"];
var astro_array_hk = ["水瓶座", "雙魚座", "白羊座", "金牛座", "雙子座", "巨蟹座", "獅子座", "處女座", "天秤座", "天蠍座", "人馬座", "山羊座"];
var astro_en = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"];
var weekdays = ["日", "一", "二", "三", "四", "五", "六"];
var day_array = [];
var day = "";
var selecter = "";

function getDay(num) {
    var today = new Date();
    var nowTime = today.getTime() + 8 * 3600 * 1000;
    var ms = 24 * 3600 * 1000 * num;
    today.setTime(parseInt(nowTime + ms));
    var oMoth = (today.getMonth() + 1).toString();
    var oDay = today.getDate().toString();
    var oWeek = weekdays[today.getDay()];
    return oMoth + '月' + oDay + '日 (' + oWeek + ')';
}

async function getAstroData() {
    var time = new Date();
    var nowTime = time.getTime() + 8 * 3600 * 1000;
    time.setTime(parseInt(nowTime));
    var hour_now = time.getHours();
    var minute_now = time.getMinutes();

    if (hour_now === 0 & minute_now < 15) {
        //if (minute_now < 59) {

        Promise.all([data_geter.getAstroData(0), data_geter.getAstroData(1), data_geter.getAstroData(2)])
            .then(function(data) {

                for (var num = 0; num < 3; num++) {
                    var output = {};
                    var temp = data[num];

                    if (Object.keys(temp).length > 0) {

                        for (var j = 0; j < temp.length; j++) {
                            output[astro_en[j]] = temp[j];
                        }

                        var updates = {};
                        if (Object.keys(output).length > 0) {
                            updates[num] = output;
                            //console.log(["今天", "明天", "後天"][num])
                            //console.log(updates)
                            database.ref('/Astro').update(updates);
                        }
                    }

                }
            })
    } else if (hour_now === 0) {
        //進行資料測試，如果檢測不到則重新拉取資料

        new Promise(
            function(resolve) {
                // indexer = num.toString();
                database.ref('/Astro').on('value', e => { resolve(e.val()) });
            }).then(function(test_data) {

            for (var num = 0; num <= 2; num++) {
                console.log(["今天", "明天", "後天"][num])
                if (test_data[num] !== undefined) {
                    console.log("運勢資料檢測正常")
                } else {
                    console.log("發現遺失的運勢資料")
                    var index = num;

                    data_geter.getAstroData(index).then(function(data) {
                        var output = {};

                        if (Object.keys(data).length > 0) {
                            for (var j = 0; j < data.length; j++) {
                                output[astro_en[j]] = data[j];
                            }

                            var updates = {};
                            if (Object.keys(output).length > 0) {
                                updates[index] = output;
                                // console.log(["今天", "明天", "後天"][num])
                                console.log(updates)
                                database.ref('/Astro').update(updates);
                            }
                        }
                    })
                }
            }
        });
    }
}

function list_generator(input) {

    var output = {};

    if (input === "zh-TW") {
        astro_array = astro_array_tw;
        astro_list = require("./astro_list_tw.json");
    } else {
        astro_array = astro_array_hk;
        astro_list = require("./astro_list_hk.json");
    }

    for (i = 0; i < astro_array.length; i++) {
        output[astro_array[i]] = {
            synonyms: astro_list[astro_array[i]].synonyms,
            title: astro_array[i],
            description: astro_list[astro_array[i]].description,
            image: new Image({
                url: 'https://firebasestorage.googleapis.com/v0/b/hank199599.appspot.com/o/' + astro_array_tw[i].replace(/[\座|]/g, "") + '.png?alt=media',
                alt: astro_array[i],
            }),
        }
    }
    return output
}


app.intent('預設歡迎畫面', (conv) => {

    if (conv.user.locale === "zh-TW") { astro_array = astro_array_tw; } else { astro_array = astro_array_hk; }

    if (conv.user.last.seen) {
        if (conv.screen) {
            conv.ask(new SimpleResponse({
                speech: `<speak><par><media xml:id="quote" begin="4s" soundLevel="+3dB"><speak><p><s><emphasis level="moderate">${i18n.__('seen1')}<break time="0.2s"/>${i18n.__('seen2')}</emphasis></s></p></speak></media><media xml:id="sound" repeatCount="1" soundLevel="-2dB"><audio src="https://firebasestorage.googleapis.com/v0/b/hank199599.appspot.com/o/cut1.mp3?alt=media"/></media></par></speak>`,
                text: i18n.__('seen1')
            }));
        } else {
            conv.ask(new SimpleResponse(`<speak><par><media xml:id="quote" begin="4s" soundLevel="+3dB"><speak><p><s><emphasis level="moderate">${i18n.__('seen1')}<break time="0.2s"/>${i18n.__('seen2')}</emphasis></s></p></speak></media><media xml:id="sound" repeatCount="1" soundLevel="-2dB"><audio src="https://firebasestorage.googleapis.com/v0/b/hank199599.appspot.com/o/cut1.mp3?alt=media"/></media></par></speak>`));
            conv.noInputs = [i18n.__('no_input1', astro_array[parseInt(Math.random() * 11)]), i18n.__('no_input2'), i18n.__('no_input3')];
        }
    } else {
        conv.ask(new SimpleResponse({
            speech: `<speak><par><media xml:id="quote" begin="4s" soundLevel="+3dB"><speak><p><s><emphasis level="moderate">歡迎<break time="0.2s"/>${i18n.__('seen1')}<break time="0.2s"/>${i18n.__('seen2')}</emphasis></s></p></speak></media><media xml:id="sound" repeatCount="1" soundLevel="-2dB"><audio src="https://firebasestorage.googleapis.com/v0/b/hank199599.appspot.com/o/cut1.mp3?alt=media"/></media></par></speak>`,
            text: i18n.__('welcome1')
        }));
    }

    conv.ask(new List({ items: list_generator(conv.user.locale), }));

    //console.log(list_generator())
    if (conv.screen) {
        conv.ask(new Suggestions('👋 掰掰'));
        conv.user.storage.direct = false;
    }
    getAstroData() //執行函式去抓資料

});


app.intent('查看選擇的星座', (conv, input, option) => {

    if (conv.user.locale === "zh-TW") {
        astro_array = astro_array_tw;
        conv.user.storage.day = "今天";
    } else {
        astro_array = astro_array_hk;
        conv.user.storage.day = "今日";
    }

    if (astro_array.indexOf(option) !== -1) {
        return new Promise(
            function(resolve) {
                database.ref('/Astro').on('value', e => { resolve(e.val()['0'][astro_changer[option]]) });
            }).then(function(bypass) {

            if (conv.user.locale === "zh-HK") {

                var input1 = translator.input(bypass.all_content);
                var input2 = translator.input(bypass.short_content);

                return Promise.all([input1, input2]).then(function(data) {
                    bypass.all_content = data[0];
                    bypass.short_content = data[1];
                    return bypass
                })
            } else {
                return bypass
            }

        }).then(function(final_data) {

            var content = final_data.all_content;
            var short_content = final_data.short_content;

            var output_content = content.replace(/[。\；]/gi, "</s><s>")

            conv.ask(new SimpleResponse({
                speech: `<speak><par><media xml:id="quote" begin="4s" soundLevel="+3dB"><speak><p><s>${option}的你在今天<break time="0.3s"/>${short_content}<break time="0.5s"/>整體運勢而言<break time="0.2s"/>${output_content}</s></p></speak></media><media xml:id="sound" repeatCount="2" soundLevel="-2dB"><audio src="https://firebasestorage.googleapis.com/v0/b/hank199599.appspot.com/o/cut2.mp3?alt=media"/></media></par></speak>`,
                text: i18n.__('fortune_text', option)
            }));
            if (conv.screen) {
                conv.ask(new BasicCard({
                    title: option + ' • ' + getDay(0),
                    subtitle: short_content + '\n整體運：' + final_data.all_value + '\n愛情運：' + final_data.love_value + '\n事業運：' + final_data.career_value + '\n財　運：' + final_data.fortune_value,
                    text: "**整體運勢**  \n" + content + '  \n  \n ' + i18n.__('copyright'),
                    buttons: new Button({ title: i18n.__('url_title'), url: final_data.url, display: 'CROPPED', }),
                }));

                conv.ask(new Suggestions('加入日常安排'));

                if (conv.user.locale === "zh-TW") { conv.ask(new Suggestions('明天呢?', '後天呢?', )); } else { conv.ask(new Suggestions('聽日呢?', '後日呢?', )); }

                conv.ask(new Suggestions(i18n.__('search_astro'), '👋 掰掰'));

                conv.user.storage.astro = option;
            } else { conv.close('感謝你的使用，' + option); }

        }).catch(function(error) {
            console.log(error)
            const hasWebBrowser = conv.surface.capabilities.has('actions.capability.WEB_BROWSER');
            conv.close(new SimpleResponse(i18n.__('error')));
            if (hasWebBrowser) {
                conv.close(new BasicCard({ image: new Image({ url: "https://i.imgur.com/JYHmER9.png", alt: 'Pictures', }), }));
            }
        });
    } else {

        conv.ask(new SimpleResponse({
            speech: `<speak><p><s>${i18n.__('confuse_1')}</s></p></speak>`,
            text: i18n.__('confuse_2')
        }));

        conv.ask(new List({
            items: list_generator(conv.user.locale),
        }));

        conv.ask(new Suggestions('👋 掰掰'));
    }
});

app.intent('直接查看星座', (conv, { day_select, sign }) => {

    if (conv.user.locale === "zh-TW") {
        if (conv.user.storage.day === undefined) { conv.user.storage.day = "今天"; }
        day_array = ["今天", "明天", "後天"];
        astro_array = astro_array_tw;
    } else {
        if (conv.user.storage.day === undefined) { conv.user.storage.day = "今日"; }
        day_array = ["今日", "聽日", "後日"];
        astro_array = astro_array_hk;
    }

    if (conv.user.storage.astro !== undefined && sign.length === 0) { sign = conv.user.storage.astro; }
    if (conv.user.storage.day !== undefined && day_select.length === 0) { day_select = conv.user.storage.day; }

    for (i = 0; i < day_array.length; i++) {
        if (day_select === day_array[i]) {
            day = getDay(i);
            selecter = i;
        }
    }

    //生成建議卡片
    conv.ask(new Suggestions('加入日常安排'));
    for (i = 0; i < day_array.length; i++) { if (day_array[i] !== day_select) { conv.ask(new Suggestions(day_array[i] + '呢?')); } }
    conv.ask(new Suggestions(i18n.__('search_astro'), '👋 掰掰'));


    if (astro_array.indexOf(sign) !== -1) {
        return new Promise(
            function(resolve) {
                database.ref('/Astro').on('value', e => { resolve(e.val()[selecter][astro_changer[sign]]) });
            }).then(function(bypass) {

            if (conv.user.locale === "zh-HK") {
                var input1 = translator.input(bypass.all_content);
                var input2 = translator.input(bypass.short_content);

                return Promise.all([input1, input2]).then(function(data) {
                    bypass.all_content = data[0];
                    bypass.short_content = data[1];
                    return bypass
                })
            } else {
                return bypass
            }

        }).then(function(final_data) {

            var content = final_data.all_content;
            var short_content = final_data.short_content;
            var output_content = content.replace(/[。\；]/gi, "</s><s>")

            conv.ask(new SimpleResponse({
                speech: `<speak><par><media xml:id="quote" begin="4s" soundLevel="+3dB"><speak><p><s>${sign}的你在${day_select}<break time="0.3s"/>${short_content}<break time="0.5s"/>整體運勢而言<break time="0.2s"/>${output_content}</s></p></speak></media><media xml:id="sound" repeatCount="2" soundLevel="-2dB"><audio src="https://firebasestorage.googleapis.com/v0/b/hank199599.appspot.com/o/cut2.mp3?alt=media"/></media></par></speak>`,
                text: i18n.__('fortune_text_select', sign, day_select)
            }));

            conv.ask(new BasicCard({
                title: sign + ' • ' + day,
                subtitle: short_content + '\n整體運：' + final_data.all_value + '\n愛情運：' + final_data.love_value + '\n事業運：' + final_data.career_value + '\n財　運：' + final_data.fortune_value,
                text: "**整體運勢**  \n" + content + '  \n  \n ' + i18n.__('copyright'),
                buttons: new Button({ title: i18n.__('url_title'), url: final_data.url, display: 'CROPPED', }),
            }));

            if (conv.user.storage.direct !== false) { conv.expectUserResponse = false } //告知Google助理結束對話
            else {
                conv.user.storage.astro = sign;
                conv.user.storage.day = day_select;
            }

            if (!conv.screen) { conv.expectUserResponse = false } //告知Google助理結束對話

        }).catch(function(error) {
            console.log(error)
            const hasWebBrowser = conv.surface.capabilities.has('actions.capability.WEB_BROWSER');
            conv.close(new SimpleResponse(i18n.__('error')));
            if (hasWebBrowser) {
                conv.close(new BasicCard({ image: new Image({ url: "https://i.imgur.com/JYHmER9.png", alt: 'Pictures', }), }));
            }
        });
    } else {

        if (conv.user.locale === "zh-TW") { astro_array = astro_array_tw; } else { astro_array = astro_array_hk; }

        var word1 = astro_array[parseInt(Math.random() * 11)];
        var day1 = day_array[parseInt(Math.random() * 2)];
        var word2 = astro_array[parseInt(Math.random() * 11)];
        var day2 = day_array[parseInt(Math.random() * 2)];
        conv.ask(new SimpleResponse({
            speech: `<speak><p><s>${i18n.__('error_output_1')}</s><s>${i18n.__('error_output_2')}<break time="0.2s"/>${i18n.__('error_output_3', word1, day1)}<break time="0.2s"/>或<break time="0.2s"/>${i18n.__('error_output_4', word2)}</s></p></speak>`,
            text: i18n.__('error_output_1')
        }));

        conv.ask(new BasicCard({
            title: "語音查詢範例",
            subtitle: i18n.__('example'),
            text: i18n.__('ex_list', word1, day1, word2, astro_array[parseInt(Math.random() * 11)], astro_array[parseInt(Math.random() * 11)], astro_array[parseInt(Math.random() * 11)], day_array[parseInt(Math.random() * 2)], astro_array[parseInt(Math.random() * 11)], astro_array[parseInt(Math.random() * 11)]),
        }));
        conv.ask(new Suggestions(i18n.__('ex_1', word1, day1), i18n.__('ex_2', word2)));
        conv.ask(new Suggestions(i18n.__('search_astro'), '👋 掰掰'));


        if (conv.user.storage.day === undefined) {
            if (conv.user.locale === "zh-TW") { conv.user.storage.day = "今天"; } else { conv.user.storage.day = "今日"; }
        }

        if (conv.user.storage.direct !== false) {
            conv.expectUserResponse = false; //告知Google助理結束對話
            conv.user.storage = {};
        }
    }
});

app.intent('Default Fallback Intent', (conv) => {

    if (conv.user.locale === "zh-TW") {
        day_array = ["今天", "明天", "後天"];
        astro_array = astro_array_tw;
    } else {
        astro_array = astro_array_hk;
        day_array = ["今日", "聽日", "後日"];
    }

    var word1 = astro_array[parseInt(Math.random() * 11)];
    var day1 = day_array[parseInt(Math.random() * 2)];
    var word2 = astro_array[parseInt(Math.random() * 11)];
    var day2 = day_array[parseInt(Math.random() * 2)];

    if (conv.input.type === "VOICE") { //如果輸入是語音，則顯示錯誤處理方法
        conv.ask(new SimpleResponse({
            speech: `<speak><p><s>${i18n.__('error_output_5')}</s><s>${i18n.__('error_output_2')}<break time="0.2s"/>${i18n.__('error_output_3', word1, day1)}<break time="0.2s"/>或<break time="0.2s"/>${i18n.__('error_output_4', word2)}</s></p></speak>`,
            text: i18n.__('error_output_6')
        }));
        if (conv.screen) {
            conv.ask(new BasicCard({
                title: "語音查詢範例",
                subtitle: i18n.__('example'),
                text: i18n.__('ex_list', word1, day1, word2, astro_array[parseInt(Math.random() * 11)], astro_array[parseInt(Math.random() * 11)], astro_array[parseInt(Math.random() * 11)], day_array[parseInt(Math.random() * 2)], astro_array[parseInt(Math.random() * 11)], astro_array[parseInt(Math.random() * 11)]),
            }));
            conv.ask(new Suggestions(i18n.__('ex_1', word1, day1), i18n.__('ex_2', word2)));
        }

        conv.noInputs = [`<speak><p><s>請試著再問一次</s><s>例如<break time="0.2s"/>${word1}${day1}的星座運勢?</s></p></speak>`, "請試著問我要查詢的星座", "很抱歉，我幫不上忙"];

    } else {
        conv.ask(i18n.__('error_touch'));
    }
    conv.ask(new Suggestions(i18n.__('search_astro'), '👋 掰掰'));

});

app.intent('日常安排教學', (conv) => {

    if (conv.user.locale === "zh-TW") { astro_array = astro_array_tw; } else { astro_array = astro_array_hk; }


    if (conv.user.storage.astro === undefined) { var astro = astro_array[parseInt(Math.random() * 11)] } else { var astro = conv.user.storage.astro }

    conv.ask(new SimpleResponse({
        speech: `<speak><p><s>透過加入日常安排，你可以快速存取要查詢的星座運勢。</s><s>舉例來說，如果你把${astro}加入日常安排。你即可隨時呼叫我查詢${astro}的星座運勢!</s><s>以下為詳細說明</s></p></speak>`,
        text: '以下為詳細說明'
    }));

    conv.ask(new BasicCard({
        title: '將「' + astro + '」加入日常安排',
        subtitle: '1.點擊畫面右上方大頭貼 > 點擊[設定]\n2.切換到[Google助理]分頁 > 點擊[日常安排]\n3.點擊[新增日常安排]\n4.「新增指令(必填)」輸入「今日運勢」\n5.「新增動作」輸入\n「' + i18n.__('daily_routine', astro) + '」 \n6.輸入完成後點擊「儲存」\n7.現在，你可以透過說出或輸入「今日運勢」來快速查詢' + astro + '的今日運勢!',
    }));

    conv.ask(new Suggestions(i18n.__('daily_routine', astro), i18n.__('search_astro'), '👋 掰掰'));

});

app.intent('結束對話', (conv) => {
    if (conv.user.storage.astro === undefined) { conv.user.storage.astro = "下次見"; }

    conv.ask(i18n.__('EndTitle') + '，' + conv.user.storage.astro);

    conv.close(new BasicCard({
        title: i18n.__('EndTitle') + '!',
        text: i18n.__('EndText'),
        buttons: new Button({ title: i18n.__('EndButton'), url: 'https://assistant.google.com/services/a/uid/00000084fd2effe4', }),
    }));

    conv.user.storage = {}; //離開同時清除暫存資料

});

// Set the DialogflowApp object to handle the HTTPS POST request.
exports.daily_astro = functions.https.onRequest(app);