'use strict';
// Import the Dialogflow module from the Actions on Google client library.
const { dialogflow,Suggestions,SimpleResponse, Button,Image, BasicCard, RegisterUpdate} = require('actions-on-google');

var admin = require('firebase-admin');
const {WebhookClient} = require('dialogflow-fulfillment');
const replaceString = require('replace-string');

const functions = require('firebase-functions');
const app = dialogflow({debug: true});
var daily_history = require('./daily_history.json');

var data_new="";
var i=0;
var length=0;

var todayarray=[];
var arraynumber=0;
//本文內容
var random_output="";
var Year_record="";var Year_record_output="";
var context="";

var Time="";
var input_date ="";
var date="10月1日";
var months = ["1月","2月","3月","4月","5月","6月","7月","8月","9月","10月","11月","12月"];
var month ="";
var day ="";
var Hournow="";
var left_day=0;
var word1="";var word2="";var word3="";

function Time_get(){
	Time= new Date();
	month =months[Time.getMonth()];
	day =Time.getDate();
	Hournow=Time.getHours()+8;
	
	if(Hournow>=24){day++;}
	date=month+day+'日';
    if(date==="1月32日"){date="2月1日"}
	else if(date==="2月29日"&&(Time.getFullYear()%4)!==0){date="3月1日"}
	else if(date==="2月30日"&&(Time.getFullYear()%4)===0){date="3月1日"}
    else if(date==="3月32日"){date="4月1日"}
    else if(date==="4月31日"){date="5月1日"}
    else if(date==="5月32日"){date="6月1日"}
    else if(date==="6月31日"){date="7月1日"}
    else if(date==="7月32日"){date="8月1日"}
    else if(date==="8月32日"){date="9月1日"}
    else if(date==="9月31日"){date="10月1日"}
    else if(date==="10月32日"){date="11月1日"}
    else if(date==="11月31日"){date="12月1日"}
    else if(date==="12月32日"){date="1月1日"}
	return date;
}
var currentYear="" ;
var hasTimestamp = "" ;
var day_cal=0;
var month_cal=0;
var flag=true;
var temp="";var output_array="";

function day_countdown(date){
 var temp="";
 day_cal=(date.split('月')[1]).split('日')[0];
 month_cal=date.split('月')[0];
 currentYear = new Date().getFullYear().toString(); // 今天减今年的第一天（xxxx年01月01日）
 temp=month_cal+'/'+day_cal+','+currentYear;
 hasTimestamp = new Date(temp) - new Date(currentYear); // 86400000 = 24 * 60 * 60 * 1000
 return Math.ceil(hasTimestamp / 86400000) + 1;
}

function getDay(num, str) {
    var today = new Date();
    var nowTime = today.getTime();
    var ms = 24*3600*1000*num;
    today.setTime(parseInt(nowTime + ms));
    var oYear = today.getFullYear();
    var oMoth = (today.getMonth() + 1).toString();
    if (oMoth.length <= 1) oMoth = '0' + oMoth;
    var oDay = today.getDate().toString();
    if (oDay.length <= 1) oDay = '0' + oDay;
    return oYear + str + oMoth + str + oDay;
}

function Randomday(){
	var random=parseInt(Math.random()*1)
	if(random===0){temp=getDay(parseInt(Math.random()*365),'-')}
	else{temp=getDay(parseInt(Math.random()*(-365)), '-')}
	
	return (parseInt(temp.split('-')[1]))+'月'+(parseInt(temp.split('-')[2]))+'日';
}

function count(arr,num){ 
  var total = 0;
   for (var i = arr.length - 1; i >= 0; i--){ arr[i] === num ? total++ : '' }; 
   return total; 
  }
