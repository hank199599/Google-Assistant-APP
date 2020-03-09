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
  NewSurface,items,Table
} = require('actions-on-google');

// Import the firebase-functions package for deployment.
const functions = require('firebase-functions');

// Instantiate the Dialogflow client.
const app = dialogflow({debug: true});
var right = require('./country_detail'); //引用外部函數來輸入國旗答案與解釋
var options = require('./country_name');  //引用外部函數來輸入國名
  

function ranFun(){return parseInt(Math.random()*15);}

var theArray=new Array([]); //宣告陣列，隨機挑選開始畫面圖片
  theArray[0]="https://i.imgur.com/un6XIqo.jpg";
  theArray[1]="https://i.imgur.com/6rwJihe.jpg";
  theArray[2]="https://i.imgur.com/xyJ6S6W.png";
  theArray[3]="https://i.imgur.com/3ti28xQ.jpg";
  theArray[4]="https://i.imgur.com/NdVna3T.jpg";

function ranFun(){return parseInt(Math.random()*4);}


var Question_Title='';var Answer_A='';var Answer_B='';var Answer_C='';var Answer_D='';var Currect='';var Currect_Answer='';
var Q=0; //提取題目編號
var Q_Total=257; //題目總數
var Q_list=new Array([]);//儲存題目編號
var quickmode=false;
var quickmode_count=9;
var quickmode_notifyer=false;
var thistime=0;var lasttime=0;
var heart_count=3;//你的血量數
var heart='';//你的血量(圖示化表示)
var Total_Count=0; //統計已答題的總個數
var Correct_Count=0; //統計答題正確個數
var Wrong_Count=0;   //統計答題錯誤個數
var picture_url='';
var Output='';var Outputtext='';
var Describes='';
var Your_choice='';
var Picture_url='';
var output_charactor='';
var Prograss=0;//換算進度百分比
var menu=false;            //判別是否在歡迎頁面
var end_game=false;        //判別遊戲是否已結束
var question_output=false; //判別是否拿到出題目許可
var answer_input=false; //判別是否輸入許可的答案
var next_question=false; //判別是否輸入許可的答案
var country="";var country_english=""; var picture_url="";var discribe="";
var number=0; var selector=0;var selector_A=0;var selector_B=0;var selector_C=0;var selector_D=0;

var Correct_sound='https://firebasestorage.googleapis.com/v0/b/hank199599.appspot.com/o/%E7%AD%94%E5%B0%8D%E9%9F%B3%E6%95%88.mp3?alt=media';
var Wrong_sound='https://firebasestorage.googleapis.com/v0/b/hank199599.appspot.com/o/%E7%AD%94%E9%8C%AF%E9%9F%B3%E6%95%88.mp3?alt=media';
var Appaused_sound='https://firebasestorage.googleapis.com/v0/b/hank199599.appspot.com/o/Applause%20sound%20effect%20clapping%20sounds.mp3?alt=media';
var fail_sound='https://firebasestorage.googleapis.com/v0/b/hank199599.appspot.com/o/%E5%A4%B1%E6%95%97%E9%9F%B3%E6%95%88.mp3?alt=media';
var welcome_sound="https://firebasestorage.googleapis.com/v0/b/hank199599.appspot.com/o/1990s-filtered_127bpm_A_major.wav?alt=media";
var calculate_sound="https://firebasestorage.googleapis.com/v0/b/hank199599.appspot.com/o/%E8%A8%88%E7%AE%97%E9%9F%B3%E6%A0%A1.mp3?alt=media";
var roundDecimal = function (val, precision) { //進行四捨五入的函式呼叫
  return Math.round(Math.round(val * Math.pow(10, (precision || 0) + 1)) / 10) / Math.pow(10, (precision || 0));};
var inputarray=["🔄 重新開始","⚡ 重新快速模式","🎮 試試一般模式","再來一次","再玩一次","再試一次","再來","重新開始","快速模式","試試一般模式","重來","好","OK","可以","再一次","好啊","重新快速模式"];


