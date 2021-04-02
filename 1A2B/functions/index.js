'use strict';

// Import the Dialogflow module from the Actions on Google client library.
const {
    dialogflow,
    Suggestions,
    SimpleResponse,
    Button,
    Image,
    BasicCard,
    Table
} = require('actions-on-google');

// Import the firebase-functions package for deployment.
const functions = require('firebase-functions');
const i18n = require('i18n');
const replaceString = require('replace-string');

// Instantiate the Dialogflow client.
const app = dialogflow({ debug: true });
var Contexts = require('./context.json');

i18n.configure({
    locales: ['zh-TW', 'zh-CN', 'zh-HK', 'en', 'ja-JP', 'ko-KR', 'th'],
    directory: __dirname + '/locales',
    defaultLocale: 'en',
});

app.middleware((conv) => {
    var language = conv.user.locale;
    if (language.indexOf('en') !== -1) { language = "en"; } else if (language.indexOf('fr') !== -1) { language = "fr"; } else if (language.indexOf('es') !== -1) { language = "es"; } else if (language.indexOf('th') !== -1) { language = "th"; } else if (language.indexOf('de') !== -1) { language = "de"; }

    i18n.setLocale(language);
});

/**
 * 隨機產生4位數
 */
function ranGuess() {

    var numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    var output = "";

    for (var i = 0; i < 4; i++) {
        var keys = Object.keys(numbers);
        var num = keys[Math.floor(Math.random() * keys.length)]
        output = output + num
        delete numbers[num]
    }

    return output
}

/**
 * 判定輸入數值與正確答案之正確性
 * @param you_guess 輸入的數值
 * @param sys_think 正確答案
 */
function analysis(you_guess, sys_think) {

    var A_count = 0;
    var B_count = 0;
    var array = new Array(" ", " ", " ", " ");

    var your_split = you_guess.toString().split('');
    var sys_split = sys_think.toString().split('');

    for (var i = 0; i < sys_split.length; i++) {
        for (var j = 0; j < your_split.length; j++) {
            if (sys_split[i] === your_split[j]) {
                if (i === j) {
                    array[i] = 'A';
                    A_count++
                    break;
                } else {
                    array[j] = 'B';
                    B_count++
                    break;
                }
            }
        }
    }

    return [A_count, B_count, array]

}

function explain(A, B, else_count) {
    if (A === 0 && B === 0) { return i18n.__('explaine_1', (10 - else_count)); } else if (A >= 1 && A <= 2 && B === 0) { return i18n.__('explaine_2', A, else_count); } else if (A === 2 && B === 2) { return i18n.__('explaine_3'); } else if (A === 0 && B <= 3) { return i18n.__('explaine_4', B); } else if (A === 3 && B === 0) { return i18n.__('explaine_5', A); } else if (A === 0 && B === 4) { return i18n.__('explaine_6', A); } else if (A === 1 && B === 3) { return i18n.__('explaine_3'); } else { return i18n.__('explaine_7', A, B, else_count); }
}

function transfomer(input) {
    var replace_list = require('./replace.json');
    var keys = Object.keys(replace_list);

    for (var i = 0; i < keys.length; i++) {
        input = replaceString(input, keys[i], replace_list[keys[i]]); //更改輸入字串中的字元為數字
    }
    return input
}

function record_generator(input, array) {

    for (var i = 3; i >= 0; i--) {
        array[i + 1] = array[i];
    }
    array[0] = input;

    return array
}


