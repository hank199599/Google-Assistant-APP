'use strict';

// Import the Dialogflow module from the Actions on Google client library.
const {
	dialogflow,
	Permission, Suggestions,
	SimpleResponse, Button, Image,
	BasicCard, Carousel, Table } = require('actions-on-google');

// Import the firebase-functions package for deployment.
const functions = require('firebase-functions');
var getJSON = require('get-json')
const replaceString = require('replace-string');
const findNearestLocation = require('map-nearest-location');
const app = dialogflow({ debug: true });
const admin = require('firebase-admin');
var request = require('request'),
	cheerio = require('cheerio');
var option_list = require("./option.json");
var keyword_list = require("./keywords.json");
var mobile_display = require("./mobile.json");
var suggest_list = require("./suggest.json");
var explain_list = require("./explain.json");
var county_options = require("./county_list.json");
let serviceAccount = require("./config/b1a2b-krmfch-firebase-adminsdk-1tgdm-7347f3fed7.json");
var functions_fetch = require("./fetch.js");

admin.initializeApp({
	credential: admin.credential.cert(serviceAccount),
	databaseURL: "https://b1a2b-krmfch.firebaseio.com/"
});

const database = admin.database();

var picture = "";
var picurl1 = ""; var picurl2 = ""; var picurl3 = "";
var status1 = ""; var status2 = ""; var status3 = ""; 
var AQI1 = ""; var AQI2 = ""; var AQI3 = "";
var station_array = ["二林", "三重", "三義", "土城", "士林", "大同", "大里", "大園", "大寮", "小港", "中山", "中壢", "仁武", "斗六", "冬山", "古亭", "左營", "平鎮", "永和", "安南", "朴子", "汐止", "竹山", "竹東", "西屯", "沙鹿", "宜蘭", "忠明", "松山", "板橋", "林口", "林園", "花蓮", "金門", "前金", "前鎮", "南投", "屏東", "琉球", "恆春", "美濃", "苗栗", "埔里", "桃園", "觀音工業區", "馬公", "馬祖", "基隆", "崙背", "淡水", "麥寮", "善化", "富貴角", "復興", "湖口", "菜寮", "陽明", "新竹", "新店", "新莊", "新港", "新營", "楠梓", "萬里", "萬華", "嘉義", "彰化", "大城", "臺西", "臺東", "臺南", "麻豆", "鳳山", "潮州", "線西", "橋頭", "頭份", "龍潭", "豐原", "關山", "觀音"];
var station_explain = ["二林", "三重", "三義", "土城", "士林", "大同", "大里", "大園", "大寮", "小港", "中山", "中壢", "仁武", "斗六", "冬山", "古亭", "左營", "平鎮", "永和", "安南", "朴子", "汐止", "竹山", "竹東", "西屯", "沙鹿", "宜蘭", "忠明", "松山", "板橋", "林口", "林園", "花蓮", "金門", "前金", "前鎮", "南投", "屏東", "琉球", "恆春", "美濃", "苗栗", "埔里", "桃園", "觀音工業區", "馬公", "馬祖", "基隆", "崙背", "淡水", "麥寮", "善化", "富貴角", "復興", "湖口", "菜寮", "陽明", "新竹", "新店", "新莊", "新港", "新營", "楠梓", "萬里", "萬華", "嘉義", "彰化", "大城", "臺西", "臺東", "臺南", "麻豆", "鳳山", "潮州", "線西", "橋頭", "頭份", "龍潭", "豐原", "關山", "觀音"];
var origin_station_array = ["二林", "三重", "三義", "土城", "士林", "大同", "大里", "大園", "大寮", "小港", "中山", "中壢", "仁武", "斗六", "冬山", "古亭", "左營", "平鎮", "永和", "安南", "朴子", "汐止", "竹山", "竹東", "西屯", "沙鹿", "宜蘭", "忠明", "松山", "板橋", "林口", "林園", "花蓮", "金門", "前金", "前鎮", "南投", "屏東", "屏東(琉球)", "恆春", "美濃", "苗栗", "埔里", "桃園", "桃園(觀音工業區)", "馬公", "馬祖", "高雄(左營)", "高雄(楠梓)", "基隆", "崙背", "淡水", "麥寮", "善化", "富貴角", "復興", "湖口", "菜寮", "陽明", "新北(樹林)", "新竹", "新店", "新莊", "新港", "新營", "楠梓", "楠梓加工出口區", "萬里", "萬華", "嘉義", "彰化", "彰化(大城)", "臺西", "臺東", "臺南", "臺南(麻豆)", "鳳山", "潮州", "線西", "橋頭", "頭份", "龍潭", "豐原", "關山", "觀音", "新竹(香山)"];
var request_array = ["宜蘭縣", "臺東縣", "臺北市", "新北市第一部分", "新北市第二部分", "桃園市", "新竹縣市", "苗栗縣", "臺中市", "彰化縣", "南投縣", "雲林縣", "嘉義縣市", "臺南市", "北高雄", "南高雄", "屏東縣"];
var input_array = ["臺北市", "新北市第一部分", "新北市第二部分", "桃園市", "新竹縣市", "苗栗縣", "臺中市", "彰化縣", "南投縣", "雲林縣", "嘉義縣市", "臺南市", "北高雄", "南高雄", "屏東縣"];
var option_array = ["北部地區", "中部地區", "南部地區", "東部地區", "離島地區", "行動測站"];
var county_array = ["南投縣", "連江縣", "馬祖", "南投", "雲林縣", "雲林", "金門縣", "金門", "苗栗縣", "苗栗", "高雄市", "高雄", "嘉義市", "花蓮縣", "花蓮", "嘉義縣", "台東縣", "臺東縣", "台東", "臺東", "嘉義", "基隆市", "台北市", "台南市", "臺南市", "台南", "臺南", "臺北市", "台北", "臺北", "基隆", "宜蘭縣", "台中市", "臺中市", "台中", "澎湖縣", "澎湖", "桃園市", "桃園", "新竹縣", "新竹市", "新竹", "新北市", "新北", "宜蘭", "屏東縣", "屏東", "彰化縣", "彰化"];
var mobile_array = ["新北(樹林)", "桃園(觀音工業區)", "新竹(香山)", "彰化(大城)", "彰化(田尾)", "臺南(麻豆)", "臺南(北門)", "高雄(楠梓)", "高雄(左營)", "屏東(琉球)"];
var word1 = ""; var word2 = ""; var word3 = "";
var locations = [{ lng: 120.409653, lat: 23.925175, Sitename: "二林" }, { lng: 121.493806, lat: 25.072611, Sitename: "三重" }, { lng: 120.758833, lat: 24.382942, Sitename: "三義" }, { lng: 121.451861, lat: 24.982528, Sitename: "土城" }, { lng: 121.515389, lat: 25.105417, Sitename: "士林" }, { lng: 121.513311, lat: 25.0632, Sitename: "大同" }, { lng: 120.677689, lat: 24.099611, Sitename: "大里" }, { lng: 121.201811, lat: 25.060344, Sitename: "大園" }, { lng: 120.425081, lat: 22.565747, Sitename: "大寮" }, { lng: 120.337736, lat: 22.565833, Sitename: "小港" }, { lng: 121.526528, lat: 25.062361, Sitename: "中山" }, { lng: 121.221667, lat: 24.953278, Sitename: "中壢" }, { lng: 120.332631, lat: 22.689056, Sitename: "仁武" }, { lng: 120.544994, lat: 23.711853, Sitename: "斗六" }, { lng: 121.792928, lat: 24.632203, Sitename: "冬山" }, { lng: 121.529556, lat: 25.020608, Sitename: "古亭" }, { lng: 120.292917, lat: 22.674861, Sitename: "左營" }, { lng: 121.203986, lat: 24.952786, Sitename: "平鎮" }, { lng: 121.516306, lat: 25.017, Sitename: "永和" }, { lng: 120.2175, lat: 23.048197, Sitename: "安南" }, { lng: 120.24781, lat: 23.467123, Sitename: "朴子" }, { lng: 121.6423, lat: 25.067131, Sitename: "汐止" }, { lng: 120.677306, lat: 23.756389, Sitename: "竹山" }, { lng: 121.088903, lat: 24.740644, Sitename: "竹東" }, { lng: 120.616917, lat: 24.162197, Sitename: "西屯" }, { lng: 120.568794, lat: 24.225628, Sitename: "沙鹿" }, { lng: 121.746394, lat: 24.747917, Sitename: "宜蘭" }, { lng: 120.641092, lat: 24.151958, Sitename: "忠明" }, { lng: 121.578611, lat: 25.05, Sitename: "松山" }, { lng: 121.458667, lat: 25.012972, Sitename: "板橋" }, { lng: 121.376869, lat: 25.077197, Sitename: "林口" }, { lng: 120.41175, lat: 22.4795, Sitename: "林園" }, { lng: 121.599769, lat: 23.971306, Sitename: "花蓮" }, { lng: 118.312256, lat: 24.432133, Sitename: "金門" }, { lng: 120.288086, lat: 22.632567, Sitename: "前金" }, { lng: 120.307564, lat: 22.605386, Sitename: "前鎮" }, { lng: 120.685306, lat: 23.913, Sitename: "南投" }, { lng: 120.488033, lat: 22.673081, Sitename: "屏東" }, { lng: 120.788928, lat: 21.958069, Sitename: "恆春" }, { lng: 120.530542, lat: 22.883583, Sitename: "美濃" }, { lng: 120.8202, lat: 24.565269, Sitename: "苗栗" }, { lng: 120.967903, lat: 23.968842, Sitename: "埔里" }, { lng: 121.304383, lat: 24.995368, Sitename: "桃園" }, { lng: 119.566158, lat: 23.569031, Sitename: "馬公" }, { lng: 119.949875, lat: 26.160469, Sitename: "馬祖" }, { lng: 121.760056, lat: 25.129167, Sitename: "基隆" }, { lng: 120.348742, lat: 23.757547, Sitename: "崙背" }, { lng: 121.449239, lat: 25.1645, Sitename: "淡水" }, { lng: 120.251825, lat: 23.753506, Sitename: "麥寮" }, { lng: 120.297142, lat: 23.115097, Sitename: "善化" }, { lng: 121.536763, lat: 25.298562, Sitename: "富貴角" }, { lng: 120.312017, lat: 22.608711, Sitename: "復興" }, { lng: 121.038653, lat: 24.900142, Sitename: "湖口" }, { lng: 121.481028, lat: 25.06895, Sitename: "菜寮" }, { lng: 121.529583, lat: 25.182722, Sitename: "陽明" }, { lng: 120.972075, lat: 24.805619, Sitename: "新竹" }, { lng: 121.537778, lat: 24.977222, Sitename: "新店" }, { lng: 121.4325, lat: 25.037972, Sitename: "新莊" }, { lng: 120.345531, lat: 23.554839, Sitename: "新港" }, { lng: 120.31725, lat: 23.305633, Sitename: "新營" }, { lng: 120.328289, lat: 22.733667, Sitename: "楠梓" }, { lng: 121.689881, lat: 25.179667, Sitename: "萬里" }, { lng: 121.507972, lat: 25.046503, Sitename: "萬華" }, { lng: 120.440833, lat: 23.462778, Sitename: "嘉義" }, { lng: 120.541519, lat: 24.066, Sitename: "彰化" }, { lng: 120.273117, lat: 23.843139, Sitename: "大城" }, { lng: 120.202842, lat: 23.717533, Sitename: "臺西" }, { lng: 121.15045, lat: 22.755358, Sitename: "臺東" }, { lng: 120.202617, lat: 22.984581, Sitename: "臺南" }, { lng: 120.358083, lat: 22.627392, Sitename: "鳳山" }, { lng: 120.561175, lat: 22.523108, Sitename: "潮州" }, { lng: 120.469061, lat: 24.131672, Sitename: "線西" }, { lng: 120.305689, lat: 22.757506, Sitename: "橋頭" }, { lng: 120.898572, lat: 24.696969, Sitename: "頭份" }, { lng: 121.21635, lat: 24.863869, Sitename: "龍潭" }, { lng: 120.741711, lat: 24.256586, Sitename: "豐原" }, { lng: 121.161933, lat: 23.045083, Sitename: "關山" }, { lng: 121.082761, lat: 25.035503, Sitename: "觀音" }];
var Status = 0; var AQI = 0; var Pollutant = ""; var info = ""; var info_output = "";
var indexnumber = "";
var choose_station = "";

