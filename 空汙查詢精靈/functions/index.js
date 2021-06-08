'use strict';

// Import the Dialogflow module from the Actions on Google client library.
const {
    dialogflow,
    Permission,
    Suggestions,
    SimpleResponse,
    Button,
    Image,
    BasicCard,
    Carousel,
    Table
} = require('actions-on-google');

// Import the firebase-functions package for deployment.
const functions = require('firebase-functions');
var getJSON = require('get-json')
const replaceString = require('replace-string');
const findNearestLocation = require('map-nearest-location');
const app = dialogflow({ debug: true });
const admin = require('firebase-admin');
var request = require('request'),
    cheerio = require('cheerio');
var option_list = require("./option.json");
var keyword_list = require("./keywords.json");
var suggest_list = require("./suggest.json");
var explain_list = require("./explain.json");
var county_options = require("./county_list.json");
let serviceAccount = require("./config/b1a2b-krmfch-firebase-adminsdk-1tgdm-7347f3fed7.json");
var functions_fetch = require("./fetch.js");
var options_county = require("./options_county.json");
var arranger = require('./mobile_arrangement');
var pollutant_dict = require('./Pollutant.json')
''

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://b1a2b-krmfch.firebaseio.com/"
});

const database = admin.database();

var station_array = ['冬山', '宜蘭', '花蓮', '臺東', '關山', '金門', '馬祖', '馬公', '士林', '大同', '中山', '古亭', '松山', '陽明', '萬華', '三重', '土城', '永和', '汐止', '板橋', '林口', '淡水', '富貴角', '菜寮', '新店', '新莊', '萬里', '大園', '中壢', '平鎮', '桃園', '龍潭', '觀音', '新竹', '竹東', '湖口', '三義', '苗栗', '頭份', '大里', '西屯', '沙鹿', '忠明', '豐原', '二林', '彰化', '線西', '竹山', '南投', '埔里', '斗六', '崙背', '麥寮', '臺西', '嘉義', '朴子', '新港', '安南', '善化', '新營', '臺南', '美濃', '橋頭', '楠梓', '仁武', '左營', '前金', '鳳山', '復興', '前鎮', '小港', '大寮', '林園', '屏東', '恆春', '潮州', '冬山', '宜蘭', '臺東', '關山'];
var request_array = ["宜蘭縣", "臺東縣", "臺北市", "新北市第一部分", "新北市第二部分", "桃園市", "新竹縣市", "苗栗縣", "臺中市", "彰化縣", "南投縣", "雲林縣", "嘉義縣市", "臺南市", "北高雄", "南高雄", "屏東縣"];
var county_array = ["南投縣", "連江縣", "馬祖", "南投", "雲林縣", "雲林", "金門縣", "金門", "苗栗縣", "苗栗", "高雄市", "高雄", "嘉義市", "花蓮縣", "花蓮", "嘉義縣", "台東縣", "臺東縣", "台東", "臺東", "嘉義", "基隆市", "台北市", "台南市", "臺南市", "台南", "臺南", "臺北市", "台北", "臺北", "基隆", "宜蘭縣", "台中市", "臺中市", "台中", "澎湖縣", "澎湖", "桃園市", "桃園", "新竹縣", "新竹市", "新竹", "新北市", "新北", "宜蘭", "屏東縣", "屏東", "彰化縣", "彰化"];

var day_array = ["今天", "明天", "後天"];
var key_array = Object.keys(keyword_list);
var area_array = ["北部", "竹苗", "中部", "雲嘉南", "高屏", "宜蘭", "花東", "馬祖", "金門", "澎湖"];
var eicon = ["🌍 ", "🌎 ", "🌏 "];

const SelectContexts = { parameter: 'select' };
const AppContexts = { LOCATION: 'sendback_premission' };

app.intent('預設歡迎語句', (conv) => {

    return new Promise(
        function(resolve, reject) {
            database.ref('/TWair').on('value', e => {
                resolve(e.val().report)
            });
        }).then(function(report_output) {

        conv.ask(new Suggestions(eicon[parseInt(Math.random() * 2)] + '最近的測站', '🔎依區域查詢'));

        for (var i = 0; i < key_array.length; i++) {
            if (report_output.indexOf(key_array[i]) !== -1) { conv.ask(new Suggestions(keyword_list[key_array[i]])); }
        }

        if (conv.screen) {

            if (conv.user.last.seen) {
                conv.ask(new SimpleResponse({
                    speech: `<speak><p><s>現在的空氣品質概要如下<break time="0.2s"/>，${report_output.replace(/[(]+[\d]+[)]/gm, "")}</s></p></speak>`,
                    text: '以下是現在的空氣品質摘要'
                }));
            } else {
                conv.ask(new SimpleResponse({
                    speech: `<speak><p><s>歡迎使用空汙查詢精靈!</s><s>我能提供環保署的監測站查詢服務，此外，你能將我加入日常安排快速查詢所需站點。</s><s>接下來，是目前的空氣概況<break time="0.5s"/>${report_output.replace(/[(]+[\d]+[)]/gm, "")}</s></p></speak>`,
                    text: '歡迎使用!'
                }));
            }
            conv.ask(new BasicCard({
                title: "全台空氣品質概要 \n",
                subtitle: report_output,
                text: "測站資訊發布時間 • " + functions_fetch.FormatTime(),
                buttons: new Button({ title: '行政院環境保護署', url: 'https://airtw.epa.gov.tw/CHT/default.aspx', display: 'CROPPED', }),
            }));

            conv.ask(new Suggestions('今天的數值預報', '如何加入日常安排', '👋 掰掰'));

        } else {
            var word1 = county_array[parseInt(Math.random() * 19)];
            var word2 = county_array[20 + parseInt(Math.random() * 28)];
            conv.ask(`<speak><p><s>空氣品質概要如下</s><s>${report_output.replace(/[(]+[\d]+[)]/gm, "")}</s></p></speak>`);
            conv.ask(`<speak><p><s>接著，試著問我要查看的縣市!</s><s>例如<break time="0.2s"/>${word1}空氣品質如何?<break time="0.2s"/>或<break time="0.2s"/>幫我找${word2}</s></p></speak>`);
            conv.noInputs = ["抱歉，我沒聽輕楚。請再問一次", "請試著問我要查詢的縣市列表，例如、" + word1 + "空氣品質如何?", "很抱歉，我幫不上忙"];

        }

    }).catch(function(error) {

        console.log(error)
        conv.noInputs = ["抱歉，我沒聽輕楚。請再問一次", "請試著問我要查詢的縣市列表，例如、" + word1 + "空氣品質如何?", "很抱歉，我幫不上忙"];

        conv.ask(new SimpleResponse({
            speech: `<speak><p><s>歡迎使用空汙查詢精靈!</s><s>我能提供環保署的監測站查詢服務。請選擇你要使用的服務</s></p></speak>`,
            text: '歡迎使用!'
        }));

        if (conv.screen) {
            conv.ask(new BasicCard({
                image: new Image({ url: 'https://raw.githubusercontent.com/hank199599/Google-Assistant-APP/master/%E7%A9%BA%E6%B1%99%E6%9F%A5%E8%A9%A2%E7%B2%BE%E9%9D%88/assets/DOvpvIe.jpg ', alt: 'Pictures', }),
                title: "查詢方式",
                subtitle: " • 定位查詢 \n • 區域查詢\n • 直接查看特定站點資訊",
                buttons: new Button({ title: '行政院環境保護署', url: 'https://airtw.epa.gov.tw/CHT/default.aspx', display: 'CROPPED', }),
            }));

            conv.ask(new Suggestions(eicon[parseInt(Math.random() * 2)] + '最近的測站', '🔎依區域查詢', '如何加入日常安排', '👋 掰掰'));

        } else {
            conv.ask(`<speak><p><s>試著問我要查看的縣市!</s><s>例如<break time="0.2s"/>${county_array[parseInt(Math.random() * 19)]}空氣品質如何?<break time="0.2s"/>或<break time="0.2s"/>幫我找${county_array[20 + parseInt(Math.random() * 28)]}</s></p></speak>`);
        }
    });

});

