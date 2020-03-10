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

// Instantiate the Dialogflow client.
const app = dialogflow({debug: true});

var sys_think=0;     //生成系統猜測的數字
var sys_think_1000=0;//生成千位數
var sys_think_100=0; //生成百位數
var sys_think_10=0;  //生成十位數
var sys_think_1=0;   //生成個位數

var number=0;        //使用者剛剛輸入的數字
var you_guess=0;     //將剛剛生成的數字儲存起來
var you_guess_1000=0;//猜想的數值千位數
var you_guess_100=0; //猜想的數值百位數
var you_guess_10=0;  //猜想的數值十位數
var you_guess_1=0;   //猜想的數值個位數

var sys_guess=0;     //系統隨機生成一個數字幫忙找

var guess_count=0;//統計猜測次數
var A_count=0; //位置正確，且數字正確的數值數目
var B_count=0; //位置不正確，但數字正確的數值數目

//解釋意義用
var help_1000=0;var help_100=0; var help_10=0;  var help_1=0;   
var help_A_count=0;var help_B_count=0;var help_number=0; 
var help_Total=4; var explained='';//解釋比較結果
var sign_1000='';var sign_100='';var sign_10='';var sign_1='';
var else_count=0;var try_count=0;var teach_title='';var teach_subtitle='';

//教學模式
var teach_mode=false;
var teach_1000=0;var teach_100=0;var teach_10=0;var teach_1=0;

//這次輸入的數值與提示
var now_input=''; var now_hint='';
//上次的數值與提示
var last_input='';var last_hint='';
//上上次輸入的數值與提示
var before_input='';var before_hint='';
//上上上次輸入的數值與提示
var far_input='';var far_hint='';

var answer_input=false; //用於檢查輸入是否正確
var menu=true; //用於檢查輸入是否正確
var end_game=false; //用於檢查輸入是否正確
var example_1='';//用於示範
var example_2='';//

function ranFun(){return parseInt(Math.random()*9);}
function ranGuess(){return parseInt(Math.random()*9999);}

function analysis(you_guess)
{you_guess_1000=(you_guess-(you_guess%1000))/1000;
  you_guess_100=((you_guess%1000)-((you_guess%1000)%100))/100;
  you_guess_10=(((you_guess%1000)%100)-((you_guess%1000)%100)%10)/10;
  you_guess_1=((you_guess%1000)%100)%10;
  
  //千位數判斷
 if(sys_think_1000===you_guess_1000){A_count++;sign_1000='A';} 
 else if(sys_think_1000===you_guess_100){B_count++;sign_100='B';}
 else if(sys_think_1000===you_guess_10){B_count++;sign_10='B';} 
 else if(sys_think_1000===you_guess_1){B_count++;sign_1='B';} 
 
  //百位數判斷
 
 if(sys_think_100===you_guess_1000){B_count++;sign_1000='B';}
 else if(sys_think_100===you_guess_100){A_count++;sign_100='A';}
 else if(sys_think_100===you_guess_10){B_count++;sign_10='B';} 
 else if(sys_think_100===you_guess_1){B_count++;sign_1='B';} 
 
  //十位數判斷

 if(sys_think_10===you_guess_1000){B_count++;sign_1000='B';}
 else if(sys_think_10===you_guess_100){B_count++;sign_100='B';} 
 else if(sys_think_10===you_guess_10){A_count++;sign_10='A';}
 else if(sys_think_10===you_guess_1){B_count++;sign_1='B';} 
  
  //個位數判斷
 if(sys_think_1===you_guess_1000){B_count++;sign_1000='B';}
 else if(sys_think_1===you_guess_100){B_count++;sign_100='B';} 
 else if(sys_think_1===you_guess_10){B_count++;sign_10='B';} 
 else  if(sys_think_1===you_guess_1){A_count++;sign_1='A';}

  //修正可能的過大數字
 if(A_count>=4){A_count=4;}
 if(B_count>=4){B_count=4;}
}

//歡迎畫面
app.intent('預設歡迎語句', (conv) => { 
  menu=true;answer_input=false;end_game=false;teach_mode=false;try_count=0;
  A_count=0;B_count=0; now_input=''; now_hint=''; last_input=''; last_hint='';before_input=''; before_hint='';far_input=''; far_hint='';
  guess_count=0;
  const screenAvailable =
  conv.available.surfaces.capabilities.has('actions.capability.SCREEN_OUTPUT');//檢測目前對話裝置是否有螢幕
  
    if (conv.user.last.seen) {conv.ask(new SimpleResponse({               
         speech: `<speak><p><s>歡迎遊玩1A2B猜數!</s><s>準備好就說聲「開始遊戲」接受挑戰八!</s></p></speak>`,
         text: '感謝你再度使用「1A2B猜數」!',}));
   } else {
          if (conv.screen) {
         conv.ask(new SimpleResponse({               
         speech: `<speak><p><s>歡迎遊玩1A2B猜數!</s><s>本服務是Google助理版本的1A2B遊戲!</s><s>我會隨機生成一個四位數的不重複數值!</s><s>如果你未曾玩過「1A2B」，可以試試教學模式，透過此模式我會讓你了解遊戲規則。</s><s>順道一提，想直接挑戰的話就說聲「開始遊戲」接受挑戰八!</s></p></speak>`,
         text: '歡迎使用「1A2B猜數」!',}));}
         else{conv.ask(new SimpleResponse({               
         speech: `<speak><p><s>歡迎遊玩1A2B猜數!</s><s>本服務是Google助理版本的1A2B遊戲!</s><s>我會隨機生成一個四位數的不重複數值!</s><s>準備好就說聲「開始遊戲」接受挑戰八!</s></p></speak>`,
         text: '歡迎使用「1A2B猜數」!',}));}
   }
 conv.ask(new BasicCard({   
        title: '想猜猜看我想到什麼數字嗎?',
        subtitle:'本服務是Google助理版本的1A2B遊戲!  \n我會隨機生成一個四位數的不重複數值!  \n如果你未曾玩過請試試「教學模式」!', 
        text:'請鍵入任意標題',
        }));
 conv.ask(new Suggestions('🎮 開始遊戲','📝教學模式','👋 掰掰'));

  //將參數存入手機
conv.user.storage.sys_think=sys_think;
conv.user.storage.sys_think_1000=sys_think_1000;
conv.user.storage.sys_think_100=sys_think_100;
conv.user.storage.sys_think_10=sys_think_10;
conv.user.storage.sys_think_1=sys_think_1;
conv.user.storage.you_guess=you_guess;
conv.user.storage.guess_count=guess_count;
conv.user.storage.help_A_count=help_A_count;
conv.user.storage.help_B_count=help_B_count;
conv.user.storage.help_number=help_number;
conv.user.storage.now_input=now_input;
conv.user.storage.now_hint=now_hint;
conv.user.storage.last_input=last_input;
conv.user.storage.last_hint=last_hint;
conv.user.storage.before_input=before_input;
conv.user.storage.before_hint=before_hint;
conv.user.storage.far_input=before_hint;
conv.user.storage.far_hint=far_hint;
conv.user.storage.answer_input=answer_input;
conv.user.storage.menu=menu;
conv.user.storage.end_game=end_game;
conv.user.storage.teach_mode=teach_mode;
conv.user.storage.try_count=try_count;
});

