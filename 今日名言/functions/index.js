'use strict';

// Import the Dialogflow module from the Actions on Google client library.
const {
    dialogflow,
    Permission,
    Suggestions,
    SimpleResponse,
    Button,
    Image,
    Carousel,
    BasicCard,
    LinkOutSuggestion,
    BrowseCarousel,
    BrowseCarouselItem,
    items,
    Table
} = require('actions-on-google');

const functions = require('firebase-functions');
const replaceString = require('replace-string');
const app = dialogflow({ debug: true });
var picker = require('./daily_quotes.json');
var output_array = "";
var Quote = "";
var reference = "";
var Picture_url = "";
var date = "";
var theArray = ["https://raw.githubusercontent.com/hank199599/Google-Assistant-APP/master/%E4%BB%8A%E6%97%A5%E5%90%8D%E8%A8%80/assets/02rnSIa.jpg", "https://raw.githubusercontent.com/hank199599/Google-Assistant-APP/master/%E4%BB%8A%E6%97%A5%E5%90%8D%E8%A8%80/assets/VfcMtId.jpg", "https://raw.githubusercontent.com/hank199599/Google-Assistant-APP/master/%E4%BB%8A%E6%97%A5%E5%90%8D%E8%A8%80/assets/PLVkbbK.jpg", "https://raw.githubusercontent.com/hank199599/Google-Assistant-APP/master/%E4%BB%8A%E6%97%A5%E5%90%8D%E8%A8%80/assets/LcEpziD.jpg", "https://raw.githubusercontent.com/hank199599/Google-Assistant-APP/master/%E4%BB%8A%E6%97%A5%E5%90%8D%E8%A8%80/assets/EoCooEB.jpg", "https://raw.githubusercontent.com/hank199599/Google-Assistant-APP/master/%E4%BB%8A%E6%97%A5%E5%90%8D%E8%A8%80/assets/hfLI7eK.jpg", "https://raw.githubusercontent.com/hank199599/Google-Assistant-APP/master/%E4%BB%8A%E6%97%A5%E5%90%8D%E8%A8%80/assets/71beT0V.jpg", "https://raw.githubusercontent.com/hank199599/Google-Assistant-APP/master/%E4%BB%8A%E6%97%A5%E5%90%8D%E8%A8%80/assets/FcfNl1w.jpg", "https://raw.githubusercontent.com/hank199599/Google-Assistant-APP/master/%E4%BB%8A%E6%97%A5%E5%90%8D%E8%A8%80/assets/APcShEp.jpg", "https://raw.githubusercontent.com/hank199599/Google-Assistant-APP/master/%E4%BB%8A%E6%97%A5%E5%90%8D%E8%A8%80/assets/4R8PxKA.jpg", "https://raw.githubusercontent.com/hank199599/Google-Assistant-APP/master/%E4%BB%8A%E6%97%A5%E5%90%8D%E8%A8%80/assets/b5vLpDA.jpg", "https://raw.githubusercontent.com/hank199599/Google-Assistant-APP/master/%E4%BB%8A%E6%97%A5%E5%90%8D%E8%A8%80/assets/faaRLCP.jpg", "https://raw.githubusercontent.com/hank199599/Google-Assistant-APP/master/%E4%BB%8A%E6%97%A5%E5%90%8D%E8%A8%80/assets/pTci1ux.jpg", "https://raw.githubusercontent.com/hank199599/Google-Assistant-APP/master/%E4%BB%8A%E6%97%A5%E5%90%8D%E8%A8%80/assets/lYmqldk.jpg", "https://raw.githubusercontent.com/hank199599/Google-Assistant-APP/master/%E4%BB%8A%E6%97%A5%E5%90%8D%E8%A8%80/assets/2oOhmvs.jpg"];

function getDay() {
    var today = new Date();
    var nowTime = today.getTime() + 8 * 3600 * 1000;
    today.setTime(parseInt(nowTime));
    var oMoth = (today.getMonth() + 1).toString();
    var oDay = today.getDate().toString();
    return oMoth + '月' + oDay + '日';
}


app.intent('預設歡迎語句', (conv) => {

    date = getDay();
    output_array = picker[date];
    Quote = output_array[0];
    reference = output_array[1];

    Picture_url = theArray[parseInt(Math.random() * 15)];

    conv.ask(new SimpleResponse({
        speech: `<speak><p><s>以下是${date}的名言</s><break time="0.25s"/><s>${Quote}</s><break time="0.5s"/><s>出自<break time="0.3s"/>${reference}</s></p></speak>`,
        text: '以下是今日' + date + '的名言',
    }));

    conv.close(new BasicCard({
        image: new Image({ url: Picture_url, alt: 'Pictures', }),
        title: '『' + Quote + '』',
        subtitle: '──' + reference,
        buttons: new Button({
            title: '維基百科:' + reference,
            url: 'https://zh.wikipedia.org/zh-tw/' + reference,
        }),
    }));

});


exports.daily_quote = functions.https.onRequest(app);