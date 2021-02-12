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

var sys_think = 0; //生成系統猜測的數字
var number = 0; //使用者剛剛輸入的數字
var you_guess = 0; //將剛剛生成的數字儲存起來
var sys_error1 = 0; //教學模式:系統隨機猜想的錯誤數字1
var sys_error2 = 0; //教學模式:系統隨機猜想的錯誤數字2
var guess_count = 0; //統計猜測次數
var number = 0;
var try_count = 0; //在教學模式中的對話次數
var record = [];
var i = 0;

function take(i, array) {
    var temp = [];
    var countdown = 0;
    var take_out = 0;

    for (countdown = array.length - i; countdown > 1; countdown--) { temp.push(array.pop()); }
    take_out = array.pop();
    for (countdown = temp.length; countdown > 0; countdown--) { array.push(temp.pop()); }
    return take_out;
}

function ranGuess() {

    var array = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

    var ran_think_1000 = take(parseInt(Math.random() * 9), array);
    var ran_think_100 = take(parseInt(Math.random() * 8), array);
    var ran_think_10 = take(parseInt(Math.random() * 7), array);
    var ran_think_1 = take(parseInt(Math.random() * 6), array);
    var output = String((ran_think_1000 * 1000) + (ran_think_100 * 100) + (ran_think_10 * 10) + ran_think_1); //系統生成的實際數字

    if (output.length === 3) { output = "0" + output; } else if (output.length === 2) { output = "00" + output; } else if (output.length === 1) { output = "000" + output; }

    return output
}

function analysis(you_guess, sys_think) {

    var A_count = 0;
    var B_count = 0;
    var array = new Array(" ", " ", " ", " ");

    var your_split = you_guess.toString().split('');
    var sys_split = sys_think.toString().split('');

    //千位數判斷
    if (sys_split[0] === your_split[0]) { A_count++;
        array[0] = 'A'; } else if (sys_split[0] === your_split[1]) { B_count++;
        array[1] = 'B'; } else if (sys_split[0] === your_split[2]) { B_count++;
        array[2] = 'B'; } else if (sys_split[0] === your_split[3]) { B_count++;
        array[3] = 'B'; }

    //百位數判斷

    if (sys_split[1] === your_split[0]) { B_count++;
        array[0] = 'B'; } else if (sys_split[1] === your_split[1]) { A_count++;
        array[1] = 'A'; } else if (sys_split[1] === your_split[2]) { B_count++;
        array[2] = 'B'; } else if (sys_split[1] === your_split[3]) { B_count++;
        array[3] = 'B'; }

    //十位數判斷

    if (sys_split[2] === your_split[0]) { B_count++;
        array[0] = 'B'; } else if (sys_split[2] === your_split[1]) { B_count++;
        array[1] = 'B'; } else if (sys_split[2] === your_split[2]) { A_count++;
        array[2] = 'A'; } else if (sys_split[2] === your_split[3]) { B_count++;
        array[3] = 'B'; }

    //個位數判斷
    if (sys_split[3] === your_split[0]) { B_count++;
        array[0] = 'B'; } else if (sys_split[3] === your_split[1]) { B_count++;
        array[1] = 'B'; } else if (sys_split[3] === your_split[2]) { B_count++;
        array[2] = 'B'; } else if (sys_split[3] === your_split[3]) { A_count++;
        array[3] = 'A'; }

    return [A_count, B_count, array]

}

function explain(A, B, else_count) {
    if (A === 0 && B === 0) { return i18n.__('explaine_1', (10 - else_count)); } else if (A >= 1 && A <= 2 && B === 0) { return i18n.__('explaine_2', A, else_count); } else if (A === 2 && B === 2) { return i18n.__('explaine_3'); } else if (A === 0 && B <= 3) { return i18n.__('explaine_4', B); } else if (A === 3 && B === 0) { return i18n.__('explaine_5', A); } else if (A === 0 && B === 4) { return i18n.__('explaine_6', A); } else if (A === 1 && B === 3) { return i18n.__('explaine_3'); } else { return i18n.__('explaine_7', A, B, else_count); }
}

