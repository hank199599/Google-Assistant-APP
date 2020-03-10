'use strict';
// Import the Dialogflow module from the Actions on Google client library.
const { Place,dialogflow,Suggestions,SimpleResponse, Button,Image, BasicCard, RegisterUpdate,NewSurface,List,Permission,Confirmation,SignIn
} = require('actions-on-google');

var admin = require('firebase-admin');
const {WebhookClient} = require('dialogflow-fulfillment');

const functions = require('firebase-functions');
const i18n = require('i18n');
//const dialogflow = require('dialogflow');
var geoTz = require('geo-tz');              //取得所在位置時區
var checker = require('./timezone');
const replaceString = require('replace-string');

process.env.DEBUG = 'dialogflow:*'; // enables lib debugging statements

const app = dialogflow({debug: true});

//const app = dialogflow({
  // REPLACE THE PLACEHOLDER WITH THE CLIENT_ID OF YOUR ACTIONS PROJECT
 // clientId: '382026713515-e7reb6vlujbugivlepet0l0j1qie9gq9.apps.googleusercontent.com',
//});

i18n.configure({  
  locales: ['zh-TW','en','en-US','zh-CN','zh-HK'],
  directory: __dirname + '/locales',
  defaultLocale: 'en',
});


var serviceAccount = require("./config/hank199599-firebase-adminsdk-fynga-2d7be42f2e.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://hank199599.firebaseio.com"
});

app.middleware((conv) => {
  i18n.setLocale(conv.user.locale);
});

var picture_url='url';
var time='';  //取得UTC+0標準時間
var timezone = "Asia/Taipei";  //預設的時區為台灣時區
var UTC_Area='';var UTC_State='';
var UTCtime=8;//根據時區要增減的時間(預設的時區為台灣時區)
var hour_now=0; //提供的時間
var output_food=''; //更動輸出的美食發音
var tip=false;//判別是否已經提示
var I_think='';
var icon='';
var number=0;//這次選取的數字
var thistime=0;//儲存這次編號
var lasttime1=0;//儲存這次編號
var lasttime2=0;//儲存這次編號
var lasttime3=0;//儲存這次編號
var lasttime4=0;//儲存這次編號
var lasttime=0;//儲存上次的編號
var output_think ='';//輸出詢問的方式var type ='測試';
var number=0;
var random_number=0;
var chosen='測試'; //宣告選擇的食物
var type ='測試'; //宣告現在推薦的食物類別
var random_number=0;
var output_string='';
var output_answer='';     var chosen_link='';
var choice=0;//處理兩食物之間重複選取問題
var last=0;//處理兩食物之間重複選取問題
var sentense = [i18n.__('Q1'),i18n.__('Q2'),i18n.__('Q3'),i18n.__('Q4'),i18n.__('Q5'),i18n.__('Q6'),i18n.__('Q7'),i18n.__('Q8'),i18n.__('Q9')];
var answer = [i18n.__('A1'),i18n.__('A2'),i18n.__('A3'),i18n.__('A4'),i18n.__('A5'),i18n.__('A6'),i18n.__('A7'),i18n.__('A8'),i18n.__('A9')];

function random_choicer() {return parseInt(Math.random()*8);}

function Breakfast(){    number=parseInt(Math.random()*42);       new Small_picker(); chosen=i18n.__(number);}
function Lunch(){        number=parseInt(43+(Math.random()*47));  new Small_picker(); chosen=i18n.__(number);}
function Afternoon_Tea(){number=parseInt(120+(Math.random()*43)); new Small_picker(); chosen=i18n.__(number);}
function Dinner(){       number=parseInt(43+(Math.random()*47));  new Small_picker(); chosen=i18n.__(number);}
function Late_Night(){   number=parseInt(164+(Math.random()*43)); new Small_picker(); chosen=i18n.__(number);}
function Rice(){         number=parseInt(208+(Math.random()*19)); new Small_picker(); chosen=i18n.__(number);}
function Noodle(){       number=parseInt(228+(Math.random()*20)); new Small_picker(); chosen=i18n.__(number);}

function Small_picker(){
if(number===lasttime4){number++;}
if(number===lasttime3){number++;}
if(number===lasttime2){number++;}
if(number===lasttime1){number++;}
if(number===thistime){number++;}
if(number===lasttime){number++;}

lasttime4=lasttime3;
lasttime3=lasttime2;
lasttime2=lasttime1;
lasttime1=lasttime;
lasttime=thistime;
thistime=number;
}

