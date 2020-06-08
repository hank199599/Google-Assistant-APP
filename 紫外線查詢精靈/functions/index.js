'use strict';

// Import the Dialogflow module from the Actions on Google client library.
const {
  dialogflow,
  Permission,
  Suggestions,
  SimpleResponse,
  Button,
  Image,
  BasicCard,Carousel,
  LinkOutSuggestion,
  BrowseCarousel,BrowseCarouselItem,items,Table
} = require('actions-on-google');

// Import the firebase-functions package for deployment.
const functions = require('firebase-functions');
var getJSON = require('get-json')
const replaceString = require('replace-string');
const parseJson = require('parse-json');
const findNearestLocation = require('map-nearest-location');
const app = dialogflow({debug: true});
const admin = require('firebase-admin');

let serviceAccount = require("./config/b1a2b-krmfch-firebase-adminsdk-1tgdm-8bfe91e38e.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://b1a2b-krmfch.firebaseio.com/"
});

const database = admin.database();
let db = admin.firestore();
var data=[];
var number=0; //函數用變數
var picture="";var i=0;
var picurl1="";var picurl2="";var picurl3="";var picurl4="";var picurl5=""
var picurl6="";var picurl7="";var picurl8="";var picurl9="";var picurl10="";
var status1="";var status2="";var status3="";var status4="";var status5="";
var status6="";var status7="";var status8="";var status9="";var status10="";
var UVI1="";var UVI2="";var UVI3="";var UVI4="";var UVI5="";
var UVI6="";var UVI7="";var UVI8="";var UVI9="";var UVI10="";
var station_array=["斗六","日月潭","玉山","成功","朴子","沙鹿","宜蘭","板橋","花蓮","金門","阿里山","南投","屏東","恆春","苗栗","桃園","馬祖","高雄","基隆","淡水","塔塔加","新竹","新屋","新營","嘉義","彰化","臺中","臺北","臺東","臺南","澎湖","鞍部","橋頭","蘭嶼"];
var origin_station_array=["斗六","日月潭","玉山","成功","朴子","沙鹿","宜蘭","板橋","花蓮","金門","阿里山","南投","屏東","恆春","苗栗","桃園","馬祖","高雄","基隆","淡水","塔塔加","新竹","新屋","新營","嘉義","彰化","臺中","臺北","臺東","臺南","澎湖","鞍部","橋頭","蘭嶼"];
var county_array=["南投縣","連江縣","馬祖","南投","雲林縣","雲林","金門縣","金門","苗栗縣","苗栗","高雄市","高雄","嘉義市","花蓮縣","花蓮","嘉義縣","台東縣","臺東縣","台東","臺東","嘉義","基隆市","台北市","台南市","臺南市","台南","臺南","臺北市","台北","臺北","基隆","宜蘭縣","台中市","臺中市","台中","澎湖縣","澎湖","桃園市","桃園","新竹縣","新竹市","新竹","新北市","新北","宜蘭","屏東縣","屏東","彰化縣","彰化"];
var option_array=["Northen","Central","Southen","East","Outlying_island"];
var locations=[{lng: 120.5449944,lat :23.71185278,Sitename: "斗六"},{lng: 120.9080556,lat :23.88138889,Sitename: "日月潭"},{lng: 120.9594444,lat :23.4875,Sitename: "玉山"},{lng: 121.3733333,lat :23.0975,Sitename: "成功"},{lng: 120.2478111,lat :23.46712222,Sitename: "朴子"},{lng: 120.5687944,lat :24.22562778,Sitename: "沙鹿"},{lng: 121.7566667,lat :24.76388889,Sitename: "宜蘭"},{lng: 121.4586667,lat :25.01297222,Sitename: "板橋"},{lng: 121.6133333,lat :23.975,Sitename: "花蓮"},{lng: 118.2891667,lat :24.40722222,Sitename: "金門"},{lng: 120.8013944,lat :23.50856111,Sitename: "阿里山"},{lng: 120.6853056,lat :23.913,Sitename: "南投"},{lng: 120.4880333,lat :22.67308056,Sitename: "屏東"},{lng: 120.7463889,lat :22.00388889,Sitename: "恆春"},{lng: 120.8202,lat :24.56526944,Sitename: "苗栗"},{lng: 121.3049528,lat :24.99472778,Sitename: "桃園"},{lng: 119.9233333,lat :26.16916667,Sitename: "馬祖"},{lng: 120.3158333,lat :22.56611111,Sitename: "高雄"},{lng: 121.7405556,lat :25.13333333,Sitename: "基隆"},{lng: 121.4492389,lat :25.1645,Sitename: "淡水"},{lng: 120.8805722,lat :23.47060833,Sitename: "塔塔加"},{lng: 121.0141667,lat :24.82777778,Sitename: "新竹"},{lng: 121.0475,lat :25.00666667,Sitename: "新屋"},{lng: 120.31725,lat :23.30563333,Sitename: "新營"},{lng: 120.4327778,lat :23.49583333,Sitename: "嘉義"},{lng: 120.5415194,lat :24.066,Sitename: "彰化"},{lng: 120.6841667,lat :24.14583333,Sitename: "臺中"},{lng: 121.5147222,lat :25.03777778,Sitename: "臺北"},{lng: 121.1547222,lat :22.75222222,Sitename: "臺東"},{lng: 120.2047222,lat :22.99333333,Sitename: "臺南"},{lng: 119.5630556,lat :23.56555556,Sitename: "澎湖"},{lng: 121.5297222,lat :25.1825,Sitename: "鞍部"},{lng: 120.3056889,lat :22.75750556,Sitename: "橋頭"},{lng: 121.5583333,lat :22.03694444,Sitename: "蘭嶼"}];
var max_uvi_array=[];
var Status=0;var UVI=0;var Pollutant="";var info="";var info_output="";
var indexnumber="";
var choose_station="";
var report="";
var day_count=0;
var output_title="";
var temp="";var UVI_list_update=[];var UVI_list=[];var SiteName_list=[];
var time=0;var Minutes=0;
var title=""; var data_get="";
var word1="";
var word2="";

function picture_generator(number){
	if(number==0){return "https://dummyimage.com/3504x1933/1e9165/ffffff.png&text=%200%20";}	
	if(number>0&&number<3){return "https://dummyimage.com/3504x1933/1e9165/ffffff.png&text="+number;}
	else if(number>=3&&number<6){return "https://dummyimage.com/3504x1933/fc920b/ffffff.png&text="+number;}
	else if(number>=6&&number<8){return "https://dummyimage.com/3504x1933/ef4621/ffffff.png&text="+number;}
	else if(number>=8&&number<11){return "https://dummyimage.com/3504x1933/b71411/ffffff.png&text="+number;}
    else if(number>=11){return "https://dummyimage.com/3504x1933/4f1770/ffffff.png&text="+number;}
    else{return "https://dummyimage.com/3504x1933/232830/ffffff.png&text=NaN";}
	}
function status_generator(number){
	if(number>=0&&number<3){return "低量級";}
	else if(number>=3&&number<6){return "中量級";}
	else if(number>=6&&number<8){return "高量級";}
	else if(number>=8&&number<11){return "過量級";}
    else if(number>=11){return "危險級";}
    else{return "儀器故障或校驗";}

}

function getDay() {
    var today = new Date();
    var nowTime = today.getTime()+8*3600*1000;
    today.setTime(parseInt(nowTime));
	var oYear=today.getFullYear().toString();
    var oMoth = (today.getMonth() + 1).toString();
    var oDay = today.getDate().toString();
	var oHour= today.getHours().toString();	
	var oMinutes= today.getMinutes().toString();	
    if (oMoth.length <= 1) {oMoth = '0' + oMoth;}
    if (oDay.length <= 1) {oDay = '0' + oDay;}
    if (oHour.length <= 1) {oHour = '0' + oHour;}
	
    return oYear+"/"+oMoth+"/"+oDay+" "+oHour+":00";
}

const SelectContexts = {
	  parameter: 'select ',
	}	

function uvi_report_set(){

   //取得概況報告
	time = new Date();
	Minutes= time.getMinutes();

//取得測站更新時間
	if(Minutes<15){
  data_get=new Promise(function(resolve,reject){
	getJSON('http://opendata.epa.gov.tw/webapi/Data/UV/?$Select=UVI,SiteName&orderby=SiteName&$skip=0&$top=1000&format=json').then(
	function(response) {
	 data=response;
	 resolve(data)
    }).catch(function(error) {
	 var reason=new Error('資料獲取失敗');
     reject(reason)
     });});
	i=0;UVI_list_update=[]; SiteName_list=[];
	
   data_get.then(function (origin_data) {
      for(i=0;i<origin_data.length;i++){
	   UVI_list_update[i]=data[i].UVI;
	   SiteName_list[i]=data[i].SiteName;
	   }
	database.ref('/TWuvi').update({UVI:UVI_list_update});
	database.ref('/TWuvi').update({UVI_Site:SiteName_list});
    UVI_list=UVI_list_update;
	SiteName_list=station_array;
   }).catch(function (error) {
	database.ref('/TWuvi').on('value',e=>{
		UVI_list=e.val().UVI;
		});
   });
  }
}
	 
