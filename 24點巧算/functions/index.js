'use strict';
// Import the Dialogflow module from the Actions on Google client library.
const { dialogflow, Suggestions, SimpleResponse, Button, Image, BasicCard, Table, List } = require('actions-on-google');

var admin = require('firebase-admin');
const { WebhookClient } = require('dialogflow-fulfillment');
const functions = require('firebase-functions');
const replaceString = require('replace-string');

var judger = require('./fetch.js');
var formula = require('./formula_generator.js');
var levels = require('./level_list.json');
var target = require('./target.json');
var translator = require('./chinese_translator.json');
var wiki = require('./wiki_explain.json');
const Contexts=require('./contexts.json')

//題目字典
var level1= require('./combination/12.json');
var level2= require('./combination/24.json');
var level3= require('./combination/25.json');
var level4= require('./combination/36.json');
var level5= require('./combination/48.json');

const app = dialogflow({ debug: true });
var interval = 0;
var question = [];

function randon(input) {
	return parseInt(Math.random() * input + 1)
}

//進行四捨五入的函式呼叫
function roundDecimal(val, precision) {
	return Math.round(Math.round(val * Math.pow(10, (precision || 0) + 1)) / 10) / Math.pow(10, (precision || 0));
};

var options = ['＋', '－', '×', '／'];
var hint_list = ["接下來呢?", "下一個是?", "再來一個", "接著要填甚麼?", "然後?"];
var wrong_list = ["很抱歉，我不太清楚你的意思", "我剛剛恍神了，再說一次好嗎?", "麻煩你再說一次", "不好意思，我不太明白", "不好意思，可以重複一下剛剛說的話嗎?"];


app.intent('預設歡迎畫面', (conv) => {

	if (!conv.user.last.seen) {
		conv.ask(new SimpleResponse({
			speech: `<speak><p><s>歡迎遊玩巧算24點!</s><s>請先選擇要遊玩的難度!<break time="0.2s"/>我會隨機給你一組固定順序的數字，請試著運用加、減、乘、除生出24</s></p></speak>`,
			text: '歡迎遊玩\n我會隨機給你一組數字，\n請試著運用加減乘除生出指定數字!'
		}));
	}
	else {
		conv.ask(new SimpleResponse({
			speech: `<speak><p><s>歡迎回來!</s><s>請先選擇要遊玩的難度!</s></p></speak>`,
			text: '歡迎回來!'
		}));
	}

	conv.ask(new List({ 
		title:"請選擇遊玩模式",
		items: levels }));

	conv.ask(new Suggestions('遊戲說明', '👋 掰掰'));

	conv.contexts.set(Contexts.Main, 1);
	conv.contexts.set(Contexts.EXP, 1);
	conv.contexts.set(Contexts.Bye, 1);
});

app.intent('選擇難度', (conv) => {

	conv.ask(new SimpleResponse({
		speech: `<speak><p><s>好的</s><s>請選擇遊玩模式!</s></p></speak>`,
		text: '好的，請選擇!'
	}));

	conv.ask(new List({ 
		title:"請選擇遊玩模式",
		items: levels }));

	conv.ask(new Suggestions('遊戲說明', '👋 掰掰'));

	conv.contexts.set(Contexts.Main, 1);
	conv.contexts.set(Contexts.EXP, 1);
	conv.contexts.set(Contexts.Bye, 1);

});

