	'use strict';

	// Import the Dialogflow module from the Actions on Google client library.
	const {
	    dialogflow,
	    SimpleResponse,
	    BrowseCarousel,
	    Button,
	    BrowseCarouselItem,
	    items,
	    Image,
	    Table,
	    BasicCard
	} = require('actions-on-google');

	const functions = require('firebase-functions');


	let Parser = require('rss-parser');
	const i18n = require('i18n');

	const app = dialogflow({ debug: true });

	let parser = new Parser({
	    customFields: {
	        item: [
	            ['ht:approx_traffic', 'ht'],
	        ]
	    }
	});


	i18n.configure({
	    locales: ['zh-TW', 'zh-HK', 'ja-JP', 'ko-KR', 'en', 'fr', 'es', 'th', 'de', 'da-DK', 'nl'],
	    directory: __dirname + '/locales',
	    defaultLocale: 'zh-TW',
	});

	app.middleware((conv) => {
	    var language = conv.user.locale;
	    if (language.indexOf('en') !== -1) { language = "en"; } else if (language.indexOf('fr') !== -1) { language = "fr"; } else if (language.indexOf('es') !== -1) { language = "es"; } else if (language.indexOf('th') !== -1) { language = "th"; } else if (language.indexOf('de') !== -1) { language = "de"; } else if (language.indexOf('nl') !== -1) { language = "nl"; }

	    i18n.setLocale(language);
	});

	var return_data = [];
	var location = "";
	var Carouselarray = [];
	var rowsarray = [];
	var color = "";
	var i = 0;
	var verb = "";
	var keyword1 = "";
	var keyword2 = "";
	var keyword3 = "";

	app.intent('今日搜尋趨勢', (conv) => {

	    return_data = [];

	    if (conv.user.locale === "es-419") { location = "AR"; } else { location = conv.user.locale.split('-')[1]; }

	    return new Promise(

	        function(resolve, reject) {

	            parser.parseURL('https://trends.google.com/trends/trendingsearches/daily/rss?geo=' + location, function(err, feed) {

	                if (!err) {
	                    feed.items.forEach(function(item) {
	                        return_data.push([item.title, item.ht])
	                    });
	                    resolve(return_data);
	                } else { reject(err) }
	            })

	        }).then(function(final_data) {
	        const hasWebBrowser = conv.surface.capabilities.has('actions.capability.WEB_BROWSER');

	        Carouselarray = [];
	        rowsarray = [];

	        for (i = 0; i < 10; i++) {
	            var num1 = final_data[i][1].replace(/[\,|\+|]/g, "");
	            var num2 = final_data[i + 1][1].replace(/[\,|\+|]/g, "");
	            num1 = parseInt(num1);
	            num2 = parseInt(num2);

	            if (i === 0) { color = "ea4335"; } else if (i === 1) { color = "fbbc05"; } else if (i === 2) { color = "34a853"; } else { color = "4285f4"; }

	            Carouselarray.push(
	                new BrowseCarouselItem({
	                    title: final_data[i][0],
	                    url: 'https://trends.google.com/trends/explore?q=' + final_data[i][0] + '&date=now%201-d&geo=' + location,
	                    description: final_data[i][1] + i18n.__('count'),
	                    image: new Image({
	                        url: 'https://dummyimage.com/232x128/' + color + '/ffffff.png&text=' + (i + 1),
	                        alt: '排名符號',
	                    }),
	                })
	            );

	            rowsarray.push({ cells: [(i + 1).toString(), final_data[i][0], final_data[i][1]], dividerAfter: false, });

	            if (num1 < num2) { break; }
	        }

	        if (final_data[0][0].length !== 0) { keyword1 = final_data[0][0].replace(/[\&|]/g, "and"); }
	        if (final_data[1][0].length !== 0) { keyword2 = final_data[1][0].replace(/[\&|]/g, "and"); }
	        if (final_data[2][0].length !== 0) { keyword3 = final_data[2][0].replace(/[\&|]/g, "and"); }

	        if (Carouselarray.length === 1) { verb = `<speak><p><s>${i18n.__('output1')}<break time="0.5s"/>${keyword1}</s></p></speak>`; } else if (Carouselarray.length === 2) { verb = `<speak><p><s>${i18n.__('output2')}<break time="0.5s"/>${keyword1}<break time="0.3s"/>${keyword2}</s></p></speak>`; } else { verb = `<speak><p><s>${i18n.__('output')}<break time="0.5s"/>${keyword1}<break time="0.3s"/>${keyword2}<break time="0.3s"/>${keyword3}</s></p></speak>`; }

	        if (Carouselarray.length <= 1) {

	            Carouselarray.push(
	                new BrowseCarouselItem({
	                    title: i18n.__('notify'),
	                    url: 'https://trends.google.com.tw/trends/trendingsearches/daily?geo=' + location,
	                    description: i18n.__('click'),
	                    image: new Image({
	                        url: 'https://raw.githubusercontent.com/hank199599/Google-Assistant-APP/master/%E7%86%B1%E6%90%9C%E8%B6%A8%E5%8B%A2/assets/hMTn8OV.png',
	                        alt: '排名符號',
	                    }),
	                })
	            );
	        }

	        if (conv.screen) {
	            conv.ask(new SimpleResponse({ speech: verb, text: i18n.__('display'), }));

	            if (hasWebBrowser) {
	                conv.close(new BrowseCarousel({
	                    items: Carouselarray,
	                }));
	            } else {
	                conv.close(new Table({
	                    title: i18n.__('title'),
	                    columns: [{ header: i18n.__('rank'), align: 'CENTER', }, { header: i18n.__('key'), align: 'CENTER', }, { header: i18n.__('counts'), align: 'CENTER', }, ],
	                    rows: rowsarray,
	                }));
	            }
	        } else {
	            conv.close(verb);
	        }
	    }).catch(function(error) {
	        conv.ask(new SimpleResponse({
	            speech: `<speak><p><s>${i18n.__('ERROR_talk')}</s></p></speak>`,
	            text: i18n.__('ERROR_show'),
	        }));
	        console.log(error)
	        conv.close(new BasicCard({
	            image: new Image({ url: 'https://dummyimage.com/1037x539/ef2121/ffffff.png&text=' + i18n.__('ERROR'), alt: 'Pictures', }),
	            title: i18n.__('ERROR_text'),
	            display: 'CROPPED',
	        }));
	    });
	});

	// Set the DialogflowApp object to handle the HTTPS POST request.
	exports.google_search_trend = functions.https.onRequest(app);