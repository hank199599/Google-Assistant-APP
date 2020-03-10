'use strict';

// Import the Dialogflow module from the Actions on Google client library.
const {
  dialogflow,
  Permission,
  Suggestions,
  SimpleResponse,
  Button,
  Image,Carousel,
  BasicCard,
  LinkOutSuggestion,
  BrowseCarousel,BrowseCarouselItem,items,Table
} = require('actions-on-google');

const functions = require('firebase-functions');
var getJSON = require('get-json');
const replaceString = require('replace-string');

const app = dialogflow({debug: true});
var checker = require('./zipcode');
var json = require('./address.json');
var output="";
var Zipcode=0;//郵政區號
var name="";//鄉鎮名稱
var city="";var county="";var road="";var number=0;
var input="";
var county_array=["南投縣","連江縣","馬祖","南投","雲林縣","雲林","金門縣","金門","苗栗縣","苗栗","高雄市","高雄","嘉義市","花蓮縣","花蓮","嘉義縣","台東縣","臺東縣","台東","臺東","嘉義","基隆市","台北市","台南市","臺南市","台南","臺南","臺北市","台北","臺北","基隆","宜蘭縣","台中市","臺中市","台中","澎湖縣","澎湖","桃園市","桃園","新竹縣","新竹市","新竹","新北市","新北","宜蘭","屏東縣","屏東","彰化縣","彰化","南海島","釣魚臺","南海諸島"];
var city_array=["基隆市仁愛區","基隆市信義區","基隆市中正區","基隆市中山區","基隆市安樂區","基隆市暖暖區","基隆市七堵區","臺北市中正區","臺北市大同區","臺北市中山區","臺北市松山區","臺北市大安區","臺北市萬華區","臺北市信義區","臺北市士林區","臺北市北投區","臺北市內湖區","臺北市南港區","臺北市文山區","新北市萬里區","新北市金山區","新北市板橋區","新北市汐止區","新北市深坑區","新北市石碇區","新北市瑞芳區","新北市平溪區","新北市雙溪區","新北市貢寮區","新北市新店區","新北市坪林區","新北市烏來區","新北市永和區","新北市中和區","新北市土城區","新北市三峽區","新北市樹林區","新北市鶯歌區","新北市三重區","新北市新莊區","新北市泰山區","新北市林口區","新北市蘆洲區","新北市五股區","新北市八里區","新北市淡水區","新北市三芝區","新北市石門區","宜蘭縣宜蘭市","宜蘭縣頭城鎮","宜蘭縣礁溪鄉","宜蘭縣壯圍鄉","宜蘭縣員山鄉","宜蘭縣羅東鎮","宜蘭縣三星鄉","宜蘭縣大同鄉","宜蘭縣五結鄉","宜蘭縣冬山鄉","宜蘭縣蘇澳鎮","宜蘭縣南澳鄉","宜蘭縣釣魚臺列嶼","新竹市東區","新竹市北區","新竹市香山區","新竹縣竹北市","新竹縣湖口鄉","新竹縣新豐鄉","新竹縣新埔鎮","新竹縣關西鎮","新竹縣芎林鄉","新竹縣寶山鄉","新竹縣竹東鎮","新竹縣五峰鄉","新竹縣橫山鄉","新竹縣尖石鄉","新竹縣北埔鄉","新竹縣峨嵋鄉","桃園市中壢區","桃園市平鎮區","桃園市龍潭區","桃園市楊梅區","桃園市新屋區","桃園市觀音區","桃園市桃園區","桃園市龜山區","桃園市八德區","桃園市大溪區","桃園市復興區","桃園市大園區","桃園市蘆竹區","苗栗縣竹南鎮","苗栗縣頭份市","苗栗縣三灣鄉","苗栗縣南庄鄉","苗栗縣獅潭鄉","苗栗縣後龍鎮","苗栗縣通霄鎮","苗栗縣苑裡鎮","苗栗縣苗栗市","苗栗縣造橋鄉","苗栗縣頭屋鄉","苗栗縣公館鄉","苗栗縣大湖鄉","苗栗縣泰安鄉","苗栗縣銅鑼鄉","苗栗縣三義鄉","苗栗縣西湖鄉","苗栗縣卓蘭鎮","臺中市中區","臺中市東區","臺中市南區","臺中市西區","臺中市北區","臺中市北屯區","臺中市西屯區","臺中市南屯區","臺中市太平區","臺中市大里區","臺中市霧峰區","臺中市烏日區","臺中市豐原區","臺中市后里區","臺中市石岡區","臺中市東勢區","臺中市和平區","臺中市新社區","臺中市潭子區","臺中市大雅區","臺中市神岡區","臺中市大肚區","臺中市沙鹿區","臺中市龍井區","臺中市梧棲區","臺中市清水區","臺中市大甲區","臺中市外埔區","臺中市大安區","彰化縣彰化市","彰化縣芬園鄉","彰化縣花壇鄉","彰化縣秀水鄉","彰化縣鹿港鎮","彰化縣福興鄉","彰化縣線西鄉","彰化縣和美鎮","彰化縣伸港鄉","彰化縣員林市","彰化縣社頭鄉","彰化縣永靖鄉","彰化縣埔心鄉","彰化縣溪湖鎮","彰化縣大村鄉","彰化縣埔鹽鄉","彰化縣田中鎮","彰化縣北斗鎮","彰化縣田尾鄉","彰化縣埤頭鄉","彰化縣溪州鄉","彰化縣竹塘鄉","彰化縣二林鎮","彰化縣大城鄉","彰化縣芳苑鄉","彰化縣二水鄉","南投縣南投市","南投縣中寮鄉","南投縣草屯鎮","南投縣國姓鄉","南投縣埔里鎮","南投縣仁愛鄉","南投縣名間鄉","南投縣集集鎮","南投縣水里鄉","南投縣魚池鄉","南投縣信義鄉","南投縣竹山鎮","南投縣鹿谷鄉","嘉義市東區","嘉義市西區","嘉義縣番路鄉","嘉義縣梅山鄉","嘉義縣竹崎鄉","嘉義縣阿里山","嘉義縣中埔鄉","嘉義縣大埔鄉","嘉義縣水上鄉","嘉義縣鹿草鄉","嘉義縣太保市","嘉義縣朴子市","嘉義縣東石鄉","嘉義縣六腳鄉","嘉義縣新港鄉","嘉義縣民雄鄉","嘉義縣大林鎮","嘉義縣溪口鄉","嘉義縣義竹鄉","嘉義縣布袋鎮","雲林縣斗南鎮","雲林縣大埤鄉","雲林縣虎尾鎮","雲林縣土庫鎮","雲林縣褒忠鄉","雲林縣東勢鄉","雲林縣臺西鄉","雲林縣崙背鄉","雲林縣麥寮鄉","雲林縣斗六市","雲林縣林內鄉","雲林縣古坑鄉","雲林縣莿桐鄉","雲林縣西螺鎮","雲林縣二崙鄉","雲林縣北港鎮","雲林縣水林鄉","雲林縣口湖鄉","雲林縣四湖鄉","雲林縣元長鄉","臺南市中西區","臺南市東區","臺南市南區","臺南市北區","臺南市安平區","臺南市安南區","臺南市永康區","臺南市歸仁區","臺南市新化區","臺南市左鎮區","臺南市玉井區","臺南市楠西區","臺南市南化區","臺南市仁德區","臺南市關廟區","臺南市龍崎區","臺南市官田區","臺南市麻豆區","臺南市佳里區","臺南市西港區","臺南市七股區","臺南市將軍區","臺南市學甲區","臺南市北門區","臺南市新營區","臺南市後壁區","臺南市白河區","臺南市東山區","臺南市六甲區","臺南市下營區","臺南市柳營區","臺南市鹽水區","臺南市善化區","臺南市大內區","臺南市山上區","臺南市新市區","臺南市安定區","高雄市新興區","高雄市前金區","高雄市苓雅區","高雄市鹽埕區","高雄市鼓山區","高雄市旗津區","高雄市前鎮區","高雄市三民區","高雄市楠梓區","高雄市小港區","高雄市左營區","高雄市仁武區","高雄市大社區","高雄市岡山區","高雄市路竹區","高雄市阿蓮區","高雄市田寮鄉","高雄市燕巢區","高雄市橋頭區","高雄市梓官區","高雄市彌陀區","高雄市永安區","高雄市湖內鄉","高雄市鳳山區","高雄市大寮區","高雄市林園區","高雄市鳥松區","高雄市大樹區","高雄市旗山區","高雄市美濃區","高雄市六龜區","高雄市內門區","高雄市杉林區","高雄市甲仙區","高雄市桃源區","高雄市那瑪夏區","高雄市茂林區","高雄市茄萣區","屏東縣屏東市","屏東縣三地門","屏東縣霧臺鄉","屏東縣瑪家鄉","屏東縣九如鄉","屏東縣里港鄉","屏東縣高樹鄉","屏東縣鹽埔鄉","屏東縣長治鄉","屏東縣麟洛鄉","屏東縣竹田鄉","屏東縣內埔鄉","屏東縣萬丹鄉","屏東縣潮州鎮","屏東縣泰武鄉","屏東縣來義鄉","屏東縣萬巒鄉","屏東縣崁頂鄉","屏東縣新埤鄉","屏東縣南州鄉","屏東縣林邊鄉","屏東縣東港鎮","屏東縣琉球鄉","屏東縣佳冬鄉","屏東縣新園鄉","屏東縣枋寮鄉","屏東縣枋山鄉","屏東縣春日鄉","屏東縣獅子鄉","屏東縣車城鄉","屏東縣牡丹鄉","屏東縣恆春鎮","屏東縣滿州鄉","臺東縣臺東市","臺東縣綠島鄉","臺東縣蘭嶼鄉","臺東縣延平鄉","臺東縣卑南鄉","臺東縣鹿野鄉","臺東縣關山鎮","臺東縣海端鄉","臺東縣池上鄉","臺東縣東河鄉","臺東縣成功鎮","臺東縣長濱鄉","臺東縣太麻里鄉","臺東縣金峰鄉","臺東縣大武鄉","臺東縣達仁鄉","花蓮縣花蓮市","花蓮縣新城鄉","花蓮縣秀林鄉","花蓮縣吉安鄉","花蓮縣壽豐鄉","花蓮縣鳳林鎮","花蓮縣光復鄉","花蓮縣豐濱鄉","花蓮縣瑞穗鄉","花蓮縣萬榮鄉","花蓮縣玉里鎮","花蓮縣卓溪鄉","花蓮縣富里鄉","金門縣金沙鎮","金門縣金湖鎮","金門縣金寧鄉","金門縣金城鎮","金門縣烈嶼鄉","金門縣烏坵鄉","連江縣南竿鄉","連江縣北竿鄉","連江縣莒光鄉","連江縣東引鄉","澎湖縣馬公市","澎湖縣西嶼鄉","澎湖縣望安鄉","澎湖縣七美鄉","澎湖縣白沙鄉","澎湖縣湖西鄉","南海諸島東沙","南海諸島南沙"];
var list=["臺北市中正區忠孝西路一段120號1樓","臺北市大同區承德路三段83號","臺北市內湖區內湖路二段225號","基隆市中正區北寧路2號","基隆市七堵區百五街93號","臺中市中區民權路86號","臺中市霧峰區中正路806號","臺中市南區國光路297號","臺中市西屯區黎明路三段130號","臺中市西區公益路193號","臺中市西屯區青海路一段83號","臺中市西區大全街46號","臺中市北區民權路365號","臺南市北區成功路8號","臺南市南區西門路一段681號","臺南市東區大學路１號","高雄市新興區中正三路179號","高雄市左營區左營大路75號","高雄市大社區自強街9號","高雄市三民區博愛一路372號1樓","高雄市苓雅區武廟路83號","高雄市左營區民族一路853號","嘉義市東區文化路134號","嘉義市西區中興路672號","嘉義市東區彌陀路268號","嘉義市東區學府路300號","嘉義縣朴子市祥和二路西段6號","嘉義縣大林鎮平和街28-1號","屏東縣恆春鎮恆西路1巷32號","屏東縣車城鄉福興村中山路54號","彰化縣彰化市中央路270號","彰化縣和美鎮彰美路五段331號","彰化縣彰化市進德路1號","花蓮縣花蓮市中山路408號","花蓮縣花蓮市府前路146號","花蓮縣花蓮市中華路335-5號","花蓮縣吉安鄉中華路二段83號","高雄市鳳山區中山東路86-2號","高雄市鳳山區維武路1號","高雄市大寮區永芳里鳳林三路530號","高雄市鳳山區五甲三路45號","高雄市林園區東林里鳳林路1段176號","高雄市茄萣區進學路158號","宜蘭縣礁溪鄉礁溪路4段130號","宜蘭縣蘇澳鎮中山路1段1號","宜蘭縣羅東鎮興東路69號","桃園市龜山區豐美街2-1號","桃園市大溪區康莊路210號","臺中市豐原區三民路108號","臺中市東勢區中山路43號","臺中市沙鹿區台灣大道七段200號","臺東縣關山鎮中正路25號","桃園市觀音區中山路40號","新北市板橋區文化路1段395號","新北市板橋區仁化街40-1號","新北市新店區北新路2段177號","南投縣埔里鎮南昌街284號","新北市三重區正義南路10號","新北市泰山區明志路一段512號","新北市新莊區五工三路50巷2號","台北市信義區信義路五段7號","南投縣埔里鎮中山路一段421號","屏東縣車城鄉後灣路2號","台東縣台東市博愛路365號","嘉義縣太保市故宮大道888號","高雄市三民區九如一路720號","台中市西屯區惠來路二段101號","新北市萬里區野柳里港東路167-1號","台東縣成功鎮基翬路74號","澎湖縣馬公市治平路30號","宜蘭縣頭城鎮青雲路三段750號"];
var new_suggestion=[];
var i=0;

