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
var output_array="";
var Quote="";
var reference="";
var Picture_url="";var date="";
var theArray= new Array;
theArray=["https://i.imgur.com/02rnSIa.jpg","https://i.imgur.com/VfcMtId.jpg","https://i.imgur.com/PLVkbbK.jpg","https://i.imgur.com/LcEpziD.jpg","https://i.imgur.com/EoCooEB.jpg","https://i.imgur.com/hfLI7eK.jpg","https://i.imgur.com/71beT0V.jpg","https://i.imgur.com/FcfNl1w.jpg","https://i.imgur.com/APcShEp.jpg","https://i.imgur.com/4R8PxKA.jpg","https://i.imgur.com/b5vLpDA.jpg","https://i.imgur.com/faaRLCP.jpg","https://i.imgur.com/pTci1ux.jpg","https://i.imgur.com/lYmqldk.jpg","https://i.imgur.com/2oOhmvs.jpg","https://i.imgur.com/2oOhmvs.jpg"];

function getDay() {
    var today = new Date();
    var nowTime = today.getTime()+8*3600*1000;
    today.setTime(parseInt(nowTime));
    var oMoth = (today.getMonth() + 1).toString();
    var oDay = today.getDate().toString();
    return oMoth + '月'+ oDay+'日';
}


app.intent('預設歡迎語句', (conv) => { 

  date=getDay();
  output_array=picker.selector(date);
  Quote=output_array[0];
  reference=output_array[1];
  
  Picture_url=theArray[parseInt(Math.random()*19)];
  
		conv.ask(new SimpleResponse({               
			speech: `<speak><p><s>以下是${date}的名言</s><break time="0.25s"/><s>${Quote}</s><break time="0.5s"/><s>出自<break time="0.3s"/>${reference}</s></p></speak>`,
			text: '以下是今日'+date+'的名言',}));

        conv.close(new BasicCard({   
				image: new Image({url:Picture_url,alt:'Pictures',}),
				title: '『'+Quote+'』',
				subtitle:'──'+reference,
				buttons: new Button({title:'維基百科:'+reference,
								     url: 'https://zh.wikipedia.org/zh-tw/'+reference,}), 
        }));
  
});


exports.daily_quote = functions.https.onRequest(app); 
