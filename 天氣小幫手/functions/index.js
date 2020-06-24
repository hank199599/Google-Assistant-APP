	'use strict';

	// Import the Dialogflow module from the Actions on Google client library.
	const {
	  dialogflow,
	  SimpleResponse,Button,List,
	  items,Image,BasicCard,Suggestions
	} = require('actions-on-google');

	const functions = require('firebase-functions');
	const app = dialogflow({debug: true});

	var iconv = require('iconv-lite');
	var FetchStream = require("fetch").FetchStream;
	const replaceString = require('replace-string');
	var getJSON = require('get-json');
	var converter=require('./report_convert.json');
	var links=require('./link_convert.json');
	var county_array=["臺北市","新北市","基隆市","桃園市","新竹縣","新竹市","苗栗縣","新竹市","臺中市","南投縣","彰化縣","雲林縣","嘉義縣","嘉義市","臺南市","高雄市","屏東縣","宜蘭縣","花蓮縣","臺東縣","金門縣","澎湖縣","連江縣"];
	var vacation_array=["阿里山","日月潭","明德水庫","鯉魚潭水庫","雪霸國家公園觀霧遊憩區","參天國家風景區","大雪山國家森林遊樂區","台中港","塔塔加","奧萬大","清境農場","惠蓀林場"];
	var word1="";
	var word2="";
	var report_context="";
	var output_context="";var pre_report=""; var temp_report="";

function reduceSIZE(input){
	 input=replaceString(input, '．', '.');
	 input=replaceString(input, '０', '0');
	 input=replaceString(input, '１', '1');
	 input=replaceString(input, '２', '2');
	 input=replaceString(input, '３', '3');
	 input=replaceString(input, '４', '4');
	 input=replaceString(input, '５', '5');
	 input=replaceString(input, '６', '6');
	 input=replaceString(input, '７', '7');
	 input=replaceString(input, '８', '8');
	 input=replaceString(input, '９', '9');
	 return input;
 }
 
 function ReportTime(input){
	 
	 input=replaceString(input, '-', '/');
	 input=replaceString(input, 'T', ' ');
	 input=input.split('+')[0];
	return input;	
 }

function textindexer(input){
	var k=0;var j=0;
	var indexarray=["明德","今明","明顯","明晨"];
	for(j=0;j<indexarray.length;j++){
	 if(input.indexOf(indexarray[j])!==-1){k++;}
	}
	
	return k
}

const SelectContexts = {
	  parameter: 'county_select',
	}	

app.intent('今日天氣概況', (conv) => {

   return new Promise(
  
   function(resolve,reject){

	var fetch = new FetchStream("https://opendata.cwb.gov.tw/fileapi/opendata/MFC/F-C0032-031.FW50",{disableDecoding:true});

	fetch.on("data", function(chunk){
		resolve(iconv.decode(chunk,'BIG5'));
	});

  }).then(function (final_data) {
	  
	word1=county_array[parseInt(Math.random()*11)];word2=county_array[11+parseInt(Math.random()*10)];

	var report_time=(final_data.split('發布時間：')[1]).split('分')[0]+"分";
		report_time=reduceSIZE(report_time);
	var subtitle=(final_data.split('【')[1]).split('】')[0];
		subtitle=replaceString(subtitle,'，',' • ');
		subtitle=replaceString(subtitle,'；',' • ');
		subtitle=replaceString(subtitle,'。','');
	
	var display_report=replaceString(final_data.split('】。')[1], '；https://airtw.epa.gov.tw/', '');
		display_report=reduceSIZE(display_report.split('根據環保署')[0]);
		display_report=replaceString(display_report,'\r\n','');

	 var report_contect="";
		if(display_report.indexOf('明天')===-1){report_contect="今天"+((display_report.split('今天')[1]).split('根據環保署')[0]).split('日）')[1];}
		else{report_contect="明天"+((display_report.split('明天')[1]).split('根據環保署')[0]).split('日）')[1];}

	display_report=replaceString(display_report, '。', '。  \n  \n')+"**發布時間** • "+report_time;
	 
    conv.ask(new SimpleResponse({speech:`<speak><p><s>以下是中央氣象局，在${report_time}所發布的天氣概況。<break time="0.5s"/>${report_contect}</s><s>接著，你可以透過詢問查看縣市的天氣</s><s>例如，請試著問我<break time="0.2s"/>${word1}天氣如何?<break time="0.2s"/>或<break time="0.2s"/>幫我查詢${word2}</s></p></speak>`,text: '下面是氣象局的最新消息\n發佈時間是'+report_time} ));
 if(conv.screen){
 conv.ask(new BasicCard({   
			title: '全台天氣概況',
			subtitle:replaceString(subtitle, '\r\n',''),
			text:display_report,
			buttons: new Button({title: "前往中央氣象局看詳細報告",url:"https://www.cwb.gov.tw/V8/C/W/index.html",}),}));
			
  conv.ask(new Suggestions('查看各個區域','如何加入日常安排','👋 掰掰'));           
  conv.user.storage.direct=false;
  conv.user.storage.station="全臺";
 }
 else{
	conv.noInputs = ["請試著問我，"+word1+"天氣如何?","請試著問我要查詢的縣市","很抱歉，我幫不上忙"];	   	 
 }
 

	}).catch(function (error) {
	console.log(error)
	conv.ask(new SimpleResponse({               
			speech: `<speak><p><s>糟糕，查詢似乎發生錯誤。請稍後再試。</s></p></speak>`,
			text: '發生錯誤，請稍後再試一次。'}));
	conv.close(new BasicCard({  
			image: new Image({url:"https://dummyimage.com/1037x539/ef2121/ffffff.png&text=錯誤",alt:'Pictures',}),
			title:'數據加載發生問題',
			subtitle:'請過一段時間後再回來查看', display: 'CROPPED',
	  })); 
	});
});