function transfomer(input) {
    input = replaceString(input, ' ', ''); //消除輸入字串中的空格
    input = replaceString(input, '百', '00'); //消除輸入字串中的空格
    input = replaceString(input, '佰', '00'); //消除輸入字串中的空格
    input = replaceString(input, '千', '000'); //消除輸入字串中的空格
    input = replaceString(input, '仟', '000'); //消除輸入字串中的空格
    input = replaceString(input, '以前', ''); //消除輸入字串中的空格
    input = replaceString(input, '萬', ''); //消除輸入字串中的空格
    input = replaceString(input, '零', '0'); //消除輸入字串中的空格
    input = replaceString(input, '一', '1'); //更改輸入字串中的字元為數字
    input = replaceString(input, '二', '2'); //更改輸入字串中的字元為數字
    input = replaceString(input, '兩', '2'); //更改輸入字串中的字元為數字
    input = replaceString(input, '三', '3'); //更改輸入字串中的字元為數字
    input = replaceString(input, '四', '4'); //更改輸入字串中的字元為數字
    input = replaceString(input, '是', '4'); //更改輸入字串中的字元為數字
    input = replaceString(input, '五', '5'); //更改輸入字串中的字元為數字
    input = replaceString(input, '伍', '5'); //更改輸入字串中的字元為數字
    input = replaceString(input, '六', '6'); //更改輸入字串中的字元為數字
    input = replaceString(input, '七', '7'); //更改輸入字串中的字元為數字
    input = replaceString(input, '八', '8'); //更改輸入字串中的字元為數字
    input = replaceString(input, '爸', '8'); //更改輸入字串中的字元為數字
    input = replaceString(input, '九', '9'); //更改輸入字串中的字元為數字
    input = replaceString(input, '酒', '9'); //更改輸入字串中的字元為數字
    input = replaceString(input, '十', '10'); //更改輸入字串中的字元為數字
    input = replaceString(input, '森林', '30'); //更改輸入字串中的字元為數字
    input = replaceString(input, '三菱', '30'); //更改輸入字串中的字元為數字
    input = replaceString(input, '士林', '40'); //更改輸入字串中的字元為數字
    input = replaceString(input, '二林', '20'); //更改輸入字串中的字元為數字
    input = replaceString(input, '麒麟', '70'); //更改輸入字串中的字元為數字
    input = replaceString(input, '排氣', '87'); //更改輸入字串中的字元為數字
    input = replaceString(input, 'zero', '0'); //更改輸入字串中的字元為數字
    input = replaceString(input, 'to', '2'); //更改輸入字串中的字元為數字
    input = replaceString(input, 'all', '0'); //更改輸入字串中的字元為數字
    input = replaceString(input, 'O', '0'); //更改輸入字串中的字元為數字
    input = replaceString(input, 'o', '0'); //更改輸入字串中的字元為數字
    input = replaceString(input, 'one', '1'); //更改輸入字串中的字元為數字
    input = replaceString(input, 'two', '2'); //更改輸入字串中的字元為數字
    input = replaceString(input, 'three', '3'); //更改輸入字串中的字元為數字
    input = replaceString(input, 'four', '4'); //更改輸入字串中的字元為數字
    input = replaceString(input, 'five', '5'); //更改輸入字串中的字元為數字
    input = replaceString(input, 'six', '6'); //更改輸入字串中的字元為數字
    input = replaceString(input, 'seven', '7'); //更改輸入字串中的字元為數字
    input = replaceString(input, 'eight', '8'); //更改輸入字串中的字元為數字
    input = replaceString(input, 'nine', '9'); //更改輸入字串中的字元為數字

    return input
}

function record_generator(input, array) {

    for (var i = 3; i >= 0; i--) {
        array[i + 1] = array[i];
    }
    array[0] = input;

    return array
}


