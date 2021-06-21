'use strict';
// Import the Dialogflow module from the Actions on Google client library.
const { dialogflow, Suggestions, SimpleResponse, Button, Image, BasicCard, RegisterUpdate } = require('actions-on-google');

const replaceString = require('replace-string');

const functions = require('firebase-functions');
const app = dialogflow({ debug: true });
var daily_history = require('./daily_history.json');
var conductor = require('./day_transformer.js');

var date = "10月1日";

function day_countdown(date) {
	var day_cal = (date.split('月')[1]).split('日')[0];
	var month_cal = date.split('月')[0];
	var currentYear = new Date().getFullYear().toString(); // 今天减今年的第一天（xxxx年01月01日）
	var temp = month_cal + '/' + day_cal + ',' + currentYear;
	var hasTimestamp = new Date(temp) - new Date(currentYear); // 86400000 = 24 * 60 * 60 * 1000
	return Math.ceil(hasTimestamp / 86400000) + 1;
}

function getDay(num) {
	var today = new Date();
	var nowTime = today.getTime();
	var ms = 24 * 3600 * 1000 * num;
	today.setTime(parseInt(nowTime + ms));
	var oMoth = (today.getMonth() + 1).toString();
	var oDay = today.getDate().toString();
	return oMoth + '月' + oDay + '日';
}

function Randomday() {
	var random = parseInt(Math.random() * 1)
	if (random === 0) {
		return getDay(parseInt(Math.random() * 365))
	}
	else {
		return getDay(parseInt(Math.random() * (-365)))
	}

}


var response_array = ["OK", "好的", "沒問題", "收到", "了解"];
var day_array = ["元旦", "上禮拜一", "下禮拜一", "前天", "1天前", "1天後", "1個月前", "1個月後", "上個月", "下個月", "母親節", "上禮拜二", "下禮拜二", "昨天", "2天前", "2天後", "2個月前", "2個月後",   "父親節", "上禮拜三", "下禮拜三", "今天", "3天前", "3天後", "3個月前", "3個月後", "雙十節", "上禮拜四", "下禮拜四", "明天", "4天前", "4天後", "4個月前", "4個月後", "聖誕節", "上禮拜五", "下禮拜五", "後天", "5天前", "5天後", "5個月前", "5個月後", "上禮拜六", "上禮拜日", "下禮拜日", "7天前", "下禮拜六", "大後天", "6天前", "6天後", "6個月前", "6個月後", "7天後", "7個月前", "8天前", "8天後", "8個月前", "8個月後", "9天前", "9天後", "9個月前", "7個月後", "10天前", "10天後", "9個月後", "10個月前", "10個月後", "地球日"];

app.intent('預設歡迎語句', (conv) => {

	var input_date = getDay(0);
	var todayarray = daily_history[input_date];//進入資料庫取得對應資訊
	var arraynumber = parseInt(Math.random() * (todayarray.length - 1));
	var random_output = todayarray[arraynumber];
	var Year_record = random_output.split('：')[0];
	var context = random_output.split('：')[1];
	var Year_record_output = replaceString(Year_record, '年', '');;
		Year_record_output = replaceString(Year_record_output, '前');;

	var speech_content={
		speech: `<speak><p><s>在西元${Year_record}的${input_date}</s><break time="0.25s"/><s>${context}</s></p></speak>`,
		text: '歡迎回來!\n以下是歷史上今天曾發生的事'
	}

	if (conv.user.last.seen===undefined) {
		speech_content.speech= `<speak><p>><s>歡迎使用，我可以帶領你快速查詢各個日期曾發生的事</s><s>你可以隨口提問或點選建議卡片來進行操作</s></p></speak>`;
	}
	
	conv.ask(new SimpleResponse(speech_content));
	conv.ask(new BasicCard({
		title: Year_record + ' ' + input_date,
		subtitle: '距今' + (new Date().getFullYear().toString() - Year_record_output) + '年前',
		text: context,
	}));

	conv.ask(new Suggestions('再來一個', day_array[parseInt(Math.random() * 73)] + '呢?', '那' + day_array[parseInt(Math.random() * 73)] + '?', '在' + Randomday() + '發生過甚麼?', '👋 掰掰'));
	conv.ask(new Suggestions('每天傳送'));

	conv.user.storage.direct = false;
	conv.user.storage.currentDay = input_date;

});