var direction_array = ["東北風", "偏東風", "偏南風", "西南風", "偏西風", "背風面", "下風處", "弱風環境", "背風渦旋"]
var pollutant_array = ["河川揚塵", "光化反應", "境外汙染", "降雨洗除作用", "沉降作用", "混合層高度"];
var day_array = ["今天", "明天", "後天"];
var key_array = ["東北季風", "東北風", "東北東風", "偏北風", "偏東風", "偏西風", "偏南風", "西南季風", "南風", "南南東風", "背風", "下風", "弱風", "背風渦旋", "揚塵", "光化", "境外", "降雨", "混合層高度", "垂直擴散", "沉降作用"];
var area_array = ["北部", "竹苗", "中部", "雲嘉南", "高屏", "宜蘭", "花東"];
var eicon = ["🌍 ", "🌎 ", "🌏 "];
var output_title = "";
var Pollutant_list = []; var AQI_list = []; var PM25_list = []; var PM10_list = []; var O3_list = []; 
var Pollutant_list_update = []; var AQI_list_update = []; var PM25_list_update = []; var PM10_list_update = []; var O3_list_update = []; var Sitename_list_update = [];
var PM25 = ""; var PM10 = ""; var O3 = "";
var time = 0; var hour_now = 0; var minute_now = 0; 
var i = 0; var data_get = ""; 
var sitename = "";
var day2_report = "";
var day3_report = "";
var report_output="";

function air_report_set() {

	i = 0; Pollutant_list_update = []; AQI_list_update = []; PM25_list_update = []; PM10_list_update = []; O3_list_update = []; Sitename_list_update = [];

	//取得概況報告
	time = new Date();
	hour_now = (time.getHours() + 8) % 24;
	minute_now = time.getMinutes();

	if (minute_now < 15) {

		//Promise B:取得測站資料
		data_get = new Promise(function (resolve, reject) {
			getJSON('https://data.epa.gov.tw/api/v1/aqx_p_432?format=json&limit=100&api_key=e44e7dd6-8d7a-433d-9fe6-8327b8dcfcad').then(function (response) {
				resolve(response.records)
			}).catch(function (error) { reject(new Error('資料獲取失敗')) });
		});

		//取得各測站詳細資訊
		data_get.then(function (origin_data) {
			for (i = 0; i < origin_data.length; i++) {
				Pollutant_list_update[i] = origin_data[i].Pollutant;
				AQI_list_update[i] = origin_data[i].AQI;
				PM10_list_update[i] = origin_data[i]['PM10'];
				PM25_list_update[i] = origin_data[i]['PM2.5'];
				O3_list_update[i] = origin_data[i].O3;
				Sitename_list_update[i] = origin_data[i].SiteName;
			}

			database.ref('/TWair').update({ Pollutant: Pollutant_list_update });
			database.ref('/TWair').update({ AQI: AQI_list_update });
			database.ref('/TWair').update({ PM25: PM25_list_update });
			database.ref('/TWair').update({ PM10: PM10_list_update });
			database.ref('/TWair').update({ O3: O3_list_update });
			database.ref('/TWair').update({ SiteName: Sitename_list_update });

			Pollutant_list = Pollutant_list_update;
			AQI_list = AQI_list_update;
			PM10_list = PM10_list_update;
			PM25_list = PM25_list_update;
			O3_list = O3_list_update;
			station_array = Sitename_list_update;

		}).catch(function (error) {
			database.ref('/TWair').on('value', e => {
				Pollutant_list = e.val().Pollutant;
				AQI_list = e.val().AQI;
				PM10_list = e.val().PM10;
				PM25_list = e.val().PM25;
				O3_list = e.val().O3;
				station_array = e.val().SiteName;
			});
		});
	}
}

const SelectContexts = {parameter: 'select'};
const AppContexts = {LOCATION: 'sendback_premission'};

app.intent('預設歡迎語句', (conv) => {

	return new Promise(
		function (resolve, reject) {
			//取得概況報告
			time = new Date();
			hour_now = (time.getHours() + 8) % 24;
			minute_now = time.getMinutes();

			if (minute_now < 15) {

				request('https://airtw.epa.gov.tw/CHT/Forecast/Forecast_3days.aspx', function (err, response, body) {
					if (!err && response.statusCode == 200) {
						// body為原始碼
						// 使用 cheerio.load 將字串轉換為 cheerio(jQuery) 物件，
						// 按照jQuery方式操作即可
						var $ = cheerio.load(body, { decodeEntities: false });
						// 輸出導航的html程式碼
						//console.log(body);

						var aqi_temp = $('#CPH_Content_hf_DT').val();
						var FCJsonObj = JSON.parse(aqi_temp.replace(/\r\n|\n/g, ""));

						if ([0, 7, 12, 17, 22].indexOf(hour_now) !== -1) {
							//if(minute_now<59){
							var i = 0;
							var return_array1 = [];
							var return_array2 = [];
							var return_array3 = [];

							for (i = 0; i < 7; i++) {
								return_array1.push({ AQI: FCJsonObj[i].DAY1_AQI, Pollutant: FCJsonObj[i].DAY1_POLL })
								return_array2.push({ AQI: FCJsonObj[i].DAY2_AQI, Pollutant: FCJsonObj[i].DAY2_POLL })
								return_array3.push({ AQI: FCJsonObj[i].DAY3_AQI, Pollutant: FCJsonObj[i].DAY3_POLL })
							}
							database.ref('/TWair').update({ predict1: return_array1 });
							database.ref('/TWair').update({ predict2: return_array2 });
							database.ref('/TWair').update({ predict3: return_array3 });

						}

						if (hour_now > 9) { var data = FCJsonObj[0].Content1; }
						else { var data = FCJsonObj[0].Content2; }

						database.ref('/TWair').update({ report: data });
						resolve(data)
					} else { reject(err) }
				});
			}
			else {
				database.ref('/TWair').on('value', e => {
					resolve(e.val().report)
				});
			}
		}).then(function (report_output) {

			conv.ask(new Suggestions(eicon[parseInt(Math.random() * 2)] + '最近的測站', '🔎依區域查詢'));


			for (i = 0; i < key_array.length; i++) {
				if (report_output.indexOf(key_array[i]) !== -1) { conv.ask(new Suggestions(keyword_list[key_array[i]])); }
			}

			if (conv.screen) {

				if (conv.user.last.seen) {
					conv.ask(new SimpleResponse({
						speech: `<speak><p><s>現在的空氣品質概要如下，${report_output}</s></p></speak>`,
						text: '以下是現在的空氣品質摘要'
					}));
				}
				else {
					conv.ask(new SimpleResponse({
						speech: `<speak><p><s>歡迎使用空汙查詢精靈!</s><s>我能提供環保署的監測站查詢服務，此外，你能將我加入日常安排快速查詢所需站點。</s><s>接下來，是目前的空氣概況<break time="0.5s"/>${replaceString(report_output, '；', '<break time="0.3s"/>')}</s></p></speak>`,
						text: '歡迎使用!'
					}));
				}
				conv.ask(new BasicCard({
					//image: new Image({url:'https://i.imgur.com/DOvpvIe.jpg ',alt:'Pictures',}),
					//display: 'CROPPED',
					title: "全台空氣品質概要 \n",
					subtitle: report_output,
					text: "測站資訊發布時間 • " + functions_fetch.FormatTime(),
					buttons: new Button({ title: '行政院環境保護署', url: 'https://airtw.epa.gov.tw/CHT/default.aspx', display: 'CROPPED', }),
				}));

				conv.ask(new Suggestions('今天的數值預報', '如何加入日常安排', '👋 掰掰'));

			}
			else {
				word1 = county_array[parseInt(Math.random() * 19)]; word2 = county_array[20 + parseInt(Math.random() * 28)];
				conv.ask(`<speak><p><s>空氣品質概要如下</s><s>${replaceString(report_output, '；', '<break time="0.3s"/>')}</s></p></speak>`);
				conv.ask(`<speak><p><s>接著，試著問我要查看的縣市!</s><s>例如<break time="0.2s"/>${word1}空氣品質如何?<break time="0.2s"/>或<break time="0.2s"/>幫我找${word2}</s></p></speak>`);
				conv.noInputs = ["抱歉，我沒聽輕楚。請再問一次", "請試著問我要查詢的縣市列表，例如、" + word1 + "空氣品質如何?", "很抱歉，我幫不上忙"];

			}

			air_report_set();

		}).catch(function (error) {
			if (conv.screen) {
				conv.ask(new SimpleResponse({
					speech: `<speak><p><s>歡迎使用空汙查詢精靈!</s><s>我能提供環保署的監測站查詢服務。請選擇你要使用的服務</s></p></speak>`,
					text: '歡迎使用!'
				}));
				conv.ask(new BasicCard({
					image: new Image({ url: 'https://i.imgur.com/DOvpvIe.jpg ', alt: 'Pictures', }),
					title: "查詢方式",
					subtitle: " • 定位查詢 \n • 區域查詢\n • 直接查看特定站點資訊",
					buttons: new Button({ title: '行政院環境保護署', url: 'https://airtw.epa.gov.tw/CHT/default.aspx', display: 'CROPPED', }),
				}));

				conv.ask(new Suggestions(eicon[parseInt(Math.random() * 2)] + '最近的測站', '🔎依區域查詢', '如何加入日常安排', '👋 掰掰'));

			}
			else {
				word1 = county_array[parseInt(Math.random() * 19)]; word2 = county_array[20 + parseInt(Math.random() * 28)];
				conv.ask(`<speak><p><s>歡迎使用空汙查詢精靈</s></p></speak>`);
				conv.ask(`<speak><p><s>試著問我要查看的縣市!</s><s>例如<break time="0.2s"/>${word1}空氣品質如何?<break time="0.2s"/>或<break time="0.2s"/>幫我找${word2}</s></p></speak>`);
				conv.noInputs = ["抱歉，我沒聽輕楚。請再問一次", "請試著問我要查詢的縣市列表，例如、" + word1 + "空氣品質如何?", "很抱歉，我幫不上忙"];

			}
			database.ref('/TWair').on('value', e => {
				Pollutant_list = e.val().Pollutant;
				AQI_list = e.val().AQI;
				PM10_list = e.val().PM10;
				PM25_list = e.val().PM25;
				O3_list = e.val().O3;
				day2_report = e.val().tomorrow;
				day3_report = e.val().aftertomorrow;
				station_array = e.val().SiteName;
			});
		});

});

