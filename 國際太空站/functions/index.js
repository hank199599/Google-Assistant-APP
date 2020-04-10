	'use strict';

	// Import the Dialogflow module from the Actions on Google client library.
	const {
	  dialogflow,
	  Permission,
	  Suggestions,
	  SimpleResponse,
	  Button,
	  Image,
	  BasicCard,Carousel,
	  LinkOutSuggestion,
	  BrowseCarousel,BrowseCarouselItem,items,Table
	} = require('actions-on-google');

const functions = require('firebase-functions');
var getJSON = require('get-json')
const replaceString = require('replace-string');
const i18n = require('i18n');
const https = require("https");
const cheerio = require('cheerio');

var admin = require("firebase-admin");

const app = dialogflow({debug: true});
var i=0
var data_array=[];
var return_array=[];

i18n.configure({
  locales: ['zh-TW','zh-HK'],
  directory: __dirname + '/locales',
  defaultLocale: 'zh-TW',
});

app.middleware((conv) => {
  i18n.setLocale(conv.user.locale);
});

var dirction={"N":i18n.__('N'),"NbE":i18n.__('NbE'),"NNE":i18n.__('NNE'),"NEbN":i18n.__('NEbN'),"NE":i18n.__('NE'),"NEbE":i18n.__('NEbE'),"ENE":i18n.__('ENE'),"EbN":i18n.__('EbN'),"E":i18n.__('E'),"EbS":i18n.__('EbS'),"ESE":i18n.__('ESE'),"SEbE":i18n.__('SEbE'),"SE":i18n.__('SE'),"SEbS":i18n.__('SEbS'),"SSE":i18n.__('SSE'),"SbE":i18n.__('SbE'),"S":i18n.__('S'),"SbW":i18n.__('SbW'),"SSW":i18n.__('SSW'),"SWbS":i18n.__('SWbS'),"SW":i18n.__('SW'),"SWbW":i18n.__('SWbW'),"WSW":i18n.__('WSW'),"WbS":i18n.__('WbS'),"W":i18n.__('W'),"WbN":i18n.__('WbN'),"WNW":i18n.__('WNW'),"NWbW":i18n.__('NWbW'),"NW":i18n.__('NW'),"NWbN":i18n.__('NWbN'),"NNW":i18n.__('NNW'),"NbW":i18n.__('NbW')};
var month={"Jan":"1月","Feb":"2月","Mar":"3月","Apr":"4月","May":"5月","Jun":"6月","Jul":"7月","Aug":"8月","SEP":"9月","Oct":"10月","Nov":"11月","Dec":"12月"}
var date="";


app.intent('預設歡迎語句', (conv) => {
	
	var example_array=[i18n.__('now_where'),i18n.__('pass_time'),i18n.__('people_on')];
	
        conv.ask(new SimpleResponse({               
              speech: `<speak><p><s>歡迎使用!</s><s>你可以問我有關國際太空站的事情，例如：${example_array[parseInt(Math.random()*2)]}。</s></p></speak>`,
              text: '歡迎使用!'}));

	    conv.ask(new BasicCard({  
        image: new Image({url:'https://i.imgur.com/tc6HMlI.jpg',alt:'Pictures',}),
		title:"國際太空站",
		subtitle:"International Space Station，ISS",
        text:i18n.__('introduction'),
        buttons: new Button({title: 'NASA官方頁面',url:'https://www.nasa.gov/mission_pages/station/main/index.html',display: 'CROPPED',}),}));
		
		conv.ask(new Suggestions(i18n.__('now_where'),i18n.__('pass_time'),i18n.__('people_on'),'👋 '+i18n.__('Bye')));
		conv.ask(new LinkOutSuggestion({
			name: 'Google地球上的內部街景',url:'https://earth.google.com/web/data=CiQSIhIgN2Y3ZTA1ZTg2Y2E1MTFlNzk5YzI1YjJmNTFhNjA3NTI',
		  }));		
		conv.user.storage.direct=false;

});

