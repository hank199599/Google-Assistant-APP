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

var Question_Title='';var Answer_A='';var Answer_B='';var Answer_C='';var Answer_D='';var Currect='';var Currect_Answer='';
var Q=0; //提取題目編號
var Q_Total=3; //題目總數
var thistime=0;//儲存這次題目編號
var lasttime=0;//儲存上次的題目編號
var heart_count=3;//你的血量數
var heart='';//你的血量(圖示化表示)
var Total_Count=0; //統計已答題的總個數
var Correct_Count=0; //統計答題正確個數
var Wrong_Count=0;   //統計答題錯誤個數
var Output_Title='';
var Output_SubTitle='';
var Your_choice='';
var output_charactor='';
var Prograss=0;//換算進度百分比
var menu=false;            //判別是否在歡迎頁面
var end_game=false;        //判別遊戲是否已結束
var question_output=false; //判別是否拿到出題目許可
var answer_input=false; //判別是否輸入許可的答案
var next_question=false; //判別是否輸入許可的答案
var roundDecimal = function (val, precision) { //進行四捨五入的函式呼叫
  return Math.round(Math.round(val * Math.pow(10, (precision || 0) + 1)) / 10) / Math.pow(10, (precision || 0));};

function picker(){return parseInt(Math.random()*Q_Total);}
function question_picker(){
  if(Q===0){Question_Title='這題的答案是A。'; Answer_A='選項一';Answer_B='選項二';Answer_C='選項三';Answer_D='選項四';Currect='A';Currect_Answer=Answer_A;}
  else if(Q===1){Question_Title='這題的答案是B。'; Answer_A='選項一';Answer_B='選項二';Answer_C='選項三';Answer_D='選項四';Currect='B';Currect_Answer=Answer_B;}
  else if(Q===2){Question_Title='這題的答案是C。'; Answer_A='選項一';Answer_B='選項二';Answer_C='選項三';Answer_D='選項四';Currect='C';Currect_Answer=Answer_C;}
  else if(Q===3){Question_Title='這題的答案是D。'; Answer_A='選項一';Answer_B='選項二';Answer_C='選項三';Answer_D='選項四';Currect='D';Currect_Answer=Answer_D;}
}


