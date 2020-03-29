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

// Instantiate the Dialogflow client.
const app = dialogflow({debug: true});

i18n.configure({
  locales: ['zh-TW','en','zh-CN','zh-HK','ja-JP'],
  directory: __dirname + '/locales',
  defaultLocale: 'en',
});

app.middleware((conv) => {
  i18n.setLocale(conv.user.locale);
});

var getJSON = require('get-json')

var Temperature="NaN"; var Temperature_max="NaN"; var Temperature_min="NaN";
var Pressure="NaN"; var Pressure_max="NaN"; var Pressure_min="NaN";
var Wind_Speed="NaN";var Wind_Speed_max="NaN";var Wind_Speed_min="NaN";
var Wind_direction="NaN";var Wind_direction_1='';
var language_array=['zh-TW','zh-CN','zh-HK','ja-JP'];
var Season='NaN';
var sol=0;
var temp_date="";
var month=0;var date=0;
var lastestsol="";
var output="";  //客製化輸出
var subtext="";  //客製化副標題輸出
var	time = "";
var	minute_now="";

var Month_array=["January","February","March","April","May","June","July","August","September","October","November","December"];

var month_output="";

var roundDecimal = function (val, precision) { //進行四捨五入的函式呼叫
  return Math.round(Math.round(val * Math.pow(10, (precision || 0) + 1)) / 10) / Math.pow(10, (precision || 0));};


