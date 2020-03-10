'use strict';

// Import the Dialogflow module from the Actions on Google client library.
const {
  dialogflow,
  Permission,
  Suggestions,
  SimpleResponse,
  Button,
  Image,
  BasicCard,
  LinkOutSuggestion,
  BrowseCarousel,BrowseCarouselItem,items,Table
} = require('actions-on-google');

// Import the firebase-functions package for deployment.
const functions = require('firebase-functions');
var xmorse = require('xmorse');
const replaceString = require('replace-string');

// Instantiate the Dialogflow client.
const app = dialogflow({debug: true});

var name="";
var temperate='';
var example = "加密通訊,密碼,二進制,加密符號,Morse code,數字,文字,翻譯,訊號代碼,排列順序,字母".split(",");
function random_choicer() {return parseInt(Math.random()*10);}
var inital='';
var array='';
var output='';var outputtext='';
var number=0;
var i=1;
app.intent('預設歡迎語句', (conv) => {
	name="SOS";
    
	output=xmorse.encode(name);
	outputtext=output;	
	array=output.split("");
	number=parseInt((array.length)-1);
	output='';

  for(i=0;i<=number;i=i){ 
     if(array[i]==="/"){output=output+'<break time="0.2s"/>';}
     else if(array[i]==="-"){output=output+'<audio src="https://firebasestorage.googleapis.com/v0/b/hank1995991.appspot.com/o/morsecode%E2%94%80.mp3?alt=media"/>';}
     else if(array[i]==="."){output=output+'<audio src="https://firebasestorage.googleapis.com/v0/b/hank1995991.appspot.com/o/morsecode%E2%97%8F.mp3?alt=media"/>';}	 
	  i++;
	  if(typeof array[i]==="undefined"){break;}
	}   
	outputtext=replaceString(outputtext, '/', '  ');
	outputtext=replaceString(outputtext, '.', '•');
    outputtext=replaceString(outputtext, '-', '⁃');

  conv.ask(new SimpleResponse({               
              speech: `<speak><p><s>請輸入任意文字讓我幫你翻譯為摩斯密碼!</s><s>舉例來說，${name}的摩斯密碼為${output}</s></p></speak>`,
              text: '歡迎使用!'}));
   conv.ask(new BasicCard({   
        title: '請輸入任意文字讓我為你翻譯',
		subtitle:'僅供參考使用\n\n輸入範例：'+name+'  \n輸出翻譯：'+outputtext+' ',
        text:'**_[!]輸出對應的摩斯電碼語音可能需要處理時間_**',
  })); 
conv.ask(new Suggestions(example[random_choicer()],'摩斯密碼是甚麼','👋 掰掰'));
});

app.intent('翻譯器', (conv,{input}) => {
	name=input;
    
	output=xmorse.encode(name);
	outputtext=output;	
	array=output.split("");
	number=parseInt((array.length)-1);
	output='';

  for(i=0;i<=number;i=i){ 
     if(array[i]==="/"){output=output+'<break time="0.2s"/>';}
     else if(array[i]==="-"){output=output+'<audio src="https://firebasestorage.googleapis.com/v0/b/hank1995991.appspot.com/o/morsecode%E2%94%80.mp3?alt=media"/>';}
     else if(array[i]==="."){output=output+'<audio src="https://firebasestorage.googleapis.com/v0/b/hank1995991.appspot.com/o/morsecode%E2%97%8F.mp3?alt=media"/>';}	 
	  i++;
	  if(typeof array[i]==="undefined"){break;}
	}   

	outputtext=replaceString(outputtext, '/', ' ');
	outputtext=replaceString(outputtext, '.', '•');
	outputtext=replaceString(outputtext, '-', '⁃');

  conv.ask(new SimpleResponse({               
              speech: `<speak><p><s>翻譯完成，你輸入的<break time="0.15s"/>${input}</s><s>對應的摩斯密碼是${output}</s></p></speak>`,
              text: '翻譯完成!'}));
   conv.ask(new BasicCard({   
        title: name,
		subtitle:outputtext,
        text:'**_[!]輸出對應的摩斯電碼語音可能需要處理時間_**',
  })); 

conv.ask(new Suggestions(example[random_choicer()],'摩斯密碼是甚麼','👋 掰掰'));
});

app.intent('摩斯密碼', (conv) => {
    conv.ask(new SimpleResponse({  
	          speech: `<speak><p><s>摩斯密碼<break time="0.15s"/>是一種時通時斷的訊號代碼，通過不同的排列順序來表達不同的英文字母、數字和標點符號。</s><s>是由美國人艾爾菲德·維爾與薩繆爾·摩斯在1836年發明。</s><s>它是一種早期的數位化通訊形式，但是它不同於現代只使用0和1兩種狀態的二進位代碼，它的代碼包括五種</s></p></speak>`,
              text: '說明如下!'}));

    conv.ask(new BasicCard({   
        title: '摩斯密碼(Morse code)', 
		subtitle:'▪ 發明時間：1836年 \n▪發明者：艾爾菲德·維爾與薩繆爾·摩斯\n▪ 類別：訊號代碼\n▪代碼種類：五種',
        buttons: new Button({title: '維基百科：摩斯電碼',url: 'https://zh.wikipedia.org/wiki/%E6%91%A9%E5%B0%94%E6%96%AF%E7%94%B5%E7%A0%81',}),
  })); 
conv.ask(new Suggestions(example[random_choicer()],'👋 掰掰'));

});


app.intent('結束對話', (conv) => {
    conv.user.storage = {}; //離開同時清除暫存資料
    conv.ask('希望能幫到一點忙!');
    conv.ask(new SimpleResponse({speech: '下次見',text: '下次見 👋',}));
    conv.close(new BasicCard({   
        title: '感謝您的使用!', 
        text:'如果有任何需要改進的地方，  \n歡迎到簡介頁面評分或給予反饋，謝謝!', 
        buttons: new Button({title: '開啟本程式的商店頁面',url: 'https://assistant.google.com/services/a/uid/0000003c8f1151a9',}),
  })); 

});
exports.morsecode_translator = functions.https.onRequest(app); 
