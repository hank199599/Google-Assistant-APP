'use strict';

// Import the Dialogflow module from the Actions on Google client library.
const {
	dialogflow, Suggestions, SimpleResponse, Button,
	Image, BasicCard, Carousel, items, Table
} = require('actions-on-google');

// Import the firebase-functions package for deployment.
const functions = require('firebase-functions');

// Instantiate the Dialogflow client.
const app = dialogflow({ debug: true });
var ReceiptLottery = require('./fecher.js');
var interval = require("./price_get_interval.json");
var admin = require("firebase-admin");

var title = ''//發票開獎區間
var index = '';
var super_prize = '';//特別獎  
var super_prize_last3 = '';
var special = '';//特獎
var special_last3 = '';
var first_1 = '';//頭獎-1
var first_1_last3 = '';
var first_2 = '';//頭獎-2
var first_2_last3 = '';
var first_3 = '';//頭獎-3
var first_3_last3 = '';
var addition_1 = '';//增開六獎-1
var addition_2 = '';//增開六獎-2
var temperate = "";
var price_type = ''; var max_price = '';
var nzhhk = require("nzh/hk"); //引入繁体中文數字轉換器
const replaceString = require('replace-string');
var answer_input = false;
var compare = "";
var subtitle = "";


function substring(input) {
	var temp = input.split('');
	return temp[5] + temp[6] + temp[7];
}

function random() {

	var temp = String(parseInt(Math.random() * (1000)));
	if (temp.length === 1) { temp = "00" + temp; }
	else if (temp.length === 2) { temp = "0" + temp; }

	return temp
}

function intervalGET(input) {

	if (input.indexOf("01") !== -1) { return interval[1]; }
	else if (input.indexOf("03") !== -1) { return interval[3]; }
	else if (input.indexOf("05") !== -1) { return interval[5]; }
	else if (input.indexOf("07") !== -1) { return interval[7]; }
	else if (input.indexOf("09") !== -1) { return interval[9]; }
	else if (input.indexOf("11") !== -1) { return interval[11]; }
}


function getDay(input, num) {
	var today = new Date(input);
	var nowTime = today.getTime() + 8 * 3600 * 1000;
	var ms = 24 * 3600 * 1000 * num;
	today.setTime(parseInt(nowTime + ms));
	var oWeek = parseInt(today.getDay());
	if (oWeek === 0) { ms = 24 * 3600 * 1000 * (num + 1); }
	else if (oWeek === 6) { ms = 24 * 3600 * 1000 * (num - 1); }

	today.setTime(parseInt(nowTime + ms));

	var oMoth = (today.getMonth() + 1).toString();
	if (oMoth.length <= 1) oMoth = '0' + oMoth;
	var oDay = today.getDate().toString();
	if (oDay.length <= 1) oDay = '0' + oDay;
	return oMoth + "/" + oDay + "," + oWeek;
}

const SelectContexts = {
	parameter: 'start_redemption',
}

