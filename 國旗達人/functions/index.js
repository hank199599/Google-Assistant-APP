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

// Instantiate the Dialogflow client.
const app = dialogflow({ debug: true });
var flag_list = require('./country_detail.json'); //引用外部函數來輸入國旗答案與解釋
var county_list = Object.keys(flag_list);
var Q_Total = county_list.length; //題目總數

var Pic_array = ["https://raw.githubusercontent.com/hank199599/Google-Assistant-APP/master/%E5%9C%8B%E6%97%97%E9%81%94%E4%BA%BA/assets/un6XIqo.jpg", "https://raw.githubusercontent.com/hank199599/Google-Assistant-APP/master/%E5%9C%8B%E6%97%97%E9%81%94%E4%BA%BA/assets/6rwJihe.jpg", "https://raw.githubusercontent.com/hank199599/Google-Assistant-APP/master/%E5%9C%8B%E6%97%97%E9%81%94%E4%BA%BA/assets/xyJ6S6W.png", "https://raw.githubusercontent.com/hank199599/Google-Assistant-APP/master/%E5%9C%8B%E6%97%97%E9%81%94%E4%BA%BA/assets/3ti28xQ.jpg", "https://raw.githubusercontent.com/hank199599/Google-Assistant-APP/master/%E5%9C%8B%E6%97%97%E9%81%94%E4%BA%BA/assets/NdVna3T.jpg"];
var Currect_list = ["A", "B", "C", "D"];

var Answer_list = [];
var Currect = '';
var Currect_Answer = '';
var Q_list = new Array([]); //儲存題目編號
var quickmode = false;
var quickmode_count = 9;
var heart_count = 3; //你的血量數
var Total_Count = 0; //統計已答題的總個數
var Correct_Count = 0; //統計答題正確個數
var Wrong_Count = 0; //統計答題錯誤個數
var Outputtext = '';

var Correct_sound = 'https://raw.githubusercontent.com/hank199599/Google-Assistant-APP/master/audio/%E7%AD%94%E5%B0%8D%E9%9F%B3%E6%95%88.mp3';
var Wrong_sound = 'https://raw.githubusercontent.com/hank199599/Google-Assistant-APP/master/audio/%E7%AD%94%E9%8C%AF%E9%9F%B3%E6%95%88.mp3';
var Appaused_sound = 'https://raw.githubusercontent.com/hank199599/Google-Assistant-APP/master/audio/Applause%20sound%20effect%20clapping%20sounds.mp3';
var fail_sound = 'https://raw.githubusercontent.com/hank199599/Google-Assistant-APP/master/audio/%E5%A4%B1%E6%95%97%E9%9F%B3%E6%95%88.mp3';
var welcome_sound = "https://raw.githubusercontent.com/hank199599/Google-Assistant-APP/master/audio/1990s-filtered_127bpm_A_major.wav";
var calculate_sound = "https://raw.githubusercontent.com/hank199599/Google-Assistant-APP/master/audio/%E8%A8%88%E7%AE%97%E9%9F%B3%E6%A0%A1.mp3";

var heart_display = { "0": "", "1": "⚫", "2": "⚫⚫", "3": "⚫⚫⚫" };
var lost_heart_display = { "0": "─", "1": "⚫⚪", "2": "⚫⚫⚪", "3": "⚫⚫⚫" };


const Contexts = {
    START: 'start',
    GUESS: 'guess',
    NEXT: 'next',
    Quit: 'leave',
    Bye: 'bye'
}

//歡迎畫面
app.intent('預設歡迎語句', (conv) => {

    if (conv.user.last.seen) {
        conv.ask(new SimpleResponse({
            speech: `<speak><audio src="${welcome_sound}"/><prosody volume="loud"><p><s>歡迎遊玩國旗達人!</s><s>準備好就說聲「開始遊戲」接受挑戰八!</s></p></prosody></speak>`,
            text: '歡迎回來!',
        }));
    } else {
        conv.ask(new SimpleResponse({
            speech: `<speak><audio src="${welcome_sound}"/><prosody volume="loud"><p><s>歡迎遊玩國旗達人!</s><s>本服務會隨機生成國旗配對之選擇題，若你的錯誤次數超過3次，遊戲就結束!</s><s>準備好就說聲「開始遊戲」接受挑戰八!</s></p></prosody></speak>`,
            text: '歡迎使用「國旗達人」!',
        }));
    }

    conv.ask(new BasicCard({
        image: new Image({
            url: Pic_array[parseInt(Math.random() * (Pic_array.length - 1))],
            alt: 'Pictures',
        }),
        title: '準備好接受問題轟炸了嗎?',
        subtitle: '本服務會隨機生成國旗配對之選擇題， \n若你的錯誤次數超過3次，遊戲就結束!  \n準備好就按下「開始遊戲」接受挑戰吧!',
        text: '圖片來源：Pxhere (CC0 公共領域授權)',
        display: 'CROPPED', //更改圖片顯示模式為自動擴展
    }));
    conv.ask(new Suggestions('🎮 開始遊戲', '⚡ 快速模式', '👋 掰掰'));

    conv.contexts.set(Contexts.START, 1);
    conv.contexts.set(Contexts.Bye, 1);

    //參數同步回手機
    conv.user.storage.Q_list = [];
    conv.user.storage.quickmode_count = 9;
    conv.user.storage.heart_count = 3;
    conv.user.storage.Total_Count = 0;
    conv.user.storage.Correct_Count = 0;
    conv.user.storage.Wrong_Count = 0;

});