app.intent('查詢各縣市的天氣概況', (conv) => {

	word1=county_array[parseInt(Math.random()*21)];
	word2=county_array[parseInt(Math.random()*21)];	
	var word3=vacation_array[parseInt(Math.random()*11)];
	conv.noInputs = ["請試著問我，"+word1+"天氣如何?","請試著問我要查詢的縣市","很抱歉，我幫不上忙"];	   	 

/*	conv.ask(new SimpleResponse({               
		  speech: `<speak><p><s>在任意畫面中，你隨時都能快速查詢縣市的天氣報告</s><s>你可以試著問<break time="0.2s"/>${word1}天氣如何?</s></p></speak>`,
		  text: '試著提問來快速存取縣市的天氣報告，\或是查看特定地點的天氣資訊!'}));
	
    conv.ask(new BasicCard({  
				title:"目前支援的特定地點",
				subtitle:"支援各縣市與特定地點查詢",
				text:" • 阿里山  \n • 日月潭  \n • 明德水庫  \n • 鯉魚潭水庫  \n • 雪霸國家公園觀霧遊憩區  \n • 參天國家風景區  \n • 大雪山國家森林遊樂區  \n • 台中港  \n • 塔塔加、奧萬大、清境農場、惠蓀林場 (*仁愛信義山區*)",
	}));
	
*/ 
  conv.contexts.set(SelectContexts.parameter, 5); 	
  conv.ask(new SimpleResponse({               
		  speech: `<speak><p><s>點選下方選項或詢問我來查看指定縣市今明兩天的天氣報告</s><s>你可以試著問<break time="0.2s"/>${word1}天氣如何?</s></p></speak>`,
		  text: '點選下方縣市選項或開口詢問，\n來存取今明兩天的天氣報告!'}));
	
 conv.ask(new List({
    //title: 'List Title',
    items: {
      '臺北市': {
        synonyms: ["台北","中正","大同","中山","松山","大安","萬華","信義","士林","北投","內湖","南港","文山","臺北"],
        title: '臺北市',
        description: '',
      },
      '新北市': {
        synonyms: ["新北","萬里","金山","板橋","汐止","深坑","石碇","瑞芳","平溪","雙溪","貢寮","新店","坪林","烏來","永和","中和","土城","三峽","樹林","鶯歌","三重","新莊","泰山","林口","蘆洲","五股","八里","淡水","三芝","石門"],
        title: '新北市',
        description: '',
      },
      '基隆市': {
        synonyms: ["基隆","仁愛","信義","中正","中山","安樂","暖暖","七堵"],
        title: '基隆市',
        description: '',
      },
      '桃園市': {
        synonyms: ["桃園","中壢","平鎮","龍潭","楊梅","新屋","觀音","龜山","八德","大溪","復興","大園","蘆竹"],
        title: '桃園市',
        description: '',
      },
      '新竹市': {
        synonyms: ["竹北","湖口","新豐","新埔","關西","芎林","寶山","竹東","五峰","橫山","尖石","北埔","峨眉","新竹"],
        title: '新竹市',
        description: '',
      },
      '苗栗縣': {
        synonyms: ["竹南","頭份","三灣","南庄","獅潭","後龍","通霄","苑裡","苗栗","造橋","頭屋","公館","大湖","泰安","銅鑼","三義","西湖","卓蘭","明德","雪霸","鯉魚潭"],
        title: '苗栗縣',
        description: '',
      },
      '臺中市': {
        synonyms: ["台中","北屯","西屯","南屯","太平","大里","霧峰","烏日","豐原","后里","石岡","東勢","和平","新社","潭子","大雅","神岡","大肚","沙鹿","龍井","梧棲","清水","大甲","外埔","大安","臺中","參天","梨山","大雪山"],
        title: '臺中市',
        description: '',
      },
      '南投縣': {
        synonyms: ["南投","中寮","草屯","國姓","埔里","仁愛","名間","集集","水里","魚池","信義","竹山","鹿谷","日月潭","塔塔加","奧萬大","清境","惠蓀林場"],
        title: '南投縣',
        description: '',
      },
      '彰化縣': {
        synonyms: ["彰化","芬園","花壇","秀水","鹿港","福興","線西","和美","伸港","員林","社頭","永靖","埔心","溪湖","大村","埔鹽","田中","北斗","田尾","埤頭","溪州","竹塘","二林","大城","芳苑","二水"],
        title: '彰化縣',
        description: '',
      },
      '雲林縣': {
        synonyms: ["雲林","斗南","大埤","虎尾","土庫","褒忠","東勢","臺西","崙背","麥寮","斗六","林內","古坑","莿桐","西螺","二崙","北港","水林","口湖","四湖","元長"],
        title: '雲林縣',
        description: '',
      },
      '嘉義縣': {
        synonyms: ["番路","梅山","竹崎","阿里山","中埔","大埔","水上","鹿草","太保","朴子","東石","六腳","新港","民雄","大林","溪口","義竹","布袋","嘉義縣"],
        title: '嘉義縣',
        description: '',
      },
      '嘉義市': {
        synonyms: ['嘉義'],
        title: '嘉義市',
        description: '',
      },	 
      '臺南市': {
        synonyms: ["台南","安平","安南","永康","歸仁","新化","左鎮","玉井","楠西","南化","仁德","關廟","龍崎","官田","麻豆","佳里","西港","七股","將軍","學甲","北門","新營","後壁","白河","東山","六甲","下營","柳營","鹽水","善化","大內","山上","新市","安定","臺南"],
        title: '臺南市',
        description: '',
      },	
      '高雄市': {
        synonyms: ["高雄","港都","新興","前金","苓雅","鹽埕","鼓山","旗津","三民","楠梓","小港","左營","仁武","大社","岡山","路竹","阿蓮","田寮","燕巢","橋頭","梓官","彌陀","永安","湖內","鳳山","大寮","林園","鳥松","大樹","旗山","美濃","六龜","內門","杉林","甲仙","桃源","那瑪夏","茂林","茄萣","前鎮"],
        title: '高雄市',
        description: '',
      },	
      '屏東縣': {
        synonyms: ["屏東","三地門","霧臺","瑪家","九如","里港","高樹","鹽埔","長治","麟洛","竹田","內埔","萬丹","潮州","泰武","來義","萬巒","崁頂","新埤","南州","林邊","東港","琉球","佳冬","新園","枋寮","枋山","春日","獅子","車城","牡丹","恆春","滿州"],
        title: '屏東縣',
        description: '',
      },		  
      '宜蘭縣': {
        synonyms: ["宜蘭","噶瑪蘭","頭城","礁溪","壯圍","員山","羅東","三星","大同","五結","冬山","蘇澳","南澳","釣魚臺列嶼"],
        title: '宜蘭縣',
        description: '',
      },
      '花蓮縣': {
        synonyms: ["花蓮","洄瀾","多羅滿","新城","秀林","吉安","壽豐","鳳林","光復","豐濱","瑞穗","萬榮","玉里","卓溪","富里"],
        title: '花蓮縣',
        description: '',
      },
      '臺東縣': {
        synonyms: ["台東","臺東","綠島","蘭嶼","延平","卑南","鹿野","關山","海端","池上","東河","成功","長濱","太麻里","金峰","大武","達仁"],
        title: '臺東縣',
        description: '',
      },	  
      '澎湖縣': {
        synonyms: ["澎湖","馬公","西嶼","望安","七美","白沙","湖西"],
        title: '澎湖縣',
        description: '',
      },
      '金門縣': {
        synonyms: ["金門","金沙","金湖","金寧","金城","烈嶼","烏坵"],
        title: '金門縣',
        description: '',
	  },
      '連江縣': {
        synonyms: ["馬祖","南竿","北竿","莒光","東引","連江","媽祖"],
        title: '連江縣',
        description: '',
      }, 
	},
  })); 
	conv.ask(new Suggestions(word1+'天氣如何?','我想看'+word2,'如何加入日常安排'));
	conv.ask(new Suggestions('查看全台概況','👋 掰掰'));           
    conv.user.storage.direct=false;
    conv.user.storage.station="全臺";
 
});

