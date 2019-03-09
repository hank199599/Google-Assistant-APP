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
  LinkOutSuggestion
} = require('actions-on-google');


// Import the firebase-functions package for deployment.
const functions = require('firebase-functions');

// Instantiate the Dialogflow client.
const app = dialogflow({debug: true});

//全域變數
var chosen='測試'; //宣告選擇的食物
var type ='測試'; //宣告選擇的食物

//加入 Google Place API

//加入開場音效：來自Google 音效庫音效
const audioSound = 'https://actions.google.com/sounds/v1/alarms/bugle_tune.ogg';

// Handle the Dialogflow intent named 'favorite food'.
// The intent collects a parameter named 'food'.
var count=true;

//歡迎畫面
app.intent('預設歡迎語句', (conv) => {
    count=true;
   var theArray=new Array([]); //宣告陣列，依據餐點不同有相異快速建議
   var picture_url='url';
   function ranFun(){return parseInt(Math.random()*7);} //隨機快速建議直選
     // 判斷現在時間自動給予建議
     var time = new Date();
     var hour_now=(time.getHours()+8)%24;
     conv.ask(new SimpleResponse({               
                      speech: '歡迎使用美食決定器，我想先問問你要的類別。例如：你可以說早餐、午餐、晚餐、下午茶、或宵夜來獲得相對應回應。或者說、「掰掰」、來結束我們的對話。',
                       text: '歡迎使用「美食決定器」!',
    }));
   
  
   if(hour_now>=4&&hour_now<=8){      
      theArray[0]="饅頭";theArray[1]="蛋餅";theArray[2]="厚片";theArray[3]="總匯";theArray[4]="漢堡";theArray[5]="炒麵";theArray[6]="肉包";theArray[7]="麵包";
      const output1=theArray[ranFun()];
      chosen=output1;
      type='早餐';
      picture_url='https://i.imgur.com/4fgZ5WT.png';
   }else if(hour_now>=9&&hour_now<=10){      
      theArray[0]="輕食";theArray[1]="蛋餅";theArray[2]="早午餐";theArray[3]="總匯";theArray[4]="漢堡";theArray[5]="炒麵";theArray[6]="肉包";theArray[7]="三明治";
      const output6=theArray[ranFun()];
      chosen=output6;
      type='早午餐';
      picture_url='https://i.imgur.com/XPrb9hF.png';
   }
   else if(hour_now>=11&&hour_now<=13){ 
      theArray[0]="炒飯";theArray[1]="關東煮";theArray[2]="輕食";theArray[3]="炒麵";theArray[4]="快炒";theArray[5]="排骨飯";theArray[6]="鍋貼";theArray[7]="速食店";
      const output2=theArray[ranFun()];
      chosen=output2;
      type='午餐';
      picture_url='https://i.imgur.com/m1SvqAR.png';
   }
   else if(hour_now>=14&&hour_now<=17){
    theArray[1]="洋芋片";theArray[2]="雞蛋糕";theArray[3]="地瓜酥";theArray[4]="蔥油餅";theArray[5]="三明治";theArray[6]="掛包";theArray[7]="綠豆湯";
    const output3=theArray[ranFun()];
      chosen=output3;
      type='下午茶';
     picture_url='https://i.imgur.com/02WQr5G.png';
    } 
   else if(hour_now>=18&&hour_now<=20){ 
    theArray[0]="便當";theArray[1]="韓式料理";theArray[2]="日式料理";theArray[3]="牛肉麵";theArray[4]="焗烤";theArray[5]="排骨飯";theArray[6]="簡餐";theArray[7]="軟骨飯";
      const output4=theArray[ranFun()];
      chosen=output4;
      type='晚餐';
     picture_url='https://i.imgur.com/2rMgl5I.png';
    }
     else{		  
       theArray[0]="便利商店";theArray[1]="鹽酥雞";theArray[2]="快炒店";theArray[3]="無糖優格";theArray[4]="洋芋片";theArray[5]="地瓜酥";theArray[6]="堅果";theArray[7]="沙拉";
       const output5=theArray[ranFun()];
       chosen=output5;
       type='宵夜';
       picture_url='https://imgur.com/rKVXihj.png';
      }
     //輸出卡片
        conv.ask(new BasicCard({   
      //  speech: '歡迎使用美食決定器，我想先問問你要的類別。例如：你可以說早餐、午餐、晚餐、下午茶、或宵夜來獲得相對應回應。或者說、「掰掰」、來結束我們的對話。',
        image: new Image({url:picture_url,alt:'Pictures',}),
        title: '覺得「'+chosen+'」如何呢?',
        subtitle:'此為依據現在'+hour_now+'點提供的'+type+'快速建議',     
        text: '若覺得快速建議可行，請輕觸下方的連結按鈕。  \n若對此建議不滿意，或是想選擇其他時段。  \n請輕觸下面的建議卡片或說出類別讓我知道。',
        buttons: new Button({title:'在「地圖」中搜尋：'+chosen,url:'https://www.google.com.tw/maps/search/'+chosen,}), 
        }));
     conv.ask(new Suggestions('🌅 早餐','☀️ 午餐', '🌃 晚餐','🌇 下午茶','🌙 宵夜','👋 掰掰'));
 }
      
);

