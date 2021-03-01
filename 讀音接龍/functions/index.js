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

//var getJSON = require('get-json')//引用呼叫網路內容之模組
//var parser=require('json-parser');

const functions = require('firebase-functions');
const replaceString = require('replace-string');
var pinyin = require("pinyin");
const app = dialogflow({ debug: true });
var text_library = require('./text_library.json');
var transform_library = require('./cjst.json');
var word_list = require('./last_word_list.json');
var text_start = ["眺望", "天崩地裂", "聽筒", "意思", "禿髮", "托缽", "推波助瀾", "湍流", "吞併", "通報", "南無", "乃是", "內部", "橈動脈", "囡仔", "嫩苗", "囊袋", "能否", "尼羅河", "捏坏", "鳥房", "牛蒡", "年報", "娘娘", "寧謐", "奴僕", "挪動", "暖房", "農保", "女伴", "虐待", "拉拔", "肋骨", "勒死", "來賓", "撈本", "落腳", "僂儸", "闌尾", "啷噹", "稜角", "哩哩囉囉", "咧嘴", "聊備一格", "溜冰", "連本帶利", "林木", "良伴", "伶仃", "嚕囌", "孿生", "倫巴", "隆鼻", "驢子", "掠美", "旮旯兒", "戈壁", "哥兒們", "該當", "羔羊", "勾搭", "干貝", "根本", "肛門", "戇頭戇腦", "更名", "估量", "瓜皮帽", "渦河", "乖謬", "閨房", "官兵", "袞袞", "光譜", "工本", "咖啡", "苛薄", "揩汗", "考評", "口碑", "刊本", "肯定", "康復", "坑道", "枯木逢春", "誇大", "括約肌", "快報", "盔甲", "寬幅", "昆布", "匡復", "空門", "哈密瓜", "呵呵", "咳聲嘆息", "黑白不分", "毫不留情", "喉嚨", "酣戰", "痕跡", "行當", "亨通", "呼朋引伴", "化子", "活蹦亂跳", "淮河", "灰白", "歡度", "昏昧", "荒僻", "哄抬物價", "肌膚", "加把勁", "皆大歡喜", "交白卷", "糾紛", "尖兵", "巾幗", "江米人", "京片子", "狙擊", "決明子", "身毒", "均分", "炯炯有神", "七拼八湊", "掐指一算", "切片檢查", "敲邊鼓", "丘陵", "千變萬化", "侵犯", "腔調", "青梅竹馬", "曲棍球", "缺乏", "圈點", "裙帶關係", "穹窿", "西北颱", "蝦兵蟹將", "些須", "削價", "休兵", "仙風道骨", "心病", "相搏", "星斗", "虛報", "靴子", "宣布", "勛爵", "凶巴巴", "芝麻", "扎根", "折騰", "摘錄", "招標", "著眼", "州官放火", "占卜", "珍寶", "章法", "正月", "朱門", "抓牢", "椎心泣血", "專賣", "迍邅", "中飽", "吃不開", "叉燒", "車把", "拆封", "抄本", "抽風機", "摻合", "嗔怒", "昌明", "稱道", "出版", "抓子兒", "啜泣", "揣摩", "吹捧", "川流不息", "春夢", "窗明几淨", "充沛", "尸位素餐", "沙盤", "奢靡", "篩檢", "捎來", "收編", "山崩地裂", "申報", "商標", "升斗小民", "抒發", "刷卡", "說白", "衰敗", "水壩", "涮羊肉", "吮吸", "霜淇淋", "日薄西山", "惹火", "蟯蟲", "柔美", "然後", "人本主義", "壤土", "扔掉", "如夢初醒", "若干", "芮芮", "阮囊羞澀", "閏年", "戎裝", "孜孜", "匝道", "咋舌", "災胞", "賊頭賊腦", "遭逢", "走避", "簪花", "怎不", "贓款", "曾祖", "租費", "作料", "嘴巴", "鑽探", "尊夫人", "宗廟", "雌伏", "擦肩而過", "冊封", "猜謎", "操兵", "湊合", "參拜", "參差", "倉庫", "曾幾何時", "粗暴", "搓湯圓", "催逼", "攢眉", "村民", "匆忙", "司馬", "撒旦", "色筆", "腮幫子", "搔到癢處", "搜捕", "三百六十行", "森巴", "桑葚", "僧多粥少", "甦醒", "唆使", "睢河", "痠麻", "孫女", "松柏", "阿兵哥", "喔唷", "阿諛", "哀兵", "凹透鏡", "歐巴桑", "安邦", "恩德", "腌臢", "而立之年", "丫頭", "耶誕節", "崖邊", "么兒", "攸關", "奄奄一息", "因地制宜", "央告", "英磅", "汙衊", "挖洞", "渦流", "歪風", "委蛇", "剜肉補瘡", "溫飽", "汪洋", "翁姑", "迂腐", "約莫", "鴛鴦", "暈倒", "庸人自擾", "電子郵件"];
var Total_Count = 0;
var sys_word = "";
var input_word = "";
var last_word = "";
var first_word = "";
var number = "";
var output_array = "";
var menu = false; //判別是否在歡迎頁面
var end_game = false; //判別遊戲是否已結束
var question_output = false; //判別是否拿到出題目許可
var reported = false; //判別是否已經說明回報問題機制
var input_list = new Array([]);;
var checker = false;
var start_game = false;
var sys_suggest = "";
var inputarray = ["🔄 重新開始", "再來一次", "再玩一次", "再試一次", "再來", "重新開始", "重來", "好", "OK", "可以", "再一次", "好啊"];
var return_array = ["準備接招吧!", "小菜一碟 😎", "能接的詞顯而易見呢!", "這還不簡單?", "輕而易舉的問題"];
var back_array = ["再來一次", "再玩一次", "再試一次", "再來", "重來", "OK", "可以", "再一次", "好啊", "重新"];
var wrong_array = "";
var jumpcount = "";
var subtitle_suggest = "";
var wrong_count = 0;
var flag = false;
const LeaveContexts = { parameter: 'bye', }

function isChn(str) {
    var reg = /^[\u4E00-\u9FA5]+$/;
    if (!reg.test(str)) {
        return false; //不全是中文
    }
    return true; //全是中文
}

var example_array = [
    ['走避', '逼肖', '酵母', '目眩神馳', '尺幅'],
    ['括約肌', '及笄', '極權國家', '加爾各答', '達到'],
    ['抄本', '奔走逢迎', '應徵', '蟄蟄', '折射式望遠鏡'],
    ['空門', '悶熱', '惹氣', '期刊', '看漲'],
    ['哈密瓜', '刮目相待', '歹不中', '鍾靈毓秀', '休業式'],
    ['催逼', '碧空', '悾款', '款款動人', '韌皮部'],
    ['升斗小民', '民負', '傅巖', '衍生物', '烏孫'],
    ['狙擊', '積惡餘殃', '陽阿', '阿曼', '曼哈坦計畫'],
    ['活蹦亂跳', '條規', '鬼門關', '關合', '合變'],
    ['涮羊肉', '肉角', '叫菜', '裁衣尺', '赤小豆']
]