app.intent('開始畫面', (conv) => {

	return new Promise(function (resolve, reject) {
		
		if(conv.user.name.given===undefined){
			
		ReceiptLottery.query(function (err, info) {
			if (err) {
				reject(err.stack);
			}
			resolve(info);
		});
		}
		else{
			resolve("Google測試我是否還活著");
		}

	}).then(function (origin_data) {

		if (conv.screen) {

			conv.ask(new SimpleResponse({
				speech: `<speak><p><s>歡迎使用!</s><s>你可以查看近兩期的發票號碼，或是請我幫你快速對獎</s></p></speak>`,
				text: '歡迎!\n你可以查看近兩期的發票號碼，\n或是請我幫你快速對獎',
			}));
			conv.ask(new Carousel({
				items: {
					'本期': {
						synonyms: ['最近的', '這期', '新的'],
						title: '本期',
						description: origin_data.new.title,
					},
					'上一期': {
						synonyms: ['上一個', '上期', '舊的'],
						title: '上一期',
						description: origin_data.old.title,
					}
				},
			}));
			conv.ask(new Suggestions('我們開始對獎吧!', '👋 掰掰'));
		} else {

			conv.ask(`<speak><p><s>歡迎使用發票對講機!</s><s>在這裡，我提供最近一期的快速對獎服務</s><s>即${origin_data.new.title}的發票</s><s>現在，請輸入發票後三碼開始比對吧!</s></p></speak>`);
			conv.noInputs = ["你可以開始對獎了呦，請輸入" + origin_data.new.title + "的發票後三碼", "請輸入發票的後三碼", "抱歉，我想我幫不上忙..."];
			conv.contexts.set(SelectContexts.parameter, 1);

		}

		conv.user.storage.new = origin_data.new;
		conv.user.storage.old = origin_data.old;

		origin_data = origin_data.new;


		if (super_prize.indexOf('同期') !== -1) { super_prize = super_prize.split('同期')[0]; }

		conv.user.storage.index = origin_data.title;
		conv.user.storage.super_prize = origin_data.super.numbers[0];
		conv.user.storage.special = origin_data.special.numbers[0];
		conv.user.storage.first_1 = origin_data.first.numbers[0];
		conv.user.storage.first_2 = origin_data.first.numbers[1];
		conv.user.storage.first_3 = origin_data.first.numbers[2];
		conv.user.storage.addition_1 = origin_data.addition.numbers[0];

		if (origin_data.addition.numbers.length > 1) { conv.user.storage.addition_2 = origin_data.addition.numbers[1]; }
		else { conv.user.storage.addition_2 = ""; }

		conv.user.storage.islatest = false;
		conv.user.storage.start_redemption = false;

	}).catch(function (error) {
		console.log(error)
		conv.ask(new SimpleResponse({
			speech: `<speak><p><s>糟糕，查詢似乎發生錯誤。請稍後再試。</s></p></speak>`,
			text: '發生錯誤，請稍後再試一次。'
		}));
		conv.close(new BasicCard({
			image: new Image({ url: "https://dummyimage.com/1037x539/ef2121/ffffff.png&text=錯誤", alt: 'Pictures', }),
			title: '數據加載發生問題',
			subtitle: '請過一段時間後再回來查看', display: 'CROPPED',
		}));
	});

});


app.intent('選擇期數', (conv, input, option) => {


	if (option === "本期") { var origin_data = conv.user.storage.new; conv.ask(new Suggestions('查看上一期')); }
	else { var origin_data = conv.user.storage.old; conv.ask(new Suggestions('查看這一期')); }

	title = origin_data.title;
	super_prize = origin_data.super.numbers[0];
	special = origin_data.special.numbers[0];
	first_1 = origin_data.first.numbers[0];
	first_2 = origin_data.first.numbers[1];
	first_3 = origin_data.first.numbers[2];
	addition_1 = origin_data.addition.numbers[0];

	subtitle = intervalGET(title);

	if (origin_data.addition.numbers.length > 1) { addition_2 = origin_data.addition.numbers[1]; }
	else { addition_2 = ""; }

	var title_output = title.replace(/[年]+[0]/gm, "年");
	title_output = title_output.replace(/[-]+[0]/gm, "-");

	conv.ask(new SimpleResponse({
		speech: `<speak><p><s>好的，下面是<break time="0.2s"/>${title}的開獎號碼</s><s>要兌閱這一期的開獎號碼嗎?</s></p></speak>`,
		text: '以下是您所要求的資訊',
	}));

	conv.ask(new Table({
		title: title,
		subtitle: '兌換期限：' + subtitle,

		columns: [
			{ header: '獎別', align: 'CENTER', },
			{ header: '', align: 'CENTER', },
			{ header: '', align: 'CENTER', },
		],
		rows: [
			{ cells: ['特別獎', super_prize, ' '], dividerAfter: false, },
			{ cells: ['特獎', special, ' '], dividerAfter: false, },
			{ cells: ['頭獎', first_1, first_2], dividerAfter: false, },
			{ cells: [' ', first_3, ' '], },
			{ cells: ['增開六獎', addition_1, addition_2], },],
	}));

	conv.ask(new Suggestions('我們開始對獎吧!', '👋 掰掰'));

	conv.user.storage.super_prize = super_prize;
	conv.user.storage.special = special;
	conv.user.storage.first_1 = first_1;
	conv.user.storage.first_2 = first_2;
	conv.user.storage.first_3 = first_3;
	conv.user.storage.addition_1 = addition_1;
	conv.user.storage.addition_2 = addition_2;
	conv.user.storage.islatest = false;
	conv.user.storage.start_redemption = false;
	conv.user.storage.index = title;


});

