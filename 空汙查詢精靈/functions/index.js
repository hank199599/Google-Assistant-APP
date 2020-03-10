	'use strict';

	// Import the Dialogflow module from the Actions on Google client library.
	const {
	  dialogflow,
	  Permission,
	  Suggestions,
	  SimpleResponse,
	  Button,Confirmation,
	  Image,RegisterUpdate,
	  BasicCard,Carousel,
	  UpdatePermission} = require('actions-on-google');

	// Import the firebase-functions package for deployment.
const functions = require('firebase-functions');
var getJSON = require('get-json')
const replaceString = require('replace-string');
const parseJson = require('parse-json');
const findNearestLocation = require('map-nearest-location');
const app = dialogflow({debug: true});
const admin = require('firebase-admin');

	let serviceAccount = require("./config/b1a2b-krmfch-firebase-adminsdk-1tgdm-cf5f4fc84d.json");

	admin.initializeApp({
	  credential: admin.credential.cert(serviceAccount),
	  databaseURL: "https://b1a2b-krmfch.firebaseio.com/"
	});

const database = admin.database();
let db = admin.firestore();
var data=[];var air_data=[];
var number=0; //函數用變數
var picture="";
var picurl1="";var picurl2="";var picurl3="";var picurl4="";var picurl5="";
var picurl6="";var picurl7="";var picurl8="";var picurl9="";var picurl10="";
var status1="";var status2="";var status3="";var status4="";var status5="";
var status6="";var status7="";var status8="";var status9="";var status10="";
var AQI1="";var AQI2="";var AQI3="";var AQI4="";var AQI5="";
var AQI6="";var AQI7="";var AQI8="";var AQI9="";var AQI10="";
var station_array=["二林","三重","三義","土城","士林","大同","大里","大園","大寮","小港","中山","中壢","仁武","斗六","冬山","古亭","左營","平鎮","永和","安南","朴子","汐止","竹山","竹東","西屯","沙鹿","宜蘭","忠明","松山","板橋","林口","林園","花蓮","金門","前金","前鎮","南投","屏東","琉球","恆春","美濃","苗栗","埔里","桃園","觀音工業區","馬公","馬祖","基隆","崙背","淡水","麥寮","善化","富貴角","復興","湖口","菜寮","陽明","新竹","新店","新莊","新港","新營","楠梓","萬里","萬華","嘉義","彰化","大城","臺西","臺東","臺南","麻豆","鳳山","潮州","線西","橋頭","頭份","龍潭","豐原","關山","觀音"];
var station_explain=["二林","三重","三義","土城","士林","大同","大里","大園","大寮","小港","中山","中壢","仁武","斗六","冬山","古亭","左營","平鎮","永和","安南","朴子","汐止","竹山","竹東","西屯","沙鹿","宜蘭","忠明","松山","板橋","林口","林園","花蓮","金門","前金","前鎮","南投","屏東","琉球","恆春","美濃","苗栗","埔里","桃園","觀音工業區","馬公","馬祖","基隆","崙背","淡水","麥寮","善化","富貴角","復興","湖口","菜寮","陽明","新竹","新店","新莊","新港","新營","楠梓","萬里","萬華","嘉義","彰化","大城","臺西","臺東","臺南","麻豆","鳳山","潮州","線西","橋頭","頭份","龍潭","豐原","關山","觀音"];
var origin_station_array=["二林","三重","三義","土城","士林","大同","大里","大園","大寮","小港","中山","中壢","仁武","斗六","冬山","古亭","左營","平鎮","永和","安南","朴子","汐止","竹山","竹東","西屯","沙鹿","宜蘭","忠明","松山","板橋","林口","林園","花蓮","金門","前金","前鎮","南投","屏東","屏東(琉球)","恆春","美濃","苗栗","埔里","桃園","桃園(觀音工業區)","馬公","馬祖","高雄(左營)","高雄(楠梓)","基隆","崙背","淡水","麥寮","善化","富貴角","復興","湖口","菜寮","陽明","新北(樹林)","新竹","新店","新莊","新港","新營","楠梓","楠梓加工出口區","萬里","萬華","嘉義","彰化","彰化(大城)","臺西","臺東","臺南","臺南(麻豆)","鳳山","潮州","線西","橋頭","頭份","龍潭","豐原","關山","觀音","新竹(香山)"];
var input_array=["北部地區","中部地區","南部地區","東部地區","離島地區","臺北市","新北市(一)","新北市(二)","桃園市","新竹市","新竹縣","苗栗縣","臺中市","彰化縣","南投縣","雲林縣","嘉義縣市","台南市","北高雄市","南高雄市","屏東縣"];
var option_array=["Northen","Central","Southen","East","Outlying_island","Taipei","New_Taipei1","New_Taipei2","Taoyuan","Hsinchu City","Hsinchu County","Miaoli","Taichung","Changhua","Nantou","Yunlin","Chiayi County","Tainan","NKaohsiung","SKaohsiung","Pingtung","Mobile_Van"];
var locations= [{lng: 120.409653,lat: 23.925175,Sitename:"二林"},{lng: 121.493806,lat: 25.072611,Sitename:"三重"},{lng: 120.758833,lat: 24.382942,Sitename:"三義"},{lng: 121.451861,lat: 24.982528,Sitename:"土城"},{lng: 121.515389,lat: 25.105417,Sitename:"士林"},{lng: 121.513311,lat: 25.0632,Sitename:"大同"},{lng: 120.677689,lat: 24.099611,Sitename:"大里"},{lng: 121.201811,lat: 25.060344,Sitename:"大園"},{lng: 120.425081,lat: 22.565747,Sitename:"大寮"},{lng: 120.337736,lat: 22.565833,Sitename:"小港"},{lng: 121.526528,lat: 25.062361,Sitename:"中山"},{lng: 121.221667,lat: 24.953278,Sitename:"中壢"},{lng: 120.332631,lat: 22.689056,Sitename:"仁武"},{lng: 120.544994,lat: 23.711853,Sitename:"斗六"},{lng: 121.792928,lat: 24.632203,Sitename:"冬山"},{lng: 121.529556,lat: 25.020608,Sitename:"古亭"},{lng: 120.292917,lat: 22.674861,Sitename:"左營"},{lng: 121.203986,lat: 24.952786,Sitename:"平鎮"},{lng: 121.516306,lat: 25.017,Sitename:"永和"},{lng: 120.2175,lat: 23.048197,Sitename:"安南"},{lng: 120.24781,lat: 23.467123,Sitename:"朴子"},{lng: 121.6423,lat: 25.067131,Sitename:"汐止"},{lng: 120.677306,lat: 23.756389,Sitename:"竹山"},{lng: 121.088903,lat: 24.740644,Sitename:"竹東"},{lng: 120.616917,lat: 24.162197,Sitename:"西屯"},{lng: 120.568794,lat: 24.225628,Sitename:"沙鹿"},{lng: 121.746394,lat: 24.747917,Sitename:"宜蘭"},{lng: 120.641092,lat: 24.151958,Sitename:"忠明"},{lng: 121.578611,lat: 25.05,Sitename:"松山"},{lng: 121.458667,lat: 25.012972,Sitename:"板橋"},{lng: 121.376869,lat: 25.077197,Sitename:"林口"},{lng: 120.41175,lat: 22.4795,Sitename:"林園"},{lng: 121.599769,lat: 23.971306,Sitename:"花蓮"},{lng: 118.312256,lat: 24.432133,Sitename:"金門"},{lng: 120.288086,lat: 22.632567,Sitename:"前金"},{lng: 120.307564,lat: 22.605386,Sitename:"前鎮"},{lng: 120.685306,lat: 23.913,Sitename:"南投"},{lng: 120.488033,lat: 22.673081,Sitename:"屏東"},{lng: 120.788928,lat: 21.958069,Sitename:"恆春"},{lng: 120.530542,lat: 22.883583,Sitename:"美濃"},{lng: 120.8202,lat: 24.565269,Sitename:"苗栗"},{lng: 120.967903,lat: 23.968842,Sitename:"埔里"},{lng: 121.304383,lat: 24.995368,Sitename:"桃園"},{lng: 119.566158,lat: 23.569031,Sitename:"馬公"},{lng: 119.949875,lat: 26.160469,Sitename:"馬祖"},{lng: 121.760056,lat: 25.129167,Sitename:"基隆"},{lng: 120.348742,lat: 23.757547,Sitename:"崙背"},{lng: 121.449239,lat: 25.1645,Sitename:"淡水"},{lng: 120.251825,lat: 23.753506,Sitename:"麥寮"},{lng: 120.297142,lat: 23.115097,Sitename:"善化"},{lng: 121.536763,lat: 25.298562,Sitename:"富貴角"},{lng: 120.312017,lat: 22.608711,Sitename:"復興"},{lng: 121.038653,lat: 24.900142,Sitename:"湖口"},{lng: 121.481028,lat: 25.06895,Sitename:"菜寮"},{lng: 121.529583,lat: 25.182722,Sitename:"陽明"},{lng: 120.972075,lat: 24.805619,Sitename:"新竹"},{lng: 121.537778,lat: 24.977222,Sitename:"新店"},{lng: 121.4325,lat: 25.037972,Sitename:"新莊"},{lng: 120.345531,lat: 23.554839,Sitename:"新港"},{lng: 120.31725,lat: 23.305633,Sitename:"新營"},{lng: 120.328289,lat: 22.733667,Sitename:"楠梓"},{lng: 121.689881,lat: 25.179667,Sitename:"萬里"},{lng: 121.507972,lat: 25.046503,Sitename:"萬華"},{lng: 120.440833,lat: 23.462778,Sitename:"嘉義"},{lng: 120.541519,lat: 24.066,Sitename:"彰化"},{lng: 120.273117,lat: 23.843139,Sitename:"大城"},{lng: 120.202842,lat: 23.717533,Sitename:"臺西"},{lng: 121.15045,lat: 22.755358,Sitename:"臺東"},{lng: 120.202617,lat: 22.984581,Sitename:"臺南"},{lng: 120.358083,lat: 22.627392,Sitename:"鳳山"},{lng: 120.561175,lat: 22.523108,Sitename:"潮州"},{lng: 120.469061,lat: 24.131672,Sitename:"線西"},{lng: 120.305689,lat: 22.757506,Sitename:"橋頭"},{lng: 120.898572,lat: 24.696969,Sitename:"頭份"},{lng: 121.21635,lat: 24.863869,Sitename:"龍潭"},{lng: 120.741711,lat: 24.256586,Sitename:"豐原"},{lng: 121.161933,lat: 23.045083,Sitename:"關山"},{lng: 121.082761,lat: 25.035503,Sitename:"觀音"}];
var Status=0;var AQI=0;var Pollutant="";var info="";var info_output="";
var indexnumber="";
var choose_station="";
var report="";
var report_PublishTime="";var day_count=0;
var direction_array=["東北風","偏東風","偏南風","西南風","偏西風","背風面","下風處","弱風環境","背風渦旋"]
var pollutant_array=["河川揚塵","光化反應","境外汙染","降雨洗除作用","沉降作用","混合層高度"];
var eicon=["🌍 ","🌎 ","🌏 "];
var output_title="";
var PublishTime="";
var temp="";var origin_report="";var origin_time="";
var Pollutant_list=[];var AQI_list=[];var PM25_list=[];var PM10_list=[];var O3_list=[];var Sitename_list=[];
var Pollutant_list_update=[];var AQI_list_update=[];var PM25_list_update=[];var PM10_list_update=[];var O3_list_update=[];var Sitename_list_update=[];
var PM25="";var PM10="";var O3="";
var time=0;var hour_now=0;var minute_now=0;var report_output="";
var i=0;	var data_get="";var data_report="";var get_time="";
function picture_generator(number){
	if(number>=0&&number<=50){return "https://dummyimage.com/232x128/1e9165/ffffff.png&text="+number;}
	else if(number>=51&&number<=100){return "https://dummyimage.com/232x128/fc920b/ffffff.png&text="+number;}
	else if(number>=100&&number<=150){return "https://dummyimage.com/232x128/ef4621/ffffff.png&text="+number;}
	else if(number>=151&&number<=199){return "https://dummyimage.com/232x128/b71411/ffffff.png&text="+number;}
	else if(number>=200&&number<=300){return "https://dummyimage.com/232x128/5b0e31/ffffff.png&text="+number;}
	else if(number>301){return "https://dummyimage.com/232x128/4f1770/ffffff.png&text="+number;}
	else{return "https://dummyimage.com/232x128/232830/ffffff.png&text=NaN";}
}
function status_generator(number){
	if(number>=0&&number<=50){return "良好";}
	else if(number>=51&&number<=100){return "普通";}
	else if(number>=100&&number<=150){return "對敏感族群不健康";}
	else if(number>=151&&number<=199){return "對所有族群不健康";}
	else if(number>=200&&number<=300){return "非常不健康";}
		else if(number>301){return "危害";}
		else{return "有效數據不足";}

}

function air_report_set(){

	i=0; Pollutant_list_update=[]; AQI_list_update=[]; PM25_list_update=[]; PM10_list_update=[]; O3_list_update=[]; Sitename_list_update=[];	

   //取得概況報告
	time = new Date();
	hour_now= (time.getHours()+8)%24;
	minute_now=time.getMinutes();
	
	if(hour_now===0||hour_now===11||hour_now===17){
	//Promise A:取得報告資料
	  data_report=new Promise(function(resolve,reject){
		getJSON('http://opendata.epa.gov.tw/webapi/Data/AQFN/?$select=Content&$orderby=PublishTime%20DESC&$skip=0&$top=1&format=json')
	.then(function(response) {
      origin_report=response;
	  resolve(origin_report)
    }).catch(function(error) {
	 var reason=new Error('資料獲取失敗');
     reject(reason)
    });		 });
		
    data_report.then(function (origin_data) {
    if(hour_now===0&&minute_now>=0&&minute_now<=15){ report=(((origin_data[0].Content).split('2.')[1]).split('。')[0]).split('：')[1];}
	else if(hour_now===11||hour_now===17&&minute_now>=30&&minute_now<=45){report=((origin_data[0].Content).split('2.')[0]).split('。')[0];}

	report=report.split('。')[0];
	report=replaceString(report, '前一日', '前一天'); 
	report=report.split('日')[1];
	database.ref('/TWair').update({report:report});
	report_output=report;
   }).catch(function (error) {
	database.ref('/TWair').on('value',e=>{
		report_output=e.val().report;
	});});
  }
  
  if(minute_now>=0&&minute_now<=25){

//Promise B:取得測站資料
  data_get=new Promise(function(resolve,reject){
	getJSON('http://opendata.epa.gov.tw/webapi/Data/REWIQA/?$select=SiteName,AQI,Pollutant,PM2.5,PM10,O3&$orderby=SiteName&$skip=0&$top=1000&format=json').then(function(response) {
      data=response;
	  resolve(data)
    }).catch(function(error) {
	 var reason=new Error('資料獲取失敗');
     reject(reason)
    });		 });
//Promise C:取得更新時間
	get_time=new Promise(function(resolve,reject){
	getJSON('http://opendata.epa.gov.tw/webapi/Data/REWIQA/?$select=PublishTime&$orderby=SiteName&$skip=0&$top=1&format=json').then(function(response) {
      origin_time=response[0].PublishTime;
	  resolve(origin_time)
    }).catch(function(error) {
	 var reason=new Error('資料獲取失敗');
     reject(reason)
    });		 });
  
  //取得測站資訊更新時間 
	get_time.then(function (origin_data) {
		PublishTime=replaceString(origin_data, '-', '/');
		database.ref('/TWair').update({PublishTime:PublishTime});
	   }).catch(function (error) {
	database.ref('/TWair').on('value',e=>{
		PublishTime=e.val().PublishTime;
	});
   });

	//取得各測站詳細資訊
   data_get.then(function (origin_data) {
	   for(i=0;i<origin_data.length;i++){
		Pollutant_list_update[i]=origin_data[i].Pollutant;
		AQI_list_update[i]=origin_data[i].AQI;
		PM10_list_update[i]=origin_data[i]['PM10'];
		PM25_list_update[i]=origin_data[i]['PM2.5'];
		O3_list_update[i]=origin_data[i].O3;
		Sitename_list_update[i]=origin_data[i].SiteName;
	}
	 
	database.ref('/TWair').update({Pollutant:Pollutant_list_update});
	database.ref('/TWair').update({AQI:AQI_list_update});
	database.ref('/TWair').update({PM25:PM25_list_update});
	database.ref('/TWair').update({PM10:PM10_list_update});
	database.ref('/TWair').update({O3:O3_list_update});
	database.ref('/TWair').update({SiteName:Sitename_list_update});
	
	Pollutant_list=Pollutant_list_update;
	AQI_list=AQI_list_update;
	PM10_list=PM10_list_update;
	PM25_list=PM25_list_update;
	O3_list=O3_list_update;
	station_array=Sitename_list_update
	
   }).catch(function (error) {
	   	database.ref('/TWair').on('value',e=>{
		Pollutant_list=e.val().Pollutant;
		AQI_list=e.val().AQI;
		PM10_list=e.val().PM10;
		PM25_list=e.val().PM25;
		O3_list=e.val().O3;
		});
   });
  }
}

	const SelectContexts = {
	  parameter: 'select ',
	}	


app.intent('預設歡迎語句', (conv) => {

	database.ref('/TWair').on('value',e=>{
		report_output=e.val().report;
		PublishTime=e.val().PublishTime;
		});

	report_output=replaceString(report_output, '；', '。\n');

	conv.ask(new Suggestions(eicon[parseInt(Math.random()*2)]+'最近的測站','🔎依區域查詢'));
	
	if(report_output.indexOf('東北季風')!==-1||report_output.indexOf('東北風')!==-1||report_output.indexOf('東北東風')!==-1||report_output.indexOf('偏北風')!==-1){conv.ask(new Suggestions('東北風'));}
	else if(report_output.indexOf('偏東風')!==-1){conv.ask(new Suggestions('偏東風'));}
	else if(report_output.indexOf('偏西風')!==-1){conv.ask(new Suggestions('偏西風'));}
	else if(report_output.indexOf('偏南風')!==-1){conv.ask(new Suggestions('偏南風'));}
	else if(report_output.indexOf('西南季風')!==-1){conv.ask(new Suggestions('西南風'));}
	else if(report_output.indexOf('南風')!==-1){conv.ask(new Suggestions('偏南風'));}
	else if(report_output.indexOf('南南東風')!==-1){conv.ask(new Suggestions('偏南風'));}

	if(report_output.indexOf('背風面')!==-1||report_output.indexOf('背風')!==-1){conv.ask(new Suggestions('背風面'));}
	if(report_output.indexOf('下風處')!==-1||report_output.indexOf('下風')!==-1){conv.ask(new Suggestions('下風處'));}
	if(report_output.indexOf('弱風環境')!==-1||report_output.indexOf('弱風')!==-1){conv.ask(new Suggestions('弱風環境'));}
	if(report_output.indexOf('背風渦旋')!==-1){conv.ask(new Suggestions('背風渦旋'));}
	
	if(report_output.indexOf('河川揚塵')!==-1||report_output.indexOf('揚塵現象')!==-1){conv.ask(new Suggestions('河川揚塵'));}
    if(report_output.indexOf('光化反應')!==-1||report_output.indexOf('光化作用')!==-1){conv.ask(new Suggestions('光化反應'));}
	if(report_output.indexOf('境外汙染')!==-1||report_output.indexOf('境外污染')!==-1){conv.ask(new Suggestions('境外汙染'));}
	if(report_output.indexOf('降雨')!==-1){conv.ask(new Suggestions('降雨洗除作用'));}
	if(report_output.indexOf('混合層高度')!==-1||report_output.indexOf('垂直擴散')!==-1){conv.ask(new Suggestions('混合層高度'));}
	if(report_output.indexOf('沉降作用')!==-1){conv.ask(new Suggestions('沉降作用'));}
	
  if(conv.screen){
	if (conv.user.last.seen) {  conv.ask(new SimpleResponse({               
				  speech: `<speak><p><s>空氣品質概要如下</s><break time="0.3s"/><s>${replaceString(report_output, '；', '<break time="0.3s"/>')}</s></p></speak>`,
				  text: '以下是現在的空氣品質摘要。'}));}
			else { conv.ask(new SimpleResponse({               
				  speech: `<speak><p><s>歡迎使用空汙查詢精靈!</s><s>我能提供環保署的監測站查詢服務，此外，你能將我加入日常安排快速查詢所需站點。</s><s>接下來，是目前的空氣概況<break time="0.5s"/>${replaceString(report_output, '；', '<break time="0.3s"/>')}</s></p></speak>`,
				  text: '歡迎使用!'}));}
		conv.ask(new BasicCard({  
			image: new Image({url:'https://i.imgur.com/DOvpvIe.jpg ',alt:'Pictures',}),
			title:"全台空氣品質概要",
			subtitle:report_output+"。",
			text:"測站資訊發布時間 • "+replaceString(PublishTime, '-', '/'), 
			buttons: new Button({title: '行政院環境保護署',url:'https://airtw.epa.gov.tw/CHT/default.aspx',display: 'CROPPED',}),})); 

	conv.ask(new Suggestions('如何加入日常安排','👋 掰掰'));

	}
	 else{
		 word1=county_array[parseInt(Math.random()*19)];word2=county_array[20+parseInt(Math.random()*28)];
		 conv.ask(`<speak><p><s>空氣品質概要如下</s><s>${replaceString(report_output, '；', '<break time="0.3s"/>')}</s></p></speak>`);
		 conv.ask(`<speak><p><s>接著，試著問我要查看的縣市!</s><s>例如<break time="0.2s"/>${word1}空氣品質如何?<break time="0.2s"/>或<break time="0.2s"/>幫我找${word2}</s></p></speak>`);
	    conv.noInputs = ["抱歉，我沒聽輕楚。請再問一次","請試著問我要查詢的縣市列表","很抱歉，我幫不上忙"];	   

	}

	air_report_set();

	database.ref('/TWair').on('value',e=>{
		Pollutant_list=e.val().Pollutant;
		AQI_list=e.val().AQI;
		PM10_list=e.val().PM10;
		PM25_list=e.val().PM25;
		O3_list=e.val().O3;
		});
	conv.user.storage.mobile_van=false;		
});