var response_array=["OK","好的","沒問題","收到","了解"];
var day_array=["元旦","上禮拜一","下禮拜一","前天","1天前","1天後","1個月前","1個月後","上個月","下個月","母親節","上禮拜二","下禮拜二","昨天","2天前","2天後","2個月前","2個月後","上上個月","下下個月","父親節","上禮拜三","下禮拜三","今天","3天前","3天後","3個月前","3個月後","上上上個月","下下下個月","雙十節","上禮拜四","下禮拜四","明天","4天前","4天後","4個月前","4個月後","上上上上個月","下下下下個月","聖誕節","上禮拜五","下禮拜五","後天","5天前","5天後","5個月前","5個月後","上禮拜六","上禮拜日","下禮拜日","7天前","下禮拜六","大後天","6天前","6天後","6個月前","6個月後","7天後","7個月前","8天前","8天後","8個月前","8個月後","9天前","9天後","9個月前","7個月後","10天前","10天後","9個月後","10個月前","10個月後","地球日"];
  
app.intent('預設歡迎語句', (conv) => {
	
	input_date=Time_get();
	
	todayarray=daily_history[input_date];//進入資料庫取得對應資訊
	
	arraynumber=parseInt(Math.random()*(todayarray.length-1));
	random_output=todayarray[arraynumber];
	Year_record=random_output.split('：')[0];
	context=random_output.split('：')[1];
	Year_record_output=replaceString(Year_record, '年', ''); ;
	Year_record_output=replaceString(Year_record_output, '前', '-'); ;
	left_day=day_countdown(input_date);

    if (conv.user.last.seen) {
	
	conv.ask(new SimpleResponse({ 
					speech: `<speak><p><s>在西元${Year_record}的${input_date}</s><break time="0.25s"/><s>${context}</s></p></speak>`,
					text: '歡迎回來!\n以下是歷史上今天曾發生的事'}));
	conv.ask(new BasicCard({
			title:Year_record+' '+input_date,
			subtitle:'距今'+(currentYear-Year_record_output)+'年前',
			text:context,
			//buttons: new Button({title: '維基百科',url:'',display: 'CROPPED',}),
	}));}
	else{
	conv.ask(new SimpleResponse({ 
					speech: `<speak><p>><s>歡迎使用，我可以帶領你快速查詢各個日期曾發生的事</s><s>你可以隨口提問或點選建議卡片來進行操作</s><s>此外，你也可以將我訂閱今日歷史事件隨時查詢呦!</s></p></speak>`,
					text: '歡迎使用!\n以下是歷史上今天曾發生的事'}));
	conv.ask(new BasicCard({
			title:Year_record+' '+input_date,
			subtitle:'距今'+(currentYear-Year_record_output)+'年前',
			text:context,
	}));
	
	conv.ask(new Suggestions('訂閱今日歷史事件'));}

	conv.ask(new Suggestions('再來一個',day_array[parseInt(Math.random()*73)]+'呢?','那'+day_array[parseInt(Math.random()*73)]+'?','在'+Randomday()+'發生過甚麼?','👋 掰掰'));
			
	conv.user.storage.direct=false;
	conv.user.storage.currentDay=input_date;

});

