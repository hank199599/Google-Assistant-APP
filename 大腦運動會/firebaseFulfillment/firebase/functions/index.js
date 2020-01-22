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
const replaceString = require('replace-string');

// Instantiate the Dialogflow client.
const app = dialogflow({debug: true});
var question_list = require('./question_list.json'); //引用外部函數來輸入國旗答案與解釋

//宣告陣列，隨機挑選開始畫面圖片

var theArray= new Array;
theArray=["https://imgur.com/GpUs1EH.jpg","https://imgur.com/cqL6GNP.jpg","https://imgur.com/savk6bY.jpg","https://imgur.com/vTY6hlh.jpg","https://imgur.com/47zZGW0.jpg","https://imgur.com/12wGdke.jpg","https://imgur.com/7nNc48A.jpg","https://imgur.com/LMgc0a9.jpg","https://imgur.com/r1SsffU.jpg","https://imgur.com/45owj76.jpg","https://imgur.com/QzUcp41.jpg","https://imgur.com/DaZiJF2.jpg","https://imgur.com/GDp4Pbw.jpg","https://imgur.com/T0VVh26.jpg","https://imgur.com/WbMrbM1.jpg",];
function ranFun(){return parseInt(Math.random()*15);}

var Picture_url='';
var Question_Title='';var Answer_A='';var Answer_B='';var Answer_C='';var Answer_D='';var Currect='';var Currect_Answer='';
var Question_Title_Output='';var Answer_A_Output='';var Answer_B_Output='';var Answer_C_Output='';var Answer_D_Output='';var Currect_Answer_Output='';
var Q=0; //提取題目編號
var Q_Total=1; //題目總數
var Q_list=new Array([]);//儲存題目編號
var output_array="";
var count=0;
var heart_count=3;//你的血量數
var heart='';//你的血量(圖示化表示)
var Total_Count=0; //統計已答題的總個數
var Correct_Count=0; //統計答題正確個數
var Wrong_Count=0;   //統計答題錯誤個數
var Output_Title=''; var Outputtext="";
var Output_SubTitle='';
var checker="";
var Your_choice='';
var Picture_url='';
var output_charactor='';
var Prograss=0;//換算進度百分比
var menu=false;            //判別是否在歡迎頁面
var end_game=false;        //判別遊戲是否已結束
var question_output=false; //判別是否拿到出題目許可
var answer_input=false; //判別是否輸入許可的答案
var next_question=false; //判別是否輸入許可的答案
var roundDecimal = function (val, precision) { //進行四捨五入的函式呼叫
  return Math.round(Math.round(val * Math.pow(10, (precision || 0) + 1)) / 10) / Math.pow(10, (precision || 0));};
var ButtonURL="";
var selector=0;var section=0;
var inputarray=["🔄 重新開始","🎮 試試一般模式","再來一次","再玩一次","再試一次","再來","重新開始","試試一般模式","重來","好","OK","可以","再一次","好啊"];