function Time_suggestion(){
  time = new Date();
hour_now= time.getHours();	
if((hour_now+UTCtime)<0){hour_now=hour_now+UTCtime+24;} else{hour_now=hour_now+UTCtime;} 
hour_now=(hour_now)%24; // 判斷現在時間自動給予建議
     
if(hour_now>=4&&hour_now<=8){      
      new Breakfast();
      type=i18n.__('Breakfast');icon='🌅';
      picture_url='https://imgur.com/zPdcQxi.jpg';
   }else if(hour_now>=9&&hour_now<=10){      
      new Breakfast();
      type=i18n.__('Brunch');icon='🌅';
      picture_url='https://i.imgur.com/hkO9Wd6.jpg';
   }
   else if(hour_now>=11&&hour_now<=13){ 
      new Lunch();
      type=i18n.__('Lunch');icon='☀️';
      picture_url='https://imgur.com/6C1i2Qv.jpg';
   }
   else if(hour_now>=14&&hour_now<=16){
    new Afternoon_Tea();
      type=i18n.__('Afternoon tea');icon='🌇';
      picture_url='https://imgur.com/8grsTJ6.jpg';
    } 
   else if(hour_now>=17&&hour_now<=20){ 
      new Dinner();
      type=i18n.__('Dinner');icon='🌃';
      picture_url='https://imgur.com/XyNHWuE.jpg';
    }
     else{		  
       new Late_Night();
       type=i18n.__('Late-night supper');icon='🌙';
       picture_url='https://imgur.com/Y4eGzDD.jpg';
      }
}

var Earth="🌍 ,🌎 ,🌏 ".split(",");
var eicon="🌍 ";
function IconEarth(){
  eicon=Earth[parseInt(Math.random()*2)];
}

var longitude='';var latitude='';var array='';

