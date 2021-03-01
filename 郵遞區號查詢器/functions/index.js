'use strict';

// Import the Dialogflow module from the Actions on Google client library.
const {
    dialogflow,
    Permission,
    Suggestions,
    SimpleResponse,
    Button,
    Image,
    Carousel,
    BasicCard,
    LinkOutSuggestion,
    BrowseCarousel,
    BrowseCarouselItem,
    items,
    Table
} = require('actions-on-google');

const functions = require('firebase-functions');
var getJSON = require('get-json');
const replaceString = require('replace-string');
var county_option = require('./county_select.json')
var county_zip = require('./zip_code.json')


const app = dialogflow({ debug: true });
var checker = require('./zipcode');
var json = require('./address.json');
var output = "";
var Zipcode = 0; //郵政區號
var name = ""; //鄉鎮名稱
var county_array = ["南投縣", "連江縣", "馬祖", "南投", "雲林縣", "雲林", "金門縣", "金門", "苗栗縣", "苗栗", "高雄市", "高雄", "嘉義市", "花蓮縣", "花蓮", "嘉義縣", "台東縣", "臺東縣", "台東", "臺東", "嘉義", "基隆市", "台北市", "台南市", "臺南市", "台南", "臺南", "臺北市", "台北", "臺北", "基隆", "宜蘭縣", "台中市", "臺中市", "台中", "澎湖縣", "澎湖", "桃園市", "桃園", "新竹縣", "新竹市", "新竹", "新北市", "新北", "宜蘭", "屏東縣", "屏東", "彰化縣", "彰化", "南海島", "釣魚臺", "南海諸島"];
var city_array = ["基隆市仁愛區", "基隆市信義區", "基隆市中正區", "基隆市中山區", "基隆市安樂區", "基隆市暖暖區", "基隆市七堵區", "臺北市中正區", "臺北市大同區", "臺北市中山區", "臺北市松山區", "臺北市大安區", "臺北市萬華區", "臺北市信義區", "臺北市士林區", "臺北市北投區", "臺北市內湖區", "臺北市南港區", "臺北市文山區", "新北市萬里區", "新北市金山區", "新北市板橋區", "新北市汐止區", "新北市深坑區", "新北市石碇區", "新北市瑞芳區", "新北市平溪區", "新北市雙溪區", "新北市貢寮區", "新北市新店區", "新北市坪林區", "新北市烏來區", "新北市永和區", "新北市中和區", "新北市土城區", "新北市三峽區", "新北市樹林區", "新北市鶯歌區", "新北市三重區", "新北市新莊區", "新北市泰山區", "新北市林口區", "新北市蘆洲區", "新北市五股區", "新北市八里區", "新北市淡水區", "新北市三芝區", "新北市石門區", "宜蘭縣宜蘭市", "宜蘭縣頭城鎮", "宜蘭縣礁溪鄉", "宜蘭縣壯圍鄉", "宜蘭縣員山鄉", "宜蘭縣羅東鎮", "宜蘭縣三星鄉", "宜蘭縣大同鄉", "宜蘭縣五結鄉", "宜蘭縣冬山鄉", "宜蘭縣蘇澳鎮", "宜蘭縣南澳鄉", "宜蘭縣釣魚臺列嶼", "新竹市東區", "新竹市北區", "新竹市香山區", "新竹縣竹北市", "新竹縣湖口鄉", "新竹縣新豐鄉", "新竹縣新埔鎮", "新竹縣關西鎮", "新竹縣芎林鄉", "新竹縣寶山鄉", "新竹縣竹東鎮", "新竹縣五峰鄉", "新竹縣橫山鄉", "新竹縣尖石鄉", "新竹縣北埔鄉", "新竹縣峨嵋鄉", "桃園市中壢區", "桃園市平鎮區", "桃園市龍潭區", "桃園市楊梅區", "桃園市新屋區", "桃園市觀音區", "桃園市桃園區", "桃園市龜山區", "桃園市八德區", "桃園市大溪區", "桃園市復興區", "桃園市大園區", "桃園市蘆竹區", "苗栗縣竹南鎮", "苗栗縣頭份市", "苗栗縣三灣鄉", "苗栗縣南庄鄉", "苗栗縣獅潭鄉", "苗栗縣後龍鎮", "苗栗縣通霄鎮", "苗栗縣苑裡鎮", "苗栗縣苗栗市", "苗栗縣造橋鄉", "苗栗縣頭屋鄉", "苗栗縣公館鄉", "苗栗縣大湖鄉", "苗栗縣泰安鄉", "苗栗縣銅鑼鄉", "苗栗縣三義鄉", "苗栗縣西湖鄉", "苗栗縣卓蘭鎮", "臺中市中區", "臺中市東區", "臺中市南區", "臺中市西區", "臺中市北區", "臺中市北屯區", "臺中市西屯區", "臺中市南屯區", "臺中市太平區", "臺中市大里區", "臺中市霧峰區", "臺中市烏日區", "臺中市豐原區", "臺中市后里區", "臺中市石岡區", "臺中市東勢區", "臺中市和平區", "臺中市新社區", "臺中市潭子區", "臺中市大雅區", "臺中市神岡區", "臺中市大肚區", "臺中市沙鹿區", "臺中市龍井區", "臺中市梧棲區", "臺中市清水區", "臺中市大甲區", "臺中市外埔區", "臺中市大安區", "彰化縣彰化市", "彰化縣芬園鄉", "彰化縣花壇鄉", "彰化縣秀水鄉", "彰化縣鹿港鎮", "彰化縣福興鄉", "彰化縣線西鄉", "彰化縣和美鎮", "彰化縣伸港鄉", "彰化縣員林市", "彰化縣社頭鄉", "彰化縣永靖鄉", "彰化縣埔心鄉", "彰化縣溪湖鎮", "彰化縣大村鄉", "彰化縣埔鹽鄉", "彰化縣田中鎮", "彰化縣北斗鎮", "彰化縣田尾鄉", "彰化縣埤頭鄉", "彰化縣溪州鄉", "彰化縣竹塘鄉", "彰化縣二林鎮", "彰化縣大城鄉", "彰化縣芳苑鄉", "彰化縣二水鄉", "南投縣南投市", "南投縣中寮鄉", "南投縣草屯鎮", "南投縣國姓鄉", "南投縣埔里鎮", "南投縣仁愛鄉", "南投縣名間鄉", "南投縣集集鎮", "南投縣水里鄉", "南投縣魚池鄉", "南投縣信義鄉", "南投縣竹山鎮", "南投縣鹿谷鄉", "嘉義市東區", "嘉義市西區", "嘉義縣番路鄉", "嘉義縣梅山鄉", "嘉義縣竹崎鄉", "嘉義縣阿里山", "嘉義縣中埔鄉", "嘉義縣大埔鄉", "嘉義縣水上鄉", "嘉義縣鹿草鄉", "嘉義縣太保市", "嘉義縣朴子市", "嘉義縣東石鄉", "嘉義縣六腳鄉", "嘉義縣新港鄉", "嘉義縣民雄鄉", "嘉義縣大林鎮", "嘉義縣溪口鄉", "嘉義縣義竹鄉", "嘉義縣布袋鎮", "雲林縣斗南鎮", "雲林縣大埤鄉", "雲林縣虎尾鎮", "雲林縣土庫鎮", "雲林縣褒忠鄉", "雲林縣東勢鄉", "雲林縣臺西鄉", "雲林縣崙背鄉", "雲林縣麥寮鄉", "雲林縣斗六市", "雲林縣林內鄉", "雲林縣古坑鄉", "雲林縣莿桐鄉", "雲林縣西螺鎮", "雲林縣二崙鄉", "雲林縣北港鎮", "雲林縣水林鄉", "雲林縣口湖鄉", "雲林縣四湖鄉", "雲林縣元長鄉", "臺南市中西區", "臺南市東區", "臺南市南區", "臺南市北區", "臺南市安平區", "臺南市安南區", "臺南市永康區", "臺南市歸仁區", "臺南市新化區", "臺南市左鎮區", "臺南市玉井區", "臺南市楠西區", "臺南市南化區", "臺南市仁德區", "臺南市關廟區", "臺南市龍崎區", "臺南市官田區", "臺南市麻豆區", "臺南市佳里區", "臺南市西港區", "臺南市七股區", "臺南市將軍區", "臺南市學甲區", "臺南市北門區", "臺南市新營區", "臺南市後壁區", "臺南市白河區", "臺南市東山區", "臺南市六甲區", "臺南市下營區", "臺南市柳營區", "臺南市鹽水區", "臺南市善化區", "臺南市大內區", "臺南市山上區", "臺南市新市區", "臺南市安定區", "高雄市新興區", "高雄市前金區", "高雄市苓雅區", "高雄市鹽埕區", "高雄市鼓山區", "高雄市旗津區", "高雄市前鎮區", "高雄市三民區", "高雄市楠梓區", "高雄市小港區", "高雄市左營區", "高雄市仁武區", "高雄市大社區", "高雄市岡山區", "高雄市路竹區", "高雄市阿蓮區", "高雄市田寮鄉", "高雄市燕巢區", "高雄市橋頭區", "高雄市梓官區", "高雄市彌陀區", "高雄市永安區", "高雄市湖內鄉", "高雄市鳳山區", "高雄市大寮區", "高雄市林園區", "高雄市鳥松區", "高雄市大樹區", "高雄市旗山區", "高雄市美濃區", "高雄市六龜區", "高雄市內門區", "高雄市杉林區", "高雄市甲仙區", "高雄市桃源區", "高雄市那瑪夏區", "高雄市茂林區", "高雄市茄萣區", "屏東縣屏東市", "屏東縣三地門", "屏東縣霧臺鄉", "屏東縣瑪家鄉", "屏東縣九如鄉", "屏東縣里港鄉", "屏東縣高樹鄉", "屏東縣鹽埔鄉", "屏東縣長治鄉", "屏東縣麟洛鄉", "屏東縣竹田鄉", "屏東縣內埔鄉", "屏東縣萬丹鄉", "屏東縣潮州鎮", "屏東縣泰武鄉", "屏東縣來義鄉", "屏東縣萬巒鄉", "屏東縣崁頂鄉", "屏東縣新埤鄉", "屏東縣南州鄉", "屏東縣林邊鄉", "屏東縣東港鎮", "屏東縣琉球鄉", "屏東縣佳冬鄉", "屏東縣新園鄉", "屏東縣枋寮鄉", "屏東縣枋山鄉", "屏東縣春日鄉", "屏東縣獅子鄉", "屏東縣車城鄉", "屏東縣牡丹鄉", "屏東縣恆春鎮", "屏東縣滿州鄉", "臺東縣臺東市", "臺東縣綠島鄉", "臺東縣蘭嶼鄉", "臺東縣延平鄉", "臺東縣卑南鄉", "臺東縣鹿野鄉", "臺東縣關山鎮", "臺東縣海端鄉", "臺東縣池上鄉", "臺東縣東河鄉", "臺東縣成功鎮", "臺東縣長濱鄉", "臺東縣太麻里鄉", "臺東縣金峰鄉", "臺東縣大武鄉", "臺東縣達仁鄉", "花蓮縣花蓮市", "花蓮縣新城鄉", "花蓮縣秀林鄉", "花蓮縣吉安鄉", "花蓮縣壽豐鄉", "花蓮縣鳳林鎮", "花蓮縣光復鄉", "花蓮縣豐濱鄉", "花蓮縣瑞穗鄉", "花蓮縣萬榮鄉", "花蓮縣玉里鎮", "花蓮縣卓溪鄉", "花蓮縣富里鄉", "金門縣金沙鎮", "金門縣金湖鎮", "金門縣金寧鄉", "金門縣金城鎮", "金門縣烈嶼鄉", "金門縣烏坵鄉", "連江縣南竿鄉", "連江縣北竿鄉", "連江縣莒光鄉", "連江縣東引鄉", "澎湖縣馬公市", "澎湖縣西嶼鄉", "澎湖縣望安鄉", "澎湖縣七美鄉", "澎湖縣白沙鄉", "澎湖縣湖西鄉", "南海諸島東沙", "南海諸島南沙"];
var list = ["臺北市中正區忠孝西路一段120號1樓", "臺北市大同區承德路三段83號", "臺北市內湖區內湖路二段225號", "基隆市中正區北寧路2號", "基隆市七堵區百五街93號", "臺中市中區民權路86號", "臺中市霧峰區中正路806號", "臺中市南區國光路297號", "臺中市西屯區黎明路三段130號", "臺中市西區公益路193號", "臺中市西屯區青海路一段83號", "臺中市西區大全街46號", "臺中市北區民權路365號", "臺南市北區成功路8號", "臺南市南區西門路一段681號", "臺南市東區大學路１號", "高雄市新興區中正三路179號", "高雄市左營區左營大路75號", "高雄市大社區自強街9號", "高雄市三民區博愛一路372號1樓", "高雄市苓雅區武廟路83號", "高雄市左營區民族一路853號", "嘉義市東區文化路134號", "嘉義市西區中興路672號", "嘉義市東區彌陀路268號", "嘉義市東區學府路300號", "嘉義縣朴子市祥和二路西段6號", "嘉義縣大林鎮平和街28-1號", "屏東縣恆春鎮恆西路1巷32號", "屏東縣車城鄉福興村中山路54號", "彰化縣彰化市中央路270號", "彰化縣和美鎮彰美路五段331號", "彰化縣彰化市進德路1號", "花蓮縣花蓮市中山路408號", "花蓮縣花蓮市府前路146號", "花蓮縣花蓮市中華路335-5號", "花蓮縣吉安鄉中華路二段83號", "高雄市鳳山區中山東路86-2號", "高雄市鳳山區維武路1號", "高雄市大寮區永芳里鳳林三路530號", "高雄市鳳山區五甲三路45號", "高雄市林園區東林里鳳林路1段176號", "高雄市茄萣區進學路158號", "宜蘭縣礁溪鄉礁溪路4段130號", "宜蘭縣蘇澳鎮中山路1段1號", "宜蘭縣羅東鎮興東路69號", "桃園市龜山區豐美街2-1號", "桃園市大溪區康莊路210號", "臺中市豐原區三民路108號", "臺中市東勢區中山路43號", "臺中市沙鹿區台灣大道七段200號", "臺東縣關山鎮中正路25號", "桃園市觀音區中山路40號", "新北市板橋區文化路1段395號", "新北市板橋區仁化街40-1號", "新北市新店區北新路2段177號", "南投縣埔里鎮南昌街284號", "新北市三重區正義南路10號", "新北市泰山區明志路一段512號", "新北市新莊區五工三路50巷2號", "台北市信義區信義路五段7號", "南投縣埔里鎮中山路一段421號", "屏東縣車城鄉後灣路2號", "台東縣台東市博愛路365號", "嘉義縣太保市故宮大道888號", "高雄市三民區九如一路720號", "台中市西屯區惠來路二段101號", "新北市萬里區野柳里港東路167-1號", "台東縣成功鎮基翬路74號", "澎湖縣馬公市治平路30號", "宜蘭縣頭城鎮青雲路三段750號"];
var new_suggestion = [];
var i = 0;