app.intent('本期', (conv) => {

	return new Promise(function (resolve, reject) {

		if (conv.user.storage.new === undefined) {
			ReceiptLottery.query(function (err, info) {
				if (err) {
					reject(err.stack);
				}
				resolve(info);
			});
		}
		else { resolve(conv.user.storage.new) }

	}).then(function (origin_data) {

		if (origin_data.new !== undefined) {
			conv.user.storage.new = origin_data.new;
			conv.user.storage.old = origin_data.old;

			origin_data = origin_data.new;
		}
		title = origin_data.title;
		if (super_prize.indexOf('同期') !== -1) { super_prize = super_prize.split('同期')[0]; }
		super_prize = origin_data.super.numbers[0];
		special = origin_data.special.numbers[0];
		first_1 = origin_data.first.numbers[0];
		first_2 = origin_data.first.numbers[1];
		first_3 = origin_data.first.numbers[2];
		addition_1 = origin_data.addition.numbers[0];

		subtitle = intervalGET(title);

		if (origin_data.addition.numbers.length > 1) { addition_2 = origin_data.addition.numbers[1]; }
		else { addition_2 = ""; }

		var title_output = title.replace(/[年]+[0]/gm, "年");
		title_output = title_output.replace(/[-]+[0]/gm, "-");

		conv.ask(new SimpleResponse({
			speech: `<speak><p><s>好的，下面是<break time="0.2s"/>${title_output}的開獎號碼</s><s>領獎期限是${subtitle}</s></p></speak>`,
			text: '以下是您所要求的資訊',
		}));

		conv.ask(new Table({
			title: title,
			subtitle: '兌換期限：' + subtitle,

			columns: [
				{ header: '獎別', align: 'CENTER', },
				{ header: '', align: 'CENTER', },
				{ header: '', align: 'CENTER', },
			],
			rows: [
				{ cells: ['特別獎', super_prize, ' '], dividerAfter: false, },
				{ cells: ['特獎', special, ' '], dividerAfter: false, },
				{ cells: ['頭獎', first_1, first_2], dividerAfter: false, },
				{ cells: [' ', first_3, ' '], },
				{ cells: ['增開六獎', addition_1, addition_2], },],
		}));
		conv.ask(new Suggestions('我想看上一期的號碼', '我們開始對獎吧!', '👋 掰掰'));

		conv.user.storage.super_prize = super_prize;
		conv.user.storage.special = special;
		conv.user.storage.first_1 = first_1;
		conv.user.storage.first_2 = first_2;
		conv.user.storage.first_3 = first_3;
		conv.user.storage.addition_1 = addition_1;
		conv.user.storage.addition_2 = addition_2;
		conv.user.storage.islatest = false;
		conv.user.storage.start_redemption = false;
		conv.user.storage.index = title;
	}).catch(function (error) {
		console.log(error)
		conv.ask(new SimpleResponse({
			speech: `<speak><p><s>糟糕，查詢似乎發生錯誤。請稍後再試。</s></p></speak>`,
			text: '發生錯誤，請稍後再試一次。'
		}));
		conv.close(new BasicCard({
			image: new Image({ url: "https://dummyimage.com/1037x539/ef2121/ffffff.png&text=錯誤", alt: 'Pictures', }),
			title: '數據加載發生問題',
			subtitle: '請過一段時間後再回來查看', display: 'CROPPED',
		}));
	});
});