app.intent('預設歡迎語句', (conv) => {

    if (conv.user.verification === 'VERIFIED') {
        if (conv.screen) {
            menu = true;
            question_output = false;
            end_game = false;
            Total_Count = 0;
            input_list = [];
            start_game = false;
            input_word = "";
            last_word = "";
            first_word = "";
            reported = false;

            var example = "";
            var example_list = example_array[parseInt(Math.random() * (example_array.length - 1))];

            for (var i = 0; i < example_list.length; i++) {
                example = example + example_list[i]
                if (example_list[i + 1] !== undefined) {
                    example = example + ">"
                }
            }

            conv.ask(new SimpleResponse({
                speech: `<speak><p><s>想和我一較高下嗎?</s><s>在遊戲過程中，詞彙不能重複!</s><s>與此同時，你隨時都能退出挑戰結算成績!</s><s>來挑戰看看八!</s></p></speak>`,
                text: '歡迎來挑戰!',
            }));

            conv.ask(new BasicCard({
                image: new Image({ url: 'https://raw.githubusercontent.com/hank199599/Google-Assistant-APP/master/%E8%AE%80%E9%9F%B3%E6%8E%A5%E9%BE%8D/assets/vwqZn8V.jpg', alt: 'Pictures', }),
                title: '遊戲規則',
                subtitle: '  • 前後詞彙的讀音須相同但不限音調。\n  • 在遊戲過程中，詞彙不能重複!\n  • 隨時都能跳過詞彙，共有三次機會。\n  • 你隨時都能退出結算成績。',
                text: '**範例**：  \n' + example,
                buttons: new Button({
                    title: '《教育部重編國語辭典修訂本》',
                    url: 'http://dict.revised.moe.edu.tw/cbdic/',
                }),
            }));
            conv.ask(new Suggestions('🎮 開始遊戲', '👋 掰掰'));
            conv.contexts.set(LeaveContexts.parameter, 1);
        } else {

            menu = false;
            question_output = true;
            end_game = false;
            Total_Count = 0;
            input_list = [];
            start_game = true;
            input_word = "";
            last_word = "";
            first_word = "";

            conv.ask(`<speak><p><s>歡迎遊玩!在開始前請讓我講解一下規則</s><s>在接龍時，輸入的詞彙必須與上一個詞彙字尾的讀音同音。但音調不同也是可以被接受的!</s><s>像是這樣：朱格青樓、樓上、尚書大人、任勞任怨<break time="1s"/>了解怎麼進行接龍了嗎?那麼給我一點時間想開頭的詞彙<break time="2s"/></s></p></speak>`);

            number = parseInt(Math.random() * 304)
            sys_word = text_start[number];
            var temp = pinyin(sys_word, { style: pinyin.STYLE_NORMAL, heteronym: false });
            last_word = transform_library[temp[sys_word.length - 1][0]];

            input_list.push(sys_word); //將詞彙存入佇列

            conv.ask(new SimpleResponse({
                speech: `<speak><p><s>第一個詞彙是<break time="0.2s"/>${sys_word}</s></p></speak>`,
                text: '開始啦🏁\n若輸入重複的詞彙直接結束。',
            }));
            conv.noInputs = ["我剛剛說的是" + sys_word + "，請說開頭讀音是" + last_word + "的詞彙", "遊戲已經開始囉，請說以" + last_word + "為開頭的詞彙", "抱歉，由於您沒有回應因此遊戲到此結束。下次見。"];

        }
    } else {
        conv.ask(new SimpleResponse({
            speech: "在開始前，您需要啟用Google助理，我才能提供你個人化體驗喔!",
            text: '請進行相關設定，才能進行遊戲!',
        }));
        conv.close(new BasicCard({
            image: new Image({ url: 'https://raw.githubusercontent.com/hank199599/Google-Assistant-APP/master/%E8%AE%80%E9%9F%B3%E6%8E%A5%E9%BE%8D/assets/assistant_48dp.png', alt: 'Pictures', }),
            title: '錯誤：您需要進行設定',
            subtitle: 'Google 助理需要授權(請點擊畫面右下方的「開始使用」)。\n授權後我才能為你儲存個人對話狀態，\n藉此提升你的使用體驗!\n',
            display: 'CROPPED',
        }));
    }

    conv.user.storage.menu = menu;
    conv.user.storage.end_game = end_game;
    conv.user.storage.question_output = question_output;
    conv.user.storage.sys_word = sys_word;
    conv.user.storage.last_word = last_word;
    conv.user.storage.input_list = input_list;
    conv.user.storage.Total_Count = Total_Count;
    conv.user.storage.start_game = start_game;
    conv.user.storage.reported = reported;
    conv.user.storage.jumpcount = 0;
    conv.user.storage.wrong_count = 0;

});