app.intent('預設歡迎語句', (conv) => {
    conv.user.storage = {};

    if (conv.screen) {

        if (conv.user.last.seen) {

            conv.user.storage.sys_think = ranGuess();
            conv.user.storage.record = new Array([], [], [], [], []);
            conv.user.storage.guess_count = 0;
            conv.user.storage.teach_mode = false;

            conv.ask(new SimpleResponse({ speech: `<speak><audio src="https://raw.githubusercontent.com/hank199599/Google-Assistant-APP/master/audio/undecided-numbers.mp3"/><p><s>${i18n.__('Start1')}</s><s>${i18n.__('Start2')}</s><s>${i18n.__('Start3')}<say-as interpret-as="characters">0123</say-as>${i18n.__('TO')}<say-as interpret-as="characters">9876</say-as></s><s>${i18n.__('Start4')}</s></p></speak>`, text: i18n.__('StartText'), }));

            conv.ask(new Suggestions("123", ranGuess(), ranGuess(), ranGuess(), "9876"));

            conv.ask(new BasicCard({
                title: i18n.__('StartTitle'),
                subtitle: i18n.__('StartSubtitle'),
                text: i18n.__('Start_text')
            }));

            conv.contexts.set(Contexts.guess, 1);

        } else {

            conv.ask(new SimpleResponse({
                speech: `<speak><p><s>${i18n.__('Welcome_1')}</s><s>${i18n.__('Welcome_2')}</s><s>${i18n.__('Welcome_3')}</s><s>${i18n.__('Welcome_5')}</s></p></speak>`,
                text: i18n.__('Welcome_init'),
            }));

            conv.ask(new BasicCard({
                image: new Image({ url: 'https://raw.githubusercontent.com/hank199599/Google-Assistant-APP/master/1A2B/assets/7ofgPtV.jpg', alt: 'Pictures', }),
                title: i18n.__('Welcome_Title'),
                display: 'CROPPED',
                subtitle: i18n.__('Welcome_Subtitle'),
                text: i18n.__('Welcome_Text'),
                buttons: new Button({ title: i18n.__('Button_Title'), url: i18n.__('URL'), }),
            }));

            conv.ask(new Suggestions('🎮 ' + i18n.__('StartGame'), '📝' + i18n.__('Tutorial'), '👋 ' + i18n.__('Bye')));
            conv.contexts.set(Contexts.Start, 1);
            conv.contexts.set(Contexts.Start_Teach, 1);
            conv.contexts.set(Contexts.Bye, 1);
        }
    } else {

        conv.user.storage.sys_think = ranGuess();
        conv.user.storage.record = new Array([], [], [], [], []);
        conv.user.storage.guess_count = 0;
        conv.user.storage.teach_mode = false;

        conv.ask(`<speak><p><s>${i18n.__('NoSerfaceHint', '<break time="0.2s"/>')}<break time="1s"/></s></p></speak>`);

        conv.ask(new SimpleResponse({ speech: `<speak><audio src="https://raw.githubusercontent.com/hank199599/Google-Assistant-APP/master/audio/undecided-numbers.mp3"/><p><s>${i18n.__('Start1')}</s><s>${i18n.__('Start2')}</s><s>${i18n.__('Start3')}<say-as interpret-as="characters">0123</say-as>${i18n.__('TO')}<say-as interpret-as="characters">9876</say-as></s><s>${i18n.__('Start4')}</s></p></speak>`, text: i18n.__('StartText'), }));

        conv.contexts.set(Contexts.guess, 1);

    }

});

app.intent('開始遊戲', (conv) => {

    conv.user.storage = {};

    if (conv.user.last.seen) {
        conv.ask(new SimpleResponse({ speech: `<speak><audio src="https://raw.githubusercontent.com/hank199599/Google-Assistant-APP/master/audio/undecided-numbers.mp3"/><p><s>${i18n.__('Start1')}</s><s>${i18n.__('Start2')}</s><s>${i18n.__('Start3')}<say-as interpret-as="characters">0123</say-as>${i18n.__('TO')}<say-as interpret-as="characters">9876</say-as></s><s>${i18n.__('Start4')}</s></p></speak>`, text: i18n.__('StartText'), }));
        conv.ask(new Suggestions("123", ranGuess(), ranGuess(), ranGuess(), "9876"));
    } else {
        conv.ask(new SimpleResponse({ speech: `<speak><audio src="https://raw.githubusercontent.com/hank199599/Google-Assistant-APP/master/audio/undecided-numbers.mp3"/><p><s>${i18n.__('Start1')}</s><s>${i18n.__('Start2')}</s><s>${i18n.__('Start3')}<say-as interpret-as="characters">0123</say-as>${i18n.__('TO')}<say-as interpret-as="characters">9876</say-as></s><s>${i18n.__('Start4')}${i18n.__('Start5')}</s></p></speak>`, text: i18n.__('StartText'), }));
        conv.ask(new Suggestions('📝' + i18n.__('Tutorial'), "123", ranGuess(), "9876"));
        conv.contexts.set(Contexts.Start_Teach, 1);

    }

    conv.ask(new BasicCard({ title: i18n.__('StartTitle'), subtitle: i18n.__('StartSubtitle'), text: i18n.__('Start_text') }));

    //將參數存入手機
    conv.user.storage.sys_think = ranGuess();
    conv.user.storage.guess_count = 0;
    conv.user.storage.record = new Array([], [], [], [], []);
    conv.user.storage.try_count = 0;
    conv.user.storage.teach_mode = false;
    conv.user.storage.input = i18n.__('error_record');
    conv.contexts.set(Contexts.guess, 1);
    conv.contexts.set(Contexts.Hint, 1);
});

