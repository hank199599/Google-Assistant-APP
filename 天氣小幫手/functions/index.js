'use strict';

// Import the Dialogflow module from the Actions on Google client library.
const {
	dialogflow,
	SimpleResponse, Button, List,
	items, Image, BasicCard, Suggestions
} = require('actions-on-google');

const functions = require('firebase-functions');
const app = dialogflow({ debug: true });

var iconv = require('iconv-lite');
var FetchStream = require("fetch").FetchStream;
const replaceString = require('replace-string');
var getJSON = require('get-json');
var converter = require('./report_convert.json');
var links = require('./link_convert.json');
var county_list = require('./county_list.json');
var reports=require('./fetch.js');

var county_array = ["臺北市", "新北市", "基隆市", "桃園市", "新竹縣", "新竹市", "苗栗縣", "新竹市", "臺中市", "南投縣", "彰化縣", "雲林縣", "嘉義縣", "嘉義市", "臺南市", "高雄市", "屏東縣", "宜蘭縣", "花蓮縣", "臺東縣", "金門縣", "澎湖縣", "連江縣"];
var vacation_array = ["阿里山", "日月潭", "明德水庫", "鯉魚潭水庫", "雪霸國家公園觀霧遊憩區", "參天國家風景區", "大雪山國家森林遊樂區", "台中港", "塔塔加", "奧萬大", "清境農場", "惠蓀林場"];
var word1 = "";
var word2 = "";
var report_context = "";
var output_context = ""; var pre_report = ""; var temp_report = "";
var report_contect = "";
var report_array=[];
var flag=false;
var keyword="";
var i=0;

function reduceSIZE(input) {
	input = replaceString(input, '．', '.');
	input = replaceString(input, '０', '0');
	input = replaceString(input, '１', '1');
	input = replaceString(input, '２', '2');
	input = replaceString(input, '３', '3');
	input = replaceString(input, '４', '4');
	input = replaceString(input, '５', '5');
	input = replaceString(input, '６', '6');
	input = replaceString(input, '７', '7');
	input = replaceString(input, '８', '8');
	input = replaceString(input, '９', '9');
	return input;
}

function ReportTime(input) {

	input = replaceString(input, '-', '/');
	input = replaceString(input, 'T', ' ');
	input = input.split('+')[0];
	return input;
}


function getHour() {
	var today = new Date();
	var nowTime = today.getTime() + 8 * 3600 * 1000;
	today.setTime(parseInt(nowTime));
	var oHour = today.getHours();

	return oHour
}

const SelectContexts = {
	parameter: 'county_select',
}

