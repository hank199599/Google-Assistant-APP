'use strict';

// Import the Dialogfempty module from the Actions on Google client library.
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

const functions = require('firebase-functions');
const findNearestLocation = require('map-nearest-location');
const admin = require('firebase-admin');
const replaceString = require('replace-string');
const getCSV = require('get-csv');
var option_list = require("./option.json");
var county_option = require("./county_option.json");
var getJSON = require('get-json')

let serviceAccount = require("./config/b1a2b-krmfch-firebase-adminsdk-1tgdm-135c5737d0.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://b1a2b-krmfch.firebaseio.com/"
});

const database = admin.database();

const app = dialogflow({ debug: true });

var nuclear_array = ["核一廠", "核二廠", "核三廠", "龍門核能電廠"];
var station_array = ["磺潭", "彭佳嶼", "石門水庫", "清華大學", "石門", "三芝", "石崩山", "茂林", "金山", "野柳", "大鵬", "陽明山", "大坪", "萬里", "台北", "宜蘭", "龍潭", "台中", "台東", "綠島", "高雄", "恆春", "龍泉", "大光", "墾丁", "後壁湖", "澳底", "貢寮", "阿里山", "金門氣象站", "榮湖淨水廠", "椰油", "台南", "龍門", "雙溪", "三港", "新竹", "花蓮", "澎湖", "七美", "東引", "馬祖", "滿州", "板橋", "屏東市", "小琉球", "基隆", "頭城", "竹北", "苗栗", "合歡山", "南投", "彰化", "雲林", "嘉義", "貯存場大門口", "蘭嶼氣象站"];
var local = ["北部地區", "中部地區", "南部地區", "東部地區", "離島地區"];
var County_option = ["臺北市", "新北市", "新北市第一部分", "新北市第二部分", "宜蘭縣", "基隆市", "嘉義縣市", "桃園市", "新竹市", "南投縣", "屏東縣", "臺東縣", "澎湖縣", "金門縣", "連江縣", "新竹縣市", "核一廠", "核二廠", "核三廠", "龍門核能電廠"];
var county_array = ["南投縣", "連江縣", "馬祖", "南投", "雲林縣", "雲林", "金門縣", "金門", "苗栗縣", "苗栗", "高雄市", "高雄", "嘉義市", "花蓮縣", "花蓮", "嘉義縣", "台東縣", "臺東縣", "台東", "臺東", "嘉義", "基隆市", "台北市", "台南市", "臺南市", "台南", "臺南", "臺北市", "台北", "臺北", "基隆", "宜蘭縣", "台中市", "臺中市", "台中", "澎湖縣", "澎湖", "桃園市", "桃園", "新竹縣", "新竹市", "新竹", "新北市", "新北", "宜蘭", "屏東縣", "屏東", "彰化縣", "彰化", "南海島", "釣魚臺", "南海諸島"];
var option_array = ["臺北市", "新北市第一部分", "新北市第二部分", "基隆市", "宜蘭縣", "桃園市", "新竹市", "南投縣", "屏東縣", "臺東縣", "澎湖縣", "金門縣", "連江縣"];
var locations = [{ Sitename: "磺潭", lng: 121.647, lat: 25.199 }, { Sitename: "彭佳嶼", lng: 122.081985, lat: 25.628234 }, { Sitename: "石門水庫", lng: 121.24, lat: 24.811 }, { Sitename: "清華大學", lng: 120.991, lat: 24.791 }, { Sitename: "石門", lng: 121.562988, lat: 25.291137 }, { Sitename: "三芝", lng: 121.515937, lat: 25.233671 }, { Sitename: "石崩山", lng: 121.56578, lat: 25.263563 }, { Sitename: "茂林", lng: 121.590904, lat: 25.270145 }, { Sitename: "金山", lng: 121.63533, lat: 25.221122 }, { Sitename: "野柳", lng: 121.689033, lat: 25.206285 }, { Sitename: "大鵬", lng: 121.651535, lat: 25.208221 }, { Sitename: "陽明山", lng: 121.54441, lat: 25.162351 }, { Sitename: "大坪", lng: 121.638893, lat: 25.16789 }, { Sitename: "萬里", lng: 121.6885, lat: 25.1765 }, { Sitename: "台北", lng: 121.573898, lat: 25.079105 }, { Sitename: "宜蘭", lng: 121.756317, lat: 24.763992 }, { Sitename: "龍潭", lng: 121.240348, lat: 24.84012 }, { Sitename: "台中", lng: 120.684219, lat: 24.145994 }, { Sitename: "台東", lng: 121.154548, lat: 22.752286 }, { Sitename: "綠島", lng: 121.494251, lat: 22.674938 }, { Sitename: "高雄", lng: 120.34777, lat: 22.650428 }, { Sitename: "恆春", lng: 120.7464, lat: 22.0039 }, { Sitename: "龍泉", lng: 120.72982, lat: 21.980592 }, { Sitename: "大光", lng: 120.740501, lat: 21.951402 }, { Sitename: "墾丁", lng: 120.801422, lat: 21.945169 }, { Sitename: "後壁湖", lng: 120.743415, lat: 21.944574 }, { Sitename: "澳底", lng: 121.923811, lat: 25.047575 }, { Sitename: "貢寮", lng: 121.919738, lat: 25.010583 }, { Sitename: "阿里山", lng: 120.813278, lat: 23.508199 }, { Sitename: "金門氣象站", lng: 118.2893, lat: 24.409 }, { Sitename: "榮湖淨水廠", lng: 118.40886, lat: 24.488347 }, { Sitename: "椰油", lng: 121.5124, lat: 22.0493 }, { Sitename: "台南", lng: 120.236724, lat: 23.037656 }, { Sitename: "龍門", lng: 121.928459, lat: 25.030353 }, { Sitename: "雙溪", lng: 121.862747, lat: 25.03516 }, { Sitename: "三港", lng: 121.880935, lat: 25.053834 }, { Sitename: "新竹", lng: 120.993125, lat: 24.78413 }, { Sitename: "花蓮", lng: 121.613143, lat: 23.975212 }, { Sitename: "澎湖", lng: 119.563316, lat: 23.565568 }, { Sitename: "七美", lng: 119.433548, lat: 23.209926 }, { Sitename: "東引", lng: 120.492577, lat: 26.368233 }, { Sitename: "馬祖", lng: 119.9233, lat: 26.1693 }, { Sitename: "滿州", lng: 120.817985, lat: 22.006177 }, { Sitename: "板橋", lng: 121.442092, lat: 24.99773 }, { Sitename: "屏東市", lng: 120.488616, lat: 22.692823 }, { Sitename: "小琉球", lng: 120.374524, lat: 22.335336 }, { Sitename: "基隆", lng: 121.714202, lat: 25.138729 }, { Sitename: "頭城", lng: 121.903213, lat: 24.94452 }, { Sitename: "竹北", lng: 121.014274, lat: 24.828065 }, { Sitename: "苗栗", lng: 120.842559, lat: 24.582355 }, { Sitename: "合歡山", lng: 121.286935, lat: 24.161601 }, { Sitename: "南投", lng: 120.90805, lat: 23.881248 }, { Sitename: "彰化", lng: 120.535972, lat: 24.063375 }, { Sitename: "雲林", lng: 120.530204, lat: 23.698671 }, { Sitename: "嘉義", lng: 120.432823, lat: 23.496 }, { Sitename: "貯存場大門口", lng: 121.5901, lat: 22.0032 }, { Sitename: "蘭嶼氣象站", lng: 121.5585, lat: 22.0369 }];
var county_options = require('./county_list.json');
var generator = require("./generator.js");