app.intent('生成數字', (conv,{input}) => {
 //將參數上載到函式上
sys_think=conv.user.storage.sys_think;
sys_think_1000=conv.user.storage.sys_think_1000;
sys_think_100=conv.user.storage.sys_think_100;
sys_think_10=conv.user.storage.sys_think_10;
sys_think_1=conv.user.storage.sys_think_1;
you_guess=conv.user.storage.you_guess;
guess_count=conv.user.storage.guess_count;
help_A_count=conv.user.storage.help_A_count;
help_B_count=conv.user.storage.help_B_count;
help_number=conv.user.storage.help_number;
now_input=conv.user.storage.now_input;
now_hint=conv.user.storage.now_hint;
last_input=conv.user.storage.last_input;
last_hint=conv.user.storage.last_hint;
before_input=conv.user.storage.before_input;
before_hint=conv.user.storage.before_hint;
far_input=conv.user.storage.before_hint;
far_hint=conv.user.storage.far_hint;
answer_input=conv.user.storage.answer_input;
menu=conv.user.storage.menu;
end_game=conv.user.storage.end_game;
teach_mode=conv.user.storage.teach_mode;
try_count=conv.user.storage.try_count;
  
 if(input==='教學模式'){teach_mode=true;menu=true;answer_input=false;end_game=false;try_count=0;}
 if(input==='回到一般模式'){
    conv.ask(new SimpleResponse({speech:`<speak><p><s>試著挑戰看看八!你隨時可以對我說<break time="0.1s"/>提示<break time="0.1s"/>來取得簡易說明。</s></p></speak>`,text: '試著挑戰看看吧!\n隨時可以說「提示」來取得簡易說明。',}));
   teach_mode=false;menu=true;answer_input=false;end_game=false;guess_count=0;}
 if(menu===false&&answer_input===false&&end_game===true&&input==='重新開始'){menu=true;answer_input=false;end_game=false;teach_mode=false;guess_count=0;}
  
 if(menu===true&&answer_input===false&&end_game===false){
  menu=false;answer_input=false;end_game=false;
 A_count=0;B_count=0; now_input=''; now_hint=''; last_input=''; last_hint='';before_input=''; before_hint='';far_input=''; far_hint='';

 sys_think_1000=ranFun(); //千位數
 sys_think_100=ranFun();  //百位數
 sys_think_10=ranFun();   //十位數
 sys_think_1=ranFun();    //個位數
 if(sys_think_1000===sys_think_100){sys_think_100++;}
 if(sys_think_1000===sys_think_10){sys_think_10++;}
 if(sys_think_1000===sys_think_1){sys_think_1++;}
 if(sys_think_100===sys_think_10){sys_think_10++;}
 if(sys_think_100===sys_think_1){sys_think_1++;}
 if(sys_think_10===sys_think_1){sys_think_1++;}
 sys_think_1000=sys_think_1000%10;  //千位數
 sys_think_100=sys_think_100%10;  //百位數
 sys_think_10=sys_think_10%10;  //十位數
 sys_think_1=sys_think_1%10;   //個位數
 if(sys_think_1000===sys_think_100){sys_think_100++;}
 if(sys_think_1000===sys_think_10){sys_think_10++;}
 if(sys_think_1000===sys_think_1){sys_think_1++;}
 if(sys_think_100===sys_think_10){sys_think_10++;}
 if(sys_think_100===sys_think_1){sys_think_1++;}
 if(sys_think_10===sys_think_1){sys_think_1++;}
   
 sys_think=String((sys_think_1000*1000)+(sys_think_100*100)+(sys_think_10*10)+sys_think_1);//系統生成的實際數字
  
  //輸出卡片
  
  if(teach_mode===false){
  conv.ask(new SimpleResponse({speech:`<speak><audio src="https://k007.kiwi6.com/hotlink/11dyop26gh/numberdecide.mp3"/><p><s>我想好啦!</s><s>來猜猜看八!</s><s>數字區間為<say-as interpret-as="characters">0123</say-as>到<say-as interpret-as="characters">9876</say-as></s><s>輸入後，我會提示你是否與答案相符!</s></p></speak>`,text: '我已經想好囉!',}));
  conv.ask(new BasicCard({ title:'數字區間：0123~9876',subtitle:'你可以開始猜了!\n輸入後，我會提示你是否與答案相符!\n透過語音輸入數字可能會辨識錯誤，\n當前正致力改善中。\n想放棄此回合請說「放棄」或「看答案」',text:'**_[!]你可以自行輸入或點選下方的建議卡片_**'}));
  sys_guess=String(ranGuess());
  conv.ask(new Suggestions(sys_guess));
  }
  else{    try_count=0;
  conv.ask(new SimpleResponse({speech:`<speak><p><s>歡迎使用教學模式</s><s>在這裡，我會引導你來瞭解本遊戲的規則。</s><break time="0.6s"/><s>簡單來說，這個遊戲是透過兩個數字來提示你的推理遊戲。</s><s>推理目標就是一個隨機的四位數字<break time="0.3s"/>例如<break time="0.3s"/><say-as interpret-as="characters">${sys_think}</say-as></s><break time="0.7s"/><s>每個位元的數字自0~9隨機選出，而這四位元數字彼此又不重複。共有5040種可能性。</s><break time="0.3s"/><s>因此<break time="0.3s"/>透過1A2B的遊戲機制，能提示你是否接近唯一的答案。</s><s>接著，請輕觸下方的建議卡片讓我來繼續說明。</s></p></speak>`,text: '《教學模式》(Beta)',}));
  conv.ask(new Table({
             title: '《遊戲說明》',
             subtitle:'\n遊戲開始時，會產生一個四位數字，其中：\n•每個數字範圍：0~9\n•數字間關係：彼此不能重複\n•整體範圍：0123~9876\n•答案可能性：5040種', 
             columns: [ {header: '位元',align: 'CENTER',},{header: '千位數',align: 'CENTER',},{header: '百位數',align: 'CENTER',},{header: '十位數',align: 'CENTER',},{header: '個位數',align: 'CENTER',}],
             rows: [
               {cells: ['範例', String(sys_think_1000), String(sys_think_100),String(sys_think_10),String(sys_think_1)],
                 dividerAfter: false,}],
             buttons: new Button({
             title: '1A2B的數學分析',
             url: 'https://blog.xuite.net/johns_lin/twblog/150503057'
  }),
  }));
 
  conv.ask(new Suggestions('請按這裡來繼續教學'));     
      
  }
}
 else if(menu===false&&answer_input===false&&end_game===false){
    conv.ask('只能輸入數字而已喔!');
     if(teach_mode===false){
                   conv.ask(new Table({
                   title: '非法輸入數值',
                   subtitle:'  \n◎前三次輸入紀錄：',
                   columns: [{header: '輸入數值',align: 'CENTER',},{header: '提示',align: 'CENTER',},],
                   rows: [{cells: [last_input, last_hint],dividerAfter: false,},
                          {cells: [before_input, before_hint],dividerAfter: false,},
                          {cells: [far_input, far_hint],},],
                 }));                                                              
   //儲存這次的輸入與提示
   now_input='非法輸入';
   now_hint='──';
    sys_guess=String(ranGuess());
    conv.ask(new Suggestions(sys_guess));     
	}
   else{ conv.ask(new BasicCard({ title: '你剛剛輸入：非法輸入數值 \n我的提示是：────',
                          subtitle:'請特別注意，在遊玩時不要輸入非數字之文字!',     
                          text:'若沒有問題，您可以繼續猜測數字摸索!',						  
                        }));
	sys_guess=String(ranGuess());
    conv.ask(new Suggestions(sys_guess));
	}
 }
  else{conv.ask('輸入錯誤喔!  \n請重新輸入，謝謝!');}
  //將參數存入手機
conv.user.storage.sys_think=sys_think;
conv.user.storage.sys_think_1000=sys_think_1000;
conv.user.storage.sys_think_100=sys_think_100;
conv.user.storage.sys_think_10=sys_think_10;
conv.user.storage.sys_think_1=sys_think_1;
conv.user.storage.you_guess=you_guess;
conv.user.storage.guess_count=guess_count;
conv.user.storage.help_A_count=help_A_count;
conv.user.storage.help_B_count=help_B_count;
conv.user.storage.help_number=help_number;
conv.user.storage.now_input=now_input;
conv.user.storage.now_hint=now_hint;
conv.user.storage.last_input=last_input;
conv.user.storage.last_hint=last_hint;
conv.user.storage.before_input=before_input;
conv.user.storage.before_hint=before_hint;
conv.user.storage.far_input=before_hint;
conv.user.storage.far_hint=far_hint;
conv.user.storage.answer_input=answer_input;
conv.user.storage.menu=menu;
conv.user.storage.end_game=end_game;
conv.user.storage.teach_mode=teach_mode;
conv.user.storage.try_count=try_count;
});