var output="";

function Zipfinder(input){

	var temp=input.split('');
	var index1=temp[0]+temp[1]+temp[2];
	var index2=temp[0]+temp[1]+temp[2]+temp[3];
	if(json[index1]!==undefined){
		if(json[index1][temp[3]+temp[4]]!==undefined){return json[index1][temp[3]+temp[4]]}
		else if(json[index1][temp[3]+temp[4]+temp[5]]!==undefined){return json[index1][temp[3]+temp[4]+temp[5]]}
		else if(json[index1][temp[3]+temp[4]+temp[5]+temp[6]]!==undefined){return json[index1][temp[3]+temp[4]+temp[5]+temp[6]]}
		else{return index1}
	}
	else if(json[index2]!==undefined){
		if(json[index2][temp[4]+temp[5]]!==undefined){return json[index2][temp[4]+temp[5]]}
		else if(json[index2][temp[4]+temp[5]]!==undefined){return json[index2][temp[4]+temp[5]]}
		else if(json[index2][temp[4]+temp[5]+temp[6]]!==undefined){return json[index2][temp[4]+temp[5]+temp[6]]}
		else if(json[index2][temp[4]+temp[5]+temp[6]+temp[7]]!==undefined){return json[index2][temp[4]+temp[5]+temp[6]+temp[7]]}
		else{return index2}
	}
	else {return "undefined"}

}

function Suggestfinder(input){
	var return_array=[];
	var temp=input.split('');
	var index1=temp[0]+temp[1]+temp[2];
	var index2=temp[0]+temp[1]+temp[2]+temp[3];
	if(json[index1]!==undefined){
		return_array.push(index1);
		if(json[index1][temp[3]+temp[4]]!==undefined){return_array.push(index1+temp[3]+temp[4]);}
		else if(json[index1][temp[3]+temp[4]+temp[5]]!==undefined){return_array.push(index1+temp[3]+temp[4]+temp[5]);}
		else if(json[index1][temp[3]+temp[4]+temp[5]+temp[6]]!==undefined){return_array.push(index1+temp[3]+temp[4]+temp[5]+temp[6]);}
	}
	else if(json[index2]!==undefined){
		return_array.push(index2);
		if(json[index2][temp[4]+temp[5]]!==undefined){return_array.push(index2+temp[4]+temp[5]);}
		else if(json[index2][temp[4]+temp[5]+temp[6]]!==undefined){return_array.push(index2+temp[4]+temp[5]+temp[6]);}
		else if(json[index2][temp[4]+temp[5]+temp[6]+temp[7]]!==undefined){return_array.push(index2+temp[4]+temp[5]+temp[6]+temp[7]);}
	}
	return return_array;
	}


function Suggestfinder2(input){
	var temp=input.split('');
	var index1=temp[0]+temp[1]+temp[2];
	var index2=temp[0]+temp[1]+temp[2]+temp[3];
	if(json[index1]!==undefined){return index1;}
	else if(json[index2]!==undefined){return index2;}
	return "";
	}

	const SelectContexts = {
	  parameter: 'select ',
	}	


app.intent('預設歡迎語句', (conv) => {

if(conv.screen===true){ 

    if (conv.user.last.seen) {
		conv.ask(new SimpleResponse({               
              speech: `<speak><p><s>歡迎使用郵遞號碼查詢器!</s><s>請點選建議卡片或直接輸入地址來進行操作。</s></p></speak>`,
              text: '歡迎使用!'}));
   } else {
	   conv.ask(new SimpleResponse({               
              speech: `<speak><p><s>歡迎使用郵遞號碼查詢器!</s><s>我能提供台灣郵遞區號的五碼查詢服務，你可以直接輸入地址、依照區域篩選查看該縣市的所有郵遞區號列表。或是取得你現在位置的郵遞區號。</s></p></speak>`,
              text: '歡迎使用!'}));
}  

   conv.ask(new BasicCard({  
        image: new Image({url:'https://i.imgur.com/bslu5n3.jpg ',alt:'Pictures',}),
        title: '請選擇要使用的服務類別',
        text:'**_㊟已支援查詢五碼查詢_**',
  })); 
   conv.ask(new Suggestions('🛰查詢現在位置','🔎依區域查詢','進行五碼查詢','語音查詢範例','👋 掰掰'));}
else{
   conv.contexts.set(FiveContexts.parameter, 1);
   conv.noInputs = ["請輸入要查詢的地址來進行操作喔!","抱歉，請問你要查詢的地址是?","抱歉，我想我幫不上忙。下次見!"];	   

   word1=city_array[parseInt(Math.random()*370)];word2=list[parseInt(Math.random()*70)];
   conv.ask(`<speak><p><s>歡迎使用郵遞號碼查詢器!</s><s>請試著詢問，來取得所需郵遞區號。</s><s>例如，你可以問<break time="0.2s"/>幫我找${word1}<break time="0.2s"/>或是<break time="0.2s"/>幫我查${word2}</s></p></speak>`);
   conv.ask(`<speak><p><s>如果想結束我們的對話</s><s>請說<break time="0.2s"/>結束查詢<break time="0.2s"/></s></p></speak>`);
}
});

app.intent('主選單', (conv) => {
 
  conv.ask(new SimpleResponse({               
              speech: `<speak><p><s>請點選建議卡片，或直接提問來取得縣市列表。</s></p></speak>`,
              text: '請點擊建議卡片或輸入地址來進行操作'}));

   conv.ask(new BasicCard({  
        title: '請選擇要使用的服務類別',
        text:'**_㊟已支援查詢五碼查詢_**',
  })); 
conv.ask(new Suggestions('🛰查詢現在位置','🔎依區域查詢','進行五碼查詢','👋 掰掰'));
});


app.intent('依區域查詢', (conv) => {
 conv.ask('請輕觸下方卡片來選擇查詢區域：');
// Create a carousel
  conv.ask(new Carousel({
  title: 'Carousel Title',
  items: {
    // Add the first item to the carousel
    'Northen': {
      title: '北部地區',
      description: '北北基、桃園市\n新竹縣市',
    image: new Image({url: 'https://i.imgur.com/UgDS7Vo.png',alt: 'Image alternate text',}),},
    // Add the second item to the carousel
    'Central': {
      title: '中部地區',
      description: '苗栗縣、臺中市\n雲林、彰化、南投',
    image: new Image({  url: 'https://i.imgur.com/kRvUaGe.png',alt: 'Image alternate text',}),},
    'Southen': {
      title: '南部地區',
  description: '嘉義縣市、臺南市\n高雄市、屏東縣',
    image: new Image({  url: 'https://i.imgur.com/ywwAfK6.png',alt: 'Image alternate text',}),},
	'East': {
		  title: '東部地區',
		  description: '宜蘭、花蓮、台東\n ',
		image: new Image({  url: 'https://i.imgur.com/5t5niGJ.png',alt:'Image alternate text',}),},
	'Outlying_island': {
		  title: '離島地區',
		  description: '澎湖縣、金門縣、\n連江縣',
		image: new Image({  url: 'https://i.imgur.com/UuZA8MT.png',alt: 'Image alternate text',}),},
	'南海諸島': {
		  title: '南海諸島',
		  description: '東沙、南沙\n ',
		image: new Image({  url: 'https://i.imgur.com/8NWPwwv.png',alt: 'Image alternate text',}),},
	  },
	 }));
 conv.ask(new Suggestions('回到選單'));

});

var local=["Northen","Central","Southen","East","Outlying_island"];

