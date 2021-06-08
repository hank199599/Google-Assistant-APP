'use strict';

// Import the Dialogfempty module from the Actions on Google client library.
const {
    dialogflow,
    Permission,
    Suggestions,
    SimpleResponse,
    Button,
    Image,
    BasicCard,
    Carousel,
    BrowseCarousel,
    BrowseCarouselItem,
    items,
    Table
} = require('actions-on-google');

const functions = require('firebase-functions');
var getJSON = require('get-json');
const findNearestLocation = require('map-nearest-location');
const admin = require('firebase-admin');
const replaceString = require('replace-string');

var county_list = require('./county_list.json');
var site_list = require('./donation_site.json');
var blood_detail = require('./blood_store.json');
var status_generator = require('./status_generator.json');
var bloodtypes = ["A", "B", "O", "AB"];

let serviceAccount = require("./config/b1a2b-krmfch-firebase-adminsdk-1tgdm-057878eab0.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://b1a2b-krmfch.firebaseio.com/"
});

const database = admin.database();

const app = dialogflow({ debug: true });

var i = 0;
var index_array = ["台北", "新竹", "台中", "台南", "高雄"];
var type_array = ["A", "B", "O", "AB"];
var county_array = ["南投縣", "連江縣", "馬祖", "南投", "雲林縣", "雲林", "金門縣", "金門", "苗栗縣", "苗栗", "高雄市", "高雄", "嘉義市", "花蓮縣", "花蓮", "嘉義縣", "臺東縣", "台東縣", "台東", "臺東", "嘉義", "基隆市", "台北市", "台南市", "臺南市", "台南", "臺南", "臺北市", "台北", "臺北", "基隆", "宜蘭縣", "台中市", "臺中市", "台中", "澎湖縣", "澎湖", "桃園市", "桃園", "新竹縣", "新竹市", "新竹", "新北市", "新北", "宜蘭", "屏東縣", "屏東", "彰化縣", "彰化", "南海島", "釣魚臺", "南海諸島"];
var local = ["Northen", "Central", "Southen", "East", "Outlying_island"];
var locations = [{ lat: 25.0320486, lng: 121.5352101, location: "大安號捐血車", address: "臺北市台北市建國南路2段", time: "每週四~週日09:00~17:00", note: "全血" }, { lat: 25.0431131, lng: 121.5161308, location: "公園號捐血車", address: "臺北市公園路+襄陽路口", time: "10:00~18:00", note: "全血" }, { lat: 25.0376707, lng: 121.5615909, location: "市府捐血室", address: "臺北市市府路1號市政府西大門內左側", time: "9:00~17:00(週六、週日不作業)", note: "全血、分離術" }, { lat: 25.0424762, lng: 121.543924, location: "忠孝號捐血車", address: "臺北市大安路一段瑠公公園旁", time: "11:00~19:00", note: "全血" }, { lat: 25.0508369, lng: 121.5421039, location: "長春捐血室", address: "臺北市復興北路69號5樓", time: "9:00~17:00(週日不作業) ", note: "全血、分離術" }, { lat: 25.0328082, lng: 121.5150508, location: "南海捐血室", address: "臺北市南海路1號3樓", time: "8:00~17:30", note: "全血、分離術" }, { lat: 25.0439287, lng: 121.5030712, location: "峨嵋號捐血車", address: "臺北市萬華區峨嵋街立體停車場旁", time: "13:00~21:00", note: "全血" }, { lat: 25.0460959, lng: 121.516228, location: "捷運捐血室", address: "臺北市台北車站B1，M7出口誠品書店旁", time: "10:00~18:00", note: "全血" }, { lat: 25.0461275, lng: 121.5065917, location: "新光號捐血車", address: "臺北市忠孝西路一段66號面對新光摩天大樓左側腹地", time: "11:00~19:00", note: "全血" }, { lat: 25.1273476, lng: 121.4696273, location: "關渡捐血室", address: "臺北市立德路123號", time: "8:00~17:00", note: "全血、分離術" }, { lat: 25.057692, lng: 121.4865207, location: "三重捐血室", address: "新北市三重區重新路四段12號7樓之2", time: "9:00~17:00", note: "全血、分離術" }, { lat: 24.9850164, lng: 121.450944, location: "土城號捐血車", address: "新北市土城區裕民路171巷裕民廣場內", time: "每週六、日10:00~18:00", note: "全血" }, { lat: 25.0024006, lng: 121.5106763, location: "中和號捐血車", address: "新北市中和區中安街圖書館旁", time: "9:00~17:00", note: "全血" }, { lat: 25.0637341, lng: 121.6545761, location: "汐止捐血室", address: "新北市汐止區新台五路一段207號11樓B室", time: "9:00~17:00(週六不作業)", note: "全血、分離術" }, { lat: 25.0093602, lng: 121.4599484, location: "府中捐血室", address: "新北市板橋區中山路一段50巷36號2樓之4", time: "10:00~18:00", note: "全血" }, { lat: 25.0314848, lng: 121.4685312, location: "板橋捐血站", address: "新北市板橋區雙十路三段27號2樓", time: "08:00-17:00", note: "全血、分離術" }, { lat: 24.9827035, lng: 121.5350281, location: "新店捐血室", address: "新北市新店區民權路95號6樓之2", time: "9:00~17:00", note: "全血、分離術" }, { lat: 25.0434746, lng: 121.450376, location: "新莊號捐血車", address: "新北市新莊區中華路一段+復興路一段交叉口", time: "10:00~18:00", note: "全血" }, { lat: 25.128539, lng: 121.7544271, location: "基隆捐血站", address: "基隆市信一路14號1樓", time: "08:00-17:00", note: "全血、分離術" }, { lat: 24.744303, lng: 121.7506904, location: "宜蘭捐血站", address: "宜蘭縣宜蘭市擺厘路16-7號", time: "8:00~17:00", note: "全血、分離術" }, { lat: 24.6766833, lng: 121.766925, location: "羅東萬連號捐血車", address: "宜蘭縣羅東鎮公所前", time: "週一、四(春節假期休息)9:00~15:00", note: "全血" }, { lat: 23.9781133, lng: 121.6083901, location: "中山捐血室", address: "花蓮縣花蓮市中山路231號3樓", time: "週四~週六 09:30~17:30 ", note: "全血" }, { lat: 23.9995516, lng: 121.5920427, location: "花蓮捐血站", address: "花蓮縣花蓮市中山路一段170號", time: "8:30~17:00", note: "全血" }, { lat: 24.8108594, lng: 120.9577184, location: "西大捐血室", address: "新竹市文雅街6號", time: "09:00-17:00", note: "全血、分離術" }, { lat: 24.8339498, lng: 120.9968618, location: "竹北愛心樓", address: "新竹縣竹北市光明11路215巷8號", time: "08:00~17:00", note: "全血、分離術" }, { lat: 24.9559892, lng: 121.226132, location: "中壢捐血室", address: "桃園市中壢區中央東路88號16樓", time: "09:00~17:30", note: "全血、分離術" }, { lat: 25.061307, lng: 121.3679247, location: "長庚捐血室", address: "桃園市龜山區公西村復興街5號", time: "09:00~17:00(週日及國定假日不作業)", note: "全血、分離術" }, { lat: 24.993948, lng: 121.3036787, location: "桃園捐血站", address: "桃園市桃園區文康街61號", time: "08:00~17:00", note: "全血、分離術" }, { lat: 24.9389476, lng: 121.2464533, location: "龍岡捐血室", address: "桃園市中壢區後寮一路188號", time: "09：00~17：00 (週三不作業)", note: "全血" }, { lat: 24.6921554, lng: 120.8796045, location: "竹南捐血室", address: "苗栗縣竹南鎮光復路372號", time: "09:00~17:30", note: "全血、分離術" }, { lat: 24.5713259, lng: 120.8295529, location: "苗栗捐血站", address: "苗栗縣苗栗市為公路282號", time: "08:00-17:00 (週四至週日作業、週一至週三不作業)", note: "全血" }, { lat: 24.6875172, lng: 120.9083048, location: "頭份捐血室", address: "苗栗縣頭份鎮仁愛路116號", time: "09:00-17:00(週一至週三作業、週四至週日不作業)", note: "全血" }, { lat: 24.138164, lng: 120.6752921, location: "三民捐血室", address: "臺中市西區三民路1段174號7樓", time: "08:00~17:00(每日)", note: "全血、分離術" }, { lat: 24.1088165, lng: 120.6902945, location: "大里捐血室", address: "臺中市大里區中興路二段438號5樓", time: "09:30~18:00(每日)", note: "全血、分離術" }, { lat: 24.1564797, lng: 120.6814731, location: "中正公園捐血室", address: "臺中市北區學士路91號正對面", time: "09:00~17:00(每日)", note: "全血" }, { lat: 24.1564795, lng: 120.6727398, location: "中港捐血室", address: "臺中市40764西屯區台灣大道4段1176號", time: "08:00~18:00(每日)", note: "全血、分離術" }, { lat: 24.1641111, lng: 120.6421111, location: "新光三越捐血車", address: "臺中市西屯區惠來路二段市政北七路口", time: "10:30~18:30(每日)", note: "全血" }, { lat: 24.1463687, lng: 120.6855967, location: "臺中公園捐血車", address: "臺中市北區精武路291之3號對面", time: "星期一~星期四 12:00~18:30 ,星期五~星期日 10:30~18:30", note: "全血" }, { lat: 24.2522345, lng: 120.7294708, location: "豐原捐血室", address: "臺中市豐原區北陽路2號", time: "09:00~18:00(每日)", note: "全血、分離術" }, { lat: 24.0606039, lng: 120.5352666, location: "彰化捐血站", address: "彰化縣彰化市中山路一段348號", time: "08:00~17:00(星期一~星期五),08:00~18:00(星期六~星期日)", note: "全血、分離術" }, { lat: 23.7130497, lng: 120.5406792, location: "雲林捐血站", address: "雲林縣斗六市漢口路187號", time: "08:00~17:00", note: "全血、分離術" }, { lat: 23.970582, lng: 120.9679779, location: "南投捐血室", address: "南投縣南投市中興路616號1樓", time: "09:00~17:00(每日)", note: "全血、分離術" }, { lat: 23.970582, lng: 120.9679779, location: "埔里捐血站", address: "南投縣埔里鎮北環路222號", time: "8:30~17:00", note: "全血" }, { lat: 22.9989798, lng: 120.2326696, location: "小東捐血室", address: "臺南市北區小東路423巷1-2號", time: "每日08:00~17:00", note: "全血、分離術" }, { lat: 23.0019974, lng: 120.2093882, location: "中山捐血車", address: "臺南市台南市北區公園路上", time: "平日09:30~17:30、假日09:00~17:00(週三休息日)", note: "全血" }, { lat: 22.983739, lng: 120.199855, location: "台南捐血中心", address: "臺南市中西區永福路一段85號", time: "每日08:00~18:00", note: "全血、分離術" }, { lat: 23.0100379, lng: 120.1956905, location: "和緯捐血室", address: "臺南市和緯路三段330號", time: "週三~週日10:00-18:00", note: "全血" }, { lat: 23.3104554, lng: 120.3155785, location: "新營捐血室", address: "臺南市新營區中正路23之1號", time: "08:00~17:00", note: "全血、分離術" }, { lat: 23.4816699, lng: 120.4641206, location: "嘉義公園捐血車", address: "嘉義市立棒球場大巴士停車場", time: "週三~週日09:00~17:00", note: "全血" }, { lat: 23.4854991, lng: 120.4426089, location: "嘉義捐血站", address: "嘉義市博愛路一段488號", time: "每日08:00-17:00", note: "全血、分離術" }, { lat: 22.6802212, lng: 120.3087988, location: "左營捐血室", address: "高雄市左營區博愛三路635號", time: "09:30-18:00", note: "全血、分離術" }, { lat: 22.798241, lng: 120.2930875, location: "岡山捐血室", address: "高雄市岡山區壽華路58號", time: "09:00-17:00逢週一、五暫停作業", note: "全血、分離術" }, { lat: 22.6229511, lng: 120.2981509, location: "前金捐血室", address: "高雄市前金區中華三路7號6樓", time: "09:00-17:30", note: "全血" }, { lat: 22.6217141, lng: 120.3098433, location: "苓雅捐血室", address: "高雄市苓雅區復興二路206號", time: "平日10:00-18:00 假日09:30-18:00(逢週一、週二暫停)", note: "全血" }, { lat: 22.6477044, lng: 120.3034788, location: "捷運三民捐血室", address: "高雄市三民區博愛一路220號", time: "平日10:00-18:00 假日09:30-18:00(逢週一暫停)", note: "全血" }, { lat: 22.5878848, lng: 120.3218834, location: "捷運前鎮捐血室", address: "高雄市前鎮區平等里6鄰翠亨北路225號", time: "平日10:00-17:30 假日09:30-17:30(逢週一、週五暫停)", note: "全血" }, { lat: 22.6254448, lng: 120.3635044, location: "捷運鳳山捐血室", address: "高雄市鳳山區光遠路226號", time: "平日09:30-17:30 假日09:00-17:30", note: "全血" }, { lat: 22.728882, lng: 120.320602, location: "楠梓捐血室", address: "高雄市楠梓區高楠公路1837號", time: "08:00-17:00", note: "全血、分離術" }, { lat: 22.6897737, lng: 120.488831, location: "屏東捐血站", address: "屏東縣屏東市忠孝路295號", time: "08:00-17:00", note: "全血、分離術" }, { lat: 23.563636, lng: 119.564099, location: "馬公捐血站", address: "澎湖縣馬公市中山路62號", time: "08:30-17:00", note: "全血、分離術" }, { lat: 22.7658722, lng: 121.1391243, location: "台東捐血站", address: "臺東縣台東市四維路三段198號", time: "08:00-17:00", note: "全血、分離術" }];


