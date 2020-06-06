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
var links=require('./link_convert.json');
var county_array=["臺北市","新北市","基隆市","桃園市","新竹縣","苗栗縣","新竹市","台中市","南投縣","彰化縣","雲林縣","嘉義縣","嘉義市","臺南市","高雄市","屏東縣","宜蘭縣","花蓮縣","臺東縣","金門縣","澎湖縣","連江縣"];
var word1="";
var word2="";
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
 var subtitle=(final_data.split('【')[1]).split('】')[0];
 var report_contect=(final_data.split('】。')[1]).split('根據環保署')[0];
 var display_report=replaceString(final_data.split('】。')[1], '；https://airtw.epa.gov.tw/', '');
	 display_report=reduceSIZE(display_report);
	 display_report=replaceString(display_report,'\r\n','');
	 display_report=display_report.split('根據環保署')[0]
	 
 conv.ask(new SimpleResponse({speech:`<speak><p><s>以下是中央氣象局，在${report_time}所發布的天氣概況。<break time="0.5s"/>${report_contect}</s></p></speak>`,text: '下面是最新的天氣概況'} ));
 if(conv.screen){
 conv.ask(new BasicCard({   
			title: '全台天氣概況',
			subtitle:replaceString(subtitle, '\r\n',''),
			text:replaceString(display_report, '。', '。  \n  \n')+"發布於 "+report_time,
        }));
  conv.ask(new Suggestions('查看各個區域','如何加入日常安排','👋 掰掰'));           
  conv.user.storage.direct=false;
  conv.user.storage.station="全臺";
 }
 else{
	word1=county_array[parseInt(Math.random()*11)];word2=county_array[11+parseInt(Math.random()*10)];
	conv.ask(`<speak><p><s>接著</s><s>請試著問我<break time="0.2s"/>${word1}天氣如何?<break time="0.2s"/>或<break time="0.2s"/>幫我查詢${word2}</s></p></speak>`); 
 }
 

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

	word1=county_array[parseInt(Math.random()*11)];word2=county_array[11+parseInt(Math.random()*10)];
	
	conv.ask(new SimpleResponse({               
		  speech: `<speak><p><s>在任意畫面中，你隨時都能快速查詢縣市列表</s><s>你可以試著問<break time="0.2s"/>${word1}天氣如何?<break time="0.2s"/>或<break time="0.2s"/>幫我查詢${word2}</s></p></speak>`,
		  text: '試著提問來快速存取縣市列表，\n以下是你可以嘗試的詢問方式!'}));
	
    conv.ask(new BasicCard({  
				title:"語音查詢範例",
				subtitle:"以下是你可以嘗試的指令",
				text:" • *「"+word1+"天氣如何?」*  \n • *「幫我查詢"+word2+"」*  \n • *「我想知道"+county_array[parseInt(Math.random()*21)]+"怎樣」*  \n • *「幫我找"+county_array[parseInt(Math.random()*21)]+"」*  \n • *「我想看"+county_array[parseInt(Math.random()*21)]+"」*  \n • *「"+county_array[parseInt(Math.random()*21)]+"天氣好嗎?」*  \n • *「我要查"+county_array[parseInt(Math.random()*21)]+"」*", 
	}));
	conv.ask(new Suggestions(word1+'天氣如何?','幫我查詢'+word2,'如何加入日常安排','👋 掰掰'));
    conv.user.storage.direct=false;
    conv.user.storage.station="全臺";
 
});