app.intent('預設歡迎語句', (conv) => {
 
const hasWebBrowser = conv.surface.capabilities.has('actions.capability.WEB_BROWSER');
answer = [i18n.__('A1'),i18n.__('A2'),i18n.__('A3'),i18n.__('A4'),i18n.__('A5'),i18n.__('A6'),i18n.__('A7'),i18n.__('A8'),i18n.__('A9')];
output_answer= answer[random_choicer()];

UTCtime=conv.user.storage.UTCtime;
timezone=conv.user.storage.timezone;

lasttime1=0;lasttime2=0;lasttime3=0;lasttime4=0;lasttime=0;

if(timezone===undefined){
if(conv.user.locale==='zh-TW'){timezone = "Asia/Taipei";} 
	 else if(conv.user.locale==='en-US'){timezone = "America/New_York";} 
     else if(conv.user.locale==='en-HK'){timezone = "Asia/Hong_Kong";} 
     else if(conv.user.locale==='zh-HK'){timezone = "Asia/Hong_Kong";} 
     else if(conv.user.locale==='zh-MO'){timezone = "Asia/Macau";} 
     else if(conv.user.locale==='en-SG'){timezone = "Etc/GMT-8";} 
     else if(conv.user.locale==='zh-SG'){timezone = "Etc/GMT-8";} 
	 else if(conv.user.locale==='zh-CN'){timezone = "Asia/Shanghai";} 
     else if(conv.user.locale==='en-AU'){timezone = "Australia/Sydney";} 
     else if(conv.user.locale==='en-BZ'){timezone = "America/Belize";} 
     else if(conv.user.locale==='en-CA'){timezone = "America/Toronto";} 
     else if(conv.user.locale==='en-CB'){timezone = "Etc/GMT-4";} 
     else if(conv.user.locale==='en-IE'){timezone = "Europe/Dublin";} 
     else if(conv.user.locale==='en-JM'){timezone = "America/Jamaica";} 
     else if(conv.user.locale==='en-NZ'){timezone = "Pacific/Auckland";} 
     else if(conv.user.locale==='en-PH'){timezone = "Asia/Manila";} 
     else if(conv.user.locale==='en-ZA'){timezone = "Africa/Windhoek";} 
     else if(conv.user.locale==='en-TT'){timezone = "Etc/GMT-4";} 
     else if(conv.user.locale==='en-GB'){timezone = "Europe/London";} 
     else if(conv.user.locale==='en-ZW'){timezone = "Africa/Harare";} 
	 else if(conv.user.locale==='en-IN'){timezone = "Asia/Kolkata";}
	 else if(conv.user.locale==='en-BE'){timezone = "Europe/Brussels";}
	 else{timezone = "Etc/GMT";
		  conv.ask(i18n.__('Default_Location')+timezone+i18n.__('Defalt_Location_Hint'));  }
    
     array=String(timezone).split("/");
     UTC_Area=array[0];UTC_State=array[1];
	 UTCtime=checker.timezonechecker(UTC_Area,UTC_State); //呼叫外面的判斷函示來決策現在時區數值
}

   tip=false; 
   new Time_suggestion();//取得時間判斷
   new IconEarth();
     output_food=chosen;
   if (output_food==='丼飯'){output_food='動飯';}
		else if (output_food==='刈包'){output_food='掛包';}
		else if (output_food==='蚵仔煎'){output_food='鵝阿堅';}
		else if (output_food==='碗粿'){output_food='挖貴';}
		else if (output_food==='米香'){output_food='咪乓';}
		else if (output_food==='吐司'){output_food='土司';}
		else if (output_food==='夾蛋吐司'){output_food='夾蛋土司';}
  
    if (conv.user.last.seen) {conv.ask(new SimpleResponse({               
                      speech: `<speak><p><s>${i18n.__('Return_Talk1')}</s><s>${i18n.__('WELCOME_Talk2',output_food)}</s></p></speak>`,
                       text: i18n.__('WELCOME_Return'),}));
   } else { conv.ask(new SimpleResponse({               
                      speech: `<speak><p><s>${i18n.__('WELCOME_Talk1')}</s><s>${i18n.__('WELCOME_Talk2',output_food)}</s><s>${i18n.__('Return_Talk2')}<break time="0.2s"/>${i18n.__('WELCOME_Talk4')}<break time="0.2s"/>${i18n.__('Return_Talk3')}<break time="0.2s"/>${i18n.__('Return_Talk4')}<break time="0.2s"/>${i18n.__('Return_Talk5')}</s></p></speak>`,
                       text: i18n.__('WELCOME_BASIC'),}));}  

   var chosen_link=chosen;
   
   if( chosen_link==='漢堡'){ chosen_link='漢堡店';}
	  else if( chosen_link==='總匯'){ chosen_link='總匯三明治';}

	  if(type===i18n.__('Brunch')){type=i18n.__('Breakfast');}
	  conv.ask(new Suggestions(icon+i18n.__('Another',type)));
	  
   if(hasWebBrowser) {conv.ask(new BasicCard({   
        image: new Image({url:picture_url,alt:'Pictures',}),
        title: i18n.__('Title1',chosen),
        subtitle: i18n.__('Subtitle1',hour_now,type),
        buttons: new Button({title:i18n.__('SearchMap',chosen),url:'https://www.google.com.tw/maps/search/'+chosen_link+'/15z/data=!4m4!2m3!5m1!2e1!6e5',}), 
        display: 'CROPPED',}));}
   else{
	   conv.ask(new BasicCard({   
        image: new Image({url:picture_url,alt:'Pictures',}),
			title: i18n.__('Title1',chosen),
			subtitle: i18n.__('Subtitle2',hour_now,type),
        display: 'CROPPED',}));
		conv.ask(new Suggestions(output_answer));

		}

    conv.ask(new Suggestions('🤔'+i18n.__('RiceorNoodle'),eicon+i18n.__('ChangeLocaion'),'👋 '+i18n.__('Goodbye')));
	   
   
	conv.user.storage.type=type;
	conv.user.storage.chosen=chosen;
    conv.user.storage.tip=tip;
    conv.user.storage.icon=icon;
    conv.user.storage.thistime=thistime;  
    conv.user.storage.lasttime=lasttime;    
    conv.user.storage.timezone=timezone;
    conv.user.storage.UTCtime=UTCtime;

	});