function status_outputer(input) {
    var temp = "";
    var i = 0;
    var array1 = [];
    var array2 = [];
    var array3 = [];
    var array4 = [];

    for (i = 0; i < 4; i++) {
        if (input[i] === "full") { array1.push('<say-as interpret-as="characters">' + type_array[i] + '</say-as>型'); } else if (input[i] === "medium") { array2.push('<say-as interpret-as="characters">' + type_array[i] + '</say-as>型'); } else if (input[i] === "empty") { array3.push('<say-as interpret-as="characters">' + type_array[i] + '</say-as>型'); } else { array4.push('<say-as interpret-as="characters">' + type_array[i] + '</say-as>型'); }
    }
    if (array1.length !== 0) { temp = temp + array1 + "庫存量正常，"; }
    if (array2.length !== 0) { temp = temp + array2 + "庫存量偏低，"; }
    if (array3.length !== 0) { temp = temp + array3 + "庫存量嚴重不足，"; }
    if (array4.length !== 0) { temp = temp + array4 + "庫存量資訊未知，"; }

    return replaceString(temp, ',', '<break time="0.25s"/>');

}

const SelectContexts = {
    parameter: 'select ',
}

app.intent('預設歡迎語句', (conv) => {

    var card_content={
        image: new Image({ url: 'https://raw.githubusercontent.com/hank199599/Google-Assistant-APP/master/%E6%8D%90%E8%A1%80%E5%B9%AB%E6%89%8B/assets/CZ2R8WB.jpg', alt: 'Pictures', }),
        title: "請選擇要使用的查詢方式!",
        subtitle: '✱免責聲明：\n這是非官方服務，\n如欲取得官方發布之最新訊息請參照官方網站!',
        buttons: new Button({ title: '台灣血液基金會', url: 'http://www.blood.org.tw/Internet/main/index.aspx', }),
    }

    var sppech_content = {}

    if (conv.user.last.seen) { sppech_content.text= "歡迎回來!";}
    else{sppech_content.text= "歡迎使用!"}

    sppech_content.speech=sppech_content.text+"您可以透過我查詢全台各處的捐血站與血庫庫存情形。"

    return new Promise(
        function(resolve) {
           database.ref('/TWblood').on('value', e => { resolve(e.val()) });
        }).then(function(origin_data) {

            if(new Date().getMinutes()<15){
                  database.ref('/TWblood').update(origin_data)
            }

        if (conv.screen) {
            
            card_content.text="血庫庫存資訊更新於" + origin_data.PublishTime;

            conv.ask(new SimpleResponse(sppech_content));
            conv.ask(new BasicCard(card_content));
            conv.ask(new Suggestions('🌎 最近的捐血站', '🩸 血庫資訊查詢', '全台捐血地點', '👋 掰掰'));

            conv.user.storage.direct = false;
        } else {
            conv.ask(`<speak><p><s>歡迎使用，在這裡，您可以查詢全台各處血庫庫存情形。</s></p></speak>`);
            conv.ask(`<speak><p><s>你可以問，${index_array[parseInt(Math.random() * 4)]}的${type_array[parseInt(Math.random() * 3)]}型寫庫存為多少?</s></p></speak>`);
            conv.noInputs = ["請試著問我要查看的捐血中心", "請試著問我要查看的捐血中心，例如、" + index_array[parseInt(Math.random() * 4)] + "的" + type_array[parseInt(Math.random() * 3)] + "型寫庫存是多少?", "很抱歉，我幫不上忙"];
        }

    }).catch(function(error) {

        console.log(error)

        conv.ask(new SimpleResponse(sppech_content));
        conv.ask(new BasicCard(card_content));
        conv.ask(new Suggestions('🌎 最近的捐血站', '🩸 血庫資訊查詢', '全台捐血地點', '👋 掰掰'));
    });

});