//早餐選擇
app.intent('早餐', (conv) => {
      //隨機推薦挑選機
      var theArray=new Array([]);
          theArray[0]="饅頭";theArray[1]="蛋餅";theArray[2]="吐司";theArray[3]="總匯";theArray[4]="漢堡";theArray[5]="炒麵";theArray[6]="煎餃";theArray[7]="三明治";theArray[8]="掛包";theArray[9]="沙拉";
          theArray[10]="飯糰";theArray[11]="麵包";theArray[12]="油條";theArray[13]="包子";theArray[14]="蘿蔔糕";theArray[15]="炒麵";theArray[16]="鬆餅";theArray[17]="優格";theArray[18]="乾麵";theArray[19]="沙拉";
          theArray[20]="燒餅";theArray[21]="水餃";theArray[22]="鍋貼";theArray[23]="筒仔米糕";theArray[24]="肉粽";theArray[25]="總匯";theArray[26]="早午餐";theArray[27]="米糕";theArray[28]="碗粿";theArray[29]="燒餅";  
          theArray[30]="蛋";theArray[31]="饅頭";theArray[32]="熱狗捲";theArray[33]="粥";theArray[34]="帕帕尼";theArray[35]="貝果";theArray[36]="米堡";theArray[37]="捲餅";theArray[38]="厚片";theArray[39]="燒餅";
          theArray[41]="排骨湯";theArray[42]="燕麥片";theArray[43]="餡餅";theArray[44]="薯條";theArray[45]="三明治";
     function ranFun(){return parseInt(Math.random()*45);}
      const output=theArray[ranFun()];
      chosen=output;
      type='早餐';
   //輸出推薦結果
    conv.ask('我想到'+output);
    if(count===true){ conv.ask(new SimpleResponse({speech:'這個建議如何?，你可以說、「早餐」、讓我再想一個點子，或者說，「可以」，來進行附近地點查詢。',text:'覺得如何？'})); count=false;}
    if(count===false){conv.ask(new SimpleResponse({speech:'這個如何？',text:'覺得怎樣?'}));}
  //下方輸出按鈕卡片
  conv.ask(new Suggestions('🌅 再一個早餐建議','我覺得'+output+'可以','👋 掰掰'));
});
//午餐選擇
app.intent('午餐', (conv) => {
      //隨機推薦挑選機
      var theArray=new Array([]);
          theArray[0]="饅頭";theArray[1]="蛋餅";theArray[2]="吐司";theArray[3]="總匯";theArray[4]="漢堡";theArray[5]="炒麵";theArray[6]="煎餃";theArray[7]="三明治";theArray[8]="掛包";theArray[9]="沙拉";theArray[10]="排骨湯";
          theArray[10]="飯糰";theArray[11]="麵包";theArray[12]="油條";theArray[13]="包子";theArray[14]="蘿蔔糕";theArray[15]="炒麵";theArray[16]="丼飯";theArray[17]="優格";theArray[18]="乾麵";theArray[19]="迴轉壽司";
          theArray[20]="燒餅";theArray[21]="水餃";theArray[22]="鍋貼";theArray[23]="筒仔米糕";theArray[24]="肉粽";theArray[25]="總匯";theArray[26]="早午餐";theArray[27]="米糕";theArray[28]="碗粿";theArray[29]="燒餅"; 
          theArray[30]="蛋";theArray[31]="饅頭";theArray[32]="熱狗捲";theArray[33]="粥";theArray[34]="帕帕尼";theArray[35]="貝果";theArray[36]="米堡";theArray[37]="捲餅";theArray[38]="厚片";theArray[39]="燒餅";
          theArray[40]="炒飯";theArray[41]="關東煮";theArray[42]="輕食";theArray[43]="泡麵";theArray[44]="日式料理";theArray[45]="炒麵";theArray[46]="快炒";theArray[47]="排骨飯";theArray[48]="鍋貼";theArray[49]="軟骨飯";
          theArray[50]="燴飯";theArray[51]="稀飯";theArray[52]="";theArray[53]="自助餐";theArray[54]="米粉";theArray[55]="泰式料理";theArray[56]="便當";theArray[57]="魚排飯";theArray[58]="自己煮";theArray[59]="油飯";
          theArray[50]="便當";theArray[51]="陽春麵";theArray[62]="鍋貼";theArray[63]="越式料理";theArray[64]="肉粽";theArray[65]="烤雞";theArray[66]="火雞肉飯";theArray[67]="小籠包";theArray[68]="披薩";theArray[69]="簡餐"; 
          theArray[70]="飯糰";theArray[71]="牛肉麵";theArray[72]="熱狗捲";theArray[73]="美式料理";theArray[74]="帕帕尼";theArray[75]="拼盤";theArray[76]="滷肉飯";theArray[77]="炸菜肉絲麵";theArray[78]="雞腿飯";theArray[79]="焗烤";
          theArray[80]="速食店";theArray[81]="排骨湯";theArray[82]="餡餅"; theArray[83]="薯條";theArray[84]="麥當勞";theArray[85]="肯德基";theArray[86]="摩斯漢堡"; 
  function ranFun(){return parseInt(Math.random()*86);}
      const output=theArray[ranFun()];
      chosen=output;
      type='午餐';
   //輸出推薦結果
    conv.ask('我想到'+output);
    if(count===true){ conv.ask(new SimpleResponse({speech:'這個建議如何?，你可以說、「午餐」、讓我再想一個點子，或者說，「可以」，來進行附近地點查詢。',text:'覺得如何？'})); count=false;}
    if(count===false){conv.ask(new SimpleResponse({speech:'這個如何？',text:'覺得怎樣?'}));}
  //下方輸出按鈕卡片
  conv.ask(new Suggestions('☀️ 再一個午餐建議','我覺得'+output+'可以','👋 掰掰'));
});
//晚餐選擇
app.intent('晚餐', (conv) => {
      //隨機推薦挑選機
      var theArray=new Array([]);
          theArray[0]="饅頭";theArray[1]="夜市";theArray[2]="吐司";theArray[3]="總匯";theArray[4]="漢堡";theArray[5]="炒麵";theArray[6]="煎餃";theArray[7]="三明治";theArray[8]="掛包";theArray[9]="沙拉";
          theArray[10]="飯糰";theArray[11]="麵包";theArray[12]="燒烤";theArray[13]="包子";theArray[14]="蘿蔔糕";theArray[15]="懷石料理";theArray[16]="丼飯";theArray[17]="優格";theArray[18]="乾麵";theArray[19]="迴轉壽司";
          theArray[20]="燒餅";theArray[21]="水餃";theArray[22]="鍋貼";theArray[23]="筒仔米糕";theArray[24]="肉粽";theArray[25]="總匯";theArray[26]="早午餐";theArray[27]="米糕";theArray[28]="碗粿";theArray[29]="燒餅"; 
          theArray[30]="牛排";theArray[31]="饅頭";theArray[32]="火鍋";theArray[33]="粥";theArray[34]="帕帕尼";theArray[35]="貝果";theArray[36]="米堡";theArray[37]="捲餅";theArray[38]="厚片";theArray[39]="燒餅";
          theArray[40]="炒飯";theArray[41]="關東煮";theArray[42]="輕食";theArray[43]="韓式料理";theArray[44]="日式料理";theArray[45]="炒麵";theArray[46]="快炒";theArray[47]="排骨飯";theArray[48]="鍋貼";theArray[49]="軟骨飯";
          theArray[50]="燴飯";theArray[51]="稀飯";theArray[52]="";theArray[53]="泰式料理";theArray[54]="米粉";theArray[55]="泰式料理";theArray[56]="便當";theArray[57]="魚排飯";theArray[58]="越南料理";theArray[59]="油飯";
          theArray[50]="便當";theArray[51]="陽春麵";theArray[62]="鍋貼";theArray[63]="越式料理";theArray[64]="肉粽";theArray[65]="烤雞";theArray[66]="火雞肉飯";theArray[67]="小籠包";theArray[68]="披薩";theArray[69]="簡餐";
          theArray[70]="飯糰";theArray[71]="牛肉麵";theArray[72]="熱狗捲";theArray[73]="美式料理";theArray[74]="帕帕尼";theArray[75]="拼盤";theArray[76]="滷肉飯";theArray[77]="炸菜肉絲麵";theArray[78]="雞腿飯";theArray[79]="焗烤";		  
          theArray[80]="排骨湯";theArray[81]="排骨湯";theArray[82]="餡餅";theArray[83]="薯條";theArray[84]="麥當勞";theArray[85]="肯德基";theArray[86]="摩斯漢堡";theArray[87]="速食店";theArray[88]="法國料理";theArray[89]="英國料理";
          theArray[90]="墨西哥料理";theArray[91]="港式料理";theArray[92]="加拿大料理";theArray[93]="緬甸料理";theArray[94]="蒙古料理";theArray[95]="蒙古烤肉";theArray[96]="拉麵";theArray[97]="自助餐";
  function ranFun(){return parseInt(Math.random()*97);}
      const output=theArray[ranFun()];
      chosen=output;
      type='晚餐';
   //輸出推薦結果
    conv.ask('我想到'+output);
    if(count===true){ conv.ask(new SimpleResponse({speech:'這個建議如何?，你可以說、「晚餐」、讓我再想一個點子，或者說，「可以」，來進行附近地點查詢。',text:'覺得如何？'})); count=false;}
    if(count===false){conv.ask(new SimpleResponse({speech:'這個如何？',text:'覺得怎樣?'}));}
  //下方輸出按鈕卡片
  conv.ask(new Suggestions('🌃 再一個晚餐建議','我覺得'+output+'可以','👋 掰掰'));
});