app.intent('開始遊戲', (conv, { start }) => {

    Q_list = [];
    Total_Count = 0;
    heart_count = 3;

    if (start === '快速') {
        quickmode = true;
    } else {
        quickmode = false;
    }

    for (var Q = parseInt(Math.random() * Q_Total); Q_list.indexOf(Q) !== -1; Q++) {}
    Q_list.push(Q); // 將現在選出的編號存入陣列

    var selector = parseInt(Math.random() * 3);

    var Currect_Answer = county_list[Q]; //取得本題目的正確國名
    var Currect = Currect_list[selector];
    var Answer_list = [];
    Answer_list[selector] = Currect_Answer;
    var selected_list = [Q];

    for (var i = 0; i < 4; i++) {
        if (Answer_list[i] === undefined) {
            for (var temp = parseInt(Math.random() * 257); selected_list.indexOf(temp) !== -1; temp++) {}
            Answer_list[i] = county_list[temp];
        }
    }

    Total_Count++;

    var output_form = {
        title: Total_Count + '.  \n這是下列何者的旗幟?',
        image: new Image({
            url: "https://raw.githubusercontent.com/hank199599/Google-Assistant-APP/master/%E5%9C%8B%E6%97%97%E9%81%94%E4%BA%BA/flags/" + Currect_Answer + ".png",
            alt: 'Question Flag'
        }),
        rows: [{ cells: ['(A)' + Answer_list[0] + '  \n(B)' + Answer_list[1] + '  \n(C)' + Answer_list[2] + '  \n(D)' + Answer_list[3] + '  \n\n血量條 ' + heart_display[heart_count]], dividerAfter: false, }, ]
    }

    if (quickmode === true) {
        quickmode_count = 10 - Total_Count;
        output_form.title = '第' + Total_Count + '題/共10題  \n這是下列何者的旗幟?';
        output_form.rows = [{ cells: ['(A)' + Answer_list[0] + '  \n(B)' + Answer_list[1] + '  \n(C)' + Answer_list[2] + '  \n(D)' + Answer_list[3] + '  \n\n血量條 ' + heart_display[heart_count] + ' • 快速模式'], dividerAfter: false, }, ];

        conv.ask(new SimpleResponse({ speech: '於此模式下，總共有十題題目。失敗三次一樣會直接結束,祝你好運!', text: '⚡快速模式說明  \n共十題題目，失敗三次一樣會直接結束!', }));
    }

    conv.speechBiasing = Answer_list;

    conv.ask(new SimpleResponse({ speech: `<speak><p><s>第${Total_Count}題</s><break time="0.2s"/><s>這是下列何者的旗幟?</s><break time="0.15s"/><s>A、${Answer_list[0]}</s><break time="0.1s"/><s> B、${Answer_list[1]}</s><break time="0.1s"/><s>西、${Answer_list[2]}</s><break time="0.1s"/><s>D、${Answer_list[3]}</s><break time="0.1s"/></p></speak>`, text: '熱騰騰的題目來啦!' }));

    conv.ask(new Table(output_form));
    conv.ask(new Suggestions('    A    ', '    B    ', '    C    ', '    D    '));

    conv.contexts.set(Contexts.GUESS, 1);

    conv.user.storage.Answer_list = Answer_list;
    conv.user.storage.Currect = Currect;
    conv.user.storage.Currect_Answer = Currect_Answer;
    conv.user.storage.Q_list = Q_list;
    conv.user.storage.quickmode = quickmode;
    conv.user.storage.quickmode_count = 9;
    conv.user.storage.heart_count = 3;
    conv.user.storage.Total_Count = Total_Count;
    conv.user.storage.Correct_Count = 0;
    conv.user.storage.Wrong_Count = 0;


});