app.intent('今日天氣概況', (conv) => {

	return new Promise(

		function (resolve, reject) {

			if (conv.user.raw.profile === undefined) {
				var fetch = new FetchStream("https://opendata.cwb.gov.tw/fileapi/opendata/MFC/F-C0032-031.FW50", { disableDecoding: true });

				fetch.on("data", function (chunk) {
					resolve(iconv.decode(chunk, 'BIG5'));
				});
			}
			else { resolve("測試回傳成功") }
		}).then(function (final_data) {

			word1 = county_array[parseInt(Math.random() * 11)]; word2 = county_array[11 + parseInt(Math.random() * 10)];
			var hour_now = getHour();
			
			var report_time = (final_data.split('發布時間：')[1]).split('分')[0] + "分";
			report_time = reduceSIZE(report_time);

			if (report_time.indexOf('6時') !== -1) { var output_time = "今天清晨六點"; }
			else if (report_time.indexOf('11時') !== -1) { var output_time = "今天早上十一點"; }
			else if (report_time.indexOf('19時') !== -1) { var output_time = "今天晚間七點"; }
			else if (report_time.indexOf('23時') !== -1) {
				var output_time = "今天晚上十一點";
				if (hour_now < 11) { output_time = "昨日晚上十一點"; }
			}

			var subtitle = (final_data.split('【')[1]).split('】')[0];
			subtitle=subtitle.replace(/[，\；]/gi, "•");
			subtitle =subtitle.replace(/[。]/gi, "");

			var display_report = replaceString(final_data, '\r\n', '')
			display_report = display_report.split('】。')[1];
			display_report = reduceSIZE(display_report.split('根據環保署')[0]);
			
			report_contect = "";
			report_array=final_data.replace(/\r\n/gi, "").split("。");
			flag=false;
			
			if (display_report.indexOf('明天') === -1) {keyword='今天';}
			else {keyword='明天';}
			
				for(i=0;i<report_array.length;i++){
					if(report_array[i].indexOf(keyword)!==-1){flag=true}
					if(report_array[i].indexOf('根據環保署')!==-1){break;}
					if(flag===true){
						var report=reduceSIZE(report_array[i]);
						report=report.replace(/[' ']/gm,'')
						if(report_array[i].indexOf('日）')!==-1){report_contect=report_contect+'</s><break time="0.5s"/><s>'+report.replace(/（+[\d]+日）/gm,"")}
						else{report_contect=report_contect+'</s><break time="0.5s"/><s>'+report}
					}
				}	
			
			display_report = replaceString(display_report, '。', '。  \n  \n') + "**發布時間** • " + report_time;
			
			//發布時間是晚間11點但已跨至「明天」的內容修正
			if (hour_now < 11 && report_time.indexOf('23時') !== -1){
				display_report=replaceString(display_report, '今天', '昨天')
				display_report=replaceString(display_report, '明天', '今天')
				report_contect=replaceString(report_contect, '明天', '今天')
			}
				
			console.log(report_contect)
			//report_contect=replaceString(report_contect, '　　', '<break time="0.5s"/>')
				
			conv.ask(new SimpleResponse({ speech: `<speak><p><s>以下是中央氣象局，在${output_time}所發布的天氣概況。${report_contect}</s><s>接著，你可以透過詢問查看縣市的天氣</s><s>例如，請試著問我<break time="0.2s"/>${word1}天氣如何?</s></p></speak>`, text: '下面是氣象局的最新消息，\n試著詢問縣市查看區域報告' }));
			if (conv.screen) {
				conv.ask(new BasicCard({
					title: '全台天氣概況',
					subtitle: replaceString(subtitle, '\r\n', ''),
					text: display_report,
					buttons: new Button({ title: "前往中央氣象局看詳細報告", url: "https://www.cwb.gov.tw/V8/C/W/index.html", }),
				}));

				conv.ask(new Suggestions('查看各個區域', '如何加入日常安排', '👋 掰掰'));
				conv.user.storage.direct = false;
				conv.user.storage.station = "全臺";
			}
			else {
				conv.noInputs = ["請試著問我，" + word1 + "天氣如何?", "請試著問我要查詢的縣市", "很抱歉，我幫不上忙"];
			}


		}).catch(function (error) {
			console.log(error)
			word1 = county_array[parseInt(Math.random() * 11)];

			conv.ask(new SimpleResponse({
				speech: `<speak><p><s>糟糕，獲取全台的天氣報告發生一點小狀況。</s><s>但別擔心，你可以試著查詢縣市的天氣資訊</s><s>例如，請試著問我<break time="0.2s"/>${word1}天氣如何?</s></p></speak>`,
				text: '獲取全台預報發生錯誤，\n請試著查詢縣市的天氣。'
			}));
			conv.ask(new BasicCard({
				image: new Image({ url: "https://dummyimage.com/1037x539/ef2121/ffffff.png&text=錯誤", alt: 'Pictures', }),
				title: '數據加載發生問題',
				subtitle: '請過一段時間後再回來查看', display: 'CROPPED',
			}));
			conv.ask(new Suggestions('查看各個區域', '如何加入日常安排', '👋 掰掰'));
			conv.user.storage.direct = false;

		});
});

