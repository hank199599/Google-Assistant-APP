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
const i18n = require('i18n');
const replaceString = require('replace-string');

// Instantiate the Dialogflow client.
const app = dialogflow({debug: true});

i18n.configure({
  locales: ['zh-TW','zh-CN','zh-HK','en','ja-JP'],
  directory: __dirname + '/locales',
  defaultLocale: 'en',
});
app.middleware((conv) => {
  i18n.setLocale(conv.user.locale);
});

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

var ran_think=0;     //生成隨機猜測的數字
var ran_think_1000=0;//生成千位數
var ran_think_100=0; //生成百位數
var ran_think_10=0;  //生成十位數
var ran_think_1=0;   //生成個位數


var sys_guess=0;     //系統隨機生成一個數字幫忙找
var sys_guess1=0;     //系統隨機生成一個數字幫忙找
var sys_guess2=0;     //系統隨機生成一個數字幫忙找

var sys_error1=0;     //教學模式:系統隨機猜想的錯誤數字1
var sys_error2=0;     //教學模式:系統隨機猜想的錯誤數字2

var guess_count=0;//統計猜測次數
var A_count=0; //位置正確，且數字正確的數值數目
var B_count=0; //位置不正確，但數字正確的數值數目

var origin =[]; var result=[]; //計數用

//解釋意義用
var new_be=false;
var help_1000=0;var help_100=0; var help_10=0;  var help_1=0;   
var help_A_count=0;var help_B_count=0;var help_number=0; 
var help_Total=4; var explained='';//解釋比較結果
var sign_1000='';var sign_100='';var sign_10='';var sign_1='';
var else_count=0;var try_count=0;var teach_title='';var teach_subtitle='';
var help_sign_1000='';var help_sign_100='';var help_sign_10='';var help_sign_1='';
var output_array="";
//教學模式
var teach_mode=false;
var teach_1000=0;var teach_100=0;var teach_10=0;var teach_1=0;
var selector="";var section="";var Q="";

//這次輸入的數值與提示
var now_input=''; var now_hint='';
//上次的數值與提示
var last_input='';var last_hint='';
//前第二次輸入的數值與提示
var before_input='';var before_hint='';
//前第三次輸入的數值與提示
var far_input='';var far_hint='';
//前第四次輸入的數值與提示
var far_input1='';var far_hint1='';
//前第五次輸入的數值與提示
var far_input2='';var far_hint2='';

var answer_input=false; //用於檢查輸入是否正確
var menu=true; //用於檢查輸入是否正確
var end_game=false; //用於檢查輸入是否正確
var example_1='';//用於示範
var example_2='';//
var inputarray=[];
var array=[0,1,2,3,4,5,6,7,8,9];
var temp=[];
var i=0;
var number=0;
var countdown=0; 
var take_out=0;

function ranFun(){return parseInt(Math.random()*9);}

function take(i){
for(countdown=array.length-i;countdown>1;countdown--)  
{temp.push(array.pop());}
take_out=array.pop();
for(countdown=temp.length;countdown>0;countdown--)  
{array.push(temp.pop());}
return take_out;
}

function ranGuess(){
 array=[0,1,2,3,4,5,6,7,8,9];
 ran_think_1000=take(parseInt(Math.random()*9));
 ran_think_100=take(parseInt(Math.random()*8));
 ran_think_10=take(parseInt(Math.random()*7));
 ran_think_1=take(parseInt(Math.random()*6));  
 return String((ran_think_1000*1000)+(ran_think_100*100)+(ran_think_10*10)+ran_think_1);//系統生成的實際數字

}

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
 A_count=A_count%5;
 B_count=B_count%5;
}


function Num(x,y){
let array = Array(x),
    indexs = array.keys(),
    result = [...Array(y).keys()].slice(x+1)
//  输出结果
return result
}

//歡迎畫面
app.intent('預設歡迎語句', (conv) => { 
  menu=true;answer_input=false;end_game=true;teach_mode=false;try_count=0;
  A_count=0;B_count=0; now_input=''; now_hint=''; last_input=''; last_hint='';before_input=''; before_hint='';far_input=''; far_hint='';
  far_input1=''; far_hint1='';far_input2=''; far_hint2='';  guess_count=0;

if(conv.screen===true){ 

    if (conv.user.last.seen) {
	   menu=false;answer_input=false;end_game=false;new_be=false;

	 //產生隨機數字
	 array=[0,1,2,3,4,5,6,7,8,9];
	 sys_think_1000=take(parseInt(Math.random()*9));
	 sys_think_100=take(parseInt(Math.random()*8));
	 sys_think_10=take(parseInt(Math.random()*7));
	 sys_think_1=take(parseInt(Math.random()*6));  

     sys_think=String((sys_think_1000*1000)+(sys_think_100*100)+(sys_think_10*10)+sys_think_1);//系統生成的實際數字

	sys_guess=String(ranGuess());
	sys_guess1=String(ranGuess());
	sys_guess2=String(ranGuess());
  conv.ask(new SimpleResponse({speech:`<speak><audio src="https://firebasestorage.googleapis.com/v0/b/hank199599.appspot.com/o/undecided-numbers.mp3?alt=media"/><p><s>${i18n.__('Start1')}</s><s>${i18n.__('Start2')}</s><s>${i18n.__('Start3')}<say-as interpret-as="characters">0123</say-as>${i18n.__('TO')}<say-as interpret-as="characters">9876</say-as></s><s>${i18n.__('Start4')}</s></p></speak>`,text: i18n.__('StartText'),}));

  conv.ask(new Suggestions("123",sys_guess,sys_guess1,sys_guess2,"9876"));
 
  conv.ask(new BasicCard({ title:i18n.__('StartTitle'),subtitle:i18n.__('StartSubtitle'),text:i18n.__('Start_text')}));

  } else {
	   
	   new_be=false;
         conv.ask(new SimpleResponse({               
         speech: `<speak><p><s>${i18n.__('Welcome_1')}</s><s>${i18n.__('Welcome_2')}</s><s>${i18n.__('Welcome_3')}</s><s>${i18n.__('Welcome_5')}</s></p></speak>`,
         text: i18n.__('Welcome_init'),}));

		 conv.ask(new BasicCard({   
			image: new Image({url:'https://imgur.com/7ofgPtV.jpg',alt:'Pictures',}),
			title:i18n.__('Welcome_Title') ,
			subtitle:i18n.__('Welcome_Subtitle'), 
			text:i18n.__('Welcome_Text'),
		    buttons: new Button({title: i18n.__('Button_Title'),url:i18n.__('URL'),}),
        }));
 conv.ask(new Suggestions('🎮 '+i18n.__('StartGame'),'📝'+i18n.__('Tutorial'),'👋 '+i18n.__('Bye')));
   }
}
else{
   menu=false;answer_input=false;end_game=false;
  A_count=0;B_count=0; now_input=''; now_hint=''; last_input=''; last_hint='';before_input=''; before_hint='';far_input=''; far_hint='';
	
	 array=[0,1,2,3,4,5,6,7,8,9];
	 sys_think_1000=take(parseInt(Math.random()*9));
	 sys_think_100=take(parseInt(Math.random()*8));
	 sys_think_10=take(parseInt(Math.random()*7));
	 sys_think_1=take(parseInt(Math.random()*6));  
   sys_think=String((sys_think_1000*1000)+(sys_think_100*100)+(sys_think_10*10)+sys_think_1);//系統生成的實際數字

  conv.ask(`<speak><p><s>${i18n.__('NoSerfaceHint','<break time="0.2s"/>')}<break time="1s"/></s></p></speak>`);
  conv.ask(new SimpleResponse({speech:`<speak><audio src="https://firebasestorage.googleapis.com/v0/b/hank199599.appspot.com/o/undecided-numbers.mp3?alt=media"/><p><s>${i18n.__('Start1')}</s><s>${i18n.__('Start2')}</s><s>${i18n.__('Start3')}<say-as interpret-as="characters">0123</say-as>${i18n.__('TO')}<say-as interpret-as="characters">9876</say-as></s><s>${i18n.__('Start4')}</s></p></speak>`,text: i18n.__('StartText'),}));
  conv.ask(new BasicCard({ title:i18n.__('StartTitle'),subtitle:i18n.__('StartSubtitle'),text:i18n.__('Start_text')}));

	
}
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
conv.user.storage.far_input1=far_input1;
conv.user.storage.far_hint1=far_hint1;
conv.user.storage.far_input2=far_input2;
conv.user.storage.far_hint2=far_hint2;
conv.user.storage.answer_input=answer_input;
conv.user.storage.menu=menu;
conv.user.storage.end_game=end_game;
conv.user.storage.teach_mode=teach_mode;
conv.user.storage.try_count=try_count;
conv.user.storage.new_be=new_be;
});