//歡迎畫面
app.intent('預設歡迎語句', (conv) => { 
  const screenAvailable =
  conv.available.surfaces.capabilities.has('actions.capability.SCREEN_OUTPUT');//檢測目前對話裝置是否有螢幕

  menu=true;question_output=false;answer_input=false;end_game=false;next_question=false;
 quickmode=false;quickmode_count=9;heart_count=3;Total_Count=0;Correct_Count=0; Wrong_Count=0;quickmode_notifyer=false;
 Q_list= [];
   Picture_url=theArray[ranFun()];
    if (conv.user.last.seen) { conv.ask(new SimpleResponse({               
                      speech: `<speak><audio src="${welcome_sound}"/><prosody volume="loud"><p><s>歡迎遊玩國旗達人!</s><s>準備好就說聲「開始遊戲」接受挑戰八!</s></p></prosody></speak>`,
                       text: '歡迎回來!',}));
   } else {conv.ask(new SimpleResponse({               
                      speech: `<speak><audio src="${welcome_sound}"/><prosody volume="loud"><p><s>歡迎遊玩國旗達人!</s><s>本服務會隨機生成國旗配對之選擇題，若你的錯誤次數超過3次，遊戲就結束!</s><s>準備好就說聲「開始遊戲」接受挑戰八!</s></p></prosody></speak>`,
                       text: '歡迎使用「國旗達人」!',}));}
 
        conv.ask(new BasicCard({   
        image: new Image({url:Picture_url,alt:'Pictures',}),
        title: '準備好接受問題轟炸了嗎?',
        subtitle:'本服務會隨機生成國旗配對之選擇題， \n若你的錯誤次數超過3次，遊戲就結束!  \n準備好就按下「開始遊戲」接受挑戰吧!',
        text:'圖片來源：Pxhere (CC0 公共領域授權)',
        display: 'CROPPED',//更改圖片顯示模式為自動擴展
        }));
 conv.ask(new Suggestions('🎮 開始遊戲','⚡ 快速模式','👋 掰掰'));

 //參數同步回手機
 conv.user.storage.Question_Title=Question_Title;
 conv.user.storage.Answer_A=Answer_A;
 conv.user.storage.Answer_B=Answer_B;
 conv.user.storage.Answer_C=Answer_C;
 conv.user.storage.Answer_D=Answer_D;
 conv.user.storage.Currect=Currect;
 conv.user.storage.Currect_Answer=Currect_Answer;
 conv.user.storage.Q_list=Q_list;
 conv.user.storage.quickmode=quickmode;
 conv.user.storage.quickmode_count=quickmode_count;
 conv.user.storage.quickmode_notifyer=quickmode_notifyer;
 conv.user.storage.heart_count=heart_count;
 conv.user.storage.Total_Count=Total_Count;
 conv.user.storage.Correct_Count=Correct_Count;
 conv.user.storage.Wrong_Count=Wrong_Count;
 conv.user.storage.picture_url=picture_url;
 conv.user.storage.Describes=Describes;
 conv.user.storage.Your_choice=Your_choice;
 conv.user.storage.menu=menu;
 conv.user.storage.end_game=end_game;
 conv.user.storage.question_output=question_output;
 conv.user.storage.answer_input=answer_input;
 conv.user.storage.next_question=next_question;

});