app.intent('依區域查詢', (conv) => {

	database.ref('/TWair').on('value',e=>{
		Pollutant_list=e.val().Pollutant;
		AQI_list=e.val().AQI;
		PM10_list=e.val().PM10;
		PM25_list=e.val().PM25;
		O3_list=e.val().O3;
		PublishTime=e.val().PublishTime;
		station_array=e.val().SiteName;
		});

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
	  description: '澎湖縣、金門縣、\n連江縣',},
	  'Mobile_Van': {
	  title: '行動測站',
	  description: '環保署因應需求設置  \n可能隨時間發生變動', },
	},}));
	 conv.ask(new Suggestions(eicon[parseInt(Math.random()*2)]+'最近的測站','語音查詢範例','全台空氣品質概要','風向對空污的影響','污染物影響要素','👋 掰掰'));

	 //取得測站更新時間
	getJSON('http://opendata.epa.gov.tw/webapi/Data/REWIQA/?$select=PublishTime&$orderby=SiteName&$skip=0&$top=1&format=json').then(function(response) {
	 PublishTime=response[0].PublishTime;})
	.catch(function(error) {});
	 
	 if(PublishTime!==""){database.ref('/TWair').update({PublishTime:PublishTime});}
	air_report_set();
	conv.user.storage.mobile_van=false;
});

const AppContexts = {
  LOCATION: 'sendback_premission ',
}

const NotifyContexts = {
  parameter: 'get_notify',
}

const ComfirmContexts = {
  parameter: 'comfirm_notify',
}

