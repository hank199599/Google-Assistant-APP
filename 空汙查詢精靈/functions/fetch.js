var area_array = ["北部", "竹苗", "中部", "雲嘉南", "高屏", "宜蘭", "花東"];
const replaceString = require('replace-string');
var weekdays = ["日","一","二","三","四","五","六"];

function picture_generator(number) {
	if (number >= 0 && number <= 50) { return "https://dummyimage.com/1933x1068/1e9165/ffffff.png&text=" + number; }
	else if (number >= 51 && number <= 100) { return "https://dummyimage.com/1933x1068/fc920b/ffffff.png&text=" + number; }
	else if (number >= 100 && number <= 150) { return "https://dummyimage.com/1933x1068/ef4621/ffffff.png&text=" + number; }
	else if (number >= 151 && number <= 199) { return "https://dummyimage.com/1933x1068/b71411/ffffff.png&text=" + number; }
	else if (number >= 200 && number <= 300) { return "https://dummyimage.com/1933x1068/5b0e31/ffffff.png&text=" + number; }
	else if (number > 301) { return "https://dummyimage.com/1933x1068/4f1770/ffffff.png&text=" + number; }
	else { return "https://dummyimage.com/1933x1068/232830/ffffff.png&text=NaN"; }
}

function big_picture_generator(number) {
	if (number >= 0 && number <= 50) { return "https://dummyimage.com/1037x539/1e9165/ffffff.png&text=" + number; }
	else if (number >= 51 && number <= 100) { return "https://dummyimage.com/1037x539/fc920b/ffffff.png&text=" + number; }
	else if (number >= 100 && number <= 150) { return "https://dummyimage.com/1037x539/ef4621/ffffff.png&text=" + number; }
	else if (number >= 151 && number <= 199) { return "https://dummyimage.com/1037x539/b71411/ffffff.png&text=" + number; }
	else if (number >= 200 && number <= 300) { return "https://dummyimage.com/1037x539/5b0e31/ffffff.png&text=" + number; }
	else if (number > 301) { return "https://dummyimage.com/1037x539/4f1770/ffffff.png&text=" + number; }
	else { return "https://dummyimage.com/1037x539/232830/ffffff.png&text=NaN"; }
}

function info_generator(number){

	if (number >= 0 && number <= 50) { return "對一般民眾身體健康無影響。"; }
	else if (number >= 51 && number <= 100) { return "可能對極敏感族群產生咳嗽或呼吸急促等症狀，但仍可正常戶外活動。"; }
	else if (number >= 101 && number <= 150) { return "若出現眼痛，咳嗽或喉嚨痛等症狀，英減少戶外活動，避免在戶外劇烈運動，敏感族群必要外出時英配戴口罩。"; }
	else if (number >= 151 && number <= 199) { return "若出現眼痛，咳嗽或喉嚨痛等症狀，英減少體力消耗及戶外活動，在戶外避免長時間劇烈運動，敏感族群建議留在室內並減少體力消耗活動，必要外出英配戴口罩。" }
	else if (number >= 200 && number <= 300) { return "對敏感族群會有明顯惡化的現象，建議留在室內並減少體力消耗活動；一般大眾則視身體狀況，可能產生眼睛不適、氣喘、咳嗽、痰多、喉痛等症狀。"; }
	else if (number > 301) { return "健康威脅達到緊急，所有人都可能受到影響。應避免戶外活動，室內應緊閉門窗，必要外出應配戴口罩等防護用具。應避免戶外活動，室內應緊閉門窗，必要外出應配戴口罩等防護用具。"; }

}

