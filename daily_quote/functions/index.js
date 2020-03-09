'use strict';

// Import the Dialogflow module from the Actions on Google client library.
const {
  dialogflow,
  Permission,
  Suggestions,
  SimpleResponse,
  Button,
  Image,Carousel,
  BasicCard,
  LinkOutSuggestion,
  BrowseCarousel,BrowseCarouselItem,items,Table
} = require('actions-on-google');

// Import the firebase-functions package for deployment.

//var getJSON = require('get-json')//引用呼叫網路內容之模組
//var parser=require('json-parser');

const functions = require('firebase-functions');
const replaceString = require('replace-string');
const app = dialogflow({debug: true});
var picker = require('./daily_quotes');
var Time= new Date();
var date="";var month="";var day="";
var output_array="";
var Quote="";
var reference="";
var Picture_url="";

var months = "1月,2月,3月,4月,5月,6月,7月,8月,9月,10月,11月,12月".split(",");
var month =String(months[Time.getMonth()]);
var day =String(Time.getDate());
var Hournow=Time.getHours()+8;
var theArray= new Array;
theArray=["https://i.imgur.com/02rnSIa.jpg","https://i.imgur.com/VfcMtId.jpg","https://i.imgur.com/PLVkbbK.jpg","https://i.imgur.com/LcEpziD.jpg","https://i.imgur.com/EoCooEB.jpg","https://i.imgur.com/hfLI7eK.jpg","https://i.imgur.com/71beT0V.jpg","https://i.imgur.com/FcfNl1w.jpg","https://i.imgur.com/APcShEp.jpg","https://i.imgur.com/4R8PxKA.jpg","https://i.imgur.com/b5vLpDA.jpg","https://i.imgur.com/faaRLCP.jpg","https://i.imgur.com/pTci1ux.jpg","https://i.imgur.com/lYmqldk.jpg","https://i.imgur.com/2oOhmvs.jpg","https://i.imgur.com/2oOhmvs.jpg"];

app.intent('預設歡迎語句', (conv) => { 
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

  output_array=picker.selector(date);
  Quote=output_array[0];
  reference=output_array[1];
  
  Picture_url=theArray[parseInt(Math.random()*19)];
  
		conv.ask(new SimpleResponse({               
			speech: `<speak><p><s>以下是${date}的名言</s><break time="0.25s"/><s>${Quote}</s><break time="0.5s"/><s>出自<break time="0.3s"/>${reference}</s></p></speak>`,
			text: '以下是今日'+date+'的名言：',}));

        conv.close(new BasicCard({   
				image: new Image({url:Picture_url,alt:'Pictures',}),
				title: '『'+Quote+'』',
				subtitle:'──'+reference,
				buttons: new Button({title:'維基百科:'+reference,
								     url: 'https://zh.wikipedia.org/zh-tw/'+reference,}), 
        }));
  
});


exports.daily_quote = functions.https.onRequest(app); 