app.intent('輸入數字', (conv,{any}) => {
 //將參數上載到函式上
sys_think=conv.user.storage.sys_think;
sys_think_1000=conv.user.storage.sys_think_1000;
sys_think_100=conv.user.storage.sys_think_100;
sys_think_10=conv.user.storage.sys_think_10;
sys_think_1=conv.user.storage.sys_think_1;
you_guess=conv.user.storage.you_guess;
you_guess_1000=conv.user.storage.help_1000;
you_guess_100=conv.user.storage.help_100;
you_guess_10=conv.user.storage.help_10;
you_guess_1=conv.user.storage.help_1;
guess_count=conv.user.storage.guess_count;
help_A_count=conv.user.storage.help_A_count;
help_B_count=conv.user.storage.help_B_count;
help_number=conv.user.storage.help_number;
now_input=conv.user.storage.now_input;
now_hint=conv.user.storage.now_hint;
last_input=conv.user.storage.last_input;
last_hint=conv.user.storage.last_hint;
before_input=conv.user.storage.before_input;
before_hint=conv.user.storage.before_hint;
far_input=conv.user.storage.before_hint;
far_hint=conv.user.storage.far_hint;
answer_input=conv.user.storage.answer_input;
menu=conv.user.storage.menu;
end_game=conv.user.storage.end_game;
teach_mode=conv.user.storage.teach_mode;
try_count=conv.user.storage.try_count;
  
 if(menu===false&&answer_input===false&&end_game===false){
    A_count=0;B_count=0;
   if(any==='1 2 3 4'){any=1234;}else if(any==='是是是是'){any=4444;}else if(any==='爸爸爸爸'){any=8888;}
   else if(any==='3 4 5 6'||any==='三四五六'){any=3456;}else if(any==='四五六七'){any=4567;}else if(any==='五六七八'){any=5678;}else if(any==='六七八九'){any=6789;}else if(any==='五六七'){any=567;}else if(any==='六七八'){any=678;}
   else if(any==='6 7 8 1'){any=6781;}else if(any==='7 8 9 1'){any=7891;}else if(any==='1 2 4 7'){any=1247;}else if(any==='1 3 5 7'){any=1357;}
   else if(any==='酒吧'){any=98;}else if(any==='股市'||any==='武士'){any=54;}else if(any==='林'||any==='零'){any=0;}
   else if(any==='五一八六'){any=5186;}else if(any==='四四二三'){any=4423;}else if(any==='是三張三'){any=4343;}
   else if(any==='一八九五'){any=1895;}else if(any==='68 95'){any=6895;}else if(any==='七八九五'){any=7895;}else if(any==='98 95'){any=9895;}
   else if(any==='士林32'){any=4032;}else if(any==='士林'){any=40;}else if(any==='9 8 7 6'){any=9876;}else if(any==='七六五四'){any=7654;}else if(any==='四三二一'){any=4321;}
   else if(any==='一'){any=1;}else if(any==='二'){any=2;}else if(any==='三'){any=3;}else if(any==='四'||any==='是'){any=4;}else if(any==='五'||any==='無'){any=5;}
   else if(any==='六'){any=6;}else if(any==='七'||any==='奇'){any=7;}else if(any==='八'){any=8;}else if(any==='九'||any==='酒'){any=9;}else if(any==='十'||any==='什'||any==='食'){any=10;}
   else if(any==='40 50'){any=4050;}else if(any==='60 70'){any=6070;}else if(any==='70 80'){any=7080;}else if(any==='80 90'){any=8090;}
   else if(any==='48 52'){any=4852;}else if(any==='四八六七'){any=4867;}else if(any==='五八六七'){any=5867;}
   else if(any==='七八九寺'){any=7894;}
   else if(any==='三菱'){any=30;}else if(any==='一百'||any==='一佰'){any=100;}else if(any==='兩百'||any==='兩佰'||any==='二佰'||any==='二佰'){any=200;}
   else if(any==='三百'||any==='三佰'){any=300;}else if(any==='四百'||any==='四佰'){any=400;}else if(any==='五百'||any==='五佰'||any==='伍佰'||any==='伍百'){any=500;}
   else if(any==='六百'||any==='六佰'){any=600;}else if(any==='七百'||any==='七佰'){any=700;}else if(any==='八百'||any==='八佰'){any=800;}else if(any==='九百'||any==='九佰'){any=900;}
   else if(any==='一千'||any==='以前'){any=1000;}else if(any==='六千'){any=6000;}
   
   
   if(any!=='請按這裡來繼續教學'&&teach_mode===true&&try_count<=3){any='請按這裡來繼續教學';}
   if(any==='請按這裡來繼續教學'){
   if (try_count===0){any=String(ranGuess());}
   if (try_count===1){any=String(you_guess_1000)+String(sys_think_100)+String(sys_think_10)+String(you_guess_1);}
   if (try_count===2){any=String(sys_think_1000)+String(you_guess_1000)+String(sys_think_100)+String(you_guess_1);}
   if (try_count===3){any=String(sys_think_1000)+String(sys_think_100)+String(sys_think_10)+String(you_guess_1);}
   }
 number=parseInt(any);
 if(isNaN(number)===false){answer_input=true;}
   else{
      conv.ask(new SimpleResponse({speech:'只能輸入數字而已喔!',text:'只能輸入數字而已喔!\n若是語音輸入數字發生辨識錯誤,\n正在積極改善除錯中。'}));
        //原先上上一次的提示變成上上上一次
   far_input=before_input;
   far_hint=before_hint;
  //原先上一次的提示變成上上一次
   before_input=last_input;
   before_hint=last_hint;
  //原先這次的提示變成上一次
   last_input=now_input;
   last_hint=now_hint;
       if(teach_mode===false){
                   conv.ask(new Table({
                   title: '非法輸入數值',
                   subtitle:'  \n◎前三次輸入紀錄：',
                   columns: [{header: '輸入數值',align: 'CENTER',},{header: '提示',align: 'CENTER',},],
                   rows: [{cells: [last_input, last_hint],dividerAfter: false,},
                          {cells: [before_input, before_hint],dividerAfter: false,},
                          {cells: [far_input, far_hint],},],
                 }));                                                              
   //儲存這次的輸入與提示
   now_input='非法輸入';
   now_hint='──';
         sys_guess=String(ranGuess());
    conv.ask(new Suggestions(sys_guess)); 
	}
   else{ conv.ask(new BasicCard({ title: '你剛剛輸入：非法輸入數值 \n我的提示是：────', 
                          subtitle:'📝您正處於「教學模式」',
                          text:'**[!]請注意，在遊玩時請盡量不要輸入非數字之文字!**',						  
                        }));
        sys_guess=String(ranGuess());
				   conv.ask(new Suggestions(sys_guess));
	}
    
 }       

 }
  if(menu===false&&answer_input===true&&end_game===false){
  sign_1000=' ';sign_100=' ';sign_10=' ';sign_1=' ';
  guess_count++; //統計猜測次數+1
  you_guess=number;
  answer_input=false;
 
  new analysis(you_guess);
   
  //原先上上一次的提示變成上上上一次
   far_input=before_input;
   far_hint=before_hint;
  //原先上一次的提示變成上上一次
   before_input=last_input;
   before_hint=last_hint;
  //原先這次的提示變成上一次
   last_input=now_input;
   last_hint=now_hint;
 //正式輸出的畫面
   if(A_count<=3){
   
        if(teach_mode===false){
                   conv.ask(new SimpleResponse({speech:`<speak><p><s>你剛剛輸入的是<break time="0.2s"/><say-as interpret-as="characters">${you_guess}</say-as></s><s>提示你</s><s>${A_count}A${B_count}B</s></p></speak>`,text: '判定完成，提示你'+A_count+'A'+B_count+'B',}));
                   conv.ask(new Table({
                   title: you_guess+'   ('+A_count+'A'+B_count+'B)',
                   subtitle:'  \n◎前三次輸入紀錄：',
                   columns: [{header: '輸入數值',align: 'CENTER',},{header: '提示',align: 'CENTER',},],
                   rows: [{cells: [last_input, last_hint],dividerAfter: false,},
                          {cells: [before_input, before_hint],dividerAfter: false,},
                          {cells: [far_input, far_hint],},],
                 }));
                   sys_guess=String(ranGuess());
                   conv.ask(new Suggestions(sys_guess,'解釋「'+A_count+'A'+B_count+'B」的意思'));
				   
				  }else{
                help_Total=4;try_count++;   
				if(you_guess_1000===you_guess_100===you_guess_10===you_guess_1){help_Total=1;}
				else if(you_guess_1000===you_guess_100===you_guess_10){help_Total=2;}else if(you_guess_1000===you_guess_100===you_guess_1){help_Total=2;}
				else if(you_guess_1000===you_guess_10===you_guess_1){help_Total=2;}else if(you_guess_100===you_guess_10===you_guess_1){help_Total=2;}    
                else if(you_guess_1000===you_guess_100&&you_guess_10===you_guess_1){help_Total=2;}
                else if(you_guess_1000===you_guess_10&&you_guess_100===you_guess_1){help_Total=2;}
                else if(you_guess_1000===you_guess_1&&you_guess_100===you_guess_10){help_Total=2;}  
                else if(you_guess_1000===you_guess_100){help_Total=3;}else if(you_guess_1000===you_guess_10){help_Total=3;}else if(you_guess_1000===you_guess_1){help_Total=3;}
				else if(you_guess_100===you_guess_10){help_Total=3;}else if(you_guess_100===you_guess_1){help_Total=3;}else if(you_guess_10===you_guess_1){help_Total=3;}	
                else {help_Total=4;}
                    
				else_count=help_Total-(A_count+B_count);
                     
               if(A_count===0&&B_count===0){explained='沒有一個數值在答案中，這代表著剩下的其他'+(9-else_count)+'個數值有可能在答案中';}
               else if(A_count===0&&B_count===2){explained='有'+B_count+'個數字正確但位置不正確。因此現階段你要做的，就是讓他們到達正確位置。';}
               else if(A_count===2&&B_count===2){explained='有'+A_count+'個數字數值及位置正確。而'+B_count+'個數字正確但位置不正確。你只要找出位置顛倒的兩個數字並互換，就找到正確答案了!。';} 
               else if(A_count===0&&B_count===3){explained='有'+B_count+'個數字正確但位置不正確。只要將它們排列組合後就很接近正確答案了!';}
               else if(A_count===3&&B_count===0){explained='有'+A_count+'個數字數值及位置正確，暗示著，你只要排除現在已知的3個數字。就能拼湊出正確答案。';}
               else{explained='有'+A_count+'個數字數值及位置正確。而'+B_count+'個數字正確但位置不正確。剩下的'+else_count+'個數字則不在答案之中';}
              
               if (try_count===1){teach_title='教程1/4：初步認識 ('+A_count+'A'+B_count+'B)';
                                  teach_subtitle='\n首先，將「'+you_guess+'」進行比對後(見下表)。\n「A」：該位置數值在答案中且位置正確\n「B」：該位置數值在答案中但位置不正確';
                                  conv.ask(new SimpleResponse({speech:`<speak><p><s>非常好!你踏出了第一步。現在讓我來解釋這提示<break time="0.15s"/>${A_count}A${B_count}B<break time="0.15s"/>的意思。</s><break time="0.15s"/><s>假設你輸入<break time="0.15s"/><say-as interpret-as="characters">${you_guess}</say-as><break time="0.25s"/>將他與正確答案相較後，${explained}</s><break time="0.15s"/><s>隨著你輸入的次數越來越多，就能推斷出正確答案之組合。</s><s>接著，請輕觸下方的建議卡片繼續教學!</s></p></speak>`,text:'恭喜你踏出了第一步!'}));
                                 }
               else if (try_count===2){teach_title='教程2/4：位置正確 (A)';
                                  teach_subtitle='\n當數值處於正確位置時，\n因為4個位元間數值不能重複。\n所以需要推斷的數字範圍會縮小!';
                                 conv.ask(new SimpleResponse({speech:`<speak><p><s>我們來分析一下</s><break time="0.15s"/><s><say-as interpret-as="characters">${you_guess}</say-as><break time="0.35s"/>，將它與正確答案比對後，${explained}</s><break time="0.15s"/><s>你會發現，當數字處於正確位置時。因為這四個位元數值不能重複。所以需要推斷的數字範圍會縮小!</s><s>接著，請輕觸下方的建議卡片繼續教學!</s></p></speak>`,text:'是否慢慢抓到感覺了?'}));
                                
                                      }          
               else if (try_count===3){teach_title='教程3/4：位置錯誤 (B)';
                                  teach_subtitle='\n若數值於答案中但位置錯誤，\n將位置錯誤數值重新排列是首要任務。';
                                 conv.ask(new SimpleResponse({speech:`<speak><p><s>如果猜測的數字在答案中，但位置不正確時會有什麼提示ㄋ。</s><s>將你剛剛輸入的<break time="0.15s"/><say-as interpret-as="characters">${you_guess}</say-as><break time="0.15s"/>比對後，你會發現${explained}</s><break time="0.15s"/><s>而你要做的，就是確認已知的數字，並將位置錯誤的數字排列到正確位置。</s><s>接著，請輕觸下方的建議卡片繼續教學!</s></p></speak>`,text:'是否慢慢抓到感覺了?'}));
                                 } 
               else if (try_count===4){teach_title='教程4/4：接近答案 (3A0B)';
                                       teach_subtitle='\n排除已知的，從剩下6個數字中猜測即可。\n\n[!]請輕觸「回到一般模式」練習看看!';
                                       conv.ask(new SimpleResponse({speech:`<speak><p><s>接著，來看看當我們很靠近正確答案時會發生什麼事。</s><break time="0.15s"/><s>在輸入<say-as interpret-as="characters">${you_guess}</say-as>後<break time="0.15s"/>${explained}</s><break time="0.15s"/><s>我們的交程告一段落了!接下來帶領你的就是經驗的累積!</s><s>你可以輕觸下方的<break time="0.1s"/>回到一般模式<break time="0.1s"/>來面對真實挑戰，或試著輸入任意數值讓我繼續為你解說!</s></p></speak>`,text:'我們快接近答案了!'}));
                                       } 
               else{teach_title=you_guess+'   ('+A_count+'A'+B_count+'B)';
                    teach_subtitle='\n•「'+A_count+'」個數值在答案中且位置正確 (即'+A_count+'A)\n•「'+B_count+'」個數值在答案中但位置不正確 (即'+B_count+'B)\n•「'+else_count+'」個數值則不在答案中';
                    conv.ask(new SimpleResponse({speech:`<speak><p><s>這代表著，我將你剛剛輸入的數值<break time="0.15s"/><say-as interpret-as="characters">${you_guess}</say-as><break time="0.15s"/>與正確答案相較後，${explained}</s></p></speak>`,text:'說明如下：'}));sys_guess=String(ranGuess());}     
			  
              conv.ask(new Table({
               title: teach_title,
               subtitle:teach_subtitle, 
               columns: [ {header: '位元',align: 'CENTER',},{header: '千位數',align: 'CENTER',},{header: '百位數',align: 'CENTER',},{header: '十位數',align: 'CENTER',},{header: '個位數',align: 'CENTER',}],
               rows: [
                 {cells: ['正確答案', String(sys_think_1000), String(sys_think_100),String(sys_think_10),String(sys_think_1)],
             dividerAfter: false,},{
                   cells: ['輸入的值', String(you_guess_1000), String(you_guess_100),String(you_guess_10),String(you_guess_1)],
             dividerAfter: false,},{
                   cells: ['提示', sign_1000,sign_100,sign_10,sign_1],
             dividerAfter: false,} ]
       }));
				   
         if (try_count>=4){conv.ask(new Suggestions('🎮 回到一般模式',String(ranGuess())));	}
				   else{conv.ask(new Suggestions('請按這裡來繼續教學'));}		   
     }
   }
   else{
     end_game=true;
      if(teach_mode===false){
     conv.ask(new SimpleResponse({speech:`<speak><audio src="https://k007.kiwi6.com/hotlink/zg1dk8j6jk/end_guess.mp3"/><p><s>猜重拉!</s><s>這次你共猜測${guess_count}次!</s><s>要在玩一次嗎?</s></p></speak>`,text: '恭喜你猜到拉!',}));
     conv.ask(new BasicCard({   
                   image: new Image({url:'https://i.imgur.com/d26DwRi.png',alt:'Pictures',}),
                   title: '這次生成的數字是：'+sys_think,
		           subtitle:'猜測次數：'+guess_count,}));
          conv.ask(new Suggestions('🎮 重新開始','👋 掰掰'));
     guess_count=0;}
     else{
       conv.ask(new SimpleResponse({speech:`<speak><p><s>看來你輸入正確答案了!</s><s>你可以選擇蟲返一般模式，或者說<break time="0.15s"/>重頭開始<break time="0.15s"/>再次進行另一輪教學。</s></p></speak>`,text:'恭喜你猜到拉!'}));sys_guess=String(ranGuess());     
       conv.ask(new Table({
             title: you_guess+'   ('+A_count+'A'+B_count+'B)',
               subtitle:'\n•「'+A_count+'」個數值在答案中且位置正確 (即'+A_count+'A)\n•「'+B_count+'」個數值在答案中但位置不正確 (即'+B_count+'B)\n•這代表著你已經推斷出正確答案。', 
             columns: [ {header: '來源',align: 'CENTER',},{header: '千位數',align: 'CENTER',},{header: '百位數',align: 'CENTER',},{header: '十位數',align: 'CENTER',},{header: '個位數',align: 'CENTER',}],
               rows: [
                 {cells: ['正確答案', String(sys_think_1000), String(sys_think_100),String(sys_think_10),String(sys_think_1)],
             dividerAfter: false,},{
                   cells: ['輸入的值', String(you_guess_1000), String(you_guess_100),String(you_guess_10),String(you_guess_1)],
             dividerAfter: false,},{
                   cells: ['提示', sign_1000,sign_100,sign_10,sign_1],
             dividerAfter: false,} ]
       }));
     conv.ask(new Suggestions('🎮 回到一般模式','📝重頭開始'));
     
    }
 }
   //儲存這次的輸入與提示
   now_input=String(you_guess);
   now_hint=A_count+'A'+B_count+'B';
   
   //儲存這次數值用來解釋意義
   help_A_count=A_count;
   help_B_count=B_count;
   help_number=number;
 }
 else if(menu===true&&answer_input===false&&end_game===false){conv.ask(new SimpleResponse({speech:'請對我說、開始遊戲、或、掰掰、進行相關操作!',text:'請重新輸入，謝謝!'}));conv.ask(new Suggestions('🎮 開始遊戲','📝教學模式','👋 掰掰'));}
 else if(menu===false&&answer_input===false&&end_game===true){conv.ask(new SimpleResponse({speech:'請對我說、重新開始、或、掰掰、進行相關操作!',text:'請重新輸入，謝謝!'}));conv.ask(new Suggestions('🎮 重新開始','👋 掰掰'));}
  //將參數存入手機
conv.user.storage.sys_think=sys_think;
conv.user.storage.sys_think_1000=sys_think_1000;
conv.user.storage.sys_think_100=sys_think_100;
conv.user.storage.sys_think_10=sys_think_10;
conv.user.storage.sys_think_1=sys_think_1;
conv.user.storage.help_1000=you_guess_1000;
conv.user.storage.help_100=you_guess_100;
conv.user.storage.help_10=you_guess_10;
conv.user.storage.help_1=you_guess_1;
conv.user.storage.you_guess=you_guess;
conv.user.storage.guess_count=guess_count;
conv.user.storage.help_A_count=help_A_count;
conv.user.storage.help_B_count=help_B_count;
conv.user.storage.help_number=help_number;
conv.user.storage.now_input=now_input;
conv.user.storage.now_hint=now_hint;
conv.user.storage.last_input=last_input;
conv.user.storage.last_hint=last_hint;
conv.user.storage.before_input=before_input;
conv.user.storage.before_hint=before_hint;
conv.user.storage.far_input=before_hint;
conv.user.storage.far_hint=far_hint;
conv.user.storage.answer_input=answer_input;
conv.user.storage.menu=menu;
conv.user.storage.end_game=end_game;
conv.user.storage.teach_mode=teach_mode;
conv.user.storage.try_count=try_count;
});