const { stringify } = require('actions-on-google/dist/common');

const SelectContexts = {
    parameter: 'select ',
}

app.intent('預設歡迎語句', (conv) => {

    return new Promise(
        function(resolve, reject) {
            database.ref('/TWradiation').on('value', e => { resolve(e.val().PublishTime) });

        }).then(function(PublishTime) {

        if (conv.screen) {
            if (conv.user.last.seen) {
                conv.ask(new SimpleResponse({
                    speech: `<speak><p><s>歡迎回來，請問你要查詢哪一個站點呢?</s></p></speak>`,
                    text: '歡迎回來!'
                }));
            } else {
                conv.ask(new SimpleResponse({
                    speech: `<speak><p><s>歡迎使用輻射查詢精靈!</s><s>我能提供各縣市的環境輻射查詢服務，每五分鐘數據會刷新一次。</s></p></speak>`,
                    text: '歡迎使用!'
                }));
            }

            conv.ask(new BasicCard({
                //image: new Image({url:picture,alt:'Pictures',}),
                title: '環境輻射即時監測資訊查詢',
                subtitle: "每五分鐘更新一次數據。\n各監測站因網路傳輸與資料處理等因素，\n偵測結果之時間與實際時間相差約5~15分鐘。",
                text: "測站資訊發布時間 • " + PublishTime,
                buttons: new Button({ title: '原子能委員會', url: 'https://www.aec.gov.tw/trmc/', display: 'CROPPED', }),
            }));
            conv.ask(new Suggestions('🌎 最近的測站', '🔎依區域查詢', '☢依核電廠查詢', '語音指令範例', '微西弗是什麼 ', '如何加入日常安排', '👋 掰掰'));

        } else {
            conv.ask(new SimpleResponse({
                speech: `<speak><p><s>歡迎使用輻射查詢精靈</s></p></speak>`,
                text: '歡迎使用'
            }));
            conv.ask(new SimpleResponse({
                speech: `<speak><p><s>請試著問我要查詢的縣市!</s><s>例如<break time="0.5s"/>幫我查台北市<break time="0.2s"/>或<break time="0.2s"/>南投狀況怎樣?</s></p></speak>`,
                text: '請輕觸下方卡片來選擇查詢區域!'
            }));
        }

    }).catch(function(error) {
        conv.ask(new SimpleResponse({
            speech: `<speak><p><s>獲取資料發生錯誤，請稍後再試。</s></p></speak>`,
            text: '獲取資訊發生未知錯誤',
        }));
        console.log(error)
        conv.close(new BasicCard({
            image: new Image({ url: 'https://dummyimage.com/1037x539/ef2121/ffffff.png&text=錯誤', alt: 'Pictures', }),
            title: "發生錯誤，請稍後再試",
            text: String(error),
            display: 'CROPPED',
        }));
    });
});

