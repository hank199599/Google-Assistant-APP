'use strict';

// Import the Dialogflow module from the Actions on Google client library.
const {
    dialogflow,
    Suggestions,
    SimpleResponse,
    Button,
    Image,
    BasicCard,
} = require('actions-on-google');

// Import the firebase-functions package for deployment.
const functions = require('firebase-functions');
const i18n = require('i18n');
var replaceString = require('./replace_string.js');
var Contexts = require('./context.json');

const app = dialogflow({ debug: true });

i18n.configure({
    locales: ['zh-TW', 'zh-CN', 'zh-HK', 'en', 'ja-JP', 'ko-KR', 'th', 'de'],
    directory: __dirname + '/locales',
    defaultLocale: 'en',
});

app.middleware((conv) => {
    var language = conv.user.locale;
    if (language.indexOf('en') !== -1) { language = "en"; } else if (language.indexOf('fr') !== -1) { language = "fr"; } else if (language.indexOf('es') !== -1) { language = "es"; } else if (language.indexOf('th') !== -1) { language = "th"; } else if (language.indexOf('de') !== -1) { language = "de"; }

    i18n.setLocale(language);
});

// Instantiate the Dialogflow client.
var sys_number = 0; //系統生成的數字
var sys_guess = ''; //系統隨機生成的數字
var yourchoice = 0; //你選擇要生成的最大值
var sys_complete = false; //判別是否已經生成數字
var U_limit = 0; //上限
var D_limit = 0; //下限
var guess_count = 0; //計算猜測次數
var i = 0;

//歡迎畫面
app.intent('預設歡迎語句', (conv) => {

    if (conv.screen === true) {

        if (conv.user.last.seen) {

            conv.ask(new SimpleResponse({
                speech: `<speak><p><s>${i18n.__('Welcome_back')}</s><s>${i18n.__('Selectouttext')}</s></p></speak>`,
                text: i18n.__('Welcome_back'),
            }));

        } else {

            conv.ask(new SimpleResponse({
                speech: `<speak><p><s>${i18n.__('Welcome_1')}</s><s>${i18n.__('Welcome_2')}</s><s>${i18n.__('Select1')}</s><s>${i18n.__('Select2')}</s><s>${i18n.__('Select3')}</s></p></speak>`,
                text: i18n.__('Welcome_init'),
            }));
        }

        conv.ask(new BasicCard({
            title: i18n.__('SelectTitle'),
            subtitle: i18n.__('SelectSubTitle'),
            text: i18n.__('SelectText')
        }));

        conv.ask(new Suggestions('50', '100', '250', '500', '1000', '🎲 ' + i18n.__('Lucky')));
        conv.contexts.set(Contexts.guess, 1);

    } else {

        conv.noInputs = [i18n.__('Welcome_Noinput_1'), i18n.__('Welcome_Noinput_2'), i18n.__('Welcome_Noinput_3')];

        conv.ask(new SimpleResponse({
            speech: `<speak><p><s>${i18n.__('Select1')}</s><s>${i18n.__('Select2')}</s><s>${i18n.__('Select3')}</s></p></speak>`,
            text: i18n.__('Selectouttext'),
        }));


        conv.contexts.set(Contexts.guess, 1);
    }


    //將數據同步回手機
    conv.user.storage.sys_number = 0;
    conv.user.storage.yourchoice = yourchoice;
    conv.user.storage.sys_complete = false;
    conv.user.storage.U_limit = 0;
    conv.user.storage.D_limit = 0;
    conv.user.storage.guess_count = 0;

});