app.intent('解釋意思', (conv) => {
//將參數上載到函式上
sys_think=conv.user.storage.sys_think;
sys_think_1000=conv.user.storage.sys_think_1000;
sys_think_100=conv.user.storage.sys_think_100;
sys_think_10=conv.user.storage.sys_think_10;
sys_think_1=conv.user.storage.sys_think_1;
help_1000=conv.user.storage.help_1000;
help_100=conv.user.storage.help_100;
help_10=conv.user.storage.help_10;
help_1=conv.user.storage.help_1;
you_guess=conv.user.storage.you_guess;
guess_count=conv.user.storage.guess_count;
help_A_count=conv.user.storage.help_A_count;
help_B_count=conv.user.storage.help_B_count;
help_number=conv.user.storage.help_number;
now_input=conv.user.storage.now_input;
now_hint=conv.user.storage.now_hint;
last_input=conv.user.storage.last_input;
last_hint=conv.user.storage.last_hint;
before_input=conv.user.storage.before_input;
before_hint=conv.user.storage.before_hint;
far_input=conv.user.storage.before_hint;
far_hint=conv.user.storage.far_hint;
answer_input=conv.user.storage.answer_input;
menu=conv.user.storage.menu;
end_game=conv.user.storage.end_game;
				help_Total=4; 
				if(help_1000===help_100===help_10===help_1){help_Total=1;}
				else if(help_1000===help_100===help_10){help_Total=2;}else if(help_1000===help_100===help_1){help_Total=2;}
				else if(help_1000===help_10===help_1){help_Total=2;}else if(help_100===help_10===help_1){help_Total=2;}    
                else if(help_1000===help_100&&help_10===help_1){help_Total=2;}
                else if(help_1000===help_10&&help_100===help_1){help_Total=2;}
                else if(help_1000===help_1&&help_100===help_10){help_Total=2;}  
                else if(help_1000===help_100){help_Total=3;}else if(help_1000===help_10){help_Total=3;}else if(help_1000===help_1){help_Total=3;}
				else if(help_100===help_10){help_Total=3;}else if(help_100===help_1){help_Total=3;}else if(help_10===help_1){help_Total=3;}	
                else {help_Total=4;}
  
				else_count=help_Total-(help_A_count+help_B_count);
                  
               if(help_A_count===0&&help_B_count===0){explained='沒有一個數值在答案中，這代表著剩下的其他'+(9-else_count)+'個數值有可能在答案中';}
               else if(help_A_count===0&&help_B_count===2){explained='有'+help_B_count+'個數字正確但位置不正確。因此現階段你要做的，就是讓他們到達正確位置。';} 
               else if(help_A_count===2&&help_B_count===2){explained='有'+help_A_count+'個數字數值及位置正確。而'+help_B_count+'個數字正確但位置不正確。這暗示著，只要找出位置顛倒的兩個數字並互換，就找到正確答案了!。';}
               else if(help_A_count===0&&help_B_count===3){explained='有'+help_B_count+'個數字正確但位置不正確。這暗示你，只要將它們排列組合後，就非常接近正確答案了!';}
               else if(help_A_count===3&&help_B_count===0){explained='有'+help_A_count+'個數字數值及位置正確，代表說，你只要排除現在已知的3個數字。就能拼湊出正確答案。';}
               else{explained='有'+help_A_count+'個數字數值及位置正確。而'+help_B_count+'個數字正確但位置不正確。';}
               conv.ask(new SimpleResponse({speech:`<speak><p><s>這代表著，我將你剛剛輸入的數值<break time="0.15s"/><say-as interpret-as="characters">${you_guess}</say-as><break time="0.15s"/>與正確答案相較後，${explained}</s></p></speak>`,text:'說明如下：'}));
               conv.ask(new BasicCard({ title: '你剛剛輸入：'+help_number+'  \n我的提示是：'+help_A_count+'A'+help_B_count+'B',
                          subtitle:'\n這代表著，將「'+help_number+'」與正確答案相較後：\n•「'+help_A_count+'」個數值在答案中且位置正確\n•「'+help_B_count+'」個數值在答案中但位置不正確\n•「'+else_count+'」個數值則不在答案中',     
                          text:'**[!]注意：重複輸入的數值會取位元較高的來比較。若你仍無法理解，請試試新推出的「教學模式」!**',
                        }));
sys_guess=String(ranGuess());
conv.ask(new Suggestions('📝教學模式',sys_guess));
  //將參數存入手機
conv.user.storage.sys_think=sys_think;
conv.user.storage.sys_think_1000=sys_think_1000;
conv.user.storage.sys_think_100=sys_think_100;
conv.user.storage.sys_think_10=sys_think_10;
conv.user.storage.sys_think_1=sys_think_1;
conv.user.storage.help_1000=help_1000;
conv.user.storage.help_100=help_100;
conv.user.storage.help_10=help_10;
conv.user.storage.help_1=help_1;
conv.user.storage.you_guess=you_guess;
conv.user.storage.guess_count=guess_count;
conv.user.storage.help_A_count=help_A_count;
conv.user.storage.help_B_count=help_B_count;
conv.user.storage.help_number=help_number;
conv.user.storage.now_input=now_input;
conv.user.storage.now_hint=now_hint;
conv.user.storage.last_input=last_input;
conv.user.storage.last_hint=last_hint;
conv.user.storage.before_input=before_input;
conv.user.storage.before_hint=before_hint;
conv.user.storage.far_input=before_hint;
conv.user.storage.far_hint=far_hint;
conv.user.storage.answer_input=answer_input;
conv.user.storage.menu=menu;
conv.user.storage.end_game=end_game;

});