app.intent('進行猜測', (conv, { input }) => {

    Answer_list = conv.user.storage.Answer_list;
    Currect = conv.user.storage.Currect;
    Currect_Answer = conv.user.storage.Currect_Answer;
    Q_list = conv.user.storage.Q_list;
    quickmode = conv.user.storage.quickmode;
    quickmode_count = conv.user.storage.quickmode_count;
    heart_count = conv.user.storage.heart_count;
    Total_Count = conv.user.storage.Total_Count;
    Correct_Count = conv.user.storage.Correct_Count;
    Wrong_Count = conv.user.storage.Wrong_Count;

    var output_charactor_list = {
        "A": "ㄟ",
        "B": "逼",
        "C": "溪",
        "D": "低"
    };
    var suggestion = '';

    var replace_dict = {
        "a": "A",
        "b": "B",
        "c": "C",
        "d": "D",
        "80": "巴林",
        "巴黎": "巴林"
    }

    if (replace_dict[input] !== undefined) { input = replace_dict[input]; }

    for (var i = 0; i < Answer_list.length; i++) {
        if (input.indexOf(Answer_list[i]) !== -1) {
            input = Currect_list[i];
        }
    }

    var word_list = ["一", "二", "三", "四"];
    for (var i = 0; i < word_list.length; i++) {
        if (input.indexOf(word_list[i]) !== -1) {
            input = Currect_list[i];
        }
    }
    if (Currect_list.indexOf(input) !== -1) {

        //若輸入正確 則判定答案是否正確(answer_input=T)
        if (input === Currect) {
            Correct_Count++;
            var Output = '這是正確答案';
            var blood_show = heart_display[heart_count];
        } else {
            Wrong_Count++;
            heart_count--;
            var Output = '這是錯誤答案';
            var blood_show = lost_heart_display[heart_count];

        }

        var output_charactor = output_charactor_list[Currect];

        if (quickmode === false) {

            Outputtext = '第' + Total_Count + '題 • 血量條 ' + blood_show;

            if (heart_count >= 1) {
                suggestion = '    下一題    ';
                conv.contexts.set(Contexts.NEXT, 1);

                if (input === Currect) {
                    conv.ask(new SimpleResponse({ speech: `<speak><audio src="${Correct_sound}"/>恭喜你答對拉!</speak>`, text: '恭喜答對拉 🎉' }));
                } else {
                    conv.ask(new SimpleResponse({ speech: `<speak><audio src="${Wrong_sound}"/>答錯啦!正確答案為${output_charactor}、${Currect_Answer}</speak>`, text: '再接再厲 💪' }));
                }
            } else {
                conv.ask(new SimpleResponse({ speech: `<speak><audio src="${fail_sound}"/>回合結束!這題正確答案為${output_charactor}、${Currect_Answer}</speak>`, text: '別氣餒，下次再加油 🥊' }));
                suggestion = '休息，是為了走更長遠的路';
                conv.contexts.set(Contexts.Quit, 1);
            }
        } else {

            Outputtext = '第' + Total_Count + '題 • 快速模式 • ' + '血量條 ' + blood_show;

            if (heart_count >= 1 && quickmode_count >= 1) {
                suggestion = '    下一題    ';
                conv.contexts.set(Contexts.NEXT, 1);
                if (input === Currect) {
                    conv.ask(new SimpleResponse({ speech: `<speak><audio src="${Correct_sound}"/>恭喜你答對拉!</speak>`, text: '恭喜答對拉 🎉' }));
                } else {
                    conv.ask(new SimpleResponse({ speech: `<speak><audio src="${Wrong_sound}"/>答錯啦!正確答案為${output_charactor}、${Currect_Answer}</speak>`, text: '再接再厲 💪' }));
                }

            } else if (quickmode_count === 0) {
                conv.contexts.set(Contexts.Quit, 1);
                conv.ask(new SimpleResponse({ speech: `<speak><audio src="${Appaused_sound}"/>恭喜你破關拉!這題正確答案為${output_charactor}、${Currect_Answer}</speak>`, text: '恭喜你完成啦 👏' }));
                suggestion = '休息，是為了走更長遠的路';
            } else {
                conv.contexts.set(Contexts.Quit, 1);
                conv.ask(new SimpleResponse({ speech: `<speak><audio src="${fail_sound}"/>回合結束!這題正確答案為${output_charactor}、${Currect_Answer}</speak>`, text: '別氣餒，下次再加油 🥊' }));
                suggestion = '休息，是為了走更長遠的路';
            }
        }

        var Your_choice = Answer_list[Currect_list.indexOf(input)]

        conv.ask(new Table({
            title: ' (' + input + ') ' + Your_choice,
            subtitle: Output,
            image: new Image({
                url: "https://raw.githubusercontent.com/hank199599/Google-Assistant-APP/master/%E5%9C%8B%E6%97%97%E9%81%94%E4%BA%BA/flags/" + Currect_Answer + ".png",
                alt: 'Question Flag'
            }),
            columns: [{ header: "🌐「" + Currect_Answer + "」簡介", align: 'LEADING', }, ],
            rows: [{
                cells: [flag_list[Currect_Answer] + '  \n  \n' + Outputtext],
                dividerAfter: false,
            }, ],
            buttons: new Button({
                title: '維基百科:' + Currect_Answer,
                url: 'https://zh.wikipedia.org/zh-tw/' + Currect_Answer,
            }),
        }));

        conv.ask(new Suggestions(suggestion));

    } else {
        conv.ask(new SimpleResponse({ speech: '請點選建議卡片或輸入國家名稱，來回答問題!', text: '請點選建議卡片或說出國家名稱!' }));
        conv.speechBiasing = Answer_list;
        conv.contexts.set(Contexts.GUESS, 1);

        var output_form = {
            title: Total_Count + '.  \n這是下列何者的旗幟?',
            image: new Image({
                url: "https://raw.githubusercontent.com/hank199599/Google-Assistant-APP/master/%E5%9C%8B%E6%97%97%E9%81%94%E4%BA%BA/flags/" + Currect_Answer + ".png",
                alt: 'Question Flag'
            }),
            rows: [{ cells: ['(A)' + Answer_list[0] + '  \n(B)' + Answer_list[1] + '  \n(C)' + Answer_list[2] + '  \n(D)' + Answer_list[3] + '  \n\n血量條 ' + heart_display[heart_count]], dividerAfter: false, }, ]
        }

        if (quickmode === true) {
            output_form.title = '第' + Total_Count + '題/共10題  \n這是下列何者的旗幟?';
            output_form.rows = [{ cells: ['(A)' + Answer_list[0] + '  \n(B)' + Answer_list[1] + '  \n(C)' + Answer_list[2] + '  \n(D)' + Answer_list[3] + '  \n\n血量條 ' + heart_display[heart_count] + ' • 快速模式'], dividerAfter: false, }, ];
        }

        conv.ask(new Table(output_form));
        conv.ask(new Suggestions('    A    ', '    B    ', '    C    ', '    D    '));
    }

    conv.user.storage.Answer_list = Answer_list;
    conv.user.storage.Currect = Currect;
    conv.user.storage.Q_list = Q_list;
    conv.user.storage.quickmode = quickmode;
    conv.user.storage.quickmode_count = quickmode_count;
    conv.user.storage.heart_count = heart_count;
    conv.user.storage.Total_Count = Total_Count;
    conv.user.storage.Correct_Count = Correct_Count;
    conv.user.storage.Wrong_Count = Wrong_Count;

});