app.intent('預設罐頭回覆', (conv) => {

    var index1 = index_array[parseInt(Math.random() * 4)];
    var type1 = type_array[parseInt(Math.random() * 3)];
    var index2 = index_array[parseInt(Math.random() * 4)];
    var type2 = type_array[parseInt(Math.random() * 3)];
    conv.noInputs = ["請試著問我要查看的捐血中心", "請試著問我要查看的捐血中心，例如、" + index2 + "的" + type2 + "型寫庫存是多少?", "很抱歉，我幫不上忙"];

    if (conv.input.raw === "回主頁面" || conv.input.raw.indexOf('返回') !== -1 || conv.input.raw.indexOf('主頁') !== -1) {
        if (conv.screen) {
            conv.user.storage.direct = false;
            conv.contexts.set(SelectContexts.parameter, 1);
            conv.ask(new SimpleResponse({ speech: `<speak><p><s>請選擇要使用的服務，你可以查詢捐血點或是血庫庫存情形。</s></p></speak>`, text: "請透過點擊建議卡片，\n選擇要使用的服務。" }));
            conv.ask(new Carousel({
                title: 'Carousel Title',
                items: {
                    'Blood_store': {
                        synonyms: ['血庫', '庫存', '血量'],
                        title: '🩸 血庫資訊查詢',
                        description: '查看捐血中心庫存',
                    },
                    'Blood_location': {
                        synonyms: ['捐血點', '地方', '地點'],
                        title: '全台捐血地點',
                        description: '查看各地的固定捐血點',
                    },
                },
            }));
            conv.ask(new Suggestions('🌎 最近的捐血站', '👋 掰掰'));
        } else {
            conv.ask(`<speak><p><s>抱歉我不懂你的意思，請試著詢問<break time="0.2s"/>${index1}的${type1}型寫庫存為多少?</s></p></speak>`);
        }
    } else if (conv.input.raw.indexOf('語音') !== -1) {
        if (conv.screen) {
            conv.user.storage.direct = false;
            conv.ask(new SimpleResponse({ speech: `<speak><p><s>在任意畫面中</s><s>您可以透過詢問快速查詢各捐血中心的血庫情形。</s><s>例如，你可以試著問<break time="0.2s"/>${index1}的${type1}型寫庫存為多少?</s></p></speak>`, text: "透過詢問各捐血中心之血庫情形，\n說明如下。" }));

            conv.ask(new BasicCard({
                title: "語音查詢說明",
                subtitle: "透過詢問獲得各捐血中心之庫存資訊  \n • 捐血中心: 台北、新竹、台中、臺南、高雄  \n• 可查詢的血型:A型、B型、O型、AB型",
                text: "查詢範例：  \n「*" + index1 + "的" + type1 + "型血庫存為多少？*」   \n「*幫我查" + index2 + "的" + type2 + "型血庫存*」",
            }));
            conv.ask(new Suggestions(index1 + "的" + type1 + "型血庫存為多少", "幫我查" + index2 + "的" + type2 + "型血庫存", '我想知道' + index_array[parseInt(Math.random() * 4)] + "的" + type_array[parseInt(Math.random() * 3)] + "型血還有多少庫存"));
        } else {
            var index1 = index_array[parseInt(Math.random() * 4)];
            var type1 = type_array[parseInt(Math.random() * 3)];
            conv.ask(`<speak><p><s>抱歉我不懂你的意思，請試著詢問<break time="0.2s"/>${index1}的${type1}型寫庫存為多少?</s></p></speak>`);
        }

    } else {

        if (conv.screen) {
            conv.user.storage.direct = false;
            conv.contexts.set(SelectContexts.parameter, 1);
            conv.ask(new SimpleResponse({ speech: `<speak><p><s>抱歉，我不懂你的意思</s><s>請選擇要使用的服務，你可以查詢捐血點或是血庫庫存情形。</s></p></speak>`, text: "抱歉，我不懂你的意思。\n請選擇要使用的服務。" }));
            conv.ask(new Carousel({
                title: 'Carousel Title',
                items: {
                    'Blood_store': {
                        synonyms: ['血庫', '庫存', '血量'],
                        title: '🩸 血庫資訊查詢',
                        description: '查看捐血中心庫存',
                    },
                    'Blood_location': {
                        synonyms: ['捐血點', '地方', '地點'],
                        title: '全台捐血地點',
                        description: '查看各地的固定捐血點',
                    },
                },
            }));
        } else {
            var index1 = index_array[parseInt(Math.random() * 4)];
            var type1 = type_array[parseInt(Math.random() * 3)];
            conv.ask(`<speak><p><s>抱歉我不懂你的意思，請試著詢問<break time="0.2s"/>${index1}的${type1}型寫庫存為多少?</s></p></speak>`);
        }
        conv.ask(new Suggestions('🌎 最近的捐血站', '👋 掰掰'));
    }

});

