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
var nzhhk = require("nzh/hk"); //引入繁体中文數字轉換器
const app = dialogflow({debug: true});

i18n.configure({
  locales: ['zh-TW','zh-CN','zh-HK','en'],
  directory: __dirname + '/locales',
  defaultLocale: 'en',
});
app.middleware((conv) => {
  i18n.setLocale(conv.user.locale);
});

// Instantiate the Dialogflow client.
var sys_number=0;//系統生成的數字
var sys_guess='';//系統隨機生成的數字
var yourchoice=0;//你選擇要生成的最大值
var your_guess=0;//你猜的數字
var sys_complete=false;//判別是否已經生成數字
var U_limit=0;//上限
var D_limit=0;//下限
var answer_checker=false;//判別是否猜到了
var checker='';var checker1='';
var guess_count=0; //計算猜測次數
var number=0; //轉換成數字的輸入數值
var menu=true;     //判別是否位於開始畫面
var end_game=false; //判別遊戲是否已結束
var question_output=false; //判別是否拿到出題目許可
var input_checker=false; //用於檢查輸入是否正確
var answer_input=false; //判別是否輸入許可的答案
var inputarray=['🎮 '+i18n.__('Restart'),i18n.__('Restart'),"one more","again","replay","try again","one more time","restart","play again","ok","🔄 重新開始","再來一次","再玩一次","再試一次","再來","重新開始","重來","好","OK","可以","再一次","好啊"];

//歡迎畫面
app.intent('預設歡迎語句', (conv) => { 
  menu=true;answer_input=false;end_game=false;
  answer_checker=false;sys_complete=false;D_limit=0;U_limit=0;guess_count=0;
 
if(conv.screen===true){ 
    if (conv.user.last.seen) {
		  menu=false;answer_input=false;end_game=false;
		  answer_checker=false;sys_complete=false;D_limit=0;U_limit=0;guess_count=0;
         conv.ask(new SimpleResponse({               
			 speech: `<speak><p><s>${i18n.__('Welcome_back')}</s><s>${i18n.__('Selectouttext')}</s></p></speak>`,
			 text: i18n.__('Welcome_back'),}));
			  conv.ask(new BasicCard({title:i18n.__('SelectTitle'),subtitle:i18n.__('SelectSubTitle'),text:i18n.__('SelectText')}));
		  input_checker=false;
		  conv.ask(new Suggestions('50','100','250','500','1000','🎲 '+i18n.__('Lucky')));
   } else {

         conv.ask(new SimpleResponse({               
         speech: `<speak><p><s>${i18n.__('Welcome_1')}</s><s>${i18n.__('Welcome_2')}</s><s>${i18n.__('Welcome_3')}</s><s>${i18n.__('Welcome_4')}</s></p></speak>`,
         text: i18n.__('Welcome_init'),}));
		 conv.ask(new BasicCard({   
				image: new Image({url:'https://imgur.com/jDh7GXp.jpg',alt:'Pictures',}),
				title:i18n.__('Welcome_Title') ,
				subtitle:i18n.__('Welcome_Subtitle'), 
				text:i18n.__('Welcome_Text'),
				display: 'CROPPED',//更改圖片顯示模式為自動擴展
        }));
 conv.ask(new Suggestions('🎮 '+i18n.__('StartGame'),'👋 '+i18n.__('Bye')));
}
 
}else{   

  menu=false;answer_input=false;end_game=false;
  answer_checker=false;sys_complete=false;D_limit=0;U_limit=0;guess_count=0;
 
	  conv.noInputs = [i18n.__('Welcome_Noinput_1'),i18n.__('Welcome_Noinput_2'),i18n.__('Welcome_Noinput_3')];	   
 
	  conv.ask(new SimpleResponse({               
         speech: `<speak><p><s>${i18n.__('Select1')}</s><s>${i18n.__('Select2')}</s><s>${i18n.__('Select3')}</s></p></speak>`,
         text: i18n.__('Selectouttext'),}));
	  input_checker=false;
  }

 
  //將數據同步回手機
conv.user.storage.sys_number=sys_number;
conv.user.storage.yourchoice=yourchoice;
conv.user.storage.your_guess=your_guess;
conv.user.storage.sys_complete=sys_complete;
conv.user.storage.U_limit=U_limit;
conv.user.storage.D_limit=D_limit;
conv.user.storage.guess_count=guess_count;
conv.user.storage.number=number;
conv.user.storage.menu=menu;
conv.user.storage.end_game=end_game;
conv.user.storage.question_output=question_output;
conv.user.storage.input_checker=input_checker;
conv.user.storage.answer_input=answer_input;

});