app.intent('指定查詢時間', (conv, { input_date, another_name }) => {

	return new Promise(function (resolve, reject) {

		var processed_date = conductor.transformer(input_date,another_name); 
		var output_array = daily_history[processed_date];//進入資料庫取得對應資訊
		var left_day = day_countdown(processed_date);

		resolve([processed_date, output_array, left_day])
		
	}).then(function (origin_data) {

		//轉換資料格式
		var input_date = origin_data[0];
		var todayarray = origin_data[1];

		var arraynumber = parseInt(Math.random() * (todayarray.length - 1));
		var random_output = todayarray[arraynumber];
		var Year_record = random_output.split('：')[0];
		var Year_record_output = replaceString(Year_record, '年', '');;
		Year_record_output = replaceString(Year_record_output, '前', '-');;
		var context = random_output.split('：')[1];

		conv.ask(new SimpleResponse({
			speech: `<speak><p><s>在西元${Year_record}的${input_date}</s><break time="0.25s"/><s>${context}</s></p></speak>`,
			text: '以下是歷史上' + input_date + '曾發生的事'
		}));

		conv.ask(new BasicCard({
			title: Year_record + ' ' + input_date,
			subtitle: '距今' + (new Date().getFullYear().toString() - Year_record_output) + '年前',
			text: context,
			//buttons: new Button({title: '維基百科',url:'',display: 'CROPPED',}),
		}));
		conv.ask(new Suggestions('再來一個', day_array[parseInt(Math.random() * 73)] + '呢?', '那' + day_array[parseInt(Math.random() * 73)] + '?', '在' + Randomday() + '發生過甚麼?', '👋 掰掰'));
		conv.user.storage.currentDay = input_date; 1
		
		if (conv.user.storage.direct !== false) { conv.expectUserResponse = false } //告知Google助理結束對話

	}).catch(function (error) {

		console.log(error);
		var word1 = day_array[parseInt(Math.random() * 73)];
		var word2 = day_array[parseInt(Math.random() * 73)];
		var word3 = day_array[parseInt(Math.random() * 73)];

		conv.ask(new SimpleResponse({
			speech: `<speak><p><s>抱歉</s><s>你的查詢方式有誤，請換個方式問問看</s></p></speak>`,
			text: '你的查詢方式有誤，請再試一次。'
		}));


		conv.ask(new BasicCard({
			title: "語音查詢範例",
			subtitle: "以下是你可以嘗試的指令",
			text: " • *「" + word1 + "發生過甚麼事?」*  \n • *「" + word2 + "的歷史事件」*  \n • *「那" + word3 + "有甚麼事?」*  \n • *「幫我看" + Randomday() + "」*  \n • *「我想看" + day_array[parseInt(Math.random() * 73)] + "」*  \n • *「" + Randomday() + "有甚麼事?」*  \n • *「我要查" + day_array[parseInt(Math.random() * 73)] + "」*",
		}));
		conv.ask(new Suggestions(word1 + '發生過甚麼事?', "" + word2 + "的歷史事件", '那' + word3 + '有甚麼事?', '👋 掰掰'));
	
		if (conv.user.storage.direct !== false) { conv.expectUserResponse = false } //告知Google助理結束對話

	});

});

app.intent('重複查詢同一天', (conv) => {

	var input_date = conv.user.storage.currentDay;

	var todayarray = daily_history[input_date];//進入資料庫取得對應資訊

	var arraynumber = parseInt(Math.random() * (todayarray.length - 1));
	var random_output = todayarray[arraynumber];
	var Year_record = random_output.split('：')[0];
	var Year_record_output = replaceString(Year_record, '年', '');;
	Year_record_output = replaceString(Year_record_output, '前', '-');;
	var context = random_output.split('：')[1];


	conv.ask(new SimpleResponse({
		speech: `<speak><p><s>在西元${Year_record}的${input_date}</s><break time="0.25s"/><s>${context}</s></p></speak>`,
		text: response_array[parseInt(Math.random() * 4)] + '，\n以下是' + input_date + '曾發生的其他事件。'
	}));

	conv.ask(new BasicCard({
		title: Year_record + ' ' + input_date,
		subtitle: '距今' + (new Date().getFullYear().toString() - Year_record_output) + '年前',
		text: context,
		//buttons: new Button({title: '維基百科',url:'',display: 'CROPPED',}),
	}));
	conv.ask(new Suggestions('再來一個', day_array[parseInt(Math.random() * 73)] + '呢?', '那' + day_array[parseInt(Math.random() * 73)] + '?', '在' + Randomday() + '發生過甚麼?', '👋 掰掰'));

	conv.user.storage.direct = false;
	conv.user.storage.currentDay = input_date;
});

app.intent('Default Fallback Intent', (conv) => {

	var word1 = day_array[parseInt(Math.random() * 73)];
	var word2 = day_array[parseInt(Math.random() * 73)];
	var word3 = day_array[parseInt(Math.random() * 73)];

	conv.ask(new SimpleResponse({
		speech: `<speak><p><s>抱歉，我不懂你的意思</s><s>請試著問我<break time="0.2s"/>${word1}發生過甚麼事?<break time="0.2s"/>或<break time="0.2s"/>${word2}的歷史事件」</s></p></speak>`,
		text: '你的查詢方式有誤，請再試一次。'
	}));

	conv.ask(new BasicCard({
		title: "語音查詢範例",
		subtitle: "以下是你可以嘗試的指令",
		text: " • *「" + word1 + "發生過甚麼事?」*  \n • *「" + word2 + "的歷史事件」*  \n • *「那" + word3 + "有甚麼事?」*  \n • *「幫我看" + Randomday() + "」*  \n • *「我想看" + day_array[parseInt(Math.random() * 73)] + "」*  \n • *「" + Randomday() + "有甚麼事?」*  \n • *「我要查" + day_array[parseInt(Math.random() * 73)] + "」*",
	}));
	conv.ask(new Suggestions(word1 + '發生過甚麼事?', "" + word2 + "的歷史事件", '那' + word3 + '有甚麼事?', '👋 掰掰'));

});