app.intent('血庫資訊查詢', (conv) => {

    conv.noInputs = ["請試著問我要查看的捐血中心", "請試著問我要查看的捐血中心，例如、" + index_array[parseInt(Math.random() * 4)] + "的" + type_array[parseInt(Math.random() * 3)] + "型寫庫存是多少?", "很抱歉，我幫不上忙"];
    conv.ask(new SimpleResponse({
        speech: `<speak><p><s>請選擇要查詢的捐血中心!</s><s>選項有以下幾個<break time="0.5s"/>台北捐血中心<break time="0.2s"/>新竹捐血中心<break time="0.2s"/>台中捐血中心<break time="0.2s"/>台南捐血中心<break time="0.2s"/>高雄捐血中心<break time="1s"/>請選擇。</s></p></speak>`,
        text: '請選擇要查詢的捐血中心'
    }));
    conv.contexts.set(SelectContexts.parameter, 1);

    conv.ask(new Carousel({
        title: 'Carousel Title',
        items: {
            '台北': {
                synonyms: ['台北', '新北', '宜蘭', '基隆', '花蓮', '臺北'],
                title: '台北捐血中心',
                description: '北北基、宜蘭、花蓮',
            },
            '新竹': {
                synonyms: ['桃園', '新竹', '苗栗'],
                title: '新竹捐血中心',
                description: '桃園、新竹、苗栗',
            },
            '台中': {
                synonyms: ['台中', '彰化', '南投', '雲林'],
                title: '台中捐血中心',
                description: '台中、彰化、南投\n雲林',
            },
            '台南': {
                synonyms: ['嘉義', '臺南'],
                title: '台南捐血中心',
                description: '嘉義縣市、台南市',
            },
            '高雄': {
                synonyms: ['高雄', '屏東', '台東', '澎湖'],
                title: '高雄捐血中心',
                description: '高雄、屏東、台東\n澎湖',
            },
        },
    }));
    conv.ask(new Suggestions('🌎 最近的捐血站', '全台捐血地點', '語音指令說明', '回主頁面', '👋 掰掰'));

    conv.user.storage.direct = false;

});