app.intent('錯誤回應反饋', (conv) => {
 //將參數上載到函式上
sys_think=conv.user.storage.sys_think;
sys_think_1000=conv.user.storage.sys_think_1000;
sys_think_100=conv.user.storage.sys_think_100;
sys_think_10=conv.user.storage.sys_think_10;
sys_think_1=conv.user.storage.sys_think_1;
you_guess=conv.user.storage.you_guess;
guess_count=conv.user.storage.guess_count;
help_A_count=conv.user.storage.help_A_count;
help_B_count=conv.user.storage.help_B_count;
help_number=conv.user.storage.help_number;
now_input=conv.user.storage.now_input;
now_hint=conv.user.storage.now_hint;
last_input=conv.user.storage.last_input;
last_hint=conv.user.storage.last_hint;
before_input=conv.user.storage.before_input;
before_hint=conv.user.storage.before_hint;
far_input=conv.user.storage.before_hint;
far_hint=conv.user.storage.far_hint;
answer_input=conv.user.storage.answer_input;
menu=conv.user.storage.menu;
end_game=conv.user.storage.end_game;
//原先上上一次的提示變成上上上一次
   far_input=before_input;
   far_hint=before_hint;
  //原先上一次的提示變成上上一次
   before_input=last_input;
   before_hint=last_hint;
  //原先這次的提示變成上一次
   last_input=now_input;
   last_hint=now_hint;
 if(menu===true&&answer_input===false&&end_game===false){conv.ask(new SimpleResponse({speech:'請對我說、開始遊戲、或、掰掰、進行相關操作!',text:'請重新輸入，謝謝!'}));conv.ask(new Suggestions('🎮 開始遊戲','👋 掰掰'));}
 else if(menu===false&&answer_input===false&&end_game===true){conv.ask(new SimpleResponse({speech:'請對我說、重新開始、或、掰掰、進行相關操作!',text:'請重新輸入，謝謝!'}));conv.ask(new Suggestions('🎮 重新開始','👋 掰掰'));}
 else if(menu===false&&answer_input===false&&end_game===false){conv.ask('只能輸入數字而已喔!');
   //原先上上一次的提示變成上上上一次
   far_input=before_input;
   far_hint=before_hint;
  //原先上一次的提示變成上上一次
   before_input=last_input;
   before_hint=last_hint;
  //原先這次的提示變成上一次
   last_input=now_input;
   last_hint=now_hint;
     conv.ask(new Table({
                   title: '非法輸入數值',
                   subtitle:'  \n◎前三次輸入紀錄：',
                   columns: [{header: '輸入數值',align: 'CENTER',},{header: '提示',align: 'CENTER',},],
                   rows: [{cells: [last_input, last_hint],dividerAfter: false,},
                          {cells: [before_input, before_hint],dividerAfter: false,},
                          {cells: [far_input, far_hint],},],
                 }));
                                                               
   //儲存這次的輸入與提示
   now_input='NaN';
   now_hint='──';
    sys_guess=String(ranGuess());
    conv.ask(new Suggestions(sys_guess));                           
    }
 else{conv.ask('輸入錯誤喔!  \n請重新輸入，謝謝!');}
  
//將參數存入手機
conv.user.storage.sys_think=sys_think;
conv.user.storage.sys_think_1000=sys_think_1000;
conv.user.storage.sys_think_100=sys_think_100;
conv.user.storage.sys_think_10=sys_think_10;
conv.user.storage.sys_think_1=sys_think_1;
conv.user.storage.you_guess=you_guess;
conv.user.storage.guess_count=guess_count;
conv.user.storage.help_A_count=help_A_count;
conv.user.storage.help_B_count=help_B_count;
conv.user.storage.help_number=help_number;
conv.user.storage.now_input=now_input;
conv.user.storage.now_hint=now_hint;
conv.user.storage.last_input=last_input;
conv.user.storage.last_hint=last_hint;
conv.user.storage.before_input=before_input;
conv.user.storage.before_hint=before_hint;
conv.user.storage.far_input=before_hint;
conv.user.storage.far_hint=far_hint;
conv.user.storage.answer_input=answer_input;
conv.user.storage.menu=menu;
conv.user.storage.end_game=end_game;
});

