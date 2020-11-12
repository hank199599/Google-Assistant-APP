'use strict';

// Import the Dialogflow module from the Actions on Google client library.
const {
  dialogflow,
  SimpleResponse,
  Button,
  Image,
  BasicCard,
  Table
} = require('actions-on-google');

// Import the firebase-functions package for deployment.
const functions = require('firebase-functions');
const i18n = require('i18n');

// Instantiate the Dialogflow client.
const app = dialogflow({ debug: true });

i18n.configure({
  locales: ['zh-TW', 'en', 'zh-CN', 'zh-HK', 'ja-JP', 'ko-KR', 'th', 'fr', 'es', 'de', 'da-DK', 'nl'],
  directory: __dirname + '/locales',
  defaultLocale: 'en',
});

app.middleware((conv) => {
  var language = conv.user.locale;
  if (language.indexOf('en') !== -1) { language = "en"; }
  else if (language.indexOf('fr') !== -1) { language = "fr"; }
  else if (language.indexOf('es') !== -1) { language = "es"; }
  else if (language.indexOf('th') !== -1) { language = "th"; }
  else if (language.indexOf('de') !== -1) { language = "de"; }
  else if (language.indexOf('nl') !== -1) { language = "nl"; }

  i18n.setLocale(language);
});

var getJSON = require('get-json')

var language_array = ['zh-TW', 'zh-CN', 'zh-HK', 'ja-JP', 'ko-KR'];
var reverse_array = ["th", "da", "fr", "es", "nl", "de"];
var month_list = require('./month.json'); //引用外部函數來輸入國旗答案與解釋
var index_array = ["en", "fr", "es", "th", "de", "nl"]


var roundDecimal = function (val, precision) { //進行四捨五入的函式呼叫
  return Math.round(Math.round(val * Math.pow(10, (precision || 0) + 1)) / 10) / Math.pow(10, (precision || 0));
};