app.intent('選擇難度完成', (conv, params, option) => {

	interval = target[option];

	if(option==="入門"){question=level1;}
	else if(option==="經典"){question=level2;}
	else if(option==="高階"){question=level3;}
	else if(option==="專家"){question=level4;}
	else if(option==="精通"){question=level5;}

	var speration=question[parseInt(Math.random() * (Object.keys(question).length))];
	var count=judger.tryfix(speration[0],speration[1],speration[2],speration[3],target[option])
	
	var combintion=speration.toString();
	var title = replaceString(combintion, ",", "☐");

	conv.ask(new SimpleResponse({

		speech: `<speak><p><audio src="https://firebasestorage.googleapis.com/v0/b/hank199599.appspot.com/o/undecided-numbers.mp3?alt=media"/><s>我想好啦!</s><s>我挑選的數字是${speration}，試著挑戰看看吧!</s></p></speak>`,
		text: '我已經想好啦!'
	}));

	conv.ask(new BasicCard({
		title: title,
		subtitle: "請試著運用加減乘除得到「"+target[option]+"」",
		text: option + " • 共" + count + "種解法",
	}));
	conv.ask(new Suggestions(options));
	conv.ask(new Suggestions("重新開始"));

	conv.user.storage.count = count;
	conv.user.storage.combintion = speration;
	conv.contexts.set(Contexts.Restart, 1);
	conv.contexts.set(Contexts.Play, 1);

	
	conv.user.storage.operator_list = [];
	conv.user.storage.level = option;
});

