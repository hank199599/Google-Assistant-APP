	'use strict';

	// Import the Dialogflow module from the Actions on Google client library.
	const {
	  dialogflow,
	  SimpleResponse,BrowseCarousel,Button,
	  BrowseCarouselItem,items,Image,Table,BasicCard
	} = require('actions-on-google');

const functions = require('firebase-functions');


let Parser = require('rss-parser');
const i18n = require('i18n');

const app = dialogflow({debug: true});

let parser = new Parser({
  customFields: {
    item:[['ht:approx_traffic', 'ht'],]
  }
});


i18n.configure({
  locales: ['zh-TW','zh-HK','ja-JP','ko-KR','en','fr','es'],
  directory: __dirname + '/locales',
  defaultLocale: 'zh-TW',
});

app.middleware((conv) => {
  var language=conv.user.locale;
  if(language.indexOf('en')!==-1){language="en";}
  else if(language.indexOf('fr')!==-1){language="fr";}
  else if(language.indexOf('es')!==-1){language="es";}
	
  i18n.setLocale(language);
});

var return_data=[];
var location="";

app.intent('今日搜尋趨勢', (conv) => {

 return_data=[];
 location=conv.user.locale.split('-')[1];

   return new Promise(
  
   function(resolve,reject){

	parser.parseURL('https://trends.google.com/trends/trendingsearches/daily/rss?geo='+location, function(err, feed) {
	 
	if(!err){
		feed.items.forEach(function(item) {
		   return_data.push([item.title,item.ht])
	     });
	 resolve(return_data);
	}
	else{reject(err)}
})

  }).then(function (final_data) {
  const hasWebBrowser = conv.surface.capabilities.has('actions.capability.WEB_BROWSER');

	if(conv.screen){
   conv.ask(new SimpleResponse({ 
			 speech: `<speak><p><s>${i18n.__('output')}：${final_data[0][0]}<break time="0.3s"/>${final_data[1][0]}<break time="0.3s"/>${final_data[2][0]}</s></p></speak>`,
			  text: i18n.__('display'),}));
   if (hasWebBrowser) {
  conv.close(new BrowseCarousel({
    items: [
      new BrowseCarouselItem({
        title: final_data[0][0],
        url: 'https://trends.google.com/trends/explore?q='+final_data[0][0]+'&date=now%201-d&geo='+location,
        description: final_data[0][1]+i18n.__('count'),
		image: new Image({
          url: 'https://dummyimage.com/232x128/ea4335/ffffff.png&text=1',
          alt: '排名符號',
        }),
      }),
      new BrowseCarouselItem({
        title: final_data[1][0],
        url: 'https://trends.google.com/trends/explore?q='+final_data[1][0]+'&date=now%201-d&geo='+location,
        description: final_data[1][1]+i18n.__('count'),
		image: new Image({
          url: 'https://dummyimage.com/232x128/fbbc05/ffffff.png&text=2',
          alt: '排名符號',}),
      }),
      new BrowseCarouselItem({
        title: final_data[2][0],
        url: 'https://trends.google.com/trends/explore?q='+final_data[2][0]+'&date=now%201-d&geo='+location,
        description: final_data[2][1]+i18n.__('count'),
		image: new Image({
          url: 'https://dummyimage.com/232x128/34a853/ffffff.png&text=3',
          alt: '排名符號',}),
      }),      
      new BrowseCarouselItem({
        title: final_data[3][0],
        url: 'https://trends.google.com/trends/explore?q='+final_data[3][0]+'&date=now%201-d&geo='+location,
        description: final_data[3][1]+i18n.__('count'),
		image: new Image({
          url: 'https://dummyimage.com/232x128/4285f4/ffffff.png&text=4',
          alt: '排名符號',
        }),
      }),      
      new BrowseCarouselItem({
        title: final_data[4][0],
        url: 'https://trends.google.com/trends/explore?q='+final_data[4][0]+'&date=now%201-d&geo='+location,
        description: final_data[4][1]+i18n.__('count'),
		image: new Image({
          url: 'https://dummyimage.com/232x128/4285f4/ffffff.png&text=5',
          alt: '排名符號',}),
      }), 
      new BrowseCarouselItem({
        title: final_data[5][0],
        url: 'https://trends.google.com/trends/explore?q='+final_data[5][0]+'&date=now%201-d&geo='+location,
        description: final_data[5][1]+i18n.__('count'),
		image: new Image({
          url: 'https://dummyimage.com/232x128/4285f4/ffffff.png&text=6',
          alt: '排名符號',}),
      }), 
      new BrowseCarouselItem({
        title: final_data[6][0],
        url: 'https://trends.google.com/trends/explore?q='+final_data[6][0]+'&date=now%201-d&geo='+location,
        description: final_data[7][1]+i18n.__('count'),
		image: new Image({
          url: 'https://dummyimage.com/232x128/4285f4/ffffff.png&text=7',
          alt: '排名符號',}),
      }), 
      new BrowseCarouselItem({
        title: final_data[7][0],
        url: 'https://trends.google.com/trends/explore?q='+final_data[7][0]+'&date=now%201-d&geo='+location,
        description: final_data[8][1]+i18n.__('count'),
		image: new Image({
          url: 'https://dummyimage.com/232x128/4285f4/ffffff.png&text=8',
          alt: '排名符號',}),
      }), 
      new BrowseCarouselItem({
        title:final_data[8][0],
        url: 'https://trends.google.com/trends/explore?q='+final_data[8][0]+'&date=now%201-d&geo='+location,
        description: final_data[8][1]+i18n.__('count'),
		image: new Image({
          url: 'https://dummyimage.com/232x128/4285f4/ffffff.png&text=9',
          alt: '排名符號',}),
      }), 
      new BrowseCarouselItem({
        title: final_data[9][0],
        url: 'https://trends.google.com/trends/explore?q='+final_data[9][0]+'&date=now%201-d&geo='+location,
        description: final_data[9][1]+i18n.__('count'),
		image: new Image({
          url: 'https://dummyimage.com/232x128/4285f4/ffffff.png&text=10',
          alt: '排名符號',}),
      }), 
	  ],
    }));
   }
   else{
	   
	conv.close(new Table({
		title: i18n.__('title'),
		columns: [{header: i18n.__('rank'),align: 'CENTER',},{header: i18n.__('key'),align: 'CENTER',},{header: i18n.__('counts'),align: 'CENTER',},],
		rows: [{cells: ["1",final_data[0][0],final_data[0][1]],dividerAfter: false,},
				{cells: ["2",final_data[1][0],final_data[1][1]],dividerAfter: false,},
				{cells: ["3",final_data[2][0],final_data[2][1]],dividerAfter: false,},
				{cells: ["4",final_data[3][0],final_data[3][1]],dividerAfter: false,},
				{cells: ["5",final_data[4][0],final_data[4][1]],dividerAfter: false,},
				{cells: ["6",final_data[5][0],final_data[5][1]],dividerAfter: false,},
				{cells: ["7",final_data[6][0],final_data[6][1]],dividerAfter: false,},
				{cells: ["8",final_data[7][0],final_data[7][1]],dividerAfter: false,},
				{cells: ["9",final_data[8][0],final_data[8][1]],dividerAfter: false,},
				{cells: ["10",final_data[9][0],final_data[9][1]],dividerAfter: false,}],
		buttons: new Button({
			title: 'Google'+i18n.__('seach'),
			url: 'https://trends.google.com.tw/trends/trendingsearches/daily?geo='+location, }),		
	  }));
     }
   }
	else{
   conv.close(new SimpleResponse({ 
			 speech: `<speak><p><s>${i18n.__('output')}：${final_data[0][0]}<break time="0.3s"/>${final_data[1][0]}<break time="0.3s"/>${final_data[2][0]}</s></p></speak>`,
			  text: i18n.__('display1'),}));
	}
	}).catch(function (error) {
    conv.ask(new SimpleResponse({ 
			 speech: `<speak><p><s>${i18n.__('ERROR_talk')}</s></p></speak>`,
			   text: i18n.__('ERROR_show'),}));
	console.log(error)
	conv.close(new BasicCard({  
		image: new Image({url:'https://dummyimage.com/1037x539/ef2121/ffffff.png&text='+i18n.__('ERROR'),alt:'Pictures',}),
		title:i18n.__('ERROR_text'),display: 'CROPPED',}));	
});
});

// Set the DialogflowApp object to handle the HTTPS POST request.
exports.google_search_trend = functions.https.onRequest(app);
