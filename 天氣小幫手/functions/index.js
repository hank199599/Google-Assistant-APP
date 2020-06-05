	'use strict';

	// Import the Dialogflow module from the Actions on Google client library.
	const {
	  dialogflow,
	  SimpleResponse,BrowseCarousel,Button,List,
	  items,Image,Table,BasicCard,Suggestions
	} = require('actions-on-google');

const functions = require('firebase-functions');
const app = dialogflow({debug: true});

var iconv = require('iconv-lite');
var FetchStream = require("fetch").FetchStream;
const replaceString = require('replace-string');
var getJSON = require('get-json');
var converter=require('./report_convert.json');
var thearray=["臺北市","新北市","基隆市","桃園市","新竹縣","苗栗縣","新竹市","台中市","南投縣","彰化縣","雲林縣","嘉義縣","嘉義市","臺南市","高雄市","屏東縣","宜蘭縣","花蓮縣","臺東縣","金門縣","澎湖縣","連江縣"];

function reduceSIZE(input){
	 input=replaceString(input, '．', '.');
	 input=replaceString(input, '０', '0');
	 input=replaceString(input, '１', '1');
	 input=replaceString(input, '２', '2');
	 input=replaceString(input, '３', '3');
	 input=replaceString(input, '４', '4');
	 input=replaceString(input, '５', '5');
	 input=replaceString(input, '６', '6');
	 input=replaceString(input, '７', '7');
	 input=replaceString(input, '８', '8');
	 input=replaceString(input, '９', '9');
	 return input;
 }


