'use strict';

// Import the Dialogflow module from the Actions on Google client library.
const {
    dialogflow,
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
const parseJson = require('parse-json');
const findNearestLocation = require('map-nearest-location');
const app = dialogflow({ debug: true });
const admin = require('firebase-admin');
var icon = require('./weather_icon.json');
var detail_sea_options=require('./detail_sea_area.json');

let serviceAccount = require("./config/hank199599-firebase-adminsdk-fc9jb-8355c0618b.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://hank199599.firebaseio.com"
});

const database = admin.database();
let db = admin.firestore();
var data = [];
var i = 0;

var station_array = ["釣魚台海面", "彭佳嶼基隆海面", "宜蘭蘇澳沿海", "新竹鹿港沿海", "澎湖海面", "鹿港東石沿海", "東石安平沿海", "安平高雄沿海", "高雄枋寮沿海", "枋寮恆春沿海", "鵝鑾鼻沿海", "成功臺東沿海", "臺東大武沿海", "綠島蘭嶼海面", "花蓮沿海", "金門海面", "馬祖海面", "黃海南部海面", "花鳥山海面", "浙江海面", "東海北部海面", "東海南部海面", "臺灣北部海面", "臺灣東北部海面", "臺灣東南部海面", "臺灣海峽北部", "臺灣海峽南部", "巴士海峽", "廣東海面", "東沙島海面", "中西沙島海面", "南沙島海面"];
var option_array = ["台灣近海", "遠洋地區"];
var sea_array = ["台灣北部", "台灣西半部", "台灣東半部", "離島區域", "台灣周圍", "北部海域", "南海地區"];
var day_array=["今天","明天","後天"]
var weekdays = ["日","一","二","三","四","五","六"];
var day_request = ["今天", "今日", "現在", "明天", "明日", "隔天", "後天", "2天後", "兩天後", "二天後"];
var sea_area = ["釣魚台海面", "釣魚台", "彭佳嶼基隆海面", "彭佳嶼", "基隆", "淡水", "山芝", "石門", "金山", "萬里", "安樂", "中山", "中正", "瑞芳", "貢寮", "宜蘭蘇澳沿海", "宜蘭", "蘇澳", "頭城", "壯圍", "五結", "南澳", "新竹鹿港沿海", "八里", "蘆竹", "大園", "觀音", "新屋", "新豐", "香山", "竹南", "後龍", "西湖", "通宵", "苑裡", "大甲", "大安", "清水", "梧棲", "龍井", "伸港", "線西", "新竹", "澎湖海面", "澎湖", "馬公", "七美", "西嶼", "白沙", "望安", "湖西", "鹿港東石沿海", "鹿港", "福興", "芳苑", "大城", "麥寮", "台西", "臺西", "四湖", "口湖", "東石安平沿海", "東石", "布袋", "北門", "將軍", "七股", "安南", "安平高雄沿海", "安平", "南區", "茄萣", "永安", "彌陀", "梓官", "高雄枋寮沿海", "鼓山", "旗津", "前鎮", "小港", "林園", "新園", "東港", "林邊", "佳冬", "枋寮恆春沿海", "枋寮", "枋山", "車城", "鵝鑾鼻沿海", "恆春", "鵝鑾鼻", "成功臺東沿海", "長濱", "成功", "臺東大武沿海", "東河", "台東", "太麻里", "大武", "達仁", "牡丹", "滿州", "綠島蘭嶼海面", "綠島", "蘭嶼", "花蓮沿海", "秀林", "新城", "花蓮", "吉安", "秀豐", "豐濱", "金門海面", "金門", "金沙", "金城", "金湖", "列嶼", "金寧", "烏坵", "馬祖海面", "馬祖", "媽祖", "連江", "南竿", "北竿", "莒光", "東引", "黃海南部海面", "黃海", "花鳥山海面", "浙江海面", "東海北部海面", "東海南部海面", "臺灣北部海面", "臺灣東北部海面", "臺灣東南部海面", "臺灣海峽北部", "臺灣海峽南部", "巴士海峽", "廣東海面", "廣東", "東沙島海面", "東沙島", "中西沙島海面", "西沙島", "中沙島", "南沙島海面", "南沙島"];
var sea_area_options = require('./sea_option.json')


const SelectContexts = {
    parameter: 'select ',
}