app.intent('縣市選擇結果', (conv, params, option) => {
   return new Promise(
   
   function(resolve,reject){

	if(county_array.indexOf(option)!==-1){

		getJSON('https://opendata.cwb.gov.tw/fileapi/v1/opendataapi/F-C0032-'+converter[option]+'?Authorization=CWB-D48B64A0-8BCB-497F-96E3-BD5EB63CF502&downloadType=WEB&format=JSON')
		.then(function(response) {
		resolve([response.cwbopendata.dataset.parameterSet.parameter,response.cwbopendata.dataset.datasetInfo.issueTime])
		}).catch(function(error) {
		 var reason=new Error('資料獲取失敗');
		 reject(reason)	});
	}
	else{reject("無法辨識使用者所要求的查詢")}

	}).then(function (final_data) {
	
	var reporttime=ReportTime(final_data[1]);
	final_data=final_data[0];
	var subtitle=final_data[0].parameterValue;
	 subtitle=replaceString(subtitle,'，',' • ');
	 subtitle=replaceString(subtitle,'；',' • ');
	 subtitle=replaceString(subtitle,'。','');
	 subtitle=replaceString(subtitle,'【','');
	 subtitle=replaceString(subtitle,'】','');
	 if(subtitle.indexOf(')日')!==-1){subtitle=subtitle.split(')日')[1];}
	 if(subtitle.indexOf('）日')!==-1){subtitle=subtitle.split('）日')[1];}
	 
    report_context="";
    output_context=""; pre_report="";  temp_report="";	
	
	var i=0; var keelung="";
	for(i=1;i<final_data.length;i++){
		//
		if(option==="基隆市"){
				if(final_data[i].parameterValue.indexOf('預報總結')!==-1){
				output_context=final_data[i+1].parameterValue;
				report_context=output_context;
				break;}}
		else{
		report_context=report_context+final_data[i].parameterValue;
		if(output_context.length===0&&final_data[i].parameterValue.indexOf('今')!==-1){
			if(final_data[i].parameterValue.indexOf(')日')!==-1){output_context="今天"+final_data[i].parameterValue.split(')日')[1];;}
			else if(final_data[i].parameterValue.indexOf('）日')!==-1){output_context="今天"+final_data[i].parameterValue.split('）日')[1];}
			else if(final_data[i].parameterValue.indexOf('日)')!==-1){output_context="今天"+final_data[i].parameterValue.split('日)')[1];;}
			else if(final_data[i].parameterValue.indexOf('日）')!==-1){output_context="今天"+final_data[i].parameterValue.split('日）')[1];}
			else if(final_data[i].parameterValue.indexOf('今(')!==-1){output_context="今天"+final_data[i].parameterValue.split(')')[1];}
			else if(final_data[i].parameterValue.indexOf('今（')!==-1){output_context="今天"+final_data[i].parameterValue.split('）')[1];;}
		}
		//檢測是否存在明日的預報資訊，如果存在則以明日的預報優先
		if(pre_report.length===0&&final_data[i].parameterValue.indexOf('明')!==-1&&textindexer(final_data[i].parameterValue)===0){
			if(final_data[i].parameterValue.indexOf(')日')!==-1){pre_report="明天"+final_data[i].parameterValue.split(')日')[1];;}
			else if(final_data[i].parameterValue.indexOf('）日')!==-1){pre_report="明天"+final_data[i].parameterValue.split('）日')[1];}
			else if(final_data[i].parameterValue.indexOf('日)')!==-1){pre_report="明天"+final_data[i].parameterValue.split('日)')[1];;}
			else if(final_data[i].parameterValue.indexOf('日）')!==-1){pre_report="明天"+final_data[i].parameterValue.split('日）')[1];}
			else if(final_data[i].parameterValue.indexOf('明(')!==-1){pre_report="明天"+final_data[i].parameterValue.split('）')[1];}
			else if(final_data[i].parameterValue.indexOf('明（')!==-1){pre_report="明天"+final_data[i].parameterValue.split(')')[1];}
		}
		if(temp_report.length===0){
		    if(final_data[i].parameterValue.indexOf(')日')!==-1){temp_report=final_data[i].parameterValue.split(')日')[1];;}
			else if(final_data[i].parameterValue.indexOf('）日')!==-1){temp_report=final_data[i].parameterValue.split('）日')[1];}
			else if(final_data[i].parameterValue.indexOf('日)')!==-1){temp_report=final_data[i].parameterValue.split('日)')[1];;}
			else if(final_data[i].parameterValue.indexOf('日）')!==-1){temp_report=final_data[i].parameterValue.split('日）')[1];}
		}
		
		if(final_data[i+1]!==undefined){
			report_context=report_context+"  \n  \n";
		if(final_data[i+1].parameterValue.indexOf('預報總結')!==-1){break;}}
	 }
	}
	if(option!=="基隆市"){
	//收尾語音輸出的報告
	if(pre_report.length!==0){output_context=pre_report;}
	if(output_context.length===0&&pre_report.length===0){output_context=temp_report;}
	//收尾文字輸出的報告格式
	report_context=reduceSIZE(report_context);
	}
	//針對特定地點的客製化輸出
	
	var link_number=links[option];
	
	if(conv.input.raw.indexOf('阿里山')!==-1){
		option="阿里山";
		report_context=final_data[4].parameterValue;
		output_context=report_context;}
	else if(conv.input.raw.indexOf('日月潭')!==-1){
		option="日月潭";
		report_context="日月潭地區"+output_context.split('日月潭地區')[1];
		output_context=report_context;}
	else if(conv.input.raw.indexOf('明德')!==-1||conv.input.raw.indexOf('鯉魚潭')!==-1||conv.input.raw.indexOf('雪霸')!=-1){
		var temp=final_data[4].parameterValue.split("；");
		if(conv.input.raw.indexOf("明德")!==-1){option="明德水庫";report_context=temp[0].split('日）')[1];}
		else if(conv.input.raw.indexOf("鯉魚潭")!==-1){option="鯉魚潭水庫";report_context=temp[1];}
		else if(conv.input.raw.indexOf("雪霸")!==-1){option="雪霸國家公園觀霧遊憩區";report_context=temp[2];}
		output_context=report_context;}
	else if(conv.input.raw.indexOf('參天')!==-1||conv.input.raw.indexOf('梨山')!==-1||conv.input.raw.indexOf('大雪山')!=-1||conv.input.raw.indexOf('臺中港')!=-1||conv.input.raw.indexOf('台中港')!==-1){
		var temp=final_data[4].parameterValue.split("；");
		if(conv.input.raw.indexOf('參天')!==-1||conv.input.raw.indexOf('梨山')!==-1){option="參天國家風景區";report_context="參天國家風景區"+temp[0].split(')')[1];}
		else if(conv.input.raw.indexOf("大雪山")!==-1){option="大雪山國家森林遊樂區";report_context=temp[1];}
		else if(conv.input.raw.indexOf("臺中港")!==-1||conv.input.raw.indexOf('台中港')!==-1){option="臺中港";report_context=temp[2];}
		output_context=report_context;}
	else if(conv.input.raw.indexOf('塔塔加')!==-1||conv.input.raw.indexOf('奧萬大')!==-1||conv.input.raw.indexOf('清境')!=-1||conv.input.raw.indexOf('惠蓀林場')!=-1){
		option="仁愛信義山區";
		report_context="仁愛信義山區"+(output_context.split("仁愛信義山區")[1]).split("。")[0];
		output_context=report_context;
	}

	conv.ask(new SimpleResponse({               
			speech: `<speak><p><s>以下是${option}的天氣報告<break time="1s"/>${output_context}</s></p></speak>`,
			text: '下面是「'+option+'」的天氣概況'}));
			
 if(conv.screen){
	if(conv.user.storage.direct===false){
	conv.ask(new BasicCard({  
			title:option,
			subtitle:subtitle,
			text:report_context+"  \n  \n**發布時間** • "+reporttime,
			buttons: new Button({title: "前往中央氣象局看詳細報告",url:"https://www.cwb.gov.tw/V8/C/W/County/County.html?CID="+link_number,}),}));
    conv.ask(new Suggestions('如何加入日常安排','查看各個區域','👋 掰掰'));           
    conv.user.storage.station=option;
	}
	else{
	conv.close(new BasicCard({  
			title:option,
			subtitle:subtitle,
			text:report_context+"  \n  \n**發布時間** • "+reporttime,
			buttons: new Button({title: "前往中央氣象局看詳細報告",url:"https://www.cwb.gov.tw/V8/C/W/County/County.html?CID="+link_number,}),}));
	 }		
   }else{ conv.close(`<speak><p><s>下次有需要時，可以對我說<break time="0.5s"/>叫天氣小幫手查詢${option}的天氣<break time="0.5s"/>下次見</s></p></speak>`);}

	}).catch(function (error) {
	console.log(error)
	word1=county_array[parseInt(Math.random()*11)];word2=county_array[11+parseInt(Math.random()*10)];

	if(conv.user.storage.direct===false){
    conv.ask(new SimpleResponse({ 
			   speech: `<speak><p><s>抱歉，發生一點小狀況</s><s>請試著問我<break time="0.2s"/>${word1}天氣如何?</s></p></speak>`,
			   text: '發生一點小狀況，請再試一次!',}));
	 conv.ask(new BasicCard({  
		title:"語音查詢範例",
		subtitle:"透過對話存取縣市報告",
		text:" • *「"+word1+"天氣如何?」*  \n • *「幫我查詢"+word2+"」*  \n • *「我想知道"+county_array[parseInt(Math.random()*21)]+"怎樣」*  \n • *「幫我找"+county_array[parseInt(Math.random()*21)]+"」*  \n • *「我想看"+county_array[parseInt(Math.random()*21)]+"」*  \n • *「"+county_array[parseInt(Math.random()*21)]+"天氣好嗎?」*  \n • *「我要查"+county_array[parseInt(Math.random()*21)]+"」*", }));
	conv.ask(new Suggestions(word1+'天氣如何?','幫我查詢'+word2));
	conv.ask(new Suggestions('查看全台概況','👋 掰掰'));           
	}
	else{
    conv.ask(new SimpleResponse({ 
			   speech: `<speak><p><s>抱歉，發生一點小狀況</s><s>你可以試著說<break time="0.2s"/>問天氣小幫手${word1}天氣如何?</s></p></speak>`,
			   text: '發生一點小狀況，請再試一次!',}));
	 conv.close(new BasicCard({  
		title:"語音查詢範例",
		subtitle:"透過對話存取縣市報告",
		text:" • *「問天氣小幫手"+word1+"天氣如何?」*  \n • *「叫天氣小幫手查詢"+word2+"」*  \n • *「問天氣小幫手全台的天氣概況」*", }));
	  }
	});	
});

