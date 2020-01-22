'use strict';

// Import the Dialogflow module from the Actions on Google client library.
const { dialogflow,Suggestions,SimpleResponse, Button,Image, BasicCard, RegisterUpdate,NewSurface,List
} = require('actions-on-google');

const functions = require('firebase-functions');
const admin = require('firebase-admin');
const {WebhookClient} = require('dialogflow-fulfillment');

process.env.DEBUG = 'dialogflow:*'; // enables lib debugging statements
admin.initializeApp(functions.config().firebase);
const db = admin.firestore();

// Instantiate the Dialogflow client.
const app = dialogflow({debug: true});

//全域變數
var chosen='測試'; //宣告選擇的食物
var type ='測試'; //宣告現在推薦的食物類別

var picture_url='url';
var time = new Date();
var hour_now=(time.getHours()+8)%24; // 判斷現在時間自動給予建議
var output_food=''; //更動輸出的美食發音
var tip=false;//判別是否已經提示
var I_think='';
var icon='';
var number=0;//這次選取的數字
var thistime=0;//儲存這次編號
var lasttime=0;//儲存上次的編號
var output_think ='';//輸出詢問的方式
var sentense = "覺得如何ㄋ,這個如何ㄋ,感覺怎樣,意下如何,這個如何,覺得好嗎,這個不錯八,覺得OK嗎,這個怎樣".split(",");
var answer = "我覺得可以,好啊,感覺可以,可以,好啊,覺得不錯,感覺不錯,OK,可以啊".split(",");
function random_choicer() {return parseInt(Math.random()*8);}
var random_number=0;
var output_string='';
var output_answer='';

function ranFun(){return parseInt(Math.random()*7);} //隨機快速建議直選

var theArray=new Array([]);
function Breakfast(){
          theArray[0]="饅頭";theArray[1]="蛋餅";theArray[2]="吐司";theArray[3]="總匯";theArray[4]="漢堡";theArray[5]="炒麵";theArray[6]="煎餃";theArray[7]="三明治";theArray[8]="刈包";theArray[9]="沙拉";
          theArray[10]="飯糰";theArray[11]="麵包";theArray[12]="油條";theArray[13]="包子";theArray[14]="蘿蔔糕";theArray[15]="夾蛋吐司";theArray[16]="鬆餅";theArray[17]="優格";theArray[18]="乾麵";theArray[19]="燒餅";
          theArray[20]="燒餅";theArray[21]="水餃";theArray[22]="鍋貼";theArray[23]="筒仔米糕";theArray[24]="肉粽";theArray[25]="歐姆雷";theArray[26]="早午餐";theArray[27]="米糕";theArray[28]="碗粿";theArray[29]="厚片";  
          theArray[30]="蛋";theArray[31]="饅頭";theArray[32]="熱狗捲";theArray[33]="粥";theArray[34]="帕尼尼";theArray[35]="貝果";theArray[36]="米堡";theArray[37]="捲餅";theArray[38]="排骨湯";theArray[39]="燕麥片";
          theArray[40]="餡餅";theArray[41]="薯條";theArray[42]="三明治";
          function ranFun(){return parseInt(Math.random()*42);}
		  number=ranFun();
		  new Small_picker();
          chosen=theArray[number];
		  
		  }
		  