function getDay(num) {
    var today = new Date();
    var nowTime = today.getTime() + 8 * 3600 * 1000;
    var ms = 24 * 3600 * 1000 * num;
    today.setTime(parseInt(nowTime + ms));
    var oMoth = (today.getMonth() + 1).toString();
    if (oMoth.length <= 1) oMoth = '0' + oMoth;
    var oDay = today.getDate().toString();
    var oWeek = weekdays[today.getDay()];
    if (oDay.length <= 1) oDay = '0' + oDay;
    return oMoth + "/" + oDay + " (" + oWeek + ")";
}

function EfficientTime(num) {
    var today = new Date();
    var nowTime = today.getTime() + 8 * 3600 * 1000;
    var ms = 24 * 3600 * 1000 * num;
    today.setTime(parseInt(nowTime + ms));
    var oMoth = (today.getMonth() + 1).toString();
    if (oMoth.length <= 1) oMoth = '0' + oMoth;
    var oDay = today.getDate().toString();
    var oWeek = weekdays[today.getDay()];
    if (oDay.length <= 1) oDay = '0' + oDay;
    return oMoth + "/" + oDay + " 00:00";
}


function weather_report_set() {

    //取得概況報告
    var temp0 = [];
    var temp1 = [];
    var temp2 = [];
    var station_list = [];
    var data_today = [];
    var data_tomorrow = [];
    var data_after = [];
    var time = new Date();
    var nowTime = time.getTime() + 8 * 3600 * 1000;
    time.setTime(parseInt(nowTime));
    var minute_now = time.getMinutes();

    //取得測站更新時間
    if (minute_now < 15) {

        var data_get = new Promise(function(resolve, reject) {
            getJSON('https://opendata.cwb.gov.tw/fileapi/v1/opendataapi/F-A0012-001?Authorization=CWB-D48B64A0-8BCB-497F-96E3-BD5EB63CF502&downloadType=WEB&format=JSON').then(
                function(response) {
                    data = response.cwbopendata.dataset.location;
                    resolve(data)
                }).catch(function(error) {
                var reason = new Error('資料獲取失敗');
                reject(reason)
            });
        });

        data_get.then(function(origin_data) {
            for (i = 0; i < origin_data.length; i++) {
                temp0.push(origin_data[i].weatherElement[0].time[0].parameter.parameterName)
                temp0.push(origin_data[i].weatherElement[0].time[0].parameter.parameterValue)
                temp1.push(origin_data[i].weatherElement[0].time[1].parameter.parameterName)
                temp1.push(origin_data[i].weatherElement[0].time[1].parameter.parameterValue)
                temp2.push(origin_data[i].weatherElement[0].time[2].parameter.parameterName)
                temp2.push(origin_data[i].weatherElement[0].time[2].parameter.parameterValue)
                temp0.push(origin_data[i].weatherElement[1].time[0].parameter.parameterName)
                temp1.push(origin_data[i].weatherElement[1].time[1].parameter.parameterName)
                temp2.push(origin_data[i].weatherElement[1].time[2].parameter.parameterName)
                temp0.push(origin_data[i].weatherElement[2].time[0].parameter.parameterName)
                temp1.push(origin_data[i].weatherElement[2].time[1].parameter.parameterName)
                temp2.push(origin_data[i].weatherElement[2].time[2].parameter.parameterName)
                temp0.push(origin_data[i].weatherElement[3].time[0].parameter.parameterName)
                temp1.push(origin_data[i].weatherElement[3].time[1].parameter.parameterName)
                temp2.push(origin_data[i].weatherElement[3].time[2].parameter.parameterName)
                temp0.push(origin_data[i].weatherElement[4].time[0].parameter.parameterName)
                temp1.push(origin_data[i].weatherElement[4].time[1].parameter.parameterName)
                temp2.push(origin_data[i].weatherElement[4].time[2].parameter.parameterName)

                data_today[i] = temp0;
                data_tomorrow[i] = temp1;
                data_after[i] = temp2;
                temp0 = [];
                temp1 = [];
                temp2 = [];
                station_list[i] = origin_data[i].locationName;
            }

            database.ref('/TWsea').update({ Today: data_today });
            database.ref('/TWsea').update({ Tomorrow: data_tomorrow });
            database.ref('/TWsea').update({ AfterTomorrow: data_after });
            database.ref('/TWsea').update({ SiteName: station_list });

        }).catch(function(error) {
            console.log(error)
        });
    }
}

