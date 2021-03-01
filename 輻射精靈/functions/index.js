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
    LinkOutSuggestion,
    BrowseCarousel,
    BrowseCarouselItem,
    items,
    Table
} = require('actions-on-google');

const functions = require('firebase-functions');
const findNearestLocation = require('map-nearest-location');
const admin = require('firebase-admin');
const replaceString = require('replace-string');
const getCSV = require('get-csv');
var option_list = require("./option.json");
var county_option = require("./county_option.json");

let serviceAccount = require("./config/b1a2b-krmfch-firebase-adminsdk-1tgdm-135c5737d0.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://b1a2b-krmfch.firebaseio.com/"
});

const database = admin.database();

const app = dialogflow({ debug: true });

var i = 0;
var return_array = [];
var time_array = [];
var return_time = [];
var SVC_list = [];
var PublishTime = "2020-02-14 01:10";
var nuclear_array = ["核一廠", "核二廠", "核三廠", "龍門核能電廠"];
var station_array = ["磺潭", "彭佳嶼", "石門水庫", "清華大學", "石門", "三芝", "石崩山", "茂林", "金山", "野柳", "大鵬", "陽明山", "大坪", "萬里", "台北", "宜蘭", "龍潭", "台中", "台東", "綠島", "高雄", "恆春", "龍泉", "大光", "墾丁", "後壁湖", "澳底", "貢寮", "阿里山", "金門氣象站", "榮湖淨水廠", "椰油", "台南", "龍門", "雙溪", "三港", "新竹", "花蓮", "澎湖", "七美", "東引", "馬祖", "滿州", "板橋", "屏東市", "小琉球", "基隆", "頭城", "竹北", "苗栗", "合歡山", "南投", "彰化", "雲林", "嘉義", "貯存場大門口", "蘭嶼氣象站"];
var local = ["北部地區", "中部地區", "南部地區", "東部地區", "離島地區"];
var County_option = ["臺北市", "新北市", "新北市第一部分", "新北市第二部分", "宜蘭縣", "基隆市", "嘉義縣市", "桃園市", "新竹市", "南投縣", "屏東縣", "臺東縣", "澎湖縣", "金門縣", "連江縣", "新竹縣市", "核一廠", "核二廠", "核三廠", "龍門核能電廠"];
var county_array = ["南投縣", "連江縣", "馬祖", "南投", "雲林縣", "雲林", "金門縣", "金門", "苗栗縣", "苗栗", "高雄市", "高雄", "嘉義市", "花蓮縣", "花蓮", "嘉義縣", "台東縣", "臺東縣", "台東", "臺東", "嘉義", "基隆市", "台北市", "台南市", "臺南市", "台南", "臺南", "臺北市", "台北", "臺北", "基隆", "宜蘭縣", "台中市", "臺中市", "台中", "澎湖縣", "澎湖", "桃園市", "桃園", "新竹縣", "新竹市", "新竹", "新北市", "新北", "宜蘭", "屏東縣", "屏東", "彰化縣", "彰化", "南海島", "釣魚臺", "南海諸島"];
var option_array = ["臺北市", "新北市第一部分", "新北市第二部分", "基隆市", "宜蘭縣", "桃園市", "新竹市", "南投縣", "屏東縣", "臺東縣", "澎湖縣", "金門縣", "連江縣"];
var locations = [{ Sitename: "磺潭", lng: 121.647, lat: 25.199 }, { Sitename: "彭佳嶼", lng: 122.081985, lat: 25.628234 }, { Sitename: "石門水庫", lng: 121.24, lat: 24.811 }, { Sitename: "清華大學", lng: 120.991, lat: 24.791 }, { Sitename: "石門", lng: 121.562988, lat: 25.291137 }, { Sitename: "三芝", lng: 121.515937, lat: 25.233671 }, { Sitename: "石崩山", lng: 121.56578, lat: 25.263563 }, { Sitename: "茂林", lng: 121.590904, lat: 25.270145 }, { Sitename: "金山", lng: 121.63533, lat: 25.221122 }, { Sitename: "野柳", lng: 121.689033, lat: 25.206285 }, { Sitename: "大鵬", lng: 121.651535, lat: 25.208221 }, { Sitename: "陽明山", lng: 121.54441, lat: 25.162351 }, { Sitename: "大坪", lng: 121.638893, lat: 25.16789 }, { Sitename: "萬里", lng: 121.6885, lat: 25.1765 }, { Sitename: "台北", lng: 121.573898, lat: 25.079105 }, { Sitename: "宜蘭", lng: 121.756317, lat: 24.763992 }, { Sitename: "龍潭", lng: 121.240348, lat: 24.84012 }, { Sitename: "台中", lng: 120.684219, lat: 24.145994 }, { Sitename: "台東", lng: 121.154548, lat: 22.752286 }, { Sitename: "綠島", lng: 121.494251, lat: 22.674938 }, { Sitename: "高雄", lng: 120.34777, lat: 22.650428 }, { Sitename: "恆春", lng: 120.7464, lat: 22.0039 }, { Sitename: "龍泉", lng: 120.72982, lat: 21.980592 }, { Sitename: "大光", lng: 120.740501, lat: 21.951402 }, { Sitename: "墾丁", lng: 120.801422, lat: 21.945169 }, { Sitename: "後壁湖", lng: 120.743415, lat: 21.944574 }, { Sitename: "澳底", lng: 121.923811, lat: 25.047575 }, { Sitename: "貢寮", lng: 121.919738, lat: 25.010583 }, { Sitename: "阿里山", lng: 120.813278, lat: 23.508199 }, { Sitename: "金門氣象站", lng: 118.2893, lat: 24.409 }, { Sitename: "榮湖淨水廠", lng: 118.40886, lat: 24.488347 }, { Sitename: "椰油", lng: 121.5124, lat: 22.0493 }, { Sitename: "台南", lng: 120.236724, lat: 23.037656 }, { Sitename: "龍門", lng: 121.928459, lat: 25.030353 }, { Sitename: "雙溪", lng: 121.862747, lat: 25.03516 }, { Sitename: "三港", lng: 121.880935, lat: 25.053834 }, { Sitename: "新竹", lng: 120.993125, lat: 24.78413 }, { Sitename: "花蓮", lng: 121.613143, lat: 23.975212 }, { Sitename: "澎湖", lng: 119.563316, lat: 23.565568 }, { Sitename: "七美", lng: 119.433548, lat: 23.209926 }, { Sitename: "東引", lng: 120.492577, lat: 26.368233 }, { Sitename: "馬祖", lng: 119.9233, lat: 26.1693 }, { Sitename: "滿州", lng: 120.817985, lat: 22.006177 }, { Sitename: "板橋", lng: 121.442092, lat: 24.99773 }, { Sitename: "屏東市", lng: 120.488616, lat: 22.692823 }, { Sitename: "小琉球", lng: 120.374524, lat: 22.335336 }, { Sitename: "基隆", lng: 121.714202, lat: 25.138729 }, { Sitename: "頭城", lng: 121.903213, lat: 24.94452 }, { Sitename: "竹北", lng: 121.014274, lat: 24.828065 }, { Sitename: "苗栗", lng: 120.842559, lat: 24.582355 }, { Sitename: "合歡山", lng: 121.286935, lat: 24.161601 }, { Sitename: "南投", lng: 120.90805, lat: 23.881248 }, { Sitename: "彰化", lng: 120.535972, lat: 24.063375 }, { Sitename: "雲林", lng: 120.530204, lat: 23.698671 }, { Sitename: "嘉義", lng: 120.432823, lat: 23.496 }, { Sitename: "貯存場大門口", lng: 121.5901, lat: 22.0032 }, { Sitename: "蘭嶼氣象站", lng: 121.5585, lat: 22.0369 }];
var picurl1 = "";
var picurl2 = "";
var picurl3 = "";
var picurl4 = "";
var picurl5 = ""
var picurl6 = "";
var picurl7 = "";
var picurl8 = "";
var picurl9 = "";
var picurl10 = "";
var status1 = "";
var status2 = "";
var status3 = "";
var status4 = "";
var status5 = "";
var status6 = "";
var status7 = "";
var status8 = "";
var status9 = "";
var status10 = "";
var SVC1 = "";
var SVC2 = "";
var SVC3 = "";
var SVC4 = "";
var SVC5 = ""
var SVC6 = "";
var SVC7 = "";
var SVC8 = "";
var SVC9 = "";
var SVC10 = "";
var number = 0;
var indexnumber = 0;
var SVC = "";
var output_title = "";
var info_output = "";
var Status = "";
var picture = "";
var info = "";
var word1 = "";
var word2 = "";
var word3 = "";
var Sitename = "";
var choose_station = "";
const SelectContexts = {
    parameter: 'select ',
}