app.intent('輸入數字', (conv, { operator }) => {

	var operator_list = conv.user.storage.operator_list;
	
	if (operator_list.length < 3) {
		
		conv.contexts.set(Contexts.Play, 1);

		if (options.indexOf(operator) !== -1) {
			operator_list.push(operator);
			conv.user.storage.operator_list = operator_list;

			if (operator_list.length === 3) {
				var temp = conv.user.storage.combintion;
				conv.contexts.set(Contexts.Option, 1);

				conv.ask(new SimpleResponse({
					speech: `<speak><p><s>你在第${operator_list.length}個位置選擇${translator[operator]}法</s><s>現在，你已經填完運算元了</s></p></speak>`,
					text: "你在第" + operator_list.length + "個位置選擇「" + translator[operator] + "法」\n現在，你已經填完運算元了!"
				}));

				if (operator_list.indexOf("×") !== -1 || operator_list.indexOf("／") !== -1) {

					conv.ask(new SimpleResponse({
						speech: `<speak><p><s>"我推斷你的答案有幾種可能，請你選擇心中預想的答案形式</s></p></speak>`,
						text: "我推斷你的答案有以下可能，請選擇!"
					}));

					conv.ask(new List({
						title: "「"+formula.generator(conv.user.storage.combintion, operator_list)+"」\n有這幾種組合，請選擇",
						items: {
							"一": {
								"synonyms": ["一"],
								"title": "((" + temp[0] + operator_list[0] + temp[1] + ")" + operator_list[1] + temp[2] + ")" + operator_list[2] + temp[3],
								"description": "第一個選項"
							},
							"二": {
								"synonyms": ["二"],
								"title": "(" + temp[0] + operator_list[0] + temp[1] + ")" + operator_list[1] + "(" + temp[2] + operator_list[2] + temp[3] + ")",
								"description": "第二個選項"
							},
							"三": {
								"synonyms": ["三"],
								"title": temp[0] + operator_list[0] + "(" + temp[1] + operator_list[1] + "(" + temp[2] + operator_list[2] + temp[3] + "))",
								"description": "第三個選項"
							},
							"四": {
								"synonyms": ["四"],
								"title": temp[0] + operator_list[0] + "(" + temp[1] + operator_list[1] + temp[2] + ")" + operator_list[2] + temp[3],
								"description": "第四個選項"
							},
						}
					}));

					conv.ask(new Suggestions("重新填寫"));
					conv.contexts.set(Contexts.ReAns, 1);
				}
				else {

					conv.ask(new SimpleResponse({
						speech: `<speak><p><s>請問，你確定這是最終答案了嗎?</s></p></speak>`,
						text: "你確定這是最終答案了嗎?"
					}));

					conv.ask(new BasicCard({
						title: formula.generator(conv.user.storage.combintion, operator_list),
						subtitle: "你確定這是最終答案了嗎?",
						text: conv.user.storage.level + " • " + conv.user.storage.count + "種解法",
					}));

					conv.ask(new Suggestions("確定", "不太確定"));
					conv.contexts.set(Contexts.ReAns, 1);
				}
			}
			else {

				var hint = hint_list[parseInt(Math.random() * (hint_list.length))];

				conv.ask(new SimpleResponse({
					speech: `<speak><p><s>你在第${operator_list.length}個位置選擇${translator[operator]}法，${hint}</s></p></speak>`,
					text: "你在第" + operator_list.length + "個位置選擇「" + translator[operator] + "法」\n" + hint
				}));

				conv.ask(new BasicCard({
					title: formula.generator(conv.user.storage.combintion, operator_list),
					subtitle: "請試著運用加減乘除得到「"+target[conv.user.storage.level]+"」",
					text: conv.user.storage.level + " • " + conv.user.storage.count + "種解法",
				}));
				conv.ask(new Suggestions(options));
				conv.ask(new Suggestions("顯示答案", "重新作答"));
				conv.contexts.set(Contexts.ReAns, 1);

			}

		}
		else {

			var temp=wrong_list[parseInt(Math.random() * (wrong_list.length))];

			conv.ask(new SimpleResponse({
				speech: `<speak><p><s>${temp}</s><s>或透過建議卡片輸入你的選擇</s></p></speak>`,
				text: temp
			}));

			conv.ask(new BasicCard({
				title: formula.generator(conv.user.storage.combintion, operator_list),
				subtitle: "請試著運用加減乘除得到「"+target[conv.user.storage.level]+"」",
				text: conv.user.storage.level + " • " + conv.user.storage.count + "種解法",
			}));

			conv.ask(new Suggestions(options));
			conv.ask(new Suggestions("顯示答案"));

			if(operator_list.length===0){
				conv.ask(new Suggestions("重新開始"));
				conv.contexts.set(Contexts.Restart, 1);
			}
			else{
				conv.ask(new Suggestions("重新填寫"));
				conv.contexts.set(Contexts.ReAns, 1);
			}
		}
	}
	else {

		var temp = conv.user.storage.combintion;
		var user_formula = temp[0] + operator_list[0] + temp[1] + operator_list[1] + temp[2] + operator_list[2] + temp[3];

		var tempformula = replaceString(user_formula, "＋", "+");
		tempformula = replaceString(tempformula, "－", "-");
		tempformula = replaceString(tempformula, "×", "*");
		tempformula = replaceString(tempformula, "／", "/");

		var final_answer = eval(tempformula)
		final_answer = roundDecimal(final_answer, 1);

		//公布組合是否正確
		conv.ask(new SimpleResponse({
			speech: `<speak><audio src="https://firebasestorage.googleapis.com/v0/b/hank199599.appspot.com/o/%E8%A8%88%E7%AE%97%E9%9F%B3%E6%A0%A1.mp3?alt=media"/>你的答案是<break time="0.2s"/>${final_answer}</speak>`,
			text: '我來算看看你給的算式...'
		}));

		var output_form = {
			title: user_formula + " = " + final_answer.toString(),
			text: conv.user.storage.level + " • " + conv.user.storage.count + "種解法",
		//	buttons: new Button({ title: "查看隨機排列時的解法", url: "http://24solver.us-west-2.elasticbeanstalk.com/?n1=" + conv.user.storage.combintion[0] + "&n2=" + conv.user.storage.combintion[1] + "&n3=" + conv.user.storage.combintion[2] + "&n4=" + conv.user.storage.combintion[3], })
		}

		if (final_answer === target[conv.user.storage.level]) {
			conv.ask(new SimpleResponse({ speech: `<speak><p><s>恭喜你答對啦!</s></p></speak>`, text: '恭喜你答對啦 👏' }));
			output_form.subtitle = "這是正確答案";
		}
		else {
			conv.ask(new SimpleResponse({ speech: `<speak><p><s>與我要求的最終答案${target[conv.user.storage.level]}相差甚遠呦，再接再厲!</s></p></speak>`, text: '再接再厲 🥊' }));
			var speration = conv.user.storage.combintion;
			output_form.subtitle = "答錯啦，再接再厲!  \n參考解答：" + judger.example(speration[0], speration[1], speration[2], speration[3],target[conv.user.storage.level])+"="+target[conv.user.storage.level];
		}

		conv.ask(new BasicCard(output_form));
		conv.ask(new Suggestions("再試一次", "選擇難度", '👋 掰掰'));

		conv.contexts.set(Contexts.LEVEL, 1);
		conv.contexts.set(Contexts.Restart, 1);
		conv.contexts.set(Contexts.Bye, 1);

	}
});