app.intent('預設歡迎語句', (conv) => {
	time = new Date();
	var hour_now= (time.getHours()+8)%24;	

  	uvi_report_set();
  
	if(conv.screen){
		if (conv.user.last.seen) {
			conv.ask(new SimpleResponse({               
              speech: `<speak><p><s>請問你要查詢哪一個站點呢?</s></p></speak>`,
              text: '歡迎回來!'}));}
        else { conv.ask(new SimpleResponse({               
              speech: `<speak><p><s>歡迎使用紫外線查詢精靈!</s><s>我能提供各縣市的紫外線查詢服務，此外，你能將我加入日常安排快速查詢所需站點。</s></p></speak>`,
              text: '歡迎使用!'}));}

	if(hour_now>=6&&hour_now<=17){
		picture="https://i.imgur.com/0Is452b.jpg";
		title="嘆息西窗過隙駒，微陽初至日光舒"; }
	else{
		picture="https://i.imgur.com/ejlSjF3.png";
		title="明月，明月，胡笳一聲愁絕";}
		
	    conv.ask(new BasicCard({  
        image: new Image({url:picture,alt:'Pictures',}),
        title:title,
		subtitle:"請試著說要查詢的縣市，\n或點擊建議卡片來進行操作。",
		text:"測站資訊發布時間 • "+getDay(), 
        buttons: new Button({title: '中央氣象局',url:'https://www.cwb.gov.tw/V8/C/W/MFC_UVI_Map.html',display: 'CROPPED',}),}));
		conv.ask(new Suggestions('🌎 最近的測站','🔎依區域查詢','語音指令範例','紫外線指數是什麼 ','如何加入日常安排','👋 掰掰'));}
 
 else{
	 	word1=county_array[parseInt(Math.random()*19)];
		word2=county_array[20+parseInt(Math.random()*28)];

	 conv.ask(new SimpleResponse({               
              speech: `<speak><p><s>歡迎使用紫外線查詢精靈</s></p></speak>`,
              text: '歡迎使用'}));
	  conv.ask(new SimpleResponse({               
              speech: `<speak><p><s>請試著問我要查詢的縣市!</s><s>例如<break time="0.5s"/>幫我查${word1}<break time="0.2s"/>或<break time="0.2s"/>${word2}狀況怎樣?</s></p></speak>`,
	  text: '請輕觸下方卡片來選擇查詢區域!'}));

	  conv.noInputs = ["請說出查詢的縣市!、例如、幫我查"+word1,"請說出你要查詢的縣市","抱歉，我想我幫不上忙。"];	   

}


});

app.intent('依區域查詢', (conv) => {

   conv.contexts.set(SelectContexts.parameter, 1);

  if(conv.screen){conv.ask('請輕觸下方卡片來選擇查詢區域');}
  else{conv.ask(new SimpleResponse({               
              speech: `<speak><p><s>請選擇要查詢的區域!</s><s>選項有以下幾個<break time="0.5s"/>北部地區<break time="0.2s"/>中部地區<break time="0.2s"/>南部地區<break time="0.2s"/>東部地區<break time="0.2s"/>離島地區<break time="1s"/>請選擇。</s></p></speak>`,
				text: '請輕觸下方卡片來選擇查詢區域!'}));}
  conv.ask(new Carousel({
	  title: '縣市列表',
	  items: {
		'Northen': {
		  title: '北部地區',
		description: '北北基、桃園市\n新竹縣市',},
		'Central': {
		  title: '中部地區',
		description: '苗栗縣、臺中市\n雲林、彰化、南投',},
		'Southen': {
		  title: '南部地區',
		  description: '嘉義縣市、台南市、\n高雄市、屏東縣',},
		'East': {
		  title: '東部地區',
		  description: '宜蘭、花蓮、台東\n',},
		'Outlying_island': {
		  title: '離島地區',
		  description: '澎湖縣、金門縣、\n連江縣',},
	},}));
 conv.ask(new Suggestions('🌎 最近的測站','語音指令範例','👋 掰掰'));

uvi_report_set()
});