app.intent('依區域查詢', (conv) => {

    if (conv.screen) {
        conv.ask('請輕觸下方卡片來選擇查詢區域');
    } else {
        conv.ask(`<speak><p><s>請選擇要查詢的區域!</s><s>選項有以下幾個<break time="0.5s"/>北部地區<break time="0.2s"/>中部地區<break time="0.2s"/>南部地區<break time="0.2s"/>東部地區<break time="0.2s"/>離島地區<break time="1s"/>請選擇。</s></p></speak>`);
    }
    conv.contexts.set(SelectContexts.parameter, 5);
    conv.ask(new Carousel({
        title: 'Carousel Title',
        items: county_options,
    }));
    conv.ask(new Suggestions(eicon[parseInt(Math.random() * 2)] + '最近的測站', '語音查詢範例', '今天的數值預報', '風向對空污的影響', '污染物影響要素', '👋 掰掰'));

});

app.intent('縣市查詢結果', (conv, input, option) => {

    return new Promise(
        function(resolve, reject) {
            database.ref('/TWair').on('value', e => { resolve(e.val()); });
        }).then(function(final_data) {

        var download_data = final_data.data;
        var station_array = Object.keys(final_data.data);

        if (conv.input.raw.indexOf('最近') !== -1 || conv.input.raw.indexOf('附近') !== -1) { option = "🌎 最近的測站"; } else if (conv.input.raw.indexOf('台東') !== -1 || conv.input.raw.indexOf('臺東') !== -1) { option = "臺東"; }


        if (["北部地區", "中部地區", "南部地區", "東部地區", "離島地區", "行動測站"].indexOf(option) !== -1) {

            if (option !== "行動測站") {
                if (conv.screen) {
                    conv.ask(new SimpleResponse({
                        speech: `<speak><p><s>以下是${option}的對應選項<break time="0.5s"/>請查看</s></p></speak>`,
                        text: '以下是「' + option + '」對應的選項'
                    }));
                } else { conv.ask(new SimpleResponse(`<speak><p><s>請選擇${option}對應的選項!</s><s>選項有以下幾個<break time="0.5s"/>${option_list[option]}<break time="1s"/>請選擇。</s></p></speak>`)); }
            }

            conv.contexts.set(SelectContexts.parameter, 5);

            if (["北部地區", "中部地區", "南部地區"].indexOf(option) !== -1) {
                conv.ask(new Carousel({ items: options_county[option] }));
            } else if (["東部地區", "離島地區"].indexOf(option) !== -1) {

                var the_array = option_list[option].split('、');
                var county_list = {};

                for (var i = 0; i < the_array.length; i++) {
                    var aqi_temp = download_data[the_array[i]].AQI;
                    var pic_url = functions_fetch.picture_generator(parseInt(aqi_temp));
                    var status_temp = functions_fetch.status_generator(parseInt(aqi_temp));

                    county_list[the_array[i]] = {
                        title: the_array[i],
                        description: status_temp,
                        image: new Image({ url: pic_url, alt: 'Image alternate text', }),
                    }
                }
                conv.ask(new Carousel({
                    title: 'Carousel Title',
                    items: county_list,
                }));
            } else if (option === "行動測站") {
                if (conv.screen) { conv.ask('以下是「行動測站」列表，\n實際資訊供應可能隨時間變化。'); } else { conv.ask(`<speak><p><s>抱歉，在目前對話的裝置上不支援搜尋「行動測站」</s><s>請試著提問來查詢縣市列表</s></p></speak>`); }

                var mobile_list = {};

                station_array = arranger.machine(station_array);

                for (var i = 0; i < station_array.length; i++) {
                    var aqi_temp = download_data[station_array[i]].AQI;
                    var pic_url = functions_fetch.picture_generator(parseInt(aqi_temp));
                    var status_temp = functions_fetch.status_generator(parseInt(aqi_temp));

                    mobile_list[station_array[i]] = {
                        title: station_array[i],
                        description: status_temp,
                        image: new Image({ url: pic_url, alt: 'Image alternate text', }),
                    }
                }
                conv.ask(new Carousel({
                    title: 'Carousel Title',
                    items: mobile_list,
                }));

            }
        } else if (request_array.indexOf(option) !== -1) {

            if (conv.screen) {
                conv.ask(new SimpleResponse({
                    speech: `<speak><p><s>以下是${option}的監測站列表!<break time="0.5s"/>請查看</s></p></speak>`,
                    text: '以下是「' + option + '」的測站列表'
                }));
            } else { conv.ask(new SimpleResponse(`<speak><p><s>以下是${option}的監測站列表</s><s>選項有以下幾個<break time="0.5s"/>${replaceString(option_list[option], ',', '<break time="0.25s"/>')}<break time="1s"/>請選擇。</s></p></speak>`)); }


            var the_array = option_list[option].split('、');
            var county_list = {};

            for (var i = 0; i < station_array.length; i++) {
                var key_word = option.replace(/[\縣|\市|\第|\一|\二|\部|\分]/gm, "");
                if (key_word.length > 2) { key_word.replace(/[\南|\北]/gm, "") }

                if (station_array[i].indexOf(key_word + "(") !== -1) {
                    the_array.push(station_array[i])
                }
            }

            for (var i = 0; i < the_array.length; i++) {
                if (download_data[the_array[i]] === undefined) {
                    continue
                }
                var aqi_temp = download_data[the_array[i]].AQI;
                var pic_url = functions_fetch.picture_generator(parseInt(aqi_temp));
                var status_temp = functions_fetch.status_generator(parseInt(aqi_temp));

                county_list[the_array[i]] = {
                    title: the_array[i],
                    description: status_temp,
                    image: new Image({ url: pic_url, alt: 'Image alternate text', }),
                }

                if (the_array[i].indexOf(")") !== -1) {
                    var select_title = the_array[i].replace(/.+[(]/gm, "");
                    select_title = select_title.replace(/[)]/gm, "");
                    county_list[the_array[i]].title = select_title + " (行動站)";
                }
            }

            conv.ask(new Carousel({
                title: 'Carousel Title',
                items: county_list,
            }));

            if (suggest_list[option] !== undefined) { conv.ask(new Suggestions('查看' + suggest_list[option])); }

        } else if (station_array.indexOf(option) !== -1) {

            var temp = download_data[option];

            var AQI = temp.AQI;
            var Pollutant = temp.Pollutant;
            var PM10 = temp.PM10;
            var PM25 = temp.PM25;
            var O3 = temp.O3;
            var Status = functions_fetch.status_generator(parseInt(AQI));

            if (Status !== "有效數據不足") {

                var picture = functions_fetch.big_picture_generator(AQI);
                var info = functions_fetch.info_generator(AQI);
                var info_output = functions_fetch.info_output_generator(AQI);

                if (option.indexOf('(') !== -1) {
                    option = option.split('(')[1];
                    option = replaceString(option, ')', '');
                } else {
                    conv.ask(new Suggestions('把它加入日常安排'));
                }

                if (AQI >= 0 && AQI <= 50) {
                    conv.ask(new SimpleResponse({
                        speech: `<speak><p><s>根據最新資料顯示，${option}監測站的AQI指數為${AQI}</s><s>您可放心出外活動!</s></p></speak>`,
                        text: '以下為該監測站的詳細資訊，\n您可放心出外活動!'
                    }));
                } else if (AQI > 50) {
                    conv.ask(new SimpleResponse({
                        speech: `<speak><p><s>根據最新資料顯示，${option}監測站的AQI指數為${AQI}</s><s>主要汙染源來自${replaceString(Pollutant, '八小時', '')}</s><s>${info}</s></p></speak>`,
                        text: '以下為該監測站的詳細資訊'
                    }));
                }

                var output_title = Status;
                if (AQI > 50) {
                    output_title = output_title + ' • ' + pollutant_dict[Pollutant];
                }

                if (conv.screen) {
                    conv.ask(new BasicCard({
                        image: new Image({ url: picture, alt: 'Pictures', }),
                        display: 'CROPPED',
                        title: option,
                        subtitle: output_title,
                        text: info_output + '  \n  \nPM₁₀ ' + PM10 + '(μg/m³) • PM₂.₅ ' + PM25 + '(μg/m³) • 臭氧 ' + O3 + '(ppb)  \n**測站資訊發布時間** • ' + functions_fetch.FormatTime(),
                    }));

                } else { conv.expectUserResponse = false } //告知Google助理結束對話
            } else {
                conv.ask(new SimpleResponse({
                    speech: `<speak><p><s>由於${option}監測站正處於維修狀態或數據不足。我無法提供你最新資訊。</s></p></speak>`,
                    text: '以下為「' + option + '」監測站的詳細資訊'
                }));
                if (conv.screen) {
                    conv.ask(new BasicCard({
                        image: new Image({ url: "https://dummyimage.com/1037x539/232830/ffffff.png&text=NaN", alt: 'Pictures', }),
                        title: '有效數據不足',
                        text: '設備維護、儀器校正、儀器異常、傳輸異常、電力異常 \n或有效數據不足等需查修維護情形，以致資料暫時中斷服務。  \n  \nPM₁₀ ' + PM10 + '(μg/m³) • PM₂.₅ ' + PM25 + '(μg/m³) • 臭氧 ' + O3 + '(ppb)  \n**測站資訊發布時間** • ' + functions_fetch.FormatTime(),
                        display: 'CROPPED',
                    }));
                    conv.ask(new Suggestions('把它加入日常安排'));
                } else { conv.close(`<speak><p><s>歡迎你隨時回來查詢，下次見</s></p></speak>`); }

            }
        } else if (station_array.indexOf(option) !== -1) {
            conv.ask(new SimpleResponse({
                speech: `<speak><p><s>由於${option}監測站正處於維修狀態或數據不足。我無法提供你最新資訊。</s></p></speak>`,
                text: '以下為「' + option + '」監測站的詳細資訊'
            }));
            if (conv.screen) {
                conv.ask(new BasicCard({
                    image: new Image({ url: "https://dummyimage.com/1037x539/232830/ffffff.png&text=NaN", alt: 'Pictures', }),
                    title: '有效數據不足',
                    text: '設備維護、儀器校正、儀器異常、傳輸異常、電力異常 \n或有效數據不足等需查修維護情形，以致資料暫時中斷服務。  \n  \n**測站資訊發布時間** • ' + functions_fetch.FormatTime(),
                    display: 'CROPPED',
                }));
                conv.ask(new Suggestions('把它加入日常安排'));
            } else { conv.close(`<speak><p><s>歡迎你隨時回來查詢，下次見</s></p></speak>`); }
        } else if (option === "🌎 最近的測站") {
            conv.contexts.set(AppContexts.LOCATION, 1);
            conv.data.requestedPermission = 'DEVICE_PRECISE_LOCATION';
            return conv.ask(new Permission({
                context: "在繼續操作前，建議你開啟裝置上的GPS功能來取得精確結果。接著，為了找到最近的測站位置",
                permissions: conv.data.requestedPermission,
            }));

            conv.ask(new Permission(options));

        } else {
            var word1 = county_array[parseInt(Math.random() * 19)];
            var word2 = county_array[20 + parseInt(Math.random() * 28)];
            option = "undefined";

            if (conv.input.type === "VOICE") { //如果輸入是語音，則顯示錯誤處理方法
                conv.ask(new SimpleResponse({
                    speech: `<speak><p><s>抱歉，我不懂你的意思</s><s>請試著問我<break time="0.2s"/>${word1}空氣品質如何?<break time="0.2s"/>或<break time="0.2s"/>幫我查詢${word2}</s></p></speak>`,
                    text: '試著提問來快速存取縣市列表，\n或點選建議卡片來進行操作!'
                }));
                if (conv.screen) {
                    conv.ask(new BasicCard({
                        title: "語音查詢範例",
                        subtitle: "以下是你可以嘗試的指令",
                        text: " • *「" + word1 + "空氣品質如何?」*  \n • *「幫我查詢" + word2 + "」*  \n • *「我想知道" + county_array[parseInt(Math.random() * 48)] + "狀況怎樣」*  \n • *「幫我找" + county_array[parseInt(Math.random() * 48)] + "」*  \n • *「我想看" + county_array[parseInt(Math.random() * 48)] + "」*  \n • *「" + county_array[parseInt(Math.random() * 48)] + "空氣好嗎?」*  \n • *「我要查" + county_array[parseInt(Math.random() * 48)] + "」*",
                    }));
                    conv.ask(new Suggestions(word1 + "空氣品質如何?", "幫我查詢" + word2));
                } else { conv.ask(`<speak><p><s>或對我說<break time="0.2s"/>區域查詢<break time="0.2s"/>來進行操作</s></p></speak>`); }

            } else { conv.ask('抱歉，我不懂你的意思，\n請點選建議卡片來進行操作。'); }
            conv.ask(new Suggestions(eicon[parseInt(Math.random() * 2)] + '最近的測站'));
        }

        if (conv.screen) {
            conv.ask(new Suggestions('回主頁面', '👋 掰掰'));
        }
        conv.user.storage.choose_station = option;
        conv.data.choose_station = option;

    }).catch(function(error) {
        conv.ask(new SimpleResponse({
            speech: `<speak><p><s>糟糕，獲取資料發生錯誤</s><s>我們會盡快修復它</s></p></speak>`,
            text: '糟糕!\n發生意料之外的問題，我們會盡快修復'
        }));
        console.log(error)
            //conv.contexts.set(SelectContexts.parameter, 5);
        conv.ask(new BasicCard({
            image: new Image({ url: "https://raw.githubusercontent.com/hank199599/Google-Assistant-APP/master/%E7%A9%BA%E6%B1%99%E6%9F%A5%E8%A9%A2%E7%B2%BE%E9%9D%88/assets/error.png", alt: 'Pictures', }),
            title: '數據加載發生問題',
            subtitle: '我們將會盡快修復這項問題，敬請見諒!',
            text: '錯誤內容：' + error,
            display: 'CROPPED'
        }));

        conv.ask(new Suggestions(eicon[parseInt(Math.random() * 2)] + '最近的測站', '回主頁面', '語音查詢範例', '今天的數值預報', '風向對空污的影響', '污染物影響要素', '👋 掰掰'));
    });
});

