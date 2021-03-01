'use strict';

// Import the Dialogflow module from the Actions on Google client library.
const {
    dialogflow,
    Suggestions,
    SimpleResponse,
    Button,
    Image,
    BasicCard
} = require('actions-on-google');

// Import the firebase-functions package for deployment.
const functions = require('firebase-functions');

// Instantiate the Dialogflow client.
const app = dialogflow({ debug: true });
var question_list = require('./question_list.json'); //引用外部函數來輸入國旗答案與解釋

var Total_Count = 0; //統計已答題的總個數
var Correct_Count = 0; //統計答題正確個數
var Wrong_Count = 0; //統計答題錯誤個數
var heart_count = 3; //你的血量數
var heart = ''; //你的血量(圖示化表示)
var Question_Title = '';
var Hint = '';
var Answer = '';

var fail_sound = 'https://raw.githubusercontent.com/hank199599/Google-Assistant-APP/master/audio/%E5%A4%B1%E6%95%97%E9%9F%B3%E6%95%88.mp3';
var calculate_sound = "https://raw.githubusercontent.com/hank199599/Google-Assistant-APP/master/audio/%E8%A8%88%E7%AE%97%E9%9F%B3%E6%A0%A1.mp3";

var retry_count = 0;
var hinted = false;
var output_array = "";
var try_figure = "";
var Q_Total = 514; //題目總數
var Q = 0; //提取題目編號
var Q_list = new Array([]); //儲存題目編號
var pass_question = false; //判別是否已答完題目
var CardTitle = '';
var Audio = "";
var CardsubTitle = '';
var Prograss = 0; //計算百分比的參數
var charactor = 0; //提示答案的字元有幾個
var roundDecimal = function(val, precision) { //進行四捨五入的函式呼叫
    return Math.round(Math.round(val * Math.pow(10, (precision || 0) + 1)) / 10) / Math.pow(10, (precision || 0));
};

function ranFun() { return parseInt(Math.random() * Q_Total); }

var menu = false; //判別是否在歡迎頁面
var end_game = false; //判別遊戲是否已結束
var question_output = false; //判別是否拿到出題目許可
var answer_input = false; //判別是否輸入許可的答案
var next_question = false; //判別是否輸入許可的答案

var theArray = new Array([]); //宣告陣列，隨機挑選開始畫面圖片
theArray[0] = "https://raw.githubusercontent.com/hank199599/Google-Assistant-APP/master/%E7%87%88%E8%AC%8E%E5%A4%A7%E5%B8%AB/assets/oBhfSML.jpg";
theArray[1] = "https://raw.githubusercontent.com/hank199599/Google-Assistant-APP/master/%E7%87%88%E8%AC%8E%E5%A4%A7%E5%B8%AB/assets/fYURNI2.png";
theArray[2] = "https://raw.githubusercontent.com/hank199599/Google-Assistant-APP/master/%E7%87%88%E8%AC%8E%E5%A4%A7%E5%B8%AB/assets/nn0j7oV.jpg";
theArray[3] = "https://raw.githubusercontent.com/hank199599/Google-Assistant-APP/master/%E7%87%88%E8%AC%8E%E5%A4%A7%E5%B8%AB/assets/DQsRg0a.png";

function ranFun() { return parseInt(Math.random() * 3); }
var Picture_url = '';

//歡迎畫面
app.intent('預設歡迎語句', (conv) => {
    menu = true;
    question_output = false;
    answer_input = false;
    end_game = false;
    next_question = false;
    Q = 0;
    Q_list = [];
    Total_Count = 0;
    Correct_Count = 0;
    Wrong_Count = 0;
    heart_count = 3;
    hinted = false;
    retry_count = 0;
    Picture_url = theArray[ranFun()];
    if (conv.screen) {

        if (conv.user.last.seen) {
            conv.ask(new SimpleResponse({
                speech: `<speak><prosody volume="loud"><p><s>歡迎遊玩燈謎大師!</s><s>準備好就說聲「開始遊戲」接受挑戰八!</s></p></prosody></speak>`,
                text: '歡迎回來!',
            }));
        } else {
            conv.ask(new SimpleResponse({
                speech: `<speak><prosody volume="loud"><p><s>歡迎遊玩燈謎大師!</s><s>本服務內含有數百題的謎語，若你的錯誤次數超過3次，遊戲就結束!</s><s>準備好就說聲「開始遊戲」接受挑戰八!</s></p></prosody></speak>`,
                text: '歡迎使用「燈謎大師」!',
            }));
        }

        conv.ask(new BasicCard({
            image: new Image({ url: Picture_url, alt: 'Pictures', }),
            title: '準備好迎接謎語轟炸了嗎?',
            subtitle: '本服務內含有數百題的燈謎!  \n每題皆有三次機會，第三次仍錯就扣血。  \n若扣到三滴血都沒，遊戲就結束!  \n準備好就按下「開始遊戲」接受挑戰吧!',
            text: '圖片來源：Pixabay CC0:公共領域授權 ',
        }));
        conv.ask(new Suggestions('🎮 開始遊戲', '👋 掰掰'));
    } else {
        conv.ask(`<speak><prosody volume="loud"><p><s>歡迎遊玩燈謎大師!</s><s>每一個題目你都有三次答題機會，你可以隨時要求我跳過題目或給予答案的字數提示!</s><s>準備好了嗎!<break time="1s"/></s></p></prosody></speak>`);
        menu = false;
        question_output = false;
        answer_input = true;
        end_game = false;
        next_question = true;
        hinted = false;

        //開始挑選題目
        retry_count = 0;
        Total_Count++;

        for (Q = parseInt(Math.random() * Q_Total); Q_list.indexOf(Q) !== -1; Q = (Q + 1) % (Q_Total + 1))
            Q_list.push(Q); // 將現在選出的編號存入陣列

        output_array = question_list[Q];
        Question_Title = output_array[0]; //選出這次的題目標題
        Hint = output_array[1]; //取得本題目的提示
        Answer = output_array[2]; //取得本題目的正確答案
        charactor = output_array[2].length; //取得本題目答案之字元數
        Audio = output_array[3]; //取得本題目答案之語音網址

        if (Audio.length !== 0) {
            conv.noInputs = [new SimpleResponse(`<speak>快想看看答案是什麼，題目是<audio src="${Audio}"/></speak>`), "抱歉，你的答案是什麼?", "我想我們先進行到這裡吧，下次見!"];
            conv.ask(new SimpleResponse({ speech: `<speak>第${Total_Count}題<break time="0.2s"/><audio src="${Audio}"/><break time="0.5s"/>給個提示<break time="0.2s"/>${Hint}</speak>`, text: '熱騰騰的謎題來啦!' }));
        } else {
            conv.noInputs = ["快想看看答案是什麼，題目是" + Question_Title, "抱歉，你的答案是什麼?", "我想我們先進行到這裡吧，下次見!"];
            conv.ask(new SimpleResponse({ speech: `<speak>第${Total_Count}題<break time="0.2s"/>${Question_Title}<break time="0.5s"/>給個提示<break time="0.2s"/>${Hint}</speak>`, text: '熱騰騰的謎題來啦!' }));
        }
    }

    conv.user.storage.Total_Count = Total_Count;
    conv.user.storage.Correct_Count = Correct_Count;
    conv.user.storage.Wrong_Count = Wrong_Count;
    conv.user.storage.heart_count = heart_count;
    conv.user.storage.retry_count = retry_count;
    conv.user.storage.Q_list = Q_list;
    conv.user.storage.Question_Title = Question_Title;
    conv.user.storage.Hint = Hint;
    conv.user.storage.Answer = Answer;
    conv.user.storage.Audio = Audio;
    conv.user.storage.charactor = charactor;
    conv.user.storage.menu = menu;
    conv.user.storage.end_game = end_game;
    conv.user.storage.question_output = question_output;
    conv.user.storage.answer_input = answer_input;
    conv.user.storage.next_question = next_question;
    conv.user.storage.hinted = hinted;

});