//歡迎畫面
app.intent('預設歡迎語句', (conv) => { 

 menu=true;question_output=false;answer_input=false;end_game=false;next_question=false;
 lasttime=0;thistime=0;heart_count=3;Total_Count=0;Correct_Count=0; Wrong_Count=0;

       conv.ask(new SimpleResponse({               
                  speech: `<speak><p><s>歡迎遊玩大腦運動會!</s><s>本服務內含有數百題的益智問答，若你的錯誤次數超過3次，遊戲就結束!</s><s>準備好就說聲「開始遊戲」接受挑戰八!</s></p></speak>`,
                 text: '歡迎使用「大腦運動會」!',}));
 
        conv.ask(new BasicCard({   
        title: '準備好接受問題轟炸了嗎?',
        subtitle:'準備好就按下「開始遊戲」接受挑戰吧!',
        text:'在此輸入任意文字',
        }));
 conv.ask(new Suggestions('🎮 開始遊戲','👋 掰掰'));
   
   //參數同步回手機
 conv.user.storage.Question_Title=Question_Title;
 conv.user.storage.Answer_A=Answer_A;
 conv.user.storage.Answer_B=Answer_B;
 conv.user.storage.Answer_C=Answer_C;
 conv.user.storage.Answer_D=Answer_D;
 conv.user.storage.Currect=Currect;
 conv.user.storage.Currect_Answer=Currect_Answer;
 conv.user.storage.thistime=thistime;
 conv.user.storage.lasttime=lasttime;
 conv.user.storage.heart_count=heart_count;
 conv.user.storage.Total_Count=Total_Count;
 conv.user.storage.Correct_Count=Correct_Count;
 conv.user.storage.Wrong_Count=Wrong_Count;
 conv.user.storage.Output_Title=Output_Title;
 conv.user.storage.Output_SubTitle=Output_SubTitle;
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
 thistime=conv.user.storage.thistime;
 lasttime=conv.user.storage.lasttime;
 heart_count=conv.user.storage.heart_count;
 Total_Count=conv.user.storage.Total_Count;
 Correct_Count=conv.user.storage.Correct_Count;
 Wrong_Count=conv.user.storage.Wrong_Count;
 Output_Title=conv.user.storage.Output_Title;
 Output_SubTitle=conv.user.storage.Output_SubTitle;
 Your_choice=conv.user.storage.Your_choice;
 menu=conv.user.storage.menu;
 end_game=conv.user.storage.end_game;
 question_output=conv.user.storage.question_output;
 answer_input=conv.user.storage.answer_input;
 next_question=conv.user.storage.next_question;
//「開始遊戲」啟動詞判斷
  if(menu===true&&end_game===false&&question_output===false&&answer_input===false&&end_game===false&&next_question===false){
   if(input==='開始遊戲'){ menu=false;question_output=true;answer_input=false;end_game=false;next_question=false;}
  }
  //「下一題」啟動詞判斷
 if(menu===false&&question_output===true&&answer_input===false&&end_game===false&&next_question===true){
 if(input==='下一題'){menu=false;question_output=true;answer_input=false;end_game=false;next_question=false;}
 }
//結算畫面防呆判斷
  if(menu===false&&end_game===true&&question_output===false&&answer_input===false&&next_question===false){
  
  if(input==='重新開始'||input==='好啊'){input='重新開始';}
   
  if(input==='重新開始'||input==='試試一般模式'){
    conv.ask('熱機已完成，開始你的問題!'); 
    lasttime=0;thistime=0;heart_count=3;Total_Count=0;Correct_Count=0; Wrong_Count=0;
    menu=false;question_output=true;answer_input=false;end_game=false;next_question=false;}
  }
  
  
if(menu===false&&question_output===true&&answer_input===false&&end_game===false&&next_question===false){
  menu=false;question_output=false;answer_input=true;end_game=false;next_question=true;
  Q=picker();
  if(Q===lasttime){Q++;}
  if(Q===thistime){Q++;}
  new question_picker();
  Total_Count++;
  //輸出圖像化的血量條
  if(heart_count==3){heart='⚫⚫⚫';}else if(heart_count==2){heart='⚫⚫';}else if(heart_count==1){heart='⚫';}
  
  conv.ask(new SimpleResponse({speech:`<speak><p><s>第${Total_Count}題</s><break time="0.2s"/><s>${Question_Title}</s><break time="0.15s"/><s>A、${Answer_A}</s><break time="0.1s"/><s> B、${Answer_B}</s><break time="0.1s"/><s>西、${Answer_C}</s><break time="0.1s"/><s>D、${Answer_D}</s><break time="0.1s"/></p></speak>`,text: '熱騰騰的題目來啦!'} ));

  conv.ask(new BasicCard({
        title:Total_Count+'.'+Question_Title,
        subtitle:'   \nA：'+Answer_A+'  \nB：'+Answer_B+'  \nC：'+Answer_C+'  \nD：'+Answer_D+'  \n',   
        text:'血量條：'+heart,
  }));
conv.ask(new Suggestions('    A    ','    B    ','    C    ','    D    '));
  
}
else if(menu===true&&end_game===false&&question_output===false&&answer_input===false&&next_question===false){conv.ask(new SimpleResponse({speech:'請對我說、開始遊戲、或、掰掰、進行相關操作!',text:'請重新輸入，謝謝!'})); conv.ask(new Suggestions('🎮 開始遊戲','👋 掰掰'));}
else if(menu===false&&question_output===false&&answer_input===true&&end_game===false&&next_question===true){
  conv.ask(new SimpleResponse({speech:'提醒您，只能輸入 A、B、溪、D，來回答問題喔!',text:'請輸入 A、B、C、D，來回答問題!'}));
  if(heart_count==3){heart='⚫⚫⚫';}else if(heart_count==2){heart='⚫⚫';}else if(heart_count==1){heart='⚫';}
  conv.ask(new BasicCard({   title:Total_Count+'.'+Question_Title,subtitle:'   \nA：'+Answer_A+'  \nB：'+Answer_B+'  \nC：'+Answer_C+'  \nD：'+Answer_D+'  \n',   text:'血量條：'+heart,}));
  conv.ask(new Suggestions('    A    ','    B    ','    C    ','    D    '));}
else if(menu===false&&question_output===true&&answer_input===false&&end_game===false&&next_question===true){conv.ask(new SimpleResponse({speech:'請對我說、下一題、繼續你的問題!',text:'請輸入「下一題」以繼續進行!'})); conv.ask(new Suggestions('    下一題    '));}
else if(menu===false&&question_output===false&&answer_input===true&&end_game===true&&next_question===false){conv.ask(new SimpleResponse({speech:'請對我說、休息、進入結算頁面!',text:'請輸入「休息」以繼續進行!'})); conv.ask(new Suggestions('休息，是為了走更長遠的路'));}
else if(menu===false&&end_game===true&&question_output===false&&answer_input===false&&next_question===false){conv.ask(new SimpleResponse({speech:'請對我說、重新開始、或、掰掰、進行相關操作!',text:'請重新輸入，謝謝!'})); conv.ask(new Suggestions('🔄 重新開始','👋 掰掰'));}
else{conv.ask('輸入錯誤喔!  \n請重新輸入，謝謝!');}
  
lasttime=thistime;//將本次題目編號儲存下來作為下次參考用
thistime=Q;       //將上次題目編號儲存下來作為下次參考用
   //參數同步回手機
 conv.user.storage.Question_Title=Question_Title;
 conv.user.storage.Answer_A=Answer_A;
 conv.user.storage.Answer_B=Answer_B;
 conv.user.storage.Answer_C=Answer_C;
 conv.user.storage.Answer_D=Answer_D;
 conv.user.storage.Currect=Currect;
 conv.user.storage.Currect_Answer=Currect_Answer;
 conv.user.storage.thistime=thistime;
 conv.user.storage.lasttime=lasttime;
 conv.user.storage.heart_count=heart_count;
 conv.user.storage.Total_Count=Total_Count;
 conv.user.storage.Correct_Count=Correct_Count;
 conv.user.storage.Wrong_Count=Wrong_Count;
 conv.user.storage.Output_Title=Output_Title;
 conv.user.storage.Output_SubTitle=Output_SubTitle;
 conv.user.storage.Your_choice=Your_choice;
 conv.user.storage.menu=menu;
 conv.user.storage.end_game=end_game;
 conv.user.storage.question_output=question_output;
 conv.user.storage.answer_input=answer_input;
 conv.user.storage.next_question=next_question;

});


