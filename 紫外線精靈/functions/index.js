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
    Carousel
} = require('actions-on-google');

// Import the firebase-functions package for deployment.
const functions = require('firebase-functions');
var getJSON = require('get-json')
const findNearestLocation = require('map-nearest-location');
const app = dialogflow({ debug: true });
const admin = require('firebase-admin');
var option_list = require("./option.json");
var county_options = require("./county_list.json");
var generator = require("./generator.js");
let serviceAccount = require("./config/b1a2b-krmfch-firebase-adminsdk-1tgdm-1b1e1b99db.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://b1a2b-krmfch.firebaseio.com/"
});

const database = admin.database();

var station_array = ["斗六", "日月潭", "玉山", "成功", "朴子", "沙鹿", "宜蘭", "板橋", "花蓮", "金門", "阿里山", "南投", "屏東", "恆春", "苗栗", "桃園", "馬祖", "高雄", "基隆", "淡水", "塔塔加", "新竹", "新屋", "新營", "嘉義", "彰化", "臺中", "臺北", "臺東", "臺南", "澎湖", "鞍部", "橋頭", "蘭嶼"];
var county_array = ["南投縣", "連江縣", "馬祖", "南投", "雲林縣", "雲林", "金門縣", "金門", "苗栗縣", "苗栗", "高雄市", "高雄", "嘉義市", "花蓮縣", "花蓮", "嘉義縣", "台東縣", "臺東縣", "台東", "臺東", "嘉義", "基隆市", "台北市", "台南市", "臺南市", "台南", "臺南", "臺北市", "台北", "臺北", "基隆", "宜蘭縣", "台中市", "臺中市", "台中", "澎湖縣", "澎湖", "桃園市", "桃園", "新竹縣", "新竹市", "新竹", "新北市", "新北", "宜蘭", "屏東縣", "屏東", "彰化縣", "彰化"];
var option_array = ["北部地區", "中部地區", "南部地區", "東部地區", "離島地區"];

const SelectContexts = {
    parameter: 'select ',
}

app.intent('預設歡迎語句', (conv) => {

    return new Promise(
        function(resolve, reject) {
            database.ref('/TWuvi').on('value', e => { resolve(e.val()) }); 
        }).then(function(origin_data) {

        var PublishTime = origin_data.PublishTime
        
        var speech_content = {
            speech: `<speak><p><s>歡迎回來，請問你要查詢哪一個站點呢?</s></p></speak>`,
            text: '歡迎使用!'
        };

        if (conv.screen) {
            if (conv.user.last.seen === undefined) {
                speech_content.speech = `<speak><p><s>歡迎使用紫外線精靈!</s><s>我能提供各縣市的紫外線查詢服務，此外，你能將我加入日常安排快速查詢所需站點。</s></p></speak>`;
            }

            var card_display = {
                image: new Image({ url: "https://raw.githubusercontent.com/hank199599/Google-Assistant-APP/master/%E7%B4%AB%E5%A4%96%E7%B7%9A%E7%B2%BE%E9%9D%88/assets/0Is452b.jpg", alt: 'Pictures', }),
                title: "嘆息西窗過隙駒，微陽初至日光舒",
                display: 'CROPPED',
                subtitle: "請試著說要查詢的縣市，\n或點擊建議卡片來進行操作。",
                text: "測站資訊發布時間 • " + PublishTime,
                buttons: new Button({ title: '中央氣象局', url: 'https://www.cwb.gov.tw/V8/C/W/MFC_UVI_Map.html', }),
            }

            if (hour_now < 6 || hour_now > 17) {
                card_display.image = new Image({ url: "https://raw.githubusercontent.com/hank199599/Google-Assistant-APP/master/%E7%B4%AB%E5%A4%96%E7%B7%9A%E7%B2%BE%E9%9D%88/assets/ejlSjF3.png", alt: 'Pictures', })
                card_display.title = "明月，明月，胡笳一聲愁絕";
            }

            conv.ask(new SimpleResponse(speech_content));
            conv.ask(new BasicCard(card_display));
            conv.ask(new Suggestions('🌎 最近的測站', '🔎依區域查詢', '語音指令範例', '紫外線指數是什麼 ', '如何加入日常安排', '👋 掰掰'));

        } else {

            var word1 = county_array[parseFloat(Math.random() * 19)];
            var word2 = county_array[20 + parseFloat(Math.random() * 28)];

            conv.ask(`<speak><p><s>歡迎使用紫外線精靈</s></p></speak>`);
            conv.ask(`<speak><p><s>請試著問我要查詢的縣市!</s><s>例如<break time="0.5s"/>幫我查${word1}<break time="0.2s"/>或<break time="0.2s"/>${word2}狀況怎樣?</s></p></speak>`);
            conv.noInputs = ["請說出查詢的縣市!、例如、幫我查" + word1, "請說出你要查詢的縣市", "抱歉，我想我幫不上忙。"];
        }

    }).catch(function(error) {
        console.log(error)
        conv.contexts.set(SelectContexts.parameter, 5);

        if (!conv.screen) { conv.expectUserResponse = false; }

        conv.ask(new SimpleResponse({
            speech: `<speak><p><s>抱歉，查詢過程發生一點小狀況</s></p></speak>`,
            text: '查詢過程發生一點小狀況，\n請輕觸下方卡片來重新查詢!'
        }));

        conv.ask(new BasicCard({
            image: new Image({ url: "https://dummyimage.com/1037x539/ef2121/ffffff.png&text=錯誤", alt: 'Pictures', }),
            title: '數據加載發生問題',
            subtitle: '請過一段時間後再回來查看',
            text: '錯誤訊息：' + String(error),
            display: 'CROPPED',
        }));

        conv.ask(new Suggestions('🌎 最近的測站', '語音指令範例'));
    });
});