app.intent('輸出想到的美食', (conv,{input}) => {
type=conv.user.storage.type;
chosen=conv.user.storage.chosen;
icon=conv.user.storage.icon=icon;
tip=conv.user.storage.tip;
thistime=conv.user.storage.thistime;  
lasttime4=conv.user.storage.lasttime4;     
lasttime3=conv.user.storage.lasttime3;     
lasttime2=conv.user.storage.lasttime2;     
lasttime1=conv.user.storage.lasttime1;     
lasttime=conv.user.storage.lasttime;     

 sentense = [i18n.__('Q1'),i18n.__('Q2'),i18n.__('Q3'),i18n.__('Q4'),i18n.__('Q5'),i18n.__('Q6'),i18n.__('Q7'),i18n.__('Q8'),i18n.__('Q9')];
 answer = [i18n.__('A1'),i18n.__('A2'),i18n.__('A3'),i18n.__('A4'),i18n.__('A5'),i18n.__('A6'),i18n.__('A7'),i18n.__('A8'),i18n.__('A9')];


if(input===i18n.__('Breakfast')){type=i18n.__('Breakfast');}
else if(input===i18n.__('Lunch')){type=i18n.__('Lunch');}
else if(input===i18n.__('Afternoon tea')){type=i18n.__('Afternoon tea');}
else if(input===i18n.__('Dinner')){type=i18n.__('Dinner');}
else if(input===i18n.__('Late-night supper')){type=i18n.__('Late-night supper');}
else if(input===i18n.__('Rice')){type=i18n.__('Rice');}
else if(input===i18n.__('Noodle')){type=i18n.__('Noodle');}

if(type===i18n.__('Breakfast')){ new Breakfast();icon='🌅';}
else if(type===i18n.__('Lunch')){ new Lunch();icon='☀️';}
else if(type===i18n.__('Dinner')){ new Dinner();icon='🌃';}
else if(type===i18n.__('Afternoon tea')){ new Afternoon_Tea();icon='🌇';}
else if(type===i18n.__('Late-night supper')){ new Late_Night();icon='🌙';}  
else if(type===i18n.__('Rice')){new Rice();icon='🍚';}
else if(type===i18n.__('Noodle')){new Noodle();icon='🍝';}
  
output_food=chosen;
   if (output_food==='丼飯'){output_food='動飯';}
		else if (output_food==='刈包'){output_food='掛包';}
		else if (output_food==='蚵仔煎'){output_food='鵝阿堅';}
		else if (output_food==='碗粿'){output_food='挖貴';}
		else if (output_food==='米香'){output_food='咪乓';}
		else if (output_food==='吐司'){output_food='土司';}
		else if (output_food==='夾蛋吐司'){output_food='夾蛋土司';}
  
 //隨機挑選尋語句
  random_number= random_choicer();
  output_think = sentense[random_number];
  output_answer= answer[random_number];
  
  output_string= output_think;
  if(output_string==='覺得如何ㄋ'){output_string='覺得如何呢';}
  else if(output_string==='這個如何ㄋ'){output_string='這個如何呢';}
  else if(output_string==='這個不錯八'){output_string='這個不錯吧';}
  
  if(tip===false){   
                  if (conv.user.last.seen) {
                      conv.ask(new SimpleResponse({               
                      speech: `<speak><p><s>${i18n.__('HereComes',output_food)}<break time="0.2s"/>${output_think}?</s></p></speak>`,
                       text: i18n.__('HereComes',chosen)+'\n'+output_string+'?',}));   
                  }
                  else{
                       conv.ask(new SimpleResponse({               
                       speech: `<speak><p><s>${i18n.__('HereComes',output_food)}<break time="0.2s"/>${output_think}?<break time="0.2s"/>${i18n.__('Teach_Talk')}</s></p></speak>`,
                       text: i18n.__('HereComes',chosen)+'\n'+output_string+'?',}));   
                       conv.ask(new BasicCard({    
                       title: i18n.__('TeachTitle',chosen),
                       subtitle:i18n.__('TeachSubTitle',chosen),     
                       text: i18n.__('TeachText',chosen),                                         
                       }));
                  }
                  tip=true;}
  else{conv.ask(new SimpleResponse({               
                      speech: `<speak><p><s>${i18n.__('HereComes',output_food)}<break time="0.2s"/>${output_think}?</s></p></speak>`,
                       text:i18n.__('HereComes',chosen)+'\n'+output_string+'?',}));}
 
 conv.ask(new Suggestions(icon+i18n.__('Another',type),output_answer));

  
conv.user.storage.type=type;
conv.user.storage.chosen=chosen;
conv.user.storage.tip=tip;
conv.user.storage.lasttime4=lasttime4;  
conv.user.storage.lasttime3=lasttime3;     
conv.user.storage.lasttime2=lasttime2;     
conv.user.storage.lasttime1=lasttime1;     
conv.user.storage.lasttime=lasttime;     
conv.user.storage.thistime=thistime;  
conv.user.storage.icon=icon;
});