function report_time() {
    var data_get = new Promise(function(resolve, reject) {
        getJSON('https://opendata.cwb.gov.tw/fileapi/v1/opendataapi/F-A0012-001?Authorization=CWB-D48B64A0-8BCB-497F-96E3-BD5EB63CF502&downloadType=WEB&format=JSON').then(
            function(response) {
                data = response.cwbopendata.dataset.datasetInfo.issueTime;
                resolve(data)
            }).catch(function(error) {
            var reason = new Error('資料獲取失敗');
            reject(reason)
        });
    });
    data_get.then(function(origin_data) {

        var report_PublishTime = origin_data.split('+08:00')[0];
        report_PublishTime = replaceString(report_PublishTime, 'T', ' ');
        report_PublishTime = replaceString(report_PublishTime, '-', '/');
        database.ref('/TWsea').update({ PublishTime: report_PublishTime });

    }).catch(function(error) {
        database.ref('/TWsea').on('value', e => {
            PublishTime = e.val().PublishTime;
        });
    });

}

app.intent('預設歡迎語句', (conv) => {

    return new Promise(

        function(resolve) {
            if (conv.user.raw.profile !== undefined) { weather_report_set() }
            report_time()
            database.ref('/TWsea').on('value', e => { resolve(e.val().PublishTime) });
        }).then(function(final_data) {

        var word1 = sea_area[parseInt(Math.random() * 149)];

        if (conv.user.last.seen) {
            conv.ask(new SimpleResponse({
                speech: `<speak><p><s>請問你要查詢哪一個地方的天氣資訊呢?</s></p></speak>`,
                text: '歡迎回來!'
            }));
        } else {
            conv.ask(new SimpleResponse({
                speech: `<speak><p><s>歡迎使用漁業天氣精靈!</s><s>我能提供各海域的三天內天氣預報查詢服務，此外，你能將我加入日常安排快速查詢所需海域。</s></p></speak>`,
                text: '歡迎使用!'
            }));
        }

        conv.ask(new BasicCard({
            image: new Image({ url: "https://raw.githubusercontent.com/hank199599/Google-Assistant-APP/master/%E6%B5%B7%E8%B1%A1%E7%B2%BE%E9%9D%88/assets/vrFdxK6.jpg", alt: 'Pictures', }),
            title: "歡迎使用",
            subtitle: "您可查詢台灣附近海域的天氣預報。\n根據官方資訊查詢範圍為三天。",
            text: "資訊發布時間 • " + final_data + '  \n有效時間 • ' + EfficientTime(0) + '~' + EfficientTime(2),
            buttons: new Button({ title: '航行海象', url: 'https://safesee.cwb.gov.tw/', display: 'CROPPED', }),
        }));
        conv.ask(new Suggestions('🔎依區域查詢', '語音指令範例', '👋 掰掰'));
        conv.noInputs = ["請說出查詢的縣市!、例如、幫我查" + word1, "請說出你要查詢的縣市", "抱歉，我想我幫不上忙。"];

    }).catch(function(error) {
        var word1 = sea_area[parseInt(Math.random() * 149)];

        if (conv.user.last.seen) {
            conv.ask(new SimpleResponse({
                speech: `<speak><p><s>請問你要查詢哪一個地方的天氣資訊呢?</s></p></speak>`,
                text: '歡迎回來!'
            }));
        } else {
            conv.ask(new SimpleResponse({
                speech: `<speak><p><s>歡迎使用漁業天氣精靈!</s><s>我能提供各海域的三天內天氣預報查詢服務，此外，你能將我加入日常安排快速查詢所需海域。</s></p></speak>`,
                text: '歡迎使用!'
            }));
        }

        conv.ask(new BasicCard({
            image: new Image({ url: "https://raw.githubusercontent.com/hank199599/Google-Assistant-APP/master/%E6%B5%B7%E8%B1%A1%E7%B2%BE%E9%9D%88/assets/vrFdxK6.jpg", alt: 'Pictures', }),
            title: "歡迎使用",
            subtitle: "您可查詢台灣附近海域的天氣預報。\n根據官方資訊查詢範圍為三天。",
            text: '有效時間 • ' + EfficientTime(0) + '~' + EfficientTime(2),
            buttons: new Button({ title: '航行海象', url: 'https://safesee.cwb.gov.tw/', display: 'CROPPED', }),
        }));
        conv.ask(new Suggestions('🔎依區域查詢', '語音指令範例', '👋 掰掰'));
        conv.noInputs = ["請說出查詢的縣市!、例如、幫我查" + word1, "請說出你要查詢的縣市", "抱歉，我想我幫不上忙。"];
    });
});