app.intent('選擇不同的答案格式', (conv, params, option) => {

	var operator_list = conv.user.storage.operator_list;
	var temp = conv.user.storage.combintion;

	if (["一", "二", "三", "四"].indexOf(option) !== -1) {

		if (option === "一") { var user_formula = "((" + temp[0] + operator_list[0] + temp[1] + ")" + operator_list[1] + temp[2] + ")" + operator_list[2] + temp[3] }
		else if (option === "二") { var user_formula = "(" + temp[0] + operator_list[0] + temp[1] + ")" + operator_list[1] + "(" + temp[2] + operator_list[2] + temp[3] + ")" }
		else if (option === "三") { var user_formula = temp[0] + operator_list[0] + "(" + temp[1] + operator_list[1] + "(" + temp[2] + operator_list[2] + temp[3] + "))" }
		else if (option === "四") { var user_formula = temp[0] + operator_list[0] + "(" + temp[1] + operator_list[1] + temp[2] + ")" + operator_list[2] + temp[3] }

		var tempformula = replaceString(user_formula, "＋", "+");
		tempformula = replaceString(tempformula, "－", "-");
		tempformula = replaceString(tempformula, "×", "*");
		tempformula = replaceString(tempformula, "／", "/");

		var final_answer = eval(tempformula)
		final_answer = roundDecimal(final_answer, 1);

		//公布組合是否正確
		conv.ask(new SimpleResponse({
			speech: `<speak><audio src="https://firebasestorage.googleapis.com/v0/b/hank199599.appspot.com/o/%E8%A8%88%E7%AE%97%E9%9F%B3%E6%A0%A1.mp3?alt=media"/>你的答案是<break time="0.2s"/>${final_answer}</speak>`,
			text: '我來算看看你給的算式...'
		}));

		var output_form = {
			title: user_formula + " = " + final_answer.toString(),
			text: conv.user.storage.level + " • " + conv.user.storage.count + "種解法",
		//	buttons: new Button({ title: "查看隨機排列時的解法", url: "http://24solver.us-west-2.elasticbeanstalk.com/?n1=" + conv.user.storage.combintion[0] + "&n2=" + conv.user.storage.combintion[1] + "&n3=" + conv.user.storage.combintion[2] + "&n4=" + conv.user.storage.combintion[3], })
		}

		if (final_answer === target[conv.user.storage.level]) {
			conv.ask(new SimpleResponse({ speech: `<speak><p><s>恭喜你答對啦!</s></p></speak>`, text: '恭喜你答對啦 👏' }));
			output_form.subtitle = "這是正確答案";
		}
		else {
			conv.ask(new SimpleResponse({ speech: `<speak><p><s>與我要求的最終答案${target[conv.user.storage.level]}相差甚遠呦，再接再厲!</s></p></speak>`, text: '再接再厲 🥊' }));
			var speration = conv.user.storage.combintion;
			output_form.subtitle = "答錯啦，再接再厲!  \n參考解答：" + judger.example(speration[0], speration[1], speration[2], speration[3],target[conv.user.storage.level])+"="+target[conv.user.storage.level];
		}

		conv.ask(new BasicCard(output_form));

		conv.ask(new Suggestions("再試一次", "選擇難度", '👋 掰掰'));

		conv.contexts.set(Contexts.LEVEL, 1);
		conv.contexts.set(Contexts.Restart, 1);
		conv.contexts.set(Contexts.Bye, 1);

	}
	else {
		conv.contexts.set(Contexts.Option, 1);

		conv.ask(new SimpleResponse({
			speech: `<speak><p><s>你的答案有以下幾種組合方式，請你所設想的答案</s></p></speak>`,
			text: "我推斷你的答案有以下可能，請選擇!"
		}));

		conv.ask(new List({
			title: "「"+formula.generator(conv.user.storage.combintion, operator_list)+"」\n有這幾種組合，請選擇",
			items: {
				"一": {
					"synonyms": ["一"],
					"title": "((" + temp[0] + operator_list[0] + temp[1] + ")" + operator_list[1] + temp[2] + ")" + operator_list[2] + temp[3],
					"description": "第一個選項"
				},
				"二": {
					"synonyms": ["二"],
					"title": "(" + temp[0] + operator_list[0] + temp[1] + ")" + operator_list[1] + "(" + temp[2] + operator_list[2] + temp[3] + ")",
					"description": "第二個選項"
				},
				"三": {
					"synonyms": ["三"],
					"title": temp[0] + operator_list[0] + "(" + temp[1] + operator_list[1] + "(" + temp[2] + operator_list[2] + temp[3] + "))",
					"description": "第三個選項"
				},
				"四": {
					"synonyms": ["四"],
					"title": temp[0] + operator_list[0] + "(" + temp[1] + operator_list[1] + temp[2] + ")" + operator_list[2] + temp[3],
					"description": "第四個選項"
				}
			}
		}));
	}
});

