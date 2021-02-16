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
    RegisterUpdate,
    items
} = require('actions-on-google');

// Import the firebase-functions package for deployment.
const functions = require('firebase-functions');

// Instantiate the Dialogflow client.
const app = dialogflow({ debug: true });
var negative_quote = require('./negative_quote.json');

var Music = ''; //背景音樂網址
var theArray = ["https://raw.githubusercontent.com/hank199599/Google-Assistant-APP/master/%E8%B2%A0%E8%83%BD%E9%87%8F%E8%AA%9E%E9%8C%84/audio/We_ll_Meet_Again.mp3", "https://raw.githubusercontent.com/hank199599/Google-Assistant-APP/master/%E8%B2%A0%E8%83%BD%E9%87%8F%E8%AA%9E%E9%8C%84/audio/The_Long_Voyage_To_Outer_Space.mp3", "https://raw.githubusercontent.com/hank199599/Google-Assistant-APP/master/%E8%B2%A0%E8%83%BD%E9%87%8F%E8%AA%9E%E9%8C%84/audio/Slow_Hammers.mp3", "https://raw.githubusercontent.com/hank199599/Google-Assistant-APP/master/%E8%B2%A0%E8%83%BD%E9%87%8F%E8%AA%9E%E9%8C%84/audio/Mournful_Departure.mp3", "https://raw.githubusercontent.com/hank199599/Google-Assistant-APP/master/%E8%B2%A0%E8%83%BD%E9%87%8F%E8%AA%9E%E9%8C%84/audio/It_Happens.mp3", "https://raw.githubusercontent.com/hank199599/Google-Assistant-APP/master/%E8%B2%A0%E8%83%BD%E9%87%8F%E8%AA%9E%E9%8C%84/audio/First_of_the_Last.mp3"];
var T_total = 203; //語錄總數
var T_Output = ''; //語錄內容
var weekdays = "星期日,星期一,星期二,星期三,星期四,星期五,星期六".split(",");
var T = "";
var Today = "";
var Weeknow = "";

function getDay() {
    var today = new Date();
    var nowTime = today.getTime() + 8 * 3600 * 1000;
    today.setTime(parseInt(nowTime));
    var oMoth = (today.getMonth() + 1).toString();
    var oDay = today.getDate().toString();
    var oWeek = weekdays[today.getDay()];
    return [oMoth + '月' + oDay + '日', oWeek];
}

//歡迎畫面
app.intent('預設歡迎語句', (conv) => {

    Music = theArray[parseInt(Math.random() * 5)]; //挑選這次的音樂編號
    Today = getDay()[0];
    Weeknow = getDay()[1];
    T = parseInt(Math.random() * T_total);
    T_Output = negative_quote[T];


    conv.ask(new SimpleResponse({
        speech: `<speak><par><media xml:id="quote" begin="3s" soundLevel="+6dB"><speak><p><s>${T_Output}</s></p></speak></media><media xml:id="sound" repeatCount="1" soundLevel="-3dB"><audio src="${Music}"/></media><media begin="sound.end-5s" soundLevel="+6dB"><speak>重新整理心境後繼續加油吧!</speak></media></par></speak>`,
        text: '今天是' + Today + ' ' + Weeknow + '  \n重新整理心境後繼續加油吧!',
    }));
    conv.close(new BasicCard({
        title: T_Output,
        text: '《第' + (T + 1) + '則》',
    }));

});

// Set the DialogflowApp object to handle the HTTPS POST request.
exports.negative_quote = functions.https.onRequest(app);