app.intent('依區域查詢', (conv) => {

    conv.contexts.set(SelectContexts.parameter, 5);

    if (conv.screen) { conv.ask('請輕觸下方卡片來選擇查詢區域'); } else {
        conv.ask(new SimpleResponse({
            speech: `<speak><p><s>請選擇要查詢的區域!</s><s>選項有以下幾個<break time="0.5s"/>北部地區<break time="0.2s"/>中部地區<break time="0.2s"/>南部地區<break time="0.2s"/>東部地區<break time="0.2s"/>離島地區<break time="1s"/>請選擇。</s></p></speak>`,
            text: '請輕觸下方卡片來選擇查詢區域!'
        }));
    }
    conv.ask(new Carousel(county_options));
    conv.ask(new Suggestions('🌎 最近的測站', '語音指令範例', '👋 掰掰'));

});

app.intent('縣市查詢結果', (conv, input, option) => {

    return new Promise(
        function(resolve, reject) {
            database.ref('/TWuvi').on('value', e => { resolve(e.val()) });
        }).then(function(origin_data) {

        var UVI_list = origin_data.data;
        var station_array = Object.keys(origin_data.data);

        if (option_array.indexOf(option) !== -1) {
            conv.contexts.set(SelectContexts.parameter, 5);
            if (conv.screen) {
                conv.ask(new SimpleResponse({
                    speech: `<speak><p><s>以下是「${option}」的監測站列表</s><s>請查看。</s></p></speak>`,
                    text: '以下是「' + option + '」的監測站列表'
                }));
            } else { conv.ask(new SimpleResponse(`<speak><p><s>以下是「${option}」的監測站列表</s><s>選項有以下幾個<break time="0.5s"/>${option_list[option]}<break time="1s"/>請選擇。</s></p></speak>`)); }

            var the_array = option_list[option].split('、');
            var county_list = {};

            for (var i = 0; i < the_array.length; i++) {

                var uvi_temp = UVI_list[the_array[i]];

                if (uvi_temp !== undefined) {
                    county_list[the_array[i]] = {
                        title: the_array[i],
                        description: generator.status(parseFloat(uvi_temp)),
                        image: new Image({ url: generator.picture_small(parseFloat(uvi_temp)), alt: 'Image alternate text', }),
                    }
                }
            }

            conv.ask(new Carousel({
                title: 'Carousel Title',
                items: county_list,
            }));

            conv.ask(new Suggestions('回主頁面'));

        } else if (station_array.indexOf(option) !== -1) {

            var UVI = parseFloat(UVI_list[option]);
            var Status = generator.status(UVI);

            if (Status !== "儀器故障或校驗") {

                conv.ask(new SimpleResponse({
                    speech: `<speak><p><s>根據最新資料顯示，${option}監測站的紫外線指數為${UVI}</s><s>${generator.info(UVI)}</s></p></speak>`,
                    text: '以下為該監測站的詳細資訊'
                }));

                if (conv.screen) {
                    conv.ask(new BasicCard({
                        image: new Image({ url: generator.picture(UVI), alt: 'Pictures', }),
                        display: 'CROPPED',
                        title: option,
                        subtitle: Status,
                        text: generator.info_output(UVI) + '  \n  \n**測站資訊發布時間** • ' + origin_data.PublishTime,
                    }));
                    conv.ask(new Suggestions('把它加入日常安排', '回主頁面'));
                } else { conv.close(`<speak><p><s>歡迎你隨時回來查詢，下次見</s></p></speak>`); }

            } else {
                conv.ask(new SimpleResponse({
                    speech: `<speak><p><s>由於${option}監測站正處於維修狀態或數據不足。我無法提供你最新資訊。</s></p></speak>`,
                    text: '以下為該監測站的詳細資訊'
                }));
                if (conv.screen) {
                    conv.ask(new BasicCard({
                        image: new Image({ url: "https://dummyimage.com/1037x539/232830/ffffff.png&text=NaN", alt: 'Pictures', }),
                        title: option,
                        subtitle: '儀器故障或校驗',
                        text: '設備維護、儀器校正、儀器異常、傳輸異常、電力異常 \n或儀器故障或校驗等需查修維護情形，以致資料暫時中斷服務。  \n  \n**測站資訊發布時間** • ' + origin_data.PublishTime,
                        display: 'CROPPED',
                    }));
                    conv.ask(new Suggestions('把它加入日常安排', '回主頁面'));
                } else { conv.close(`<speak><p><s>歡迎你隨時回來查詢，下次見</s></p></speak>`); }

            }
        } else {
            conv.contexts.set(SelectContexts.parameter, 5);

            if (conv.screen) { conv.ask('請輕觸下方卡片來選擇查詢區域'); } else {
                conv.ask(new SimpleResponse({
                    speech: `<speak><p><s>請選擇要查詢的區域!</s><s>選項有以下幾個<break time="0.5s"/>北部地區<break time="0.2s"/>中部地區<break time="0.2s"/>南部地區<break time="0.2s"/>東部地區<break time="0.2s"/>離島地區<break time="1s"/>請選擇。</s></p></speak>`,
                    text: '請輕觸下方卡片來選擇查詢區域!'
                }));
            }
            conv.ask(new Carousel(county_options));
            conv.ask(new Suggestions('🌎 最近的測站', '語音指令範例', '👋 掰掰'));
        }

        if (conv.screen) {
            conv.ask(new Suggestions('👋 掰掰'));
            conv.user.storage.choose_station = option;
        }

    }).catch(function(error) {
        console.log(error)
        conv.contexts.set(SelectContexts.parameter, 5);

        if (!conv.screen) { conv.expectUserResponse = false; }

        conv.ask(new SimpleResponse({
            speech: `<speak><p><s>抱歉，查詢過程發生一點小狀況</s></p></speak>`,
            text: '查詢過程發生一點小狀況，\n請輕觸下方卡片來重新查詢!'
        }));

        conv.ask(new BasicCard({
            image: new Image({ url: "https://dummyimage.com/1037x539/ef2121/ffffff.png&text=錯誤", alt: 'Pictures', }),
            title: '數據加載發生問題',
            subtitle: '請過一段時間後再回來查看',
            text: '錯誤訊息：' + String(error),
            display: 'CROPPED',
        }));

        conv.ask(new Suggestions('🌎 最近的測站', '語音指令範例'));
    });

});