app.intent('回到預設選單', (conv) => {
type= conv.user.storage.type;
chosen=conv.user.storage.chosen;
icon=conv.user.storage.icon;
thistime=conv.user.storage.thistime;  
lasttime=conv.user.storage.lasttime;   
lasttime4=conv.user.storage.lasttime4;     
lasttime3=conv.user.storage.lasttime3;     
lasttime2=conv.user.storage.lasttime2;     
lasttime1=conv.user.storage.lasttime1;     
UTCtime=conv.user.storage.UTCtime;
timezone=conv.user.storage.timezone;

const hasWebBrowser = conv.surface.capabilities.has('actions.capability.WEB_BROWSER');
answer = [i18n.__('A1'),i18n.__('A2'),i18n.__('A3'),i18n.__('A4'),i18n.__('A5'),i18n.__('A6'),i18n.__('A7'),i18n.__('A8'),i18n.__('A9')];
output_answer= answer[random_choicer()];

if( timezone=== undefined){
     if(conv.user.locale==='zh-TW'){timezone = "Asia/Taipei";} 
	 else if(conv.user.locale==='en-US'){timezone = "America/New_York";} 
     else if(conv.user.locale==='en-HK'){timezone = "Asia/Hong_Kong";} 
     else if(conv.user.locale==='zh-HK'){timezone = "Asia/Hong_Kong";} 
     else if(conv.user.locale==='zh-MO'){timezone = "Asia/Macau";} 
     else if(conv.user.locale==='en-SG'){timezone = "Etc/GMT-8";} 
     else if(conv.user.locale==='zh-SG'){timezone = "Etc/GMT-8";} 
	 else if(conv.user.locale==='zh-CN'){timezone = "Asia/Shanghai";} 
     else if(conv.user.locale==='en-AU'){timezone = "Australia/Sydney";} 
     else if(conv.user.locale==='en-BZ'){timezone = "America/Belize";} 
     else if(conv.user.locale==='en-CA'){timezone = "America/Toronto";} 
     else if(conv.user.locale==='en-CB'){timezone = "Etc/GMT-4";} 
     else if(conv.user.locale==='en-IE'){timezone = "Europe/Dublin";} 
     else if(conv.user.locale==='en-JM'){timezone = "America/Jamaica";} 
     else if(conv.user.locale==='en-NZ'){timezone = "Pacific/Auckland";} 
     else if(conv.user.locale==='en-PH'){timezone = "Asia/Manila";} 
     else if(conv.user.locale==='en-ZA'){timezone = "Africa/Windhoek";} 
     else if(conv.user.locale==='en-TT'){timezone = "Etc/GMT-4";} 
     else if(conv.user.locale==='en-GB'){timezone = "Europe/London";} 
     else if(conv.user.locale==='en-ZW'){timezone = "Africa/Harare";} 
	 else if(conv.user.locale==='en-IN'){timezone = "Asia/Kolkata";}
	 else if(conv.user.locale==='en-BE'){timezone = "Europe/Brussels";}
	 else{timezone = "Etc/GMT";
		  conv.ask(i18n.__('Default_Location')+timezone+i18n.__('Defalt_Location_Hint'));  }
		  
     array=String(timezone).split("/");
     UTC_Area=array[0];UTC_State=array[1];
	 UTCtime=checker.timezonechecker(UTC_Area,UTC_State); //呼叫外面的判斷函示來決策現在時區數值
}

	  new Time_suggestion();   new IconEarth();
      chosen_link=chosen;
      if (output_food==='丼飯'){output_food='動飯';}
      else if (output_food==='刈包'){output_food='掛包';}
      else if (output_food==='蚵仔煎'){output_food='鵝阿堅';}
      else if (output_food==='碗粿'){output_food='挖貴';}
      else if (output_food==='米香'){output_food='咪乓';}
      else if (output_food==='吐司'){output_food='土司';}

	  if( chosen_link==='漢堡'){ chosen_link='漢堡店';}
	  else if( chosen_link==='總匯'){ chosen_link='總匯三明治';}

conv.ask(new SimpleResponse({speech:`<speak><p><s>${i18n.__('DefaultTalk','<break time="0.15s"/>',type)}</s></p></speak>`,text:i18n.__('DefaultText')}));
conv.ask(new BasicCard({   
        image: new Image({url:picture_url,alt:'Pictures',}),
        title: i18n.__('Title1',chosen),
        subtitle: i18n.__('Subtitle2',hour_now,type),
        buttons: new Button({title:i18n.__('SearchMap',chosen),url:'https://www.google.com.tw/maps/search/'+chosen_link+'/15z/data=!4m4!2m3!5m1!2e1!6e5',}), 
        display: 'CROPPED',}));					   
if(type===i18n.__('Brunch')){type=i18n.__('Breakfast');}

conv.ask(new Suggestions(icon+i18n.__('Another',type)));
if(hasWebBrowser===false){conv.ask(new Suggestions(output_answer));}
conv.ask(new Suggestions('🤔'+i18n.__('RiceorNoodle'),eicon+i18n.__('ChangeLocaion'),'👋 '+i18n.__('Goodbye')));
   
conv.user.storage.type=type;
conv.user.storage.chosen=chosen;
conv.user.storage.tip=tip;
conv.user.storage.thistime=thistime;  
conv.user.storage.lasttime4=lasttime4;  
conv.user.storage.lasttime3=lasttime3;     
conv.user.storage.lasttime2=lasttime2;     
conv.user.storage.lasttime1=lasttime1;     
conv.user.storage.lasttime=lasttime;   
conv.user.storage.icon=icon;
});