app.intent('下一題題目', (conv, ) => {

    quickmode = conv.user.storage.quickmode;
    quickmode_count = conv.user.storage.quickmode_count;
    heart_count = conv.user.storage.heart_count;
    Q_list = conv.user.storage.Q_list;
    quickmode = conv.user.storage.quickmode;
    Total_Count = conv.user.storage.Total_Count;

    for (var Q = parseInt(Math.random() * Q_Total); Q_list.indexOf(Q) !== -1; Q++) {}
    Q_list.push(Q); // 將現在選出的編號存入陣列

    var selector = parseInt(Math.random() * 3);

    var Currect_Answer = county_list[Q]; //取得本題目的正確國名
    var Currect = Currect_list[selector];
    var Answer_list = [];
    Answer_list[selector] = Currect_Answer;
    var selected_list = [Q];

    for (var i = 0; i < 4; i++) {
        if (Answer_list[i] === undefined) {
            for (var temp = parseInt(Math.random() * 257); selected_list.indexOf(temp) !== -1; temp++) {}
            Answer_list[i] = county_list[temp];
        }
    }

    Total_Count++;

    conv.speechBiasing = Answer_list;

    conv.ask(new SimpleResponse({ speech: `<speak><p><s>第${Total_Count}題</s><break time="0.2s"/><s>這是下列何者的旗幟?</s><break time="0.15s"/><s>A、${Answer_list[0]}</s><break time="0.1s"/><s> B、${Answer_list[1]}</s><break time="0.1s"/><s>西、${Answer_list[2]}</s><break time="0.1s"/><s>D、${Answer_list[3]}</s><break time="0.1s"/></p></speak>`, text: '熱騰騰的題目來啦!' }));

    var output_form = {
        title: Total_Count + '.  \n這是下列何者的旗幟?',
        image: new Image({
            url: "https://raw.githubusercontent.com/hank199599/Google-Assistant-APP/master/%E5%9C%8B%E6%97%97%E9%81%94%E4%BA%BA/flags/" + Currect_Answer + ".png",
            alt: 'Question Flag'
        }),
        rows: [{ cells: ['(A)' + Answer_list[0] + '  \n(B)' + Answer_list[1] + '  \n(C)' + Answer_list[2] + '  \n(D)' + Answer_list[3] + '  \n\n血量條 ' + heart_display[heart_count]], dividerAfter: false, }, ]
    }

    if (quickmode === true) {
        output_form.title = '第' + Total_Count + '題/共10題  \n這是下列何者的旗幟?';
        output_form.rows = [{ cells: ['(A)' + Answer_list[0] + '  \n(B)' + Answer_list[1] + '  \n(C)' + Answer_list[2] + '  \n(D)' + Answer_list[3] + '  \n\n血量條 ' + heart_display[heart_count] + ' • 快速模式'], dividerAfter: false, }, ];
    }
    conv.ask(new Table(output_form));
    conv.ask(new Suggestions('    A    ', '    B    ', '    C    ', '    D    '));

    conv.contexts.set(Contexts.GUESS, 1);

    //參數同步回手機
    conv.user.storage.Answer_list = Answer_list;
    conv.user.storage.Currect = Currect;
    conv.user.storage.Currect_Answer = Currect_Answer;
    conv.user.storage.Q_list = Q_list;
    conv.user.storage.quickmode = quickmode;
    conv.user.storage.quickmode_count = quickmode_count;
    conv.user.storage.heart_count = heart_count;
    conv.user.storage.Total_Count = Total_Count;

});