app.intent('查詢各縣市的天氣概況', (conv) => {

	word1 = county_array[parseInt(Math.random() * 21)];
	word2 = county_array[parseInt(Math.random() * 21)];
	var word3 = vacation_array[parseInt(Math.random() * 11)];
	conv.noInputs = ["請試著問我，" + word1 + "天氣如何?", "請試著問我要查詢的縣市", "很抱歉，我幫不上忙"];

	conv.contexts.set(SelectContexts.parameter, 5);
	conv.ask(new SimpleResponse({
		speech: `<speak><p><s>點選下方選項或詢問我來查看指定縣市今明兩天的天氣報告</s><s>你可以試著問<break time="0.2s"/>${word1}天氣如何?</s></p></speak>`,
		text: '點選下方縣市選項或開口詢問，\n來存取今明兩天的天氣報告!'
	}));

	conv.ask(new List({ items: county_list }));
	conv.ask(new Suggestions(word1 + '天氣如何?', '我想看' + word2, '如何加入日常安排'));
	conv.ask(new Suggestions('查看全台概況', '👋 掰掰'));
	conv.user.storage.direct = false;
	conv.user.storage.station = "全臺";

});

app.intent('縣市選擇結果', (conv, params, option) => {
	return new Promise(

		function (resolve, reject) {

			if (county_array.indexOf(option) !== -1) {

				getJSON('https://opendata.cwb.gov.tw/fileapi/v1/opendataapi/F-C0032-' + converter[option] + '?Authorization=CWB-D48B64A0-8BCB-497F-96E3-BD5EB63CF502&downloadType=WEB&format=JSON')
					.then(function (response) {
						resolve([response.cwbopendata.dataset.parameterSet.parameter, response.cwbopendata.dataset.datasetInfo.issueTime])
					}).catch(function (error) {
						var reason = new Error('資料獲取失敗');
						reject(reason)
					});
			}
			else { reject("無法辨識使用者所要求的查詢") }

		}).then(function (final_data) {

			var reporttime = ReportTime(final_data[1]);
			final_data = final_data[0];
			var subtitle = final_data[0].parameterValue;
			subtitle=subtitle.replace(/[，\；]/gi, "•");
			subtitle =subtitle.replace(/[。\【\】]/gi, "");

			if (subtitle.indexOf(')日') !== -1) { subtitle = subtitle.split(')日')[1]; }
			if (subtitle.indexOf('）日') !== -1) { subtitle = subtitle.split('）日')[1]; }

			var temp=reports.generator(final_data,option,conv.input.raw)
			
			report_context=temp[0];
			output_context=temp[1];

			conv.ask(new SimpleResponse({
				speech: `<speak><p><s>以下是${option}的天氣報告<break time="1s"/>${output_context}</s></p></speak>`,
				text: '下面是「' + option + '」的天氣概況'
			}));

			if (conv.screen) {

				conv.ask(new BasicCard({
					title: option,
					subtitle: subtitle,
					text: report_context + "  \n  \n**發布時間** • " + reporttime,
					buttons: new Button({ title: "前往中央氣象局看詳細報告", url: "https://www.cwb.gov.tw/V8/C/W/County/County.html?CID=" + links[option], }),
				}));
				conv.ask(new Suggestions('如何加入日常安排', '查看各個區域', '👋 掰掰'));
				conv.user.storage.station = option;

				if (conv.user.storage.direct !== false) { conv.expectUserResponse = false }//告知Google助理結束對話

			} else { conv.close(`<speak><p><s>下次有需要時，可以對我說<break time="0.5s"/>叫天氣小幫手查詢${option}的天氣<break time="0.5s"/>下次見</s></p></speak>`); }

		}).catch(function (error) {
			console.log(error)
			word1 = county_array[parseInt(Math.random() * 11)]; word2 = county_array[11 + parseInt(Math.random() * 10)];

			conv.ask(new SimpleResponse({
				speech: `<speak><p><s>抱歉，發生一點小狀況</s><s>請試著問我<break time="0.2s"/>${word1}天氣如何?</s></p></speak>`,
				text: '發生一點小狀況，請再試一次!',
			}));
			conv.ask(new BasicCard({
				title: "語音查詢範例",
				subtitle: "透過對話存取縣市報告",
				text: " • *「" + word1 + "天氣如何?」*  \n • *「幫我查詢" + word2 + "」*  \n • *「我想知道" + county_array[parseInt(Math.random() * 21)] + "怎樣」*  \n • *「幫我找" + county_array[parseInt(Math.random() * 21)] + "」*  \n • *「我想看" + county_array[parseInt(Math.random() * 21)] + "」*  \n • *「" + county_array[parseInt(Math.random() * 21)] + "天氣好嗎?」*  \n • *「我要查" + county_array[parseInt(Math.random() * 21)] + "」*",
			}));
			conv.ask(new Suggestions(word1 + '天氣如何?', '幫我查詢' + word2));
			conv.ask(new Suggestions('查看全台概況', '👋 掰掰'));

			if (conv.user.storage.direct !== false) { conv.expectUserResponse = false }//告知Google助理結束對話

		});
});