//歡迎畫面
app.intent('預設歡迎語句', (conv) => { 

 menu=true;question_output=false;answer_input=false;end_game=false;next_question=false;
 heart_count=3;Total_Count=0;Correct_Count=0; Wrong_Count=0;
 Q_list= [];
 Picture_url=theArray[ranFun()];
    if (conv.user.last.seen) { conv.ask(new SimpleResponse({               
                      speech: `<speak><prosody volume="loud"><p><s>歡迎遊玩大腦運動會!</s><s>準備好就說聲「開始遊戲」接受挑戰八!</s></p></prosody></speak>`,
                       text: '歡迎回來!',}));
   } else {conv.ask(new SimpleResponse({               
                      speech: `<speak><prosody volume="loud"><p><s>歡迎遊玩大腦運動會!</s><s>本服務內含有數百題的益智問答，若你的錯誤次數超過3次，遊戲就結束!</s><s>準備好就說聲「開始遊戲」接受挑戰八!</s></p></prosody></speak>`,
                       text: '歡迎使用「大腦運動會」!',}));}
 
        conv.ask(new BasicCard({   
        image: new Image({url:Picture_url,alt:'Pictures',}),
        title: '準備好接受問題轟炸了嗎?',
        subtitle:'若你的錯誤次數超過3次，遊戲就結束!  \n準備好就按下「開始遊戲」接受挑戰吧!',
        text:'圖片來源：Pxhere & NASA (CC0 公共領域授權)',
        display: 'CROPPED',//更改圖片顯示模式為自動擴展
        }));
 conv.ask(new Suggestions('🎮 開始遊戲','👋 掰掰'));

 //參數同步回手機
 conv.user.storage.Question_Title=Question_Title;
 conv.user.storage.Answer_A=Answer_A;
 conv.user.storage.Answer_B=Answer_B;
 conv.user.storage.Answer_C=Answer_C;
 conv.user.storage.Answer_D=Answer_D;
 conv.user.storage.Currect=Currect;
 conv.user.storage.Q_list=Q_list;
 conv.user.storage.heart_count=heart_count;
 conv.user.storage.Total_Count=Total_Count;
 conv.user.storage.Correct_Count=Correct_Count;
 conv.user.storage.Wrong_Count=Wrong_Count;
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
 Q_list=conv.user.storage.Q_list;
 heart_count=conv.user.storage.heart_count;
 Total_Count=conv.user.storage.Total_Count;
 Correct_Count=conv.user.storage.Correct_Count;
 Wrong_Count=conv.user.storage.Wrong_Count;
 Your_choice=conv.user.storage.Your_choice;
 menu=conv.user.storage.menu;
 end_game=conv.user.storage.end_game;
 question_output=conv.user.storage.question_output;
 answer_input=conv.user.storage.answer_input;
 next_question=conv.user.storage.next_question;
 ButtonURL=conv.user.storage.ButtonURL;
   if(input.indexOf('開始')!==-1){ menu=true;question_output=false;answer_input=false;end_game=false;next_question=false;
 heart_count=3;Total_Count=0;Correct_Count=0; Wrong_Count=0;
 Q_list= [];}


//「開始遊戲」啟動詞判斷
  if(menu===true&&end_game===false&&question_output===false&&answer_input===false&&end_game===false&&next_question===false){
    menu=false;question_output=true;answer_input=false;end_game=false;next_question=false;
  }
  //「下一題」啟動詞判斷
 if(menu===false&&question_output===true&&answer_input===false&&end_game===false&&next_question===true){
   if(input!=='下一題'){input='下一題';}
   if(input==='下一題'){menu=false;question_output=true;answer_input=false;end_game=false;next_question=false;}
 }
  //進入結算頁面判斷
  if(menu===false&&question_output===false&&answer_input===true&&end_game===true&&next_question===false){
      if(input!=='休息，是為了走更長遠的路'){input='休息，是為了走更長遠的路';}
      if(input==='休息，是為了走更長遠的路'){menu=true;question_output=false;answer_input=false;end_game=true;next_question=false;}
  }
  
//結算畫面防呆判斷
 if(menu===false&&question_output===false&&answer_input===false&&end_game===true&&next_question===false){
  
 if(inputarray.indexOf(input)!==-1){
    conv.ask('熱機已完成，開始你的問題!'); 
    heart_count=3;Total_Count=0;Correct_Count=0; Wrong_Count=0;
    menu=false;question_output=true;answer_input=false;end_game=false;next_question=false;}
  }
  
  
if(menu===false&&question_output===true&&answer_input===false&&end_game===false&&next_question===false){
  menu=false;question_output=false;answer_input=true;end_game=false;next_question=true;
  Answer_A="";Answer_B="";Answer_C="";Answer_D="";
    
  for(Q=parseInt(Math.random()*Q_Total);Q_list.indexOf(Q)!==-1;Q=(Q+1)%(Q_Total+1))
  Q_list.push(Q);// 將現在選出的編號存入陣列
  
  count= Object.keys(Q_list).length;
  output_array=question_list[Q];
  Question_Title=output_array[0]; //選出這次的題目標題

  selector=parseInt(Math.random()*3);   //選擇正確答案之位置
  section=parseInt(Math.random()*5);    //選擇其餘錯誤選項之排列方式
  
  //生成本次的選項組合
  if(selector===0){Answer_A=output_array[1]; Currect="A";
		if(section===0){Answer_B=output_array[2];Answer_C=output_array[3];Answer_D=output_array[4];}
		else if(section===1){Answer_B=output_array[2];Answer_C=output_array[4];Answer_D=output_array[3];}
		else if(section===2){Answer_B=output_array[3];Answer_C=output_array[2];Answer_D=output_array[4];}
		else if(section===3){Answer_B=output_array[3];Answer_C=output_array[4];Answer_D=output_array[2];}
		else if(section===4){Answer_B=output_array[4];Answer_C=output_array[2];Answer_D=output_array[3];}
		else if(section===5){Answer_B=output_array[4];Answer_C=output_array[3];Answer_D=output_array[2];}
  }
  else if(selector===1){Answer_B=output_array[1];Currect="B";
		if(section===0){Answer_A=output_array[2];Answer_C=output_array[3];Answer_D=output_array[4];}
		else if(section===1){Answer_A=output_array[2];Answer_C=output_array[4];Answer_D=output_array[3];}
		else if(section===2){Answer_A=output_array[3];Answer_C=output_array[2];Answer_D=output_array[4];}
		else if(section===3){Answer_A=output_array[3];Answer_C=output_array[4];Answer_D=output_array[2];}
		else if(section===4){Answer_A=output_array[4];Answer_C=output_array[2];Answer_D=output_array[3];}
		else if(section===5){Answer_A=output_array[4];Answer_C=output_array[3];Answer_D=output_array[2];}
  }
  else if(selector===2){Answer_C=output_array[1];Currect="C";
		if(section===0){Answer_A=output_array[2];Answer_B=output_array[3];Answer_D=output_array[4];}
		else if(section===1){Answer_A=output_array[2];Answer_B=output_array[4];Answer_D=output_array[3];}
		else if(section===2){Answer_A=output_array[3];Answer_B=output_array[2];Answer_D=output_array[4];}
		else if(section===3){Answer_A=output_array[3];Answer_B=output_array[4];Answer_D=output_array[2];}
		else if(section===4){Answer_A=output_array[4];Answer_B=output_array[2];Answer_D=output_array[3];}
		else if(section===5){Answer_A=output_array[4];Answer_B=output_array[3];Answer_D=output_array[2];}
  }
  else if(selector===3){Answer_D=output_array[1];Currect="D";
		if(section===0){Answer_A=output_array[2];Answer_B=output_array[3];Answer_C=output_array[4];}
		else if(section===1){Answer_A=output_array[2];Answer_B=output_array[4];Answer_C=output_array[3];}
		else if(section===2){Answer_A=output_array[3];Answer_B=output_array[2];Answer_C=output_array[4];}
		else if(section===3){Answer_A=output_array[3];Answer_B=output_array[4];Answer_C=output_array[2];}
		else if(section===4){Answer_A=output_array[4];Answer_B=output_array[2];Answer_C=output_array[4];}
		else if(section===5){Answer_A=output_array[4];Answer_B=output_array[3];Answer_C=output_array[2];}
  }

  Total_Count++;
  Question_Title_Output=Question_Title; Answer_A_Output=Answer_A; Answer_B_Output=Answer_B; Answer_C_Output=Answer_C; Answer_D_Output=Answer_D;

  //將經典的「傳」讀音改回正確讀音
  Question_Title_Output=replaceString(Question_Title_Output, '傳》', '饌》');
  Question_Title_Output=replaceString(Question_Title_Output, '「', '<break time="0.2s"/>');
  Question_Title_Output=replaceString(Question_Title_Output, '」', '<break time="0.2s"/>');
  Answer_A_Output=replaceString(Answer_A_Output, '傳》', '饌》');
  Answer_B_Output=replaceString(Answer_B_Output, '傳》', '饌》');
  Answer_C_Output=replaceString(Answer_C_Output, '傳》', '饌》');
  Answer_D_Output=replaceString(Answer_D_Output, '傳》', '饌》');

  conv.ask(new SimpleResponse({speech:`<speak><p><s>第${Total_Count}題</s><break time="0.2s"/><s>${Question_Title_Output}</s><break time="0.15s"/><s>A、${Answer_A_Output}</s><break time="0.1s"/><s> B、${Answer_B_Output}</s><break time="0.1s"/><s>西、${Answer_C_Output}</s><break time="0.1s"/><s>D、${Answer_D_Output}</s><break time="0.1s"/></p></speak>`,text: '熱騰騰的題目來啦!'} ));
 
  //輸出圖像化的血量條
    if(heart_count==3){heart='⚫⚫⚫';}else if(heart_count==2){heart='⚫⚫';}else if(heart_count==1){heart='⚫';}

	if(conv.user.verification === 'VERIFIED'){
		 conv.ask(new BasicCard({
			title:Total_Count+'.'+Question_Title,
			subtitle:'   \n(A) '+Answer_A+'  \n(B) '+Answer_B+'  \n(C) '+Answer_C+'  \n(D) '+Answer_D+'  \n',   
			text:'血量條 '+heart,
	  }));
  conv.ask(new Suggestions('    A    ','    B    ','    C    ','    D    '));
	}else{
		conv.ask(new SimpleResponse({               
                      speech: "在開始前，您需要啟用Google助理，我才能提供你個人化體驗喔!",
                       text: '請進行相關設定，才能進行遊戲!',}));
	   conv.close(new BasicCard({   
			image: new Image({url:'https://www.gstatic.com/images/branding/product/2x/assistant_48dp.png',alt:'Pictures',}),
			title: '錯誤：您需要進行設定',
			subtitle:'Google 助理需要授權(請點擊畫面右下方的「開始使用」)。\n授權後我才能為你儲存個人對話狀態，\n藉此提升你的使用體驗!\n', 
			display: 'CROPPED',
		}));}
}
else if(menu===true&&question_output===false&&answer_input===false&&end_game===true&&next_question===false){
     menu=false;question_output=false;answer_input=false;end_game=true;next_question=false;
	 
	 Prograss=(Total_Count/Q_Total)*100;
     Prograss=roundDecimal(Prograss, 1);
	 
    conv.ask(new Suggestions('🔄 重新開始','👋 掰掰'));
    conv.ask(new SimpleResponse({speech:`<speak><audio src="${calculate_sound}"/><prosody volume="loud"><p><s>根據Google神通廣大的雲端計算!</s><s>你在這回合一共進行<break time="0.05s"/>${Total_Count}<break time="0.03s"/>題題目。</s><s>你要再試一次嗎?</s></p></prosody></speak>`,text: '驗收成果'}
                              ));
    conv.ask(new BasicCard({   
        image: new Image({url:'https://imgur.com/JXFXlAD.jpg',alt:'Pictures',}),
        title: '本回合共進行'+Total_Count+'個題目',
        subtitle:'答對數：'+Correct_Count+'  \n錯誤數：'+Wrong_Count, 
		text:'約略為總題目的'+Prograss+'%',
        display: 'CROPPED',//更改圖片顯示模式為自動擴展
       })); 
   }
else if(menu===false&&question_output===false&&answer_input===true&&end_game===false&&next_question===true){

  if(input==='a'){input='A';}
  else if(input==='b'){input='B';}
  else if(input==='c'){input='C';}
  else if(input==='d'||input==='豬'){input='D';}
  
  checker=input;
  checker='《'+checker+'》';
  if(checker===Answer_A){input=checker;}
  else if(checker===Answer_B){input=checker;}
  else if(checker===Answer_C){input=checker;}
  else if(checker===Answer_D){input=checker;}
 
  
  if(input===Answer_A||input===Answer_B||input===Answer_C||input===Answer_D||input==='A'||input==='B'||input==='C'||input==='D'){
  menu=false;question_output=true;answer_input=false;end_game=false;next_question=true;
  
  if(input===Answer_A){input='A';}else if(input===Answer_B){input='B';}
  else if(input===Answer_C){input='C';}else if(input===Answer_D){input='D';}

  //匯出正確選項之內容
if(Currect==="A"){Currect_Answer=Answer_A;} else if(Currect==="B"){Currect_Answer=Answer_B;} else if(Currect==="C"){Currect_Answer=Answer_C;} else if(Currect==="D"){Currect_Answer=Answer_D;} 

 //若輸入正確 則判定答案是否正確(input_input=T)
if(input===Currect){
    Correct_Count++;Output_SubTitle='這是正確答案';
    //輸出圖像化的血量條
    if(heart_count==3){heart='⚫⚫⚫';}else if(heart_count==2){heart='⚫⚫';}else if(heart_count==1){heart='⚫';}
   }
  else{
    Wrong_Count++;
    heart_count--; Output_SubTitle='這題答案是 ('+Currect+') '+Currect_Answer;
    //輸出圖像化的血量條
   if(heart_count==3){heart='⚫⚫⚫';}else if(heart_count==2){heart='⚫⚫⚪';}else if(heart_count==1){heart='⚫⚪';}else{heart='─';}        
  }
 output_charactor=Currect;
 Currect_Answer_Output=Currect_Answer;
 //將經典的「傳」讀音改回正確讀音
  Currect_Answer_Output=replaceString(Currect_Answer_Output, '傳》', '饌》');

    if(output_charactor==='C'){output_charactor='西';}
  //輸出文字
 var suggestion=''; var speech='';var outputtext='';

     if(heart_count>=1){
       if(input===Currect){ conv.ask(new SimpleResponse({speech:`<speak>恭喜你答對拉!</speak>`,text:'恭喜答對拉 🎉'})); suggestion='    下一題    ';}
       else{ 
            conv.ask(new SimpleResponse({speech:`<speak>答錯啦!正確答案為${output_charactor}、${Currect_Answer_Output}</speak>`,text:'再接再厲 💪'}));
            suggestion='    下一題    ';}
      }
       else{
          conv.ask(new SimpleResponse({speech:`<speak>回合結束!這題正確答案為${output_charactor}、${Currect_Answer_Output}</speak>`,text:'別氣餒，下次再加油 🥊'}));
         suggestion='休息，是為了走更長遠的路';menu=false;question_output=false;answer_input=true;end_game=true;next_question=false;}
  
  if(input==='A'){Your_choice=Answer_A;}else if(input==='B'){Your_choice=Answer_B;}else if(input==='C'){Your_choice=Answer_C;}else if(input==='D'){Your_choice=Answer_D;}
 
  Outputtext='第'+Total_Count+'題 • 血量條 '+heart;	

    conv.ask(new BasicCard({   
        title:'你選擇 ('+input+') '+Your_choice,
        subtitle:Output_SubTitle+'\n\n〈原始題目〉 \n'+Question_Title,
        text:Outputtext,
	    }));

    conv.ask(new Suggestions(suggestion));
  }
 else{
  conv.ask(new SimpleResponse({speech:'請點選建議卡片或說出選項內容，來回答問題!',text:'請點選建議卡片或說出選項內容!'}));
  if(heart_count==3){heart='⚫⚫⚫';}else if(heart_count==2){heart='⚫⚫';}else if(heart_count==1){heart='⚫';}
     conv.ask(new BasicCard({
        title:Total_Count+'.'+Question_Title,
        subtitle:'   \n(A) '+Answer_A+'  \n(B) '+Answer_B+'  \n(C) '+Answer_C+'  \n(D) '+Answer_D+'  \n',   
        text:'血量條 '+heart,
  }));
 conv.ask(new Suggestions('    A    ','    B    ','    C    ','    D    '));}
}
else if(menu===false&&question_output===false&&answer_input===false&&end_game===true&&next_question===false){
    conv.ask(new Suggestions('🔄 重新開始','👋 掰掰'));
    conv.ask(new SimpleResponse(
	{speech:`<speak><p><s>不好意思，我沒聽清楚。\n</s><s>請試著說<break time="0.2s"/>重新開始<break time="0.2s"/>或<break time="0.2s"/>掰掰<break time="0.2s"/>來確認你的操作。</s></p></speak>`,
	text: '抱歉，我不懂你的意思。\n請點擊建議卡片來確認你的操作。'}));
 }
else{ 	 conv.ask(new SimpleResponse({               
                      speech: "本服務需要您進一步進行設定才能繼續進行，請依照下述步驟開啟「網路與應用程式」功能。才能獲得個人化體驗喔!",
                       text: '請進行相關設定，才能進行遊戲!',}));
	   conv.close(new BasicCard({   
        title: '錯誤：您需要進行設定',
        subtitle:'為了給您個人化的遊戲體驗，請進行下述設定：\n\n1. 前往Google帳戶設定\n2.	開啟「網路和應用程式活動」功能\n3.	開啟「包括 Chrome 瀏覽記錄以及採用 Google 服務的網站、應用程式和裝置中的活動記錄」\n', 
         buttons: new Button({title: 'Google活動控制項',url:"https://myaccount.google.com/activitycontrols?pli=1",}),

		}));
}
  
   //參數同步回手機
 conv.user.storage.Question_Title=Question_Title;
 conv.user.storage.Answer_A=Answer_A;
 conv.user.storage.Answer_B=Answer_B;
 conv.user.storage.Answer_C=Answer_C;
 conv.user.storage.Answer_D=Answer_D;
 conv.user.storage.Currect=Currect;
 conv.user.storage.Q_list=Q_list;
 conv.user.storage.heart_count=heart_count;
 conv.user.storage.Total_Count=Total_Count;
 conv.user.storage.Correct_Count=Correct_Count;
 conv.user.storage.Wrong_Count=Wrong_Count;
 conv.user.storage.Your_choice=Your_choice;
 conv.user.storage.menu=menu;
 conv.user.storage.end_game=end_game;
 conv.user.storage.question_output=question_output;
 conv.user.storage.answer_input=answer_input;
 conv.user.storage.next_question=next_question;
 conv.user.storage.ButtonURL=ButtonURL;

});

app.intent('結束對話', (conv) => {
    conv.user.storage = {}; //離開同時清除暫存資料
    conv.ask('希望你玩得愉快!');
    conv.ask(new SimpleResponse({speech: '下次見',text: '下次見 👋',}));
    conv.close(new BasicCard({   
        title: '感謝您的使用!', 
        text:'如果有任何需要改進的地方，  \n歡迎到簡介頁面評分或給予反饋，謝謝!', 
        buttons: new Button({title: '開啟本程式的商店頁面',url: 'https://assistant.google.com/services/a/uid/000000603cba0b27',}),
  })); 

});
  
  
// Set the DialogflowApp object to handle the HTTPS POST request.
exports.brain_game = functions.https.onRequest(app);