app.intent('輸入數字', (conv,{any}) => {
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
far_input=conv.user.storage.far_input;
far_hint=conv.user.storage.far_hint;
far_input1=conv.user.storage.far_input1;
far_hint1=conv.user.storage.far_hint1;
far_input2=conv.user.storage.far_input2;
far_hint2=conv.user.storage.far_hint2;
answer_input=conv.user.storage.answer_input;
menu=conv.user.storage.menu;
end_game=conv.user.storage.end_game;
teach_mode=conv.user.storage.teach_mode;
try_count=conv.user.storage.try_count;
new_be=conv.user.storage.new_be;
sys_error1=conv.user.storage.sys_error1;
sys_error2=conv.user.storage.sys_error2;
  
if(any===i18n.__('StartGame')){  menu=true;answer_input=false;end_game=true;teach_mode=false;try_count=0;new_be=false;
  A_count=0;B_count=0; now_input=''; now_hint=''; last_input=''; last_hint='';before_input=''; before_hint='';far_input=''; far_hint='';
  far_input1=''; far_hint1='';far_input2=''; far_hint2=''; guess_count=0;
  const hasSurface = conv.surface.capabilities.has('actions.capability.SCREEN_OUTPUT');//檢測該裝置是否有螢幕
  if(hasSurface===false){conv.ask(`<speak><p><s>${i18n.__('NoSerfaceHint','<break time="0.15s"/>')}</s></p></speak>`);}
}
if(any===i18n.__('ReTeach')||any==='📝'+i18n.__('ReTeach')){
	teach_mode=true;any=i18n.__('StartGame');
   menu=true;answer_input=false;end_game=false;}  
   
 if(menu===true&&answer_input===false&&end_game===true){
   if(any===i18n.__('Tutorial')||any==='📝'+i18n.__('Tutorial')){teach_mode=true;any=i18n.__('StartGame');}
      else{teach_mode=false;any=i18n.__('StartGame');}
   if(any===i18n.__('StartGame')){menu=true;answer_input=false;end_game=false;}
 }  
  
if(menu===false&&answer_input===false&&end_game===true){

if(conv.user.locale==="zh-TW"){var inputarray=['🎮 '+i18n.__('Restart'),i18n.__('Restart'),"🔄 重新開始","再來一次","再玩一次","再試一次","再來","重新開始","重來","好","OK","可以","再一次","好啊","是"];}
else if(conv.user.locale==="zh-HK"){var inputarray=['🎮 '+i18n.__('Restart'),i18n.__('Restart'),"🔄 重新開始","再來一次","再玩一次","再試一次","再來","重新開始","重來","好","OK","可以","重頭黎過","好吖"];}
else if(conv.user.locale==="zh-CN"){var inputarray=['🎮 '+i18n.__('Restart'),i18n.__('Restart'),"🔄 重新开始","再来一次","再玩一次","再试一次","再来","重新开始","重来","好","OK","可以", "再一次","好啊"];}
else if(conv.user.locale==="ja-JP"){var inputarray=['🎮 '+i18n.__('Restart'),i18n.__('Restart'),"戻ってきて","また来て","もう一度","OK","再生","再試行"];}
else if(conv.user.locale==="ko-KR"){var inputarray=['🎮 '+i18n.__('Restart'),i18n.__('Restart'),"다시 시작","다시 한번","다시","OK","다시 재생","다시 시도하십시오"];}
else{var inputarray=['🎮 '+i18n.__('Restart'),i18n.__('Restart'),"one more","again","replay","try again","one more time","restart","play again","ok","OK"];}

 if(inputarray.indexOf(any)!==-1){
   menu=true;answer_input=false;end_game=false;teach_mode=false;guess_count=0;new_be=false;}
 }
 
 if(any===i18n.__('Tutorial')||any==='📝'+i18n.__('Tutorial')){teach_mode=true;menu=true;answer_input=false;end_game=false;try_count=0;}
 if(any===i18n.__('BackNormal')||any==='🎮 '+i18n.__('BackNormal')){new_be=true;
   conv.ask(new SimpleResponse({speech:`<speak><p><s>${i18n.__('Hint1')}<break time="0.1s"/>${i18n.__('Hint2')}<break time="0.1s"/>${i18n.__('Hint3')}</s></p></speak>`,text: i18n.__('Hint_text'),}));
   teach_mode=false;menu=true;answer_input=false;end_game=false;guess_count=0;}

  //生成數字頁面
 if(menu===true&&answer_input===false&&end_game===false){
   menu=false;answer_input=false;end_game=false;
  A_count=0;B_count=0; now_input=''; now_hint=''; last_input=''; last_hint='';before_input=''; before_hint='';far_input=''; far_hint='';
  far_input1=''; far_hint1='';far_input2=''; far_hint2=''; 
   //輸出卡片
  if(teach_mode===false){
   //產生隨機數字
	 array=[0,1,2,3,4,5,6,7,8,9];
	 sys_think_1000=take(parseInt(Math.random()*9));
	 sys_think_100=take(parseInt(Math.random()*8));
	 sys_think_10=take(parseInt(Math.random()*7));
	 sys_think_1=take(parseInt(Math.random()*6));  
     sys_think=String((sys_think_1000*1000)+(sys_think_100*100)+(sys_think_10*10)+sys_think_1);//系統生成的實際數字

	sys_guess=String(ranGuess());
	sys_guess1=String(ranGuess());
	sys_guess2=String(ranGuess());

 if (conv.user.last.seen){   
  conv.ask(new SimpleResponse({speech:`<speak><audio src="https://firebasestorage.googleapis.com/v0/b/hank199599.appspot.com/o/undecided-numbers.mp3?alt=media"/><p><s>${i18n.__('Start1')}</s><s>${i18n.__('Start2')}</s><s>${i18n.__('Start3')}<say-as interpret-as="characters">0123</say-as>${i18n.__('TO')}<say-as interpret-as="characters">9876</say-as></s><s>${i18n.__('Start4')}</s></p></speak>`,text: i18n.__('StartText'),}));
  conv.ask(new Suggestions("123",sys_guess,sys_guess1,sys_guess2,"9876"));
  }else{
  conv.ask(new SimpleResponse({speech:`<speak><audio src="https://firebasestorage.googleapis.com/v0/b/hank199599.appspot.com/o/undecided-numbers.mp3?alt=media"/><p><s>${i18n.__('Start1')}</s><s>${i18n.__('Start2')}</s><s>${i18n.__('Start3')}<say-as interpret-as="characters">0123</say-as>${i18n.__('TO')}<say-as interpret-as="characters">9876</say-as></s><s>${i18n.__('Start4')}${i18n.__('Start5')}</s></p></speak>`,text: i18n.__('StartText'),}));
  conv.ask(new Suggestions('📝'+i18n.__('Tutorial'),"123",sys_guess,"9876"));
 }
 
  conv.ask(new BasicCard({ title:i18n.__('StartTitle'),subtitle:i18n.__('StartSubtitle'),text:i18n.__('Start_text')}));

  }
  else{
	 array=[0,1,2,3,4,5,6,7,8,9];
	 sys_think_1000=take(parseInt(Math.random()*9));
	 sys_think_100=take(parseInt(Math.random()*8));
	 sys_think_10=take(parseInt(Math.random()*7));
	 sys_think_1=take(parseInt(Math.random()*6));  
     sys_error1=take(parseInt(Math.random()*5)); 
     sys_error2=take(parseInt(Math.random()*4)); 
  
  if (conv.user.last.seen) {new_be=false;}else{new_be=true;}
  try_count=0;
   sys_think=String((sys_think_1000*1000)+(sys_think_100*100)+(sys_think_10*10)+sys_think_1);//系統生成的實際數字
  
  conv.ask(new SimpleResponse({speech:`<speak><p><s>${i18n.__('Teach_Start_1')}</s><s>${i18n.__('Teach_Start_2')}</s><break time="0.6s"/><s>${i18n.__('Teach_Start_3')}</s><s>${i18n.__('Teach_Start_4')}<break time="0.3s"/>${i18n.__('Teach_Start_5')}<break time="0.3s"/><say-as interpret-as="characters">${sys_think}</say-as></s><break time="0.7s"/><s>${i18n.__('Teach_Start_6')}</s><break time="0.3s"/><s>${i18n.__('Teach_Start_7')}<break time="0.3s"/>${i18n.__('Teach_Start_8')}</s><s>${i18n.__('Teach_Start_9')}</s></p></speak>`,text:i18n.__('Teach_Start_text')}));
  conv.ask(new Table({
             title: i18n.__('Teach_Start_Title'),
             subtitle:i18n.__('Teach_Start_Subtitle'), 
             columns: [ {header: i18n.__('Bit'),align: 'CENTER',},{header: i18n.__('1000-Bit'),align: 'CENTER',},{header: i18n.__('100-Bit'),align: 'CENTER',},{header: i18n.__('10-Bit'),align: 'CENTER',},{header: i18n.__('1-Bit'),align: 'CENTER',}],
             rows: [
               {cells: [i18n.__('Example'), String(sys_think_1000), String(sys_think_100),String(sys_think_10),String(sys_think_1)],
                 dividerAfter: false,}],
               }));
  conv.ask(new Suggestions('🎮 '+i18n.__('BackNormal'),i18n.__('Contiunce')));           
  }
}
else if(menu===false&&answer_input===false&&end_game===false){

    A_count=0;B_count=0;answer_input=false;
	
   any=replaceString(any, ' ', ''); //消除輸入字串中的空格
   any=replaceString(any, '百', '00'); //消除輸入字串中的空格
   any=replaceString(any, '佰', '00'); //消除輸入字串中的空格
   any=replaceString(any, '千', '000'); //消除輸入字串中的空格
   any=replaceString(any, '仟', '000'); //消除輸入字串中的空格
   any=replaceString(any, '以前', ''); //消除輸入字串中的空格
   any=replaceString(any, '萬', ''); //消除輸入字串中的空格
   any=replaceString(any, '零', '0'); //消除輸入字串中的空格
   any=replaceString(any, '一', '1'); //更改輸入字串中的字元為數字
   any=replaceString(any, '二', '2'); //更改輸入字串中的字元為數字
   any=replaceString(any, '兩', '2'); //更改輸入字串中的字元為數字
   any=replaceString(any, '三', '3'); //更改輸入字串中的字元為數字
   any=replaceString(any, '四', '4'); //更改輸入字串中的字元為數字
   any=replaceString(any, '是', '4'); //更改輸入字串中的字元為數字
   any=replaceString(any, '五', '5'); //更改輸入字串中的字元為數字
   any=replaceString(any, '伍', '5'); //更改輸入字串中的字元為數字
   any=replaceString(any, '六', '6'); //更改輸入字串中的字元為數字
   any=replaceString(any, '七', '7'); //更改輸入字串中的字元為數字
   any=replaceString(any, '八', '8'); //更改輸入字串中的字元為數字
   any=replaceString(any, '爸', '8'); //更改輸入字串中的字元為數字
   any=replaceString(any, '九', '9'); //更改輸入字串中的字元為數字
   any=replaceString(any, '酒', '9'); //更改輸入字串中的字元為數字
   any=replaceString(any, '十', '10'); //更改輸入字串中的字元為數字
   any=replaceString(any, '森林', '30'); //更改輸入字串中的字元為數字
   any=replaceString(any, '三菱', '30'); //更改輸入字串中的字元為數字
   any=replaceString(any, '士林', '40'); //更改輸入字串中的字元為數字
   any=replaceString(any, '二林', '20'); //更改輸入字串中的字元為數字
   any=replaceString(any, '麒麟', '70'); //更改輸入字串中的字元為數字
   any=replaceString(any, '排氣', '87'); //更改輸入字串中的字元為數字
   any=replaceString(any, 'zero', '0'); //更改輸入字串中的字元為數字
   any=replaceString(any, 'to', '2'); //更改輸入字串中的字元為數字
   any=replaceString(any, 'all', '0'); //更改輸入字串中的字元為數字
   any=replaceString(any, 'O', '0'); //更改輸入字串中的字元為數字
   any=replaceString(any, 'o', '0'); //更改輸入字串中的字元為數字
   any=replaceString(any, 'one', '1'); //更改輸入字串中的字元為數字
   any=replaceString(any, 'two', '2'); //更改輸入字串中的字元為數字
   any=replaceString(any, 'three', '3'); //更改輸入字串中的字元為數字
   any=replaceString(any, 'four', '4'); //更改輸入字串中的字元為數字
   any=replaceString(any, 'five', '5'); //更改輸入字串中的字元為數字
   any=replaceString(any, 'six', '6'); //更改輸入字串中的字元為數字
   any=replaceString(any, 'seven', '7'); //更改輸入字串中的字元為數字
   any=replaceString(any, 'eight', '8'); //更改輸入字串中的字元為數字
   any=replaceString(any, 'nine', '9'); //更改輸入字串中的字元為數字

   if(any!==i18n.__('Contiunce')&&teach_mode===true&&try_count<=3){any=i18n.__('Contiunce');}
   if(any===i18n.__('Contiunce')){answer_input=true;
   if (try_count===0){
    you_guess_1000=sys_error1;//千位數
    you_guess_100=sys_think_1000;//百位數
    you_guess_10=sys_think_10;//十位數
    you_guess_1=sys_error2;//個位數
     any=(1000*you_guess_1000)+(100*you_guess_100)+(10*you_guess_10)+you_guess_1;
   }
   if (try_count===1){any=String(you_guess_1000)+String(sys_think_100)+String(sys_think_10)+String(you_guess_1);}
   if (try_count===2){any=String(you_guess_1000)+String(sys_think_1000)+String(sys_think_100)+String(you_guess_1);}
   if (try_count===3){any=String(sys_think_1000)+String(sys_think_100)+String(sys_think_10)+String(you_guess_1);}
   }
 
   number=parseInt(any);
    
 if(number>10000){number=number%10000;}

 if(isNaN(number)===false){answer_input=true;}
       
  if(answer_input===true){
  sign_1000=' ';sign_100=' ';sign_10=' ';sign_1=' ';
  guess_count++; //統計猜測次數+1
  you_guess=number;
  answer_input=false;
  
  new analysis(you_guess);
  
 you_guess=you_guess.toString();
 if(you_guess.length===1){you_guess="000"+you_guess;}
 else if(you_guess.length===2){you_guess="00"+you_guess;}
 else if(you_guess.length===3){you_guess="0"+you_guess;}

  
   //原先前第四次的提示變成前第五次
   far_input2=far_input1;
   far_hint2=far_hint1;
   //原先前第三次的提示變成前第四次
   far_input1=far_input;
   far_hint1=far_hint;
   //原先前第二次的提示變成前第三次
   far_input=before_input;
   far_hint=before_hint;
  //原先上一次的提示變成前第二次
   before_input=last_input;
   before_hint=last_hint;
  //原先這次的提示變成上一次
   last_input=now_input;
   last_hint=now_hint;

   //正式輸出的畫面
   
   if(A_count<=3){
        if(teach_mode===false){
                   conv.ask(new SimpleResponse({speech:`<speak><p><s>${i18n.__('Game_hint1')}<break time="0.2s"/><say-as interpret-as="characters">${you_guess}</say-as></s><s>${i18n.__('Game_hint2')}<break time="0.2s"/>${A_count}A${B_count}B</s></p></speak>`,text: i18n.__('Game_text',A_count,B_count),}));

				if(guess_count===1){
				 conv.ask(new Table({
                   title: you_guess+'   ('+A_count+'A'+B_count+'B)',
                   subtitle:i18n.__('card_subtitle'),
                   columns: [{header: "",align: 'CENTER',},],
                   rows: [{cells: ["\n"+i18n.__('Record')+"\n"],dividerAfter: false,},],}));
				}
				else{
					var temp_array=[];
					if(last_input.length!==0){temp_array.push({cells: [last_input, last_hint],dividerAfter: false,})}
					if(before_input.length!==0){temp_array.push({cells: [before_input, before_hint],dividerAfter: false,})}
					if(far_input.length!==0){temp_array.push({cells: [far_input, far_hint],dividerAfter: false,})}
					if(far_input1.length!==0){temp_array.push({cells: [far_input1, far_hint1],dividerAfter: false,})}
					if(far_input2.length!==0){temp_array.push({cells: [far_input2, far_hint2],dividerAfter: false,})}
					
			   conv.ask(new Table({
                   title: you_guess+'   ('+A_count+'A'+B_count+'B)',
                   subtitle:i18n.__('card_subtitle'),
                   columns: [{header: i18n.__('Input'),align: 'CENTER',},{header: i18n.__('hint'),align: 'CENTER',},],
                   rows: temp_array,}));
			   }
                   sys_guess=String(ranGuess());
				   sys_guess1=String(ranGuess());
                   conv.ask(new Suggestions(sys_guess,sys_guess1,i18n.__('explain',A_count,B_count)));
				   
				  }else{
                try_count++;   
			    origin = [you_guess_1000,you_guess_100,you_guess_10,you_guess_1];
				result = Array.from(new Set(origin));
				help_Total=result.length;                    
				else_count=help_Total-(A_count+B_count);
                     
               if(A_count===0&&B_count===0){explained=i18n.__('explaine_1',(10-else_count));}
               else if(A_count>=1&&A_count<=2&&B_count===0){explained=i18n.__('explaine_2',A_count,else_count);} 
               else if(A_count===2&&B_count===2){explained=i18n.__('explaine_3');} 
               else if(A_count===0&&B_count<=3){explained=i18n.__('explaine_4',B_count);}
               else if(A_count===3&&B_count===0){explained=i18n.__('explaine_5',A_count);}
               else if(A_count===0&&B_count===4){explained=i18n.__('explaine_6',A_count);}
               else if(A_count===1&&B_count===3){explained=i18n.__('explaine_3');} 
               else{explained=i18n.__('explaine_7',A_count,B_count,else_count);}
              
               if (try_count===1){teach_title=i18n.__('Teach_1_Title',A_count,B_count);
                                  teach_subtitle=i18n.__('Teach_1_Subtitle',you_guess);
                                  conv.ask(new SimpleResponse({speech:`<speak><p><s>${i18n.__('Teach_1_Speek_1')}<break time="0.15s"/>${A_count}A${B_count}B<break time="0.15s"/>${i18n.__('Teach_1_Speek_2')}</s><break time="0.15s"/><s>${i18n.__('Teach_1_Speek_3')}<break time="0.15s"/><say-as interpret-as="characters">${you_guess}</say-as><break time="0.25s"/>${i18n.__('Teach_1_Speek_4')}${explained}</s><break time="0.15s"/><s>${i18n.__('Teach_1_Speek_5')}</s><s>${i18n.__('Teach_Start_9')}!</s></p></speak>`,text:i18n.__('Teach_1_text')}));
                                 }
               else if (try_count===2){teach_title=i18n.__('Teach_2_Title',A_count,B_count);
                                  teach_subtitle=i18n.__('Teach_2_Subtitle');
                                 conv.ask(new SimpleResponse({speech:`<speak><p><s>${i18n.__('Teach_2_Speek_1')}</s><break time="0.15s"/><s><say-as interpret-as="characters">${you_guess}</say-as><break time="0.35s"/>${explained}</s><break time="0.15s"/><s>${i18n.__('Teach_2_Speek_2')}</s><s>${i18n.__('Teach_Start_9')}!</s></p></speak>`,text:i18n.__('Teach_2_text')}));
                                
                                      }          
               else if (try_count===3){teach_title=i18n.__('Teach_3_Title',A_count,B_count);
                                  teach_subtitle=i18n.__('Teach_3_Subtitle');
                                 conv.ask(new SimpleResponse({speech:`<speak><p><s>${i18n.__('Teach_3_Speek_1')}</s><s>${i18n.__('Teach_3_Speek_2')}<break time="0.15s"/><say-as interpret-as="characters">${you_guess}</say-as><break time="0.15s"/>${i18n.__('Teach_3_Speek_3')}${explained}</s><break time="0.15s"/><s>${i18n.__('Teach_3_Speek_4')}</s><s>${i18n.__('Teach_Start_9')}!</s></p></speak>`,text:i18n.__('Teach_2_text')}));
                                 } 
               else if (try_count===4){teach_title=i18n.__('Teach_4_Title',A_count,B_count);
                                       teach_subtitle=i18n.__('Teach_4_Subtitle');
                                       conv.ask(new SimpleResponse({speech:`<speak><p><s>${i18n.__('Teach_4_Speek_1')}</s><break time="0.15s"/><s>${i18n.__('Teach_4_Speek_2')}<say-as interpret-as="characters">${you_guess}</say-as></s><break time="0.15s"/><s>${i18n.__('Teach_4_Speek_3')}</s><s>${i18n.__('Teach_4_Speek_4')}<break time="0.1s"/>${i18n.__('BackNormal')}<break time="0.1s"/>${i18n.__('Teach_4_Speek_6')}</s></p></speak>`,text:i18n.__('Teach_4_text')}));
                                       } 
               else{teach_title=you_guess+'   ('+A_count+'A'+B_count+'B)';
                    teach_subtitle=i18n.__('Hint_subtitle',A_count,A_count,B_count,B_count,else_count);
                    conv.ask(new SimpleResponse({speech:`<speak><p><s>${i18n.__('hint1')}<break time="0.15s"/><say-as interpret-as="characters">${you_guess}</say-as><break time="0.15s"/>${i18n.__('hint2')}，${explained}</s></p></speak>`,text:i18n.__('hinttext1')}));
			   }
              conv.ask(new Table({
               title: teach_title,
               subtitle:teach_subtitle, 
               columns: [ {header: i18n.__('Bit'),align: 'CENTER',},{header: i18n.__('1000-Bit'),align: 'CENTER',},{header: i18n.__('100-Bit'),align: 'CENTER',},{header: i18n.__('10-Bit'),align: 'CENTER',},{header: i18n.__('1-Bit'),align: 'CENTER',}],
               rows: [
                 {cells: [i18n.__('CORRECT'), String(sys_think_1000), String(sys_think_100),String(sys_think_10),String(sys_think_1)],
             dividerAfter: false,},{
                   cells: [i18n.__('INPUT'), String(you_guess_1000), String(you_guess_100),String(you_guess_10),String(you_guess_1)],
             dividerAfter: false,},{
                   cells: [i18n.__('HINT'), sign_1000,sign_100,sign_10,sign_1],
             dividerAfter: false,} ]
       }));
				   
         if (try_count>=4){conv.ask(new Suggestions('🎮 '+i18n.__('BackNormal'),String(ranGuess())));	}
				   else{conv.ask(new Suggestions(i18n.__('Contiunce')));}		   
     }
   }
   else{
     end_game=true;
      if(teach_mode===false){
     conv.ask(new SimpleResponse({speech:`<speak><audio src="https://firebasestorage.googleapis.com/v0/b/hank199599.appspot.com/o/end_game.mp3?alt=media"/><p><s>${i18n.__('Answer1')}<say-as interpret-as="characters">${sys_think}</say-as>!</s><s>${i18n.__('Answer2',guess_count)}</s><break time="0.2s"/><s>${i18n.__('Answer3')}?</s></p></speak>`,text:i18n.__('Answertext'),}));
     conv.ask(new BasicCard({   
                   image: new Image({url:'https://imgur.com/7qDUUEq.jpg',alt:'Pictures',}),
                   title: i18n.__('Answer')+sys_think,
		           subtitle:i18n.__('GuessCount',guess_count),}));
          conv.ask(new Suggestions('🎮 '+i18n.__('Restart'),'👋 '+i18n.__('Bye')));
     }
     else{
       conv.ask(new SimpleResponse({speech:`<speak><p><s>${i18n.__('Teachend1')}</s><s>${i18n.__('Teachend2')}<break time="0.15s"/>${i18n.__('Teachend3')}<break time="0.15s"/>${i18n.__('Teachend4')}</s></p></speak>`,text:i18n.__('Answertext')}));sys_guess=String(ranGuess());     
       conv.ask(new Table({
             title: you_guess+'   ('+A_count+'A'+B_count+'B)',
		     subtitle:i18n.__('Hint_subtitle',A_count,A_count,B_count,B_count,0), 
             columns: [ {header: i18n.__('Bit'),align: 'CENTER',},{header: i18n.__('1000-Bit'),align: 'CENTER',},{header: i18n.__('100-Bit'),align: 'CENTER',},{header: i18n.__('10-Bit'),align: 'CENTER',},{header: i18n.__('1-Bit'),align: 'CENTER',}],
               rows: [
                 {cells: [i18n.__('CORRECT'), String(sys_think_1000), String(sys_think_100),String(sys_think_10),String(sys_think_1)],
             dividerAfter: false,},{
                   cells: [i18n.__('INPUT'), String(you_guess_1000), String(you_guess_100),String(you_guess_10),String(you_guess_1)],
             dividerAfter: false,},{
                   cells: [i18n.__('HINT'), sign_1000,sign_100,sign_10,sign_1],
             dividerAfter: false,} ]
       }));
     conv.ask(new Suggestions('🎮 '+i18n.__('BackNormal'),'📝'+i18n.__('ReTeach')));
     
    }
 }
   //儲存這次的輸入與提示
   now_input=you_guess;
   now_hint=A_count+'A'+B_count+'B';
   
   //儲存這次數值用來解釋意義
   help_A_count=A_count;
   help_B_count=B_count;
   help_number=you_guess;
   }  else{
      conv.ask(new SimpleResponse({speech:i18n.__('Error_speech'),text:i18n.__('Error_text')}));
   //原先前第四次的提示變成前第五次
   far_input2=far_input1;
   far_hint2=far_hint1;
   //原先前第三次的提示變成前第四次
   far_input1=far_input;
   far_hint1=far_hint;
   //原先前第二次的提示變成前第三次
   far_input=before_input;
   far_hint=before_hint;
  //原先上一次的提示變成前第二次
   before_input=last_input;
   before_hint=last_hint;
  //原先這次的提示變成上一次
   last_input=now_input;
   last_hint=now_hint;
       if(teach_mode===false){
			sys_guess=String(ranGuess());
			sys_guess1=String(ranGuess());
			sys_guess2=String(ranGuess());

          if(guess_count===0){
				 conv.ask(new Table({
                   title: i18n.__('Error_Title'),
                   subtitle:i18n.__('card_subtitle'),
                   columns: [{header: "",align: 'CENTER',},],
                   rows: [{cells: ["\n"+i18n.__('Record')+"\n"],dividerAfter: false,},],}));
				conv.ask(new Suggestions("123",sys_guess,sys_guess1,sys_guess2,"9876"));
				}else{
					var temp_array=[];
					if(last_input.length!==0){temp_array.push({cells: [last_input, last_hint],dividerAfter: false,})}
					if(before_input.length!==0){temp_array.push({cells: [before_input, before_hint],dividerAfter: false,})}
					if(far_input.length!==0){temp_array.push({cells: [far_input, far_hint],dividerAfter: false,})}
					if(far_input1.length!==0){temp_array.push({cells: [far_input1, far_hint1],dividerAfter: false,})}
					if(far_input2.length!==0){temp_array.push({cells: [far_input2, far_hint2],dividerAfter: false,})}
					
			   conv.ask(new Table({
                   title: i18n.__('Error_Title'),
                   subtitle:i18n.__('card_subtitle'),
                   columns: [{header: i18n.__('Input'),align: 'CENTER',},{header: i18n.__('hint'),align: 'CENTER',},],
                   rows: temp_array,}));
				   
				now_input=i18n.__('error_record');
			    now_hint='──';
			    conv.ask(new Suggestions(sys_guess,sys_guess1,sys_guess2));}                                                           
    }else{ 
	       conv.ask(new BasicCard({ title: i18n.__('teach_error_title'), 
					  subtitle:i18n.__('teach_error_subtitle'),
					  text:i18n.__('teach_error_text'),}));
           sys_guess=String(ranGuess());
           conv.ask(new Suggestions('🎮 '+i18n.__('BackNormal'),sys_guess));
	}
 }
} 
else if(menu===false&&answer_input===false&&end_game===true) {
	if(teach_mode===false){	conv.ask(new SimpleResponse({
		speech:`<speak><p><s>${i18n.__('Error_hint1','<break time="0.15s"/>','<break time="0.15s"/>','<break time="0.15s"/>','<break time="0.15s"/>')}</s></p></speak>`,
		text:i18n.__('Error_hint')}));
	conv.ask(new Suggestions('🎮 '+i18n.__('Restart'),'👋 '+i18n.__('Bye')));
	}else{
		conv.ask(new SimpleResponse({
		speech:`<speak><p><s>${i18n.__('Error_hint2','<break time="0.15s"/>','<break time="0.15s"/>','<break time="0.15s"/>','<break time="0.15s"/>')}</s></p></speak>`,
		text:i18n.__('Error_hint')}));
		conv.ask(new Suggestions('🎮 '+i18n.__('BackNormal'),'📝'+i18n.__('ReTeach')));}
}
else{
	 	 conv.ask(new SimpleResponse({               
                      speech: i18n.__('Nodataspeek'),
                       text: i18n.__('Nodatatext'),}));
	   conv.close(new BasicCard({   
        title: i18n.__('Nodatatitle'),
        subtitle:i18n.__('Nodatasubtitle'), 
         buttons: new Button({title: i18n.__('Nodatabutton'),url:"https://myaccount.google.com/activitycontrols?pli=1",}),

		}));
}

 //將參數存入手機
conv.user.storage.sys_think=sys_think;
conv.user.storage.sys_think_1000=sys_think_1000;
conv.user.storage.sys_think_100=sys_think_100;
conv.user.storage.sys_think_10=sys_think_10;
conv.user.storage.sys_think_1=sys_think_1;
conv.user.storage.help_sign_1000=sign_1000;
conv.user.storage.help_sign_100=sign_100;
conv.user.storage.help_sign_10=sign_10;
conv.user.storage.help_sign_1=sign_1;
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
conv.user.storage.far_input=far_input;
conv.user.storage.far_hint=far_hint;
conv.user.storage.far_input1=far_input1;
conv.user.storage.far_hint1=far_hint1;
conv.user.storage.far_input2=far_input2;
conv.user.storage.far_hint2=far_hint2;
conv.user.storage.answer_input=answer_input;
conv.user.storage.menu=menu;
conv.user.storage.end_game=end_game;
conv.user.storage.teach_mode=teach_mode;
conv.user.storage.try_count=try_count;
conv.user.storage.new_be=new_be;
conv.user.storage.sys_error1=sys_error1;
conv.user.storage.sys_error2=sys_error2;

});