app.intent('預設頁面', (conv) => {

    conv.ask(new SimpleResponse({
        speech: `<speak><p><s>請選擇查詢方式!你可以透過區域查詢查看縣市列表或是查看鄰近核電廠的測站資訊<break time="1s"/>請選擇。</s></p></speak>`,
        text: '請輕觸下方卡片來選擇查詢方式!'
    }));

    conv.ask(new Carousel({
        title: 'Carousel Title',
        items: {
            'Local': {
                title: '區域查詢',
                description: '查看全台各地的測站',
            },
            'Nuclear': {
                title: '核電廠查詢',
                description: '查看核電廠周遭的測站',
            },
        },
    }));
    conv.ask(new Suggestions('🌎 最近的測站', '語音指令範例', '微西弗是什麼', '👋 掰掰'));

});

app.intent('依區域查詢', (conv) => {

    conv.contexts.set(SelectContexts.parameter, 1);

    if (conv.screen) { conv.ask('請輕觸下方卡片來選擇查詢區域'); } else {
        conv.ask(new SimpleResponse({
            speech: `<speak><p><s>請選擇要查詢的區域!</s><s>選項有以下幾個<break time="0.5s"/>北部地區<break time="0.2s"/>中部地區<break time="0.2s"/>南部地區<break time="0.2s"/>東部地區<break time="0.2s"/>離島地區<break time="1s"/>請選擇。</s></p></speak>`,
            text: '請輕觸下方卡片來選擇查詢區域!'
        }));
    }
    conv.ask(new Carousel(county_options));
    conv.ask(new Suggestions('🌎 最近的測站', '依據核電廠查詢', '語音指令範例', '👋 掰掰'));

});

app.intent('依核電廠查詢', (conv) => {

    conv.contexts.set(SelectContexts.parameter, 1);

    if (conv.screen) { conv.ask('請輕觸下方卡片來選擇核電廠'); } else {
        conv.ask(new SimpleResponse({
            speech: `<speak><p><s>請選擇要查詢的區域!</s><s>選項有以下幾個<break time="0.5s"/>核一廠<break time="0.2s"/>核二廠<break time="0.2s"/>核三廠<break time="0.2s"/>龍門核能電廠<break time="1s"/>請選擇。</s></p></speak>`,
            text: '請輕觸下方卡片來選擇查詢區域!'
        }));
    }
    conv.ask(new Carousel({
        title: 'Carousel Title',
        items: {
            '核一廠': {
                title: '核一廠',
                description: '新北市石門區',
            },
            '核二廠': {
                title: '核二廠',
                description: '新北市萬里區',
            },
            '核三廠': {
                title: '核三廠',
                description: '屏東縣恆春鎮',
            },
            '龍門核能電廠': {
                synonyms: ['核四'],
                title: '龍門核能電廠',
                description: '新北市貢寮區',
            },
        },
    }));
    conv.ask(new Suggestions('🌎 最近的測站', '依據縣市查詢', '語音指令範例', '👋 掰掰'));

});

