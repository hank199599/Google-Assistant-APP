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
const replaceString = require('replace-string');
var pinyin = require("pinyin");
const app = dialogflow({ debug: true });

var transform_library = require('./cjst.json');
var idiom_library = require('./idiom_library.json');
var idiom_varify = require('./idiom_varify.json');
var brief_explain = require('./idiom_brief_explain.json')

var text_start = ["藕斷絲連", "萍水相逢", "堅壁清野", "緣木求魚", "快刀斬亂麻", "昭然若揭", "汗牛充棟", "略識之無", "鶉衣百結", "茅塞頓開", "信口雌黃", "頓開茅塞", "差強人意", "北轅適楚", "旗鼓相當", "忘恩負義", "鶴立雞群", "露出馬腳", "推心置腹", "孫山名落", "斗量車載", "飾非文過", "片言九鼎", "針鋒相對", "司空見慣", "腸肥腦滿", "幸災樂禍", "精益求精", "含沙射影", "歌功頌德", "處心積慮", "高枕無憂", "濫竽充數", "海市蜃樓", "尊俎折衝", "游刃有餘", "切磋琢磨", "合浦珠還", "優柔寡斷", "羽毛未豐", "撲朔迷離", "呆若木雞", "駿馬加鞭", "帷幄運籌", "松枯石爛", "慷慨解囊", "石破天驚", "按圖索驥", "袖手旁觀", "秦鏡高懸", "脣亡齒寒", "水落石出", "燃眉之急", "甘拜下風", "居安思危", "杞人憂天", "滔滔不絕", "偃旗息鼓", "裹足不前", "土崩瓦解", "影不離形", "苟且偷安", "待價而沽", "揭竿而起", "欺世盜名", "貽笑大方", "舉一反三", "騎虎難下", "牢補羊亡", "夜郎自大", "秀外慧中", "博古通今", "入木三分", "力不從心", "得心應手", "蜀犬吠日", "行將就木", "九牛一毛", "拖泥帶水", "抱薪救火", "喘月吳牛", "流芳百世", "疑信參半", "朝三暮四", "浪靜風平", "矯枉過正", "民不聊生", "羊質虎皮", "歷歷在目", "亭亭玉立", "莫逆之交", "喋喋不休", "恐後爭先", "掠影浮光", "委曲求全", "志同道合", "迥然不同", "陳陳相因", "阿其所好", "絕無僅有", "醉生夢死", "予取予求", "槁木死灰", "歧路亡羊", "嘔心瀝血", "飽食豐衣", "草木皆兵", "趁火打劫", "活剝生吞", "小巫見大巫", "坦腹東床", "親痛仇快", "大器晚成", "依然故我", "猶豫不決", "全軍覆沒", "亡羊補牢", "瀝膽披肝", "圖窮匕見", "啞口無言", "臉紅耳赤", "畫蛇添足", "孑然一身", "少不更事", "守株待兔", "逆來順受", "越俎代庖", "攸向靡披", "一毛不拔", "柳暗花明", "窮兵黷武", "鷸蚌相爭", "探囊取物", "退避三舍", "揠苗助長", "爐火純青", "妙手回春", "從善如流", "慣作非為", "吉人天相", "戶限為穿", "輪奐之美", "芒刺在背", "千方百計", "獨當一面", "因噎廢食", "武偃文修", "匪懈夙宵", "碧玉小家", "無地自容", "踣不復振", "罄竹難書", "沆瀣一氣", "聚精會神", "言不由衷", "指鹿為馬", "有備無患", "短兵相接", "履薄臨深", "傷天害理", "皓齒明眸", "烏合之眾", "默化潛移", "零丁孤苦", "眈眈虎視", "驚弓之鳥", "鑿空指鹿", "多多益善", "沾沾自喜", "趾高氣揚", "望梅止渴", "玉石俱焚", "標新立異", "東窗事發", "銜環結草", "支吾其詞", "撞騙招搖", "席不暇暖", "負荊請罪", "本末倒置", "樂不思蜀", "簞食瓢飲", "欲蓋彌彰", "吶喊搖旗", "竭澤而漁", "江郎才盡", "慘不忍睹", "置若罔聞", "聞雞起舞", "花言巧語", "岸然道貌", "避重就輕", "瓦釜雷鳴", "良莠不齊", "舞文弄墨", "炙手可熱", "嬌生慣養", "遠慮深謀", "摩頂放踵", "鑄成大錯", "蕭規曹隨", "頑石點頭", "車水馬龍", "同舟共濟", "張冠李戴", "請君入甕", "義不容辭", "鳥盡弓藏", "洗耳恭聽", "談虎色變", "冥頑不靈", "成竹在胸", "躁動輕舉", "膾炙人口", "隋珠暗投", "虛張聲勢", "倚老賣老", "瞻前顧後", "格格不入", "怪事咄咄", "正襟危坐", "法無二門", "螳臂當車", "知難而退", "內荏外剛", "忠言逆耳", "死灰復燃", "馮河暴虎", "奇貨可居", "相敬如賓", "口若懸河", "揮金如土", "清風兩袖", "帶水拖泥", "杳如黃鶴", "忍辱負重", "名落孫山", "群策群力", "文過飾非", "棟充牛汗", "惱羞成怒", "恣心所欲", "攢花簇錦", "虎頭蛇尾", "駕輕就熟", "泥牛入海", "喜出望外", "鴉雀無聲", "臨渴掘井", "澄源正本", "任勞任怨", "問道於盲", "熟能生巧", "悄不聞鴉", "神魂顛倒", "侃侃而談", "繁文縟節", "餘音繞梁", "劍拔弩張", "捷足先登", "落井下石", "雲翻雨覆", "邯鄲學步", "咄咄逼人", "患得患失", "後來居上", "即景生情", "胡思亂想", "攀龍附鳳", "粗枝大葉", "迫不及待", "痛心疾首", "拋磚引玉", "惜墨如金", "盡忠報國", "怨聲載道", "勞燕分飛", "爆燥如雷", "黔驢技窮", "物以類聚", "唱高和寡", "魂不附體", "雷厲風行", "否極泰來", "刻舟求劍", "疾言厲色", "好逸惡勞", "易如反掌", "走馬看花", "吳牛喘月", "豢虎貽殃", "馬首是瞻", "蚍蜉撼樹", "囊空如洗", "所向披靡", "殺身成仁", "既往不咎", "路不拾遺", "理直氣壯", "戰戰兢兢", "觸類旁通", "尋花問柳", "眼高手低", "防微杜漸", "似漆如膠", "案舉齊眉", "仰人鼻息", "積重難返", "愛屋及烏", "四面楚歌", "論定棺蓋", "敷衍塞責", "恰中下懷", "食古不化", "遺臭萬年", "玩物喪志", "買櫝還珠", "養精蓄銳", "蠢蠢欲動", "怒髮衝冠", "亦步亦趨", "磨杵成針", "右盼左顧", "香憐玉惜", "殘息奄奄", "華而不實", "桂薪珠米", "眾志成城", "奪胎換骨", "斬草除根", "寥若晨星", "懷才不遇", "溫故知新", "搖尾乞憐", "焦頭爛額", "曇花一現", "暮鼓晨鐘", "初出茅廬", "呼風喚雨", "拉朽摧枯", "狐假虎威", "梁上君子", "體貼入微", "排難解紛", "挈領提綱", "燕雀處堂", "再接再厲", "腹背受敵", "奈如之何", "孺子可教", "臥薪嘗膽", "青出於藍", "傍人門戶", "擲鼠忌器", "襟捉肘露", "疊床架屋", "垂涎三尺", "觀止之嘆", "蠡測管窺", "五體投地", "感激涕零", "破鏡重圓", "巧取豪奪", "強弩之末", "古道熱腸", "雞鳴狗盜", "打草驚蛇", "衣錦還鄉", "平步青雲", "回頭是岸", "城下之盟", "聲東擊西", "兵不血刃", "刮目相看", "向壁虛造", "僵李代桃", "漸入佳境", "旦旦信誓", "孤注一擲", "手舞足蹈", "曲突徙薪", "削足適履", "涓滴歸公", "蛇影杯弓", "據經引傳", "倒行逆施", "首鼠兩端", "唾面自乾", "背道而馳", "匹夫之勇", "國色天香", "適可而止", "李代桃僵", "箕裘之紹", "威風凜凜", "升堂入室", "齊眉舉案", "殷鑒不遠", "兢兢業業", "乘風破浪", "以訛傳訛", "豁然開朗", "錙銖必較", "米珠薪桂", "運籌帷幄", "登峰造極", "洛陽紙貴", "罔知所措", "拾人牙慧", "波平風靜", "棋布星羅", "根深蒂固", "肝膽相照", "捉襟見肘", "驢心狗肺", "愁眉不展", "腰纏萬貫", "白駒過隙", "剛愎自用", "聽天由命", "計較錙銖", "提綱挈領", "發人深省", "陸離光怪", "才高八斗", "枕戈待旦", "筆誅口伐", "惡貫滿盈", "集思廣益", "暫勞永逸", "沫相濡", "止渴望梅", "鵬程萬里", "軒然大波", "現身說法", "丹心耿耿", "形單影隻", "困獸猶鬥", "恨相知晚", "笑裡藏刀", "逐臭之夫", "覆水難收", "借花獻佛", "狽因狼突", "尾大不掉", "門可羅雀", "銖銖較量", "肅然起敬", "鞭長莫及", "模稜兩可", "咎由自取", "靡靡之音", "井井有條", "如火如荼", "返老還童", "伯仲之間", "賓至如歸", "投筆從戎", "胸有成竹", "順水推舟", "移風易俗", "管中窺豹", "輾轉反側", "鋌而走險", "步步為營", "結草銜環", "姑妄言之", "星羅棋布", "永垂不朽", "喪心病狂", "假公濟私", "徒有其表", "故步自封", "各自為政", "前倨後恭", "盲人摸象", "彬彬文質", "尸位素餐", "南轅北轍", "街談巷議", "逃之夭夭", "招搖過市", "咬文嚼字", "魯魚亥豕", "津津有味", "利令智昏", "血流漂杵", "闇度陳倉", "骨瘦如柴", "肉袒負荊", "加體黃袍", "出奇制勝", "對牛彈琴", "決一雌雄", "世外桃源", "罪不容誅", "欣欣向榮", "半途而廢", "素餐尸位", "揚湯止沸", "野心勃勃", "畢精竭思", "比比皆是", "孜孜不倦", "墨守成規", "求全責備", "沈魚落雁", "穿鑿附會", "僕僕風塵", "壽終正寢", "玄機妙算", "家喻戶曉", "西山日薄", "休戚相關", "目不識丁", "秋毫無犯", "楊花水性", "折衝尊俎", "俱傷兩敗", "陽奉陰違", "寶花亂墜", "毛遂自薦", "引經據典", "腦滿腸肥", "圓鑿方枘", "冠冕堂皇", "生吞活剝", "來龍去脈", "克紹箕裘", "普天同慶", "肌無完膚", "覺我形穢", "敵愾同仇", "滄海桑田", "施教因材", "顧此失彼", "器宇軒昂", "造極登峰", "興高采烈", "明察秋毫", "智昏菽麥", "窺豹一斑", "嗤之以鼻", "見異思遷", "何足掛齒", "枉費心機", "新陳代謝", "噤若寒蟬", "六神無主", "三令五申", "鳳毛麟角", "蓋棺論定", "節外生枝", "耳濡目染", "換骨奪胎", "萬籟俱寂", "勒馬懸崖", "緘口如瓶", "坎井之蛙", "狗尾續貂", "髮引千鈞", "吐絲自縛", "姍姍來遲", "截趾適屨", "放蕩不羈", "危如累卵", "史無前例", "弄巧成拙", "敝帚自珍", "上行下效", "迷離撲朔", "數典忘祖", "反覆無常", "遇人不淑", "攧撲不碎", "逢場作戲", "沽名釣譽", "化險為夷", "難兄難弟", "雕蟲小技", "進退維谷", "始作俑者", "淋漓盡致", "事半功倍", "羅雀門庭", "終南捷徑", "寡廉鮮恥", "兔死狗烹", "吹毛求疵", "不學無術", "十惡不赦", "當頭棒喝", "樹倒猢猻散", "身敗名裂", "要言不煩", "撼樹蚍蜉", "滿腹經綸", "循循善誘", "兄弟鬩牆", "寅吃卯糧"];
var Total_Count = 0;
var sys_word = "";
var input_word = "";
var last_word = "";
var first_word = "";
var output_array = "";
var menu = false; //判別是否在歡迎頁面
var end_game = false; //判別遊戲是否已結束
var question_output = false; //判別是否拿到出題目許可
var end_game = false; //判別是否輸入許可的答案
var input_list = new Array([]);;
var start_game = false;
var inputarray = ["🔄 重新開始", "再來一次", "再玩一次", "再試一次", "再來", "重新開始", "重來", "好", "OK", "可以", "再一次", "好啊"];
var wrong_array = "";
var return_array = ["準備接招吧!", "小菜一碟 😎", "能接的成語顯而易見呢!", "這還不簡單?", "輕而易舉的問題"];
var jumpcount = "";
var wrong_count = 0;