app.intent('日常安排教學', (conv) => {

	conv.ask(new SimpleResponse({
		speech: `<speak><p><s>透過加入日常安排，你可以快速存取歷史上任意時間所發生的事。</s><s>以下為如何在日常安排中加入今日歷史事件的詳細說明</s></p></speak>`,
		text: '以下為詳細說明。'
	}));

	conv.ask(new BasicCard({
		title: "快速查詢今天的歷史事件",
		subtitle: '1.點擊畫面右上方大頭貼 > 點擊[設定]\n2.切換到[Google助理]分頁 > 點擊[日常安排]\n3.點擊[新增日常安排]\n4.「新增指令(必填)」輸入「歷史事件」\n5.「新增動作」輸入\n「叫每日大事記找今天的歷史」\n6.輸入完成後點擊「儲存」\n7.現在，你可以透過說出或輸入「歷史事件」來快速查詢今天的歷史事件!',
	}));
	conv.ask(new Suggestions(word1 + '發生過甚麼事?', "" + word2 + "的歷史事件", '那' + word3 + '有甚麼事?', '👋 掰掰'));

});

app.intent('建立日常訂閱', (conv) => {
	conv.ask(new RegisterUpdate({
		intent: '快速查詢今日歷史',
		frequency: 'DAILY',
	  }));
});

app.intent('確認日常訂閱成立', (conv, params, registered) => {

	var response_select = response_array[parseInt(Math.random() * (response_array.length))]
	var card_content={
		title:"如何查看每日最新動態",
		text:"離開本服務後，向Google助理說出或輸入以下指令：  \n"+
			"* 查看我的每日最新動態  \n"+
			"* 查看我的訂閱項目  \n"+
			"* 我訂閱了哪些項目？  \n"
	}

	console.log(conv.user.input.text)

	if (registered && registered.status === 'OK') {
		var time_state =conductor.trans_time(conv.user.input.text);
		conv.ask(response_select+'，你現在會在每天的'+time_state[1]+'收到通知了!');
		card_content.title="每天的"+time_state[0]+'你將會收到通知';
		card_content.subtitle="如何查看每日最新動態";
	  } else {
		conv.ask(response_select+'，這項日常訂閱並未成立');
	  }
	conv.ask(new BasicCard(card_content));
	conv.ask(new Suggestions('再來一個', day_array[parseInt(Math.random() * 73)] + '呢?', '那' + day_array[parseInt(Math.random() * 73)] + '?', '在' + Randomday() + '發生過甚麼?', '👋 掰掰'));

});

app.intent('快速查詢今日歷史', (conv) => {
	var input_date = getDay(0);
	var todayarray = daily_history[input_date];//進入資料庫取得對應資訊
	var arraynumber = parseInt(Math.random() * (todayarray.length - 1));
	var random_output = todayarray[arraynumber];
	var Year_record = random_output.split('：')[0];
	var context = random_output.split('：')[1];
	var Year_record_output = replaceString(Year_record, '年', '');;
		Year_record_output = replaceString(Year_record_output, '前');;

	var speech_content={
		speech: `<speak><p><s>在西元${Year_record}的${input_date}</s><break time="0.25s"/><s>${context}</s></p></speak>`,
		text: '這是歷史上在'+input_date+'曾發生的事件'
	}
	
	conv.ask(new SimpleResponse(speech_content));
	conv.close(new BasicCard({
		title: Year_record + ' ' + input_date,
		subtitle: '距今' + (new Date().getFullYear().toString() - Year_record_output) + '年前',
		text: context,
		buttons: new Button({ title: '維基百科條目', url: 'https://zh.wikipedia.org/wiki/'+input_date, }),

	}));

});


app.intent('結束對話', (conv) => {
	conv.user.storage = {}; //離開同時清除暫存資料
	conv.ask('希望能幫到一點忙!');
	conv.ask(new SimpleResponse({ speech: '下次見', text: '下次見 👋', }));
	conv.close(new BasicCard({
		title: '感謝您的使用!',
		text: '如果有任何需要改進的地方，  \n歡迎到簡介頁面評分或給予反饋，謝謝!',
		buttons: new Button({ title: '開啟本程式的商店頁面', url: 'https://assistant.google.com/services/a/uid/000000d67993a1d2', }),
	}));
});

// Set the DialogflowApp object to handle the HTTPS POST request.
exports.today_history = functions.https.onRequest(app);