app.intent('Default Fallback Intent', (conv) => {
    var word1 = sea_area[parseInt(Math.random() * 149)];
    var word2 = sea_area[parseInt(Math.random() * 149)];
    var day_set = day_request[parseInt(Math.random() * 9)];

    if (conv.input.type === "VOICE") { //如果輸入是語音，則顯示錯誤處理方法
        conv.ask(new SimpleResponse({
            speech: `<speak><p><s>抱歉，我不懂你的意思</s><s>請試著問我<break time="0.2s"/>${word1}海象如何?<break time="0.2s"/>或<break time="0.2s"/>我想知道${day_set}${word2}的狀況</s></p></speak>`,
            text: '試著提問來快速存取海域的天氣資訊，\n以下是你可以嘗試的詢問方式!'
        }));

        conv.ask(new BasicCard({
            title: "語音查詢範例",
            subtitle: "以下是你可以嘗試的指令\n若詢問沿海鄉鎮，會對應到相應海域",
            text: " • *「" + word1 + "海象如何?」*  \n • *「我想知道" + day_set + word2 + "的狀況」*  \n • *「現在" + sea_area[parseInt(Math.random() * 48)] + "狀況怎樣」*  \n • *「幫我找" + sea_area[parseInt(Math.random() * 48)] + "」*  \n • *「我想看" + sea_area[parseInt(Math.random() * 48)] + day_request[parseInt(Math.random() * 9)] + "的報告」*  \n • *「" + sea_area[parseInt(Math.random() * 48)] + "海況好嗎?」*  \n • *「我要查" + sea_area[parseInt(Math.random() * 48)] + "」*",
        }));
        conv.ask(new Suggestions(word1 + '海象如何?', "我想知道" + day_set + word2 + "的狀況"));
        conv.noInputs = ["請說出查詢的縣市!、例如、幫我查" + word1, "請說出你要查詢的縣市", "抱歉，我想我幫不上忙。"];

    } else {
        conv.ask('抱歉，我不懂你的意思，\n請點選建議卡片來進行操作。');
    }

    conv.ask(new Suggestions('🔎依區域查詢', '👋 掰掰'));
    conv.user.storage.day_select = "今天";
});

app.intent('語音指令範例', (conv) => {
    var word1 = sea_area[parseInt(Math.random() * 149)];
    var word2 = sea_area[parseInt(Math.random() * 149)];
    var day_set = day_request[parseInt(Math.random() * 9)];

    conv.ask(new SimpleResponse({
        speech: `<speak><p><s>在任意畫面中，你隨時都能快速查詢各處海況資訊</s><s>你可以試著問<break time="0.2s"/>${word1}海象如何?<break time="0.2s"/>或<break time="0.2s"/>我想知道${day_set}${word2}的狀況</s></p></speak>`,
        text: '試著提問來快速存取海域的天氣資訊，\n以下是你可以嘗試的詢問方式!'
    }));
    conv.ask(new BasicCard({
        title: "語音查詢範例",
        subtitle: "以下是你可以嘗試的指令\n若詢問沿海鄉鎮，會對應到相應海域",
        text: " • *「" + word1 + "海象如何?」*  \n • *「我想知道" + day_set + word2 + "的狀況」*  \n • *「現在" + sea_area[parseInt(Math.random() * 48)] + "狀況怎樣」*  \n • *「幫我找" + sea_area[parseInt(Math.random() * 48)] + "」*  \n • *「我想看" + sea_area[parseInt(Math.random() * 48)] + day_request[parseInt(Math.random() * 9)] + "的報告」*  \n • *「" + sea_area[parseInt(Math.random() * 48)] + "海況好嗎?」*  \n • *「我要查" + sea_area[parseInt(Math.random() * 48)] + "」*",
    }));
    conv.ask(new Suggestions(word1 + '海象如何?', "我想知道" + day_set + word2 + "的狀況"));
    conv.ask(new Suggestions('🔎依區域查詢', '👋 掰掰'));
    conv.user.storage.day_select = "今天";

});