app.intent('依區域查詢', (conv) => {

    conv.user.storage.bloodtype = undefined;
    conv.contexts.set(SelectContexts.parameter, 1);
    conv.noInputs = ["請試著問我要查看的捐血中心", "請試著問我要查看的捐血中心，例如、" + index_array[parseInt(Math.random() * 4)] + "的" + type_array[parseInt(Math.random() * 3)] + "型寫庫存是多少?", "很抱歉，我幫不上忙"];

    if (conv.screen) { conv.ask('請輕觸下方卡片來選擇查詢區域'); } else {
        conv.ask(new SimpleResponse({
            speech: `<speak><p><s>請選擇要查詢的區域!</s><s>選項有以下幾個<break time="0.5s"/>北部地區<break time="0.2s"/>中部地區<break time="0.2s"/>南部地區<break time="0.2s"/>東部地區<break time="0.2s"/>離島地區<break time="1s"/>請選擇。</s></p></speak>`,
            text: '請輕觸下方卡片來選擇查詢區域!'
        }));
    }
    conv.ask(new Carousel({
        title: 'Carousel Title',
        items: {
            'Northen': {
                synonyms: ['台北', '新北', '桃園', '新竹'],
                title: '北部地區',
                description: '北北基、桃園市\n新竹縣市',
            },
            'Central': {
                synonyms: ['苗栗', '台中', '雲林', '彰化', '南投'],
                title: '中部地區',
                description: '苗栗縣、臺中市\n雲林、彰化、南投',
            },
            'Southen': {
                synonyms: ['嘉義', '台南', '高雄', '屏東'],
                title: '南部地區',
                description: '嘉義縣市、台南市、\n高雄市、屏東縣',
            },
            'East': {
                synonyms: ['宜蘭', '花蓮', '台東'],
                title: '東部地區',
                description: '宜蘭、花蓮、台東\n',
            },
            'Outlying_island': {
                synonyms: ['澎湖', '金門', '連江', '媽祖', '馬祖'],
                title: '離島地區',
                description: '澎湖縣、金門縣、\n連江縣',
            }
        },
    }));
    conv.ask(new Suggestions('🌎 最近的捐血站', '🩸 血庫資訊查詢', '回主頁面', '👋 掰掰'));
    conv.user.storage.direct = false;

});

