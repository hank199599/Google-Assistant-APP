'use strict';

// Import the Dialogflow module from the Actions on Google client library.
const {
    dialogflow,
    SimpleResponse,
    Button,
    List,
    Image,
    BasicCard,
    Suggestions,
    Table
} = require('actions-on-google');

const functions = require('firebase-functions');
const app = dialogflow({ debug: true });
var spliter = require('word_spliter');

var accent_selection = require('./option_list.json');
var phonetics_dict = require('./dict.json');
var questions = Object.keys(phonetics_dict);
var accent_list = ["EN-US", "EN-UK", "EN-IN", "EN-AU"]; //可選取的口音清單
var accent_display = { "EN-US": "🇺🇸 美國腔", "EN-UK": "🇬🇧 英國腔", "EN-IN": "🇮🇳 印度腔", "EN-AU": "🇦🇺 澳洲腔", "隨機": "🔀 隨機" }; //可選取的口音清單

const Contexts = {
    START: 'start',
    GUESS: 'guess',
    REPEAT: 'repeat',
    ANSWER: 'answer',
    NEXT: 'next',
    Quit: 'leave',
    RESTART: 'restart',
    Bye: 'bye'
}

app.intent('預設歡迎語句', (conv) => {

    if (!conv.user.storage.lastseen) {
        conv.ask(new SimpleResponse({
            speech: `<speak><p><s>歡迎回來，請選擇題目所撥放的語系腔調</s></p></speak>`,
            text: "歡迎回來!\n請選擇要挑戰的語系"
        }));
    } else {
        conv.ask(new SimpleResponse({
            speech: `<speak><p><s>歡迎使用，請選擇題目所撥放的語系腔調</s></p></speak>`,
            text: "歡迎使用!"
        }));
    }

    conv.ask(new List({
        title: "選擇想聽見的腔調",
        items: accent_selection
    }));

    conv.ask(new Suggestions('👋 掰掰'));

    conv.contexts.set(Contexts.START, 1);
    conv.contexts.set(Contexts.Bye, 1);

    conv.user.storage.Q_list = [];
    conv.user.storage.Total_count = 0;
    conv.user.storage.Wrong_count = 0;
    conv.user.storage.Correct_count = 0;

});

app.intent('開始遊戲', (conv, params, option) => {

    conv.user.storage.Wrong_count = 0;
    conv.user.storage.Correct_count = 0;

    var accent = option;
    conv.user.storage.option = option;

    if (option === "隨機") { accent = accent_list[parseInt(Math.random() * (accent_list.length))] }

    var start_audio_url = "https://raw.githubusercontent.com/hank199599/Google-Assistant-APP/master/%E5%A4%9A%E7%9B%8A%E6%B8%AC%E9%A9%97/audio/" + accent + "/open_text.mp3"
    conv.ask(new SimpleResponse({
        speech: `<speak><p><s><audio src="${start_audio_url}"/></s></p></speak>`,
        text: "沒問題，我會用你指定的腔調進行遊戲!"
    }));

    var question = questions[parseInt(Math.random() * (questions.length - 1))] //這回合的題目
    var audio_url = "https://raw.githubusercontent.com/hank199599/Google-Assistant-APP/master/%E5%A4%9A%E7%9B%8A%E6%B8%AC%E9%A9%97/audio/" + accent + "/" + question + ".mp3"

    conv.ask(new SimpleResponse({
        speech: `<speak><p><s>第1題<break time="0.5s"/><audio src="${audio_url}"/></s></p></speak>`,
        text: "請問以下的單字是甚麼意思?"
    }));

    conv.ask(new BasicCard({
        title: '1.\n' + question,
        text: accent_display[accent] + ' • 共3次猜測的機會',
    }));

    conv.ask(new Suggestions('再說一次', '查看答案'));

    //尋找單字對應的解釋
    var array = spliter.split(phonetics_dict[question]["definition"])
    var temp = [];
    for (var i = 0; i < array.length; i++) {
        if (array[i].length >= 2) { temp.push(array[i]) }
    }


    conv.user.storage.question = question;
    conv.user.storage.explain = temp;
    conv.user.storage.Q_list = [question];
    conv.user.storage.Total_count = 1;
    conv.user.storage.Correct_count = 0;
    conv.user.storage.guess_count = 0;
    conv.user.storage.accent = accent;
    conv.user.storage.accent_record = [accent];

    conv.contexts.set(Contexts.GUESS, 1);
    conv.contexts.set(Contexts.REPEAT, 1);
    conv.contexts.set(Contexts.ANSWER, 1);

});