function Lunch(){
          theArray[0]="饅頭";theArray[1]="蛋餅";theArray[2]="吐司";theArray[3]="總匯";theArray[4]="漢堡";theArray[5]="炒麵";theArray[6]="煎餃";theArray[7]="三明治";theArray[8]="刈包";theArray[9]="沙拉";
          theArray[10]="飯糰";theArray[11]="麵包";theArray[12]="油條";theArray[13]="包子";theArray[14]="蘿蔔糕";theArray[15]="夾蛋吐司";theArray[16]="丼飯";theArray[17]="優格";theArray[18]="乾麵";theArray[19]="迴轉壽司";
          theArray[20]="燒餅";theArray[21]="水餃";theArray[22]="鍋貼";theArray[23]="筒仔米糕";theArray[24]="肉粽";theArray[25]="歐姆雷";theArray[26]="早午餐";theArray[27]="米糕";theArray[28]="碗粿";theArray[29]="炸醬麵"; 
          theArray[30]="蛋";theArray[31]="自助餐";theArray[32]="熱狗捲";theArray[33]="粥";theArray[34]="帕尼尼";theArray[35]="貝果";theArray[36]="米堡";theArray[37]="捲餅";theArray[38]="厚片";theArray[39]="燒餅";
          theArray[40]="炒飯";theArray[41]="關東煮";theArray[42]="輕食";theArray[43]="泡麵";theArray[44]="日式料理";theArray[45]="炒麵";theArray[46]="快炒";theArray[47]="排骨飯";theArray[48]="鍋貼";theArray[49]="軟骨飯";
          theArray[50]="燴飯";theArray[51]="稀飯";theArray[52]="麻醬麵";theArray[53]="擔仔麵";theArray[54]="米粉";theArray[55]="泰式料理";theArray[56]="便當";theArray[57]="魚排飯";theArray[58]="鹹蛋瘦肉粥";theArray[59]="油飯";
          theArray[50]="便當";theArray[51]="陽春麵";theArray[62]="鍋貼";theArray[63]="越式料理";theArray[64]="肉粽";theArray[65]="烤雞";theArray[66]="火雞肉飯";theArray[67]="小籠包";theArray[68]="披薩";theArray[69]="簡餐"; 
          theArray[70]="飯糰";theArray[71]="牛肉麵";theArray[72]="熱狗捲";theArray[73]="美式料理";theArray[74]="帕帕尼";theArray[75]="拼盤";theArray[76]="滷肉飯";theArray[77]="炸菜肉絲麵";theArray[78]="雞腿飯";theArray[79]="焗烤";
          theArray[80]="速食店";theArray[81]="排骨湯";theArray[82]="餡餅"; theArray[83]="薯條";theArray[84]="麥當勞";theArray[85]="肯德基";theArray[86]="摩斯漢堡";theArray[87]="排骨湯";theArray[88]="甕仔雞";
          function ranFun(){return parseInt(Math.random()*88);}
          number=ranFun();
		  new Small_picker();
          chosen=theArray[number];}
function Dinner(){
          theArray[0]="鹹水雞";theArray[1]="夜市";theArray[2]="吐司";theArray[3]="鐵板燒";theArray[4]="漢堡";theArray[5]="炒麵";theArray[6]="煎餃";theArray[7]="三明治";theArray[8]="刈包";theArray[9]="沙拉";
          theArray[10]="飯糰";theArray[11]="麵包";theArray[12]="燒烤";theArray[13]="包子";theArray[14]="蘿蔔糕";theArray[15]="懷石料理";theArray[16]="丼飯";theArray[17]="優格";theArray[18]="乾麵";theArray[19]="迴轉壽司";
          theArray[20]="燒餅";theArray[21]="水餃";theArray[22]="鍋貼";theArray[23]="筒仔米糕";theArray[24]="肉粽";theArray[25]="總匯";theArray[26]="烏龍麵";theArray[27]="米糕";theArray[28]="碗粿";theArray[29]="燒餅"; 
          theArray[30]="牛排";theArray[31]="饅頭";theArray[32]="火鍋";theArray[33]="粥";theArray[34]="帕帕尼";theArray[35]="貝果";theArray[36]="米堡";theArray[37]="捲餅";theArray[38]="厚片";theArray[39]="咖哩飯";
          theArray[40]="炒飯";theArray[41]="關東煮";theArray[42]="輕食";theArray[43]="韓式料理";theArray[44]="日式料理";theArray[45]="炒麵";theArray[46]="快炒";theArray[47]="排骨飯";theArray[48]="鍋貼";theArray[49]="軟骨飯";
          theArray[50]="燴飯";theArray[51]="皮蛋瘦肉粥";theArray[52]="泡飯";theArray[53]="泰式料理";theArray[54]="米粉";theArray[55]="泰式料理";theArray[56]="便當";theArray[57]="魚排飯";theArray[58]="越南料理";theArray[59]="油飯";
          theArray[50]="便當";theArray[51]="陽春麵";theArray[62]="小籠包";theArray[63]="越式料理";theArray[64]="香菇肉羹麵";theArray[65]="烤雞";theArray[66]="火雞肉飯";theArray[67]="蒸餃";theArray[68]="披薩";theArray[69]="簡餐";
          theArray[70]="飯糰";theArray[71]="牛肉麵";theArray[72]="熱狗捲";theArray[73]="美式料理";theArray[74]="臭豆腐";theArray[75]="拼盤";theArray[76]="滷肉飯";theArray[77]="炸菜肉絲麵";theArray[78]="雞腿飯";theArray[79]="焗烤";		  
          theArray[80]="排骨湯";theArray[81]="排骨湯";theArray[82]="餡餅";theArray[83]="薯條";theArray[84]="麥當勞";theArray[85]="肯德基";theArray[86]="摩斯漢堡";theArray[87]="速食店";theArray[88]="法國料理";theArray[89]="英國料理";
          theArray[90]="墨西哥料理";theArray[91]="港式料理";theArray[92]="加拿大料理";theArray[93]="緬甸料理";theArray[94]="蒙古料理";theArray[95]="蒙古烤肉";theArray[96]="拉麵";theArray[97]="自助餐";theArray[98]="蚵仔煎";theArray[99]="義大利餐廳";
          theArray[100]="甕仔雞";
          function ranFun(){return parseInt(Math.random()*100);}
          number=ranFun();
		  new Small_picker();
          chosen=theArray[number];}