app.intent('問題挑選器', (conv, { input }) => {
    //導入參數
    Total_Count = conv.user.storage.Total_Count;
    Correct_Count = conv.user.storage.Correct_Count;
    Wrong_Count = conv.user.storage.Wrong_Count;
    heart_count = conv.user.storage.heart_count;
    retry_count = conv.user.storage.retry_count;
    Audio = conv.user.storage.Audio;
    Q_list = conv.user.storage.Q_list;
    Question_Title = conv.user.storage.Question_Title;
    Hint = conv.user.storage.Hint;
    Answer = conv.user.storage.Answer;
    charactor = conv.user.storage.charactor;
    menu = conv.user.storage.menu;
    end_game = conv.user.storage.end_game;
    question_output = conv.user.storage.question_output;
    answer_input = conv.user.storage.answer_input;
    next_question = conv.user.storage.next_question;
    hinted = conv.user.storage.hinted;

    if (input === '開始遊戲') {
        menu = true;
        question_output = false;
        answer_input = false;
        end_game = false;
        next_question = false;
        heart_count = 3;
        Total_Count = 0;
        Correct_Count = 0;
        Wrong_Count = 0;
        hinted = false;
        Q_list = [];
    }

    //「開始遊戲」啟動詞判斷
    if (menu === true && question_output === false && answer_input === false && end_game === false && next_question === false) {
        menu = false;
        question_output = true;
        answer_input = false;
        end_game = false;
        next_question = false;
    }
    //「下一題」啟動詞判斷
    else if (menu === false && question_output === true && answer_input === false && end_game === false && next_question === true) {
        menu = false;
        question_output = true;
        answer_input = false;
        end_game = false;
        next_question = false;
    }

    //進入結算頁面判斷
    else if (menu === false && question_output === false && answer_input === true && end_game === true && next_question === false) {
        menu = true;
        question_output = false;
        answer_input = false;
        end_game = true;
        next_question = false;
    }
    //結算畫面防呆判斷

    if (menu === false && question_output === true && answer_input === false && end_game === false && next_question === false) {
        menu = false;
        question_output = false;
        answer_input = true;
        end_game = false;
        next_question = true;
        hinted = false;

        //開始挑選題目
        retry_count = 0;
        Total_Count++;
        if (heart_count == 3) { heart = '⚫⚫⚫'; } else if (heart_count == 2) { heart = '⚫⚫'; } else if (heart_count == 1) { heart = '⚫'; }
        if (retry_count == 1) { try_figure = '☆'; } else if (retry_count == 2) { try_figure = '☆☆'; } else if (retry_count == 3) { try_figure = '☆☆☆'; } else { try_figure = ''; }

        for (Q = parseInt(Math.random() * Q_Total); Q_list.indexOf(Q) !== -1; Q = (Q + 1) % (Q_Total + 1))
            Q_list.push(Q); // 將現在選出的編號存入陣列

        output_array = question_list[Q];
        Question_Title = output_array[0]; //選出這次的題目標題
        Hint = output_array[1]; //取得本題目的提示
        Answer = output_array[2]; //取得本題目的正確答案
        charactor = output_array[2].length; //取得本題目答案之字元數
        Audio = output_array[3]; //取得本題目答案之語音網址

        if (Audio.length !== 0) {
            conv.noInputs = [new SimpleResponse(`<speak>快想看看答案是什麼，題目是<audio src="${Audio}"/></speak>`), "抱歉，你的答案是什麼?", "我想我們先進行到這裡吧，下次見!"];
            conv.ask(new SimpleResponse({ speech: `<speak>第${Total_Count}題<break time="0.2s"/><audio src="${Audio}"/><break time="0.5s"/>給個提示<break time="0.2s"/>${Hint}</speak>`, text: '熱騰騰的謎題來啦!' }));
        } else {
            conv.noInputs = ["快想看看答案是什麼，題目是" + Question_Title, "抱歉，你的答案是什麼?", "我想我們先進行到這裡吧，下次見!"];
            conv.ask(new SimpleResponse({ speech: `<speak>第${Total_Count}題<break time="0.2s"/>${Question_Title}<break time="0.5s"/>給個提示<break time="0.2s"/>${Hint}</speak>`, text: '熱騰騰的謎題來啦!' }));
        }

        conv.ask(new BasicCard({
            title: Total_Count + '.  \n' + Question_Title,
            subtitle: '提示:' + Hint + '  \n\n每一題你都有三次答題機會，  \n你隨時都能跳過題目，但等同直接答錯題目!',
            text: '血量條 ' + heart + ' • 本題嘗試次數 ' + try_figure,
        }));

        if (heart_count > 1) { conv.ask(new Suggestions('跳過這一題')); } else { conv.ask(new Suggestions('放棄作答')); }

        conv.ask(new Suggestions('提示字數'));
    } else if (menu === false && question_output === false && answer_input === true && end_game === false && next_question === true) {

        if (input.indexOf(Answer) !== -1 && heart_count >= 1) {
            Correct_Count++;
            retry_count++;
            hinted = false;
            menu = false;
            question_output = true;
            answer_input = false;
            end_game = false;
            next_question = true;
            if (heart_count == 3) { heart = '⚫⚫⚫'; } else if (heart_count == 2) { heart = '⚫⚫'; } else if (heart_count == 1) { heart = '⚫'; } else { heart = '─'; }
            if (retry_count == 1) { try_figure = '☆'; } else if (retry_count == 2) { try_figure = '☆☆'; } else if (retry_count == 3) { try_figure = '☆☆☆'; } else { try_figure = ''; }
            conv.ask('恭喜你答對拉!');

            if (conv.screen) {
                conv.ask(new BasicCard({
                    title: '正解為「' + Answer + '」',
                    subtitle: '\n《原始題目》\n' + Question_Title,
                    text: '第' + Total_Count + '題 • 血量條 ' + heart + ' • 本題嘗試次數 ' + try_figure,
                }));
                conv.ask(new Suggestions('    下一題    '));
            } else {

                menu = false;
                question_output = false;
                answer_input = true;
                end_game = false;
                next_question = true;
                hinted = false;

                //開始挑選題目
                retry_count = 0;
                Total_Count++;

                for (Q = parseInt(Math.random() * Q_Total); Q_list.indexOf(Q) !== -1; Q = (Q + 1) % (Q_Total + 1))
                    Q_list.push(Q); // 將現在選出的編號存入陣列

                output_array = question_list[Q];
                Question_Title = output_array[0]; //選出這次的題目標題
                Hint = output_array[1]; //取得本題目的提示
                Answer = output_array[2]; //取得本題目的正確答案
                charactor = output_array[2].length; //取得本題目答案之字元數
                Audio = output_array[3]; //取得本題目答案之語音網址

                if (Audio.length !== 0) {
                    conv.noInputs = [new SimpleResponse(`<speak>快想看看答案是什麼，題目是<audio src="${Audio}"/></speak>`), "抱歉，你的答案是什麼?", "我想我們先進行到這裡吧，下次見!"];
                    conv.ask(new SimpleResponse({ speech: `<speak>第${Total_Count}題<break time="0.2s"/><audio src="${Audio}"/><break time="0.5s"/>給個提示<break time="0.2s"/>${Hint}</speak>`, text: '熱騰騰的謎題來啦!' }));
                } else {
                    conv.noInputs = ["快想看看答案是什麼，題目是" + Question_Title, "抱歉，你的答案是什麼?", "我想我們先進行到這裡吧，下次見!"];
                    conv.ask(new SimpleResponse({ speech: `<speak>第${Total_Count}題<break time="0.2s"/>${Question_Title}<break time="0.5s"/>給個提示<break time="0.2s"/>${Hint}</speak>`, text: '熱騰騰的謎題來啦!' }));
                }
            }
        } else if (input.indexOf(Answer) === -1 && heart_count >= 1) {

            retry_count++;

            if (retry_count <= 3) {

                if (retry_count <= 2) {
                    conv.ask(new Suggestions('放棄作答'));
                    CardTitle = Total_Count + '.  \n' + Question_Title;

                    if (hinted === false) {
                        CardsubTitle = '提示:' + Hint;
                        conv.ask(new Suggestions('提示字數'));
                    } else {
                        CardsubTitle = '提示:' + Hint + '  \n答案字數：' + charactor;
                    }
                    conv.ask(new SimpleResponse({ speech: `<speak><emphasis level="strong">再想看看</emphasis><break time="0.1s"/><emphasis level="moderate">你會找到答案的!</emphasis></speak>`, text: '再加把勁!' }));

                    if (!conv.screen) {
                        if (Audio.length !== 0) {
                            conv.noInputs = [new SimpleResponse(`<speak>快想看看答案是什麼，題目是<audio src="${Audio}"/></speak>`), "抱歉，你的答案是什麼?", "我想我們先進行到這裡吧，下次見!"];
                            conv.ask(new SimpleResponse(`<speak>題目是<break time="0.5s"/><audio src="${Audio}"/><break time="0.5s"/>給個提示<break time="0.2s"/>${Hint}</speak>`));
                        } else {
                            conv.noInputs = ["快想看看答案是什麼，題目是" + Question_Title, "抱歉，你的答案是什麼?", "我想我們先進行到這裡吧，下次見!"];
                            conv.ask(new SimpleResponse(`<speak>題目是<break time="0.5s"/>${Question_Title}<break time="0.5s"/>給個提示<break time="0.2s"/>${Hint}</speak>`));
                        }
                    }
                } else if (retry_count === 3) {
                    Wrong_Count++;
                    heart_count--;
                    menu = false;
                    question_output = true;
                    answer_input = false;
                    end_game = false;
                    next_question = false;
                    hinted = false;
                    CardTitle = '正確答案是：「' + Answer + '」';
                    CardsubTitle = '\n《原始題目》\n' + Question_Title;
                    if (heart_count === 0) {
                        menu = false;
                        question_output = false;
                        answer_input = true;
                        end_game = true;
                        next_question = false;
                        conv.ask(new SimpleResponse({ speech: `<speak><audio src="${fail_sound}"/>回合結束!這題正確答案為<break time="0.1s"/>${Answer}</speak>`, text: '別氣餒，下次再加油!' }));
                        if (conv.screen) { conv.ask(new Suggestions('休息，是為了走更長遠的路')); } else {
                            conv.close(new SimpleResponse(`<speak><audio src="${calculate_sound}"/><prosody volume="loud"><p><s>根據Google神通廣大的雲端計算!</s><s>你在這回合一共進行<break time="0.05s"/>${Total_Count}<break time="0.03s"/>題題目。</s><s>希望你玩得愉快，下次見</s></p></prosody></speak>`));
                        }
                        conv.user.storage = {}; //離開同時清除暫存資料
                    } else {
                        conv.ask(new SimpleResponse({ speech: `<speak>答錯啦!這題答案是<break time="0.1s"/>${Answer}</speak>`, text: '別氣餒，下一題會答對的!' }));
                        if (conv.screen) { conv.ask(new Suggestions('    下一題    ')); } else {
                            menu = false;
                            question_output = false;
                            answer_input = true;
                            end_game = false;
                            next_question = true;
                            hinted = false;

                            //開始挑選題目
                            retry_count = 0;
                            Total_Count++;

                            for (Q = parseInt(Math.random() * Q_Total); Q_list.indexOf(Q) !== -1; Q = (Q + 1) % (Q_Total + 1))
                                Q_list.push(Q); // 將現在選出的編號存入陣列

                            output_array = question_list[Q];
                            Question_Title = output_array[0]; //選出這次的題目標題
                            Hint = output_array[1]; //取得本題目的提示
                            Answer = output_array[2]; //取得本題目的正確答案
                            charactor = output_array[2].length; //取得本題目答案之字元數
                            Audio = output_array[3]; //取得本題目答案之語音網址

                            if (Audio.length !== 0) {
                                conv.noInputs = [new SimpleResponse(`<speak>快想看看答案是什麼，題目是<audio src="${Audio}"/></speak>`), "抱歉，你的答案是什麼?", "我想我們先進行到這裡吧，下次見!"];
                                conv.ask(new SimpleResponse({ speech: `<speak>第${Total_Count}題<break time="0.2s"/><audio src="${Audio}"/><break time="0.5s"/>給個提示<break time="0.2s"/>${Hint}</speak>`, text: '熱騰騰的謎題來啦!' }));
                            } else {
                                conv.noInputs = ["快想看看答案是什麼，題目是" + Question_Title, "抱歉，你的答案是什麼?", "我想我們先進行到這裡吧，下次見!"];
                                conv.ask(new SimpleResponse({ speech: `<speak>第${Total_Count}題<break time="0.2s"/>${Question_Title}<break time="0.5s"/>給個提示<break time="0.2s"/>${Hint}</speak>`, text: '熱騰騰的謎題來啦!' }));
                            }
                        }
                    }
                }
                if (conv.screen) {
                    if (heart_count == 3) { heart = '⚫⚫⚫'; } else if (heart_count == 2) { heart = '⚫⚫'; } else if (heart_count == 1) { heart = '⚫'; } else { heart = '─'; }
                    if (retry_count == 1) { try_figure = '☆'; } else if (retry_count == 2) { try_figure = '☆☆'; } else if (retry_count == 3) { try_figure = '☆☆☆'; } else { try_figure = ''; }

                    conv.ask(new BasicCard({
                        title: CardTitle,
                        subtitle: CardsubTitle,
                        text: '血量條 ' + heart + ' • 本題嘗試次數 ' + try_figure,
                    }));
                }
            }
        }
    } else if (menu === true && question_output === false && answer_input === false && end_game === true && next_question === false) {
        menu = false;
        question_output = false;
        answer_input = false;
        end_game = true;
        next_question = false;
        Prograss = (Total_Count / Q_Total) * 100;
        Prograss = roundDecimal(Prograss, 1);
        conv.ask(new SimpleResponse({ speech: `<speak><audio src="${calculate_sound}"/><prosody volume="loud"><p><s>根據Google神通廣大的雲端計算!</s><s>你在這回合一共進行<break time="0.05s"/>${Total_Count}<break time="0.03s"/>題題目。</s><s>你要再試一次嗎?</s></p></prosody></speak>`, text: '驗收成果' }));
        conv.ask(new BasicCard({
            image: new Image({ url: 'https://raw.githubusercontent.com/hank199599/Google-Assistant-APP/master/%E7%87%88%E8%AC%8E%E5%A4%A7%E5%B8%AB/assets/VyWzbJB.png', alt: 'Pictures', }),
            title: '本回合共進行:' + Total_Count + '個謎題  \n(' + '約為總謎題的' + Prograss + '%)',
            subtitle: '答對數：' + Correct_Count + '  \n錯誤數：' + Wrong_Count,
        }));
        conv.ask(new Suggestions('🎮 重新開始', '👋 掰掰'));
        heart_count = 3;
        Total_Count = 0;
        Correct_Count = 0;
        Wrong_Count = 0;

    } else if (menu === false && end_game === true && question_output === false && answer_input === false && next_question === false) {
        conv.ask(new SimpleResponse({ speech: '請對我說、重新開始、或、掰掰、進行相關操作!', text: '請重新輸入，謝謝!' }));
        conv.ask(new Suggestions('🎮 重新開始', '👋 掰掰'));
    } else {
        conv.ask(new SimpleResponse({
            speech: "本服務需要您進一步進行設定才能繼續進行，請依照下述步驟開啟「網路與應用程式」功能。才能獲得個人化體驗喔!",
            text: '請進行相關設定，才能進行遊戲!',
        }));
        conv.close(new BasicCard({
            title: '請開啟「網路和應用程式活動」功能',
            subtitle: '為了給您個人化的遊戲體驗，\n請點擊下方按鈕前往Google帳戶設定，\n開啟「包括 Chrome 瀏覽記錄以及採用 Google 服務的網站、應用程式和裝置中的活動記錄」\n我即可為你帶來客製化遊戲體驗!',
            buttons: new Button({ title: 'Google活動控制項', url: "https://myaccount.google.com/activitycontrols?pli=1", }),

        }));


    }
    //儲存參數
    conv.user.storage.Total_Count = Total_Count;
    conv.user.storage.Correct_Count = Correct_Count;
    conv.user.storage.Wrong_Count = Wrong_Count;
    conv.user.storage.heart_count = heart_count;
    conv.user.storage.retry_count = retry_count;
    conv.user.storage.Q_list = Q_list;
    conv.user.storage.Question_Title = Question_Title;
    conv.user.storage.Hint = Hint;
    conv.user.storage.Answer = Answer;
    conv.user.storage.Audio = Audio;
    conv.user.storage.charactor = charactor;
    conv.user.storage.menu = menu;
    conv.user.storage.end_game = end_game;
    conv.user.storage.question_output = question_output;
    conv.user.storage.answer_input = answer_input;
    conv.user.storage.next_question = next_question;
    conv.user.storage.hinted = hinted;
});