function radiation_data() {

    return new Promise(function(resolve, reject) {
        getCSV('https://www.aec.gov.tw/dataopen/index.php?id=2').then(function(response) {
            var origin_report = response;
            resolve(origin_report)
        }).catch(function(error) {
            var reason = new Error('資料獲取失敗');
            reject(reason)
        });
    }).then(function(origin_data) {
        PublishTime = origin_data[0]['�ɶ�'];
        for (i = 0; i < origin_data.length; i++) {
            return_array[i] = origin_data[i]['�ʴ���(�L�襱/��)'];
            time_array[i] = origin_data[i]['�ɶ�'];
        }
        database.ref('/TWradiation').update({ PublishTime: time_array });
        database.ref('/TWradiation').update({ data: return_array });

    }).catch(function(error) { console.log(error); });
}

function picture_generator(number) {
    var pic = "";
    if (number < 0.2) { pic = "https://dummyimage.com/1933x1068/1e9165/ffffff.png&text=" + number; } else if (number >= 0.2 && number < 20) { pic = "https://dummyimage.com/1933x1068/fc920b/ffffff.png&text=" + number; } else if (number >= 20) { pic = "https://dummyimage.com/1933x1068/b71411/ffffff.png&text=" + number; } else { pic = "https://dummyimage.com/1933x1068/232830/ffffff.png&text=NaN"; }
    return pic
}