app.intent('預設罐頭回覆', (conv) => {
	word1 = county_array[parseInt(Math.random() * 11)]; word2 = county_array[11 + parseInt(Math.random() * 10)];
	conv.noInputs = ["請試著問我，" + word1 + "天氣如何?", "請試著問我要查詢的縣市", "很抱歉，我幫不上忙"];

	if (conv.input.type === "VOICE") { //如果輸入是語音，則顯示錯誤處理方法
		conv.ask(new SimpleResponse({
			speech: `<speak><p><s>抱歉，我不懂你的意思</s><s>請試著問我<break time="0.2s"/>${word1}天氣如何?<break time="0.2s"/>或<break time="0.2s"/>幫我查詢${word2}</s></p></speak>`,
			text: '試著提問來快速存取縣市的天氣報告，\n或點選建議卡片來進行操作!'
		}));
		if (conv.screen) {
			conv.ask(new BasicCard({
				title: "語音查詢範例",
				subtitle: "以下是你可以嘗試的指令",
				text: " • *「" + word1 + "天氣如何?」*  \n • *「幫我查詢" + word2 + "」*  \n • *「我想知道" + county_array[parseInt(Math.random() * 21)] + "怎樣」*  \n • *「幫我找" + county_array[parseInt(Math.random() * 21)] + "」*  \n • *「我想看" + county_array[parseInt(Math.random() * 21)] + "」*  \n • *「" + county_array[parseInt(Math.random() * 21)] + "天氣好嗎?」*  \n • *「我要查" + county_array[parseInt(Math.random() * 21)] + "」*",
			}));
			conv.ask(new Suggestions(word1 + '天氣如何?', '幫我查詢' + word2));
		}
		else {
			conv.ask(`<speak><p><s>或對我說<break time="0.2s"/>區域查詢<break time="0.2s"/>查看縣市的天氣報告</s></p></speak>`);
		}
		conv.noInputs = ["請試著問我，" + word1 + "天氣如何?", "請試著問我要查詢的縣市", "很抱歉，我幫不上忙"];

	} else {
		conv.ask('抱歉，我不懂你的意思，\n請點選建議卡片來進行操作。');
	}
	conv.ask(new Suggestions('查看全台概況', '如何加入日常安排', '👋 掰掰'));

});