app.intent('輸入數字', (conv, { any }) => {

    //將數據上載到函式
    sys_number = conv.user.storage.sys_number;
    yourchoice = conv.user.storage.yourchoice;
    sys_complete = conv.user.storage.sys_complete;
    U_limit = conv.user.storage.U_limit;
    D_limit = conv.user.storage.D_limit;
    guess_count = conv.user.storage.guess_count;


    if (conv.user.storage.sys_number !== undefined) {

        if (any.indexOf(i18n.__('Lucky')) !== -1) {

            any = String(parseInt(Math.random() * (1000)));

            conv.ask(new SimpleResponse({
                speech: `<speak><p><s>${i18n.__('RandomText')}</s></p></speak>`,
                text: i18n.__('RandomOut'),
            }));

            if (any < 10) { any = 10; }
        }

        var returns = replaceString.input(any, conv.user.locale); //藉由子函式吐回數字以及是否為合法輸入

        if (returns.toString().length > 0) {

            var number = parseInt(returns);

            if (sys_complete === false) {
                sys_complete = true;

                //若使用者預選的數字小於3，則自動修正並加以提示
                if (number < 10) {
                    number = 10;
                    conv.ask(`<speak><p><s>${i18n.__('Range_hint_min')}</s></p></speak>`);
                } else if (number > 10000000000000000) {
                    number = 10000000000000000;
                    conv.ask(`<speak><p><s>${i18n.__('Range_hint_max')}</s></p></speak>`);
                }

                conv.user.storage.yourchoice = number;
                U_limit = number;

                //生成這次的答案
                sys_number = parseInt(Math.random() * number);
                if (sys_number === 0) { sys_number++; }
                if (sys_number === number) { sys_number--; }

                conv.ask(new SimpleResponse({ speech: `<speak><audio src="https://raw.githubusercontent.com/hank199599/Google-Assistant-APP/master/audio/undecided-numbers.mp3"/><p><s>${i18n.__('Start1')}</s><s>${i18n.__('Start2')}</s><s>${i18n.__('Start3', D_limit, U_limit)}</s><s>${i18n.__('Start4')}</s></p></speak>`, text: i18n.__('StartText'), }));

                conv.ask(new BasicCard({
                    title: D_limit + ' ~ ' + U_limit,
                    subtitle: i18n.__('Start_Title'),
                    text: i18n.__('SelectText')
                }));

                sys_guess = D_limit + parseInt(Math.random() * (U_limit - D_limit));

                if (sys_guess === D_limit) { sys_guess++; } else if (sys_guess === D_limit) { sys_guess--; }
                sys_guess = String(sys_guess);
                conv.ask(new Suggestions(i18n.__('Quit'), sys_guess));
                conv.contexts.set(Contexts.guess, 1);
                conv.contexts.set(Contexts.Answer, 1);

            } else {

                guess_count++;
                var try_array = [i18n.__('Try1'), i18n.__('Try2'), i18n.__('Try3'), i18n.__('Try4'), i18n.__('Try5'), i18n.__('Try6')];

                if (number !== sys_number) {
                    //下限<你猜的數字<系統生成的數字<上限
                    if (number >= D_limit && number < sys_number && number <= U_limit) {
                        D_limit = number;
                        conv.ask(new SimpleResponse({ speech: `<speak><p><s>${try_array[parseInt(Math.random() * 5)]}</s><s>${i18n.__('Start3', D_limit, U_limit)}</s></p></speak>`, text: i18n.__('Trytext1') }));
                    }
                    //下限<系統生成的數字<你猜的數字<上限
                    else if (number >= D_limit && number > sys_number && number <= U_limit) {
                        U_limit = number;
                        conv.ask(new SimpleResponse({ speech: `<speak><p><s>${try_array[parseInt(Math.random() * 5)]}</s><s>${i18n.__('Start3', D_limit, U_limit)}</s></p></speak>`, text: i18n.__('Trytext1') }));
                    }
                    //下限<系統生成的數字<上限<你輸入的數字
                    else if (number > D_limit && number > sys_number && number > U_limit) {
                        conv.ask(new SimpleResponse({ speech: `<speak><p><s>${i18n.__('Wrongout')}</s><s>${i18n.__('Start3', D_limit, U_limit)}</s></p></speak>`, text: i18n.__('Wrongtext') }));
                    }
                    //你輸入的數字<下限<系統生成的數字<上限
                    else if (number < D_limit && number < sys_number && number <= U_limit) {
                        conv.ask(new SimpleResponse({ speech: `<speak><p><s>${i18n.__('Wrongout')}</s><s>${i18n.__('Start3', D_limit, U_limit)}</s></p></speak>`, text: i18n.__('Wrongtext') }));
                    }

                    conv.ask(new BasicCard({
                        title: D_limit + ' ~ ' + U_limit,
                        subtitle: i18n.__('Hint_Title'),
                        text: i18n.__('SelectText')
                    }));

                    sys_guess = D_limit + parseInt(Math.random() * (U_limit - D_limit)); //協助使用者的隨機猜測數字

                    if (sys_guess === D_limit) { sys_guess++; } else if (sys_guess === U_limit) { sys_guess--; }

                    conv.ask(new Suggestions(i18n.__('Quit'), String(sys_guess)));
                    conv.contexts.set(Contexts.guess, 1);
                    conv.contexts.set(Contexts.Answer, 1);

                } else {
                    //你輸入的數字=系統生成的數字 猜中拉
                    conv.ask(new SimpleResponse({ speech: `<speak><audio src="https://raw.githubusercontent.com/hank199599/Google-Assistant-APP/master/audio/end_game.mp3"/><p><s>${i18n.__('Answer1')}</s><s>${i18n.__('Answer2')}${sys_number}!</s><s>${i18n.__('Answer3', guess_count, '<break time="0.15s"/>')}</s></p></speak>`, text: i18n.__('Answertext'), }));

                    conv.ask(new BasicCard({
                        image: new Image({ url: 'https://imgur.com/zPa5Jph.jpg', alt: 'Pictures', }),
                        title: i18n.__('Answer') + sys_number,
                        subtitle: i18n.__('Numbercritical') + '0 ~ ' + conv.user.storage.yourchoice + '  \n' + i18n.__('GuessCount') + guess_count,
                        display: 'CROPPED', //更改圖片顯示模式為自動擴展
                    }));

                    conv.ask(new Suggestions('🎮 ' + i18n.__('Restart'), '👋 ' + i18n.__('Bye')));
                    conv.contexts.set(Contexts.Bye, 1);
                    conv.contexts.set(Contexts.Restart, 1);

                }
            }
        } else {

            if (sys_complete === false) {
                conv.noInputs = [i18n.__('Welcome_Noinput_1'), i18n.__('Welcome_Noinput_2'), i18n.__('Welcome_Noinput_3')];

                conv.ask(new SimpleResponse({ speech: `<speak><p><s>${i18n.__('Error1')}<break time="0.15s"/>${i18n.__('SelectTitle')}</s></p></speak>`, text: i18n.__('Error1') }));

                conv.ask(new BasicCard({
                    title: i18n.__('SelectTitle'),
                    subtitle: i18n.__('SelectSubTitle'),
                    text: i18n.__('SelectText')
                }));

                conv.ask(new Suggestions('50', '100', '250', '500', '1000', '🎲 ' + i18n.__('Lucky')));
                conv.contexts.set(Contexts.guess, 1);

            } else {

                conv.ask(new SimpleResponse({ speech: `<speak><p><s>${i18n.__('Error1')}</s><s>${i18n.__('Start3', D_limit, U_limit)}</s></p></speak>`, text: i18n.__('Error1') }));

                conv.ask(new BasicCard({
                    title: D_limit + ' ~ ' + U_limit,
                    subtitle: i18n.__('Hint_Title'),
                    text: i18n.__('ErrorExplain')
                }));

                sys_guess = String(D_limit + parseInt(Math.random() * (U_limit - D_limit)));

                sys_guess = D_limit + parseInt(Math.random() * (U_limit - D_limit));

                if (sys_guess === D_limit) { sys_guess++; } else if (sys_guess === D_limit) { sys_guess--; }

                sys_guess = String(sys_guess);

                conv.ask(new Suggestions(i18n.__('Quit'), sys_guess));

                conv.contexts.set(Contexts.guess, 1);
                conv.contexts.set(Contexts.Answer, 1);
            }
        }
    } else {


        conv.ask(new SimpleResponse({
            speech: i18n.__('Nodataspeek'),
            text: i18n.__('Nodatatext')
        }));

        conv.close(new BasicCard({
            title: i18n.__('Nodatatitle'),
            subtitle: i18n.__('Nodatasubtitle'),
            buttons: new Button({ title: i18n.__('Nodatabutton'), url: "https://myaccount.google.com/activitycontrols?pli=1", }),
        }));

    }

    //將數據同步回手機
    conv.user.storage.sys_number = sys_number;
    conv.user.storage.sys_complete = sys_complete;
    conv.user.storage.U_limit = U_limit;
    conv.user.storage.D_limit = D_limit;
    conv.user.storage.guess_count = guess_count;


});