app.intent('輸出答案', (conv,{Answer}) => {
   //參數上載到函式
 Question_Title=conv.user.storage.Question_Title;
 Answer_A=conv.user.storage.Answer_A;
 Answer_B=conv.user.storage.Answer_B;
 Answer_C=conv.user.storage.Answer_C;
 Answer_D=conv.user.storage.Answer_D;
 Currect=conv.user.storage.Currect;
 Currect_Answer=conv.user.storage.Currect_Answer;
 thistime=conv.user.storage.thistime;
 lasttime=conv.user.storage.lasttime;
 heart_count=conv.user.storage.heart_count;
 Total_Count=conv.user.storage.Total_Count;
 Correct_Count=conv.user.storage.Correct_Count;
 Wrong_Count=conv.user.storage.Wrong_Count;
 Output_Title=conv.user.storage.Output_Title;
 Output_SubTitle=conv.user.storage.Output_SubTitle;
 Your_choice=conv.user.storage.Your_choice;
 menu=conv.user.storage.menu;
 end_game=conv.user.storage.end_game;
 question_output=conv.user.storage.question_output;
 answer_input=conv.user.storage.answer_input;
 next_question=conv.user.storage.next_question;
  if(menu===false&&question_output===false&&answer_input===true&&end_game===false&&next_question===true){
  menu=false;question_output=true;answer_input=false;end_game=false;next_question=true;

 //若輸入正確 則判定答案是否正確(answer_input=T)
if(Answer==Currect){
    Correct_Count++;Output_SubTitle='這是正確答案';
   }
  else{
    Wrong_Count++;
    heart_count--; Output_SubTitle='這題答案是'+Currect+':'+Currect_Answer;
  }
 output_charactor=Currect;
    if(output_charactor==='C'){output_charactor='西';}
  //輸出文字
 var suggestion=''; var speech='';var outputtext='';
  
     if(heart_count>=1){
       if(Answer==Currect){ conv.ask(new SimpleResponse({speech:`<speak>恭喜你答對拉!</speak>`,text:'這是正確答案'})); suggestion='    下一題    ';}
       else{ 
            conv.ask(new SimpleResponse({speech:`<speak>答錯啦!正確答案為${output_charactor}、${Currect_Answer}</speak>`,text:'再接再厲!  \n下一題會答對的!'}));
            suggestion='    下一題    ';}
      }
       else{
          conv.ask(new SimpleResponse({speech:`<speak>回合結束!這題正確答案為${output_charactor}、${Currect_Answer}</speak>`,text:'別氣餒，下次再加油!'}));
         suggestion='休息，是為了走更長遠的路';menu=false;question_output=false;answer_input=true;end_game=true;next_question=false;}
  
           
  if(Answer==='A'){Your_choice=Answer_A;}else if(Answer==='B'){Your_choice=Answer_B;}else if(Answer==='C'){Your_choice=Answer_C;}else if(Answer==='D'){Your_choice=Answer_D;}
    
    conv.ask(new BasicCard({   
        title:'你選擇'+Answer+'：'+Your_choice,
        subtitle:Output_SubTitle,
        text:'原始題目：  \n「'+Question_Title+'」',
  }));
  
    conv.ask(new Suggestions(suggestion));
 }
else if(menu===true&&end_game===false&&question_output===false&&answer_input===false&&next_question===false){conv.ask(new SimpleResponse({speech:'請對我說、開始遊戲、快速模式、或、掰掰、進行相關操作!',text:'請重新輸入，謝謝!'})); conv.ask(new Suggestions('🎮 開始遊戲','👋 掰掰'));}
else if(menu===false&&question_output===true&&answer_input===false&&end_game===false&&next_question===true){conv.ask(new SimpleResponse({speech:'請對我說、下一題、繼續你的問題!',text:'請輸入「下一題」以繼續進行!'})); conv.ask(new Suggestions('    下一題    '));}
else if(menu===false&&question_output===false&&answer_input===true&&end_game===true&&next_question===false){conv.ask(new SimpleResponse({speech:'請對我說、休息、進入結算頁面!',text:'請輸入「休息」以繼續進行!'})); conv.ask(new Suggestions('休息，是為了走更長遠的路'));}
else if(menu===false&&end_game===true&&question_output===false&&answer_input===false&&next_question===false){conv.ask(new SimpleResponse({speech:'請對我說、重新開始、或、掰掰、進行相關操作!',text:'請重新輸入，謝謝!'})); conv.ask(new Suggestions('🔄 重新開始','👋 掰掰'));}

else{conv.ask('輸入錯誤喔!  \n請重新輸入，謝謝!');}
   //參數同步回手機
 conv.user.storage.Question_Title=Question_Title;
 conv.user.storage.Answer_A=Answer_A;
 conv.user.storage.Answer_B=Answer_B;
 conv.user.storage.Answer_C=Answer_C;
 conv.user.storage.Answer_D=Answer_D;
 conv.user.storage.Currect=Currect;
 conv.user.storage.Currect_Answer=Currect_Answer;
 conv.user.storage.thistime=thistime;
 conv.user.storage.lasttime=lasttime;
 conv.user.storage.heart_count=heart_count;
 conv.user.storage.Total_Count=Total_Count;
 conv.user.storage.Correct_Count=Correct_Count;
 conv.user.storage.Wrong_Count=Wrong_Count;
 conv.user.storage.Output_Title=Output_Title;
 conv.user.storage.Output_SubTitle=Output_SubTitle;
 conv.user.storage.Your_choice=Your_choice;
 conv.user.storage.menu=menu;
 conv.user.storage.end_game=end_game;
 conv.user.storage.question_output=question_output;
 conv.user.storage.answer_input=answer_input;
 conv.user.storage.next_question=next_question;

});