app.intent('進行猜測', (conv, { input }) => {

    var guess_count = conv.user.storage.guess_count;
    var flag = false;
    var accent = conv.user.storage.accent;

    for (var i = 0; i < conv.user.storage.explain.length; i++) {
        if (input.indexOf(conv.user.storage.explain[i]) !== -1) {
            flag = true;
        }
    }

    guess_count++

    if (flag === false && guess_count <= 2) {

        var wrong_array = ["答錯啦，再試看看吧", "再加把勁", "很接近答案了!"]

        conv.ask(`<speak><p><s>${wrong_array[parseInt(Math.random() * (wrong_array.length - 1))]}</s></p></speak>`);

        conv.ask(new BasicCard({
            title: conv.user.storage.Q_list.length + '.\n' + conv.user.storage.question,
            text: accent_display[accent] + ' • 共' + (3 - guess_count) + '次猜測的機會',
        }));

        conv.ask(new Suggestions('再說一次', '查看答案'));
        conv.contexts.set(Contexts.GUESS, 1);
        conv.contexts.set(Contexts.REPEAT, 1);
        conv.contexts.set(Contexts.ANSWER, 1);

    } else {

        var audio_url = "https://raw.githubusercontent.com/hank199599/Google-Assistant-APP/master/%E5%A4%9A%E7%9B%8A%E6%B8%AC%E9%A9%97/audio/" + accent + "/" + conv.user.storage.question + ".mp3"

        if (guess_count === 3) {
            conv.ask(new SimpleResponse(`<speak><p><s>答錯啦</s></p></speak>`));
            conv.user.storage.Wrong_count = conv.user.storage.Wrong_count + 1;

        } else {
            conv.ask(new SimpleResponse(`<speak><p><s>答對啦</s></p></speak>`));
            conv.user.storage.Correct_count = conv.user.storage.Correct_count + 1;

        }
        conv.ask(new SimpleResponse({
            speech: `<speak><p><s><audio src="${audio_url}"/><break time="0.5s"/>的意思是${phonetics_dict[conv.user.storage.question]["definition"]}</s></p></speak>`,
            text: "以下是這個單詞的意思"
        }));

        var card_content = {
            title: conv.user.storage.question,
            subtitle: phonetics_dict[conv.user.storage.question]["definition"],
            text: '第' + conv.user.storage.Q_list.length + "題 • " + accent_display[accent],
        }

        if (phonetics_dict[conv.user.storage.question]!==undefined){
            card_content['subtitle']= phonetics_dict[conv.user.storage.question]['phonetics']+'  \n'+phonetics_dict[conv.user.storage.question]["definition"]
            card_content['text']=phonetics_dict[conv.user.storage.question]['meanings']+'  \n  \n'+'第' + conv.user.storage.Q_list.length + "題 • " + accent_display[accent]
        }

        conv.ask(new BasicCard(card_content));

        if (conv.user.storage.Q_list.length < 5) {
            conv.ask(new Suggestions('下一題'));
            conv.contexts.set(Contexts.NEXT, 1);

        } else {
            conv.ask(new Suggestions('結算成績'));
            conv.contexts.set(Contexts.Quit, 1);
        }
    }
    conv.user.storage.guess_count = guess_count;
});

