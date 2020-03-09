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
  BrowseCarousel,BrowseCarouselItem,items
} = require('actions-on-google');

// Import the firebase-functions package for deployment.
const functions = require('firebase-functions');
var pinyin = require("pinyin");
var table_library = require('./table_library.json'); //引用外部函數來改為WG拼音
var audio_library = require('./audio_library.json'); //引用外部函數建立英文發音

// Instantiate the Dialogflow client.
const app = dialogflow({debug: true});

var name="";
var temperate='';
var example = "王小明,李大仁,林志玲,蔡依玲,林俊傑,金城武,周杰倫".split(",");
function random_choicer() {return parseInt(Math.random()*6);}
var inital='';
var array='';
var output='';
var outputaudio="";
var number=0;
var i=1;
app.intent('預設歡迎語句', (conv) => {
  name=example[random_choicer()];
  inital=String(pinyin(name, {style: pinyin.STYLE_NORMAL,heteronym: false})); 
  array=inital.split(",");
  number=parseInt(name.length)-1;
  output='';
  outputaudio='';
  
  for(i=0;i<=number;i=i){ 
     if(i===0){output=output+table_library[array[i]]+', ';}
	  else if(i===1&&number===1){output=output+table_library[array[i]];}
      else if(i===1&&number!==1){output=output+table_library[array[i]]+'-';}
      else{output=output+table_library[array[i]]+' ';}
	  i++;
	  if(typeof table_library[array[i]]==="undefined"){break;}
	}   
	
    for(i=0;i<=number;i=i){ 
      outputaudio=outputaudio+audio_library[array[i]]+'<break time="0.15s"/>';
	  i++;
	  if(typeof audio_library[array[i]]==="undefined"){break;}
	}   

  conv.ask(new SimpleResponse({               
              speech: `<speak><p><s>請輸入任意中文讓我幫你翻譯為台灣護照的英文形式。</s><s>舉例來說，${name}的台灣護照英文名稱為${output}。</s></p></speak>`,
              text: '歡迎使用!'}));
   conv.ask(new BasicCard({   
        title: '請輸入任意文字讓我為你翻譯',
		subtitle:'僅供參考使用\n\n輸入範例：'+name+'  \n輸出翻譯：'+output+' ',
        text:'**_[!]以上翻譯依據威妥瑪拼音(WG)_**',
  })); 
conv.ask(new Suggestions(example[random_choicer()],'威瑪拼音是甚麼','👋 掰掰'));
});

app.intent('翻譯器', (conv,{input}) => {
  name=input;
  inital=String(pinyin(name, {style: pinyin.STYLE_NORMAL,heteronym: false})); 
  array=inital.split(",");
  number=parseInt(name.length)-1;
  output='';
  outputaudio='';
  
  for(i=0;i<=number;i=i){ 
     if(i===0){output=output+table_library[array[i]]+', ';}
	  else if(i===1&&number===1){output=output+table_library[array[i]];}
      else if(i===1&&number!==1){output=output+table_library[array[i]]+'-';}
      else{output=output+table_library[array[i]]+' ';}
	  i++;
	  if(typeof table_library[array[i]]==="undefined"){break;}
	}   
  if(output==="undefined,"){output="錯誤";}
  
  for(i=0;i<=number;i=i){ 
      outputaudio=outputaudio+audio_library[array[i]]+'<break time="0.15s"/>';
	  i++;
	  if(typeof audio_library[array[i]]==="undefined"){break;}
	}   

  
  conv.ask(new SimpleResponse({               
              speech: `<speak><p><s>翻譯完成，你輸入的<break time="0.15s"/>${input}</s><s>在護照上的英文名稱是${output}。</s></p></speak>`,
              text: '翻譯完成!'}));
   conv.ask(new BasicCard({   
        title: name,
		subtitle:output,
        text:'**_[!]翻譯依據威妥瑪拼音(WG)，隨意輸入來讓我翻譯_**',
  })); 

conv.ask(new Suggestions(example[random_choicer()],'威瑪拼音是甚麼','👋 掰掰'));
});

app.intent('威瑪拼音', (conv) => {
    conv.ask(new SimpleResponse({  
	          speech: `<speak><p><s>此系統於19世紀中葉時由英國人威妥瑪建立，</s><s>在1892年由翟理斯的漢英字典完成梳理。</s><s>它是20世紀翻譯中文主要的英文音譯系統。</s></p></speak>`,
              text: '說明如下!'}));

    conv.ask(new BasicCard({   
        title: '威妥瑪拼音(WG)', 
		subtitle:'此系統於19世紀中葉時英國人威妥瑪建立，\n在1892年由翟理斯的漢英字典完成梳理。\n它是20世紀翻譯中文主要的英文音譯系統。',
        text:'資料來源:維基百科', 
        buttons: new Button({title: '護照外文姓名拼音對照表',url: 'https://www.boca.gov.tw/cp-2-4226-c0eff-1.html',}),
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
        buttons: new Button({title: '開啟本程式的商店頁面',url: 'https://assistant.google.com/services/a/uid/000000835c0b1f9e',}),
  })); 

});
exports.dialogflowFirebaseFulfillment = functions.https.onRequest(app); 