app.intent('輸入數字', (conv, { any }) => {

    //將參數上載到函式上
    var sys_think = conv.user.storage.sys_think;
    var you_guess = conv.user.storage.you_guess;
    var guess_count = conv.user.storage.guess_count;
    var record = conv.user.storage.record;

    if (conv.user.storage.guess_count !== undefined) {

        var temp = transfomer(any);
        var number = parseInt(temp);

        if (number > 10000) { number = number % 10000; }

        if (isNaN(number) === false) {

            guess_count++; //統計猜測次數+1
            you_guess = number.toString();

            if (you_guess.length === 3) { you_guess = "0" + you_guess; } else if (you_guess.length === 2) { you_guess = "00" + you_guess; } else if (you_guess.length === 1) { you_guess = "000" + you_guess; }

            conv.user.storage.input = you_guess;

            var temp = analysis(you_guess, sys_think);

            var A_count = temp[0];
            var B_count = temp[1];

            //正式輸出的畫面
            if (A_count <= 3) {

                conv.ask(new SimpleResponse({ speech: `<speak><p><s>${i18n.__('Game_hint1','<say-as interpret-as="characters">'+you_guess+'</say-as>')}<break time="0.2s"/></s><s>${i18n.__('Game_hint2','<break time="0.2s"/>'+A_count+'A'+B_count+'B')}</s></p></speak>`, text: i18n.__('Game_text', A_count, B_count), }));

                var output = {
                    title: you_guess + '   (' + A_count + 'A' + B_count + 'B)',
                    subtitle: i18n.__('card_subtitle'),
                    columns: [{ header: "", align: 'CENTER', }, ],
                    rows: [{ cells: ["\n" + i18n.__('Record') + "\n"], dividerAfter: false, }, ],
                }

                if (guess_count === 1) {
                    conv.user.storage.record[0] = [number.toString(), A_count + "A" + B_count + "B"];
                } else {
                    var temp_array = [];

                    for (var i = 0; i < record.length; i++) {
                        if (record[i].length !== 0) { temp_array.push({ cells: record[i], dividerAfter: false, }) }
                    }

                    output.columns = [{ header: i18n.__('Input'), align: 'CENTER', }, { header: i18n.__('hint'), align: 'CENTER', }, ]
                    output.rows = temp_array
                    conv.user.storage.record = record_generator([number.toString(), A_count + "A" + B_count + "B"], record);
                }

                conv.ask(new Table(output));
                conv.ask(new Suggestions(ranGuess(), ranGuess(), i18n.__('explain', A_count, B_count)));

                conv.contexts.set(Contexts.Hint, 1);
                conv.contexts.set(Contexts.guess, 1);
                conv.contexts.set(Contexts.Answer, 1);
                conv.contexts.set(Contexts.Repeat, 1);

            } else {
                conv.ask(new SimpleResponse({ speech: `<speak><audio src="https://raw.githubusercontent.com/hank199599/Google-Assistant-APP/master/audio/end_game.mp3"/><p><s>${i18n.__('Answer1','<say-as interpret-as="characters">'+sys_think+'</say-as>')}!</s><s>${i18n.__('Answer2', guess_count)}</s><break time="0.2s"/><s>${i18n.__('Answer3')}?</s></p></speak>`, text: i18n.__('Answertext'), }));
                conv.ask(new BasicCard({
                    image: new Image({ url: 'https://raw.githubusercontent.com/hank199599/Google-Assistant-APP/master/1A2B/assets/7qDUUEq.jpg', alt: 'Pictures', }),
                    display: 'CROPPED',
                    title: i18n.__('Answer') + sys_think,
                    subtitle: i18n.__('GuessCount', guess_count),
                }));
                conv.ask(new Suggestions('🎮 ' + i18n.__('Restart'), '👋 ' + i18n.__('Bye')));
                conv.contexts.set(Contexts.Start, 1);
                conv.contexts.set(Contexts.Bye, 1);
            }

        } else {

            conv.ask(new SimpleResponse({ speech: i18n.__('Error_speech'), text: i18n.__('Error_text') }));
            conv.user.storage.input = i18n.__('error_record');

            var output = {
                title: i18n.__('Error_Title'),
                subtitle: i18n.__('card_subtitle'),
                columns: [{ header: "", align: 'CENTER', }, ],
                rows: [{ cells: ["\n" + i18n.__('Record') + "\n"], dividerAfter: false, }, ],
            };

            if (guess_count !== 0) {

                var temp_array = [];
                for (var i = 0; i < record.length; i++) {
                    if (record[i].length !== 0) { temp_array.push({ cells: record[i], dividerAfter: false, }) }
                }

                output.columns = [{ header: i18n.__('Input'), align: 'CENTER', }, { header: i18n.__('hint'), align: 'CENTER', }, ]
                output.rows = temp_array
            }

            conv.ask(new Table(output));
            conv.ask(new Suggestions("123", ranGuess(), ranGuess(), ranGuess(), "9876"));

            conv.contexts.set(Contexts.guess, 1);
            conv.contexts.set(Contexts.Answer, 1);
            conv.contexts.set(Contexts.Hint, 1);

        }

        //將參數存入手機
        conv.user.storage.sys_think = sys_think;
        conv.user.storage.guess_count = guess_count;
        conv.user.storage.help_data = temp;

    } else {

        conv.ask(new SimpleResponse({
            speech: i18n.__('Nodataspeek'),
            text: i18n.__('Nodatatext'),
        }));

        conv.close(new BasicCard({
            title: i18n.__('Nodatatitle'),
            subtitle: i18n.__('Nodatasubtitle'),
            buttons: new Button({ title: i18n.__('Nodatabutton'), url: "https://myaccount.google.com/activitycontrols?pli=1", }),
        }));
    }


});