app.intent('預設罐頭回覆', (conv) => {
	word1=county_array[parseInt(Math.random()*11)];word2=county_array[11+parseInt(Math.random()*10)];
	conv.noInputs = ["請試著問我，"+word1+"天氣如何?","請試著問我要查詢的縣市","很抱歉，我幫不上忙"];	   	 

	if(conv.input.type==="VOICE"){ //如果輸入是語音，則顯示錯誤處理方法
	conv.ask(new SimpleResponse({               
				  speech: `<speak><p><s>抱歉，我不懂你的意思</s><s>請試著問我<break time="0.2s"/>${word1}天氣如何?<break time="0.2s"/>或<break time="0.2s"/>幫我查詢${word2}</s></p></speak>`,
	  text: '試著提問來快速存取縣市的天氣報告，\n或點選建議卡片來進行操作!'}));
	if(conv.screen){
	 conv.ask(new BasicCard({  
		title:"語音查詢範例",
		subtitle:"以下是你可以嘗試的指令",
		text:" • *「"+word1+"天氣如何?」*  \n • *「幫我查詢"+word2+"」*  \n • *「我想知道"+county_array[parseInt(Math.random()*21)]+"怎樣」*  \n • *「幫我找"+county_array[parseInt(Math.random()*21)]+"」*  \n • *「我想看"+county_array[parseInt(Math.random()*21)]+"」*  \n • *「"+county_array[parseInt(Math.random()*21)]+"天氣好嗎?」*  \n • *「我要查"+county_array[parseInt(Math.random()*21)]+"」*", 
	}));
	conv.ask(new Suggestions(word1+'天氣如何?','幫我查詢'+word2));}
	else{ 
	conv.ask(`<speak><p><s>或對我說<break time="0.2s"/>區域查詢<break time="0.2s"/>查看縣市的天氣報告</s></p></speak>`);}
	conv.noInputs = ["請試著問我，"+word1+"天氣如何?","請試著問我要查詢的縣市","很抱歉，我幫不上忙"];	   

	 }else{
	 conv.ask('抱歉，我不懂你的意思，\n請點選建議卡片來進行操作。');
	 }
	conv.ask(new Suggestions('查看全台概況','如何加入日常安排','👋 掰掰'));           
	 
});