app.intent('依區域查詢', (conv) => {


    conv.contexts.set(SelectContexts.parameter, 5);

    conv.ask('請輕觸下方卡片來選擇查詢區域');

    conv.ask(new Carousel({
        title: 'Carousel Title',
        items: {
            '台灣近海': {
                title: '台灣近海',
                description: '本島周圍與離島海域',
                image: new Image({ url: "https://raw.githubusercontent.com/hank199599/Google-Assistant-APP/master/%E6%B5%B7%E8%B1%A1%E7%B2%BE%E9%9D%88/assets/05cUMdT.jpg", alt: 'Image alternate text', }),
            },
            '遠洋地區': {
                title: '遠洋漁業',
                description: '台灣附近公海',
                image: new Image({ url: "https://raw.githubusercontent.com/hank199599/Google-Assistant-APP/master/%E6%B5%B7%E8%B1%A1%E7%B2%BE%E9%9D%88/assets/nIv7Dq8.jpg", alt: 'Image alternate text', }),
            },
        },
    }));
    conv.ask(new Suggestions('語音指令範例', '👋 掰掰'));
    conv.user.storage.day_select = "今天";

});

app.intent('縣市查詢結果', (conv, input, option) => {

    return new Promise(

        function(resolve) {
            database.ref('/TWsea').on('value', e => { resolve(e.val().Today) });
        }).then(function(data_list) {

        if (option_array.indexOf(option) !== -1) {

            conv.contexts.set(SelectContexts.parameter, 5);
            conv.ask(new SimpleResponse({
                speech: `<speak><p><s>以下是${option}的細分列表，點擊來選擇海域</s></p></speak>`,
                text: '下面是' + option + '的詳細列表'
            }));

            conv.ask(new Suggestions('回主頁面', '👋 掰掰'));
            conv.ask(new Carousel({
                title: 'Carousel Title',
                items: sea_area_options[option]
            }));

        } else if (sea_array.indexOf(option) !== -1) {
            conv.contexts.set(SelectContexts.parameter, 5);
            conv.ask(new SimpleResponse({
                speech: `<speak><p><s>以下是${option}的海域列表，點擊來查看詳細資訊</s></p></speak>`,
                text: '下面是' + option + '的海域列表'
            }));

            var area_list = detail_sea_options[option]
            var option_dict={};

            for (var i=0;i<area_list.length;i++){
                option_dict[area_list[i]]={
                    title: area_list[i],
                    description: data_list[station_array.indexOf(area_list[i])][2] + '  \n' + data_list[station_array.indexOf(area_list[i])][5],
                    image: new Image({ url: icon[data_list[station_array.indexOf(area_list[i])][1]], alt: 'Image alternate text', }),
                }
            }

            conv.ask(new Carousel({
                title: 'Carousel Title',
                items: option_dict
            }));

            conv.ask(new Suggestions('回主頁面', '👋 掰掰'));
            
        } else if (station_array.indexOf(option) !== -1) {
            conv.ask(new SimpleResponse({
                speech: `<speak><p><s>今天在${option}，${data_list[station_array.indexOf(option)][0]}，</s><s>浪高${data_list[station_array.indexOf(option)][4]}。${data_list[station_array.indexOf(option)][2]}</s></p></speak>`,
                text: '「' + option + '」今日海象如下'
            }));

            var wind_text = data_list[station_array.indexOf(option)][3];
            wind_text = replaceString(wind_text, '晨', '  \n晨');
            wind_text = replaceString(wind_text, '上午', '  \n上午');
            wind_text = replaceString(wind_text, '下午', '  \n下午');
            wind_text = replaceString(wind_text, '晚', '  \n晚');

            conv.ask(new Table({
                title: option,
                subtitle: getDay(0),
                columns: [
                    { header: '類別', align: 'CENTER', },
                    { header: '內容', align: 'CENTER', },
                ],
                rows: [
                    { cells: ['天氣', data_list[station_array.indexOf(option)][0]], dividerAfter: false, },
                    { cells: ['風向', data_list[station_array.indexOf(option)][2]], dividerAfter: false, },
                    { cells: ['風力', wind_text], dividerAfter: false, },
                    { cells: ['海浪', data_list[station_array.indexOf(option)][5]], dividerAfter: false, },
                    { cells: ['浪高', data_list[station_array.indexOf(option)][4]], dividerAfter: false, },
                ],
            }));
            conv.ask(new Suggestions('明天呢?', '後天呢?', '回主頁面', '👋 掰掰'));
            conv.user.storage.station = option;
            conv.user.storage.day_select = "今天";
        } else {
            conv.contexts.set(SelectContexts.parameter, 5);
            conv.noInputs = ["請說出查詢的縣市!、例如、幫我查" + word1, "請說出你要查詢的縣市", "抱歉，我想我幫不上忙。"];
            
            var word1 = sea_area[parseInt(Math.random() * 149)];
            var word2 = sea_area[parseInt(Math.random() * 149)];
            var day_set = day_request[parseInt(Math.random() * 9)];

            if (conv.screen) { conv.ask('區域查詢過程發生錯誤，\n請輕觸下方卡片來選擇查詢區域'); } else {
                conv.ask(new SimpleResponse({
                    speech: `<speak><p><s>抱歉，我不懂你的意思</s><s>請試著問我<break time="0.2s"/>${word1}海象如何?<break time="0.2s"/>或<break time="0.2s"/>我想知道${day_set}${word2}的狀況</s></p></speak>`,
                    text: '試著提問來快速存取海域的天氣資訊，\n以下是你可以嘗試的詢問方式!'
                }));
            }

            conv.ask(new Carousel({
                title: 'Carousel Title',
                items: {
                    '台灣近海': {
                        title: '台灣近海',
                        description: '本島周圍與離島海域',
                        image: new Image({ url: "https://raw.githubusercontent.com/hank199599/Google-Assistant-APP/master/%E6%B5%B7%E8%B1%A1%E7%B2%BE%E9%9D%88/assets/05cUMdT.jpg", alt: 'Image alternate text', }),
                    },
                    '遠洋地區': {
                        title: '遠洋漁業',
                        description: '台灣附近公海',
                        image: new Image({ url: "https://raw.githubusercontent.com/hank199599/Google-Assistant-APP/master/%E6%B5%B7%E8%B1%A1%E7%B2%BE%E9%9D%88/assets/nIv7Dq8.jpg", alt: 'Image alternate text', }),
                    },
                },
            }));
            conv.ask(new Suggestions('語音指令範例', '👋 掰掰'));

        }
    }).catch(function(error) {
        conv.ask(new SimpleResponse({
            speech: `<speak><p><s>發生錯誤，無法獲取最新資訊</s></p></speak>`,
            text: "獲取資料過程似乎發生錯誤",
        }));
        console.log(error)
        conv.close(new BasicCard({
            image: new Image({ url: 'https://dummyimage.com/1089x726/1a73e8/ffffff.png&text=%E9%8C%AF%E8%AA%A4', alt: 'Pictures', }),
            title: "獲取資料發生錯誤",
            display: 'CROPPED',
        }));
    });
});

