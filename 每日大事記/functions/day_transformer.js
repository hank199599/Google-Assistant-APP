const replaceString = require('replace-string');
var replace_dict = require('./replace_dict.json')
var day_index_dict= require('./day_index.json')

var day_jump={
    "天":1,
    "禮拜":7,
    "月":30
}

function getDay(num) {
	var today = new Date();
	var nowTime = today.getTime();
	var ms = 24 * 3600 * 1000 * num;
	today.setTime(parseInt(nowTime + ms));
	var oMoth = (today.getMonth() + 1).toString();
	var oDay = today.getDate().toString();
	return oMoth + '月' + oDay + '日';
}

function trans_time(input) {

    var text="";
    try {
    var time_array = input.split(/\D/gm).filter(text => text);
    var return_array=[];

	if(input.indexOf('am')!==-1 || input.indexOf('早上')!==-1){
        text="早上";
        return_array.push(time_array[0]);
    }
	else if(input.indexOf('pm')!==-1 || input.indexOf('晚上')!==-1 || input.indexOf('下午')!==-1){
        if(parseInt(time_array[0])<6){text="下午";}
        else{text="晚上";}
        return_array.push(parseInt(time_array[0])+12);
        }
    else{
        return_array=time_array
        text="早上"
    }
        if(time_array.length===1){
            return_array.push("00");
            time_array.push("00");
        }
        else{
            return_array.push(time_array[1]);
        }
    
    return [return_array[0]+":"+return_array[1],text+time_array[0]+":"+time_array[1]]
    }
    catch (e) {
        return ["指定時間點","指定時間點"]
    }
}

function transformer(input_date, another_name) {

    if (input_date.length === 0 && another_name.length !== 0) {
        var date = another_name;

        for (var i=0;i<Object.keys(replace_dict).length;i++){
            date = replaceString(date, Object.keys(replace_dict)[i], Object.values(replace_dict)[i]);
        }
    }
    else if (input_date.length !== 0 && another_name.length === 0) {
        var date = input_date; 
        }
   
    // console.log("date:"+date)

    if (date.indexOf('T') !== -1 && date.indexOf('-') !== -1) {
        var temp = date.split(/\D/gm).filter(text => text)
        return parseInt(temp[1])+"月"+parseInt(temp[2])+"日"
    }
    else if (date.indexOf('月') !== -1 && date.indexOf('日') !== -1){
        return date   
    }
    else {

        for(var i=0;i<Object.keys(day_index_dict).length;i++)
        {
            if (date.indexOf(Object.keys(day_index_dict)[i]) !== -1) {
                 return getDay(Object.values(day_index_dict)[input_date]);
                 }
        }

        var num = date.split(/\D/gm).filter(text => text)[0]
        var unit=0;
        var parameter=0;

        for(var i=0;i<Object.keys(day_jump).length;i++)
        {
            if (date.indexOf(Object.keys(day_jump)[i]) !== -1) {
                unit = Object.values(day_jump)[i]
                break
            }
        }

        if(date.indexOf('前') !== -1 || date.indexOf('上') !== -1){
            parameter=-1
        }
        else if(date.indexOf('後') !== -1 || date.indexOf('下') !== -1){
            parameter=1
        }
        
        
        console.log("parameter:"+parameter)
        console.log("num:"+num)
        console.log("unit:"+unit)
        
        return  getDay(parameter * num * unit);
    }
}

module.exports={transformer,trans_time}