app.intent('解釋意思', (conv) => {

    var input = conv.user.storage.input;

    if (input === i18n.__('error_record')) {

        conv.ask(new SimpleResponse({ speech: `<speak><p><s>${i18n.__('hinterror')}</s></p></speak>`, text: i18n.__('hinttext1') }));
        conv.ask(new BasicCard({
            title: i18n.__('Error_Start'),
            text: i18n.__('Error_Start_hint'),
        }));

        conv.ask(new Suggestions("123", ranGuess(), ranGuess(), ranGuess(), "9876"));
        conv.contexts.set(Contexts.guess, 1);
    } else {

        var origin = input.toString().split('');
        var help_Total = Array.from(new Set(origin)).length;
        var A_count = conv.user.storage.help_data[0];
        var B_count = conv.user.storage.help_data[1];
        var location = conv.user.storage.help_data[2];
        var else_count = help_Total - (A_count + B_count);

        var explained = explain(A_count, B_count, else_count)


        if (conv.user.storage.teach_mode === false) {
            conv.ask(new SimpleResponse({ speech: `<speak><p><s>${i18n.__('hint1','<break time="0.15s"/><say-as interpret-as="characters">'+input+'</say-as><break time="0.15s"/>')}<break time="0.15s"/>${explained}</s></p></speak>`, text: i18n.__('hinttext1') }));
            conv.ask(new BasicCard({
                title: input + '   (' + A_count + 'A' + B_count + 'B)',
                subtitle: i18n.__('Hint_subtitle', A_count, A_count, B_count, B_count, else_count),
                text: i18n.__('Hint_Text'),
            }));

        } else {

            conv.ask(new SimpleResponse({ speech: `<speak><p><s>${i18n.__('hint1','<break time="0.15s"/><say-as interpret-as="characters">'+input+'</say-as><break time="0.15s"/>')}<break time="0.15s"/>${explained}</s></p></speak>`, text: i18n.__('hinttext2') }));
            conv.ask(new Table({
                title: input + '   (' + A_count + 'A' + B_count + 'B)',
                subtitle: i18n.__('Hint_subtitle', A_count, A_count, B_count, B_count, else_count),
                columns: [{ header: i18n.__('Bit'), align: 'CENTER', }, { header: i18n.__('1000-Bit'), align: 'CENTER', }, { header: i18n.__('100-Bit'), align: 'CENTER', }, { header: i18n.__('10-Bit'), align: 'CENTER', }, { header: i18n.__('1-Bit'), align: 'CENTER', }],
                rows: [
                    { cells: [i18n.__('Input')].concat(origin), dividerAfter: false, },
                    { cells: [i18n.__('hint')].concat(location), dividerAfter: false, }
                ]
            }));
        }

        conv.ask(new Suggestions('📝' + i18n.__('Tutorial'), i18n.__('Giveup')));
        conv.ask(new Suggestions(ranGuess()));

        conv.contexts.set(Contexts.Start_Teach, 1);
        conv.contexts.set(Contexts.guess, 1);
        conv.contexts.set(Contexts.Answer, 1);

    }

});