app.intent('輸入數字', (conv,{any}) => {
//將數據上載到函式
sys_number=conv.user.storage.sys_number;
yourchoice=conv.user.storage.yourchoice;
your_guess=conv.user.storage.your_guess;
sys_complete=conv.user.storage.sys_complete;
U_limit=conv.user.storage.U_limit;
D_limit=conv.user.storage.D_limit;
guess_count=conv.user.storage.guess_count;
number=conv.user.storage.number;
input_checker=conv.user.storage.input_checker;
menu=conv.user.storage.menu;
end_game=conv.user.storage.end_game;
question_output=conv.user.storage.question_output;
answer_input=conv.user.storage.answer_input;

if(any==='StartGame'){  menu=true;answer_input=false;end_game=false;
  sys_complete=false;D_limit=0;U_limit=0;guess_count=0;
  }

if(any===i18n.__('StartGame')){  menu=true;answer_input=false;end_game=false;
  sys_complete=false;D_limit=0;U_limit=0;guess_count=0;}
  
if(menu===true&&answer_input===false&&end_game===true){
   if(any!==i18n.__('StartGame')){any=i18n.__('StartGame');}
   if(any===i18n.__('StartGame')){menu=true;answer_input=false;end_game=false;}
 }  

if(menu===false&&answer_input===false&&end_game===true){
	
 if(inputarray.indexOf(any)!==-1){
   menu=true;answer_input=false;end_game=false;
  sys_complete=false;D_limit=0;U_limit=0;guess_count=0;}
 }

 if(menu===true&&answer_input===false&&end_game===false){
   menu=false;answer_input=false;end_game=false;
  
  if (conv.user.last.seen) {
  if(conv.screen){
   conv.ask(new SimpleResponse({               
		 speech: `<speak><p><s>${i18n.__('Select1')}</s></p></speak>`,
		  text: i18n.__('Selectouttext'),}));}
	  else{
	   conv.ask(new SimpleResponse({               
		 speech: `<speak><p><s>${i18n.__('SelectTitle')}</s><s>${i18n.__('Select2')}</s></p></speak>`,
		  text: i18n.__('Selectouttext'),}));}
  } else {
  conv.ask(new SimpleResponse({               
         speech: `<speak><p><s>${i18n.__('Select1')}</s><s>${i18n.__('Select2')}</s><s>${i18n.__('Select3')}</s></p></speak>`,
  text: i18n.__('Selectouttext'),}));}
  
  conv.ask(new BasicCard({title:i18n.__('SelectTitle'),subtitle:i18n.__('SelectSubTitle'),text:i18n.__('SelectText')}));
  input_checker=false;
  conv.ask(new Suggestions('50','100','250','500','1000','🎲 '+i18n.__('Lucky')));
  }
  else if(menu===false&&answer_input===false&&end_game===false){

    if(any==="🎲 "+i18n.__('Lucky')||any===i18n.__('Lucky')){
		any=String(parseInt(Math.random()*(1000))); 
		conv.ask(new SimpleResponse({               
         speech: `<speak><p><s>${i18n.__('RandomText')}</s></p></speak>`,
         text: i18n.__('RandomOut'),}));
        }
    checker=any;
	
	if(any.indexOf('萬')!==-1){ 
    checker=replaceString(checker, '萬', ''); 
	if((checker.match(/^[0-9]+$/) != null)===true){any=replaceString(any, '萬', '0000');}
	} 
	if(any==="7 11"&&conv.user.locale==="zh-TW"){any="71"}
	
    any=any.replace(/\s+/g, '');//消除輸入字串中的空格
    any=replaceString(any, '奇異', '七億'); 
    any=replaceString(any, 'e', '億'); 
    any=replaceString(any, '義', '億'); 
    any=replaceString(any, '以前', '一千'); 
    any=replaceString(any, '佰', '百'); 
    any=replaceString(any, '元', '萬'); 
    any=replaceString(any, '仟', '千'); //將輸入數字改為小寫國字
    any=replaceString(any, '壹', '一'); //將輸入數字改為小寫國字
	any=replaceString(any, '貳', '二'); //將輸入數字改為小寫國字
	any=replaceString(any, '兩', '二'); //將輸入數字改為小寫國字
    any=replaceString(any, '參', '三'); //將輸入數字改為小寫國字
    any=replaceString(any, '肆', '四'); //將輸入數字改為小寫國字
    any=replaceString(any, '伍', '五'); //將輸入數字改為小寫國字
    any=replaceString(any, '若', '六'); //將輸入數字改為小寫國字
    any=replaceString(any, '陸', '六'); //將輸入數字改為小寫國字
    any=replaceString(any, '柒', '七'); //將輸入數字改為小寫國字
    any=replaceString(any, '捌', '八'); //將輸入數字改為小寫國字
    any=replaceString(any, '玖', '九'); //將輸入數字改為小寫國字
    any=replaceString(any, '拾', '十'); //將輸入數字改為小寫國字
    any=replaceString(any, '森林', '30'); //將輸入數字改為小寫國字
    any=replaceString(any, '三菱', '30'); //將輸入數字改為小寫國字
    any=replaceString(any, '爸', '8'); //將輸入數字改為小寫國字
    any=replaceString(any, '酒', '9'); //將輸入數字改為小寫國字
    any=replaceString(any, '乘', ''); 
    any=replaceString(any, '-', ''); 
	
  if(any==='林'||any==='零'){any=0;}
  else if(any==='什'||any==='食'){any=10;}
    
  number=parseInt(any);
 
 if(isNaN(number)===true){
	 number=nzhhk.decodeS(any);
	 if(number===0){number=parseInt('柴柴');}}
 if(isNaN(number)===false){answer_input=true;}
 
if(answer_input===true){answer_input=false;
  if(sys_complete===false){ 
      sys_complete=true;
      yourchoice=number;
      sys_number=parseInt(Math.random()*yourchoice);
	  if(sys_number===0){sys_number++;}
      U_limit=yourchoice;
      conv.ask(new SimpleResponse({speech:`<speak><audio src="https://firebasestorage.googleapis.com/v0/b/hank199599.appspot.com/o/undecided-numbers.mp3?alt=media"/><p><s>${i18n.__('Start1')}</s><s>${i18n.__('Start2')}</s><s>${i18n.__('Start3',D_limit,U_limit)}</s><s>${i18n.__('Start4')}</s></p></speak>`,text: i18n.__('StartText'),}));
      conv.ask(new BasicCard({ title:D_limit+' ~ '+U_limit,subtitle:i18n.__('Start_Title'),text:i18n.__('SelectText') }));
		   sys_guess=D_limit+parseInt(Math.random()*(U_limit-D_limit));
           if(sys_guess===D_limit){sys_guess++;}
           else if(sys_guess===D_limit){sys_guess--;}
		   sys_guess=String(sys_guess);
           conv.ask(new Suggestions(i18n.__('Quit'),sys_guess));
        }
     else{
        guess_count++;
        
		if(number!==sys_number){
         if(number>=D_limit&&number<sys_number&&number<=U_limit){ D_limit=number;  //下限<你猜的數字<系統生成的數字<上限
           question_output=true;input_checker=false;answer_input=false;
           conv.ask(new SimpleResponse({speech:`<speak><p><s>${i18n.__('Wrongout1')}</s><s>${i18n.__('Start3',D_limit,U_limit)}</s></p></speak>`,text:i18n.__('Wrongtext1')}));                                                    
         }
         else if(number>=D_limit&&number>sys_number&&number<=U_limit){ U_limit=number; //下限<系統生成的數字<你猜的數字<上限
          question_output=true;input_checker=false;answer_input=false;
          conv.ask(new SimpleResponse({speech:`<speak><p><s>${i18n.__('Wrongout1')}</s><s>${i18n.__('Start3',D_limit,U_limit)}</s></p></speak>`,text:i18n.__('Wrongtext1')}));                                                                                                            
       
	 }
         else if(number>D_limit&&number>sys_number&&number>U_limit){ //下限<系統生成的數字<上限<你輸入的數字
           question_output=true;input_checker=false;answer_input=false;
           conv.ask(new SimpleResponse({speech:`<speak><p><s>${i18n.__('Wrongout2')}</s><s>${i18n.__('Start3',D_limit,U_limit)}</s></p></speak>`,text:i18n.__('Wrongtext2')}));                                                  
		   }
         else if(number<D_limit&&number<sys_number&&number<=U_limit){ //你輸入的數字<下限<系統生成的數字<上限
           question_output=true;input_checker=false;answer_input=false;
           conv.ask(new SimpleResponse({speech:`<speak><p><s>${i18n.__('Wrongout2')}</s><s>${i18n.__('Start3',D_limit,U_limit)}</s></p></speak>`,text:i18n.__('Wrongtext2')}));                                                  
                 }
				 
           conv.ask(new BasicCard({ title:D_limit+' ~ '+U_limit,subtitle:i18n.__('Hint_Title'),text:i18n.__('SelectText') }));
           
		   sys_guess=D_limit+parseInt(Math.random()*(U_limit-D_limit));
           if(sys_guess===D_limit){sys_guess++;}
           else if(sys_guess===D_limit){sys_guess--;}
		   sys_guess=String(sys_guess);
		   conv.ask(new Suggestions(i18n.__('Quit'),sys_guess));                  
  
		}
         else { //你輸入的數字=系統生成的數字 猜中拉
          menu=false;answer_input=false;end_game=true;question_output=true;input_checker=false;
			 conv.ask(new SimpleResponse({speech:`<speak><audio src="https://firebasestorage.googleapis.com/v0/b/hank199599.appspot.com/o/end_game.mp3?alt=media"/><p><s>${i18n.__('Answer1')}</s><s>${i18n.__('Answer2')}${sys_number}!</s><s>${i18n.__('Answer3',guess_count,'<break time="0.15s"/>')}</s></p></speak>`,text:i18n.__('Answertext'),}));
			 conv.ask(new BasicCard({   
                   image: new Image({url:'https://imgur.com/zPa5Jph.jpg',alt:'Pictures',}),
                   title: i18n.__('Answer')+sys_number,
		           subtitle:i18n.__('Numbercritical')+'0 ~ '+yourchoice+'  \n'+i18n.__('GuessCount')+guess_count,
				   display: 'CROPPED',//更改圖片顯示模式為自動擴展
					}));
          conv.ask(new Suggestions('🎮 '+i18n.__('Restart'),'👋 '+i18n.__('Bye')));
         }
    }
	} else{  
         if(sys_complete===false){

	     conv.noInputs = [i18n.__('Welcome_Noinput_1'),i18n.__('Welcome_Noinput_2'),i18n.__('Welcome_Noinput_3')];	   
			 
		 conv.ask(new SimpleResponse({speech:`<speak><p><s>${i18n.__('Error1')}</s></p></speak>`,text:i18n.__('Error1')}));			 
		 conv.ask(new BasicCard({title:i18n.__('SelectTitle'),subtitle:i18n.__('SelectSubTitle'),text:i18n.__('SelectText')}));
	     conv.ask(new Suggestions('50','100','250','500','1000','🎲 '+i18n.__('Lucky')));}
		 else{
		 conv.ask(new SimpleResponse({speech:`<speak><p><s>${i18n.__('Error1')}</s><s>${i18n.__('Start3',D_limit,U_limit)}</s></p></speak>`,text:i18n.__('Error1')}));
         conv.ask(new BasicCard({ title:D_limit+' ~ '+U_limit,subtitle:i18n.__('Hint_Title'),text:i18n.__('ErrorExplain')})); 
              sys_guess=String(D_limit+parseInt(Math.random()*(U_limit-D_limit)));
		   sys_guess=D_limit+parseInt(Math.random()*(U_limit-D_limit));
           if(sys_guess===D_limit){sys_guess++;}
           else if(sys_guess===D_limit){sys_guess--;}
		   sys_guess=String(sys_guess);
		   conv.ask(new Suggestions(i18n.__('Quit'),sys_guess));

  }}}
  else if(menu===false&&answer_input===false&&end_game===true) {
	conv.ask(new SimpleResponse({
		speech:`<speak><p><s>${i18n.__('Error_hint1','<break time="0.15s"/>','<break time="0.15s"/>','<break time="0.15s"/>','<break time="0.15s"/>')}</s></p></speak>`,
		text:i18n.__('Error_hint')}));
	conv.ask(new Suggestions('🎮 '+i18n.__('Restart'),'👋 '+i18n.__('Bye')));}
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
//將數據同步回手機
conv.user.storage.sys_number=sys_number;
conv.user.storage.yourchoice=yourchoice;
conv.user.storage.your_guess=your_guess;
conv.user.storage.sys_complete=sys_complete;
conv.user.storage.U_limit=U_limit;
conv.user.storage.D_limit=D_limit;
conv.user.storage.guess_count=guess_count;
conv.user.storage.number=number;
conv.user.storage.menu=menu;
conv.user.storage.end_game=end_game;
conv.user.storage.question_output=question_output;
conv.user.storage.input_checker=input_checker;
conv.user.storage.answer_input=answer_input;
});