app.intent('顯示答案', (conv) => {
 //將參數上載到函式上
sys_think=conv.user.storage.sys_think;
sys_think_1000=conv.user.storage.sys_think_1000;
sys_think_100=conv.user.storage.sys_think_100;
sys_think_10=conv.user.storage.sys_think_10;
sys_think_1=conv.user.storage.sys_think_1;
you_guess=conv.user.storage.you_guess;
guess_count=conv.user.storage.guess_count;
help_A_count=conv.user.storage.help_A_count;
help_B_count=conv.user.storage.help_B_count;
help_number=conv.user.storage.help_number;
now_input=conv.user.storage.now_input;
now_hint=conv.user.storage.now_hint;
last_input=conv.user.storage.last_input;
last_hint=conv.user.storage.last_hint;
before_input=conv.user.storage.before_input;
before_hint=conv.user.storage.before_hint;
far_input=conv.user.storage.before_hint;
far_hint=conv.user.storage.far_hint;
answer_input=conv.user.storage.answer_input;
menu=conv.user.storage.menu;
end_game=conv.user.storage.end_game;
  
menu=false;answer_input=false;end_game=true;
  
     conv.ask(new SimpleResponse({speech:`<speak><p><s>這次生成的答案是<break time="0.15s"/><say-as interpret-as="characters">${sys_think}</say-as>!</s><s>這回合中，你共猜測${guess_count}次!</s><s>你想在試一次嗎?</s></p></speak>`,text: '這次生成的答案如下：',}));	           
     conv.ask(new Table({
             title: '你想再試一次嗎?',
             subtitle:'猜測次數：'+guess_count,
             columns: [ {header:'位元',align: 'CENTER',},{header: '千位數',align: 'CENTER',},{header: '百位數',align: 'CENTER',},{header: '十位數',align: 'CENTER',},{header: '個位數',align: 'CENTER',}],
             rows: [
               {cells: ['本次答案', String(sys_think_1000), String(sys_think_100),String(sys_think_10),String(sys_think_1)],
                 dividerAfter: false,}],
  }));  
  
     conv.ask(new Suggestions('🎮 重新開始','👋 掰掰'));
     guess_count=0;
//將參數存入手機
conv.user.storage.sys_think=sys_think;
conv.user.storage.sys_think_1000=sys_think_1000;
conv.user.storage.sys_think_100=sys_think_100;
conv.user.storage.sys_think_10=sys_think_10;
conv.user.storage.sys_think_1=sys_think_1;
conv.user.storage.you_guess=you_guess;
conv.user.storage.guess_count=guess_count;
conv.user.storage.help_A_count=help_A_count;
conv.user.storage.help_B_count=help_B_count;
conv.user.storage.help_number=help_number;
conv.user.storage.now_input=now_input;
conv.user.storage.now_hint=now_hint;
conv.user.storage.last_input=last_input;
conv.user.storage.last_hint=last_hint;
conv.user.storage.before_input=before_input;
conv.user.storage.before_hint=before_hint;
conv.user.storage.far_input=before_hint;
conv.user.storage.far_hint=far_hint;
conv.user.storage.answer_input=answer_input;
conv.user.storage.menu=menu;
conv.user.storage.end_game=end_game;
});

