	'use strict';

	// Import the Dialogflow module from the Actions on Google client library.
	const {dialogflow,SimpleResponse,Image,BasicCard,Button,Table} = require('actions-on-google');
	const functions = require('firebase-functions');
	const replaceString = require('replace-string');

	var request = require('request');
	const app = dialogflow({debug: true});


	app.intent('預設歡迎語句', (conv) => {

		var today = new Date();
		var nowTime = today.getTime()+(-4*3600*1000);
            today.setTime(parseInt(nowTime));
		var hour_now=today.getHours();	
	    var minute_now=today.getMinutes();
		
	 return new Promise(
	   
	   function(resolve,reject){
		   
		 request('https://www.taipower.com.tw/d006/Meter/js/loadpara.js', function(err, response, body){
			if( !err && response.statusCode == 200 ){

		   var loadInfo=(body.split('var loadInfo = [')[1]).split(']')[0];
		  
		   loadInfo=replaceString(loadInfo,'\r\n',''); 
		   loadInfo=loadInfo.split('","')
		   resolve(loadInfo)
			}
			else{reject(err)}
			 });

	  }).then(function (final_data) {
		 
		console.log(final_data)
		
		var latest_load= replaceString(final_data[0],'"','');
		    latest_load= parseFloat(replaceString(latest_load,',',''));
		var load_forecast_max=parseFloat(replaceString(final_data[1],',',''));
		var supply_arranged_max=parseFloat(replaceString(final_data[2],',',''));
		var update_time=replaceString(final_data[3],'更新"','').split(')')[1];
		var latest_load_perc=parseInt((latest_load/supply_arranged_max)*100);
		var forecast_load_perc=parseInt((load_forecast_max/supply_arranged_max)*100);
		  
		
		conv.ask(new SimpleResponse({ 
				 speech: `<speak><p><s>以下是台灣電力公司在${update_time}發布之電力資訊<break time="0.5s"/>目前的用電量是${latest_load}萬千瓦，佔最大供應量約${latest_load_perc}%</s></p></speak>`,
				   text: "這是來自台電的最新電力資訊",}));

		conv.close(new Table({
		  title: '即時電力資訊',
		  subtitle: '更新時間 • '+update_time,
		  columns: [{header: '類別',align: 'CENTER',},{header: '用電量(萬瓩)',align: 'CENTER',},{  header: '使用率',align: 'CENTER',},],
		  rows: [
			{
			  cells: ['目前',String(latest_load),latest_load_perc+"%"],
			  dividerAfter: false,
			},
			{
			  cells: ['尖峰預測',String(load_forecast_max),forecast_load_perc+"%"],
			  dividerAfter: false,
			},
			{
			  cells: ['最大供應量',String(supply_arranged_max),' '],
			  dividerAfter: false,
			},
		  ],
		  buttons: new Button({
			title: '查看更多資訊',
			url: 'https://www.taipower.com.tw/tc/page.aspx?mid=206&cid=402&cchk=8c59a5ca-9174-4d2e-93e4-0454b906018d',
		  }),
		}));
					

		}).catch(function (error) {
		conv.ask(new SimpleResponse({ 
				 speech: `<speak><p><s>獲取資料發生錯誤，請稍後再試。</s></p></speak>`,
				   text: '獲取資訊發生未知錯誤',}));
		console.log(error)

		conv.close(new BasicCard({  
			image: new Image({url:'https://dummyimage.com/1089x726/ef2121/ffffff.png&text=錯誤',alt:'Pictures',}),
			title:"發生錯誤，請稍後再試",display: 'CROPPED',}));	
		
	});
	});

	// Set the DialogflowApp object to handle the HTTPS POST request.
	exports.tw_power_index = functions.https.onRequest(app);