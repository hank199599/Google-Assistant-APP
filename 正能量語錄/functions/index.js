'use strict';

// Import the Dialogflow module from the Actions on Google client library.
const {dialogflow,Permission,Suggestions,SimpleResponse,Button,Image,BasicCard,RegisterUpdate,items
} = require('actions-on-google');

// Import the firebase-functions package for deployment.
const functions = require('firebase-functions');

// Instantiate the Dialogflow client.
const app = dialogflow({debug: true});
var positive_quote = require('./positive_quote.json');

var Music='';//背景音樂網址
var theArray=["https://firebasestorage.googleapis.com/v0/b/hank199599.appspot.com/o/Saving_the_World.mp3?alt=media","https://firebasestorage.googleapis.com/v0/b/hank199599.appspot.com/o/Oceans_Rivers_Canyons.mp3?alt=media","https://firebasestorage.googleapis.com/v0/b/hank199599.appspot.com/o/Morning_Dew.mp3?alt=media","https://firebasestorage.googleapis.com/v0/b/hank199599.appspot.com/o/Borderless.mp3?alt=media","https://firebasestorage.googleapis.com/v0/b/hank199599.appspot.com/o/Air_to_the_Throne.mp3?alt=media","https://firebasestorage.googleapis.com/v0/b/hank199599.appspot.com/o/Adrift.mp3?alt=media"];

var T_total=465;//語錄總數
var T_Output='';//語錄內容
var weekdays = "星期日,星期一,星期二,星期三,星期四,星期五,星期六".split(",");
var T="";
var Today="";
var Weeknow="";

function getDay() {
    var today = new Date();
    var nowTime = today.getTime()+8*3600*1000;
    today.setTime(parseInt(nowTime));
    var oMoth = (today.getMonth() + 1).toString();
    var oDay = today.getDate().toString();
	var oWeek=weekdays[today.getDay()];
    return [oMoth + '月'+ oDay+'日',oWeek];
}

//歡迎畫面
app.intent('預設歡迎語句', (conv) => {
	
	Music=theArray[parseInt(Math.random()*5)];//挑選這次的音樂編號
    Today=getDay()[0];
	Weeknow=getDay()[1];
	T=parseInt(Math.random()*T_total);
	T_Output=positive_quote[T];
		
	
 conv.ask(new SimpleResponse({ 
                       speech: `<speak><par><media xml:id="quote" begin="3s" soundLevel="+6dB"><speak><p><s>${T_Output}</s></p></speak></media><media xml:id="sound" repeatCount="1" soundLevel="-6db"><audio src="${Music}"/></media><media begin="sound.end-5s" soundLevel="+6dB"><speak>祝你有個美好的一天!。</speak></media></par></speak>`,
                       text: '今天是'+Today+' '+Weeknow+'  \n祝你有個充滿正能量的一天☀',
     }));
 conv.close(new BasicCard({   
        title: T_Output,
        text:'《第'+(T+1)+'則》',
  })); 

});

// Set the DialogflowApp object to handle the HTTPS POST request.
exports.positive_quote = functions.https.onRequest(app);