app.intent('縣市查詢結果', (conv, input, option) => {

if(local.indexOf(option)!==-1){
	conv.ask('請選擇要查詢的縣市。');
	conv.contexts.set(SelectContexts.parameter, 1);

  if (option === "Northen") {
conv.ask(new Carousel({
    items: {
    '臺北市': {
      title: '臺北市',
      description: 'Taipei City',
    },
    '新北市': {
      title: '新北市',
      description: 'New Taipei City',
    },
    '基隆市': {
      title: '基隆市',
  description: 'Kelling City',
    },
	'桃園市': {
      title: '桃園市',
      description: 'Taoyuan City',
    },
	'新竹縣': {
      title: '新竹縣',
      description: 'Hsinchu County',
    },
	'新竹市': {
      title: '新竹市',
      description: 'Hsinchu City',
    }
  },
}));  } 
  else if (option === "Central") {
conv.ask(new Carousel({
    items: {
    '苗栗縣': {
      title: '苗栗縣',
      description: 'Miaoli County',
    },
    '臺中市': {
      title: '臺中市',
      description: 'Taichung City',
    },
    '彰化縣': {
      title: '彰化縣',
      description: 'Changhua County',
    },
	'南投縣': {
      title: '南投縣',
      description: 'Nantou County',
    },
	'雲林縣': {
      title: '雲林縣',
      description: 'Yunlin County',
    }
  },
}));  }
  else if (option === "Southen") {
  conv.ask(new Carousel({
    items: {
    '嘉義縣': {
      title: '嘉義縣',
      description: 'Chiayi County',
    },
	 '嘉義市': {
      title: '嘉義市',
      description: 'Chiayi City',
    },
    '臺南市': {
      title: '臺南市',
      description: 'Tainan City',
    },
    '高雄市': {
      title: '高雄市',
  description: 'Kaohsiung City',
    },
	'屏東縣': {
      title: '屏東縣',
      description: 'Pingtung County',
    }
  },
}));  }
  else if (option === "East") {
  conv.ask(new Carousel({
    items: {
    '宜蘭縣': {
      title: '宜蘭縣',
      description: 'Yilan County',
    },
    '花蓮縣': {
      title: '花蓮縣',
      description: 'Hualien County',
    },
    '臺東縣': {
      title: '臺東縣',
      description: 'Taitung County',
    }
  },
}));  }
  else if (option === "Outlying_island") {
  conv.ask(new Carousel({
    items: {
    '澎湖縣': {
      title: '澎湖縣',
      description: 'Penghu County',
    },
    '金門縣': {
      title: '金門縣',
      description: 'Kinmen County',
    },
    '連江縣': {
      title: '連江縣',
  description: 'Lienchiang County',
    },
  }
}));  }
  
}
  else if(county_array.indexOf(option)!==-1){
    conv.ask(new SimpleResponse({speech:`<speak><p><s>以下是${option}的郵遞區號列表，請查看。</s></p></speak>`,text:'以下是「'+option+'」的郵遞區號列表。'}));                 
if (option === "臺北市") {
  conv.ask(new Table({
  title: '臺北市/郵遞區號列表',
  columns: [{header: '行政區',align: 'CENTER',},{header: '郵遞區號',align: 'CENTER',},{header: '行政區',align: 'CENTER',},{header: '郵遞區號',align: 'CENTER',}],
  rows: [
    {cells: ['中正區', '100','信義區', '110'],},
    {cells: ['大同區', '103','士林區', '111'],},
    {cells: ['中山區', '104','北投區', '112'],},
    {cells: ['松山區', '105','內湖區', '114'],},
    {cells: ['大安區', '106','文山區', '115'],},
    {cells: ['萬華區', '108','南港區', '116'],},
  ],
}));
}
  else if (option === "新北市") {
  conv.ask(new Table({
  title: '新北市/郵遞區號列表',
  columns: [{header: '行政區',align: 'CENTER',},{header: '郵遞區號',align: 'CENTER',},{header: '行政區',align: 'CENTER',},{header: '郵遞區號',align: 'CENTER',}],
  rows: [
    {cells: ['萬里區', '207','土城區', '506'],},
    {cells: ['金山區', '208','三峽區', '507'],},
    {cells: ['板橋區', '220','樹林區', '508'],},
    {cells: ['松山區', '221','鶯歌區', '249'],},
    {cells: ['深坑區', '222','三重區', '241'],},
    {cells: ['石碇區', '250','新莊區', '242'],},
    {cells: ['瑞芳區', '224','泰山區', '243'],},
    {cells: ['平溪區', '226','林口區', '244'],},
    {cells: ['雙溪區', '227','蘆洲區', '247'],},
    {cells: ['貢寮區', '228','五股區', '250'],},
    {cells: ['新店區', '501','八里區', '509'],},
    {cells: ['坪林區', '502','淡水區', '251'],},
    {cells: ['烏來區', '503','三芝區', '252'],},
    {cells: ['永和區', '504','石門區', '253'],},
    {cells: ['中和區', '505',' ', ' '],},],}));
  }
  else if (option === "基隆市") {
  conv.ask(new Table({
  title: '基隆市/郵遞區號列表',
  columns: [{header: '行政區',align: 'CENTER',},{header: '郵遞區號',align: 'CENTER',},{header: '行政區',align: 'CENTER',},{header: '郵遞區號',align: 'CENTER',}],
  rows: [
    {cells: ['仁愛區', '200','安樂區', '204'],},
    {cells: ['信義區', '201','暖暖區', '205'],},
    {cells: ['中正區', '202','七堵區', '206'],},
    {cells: ['中山區', '203','', ''],}, ],}));
  }
  else if (option === "宜蘭縣") {
  conv.ask(new Table({
  title: '宜蘭縣/郵遞區號列表',
  columns: [{header: '行政區',align: 'CENTER',},{header: '郵遞區號',align: 'CENTER',},{header: '行政區',align: 'CENTER',},{header: '郵遞區號',align: 'CENTER',}],
  rows: [
    {cells: ['宜蘭市', '260','大同鄉', '267'],},
    {cells: ['頭城鎮', '261','五結鄉', '268'],},
    {cells: ['礁溪鄉', '262','冬山鄉', '269'],},
    {cells: ['壯圍鄉', '263','蘇澳鎮', '270'],},
    {cells: ['員山鄉', '264','南澳鄉', '272'],},
    {cells: ['羅東鎮', '265','釣魚臺列嶼', '290'],},
    {cells: ['三星鄉', '266','', ''],}, ],}));
  }
  else if (option === "桃園市") {
  conv.ask(new Table({
  title: '桃園市/郵遞區號列表',
  columns: [{header: '行政區',align: 'CENTER',},{header: '郵遞區號',align: 'CENTER',},{header: '行政區',align: 'CENTER',},{header: '郵遞區號',align: 'CENTER',}],
  rows: [ {cells: ['中壢區','320','龜山區', '333'],},
                    {cells: ['平鎮區', '324','八德區', '334'],},
                   {cells: ['龍潭區', '325','大溪區', '335'],},
                   {cells: ['楊梅區', '326','復興區', '336'],},
                   {cells: ['新屋區', '327','大園區', '337'],},
                   {cells: ['觀音區', '328','蘆竹區', '338'],},
                   {cells: ['桃園區', '330',' ', ' '],}, ],}));
  }
  else if (option === "新竹縣") {
    conv.ask(new Table({
      title: '新竹縣/郵遞區號列表',
    columns: [{header: '行政區',align: 'CENTER',},{header: '郵遞區號',align: 'CENTER',},{header: '行政區',align: 'CENTER',},{header: '郵遞區號',align: 'CENTER',}],
    rows: [ {cells: ['竹北市','302','寶山鄉', '310'],},
          {cells: ['湖口鄉', '303','竹東鎮', '311'],},
          {cells: ['新豐鄉', '304','五峰鄉', '312'],},
          {cells: ['新埔鎮', '305','橫山鄉', '313'],},
          {cells: ['關西鎮', '306','尖石鄉', '314'],},
          {cells: ['芎林鄉', '307','北埔鄉', '315'],},
          {cells: ['峨眉鄉', '308',' ', ' '],}, ],}));
  }
    else if (option === "新竹市") {
  conv.ask(new Table({
        title: '新竹市/郵遞區號列表',
            columns: [{header: '行政區',align: 'CENTER',},{header: '郵遞區號',align: 'CENTER',},{header: '行政區',align: 'CENTER',},{header: '郵遞區號',align: 'CENTER',}],
        rows: [ {cells: ['東區', '300','北區', '300'],},
                {cells: ['香山區', '300',' ', ' '],}, ],}));
  }

  else if (option === "苗栗縣") {
  conv.ask(new Table({
        title: '苗栗縣/郵遞區號列表',
            columns: [{header: '行政區',align: 'CENTER',},{header: '郵遞區號',align: 'CENTER',},{header: '行政區',align: 'CENTER',},{header: '郵遞區號',align: 'CENTER',}],
        rows: [ {cells: ['竹南鎮', '350','造橋鄉', '361'],},
          {cells: ['頭份市', '351','頭屋鄉', '362'],},
          {cells: ['三灣鄉', '352','公館鄉', '363'],},
          {cells: ['南庄鄉', '353','大湖鄉', '364'],},
          {cells: ['獅潭鄉', '354','泰安鄉', '365'],},
          {cells: ['後龍鎮', '356','銅鑼鄉', '366'],},
          {cells: ['通霄鎮', '357','三義鄉', '367'],},
          {cells: ['苑裡鎮', '358','西湖鄉', '368'],},
          {cells: ['苗栗市', '360','卓蘭鎮', '369 '],}, ],}));
  }

  else if (option === "臺中市") {
  conv.ask(new Table({
              title: '臺中市/郵遞區號列表',
                        columns: [{header: '行政區',align: 'CENTER',},{header: '郵遞區號',align: 'CENTER',},{header: '行政區',align: 'CENTER',},{header: '郵遞區號',align: 'CENTER',}],
              rows: [ {cells: ['中  區', '400','東勢區', '423'],},
          {cells: ['東  區', '401','和平區', '424'],},
          {cells: ['南  區', '402','新社區', '426'],},
          {cells: ['西  區', '403','潭子區', '427'],},
          {cells: ['北  區', '404','大雅區', '428'],},
          {cells: ['北屯區', '406','神岡區', '429'],},
          {cells: ['西屯區', '407','大肚區', '432'],},
          {cells: ['南屯區', '408','沙鹿區', '433'],},
          {cells: ['太平區', '411','龍井區', '434'],},
          {cells: ['大里區', '412','梧棲區', '435'],},
          {cells: ['霧峰區', '413','清水區', '436'],},
          {cells: ['烏日區', '414','大甲區', '437'],},
          {cells: ['豐原區', '420','外埔區', '438'],},
          {cells: ['后里區', '421','大安區', '439'],},
          {cells: ['石岡區', '422',' ', ' '],}, ],}));  
  }
  else if (option === "彰化縣") {
  conv.ask(new Table({
      title: '彰化縣/郵遞區號列表',
        columns: [{header: '行政區',align: 'CENTER',},{header: '郵遞區號',align: 'CENTER',},{header: '行政區',align: 'CENTER',},{header: '郵遞區號',align: 'CENTER',}],
      rows: [ {cells: ['彰化市', '500','溪湖鎮', '514'],},
          {cells: ['芬園鄉', '502','大村鄉', '515'],},
          {cells: ['花壇鄉', '503','埔鹽鄉', '516'],},
          {cells: ['秀水鄉', '504','田中鎮', '520'],},
          {cells: ['鹿港鎮', '505','北斗鎮', '521'],},
          {cells: ['福興鄉', '506','田尾鄉', '522'],},
          {cells: ['線西鄉', '507','埤頭鄉', '550'],},
          {cells: ['和美鎮', '508','溪州鄉', '524'],},
          {cells: ['伸港鄉', '509','竹塘鄉', '525'],},
          {cells: ['員林市', '510','二林鎮', '526'],},
          {cells: ['社頭鄉', '511','大城鄉', '527'],},
          {cells: ['永靖鄉', '512','芳苑鄉', '528'],},
          {cells: ['埔心鄉', '513','二水鄉', '530'],}, ],}));
  
  }
  else if (option === "南投縣") {
  conv.ask(new Table({
      title: '南投縣/郵遞區號列表',
        columns: [{header: '行政區',align: 'CENTER',},{header: '郵遞區號',align: 'CENTER',},{header: '行政區',align: 'CENTER',},{header: '郵遞區號',align: 'CENTER',}],
           rows: [ {cells: ['南投市', '540','集集鎮', '552'],},
          {cells: ['中寮鄉', '541','水里鄉', '553'],},
          {cells: ['草屯鎮', '542','魚池鄉', '555'],},
          {cells: ['國姓鄉', '544','信義鄉', '556'],},
          {cells: ['埔里鎮', '545','竹山鎮', '557'],},
          {cells: ['仁愛鄉', '546','鹿谷鄉', '558'],},
          {cells: ['名間鄉', '551',' ', ' '],}, ],}));  
  }
  else if (option === "雲林縣") {
  conv.ask(new Table({
      title: '雲林縣/郵遞區號列表',
        columns: [{header: '行政區',align: 'CENTER',},{header: '郵遞區號',align: 'CENTER',},{header: '行政區',align: 'CENTER',},{header: '郵遞區號',align: 'CENTER',}],
           rows: [ {cells: ['斗南鎮', '630','林內鄉', '643'],},
          {cells: ['大埤鄉', '631','古坑鄉', '646'],},
          {cells: ['虎尾鄉', '632','莿桐鄉', '647'],},
          {cells: ['土庫鎮', '633','西螺鎮', '650'],},
          {cells: ['褒忠鄉', '634','二崙鄉', '649'],},
          {cells: ['東勢鄉', '635','北港鎮', '651'],},
          {cells: ['臺西鄉', '636','水林鄉', '652'],},
          {cells: ['崙背鄉', '637','口湖鄉', '653'],},
          {cells: ['麥寮鄉', '638','四湖鄉', '654'],},
          {cells: ['斗六市', '640','元長鄉', '655'],}, ],}));
  }
  else if (option === "嘉義縣") {
  conv.ask(new Table({
      title: '嘉義縣/郵遞區號列表',
        columns: [{header: '行政區',align: 'CENTER',},{header: '郵遞區號',align: 'CENTER',},{header: '行政區',align: 'CENTER',},{header: '郵遞區號',align: 'CENTER',}],
           rows: [ {cells: ['番路鄉', '602','朴子市', '613'],},
          {cells: ['梅山鄉', '603','東石鄉', '614'],},
          {cells: ['竹崎鄉', '604','六腳鄉', '615'],},
          {cells: ['阿里山鄉', '605','新港鄉', '616'],},
          {cells: ['中埔鄉', '606','民雄鄉', '621'],},
          {cells: ['大埔鄉', '607','大林鎮', '622'],},
          {cells: ['水上鄉', '608','溪口鄉', '650'],},
          {cells: ['鹿草鄉', '611','義竹鄉', '624'],},
          {cells: ['太保市', '612','布袋鎮', '625'],},],}));  
  }
  else if (option === "嘉義市") {
  conv.ask(new Table({
      title: '嘉義市/郵遞區號列表',
        columns: [{header: '行政區',align: 'CENTER',},{header: '郵遞區號',align: 'CENTER',},{header: '行政區',align: 'CENTER',},{header: '郵遞區號',align: 'CENTER',}],
           rows: [ {cells: ['東區', '600','西區', '600'],},],}));  
  }

  else if (option === "臺南市") {
  conv.ask(new Table({
      title: '臺南市/郵遞區號列表',
        columns: [{header: '行政區',align: 'CENTER',},{header: '郵遞區號',align: 'CENTER',},{header: '行政區',align: 'CENTER',},{header: '郵遞區號',align: 'CENTER',}],
           rows: [ {cells: ['中西區', '700','西港區', '750'],},
          {cells: ['東  區', '701','七股區', '724'],},
          {cells: ['南  區', '702','將軍區', '725'],},
          {cells: ['北  區', '704','學甲區', '726'],},
          {cells: ['安平區', '708','北門區', '727'],},
          {cells: ['安南區', '709','新營區', '730'],},
          {cells: ['永康區', '710','後壁區', '731'],},
          {cells: ['歸仁區', '711','白河區', '732'],},
          {cells: ['新化區', '712','東山區', '733'],},
          {cells: ['左鎮區', '713','六甲區', '734'],},
          {cells: ['玉井區', '714','下營區', '735'],},
          {cells: ['楠西區', '715','柳營區', '736'],},
          {cells: ['南化區', '716','鹽水區', '737'],},
          {cells: ['仁德區', '717','善化區', '741'],},
          {cells: ['關廟區', '718','大內區', '742'],},
          {cells: ['龍崎區', '719','山上區', '743'],},
          {cells: ['官田區', '720','新市區', '744'],},
          {cells: ['麻豆區', '721','安定區', '745'],},
          {cells: ['佳里區', '722',' ', ' '],}, ],}));

  }
  else if (option === "高雄市") {
  conv.ask(new Table({
      title: '高雄市/郵遞區號列表',
        columns: [{header: '行政區',align: 'CENTER',},{header: '郵遞區號',align: 'CENTER',},{header: '行政區',align: 'CENTER',},{header: '郵遞區號',align: 'CENTER',}],
           rows: [ {cells: ['新興區', '800','梓官區', '826'],},
          {cells: ['前金區', '801','彌陀區', '827'],},
          {cells: ['苓雅區', '802','永安區', '828'],},
          {cells: ['鹽埕區', '803','湖內區', '829'],},
          {cells: ['鼓山區', '804','鳳山區', '830'],},
          {cells: ['旗津區', '805','大寮區', '831'],},
          {cells: ['前鎮區', '806','林園區', '832'],},
          {cells: ['三民區', '807','鳥松區', '833'],},
          {cells: ['楠梓區', '811','大樹區', '840'],},
          {cells: ['小港區', '812','旗山區', '842'],},
          {cells: ['左營區', '813','美濃區', '843'],},
          {cells: ['仁武區', '814','六龜區', '844'],},
          {cells: ['大社區', '815','內門區', '845'],},
          {cells: ['岡山區', '820','杉林區', '846'],},
          {cells: ['路竹區', '821','甲仙區', '847'],},
          {cells: ['阿蓮區', '822','桃源區', '850'],},
          {cells: ['田寮區', '850','那瑪夏區', '849'],},
          {cells: ['燕巢區', '824','茂林區', '851'],},
          {cells: ['橋頭區', '825','茄萣區', '852'],}, ],}));
  }
  else if (option === "屏東縣") {
  conv.ask(new Table({
      title: '屏東縣/郵遞區號列表',
        columns: [{header: '行政區',align: 'CENTER',},{header: '郵遞區號',align: 'CENTER',},{header: '行政區',align: 'CENTER',},{header: '郵遞區號',align: 'CENTER',},],
           rows: [ {cells: ['屏東市', '900','崁頂鄉', '924'],},
                   {cells: ['三地門鄉', '901','新埤鄉', '925'],},
                   {cells: ['霧臺鄉', '902','南州鄉', '926'],},
                   {cells: ['瑪家鄉', '903','林邊鄉', '927'],},
                   {cells: ['九如鄉', '904','東港鎮', '928'],},
                   {cells: ['里港鄉', '905','琉球鄉', '929'],},
                   {cells: ['高樹鄉', '906','佳冬鄉', '931'],},
                   {cells: ['鹽埔鄉', '907','新園鄉', '932'],},
                   {cells: ['長治鄉', '908','枋寮鄉', '940'],},
                   {cells: ['麟洛鄉', '909','枋山鄉', '941'],},
                   {cells: ['竹田鄉', '911','春日鄉', '942'],},
                   {cells: ['內埔鄉', '912','獅子鄉', '943'],},
                   {cells: ['萬丹鄉', '913','車城鄉', '944'],},
                   {cells: ['潮州鎮', '920','牡丹鄉', '945'],},
                   {cells: ['泰武鄉', '921','恆春鎮', '946'],},
                   {cells: ['來義鄉', '922','滿州鄉', '947'],},
                   {cells: ['萬巒鄉', '950','', ''],}, ],}));  
  }
  else if (option === "花蓮縣") {
  conv.ask(new Table({
      title: '花蓮縣/郵遞區號列表',
        columns: [{header: '行政區',align: 'CENTER',},{header: '郵遞區號',align: 'CENTER',},{header: '行政區',align: 'CENTER',},{header: '郵遞區號',align: 'CENTER',}],
           rows: [ {cells: ['花蓮市', '970','豐濱鄉', '977'],},
                   {cells: ['新城鄉', '971','瑞穗鄉', '978'],},
                   {cells: ['秀林鄉', '972','萬榮鄉', '979'],},
                   {cells: ['吉安鄉', '973','玉里鎮', '981'],},
                   {cells: ['壽豐鄉', '974','卓溪鄉', '982'],},
                   {cells: ['鳳林鎮', '975','富里鄉', '983'],},
                   {cells: ['光復鄉', '976',' ', ' '],}, ],}));    
  }
  else if (option === "臺東縣") {
  conv.ask(new Table({
      title: '臺東縣/郵遞區號列表',
        columns: [{header: '行政區',align: 'CENTER',},{header: '郵遞區號',align: 'CENTER',},{header: '行政區',align: 'CENTER',},{header: '郵遞區號',align: 'CENTER',}],
           rows: [ {cells: ['臺東市', '950','池上鄉', '958'],},
                   {cells: ['綠島鄉', '951','東河鄉', '959'],},
                   {cells: ['蘭嶼鄉', '952','成功鎮', '961'],},
                   {cells: ['延平鄉', '953','長濱鄉', '962'],},
                   {cells: ['卑南鄉', '954','太麻里鄉', '963'],},
                   {cells: ['鹿野鄉', '955','金峰鄉', '964'],},
                   {cells: ['關山鎮', '956','大武鄉', '965'],},
                   {cells: ['海端鄉', '957','達仁鄉', '966'],}, ],}));
  
  }
  else if (option === "澎湖縣") {
 conv.ask(new Table({
    title: '澎湖縣/郵遞區號列表',
	columns: [{header: '行政區',align: 'CENTER',},{header: '郵遞區號',align: 'CENTER',},{header: '行政區',align: 'CENTER',},{header: '郵遞區號',align: 'CENTER',}],
            rows: [{cells: ['馬公市', '880','七美鄉', '883'],},
				   {cells: ['西嶼鄉', '881','白沙鄉', '884'],},
				   {cells: ['望安鄉', '882','湖西鄉', '885'],}, ],}));
  } 
  else if (option === "金門縣") {

  conv.ask(new Table({
    title: '金門縣/郵遞區號列表',
	columns: [{header: '行政區',align: 'CENTER',},{header: '郵遞區號',align: 'CENTER',},{header: '行政區',align: 'CENTER',},{header: '郵遞區號',align: 'CENTER',}],
    rows: [
    {cells: ['金沙鎮', '890','金城鎮', '893'],},
    {cells: ['金湖鎮', '891','烈嶼鄉', '894'],}, 
    {cells: ['金寧鎮', '892','烏坵鄉', '896'],},],}));
  }else if (option === "連江縣") {

  conv.ask(new Table({
    title: '連江縣/郵遞區號列表',
	columns: [{header: '行政區',align: 'CENTER',},{header: '郵遞區號',align: 'CENTER',},{header: '行政區',align: 'CENTER',},{header: '郵遞區號',align: 'CENTER',}],
    rows: [{cells: ['南竿鄉', '209','莒光鄉', '211'],},
             {cells: ['北竿鄉', '210','東引鄉', '212'],},],}));
  }	
    else if (option === "南海諸島") {
    conv.ask(new Table({
	  title: option+'/郵遞區號列表',
	  columns: [{header: '行政區',align: 'CENTER',},{header: '郵遞區號',align: 'CENTER',},{header: '行政區',align: 'CENTER',},{header: '郵遞區號',align: 'CENTER',}],
	  rows: [
		{cells: ['東沙', '817','南沙', '819'],},],}));}

  conv.ask(new Suggestions('查詢其他縣市'));

  }
  else{
   conv.contexts.set(SelectContexts.parameter, 1);
   conv.ask(new SimpleResponse({               
              speech: `<speak><p><s>抱歉，區域查詢過程中發生錯誤。請重新查詢。</s></p></speak>`,
              text: '查詢過程發生錯誤，\n請重新選擇。'}));

  conv.ask(new Carousel({
  title: 'Carousel Title',
  items: {
    // Add the first item to the carousel
    'Northen': {
      title: '北部地區',
      description: '北北基、桃園市\n新竹縣市',
    image: new Image({url: 'https://i.imgur.com/UgDS7Vo.png',alt: 'Image alternate text',}),},
    // Add the second item to the carousel
    'Central': {
      title: '中部地區',
      description: '苗栗縣、臺中市\n雲林、彰化、南投',
    image: new Image({  url: 'https://i.imgur.com/kRvUaGe.png',alt: 'Image alternate text',}),},
    'Southen': {
      title: '南部地區',
  description: '嘉義縣市、臺南市、高雄市、屏東縣',
    image: new Image({  url: 'https://i.imgur.com/ywwAfK6.png',alt: 'Image alternate text',}),},
	'East': {
		  title: '東部地區',
		  description: '宜蘭、花蓮、台東\n',
		image: new Image({  url: 'https://i.imgur.com/5t5niGJ.png',alt:'Image alternate text',}),},
	'Outlying_island': {
		  title: '離島地區',
		  description: '澎湖縣、金門縣、\n連江縣',
		image: new Image({  url: 'https://i.imgur.com/UuZA8MT.png',alt: 'Image alternate text',}),},
	  },
	 }));

conv.ask(new Suggestions('🛰查詢現在位置','進行五碼查詢'));
  
  }
conv.ask(new Suggestions('回到選單'));

});

	var word1="";var word2="";var word3="";