app.intent('顯示答案', (conv) => {

	var question=conv.user.storage.combintion;
	var combintion = question.toString();
	var title = replaceString(combintion, ",", "☐");

	var speration = conv.user.storage.combintion;
	var subtitle = judger.example(speration[0], speration[1], speration[2], speration[3],target[conv.user.storage.level]);

	conv.ask(new SimpleResponse({
		speech: `<speak><p><s>沒問題，以下是這個數字組合的其中一種解法</s><s>想再挑戰看看嗎?</s></p></speak>`,
		text: '沒問題，\n以下是這個數字組合可能的算式'
	}));

	conv.ask(new BasicCard({
		title: title,
		subtitle: subtitle+"="+target[conv.user.storage.level],
		text: conv.user.storage.level + " • " + conv.user.storage.count + "種解法",
	//	buttons: new Button({ title: "查看隨機排列時的解法", url: "http://24solver.us-west-2.elasticbeanstalk.com/?n1=" + question[0] + "&n2=" + question[1] + "&n3=" + question[2] + "&n4=" + question[3], })
	}));

	conv.ask(new Suggestions("再試一次", "選擇難度", '👋 掰掰'));

	conv.contexts.set(Contexts.LEVEL, 1);
	conv.contexts.set(Contexts.Restart, 1);
	conv.contexts.set(Contexts.Bye, 1);

});

app.intent('重新開始', (conv) => {

	var option=conv.user.storage.level;

	if(option==="入門"){question=level1;}
	else if(option==="經典"){question=level2;}
	else if(option==="高階"){question=level3;}
	else if(option==="專家"){question=level4;}
	else if(option==="精通"){question=level5;}

	var speration=question[parseInt(Math.random() * (Object.keys(question).length))];
	var count=judger.tryfix(speration[0],speration[1],speration[2],speration[3],target[conv.user.storage.level])
	
	var combintion=speration.toString();
	var title = replaceString(combintion, ",", "☐");
	
	conv.ask(new SimpleResponse({
		speech: `<speak><p><s>沒問題，我來想看看題目!</s></p></speak>`,
		text: '沒問題，給我一點時間想題目!'
	}));

	conv.ask(new SimpleResponse({
		speech: `<speak><p><audio src="https://firebasestorage.googleapis.com/v0/b/hank199599.appspot.com/o/undecided-numbers.mp3?alt=media"/><s>我想好啦!</s><s>我挑選的數字是${speration}，試著挑戰看看吧!</s></p></speak>`,
		text: '我已經想好啦!'
	}));

	conv.ask(new BasicCard({
		title: title,
		subtitle: "請試著運用加減乘除得到「"+target[conv.user.storage.level]+"」",
		text: conv.user.storage.level + " • " + count + "種解法",
	}));

	conv.ask(new Suggestions(options));
	conv.ask(new Suggestions("重新開始"));

	conv.user.storage.count = count;
	conv.contexts.set(Contexts.Restart, 1);
	conv.contexts.set(Contexts.Play, 1);
	
	conv.user.storage.combintion = speration;
	conv.user.storage.operator_list = [];

});