app.intent('Default Fallback Intent', (conv) => {
    var word1 = county_array[parseInt(Math.random() * 19)];
    var word2 = county_array[20 + parseInt(Math.random() * 28)];

    if (conv.input.type === "VOICE") { //如果輸入是語音，則顯示錯誤處理方法
        conv.ask(new SimpleResponse({
            speech: `<speak><p><s>抱歉，我不懂你的意思</s><s>請試著問我<break time="0.2s"/>${word1}空氣品質如何?<break time="0.2s"/>或<break time="0.2s"/>幫我查詢${word2}</s></p></speak>`,
            text: '試著提問來快速存取縣市列表，\n或點選建議卡片來進行操作!'
        }));
        if (conv.screen) {
            conv.ask(new BasicCard({
                title: "語音查詢範例",
                subtitle: "以下是你可以嘗試的指令",
                text: " • *「" + word1 + "空氣品質如何?」*  \n • *「幫我查詢" + word2 + "」*  \n • *「我想知道" + county_array[parseInt(Math.random() * 48)] + "狀況怎樣」*  \n • *「幫我找" + county_array[parseInt(Math.random() * 48)] + "」*  \n • *「我想看" + county_array[parseInt(Math.random() * 48)] + "」*  \n • *「" + county_array[parseInt(Math.random() * 48)] + "空氣好嗎?」*  \n • *「我要查" + county_array[parseInt(Math.random() * 48)] + "」*",
            }));
            conv.ask(new Suggestions(word1 + '空氣品質如何?', '幫我查詢' + word2));
        }

        conv.noInputs = [`<speak><p><s>請試著再問一次</s><s>例如<break time="0.2s"/>${word1}空氣品質如何?`, "請試著問我要查詢的縣市", "很抱歉，我幫不上忙"];

    } else {
        conv.ask('抱歉，我不懂你的意思，\n請點選建議卡片來進行操作。');
    }
    conv.ask(new Suggestions(eicon[parseInt(Math.random() * 2)] + '最近的測站', '🔎依區域查詢', '👋 掰掰'));

});

