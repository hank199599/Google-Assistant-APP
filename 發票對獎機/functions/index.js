'use strict';

// Import the Dialogflow module from the Actions on Google client library.
const {
    dialogflow,
    Suggestions,
    SimpleResponse,
    Button,
    Image,
    BasicCard,
    Carousel,
    items,
    Table
} = require('actions-on-google');

// Import the firebase-functions package for deployment.
const functions = require('firebase-functions');
var getJSON = require('get-json')

// Instantiate the Dialogflow client.
const app = dialogflow({ debug: true });
var row_generator = require('./row_generator'); //生成顯示的彩卷中獎號碼清單
var nzhhk = require("nzh/hk"); //引入繁体中文數字轉換器
const replaceString = require('replace-string');

var response_hint = ["好的", "我知道了", "OK", "沒問題", "收到"];
var response_text = ["以下是詳細資訊", "下面是我找到的對應條目", "對應的資訊如下", "以下是您查閱的資訊", "我找到的對應資訊如下", "對應資訊如下顯示"];

var number_row = ["super", "special", "first", "addition"];
var price_type = require("./price_type.json");
var replace_dict = require("./replace.json");

function random() {
    var temp = String(parseInt(Math.random() * (1000)));
    if (temp.length === 1) { temp = "00" + temp; } else if (temp.length === 2) { temp = "0" + temp; }
    return temp
}

const SelectContexts = {
    START: 'start_redemption',
    END: "end_redemption",
    NOTICE: "notice"
}

app.intent('開始畫面', (conv) => {

    return new Promise(function(resolve, reject) {

        if (conv.user.name.given === undefined) {
            getJSON('https://us-central1-newagent-1-f657d.cloudfunctions.net/data_fetching_backend/tw_invoice?index=all')
                .then(function(response) {
                    resolve(response);
                }).catch(function(error) {
                    reject(error);
                });
        } else {
            resolve("Google測試我是否還活著");
        }

    }).then(function(origin_data) {

        if (conv.screen) {

            conv.ask(new SimpleResponse({
                speech: `<speak><p><s>歡迎使用!</s><s>你可以查看近兩期的發票號碼，或是請我幫你快速對獎</s></p></speak>`,
                text: '歡迎!\n你可以查看近兩期的發票號碼，\n或是請我幫你快速對獎',
            }));
            conv.ask(new Carousel({
                items: {
                    '本期': {
                        synonyms: ['最近的', '這期', '新的'],
                        title: '本期',
                        description: origin_data.new.title,
                    },
                    '上一期': {
                        synonyms: ['上一個', '上期', '舊的'],
                        title: '上一期',
                        description: origin_data.old.title,
                    }
                },
            }));
            conv.ask(new Suggestions('我們開始對獎吧!', '👋 掰掰'));
        } else {

            conv.ask(`<speak><p><s>歡迎使用發票對講機!</s><s>在這裡，我提供最近一期的快速對獎服務</s><s>即${origin_data.new.title}的發票</s><s>現在，請輸入發票後三碼開始比對吧!</s></p></speak>`);
            conv.noInputs = ["你可以開始對獎了呦，請輸入" + origin_data.new.title + "的發票後三碼", "請輸入發票的後三碼", "抱歉，我想我幫不上忙..."];
            conv.contexts.set(SelectContexts.START, 1);

        }

        conv.user.storage.new = origin_data.new;
        conv.user.storage.old = origin_data.old;
        conv.user.storage.islatest = true;

    }).catch(function(error) {
        console.log(error)
        conv.ask(new SimpleResponse({
            speech: `<speak><p><s>糟糕，查詢似乎發生錯誤。請稍後再試。</s></p></speak>`,
            text: '發生錯誤，請稍後再試一次。'
        }));
        conv.close(new BasicCard({
            image: new Image({ url: "https://dummyimage.com/1037x539/ef2121/ffffff.png&text=錯誤", alt: 'Pictures', }),
            title: '數據加載發生問題',
            subtitle: '請過一段時間後再回來查看',
            display: 'CROPPED',
        }));
    });

});