app.intent('問題產生器', (conv, { input }) => {

    menu = conv.user.storage.menu;
    end_game = conv.user.storage.end_game;
    question_output = conv.user.storage.question_output;
    last_word = conv.user.storage.last_word;
    sys_word = conv.user.storage.sys_word;
    input_list = conv.user.storage.input_list;
    Total_Count = conv.user.storage.Total_Count;
    start_game = conv.user.storage.start_game;
    reported = conv.user.storage.reported;
    jumpcount = conv.user.storage.jumpcount;
    wrong_count = conv.user.storage.wrong_count;


    if (input.indexOf('開始') !== -1) {
        menu = true;
        question_output = false;
        end_game = false;
        Total_Count = 0;
        input_list = [];
        start_game = false;
        input_word = "";
        last_word = "";
        first_word = "";
        reported = false;
        jumpcount = 0;
        wrong_count = 0;
    }

    //「開始遊戲」啟動詞判斷
    if (menu === true && end_game === false && question_output === false && reported === false) {
        menu = false;
        question_output = true;
        end_game = false;
    }

    //結算畫面防呆判斷
    if (menu === false && end_game === true && question_output === false && reported === false) {
        if (inputarray.indexOf(input) !== -1) {
            menu = false;
            question_output = true;
            end_game = false;
            Total_Count = 0;
            input_list = [];
            start_game = false;
            reported = false;
        }
        jumpcount = 0;
    }

    if (conv.user.verification === 'VERIFIED') {
        if (menu === false && end_game === false && question_output === true && reported === false) {

            flag = false;

            for (var i = 0; i < back_array.length; i++) { if (input.indexOf(back_array[i]) !== -1) { flag = true; } }

            if (flag === true && Total_Count === 0) {
                input_list = [];
                start_game = false;
                reported = false;
                jumpcount = 0;
                wrong_count = 0;
            }

            if (start_game === false) {
                start_game = true;

                //選出最一開始的詞，同時執行驗證看是否能接下去
                //若是不行則重新挑選一個字	   
                number = parseInt(Math.random() * 304)
                sys_word = text_start[number];
                var temp = pinyin(sys_word, { style: pinyin.STYLE_NORMAL, heteronym: false });
                last_word = transform_library[temp[sys_word.length - 1][0]];

                console.log(last_word)
                console.log(sys_word)

                input_list.push(sys_word); //將詞彙存入佇列

                if (conv.user.last.seen === undefined) {
                    conv.ask(new SimpleResponse({
                        speech: `<speak><p><s>歡迎遊玩!在開始前請讓我講解一下規則</s><s>在接龍時，輸入的詞彙必須與上一個詞彙字尾的讀音同音。但音調不同也是可以被接受的!</s><s>像是這樣：朱格青樓、樓上、尚書大人、任勞任怨<break time="1s"/>了解怎麼進行接龍了嗎?那麼給我一點時間想開頭的詞彙<break time="2s"/></s></p></speak>`,
                        text: '🎮 遊戲簡易說明\n詞彙字首要與上個詞彙字尾讀音相同，\n但同音不同調也是可以的!\n如：朱格青樓>樓上>尚書大人>任勞任怨',
                    }));

                }
                conv.ask(new SimpleResponse({
                    speech: `<speak><p><s>開始啦!</s><s>第一個詞彙是<break time="0.2s"/>${sys_word}</s></p></speak>`,
                    text: '開始啦🏁\n若輸入重複的詞彙直接結束。',
                }));

                conv.ask(new BasicCard({
                    title: '『' + sys_word + '』',
                    subtitle: '請輸入開頭讀音是「' + last_word + '」的詞彙\n符合條件的一、二、三、四聲皆可',
                    text: '_若開頭詞太難，可以說「重新開始」_  \n或跳過它讓我幫你想一個詞彙，每回合共三次機會',
                    buttons: new Button({
                        title: '在《萌典》上看這個詞彙的條目',
                        url: 'https://www.moedict.tw/' + sys_word,
                    }),
                }));
                conv.ask(new Suggestions('🔄 重新開始', '跳過這個詞', '放棄本回合'));

            } else {
                input = replaceString(input, '0', '零');
                input = replaceString(input, '1', '一');
                input = replaceString(input, '2', '二');
                input = replaceString(input, '3', '三');
                input = replaceString(input, '4', '四');
                input = replaceString(input, '5', '五');
                input = replaceString(input, '6', '六');
                input = replaceString(input, '7', '七');
                input = replaceString(input, '8', '八');
                input = replaceString(input, '9', '九');

                input = replaceString(input, 'UB', '務必');

                var temp = pinyin(input, { style: pinyin.STYLE_NORMAL, heteronym: false });
                first_word = transform_library[temp[0][0]];

                checker = input.length;
                conv.noInputs = ["我剛剛說的是" + sys_word + "，請說以" + last_word + "為開頭的詞彙", "現在的詞彙是" + sys_word + "，請繼續接下去", "抱歉，由於您一直沒有回應。因此遊戲到此結束。你在這回合進行" + Total_Count + "次接龍，我們下次見。"];

                if (isChn(input) === false) {
                    wrong_count++;
                    wrong_array = [`<speak><p><s>錯誤!</s><s>不能將中文以外的字符作為輸入!</s></p></speak>`,
                        `<speak><p><s>包含非法字元，母湯喔!</s></p></speak>`,
                        `<speak><p><s>安ㄋㄟˉ母湯，請換一個詞來試看看</s></p></speak>`,
                        `<speak><p><s>裡面混入怪怪的東西，請換一個!</s></p></speak>`,
                        `<speak><p><s>這個詞彙裡有怪怪的東西，請換一個。</s></p></speak>`,
                    ];

                    conv.ask(new SimpleResponse({
                        speech: wrong_array[parseInt(Math.random() * 4)],
                        text: '你的輸入包含中文外的字符',
                    }));
                    if (conv.screen) {
                        conv.ask(new BasicCard({
                            title: '『' + sys_word + '』',
                            subtitle: '請輸入開頭讀音是「' + last_word + '」的詞彙\n符合條件的一、二、三、四聲皆可',
                            text: '_[!]非法輸入，不能加入英文等非法符號!_',
                        }));
                        if (jumpcount <= 2) { conv.ask(new Suggestions('跳過這個詞')); }
                        conv.ask(new Suggestions('放棄本回合'));
                    } else {
                        if (wrong_count <= 2) { conv.ask(`<speak><p><s>現在接到<break time="0.2s"/>${sys_word}<break time="0.2s"/>請試著繼續接下去</s></p></speak>`); } else if (wrong_count < 5) { conv.ask(`<speak><p><s>現在接到<break time="0.2s"/>${sys_word}<break time="0.2s"/>如果仍想不到可以接甚麼詞彙，可以對我說<break time="0.2s"/>跳過它</s></p></speak>`); } else { conv.close(`<speak><p><s>由於我們的對話無法繼續，遊戲先到這裡八<break time="0.2s"/>在這回合中你進行${Total_Count}次接龍，下次見!</s></p></speak>`); }
                    }
                } else {
                    if (checker === 1) {
                        wrong_count++;
                        wrong_array = [`<speak><p><s>錯誤!</s><s>不能只輸入一個字!</s></p></speak>`,
                            `<speak><p><s>只有一個字，母湯喔!</s></p></speak>`,
                            `<speak><p><s>安ㄋㄟˉ母湯，請說至少有兩的字的詞彙</s></p></speak>`,
                            `<speak><p><s>只有一個字，這樣是不行的!</s></p></speak>`,
                            `<speak><p><s>這個詞彙只有一個字，我是不會上當的。</s></p></speak>`,
                        ];

                        conv.ask(new SimpleResponse({
                            speech: wrong_array[parseInt(Math.random() * 4)],
                            text: '你的輸入只有一個字，這樣是不行的',
                        }));
                        if (conv.screen) {
                            conv.ask(new BasicCard({
                                title: '『' + sys_word + '』',
                                subtitle: '請輸入開頭讀音是「' + last_word + '」的詞彙\n符合條件的一、二、三、四聲皆可',
                                text: '_[!]你至少要輸入由兩個字構成的詞語。_',
                            }));
                            if (jumpcount <= 2) { conv.ask(new Suggestions('跳過這個詞')); }
                            conv.ask(new Suggestions('放棄本回合'));

                        } else {
                            if (wrong_count <= 2) { conv.ask(`<speak><p><s>現在接到<break time="0.2s"/>${sys_word}<break time="0.2s"/>請試著繼續接下去</s></p></speak>`); } else if (wrong_count < 5) { conv.ask(`<speak><p><s>現在接到<break time="0.2s"/>${sys_word}<break time="0.2s"/>如果仍想不到可以接甚麼詞彙，可以對我說<break time="0.2s"/>跳過它</s></p></speak>`); } else { conv.close(`<speak><p><s>由於我們的對話無法繼續，遊戲先到這裡八<break time="0.2s"/>在這回合中你進行${Total_Count}次接龍，下次見!</s></p></speak>`); }
                        }
                    } else {
                        if (last_word !== first_word) {
                            wrong_count++;

                            wrong_array = [`<speak><p><s>想的好，但是你的詞彙自首讀音不是${last_word}喔!再想一個八!</s></p></speak>`,
                                `<speak><p><s>字首好像ㄅㄨˊ太對喔，試著換一個八!</s></p></speak>`,
                                `<speak><p><s>字首對ㄅㄨˊ上呢，再想一想後頭可以接什麼詞彙!</s></p></speak>`,
                                `<speak><p><s>字首ㄅㄨˊ太對，換一個試看看!</s></p></speak>`,
                                `<speak><p><s>這個詞彙的字首不是我要的，請換一個。</s></p></speak>`,
                            ];

                            conv.ask(new SimpleResponse({
                                speech: wrong_array[parseInt(Math.random() * 4)],
                                text: '不好意思，我沒聽清楚',
                            }));

                            if (conv.screen) {
                                if (conv.input.type === "VOICE") { //如果輸入是語音，則顯示錯誤處理方法
                                    conv.ask(new BasicCard({
                                        title: '『' + sys_word + '』',
                                        subtitle: '請輸入開頭讀音是「' + last_word + '」的詞彙\n符合條件的一、二、三、四聲皆可',
                                        text: '*〈錯誤說明〉*  \n*Google語音辨識可能發生錯誤，你可以嘗試：*  \n• 試著再說一次  \n• 若錯誤源自同音詞辨識，請試著加長詞彙長度  \n• 透過鍵盤輸入欲表達的詞彙  \n• 向Google回報該錯誤改善其辨識能力'
                                    }));
                                    conv.ask(new Suggestions('我要進行回報'));
                                } else { //輸入方式不是語音則顯示輸入錯誤

                                    conv.ask(new BasicCard({
                                        title: '『' + sys_word + '』',
                                        subtitle: '請輸入開頭讀音是「' + last_word + '」的詞彙\n符合條件的一、二、三、四聲皆可',
                                        text: '_[!]請輸入正確的開頭詞才能繼續進行喔!_',
                                    }));
                                }
                                if (jumpcount <= 2) { conv.ask(new Suggestions('跳過這個詞')); }
                                conv.ask(new Suggestions('放棄本回合'));
                            } else {
                                if (wrong_count <= 2) { conv.ask(`<speak><p><s>現在接到<break time="0.2s"/>${sys_word}<break time="0.2s"/>請試著繼續接下去</s></p></speak>`); } else if (wrong_count < 5) { conv.ask(`<speak><p><s>現在接到<break time="0.2s"/>${sys_word}<break time="0.2s"/>如果仍想不到可以接甚麼詞彙，可以對我說<break time="0.2s"/>跳過它</s></p></speak>`); } else { conv.close(`<speak><p><s>由於我們的對話無法繼續，遊戲先到這裡八<break time="0.2s"/>在這回合中你進行${Total_Count}次接龍，下次見!</s></p></speak>`); }
                            }
                        } else {
                            Total_Count++;
                            wrong_count = 0;

                            if (input_list.indexOf(input) === -1) { //檢查輸入的詞彙是否已重複

                                input_list.push(input); //將詞彙存入佇列
                                var input_init = input.split('');
                                input_word = input_init.pop();
                                var temp = pinyin(input, { style: pinyin.STYLE_NORMAL, heteronym: false });
                                input_word = transform_library[temp[input.length - 1][0]];

                                output_array = text_library[input_word]; //進入詞彙庫取得對應詞彙

                                if (typeof output_array === "undefined") {
                                    menu = false;
                                    question_output = false;
                                    end_game = true;
                                    reported = false;
                                    conv.ask(new SimpleResponse({
                                        speech: `<speak><p><s>可<break time="0.2s"/>可<break time="0.2s"/>可惡<break time="0.2s"/></s><s>我竟然找不到可以接下去的詞，你贏我了呢!</s></p></speak>`,
                                        text: '我輸了 😱',
                                    }));
                                    if (conv.screen) {
                                        conv.ask(new BasicCard({
                                            title: '我不知道『' + input + '』後面該接什麼...',
                                            subtitle: '本回合已結束',
                                            text: '共進行' + Total_Count + '次接龍(不計入跳過的詞彙)',
                                        }));
                                        conv.ask(new Suggestions('🔄 重新開始', '👋 掰掰'));
                                        conv.contexts.set(LeaveContexts.parameter, 1);
                                        Total_Count = 0;
                                        input_list = [];
                                        start_game = false;
                                    } else {
                                        conv.close(`<speak><p><s>在這回合中你進行${Total_Count}次接龍，下次見!</s></p></speak>`);
                                        conv.user.storage = {}; //離開同時清除暫存資料
                                    }
                                } else {
                                    sys_word = output_array[parseInt(Math.random() * (output_array.length - 1))];
                                    var temp = pinyin(sys_word, { style: pinyin.STYLE_NORMAL, heteronym: false });
                                    last_word = transform_library[temp[sys_word.length - 1][0]];

                                    if (input_list.indexOf(sys_word) !== -1) {
                                        menu = false;
                                        question_output = false;
                                        end_game = true;
                                        reported = false;
                                        conv.ask(new SimpleResponse({
                                            speech: `<speak><p><s>可惡</s><s>我不小心說了曾經說過的詞，你贏我了呢!</s></p></speak>`,
                                            text: '我輸了 😱',
                                        }));
                                        if (conv.screen) {
                                            conv.ask(new BasicCard({
                                                title: '沒想到『' + sys_word + '』已經說過了',
                                                subtitle: '本回合已結束',
                                                text: '共進行' + Total_Count + '次接龍(不計入跳過的詞彙)',
                                            }));
                                            conv.ask(new Suggestions('🔄 重新開始', '👋 掰掰'));
                                            conv.contexts.set(LeaveContexts.parameter, 1);
                                            Total_Count = 0;
                                            input_list = [];
                                            start_game = false;
                                        } else {
                                            conv.close(`<speak><p><s>在這回合中你進行${Total_Count}次接龍，下次見!</s></p></speak>`);
                                            conv.user.storage = {}; //離開同時清除暫存資料
                                        }
                                    } else {

                                        input_list.push(sys_word); //將詞彙存入佇列
                                        output_array = text_library[last_word]; //進入詞彙庫取得對應詞彙

                                        if (typeof output_array === "undefined") {
                                            menu = false;
                                            question_output = false;
                                            end_game = true;
                                            reported = false;

                                            conv.ask(new SimpleResponse({
                                                speech: `<speak><p><s>糟糕<break time="0.2s"/>我所想的${sys_word}是沒辦法接下去的!回合結束!</s></p></speak>`,
                                                text: '我所想的詞是接不下去的，\n因此回合結束拉!',
                                            }));

                                            if (conv.screen) {
                                                conv.ask(new BasicCard({
                                                    title: '我想的『' + sys_word + '』接不下去拉!',
                                                    subtitle: '本回合已結束',
                                                    text: '你共進行' + Total_Count + '次接龍(不計入跳過的詞彙)',
                                                }));
                                                conv.ask(new Suggestions('🔄 重新開始', '👋 掰掰'));
                                                conv.contexts.set(LeaveContexts.parameter, 1);
                                                Total_Count = 0;
                                                input_list = [];
                                                start_game = false;
                                            } else {
                                                conv.close(`<speak><p><s>在這回合中你進行${Total_Count}次接龍，下次見!</s></p></speak>`);
                                                conv.user.storage = {}; //離開同時清除暫存資料
                                            }
                                        } else {
                                            conv.ask(new SimpleResponse({
                                                speech: `<speak><p><s>${sys_word}</s></p></speak>`,
                                                text: return_array[parseInt(Math.random() * 4)],
                                            }));

                                            conv.noInputs = ["我剛剛說的是" + sys_word + "，請說以" + last_word + "為開頭的詞彙", "現在的詞彙是" + sys_word + "，請繼續接下去", "抱歉，由於您一直沒有回應。因此遊戲到此結束。你在這回合進行" + Total_Count + "次接龍，我們下次見。"];

                                            conv.ask(new BasicCard({
                                                title: '『' + sys_word + '』',
                                                subtitle: '請輸入開頭讀音是「' + last_word + '」的詞彙\n符合條件的一、二、三、四聲皆可',
                                                text: '_[!]你目前剩下' + (3 - jumpcount) + '次跳過機會_',
                                                buttons: new Button({
                                                    title: '在《萌典》上看這個詞彙的條目',
                                                    url: 'https://www.moedict.tw/' + sys_word,
                                                }),
                                            }));

                                            if (jumpcount <= 2) { conv.ask(new Suggestions('跳過這個詞')); }
                                            conv.ask(new Suggestions('放棄本回合'));
                                        }
                                    }
                                }
                            } else {
                                menu = false;
                                question_output = false;
                                end_game = true;
                                reported = false;

                                output_array = text_library[last_word]; //進入詞彙庫取得對應詞彙
                                sys_suggest = output_array[parseInt(Math.random() * (output_array.length - 1))];

                                if (typeof output_array === "undefined") { subtitle_suggest = '我找不到...'; } else { subtitle_suggest = '有『' + sys_suggest + '』。'; }

                                conv.ask(new SimpleResponse({
                                    speech: `<speak><p><s>居居<break time="0.2s"/>你輸入的${input}重複囉!</s><s>回合結束!</s></p></speak>`,
                                    text: '你輸入重複的詞，因此回合結束拉!',
                                }));
                                if (conv.screen) {
                                    conv.ask(new BasicCard({
                                        title: '『' + input + '』已經輸入過囉!',
                                        subtitle: '本回合已結束 • 共進行' + Total_Count + '次接龍\n\n✮增強功力：\n以「' + last_word + '」開頭的詞彙' + subtitle_suggest,
                                    }));
                                    conv.ask(new Suggestions('🔄 重新開始', '👋 掰掰'));
                                    conv.contexts.set(LeaveContexts.parameter, 1);
                                    Total_Count = 0;
                                    input_list = [];
                                    start_game = false;
                                } else {
                                    conv.user.storage = {}; //離開同時清除暫存資料	
                                    conv.close(`<speak><p><s>在這回合中你進行${Total_Count}次接龍，下次見!</s></p></speak>`);
                                }
                            }
                        }
                    }
                }
            }
        } else if (menu === false && end_game === false && question_output === true && reported === true) {
            reported = false;
            conv.ask(new SimpleResponse({
                speech: `<speak><p><s>好的!我剛剛說的是<break time="0.2s"/>${sys_word}，繼續接下去八!</s></p></speak>`,
                text: 'OK，我們繼續進行!',
            }));

            conv.ask(new BasicCard({
                title: '『' + sys_word + '』',
                subtitle: '請輸入開頭讀音是「' + last_word + '」的詞彙\n符合條件的一、二、三、四聲皆可',
                text: '_[!]你目前剩下' + (3 - jumpcount) + '次跳過機會_',
                buttons: new Button({
                    title: '在《萌典》上看這個詞彙的條目',
                    url: 'https://www.moedict.tw/' + sys_word,
                }),
            }));

            if (jumpcount <= 2) { conv.ask(new Suggestions('跳過這個詞')); }
            conv.ask(new Suggestions('放棄本回合'));
        } else if (menu === false && end_game === true && question_output === true && reported === true) {
            menu = false;
            question_output = false;
            end_game = true;
            reported = false;
            conv.ask(new SimpleResponse({
                speech: `<speak><p><s>你的回合已經結束了，請問你還要再玩一次嗎?</s></p></speak>`,
                text: '請問你還要再玩一次嗎?',
            }));
            conv.ask(new Suggestions('🔄 重新開始', '👋 掰掰'));
            conv.contexts.set(LeaveContexts.parameter, 1);
        } else if (menu === false && end_game === true && question_output === false && reported === false) {
            conv.ask(new SimpleResponse({
                speech: `<speak><p><s>不好意思，我沒聽清楚。\n</s><s>請試著說<break time="0.2s"/>重新開始<break time="0.2s"/>或<break time="0.2s"/>掰掰<break time="0.2s"/>來確認你的操作。</s></p></speak>`,
                text: '抱歉，我不懂你的意思。\n請點擊建議卡片來確認你的操作。'
            }));
            conv.ask(new Suggestions('🔄 重新開始', '👋 掰掰'));
            conv.contexts.set(LeaveContexts.parameter, 1);
        } else {
            conv.ask(new SimpleResponse({
                speech: "本服務需要您進一步進行設定才能繼續進行，請依照下述步驟開啟「網路與應用程式」功能。才能獲得個人化體驗喔!",
                text: '請進行相關設定，才能進行遊戲!',
            }));
            conv.close(new BasicCard({
                image: new Image({ url: 'https://raw.githubusercontent.com/hank199599/Google-Assistant-APP/master/%E8%AE%80%E9%9F%B3%E6%8E%A5%E9%BE%8D/assets/P5FWCbe.png', alt: 'Pictures', }),
                title: '錯誤：您需要進行設定',
                subtitle: '為了給您個人化的遊戲體驗，請進行設定。\n\n1. 點擊下方按鈕前往Google帳戶設定\n2.	開啟「網路和應用程式活動」功能\n3.	開啟「包括 Chrome 瀏覽記錄以及採用 Google 服務的網站、應用程式和裝置中的活動記錄」\n',
                buttons: new Button({ title: 'Google活動控制項', url: "https://myaccount.google.com/activitycontrols?pli=1", }),
                display: 'CROPPED',
            }));
        }
    } else {
        conv.ask(new SimpleResponse({
            speech: "在開始前，您需要啟用Google助理，我才能提供你個人化體驗喔!",
            text: '請進行相關設定，才能進行遊戲!',
        }));
        conv.close(new BasicCard({
            image: new Image({ url: 'https://raw.githubusercontent.com/hank199599/Google-Assistant-APP/master/%E8%AE%80%E9%9F%B3%E6%8E%A5%E9%BE%8D/assets/assistant_48dp.png', alt: 'Pictures', }),
            title: '錯誤：您需要進行設定',
            subtitle: 'Google 助理需要授權(請點擊「開始使用」)。\n授權後我才能為你儲存個人對話狀態，\n藉此提升你的使用體驗!\n',
            display: 'CROPPED',
        }));
    }

    conv.user.storage.menu = menu;
    conv.user.storage.end_game = end_game;
    conv.user.storage.question_output = question_output;
    conv.user.storage.sys_word = sys_word;
    conv.user.storage.last_word = last_word;
    conv.user.storage.input_list = input_list;
    conv.user.storage.Total_Count = Total_Count;
    conv.user.storage.start_game = start_game;
    conv.user.storage.reported = reported;
    conv.user.storage.jumpcount = jumpcount;
    conv.user.storage.wrong_count = wrong_count;

});