app.intent('上一期', (conv,) => {

	return new Promise(function (resolve, reject) {

		if (conv.user.storage.old === undefined) {
			ReceiptLottery.query(function (err, info) {
				if (err) {
					reject(err.stack);
				}
				resolve(info);
			});
		}
		else { resolve(conv.user.storage.old) }

	}).then(function (origin_data) {

		if (origin_data.new !== undefined) {
			conv.user.storage.new = origin_data.new;
			conv.user.storage.old = origin_data.old;

			origin_data = origin_data.old;
		}

		title = origin_data.title;
		if (super_prize.indexOf('同期') !== -1) { super_prize = super_prize.split('同期')[0]; }
		super_prize = origin_data.super.numbers[0];
		special = origin_data.special.numbers[0];
		first_1 = origin_data.first.numbers[0];
		first_2 = origin_data.first.numbers[1];
		first_3 = origin_data.first.numbers[2];
		addition_1 = origin_data.addition.numbers[0];

		if (origin_data.addition.numbers.length > 1) { addition_2 = origin_data.addition.numbers[1]; }
		else { addition_2 = ""; }
		subtitle = intervalGET(title);

		var title_output = title.replace(/[年]+[0]/gm, "年");
		title_output = title_output.replace(/[-]+[0]/gm, "-");

		conv.ask(new SimpleResponse({
			speech: `<speak><p><s>好的，下面是<break time="0.2s"/>${title_output}的開獎號碼</s><s>領獎期限是${subtitle}</s></p></speak>`,
			text: '以下是您所要求的資訊',
		}));

		conv.ask(new Table({
			title: title,
			subtitle: '兌換期限：' + subtitle,

			columns: [
				{ header: '獎別', align: 'CENTER', },
				{ header: '', align: 'CENTER', },
				{ header: '', align: 'CENTER', },
			],
			rows: [
				{ cells: ['特別獎', super_prize, ' '], dividerAfter: false, },
				{ cells: ['特獎', special, ' '], dividerAfter: false, },
				{ cells: ['頭獎', first_1, first_2], dividerAfter: false, },
				{ cells: [' ', first_3, ' '], },
				{ cells: ['增開六獎', addition_1, addition_2], },],
		}));
		conv.ask(new Suggestions('查看最近的那一期', '我們開始對獎吧!', '👋 掰掰'));

		conv.user.storage.super_prize = super_prize;
		conv.user.storage.special = special;
		conv.user.storage.first_1 = first_1;
		conv.user.storage.first_2 = first_2;
		conv.user.storage.first_3 = first_3;
		conv.user.storage.addition_1 = addition_1;
		conv.user.storage.addition_2 = addition_2;
		conv.user.storage.islatest = false;
		conv.user.storage.start_redemption = false;
		conv.user.storage.index = title;
	}).catch(function (error) {
		console.log(error)
		conv.ask(new SimpleResponse({
			speech: `<speak><p><s>糟糕，查詢似乎發生錯誤。請稍後再試。</s></p></speak>`,
			text: '發生錯誤，請稍後再試一次。'
		}));
		conv.close(new BasicCard({
			image: new Image({ url: "https://dummyimage.com/1037x539/ef2121/ffffff.png&text=錯誤", alt: 'Pictures', }),
			title: '數據加載發生問題',
			subtitle: '請過一段時間後再回來查看', display: 'CROPPED',
		}));
	});
});


app.intent('開始兌獎', (conv) => {
	return new Promise(function (resolve, reject) {

		if (conv.user.storage.index === undefined) {
			ReceiptLottery.query(function (err, info) {
				if (err) {
					reject(err.stack);
				}
				resolve(info);
			});
		}
		else { resolve(conv.user.storage.index) }

	}).then(function (origin_data) {

		if (origin_data.new !== undefined) {
			conv.user.storage.new = origin_data.new;
			conv.user.storage.old = origin_data.old;

			origin_data = origin_data.new;

			conv.user.storage.index = origin_data.title;
			conv.user.storage.super_prize = origin_data.super.numbers[0];
			conv.user.storage.special = origin_data.special.numbers[0];
			conv.user.storage.first_1 = origin_data.first.numbers[0];
			conv.user.storage.first_2 = origin_data.first.numbers[1];
			conv.user.storage.first_3 = origin_data.first.numbers[2];
			conv.user.storage.addition_1 = origin_data.addition.numbers[0];
		}
		else {
			conv.user.storage.index = origin_data;
		}

		conv.contexts.set(SelectContexts.parameter, 1);

		conv.ask(new SimpleResponse({
			speech: `<speak><p><s>我知道了，我們現在要開始兌<break time="0.2s"/>${conv.user.storage.index}的發票。</s><s>請輸入發票後三碼來讓我幫你比對。</s></p></speak>`,
			text: 'OK，我們開始對獎吧!',
		}));

		subtitle = intervalGET(conv.user.storage.index);

		conv.ask(new BasicCard({
			title: '您選擇：' + conv.user.storage.index,
			subtitle: '兌換期限：' + subtitle,
			text: '請輸入發票後三碼讓我幫你兌獎!',
		}));

		conv.ask(new Suggestions(random(), random(), random()));
		conv.ask(new Suggestions('注意事項', '結束對獎'));

		conv.user.storage.start_redemption = true;
	}).catch(function (error) {
		console.log(error)
		conv.ask(new SimpleResponse({
			speech: `<speak><p><s>糟糕，查詢似乎發生錯誤。請稍後再試。</s></p></speak>`,
			text: '發生錯誤，請稍後再試一次。'
		}));
		conv.close(new BasicCard({
			image: new Image({ url: "https://dummyimage.com/1037x539/ef2121/ffffff.png&text=錯誤", alt: 'Pictures', }),
			title: '數據加載發生問題',
			subtitle: '請過一段時間後再回來查看', display: 'CROPPED',
		}));
	});

});