app.intent('指定查詢時間', (conv,{input_date,another_name}) => {

	temp="";  flag=false;

	if(input_date.length=== 0&&another_name.length!== 0){
		if(another_name==="2月29日"){date=another_name;}
		else{
		date=another_name;
		date=replaceString(date, '一', '1'); 
		date=replaceString(date, '二', '2'); 
		date=replaceString(date, '三', '3'); 
		date=replaceString(date, '四', '4'); 
		date=replaceString(date, '五', '5'); 
		date=replaceString(date, '六', '6'); 
		date=replaceString(date, '七', '7'); 
		date=replaceString(date, '八', '8'); 
		date=replaceString(date, '九', '9'); 
		}
	}
	else if (input_date.length!== 0&&another_name.length=== 0){date=input_date;}
    else{flag=true;}
	
	if(flag===false){
	if(date.indexOf('T')!==-1&&date.indexOf('-')!==-1){
		temp=date.split('T')[0];}
    else{
		if(date==="2月29日"){}
		else if(date.indexOf('大前天')!==-1){temp=getDay(-3, '-');}
		else if(date.indexOf('前天')!==-1){temp=getDay(-2, '-');}
		else if(date.indexOf('昨天')!==-1){temp=getDay(-1, '-');}
		else if(date.indexOf('今天')!==-1){temp=getDay(0, '-');}
		else if(date.indexOf('明天')!==-1){temp=getDay(1, '-');}
		else if(date.indexOf('大後天')!==-1){temp=getDay(3, '-');}
		else if(date.indexOf('後天')!==-1){temp=getDay(2, '-');}
		else if(date.indexOf('天前')!==-1){
			var upcount=date.split('天')[0];
			temp=getDay((-1)*upcount, '-');
		}
		else if(date.indexOf('天後')!==-1){
			var upcount=date.split('天')[0];
			temp=getDay(1*upcount, '-');
		}
		else if(date.indexOf('禮拜')!==-1&&date.indexOf('上')!==-1){
			var tem_array=(date.split('禮拜')[0]).split('');
			var upcount=count(tem_array,'上');
			temp=getDay(upcount*(-7), '-');
		}
		else if(date.indexOf('禮拜')!==-1&&date.indexOf('下')!==-1){
			var tem_array=(date.split('禮拜')[0]).split('');
			var upcount=count(tem_array,'下');
			temp=getDay(upcount*7, '-');
		}
		else if(date.indexOf('個月前')!==-1){
			var upcount=date.split('個')[0];
			temp=getDay(upcount*(-30), '-');
		}
		else if(date.indexOf('個月後')!==-1){
			var upcount=date.split('個')[0];
			temp=getDay(upcount*(+30), '-');
		}
		else if(date.indexOf('月')!==-1&&date.indexOf('上')!==-1){
			var tem_array=(date.split('禮拜')[0]).split('');
			var upcount=count(tem_array,'上');
			temp=getDay(upcount*(-30), '-');
		}
		else if(date.indexOf('月')!==-1&&date.indexOf('下')!==-1){
			var tem_array=(date.split('禮拜')[0]).split('');
			var upcount=count(tem_array,'下');
			temp=getDay(upcount*30, '-');
		}
		else{flag=true;}
		}	
	}

   return new Promise(function(resolve,reject){

	if(flag===false){
		if(date==="2月29日"){input_date=date;}
		else{input_date=(parseInt(temp.split('-')[1]))+'月'+(parseInt(temp.split('-')[2]))+'日';}

		output_array=daily_history[input_date];//進入資料庫取得對應資訊

		left_day=day_countdown(input_date);
		resolve([input_date,output_array,left_day])
	}else{
		 var reason=new Error('資料獲取失敗');
		 reject(reason)
	}
}).then(function (origin_data) {

	//轉換資料格式
	input_date= origin_data[0];
    todayarray=	origin_data[1];
	left_day= origin_data[2];
	
	arraynumber=parseInt(Math.random()*(todayarray.length-1));
	random_output=todayarray[arraynumber];
	Year_record=random_output.split('：')[0];
	Year_record_output=replaceString(Year_record, '年', ''); ;
	Year_record_output=replaceString(Year_record_output, '前', '-'); ;
	context=random_output.split('：')[1];
	currentYear = new Date().getFullYear().toString(); // 今天减今年的第一天（xxxx年01月01日）

	conv.ask(new SimpleResponse({ 
					speech: `<speak><p><s>在西元${Year_record}的${input_date}</s><break time="0.25s"/><s>${context}</s></p></speak>`,
					text: '以下是歷史上'+input_date+'曾發生的事'}));

	if(conv.user.storage.direct===false){
	conv.ask(new BasicCard({
			title:Year_record+' '+input_date,
			subtitle:'距今'+(currentYear-Year_record_output)+'年前',
			text:context,
			//buttons: new Button({title: '維基百科',url:'',display: 'CROPPED',}),
	}));
	conv.ask(new Suggestions('再來一個',day_array[parseInt(Math.random()*73)]+'呢?','那'+day_array[parseInt(Math.random()*73)]+'?','在'+Randomday()+'發生過甚麼?','訂閱今日歷史事件','👋 掰掰'));
	conv.user.storage.currentDay=input_date;1
	}
	else{
	conv.close(new BasicCard({
			title:Year_record+' '+input_date,
			subtitle:'距今'+(currentYear-Year_record_output)+'年前',
			text:context,
			//buttons: new Button({title: '維基百科',url:'',display: 'CROPPED',}),
			}));
	}
	}).catch(function (error) {
	
	console.log(error);
	word1=day_array[parseInt(Math.random()*73)];
	word2=day_array[parseInt(Math.random()*73)];
	word3=day_array[parseInt(Math.random()*73)];

	conv.ask(new SimpleResponse({ 
					speech: `<speak><p><s>抱歉</s><s>你的查詢方式有誤，請換個方式問問看</s></p></speak>`,
					text: '你的查詢方式有誤，請再試一次。'}));
	if(conv.user.storage.direct===false){

	conv.ask(new BasicCard({  
		title:"語音查詢範例",
		subtitle:"以下是你可以嘗試的指令",
		text:" • *「"+word1+"發生過甚麼事?」*  \n • *「"+word2+"的歷史事件」*  \n • *「那"+word3+"有甚麼事?」*  \n • *「幫我看"+Randomday()+"」*  \n • *「我想看"+day_array[parseInt(Math.random()*73)]+"」*  \n • *「"+Randomday()+"有甚麼事?」*  \n • *「我要查"+day_array[parseInt(Math.random()*73)]+"」*", 
	}));
	conv.ask(new Suggestions(word1+'發生過甚麼事?',""+word2+"的歷史事件",'那'+word3+'有甚麼事?','👋 掰掰'));
	}else{
	conv.close(new BasicCard({  
		title:"語音查詢範例",
		subtitle:"以下是你可以嘗試的指令",
		text:" • *「"+word1+"發生過甚麼事?」*  \n • *「"+word2+"的歷史事件」*  \n • *「那"+word3+"有甚麼事?」*  \n • *「幫我看"+Randomday()+"」*  \n • *「我想看"+day_array[parseInt(Math.random()*73)]+"」*  \n • *「"+Randomday()+"有甚麼事?」*  \n • *「我要查"+day_array[parseInt(Math.random()*73)]+"」*", 
	}));
	}

    });

});