app.intent('預設罐頭回覆', (conv) => {
	word1=county_array[parseInt(Math.random()*11)];word2=county_array[11+parseInt(Math.random()*10)];

	if(conv.input.type==="VOICE"){ //如果輸入是語音，則顯示錯誤處理方法
	conv.ask(new SimpleResponse({               
				  speech: `<speak><p><s>抱歉，我不懂你的意思</s><s>請試著問我<break time="0.2s"/>${word1}天氣如何?<break time="0.2s"/>或<break time="0.2s"/>幫我查詢${word2}</s></p></speak>`,
	  text: '試著提問來快速存取縣市列表，\n或點選建議卡片來進行操作!'}));
	if(conv.screen){
	 conv.ask(new BasicCard({  
		title:"語音查詢範例",
		subtitle:"以下是你可以嘗試的指令",
		text:" • *「"+word1+"天氣如何?」*  \n • *「幫我查詢"+word2+"」*  \n • *「我想知道"+county_array[parseInt(Math.random()*21)]+"怎樣」*  \n • *「幫我找"+county_array[parseInt(Math.random()*21)]+"」*  \n • *「我想看"+county_array[parseInt(Math.random()*21)]+"」*  \n • *「"+county_array[parseInt(Math.random()*21)]+"天氣好嗎?」*  \n • *「我要查"+county_array[parseInt(Math.random()*21)]+"」*", 
	}));
	conv.ask(new Suggestions(word1+'天氣如何?','幫我查詢'+word2));}
	else{ conv.ask(`<speak><p><s>或對我說<break time="0.2s"/>區域查詢<break time="0.2s"/>查看縣市列表</s></p></speak>`);}

	conv.noInputs = [`<speak><p><s>請試著再問一次</s><s>例如<break time="0.2s"/>${word1}天氣如何?`,"請試著問我要查詢的縣市","很抱歉，我幫不上忙"];	   

	 }else{
	 conv.ask('抱歉，我不懂你的意思，\n請點選建議卡片來進行操作。');
	 }
	conv.ask(new Suggestions('查看全台概況','如何加入日常安排','👋 掰掰'));           
	 
});


app.intent('快速查詢縣市資訊', (conv, {county}) => {

   return new Promise(
   
   function(resolve,reject){

	if(county_array.indexOf(county)!==-1){

		getJSON('https://opendata.cwb.gov.tw/fileapi/v1/opendataapi/F-C0032-'+converter[county]+'?Authorization=CWB-D48B64A0-8BCB-497F-96E3-BD5EB63CF502&downloadType=WEB&format=JSON')
		.then(function(response) {
		resolve(response.cwbopendata.dataset.parameterSet.parameter)
		}).catch(function(error) {
		 var reason=new Error('資料獲取失敗');
		 reject(reason)	});
	}
	else if(county==="全臺"){	
	var fetch = new FetchStream("https://opendata.cwb.gov.tw/fileapi/opendata/MFC/F-C0032-031.FW50",{disableDecoding:true});

	fetch.on("data", function(chunk){resolve(iconv.decode(chunk,'BIG5'));});
	}
	else{reject("無法辨識使用者所要求的查詢")}

	}).then(function (final_data) {
		
	if(county_array.indexOf(county)!==-1){

	var subtitle=final_data[0].parameterValue;
	 subtitle=replaceString(subtitle,'，',' • ');
	 subtitle=replaceString(subtitle,'。','\n');
	 
	var report_context="";
	var i=0;
	for(i=1;i<final_data.length;i++){
		report_context=report_context+final_data[i].parameterValue+"  \n  \n";
		if(final_data[i+1]!==undefined){
		    if(final_data[i+1].parameterValue.indexOf('預報總結')!==-1){break;}}
	}
	report_context=reduceSIZE(report_context);
	var output=replaceString(report_context,'＝','<break time="0.5s"/>');
		output=replaceString(output,'  \n  \n','</s><break time="0.5s"/><s>');

	conv.ask(new SimpleResponse({               
			speech: `<speak><p><s>以下是${county}的天氣報告<break time="1s"/>${output}</s></p></speak>`,
			text: '下面是「'+county+'」的天氣概況'}));

	if(conv.user.storage.direct===false){
	conv.ask(new BasicCard({  
			title:county,
			subtitle:subtitle,
			text:report_context,
			buttons: new Button({title: "前往中央氣象局看詳細報告",url:"https://www.cwb.gov.tw/V8/C/W/County/County.html?CID="+links[county],}),}));
    conv.ask(new Suggestions('如何加入日常安排','查看各個區域','👋 掰掰'));           
    conv.user.storage.station=county;
	}
	else{
	conv.close(new BasicCard({  
			title:county,
			subtitle:subtitle,
			text:report_context,
			buttons: new Button({title: "前往中央氣象局看詳細報告",url:"https://www.cwb.gov.tw/V8/C/W/County/County.html?CID="+links[county],}),}));
	 }		

	}else{
	 var report_time=(final_data.split('發布時間：')[1]).split('分')[0]+"分";
		 report_time=reduceSIZE(report_time);
	 var subtitle=(final_data.split('【')[1]).split('】')[0];
	 var report_contect=(final_data.split('】。')[1]).split('根據環保署')[0];
	 var display_report=replaceString(final_data.split('】。')[1], '；https://airtw.epa.gov.tw/', '');
		 display_report=reduceSIZE(display_report);
		 display_report=replaceString(display_report,'\r\n','');
		 display_report=display_report.split('根據環保署')[0]
		 
	 conv.ask(new SimpleResponse({speech:`<speak><p><s>以下是中央氣象局，在${report_time}所發布的天氣概況。<break time="0.5s"/>${report_contect}</s></p></speak>`,text: '下面是最新的天氣概況'} ));

	if(conv.user.storage.direct===false){
	 conv.ask(new BasicCard({   
				title: '全台天氣概況',
			    subtitle:replaceString(subtitle, '\r\n',''),
				text:replaceString(display_report, '。', '。  \n  \n')+"發布於 "+report_time,
			}));
		conv.ask(new Suggestions('查看各個區域','👋 掰掰'));           
	}
	else{
		conv.close(new BasicCard({   
				title: '全台天氣概況',
			    subtitle:replaceString(subtitle, '\r\n',''),
				text:replaceString(display_report, '。', '。  \n  \n')+"發布於 "+report_time,}));
	 }
	}
	}).catch(function (error) {
	console.log(error)
	word1=county_array[parseInt(Math.random()*11)];word2=county_array[11+parseInt(Math.random()*10)];

	if(conv.user.storage.direct===false){
    conv.ask(new SimpleResponse({ 
			   speech: `<speak><p><s>抱歉，我不懂你的意思</s><s>請試著問我<break time="0.2s"/>${word1}天氣如何?</s></p></speak>`,
			   text: '你的查詢方式有誤，請再試一次!',}));
	 conv.ask(new BasicCard({  
		title:"語音查詢範例",
		subtitle:"透過對話存取縣市報告",
		text:" • *「"+word1+"天氣如何?」*  \n • *「幫我查詢"+word2+"」*  \n • *「我想知道"+county_array[parseInt(Math.random()*21)]+"怎樣」*  \n • *「幫我找"+county_array[parseInt(Math.random()*21)]+"」*  \n • *「我想看"+county_array[parseInt(Math.random()*21)]+"」*  \n • *「"+county_array[parseInt(Math.random()*21)]+"天氣好嗎?」*  \n • *「我要查"+county_array[parseInt(Math.random()*21)]+"」*", }));
	conv.ask(new Suggestions(word1+'天氣如何?','幫我查詢'+word2));
	conv.ask(new Suggestions('查看全台概況','👋 掰掰'));           
	}
	else{
    conv.ask(new SimpleResponse({ 
			   speech: `<speak><p><s>抱歉，我不懂你的意思</s><s>你可以試著說<break time="0.2s"/>問天氣小幫手${word1}天氣如何?</s></p></speak>`,
			   text: '你的查詢方式有誤，請再試一次!',}));
	 conv.close(new BasicCard({  
		title:"語音查詢範例",
		subtitle:"透過對話存取縣市報告",
		text:" • *「問天氣小幫手"+word1+"天氣如何?」*  \n • *「叫天氣小幫手查詢"+word2+"」*  \n • *「問天氣小幫手全台的天氣概況」*", }));
	  }
	});
});