app.intent('重複題目', (conv) => {

    var accent = conv.user.storage.accent;

    if (accent === "隨機") { accent = accent_list[parseInt(Math.random() * (accent_list.length))] }
    var audio_url = "https://raw.githubusercontent.com/hank199599/Google-Assistant-APP/master/%E5%A4%9A%E7%9B%8A%E6%B8%AC%E9%A9%97/audio/" + accent + "/" + conv.user.storage.question + ".mp3"

    var reply_array = ["沒問題", "我知道了", "OK", "我了解了", "好的", "收到"]

    conv.ask(new SimpleResponse({
        speech: `<speak><p><s>${reply_array[parseInt(Math.random() * (reply_array.length))]}，仔細聽好囉<break time="0.5s"/><audio src="${audio_url}"/></s></p></speak>`,
        text: "沒問題，仔細聽好囉!"
    }));

    conv.ask(new BasicCard({
        title: conv.user.storage.Q_list.length + '.\n' + conv.user.storage.question,
        text: accent_display[accent] + ' • 共' + (3 - conv.user.storage.guess_count) + '次猜測的機會',
    }));

    conv.ask(new Suggestions('再說一次', '查看答案'));
    conv.contexts.set(Contexts.GUESS, 1);
    conv.contexts.set(Contexts.REPEAT, 1);
    conv.contexts.set(Contexts.ANSWER, 1);

});

app.intent('查看答案', (conv) => {

    var accent = conv.user.storage.accent;

    if (accent === "隨機") { accent = accent_list[parseInt(Math.random() * (accent_list.length))] }
    var audio_url = "https://raw.githubusercontent.com/hank199599/Google-Assistant-APP/master/%E5%A4%9A%E7%9B%8A%E6%B8%AC%E9%A9%97/audio/" + accent + "/" + conv.user.storage.question + ".mp3"


    conv.ask(new SimpleResponse({
        speech: `<speak><p><s><audio src="${audio_url}"/><break time="0.5s"/>的意思是${phonetics_dict[conv.user.storage.question]["definition"]}</s></p></speak>`,
        text: "以下是這個單詞的意思"
    }));
    
    var card_content = {
        title: conv.user.storage.question,
        subtitle: phonetics_dict[conv.user.storage.question]["definition"],
        text: '第' + conv.user.storage.Q_list.length + "題 • " + accent_display[accent],
    }

    if (phonetics_dict[conv.user.storage.question]!==undefined){
        card_content['subtitle']= phonetics_dict[conv.user.storage.question]['phonetics']+'  \n'+phonetics_dict[conv.user.storage.question]["definition"]
        card_content['text']=phonetics_dict[conv.user.storage.question]['meanings']+'  \n  \n'+'第' + conv.user.storage.Q_list.length + "題 • " + accent_display[accent]
    }

    conv.ask(new BasicCard(card_content));

    if (conv.user.storage.Q_list.length < 5) {
        conv.ask(new Suggestions('下一題'));
        conv.contexts.set(Contexts.NEXT, 1);

    } else {
        conv.ask(new Suggestions('結算成績'));
        conv.contexts.set(Contexts.Quit, 1);
    }
});

app.intent('下一題題目', (conv) => {
    var accent_record = conv.user.storage.accent_record;
    var Q_list = conv.user.storage.Q_list;
    var option = conv.user.storage.option;

    if (option === "隨機") { var accent = accent_list[parseInt(Math.random() * (accent_list.length))] } else { var accent = option }

    var question = questions[parseInt(Math.random() * (questions.length - 1))] //這回合的題目

    Q_list.push(question)
    accent_record.push(accent)
    conv.user.storage.accent_record = accent_record;

    var audio_url = "https://raw.githubusercontent.com/hank199599/Google-Assistant-APP/master/%E5%A4%9A%E7%9B%8A%E6%B8%AC%E9%A9%97/audio/" + accent + "/" + question + ".mp3"

    conv.ask(new SimpleResponse({
        speech: `<speak><p><s>第${Q_list.length}題<break time="0.5s"/><audio src="${audio_url}"/></s></p></speak>`,
        text: "請問以下的單字是甚麼意思?"
    }));

    conv.ask(new BasicCard({
        title: Q_list.length + '.\n' + question,
        text: accent_display[accent] + ' • 共3次猜測的機會',
    }));
    conv.ask(new Suggestions('再說一次', '查看答案'));

    var array = spliter.split(phonetics_dict[question]["definition"])
    var temp = [];
    for (var i = 0; i < array.length; i++) {
        if (array[i].length >= 2) { temp.push(array[i]) }
    }

    conv.user.storage.question = question;
    conv.user.storage.explain = temp;
    conv.user.storage.Q_list = Q_list;
    conv.user.storage.guess_count = 0;
    conv.user.storage.accent = accent;

    conv.contexts.set(Contexts.GUESS, 1);
    conv.contexts.set(Contexts.REPEAT, 1);
    conv.contexts.set(Contexts.ANSWER, 1);

});