app.intent('重複查詢同一天', (conv) => {

	input_date=conv.user.storage.currentDay;
	
	todayarray=daily_history[input_date];//進入資料庫取得對應資訊
	
	arraynumber=parseInt(Math.random()*(todayarray.length-1));
	random_output=todayarray[arraynumber];
	Year_record=random_output.split('：')[0];
	Year_record_output=replaceString(Year_record, '年', ''); ;
	Year_record_output=replaceString(Year_record_output, '前', '-'); ;
	context=random_output.split('：')[1];

	left_day=day_countdown(input_date);
	
	conv.ask(new SimpleResponse({ 
					speech: `<speak><p><s>在西元${Year_record}的${input_date}</s><break time="0.25s"/><s>${context}</s></p></speak>`,
					text: response_array[parseInt(Math.random()*4)]+'，\n以下是'+input_date+'曾發生的其他事件。'}));
	conv.ask(new BasicCard({
			title:Year_record+' '+input_date,
			subtitle:'距今'+(currentYear-Year_record_output)+'年前',
			text:context,
			//buttons: new Button({title: '維基百科',url:'',display: 'CROPPED',}),
			}));
	conv.ask(new Suggestions('再來一個',day_array[parseInt(Math.random()*73)]+'呢?','那'+day_array[parseInt(Math.random()*73)]+'?','在'+Randomday()+'發生過甚麼?','訂閱今日歷史事件','👋 掰掰'));
			
	conv.user.storage.direct=false;
	conv.user.storage.currentDay=input_date;
});