app.intent('Default Fallback Intent', (conv) => {

    var word1 = county_array[parseFloat(Math.random() * 19)];
    var word2 = county_array[20 + parseFloat(Math.random() * 28)];

    if (conv.input.type === "VOICE") { //如果輸入是語音，則顯示錯誤處理方法
        conv.ask(new SimpleResponse({
            speech: `<speak><p><s>抱歉，我不懂你的意思</s><s>請試著問我<break time="0.2s"/>${word1}紫外線指數為何?<break time="0.2s"/>或<break time="0.2s"/>幫我查詢${word2}</s></p></speak>`,
            text: '試著提問來快速存取縣市列表，\n或點選建議卡片來進行操作!'
        }));
        if (conv.screen) {
            conv.ask(new BasicCard({
                title: "語音查詢範例",
                subtitle: "以下是你可以嘗試的指令",
                text: " • *「" + word1 + "紫外線指數為何?」*  \n • *「幫我查詢" + word2 + "」*  \n • *「我想知道" + county_array[parseFloat(Math.random() * 48)] + "狀況怎樣」*  \n • *「幫我找" + county_array[parseFloat(Math.random() * 48)] + "」*  \n • *「我想看" + county_array[parseFloat(Math.random() * 48)] + "」*  \n • *「" + county_array[parseFloat(Math.random() * 48)] + "狀況好嗎?」*  \n • *「我要查" + county_array[parseFloat(Math.random() * 48)] + "」*",
            }));
            conv.ask(new Suggestions(word1 + '紫外線指數為何?', '幫我查詢' + word2));
        } else {
            conv.noInputs = [`<speak><p><s>請說出查詢的縣市!</s><s>例如<break time="0.5s"/>幫我查${word1}</s></p></speak>`, "請說出你要查詢的縣市", "抱歉，我想我幫不上忙。"];
        }
    } else {
        conv.ask('抱歉，我不懂你的意思，\n請點選建議卡片來進行操作。');
    }

    conv.ask(new Suggestions('🌎 最近的測站', '🔎依區域查詢', '👋 掰掰'));

});

