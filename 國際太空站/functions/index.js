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
	    Carousel,
	    LinkOutSuggestion,
	    BrowseCarousel,
	    BrowseCarouselItem,
	    items,
	    Table,
	    NewSurface
	} = require('actions-on-google');

	const functions = require('firebase-functions');
	var getJSON = require('get-json')
	const replaceString = require('replace-string');
	const i18n = require('i18n');
	const https = require("https");
	const cheerio = require('cheerio');
	const findNearestLocation = require('map-nearest-location');
	const Compass = require("cardinal-direction");

	var admin = require("firebase-admin");

	const app = dialogflow({ debug: true });
	var i = 0
	var data_array = [];
	var return_array = [];
	var locations = [{ lat: 12.2778755, lng: 53.5413826, Oceon: "阿拉伯灣" }, { lat: 6.414642, lng: 78.161297, Oceon: "拉克代夫海" }, { lat: 14.099112, lng: 87.840295, Oceon: "孟加拉灣" }, { lat: 34.948463, lng: 18.260596, Oceon: "地中海" }, { lat: 39.936327, lng: 134.219508, Oceon: "東海" }, { lat: 35.572844, lng: 123.719046, Oceon: "黃海" }, { lat: 15.306866, lng: 114.833477, Oceon: "南海" }, { lat: 19.452993, lng: 132.689435, Oceon: "菲律賓海" }, { lat: -4.92342, lng: 112.032679, Oceon: "爪哇海" }, { lat: -4.5927774, lng: 108.3990358, Oceon: "班達海" }, { lat: -11.141347, lng: 127.905297, Oceon: "帝汶海" }, { lat: -8.761378, lng: 136.6221823, Oceon: "阿拉弗拉海" }, { lat: -3.681928, lng: 147.786808, Oceon: "俾斯麥海" }, { lat: -9.034181, lng: 154.991596, Oceon: "所羅門海" }, { lat: -8.3082943, lng: 132.0093045, Oceon: "阿拉弗拉海" }, { lat: -19.036767, lng: 155.25542, Oceon: "珊瑚海" }, { lat: -41.377133, lng: 160.795199, Oceon: "塔斯曼海" }, { lat: -34.7776738, lng: 119.679395, Oceon: "大澳洲灣" }, { lat: 12.45792, lng: 47.992648, Oceon: "亞丁灣" }, { lat: 20.376445, lng: 38.458755, Oceon: "紅海" }, { lat: 41.929468, lng: 50.784512, Oceon: "裏海" }, { lat: 43.48313, lng: 34.044626, Oceon: "黑海" }, { lat: 46.027501, lng: 36.372473, Oceon: "亞速海" }, { lat: 45.21392, lng: -4.242061, Oceon: "坎塔布連海" }, { lat: 57.466575, lng: -49.051949, Oceon: "拉不拉多海" }, { lat: 58.595714, lng: 19.812637, Oceon: "波羅的海" }, { lat: 75.103739, lng: -65.394996, Oceon: "巴芬灣" }, { lat: 84.509238, lng: -131.569496, Oceon: "北冰洋" }, { lat: 59.752116, lng: -85.771135, Oceon: "哈德森灣" }, { lat: 20.4553029, lng: -156.2263174, Oceon: "毛伊島海峽" }, { lat: 38.68045, lng: -144.520773, Oceon: "太平洋" }, { lat: 53.3275264, lng: -133.2995941, Oceon: "赫卡特海峽" }, { lat: 57.7527642, lng: -150.8381751, Oceon: "阿拉斯加灣" }, { lat: 56.822443, lng: -178.905945, Oceon: "白令海" }, { lat: 24.010096, lng: 119.377473, Oceon: "台灣海峽" }];

	i18n.configure({
	    locales: ['zh-TW', 'zh-HK'],
	    directory: __dirname + '/locales',
	    defaultLocale: 'zh-TW',
	});

	app.middleware((conv) => {
	    i18n.setLocale(conv.user.locale);
	});

	function getDay(num) {
	    var today = new Date();
	    var nowTime = today.getTime() + 8 * 3600 * 1000;
	    var ms = 24 * 3600 * 1000 * num;
	    today.setTime(parseInt(nowTime + ms));
	    var oMoth = (today.getMonth() + 1).toString();
	    var oDay = today.getDate().toString();
	    return oMoth + '月' + oDay + '日';
	}

	function timeSpliter(input) {
	    var temp = input.substr(8, 6);
	    temp = temp.split("");
	    return temp[0] + temp[1] + ":" + temp[2] + temp[3] + ":" + temp[4] + temp[5]
	}

	function directionGen(input) {

	    var angle = parseInt((parseInt(input) + 360) / 360);
	    var direction = Compass.CardinalDirection[angle];
	    return i18n.__(direction)

	}

	function OceanBorder(Longitude, Latitude) {

	    const myLocation = { lat: parseFloat(Latitude), lng: parseFloat(Longitude) };

	    var temp = (findNearestLocation(myLocation, locations)).location.Ocean;
	    console.log(temp)
	    if ((Longitude <= -70 || Longitude >= 100) && (Latitude >= -80 || Latitude <= 66)) { return "太平洋" } else if (Longitude <= 42.5 && Longitude >= -7 && Latitude >= 29 && Latitude <= 48) { return "地中海" } else if (temp.length > 0) { return temp } else { return "" }

	}

	var dirction = { "N": i18n.__('N'), "NbE": i18n.__('NbE'), "NNE": i18n.__('NNE'), "NEbN": i18n.__('NEbN'), "NE": i18n.__('NE'), "NEbE": i18n.__('NEbE'), "ENE": i18n.__('ENE'), "EbN": i18n.__('EbN'), "E": i18n.__('E'), "EbS": i18n.__('EbS'), "ESE": i18n.__('ESE'), "SEbE": i18n.__('SEbE'), "SE": i18n.__('SE'), "SEbS": i18n.__('SEbS'), "SSE": i18n.__('SSE'), "SbE": i18n.__('SbE'), "S": i18n.__('S'), "SbW": i18n.__('SbW'), "SSW": i18n.__('SSW'), "SWbS": i18n.__('SWbS'), "SW": i18n.__('SW'), "SWbW": i18n.__('SWbW'), "WSW": i18n.__('WSW'), "WbS": i18n.__('WbS'), "W": i18n.__('W'), "WbN": i18n.__('WbN'), "WNW": i18n.__('WNW'), "NWbW": i18n.__('NWbW'), "NW": i18n.__('NW'), "NWbN": i18n.__('NWbN'), "NNW": i18n.__('NNW'), "NbW": i18n.__('NbW') };
	var month = { "Jan": "1月", "Feb": "2月", "Mar": "3月", "Apr": "4月", "May": "5月", "Jun": "6月", "Jul": "7月", "Aug": "8月", "Sep": "9月", "Oct": "10月", "Nov": "11月", "Dec": "12月" }
	var date = "";


	app.intent('預設歡迎語句', (conv) => {

	    var example_array = [i18n.__('now_where'), i18n.__('pass_time'), i18n.__('people_on')];

	    conv.ask(new SimpleResponse({
	        speech: `<speak><p><s>歡迎使用!</s><s>你可以問我有關國際太空站的事情，例如：${example_array[parseInt(Math.random()*2)]}。</s></p></speak>`,
	        text: '歡迎使用!'
	    }));

	    conv.ask(new BasicCard({
	        image: new Image({ url: 'https://github.com/hank199599/Google-Assistant-APP/blob/master/%E5%9C%8B%E9%9A%9B%E5%A4%AA%E7%A9%BA%E7%AB%99/assets/tc6HMlI.jpg?raw=truetc6HMlI.jpg', alt: 'Pictures', }),
	        title: "國際太空站",
	        display: 'CROPPED',
	        subtitle: "International Space Station，ISS",
	        text: i18n.__('introduction'),
	        buttons: new Button({ title: 'NASA官方頁面', url: 'https://www.nasa.gov/mission_pages/station/main/index.html', display: 'CROPPED', }),
	    }));

	    conv.ask(new Suggestions(i18n.__('now_where'), i18n.__('pass_time'), i18n.__('people_on'), '👋 ' + i18n.__('Bye')));
	    conv.ask(new LinkOutSuggestion({
	        name: 'Google地球上的內部街景',
	        url: 'https://earth.google.com/web/data=CiQSIhIgN2Y3ZTA1ZTg2Y2E1MTFlNzk5YzI1YjJmNTFhNjA3NTI',
	    }));
	    conv.user.storage.direct = false;

	});

	app.intent('現在位置', (conv) => {

	    return new Promise(

	        function(resolve, reject) {
	            getJSON('http://api.open-notify.org/iss-now.json')
	                .then(function(response) {
	                    resolve(response.iss_position)
	                }).catch(function(error) {
	                    var reason = new Error('資料獲取失敗');
	                    reject(reason)
	                });
	        }).then(function(input) {
	        var temp = [];
	        return new Promise(function(resolve, reject) {
	            getJSON('https://maps.googleapis.com/maps/api/geocode/json?address=%20' + input.latitude + ',' + input.longitude + '&language=' + conv.user.locale + '&key=AIzaSyA9apdyLLAu7NTU6Hr8yc5HsZJPVQcgdqE')
	                .then(function(response) {
	                    if (response.status === "OK") {
	                        temp = response.results;
	                    } else { temp = []; }
	                    resolve([input, temp])
	                }).catch(function(error) {
	                    var reason = new Error('資料獲取失敗');
	                    reject(reason)
	                });
	        });

	    }).then(function(final_data) {

	        var iss_locate = final_data[0];
	        var process = final_data[i].mag;

	        if (process.length !== 0) { var locate = process[process.length - 1].formatted_address; }
	        //else{var locate=OceanBorder(iss_locate.longitude,iss_locate.latitude)}
	        else { var locate = ""; }

	        if (locate.length !== 0) {
	            //var locate=process[process.length-1].formatted_address;
	            var approximate = "緯度" + iss_locate.latitude + " • 經度" + iss_locate.longitude + '\n' + i18n.__('locate') + locate;
	            var speak = `<speak><p><s>${i18n.__('output1',locate)}</s></p></speak>`;
	        } else {
	            var approximate = "緯度" + iss_locate.latitude + " • 經度" + iss_locate.longitude;
	            var speak = `<speak><p><s>${i18n.__('output',iss_locate.latitude,iss_locate.longitude)}</s></p></speak>`;
	        }
	        conv.ask(new SimpleResponse({
	            speech: speak,
	            text: i18n.__('output_text'),
	        }));

	        conv.ask(new BasicCard({
	            image: new Image({ url: 'https://www.heavens-above.com/orbitdisplay.aspx?icon=iss&width=1037&height=539&mode=' + iss_locate.latitude + ',' + iss_locate.longitude + '&satid=25544', alt: 'Pictures', }),
	            title: i18n.__('title'),
	            display: 'CROPPED',
	            subtitle: approximate,
	            text: i18n.__('text'),
	            buttons: new Button({ title: i18n.__('map_button'), url: 'https://www.google.com/maps/search/?api=1&query=' + iss_locate.latitude + ',' + iss_locate.longitude, })
	        }));
	        conv.ask(new Suggestions('再次查詢', i18n.__('pass_time'), i18n.__('people_on'), '👋 ' + i18n.__('Bye')));

	        if (conv.user.storage.direct !== false) { conv.expectUserResponse = false } //告知Google助理結束對話

	    }).catch(function(error) {
	        conv.ask(new SimpleResponse({
	            speech: `<speak><p><s>獲取資料發生錯誤，請稍後再試。</s></p></speak>`,
	            text: '獲取資訊發生未知錯誤',
	        }));
	        console.log(error)

	        conv.ask(new BasicCard({
	            image: new Image({ url: 'https://dummyimage.com/1089x726/ef2121/ffffff.png&text=錯誤', alt: 'Pictures', }),
	            title: "發生錯誤，請稍後再試",
	            display: 'CROPPED',
	        }));
	        conv.ask(new Suggestions('再次查詢', i18n.__('pass_time'), i18n.__('people_on'), '👋 ' + i18n.__('Bye')));

	        if (conv.user.storage.direct !== false) { conv.expectUserResponse = false } //告知Google助理結束對話
	    });

	});

	app.intent('取得地點權限', (conv) => {
	    conv.data.requestedPermission = 'DEVICE_PRECISE_LOCATION';

	    if (conv.screen) {
	        return conv.ask(new Permission({
	            context: i18n.__('Permission_request'),
	            permissions: conv.data.requestedPermission,
	        }));
	    } else {
	        return conv.ask(new Permission({
	            context: i18n.__('Permission_request1'),
	            permissions: conv.data.requestedPermission,
	        }));
	    }
	    conv.ask(new Permission(options));

	});

	app.intent('回傳資訊', (conv, params, permissionGranted) => {

	    const screenAvailable = conv.available.surfaces.capabilities.has('actions.capability.SCREEN_OUTPUT');

	    if (permissionGranted) {
	        const {
	            requestedPermission
	        } = conv.data;

	        if (requestedPermission === 'DEVICE_PRECISE_LOCATION') {

	            const coordinates = conv.device.location.coordinates;

	            if (coordinates) {
	                return new Promise(
	                    function(resolve, reject) {
	                        getJSON('https://www.astroviewer.net/iss/ws/predictor.php?lon=' + coordinates.longitude + '&lat=' + coordinates.latitude)
	                            .then(function(response) {
	                                if (response.passes.length === 0) { reject("該時段無過境資料") }
	                                resolve(response.passes)
	                            }).catch(function(error) {
	                                reject(new Error('資料獲取失敗'))
	                            });

	                    }).then(function(final_data) {

	                    var i = 0; //選擇要顯示的過境時間資料

	                    var date = parseInt(final_data[i].begin.substr(4, 2)) + '月' + parseInt(final_data[i].begin.substr(5, 2)) + '日';

	                    if (conv.screen) {
	                        conv.ask(new SimpleResponse({
	                            speech: `<speak><p><s>${ i18n.__('report',date,timeSpliter(final_data[i].begin),directionGen(final_data[i].beginDir),final_data[i].beginAlt,final_data[i].mag,timeSpliter(final_data[i].end),directionGen(final_data[i].endDir),final_data[i].endAlt)}</s></p></speak>`,
	                            text: i18n.__('report_text')
	                        }));

	                        conv.ask(new Table({
	                            title: date + '  \n最大星等 ' + final_data[i].mag,
	                            columns: [{ header: '時機點', align: 'CENTER', }, { header: '時間', align: 'CENTER', }, { header: '仰角', align: 'CENTER', }, { header: '方位', align: 'CENTER', }, ],
	                            rows: [
	                                { cells: [i18n.__('start'), timeSpliter(final_data[i].begin), final_data[i].beginAlt + '°', directionGen(final_data[i].beginDir)], dividerAfter: false, },
	                                { cells: [i18n.__('high_point'), timeSpliter(final_data[i].max), final_data[i].maxAlt + '°', directionGen(final_data[i].maxDir)], dividerAfter: false, },
	                                { cells: [i18n.__('end'), timeSpliter(final_data[i].end), final_data[i].endAlt + '°', directionGen(final_data[i].endDir)], dividerAfter: false, },
	                            ],
	                            buttons: new Button({
	                                title: '查看更多資訊',
	                                url: 'https://www.heavens-above.com/PassSummary.aspx?satid=25544&lat=' + coordinates.latitude + '&lng=' + coordinates.longitude + '&loc=Unnamed&alt=0&tz=ChST&cul=zh-CHT',
	                            }),
	                        }));
	                        conv.ask(new Suggestions('重新定位', i18n.__('now_where1'), i18n.__('people_on'), '👋 ' + i18n.__('Bye')));

	                        if (conv.user.storage.direct !== false) { conv.expectUserResponse = false } //告知Google助理結束對話

	                    } else if (screenAvailable) {
	                        const context = `由於對話的裝置無法查看星象圖`;
	                        const notification = '國際太空站在' + date + '的星象圖';
	                        const capabilities = ['actions.capability.SCREEN_OUTPUT'];
	                        conv.user.storage.final_data = final_data[1];
	                        conv.user.storage.direct = false;
	                        return conv.ask(new NewSurface({ context, notification, capabilities }));
	                    }
	                }).catch(function(error) {
	                    console.log(error)
	                    if (conv.screen) {
	                        conv.ask(new SimpleResponse({
	                            speech: `<speak><p><s>${i18n.__('Noresult_talk')}</s></p></speak>`,
	                            text: i18n.__('Noresult_show')
	                        }));

	                        conv.ask(new BasicCard({
	                            title: '查詢的時間區間',
	                            subtitle: getDay(0) + '到' + getDay(10),
	                            text: '**Ⓒ資訊來自HeavensAbove.com**',
	                            buttons: new Button({
	                                title: '查看更多資訊',
	                                url: 'https://www.heavens-above.com/PassSummary.aspx?satid=25544&lat=' + coordinates.latitude + '&lng=' + coordinates.longitude + '&loc=Unnamed&alt=0&tz=ChST&cul=zh-CHT',
	                            }),
	                        }));
	                        conv.ask(new Suggestions('重新定位', i18n.__('now_where1'), i18n.__('people_on'), '👋 ' + i18n.__('Bye')));

	                        if (conv.user.storage.direct !== false) { conv.expectUserResponse = false } //告知Google助理結束對話

	                    } else { conv.ask(`<speak><p><s>${i18n.__('Noresult_show')}</s></p></speak>`); }

	                });
	            } else {
	                if (conv.user.storage.direct === false) {
	                    conv.ask(new SimpleResponse({ speech: `<speak><p><s>糟糕，我無法得知你的目前位置。</s><s>請稍後再試。</s></p></speak>`, text: "發生錯誤，請開啟GPS功能然後再試一次。" }));
	                    conv.ask(new Suggestions('重新定位', i18n.__('now_where1'), i18n.__('people_on'), '👋 ' + i18n.__('Bye')));
	                } else {
	                    conv.close(new SimpleResponse({ speech: `<speak><p><s>糟糕，我無法得知你的目前位置。</s><s>請稍後再試。</s></p></speak>`, text: "發生錯誤，請開啟GPS功能然後再試一次。" }));
	                }
	            }
	        }
	    } else {
	        if (conv.user.storage.direct === false) {
	            conv.ask(new SimpleResponse({ speech: `<speak><p><s>很抱歉，由於未取得你的授權因此查詢失敗。</s><s>不過你隨時可以回來再試一次。</s></p></speak>`, text: "發生錯誤，未取得你的授權。" }));
	            conv.ask(new Suggestions('重新定位', i18n.__('now_where1'), i18n.__('people_on'), '👋 ' + i18n.__('Bye')));
	        } else {
	            conv.close(new SimpleResponse({ speech: `<speak><p><s>很抱歉，由於未取得你的授權因此查詢失敗。</s><s>不過你隨時可以回來再試一次。</s></p></speak>`, text: "發生錯誤，未取得你的授權。" }));
	        }
	    }

	});


	app.intent('在新裝置上進行對話', (conv, newSurface) => {

	    var final_data = conv.user.storage.final_data;
	    console.log(final_data);

	    var date = parseInt(final_data.begin.substr(4, 2)) + '月' + parseInt(final_data.begin.substr(5, 2)) + '日';

	    if (conv.arguments.get('NEW_SURFACE').status === 'OK') {
	        conv.ask(new SimpleResponse({
	            speech: `<speak><p><s>下面是你所在位置的對應星象圖等資訊。</s></p></speak>`,
	            text: '以下是詳細資訊',
	        }));
	        conv.ask(new Table({
	            title: date + '  \n最大星等 ' + final_data.mag,
	            columns: [{ header: '時機點', align: 'CENTER', }, { header: '時間', align: 'CENTER', }, { header: '仰角', align: 'CENTER', }, { header: '方位', align: 'CENTER', }, ],
	            rows: [
	                { cells: [i18n.__('start'), timeSpliter(final_data.begin), final_data.beginAlt + '°', directionGen(final_data.beginDir)], dividerAfter: false, },
	                { cells: [i18n.__('high_point'), timeSpliter(final_data.max), final_data.maxAlt + '°', directionGen(final_data.maxDir)], dividerAfter: false, },
	                { cells: [i18n.__('end'), timeSpliter(final_data.end), final_data.endAlt + '°', directionGen(final_data.endDir)], dividerAfter: false, },
	            ],
	            buttons: new Button({
	                title: '查看更多資訊',
	                url: 'https://www.heavens-above.com/PassSummary.aspx?satid=25544&lat=' + coordinates.latitude + '&lng=' + coordinates.longitude + '&loc=Unnamed&alt=0&tz=ChST&cul=zh-CHT',
	            }),
	        }));

	    } else {
	        conv.ask(new SimpleResponse({
	            speech: `<speak><p><s>獲取資料發生錯誤，請稍後再試。</s></p></speak>`,
	            text: '獲取資訊發生未知錯誤',
	        }));
	        conv.ask(new BasicCard({
	            image: new Image({ url: 'https://dummyimage.com/1089x726/ef2121/ffffff.png&text=錯誤', alt: 'Pictures', }),
	            title: "發生錯誤，請稍後再試",
	            display: 'CROPPED',
	        }));
	    }
	    conv.ask(new Suggestions('重新定位', i18n.__('now_where1'), i18n.__('people_on'), '👋 ' + i18n.__('Bye')));

	});


	app.intent('上面的人資訊', (conv) => {

	    return new Promise(

	        function(resolve, reject) {
	            getJSON('http://api.open-notify.org/astros.json')
	                .then(function(response) {
	                    var people_array = [];
	                    for (i = 0; i < response.people.length; i++) {
	                        people_array.push(response.people[i].name)
	                    }
	                    resolve(people_array)
	                }).catch(function(error) {
	                    var reason = new Error('資料獲取失敗');
	                    reject(reason)
	                });

	        }).then(function(return_data) {

	        var people_list = "";
	        var people_output = "";
	        for (i = 0; i < return_data.length; i++) {
	            people_list = people_list + '  • ' + return_data[i] + '\n';
	            people_output = people_output + return_data[i] + '<break time="0.5s"/>';
	        }

	        conv.ask(new SimpleResponse({
	            speech: `<speak><p><s>${i18n.__('people_info',return_data.length)}，分別是${people_output}</s></p></speak>`,
	            text: "查詢完成，詳細資訊如下",
	        }));

	        conv.ask(new BasicCard({
	            title: i18n.__('people_info1', return_data.length),
	            display: 'CROPPED',
	            subtitle: people_list,
	            buttons: new Button({
	                title: '前往NASA看詳細資訊',
	                url: 'https://www.nasa.gov/mission_pages/station/expeditions/index.html',
	            }),
	        }));
	        conv.ask(new Suggestions(i18n.__('now_where'), i18n.__('pass_time'), '👋 ' + i18n.__('Bye')));

	        if (conv.user.storage.direct !== false) { conv.expectUserResponse = false } //告知Google助理結束對話

	    }).catch(function(error) {
	        conv.ask(new SimpleResponse({
	            speech: `<speak><p><s>獲取資料發生錯誤，請稍後再試。</s></p></speak>`,
	            text: '獲取資訊發生未知錯誤',
	        }));
	        console.log(error)
	        if (conv.user.storage.direct === false) {
	            conv.ask(new BasicCard({
	                image: new Image({ url: 'https://dummyimage.com/1089x726/ef2121/ffffff.png&text=錯誤', alt: 'Pictures', }),
	                title: "發生錯誤，請稍後再試",
	                display: 'CROPPED',
	            }));
	            conv.ask(new Suggestions(i18n.__('now_where'), i18n.__('pass_time'), '👋 ' + i18n.__('Bye')));

	        } else {
	            conv.close(new BasicCard({
	                image: new Image({ url: 'https://dummyimage.com/1089x726/ef2121/ffffff.png&text=錯誤', alt: 'Pictures', }),
	                title: "發生錯誤，請稍後再試",
	                display: 'CROPPED',
	            }));
	        }

	    });

	});

	app.intent('預設罐頭回覆', (conv) => {

	    var example_array = [i18n.__('now_where'), i18n.__('pass_time'), i18n.__('people_on')];

	    conv.ask(new SimpleResponse({
	        speech: `<speak><p><s>${i18n.__('Error_hint1','<break time="0.5s"/>',example_array[parseInt(Math.random()*2)])}</s></p></speak>`,
	        text: i18n.__('Error_hint')
	    }));

	    conv.ask(new Suggestions(i18n.__('now_where'), i18n.__('pass_time'), i18n.__('people_on'), '👋 ' + i18n.__('Bye')));

	});


	app.intent('結束對話', (conv) => {
	    conv.user.storage = {}; //離開同時清除暫存資料
	    conv.ask(i18n.__('EndTalk1'));
	    conv.ask(new SimpleResponse({ speech: i18n.__('EndTalk2'), text: i18n.__('EndTalk2') + ' 👋', }));
	    conv.close(new BasicCard({
	        title: i18n.__('EndTitle'),
	        subtitle: i18n.__('EndText'),
	        buttons: new Button({ title: i18n.__('EndButton'), url: 'https://assistant.google.com/services/a/uid/000000ee35748109', }),
	    }));

	});


	// Set the DialogflowApp object to handle the HTTPS POST request.
	exports.iss_info = functions.https.onRequest(app);