app.intent('Default Fallback Intent', (conv) => {

	word1=day_array[parseInt(Math.random()*73)];
	word2=day_array[parseInt(Math.random()*73)];
	word3=day_array[parseInt(Math.random()*73)];

	conv.ask(new SimpleResponse({ 
				  speech: `<speak><p><s>抱歉，我不懂你的意思</s><s>請試著問我<break time="0.2s"/>${word1}發生過甚麼事?<break time="0.2s"/>或<break time="0.2s"/>${word2}的歷史事件」</s></p></speak>`,
					text: '你的查詢方式有誤，請再試一次。'}));

	conv.ask(new BasicCard({  
		title:"語音查詢範例",
		subtitle:"以下是你可以嘗試的指令",
		text:" • *「"+word1+"發生過甚麼事?」*  \n • *「"+word2+"的歷史事件」*  \n • *「那"+word3+"有甚麼事?」*  \n • *「幫我看"+Randomday()+"」*  \n • *「我想看"+day_array[parseInt(Math.random()*73)]+"」*  \n • *「"+Randomday()+"有甚麼事?」*  \n • *「我要查"+day_array[parseInt(Math.random()*73)]+"」*", 
	}));
	conv.ask(new Suggestions(word1+'發生過甚麼事?',""+word2+"的歷史事件",'那'+word3+'有甚麼事?','👋 掰掰'));

});

app.intent('日常安排教學', (conv) => {

   conv.ask(new SimpleResponse({               
				  speech: `<speak><p><s>透過訂閱今日歷史事件，你可以快速存取歷史上任意時間所發生的事。</s><s>以下為如何訂閱今日歷史事件的詳細說明</s></p></speak>`,
	text: '以下為詳細說明。'}));

	conv.ask(new BasicCard({  
		title:"快速查詢今天的歷史事件",
		subtitle:'1.點擊畫面右上方大頭貼 > 點擊[設定]\n2.切換到[Google助理]分頁 > 點擊[日常安排]\n3.點擊[新增日常安排]\n4.「新增指令(必填)」輸入「歷史事件」\n5.「新增動作」輸入\n「叫每日大事記找今天的歷史」\n6.輸入完成後點擊「儲存」\n7.現在，你可以透過說出或輸入「歷史事件」來快速查詢今天的歷史事件!',
	}));
	conv.ask(new Suggestions('訂閱今日歷史事件','👋 掰掰'));

});

app.intent('訂閱每日快訊', (conv) => {

  conv.ask(new RegisterUpdate({
    intent: '指定查詢時間',
    arguments: [
      {
        name: 'input_date',
        textValue: '今天',
      },
    ],
    frequency: 'DAILY',
 }));
	  
});

	var time_temp='';
	var time_12tag=false; //標記是否為12點過後
	var hour_temp='';
	var sec_temp='';

	const CancelContexts = {
	  parameter: 'cancel ',
	}	

