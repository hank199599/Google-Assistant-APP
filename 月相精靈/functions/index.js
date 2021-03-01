'use strict';

// Import the Dialogflow module from the Actions on Google client library.
const {
    dialogflow,
    Table,
    SimpleResponse,
    Button,
    Image,
    items
} = require('actions-on-google');

// Import the firebase-functions package for deployment.
const functions = require('firebase-functions');

// Instantiate the Dialogflow client.
const app = dialogflow({ debug: true });

var weekdays = "日,一,二,三,四,五,六".split(",");
var transform_time = [];
var lune = require('lune')
var current_phase = "";

var moon_number = {
    "0": ["新月", "https://raw.githubusercontent.com/hank199599/Google-Assistant-APP/master/%E6%9C%88%E7%9B%B8%E7%B2%BE%E9%9D%88/assets/iMPWACq.png", "12:00", "06:00", "18:00"],
    "1": ["眉月", "https://raw.githubusercontent.com/hank199599/Google-Assistant-APP/master/%E6%9C%88%E7%9B%B8%E7%B2%BE%E9%9D%88/assets/9pUqY9K.png", "15:00", "09:00", "21:00"],
    "2": ["上弦月", "https://raw.githubusercontent.com/hank199599/Google-Assistant-APP/master/%E6%9C%88%E7%9B%B8%E7%B2%BE%E9%9D%88/assets/VkkoyuO.png", "18:00", "12:00", " 00:00"],
    "3": ["盈凸月", "https://raw.githubusercontent.com/hank199599/Google-Assistant-APP/master/%E6%9C%88%E7%9B%B8%E7%B2%BE%E9%9D%88/assets/dP2415s.png", "21:00", "15:00", "03:00"],
    "4": ["滿月", "https://raw.githubusercontent.com/hank199599/Google-Assistant-APP/master/%E6%9C%88%E7%9B%B8%E7%B2%BE%E9%9D%88/assets/xMo4ZOT.png", "00:00", "18:00", "06:00"],
    "5": ["虧凸月", "https://raw.githubusercontent.com/hank199599/Google-Assistant-APP/master/%E6%9C%88%E7%9B%B8%E7%B2%BE%E9%9D%88/assets/UxEnWkE.png", "03:00", "21:00", "09:00"],
    "6": ["下弦月", "https://raw.githubusercontent.com/hank199599/Google-Assistant-APP/master/%E6%9C%88%E7%9B%B8%E7%B2%BE%E9%9D%88/assets/uOZGZr3.png", "06:00", "00:00", "12:00"],
    "7": ["殘月", "https://raw.githubusercontent.com/hank199599/Google-Assistant-APP/master/%E6%9C%88%E7%9B%B8%E7%B2%BE%E9%9D%88/assets/bjF2LsJ.png", "09:00", "03:00", "15:00"]
};


function getDay() {
    var today = new Date();
    var nowTime = today.getTime() + 8 * 3600 * 1000;
    today.setTime(parseInt(nowTime));
    var oMoth = (today.getMonth() + 1).toString();
    var oDay = today.getDate().toString();
    var oWeek = weekdays[today.getDay()];
    return [oMoth + '月' + oDay + '日', oWeek];
}

function Round(val, precision) {
    return Math.round(Math.round(val * Math.pow(10, (precision || 0) + 1)) / 10) / Math.pow(10, (precision || 0));
}

function getMoonPhase() {
    current_phase = lune.phase();
    var b = 0;
    var phase = Round(current_phase.phase * 100, 2);

    if (phase <= 1) { b = 0; } else if (phase > 1 && phase <= 25) { b = 1; } else if (phase > 25 && phase <= 26) { b = 2; } else if (phase > 26 && phase <= 50) { b = 3; } else if (phase > 50 && phase <= 51) { b = 4; } else if (phase > 51 && phase <= 75) { b = 5; } else if (phase > 75 && phase <= 76) { b = 6; } else if (phase > 76 && phase <= 100) { b = 7; }

    var m = current_phase.illuminated;
    var illum = Round(m * 100, 2);
    var age = parseInt(current_phase.age);
    return [moon_number[b], illum, age];
}


app.intent('預設歡迎語句', (conv) => {

    var data = getMoonPhase();

    conv.ask(new SimpleResponse({
        speech: `<speak><p><s>今天是${data[0][0]}，處於月向週期中的第${data[2]}天。</s><s>亮度為${data[1]}%，大概在${data[0][2]}來到天空中央。</s></p></speak>`,
        text: '今天' + getDay()[0] + ' (' + getDay()[1] + ') 的月相資訊如下',
    }));

    conv.close(new Table({
        title: data[0][0] + '\n月相週期的第' + data[2] + '天\n亮度為' + data[1] + '%',
        image: new Image({
            url: data[0][1],
            alt: 'Alt Text',
        }),
        columns: [{ header: '平均月出時間', align: 'CENTER', }, { header: '月上中天標準時間', align: 'CENTER', }, { header: '平均月末時間', align: 'CENTER', }, ],
        rows: [{ cells: [data[0][3], data[0][2], data[0][4]], dividerAfter: false, }, ]
    }));

});

app.intent('現在位置', (conv) => {

    var data = getMoonPhase();

    conv.ask(new SimpleResponse({
        speech: `<speak><p><s>今天是${data[0][0]}，處於月向週期中的第${data[2]}天。</s><s>亮度為${data[1]}%，大概在${data[0][2]}來到天空中央。</s></p></speak>`,
        text: '今天' + getDay()[0] + ' (' + getDay()[1] + ') 的月相資訊如下',
    }));

    conv.close(new Table({
        title: data[0][0] + '\n月相週期的第' + data[2] + '天\n亮度為' + data[1] + '%',
        image: new Image({
            url: data[0][1],
            alt: 'Alt Text',
        }),
        columns: [{ header: '平均月出時間', align: 'CENTER', }, { header: '月上中天標準時間', align: 'CENTER', }, { header: '平均月末時間', align: 'CENTER', }, ],
        rows: [{ cells: [data[0][3], data[0][2], data[0][4]], dividerAfter: false, }, ]
    }));

});


// Set the DialogflowApp object to handle the HTTPS POST request.
exports.moon_phrase = functions.https.onRequest(app);