var output = "";

function Zipfinder(input) {

    var temp = input.split('');
    var index1 = temp[0] + temp[1] + temp[2];
    var index2 = temp[0] + temp[1] + temp[2] + temp[3];
    if (json[index1] !== undefined) {
        if (json[index1][temp[3] + temp[4]] !== undefined) { return json[index1][temp[3] + temp[4]] } else if (json[index1][temp[3] + temp[4] + temp[5]] !== undefined) { return json[index1][temp[3] + temp[4] + temp[5]] } else if (json[index1][temp[3] + temp[4] + temp[5] + temp[6]] !== undefined) { return json[index1][temp[3] + temp[4] + temp[5] + temp[6]] } else { return index1 }
    } else if (json[index2] !== undefined) {
        if (json[index2][temp[4] + temp[5]] !== undefined) { return json[index2][temp[4] + temp[5]] } else if (json[index2][temp[4] + temp[5]] !== undefined) { return json[index2][temp[4] + temp[5]] } else if (json[index2][temp[4] + temp[5] + temp[6]] !== undefined) { return json[index2][temp[4] + temp[5] + temp[6]] } else if (json[index2][temp[4] + temp[5] + temp[6] + temp[7]] !== undefined) { return json[index2][temp[4] + temp[5] + temp[6] + temp[7]] } else { return index2 }
    } else { return "undefined" }

}