app.intent('顯示答案', (conv) => {
//將數據上載到函式
sys_number=conv.user.storage.sys_number;
yourchoice=conv.user.storage.yourchoice;
your_guess=conv.user.storage.your_guess;
sys_complete=conv.user.storage.sys_complete;
U_limit=conv.user.storage.U_limit;
D_limit=conv.user.storage.D_limit;
guess_count=conv.user.storage.guess_count;
number=conv.user.storage.number;
input_checker=conv.user.storage.input_checker;
menu=conv.user.storage.menu;
end_game=conv.user.storage.end_game;
question_output=conv.user.storage.question_output;
answer_input=conv.user.storage.answer_input;
  
menu=false;answer_input=false;end_game=true;
  
     conv.ask(new SimpleResponse({speech:`<speak><p><s>${i18n.__('Answer2')}<break time="0.15s"/>${sys_number}!</s><s>${i18n.__('show2',guess_count)}</s><s>${i18n.__('show3')}</s></p></speak>`,text: i18n.__('showtext'),}));	           
     conv.ask(new BasicCard({   
                   title: i18n.__('Answer')+sys_number,
		           subtitle:i18n.__('Numbercritical')+'0 ~ '+yourchoice+'  \n'+i18n.__('GuessCount')+guess_count,}));

     conv.ask(new Suggestions('🎮 '+i18n.__('Restart'),'👋 '+i18n.__('Bye')));
     guess_count=0;
  //將數據同步回手機
conv.user.storage.sys_number=sys_number;
conv.user.storage.yourchoice=yourchoice;
conv.user.storage.your_guess=your_guess;
conv.user.storage.sys_complete=sys_complete;
conv.user.storage.U_limit=U_limit;
conv.user.storage.D_limit=D_limit;
conv.user.storage.guess_count=guess_count;
conv.user.storage.number=number;
conv.user.storage.menu=menu;
conv.user.storage.end_game=end_game;
conv.user.storage.question_output=question_output;
conv.user.storage.input_checker=input_checker;
conv.user.storage.answer_input=answer_input;

});