app.intent('顯示答案', (conv) => {
    //將參數上載到函式上
    var sys_think = conv.user.storage.sys_think;
    var guess_count = conv.user.storage.guess_count;

    conv.ask(new SimpleResponse({ speech: `<speak><p><s>${i18n.__('show1','<say-as interpret-as="characters">'+sys_think+'</say-as>')}!</s><s>${i18n.__('show2', guess_count)}</s><s>${i18n.__('show3')}</s></p></speak>`, text: i18n.__('GuessCount', guess_count) + i18n.__('showtext'), }));
    conv.ask(new Table({
        title: i18n.__('CORRECT'),
        columns: [{ header: i18n.__('1000-Bit'), align: 'CENTER', }, { header: i18n.__('100-Bit'), align: 'CENTER', }, { header: i18n.__('10-Bit'), align: 'CENTER', }, { header: i18n.__('1-Bit'), align: 'CENTER', }],
        rows: [{
            cells: sys_think.split(''),
            dividerAfter: false,
        }],
    }));

    conv.ask(new Suggestions('🎮 ' + i18n.__('Restart'), '👋 ' + i18n.__('Bye')));
    conv.contexts.set(Contexts.Start, 1);
    conv.contexts.set(Contexts.Bye, 1);

});

app.intent('進入教學模式', (conv) => {

    var numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    var sys_think = "";

    for (var i = 0; i < 6; i++) {
        var keys = Object.keys(numbers);
        var num = keys[Math.floor(Math.random() * keys.length)]
        if (i < 4) {
            sys_think = sys_think + num;
        } else if (i === 4) {
            conv.user.storage.sys_error1 = num
        } else {
            conv.user.storage.sys_error2 = num
        }
        delete numbers[num]
    }

    conv.ask(new SimpleResponse({ speech: `<speak><p><s>${i18n.__('Teach_Start_1')}</s><s>${i18n.__('Teach_Start_2')}</s><break time="0.6s"/><s>${i18n.__('Teach_Start_3')}</s><s>${i18n.__('Teach_Start_4')}<break time="0.3s"/>${i18n.__('Teach_Start_5')}<break time="0.3s"/><say-as interpret-as="characters">${sys_think}</say-as></s><break time="0.7s"/><s>${i18n.__('Teach_Start_6')}</s><break time="0.3s"/><s>${i18n.__('Teach_Start_7')}<break time="0.3s"/>${i18n.__('Teach_Start_8')}</s><s>${i18n.__('Teach_Start_9')}</s></p></speak>`, text: i18n.__('Teach_Start_text') }));
    conv.ask(new Table({
        title: i18n.__('Teach_Start_Title'),
        subtitle: i18n.__('Teach_Start_Subtitle'),
        columns: [{ header: i18n.__('Bit'), align: 'CENTER', }, { header: i18n.__('1000-Bit'), align: 'CENTER', }, { header: i18n.__('100-Bit'), align: 'CENTER', }, { header: i18n.__('10-Bit'), align: 'CENTER', }, { header: i18n.__('1-Bit'), align: 'CENTER', }],
        rows: [{
            cells: [i18n.__('Example')].concat(sys_think.split('')),
            dividerAfter: false,
        }],
    }));
    conv.ask(new Suggestions('🎮 ' + i18n.__('BackNormal'), i18n.__('Contiunce')));

    conv.user.storage.sys_think = sys_think;
    conv.user.storage.try_count = 0;

    conv.contexts.set(Contexts.Return, 1);
    conv.contexts.set(Contexts.Teach, 1);

});