app.intent('選擇期數', (conv, input, option) => {

    if (option === "本期") {
        var index = "new";
        conv.user.storage.islatest = true;
        conv.ask(new Suggestions('查看上一期'));
    } else {
        var index = "old";
        conv.user.storage.islatest = false;
        conv.ask(new Suggestions('查看這一期'));
    }

    var title_output = conv.user.storage[index].title.replace(/[年]+[0]/gm, "年");
    title_output = title_output.replace(/[-]+[0]/gm, "到");
    title_output = title_output.replace(/[年]+[0]/gm, "年");
    title_output = title_output.replace(/[-]/gm, "到");

    var row_show = row_generator.generator(conv.user.storage[index])

    conv.ask(new SimpleResponse({
        speech: `<speak><p><s>${response_hint[parseInt(Math.random() * (response_hint.length))]}，下面是<break time="0.2s"/>${title_output}的開獎號碼</s><s>要兌閱這一期的開獎號碼嗎?</s></p></speak>`,
        text: response_text[parseInt(Math.random() * (response_text.length))],
    }));

    conv.ask(new Table({
        title: conv.user.storage[index].title,
        subtitle: '兌換期限：' + conv.user.storage[index].interval,

        columns: [
            { header: '獎別', align: 'CENTER', },
            { header: '', align: 'CENTER', },
            { header: '', align: 'CENTER', },
        ],
        rows: row_show,
    }));

    conv.ask(new Suggestions('我們開始對獎吧!', '👋 掰掰'));
});

app.intent('檢索期數', (conv, { parameter }) => {

    var suggest_array = [];

    return new Promise(function(resolve, reject) {

        if (conv.user.storage.islatest === undefined) {
            getJSON('https://us-central1-newagent-1-f657d.cloudfunctions.net/data_fetching_backend/tw_invoice?index=all')
                .then(function(response) {
                    resolve(response);
                }).catch(function(error) {
                    reject(error);
                });
        } else {

            if (parameter === "本期") { resolve(conv.user.storage.new) } else { resolve(conv.user.storage.old) }
        }

    }).then(function(origin_data) {

        if (conv.user.storage.islatest === undefined) {
            conv.user.storage.new = origin_data.new;
            conv.user.storage.old = origin_data.old;

            if (parameter === "本期") {
                origin_data = conv.user.storage.new;
            } else {
                origin_data = conv.user.storage.old;
            }
        }

        var title_output = origin_data.title.replace(/[年]+[0]/gm, "年");
        title_output = title_output.replace(/[-]+[0]/gm, "到");
        title_output = title_output.replace(/[年]+[0]/gm, "年");
        title_output = title_output.replace(/[-]/gm, "到");

        var row_show = row_generator.generator(origin_data)

        conv.ask(new SimpleResponse({
            speech: `<speak><p><s>${response_hint[parseInt(Math.random() * (response_hint.length))]}，下面是<break time="0.2s"/>${title_output}的開獎號碼</s><s>領獎期限是${ origin_data.interval}</s></p></speak>`,
            text: response_text[parseInt(Math.random() * (response_text.length))],
        }));

        conv.ask(new Table({
            title: origin_data.title,
            subtitle: '兌換期限：' + origin_data.interval,

            columns: [
                { header: '獎別', align: 'CENTER', },
                { header: '', align: 'CENTER', },
                { header: '', align: 'CENTER', },
            ],
            rows: row_show,
        }));

        if (parameter === "本期") {
            conv.user.storage.islatest = true;
            suggest_array.push('查看上一期');
        } else {
            conv.user.storage.islatest = false;
            suggest_array.push('查看這一期');
        }

        conv.ask(new Suggestions(suggest_array.concat(['我們開始對獎吧!', '👋 掰掰 '])));

    }).catch(function(error) {
        console.log(error)
        conv.ask(new SimpleResponse({
            speech: `<speak><p><s>糟糕，查詢似乎發生錯誤。請稍後再試。</s></p></speak>`,
            text: '發生錯誤，請稍後再試一次。'
        }));
        conv.close(new BasicCard({
            image: new Image({ url: "https://dummyimage.com/1037x539/ef2121/ffffff.png&text=錯誤", alt: 'Pictures', }),
            title: '數據加載發生問題',
            subtitle: '請過一段時間後再回來查看',
            text: String(error),
            display: 'CROPPED',
        }));
    });
});