app.intent('語音指令範例', (conv) => {
    var word1 = county_array[parseFloat(Math.random() * 19)];
    var word2 = county_array[20 + parseFloat(Math.random() * 28)];
    var word3 = county_array[parseFloat(Math.random() * 48)];

    conv.ask(new SimpleResponse({
        speech: `<speak><p><s>在任意畫面中，你隨時都能快速查詢縣市列表</s><s>你可以試著問<break time="0.2s"/>${word1}紫外線指數為何?<break time="0.2s"/>或<break time="0.2s"/>幫我查詢${word2}</s></p></speak>`,
        text: '試著提問來快速存取縣市列表，\n以下是你可以嘗試的詢問方式!'
    }));
    conv.ask(new BasicCard({
        title: "語音查詢範例",
        subtitle: "以下是你可以嘗試的指令",
        text: " • *「" + word1 + "紫外線指數為何?」*  \n • *「幫我查詢" + word2 + "」*  \n • *「我想知道" + word3 + "狀況怎樣」*  \n • *「幫我找" + county_array[parseFloat(Math.random() * 48)] + "」*  \n • *「我想看" + county_array[parseFloat(Math.random() * 48)] + "」*  \n • *「" + county_array[parseFloat(Math.random() * 48)] + "狀況好嗎?」*  \n • *「我要查" + county_array[parseFloat(Math.random() * 48)] + "」*",
    }));
    conv.ask(new Suggestions(word1 + '紫外線指數為何?', '幫我查詢' + word2, '我想知道' + word3 + '狀況怎樣', '🌎 最近的測站', '🔎依區域查詢', '👋 掰掰'));

});