app.intent('加入日常安排', (conv) => {

	var choose_station=conv.user.storage.station;

	conv.ask(new SimpleResponse({               
				  speech: `<speak><p><s>透過加入日常安排，你可以快速存取所需縣市之預報資訊。</s><s>舉例來說，如果你把${choose_station}加入日常安排。你即可隨時呼叫我查詢該站點的最新空氣品質!</s><s>以下為詳細說明</s></p></speak>`,
				  text: '以下為詳細說明，請查照'}));

	conv.ask(new BasicCard({  
			//image: new Image({url:"https://i.imgur.com/82c8u4T.png",alt:'Pictures',}),
			title:'將「'+choose_station+'」加入日常安排', display: 'CROPPED',
			subtitle:'1.點擊畫面右上方大頭貼 > 點擊[設定]\n2.切換到[Google助理]分頁 > 點擊[日常安排]\n3.點擊[新增日常安排]\n4.「新增指令(必填)」輸入「天氣報告」\n5.「新增動作」輸入\n「叫天氣小精靈查詢'+choose_station+'」\n6.輸入完成後點擊「儲存」\n7.現在，你可以透過說出或輸入「天氣報告」來快速查詢'+choose_station+'的天氣報告!',})); 

	conv.ask(new Suggestions('查看全台的天氣概況','👋 掰掰'));

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