function Suggestfinder(input) {
    var return_array = [];
    var temp = input.split('');
    var index1 = temp[0] + temp[1] + temp[2];
    var index2 = temp[0] + temp[1] + temp[2] + temp[3];
    if (json[index1] !== undefined) {
        return_array.push(index1);
        if (json[index1][temp[3] + temp[4]] !== undefined) { return_array.push(index1 + temp[3] + temp[4]); } else if (json[index1][temp[3] + temp[4] + temp[5]] !== undefined) { return_array.push(index1 + temp[3] + temp[4] + temp[5]); } else if (json[index1][temp[3] + temp[4] + temp[5] + temp[6]] !== undefined) { return_array.push(index1 + temp[3] + temp[4] + temp[5] + temp[6]); }
    } else if (json[index2] !== undefined) {
        return_array.push(index2);
        if (json[index2][temp[4] + temp[5]] !== undefined) { return_array.push(index2 + temp[4] + temp[5]); } else if (json[index2][temp[4] + temp[5] + temp[6]] !== undefined) { return_array.push(index2 + temp[4] + temp[5] + temp[6]); } else if (json[index2][temp[4] + temp[5] + temp[6] + temp[7]] !== undefined) { return_array.push(index2 + temp[4] + temp[5] + temp[6] + temp[7]); }
    }
    return return_array;
}


