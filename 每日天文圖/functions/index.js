'use strict';

// Import the Dialogflow module from the Actions on Google client library.
const { dialogflow, SimpleResponse, Image, BasicCard, Button } = require('actions-on-google');
const functions = require('firebase-functions');
var getJSON = require('get-json')
const replaceString = require('replace-string');

var admin = require("firebase-admin");
var request = require('request');
var cheerio = require('cheerio');
const app = dialogflow({ debug: true });

var serviceAccount = require("./config/newagent-1-f657d-firebase-adminsdk-mtlvk-ed1ecc4a2a.json");

var admin = require("firebase-admin");

admin.initializeApp({
	credential: admin.credential.cert(serviceAccount),
	databaseURL: "https://newagent-1-f657d.firebaseio.com"
});
const database = admin.database();


app.intent('預設歡迎語句', (conv) => {

	var time = new Date();
	var hour_now = (time.getHours() + 8) % 24;
	var minute_now = time.getMinutes();

	return new Promise(

		function (resolve, reject) {
			if (minute_now < 15&&[12,13].indexOf(hour_now)!==-1) {

				request('http://sprite.phys.ncku.edu.tw/astrolab/mirrors/apod/apod.html', function (err, response, body) {
					if (!err && response.statusCode == 200) {
						// body為原始碼
						// 使用 cheerio.load 將字串轉換為 cheerio(jQuery) 物件，
						// 按照jQuery方式操作即可
						var $ = cheerio.load(body, { decodeEntities: false });
						// 輸出導航的html程式碼

						if (body.indexOf('IMG SRC') !== -1) {
							var imgurl = "http://sprite.phys.ncku.edu.tw/astrolab/mirrors/apod/" + ((body).split('IMG SRC="')[1]).split('"')[0];
							imgurl = replaceString(imgurl, '1200.jpg', 'full.jpg')
						}
						else if (body.indexOf('youtube.com') !== -1) {
							var imgurl = "http://img.youtube.com/vi/" + ((body).split('www.youtube.com/embed/')[1]).split('?rel=0')[0] + "/0.jpg";
						}

						$('*').each(function () { this.attribs = {}; });

						var origin = $.html().replace(/<[a-z]+>/gi, "");
						origin = origin.replace(/<\/[a-z]+>/gi, "");
						origin = origin.replace(/\n/gi, "");
						var data = origin.split('   ');

						//console.log(data)

						var title = data[1];
						var copyright = replaceString(data[2], ' ', '');
						var text = data[3].split('說明: ')[1];

						database.ref('/Daily_nasa').update({ copyright: copyright, title: title, text: text, url: imgurl });

						resolve({ copyright: copyright, title: title, text: text, url: imgurl })
					}
					else { console.log(err) }
				});

			}
			else {
				database.ref('/Daily_nasa').on('value', e => { resolve(e.val()); });
			}
		}).then(function (final_data) {
			
			console.log(final_data)
			
			conv.ask(new SimpleResponse({
				speech: `<speak><p><s>這是今天的精選天文圖<break time="0.5s"/>${final_data.text}</s></p></speak>`,
				text: "下面是今天的精選天文圖",
			}));


			conv.close(new BasicCard({
				image: new Image({ url: final_data.url, alt: 'Pictures', }),
				title: final_data.title, display: 'CROPPED',
				subtitle: "Ⓒ" + final_data.copyright,
				text: final_data.text,
				buttons: new Button({ title: "查看更多資訊", url: "http://sprite.phys.ncku.edu.tw/astrolab/mirrors/apod/apod.html", }),
			}));


		}).catch(function (error) {
			conv.ask(new SimpleResponse({
				speech: `<speak><p><s>獲取資料發生錯誤，請稍後再試。</s></p></speak>`,
				text: '獲取資訊發生未知錯誤',
			}));
			console.log(error)

			conv.close(new BasicCard({
				image: new Image({ url: 'https://i.imgur.com/LLBIlCA.png', alt: 'Pictures', }),
				title: "發生錯誤，請稍後再試", display: 'CROPPED',
			}));

		});
});

// Set the DialogflowApp object to handle the HTTPS POST request.
exports.nasa_daily_picture = functions.https.onRequest(app);