app.intent('顯示答案', (conv) => {

    conv.ask(new SimpleResponse({ speech: `<speak><p><s>${i18n.__('Answer2')}<break time="0.15s"/>${conv.user.storage.sys_number}!</s><s>${i18n.__('show2', conv.user.storage.guess_count)}</s><s>${i18n.__('show3')}</s></p></speak>`, text: i18n.__('showtext'), }));

    conv.ask(new BasicCard({
        title: i18n.__('Answer') + conv.user.storage.sys_number,
        subtitle: i18n.__('Numbercritical') + '0 ~ ' + conv.user.storage.yourchoice + '  \n' +
            i18n.__('GuessCount') + conv.user.storage.guess_count,
    }));

    conv.ask(new Suggestions('🎮 ' + i18n.__('Restart'), '👋 ' + i18n.__('Bye')));
    conv.contexts.set(Contexts.Bye, 1);
    conv.contexts.set(Contexts.Restart, 1);

});

app.intent('玩遊戲意圖', (conv) => {

    conv.ask(new SimpleResponse({
        speech: `<speak><p><s>${i18n.__('Select1')}</s><s>${i18n.__('Select2')}</s><s>${i18n.__('Select3')}</s></p></speak>`,
        text: i18n.__('Selectouttext'),
    }));

    conv.ask(new BasicCard({
        title: i18n.__('SelectTitle'),
        subtitle: i18n.__('SelectSubTitle'),
        text: i18n.__('SelectText')
    }));

    conv.ask(new Suggestions('50', '100', '250', '500', '1000', '🎲 ' + i18n.__('Lucky')));
    conv.contexts.set(Contexts.guess, 1);

    //將數據同步回手機
    conv.user.storage.sys_number = 0;
    conv.user.storage.yourchoice = yourchoice;
    conv.user.storage.sys_complete = false;
    conv.user.storage.U_limit = 0;
    conv.user.storage.D_limit = 0;
    conv.user.storage.guess_count = guess_count;


});