function Afternoon_Tea() {
          theArray[0]="咖啡廳";theArray[1]="皮麵糊";theArray[2]="豆花";theArray[3]="紅豆餅";theArray[4]="雞蛋糕";theArray[5]="地瓜酥";theArray[6]="煎餃";theArray[7]="三明治";theArray[8]="刈包";theArray[9]="沙拉";
          theArray[10]="飯糰";theArray[11]="麵包";theArray[12]="雪花冰";theArray[13]="包子";theArray[14]="蘿蔔糕";theArray[15]="叉燒酥";theArray[16]="核桃酥";theArray[17]="芋頭酥";theArray[18]="紅豆湯";theArray[19]="蛋黃酥";
          theArray[20]="燒餅";theArray[21]="水餃";theArray[22]="鍋貼";theArray[23]="筒仔米糕";theArray[24]="肉粽";theArray[25]="芋圓";theArray[26]="仙草";theArray[27]="元寶酥";theArray[28]="碗粿";theArray[29]="燒餅";
          theArray[30]="港式蘿蔔糕";theArray[31]="蘿蔔絲餅";theArray[32]="糕仔餅";theArray[33]="銅鑼燒";theArray[34]="千層糕";theArray[35]="黑糖糕";theArray[36]="米堡";theArray[37]="捲餅";theArray[38]="蔥油餅";theArray[39]="發糕";
          theArray[40]="湯圓";theArray[41]="鳳梨酥";theArray[42]="排骨湯";theArray[43]="小窩頭";  
          function ranFun(){return parseInt(Math.random()*43);}
          number=ranFun();
		  new Small_picker();
          chosen=theArray[number];}
function Late_Night(){
          theArray[0]="夜市";theArray[1]="黑巧克力";theArray[2]="吐司";theArray[3]="水餃";theArray[4]="榖物粥";theArray[5]="地瓜酥";theArray[6]="煎餃";theArray[7]="三明治";theArray[8]="堅果";theArray[9]="沙拉";
          theArray[10]="鹽酥雞";theArray[11]="麵包";theArray[12]="燒烤";theArray[13]="榖物片";theArray[14]="蘿蔔糕";theArray[15]="叉燒酥";theArray[16]="烤地瓜";theArray[17]="芋頭酥";theArray[18]="乾麵";theArray[19]="蛋黃酥";
          theArray[20]="炸雞排";theArray[21]="烤肉串";theArray[22]="鍋貼";theArray[23]="筒仔米糕";theArray[24]="肉粽";theArray[25]="米果";theArray[26]="米香";theArray[27]="黑木耳飲";theArray[28]="碗粿";theArray[29]="燒餅";
          theArray[30]="快炒店";theArray[31]="蘿蔔絲餅";theArray[32]="無糖優格";theArray[33]="發糕";theArray[34]="糙米粥";theArray[35]="黑糖糕";theArray[36]="米堡";theArray[37]="捲餅";theArray[38]="蔥油餅";theArray[39]="洋芋片";
          theArray[40]="薯條";theArray[41]="鳳梨酥";theArray[42]="天然水果乾";theArray[43]="肉乾";  
          function ranFun(){return parseInt(Math.random()*43);}
          number=ranFun();
		  new Small_picker();
          chosen=theArray[number];
          }