app.intent('注意事項', (conv) => {
	conv.ask(new SimpleResponse({
		speech: `<speak><p><s>中獎人請於領獎期間攜帶。</s><s>國民身分證以及中獎統一發票到代發獎金單位公告之營業時間臨櫃兌領。</s><s>詳細資料請前往財政部網站觀看</s></p></speak>`,
		text: '下面是對獎時的注意事項',
	}));
	conv.ask(new BasicCard({
		title: '注意事項',
		subtitle: '\n1.中獎人請於領獎期間攜帶：\n • 國民身分證\n   (護照、居留證或入出境許可證等)\n • 中獎統一發票\n2.依代發獎金單位公告之營業時間臨櫃兌領\n3.逾期不得領獎。\n4.發票未依規定載明金額者，不得領獎。\n5.按最高中獎獎別限領1個獎金。\n6.詳細規定請查閱「統一發票給獎辦法」。',
		text: '[!]以上資訊來自財政部',
		buttons: new Button({
			title: '財政部稅務入口網',
			url: 'http://invoice.etax.nat.gov.tw/',
		}),
	}));
	conv.ask(new Suggestions(random(), random(), random()));
	conv.ask(new Suggestions('結束對獎'));

});


app.intent('輸入數字', (conv, { any }) => {
	index = conv.user.storage.index;
	super_prize = conv.user.storage.super_prize;
	special = conv.user.storage.special;
	first_1 = conv.user.storage.first_1;
	first_2 = conv.user.storage.first_2;
	first_3 = conv.user.storage.first_3;
	addition_1 = conv.user.storage.addition_1;
	addition_2 = conv.user.storage.addition_2;

	super_prize_last3 = substring(conv.user.storage.super_prize);
	special_last3 = substring(conv.user.storage.special);
	first_1_last3 = substring(conv.user.storage.first_1);
	first_2_last3 = substring(conv.user.storage.first_2);
	first_3_last3 = substring(conv.user.storage.first_3);

	any = any.replace(/\s+/g, '');//消除輸入字串中的空格
	any = replaceString(any, '奇異', '七億');
	any = replaceString(any, 'e', '億');
	any = replaceString(any, '義', '億');
	any = replaceString(any, '以前', '一千');
	any = replaceString(any, '佰', '百');
	any = replaceString(any, '元', '萬');
	any = replaceString(any, '仟', '千');
	any = replaceString(any, '壹', '一');
	any = replaceString(any, '貳', '二');
	any = replaceString(any, '兩', '二');
	any = replaceString(any, '參', '三');
	any = replaceString(any, '肆', '四');
	any = replaceString(any, '伍', '五');
	any = replaceString(any, '若', '六');
	any = replaceString(any, '陸', '六');
	any = replaceString(any, '柒', '七');
	any = replaceString(any, '捌', '八');
	any = replaceString(any, '玖', '九');
	any = replaceString(any, '拾', '十');
	any = replaceString(any, '森林', '30');
	any = replaceString(any, '三菱', '30');
	any = replaceString(any, '爸', '8');
	any = replaceString(any, '酒', '9');
	any = replaceString(any, '乘', '');
	any = replaceString(any, '-', '');
	any = replaceString(any, '靈山寺', '034');

	var number = parseInt(any);

	answer_input = false;
	if (isNaN(number) === true) { number = nzhhk.decodeS(any); if (number !== 0) { answer_input = true; } }
	else { answer_input = true; }

	if (answer_input === true) {

		number = (number % 1000).toString();
		if (number.length === 1) { number = "00" + number; }
		else if (number.length === 2) { number = "0" + number; }

		console.log(number)
		conv.contexts.set(SelectContexts.parameter, 1);
		conv.noInputs = ["請輸入" + index + "的發票後三碼", "請輸入發票的後三碼來進行比對", "抱歉，我想我幫不上忙..."];
		answer_input = false;

		if ([first_1_last3, first_2_last3, first_3_last3].indexOf(number) !== -1) {
			if (number === first_1_last3) { temperate = first_1.split(""); price_type = '頭獎'; max_price = '二\n十\n萬\n元'; compare = first_1 }
			else if (number === first_2_last3) { temperate = first_2.split(""); price_type = '頭獎'; max_price = '二\n十\n萬\n元'; compare = first_2 }
			else if (number === first_3_last3) { temperate = first_3.split(""); price_type = '頭獎'; max_price = '二\n十\n萬\n元'; compare = first_3 }
			if (conv.screen) {
				conv.ask(new SimpleResponse({
					speech: `<speak><p><s>快對看看前面數字，你可能仲<break time="0.1s"/>${price_type}了!</s></p></speak>`,
					text: '你有可能中「' + price_type + '」了!',
				}));

				conv.ask(new Table({
					title: price_type,
					subtitle: index,
					columns: [{ header: '⭕', align: 'CENTER', }, { header: '⭕', align: 'CENTER', }, { header: '⭕', align: 'CENTER', }, { header: '⭕', align: 'CENTER', }, { header: '⭕', align: 'CENTER', }, { header: '🔴', align: 'CENTER', }, { header: '🔴', align: 'CENTER', }, { header: '🔴', align: 'CENTER', }],
					rows: [{ cells: [String(temperate[0]), String(temperate[1]), String(temperate[2]), String(temperate[3]), String(temperate[4]), String(temperate[5]), String(temperate[6]), String(temperate[7])], dividerAfter: false, },
					{ cells: [max_price, '四\n萬\n元', '一\n萬\n元', '四\n千\n元', '一\n千\n元', '\n二', '\n百', '\n元'], dividerAfter: false, },
					]
				}));
			}
			else {
				conv.ask(`<speak><p><s>你可能仲<break time="0.1s"/>${price_type}了!</s><s>我將唸出完整號碼，麻煩你進行比對。<break time="0.5s"/><prosody rate="slow" pitch="-2st"><say-as interpret-as="characters">${compare}</say-as></prosody></s></p></speak>`);
			}
		}
		else if ([super_prize_last3, special_last3].indexOf(number) !== -1) {
			if (number === super_prize_last3) { temperate = super_prize.split(""); price_type = '特別獎'; max_price = '一千萬元'; compare = super_prize }
			else if (number === special_last3) { temperate = special.split(""); price_type = '特獎'; max_price = '二百萬元'; compare = special }
			if (conv.screen) {
				conv.ask(new SimpleResponse({
					speech: `<speak><p><s>快對看看前面數字，你可能仲<break time="0.1s"/>${price_type}了!</s></p></speak>`,
					text: '你有可能中「' + price_type + '」了!',
				}));
				conv.ask(new Table({
					title: '《' + price_type + '》  \n8位數號碼相同者獎金' + max_price,
					subtitle: index,
					columns: [{ header: '⭕', align: 'CENTER', }, { header: '⭕', align: 'CENTER', }, { header: '⭕', align: 'CENTER', }, { header: '⭕', align: 'CENTER', }, { header: '⭕', align: 'CENTER', }, { header: '🔴', align: 'CENTER', }, { header: '🔴', align: 'CENTER', }, { header: '🔴', align: 'CENTER', }],
					rows: [{ cells: [String(temperate[0]), String(temperate[1]), String(temperate[2]), String(temperate[3]), String(temperate[4]), String(temperate[5]), String(temperate[6]), String(temperate[7])], dividerAfter: false, },
					]
				}));
			}
			else {
				conv.ask(`<speak><p><s>你可能仲<break time="0.1s"/>${price_type}了!</s><s>如果剩餘號碼完全相同將獲得${max_price}。我將唸出完整號碼，麻煩你進行比對。<break time="0.5s"/><prosody rate="slow" pitch="-2st"><say-as interpret-as="characters">${compare}</say-as></prosody></s></p></speak>`);
			}
		}
		else if ([addition_1, addition_2].indexOf(number) !== -1) {
			conv.ask('恭喜你賺到200元零用金拉!');
			conv.ask(new BasicCard({
				title: '增開六獎：' + number,
				text: '正在比對的期數：' + index,
			}));
		}
		else {
			conv.ask(new SimpleResponse({
				speech: `<speak><p><s>沒有中獎喔!</s></p></speak>`,
				text: '沒有中獎...',
			}));
			conv.ask(new BasicCard({
				title: "你的輸入是：" + number,
				text: '正在比對的期數：' + index,
			}));
		}
		conv.ask(new Suggestions(random(), random(), random()));

		conv.ask(new Suggestions('注意事項', '結束對獎'));

	} else {

		if (any.indexOf('結束') === -1) {
			conv.noInputs = ["請輸入" + index + "的發票後三碼", "請輸入發票的後三碼來進行比對", "抱歉，我想我幫不上忙..."];
			conv.contexts.set(SelectContexts.parameter, 1);
			conv.ask(new SimpleResponse({
				speech: `<speak><p><s>抱歉，我沒聽清楚!</s><s>請確認輸入是否有誤，然後再試一次!</s></p></speak>`,
				text: '請重新輸入呦!',
			}));
			if (conv.screen) {
				conv.ask(new BasicCard({
					title: '請輸入數字!',
					text: '正在比對的期數：' + index,
				}));
				conv.ask(new Suggestions(random(), random(), random()));
				conv.ask(new Suggestions('結束對獎'));
			}
			else {
				conv.ask(`<speak><p><s>如果想結束我們的對話，請說<break time="0.5s"/>結束對獎</s></p></speak>`);
			}
		}
		else {

			if (conv.screen) {
				conv.contexts.delete(SelectContexts.parameter, 1)
				conv.ask(new SimpleResponse({
					speech: `<speak><p><s>好的，已關閉對獎模式</s><s>請問還有甚麼需要我幫忙的嗎?。</s></p></speak>`,
					text: '好的，已經關閉對獎模式!\n還需要什麼服務嗎?',
				}));
				conv.ask(new Carousel({
					items: {
						'本期': {
							synonyms: ['最近的', '這期', '新的'],
							title: '本期',
							description: conv.user.storage.new.title,
						},
						'上一期': {
							synonyms: ['上一個', '上期', '舊的'],
							title: '上一期',
							description: conv.user.storage.old.title,
						}
					},
				}));
				conv.ask(new Suggestions('開始兌獎', '👋 掰掰'));
			}
			else {
				conv.close(`<speak><p><s>希望能幫上一點忙，下次見!</s></p></speak>`);
			}
		}
	}
});


