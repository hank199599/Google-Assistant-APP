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
var positive_quote = require('./positive_quote.json');

var theArray = ["https://raw.githubusercontent.com/hank199599/Google-Assistant-APP/master/%E8%B2%A0%E8%83%BD%E9%87%8F%E8%AA%9E%E9%8C%84/audio/Saving_the_World.mp3", "https://raw.githubusercontent.com/hank199599/Google-Assistant-APP/master/%E8%B2%A0%E8%83%BD%E9%87%8F%E8%AA%9E%E9%8C%84/audio/Oceans_Rivers_Canyons.mp3", "https://raw.githubusercontent.com/hank199599/Google-Assistant-APP/master/%E8%B2%A0%E8%83%BD%E9%87%8F%E8%AA%9E%E9%8C%84/audio/Morning_Dew.mp3", "https://raw.githubusercontent.com/hank199599/Google-Assistant-APP/master/%E8%B2%A0%E8%83%BD%E9%87%8F%E8%AA%9E%E9%8C%84/audio/Borderless.mp3", "https://raw.githubusercontent.com/hank199599/Google-Assistant-APP/master/%E8%B2%A0%E8%83%BD%E9%87%8F%E8%AA%9E%E9%8C%84/audio/Air_to_the_Throne.mp3", "https://raw.githubusercontent.com/hank199599/Google-Assistant-APP/master/%E8%B2%A0%E8%83%BD%E9%87%8F%E8%AA%9E%E9%8C%84/audio/Adrift.mp3"];

var T_total = Object.keys(positive_quote).length; //語錄總數
var weekdays = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];

function getDay() {
    var today = new Date();
    var nowTime = today.getTime() + 8 * 3600 * 1000;
    today.setTime(parseInt(nowTime));
    var oMoth = (today.getMonth() + 1).toString();
    var oDay = today.getDate().toString();
    var oWeek = weekdays[today.getDay()];
    return oMoth + '月' + oDay + '日 ' + oWeek;
}

//歡迎畫面
app.intent('預設歡迎語句', (conv) => {

    var Music = theArray[parseInt(Math.random() * 5)]; //挑選這次的音樂編號
    var T = parseInt(Math.random() * T_total);
    var T_Output = positive_quote[T];


    conv.ask(new SimpleResponse({
        speech: `<speak><par><media xml:id="quote" begin="3s" soundLevel="+6dB"><speak><p><s>${T_Output}</s></p></speak></media><media xml:id="sound" repeatCount="1" soundLevel="-6db"><audio src="${Music}"/></media><media begin="sound.end-5s" soundLevel="+6dB"><speak>祝你有個美好的一天!。</speak></media></par></speak>`,
        text: '今天是' + getDay() + '  \n祝你有個充滿正能量的一天☀',
    }));
    conv.close(new BasicCard({
        title: T_Output,
        text: '《第' + (T + 1) + '則》',
    }));

});

// Set the DialogflowApp object to handle the HTTPS POST request.
exports.positive_quote = functions.https.onRequest(app);