function Rice(){
		 theArray[0]="炒飯";theArray[1]="燴飯";theArray[2]="火雞肉飯";theArray[3]="燒肉飯";theArray[4]="泡飯";theArray[5]="燉飯";theArray[6]="蓋飯";theArray[7]="滷肉飯";
		 theArray[8]="油飯";theArray[9]="軟骨飯";theArray[10]="雞腿飯";theArray[11]="丼飯";theArray[12]="便當";theArray[13]="咖哩飯";theArray[14]="雞排飯";theArray[15]="魚排飯";
		 theArray[16]="五穀飯"; theArray[17]="飯糰";theArray[18]="豬油拌飯";
		 function ranFun(){return parseInt(Math.random()*18);}
		 number=ranFun();
		 new Small_picker();
         chosen=theArray[number];
}

function Noodle(){
		 theArray[0]="炒麵";theArray[1]="燴麵";theArray[2]="牛肉麵";theArray[3]="陽春麵";theArray[4]="餛飩麵";theArray[5]="擔仔麵";theArray[6]="泡麵";theArray[7]="米粉";
		 theArray[8]="鍋燒意麵";theArray[9]="義大利麵";theArray[10]="拉麵";theArray[11]="涼麵";theArray[12]="乾麵";theArray[13]="麻醬麵";theArray[14]="炸醬麵"; 
		 theArray[15]="魯麵";theArray[16]="麵線糊";theArray[17]="麵疙瘩";theArray[18]="麵線羹";
         function ranFun(){return parseInt(Math.random()*18);}
		 number=ranFun();
		 new Small_picker();
         chosen=theArray[number];}

function Small_picker(){
for(number;number===thistime||number===lasttime;number=ranFun());
lasttime=thistime;
thistime=number;
}

function Time_suggestion(){
  time = new Date();
  hour_now=(time.getHours()+8)%24; // 判斷現在時間自動給予建議
if(hour_now>=4&&hour_now<=8){      
      new Breakfast();
      type='早餐';icon='🌅';
      picture_url='https://i.imgur.com/4fgZ5WT.png';
   }else if(hour_now>=9&&hour_now<=10){      
      new Breakfast();
      type='早午餐';icon='🌅';
      picture_url='https://i.imgur.com/m1SvqAR.png';
   }
   else if(hour_now>=11&&hour_now<=13){ 
      new Lunch();
      type='午餐';icon='☀️';
      picture_url='https://i.imgur.com/XPrb9hF.png';
   }
   else if(hour_now>=14&&hour_now<=16){
    new Afternoon_Tea();
      type='下午茶';icon='🌇';
      picture_url='https://i.imgur.com/02WQr5G.png';
    } 
   else if(hour_now>=17&&hour_now<=20){ 
      new Dinner();
      type='晚餐';icon='🌃';
      picture_url='https://i.imgur.com/2rMgl5I.png';
    }
     else{		  
       new Late_Night();
       type='宵夜';icon='🌙';
       picture_url='https://i.imgur.com/rKVXihj.png';
      }
}