app.intent('縣市查詢結果', (conv, input, option) => {

return new Promise(
function(resolve,reject){
  var temp="";
  database.ref('/TWuvi').on('value',e=>{temp =e.val();	});
  resolve(temp)
  }).then(function (origin_data) {

if(option_array.indexOf(option)!==-1){
   conv.contexts.set(SelectContexts.parameter, 1);
  if (option === "Northen") {
  if(conv.screen){conv.ask('以下是「北部地區」的監測站列表');}
   else{conv.ask(new SimpleResponse({               
              speech: `<speak><p><s>以下是「北部地區」的監測站列表</s><s>選項有以下幾個<break time="0.5s"/>臺北<break time="0.2s"/>鞍部<break time="0.2s"/>基隆<break time="0.2s"/>板橋<break time="0.2s"/>淡水<break time="0.2s"/>桃園<break time="0.2s"/>新屋<break time="0.2s"/>新竹<break time="1s"/>請選擇。</s></p></speak>`,
              text: '以下是「北部地區」的監測站列表'}));}

  UVI1=UVI_list[parseInt(station_array.indexOf('臺北'))];
  UVI2=UVI_list[parseInt(station_array.indexOf('鞍部'))];
  UVI3=UVI_list[parseInt(station_array.indexOf('基隆'))];
  UVI4=UVI_list[parseInt(station_array.indexOf('板橋'))];
  UVI5=UVI_list[parseInt(station_array.indexOf('淡水'))];
  UVI6=UVI_list[parseInt(station_array.indexOf('桃園'))];
  UVI7=UVI_list[parseInt(station_array.indexOf('新屋'))];
  UVI8=UVI_list[parseInt(station_array.indexOf('新竹'))];

  picurl1= picture_generator(parseInt(UVI1));
  picurl2= picture_generator(parseInt(UVI2));
  picurl3= picture_generator(parseInt(UVI3));
  picurl4= picture_generator(parseInt(UVI4));
  picurl5= picture_generator(parseInt(UVI5));
  picurl6= picture_generator(parseInt(UVI6));
  picurl7= picture_generator(parseInt(UVI7));
  picurl8= picture_generator(parseInt(UVI8));
  status1= status_generator(parseInt(UVI1));
  status2= status_generator(parseInt(UVI2));
  status3= status_generator(parseInt(UVI3));
  status4= status_generator(parseInt(UVI4));
  status5= status_generator(parseInt(UVI5));
  status6= status_generator(parseInt(UVI6));
  status7= status_generator(parseInt(UVI7));
  status8= status_generator(parseInt(UVI8));

conv.ask(new Carousel({
    items: {
    '臺北': {
      title: '臺北',
      description: status1,
      image: new Image({url: picurl1,alt: 'Image alternate text',}),},
    '鞍部': {
      title: '鞍部',
      description: status2,
      image: new Image({url: picurl2,alt: 'Image alternate text',}),},
    '基隆': {
      title: '基隆',
      description: status3,
      image: new Image({url: picurl3,alt: 'Image alternate text',}),},
    '板橋': {
      title: '板橋',
      description: status4,
      image: new Image({url: picurl4,alt: 'Image alternate text',}),},
    '淡水': {
      title: '淡水',
      description: status5,
      image: new Image({url: picurl5,alt: 'Image alternate text',}),},
    '桃園': {
      title: '桃園',
      description: status6,
      image: new Image({url: picurl6,alt: 'Image alternate text',}),},
    '新屋': {
      title: '新屋',
      description: status7,
      image: new Image({url: picurl7,alt: 'Image alternate text',}),},
    '新竹': {
      title: '新竹',
      description: status8,
      image: new Image({url: picurl8,alt: 'Image alternate text',}),},

  },
}));  } 
  else if (option === "Central") {
  if(conv.screen){conv.ask('以下是「中部地區」的監測站列表');}
   else{conv.ask(new SimpleResponse({               
              speech: `<speak><p><s>以下是「中部地區」的監測站列表</s><s>選項有以下幾個<break time="0.5s"/>苗栗<break time="0.2s"/>臺中<break time="0.2s"/>沙鹿<break time="0.2s"/>彰化<break time="0.2s"/>日月潭<break time="0.2s"/>玉山<break time="0.2s"/>南投<break time="0.2s"/>斗六<break time="1s"/>請選擇。</s></p></speak>`,
              text: '以下是「中部地區」的監測站列表'}));}

  UVI1=UVI_list[parseInt(station_array.indexOf('苗栗'))];
  UVI2=UVI_list[parseInt(station_array.indexOf('臺中'))];
  UVI3=UVI_list[parseInt(station_array.indexOf('沙鹿'))];
  UVI4=UVI_list[parseInt(station_array.indexOf('彰化'))];
  UVI5=UVI_list[parseInt(station_array.indexOf('日月潭'))];
  UVI6=UVI_list[parseInt(station_array.indexOf('玉山'))];
  UVI7=UVI_list[parseInt(station_array.indexOf('南投'))];
  UVI8=UVI_list[parseInt(station_array.indexOf('斗六'))];

  picurl1= picture_generator(parseInt(UVI1));
  picurl2= picture_generator(parseInt(UVI2));
  picurl3= picture_generator(parseInt(UVI3));
  picurl4= picture_generator(parseInt(UVI4));
  picurl5= picture_generator(parseInt(UVI5));
  picurl6= picture_generator(parseInt(UVI6));
  picurl7= picture_generator(parseInt(UVI7));
  picurl8= picture_generator(parseInt(UVI8));
  status1= status_generator(parseInt(UVI1));
  status2= status_generator(parseInt(UVI2));
  status3= status_generator(parseInt(UVI3));
  status4= status_generator(parseInt(UVI4));
  status5= status_generator(parseInt(UVI5));
  status6= status_generator(parseInt(UVI6));
  status7= status_generator(parseInt(UVI7));
  status8= status_generator(parseInt(UVI8));
  
  
conv.ask(new Carousel({
    items: {
    '苗栗': {
      title: '苗栗',
      description: status1,
      image: new Image({url: picurl1,alt: 'Image alternate text',}),},
    '臺中': {
      title: '臺中',
      description: status2,
      image: new Image({url: picurl2,alt: 'Image alternate text',}),},
    '沙鹿': {
      title: '沙鹿',
      description: status3,
      image: new Image({url: picurl3,alt: 'Image alternate text',}),},
    '彰化': {
      title: '彰化',
      description: status4,
      image: new Image({url: picurl4,alt: 'Image alternate text',}),},
    '日月潭': {
      title: '日月潭',
      description: status5,
      image: new Image({url: picurl5,alt: 'Image alternate text',}),},
    '玉山': {
      title: '玉山',
      description: status6,
      image: new Image({url: picurl6,alt: 'Image alternate text',}),},
    '南投': {
      title: '南投',
      description: status7,
      image: new Image({url: picurl7,alt: 'Image alternate text',}),},
	'斗六': {
      title: '斗六',
      description: status8,
      image: new Image({url: picurl8,alt: 'Image alternate text',}),},
    }}));  
}
  else if (option === "Southen") {
  if(conv.screen){conv.ask('以下是「南部地區」的監測站列表');}
   else{conv.ask(new SimpleResponse({               
              speech: `<speak><p><s>以下是「南部地區」的監測站列表</s><s>選項有以下幾個<break time="0.5s"/>嘉義<break time="0.2s"/>朴子<break time="0.2s"/>阿里山<break time="0.2s"/>塔塔加<break time="0.2s"/>臺南<break time="0.2s"/>新營<break time="0.2s"/>高雄<break time="0.2s"/>橋頭<break time="0.2s"/>屏東<break time="0.2s"/>恆春<break time="1s"/>請選擇。</s></p></speak>`,
              text: '以下是「南部地區」的監測站列表'}));}
			  
  UVI1=UVI_list[parseInt(station_array.indexOf('嘉義'))];
  UVI2=UVI_list[parseInt(station_array.indexOf('朴子'))];
  UVI3=UVI_list[parseInt(station_array.indexOf('阿里山'))];
  UVI4=UVI_list[parseInt(station_array.indexOf('塔塔加'))];
  UVI5=UVI_list[parseInt(station_array.indexOf('臺南'))];
  UVI6=UVI_list[parseInt(station_array.indexOf('新營'))];
  UVI7=UVI_list[parseInt(station_array.indexOf('高雄'))];
  UVI8=UVI_list[parseInt(station_array.indexOf('橋頭'))];
  UVI9=UVI_list[parseInt(station_array.indexOf('屏東'))];
  UVI10=UVI_list[parseInt(station_array.indexOf('恆春'))];

  picurl1= picture_generator(parseInt(UVI1));
  picurl2= picture_generator(parseInt(UVI2));
  picurl3= picture_generator(parseInt(UVI3));
  picurl4= picture_generator(parseInt(UVI4));
  picurl5= picture_generator(parseInt(UVI5));
  picurl6= picture_generator(parseInt(UVI6));
  picurl7= picture_generator(parseInt(UVI7));
  picurl8= picture_generator(parseInt(UVI8));
  picurl9= picture_generator(parseInt(UVI9));
  picurl10= picture_generator(parseInt(UVI10));
  status1= status_generator(parseInt(UVI1));
  status2= status_generator(parseInt(UVI2));
  status3= status_generator(parseInt(UVI3));
  status4= status_generator(parseInt(UVI4));
  status5= status_generator(parseInt(UVI5));
  status6= status_generator(parseInt(UVI6));
  status7= status_generator(parseInt(UVI7));
  status8= status_generator(parseInt(UVI8));
  status9= status_generator(parseInt(UVI9));
  status10= status_generator(parseInt(UVI10));
	    
  conv.ask(new Carousel({
    items: {
    '嘉義': {
      title: '嘉義',
      description: status1,
      image: new Image({url: picurl1,alt: 'Image alternate text',}),},
    '朴子': {
      title: '朴子',
      description: status2,
      image: new Image({url: picurl2,alt: 'Image alternate text',}),},
    '阿里山': {
      title: '阿里山',
      description: status3,
      image: new Image({url: picurl3,alt: 'Image alternate text',}),},
    '塔塔加': {
      title: '塔塔加',
      description: status4,
      image: new Image({url: picurl4,alt: 'Image alternate text',}),},
    '臺南': {
      title: '臺南',
      description: status5,
      image: new Image({url: picurl5,alt: 'Image alternate text',}),},
    '新營': {
      title: '新營',
      description: status6,
      image: new Image({url: picurl6,alt: 'Image alternate text',}),},
    '高雄': {
      title: '高雄',
      description: status7,
      image: new Image({url: picurl7,alt: 'Image alternate text',}),},
    '橋頭': {
      title: '橋頭',
      description: status8,
      image: new Image({url: picurl8,alt: 'Image alternate text',}),},
    '屏東': {
      title: '屏東',
      description: status9,
      image: new Image({url: picurl9,alt: 'Image alternate text',}),},
    '恆春': {
      title: '恆春',
      description: status10,
      image: new Image({url: picurl10,alt: 'Image alternate text',}),},
    }
}));  }
  else if (option === "East") {
  
  if(conv.screen){conv.ask('以下是「東部地區」的監測站列表');
  }else{conv.ask(new SimpleResponse({               
              speech: `<speak><p><s>以下是「東部地區」的監測站列表</s><s>選項有以下幾個<break time="0.5s"/>冬山<break time="0.2s"/>宜蘭<break time="0.2s"/>花蓮<break time="0.2s"/>台東<break time="0.2s"/>關山<break time="1s"/>請選擇。</s></p></speak>`,
  text: '以下是「東部地區」的監測站列表'}));}

  UVI1=UVI_list[parseInt(station_array.indexOf('宜蘭'))];
  UVI2=UVI_list[parseInt(station_array.indexOf('花蓮'))];
  UVI3=UVI_list[parseInt(station_array.indexOf('臺東'))];
  UVI4=UVI_list[parseInt(station_array.indexOf('成功'))];
  UVI5=UVI_list[parseInt(station_array.indexOf('蘭嶼'))];

  picurl1= picture_generator(parseInt(UVI1));
  picurl2= picture_generator(parseInt(UVI2));
  picurl3= picture_generator(parseInt(UVI3));
  picurl4= picture_generator(parseInt(UVI4));
  picurl5= picture_generator(parseInt(UVI5));
  status1= status_generator(parseInt(UVI1));
  status2= status_generator(parseInt(UVI2));
  status3= status_generator(parseInt(UVI3));
  status4= status_generator(parseInt(UVI4));
  status5= status_generator(parseInt(UVI5));

  conv.ask(new Carousel({
    items: {
    '宜蘭': {
      title: '宜蘭',
      description: status1,
      image: new Image({url: picurl1,alt: 'Image alternate text',}),},
    '花蓮': {
      title: '花蓮',
      description: status2,
      image: new Image({url: picurl2,alt: 'Image alternate text',}),},
    '臺東': {
      title: '臺東',
      description: status3,
      image: new Image({url: picurl3,alt: 'Image alternate text',}),},
    '成功': {
      title: '成功',
      description: status4,
      image: new Image({url: picurl4,alt: 'Image alternate text',}),},
    '蘭嶼': {
      title: '蘭嶼',
      description: status5,
      image: new Image({url: picurl5,alt: 'Image alternate text',}),},
  },
}));  }
  else if (option === "Outlying_island") {
    if(conv.screen){conv.ask('以下是「離島地區」的監測站列表');}
   else{conv.ask(new SimpleResponse({               
              speech: `<speak><p><s>以下是「離島地區」的監測站列表</s><s>選項有以下幾個<break time="0.5s"/>金門<break time="0.2s"/>馬祖<break time="0.2s"/>馬公<break time="1s"/>請選擇。</s></p></speak>`,
              text: '以下是「離島地區」的監測站列表'}));}
			  
  UVI1=UVI_list[parseInt(station_array.indexOf('金門'))];
  UVI2=UVI_list[parseInt(station_array.indexOf('馬祖'))];
  UVI3=UVI_list[parseInt(station_array.indexOf('澎湖'))];

  picurl1= picture_generator(parseInt(UVI1));
  picurl2= picture_generator(parseInt(UVI2));
  picurl3= picture_generator(parseInt(UVI3));
  status1= status_generator(parseInt(UVI1));
  status2= status_generator(parseInt(UVI2));
  status3= status_generator(parseInt(UVI3));

  conv.ask(new Carousel({
    items: {
    '金門': {
      title: '金門',
      description: status1,
      image: new Image({url: picurl1,alt: 'Image alternate text',}),},
    '馬祖': {
      title: '馬祖',
      description: status2,
      image: new Image({url: picurl2,alt: 'Image alternate text',}),},
    '澎湖': {
      title: '澎湖',
      description: status3,
      image: new Image({url: picurl3,alt: 'Image alternate text',}),},
  }
}));  }
    else{
    conv.ask(new SimpleResponse({               
              speech: `<speak><p><s>糟糕，查詢似乎發生錯誤。請稍後再試。</s></p></speak>`,
	text: '發生錯誤，請稍後再試一次。'}));
		   conv.close(new BasicCard({  
				image: new Image({url:"https://dummyimage.com/1037x539/ef2121/ffffff.png&text=錯誤",alt:'Pictures',}),
				title:'數據加載發生問題',
				subtitle:'請過一段時間後再回來查看', display: 'CROPPED',
  })); 
 }
}else if(station_array.indexOf(option)!==-1){
	
	indexnumber=station_array.indexOf(option); //取得監測站對應的編號

	database.ref('/TWuvi').on('value',e=>{
		UVI_list=e.val().UVI;
		});
  
    UVI=parseFloat(UVI_list[parseInt(indexnumber)]);
    Status= status_generator(UVI);	
	
	if(Status!=="儀器故障或校驗"){

	if(UVI===0){picture= "https://dummyimage.com/1037x539/1e9165/ffffff.png&text=%200%20";}	
	else if(UVI>0&&UVI<3){picture= "https://dummyimage.com/1037x539/1e9165/ffffff.png&text="+UVI;}
	else if(UVI>=3&&UVI<6){picture= "https://dummyimage.com/1037x539/fc920b/ffffff.png&text="+UVI;}
	else if(UVI>=6&&UVI<8){picture= "https://dummyimage.com/1037x539/ef4621/ffffff.png&text="+UVI;}
	else if(UVI>=8&&UVI<11){picture= "https://dummyimage.com/1037x539/b71411/ffffff.png&text="+UVI;}
    else {picture= "https://dummyimage.com/1037x539/4f1770/ffffff.png&text="+UVI;}

	if(UVI>=0&&UVI<3){info= "基本上不需要保護措施，可以安心外出，但請留意瞬間的紫外線。";}
	else if(UVI>=3&&UVI<6){info= "外出時，盡量待在陰涼處。並卓長袖上衣、帽子、陽傘、防護霜、太陽眼鏡作為保護。";}
	else if(UVI>=6&&UVI<8){info= "暴露在陽光下30分鐘會造成曬傷。外出時，盡量待在陰涼處。並卓長袖上衣、帽子、陽傘、防護霜、太陽眼鏡作為保護。";}
	else if(UVI>=8&&UVI<11){info= "暴露在陽光下20分鐘會造成曬傷，早上十點至下午兩點最好不要在烈日下活動。並使用帽子、陽傘、防護霜、太陽眼鏡作為保護。"}
	else {info= "健康威脅達到緊急，暴露在陽光下15分鐘會造成曬傷，早上十點至下午兩點最好不要在烈日下活動。並使用帽子、陽傘、防護霜、太陽眼鏡作為保護。";}
				
	if(UVI>=0&&UVI<3){info_output= "可以安心外出，但請留意瞬間的紫外線。";}
	else if(UVI>=3&&UVI<6){info_output= "1.防護措施：帽子/陽傘+防曬液+太陽眼鏡。  \n2.儘量待在陰涼處";}
	else if(UVI>=6&&UVI<8){info_output= "1.曬傷時間：30分鐘內  \n2.防護措施：帽子/陽傘+防曬液+太陽眼鏡。  \n3.儘量待在陰涼處。";}
	else if(UVI>=8&&UVI<11){info_output= "1.曬傷時間：20分鐘內  \n2.防護措施：	帽子/陽傘+防曬液+太陽眼鏡+長袖衣物。  \n3.儘量待在陰涼處  \n4.10至14時最好不在烈日下活動"}
	else {info_output= "1.曬傷時間：15分鐘內  \n2.防護措施：帽子/陽傘+防曬液+太陽眼鏡+長袖衣物。  \n3.儘量待在陰涼處  \n4.10至14時最好不在烈日下活動";}
	
		conv.ask(new SimpleResponse({               
              speech: `<speak><p><s>根據最新資料顯示，${option}監測站的紫外線指數為${UVI}</s><s>${info}</s></p></speak>`,
	          text: '以下為該監測站的詳細資訊'}));
    
		if(conv.screen){
			conv.ask(new BasicCard({  
					image: new Image({url:picture,alt:'Pictures',}),
					title:'「'+option+'」的紫外線為'+Status,display: 'CROPPED',
					text:info_output+'  \n  \n**測站資訊發布時間** • '+getDay(),})); 
		    conv.ask(new Suggestions('把它加入日常安排'));
		}else{conv.close(`<speak><p><s>歡迎你隨時回來查詢，下次見</s></p></speak>`);}
    
  }else{
    conv.ask(new SimpleResponse({               
              speech: `<speak><p><s>由於${option}監測站正處於維修狀態或數據不足。我無法提供你最新資訊。</s></p></speak>`,
	text: '以下為該監測站的詳細資訊'}));
		if(conv.screen){
			conv.ask(new BasicCard({  
					image: new Image({url:"https://dummyimage.com/1037x539/232830/ffffff.png&text=NaN",alt:'Pictures',}),
					title:'「'+option+'」儀器故障或校驗',
					text:'設備維護、儀器校正、儀器異常、傳輸異常、電力異常 \n或儀器故障或校驗等需查修維護情形，以致資料暫時中斷服務。  \n  \n**測站資訊發布時間** • '+getDay(), 
					display: 'CROPPED',
     })); 
	 	conv.ask(new Suggestions('把它加入日常安排'));
		}else{conv.close(`<speak><p><s>歡迎你隨時回來查詢，下次見</s></p></speak>`);}

 }
}else if(origin_station_array.indexOf(option)!==-1){

   conv.ask(new SimpleResponse({               
              speech: `<speak><p><s>由於${option}監測站正處於維修狀態或數據不足。我無法提供你最新資訊。</s></p></speak>`,
	text: '以下為該監測站的詳細資訊'}));
			conv.ask(new BasicCard({  
					image: new Image({url:"https://dummyimage.com/1037x539/232830/ffffff.png&text=NaN",alt:'Pictures',}),
					title:'「'+option+'」儀器故障或校驗',
					text:'設備維護、儀器校正、儀器異常、傳輸異常、電力異常 \n或儀器故障或校驗等需查修維護情形，以致資料暫時中斷服務。  \n  \n**測站資訊發布時間** • '+getDay(), 
					display: 'CROPPED',
     })); 
	 	conv.ask(new Suggestions('把它加入日常安排'));

}else{
  option="undefined";
   conv.contexts.set(SelectContexts.parameter, 1);
  if(conv.screen){conv.ask('請輕觸下方卡片來選擇查詢區域');}
  else{conv.ask(new SimpleResponse({               
              speech: `<speak><p><s>抱歉，我不懂你的意思!請重新查詢</s><s>選項有以下幾個<break time="0.5s"/>北部地區<break time="0.2s"/>中部地區<break time="0.2s"/>南部地區<break time="0.2s"/>東部地區<break time="0.2s"/>離島地區<break time="1s"/>請選擇。</s></p></speak>`,
	  text: '我不懂你的意思，\n請輕觸下方卡片來選擇查詢區域!'}));}

  conv.ask(new Carousel({
  title: 'Carousel Title',
  items: {
    'Northen': {
      title: '北部地區',
	description: '北北基、桃園市\n新竹縣市',},
    'Central': {
      title: '中部地區',
	description: '苗栗縣、臺中市\n雲林、彰化、南投',},
    'Southen': {
      title: '南部地區',
	  description: '嘉義縣市、台南市、\n高雄市、屏東縣',},
	'East': {
      title: '東部地區',
	  description: '宜蘭、花蓮、台東\n',},
		'Outlying_island': {
      title: '離島地區',
	  description: '澎湖縣、金門縣、\n連江縣',}
},}));
conv.ask(new Suggestions('🌎 最近的測站','語音指令範例'));
 }
 if(conv.screen){
	 
	 if(option!=="undefined"){conv.ask(new Suggestions('🌎 最近的測站','回主頁面'));}
	 conv.ask(new Suggestions('👋 掰掰'));
     conv.user.storage.choose_station=option;}

	 conv.data.UVI_list= UVI_list;
	 
});

var county_array=["南投縣","連江縣","馬祖","南投","雲林縣","雲林","金門縣","金門","苗栗縣","苗栗","高雄市","高雄","嘉義市","花蓮縣","花蓮","嘉義縣","台東縣","臺東縣","台東","臺東","嘉義","基隆市","台北市","台南市","臺南市","台南","臺南","臺北市","台北","臺北","基隆","宜蘭縣","台中市","臺中市","台中","澎湖縣","澎湖","桃園市","桃園","新竹縣","新竹市","新竹","新北市","新北","宜蘭","屏東縣","屏東","彰化縣","彰化"];
var word1="";var word2="";var word3="";

app.intent('Default Fallback Intent', (conv) => {
	word1=county_array[parseInt(Math.random()*19)];
	word2=county_array[20+parseInt(Math.random()*28)];
	
if(conv.input.type==="VOICE"){ //如果輸入是語音，則顯示錯誤處理方法
	conv.ask(new SimpleResponse({               
              speech: `<speak><p><s>抱歉，我不懂你的意思</s><s>請試著問我<break time="0.2s"/>${word1}紫外線指數為何?<break time="0.2s"/>或<break time="0.2s"/>幫我查詢${word2}</s></p></speak>`,
			  text: '試著提問來快速存取縣市列表，\n或點選建議卡片來進行操作!'}));
    if(conv.screen){
	 conv.ask(new BasicCard({  
		title:"語音查詢範例",
		subtitle:"以下是你可以嘗試的指令",
		text:" • *「"+word1+"紫外線指數為何?」*  \n • *「幫我查詢"+word2+"」*  \n • *「我想知道"+county_array[parseInt(Math.random()*48)]+"狀況怎樣」*  \n • *「幫我找"+county_array[parseInt(Math.random()*48)]+"」*  \n • *「我想看"+county_array[parseInt(Math.random()*48)]+"」*  \n • *「"+county_array[parseInt(Math.random()*48)]+"狀況好嗎?」*  \n • *「我要查"+county_array[parseInt(Math.random()*48)]+"」*", 
	}));
	conv.ask(new Suggestions(word1+'紫外線指數為何?','幫我查詢'+word2));
	}
	else{ 
	  conv.noInputs = [`<speak><p><s>請說出查詢的縣市!</s><s>例如<break time="0.5s"/>幫我查${word1}</s></p></speak>`,"請說出你要查詢的縣市","抱歉，我想我幫不上忙。"];	   }
 }else{
	 conv.ask('抱歉，我不懂你的意思，\n請點選建議卡片來進行操作。');
 }
	
conv.ask(new Suggestions('🌎 最近的測站','🔎依區域查詢','👋 掰掰'));
 }).catch(function (error) {
	console.log(error);
	
	conv.ask(new SimpleResponse({               
			speech: `<speak><p><s>糟糕，查詢似乎發生錯誤。請稍後再試。</s></p></speak>`,
			text: '發生錯誤，請稍後再試一次。'}));
	conv.ask(new BasicCard({  
			image: new Image({url:"https://dummyimage.com/1037x539/ef2121/ffffff.png&text=錯誤",alt:'Pictures',}),
			title:'數據加載發生問題',
			subtitle:'請過一段時間後再回來查看', display: 'CROPPED',
	  })); 
	});
conv.ask(new Suggestions('🌎 最近的測站','🔎依區域查詢','👋 掰掰'));
	
});