app.intent('縣市查詢結果', (conv, input, option) => {

    return new Promise(
        function(resolve, reject) {
            database.ref('/TWradiation').on('value', e => { resolve(e.val()) });

        }).then(function(final_data) {

        if (local.indexOf(option) !== -1) {
            if (conv.screen) {
                conv.ask(new SimpleResponse({
                    speech: `<speak><p><s>以下是${option}的縣市列表!<break time="0.5s"/>請查看</s></p></speak>`,
                    text: '以下是「' + option + '」的縣市列表'
                }));
            } else { conv.ask(new SimpleResponse(`<speak><p><s>以下是${option}的監測站列表</s><s>選項有以下幾個<break time="0.5s"/>${option_list[option]}<break time="1s"/>請選擇。</s></p></speak>`)); }
            conv.contexts.set(SelectContexts.parameter, 1);

            conv.ask(new Carousel({
                title: 'Carousel Title',
                items: county_option[option]
            }));
            conv.ask(new Suggestions('查詢其他縣市', '👋 掰掰'));
        } else if (option_array.indexOf(option) !== -1) {
            conv.contexts.set(SelectContexts.parameter, 5);
            if (conv.screen) {
                conv.ask('以下是「' + option + '」對應的選項');
            } else {
                conv.ask(new SimpleResponse(`<speak><p><s>請選擇您在${option}要查詢的測站!</s><s>選項有以下幾個<break time="0.5s"/>${option_list[option]}<break time="1s"/>請選擇。</s></p></speak>`));
            }

            var the_array = option_list[option].split('、');
            var county_list = {};

            for (var i = 0; i < the_array.length; i++) {

                var svc_temp = final_data.data[the_array[i]]["SVC"];

                county_list[the_array[i]] = {
                    title: the_array[i],
                    description: generator.status_generator(svc_temp),
                    image: new Image({ url: generator.picture_generator(svc_temp), alt: 'Image alternate text', }),
                }
            }
            conv.ask(new Carousel({
                title: 'Carousel Title',
                items: county_list,
            }));

            conv.ask(new Suggestions('查詢其他縣市'));
        } else if (nuclear_array.indexOf(option) !== -1) {
            conv.contexts.set(SelectContexts.parameter, 5);
            if (conv.screen) {
                conv.ask(new SimpleResponse({
                    speech: `<speak><p><s>以下是${option}的監測站列表!<break time="0.5s"/>請查看</s></p></speak>`,
                    text: '以下是「' + option + '」的測站列表'
                }));
            } else { conv.ask(new SimpleResponse(`<speak><p><s>以下是${option}的監測站列表</s><s>選項有以下幾個<break time="0.5s"/>${option_list[option]}<break time="1s"/>請選擇。</s></p></speak>`)); }

            var the_array = option_list[option].split('、');
            var county_list = {};

            for (var i = 0; i < the_array.length; i++) {
                var svc_temp = final_data.data[the_array[i]]["SVC"];
                county_list[the_array[i]] = {
                    title: the_array[i],
                    description: generator.status_generator(svc_temp),
                    image: new Image({ url: generator.picture_generator(svc_temp), alt: 'Image alternate text', }),
                }
            }
            conv.ask(new Carousel({
                title: 'Carousel Title',
                items: county_list,
            }));

            conv.ask(new Suggestions('查看其他核電廠', '👋 掰掰'));

        } else if (option === "Local") {
            conv.contexts.set(SelectContexts.parameter, 1);
            if (conv.screen) { conv.ask('請輕觸下方卡片來選擇查詢區域'); } else {
                conv.ask(new SimpleResponse({
                    speech: `<speak><p><s>請選擇要查詢的區域!</s><s>選項有以下幾個<break time="0.5s"/>北部地區<break time="0.2s"/>中部地區<break time="0.2s"/>南部地區<break time="0.2s"/>東部地區<break time="0.2s"/>離島地區<break time="1s"/>請選擇。</s></p></speak>`,
                    text: '請輕觸下方卡片來選擇查詢區域!'
                }));
            }
            conv.ask(new Carousel(county_options));

            conv.ask(new Suggestions('🌎 最近的測站', '依據核電廠查詢', '語音指令範例', '👋 掰掰'));

        } else if (option === "Nuclear") {
            conv.contexts.set(SelectContexts.parameter, 1);
            if (conv.screen) { conv.ask('請輕觸下方卡片來選擇核電廠'); } else {
                conv.ask(new SimpleResponse({
                    speech: `<speak><p><s>請選擇要查詢的區域!</s><s>選項有以下幾個<break time="0.5s"/>核一廠<break time="0.2s"/>核二廠<break time="0.2s"/>核三廠<break time="0.2s"/>龍門核能電廠<break time="1s"/>請選擇。</s></p></speak>`,
                    text: '請輕觸下方卡片來選擇查詢區域!'
                }));
            }
            conv.ask(new Carousel({
                title: 'Carousel Title',
                items: {
                    '核一廠': {
                        title: '核一廠',
                        description: '新北市石門區',
                    },
                    '核二廠': {
                        title: '核二廠',
                        description: '新北市萬里區',
                    },
                    '核三廠': {
                        title: '核三廠',
                        description: '屏東縣恆春鎮',
                    },
                    '龍門核能電廠': {
                        synonyms: ['核四'],
                        title: '龍門核能電廠',
                        description: '新北市貢寮區',
                    },
                },
            }));
            conv.ask(new Suggestions('🌎 最近的測站', '依據縣市查詢', '語音指令範例', '👋 掰掰'));

        } else if (station_array.indexOf(option) !== -1) {

            var number = final_data.data[option]["SVC"];
            var Status = generator.status_generator(number);

            var speech_content = {
                speech: `<speak><p><s>根據最新資料顯示，${option}監測站的環境輻射為每小時${number}微西弗，該輻射劑量屬於${Status}</s><s>根據維基百科的資料，這個劑量相當於${generator.info_generator(number)}</s></p></speak>`,
                text: '以下為該監測站的詳細資訊'
            };
            var card_content = {
                image: new Image({ url: generator.picture_generator_big(number), alt: 'Pictures', }),
                title: '「' + option + '」監測站',
                subtitle: '屬於' + Status,
                display: 'CROPPED',
                text: '根據維基百科的資料，  \n' + '該劑量相當於' + generator.info_generator(number) + '  \n  \n**測站資訊發布時間** • ' +final_data.data[option]["PublishTime"],
            }

            if (Status === "儀器故障或校驗") {
                speech_content.speech = `<speak><p><s>由於${option}監測站數據不足或處於維修狀態，我無法提供你最新資訊。</s></p></speak>`;
                card_content.title = '有效數據不足';
                card_content.text = '設備維護、儀器校正、儀器異常、傳輸異常、電力異常 \n或有效數據不足等需查修維護情形，以致資料暫時中斷服務。  \n   \n**測站資訊發布時間** • ' + final_data.data[option]["PublishTime"];
            }

            conv.ask(new SimpleResponse(speech_content));
            conv.ask(new BasicCard(card_content));

            conv.ask(new Suggestions('把它加入日常安排', '回主頁面'));
            conv.user.storage.choose_station = option;
        } else {
            conv.contexts.set(SelectContexts.parameter, 1);
            conv.ask(new SimpleResponse({
                speech: `<speak><p><s>抱歉，查詢過程中發生錯誤。請重新查詢。</s></p></speak>`,
                text: '查詢過程發生錯誤，\n請重新選擇'
            }));

            conv.ask(new Carousel({
                title: 'Carousel Title',
                items: {
                    'Local': {
                        title: '區域查詢',
                        description: '查看全台各地的測站',
                    },
                    'Nuclear': {
                        title: '核電廠查詢',
                        description: '查看核電廠周遭的測站',
                    },
                },
            }));

            conv.ask(new Suggestions('🌎 最近的測站', '語音指令範例', '👋 掰掰'));

        }
    }).catch(function(error) {
        conv.ask(new SimpleResponse({
            speech: `<speak><p><s>獲取資料發生錯誤，請稍後再試。</s></p></speak>`,
            text: '獲取資訊發生未知錯誤',
        }));
        console.log(error)
        conv.close(new BasicCard({
            image: new Image({ url: 'https://dummyimage.com/1037x539/ef2121/ffffff.png&text=錯誤', alt: 'Pictures', }),
            title: "發生錯誤，請稍後再試",
            text: String(error),
            display: 'CROPPED',
        }));
    });

});