app.intent('顯示答案', (conv) => {
    //導入參數
    Total_Count = conv.user.storage.Total_Count;
    Correct_Count = conv.user.storage.Correct_Count;
    Wrong_Count = conv.user.storage.Wrong_Count;
    heart_count = conv.user.storage.heart_count;
    retry_count = conv.user.storage.retry_count;
    Audio = conv.user.storage.Audio;
    Q_list = conv.user.storage.Q_list;
    Question_Title = conv.user.storage.Question_Title;
    Hint = conv.user.storage.Hint;
    Answer = conv.user.storage.Answer;
    charactor = conv.user.storage.charactor;
    menu = conv.user.storage.menu;
    end_game = conv.user.storage.end_game;
    question_output = conv.user.storage.question_output;
    answer_input = conv.user.storage.answer_input;
    next_question = conv.user.storage.next_question;
    hinted = conv.user.storage.hinted;

    if (hinted !== undefined) {

        Wrong_Count++;
        heart_count--;
        hinted = false;
        menu = false;
        question_output = true;
        answer_input = false;
        end_game = false;
        next_question = false;
        if (heart_count === 0) {
            menu = false;
            question_output = false;
            answer_input = true;
            end_game = true;
            next_question = false;

            conv.ask(new SimpleResponse({ speech: `<speak><audio src="${fail_sound}"/>回合結束!這題答案是<break time="0.1s"/>${Answer}</speak>`, text: '公布本題答案' }));

            if (conv.screen) { conv.ask(new Suggestions('休息，是為了走更長遠的路')); } else {
                conv.close(new SimpleResponse(`<speak><audio src="${calculate_sound}"/><prosody volume="loud"><p><s>根據Google神通廣大的雲端計算!</s><s>你在這回合一共進行<break time="0.05s"/>${Total_Count}<break time="0.03s"/>題題目。</s><s>希望你玩得愉快，下次見</s></p></prosody></speak>`));
                conv.user.storage = {}; //離開同時清除暫存資料
            }
        } else {
            pass_question = true;
            conv.ask(new SimpleResponse({ speech: `<speak>這題答案是<break time="0.1s"/>${Answer}</speak>`, text: '公布本題答案' }));
            if (conv.screen) { conv.ask(new Suggestions('    下一題    ')); } else {
                menu = false;
                question_output = false;
                answer_input = true;
                end_game = false;
                next_question = true;
                hinted = false;

                //開始挑選題目
                retry_count = 0;
                Total_Count++;

                for (Q = parseInt(Math.random() * Q_Total); Q_list.indexOf(Q) !== -1; Q = (Q + 1) % (Q_Total + 1))
                    Q_list.push(Q); // 將現在選出的編號存入陣列

                output_array = question_list[Q];
                Question_Title = output_array[0]; //選出這次的題目標題
                Hint = output_array[1]; //取得本題目的提示
                Answer = output_array[2]; //取得本題目的正確答案
                charactor = output_array[2].length; //取得本題目答案之字元數
                Audio = output_array[3]; //取得本題目答案之語音網址

                if (Audio.length !== 0) {
                    conv.noInputs = [new SimpleResponse(`<speak>快想看看答案是什麼，題目是<audio src="${Audio}"/></speak>`), "抱歉，你的答案是什麼?", "我想我們先進行到這裡吧，下次見!"];
                    conv.ask(new SimpleResponse({ speech: `<speak>第${Total_Count}題<break time="0.2s"/><audio src="${Audio}"/><break time="0.5s"/>給個提示<break time="0.2s"/>${Hint}</speak>`, text: '熱騰騰的謎題來啦!' }));
                } else {
                    conv.noInputs = ["快想看看答案是什麼，題目是" + Question_Title, "抱歉，你的答案是什麼?", "我想我們先進行到這裡吧，下次見!"];
                    conv.ask(new SimpleResponse({ speech: `<speak>第${Total_Count}題<break time="0.2s"/>${Question_Title}<break time="0.5s"/>給個提示<break time="0.2s"/>${Hint}</speak>`, text: '熱騰騰的謎題來啦!' }));
                }
            }
        }

        if (conv.screen) {
            if (heart_count == 3) { heart = '⚫⚫⚫'; } else if (heart_count == 2) { heart = '⚫⚫'; } else if (heart_count == 1) { heart = '⚫'; } else { heart = '─'; }
            if (retry_count == 1) { try_figure = '☆'; } else if (retry_count == 2) { try_figure = '☆☆'; } else if (retry_count == 3) { try_figure = '☆☆☆'; } else { try_figure = ''; }

            conv.ask(new BasicCard({
                title: '正解為「' + Answer + '」',
                subtitle: '\n《原始題目》\n' + Question_Title,
                text: '第' + Total_Count + '題 • 血量條 ' + heart + ' • 本題嘗試次數 ' + try_figure,
            }));
        }
    } else {
        conv.ask(new SimpleResponse({
            speech: "本服務需要您進一步進行設定才能繼續進行，請依照下述步驟開啟「網路與應用程式」功能。才能獲得個人化體驗喔!",
            text: '請進行相關設定，才能進行遊戲!',
        }));
        conv.close(new BasicCard({
            title: '請開啟「網路和應用程式活動」功能',
            subtitle: '為了給您個人化的遊戲體驗，\n請點擊下方按鈕前往Google帳戶設定，\n開啟「包括 Chrome 瀏覽記錄以及採用 Google 服務的網站、應用程式和裝置中的活動記錄」\n我即可為你帶來客製化遊戲體驗!',
            buttons: new Button({ title: 'Google活動控制項', url: "https://myaccount.google.com/activitycontrols?pli=1", }),

        }));
    }

    //儲存參數
    conv.user.storage.Total_Count = Total_Count;
    conv.user.storage.Correct_Count = Correct_Count;
    conv.user.storage.Wrong_Count = Wrong_Count;
    conv.user.storage.heart_count = heart_count;
    conv.user.storage.retry_count = retry_count;
    conv.user.storage.Q_list = Q_list;
    conv.user.storage.Question_Title = Question_Title;
    conv.user.storage.Hint = Hint;
    conv.user.storage.Answer = Answer;
    conv.user.storage.Audio = Audio;
    conv.user.storage.charactor = charactor;
    conv.user.storage.menu = menu;
    conv.user.storage.end_game = end_game;
    conv.user.storage.question_output = question_output;
    conv.user.storage.answer_input = answer_input;
    conv.user.storage.next_question = next_question;
    conv.user.storage.hinted = hinted;

});