app.intent('語音指令範例', (conv) => {
	word1=county_array[parseInt(Math.random()*19)];
	word2=county_array[20+parseInt(Math.random()*28)];
	word3=county_array[parseInt(Math.random()*48)];

	conv.ask(new SimpleResponse({               
              speech: `<speak><p><s>在任意畫面中，你隨時都能快速查詢縣市列表</s><s>你可以試著問<break time="0.2s"/>${word1}紫外線指數為何?<break time="0.2s"/>或<break time="0.2s"/>幫我查詢${word2}</s></p></speak>`,
			  text: '試著提問來快速存取縣市列表，\n以下是你可以嘗試的詢問方式!'}));
	 conv.ask(new BasicCard({  
		title:"語音查詢範例",
		subtitle:"以下是你可以嘗試的指令",
		text:" • *「"+word1+"紫外線指數為何?」*  \n • *「幫我查詢"+word2+"」*  \n • *「我想知道"+word3+"狀況怎樣」*  \n • *「幫我找"+county_array[parseInt(Math.random()*48)]+"」*  \n • *「我想看"+county_array[parseInt(Math.random()*48)]+"」*  \n • *「"+county_array[parseInt(Math.random()*48)]+"狀況好嗎?」*  \n • *「我要查"+county_array[parseInt(Math.random()*48)]+"」*", 
	}));
	conv.ask(new Suggestions(word1+'紫外線指數為何?','幫我查詢'+word2,'我想知道'+word3+'狀況怎樣','🌎 最近的測站','🔎依區域查詢','👋 掰掰'));

});