app.intent('區域查詢結果', (conv, input, option) => {

    conv.noInputs = ["請試著問我要查看的捐血中心", "請試著問我要查看的捐血中心，例如、" + index_array[parseInt(Math.random() * 4)] + "的" + type_array[parseInt(Math.random() * 3)] + "型寫庫存是多少?", "很抱歉，我幫不上忙"];
    if (index_array.indexOf(option) !== -1) {
        return new Promise(

            function(resolve) {
                database.ref('/TWblood').on('value', e => { resolve(e.val()) });
            }).then(function(final_data) {

            var temp = final_data[blood_detail[option].name];

            console.log(temp)

            conv.ask(new SimpleResponse({
                speech: `<speak><p><s>以下是${option}捐血中心的血庫情形!</s><s>${status_outputer(temp)}</s></p></speak>`,
                text: '以下是「' + option + '捐血中心」的血庫情形'
            }));

            var blood_table = [];

            for (var i = 0; i < temp.length; i++) {
                var status_list = status_generator[temp[i]];
                blood_table.push({ cells: [bloodtypes[i], status_list.light + ' ' + status_list.status, status_list.stock] })
            }

            conv.ask(new Table({
                title: option + '捐血中心',
                subtitle: '更新時間 • ' + final_data.PublishTime,
                columns: [{ header: '血型', align: 'CENTER', }, { header: '庫存量', align: 'CENTER', }, { header: '狀態', align: 'CENTER', }],
                rows: blood_table,
                buttons: new Button({
                    title: option + '捐血中心官方頁面',
                    url: blood_detail[option].url,
                }),
            }));

            conv.ask(new Suggestions('🌎 最近的捐血站', '查詢其他位置', '全台捐血地點', '👋 掰掰'));
            conv.user.storage.location = option;
        }).catch(function(error) {
            console.log(error)
            conv.ask(new SimpleResponse({
                speech: `<speak><p><s>抱歉，獲取資料過程發生一點小狀況!</s><s>麻煩你重新點選要查看的捐血中心。</s></p></speak>`,
                text: '發生一點小狀況，請重新選擇'
            }));
            conv.contexts.set(SelectContexts.parameter, 1);

            conv.ask(new Carousel({
                title: 'Carousel Title',
                items: {
                    '台北': {
                        title: '台北捐血中心',
                        description: '北北基、宜蘭、花蓮',
                    },
                    '新竹': {
                        title: '新竹捐血中心',
                        description: '桃園、新竹、苗栗',
                    },
                    '台中': {
                        title: '台中捐血中心',
                        description: '台中、彰化、南投\n雲林',
                    },
                    '台南': {
                        title: '台南捐血中心',
                        description: '嘉義縣市、台南市',
                    },
                    '高雄': {
                        title: '高雄捐血中心',
                        description: '高雄、屏東、台東\n澎湖',
                    },
                },
            }));
            conv.ask(new Suggestions('🌎 最近的捐血站', '全台捐血地點', '語音指令說明', '回主頁面', '👋 掰掰'));
        });
    } else if (local.indexOf(option) !== -1) {
        conv.contexts.set(SelectContexts.parameter, 1);
        conv.ask('請選擇要查詢的縣市。');

        conv.ask(new Carousel({ items: county_list[option], }));
        conv.ask(new Suggestions('回主頁面', '👋 掰掰'));

    } else if (option === "Blood_store") {
        conv.contexts.set(SelectContexts.parameter, 1);
        conv.ask(new SimpleResponse({
            speech: `<speak><p><s>請選擇要查詢的捐血中心!</s><s>選項有以下幾個<break time="0.5s"/>台北捐血中心<break time="0.2s"/>新竹捐血中心<break time="0.2s"/>台中捐血中心<break time="0.2s"/>台南捐血中心<break time="0.2s"/>高雄捐血中心<break time="1s"/>請選擇。</s></p></speak>`,
            text: '請選擇要查詢的捐血中心'
        }));

        conv.ask(new Carousel({
            title: 'Carousel Title',
            items: {
                '台北': {
                    title: '台北捐血中心',
                    description: '北北基、宜蘭、花蓮',
                },
                '新竹': {
                    title: '新竹捐血中心',
                    description: '桃園、新竹、苗栗',
                },
                '台中': {
                    title: '台中捐血中心',
                    description: '台中、彰化、南投\n雲林',
                },
                '台南': {
                    title: '台南捐血中心',
                    description: '嘉義縣市、台南市',
                },
                '高雄': {
                    title: '高雄捐血中心',
                    description: '高雄、屏東、台東\n澎湖',
                },
            },
        }));
        conv.ask(new Suggestions('🌎 最近的捐血站', '全台捐血地點', '語音指令說明', '回主頁面', '👋 掰掰'));
        conv.user.storage.direct = false;
    } else if (option === "Blood_location") {
        conv.contexts.set(SelectContexts.parameter, 1);
        if (conv.screen) { conv.ask('請輕觸下方卡片來選擇查詢區域'); } else {
            conv.ask(new SimpleResponse({
                speech: `<speak><p><s>請選擇要查詢的區域!</s><s>選項有以下幾個<break time="0.5s"/>北部地區<break time="0.2s"/>中部地區<break time="0.2s"/>南部地區<break time="0.2s"/>東部地區<break time="0.2s"/>離島地區<break time="1s"/>請選擇。</s></p></speak>`,
                text: '請輕觸下方卡片來選擇查詢區域!'
            }));
        }
        conv.ask(new Carousel({
            title: 'Carousel Title',
            items: {
                'Northen': {
                    title: '北部地區',
                    description: '北北基、桃園市\n新竹縣市',
                },
                'Central': {
                    title: '中部地區',
                    description: '苗栗縣、臺中市\n雲林、彰化、南投',
                },
                'Southen': {
                    title: '南部地區',
                    description: '嘉義縣市、台南市、\n高雄市、屏東縣',
                },
                'East': {
                    title: '東部地區',
                    description: '宜蘭、花蓮、台東\n',
                },
                'Outlying_island': {
                    title: '離島地區',
                    description: '澎湖縣、金門縣、\n連江縣',
                }
            },
        }));
        conv.ask(new Suggestions('🌎 最近的捐血站', '🩸 血庫資訊查詢', '回主頁面', '👋 掰掰'));
        conv.user.storage.direct = false;
    } else if (county_array.indexOf(option) !== -1) {

        conv.contexts.set(SelectContexts.parameter, 1);

        var the_list = site_list[option];

        if (the_list.length >= 1) {
            conv.ask(new Suggestions("🩸 " + option.replace(/[\縣|\市]/gi, "") + '血庫庫存為何?'));
        }

        if (the_list.length > 1) {

            var temp = [];

            for (i = 0; i < the_list.length; i++) {
                temp.push(new BrowseCarouselItem(the_list[i]))
            }

            conv.ask(new SimpleResponse({ speech: `<speak><p><s>以下是${option}的固定捐血點列表，點擊該項目可在Google地圖上檢視位置。</s></p></speak>`, text: '以下是「' + option + '」的固定捐血點列表。\n點擊即可在Google地圖上查看。' }));
            conv.ask(new BrowseCarousel({ items: temp }));

        } else if (the_list.length === 1) {
            the_list = the_list[0];
            var output = {
                "title": the_list.title,
                "subtitle": the_list.description,
                "text": the_list.footer,
                "buttons": new Button({ title: '在地圖上查看該地點', url: the_list.url, })
            };
            conv.ask(new SimpleResponse({ speech: `<speak><p><s>在${option}，只有一個固定捐血點，請查看。</s></p></speak>`, text: '這是「' + option + '」的唯一一個固定捐血點。' }));
            conv.ask(new BasicCard(output));
        } else {
            conv.ask(new SimpleResponse({ speech: `<speak><p><s>糟糕，我在您指定的${option}找不到對應的固定捐血點列表，請前往官方網站查看相關資訊。</s></p></speak>`, text: '糟糕!\n我在「' + option + '」找不到固定捐血點。' }));
            conv.ask(new BasicCard({
                title: "404 NOT FOUND",
                subtitle: '在您指定的「' + option + '」找不到固定捐血站',
                text: "你可以前往官方網站查看相關資訊。",
                buttons: new Button({ title: '台灣血液基金會', url: 'http://www.blood.org.tw/Internet/main/index.aspx', }),
            }));
        }
        conv.ask(new Suggestions('🌎 最近的捐血站', '查詢其他捐血地點', '回主頁面', '👋 掰掰'));

    } else {
        conv.ask(new SimpleResponse({
            speech: `<speak><p><s>查詢發生錯誤</s></p></speak>`,
            text: '查詢發生錯誤'
        }));
    }

});