app.intent('回報辨識錯誤', (conv) => {
    menu = conv.user.storage.menu;
    end_game = conv.user.storage.end_game;
    question_output = conv.user.storage.question_output;
    last_word = conv.user.storage.last_word;
    sys_word = conv.user.storage.sys_word;
    input_list = conv.user.storage.input_list;
    Total_Count = conv.user.storage.Total_Count;
    start_game = conv.user.storage.start_game;
    reported = conv.user.storage.reported;

    reported = true;
    if (menu === false && end_game === true && question_output === false) { question_output = true; }

    conv.ask(new SimpleResponse({
        speech: `<speak><p><s>本服務的語音辨識由Google執行，若發生錯誤請依照下方說明進行反饋!</s></p></speak>`,
        text: '請依照下方說明進行反饋。',
    }));

    conv.ask(new BasicCard({
        image: new Image({ url: 'https://www.gstatic.com/myactivity/udc/vaa-720x300-22c8ffadc520f71278ef6a567753598f.png', alt: 'Pictures', }),
        title: '反饋流程說明',
        subtitle: '1. 前往Google帳戶設定(下方按鈕)\n2.	查看輸入紀錄，查找辨識錯誤的項目\n3.選取右方的「更多」圖示 > [詳細資訊] \n4.選取右方的「更多」圖示 > [提供意見] \n5.撰寫您的意見並提交給Google',
        buttons: new Button({
            title: 'Google 助理活動',
            url: 'https://myactivity.google.com/item?restrict=assist&hl=zh_TW&utm_source=privacy-advisor-assistant&embedded=1&pli=1',
        }),
        display: 'CROPPED',
    }));
    conv.ask(new Suggestions('繼續進行接龍', '放棄本回合'));

    conv.user.storage.menu = menu;
    conv.user.storage.end_game = end_game;
    conv.user.storage.question_output = question_output;
    conv.user.storage.sys_word = sys_word;
    conv.user.storage.last_word = last_word;
    conv.user.storage.input_list = input_list;
    conv.user.storage.Total_Count = Total_Count;
    conv.user.storage.start_game = start_game;
    conv.user.storage.reported = reported;

});