function info_output_generator(number){
	if (number >= 0 && number <= 50) { return "對一般民眾身體健康無影響。"; }
	else if (number >= 51 && number <= 100) { return "極特殊敏感族群建議注意  \n可能產生的咳嗽或呼吸急促症狀。"; }
	else if (number >= 101 && number <= 150) { return "1.一般民眾如果有不適，應考慮減少戶外活動。  \n2.學生仍可進行戶外活動，但建議減少長時間劇烈運動。  \n3.有心臟、呼吸道及心血管疾病患者、孩童及老年人，建議減少體力消耗活動及戶外活動，外出應配戴口罩。  \n4.具有氣喘的人可能需增加使用吸入劑的頻率。"; }
	else if (number >= 151 && number <= 199) { return "1.一般民眾如果有不適，應減少體力消耗及戶外活動。  \n2.學生應避免長時間劇烈運動並增加休息時間。  \n3.有心臟、呼吸道及心血管疾病患者、孩童及老年人，建議留在室內減少體力消耗活動，外出應配戴口罩。  \n4.具有氣喘的人可能需增加使用吸入劑的頻率。" }
	else if (number >= 200 && number <= 300) { return "1.一般民眾應減少戶外活動。  \n2.學生應立即停止戶外活動，並將課程調整於室內進行。  \n3.有心臟、呼吸道及心血管疾病患者、孩童及老年人應留在室內並減少體力消耗活動，外出應配戴口罩。  \n4.具有氣喘的人應增加使用吸入劑的頻率。"; }
	else if (number > 301) { return "1.一般民眾應避免戶外活動，室內應緊閉門窗，必要外出應配戴口罩等防護用具。  \n2.學生應立即停止戶外活動，並將課程調整於室內進行。  \n3.有心臟、呼吸道及心血管疾病患者、孩童及老年人應留在室內並避免體力消耗活動，外出應配戴口罩。  \n4.具有氣喘的人應增加使用吸入劑的頻率。"; }
}

function status_generator(number) {
	if (number >= 0 && number <= 50) { return "良好"; }
	else if (number >= 51 && number <= 100) { return "普通"; }
	else if (number >= 100 && number <= 150) { return "對敏感族群不健康"; }
	else if (number >= 151 && number <= 199) { return "對所有族群不健康"; }
	else if (number >= 200 && number <= 300) { return "非常不健康"; }
	else if (number > 301) { return "危害"; }
	else { return "有效數據不足"; }

}

function getDay(num) {
	var today = new Date();
	var nowTime = today.getTime() + 8 * 3600 * 1000;
	var ms = 24 * 3600 * 1000 * num;
	today.setTime(parseInt(nowTime + ms));
	var oMoth = (today.getMonth() + 1).toString();
	var oDay = today.getDate().toString();
	var oWeek = weekdays[today.getDay()];
	return oMoth + '月' + oDay + '日 (' + oWeek + ')';
}

function FormatTime() {
	var today = new Date();
	var nowTime = today.getTime() + 8 * 3600 * 1000;
	today.setTime(parseInt(nowTime));
	var oYear = today.getFullYear().toString();
	var oMoth = (today.getMonth() + 1).toString();
	var oDay = today.getDate().toString();
	var oHour = today.getHours().toString();
	if (oMoth.length <= 1) { oMoth = '0' + oMoth; }
	if (oDay.length <= 1) { oDay = '0' + oDay; }
	if (oHour.length <= 1) { oHour = '0' + oHour; }
	return oYear + "/" + oMoth + "/" + oDay + " " + oHour + ":00";
}

function predict(input) {

	var k = 0;
	var array1 = []; var array2 = []; var array3 = [];
	var array4 = []; var array5 = []; var array6 = [];
	var temp = "";

	for (k = 0; k < area_array.length; k++) {
		if (input[k].AQI >= 0 && input[k].AQI <= 50) { array1.push(area_array[k]) }
		else if (input[k].AQI >= 51 && input[k].AQI <= 100) { array2.push(area_array[k]) }
		else if (input[k].AQI >= 100 && input[k].AQI <= 150) { array3.push(area_array[k]) }
		else if (input[k].AQI >= 151 && input[k].AQI <= 199) { array4.push(area_array[k]) }
		else if (input[k].AQI >= 200 && input[k].AQI <= 300) { array5.push(area_array[k]) }
		else if (input[k].AQI > 301) { array6.push(area_array[k]) }
	}
	if (array1.length !== 0) { temp = temp + array1 + "空品區為良好等級，"; }
	if (array2.length !== 0) { temp = temp + array2 + "空品區為普通等級，"; }
	if (array3.length !== 0) { temp = temp + array3 + "空品區對敏感族群不健康，"; }
	if (array4.length !== 0) { temp = temp + array4 + "空品區對所有族群不健康，"; }
	if (array5.length !== 0) { temp = temp + array5 + "空品區非常不健康，"; }
	if (array6.length !== 0) { temp = temp + array6 + "空品區為危害等級，"; }

	return replaceString(temp, ',', '<break time="0.25s"/>');
}

module.exports = {
  picture_generator,
  big_picture_generator,
  info_generator,
  info_output_generator,
  status_generator,
  getDay,
  FormatTime,
  predict
}