app.intent('問題產生器', (conv,{input}) => {
    //參數上載到函式
 Question_Title=conv.user.storage.Question_Title;
 Answer_A=conv.user.storage.Answer_A;
 Answer_B=conv.user.storage.Answer_B;
 Answer_C=conv.user.storage.Answer_C;
 Answer_D=conv.user.storage.Answer_D;
 Currect=conv.user.storage.Currect;
 Currect_Answer=conv.user.storage.Currect_Answer;
 Q_list=conv.user.storage.Q_list;
 quickmode=conv.user.storage.quickmode;
 quickmode_count=conv.user.storage.quickmode_count;
 quickmode_notifyer=conv.user.storage.quickmode_notifyer;
 heart_count=conv.user.storage.heart_count;
 Total_Count=conv.user.storage.Total_Count;
 Correct_Count=conv.user.storage.Correct_Count;
 Wrong_Count=conv.user.storage.Wrong_Count;
 picture_url=conv.user.storage.picture_url;
 Describes=conv.user.storage.Describes;
 Your_choice=conv.user.storage.Your_choice;
 menu=conv.user.storage.menu;
 end_game=conv.user.storage.end_game;
 question_output=conv.user.storage.question_output;
 answer_input=conv.user.storage.answer_input;
 next_question=conv.user.storage.next_question;
 thistime=conv.user.storage.thistime
 lasttime=conv.user.storage.lasttime
//「開始遊戲」啟動詞判斷
 if(input==='開始遊戲'){ menu=true;question_output=false;answer_input=false;end_game=false;next_question=false;
 quickmode=false;quickmode_count=9;heart_count=3;Total_Count=0;Correct_Count=0; Wrong_Count=0;quickmode_notifyer=false;
 Q_list= [];}

 if(input==='快速模式'){ menu=true;question_output=false;answer_input=false;end_game=false;next_question=false;
 quickmode=true;quickmode_count=9;heart_count=3;Total_Count=0;Correct_Count=0; Wrong_Count=0;quickmode_notifyer=false;
 Q_list= [];}
 
  if(menu===true&&end_game===false&&question_output===false&&answer_input===false&&end_game===false&&next_question===false){
   if(input==='快速模式'||input==='⚡ 快速模式'){quickmode=true;input='快速模式';}
   else{input='開始遊戲';quickmode=false;}
    
   if(input==='開始遊戲'||input==='快速模式'){ menu=false;question_output=true;answer_input=false;end_game=false;next_question=false;}
  }
  //「下一題」啟動詞判斷
 if(menu===false&&question_output===true&&answer_input===false&&end_game===false&&next_question===true){
   if(input!=='下一題'){input='下一題';}
   if(input==='下一題'){menu=false;question_output=true;answer_input=false;end_game=false;next_question=false;}
 }
  //進入結算頁面判斷
  if(menu===false&&question_output===false&&answer_input===true&&end_game===true&&next_question===false){
      if(input!=='結算成績'){input='結算成績';}
      if(input==='結算成績'){menu=true;question_output=false;answer_input=false;end_game=true;next_question=false;}
  }
  
//結算畫面防呆判斷
  if(menu===false&&end_game===true&&question_output===false&&answer_input===false&&next_question===false){
    if(inputarray.indexOf(input)!==-1){
	  if(quickmode===true){
		if(input==='試試一般模式'){quickmode=false;}
		input='重新開始';
	  }
	  else{quickmode=false;input='重新開始';}
	 }

  if(input==='重新開始'){
    conv.ask('熱機已完成，開始你的問題!'); 
    quickmode_count=9;heart_count=3;Total_Count=0;Correct_Count=0; Wrong_Count=0;
    menu=false;question_output=true;answer_input=false;end_game=false;next_question=false;}
  }
  
  
if(menu===false&&question_output===true&&answer_input===false&&end_game===false&&next_question===false){
  menu=false;question_output=false;answer_input=true;end_game=false;next_question=true;
  Answer_A="";Answer_B="";Answer_C="";Answer_D="";
  
  number=parseInt(Math.random()*257);
  for(Q=parseInt(Math.random()*Q_Total);Q_list.indexOf(Q)!==-1;Q=(Q+1)%(Q_Total+1))
  Q_list.push(Q);// 將現在選出的編號存入陣列

  lasttime=thistime; thistime=number;
  
  selector=parseInt(Math.random()*3);
    
  Currect_Answer=right.corrector(number)[0];  //取得本題目的正確國名
  
  
  picture_url=right.corrector(number)[2];     //取得本題目的正確國旗
  Describes=right.corrector(number)[3];
  //隨機挑選答案位置
  if(selector===0){Answer_A=right.corrector(number)[0];selector_A=number; Currect_Answer=Answer_A;Currect="A";}
  else if(selector===1){Answer_B=right.corrector(number)[0];selector_B=number;Currect_Answer=Answer_B;Currect="B";}
  else if(selector===2){Answer_C=right.corrector(number)[0];selector_C=number;Currect_Answer=Answer_C;Currect="C";}
  else if(selector===3){Answer_D=right.corrector(number)[0];selector_D=number;Currect_Answer=Answer_D;Currect="D";}

  //其餘使用函數隨機挑選
  if(Answer_A===""){ for(selector_A=parseInt(Math.random()*257);selector_A===number;selector_A++);Answer_A=options.selector(selector_A);}
  if(Answer_B===""){ for(selector_B=parseInt(Math.random()*257);selector_B===number||selector_B===selector_A;selector_B++);Answer_B=options.selector(selector_B);}
  if(Answer_C===""){ for(selector_C=parseInt(Math.random()*257);selector_C===number||selector_C===selector_A||selector_C===selector_B;selector_C++);Answer_C=options.selector(selector_C);}
  if(Answer_D===""){ for(selector_D=parseInt(Math.random()*257);selector_D===number||selector_D===selector_A||selector_D===selector_B||selector_D===selector_C;selector_D++);Answer_D=options.selector(selector_D);}
 
  Total_Count++;
  
  if(quickmode===true){quickmode_count=10-Total_Count;}//若為快速模式，則進行quickmode_count數值更動
  if(quickmode===true&&quickmode_notifyer===false){
  conv.ask(new SimpleResponse({speech:'於此模式下，總共有十題題目。失敗三次一樣會直接結束,祝你好運!',text:'⚡快速模式說明  \n共十題題目，失敗三次一樣會直接結束!',}));
  quickmode_notifyer=true;}
 
 conv.ask(new SimpleResponse({speech:`<speak><p><s>第${Total_Count}題</s><break time="0.2s"/><s>這是下列何者的旗幟?</s><break time="0.15s"/><s>A、${Answer_A}</s><break time="0.1s"/><s> B、${Answer_B}</s><break time="0.1s"/><s>西、${Answer_C}</s><break time="0.1s"/><s>D、${Answer_D}</s><break time="0.1s"/></p></speak>`,text: '熱騰騰的題目來啦!'} ));
  
  //輸出圖像化的血量條
    if(heart_count==3){heart='⚫⚫⚫';}else if(heart_count==2){heart='⚫⚫';}else if(heart_count==1){heart='⚫';}
  
  if(quickmode===true){  
     conv.ask(new Table({
     title: '第'+Total_Count+'題/共10題  \n這是下列何者的旗幟?',
     image: new Image({
       url:picture_url,
       alt: 'Question Flag'
      }),
       rows: [ {cells: ['(A)'+Answer_A+'  \n(B)'+Answer_B+'  \n(C)'+Answer_C+'  \n(D)'+Answer_D+'  \n\n血量條 '+heart+' • 快速模式'],dividerAfter: false,},]})); 
  }
      else{
    conv.ask(new Table({
     title: Total_Count+'.  \n這是下列何者的旗幟?',
     image: new Image({
       url:picture_url,
       alt: 'Question Flag'
      }),
       rows: [ {cells: ['(A)'+Answer_A+'  \n(B)'+Answer_B+'  \n(C)'+Answer_C+'  \n(D)'+Answer_D+'  \n\n血量條 '+heart],dividerAfter: false,},]}));
	   }
conv.ask(new Suggestions('    A    ','    B    ','    C    ','    D    '));


}
else if(menu===true&&question_output===false&&answer_input===false&&end_game===true&&next_question===false){
     menu=false;question_output=false;answer_input=false;end_game=true;next_question=false;
    if(quickmode===true){Prograss=Total_Count*10;conv.ask(new Suggestions('⚡ 重新快速模式','🎮 試試一般模式','👋 掰掰'));}else{Prograss=(Total_Count/Q_Total)*100;conv.ask(new Suggestions('🔄 重新開始','👋 掰掰'));}
      Prograss=roundDecimal(Prograss, 1);
    conv.ask(new SimpleResponse({speech:`<speak><audio src="calculate_sound"/><prosody volume="loud"><p><s>根據Google神通廣大的雲端計算!</s><s>你在這回合一共進行<break time="0.05s"/>${Total_Count}<break time="0.03s"/>題題目。</s><s>你要再試一次嗎?</s></p></prosody></speak>`,text: '驗收成果'}
                              ));
    conv.ask(new BasicCard({   
        image: new Image({url:'https://i.imgur.com/ncuUmbe.jpg',alt:'Pictures',}),
        title: '本回合共進行'+Total_Count+'題題目',
        subtitle:'答對數：'+Correct_Count+'  \n錯誤數：'+Wrong_Count, 
        display: 'CROPPED',//更改圖片顯示模式為自動擴展
       })); 
   }
else if(menu===false&&question_output===false&&answer_input===true&&end_game===false&&next_question===true){
  
  if(input==='a'){input='A';}
  if(input==='b'){input='B';}
  if(input==='c'){input='C';}
  if(input==='d'){input='D';}
  if(input==='80'||input==='巴黎'){input='巴林';}

  if(input===Answer_A||input===Answer_B||input===Answer_C||input===Answer_D||input==='A'||input==='B'||input==='C'||input==='D'){
  menu=false;question_output=true;answer_input=false;end_game=false;next_question=true;

  if(input===Answer_A){input='A';}else if(input===Answer_B){input='B';}
  else if(input===Answer_C){input='C';}else if(input===Answer_D){input='D';}

  
 //若輸入正確 則判定答案是否正確(answer_input=T)
if(input===Currect){
    Correct_Count++;Output='這是正確答案';
    //輸出圖像化的血量條
    if(heart_count==3){heart='⚫⚫⚫';}else if(heart_count==2){heart='⚫⚫';}else if(heart_count==1){heart='⚫';}
   }
  else{
    Wrong_Count++;
    heart_count--; Output='答案是 ('+Currect+') '+Currect_Answer;
    //輸出圖像化的血量條
   if(heart_count==3){heart='⚫⚫⚫';}else if(heart_count==2){heart='⚫⚫⚪';}else if(heart_count==1){heart='⚫⚪';}else{heart='─';}        
  }
 output_charactor=Currect;
    if(output_charactor==='C'){output_charactor='西';}
  //輸出文字
 var suggestion=''; var speech='';var outputtext='';
  if(quickmode===false){
     if(heart_count>=1){
       if(input===Currect){ conv.ask(new SimpleResponse({speech:`<speak><audio src="${Correct_sound}"/>恭喜你答對拉!</speak>`,text:'恭喜答對拉 🎉'})); suggestion='    下一題    ';}
       else{ 
            conv.ask(new SimpleResponse({speech:`<speak><audio src="${Wrong_sound}"/>答錯啦!正確答案為${output_charactor}、${Currect_Answer}</speak>`,text:'再接再厲 💪'}));
            suggestion='    下一題    ';}
      }
       else{
          conv.ask(new SimpleResponse({speech:`<speak><audio src="${fail_sound}"/>回合結束!這題正確答案為${output_charactor}、${Currect_Answer}</speak>`,text:'別氣餒，下次再加油 🥊'}));
         suggestion='休息，是為了走更長遠的路';quickmode_count=0;menu=false;question_output=false;answer_input=true;end_game=true;next_question=false;}
  }else{
     if(heart_count>=1&&quickmode_count>=1){
          if(input===Currect){  conv.ask(new SimpleResponse({speech:`<speak><audio src="${Correct_sound}"/>恭喜你答對拉!</speak>`,text:'恭喜答對拉 🎉'})); suggestion='    下一題    ';}
          else{ conv.ask(new SimpleResponse({speech:`<speak><audio src="${Wrong_sound}"/>答錯啦!正確答案為${output_charactor}、${Currect_Answer}</speak>`,text:'再接再厲 💪'}));
                suggestion='    下一題    ';}
      }
       else if(quickmode_count===0){ 
         conv.ask(new SimpleResponse({speech:`<speak><audio src="${Appaused_sound}"/>恭喜你破關拉!這題正確答案為${output_charactor}、${Currect_Answer}</speak>`,text:'恭喜你完成啦 👏'}));
         suggestion='休息，是為了走更長遠的路';menu=false;question_output=false;answer_input=true;end_game=true;next_question=false;}else{ 
        conv.ask(new SimpleResponse({speech:`<speak><audio src="${fail_sound}"/>回合結束!這題正確答案為${output_charactor}、${Currect_Answer}</speak>`,text:'別氣餒，下次再加油 🥊'}));
         suggestion='休息，是為了走更長遠的路';menu=false;question_output=false;answer_input=true;end_game=true;next_question=false;}
  }
  
  if(input==='A'){Your_choice=Answer_A;}else if(input==='B'){Your_choice=Answer_B;}else if(input==='C'){Your_choice=Answer_C;}else if(input==='D'){Your_choice=Answer_D;}
    
  if(quickmode===false){Outputtext='第'+Total_Count+'題 • 血量條 '+heart;}else{Outputtext='第'+Total_Count+'題 • 快速模式 • '+'血量條 '+heart;}	
	conv.ask(new Table({
     title:'你選擇 ('+input+') '+Your_choice+'\n'+Output,
     image: new Image({
       url:picture_url,
       alt: 'Question Flag'
      }),
    columns: [{header: "🌐「"+Currect_Answer+"」簡介",align: 'LEADING',},],
    rows: [ {cells: [Describes+'  \n  \n'+Outputtext],
           dividerAfter: false,},],
	 buttons: new Button({
    title: '維基百科:'+Currect_Answer,
    url: 'https://zh.wikipedia.org/zh-tw/'+Currect_Answer,
  }),	   
}));

    conv.ask(new Suggestions(suggestion));
 }
 else{
  conv.ask(new SimpleResponse({speech:'請點選建議卡片或輸入國家名稱，來回答問題!',text:'請點選建議卡片或說出國家名稱!'}));
  if(heart_count==3){heart='⚫⚫⚫';}else if(heart_count==2){heart='⚫⚫';}else if(heart_count==1){heart='⚫';}
  if(quickmode===true){  
     conv.ask(new Table({
     title: '第'+Total_Count+'題/共10題  \n這是下列何者的旗幟?',
     image: new Image({
       url:picture_url,
       alt: 'Question Flag'
      }),
       rows: [ {cells: ['(A)'+Answer_A+'  \n(B)'+Answer_B+'  \n(C)'+Answer_C+'  \n(D)'+Answer_D+'  \n\n血量條 '+heart+' • 快速模式'],dividerAfter: false,},]})); 
  }
      else{
    conv.ask(new Table({
     title: Total_Count+'.  \n這是下列何者的旗幟?',
     image: new Image({
       url:picture_url,
       alt: 'Question Flag'
      }),
       rows: [ {cells: ['(A)'+Answer_A+'  \n(B)'+Answer_B+'  \n(C)'+Answer_C+'  \n(D)'+Answer_D+'  \n\n血量條 '+heart],dividerAfter: false,},]}));
	   }
 conv.ask(new Suggestions('    A    ','    B    ','    C    ','    D    '));}
 }
else if(menu===false&&question_output===false&&answer_input===false&&end_game===true&&next_question===false){
    if(quickmode===true){conv.ask(new Suggestions('⚡ 重新快速模式','🎮 試試一般模式','👋 掰掰'));}
	else{conv.ask(new Suggestions('🔄 重新開始','👋 掰掰'));}
    conv.ask(new SimpleResponse(
	{speech:`<speak><p><s>不好意思，我沒聽清楚。</s><s>請試著再說一次，或輕觸建議卡片來確認你的操作。</s></p></speak>`,
	text: '不好意思，請重新輸入!'}));
 }
 
else{ 	 conv.ask(new SimpleResponse({               
                      speech: "本服務需要您進一步進行設定才能繼續進行，請依照下述步驟開啟「網路與應用程式」功能。才能獲得個人化體驗喔!",
                       text: '請進行相關設定，才能進行遊戲!',}));
	   conv.close(new BasicCard({   
			image: new Image({url:'https://i.imgur.com/P5FWCbe.png',alt:'Pictures',}),
			title: '錯誤：您需要進行設定',
			subtitle:'為了給您個人化的遊戲體驗，請進行下述設定：\n\n1. 點擊下方按鈕前往Google帳戶設定\n2.	開啟「網路和應用程式活動」功能\n3.	開啟「包括 Chrome 瀏覽記錄以及採用 Google 服務的網站、應用程式和裝置中的活動記錄」\n', 
			buttons: new Button({title: 'Google活動控制項',url:"https://myaccount.google.com/activitycontrols?pli=1",}),
			display: 'CROPPED',
		}));

}
  

   //參數同步回手機
 conv.user.storage.Question_Title=Question_Title;
 conv.user.storage.Answer_A=Answer_A;
 conv.user.storage.Answer_B=Answer_B;
 conv.user.storage.Answer_C=Answer_C;
 conv.user.storage.Answer_D=Answer_D;
 conv.user.storage.Currect=Currect;
 conv.user.storage.Currect_Answer=Currect_Answer;
 conv.user.storage.Q_list=Q_list;
 conv.user.storage.quickmode=quickmode;
 conv.user.storage.quickmode_count=quickmode_count;
 conv.user.storage.quickmode_notifyer=quickmode_notifyer;
 conv.user.storage.heart_count=heart_count;
 conv.user.storage.Total_Count=Total_Count;
 conv.user.storage.Correct_Count=Correct_Count;
 conv.user.storage.Wrong_Count=Wrong_Count;
 conv.user.storage.picture_url=picture_url;
 conv.user.storage.Describes=Describes;
 conv.user.storage.Your_choice=Your_choice;
 conv.user.storage.menu=menu;
 conv.user.storage.end_game=end_game;
 conv.user.storage.question_output=question_output;
 conv.user.storage.answer_input=answer_input;
 conv.user.storage.next_question=next_question;
 conv.user.storage.thistime=thistime
 conv.user.storage.lasttime=lasttime

});

app.intent('結束對話', (conv) => {
    conv.user.storage = {}; //離開同時清除暫存資料
    conv.ask('希望你玩得愉快!');
    conv.ask(new SimpleResponse({speech: '下次見',text: '下次見 👋',}));
    conv.close(new BasicCard({   
        title: '感謝您的使用!', 
        text:'如果有任何需要改進的地方，  \n歡迎到簡介頁面評分或給予反饋，謝謝!', 
        buttons: new Button({title: '開啟本程式的商店頁面',url: 'https://assistant.google.com/services/a/uid/0000008b6d90ac06',}),
  })); 

});
  
  
// Set the DialogflowApp object to handle the HTTPS POST request.
exports.flag_game = functions.https.onRequest(app);