app.intent('預設罐頭回覆', (conv) => {
type= conv.user.storage.type;
chosen=conv.user.storage.chosen;
icon=conv.user.storage.icon;
timezone=conv.data.timezone;

new IconEarth();
if(conv.input.type==="VOICE"){  //如果輸入是語音，則顯示錯誤處理方法

conv.ask(new SimpleResponse({speech:`<speak><p><s>${i18n.__('Falltack','<break time="0.15s"/>',type)}</s></p></speak>`,text:i18n.__('Falloutput')}));
conv.ask(new BasicCard({    
                       title: i18n.__('TeachTitle',chosen),
                       subtitle:i18n.__('TeachSubTitle',chosen),     
                       text: i18n.__('TeachText',timezone),                                         
}));}
else{
	conv.ask(i18n.__('Falloutput'));
}
if(type===i18n.__('Brunch')){type=i18n.__('Breakfast');}

conv.ask(new Suggestions(icon+i18n.__('Another',type),'🤔'+i18n.__('RiceorNoodle'),eicon+i18n.__('ChangeLocaion'),'👋 '+i18n.__('Goodbye')));
   
conv.user.storage.type=type;
conv.user.storage.chosen=chosen;
conv.user.storage.tip=tip;
conv.user.storage.icon=icon;
});

app.intent('Google地圖查詢', (conv,{food}) => {
type=conv.user.storage.type;
chosen=conv.user.storage.chosen;
icon=conv.user.storage.icon;
tip=conv.user.storage.tip;
  
  if(food!==''){chosen=food;}
    else{chosen=conv.user.storage.chosen;}
  
  const context = i18n.__('NewSerface_Context');
  const notification = i18n.__('NewSerface_notifi',chosen);
  const capabilities = ['actions.capability.SCREEN_OUTPUT'];
  
  
  const screenAvailable = conv.available.surfaces.capabilities.has('actions.capability.SCREEN_OUTPUT');//檢測其他對話裝置是否有螢幕
  const WebBrowserAvailable = conv.available.surfaces.capabilities.has('actions.capability.WEB_BROWSER');//檢測其他對話裝置是否有瀏覽器
  const hasWebBrowser = conv.surface.capabilities.has('actions.capability.WEB_BROWSER');
 
   var chosen_link=chosen;
   output_food=chosen;
   if (output_food==='丼飯'){output_food='動飯';}
		else if (output_food==='刈包'){output_food='掛包';}
		else if (output_food==='蚵仔煎'){output_food='鵝阿堅';}
		else if (output_food==='碗粿'){output_food='挖貴';}
		else if (output_food==='米香'){output_food='咪乓';}
		else if (output_food==='吐司'){output_food='土司';}
		else if (output_food==='夾蛋吐司'){output_food='夾蛋土司';}
   if( chosen_link==='漢堡'){ chosen_link='漢堡店';}
		else if( chosen_link==='總匯'){ chosen_link='總匯三明治';}
  
   if (conv.screen&&hasWebBrowser) {
     conv.ask(new SimpleResponse({speech:`<speak><p><s>${i18n.__('Maptalk1','<break time="0.2s"/>')}${output_food}${i18n.__('Maptalk2','<break time="0.2s"/>')}</s></p></speak>`,text:i18n.__('MaptOutput',chosen)}));
     conv.close(new BasicCard({    
        title: i18n.__('Results'),
        subtitle:type+'/'+chosen,     
        text: i18n.__('SearchContext'),                                         
        buttons: new Button({title:i18n.__('SearchMap',chosen),url:'https://www.google.com.tw/maps/search/'+chosen_link+'/15z/data=!4m4!2m3!5m1!2e1!6e5',}), 
     }));
     //conv.ask(new Suggestions(i18n.__('Menu'),icon+i18n.__('Another',type),'👋 '+i18n.__('Goodbye')));
   }
   else if (screenAvailable&&WebBrowserAvailable) {
     conv.ask(new NewSurface({context, notification, capabilities}));
  } else {
     conv.ask(new SimpleResponse({speech:`<speak><p><s>${i18n.__('MapChoice','<break time="0.2s"/>',chosen)}</s></p></speak>`,text:i18n.__('MapChoice','',chosen)}));
     conv.close(new BasicCard({    
        title: chosen,
        subtitle:i18n.__('Results1',type)+'\n'+i18n.__('SearchContext1'),                                              
     }));
  }
 
 conv.user.storage.type=type;
 conv.user.storage.chosen=chosen;
 conv.user.storage.tip=tip;
 conv.user.storage.thistime=thistime;  
 conv.user.storage.lasttime=lasttime;    
 conv.user.storage.icon=icon;
});