app.intent('取得天氣速覽', (conv) => {

  var array = [];

  return new Promise(function (resolve, reject) {

    getJSON('https://mars.nasa.gov/rss/api/?feed=weather&category=insight&feedtype=json&ver=1.0')
      .then(function (response) {
        resolve(response)
      }).catch(function (error) {
        var reason = new Error('資料獲取失敗:' + error);
        reject(reason)
      });
  }).then(function (origin_data) {

    //處理獲取的資料....

    var sol = origin_data.sol_keys.pop();
    var lastestsol = origin_data[sol];
    var output = "";
    var subtext = "";

    if (lastestsol !== undefined) {

      if (lastestsol.Season !== undefined) {
        var Season = i18n.__(lastestsol.Season);
      }

      if (lastestsol.First_UTC !== undefined) {
        var temp_date = (lastestsol.First_UTC.split('T')[0]).split('-');
        var month = temp_date[1];
        var date = parseInt(temp_date[2]);


        //制定輸出日期樣式	
        var month_output = parseInt(month);

        var language = conv.user.locale;

        for (var i = 0; i < index_array.length; i++) {
          if (language.indexOf(index_array[i]) !== -1) { language = index_array[i]; break; }
        }

        if (month_list[language] !== undefined) { month_output = month_list[language][month_output - 1]; }

        if (reverse_array.indexOf(language) !== -1) {
          output = i18n.__('IntroSpeak1', sol, date, month_output);
          subtext = i18n.__('CardSubTitle', date, month_output, Season)
        }
        else {
          output = i18n.__('IntroSpeak1', sol, month_output, date);
          subtext = i18n.__('CardSubTitle', month_output, date, Season)
        }

      }

      if (lastestsol.AT !== undefined) {
        var Temperature = roundDecimal(lastestsol.AT.av, 1);
        var Temperature_max = roundDecimal(lastestsol.AT.mx, 1);
        var Temperature_min = roundDecimal(lastestsol.AT.mn, 1);

        output = output + '</s><break time="0.3s"/><s>' + i18n.__('IntroSpeak2', Temperature_max, Temperature_min);
        array.push({ cells: [i18n.__('TEM'), Temperature_max + '°C', Temperature + '°C', Temperature_min + '°C'], dividerAfter: false, });

      }

      if (lastestsol.PRE !== undefined) {
        var Pressure = roundDecimal(lastestsol.PRE.av, 1);
        var Pressure_max = roundDecimal(lastestsol.PRE.mx, 1);
        var Pressure_min = roundDecimal(lastestsol.PRE.mn, 1);

        output = output + '</s><break time="0.3s"/><s>' + i18n.__('IntroSpeak3', Pressure);
        array.push({ cells: [i18n.__('PRE'), Pressure_max + ' Pa', Pressure + ' Pa', Pressure_min + ' Pa'], dividerAfter: false, });
      }

      if (lastestsol.HWS !== undefined || lastestsol.WD.most_common !== undefined) {
        output = output + '</s><break time="0.3s"/><s>' + i18n.__('IntroSpeak4');

        if (lastestsol.HWS !== undefined) {
          var Wind_Speed = roundDecimal(lastestsol.HWS.av, 1);
          var Wind_Speed_max = roundDecimal(lastestsol.HWS.mx, 1);
          var Wind_Speed_min = roundDecimal(lastestsol.HWS.mn, 1);

          array.push({ cells: [i18n.__('SPEED'), Wind_Speed_max + 'm/s', Wind_Speed + 'm/s', Wind_Speed_min + 'm/s'], dividerAfter: false, });
          if (language_array.indexOf(conv.user.locale) === -1) { Wind_direction = Wind_direction_1; }
        }

        if (lastestsol.WD.most_common !== null) {
          var Wind_direction = String(lastestsol.WD.most_common.compass_point);
          var Wind_direction_1 = Wind_direction;
          var Wind_direction = i18n.__(Wind_direction);
          output = output + i18n.__('IntroSpeak5', Wind_direction);
          array.push({ cells: [i18n.__('DIREC'), Wind_direction + i18n.__('Wind'), ' ', ' '], dividerAfter: false, });
        }

        if (Wind_Speed_max !== undefined) {
          output = output + i18n.__('IntroSpeak6', Wind_Speed_max);
        }
      }

    }

    if (array.length < 4) { subtext = subtext + '\n' + i18n.__('Errortext'); }


    if (sol !== undefined) {

      conv.ask(new SimpleResponse({
        speech: `<speak><p><s>${output}</s></p></speak>`,
        text: i18n.__('IntroText')
      }));

      conv.close(new Table({
        title: i18n.__('CardTitle', sol),
        subtitle: subtext,
        columns: [
          { header: i18n.__('TYPE'), align: 'CENTER', },
          { header: i18n.__('HIGH'), align: 'CENTER', },
          { header: i18n.__('AVG'), align: 'CENTER', },
          { header: i18n.__('LOW'), align: 'CENTER', }
        ],
        rows: array,
        buttons: new Button({
          title: i18n.__('CheckDaily'),
          url: 'https://mars.nasa.gov/insight/weather/'
        }),
      }));
    }
    else {

      const hasWebBrowser = conv.surface.capabilities.has('actions.capability.WEB_BROWSER');

      conv.ask(new SimpleResponse({
        speech: `<speak><p><s>${i18n.__('Errorout')}</s></p></speak>`,
        text: i18n.__('IntroText')
      }));
      var output = {
        title: i18n.__('Errortitle'),
        subtitle: i18n.__('notify'),
        text: i18n.__('Solution'),
        buttons: new Button({
          title: i18n.__('CheckDaily'),
          url: 'https://mars.nasa.gov/insight/weather/'
        }),
      }

      if (!hasWebBrowser) { delete output.text; }  //若該裝置無瀏覽器，則不顯示提示文字

      conv.close(new BasicCard(output));

    }
  }).catch(function (error) {

    console.log(error)
    const hasWebBrowser = conv.surface.capabilities.has('actions.capability.WEB_BROWSER');
    conv.ask(new SimpleResponse({
      speech: `<speak><p><s>${i18n.__('Errorout')}</s></p></speak>`,
      text: i18n.__('IntroText')
    }));

    var output = {
      title: i18n.__('Errortitle'),
      subtitle: i18n.__('notify'),
      text: i18n.__('Solution'),
      buttons: new Button({
        title: i18n.__('CheckDaily'),
        url: 'https://mars.nasa.gov/insight/weather/'
      })
    }

    if (!hasWebBrowser) { delete output.text; }  //若該裝置無瀏覽器，則不顯示提示文字

    conv.close(new BasicCard(output));

  });

});

exports.dialogflowFirebaseFulfillment = functions.https.onRequest(app); 