app.intent('教學模式', (conv, { any }) => {

    var sys_think = conv.user.storage.sys_think;
    var try_count = conv.user.storage.try_count;
    var sys_error1 = conv.user.storage.sys_error1;
    var sys_error2 = conv.user.storage.sys_error2;

    var sys_split = sys_think.split('');

    if (try_count === 0) { any = String(sys_error1) + String(sys_split[0]) + String(sys_split[2]) + String(sys_error2); } else if (try_count === 1) { any = String(sys_error1) + String(sys_split[1]) + String(sys_split[2]) + String(sys_error2); } else if (try_count === 2) { any = String(sys_error1) + String(sys_split[0]) + String(sys_split[1]) + String(sys_error2); } else if (try_count === 3) { any = String(sys_split[0]) + String(sys_split[1]) + String(sys_split[2]) + String(sys_error2); }

    try_count++;
    conv.user.storage.try_count = try_count;

    var temp = transfomer(any);
    var number = parseInt(temp);

    if (number > 10000) { number = number % 10000; }

    if (isNaN(number) === false) {
        conv.contexts.set(Contexts.Teach, 1);

        var you_guess = number.toString();

        if (you_guess.length === 3) { you_guess = "0" + you_guess; } else if (you_guess.length === 2) { you_guess = "00" + you_guess; } else if (you_guess.length === 1) { you_guess = "000" + you_guess; }

        var user_input = you_guess.split('');

        var help_Total = Array.from(new Set(user_input)).length;

        var temp = analysis(you_guess, sys_think);
        var A_count = temp[0];
        var B_count = temp[1];
        var else_count = help_Total - (A_count + B_count);
        var explained = explain(A_count, B_count, else_count)
        var teach_title = "";
        var teach_subtitle = "";
        var teach_speech = "";
        var teach_text = "";


        if (try_count === 1) {
            teach_title = i18n.__('Teach_1_Title', A_count, B_count);
            teach_subtitle = i18n.__('Teach_1_Subtitle', you_guess);
            teach_speech = `<speak><p><s>${i18n.__('Teach_1_Speek_1')}${i18n.__('Teach_1_Speek_2',A_count+'A'+B_count+'B')}</s><break time="0.15s"/><s>${i18n.__('Teach_1_Speek_3','<say-as interpret-as="characters">'+you_guess+'</say-as>')}${explained}</s><break time="0.15s"/><s>${i18n.__('Teach_1_Speek_4')}</s><s>${i18n.__('Teach_Start_9')}!</s></p></speak>`;
            teach_text = i18n.__('Teach_1_text')
        } else if (try_count === 2) {
            teach_title = i18n.__('Teach_2_Title', A_count, B_count);
            teach_subtitle = i18n.__('Teach_2_Subtitle');
            teach_speech = `<speak><p><s>${i18n.__('Teach_2_Speek_1','<say-as interpret-as="characters">'+you_guess+'</say-as>')}</s><s>${explained}</s><break time="0.15s"/><s>${i18n.__('Teach_2_Speek_2')}</s><s>${i18n.__('Teach_Start_9')}!</s></p></speak>`
            teach_text = i18n.__('Teach_2_text');
        } else if (try_count === 3) {
            teach_title = i18n.__('Teach_3_Title', A_count, B_count);
            teach_subtitle = i18n.__('Teach_3_Subtitle');
            teach_speech = `<speak><p><s>${i18n.__('Teach_3_Speek_1')}</s><s>${i18n.__('Teach_3_Speek_2','<say-as interpret-as="characters">'+you_guess+'</say-as>')}${explained}</s><break time="0.15s"/><s>${i18n.__('Teach_3_Speek_3')}</s><s>${i18n.__('Teach_Start_9')}!</s></p></speak>`
            teach_text = i18n.__('Teach_2_text');
        } else if (try_count === 4) {
            teach_title = i18n.__('Teach_4_Title', A_count, B_count);
            teach_subtitle = i18n.__('Teach_4_Subtitle');
            teach_speech = `<speak><p><s>${i18n.__('Teach_4_Speek_1')}</s><break time="0.15s"/><s>${i18n.__('Teach_4_Speek_2','<say-as interpret-as="characters">'+you_guess+'</say-as>')}</s><break time="0.15s"/><s>${i18n.__('Teach_4_Speek_3')}</s><s>${i18n.__('Teach_4_Speek_4','<break time="0.15s"/>'+i18n.__('BackNormal')+'<break time="0.15s"/>')}${i18n.__('Teach_4_Speek_5')}</s></p></speak>`;
            teach_text = i18n.__('Teach_4_text');
        } else {
            teach_title = you_guess + '   (' + A_count + 'A' + B_count + 'B)';
            teach_subtitle = i18n.__('Hint_subtitle', A_count, A_count, B_count, B_count, else_count);
            teach_speech = `<speak><p><s>${i18n.__('hint1','<break time="0.15s"/><say-as interpret-as="characters">'+you_guess+'</say-as><break time="0.15s"/>')}${explained}</s></p></speak>`;
            teach_text = i18n.__('hinttext1');
        }

        conv.ask(new SimpleResponse({ speech: teach_speech, text: teach_text }));

        conv.ask(new Table({
            title: teach_title,
            subtitle: teach_subtitle,
            columns: [{ header: i18n.__('Bit'), align: 'CENTER', }, { header: i18n.__('1000-Bit'), align: 'CENTER', }, { header: i18n.__('100-Bit'), align: 'CENTER', }, { header: i18n.__('10-Bit'), align: 'CENTER', }, { header: i18n.__('1-Bit'), align: 'CENTER', }],
            rows: [{
                    cells: [i18n.__('CORRECT')].concat(sys_split),
                    dividerAfter: false,
                },
                {
                    cells: [i18n.__('INPUT')].concat(user_input),
                    dividerAfter: false,
                },
                {
                    cells: [i18n.__('HINT')].concat(temp[2]),
                    dividerAfter: false,
                }
            ]
        }));

        if (try_count >= 4) {
            conv.ask(new Suggestions('🎮 ' + i18n.__('BackNormal'), ranGuess(), ranGuess()));
            conv.contexts.set(Contexts.Return, 1);
        } else { conv.ask(new Suggestions(i18n.__('Contiunce'))); }

    } else {
        conv.ask(new SimpleResponse({ speech: i18n.__('Error_speech'), text: i18n.__('Error_text') }));

        conv.ask(new BasicCard({
            title: i18n.__('teach_error_title'),
            subtitle: i18n.__('teach_error_subtitle'),
            text: i18n.__('teach_error_text'),
        }));

        conv.ask(new Suggestions('🎮 ' + i18n.__('BackNormal'), ranGuess(), ranGuess()));

        conv.contexts.set(Contexts.Return, 1);
        conv.contexts.set(Contexts.Teach, 1);
    }

});