app.intent('提示字數', (conv) => {
    //導入參數
    Total_Count = conv.user.storage.Total_Count;
    Correct_Count = conv.user.storage.Correct_Count;
    Wrong_Count = conv.user.storage.Wrong_Count;
    heart_count = conv.user.storage.heart_count;
    retry_count = conv.user.storage.retry_count;
    Audio = conv.user.storage.Audio;
    Q_list = conv.user.storage.Q_list;
    Question_Title = conv.user.storage.Question_Title;
    Hint = conv.user.storage.Hint;
    Answer = conv.user.storage.Answer;
    charactor = conv.user.storage.charactor;
    pass_question = conv.user.storage.pass_question;
    menu = conv.user.storage.menu;
    end_game = conv.user.storage.end_game;
    question_output = conv.user.storage.question_output;
    answer_input = conv.user.storage.answer_input;
    next_question = conv.user.storage.next_question;
    hinted = conv.user.storage.hinted;

    if (menu === false && question_output === false && answer_input === true && end_game === false && next_question === true) {
        if (Audio.length !== 0) { conv.noInputs = [new SimpleResponse(`<speak>快想看看答案是什麼，題目是<audio src="${Audio}"/>，有${charactor}個字</speak>`), "抱歉，你的答案是什麼?", "我想我們先進行到這裡吧，下次見!"]; } else { conv.noInputs = ["快想看看答案是什麼，題目是" + Question_Title + "，答案有" + charactor + "個字", "抱歉，你的答案是什麼?", "我想我們先進行到這裡吧，下次見!"]; }

        if (heart_count == 3) { heart = '⚫⚫⚫'; } else if (heart_count == 2) { heart = '⚫⚫'; } else if (heart_count == 1) { heart = '⚫'; } else { heart = '─'; }
        if (retry_count == 1) { try_figure = '☆'; } else if (retry_count == 2) { try_figure = '☆☆'; } else if (retry_count == 3) { try_figure = '☆☆☆'; } else { try_figure = ''; }


        if (hinted === false) {
            conv.ask(new SimpleResponse({ speech: `<speak><emphasis level="strong">給你一個提示</emphasis><break time="0.2s"/><emphasis level="strong">這個謎語的答案有</emphasis><break time="0.1s"/><emphasis level="moderate">${charactor}個字</emphasis><break time="0.1s"/></speak>`, text: '提示：答案有' + charactor + '個字' }));
            hinted = true;
        } else {
            conv.ask(new SimpleResponse({ speech: `<speak><emphasis level="strong">我已經給你提示囉!</emphasis><break time="0.1s"/><emphasis level="moderate">再想看看吧!</emphasis></speak>`, text: '給過提示囉，再加把勁!' }));
        }
        conv.ask(new BasicCard({
            title: Total_Count + '.  \n' + Question_Title,
            subtitle: '提示:' + Hint + '  \n答案字數：' + charactor,
            text: '血量條 ' + heart + ' • 本題嘗試次數 ' + try_figure,
        }));

        if (heart_count > 1) { conv.ask(new Suggestions('跳過這一題')); } else { conv.ask(new Suggestions('放棄作答')); }
    } else if (menu === false && question_output === true && answer_input === false && end_game === false && next_question === false) {
        menu = false;
        question_output = false;
        answer_input = true;
        end_game = false;
        next_question = true;
        hinted = false;

        //開始挑選題目
        retry_count = 0;
        Total_Count++;

        for (Q = parseInt(Math.random() * Q_Total); Q_list.indexOf(Q) !== -1; Q = (Q + 1) % (Q_Total + 1))
            Q_list.push(Q); // 將現在選出的編號存入陣列

        output_array = question_list[Q];
        Question_Title = output_array[0]; //選出這次的題目標題
        Hint = output_array[1]; //取得本題目的提示
        Answer = output_array[2]; //取得本題目的正確答案
        charactor = output_array[2].length; //取得本題目答案之字元數
        Audio = output_array[3]; //取得本題目答案之語音網址

        if (Audio.length !== 0) {
            conv.noInputs = [new SimpleResponse(`<speak>快想看看答案是什麼，題目是<audio src="${Audio}"/></speak>`), "抱歉，你的答案是什麼?", "我想我們先進行到這裡吧，下次見!"];
            conv.ask(new SimpleResponse({ speech: `<speak>第${Total_Count}題<break time="0.2s"/><audio src="${Audio}"/><break time="0.5s"/>給個提示<break time="0.2s"/>${Hint}</speak>`, text: '熱騰騰的謎題來啦!' }));
        } else {
            conv.noInputs = ["快想看看答案是什麼，題目是" + Question_Title, "抱歉，你的答案是什麼?", "我想我們先進行到這裡吧，下次見!"];
            conv.ask(new SimpleResponse({ speech: `<speak>第${Total_Count}題<break time="0.2s"/>${Question_Title}<break time="0.5s"/>給個提示<break time="0.2s"/>${Hint}</speak>`, text: '熱騰騰的謎題來啦!' }));
        }
    } else if (menu === false && end_game === true && question_output === false && answer_input === false && next_question === false) {
        conv.ask(new SimpleResponse({ speech: '抱歉，我不懂你的意思。請對我說、重新開始、或、掰掰、進行相關操作!', text: '我不了解你的意思，換個方式試試看' }));
        conv.ask(new Suggestions('🎮 重新開始', '👋 掰掰'));
    } else {
        conv.ask(new SimpleResponse({
            speech: "本服務需要您進一步進行設定才能繼續進行，請依照下述步驟開啟「網路與應用程式」功能。才能獲得個人化體驗喔!",
            text: '請進行相關設定，才能進行遊戲!',
        }));
        conv.close(new BasicCard({
            title: '請開啟「網路和應用程式活動」功能',
            subtitle: '為了給您個人化的遊戲體驗，\n請點擊下方按鈕前往Google帳戶設定，\n開啟「包括 Chrome 瀏覽記錄以及採用 Google 服務的網站、應用程式和裝置中的活動記錄」\n我即可為你帶來客製化遊戲體驗!',
            buttons: new Button({ title: 'Google活動控制項', url: "https://myaccount.google.com/activitycontrols?pli=1", }),
        }));
    }

    //儲存參數
    conv.user.storage.Total_Count = Total_Count;
    conv.user.storage.Correct_Count = Correct_Count;
    conv.user.storage.Wrong_Count = Wrong_Count;
    conv.user.storage.heart_count = heart_count;
    conv.user.storage.retry_count = retry_count;
    conv.user.storage.Q_list = Q_list;
    conv.user.storage.Question_Title = Question_Title;
    conv.user.storage.Hint = Hint;
    conv.user.storage.Answer = Answer;
    conv.user.storage.Audio = Audio;
    conv.user.storage.charactor = charactor;
    conv.user.storage.pass_question = pass_question;
    conv.user.storage.menu = menu;
    conv.user.storage.end_game = end_game;
    conv.user.storage.question_output = question_output;
    conv.user.storage.answer_input = answer_input;
    conv.user.storage.next_question = next_question;
    conv.user.storage.hinted = hinted;

});