app.intent('語音指令範例', (conv) => {
    var word1 = county_array[parseInt(Math.random() * 19)];
    var word2 = county_array[20 + parseInt(Math.random() * 28)];
    var word3 = county_array[parseInt(Math.random() * 48)];

    conv.ask(new SimpleResponse({
        speech: `<speak><p><s>在任意畫面中，你隨時都能快速查詢縣市列表</s><s>你可以試著問<break time="0.2s"/>${word1}空氣品質如何?<break time="0.2s"/>或<break time="0.2s"/>幫我查詢${word2}</s></p></speak>`,
        text: '試著提問來快速存取縣市列表，\n以下是你可以嘗試的詢問方式!'
    }));
    conv.ask(new BasicCard({
        title: "語音查詢範例",
        subtitle: "以下是你可以嘗試的指令",
        text: " • *「" + word1 + "空氣品質如何?」*  \n • *「幫我查詢" + word2 + "」*  \n • *「我想知道" + word3 + "狀況怎樣」*  \n • *「幫我找" + county_array[parseInt(Math.random() * 48)] + "」*  \n • *「我想看" + county_array[parseInt(Math.random() * 48)] + "」*  \n • *「" + county_array[parseInt(Math.random() * 48)] + "空氣好嗎?」*  \n • *「我要查" + county_array[parseInt(Math.random() * 48)] + "」*",
    }));
    conv.ask(new Suggestions(word1 + '空氣品質如何?', '幫我查詢' + word2, '我想知道' + word3 + '狀況怎樣', eicon[parseInt(Math.random() * 2)] + '最近的測站', '🔎依區域查詢', '👋 掰掰'));

});

app.intent('直接查詢', (conv, { station }) => {

    return new Promise(
        function(resolve, reject) {
            database.ref('/TWair').on('value', e => { resolve(e.val()); });
        }).then(function(final_data) {

        var download_data = final_data.data;
        var station_array = Object.keys(final_data.data);

        if (station_array.indexOf(station) === -1) {

            conv.ask(new SimpleResponse({
                speech: `<speak><p><s>抱歉，您欲查詢的監測站似乎不存在，我無法提供你最新資訊。</s></p></speak>`,
                text: '抱歉，我無法提供協助'
            }));
            conv.close(new BasicCard({
                image: new Image({ url: "https://dummyimage.com/1037x539/232830/ffffff.png&text=NaN", alt: 'Pictures', }),
                title: '找不到您指定的測站',
                subtitle: '請確認輸入的測站是否有誤',
                display: 'CROPPED',
            }));
        } else {
            var temp = download_data[station];

            var AQI = temp.AQI;
            var Pollutant = temp.Pollutant;
            var PM10 = temp.PM10;
            var PM25 = temp.PM25;
            var O3 = temp.O3;
            var Status = functions_fetch.status_generator(parseInt(AQI));

            if (Status !== "有效數據不足") {
                var picture = functions_fetch.big_picture_generator(AQI);
                var info = functions_fetch.info_generator(AQI);
                var info_output = functions_fetch.info_output_generator(AQI);

                if (AQI >= 0 && AQI <= 50) {
                    conv.ask(new SimpleResponse({
                        speech: `<speak><p><s>根據最新資料顯示，${station}監測站的AQI指數為${AQI}</s><s>您可放心出外活動!</s></p></speak>`,
                        text: '以下為該監測站的詳細資訊，\n您可放心出外活動!'
                    }));
                } else if (AQI > 50) {
                    conv.ask(new SimpleResponse({
                        speech: `<speak><p><s>根據最新資料顯示，${station}監測站的AQI指數為${AQI}</s><s>主要汙染源來自${replaceString(Pollutant, '八小時', '')}</s><s>${info}</s></p></speak>`,
                        text: '以下為該監測站的詳細資訊'
                    }));
                }

                var output_title = Status;
                if (AQI > 50) {
                    output_title = output_title + ' • ' + pollutant_dict[Pollutant];
                }

                conv.close(new BasicCard({
                    image: new Image({ url: picture, alt: 'Pictures', }),
                    display: 'CROPPED',
                    title: station,
                    subtitle: output_title,
                    text: info_output + '  \n  \nPM₁₀ ' + PM10 + '(μg/m³) • PM₂.₅ ' + PM25 + '(μg/m³) • 臭氧 ' + O3 + '(ppb)  \n**測站資訊發布時間** • ' + functions_fetch.FormatTime(),
                }));

            } else {
                conv.ask(new SimpleResponse({
                    speech: `<speak><p><s>由於${station}監測站數據不足或處於維修狀態，我無法提供你最新資訊。</s></p></speak>`,
                    text: '以下為「' + station + '」監測站的詳細資訊'
                }));
                conv.close(new BasicCard({
                    image: new Image({ url: "https://dummyimage.com/1037x539/232830/ffffff.png&text=NaN", alt: 'Pictures', }),
                    title: '有效數據不足',
                    title: '有效數據不足',
                    text: '設備維護、儀器校正、儀器異常、傳輸異常、電力異常 \n或有效數據不足等需查修維護情形，以致資料暫時中斷服務。  \n  \nPM₁₀ ' + PM10 + '(μg/m³) • PM₂.₅ ' + PM25 + '(μg/m³) • 臭氧 ' + O3 + '(ppb)  \n**測站資訊發布時間** • ' + functions_fetch.FormatTime(),
                    display: 'CROPPED',
                }));
            }
        }
    }).catch(function(error) {
        console.log(error)
        conv.ask(new SimpleResponse({
            speech: `<speak><p><s>糟糕，查詢似乎發生錯誤。請稍後再試。</s></p></speak>`,
            text: '發生錯誤，請稍後再試一次'
        }));
        conv.close(new BasicCard({
            image: new Image({ url: "https://raw.githubusercontent.com/hank199599/Google-Assistant-APP/master/%E7%A9%BA%E6%B1%99%E6%9F%A5%E8%A9%A2%E7%B2%BE%E9%9D%88/assets/error.png", alt: 'Pictures', }),
            title: '數據加載發生問題',
            subtitle: '請過一段時間後再回來查看',
            text: '錯誤內容：' + error,
            display: 'CROPPED'
        }));
    });

});