app.intent('結算頁面', (conv) => {
    //參數上載到函式
 Question_Title=conv.user.storage.Question_Title;
 Answer_A=conv.user.storage.Answer_A;
 Answer_B=conv.user.storage.Answer_B;
 Answer_C=conv.user.storage.Answer_C;
 Answer_D=conv.user.storage.Answer_D;
 Currect=conv.user.storage.Currect;
 Currect_Answer=conv.user.storage.Currect_Answer;
 thistime=conv.user.storage.thistime;
 lasttime=conv.user.storage.lasttime;
 heart_count=conv.user.storage.heart_count;
 Total_Count=conv.user.storage.Total_Count;
 Correct_Count=conv.user.storage.Correct_Count;
 Wrong_Count=conv.user.storage.Wrong_Count;
 Output_Title=conv.user.storage.Output_Title;
 Output_SubTitle=conv.user.storage.Output_SubTitle;
 Your_choice=conv.user.storage.Your_choice;
 menu=conv.user.storage.menu;
 end_game=conv.user.storage.end_game;
 question_output=conv.user.storage.question_output;
 answer_input=conv.user.storage.answer_input;
 next_question=conv.user.storage.next_question;
  
  if(menu===false&&question_output===false&&answer_input===true&&end_game===true&&next_question===false){
    menu=false;question_output=false;answer_input=false;end_game=true;next_question=false;
    Prograss=(Total_Count/Q_Total)*100;conv.ask(new Suggestions('🔄 重新開始','👋 掰掰'));
    Prograss=roundDecimal(Prograss, 1);
    conv.ask(new SimpleResponse({speech:`<speak><p><s>你在這回合進行${Total_Count}<break time="0.03s"/>題題目。</s><s>你要再試一次嗎?</s></p></speak>`,text: '驗收成果'}
                              ));
    conv.ask(new BasicCard({   
        title: '本回合共進行:'+Total_Count+'個題目  \n('+'約為總題目的'+Prograss+'%)',
        subtitle:'答對數：'+Correct_Count+'  \n錯誤數：'+Wrong_Count, 
        text:'在此輸入任意文字',
       })); 
   }
else if(menu===true&&end_game===false&&question_output===false&&answer_input===false&&next_question===false){conv.ask(new SimpleResponse({speech:'請對我說、開始遊戲、或、掰掰、進行相關操作!',text:'請重新輸入，謝謝!'})); conv.ask(new Suggestions('🎮 開始遊戲','👋 掰掰'));}
else if(menu===false&&question_output===false&&answer_input===true&&end_game===false&&next_question===true){
  conv.ask(new SimpleResponse({speech:'提醒您，只能輸入 A、B、溪、D，來回答問題喔!',text:'請輸入 A、B、C、D，來回答問題!'}));
  if(heart_count==3){heart='⚫⚫⚫';}else if(heart_count==2){heart='⚫⚫';}else if(heart_count==1){heart='⚫';}
  conv.ask(new BasicCard({   title:Total_Count+'.'+Question_Title,subtitle:'   \nA：'+Answer_A+'  \nB：'+Answer_B+'  \nC：'+Answer_C+'  \nD：'+Answer_D+'  \n',   text:'血量條：'+heart,}));
  conv.ask(new Suggestions('    A    ','    B    ','    C    ','    D    '));}
else if(menu===false&&question_output===true&&answer_input===false&&end_game===false&&next_question===true){conv.ask(new SimpleResponse({speech:'請對我說、下一題、繼續你的問題!',text:'請輸入「下一題」以繼續進行!'})); conv.ask(new Suggestions('    下一題    '));}
else if(menu===false&&question_output===false&&answer_input===true&&end_game===true&&next_question===false){conv.ask(new SimpleResponse({speech:'請對我說、休息、進入結算頁面!',text:'請輸入「休息」以繼續進行!'})); conv.ask(new Suggestions('休息，是為了走更長遠的路'));}
else if(menu===false&&end_game===true&&question_output===false&&answer_input===false&&next_question===false){conv.ask(new SimpleResponse({speech:'請對我說、重新開始、或、掰掰、進行相關操作!',text:'請重新輸入，謝謝!'})); conv.ask(new Suggestions('🔄 重新開始','👋 掰掰'));}
else{conv.ask('輸入錯誤喔!  \n請重新輸入，謝謝!');}
  
    //參數同步回手機
 conv.user.storage.Question_Title=Question_Title;
 conv.user.storage.Answer_A=Answer_A;
 conv.user.storage.Answer_B=Answer_B;
 conv.user.storage.Answer_C=Answer_C;
 conv.user.storage.Answer_D=Answer_D;
 conv.user.storage.Currect=Currect;
 conv.user.storage.Currect_Answer=Currect_Answer;
 conv.user.storage.thistime=thistime;
 conv.user.storage.lasttime=lasttime;
 conv.user.storage.heart_count=heart_count;
 conv.user.storage.Total_Count=Total_Count;
 conv.user.storage.Correct_Count=Correct_Count;
 conv.user.storage.Wrong_Count=Wrong_Count;
 conv.user.storage.Output_Title=Output_Title;
 conv.user.storage.Output_SubTitle=Output_SubTitle;
 conv.user.storage.Your_choice=Your_choice;
 conv.user.storage.menu=menu;
 conv.user.storage.end_game=end_game;
 conv.user.storage.question_output=question_output;
 conv.user.storage.answer_input=answer_input;
 conv.user.storage.next_question=next_question;
});


