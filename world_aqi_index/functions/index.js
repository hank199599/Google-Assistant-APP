	'use strict';

	// Import the Dialogflow module from the Actions on Google client library.
	const {
	  dialogflow,
	  Permission,
	  Suggestions,
	  SimpleResponse,
	  Button,
	  Image,
	  BasicCard,Carousel,
	  LinkOutSuggestion,
	  BrowseCarousel,BrowseCarouselItem,items,Table
	} = require('actions-on-google');

const functions = require('firebase-functions');
var getJSON = require('get-json')
const replaceString = require('replace-string');
const i18n = require('i18n');

const app = dialogflow({debug: true});

var PM25="";var PM10="";var O3="";
var Status=0;var AQI=0;var Pollutant="";var info="";var info_output="";
var picture="";var data="";var Source="測試";
var output_title="";var SiteName="";

app.intent('取得地點權限', (conv) => {

	 conv.data.requestedPermission = 'DEVICE_PRECISE_LOCATION';

	return conv.ask(new Permission({
	context: i18n.__('Permission_request'),
	permissions: conv.data.requestedPermission,}));

	conv.ask(new Permission(options));
	  
});

i18n.configure({
  locales: ['zh-TW','zh-HK'],
  directory: __dirname + '/locales',
  defaultLocale: 'zh-TW',
});
app.middleware((conv) => {
  i18n.setLocale(conv.user.locale);
});

function status_generator(number){
	if(number>=0&&number<=50){return i18n.__('Good');}
	else if(number>=51&&number<=100){return i18n.__('Moderate');}
	else if(number>=100&&number<=150){return i18n.__('Unhealthy for high-risk group');}
	else if(number>=151&&number<=199){return i18n.__('Unhealthy');}
	else if(number>=200&&number<=300){return i18n.__('Very Unhealthy');}
		else if(number>301){return i18n.__('Hazardous');}
		else{return i18n.__('Lack_Data');}
}