app.intent('現在位置', (conv) => {

   return new Promise(
   
   function(resolve,reject){
	getJSON('http://api.open-notify.org/iss-now.json')
    .then(function(response) {
    resolve(response.iss_position)
    }).catch(function(error) {
	 var reason=new Error('資料獲取失敗');
     reject(reason)	
	});

  }).then(function (final_data) {
		
    conv.ask(new SimpleResponse({ 
			 speech: `<speak><p><s>${i18n.__('output',final_data.latitude,final_data.longitude)}</s></p></speak>`,
			   text: i18n.__('output_text'),}));
	if(conv.user.storage.direct===false){
	conv.ask(new BasicCard({
		image: new Image({url:'https://www.heavens-above.com/orbitdisplay.aspx?icon=iss&width=1037&height=539&mode='+final_data.latitude+','+final_data.longitude+'&satid=25544',alt:'Pictures',}),
		title:i18n.__('title'),display: 'CROPPED',
		subtitle:"緯度"+final_data.latitude+" • 經度"+final_data.longitude,
		text:i18n.__('text'),
		buttons: new Button({title: i18n.__('map_button'),url:'https://www.google.com/maps/search/?api=1&query='+final_data.latitude+','+final_data.longitude,})
		}));
    conv.ask(new Suggestions('再次查詢',i18n.__('pass_time'),i18n.__('people_on'),'👋 '+i18n.__('Bye')));
	
	}
	else{
	conv.close(new BasicCard({
		image: new Image({url:'https://www.heavens-above.com/orbitdisplay.aspx?icon=iss&width=1037&height=539&mode='+final_data.latitude+','+final_data.longitude+'&satid=25544',alt:'Pictures',}),
		title:i18n.__('title'),display: 'CROPPED',
		subtitle:"緯度"+final_data.latitude+" • 經度"+final_data.longitude,
		text:i18n.__('text'),
		buttons: new Button({title: '在Google地圖看對應位置',url:'https://www.google.com/maps/search/?api=1&query='+final_data.latitude+','+final_data.longitude,})
		}));	
	}
	}).catch(function (error) {
    conv.ask(new SimpleResponse({ 
			 speech: `<speak><p><s>獲取資料發生錯誤，請稍後再試。</s></p></speak>`,
			   text: '獲取資訊發生未知錯誤',}));
	console.log(error)
	if(conv.user.storage.direct===false){
	conv.ask(new BasicCard({  
		image: new Image({url:'https://dummyimage.com/1037x539/ef2121/ffffff.png&text=錯誤',alt:'Pictures',}),
		title:"發生錯誤，請稍後再試",display: 'CROPPED',}));	
    conv.ask(new Suggestions('再次查詢',i18n.__('pass_time'),i18n.__('people_on'),'👋 '+i18n.__('Bye')));
		
	}
	else{
	conv.close(new BasicCard({  
		image: new Image({url:'https://dummyimage.com/1037x539/ef2121/ffffff.png&text=錯誤',alt:'Pictures',}),
		title:"發生錯誤，請稍後再試",display: 'CROPPED',}));	
	}
});

});

app.intent('取得地點權限', (conv) => {
 conv.data.requestedPermission = 'DEVICE_PRECISE_LOCATION';

    return conv.ask(new Permission({
    context: i18n.__('Permission_request'),
    permissions: conv.data.requestedPermission,}));

conv.ask(new Permission(options));
  
});