app.intent('重返遊戲', (conv) => {

    conv.user.storage = {};

    conv.ask(new SimpleResponse({ speech: `<speak><p><s>${i18n.__('Hint1')}<break time="0.1s"/>${i18n.__('Hint2')}<break time="0.1s"/>${i18n.__('Hint3')}</s></p></speak>`, text: i18n.__('Hint_text'), }));
    conv.ask(new SimpleResponse({ speech: `<speak><audio src="https://raw.githubusercontent.com/hank199599/Google-Assistant-APP/master/audio/undecided-numbers.mp3"/><p><s>${i18n.__('Start1')}</s><s>${i18n.__('Start2')}</s><s>${i18n.__('Start3')}<say-as interpret-as="characters">0123</say-as>${i18n.__('TO')}<say-as interpret-as="characters">9876</say-as></s><s>${i18n.__('Start4')}</s></p></speak>`, text: i18n.__('StartText'), }));

    conv.ask(new BasicCard({
        title: i18n.__('StartTitle'),
        subtitle: i18n.__('StartSubtitle'),
        text: i18n.__('Start_text')
    }));

    conv.ask(new Suggestions("123", ranGuess(), ranGuess(), ranGuess(), "9876"));


    //將參數存入手機
    conv.user.storage.sys_think = ranGuess();
    conv.user.storage.guess_count = 0;
    conv.user.storage.record = new Array([], [], [], [], []);
    conv.user.storage.try_count = 0;
    conv.user.storage.teach_mode = true;
    conv.contexts.set(Contexts.guess, 1);
    conv.contexts.set(Contexts.Hint, 1);
});