app.intent('預設罐頭回覆', (conv) => {
    var word1 = county_array[parseInt(Math.random() * 19)];
    var word2 = county_array[20 + parseInt(Math.random() * 28)];

    if (conv.input.type === "VOICE") { //如果輸入是語音，則顯示錯誤處理方法
        conv.ask(new SimpleResponse({
            speech: `<speak><p><s>抱歉，我不懂你的意思</s><s>請試著問我<break time="0.2s"/>${word1}輻射強度如何?<break time="0.2s"/>或<break time="0.2s"/>幫我查詢${word2}</s></p></speak>`,
            text: '試著提問來快速存取縣市列表，\n或點選建議卡片來進行操作!'
        }));
        if (conv.screen) {
            conv.ask(new BasicCard({
                title: "語音查詢範例",
                subtitle: "以下是你可以嘗試的指令",
                text: " • *「" + word1 + "輻射強度為何?」*  \n • *「幫我查詢" + word2 + "」*  \n • *「我想知道" + county_array[parseInt(Math.random() * 48)] + "的背景輻射情形」*  \n • *「幫我找" + county_array[parseInt(Math.random() * 48)] + "」*  \n • *「我想看" + county_array[parseInt(Math.random() * 48)] + "」*  \n • *「" + county_array[parseInt(Math.random() * 48)] + "狀況好嗎?」*  \n • *「我要查" + county_array[parseInt(Math.random() * 48)] + "」*",
            }));
            conv.ask(new Suggestions(word1 + '輻射強度為何?', '幫我查詢' + word2));
        } else { conv.ask(`<speak><p><s>或對我說<break time="0.2s"/>區域查詢<break time="0.2s"/>來進行區域查詢</s></p></speak>`); }
    } else {
        conv.ask('抱歉，我不懂你的意思，\n請點選建議卡片來進行操作');
        conv.contexts.set(SelectContexts.parameter, 1);
        conv.ask(new Carousel({
            title: 'Carousel Title',
            items: {
                'Local': {
                    title: '區域查詢',
                    description: '查看全台各地的測站',
                },
                'Nuclear': {
                    title: '核電廠查詢',
                    description: '查看核電廠周遭的測站',
                },
            },
        }));
    }
    conv.ask(new Suggestions('🌎 最近的測站', '回主頁面', '👋 掰掰'));
});

app.intent('語音指令範例', (conv) => {
    var word1 = county_array[parseInt(Math.random() * 19)];
    var word2 = county_array[20 + parseInt(Math.random() * 28)];
    var word3 = county_array[parseInt(Math.random() * 48)];

    conv.ask(new SimpleResponse({
        speech: `<speak><p><s>在任意畫面中，你隨時都能快速查詢縣市列表</s><s>你可以試著問<break time="0.2s"/>${word1}輻射強度為何?<break time="0.2s"/>或<break time="0.2s"/>幫我查詢${word2}</s></p></speak>`,
        text: '試著提問來快速存取縣市列表，\n以下是你可以嘗試的詢問方式!'
    }));
    conv.ask(new BasicCard({
        title: "語音查詢範例",
        subtitle: "以下是你可以嘗試的指令",
        text: " • *「" + word1 + "輻射強度如何?」*  \n • *「幫我查詢" + word2 + "」*  \n • *「我想知道" + county_array[parseInt(Math.random() * 48)] + "的背景輻射情形」*  \n • *「幫我找" + county_array[parseInt(Math.random() * 48)] + "」*  \n • *「我想看" + county_array[parseInt(Math.random() * 48)] + "」*  \n • *「" + county_array[parseInt(Math.random() * 48)] + "狀況好嗎?」*  \n • *「我要查" + county_array[parseInt(Math.random() * 48)] + "」*",
    }));
    conv.ask(new Suggestions(word1 + '輻射強度為何?', '幫我查詢' + word2, '我想知道' + word3 + '狀況怎樣', '🌎 最近的測站', '🔎依區域查詢', '👋 掰掰'));

});

app.intent('微西弗是甚麼', (conv) => {
    conv.ask(new SimpleResponse({
        speech: `<speak><p><s>西弗</s><s>是一個用來衡量輻射劑量對生物組織的影響程度的國際單位制導出單位，為受輻射等效生物當量的單位。。</s></p></speak>`,
        text: '說明如下'
    }));
    conv.ask(new Table({
        title: '西弗(Sv)',
        columns: [{ header: "以下是來自維基百科的資訊", align: 'LEADING', }, ],
        rows: [{
            cells: ["是一個用來衡量輻射劑量對生物組織的影響程度的國際單位制導出單位，為受輻射等效生物當量的單位。\n在地球上存在天然輻射，有些源自地球大氣層外界。\n有些可在土壤、礦石中發現些微的天然放射性核素，而空氣及水中亦存在天然放射性氡氣。\n而人體中也含有天然放射性核素鉀40等，因此人類生活隨時都會接受到一些輻射。"],
            dividerAfter: false,
        }, ],
    }));
    conv.ask(new Suggestions('🌎 最近的測站', '語音指令範例', '回主頁面', '👋 掰掰'));

});