app.intent('快速查詢縣市資訊', (conv, { county }) => {

	if (conv.input.raw.indexOf('新北') !== -1) { county = "新北市"; }

	return new Promise(

		function (resolve, reject) {

			if (county_array.indexOf(county) !== -1) {

				getJSON('https://opendata.cwb.gov.tw/fileapi/v1/opendataapi/F-C0032-' + converter[county] + '?Authorization=CWB-D48B64A0-8BCB-497F-96E3-BD5EB63CF502&downloadType=WEB&format=JSON')
					.then(function (response) {
						resolve([response.cwbopendata.dataset.parameterSet.parameter, response.cwbopendata.dataset.datasetInfo.issueTime])
					}).catch(function (error) {
						var reason = new Error('資料獲取失敗');
						reject(reason)
					});
			}
			else if (county === "全臺") {
				var fetch = new FetchStream("https://opendata.cwb.gov.tw/fileapi/opendata/MFC/F-C0032-031.FW50", { disableDecoding: true });

				fetch.on("data", function (chunk) { resolve(iconv.decode(chunk, 'BIG5')); });
			}
			else { reject("無法辨識使用者所要求的查詢") }

		}).then(function (final_data) {

			if (county_array.indexOf(county) !== -1) {

				var reporttime = ReportTime(final_data[1]);
				final_data = final_data[0];
				var subtitle = final_data[0].parameterValue;
					subtitle=subtitle.replace(/[，\；]/gi, "•");
					subtitle =subtitle.replace(/[。\【\】]/gi, "");
					
				if (subtitle.indexOf(')日') !== -1) { subtitle = subtitle.split(')日')[1]; }
				if (subtitle.indexOf('）日') !== -1) { subtitle = subtitle.split('）日')[1]; }

				var temp=reports.generator(final_data,county,conv.input.raw)
				
				report_context=temp[0];
				output_context=temp[1];

				conv.ask(new SimpleResponse({
					speech: `<speak><p><s>以下是${county}的天氣報告<break time="1s"/>${output_context}</s></p></speak>`,
					text: '下面是「' + county + '」的天氣概況'
				}));

				if (conv.screen) {

					conv.ask(new BasicCard({
						title: county,
						subtitle: subtitle,
						text: report_context + "  \n  \n**發布時間** • " + reporttime,
						buttons: new Button({ title: "前往中央氣象局看詳細報告", url: "https://www.cwb.gov.tw/V8/C/W/County/County.html?CID=" + links[county], }),
					}));
					conv.ask(new Suggestions('如何加入日常安排', '查看各個區域', '👋 掰掰'));
					conv.user.storage.station = county;

					if (conv.user.storage.direct !== false) { conv.expectUserResponse = false }//告知Google助理結束對話

				} else { conv.expectUserResponse = false }

			}
			else {
				var report_time = (final_data.split('發布時間：')[1]).split('分')[0] + "分";
				var hour_now = getHour();
				
				report_time = reduceSIZE(report_time);

				if (report_time.indexOf('6時') !== -1) { var output_time = "今天清晨六點"; }
				else if (report_time.indexOf('11時') !== -1) { var output_time = "今天早上十一點"; }
				else if (report_time.indexOf('19時') !== -1) { var output_time = "今天晚間七點"; }
				else if (report_time.indexOf('23時') !== -1) {
					var output_time = "今天晚上十一點";
					if (hour_now < 11) { output_time = "昨日晚上十一點" }
				}

				if (final_data.indexOf('明天') === -1) { var report_contect = "今天" + ((final_data.split('今天')[1]).split('根據環保署')[0]).split('日）')[1]; }
				else { var report_contect = "明天" + ((final_data.split('明天')[1]).split('根據環保署')[0]).split('日）')[1]; }

				var subtitle = (final_data.split('【')[1]).split('】')[0];
					subtitle=subtitle.replace(/[，\；]/gi, "•");
					subtitle =subtitle.replace(/[。]/gi, "");

				var display_report = replaceString(final_data, '\r\n', '')
				display_report = display_report.split('】。')[1];
				display_report = reduceSIZE(display_report.split('根據環保署')[0]);

				report_contect = "";
				report_array=final_data.replace(/\r\n/gi, "").split("。");
				flag=false;
				
				if (display_report.indexOf('明天') === -1) {keyword='今天';}
				else {keyword='明天';}
				
					for(i=0;i<report_array.length;i++){
						if(report_array[i].indexOf(keyword)!==-1){flag=true}
						if(report_array[i].indexOf('根據環保署')!==-1){break;}
						if(flag===true){
							var report=reduceSIZE(report_array[i]);
						report=report.replace(/[' ']/gm,'')
						if(report_array[i].indexOf('日）')!==-1){report_contect=report_contect+'</s><break time="0.5s"/><s>'+report.replace(/（+[\d]+日）/gm,"")}
						else{report_contect=report_contect+'</s><break time="0.5s"/><s>'+report}
						}
					}	
				
				display_report = replaceString(display_report, '。', '。  \n  \n') + "**發布時間** • " + report_time;
				
				//發布時間是晚間11點但已跨至「明天」的內容修正
				if (hour_now < 11 && report_time.indexOf('23時') !== -1){
					display_report=replaceString(display_report, '今天', '昨天')
					display_report=replaceString(display_report, '明天', '今天')
					report_contect=replaceString(report_contect, '明天', '今天')
				}
								
				conv.ask(new SimpleResponse({ speech: `<speak><p><s>以下是中央氣象局，在${output_time}所發布的天氣概況。<break time="0.5s"/>${report_contect}</s></p></speak>`, text: '下面是來自氣象局的最新消息' }));

				if (conv.screen) {

					conv.ask(new BasicCard({
						title: '全台天氣概況',
						subtitle: replaceString(subtitle, '\r\n', ''),
						text: display_report,
						buttons: new Button({ title: "前往中央氣象局看詳細報告", url: "https://www.cwb.gov.tw/V8/C/W/index.html", }),
					}));
					conv.ask(new Suggestions('查看各個區域', '👋 掰掰'));

					if (conv.user.storage.direct !== false) { conv.expectUserResponse = false }//告知Google助理結束對話

				} else { conv.expectUserResponse = false }
			}
		}).catch(function (error) {
			console.log(error)
			word1 = county_array[parseInt(Math.random() * 11)]; word2 = county_array[11 + parseInt(Math.random() * 10)];

			conv.ask(new SimpleResponse({
				speech: `<speak><p><s>抱歉，發生一點小狀況</s><s>請試著問我<break time="0.2s"/>${word1}天氣如何?</s></p></speak>`,
				text: '發生一點小狀況，請再試一次!',
			}));
			conv.ask(new BasicCard({
				title: "語音查詢範例",
				subtitle: "透過對話存取縣市報告",
				text: " • *「" + word1 + "天氣如何?」*  \n • *「幫我查詢" + word2 + "」*  \n • *「我想知道" + county_array[parseInt(Math.random() * 21)] + "怎樣」*  \n • *「幫我找" + county_array[parseInt(Math.random() * 21)] + "」*  \n • *「我想看" + county_array[parseInt(Math.random() * 21)] + "」*  \n • *「" + county_array[parseInt(Math.random() * 21)] + "天氣好嗎?」*  \n • *「我要查" + county_array[parseInt(Math.random() * 21)] + "」*",
			}));
			conv.ask(new Suggestions(word1 + '天氣如何?', '幫我查詢' + word2));
			conv.ask(new Suggestions('查看全台概況', '👋 掰掰'));

			if (conv.user.storage.direct !== false) { conv.expectUserResponse = false }//告知Google助理結束對話

		});
});