app.intent('縣市查詢結果', (conv, input, option) => {

database.ref('/TWair').on('value',e=>{
	Pollutant_list=e.val().Pollutant;
	AQI_list=e.val().AQI;
	PM10_list=e.val().PM10;
	PM25_list=e.val().PM25;
	O3_list=e.val().O3;
	PublishTime=e.val().PublishTime;
	station_array=e.val().SiteName;
	});
	
   if(conv.input.raw.indexOf('最近')!==-1||conv.input.raw.indexOf('附近')!==-1){option="🌎 最近的測站";}
	else if(conv.input.raw.indexOf('台東')!==-1||conv.input.raw.indexOf('臺東')!==-1){option="臺東";}

	
	if(option_array.indexOf(option)!==-1){
	
	  if (option === "Northen") {
	  if(conv.screen){conv.ask('請選擇您在「北部地區」要查詢的縣市');}
	  else{conv.ask(new SimpleResponse({               
				  speech: `<speak><p><s>請選擇您在北部地區要查詢的縣市!</s><s>選項有以下幾個<break time="0.5s"/>臺北市<break time="0.2s"/>基隆市<break time="0.2s"/>新北市<break time="0.2s"/>桃園市<break time="0.2s"/>新竹縣市<break time="1s"/>請選擇。</s></p></speak>`,
	  text: '請選擇要查詢的縣市。'}));}
	conv.ask(new Carousel({
		items: {
		'Taipei': {
		  title: '臺北市',
		  description: '士林、大同、中山  \n古亭、松山、陽明  \n萬華',
		},
		'基隆': {
		  title: '基隆市',
	  description: '基隆\n',
		},
		'New_Taipei1': {
		  title: '新北市(一)',
		  description: '三重、土城、永和  \n汐止、板橋、林口',
		},
		'New_Taipei2': {
		  title: '新北市(二)',
		  description: '淡水、富貴角、菜寮  \n新店、新莊、萬里',
		},
	'Taoyuan': {
		  title: '桃園市',
		  description: '大園、中壢、平鎮  \n桃園、龍潭、觀音',
		},
	'Hsinchu County': {
		  title: '新竹縣市',
		  description: '新竹、竹東  \n湖口',
		}
	  },
	}));  }
	  else if (option === "Central") {

	  if(conv.screen){conv.ask('請選擇您在「中部地區」要查詢的縣市');}
	  else{conv.ask(new SimpleResponse({               
				  speech: `<speak><p><s>請選擇您在中部地區要查詢的縣市!</s><s>選項有以下幾個<break time="0.5s"/>苗栗縣<break time="0.2s"/>台中市<break time="0.2s"/>彰化縣<break time="0.2s"/>南投縣<break time="0.2s"/>雲林縣<break time="1s"/>請選擇。</s></p></speak>`,
				  text: '請選擇要查詢的縣市。'}));}

	conv.ask(new Carousel({
		items: {
		'Miaoli': {
		  title: '苗栗縣',
		  description: '三義、苗栗、頭份\n',
		},
		'Taichung': {
		  title: '臺中市',
		  description: '大里、西屯、沙鹿  \n忠明、豐原',
		},
		'Changhua': {
		  title: '彰化縣',
		  description: '二林、彰化、線西  \n',
		},
		'Nantou': {
		  title: '南投縣',
		  description: '竹山、南投、埔里\n',
		},
		'Yunlin': {
		  title: '雲林縣',
		  description: '斗六、崙背、麥寮  \n臺西',
		}
	  },
	}));  }
	  else if (option === "Southen") {
	  
	 if(conv.screen){conv.ask('請選擇您在「南部地區」要查詢的縣市');}
	  else{conv.ask(new SimpleResponse({               
				  speech: `<speak><p><s>請選擇您在南部地區要查詢的縣市!</s><s>選項有以下幾個<break time="0.5s"/>嘉義縣市<break time="0.2s"/>台南市<break time="0.2s"/>北高雄市<break time="0.2s"/>南高雄市<break time="0.2s"/>屏東縣<break time="1s"/>請選擇。</s></p></speak>`,
	  text: '請選擇要查詢的縣市。'}));}
	  
	  conv.ask(new Carousel({
		items: {
		'Chiayi County': {
		  title: '嘉義縣市',
		  description: '嘉義、朴子、新港\n',
		},
		'Tainan': {
		  title: '台南市',
		  description: '安南、善化、新營  \n臺南',
		},
		'NKaohsiung': {
		  title: '北高雄市',
		  description: '美濃、橋頭、楠梓  \n仁武、左營、前金',
		},
		'SKaohsiung': {
		  title: '南高雄市',
		  description: '鳳山、復興、前鎮  \n小港、大寮、林園',
		},
		'Pingtung': {
		  title: '屏東縣',
		  description: '屏東、潮州、恆春  \n',
		}
	  },
	}));  }
	  else if (option === "East") {
	  
	  if(conv.screen){conv.ask('以下是「東部地區」的監測站列表');
	  }else{conv.ask(new SimpleResponse({               
				  speech: `<speak><p><s>以下是「東部地區」的監測站列表</s><s>選項有以下幾個<break time="0.5s"/>冬山<break time="0.2s"/>宜蘭<break time="0.2s"/>花蓮<break time="0.2s"/>台東<break time="0.2s"/>關山<break time="1s"/>請選擇。</s></p></speak>`,
	  text: '以下是「東部地區」的監測站列表'}));}

	  AQI1=AQI_list[parseInt(station_array.indexOf('冬山'))];
	  AQI2=AQI_list[parseInt(station_array.indexOf('宜蘭'))];
	  AQI3=AQI_list[parseInt(station_array.indexOf('花蓮'))];
	  AQI4=AQI_list[parseInt(station_array.indexOf('臺東'))];
	  AQI5=AQI_list[parseInt(station_array.indexOf('關山'))];

	  picurl1= picture_generator(parseInt(AQI1));
	  picurl2= picture_generator(parseInt(AQI2));
	  picurl3= picture_generator(parseInt(AQI3));
	  picurl4= picture_generator(parseInt(AQI4));
	  picurl5= picture_generator(parseInt(AQI5));
	  status1= status_generator(parseInt(AQI1));
	  status2= status_generator(parseInt(AQI2));
	  status3= status_generator(parseInt(AQI3));
	  status4= status_generator(parseInt(AQI4));
	  status5= status_generator(parseInt(AQI5));

	  conv.ask(new Carousel({
		items: {
		'冬山': {
		  title: '冬山',
		  description: status1,
		  image: new Image({url: picurl1,alt: 'Image alternate text',}),},
		'宜蘭': {
		  title: '宜蘭',
		  description: status2,
		  image: new Image({url: picurl2,alt: 'Image alternate text',}),},
		'花蓮': {
		  title: '花蓮',
		  description: status3,
		  image: new Image({url: picurl3,alt: 'Image alternate text',}),},
		'臺東': {
		  title: '臺東',
		  description: status4,
		  image: new Image({url: picurl4,alt: 'Image alternate text',}),},
		'關山': {
		  title: '關山',
		  description: status5,
		  image: new Image({url: picurl5,alt: 'Image alternate text',}),},
	  },
	}));  }
	  else if (option === "Outlying_island") {
		if(conv.screen){conv.ask('以下是「離島地區」的監測站列表');}
	   else{conv.ask(new SimpleResponse({               
				  speech: `<speak><p><s>以下是「離島地區」的監測站列表</s><s>選項有以下幾個<break time="0.5s"/>金門<break time="0.2s"/>馬祖<break time="0.2s"/>馬公<break time="1s"/>請選擇。</s></p></speak>`,
				  text: '以下是「離島地區」的監測站列表'}));}
	  AQI1=AQI_list[parseInt(station_array.indexOf('金門'))];
	  AQI2=AQI_list[parseInt(station_array.indexOf('馬祖'))];
	  AQI3=AQI_list[parseInt(station_array.indexOf('馬公'))];

	  picurl1= picture_generator(parseInt(AQI1));
	  picurl2= picture_generator(parseInt(AQI2));
	  picurl3= picture_generator(parseInt(AQI3));
	  status1= status_generator(parseInt(AQI1));
	  status2= status_generator(parseInt(AQI2));
	  status3= status_generator(parseInt(AQI3));

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
		'馬公': {
		  title: '馬公',
		  description: status3,
		  image: new Image({url: picurl3,alt: 'Image alternate text',}),},
	  }
	}));  }
	  else if (option === "Taipei") {

	  AQI1=AQI_list[parseInt(station_array.indexOf('士林'))];
	  AQI2=AQI_list[parseInt(station_array.indexOf('大同'))];
	  AQI3=AQI_list[parseInt(station_array.indexOf('中山'))];
	  AQI4=AQI_list[parseInt(station_array.indexOf('古亭'))];
	  AQI5=AQI_list[parseInt(station_array.indexOf('松山'))];
	  AQI6=AQI_list[parseInt(station_array.indexOf('陽明'))];
	  AQI7=AQI_list[parseInt(station_array.indexOf('萬華'))];

	  picurl1= picture_generator(parseInt(AQI1));
	  picurl2= picture_generator(parseInt(AQI2));
	  picurl3= picture_generator(parseInt(AQI3));
	  picurl4= picture_generator(parseInt(AQI4));
	  picurl5= picture_generator(parseInt(AQI5));
	  picurl6= picture_generator(parseInt(AQI6));
	  picurl7= picture_generator(parseInt(AQI7));
	  status1= status_generator(parseInt(AQI1));
	  status2= status_generator(parseInt(AQI2));
	  status3= status_generator(parseInt(AQI3));
	  status4= status_generator(parseInt(AQI4));
	  status5= status_generator(parseInt(AQI5));
	  status6= status_generator(parseInt(AQI6));
	  status7= status_generator(parseInt(AQI7));
	   
		if(conv.screen){conv.ask('以下是「臺北市」的監測站列表');}
	  else{conv.ask(new SimpleResponse({               
				  speech: `<speak><p><s>以下是「臺北市」的監測站列表</s><s>選項有以下幾個<break time="0.5s"/>士林<break time="0.2s"/>大同<break time="0.2s"/>中山<break time="0.2s"/>古亭<break time="0.2s"/>松山<break time="0.2s"/>陽明<break time="0.2s"/>萬華<break time="1s"/>請選擇。</s></p></speak>`,
				  text: '以下是「臺北市」的監測站列表'}));}
	  conv.ask(new Carousel({
	  title: 'Carousel Title',
	  items: {
		'士林': {
		  title: '士林',
		  description: status1,
		  image: new Image({url: picurl1,alt: 'Image alternate text',}),},
		'大同': {
		  title: '大同',
		  description: status2,
		  image: new Image({url: picurl2,alt: 'Image alternate text',}),},
		'中山': {
		  title: '中山',
		  description: status3,
		  image: new Image({url: picurl3,alt: 'Image alternate text',}),},
		'古亭': {
		  title: '古亭',
		  description: status4,
		  image: new Image({url: picurl4,alt: 'Image alternate text',}),},
		'松山': {
		  title: '松山',
		  description: status5,
		  image: new Image({url: picurl5,alt: 'Image alternate text',}),},
		'陽明': {
		  title: '陽明',
		  description: status6,
		  image: new Image({url: picurl6,alt: 'Image alternate text',}),},
		'萬華': {
		  title: '萬華',
		  description: status7,
		  image: new Image({url: picurl7,alt: 'Image alternate text',}),}
	},
	}));  
	}
	  else if (option === "New_Taipei1") {
		if(conv.screen){conv.ask(new SimpleResponse({               
				  speech: `<speak><p><s>以下是「新北市」第一部分的監測站列表</s></p></speak>`,
				  text: '以下是「新北市(一)」的監測站列表'}));}
	  else{conv.ask(new SimpleResponse({               
				  speech: `<speak><p><s>以下是「新北市」第一部分的監測站列表</s><s>選項有以下幾個<break time="0.5s"/>三重<break time="0.2s"/>土城<break time="0.2s"/>永和<break time="0.2s"/>汐止<break time="0.2s"/>板橋<break time="0.2s"/>林口<break time="1s"/>請選擇。</s></p></speak>`,
				  text: '以下是「新北市」第一部分的監測站列表'}));}
	  AQI1=AQI_list[parseInt(station_array.indexOf('三重'))];
	  AQI2=AQI_list[parseInt(station_array.indexOf('土城'))];
	  AQI3=AQI_list[parseInt(station_array.indexOf('永和'))];
	  AQI4=AQI_list[parseInt(station_array.indexOf('汐止'))];
	  AQI5=AQI_list[parseInt(station_array.indexOf('板橋'))];
	  AQI6=AQI_list[parseInt(station_array.indexOf('林口'))];

	  picurl1= picture_generator(parseInt(AQI1));
	  picurl2= picture_generator(parseInt(AQI2));
	  picurl3= picture_generator(parseInt(AQI3));
	  picurl4= picture_generator(parseInt(AQI4));
	  picurl5= picture_generator(parseInt(AQI5));
	  picurl6= picture_generator(parseInt(AQI6));
	  status1= status_generator(parseInt(AQI1));
	  status2= status_generator(parseInt(AQI2));
	  status3= status_generator(parseInt(AQI3));
	  status4= status_generator(parseInt(AQI4));
	  status5= status_generator(parseInt(AQI5));
	  status6= status_generator(parseInt(AQI6));
	   
	  conv.ask(new Carousel({
	  title: 'Carousel Title',
	  items: {
		'三重': {
		  title: '三重',
		  description: status1,
		  image: new Image({url: picurl1,alt: 'Image alternate text',}),},
		'土城': {
		  title: '土城',
		  description: status2,
		  image: new Image({url: picurl2,alt: 'Image alternate text',}),},
		'永和': {
		  title: '永和',
		  description: status3,
		  image: new Image({url: picurl3,alt: 'Image alternate text',}),},
		'汐止': {
		  title: '汐止',
		  description: status4,
		  image: new Image({url: picurl4,alt: 'Image alternate text',}),},
		'板橋': {
		  title: '板橋',
		  description: status5,
		  image: new Image({url: picurl5,alt: 'Image alternate text',}),},
		'林口': {
		  title: '林口',
		  description: status6,
		  image: new Image({url: picurl6,alt: 'Image alternate text',}),},
	},
	}));  
	conv.ask(new Suggestions('查看第二部分'));
	  }
	  else if (option === "New_Taipei2") {
	  
	  if(conv.screen){conv.ask(new SimpleResponse({               
				  speech: `<speak><p><s>以下是「新北市」第二部分的監測站列表</s></p></speak>`,
				  text: '以下是「新北市(二)」的監測站列表'}));}
	  else{conv.ask(new SimpleResponse({               
				  speech: `<speak><p><s>以下是「新北市」第二部分的監測站列表</s><s>選項有以下幾個<break time="0.5s"/>淡水<break time="0.2s"/>富貴角<break time="0.2s"/>菜寮<break time="0.2s"/>新店<break time="0.2s"/>新莊<break time="0.2s"/>萬里<break time="1s"/>請選擇。</s></p></speak>`,
				  text: '以下是「新北市」第二部分的監測站列表'}));}

	  AQI1=AQI_list[parseInt(station_array.indexOf('淡水'))];
	  AQI2=AQI_list[parseInt(station_array.indexOf('富貴角'))];
	  AQI3=AQI_list[parseInt(station_array.indexOf('菜寮'))];
	  AQI4=AQI_list[parseInt(station_array.indexOf('新店'))];
	  AQI5=AQI_list[parseInt(station_array.indexOf('新莊'))];
	  AQI6=AQI_list[parseInt(station_array.indexOf('萬里'))];

	  picurl1= picture_generator(parseInt(AQI1));
	  picurl2= picture_generator(parseInt(AQI2));
	  picurl3= picture_generator(parseInt(AQI3));
	  picurl4= picture_generator(parseInt(AQI4));
	  picurl5= picture_generator(parseInt(AQI5));
	  picurl6= picture_generator(parseInt(AQI6));
	  status1= status_generator(parseInt(AQI1));
	  status2= status_generator(parseInt(AQI2));
	  status3= status_generator(parseInt(AQI3));
	  status4= status_generator(parseInt(AQI4));
	  status5= status_generator(parseInt(AQI5));
	  status6= status_generator(parseInt(AQI6));

	  conv.ask(new Carousel({
	  title: 'Carousel Title',
	  items: {
		'淡水': {
		  title: '淡水',
		  description: status1,
		  image: new Image({url: picurl1,alt: 'Image alternate text',}),},
		'富貴角': {
		  title: '富貴角',
		  description: status2,
		  image: new Image({url: picurl2,alt: 'Image alternate text',}),},
		'菜寮': {
		  title: '菜寮',
		  description: status3,
		  image: new Image({url: picurl3,alt: 'Image alternate text',}),},
		'新店': {
		  title: '新店',
		  description: status4,
		  image: new Image({url: picurl4,alt: 'Image alternate text',}),},
		'新莊': {
		  title: '新莊',
		  description: status5,
		  image: new Image({url: picurl5,alt: 'Image alternate text',}),},
		'萬里': {
		  title: '萬里',
		  description: status6,
		  image: new Image({url: picurl6,alt: 'Image alternate text',}),},
	},
	}));  
	conv.ask(new Suggestions('查看第一部分'));
	  }
	  else if (option === "Taoyuan") {

		if(conv.screen){conv.ask('以下是「桃園市」的監測站列表');}
	  else{conv.ask(new SimpleResponse({               
				  speech: `<speak><p><s>以下是「桃園市」的監測站列表</s><s>選項有以下幾個<break time="0.5s"/>大園<break time="0.2s"/>中壢<break time="0.2s"/>平鎮<break time="0.2s"/>桃園<break time="0.2s"/>觀音工業區<break time="0.2s"/>龍潭<break time="0.2s"/>觀音<break time="1s"/>請選擇。</s></p></speak>`,
				  text: '以下是「桃園市」的監測站列表'}));}

	  AQI1=AQI_list[parseInt(station_array.indexOf('大園'))];
	  AQI2=AQI_list[parseInt(station_array.indexOf('中壢'))];
	  AQI3=AQI_list[parseInt(station_array.indexOf('平鎮'))];
	  AQI4=AQI_list[parseInt(station_array.indexOf('桃園'))];
	  AQI5=AQI_list[parseInt(station_array.indexOf('龍潭'))];
	  AQI6=AQI_list[parseInt(station_array.indexOf('觀音'))];

	  picurl1= picture_generator(parseInt(AQI1));
	  picurl2= picture_generator(parseInt(AQI2));
	  picurl3= picture_generator(parseInt(AQI3));
	  picurl4= picture_generator(parseInt(AQI4));
	  picurl5= picture_generator(parseInt(AQI5));
	  picurl6= picture_generator(parseInt(AQI6));
	  status1= status_generator(parseInt(AQI1));
	  status2= status_generator(parseInt(AQI2));
	  status3= status_generator(parseInt(AQI3));
	  status4= status_generator(parseInt(AQI4));
	  status5= status_generator(parseInt(AQI5));
	  status6= status_generator(parseInt(AQI6));
	  conv.ask(new Carousel({
		items: {
		'大園': {
		  title: '大園',
		  description: status1,
		  image: new Image({url: picurl1,alt: 'Image alternate text',}),},
		'中壢': {
		  title: '中壢',
		  description: status2,
		  image: new Image({url: picurl2,alt: 'Image alternate text',}),},
		'平鎮': {
		  title: '平鎮',
		  description: status3,
		  image: new Image({url: picurl3,alt: 'Image alternate text',}),},
		'桃園': {
		  title: '桃園',
		  description: status4,
		  image: new Image({url: picurl4,alt: 'Image alternate text',}),},
		'龍潭': {
		  title: '龍潭',
		  description: status5,
		  image: new Image({url: picurl5,alt: 'Image alternate text',}),},
		'觀音': {
		  title: '觀音',
		  description: status6,
		  image: new Image({url: picurl6,alt: 'Image alternate text',}),},
	  },
	}));  }
	  else if (option === "Hsinchu County") {

	  if(conv.screen){conv.ask('以下是「新竹縣市」的監測站列表');}
	  else{conv.ask(new SimpleResponse({               
				  speech: `<speak><p><s>以下是「新竹縣市」的監測站列表</s><s>選項有以下幾個<break time="0.5s"/>新竹<break time="0.2s"/>香山<break time="1s"/>請選擇。</s></p></speak>`,
				  text: '以下是「新竹縣市」的監測站列表'}));}

	  AQI1=AQI_list[parseInt(station_array.indexOf('新竹'))];
	  AQI2=AQI_list[parseInt(station_array.indexOf('竹東'))];
	  AQI3=AQI_list[parseInt(station_array.indexOf('湖口'))];

	  picurl1= picture_generator(parseInt(AQI1));
	  picurl2= picture_generator(parseInt(AQI2));
	  picurl3= picture_generator(parseInt(AQI3));
	  status1= status_generator(parseInt(AQI1));
	  status2= status_generator(parseInt(AQI2));
	  status3= status_generator(parseInt(AQI3));
	  conv.ask(new Carousel({
		items: {
		'新竹': {
		  title: '新竹',
		  description: status1,
		  image: new Image({url: picurl1,alt: 'Image alternate text',}),},
		'竹東': {
		  title: '竹東',
		  description: status2,
		  image: new Image({url: picurl2,alt: 'Image alternate text',}),},
		'湖口': {
		  title: '湖口',
		  description: status3,
		  image: new Image({url: picurl3,alt: 'Image alternate text',}),},  
	  },
	}));  }
	  else if (option === "Miaoli") {
	 
	 if(conv.screen){conv.ask('以下是「苗栗縣」的監測站列表');}
	  else{conv.ask(new SimpleResponse({               
				  speech: `<speak><p><s>以下是「苗栗縣」的監測站列表</s><s>選項有以下幾個<break time="0.5s"/>三義<break time="0.2s"/>苗栗<break time="0.2s"/>頭份<break time="1s"/>請選擇。</s></p></speak>`,
				  text: '以下是「苗栗縣」的監測站列表'}));}

	  AQI1=AQI_list[parseInt(station_array.indexOf('三義'))];
	  AQI2=AQI_list[parseInt(station_array.indexOf('苗栗'))];
	  AQI3=AQI_list[parseInt(station_array.indexOf('頭份'))];

	  picurl1= picture_generator(parseInt(AQI1));
	  picurl2= picture_generator(parseInt(AQI2));
	  picurl3= picture_generator(parseInt(AQI3));
	  status1= status_generator(parseInt(AQI1));
	  status2= status_generator(parseInt(AQI2));
	  status3= status_generator(parseInt(AQI3));

	  conv.ask(new Carousel({
		items: {
		'三義': {
		  title: '三義',
		  description: status1,
		  image: new Image({url: picurl1,alt: 'Image alternate text',}),},
		'苗栗': {
		  title: '苗栗',
		  description: status2,
		  image: new Image({url: picurl2,alt: 'Image alternate text',}),},
		'頭份': {
		  title: '頭份',
		  description: status3,
		  image: new Image({url: picurl3,alt: 'Image alternate text',}),},
	  },
	}));  }
	  else if (option === "Taichung") {
		
	if(conv.screen){conv.ask('以下是「臺中市」的監測站列表');}
	  else{conv.ask(new SimpleResponse({               
				  speech: `<speak><p><s>以下是「臺中市」的監測站列表</s><s>選項有以下幾個<break time="0.5s"/>大里<break time="0.2s"/>西屯<break time="0.2s"/>沙鹿<break time="0.2s"/>忠明<break time="0.2s"/>豐原<break time="1s"/>請選擇。</s></p></speak>`,
				  text: '以下是「臺中市」的監測站列表'}));}

	  AQI1=AQI_list[parseInt(station_array.indexOf('大里'))];
	  AQI2=AQI_list[parseInt(station_array.indexOf('西屯'))];
	  AQI3=AQI_list[parseInt(station_array.indexOf('沙鹿'))];
	  AQI4=AQI_list[parseInt(station_array.indexOf('忠明'))];
	  AQI5=AQI_list[parseInt(station_array.indexOf('豐原'))];

	  picurl1= picture_generator(parseInt(AQI1));
	  picurl2= picture_generator(parseInt(AQI2));
	  picurl3= picture_generator(parseInt(AQI3));
	  picurl4= picture_generator(parseInt(AQI4));
	  picurl5= picture_generator(parseInt(AQI5));
	  status1= status_generator(parseInt(AQI1));
	  status2= status_generator(parseInt(AQI2));
	  status3= status_generator(parseInt(AQI3));
	  status4= status_generator(parseInt(AQI4));
	  status5= status_generator(parseInt(AQI5));

	  conv.ask(new Carousel({
		items: {
		'大里': {
		  title: '大里',
		  description: status1,
		  image: new Image({url: picurl1,alt: 'Image alternate text',}),},
		'西屯': {
		  title: '西屯',
		  description: status2,
		  image: new Image({url: picurl2,alt: 'Image alternate text',}),},
		'沙鹿': {
		  title: '沙鹿',
		  description: status3,
		  image: new Image({url: picurl3,alt: 'Image alternate text',}),},
		'忠明': {
		  title: '忠明',
		  description: status4,
		  image: new Image({url: picurl4,alt: 'Image alternate text',}),},
		'豐原': {
		  title: '豐原',
		  description: status5,
		  image: new Image({url: picurl5,alt: 'Image alternate text',}),},
	  },
	}));  }
	  else if (option === "Changhua") {
	  
		if(conv.screen){conv.ask('以下是「彰化縣」的監測站列表');}
	  else{conv.ask(new SimpleResponse({               
				  speech: `<speak><p><s>以下是「彰化縣」的監測站列表</s><s>選項有以下幾個<break time="0.5s"/>二林<break time="0.2s"/>彰化<break time="0.2s"/>大城<break time="0.2s"/>線西<break time="1s"/>請選擇。</s></p></speak>`,
				  text: '以下是「彰化縣」的監測站列表'}));}

	  AQI1=AQI_list[parseInt(station_array.indexOf('二林'))];
	  AQI2=AQI_list[parseInt(station_array.indexOf('彰化'))];
	  AQI3=AQI_list[parseInt(station_array.indexOf('線西'))];

	  picurl1= picture_generator(parseInt(AQI1));
	  picurl2= picture_generator(parseInt(AQI2));
	  picurl3= picture_generator(parseInt(AQI3));
	  status1= status_generator(parseInt(AQI1));
	  status2= status_generator(parseInt(AQI2));
	  status3= status_generator(parseInt(AQI3));

	  conv.ask(new Carousel({
		items: {
		'二林': {
		  title: '二林',
		  description: status1,
		  image: new Image({url: picurl1,alt: 'Image alternate text',}),},
		'彰化': {
		  title: '彰化',
		  description: status2,
		  image: new Image({url: picurl2,alt: 'Image alternate text',}),},
		'線西': {
		  title: '線西',
		  description: status3,
		  image: new Image({url: picurl3,alt: 'Image alternate text',}),},
	  },
	}));  }
	  else if (option === "Nantou") {

	  if(conv.screen){conv.ask('以下是「南投縣」的監測站列表');}
	  else{conv.ask(new SimpleResponse({               
				  speech: `<speak><p><s>以下是「南投縣」的監測站列表</s><s>選項有以下幾個<break time="0.5s"/>竹山<break time="0.2s"/>南投<break time="0.2s"/>埔里<break time="1s"/>請選擇。</s></p></speak>`,
				  text: '以下是「南投縣」的監測站列表'}));}

	  AQI1=AQI_list[parseInt(station_array.indexOf('竹山'))];
	  AQI2=AQI_list[parseInt(station_array.indexOf('南投'))];
	  AQI3=AQI_list[parseInt(station_array.indexOf('埔里'))];

	  picurl1= picture_generator(parseInt(AQI1));
	  picurl2= picture_generator(parseInt(AQI2));
	  picurl3= picture_generator(parseInt(AQI3));
	  status1= status_generator(parseInt(AQI1));
	  status2= status_generator(parseInt(AQI2));
	  status3= status_generator(parseInt(AQI3));

	  conv.ask(new Carousel({
		items: {
		'竹山': {
		  title: '竹山',
		  description: status1,
		  image: new Image({url: picurl1,alt: 'Image alternate text',}),},
		'南投': {
		  title: '南投',
		  description: status2,
		  image: new Image({url: picurl2,alt: 'Image alternate text',}),},
		'埔里': {
		  title: '埔里',
		  description: status3,
		  image: new Image({url: picurl3,alt: 'Image alternate text',}),},
	  },
	}));  }
	  else if (option === "Yunlin") {
	   
	   if(conv.screen){conv.ask('以下是「雲林縣」的監測站列表');}
	  else{conv.ask(new SimpleResponse({               
				  speech: `<speak><p><s>以下是「雲林縣」的監測站列表</s><s>選項有以下幾個<break time="0.5s"/>斗六<break time="0.2s"/>崙背<break time="0.2s"/>麥寮<break time="0.2s"/>臺西<break time="1s"/>請選擇。</s></p></speak>`,
				  text: '以下是「雲林縣」的監測站列表'}));}

	  AQI1=AQI_list[parseInt(station_array.indexOf('斗六'))];
	  AQI2=AQI_list[parseInt(station_array.indexOf('崙背'))];
	  AQI3=AQI_list[parseInt(station_array.indexOf('麥寮'))];
	  AQI4=AQI_list[parseInt(station_array.indexOf('臺西'))];

	  picurl1= picture_generator(parseInt(AQI1));
	  picurl2= picture_generator(parseInt(AQI2));
	  picurl3= picture_generator(parseInt(AQI3));
	  picurl4= picture_generator(parseInt(AQI4));
	  status1= status_generator(parseInt(AQI1));
	  status2= status_generator(parseInt(AQI2));
	  status3= status_generator(parseInt(AQI3));
	  status4= status_generator(parseInt(AQI4));

	  conv.ask(new Carousel({
		items: {
		'斗六': {
		  title: '斗六',
		  description: status1,
		  image: new Image({url: picurl1,alt: 'Image alternate text',}),},
		'崙背': {
		  title: '崙背',
		  description: status2,
		  image: new Image({url: picurl2,alt: 'Image alternate text',}),},
		'麥寮': {
		  title: '麥寮',
		  description: status3,
		  image: new Image({url: picurl3,alt: 'Image alternate text',}),},
		'臺西': {
		  title: '臺西',
		  description: status4,
		  image: new Image({url: picurl4,alt: 'Image alternate text',}),},
	  },
	}));  }
	  else if (option === "Chiayi County") {
		if(conv.screen){conv.ask('以下是「嘉義縣市」的監測站列表');}
	  else{conv.ask(new SimpleResponse({               
				  speech: `<speak><p><s>以下是「嘉義縣市」的監測站列表</s><s>選項有以下幾個<break time="0.5s"/>嘉義<break time="0.2s"/>朴子<break time="0.2s"/>新港<break time="1s"/>請選擇。</s></p></speak>`,
				  text: '以下是「嘉義縣市」的監測站列表'}));}

	  AQI1=AQI_list[parseInt(station_array.indexOf('嘉義'))];
	  AQI2=AQI_list[parseInt(station_array.indexOf('朴子'))];
	  AQI3=AQI_list[parseInt(station_array.indexOf('新港'))];

	  picurl1= picture_generator(parseInt(AQI1));
	  picurl2= picture_generator(parseInt(AQI2));
	  picurl3= picture_generator(parseInt(AQI3));
	  status1= status_generator(parseInt(AQI1));
	  status2= status_generator(parseInt(AQI2));
	  status3= status_generator(parseInt(AQI3));

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
		'新港': {
		  title: '新港',
		  description: status3,
		  image: new Image({url: picurl3,alt: 'Image alternate text',}),},
	  },
	}));  }
	  else if (option === "Tainan") {

	  if(conv.screen){conv.ask('以下是「臺南市」的監測站列表');}
	  else{conv.ask(new SimpleResponse({               
				  speech: `<speak><p><s>以下是「臺南市」的監測站列表</s><s>選項有以下幾個<break time="0.5s"/>安南<break time="0.2s"/>善化<break time="0.2s"/>新營<break time="0.2s"/>臺南<break time="0.2s"/>麻豆<break time="1s"/>請選擇。</s></p></speak>`,
				  text: '以下是「臺南市」的監測站列表'}));}

	  AQI1=AQI_list[parseInt(station_array.indexOf('安南'))];
	  AQI2=AQI_list[parseInt(station_array.indexOf('善化'))];
	  AQI3=AQI_list[parseInt(station_array.indexOf('新營'))];
	  AQI4=AQI_list[parseInt(station_array.indexOf('臺南'))];

	  picurl1= picture_generator(parseInt(AQI1));
	  picurl2= picture_generator(parseInt(AQI2));
	  picurl3= picture_generator(parseInt(AQI3));
	  picurl4= picture_generator(parseInt(AQI4));
	  status1= status_generator(parseInt(AQI1));
	  status2= status_generator(parseInt(AQI2));
	  status3= status_generator(parseInt(AQI3));
	  status4= status_generator(parseInt(AQI4));
	  
	  conv.ask(new Carousel({
		items: {
		'安南': {
		  title: '安南',
		  description: status1,
		  image: new Image({url: picurl1,alt: 'Image alternate text',}),},
		'善化': {
		  title: '善化',
		  description: status2,
		  image: new Image({url: picurl2,alt: 'Image alternate text',}),},
		'新營': {
		  title: '新營',
		  description: status3,
		  image: new Image({url: picurl3,alt: 'Image alternate text',}),},
		'臺南': {
		  title: '臺南',
		  description: status4,
		  image: new Image({url: picurl4,alt: 'Image alternate text',}),},
	  },
	}));  }
	  else if (option === "NKaohsiung") {

	  if(conv.screen){conv.ask('以下是「北高雄」的監測站列表');}
	  else{conv.ask(new SimpleResponse({               
				  speech: `<speak><p><s>以下是「北高雄」的監測站列表</s><s>選項有以下幾個<break time="0.5s"/>美濃<break time="0.2s"/>橋頭<break time="0.2s"/>楠梓<break time="0.2s"/>仁武<break time="0.2s"/>左營<break time="0.2s"/>前金<break time="1s"/>請選擇。</s></p></speak>`,
				  text: '以下是「北高雄」的監測站列表'}));}

	  AQI1=AQI_list[parseInt(station_array.indexOf('美濃'))];
	  AQI2=AQI_list[parseInt(station_array.indexOf('橋頭'))];
	  AQI3=AQI_list[parseInt(station_array.indexOf('楠梓'))];
	  AQI4=AQI_list[parseInt(station_array.indexOf('仁武'))];
	  AQI5=AQI_list[parseInt(station_array.indexOf('左營'))];
	  AQI6=AQI_list[parseInt(station_array.indexOf('前金'))];

	  picurl1= picture_generator(parseInt(AQI1));
	  picurl2= picture_generator(parseInt(AQI2));
	  picurl3= picture_generator(parseInt(AQI3));
	  picurl4= picture_generator(parseInt(AQI4));
	  picurl5= picture_generator(parseInt(AQI5));
	  picurl6= picture_generator(parseInt(AQI6));
	  status1= status_generator(parseInt(AQI1));
	  status2= status_generator(parseInt(AQI2));
	  status3= status_generator(parseInt(AQI3));
	  status4= status_generator(parseInt(AQI4));
	  status5= status_generator(parseInt(AQI5));
	  status6= status_generator(parseInt(AQI6));

	  conv.ask(new Carousel({
	  title: 'Carousel Title',
	  items: {
		'美濃': {
		  title: '美濃',
		  description: status1,
		  image: new Image({url: picurl1,alt: 'Image alternate text',}),},
		'橋頭': {
		  title: '橋頭',
		  description: status2,
		  image: new Image({url: picurl2,alt: 'Image alternate text',}),},
		'楠梓': {
		  title: '楠梓',
		  description: status3,
		  image: new Image({url: picurl3,alt: 'Image alternate text',}),},
		'仁武': {
		  title: '仁武',
		  description: status4,
		  image: new Image({url: picurl4,alt: 'Image alternate text',}),},
		'左營': {
		  title: '左營',
		  description: status5,
		  image: new Image({url: picurl5,alt: 'Image alternate text',}),},
		'前金': {
		  title: '前金',
		  description: status6,
		  image: new Image({url: picurl6,alt: 'Image alternate text',}),},
	}, }));
		conv.ask(new Suggestions('查看南高雄'));

	  }  
	  else if (option === "SKaohsiung") {

	  if(conv.screen){conv.ask('以下是「南高雄」的監測站列表');}
	  else{conv.ask(new SimpleResponse({               
				  speech: `<speak><p><s>以下是「南高雄」的監測站列表</s><s>選項有以下幾個<break time="0.5s"/>鳳山<break time="0.2s"/>復興<break time="0.2s"/>前鎮<break time="0.2s"/>小港<break time="0.2s"/>大寮<break time="0.2s"/>林園<break time="1s"/>請選擇。</s></p></speak>`,
				  text: '以下是「南高雄」的監測站列表'}));}

	  AQI1=AQI_list[parseInt(station_array.indexOf('鳳山'))];
	  AQI2=AQI_list[parseInt(station_array.indexOf('復興'))];
	  AQI3=AQI_list[parseInt(station_array.indexOf('前鎮'))];
	  AQI4=AQI_list[parseInt(station_array.indexOf('小港'))];
	  AQI5=AQI_list[parseInt(station_array.indexOf('大寮'))];
	  AQI6=AQI_list[parseInt(station_array.indexOf('林園'))];

	  picurl1= picture_generator(parseInt(AQI1));
	  picurl2= picture_generator(parseInt(AQI2));
	  picurl3= picture_generator(parseInt(AQI3));
	  picurl4= picture_generator(parseInt(AQI4));
	  picurl5= picture_generator(parseInt(AQI5));
	  picurl6= picture_generator(parseInt(AQI6));
	  status1= status_generator(parseInt(AQI1));
	  status2= status_generator(parseInt(AQI2));
	  status3= status_generator(parseInt(AQI3));
	  status4= status_generator(parseInt(AQI4));
	  status5= status_generator(parseInt(AQI5));
	  status6= status_generator(parseInt(AQI6));

		 conv.ask(new Carousel({
	  title: 'Carousel Title',
	  items: {
		'鳳山': {
		  title: '鳳山',
		  description: status1,
		  image: new Image({url: picurl1,alt: 'Image alternate text',}),},
		'復興': {
		  title: '復興',
		  description: status2,
		  image: new Image({url: picurl2,alt: 'Image alternate text',}),},
		'前鎮': {
		  title: '前鎮',
		  description: status3,
		  image: new Image({url: picurl3,alt: 'Image alternate text',}),},
		'小港': {
		  title: '小港',
		  description: status4,
		  image: new Image({url: picurl4,alt: 'Image alternate text',}),},
		'大寮': {
		  title: '大寮',
		  description: status5,
		  image: new Image({url: picurl5,alt: 'Image alternate text',}),},
		'林園': {
		  title: '林園',
		  description: status6,
		  image: new Image({url: picurl6,alt: 'Image alternate text',}),},
	},}));
			conv.ask(new Suggestions('查看北高雄'));
	}
	  else if (option === "Pingtung") {

	  if(conv.screen){conv.ask('以下是「屏東縣」的監測站列表');}
	  else{conv.ask(new SimpleResponse({               
				  speech: `<speak><p><s>以下是「屏東縣」的監測站列表</s><s>選項有以下幾個<break time="0.5s"/>屏東<break time="0.2s"/>恆春<break time="0.2s"/>潮州<break time="1s"/>請選擇。</s></p></speak>`,
				  text: '以下是「屏東縣」的監測站列表'}));}

	  AQI1=AQI_list[parseInt(station_array.indexOf('屏東'))];
	  AQI2=AQI_list[parseInt(station_array.indexOf('恆春'))];
	  AQI3=AQI_list[parseInt(station_array.indexOf('潮州'))];

	  picurl1= picture_generator(parseInt(AQI1));
	  picurl2= picture_generator(parseInt(AQI2));
	  picurl3= picture_generator(parseInt(AQI3));
	  status1= status_generator(parseInt(AQI1));
	  status2= status_generator(parseInt(AQI2));
	  status3= status_generator(parseInt(AQI3));

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
		'潮州': {
		  title: '潮州',
		  description: status3,
		  image: new Image({url: picurl3,alt: 'Image alternate text',}),},
	},
	  }));}
	 else if(option === "Mobile_Van"){
	  if(conv.screen){conv.ask('以下是「行動測站」列表，\n實際資訊供應可能隨時間變化。');}
	  else{conv.ask(new SimpleResponse({               
				  speech: `<speak><p><s>抱歉，在音箱上不支援搜尋「行動測站」</s><s>請試著提問來查詢縣市列表</s></p></speak>`,
				  text: '以下是「行動測站」列表，實際資訊供應可能發生變動。'}));}
		 
	  AQI1=AQI_list[parseInt(station_array.indexOf('新北(樹林)'))];
	  AQI2=AQI_list[parseInt(station_array.indexOf('桃園(觀音工業區)'))];
	  AQI3=AQI_list[parseInt(station_array.indexOf('彰化(大城)'))];
	  AQI4=AQI_list[parseInt(station_array.indexOf('臺南(麻豆)'))];
	  AQI5=AQI_list[parseInt(station_array.indexOf('高雄(楠梓)'))];
	  AQI6=AQI_list[parseInt(station_array.indexOf('高雄(左營)'))];
	  AQI7=AQI_list[parseInt(station_array.indexOf('屏東(琉球)'))];

	  picurl1= picture_generator(parseInt(AQI1));
	  picurl2= picture_generator(parseInt(AQI2));
	  picurl3= picture_generator(parseInt(AQI3));
	  picurl4= picture_generator(parseInt(AQI4));
	  picurl5= picture_generator(parseInt(AQI5));
	  picurl6= picture_generator(parseInt(AQI6));
	  picurl7= picture_generator(parseInt(AQI7));
	  
	  status1= status_generator(parseInt(AQI1));
	  status2= status_generator(parseInt(AQI2));
	  status3= status_generator(parseInt(AQI3));
	  status4= status_generator(parseInt(AQI4));
	  status5= status_generator(parseInt(AQI5));
	  status6= status_generator(parseInt(AQI6));
	  status7= status_generator(parseInt(AQI7));
	   
	  conv.ask(new Carousel({
	  title: 'Carousel Title',
	  items: {
		'新北(樹林)': {
		  title: '新北(樹林)',
		  description: status1,
		  image: new Image({url: picurl1,alt: 'Image alternate text',}),},
		'桃園(觀音工業區)': {
		  title: '桃園(觀音工業區)',
		  description: status2,
		  image: new Image({url: picurl2,alt: 'Image alternate text',}),},
		'彰化(大城)': {
		  title: '彰化(大城)',
		  description: status3,
		  image: new Image({url: picurl3,alt: 'Image alternate text',}),},
		'臺南(麻豆)': {
		  title: '臺南(麻豆)',
		  description: status4,
		  image: new Image({url: picurl4,alt: 'Image alternate text',}),},
		'高雄(楠梓)': {
		  title: '高雄(楠梓)',
		  description: status5,
		  image: new Image({url: picurl5,alt: 'Image alternate text',}),},
		'高雄(左營)': {
		  title: '高雄(左營)',
		  description: status6,
		  image: new Image({url: picurl6,alt: 'Image alternate text',}),},
		'屏東(琉球)': {
		  title: '屏東(琉球)',
		  description: status7,
		  image: new Image({url: picurl7,alt: 'Image alternate text',}),},
	},
	}));
	 conv.user.storage.mobile_van=true;

	}
	else{
		conv.ask(new SimpleResponse({               
				  speech: `<speak><p><s>糟糕，查詢似乎發生錯誤。請稍後再試。</s></p></speak>`,
	text: '發生錯誤，請稍後再試一次。'}));   conv.close(new BasicCard({  
	image: new Image({url:"https://dummyimage.com/1037x539/ef2121/ffffff.png&text=錯誤",alt:'Pictures',}),
	title:'數據加載發生問題',
	subtitle:'請過一段時間後再回來查看', display: 'CROPPED',
	  })); 
	 }
	// conv.ask(new Suggestions(eicon[parseInt(Math.random()*2)]+'最近的測站'));

	}
	else if(station_array.indexOf(option)!==-1){
	conv.contexts.set(NotifyContexts.parameter, 1);
	
	indexnumber=station_array.indexOf(option); //取得監測站對應的編號	
	AQI=AQI_list[parseInt(indexnumber)];Pollutant=Pollutant_list[parseInt(indexnumber)];
	PM10=PM10_list[parseInt(indexnumber)];
	PM25=PM25_list[parseInt(indexnumber)];
	O3=O3_list[parseInt(indexnumber)];
	Status= status_generator(parseInt(AQI));

	if(Status!=="有效數據不足"){

	if(AQI>=0&&AQI<=50){picture= "https://dummyimage.com/1037x539/1e9165/ffffff.png&text="+AQI;}
	else if(AQI>=51&&AQI<=100){picture= "https://dummyimage.com/1037x539/fc920b/ffffff.png&text="+AQI;}
	else if(AQI>=101&&AQI<=150){picture= "https://dummyimage.com/1037x539/ef4621/ffffff.png&text="+AQI;}
	else if(AQI>=151&&AQI<=199){picture= "https://dummyimage.com/1037x539/b71411/ffffff.png&text="+AQI;}
	else if(AQI>=200&&AQI<=300){picture= "https://dummyimage.com/1037x539/5b0e31/ffffff.png&text="+AQI;}
	else if(AQI>301){picture= "https://dummyimage.com/1037x539/4f1770/ffffff.png&text="+AQI;}

	if(AQI>=0&&AQI<=50){info= "對一般民眾身體健康無影響。";}
	else if(AQI>=51&&AQI<=100){info= "可能對極敏感族群產生咳嗽或呼吸急促等症狀，但仍可正常戶外活動。";}
	else if(AQI>=101&&AQI<=150){info= "若出現眼痛，咳嗽或喉嚨痛等症狀，英減少戶外活動，避免在戶外劇烈運動，敏感族群必要外出時英配戴口罩。";}
	else if(AQI>=151&&AQI<=199){info= "若出現眼痛，咳嗽或喉嚨痛等症狀，英減少體力消耗及戶外活動，在戶外避免長時間劇烈運動，敏感族群建議留在室內並減少體力消耗活動，必要外出英配戴口罩。"}
	else if(AQI>=200&&AQI<=300){info= "對敏感族群會有明顯惡化的現象，建議留在室內並減少體力消耗活動；一般大眾則視身體狀況，可能產生眼睛不適、氣喘、咳嗽、痰多、喉痛等症狀。";}
	else if(AQI>301){info= "健康威脅達到緊急，所有人都可能受到影響。應避免戶外活動，室內應緊閉門窗，必要外出應配戴口罩等防護用具。應避免戶外活動，室內應緊閉門窗，必要外出應配戴口罩等防護用具。";}

	if(AQI>=0&&AQI<=50){info_output= "對一般民眾身體健康無影響。";}
	else if(AQI>=51&&AQI<=100){info_output= "極特殊敏感族群建議注意  \n可能產生的咳嗽或呼吸急促症狀。";}
	else if(AQI>=101&&AQI<=150){info_output= "1.一般民眾如果有不適，應考慮減少戶外活動。  \n2.學生仍可進行戶外活動，但建議減少長時間劇烈運動。  \n3.有心臟、呼吸道及心血管疾病患者、孩童及老年人，建議減少體力消耗活動及戶外活動，外出應配戴口罩。  \n4.具有氣喘的人可能需增加使用吸入劑的頻率。";}
	else if(AQI>=151&&AQI<=199){info_output= "1.一般民眾如果有不適，應減少體力消耗及戶外活動。  \n2.學生應避免長時間劇烈運動並增加休息時間。  \n3.有心臟、呼吸道及心血管疾病患者、孩童及老年人，建議留在室內減少體力消耗活動，外出應配戴口罩。  \n4.具有氣喘的人可能需增加使用吸入劑的頻率。"}
	else if(AQI>=200&&AQI<=300){info_output= "1.一般民眾應減少戶外活動。  \n2.學生應立即停止戶外活動，並將課程調整於室內進行。  \n3.有心臟、呼吸道及心血管疾病患者、孩童及老年人應留在室內並減少體力消耗活動，外出應配戴口罩。  \n4.具有氣喘的人應增加使用吸入劑的頻率。";}
	else if(AQI>301){info_output= "1.一般民眾應避免戶外活動，室內應緊閉門窗，必要外出應配戴口罩等防護用具。  \n2.學生應立即停止戶外活動，並將課程調整於室內進行。  \n3.有心臟、呼吸道及心血管疾病患者、孩童及老年人應留在室內並避免體力消耗活動，外出應配戴口罩。  \n4.具有氣喘的人應增加使用吸入劑的頻率。";}

    if(option.indexOf('(')!==-1){
	option=option.split('(')[1];
	option=replaceString(option, ')', '');
	}
	if(AQI>=0&&AQI<=50){
	conv.ask(new SimpleResponse({               
				  speech: `<speak><p><s>根據最新資料顯示，${option}監測站的AQI指數為${AQI}</s><s>您可放心出外活動!</s></p></speak>`,
			  text: '以下為該監測站的詳細資訊，\n您可放心出外活動!'}));}
		else if(AQI>50){
	   conv.ask(new SimpleResponse({               
	  speech: `<speak><p><s>根據最新資料顯示，${option}監測站的AQI指數為${AQI}</s><s>主要汙染源來自${replaceString(Pollutant, '八小時', '')}</s><s>${info}</s></p></speak>`,
			  text: '以下為該監測站的詳細資訊。'}));}

    output_title='「'+option+'」空氣品質'+Status;
	if(AQI>50){
		if(	Pollutant==="臭氧八小時"){Pollutant="臭氧 (O₃)";}
		else if(Pollutant==="細懸浮微粒"){Pollutant="細懸浮微粒(PM₂.₅)";}
		else if(Pollutant==="懸浮微粒"){Pollutant="懸浮微粒(PM₁₀)";}
		output_title=output_title+'\n主要汙染源 '+Pollutant;
	}
			  
	if(conv.screen){
	conv.ask(new BasicCard({  
	image: new Image({url:picture,alt:'Pictures',}),
	title:output_title,display: 'CROPPED',
	text:info_output+'  \n  \nPM₁₀ '+PM10+'(μg/m³) • PM₂.₅ '+PM25+'(μg/m³) • 臭氧 '+O3+'(ppb)  \n**測站資訊發布時間** • '+replaceString(PublishTime, '-', '/'),})); 
    
	if(conv.user.storage.mobile_van===true){conv.user.storage.mobile_van=false;}	
	else{conv.ask(new Suggestions('把它加入日常安排'));}
	}else{conv.close(`<speak><p><s>歡迎你隨時回來查詢，下次見</s></p></speak>`);}
  }else{
		conv.ask(new SimpleResponse({               
				  speech: `<speak><p><s>由於${option}監測站正處於維修狀態或數據不足。我無法提供你最新資訊。</s></p></speak>`,
	text: '以下為「'+option+'」監測站的詳細資訊'}));if(conv.screen){
	conv.ask(new BasicCard({  
	image: new Image({url:"https://dummyimage.com/1037x539/232830/ffffff.png&text=NaN",alt:'Pictures',}),
	title:'有效數據不足',
	text:'設備維護、儀器校正、儀器異常、傳輸異常、電力異常 \n或有效數據不足等需查修維護情形，以致資料暫時中斷服務。  \n  \nPM₁₀ '+PM10+'(μg/m³) • PM₂.₅ '+PM25+'(μg/m³) • 臭氧 '+O3+'(ppb)  \n**測站資訊發布時間** • '+replaceString(PublishTime, '-', '/'),
	display: 'CROPPED',
		 })); 
	 conv.ask(new Suggestions('把它加入日常安排'));}else{conv.close(`<speak><p><s>歡迎你隨時回來查詢，下次見</s></p></speak>`);}

	  }
	}
	else if(origin_station_array.indexOf(option)!==-1){
		conv.ask(new SimpleResponse({               
				  speech: `<speak><p><s>由於${option}監測站正處於維修狀態或數據不足。我無法提供你最新資訊。</s></p></speak>`,
	text: '以下為「'+option+'」監測站的詳細資訊'}));if(conv.screen){
	conv.ask(new BasicCard({  
	image: new Image({url:"https://dummyimage.com/1037x539/232830/ffffff.png&text=NaN",alt:'Pictures',}),
	title:'有效數據不足',
	text:'設備維護、儀器校正、儀器異常、傳輸異常、電力異常 \n或有效數據不足等需查修維護情形，以致資料暫時中斷服務。  \n  \n**測站資訊發布時間** • '+replaceString(PublishTime, '-', '/'),
	display: 'CROPPED',})); 
	 conv.ask(new Suggestions('把它加入日常安排'));}else{conv.close(`<speak><p><s>歡迎你隨時回來查詢，下次見</s></p></speak>`);}
	 }
    else if(option==="🌎 最近的測站"){
	 conv.contexts.set(AppContexts.LOCATION, 1);	
	 conv.data.requestedPermission = 'DEVICE_PRECISE_LOCATION';
	return conv.ask(new Permission({
	context: "在繼續操作前，建議你開啟裝置上的GPS功能來取得精確結果。接著，為了找到最近的測站位置",
	permissions: conv.data.requestedPermission,}));

	conv.ask(new Permission(options));

	}
	 else{
	 option="undefined";if(conv.input.type==="VOICE"){ //如果輸入是語音，則顯示錯誤處理方法
	conv.ask(new SimpleResponse({               
	  speech: `<speak><p><s>抱歉，我不懂你的意思</s><s>請試著問我<break time="0.2s"/>${word1}空氣品質如何?<break time="0.2s"/>或<break time="0.2s"/>幫我查詢${word2}</s></p></speak>`,
	  text: '試著提問來快速存取縣市列表，\n或點選建議卡片來進行操作!'}));if(conv.screen){
	 conv.ask(new BasicCard({  
	title:"語音查詢範例",
	subtitle:"以下是你可以嘗試的指令",
	text:" • *「"+word1+"空氣品質如何?」*  \n • *「幫我查詢"+word2+"」*  \n • *「我想知道"+county_array[parseInt(Math.random()*48)]+"狀況怎樣」*  \n • *「幫我找"+county_array[parseInt(Math.random()*48)]+"」*  \n • *「我想看"+county_array[parseInt(Math.random()*48)]+"」*  \n • *「"+county_array[parseInt(Math.random()*48)]+"空氣好嗎?」*  \n • *「我要查"+county_array[parseInt(Math.random()*48)]+"」*", 
	})); }
	else{ conv.ask(`<speak><p><s>或對我說<break time="0.2s"/>區域查詢<break time="0.2s"/>來進行操作</s></p></speak>`);}
	 
	 }else{conv.ask('抱歉，我不懂你的意思，\n請點選建議卡片來進行操作。');}
	 conv.ask(new Suggestions(eicon[parseInt(Math.random()*2)]+'最近的測站'));
	 }

	 if(conv.screen){
	 conv.ask(new Suggestions('回主頁面','👋 掰掰'));}
		 conv.user.storage.choose_station=option;
	     conv.data.choose_station=option;

});

	var county_array=["南投縣","連江縣","馬祖","南投","雲林縣","雲林","金門縣","金門","苗栗縣","苗栗","高雄市","高雄","嘉義市","花蓮縣","花蓮","嘉義縣","台東縣","臺東縣","台東","臺東","嘉義","基隆市","台北市","台南市","臺南市","台南","臺南","臺北市","台北","臺北","基隆","宜蘭縣","台中市","臺中市","台中","澎湖縣","澎湖","桃園市","桃園","新竹縣","新竹市","新竹","新北市","新北","宜蘭","屏東縣","屏東","彰化縣","彰化"];
	var word1="";var word2="";var word3="";