app.intent('日常安排教學', (conv, { station }) => {

    var choose_station = "";
    if (station !== "") { choose_station = station; } else { choose_station = conv.user.storage.choose_station; }
    if (station_array.indexOf(choose_station) === -1) { choose_station = station_array[parseInt(Math.random() * 81)]; }
    conv.ask(new SimpleResponse({
        speech: `<speak><p><s>透過加入日常安排，你可以快速存取要查詢的站點。</s><s>舉例來說，如果你把${choose_station}加入日常安排。你即可隨時呼叫我查詢該站點的最新空氣品質!</s><s>以下為詳細說明</s></p></speak>`,
        text: '以下為詳細說明'
    }));

    conv.ask(new BasicCard({
        image: new Image({ url: "https://raw.githubusercontent.com/hank199599/Google-Assistant-APP/master/%E7%A9%BA%E6%B1%99%E6%9F%A5%E8%A9%A2%E7%B2%BE%E9%9D%88/assets/82c8u4T.png", alt: 'Pictures', }),
        title: '將「' + choose_station + '」加入日常安排',
        display: 'CROPPED',
        subtitle: '1.點擊畫面右上方大頭貼 > 點擊[設定]\n2.切換到[Google助理]分頁 > 點擊[日常安排]\n3.點擊[新增日常安排]\n4.「新增指令(必填)」輸入「空氣品質」\n5.「新增動作」輸入\n「叫空汙查詢精靈查詢' + choose_station + '站」\n6.輸入完成後點擊「儲存」\n7.現在，你可以透過說出或輸入「空氣品質」來快速查詢' + choose_station + '的AQI指數!',
    }));

    conv.ask(new Suggestions(eicon[parseInt(Math.random() * 2)] + '最近的測站', '回主頁面', '👋 掰掰'));

});

app.intent('從風向看空氣品質', (conv, { Wind_direction }) => {

    if (conv.input.raw.indexOf('背風面') !== -1) { Wind_direction = "背風面"; } else if (conv.input.raw.indexOf('下風處') !== -1) { Wind_direction = "下風處"; } else if (conv.input.raw.indexOf('弱風環境') !== -1) { Wind_direction = "弱風環境"; } else if (conv.input.raw.indexOf('背風渦旋') !== -1) { Wind_direction = "背風渦旋"; }

    if (Object.keys(explain_list).indexOf(Wind_direction) !== -1) {

        conv.ask(new SimpleResponse({
            speech: `<speak><p><s>以下是環保署對${Wind_direction}與空氣品質關聯性的說明</s><break time="1s"/><s>${replaceString(explain_list[Wind_direction][0], '\n', '')}</s></p></speak>`,
            text: '以下是環保署的解說'
        }));
        conv.ask(new BasicCard({
            image: new Image({ url: explain_list[Wind_direction][1], alt: 'Pictures', }),
            title: Wind_direction,
            display: 'CROPPED',
            subtitle: explain_list[Wind_direction][0],
            text: "Ⓒ 圖文資訊來自 行政院環境保護署 **《空品小百科》**"
        }));

        conv.ask(new Suggestions('說明其他風向', eicon[parseInt(Math.random() * 2)] + '最近的測站', '回主頁面', '👋 掰掰'));

    } else {
        conv.ask(new SimpleResponse({
            speech: `<speak><p><s>請選擇您要我解釋的風向因素類別，共有以下九類</s><s>點擊建議卡片來取得說明</s></p></speak>`,
            text: '請選擇要我解釋的因素類別'
        }));
        conv.ask(new BasicCard({
            title: "從風向看空氣品質",
            subtitle: "不同季節吹著相異的盛行風，\n在擁有複雜地形的臺灣易受到地形的阻擋。\n從而影響每天臺灣各地的空氣品質!",
            text: "Ⓒ 圖文資訊來自 行政院環境保護署 **《空品小百科》**",
            buttons: new Button({ title: '空品小百科', url: 'https://airtw.epa.gov.tw/CHT/Encyclopedia/pedia02/pedia2.aspx', }),
        }));
        conv.ask(new Suggestions('東北風', '偏東風', '偏南風', '西南風', '偏西風', '背風面', '下風處', '弱風環境', '背風渦旋'));
    }

});

app.intent('污染物特性及影響要素', (conv, { Pollutant_type }) => {

    if (Object.keys(explain_list).indexOf(Pollutant_type) !== -1) {

        conv.ask(new SimpleResponse({
            speech: `<speak><p><s>以下是環保署對${Pollutant_type}與空氣品質關聯性的說明</s><break time="1s"/><s>${replaceString(explain_list[Pollutant_type][0], '\n', '')}</s></p></speak>`,
            text: '以下是環保署的解說'
        }));
        conv.ask(new BasicCard({
            image: new Image({ url: explain_list[Pollutant_type][1], alt: 'Pictures', }),
            title: Pollutant_type,
            display: 'CROPPED',
            subtitle: explain_list[Pollutant_type][0],
            text: "Ⓒ 圖文資訊來自 行政院環境保護署 **《空品小百科》**"
        }));

        conv.ask(new Suggestions('說明其他汙染因素', eicon[parseInt(Math.random() * 2)] + '最近的測站', '🔎依區域查詢', '👋 掰掰'));

    } else {
        conv.ask(new SimpleResponse({
            speech: `<speak><p><s>請選擇您要我解釋的影響因素類別，共有以下六種</s><s>點擊建議卡片來取得說明</s></p></speak>`,
            text: '請選擇要我解釋的影響因素類別'
        }));
        conv.ask(new BasicCard({
            title: "污染物特性及影響要素",
            subtitle: "污染物分為一次性及衍生性污染物，\n除了污染源直接排放外，特定條件下易引發污染物濃度上升，\n而這些特定條件與各種氣象要素又有密切關連!",
            text: "Ⓒ 圖文資訊來自 行政院環境保護署 **《空品小百科》**",
            buttons: new Button({ title: '空品小百科', url: 'https://airtw.epa.gov.tw/CHT/Encyclopedia/pedia03/pedia3.aspx', }),
        }));
        conv.ask(new Suggestions('河川揚塵', '光化反應', '境外汙染', '降雨洗除作用', '混合層高度', '沉降作用'));
    }

});

app.intent('取得地點權限', (conv) => {

    conv.data.requestedPermission = 'DEVICE_PRECISE_LOCATION';
    return conv.ask(new Permission({
        context: "在繼續操作前，建議你開啟裝置上的GPS功能來取得精確結果。接著，為了找到最近的測站位置",
        permissions: conv.data.requestedPermission,
    }));

    conv.ask(new Permission(options));

});