app.intent('依區域查詢', (conv) => {

	if (conv.screen) { conv.ask('請輕觸下方卡片來選擇查詢區域'); }
	else {
		conv.ask(new SimpleResponse({
			speech: `<speak><p><s>請選擇要查詢的區域!</s><s>選項有以下幾個<break time="0.5s"/>北部地區<break time="0.2s"/>中部地區<break time="0.2s"/>南部地區<break time="0.2s"/>東部地區<break time="0.2s"/>離島地區<break time="1s"/>請選擇。</s></p></speak>`,
			text: '請輕觸下方卡片來選擇查詢區域!'
		}));
	}
	conv.contexts.set(SelectContexts.parameter, 5);
	conv.ask(new Carousel({
		title: 'Carousel Title',
		items: county_options,
	}));
	conv.ask(new Suggestions(eicon[parseInt(Math.random() * 2)] + '最近的測站', '語音查詢範例', '今天的數值預報', '風向對空污的影響', '污染物影響要素', '👋 掰掰'));

	air_report_set();
});


app.intent('縣市查詢結果', (conv, input, option) => {

	return new Promise(
		function (resolve, reject) {
			database.ref('/TWair').on('value', e => { resolve(e.val()); });
		}).then(function (final_data) {

			report_output = final_data.report;
			Pollutant_list = final_data.Pollutant;
			AQI_list = final_data.AQI;
			PM10_list = final_data.PM10;
			PM25_list = final_data.PM25;
			O3_list = final_data.O3;
			day2_report = final_data.tomorrow;
			day3_report = final_data.aftertomorrow;
			station_array = final_data.SiteName;

			if (conv.input.raw.indexOf('最近') !== -1 || conv.input.raw.indexOf('附近') !== -1) { option = "🌎 最近的測站"; }
			else if (conv.input.raw.indexOf('台東') !== -1 || conv.input.raw.indexOf('臺東') !== -1) { option = "臺東"; }


			if (option_array.indexOf(option) !== -1) {

				if (option !== "行動測站") {
					if (conv.screen) {
						conv.ask(new SimpleResponse({
							speech: `<speak><p><s>以下是${option}的對應選項<break time="0.5s"/>請查看</s></p></speak>`,
							text: '以下是「' + option + '」對應的選項'
						}));
					}
					else { conv.ask(new SimpleResponse(`<speak><p><s>請選擇${option}對應的選項!</s><s>選項有以下幾個<break time="0.5s"/>${option_list[option]}<break time="1s"/>請選擇。</s></p></speak>`)); }
				}

				conv.contexts.set(SelectContexts.parameter, 5);
				if (option === "北部地區") {

					conv.ask(new Carousel({
						items: {
							'臺北市': {
								synonyms: ['台北', '中正', '大同', '中山', '松山', '大安', '萬華', '信義', '士林', '北投', '內湖', '南港', '文山'],
								title: '臺北市',
								description: '士林、大同、中山  \n古亭、松山、陽明  \n萬華',
							},
							'基隆': {
								synonyms: ['基隆', '仁愛', '信義', '中正', '中山', '安樂', '暖暖', '七堵區',],
								title: '基隆市',
								description: '基隆\n',
							},
							'新北市第一部分': {
								title: '新北市(一)',
								synonyms: ['新北', '三重', '土城', '永和', '汐止', '板橋', '林口'],
								description: '三重、土城、永和  \n汐止、板橋、林口',
							},
							'新北市第二部分': {
								synonyms: ['新北', '淡水', '富貴角', '菜寮', '新店', '新莊', '萬里'],
								title: '新北市(二)',
								description: '淡水、富貴角、菜寮  \n新店、新莊、萬里',
							},
							'桃園市': {
								synonyms: ['桃園', '中壢', '平鎮', '龍潭', '楊梅', '新屋', '觀音', '桃園', '龜山', '八德', '大溪', '復興', '大園', '蘆竹',],
								title: '桃園市',
								description: '大園、中壢、平鎮  \n桃園、龍潭、觀音',
							},
							'新竹縣市': {
								synonyms: ['新竹', '竹北', '湖口', '新豐', '新埔', '關西', '芎林', '寶山', '竹東', '五峰', '橫山', '尖石', '北埔', '峨眉',],
								title: '新竹縣市',
								description: '新竹、竹東  \n湖口',
							}
						},
					}));
				}
				else if (option === "中部地區") {
					conv.ask(new Carousel({
						items: {
							'苗栗縣': {
								synonyms: ['竹南', '頭份', '三灣', '南庄', '獅潭', '後龍', '通霄', '苑裡', '苗栗', '造橋', '頭屋', '公館', '大湖', '泰安', '銅鑼', '三義', '西湖', '卓蘭',],
								title: '苗栗縣',
								description: '三義、苗栗、頭份\n',
							},
							'臺中市': {
								synonyms: ['台中', '北屯', '西屯', '南屯', '太平', '大里', '霧峰', '烏日', '豐原', '后里', '石岡', '東勢', '和平', '新社', '潭子', '大雅', '神岡', '大肚', '沙鹿', '龍井', '梧棲', '清水', '大甲', '外埔', '大安',],
								title: '臺中市',
								description: '大里、西屯、沙鹿  \n忠明、豐原',
							},
							'彰化縣': {
								synonyms: ['彰化', '彰化', '芬園', '花壇', '秀水', '鹿港', '福興', '線西', '和美', '伸港', '員林', '社頭', '永靖', '埔心', '溪湖', '大村', '埔鹽', '田中', '北斗', '田尾', '埤頭', '溪州', '竹塘', '二林', '大城', '芳苑', '二水',],
								title: '彰化縣',
								description: '二林、彰化、線西  \n',
							},
							'南投縣': {
								synonyms: ['南投', '中寮', '草屯', '國姓', '埔里', '仁愛', '名間', '集集', '水里', '魚池', '信義', '竹山', '鹿谷',],
								title: '南投縣',
								description: '竹山、南投、埔里\n',
							},
							'雲林縣': {
								synonyms: ['雲林', '斗南', '大埤', '虎尾', '土庫', '褒忠', '東勢', '臺西', '崙背', '麥寮', '斗六', '林內', '古坑', '莿桐', '西螺', '二崙', '北港', '水林', '口湖', '四湖', '元長',],
								title: '雲林縣',
								description: '斗六、崙背、麥寮  \n臺西',
							}
						},
					}));
				}
				else if (option === "南部地區") {

					conv.ask(new Carousel({
						items: {
							'嘉義縣市': {
								synonyms: ['嘉義', '番路', '梅山', '竹崎', '阿里山', '中埔', '大埔', '水上', '鹿草', '太保', '朴子', '東石', '六腳', '新港', '民雄', '大林', '溪口', '義竹', '布袋',],
								title: '嘉義縣市',
								description: '嘉義、朴子、新港\n',
							},
							'臺南市': {
								synonyms: ['台南', '安平', '安南', '永康', '歸仁', '新化', '左鎮', '玉井', '楠西', '南化', '仁德', '關廟', '龍崎', '官田', '麻豆', '佳里', '西港', '七股', '將軍', '學甲', '北門', '新營', '後壁', '白河', '東山', '六甲', '下營', '柳營', '鹽水', '善化', '大內', '山上', '新市', '安定',],
								title: '台南市',
								description: '安南、善化、新營  \n臺南',
							},
							'北高雄': {
								synonyms: ['北高雄', '美濃', '橋頭', '楠梓', '仁武', '左營', '前金',],
								title: '北高雄',
								description: '美濃、橋頭、楠梓  \n仁武、左營、前金',
							},
							'南高雄': {
								synonyms: ['南高雄', '鳳山', '復興', '前鎮', '小港', '大寮', '林園',],
								title: '南高雄',
								description: '鳳山、復興、前鎮  \n小港、大寮、林園',
							},
							'屏東縣': {
								synonyms: ['屏東', '屏東', '三地門', '霧臺', '瑪家', '九如', '里港', '高樹', '鹽埔', '長治', '麟洛', '竹田', '內埔', '萬丹', '潮州', '泰武', '來義', '萬巒', '崁頂', '新埤', '南州', '林邊', '東港', '琉球', '佳冬', '新園', '枋寮', '枋山', '春日', '獅子', '車城', '牡丹', '恆春', '滿州',],
								title: '屏東縣',
								description: '屏東、潮州、恆春  \n',
							}
						},
					}));
				}
				else if (option === "東部地區") {

					var the_array = option_list[option].split('、');
					var county_list = {};

					for (i = 0; i < the_array.length; i++) {
						var num = station_array.indexOf(the_array[i]);
						var aqi_temp = AQI_list[parseInt(num)];
						var pic_url = functions_fetch.picture_generator(parseInt(aqi_temp));
						var status_temp =functions_fetch.status_generator(parseInt(aqi_temp));

						county_list[the_array[i]] = {
							title: the_array[i],
							description: status_temp,
							image: new Image({ url: pic_url, alt: 'Image alternate text', }),
						}
					}
					conv.ask(new Carousel({
						title: 'Carousel Title',
						items: county_list,
					}));

				}
				else if (option === "離島地區") {

					AQI1 = AQI_list[parseInt(station_array.indexOf('金門'))];
					AQI2 = AQI_list[parseInt(station_array.indexOf('馬祖'))];
					AQI3 = AQI_list[parseInt(station_array.indexOf('馬公'))];

					picurl1 =functions_fetch.picture_generator(parseInt(AQI1));
					picurl2 =functions_fetch.picture_generator(parseInt(AQI2));
					picurl3 =functions_fetch.picture_generator(parseInt(AQI3));
					status1 =functions_fetch.status_generator(parseInt(AQI1));
					status2 =functions_fetch.status_generator(parseInt(AQI2));
					status3 =functions_fetch.status_generator(parseInt(AQI3));

					conv.ask(new Carousel({
						items: {
							'金門': {
								synonyms: ['金門', '金沙', '金湖', '金寧', '金城', '烈嶼', '烏坵',],
								title: '金門',
								description: status1,
								image: new Image({ url: picurl1, alt: 'Image alternate text', }),
							},
							'馬祖': {
								synonyms: ['馬祖', '南竿', '北竿', '莒光', '東引',],
								title: '馬祖',
								description: status2,
								image: new Image({ url: picurl2, alt: 'Image alternate text', }),
							},
							'馬公': {
								synonyms: ['澎湖', '馬公', '西嶼', '望安', '七美', '白沙', '湖西',],
								title: '馬公',
								description: status3,
								image: new Image({ url: picurl3, alt: 'Image alternate text', }),
							},
						}
					}));
				}
				else if (option === "行動測站") {
					if (conv.screen) { conv.ask('以下是「行動測站」列表，\n實際資訊供應可能隨時間變化。'); }
					else { conv.ask(`<speak><p><s>抱歉，在目前對話的裝置上不支援搜尋「行動測站」</s><s>請試著提問來查詢縣市列表</s></p></speak>`); }

					var mobile_list = {};
					//console.log("mobile_array"+mobile_array)
					for (i = 0; i < mobile_array.length; i++) {
						var num = station_array.indexOf(mobile_array[i]);
						if (num !== -1) {
							var aqi_temp = AQI_list[parseInt(num)];
							var pic_url =functions_fetch.picture_generator(parseInt(aqi_temp));
							var status_temp =functions_fetch.status_generator(parseInt(aqi_temp));

							mobile_list[mobile_array[i]] = {
								title: mobile_array[i],
								description: status_temp,
								image: new Image({ url: pic_url, alt: 'Image alternate text', }),
							}
						}
					}
					conv.ask(new Carousel({
						title: 'Carousel Title',
						items: mobile_list,
					}));

				}
			}
			else if (input_array.indexOf(option) !== -1) {

				if (conv.screen) {
					conv.ask(new SimpleResponse({
						speech: `<speak><p><s>以下是${option}的監測站列表!<break time="0.5s"/>請查看</s></p></speak>`,
						text: '以下是「' + option + '」的測站列表'
					}));
				}
				else { conv.ask(new SimpleResponse(`<speak><p><s>以下是${option}的監測站列表</s><s>選項有以下幾個<break time="0.5s"/>${replaceString(option_list[option], ',', '<break time="0.25s"/>')}<break time="1s"/>請選擇。</s></p></speak>`)); }


				var the_array = option_list[option].split('、');
				var county_list = {};

				for (i = 0; i < the_array.length; i++) {
					var num = station_array.indexOf(the_array[i]);
					var aqi_temp = AQI_list[parseInt(num)];
					var pic_url =functions_fetch.picture_generator(parseInt(aqi_temp));
					var status_temp =functions_fetch.status_generator(parseInt(aqi_temp));

					county_list[the_array[i]] = {
						title: the_array[i],
						description: status_temp,
						image: new Image({ url: pic_url, alt: 'Image alternate text', }),
					}
				}

				if (mobile_display[option] !== undefined) {

					the_array = mobile_display[option];
					//console.log(the_array)
					for (i = 0; i < the_array.length; i++) {
						var num = station_array.indexOf(the_array[i]);
						if (num !== -1) {
							var aqi_temp = AQI_list[parseInt(num)];
							var pic_url =functions_fetch.picture_generator(parseInt(aqi_temp));
							var status_temp =functions_fetch.status_generator(parseInt(aqi_temp));
							var select_title = the_array[i];
							select_title = select_title.split('(')[1];
							select_title = replaceString(select_title, ')', '');

							county_list[the_array[i]] = {
								title: select_title + " (行動站)",
								description: status_temp,
								image: new Image({ url: pic_url, alt: 'Image alternate text', }),
							}
						}
					}
				}

				conv.ask(new Carousel({
					title: 'Carousel Title',
					items: county_list,
				}));

				if (suggest_list[option] !== undefined) { conv.ask(new Suggestions('查看' + suggest_list[option])); }

			}
			else if (station_array.indexOf(option) !== -1) {

				indexnumber = station_array.indexOf(option); //取得監測站對應的編號	
				AQI = AQI_list[parseInt(indexnumber)]; Pollutant = Pollutant_list[parseInt(indexnumber)];
				PM10 = PM10_list[parseInt(indexnumber)];
				PM25 = PM25_list[parseInt(indexnumber)];
				O3 = O3_list[parseInt(indexnumber)];
				Status =functions_fetch.status_generator(parseInt(AQI));

				if (Status !== "有效數據不足") {
					
					picture=functions_fetch.big_picture_generator(AQI);
					info=functions_fetch.info_generator(AQI);
					info_output=functions_fetch.info_output_generator(AQI);

					if (mobile_array.indexOf(option) === -1) { conv.ask(new Suggestions('把它加入日常安排')); }

					if (option.indexOf('(') !== -1) {
						option = option.split('(')[1];
						option = replaceString(option, ')', '');
					}
					if (AQI >= 0 && AQI <= 50) {
						conv.ask(new SimpleResponse({
							speech: `<speak><p><s>根據最新資料顯示，${option}監測站的AQI指數為${AQI}</s><s>您可放心出外活動!</s></p></speak>`,
							text: '以下為該監測站的詳細資訊，\n您可放心出外活動!'
						}));
					}
					else if (AQI > 50) {
						conv.ask(new SimpleResponse({
							speech: `<speak><p><s>根據最新資料顯示，${option}監測站的AQI指數為${AQI}</s><s>主要汙染源來自${replaceString(Pollutant, '八小時', '')}</s><s>${info}</s></p></speak>`,
							text: '以下為該監測站的詳細資訊'
						}));
					}

					output_title = Status;
					if (AQI > 50) {
						if (Pollutant === "臭氧八小時") { Pollutant = "臭氧 (O₃)"; }
						else if (Pollutant === "細懸浮微粒") { Pollutant = "細懸浮微粒(PM₂.₅)"; }
						else if (Pollutant === "懸浮微粒") { Pollutant = "懸浮微粒(PM₁₀)"; }
						output_title = output_title + ' • ' + Pollutant;
					}

					if (conv.screen) {
						conv.ask(new BasicCard({
							image: new Image({ url: picture, alt: 'Pictures', }), display: 'CROPPED',
							title: option,
							subtitle: output_title,
							text: info_output + '  \n  \nPM₁₀ ' + PM10 + '(μg/m³) • PM₂.₅ ' + PM25 + '(μg/m³) • 臭氧 ' + O3 + '(ppb)  \n**測站資訊發布時間** • ' + functions_fetch.FormatTime(),
						}));

					} else { conv.close(`<speak><p><s>歡迎你隨時回來查詢，下次見</s></p></speak>`); }
				} else {
					conv.ask(new SimpleResponse({
						speech: `<speak><p><s>由於${option}監測站正處於維修狀態或數據不足。我無法提供你最新資訊。</s></p></speak>`,
						text: '以下為「' + option + '」監測站的詳細資訊'
					})); if (conv.screen) {
						conv.ask(new BasicCard({
							image: new Image({ url: "https://dummyimage.com/1037x539/232830/ffffff.png&text=NaN", alt: 'Pictures', }),
							title: '有效數據不足',
							text: '設備維護、儀器校正、儀器異常、傳輸異常、電力異常 \n或有效數據不足等需查修維護情形，以致資料暫時中斷服務。  \n  \nPM₁₀ ' + PM10 + '(μg/m³) • PM₂.₅ ' + PM25 + '(μg/m³) • 臭氧 ' + O3 + '(ppb)  \n**測站資訊發布時間** • ' + functions_fetch.FormatTime(),
							display: 'CROPPED',
						}));
						conv.ask(new Suggestions('把它加入日常安排'));
					} else { conv.close(`<speak><p><s>歡迎你隨時回來查詢，下次見</s></p></speak>`); }

				}
			}
			else if (origin_station_array.indexOf(option) !== -1) {
				conv.ask(new SimpleResponse({
					speech: `<speak><p><s>由於${option}監測站正處於維修狀態或數據不足。我無法提供你最新資訊。</s></p></speak>`,
					text: '以下為「' + option + '」監測站的詳細資訊'
				})); if (conv.screen) {
					conv.ask(new BasicCard({
						image: new Image({ url: "https://dummyimage.com/1037x539/232830/ffffff.png&text=NaN", alt: 'Pictures', }),
						title: '有效數據不足',
						text: '設備維護、儀器校正、儀器異常、傳輸異常、電力異常 \n或有效數據不足等需查修維護情形，以致資料暫時中斷服務。  \n  \n**測站資訊發布時間** • ' + functions_fetch.FormatTime(),
						display: 'CROPPED',
					}));
					conv.ask(new Suggestions('把它加入日常安排'));
				} else { conv.close(`<speak><p><s>歡迎你隨時回來查詢，下次見</s></p></speak>`); }
			}
			else if (option === "🌎 最近的測站") {
				conv.contexts.set(AppContexts.LOCATION, 1);
				conv.data.requestedPermission = 'DEVICE_PRECISE_LOCATION';
				return conv.ask(new Permission({
					context: "在繼續操作前，建議你開啟裝置上的GPS功能來取得精確結果。接著，為了找到最近的測站位置",
					permissions: conv.data.requestedPermission,
				}));

				conv.ask(new Permission(options));

			}
			else {
				word1 = county_array[parseInt(Math.random() * 19)]; word2 = county_array[20 + parseInt(Math.random() * 28)];
				option = "undefined";

				if (conv.input.type === "VOICE") { //如果輸入是語音，則顯示錯誤處理方法
					conv.ask(new SimpleResponse({
						speech: `<speak><p><s>抱歉，我不懂你的意思</s><s>請試著問我<break time="0.2s"/>${word1}空氣品質如何?<break time="0.2s"/>或<break time="0.2s"/>幫我查詢${word2}</s></p></speak>`,
						text: '試著提問來快速存取縣市列表，\n或點選建議卡片來進行操作!'
					}));
					if (conv.screen) {
						conv.ask(new BasicCard({
							title: "語音查詢範例",
							subtitle: "以下是你可以嘗試的指令",
							text: " • *「" + word1 + "空氣品質如何?」*  \n • *「幫我查詢" + word2 + "」*  \n • *「我想知道" + county_array[parseInt(Math.random() * 48)] + "狀況怎樣」*  \n • *「幫我找" + county_array[parseInt(Math.random() * 48)] + "」*  \n • *「我想看" + county_array[parseInt(Math.random() * 48)] + "」*  \n • *「" + county_array[parseInt(Math.random() * 48)] + "空氣好嗎?」*  \n • *「我要查" + county_array[parseInt(Math.random() * 48)] + "」*",
						}));
						conv.ask(new Suggestions(word1 + "空氣品質如何?", "幫我查詢" + word2));
					}
					else { conv.ask(`<speak><p><s>或對我說<break time="0.2s"/>區域查詢<break time="0.2s"/>來進行操作</s></p></speak>`); }

				} else { conv.ask('抱歉，我不懂你的意思，\n請點選建議卡片來進行操作。'); }
				conv.ask(new Suggestions(eicon[parseInt(Math.random() * 2)] + '最近的測站'));
			}

			if (conv.screen) {
				conv.ask(new Suggestions('回主頁面', '👋 掰掰'));
			}
			conv.user.storage.choose_station = option;
			conv.data.choose_station = option;

		}).catch(function (error) {
			conv.ask(new SimpleResponse({
				speech: `<speak><p><s>抱歉，獲取資料發生錯誤</s><s>請重新查詢</s></p></speak>`,
				text: '請輕觸下方卡片來選擇查詢區域!'
			}));
			console.log(error)
			conv.contexts.set(SelectContexts.parameter, 5);
			conv.ask(new Carousel({
				title: 'Carousel Title',
				items: county_options,
			}));
			conv.ask(new Suggestions(eicon[parseInt(Math.random() * 2)] + '最近的測站', '語音查詢範例', '今天的數值預報', '風向對空污的影響', '污染物影響要素', '👋 掰掰'));

		});
});