app.intent('直接查詢', (conv, { station }) => {

    return new Promise(
        function(resolve, reject) {
            database.ref('/TWuvi').on('value', e => { resolve(e.val()) });
        }).then(function(origin_data) {

        var UVI_list = origin_data.data;

        var indexed_UVI = UVI_list[station]; //取得監測站對應的編號

        if (indexed_UVI === undefined) {
            conv.ask(new SimpleResponse({
                speech: `<speak><p><s>抱歉，您所查詢的監測站似乎不存在，我無法提供你最新資訊。</s></p></speak>`,
                text: '抱歉，我無法提供協助'
            }));
            conv.close(new BasicCard({
                image: new Image({ url: "https://dummyimage.com/1037x539/232830/ffffff.png&text=NaN", alt: 'Pictures', }),
                title: '找不到您指定的測站名稱',
                subtitle: '請確認輸入的測站名稱是否有誤',
                display: 'CROPPED',
            }));

        } else {
            var UVI = parseFloat(indexed_UVI);
            var Status = generator.status(UVI);

            if (Status !== "儀器故障或校驗") {

                conv.ask(new SimpleResponse({
                    speech: `<speak><p><s>根據最新資料顯示，${station}監測站的紫外線指數為${UVI}</s><s>${generator.info(UVI)}</s></p></speak>`,
                    text: '以下為該監測站的詳細資訊'
                }));
                conv.close(new BasicCard({
                    image: new Image({ url: generator.picture(UVI), alt: 'Pictures', }),
                    display: 'CROPPED',
                    title: station,
                    subtitle: Status,
                    text: generator.info_output(UVI) + '  \n  \n**測站資訊發布時間** • ' + origin_data.PublishTime,
                }));
            } else {
                conv.ask(new SimpleResponse({
                    speech: `<speak><p><s>由於${station}監測站數據不足或處於維修狀態，我無法提供你最新資訊。</s></p></speak>`,
                    text: '以下為該監測站的詳細資訊'
                }));
                conv.close(new BasicCard({
                    image: new Image({ url: "https://dummyimage.com/1037x539/232830/ffffff.png&text=NaN", alt: 'Pictures', }),
                    title: '儀器故障或校驗',
                    title: station,
                    subtitle: '儀器故障或校驗',
                    text: '設備維護、儀器校正、儀器異常、傳輸異常、電力異常 \n或儀器故障或校驗等需查修維護情形，以致資料暫時中斷服務。  \n  \n**測站資訊發布時間** • ' + origin_data.PublishTime,
                    display: 'CROPPED',
                }));
            }
        }
    }).catch(function(error) {
        console.log(error);

        if (!conv.screen) { conv.expectUserResponse = false; }

        conv.ask(new SimpleResponse({
            speech: `<speak><p><s>糟糕，查詢似乎發生錯誤。請稍後再試。</s></p></speak>`,
            text: '發生錯誤，請稍後再試一次。'
        }));
        conv.ask(new BasicCard({
            image: new Image({ url: "https://dummyimage.com/1037x539/ef2121/ffffff.png&text=錯誤", alt: 'Pictures', }),
            title: '數據加載發生問題',
            subtitle: '請過一段時間後再回來查看',
            text: '錯誤訊息：' + String(error),
            display: 'CROPPED',
        }));
        conv.ask(new Suggestions('🌎 最近的測站', '語音指令範例'));

    });

});

app.intent('日常安排教學', (conv) => {

    var choose_station = conv.user.storage.choose_station;

    if (station_array.indexOf(choose_station) === -1) { choose_station = station_array[parseFloat(Math.random() * 34)]; }
    conv.ask(new SimpleResponse({
        speech: `<speak><p><s>透過加入日常安排，你可以快速存取要查詢的站點。</s><s>舉例來說，如果你把${choose_station}加入日常安排。你即可隨時呼叫我查詢該站點的最新紫外線指數!</s><s>以下為詳細說明</s></p></speak>`,
        text: '以下為詳細說明。'
    }));

    conv.ask(new BasicCard({
        image: new Image({ url: "https://raw.githubusercontent.com/hank199599/Google-Assistant-APP/master/%E7%B4%AB%E5%A4%96%E7%B7%9A%E7%B2%BE%E9%9D%88/assets/82c8u4T.png", alt: 'Pictures', }),
        title: '將「' + choose_station + '」加入日常安排',
        display: 'CROPPED',
        subtitle: '1.點擊畫面右上方大頭貼 > 點擊[設定]\n2.切換到[Google助理]分頁 > 點擊[日常安排]\n3.點擊[新增日常安排]\n4.「新增指令(必填)」輸入「紫外線指數」\n5.「新增動作」輸入\n「叫紫外線精靈查詢' + choose_station + '站」\n6.輸入完成後點擊「儲存」\n7.現在，你可以透過說出或輸入「紫外線指數」來快速查詢' + choose_station + '的UVI指數!',
    }));

    conv.ask(new Suggestions('🌎 最近的測站', '🔎依區域查詢', '👋 掰掰'));

});

