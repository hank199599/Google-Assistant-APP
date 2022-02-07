var segment_array=["良好等級","普通等級","橘色提醒等級","紅色警示等級","紫色警報等級","危害等級"]
var notify_array=["敏感族群應減少在戶外劇烈活動","所有族群應減少在戶外活動","對所有族群應避免戶外活動","對所有族群應避免戶外活動","對所有族群應避免戶外活動"] 

function arrange_dict(input_data){
    var sort_dict={"0":[],"1":[],"2":[],"3":[],"4":[],"5":[]}
    var dict_index = Object.keys(input_data)

    for (var i = 0; i< dict_index.length;i++){
        var AQI = input_data[dict_index[i]]
        if (isNaN(parseInt(AQI))===true){ continue ;}
        var k=0;

        if (AQI > 0 && AQI <= 50) {
            k=0
        } else if (AQI >= 51 && AQI <= 100) {
            k=1   
        } else if (AQI >= 101 && AQI <= 150) {
            k=2   
        } else if (AQI >= 151 && AQI <= 199) {
            k=3   
        } else if (AQI >= 200 && AQI <= 300) {
            k=4   
        } else if (AQI > 301) {
            k=5   
        }

        sort_dict[k]=sort_dict[k].concat(dict_index[i])
    }

    return sort_dict
}

function summation_algo(input_data){
    var output_dict={}
    for (var i = 0; i< 6;i++){
        if(input_data[i].length>0){
            output_dict[i]=input_data[i].length
        }
    }
    return output_dict
}

function sortNumber(a,b) {
    return b - a;
}

function sortPriority(a,b) {
    return a - b;
}
function sort_algo(dict) {
    //console.log(dict)
    var reverse_list=[]
    var sortedValues = Object.values(dict).sort(sortNumber);

    for (i=0;i<sortedValues.length;i++){
        var keys = Object.keys(dict);
        for(j=0;j<keys.length;j++)
            if(dict[keys[j]]===sortedValues[i]){
                reverse_list.push(keys[j])
                delete dict[keys[j]]
            }
    }
    return reverse_list
} 

function spoken_generetor(input_list){
    var output_str=""
    for (var i=0;i<input_list.length;i++){
        output_str+=input_list[i]
        if(input_list[i+1]!==undefined){output_str+="、"}
    }
    return output_str
}

function ratio_calculator(input_dict){
    var results=[]
    var total_count = Object.values(input_dict).reduce((a, b) => a + b, 0)
    
    for (var i=0;i<Object.values(input_dict).length;i++){
        results.push(input_dict[Object.keys(input_dict)[i]]/total_count)
    }

    if (Array.from(new Set(results)).length===1){
        return true
    }
    else{
        return false
    }

}

function generator(input_data){

    var arranged_data = arrange_dict(input_data)
    var sum_dict = summation_algo(arranged_data)
    var sorted_list = sort_algo(summation_algo(arranged_data))
    var str="" //回傳的簡短地區報告
   
    console.log(sorted_list)

    if(sorted_list.length===1){
        str= "空氣品質以"+segment_array[sorted_list[0]]+"為主";
        if (sorted_list[0]>1){
            str+="，"+notify_array[sorted_list[0]-2]
        }
    }
    else if (ratio_calculator(sum_dict)===true){
        str= "空氣品質分布自"+segment_array[sorted_list[0]]+"到"+segment_array[sorted_list[sorted_list.length-1]]
        if (sorted_list[sorted_list.length-1]>1){
            str+="，"+spoken_generetor(arranged_data[sorted_list[sorted_list.length-1]])+"地區"+notify_array[sorted_list[sorted_list.length-1]-2]
        }
    }
    else {
        if(sorted_list.length===2){
            str= "空氣品質多為"+segment_array[sorted_list[0]]
            if (sorted_list[0]>1){
                str+="，"+notify_array[sorted_list[0]-2]
            }
            str +="，"+spoken_generetor(arranged_data[sorted_list[sorted_list.length-1]])+"地區為"+segment_array[sorted_list[sorted_list.length-1]]
        
        if (sorted_list[sorted_list.length-1]>1){
            str+="，"+notify_array[sorted_list[sorted_list.length-1]-2]
        }
        }
        else{
            str= "空氣品質以"+segment_array[sorted_list[0]]+"為主"+"，";
            if (sorted_list[0]>1){
                str+=notify_array[sorted_list[0]-2]+"，"
            }
            delete sorted_list[0]
            sorted_list=Object.values(sorted_list)
            var sort_state=[sorted_list[0],sorted_list[sorted_list.length-1]].sort(sortPriority);
            str+= "其餘地區則是"+segment_array[sort_state[0]]+"與"+segment_array[sort_state[1]];
            if (sort_state[1]>1){
                str+="，"+spoken_generetor(arranged_data[sort_state[1]])+"地區"+notify_array[sort_state[1]-2]
            }
        }

        str+="。"
       
    }
    return str
}

module.exports = {
    generator
}