app.intent('Default Fallback Intent', (conv) => {
	word1=county_array[parseInt(Math.random()*19)];word2=county_array[20+parseInt(Math.random()*28)];

	if(conv.input.type==="VOICE"){ //如果輸入是語音，則顯示錯誤處理方法
	conv.ask(new SimpleResponse({               
				  speech: `<speak><p><s>抱歉，我不懂你的意思</s><s>請試著問我<break time="0.2s"/>${word1}空氣品質如何?<break time="0.2s"/>或<break time="0.2s"/>幫我查詢${word2}</s></p></speak>`,
	  text: '試著提問來快速存取縣市列表，\n或點選建議卡片來進行操作!'}));
	if(conv.screen){
	 conv.ask(new BasicCard({  
		title:"語音查詢範例",
		subtitle:"以下是你可以嘗試的指令",
		text:" • *「"+word1+"空氣品質如何?」*  \n • *「幫我查詢"+word2+"」*  \n • *「我想知道"+county_array[parseInt(Math.random()*48)]+"狀況怎樣」*  \n • *「幫我找"+county_array[parseInt(Math.random()*48)]+"」*  \n • *「我想看"+county_array[parseInt(Math.random()*48)]+"」*  \n • *「"+county_array[parseInt(Math.random()*48)]+"空氣好嗎?」*  \n • *「我要查"+county_array[parseInt(Math.random()*48)]+"」*", 
	}));
	conv.ask(new Suggestions(word1+'空氣品質如何?','幫我查詢'+word2));}
	else{ conv.ask(`<speak><p><s>或對我說<break time="0.2s"/>區域查詢<break time="0.2s"/>查看縣市列表</s></p></speak>`);}

	conv.noInputs = [`<speak><p><s>請試著再問一次</s><s>例如<break time="0.2s"/>${word1}空氣品質如何?`,"請試著問我要查詢的縣市","很抱歉，我幫不上忙"];	   

	 }else{
	 conv.ask('抱歉，我不懂你的意思，\n請點選建議卡片來進行操作。');
	 }
	conv.ask(new Suggestions(eicon[parseInt(Math.random()*2)]+'最近的測站','🔎依區域查詢','👋 掰掰'));
	 
});