//歡迎畫面
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
                image: new Image({ url: 'https://imgur.com/7ofgPtV.jpg', alt: 'Pictures', }),
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
    conv.contexts.set(Contexts.guess, 1);
    conv.contexts.set(Contexts.Hint, 1);

});

app.intent('輸入數字', (conv, { any }) => {

    //將參數上載到函式上
    sys_think = conv.user.storage.sys_think;
    you_guess = conv.user.storage.you_guess;
    guess_count = conv.user.storage.guess_count;
    record = conv.user.storage.record;

    if (conv.user.storage.guess_count !== undefined) {

        any = transfomer(any);

        number = parseInt(any);
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

                if (guess_count === 1) {
                    conv.ask(new Table({
                        title: you_guess + '   (' + A_count + 'A' + B_count + 'B)',
                        subtitle: i18n.__('card_subtitle'),
                        columns: [{ header: "", align: 'CENTER', }, ],
                        rows: [{ cells: ["\n" + i18n.__('Record') + "\n"], dividerAfter: false, }, ],
                    }));

                    conv.user.storage.record[0] = [number.toString(), A_count + "A" + B_count + "B"];

                } else {
                    var temp_array = [];

                    for (i = 0; i < record.length; i++) {
                        if (record[i].length !== 0) { temp_array.push({ cells: record[i], dividerAfter: false, }) }
                    }

                    conv.ask(new Table({
                        title: you_guess + '   (' + A_count + 'A' + B_count + 'B)',
                        subtitle: i18n.__('card_subtitle'),
                        columns: [{ header: i18n.__('Input'), align: 'CENTER', }, { header: i18n.__('hint'), align: 'CENTER', }, ],
                        rows: temp_array,
                    }));

                    conv.user.storage.record = record_generator([number.toString(), A_count + "A" + B_count + "B"], record);
                }

                conv.ask(new Suggestions(ranGuess(), ranGuess(), i18n.__('explain', A_count, B_count)));

                conv.contexts.set(Contexts.Hint, 1);
                conv.contexts.set(Contexts.guess, 1);
                conv.contexts.set(Contexts.Answer, 1);

            } else {
                conv.ask(new SimpleResponse({ speech: `<speak><audio src="https://raw.githubusercontent.com/hank199599/Google-Assistant-APP/master/audio/end_game.mp3"/><p><s>${i18n.__('Answer1','<say-as interpret-as="characters">'+sys_think+'</say-as>')}!</s><s>${i18n.__('Answer2', guess_count)}</s><break time="0.2s"/><s>${i18n.__('Answer3')}?</s></p></speak>`, text: i18n.__('Answertext'), }));
                conv.ask(new BasicCard({
                    image: new Image({ url: 'https://imgur.com/7qDUUEq.jpg', alt: 'Pictures', }),
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

            if (guess_count === 0) {

                conv.ask(new Table({
                    title: i18n.__('Error_Title'),
                    subtitle: i18n.__('card_subtitle'),
                    columns: [{ header: "", align: 'CENTER', }, ],
                    rows: [{ cells: ["\n" + i18n.__('Record') + "\n"], dividerAfter: false, }, ],
                }));

                conv.ask(new Suggestions("123", ranGuess(), ranGuess(), ranGuess(), "9876"));
                conv.user.storage.input = i18n.__('error_record')
            } else {

                var temp_array = [];
                conv.user.storage.input = "";

                for (i = 0; i < record.length; i++) {
                    if (record[i].length !== 0) { temp_array.push({ cells: record[i], dividerAfter: false, }) }
                }

                conv.ask(new Table({
                    title: i18n.__('Error_Title'),
                    subtitle: i18n.__('card_subtitle'),
                    columns: [{ header: i18n.__('Input'), align: 'CENTER', }, { header: i18n.__('hint'), align: 'CENTER', }, ],
                    rows: temp_array,
                }));

                // conv.user.storage.record = record_generator([i18n.__('error_record'), "──"], record);
                conv.ask(new Suggestions(ranGuess(), ranGuess(), ranGuess(), ranGuess(), ranGuess()));
            }

            conv.contexts.set(Contexts.guess, 1);
            conv.contexts.set(Contexts.Answer, 1);

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
    //將參數上載到函式上
    var origin = input.toString().split('');
    var result = Array.from(new Set(origin));
    var help_Total = result.length;
    var A_count = conv.user.storage.help_data[0];
    var B_count = conv.user.storage.help_data[1];
    var location = conv.user.storage.help_data[2];
    var else_count = help_Total - (A_count + B_count);

    var explained = explain(A_count, B_count, else_count)


    if (conv.user.storage.guess_count === 0) {

        conv.ask(new SimpleResponse({ speech: `<speak><p><s>${i18n.__('hinterror')}</s></p></speak>`, text: i18n.__('hinttext1') }));
        conv.ask(new BasicCard({
            title: i18n.__('Error_Start'),
            text: i18n.__('Error_Start_hint'),
        }));

        conv.ask(new Suggestions("123", ranGuess(), ranGuess(), ranGuess(), "9876"));
        conv.contexts.set(Contexts.guess, 1);
    } else {

        if (input === i18n.__('error_record')) {
            conv.ask(new SimpleResponse({ speech: `<speak><p><s>${i18n.__('hinterror')}</s></p></speak>`, text: i18n.__('hinttext1') }));
            conv.ask(new BasicCard({
                title: i18n.__('Error_Start'),
                text: i18n.__('Error_Start_hint'),
            }));
            conv.contexts.set(Contexts.guess, 1);
        } else if (conv.user.storage.teach_mode === false) {
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
    sys_think = conv.user.storage.sys_think;

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

    var array = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    var sys_think_1000 = take(parseInt(Math.random() * 9), array);
    var sys_think_100 = take(parseInt(Math.random() * 8), array);
    var sys_think_10 = take(parseInt(Math.random() * 7), array);
    var sys_think_1 = take(parseInt(Math.random() * 6), array);
    conv.user.storage.sys_error1 = take(parseInt(Math.random() * 5), array);
    conv.user.storage.sys_error2 = take(parseInt(Math.random() * 4), array);

    try_count = 0;
    sys_think = String((sys_think_1000 * 1000) + (sys_think_100 * 100) + (sys_think_10 * 10) + sys_think_1); //系統生成的實際數字

    if (sys_think.length === 3) { sys_think = "0" + sys_think; }

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

    sys_think = conv.user.storage.sys_think;
    try_count = conv.user.storage.try_count;
    sys_error1 = conv.user.storage.sys_error1;
    sys_error2 = conv.user.storage.sys_error2;

    var sys_split = sys_think.split('');

    if (try_count === 0) { any = String(sys_error1) + String(sys_split[0]) + String(sys_split[2]) + String(sys_error2); } else if (try_count === 1) { any = String(sys_error1) + String(sys_split[1]) + String(sys_split[2]) + String(sys_error2); } else if (try_count === 2) { any = String(sys_error1) + String(sys_split[0]) + String(sys_split[1]) + String(sys_error2); } else if (try_count === 3) { any = String(sys_split[0]) + String(sys_split[1]) + String(sys_split[2]) + String(sys_error2); }

    try_count++;
    conv.user.storage.try_count = try_count;

    any = transfomer(any);
    number = parseInt(any);
    if (number > 10000) { number = number % 10000; }

    if (isNaN(number) === false) {
        conv.contexts.set(Contexts.Teach, 1);

        you_guess = number.toString();

        if (you_guess.length === 3) { you_guess = "0" + you_guess; } else if (you_guess.length === 2) { you_guess = "00" + you_guess; } else if (you_guess.length === 1) { you_guess = "000" + you_guess; }

        var user_input = you_guess.split('');

        var result = Array.from(new Set(user_input));
        var help_Total = result.length;

        var temp = analysis(you_guess, sys_think);
        var A_count = temp[0];
        var B_count = temp[1];
        var else_count = help_Total - (A_count + B_count);
        var explained = explain(A_count, B_count, else_count)
        var teach_title = "";
        var teach_subtitle = "";

        if (try_count === 1) {
            teach_title = i18n.__('Teach_1_Title', A_count, B_count);
            teach_subtitle = i18n.__('Teach_1_Subtitle', you_guess);
            conv.ask(new SimpleResponse({ speech: `<speak><p><s>${i18n.__('Teach_1_Speek_1')}${i18n.__('Teach_1_Speek_2',A_count+'A'+B_count+'B')}</s><break time="0.15s"/><s>${i18n.__('Teach_1_Speek_3','<say-as interpret-as="characters">'+you_guess+'</say-as>')}${explained}</s><break time="0.15s"/><s>${i18n.__('Teach_1_Speek_4')}</s><s>${i18n.__('Teach_Start_9')}!</s></p></speak>`, text: i18n.__('Teach_1_text') }));
        } else if (try_count === 2) {
            teach_title = i18n.__('Teach_2_Title', A_count, B_count);
            teach_subtitle = i18n.__('Teach_2_Subtitle');
            conv.ask(new SimpleResponse({ speech: `<speak><p><s>${i18n.__('Teach_2_Speek_1','<say-as interpret-as="characters">'+you_guess+'</say-as>')}</s><s>${explained}</s><break time="0.15s"/><s>${i18n.__('Teach_2_Speek_2')}</s><s>${i18n.__('Teach_Start_9')}!</s></p></speak>`, text: i18n.__('Teach_2_text') }));

        } else if (try_count === 3) {
            teach_title = i18n.__('Teach_3_Title', A_count, B_count);
            teach_subtitle = i18n.__('Teach_3_Subtitle');
            conv.ask(new SimpleResponse({ speech: `<speak><p><s>${i18n.__('Teach_3_Speek_1')}</s><s>${i18n.__('Teach_3_Speek_2','<say-as interpret-as="characters">'+you_guess+'</say-as>')}${explained}</s><break time="0.15s"/><s>${i18n.__('Teach_3_Speek_3')}</s><s>${i18n.__('Teach_Start_9')}!</s></p></speak>`, text: i18n.__('Teach_2_text') }));
        } else if (try_count === 4) {
            teach_title = i18n.__('Teach_4_Title', A_count, B_count);
            teach_subtitle = i18n.__('Teach_4_Subtitle');
            conv.ask(new SimpleResponse({ speech: `<speak><p><s>${i18n.__('Teach_4_Speek_1')}</s><break time="0.15s"/><s>${i18n.__('Teach_4_Speek_2','<say-as interpret-as="characters">'+you_guess+'</say-as>')}</s><break time="0.15s"/><s>${i18n.__('Teach_4_Speek_3')}</s><s>${i18n.__('Teach_4_Speek_4','<break time="0.15s"/>'+i18n.__('BackNormal')+'<break time="0.15s"/>')}${i18n.__('Teach_4_Speek_5')}</s></p></speak>`, text: i18n.__('Teach_4_text') }));
        } else {
            teach_title = you_guess + '   (' + A_count + 'A' + B_count + 'B)';
            teach_subtitle = i18n.__('Hint_subtitle', A_count, A_count, B_count, B_count, else_count);
            conv.ask(new SimpleResponse({ speech: `<speak><p><s>${i18n.__('hint1','<break time="0.15s"/><say-as interpret-as="characters">'+you_guess+'</say-as><break time="0.15s"/>')}${explained}</s></p></speak>`, text: i18n.__('hinttext1') }));
        }

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
    conv.user.storage.sys_think = ranGuess();;
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


// Set the DialogflowApp object to handle the HTTPS POST request.
exports.dialogflowFirebaseFulfillment = functions.https.onRequest(app);