app.intent('預設歡迎語句', (conv) => {
  
    tip=false; new Time_suggestion();
    output_food=chosen;
  
       if (output_food==='丼飯'){output_food='動飯';}
      else if (output_food==='刈包'){output_food='掛包';}
      else if (output_food==='蚵仔煎'){output_food='鵝阿堅';}
      else if (output_food==='碗粿'){output_food='挖貴';}
      else if (output_food==='米香'){output_food='咪乓';}
      else if (output_food==='吐司'){output_food='土司';}
     
    if (conv.user.last.seen) {conv.ask(new SimpleResponse({               
                      speech: `<speak><p><s>歡迎回來!</s><s>覺得${output_food}如何ㄋ?</s><s>你可以說<break time="0.2s"/>再來一個<break time="0.2s"/>讓我再想一個點子，或者說<break time="0.2s"/>可以<break time="0.2s"/>來進行附近地點查詢。</s></p></speak>`,
                       text: '歡迎使用「美食決定器」!',}));
   } else { conv.ask(new SimpleResponse({               
                      speech: `<speak><p><s>歡迎使用美食決定器!</s><s>覺得${output_food}如何ㄋ?</s><s>或者你可以對我說<break time="0.2s"/>再來一個<break time="0.2s"/>取得現在時段的相關建議</s><s>除此之外，你也能問我<break time="0.2s"/>飯或麵哪個好<break time="0.2s"/>讓我幫你抉擇!!</s></p></speak>`,
                       text: '歡迎使用「美食決定器」!',}));}
   var chosen_link=chosen;
   if( chosen_link==='漢堡'){ chosen_link='漢堡店';}
   //輸出卡片
        conv.ask(new BasicCard({   
        image: new Image({url:picture_url,alt:'Pictures',}),
        title: '覺得「'+chosen+'」如何呢?',
        subtitle: '基於現在'+hour_now+'點提供的'+type+'快速建議。  \n若建議可行請輕觸下方的搜尋地圖按鈕。  \n或輕觸建議卡片讓我想其他點子。',
        buttons: new Button({title:'在「地圖」中搜尋：'+chosen,url:'https://www.google.com.tw/maps/search/'+chosen_link+'/15z/data=!4m4!2m3!5m1!2e1!6e5',}), 
        }));
        if(type==='早午餐'){type='早餐';}
       conv.ask(new Suggestions(icon+'再一個'+type+'建議','🤔飯和麵哪個好','💭詢問教學','👋 掰掰'));
      
    
    conv.user.storage.type=type;
	conv.user.storage.chosen=chosen;
    conv.user.storage.tip=tip;
    conv.user.storage.icon=icon;
    conv.user.storage.thistime=thistime;  
    conv.user.storage.lasttime=lasttime;    
});


app.intent('輸出想到的美食', (conv,{input}) => {
type=conv.user.storage.type;
chosen=conv.user.storage.chosen;
icon=conv.user.storage.icon=icon;
tip=conv.user.storage.tip;
thistime=conv.user.storage.thistime;  
lasttime=conv.user.storage.lasttime;     
  
if(input==='早餐'){type='早餐';}
else if(input==='午餐'){type='午餐';}
else if(input==='下午茶'){type='下午茶';}
else if(input==='晚餐'){type='晚餐';}
else if(input==='宵夜'){type='宵夜';}
else if(input==='飯類挑選'){type='飯類';}
else if(input==='麵類挑選'){type='麵類';}

if(type==='早餐'){ new Breakfast();icon='🌅';}
else if(type==='午餐'){ new Lunch();icon='☀️';}
else if(type==='晚餐'){ new Dinner();icon='🌃';}
else if(type==='下午茶'){ new Afternoon_Tea();icon='🌇';}
else if(type==='宵夜'){ new Late_Night();icon='🌙';}  
else if(type==='飯類'){new Rice();icon='🍚';}
else if(type==='麵類'){new Noodle();icon='🍝';}
  
output_food=chosen;
if (output_food==='丼飯'){output_food='動飯';}
else if (output_food==='刈包'){output_food='掛包';}
else if (output_food==='蚵仔煎'){output_food='鵝阿堅';}
else if (output_food==='碗粿'){output_food='挖貴';}
else if (output_food==='米香'){output_food='咪乓';}
else if (output_food==='吐司'){output_food='土司';}
   
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
                      speech: `<speak><p><s>我想到${output_food}<break time="0.2s"/>${output_think}?</s></p></speak>`,
                       text: '我想到「'+chosen+'」\n'+output_string+'?',}));   
                  }
                  else{
                       conv.ask(new SimpleResponse({               
                       speech: `<speak><p><s>我想到${output_food}<break time="0.2s"/>${output_think}?<break time="0.2s"/>你可以輕觸建議卡片或說出下方卡片提示的語音指令與我互動!</s></p></speak>`,
                       text: '我想到「'+chosen+'」\n'+output_string+'?',}));  
                       conv.ask(new BasicCard({    
                       title: '《語音指令說明》',
                       subtitle:'除了點擊建議卡片,也能以語音與我互動。\n\n◎否決提議:"不要","不行","再來一個"\n◎進行地圖搜尋:"ok","好啊","可以"\n◎兩者間抉擇:"食物A與食物B選一個"\n◎更改建議的餐點類別:\n  "早餐","午餐","晚餐","下午茶","霄夜"',     
                       text: '[!]關於在兩者間抉擇的抉擇指令，你可以試著說「教學」獲得更多訊息。',                                         
                       }));
                  }
                  tip=true;}
  else{conv.ask(new SimpleResponse({               
                      speech: `<speak><p><s>我想到${output_food}<break time="0.2s"/>${output_think}?</s></p></speak>`,
                       text: '我想到「'+chosen+'」\n'+output_string+'?',}));}
 
 conv.ask(new Suggestions(icon+'再一個'+type+'建議',output_answer));

  