app.intent('語音指令範例', (conv) => {
		word1=county_array[parseInt(Math.random()*19)];word2=county_array[20+parseInt(Math.random()*28)];word3=county_array[parseInt(Math.random()*48)];

	conv.ask(new SimpleResponse({               
				  speech: `<speak><p><s>在任意畫面中，你隨時都能快速查詢縣市列表</s><s>你可以試著問<break time="0.2s"/>${word1}空氣品質如何?<break time="0.2s"/>或<break time="0.2s"/>幫我查詢${word2}</s></p></speak>`,
	  text: '試著提問來快速存取縣市列表，\n以下是你可以嘗試的詢問方式!'})); conv.ask(new BasicCard({  
	title:"語音查詢範例",
	subtitle:"以下是你可以嘗試的指令",
	text:" • *「"+word1+"空氣品質如何?」*  \n • *「幫我查詢"+word2+"」*  \n • *「我想知道"+word3+"狀況怎樣」*  \n • *「幫我找"+county_array[parseInt(Math.random()*48)]+"」*  \n • *「我想看"+county_array[parseInt(Math.random()*48)]+"」*  \n • *「"+county_array[parseInt(Math.random()*48)]+"空氣好嗎?」*  \n • *「我要查"+county_array[parseInt(Math.random()*48)]+"」*", 
	}));conv.ask(new Suggestions(word1+'空氣品質如何?','幫我查詢'+word2,'我想知道'+word3+'狀況怎樣',eicon[parseInt(Math.random()*2)]+'最近的測站','🔎依區域查詢','👋 掰掰'));

});

app.intent('直接查詢', (conv,{station}) => {

database.ref('/TWair').on('value',e=>{
	Pollutant_list=e.val().Pollutant;
	AQI_list=e.val().AQI;
	PM10_list=e.val().PM10;
	PM25_list=e.val().PM25;
	O3_list=e.val().O3;
	PublishTime=e.val().PublishTime;
	station_array=e.val().SiteName;
	});

	if(indexnumber=station_array.indexOf(station)===-1){
			
		conv.ask(new SimpleResponse({               
				  speech: `<speak><p><s>抱歉，您欲查詢的監測站似乎不存在，我無法提供你最新資訊。</s></p></speak>`,
		text: '抱歉，我無法提供協助。'}));
	 conv.close(new BasicCard({  
			image: new Image({url:"https://dummyimage.com/1037x539/232830/ffffff.png&text=NaN",alt:'Pictures',}),
			title:'找不到您指定的測站',
			subtitle:'請確認輸入的測站是否有誤', display: 'CROPPED',
	  })); 
	 }
	 else{
	   if((typeof AQI_list[0]==="undefined")!==true){
	indexnumber=station_array.indexOf(station); //取得監測站對應的編號

	AQI=AQI_list[parseInt(indexnumber)];
	Pollutant=Pollutant_list[parseInt(indexnumber)];
	Status= status_generator(parseInt(AQI));
	PM10=PM10_list[parseInt(indexnumber)];
	PM25=PM25_list[parseInt(indexnumber)];
	O3=O3_list[parseInt(indexnumber)];

	if(Status!=="有效數據不足"){

	if(AQI>=0&&AQI<=50){picture= "https://dummyimage.com/1037x539/1e9165/ffffff.png&text="+AQI;}
	else if(AQI>=51&&AQI<=100){picture= "https://dummyimage.com/1037x539/fc920b/ffffff.png&text="+AQI;}
	else if(AQI>=101&&AQI<=150){picture= "https://dummyimage.com/1037x539/ef4621/ffffff.png&text="+AQI;}
	else if(AQI>=151&&AQI<=199){picture= "https://dummyimage.com/1037x539/b71411/ffffff.png&text="+AQI;}
	else if(AQI>=200&&AQI<=300){picture= "https://dummyimage.com/1037x539/5b0e31/ffffff.png&text="+AQI;}
	else if(AQI>301){picture= "https://dummyimage.com/1037x539/4f1770/ffffff.png&text="+AQI;}

	if(AQI>=0&&AQI<=50){info= "對一般民眾身體健康無影響。";}
	else if(AQI>=51&&AQI<=100){info= "可能對極敏感族群產生咳嗽或呼吸急促等症狀，但仍可正常戶外活動。";}
	else if(AQI>=101&&AQI<=150){info= "若出現眼痛，咳嗽或喉嚨痛等症狀，英減少戶外活動，避免在戶外劇烈運動，敏感族群必要外出時英配戴口罩。";}
	else if(AQI>=151&&AQI<=199){info= "若出現眼痛，咳嗽或喉嚨痛等症狀，英減少體力消耗及戶外活動，在戶外避免長時間劇烈運動，敏感族群建議留在室內並減少體力消耗活動，必要外出英配戴口罩。"}
	else if(AQI>=200&&AQI<=300){info= "對敏感族群會有明顯惡化的現象，建議留在室內並減少體力消耗活動；一般大眾則視身體狀況，可能產生眼睛不適、氣喘、咳嗽、痰多、喉痛等症狀。";}
	else if(AQI>301){info= "健康威脅達到緊急，所有人都可能受到影響。應避免戶外活動，室內應緊閉門窗，必要外出應配戴口罩等防護用具。";}

	if(AQI>=0&&AQI<=50){info_output= "對一般民眾身體健康無影響。";}
	else if(AQI>=51&&AQI<=100){info_output= "極特殊敏感族群建議注意  \n可能產生的咳嗽或呼吸急促症狀。";}
	else if(AQI>=101&&AQI<=150){info_output= "1.一般民眾如果有不適，應考慮減少戶外活動。  \n2.學生仍可進行戶外活動，但建議減少長時間劇烈運動。  \n3.有心臟、呼吸道及心血管疾病患者、孩童及老年人，建議減少體力消耗活動及戶外活動，外出應配戴口罩。  \n4.具有氣喘的人可能需增加使用吸入劑的頻率。";}
	else if(AQI>=151&&AQI<=199){info_output= "1.一般民眾如果有不適，應減少體力消耗及戶外活動。  \n2.學生應避免長時間劇烈運動並增加休息時間。  \n3.有心臟、呼吸道及心血管疾病患者、孩童及老年人，建議留在室內減少體力消耗活動，外出應配戴口罩。  \n4.具有氣喘的人可能需增加使用吸入劑的頻率。"}
	else if(AQI>=200&&AQI<=300){info_output= "1.一般民眾應減少戶外活動。  \n2.學生應立即停止戶外活動，並將課程調整於室內進行。  \n3.有心臟、呼吸道及心血管疾病患者、孩童及老年人應留在室內並減少體力消耗活動，外出應配戴口罩。  \n4.具有氣喘的人應增加使用吸入劑的頻率。";}
	else if(AQI>301){info_output= "1.一般民眾應避免戶外活動，室內應緊閉門窗，必要外出應配戴口罩等防護用具。  \n2.學生應立即停止戶外活動，並將課程調整於室內進行。  \n3.有心臟、呼吸道及心血管疾病患者、孩童及老年人應留在室內並避免體力消耗活動，外出應配戴口罩。  \n4.具有氣喘的人應增加使用吸入劑的頻率。";}

	if(AQI>=0&&AQI<=50){
	conv.ask(new SimpleResponse({               
				  speech: `<speak><p><s>根據最新資料顯示，${station}監測站的AQI指數為${AQI}</s><s>您可放心出外活動!</s></p></speak>`,
			  text: '以下為該監測站的詳細資訊，\n您可放心出外活動!'}));}
	else if(AQI>50){
	   conv.ask(new SimpleResponse({               
	  speech: `<speak><p><s>根據最新資料顯示，${station}監測站的AQI指數為${AQI}</s><s>主要汙染源來自${replaceString(Pollutant, '八小時', '')}</s><s>${info}</s></p></speak>`,
			  text: '以下為該監測站的詳細資訊。'}));}

  output_title='「'+station+'」空氣品質'+Status;
	if(AQI>50){
		if(	Pollutant==="臭氧八小時"){Pollutant="臭氧 (O₃)";}
		else if(Pollutant==="細懸浮微粒"){Pollutant="細懸浮微粒(PM₂.₅)";}
		else if(Pollutant==="懸浮微粒"){Pollutant="懸浮微粒(PM₁₀)";}
		output_title=output_title+'\n主要汙染源 '+Pollutant;
	}
	 
	conv.close(new BasicCard({  
	image: new Image({url:picture,alt:'Pictures',}),
	title:output_title,display: 'CROPPED',
	text:info_output+'  \n  \nPM₁₀ '+PM10+'(μg/m³) • PM₂.₅ '+PM25+'(μg/m³) • 臭氧 '+O3+'(ppb)  \n**測站資訊發布時間** • '+replaceString(PublishTime, '-', '/'),})); 

	}
	else{
		conv.ask(new SimpleResponse({               
				  speech: `<speak><p><s>由於${station}監測站數據不足或處於維修狀態，我無法提供你最新資訊。</s></p></speak>`,
	text: '以下為「'+station+'」監測站的詳細資訊'}));   conv.close(new BasicCard({  
			image: new Image({url:"https://dummyimage.com/1037x539/232830/ffffff.png&text=NaN",alt:'Pictures',}),
			title:'有效數據不足',
	title:'有效數據不足',
	text:'設備維護、儀器校正、儀器異常、傳輸異常、電力異常 \n或有效數據不足等需查修維護情形，以致資料暫時中斷服務。  \n  \nPM₁₀ '+PM10+'(μg/m³) • PM₂.₅ '+PM25+'(μg/m³) • 臭氧 '+O3+'(ppb)  \n**測站資訊發布時間** • '+replaceString(PublishTime, '-', '/'),
		display: 'CROPPED',})); 
	}
	 }else{
		conv.ask(new SimpleResponse({               
				  speech: `<speak><p><s>糟糕，查詢似乎發生錯誤。請稍後再試。</s></p></speak>`,
	text: '發生錯誤，請稍後再試一次。'}));   conv.close(new BasicCard({  
	image: new Image({url:"https://dummyimage.com/1037x539/ef2121/ffffff.png&text=錯誤",alt:'Pictures',}),
	title:'數據加載發生問題',
	subtitle:'請過一段時間後再回來查看', display: 'CROPPED',
	  })); 
	 }
	}


});

app.intent('日常安排教學', (conv,{station}) => {

	if(station!==""){choose_station=station;}
	else{choose_station=conv.user.storage.choose_station;}
	if(station_explain.indexOf(choose_station)===-1){choose_station=station_explain[parseInt(Math.random()*81)];}
		conv.ask(new SimpleResponse({               
				  speech: `<speak><p><s>透過加入日常安排，你可以快速存取要查詢的站點。</s><s>舉例來說，如果你把${choose_station}加入日常安排。你即可隨時呼叫我查詢該站點的最新空氣品質!</s><s>以下為詳細說明</s></p></speak>`,
	text: '以下為詳細說明。'}));

		conv.ask(new BasicCard({  
			image: new Image({url:"https://i.imgur.com/82c8u4T.png",alt:'Pictures',}),
			title:'將「'+choose_station+'」加入日常安排', display: 'CROPPED',
	subtitle:'1.點擊畫面右上方大頭貼 > 點擊[設定]\n2.切換到[Google助理]分頁 > 點擊[日常安排]\n3.點擊[新增日常安排]\n4.「新增指令(必填)」輸入「空氣品質」\n5.「新增動作」輸入\n「叫空汙查詢精靈查詢'+choose_station+'站」\n6.輸入完成後點擊「儲存」\n7.現在，你可以透過說出或輸入「空氣品質」來快速查詢'+choose_station+'的AQI指數!',})); 

	conv.ask(new Suggestions(eicon[parseInt(Math.random()*2)]+'最近的測站','回主頁面','👋 掰掰'));

});

app.intent('從風向看空氣品質', (conv,{Wind_direction}) => {
	var explation="";

	if(conv.input.raw.indexOf('背風面')!==-1){Wind_direction="背風面";}
	else if(conv.input.raw.indexOf('下風處')!==-1){Wind_direction="下風處";}
	else if(conv.input.raw.indexOf('弱風環境')!==-1){Wind_direction="弱風環境";}
	else if(conv.input.raw.indexOf('背風渦旋')!==-1){Wind_direction="背風渦旋";}

	if(direction_array.indexOf(Wind_direction)!==-1){
	if(Wind_direction==="東北風"){
	explation="此類風向盛行於冬季，且風力相對較強。\n中部以北及東半部擴散條件相對較佳，空氣污染相對集中於高屏地區。"
	picture="https://airtw.epa.gov.tw/images/indexHashtag/indexHashtag_1.jpg";}
	else if(Wind_direction==="偏東風"){
	explation="在高壓出海轉高壓迴流期間，臺灣附近風向逐漸由東北風轉為偏東風。\n該風向容易因臺灣地形產生「地形繞流」。 \n此現象容易在臺灣海峽上產生一背風渦旋， \n它可能將原已擴散至海面上的污染物又再度帶往陸地，易使局部地區空氣污染物濃度上升。"
	picture="https://airtw.epa.gov.tw/images/indexHashtag/indexHashtag_3.jpg";}
	else if(Wind_direction==="偏南風"){
	explation="較常發生於夏半季，當臺灣附近風向為南風、南南東風或偏南風時，高屏及雲嘉南空氣品質通常較中部以北良好。\n此外，當高屏地區在較強的南風吹拂之下，高屏溪易有揚塵現象發生。"
	picture="https://airtw.epa.gov.tw/images/indexHashtag/indexHashtag_5.jpg";}
	else if(Wind_direction==="西南風"){
	explation="夏季盛行的西南風通常夾帶較多水氣。\n普遍來說高屏及雲嘉南位於上風處且易有降水現象，因此空氣品質良好。\n而北部位於下風處，污染物易累積於此，相對之下空氣品質較差。"
	picture="https://airtw.epa.gov.tw/images/indexHashtag/indexHashtag_6.jpg";}
    else if(Wind_direction==="偏西風"){
	explation="當臺灣附近風場為西風或偏西風時，\n西半部的空氣污染物不易往海面上移動、擴散，反而往中央山脈及內陸區域堆積，\n因此在此型態風場，西半部空氣品質相對差。\n而宜蘭位於背風側且風力通常偏弱不利污染物擴散，空氣品質也略差。"
	picture="https://airtw.epa.gov.tw/images/indexHashtag/indexHashtag_7.jpg";}
    else if(Wind_direction==="背風面"){
	explation="當風遇到地形阻擋時，地形正對風向的一側稱為迎風面，背對風向的一側稱為背風面。迎風面空氣流動較佳，大氣擴散條件較好，有相對好的空氣品質；背風面則因空氣流動較少，擴散條件相對較差。"
	picture="https://airtw.epa.gov.tw/images/pedia/pedia2_6_1.png";}
    else if(Wind_direction==="下風處"){
	explation="在空氣品質的探討中，粒狀污染物隨空氣流動、並隨著風吹往下風處，當下風處位於內陸、靠山區或是擴散條件較差時，粒狀污染物容易累積，使空氣品質相對於上風處較差。"
	picture="https://airtw.epa.gov.tw/images/pedia/pedia2_6_2.png";}
	else if(Wind_direction==="弱風環境"){
	explation="當大氣中風速偏弱時，空氣流動較差，若有空氣污染物排放源，則使當地較易累積污染物。"
	picture="https://airtw.epa.gov.tw/images/pedia/pedia2_6_3.png";}
	else if(Wind_direction==="背風渦旋"){
	explation="當氣流遇山脈或地形阻擋時，在山的背風面容易形成渦旋，渦旋的方向則不一定。當背風渦旋出現時，污染物常隨著氣流繞進此渦旋，造成污染物易累積。"
	picture="https://airtw.epa.gov.tw/images/pedia/pedia2_6_4.png";}
	conv.ask(new SimpleResponse({               
				  speech: `<speak><p><s>以下是環保署對${Wind_direction}與空氣品質關聯性的說明</s><break time="1s"/><s>${replaceString(explation, '\n', '')}</s></p></speak>`,
	  text: '以下為詳細說明。'}));    conv.ask(new BasicCard({  
			image: new Image({url:picture,alt:'Pictures',}),
			title:Wind_direction,
	subtitle:explation,
	text:"Ⓒ 圖文資訊來自 行政院環境保護署 **《空品小百科》**"})); 
		conv.ask(new Suggestions('說明其他風向',eicon[parseInt(Math.random()*2)]+'最近的測站','回主頁面','👋 掰掰'));

	}
	else{
	conv.ask(new SimpleResponse({               
				  speech: `<speak><p><s>請選擇您要我解釋的風向因素類別，共有以下九類</s><s>點擊建議卡片來取得說明</s></p></speak>`,text: '請選擇要我解釋的因素類別'}));
	conv.ask(new BasicCard({  
			title:"從風向看空氣品質",
			subtitle:"不同季節吹著相異的盛行風，\n在擁有複雜地形的臺灣易受到地形的阻擋。\n從而影響每天臺灣各地的空氣品質!",
			text:"Ⓒ 圖文資訊來自 行政院環境保護署 **《空品小百科》**",
			buttons: new Button({title: '空品小百科',url: 'https://airtw.epa.gov.tw/CHT/Encyclopedia/pedia02/pedia2.aspx',}),
	})); 
	conv.ask(new Suggestions('東北風','偏東風','偏南風','西南風','偏西風','背風面','下風處','弱風環境','背風渦旋'));
	}

});