app.intent('Default Fallback Intent', (conv) => {
	word1 = county_array[parseInt(Math.random() * 19)]; word2 = county_array[20 + parseInt(Math.random() * 28)];

	if (conv.input.type === "VOICE") { //如果輸入是語音，則顯示錯誤處理方法
		conv.ask(new SimpleResponse({
			speech: `<speak><p><s>抱歉，我不懂你的意思</s><s>請試著問我<break time="0.2s"/>${word1}空氣品質如何?<break time="0.2s"/>或<break time="0.2s"/>幫我查詢${word2}</s></p></speak>`,
			text: '試著提問來快速存取縣市列表，\n或點選建議卡片來進行操作!'
		}));
		if (conv.screen) {
			conv.ask(new BasicCard({
				title: "語音查詢範例",
				subtitle: "以下是你可以嘗試的指令",
				text: " • *「" + word1 + "空氣品質如何?」*  \n • *「幫我查詢" + word2 + "」*  \n • *「我想知道" + county_array[parseInt(Math.random() * 48)] + "狀況怎樣」*  \n • *「幫我找" + county_array[parseInt(Math.random() * 48)] + "」*  \n • *「我想看" + county_array[parseInt(Math.random() * 48)] + "」*  \n • *「" + county_array[parseInt(Math.random() * 48)] + "空氣好嗎?」*  \n • *「我要查" + county_array[parseInt(Math.random() * 48)] + "」*",
			}));
			conv.ask(new Suggestions(word1 + '空氣品質如何?', '幫我查詢' + word2));
		}

		conv.noInputs = [`<speak><p><s>請試著再問一次</s><s>例如<break time="0.2s"/>${word1}空氣品質如何?`, "請試著問我要查詢的縣市", "很抱歉，我幫不上忙"];

	} else {
		conv.ask('抱歉，我不懂你的意思，\n請點選建議卡片來進行操作。');
	}
	conv.ask(new Suggestions(eicon[parseInt(Math.random() * 2)] + '最近的測站', '🔎依區域查詢', '👋 掰掰'));

});