function status_generator(number) {
    if (number < 0.2) { return "一般背景輻射"; } else if (number >= 0.2 && number < 20) { return "緊急狀況"; } else if (number >= 20) { return "危急狀態"; } else { return "儀器故障或校驗"; }
}

function info_generator(input) {
    if (input < 0.005) { return "手足或骨密度X射線檢查劑量。"; } else if (input >= 0.005 && input < 0.01) { return "口腔X射線檢查劑量。"; } else if (input >= 0.01 && input < 0.02) { return "四肢X射線檢查劑量。"; } else if (input >= 0.02 && input < 0.1) { return "胸部X射線檢查劑量。"; } else if (input >= 0.1 && input < 0.2) { return "乘飛機從東京到紐約之間往返一次的劑量。"; } else if (input >= 0.2 && input < 0.4) { return "篩查乳腺癌的鉬靶檢查劑量。"; } else if (input >= 0.4 && input < 0.54) { return "腹部X射線檢查劑量。"; } else if (input >= 0.54 && input < 0.66) { return "骨盆X射線檢查劑量。"; } else if (input >= 0.66 && input < 1) { return "一般人一年工作所受人工放射劑量。"; } else if (input >= 1 && input <= 1.5) { return "腰椎X射線檢查或胸部低劑量CT檢查劑量。"; } else if (input > 1.5 && input <= 2.0) { return "頭部CT檢查劑量。"; } else if (input > 2 && input <= 2.4) { return "地球人平均一年纍計所受輻射。"; } else if (input > 2.4 && input <= 4) { return "一次胃部X射線鋇餐透視的劑量。"; } else if (input > 4 && input <= 6) { return "上消化道X射線檢查。"; } else if (input > 6 && input <= 6.9) { return "一次胸部CT檢查。"; } else if (input > 7 && input <= 7.1) { return "一次X射線胸部透視的劑量。"; } else if (input > 7.1 && input <= 8) { return "下消化道X射線檢查。"; } else if (input > 8 && input <= 10) { return "一次腹腔骨盆CT檢查。"; } else if (input > 10 && input < 20) { return "一次全身CT檢查。"; } else if (input === 20) { return "放射性職業工作者一年累積全身受職業照射的上限。"; } else if (input === 50) { return "從事輻射相關工作者（非女性）一年纍計所受輻射舊標准規定的上限。"; } else if (input > 13 && input <= 60) { return "1天平均吸1.5盒（30支）紙菸者一年纍計。"; } else if (input > 60 && input <= 100) { return "從事輻射相關工作者（非女性）五年纍計所受輻射法定極限。"; } else if (input > 100 && input < 500) { return "從事輻射相關工作者（非女性）五年纍計所受輻射法定極限。"; } else if (input === 500) { return "國際放射防護委員會規定除人命救援外所能承受的輻射極限。"; } else if (input > 500 && input <= 1000) { return "出現被輻射症狀。噁心，嘔吐。水晶體渾濁。"; } else if (input > 1000 && input < 2000) { return "細胞組織遭破壞，內部出血，脫毛脫髮。死亡率5%。"; } else if (input > 2000 && input < 3000) { return "死亡率50%，局部被輻射時脫毛脫髮。"; } else if (input > 3000 && input < 4000) { return "死亡率50%，局部被輻射時失去生育能力。"; } else if (input > 4000 && input < 5000) { return "死亡率50%，局部被輻射時白內障、皮膚出現紅斑。"; } else { return "死亡率99%。。"; }
}