//下午茶選擇
app.intent('下午茶', (conv) => {
      //隨機推薦挑選機
      var theArray=new Array([]);
          theArray[0]="咖啡廳";theArray[1]="皮麵糊";theArray[2]="吐司";theArray[3]="紅豆餅";theArray[4]="雞蛋糕";theArray[5]="地瓜酥";theArray[6]="煎餃";theArray[7]="三明治";theArray[8]="掛包";theArray[9]="沙拉";theArray[42]="排骨湯";
          theArray[10]="飯糰";theArray[11]="麵包";theArray[12]="燒烤";theArray[13]="包子";theArray[14]="蘿蔔糕";theArray[15]="叉燒酥";theArray[16]="核桃酥";theArray[17]="芋頭酥";theArray[18]="乾麵";theArray[19]="蛋黃酥";theArray[41]="鳳梨酥";
          theArray[20]="燒餅";theArray[21]="水餃";theArray[22]="鍋貼";theArray[23]="筒仔米糕";theArray[24]="肉粽";theArray[25]="總匯";theArray[26]="蟹殼黃";theArray[27]="元寶酥";theArray[28]="碗粿";theArray[29]="燒餅";theArray[43]="小窩頭";  
          theArray[30]="港式蘿蔔糕";theArray[31]="蘿蔔絲餅";theArray[32]="糕仔餅";theArray[33]="銅鑼燒";theArray[34]="千層糕";theArray[35]="黑糖糕";theArray[36]="米堡";theArray[37]="捲餅";theArray[38]="蔥油餅";theArray[39]="發糕";theArray[40]="薯條";
  function ranFun(){return parseInt(Math.random()*43);}
      const output=theArray[ranFun()];
      chosen=output;
      type='下午茶';
   //輸出推薦結果
    conv.ask('我想到'+output);
    if(count===true){ conv.ask(new SimpleResponse({speech:'這個建議如何?，你可以說、「下午茶」、讓我再想一個點子，或者說，「可以」，來進行附近地點查詢。',text:'覺得如何？'})); count=false;}
    if(count===false){conv.ask(new SimpleResponse({speech:'這個如何？',text:'覺得怎樣?'}));}
  //下方輸出按鈕卡片
  conv.ask(new Suggestions('🌆 再一個下午茶建議','我覺得'+output+'可以','👋 掰掰'));
});
//宵夜選擇
app.intent('宵夜', (conv) => {
      //隨機推薦挑選機
      var theArray=new Array([]);
          theArray[0]="夜市";theArray[1]="黑巧克力";theArray[2]="吐司";theArray[3]="水餃";theArray[4]="榖物粥";theArray[5]="地瓜酥";theArray[6]="煎餃";theArray[7]="三明治";theArray[8]="堅果";theArray[9]="沙拉";theArray[42]="天然水果乾";
          theArray[10]="鹽酥雞";theArray[11]="麵包";theArray[12]="燒烤";theArray[13]="榖物片";theArray[14]="蘿蔔糕";theArray[15]="叉燒酥";theArray[16]="烤地瓜";theArray[17]="芋頭酥";theArray[18]="乾麵";theArray[19]="蛋黃酥";theArray[41]="鳳梨酥";
          theArray[20]="炸雞排";theArray[21]="烤肉串";theArray[22]="鍋貼";theArray[23]="筒仔米糕";theArray[24]="肉粽";theArray[25]="米果";theArray[26]="米香";theArray[27]="黑木耳飲";theArray[28]="碗粿";theArray[29]="燒餅";theArray[43]="肉乾";  
          theArray[30]="快炒店";theArray[31]="蘿蔔絲餅";theArray[32]="無糖優格";theArray[33]="發糕";theArray[34]="糙米粥";theArray[35]="黑糖糕";theArray[36]="米堡";theArray[37]="捲餅";theArray[38]="蔥油餅";theArray[39]="洋芋片";theArray[40]="薯條";
  function ranFun(){return parseInt(Math.random()*43);}
      const output=theArray[ranFun()];
      chosen=output;
      type='宵夜';
   //輸出推薦結果
    conv.ask('我想到'+output);
    if(count===true){ conv.ask(new SimpleResponse({speech:'這個建議如何?，你可以說、「宵夜」、讓我再想一個點子，或者說，「可以」，來進行附近地點查詢。',text:'覺得如何？'})); count=false;}
    if(count===false){conv.ask(new SimpleResponse({speech:'這個如何？',text:'覺得怎樣?'}));}
  //下方輸出按鈕卡片
  conv.ask(new Suggestions('🌙 再一個宵夜建議','我覺得'+output+'可以','👋 掰掰'));
});