function Suggestfinder2(input) {
    var temp = input.split('');
    var index1 = temp[0] + temp[1] + temp[2];
    var index2 = temp[0] + temp[1] + temp[2] + temp[3];
    if (json[index1] !== undefined) { return index1; } else if (json[index2] !== undefined) { return index2; }
    return "";
}

const SelectContexts = {
    parameter: 'select ',
}


app.intent('預設歡迎語句', (conv) => {

    if (conv.screen) {

        if (conv.user.last.seen) {
            conv.ask(new SimpleResponse({
                speech: `<speak><p><s>歡迎使用郵遞號碼查詢器!</s><s>請點選建議卡片或直接輸入地址來進行操作。</s></p></speak>`,
                text: '歡迎使用!'
            }));
        } else {
            conv.ask(new SimpleResponse({
                speech: `<speak><p><s>歡迎使用郵遞號碼查詢器!</s><s>我能提供台灣郵遞區號的五碼查詢服務，你可以直接輸入地址、依照區域篩選查看該縣市的所有郵遞區號列表。或是取得你現在位置的郵遞區號。</s></p></speak>`,
                text: '歡迎使用!'
            }));
        }

        conv.ask(new BasicCard({
            image: new Image({ url: 'https://raw.githubusercontent.com/hank199599/Google-Assistant-APP/master/%E9%83%B5%E9%81%9E%E5%8D%80%E8%99%9F%E6%9F%A5%E8%A9%A2%E5%99%A8/assets/bslu5n3.jpg ', alt: 'Pictures', }),
            title: '請選擇要使用的服務類別',
            text: '**_㊟已支援查詢五碼查詢_**',
            display: 'CROPPED',
        }));
        conv.ask(new Suggestions('🛰查詢現在位置', '🔎依區域查詢', '進行五碼查詢', '語音查詢範例', '👋 掰掰'));
    } else {
        conv.contexts.set(FiveContexts.parameter, 1);
        conv.noInputs = ["請輸入要查詢的地址來進行操作喔!", "抱歉，請問你要查詢的地址是?", "抱歉，我想我幫不上忙。下次見!"];

        word1 = city_array[parseInt(Math.random() * 370)];
        word2 = list[parseInt(Math.random() * 70)];
        conv.ask(`<speak><p><s>歡迎使用郵遞號碼查詢器!</s><s>請試著詢問，來取得所需郵遞區號。</s><s>例如，你可以問<break time="0.2s"/>幫我找${word1}<break time="0.2s"/>或是<break time="0.2s"/>幫我查${word2}</s></p></speak>`);
        conv.ask(`<speak><p><s>如果想結束我們的對話</s><s>請說<break time="0.2s"/>結束查詢<break time="0.2s"/></s></p></speak>`);
    }
});

app.intent('主選單', (conv) => {

    conv.ask(new SimpleResponse({
        speech: `<speak><p><s>請點選建議卡片，或直接提問來取得縣市列表。</s></p></speak>`,
        text: '請點擊建議卡片或輸入地址來進行操作'
    }));

    conv.ask(new BasicCard({
        title: '請選擇要使用的服務類別',
        text: '**_㊟已支援查詢五碼查詢_**',
    }));
    conv.ask(new Suggestions('🛰查詢現在位置', '🔎依區域查詢', '進行五碼查詢', '👋 掰掰'));
});


app.intent('依區域查詢', (conv) => {
    if (conv.screen) {
        conv.ask('請輕觸下方卡片來選擇查詢區域：');
        // Create a carousel
        conv.ask(new Carousel({
            title: 'Carousel Title',
            items: {
                // Add the first item to the carousel
                'Northen': {
                    title: '北部地區',
                    description: '北北基、桃園市\n新竹縣市',
                    image: new Image({ url: 'https://raw.githubusercontent.com/hank199599/Google-Assistant-APP/master/%E9%83%B5%E9%81%9E%E5%8D%80%E8%99%9F%E6%9F%A5%E8%A9%A2%E5%99%A8/assets/i4Zyo74.png', alt: 'Image alternate text', }),
                },
                // Add the second item to the carousel
                'Central': {
                    title: '中部地區',
                    description: '苗栗縣、臺中市\n雲林、彰化、南投',
                    image: new Image({  url: 'https://raw.githubusercontent.com/hank199599/Google-Assistant-APP/master/%E9%83%B5%E9%81%9E%E5%8D%80%E8%99%9F%E6%9F%A5%E8%A9%A2%E5%99%A8/assets/K35L2hu.png', alt: 'Image alternate text', }),
                },
                'Southen': {
                    title: '南部地區',
                    description: '嘉義縣市、臺南市\n高雄市、屏東縣',
                    image: new Image({  url: 'https://raw.githubusercontent.com/hank199599/Google-Assistant-APP/master/%E9%83%B5%E9%81%9E%E5%8D%80%E8%99%9F%E6%9F%A5%E8%A9%A2%E5%99%A8/assets/aWsI2QO.png', alt: 'Image alternate text', }),
                },
                'East': {
                    title: '東部地區',
                    description: '宜蘭、花蓮、台東\n ',
                    image: new Image({  url: 'https://raw.githubusercontent.com/hank199599/Google-Assistant-APP/master/%E9%83%B5%E9%81%9E%E5%8D%80%E8%99%9F%E6%9F%A5%E8%A9%A2%E5%99%A8/assets/mKuur7U.png', alt: 'Image alternate text', }),
                },
                'Outlying_island': {
                    title: '離島地區',
                    description: '澎湖縣、金門縣、\n連江縣',
                    image: new Image({  url: 'https://raw.githubusercontent.com/hank199599/Google-Assistant-APP/master/%E9%83%B5%E9%81%9E%E5%8D%80%E8%99%9F%E6%9F%A5%E8%A9%A2%E5%99%A8/assets/4SPjAi5.png', alt: 'Image alternate text', }),
                },
                '南海諸島': {
                    title: '南海諸島',
                    description: '東沙、南沙\n ',
                    image: new Image({  url: 'https://raw.githubusercontent.com/hank199599/Google-Assistant-APP/master/%E9%83%B5%E9%81%9E%E5%8D%80%E8%99%9F%E6%9F%A5%E8%A9%A2%E5%99%A8/assets/9OTgprJ.png', alt: 'Image alternate text', }),
                },
            },
        }));
        conv.ask(new Suggestions('回到選單'));
    } else {
        conv.contexts.set(FiveContexts.parameter, 1);
        conv.noInputs = ["請輸入要查詢的地址來進行操作喔!", "抱歉，請問你要查詢的地址是?", "抱歉，我想我幫不上忙。下次見!"];

        word1 = city_array[parseInt(Math.random() * 370)];
        word2 = list[parseInt(Math.random() * 70)];
        conv.ask(`<speak><p><s>抱歉，在喇叭上不支援這個操作!</s><s>請試著詢問，來取得所需郵遞區號。</s><s>例如，你可以問<break time="0.2s"/>幫我找${word1}<break time="0.2s"/>或是<break time="0.2s"/>幫我查${word2}</s></p></speak>`);
        conv.ask(`<speak><p><s>如果想結束我們的對話</s><s>請說<break time="0.2s"/>結束查詢<break time="0.2s"/></s></p></speak>`);
    }

});