app.intent('直接查詢', (conv,{station}) => {

return new Promise(
function(resolve,reject){
  var temp="";
  database.ref('/TWuvi').on('value',e=>{temp =e.val();	});
  resolve(temp)
  }).then(function (origin_data) {
	  
	   UVI_list=origin_data.UVI;
	   station_array=origin_data.UVI_Site;	
	
	indexnumber=station_array.indexOf(station); //取得監測站對應的編號
	
  if(indexnumber===-1){
    conv.ask(new SimpleResponse({               
              speech: `<speak><p><s>抱歉，您所查詢的監測站似乎不存在，我無法提供你最新資訊。</s></p></speak>`,
			  text: '找不到你指定的站點'}));
   conv.ask(new BasicCard({  
        image: new Image({url:"https://dummyimage.com/1037x539/232830/ffffff.png&text=NaN",alt:'Pictures',}),
        title:'找不到您指定的測站名稱',
		subtitle:'請透過選單尋找現在可查詢的測站', display: 'CROPPED',
  })); 
conv.ask(new Suggestions('回主頁面','👋 掰掰'));

 } else{
	UVI=parseFloat(UVI_list[indexnumber]);
    Status= status_generator(UVI);	
	
	if(Status!=="儀器故障或校驗"){
	if(UVI===0){picture= "https://dummyimage.com/1037x539/1e9165/ffffff.png&text=%200%20";}	
	else if(UVI>0&&UVI<3){picture= "https://dummyimage.com/1037x539/1e9165/ffffff.png&text="+UVI;}
	else if(UVI>=3&&UVI<6){picture= "https://dummyimage.com/1037x539/fc920b/ffffff.png&text="+UVI;}
	else if(UVI>=6&&UVI<8){picture= "https://dummyimage.com/1037x539/ef4621/ffffff.png&text="+UVI;}
	else if(UVI>=8&&UVI<11){picture= "https://dummyimage.com/1037x539/b71411/ffffff.png&text="+UVI;}
    else {picture= "https://dummyimage.com/1037x539/4f1770/ffffff.png&text="+UVI;}

	if(UVI>=0&&UVI<3){info= "基本上不需要保護措施，可以安心外出，但請留意瞬間的紫外線。";}
	else if(UVI>=3&&UVI<6){info= "外出時，盡量待在陰涼處。並卓長袖上衣、帽子、陽傘、防護霜、太陽眼鏡作為保護。";}
	else if(UVI>=6&&UVI<8){info= "暴露在陽光下30分鐘會造成曬傷。外出時，盡量待在陰涼處。並卓長袖上衣、帽子、陽傘、防護霜、太陽眼鏡作為保護。";}
	else if(UVI>=8&&UVI<11){info= "暴露在陽光下20分鐘會造成曬傷，早上十點至下午兩點最好不要在烈日下活動。並使用帽子、陽傘、防護霜、太陽眼鏡作為保護。"}
	else {info= "健康威脅達到緊急，暴露在陽光下15分鐘會造成曬傷，早上十點至下午兩點最好不要在烈日下活動。並使用帽子、陽傘、防護霜、太陽眼鏡作為保護。";}
				
	if(UVI>=0&&UVI<3){info_output= "可以安心外出，但請留意瞬間的紫外線。";}
	else if(UVI>=3&&UVI<6){info_output= "1.防護措施：帽子/陽傘+防曬液+太陽眼鏡。  \n2.儘量待在陰涼處";}
	else if(UVI>=6&&UVI<8){info_output= "1.曬傷時間：30分鐘內  \n2.防護措施：帽子/陽傘+防曬液+太陽眼鏡。  \n3.儘量待在陰涼處。";}
	else if(UVI>=8&&UVI<11){info_output= "1.曬傷時間：20分鐘內  \n2.防護措施：	帽子/陽傘+防曬液+太陽眼鏡+長袖衣物。  \n3.儘量待在陰涼處  \n4.10至14時最好不在烈日下活動"}
	else {info_output= "1.曬傷時間：15分鐘內  \n2.防護措施：帽子/陽傘+防曬液+太陽眼鏡+長袖衣物。  \n3.儘量待在陰涼處  \n4.10至14時最好不在烈日下活動";}

   conv.ask(new SimpleResponse({               
              speech: `<speak><p><s>根據最新資料顯示，${station}監測站的紫外線指數為${UVI}</s><s>${info}</s></p></speak>`,
	text: '以下為該監測站的詳細資訊'}));
   conv.close(new BasicCard({  
        image: new Image({url:picture,alt:'Pictures',}),
        title:'「'+station+'」的紫外線為'+Status, display: 'CROPPED',
		text:info_output+'  \n  \n**測站資訊發布時間** • '+getDay(),})); 
	}
	else{
    conv.ask(new SimpleResponse({               
              speech: `<speak><p><s>由於${station}監測站數據不足或處於維修狀態，我無法提供你最新資訊。</s></p></speak>`,
	text: '以下為該監測站的詳細資訊'}));
		   conv.close(new BasicCard({  
        image: new Image({url:"https://dummyimage.com/1037x539/232830/ffffff.png&text=NaN",alt:'Pictures',}),
        title:'儀器故障或校驗',
					title:'「'+station+'」儀器故障或校驗',
					text:'設備維護、儀器校正、儀器異常、傳輸異常、電力異常 \n或儀器故障或校驗等需查修維護情形，以致資料暫時中斷服務。  \n  \n**測站資訊發布時間** • '+getDay(), 
				    display: 'CROPPED',})); 
	}
  }
 }).catch(function (error) {
	console.log(error);
	
	conv.ask(new SimpleResponse({               
			speech: `<speak><p><s>糟糕，查詢似乎發生錯誤。請稍後再試。</s></p></speak>`,
			text: '發生錯誤，請稍後再試一次。'}));
	conv.close(new BasicCard({  
			image: new Image({url:"https://dummyimage.com/1037x539/ef2121/ffffff.png&text=錯誤",alt:'Pictures',}),
			title:'數據加載發生問題',
			subtitle:'請過一段時間後再回來查看', display: 'CROPPED',
	  })); 
	});
});
app.intent('日常安排教學', (conv) => {
	
	choose_station=conv.user.storage.choose_station;
	
	if(station_array.indexOf(choose_station)===-1){choose_station=station_array[parseInt(Math.random()*34)];}
    conv.ask(new SimpleResponse({               
              speech: `<speak><p><s>透過加入日常安排，你可以快速存取要查詢的站點。</s><s>舉例來說，如果你把${choose_station}加入日常安排。你即可隨時呼叫我查詢該站點的最新紫外線指數!</s><s>以下為詳細說明</s></p></speak>`,
	text: '以下為詳細說明。'}));

    conv.ask(new BasicCard({  
        image: new Image({url:"https://i.imgur.com/82c8u4T.png",alt:'Pictures',}),
        title:'將「'+choose_station+'」加入日常安排', display: 'CROPPED',
		subtitle:'1.點擊畫面右上方大頭貼 > 點擊[設定]\n2.切換到[Google助理]分頁 > 點擊[日常安排]\n3.點擊[新增日常安排]\n4.「新增指令(必填)」輸入「紫外線指數」\n5.「新增動作」輸入\n「叫紫外線精靈查詢'+choose_station+'站」\n6.輸入完成後點擊「儲存」\n7.現在，你可以透過說出或輸入「紫外線指數」來快速查詢'+choose_station+'的UVI指數!',})); 

		conv.ask(new Suggestions('🌎 最近的測站','🔎依區域查詢','👋 掰掰'));

});

app.intent('紫外線是甚麼', (conv,{Wind_direction}) => {


	conv.ask(new SimpleResponse({               
              speech: `<speak><p><s>以下是氣象局對紫外線指數的說明</s><break time="1s"/><s>紫外線指數是指到達地面單位面積的紫外線輻射量強度的數值，紫外線指數越大，代表一定時間中累積的紫外線輻射強度越強。依據世界衛生組織相關規範，針對紫外線指數分級如下表：其中指數小於等於2時為低量級、指數3～5為中量級，指數6～7為高量級，指數8～10為過量級，指數大於等於11則為危險級。</s></p></speak>`,
			  text: '以下為詳細說明。'}));
	    conv.ask(new BasicCard({  
        image: new Image({url:"https://i.imgur.com/aldRVA5.png",alt:'Pictures',}),
        title:"紫外線指數",
		subtitle:'到達地面單位面積的紫外線輻射量強度的數值',
		text:" • 指數≦2:低量級  \n • 3~5:中量級  \n • 6~7:高量級  \n • 8~10:過量級  \n • 指數≧11:危險級  \n  \nⒸ 圖文資訊來自 交通部中央氣象局"})); 
    conv.ask(new Suggestions('🌎 最近的測站','🔎依區域查詢','👋 掰掰'));


});