app.intent('污染物特性及影響要素', (conv,{Pollutant_type}) => {

	var explation="";
	if(pollutant_array.indexOf(Pollutant_type)!==-1){
	if(Pollutant_type==="河川揚塵"){
	explation="當河道水位降低出現河床裸露，此時河床上細小的顆粒容易被風揚起，形成揚塵現象，進而影響當地以及下風處的空氣品質。河川揚塵好發時間通常在白天中午至傍晚風速較強的時段，當河川揚塵發生時，空氣污染物濃度可能在短時間內快速上升，但當風速減弱時，污染物濃度則又隨即降低。";
	picture="https://airtw.epa.gov.tw/images/indexHashtag/indexHashtag_20.jpg";}
	else if(Pollutant_type==="光化反應"){
	explation="人為排放的氮氧化物及易揮發性的有機物等空氣污染物因大氣中光化學作用生成臭氧等衍生性空氣污染物，光化反應產生與否與紫外線強度有關，當白天雲量偏多則不利於光化反應作用，反之雲量偏少則有利於光化反應產生，特別是在炎熱、陽光普照的情況之下，會使空氣中的臭氧濃度升高，進而影響空氣品質。";
	picture="https://airtw.epa.gov.tw/images/indexHashtag/indexHashtag_21.jpg";}
	else if(Pollutant_type==="境外汙染"){
	explation="由於臺灣位於東亞大陸空氣污染物傳輸路徑上，當東北季風盛行時，常夾帶上游的空氣污染物透過長程傳輸經過臺灣地區，進而影響臺灣的空氣品質。";
	picture="https://airtw.epa.gov.tw/images/pedia/pedia3_3_1.png";}
	else if(Pollutant_type==="降雨洗除作用"){
	explation="大氣中空氣污染物濃度因降落的雨滴洗除，但降低程度仍會受降雨強度、降雨延時、風速或附近有無污染排放等因素而定。";
	picture="https://airtw.epa.gov.tw/images/indexHashtag/indexHashtag_10.jpg";}
	else if(Pollutant_type==="混合層高度"){
	explation="混合層高度是指空氣污染物在混合層中垂直方向可擴散的高度，可表達環境大氣對空氣污染物傳輸與擴散的效果，白天溫度較高，垂直對流混合的範圍較大，使混合層高度較高，表示空氣中的污染物可擴散的垂直範圍愈大，愈容易被大氣所稀釋，因此有助於降低近地面的污染物濃度，反之夜間因溫度較低，垂直混合程度較低，因此混合層高度低，不易將污染物向垂直方向擴散。";
	picture="https://airtw.epa.gov.tw/images/indexHashtag/indexHashtag_22.png";}
	else{
	explation="若近地面有沉降氣流或是沉降逆溫時，則表示大氣垂直擴散條件不佳，污染物容易累積於近地面造成濃度上升。最常見的氣流下沉運動是當高壓籠罩或是颱風的氣流所造成的過山沉降，下沉運動可抑制垂直對流，使天氣較為穩定，大氣穩定度較高，因此擴散條件也相對較差。";
	picture="https://airtw.epa.gov.tw/images/indexHashtag/indexHashtag_19.jpg";}

	conv.ask(new SimpleResponse({               
				  speech: `<speak><p><s>以下是環保署對${Pollutant_type}與空氣品質關聯性的說明</s><break time="1s"/><s>${replaceString(explation, '\n', '')}</s></p></speak>`,
	  text: '以下為詳細說明。'}));    conv.ask(new BasicCard({  
			image: new Image({url:picture,alt:'Pictures',}),
			title:Pollutant_type,
	subtitle:explation,
	text:"Ⓒ 圖文資訊來自 行政院環境保護署 **《空品小百科》**"})); 
		conv.ask(new Suggestions('說明其他汙染因素',eicon[parseInt(Math.random()*2)]+'最近的測站','🔎依區域查詢','👋 掰掰'));

	}
	else{
	conv.ask(new SimpleResponse({               
				  speech: `<speak><p><s>請選擇您要我解釋的影響因素類別，共有以下六種</s><s>點擊建議卡片來取得說明</s></p></speak>`,text: '請選擇要我解釋的影響因素類別'}));
	conv.ask(new BasicCard({  
			title:"污染物特性及影響要素",
			subtitle:"污染物分為一次性及衍生性污染物，\n除了污染源直接排放外，特定條件下易引發污染物濃度上升，\n而這些特定條件與各種氣象要素又有密切關連!",
			text:"Ⓒ 圖文資訊來自 行政院環境保護署 **《空品小百科》**",
			buttons: new Button({title: '空品小百科',url: 'https://airtw.epa.gov.tw/CHT/Encyclopedia/pedia03/pedia3.aspx',}),
	})); 
	conv.ask(new Suggestions('河川揚塵','光化反應','境外汙染','降雨洗除作用','混合層高度','沉降作用'));
	}

});

app.intent('取得地點權限', (conv) => {

 conv.data.requestedPermission = 'DEVICE_PRECISE_LOCATION';

database.ref('/TWair').on('value',e=>{
	Pollutant_list=e.val().Pollutant;
	AQI_list=e.val().AQI;
	PM10_list=e.val().PM10;
	PM25_list=e.val().PM25;
	O3_list=e.val().O3;
	PublishTime=e.val().PublishTime;
	station_array=e.val().SiteName;
	});

	return conv.ask(new Permission({
	context: "在繼續操作前，建議你開啟裝置上的GPS功能來取得精確結果。接著，為了找到最近的測站位置",
	permissions: conv.data.requestedPermission,}));

	conv.ask(new Permission(options));
	  
});

var sitename="";