var local = ["Northen", "Central", "Southen", "East", "Outlying_island"];

app.intent('縣市查詢結果', (conv, input, option) => {

    if (local.indexOf(option) !== -1) {
        conv.ask('請選擇要查詢的縣市。');
        conv.contexts.set(SelectContexts.parameter, 1);

        conv.ask(new Carousel({ items: county_option[option] }));

    } else if (county_array.indexOf(option) !== -1) {
        conv.ask(new SimpleResponse({ speech: `<speak><p><s>以下是${option}的郵遞區號列表，請查看。</s></p></speak>`, text: '以下是「' + option + '」的郵遞區號列表。' }));

        conv.ask(new Table({
            title: option,
            subtitle: "郵遞區號列表",
            columns: [{ header: '行政區', align: 'CENTER', }, { header: '郵遞區號', align: 'CENTER', }, { header: '行政區', align: 'CENTER', }, { header: '郵遞區號', align: 'CENTER', }],
            rows: county_zip[option],
        }));

        conv.ask(new Suggestions('查詢其他縣市'));

    } else {
        conv.contexts.set(SelectContexts.parameter, 1);
        conv.ask(new SimpleResponse({
            speech: `<speak><p><s>抱歉，區域查詢過程中發生錯誤。請重新查詢。</s></p></speak>`,
            text: '查詢過程發生錯誤，\n請重新選擇。'
        }));

        conv.ask(new Carousel({
            title: 'Carousel Title',
            items: {
                'Northen': {
                    title: '北部地區',
                    description: '北北基、桃園市\n新竹縣市',
                    image: new Image({ url: 'https://raw.githubusercontent.com/hank199599/Google-Assistant-APP/master/%E9%83%B5%E9%81%9E%E5%8D%80%E8%99%9F%E6%9F%A5%E8%A9%A2%E5%99%A8/assets/i4Zyo74.png', alt: 'Image alternate text', }),
                },
                'Central': {
                    title: '中部地區',
                    description: '苗栗縣、臺中市\n雲林、彰化、南投',
                    image: new Image({  url: 'https://raw.githubusercontent.com/hank199599/Google-Assistant-APP/master/%E9%83%B5%E9%81%9E%E5%8D%80%E8%99%9F%E6%9F%A5%E8%A9%A2%E5%99%A8/assets/K35L2hu.png', alt: 'Image alternate text', }),
                },
                'Southen': {
                    title: '南部地區',
                    description: '嘉義縣市、臺南市、高雄市、屏東縣',
                    image: new Image({  url: 'https://raw.githubusercontent.com/hank199599/Google-Assistant-APP/master/%E9%83%B5%E9%81%9E%E5%8D%80%E8%99%9F%E6%9F%A5%E8%A9%A2%E5%99%A8/assets/aWsI2QO.png', alt: 'Image alternate text', }),
                },
                'East': {
                    title: '東部地區',
                    description: '宜蘭、花蓮、台東\n',
                    image: new Image({  url: 'https://raw.githubusercontent.com/hank199599/Google-Assistant-APP/master/%E9%83%B5%E9%81%9E%E5%8D%80%E8%99%9F%E6%9F%A5%E8%A9%A2%E5%99%A8/assets/mKuur7U.png', alt: 'Image alternate text', }),
                },
                'Outlying_island': {
                    title: '離島地區',
                    description: '澎湖縣、金門縣、\n連江縣',
                    image: new Image({  url: 'https://raw.githubusercontent.com/hank199599/Google-Assistant-APP/master/%E9%83%B5%E9%81%9E%E5%8D%80%E8%99%9F%E6%9F%A5%E8%A9%A2%E5%99%A8/assets/4SPjAi5.png', alt: 'Image alternate text', }),
                },
            },
        }));

        conv.ask(new Suggestions('🛰查詢現在位置', '進行五碼查詢'));

    }
    conv.ask(new Suggestions('回到選單'));

});

var word1 = "";
var word2 = "";
var word3 = "";