conv.user.storage.type=type;
conv.user.storage.chosen=chosen;
conv.user.storage.tip=tip;
conv.user.storage.thistime=thistime;  
conv.user.storage.lasttime=lasttime;     
conv.user.storage.icon=icon;
});


app.intent('Google地圖查詢', (conv,{food}) => {
type=conv.user.storage.type;
chosen=conv.user.storage.chosen;
icon=conv.user.storage.icon=icon;
tip=conv.user.storage.tip;
conv.user.storage.thistime=thistime;  
conv.user.storage.lasttime=lasttime;    
  
  if(food!==''){chosen=food;}
    else{chosen=conv.user.storage.chosen;}
  
  const context = '由於目前對話的裝置無法檢視搜尋結果';
  const notification = '為你送上「'+chosen+'」的搜尋結果';
  const capabilities = ['actions.capability.SCREEN_OUTPUT'];
  
  const screenAvailable =
  conv.available.surfaces.capabilities.has('actions.capability.SCREEN_OUTPUT');//檢測目前對話裝置是否有螢幕

   var chosen_link=chosen;
   output_food=chosen;
  if (output_food==='丼飯'){output_food='動飯';}
  else if (output_food==='刈包'){output_food='掛包';}
  else if (output_food==='蚵仔煎'){output_food='鵝阿堅';}
  else if (output_food==='碗粿'){output_food='挖貴';}
  else if (output_food==='米香'){output_food='咪乓';}
  else if (output_food==='吐司'){output_food='土司';}
   if( chosen_link==='漢堡'){ chosen_link='漢堡店';}
   if( chosen_link==='總匯'){ chosen_link='總匯三明治';}
  
   if (conv.screen) {
     conv.ask(new SimpleResponse({speech:`<speak><p><s>下面帶來的是<break time="0.2s"/>${output_food}<break time="0.2s"/>的搜尋結果</s></p></speak>`,text:'下面帶來的是「'+chosen+'」的搜尋結果'}));
     conv.ask(new BasicCard({    
        title: '搜尋結果',
        subtitle:type+'/'+chosen,     
        text: '由於Google現行政策，無法在此提供內容。  \n請輕觸下方連結獲得Google地圖搜尋結果',                                         
        buttons: new Button({title:'在「地圖」中搜尋：'+chosen,url:'https://www.google.com.tw/maps/search/'+chosen_link+'/15z/data=!4m4!2m3!5m1!2e1!6e5',}), 
     }));
     conv.ask(new Suggestions('回到選單',icon+'再一個'+type+'建議','👋 掰掰'));
   } else if (screenAvailable) {
     conv.ask(new NewSurface({context, notification, capabilities}));
  } else {
  conv.close('你選擇的是，'+chosen+'，請自行透過其他裝置進行搜尋，掰掰!');}
 
 conv.user.storage.type=type;
 conv.user.storage.chosen=chosen;
 conv.user.storage.tip=tip;
 conv.user.storage.thistime=thistime;  
 conv.user.storage.lasttime=lasttime;    
 conv.user.storage.icon=icon;
});