app.intent('確認訂閱通知', (conv, params, registered)  => {

  if (registered && registered.status === 'OK') {
	 time_temp=conv.arguments.parsed.input.text;
	 time_12tag=false; //標記是否為12點過後
	 
if(time_temp.indexOf('凌晨')!==-1||time_temp.indexOf('上午')!==-1||time_temp.indexOf('早上')!==-1||time_temp.indexOf('中午')!==-1||time_temp.indexOf('下午')!==-1||time_temp.indexOf('傍晚')!==-1||time_temp.indexOf('晚上')!==-1)	{
	if(time_temp.indexOf('凌晨')!==-1){time_temp.split('凌晨')[1];}
	else if(time_temp.indexOf('上午')!==-1){time_temp=time_temp.split('上午')[1];}
	else if(time_temp.indexOf('早上')!==-1){time_temp=time_temp.split('早上')[1];}
	else if(time_temp.indexOf('中午')!==-1){time_temp=time_temp.split('中午')[1];}
	else if(time_temp.indexOf('下午')!==-1){time_temp=time_temp.split('下午')[1];time_12tag=true;}
	else if(time_temp.indexOf('晚上')!==-1){time_temp=time_temp.split('晚上')[1];time_12tag=true;}
	
	hour_temp=time_temp.split('點')[0];
	sec_temp=time_temp.split('點')[1];
  }
  else if(time_temp.indexOf('am')!==-1||time_temp.indexOf('pm')!==-1)
  {
	if(time_temp.indexOf('am')!==-1){time_temp=replaceString(time_temp, 'am', ''); }
	else if(time_temp.indexOf('pm')!==-1){time_temp=replaceString(time_temp, 'pm', '');time_12tag=true;}
	hour_temp=time_temp.split(':')[0];
	sec_temp=time_temp.split(':')[1];
 }

	if(time_12tag===true){hour_temp=parseInt(hour_temp)+12;}
  	if(sec_temp.indexOf('半')!==-1){sec_temp='30';}
  	if(sec_temp.indexOf('整')!==-1){sec_temp='00';}
	sec_temp=sec_temp.split('分')[0];

	conv.contexts.set(CancelContexts.parameter, 5);
	
	var time_temp=hour_temp+'點'+sec_temp+'分'
	
	conv.ask(new SimpleResponse({               
				  speech: `<speak><p><s>好的，我會在每天的${hour_temp}點${sec_temp}分傳送通知</s><s>您只需點擊該通知即可快速獲得歷史上今天曾發生的事</s></p></speak>`,
	  text: 'OK，我會在你指定的時間點通知你。'}));	
	  conv.ask(new BasicCard({  
		image: new Image({url:"https://i.imgur.com/Y5NoIp7.png",alt:'Pictures',}),
		title:'推送通知的指定時間是'+hour_temp+':'+sec_temp,
		subtitle:'您現在已訂閱完成',
		text:'*[!]屆時通知將如上方所示，點擊即可快速獲取資訊*',display: 'CROPPED',
		 })); 
	  
  }else{
	conv.ask(new SimpleResponse({speech:`<speak><p><s>收到，您的訂閱流程已終止。</s><s>不過你隨時可以回來進行操作。</s></p></speak>`,text:"您的訂閱流程已終止。"}));                 
  }
 conv.ask(new Suggestions('如何取消訂閱','回主頁面','👋 掰掰'));

});

app.intent('取消訂閱說明', (conv) => {
	
const context = conv.contexts.get(CancelContexts.parameter)
conv.ask(new SimpleResponse({               
				  speech: `<speak><p><s>要進行該操作，請先退出本服務</s><s>然後，對Google助理說<break time="0.2s"/>查看我的訂閱項目<break time="0.2s"/>或<break time="0.2s"/>我訂閱了哪些項目</s><s>接著，依序輕觸要取消的訂閱項目。並選取[取消訂閱]</s></p></speak>`,
	  text: '進行該操作前，請先退出本服務。\n接著依據下方卡片的說明進行操作。'}));
	  
conv.ask(new BasicCard({  
		text:'1.說出或輸入：  \n    •  *「查看我的訂閱項目」*  \n    •  *「我訂閱了哪些項目？」*  \n2.依序輕觸要取消訂閱的項目  \n3.接下來點選 [取消訂閱]。',display: 'CROPPED',
		 })); 
 conv.ask(new Suggestions('回主頁面','👋 掰掰'));

});


app.intent('結束對話', (conv) => {
		conv.user.storage = {}; //離開同時清除暫存資料
		conv.ask('希望能幫到一點忙!');
		conv.ask(new SimpleResponse({speech: '下次見',text: '下次見 👋',}));
		conv.close(new BasicCard({   
			title: '感謝您的使用!', 
			text:'如果有任何需要改進的地方，  \n歡迎到簡介頁面評分或給予反饋，謝謝!', 
			buttons: new Button({title: '開啟本程式的商店頁面',url: 'https://assistant.google.com/services/a/uid/000000d67993a1d2',}),
	  })); 
});

// Set the DialogflowApp object to handle the HTTPS POST request.
exports.today_history = functions.https.onRequest(app);