app.intent('回傳資訊', (conv, params, permissionGranted)=> {

    if (permissionGranted) {
        const {
            requestedPermission
        } = conv.data;
		
        if (requestedPermission === 'DEVICE_PRECISE_LOCATION') {
 
            const coordinates = conv.device.location.coordinates;
 			
            if (coordinates) {
			   return new Promise(
			   function(resolve,reject){
				   https.get('https://www.heavens-above.com/PassSummary.aspx?satid=25544&lat='+coordinates.latitude+'&lng='+coordinates.longitude+'&loc=Unnamed&alt=0&tz=ChST&cul=zh-CHT', res => {
						  let body = "";
						   res.on("data", data => {
							body += data;
						  });
						  res.on("end", () => {

					if(res.statusCode == 200 ){
						// body為原始碼
						// 使用 cheerio.load 將字串轉換為 cheerio(jQuery) 物件，
						// 按照jQuery方式操作即可
						var $ = cheerio.load(body);
						// 輸出導航的html程式碼
						const table_tr = $('.standardTable tbody tr').html();

						var data=table_tr.split('</td>');
						data_array=[];
						  for(i=0;i<data.length;i++){
							if(data[i].length!==0){
								var temp=data[i];
								if(temp.indexOf('">')!==-1){temp=temp.split('">')[1]}
								else if(temp.indexOf('<td>')!==-1){temp=temp.split('<td>')[1]}
								if(temp.indexOf('</a>')!==-1){temp=temp.split('</a>')[0]}
								if(temp.indexOf('&#xB0')!==-1){temp=temp.split('&#xB0')[0]}
								
								data_array.push(temp);
							}
						  }
						  var url=(data[0].split('href="')[1]).split('"')[0]
						  data_array.push(url);
						  
						  resolve(data_array)
						}else{
							reject('錯誤')
						}
				  });
				});
			  }).then(function (final_data) {
				  
			   date=final_data[0].split(' ');
			   date=month[date[1]]+parseInt(date[0])+'日';
  
			   conv.ask(new SimpleResponse({               
				   speech: `<speak><p><s>${ i18n.__('report',date,final_data[2],dirction[final_data[4]],final_data[3],final_data[1],final_data[8],dirction[final_data[10]],final_data[9])}</s></p></speak>`,
					text: i18n.__('report_text')}));
				if(conv.user.storage.direct===false){
				conv.ask(new Table({
						title: date+'  \n最大星等 '+final_data[1],
						columns: [{header: '時機點',align: 'CENTER',},{header: '時間',align: 'CENTER',},{header: '仰角',align: 'CENTER',},{header: '方位',align: 'CENTER',},],
						rows: [
						{cells: [i18n.__('start'),final_data[2],final_data[3]+'°',dirction[final_data[4]]],dividerAfter: false,},
						{cells: [i18n.__('high_point'),final_data[5],final_data[6]+'°',dirction[final_data[7]]],dividerAfter: false,},
						{cells: [i18n.__('end'),final_data[8],final_data[9]+'°',dirction[final_data[10]]],dividerAfter: false,},
						],
						buttons: new Button({
						  title: '查看對應星象圖',
						  url: 'https://www.heavens-above.com/'+replaceString(final_data[12], '&amp;', '&'),
						}),
					}));
				    conv.ask(new Suggestions('重新定位',i18n.__('now_where1'),i18n.__('people_on'),'👋 '+i18n.__('Bye')));}
				else{
				conv.close(new Table({
						title: date+'  \n最大星等 '+final_data[1],
						columns: [{header: '時機點',align: 'CENTER',},{header: '時間',align: 'CENTER',},{header: '仰角',align: 'CENTER',},{header: '方位',align: 'CENTER',},],
						rows: [
						{cells: [i18n.__('start'),final_data[2],final_data[3]+'°',dirction[final_data[4]]],dividerAfter: false,},
						{cells: [i18n.__('high_point'),final_data[5],final_data[6]+'°',dirction[final_data[7]]],dividerAfter: false,},
						{cells: [i18n.__('end'),final_data[8],final_data[9]+'°',dirction[final_data[10]]],dividerAfter: false,},
						],
						buttons: new Button({
						  title: '查看對應星象圖',
						  url: 'https://www.heavens-above.com/'+replaceString(final_data[12], '&amp;', '&'),
						}),
					}));}
				  }).catch(function (error) {
				conv.ask(new SimpleResponse({               
						  speech: `<speak><p><s>查詢發生錯誤。</s><s>請稍後再試。</s></p></speak>`,
							text: '發生錯誤，請稍後再試一次。'}));
				if(conv.user.storage.direct===false){
				conv.ask(new BasicCard({  
							image: new Image({url:"https://dummyimage.com/1037x539/ef2121/ffffff.png&text=錯誤",alt:'Pictures',}),
							title:'數據加載發生問題',
							subtitle:'請過一段時間後再回來查看', display: 'CROPPED',}));
								    conv.ask(new Suggestions('重新定位',i18n.__('now_where1'),i18n.__('people_on'),'👋 '+i18n.__('Bye')));}
				else{
				conv.close(new BasicCard({  
							image: new Image({url:"https://dummyimage.com/1037x539/ef2121/ffffff.png&text=錯誤",alt:'Pictures',}),
							title:'數據加載發生問題',
							subtitle:'請過一段時間後再回來查看', display: 'CROPPED',}));}

		    });}		
		   else {
				if(conv.user.storage.direct===false){
				conv.ask(new SimpleResponse({speech:`<speak><p><s>糟糕，我無法得知你的目前位置。</s><s>請稍後再試。</s></p></speak>`,text:"發生錯誤，請開啟GPS功能然後再試一次。"}));                 
				conv.ask(new Suggestions('重新定位',i18n.__('now_where1'),i18n.__('people_on'),'👋 '+i18n.__('Bye')));
				}
				else{
				conv.close(new SimpleResponse({speech:`<speak><p><s>糟糕，我無法得知你的目前位置。</s><s>請稍後再試。</s></p></speak>`,text:"發生錯誤，請開啟GPS功能然後再試一次。"}));                 
            }
		  }
        }
    } else {
				if(conv.user.storage.direct===false){
				conv.ask(new SimpleResponse({speech:`<speak><p><s>很抱歉，由於未取得你的授權因此查詢失敗。</s><s>不過你隨時可以回來再試一次。</s></p></speak>`,text:"發生錯誤，未取得你的授權。"}));                 
				conv.ask(new Suggestions('重新定位',i18n.__('now_where1'),i18n.__('people_on'),'👋 '+i18n.__('Bye')));
				}
				else{
				conv.close(new SimpleResponse({speech:`<speak><p><s>很抱歉，由於未取得你的授權因此查詢失敗。</s><s>不過你隨時可以回來再試一次。</s></p></speak>`,text:"發生錯誤，未取得你的授權。"}));                 
		  }
		}

});