app.intent('在新裝置上進行對話', (conv, input, newSurface) => {
 type=conv.user.storage.type;
 chosen=conv.user.storage.chosen;
 tip=conv.user.storage.tip;
  if (newSurface.status === 'OK') {
     var chosen_link=chosen;
      if (output_food==='丼飯'){output_food='動飯';}
      else if (output_food==='刈包'){output_food='掛包';}
      else if (output_food==='蚵仔煎'){output_food='鵝阿堅';}
      else if (output_food==='碗粿'){output_food='挖貴';}
      else if (output_food==='米香'){output_food='咪乓';}
      else if (output_food==='吐司'){output_food='土司';}
   if( chosen_link==='漢堡'){ chosen_link='漢堡店';}
   if( chosen_link==='總匯'){ chosen_link='總匯三明治';}
      conv.ask(new SimpleResponse({speech:`<speak><p><s>下面帶來的是<break time="0.2s"/>${output_food}<break time="0.2s"/>的搜尋結果</s></p></speak>`,text:'下面帶來的是「'+chosen+'」的搜尋結果'}));
     conv.ask(new BasicCard({    
        title: '搜尋結果',
        subtitle:type+'/'+chosen,     
        text: '由於Google現行政策，無法在此提供內容。  \n請輕觸下方連結獲得Google地圖搜尋結果',                                         
        buttons: new Button({title:'在「地圖」中搜尋：'+chosen,url:'https://www.google.com.tw/maps/search/'+chosen_link+'/15z/data=!4m4!2m3!5m1!2e1!6e5',}), 
     }));
     conv.ask(new Suggestions('回到選單','👋 掰掰'));
  } else {
    conv.close(`好的，我了解您不想看到搜尋結果。那就先這樣吧!`);
  }
   conv.user.storage.type=type;
  conv.user.storage.chosen=chosen;
  conv.user.storage.tip=tip;
  conv.user.storage.thistime=thistime;  
  conv.user.storage.lasttime=lasttime;    
});

app.intent('回到預設選單', (conv) => {
type= conv.user.storage.type;
chosen=conv.user.storage.chosen;
icon=conv.user.storage.icon;
thistime=conv.user.storage.thistime;  
lasttime=conv.user.storage.lasttime;   
  
new Time_suggestion();
conv.ask(new SimpleResponse({speech:'請輸入相對應指令讓我為你服務!',text:'說出指令或點選建議卡片來進行操作：'}));
conv.ask(new BasicCard({   
        title: '《語音指令說明》',
        subtitle:'除了點擊建議卡片,也能以語音與我互動。\n\n◎否決提議:"不要","不行","再來一個"\n◎進行地圖搜尋:"ok","好啊","可以"\n◎兩者間抉擇:"食物A與食物B選一個"\n◎更改建議的餐點類別:\n  "早餐","午餐","晚餐","下午茶","霄夜"',     
        text: '[!]注意事項：語音辨識錯誤問題在於Google助理。本程式只能串接輸入內容並給予相對應回應。', 
        }));
  if(type==='早午餐'){type='早餐';}
conv.ask(new Suggestions(icon+'取得'+type+'建議','🤔飯和麵哪個好','💭詢問教學','👋 掰掰'));
   
conv.user.storage.type=type;
conv.user.storage.chosen=chosen;
conv.user.storage.tip=tip;
conv.user.storage.thistime=thistime;  
conv.user.storage.lasttime=lasttime;   
conv.user.storage.icon=icon;
});

app.intent('預設罐頭回覆', (conv) => {
type= conv.user.storage.type;
chosen=conv.user.storage.chosen;
icon=conv.user.storage.icon;

conv.ask(new SimpleResponse({speech:'請輸入相對應指令讓我為你服務!',text:'說出指令或點選建議卡片來進行操作：'}));
conv.ask(new BasicCard({   
        title: '《語音指令說明》',
        subtitle:'除了點擊建議卡片,也能以語音與我互動。\n\n◎否決提議:"不要","不行","再來一個"\n◎進行地圖搜尋:"ok","好啊","可以"\n◎兩者間抉擇:"食物A與食物B選一個"\n◎更改建議的餐點類別:\n  "早餐","午餐","晚餐","下午茶","霄夜"',     
        text: '[!]注意事項：語音辨識錯誤問題在於Google助理。本程式只能串接輸入內容並給予相對應回應。', 
        }));
  if(type==='早午餐'){type='早餐';}
conv.ask(new Suggestions(icon+'取得'+type+'建議','🤔飯和麵哪個好','💭詢問教學','👋 掰掰'));
   
conv.user.storage.type=type;
conv.user.storage.chosen=chosen;
conv.user.storage.tip=tip;
conv.user.storage.icon=icon;
});


var choice=0;//處理兩食物之間重複選取問題
var last=0;//處理兩食物之間重複選取問題

function pacher(){
choice=parseInt(Math.random()*1);
  if(last===choice){choice++;choice=choice%2;}
last=choice;
}