app.intent('回傳資訊',(conv, params, permissionGranted) => {

if (permissionGranted) {
	const {requestedPermission} = conv.data;

	if (requestedPermission === 'DEVICE_PRECISE_LOCATION') {
 	const coordinates = conv.device.location.coordinates;
   
   return new Promise(function(resolve,reject){
	
	getJSON('https://api.waqi.info/feed/geo:'+coordinates.latitude+';'+coordinates.longitude+'/?token=8e08aad6b10f88b43889a0ae4c3612d0e5cc8308')
    .then(function(response) {
      data=response.data;
	  resolve(data)
    }).catch(function(error) {
	 var reason=new Error('資料獲取失敗');
     reject(reason)
    });
}).then(function (origin_data) {

	AQI=origin_data.aqi;
	if(origin_data.iaqi.pm25!==undefined){PM25=origin_data.iaqi.pm25.v;}else{PM25='─';}
	if(origin_data.iaqi.pm10!==undefined){PM10=origin_data.iaqi.pm10.v;}else{PM10='─';}
	if(origin_data.iaqi.o3!==undefined){O3=origin_data.iaqi.o3.v;}else{O3='─';}
	if(origin_data.dominentpol!==undefined){Pollutant=origin_data.dominentpol;}else{Pollutant='─';}
	SiteName=origin_data.city.name;
	Source=origin_data.attributions[0].name;
	Source=Source.split('(')[0];

	Status=status_generator(AQI);
	
	if(AQI>=0&&AQI<=50){picture= "https://dummyimage.com/1037x539/1e9165/ffffff.png&text="+AQI;}
	else if(AQI>=51&&AQI<=100){picture= "https://dummyimage.com/1037x539/fc920b/ffffff.png&text="+AQI;}
	else if(AQI>=101&&AQI<=150){picture= "https://dummyimage.com/1037x539/ef4621/ffffff.png&text="+AQI;}
	else if(AQI>=151&&AQI<=199){picture= "https://dummyimage.com/1037x539/b71411/ffffff.png&text="+AQI;}
	else if(AQI>=200&&AQI<=300){picture= "https://dummyimage.com/1037x539/5b0e31/ffffff.png&text="+AQI;}
	else if(AQI>301){picture= "https://dummyimage.com/1037x539/4f1770/ffffff.png&text="+AQI;}

	if(AQI>=0&&AQI<=50){info= i18n.__('Good_info');}
	else if(AQI>=51&&AQI<=100){info= i18n.__('Moderate_info');}
	else if(AQI>=101&&AQI<=150){info= i18n.__('Unhealthy for high-risk group_info');}
	else if(AQI>=151&&AQI<=199){info= i18n.__('Unhealthy_info');}
	else if(AQI>=200&&AQI<=300){info=i18n.__('Very Unhealthy_info');}
	else if(AQI>301){info= i18n.__('Hazardous_info');}

	if(AQI>=0&&AQI<=50){info_output=i18n.__('Good_output');}
	else if(AQI>=51&&AQI<=100){info_output=i18n.__('Moderate_output');}
	else if(AQI>=101&&AQI<=150){info_output=i18n.__('Unhealthy for high-risk group_output');}
	else if(AQI>=151&&AQI<=199){info_output=i18n.__('Unhealthy_output')}
	else if(AQI>=200&&AQI<=300){info_output=i18n.__('Very Unhealthy_output');}
	else if(AQI>301){info_output=i18n.__('Hazardous_output');}

	if(AQI>=0&&AQI<=50){
	conv.ask(new SimpleResponse({               
	  speech: `<speak><p><s>根據最新資料顯示，附近測站的AQI指數為${AQI}</s><s>您可放心出外活動!</s></p></speak>`,
	  text: i18n.__('info_test')}));     }
	else if(AQI>50){
		if(	Pollutant==="o3"){Pollutant=i18n.__('O3');}
		else if(Pollutant==="pm25"){Pollutant=i18n.__('PM2.5');}
		else if(Pollutant==="pm10"){Pollutant=i18n.__('PM10');}
	   conv.ask(new SimpleResponse({               
	  speech: `<speak><p><s>根據最新資料顯示，附近測站的AQI指數為${AQI}</s><s>${info}</s></p></speak>`,
	  text: i18n.__('info_test')}));}

	output_title="";

	if(AQI>50){
		if(	Pollutant===i18n.__('O3')){Pollutant=Pollutant+"(O₃)";}
		else if(Pollutant===i18n.__('PM2.5')){Pollutant=Pollutant+"(PM₂.₅)";}
		else if(Pollutant===i18n.__('PM10')){Pollutant=Pollutant+"(PM₁₀)";}
		output_title=' • '+Pollutant;}
		
	conv.close(new BasicCard({  
		image: new Image({url:picture,alt:'Pictures',}),
		title:SiteName,display: 'CROPPED',
		subtitle:Status+output_title,
		text:info_output+'  \n  \nPM₁₀ '+PM10+'(AQI) • PM₂.₅ '+PM25+'(AQI) • 臭氧 '+O3+'(AQI)  \n**來自**'+Source,})); 

	}).catch(function (error) {
	console.log(error);
	conv.ask(new SimpleResponse({speech: `<speak><p><s>${i18n.__('Error_1')}</s><s>${i18n.__('Error_2')}</s></p></speak>`,text:i18n.__('Error_out')}));
	conv.close(new BasicCard({  
	image: new Image({url:"https://dummyimage.com/1037x539/ef2121/ffffff.png&text=錯誤",alt:'Pictures',}),
	title:i18n.__('Error_title'),
	subtitle:i18n.__('Error_subtitle'), display: 'CROPPED',})); 
   
    })
	}else{
	conv.close(new SimpleResponse({speech:`<speak><p><s>${i18n.__('Error_location')}</s><s>${i18n.__('Error_2')}</s></p></speak>`,text:i18n.__('Error_GPS')}));                 
	
	}
}else{
	conv.close(new SimpleResponse({speech:`<speak><p><s>${i18n.__('Error_no_permission')}</s><s>${i18n.__('return_hint')}</s></p></speak>`,text:i18n.__('Error_permission')}));                 

}

});



// Set the DialogflowApp object to handle the HTTPS POST request.
exports.world_aqi_index = functions.https.onRequest(app);