app.intent('回傳資訊', (conv, params, permissionGranted)=> {
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

	if((typeof AQI_list[0]==="undefined")!==true){
	indexnumber=station_array.indexOf(sitename); //取得監測站對應的編號

	AQI=AQI_list[parseInt(indexnumber)];
	Pollutant=Pollutant_list[parseInt(indexnumber)];
	PM10=PM10_list[parseInt(indexnumber)];
	PM25=PM25_list[parseInt(indexnumber)];
	O3=O3_list[parseInt(indexnumber)];
	Status= status_generator(parseInt(AQI));
	
	if(Status!=="有效數據不足"){
	if(AQI>=0&&AQI<=50){picture= "https://dummyimage.com/1037x539/1e9165/ffffff.png&text="+AQI;}
	else if(AQI>=51&&AQI<=100){picture= "https://dummyimage.com/1037x539/fc920b/ffffff.png&text="+AQI;}
	else if(AQI>=101&&AQI<=150){picture= "https://dummyimage.com/1037x539/ef4621/ffffff.png&text="+AQI;}
	else if(AQI>=151&&AQI<=199){picture= "https://dummyimage.com/1037x539/b71411/ffffff.png&text="+AQI;}
	else if(AQI>=200&&AQI<=300){picture= "https://dummyimage.com/1037x539/5b0e31/ffffff.png&text="+AQI;}
	else if(AQI>301){picture= "https://dummyimage.com/1037x539/4f1770/ffffff.png&text="+AQI;}

	if(AQI>=0&&AQI<=50){info= "對一般民眾身體健康無影響。";}
	else if(AQI>=51&&AQI<=100){info= "可能對極敏感族群產生咳嗽或呼吸急促等症狀，但仍可正常戶外活動。";}
	else if(AQI>=101&&AQI<=150){info= "若出現眼痛，咳嗽或喉嚨痛等症狀，英減少戶外活動，避免在戶外劇烈運動，敏感族群必要外出時英配戴口罩。";}
	else if(AQI>=151&&AQI<=199){info= "若出現眼痛，咳嗽或喉嚨痛等症狀，英減少體力消耗及戶外活動，在戶外避免長時間劇烈運動，敏感族群建議留在室內並減少體力消耗活動，必要外出英配戴口罩。"}
	else if(AQI>=200&&AQI<=300){info= "對敏感族群會有明顯惡化的現象，建議留在室內並減少體力消耗活動；一般大眾則視身體狀況，可能產生眼睛不適、氣喘、咳嗽、痰多、喉痛等症狀。";}
	else if(AQI>301){info= "健康威脅達到緊急，所有人都可能受到影響。應避免戶外活動，室內應緊閉門窗，必要外出應配戴口罩等防護用具。";}

	if(AQI>=0&&AQI<=50){info_output= "對一般民眾身體健康無影響。";}
	else if(AQI>=51&&AQI<=100){info_output= "極特殊敏感族群建議注意  \n可能產生的咳嗽或呼吸急促症狀。";}
	else if(AQI>=101&&AQI<=150){info_output= "1.一般民眾如果有不適，應考慮減少戶外活動。  \n2.學生仍可進行戶外活動，但建議減少長時間劇烈運動。  \n3.有心臟、呼吸道及心血管疾病患者、孩童及老年人，建議減少體力消耗活動及戶外活動，外出應配戴口罩。  \n4.具有氣喘的人可能需增加使用吸入劑的頻率。";}
	else if(AQI>=151&&AQI<=199){info_output= "1.一般民眾如果有不適，應減少體力消耗及戶外活動。  \n2.學生應避免長時間劇烈運動並增加休息時間。  \n3.有心臟、呼吸道及心血管疾病患者、孩童及老年人，建議留在室內減少體力消耗活動，外出應配戴口罩。  \n4.具有氣喘的人可能需增加使用吸入劑的頻率。"}
	else if(AQI>=200&&AQI<=300){info_output= "1.一般民眾應減少戶外活動。  \n2.學生應立即停止戶外活動，並將課程調整於室內進行。  \n3.有心臟、呼吸道及心血管疾病患者、孩童及老年人應留在室內並減少體力消耗活動，外出應配戴口罩。  \n4.具有氣喘的人應增加使用吸入劑的頻率。";}
	else if(AQI>301){info_output= "1.一般民眾應避免戶外活動，室內應緊閉門窗，必要外出應配戴口罩等防護用具。  \n2.學生應立即停止戶外活動，並將課程調整於室內進行。  \n3.有心臟、呼吸道及心血管疾病患者、孩童及老年人應留在室內並避免體力消耗活動，外出應配戴口罩。  \n4.具有氣喘的人應增加使用吸入劑的頻率。";}

	if(AQI>=0&&AQI<=50){
	conv.ask(new SimpleResponse({               
	  speech: `<speak><p><s>根據最新資料顯示，${sitename}監測站的AQI指數為${AQI}</s><s>您可放心出外活動!</s></p></speak>`,
	  text: '以下為該監測站的詳細資訊，\n您可放心出外活動!'}));     }
	else if(AQI>50){
	   conv.ask(new SimpleResponse({               
	  speech: `<speak><p><s>根據最新資料顯示，${sitename}監測站的AQI指數為${AQI}</s><s>主要汙染源來自${replaceString(Pollutant, '八小時', '')}</s><s>${info}</s></p></speak>`,
	  text: '以下為該監測站的詳細資訊。'}));}

	output_title='「'+sitename+'」空氣品質'+Status;
	if(AQI>50){
		if(	Pollutant==="臭氧八小時"){Pollutant="臭氧 (O₃)";}
		else if(Pollutant==="細懸浮微粒"){Pollutant="細懸浮微粒(PM₂.₅)";}
		else if(Pollutant==="懸浮微粒"){Pollutant="懸浮微粒(PM₁₀)";}
		output_title=output_title+'\n主要汙染源 '+Pollutant;}
		
	if(conv.screen){	
	conv.contexts.set(NotifyContexts.parameter, 1);

	conv.ask(new BasicCard({  
	image: new Image({url:picture,alt:'Pictures',}),
	title:output_title,display: 'CROPPED',
	text:info_output+'  \n  \nPM₁₀ '+PM10+'(μg/m³) • PM₂.₅ '+PM25+'(μg/m³) • 臭氧 '+O3+'(ppb)  \n**測站資訊發布時間** • '+replaceString(PublishTime, '-', '/'),})); 

	conv.ask(new Suggestions('把它加入日常安排'));}else{conv.close(`<speak><p><s>歡迎你隨時回來查詢，下次見</s></p></speak>`);}}

	else{
	conv.ask(new SimpleResponse({               
	  speech: `<speak><p><s>由於${sitename}監測站數據不足或處於維修狀態，我無法提供你最新資訊。</s></p></speak>`,
	text: '以下為「'+sitename+'」監測站的詳細資訊'}));
	conv.ask(new BasicCard({  
			image: new Image({url:"https://dummyimage.com/1037x539/232830/ffffff.png&text=NaN",alt:'Pictures',}),
			title:'有效數據不足',
			text:'設備維護、儀器校正、儀器異常、傳輸異常、電力異常 \n或有效數據不足等需查修維護情形，以致資料暫時中斷服務。  \n  \nPM₁₀ '+PM10+'(μg/m³) • PM₂.₅ '+PM25+'(μg/m³) • 臭氧 '+O3+'(ppb)  \n**測站資訊發布時間** • '+replaceString(PublishTime, '-', '/'),
			display: 'CROPPED',})); 
			}
	 }else{
	conv.ask(new SimpleResponse({               
	  speech: `<speak><p><s>糟糕，查詢似乎發生錯誤。</s><s>請稍後再試。</s></p></speak>`,
	text: '發生錯誤，請稍後再試一次。'}));   conv.ask(new BasicCard({  
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
	if(conv.screen){conv.ask(new Suggestions('回主頁面','👋 掰掰'));}else{conv.close(`<speak><p><s>歡迎你隨時回來查詢，下次見</s></p></speak>`);}
		conv.user.storage.choose_station=sitename;

});

app.intent('直接查詢縣市選單', (conv, {County}) => {
	
database.ref('/TWair').on('value',e=>{
	Pollutant_list=e.val().Pollutant;
	AQI_list=e.val().AQI;
	PM10_list=e.val().PM10;
	PM25_list=e.val().PM25;
	O3_list=e.val().O3;
	PublishTime=e.val().PublishTime;
	station_array=e.val().SiteName;
	});

	if(conv.input.raw.indexOf('新北')!==-1){County="新北市";}
	else if(conv.input.raw.indexOf('第一部分')!==-1||conv.input.raw.indexOf('一部分')!==-1){County="新北市第一部分";}
	else if(conv.input.raw.indexOf('第二部分')!==-1){County="新北市第二部分";}
	else if(conv.input.raw.indexOf('北高雄')!==-1){County="北高雄";}
	else if(conv.input.raw.indexOf('南高雄')!==-1){County="南高雄";}
	else if(conv.input.raw==="台東"){County="臺東";}
	
	if(conv.input.raw==="新北(樹林)"){County="新北(樹林)";}
	else if(conv.input.raw==="桃園(觀音工業區)"){County="桃園(觀音工業區)";}
	else if(conv.input.raw==="彰化(大城)"){County="彰化(大城)";}
	else if(conv.input.raw==="臺南(麻豆)"){County="臺南(麻豆)";}
	else if(conv.input.raw==="高雄(楠梓)"){County="高雄(楠梓)";}
	else if(conv.input.raw==="高雄(左營)"){County="高雄(左營)";}
	else if(conv.input.raw==="屏東(琉球)"){County="屏東(琉球)";}
	
	conv.noInputs = ["抱歉，我沒聽輕楚。請再說一次","請再說一次要查看測站名稱","很抱歉，我幫不上忙"];	   

	  if (County === "宜蘭縣") {
	  
	  if(conv.screen){conv.ask('以下是「宜蘭縣」的監測站列表');
	  }else{conv.ask(new SimpleResponse({               
				  speech: `<speak><p><s>以下是「宜蘭縣」的監測站列表</s><s>選項有以下幾個<break time="0.5s"/>冬山<break time="0.2s"/>宜蘭<break time="1s"/>請選擇。</s></p></speak>`,
	   text: '以下是「宜蘭縣」的監測站列表'}));}

	  AQI1=AQI_list[parseInt(station_array.indexOf('冬山'))];
	  AQI2=AQI_list[parseInt(station_array.indexOf('宜蘭'))];

	  picurl1= picture_generator(parseInt(AQI1));
	  picurl2= picture_generator(parseInt(AQI2));
	  status1= status_generator(parseInt(AQI1));
	  status2= status_generator(parseInt(AQI2));

	  conv.ask(new Carousel({
		items: {
		'冬山': {
		  title: '冬山',
		  description: status1,
		  image: new Image({url: picurl1,alt: 'Image alternate text',}),},
		'宜蘭': {
		  title: '宜蘭',
		  description: status2,
		  image: new Image({url: picurl2,alt: 'Image alternate text',}),},
	  },
	}));  } 
	  else if (County === "臺東縣") {
	  
	  if(conv.screen){conv.ask('以下是「臺東縣」的監測站列表');
	  }else{conv.ask(new SimpleResponse({               
				  speech: `<speak><p><s>以下是「臺東縣」的監測站列表</s><s>選項有以下幾個<break time="0.5s"/>台東<break time="0.2s"/>關山<break time="1s"/>請選擇。</s></p></speak>`,
	   text: '以下是「臺東縣」的監測站列表'}));}

	  AQI1=AQI_list[parseInt(station_array.indexOf('臺東'))];
	  AQI2=AQI_list[parseInt(station_array.indexOf('關山'))];

	  picurl1= picture_generator(parseInt(AQI1));
	  picurl2= picture_generator(parseInt(AQI2));
	  status1= status_generator(parseInt(AQI1));
	  status2= status_generator(parseInt(AQI2));

	  conv.ask(new Carousel({
		items: {
		'臺東': {
		  title: '臺東',
		  description: status1,
		  image: new Image({url: picurl1,alt: 'Image alternate text',}),},
		'關山': {
		  title: '關山',
		  description: status2,
		  image: new Image({url: picurl2,alt: 'Image alternate text',}),},
	  },
	}));  
	}
	  else if (County === "臺北市") {

	  AQI1=AQI_list[parseInt(station_array.indexOf('士林'))];
	  AQI2=AQI_list[parseInt(station_array.indexOf('大同'))];
	  AQI3=AQI_list[parseInt(station_array.indexOf('中山'))];
	  AQI4=AQI_list[parseInt(station_array.indexOf('古亭'))];
	  AQI5=AQI_list[parseInt(station_array.indexOf('松山'))];
	  AQI6=AQI_list[parseInt(station_array.indexOf('陽明'))];
	  AQI7=AQI_list[parseInt(station_array.indexOf('萬華'))];

	  picurl1= picture_generator(parseInt(AQI1));
	  picurl2= picture_generator(parseInt(AQI2));
	  picurl3= picture_generator(parseInt(AQI3));
	  picurl4= picture_generator(parseInt(AQI4));
	  picurl5= picture_generator(parseInt(AQI5));
	  picurl6= picture_generator(parseInt(AQI6));
	  picurl7= picture_generator(parseInt(AQI7));
	  status1= status_generator(parseInt(AQI1));
	  status2= status_generator(parseInt(AQI2));
	  status3= status_generator(parseInt(AQI3));
	  status4= status_generator(parseInt(AQI4));
	  status5= status_generator(parseInt(AQI5));
	  status6= status_generator(parseInt(AQI6));
	  status7= status_generator(parseInt(AQI7));
	   
		if(conv.screen){conv.ask('以下是「臺北市」的監測站列表');}
	  else{conv.ask(new SimpleResponse({               
				  speech: `<speak><p><s>以下是「臺北市」的監測站列表</s><s>選項有以下幾個<break time="0.5s"/>士林<break time="0.2s"/>大同<break time="0.2s"/>中山<break time="0.2s"/>古亭<break time="0.2s"/>松山<break time="0.2s"/>陽明<break time="0.2s"/>萬華<break time="1s"/>請選擇。</s></p></speak>`,
				  text: '以下是「臺北市」的監測站列表'}));}
	  conv.ask(new Carousel({
	  title: 'Carousel Title',
	  items: {
		'士林': {
		  title: '士林',
		  description: status1,
		  image: new Image({url: picurl1,alt: 'Image alternate text',}),},
		'大同': {
		  title: '大同',
		  description: status2,
		  image: new Image({url: picurl2,alt: 'Image alternate text',}),},
		'中山': {
		  title: '中山',
		  description: status3,
		  image: new Image({url: picurl3,alt: 'Image alternate text',}),},
		'古亭': {
		  title: '古亭',
		  description: status4,
		  image: new Image({url: picurl4,alt: 'Image alternate text',}),},
		'松山': {
		  title: '松山',
		  description: status5,
		  image: new Image({url: picurl5,alt: 'Image alternate text',}),},
		'陽明': {
		  title: '陽明',
		  description: status6,
		  image: new Image({url: picurl6,alt: 'Image alternate text',}),},
		'萬華': {
		  title: '萬華',
		  description: status7,
		  image: new Image({url: picurl7,alt: 'Image alternate text',}),}
	},
	}));  
	}
	  else if (County === "新北市") {
	   conv.ask(new SimpleResponse({               
				  speech: `<speak><p><s>由於「新北市」的測站數目較多，分為兩部份顯示，請選擇</s></p></speak>`,
				  text: '「新北市」監測站數量較多，\n分為兩部份顯示。'}));
	   
	  conv.ask(new Carousel({
	  title: 'Carousel Title',
	  items: {
		'New_Taipei1': {
		  title: '新北市(一)',
		  description: '三重、土城、永和  \n汐止、板橋、林口',
		},
		'New_Taipei2': {
		  title: '新北市(二)',
		  description: '淡水、富貴角、菜寮  \n新店、新莊、萬里',
		},  },}));  
	  }
	  else if (County === "新北市第一部分") {
		if(conv.screen){conv.ask(new SimpleResponse({               
				  speech: `<speak><p><s>以下是「新北市」第一部分的監測站列表</s></p></speak>`,
				  text: '以下是「新北市(一)」的監測站列表'}));}
	  else{conv.ask(new SimpleResponse({               
				  speech: `<speak><p><s>以下是「新北市」第一部分的監測站列表</s><s>選項有以下幾個<break time="0.5s"/>三重<break time="0.2s"/>土城<break time="0.2s"/>永和<break time="0.2s"/>汐止<break time="0.2s"/>板橋<break time="0.2s"/>林口<break time="1s"/>請選擇。</s></p></speak>`,
				  text: '以下是「新北市」第一部分的監測站列表'}));}
	  AQI1=AQI_list[parseInt(station_array.indexOf('三重'))];
	  AQI2=AQI_list[parseInt(station_array.indexOf('土城'))];
	  AQI3=AQI_list[parseInt(station_array.indexOf('永和'))];
	  AQI4=AQI_list[parseInt(station_array.indexOf('汐止'))];
	  AQI5=AQI_list[parseInt(station_array.indexOf('板橋'))];
	  AQI6=AQI_list[parseInt(station_array.indexOf('林口'))];

	  picurl1= picture_generator(parseInt(AQI1));
	  picurl2= picture_generator(parseInt(AQI2));
	  picurl3= picture_generator(parseInt(AQI3));
	  picurl4= picture_generator(parseInt(AQI4));
	  picurl5= picture_generator(parseInt(AQI5));
	  picurl6= picture_generator(parseInt(AQI6));
	  status1= status_generator(parseInt(AQI1));
	  status2= status_generator(parseInt(AQI2));
	  status3= status_generator(parseInt(AQI3));
	  status4= status_generator(parseInt(AQI4));
	  status5= status_generator(parseInt(AQI5));
	  status6= status_generator(parseInt(AQI6));
	   
	  conv.ask(new Carousel({
	  title: 'Carousel Title',
	  items: {
		'三重': {
		  title: '三重',
		  description: status1,
		  image: new Image({url: picurl1,alt: 'Image alternate text',}),},
		'土城': {
		  title: '土城',
		  description: status2,
		  image: new Image({url: picurl2,alt: 'Image alternate text',}),},
		'永和': {
		  title: '永和',
		  description: status3,
		  image: new Image({url: picurl3,alt: 'Image alternate text',}),},
		'汐止': {
		  title: '汐止',
		  description: status4,
		  image: new Image({url: picurl4,alt: 'Image alternate text',}),},
		'板橋': {
		  title: '板橋',
		  description: status5,
		  image: new Image({url: picurl5,alt: 'Image alternate text',}),},
		'林口': {
		  title: '林口',
		  description: status6,
		  image: new Image({url: picurl6,alt: 'Image alternate text',}),},
	},
	}));  
	conv.ask(new Suggestions('查看第二部分'));
	  }
	  else if (County === "新北市第二部分") {
	  
	  if(conv.screen){conv.ask(new SimpleResponse({               
				  speech: `<speak><p><s>以下是「新北市」第二部分的監測站列表</s></p></speak>`,
				  text: '以下是「新北市(二)」的監測站列表'}));}
	  else{conv.ask(new SimpleResponse({               
				  speech: `<speak><p><s>以下是「新北市」第二部分的監測站列表</s><s>選項有以下幾個<break time="0.5s"/>淡水<break time="0.2s"/>富貴角<break time="0.2s"/>菜寮<break time="0.2s"/>新店<break time="0.2s"/>新莊<break time="0.2s"/>萬里<break time="1s"/>請選擇。</s></p></speak>`,
				  text: '以下是「新北市」第二部分的監測站列表'}));}

	  AQI1=AQI_list[parseInt(station_array.indexOf('淡水'))];
	  AQI2=AQI_list[parseInt(station_array.indexOf('富貴角'))];
	  AQI3=AQI_list[parseInt(station_array.indexOf('菜寮'))];
	  AQI4=AQI_list[parseInt(station_array.indexOf('新店'))];
	  AQI5=AQI_list[parseInt(station_array.indexOf('新莊'))];
	  AQI6=AQI_list[parseInt(station_array.indexOf('萬里'))];

	  picurl1= picture_generator(parseInt(AQI1));
	  picurl2= picture_generator(parseInt(AQI2));
	  picurl3= picture_generator(parseInt(AQI3));
	  picurl4= picture_generator(parseInt(AQI4));
	  picurl5= picture_generator(parseInt(AQI5));
	  picurl6= picture_generator(parseInt(AQI6));
	  status1= status_generator(parseInt(AQI1));
	  status2= status_generator(parseInt(AQI2));
	  status3= status_generator(parseInt(AQI3));
	  status4= status_generator(parseInt(AQI4));
	  status5= status_generator(parseInt(AQI5));
	  status6= status_generator(parseInt(AQI6));

	  conv.ask(new Carousel({
	  title: 'Carousel Title',
	  items: {
		'淡水': {
		  title: '淡水',
		  description: status1,
		  image: new Image({url: picurl1,alt: 'Image alternate text',}),},
		'富貴角': {
		  title: '富貴角',
		  description: status2,
		  image: new Image({url: picurl2,alt: 'Image alternate text',}),},
		'菜寮': {
		  title: '菜寮',
		  description: status3,
		  image: new Image({url: picurl3,alt: 'Image alternate text',}),},
		'新店': {
		  title: '新店',
		  description: status4,
		  image: new Image({url: picurl4,alt: 'Image alternate text',}),},
		'新莊': {
		  title: '新莊',
		  description: status5,
		  image: new Image({url: picurl5,alt: 'Image alternate text',}),},
		'萬里': {
		  title: '萬里',
		  description: status6,
		  image: new Image({url: picurl6,alt: 'Image alternate text',}),},
	},
	}));  
	conv.ask(new Suggestions('查看第一部分'));
	  }

	  else if (County === "桃園市") {

		if(conv.screen){conv.ask('以下是「桃園市」的監測站列表');}
	  else{conv.ask(new SimpleResponse({               
				  speech: `<speak><p><s>以下是「桃園市」的監測站列表</s><s>選項有以下幾個<break time="0.5s"/>大園<break time="0.2s"/>中壢<break time="0.2s"/>平鎮<break time="0.2s"/>桃園<break time="0.2s"/>龍潭<break time="0.2s"/>觀音<break time="1s"/>請選擇。</s></p></speak>`,
				  text: '以下是「桃園市」的監測站列表'}));}

	  AQI1=AQI_list[parseInt(station_array.indexOf('大園'))];
	  AQI2=AQI_list[parseInt(station_array.indexOf('中壢'))];
	  AQI3=AQI_list[parseInt(station_array.indexOf('平鎮'))];
	  AQI4=AQI_list[parseInt(station_array.indexOf('桃園'))];
	  AQI5=AQI_list[parseInt(station_array.indexOf('龍潭'))];
	  AQI6=AQI_list[parseInt(station_array.indexOf('觀音'))];

	  picurl1= picture_generator(parseInt(AQI1));
	  picurl2= picture_generator(parseInt(AQI2));
	  picurl3= picture_generator(parseInt(AQI3));
	  picurl4= picture_generator(parseInt(AQI4));
	  picurl5= picture_generator(parseInt(AQI5));
	  picurl6= picture_generator(parseInt(AQI6));
	  status1= status_generator(parseInt(AQI1));
	  status2= status_generator(parseInt(AQI2));
	  status3= status_generator(parseInt(AQI3));
	  status4= status_generator(parseInt(AQI4));
	  status5= status_generator(parseInt(AQI5));
	  status6= status_generator(parseInt(AQI6));
	  conv.ask(new Carousel({
		items: {
		'大園': {
		  title: '大園',
		  description: status1,
		  image: new Image({url: picurl1,alt: 'Image alternate text',}),},
		'中壢': {
		  title: '中壢',
		  description: status2,
		  image: new Image({url: picurl2,alt: 'Image alternate text',}),},
		'平鎮': {
		  title: '平鎮',
		  description: status3,
		  image: new Image({url: picurl3,alt: 'Image alternate text',}),},
		'桃園': {
		  title: '桃園',
		  description: status4,
		  image: new Image({url: picurl4,alt: 'Image alternate text',}),},
		'龍潭': {
		  title: '龍潭',
		  description: status5,
		  image: new Image({url: picurl5,alt: 'Image alternate text',}),},
		'觀音': {
		  title: '觀音',
		  description: status6,
		  image: new Image({url: picurl6,alt: 'Image alternate text',}),},
	  },
	}));  }
	  else if (County === "新竹縣市") {

	  if(conv.screen){conv.ask('以下是「新竹縣市」的監測站列表');}
	  else{conv.ask(new SimpleResponse({               
				  speech: `<speak><p><s>以下是「新竹縣市」的監測站列表</s><s>選項有以下幾個<break time="0.5s"/>新竹<break time="0.2s"/>竹東<break time="0.2s"/>湖口<break time="1s"/>請選擇。</s></p></speak>`,
				  text: '以下是「新竹縣市」的監測站列表'}));}

	  AQI1=AQI_list[parseInt(station_array.indexOf('新竹'))];
	  AQI2=AQI_list[parseInt(station_array.indexOf('竹東'))];
	  AQI3=AQI_list[parseInt(station_array.indexOf('湖口'))];

	  picurl1= picture_generator(parseInt(AQI1));
	  picurl2= picture_generator(parseInt(AQI2));
	  picurl3= picture_generator(parseInt(AQI3));
	  status1= status_generator(parseInt(AQI1));
	  status2= status_generator(parseInt(AQI2));
	  status3= status_generator(parseInt(AQI3));
	  conv.ask(new Carousel({
		items: {
		'新竹': {
		  title: '新竹',
		  description: status1,
		  image: new Image({url: picurl1,alt: 'Image alternate text',}),},
		'竹東': {
		  title: '竹東',
		  description: status2,
		  image: new Image({url: picurl2,alt: 'Image alternate text',}),},
		'湖口': {
		  title: '湖口',
		  description: status3,
		  image: new Image({url: picurl3,alt: 'Image alternate text',}),},  
	  },
	}));  }
	  else if (County === "苗栗縣") {
	 
	 if(conv.screen){conv.ask('以下是「苗栗縣」的監測站列表');}
	  else{conv.ask(new SimpleResponse({               
				  speech: `<speak><p><s>以下是「苗栗縣」的監測站列表</s><s>選項有以下幾個<break time="0.5s"/>三義<break time="0.2s"/>苗栗<break time="0.2s"/>頭份<break time="1s"/>請選擇。</s></p></speak>`,
				  text: '以下是「苗栗縣」的監測站列表'}));}

	  AQI1=AQI_list[parseInt(station_array.indexOf('三義'))];
	  AQI2=AQI_list[parseInt(station_array.indexOf('苗栗'))];
	  AQI3=AQI_list[parseInt(station_array.indexOf('頭份'))];

	  picurl1= picture_generator(parseInt(AQI1));
	  picurl2= picture_generator(parseInt(AQI2));
	  picurl3= picture_generator(parseInt(AQI3));
	  status1= status_generator(parseInt(AQI1));
	  status2= status_generator(parseInt(AQI2));
	  status3= status_generator(parseInt(AQI3));

	  conv.ask(new Carousel({
		items: {
		'三義': {
		  title: '三義',
		  description: status1,
		  image: new Image({url: picurl1,alt: 'Image alternate text',}),},
		'苗栗': {
		  title: '苗栗',
		  description: status2,
		  image: new Image({url: picurl2,alt: 'Image alternate text',}),},
		'頭份': {
		  title: '頭份',
		  description: status3,
		  image: new Image({url: picurl3,alt: 'Image alternate text',}),},
	  },
	}));  }
	  else if (County === "臺中市") {
		
	if(conv.screen){conv.ask('以下是「臺中市」的監測站列表');}
	  else{conv.ask(new SimpleResponse({               
				  speech: `<speak><p><s>以下是「臺中市」的監測站列表</s><s>選項有以下幾個<break time="0.5s"/>大里<break time="0.2s"/>西屯<break time="0.2s"/>沙鹿<break time="0.2s"/>忠明<break time="0.2s"/>豐原<break time="1s"/>請選擇。</s></p></speak>`,
				  text: '以下是「臺中市」的監測站列表'}));}

	  AQI1=AQI_list[parseInt(station_array.indexOf('大里'))];
	  AQI2=AQI_list[parseInt(station_array.indexOf('西屯'))];
	  AQI3=AQI_list[parseInt(station_array.indexOf('沙鹿'))];
	  AQI4=AQI_list[parseInt(station_array.indexOf('忠明'))];
	  AQI5=AQI_list[parseInt(station_array.indexOf('豐原'))];

	  picurl1= picture_generator(parseInt(AQI1));
	  picurl2= picture_generator(parseInt(AQI2));
	  picurl3= picture_generator(parseInt(AQI3));
	  picurl4= picture_generator(parseInt(AQI4));
	  picurl5= picture_generator(parseInt(AQI5));
	  picurl6= picture_generator(parseInt(AQI6));
	  status1= status_generator(parseInt(AQI1));
	  status2= status_generator(parseInt(AQI2));
	  status3= status_generator(parseInt(AQI3));
	  status4= status_generator(parseInt(AQI4));
	  status5= status_generator(parseInt(AQI5));
	  status6= status_generator(parseInt(AQI6));

	  conv.ask(new Carousel({
		items: {
		'大里': {
		  title: '大里',
		  description: status1,
		  image: new Image({url: picurl1,alt: 'Image alternate text',}),},
		'西屯': {
		  title: '西屯',
		  description: status2,
		  image: new Image({url: picurl2,alt: 'Image alternate text',}),},
		'沙鹿': {
		  title: '沙鹿',
		  description: status3,
		  image: new Image({url: picurl3,alt: 'Image alternate text',}),},
		'忠明': {
		  title: '忠明',
		  description: status4,
		  image: new Image({url: picurl4,alt: 'Image alternate text',}),},
		'豐原': {
		  title: '豐原',
		  description: status5,
		  image: new Image({url: picurl5,alt: 'Image alternate text',}),},
	  },
	}));  }
	  else if (County === "彰化縣") {
	  
		if(conv.screen){conv.ask('以下是「彰化縣」的監測站列表');}
	  else{conv.ask(new SimpleResponse({               
				  speech: `<speak><p><s>以下是「彰化縣」的監測站列表</s><s>選項有以下幾個<break time="0.5s"/>二林<break time="0.2s"/>彰化<break time="0.2s"/>大城<break time="0.2s"/>線西<break time="1s"/>請選擇。</s></p></speak>`,
				  text: '以下是「彰化縣」的監測站列表'}));}

	  AQI1=AQI_list[parseInt(station_array.indexOf('二林'))];
	  AQI2=AQI_list[parseInt(station_array.indexOf('彰化'))];
	  AQI3=AQI_list[parseInt(station_array.indexOf('線西'))];

	  picurl1= picture_generator(parseInt(AQI1));
	  picurl2= picture_generator(parseInt(AQI2));
	  picurl3= picture_generator(parseInt(AQI3));
	  status1= status_generator(parseInt(AQI1));
	  status2= status_generator(parseInt(AQI2));
	  status3= status_generator(parseInt(AQI3));

	  conv.ask(new Carousel({
		items: {
		'二林': {
		  title: '二林',
		  description: status1,
		  image: new Image({url: picurl1,alt: 'Image alternate text',}),},
		'彰化': {
		  title: '彰化',
		  description: status2,
		  image: new Image({url: picurl2,alt: 'Image alternate text',}),},
		'線西': {
		  title: '線西',
		  description: status3,
		  image: new Image({url: picurl3,alt: 'Image alternate text',}),},
	  },
	}));  }
	  else if (County === "南投縣") {

	  if(conv.screen){conv.ask('以下是「南投縣」的監測站列表');}
	  else{conv.ask(new SimpleResponse({               
				  speech: `<speak><p><s>以下是「南投縣」的監測站列表</s><s>選項有以下幾個<break time="0.5s"/>竹山<break time="0.2s"/>南投<break time="0.2s"/>埔里<break time="1s"/>請選擇。</s></p></speak>`,
				  text: '以下是「南投縣」的監測站列表'}));}

	  AQI1=AQI_list[parseInt(station_array.indexOf('竹山'))];
	  AQI2=AQI_list[parseInt(station_array.indexOf('南投'))];
	  AQI3=AQI_list[parseInt(station_array.indexOf('埔里'))];

	  picurl1= picture_generator(parseInt(AQI1));
	  picurl2= picture_generator(parseInt(AQI2));
	  picurl3= picture_generator(parseInt(AQI3));
	  status1= status_generator(parseInt(AQI1));
	  status2= status_generator(parseInt(AQI2));
	  status3= status_generator(parseInt(AQI3));

	  conv.ask(new Carousel({
		items: {
		'竹山': {
		  title: '竹山',
		  description: status1,
		  image: new Image({url: picurl1,alt: 'Image alternate text',}),},
		'南投': {
		  title: '南投',
		  description: status2,
		  image: new Image({url: picurl2,alt: 'Image alternate text',}),},
		'埔里': {
		  title: '埔里',
		  description: status3,
		  image: new Image({url: picurl3,alt: 'Image alternate text',}),},
	  },
	}));  }
	  else if (County === "雲林縣") {
	   
	   if(conv.screen){conv.ask('以下是「雲林縣」的監測站列表');}
	  else{conv.ask(new SimpleResponse({               
				  speech: `<speak><p><s>以下是「雲林縣」的監測站列表</s><s>選項有以下幾個<break time="0.5s"/>斗六<break time="0.2s"/>崙背<break time="0.2s"/>麥寮<break time="0.2s"/>臺西<break time="1s"/>請選擇。</s></p></speak>`,
				  text: '以下是「雲林縣」的監測站列表'}));}

	  AQI1=AQI_list[parseInt(station_array.indexOf('斗六'))];
	  AQI2=AQI_list[parseInt(station_array.indexOf('崙背'))];
	  AQI3=AQI_list[parseInt(station_array.indexOf('麥寮'))];
	  AQI4=AQI_list[parseInt(station_array.indexOf('臺西'))];

	  picurl1= picture_generator(parseInt(AQI1));
	  picurl2= picture_generator(parseInt(AQI2));
	  picurl3= picture_generator(parseInt(AQI3));
	  picurl4= picture_generator(parseInt(AQI4));
	  status1= status_generator(parseInt(AQI1));
	  status2= status_generator(parseInt(AQI2));
	  status3= status_generator(parseInt(AQI3));
	  status4= status_generator(parseInt(AQI4));

	  conv.ask(new Carousel({
		items: {
		'斗六': {
		  title: '斗六',
		  description: status1,
		  image: new Image({url: picurl1,alt: 'Image alternate text',}),},
		'崙背': {
		  title: '崙背',
		  description: status2,
		  image: new Image({url: picurl2,alt: 'Image alternate text',}),},
		'麥寮': {
		  title: '麥寮',
		  description: status3,
		  image: new Image({url: picurl3,alt: 'Image alternate text',}),},
		'臺西': {
		  title: '臺西',
		  description: status4,
		  image: new Image({url: picurl4,alt: 'Image alternate text',}),},
	  },
	}));  }
	  else if (County === "嘉義縣市") {
		if(conv.screen){conv.ask('以下是「嘉義縣市」的監測站列表');}
	  else{conv.ask(new SimpleResponse({               
				  speech: `<speak><p><s>以下是「嘉義縣市」的監測站列表</s><s>選項有以下幾個<break time="0.5s"/>嘉義<break time="0.2s"/>朴子<break time="0.2s"/>新港<break time="1s"/>請選擇。</s></p></speak>`,
				  text: '以下是「嘉義縣市」的監測站列表'}));}

	  AQI1=AQI_list[parseInt(station_array.indexOf('嘉義'))];
	  AQI2=AQI_list[parseInt(station_array.indexOf('朴子'))];
	  AQI3=AQI_list[parseInt(station_array.indexOf('新港'))];

	  picurl1= picture_generator(parseInt(AQI1));
	  picurl2= picture_generator(parseInt(AQI2));
	  picurl3= picture_generator(parseInt(AQI3));
	  status1= status_generator(parseInt(AQI1));
	  status2= status_generator(parseInt(AQI2));
	  status3= status_generator(parseInt(AQI3));

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
		'新港': {
		  title: '新港',
		  description: status3,
		  image: new Image({url: picurl3,alt: 'Image alternate text',}),},
	  },
	}));  }
	  else if (County === "臺南市") {

	  if(conv.screen){conv.ask('以下是「臺南市」的監測站列表');}
	  else{conv.ask(new SimpleResponse({               
				  speech: `<speak><p><s>以下是「臺南市」的監測站列表</s><s>選項有以下幾個<break time="0.5s"/>安南<break time="0.2s"/>善化<break time="0.2s"/>新營<break time="0.2s"/>臺南<break time="0.2s"/>麻豆<break time="1s"/>請選擇。</s></p></speak>`,
				  text: '以下是「臺南市」的監測站列表'}));}

	  AQI1=AQI_list[parseInt(station_array.indexOf('安南'))];
	  AQI2=AQI_list[parseInt(station_array.indexOf('善化'))];
	  AQI3=AQI_list[parseInt(station_array.indexOf('新營'))];
	  AQI4=AQI_list[parseInt(station_array.indexOf('臺南'))];

	  picurl1= picture_generator(parseInt(AQI1));
	  picurl2= picture_generator(parseInt(AQI2));
	  picurl3= picture_generator(parseInt(AQI3));
	  picurl4= picture_generator(parseInt(AQI4));
	  picurl5= picture_generator(parseInt(AQI5));
	  status1= status_generator(parseInt(AQI1));
	  status2= status_generator(parseInt(AQI2));
	  status3= status_generator(parseInt(AQI3));
	  status4= status_generator(parseInt(AQI4));
	  
	  conv.ask(new Carousel({
		items: {
		'安南': {
		  title: '安南',
		  description: status1,
		  image: new Image({url: picurl1,alt: 'Image alternate text',}),},
		'善化': {
		  title: '善化',
		  description: status2,
		  image: new Image({url: picurl2,alt: 'Image alternate text',}),},
		'新營': {
		  title: '新營',
		  description: status3,
		  image: new Image({url: picurl3,alt: 'Image alternate text',}),},
		'臺南': {
		  title: '臺南',
		  description: status4,
		  image: new Image({url: picurl4,alt: 'Image alternate text',}),},
	  },
	}));  }
	  else if (County === "高雄市") {

	   conv.ask(new SimpleResponse({               
				  speech: `<speak><p><s>由於「高雄市」的測站數目較多，分為兩部份顯示，請選擇</s></p></speak>`,
				  text: '「高雄市」監測站數量較多，\n分為兩部份顯示。'}));
	   
	  conv.ask(new Carousel({
	  title: 'Carousel Title',
	  items: {
		'NKaohsiung': {
		  title: '北高雄市',
		  description: '美濃、橋頭、楠梓  \n仁武、左營、前金',
		},
		'SKaohsiung': {
		  title: '南高雄市',
		  description: '鳳山、復興、前鎮  \n小港、大寮、林園',
		},  },}));  
	}
	else if (County === "北高雄") {

	  if(conv.screen){conv.ask('以下是「北高雄」的監測站列表');}
	  else{conv.ask(new SimpleResponse({               
				  speech: `<speak><p><s>以下是「北高雄」的監測站列表</s><s>選項有以下幾個<break time="0.5s"/>美濃<break time="0.2s"/>橋頭<break time="0.2s"/>楠梓<break time="0.2s"/>仁武<break time="0.2s"/>左營<break time="0.2s"/>前金<break time="1s"/>請選擇。</s></p></speak>`,
				  text: '以下是「北高雄」的監測站列表'}));}

	  AQI1=AQI_list[parseInt(station_array.indexOf('美濃'))];
	  AQI2=AQI_list[parseInt(station_array.indexOf('橋頭'))];
	  AQI3=AQI_list[parseInt(station_array.indexOf('楠梓'))];
	  AQI4=AQI_list[parseInt(station_array.indexOf('仁武'))];
	  AQI5=AQI_list[parseInt(station_array.indexOf('左營'))];
	  AQI6=AQI_list[parseInt(station_array.indexOf('前金'))];

	  picurl1= picture_generator(parseInt(AQI1));
	  picurl2= picture_generator(parseInt(AQI2));
	  picurl3= picture_generator(parseInt(AQI3));
	  picurl4= picture_generator(parseInt(AQI4));
	  picurl5= picture_generator(parseInt(AQI5));
	  picurl6= picture_generator(parseInt(AQI6));
	  status1= status_generator(parseInt(AQI1));
	  status2= status_generator(parseInt(AQI2));
	  status3= status_generator(parseInt(AQI3));
	  status4= status_generator(parseInt(AQI4));
	  status5= status_generator(parseInt(AQI5));
	  status6= status_generator(parseInt(AQI6));

	  conv.ask(new Carousel({
	  title: 'Carousel Title',
	  items: {
		'美濃': {
		  title: '美濃',
		  description: status1,
		  image: new Image({url: picurl1,alt: 'Image alternate text',}),},
		'橋頭': {
		  title: '橋頭',
		  description: status2,
		  image: new Image({url: picurl2,alt: 'Image alternate text',}),},
		'楠梓': {
		  title: '楠梓',
		  description: status3,
		  image: new Image({url: picurl3,alt: 'Image alternate text',}),},
		'仁武': {
		  title: '仁武',
		  description: status4,
		  image: new Image({url: picurl4,alt: 'Image alternate text',}),},
		'左營': {
		  title: '左營',
		  description: status5,
		  image: new Image({url: picurl5,alt: 'Image alternate text',}),},
		'前金': {
		  title: '前金',
		  description: status6,
		  image: new Image({url: picurl6,alt: 'Image alternate text',}),},
	}, }));
		conv.ask(new Suggestions('查看南高雄'));

	  }  
	else if (County === "南高雄") {

	  if(conv.screen){conv.ask('以下是「南高雄」的監測站列表');}
	  else{conv.ask(new SimpleResponse({               
				  speech: `<speak><p><s>以下是「南高雄」的監測站列表</s><s>選項有以下幾個<break time="0.5s"/>鳳山<break time="0.2s"/>復興<break time="0.2s"/>前鎮<break time="0.2s"/>小港<break time="0.2s"/>大寮<break time="0.2s"/>林園<break time="1s"/>請選擇。</s></p></speak>`,
				  text: '以下是「南高雄」的監測站列表'}));}

	  AQI1=AQI_list[parseInt(station_array.indexOf('鳳山'))];
	  AQI2=AQI_list[parseInt(station_array.indexOf('復興'))];
	  AQI3=AQI_list[parseInt(station_array.indexOf('前鎮'))];
	  AQI4=AQI_list[parseInt(station_array.indexOf('小港'))];
	  AQI5=AQI_list[parseInt(station_array.indexOf('大寮'))];
	  AQI6=AQI_list[parseInt(station_array.indexOf('林園'))];

	  picurl1= picture_generator(parseInt(AQI1));
	  picurl2= picture_generator(parseInt(AQI2));
	  picurl3= picture_generator(parseInt(AQI3));
	  picurl4= picture_generator(parseInt(AQI4));
	  picurl5= picture_generator(parseInt(AQI5));
	  picurl6= picture_generator(parseInt(AQI6));
	  status1= status_generator(parseInt(AQI1));
	  status2= status_generator(parseInt(AQI2));
	  status3= status_generator(parseInt(AQI3));
	  status4= status_generator(parseInt(AQI4));
	  status5= status_generator(parseInt(AQI5));
	  status6= status_generator(parseInt(AQI6));

		 conv.ask(new Carousel({
	  title: 'Carousel Title',
	  items: {
		'鳳山': {
		  title: '鳳山',
		  description: status1,
		  image: new Image({url: picurl1,alt: 'Image alternate text',}),},
		'復興': {
		  title: '復興',
		  description: status2,
		  image: new Image({url: picurl2,alt: 'Image alternate text',}),},
		'前鎮': {
		  title: '前鎮',
		  description: status3,
		  image: new Image({url: picurl3,alt: 'Image alternate text',}),},
		'小港': {
		  title: '小港',
		  description: status4,
		  image: new Image({url: picurl4,alt: 'Image alternate text',}),},
		'大寮': {
		  title: '大寮',
		  description: status5,
		  image: new Image({url: picurl5,alt: 'Image alternate text',}),},
		'林園': {
		  title: '林園',
		  description: status6,
		  image: new Image({url: picurl6,alt: 'Image alternate text',}),},
	},}));
			conv.ask(new Suggestions('查看北高雄'));
	}
	else if (County === "屏東縣") {

	  if(conv.screen){conv.ask('以下是「屏東縣」的監測站列表');}
	  else{conv.ask(new SimpleResponse({               
				  speech: `<speak><p><s>以下是「屏東縣」的監測站列表</s><s>選項有以下幾個<break time="0.5s"/>屏東<break time="0.2s"/>琉球<break time="0.2s"/>恆春<break time="0.2s"/>潮州<break time="1s"/>請選擇。</s></p></speak>`,
				  text: '以下是「屏東縣」的監測站列表'}));}

	  AQI1=AQI_list[parseInt(station_array.indexOf('屏東'))];
	  AQI2=AQI_list[parseInt(station_array.indexOf('恆春'))];
	  AQI3=AQI_list[parseInt(station_array.indexOf('潮州'))];

	  picurl1= picture_generator(parseInt(AQI1));
	  picurl2= picture_generator(parseInt(AQI2));
	  picurl3= picture_generator(parseInt(AQI3));
	  status1= status_generator(parseInt(AQI1));
	  status2= status_generator(parseInt(AQI2));
	  status3= status_generator(parseInt(AQI3));

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
		'潮州': {
		  title: '潮州',
		  description: status3,
		  image: new Image({url: picurl3,alt: 'Image alternate text',}),},
	},
	  }));}	  
	  else if(station_array.indexOf(County)!==-1){
	indexnumber=station_array.indexOf(County); //取得監測站對應的編號

	database.ref('/TWair').on('value',e=>{
		Pollutant_list=e.val().Pollutant;
		AQI_list=e.val().AQI;
		PM25_list=e.val().PM25;
		O3_list=e.val().O3;
		PublishTime=e.val().PublishTime;
		});

	AQI=AQI_list[parseInt(indexnumber)];
	Pollutant=Pollutant_list[parseInt(indexnumber)];
	Status= status_generator(parseInt(AQI));
	PM10=PM10_list[parseInt(indexnumber)];
	PM25=PM25_list[parseInt(indexnumber)];
	O3=O3_list[parseInt(indexnumber)];

	if(Status!=="有效數據不足"){

	if(AQI>=0&&AQI<=50){picture= "https://dummyimage.com/1037x539/1e9165/ffffff.png&text="+AQI;}
	else if(AQI>=51&&AQI<=100){picture= "https://dummyimage.com/1037x539/fc920b/ffffff.png&text="+AQI;}
	else if(AQI>=101&&AQI<=150){picture= "https://dummyimage.com/1037x539/ef4621/ffffff.png&text="+AQI;}
	else if(AQI>=151&&AQI<=199){picture= "https://dummyimage.com/1037x539/b71411/ffffff.png&text="+AQI;}
	else if(AQI>=200&&AQI<=300){picture= "https://dummyimage.com/1037x539/5b0e31/ffffff.png&text="+AQI;}
	else if(AQI>301){picture= "https://dummyimage.com/1037x539/4f1770/ffffff.png&text="+AQI;}

	if(AQI>=0&&AQI<=50){info= "對一般民眾身體健康無影響。";}
	else if(AQI>=51&&AQI<=100){info= "可能對極敏感族群產生咳嗽或呼吸急促等症狀，但仍可正常戶外活動。";}
	else if(AQI>=101&&AQI<=150){info= "若出現眼痛，咳嗽或喉嚨痛等症狀，英減少戶外活動，避免在戶外劇烈運動，敏感族群必要外出時英配戴口罩。";}
	else if(AQI>=151&&AQI<=199){info= "若出現眼痛，咳嗽或喉嚨痛等症狀，英減少體力消耗及戶外活動，在戶外避免長時間劇烈運動，敏感族群建議留在室內並減少體力消耗活動，必要外出英配戴口罩。"}
	else if(AQI>=200&&AQI<=300){info= "對敏感族群會有明顯惡化的現象，建議留在室內並減少體力消耗活動；一般大眾則視身體狀況，可能產生眼睛不適、氣喘、咳嗽、痰多、喉痛等症狀。";}
	else if(AQI>301){info= "健康威脅達到緊急，所有人都可能受到影響。應避免戶外活動，室內應緊閉門窗，必要外出應配戴口罩等防護用具。";}

	if(AQI>=0&&AQI<=50){info_output= "對一般民眾身體健康無影響。";}
	else if(AQI>=51&&AQI<=100){info_output= "極特殊敏感族群建議注意  \n可能產生的咳嗽或呼吸急促症狀。";}
	else if(AQI>=101&&AQI<=150){info_output= "1.一般民眾如果有不適，應考慮減少戶外活動。  \n2.學生仍可進行戶外活動，但建議減少長時間劇烈運動。  \n3.有心臟、呼吸道及心血管疾病患者、孩童及老年人，建議減少體力消耗活動及戶外活動，外出應配戴口罩。  \n4.具有氣喘的人可能需增加使用吸入劑的頻率。";}
	else if(AQI>=151&&AQI<=199){info_output= "1.一般民眾如果有不適，應減少體力消耗及戶外活動。  \n2.學生應避免長時間劇烈運動並增加休息時間。  \n3.有心臟、呼吸道及心血管疾病患者、孩童及老年人，建議留在室內減少體力消耗活動，外出應配戴口罩。  \n4.具有氣喘的人可能需增加使用吸入劑的頻率。"}
	else if(AQI>=200&&AQI<=300){info_output= "1.一般民眾應減少戶外活動。  \n2.學生應立即停止戶外活動，並將課程調整於室內進行。  \n3.有心臟、呼吸道及心血管疾病患者、孩童及老年人應留在室內並減少體力消耗活動，外出應配戴口罩。  \n4.具有氣喘的人應增加使用吸入劑的頻率。";}
	else if(AQI>301){info_output= "1.一般民眾應避免戶外活動，室內應緊閉門窗，必要外出應配戴口罩等防護用具。  \n2.學生應立即停止戶外活動，並將課程調整於室內進行。  \n3.有心臟、呼吸道及心血管疾病患者、孩童及老年人應留在室內並避免體力消耗活動，外出應配戴口罩。  \n4.具有氣喘的人應增加使用吸入劑的頻率。";}


	if(AQI>=0&&AQI<=50){
	conv.ask(new SimpleResponse({               
				  speech: `<speak><p><s>根據最新資料顯示，${County}監測站的AQI指數為${AQI}</s><s>您可放心出外活動!</s></p></speak>`,
			  text: '以下為該監測站的詳細資訊，\n您可放心出外活動!'}));   }
	else if(AQI>50){
	   conv.ask(new SimpleResponse({               
	  speech: `<speak><p><s>根據最新資料顯示，${County}監測站的AQI指數為${AQI}</s><s>主要汙染源來自${replaceString(Pollutant, '八小時', '')}</s><s>${info}</s></p></speak>`,
			  text: '以下為該監測站的詳細資訊。'})); }

	output_title='「'+County+'」空氣品質'+Status;
	if(AQI>50){
		if(	Pollutant==="臭氧八小時"){Pollutant="臭氧 (O₃)";}
		else if(Pollutant==="細懸浮微粒"){Pollutant="細懸浮微粒(PM₂.₅)";}
		else if(Pollutant==="懸浮微粒"){Pollutant="懸浮微粒(PM₁₀)";}
		output_title=output_title+'\n主要汙染源 '+Pollutant;
	}
	  
	if(conv.screen){
		conv.ask(new BasicCard({  
		image: new Image({url:picture,alt:'Pictures',}),
		title:output_title,display: 'CROPPED',
		text:info_output+'  \n  \nPM₁₀ '+PM10+'(μg/m³) • PM₂.₅ '+PM25+'(μg/m³) • 臭氧 '+O3+'(ppb)  \n**測站資訊發布時間** • '+replaceString(PublishTime, '-', '/'),})); 
		conv.ask(new Suggestions('把它加入日常安排'));}
	else{conv.close(`<speak><p><s>歡迎你隨時回來查詢，下次見</s></p></speak>`);}

	  }else{
		conv.ask(new SimpleResponse({               
				  speech: `<speak><p><s>由於${County}監測站正處於維修狀態或數據不足。我無法提供你最新資訊。</s></p></speak>`,
	text: '以下為「'+County+'」監測站的詳細資訊'}));if(conv.screen){
	conv.ask(new BasicCard({  
	image: new Image({url:"https://dummyimage.com/1037x539/232830/ffffff.png&text=NaN",alt:'Pictures',}),
	title:'有效數據不足',
	text:'設備維護、儀器校正、儀器異常、傳輸異常、電力異常 \n或有效數據不足等需查修維護情形，以致資料暫時中斷服務。  \n  \nPM₁₀ '+PM10+'(μg/m³) • PM₂.₅ '+PM25+'(μg/m³) • 臭氧 '+O3+'(ppb)  \n**測站資訊發布時間** • '+replaceString(PublishTime, '-', '/'),
	display: 'CROPPED',
		 })); 
	 conv.ask(new Suggestions('把它加入日常安排'));}else{conv.close(`<speak><p><s>歡迎你隨時回來查詢，下次見</s></p></speak>`);}

	  }

	 }else{
	  
	  County="undefined";
	  if(conv.screen){conv.ask('我不懂你的意思，\n請輕觸下方卡片來進行區域查詢。');}
	  else{conv.ask(new SimpleResponse({               
				  speech: `<speak><p><s>我不懂你的意思，請試著透過區域查詢!</s><s>選項有以下幾個<break time="0.5s"/>北部地區<break time="0.2s"/>中部地區<break time="0.2s"/>南部地區<break time="0.2s"/>東部地區<break time="0.2s"/>離島地區<break time="1s"/>請選擇。</s></p></speak>`,
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
	  description: '澎湖縣、金門縣、\n連江縣',},
	  'Mobile_Van': {
	  title: '行動測站',
	  description: '環保署因應需求設置  \n可能隨時間發生變動', },	},}));
	 if(conv.screen){
	 conv.ask(new Suggestions(eicon[parseInt(Math.random()*2)]+'最近的測站'));}
	 }
	 if(County!=="undefined"){conv.ask(new Suggestions('回主頁面'));}
	 conv.ask(new Suggestions('回主頁面','👋 掰掰'));
     conv.user.storage.choose_station=County;
     conv.data.choose_station=County;
});

		
app.intent('結束對話', (conv) => {
		conv.user.storage = {}; //離開同時清除暫存資料
		conv.ask('希望能幫到一點忙!');
		conv.ask(new SimpleResponse({speech: '下次見',text: '下次見 👋',}));
		conv.close(new BasicCard({   
			title: '感謝您的使用!', 
			text:'如果有任何需要改進的地方，  \n歡迎到簡介頁面評分或給予反饋，謝謝!', 
			buttons: new Button({title: '開啟本程式的商店頁面',url: 'https://assistant.google.com/services/a/uid/000000fa049fc5e5',}),
	  })); 
});

// Set the DialogflowApp object to handle the HTTPS POST request.
exports.air_pullute = functions.https.onRequest(app);