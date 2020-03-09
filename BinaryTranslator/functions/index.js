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
var binstring = require('binstring');
const replaceString = require('replace-string');

// Instantiate the Dialogflow client.
const app = dialogflow({debug: true});

var name="";
var temperate='';
var example = "電腦,二十一世紀,網路世代,人工智慧,大數據,發大財,鄉民".split(",");
function random_choicer() {return parseInt(Math.random()*6);}
var inital='';
var array='';
var output_2='';var output_16='';var output_10='';
var talk_2='';
var number=0;
var i=1;

app.intent('預設歡迎語句', (conv) => {
  name=example[random_choicer()];
  inital=String(binstring(name, { out:'bytes' })); 
  array=inital.split(",");
  number=parseInt(name.length);
  output_2='';  output_16=''; output_10=''; 
  
  for(i=0;i<=number;i=i){ 
      output_2=output_2+parseInt(array[i]).toString(2);
	  i++;
	  if(typeof array[i]==="undefined"){break;}
	  output_2=output_2+' ';
	}   
  for(i=0;i<=number;i=i){ 
      output_16=output_16+parseInt(array[i]).toString(16)+' ';
	  i++;
	  if(typeof array[i]==="undefined"){break;}
	}   
  for(i=0;i<=number;i=i){ 
      output_10=output_10+parseInt(array[i]).toString(10)+' ';
	  i++;
	  if(typeof array[i]==="undefined"){break;}
	}   
  talk_2=output_2;
  talk_2=replaceString(talk_2, ' ', '</say-as><break time="0.2s"/><say-as interpret-as="characters">'); //取代字串中的空格

  conv.ask(new SimpleResponse({               
              speech: `<speak><p><s>歡迎使用，你可以輸入任意中文讓我來為你翻譯。</s><s>舉例來說，${name}在二進制的表示法是<say-as interpret-as="characters">${talk_2}</say-as></s></p></speak>`,
              text: '請輸入任意中文讓我為你翻譯!'}));

  conv.ask(new Table({
  title: name,
  columns: [
    {
      header: '進制',
      align: 'CENTER',
    },
    {
      header: '輸出',
      align: 'CENTER',
    },
  ],
  rows: [
    {
      cells: ['二', output_2],
      dividerAfter: true,
    },
    {
      cells: ['十六',output_16],
      dividerAfter: true,
    },
    {
      cells: ['十', output_10],
    },
  ],
  }));
conv.ask(new Suggestions(example[random_choicer()],'二進制是甚麼','👋 掰掰'));
});

app.intent('翻譯器', (conv,{input}) => {
  name=input;
  inital=String(binstring(name, { out:'bytes' })); 
  array=inital.split(",");
  number=parseInt(name.length);
  output_2='';  output_16=''; output_10=''; 
  
  for(i=0;i<=number;i=i){ 
      output_2=output_2+parseInt(array[i]).toString(2)
	  i++;
	  if(typeof array[i]==="undefined"){break;}
	  output_2=output_2+' ';
	}   
  for(i=0;i<=number;i=i){ 
      output_16=output_16+parseInt(array[i]).toString(16)+' ';
	  i++;
	  if(typeof array[i]==="undefined"){break;}
	}   
  for(i=0;i<=number;i=i){ 
      output_10=output_10+parseInt(array[i]).toString(10)+' ';
	  i++;
	  if(typeof array[i]==="undefined"){break;}
	}   
  talk_2=output_2;
  talk_2=replaceString(talk_2, ' ', '</say-as><break time="0.2s"/><say-as interpret-as="characters">'); //取代字串中的空格

  conv.ask(new SimpleResponse({               
              speech: `<speak><p><s>翻譯完成，你輸入的<break time="0.15s"/>${input}</s><s>在二進制的表示法是<say-as interpret-as="characters">${talk_2}</say-as></s></p></speak>`,
              text: '翻譯完成!'})); 
  conv.ask(new Table({
  title: name,
  columns: [
    {
      header: '進制',
      align: 'CENTER',
    },
    {
      header: '輸出',
      align: 'CENTER',
    },
  ],
  rows: [
    {
      cells: ['二', output_2],
      dividerAfter: true,
    },
    {
      cells: ['十六',output_16],
      dividerAfter: true,
    },
    {
      cells: ['十', output_10],
    },
  ],
  }))

conv.ask(new Suggestions(example[random_choicer()],'二進制是甚麼','👋 掰掰'));
});

app.intent('二進制', (conv) => {
    conv.ask(new SimpleResponse({  
	          speech: `<speak><p><s>二進制，在數學和數位電路中，是指以2為基數代表的記數系統，</s><s>在人類歷史上，最早出現於：古埃及、古中國和古印度</s><s>現代電腦和依賴電腦的裝置裡都用到二進制來傳遞、儲存資訊。</s></p></speak>`,
              text: '說明如下!'}));

    conv.ask(new BasicCard({   
        title: '二進制(Binary)', 
		subtitle:'◎定義：以2為基數代表的記數系統\n◎理論：數學和數位電路。\n◎應用：現代電腦\n◎稱號：位元（Bit,Binary digit）\n◎最早出現於：古埃及、古代中國和古印度',
        buttons: new Button({title:'維基百科:二進制',url:'https://zh.wikipedia.org/wiki/%E4%BA%8C%E8%BF%9B%E5%88%B6',}), 
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
        buttons: new Button({title: '開啟本程式的商店頁面',url: 'https://assistant.google.com/services/a/uid/000000974738914a',}),
  })); 

});
exports.dialogflowFirebaseFulfillment = functions.https.onRequest(app); 