app.intent('在新裝置上進行對話', (conv,newSurface) => {
type=conv.user.storage.type;
chosen=conv.user.storage.chosen;
icon=conv.user.storage.icon;
tip=conv.user.storage.tip;
conv.user.storage.thistime=thistime;  
conv.user.storage.lasttime=lasttime;   
lasttime4=conv.user.storage.lasttime4;     
lasttime3=conv.user.storage.lasttime3;     
lasttime2=conv.user.storage.lasttime2;     
lasttime1=conv.user.storage.lasttime1;     
  if (conv.arguments.get('NEW_SURFACE').status === 'OK') {
      chosen_link=chosen;
      
	  if(conv.user.locale==="zh-HK"||conv.user.locale!=="zh-TW"){
		type=replaceString(type, 'Breakfast', '早餐'); 
 		type=replaceString(type, 'Brunch', '早午餐'); 
		type=replaceString(type, 'Lunch', '午餐'); 
		type=replaceString(type, 'Dinner', '晚餐'); 
		type=replaceString(type, 'Afternoon tea', '下午茶'); 
		type=replaceString(type, 'Late-night supper', '霄夜'); 
	  }
	  
	  if (output_food==='丼飯'){output_food='動飯';}
		else if (output_food==='刈包'){output_food='掛包';}
		else if (output_food==='蚵仔煎'){output_food='鵝阿堅';}
		else if (output_food==='碗粿'){output_food='挖貴';}
		else if (output_food==='米香'){output_food='咪乓';}
		else if (output_food==='吐司'){output_food='土司';}
		else if (output_food==='夾蛋吐司'){output_food='夾蛋土司';}

		if( chosen_link==='漢堡'){ chosen_link='漢堡店';}
		else if( chosen_link==='總匯'){ chosen_link='總匯三明治';}

     conv.ask(new SimpleResponse({speech:`<speak><p><s>${i18n.__('Maptalk1','<break time="0.2s"/>')}${output_food}${i18n.__('Maptalk2','<break time="0.2s"/>')}</s></p></speak>`,text:i18n.__('MaptOutput',chosen)}));
		conv.close(new BasicCard({    
        title: i18n.__('Results'),
        subtitle:type+'/'+chosen,     
        text: i18n.__('SearchContext'),                                         
        buttons: new Button({title:i18n.__('SearchMap',chosen),url:'https://www.google.com.tw/maps/search/'+chosen_link+'/15z/data=!4m4!2m3!5m1!2e1!6e5',}), 
     }));
  } else {
     conv.ask(new SimpleResponse({speech:`<speak><p><s>${i18n.__('MapChoice','<break time="0.2s"/>',chosen)}</s></p></speak>`,text:i18n.__('MapChoice',' ',chosen)}));
     conv.close(new BasicCard({    
        title: chosen,
        subtitle:i18n.__('Results1',type),     
        text: i18n.__('SearchContext1'),                                         
     }));
  }
 conv.user.storage.type=type;
 conv.user.storage.chosen=chosen;
 conv.user.storage.tip=tip;
 conv.user.storage.thistime=thistime;  
 conv.user.storage.lasttime=lasttime;    
conv.user.storage.thistime=thistime;  
conv.user.storage.lasttime=lasttime;    
conv.user.storage.lasttime4=lasttime4;  
conv.user.storage.lasttime3=lasttime3;     
conv.user.storage.lasttime2=lasttime2;     
conv.user.storage.lasttime1=lasttime1;     
 conv.user.storage.icon=icon;  
});