app.intent('取得地點權限', (conv) => {
 conv.data.requestedPermission = 'DEVICE_PRECISE_LOCATION';

    return conv.ask(new Permission({
    context: "在繼續操作前，建議你開啟裝置上的GPS功能來取得精確結果。接著，為了找到最近的測站位置",
    permissions: conv.data.requestedPermission,}));

conv.ask(new Permission(options));
  
});

var sitename="";

app.intent('回傳資訊', (conv, params, permissionGranted)=> {

return new Promise(
function(resolve,reject){
  var temp="";
  database.ref('/TWuvi').on('value',e=>{temp =e.val();	});
  resolve(temp)
  }).then(function (origin_data) {
	  
	   UVI_list=origin_data.UVI;
	   station_array=origin_data.UVI_Site;	
    if (permissionGranted) {
        const {
            requestedPermission
        } = conv.data;
		
        if (requestedPermission === 'DEVICE_PRECISE_LOCATION') {
 
            const coordinates = conv.device.location.coordinates;
            // const city=conv.device.location.city;
 
			conv.ask(new Suggestions('重新定位'));
			
            if (coordinates) {
				const myLocation = {
				   lat: coordinates.latitude,
				   lng: coordinates.longitude
				 };	
				sitename=(findNearestLocation(myLocation, locations)).location.Sitename; //透過模組找到最近的測站				
						
				conv.ask(new SimpleResponse({speech:`<speak><p><s>查詢完成!</s><s>距離你最近的測站是<break time="0.2s"/>${sitename}。</s></p></speak>`,text:'最近的測站是「'+sitename+'」!'}));                 
				
			   if((typeof UVI_list[0]==="undefined")!==true){
				indexnumber=station_array.indexOf(sitename); //取得監測站對應的編號

				UVI=parseFloat(UVI_list[parseInt(indexnumber)]);
				Status= status_generator(UVI);	
				console.log(Status);
				if(Status!=="儀器故障或校驗"){
					
				if(UVI===0){picture= "https://dummyimage.com/1037x539/1e9165/ffffff.png&text=%200%20";}	
				else if(UVI>0&&UVI<3){picture= "https://dummyimage.com/1037x539/1e9165/ffffff.png&text="+UVI;}
				else if(UVI>=3&&UVI<6){picture= "https://dummyimage.com/1037x539/fc920b/ffffff.png&text="+UVI;}
				else if(UVI>=6&&UVI<8){picture= "https://dummyimage.com/1037x539/ef4621/ffffff.png&text="+UVI;}
				else if(UVI>=8&&UVI<11){picture= "https://dummyimage.com/1037x539/b71411/ffffff.png&text="+UVI;}
				else {picture= "https://dummyimage.com/1037x539/4f1770/ffffff.png&text="+UVI;}

				if(UVI>=0&&UVI<3){info= "基本上不需要保護措施，可以安心外出，但請留意瞬間的紫外線。";}
				else if(UVI>=3&&UVI<6){info= "外出時，盡量待在陰涼處。並卓長袖上衣、帽子、陽傘、防護霜、太陽眼鏡作為保護。";}
				else if(UVI>=6&&UVI<8){info= "暴露在陽光下30分鐘會造成曬傷。外出時，盡量待在陰涼處。並卓長袖上衣、帽子、陽傘、防護霜、太陽眼鏡作為保護。";}
				else if(UVI>=8&&UVI<11){info= "暴露在陽光下20分鐘會造成曬傷，早上十點至下午兩點最好不要在烈日下活動。並使用帽子、陽傘、防護霜、太陽眼鏡作為保護。"}
				else {info= "健康威脅達到緊急，暴露在陽光下15分鐘會造成曬傷，早上十點至下午兩點最好不要在烈日下活動。並使用帽子、陽傘、防護霜、太陽眼鏡作為保護。";}
				
				if(UVI>=0&&UVI<3){info_output= "可以安心外出，但請留意瞬間的紫外線。";}
				else if(UVI>=3&&UVI<6){info_output= "1.防護措施：帽子/陽傘+防曬液+太陽眼鏡。  \n2.儘量待在陰涼處";}
				else if(UVI>=6&&UVI<8){info_output= "1.曬傷時間：30分鐘內  \n2.防護措施：帽子/陽傘+防曬液+太陽眼鏡。  \n3.儘量待在陰涼處。";}
				else if(UVI>=8&&UVI<11){info_output= "1.曬傷時間：20分鐘內  \n2.防護措施：	帽子/陽傘+防曬液+太陽眼鏡+長袖衣物。  \n3.儘量待在陰涼處  \n4.10至14時最好不在烈日下活動"}
				else {info_output= "1.曬傷時間：15分鐘內  \n2.防護措施：帽子/陽傘+防曬液+太陽眼鏡+長袖衣物。  \n3.儘量待在陰涼處  \n4.10至14時最好不在烈日下活動";}

			   conv.ask(new SimpleResponse({               
						  speech: `<speak><p><s>根據最新資料顯示，${sitename}監測站的紫外線指數為${UVI}</s><s>${info}</s></p></speak>`,
				text: '以下為該監測站的詳細資訊'}));
			   conv.ask(new BasicCard({  
					image: new Image({url:picture,alt:'Pictures',}),
					title:'「'+sitename+'」的紫外線為'+Status, display: 'CROPPED',
					text:info_output+'  \n  \n**測站資訊發布時間** • '+getDay(),})); 
			
				conv.ask(new Suggestions('把它加入日常安排'));
				}
				else{
				conv.ask(new SimpleResponse({               
						  speech: `<speak><p><s>由於${sitename}監測站數據不足或處於維修狀態，我無法提供你最新資訊。</s></p></speak>`,
				text: '以下為該監測站的詳細資訊'}));
				conv.ask(new BasicCard({  
					image: new Image({url:"https://dummyimage.com/1037x539/232830/ffffff.png&text=NaN",alt:'Pictures',}),
					title:'儀器故障或校驗',
								title:'「'+sitename+'」儀器故障或校驗',
								text:'設備維護、儀器校正、儀器異常、傳輸異常、電力異常 \n或儀器故障或校驗等需查修維護情形，以致資料暫時中斷服務。  \n  \n**測站資訊發布時間** • '+getDay(), 
								display: 'CROPPED',})); 
				}
			 }else{
				conv.ask(new SimpleResponse({               
						  speech: `<speak><p><s>糟糕，查詢似乎發生錯誤。</s><s>請稍後再試。</s></p></speak>`,
				text: '發生錯誤，請稍後再試一次。'}));
					   conv.ask(new BasicCard({  
							image: new Image({url:"https://dummyimage.com/1037x539/ef2121/ffffff.png&text=錯誤",alt:'Pictures',}),
							title:'數據加載發生問題',
							subtitle:'請過一段時間後再回來查看', display: 'CROPPED',
			  })); 
			 }             	           			
		  } else {
                // Note: Currently, precise locaton only returns lat/lng coordinates on phones and lat/lng coordinates
                // and a geocoded address on voice-activated speakers.
                // Coarse location only works on voice-activated speakers.
				conv.ask(new SimpleResponse({speech:`<speak><p><s>糟糕，我無法得知你的目前位置。</s><s>請稍後再試。</s></p></speak>`,text:"發生錯誤，請開啟GPS功能然後再試一次。"}));                 
            }
 
        }
    } else {
			conv.ask(new SimpleResponse({speech:`<speak><p><s>很抱歉，由於未取得你的授權因此查詢失敗。</s><s>不過你隨時可以回來再試一次。</s></p></speak>`,text:"發生錯誤，未取得你的授權。"}));                 
    }
    conv.ask(new Suggestions('🔎依區域查詢','👋 掰掰'));
    conv.user.storage.choose_station=sitename;
 }).catch(function (error) {
	console.log(error);
	
	conv.ask(new SimpleResponse({               
			speech: `<speak><p><s>糟糕，查詢似乎發生錯誤。請稍後再試。</s></p></speak>`,
			text: '發生錯誤，請稍後再試一次。'}));
	conv.ask(new BasicCard({  
			image: new Image({url:"https://dummyimage.com/1037x539/ef2121/ffffff.png&text=錯誤",alt:'Pictures',}),
			title:'數據加載發生問題',
			subtitle:'請過一段時間後再回來查看', display: 'CROPPED',
	  })); 
    conv.ask(new Suggestions('🔎依區域查詢','👋 掰掰'));
	});

});

