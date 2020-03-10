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

var MarsInsightWeather = require('mars-insight-weather-node');
var marsweather = new MarsInsightWeather('C', 'Pa', 'm/s');

var Temperature="NaN"; var Temperature_max="NaN"; var Temperature_min="NaN";
var Pressure="NaN"; var Pressure_max="NaN"; var Pressure_min="NaN";
var Wind_Speed="NaN";var Wind_Speed_max="NaN";var Wind_Speed_min="NaN";
var Wind_direction="NaN";var Wind_direction_1='';
var Season='NaN';
var sol=0;
var temp_date="";
var month=0;var date=0;
var lastestsol="";
var output="";  //客製化輸出
var subtext="";  //客製化副標題輸出

var Month_array=["January","February","March","April","May","June","July","August","September","October","November","December"];
var month_output="";
var roundDecimal = function (val, precision) { //進行四捨五入的函式呼叫
  return Math.round(Math.round(val * Math.pow(10, (precision || 0) + 1)) / 10) / Math.pow(10, (precision || 0));};

app.middleware((conv) => {
  i18n.setLocale(conv.user.locale);
});

const admin = require('firebase-admin');

let serviceAccount = require("./config/b1a2b-krmfch-firebase-adminsdk-1tgdm-65b74bdbc0.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://b1a2b-krmfch.firebaseio.com/"
});

const database = admin.database();
let db = admin.firestore(); 

 
function WeatherAPI()
{   
    database.ref('/Mars').on('value',e=>{sol=e.val().sol;});
    database.ref('/Mars').on('value',e=>{lastestsol=e.val().lastestsol;});
	  
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

    Wind_direction = lastestsol.WD.most_common.compass_point;
	Wind_direction = String(Wind_direction);
	Wind_direction_1=Wind_direction;
	if(Wind_direction==='N'){Wind_direction=i18n.__('N');}else if(Wind_direction==='NbE'){Wind_direction=i18n.__('NbE');}else if(Wind_direction==='NNE'){Wind_direction=i18n.__('NNE');}else if(Wind_direction==='NEbN'){Wind_direction=i18n.__('NEbN');}
	else if(Wind_direction==='NE'){Wind_direction=i18n.__('NE');}else if(Wind_direction==='NEbE'){Wind_direction=i18n.__('NEbE');}else if(Wind_direction==='ENE'){Wind_direction=i18n.__('ENE');}else if(Wind_direction==='EbN'){Wind_direction=i18n.__('EbN');}
	else if(Wind_direction==='E'){Wind_direction=i18n.__('E');}else if(Wind_direction==='EbS'){Wind_direction=i18n.__('EbS');} else if(Wind_direction==='ESE'){Wind_direction=i18n.__('ESE');} else if(Wind_direction==='SEbE'){Wind_direction=i18n.__('SEbE');}
	else if(Wind_direction==='SE'){Wind_direction=i18n.__('SE');}else if(Wind_direction==='SEbS'){Wind_direction=i18n.__('SEbS');}else if(Wind_direction==='SSE'){Wind_direction=i18n.__('SSE');}else if(Wind_direction==='SbE'){Wind_direction=i18n.__('SbE');}
	else if(Wind_direction==='S'){Wind_direction=i18n.__('S');}else if(Wind_direction==='SbW'){Wind_direction=i18n.__('SbW');}else if(Wind_direction==='SSW'){Wind_direction=i18n.__('SSW');}else if(Wind_direction==='SWbS'){Wind_direction=i18n.__('SWbS');}	
	else if(Wind_direction==='SW'){Wind_direction=i18n.__('SW');}else if(Wind_direction==='SWbW'){Wind_direction=i18n.__('SWbW');} else if(Wind_direction==='WSW'){Wind_direction=i18n.__('WSW');}else if(Wind_direction==='WbS'){Wind_direction=i18n.__('WbS');}	
	else if(Wind_direction==='W'){Wind_direction=i18n.__('W');}  else if(Wind_direction==='WbN'){Wind_direction=i18n.__('WbN');} else if(Wind_direction==='WNW'){Wind_direction=i18n.__('WNW');}else if(Wind_direction==='NWbW'){Wind_direction=i18n.__('NWbW');}
	else if(Wind_direction==='NW'){Wind_direction=i18n.__('NW');}else if(Wind_direction==='NWbN'){Wind_direction=i18n.__('NWbN');}else if(Wind_direction==='NNW'){Wind_direction=i18n.__('NNW');}else if(Wind_direction==='NbW'){Wind_direction=i18n.__('NbW');}
		}
	}
	if(typeof (lastestsol.Season)!=="undefined"){
	Season = lastestsol.Season;
    Season = String(Season);
	if(Season==='spring'){Season=i18n.__('Spring');}else if(Season==='summer'){Season=i18n.__('Summer');}else if(Season==='autumn'){Season=i18n.__('Autumn');}else if(Season==='winter'){Season=i18n.__('Winter');}
	}

   }
 }

app.intent('取得天氣速覽', (conv) => {

 Temperature="NaN";  Temperature_max="NaN";  Temperature_min="NaN";
 Pressure="NaN";  Pressure_max="NaN";  Pressure_min="NaN";
 Wind_Speed="NaN"; Wind_Speed_max="NaN"; Wind_Speed_min="NaN";
 Wind_direction="NaN"; Wind_direction_1='';
 Season='NaN'; sol=0; lastestsol="undefined";month=0;date=0;
 output="";  
 subtext=""; 

   new WeatherAPI();//呼叫API

 month_output=parseInt(month);
if((conv.user.locale!=='zh-TW')&&(conv.user.locale!=='zh-CN')&&(conv.user.locale!=='zh-HK')&&(conv.user.locale!=='ja-JP'))  
  {month_output=Month_array[month_output-1];}
  
  if(String(Temperature_max)==="NaN"&&String(Pressure)==="NaN"&&String(Wind_Speed)==="NaN"){
     output=i18n.__('Errorout');     
	 subtext=i18n.__('CardSubTitle',month_output,date,Season)+ i18n.__('Errortext');
}
  else if(typeof(lastestsol)==="undefined"){
    output=i18n.__('Errorout');     }
  else{  
  output=i18n.__('IntroSpeak1',sol,month_output,date);

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
 if(typeof(lastestsol)!=="undefined"){	  
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
    url: 'https://mars.nasa.gov/insight/weather/'
  }),
 }));}
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
 
 //呼叫洞察號天氣資訊API
	marsweather.request(function(err, response){
		sol = this.getLatestSolKey();
		lastestsol=this.getLatestSol();
     });
  if(typeof(lastestsol)!=="undefined"){
 	database.ref('/Mars').update({lastestsol:lastestsol});
	database.ref('/Mars').update({sol:sol});}
});

exports.dialogflowFirebaseFulfillment = functions.https.onRequest(app); 