app.intent('快速查詢縣市資訊', (conv, {county}) => {

	if(conv.input.raw.indexOf('新北')!==-1){county="新北市";}
	
   return new Promise(
   
   function(resolve,reject){

	if(county_array.indexOf(county)!==-1){

		getJSON('https://opendata.cwb.gov.tw/fileapi/v1/opendataapi/F-C0032-'+converter[county]+'?Authorization=CWB-D48B64A0-8BCB-497F-96E3-BD5EB63CF502&downloadType=WEB&format=JSON')
		.then(function(response) {
		resolve([response.cwbopendata.dataset.parameterSet.parameter,response.cwbopendata.dataset.datasetInfo.issueTime])
		}).catch(function(error) {
		 var reason=new Error('資料獲取失敗');
		 reject(reason)	});
	}
	else if(county==="全臺"){	
	var fetch = new FetchStream("https://opendata.cwb.gov.tw/fileapi/opendata/MFC/F-C0032-031.FW50",{disableDecoding:true});

	fetch.on("data", function(chunk){resolve(iconv.decode(chunk,'BIG5'));});
	}
	else{reject("無法辨識使用者所要求的查詢")}

	}).then(function (final_data) {
		
	if(county_array.indexOf(county)!==-1){
	
	var reporttime=ReportTime(final_data[1]);
	final_data=final_data[0];
	var subtitle=final_data[0].parameterValue;
	 subtitle=replaceString(subtitle,'，',' • ');
	 subtitle=replaceString(subtitle,'；',' • ');
	 subtitle=replaceString(subtitle,'。','');
	 subtitle=replaceString(subtitle,'【','');
	 subtitle=replaceString(subtitle,'】','');
	 if(subtitle.indexOf(')日')!==-1){subtitle=subtitle.split(')日')[1];}
	 if(subtitle.indexOf('）日')!==-1){subtitle=subtitle.split('）日')[1];}
	 
    report_context="";
    output_context=""; pre_report="";  temp_report="";	
	
	var i=0; var keelung="";
	for(i=1;i<final_data.length;i++){
		//
		if(county==="基隆市"){
				if(final_data[i].parameterValue.indexOf('預報總結')!==-1){
				output_context=final_data[i+1].parameterValue;
				report_context=output_context;
				break;}}
		else{
		report_context=report_context+final_data[i].parameterValue;
		if(output_context.length===0&&final_data[i].parameterValue.indexOf('今')!==-1){
			if(final_data[i].parameterValue.indexOf(')日')!==-1){output_context="今天"+final_data[i].parameterValue.split(')日')[1];;}
			else if(final_data[i].parameterValue.indexOf('）日')!==-1){output_context="今天"+final_data[i].parameterValue.split('）日')[1];}
			else if(final_data[i].parameterValue.indexOf('日)')!==-1){output_context="今天"+final_data[i].parameterValue.split('日)')[1];;}
			else if(final_data[i].parameterValue.indexOf('日）')!==-1){output_context="今天"+final_data[i].parameterValue.split('日）')[1];}
			else if(final_data[i].parameterValue.indexOf('今(')!==-1){output_context="今天"+final_data[i].parameterValue.split(')')[1];}
			else if(final_data[i].parameterValue.indexOf('今（')!==-1){output_context="今天"+final_data[i].parameterValue.split('）')[1];;}
		}
		//檢測是否存在明日的預報資訊，如果存在則以明日的預報優先
		if(pre_report.length===0&&final_data[i].parameterValue.indexOf('明')!==-1&&textindexer(final_data[i].parameterValue)===0){
			if(final_data[i].parameterValue.indexOf(')日')!==-1){pre_report="明天"+final_data[i].parameterValue.split(')日')[1];;}
			else if(final_data[i].parameterValue.indexOf('）日')!==-1){pre_report="明天"+final_data[i].parameterValue.split('）日')[1];}
			else if(final_data[i].parameterValue.indexOf('日)')!==-1){pre_report="明天"+final_data[i].parameterValue.split('日)')[1];;}
			else if(final_data[i].parameterValue.indexOf('日）')!==-1){pre_report="明天"+final_data[i].parameterValue.split('日）')[1];}
			else if(final_data[i].parameterValue.indexOf('明(')!==-1){pre_report="明天"+final_data[i].parameterValue.split('）')[1];}
			else if(final_data[i].parameterValue.indexOf('明（')!==-1){pre_report="明天"+final_data[i].parameterValue.split(')')[1];}
		}
		if(temp_report.length===0){
		    if(final_data[i].parameterValue.indexOf(')日')!==-1){temp_report=final_data[i].parameterValue.split(')日')[1];;}
			else if(final_data[i].parameterValue.indexOf('）日')!==-1){temp_report=final_data[i].parameterValue.split('）日')[1];}
			else if(final_data[i].parameterValue.indexOf('日)')!==-1){temp_report=final_data[i].parameterValue.split('日)')[1];;}
			else if(final_data[i].parameterValue.indexOf('日）')!==-1){temp_report=final_data[i].parameterValue.split('日）')[1];}
		}
		
		if(final_data[i+1]!==undefined){
			report_context=report_context+"  \n  \n";
		if(final_data[i+1].parameterValue.indexOf('預報總結')!==-1){break;}}
	 }
	}
	if(county!=="基隆市"){
	//收尾語音輸出的報告
	if(pre_report.length!==0){output_context=pre_report;}
	if(output_context.length===0&&pre_report.length===0){output_context=temp_report;}
	//收尾文字輸出的報告格式
	report_context=reduceSIZE(report_context);
	}
	//針對特定地點的客製化輸出
	
	var link_number=links[county];
	
	if(conv.input.raw.indexOf('阿里山')!==-1){
		county="阿里山";
		report_context=final_data[4].parameterValue;
		output_context=report_context;}
	else if(conv.input.raw.indexOf('日月潭')!==-1){
		county="日月潭";
		report_context="日月潭地區"+output_context.split('日月潭地區')[1];
		output_context=report_context;}
	else if(conv.input.raw.indexOf('明德')!==-1||conv.input.raw.indexOf('鯉魚潭')!==-1||conv.input.raw.indexOf('雪霸')!=-1){
		var temp=final_data[4].parameterValue.split("；");
		if(conv.input.raw.indexOf("明德")!==-1){county="明德水庫";report_context=temp[0].split('日）')[1];}
		else if(conv.input.raw.indexOf("鯉魚潭")!==-1){county="鯉魚潭水庫";report_context=temp[1];}
		else if(conv.input.raw.indexOf("雪霸")!==-1){county="雪霸國家公園觀霧遊憩區";report_context=temp[2];}
		output_context=report_context;}
	else if(conv.input.raw.indexOf('參天')!==-1||conv.input.raw.indexOf('梨山')!==-1||conv.input.raw.indexOf('大雪山')!=-1||conv.input.raw.indexOf('臺中港')!=-1||conv.input.raw.indexOf('台中港')!==-1){
		var temp=final_data[4].parameterValue.split("；");
		if(conv.input.raw.indexOf('參天')!==-1||conv.input.raw.indexOf('梨山')!==-1){county="參天國家風景區";report_context="參天國家風景區"+temp[0].split(')')[1];}
		else if(conv.input.raw.indexOf("大雪山")!==-1){county="大雪山國家森林遊樂區";report_context=temp[1];}
		else if(conv.input.raw.indexOf("臺中港")!==-1||conv.input.raw.indexOf('台中港')!==-1){county="臺中港";report_context=temp[2];}
		output_context=report_context;}
	else if(conv.input.raw.indexOf('塔塔加')!==-1||conv.input.raw.indexOf('奧萬大')!==-1||conv.input.raw.indexOf('清境')!=-1||conv.input.raw.indexOf('惠蓀林場')!=-1){
		county="仁愛信義山區";
		report_context="仁愛信義山區"+(output_context.split("仁愛信義山區")[1]).split("。")[0];
		output_context=report_context;
	}

	conv.ask(new SimpleResponse({               
			speech: `<speak><p><s>以下是${county}的天氣報告<break time="1s"/>${output_context}</s></p></speak>`,
			text: '下面是「'+county+'」的天氣概況'}));
			
 if(conv.screen){
	if(conv.user.storage.direct===false){
	conv.ask(new BasicCard({  
			title:county,
			subtitle:subtitle,
			text:report_context+"  \n  \n**發布時間** • "+reporttime,
			buttons: new Button({title: "前往中央氣象局看詳細報告",url:"https://www.cwb.gov.tw/V8/C/W/County/County.html?CID="+link_number,}),}));
    conv.ask(new Suggestions('如何加入日常安排','查看各個區域','👋 掰掰'));           
    conv.user.storage.station=county;
	}
	else{
	conv.close(new BasicCard({  
			title:county,
			subtitle:subtitle,
			text:report_context+"  \n  \n**發布時間** • "+reporttime,
			buttons: new Button({title: "前往中央氣象局看詳細報告",url:"https://www.cwb.gov.tw/V8/C/W/County/County.html?CID="+link_number,}),}));
	 }		
   }else{
	conv.close(`<speak><p><s>下次有需要時，可以對我說<break time="0.5s"/>叫天氣小幫手查詢${county}的天氣<break time="0.5s"/>下次見</s></p></speak>`);}
	
	}else{
	 var report_time=(final_data.split('發布時間：')[1]).split('分')[0]+"分";
		 report_time=reduceSIZE(report_time);
	 if(final_data.indexOf('明天')===-1){ var report_contect="今天"+((final_data.split('今天')[1]).split('根據環保署')[0]).split('日）')[1];}
			   else{var report_contect="明天"+((final_data.split('明天')[1]).split('根據環保署')[0]).split('日）')[1];}

	 var subtitle=(final_data.split('【')[1]).split('】')[0];
		 subtitle=replaceString(subtitle,'，',' • ');
		 subtitle=replaceString(subtitle,'；',' • ');
		 subtitle=replaceString(subtitle,'。','');

	 var display_report=replaceString(final_data.split('】。')[1], '；https://airtw.epa.gov.tw/', '');
		 display_report=reduceSIZE(display_report.split('根據環保署')[0]);
		 display_report=replaceString(display_report,'\r\n','');

	 var report_contect="";
		if(display_report.indexOf('明天')===-1){report_contect="今天"+((display_report.split('今天')[1]).split('根據環保署')[0]).split('日）')[1];}
		else{report_contect="明天"+((display_report.split('明天')[1]).split('根據環保署')[0]).split('日）')[1];}

	display_report=replaceString(display_report, '。', '。  \n  \n')+"**發布時間** • "+report_time;
		 
    conv.ask(new SimpleResponse({speech:`<speak><p><s>以下是中央氣象局，在${report_time}所發布的天氣概況。<break time="0.5s"/>${report_contect}</s></p></speak>`,text: '下面是氣象局的最新消息\n發佈時間是'+report_time} ));

  if(conv.screen){
	if(conv.user.storage.direct===false){
	 conv.ask(new BasicCard({   
				title: '全台天氣概況',
			    subtitle:replaceString(subtitle, '\r\n',''),
				text:display_report,
			    buttons: new Button({title: "前往中央氣象局看詳細報告",url:"https://www.cwb.gov.tw/V8/C/W/index.html",}),}));
		conv.ask(new Suggestions('查看各個區域','👋 掰掰'));           
	}
	else{
		conv.close(new BasicCard({   
				title: '全台天氣概況',
			    subtitle:replaceString(subtitle, '\r\n',''),
				text:display_report,
				buttons: new Button({title: "前往中央氣象局看詳細報告",url:"https://www.cwb.gov.tw/V8/C/W/index.html",}),}));
	 }
    }else{
	conv.ask(`<speak><p><s>下次有需要時，可以對我說<break time="1s"/>叫天氣小幫手查詢${county}的天氣，下次見</s></p></speak>`);}
  }
	}).catch(function (error) {
	console.log(error)
	word1=county_array[parseInt(Math.random()*11)];word2=county_array[11+parseInt(Math.random()*10)];

	if(conv.user.storage.direct===false){
    conv.ask(new SimpleResponse({ 
			   speech: `<speak><p><s>抱歉，發生一點小狀況</s><s>請試著問我<break time="0.2s"/>${word1}天氣如何?</s></p></speak>`,
			   text: '發生一點小狀況，請再試一次!',}));
	 conv.ask(new BasicCard({  
		title:"語音查詢範例",
		subtitle:"透過對話存取縣市報告",
		text:" • *「"+word1+"天氣如何?」*  \n • *「幫我查詢"+word2+"」*  \n • *「我想知道"+county_array[parseInt(Math.random()*21)]+"怎樣」*  \n • *「幫我找"+county_array[parseInt(Math.random()*21)]+"」*  \n • *「我想看"+county_array[parseInt(Math.random()*21)]+"」*  \n • *「"+county_array[parseInt(Math.random()*21)]+"天氣好嗎?」*  \n • *「我要查"+county_array[parseInt(Math.random()*21)]+"」*", }));
	conv.ask(new Suggestions(word1+'天氣如何?','幫我查詢'+word2));
	conv.ask(new Suggestions('查看全台概況','👋 掰掰'));           
	}
	else{
    conv.ask(new SimpleResponse({ 
			   speech: `<speak><p><s>抱歉，發生一點小狀況</s><s>你可以試著說<break time="0.2s"/>問天氣小幫手${word1}天氣如何?</s></p></speak>`,
			   text: '發生一點小狀況，請再試一次!',}));
	 conv.close(new BasicCard({  
		title:"語音查詢範例",
		subtitle:"透過對話存取縣市報告",
		text:" • *「問天氣小幫手"+word1+"天氣如何?」*  \n • *「叫天氣小幫手查詢"+word2+"」*  \n • *「問天氣小幫手全台的天氣概況」*", }));
	  }
	});
});