app.intent('預設歡迎語句', (conv) => {

    return new Promise(
        function(resolve, reject) {
            database.ref('/TWradiation').on('value', e => { resolve(e.val()) });

        }).then(function(final_data) {

        PublishTime = final_data.PublishTime[0];
        SVC_list = final_data.data;
        return_time = final_data.PublishTime;

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
                text: "測站資訊發布時間 • " + replaceString(PublishTime, '-', '/'),
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

        radiation_data();

    }).catch(function(error) {
        conv.ask(new SimpleResponse({
            speech: `<speak><p><s>獲取資料發生錯誤，請稍後再試。</s></p></speak>`,
            text: '獲取資訊發生未知錯誤',
        }));
        console.log(error)
        conv.close(new BasicCard({
            image: new Image({ url: 'https://dummyimage.com/1037x539/ef2121/ffffff.png&text=錯誤', alt: 'Pictures', }),
            title: "發生錯誤，請稍後再試",
            display: 'CROPPED',
        }));
    });
});

app.intent('預設頁面', (conv) => {
    radiation_data()

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

    radiation_data()
    conv.contexts.set(SelectContexts.parameter, 1);

    if (conv.screen) { conv.ask('請輕觸下方卡片來選擇查詢區域'); } else {
        conv.ask(new SimpleResponse({
            speech: `<speak><p><s>請選擇要查詢的區域!</s><s>選項有以下幾個<break time="0.5s"/>北部地區<break time="0.2s"/>中部地區<break time="0.2s"/>南部地區<break time="0.2s"/>東部地區<break time="0.2s"/>離島地區<break time="1s"/>請選擇。</s></p></speak>`,
            text: '請輕觸下方卡片來選擇查詢區域!'
        }));
    }
    conv.ask(new Carousel({
        title: 'Carousel Title',
        items: {
            '北部地區': {
                synonyms: ['台北', '新北', '桃園', '新竹'],
                title: '北部地區',
                description: '北北基、桃園市\n新竹縣市',
            },
            '中部地區': {
                synonyms: ['苗栗', '台中', '雲林', '彰化', '南投'],
                title: '中部地區',
                description: '苗栗縣、臺中市\n雲林、彰化、南投',
            },
            '南部地區': {
                synonyms: ['嘉義', '台南', '高雄', '屏東'],
                title: '南部地區',
                description: '嘉義縣市、台南市、\n高雄市、屏東縣',
            },
            '東部地區': {
                synonyms: ['宜蘭', '花蓮', '台東'],
                title: '東部地區',
                description: '宜蘭、花蓮、台東\n',
            },
            '離島地區': {
                synonyms: ['澎湖', '金門', '連江', '媽祖', '馬祖'],
                title: '離島地區',
                description: '澎湖縣、金門縣、\n連江縣',
            }
        },
    }));
    conv.ask(new Suggestions('🌎 最近的測站', '依據核電廠查詢', '語音指令範例', '👋 掰掰'));

});

app.intent('依核電廠查詢', (conv) => {

    radiation_data()
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
    database.ref('/TWradiation').on('value', e => { SVC_list = e.val().data; });

});