app.intent('語音指令範例', (conv) => {
	word1 = county_array[parseInt(Math.random() * 19)]; word2 = county_array[20 + parseInt(Math.random() * 28)]; word3 = county_array[parseInt(Math.random() * 48)];

	conv.ask(new SimpleResponse({
		speech: `<speak><p><s>在任意畫面中，你隨時都能快速查詢縣市列表</s><s>你可以試著問<break time="0.2s"/>${word1}空氣品質如何?<break time="0.2s"/>或<break time="0.2s"/>幫我查詢${word2}</s></p></speak>`,
		text: '試著提問來快速存取縣市列表，\n以下是你可以嘗試的詢問方式!'
	})); conv.ask(new BasicCard({
		title: "語音查詢範例",
		subtitle: "以下是你可以嘗試的指令",
		text: " • *「" + word1 + "空氣品質如何?」*  \n • *「幫我查詢" + word2 + "」*  \n • *「我想知道" + word3 + "狀況怎樣」*  \n • *「幫我找" + county_array[parseInt(Math.random() * 48)] + "」*  \n • *「我想看" + county_array[parseInt(Math.random() * 48)] + "」*  \n • *「" + county_array[parseInt(Math.random() * 48)] + "空氣好嗎?」*  \n • *「我要查" + county_array[parseInt(Math.random() * 48)] + "」*",
	}));
	conv.ask(new Suggestions(word1 + '空氣品質如何?', '幫我查詢' + word2, '我想知道' + word3 + '狀況怎樣', eicon[parseInt(Math.random() * 2)] + '最近的測站', '🔎依區域查詢', '👋 掰掰'));

});

app.intent('直接查詢', (conv, { station }) => {

	return new Promise(
		function (resolve, reject) {
			database.ref('/TWair').on('value', e => { resolve(e.val()); });
		}).then(function (final_data) {

			Pollutant_list = final_data.Pollutant;
			AQI_list = final_data.AQI;
			PM10_list = final_data.PM10;
			PM25_list = final_data.PM25;
			O3_list = final_data.O3;
			station_array = final_data.SiteName;

			if (indexnumber = station_array.indexOf(station) === -1) {

				conv.ask(new SimpleResponse({
					speech: `<speak><p><s>抱歉，您欲查詢的監測站似乎不存在，我無法提供你最新資訊。</s></p></speak>`,
					text: '抱歉，我無法提供協助'
				}));
				conv.close(new BasicCard({
					image: new Image({ url: "https://dummyimage.com/1037x539/232830/ffffff.png&text=NaN", alt: 'Pictures', }),
					title: '找不到您指定的測站',
					subtitle: '請確認輸入的測站是否有誤', display: 'CROPPED',
				}));
			}
			else {
				if ((typeof AQI_list[0] === "undefined") !== true) {
					indexnumber = station_array.indexOf(station); //取得監測站對應的編號

					AQI = AQI_list[parseInt(indexnumber)];
					Pollutant = Pollutant_list[parseInt(indexnumber)];
					Status =functions_fetch.status_generator(parseInt(AQI));
					PM10 = PM10_list[parseInt(indexnumber)];
					PM25 = PM25_list[parseInt(indexnumber)];
					O3 = O3_list[parseInt(indexnumber)];

					if (Status !== "有效數據不足") {
						picture=functions_fetch.big_picture_generator(AQI);
						info=functions_fetch.info_generator(AQI);
						info_output=functions_fetch.info_output_generator(AQI);

						if (AQI >= 0 && AQI <= 50) {
							conv.ask(new SimpleResponse({
								speech: `<speak><p><s>根據最新資料顯示，${station}監測站的AQI指數為${AQI}</s><s>您可放心出外活動!</s></p></speak>`,
								text: '以下為該監測站的詳細資訊，\n您可放心出外活動!'
							}));
						}
						else if (AQI > 50) {
							conv.ask(new SimpleResponse({
								speech: `<speak><p><s>根據最新資料顯示，${station}監測站的AQI指數為${AQI}</s><s>主要汙染源來自${replaceString(Pollutant, '八小時', '')}</s><s>${info}</s></p></speak>`,
								text: '以下為該監測站的詳細資訊'
							}));
						}

						output_title = Status;
						if (AQI > 50) {
							if (Pollutant === "臭氧八小時") { Pollutant = "臭氧 (O₃)"; }
							else if (Pollutant === "細懸浮微粒") { Pollutant = "細懸浮微粒(PM₂.₅)"; }
							else if (Pollutant === "懸浮微粒") { Pollutant = "懸浮微粒(PM₁₀)"; }
							output_title = output_title + ' • ' + Pollutant;
						}

						conv.close(new BasicCard({
							image: new Image({ url: picture, alt: 'Pictures', }), display: 'CROPPED',
							title: station,
							subtitle: output_title,
							text: info_output + '  \n  \nPM₁₀ ' + PM10 + '(μg/m³) • PM₂.₅ ' + PM25 + '(μg/m³) • 臭氧 ' + O3 + '(ppb)  \n**測站資訊發布時間** • ' + functions_fetch.FormatTime(),
						}));

					}
					else {
						conv.ask(new SimpleResponse({
							speech: `<speak><p><s>由於${station}監測站數據不足或處於維修狀態，我無法提供你最新資訊。</s></p></speak>`,
							text: '以下為「' + station + '」監測站的詳細資訊'
						})); conv.close(new BasicCard({
							image: new Image({ url: "https://dummyimage.com/1037x539/232830/ffffff.png&text=NaN", alt: 'Pictures', }),
							title: '有效數據不足',
							title: '有效數據不足',
							text: '設備維護、儀器校正、儀器異常、傳輸異常、電力異常 \n或有效數據不足等需查修維護情形，以致資料暫時中斷服務。  \n  \nPM₁₀ ' + PM10 + '(μg/m³) • PM₂.₅ ' + PM25 + '(μg/m³) • 臭氧 ' + O3 + '(ppb)  \n**測站資訊發布時間** • ' + functions_fetch.FormatTime(),
							display: 'CROPPED',
						}));
					}
				} else {
					conv.ask(new SimpleResponse({
						speech: `<speak><p><s>糟糕，查詢似乎發生錯誤。請稍後再試。</s></p></speak>`,
						text: '發生錯誤，請稍後再試一次。'
					}));
					conv.close(new BasicCard({
						image: new Image({ url: "https://dummyimage.com/1037x539/ef2121/ffffff.png&text=錯誤", alt: 'Pictures', }),
						title: '數據加載發生問題',
						subtitle: '請過一段時間後再回來查看', display: 'CROPPED',
					}));
				}
			}
		}).catch(function (error) {
			conv.ask(new SimpleResponse({
				speech: `<speak><p><s>糟糕，查詢似乎發生錯誤。請稍後再試。</s></p></speak>`,
				text: '發生錯誤，請稍後再試一次。'
			}));
			conv.close(new BasicCard({
				image: new Image({ url: "https://dummyimage.com/1037x539/ef2121/ffffff.png&text=錯誤", alt: 'Pictures', }),
				title: '數據加載發生問題',
				subtitle: '請過一段時間後再回來查看', display: 'CROPPED',
			}));
		});

});