app.intent('繼續進行', (conv) => {
    menu = conv.user.storage.menu;
    end_game = conv.user.storage.end_game;
    question_output = conv.user.storage.question_output;
    last_word = conv.user.storage.last_word;
    sys_word = conv.user.storage.sys_word;
    input_list = conv.user.storage.input_list;
    Total_Count = conv.user.storage.Total_Count;
    start_game = conv.user.storage.start_game;
    reported = conv.user.storage.reported;

    if (menu === false && end_game === false && question_output === true && reported === true) {
        reported = false;
        conv.noInputs = ["我剛剛說的是" + sys_word + "，請說以" + last_word + "為開頭的詞彙", "現在的詞彙是" + sys_word + "，請繼續接下去", "抱歉，由於您一直沒有回應。因此遊戲到此結束。你在這回合進行" + Total_Count + "次接龍，我們下次見。"];

        conv.ask(new SimpleResponse({
            speech: `<speak><p><s>好的!我剛剛說的是<break time="0.2s"/>${sys_word}，繼續接下去八!</s></p></speak>`,
            text: 'OK，我們繼續進行!',
        }));

        conv.ask(new BasicCard({
            title: '『' + sys_word + '』',
            subtitle: '請輸入開頭讀音是「' + last_word + '」的詞彙\n符合條件的一、二、三、四聲皆可',
            text: '_[!]你目前剩下' + (3 - jumpcount) + '次跳過機會_',
            buttons: new Button({
                title: '在《萌典》上看這個詞彙的條目',
                url: 'https://www.moedict.tw/' + sys_word,
            }),
        }));

        if (jumpcount <= 2) { conv.ask(new Suggestions('跳過這個詞')); }
        conv.ask(new Suggestions('放棄本回合'));
    } else if (menu === false && end_game === true && question_output === true && reported === true) {
        menu = false;
        question_output = false;
        end_game = true;
        reported = false;
        conv.ask(new SimpleResponse({
            speech: `<speak><p><s>你的回合已經結束了，請問你還要再玩一次嗎?</s></p></speak>`,
            text: '請問你還要再玩一次嗎?',
        }));
        conv.ask(new Suggestions('🔄 重新開始', '👋 掰掰'));
        conv.contexts.set(LeaveContexts.parameter, 1);

    } else {
        conv.ask(new SimpleResponse({
            speech: "本服務需要您進一步進行設定才能繼續進行，請依照下述步驟開啟「網路與應用程式」功能。才能獲得個人化體驗喔!",
            text: '請進行相關設定，才能進行遊戲!',
        }));
        conv.close(new BasicCard({
            image: new Image({ url: 'https://raw.githubusercontent.com/hank199599/Google-Assistant-APP/master/%E8%AE%80%E9%9F%B3%E6%8E%A5%E9%BE%8D/assets/P5FWCbe.png', alt: 'Pictures', }),
            title: '錯誤：您需要進行設定',
            subtitle: '為了給您個人化的遊戲體驗，請進行下述設定：\n\n1. 前往Google帳戶設定\n2.	開啟「網路和應用程式活動」功能\n3.	開啟「包括 Chrome 瀏覽記錄以及採用 Google 服務的網站、應用程式和裝置中的活動記錄」\n',
            buttons: new Button({ title: 'Google活動控制項', url: "https://myaccount.google.com/activitycontrols?pli=1", }),
            display: 'CROPPED',
        }));

    }
    conv.user.storage.menu = menu;
    conv.user.storage.end_game = end_game;
    conv.user.storage.question_output = question_output;
    conv.user.storage.sys_word = sys_word;
    conv.user.storage.last_word = last_word;
    conv.user.storage.input_list = input_list;
    conv.user.storage.Total_Count = Total_Count;
    conv.user.storage.start_game = start_game;
    conv.user.storage.reported = reported;

});