app.intent('重複題目', (conv) => {
    //導入參數
    Total_Count = conv.user.storage.Total_Count;
    Correct_Count = conv.user.storage.Correct_Count;
    Wrong_Count = conv.user.storage.Wrong_Count;
    heart_count = conv.user.storage.heart_count;
    retry_count = conv.user.storage.retry_count;
    Audio = conv.user.storage.Audio;
    Q_list = conv.user.storage.Q_list;
    Question_Title = conv.user.storage.Question_Title;
    Hint = conv.user.storage.Hint;
    Answer = conv.user.storage.Answer;
    charactor = conv.user.storage.charactor;
    pass_question = conv.user.storage.pass_question;
    menu = conv.user.storage.menu;
    end_game = conv.user.storage.end_game;
    question_output = conv.user.storage.question_output;
    answer_input = conv.user.storage.answer_input;
    next_question = conv.user.storage.next_question;
    hinted = conv.user.storage.hinted;

    if (menu === false && question_output === false && answer_input === true && end_game === false && next_question === true) {

        if (Audio.length !== 0) { conv.noInputs = [new SimpleResponse(`<speak>快想看看答案是什麼，題目是<audio src="${Audio}"/>，有${charactor}個字</speak>`), "抱歉，你的答案是什麼?", "我想我們先進行到這裡吧，下次見!"]; }
        if (Audio.length !== 0) {
            conv.noInputs = [new SimpleResponse(`<speak>快想看看答案是什麼，題目是<audio src="${Audio}"/></speak>`), "抱歉，你的答案是什麼?", "我想我們先進行到這裡吧，下次見!"];
            conv.ask(new SimpleResponse({ speech: `<speak>沒問題，仔細聽好囉!<break time="0.5s"/><audio src="${Audio}"/><break time="0.5s"/>給個提示<break time="0.2s"/>${Hint}</speak>`, text: '沒問題，仔細聽好囉' }));
        } else {
            conv.noInputs = ["快想看看答案是什麼，題目是" + Question_Title, "抱歉，你的答案是什麼?", "我想我們先進行到這裡吧，下次見!"];
            conv.ask(new SimpleResponse({ speech: `<speak>沒問題，仔細聽好囉!<break time="0.5s"/>${Question_Title}<break time="0.5s"/>給個提示<break time="0.2s"/>${Hint}</speak>`, text: '沒問題，仔細聽好囉' }));
        }

        if (heart_count == 3) { heart = '⚫⚫⚫'; } else if (heart_count == 2) { heart = '⚫⚫'; } else if (heart_count == 1) { heart = '⚫'; } else { heart = '─'; }
        if (retry_count == 1) { try_figure = '☆'; } else if (retry_count == 2) { try_figure = '☆☆'; } else if (retry_count == 3) { try_figure = '☆☆☆'; } else { try_figure = ''; }


        if (hinted === false) {
            CardsubTitle = '提示:' + Hint;
            conv.ask(new Suggestions('提示字數'));
        } else {
            CardsubTitle = '提示:' + Hint + '  \n答案字數：' + charactor;
        }

        conv.ask(new BasicCard({
            title: Total_Count + '.  \n' + Question_Title,
            subtitle: CardsubTitle,
            text: '血量條 ' + heart + ' • 本題嘗試次數 ' + try_figure,
        }));

        if (heart_count > 1) { conv.ask(new Suggestions('跳過這一題')); } else { conv.ask(new Suggestions('放棄作答')); }
    } else if (menu === false && question_output === true && answer_input === false && end_game === false && next_question === false) {
        menu = false;
        question_output = false;
        answer_input = true;
        end_game = false;
        next_question = true;
        hinted = false;

        //開始挑選題目
        retry_count = 0;
        Total_Count++;

        for (Q = parseInt(Math.random() * Q_Total); Q_list.indexOf(Q) !== -1; Q = (Q + 1) % (Q_Total + 1))
            Q_list.push(Q); // 將現在選出的編號存入陣列

        output_array = question_list[Q];
        Question_Title = output_array[0]; //選出這次的題目標題
        Hint = output_array[1]; //取得本題目的提示
        Answer = output_array[2]; //取得本題目的正確答案
        charactor = output_array[2].length; //取得本題目答案之字元數
        Audio = output_array[3]; //取得本題目答案之語音網址

        if (Audio.length !== 0) {
            conv.noInputs = [new SimpleResponse(`<speak>快想看看答案是什麼，題目是<audio src="${Audio}"/></speak>`), "抱歉，你的答案是什麼?", "我想我們先進行到這裡吧，下次見!"];
            conv.ask(new SimpleResponse({ speech: `<speak>第${Total_Count}題<break time="0.2s"/><audio src="${Audio}"/><break time="0.5s"/>給個提示<break time="0.2s"/>${Hint}</speak>`, text: '熱騰騰的謎題來啦!' }));
        } else {
            conv.noInputs = ["快想看看答案是什麼，題目是" + Question_Title, "抱歉，你的答案是什麼?", "我想我們先進行到這裡吧，下次見!"];
            conv.ask(new SimpleResponse({ speech: `<speak>第${Total_Count}題<break time="0.2s"/>${Question_Title}<break time="0.5s"/>給個提示<break time="0.2s"/>${Hint}</speak>`, text: '熱騰騰的謎題來啦!' }));
        }
    } else if (menu === false && end_game === true && question_output === false && answer_input === false && next_question === false) {
        conv.ask(new SimpleResponse({ speech: '抱歉，我不懂你的意思。請對我說、重新開始、或、掰掰、進行相關操作!', text: '我不了解你的意思，換個方式試試看' }));
        conv.ask(new Suggestions('🎮 重新開始', '👋 掰掰'));
    } else {
        conv.ask(new SimpleResponse({
            speech: "本服務需要您進一步進行設定才能繼續進行，請依照下述步驟開啟「網路與應用程式」功能。才能獲得個人化體驗喔!",
            text: '請進行相關設定，才能進行遊戲!',
        }));
        conv.close(new BasicCard({
            title: '請開啟「網路和應用程式活動」功能',
            subtitle: '為了給您個人化的遊戲體驗，\n請點擊下方按鈕前往Google帳戶設定，\n開啟「包括 Chrome 瀏覽記錄以及採用 Google 服務的網站、應用程式和裝置中的活動記錄」\n我即可為你帶來客製化遊戲體驗!',
            buttons: new Button({ title: 'Google活動控制項', url: "https://myaccount.google.com/activitycontrols?pli=1", }),

        }));
    }

    //儲存參數
    conv.user.storage.Total_Count = Total_Count;
    conv.user.storage.Correct_Count = Correct_Count;
    conv.user.storage.Wrong_Count = Wrong_Count;
    conv.user.storage.heart_count = heart_count;
    conv.user.storage.retry_count = retry_count;
    conv.user.storage.Q_list = Q_list;
    conv.user.storage.Question_Title = Question_Title;
    conv.user.storage.Hint = Hint;
    conv.user.storage.Answer = Answer;
    conv.user.storage.Audio = Audio;
    conv.user.storage.charactor = charactor;
    conv.user.storage.pass_question = pass_question;
    conv.user.storage.menu = menu;
    conv.user.storage.end_game = end_game;
    conv.user.storage.question_output = question_output;
    conv.user.storage.answer_input = answer_input;
    conv.user.storage.next_question = next_question;
    conv.user.storage.hinted = hinted;



});