app.intent('直接查看列表', (conv,{city}) => {
	
if(conv.input.raw.indexOf('新北')!==-1){city="新北";}	
	
 if(county_array.indexOf(city)!==-1){
		if(city!=="嘉義"&&city!=="新竹"){
		conv.ask(new SimpleResponse({speech:`<speak><p><s>以下是${city}的郵遞區號列表，請查看。</s></p></speak>`,text:'以下是「'+city+'」的郵遞區號列表。'}));  }
		else{
		conv.ask(new SimpleResponse({speech:`<speak><p><s>${city}的郵遞區號列表分為下列兩個，請點擊卡片來選擇。</s></p></speak>`,text:'「'+city+'」的郵遞區號列表分兩個項目，請點擊下方卡片來選擇。'}));  }
if (city === "臺北市") {
  conv.ask(new Table({
  title: '臺北市/郵遞區號列表',
  columns: [{header: '行政區',align: 'CENTER',},{header: '郵遞區號',align: 'CENTER',},{header: '行政區',align: 'CENTER',},{header: '郵遞區號',align: 'CENTER',}],
  rows: [
    {cells: ['中正區', '100','信義區', '110'],},
    {cells: ['大同區', '103','士林區', '111'],},
    {cells: ['中山區', '104','北投區', '112'],},
    {cells: ['松山區', '105','內湖區', '114'],},
    {cells: ['大安區', '106','文山區', '115'],},
    {cells: ['萬華區', '108','南港區', '116'],},
  ],
}));
}
  else if (city === "新北市") {
  conv.ask(new Table({
  title: '新北市/郵遞區號列表',
  columns: [{header: '行政區',align: 'CENTER',},{header: '郵遞區號',align: 'CENTER',},{header: '行政區',align: 'CENTER',},{header: '郵遞區號',align: 'CENTER',}],
  rows: [
    {cells: ['萬里區', '207','土城區', '506'],},
    {cells: ['金山區', '208','三峽區', '507'],},
    {cells: ['板橋區', '220','樹林區', '508'],},
    {cells: ['松山區', '221','鶯歌區', '249'],},
    {cells: ['深坑區', '222','三重區', '241'],},
    {cells: ['石碇區', '250','新莊區', '242'],},
    {cells: ['瑞芳區', '224','泰山區', '243'],},
    {cells: ['平溪區', '226','林口區', '244'],},
    {cells: ['雙溪區', '227','蘆洲區', '247'],},
    {cells: ['貢寮區', '228','五股區', '250'],},
    {cells: ['新店區', '501','八里區', '509'],},
    {cells: ['坪林區', '502','淡水區', '251'],},
    {cells: ['烏來區', '503','三芝區', '252'],},
    {cells: ['永和區', '504','石門區', '253'],},
    {cells: ['中和區', '505',' ', ' '],},],}));
  }
  else if (city === "基隆市") {
  conv.ask(new Table({
  title: '基隆市/郵遞區號列表',
  columns: [{header: '行政區',align: 'CENTER',},{header: '郵遞區號',align: 'CENTER',},{header: '行政區',align: 'CENTER',},{header: '郵遞區號',align: 'CENTER',}],
  rows: [
    {cells: ['仁愛區', '200','安樂區', '204'],},
    {cells: ['信義區', '201','暖暖區', '205'],},
    {cells: ['中正區', '202','七堵區', '206'],},
    {cells: ['中山區', '203','', ''],}, ],}));
  }
  else if (city === "宜蘭縣") {
  conv.ask(new Table({
  title: '宜蘭縣/郵遞區號列表',
  columns: [{header: '行政區',align: 'CENTER',},{header: '郵遞區號',align: 'CENTER',},{header: '行政區',align: 'CENTER',},{header: '郵遞區號',align: 'CENTER',}],
  rows: [
    {cells: ['宜蘭市', '260','大同鄉', '267'],},
    {cells: ['頭城鎮', '261','五結鄉', '268'],},
    {cells: ['礁溪鄉', '262','冬山鄉', '269'],},
    {cells: ['壯圍鄉', '263','蘇澳鎮', '270'],},
    {cells: ['員山鄉', '264','南澳鄉', '272'],},
    {cells: ['羅東鎮', '265','釣魚臺列嶼', '290'],},
    {cells: ['三星鄉', '266','', ''],}, ],}));
  }
  else if (city === "桃園市") {
  conv.ask(new Table({
  title: '桃園市/郵遞區號列表',
  columns: [{header: '行政區',align: 'CENTER',},{header: '郵遞區號',align: 'CENTER',},{header: '行政區',align: 'CENTER',},{header: '郵遞區號',align: 'CENTER',}],
  rows: [ {cells: ['中壢區','320','龜山區', '333'],},
                    {cells: ['平鎮區', '324','八德區', '334'],},
                   {cells: ['龍潭區', '325','大溪區', '335'],},
                   {cells: ['楊梅區', '326','復興區', '336'],},
                   {cells: ['新屋區', '327','大園區', '337'],},
                   {cells: ['觀音區', '328','蘆竹區', '338'],},
                   {cells: ['桃園區', '330',' ', ' '],}, ],}));
  }
  else if (city === "新竹縣") {
    conv.ask(new Table({
      title: '新竹縣/郵遞區號列表',
    columns: [{header: '行政區',align: 'CENTER',},{header: '郵遞區號',align: 'CENTER',},{header: '行政區',align: 'CENTER',},{header: '郵遞區號',align: 'CENTER',}],
    rows: [ {cells: ['竹北市','302','寶山鄉', '310'],},
          {cells: ['湖口鄉', '303','竹東鎮', '311'],},
          {cells: ['新豐鄉', '304','五峰鄉', '312'],},
          {cells: ['新埔鎮', '305','橫山鄉', '313'],},
          {cells: ['關西鎮', '306','尖石鄉', '314'],},
          {cells: ['芎林鄉', '307','北埔鄉', '315'],},
          {cells: ['峨眉鄉', '308',' ', ' '],}, ],}));
  }
  else if (city === "新竹市") {
  conv.ask(new Table({
        title: '新竹市/郵遞區號列表',
            columns: [{header: '行政區',align: 'CENTER',},{header: '郵遞區號',align: 'CENTER',},{header: '行政區',align: 'CENTER',},{header: '郵遞區號',align: 'CENTER',}],
        rows: [ {cells: ['東區', '300','北區', '300'],},
                {cells: ['香山區', '300',' ', ' '],}, ],}));
  }
  else if (city === "苗栗縣") {
  conv.ask(new Table({
        title: '苗栗縣/郵遞區號列表',
            columns: [{header: '行政區',align: 'CENTER',},{header: '郵遞區號',align: 'CENTER',},{header: '行政區',align: 'CENTER',},{header: '郵遞區號',align: 'CENTER',}],
        rows: [ {cells: ['竹南鎮', '350','造橋鄉', '361'],},
          {cells: ['頭份市', '351','頭屋鄉', '362'],},
          {cells: ['三灣鄉', '352','公館鄉', '363'],},
          {cells: ['南庄鄉', '353','大湖鄉', '364'],},
          {cells: ['獅潭鄉', '354','泰安鄉', '365'],},
          {cells: ['後龍鎮', '356','銅鑼鄉', '366'],},
          {cells: ['通霄鎮', '357','三義鄉', '367'],},
          {cells: ['苑裡鎮', '358','西湖鄉', '368'],},
          {cells: ['苗栗市', '360','卓蘭鎮', '369 '],}, ],}));
  }
  else if (city === "臺中市") {
  conv.ask(new Table({
              title: '臺中市/郵遞區號列表',
                        columns: [{header: '行政區',align: 'CENTER',},{header: '郵遞區號',align: 'CENTER',},{header: '行政區',align: 'CENTER',},{header: '郵遞區號',align: 'CENTER',}],
              rows: [ {cells: ['中  區', '400','東勢區', '423'],},
          {cells: ['東  區', '401','和平區', '424'],},
          {cells: ['南  區', '402','新社區', '426'],},
          {cells: ['西  區', '403','潭子區', '427'],},
          {cells: ['北  區', '404','大雅區', '428'],},
          {cells: ['北屯區', '406','神岡區', '429'],},
          {cells: ['西屯區', '407','大肚區', '432'],},
          {cells: ['南屯區', '408','沙鹿區', '433'],},
          {cells: ['太平區', '411','龍井區', '434'],},
          {cells: ['大里區', '412','梧棲區', '435'],},
          {cells: ['霧峰區', '413','清水區', '436'],},
          {cells: ['烏日區', '414','大甲區', '437'],},
          {cells: ['豐原區', '420','外埔區', '438'],},
          {cells: ['后里區', '421','大安區', '439'],},
          {cells: ['石岡區', '422',' ', ' '],}, ],}));  
  }
  else if (city === "彰化縣") {
  conv.ask(new Table({
      title: '彰化縣/郵遞區號列表',
        columns: [{header: '行政區',align: 'CENTER',},{header: '郵遞區號',align: 'CENTER',},{header: '行政區',align: 'CENTER',},{header: '郵遞區號',align: 'CENTER',}],
      rows: [ {cells: ['彰化市', '500','溪湖鎮', '514'],},
          {cells: ['芬園鄉', '502','大村鄉', '515'],},
          {cells: ['花壇鄉', '503','埔鹽鄉', '516'],},
          {cells: ['秀水鄉', '504','田中鎮', '520'],},
          {cells: ['鹿港鎮', '505','北斗鎮', '521'],},
          {cells: ['福興鄉', '506','田尾鄉', '522'],},
          {cells: ['線西鄉', '507','埤頭鄉', '550'],},
          {cells: ['和美鎮', '508','溪州鄉', '524'],},
          {cells: ['伸港鄉', '509','竹塘鄉', '525'],},
          {cells: ['員林市', '510','二林鎮', '526'],},
          {cells: ['社頭鄉', '511','大城鄉', '527'],},
          {cells: ['永靖鄉', '512','芳苑鄉', '528'],},
          {cells: ['埔心鄉', '513','二水鄉', '530'],}, ],}));
  
  }
  else if (city === "南投縣") {
  conv.ask(new Table({
      title: '南投縣/郵遞區號列表',
        columns: [{header: '行政區',align: 'CENTER',},{header: '郵遞區號',align: 'CENTER',},{header: '行政區',align: 'CENTER',},{header: '郵遞區號',align: 'CENTER',}],
           rows: [ {cells: ['南投市', '540','集集鎮', '552'],},
          {cells: ['中寮鄉', '541','水里鄉', '553'],},
          {cells: ['草屯鎮', '542','魚池鄉', '555'],},
          {cells: ['國姓鄉', '544','信義鄉', '556'],},
          {cells: ['埔里鎮', '545','竹山鎮', '557'],},
          {cells: ['仁愛鄉', '546','鹿谷鄉', '558'],},
          {cells: ['名間鄉', '551',' ', ' '],}, ],}));  
  }
  else if (city === "雲林縣") {
  conv.ask(new Table({
      title: '雲林縣/郵遞區號列表',
        columns: [{header: '行政區',align: 'CENTER',},{header: '郵遞區號',align: 'CENTER',},{header: '行政區',align: 'CENTER',},{header: '郵遞區號',align: 'CENTER',}],
           rows: [ {cells: ['斗南鎮', '630','林內鄉', '643'],},
          {cells: ['大埤鄉', '631','古坑鄉', '646'],},
          {cells: ['虎尾鄉', '632','莿桐鄉', '647'],},
          {cells: ['土庫鎮', '633','西螺鎮', '650'],},
          {cells: ['褒忠鄉', '634','二崙鄉', '649'],},
          {cells: ['東勢鄉', '635','北港鎮', '651'],},
          {cells: ['臺西鄉', '636','水林鄉', '652'],},
          {cells: ['崙背鄉', '637','口湖鄉', '653'],},
          {cells: ['麥寮鄉', '638','四湖鄉', '654'],},
          {cells: ['斗六市', '640','元長鄉', '655'],}, ],}));
  }
  else if (city === "嘉義縣") {
  conv.ask(new Table({
      title: '嘉義縣/郵遞區號列表',
        columns: [{header: '行政區',align: 'CENTER',},{header: '郵遞區號',align: 'CENTER',},{header: '行政區',align: 'CENTER',},{header: '郵遞區號',align: 'CENTER',}],
           rows: [ {cells: ['番路鄉', '602','朴子市', '613'],},
          {cells: ['梅山鄉', '603','東石鄉', '614'],},
          {cells: ['竹崎鄉', '604','六腳鄉', '615'],},
          {cells: ['阿里山鄉', '605','新港鄉', '616'],},
          {cells: ['中埔鄉', '606','民雄鄉', '621'],},
          {cells: ['大埔鄉', '607','大林鎮', '622'],},
          {cells: ['水上鄉', '608','溪口鄉', '650'],},
          {cells: ['鹿草鄉', '611','義竹鄉', '624'],},
          {cells: ['太保市', '612','布袋鎮', '625'],},],}));  
  }
  else if (city === "嘉義市") {
  conv.ask(new Table({
      title: '嘉義市/郵遞區號列表',
        columns: [{header: '行政區',align: 'CENTER',},{header: '郵遞區號',align: 'CENTER',},{header: '行政區',align: 'CENTER',},{header: '郵遞區號',align: 'CENTER',}],
           rows: [ {cells: ['東區', '600','西區', '600'],},],}));  
  }
  else if (city === "臺南市") {
  conv.ask(new Table({
      title: '臺南市/郵遞區號列表',
        columns: [{header: '行政區',align: 'CENTER',},{header: '郵遞區號',align: 'CENTER',},{header: '行政區',align: 'CENTER',},{header: '郵遞區號',align: 'CENTER',}],
           rows: [ {cells: ['中西區', '700','西港區', '750'],},
          {cells: ['東  區', '701','七股區', '724'],},
          {cells: ['南  區', '702','將軍區', '725'],},
          {cells: ['北  區', '704','學甲區', '726'],},
          {cells: ['安平區', '708','北門區', '727'],},
          {cells: ['安南區', '709','新營區', '730'],},
          {cells: ['永康區', '710','後壁區', '731'],},
          {cells: ['歸仁區', '711','白河區', '732'],},
          {cells: ['新化區', '712','東山區', '733'],},
          {cells: ['左鎮區', '713','六甲區', '734'],},
          {cells: ['玉井區', '714','下營區', '735'],},
          {cells: ['楠西區', '715','柳營區', '736'],},
          {cells: ['南化區', '716','鹽水區', '737'],},
          {cells: ['仁德區', '717','善化區', '741'],},
          {cells: ['關廟區', '718','大內區', '742'],},
          {cells: ['龍崎區', '719','山上區', '743'],},
          {cells: ['官田區', '720','新市區', '744'],},
          {cells: ['麻豆區', '721','安定區', '745'],},
          {cells: ['佳里區', '722',' ', ' '],}, ],}));

  }
  else if (city === "高雄市") {
  conv.ask(new Table({
      title: '高雄市/郵遞區號列表',
        columns: [{header: '行政區',align: 'CENTER',},{header: '郵遞區號',align: 'CENTER',},{header: '行政區',align: 'CENTER',},{header: '郵遞區號',align: 'CENTER',}],
           rows: [ {cells: ['新興區', '800','梓官區', '826'],},
          {cells: ['前金區', '801','彌陀區', '827'],},
          {cells: ['苓雅區', '802','永安區', '828'],},
          {cells: ['鹽埕區', '803','湖內區', '829'],},
          {cells: ['鼓山區', '804','鳳山區', '830'],},
          {cells: ['旗津區', '805','大寮區', '831'],},
          {cells: ['前鎮區', '806','林園區', '832'],},
          {cells: ['三民區', '807','鳥松區', '833'],},
          {cells: ['楠梓區', '811','大樹區', '840'],},
          {cells: ['小港區', '812','旗山區', '842'],},
          {cells: ['左營區', '813','美濃區', '843'],},
          {cells: ['仁武區', '814','六龜區', '844'],},
          {cells: ['大社區', '815','內門區', '845'],},
          {cells: ['岡山區', '820','杉林區', '846'],},
          {cells: ['路竹區', '821','甲仙區', '847'],},
          {cells: ['阿蓮區', '822','桃源區', '850'],},
          {cells: ['田寮區', '850','那瑪夏區', '849'],},
          {cells: ['燕巢區', '824','茂林區', '851'],},
          {cells: ['橋頭區', '825','茄萣區', '852'],}, ],}));
  }
  else if (city === "屏東縣") {
  conv.ask(new Table({
      title: '屏東縣/郵遞區號列表',
        columns: [{header: '行政區',align: 'CENTER',},{header: '郵遞區號',align: 'CENTER',},{header: '行政區',align: 'CENTER',},{header: '郵遞區號',align: 'CENTER',},],
           rows: [ {cells: ['屏東市', '900','崁頂鄉', '924'],},
                   {cells: ['三地門鄉', '901','新埤鄉', '925'],},
                   {cells: ['霧臺鄉', '902','南州鄉', '926'],},
                   {cells: ['瑪家鄉', '903','林邊鄉', '927'],},
                   {cells: ['九如鄉', '904','東港鎮', '928'],},
                   {cells: ['里港鄉', '905','琉球鄉', '929'],},
                   {cells: ['高樹鄉', '906','佳冬鄉', '931'],},
                   {cells: ['鹽埔鄉', '907','新園鄉', '932'],},
                   {cells: ['長治鄉', '908','枋寮鄉', '940'],},
                   {cells: ['麟洛鄉', '909','枋山鄉', '941'],},
                   {cells: ['竹田鄉', '911','春日鄉', '942'],},
                   {cells: ['內埔鄉', '912','獅子鄉', '943'],},
                   {cells: ['萬丹鄉', '913','車城鄉', '944'],},
                   {cells: ['潮州鎮', '920','牡丹鄉', '945'],},
                   {cells: ['泰武鄉', '921','恆春鎮', '946'],},
                   {cells: ['來義鄉', '922','滿州鄉', '947'],},
                   {cells: ['萬巒鄉', '950','', ''],}, ],}));  
  }
  else if (city === "花蓮縣") {
  conv.ask(new Table({
      title: '花蓮縣/郵遞區號列表',
        columns: [{header: '行政區',align: 'CENTER',},{header: '郵遞區號',align: 'CENTER',},{header: '行政區',align: 'CENTER',},{header: '郵遞區號',align: 'CENTER',}],
           rows: [ {cells: ['花蓮市', '970','豐濱鄉', '977'],},
                   {cells: ['新城鄉', '971','瑞穗鄉', '978'],},
                   {cells: ['秀林鄉', '972','萬榮鄉', '979'],},
                   {cells: ['吉安鄉', '973','玉里鎮', '981'],},
                   {cells: ['壽豐鄉', '974','卓溪鄉', '982'],},
                   {cells: ['鳳林鎮', '975','富里鄉', '983'],},
                   {cells: ['光復鄉', '976',' ', ' '],}, ],}));    
  }
  else if (city === "臺東縣") {
  conv.ask(new Table({
      title: '臺東縣/郵遞區號列表',
        columns: [{header: '行政區',align: 'CENTER',},{header: '郵遞區號',align: 'CENTER',},{header: '行政區',align: 'CENTER',},{header: '郵遞區號',align: 'CENTER',}],
           rows: [ {cells: ['臺東市', '950','池上鄉', '958'],},
                   {cells: ['綠島鄉', '951','東河鄉', '959'],},
                   {cells: ['蘭嶼鄉', '952','成功鎮', '961'],},
                   {cells: ['延平鄉', '953','長濱鄉', '962'],},
                   {cells: ['卑南鄉', '954','太麻里鄉', '963'],},
                   {cells: ['鹿野鄉', '955','金峰鄉', '964'],},
                   {cells: ['關山鎮', '956','大武鄉', '965'],},
                   {cells: ['海端鄉', '957','達仁鄉', '966'],}, ],}));
  
  }
  else if (city === "澎湖縣") {
 conv.ask(new Table({
    title: '澎湖縣/郵遞區號列表',
	columns: [{header: '行政區',align: 'CENTER',},{header: '郵遞區號',align: 'CENTER',},{header: '行政區',align: 'CENTER',},{header: '郵遞區號',align: 'CENTER',}],
            rows: [{cells: ['馬公市', '880','七美鄉', '883'],},
				   {cells: ['西嶼鄉', '881','白沙鄉', '884'],},
				   {cells: ['望安鄉', '882','湖西鄉', '885'],}, ],}));
  } 
  else if (city === "金門縣") {

  conv.ask(new Table({
    title: '金門縣/郵遞區號列表',
	columns: [{header: '行政區',align: 'CENTER',},{header: '郵遞區號',align: 'CENTER',},{header: '行政區',align: 'CENTER',},{header: '郵遞區號',align: 'CENTER',}],
    rows: [
    {cells: ['金沙鎮', '890','金城鎮', '893'],},
    {cells: ['金湖鎮', '891','烈嶼鄉', '894'],}, 
    {cells: ['金寧鎮', '892','烏坵鄉', '896'],},],}));
  }else if (city === "連江縣") {

  conv.ask(new Table({
    title: '連江縣/郵遞區號列表',
	columns: [{header: '行政區',align: 'CENTER',},{header: '郵遞區號',align: 'CENTER',},{header: '行政區',align: 'CENTER',},{header: '郵遞區號',align: 'CENTER',}],
    rows: [{cells: ['南竿鄉', '209'],},
             {cells: ['北竿鄉', '210'],},
             {cells: ['莒光鄉', '211'],},
             {cells: ['東引鄉', '212'],},],}));
  }
  else if (city === "新竹") {
	conv.contexts.set(SelectContexts.parameter, 1);
	conv.ask(new Carousel({
		items: {
		'新竹縣': {
		  title: '新竹縣',
		  description: 'Hsinchu County',
		},
		'新竹市': {
		  title: '新竹市',
		  description: 'Hsinchu City',
		}},}));  
    }
  else if (city === "嘉義") {
	conv.contexts.set(SelectContexts.parameter, 1);
	conv.ask(new Carousel({
    items: {
    '嘉義縣': {
      title: '嘉義縣',
      description: 'Chiayi County',
    },
	 '嘉義市': {
      title: '嘉義市',
      description: 'Chiayi City',}},}));	  
  }
  else if (city === "南海諸島") {
    conv.ask(new Table({
	  title: option+'/郵遞區號列表',
	  columns: [{header: '行政區',align: 'CENTER',},{header: '郵遞區號',align: 'CENTER',},{header: '行政區',align: 'CENTER',},{header: '郵遞區號',align: 'CENTER',}],
	  rows: [
		{cells: ['東沙', '817','南沙', '819'],},],}));}
 }
 else{
	word1=county_array[parseInt(Math.random()*50)];word2=county_array[parseInt(Math.random()*50)];
	if(conv.input.raw==="語音查詢範例"){
		conv.ask(new SimpleResponse({               
			speech: `<speak><p><s>以下是查詢範例</s><s>你可以試著問我<break time="0.2s"/>${word1}的郵遞區號?<break time="0.2s"/>或<break time="0.2s"/>幫我查詢${word2}</s></p></speak>`,
			text: '試著提問來快速存取縣市列表，\n或點選建議卡片來進行操作!'}));}
	else{
		conv.ask(new SimpleResponse({               
			speech: `<speak><p><s>抱歉，我不懂你的意思</s><s>請試著問我<break time="0.2s"/>${word1}的郵遞區號?<break time="0.2s"/>或<break time="0.2s"/>幫我查詢${word2}</s></p></speak>`,
			text: '試著提問來快速存取縣市列表，\n或點選建議卡片來進行操作!'}));}

	 conv.ask(new BasicCard({  
		title:"語音查詢範例",
		subtitle:"以下是你可以嘗試的指令",
		text:" • *「"+word1+"的郵遞區號?」*  \n • *「幫我查詢"+word2+"」*  \n • *「我想看"+county_array[parseInt(Math.random()*50)]+"的郵遞區號」*  \n • *「幫我找"+county_array[parseInt(Math.random()*50)]+"」*  \n • *「我想看"+county_array[parseInt(Math.random()*50)]+"」*  \n • *「"+county_array[parseInt(Math.random()*50)]+"的列表?」*  \n • *「我要查"+county_array[parseInt(Math.random()*50)]+"」*", 
	}));
	conv.ask(new Suggestions(word1+'的郵遞區號?','幫我查詢'+word2));
 
 }
conv.ask(new Suggestions('🔎依區域查詢','進行五碼查詢','🛰查詢現在位置','👋 掰掰'));

});


