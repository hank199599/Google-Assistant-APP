'use strict';

// Import the Dialogflow module from the Actions on Google client library.
const { dialogflow, SimpleResponse, Image, BasicCard, Button, Table } = require('actions-on-google');
const functions = require('firebase-functions');
const replaceString = require('replace-string');

var request = require('request');
const app = dialogflow({ debug: true });
var transform=require('./indicator_light.json');

app.intent('預設歡迎語句', (conv) => {

	var today = new Date();
	var nowTime = today.getTime() + (-4 * 3600 * 1000);
	today.setTime(parseInt(nowTime));


	return new Promise(

		function (resolve, reject) {

			request('https://www.taipower.com.tw/d006/loadGraph/loadGraph/data/loadpara.json', function (err, response, body) {
				if (!err && response.statusCode == 200) {
					resolve(JSON.parse(body).records)
				}
				else { reject(err) }
			});

		}).then(function (final_data) {

			var latest_load = final_data[0].curr_load;
			var load_forecast_max = final_data[1].fore_peak_dema_load;
			var supply_arranged_max = final_data[1].fore_maxi_sply_capacity;
			var update_time = final_data[1].publish_time.split(')')[1];
			var latest_load_perc = parseInt(final_data[0].curr_util_rate);
			var forecast_load_perc = parseInt((load_forecast_max / supply_arranged_max) * 100);
			var time_interval = final_data[1].fore_peak_hour_range;
			var indicator=transform[final_data[1].fore_peak_resv_indicator];

			conv.ask(new SimpleResponse({
				speech: `<speak><p><s>以下是台灣電力公司在${update_time}發布之電力資訊<break time="0.5s"/>目前的用電量是${latest_load}萬千瓦，佔最大供應量約${latest_load_perc}%。</s><s>預估尖峰時段在${time_interval}，用電量將來到${load_forecast_max}萬千瓦</s><s>整體而言現在${indicator[1]}</s></p></speak>`,
				text: "這是來自台電的最新電力資訊",
			}));

			conv.close(new Table({
				title: indicator[0]+" "+indicator[1],
				subtitle: '更新時間 • ' + update_time,
				columns: [{ header: '類別', align: 'CENTER', }, { header: '用電量(萬瓩)', align: 'CENTER', }, { header: '使用率', align: 'CENTER', },],
				rows: [
					{
						cells: ['目前', String(latest_load), latest_load_perc + "%"],
						dividerAfter: false,
					},
					{
						cells: ['尖峰預測', String(load_forecast_max), forecast_load_perc + "%"],
						dividerAfter: false,
					},
					{
						cells: ['最大供應量', String(supply_arranged_max),"　"],
						dividerAfter: false,
					},
					{
						cells: ['預測尖峰時段', time_interval,"　"],
						dividerAfter: false,
					}
				],
				buttons: new Button({
					title: '查看更多資訊',
					url: 'https://www.taipower.com.tw/tc/page.aspx?mid=206&cid=402&cchk=8c59a5ca-9174-4d2e-93e4-0454b906018d',
				}),
			}));


		}).catch(function (error) {
			conv.ask(new SimpleResponse({
				speech: `<speak><p><s>獲取資料發生錯誤，請稍後再試。</s></p></speak>`,
				text: '獲取資訊發生一點狀況，請稍後再試',
			}));
			console.log(error)

			conv.close(new BasicCard({
				image: new Image({ url: 'https://dummyimage.com/1037x539/e0ca02/ffffff.png&text=錯誤', alt: 'Pictures', }),
				title: "發生錯誤，請稍後再試", display: 'CROPPED',
			}));

		});
});

// Set the DialogflowApp object to handle the HTTPS POST request.
exports.tw_power_index = functions.https.onRequest(app);