app.intent('今日天氣概況', (conv) => {

   return new Promise(
  
   function(resolve,reject){

	var fetch = new FetchStream("https://opendata.cwb.gov.tw/fileapi/opendata/MFC/F-C0032-031.FW50",{disableDecoding:true});

	fetch.on("data", function(chunk){
		resolve(iconv.decode(chunk,'BIG5'));
	});

  }).then(function (final_data) {

 var report_time=(final_data.split('發布時間：')[1]).split('分')[0]+"分";
	 report_time=reduceSIZE(report_time);
 var report_contect=(final_data.split('】。')[1]).split('根據環保署')[0];
 var display_report=replaceString(final_data.split('０分')[1], '；https://airtw.epa.gov.tw/', '');
	 display_report=reduceSIZE(display_report);
	 display_report=replaceString(display_report,'\r\n','');
	 display_report=display_report.split('根據環保署')[0]
	 
 conv.ask(new SimpleResponse({speech:`<speak><p><s>以下是中央氣象局，在${report_time}所發布的天氣概況。<break time="0.5s"/>${report_contect}</s></p></speak>`,text: '下面是最新的天氣概況'} ));
 conv.ask(new BasicCard({   
			title: '全台天氣概況',
			subtitle:"發布於"+report_time,
			text:replaceString(display_report, '。', '。  \n  \n'),
        }));
  conv.ask(new Suggestions('查看各個區域','掰掰'));           

	}).catch(function (error) {
	console.log(error)
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

app.intent('查詢各縣市的天氣概況', (conv) => {
	
	conv.ask(new SimpleResponse({               
		  speech: `<speak><p><s>請選擇要查看的縣市!</s><s>我會給你簡短的天氣報告。</s></p></speak>`,
		  text: '請選擇要查看的縣市!'}));
	
	conv.ask(new List({
    title: 'List Title',
    items: {
      '臺北市': {
        synonyms: ['台北','中正','大同','中山','松山','大安','萬華','信義','士林','北投','內湖','南港','文山'],
        title: '臺北市',
       },
      '新北市': {
        synonyms: ['新北','萬里','金山','板橋','汐止','深坑','石碇','瑞芳','平溪','雙溪','貢寮','新店','坪林','烏來','永和','中和','土城','三峽','樹林','鶯歌','三重','新莊','泰山','林口','蘆洲','五股','八里','淡水','三芝','石門',],
        title: '新北市',
       },
      '基隆市': {
        synonyms: ['基隆','仁愛','信義','中正','中山','安樂','暖暖','七堵區',],
        title: '基隆市',
       },
      '桃園市': {
        synonyms: ['桃園','中壢','平鎮','龍潭','楊梅','新屋','觀音','桃園','龜山','八德','大溪','復興','大園','蘆竹',],
        title: '桃園市',
       },
      '新竹縣': {
        synonyms: ['竹北','湖口','新豐','新埔','關西','芎林','寶山','竹東','五峰','橫山','尖石','北埔','峨眉',],
        title: '新竹縣',
       },
      '新竹市': {
        title: '新竹市',
       },
      '苗栗縣': {
        synonyms: ['竹南','頭份','三灣','南庄','獅潭','後龍','通霄','苑裡','苗栗','造橋','頭屋','公館','大湖','泰安','銅鑼','三義','西湖','卓蘭',],
        title: '苗栗縣',
       },
      '臺中市': {
        synonyms: ['台中','北屯','西屯','南屯','太平','大里','霧峰','烏日','豐原','后里','石岡','東勢','和平','新社','潭子','大雅','神岡','大肚','沙鹿','龍井','梧棲','清水','大甲','外埔','大安',],
        title: '臺中市',
       },
      '南投縣': {
        synonyms: ['南投','中寮','草屯','國姓','埔里','仁愛','名間','集集','水里','魚池','信義','竹山','鹿谷',],
        title: '南投縣',
       },
      '彰化縣': {
        synonyms: ['彰化','彰化','芬園','花壇','秀水','鹿港','福興','線西','和美','伸港','員林','社頭','永靖','埔心','溪湖','大村','埔鹽','田中','北斗','田尾','埤頭','溪州','竹塘','二林','大城','芳苑','二水',],
        title: '彰化縣',
       },
      '雲林縣': {
        synonyms: ['雲林','斗南','大埤','虎尾','土庫','褒忠','東勢','臺西','崙背','麥寮','斗六','林內','古坑','莿桐','西螺','二崙','北港','水林','口湖','四湖','元長',],
        title: '雲林縣',
       },
      '嘉義縣': {
        synonyms: ['番路','梅山','竹崎','阿里山','中埔','大埔','水上','鹿草','太保','朴子','東石','六腳','新港','民雄','大林','溪口','義竹','布袋',],
        title: '嘉義縣',
       },
      '嘉義市': {
        synonyms: ['阿里山',],
        title: '嘉義市',
       },
      '臺南市': {
        synonyms: ['台南','安平','安南','永康','歸仁','新化','左鎮','玉井','楠西','南化','仁德','關廟','龍崎','官田','麻豆','佳里','西港','七股','將軍','學甲','北門','新營','後壁','白河','東山','六甲','下營','柳營','鹽水','善化','大內','山上','新市','安定',],
        title: '臺南市',
       },
      '高雄市': {
        synonyms: ['高雄','港都','新興','前金','苓雅','鹽埕','鼓山','旗津','前鎮','三民','楠梓','小港','左營','仁武','大社','岡山','路竹','阿蓮','田寮','燕巢','橋頭','梓官','彌陀','永安','湖內','鳳山','大寮','林園','鳥松','大樹','旗山','美濃','六龜','內門','杉林','甲仙','桃源','那瑪夏','茂林','茄萣',],
        title: '高雄市',
       },
      '屏東縣': {
        synonyms: ['屏東','屏東','三地門','霧臺','瑪家','九如','里港','高樹','鹽埔','長治','麟洛','竹田','內埔','萬丹','潮州','泰武','來義','萬巒','崁頂','新埤','南州','林邊','東港','琉球','佳冬','新園','枋寮','枋山','春日','獅子','車城','牡丹','恆春','滿州',],
        title: '屏東縣',
       },
      '宜蘭縣': {
        synonyms: ['宜蘭','噶瑪蘭','宜蘭','頭城','礁溪','壯圍','員山','羅東','三星','大同','五結','冬山','蘇澳','南澳','釣魚臺列嶼'],
        title: '宜蘭縣',
       },
      '花蓮縣': {
        synonyms: ['花蓮','洄瀾','多羅滿','花蓮','新城','秀林','吉安','壽豐','鳳林','光復','豐濱','瑞穗','萬榮','玉里','卓溪','富里'],
        title: '花蓮縣',
       },
      '臺東縣': {
        synonyms: ['台東','臺東','綠島','蘭嶼','延平','卑南','鹿野','關山','海端','池上','東河','成功','長濱','太麻里','金峰','大武','達仁',],
        title: '臺東縣',
       },
      '金門縣': {
        synonyms: ['金門','金沙','金湖','金寧','金城','烈嶼','烏坵',],
        title: '金門縣',
       },
      '澎湖縣': {
        synonyms: ['澎湖','馬公','西嶼','望安','七美','白沙','湖西',],
        title: '澎湖縣',
       },
      '連江縣': {
        synonyms: ['馬祖','南竿','北竿','莒光','東引',],
        title: '連江縣',
       },
    },
  }));
});


app.intent('區域查詢結果', (conv, input, option) => {
   return new Promise(
   
   function(resolve,reject){
	getJSON('https://opendata.cwb.gov.tw/fileapi/v1/opendataapi/F-C0032-'+converter[option]+'?Authorization=CWB-D48B64A0-8BCB-497F-96E3-BD5EB63CF502&downloadType=WEB&format=JSON')
    .then(function(response) {
    resolve(response.cwbopendata.dataset.parameterSet.parameter)
    }).catch(function(error) {
	 var reason=new Error('資料獲取失敗');
     reject(reason)	
	});
	}).then(function (final_data) {

	var subtitle=final_data[0].parameterValue;
	 subtitle=replaceString(subtitle,'，',' • ');
	 subtitle=replaceString(subtitle,'。','\n');
	 
	var report_context="";
	var i=0;
	for(i=1;i<final_data.length;i++){
		report_context=report_context+final_data[i].parameterValue+"  \n  \n";
		if(i===6){break;}
	}
	report_context=reduceSIZE(report_context);
	var output=replaceString(report_context,'＝','<break time="0.5s"/>');


	conv.ask(new SimpleResponse({               
			speech: `<speak><p><s>在${option}，${report_context}</s></p></speak>`,
			text: '下面是「'+option+'」的天氣概況資訊'}));
	conv.close(new BasicCard({  
			title:option,
			subtitle:subtitle,
			text:report_context,
	  })); 
	  conv.ask(new Suggestions('我要以縣市查詢','掰掰'));           

	}).catch(function (error) {
    conv.ask(new SimpleResponse({ 
			 speech: `<speak><p><s>獲取資料發生錯誤，請稍後再試。</s></p></speak>`,
			   text: '獲取資訊發生未知錯誤',}));
	console.log(error)

	conv.close(new BasicCard({  
		image: new Image({url:'https://dummyimage.com/1037x539/ef2121/ffffff.png&text=錯誤',alt:'Pictures',}),
		title:"發生錯誤，請稍後再試",display: 'CROPPED',}));	
	
});

});

app.intent('快速查詢縣市資訊', (conv, {county}) => {

   return new Promise(
   
   function(resolve,reject){

	if(thearray.indexOf(county)!==-1){

		getJSON('https://opendata.cwb.gov.tw/fileapi/v1/opendataapi/F-C0032-'+converter[county]+'?Authorization=CWB-D48B64A0-8BCB-497F-96E3-BD5EB63CF502&downloadType=WEB&format=JSON')
		.then(function(response) {
		resolve(response.cwbopendata.dataset.parameterSet.parameter)
		}).catch(function(error) {
		 var reason=new Error('資料獲取失敗');
		 reject(reason)	});
	}
	else{	
	var fetch = new FetchStream("https://opendata.cwb.gov.tw/fileapi/opendata/MFC/F-C0032-031.FW50",{disableDecoding:true});

	fetch.on("data", function(chunk){
		resolve(iconv.decode(chunk,'BIG5'));
	});
	}
	}).then(function (final_data) {
		
	if(thearray.indexOf(county)!==-1){

	var subtitle=final_data[0].parameterValue;
	 subtitle=replaceString(subtitle,'，',' • ');
	 subtitle=replaceString(subtitle,'。','\n');
	 
	var report_context="";
	var i=0;
	for(i=1;i<final_data.length;i++){
		report_context=report_context+final_data[i].parameterValue+"  \n  \n";
		if(i===6){break;}
	}
	report_context=reduceSIZE(report_context);
	var output=replaceString(report_context,'＝','<break time="0.5s"/>');


	conv.ask(new SimpleResponse({               
			speech: `<speak><p><s>在${county}，${report_context}</s></p></speak>`,
			text: '下面是「'+county+'」的天氣概況資訊'}));
	conv.close(new BasicCard({  
			title:county,
			subtitle:subtitle,
			text:report_context,
	}));

	}else{
	 var report_time=(final_data.split('發布時間：')[1]).split('分')[0]+"分";
		 report_time=reduceSIZE(report_time);
	 var report_contect=(final_data.split('】。')[1]).split('根據環保署')[0];
	 var display_report=replaceString(final_data.split('０分')[1], '；https://airtw.epa.gov.tw/', '');
		 display_report=reduceSIZE(display_report);
		 display_report=replaceString(display_report,'\r\n','');
		 display_report=display_report.split('根據環保署')[0]
	 
	 conv.ask(new SimpleResponse({speech:`<speak><p><s>以下是中央氣象局，在${report_time}所發布的天氣概況。<break time="0.5s"/>${report_contect}</s></p></speak>`,text: '下面是最新的天氣概況'} ));
	 conv.close(new BasicCard({   
				title: '全台天氣概況',
				subtitle:"發布於"+report_time,
				text:replaceString(display_report, '。', '。  \n  \n'),}));
	}
	}).catch(function (error) {
    conv.ask(new SimpleResponse({ 
			 speech: `<speak><p><s>獲取資料發生錯誤，請稍後再試。</s></p></speak>`,
			   text: '獲取資訊發生未知錯誤',}));
	console.log(error)
	conv.close(new BasicCard({  
		image: new Image({url:'https://dummyimage.com/1037x539/ef2121/ffffff.png&text=錯誤',alt:'Pictures',}),
		title:"發生錯誤，請稍後再試",display: 'CROPPED',}));	
	
});

});

app.intent('結束對話', (conv) => {
		conv.user.storage = {}; //離開同時清除暫存資料
		conv.ask('希望能幫上一點忙!');
		conv.ask(new SimpleResponse({speech: '下次見',text: '下次見 👋',}));
		conv.close(new BasicCard({   
			title: '感謝您的使用!', 
			text:'如果有任何需要改進的地方，  \n歡迎到簡介頁面評分或給予反饋，謝謝!', 
			buttons: new Button({title: '開啟本程式的商店頁面',url: 'https://assistant.google.com/services/a/uid/000000971a4ed57e',}),
	  })); 
});


// Set the DialogflowApp object to handle the HTTPS POST request.
exports.tw_weather_helper = functions.https.onRequest(app);