app.intent('直接查詢', (conv, { station }) => {

    if (station_array.indexOf(station) === -1) {
        conv.ask(new SimpleResponse({
            speech: `<speak><p><s>抱歉，您所查詢的監測站似乎不存在，我無法提供你最新資訊。</s></p></speak>`,
            text: '找不到你指定的站點'
        }));
        conv.close(new BasicCard({
            image: new Image({ url: "https://dummyimage.com/1037x539/232830/ffffff.png&text=NaN", alt: 'Pictures', }),
            title: '找不到您指定的測站名稱',
            subtitle: '請透過選單尋找現在可查詢的測站',
            display: 'CROPPED',
        }));
        conv.ask(new Suggestions('回主頁面', '👋 掰掰'));

    } else {
        return new Promise(
            function(resolve, reject) {
                database.ref('/TWradiation').on('value', e => { resolve(e.val().data[station]) });
            }).then(function(final_data) {

            var number = final_data["SVC"];
            var Status = generator.status_generator(number);

            if (Status !== "儀器故障或校驗") {

                conv.ask(new SimpleResponse({
                    speech: `<speak><p><s>根據最新資料顯示，${station}監測站的環境輻射為每小時${number}微西弗，該輻射劑量屬於${Status}</s><s>根據維基百科的資料，這個劑量相當於${generator.info_generator(number)}</s></p></speak>`,
                    text: '以下為該監測站的詳細資訊'
                }));

                conv.close(new BasicCard({
                    image: new Image({ url: generator.picture_generator_big(number), alt: 'Pictures', }),
                    title: '「' + station + '」監測站',
                    subtitle: '屬於' + Status,
                    display: 'CROPPED',
                    text: '根據維基百科的資料，  \n' + '該劑量相當於' + generator.info_generator(number) + '  \n  \n**測站資訊發布時間** • ' + final_data["PublishTime"],
                }));
            } else {
                conv.ask(new SimpleResponse({
                    speech: `<speak><p><s>由於${station}監測站數據不足或處於維修狀態，我無法提供你最新資訊。</s></p></speak>`,
                    text: '以下為該監測站的詳細資訊'
                }));
                conv.close(new BasicCard({
                    image: new Image({ url: "https://dummyimage.com/1037x539/232830/ffffff.png&text=NaN", alt: 'Pictures', }),
                    title: '儀器故障或校驗',
                    title: '「' + station + '」儀器故障或校驗',
                    text: '設備維護、儀器校正、儀器異常、傳輸異常、電力異常 \n或儀器故障或校驗等需查修維護情形，以致資料暫時中斷服務。  \n  \n**測站資訊發布時間** • ' + final_data["PublishTime"],
                    display: 'CROPPED',
                }));
            }
        }).catch(function(error) {
            conv.ask(new SimpleResponse({
                speech: `<speak><p><s>糟糕，查詢似乎發生錯誤。請稍後再試。</s></p></speak>`,
                text: '發生錯誤，請稍後再試一次'
            }));
            conv.close(new BasicCard({
                image: new Image({ url: "https://dummyimage.com/1037x539/ef2121/ffffff.png&text=錯誤", alt: 'Pictures', }),
                title: '數據加載發生問題',
                text: String(error),
                display: 'CROPPED',
            }));
        });
    }
});