app.intent('上面的人資訊', (conv) => {

   return new Promise(
   
   function(resolve,reject){
	getJSON('http://api.open-notify.org/astros.json')
    .then(function(response) {
		var people_array=[];
		for(i=0;i<response.people.length;i++){
			people_array.push(response.people[i].name)
		}
    resolve(people_array)
    }).catch(function(error) {
	 var reason=new Error('資料獲取失敗');
     reject(reason)	
	});

   }).then(function (return_data) {
	   
	var people_list="";var people_output="";
	for(i=0;i<return_data.length;i++){
	people_list=people_list+'  • '+	return_data[i]+'\n';
	people_output=people_output+return_data[i]+'<break time="0.5s"/>';
	}
	
	conv.ask(new SimpleResponse({ 
		 speech: `<speak><p><s>${i18n.__('people_info',return_data.length)}，分別是${people_output}</s></p></speak>`,
		   text: "查詢完成，詳細資訊如下",}));
		   
	if(conv.user.storage.direct===false){
	conv.ask(new BasicCard({
		title:i18n.__('people_info1',return_data.length),display: 'CROPPED',
		subtitle:people_list,
		buttons: new Button({
		  title: '前往NASA看詳細資訊',
		  url: 'https://www.nasa.gov/mission_pages/station/expeditions/index.html',
		}),	
	}));
    conv.ask(new Suggestions(i18n.__('now_where'),i18n.__('pass_time'),'👋 '+i18n.__('Bye')));
	
	}
	else{
	conv.close(new BasicCard({
		title:i18n.__('people_info1',return_data.length),display: 'CROPPED',
		subtitle:people_list,
		buttons: new Button({
		  title: '前往NASA看詳細資訊',
		  url: 'https://www.nasa.gov/mission_pages/station/expeditions/index.html',
		}),	
	 }));	
	}
	}).catch(function (error) {
    conv.ask(new SimpleResponse({ 
			 speech: `<speak><p><s>獲取資料發生錯誤，請稍後再試。</s></p></speak>`,
			   text: '獲取資訊發生未知錯誤',}));
	console.log(error)
	if(conv.user.storage.direct===false){
	conv.ask(new BasicCard({  
		image: new Image({url:'https://dummyimage.com/1037x539/ef2121/ffffff.png&text=錯誤',alt:'Pictures',}),
		title:"發生錯誤，請稍後再試",display: 'CROPPED',}));	
    conv.ask(new Suggestions(i18n.__('now_where'),i18n.__('pass_time'),'👋 '+i18n.__('Bye')));
		
	}
	else{
	conv.close(new BasicCard({  
		image: new Image({url:'https://dummyimage.com/1037x539/ef2121/ffffff.png&text=錯誤',alt:'Pictures',}),
		title:"發生錯誤，請稍後再試",display: 'CROPPED',}));	
	}

  });

});

app.intent('預設罐頭回覆', (conv) => {
		
		var example_array=[i18n.__('now_where'),i18n.__('pass_time'),i18n.__('people_on')];

		conv.ask(new SimpleResponse({
		speech:`<speak><p><s>${i18n.__('Error_hint1','<break time="0.5s"/>',example_array[parseInt(Math.random()*2)])}</s></p></speak>`,
		text:i18n.__('Error_hint')}));
		
		conv.ask(new Suggestions(i18n.__('now_where'),i18n.__('pass_time'),i18n.__('people_on'),'👋 '+i18n.__('Bye')));

});


app.intent('結束對話', (conv) => {
    conv.user.storage = {}; //離開同時清除暫存資料
    conv.ask(i18n.__('EndTalk1'));
    conv.ask(new SimpleResponse({speech: i18n.__('EndTalk2'),text: i18n.__('EndTalk2')+' 👋',}));
    conv.close(new BasicCard({   
        title: i18n.__('EndTitle'), 
        subtitle:i18n.__('EndText'),
        buttons: new Button({title: i18n.__('EndButton'),url: 'https://assistant.google.com/services/a/uid/000000ee35748109',}),
  })); 
 
 });


// Set the DialogflowApp object to handle the HTTPS POST request.
exports.iss_info = functions.https.onRequest(app);