app.intent('開始兌獎', (conv) => {

    return new Promise(function(resolve, reject) {

        if (conv.user.storage.islatest === undefined) {
            getJSON('https://us-central1-newagent-1-f657d.cloudfunctions.net/data_fetching_backend/tw_invoice?index=all')
                .then(function(response) {
                    resolve(response);
                }).catch(function(error) {
                    reject(error);
                });
        } else {
            if (conv.user.storage.islatest === true) {
                resolve(conv.user.storage.new)
            } else {
                resolve(conv.user.storage.old)
            }
        }

    }).then(function(origin_data) {

        if (conv.user.storage.islatest === undefined) {
            conv.user.storage.new = origin_data.new;
            conv.user.storage.old = origin_data.old;
            conv.user.storage.index = origin_data.new.title;
            conv.user.storage.interval = origin_data.new.interval;
            conv.user.storage.islatest = true;
        } else {
            conv.user.storage.index = origin_data.title;
            conv.user.storage.interval = origin_data.interval;
        }

        conv.contexts.set(SelectContexts.START, 1);

        var title_output = conv.user.storage.index.replace(/[年]+[0]/gm, "年");
        title_output = title_output.replace(/[-]+[0]/gm, "到");
        title_output = title_output.replace(/[年]+[0]/gm, "年");
        title_output = title_output.replace(/[-]/gm, "到");

        conv.ask(new SimpleResponse({
            speech: `<speak><p><s>我知道了，我們現在要開始兌<break time="0.2s"/>${title_output}的發票。</s><s>請輸入發票後三碼來讓我幫你比對。</s></p></speak>`,
            text: 'OK，我們開始對獎吧!',
        }));

        conv.ask(new BasicCard({
            title: '您選擇：' + conv.user.storage.index,
            subtitle: '兌換期限：' + conv.user.storage.interval,
            text: '請輸入發票後三碼讓我幫你兌獎!',
        }));

        conv.ask(new Suggestions(random(), random(), random()));
        conv.ask(new Suggestions('注意事項', '結束對獎'));

        conv.contexts.set(SelectContexts.START, 1);
        conv.contexts.set(SelectContexts.END, 1);
        conv.contexts.set(SelectContexts.NOTICE, 1);

    }).catch(function(error) {
        console.log(error)
        conv.ask(new SimpleResponse({
            speech: `<speak><p><s>糟糕，查詢似乎發生錯誤。請稍後再試。</s></p></speak>`,
            text: '發生錯誤，請稍後再試一次。'
        }));
        conv.close(new BasicCard({
            image: new Image({ url: "https://dummyimage.com/1037x539/ef2121/ffffff.png&text=錯誤", alt: 'Pictures', }),
            title: '數據加載發生問題',
            subtitle: '請過一段時間後再回來查看',
            display: 'CROPPED',
        }));
    });

});

app.intent('注意事項', (conv) => {


    conv.ask(new SimpleResponse({
        speech: `<speak><p><s>中獎人請於領獎期間${conv.user.storage.interval}攜帶。</s><s>國民身分證以及中獎統一發票到代發獎金單位公告之營業時間臨櫃兌領。</s><s>詳細資料請前往財政部網站觀看</s></p></speak>`,
        text: '下面是兌獎時的注意事項',
    }));
    conv.ask(new BasicCard({
        title: conv.user.storage.index + '兌獎注意事項',
        subtitle: '領獎期限：' + conv.user.storage.interval,
        text: '1.中獎人請於領獎期間攜帶：  \n • 國民身分證  \n   (護照、居留證或入出境許可證等)  \n • 中獎統一發票  \n2.依代發獎金單位公告之營業時間臨櫃兌領  \n3.逾期不得領獎。  \n4.發票未依規定載明金額者，不得領獎。  \n5.按最高中獎獎別限領1個獎金。  \n6.詳細規定請查閱「統一發票給獎辦法」。',
        buttons: new Button({
            title: '財政部稅務入口網',
            url: 'http://invoice.etax.nat.gov.tw/',
        }),
    }));

    conv.ask(new Suggestions(random(), random(), random(), random()));
    conv.ask(new Suggestions('結束對獎'));
    conv.contexts.set(SelectContexts.START, 1);
    conv.contexts.set(SelectContexts.END, 1);

});