app.intent('玩遊戲意圖', (conv) => {

    if (conv.user.last.seen) {
        conv.ask(new SimpleResponse({ speech: `<speak><audio src="https://raw.githubusercontent.com/hank199599/Google-Assistant-APP/master/audio/undecided-numbers.mp3"/><p><s>${i18n.__('Start1')}</s><s>${i18n.__('Start2')}</s><s>${i18n.__('Start3')}<say-as interpret-as="characters">0123</say-as>${i18n.__('TO')}<say-as interpret-as="characters">9876</say-as></s><s>${i18n.__('Start4')}</s></p></speak>`, text: i18n.__('StartText'), }));
        conv.ask(new Suggestions("123", ranGuess(), ranGuess(), ranGuess(), "9876"));
    } else {
        conv.ask(new SimpleResponse({ speech: `<speak><audio src="https://raw.githubusercontent.com/hank199599/Google-Assistant-APP/master/audio/undecided-numbers.mp3"/><p><s>${i18n.__('Start1')}</s><s>${i18n.__('Start2')}</s><s>${i18n.__('Start3')}<say-as interpret-as="characters">0123</say-as>${i18n.__('TO')}<say-as interpret-as="characters">9876</say-as></s><s>${i18n.__('Start4')}${i18n.__('Start5')}</s></p></speak>`, text: i18n.__('StartText'), }));
        conv.ask(new Suggestions('📝' + i18n.__('Tutorial'), "123", ranGuess(), "9876"));
        conv.contexts.set(Contexts.Start_Teach, 1);
    }

    conv.ask(new BasicCard({
        title: i18n.__('StartTitle'),
        subtitle: i18n.__('StartSubtitle'),
        text: i18n.__('Start_text')
    }));

    //將參數存入手機
    conv.user.storage.sys_think = ranGuess();;
    conv.user.storage.guess_count = 0;
    conv.user.storage.record = new Array([], [], [], [], []);
    conv.user.storage.try_count = 0;
    conv.user.storage.teach_mode = false;
    conv.user.storage.input = i18n.__('error_record');
    conv.contexts.set(Contexts.guess, 1);
    conv.contexts.set(Contexts.Hint, 1);
});

app.intent('預設罐頭回覆', (conv) => {
    conv.ask(new SimpleResponse({
        speech: `<speak><p><s>${i18n.__('Error_hint1', '<break time="0.15s"/>', '<break time="0.15s"/>', '<break time="0.15s"/>', '<break time="0.15s"/>')}</s></p></speak>`,
        text: i18n.__('Error_hint')
    }));

    conv.ask(new Suggestions('🎮 ' + i18n.__('Restart'), '👋 ' + i18n.__('Bye')));
    conv.contexts.set(Contexts.Start, 1);
    conv.contexts.set(Contexts.Bye, 1);
});

app.intent('結束對話', (conv) => {
    conv.user.storage = {}; //離開同時清除暫存資料
    conv.ask(new SimpleResponse({ speech: i18n.__('EndTalk'), text: i18n.__('EndTalk') + ' 👋', }));
    conv.close(new BasicCard({
        title: i18n.__('EndTitle'),
        subtitle: i18n.__('EndText'),
        buttons: new Button({ title: i18n.__('EndButton'), url: 'https://assistant.google.com/services/a/uid/000000b5033b5e97', }),
    }));

});

app.intent('重複題目', (conv) => {

    var input = conv.user.storage.input;
    var A_count = conv.user.storage.help_data[0];
    var B_count = conv.user.storage.help_data[1];
    var guess_count = conv.user.storage.guess_count;
    var replay_array = ["123", ranGuess(), ranGuess(), ranGuess(), "9876"];
    var record = conv.user.storage.record;

    conv.ask(new SimpleResponse({ speech: `<speak><p><s>${i18n.__('Repeat_output','<say-as interpret-as="characters">'+input+'</say-as>')}<break time="0.2s"/></s><s>${i18n.__('Game_hint2','<break time="0.2s"/>'+A_count+'A'+B_count+'B')}</s></p></speak>`, text: i18n.__('Game_text', A_count, B_count), }));

    var output = {
        title: input + '   (' + A_count + 'A' + B_count + 'B)',
        subtitle: i18n.__('card_subtitle'),
        columns: [{ header: "", align: 'CENTER', }, ],
        rows: [{ cells: ["\n" + i18n.__('Record') + "\n"], dividerAfter: false, }, ],
    };

    if (guess_count !== 0) {

        var temp_array = [];
        for (var i = 0; i < record.length; i++) {
            if (record[i].length !== 0) { temp_array.push({ cells: record[i], dividerAfter: false, }) }
        }

        output.columns = [{ header: i18n.__('Input'), align: 'CENTER', }, { header: i18n.__('hint'), align: 'CENTER', }, ]
        output.rows = temp_array
        replay_array = [ranGuess(), ranGuess(), i18n.__('explain', A_count, B_count)]
    }


    conv.ask(new Table(output));
    conv.ask(new Suggestions(replay_array));

    conv.contexts.set(Contexts.Hint, 1);
    conv.contexts.set(Contexts.guess, 1);
    conv.contexts.set(Contexts.Answer, 1);
    conv.contexts.set(Contexts.Repeat, 1);


});

// Set the DialogflowApp object to handle the HTTPS POST request.
exports.dialogflowFirebaseFulfillment = functions.https.onRequest(app);