app.intent('回傳資訊', (conv, params, permissionGranted) => {
    if (permissionGranted) {
        const {
            requestedPermission
        } = conv.data;
        if (requestedPermission === 'DEVICE_PRECISE_LOCATION') {

            const coordinates = conv.device.location.coordinates;
            // const city=conv.device.location.city;

            conv.ask(new Suggestions('重新定位'));
            if (coordinates) {
                const myLocation = {
                    lat: coordinates.latitude,
                    lng: coordinates.longitude
                };

                return new Promise(
                    function(resolve, reject) {
                        database.ref('/TWair').on('value', e => { resolve(e.val()); });
                    }).then(function(final_data) {

                    var sitename = (findNearestLocation(myLocation, final_data.locations)).location.Sitename; //透過模組找到最近的測站
                    var final_data = final_data.data[sitename]

                    var site_output = sitename;
                    if (sitename.indexOf('(') !== -1) {
                        var temp = sitename.replace(')', '').split('(');
                        site_output = "位於" + temp[0] + "的" + temp[1] + "行動監測站"
                    }

                    conv.ask(new SimpleResponse({ speech: `<speak><p><s>查詢完成!</s><s>距離你最近的測站是<break time="0.2s"/>${site_output}。</s></p></speak>`, text: '最近的測站是「' + sitename + '」!' }));

                    if (final_data !== undefined) {
                        //indexnumber = station_array.indexOf(sitename); //取得監測站對應的編號
                        //console.log(final_data)
                        var AQI = final_data.AQI;
                        var Pollutant = final_data.Pollutant;
                        var PM10 = final_data.PM10;
                        var PM25 = final_data.PM25;
                        var O3 = final_data.O3;
                        var Status = functions_fetch.status_generator(parseInt(AQI));

                        if (Status !== "有效數據不足") {
                            var picture = functions_fetch.big_picture_generator(AQI);
                            var info = functions_fetch.info_generator(AQI);
                            var info_output = functions_fetch.info_output_generator(AQI);

                            if (AQI >= 0 && AQI <= 50) {
                                conv.ask(new SimpleResponse({
                                    speech: `<speak><p><s>根據最新資料顯示，該監測站的AQI指數為${AQI}</s><s>您可放心出外活動!</s></p></speak>`,
                                    text: '以下為該監測站的詳細資訊，\n您可放心出外活動!'
                                }));
                            } else if (AQI > 50) {
                                conv.ask(new SimpleResponse({
                                    speech: `<speak><p><s>根據最新資料顯示，該監測站的AQI指數為${AQI}</s><s>主要汙染源來自${replaceString(Pollutant, '八小時', '')}</s><s>${info}</s></p></speak>`,
                                    text: '以下為該監測站的詳細資訊'
                                }));
                            }

                            var output_title = Status;
                            if (AQI > 50) {
                                output_title = output_title + ' • ' + pollutant_dict[Pollutant];
                            }

                            if (conv.screen) {

                                conv.ask(new BasicCard({
                                    image: new Image({ url: picture, alt: 'Pictures', }),
                                    display: 'CROPPED',
                                    title: sitename,
                                    subtitle: output_title,
                                    text: info_output + '  \n  \nPM₁₀ ' + PM10 + '(μg/m³) • PM₂.₅ ' + PM25 + '(μg/m³) • 臭氧 ' + O3 + '(ppb)  \n**測站資訊發布時間** • ' + functions_fetch.FormatTime(),
                                }));

                                conv.ask(new Suggestions('把它加入日常安排'));
                            } else { conv.close(`<speak><p><s>歡迎你隨時回來查詢，下次見</s></p></speak>`); }
                        } else {
                            conv.ask(new SimpleResponse({
                                speech: `<speak><p><s>由於${sitename}監測站數據不足或處於維修狀態，我無法提供你最新資訊。</s></p></speak>`,
                                text: '以下為「' + sitename + '」監測站的詳細資訊'
                            }));
                            conv.ask(new BasicCard({
                                image: new Image({ url: "https://dummyimage.com/1037x539/232830/ffffff.png&text=NaN", alt: 'Pictures', }),
                                title: '有效數據不足',
                                text: '設備維護、儀器校正、儀器異常、傳輸異常、電力異常 \n或有效數據不足等需查修維護情形，以致資料暫時中斷服務。  \n  \nPM₁₀ ' + PM10 + '(μg/m³) • PM₂.₅ ' + PM25 + '(μg/m³) • 臭氧 ' + O3 + '(ppb)  \n**測站資訊發布時間** • ' + functions_fetch.FormatTime(),
                                display: 'CROPPED',
                            }));
                        }
                        if (conv.screen) { conv.ask(new Suggestions('回主頁面', '👋 掰掰')); } else { conv.expectUserResponse = false } //告知Google助理結束對話 

                    } else {
                        conv.ask(new SimpleResponse({
                            speech: `<speak><p><s>糟糕，查詢似乎發生錯誤。</s><s>請稍後再試。</s></p></speak>`,
                            text: '發生錯誤，請稍後再試一次'
                        }));
                        conv.ask(new BasicCard({
                            image: new Image({ url: "https://raw.githubusercontent.com/hank199599/Google-Assistant-APP/master/%E7%A9%BA%E6%B1%99%E6%9F%A5%E8%A9%A2%E7%B2%BE%E9%9D%88/assets/error.png", alt: 'Pictures', }),
                            title: '數據加載發生問題',
                            subtitle: '請過一段時間後再回來查看',
                            text: '錯誤內容：' + error,
                            display: 'CROPPED'
                        }));
                    }
                }).catch(function(error) {
                    conv.ask(new SimpleResponse({
                        speech: `<speak><p><s>糟糕，查詢似乎發生錯誤。請稍後再試。</s></p></speak>`,
                        text: '發生錯誤，請稍後再試一次'
                    }));
                    conv.ask(new BasicCard({
                        image: new Image({ url: "https://raw.githubusercontent.com/hank199599/Google-Assistant-APP/master/%E7%A9%BA%E6%B1%99%E6%9F%A5%E8%A9%A2%E7%B2%BE%E9%9D%88/assets/error.png", alt: 'Pictures', }),
                        title: '數據加載發生問題',
                        subtitle: '請過一段時間後再回來查看',
                        text: '錯誤內容：' + error,
                        display: 'CROPPED'
                    }));
                    if (conv.screen) { conv.ask(new Suggestions('回主頁面', '👋 掰掰')); } else { conv.close(`<speak><p><s>歡迎你隨時回來查詢，下次見</s></p></speak>`); }
                });
            } else {
                // Note: Currently, precise locaton only returns lat/lng coordinates on phones and lat/lng coordinates
                // and a geocoded address on voice-activated speakers.
                // Coarse location only works on voice-activated speakers.
                conv.ask(new SimpleResponse({ speech: `<speak><p><s>糟糕，我無法得知你的目前位置。</s><s>請稍後再試。</s></p></speak>`, text: "發生錯誤，請開啟GPS功能然後再試一次。" }));
            }

        }
    } else {
        conv.ask(new SimpleResponse({ speech: `<speak><p><s>很抱歉，由於未取得你的授權因此查詢失敗。</s><s>不過你隨時可以回來再試一次。</s></p></speak>`, text: "發生錯誤，未取得你的授權。" }));
    }
    if (conv.screen) { conv.ask(new Suggestions('回主頁面', '👋 掰掰')); } else { conv.close(`<speak><p><s>歡迎你隨時回來查詢，下次見</s></p></speak>`); }
    conv.user.storage.choose_station = sitename;

});