app.intent('加入日常安排', (conv) => {

	var choose_station = conv.user.storage.station;

	conv.ask(new SimpleResponse({
		speech: `<speak><p><s>透過加入日常安排，你可以快速存取所需縣市之預報資訊。</s><s>舉例來說，如果你把${choose_station}加入日常安排。你即可隨時呼叫我查詢該縣市的最新天氣報告!</s><s>以下為詳細說明</s></p></speak>`,
		text: '以下為詳細說明，請查照'
	}));

	conv.ask(new BasicCard({
		title: '將「' + choose_station + '的天氣報告加入日常安排', display: 'CROPPED',
		subtitle: '1.點擊畫面右上方大頭貼 > 點擊[設定]\n2.切換到[Google助理]分頁 > 點擊[日常安排]\n3.點擊[新增日常安排]\n4.「新增指令(必填)」輸入「天氣報告」\n5.「新增動作」輸入\n「叫天氣小精靈查詢' + choose_station + '」\n6.輸入完成後點擊「儲存」\n7.現在，你可以透過說出或輸入「天氣報告」來快速查詢' + choose_station + '的天氣報告!',
	}));

	conv.ask(new Suggestions('查看' + choose_station + '的天氣概況'));
	conv.ask(new Suggestions('查看全台概況', '👋 掰掰'));

});

app.intent('結束對話', (conv) => {
	conv.user.storage = {}; //離開同時清除暫存資料
	conv.ask('希望能幫上一點忙!');
	conv.ask(new SimpleResponse({ speech: '下次見', text: '下次見 👋', }));
	conv.close(new BasicCard({
		title: '感謝您的使用!',
		text: '如果有任何需要改進的地方，  \n歡迎到簡介頁面評分或給予反饋，謝謝!',
		buttons: new Button({ title: '開啟本程式的商店頁面', url: 'https://assistant.google.com/services/a/uid/000000971a4ed57e', }),
	}));
});


// Set the DialogflowApp object to handle the HTTPS POST request.
exports.tw_weather_helper = functions.https.onRequest(app);