app.intent('縣市查詢結果', (conv, input, option) => {

    return new Promise(
        function(resolve, reject) {
            database.ref('/TWradiation').on('value', e => { resolve(e.val()) });

        }).then(function(final_data) {

        PublishTime = final_data.PublishTime[0];
        SVC_list = final_data.data;
        return_time = final_data.PublishTime;

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
            if (conv.screen) { conv.ask('以下是「' + option + '」對應的選項'); } else { conv.ask(new SimpleResponse(`<speak><p><s>請選擇您在${option}要查詢的測站!</s><s>選項有以下幾個<break time="0.5s"/>${option_list[option]}<break time="1s"/>請選擇。</s></p></speak>`)); }

            var the_array = option_list[option].split('、');
            var county_list = {};

            for (i = 0; i < the_array.length; i++) {
                var num = station_array.indexOf(the_array[i]);
                var svc_temp = SVC_list[parseInt(num)];
                var pic_url = picture_generator(svc_temp);
                var status_temp = status_generator(svc_temp);

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

            for (i = 0; i < the_array.length; i++) {
                var num = station_array.indexOf(the_array[i]);
                var svc_temp = SVC_list[parseInt(num)];
                var pic_url = picture_generator(svc_temp);
                var status_temp = status_generator(svc_temp);

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

            conv.ask(new Suggestions('查看其他核電廠', '👋 掰掰'));

        } else if (option === "Local") {
            conv.contexts.set(SelectContexts.parameter, 1);
            if (conv.screen) { conv.ask('請輕觸下方卡片來選擇查詢區域'); } else {
                conv.ask(new SimpleResponse({
                    speech: `<speak><p><s>請選擇要查詢的區域!</s><s>選項有以下幾個<break time="0.5s"/>北部地區<break time="0.2s"/>中部地區<break time="0.2s"/>南部地區<break time="0.2s"/>東部地區<break time="0.2s"/>離島地區<break time="1s"/>請選擇。</s></p></speak>`,
                    text: '請輕觸下方卡片來選擇查詢區域!'
                }));
            }
            conv.ask(new Carousel({
                title: 'Carousel Title',
                items: {
                    '北部地區': {
                        synonyms: ['台北', '新北', '桃園', '新竹'],
                        title: '北部地區',
                        description: '北北基、桃園市\n新竹縣市',
                    },
                    '中部地區': {
                        synonyms: ['苗栗', '台中', '雲林', '彰化', '南投'],
                        title: '中部地區',
                        description: '苗栗縣、臺中市\n雲林、彰化、南投',
                    },
                    '南部地區': {
                        synonyms: ['嘉義', '台南', '高雄', '屏東'],
                        title: '南部地區',
                        description: '嘉義縣市、台南市、\n高雄市、屏東縣',
                    },
                    '東部地區': {
                        synonyms: ['宜蘭', '花蓮', '台東'],
                        title: '東部地區',
                        description: '宜蘭、花蓮、台東\n',
                    },
                    '離島地區': {
                        synonyms: ['澎湖', '金門', '連江', '媽祖', '馬祖'],
                        title: '離島地區',
                        description: '澎湖縣、金門縣、\n連江縣',
                    }
                },
            }));

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

            indexnumber = station_array.indexOf(option); //取得監測站對應的編號
            number = SVC_list[parseInt(indexnumber)];
            PublishTime = return_time[parseInt(indexnumber)];
            Status = status_generator(number);

            if (Status !== "儀器故障或校驗") {

                if (number < 0.2) { picture = "https://dummyimage.com/1037x539/1e9165/ffffff.png&text=" + number; } else if (number >= 0.2 && number < 20) { picture = "https://dummyimage.com/1037x539/fc920b/ffffff.png&text=" + number; } else if (number >= 20) { picture = "https://dummyimage.com/1037x539/b71411/ffffff.png&text=" + number; } else { picture = "https://dummyimage.com/1037x539/232830/ffffff.png&text=NaN"; }

                info = info_generator(number)

                conv.ask(new SimpleResponse({
                    speech: `<speak><p><s>根據最新資料顯示，${option}監測站的環境輻射為每小時${number}微西弗</s><s>相當於${info}</s></p></speak>`,
                    text: '以下為該監測站的詳細資訊'
                }));

                conv.ask(new BasicCard({
                    image: new Image({ url: picture, alt: 'Pictures', }),
                    title: '「' + option + '」監測站',
                    subtitle: '屬於' + Status,
                    display: 'CROPPED',
                    text: '相當於' + info + '  \n  \n**測站資訊發布時間** • ' + replaceString(PublishTime, '-', '/'),
                }));
            } else {

                conv.ask(new SimpleResponse({
                    speech: `<speak><p><s>由於${option}監測站數據不足或處於維修狀態，我無法提供你最新資訊。</s></p></speak>`,
                    text: '以下為「' + option + '」監測站的詳細資訊'
                }));
                conv.ask(new BasicCard({
                    image: new Image({ url: "https://dummyimage.com/1037x539/232830/ffffff.png&text=NaN", alt: 'Pictures', }),
                    title: '有效數據不足',
                    text: '設備維護、儀器校正、儀器異常、傳輸異常、電力異常 \n或有效數據不足等需查修維護情形，以致資料暫時中斷服務。  \n   \n**測站資訊發布時間** • ' + replaceString(PublishTime, '-', '/'),
                    display: 'CROPPED',
                }));
            }
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
            display: 'CROPPED',
        }));
    });

});