app.intent('解釋意思', (conv) => {
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
far_input=conv.user.storage.far_input;
far_hint=conv.user.storage.far_hint;
far_input1=conv.user.storage.far_input1;
far_hint1=conv.user.storage.far_hint1;
far_input2=conv.user.storage.far_input2;
far_hint2=conv.user.storage.far_hint2;
answer_input=conv.user.storage.answer_input;
menu=conv.user.storage.menu;
end_game=conv.user.storage.end_game;
teach_mode=conv.user.storage.teach_mode;
try_count=conv.user.storage.try_count;
new_be=conv.user.storage.new_be;
sys_error1=conv.user.storage.sys_error1;
sys_error2=conv.user.storage.sys_error2;
help_sign_1000=conv.user.storage.help_sign_1000;
help_sign_100=conv.user.storage.help_sign_100;
help_sign_10=conv.user.storage.help_sign_10;
help_sign_1=conv.user.storage.help_sign_1;
help_1000=conv.user.storage.help_1000;
help_100=conv.user.storage.help_100;
help_10=conv.user.storage.help_10;
help_1=conv.user.storage.help_1;

 if(menu===false&&answer_input===false&&end_game===false){
	 
         if(teach_mode===false){
			    origin = [help_1000,help_100,help_10,help_1];
				result = Array.from(new Set(origin));
				help_Total=result.length;                    
				else_count=help_Total-(help_A_count+help_B_count);
                  
               if(help_A_count===0&&help_B_count===0){explained=i18n.__('explaine_1',(10-else_count));}
               else if(help_A_count>=1&&help_A_count<=2&&help_B_count===0){explained=i18n.__('explaine_2',help_A_count,else_count);} 
               else if(help_A_count===2&&help_B_count===2){explained=i18n.__('explaine_3');} 
               else if(help_A_count===0&&help_B_count<=3){explained=i18n.__('explaine_4',help_B_count);}
               else if(help_A_count===3&&help_B_count===0){explained=i18n.__('explaine_5',help_A_count);}
               else if(help_A_count===0&&help_B_count===4){explained=i18n.__('explaine_6',help_A_count);}
               else if(help_A_count===1&&help_B_count===3){explained=i18n.__('explaine_3');} 
               else{explained=i18n.__('explaine_7',help_A_count,help_B_count,else_count);}

			   if(guess_count===0){
                conv.ask(new SimpleResponse({speech:`<speak><p><s>${i18n.__('hinterror')}</s></p></speak>`,text:i18n.__('hinttext1')}));
                conv.ask(new BasicCard({ title: i18n.__('Error_Start'),
                          text:i18n.__('Error_Start_hint'),
                        }));
					sys_guess=String(ranGuess());
					sys_guess1=String(ranGuess());
					sys_guess2=String(ranGuess());
				conv.ask(new Suggestions("123",sys_guess,sys_guess1,sys_guess2,"9876"));
				}
			  else{
		       
			   if(now_input===i18n.__('error_record')){
                conv.ask(new SimpleResponse({speech:`<speak><p><s>${i18n.__('hinterror')}</s></p></speak>`,text:i18n.__('hinttext1')}));
                conv.ask(new BasicCard({ title: i18n.__('Error_Start'),
                          text:i18n.__('Error_Start_hint'),}));
			   }
               else if(new_be===false){
               conv.ask(new SimpleResponse({speech:`<speak><p><s>${i18n.__('hint1')}<break time="0.15s"/><say-as interpret-as="characters">${you_guess}</say-as><break time="0.15s"/>${i18n.__('hint2')}${explained}</s></p></speak>`,text:i18n.__('hinttext1')}));
               conv.ask(new BasicCard({ title: help_number+'   ('+help_A_count+'A'+help_B_count+'B)',
                          subtitle:i18n.__('Hint_subtitle',help_A_count,help_A_count,help_B_count,help_B_count,else_count),     
                          text:i18n.__('Hint_Text'),
                        }));}
               else{
                 conv.ask(new SimpleResponse({speech:`<speak><p><s>${i18n.__('hint1')}<break time="0.15s"/><say-as interpret-as="characters">${you_guess}</say-as><break time="0.15s"/>${i18n.__('hint2')}${explained}</s></p></speak>`,text:i18n.__('hinttext2')}));
                 conv.ask(new Table({
                             title: help_number+'   ('+help_A_count+'A'+help_B_count+'B)',
							 subtitle:i18n.__('Hint_subtitle',help_A_count,help_A_count,help_B_count,help_B_count,else_count), 
                             columns: [ {header: i18n.__('Bit'),align: 'CENTER',},{header: i18n.__('1000-Bit'),align: 'CENTER',},{header: i18n.__('100-Bit'),align: 'CENTER',},{header: i18n.__('10-Bit'),align: 'CENTER',},{header: i18n.__('1-Bit'),align: 'CENTER',}],
                             rows: [{cells: [i18n.__('Input'), String(help_1000), String(help_100),String(help_10),String(help_1)],dividerAfter: false,},
                                    {cells: [i18n.__('hint'), help_sign_1000,help_sign_100,help_sign_10,help_sign_1],dividerAfter: false,} ]}));
                                  }
              conv.ask(new Suggestions('📝'+i18n.__('Tutorial'),i18n.__('Giveup')));
              sys_guess=String(ranGuess());
			  conv.ask(new Suggestions(sys_guess));}
	}else{
				var any="";A_count=0;B_count=0;

				if(try_count<=3){
				   if (try_count===0){
					you_guess_1000=sys_error1;//千位數
					you_guess_100=sys_think_1000;//百位數
					you_guess_10=sys_think_10;//十位數
					you_guess_1=sys_error2;//個位數
					 any=(1000*you_guess_1000)+(100*you_guess_100)+(10*you_guess_10)+you_guess_1;
				   }
				   if (try_count===1){any=String(you_guess_1000)+String(sys_think_100)+String(sys_think_10)+String(you_guess_1);}
				   if (try_count===2){any=String(you_guess_1000)+String(sys_think_1000)+String(sys_think_100)+String(you_guess_1);}
				   if (try_count===3){any=String(sys_think_1000)+String(sys_think_100)+String(sys_think_10)+String(you_guess_1);}
				  number=parseInt(any);
				  new analysis(number);
                   try_count++;   
					origin = [you_guess_1000,you_guess_100,you_guess_10,you_guess_1];
					result = Array.from(new Set(origin));
					help_Total=result.length;                    
					else_count=help_Total-(A_count+B_count);
                     
               if(A_count===0&&B_count===0){explained=i18n.__('explaine_1',(10-else_count));}
               else if(A_count>=1&&A_count<=2&&B_count===0){explained=i18n.__('explaine_2',A_count,else_count);} 
               else if(A_count===2&&B_count===2){explained=i18n.__('explaine_3');} 
               else if(A_count===0&&B_count<=3){explained=i18n.__('explaine_4',B_count);}
               else if(A_count===3&&B_count===0){explained=i18n.__('explaine_5',A_count);}
               else if(A_count===0&&B_count===4){explained=i18n.__('explaine_6',A_count);}
               else if(A_count===1&&B_count===3){explained=i18n.__('explaine_3');} 
               else{explained=i18n.__('explaine_7',A_count,B_count,else_count);}
              
               if (try_count===1){teach_title=i18n.__('Teach_1_Title',A_count,B_count);
                                  teach_subtitle=i18n.__('Teach_1_Subtitle',you_guess);
                                  conv.ask(new SimpleResponse({speech:`<speak><p><s>${i18n.__('Teach_1_Speek_1')}<break time="0.15s"/>${A_count}A${B_count}B<break time="0.15s"/>${i18n.__('Teach_1_Speek_2')}</s><break time="0.15s"/><s>${i18n.__('Teach_1_Speek_3')}<break time="0.15s"/><say-as interpret-as="characters">${you_guess}</say-as><break time="0.25s"/>${i18n.__('Teach_1_Speek_4')}${explained}</s><break time="0.15s"/><s>${i18n.__('Teach_1_Speek_5')}</s><s>${i18n.__('Teach_Start_9')}!</s></p></speak>`,text:i18n.__('Teach_1_text')}));
                                 }
               else if (try_count===2){teach_title=i18n.__('Teach_2_Title',A_count,B_count);
                                  teach_subtitle=i18n.__('Teach_2_Subtitle');
                                 conv.ask(new SimpleResponse({speech:`<speak><p><s>${i18n.__('Teach_2_Speek_1')}</s><break time="0.15s"/><s><say-as interpret-as="characters">${you_guess}</say-as><break time="0.35s"/>${explained}</s><break time="0.15s"/><s>${i18n.__('Teach_2_Speek_2')}</s><s>${i18n.__('Teach_Start_9')}!</s></p></speak>`,text:i18n.__('Teach_2_text')}));
                                
                                      }          
               else if (try_count===3){teach_title=i18n.__('Teach_3_Title',A_count,B_count);
                                  teach_subtitle=i18n.__('Teach_3_Subtitle');
                                 conv.ask(new SimpleResponse({speech:`<speak><p><s>${i18n.__('Teach_3_Speek_1')}</s><s>${i18n.__('Teach_3_Speek_2')}<break time="0.15s"/><say-as interpret-as="characters">${you_guess}</say-as><break time="0.15s"/>${i18n.__('Teach_3_Speek_3')}${explained}</s><break time="0.15s"/><s>${i18n.__('Teach_3_Speek_4')}</s><s>${i18n.__('Teach_Start_9')}!</s></p></speak>`,text:i18n.__('Teach_2_text')}));
                                 } 
               else if (try_count===4){teach_title=i18n.__('Teach_4_Title',A_count,B_count);
                                       teach_subtitle=i18n.__('Teach_4_Subtitle');
                                       conv.ask(new SimpleResponse({speech:`<speak><p><s>${i18n.__('Teach_4_Speek_1')}</s><break time="0.15s"/><s>${i18n.__('Teach_4_Speek_2')}<say-as interpret-as="characters">${you_guess}</say-as></s><break time="0.15s"/><s>${i18n.__('Teach_4_Speek_3')}</s><s>${i18n.__('Teach_4_Speek_4')}<break time="0.1s"/>${i18n.__('BackNormal')}<break time="0.1s"/>${i18n.__('Teach_4_Speek_6')}</s></p></speak>`,text:i18n.__('Teach_4_text')}));
                                 } 
              conv.ask(new Table({
               title: teach_title,
               subtitle:teach_subtitle, 
               columns: [ {header: i18n.__('Bit'),align: 'CENTER',},{header: i18n.__('1000-Bit'),align: 'CENTER',},{header: i18n.__('100-Bit'),align: 'CENTER',},{header: i18n.__('10-Bit'),align: 'CENTER',},{header: i18n.__('1-Bit'),align: 'CENTER',}],
               rows: [
                 {cells: [i18n.__('CORRECT'), String(sys_think_1000), String(sys_think_100),String(sys_think_10),String(sys_think_1)],
             dividerAfter: false,},{
                   cells: [i18n.__('INPUT'), String(you_guess_1000), String(you_guess_100),String(you_guess_10),String(you_guess_1)],
             dividerAfter: false,},{
                   cells: [i18n.__('HINT'), sign_1000,sign_100,sign_10,sign_1],
             dividerAfter: false,} ]
			   }));  
         if (try_count>=4){conv.ask(new Suggestions('🎮 '+i18n.__('BackNormal'),String(ranGuess())));	}
				   else{conv.ask(new Suggestions(i18n.__('Contiunce')));}		   
      }else{
            conv.ask(new SimpleResponse({speech:`<speak><p><s>${i18n.__('hinterror')}</s></p></speak>`,text:i18n.__('hinttext1')}));
			conv.ask(new BasicCard({ title: i18n.__('teach_error_title'), 
				  subtitle:i18n.__('teach_error_subtitle'),
				  text:i18n.__('teach_error_text'),}));
	    	conv.ask(new Suggestions('🎮 '+i18n.__('BackNormal'),String(ranGuess())));
			}}
 }else if(menu===false&&answer_input===false&&end_game===true) {
	if(teach_mode===false){	conv.ask(new SimpleResponse({
		speech:`<speak><p><s>${i18n.__('Error_hint1','<break time="0.15s"/>','<break time="0.15s"/>','<break time="0.15s"/>','<break time="0.15s"/>')}</s></p></speak>`,
		text:i18n.__('Error_hint')}));
	conv.ask(new Suggestions('🎮 '+i18n.__('Restart'),'👋 '+i18n.__('Bye')));
	}else{
		conv.ask(new SimpleResponse({
		speech:`<speak><p><s>${i18n.__('Error_hint2','<break time="0.15s"/>','<break time="0.15s"/>','<break time="0.15s"/>','<break time="0.15s"/>')}</s></p></speak>`,
		text:i18n.__('Error_hint')}));
		conv.ask(new Suggestions('🎮 '+i18n.__('BackNormal'),'📝'+i18n.__('ReTeach')));}
  }

  
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
conv.user.storage.far_input=far_input;
conv.user.storage.far_hint=far_hint;
conv.user.storage.far_input1=far_input1;
conv.user.storage.far_hint1=far_hint1;
conv.user.storage.far_input2=far_input2;
conv.user.storage.far_hint2=far_hint2;
conv.user.storage.answer_input=answer_input;
conv.user.storage.menu=menu;
conv.user.storage.end_game=end_game;
conv.user.storage.teach_mode=teach_mode;
conv.user.storage.try_count=try_count;
conv.user.storage.new_be=new_be;
conv.user.storage.sys_error1=sys_error1;
conv.user.storage.sys_error2=sys_error2;
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
far_input=conv.user.storage.far_input;
far_hint=conv.user.storage.far_hint;
far_input1=conv.user.storage.far_input1;
far_hint1=conv.user.storage.far_hint1;
far_input2=conv.user.storage.far_input2;
far_hint2=conv.user.storage.far_hint2;
answer_input=conv.user.storage.answer_input;
menu=conv.user.storage.menu;
end_game=conv.user.storage.end_game;
new_be=conv.user.storage.new_be;
  
menu=false;answer_input=false;end_game=true;
  
     conv.ask(new SimpleResponse({speech:`<speak><p><s>${i18n.__('show1')}<break time="0.15s"/><say-as interpret-as="characters">${sys_think}</say-as>!</s><s>${i18n.__('show2',guess_count)}</s><s>${i18n.__('show3')}</s></p></speak>`,text: i18n.__('GuessCount',guess_count)+i18n.__('showtext'),}));	           
     conv.ask(new Table({
			 title:i18n.__('CORRECT'),
             columns: [{header: i18n.__('1000-Bit'),align: 'CENTER',},{header: i18n.__('100-Bit'),align: 'CENTER',},{header: i18n.__('10-Bit'),align: 'CENTER',},{header: i18n.__('1-Bit'),align: 'CENTER',}],
             rows: [
               {cells: [String(sys_think_1000), String(sys_think_100),String(sys_think_10),String(sys_think_1)],
                 dividerAfter: false,}],
  }));  
  
     conv.ask(new Suggestions('🎮 '+i18n.__('Restart'),'👋 '+i18n.__('Bye')));
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
conv.user.storage.far_input=far_input;
conv.user.storage.far_hint=far_hint;
conv.user.storage.far_input1=far_input1;
conv.user.storage.far_hint1=far_hint1;
conv.user.storage.far_input2=far_input2;
conv.user.storage.far_hint2=far_hint2;
conv.user.storage.answer_input=answer_input;
conv.user.storage.menu=menu;
conv.user.storage.end_game=end_game;
conv.user.storage.new_be=new_be;

});