//輸出查詢結果
app.intent('開啟Google 地圖搜尋API', (conv) => {
     count=true;
     conv.ask(new SimpleResponse({speech:'下面帶來的是、'+chosen+'、的搜尋結果，如果你使用Google,Home等無實體互動的裝置。請自行透過手機等媒介搜尋。最後，若要結束我們的對話，請對我說「掰掰」!',text:'下面帶來的是「'+chosen+'」的搜尋結果'}));
     conv.ask(new BasicCard({   
        image: new Image({url:'https://i.imgur.com/FdsTdPI.png',alt:'Google Map',}),
        title: '搜尋結果',
        subtitle:type+'/'+chosen,     
        text: '由於Google現行政策，無法在此提供內容。  \n請輕觸下方連結獲得搜尋結果',
        buttons: new Button({title:'在「地圖」中搜尋：'+chosen,url:'https://www.google.com.tw/maps/search/'+chosen,}), 
     })
       );
     conv.ask(new Suggestions('回到選單','👋 掰掰'));
});

// test area
app.intent('測試區塊', (conv) => {
    conv.ask('這是測試區塊!');
    conv.ask(`<speak><audio src="${audioSound}"></audio>歡迎使用「美食決定器」!</speak>`);
    conv.ask(new SimpleResponse({               
                       speech: '我想先問問你要的類別。例如：你可以說早餐、午餐、晚餐、下午茶、或宵夜來獲得相對應回應。或者說、「掰掰」、來結束我們的對話。',
                         text: `請輕觸下面的選項或說出類別， \n 我會給你相對應的回應~`,
    }));
    conv.ask(new Suggestions('回到選單','👋 掰掰'));
});
// Set the DialogflowApp object to handle the HTTPS POST request.
exports.dialogflowFirebaseFulfillment = functions.https.onRequest(app);