app.intent('重新輸入答案', (conv) => {

	var operator_list=conv.user.storage.operator_list;

	if(operator_list.length===0){operator_list=[0]}

	conv.ask(new SimpleResponse({

		speech: `<speak><p><s>好的，我知道了!</s><s>請重新填寫第${operator_list.length}個位置的運算元</s></p></speak>`,
		text: '好的，我們重新填寫第'+operator_list.length+'個位置的運算元'
	}));

	operator_list.length=operator_list.length-1;

	conv.ask(new BasicCard({
		title: formula.generator(conv.user.storage.combintion, operator_list),
		subtitle: "請試著運用加減乘除得到「"+target[conv.user.storage.level]+"」",
		text: conv.user.storage.level + " • " + conv.user.storage.count + "種解法",
	}));
	conv.ask(new Suggestions(options));
	conv.ask(new Suggestions("重新作答"));
	conv.contexts.set(Contexts.ReAns, 1);
	conv.contexts.set(Contexts.Play, 1);
	conv.user.storage.operator_list = operator_list;
});

app.intent('遊戲說明', (conv) => {

	conv.ask(new SimpleResponse({ speech: `<speak><p><s>遊戲開始時，會產生一組固定順序的四個數字，其中</s><s>每個數字範圍是1到13</s><s>且數字間彼此可以重複</s><s>統計而言，組合高達28561種</s><s>而你要做的，即利用指定順序的數字進行加減乘除，得到指定的答案!</s></p></speak>`, text: "以下是遊戲說明，請查看!", }));

	wiki.buttons = new Button({ title: '在維基百科上查看條目', url: 'https://zh.wikipedia.org/wiki/24%E7%82%B9', });

	conv.ask(new BasicCard(wiki));

	conv.ask(new Suggestions("選擇難度", "👋 掰掰"));

	conv.contexts.set(Contexts.LEVEL, 1);
	conv.contexts.set(Contexts.Bye, 1);

});


app.intent('預設罐頭回覆', (conv) => {

	var temp=wrong_list[parseInt(Math.random() * (wrong_list.length))];
	
	conv.ask(new SimpleResponse({ speech: `<speak><p><s>${temp}</s><s></s></p></speak>`, text: temp, }));

	conv.ask(new Suggestions("選擇難度", "👋 掰掰"));

	conv.contexts.set(Contexts.LEVEL, 1);
	conv.contexts.set(Contexts.Bye, 1);

});

app.intent('結束對話', (conv) => {
	conv.user.storage = {}; //離開同時清除暫存資料
	conv.ask('希望你玩得愉快!');
	conv.ask(new SimpleResponse({ speech: '下次見', text: '下次見 👋', }));
	conv.close(new BasicCard({
		title: '感謝您的使用!',
		text: '如果有任何需要改進的地方，  \n歡迎到簡介頁面評分或給予反饋，謝謝!',
		buttons: new Button({ title: '開啟本程式的商店頁面', url: 'https://assistant.google.com/services/a/uid/000000c29cce8146', }),
	}));
});

exports.twentyfourpoint_game = functions.https.onRequest(app);