app.intent('預設罐頭回覆', (conv) => {

	conv.ask(new SimpleResponse({
		speech: `<speak><p><s>不好意思</s><s>我不懂你的意思，請問需要我幫你做甚麼呢?</s></p></speak>`,
		text: '抱歉，我不懂你的意思。\n請點選下方卡片查看近期的開獎號碼，\n或是請我幫你快速兌獎!',
	}));
	conv.ask(new Carousel({
		items: {
			'本期': {
				synonyms: ['最近的', '這期', '新的'],
				title: '本期',
				description: conv.user.storage.new.title,
			},
			'上一期': {
				synonyms: ['上一個', '上期', '舊的'],
				title: '上一期',
				description: conv.user.storage.old.title,
			}
		},
	}));
	conv.ask(new Suggestions('我們開始對獎吧!', '👋 掰掰'));

});

app.intent('結束對話', (conv) => {
	conv.user.storage = {}; //離開同時清除暫存資料
	conv.ask('希望能幫到一點忙!');
	conv.ask(new SimpleResponse({ speech: '下次見', text: '下次見 👋', }));
	conv.close(new BasicCard({
		title: '感謝您的使用!',
		text: '如果有任何需要改進的地方，  \n歡迎到簡介頁面評分或給予反饋，謝謝!',
		buttons: new Button({ title: '開啟本程式的商店頁面', url: 'https://assistant.google.com/services/a/uid/000000f3dc6153fc', }),
	}));

});


exports.Invoice_redemptioner = functions.https.onRequest(app); 