app.intent('取得天氣速覽', (conv) => {

 Temperature="NaN";  Temperature_max="NaN";  Temperature_min="NaN"; Pressure="NaN";  Pressure_max="NaN";  Pressure_min="NaN";
 Wind_Speed="NaN"; Wind_Speed_max="NaN"; Wind_Speed_min="NaN"; Wind_direction="NaN"; Wind_direction_1='';
 Season='NaN'; sol=0; lastestsol="undefined";month=0;date=0; output="";   subtext=""; 

  return new Promise(function(resolve,reject){
	
  getJSON('https://mars.nasa.gov/rss/api/?feed=weather&category=insight&feedtype=json&ver=1.0')
    .then(function(response) {
	  resolve(response)
    }).catch(function(error) {
	 var reason=new Error('資料獲取失敗');
     reject(reason)
    });
}).then(function (origin_data) {

//處理獲取的資料....

	sol=origin_data.sol_keys.pop();
	lastestsol=origin_data[sol];
	  
  if(typeof(lastestsol)!=="undefined"){
	
	if(typeof(lastestsol.First_UTC)!=="undefined"){
    temp_date=lastestsol.First_UTC;
    temp_date=(temp_date.split('T')[0]).split('-');
    month=temp_date[1];
	date=temp_date[2];}

  	if(typeof (lastestsol.AT)!=="undefined"){
    Temperature = lastestsol.AT.av;
	Temperature_max = lastestsol.AT.mx;
	Temperature_min = lastestsol.AT.mn;
    Temperature = roundDecimal(Temperature,1);
	Temperature_max = roundDecimal(Temperature_max,1);
	Temperature_min = roundDecimal(Temperature_min,1);
	}
	
	if(typeof (lastestsol.PRE)!=="undefined"){
    Pressure = lastestsol.PRE.av;
	Pressure_max = lastestsol.PRE.mx;
	Pressure_min = lastestsol.PRE.mn;
	Pressure = roundDecimal(Pressure,1);
	Pressure_max = roundDecimal(Pressure_max,1);
	Pressure_min = roundDecimal(Pressure_min,1);
	}

	if(typeof (lastestsol.HWS)!=="undefined"){
    Wind_Speed = lastestsol.HWS.av;
	Wind_Speed_max = lastestsol.HWS.mx;
	Wind_Speed_min = lastestsol.HWS.mn;
    Wind_Speed = roundDecimal(Wind_Speed,1);
	Wind_Speed_max = roundDecimal(Wind_Speed_max,1);
	Wind_Speed_min = roundDecimal(Wind_Speed_min,1);
   
   if((lastestsol.WD.most_common == undefined)!==true){
   var dirction={"N":i18n.__('N'),"NbE":i18n.__('NbE'),"NNE":i18n.__('NNE'),"NEbN":i18n.__('NEbN'),"NE":i18n.__('NE'),"NEbE":i18n.__('NEbE'),"ENE":i18n.__('ENE'),"EbN":i18n.__('EbN'),"E":i18n.__('E'),"EbS":i18n.__('EbS'),"ESE":i18n.__('ESE'),"SEbE":i18n.__('SEbE'),"SE":i18n.__('SE'),"SEbS":i18n.__('SEbS'),"SSE":i18n.__('SSE'),"SbE":i18n.__('SbE'),"S":i18n.__('S'),"SbW":i18n.__('SbW'),"SSW":i18n.__('SSW'),"SWbS":i18n.__('SWbS'),"SW":i18n.__('SW'),"SWbW":i18n.__('SWbW'),"WSW":i18n.__('WSW'),"WbS":i18n.__('WbS'),"W":i18n.__('W'),"WbN":i18n.__('WbN'),"WNW":i18n.__('WNW'),"NWbW":i18n.__('NWbW'),"NW":i18n.__('NW'),"NWbN":i18n.__('NWbN'),"NNW":i18n.__('NNW'),"NbW":i18n.__('NbW')};

    Wind_direction = lastestsol.WD.most_common.compass_point;
	Wind_direction = String(Wind_direction);
	Wind_direction_1=Wind_direction;
	Wind_direction=dirction[Wind_direction];
	 }
 }
	if(typeof (lastestsol.Season)!=="undefined"){
	var seasons={"spring":i18n.__('Spring'),"summer":i18n.__('Summer'),"autumn":i18n.__('Autumn'),"winter":i18n.__('Winter')};
	Season = lastestsol.Season;
    Season = String(Season);
	Season=seasons[Season];
	}

   }

//開始制定輸出樣式	
 month_output=parseInt(month);
 
 if(language_array.indexOf(conv.user.locale)===-1){month_output=Month_array[month_output-1];}
  
  if(String(Temperature_max)==="NaN"&&String(Pressure)==="NaN"&&String(Wind_Speed)==="NaN"){
     output=i18n.__('Errorout');     
	 subtext=i18n.__('CardSubTitle',month_output,date,Season)+ i18n.__('Errortext');}
  else if(typeof(lastestsol)==="undefined"){output=i18n.__('Errorout');     }
  else{  output=i18n.__('IntroSpeak1',sol,month_output,date);

  if(String(Temperature_max)!=="NaN"){ output=output+'</s><break time="0.3s"/><s>'+i18n.__('IntroSpeak2',Temperature_max,Temperature_min);} else{ Temperature='--';  Temperature_max='--';  Temperature_min='--';}
  if(String(Pressure)!=="NaN"){ output=output+'</s><break time="0.3s"/><s>'+i18n.__('IntroSpeak3',Pressure);}else{ Pressure='--';  Pressure_max='--';  Pressure_min='--';}
  if((String(Wind_direction)!=="NaN")||String(Wind_Speed)!=="NaN"){output=output+'</s><break time="0.3s"/><s>'+i18n.__('IntroSpeak4');}
  if(String(Wind_direction)!=="NaN"){ output=output+i18n.__('IntroSpeak5',Wind_direction);}else{ Wind_direction='NaN';}
  if(String(Wind_Speed)!=="NaN"){ output=output+i18n.__('IntroSpeak6',Wind_Speed_max);}else{ Wind_Speed='--'; Wind_Speed_max='--'; Wind_Speed_min='--'; }

  if(String(Temperature_max)==='--'||String(Pressure)==='--'||String(Wind_Speed)==='--'){
	  subtext=i18n.__('CardSubTitle',month_output,date,Season)+ i18n.__('Errortext');
  }else{
	  subtext=i18n.__('CardSubTitle',month_output,date,Season); }
  }
  
  conv.ask(new SimpleResponse({               
  speech: `<speak><p><s>${output}</s></p></speak>`,
              text: i18n.__('IntroText')}));

if((conv.user.locale!=='zh-TW')&&(conv.user.locale!=='zh-CN')&&(conv.user.locale!=='zh-HK')&&(conv.user.locale!=='ja-JP')){Wind_direction=Wind_direction_1;}
 if(sol!==0){	  
  conv.close(new Table({
  title: i18n.__('CardTitle',sol)+'\n'+subtext,
  columns: [
    {
      header: i18n.__('TYPE'),
      align: 'CENTER',
    },
    {
      header: i18n.__('HIGH'),
      align: 'CENTER',
    },
    {
      header: i18n.__('AVG'),
      align: 'CENTER',
    },
    {
      header: i18n.__('LOW'),
      align: 'CENTER',
    }
  ],
  rows: [
    {
      cells: [i18n.__('TEM'), Temperature_max+'°C', Temperature+'°C', Temperature_min+'°C'],
      dividerAfter: false,
    },
	{
      cells: [i18n.__('PRE'), Pressure_max+' Pa', Pressure+' Pa', Pressure_min+' Pa'],
      dividerAfter: false,
    },
    {
      cells: [i18n.__('SPEED'), Wind_Speed_max+'m/s',Wind_Speed+'m/s',Wind_Speed_min+'m/s'],
      dividerAfter: false,
    },
	{
      cells: [i18n.__('DIREC'), Wind_direction+i18n.__('Wind'),' ',' '],
      dividerAfter: false,
    },
  ],
  buttons: new Button({
    title: i18n.__('CheckDaily'),
    url: 'https://mars.nasa.gov/insight/weather/'}),}));
}
 else{
	 conv.close(new BasicCard({   
        title:i18n.__('Errortitle') ,
        subtitle:i18n.__('notify'), 
		text:i18n.__('Solution'),
		buttons: new Button({
			title: i18n.__('CheckDaily'),
			url: 'https://mars.nasa.gov/insight/weather/'}),
        }));

 }
}).catch(function (error) {

  console.log(error)
  conv.ask(new SimpleResponse({               
  speech: `<speak><p><s>${i18n.__('Errorout')}</s></p></speak>`,
              text: i18n.__('IntroText')}));

	 conv.close(new BasicCard({   
        title:i18n.__('Errortitle') ,
        subtitle:i18n.__('notify'), 
		text:i18n.__('Solution'),
		buttons: new Button({
			title: i18n.__('CheckDaily'),
			url: 'https://mars.nasa.gov/insight/weather/'}),
        }));
 
 });
 	
});

exports.dialogflowFirebaseFulfillment = functions.https.onRequest(app); 