app.intent('重新開始', (conv) => {
    //導入參數
    Total_Count = conv.user.storage.Total_Count;
    Correct_Count = conv.user.storage.Correct_Count;
    Wrong_Count = conv.user.storage.Wrong_Count;
    heart_count = conv.user.storage.heart_count;
    retry_count = conv.user.storage.retry_count;
    Audio = conv.user.storage.Audio;
    Q_list = conv.user.storage.Q_list;
    Question_Title = conv.user.storage.Question_Title;
    Hint = conv.user.storage.Hint;
    Answer = conv.user.storage.Answer;
    charactor = conv.user.storage.charactor;
    pass_question = conv.user.storage.pass_question;
    menu = conv.user.storage.menu;
    end_game = conv.user.storage.end_game;
    question_output = conv.user.storage.question_output;
    answer_input = conv.user.storage.answer_input;
    next_question = conv.user.storage.next_question;
    hinted = conv.user.storage.hinted;

    if (menu === false && question_output === false && answer_input === false && end_game === true && next_question === false) {
        conv.ask('熱機已完成，開始你的問題!');
        heart_count = 3;
        Total_Count = 0;
        Correct_Count = 0;
        Wrong_Count = 0;
        menu = false;
        question_output = true;
        answer_input = false;
        end_game = false;
        next_question = false;
    }

    if (menu === false && question_output === true && answer_input === false && end_game === false && next_question === false) {
        menu = false;
        question_output = false;
        answer_input = true;
        end_game = false;
        next_question = true;
        hinted = false;

        //開始挑選題目
        retry_count = 0;
        Total_Count++;
        if (heart_count == 3) { heart = '⚫⚫⚫'; } else if (heart_count == 2) { heart = '⚫⚫'; } else if (heart_count == 1) { heart = '⚫'; }
        if (retry_count == 1) { try_figure = '☆'; } else if (retry_count == 2) { try_figure = '☆☆'; } else if (retry_count == 3) { try_figure = '☆☆☆'; } else { try_figure = ''; }

        for (Q = parseInt(Math.random() * Q_Total); Q_list.indexOf(Q) !== -1; Q = (Q + 1) % (Q_Total + 1))
            Q_list.push(Q); // 將現在選出的編號存入陣列

        output_array = question_list[Q];
        Question_Title = output_array[0]; //選出這次的題目標題
        Hint = output_array[1]; //取得本題目的提示
        Answer = output_array[2]; //取得本題目的正確答案
        charactor = output_array[2].length; //取得本題目答案之字元數
        Audio = output_array[3]; //取得本題目答案之語音網址

        if (Audio !== "") {
            conv.ask(new SimpleResponse({ speech: `<speak>第${Total_Count}題<break time="0.2s"/><audio src="${Audio}"/><break time="0.5s"/>給個提示<break time="0.2s"/>${Hint}</speak>`, text: '熱騰騰的謎題來啦!' }));
        } else { conv.ask(new SimpleResponse({ speech: `<speak>第${Total_Count}題<break time="0.2s"/>${Question_Title}<break time="0.5s"/>給個提示<break time="0.2s"/>${Hint}</speak>`, text: '熱騰騰的謎題來啦!' })); }

        conv.ask(new BasicCard({
            title: Total_Count + '.  \n' + Question_Title,
            subtitle: '提示:' + Hint + '  \n\n每一題你都有三次答題機會，  \n你隨時都能跳過題目，但等同直接答錯題目!',
            text: '血量條 ' + heart + ' • 本題嘗試次數 ' + try_figure,
        }));

        if (heart_count > 1) { conv.ask(new Suggestions('跳過這一題')); } else { conv.ask(new Suggestions('放棄作答')); }

        conv.ask(new Suggestions('提示字數'));

    } else if (menu === false && question_output === false && answer_input === true && end_game === false && next_question === true) {
        conv.ask(new Suggestions('放棄作答'));
        CardTitle = Total_Count + '.  \n' + Question_Title;
        if (hinted === false) {
            CardsubTitle = '提示:' + Hint;
            conv.ask(new Suggestions('提示字數'));
        } else {
            CardsubTitle = '提示:' + Hint + '  \n答案字數：' + charactor;
        }
        conv.ask(new SimpleResponse({ speech: `<speak><emphasis level="strong">再想看看</emphasis><break time="0.1s"/><emphasis level="moderate">你會找到答案的!</emphasis></speak>`, text: '再加把勁!' }));
        if (Audio.length !== 0) { conv.noInputs = [new SimpleResponse(`<speak>快想看看答案是什麼，題目是<audio src="${Audio}"/>，有${charactor}個字</speak>`), "抱歉，你的答案是什麼?", "我想我們先進行到這裡吧，下次見!"]; } else { conv.noInputs = ["快想看看答案是什麼，題目是" + Question_Title + "，答案有" + charactor + "個字", "抱歉，你的答案是什麼?", "我想我們先進行到這裡吧，下次見!"]; }

        if (heart_count == 3) { heart = '⚫⚫⚫'; } else if (heart_count == 2) { heart = '⚫⚫'; } else if (heart_count == 1) { heart = '⚫'; } else { heart = '─'; }
        if (retry_count == 1) { try_figure = '☆'; } else if (retry_count == 2) { try_figure = '☆☆'; } else if (retry_count == 3) { try_figure = '☆☆☆'; } else { try_figure = ''; }

        conv.ask(new BasicCard({
            title: CardTitle,
            subtitle: CardsubTitle,
            text: '血量條 ' + heart + ' • 本題嘗試次數 ' + try_figure,
        }));

    } else {
        conv.ask(new SimpleResponse({
            speech: "本服務需要您進一步進行設定才能繼續進行，請依照下述步驟開啟「網路與應用程式」功能。才能獲得個人化體驗喔!",
            text: '請進行相關設定，才能進行遊戲!',
        }));
        conv.close(new BasicCard({
            title: '請開啟「網路和應用程式活動」功能',
            subtitle: '為了給您個人化的遊戲體驗，\n請點擊下方按鈕前往Google帳戶設定，\n開啟「包括 Chrome 瀏覽記錄以及採用 Google 服務的網站、應用程式和裝置中的活動記錄」\n我即可為你帶來客製化遊戲體驗!',
            buttons: new Button({ title: 'Google活動控制項', url: "https://myaccount.google.com/activitycontrols?pli=1", }),

        }));
    }


    //儲存參數
    conv.user.storage.Total_Count = Total_Count;
    conv.user.storage.Correct_Count = Correct_Count;
    conv.user.storage.Wrong_Count = Wrong_Count;
    conv.user.storage.heart_count = heart_count;
    conv.user.storage.retry_count = retry_count;
    conv.user.storage.Q_list = Q_list;
    conv.user.storage.Question_Title = Question_Title;
    conv.user.storage.Hint = Hint;
    conv.user.storage.Answer = Answer;
    conv.user.storage.Audio = Audio;
    conv.user.storage.charactor = charactor;
    conv.user.storage.pass_question = pass_question;
    conv.user.storage.menu = menu;
    conv.user.storage.end_game = end_game;
    conv.user.storage.question_output = question_output;
    conv.user.storage.answer_input = answer_input;
    conv.user.storage.next_question = next_question;
    conv.user.storage.hinted = hinted;

});