app.intent('紫外線是甚麼', (conv) => {

    conv.ask(new SimpleResponse({
        speech: `<speak><p><s>以下是氣象局對紫外線指數的說明</s><break time="1s"/><s>紫外線指數是指到達地面單位面積的紫外線輻射量強度的數值，紫外線指數越大，代表一定時間中累積的紫外線輻射強度越強。依據世界衛生組織相關規範，針對紫外線指數分級如下表：其中指數小於等於2時為低量級、指數3～5為中量級，指數6～7為高量級，指數8～10為過量級，指數大於等於11則為危險級。</s></p></speak>`,
        text: '以下為詳細說明。'
    }));
    conv.ask(new BasicCard({
        image: new Image({ url: "https://raw.githubusercontent.com/hank199599/Google-Assistant-APP/master/%E7%B4%AB%E5%A4%96%E7%B7%9A%E7%B2%BE%E9%9D%88/assets/aldRVA5.png", alt: 'Pictures', }),
        title: "紫外線指數",
        subtitle: '到達地面單位面積的紫外線輻射量強度的數值',
        text: " • 指數≦2:低量級  \n • 3~5:中量級  \n • 6~7:高量級  \n • 8~10:過量級  \n • 指數≧11:危險級  \n  \nⒸ 圖文資訊來自 交通部中央氣象局"
    }));
    conv.ask(new Suggestions('🌎 最近的測站', '🔎依區域查詢', '👋 掰掰'));


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

    return new Promise(
        function(resolve, reject) {
            database.ref('/TWuvi').on('value', e => { resolve(e.val()) });
        }).then(function(origin_data) {

        var UVI_list = origin_data.data;
        var locations = origin_data.locations;

        if (permissionGranted) {
            const { requestedPermission } = conv.data;

            if (requestedPermission === 'DEVICE_PRECISE_LOCATION') {

                const coordinates = conv.device.location.coordinates;

                conv.ask(new Suggestions('重新定位'));

                if (coordinates) {
                    const myLocation = {
                        lat: coordinates.latitude,
                        lng: coordinates.longitude
                    };

                    var sitename = (findNearestLocation(myLocation, locations)).location.Sitename; //透過模組找到最近的測站				
                    var UVI = parseFloat(UVI_list[sitename]);
                    var Status = generator.status(UVI);

                    conv.ask(new SimpleResponse({ speech: `<speak><p><s>查詢完成!</s><s>距離你最近的測站是<break time="0.2s"/>${sitename}。</s></p></speak>`, text: '最近的測站是「' + sitename + '」!' }));


                    if (Status !== "儀器故障或校驗") {

                        conv.ask(new SimpleResponse({
                            speech: `<speak><p><s>根據最新資料顯示，${sitename}監測站的紫外線指數為${UVI}</s><s>${generator.info(UVI)}</s></p></speak>`,
                            text: '以下為該監測站的詳細資訊'
                        }));
                        conv.ask(new BasicCard({
                            image: new Image({ url: generator.picture(UVI), alt: 'Pictures', }),
                            display: 'CROPPED',
                            title: sitename,
                            subtitle: Status,
                            text: generator.info_output(UVI) + '  \n  \n**測站資訊發布時間** • ' + origin_data.PublishTime,
                        }));

                        conv.ask(new Suggestions('把它加入日常安排', '回主頁面'));
                    } else {
                        conv.ask(new SimpleResponse({
                            speech: `<speak><p><s>由於${sitename}監測站數據不足或處於維修狀態，我無法提供你最新資訊。</s></p></speak>`,
                            text: '以下為該監測站的詳細資訊'
                        }));
                        conv.ask(new BasicCard({
                            image: new Image({ url: "https://dummyimage.com/1037x539/232830/ffffff.png&text=NaN", alt: 'Pictures', }),
                            title: '儀器故障或校驗',
                            title: sitename,
                            subtitle: '儀器故障或校驗',
                            text: '設備維護、儀器校正、儀器異常、傳輸異常、電力異常 \n或儀器故障或校驗等需查修維護情形，以致資料暫時中斷服務。  \n  \n**測站資訊發布時間** • ' + origin_data.PublishTime,
                            display: 'CROPPED',
                        }));
                    }

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
        conv.ask(new Suggestions('🔎依區域查詢', '👋 掰掰'));
        conv.user.storage.choose_station = sitename;

    }).catch(function(error) {
        console.log(error);

        if (!conv.screen) { conv.expectUserResponse = false; }

        conv.ask(new SimpleResponse({
            speech: `<speak><p><s>糟糕，查詢似乎發生錯誤。請稍後再試。</s></p></speak>`,
            text: '發生錯誤，請稍後再試一次。'
        }));

        conv.ask(new BasicCard({
            image: new Image({ url: "https://dummyimage.com/1037x539/ef2121/ffffff.png&text=錯誤", alt: 'Pictures', }),
            title: '數據加載發生問題',
            subtitle: '請過一段時間後再回來查看',
            text: '錯誤訊息：' + String(error),
            display: 'CROPPED',
        }));
        conv.ask(new Suggestions('🔎依區域查詢', '👋 掰掰'));
    });

});

app.intent('直接查詢縣市選單', (conv, { County }) => {

    return new Promise(
        function(resolve, reject) {
            database.ref('/TWuvi').on('value', e => { resolve(e.val()) });
        }).then(function(origin_data) {
        var UVI_list = origin_data.data;
        var station_array = Object.keys(origin_data.data);

        if (conv.input.raw.indexOf('新北') !== -1) { County = "新北市"; }
        if (conv.input.raw === '嘉義') { County = "嘉義"; }

        if (["臺北市", "新北市", "桃園市", "臺中市", "南投縣", "臺東縣", "嘉義縣市", "臺南市", "高雄市", "屏東縣"].indexOf(County) != -1) {

            if (conv.screen) {
                conv.ask(new SimpleResponse({
                    speech: `<speak><p><s>以下是「${County}」的監測站列表</s><s>請查看。</s></p></speak>`,
                    text: '以下是「' + County + '」的監測站列表'
                }));
            } else { conv.ask(new SimpleResponse(`<speak><p><s>以下是「${County}」的監測站列表</s><s>選項有以下幾個<break time="0.5s"/>${option_list[County]}<break time="1s"/>請選擇。</s></p></speak>`)); }

            conv.contexts.set(SelectContexts.parameter, 5);

            var the_array = option_list[County].split('、');
            var county_list = {};

            for (var i = 0; i < the_array.length; i++) {

                var uvi_temp = UVI_list[the_array[i]];

                //if (uvi_temp !== undefined) {
                county_list[the_array[i]] = {
                        title: the_array[i],
                        description: generator.status(parseFloat(uvi_temp)),
                        image: new Image({ url: generator.picture_small(parseFloat(uvi_temp)), alt: 'Image alternate text', }),
                    }
                    //}

            }
            conv.ask(new Carousel({
                title: 'Carousel Title',
                items: county_list,
            }));

        } else if (station_array.indexOf(County) !== -1) {

            var UVI = parseFloat(UVI_list[County]);
            var Status = generator.status(UVI);

            if (Status !== "儀器故障或校驗") {

                conv.ask(new SimpleResponse({
                    speech: `<speak><p><s>根據最新資料顯示，${County}監測站的紫外線指數為${UVI}</s><s>${generator.info(UVI)}</s></p></speak>`,
                    text: '以下為該監測站的詳細資訊'
                }));
                conv.noInputs = ["請試著問我其他縣市來查看其他測站", "請問你還要查詢其他地方嗎?", "抱歉，我想我幫不上忙。"];

                if (conv.screen) {
                    conv.ask(new BasicCard({
                        image: new Image({ url: generator.picture(UVI), alt: 'Pictures', }),
                        display: 'CROPPED',
                        title: County,
                        subtitle: Status,
                        text: generator.info_output(UVI) + '  \n  \n**測站資訊發布時間** • ' + origin_data.PublishTime,
                    }));
                    conv.ask(new Suggestions('把它加入日常安排', '回主頁面'));
                } else { conv.close(`<speak><p><s>歡迎你隨時回來查詢，下次見</s></p></speak>`); }

            } else {
                conv.ask(new SimpleResponse({
                    speech: `<speak><p><s>由於${County}監測站正處於維修狀態或數據不足。我無法提供你最新資訊。</s></p></speak>`,
                    text: '以下為該監測站的詳細資訊'
                }));
                if (conv.screen) {
                    conv.ask(new BasicCard({
                        image: new Image({ url: "https://dummyimage.com/1037x539/232830/ffffff.png&text=NaN", alt: 'Pictures', }),
                        title: County,
                        subtitle: '儀器故障或校驗',
                        text: '設備維護、儀器校正、儀器異常、傳輸異常、電力異常 \n或儀器故障或校驗等需查修維護情形，以致資料暫時中斷服務。  \n  \n**測站資訊發布時間** • ' + origin_data.PublishTime,
                        display: 'CROPPED',
                    }));
                    conv.ask(new Suggestions('把它加入日常安排', '回主頁面'));
                } else { conv.close(`<speak><p><s>歡迎你隨時回來查詢，下次見</s></p></speak>`); }

            }

        } else {
            if (!conv.screen) { conv.expectUserResponse = false; }

            conv.ask(new SimpleResponse({
                speech: `<speak><p><s>糟糕，查詢似乎發生錯誤。請稍後再試。</s></p></speak>`,
                text: '發生錯誤，請稍後再試一次。'
            }));
            conv.ask(new BasicCard({
                image: new Image({ url: "https://dummyimage.com/1037x539/ef2121/ffffff.png&text=錯誤", alt: 'Pictures', }),
                title: '數據加載發生問題',
                subtitle: '請過一段時間後再回來查看',
                text: '錯誤訊息：' + String(error),
                display: 'CROPPED',
            }));
            conv.ask(new Suggestions('🌎 最近的測站', '語音指令範例'));
        }

        if (conv.screen) {
            conv.ask(new Suggestions('👋 掰掰'));
            conv.user.storage.choose_station = County;
        }

    }).catch(function(error) {
        console.log(error);

        if (!conv.screen) { conv.expectUserResponse = false; }

        conv.ask(new SimpleResponse({
            speech: `<speak><p><s>糟糕，查詢似乎發生錯誤。請稍後再試。</s></p></speak>`,
            text: '發生錯誤，請稍後再試一次。'
        }));

        conv.ask(new BasicCard({
            image: new Image({ url: "https://dummyimage.com/1037x539/ef2121/ffffff.png&text=錯誤", alt: 'Pictures', }),
            title: '數據加載發生問題',
            subtitle: '請過一段時間後再回來查看',
            text: '錯誤訊息：' + String(error),
            display: 'CROPPED',
        }));
        conv.ask(new Suggestions('🌎 最近的測站', '語音指令範例'));

    });

});

app.intent('結束對話', (conv) => {
    conv.user.storage = {}; //離開同時清除暫存資料
    conv.ask('希望能幫到一點忙!');
    conv.ask(new SimpleResponse({ speech: '下次見', text: '下次見 👋', }));
    conv.close(new BasicCard({
        title: '感謝您的使用!',
        text: '如果有任何需要改進的地方，  \n歡迎到簡介頁面評分或給予反饋，謝謝!',
        buttons: new Button({ title: '開啟本程式的商店頁面', url: 'https://assistant.google.com/services/a/uid/00000008b2c308d2', }),
    }));
});

// Set the DialogflowApp object to handle the HTTPS POST request.
exports.tw_UVI = functions.https.onRequest(app);