app.intent('麵或飯', (conv) => {
last=conv.user.storage.last;

choice=parseInt(Math.random()*1);
if(last===choice){choice++;choice=choice%2;}
last=choice;

if(choice===0){type=i18n.__('Rice');I_think=i18n.__('I_think_1');icon='🍚';}
if(choice===1){type=i18n.__('Noodle');I_think=i18n.__('I_think_2');icon='🍝';}

conv.ask(new SimpleResponse({speech:`<speak><par><media soundLevel="+2dB"><speak><p><s>${i18n.__('think',I_think)}</s><s>${i18n.__('Return_Talk2')}<break time="0.1s"/>${i18n.__('Help_with',I_think)}<break time="0.1s"/>${i18n.__('Help_with_hint',I_think)}</s></p></speak></media></par></speak>`,text:i18n.__('think',I_think)}));
conv.ask(new BasicCard({   
        title: i18n.__('TeachTitle'),
        subtitle:i18n.__('Hintsubtitle'),     
        text: i18n.__('Hinttext'), 
        }));
  conv.ask(new Suggestions(i18n.__('Help_suggest',I_think),i18n.__('Menu')));
  tip=false; 
  conv.user.storage.type=type;
  conv.user.storage.chosen=chosen;
  conv.user.storage.last=last;
  conv.user.storage.tip=tip;
});

	const PraseContexts = {
	  parameter: 'sendback_premission',
	}	


app.intent('取得地點權限', (conv) => {

 conv.contexts.set(PraseContexts.parameter, 1);
 conv.data.requestedPermission = 'DEVICE_PRECISE_LOCATION';

    return conv.ask(new Permission({
    context: i18n.__('Location'),
    permissions: conv.data.requestedPermission,}));

conv.ask(new Permission(options));

  
  
});

var sign='';//增加UTC時間的前綴符號 
var minute='' //增加分鐘的前綴符號
var userId='';
app.intent('回傳資訊', (conv, params, permissionGranted)=> {
    if (permissionGranted) {
        const {
            requestedPermission
        } = conv.data;
		
        if (requestedPermission === 'DEVICE_PRECISE_LOCATION') {
 
            const coordinates = conv.device.location.coordinates;
            // const city=conv.device.location.city;
            if (coordinates) {
				time = new Date();
				timezone=geoTz(String(coordinates.latitude),String(coordinates.longitude));
				array=String(timezone).split("/");
                UTC_Area=array[0];UTC_State=array[1];
                UTCtime=checker.timezonechecker(UTC_Area,UTC_State); //呼叫外面的判斷函示來決策現在時區數值
				hour_now= time.getHours();	
				userId =  conv.user.id;
			    UTC_State=replaceString(UTC_State, '_', ' '); //消除輸入字串中的空格

				if(parseInt(time.getUTCMinutes())<=9){minute='0';}else{minute='';}
				
                if((hour_now+UTCtime)<0){hour_now=hour_now+UTCtime+24;} else{hour_now=hour_now+UTCtime;}    
				
				conv.ask(new SimpleResponse({speech:i18n.__('LocationOutput',String(UTC_Area+' '+UTC_State),hour_now%24,time.getUTCMinutes()),text:i18n.__('Locationshow')}));                 
				
				if(UTCtime>=0){sign='+';}else{sign='';}
				conv.ask(new BasicCard({   
                title:String(UTC_Area)+'/'+String(UTC_State),
				subtitle:i18n.__('LocationSubTitle')+sign+UTCtime+i18n.__('Localtime')+(hour_now%24)+':'+minute+(time.getUTCMinutes()),
                text:i18n.__('LocationText'),   
                 }));	
             	
			  function writeUserData(userId, UTCtime, timezone) {
 			    firebase.database().ref('user/' + userId).set({
			    UTCtime: UTCtime,
 	            timezone: timezone,
 			 });
			}
			
			new Time_suggestion();
	      conv.ask(new Suggestions(icon+i18n.__('Another',type)));
           			
		  } else {
                // Note: Currently, precise locaton only returns lat/lng coordinates on phones and lat/lng coordinates
                // and a geocoded address on voice-activated speakers.
                // Coarse location only works on voice-activated speakers.
                 conv.ask(i18n.__('LocationMiss'));
            }
 
        }
    } else {
         conv.ask(i18n.__('LocationDeny'));
    }
	conv.ask(new Suggestions(i18n.__('Menu')));
   conv.user.storage.UTCtime=UTCtime;
   conv.user.storage.timezone=String(timezone);
   
});


app.intent('結束對話', (conv) => {
    conv.ask(new SimpleResponse({speech:i18n.__('EndTalk'),text:i18n.__('EndTalk')+'👋',}));
    conv.close(new BasicCard({   
        title: i18n.__('EndTitle'),
        text:  i18n.__('EndText'),   
        buttons: new Button({title: i18n.__('EndButton'),url: 'https://assistant.google.com/services/a/uid/00000058f29109ab',}),
  }));
  
});
exports.demoAction = functions.https.onRequest(app);