app.intent('玩遊戲意圖', (conv) => {
  menu=false;answer_input=false;end_game=false;
  answer_checker=false;sys_complete=false;D_limit=0;U_limit=0;guess_count=0;

  conv.ask(new SimpleResponse({               
         speech: `<speak><p><s>${i18n.__('Select1')}</s><s>${i18n.__('Select2')}</s><s>${i18n.__('Select3')}</s></p></speak>`,
         text: i18n.__('Selectouttext'),}));
  conv.ask(new BasicCard({title:i18n.__('SelectTitle'),subtitle:i18n.__('SelectSubTitle'),text:i18n.__('SelectText')}));
  input_checker=false;
  conv.ask(new Suggestions('50','100','250','500','1000','🎲 '+i18n.__('Lucky')));
   
  //將數據同步回手機
conv.user.storage.sys_number=sys_number;
conv.user.storage.yourchoice=yourchoice;
conv.user.storage.your_guess=your_guess;
conv.user.storage.sys_complete=sys_complete;
conv.user.storage.U_limit=U_limit;
conv.user.storage.D_limit=D_limit;
conv.user.storage.guess_count=guess_count;
conv.user.storage.number=number;
conv.user.storage.menu=menu;
conv.user.storage.end_game=end_game;
conv.user.storage.question_output=question_output;
conv.user.storage.input_checker=input_checker;
conv.user.storage.answer_input=answer_input;

});


app.intent('結束對話', (conv) => {
    conv.user.storage = {}; //離開同時清除暫存資料
    conv.ask(new SimpleResponse({speech:i18n.__('EndTalk'),text:i18n.__('EndTalk')+'👋',}));
    conv.close(new BasicCard({   
        title: i18n.__('EndTitle'),
        text:  i18n.__('EndText'),   
        buttons: new Button({title: i18n.__('EndButton'),url: 'https://assistant.google.com/services/a/uid/0000008473a60dc8',}),

		})); 

});
  
  
// Set the DialogflowApp object to handle the HTTPS POST request.
exports.number_elf = functions.https.onRequest(app);