app.intent('取得地點權限', (conv) => {

    conv.data.requestedPermission = 'DEVICE_PRECISE_LOCATION';

    return conv.ask(new Permission({
        context: "在繼續操作前，建議你開啟裝置上的GPS功能來取得精確結果。接著，為了找到最近的固定捐血站位置",
        permissions: conv.data.requestedPermission,
    }));

    conv.ask(new Permission(options));

});


app.intent('回傳資訊', (conv, params, permissionGranted) => {

    if (permissionGranted) {

        const { requestedPermission } = conv.data;

        if (requestedPermission === 'DEVICE_PRECISE_LOCATION') {

            const coordinates = conv.device.location.coordinates;

            conv.ask(new Suggestions('重新定位'));

            if (coordinates) {
                const myLocation = {
                    lat: coordinates.latitude,
                    lng: coordinates.longitude
                };
                var data_return = findNearestLocation(myLocation, locations);
                var sitename = data_return.location.location; //透過模組找到最近的捐血站
                var distance = data_return.distance
                var address = data_return.location.address;
                var time = data_return.location.time;
                var note = data_return.location.note;

                conv.ask(new SimpleResponse({ speech: `<speak><p><s>查詢完成!</s><s>距離你最近的捐血站是<break time="0.2s"/>${sitename}。</s></p></speak>`, text: '最近的捐血站是「' + sitename + '」!' }));

                conv.ask(new BasicCard({
                    title: sitename,
                    subtitle: address + '\n距離你大約' + parseInt(distance) + '公尺',
                    text: '**作業時間**：' + time + '  \n**備註**：提供' + note + '捐血服務',
                    buttons: new Button({ title: '在Google地圖上檢視', url: 'https://www.google.com/maps/search/?api=1&query=' + sitename, }),
                }));
            } else {
                conv.ask(new SimpleResponse({ speech: `<speak><p><s>糟糕，我無法得知你的目前位置。</s><s>請稍後再試。</s></p></speak>`, text: "發生錯誤，請開啟GPS功能然後再試一次。" }));
            }
        }
    } else {
        conv.ask(new SimpleResponse({ speech: `<speak><p><s>很抱歉，由於未取得你的授權因此查詢失敗。</s><s>不過你隨時可以回來再試一次。</s></p></speak>`, text: "發生錯誤，未取得你的授權。" }));
    }
    conv.ask(new Suggestions('回主頁面', '👋 掰掰'));
});