app.intent('預設罐頭回覆', (conv) => {
    word1 = county_array[parseInt(Math.random() * 19)];
    word2 = county_array[20 + parseInt(Math.random() * 28)];

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
    radiation_data();

    database.ref('/TWradiation').on('value', e => {
        SVC_list = e.val().data;
        return_time = e.val().PublishTime;
    });

});

app.intent('語音指令範例', (conv) => {
    word1 = county_array[parseInt(Math.random() * 19)];
    word2 = county_array[20 + parseInt(Math.random() * 28)];
    word3 = county_array[parseInt(Math.random() * 48)];

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

                getCSV('https://www.aec.gov.tw/dataopen/index.php?id=2').then(function(response) {
                    resolve(response)
                }).catch(function(error) {
                    var reason = new Error('資料獲取失敗');
                    reject(reason)
                });
            }).then(function(origin_data) {

            indexnumber = station_array.indexOf(station); //取得監測站對應的編號
            number = origin_data[indexnumber]['�ʴ���(�L�襱/��)'];
            PublishTime = origin_data[indexnumber]['�ɶ�'];

            Status = status_generator(number);

            if (Status !== "儀器故障或校驗") {
                if (number < 0.2) { picture = "https://dummyimage.com/1037x539/1e9165/ffffff.png&text=" + number; } else if (number >= 0.2 && number < 20) { picture = "https://dummyimage.com/1037x539/fc920b/ffffff.png&text=" + number; } else if (number >= 20) { picture = "https://dummyimage.com/1037x539/b71411/ffffff.png&text=" + number; } else { picture = "https://dummyimage.com/1037x539/232830/ffffff.png&text=NaN"; }

                info = info_generator(number);

                conv.ask(new SimpleResponse({
                    speech: `<speak><p><s>根據最新資料顯示，${station}監測站的環境輻射為每小時${number}微西弗</s><s>相當於${info}</s></p></speak>`,
                    text: '以下為該監測站的詳細資訊'
                }));

                conv.close(new BasicCard({
                    image: new Image({ url: picture, alt: 'Pictures', }),
                    title: '「' + station + '」監測站',
                    subtitle: '屬於' + Status,
                    display: 'CROPPED',
                    text: '相當於' + info + '  \n  \n**測站資訊發布時間** • ' + replaceString(PublishTime, '-', '/'),
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
                    text: '設備維護、儀器校正、儀器異常、傳輸異常、電力異常 \n或儀器故障或校驗等需查修維護情形，以致資料暫時中斷服務。  \n  \n**測站資訊發布時間** • ' + replaceString(PublishTime, '-', '/TWuvi'),
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
                subtitle: '請過一段時間後再回來查看',
                display: 'CROPPED',
            }));
        });
    }
});