app.intent('直接查詢縣市選單', (conv, {County}) => {

if(conv.input.raw.indexOf('新北')!==-1){County="新北市";}
if(conv.input.raw==='嘉義'){County="嘉義";}

 if (County === "臺北市") {

  UVI1=UVI_list[parseInt(station_array.indexOf('臺北'))];
  UVI2=UVI_list[parseInt(station_array.indexOf('鞍部'))];

  picurl1= picture_generator(parseInt(UVI1));
  picurl2= picture_generator(parseInt(UVI2));
  status1= status_generator(parseInt(UVI1));
  status2= status_generator(parseInt(UVI2));
   
    if(conv.screen){conv.ask('以下是「臺北市」的監測站列表');}
  else{conv.ask(new SimpleResponse({               
              speech: `<speak><p><s>以下是「臺北市」的監測站列表</s><s>選項有以下幾個<break time="0.5s"/>臺北<break time="0.2s"/>鞍部<break time="1s"/>請選擇。</s></p></speak>`,
              text: '以下是「臺北市」的監測站列表'}));}
  conv.ask(new Carousel({
  title: 'Carousel Title',
  items: {
    '臺北': {
      title: '臺北',
      description: status1,
      image: new Image({url: picurl1,alt: 'Image alternate text',}),},
    '鞍部': {
      title: '鞍部',
      description: status2,
      image: new Image({url: picurl2,alt: 'Image alternate text',}),},
},
}));			  
}
  else if (County === "新北市") {
	  
    if(conv.screen){conv.ask('以下是「新北市」的監測站列表');}
  else{conv.ask(new SimpleResponse({               
              speech: `<speak><p><s>以下是「新北市」的監測站列表</s><s>選項有以下幾個<break time="0.5s"/>板橋<break time="0.2s"/>淡水<break time="1s"/>請選擇。</s></p></speak>`,
              text: '以下是「新北市」的監測站列表'}));}

  UVI1=UVI_list[parseInt(station_array.indexOf('板橋'))];
  UVI2=UVI_list[parseInt(station_array.indexOf('淡水'))];

  picurl1= picture_generator(parseInt(UVI1));
  picurl2= picture_generator(parseInt(UVI2));
  status1= status_generator(parseInt(UVI1));
  status2= status_generator(parseInt(UVI2));
   
  conv.ask(new Carousel({
  title: 'Carousel Title',
  items: {
    '板橋': {
      title: '板橋',
      description: status1,
      image: new Image({url: picurl1,alt: 'Image alternate text',}),},
    '淡水': {
      title: '淡水',
      description: status2,
      image: new Image({url: picurl2,alt: 'Image alternate text',}),},
},
}));			  
  }
  else if (County === "桃園市") {

    if(conv.screen){conv.ask('以下是「桃園市」的監測站列表');}
  else{conv.ask(new SimpleResponse({               
              speech: `<speak><p><s>以下是「桃園市」的監測站列表</s><s>選項有以下幾個<break time="0.5s"/>桃園<break time="0.2s"/>新屋<break time="1s"/>請選擇。</s></p></speak>`,
              text: '以下是「桃園市」的監測站列表'}));}

  UVI1=UVI_list[parseInt(station_array.indexOf('桃園'))];
  UVI2=UVI_list[parseInt(station_array.indexOf('新屋'))];

  picurl1= picture_generator(parseInt(UVI1));
  picurl2= picture_generator(parseInt(UVI2));
  status1= status_generator(parseInt(UVI1));
  status2= status_generator(parseInt(UVI2));
			  
  conv.ask(new Carousel({
    items: {
    '桃園': {
      title: '桃園',
      description: status1,
      image: new Image({url: picurl1,alt: 'Image alternate text',}),},
    '新屋': {
      title: '新屋',
      description: status2,
      image: new Image({url: picurl2,alt: 'Image alternate text',}),},
  },
}));  }
  else if (County === "臺中市") {
    
	if(conv.screen){conv.ask('以下是「臺中市」的監測站列表');}
  else{conv.ask(new SimpleResponse({               
              speech: `<speak><p><s>以下是「臺中市」的監測站列表</s><s>選項有以下幾個<break time="0.5s"/>臺中<break time="0.2s"/>沙鹿<break time="1s"/>請選擇。</s></p></speak>`,
              text: '以下是「臺中市」的監測站列表'}));}

  UVI1=UVI_list[parseInt(station_array.indexOf('臺中'))];
  UVI2=UVI_list[parseInt(station_array.indexOf('沙鹿'))];

  picurl1= picture_generator(parseInt(UVI1));
  picurl2= picture_generator(parseInt(UVI2));
  status1= status_generator(parseInt(UVI1));
  status2= status_generator(parseInt(UVI2));

  conv.ask(new Carousel({
    items: {
    '臺中': {
      title: '臺中',
      description: status1,
      image: new Image({url: picurl1,alt: 'Image alternate text',}),},
    '沙鹿': {
      title: '沙鹿',
      description: status2,
      image: new Image({url: picurl2,alt: 'Image alternate text',}),},
  },
}));  }
  else if (County === "南投縣") {

  if(conv.screen){conv.ask('以下是「南投縣」的監測站列表');}
  else{conv.ask(new SimpleResponse({               
              speech: `<speak><p><s>以下是「南投縣」的監測站列表</s><s>選項有以下幾個<break time="0.5s"/>日月潭<break time="0.2s"/>玉山<break time="0.2s"/>南投<break time="1s"/>請選擇。</s></p></speak>`,
              text: '以下是「南投縣」的監測站列表'}));}

  UVI1=UVI_list[parseInt(station_array.indexOf('日月潭'))];
  UVI2=UVI_list[parseInt(station_array.indexOf('玉山'))];
  UVI3=UVI_list[parseInt(station_array.indexOf('南投'))];

  picurl1= picture_generator(parseInt(UVI1));
  picurl2= picture_generator(parseInt(UVI2));
  picurl3= picture_generator(parseInt(UVI3));
  status1= status_generator(parseInt(UVI1));
  status2= status_generator(parseInt(UVI2));
  status3= status_generator(parseInt(UVI3));

  conv.ask(new Carousel({
    items: {
    '日月潭': {
      title: '日月潭',
      description: status1,
      image: new Image({url: picurl1,alt: 'Image alternate text',}),},
    '玉山': {
      title: '玉山',
      description: status2,
      image: new Image({url: picurl2,alt: 'Image alternate text',}),},
    '南投': {
      title: '南投',
      description: status3,
      image: new Image({url: picurl3,alt: 'Image alternate text',}),},
  },
}));  }
  else if (County === "臺東縣") {

  if(conv.screen){conv.ask('以下是「臺東縣」的監測站列表');}
  else{conv.ask(new SimpleResponse({               
              speech: `<speak><p><s>以下是「臺東縣」的監測站列表</s><s>選項有以下幾個<break time="0.5s"/>臺東<break time="0.2s"/>成功<break time="0.2s"/>蘭嶼<break time="1s"/>請選擇。</s></p></speak>`,
              text: '以下是「臺東縣」的監測站列表'}));}

  UVI1=UVI_list[parseInt(station_array.indexOf('臺東'))];
  UVI2=UVI_list[parseInt(station_array.indexOf('成功'))];
  UVI3=UVI_list[parseInt(station_array.indexOf('蘭嶼'))];

  picurl1= picture_generator(parseInt(UVI1));
  picurl2= picture_generator(parseInt(UVI2));
  picurl3= picture_generator(parseInt(UVI3));
  status1= status_generator(parseInt(UVI1));
  status2= status_generator(parseInt(UVI2));
  status3= status_generator(parseInt(UVI3));

  conv.ask(new Carousel({
    items: {
    '臺東': {
      title: '臺東',
      description: status1,
      image: new Image({url: picurl1,alt: 'Image alternate text',}),},
    '成功': {
      title: '成功',
      description: status2,
      image: new Image({url: picurl2,alt: 'Image alternate text',}),},
    '蘭嶼': {
      title: '蘭嶼',
      description: status3,
      image: new Image({url: picurl3,alt: 'Image alternate text',}),},
  },
}));  }
  else if (County === "嘉義縣市") {
    if(conv.screen){conv.ask('以下是「嘉義縣市」的監測站列表');}
  else{conv.ask(new SimpleResponse({               
              speech: `<speak><p><s>以下是「嘉義縣市」的監測站列表</s><s>選項有以下幾個<break time="0.5s"/>嘉義<break time="0.2s"/>朴子<break time="0.2s"/>阿里山<break time="0.2s"/>塔塔加<break time="1s"/>請選擇。</s></p></speak>`,
              text: '以下是「嘉義縣市」的監測站列表'}));}

  UVI1=UVI_list[parseInt(station_array.indexOf('嘉義'))];
  UVI2=UVI_list[parseInt(station_array.indexOf('朴子'))];
  UVI3=UVI_list[parseInt(station_array.indexOf('阿里山'))];
  UVI4=UVI_list[parseInt(station_array.indexOf('塔塔加'))];

  picurl1= picture_generator(parseInt(UVI1));
  picurl2= picture_generator(parseInt(UVI2));
  picurl3= picture_generator(parseInt(UVI3));
  picurl4= picture_generator(parseInt(UVI4));
  status1= status_generator(parseInt(UVI1));
  status2= status_generator(parseInt(UVI2));
  status3= status_generator(parseInt(UVI3));
  status4= status_generator(parseInt(UVI4));

  conv.ask(new Carousel({
    items: {
    '嘉義': {
      title: '嘉義',
      description: status1,
      image: new Image({url: picurl1,alt: 'Image alternate text',}),},
    '朴子': {
      title: '朴子',
      description: status2,
      image: new Image({url: picurl2,alt: 'Image alternate text',}),},
    '阿里山': {
      title: '阿里山',
      description: status3,
      image: new Image({url: picurl3,alt: 'Image alternate text',}),},
    '塔塔加': {
      title: '塔塔加',
      description: status4,
      image: new Image({url: picurl4,alt: 'Image alternate text',}),},
  },
}));  }
  else if (County === "臺南市") {

  if(conv.screen){conv.ask('以下是「臺南市」的監測站列表');}
  else{conv.ask(new SimpleResponse({               
              speech: `<speak><p><s>以下是「臺南市」的監測站列表</s><s>選項有以下幾個<break time="0.5s"/>臺南<break time="0.2s"/>新營<break time="1s"/>請選擇。</s></p></speak>`,
              text: '以下是「臺南市」的監測站列表'}));}

	UVI1=UVI_list[parseInt(station_array.indexOf('臺南'))];
	UVI2=UVI_list[parseInt(station_array.indexOf('新營'))];

	  
	picurl1= picture_generator(parseInt(UVI1));
	picurl2= picture_generator(parseInt(UVI2));
	status1= status_generator(parseInt(UVI1));
	status2= status_generator(parseInt(UVI2));
  
  conv.ask(new Carousel({
    items: {
    '臺南': {
      title: '臺南',
      description: status1,
      image: new Image({url: picurl1,alt: 'Image alternate text',}),},
    '新營': {
      title: '新營',
      description: status2,
      image: new Image({url: picurl2,alt: 'Image alternate text',}),},
  },
}));  }
  else if (County === "高雄市") {

  if(conv.screen){conv.ask('以下是「高雄市」的監測站列表');}
  else{conv.ask(new SimpleResponse({               
              speech: `<speak><p><s>以下是「高雄市」的監測站列表</s><s>選項有以下幾個<break time="0.5s"/>高雄<break time="0.2s"/>橋頭<break time="1s"/>請選擇。</s></p></speak>`,
              text: '以下是「高雄市」的監測站列表'}));}

  UVI1=UVI_list[parseInt(station_array.indexOf('高雄'))];
  UVI2=UVI_list[parseInt(station_array.indexOf('橋頭'))];

  picurl1= picture_generator(parseInt(UVI1));
  picurl2= picture_generator(parseInt(UVI2));
  status1= status_generator(parseInt(UVI1));
  status2= status_generator(parseInt(UVI2));

  conv.ask(new Carousel({
  title: 'Carousel Title',
  items: {
    '高雄': {
      title: '高雄',
      description: status1,
      image: new Image({url: picurl1,alt: 'Image alternate text',}),},
    '橋頭': {
      title: '橋頭',
      description: status2,
      image: new Image({url: picurl2,alt: 'Image alternate text',}),},
},
  }));}			  
  else if (County === "屏東縣") {

  if(conv.screen){conv.ask('以下是「屏東縣」的監測站列表');}
  else{conv.ask(new SimpleResponse({               
              speech: `<speak><p><s>以下是「屏東縣」的監測站列表</s><s>選項有以下幾個<break time="0.5s"/>屏東<break time="0.2s"/>琉球<break time="0.2s"/>恆春<break time="0.2s"/>潮州<break time="1s"/>請選擇。</s></p></speak>`,
              text: '以下是「屏東縣」的監測站列表'}));}

  UVI1=UVI_list[parseInt(station_array.indexOf('屏東'))];
  UVI2=UVI_list[parseInt(station_array.indexOf('恆春'))];

  picurl1= picture_generator(parseInt(UVI1));
  picurl2= picture_generator(parseInt(UVI2));
  status1= status_generator(parseInt(UVI1));
  status2= status_generator(parseInt(UVI2));

  conv.ask(new Carousel({
  title: 'Carousel Title',
  items: {
    '屏東': {
      title: '屏東',
      description: status1,
      image: new Image({url: picurl1,alt: 'Image alternate text',}),},
    '恆春': {
      title: '恆春',
      description: status2,
      image: new Image({url: picurl2,alt: 'Image alternate text',}),},
},
  }));}
  else if(station_array.indexOf(County)!==-1){
	indexnumber=station_array.indexOf(County); //取得監測站對應的編號
	  
	database.ref('/TWuvi').on('value',e=>{
		UVI_list=e.val().UVI;
		});

    UVI=parseFloat(UVI_list[parseInt(indexnumber)]);
    Status= status_generator(UVI);	
	
	if(Status!=="儀器故障或校驗"){

	if(UVI===0){picture= "https://dummyimage.com/1037x539/1e9165/ffffff.png&text=%200%20";}	
	else if(UVI>0&&UVI<3){picture= "https://dummyimage.com/1037x539/1e9165/ffffff.png&text="+UVI;}
	else if(UVI>=3&&UVI<6){picture= "https://dummyimage.com/1037x539/fc920b/ffffff.png&text="+UVI;}
	else if(UVI>=6&&UVI<8){picture= "https://dummyimage.com/1037x539/ef4621/ffffff.png&text="+UVI;}
	else if(UVI>=8&&UVI<11){picture= "https://dummyimage.com/1037x539/b71411/ffffff.png&text="+UVI;}
    else {picture= "https://dummyimage.com/1037x539/4f1770/ffffff.png&text="+UVI;}

	if(UVI>=0&&UVI<3){info= "基本上不需要保護措施，可以安心外出，但請留意瞬間的紫外線。";}
	else if(UVI>=3&&UVI<6){info= "外出時，盡量待在陰涼處。並卓長袖上衣、帽子、陽傘、防護霜、太陽眼鏡作為保護。";}
	else if(UVI>=6&&UVI<8){info= "暴露在陽光下30分鐘會造成曬傷。外出時，盡量待在陰涼處。並卓長袖上衣、帽子、陽傘、防護霜、太陽眼鏡作為保護。";}
	else if(UVI>=8&&UVI<11){info= "暴露在陽光下20分鐘會造成曬傷，早上十點至下午兩點最好不要在烈日下活動。並使用帽子、陽傘、防護霜、太陽眼鏡作為保護。"}
	else {info= "健康威脅達到緊急，暴露在陽光下15分鐘會造成曬傷，早上十點至下午兩點最好不要在烈日下活動。並使用帽子、陽傘、防護霜、太陽眼鏡作為保護。";}
				
	if(UVI>=0&&UVI<3){info_output= "可以安心外出，但請留意瞬間的紫外線。";}
	else if(UVI>=3&&UVI<6){info_output= "1.防護措施：帽子/陽傘+防曬液+太陽眼鏡。  \n2.儘量待在陰涼處";}
	else if(UVI>=6&&UVI<8){info_output= "1.曬傷時間：30分鐘內  \n2.防護措施：帽子/陽傘+防曬液+太陽眼鏡。  \n3.儘量待在陰涼處。";}
	else if(UVI>=8&&UVI<11){info_output= "1.曬傷時間：20分鐘內  \n2.防護措施：	帽子/陽傘+防曬液+太陽眼鏡+長袖衣物。  \n3.儘量待在陰涼處  \n4.10至14時最好不在烈日下活動"}
	else {info_output= "1.曬傷時間：15分鐘內  \n2.防護措施：帽子/陽傘+防曬液+太陽眼鏡+長袖衣物。  \n3.儘量待在陰涼處  \n4.10至14時最好不在烈日下活動";}

		conv.ask(new SimpleResponse({               
              speech: `<speak><p><s>根據最新資料顯示，${County}監測站的紫外線指數為${UVI}</s><s>${info}</s></p></speak>`,
	          text: '以下為該監測站的詳細資訊。'}));
		conv.noInputs = ["請試著問我其他縣市來查看其他測站","請問你還要查詢其他地方嗎?","抱歉，我想我幫不上忙。"];	   
  
		if(conv.screen){
			conv.ask(new BasicCard({  
					image: new Image({url:picture,alt:'Pictures',}),
					title:'「'+County+'」的紫外線為'+Status,display: 'CROPPED',
					text:info_output+'  \n  \n**測站資訊發布時間** • '+getDay(),})); 
		    conv.ask(new Suggestions('把它加入日常安排'));
		}else{conv.close(`<speak><p><s>歡迎你隨時回來查詢，下次見</s></p></speak>`);}
    
  }else{
    conv.ask(new SimpleResponse({               
              speech: `<speak><p><s>由於${County}監測站正處於維修狀態或數據不足。我無法提供你最新資訊。</s></p></speak>`,
	text: '以下為該監測站的詳細資訊。'}));
		if(conv.screen){
			conv.ask(new BasicCard({  
					image: new Image({url:"https://dummyimage.com/1037x539/232830/ffffff.png&text=NaN",alt:'Pictures',}),
					title:'「'+County+'」儀器故障或校驗',
					text:'設備維護、儀器校正、儀器異常、傳輸異常、電力異常 \n或儀器故障或校驗等需查修維護情形，以致資料暫時中斷服務。  \n  \n**測站資訊發布時間** • '+getDay(), 
					display: 'CROPPED',
     })); 
	 	conv.ask(new Suggestions('把它加入日常安排'));
		}else{conv.close(`<speak><p><s>歡迎你隨時回來查詢，下次見</s></p></speak>`);}

  }

 }else{
  County="undefined";
  if(conv.screen){conv.ask('請輕觸下方卡片來選擇查詢區域');}
  else{conv.ask(new SimpleResponse({               
              speech: `<speak><p><s>請選擇要查詢的區域!</s><s>選項有以下幾個<break time="0.5s"/>北部地區<break time="0.2s"/>中部地區<break time="0.2s"/>南部地區<break time="0.2s"/>東部地區<break time="0.2s"/>離島地區<break time="1s"/>請選擇。</s></p></speak>`,
	  text: '請輕觸下方卡片來選擇查詢區域!'}));}

  conv.ask(new Carousel({
  title: 'Carousel Title',
  items: {
    'Northen': {
      title: '北部地區',
	description: '北北基、桃園市\n新竹縣市',},
    'Central': {
      title: '中部地區',
	description: '苗栗縣、臺中市\n雲林、彰化、南投',},
    'Southen': {
      title: '南部地區',
	  description: '嘉義縣市、台南市、\n高雄市、屏東縣',},
	'East': {
      title: '東部地區',
	  description: '宜蘭、花蓮、台東\n',},
		'Outlying_island': {
      title: '離島地區',
	  description: '澎湖縣、金門縣、\n連江縣',}
},}));
conv.ask(new Suggestions('🌎 最近的測站','語音指令範例'));
 }
 if(conv.screen){
	 if(County!=="undefined"){conv.ask(new Suggestions('🌎 最近的測站','回主頁面'));}
	 conv.ask(new Suggestions('👋 掰掰'));
     conv.user.storage.choose_station=County;}

});


app.intent('結束對話', (conv) => {
    conv.user.storage = {}; //離開同時清除暫存資料
    conv.ask('希望能幫到一點忙!');
    conv.ask(new SimpleResponse({speech: '下次見',text: '下次見 👋',}));
    conv.close(new BasicCard({   
        title: '感謝您的使用!', 
        text:'如果有任何需要改進的地方，  \n歡迎到簡介頁面評分或給予反饋，謝謝!', 
        buttons: new Button({title: '開啟本程式的商店頁面',url: 'https://assistant.google.com/services/a/uid/00000008b2c308d2',}),
  })); 
});

// Set the DialogflowApp object to handle the HTTPS POST request.
exports.tw_UVI = functions.https.onRequest(app);