app.intent('直接查詢縣市選單', (conv, { County }) => {

    return new Promise(
        function(resolve, reject) {
            database.ref('/TWair').on('value', e => { resolve(e.val()); });
        }).then(function(final_data) {

        var download_data = final_data.data;
        var station_array = Object.keys(final_data.data);

        conv.noInputs = ["抱歉，我沒聽輕楚。請再問一次", "請試著問我要查詢的縣市列表，例如、" + county_array[parseInt(Math.random() * 48)] + "空氣品質如何?", "很抱歉，我幫不上忙"];

        if (conv.input.raw.indexOf('新北') !== -1) { County = "新北市"; } else if (conv.input.raw.indexOf('第一部分') !== -1 || conv.input.raw.indexOf('一部分') !== -1) { County = "新北市第一部分"; } else if (conv.input.raw.indexOf('第二部分') !== -1) { County = "新北市第二部分"; } else if (conv.input.raw.indexOf('北高雄') !== -1) { County = "北高雄"; } else if (conv.input.raw.indexOf('南高雄') !== -1) { County = "南高雄"; } else if (conv.input.raw === "台東") { County = "臺東"; }

        if (conv.input.raw === "新北(樹林)") { County = "新北(樹林)"; } else if (conv.input.raw === "桃園(觀音工業區)") { County = "桃園(觀音工業區)"; } else if (conv.input.raw === "彰化(大城)") { County = "彰化(大城)"; } else if (conv.input.raw === "臺南(麻豆)") { County = "臺南(麻豆)"; } else if (conv.input.raw === "高雄(楠梓)") { County = "高雄(楠梓)"; } else if (conv.input.raw === "高雄(左營)") { County = "高雄(左營)"; } else if (conv.input.raw === "屏東(琉球)") { County = "屏東(琉球)"; }

        conv.noInputs = ["抱歉，我沒聽輕楚。請再說一次", "請再說一次要查看測站名稱", "很抱歉，我幫不上忙"];

        if (["新北市", "高雄市"].indexOf(County) !== -1) {
            conv.ask(new SimpleResponse({
                speech: `<speak><p><s>由於${County}的測站數目較多，分為兩部份顯示，請選擇</s></p></speak>`,
                text: '「' + County + '」監測站數量較多，\n分為兩部份顯示。'
            }));
            conv.contexts.set(SelectContexts.parameter, 5);

            if (County === "新北市") {

                conv.ask(new Carousel({
                    title: 'Carousel Title',
                    items: {
                        '新北市第一部分': {
                            title: '新北市(一)',
                            synonyms: ['新北', '三重', '土城', '永和', '汐止', '板橋', '林口'],
                            description: '三重、土城、永和  \n汐止、板橋、林口',
                        },
                        '新北市第二部分': {
                            synonyms: ['新北', '淡水', '富貴角', '菜寮', '新店', '新莊', '萬里'],
                            title: '新北市(二)',
                            description: '淡水、富貴角、菜寮  \n新店、新莊、萬里',
                        },
                    },
                }));
            } else if (County === "高雄市") {
                conv.ask(new Carousel({
                    title: 'Carousel Title',
                    items: {
                        '北高雄': {
                            synonyms: ['北高雄', '美濃', '橋頭', '楠梓', '仁武', '左營', '前金', ],
                            title: '北高雄',
                            description: '美濃、橋頭、楠梓  \n仁武、左營、前金',
                        },
                        '南高雄': {
                            synonyms: ['南高雄', '鳳山', '復興', '前鎮', '小港', '大寮', '林園', ],
                            title: '南高雄',
                            description: '鳳山、復興、前鎮  \n小港、大寮、林園',
                        },
                    },
                }));
            }
            if (County !== "undefined") { conv.ask(new Suggestions('回主頁面')); }
            conv.ask(new Suggestions('👋 掰掰'));

        } else if (request_array.indexOf(County) !== -1) {

            conv.contexts.set(SelectContexts.parameter, 5);

            if (conv.screen) {
                conv.ask(new SimpleResponse({
                    speech: `<speak><p><s>以下是${County}的監測站列表!<break time="0.5s"/>請查看</s></p></speak>`,
                    text: '以下是「' + County + '」的測站列表'
                }));
            } else { conv.ask(new SimpleResponse(`<speak><p><s>以下是${County}的監測站列表</s><s>選項有以下幾個<break time="0.5s"/>${replaceString(option_list[County], '、', '<break time="0.25s"/>')}<break time="1s"/>請選擇。</s></p></speak>`)); }

            var the_array = option_list[County].split('、');
            var county_list = {};


            for (var i = 0; i < station_array.length; i++) {
                var key_word = County.replace(/[\縣|\市|\第|\一|\二|\部|\分]/gm, "");
                if (key_word.length > 2) { key_word.replace(/[\南|\北]/gm, "") }

                if (station_array[i].indexOf(key_word + "(") !== -1) {
                    the_array.push(station_array[i])
                }
            }


            for (var i = 0; i < the_array.length; i++) {
                if (download_data[the_array[i]] === undefined) {
                    continue
                }
                var aqi_temp = download_data[the_array[i]].AQI;
                var pic_url = functions_fetch.picture_generator(parseInt(aqi_temp));
                var status_temp = functions_fetch.status_generator(parseInt(aqi_temp));

                county_list[the_array[i]] = {
                    title: the_array[i],
                    description: status_temp,
                    image: new Image({ url: pic_url, alt: 'Image alternate text', }),
                }

                if (the_array[i].indexOf("(") !== -1) {
                    var select_title = the_array[i].replace(/.+[(]/gm, "");
                    select_title = select_title.replace(/[)]/gm, "");
                    county_list[the_array[i]].title = select_title + " (行動站)";
                }
            }

            conv.ask(new Carousel({
                title: 'Carousel Title',
                items: county_list,
            }));

            if (suggest_list[County] !== undefined) { conv.ask(new Suggestions('查看' + suggest_list[County])); }
            if (County !== "undefined") { conv.ask(new Suggestions('回主頁面')); }
            conv.ask(new Suggestions('👋 掰掰'));

        } else if (station_array.indexOf(County) !== -1) {

            var AQI = download_data[County].AQI;
            var Pollutant = download_data[County].Pollutant;
            var Status = download_data[County].Status;
            var PM10 = download_data[County].PM10;
            var PM25 = download_data[County].PM25;
            var O3 = download_data[County].O3;
            var Status = functions_fetch.status_generator(parseInt(AQI));

            if (Status !== "有效數據不足") {
                var picture = functions_fetch.big_picture_generator(AQI);
                var info = functions_fetch.info_generator(AQI);
                var info_output = functions_fetch.info_output_generator(AQI);


                if (AQI >= 0 && AQI <= 50) {
                    conv.ask(new SimpleResponse({
                        speech: `<speak><p><s>根據最新資料顯示，${County}監測站的AQI指數為${AQI}</s><s>您可放心出外活動!</s></p></speak>`,
                        text: '以下為該監測站的詳細資訊，\n您可放心出外活動!'
                    }));
                } else {
                    conv.ask(new SimpleResponse({
                        speech: `<speak><p><s>根據最新資料顯示，${County}監測站的AQI指數為${AQI}</s><s>主要汙染源來自${replaceString(Pollutant, '八小時', '')}</s><s>${info}</s></p></speak>`,
                        text: '以下為該監測站的詳細資訊'
                    }));
                }

                var output_title = Status;
                if (AQI > 50) {
                    output_title = output_title + ' • ' + pollutant_dict[Pollutant];
                }

                if (conv.screen) {
                    conv.ask(new BasicCard({
                        image: new Image({ url: picture, alt: 'Pictures', }),
                        display: 'CROPPED',
                        title: County,
                        subtitle: output_title,
                        text: info_output + '  \n  \nPM₁₀ ' + PM10 + '(μg/m³) • PM₂.₅ ' + PM25 + '(μg/m³) • 臭氧 ' + O3 + '(ppb)  \n**測站資訊發布時間** • ' + functions_fetch.FormatTime(),
                    }));
                    conv.ask(new Suggestions('把它加入日常安排'));
                } else { conv.close(`<speak><p><s>歡迎你隨時回來查詢，下次見</s></p></speak>`); }

            } else {
                conv.ask(new SimpleResponse({
                    speech: `<speak><p><s>由於${County}監測站正處於維修狀態或數據不足。我無法提供你最新資訊。</s></p></speak>`,
                    text: '以下為「' + County + '」監測站的詳細資訊'
                }));

                if (conv.screen) {
                    conv.ask(new BasicCard({
                        image: new Image({ url: "https://dummyimage.com/1037x539/232830/ffffff.png&text=NaN", alt: 'Pictures', }),
                        title: '有效數據不足',
                        text: '設備維護、儀器校正、儀器異常、傳輸異常、電力異常 \n或有效數據不足等需查修維護情形，以致資料暫時中斷服務。  \n  \nPM₁₀ ' + PM10 + '(μg/m³) • PM₂.₅ ' + PM25 + '(μg/m³) • 臭氧 ' + O3 + '(ppb)  \n**測站資訊發布時間** • ' + functions_fetch.FormatTime(),
                        display: 'CROPPED',
                    }));
                    conv.ask(new Suggestions('把它加入日常安排'));

                } else { conv.close(`<speak><p><s>歡迎你隨時回來查詢，下次見</s></p></speak>`); }

            }

            if (County !== "undefined") { conv.ask(new Suggestions('回主頁面')); }
            conv.ask(new Suggestions('👋 掰掰'));

        } else {

            County = "undefined";
            if (conv.screen) { conv.ask('我不懂你的意思，\n請輕觸下方卡片來進行區域查詢。'); } else {
                conv.ask(new SimpleResponse({
                    speech: `<speak><p><s>我不懂你的意思，請試著透過區域查詢!</s><s>選項有以下幾個<break time="0.5s"/>北部地區<break time="0.2s"/>中部地區<break time="0.2s"/>南部地區<break time="0.2s"/>東部地區<break time="0.2s"/>離島地區<break time="1s"/>請選擇。</s></p></speak>`,
                    text: '請輕觸下方卡片來選擇查詢區域!'
                }));
            }

            conv.ask(new Carousel({
                title: 'Carousel Title',
                items: county_options,
            }));
            if (conv.screen) {
                conv.ask(new Suggestions(eicon[parseInt(Math.random() * 2)] + '最近的測站'));
                if (County !== "undefined") { conv.ask(new Suggestions('回主頁面')); }
                conv.ask(new Suggestions('👋 掰掰'));
            }
        }
        conv.user.storage.choose_station = County;
        conv.data.choose_station = County;

    }).catch(function(error) {
        conv.ask(new SimpleResponse({
            speech: `<speak><p><s>糟糕，獲取資料發生錯誤</s><s>我們會盡快修復它</s></p></speak>`,
            text: '糟糕!\n發生意料之外的問題，我們會盡快修復'
        }));
        console.log(error)
            //conv.contexts.set(SelectContexts.parameter, 5);
        conv.ask(new BasicCard({
            image: new Image({ url: "https://raw.githubusercontent.com/hank199599/Google-Assistant-APP/master/%E7%A9%BA%E6%B1%99%E6%9F%A5%E8%A9%A2%E7%B2%BE%E9%9D%88/assets/error.png", alt: 'Pictures', }),
            title: '數據加載發生問題',
            subtitle: '我們將會盡快修復這項問題，敬請見諒!',
            text: '錯誤內容：' + error,
            display: 'CROPPED'
        }));

        conv.ask(new Suggestions(eicon[parseInt(Math.random() * 2)] + '最近的測站', '回主頁面', '語音查詢範例', '今天的數值預報', '風向對空污的影響', '污染物影響要素', '👋 掰掰'));
    });

});