app.intent('日常安排教學', (conv, { station }) => {

    if (station !== "") { choose_station = station; } else { choose_station = conv.user.storage.choose_station; }
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

    database.ref('/TWradiation').on('value', e => {
        SVC_list = e.val().data;
        return_time = e.val().PublishTime;
    });

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
                Sitename = (findNearestLocation(myLocation, locations)).location.Sitename; //透過模組找到最近的測站				

                conv.ask(new SimpleResponse({ speech: `<speak><p><s>查詢完成!</s><s>距離你最近的測站是<break time="0.2s"/>${Sitename}。</s></p></speak>`, text: '最近的測站是「' + Sitename + '」!' }));

                if ((typeof SVC_list[0] === "undefined") !== true) {
                    indexnumber = station_array.indexOf(Sitename); //取得監測站對應的編號
                    number = SVC_list[parseInt(indexnumber)];
                    PublishTime = return_time[parseInt(indexnumber)];

                    Status = status_generator(number);
                    if (Status !== "儀器故障或校驗") {
                        if (number < 0.2) { picture = "https://dummyimage.com/1037x539/1e9165/ffffff.png&text=" + number; } else if (number >= 0.2 && number < 20) { picture = "https://dummyimage.com/1037x539/fc920b/ffffff.png&text=" + number; } else if (number >= 20) { picture = "https://dummyimage.com/1037x539/b71411/ffffff.png&text=" + number; } else { picture = "https://dummyimage.com/1037x539/232830/ffffff.png&text=NaN"; }

                        info = info_generator(number)

                        conv.ask(new SimpleResponse({
                            speech: `<speak><p><s>根據最新資料顯示，${Sitename}監測站的環境輻射為每小時${number}微西弗</s><s>相當於${info}</s></p></speak>`,
                            text: '以下為該監測站的詳細資訊'
                        }));

                        conv.close(new BasicCard({
                            image: new Image({ url: picture, alt: 'Pictures', }),
                            title: '「' + Sitename + '」監測站',
                            subtitle: '屬於' + Status,
                            display: 'CROPPED',
                            text: '相當於' + info + '  \n  \n**測站資訊發布時間** • ' + replaceString(PublishTime, '-', '/'),
                        }));
                    } else {
                        conv.ask(new SimpleResponse({
                            speech: `<speak><p><s>由於${Sitename}監測站數據不足或處於維修狀態，我無法提供你最新資訊。</s></p></speak>`,
                            text: '以下為該監測站的詳細資訊'
                        }));
                        conv.close(new BasicCard({
                            image: new Image({ url: "https://dummyimage.com/1037x539/232830/ffffff.png&text=NaN", alt: 'Pictures', }),
                            title: '儀器故障或校驗',
                            title: '「' + Sitename + '」儀器故障或校驗',
                            text: '設備維護、儀器校正、儀器異常、傳輸異常、電力異常 \n或儀器故障或校驗等需查修維護情形，以致資料暫時中斷服務。  \n  \n**測站資訊發布時間** • ' + replaceString(PublishTime, '-', '/TWuvi'),
                            display: 'CROPPED',
                        }));
                    }
                }
            } else {
                conv.ask(new SimpleResponse({
                    speech: `<speak><p><s>糟糕，查詢似乎發生錯誤。</s><s>請稍後再試。</s></p></speak>`,
                    text: '發生錯誤，請稍後再試一次'
                }));
                conv.ask(new BasicCard({
                    image: new Image({ url: "https://dummyimage.com/1037x539/ef2121/ffffff.png&text=錯誤", alt: 'Pictures', }),
                    title: '數據加載發生問題',
                    subtitle: '請過一段時間後再回來查看',
                    display: 'CROPPED',
                }));
            }
        } else { conv.ask(new SimpleResponse({ speech: `<speak><p><s>糟糕，我無法得知你的目前位置。</s><s>請稍後再試。</s></p></speak>`, text: "發生錯誤，請開啟GPS功能然後再試一次。" })); }
    } else { conv.ask(new SimpleResponse({ speech: `<speak><p><s>很抱歉，由於未取得你的授權因此查詢失敗。</s><s>不過你隨時可以回來再試一次。</s></p></speak>`, text: "發生錯誤，未取得你的授權。" })); }
    conv.ask(new Suggestions('回主頁面', '👋 掰掰'));
    conv.user.storage.choose_station = Sitename;

});