app.intent('日常安排教學', (conv, { station }) => {

	if (station !== "") { choose_station = station; }
	else { choose_station = conv.user.storage.choose_station; }
	if (station_explain.indexOf(choose_station) === -1) { choose_station = station_explain[parseInt(Math.random() * 81)]; }
	conv.ask(new SimpleResponse({
		speech: `<speak><p><s>透過加入日常安排，你可以快速存取要查詢的站點。</s><s>舉例來說，如果你把${choose_station}加入日常安排。你即可隨時呼叫我查詢該站點的最新空氣品質!</s><s>以下為詳細說明</s></p></speak>`,
		text: '以下為詳細說明'
	}));

	conv.ask(new BasicCard({
		image: new Image({ url: "https://i.imgur.com/82c8u4T.png", alt: 'Pictures', }),
		title: '將「' + choose_station + '」加入日常安排', display: 'CROPPED',
		subtitle: '1.點擊畫面右上方大頭貼 > 點擊[設定]\n2.切換到[Google助理]分頁 > 點擊[日常安排]\n3.點擊[新增日常安排]\n4.「新增指令(必填)」輸入「空氣品質」\n5.「新增動作」輸入\n「叫空汙查詢精靈查詢' + choose_station + '站」\n6.輸入完成後點擊「儲存」\n7.現在，你可以透過說出或輸入「空氣品質」來快速查詢' + choose_station + '的AQI指數!',
	}));

	conv.ask(new Suggestions(eicon[parseInt(Math.random() * 2)] + '最近的測站', '回主頁面', '👋 掰掰'));

});

app.intent('從風向看空氣品質', (conv, { Wind_direction }) => {
	var explation = "";

	if (conv.input.raw.indexOf('背風面') !== -1) { Wind_direction = "背風面"; }
	else if (conv.input.raw.indexOf('下風處') !== -1) { Wind_direction = "下風處"; }
	else if (conv.input.raw.indexOf('弱風環境') !== -1) { Wind_direction = "弱風環境"; }
	else if (conv.input.raw.indexOf('背風渦旋') !== -1) { Wind_direction = "背風渦旋"; }

	if (direction_array.indexOf(Wind_direction) !== -1) {

		explation = explain_list[Wind_direction][0];
		picture = explain_list[Wind_direction][1];

		conv.ask(new SimpleResponse({
			speech: `<speak><p><s>以下是環保署對${Wind_direction}與空氣品質關聯性的說明</s><break time="1s"/><s>${replaceString(explation, '\n', '')}</s></p></speak>`,
			text: '以下是環保署的解說'
		}));
		conv.ask(new BasicCard({
			image: new Image({ url: picture, alt: 'Pictures', }),
			title: Wind_direction, display: 'CROPPED',
			subtitle: explation,
			text: "Ⓒ 圖文資訊來自 行政院環境保護署 **《空品小百科》**"
		}));

		conv.ask(new Suggestions('說明其他風向', eicon[parseInt(Math.random() * 2)] + '最近的測站', '回主頁面', '👋 掰掰'));

	}
	else {
		conv.ask(new SimpleResponse({
			speech: `<speak><p><s>請選擇您要我解釋的風向因素類別，共有以下九類</s><s>點擊建議卡片來取得說明</s></p></speak>`, text: '請選擇要我解釋的因素類別'
		}));
		conv.ask(new BasicCard({
			title: "從風向看空氣品質",
			subtitle: "不同季節吹著相異的盛行風，\n在擁有複雜地形的臺灣易受到地形的阻擋。\n從而影響每天臺灣各地的空氣品質!",
			text: "Ⓒ 圖文資訊來自 行政院環境保護署 **《空品小百科》**",
			buttons: new Button({ title: '空品小百科', url: 'https://airtw.epa.gov.tw/CHT/Encyclopedia/pedia02/pedia2.aspx', }),
		}));
		conv.ask(new Suggestions('東北風', '偏東風', '偏南風', '西南風', '偏西風', '背風面', '下風處', '弱風環境', '背風渦旋'));
	}

});

app.intent('污染物特性及影響要素', (conv, { Pollutant_type }) => {

	var explation = "";
	if (pollutant_array.indexOf(Pollutant_type) !== -1) {

		explation = explain_list[Pollutant_type][0];
		picture = explain_list[Pollutant_type][1];

		conv.ask(new SimpleResponse({
			speech: `<speak><p><s>以下是環保署對${Pollutant_type}與空氣品質關聯性的說明</s><break time="1s"/><s>${replaceString(explation, '\n', '')}</s></p></speak>`,
			text: '以下是環保署的解說'
		}));
		conv.ask(new BasicCard({
			image: new Image({ url: picture, alt: 'Pictures', }),
			title: Pollutant_type, display: 'CROPPED',
			subtitle: explation,
			text: "Ⓒ 圖文資訊來自 行政院環境保護署 **《空品小百科》**"
		}));

		conv.ask(new Suggestions('說明其他汙染因素', eicon[parseInt(Math.random() * 2)] + '最近的測站', '🔎依區域查詢', '👋 掰掰'));

	}
	else {
		conv.ask(new SimpleResponse({
			speech: `<speak><p><s>請選擇您要我解釋的影響因素類別，共有以下六種</s><s>點擊建議卡片來取得說明</s></p></speak>`, text: '請選擇要我解釋的影響因素類別'
		}));
		conv.ask(new BasicCard({
			title: "污染物特性及影響要素",
			subtitle: "污染物分為一次性及衍生性污染物，\n除了污染源直接排放外，特定條件下易引發污染物濃度上升，\n而這些特定條件與各種氣象要素又有密切關連!",
			text: "Ⓒ 圖文資訊來自 行政院環境保護署 **《空品小百科》**",
			buttons: new Button({ title: '空品小百科', url: 'https://airtw.epa.gov.tw/CHT/Encyclopedia/pedia03/pedia3.aspx', }),
		}));
		conv.ask(new Suggestions('河川揚塵', '光化反應', '境外汙染', '降雨洗除作用', '混合層高度', '沉降作用'));
	}

});

app.intent('取得地點權限', (conv) => {

	conv.data.requestedPermission = 'DEVICE_PRECISE_LOCATION';

	database.ref('/TWair').on('value', e => {
		Pollutant_list = e.val().Pollutant;
		AQI_list = e.val().AQI;
		PM10_list = e.val().PM10;
		PM25_list = e.val().PM25;
		O3_list = e.val().O3;
		station_array = e.val().SiteName;
	});

	return conv.ask(new Permission({
		context: "在繼續操作前，建議你開啟裝置上的GPS功能來取得精確結果。接著，為了找到最近的測站位置",
		permissions: conv.data.requestedPermission,
	}));

	conv.ask(new Permission(options));

});