app.intent('結束挑戰', (conv, { end_game }) => {

    menu = conv.user.storage.menu;
    end_game = conv.user.storage.end_game;
    question_output = conv.user.storage.question_output;
    last_word = conv.user.storage.last_word;
    sys_word = conv.user.storage.sys_word;
    input_list = conv.user.storage.input_list;
    Total_Count = conv.user.storage.Total_Count;
    start_game = conv.user.storage.start_game;
    reported = conv.user.storage.reported;
    jumpcount = conv.user.storage.jumpcount;

    menu = false;
    question_output = false;
    end_game = true;
    reported = false;

    output_array = text_library[last_word]; //進入詞彙庫取得對應詞彙

    if (typeof output_array === "undefined") { subtitle_suggest = '我找不到...'; } else {
        sys_word = output_array[parseInt(Math.random() * (output_array.length - 1))];
        subtitle_suggest = '有『' + sys_word + '』。';
    }

    if (typeof Total_Count !== "undefined") {

        if (conv.screen) {
            conv.ask(new SimpleResponse({ speech: `<speak><p><s>你在這回合一共進行${Total_Count}次接龍。</s><s>你要再試一次嗎?</s></p></speak>`, text: '驗收成果' }));

            conv.ask(new BasicCard({
                image: new Image({ url: 'https://raw.githubusercontent.com/hank199599/Google-Assistant-APP/master/%E8%AE%80%E9%9F%B3%E6%8E%A5%E9%BE%8D/assets/eOAyfqS.jpg', alt: 'Pictures', }),
                title: '本回合共進行' + Total_Count + '次接龍',
                subtitle: '不計入跳過的詞彙',
                text: '✮增強功力：  \n以「' + last_word + '」開頭的詞彙' + subtitle_suggest,
                display: 'CROPPED', //更改圖片顯示模式為自動擴展
            }));
            conv.ask(new Suggestions('🔄 重新開始', '👋 掰掰'));
            conv.contexts.set(LeaveContexts.parameter, 1);
        } else {
            subtitle_suggest = replaceString(subtitle_suggest, '『', '<break time="0.3s"/>『');
            conv.close(new SimpleResponse({ speech: `<speak><p><s>以${last_word}開頭的詞彙${subtitle_suggest}</s><s>你在本回合共進行${Total_Count}次接龍。</s><s>下次見!</s></p></speak>`, text: '驗收成果' }));
        }

    } else {
        conv.ask(new SimpleResponse({
            speech: "本服務需要您進一步進行設定才能繼續進行，請依照下述步驟開啟「網路與應用程式」功能。才能獲得個人化體驗喔!",
            text: '請進行相關設定，才能進行遊戲!',
        }));
        conv.close(new BasicCard({
            title: '錯誤：您需要進行設定',
            subtitle: '為了給您個人化的遊戲體驗，請進行設定：\n\n1. 前往Google帳戶設定\n2.	開啟「網路和應用程式活動」功能\n3.	開啟「包括 Chrome 瀏覽記錄以及採用 Google 服務的網站、應用程式和裝置中的活動記錄」\n',
            buttons: new Button({ title: 'Google活動控制項', url: "https://myaccount.google.com/activitycontrols?pli=1", }),

        }));

    }
    conv.user.storage.menu = menu;
    conv.user.storage.end_game = end_game;
    conv.user.storage.question_output = question_output;
    conv.user.storage.sys_word = sys_word;
    conv.user.storage.last_word = last_word;
    conv.user.storage.input_list = input_list;
    conv.user.storage.Total_Count = Total_Count;
    conv.user.storage.start_game = start_game;
    conv.user.storage.reported = reported;
    conv.user.storage.jumpcount = jumpcount;

});