app.intent('直接查看列表', (conv, { city }) => {

    if (conv.input.raw.indexOf('新北') !== -1) { city = "新北市"; }
    if (conv.screen) {

        if (county_array.indexOf(city) !== -1) {
            if (["嘉義", "新竹"].indexOf(city) !== -1) {
                conv.contexts.set(SelectContexts.parameter, 1);
                conv.ask(new SimpleResponse({ speech: `<speak><p><s>${city}的郵遞區號列表分為下列兩個，請點擊卡片來選擇。</s></p></speak>`, text: '「' + city + '」的郵遞區號列表分兩個項目，請點擊下方卡片來選擇。' }));

                conv.ask(new Carousel({
                    items: county_option[city],
                }));

            } else {
                conv.ask(new SimpleResponse({ speech: `<speak><p><s>以下是${city}的郵遞區號列表，請查看。</s></p></speak>`, text: '以下是「' + city + '」的郵遞區號列表。' }));
                conv.ask(new Table({
                    title: city,
                    subtitle: "郵遞區號列表",
                    columns: [{ header: '行政區', align: 'CENTER', }, { header: '郵遞區號', align: 'CENTER', }, { header: '行政區', align: 'CENTER', }, { header: '郵遞區號', align: 'CENTER', }],
                    rows: county_zip[city],
                }));
            }

        } else {
            word1 = county_array[parseInt(Math.random() * 50)];
            word2 = county_array[parseInt(Math.random() * 50)];
            if (conv.input.raw === "語音查詢範例") {
                conv.ask(new SimpleResponse({
                    speech: `<speak><p><s>以下是查詢範例</s><s>你可以試著問我<break time="0.2s"/>${word1}的郵遞區號?<break time="0.2s"/>或<break time="0.2s"/>幫我查詢${word2}</s></p></speak>`,
                    text: '試著提問來快速存取縣市列表，\n或點選建議卡片來進行操作!'
                }));
            } else {
                conv.ask(new SimpleResponse({
                    speech: `<speak><p><s>抱歉，我不懂你的意思</s><s>請試著問我<break time="0.2s"/>${word1}的郵遞區號?<break time="0.2s"/>或<break time="0.2s"/>幫我查詢${word2}</s></p></speak>`,
                    text: '試著提問來快速存取縣市列表，\n或點選建議卡片來進行操作!'
                }));
            }

            conv.ask(new BasicCard({
                title: "語音查詢範例",
                subtitle: "以下是你可以嘗試的指令",
                text: " • *「" + word1 + "的郵遞區號?」*  \n • *「幫我查詢" + word2 + "」*  \n • *「我想看" + county_array[parseInt(Math.random() * 50)] + "的郵遞區號」*  \n • *「幫我找" + county_array[parseInt(Math.random() * 50)] + "」*  \n • *「我想看" + county_array[parseInt(Math.random() * 50)] + "」*  \n • *「" + county_array[parseInt(Math.random() * 50)] + "的列表?」*  \n • *「我要查" + county_array[parseInt(Math.random() * 50)] + "」*",
            }));
            conv.ask(new Suggestions(word1 + '的郵遞區號?', '幫我查詢' + word2));

        }
        conv.ask(new Suggestions('🔎依區域查詢', '進行五碼查詢', '🛰查詢現在位置', '👋 掰掰'));
    } else {
        conv.contexts.set(FiveContexts.parameter, 1);
        conv.noInputs = ["請輸入要查詢的地址來進行操作喔!", "抱歉，請問你要查詢的地址是?", "抱歉，我想我幫不上忙。下次見!"];

        word1 = city_array[parseInt(Math.random() * 370)];
        word2 = list[parseInt(Math.random() * 70)];
        conv.ask(`<speak><p><s>抱歉，在喇叭上不支援這個操作!</s><s>請試著詢問，來取得所需郵遞區號。</s><s>例如，你可以問<break time="0.2s"/>幫我找${word1}<break time="0.2s"/>或是<break time="0.2s"/>幫我查${word2}</s></p></speak>`);
        conv.ask(`<speak><p><s>如果想結束我們的對話</s><s>請說<break time="0.2s"/>結束查詢<break time="0.2s"/></s></p></speak>`);
    }

});


app.intent('取得地點權限', (conv, { input }) => {
    conv.data.requestedPermission = 'DEVICE_PRECISE_LOCATION';
    if (conv.screen) {

        return conv.ask(new Permission({
            context: "在繼續操作前，建議你開啟裝置上的GPS功能來取得精確結果。接著，為了找到現在位置的郵遞區號",
            permissions: conv.data.requestedPermission,
        }));
    } else {
        return conv.ask(new Permission({
            context: "為了找到現在位置的郵遞區號",
            permissions: conv.data.requestedPermission,
        }));
    }
    conv.ask(new Permission(options));
});