app.intent('錯誤回應反饋', (conv) => {
     //參數上載到函式
 Question_Title=conv.user.storage.Question_Title;
 Answer_A=conv.user.storage.Answer_A;
 Answer_B=conv.user.storage.Answer_B;
 Answer_C=conv.user.storage.Answer_C;
 Answer_D=conv.user.storage.Answer_D;
 Currect=conv.user.storage.Currect;
 Currect_Answer=conv.user.storage.Currect_Answer;
 thistime=conv.user.storage.thistime;
 lasttime=conv.user.storage.lasttime;
 heart_count=conv.user.storage.heart_count;
 Total_Count=conv.user.storage.Total_Count;
 Correct_Count=conv.user.storage.Correct_Count;
 Wrong_Count=conv.user.storage.Wrong_Count;
 Output_Title=conv.user.storage.Output_Title;
 Output_SubTitle=conv.user.storage.Output_SubTitle;
 Your_choice=conv.user.storage.Your_choice;
 menu=conv.user.storage.menu;
 end_game=conv.user.storage.end_game;
 question_output=conv.user.storage.question_output;
 answer_input=conv.user.storage.answer_input;
 next_question=conv.user.storage.next_question;
if(menu===true&&end_game===false&&question_output===false&&answer_input===false&&next_question===false){conv.ask(new SimpleResponse({speech:'請對我說、開始遊戲、快速模式、或、掰掰、進行相關操作!',text:'請重新輸入，謝謝!'})); conv.ask(new Suggestions('🎮 開始遊戲','👋 掰掰'));}
else if(menu===false&&question_output===false&&answer_input===true&&end_game===false&&next_question===true){
  conv.ask(new SimpleResponse({speech:'提醒您，只能輸入 A、B、溪、D，來回答問題喔!',text:'請輸入 A、B、C、D，來回答問題!'}));
  if(heart_count==3){heart='⚫⚫⚫';}else if(heart_count==2){heart='⚫⚫';}else if(heart_count==1){heart='⚫';}
  conv.ask(new BasicCard({   title:Total_Count+'.'+Question_Title,subtitle:'   \nA：'+Answer_A+'  \nB：'+Answer_B+'  \nC：'+Answer_C+'  \nD：'+Answer_D+'  \n',   text:'血量條：'+heart,}));
  conv.ask(new Suggestions('    A    ','    B    ','    C    ','    D    '));}
else if(menu===false&&question_output===true&&answer_input===false&&end_game===false&&next_question===true){conv.ask(new SimpleResponse({speech:'請對我說、下一題、繼續你的問題!',text:'請輸入「下一題」以繼續進行!'})); conv.ask(new Suggestions('    下一題    '));}
else if(menu===false&&question_output===false&&answer_input===true&&end_game===true&&next_question===false){conv.ask(new SimpleResponse({speech:'請對我說、休息、進入結算頁面!',text:'請輸入「休息」以繼續進行!'})); conv.ask(new Suggestions('休息，是為了走更長遠的路'));}
else if(menu===false&&end_game===true&&question_output===false&&answer_input===false&&next_question===false){conv.ask(new SimpleResponse({speech:'請對我說、重新開始、或、掰掰、進行相關操作!',text:'請重新輸入，謝謝!'})); conv.ask(new Suggestions('🔄 重新開始','👋 掰掰'));}
else{conv.ask('輸入錯誤喔!  \n請重新輸入，謝謝!');}
  
 //參數同步回手機
 conv.user.storage.Question_Title=Question_Title;
 conv.user.storage.Answer_A=Answer_A;
 conv.user.storage.Answer_B=Answer_B;
 conv.user.storage.Answer_C=Answer_C;
 conv.user.storage.Answer_D=Answer_D;
 conv.user.storage.Currect=Currect;
 conv.user.storage.Currect_Answer=Currect_Answer;
 conv.user.storage.thistime=thistime;
 conv.user.storage.lasttime=lasttime;
 conv.user.storage.heart_count=heart_count;
 conv.user.storage.Total_Count=Total_Count;
 conv.user.storage.Correct_Count=Correct_Count;
 conv.user.storage.Wrong_Count=Wrong_Count;
 conv.user.storage.Output_Title=Output_Title;
 conv.user.storage.Output_SubTitle=Output_SubTitle;
 conv.user.storage.Your_choice=Your_choice;
 conv.user.storage.menu=menu;
 conv.user.storage.end_game=end_game;
 conv.user.storage.question_output=question_output;
 conv.user.storage.answer_input=answer_input;
 conv.user.storage.next_question=next_question;
});


app.intent('結束對話', (conv) => {
    conv.user.storage = {}; //離開同時清除暫存資料
    conv.close('希望你玩得愉快!下次見 👋');
});
  
  
// Set the DialogflowApp object to handle the HTTPS POST request.
exports.dialogflowFirebaseFulfillment = functions.https.onRequest(app);