app.intent('結算成績', (conv) => {

    var Q_list = conv.user.storage.Q_list;
    var accent_record = conv.user.storage.accent_record;
    var rowsarray = [];

    for (var i = 0; i < Q_list.length; i++) {
        rowsarray.push({
            cells: [ Q_list[i], phonetics_dict[Q_list[i]]["definition"]],
            dividerAfter: false,
        });
    }

    var output_word = "";
    for (var i = 0; i < Q_list.length; i++) {
        output_word = output_word + '<audio src="https://raw.githubusercontent.com/hank199599/Google-Assistant-APP/master/%E5%A4%9A%E7%9B%8A%E6%B8%AC%E9%A9%97/audio/' + accent_record[i] + "/" + Q_list[i] + '.mp3"/>' + '<break time="0.5s"/>'
    }

    conv.ask(new SimpleResponse({
        speech: `<speak><p><s>在這回合中，我們一共學習到五個單字</s><break time="0.5s"/><s>分別是${output_word}</s><break time="0.5s"/><s>想再試一次嗎?</s></p></speak>`,
        text: "下面是我們在這回合中所學習到的單字"
    }));

    conv.ask(new Table({
        title: "這回合的題目列表",
        columns: [{ header: '題目', align: 'CENTER', }, { header: '解釋', align: 'CENTER', }],
        rows: rowsarray,
    }));

    conv.ask(new Suggestions('重新開始', '👋 掰掰'));

    conv.contexts.set(Contexts.RESTART, 1);
    conv.contexts.set(Contexts.Bye, 1);
    conv.user.storage.lastseen=true;
});

app.intent('預設罐頭回覆', (conv) => {

    var reply_array = ["對不起，我聽不懂你的問題。", "請你再說一遍。", "我怕我聽不懂你的話。", "我對最後的部分還有一些糊塗。", "請再講一次好嗎？"]

    conv.ask(`<speak><p><s>${reply_array[parseInt(Math.random() * (reply_array.length - 1))]}</s></p></speak>`);

    conv.ask(new Suggestions('重新開始', '👋 掰掰'));

    conv.contexts.set(Contexts.RESTART, 1);
    conv.contexts.set(Contexts.Bye, 1);

});


app.intent('選擇題目語系', (conv) => {


    conv.ask(`<speak><p><s>請選擇題目所撥放的語系腔調</s></p></speak>`);

    conv.ask(new List({
        title: "選擇想聽見的腔調",
        items: accent_selection
    }));

    conv.ask(new Suggestions('👋 掰掰'));

    conv.contexts.set(Contexts.START, 1);
    conv.contexts.set(Contexts.Bye, 1);

    conv.user.storage.Q_list = [];
    conv.user.storage.Total_count = 0;
    conv.user.storage.Wrong_count = 0;
    conv.user.storage.Correct_count = 0;
    conv.user.storage.lastseen=true;
});

app.intent('結束對話', (conv) => {
    conv.user.storage = {}; //離開同時清除暫存資料
    conv.user.storage.lastseen=true;
    conv.ask('希望你玩得愉快!');
    conv.ask(new SimpleResponse({ speech: '下次見', text: '下次見 👋', }));
    conv.close(new BasicCard({
        title: '感謝您的使用!',
        text: '如果有任何需要改進的地方，  \n歡迎到簡介頁面評分或給予反饋，謝謝!',
        buttons: new Button({ title: '開啟本程式的商店頁面', url: 'https://assistant.google.com/services/a/uid/0000008b6d90ac06', }),
    }));

});



// Set the DialogflowApp object to handle the HTTPS POST request.
exports.toeic_tester = functions.https.onRequest(app);