app.intent('加入日常安排', (conv) => {

	var choose_station=conv.user.storage.station;

	conv.ask(new SimpleResponse({               
				  speech: `<speak><p><s>透過加入日常安排，你可以快速存取所需縣市之預報資訊。</s><s>舉例來說，如果你把${choose_station}加入日常安排。你即可隨時呼叫我查詢該縣市的最新天氣報告!</s><s>以下為詳細說明</s></p></speak>`,
				  text: '以下為詳細說明，請查照'}));

	conv.ask(new BasicCard({  
			title:'將「'+choose_station+'」加入日常安排', display: 'CROPPED',
			subtitle:'1.點擊畫面右上方大頭貼 > 點擊[設定]\n2.切換到[Google助理]分頁 > 點擊[日常安排]\n3.點擊[新增日常安排]\n4.「新增指令(必填)」輸入「天氣報告」\n5.「新增動作」輸入\n「叫天氣小精靈查詢'+choose_station+'」\n6.輸入完成後點擊「儲存」\n7.現在，你可以透過說出或輸入「天氣報告」來快速查詢'+choose_station+'的天氣報告!',})); 

	conv.ask(new Suggestions('查看'+choose_station+'的天氣概況'));
	conv.ask(new Suggestions('查看全台概況','👋 掰掰'));           

});

app.intent('結束對話', (conv) => {
		conv.user.storage = {}; //離開同時清除暫存資料
		conv.ask('希望能幫上一點忙!');
		conv.ask(new SimpleResponse({speech: '下次見',text: '下次見 👋',}));
		conv.close(new BasicCard({   
			title: '感謝您的使用!', 
			text:'如果有任何需要改進的地方，  \n歡迎到簡介頁面評分或給予反饋，謝謝!', 
			buttons: new Button({title: '開啟本程式的商店頁面',url: 'https://assistant.google.com/services/a/uid/000000971a4ed57e',}),
	  })); 
});


// Set the DialogflowApp object to handle the HTTPS POST request.
exports.tw_weather_helper = functions.https.onRequest(app);