app.intent('回傳資訊', (conv, params, permissionGranted) => {
	if (permissionGranted) {
		const {
			requestedPermission
		} = conv.data;
		if (requestedPermission === 'DEVICE_PRECISE_LOCATION') {

			const coordinates = conv.device.location.coordinates;
			// const city=conv.device.location.city;

			conv.ask(new Suggestions('重新定位'));
			if (coordinates) {
				const myLocation = {
					lat: coordinates.latitude,
					lng: coordinates.longitude
				};
				sitename = (findNearestLocation(myLocation, locations)).location.Sitename; //透過模組找到最近的測站

				conv.ask(new SimpleResponse({ speech: `<speak><p><s>查詢完成!</s><s>距離你最近的測站是<break time="0.2s"/>${sitename}。</s></p></speak>`, text: '最近的測站是「' + sitename + '」!' }));

				if ((typeof AQI_list[0] === "undefined") !== true) {
					indexnumber = station_array.indexOf(sitename); //取得監測站對應的編號

					AQI = AQI_list[parseInt(indexnumber)];
					Pollutant = Pollutant_list[parseInt(indexnumber)];
					PM10 = PM10_list[parseInt(indexnumber)];
					PM25 = PM25_list[parseInt(indexnumber)];
					O3 = O3_list[parseInt(indexnumber)];
					Status =functions_fetch.status_generator(parseInt(AQI));

					if (Status !== "有效數據不足") {
						picture=functions_fetch.big_picture_generator(AQI);
						info=functions_fetch.info_generator(AQI);
						info_output=functions_fetch.info_output_generator(AQI);

						if (AQI >= 0 && AQI <= 50) {
							conv.ask(new SimpleResponse({
								speech: `<speak><p><s>根據最新資料顯示，${sitename}監測站的AQI指數為${AQI}</s><s>您可放心出外活動!</s></p></speak>`,
								text: '以下為該監測站的詳細資訊，\n您可放心出外活動!'
							}));
						}
						else if (AQI > 50) {
							conv.ask(new SimpleResponse({
								speech: `<speak><p><s>根據最新資料顯示，${sitename}監測站的AQI指數為${AQI}</s><s>主要汙染源來自${replaceString(Pollutant, '八小時', '')}</s><s>${info}</s></p></speak>`,
								text: '以下為該監測站的詳細資訊'
							}));
						}

						output_title = Status;
						if (AQI > 50) {
							if (Pollutant === "臭氧八小時") { Pollutant = "臭氧 (O₃)"; }
							else if (Pollutant === "細懸浮微粒") { Pollutant = "細懸浮微粒(PM₂.₅)"; }
							else if (Pollutant === "懸浮微粒") { Pollutant = "懸浮微粒(PM₁₀)"; }
							output_title = output_title + ' • ' + Pollutant;
						}

						if (conv.screen) {

							conv.ask(new BasicCard({
								image: new Image({ url: picture, alt: 'Pictures', }), display: 'CROPPED',
								title: sitename,
								subtitle: output_title,
								text: info_output + '  \n  \nPM₁₀ ' + PM10 + '(μg/m³) • PM₂.₅ ' + PM25 + '(μg/m³) • 臭氧 ' + O3 + '(ppb)  \n**測站資訊發布時間** • ' + functions_fetch.FormatTime(),
							}));

							conv.ask(new Suggestions('把它加入日常安排'));
						} else { conv.close(`<speak><p><s>歡迎你隨時回來查詢，下次見</s></p></speak>`); }
					}

					else {
						conv.ask(new SimpleResponse({
							speech: `<speak><p><s>由於${sitename}監測站數據不足或處於維修狀態，我無法提供你最新資訊。</s></p></speak>`,
							text: '以下為「' + sitename + '」監測站的詳細資訊'
						}));
						conv.ask(new BasicCard({
							image: new Image({ url: "https://dummyimage.com/1037x539/232830/ffffff.png&text=NaN", alt: 'Pictures', }),
							title: '有效數據不足',
							text: '設備維護、儀器校正、儀器異常、傳輸異常、電力異常 \n或有效數據不足等需查修維護情形，以致資料暫時中斷服務。  \n  \nPM₁₀ ' + PM10 + '(μg/m³) • PM₂.₅ ' + PM25 + '(μg/m³) • 臭氧 ' + O3 + '(ppb)  \n**測站資訊發布時間** • ' + functions_fetch.FormatTime(),
							display: 'CROPPED',
						}));
					}
				} else {
					conv.ask(new SimpleResponse({
						speech: `<speak><p><s>糟糕，查詢似乎發生錯誤。</s><s>請稍後再試。</s></p></speak>`,
						text: '發生錯誤，請稍後再試一次。'
					}));
					conv.ask(new BasicCard({
						image: new Image({ url: "https://dummyimage.com/1037x539/ef2121/ffffff.png&text=錯誤", alt: 'Pictures', }),
						title: '數據加載發生問題',
						subtitle: '請過一段時間後再回來查看', display: 'CROPPED',
					}));
				}
			} else {
				// Note: Currently, precise locaton only returns lat/lng coordinates on phones and lat/lng coordinates
				// and a geocoded address on voice-activated speakers.
				// Coarse location only works on voice-activated speakers.
				conv.ask(new SimpleResponse({ speech: `<speak><p><s>糟糕，我無法得知你的目前位置。</s><s>請稍後再試。</s></p></speak>`, text: "發生錯誤，請開啟GPS功能然後再試一次。" }));
			}

		}
	} else {
		conv.ask(new SimpleResponse({ speech: `<speak><p><s>很抱歉，由於未取得你的授權因此查詢失敗。</s><s>不過你隨時可以回來再試一次。</s></p></speak>`, text: "發生錯誤，未取得你的授權。" }));
	}
	if (conv.screen) { conv.ask(new Suggestions('回主頁面', '👋 掰掰')); } else { conv.close(`<speak><p><s>歡迎你隨時回來查詢，下次見</s></p></speak>`); }
	conv.user.storage.choose_station = sitename;

});