var city = "";
app.intent('回傳資訊', (conv, params, permissionGranted) => {
    if (permissionGranted) {
        const {
            requestedPermission
        } = conv.data;


        if (requestedPermission === 'DEVICE_PRECISE_LOCATION') {

            conv.ask(new Suggestions('🛰重新定位'));

            name = conv.device.location.formattedAddress;
            if (name !== undefined) {
                var temp = name.split(',');
                var number = temp.length - 1;
                name = temp[number] + temp[number - 1];
                name = replaceString(name, ' ', '');
                name = name.replace(/[\w|]/g, "");
                name = replaceString(name, '台', '臺');

                Zipcode = Zipfinder(name);
            } else { Zipcode = "undefined"; }

            if (Zipcode !== "undefined") {
                conv.ask(new SimpleResponse({ speech: `<speak><p><s>查詢完成，你現在在${name}。郵遞區號是<say-as interpret-as="characters">${Zipcode}</say-as></s></p></speak>`, text: '查詢完成，這是你所在地的郵遞區號。' }));
                conv.ask(new BasicCard({
                    title: String(Zipcode),
                    subtitle: name,
                    text: '_㊟這是您概略位置的三碼郵遞區號_',
                }));
            } else {
                conv.ask(new SimpleResponse({ speech: `<speak><p><s>查詢發生錯誤，無法獲取郵遞區號</s><s>你可以試著開啟裝置上的居批S功能，然後再試一次。</s></p></speak>`, text: '查詢發生錯誤' }));
                conv.ask(new BasicCard({
                    title: '請開啟您裝置上的GPS功能，  \n然後再試一次!',
                    text: '_㊟點擊下方的「**重新定位**」來進行操作。_',
                }));
            }
        }
    } else {
        conv.ask('授權失敗，無法進行操作。');
    }
    if (conv.screen) { conv.ask(new Suggestions('回到選單')); } else {
        conv.contexts.set(FiveContexts.parameter, 1);
        conv.noInputs = ["請輸入要查詢的地址來進行操作喔!", "抱歉，請問你要查詢的地址是?", "抱歉，我想我幫不上忙。下次見!"];

        word1 = city_array[parseInt(Math.random() * 370)];
        word2 = list[parseInt(Math.random() * 70)];
        conv.ask(`<speak><p><s>接著!</s><s>請試著詢問，來取得所需郵遞區號。</s><s>例如，你可以問<break time="0.2s"/>幫我找${word1}<break time="0.2s"/>或是<break time="0.2s"/>幫我查${word2}</s></p></speak>`);
        conv.ask(`<speak><p><s>如果想結束我們的對話</s><s>請說<break time="0.2s"/>結束查詢<break time="0.2s"/></s></p></speak>`);
    }

});


app.intent('開始進行查詢', (conv) => {

    output = list[parseInt(Math.random() * 70)];

    conv.contexts.set(FiveContexts.parameter, 1);

    conv.ask(new SimpleResponse({
        speech: `<speak><p><s>OK，現在你可以進行五碼郵遞區號查詢了。</s><s>舉例來說，你可以輸入${output}，來查詢它的郵遞區號。</s><s>請點擊建議卡片試試看!</s></p></speak>`,
        text: '你可以進行查詢了!\n請輸入要查詢的地址。'
    }));

    conv.ask(new BasicCard({
        title: '五碼查詢模式已開啟!',
        subtitle: '《輸入格式》  \n• 縣市名+鄉鎮名  \n• 縣市名+鄉鎮名+道路等資訊',
        text: '㊟這是由「*3+2郵遞區號 查詢*」所提供的查詢服務',
        buttons: new Button({ title: '3+2郵遞區號 查詢', url: 'https://zip5.5432.tw/', display: 'CROPPED', }),
    }));

    conv.ask(new Suggestions(output, city_array[parseInt(Math.random() * 370)], list[parseInt(Math.random() * 70)], list[parseInt(Math.random() * 70)], '關閉此模式'));
});

const FiveContexts = {
    parameter: 'five_code',
}