app.intent('直接查詢縣市選單', (conv, { County }) => {

    database.ref('/TWradiation').on('value', e => {
        SVC_list = e.val().data;
        return_time = e.val().PublishTime;
    });

    if (conv.input.raw.indexOf('新北') !== -1) { County = "新北市"; } else if (conv.input.raw.indexOf('新竹') !== -1) { County = "新竹縣市"; } else if (conv.input.raw === "台東") { County = "臺東"; } else if (conv.input.raw.indexOf('第一部分') !== -1) { County = "新北市第一部分"; } else if (conv.input.raw.indexOf('第二部分') !== -1) { County = "新北市第二部分"; } else if (conv.input.raw.indexOf('核一廠') !== -1) { County = "核一廠"; } else if (conv.input.raw.indexOf('核二廠') !== -1) { County = "核二廠"; } else if (conv.input.raw.indexOf('核三廠') !== -1) { County = "核三廠"; } else if (conv.input.raw.indexOf('核四廠') !== -1) { County = "龍門核能電廠"; }

    if (County_option.indexOf(County) !== -1) {
        conv.contexts.set(SelectContexts.parameter, 1);
        if (County === "新北市") { conv.ask(new SimpleResponse({ speech: `<speak><p><s>由於「新北市」的測站數目較多，分為兩部份顯示，請選擇</s></p></speak>`, text: '「新北市」監測站數量較多，\n分為兩部份顯示' })); } else {
            if (conv.screen) {
                conv.ask(new SimpleResponse({
                    speech: `<speak><p><s>以下是${County}的監測站列表!<break time="0.5s"/>請查看</s></p></speak>`,
                    text: '以下是「' + County + '」的測站列表'
                }));
            } else { conv.ask(new SimpleResponse(`<speak><p><s>以下是${County}的監測站列表</s><s>選項有以下幾個<break time="0.5s"/>${option_list[County]}<break time="1s"/>請選擇。</s></p></speak>`)); }
        }

        var the_array = option_list[County].split('、');
        var county_list = {};

        for (i = 0; i < the_array.length; i++) {
            var num = station_array.indexOf(the_array[i]);
            var svc_temp = SVC_list[parseInt(num)];
            var pic_url = picture_generator(svc_temp);
            var status_temp = status_generator(svc_temp);

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

    } else if (station_array.indexOf(County) !== -1) {

        indexnumber = station_array.indexOf(County); //取得監測站對應的編號
        number = SVC_list[parseInt(indexnumber)];
        PublishTime = return_time[parseInt(indexnumber)];

        Status = status_generator(number);

        if (Status !== "儀器故障或校驗") {

            if (number < 0.2) { picture = "https://dummyimage.com/1037x539/1e9165/ffffff.png&text=" + number; } else if (number >= 0.2 && number < 20) { picture = "https://dummyimage.com/1037x539/fc920b/ffffff.png&text=" + number; } else if (number >= 20) { picture = "https://dummyimage.com/1037x539/b71411/ffffff.png&text=" + number; } else { picture = "https://dummyimage.com/1037x539/232830/ffffff.png&text=NaN"; }

            info = info_generator(number)

            conv.ask(new SimpleResponse({
                speech: `<speak><p><s>根據最新資料顯示，${County}監測站的環境輻射為每小時${number}微西弗</s><s>相當於${info}</s></p></speak>`,
                text: '以下為該監測站的詳細資訊'
            }));

            conv.ask(new BasicCard({
                image: new Image({ url: picture, alt: 'Pictures', }),
                title: '「' + County + '」監測站',
                subtitle: '屬於' + Status,
                display: 'CROPPED',
                text: '相當於' + info + '  \n  \n**測站資訊發布時間** • ' + replaceString(PublishTime, '-', '/'),
            }));
        } else {

            conv.ask(new SimpleResponse({
                speech: `<speak><p><s>由於${County}監測站數據不足或處於維修狀態，我無法提供你最新資訊。</s></p></speak>`,
                text: '以下為「' + County + '」監測站的詳細資訊'
            }));
            conv.ask(new BasicCard({
                image: new Image({ url: "https://dummyimage.com/1037x539/232830/ffffff.png&text=NaN", alt: 'Pictures', }),
                title: '有效數據不足',
                text: '設備維護、儀器校正、儀器異常、傳輸異常、電力異常 \n或有效數據不足等需查修維護情形，以致資料暫時中斷服務。  \n   \n**測站資訊發布時間** • ' + replaceString(PublishTime, '-', '/'),
                display: 'CROPPED',
            }));
        }
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