app.intent('玩遊戲意圖', (conv) => {
   menu=false;answer_input=false;end_game=false; teach_mode=false;guess_count=0;new_be=false;
  A_count=0;B_count=0; now_input=''; now_hint=''; last_input=''; last_hint='';before_input=''; before_hint='';far_input=''; far_hint='';
  far_input1=''; far_hint1='';far_input2=''; far_hint2='';

	 array=[0,1,2,3,4,5,6,7,8,9];
	 sys_think_1000=take(parseInt(Math.random()*9));
	 sys_think_100=take(parseInt(Math.random()*8));
	 sys_think_10=take(parseInt(Math.random()*7));
	 sys_think_1=take(parseInt(Math.random()*6));  
     sys_think=String((sys_think_1000*1000)+(sys_think_100*100)+(sys_think_10*10)+sys_think_1);//系統生成的實際數字

	sys_guess=String(ranGuess());
	sys_guess1=String(ranGuess());
	sys_guess2=String(ranGuess());

 if (conv.user.last.seen){   
  conv.ask(new SimpleResponse({speech:`<speak><audio src="https://firebasestorage.googleapis.com/v0/b/hank199599.appspot.com/o/undecided-numbers.mp3?alt=media"/><p><s>${i18n.__('Start1')}</s><s>${i18n.__('Start2')}</s><s>${i18n.__('Start3')}<say-as interpret-as="characters">0123</say-as>${i18n.__('TO')}<say-as interpret-as="characters">9876</say-as></s><s>${i18n.__('Start4')}</s></p></speak>`,text: i18n.__('StartText'),}));
  conv.ask(new Suggestions("123",sys_guess,sys_guess1,sys_guess2,"9876"));
  }else{
  conv.ask(new SimpleResponse({speech:`<speak><audio src="https://firebasestorage.googleapis.com/v0/b/hank199599.appspot.com/o/undecided-numbers.mp3?alt=media"/><p><s>${i18n.__('Start1')}</s><s>${i18n.__('Start2')}</s><s>${i18n.__('Start3')}<say-as interpret-as="characters">0123</say-as>${i18n.__('TO')}<say-as interpret-as="characters">9876</say-as></s><s>${i18n.__('Start4')}${i18n.__('Start5')}</s></p></speak>`,text: i18n.__('StartText'),}));
  conv.ask(new Suggestions('📝'+i18n.__('Tutorial'),"123",sys_guess,"9876"));
 }
 
  conv.ask(new BasicCard({ title:i18n.__('StartTitle'),subtitle:i18n.__('StartSubtitle'),text:i18n.__('Start_text')}));

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
conv.user.storage.far_input=far_input;
conv.user.storage.far_hint=far_hint;
conv.user.storage.far_input1=far_input1;
conv.user.storage.far_hint1=far_hint1;
conv.user.storage.far_input2=far_input2;
conv.user.storage.far_hint2=far_hint2;
conv.user.storage.answer_input=answer_input;
conv.user.storage.menu=menu;
conv.user.storage.end_game=end_game;
conv.user.storage.new_be=new_be;
conv.user.storage.teach_mode=teach_mode;

});


app.intent('結束對話', (conv) => {
    conv.user.storage = {}; //離開同時清除暫存資料
    conv.ask(new SimpleResponse({speech: i18n.__('EndTalk'),text: i18n.__('EndTalk')+' 👋',}));
       conv.close(new BasicCard({   
        title: i18n.__('EndTitle'), 
        subtitle:i18n.__('EndText'),
        buttons: new Button({title: i18n.__('EndButton'),url: 'https://assistant.google.com/services/a/uid/000000b5033b5e97',}),
  })); 
    
});
  
  
// Set the DialogflowApp object to handle the HTTPS POST request.
exports.dialogflowFirebaseFulfillment = functions.https.onRequest(app);