app.intent('給予教學之提示', (conv) => {
 //將參數上載到函式上
sys_think=conv.user.storage.sys_think;
sys_think_1000=conv.user.storage.sys_think_1000;
sys_think_100=conv.user.storage.sys_think_100;
sys_think_10=conv.user.storage.sys_think_10;
sys_think_1=conv.user.storage.sys_think_1;
you_guess=conv.user.storage.you_guess;
guess_count=conv.user.storage.guess_count;
help_A_count=conv.user.storage.help_A_count;
help_B_count=conv.user.storage.help_B_count;
help_number=conv.user.storage.help_number;
now_input=conv.user.storage.now_input;
now_hint=conv.user.storage.now_hint;
last_input=conv.user.storage.last_input;
last_hint=conv.user.storage.last_hint;
before_input=conv.user.storage.before_input;
before_hint=conv.user.storage.before_hint;
far_input=conv.user.storage.before_hint;
far_hint=conv.user.storage.far_hint;
answer_input=conv.user.storage.answer_input;
menu=conv.user.storage.menu;
end_game=conv.user.storage.end_game;
teach_mode=conv.user.storage.teach_mode;
try_count=conv.user.storage.try_count;
//原先上上一次的提示變成上上上一次
   far_input=before_input;
   far_hint=before_hint;
  //原先上一次的提示變成上上一次
   before_input=last_input;
   before_hint=last_hint;
  //原先這次的提示變成上一次
   last_input=now_input;
   last_hint=now_hint;
  conv.ask(new SimpleResponse({speech: '如果你還是不明白，可以試試教學模式',text: '如果你還是不明白，\n可以試試「教學模式」',}));
  conv.ask(new Table({
                   title: '想試試看「教學模式」嗎?',
                   subtitle:'  \n◎前三次輸入紀錄：',
                   columns: [{header: '輸入數值',align: 'CENTER',},{header: '提示',align: 'CENTER',},],
                   rows: [{cells: [last_input, last_hint],dividerAfter: false,},
                          {cells: [before_input, before_hint],dividerAfter: false,},
                          {cells: [far_input, far_hint],},],
                 }));
  //儲存這次的輸入與提示
   now_input='NaN';
   now_hint='──';
                   sys_guess=String(ranGuess());
                   conv.ask(new Suggestions(sys_guess,'📝教學模式'));
//將參數存入手機
conv.user.storage.sys_think=sys_think;
conv.user.storage.sys_think_1000=sys_think_1000;
conv.user.storage.sys_think_100=sys_think_100;
conv.user.storage.sys_think_10=sys_think_10;
conv.user.storage.sys_think_1=sys_think_1;
conv.user.storage.you_guess=you_guess;
conv.user.storage.guess_count=guess_count;
conv.user.storage.help_A_count=help_A_count;
conv.user.storage.help_B_count=help_B_count;
conv.user.storage.help_number=help_number;
conv.user.storage.now_input=now_input;
conv.user.storage.now_hint=now_hint;
conv.user.storage.last_input=last_input;
conv.user.storage.last_hint=last_hint;
conv.user.storage.before_input=before_input;
conv.user.storage.before_hint=before_hint;
conv.user.storage.far_input=before_hint;
conv.user.storage.far_hint=far_hint;
conv.user.storage.answer_input=answer_input;
conv.user.storage.menu=menu;
conv.user.storage.end_game=end_game;  
});


app.intent('結束對話', (conv) => {
    conv.user.storage = {}; //離開同時清除暫存資料
    conv.ask('希望你玩得愉快!');
   conv.ask(new SimpleResponse({speech: '下次見',text: '下次見 👋',}));
       conv.close(new BasicCard({   
        title: '感謝您的使用!', 
        text:'如果有任何需要改進的地方，  \n歡迎到簡介頁面評分或給予反饋，謝謝!',
        buttons: new Button({title: '開啟本程式的商店頁面',url: 'https://assistant.google.com/services/a/uid/00000052af06dae7',}),
  })); 
    
});
  
  
// Set the DialogflowApp object to handle the HTTPS POST request.
exports.dialogflowFirebaseFulfillment = functions.https.onRequest(app);