app.intent('直接查詢海域', (conv, { day_select, station }) => {

    if (conv.user.storage.number === undefined) { conv.user.storage.number = station_array.indexOf(station); }

    return new Promise(

        function(resolve) {

            database.ref('/TWsea').on('value', e => { resolve(e.val()) });

        }).then(function(final_data) {

        if (conv.user.storage.day_select !== undefined && day_select.length === 0) { day_select = conv.user.storage.day_select; }
        if (conv.user.storage.station !== undefined && station.length === 0) { station = conv.user.storage.station; }

        if (day_select.length === 0) { day_select = "今天"; }
    
        var temp_dict={
            "今天":final_data.Today[station_array.indexOf(station)],
            "明天":final_data.Tomorrow[station_array.indexOf(station)],
            "後天":final_data.AfterTomorrow[station_array.indexOf(station)]
        }
        
        var temp_list=temp_dict[day_select];

        if (station_array.indexOf(station) !== -1) {

            conv.ask(new SimpleResponse({
                speech: `<speak><p><s>${day_select}在${station}，${temp_list[0]}，</s><s>浪高${temp_list[4]}。${temp_list[2]}</s></p></speak>`,
                text: '「' + station + '」' + day_select + '海象如下'
            }));

            var wind_text = temp_list[3];
            wind_text = replaceString(wind_text, '晨', '  \n晨');
            wind_text = replaceString(wind_text, '上午', '  \n上午');
            wind_text = replaceString(wind_text, '下午', '  \n下午');
            wind_text = replaceString(wind_text, '晚', '  \n晚');

            conv.ask(new Table({
                title: station,
                subtitle: getDay(day_array.indexOf(day_select)),
                image: new Image({
                    url: icon[temp_list[1]],
                    alt: 'Alt Text',
                }),
                columns: [
                    { header: '類別', align: 'CENTER', },
                    { header: '內容', align: 'CENTER', },
                ],
                rows: [
                    { cells: ['天氣', temp_list[0]], dividerAfter: false, },
                    { cells: ['風向', temp_list[2]], dividerAfter: false, },
                    { cells: ['風力', wind_text], dividerAfter: false, },
                    { cells: ['海浪', temp_list[5]], dividerAfter: false, },
                    { cells: ['浪高', temp_list[4]], dividerAfter: false, },
                ],
            }));

            for (i = 0; i < day_array.length; i++) {
                var days = [];
                if (day_array[i] !== day_select) { conv.ask(new Suggestions(day_array[i] + '呢?'));
                    days.push(day_array[i]); }
                conv.noInputs = ["你可以試著問" + days[0] + "在" + station + "海象資訊", "請問你還要查詢其他海域嗎?", "抱歉，我想我幫不上忙。"];
            }
            conv.user.storage.station = station;
            conv.user.storage.day_select = day_select;
        } else {
            conv.contexts.set(SelectContexts.parameter, 5);

            conv.ask('抱歉，我不懂你的意思。\n請點選下方卡片進行查詢。');

            conv.ask(new Carousel({
                title: 'Carousel Title',
                items: {
                    '台灣近海': {
                        title: '台灣近海',
                        description: '本島周圍與離島海域',
                        image: new Image({ url: "https://raw.githubusercontent.com/hank199599/Google-Assistant-APP/master/%E6%B5%B7%E8%B1%A1%E7%B2%BE%E9%9D%88/assets/05cUMdT.jpg", alt: 'Image alternate text', }),
                    },
                    '遠洋地區': {
                        title: '遠洋漁業',
                        description: '台灣附近公海',
                        image: new Image({ url: "https://raw.githubusercontent.com/hank199599/Google-Assistant-APP/master/%E6%B5%B7%E8%B1%A1%E7%B2%BE%E9%9D%88/assets/nIv7Dq8.jpg", alt: 'Image alternate text', }),
                    },
                },
            }));
        }
        conv.ask(new Suggestions('回主頁面', '👋 掰掰'));
    }).catch(function(error) {
        conv.ask(new SimpleResponse({
            speech: `<speak><p><s>發生錯誤，無法獲取最新資訊</s></p></speak>`,
            text: "獲取資料過程似乎發生錯誤",
        }));
        console.log(error)
        conv.close(new BasicCard({
            image: new Image({ url: 'https://dummyimage.com/1089x726/1a73e8/ffffff.png&text=%E9%8C%AF%E8%AA%A4', alt: 'Pictures', }),
            title: "獲取資料發生錯誤",
            display: 'CROPPED',
        }));
    });

});