app.intent('日常安排教學', (conv, { station }) => {

    if (station !== "") { var choose_station = station; } else { var choose_station = conv.user.storage.choose_station; }
    if (station_array.indexOf(choose_station) === -1) { choose_station = station_array[parseInt(Math.random() * 56)]; }
    conv.ask(new SimpleResponse({
        speech: `<speak><p><s>透過加入日常安排，你可以快速存取要查詢的站點。</s><s>舉例來說，如果你把${choose_station}加入日常安排。你即可隨時呼叫我查詢該站點的最新環境輻射數值!</s><s>以下為詳細說明</s></p></speak>`,
        text: '以下為詳細說明'
    }));

    conv.ask(new BasicCard({
        image: new Image({ url: "https://raw.githubusercontent.com/hank199599/Google-Assistant-APP/master/%E8%BC%BB%E5%B0%84%E7%B2%BE%E9%9D%88/assets/rug48NK.png", alt: 'Pictures', }),
        title: '將「' + choose_station + '」加入日常安排',
        display: 'CROPPED',
        subtitle: '1.點擊畫面右上方大頭貼 > 點擊[設定]\n2.切換到[Google助理]分頁 > 點擊[日常安排]\n3.點擊[新增日常安排]\n4.「新增指令(必填)」輸入「周遭輻射」\n5.「新增動作」輸入\n「叫輻射精靈查詢' + choose_station + '站」\n6.輸入完成後點擊「儲存」\n7.現在，你可以透過說出或輸入「周遭輻射」來快速查詢' + choose_station + '的環境輻射數值!',
    }));

    conv.ask(new Suggestions('🌎最近的測站', '回主頁面', '👋 掰掰'));

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

            conv.ask(new Suggestions('重新定位', '把它加入日常安排'));

            if (coordinates) {
                const myLocation = {
                    lat: coordinates.latitude,
                    lng: coordinates.longitude
                };
                var Sitename = (findNearestLocation(myLocation, locations)).location.Sitename; //透過模組找到最近的測站				
                return new Promise(
                    function(resolve, reject) {
                        database.ref('/TWradiation').on('value', e => { resolve(e.val().data[station]) });
                    }).then(function(final_data) {

                    conv.ask(new SimpleResponse({ speech: `<speak><p><s>查詢完成!</s><s>距離你最近的測站是<break time="0.2s"/>${Sitename}。</s></p></speak>`, text: '最近的測站是「' + Sitename + '」!' }));

                    var number = final_data["SVC"];
                    var Status = generator.status_generator(number);

                    var speech_content = {
                        speech: `<speak><p><s>根據最新資料顯示，${Sitename}監測站的環境輻射為每小時${number}微西弗，該輻射劑量屬於${Status}</s><s>根據維基百科的資料，這個劑量相當於${generator.info_generator(number)}</s></p></speak>`,
                        text: '以下為該監測站的詳細資訊'
                    };
                    var card_content = {
                        image: new Image({ url: generator.picture_generator_big(number), alt: 'Pictures', }),
                        title: '「' + Sitename + '」監測站',
                        subtitle: '屬於' + Status,
                        display: 'CROPPED',
                        text: '根據維基百科的資料，  \n' + '該劑量相當於' + generator.info_generator(number) + '  \n  \n**測站資訊發布時間** • ' + final_data.data[option]["PublishTime"],
                    }

                    if (Status === "儀器故障或校驗") {
                        speech_content.speech = `<speak><p><s>由於${Sitename}監測站數據不足或處於維修狀態，我無法提供你最新資訊。</s></p></speak>`;
                        card_content.title = '有效數據不足';
                        card_content.text = '設備維護、儀器校正、儀器異常、傳輸異常、電力異常 \n或有效數據不足等需查修維護情形，以致資料暫時中斷服務。  \n   \n**測站資訊發布時間** • ' + final_data.data[option]["PublishTime"];
                    }

                    conv.ask(new SimpleResponse(speech_content));
                    conv.ask(new BasicCard(card_content));

                });
            } else {
                conv.ask(new SimpleResponse({
                    speech: `<speak><p><s>糟糕，查詢似乎發生錯誤。</s><s>請稍後再試。</s></p></speak>`,
                    text: '發生錯誤，請稍後再試一次'
                }));
                conv.ask(new BasicCard({
                    image: new Image({ url: "https://dummyimage.com/1037x539/ef2121/ffffff.png&text=錯誤", alt: 'Pictures', }),
                    title: '數據加載發生問題',
                    text: String(error),
                    display: 'CROPPED',
                }));
            }
        } else { conv.ask(new SimpleResponse({ speech: `<speak><p><s>糟糕，我無法得知你的目前位置。</s><s>請稍後再試。</s></p></speak>`, text: "發生錯誤，請開啟GPS功能然後再試一次。" })); }
    } else { conv.ask(new SimpleResponse({ speech: `<speak><p><s>很抱歉，由於未取得你的授權因此查詢失敗。</s><s>不過你隨時可以回來再試一次。</s></p></speak>`, text: "發生錯誤，未取得你的授權。" })); }
    conv.ask(new Suggestions('回主頁面', '👋 掰掰'));
    conv.user.storage.choose_station = Sitename;

});