app.intent('取得地點權限', (conv,{input}) => {
   conv.data.requestedPermission = 'DEVICE_PRECISE_LOCATION';

    return conv.ask(new Permission({
	context: "在繼續操作前，建議你開啟裝置上的GPS功能來取得精確結果。接著，為了找到現在位置的郵遞區號",
    permissions: conv.data.requestedPermission,}));

conv.ask(new Permission(options));
});

var city="";
app.intent('回傳資訊', (conv, params, permissionGranted)=> {
    if (permissionGranted) {
        const {
            requestedPermission
        } = conv.data;


        if (requestedPermission ==='DEVICE_PRECISE_LOCATION') {
			
			conv.ask(new Suggestions('🛰重新定位'));

            name = conv.device.location.formattedAddress;
			var temp=name.split(',');
            var number=temp.length-1;
			name=temp[number]+temp[number-1];
			name=replaceString(name, ' ', ''); 
			name=name.replace(/[\w|]/g,"");
            name=replaceString(name, '台', '臺'); 

			Zipcode=Zipfinder(name);
 
			if(Zipcode!=="undefined"){
	    	conv.ask(new SimpleResponse({speech:`<speak><p><s>查詢完成，你現在在${name}。郵遞區號是<say-as interpret-as="characters">${Zipcode}</say-as></s></p></speak>`,text:'查詢完成，這是你所在地的郵遞區號。'}));                 
			conv.ask(new BasicCard({   
                title:String(Zipcode),
			    subtitle:name,
                text:'_㊟這是您概略位置的三碼郵遞區號_',   
                 }));
			}
			else{
			conv.ask(new SimpleResponse({speech:`<speak><p><s>查詢發生錯誤，無法獲取郵遞區號</s><s>你可以試著開啟裝置上的居批S功能，然後再試一次。</s></p></speak>`,text:'查詢發生錯誤'}));                 
			conv.ask(new BasicCard({   
                title:'請開啟您裝置上的GPS功能，  \n然後再試一次!',
                text:'_㊟點擊下方的「**重新定位**」來進行操作。_',   
                 }));
			}                       
        }
    } else {
         conv.ask('授權失敗，無法進行操作。');
    }
conv.ask(new Suggestions('回到選單'));
   
});