app.intent('結算成績', (conv, ) => {

    var Total_Count = conv.user.storage.Total_Count;

    if (quickmode === true) {
        conv.ask(new Suggestions('⚡ 重新快速模式', '🎮 試試一般模式'));
    } else {
        conv.ask(new Suggestions('🔄 重新開始'));
    }

    conv.ask(new SimpleResponse({ speech: `<speak><audio src="${calculate_sound}"/><prosody volume="loud"><p><s>根據Google神通廣大的雲端計算!</s><s>你在這回合一共進行<break time="0.05s"/>${Total_Count}<break time="0.03s"/>題題目。</s><s>你要再試一次嗎?</s></p></prosody></speak>`, text: '驗收成果' }));
    conv.ask(new BasicCard({
        image: new Image({ url: 'https://raw.githubusercontent.com/hank199599/Google-Assistant-APP/master/%E5%9C%8B%E6%97%97%E9%81%94%E4%BA%BA/assets/ncuUmbe.jpg', alt: 'Pictures', }),
        title: '本回合共進行' + Total_Count + '題題目',
        subtitle: '答對數：' + conv.user.storage.Correct_Count + '  \n錯誤數：' + conv.user.storage.Wrong_Count,
        display: 'CROPPED', //更改圖片顯示模式為自動擴展
    }));

    conv.contexts.set(Contexts.START, 1);
    conv.contexts.set(Contexts.Bye, 1);
    conv.ask(new Suggestions('👋 掰掰'));

    //參數同步回手機
    conv.user.storage.Q_list = [];
    conv.user.storage.quickmode_count = 9;
    conv.user.storage.heart_count = 3;
    conv.user.storage.Total_Count = 0;
    conv.user.storage.Correct_Count = 0;
    conv.user.storage.Wrong_Count = 0;

});

app.intent('結束對話', (conv) => {
    conv.user.storage = {}; //離開同時清除暫存資料
    conv.ask('希望你玩得愉快!');
    conv.ask(new SimpleResponse({ speech: '下次見', text: '下次見 👋', }));
    conv.close(new BasicCard({
        title: '感謝您的使用!',
        text: '如果有任何需要改進的地方，  \n歡迎到簡介頁面評分或給予反饋，謝謝!',
        buttons: new Button({ title: '開啟本程式的商店頁面', url: 'https://assistant.google.com/services/a/uid/0000008b6d90ac06', }),
    }));

});


// Set the DialogflowApp object to handle the HTTPS POST request.
exports.flag_game = functions.https.onRequest(app);