app.intent('直接查詢縣市選單', (conv, { County }) => {

	return new Promise(
		function (resolve, reject) {
			database.ref('/TWair').on('value', e => { resolve(e.val()); });
		}).then(function (final_data) {

			Pollutant_list = final_data.Pollutant;
			AQI_list = final_data.AQI;
			PM10_list = final_data.PM10;
			PM25_list = final_data.PM25;
			O3_list = final_data.O3;
			station_array = final_data.SiteName;

			conv.noInputs = ["抱歉，我沒聽輕楚。請再問一次", "請試著問我要查詢的縣市列表，例如、" + county_array[parseInt(Math.random() * 48)] + "空氣品質如何?", "很抱歉，我幫不上忙"];

			if (conv.input.raw.indexOf('新北') !== -1) { County = "新北市"; }
			else if (conv.input.raw.indexOf('第一部分') !== -1 || conv.input.raw.indexOf('一部分') !== -1) { County = "新北市第一部分"; }
			else if (conv.input.raw.indexOf('第二部分') !== -1) { County = "新北市第二部分"; }
			else if (conv.input.raw.indexOf('北高雄') !== -1) { County = "北高雄"; }
			else if (conv.input.raw.indexOf('南高雄') !== -1) { County = "南高雄"; }
			else if (conv.input.raw === "台東") { County = "臺東"; }

			if (conv.input.raw === "新北(樹林)") { County = "新北(樹林)"; }
			else if (conv.input.raw === "桃園(觀音工業區)") { County = "桃園(觀音工業區)"; }
			else if (conv.input.raw === "彰化(大城)") { County = "彰化(大城)"; }
			else if (conv.input.raw === "臺南(麻豆)") { County = "臺南(麻豆)"; }
			else if (conv.input.raw === "高雄(楠梓)") { County = "高雄(楠梓)"; }
			else if (conv.input.raw === "高雄(左營)") { County = "高雄(左營)"; }
			else if (conv.input.raw === "屏東(琉球)") { County = "屏東(琉球)"; }

			conv.noInputs = ["抱歉，我沒聽輕楚。請再說一次", "請再說一次要查看測站名稱", "很抱歉，我幫不上忙"];

			if (["新北市", "高雄市"].indexOf(County) !== -1) {
				conv.ask(new SimpleResponse({
					speech: `<speak><p><s>由於${County}的測站數目較多，分為兩部份顯示，請選擇</s></p></speak>`,
					text: '「' + County + '」監測站數量較多，\n分為兩部份顯示。'
				}));
				conv.contexts.set(SelectContexts.parameter, 5);

				if (County === "新北市") {

					conv.ask(new Carousel({
						title: 'Carousel Title',
						items: {
							'新北市第一部分': {
								title: '新北市(一)',
								synonyms: ['新北', '三重', '土城', '永和', '汐止', '板橋', '林口'],
								description: '三重、土城、永和  \n汐止、板橋、林口',
							},
							'新北市第二部分': {
								synonyms: ['新北', '淡水', '富貴角', '菜寮', '新店', '新莊', '萬里'],
								title: '新北市(二)',
								description: '淡水、富貴角、菜寮  \n新店、新莊、萬里',
							},
						},
					}));
				}
				else if (County === "高雄市") {
					conv.ask(new Carousel({
						title: 'Carousel Title',
						items: {
							'北高雄': {
								synonyms: ['北高雄', '美濃', '橋頭', '楠梓', '仁武', '左營', '前金',],
								title: '北高雄',
								description: '美濃、橋頭、楠梓  \n仁武、左營、前金',
							},
							'南高雄': {
								synonyms: ['南高雄', '鳳山', '復興', '前鎮', '小港', '大寮', '林園',],
								title: '南高雄',
								description: '鳳山、復興、前鎮  \n小港、大寮、林園',
							},
						},
					}));
				}
				if (County !== "undefined") { conv.ask(new Suggestions('回主頁面')); }
				conv.ask(new Suggestions('👋 掰掰'));

			}
			else if (request_array.indexOf(County) !== -1) {

				conv.contexts.set(SelectContexts.parameter, 5);

				if (conv.screen) {
					conv.ask(new SimpleResponse({
						speech: `<speak><p><s>以下是${County}的監測站列表!<break time="0.5s"/>請查看</s></p></speak>`,
						text: '以下是「' + County + '」的測站列表'
					}));
				}
				else { conv.ask(new SimpleResponse(`<speak><p><s>以下是${County}的監測站列表</s><s>選項有以下幾個<break time="0.5s"/>${replaceString(option_list[County], '、', '<break time="0.25s"/>')}<break time="1s"/>請選擇。</s></p></speak>`)); }

				var the_array = option_list[County].split('、');
				var county_list = {};

				for (i = 0; i < the_array.length; i++) {
					var num = station_array.indexOf(the_array[i]);
					var aqi_temp = AQI_list[parseInt(num)];
					var pic_url =functions_fetch.picture_generator(parseInt(aqi_temp));
					var status_temp =functions_fetch.status_generator(parseInt(aqi_temp));

					county_list[the_array[i]] = {
						title: the_array[i],
						description: status_temp,
						image: new Image({ url: pic_url, alt: 'Image alternate text', }),
					}
				}

				if (mobile_display[County] !== undefined) {

					the_array = mobile_display[County];
					//console.log(the_array)
					for (i = 0; i < the_array.length; i++) {
						var num = station_array.indexOf(the_array[i]);
						if (num !== -1) {
							var aqi_temp = AQI_list[parseInt(num)];
							var pic_url =functions_fetch.picture_generator(parseInt(aqi_temp));
							var status_temp =functions_fetch.status_generator(parseInt(aqi_temp));

							var select_title = the_array[i];
							select_title = select_title.split('(')[1];
							select_title = replaceString(select_title, ')', '');

							county_list[the_array[i]] = {
								title: select_title + " (行動站)",
								description: status_temp,
								image: new Image({ url: pic_url, alt: 'Image alternate text', }),
							}
						}
					}
				}

				conv.ask(new Carousel({
					title: 'Carousel Title',
					items: county_list,
				}));

				if (suggest_list[County] !== undefined) { conv.ask(new Suggestions('查看' + suggest_list[County])); }
				if (County !== "undefined") { conv.ask(new Suggestions('回主頁面')); }
				conv.ask(new Suggestions('👋 掰掰'));

			}
			else if (station_array.indexOf(County) !== -1) {
				indexnumber = station_array.indexOf(County); //取得監測站對應的編號

				database.ref('/TWair').on('value', e => {
					Pollutant_list = e.val().Pollutant;
					AQI_list = e.val().AQI;
					PM25_list = e.val().PM25;
					O3_list = e.val().O3;
				});

				AQI = AQI_list[parseInt(indexnumber)];
				Pollutant = Pollutant_list[parseInt(indexnumber)];
				Status =functions_fetch.status_generator(parseInt(AQI));
				PM10 = PM10_list[parseInt(indexnumber)];
				PM25 = PM25_list[parseInt(indexnumber)];
				O3 = O3_list[parseInt(indexnumber)];

				if (Status !== "有效數據不足") {
					picture=functions_fetch.big_picture_generator(AQI);
					info=functions_fetch.info_generator(AQI);
					info_output=functions_fetch.info_output_generator(AQI);


					if (AQI >= 0 && AQI <= 50) {
						conv.ask(new SimpleResponse({
							speech: `<speak><p><s>根據最新資料顯示，${County}監測站的AQI指數為${AQI}</s><s>您可放心出外活動!</s></p></speak>`,
							text: '以下為該監測站的詳細資訊，\n您可放心出外活動!'
						}));
					}
					else {
						conv.ask(new SimpleResponse({
							speech: `<speak><p><s>根據最新資料顯示，${County}監測站的AQI指數為${AQI}</s><s>主要汙染源來自${replaceString(Pollutant, '八小時', '')}</s><s>${info}</s></p></speak>`,
							text: '以下為該監測站的詳細資訊'
						}));
					}

					output_title = Status;
					if (AQI > 50) {
						if (Pollutant === "臭氧八小時") { Pollutant = "臭氧 (O₃)"; }
						else if (Pollutant === "細懸浮微粒") { Pollutant = "細懸浮微粒(PM₂.₅)"; }
						else if (Pollutant === "懸浮微粒") { Pollutant = "懸浮微粒(PM₁₀)"; }
						output_title = output_title + ' • ' + Pollutant;
					}

					if (conv.screen) {
						conv.ask(new BasicCard({
							image: new Image({ url: picture, alt: 'Pictures', }), display: 'CROPPED',
							title: County,
							subtitle: output_title,
							text: info_output + '  \n  \nPM₁₀ ' + PM10 + '(μg/m³) • PM₂.₅ ' + PM25 + '(μg/m³) • 臭氧 ' + O3 + '(ppb)  \n**測站資訊發布時間** • ' + functions_fetch.FormatTime(),
						}));
						conv.ask(new Suggestions('把它加入日常安排'));
					}
					else { conv.close(`<speak><p><s>歡迎你隨時回來查詢，下次見</s></p></speak>`); }

				} else {
					conv.ask(new SimpleResponse({
						speech: `<speak><p><s>由於${County}監測站正處於維修狀態或數據不足。我無法提供你最新資訊。</s></p></speak>`,
						text: '以下為「' + County + '」監測站的詳細資訊'
					}));

					if (conv.screen) {
						conv.ask(new BasicCard({
							image: new Image({ url: "https://dummyimage.com/1037x539/232830/ffffff.png&text=NaN", alt: 'Pictures', }),
							title: '有效數據不足',
							text: '設備維護、儀器校正、儀器異常、傳輸異常、電力異常 \n或有效數據不足等需查修維護情形，以致資料暫時中斷服務。  \n  \nPM₁₀ ' + PM10 + '(μg/m³) • PM₂.₅ ' + PM25 + '(μg/m³) • 臭氧 ' + O3 + '(ppb)  \n**測站資訊發布時間** • ' + functions_fetch.FormatTime(),
							display: 'CROPPED',
						}));
						conv.ask(new Suggestions('把它加入日常安排'));

					} else { conv.close(`<speak><p><s>歡迎你隨時回來查詢，下次見</s></p></speak>`); }

				}

				if (County !== "undefined") { conv.ask(new Suggestions('回主頁面')); }
				conv.ask(new Suggestions('👋 掰掰'));

			} else {

				County = "undefined";
				if (conv.screen) { conv.ask('我不懂你的意思，\n請輕觸下方卡片來進行區域查詢。'); }
				else {
					conv.ask(new SimpleResponse({
						speech: `<speak><p><s>我不懂你的意思，請試著透過區域查詢!</s><s>選項有以下幾個<break time="0.5s"/>北部地區<break time="0.2s"/>中部地區<break time="0.2s"/>南部地區<break time="0.2s"/>東部地區<break time="0.2s"/>離島地區<break time="1s"/>請選擇。</s></p></speak>`,
						text: '請輕觸下方卡片來選擇查詢區域!'
					}));
				}

				conv.ask(new Carousel({
					title: 'Carousel Title',
					items: county_options,
				}));
				if (conv.screen) {
					conv.ask(new Suggestions(eicon[parseInt(Math.random() * 2)] + '最近的測站'));
					if (County !== "undefined") { conv.ask(new Suggestions('回主頁面')); }
					conv.ask(new Suggestions('👋 掰掰'));
				}
			}
			conv.user.storage.choose_station = County;
			conv.data.choose_station = County;

		}).catch(function (error) {
			console.log(error)
			conv.ask(new SimpleResponse({
				speech: `<speak><p><s>糟糕，查詢似乎發生錯誤。請稍後再試。</s></p></speak>`,
				text: '發生錯誤，請稍後再試一次。'
			}));
			conv.close(new BasicCard({
				image: new Image({ url: "https://dummyimage.com/1037x539/ef2121/ffffff.png&text=錯誤", alt: 'Pictures', }),
				title: '數據加載發生問題',
				subtitle: '請過一段時間後再回來查看', display: 'CROPPED',
			}));
		});


});


app.intent('空氣品質預報', (conv, { day_select }) => {

	return new Promise(

		function (resolve, reject) {

			if (day_select === "今天") { database.ref('/TWair').on('value', e => { resolve(e.val().predict1) }); }
			else if (day_select === "明天") { database.ref('/TWair').on('value', e => { resolve(e.val().predict2) }); }
			else if (day_select === "後天") { database.ref('/TWair').on('value', e => { resolve(e.val().predict3) }); }

		}).then(function (final_data) {

			var report_content =functions_fetch.predict(final_data);

			if (day_select === "今天") { var day_title =functions_fetch.getDay(0); }
			else if (day_select === "明天") { var day_title =functions_fetch.getDay(1); }
			else { var day_title =functions_fetch.getDay(2); }

			for (i = 0; i < day_array.length; i++) { if (day_array[i] !== day_select) { conv.ask(new Suggestions(day_array[i] + '呢?')); } }

			var display_report = [];
			for (i = 0; i < area_array.length; i++) {
				if (final_data[i].AQI <= 50) { display_report.push({ cells: [area_array[i], final_data[i].AQI, "──"], dividerAfter: false, }) }
				else { display_report.push({ cells: [area_array[i], final_data[i].AQI, final_data[i].Pollutant], dividerAfter: false, }) }
			}

			conv.ask(new SimpleResponse({
				speech: `<speak><p><s>根據環保署，${day_select}各地的預報資訊如下<break time="0.5s"/>${report_content}</s></p></speak>`,
				text: "台灣" + day_select + "各地的預報如下",
			}));
			conv.ask(new Table({
				title: day_title,
				columns: [{ header: '空品區', align: 'CENTER', }, { header: 'AQI預報值', align: 'CENTER', }, { header: '指標污染物', align: 'CENTER', },],
				rows: display_report,
				buttons: new Button({
					title: '三天空品區預報',
					url: 'https://airtw.epa.gov.tw/CHT/Forecast/Forecast_3days.aspx',
				}),
			}));
			conv.ask(new Suggestions('🔎依區域查詢', '👋 掰掰'));

		}).catch(function (error) {
			conv.ask(new SimpleResponse({
				speech: `<speak><p><s>獲取資料發生錯誤，請稍後再試。</s></p></speak>`,
				text: '獲取資訊發生未知錯誤',
			}));
			console.log(error)
			conv.ask(new BasicCard({
				image: new Image({ url: 'https://dummyimage.com/1037x539/ef2121/ffffff.png&text=錯誤', alt: 'Pictures', }),
				title: "發生錯誤，請稍後再試", display: 'CROPPED',
			}));
			conv.ask(new Suggestions(eicon[parseInt(Math.random() * 2)] + '最近的測站', '🔎依區域查詢', '👋 掰掰'));

		});

});

app.intent('結束對話', (conv) => {
	conv.user.storage = {}; //離開同時清除暫存資料
	conv.ask('希望能幫到一點忙!');
	conv.ask(new SimpleResponse({ speech: '下次見', text: '下次見 👋', }));
	conv.close(new BasicCard({
		title: '感謝您的使用!',
		text: '如果有任何需要改進的地方，  \n歡迎到簡介頁面評分或給予反饋，謝謝!',
		buttons: new Button({ title: '開啟本程式的商店頁面', url: 'https://assistant.google.com/services/a/uid/000000fa049fc5e5', }),
	}));
});

// Set the DialogflowApp object to handle the HTTPS POST request.
exports.air_pullute = functions.https.onRequest(app);