app.intent('結束對話', (conv) => {
    //導入參數
    Total_Count = conv.user.storage.Total_Count;
    Correct_Count = conv.user.storage.Correct_Count;
    Wrong_Count = conv.user.storage.Wrong_Count;
    heart_count = conv.user.storage.heart_count;
    retry_count = conv.user.storage.retry_count;
    Audio = conv.user.storage.Audio;
    Q_list = conv.user.storage.Q_list;
    Question_Title = conv.user.storage.Question_Title;
    Hint = conv.user.storage.Hint;
    Answer = conv.user.storage.Answer;
    charactor = conv.user.storage.charactor;
    pass_question = conv.user.storage.pass_question;
    menu = conv.user.storage.menu;
    end_game = conv.user.storage.end_game;
    question_output = conv.user.storage.question_output;
    answer_input = conv.user.storage.answer_input;
    next_question = conv.user.storage.next_question;
    hinted = conv.user.storage.hinted;

    var input = conv.input.raw;

    if (menu === false && question_output === false && answer_input === true && end_game === false && next_question === true) {

        if (input.indexOf(Answer) !== -1 && heart_count >= 1) {
            Correct_Count++;
            retry_count++;
            hinted = false;
            menu = false;
            question_output = true;
            answer_input = false;
            end_game = false;
            next_question = true;
            if (heart_count == 3) { heart = '⚫⚫⚫'; } else if (heart_count == 2) { heart = '⚫⚫'; } else if (heart_count == 1) { heart = '⚫'; } else { heart = '─'; }
            if (retry_count == 1) { try_figure = '☆'; } else if (retry_count == 2) { try_figure = '☆☆'; } else if (retry_count == 3) { try_figure = '☆☆☆'; } else { try_figure = ''; }
            conv.ask('恭喜你答對拉!');

            if (conv.screen) {
                conv.ask(new BasicCard({
                    title: '正解為「' + Answer + '」',
                    subtitle: '\n《原始題目》\n' + Question_Title,
                    text: '第' + Total_Count + '題 • 血量條 ' + heart + ' • 本題嘗試次數 ' + try_figure,
                }));
                conv.ask(new Suggestions('    下一題    '));
            } else {

                menu = false;
                question_output = false;
                answer_input = true;
                end_game = false;
                next_question = true;
                hinted = false;

                //開始挑選題目
                retry_count = 0;
                Total_Count++;

                for (Q = parseInt(Math.random() * Q_Total); Q_list.indexOf(Q) !== -1; Q = (Q + 1) % (Q_Total + 1))
                    Q_list.push(Q); // 將現在選出的編號存入陣列

                output_array = question_list[Q];
                Question_Title = output_array[0]; //選出這次的題目標題
                Hint = output_array[1]; //取得本題目的提示
                Answer = output_array[2]; //取得本題目的正確答案
                charactor = output_array[2].length; //取得本題目答案之字元數
                Audio = output_array[3]; //取得本題目答案之語音網址

                if (Audio.length !== 0) {
                    conv.noInputs = [new SimpleResponse(`<speak>快想看看答案是什麼，題目是<audio src="${Audio}"/></speak>`), "抱歉，你的答案是什麼?", "我想我們先進行到這裡吧，下次見!"];
                    conv.ask(new SimpleResponse({ speech: `<speak>第${Total_Count}題<break time="0.2s"/><audio src="${Audio}"/><break time="0.5s"/>給個提示<break time="0.2s"/>${Hint}</speak>`, text: '熱騰騰的謎題來啦!' }));
                } else {
                    conv.noInputs = ["快想看看答案是什麼，題目是" + Question_Title, "抱歉，你的答案是什麼?", "我想我們先進行到這裡吧，下次見!"];
                    conv.ask(new SimpleResponse({ speech: `<speak>第${Total_Count}題<break time="0.2s"/>${Question_Title}<break time="0.5s"/>給個提示<break time="0.2s"/>${Hint}</speak>`, text: '熱騰騰的謎題來啦!' }));
                }
            }
        } else if (input.indexOf(Answer) === -1 && heart_count >= 1) {

            retry_count++;

            if (retry_count <= 3) {

                if (retry_count <= 2) {
                    conv.ask(new Suggestions('放棄作答'));
                    CardTitle = Total_Count + '.  \n' + Question_Title;

                    if (hinted === false) {
                        CardsubTitle = '提示:' + Hint;
                        conv.ask(new Suggestions('提示字數'));
                    } else {
                        CardsubTitle = '提示:' + Hint + '  \n答案字數：' + charactor;
                    }
                    conv.ask(new SimpleResponse({ speech: `<speak><emphasis level="strong">再想看看</emphasis><break time="0.1s"/><emphasis level="moderate">你會找到答案的!</emphasis></speak>`, text: '再加把勁!' }));

                    if (!conv.screen) {
                        if (Audio.length !== 0) {
                            conv.noInputs = [new SimpleResponse(`<speak>快想看看答案是什麼，題目是<audio src="${Audio}"/></speak>`), "抱歉，你的答案是什麼?", "我想我們先進行到這裡吧，下次見!"];
                            conv.ask(new SimpleResponse(`<speak>題目是<break time="0.5s"/><audio src="${Audio}"/><break time="0.5s"/>給個提示<break time="0.2s"/>${Hint}</speak>`));
                        } else {
                            conv.noInputs = ["快想看看答案是什麼，題目是" + Question_Title, "抱歉，你的答案是什麼?", "我想我們先進行到這裡吧，下次見!"];
                            conv.ask(new SimpleResponse(`<speak>題目是<break time="0.5s"/>${Question_Title}<break time="0.5s"/>給個提示<break time="0.2s"/>${Hint}</speak>`));
                        }
                    }
                } else if (retry_count === 3) {
                    Wrong_Count++;
                    heart_count--;
                    menu = false;
                    question_output = true;
                    answer_input = false;
                    end_game = false;
                    next_question = false;
                    hinted = false;
                    CardTitle = '正確答案是：「' + Answer + '」';
                    CardsubTitle = '\n《原始題目》\n' + Question_Title;
                    if (heart_count === 0) {
                        menu = false;
                        question_output = false;
                        answer_input = true;
                        end_game = true;
                        next_question = false;
                        conv.ask(new SimpleResponse({ speech: `<speak><audio src="${fail_sound}"/>回合結束!這題正確答案為<break time="0.1s"/>${Answer}</speak>`, text: '別氣餒，下次再加油!' }));
                        if (conv.screen) { conv.ask(new Suggestions('休息，是為了走更長遠的路')); } else {
                            conv.close(new SimpleResponse(`<speak><audio src="${calculate_sound}"/><prosody volume="loud"><p><s>根據Google神通廣大的雲端計算!</s><s>你在這回合一共進行<break time="0.05s"/>${Total_Count}<break time="0.03s"/>題題目。</s><s>希望你玩得愉快，下次見</s></p></prosody></speak>`));
                        }
                        conv.user.storage = {}; //離開同時清除暫存資料
                    } else {
                        conv.ask(new SimpleResponse({ speech: `<speak>答錯啦!這題答案是<break time="0.1s"/>${Answer}</speak>`, text: '別氣餒，下一題會答對的!' }));
                        if (conv.screen) { conv.ask(new Suggestions('    下一題    ')); } else {
                            menu = false;
                            question_output = false;
                            answer_input = true;
                            end_game = false;
                            next_question = true;
                            hinted = false;

                            //開始挑選題目
                            retry_count = 0;
                            Total_Count++;

                            for (Q = parseInt(Math.random() * Q_Total); Q_list.indexOf(Q) !== -1; Q = (Q + 1) % (Q_Total + 1))
                                Q_list.push(Q); // 將現在選出的編號存入陣列

                            output_array = question_list[Q];
                            Question_Title = output_array[0]; //選出這次的題目標題
                            Hint = output_array[1]; //取得本題目的提示
                            Answer = output_array[2]; //取得本題目的正確答案
                            charactor = output_array[2].length; //取得本題目答案之字元數
                            Audio = output_array[3]; //取得本題目答案之語音網址

                            if (Audio.length !== 0) {
                                conv.noInputs = [new SimpleResponse(`<speak>快想看看答案是什麼，題目是<audio src="${Audio}"/></speak>`), "抱歉，你的答案是什麼?", "我想我們先進行到這裡吧，下次見!"];
                                conv.ask(new SimpleResponse({ speech: `<speak>第${Total_Count}題<break time="0.2s"/><audio src="${Audio}"/><break time="0.5s"/>給個提示<break time="0.2s"/>${Hint}</speak>`, text: '熱騰騰的謎題來啦!' }));
                            } else {
                                conv.noInputs = ["快想看看答案是什麼，題目是" + Question_Title, "抱歉，你的答案是什麼?", "我想我們先進行到這裡吧，下次見!"];
                                conv.ask(new SimpleResponse({ speech: `<speak>第${Total_Count}題<break time="0.2s"/>${Question_Title}<break time="0.5s"/>給個提示<break time="0.2s"/>${Hint}</speak>`, text: '熱騰騰的謎題來啦!' }));
                            }
                        }
                    }
                }
                if (conv.screen) {
                    if (heart_count == 3) { heart = '⚫⚫⚫'; } else if (heart_count == 2) { heart = '⚫⚫'; } else if (heart_count == 1) { heart = '⚫'; } else { heart = '─'; }
                    if (retry_count == 1) { try_figure = '☆'; } else if (retry_count == 2) { try_figure = '☆☆'; } else if (retry_count == 3) { try_figure = '☆☆☆'; } else { try_figure = ''; }

                    conv.ask(new BasicCard({
                        title: CardTitle,
                        subtitle: CardsubTitle,
                        text: '血量條 ' + heart + ' • 本題嘗試次數 ' + try_figure,
                    }));
                }
            }
        }
    } else {
        conv.user.storage = {}; //離開同時清除暫存資料
        conv.ask('希望你玩得愉快!');
        conv.ask(new SimpleResponse({ speech: '下次見', text: '下次見 👋', }));
        conv.close(new BasicCard({
            title: '感謝您的使用!',
            subtitle: '若覺得這個服務不錯，  \n歡迎到Google助理的頁面評分或給予反饋。謝謝!',
            buttons: new Button({ title: '開啟本程式的商店頁面', url: 'https://assistant.google.com/services/a/uid/00000046536e4ef2', }),
        }));
    }

    if (conv.user.storage !== undefined) {
        conv.user.storage.Total_Count = Total_Count;
        conv.user.storage.Correct_Count = Correct_Count;
        conv.user.storage.Wrong_Count = Wrong_Count;
        conv.user.storage.heart_count = heart_count;
        conv.user.storage.retry_count = retry_count;
        conv.user.storage.Q_list = Q_list;
        conv.user.storage.Question_Title = Question_Title;
        conv.user.storage.Hint = Hint;
        conv.user.storage.Answer = Answer;
        conv.user.storage.Audio = Audio;
        conv.user.storage.charactor = charactor;
        conv.user.storage.pass_question = pass_question;
        conv.user.storage.menu = menu;
        conv.user.storage.end_game = end_game;
        conv.user.storage.question_output = question_output;
        conv.user.storage.answer_input = answer_input;
        conv.user.storage.next_question = next_question;
        conv.user.storage.hinted = hinted;
    }

});


// Set the DialogflowApp object to handle the HTTPS POST request.
exports.riddle_game = functions.https.onRequest(app);