app.intent('跳過題目', (conv) => {

    menu = conv.user.storage.menu;
    end_game = conv.user.storage.end_game;
    question_output = conv.user.storage.question_output;
    last_word = conv.user.storage.last_word;
    sys_word = conv.user.storage.sys_word;
    input_list = conv.user.storage.input_list;
    Total_Count = conv.user.storage.Total_Count;
    start_game = conv.user.storage.start_game;
    reported = conv.user.storage.reported;
    jumpcount = conv.user.storage.jumpcount;

    jumpcount++;
    conv.user.storage.wrong_count = 0;

    if (jumpcount <= 3) {

        if ((3 - jumpcount) !== 0) {
            conv.ask(new SimpleResponse({
                speech: `<speak><p><s>好的</s><s>你現在剩下${3 - jumpcount}次跳ㄍㄨㄛˋ的機會!</s></p></speak>`,
                text: '好的，你還有' + (3 - jumpcount) + '次跳過的機會'
            }));
        } else {
            conv.ask(new SimpleResponse({
                speech: `<speak><p><s>提醒你</s><s>你已經用完所有跳ㄍㄨㄛˋ的機會!</s></p></speak>`,
                text: '你已經用完所有跳過的機會'
            }));
        }

        output_array = text_library[last_word]; //進入詞彙庫取得對應詞彙

        if (output_array === undefined) {
            menu = false;
            question_output = false;
            end_game = true;
            reported = false;
            conv.ask(new SimpleResponse({
                speech: `<speak><p><s>看來這個詞彙是接不下去的，回合結束!</s></p></speak>`,
                text: '這個詞是接不下去的，回合結束',
            }));
            if (conv.screen) {
                conv.ask(new BasicCard({
                    title: '看來『' + sys_word + '』是接不下去的',
                    subtitle: '本回合已結束',
                    text: '共進行' + Total_Count + '次接龍(不計入跳過的詞彙)',
                }));
                conv.ask(new Suggestions('🔄 重新開始', '👋 掰掰'));
                conv.contexts.set(LeaveContexts.parameter, 1);
                Total_Count = 0;
                input_list = [];
                start_game = false;
            } else {
                conv.user.storage = {}; //離開同時清除暫存資料	
                conv.close(`<speak><p><s>在這回合中你進行${Total_Count}次接龍，下次見!</s></p></speak>`);
            }

        } else {
            var pre_word = sys_word;
            sys_word = output_array[parseInt(Math.random() * (output_array.length - 1))];
            var temp = pinyin(sys_word, { style: pinyin.STYLE_NORMAL, heteronym: false });
            last_word = transform_library[temp[sys_word.length - 1][0]];

            if (input_list.indexOf(sys_word) !== -1) {
                menu = false;
                question_output = false;
                end_game = true;
                reported = false;
                conv.ask(new SimpleResponse({
                    speech: `<speak><p><s>糟糕</s><s>我不小心選了曾經說過的詞，回合結束!</s></p></speak>`,
                    text: '回合已結束',
                }));
                if (conv.screen) {
                    conv.ask(new BasicCard({
                        title: '『' + sys_word + '』是說過的詞',
                        subtitle: '本回合已結束',
                        text: '共進行' + Total_Count + '次接龍(不計入跳過的詞彙)',
                    }));
                    conv.ask(new Suggestions('🔄 重新開始', '👋 掰掰'));
                    conv.contexts.set(LeaveContexts.parameter, 1);
                    Total_Count = 0;
                    input_list = [];
                    start_game = false;
                } else {
                    conv.user.storage = {}; //離開同時清除暫存資料	
                    conv.close(`<speak><p><s>在這回合中你進行${Total_Count}次接龍，下次見!</s></p></speak>`);
                }
            } else {

                input_list.push(sys_word); //將詞彙存入佇列
                output_array = text_library[last_word]; //進入詞彙庫取得對應詞彙

                if (typeof output_array === "undefined") {
                    menu = false;
                    question_output = false;
                    end_game = true;
                    reported = false;

                    conv.ask(new SimpleResponse({
                        speech: `<speak><p><s>糟糕<break time="0.2s"/>我所選的${sys_word}是沒辦法接下去的!回合結束!</s></p></speak>`,
                        text: '我所想的詞是接不下去的，\n因此回合結束拉!',
                    }));
                    if (conv.screen) {
                        conv.ask(new BasicCard({
                            title: '我想的『' + sys_word + '』接不下去拉!',
                            subtitle: '本回合已結束',
                            text: '你共進行' + Total_Count + '次接龍(不計入跳過的詞彙)',
                        }));
                        conv.ask(new Suggestions('🔄 重新開始', '👋 掰掰'));
                        conv.contexts.set(LeaveContexts.parameter, 1);
                        Total_Count = 0;
                        input_list = [];
                        start_game = false;
                    } else {
                        conv.user.storage = {}; //離開同時清除暫存資料	
                        conv.close(`<speak><p><s>在這回合中你進行${Total_Count}次接龍，下次見!</s></p></speak>`);
                    }
                } else {
                    conv.ask(new SimpleResponse({
                        speech: `<speak><p><s>${pre_word}後頭可以接${sys_word}<break time="0.5s"/>接著，請你繼續接下去</s></p></speak>`,
                        text: "「" + pre_word + "」可以接「" + sys_word + "」， \n請試著繼續接下去。",
                    }));
                    conv.noInputs = ["我剛剛說的是" + sys_word + "，請說以" + last_word + "為開頭的詞彙", "現在的詞彙是" + sys_word + "，請繼續接下去", "抱歉，由於您一直沒有回應。因此遊戲到此結束。你在這回合進行" + Total_Count + "次接龍，我們下次見。"];

                    conv.ask(new BasicCard({
                        title: '『' + sys_word + '』',
                        subtitle: '請輸入開頭讀音是「' + last_word + '」的詞彙\n符合條件的一、二、三、四聲皆可',
                        text: '_[!]你目前剩下' + (3 - jumpcount) + '次跳過機會_',
                        buttons: new Button({
                            title: '在《萌典》上看這個詞彙的條目',
                            url: 'https://www.moedict.tw/' + sys_word,
                        }),
                    }));

                    if (jumpcount <= 2) { conv.ask(new Suggestions('跳過這個詞')); }
                    conv.ask(new Suggestions('放棄本回合'));
                }
            }
        }
    } else {

        menu = false;
        question_output = false;
        end_game = true;
        reported = false;

        output_array = text_library[last_word]; //進入詞彙庫取得對應詞彙

        if (typeof output_array === "undefined") { subtitle_suggest = '我找不到...'; } else {
            sys_word = output_array[parseInt(Math.random() * (output_array.length - 1))];
            subtitle_suggest = '有『' + sys_word + '』。';
        }

        if (conv.screen) {
            conv.ask(new SimpleResponse({ speech: `<speak><p><s>你在這回合一共進行${Total_Count}次接龍。</s><s>你要再試一次嗎?</s></p></speak>`, text: '驗收成果' }));

            conv.ask(new BasicCard({
                image: new Image({ url: 'https://raw.githubusercontent.com/hank199599/Google-Assistant-APP/master/%E8%AE%80%E9%9F%B3%E6%8E%A5%E9%BE%8D/assets/eOAyfqS.jpg', alt: 'Pictures', }),
                title: '本回合共進行' + Total_Count + '次接龍',
                subtitle: '不計入跳過的詞彙',
                text: '✮增強功力：  \n以「' + last_word + '」開頭的詞彙' + subtitle_suggest,
                display: 'CROPPED', //更改圖片顯示模式為自動擴展
            }));
            conv.ask(new Suggestions('🔄 重新開始', '👋 掰掰'));
            conv.contexts.set(LeaveContexts.parameter, 1);
        } else {
            subtitle_suggest = replaceString(subtitle_suggest, '『', '<break time="0.3s"/>『');
            conv.close(new SimpleResponse({ speech: `<speak><p><s>以${last_word}開頭的詞彙${subtitle_suggest}</s><s>你在本回合共進行${Total_Count}次接龍。</s><s>下次見!</s></p></speak>`, text: '驗收成果' }));
        }
    }

    conv.user.storage.menu = menu;
    conv.user.storage.end_game = end_game;
    conv.user.storage.question_output = question_output;
    conv.user.storage.sys_word = sys_word;
    conv.user.storage.last_word = last_word;
    conv.user.storage.input_list = input_list;
    conv.user.storage.Total_Count = Total_Count;
    conv.user.storage.start_game = start_game;
    conv.user.storage.reported = reported;
    conv.user.storage.jumpcount = jumpcount;

});