app.intent('直接輸入地址或區域', (conv, { input }) => {

    conv.noInputs = ["請輸入要查詢的地址來進行操作喔!", "抱歉，請問你要查詢的地址是?", "抱歉，我想我幫不上忙。下次見!"];

    if (input === "關閉此模式") {
        conv.ask(new SimpleResponse({ speech: `<speak><p><s>好的，您的請求已完成。請點擊建議卡片來選擇查詢方式。</s></p></speak>`, text: '五碼查詢模式已關閉' }));
        conv.ask(new BasicCard({
            image: new Image({ url: 'https://raw.githubusercontent.com/hank199599/Google-Assistant-APP/master/%E9%83%B5%E9%81%9E%E5%8D%80%E8%99%9F%E6%9F%A5%E8%A9%A2%E5%99%A8/assets/bslu5n3.jpg ', alt: 'Pictures', }),
            title: '請選擇要使用的服務類別',
            display: 'CROPPED',
            text: '**_㊟已支援查詢五碼查詢_**',
        }));
        conv.ask(new Suggestions('🛰查詢現在位置', '🔎依區域查詢', '進行五碼查詢', '語音查詢範例', '👋 掰掰'));
    } else if ((conv.input.raw.indexOf('結束') !== -1 || conv.input.raw.indexOf('關閉') !== -1) && conv.screen !== true) {
        conv.ask('希望能幫到一點忙!');
        conv.close('下次見!');
    } else {

        input = replaceString(input, '寶中鄉', '褒忠鄉');
        input = replaceString(input, '鬥六市', '斗六市');


        return new Promise(function(resolve, reject) {
            if (input.length > 6) {
                getJSON('http://zip5.5432.tw/zip5json.py?adrs=' + encodeURIComponent(input))
                    .then(function(response) {
                        var data = response.zipcode;
                        resolve(data)
                    }).catch(function(error) {
                        reject(error)
                    });
            } else {
                var data = "";
                resolve(data)
            }
        }).then(function(origin_data) {
            Zipcode = origin_data;
            conv.contexts.set(FiveContexts.parameter, 1);

            if (Zipcode.length !== 0) {
                new_suggestion = Suggestfinder(input);
                var output = replaceString(input, '-', '之');
                conv.ask(new SimpleResponse({ speech: `<speak><p><s>查詢完成，你輸入的${output}。郵遞區號是<break time="0.2s"/><say-as interpret-as="characters">${Zipcode}</say-as></s></p></speak>`, text: '查詢完成' }));
                conv.ask(new BasicCard({
                    title: Zipcode,
                    subtitle: input,
                    text: '**㊟**您正使用「**五碼查詢模式**」',
                    buttons: new Button({ title: '在地圖上檢視該地點', url: 'https://www.google.com.tw/maps/place/' + input + '/15z/data=!4m5!3m4!', }),
                }));
                for (i = 0; i < new_suggestion.length; i++) {
                    conv.ask(new Suggestions(new_suggestion[i]));
                }
                conv.ask(new Suggestions('關閉此模式'));
            } else {
                input = replaceString(input, '台', '臺');
                input = replaceString(input, '台北縣', '新北市');
                input = replaceString(input, '高雄縣', '高雄市');
                input = replaceString(input, '桃園縣', '桃園市');
                Zipcode = Zipfinder(input);
                var number = parseInt(Zipcode);

                if (isNaN(number) === false) {
                    conv.ask(new SimpleResponse({ speech: `<speak><p><s>查詢完成，你輸入的${input}。郵遞區號是<break time="0.2s"/><say-as interpret-as="characters">${Zipcode}</say-as></s></p></speak>`, text: '查詢完成' }));
                    conv.ask(new BasicCard({
                        title: Zipcode,
                        subtitle: input,
                        text: '由於您所給予的**資訊不足**，無法查詢完整的五碼格式',
                        buttons: new Button({ title: '在地圖上檢視該地點', url: 'https://www.google.com.tw/maps/place/' + input + '/15z/data=!4m5!3m4!', }),
                    }));
                    conv.ask(new Suggestions(Suggestfinder2(input)));
                } else if (county_array.indexOf(Zipcode) !== -1) {
                    if (conv.screen === true) {
                        conv.ask(new SimpleResponse({ speech: `<speak><p><s>您提供的資訊不足或有誤。不過，我找到${Zipcode}的郵遞區號列表。請查看!</s></p></speak>`, text: '您提供的資訊不足或有誤。\n以下是「' + Zipcode + '」的郵遞區號列表。' }));
                    } else {
                        conv.ask(`<speak><p><s>糟糕，查詢發生錯誤!</s><s>請提供更詳細的地址資訊方能為你查詢喔。</s></p></speak>`);
                    }

                    conv.ask(new Table({
                        title: Zipcode,
                        subtitle: "郵遞區號列表",
                        columns: [{ header: '行政區', align: 'CENTER', }, { header: '郵遞區號', align: 'CENTER', }, { header: '行政區', align: 'CENTER', }, { header: '郵遞區號', align: 'CENTER', }],
                        rows: county_zip[Zipcode],
                    }));

                } else {
                    conv.ask(new SimpleResponse({ speech: `<speak><p><s>發生錯誤，請確認輸入是否有誤，然後再試一次!</s></p></speak>`, text: '您提供的資訊似乎有誤，\n請再試一次。' }));
                    if (conv.screen !== true) { conv.ask(`<speak><p><s>如果你的查詢已經完成了，請說<break time="0.2s"/>結束對話<break time="0.2s"/>來關閉我</s></p></speak>`); }
                    conv.ask(new BasicCard({
                        title: '查詢發生錯誤!',
                        text: ' _㊟請確認輸入是否有誤!_',
                    }));

                }
                conv.ask(new Suggestions('關閉此模式'));
            }

        }).catch(function(error) {
            console.log(error);
            input = replaceString(input, '台', '臺');
            input = replaceString(input, '台北縣', '新北市');
            input = replaceString(input, '台南縣', '臺南市');
            input = replaceString(input, '高雄縣', '高雄市');
            input = replaceString(input, '桃園縣', '桃園市');
            Zipcode = Zipfinder(input);

            new_suggestion = Suggestfinder(input);
            var number = parseInt(Zipcode);

            if (isNaN(number) === false) {
                conv.ask(new SimpleResponse({ speech: `<speak><p><s>您給予的道路資訊有誤，無法獲取完整的郵遞區號。對應的三碼郵遞區號是<say-as interpret-as="characters">${Zipcode}</say-as></s></p></speak>`, text: '查詢發生部分錯誤，\n僅能獲取三碼的郵遞區號。' }));
                conv.ask(new BasicCard({
                    title: Zipcode,
                    subtitle: input,
                    text: '您給予的道路資訊**有誤**，無法查詢完整的五碼格式',
                    buttons: new Button({ title: '在地圖上檢視該地點', url: 'https://www.google.com.tw/maps/place/' + input + '/15z/data=!4m5!3m4!', }),
                }));
                for (i = 0; i < new_suggestion.length; i++) {
                    conv.ask(new Suggestions(new_suggestion[i]));
                }

            } else {
                conv.ask(new SimpleResponse({ speech: `<speak><p><s>發生錯誤，請提供詳細的地址資訊，然後再試一次!</s></p></speak>`, text: '您提供的資訊似乎不足...' }));

                conv.ask(new BasicCard({
                    title: '查詢發生錯誤!',
                    text: ' _㊟請確認輸入是否有誤!_',
                }));
            }

            conv.ask(new Suggestions('關閉此模式'));
        });
    }
});
app.intent('預設罐頭回覆', (conv) => {
    conv.ask(new SimpleResponse({ speech: '抱歉，我不懂你的意思。\請試著換個方式問問看。', text: '請試著換個方式問問看，\n或點擊建議卡片來進行操作。', }));
    conv.ask(new BasicCard({
        title: '請選擇要使用的服務類別',
        text: '**_㊟已支援查詢五碼查詢_**',
    }));
    conv.ask(new Suggestions('🛰查詢現在位置', '🔎依區域查詢', '進行五碼查詢', '👋 掰掰'));

});

app.intent('結束對話', (conv) => {
    conv.user.storage = {}; //離開同時清除暫存資料
    conv.ask('希望能幫到一點忙!');
    conv.ask(new SimpleResponse({ speech: '下次見', text: '下次見 👋', }));
    conv.close(new BasicCard({
        title: '感謝您的使用!',
        text: '如果有任何需要改進的地方，  \n歡迎到簡介頁面評分或給予反饋，謝謝!',
        buttons: new Button({ title: '開啟本程式的商店頁面', url: 'https://assistant.google.com/services/a/uid/000000ccf8e1037c', }),
    }));

});
exports.zipcode_finder = functions.https.onRequest(app);