app.intent('快速查詢', (conv, { locate, blood_type }) => {

    return new Promise(

        function(resolve) {

            database.ref('/TWblood').on('value', e => { resolve(e.val()) });

        }).then(function(final_data) {

        if (conv.user.storage.bloodtype !== undefined && blood_type.length === 0) { blood_type = conv.user.storage.bloodtype; }
        if (conv.user.storage.location !== undefined && locate.length === 0) { locate = conv.user.storage.location; }

        if (type_array.indexOf(blood_type) !== -1 && index_array.indexOf(locate) !== -1) {

            var state_get = final_data[blood_detail[locate].name][type_array.indexOf(blood_type)];
            var stock_now = status_generator[state_get].stock;
            var status_now = status_generator[state_get].status;
            var indicate = status_generator[state_get].light;

            conv.ask(new SimpleResponse({ speech: `<speak><p><s>根據最新資料顯示。</s><s>在${locate}捐血中心<break time="0.2s"/><say-as interpret-as="characters">${blood_type}</say-as>型寫為庫存量${status_now}</s></p></speak>`, text: '下方是您要求的資訊', }));

            conv.ask(new BasicCard({
                title: locate + '捐血中心/' + blood_type + '型血\n\n' + indicate + ' 庫存量' + stock_now + '(' + status_now + ')\n',
                text: '資料更新時間：' + final_data.PublishTime,
            }));

            for (i = 0; i < type_array.length; i++) { if (type_array[i] !== blood_type) { conv.ask(new Suggestions(type_array[i] + '型血呢?')); } }
            for (i = 0; i < index_array.length; i++) { if (index_array[i] !== locate) { conv.ask(new Suggestions(index_array[i] + '呢?')); } }
            conv.ask(new Suggestions('回主頁面', '👋 掰掰'));


            if (conv.user.storage.direct !== false) { conv.expectUserResponse = false } //告知Google助理結束對話
            else {
                conv.user.storage.bloodtype = blood_type;
                conv.user.storage.location = locate;
            }
        } else if (type_array.indexOf(blood_type) === -1 && index_array.indexOf(locate) !== -1) {

            var temp = final_data[blood_detail[locate].name];

            conv.ask(new SimpleResponse({
                speech: `<speak><p><s>以下是${locate}捐血中心的血庫情形!</s><s>${status_outputer(temp)}</s></p></speak>`,
                text: '以下是「' + locate + '捐血中心」的血庫情形'
            }));

            var blood_table = [];

            for (var i = 0; i < temp.length; i++) {
                var status_list = status_generator[temp[i]];
                blood_table.push({ cells: [bloodtypes[i], status_list.light + ' ' + status_list.status, status_list.stock] })
            }

            conv.ask(new Table({
                title: locate + '捐血中心',
                subtitle: '更新時間 • ' + final_data.PublishTime,
                columns: [{ header: '血型', align: 'CENTER', }, { header: '庫存量', align: 'CENTER', }, { header: '狀態', align: 'CENTER', }],
                rows: blood_table,
                buttons: new Button({
                    title: locate + '捐血中心官方頁面',
                    url: blood_detail[locate].url,
                }),
            }));

            conv.ask(new Suggestions('🌎 最近的捐血站', '查詢其他位置', '全台捐血地點', '👋 掰掰'));

            if (conv.user.storage.direct !== false) { conv.expectUserResponse = false } //告知Google助理結束對話
            else { conv.user.storage.location = locate; }
        } else {

            var index1 = index_array[parseInt(Math.random() * 4)];
            var type1 = type_array[parseInt(Math.random() * 3)];
            var index2 = index_array[parseInt(Math.random() * 4)];
            var type2 = type_array[parseInt(Math.random() * 3)];

            conv.ask(new SimpleResponse({
                speech: `<speak><p><s>抱歉</s><s>你的查詢方式有誤，請換個方式問問看</s><s>例如，${index1}的${type1}型血庫存為多少?</s></p></speak>`,
                text: '你的查詢方式有誤，請再試一次。'
            }));

            conv.ask(new BasicCard({
                title: "語音查詢說明",
                subtitle: "透過詢問獲得各捐血中心之庫存資訊  \n • 捐血中心: 台北、新竹、台中、臺南、高雄  \n• 可查詢的血型:A型、B型、O型、AB型",
                text: "查詢範例：  \n「*" + index1 + "的" + type1 + "型血庫存為多少？*」   \n「*幫我查" + index2 + "的" + type2 + "型血庫存*」",
            }));
            conv.ask(new Suggestions(index1 + "的" + type1 + "型血庫存為多少", "幫我查" + index2 + "的" + type2 + "型血庫存", '我想知道' + index_array[parseInt(Math.random() * 4)] + "的" + type_array[parseInt(Math.random() * 3)] + "型血還有多少庫存", '👋 掰掰'));

            if (conv.user.storage.direct !== false) { conv.expectUserResponse = false } //告知Google助理結束對話
        }

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


app.intent('結束對話', (conv) => {
    conv.user.storage = {}; //離開同時清除暫存資料
    conv.ask('希望能幫到一點忙!');
    conv.ask(new SimpleResponse({ speech: '下次見', text: '下次見 👋', }));
    conv.close(new BasicCard({
        title: '感謝您的使用!',
        text: '如果有任何需要改進的地方，  \n歡迎到簡介頁面評分或給予反饋，謝謝!',
        buttons: new Button({ title: '開啟本程式的商店頁面', url: 'https://assistant.google.com/services/a/uid/00000038f48e6d7d', }),
    }));
});


// Set the DialogfemptyApp object to handle the HTTPS POST request.
exports.tw_blood = functions.https.onRequest(app);