app.intent('重覆題目', (conv) => {

    menu = conv.user.storage.menu;
    end_game = conv.user.storage.end_game;
    question_output = conv.user.storage.question_output;
    last_word = conv.user.storage.last_word;
    sys_word = conv.user.storage.sys_word;
    input_list = conv.user.storage.input_list;
    Total_Count = conv.user.storage.Total_Count;
    start_game = conv.user.storage.start_game;
    reported = conv.user.storage.reported;
    jumpcount = conv.user.storage.jumpcount;

    if (menu === false && end_game === false && question_output === true && reported === false) {

        var repeat_array = ["仔細聽好囉", "OK，張大耳朵仔細聽好啦", "沒問題", "當然可以啦", "好的"]

        conv.ask(new SimpleResponse({
            speech: `<speak><p><s>${repeat_array[parseInt(Math.random() * 4)]}，我剛剛說的是<break time="0.5s"/>${sys_word}</s></p></speak>`,
            text: 'OK，下面是我剛剛所說的詞彙!',
        }));

        conv.ask(new BasicCard({
            title: '『' + sys_word + '』',
            subtitle: '請輸入開頭讀音是「' + last_word + '」的詞彙\n符合條件的一、二、三、四聲皆可',
            text: '_[!]你目前剩下' + (3 - jumpcount) + '次跳過機會_',
            buttons: new Button({
                title: '在《萌典》上看這個詞彙的條目',
                url: 'https://www.moedict.tw/' + sys_word,
            }),
        }));

        if (jumpcount <= 2) { conv.ask(new Suggestions('跳過這個詞')); }
        conv.ask(new Suggestions('放棄本回合'));
    } else if (menu === false && end_game === false && question_output === true && reported === true) {
        reported = false;
        conv.ask(new SimpleResponse({
            speech: `<speak><p><s>好的!我剛剛說的是<break time="0.2s"/>${sys_word}，繼續接下去八!</s></p></speak>`,
            text: 'OK，我們繼續進行!',
        }));

        conv.ask(new BasicCard({
            title: '『' + sys_word + '』',
            subtitle: '請輸入開頭讀音是「' + last_word + '」的詞彙\n符合條件的一、二、三、四聲皆可',
            text: '_[!]你目前剩下' + (3 - jumpcount) + '次跳過機會_',
            buttons: new Button({
                title: '在《萌典》上看這個詞彙的條目',
                url: 'https://www.moedict.tw/' + sys_word,
            }),
        }));

        if (jumpcount <= 2) { conv.ask(new Suggestions('跳過這個詞')); }
        conv.ask(new Suggestions('放棄本回合'));
    } else if (menu === false && end_game === true && question_output === true && reported === true) {
        menu = false;
        question_output = false;
        end_game = true;
        reported = false;
        conv.ask(new SimpleResponse({
            speech: `<speak><p><s>你的回合已經結束了，請問你還要再玩一次嗎?</s></p></speak>`,
            text: '請問你還要再玩一次嗎?',
        }));
        conv.ask(new Suggestions('🔄 重新開始', '👋 掰掰'));
        conv.contexts.set(LeaveContexts.parameter, 1);

    }

    conv.user.storage.menu = menu;
    conv.user.storage.end_game = end_game;
    conv.user.storage.question_output = question_output;
    conv.user.storage.sys_word = sys_word;
    conv.user.storage.last_word = last_word;
    conv.user.storage.input_list = input_list;
    conv.user.storage.Total_Count = Total_Count;
    conv.user.storage.start_game = start_game;
    conv.user.storage.reported = reported;
    conv.user.storage.jumpcount = jumpcount;

});

app.intent('結束對話', (conv) => {

    conv.user.storage = {}; //離開同時清除暫存資料
    conv.ask('希望你玩得愉快!');
    conv.ask(new SimpleResponse({ speech: '下次見', text: '下次見 👋', }));
    conv.close(new BasicCard({
        title: '感謝您的使用!',
        text: '如果有任何需要改進的地方，  \n歡迎到簡介頁面評分或給予反饋，謝謝!',
        buttons: new Button({ title: '開啟本程式的商店頁面', url: 'https://assistant.google.com/services/a/uid/000000f85bd23edc', }),
    }));

});



exports.easy_text_solitaire = functions.https.onRequest(app);