app.intent('重新開始', (conv) => {

    conv.noInputs = [i18n.__('Welcome_Noinput_1'), i18n.__('Welcome_Noinput_2'), i18n.__('Welcome_Noinput_3')];

    conv.ask(new SimpleResponse({
        speech: `<speak><p><s>${i18n.__('Select1')}</s></p></speak>`,
        text: i18n.__('Selectouttext'),
    }));
    conv.ask(new BasicCard({
        title: i18n.__('SelectTitle'),
        subtitle: i18n.__('SelectSubTitle'),
        text: i18n.__('SelectText')
    }));

    conv.ask(new Suggestions('50', '100', '250', '500', '1000', '🎲 ' + i18n.__('Lucky')));

    conv.contexts.set(Contexts.guess, 1);

    //將數據同步回手機
    conv.user.storage.sys_complete = false;
    conv.user.storage.U_limit = 0;
    conv.user.storage.D_limit = 0;
    conv.user.storage.guess_count = 0;
});


app.intent('預設罐頭回覆', (conv) => {

    conv.ask(new SimpleResponse({
        speech: `<speak><p><s>${i18n.__('Error_hint1', '<break time="0.15s"/>', '<break time="0.15s"/>', '<break time="0.15s"/>', '<break time="0.15s"/>')}</s></p></speak>`,
        text: i18n.__('Error_hint')
    }));

    conv.ask(new Suggestions('🎮 ' + i18n.__('Restart'), '👋 ' + i18n.__('Bye')));
    conv.contexts.set(Contexts.Bye, 1);
    conv.contexts.set(Contexts.Restart, 1);

});


app.intent('結束對話', (conv) => {
    conv.user.storage = {}; //離開同時清除暫存資料

    conv.ask(new SimpleResponse({ speech: i18n.__('EndTalk'), text: i18n.__('EndTalk') + '👋', }));

    conv.close(new BasicCard({
        title: i18n.__('EndTitle'),
        text: i18n.__('EndText'),
        buttons: new Button({ title: i18n.__('EndButton'), url: 'https://assistant.google.com/services/a/uid/0000008473a60dc8', }),
    }));

});


// Set the DialogflowApp object to handle the HTTPS POST request.
exports.number_elf = functions.https.onRequest(app);