app.intent('開始進行查詢', (conv) => {

 output=list[parseInt(Math.random()*70)];
 
 conv.contexts.set(FiveContexts.parameter, 1);

  conv.ask(new SimpleResponse({               
              speech: `<speak><p><s>OK，現在你可以進行五碼郵遞區號查詢了。</s><s>舉例來說，你可以輸入${output}，來查詢它的郵遞區號。</s><s>請點擊建議卡片試試看!</s></p></speak>`,
              text: '你可以進行查詢了!\n請輸入要查詢的地址。'}));

   conv.ask(new BasicCard({  
        title: '五碼查詢模式已開啟!',
		subtitle: '《輸入格式》  \n• 縣市名+鄉鎮名  \n• 縣市名+鄉鎮名+道路等資訊',
        text:'㊟這是由「*3+2郵遞區號 查詢*」所提供的查詢服務',
		buttons: new Button({title: '3+2郵遞區號 查詢',url:'https://zip5.5432.tw/',display: 'CROPPED',}),})); 

	conv.ask(new Suggestions(output,city_array[parseInt(Math.random()*370)],list[parseInt(Math.random()*70)],list[parseInt(Math.random()*70)],'關閉此模式'));
});

	const FiveContexts = {
	  parameter: 'five_code',
	}	


app.intent('直接輸入地址或區域', (conv,{input}) => {

conv.noInputs = ["請輸入要查詢的地址來進行操作喔!","抱歉，請問你要查詢的地址是?","抱歉，我想我幫不上忙。下次見!"];	   

if(input==="關閉此模式"){
    conv.ask(new SimpleResponse({speech:`<speak><p><s>好的，您的請求已完成。請點擊建議卡片來選擇查詢方式。</s></p></speak>`,text:'五碼查詢模式已關閉'}));                 
   conv.ask(new BasicCard({  
        image: new Image({url:'https://i.imgur.com/bslu5n3.jpg ',alt:'Pictures',}),
        title: '請選擇要使用的服務類別',
        text:'**_㊟已支援查詢五碼查詢_**',
  })); 
   conv.ask(new Suggestions('🛰查詢現在位置','🔎依區域查詢','進行五碼查詢','語音查詢範例','👋 掰掰'));}

else if((conv.input.raw.indexOf('結束')!==-1||conv.input.raw.indexOf('關閉')!==-1)&&conv.screen!==true){
    conv.ask('希望能幫到一點忙!');
    conv.close('下次見!');
}

else{

 input=replaceString(input, '寶中鄉', '褒忠鄉'); 
 input=replaceString(input, '鬥六市', '斗六市'); 

	
return new Promise(function(resolve,reject){
if(input.length>6){
	getJSON('http://zip5.5432.tw/zip5json.py?adrs='+encodeURIComponent(input))
    .then(function(response) {
      var data=response.zipcode;
		  resolve(data)
		}).catch(function(error) {
		  reject(error)
	});}
	else{
	  var data="";
	      resolve(data)
	}
	}).then(function (origin_data) {
	Zipcode=origin_data;
	conv.contexts.set(FiveContexts.parameter, 1);
	
	if(Zipcode.length!==0){
	new_suggestion=Suggestfinder(input);	
	var output=replaceString(input, '-', '之'); 
    conv.ask(new SimpleResponse({speech:`<speak><p><s>查詢完成，你輸入的${output}。郵遞區號是<break time="0.2s"/><say-as interpret-as="characters">${Zipcode}</say-as></s></p></speak>`,text:'查詢完成'}));                 
    conv.ask(new BasicCard({   
        title: Zipcode, 
		subtitle:input,
        text:'**㊟**您正使用「**五碼查詢模式**」',
        buttons: new Button({title:'在地圖上檢視該地點',url:'https://www.google.com.tw/maps/place/'+input+'/15z/data=!4m5!3m4!',}), 
	})); 
	for(i=0;i<new_suggestion.length;i++){
		conv.ask(new Suggestions(new_suggestion[i]));}
	conv.ask(new Suggestions('關閉此模式'));}
	else{
	 input=replaceString(input, '台北市', '臺北市'); 
	 input=replaceString(input, '台北縣', '新北市'); 
	 input=replaceString(input, '台中市', '臺中市'); 
	 input=replaceString(input, '台中縣', '臺中市'); 
	 input=replaceString(input, '台南縣', '臺南市'); 
	 input=replaceString(input, '台南市', '臺南市'); 
	 input=replaceString(input, '台東縣', '臺東縣'); 
	 input=replaceString(input, '台西鄉', '臺西鄉'); 
	 input=replaceString(input, '高雄縣', '高雄市'); 
	 input=replaceString(input, '桃園縣', '桃園市'); 
 	Zipcode=Zipfinder(input);
    var number=parseInt(Zipcode);
	
	if(isNaN(number)===false){	
    conv.ask(new SimpleResponse({speech:`<speak><p><s>查詢完成，你輸入的${input}。郵遞區號是<break time="0.2s"/><say-as interpret-as="characters">${Zipcode}</say-as></s></p></speak>`,text:'查詢完成'}));                 
    conv.ask(new BasicCard({   
        title: Zipcode, 
		subtitle:input,
        text:'由於您所給予的**資訊不足**，無法查詢完整的五碼格式',
        buttons: new Button({title:'在地圖上檢視該地點',url:'https://www.google.com.tw/maps/place/'+input+'/15z/data=!4m5!3m4!',}), 
	})); 
    conv.ask(new Suggestions(Suggestfinder2(input)));
	}
	else if(county_array.indexOf(Zipcode)!==-1){
	if(conv.screen===true){ 
	conv.ask(new SimpleResponse({speech:`<speak><p><s>您提供的資訊不足或有誤。不過，我找到${Zipcode}的郵遞區號列表。請查看!</s></p></speak>`,text:'您提供的資訊不足或有誤。\n以下是「'+Zipcode+'」的郵遞區號列表。'}));}
	else{
	conv.ask(`<speak><p><s>糟糕，查詢發生錯誤!</s><s>請提供更詳細的地址資訊方能為你查詢喔。</s></p></speak>`);}
 if (Zipcode === "臺北市") {
  conv.ask(new Table({
  title: '臺北市/郵遞區號列表',
  columns: [{header: '行政區',align: 'CENTER',},{header: '郵遞區號',align: 'CENTER',},{header: '行政區',align: 'CENTER',},{header: '郵遞區號',align: 'CENTER',}],
  rows: [
    {cells: ['中正區', '100','信義區', '110'],},
    {cells: ['大同區', '103','士林區', '111'],},
    {cells: ['中山區', '104','北投區', '112'],},
    {cells: ['松山區', '105','內湖區', '114'],},
    {cells: ['大安區', '106','文山區', '115'],},
    {cells: ['萬華區', '108','南港區', '116'],},
  ],
}));
}
  else if (Zipcode === "新北市") {
  conv.ask(new Table({
  title: '新北市/郵遞區號列表',
  columns: [{header: '行政區',align: 'CENTER',},{header: '郵遞區號',align: 'CENTER',},{header: '行政區',align: 'CENTER',},{header: '郵遞區號',align: 'CENTER',}],
  rows: [
    {cells: ['萬里區', '207','土城區', '506'],},
    {cells: ['金山區', '208','三峽區', '507'],},
    {cells: ['板橋區', '220','樹林區', '508'],},
    {cells: ['松山區', '221','鶯歌區', '249'],},
    {cells: ['深坑區', '222','三重區', '241'],},
    {cells: ['石碇區', '250','新莊區', '242'],},
    {cells: ['瑞芳區', '224','泰山區', '243'],},
    {cells: ['平溪區', '226','林口區', '244'],},
    {cells: ['雙溪區', '227','蘆洲區', '247'],},
    {cells: ['貢寮區', '228','五股區', '250'],},
    {cells: ['新店區', '501','八里區', '509'],},
    {cells: ['坪林區', '502','淡水區', '251'],},
    {cells: ['烏來區', '503','三芝區', '252'],},
    {cells: ['永和區', '504','石門區', '253'],},
    {cells: ['中和區', '505',' ', ' '],},],}));
  }
  else if (Zipcode === "基隆市") {
  conv.ask(new Table({
  title: '基隆市/郵遞區號列表',
  columns: [{header: '行政區',align: 'CENTER',},{header: '郵遞區號',align: 'CENTER',},{header: '行政區',align: 'CENTER',},{header: '郵遞區號',align: 'CENTER',}],
  rows: [
    {cells: ['仁愛區', '200','安樂區', '204'],},
    {cells: ['信義區', '201','暖暖區', '205'],},
    {cells: ['中正區', '202','七堵區', '206'],},
    {cells: ['中山區', '203','', ''],}, ],}));
  }
  else if (Zipcode === "宜蘭縣") {
  conv.ask(new Table({
  title: '宜蘭縣/郵遞區號列表',
  columns: [{header: '行政區',align: 'CENTER',},{header: '郵遞區號',align: 'CENTER',},{header: '行政區',align: 'CENTER',},{header: '郵遞區號',align: 'CENTER',}],
  rows: [
    {cells: ['宜蘭市', '260','大同鄉', '267'],},
    {cells: ['頭城鎮', '261','五結鄉', '268'],},
    {cells: ['礁溪鄉', '262','冬山鄉', '269'],},
    {cells: ['壯圍鄉', '263','蘇澳鎮', '270'],},
    {cells: ['員山鄉', '264','南澳鄉', '272'],},
    {cells: ['羅東鎮', '265','釣魚臺列嶼', '290'],},
    {cells: ['三星鄉', '266','', ''],}, ],}));
  }
  else if (Zipcode === "桃園市") {
  conv.ask(new Table({
  title: '桃園市/郵遞區號列表',
  columns: [{header: '行政區',align: 'CENTER',},{header: '郵遞區號',align: 'CENTER',},{header: '行政區',align: 'CENTER',},{header: '郵遞區號',align: 'CENTER',}],
  rows: [ {cells: ['中壢區','320','龜山區', '333'],},
                    {cells: ['平鎮區', '324','八德區', '334'],},
                   {cells: ['龍潭區', '325','大溪區', '335'],},
                   {cells: ['楊梅區', '326','復興區', '336'],},
                   {cells: ['新屋區', '327','大園區', '337'],},
                   {cells: ['觀音區', '328','蘆竹區', '338'],},
                   {cells: ['桃園區', '330',' ', ' '],}, ],}));
  }
  else if (Zipcode === "新竹縣") {
    conv.ask(new Table({
      title: '新竹縣/郵遞區號列表',
    columns: [{header: '行政區',align: 'CENTER',},{header: '郵遞區號',align: 'CENTER',},{header: '行政區',align: 'CENTER',},{header: '郵遞區號',align: 'CENTER',}],
    rows: [ {cells: ['竹北市','302','寶山鄉', '310'],},
          {cells: ['湖口鄉', '303','竹東鎮', '311'],},
          {cells: ['新豐鄉', '304','五峰鄉', '312'],},
          {cells: ['新埔鎮', '305','橫山鄉', '313'],},
          {cells: ['關西鎮', '306','尖石鄉', '314'],},
          {cells: ['芎林鄉', '307','北埔鄉', '315'],},
          {cells: ['峨眉鄉', '308',' ', ' '],}, ],}));
  }
  else if (Zipcode === "新竹市") {
  conv.ask(new Table({
        title: '新竹市/郵遞區號列表',
            columns: [{header: '行政區',align: 'CENTER',},{header: '郵遞區號',align: 'CENTER',},{header: '行政區',align: 'CENTER',},{header: '郵遞區號',align: 'CENTER',}],
        rows: [ {cells: ['東區', '300','北區', '300'],},
                {cells: ['香山區', '300',' ', ' '],}, ],}));
  }
  else if (Zipcode === "苗栗縣") {
  conv.ask(new Table({
        title: '苗栗縣/郵遞區號列表',
            columns: [{header: '行政區',align: 'CENTER',},{header: '郵遞區號',align: 'CENTER',},{header: '行政區',align: 'CENTER',},{header: '郵遞區號',align: 'CENTER',}],
        rows: [ {cells: ['竹南鎮', '350','造橋鄉', '361'],},
          {cells: ['頭份市', '351','頭屋鄉', '362'],},
          {cells: ['三灣鄉', '352','公館鄉', '363'],},
          {cells: ['南庄鄉', '353','大湖鄉', '364'],},
          {cells: ['獅潭鄉', '354','泰安鄉', '365'],},
          {cells: ['後龍鎮', '356','銅鑼鄉', '366'],},
          {cells: ['通霄鎮', '357','三義鄉', '367'],},
          {cells: ['苑裡鎮', '358','西湖鄉', '368'],},
          {cells: ['苗栗市', '360','卓蘭鎮', '369 '],}, ],}));
  }
  else if (Zipcode === "臺中市") {
  conv.ask(new Table({
              title: '臺中市/郵遞區號列表',
                        columns: [{header: '行政區',align: 'CENTER',},{header: '郵遞區號',align: 'CENTER',},{header: '行政區',align: 'CENTER',},{header: '郵遞區號',align: 'CENTER',}],
              rows: [ {cells: ['中  區', '400','東勢區', '423'],},
          {cells: ['東  區', '401','和平區', '424'],},
          {cells: ['南  區', '402','新社區', '426'],},
          {cells: ['西  區', '403','潭子區', '427'],},
          {cells: ['北  區', '404','大雅區', '428'],},
          {cells: ['北屯區', '406','神岡區', '429'],},
          {cells: ['西屯區', '407','大肚區', '432'],},
          {cells: ['南屯區', '408','沙鹿區', '433'],},
          {cells: ['太平區', '411','龍井區', '434'],},
          {cells: ['大里區', '412','梧棲區', '435'],},
          {cells: ['霧峰區', '413','清水區', '436'],},
          {cells: ['烏日區', '414','大甲區', '437'],},
          {cells: ['豐原區', '420','外埔區', '438'],},
          {cells: ['后里區', '421','大安區', '439'],},
          {cells: ['石岡區', '422',' ', ' '],}, ],}));  
  }
  else if (Zipcode === "彰化縣") {
  conv.ask(new Table({
      title: '彰化縣/郵遞區號列表',
        columns: [{header: '行政區',align: 'CENTER',},{header: '郵遞區號',align: 'CENTER',},{header: '行政區',align: 'CENTER',},{header: '郵遞區號',align: 'CENTER',}],
      rows: [ {cells: ['彰化市', '500','溪湖鎮', '514'],},
          {cells: ['芬園鄉', '502','大村鄉', '515'],},
          {cells: ['花壇鄉', '503','埔鹽鄉', '516'],},
          {cells: ['秀水鄉', '504','田中鎮', '520'],},
          {cells: ['鹿港鎮', '505','北斗鎮', '521'],},
          {cells: ['福興鄉', '506','田尾鄉', '522'],},
          {cells: ['線西鄉', '507','埤頭鄉', '550'],},
          {cells: ['和美鎮', '508','溪州鄉', '524'],},
          {cells: ['伸港鄉', '509','竹塘鄉', '525'],},
          {cells: ['員林市', '510','二林鎮', '526'],},
          {cells: ['社頭鄉', '511','大城鄉', '527'],},
          {cells: ['永靖鄉', '512','芳苑鄉', '528'],},
          {cells: ['埔心鄉', '513','二水鄉', '530'],}, ],}));
  
  }
  else if (Zipcode === "南投縣") {
  conv.ask(new Table({
      title: '南投縣/郵遞區號列表',
        columns: [{header: '行政區',align: 'CENTER',},{header: '郵遞區號',align: 'CENTER',},{header: '行政區',align: 'CENTER',},{header: '郵遞區號',align: 'CENTER',}],
           rows: [ {cells: ['南投市', '540','集集鎮', '552'],},
          {cells: ['中寮鄉', '541','水里鄉', '553'],},
          {cells: ['草屯鎮', '542','魚池鄉', '555'],},
          {cells: ['國姓鄉', '544','信義鄉', '556'],},
          {cells: ['埔里鎮', '545','竹山鎮', '557'],},
          {cells: ['仁愛鄉', '546','鹿谷鄉', '558'],},
          {cells: ['名間鄉', '551',' ', ' '],}, ],}));  
  }
  else if (Zipcode === "雲林縣") {
  conv.ask(new Table({
      title: '雲林縣/郵遞區號列表',
        columns: [{header: '行政區',align: 'CENTER',},{header: '郵遞區號',align: 'CENTER',},{header: '行政區',align: 'CENTER',},{header: '郵遞區號',align: 'CENTER',}],
           rows: [ {cells: ['斗南鎮', '630','林內鄉', '643'],},
          {cells: ['大埤鄉', '631','古坑鄉', '646'],},
          {cells: ['虎尾鄉', '632','莿桐鄉', '647'],},
          {cells: ['土庫鎮', '633','西螺鎮', '650'],},
          {cells: ['褒忠鄉', '634','二崙鄉', '649'],},
          {cells: ['東勢鄉', '635','北港鎮', '651'],},
          {cells: ['臺西鄉', '636','水林鄉', '652'],},
          {cells: ['崙背鄉', '637','口湖鄉', '653'],},
          {cells: ['麥寮鄉', '638','四湖鄉', '654'],},
          {cells: ['斗六市', '640','元長鄉', '655'],}, ],}));
  }
  else if (Zipcode === "嘉義縣") {
  conv.ask(new Table({
      title: '嘉義縣/郵遞區號列表',
        columns: [{header: '行政區',align: 'CENTER',},{header: '郵遞區號',align: 'CENTER',},{header: '行政區',align: 'CENTER',},{header: '郵遞區號',align: 'CENTER',}],
           rows: [ {cells: ['番路鄉', '602','朴子市', '613'],},
          {cells: ['梅山鄉', '603','東石鄉', '614'],},
          {cells: ['竹崎鄉', '604','六腳鄉', '615'],},
          {cells: ['阿里山鄉', '605','新港鄉', '616'],},
          {cells: ['中埔鄉', '606','民雄鄉', '621'],},
          {cells: ['大埔鄉', '607','大林鎮', '622'],},
          {cells: ['水上鄉', '608','溪口鄉', '650'],},
          {cells: ['鹿草鄉', '611','義竹鄉', '624'],},
          {cells: ['太保市', '612','布袋鎮', '625'],},],}));  
  }
  else if (Zipcode === "嘉義市") {
  conv.ask(new Table({
      title: '嘉義市/郵遞區號列表',
        columns: [{header: '行政區',align: 'CENTER',},{header: '郵遞區號',align: 'CENTER',},{header: '行政區',align: 'CENTER',},{header: '郵遞區號',align: 'CENTER',}],
           rows: [ {cells: ['東區', '600','西區', '600'],},],}));  
  }
  else if (Zipcode === "臺南市") {
  conv.ask(new Table({
      title: '臺南市/郵遞區號列表',
        columns: [{header: '行政區',align: 'CENTER',},{header: '郵遞區號',align: 'CENTER',},{header: '行政區',align: 'CENTER',},{header: '郵遞區號',align: 'CENTER',}],
           rows: [ {cells: ['中西區', '700','西港區', '750'],},
          {cells: ['東  區', '701','七股區', '724'],},
          {cells: ['南  區', '702','將軍區', '725'],},
          {cells: ['北  區', '704','學甲區', '726'],},
          {cells: ['安平區', '708','北門區', '727'],},
          {cells: ['安南區', '709','新營區', '730'],},
          {cells: ['永康區', '710','後壁區', '731'],},
          {cells: ['歸仁區', '711','白河區', '732'],},
          {cells: ['新化區', '712','東山區', '733'],},
          {cells: ['左鎮區', '713','六甲區', '734'],},
          {cells: ['玉井區', '714','下營區', '735'],},
          {cells: ['楠西區', '715','柳營區', '736'],},
          {cells: ['南化區', '716','鹽水區', '737'],},
          {cells: ['仁德區', '717','善化區', '741'],},
          {cells: ['關廟區', '718','大內區', '742'],},
          {cells: ['龍崎區', '719','山上區', '743'],},
          {cells: ['官田區', '720','新市區', '744'],},
          {cells: ['麻豆區', '721','安定區', '745'],},
          {cells: ['佳里區', '722',' ', ' '],}, ],}));

  }
  else if (Zipcode === "高雄市") {
  conv.ask(new Table({
      title: '高雄市/郵遞區號列表',
        columns: [{header: '行政區',align: 'CENTER',},{header: '郵遞區號',align: 'CENTER',},{header: '行政區',align: 'CENTER',},{header: '郵遞區號',align: 'CENTER',}],
           rows: [ {cells: ['新興區', '800','梓官區', '826'],},
          {cells: ['前金區', '801','彌陀區', '827'],},
          {cells: ['苓雅區', '802','永安區', '828'],},
          {cells: ['鹽埕區', '803','湖內區', '829'],},
          {cells: ['鼓山區', '804','鳳山區', '830'],},
          {cells: ['旗津區', '805','大寮區', '831'],},
          {cells: ['前鎮區', '806','林園區', '832'],},
          {cells: ['三民區', '807','鳥松區', '833'],},
          {cells: ['楠梓區', '811','大樹區', '840'],},
          {cells: ['小港區', '812','旗山區', '842'],},
          {cells: ['左營區', '813','美濃區', '843'],},
          {cells: ['仁武區', '814','六龜區', '844'],},
          {cells: ['大社區', '815','內門區', '845'],},
          {cells: ['岡山區', '820','杉林區', '846'],},
          {cells: ['路竹區', '821','甲仙區', '847'],},
          {cells: ['阿蓮區', '822','桃源區', '850'],},
          {cells: ['田寮區', '850','那瑪夏區', '849'],},
          {cells: ['燕巢區', '824','茂林區', '851'],},
          {cells: ['橋頭區', '825','茄萣區', '852'],}, ],}));
  }
  else if (Zipcode === "屏東縣") {
  conv.ask(new Table({
      title: '屏東縣/郵遞區號列表',
        columns: [{header: '行政區',align: 'CENTER',},{header: '郵遞區號',align: 'CENTER',},{header: '行政區',align: 'CENTER',},{header: '郵遞區號',align: 'CENTER',},],
           rows: [ {cells: ['屏東市', '900','崁頂鄉', '924'],},
                   {cells: ['三地門鄉', '901','新埤鄉', '925'],},
                   {cells: ['霧臺鄉', '902','南州鄉', '926'],},
                   {cells: ['瑪家鄉', '903','林邊鄉', '927'],},
                   {cells: ['九如鄉', '904','東港鎮', '928'],},
                   {cells: ['里港鄉', '905','琉球鄉', '929'],},
                   {cells: ['高樹鄉', '906','佳冬鄉', '931'],},
                   {cells: ['鹽埔鄉', '907','新園鄉', '932'],},
                   {cells: ['長治鄉', '908','枋寮鄉', '940'],},
                   {cells: ['麟洛鄉', '909','枋山鄉', '941'],},
                   {cells: ['竹田鄉', '911','春日鄉', '942'],},
                   {cells: ['內埔鄉', '912','獅子鄉', '943'],},
                   {cells: ['萬丹鄉', '913','車城鄉', '944'],},
                   {cells: ['潮州鎮', '920','牡丹鄉', '945'],},
                   {cells: ['泰武鄉', '921','恆春鎮', '946'],},
                   {cells: ['來義鄉', '922','滿州鄉', '947'],},
                   {cells: ['萬巒鄉', '950','', ''],}, ],}));  
  }
  else if (Zipcode === "花蓮縣") {
  conv.ask(new Table({
      title: '花蓮縣/郵遞區號列表',
        columns: [{header: '行政區',align: 'CENTER',},{header: '郵遞區號',align: 'CENTER',},{header: '行政區',align: 'CENTER',},{header: '郵遞區號',align: 'CENTER',}],
           rows: [ {cells: ['花蓮市', '970','豐濱鄉', '977'],},
                   {cells: ['新城鄉', '971','瑞穗鄉', '978'],},
                   {cells: ['秀林鄉', '972','萬榮鄉', '979'],},
                   {cells: ['吉安鄉', '973','玉里鎮', '981'],},
                   {cells: ['壽豐鄉', '974','卓溪鄉', '982'],},
                   {cells: ['鳳林鎮', '975','富里鄉', '983'],},
                   {cells: ['光復鄉', '976',' ', ' '],}, ],}));    
  }
  else if (Zipcode === "臺東縣") {
  conv.ask(new Table({
      title: '臺東縣/郵遞區號列表',
        columns: [{header: '行政區',align: 'CENTER',},{header: '郵遞區號',align: 'CENTER',},{header: '行政區',align: 'CENTER',},{header: '郵遞區號',align: 'CENTER',}],
           rows: [ {cells: ['臺東市', '950','池上鄉', '958'],},
                   {cells: ['綠島鄉', '951','東河鄉', '959'],},
                   {cells: ['蘭嶼鄉', '952','成功鎮', '961'],},
                   {cells: ['延平鄉', '953','長濱鄉', '962'],},
                   {cells: ['卑南鄉', '954','太麻里鄉', '963'],},
                   {cells: ['鹿野鄉', '955','金峰鄉', '964'],},
                   {cells: ['關山鎮', '956','大武鄉', '965'],},
                   {cells: ['海端鄉', '957','達仁鄉', '966'],}, ],}));
  
  }
  else if (Zipcode === "澎湖縣") {
 conv.ask(new Table({
    title: '澎湖縣/郵遞區號列表',
	columns: [{header: '行政區',align: 'CENTER',},{header: '郵遞區號',align: 'CENTER',},{header: '行政區',align: 'CENTER',},{header: '郵遞區號',align: 'CENTER',}],
            rows: [{cells: ['馬公市', '880','七美鄉', '883'],},
				   {cells: ['西嶼鄉', '881','白沙鄉', '884'],},
				   {cells: ['望安鄉', '882','湖西鄉', '885'],}, ],}));
  } 
  else if (Zipcode === "金門縣") {
  conv.ask(new Table({
    title: '金門縣/郵遞區號列表',
	columns: [{header: '行政區',align: 'CENTER',},{header: '郵遞區號',align: 'CENTER',},{header: '行政區',align: 'CENTER',},{header: '郵遞區號',align: 'CENTER',}],
    rows: [
    {cells: ['金沙鎮', '890','金城鎮', '893'],},
    {cells: ['金湖鎮', '891','烈嶼鄉', '894'],}, 
    {cells: ['金寧鎮', '892','烏坵鄉', '896'],},],}));
  }
  else if (Zipcode === "連江縣") {
  conv.ask(new Table({
    title: '連江縣/郵遞區號列表',
	columns: [{header: '行政區',align: 'CENTER',},{header: '郵遞區號',align: 'CENTER',},{header: '行政區',align: 'CENTER',},{header: '郵遞區號',align: 'CENTER',}],
    rows: [{cells: ['南竿鄉', '209','莒光鄉', '211'],},
             {cells: ['北竿鄉', '210','東引鄉', '212'],},],}));
  }
  else if (Zipcode === "南海諸島") {
    conv.ask(new Table({
	  title: '南海諸島/郵遞區號列表',
	  columns: [{header: '行政區',align: 'CENTER',},{header: '郵遞區號',align: 'CENTER',},{header: '行政區',align: 'CENTER',},{header: '郵遞區號',align: 'CENTER',}],
	  rows: [
		{cells: ['東沙', '817','南沙', '819'],},],}));}

}
	else{
	conv.ask(new SimpleResponse({speech:`<speak><p><s>發生錯誤，請確認輸入是否有誤，然後再試一次!</s></p></speak>`,text:'您提供的資訊似乎有誤，\n請再試一次。'}));                 

    conv.ask(new BasicCard({   
        title: '查詢發生錯誤!', 
        text:' _㊟請確認輸入是否有誤!_',
	})); 
	
	}
	conv.ask(new Suggestions('關閉此模式'));
}
		
	}).catch(function (error) {
	 console.log(error);
	 input=replaceString(input, '台北市', '臺北市'); 
	 input=replaceString(input, '台北縣', '新北市'); 
	 input=replaceString(input, '台中市', '臺中市'); 
	 input=replaceString(input, '台中縣', '臺中市'); 
	 input=replaceString(input, '台南縣', '臺南市'); 
	 input=replaceString(input, '台南市', '臺南市'); 
	 input=replaceString(input, '台東縣', '臺東縣'); 
	 input=replaceString(input, '台西鄉', '臺西鄉'); 
	 input=replaceString(input, '高雄縣', '高雄市'); 
	 input=replaceString(input, '桃園縣', '桃園市'); 
 	Zipcode=Zipfinder(input);
	new_suggestion=Suggestfinder(input);	
    var number=parseInt(Zipcode);
	
	if(isNaN(number)===false){	
    conv.ask(new SimpleResponse({speech:`<speak><p><s>您給予的道路資訊有誤，無法獲取完整的郵遞區號。對應的三碼郵遞區號是<say-as interpret-as="characters">${Zipcode}</say-as></s></p></speak>`,text:'查詢發生部分錯誤，\n僅能獲取三碼的郵遞區號。'}));                 
    conv.ask(new BasicCard({   
        title: Zipcode, 
		subtitle:input,
        text:'您給予的道路資訊**有誤**，無法查詢完整的五碼格式',
        buttons: new Button({title:'在地圖上檢視該地點',url:'https://www.google.com.tw/maps/place/'+input+'/15z/data=!4m5!3m4!',}), 
	})); 
	for(i=0;i<new_suggestion.length;i++){
		conv.ask(new Suggestions(new_suggestion[i]));}

	}else{
    conv.ask(new SimpleResponse({speech:`<speak><p><s>發生錯誤，請提供詳細的地址資訊，然後再試一次!</s></p></speak>`,text:'您提供的資訊似乎不足...'}));                 

    conv.ask(new BasicCard({   
        title: '查詢發生錯誤!', 
        text:' _㊟請確認輸入是否有誤!_',
	})); }
	
	conv.ask(new Suggestions('關閉此模式'));    }
	);
}
});
app.intent('預設罐頭回覆', (conv) => {
	conv.ask(new SimpleResponse({speech: '抱歉，我不懂你的意思。\請試著換個方式問問看。',text: '請試著換個方式問問看，\n或點擊建議卡片來進行操作。',}));
    conv.ask(new BasicCard({  
        title: '請選擇要使用的服務類別',
        text:'**_㊟已支援查詢五碼查詢_**',
  }));
conv.ask(new Suggestions('🛰查詢現在位置','🔎依區域查詢','進行五碼查詢','👋 掰掰'));

});

app.intent('結束對話', (conv) => {
    conv.user.storage = {}; //離開同時清除暫存資料
    conv.ask('希望能幫到一點忙!');
    conv.ask(new SimpleResponse({speech: '下次見',text: '下次見 👋',}));
    conv.close(new BasicCard({   
        title: '感謝您的使用!', 
        text:'如果有任何需要改進的地方，  \n歡迎到簡介頁面評分或給予反饋，謝謝!', 
        buttons: new Button({title: '開啟本程式的商店頁面',url: 'https://assistant.google.com/services/a/uid/000000ccf8e1037c',}),
  })); 

});
exports.zipcode_finder = functions.https.onRequest(app); 
