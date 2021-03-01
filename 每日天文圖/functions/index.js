'use strict';

// Import the Dialogflow module from the Actions on Google client library.
const { dialogflow, SimpleResponse, Image, BasicCard, Button } = require('actions-on-google');
const functions = require('firebase-functions');
var admin = require("firebase-admin");
const i18n = require('i18n');
const app = dialogflow({ debug: true });
var getJSON = require('get-json')

i18n.configure({
    locales: ['zh-TW', 'zh-HK'],
    directory: __dirname + '/locales',
    defaultLocale: 'zh-TW',
});
app.middleware((conv) => {
    i18n.setLocale(conv.user.locale);
});


app.intent('預設歡迎語句', (conv) => {

    return new Promise(

        function(resolve, reject) {

            if (conv.user.locale === "zh-HK") { var locate = "hk" } else { var locate = "tw" }

            getJSON('https://us-central1-newagent-1-f657d.cloudfunctions.net/data_fetching_backend/daily_astro?index=' + locate)
                .then(function(response) {
                    resolve(response);
                }).catch(function(error) {
                    reject(error);
                });

        }).then(function(final_data) {

        console.log(final_data)

        conv.ask(new SimpleResponse({
            speech: `<speak><p><s>${i18n.__('intro')}<break time="0.5s"/>${final_data.text.replace(/[\（|\(]\.+[\）|\)]/gm,"")}</s></p></speak>`,
            text: i18n.__('intro_text'),
        }));


        conv.close(new BasicCard({
            image: new Image({ url: final_data.url, alt: 'Pictures', }),
            title: final_data.title,
            display: 'CROPPED',
            subtitle: "Ⓒ" + final_data.copyright,
            text: final_data.text,
            buttons: new Button({ title: i18n.__('more'), url: "http://sprite.phys.ncku.edu.tw/astrolab/mirrors/apod/apod.html", }),
        }));


    }).catch(function(error) {
        conv.ask(new SimpleResponse({
            speech: `<speak><p><s>${i18n.__('error_output')}</s></p></speak>`,
            text: i18n.__('error_text'),
        }));

        console.log(error)

        conv.close(new BasicCard({
            image: new Image({ url: 'hhttps://raw.githubusercontent.com/hank199599/Google-Assistant-APP/master/%E6%AF%8F%E6%97%A5%E5%A4%A9%E6%96%87%E5%9C%96/assets/LLBIlCA.png', alt: 'Pictures', }),
            title: i18n.__('error_display'),
            display: 'CROPPED',
        }));

    });
});

// Set the DialogflowApp object to handle the HTTPS POST request.
exports.nasa_daily_picture = functions.https.onRequest(app);