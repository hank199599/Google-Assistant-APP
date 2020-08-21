
var i = 0; 
var pre_report="";
var temp_report="";
var report_context = "";
var output_context = "";
const replaceString = require('replace-string');
var links = require('./link_convert.json');

function textindexer(input) {
	var k = 0; var j = 0;
	var indexarray = ["明德", "今明", "明顯", "明晨"];
	for (j = 0; j < indexarray.length; j++) {
		if (input.indexOf(indexarray[j]) !== -1) { k++; }
	}

	return k
}

function reduceSIZE(input) {
	input = replaceString(input, '．', '.');
	input = replaceString(input, '０', '0');
	input = replaceString(input, '１', '1');
	input = replaceString(input, '２', '2');
	input = replaceString(input, '３', '3');
	input = replaceString(input, '４', '4');
	input = replaceString(input, '５', '5');
	input = replaceString(input, '６', '6');
	input = replaceString(input, '７', '7');
	input = replaceString(input, '８', '8');
	input = replaceString(input, '９', '9');
	return input;
}

function generator(final_data,county,input){
	
				report_context = "";output_context = "";temp_report="";pre_report="";

				for (i = 1; i < final_data.length; i++) {
					
				if (county === "基隆市") {
						if (final_data[i].parameterValue.indexOf('預報總結') !== -1) {
							output_context = final_data[i + 1].parameterValue;
							report_context = output_context;
							break;
						}
					}
					else {
						report_context = report_context + final_data[i].parameterValue;
						if (output_context.length === 0 && final_data[i].parameterValue.indexOf('今') !== -1) {
							if (final_data[i].parameterValue.indexOf(')日') !== -1) { output_context = "今天" + final_data[i].parameterValue.split(')日')[1];; }
							else if (final_data[i].parameterValue.indexOf('）日') !== -1) { output_context = "今天" + final_data[i].parameterValue.split('）日')[1]; }
							else if (final_data[i].parameterValue.indexOf('日)') !== -1) { output_context = "今天" + final_data[i].parameterValue.split('日)')[1];; }
							else if (final_data[i].parameterValue.indexOf('日）') !== -1) { output_context = "今天" + final_data[i].parameterValue.split('日）')[1]; }
							else if (final_data[i].parameterValue.indexOf('今(') !== -1) { output_context = "今天" + final_data[i].parameterValue.split(')')[1]; }
							else if (final_data[i].parameterValue.indexOf('今（') !== -1) { output_context = "今天" + final_data[i].parameterValue.split('）')[1];; }
						}
						//檢測是否存在明日的預報資訊，如果存在則以明日的預報優先
						if (pre_report.length === 0 && final_data[i].parameterValue.indexOf('明') !== -1 && textindexer(final_data[i].parameterValue) === 0) {
							if (final_data[i].parameterValue.indexOf(')日') !== -1) { pre_report = "明天" + final_data[i].parameterValue.split(')日')[1];; }
							else if (final_data[i].parameterValue.indexOf('）日') !== -1) { pre_report = "明天" + final_data[i].parameterValue.split('）日')[1]; }
							else if (final_data[i].parameterValue.indexOf('日)') !== -1) { pre_report = "明天" + final_data[i].parameterValue.split('日)')[1];; }
							else if (final_data[i].parameterValue.indexOf('日）') !== -1) { pre_report = "明天" + final_data[i].parameterValue.split('日）')[1]; }
							else if (final_data[i].parameterValue.indexOf('明(') !== -1) { pre_report = "明天" + final_data[i].parameterValue.split('）')[1]; }
							else if (final_data[i].parameterValue.indexOf('明（') !== -1) { pre_report = "明天" + final_data[i].parameterValue.split(')')[1]; }
						}
						if (temp_report.length === 0) {
							if (final_data[i].parameterValue.indexOf(')日') !== -1) { temp_report = final_data[i].parameterValue.split(')日')[1];; }
							else if (final_data[i].parameterValue.indexOf('）日') !== -1) { temp_report = final_data[i].parameterValue.split('）日')[1]; }
							else if (final_data[i].parameterValue.indexOf('日)') !== -1) { temp_report = final_data[i].parameterValue.split('日)')[1];; }
							else if (final_data[i].parameterValue.indexOf('日）') !== -1) { temp_report = final_data[i].parameterValue.split('日）')[1]; }
						}

						if (final_data[i + 1] !== undefined) {
							report_context = report_context + "  \n  \n";
						}
					}
				}
				
				if (county !== "基隆市") {
					//收尾語音輸出的報告
					if (pre_report.length !== 0) { output_context = pre_report; }
					if (output_context.length === 0 && pre_report.length === 0) { output_context = temp_report; }
					//收尾文字輸出的報告格式
					report_context = reduceSIZE(report_context);
				}
				//針對特定地點的客製化輸出

				if (input.indexOf('阿里山') !== -1) {
					county = "阿里山";
					report_context = final_data[4].parameterValue;
					output_context = report_context;
				}
				else if (input.indexOf('日月潭') !== -1) {
					county = "日月潭";
					report_context = "日月潭地區" + output_context.split('日月潭地區')[1];
					output_context = report_context;
				}
				else if (input.indexOf('明德') !== -1 || input.indexOf('鯉魚潭') !== -1 || input.indexOf('雪霸') != -1) {
					var temp = final_data[4].parameterValue.split("；");
					if (input.indexOf("明德") !== -1) { county = "明德水庫"; report_context = temp[0].split('日）')[1]; }
					else if (input.indexOf("鯉魚潭") !== -1) { county = "鯉魚潭水庫"; report_context = temp[1]; }
					else if (input.indexOf("雪霸") !== -1) { county = "雪霸國家公園觀霧遊憩區"; report_context = temp[2]; }
					output_context = report_context;
				}
				else if (input.indexOf('參天') !== -1 || input.indexOf('梨山') !== -1 || input.indexOf('大雪山') != -1 || input.indexOf('臺中港') != -1 || input.indexOf('台中港') !== -1) {
					var temp = final_data[4].parameterValue.split("；");
					if (input.indexOf('參天') !== -1 || input.indexOf('梨山') !== -1) { county = "參天國家風景區"; report_context = "參天國家風景區" + temp[0].split(')')[1]; }
					else if (input.indexOf("大雪山") !== -1) { county = "大雪山國家森林遊樂區"; report_context = temp[1]; }
					else if (input.indexOf("臺中港") !== -1 || input.indexOf('台中港') !== -1) { county = "臺中港"; report_context = temp[2]; }
					output_context = report_context;
				}
				else if (input.indexOf('塔塔加') !== -1 || input.indexOf('奧萬大') !== -1 || input.indexOf('清境') != -1 || input.indexOf('惠蓀林場') != -1) {
					county = "仁愛信義山區";
					report_context = "仁愛信義山區" + (output_context.split("仁愛信義山區")[1]).split("。")[0];
					output_context = report_context;
				}
		
			return [report_context,output_context]
			
		}
		
module.exports = {generator}
		