app.intent('麵或飯', (conv) => {
last=conv.user.storage.last;

new pacher();
if(choice===0){type='飯類';I_think='飯';}
if(choice===1){type='麵類';I_think='麵';}

conv.ask(new SimpleResponse({speech:`<speak><par><media xml:id="sound" repeatCount="2" soundLevel="+2dB"><audio src="https://k007.kiwi6.com/hotlink/7dm9lroty2/thinking-time.mp3"/></media><media begin="sound.end+0.1s" soundLevel="+2dB"><speak><p><s>我覺得${I_think}還不錯</s><s>你可以對我說<break time="0.1s"/>幫我想<break time="0.1s"/>讓我想幾個有關${I_think}的點子!</s></p></speak></media></par></speak>`,text:'我覺得「'+I_think+'」還不錯'}));

  conv.ask(new Suggestions('幫我想要吃什麼'+I_think,'回到選單'));
  tip=false; 
  conv.user.storage.type=type;
  conv.user.storage.chosen=chosen;
  conv.user.storage.last=last;
  conv.user.storage.tip=tip;
});

app.intent('兩種食物抉擇', (conv,{food,food1}) => {
type='食物抉擇';
chosen=conv.user.storage.chosen;
tip=conv.user.storage.tip;
last=conv.user.storage.last;

new pacher();
if(choice===0){I_think=food;}
if(choice===1){I_think=food1;}

conv.ask(new SimpleResponse({speech:`<speak><par><media xml:id="sound" repeatCount="1" soundLevel="+2dB"><audio src="https://k007.kiwi6.com/hotlink/7dm9lroty2/thinking-time.mp3"/></media><media begin="sound.end+0.1s" soundLevel="+2dB"><speak><p><s>我覺得${I_think}還不錯</s><s>你可以對我說<break time="0.1s"/>搜尋<break time="0.1s"/>來進行附近地點查尋!</s></p></speak></media></par></speak>`,text:'我已經幫你挑選出了!'}));
conv.ask(new BasicCard({   
        title: '「'+I_think+'」還不錯',
        text:'「'+food+'」與「'+food1+'」之間選擇的結果',
        }));
  conv.ask(new Suggestions('在地圖上搜尋「'+I_think+'」','回到選單'));
  tip=false; 
  conv.user.storage.type=type;
  conv.user.storage.chosen=I_think;
  conv.user.storage.last=last;
  conv.user.storage.tip=tip;

});

app.intent('教學區塊', (conv) => { 
conv.ask(new SimpleResponse({speech:`<speak><p><s>除了一般詢問外，我也可以在兩個食物間幫你選擇<break time="0.2s"/>請說出或點擊下方選項試試看</s></p></speak>`,text:'試著說出指令問我看看吧!'}));
 conv.ask(new BasicCard({   
        title:'《詢問語法說明》',
        subtitle:'除了一般建議外\n我也能幫你在兩個食物中做抉擇\n詢問方式：\n◎「食物A」跟「食物B」選一個\n◎「食物A」和「食物B」哪個好\n◎「食物A」與「食物B」選個',
        text:'*[!]你也可以試著詢問自己的組合*',
        }));
  conv.ask(new Suggestions('雞肉飯跟迴轉壽司選一個','夜市和麥當勞哪個好','牛肉麵與榨菜肉絲麵選一個'));

});

app.intent('結束對話', (conv) => {
     conv.user.storage = {}; //離開同時清除暫存資料
    conv.ask(new SimpleResponse({speech:'很高興能幫助到你',text:'很高興能幫助到你'},{speech:'祝你用餐愉快',text:'祝你用餐愉快'}));
    conv.ask(new SimpleResponse({speech: '下次見',text: '下次見 👋',}));
    conv.close(new BasicCard({   
        title: '感謝您的使用!',
        text:'如果有任何需要改進的地方，  \n歡迎到簡介頁面評分或給予反饋，謝謝!',   
        buttons: new Button({title: '開啟本程式的商店頁面',url: 'https://assistant.google.com/services/a/uid/00000058f29109ab?jsmode=o&hl=zh-Hant-TW&source=web',
  }),
  }));

});


// Set the DialogflowApp object to handle the HTTPS POST request.
exports.dialogflowFirebaseFulfillment = functions.https.onRequest(app);