app.intent('空氣品質預報', (conv, { day_select }) => {

    return new Promise(

        function(resolve, reject) {

            database.ref('/TWair').on('value', e => { resolve(e.val().predicts) });

        }).then(function(final_data) {

        var report_data = final_data[day_array.indexOf(day_select)];
        var report_content = functions_fetch.predict(report_data);
        var day_title = functions_fetch.getDay(day_array.indexOf(day_select));

        for (var i = 0; i < day_array.length; i++) { if (day_array[i] !== day_select) { conv.ask(new Suggestions(day_array[i] + '呢?')); } }

        var display_report = [];

        for (var i = 0; i < report_data.length; i++) {
            var temp = "";
            var pollutant = report_data[i].Pollutant;
            if (report_data[i].AQI >= 0 && report_data[i].AQI <= 50) {
                temp = "🟢";
                pollutant = "　　";
            } else if (report_data[i].AQI >= 51 && report_data[i].AQI <= 100) {
                temp = "🟡";
            } else if (report_data[i].AQI >= 101 && report_data[i].AQI <= 150) {
                temp = "🟠";
            } else if (report_data[i].AQI >= 151 && report_data[i].AQI <= 199) {
                temp = "🔴";
            } else if (report_data[i].AQI >= 200 && report_data[i].AQI <= 300) {
                temp = "🟣";
            } else if (report_data[i].AQI > 301) {
                temp = "🟤";
            }

            display_report.push({ cells: [area_array[i], temp + "　" + report_data[i].AQI, pollutant], dividerAfter: false, })

        }

        conv.ask(new SimpleResponse({
            speech: `<speak><p><s>根據環保署，${day_select}各地的預報資訊如下<break time="0.5s"/>${report_content}</s></p></speak>`,
            text: "台灣" + day_select + "各地的預報如下",
        }));
        conv.ask(new Table({
            title: day_title,
            columns: [{ header: '空品區', align: 'CENTER', }, { header: 'AQI預報值', align: 'CENTER', }, { header: '指標污染物', align: 'CENTER', }, ],
            rows: display_report,
            buttons: new Button({
                title: '三天空品區預報',
                url: 'https://airtw.epa.gov.tw/CHT/Forecast/Forecast_3days.aspx',
            }),
        }));
        conv.ask(new Suggestions('🔎依區域查詢', '👋 掰掰'));

    }).catch(function(error) {
        conv.ask(new SimpleResponse({
            speech: `<speak><p><s>獲取資料發生錯誤，請稍後再試。</s></p></speak>`,
            text: '獲取資訊發生未知錯誤',
        }));
        console.log(error)
        conv.ask(new BasicCard({
            image: new Image({ url: 'https://raw.githubusercontent.com/hank199599/Google-Assistant-APP/master/%E7%A9%BA%E6%B1%99%E6%9F%A5%E8%A9%A2%E7%B2%BE%E9%9D%88/assets/error.png', alt: 'Pictures', }),
            title: "發生錯誤，請稍後再試",
            text: String(error),
            display: 'CROPPED',
        }));
        conv.ask(new Suggestions(eicon[parseInt(Math.random() * 2)] + '最近的測站', '🔎依區域查詢', '👋 掰掰'));

    });

});

app.intent('結束對話', (conv) => {
    conv.user.storage = {}; //離開同時清除暫存資料
    conv.ask('希望能幫到一點忙!');
    conv.ask(new SimpleResponse({ speech: '下次見', text: '下次見 👋', }));
    conv.close(new BasicCard({
        title: '感謝您的使用!',
        text: '如果有任何需要改進的地方，  \n歡迎到簡介頁面評分或給予反饋，謝謝!',
        buttons: new Button({ title: '開啟本程式的商店頁面', url: 'https://assistant.google.com/services/a/uid/000000fa049fc5e5', }),
    }));
});

// Set the DialogflowApp object to handle the HTTPS POST request.
exports.air_pullute = functions.https.onRequest(app);