app.intent('直接查詢縣市選單', (conv, { County }) => {

    return new Promise(
        function(resolve, reject) {
            database.ref('/TWradiation').on('value', e => { resolve(e.val().data) });
        }).then(function(final_data) {

        if (conv.input.raw.indexOf('新北') !== -1) { County = "新北市"; } else if (conv.input.raw.indexOf('新竹') !== -1) { County = "新竹縣市"; } else if (conv.input.raw === "台東") { County = "臺東"; } else if (conv.input.raw.indexOf('第一部分') !== -1) { County = "新北市第一部分"; } else if (conv.input.raw.indexOf('第二部分') !== -1) { County = "新北市第二部分"; } else if (conv.input.raw.indexOf('核一廠') !== -1) { County = "核一廠"; } else if (conv.input.raw.indexOf('核二廠') !== -1) { County = "核二廠"; } else if (conv.input.raw.indexOf('核三廠') !== -1) { County = "核三廠"; } else if (conv.input.raw.indexOf('核四廠') !== -1) { County = "龍門核能電廠"; }

        if (County_option.indexOf(County) !== -1) {
            conv.contexts.set(SelectContexts.parameter, 1);

            var the_array = option_list[County].split('、');
            var county_list = {};

            if (County === "新北市") {
                conv.ask(new SimpleResponse({ speech: `<speak><p><s>由於「新北市」的測站數目較多，分為兩部份顯示，請選擇</s></p></speak>`, text: '「新北市」監測站數量較多，\n分為兩部份顯示' }));

                county_list = {
                    "新北市第一部分": {
                        "synonyms": [
                            "第一"
                        ],
                        "title": "新北市(一)",
                        "description": "New Taipei City  \nPart 1"
                    },
                    "新北市第二部分": {
                        "synonyms": [
                            "第二"
                        ],
                        "title": "新北市(二)",
                        "description": "New Taipei City  \nPart 2"
                    }
                }
            } else {
                if (conv.screen) {
                    conv.ask(new SimpleResponse({
                        speech: `<speak><p><s>以下是${County}的監測站列表!<break time="0.5s"/>請查看</s></p></speak>`,
                        text: '以下是「' + County + '」的測站列表'
                    }));
                } else { conv.ask(new SimpleResponse(`<speak><p><s>以下是${County}的監測站列表</s><s>選項有以下幾個<break time="0.5s"/>${option_list[County]}<break time="1s"/>請選擇。</s></p></speak>`)); }

                for (var i = 0; i < the_array.length; i++) {
                    var svc_temp = final_data[the_array[i]]["SVC"];
                    county_list[the_array[i]] = {
                        title: the_array[i],
                        description: generator.status_generator(svc_temp),
                        image: new Image({ url: generator.picture_generator(svc_temp), alt: 'Image alternate text', }),
                    }
                }
            }

            conv.ask(new Carousel({
                title: 'Carousel Title',
                items: county_list,
            }));

        } else if (station_array.indexOf(County) !== -1) {

            var number = final_data[County]["SVC"];
            var Status = generator.status_generator(number);

            var speech_content = {
                speech: `<speak><p><s>根據最新資料顯示，${County}監測站的環境輻射為每小時${number}微西弗，該輻射劑量屬於${Status}</s><s>根據維基百科的資料，這個劑量相當於${generator.info_generator(number)}</s></p></speak>`,
                text: '以下為該監測站的詳細資訊'
            };
            var card_content = {
                image: new Image({ url: generator.picture_generator_big(number), alt: 'Pictures', }),
                title: '「' + County + '」監測站',
                subtitle: '屬於' + Status,
                display: 'CROPPED',
                text: '根據維基百科的資料，  \n' + '該劑量相當於' + generator.info_generator(number) + '  \n  \n**測站資訊發布時間** • ' + final_data.data[option]["PublishTime"],
            }

            if (Status === "儀器故障或校驗") {
                speech_content.speech = `<speak><p><s>由於${County}監測站數據不足或處於維修狀態，我無法提供你最新資訊。</s></p></speak>`;
                card_content.title = '有效數據不足';
                card_content.text = '設備維護、儀器校正、儀器異常、傳輸異常、電力異常 \n或有效數據不足等需查修維護情形，以致資料暫時中斷服務。  \n   \n**測站資訊發布時間** • ' + final_data.data[option]["PublishTime"];
            }

            conv.ask(new SimpleResponse(speech_content));
            conv.ask(new BasicCard(card_content));
            conv.ask(new Suggestions('把它加入日常安排'));

        } else {
            County = "undefined";
            conv.contexts.set(SelectContexts.parameter, 1);
            if (conv.screen) { conv.ask('我不懂你的意思，\n請輕觸下方卡片選擇查詢方式'); } else { conv.ask(`<speak><p><s>我不懂你的意思，請試著選擇查詢方式!</s><s>選項有以下幾個<break time="0.5s"/>區域查詢<break time="0.2s"/>核電廠查詢<break time="1s"/>請選擇。</s></p></speak>`); }

            conv.ask(new Carousel({
                title: 'Carousel Title',
                items: {
                    'Local': {
                        title: '區域查詢',
                        description: '查看全台各地的測站',
                    },
                    'Nuclear': {
                        title: '核電廠查詢',
                        description: '查看核電廠周遭的測站',
                    },
                },
            }));
            conv.ask(new Suggestions('🌎 最近的測站', '語音指令範例'));
        }
        if (conv.screen) {
            if (County !== "undefined") { conv.ask(new Suggestions('回主頁面')); }
            conv.ask(new Suggestions('👋 掰掰'));
            conv.user.storage.choose_station = County;
        }
    }).catch(function(error) {
        conv.ask(new SimpleResponse({
            speech: `<speak><p><s>獲取資料發生錯誤，請稍後再試。</s></p></speak>`,
            text: '獲取資訊發生未知錯誤',
        }));
        console.log(error)
        conv.close(new BasicCard({
            image: new Image({ url: 'https://dummyimage.com/1037x539/ef2121/ffffff.png&text=錯誤', alt: 'Pictures', }),
            title: "發生錯誤，請稍後再試",
            text: String(error),
            display: 'CROPPED',
        }));
    });
});

app.intent('結束對話', (conv) => {
    conv.user.storage = {}; //離開同時清除暫存資料
    conv.ask('希望能幫到一點忙!');
    conv.ask(new SimpleResponse({ speech: '下次見', text: '下次見 👋', }));
    conv.close(new BasicCard({
        title: '感謝您的使用!',
        text: '如果有任何需要改進的地方，  \n歡迎到簡介頁面評分或給予反饋，謝謝!',
        buttons: new Button({ title: '開啟本程式的商店頁面', url: 'https://assistant.google.com/services/a/uid/000000a573924fc8', }),
    }));
});

// Set the DialogfemptyApp object to handle the HTTPS POST request.
exports.tw_radiation_index = functions.https.onRequest(app);