const Contexts = {
    Leave: 'bye',
    Answer: 'answer',
    Explain: 'explain',
    Counter: 'hint_count',
    Get_hint: 'get_hint',
    Skip: 'skip',
    Quit: 'leave',
    Repeat: 'repeat'
}

var example_array = [
    ['登峰造極', '擊轂摩肩', '姦淫擄掠', '掠地攻城', '承顏候色'],
    ['豁然開朗', '浪跡天涯', '睚眥之隙', '惜墨如金', '斤斤計較'],
    ['少不更事', '視若無睹', '獨占鰲頭', '偷饞抹嘴', '罪孽深重'],
    ['似漆如膠', '攪海翻江', '將李代桃', '陶犬瓦雞', '雞鳴犬吠'],
    ['冠冕堂皇', '恍如隔世', '石沉大海', '海北天南', '南阮北阮'],
    ['拉朽摧枯', '苦盡甘來', '來龍去脈', '賣弄玄虛', '虛張形勢'],
    ['耳濡目染', '燃眉之急', '肌無完膚', '腹便便', '變生肘腋'],
    ['加體黃袍', '拋金棄鼓', '古貌古心', '心粗膽大', '打主意'],
    ['養精蓄銳', '銳未可當', '當風秉燭', '舳艫相繼', '積玉堆金'],
    ['滿腹經綸', '論斤估兩', '量力而行', '形隻影單', '殫誠畢慮']
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

            var example = "";
            var example_list = example_array[parseInt(Math.random() * (example_array.length - 1))];

            for (var i = 0; i < example_list.length; i++) {
                example = example + example_list[i]
                if (example_list[i + 1] !== undefined) {
                    example = example + ">"
                }
            }

            conv.ask(new SimpleResponse({
                speech: `<speak><p><s>想和我一較高下嗎</s><s>在遊戲過程中，成語不能重複!</s><s>與此同時，你隨時都能退出挑戰結算成績!</s><s>來挑戰看看八!</s></p></speak>`,
                text: '歡迎來挑戰!',
            }));

            conv.ask(new BasicCard({
                image: new Image({ url: 'https://raw.githubusercontent.com/hank199599/Google-Assistant-APP/master/%E6%88%90%E8%AA%9E%E6%8E%A5%E9%BE%8D/assets/dB4pcgi.jpg', alt: 'Pictures', }),
                title: '遊戲規則',
                subtitle: '  • 前後成語的讀音須相同但不限音調。\n  • 在遊戲過程中，詞彙不能重複!\n  • 隨時都能跳過詞彙，共有五次機會。\n  • 你隨時都能退出結算成績。',
                text: '**範例**：  \n' + example,
                buttons: new Button({
                    title: '《教育部成語典》',
                    url: 'https://dict.idioms.moe.edu.tw/search.jsp?webMd=2&la=0',
                }),
            }));
            conv.ask(new Suggestions('🎮 開始挑戰', '👋 掰掰'));
            conv.contexts.set(Contexts.Leave, 1);

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

            if (conv.user.last.seen) {
                conv.ask(new SimpleResponse({
                    speech: `<speak><p><s>歡迎回來!</s><break time="0.3s"/><s>在你開始接龍前，可以說<break time="0.2s"/>重新開始<break time="0.2s"/>讓我重新想一個成語作為開頭。</s><s>當你接不下去時，可以說<break time="0.2s"/>跳過<break time="0.2s"/>讓我幫你想一個成語!</s><break time="0.3s"/><s>準備好了嗎?<break time="1s"/></s></p></speak>`,
                    text: '遊戲前說明',
                }));
            } else {
                conv.ask(new SimpleResponse({
                    speech: `<speak><p><s>在開始遊戲前，我需要跟您進行說明。本服務的語音辨識由Google執行。</s><s>碰到同音成語或雜音等問題時，可能會發生辨識錯誤。僅此知會你一聲!</s><break time="0.5s"/><s>此外，在你開始接龍前，你可以說<break time="0.2s"/>重新開始<break time="0.2s"/>讓我重新想一個成語作為開頭。</s><s>當你接不下去時，可以說<break time="0.2s"/>跳過<break time="0.2s"/>讓我幫你想一個成語!</s><break time="0.3s"/><s>準備好了嗎?<break time="1s"/></s></p></speak>`,
                    text: '遊戲前說明',
                }));
            }


            sys_word = text_start[parseInt(Math.random() * 599)];
            conv.noInputs = ["我剛剛說的是" + sys_word + "，請說以" + last_word + "為開頭的成語", "遊戲已經開始囉，請說以" + last_word + "為開頭的成語", "抱歉，由於您沒有回應因此遊戲到此結束。下次見。"];

            conv.ask(new SimpleResponse({
                speech: `<speak><p><s>第一個成語是<break time="0.2s"/>${sys_word}</s></p></speak>`,
                text: '開始啦🏁\n若輸入重複的成語直接結束。',
            }));

            input_list.push(sys_word); //將字成語存入佇列

            last_word = idiom_varify[sys_word][1];

            conv.contexts.set(Contexts.Explain, 1);
            conv.contexts.set(Contexts.Get_hint, 1);
            conv.contexts.set(Contexts.Skip, 1);
            conv.contexts.set(Contexts.Repeat, 1);

        }
    } else {
        conv.ask(new SimpleResponse({
            speech: "在開始前，您需要啟用Google助理，我才能提供你個人化體驗喔!",
            text: '請進行相關設定，才能進行遊戲!',
        }));
        conv.close(new BasicCard({
            image: new Image({ url: 'https://www.gstatic.com/images/branding/product/2x/assistant_48dp.png', alt: 'Pictures', }),
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
        jumpcount = 0;
        wrong_count = 0;
    }
    if (conv.user.verification === 'VERIFIED') {

        //「開始遊戲」啟動成語判斷
        if (menu === true && end_game === false && question_output === false) {
            menu = false;
            question_output = true;
            end_game = false;
            jumpcount = 0;
        }

        //結算畫面防呆判斷
        if (menu === false && end_game === true && question_output === false) {
            if (inputarray.indexOf(input) !== -1) {
                menu = false;
                end_game = false;
                question_output = true;
                Total_Count = 0;
                input_list = [];
                start_game = false;
                jumpcount = 0;
                wrong_count = 0;
            }
        }

        if (menu === false && end_game === false && question_output === true) {

            if ((input === '重新開始' || input === '🔄 重新開始') && Total_Count === 0) {
                input_list = [];
                start_game = false;
                jumpcount = 0;
                wrong_count = 0;
            }

            if (start_game === false) {
                start_game = true;

                //選出最一開始的成語
                sys_word = text_start[parseInt(Math.random() * 599)];

                input_list.push(sys_word); //將字成語存入佇列
                last_word = idiom_varify[sys_word][1];

                conv.speechBiasing = idiom_library[last_word];
                conv.ask(new SimpleResponse({
                    speech: `<speak><p><s>開始啦!</s><s>第一個成語是<break time="0.2s"/>${sys_word}</s></p></speak>`,
                    text: '開始啦🏁\n請輸入以「' + last_word + '」開頭的成語。',
                }));
                conv.noInputs = ["我剛剛說的是" + sys_word + "，請說以" + last_word + "為開頭的成語", "遊戲已經開始囉，請說以" + last_word + "為開頭的成語", "抱歉，由於您沒有回應因此遊戲到此結束。下次見。"];

                conv.user.storage.menu = menu;
                conv.user.storage.end_game = end_game;
                conv.user.storage.question_output = question_output;
                conv.user.storage.sys_word = sys_word;
                conv.user.storage.last_word = last_word;
                conv.user.storage.input_list = input_list;
                conv.user.storage.Total_Count = Total_Count;
                conv.user.storage.start_game = start_game;
                conv.user.storage.jumpcount = jumpcount;

                var explain = brief_explain[sys_word];
                if (explain.indexOf("查「") !== -1) {
                    explain = brief_explain[brief_explain[sys_word].replace(/[\查|\「|\」|\辞]/gm, "")]
                }

                conv.ask(new BasicCard({
                    title: '『' + sys_word + '』',
                    subtitle: '解釋：' + explain,
                    //  text: '_若開頭成語太難，可以說「重新開始」_  \n或者跳過它讓我幫你想一個成語，每回合共五次機會',
                    text: '_若開頭成語太難，可以說「重新開始」_  \n也可以請我給點提示或直掉跳過它，每回合共五次機會',
                }));

                conv.ask(new Suggestions('🔄 重新開始', '給點提示', '跳過這個成語', '放棄本回合'));

                conv.contexts.set(Contexts.Explain, 1);
                conv.contexts.set(Contexts.Quit, 1);
                conv.contexts.set(Contexts.Get_hint, 1);
                conv.contexts.set(Contexts.Skip, 1);
                conv.contexts.set(Contexts.Repeat, 1);


            } else {

                conv.noInputs = ["我剛剛說的是" + sys_word + "，請說以" + last_word + "為開頭的成語", "遊戲已經開始囉，請說以" + last_word + "為開頭的成語", "抱歉，由於您沒有回應因此遊戲到此結束。下次見。"];

                conv.speechBiasing = idiom_library[last_word];

                if (idiom_varify[input] === undefined) {
                    wrong_count++;
                    wrong_array = [`<speak><p><s>你說的${input}不是成語喔!再想一個八!</s></p></speak>`,
                        `<speak><p><s>${input}好像不是成語，試著換一個八!</s></p></speak>`,
                        `<speak><p><s>${input}據我所知應該不是成語，再想一想後頭可以接什麼!</s></p></speak>`,
                        `<speak><p><s>我在成語典上找不到${input}，換一個試看看!</s></p></speak>`,
                        `<speak><p><s>${input}看來不是成語，請換一個。</s></p></speak>`,
                    ];

                    conv.ask(new SimpleResponse({
                        speech: wrong_array[parseInt(Math.random() * 4)],
                        text: '「' + input + '」不是成語喔!\n再想看看其他成語。',
                    }));
                    if (conv.screen) {

                        if (conv.input.type === "VOICE") { //如果輸入是語音，則顯示錯誤處理方法
                            conv.ask(new BasicCard({
                                title: '『' + sys_word + '』',
                                subtitle: '請輸入以「' + last_word + '」開頭的成語',
                                text: '〈錯誤說明〉  \nGoogle語音辨識可能發生錯誤，或是《成語典》上沒有這個成語，你可以嘗試：  \n• 試著再說一次  \n• 透過鍵盤輸入欲表達的成語  \n• 向開發者回報來改善比對結果',
                            }));
                        } else {
                            conv.ask(new BasicCard({
                                title: '『' + sys_word + '』',
                                subtitle: '請輸入以「' + last_word + '」開頭的成語',
                                text: '_[!]你目前剩下' + (5 - jumpcount) + '次跳過或獲取提示的機會_',
                            }));
                        }
                        if (jumpcount <= 4) {
                            conv.ask(new Suggestions('來點提示'));
                            conv.ask(new Suggestions('跳過這個成語'));
                        }
                        conv.ask(new Suggestions('放棄本回合'));

                        conv.contexts.set(Contexts.Quit, 1);
                        conv.contexts.set(Contexts.Skip, 1);
                        conv.contexts.set(Contexts.Repeat, 1);
                        conv.contexts.set(Contexts.Get_hint, 1);

                    } else {
                        if (wrong_count <= 2) { conv.ask(`<speak><p><s>現在接到<break time="0.2s"/>${sys_word}<break time="0.2s"/>請試著繼續接下去</s></p></speak>`); } else if (wrong_count < 5) { conv.ask(`<speak><p><s>現在接到<break time="0.2s"/>${sys_word}<break time="0.2s"/>如果仍想不到可以接甚麼成語，可以對我說<break time="0.2s"/>跳過它</s></p></speak>`); } else { conv.close(`<speak><p><s>由於我們的對話無法繼續，遊戲先到這裡八<break time="0.2s"/>在這回合中你進行${Total_Count}次接龍，下次見!</s></p></speak>`); }
                    }
                } else {

                    first_word = idiom_varify[input][0]

                    if (last_word !== first_word) {
                        wrong_count++;

                        wrong_array = [`<speak><p><s>想的好，但是${input}的自首不是${last_word}喔!再想一個八!</s></p></speak>`,
                            `<speak><p><s>${input}的字首好像不太對喔，試著換一個八!</s></p></speak>`,
                            `<speak><p><s>${input}的字首對不上呢，再想一想${sys_word}後頭可以接什麼成語!</s></p></speak>`,
                            `<speak><p><s>${input}的字首不太對，請換一個!</s></p></speak>`,
                            `<speak><p><s>這個成語的字首不是我要的，請換一個。</s></p></speak>`,
                        ];

                        conv.ask(new SimpleResponse({
                            speech: wrong_array[parseInt(Math.random() * 4)],
                            text: '字首對不上，請再想一個成語!',
                        }));
                        if (conv.screen) {
                            conv.ask(new BasicCard({
                                title: '『' + sys_word + '』',
                                subtitle: '請輸入以「' + last_word + '」開頭的成語',
                                text: '_[!]你目前剩下' + (5 - jumpcount) + '次跳過或獲取提示的機會_',
                            }));

                            if (jumpcount <= 4) {
                                conv.ask(new Suggestions('來點提示'));
                                conv.ask(new Suggestions('跳過這個成語'));
                            }
                            conv.ask(new Suggestions('放棄本回合'));

                            conv.contexts.set(Contexts.Quit, 1);
                            conv.contexts.set(Contexts.Get_hint, 1);
                            conv.contexts.set(Contexts.Skip, 1);
                            conv.contexts.set(Contexts.Repeat, 1);
                            conv.contexts.set(Contexts.Get_hint, 1);

                        } else {
                            if (wrong_count <= 2) { conv.ask(`<speak><p><s>現在接到<break time="0.2s"/>${sys_word}<break time="0.2s"/>請試著繼續接下去</s></p></speak>`); } else if (wrong_count < 5) { conv.ask(`<speak><p><s>現在接到<break time="0.2s"/>${sys_word}<break time="0.2s"/>如果仍想不到可以接甚麼成語，可以對我說<break time="0.2s"/>跳過它</s></p></speak>`); } else { conv.close(`<speak><p><s>由於我們的對話無法繼續，遊戲先到這裡八<break time="0.2s"/>在這回合中你進行${Total_Count}次接龍，下次見!</s></p></speak>`); }
                        }
                    } else {
                        Total_Count++;
                        wrong_count = 0;
                        conv.speechBiasing = [];
                        if (input_list.indexOf(input) === -1) { //偵錯看是否輸入到重複的成語

                            input_list.push(input); //將字成語存入佇列
                            input_word = idiom_varify[input][1]

                            output_array = idiom_library[input_word]; //進入詞彙庫取得對應詞彙

                            if (output_array === undefined) {
                                menu = false;
                                question_output = false;
                                end_game = true;

                                conv.ask(new SimpleResponse({
                                    speech: `<speak><p><s>可<break time="0.2s"/>可<break time="0.2s"/>可惡<break time="0.2s"/></s><s>我竟然找不到可以接下去的成語，你贏我了呢!</s></p></speak>`,
                                    text: '我輸了 😱',
                                }));
                                if (conv.screen) {
                                    conv.ask(new BasicCard({
                                        title: '『' + input + '』沒辦法接下去了...',
                                        subtitle: '本回合已結束',
                                        text: '共進行' + Total_Count + '次接龍(不計入跳過的成語)',
                                    }));

                                    conv.ask(new Suggestions('🔄 重新開始', '👋 掰掰'));
                                    conv.contexts.set(Contexts.Leave, 1);

                                    Total_Count = 0;
                                    input_list = [];
                                    start_game = false;
                                } else {
                                    conv.user.storage = {}; //離開同時清除暫存資料	
                                    conv.close(`<speak><p><s>在這回合中你進行${Total_Count}次接龍，下次見!</s></p></speak>`);
                                }
                            } else {
                                sys_word = output_array[parseInt(Math.random() * (output_array.length - 1))];

                                last_word = idiom_varify[sys_word][1];

                                if (input_list.indexOf(sys_word) !== -1) {
                                    menu = false;
                                    question_output = false;
                                    end_game = true;

                                    conv.ask(new SimpleResponse({
                                        speech: `<speak><p><s>可惡</s><s>我不小心選了曾經說過的成語，你贏我了ㄋ!</s></p></speak>`,
                                        text: '我輸了 😱',
                                    }));
                                    if (conv.screen) {
                                        conv.ask(new BasicCard({
                                            title: '沒想到『' + sys_word + '』已經說過了',
                                            subtitle: '本回合已結束',
                                            text: '共進行' + Total_Count + '次接龍(不計入跳過的成語)',
                                        }));
                                        conv.ask(new Suggestions('🔄 重新開始', '👋 掰掰'));
                                        conv.contexts.set(Contexts.Leave, 1);
                                        Total_Count = 0;
                                        input_list = [];
                                        start_game = false;
                                    } else {
                                        conv.user.storage = {}; //離開同時清除暫存資料	
                                        conv.close(`<speak><p><s>在這回合中你進行${Total_Count}次接龍，下次見!</s></p></speak>`);
                                    }
                                } else {
                                    input_list.push(sys_word); //將成語存入佇列

                                    output_array = idiom_library[last_word]; //進入字成語庫取得對應字成語

                                    if (output_array === undefined) {
                                        menu = false;
                                        question_output = false;
                                        end_game = true;

                                        conv.ask(new SimpleResponse({
                                            speech: `<speak><p><s>糟糕<break time="0.2s"/>我所想的${sys_word}是沒辦法接下去的!回合結束!</s></p></speak>`,
                                            text: '我所想的成語是接不下去的，\n因此回合結束拉!',
                                        }));

                                        if (conv.screen) {
                                            conv.ask(new BasicCard({
                                                title: '我想的『' + sys_word + '』接不下去拉!',
                                                subtitle: '本回合已結束',
                                                text: '共進行' + Total_Count + '次接龍(不計入跳過的成語)',
                                                buttons: new Button({
                                                    title: '在《萌典》上看「' + sys_word + '」的意思',
                                                    url: 'https://www.moedict.tw/' + sys_word,
                                                })
                                            }));

                                            conv.ask(new Suggestions('🔄 重新開始', '👋 掰掰'));
                                            conv.contexts.set(Contexts.Leave, 1);

                                            Total_Count = 0;
                                            input_list = [];
                                            start_game = false;
                                        } else {
                                            conv.user.storage = {}; //離開同時清除暫存資料	
                                            conv.close(`<speak><p><s>在這回合中你進行${Total_Count}次接龍，下次見!</s></p></speak>`);
                                        }
                                    } else {

                                        conv.noInputs = ["我剛剛說的是" + sys_word + "，請說以" + last_word + "為開頭的成語", "遊戲已經開始囉，請說以" + last_word + "為開頭的成語", "抱歉，由於您沒有回應因此遊戲到此結束。下次見。"];
                                        conv.speechBiasing = output_array;
                                        conv.ask(new SimpleResponse({
                                            speech: `<speak><p><s>${sys_word}</s></p></speak>`,
                                            text: return_array[parseInt(Math.random() * 4)],
                                        }));

                                        //conv.ask(new Suggestions('查詢意思'));
                                        if (jumpcount <= 4) {
                                            conv.ask(new Suggestions('來點提示'));
                                            conv.ask(new Suggestions('跳過這個成語'));
                                        }
                                        conv.ask(new Suggestions('放棄本回合'));

                                        conv.contexts.set(Contexts.Skip, 1);
                                        conv.contexts.set(Contexts.Quit, 1);
                                        conv.contexts.set(Contexts.Explain, 1);
                                        conv.contexts.set(Contexts.Repeat, 1);
                                        conv.contexts.set(Contexts.Get_hint, 1);

                                        conv.user.storage.menu = menu;
                                        conv.user.storage.end_game = end_game;
                                        conv.user.storage.question_output = question_output;
                                        conv.user.storage.sys_word = sys_word;
                                        conv.user.storage.last_word = last_word;
                                        conv.user.storage.input_list = input_list;
                                        conv.user.storage.Total_Count = Total_Count;
                                        conv.user.storage.start_game = start_game;
                                        conv.user.storage.jumpcount = jumpcount;
                                        conv.user.storage.wrong_count = wrong_count;

                                        var explain = brief_explain[sys_word];
                                        if (explain.indexOf("查「") !== -1) {
                                            explain = brief_explain[brief_explain[sys_word].replace(/[\查|\「|\」|\辞]/gm, "")]
                                        }

                                        conv.ask(new BasicCard({
                                            title: '『' + sys_word + '』',
                                            subtitle: '解釋：' + explain,
                                            text: '_[!]你目前剩下' + (5 - jumpcount) + '次跳過或獲取提示的機會_',
                                        }));

                                        conv.contexts.set(Contexts.Explain, 1);
                                        conv.contexts.set(Contexts.Quit, 1);
                                        conv.contexts.set(Contexts.Get_hint, 1);

                                    }
                                }
                            }
                        } else {

                            menu = false;
                            question_output = false;
                            end_game = true;
                            conv.speechBiasing = [];

                            conv.ask(new SimpleResponse({
                                speech: `<speak><p><s>居居<break time="0.2s"/>你輸入的${input}重複囉!回合結束!</s></p></speak>`,
                                text: '你輸入重複的成語，因此回合結束拉!',
                            }));
                            conv.ask(new BasicCard({
                                title: '『' + input + '』已經輸入過囉!',
                                subtitle: '本回合已結束',
                                text: '共進行' + Total_Count + '次接龍(不計入跳過的成語)',
                            }));
                            conv.contexts.set(Contexts.Leave, 1);

                            conv.ask(new Suggestions('🔄 重新開始', '👋 掰掰'));
                            Total_Count = 0;
                            input_list = [];
                            start_game = false;

                        }
                    }
                }
            }
        } else if (menu === false && end_game === true && question_output === false) {
            conv.ask(new SimpleResponse({
                speech: `<speak><p><s>不好意思，我沒聽清楚。\n</s><s>請試著說<break time="0.2s"/>重新開始<break time="0.2s"/>或<break time="0.2s"/>掰掰<break time="0.2s"/>來確認你的操作。</s></p></speak>`,
                text: '抱歉，我不懂你的意思。\n請點擊建議卡片來確認你的操作。'
            }));
            conv.contexts.set(Contexts.Leave, 1);

            conv.ask(new Suggestions('🔄 重新開始', '👋 掰掰'));
        } else {
            conv.ask(new SimpleResponse({
                speech: "本服務需要您進一步進行設定才能繼續進行，請依照下述步驟開啟「網路與應用程式」功能。才能獲得個人化體驗喔!",
                text: '請進行相關設定，才能進行遊戲!',
            }));
            conv.close(new BasicCard({
                image: new Image({ url: 'https://raw.githubusercontent.com/hank199599/Google-Assistant-APP/master/%E6%88%90%E8%AA%9E%E6%8E%A5%E9%BE%8D/assets/P5FWCbe.png', alt: 'Pictures', }),
                title: '錯誤：您需要進行設定',
                subtitle: '為了給您個人化的遊戲體驗，請進行下述設定：\n\n1. 點擊下方按鈕前往Google帳戶設定\n2.	開啟「網路和應用程式活動」功能\n3.	開啟「包括 Chrome 瀏覽記錄以及採用 Google 服務的網站、應用程式和裝置中的活動記錄」\n',
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
            image: new Image({ url: 'https://www.gstatic.com/images/branding/product/2x/assistant_48dp.png', alt: 'Pictures', }),
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
    conv.user.storage.jumpcount = jumpcount;
    conv.user.storage.wrong_count = wrong_count;

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
    jumpcount = conv.user.storage.jumpcount;

    menu = false;
    question_output = false;
    end_game = true;

    output_array = idiom_library[last_word]; //進入字成語庫取得對應字成語

    if (typeof Total_Count !== "undefined") {

        if (conv.screen) {
            conv.ask(new SimpleResponse({ speech: `<speak><p><s>你在這回合一共進行${Total_Count}次接龍。</s><s>你要再試一次嗎?</s></p></speak>`, text: '驗收成果' }));

            var output_content = {
                image: new Image({ url: 'https://raw.githubusercontent.com/hank199599/Google-Assistant-APP/master/%E6%88%90%E8%AA%9E%E6%8E%A5%E9%BE%8D/assets/PLVkbbK.jpg', alt: 'Pictures', }),
                title: '本回合共進行' + Total_Count + '次接龍',
                subtitle: '不計入跳過的成語次數',
                text: '✮增強功力：  \n在「' + last_word + '」後面，無法再繼續接下去了...',
                display: 'CROPPED', //更改圖片顯示模式為自動擴展
            }

            if (output_array !== undefined) {

                sys_word = output_array[parseInt(Math.random() * (output_array.length - 1))];

                output_content.text = '✮增強功力：  \n以「' + last_word + '」開頭的成語有『' + sys_word + '』。';
                output_content.buttons = new Button({
                    title: '在《萌典》上看「' + sys_word + '」的意思',
                    url: 'https://www.moedict.tw/' + sys_word,
                })
            }

            conv.ask(new BasicCard(output_content));
            conv.ask(new Suggestions('🔄 重新開始', '👋 掰掰'));
            conv.contexts.set(Contexts.Leave, 1);
            Total_Count = 0;
            input_list = [];
            start_game = false;
        } else {
            conv.close(new SimpleResponse({ speech: `<speak><p><s>你在本回合共進行${Total_Count}次接龍。</s><s>下次見!</s></p></speak>`, text: '驗收成果' }));
        }
    } else {
        conv.ask(new SimpleResponse({
            speech: "本服務需要您進一步進行設定才能繼續進行，請依照下述步驟開啟「網路與應用程式」功能。才能獲得個人化體驗喔!",
            text: '請進行相關設定，才能進行遊戲!',
        }));
        conv.close(new BasicCard({
            image: new Image({ url: 'https://raw.githubusercontent.com/hank199599/Google-Assistant-APP/master/%E6%88%90%E8%AA%9E%E6%8E%A5%E9%BE%8D/assets/P5FWCbe.png', alt: 'Pictures', }),
            title: '錯誤：您需要進行設定',
            subtitle: '為了給您個人化的遊戲體驗，請進行下述設定：\n\n1. 點擊下方按鈕前往Google帳戶設定\n2.	開啟「網路和應用程式活動」功能\n3.	開啟「包括 Chrome 瀏覽記錄以及採用 Google 服務的網站、應用程式和裝置中的活動記錄」\n',
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
    conv.user.storage.jumpcount = jumpcount;

});

app.intent('解說意思', (conv) => {
    sys_word = conv.user.storage.sys_word;
    jumpcount = conv.user.storage.jumpcount;

    var explain = brief_explain[sys_word];
    if (explain.indexOf("查「") !== -1) {
        explain = brief_explain[brief_explain[sys_word].replace(/[\查|\「|\」|\辞]/gm, "")]
    }

    conv.noInputs = ["我剛剛說的是" + sys_word + "，請說以" + last_word + "為開頭的成語", "請繼續接龍吧，以" + last_word + "為開頭的成語", "抱歉，由於您沒有回應因此遊戲到此結束。下次見。"];

    conv.ask(new SimpleResponse({
        speech: `<speak><p><s>根據成語典，${sys_word}的意思是${explain}</s><s>接著，請繼續接下去</s></p></speak>`,
        text: '以下是來自成語典的解釋',
    }));

    conv.ask(new BasicCard({
        title: '『' + sys_word + '』',
        subtitle: '解釋：' + explain,
        text: '_[!]你目前剩下' + (5 - jumpcount) + '次跳過或獲取提示的機會_',
    }));

    if (jumpcount <= 4) {
        conv.ask(new Suggestions('來點提示'));
        conv.ask(new Suggestions('跳過這個成語'));
    }
    conv.ask(new Suggestions('放棄本回合'));

    conv.contexts.set(Contexts.Quit, 1);
    conv.contexts.set(Contexts.Get_hint, 1);
    conv.contexts.set(Contexts.Skip, 1);
    conv.contexts.set(Contexts.Repeat, 1);

});

app.intent('重覆題目', (conv) => {
    sys_word = conv.user.storage.sys_word;
    jumpcount = conv.user.storage.jumpcount;

    var explain = brief_explain[sys_word];
    var reply_array = ["沒問題", "我知道了", "OK", "我了解了", "好的", "收到"]
    var reply_confirm = reply_array[parseInt(Math.random() * (reply_array.length - 1))];

    if (explain.indexOf("查「") !== -1) {
        explain = brief_explain[brief_explain[sys_word].replace(/[\查|\「|\」|\辞]/gm, "")]
    }

    conv.noInputs = ["我剛剛說的是" + sys_word + "，請說以" + last_word + "為開頭的成語", "請繼續接龍吧，以" + last_word + "為開頭的成語", "抱歉，由於您沒有回應因此遊戲到此結束。下次見。"];

    conv.ask(new SimpleResponse({
        speech: `<speak><p><s>${reply_confirm}，我剛剛說的是<break time="0.5s"/>${sys_word}</s></p></speak>`,
        text: reply_confirm + '，仔細聽好囉!',
    }));

    conv.ask(new BasicCard({
        title: '『' + sys_word + '』',
        subtitle: '解釋：' + explain,
        text: '_[!]你目前剩下' + (5 - jumpcount) + '次跳過或獲取提示的機會_',
    }));

    //conv.ask(new Suggestions('查詢意思'));
    if (jumpcount <= 4) {
        conv.ask(new Suggestions('來點提示'));
        conv.ask(new Suggestions('跳過這個成語'));
    }
    conv.ask(new Suggestions('放棄本回合'));

    conv.contexts.set(Contexts.Explain, 1);
    conv.contexts.set(Contexts.Quit, 1);
    conv.contexts.set(Contexts.Get_hint, 1);
    conv.contexts.set(Contexts.Skip, 1);
    conv.contexts.set(Contexts.Repeat, 1);

});

app.intent('提示前面的字', (conv) => {

    conv.user.storage.hint_count = 0;
    var last_word = conv.user.storage.last_word;

    jumpcount = conv.user.storage.jumpcount;
    jumpcount++

    output_array = idiom_library[last_word]; //進入成語彙庫取得對應成語彙

    if (jumpcount <= 5) {

        if ((5 - jumpcount) !== 0) {
            conv.ask(new SimpleResponse({
                speech: `<speak><p><s>好的</s><s>你現在剩下${5 - jumpcount}次請求提示的機會!</s></p></speak>`,
                text: '好的，你還有' + (5 - jumpcount) + '次請求提示的機會'
            }));

        } else {
            conv.ask(new SimpleResponse({
                speech: `<speak><p><s>提醒你</s><s>你已經用完所有請求提示的機會!</s></p></speak>`,
                text: '你已經用完所有請求提示的機會'
            }));
        }

        if (output_array === undefined) {
            menu = false;
            question_output = false;
            end_game = true;
            conv.ask(new SimpleResponse({
                speech: `<speak><p><s>看來這個成語彙是接不下去的，回合結束!</s></p></speak>`,
                text: '這個成語是接不下去的，回合結束',
            }));
            if (conv.screen) {
                conv.ask(new BasicCard({
                    title: '看來『' + input_list[-1] + '』是接不下去的',
                    subtitle: '本回合已結束',
                    text: '共進行' + Total_Count + '次接龍(不計入跳過的成語彙)',
                    buttons: new Button({
                        title: '在《萌典》上看「' + input_list[-1] + '」的意思',
                        url: 'https://www.moedict.tw/' + input_list[-1],
                    })
                }));
                conv.ask(new Suggestions('🔄 重新開始', '👋 掰掰'));
                conv.contexts.set(Contexts.Leave, 1);
                Total_Count = 0;
                input_list = [];
                start_game = false;
            } else {
                conv.user.storage = {}; //離開同時清除暫存資料	
                conv.close(`<speak><p><s>在這回合中你進行${Total_Count}次接龍，下次見!</s></p></speak>`);
            }

        } else {
            sys_word = output_array[parseInt(Math.random() * (output_array.length - 1))];

            var hint_array = sys_word.split('');

            var word_length = Math.floor(sys_word.replace("，", "").length / 2);
            var display_hint = "";
            var hint = "";

            for (var i = 0; i < hint_array.length; i++) {
                if (i < word_length) {
                    display_hint = display_hint + hint_array[i];
                    hint = hint + hint_array[i]
                } else if (hint_array[i] === "，") {
                    display_hint = display_hint + "，"
                } else {
                    display_hint = display_hint + "☐"
                }
            }

            conv.speechBiasing = output_array;

            conv.noInputs = ["我剛剛說的提示是" + hint + "，請試著接下去", "請說以" + hint + "為開頭的成語", "抱歉，由於您沒有回應因此遊戲到此結束。下次見。"];

            var explain = brief_explain[sys_word];
            if (explain.indexOf("查「") !== -1) {
                explain = brief_explain[brief_explain[sys_word].replace(/[\查|\「|\」|\辞]/gm, "")]
            }

            var hint_array = [
                `<speak><p><s>前${word_length}個字是<break time="0.5s"/>${hint}<break time="0.5s"/>，它有${explain}的意思<break time="0.5s"/>我就幫到這裡了</s></p></speak>`,
                `<speak><p><s>這個成語的前${word_length}個字是<break time="0.5s"/>${hint}<break time="0.5s"/>，意思是${explain}<break time="0.5s"/>接下來換你了</s></p></speak>`,
                `<speak><p><s>前${word_length}個字是<break time="0.5s"/>${hint}<break time="0.5s"/>，這個成語的意思是${explain}<break time="0.5s"/>請試著完成他吧</s></p></speak>`
            ]

            conv.ask(new SimpleResponse({
                speech: hint_array[parseInt(Math.random() * (hint_array.length - 1))],
                text: "提示如下，我就幫到這了",
            }));

            conv.ask(new BasicCard({
                title: display_hint,
                subtitle: '解釋：' + explain,
                text: '_[!]這個提示有' + (3 - conv.user.storage.hint_count) + '次猜測機會_',
            }));

            conv.ask(new Suggestions('查看答案', '放棄本回合'));

            conv.contexts.set(Contexts.Quit, 1);
            conv.contexts.set(Contexts.Counter, 1);
            conv.contexts.set(Contexts.Answer, 1);

            conv.user.storage.display_hint = display_hint;
            conv.user.storage.sys_word = sys_word;
            conv.user.storage.explain = explain;
            conv.user.storage.jumpcount = jumpcount;
        }
    } else {

        sys_word = conv.user.storage.sys_word;

        var explain = brief_explain[sys_word];
        if (explain.indexOf("查「") !== -1) {
            explain = brief_explain[brief_explain[sys_word].replace(/[\查|\「|\」|\辞]/gm, "")]
        }

        conv.noInputs = ["我剛剛說的是" + sys_word + "，請說以" + last_word + "為開頭的成語", "請繼續接龍吧，以" + last_word + "為開頭的成語", "抱歉，由於您沒有回應因此遊戲到此結束。下次見。"];

        conv.ask(new SimpleResponse({
            speech: `<speak><p><s>很抱歉，你已經用完提示的機會，請試著自行繼續接下去</s></p></speak>`,
            text: '很抱歉，你已經用完提示的機會了',
        }));

        conv.ask(new BasicCard({
            title: '『' + sys_word + '』',
            subtitle: '解釋：' + explain,
            text: '_[!]你已經用完跳過或獲取提示的機會_',
        }));

        if (jumpcount <= 4) {
            conv.ask(new Suggestions('來點提示'));
            conv.ask(new Suggestions('跳過這個成語'));
        }
        conv.ask(new Suggestions('放棄本回合'));

        conv.contexts.set(Contexts.Quit, 1);
        conv.contexts.set(Contexts.Skip, 1);
        conv.contexts.set(Contexts.Get_hint, 1);
        conv.contexts.set(Contexts.Repeat, 1);

    }

});

app.intent('進行猜測', (conv, { input }) => {

    var jumpcount = conv.user.storage.jumpcount;
    var Total_Count = conv.user.storage.Total_Count;

    if (input !== conv.user.storage.sys_word) {
        var hint_count = conv.user.storage.hint_count;
        hint_count++;
        conv.user.storage.hint_count = hint_count;

        if (hint_count <= 2) {

            var sys_word = conv.user.storage.sys_word.replace("，", "");
            conv.speechBiasing = [conv.user.storage.sys_word];

            var courage_array = ["再接再厲!", "再想看看吧", "加油，答案就在眼前", "答案很接近了"]

            conv.ask(new SimpleResponse(`<speak><p><s>${courage_array[parseInt(Math.random() * (courage_array.length - 1))]}</s></p></speak>`));

            conv.ask(new BasicCard({
                title: conv.user.storage.display_hint,
                subtitle: '解釋：' + conv.user.storage.explain,
                text: '_[!]這個提示有' + (3 - hint_count) + '次猜測機會_',
            }));

            conv.ask(new Suggestions('查看答案', '放棄本回合'));

            conv.contexts.set(Contexts.Counter, 1);
            conv.contexts.set(Contexts.Quit, 1);
            conv.contexts.set(Contexts.Answer, 1);

        } else {

            conv.ask(new SimpleResponse({
                speech: `<speak><p><s>答案揭曉，這個成語是${conv.user.storage.sys_word}，請繼續接下去吧!</s></p></speak>`,
                text: '答案揭曉，請試著繼續接下去!',
            }));

            var sys_word = conv.user.storage.sys_word;
            var last_word = idiom_varify[sys_word][1];
            output_array = idiom_library[last_word]; //進入成語彙庫取得對應成語彙

            input_list.push(input); //將成語彙存入佇列
            conv.speechBiasing = output_array;
            conv.noInputs = ["我剛剛說的是" + sys_word + "，請說以" + last_word + "為開頭的成語", "遊戲已經開始囉，請說以" + last_word + "為開頭的成語", "抱歉，由於您沒有回應因此遊戲到此結束。下次見。"];

            conv.ask(new BasicCard({
                title: "『" + conv.user.storage.sys_word + "』",
                subtitle: '解釋：' + conv.user.storage.explain,
                text: '_[!]你目前剩下' + (5 - jumpcount) + '次跳過或獲取提示的機會_',
            }));

            //conv.ask(new Suggestions('查詢意思'));

            if (jumpcount <= 4) {
                conv.ask(new Suggestions('來點提示'));
                conv.ask(new Suggestions('跳過這個成語'));
            }
            conv.ask(new Suggestions('放棄本回合'));

            conv.contexts.set(Contexts.Quit, 1);
            conv.contexts.set(Contexts.Explain, 1);
            conv.contexts.set(Contexts.Get_hint, 1);
            conv.contexts.set(Contexts.Skip, 1);
            conv.contexts.set(Contexts.Repeat, 1);

            conv.user.storage.sys_word = sys_word;
            conv.user.storage.last_word = last_word;
            conv.user.storage.input_list = input_list;
            conv.user.storage.Total_Count = Total_Count;
            conv.user.storage.start_game = start_game;
            conv.user.storage.jumpcount = jumpcount;

        }

    } else {

        Total_Count++;

        sys_word = conv.user.storage.sys_word;
        last_word = idiom_varify[input][1];

        input_list.push(input); //將成語彙存入佇列
        output_array = idiom_library[last_word]; //進入成語彙庫取得對應成語彙

        if (output_array === undefined) {
            menu = false;
            question_output = false;
            end_game = true;

            conv.ask(new SimpleResponse({
                speech: `<speak><p><s>糟糕<break time="0.2s"/>我所選的${sys_word}是沒辦法接下去的!回合結束!</s></p></speak>`,
                text: '我所想的成語是接不下去的，\n因此回合結束拉!',
            }));
            if (conv.screen) {
                conv.ask(new BasicCard({
                    title: '我想的『' + sys_word + '』接不下去拉!',
                    subtitle: '本回合已結束',
                    text: '共進行' + Total_Count + '次接龍(不計入跳過的成語彙)',
                    buttons: new Button({
                        title: '在《萌典》上看「' + sys_word + '」的意思',
                        url: 'https://www.moedict.tw/' + sys_word,
                    })
                }));
                conv.ask(new Suggestions('🔄 重新開始', '👋 掰掰'));
                conv.contexts.set(Contexts.Leave, 1);
                Total_Count = 0;
                input_list = [];
                start_game = false;
            } else {
                conv.user.storage = {}; //離開同時清除暫存資料	
                conv.close(`<speak><p><s>在這回合中你進行${Total_Count}次接龍，下次見!</s></p></speak>`);
            }
        } else {

            sys_word = output_array[parseInt(Math.random() * (output_array.length - 1))];
            last_word = idiom_varify[sys_word][1];

            conv.noInputs = ["我剛剛說的是" + sys_word + "，請說以" + last_word + "為開頭的成語", "遊戲已經開始囉，請說以" + last_word + "為開頭的成語", "抱歉，由於您沒有回應因此遊戲到此結束。下次見。"];
            conv.speechBiasing = output_array;

            conv.ask(`<speak><p><s>恭喜答對啦!</s></p></speak>`);
            conv.ask(new SimpleResponse({
                speech: `<speak><p><s>下一個成語是<break time="0.5s"/>${sys_word}</s></p></speak>`,
                text: "下一個成語是...",
            }));

            var explain = brief_explain[sys_word];
            if (explain.indexOf("查「") !== -1) {
                explain = brief_explain[brief_explain[sys_word].replace(/[\查|\「|\」|\辞]/gm, "")]
            }

            conv.ask(new BasicCard({
                title: '『' + sys_word + '』',
                subtitle: '解釋：' + explain,
                text: '_[!]你目前剩下' + (5 - jumpcount) + '次跳過或獲取提示的機會_',
            }));

            //conv.ask(new Suggestions('查詢意思'));

            if (jumpcount <= 4) {
                conv.ask(new Suggestions('來點提示'));
                conv.ask(new Suggestions('跳過這個成語'));
            }
            conv.ask(new Suggestions('放棄本回合'));

            conv.contexts.set(Contexts.Explain, 1);
            conv.contexts.set(Contexts.Quit, 1);
            conv.contexts.set(Contexts.Skip, 1);
            conv.contexts.set(Contexts.Get_hint, 1);
            conv.contexts.set(Contexts.Repeat, 1);

            conv.user.storage.menu = menu;
            conv.user.storage.end_game = end_game;
            conv.user.storage.question_output = question_output;
            conv.user.storage.sys_word = sys_word;
            conv.user.storage.last_word = last_word;
            conv.user.storage.input_list = input_list;
            conv.user.storage.Total_Count = Total_Count;
            conv.user.storage.start_game = start_game;
            conv.user.storage.jumpcount = jumpcount;
        }
    }

});

app.intent('查看提示的答案', (conv) => {

    var reply_array = ["沒問題", "我知道了", "OK", "我了解了", "好的", "收到"]
    var sys_word = conv.user.storage.sys_word;
    conv.ask(new SimpleResponse(`<speak><p><s>${reply_array[parseInt(Math.random() * (reply_array.length - 1))]}</s></p></speak>`));

    conv.ask(new SimpleResponse({
        speech: `<speak><p><s>這個成語是${conv.user.storage.sys_word}，請繼續接下去吧!</s></p></speak>`,
        text: '答案揭曉，請試著繼續接下去!',
    }));

    var last_word = idiom_varify[conv.user.storage.sys_word][1];
    output_array = idiom_library[last_word]; //進入成語彙庫取得對應成語彙

    var jumpcount = conv.user.storage.jumpcount;

    input_list.push(conv.user.storage.sys_word); //將成語彙存入佇列
    conv.speechBiasing = output_array;
    conv.noInputs = ["我剛剛說的是" + sys_word + "，請說以" + last_word + "為開頭的成語", "遊戲已經開始囉，請說以" + last_word + "為開頭的成語", "抱歉，由於您沒有回應因此遊戲到此結束。下次見。"];

    conv.ask(new BasicCard({
        title: "『" + conv.user.storage.sys_word + "』",
        subtitle: '解釋：' + conv.user.storage.explain,
        text: '_[!]你目前剩下' + (5 - jumpcount) + '次跳過或獲取提示的機會_',
    }));

    //conv.ask(new Suggestions('查詢意思'));

    if (jumpcount <= 4) {
        conv.ask(new Suggestions('來點提示'));
        conv.ask(new Suggestions('跳過這個成語'));
    }
    conv.ask(new Suggestions('放棄本回合'));

    conv.contexts.set(Contexts.Quit, 1);
    conv.contexts.set(Contexts.Explain, 1);
    conv.contexts.set(Contexts.Skip, 1);
    conv.contexts.set(Contexts.Get_hint, 1);
    conv.contexts.set(Contexts.Repeat, 1);

    conv.user.storage.sys_word = sys_word;
    conv.user.storage.last_word = last_word;
    conv.user.storage.input_list = input_list;
    conv.user.storage.Total_Count = Total_Count;
    conv.user.storage.start_game = start_game;
    conv.user.storage.jumpcount = jumpcount;
})

app.intent('跳過題目', (conv) => {

    menu = conv.user.storage.menu;
    end_game = conv.user.storage.end_game;
    question_output = conv.user.storage.question_output;
    last_word = conv.user.storage.last_word;
    sys_word = conv.user.storage.sys_word;
    input_list = conv.user.storage.input_list;
    Total_Count = conv.user.storage.Total_Count;
    start_game = conv.user.storage.start_game;
    jumpcount = conv.user.storage.jumpcount;

    jumpcount++;
    conv.user.storage.wrong_count = 0;

    if (jumpcount <= 5) {

        if ((5 - jumpcount) !== 0) {
            conv.ask(new SimpleResponse({
                speech: `<speak><p><s>好的</s><s>你現在剩下${5 - jumpcount}次跳過的機會!</s></p></speak>`,
                text: '好的，你還有' + (5 - jumpcount) + '次跳過的機會'
            }));
        } else {
            conv.ask(new SimpleResponse({
                speech: `<speak><p><s>提醒你</s><s>你已經用完所有跳過的機會!</s></p></speak>`,
                text: '你已經用完所有跳過的機會'
            }));
        }

        output_array = idiom_library[last_word]; //進入成語彙庫取得對應成語彙

        if (output_array === undefined) {
            menu = false;
            question_output = false;
            end_game = true;
            conv.ask(new SimpleResponse({
                speech: `<speak><p><s>看來這個成語彙是接不下去的，回合結束!</s></p></speak>`,
                text: '這個成語是接不下去的，回合結束',
            }));
            if (conv.screen) {
                conv.ask(new BasicCard({
                    title: '看來『' + input_list[-1] + '』是接不下去的',
                    subtitle: '本回合已結束',
                    text: '共進行' + Total_Count + '次接龍(不計入跳過的成語彙)',
                    buttons: new Button({
                        title: '在《萌典》上看「' + input_list[-1] + '」的意思',
                        url: 'https://www.moedict.tw/' + input_list[-1],
                    })
                }));
                conv.ask(new Suggestions('🔄 重新開始', '👋 掰掰'));
                conv.contexts.set(Contexts.Leave, 1);
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

            last_word = idiom_varify[sys_word][1];

            if (input_list.indexOf(sys_word) !== -1) {
                menu = false;
                question_output = false;
                end_game = true;
                conv.ask(new SimpleResponse({
                    speech: `<speak><p><s>糟糕</s><s>我不小心選了曾經說過的成語，回合結束!</s></p></speak>`,
                    text: '回合已結束',
                }));
                if (conv.screen) {
                    conv.ask(new BasicCard({
                        title: '『' + sys_word + '』是說過的成語',
                        subtitle: '本回合已結束',
                        text: '共進行' + Total_Count + '次接龍(不計入跳過的成語彙)',
                    }));
                    conv.ask(new Suggestions('🔄 重新開始', '👋 掰掰'));
                    conv.contexts.set(Contexts.Leave, 1);
                    Total_Count = 0;
                    input_list = [];
                    start_game = false;
                } else {
                    conv.user.storage = {}; //離開同時清除暫存資料	
                    conv.close(`<speak><p><s>在這回合中你進行${Total_Count}次接龍，下次見!</s></p></speak>`);
                }
            } else {

                input_list.push(sys_word); //將成語彙存入佇列
                output_array = idiom_library[last_word]; //進入成語彙庫取得對應成語彙

                if (output_array === undefined) {
                    menu = false;
                    question_output = false;
                    end_game = true;

                    conv.ask(new SimpleResponse({
                        speech: `<speak><p><s>糟糕<break time="0.2s"/>我所選的${sys_word}是沒辦法接下去的!回合結束!</s></p></speak>`,
                        text: '我所想的成語是接不下去的，\n因此回合結束拉!',
                    }));
                    if (conv.screen) {
                        conv.ask(new BasicCard({
                            title: '我想的『' + sys_word + '』接不下去拉!',
                            subtitle: '本回合已結束',
                            text: '共進行' + Total_Count + '次接龍(不計入跳過的成語彙)',
                            buttons: new Button({
                                title: '在《萌典》上看「' + sys_word + '」的意思',
                                url: 'https://www.moedict.tw/' + sys_word,
                            })
                        }));
                        conv.ask(new Suggestions('🔄 重新開始', '👋 掰掰'));
                        conv.contexts.set(Contexts.Leave, 1);
                        Total_Count = 0;
                        input_list = [];
                        start_game = false;
                    } else {
                        conv.user.storage = {}; //離開同時清除暫存資料	
                        conv.close(`<speak><p><s>在這回合中你進行${Total_Count}次接龍，下次見!</s></p></speak>`);
                    }
                } else {

                    conv.speechBiasing = output_array;
                    conv.noInputs = ["我剛剛說的是" + sys_word + "，請說以" + last_word + "為開頭的成語", "遊戲已經開始囉，請說以" + last_word + "為開頭的成語", "抱歉，由於您沒有回應因此遊戲到此結束。下次見。"];
                    conv.ask(new SimpleResponse({
                        speech: `<speak><p><s>${pre_word}後頭可以接${sys_word}<break time="0.5s"/>接著，請你繼續接下去</s></p></speak>`,
                        text: "「" + pre_word + "」可以接「" + sys_word + "」， \n請試著繼續接下去。",
                    }));

                    //conv.ask(new Suggestions('查詢意思'));

                    if (jumpcount <= 4) {
                        conv.ask(new Suggestions('來點提示'));
                        conv.ask(new Suggestions('跳過這個成語'));
                    }

                    conv.ask(new Suggestions('放棄本回合'));

                    conv.contexts.set(Contexts.Explain, 1);
                    conv.contexts.set(Contexts.Quit, 1);
                    conv.contexts.set(Contexts.Skip, 1);
                    conv.contexts.set(Contexts.Get_hint, 1);
                    conv.contexts.set(Contexts.Repeat, 1);

                    conv.user.storage.menu = menu;
                    conv.user.storage.end_game = end_game;
                    conv.user.storage.question_output = question_output;
                    conv.user.storage.sys_word = sys_word;
                    conv.user.storage.last_word = last_word;
                    conv.user.storage.input_list = input_list;
                    conv.user.storage.Total_Count = Total_Count;
                    conv.user.storage.start_game = start_game;
                    conv.user.storage.jumpcount = jumpcount;

                    var explain = brief_explain[sys_word];
                    if (explain.indexOf("查「") !== -1) {
                        explain = brief_explain[brief_explain[sys_word].replace(/[\查|\「|\」|\辞]/gm, "")]
                    }

                    conv.ask(new BasicCard({
                        title: '『' + sys_word + '』',
                        subtitle: '解釋：' + explain,
                        text: '_[!]你目前剩下' + (5 - jumpcount) + '次跳過或獲取提示的機會_',
                    }));


                }
            }
        }
    } else {

        sys_word = conv.user.storage.sys_word;

        var explain = brief_explain[sys_word];
        if (explain.indexOf("查「") !== -1) {
            explain = brief_explain[brief_explain[sys_word].replace(/[\查|\「|\」|\辞]/gm, "")]
        }

        conv.noInputs = ["我剛剛說的是" + sys_word + "，請說以" + last_word + "為開頭的成語", "請繼續接龍吧，以" + last_word + "為開頭的成語", "抱歉，由於您沒有回應因此遊戲到此結束。下次見。"];

        conv.ask(new SimpleResponse({
            speech: `<speak><p><s>很抱歉，你已經用完跳過的機會，請試著自行繼續接下去</s></p></speak>`,
            text: '很抱歉，你已經用完跳過的機會了',
        }));

        conv.ask(new BasicCard({
            title: '『' + sys_word + '』',
            subtitle: '解釋：' + explain,
            text: '_[!]你已經用完跳過或獲取提示的機會_',
        }));

        if (jumpcount <= 4) {
            conv.ask(new Suggestions('來點提示'));
            conv.ask(new Suggestions('跳過這個成語'));
        }
        conv.ask(new Suggestions('放棄本回合'));

        conv.contexts.set(Contexts.Quit, 1);
        conv.contexts.set(Contexts.Skip, 1);
        conv.contexts.set(Contexts.Get_hint, 1);
        conv.contexts.set(Contexts.Repeat, 1);
    }

    conv.user.storage.menu = menu;
    conv.user.storage.end_game = end_game;
    conv.user.storage.question_output = question_output;
    conv.user.storage.sys_word = sys_word;
    conv.user.storage.last_word = last_word;
    conv.user.storage.input_list = input_list;
    conv.user.storage.Total_Count = Total_Count;
    conv.user.storage.start_game = start_game;
    conv.user.storage.jumpcount = jumpcount;

});

app.intent('結束對話', (conv) => {

    conv.user.storage = {}; //離開同時清除暫存資料
    conv.ask('希望你玩得愉快!');
    conv.ask(new SimpleResponse({ speech: '下次見', text: '下次見 👋', }));
    conv.close(new BasicCard({
        title: '感謝您的使用!',
        text: '如果有任何需要改進的地方，  \n歡迎到簡介頁面評分或給予反饋，謝謝!',
        buttons: new Button({ title: '開啟本程式的商店頁面', url: 'https://assistant.google.com/services/a/uid/0000005fc779da97', }),
    }));

});

exports.idiom_solitaire = functions.https.onRequest(app);