app.intent('快速呼叫選單', (conv, { select_area }) => {


    if (conv.screen) {
        conv.ask(new SimpleResponse({
            speech: `<speak><p><s>以下是${select_area}的細分列表，點擊來選擇海域</s></p></speak>`,
            text: '下面是' + select_area + '的詳細列表'
        }));
    } else {

        var area_dict={
            "台灣近海":"台灣北部、台灣西半部、台灣東半部、離島區域",
            "遠洋地區":"台灣周圍、北部海域、南海地區"
        }
        conv.ask(new SimpleResponse({
            speech: `<speak><p><s>以下是${select_area}的細分列表</s><s>選項有以下幾個，${area_dict[select_area]}<break time="0.5s"/>請選擇。</s></p></speak>`,
            text: '以下是「臺北市」的監測站列表'
        }));
    }

    conv.ask(new Suggestions('回主頁面', '👋 掰掰'));
    conv.contexts.set(SelectContexts.parameter, 5);

    conv.ask(new Carousel({
        title: 'Carousel Title',
        items: sea_area_options[select_area]
    }));

});


app.intent('結束對話', (conv) => {
    conv.user.storage = {}; //離開同時清除暫存資料
    conv.ask('希望能幫到一點忙!');
    conv.ask(new SimpleResponse({ speech: '下次見', text: '下次見 👋', }));
    conv.close(new BasicCard({
        title: '感謝您的使用!',
        text: '如果有任何需要改進的地方，  \n歡迎到簡介頁面評分或給予反饋，謝謝!',
        buttons: new Button({ title: '開啟本程式的商店頁面', url: 'https://assistant.google.com/services/a/uid/0000003f49171d8f', }),
    }));
});

// Set the DialogflowApp object to handle the HTTPS POST request.
exports.tw_sea_weather = functions.https.onRequest(app);