app.intent('輸入數字', (conv, { any }) => {

    if (conv.user.storage.islatest === true) {
        var comapre_list = conv.user.storage.new;
    } else {
        var comapre_list = conv.user.storage.old;
    }

    any = any.replace(/\s+/g, ''); //消除輸入字串中的空格
    var replace_index = Object.keys(replace_dict);
    for (var i = 0; i < replace_index.length; i++) {
        any = replaceString(any, replace_index[i], replace_dict[replace_index[i]]);
    }

    var number = parseInt(any);
    var answer_input = false;
    if (isNaN(number) === true) { number = nzhhk.decodeS(any); if (number !== 0) { answer_input = true; } } else { answer_input = true; }

    if (answer_input === true) {

        number = (number % 1000).toString();
        if (number.length === 1) { number = "00" + number; } else if (number.length === 2) { number = "0" + number; }

        var type = "";
        var the_number = "";

        for (var i = 0; i < number_row.length; i++) {
            var temp = comapre_list[number_row[i]];
            for (var j = 0; j < temp.length; j++) {
                var compare_number = temp[j];

                if (compare_number.length > 3) { var last_three = compare_number.substr(5, 3) } else { var last_three = compare_number }

                if (last_three === number) {
                    type = number_row[i];
                    the_number = compare_number;
                }
            }
        }

        if (type.length === 0) {

            var fail_array = [
                "沒有中獎喔!", "再接再厲!", "下一張", "沒仲"
            ];

            var temp = fail_array[parseInt(Math.random() * (fail_array.length))];
            conv.ask(new SimpleResponse({ speech: `<speak><p><s>${temp}</s></p></speak>`, text: temp.replace("仲", "中") }));

            var output = {
                title: "沒有中獎",
                subtitle: comapre_list.title,
                columns: require('./price_column.json')["else"],
            }

            var the_number_list = [{ cells: ['‒', '‒', '‒', '‒', '‒'].concat(number.split("")), dividerAfter: false, }];
            the_number_list.push({ cells: require('./price_rows.json')["else"], dividerAfter: false, });
            output.rows = the_number_list;

            conv.ask(new Table(output));

        } else {

            if (["super", "special", "first"].indexOf(type) !== -1) {
                conv.ask(new SimpleResponse({
                    speech: `<speak><p><s>快對看看前面數字，你可能仲<break time="0.1s"/>${price_type[type]}了!</s></p></speak>`,
                    text: '你有可能中「' + price_type[type] + '」了!',
                }));
                var the_number_list = [{ cells: the_number.split(""), dividerAfter: false, }];

            } else {
                conv.ask('恭喜你賺到200元零用金啦!');
                var the_number_list = [{ cells: ['‒', '‒', '‒', '‒', '‒'].concat(the_number.split("")), dividerAfter: false, }];
            }

            if (!conv.screen) {
                conv.ask(`<speak><p><s>我將唸出完整號碼，麻煩你進行比對。<break time="0.5s"/><prosody rate="slow" pitch="-2st"><say-as interpret-as="characters">${the_number.split("")}</say-as></prosody></s></p></speak>`);
            }

            var output = {
                title: "《" + price_type[type] + "》",
                subtitle: comapre_list.title + "\n領獎期限:" + comapre_list.interval,
                columns: require('./price_column.json')[type],
            }

            the_number_list.push({ cells: require('./price_rows.json')[type], dividerAfter: false, })
            output.rows = the_number_list;
            conv.ask(new Table(output));
        }

        conv.noInputs = ["請輸入" + comapre_list.title + "的發票後三碼", "請輸入發票的後三碼來進行比對", "抱歉，我想我幫不上忙..."];
        conv.ask(new Suggestions(random(), random(), random()));
        conv.ask(new Suggestions('注意事項', '結束對獎'));
        conv.contexts.set(SelectContexts.START, 1);
        conv.contexts.set(SelectContexts.END, 1);
        conv.contexts.set(SelectContexts.NOTICE, 1);

    } else {

        conv.noInputs = ["請輸入" + comapre_list.title + "的發票後三碼", "請輸入發票的後三碼來進行比對", "抱歉，我想我幫不上忙..."];

        conv.contexts.set(SelectContexts.START, 1);
        conv.contexts.set(SelectContexts.END, 1);
        conv.contexts.set(SelectContexts.NOTICE, 1);

        var confuse_array = [
            "抱歉，我沒聽清楚!", "這好像不是數字? 請再試一次", "我剛剛恍神了，再說一次好嗎?", "不好意思，只能輸入數字喔!"
        ];

        conv.ask(new SimpleResponse({
            speech: `<speak><p><s>${confuse_array[parseInt(Math.random() * (confuse_array.length))]}</s></p></speak>`,
            text: '請確認輸入是否有誤，再重新輸入呦!',
        }));

        if (conv.screen) {
            conv.ask(new BasicCard({
                title: '請輸入數字!',
                text: '正在比對的期數：' + comapre_list.title,
            }));
            conv.ask(new Suggestions(random(), random(), random()));
            conv.ask(new Suggestions('注意事項', '結束對獎'));
        } else {
            conv.ask(`<speak><p><s>如果想結束我們的對話，請說<break time="0.5s"/>結束對獎</s></p></speak>`);
        }
    }
});

app.intent('結束兌獎', (conv) => {

    if (conv.screen) {
        conv.contexts.delete(SelectContexts.START, 1)
        var temp = response_hint[parseInt(Math.random() * (response_hint.length))];
        conv.ask(new SimpleResponse({
            speech: `<speak><p><s>${temp}，已關閉對獎模式</s><s>請問還有甚麼需要我幫忙的嗎?。</s></p></speak>`,
            text: temp + '，已經關閉對獎模式!\n還需要什麼服務嗎?',
        }));
        conv.ask(new Carousel({
            items: {
                '本期': {
                    synonyms: ['最近的', '這期', '新的'],
                    title: '本期',
                    description: conv.user.storage.new.title,
                },
                '上一期': {
                    synonyms: ['上一個', '上期', '舊的'],
                    title: '上一期',
                    description: conv.user.storage.old.title,
                }
            },
        }));
        conv.ask(new Suggestions('開始兌獎', '👋 掰掰'));
    } else {
        conv.close(`<speak><p><s>希望能幫上一點忙，下次見!</s></p></speak>`);
    }

});

app.intent('預設罐頭回覆', (conv) => {

    conv.ask(new SimpleResponse({
        speech: `<speak><p><s>不好意思</s><s>我不懂你的意思，請問需要我幫你做甚麼呢?</s></p></speak>`,
        text: '抱歉，我不懂你的意思。\n請點選下方卡片查看近期的開獎號碼，\n或是請我幫你快速兌獎!',
    }));
    conv.ask(new Carousel({
        items: {
            '本期': {
                synonyms: ['最近的', '這期', '新的'],
                title: '本期',
                description: conv.user.storage.new.title,
            },
            '上一期': {
                synonyms: ['上一個', '上期', '舊的'],
                title: '上一期',
                description: conv.user.storage.old.title,
            }
        },
    }));
    conv.ask(new Suggestions('我們開始對獎吧!', '👋 掰掰'));

});

app.intent('結束對話', (conv) => {
    conv.user.storage = {}; //離開同時清除暫存資料
    conv.ask('希望能幫到一點忙!');
    conv.ask(new SimpleResponse({ speech: '下次見', text: '下次見 👋', }));
    conv.close(new BasicCard({
        title: '感謝您的使用!',
        text: '如果有任何需要改進的地方，  \n歡迎到簡介頁面評分或給予反饋，謝謝!',
        buttons: new Button({ title: '開啟本程式的商店頁面', url: 'https://assistant.google.com/services/a/uid/000000f3dc6153fc', }),
    }));

});


exports.Invoice_redemptioner = functions.https.onRequest(app);