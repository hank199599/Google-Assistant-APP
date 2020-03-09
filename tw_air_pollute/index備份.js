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

// Import the firebase-functions package for deployment.
const functions = require('firebase-functions');
var getJSON = require('get-json')
const replaceString = require('replace-string');
const parseJson = require('parse-json');
const findNearestLocation = require('map-nearest-location');
const app = dialogflow({debug: true});
const admin = require('firebase-admin');

let serviceAccount = require("./config/b1a2b-krmfch-firebase-adminsdk-1tgdm-cf5f4fc84d.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

let db = admin.firestore();
var data=[];
var number=0; //函數用變數
var picture="";
var picurl1="";var picurl2="";var picurl3="";var picurl4="";var picurl5="";
var picurl6="";var picurl7="";var picurl8="";var picurl9="";var picurl10="";
var status1="";var status2="";var status3="";var status4="";var status5="";
var status6="";var status7="";var status8="";var status9="";var status10="";
var AQI1="";var AQI2="";var AQI3="";var AQI4="";var AQI5="";
var AQI6="";var AQI7="";var AQI8="";var AQI9="";var AQI10="";
var station_array=["二林","三重","三義","土城","士林","大同","大里","大園","大寮","小港","中山","中壢","仁武","斗六","冬山","古亭","左營","平鎮","永和","安南","朴子","汐止","竹山","竹東","西屯","沙鹿","宜蘭","忠明","松山","板橋","林口","林園","花蓮","金門","前金","前鎮","南投","屏東","琉球","恆春","美濃","苗栗","埔里","桃園","觀音工業區","馬公","馬祖","基隆","崙背","淡水","麥寮","善化","富貴角","復興","湖口","菜寮","陽明","新竹","香山","新店","新莊","新港","新營","楠梓","萬里","萬華","嘉義","彰化","大城","臺西","臺東","臺南","麻豆","鳳山","潮州","線西","橋頭","頭份","龍潭","豐原","關山","觀音"];
var input_array=["北部地區","中部地區","南部地區","東部地區","離島地區","臺北市","新北市(一)","新北市(二)","桃園市","新竹市","新竹縣","苗栗縣","臺中市","彰化縣","南投縣","雲林縣","嘉義縣市","台南市","北高雄市","南高雄市","屏東縣"];
var option_array=["Northen","Central","Southen","East","Outlying_island","Taipei","New_Taipei1","New_Taipei2","Taoyuan","Hsinchu City","Hsinchu County","Miaoli","Taichung","Changhua","Nantou","Yunlin","Chiayi County","Tainan","NKaohsiung","SKaohsiung","Pingtung"];
var locations= [{lng: 120.409653,lat: 23.925175,Sitename:"二林"},{lng: 121.493806,lat: 25.072611,Sitename:"三重"},{lng: 120.758833,lat: 24.382942,Sitename:"三義"},{lng: 121.451861,lat: 24.982528,Sitename:"土城"},{lng: 121.515389,lat: 25.105417,Sitename:"士林"},{lng: 121.513311,lat: 25.0632,Sitename:"大同"},{lng: 120.677689,lat: 24.099611,Sitename:"大里"},{lng: 121.201811,lat: 25.060344,Sitename:"大園"},{lng: 120.425081,lat: 22.565747,Sitename:"大寮"},{lng: 120.337736,lat: 22.565833,Sitename:"小港"},{lng: 121.526528,lat: 25.062361,Sitename:"中山"},{lng: 121.221667,lat: 24.953278,Sitename:"中壢"},{lng: 120.332631,lat: 22.689056,Sitename:"仁武"},{lng: 120.544994,lat: 23.711853,Sitename:"斗六"},{lng: 121.792928,lat: 24.632203,Sitename:"冬山"},{lng: 121.529556,lat: 25.020608,Sitename:"古亭"},{lng: 120.292917,lat: 22.674861,Sitename:"左營"},{lng: 121.203986,lat: 24.952786,Sitename:"平鎮"},{lng: 121.516306,lat: 25.017,Sitename:"永和"},{lng: 120.2175,lat: 23.048197,Sitename:"安南"},{lng: 120.24781,lat: 23.467123,Sitename:"朴子"},{lng: 121.6423,lat: 25.067131,Sitename:"汐止"},{lng: 120.677306,lat: 23.756389,Sitename:"竹山"},{lng: 121.088903,lat: 24.740644,Sitename:"竹東"},{lng: 120.616917,lat: 24.162197,Sitename:"西屯"},{lng: 120.568794,lat: 24.225628,Sitename:"沙鹿"},{lng: 121.746394,lat: 24.747917,Sitename:"宜蘭"},{lng: 120.641092,lat: 24.151958,Sitename:"忠明"},{lng: 121.578611,lat: 25.05,Sitename:"松山"},{lng: 121.458667,lat: 25.012972,Sitename:"板橋"},{lng: 121.376869,lat: 25.077197,Sitename:"林口"},{lng: 120.41175,lat: 22.4795,Sitename:"林園"},{lng: 121.599769,lat: 23.971306,Sitename:"花蓮"},{lng: 118.312256,lat: 24.432133,Sitename:"金門"},{lng: 120.288086,lat: 22.632567,Sitename:"前金"},{lng: 120.307564,lat: 22.605386,Sitename:"前鎮"},{lng: 120.685306,lat: 23.913,Sitename:"南投"},{lng: 120.488033,lat: 22.673081,Sitename:"屏東"},{lng: 120.377222,lat: 22.352222,Sitename:"琉球"},{lng: 120.788928,lat: 21.958069,Sitename:"恆春"},{lng: 120.530542,lat: 22.883583,Sitename:"美濃"},{lng: 120.8202,lat: 24.565269,Sitename:"苗栗"},{lng: 120.967903,lat: 23.968842,Sitename:"埔里"},{lng: 121.304383,lat: 24.995368,Sitename:"桃園"},{lng: 121.128044,lat: 25.063039,Sitename:"觀音工業區"},{lng: 119.566158,lat: 23.569031,Sitename:"馬公"},{lng: 119.949875,lat: 26.160469,Sitename:"馬祖"},{lng: 121.760056,lat: 25.129167,Sitename:"基隆"},{lng: 120.348742,lat: 23.757547,Sitename:"崙背"},{lng: 121.449239,lat: 25.1645,Sitename:"淡水"},{lng: 120.251825,lat: 23.753506,Sitename:"麥寮"},{lng: 120.297142,lat: 23.115097,Sitename:"善化"},{lng: 121.536763,lat: 25.298562,Sitename:"富貴角"},{lng: 120.312017,lat: 22.608711,Sitename:"復興"},{lng: 121.038653,lat: 24.900142,Sitename:"湖口"},{lng: 121.481028,lat: 25.06895,Sitename:"菜寮"},{lng: 121.529583,lat: 25.182722,Sitename:"陽明"},{lng: 120.972075,lat: 24.805619,Sitename:"新竹"},{lng: 120.913297,lat: 24.765925,Sitename:"新竹(香山)"},{lng: 121.537778,lat: 24.977222,Sitename:"新店"},{lng: 121.4325,lat: 25.037972,Sitename:"新莊"},{lng: 120.345531,lat: 23.554839,Sitename:"新港"},{lng: 120.31725,lat: 23.305633,Sitename:"新營"},{lng: 120.328289,lat: 22.733667,Sitename:"楠梓"},{lng: 121.689881,lat: 25.179667,Sitename:"萬里"},{lng: 121.507972,lat: 25.046503,Sitename:"萬華"},{lng: 120.440833,lat: 23.462778,Sitename:"嘉義"},{lng: 120.541519,lat: 24.066,Sitename:"彰化"},{lng: 120.273117,lat: 23.843139,Sitename:"大城"},{lng: 120.202842,lat: 23.717533,Sitename:"臺西"},{lng: 121.15045,lat: 22.755358,Sitename:"臺東"},{lng: 120.202617,lat: 22.984581,Sitename:"臺南"},{lng: 120.245831,lat: 23.179047,Sitename:"麻豆"},{lng: 120.358083,lat: 22.627392,Sitename:"鳳山"},{lng: 120.561175,lat: 22.523108,Sitename:"潮州"},{lng: 120.469061,lat: 24.131672,Sitename:"線西"},{lng: 120.305689,lat: 22.757506,Sitename:"橋頭"},{lng: 120.898572,lat: 24.696969,Sitename:"頭份"},{lng: 121.21635,lat: 24.863869,Sitename:"龍潭"},{lng: 120.741711,lat: 24.256586,Sitename:"豐原"},{lng: 121.161933,lat: 23.045083,Sitename:"關山"},{lng: 121.082761,lat: 25.035503,Sitename:"觀音"}];
var Status=0;var AQI=0;var Pollutant="";var info="";var info_output="";
var indexnumber="";
var choose_station="";
var report="";
var report_PublishTime="";var day_count=0;
var direction_array=["東北風","偏東風","偏南風","西南風","偏西風"]
var wind_direction="偏東風";
var output_title="";
var PublishTime="";
var temp="";var Pollutant_list=[];var AQI_list=[];
var time=0;var hour_now=0;

function picture_generator(number){
	if(number>=0&&number<=50){return "https://dummyimage.com/232x128/1e9165/ffffff.png&text="+number;}
	else if(number>=51&&number<=100){return "https://dummyimage.com/232x128/fc920b/ffffff.png&text="+number;}
	else if(number>=100&&number<=150){return "https://dummyimage.com/232x128/ef4621/ffffff.png&text="+number;}
	else if(number>=151&&number<=199){return "https://dummyimage.com/232x128/b71411/ffffff.png&text="+number;}
	else if(number>=200&&number<=300){return "https://dummyimage.com/232x128/5b0e31/ffffff.png&text="+number;}
    else if(number>301){return "https://dummyimage.com/232x128/4f1770/ffffff.png&text="+number;}
    else{return "https://dummyimage.com/232x128/232830/ffffff.png&text=NaN";}
	}
function status_generator(number){
	if(number>=0&&number<=50){return "良好";}
	else if(number>=51&&number<=100){return "普通";}
	else if(number>=100&&number<=150){return "對敏感族群不健康";}
	else if(number>=151&&number<=199){return "對所有族群不健康";}
	else if(number>=200&&number<=300){return "非常不健康";}
    else if(number>301){return "危害";}
    else{return "有效數據不足";}

}

let docRef = db.collection('dataset').doc('hcqENJEc7RAHVllVSmic');

function air_report_update(){
	//取得簡易報告
time = new Date();
hour_now= (time.getHours()+8)%24;
if(hour_now>=0&&hour_now<=10){	
getJSON('http://opendata.epa.gov.tw/webapi/Data/AQFN/?$select=Content&$orderby=PublishTime%20DESC&$skip=0&$top=1&format=json')
    .then(function(response) {
       report=((response[0].Content).split('3.')[1]).split('。')[0];});
}else{
getJSON('http://opendata.epa.gov.tw/webapi/Data/AQFN/?$select=Content&$orderby=PublishTime%20DESC&$skip=0&$top=1&format=json')
    .then(function(response) {
       report=(((response[0].Content).split('2.')[1]).split('。')[0]).split('：')[1];});
}
       report=replaceString(report, '1.', ''); 
       report=replaceString(report, '(1', ''); 
       report=replaceString(report, '(2', ''); 
       report=replaceString(report, '(3', ''); 
       report=replaceString(report, '1)', ''); 
       report=replaceString(report, '2)', ''); 
       report=replaceString(report, '3)', ''); 
       report=replaceString(report, '4)', ''); 
       report=replaceString(report, '5)', ''); 
       report=replaceString(report, '6)', ''); 
       report=replaceString(report, '7)', ''); 
       report=replaceString(report, '8)', ''); 
       report=replaceString(report, '9)', ''); 
       report=replaceString(report, '0)', ''); 

//取得測站更新時間
getJSON('http://opendata.epa.gov.tw/webapi/Data/REWIQA/?$select=PublishTime&$orderby=SiteName&$skip=0&$top=1&format=json').then(function(response) {
	 PublishTime=response[0].PublishTime;})
.catch(function(error) {});

report=report.split('。')[0];
report=report.split('日')[1];
report=report+'。';
PublishTime=replaceString(PublishTime, '-', '/');

//取得各測站詳細資訊
getJSON('http://opendata.epa.gov.tw/webapi/Data/REWIQA/?$select=SiteName,AQI,Pollutant&$orderby=SiteName&$skip=0&$top=1000&format=json').then(function(response) {
     data=response;});

//複寫資料到Firestore
if(report!=="undefined。"){docRef.update({report: report});}
if(PublishTime!==""){docRef.update({PublishTime: PublishTime});}

if((typeof data[0]==="undefined")!==true){
	if(data[44].SiteName!=="桃園(觀音工業區)"){
	docRef.update({
	0:data[0],1:data[1],2:data[2],3:data[3],4:data[4],5:data[5],6:data[6],7:data[7],8:data[8],9:data[9],10:data[10],
	11:data[11],12:data[12],13:data[13],14:data[14],15:data[15],16:data[16],17:data[17],18:data[18],19:data[19],20:data[20],
	21:data[21],22:data[22],23:data[23],24:data[24],25:data[25],26:data[26],27:data[27],28:data[28],29:data[29],30:data[30],
	31:data[31],32:data[32],33:data[33],34:data[34],35:data[35],36:data[36],37:data[37],38:data[38],39:data[39],40:data[40],
	41:data[41],42:data[42],43:data[43],44:{AQI:"",Pollutant:"",SiteName:"桃園(觀音工業區)"},
	45:data[44],46:data[45],47:data[46],48:data[47],49:data[48],50:data[49],
	51:data[50],52:data[51],53:data[52],54:data[53],55:data[54],56:data[55],57:data[56],58:data[57],59:data[58],60:data[59],
	61:data[60],62:data[61],63:data[62],64:data[63],65:data[64],66:data[65],67:data[66],68:data[67],69:data[68],70:data[69],
	71:data[70],72:data[71],73:data[72],74:data[73],75:data[74],76:data[75],77:data[76],78:data[77],79:data[78],80:data[79],
	81:data[80],
	});}
	else{
	docRef.update({
	0:data[0],1:data[1],2:data[2],3:data[3],4:data[4],5:data[5],6:data[6],7:data[7],8:data[8],9:data[9],10:data[10],
	11:data[11],12:data[12],13:data[13],14:data[14],15:data[15],16:data[16],17:data[17],18:data[18],19:data[19],20:data[20],
	21:data[21],22:data[22],23:data[23],24:data[24],25:data[25],26:data[26],27:data[27],28:data[28],29:data[29],30:data[30],
	31:data[31],32:data[32],33:data[33],34:data[34],35:data[35],36:data[36],37:data[37],38:data[38],39:data[39],40:data[40],
	41:data[41],42:data[42],43:data[43],44:data[44],45:data[45],46:data[46],47:data[47],48:data[48],49:data[49],50:data[50],
	51:data[51],52:data[52],53:data[53],54:data[54],55:data[55],56:data[56],57:data[57],58:data[58],59:data[59],60:data[60],
	61:data[61],62:data[62],63:data[63],64:data[64],65:data[65],66:data[66],67:data[67],68:data[68],69:data[69],70:data[70],
	71:data[71],72:data[72],73:data[73],74:data[74],75:data[75],76:data[76],77:data[77],78:data[78],79:data[79],80:data[80],
	81:data[81],
	});}
}
  db.collection('dataset').get().then((snapshot) => {snapshot.forEach((doc) => {
	AQI_list[0]=doc['_fieldsProto']['0'].mapValue.fields.AQI.stringValue;AQI_list[1]=doc['_fieldsProto']['1'].mapValue.fields.AQI.stringValue;AQI_list[2]=doc['_fieldsProto']['2'].mapValue.fields.AQI.stringValue;AQI_list[3]=doc['_fieldsProto']['3'].mapValue.fields.AQI.stringValue;AQI_list[4]=doc['_fieldsProto']['4'].mapValue.fields.AQI.stringValue;AQI_list[5]=doc['_fieldsProto']['5'].mapValue.fields.AQI.stringValue;AQI_list[6]=doc['_fieldsProto']['6'].mapValue.fields.AQI.stringValue;AQI_list[7]=doc['_fieldsProto']['7'].mapValue.fields.AQI.stringValue;AQI_list[8]=doc['_fieldsProto']['8'].mapValue.fields.AQI.stringValue;AQI_list[9]=doc['_fieldsProto']['9'].mapValue.fields.AQI.stringValue;AQI_list[10]=doc['_fieldsProto']['10'].mapValue.fields.AQI.stringValue;AQI_list[11]=doc['_fieldsProto']['11'].mapValue.fields.AQI.stringValue;AQI_list[12]=doc['_fieldsProto']['12'].mapValue.fields.AQI.stringValue;AQI_list[13]=doc['_fieldsProto']['13'].mapValue.fields.AQI.stringValue;AQI_list[14]=doc['_fieldsProto']['14'].mapValue.fields.AQI.stringValue;AQI_list[15]=doc['_fieldsProto']['15'].mapValue.fields.AQI.stringValue;AQI_list[16]=doc['_fieldsProto']['16'].mapValue.fields.AQI.stringValue;AQI_list[17]=doc['_fieldsProto']['17'].mapValue.fields.AQI.stringValue;AQI_list[18]=doc['_fieldsProto']['18'].mapValue.fields.AQI.stringValue;AQI_list[19]=doc['_fieldsProto']['19'].mapValue.fields.AQI.stringValue;AQI_list[20]=doc['_fieldsProto']['20'].mapValue.fields.AQI.stringValue;AQI_list[21]=doc['_fieldsProto']['21'].mapValue.fields.AQI.stringValue;AQI_list[22]=doc['_fieldsProto']['22'].mapValue.fields.AQI.stringValue;AQI_list[23]=doc['_fieldsProto']['23'].mapValue.fields.AQI.stringValue;AQI_list[24]=doc['_fieldsProto']['24'].mapValue.fields.AQI.stringValue;AQI_list[25]=doc['_fieldsProto']['25'].mapValue.fields.AQI.stringValue;AQI_list[26]=doc['_fieldsProto']['26'].mapValue.fields.AQI.stringValue;AQI_list[27]=doc['_fieldsProto']['27'].mapValue.fields.AQI.stringValue;AQI_list[28]=doc['_fieldsProto']['28'].mapValue.fields.AQI.stringValue;AQI_list[29]=doc['_fieldsProto']['29'].mapValue.fields.AQI.stringValue;AQI_list[30]=doc['_fieldsProto']['30'].mapValue.fields.AQI.stringValue;AQI_list[31]=doc['_fieldsProto']['31'].mapValue.fields.AQI.stringValue;AQI_list[32]=doc['_fieldsProto']['32'].mapValue.fields.AQI.stringValue;AQI_list[33]=doc['_fieldsProto']['33'].mapValue.fields.AQI.stringValue;AQI_list[34]=doc['_fieldsProto']['34'].mapValue.fields.AQI.stringValue;AQI_list[35]=doc['_fieldsProto']['35'].mapValue.fields.AQI.stringValue;AQI_list[36]=doc['_fieldsProto']['36'].mapValue.fields.AQI.stringValue;AQI_list[37]=doc['_fieldsProto']['37'].mapValue.fields.AQI.stringValue;AQI_list[38]=doc['_fieldsProto']['38'].mapValue.fields.AQI.stringValue;AQI_list[39]=doc['_fieldsProto']['39'].mapValue.fields.AQI.stringValue;AQI_list[40]=doc['_fieldsProto']['40'].mapValue.fields.AQI.stringValue;AQI_list[41]=doc['_fieldsProto']['41'].mapValue.fields.AQI.stringValue;AQI_list[42]=doc['_fieldsProto']['42'].mapValue.fields.AQI.stringValue;AQI_list[43]=doc['_fieldsProto']['43'].mapValue.fields.AQI.stringValue;AQI_list[44]=doc['_fieldsProto']['44'].mapValue.fields.AQI.stringValue;AQI_list[45]=doc['_fieldsProto']['45'].mapValue.fields.AQI.stringValue;AQI_list[46]=doc['_fieldsProto']['46'].mapValue.fields.AQI.stringValue;AQI_list[47]=doc['_fieldsProto']['47'].mapValue.fields.AQI.stringValue;AQI_list[48]=doc['_fieldsProto']['48'].mapValue.fields.AQI.stringValue;AQI_list[49]=doc['_fieldsProto']['49'].mapValue.fields.AQI.stringValue;AQI_list[50]=doc['_fieldsProto']['50'].mapValue.fields.AQI.stringValue;AQI_list[51]=doc['_fieldsProto']['51'].mapValue.fields.AQI.stringValue;AQI_list[52]=doc['_fieldsProto']['52'].mapValue.fields.AQI.stringValue;AQI_list[53]=doc['_fieldsProto']['53'].mapValue.fields.AQI.stringValue;AQI_list[54]=doc['_fieldsProto']['54'].mapValue.fields.AQI.stringValue;AQI_list[55]=doc['_fieldsProto']['55'].mapValue.fields.AQI.stringValue;AQI_list[56]=doc['_fieldsProto']['56'].mapValue.fields.AQI.stringValue;AQI_list[57]=doc['_fieldsProto']['57'].mapValue.fields.AQI.stringValue;AQI_list[58]=doc['_fieldsProto']['58'].mapValue.fields.AQI.stringValue;AQI_list[59]=doc['_fieldsProto']['59'].mapValue.fields.AQI.stringValue;AQI_list[60]=doc['_fieldsProto']['60'].mapValue.fields.AQI.stringValue;AQI_list[61]=doc['_fieldsProto']['61'].mapValue.fields.AQI.stringValue;AQI_list[62]=doc['_fieldsProto']['62'].mapValue.fields.AQI.stringValue;AQI_list[63]=doc['_fieldsProto']['63'].mapValue.fields.AQI.stringValue;AQI_list[64]=doc['_fieldsProto']['64'].mapValue.fields.AQI.stringValue;AQI_list[65]=doc['_fieldsProto']['65'].mapValue.fields.AQI.stringValue;AQI_list[66]=doc['_fieldsProto']['66'].mapValue.fields.AQI.stringValue;AQI_list[67]=doc['_fieldsProto']['67'].mapValue.fields.AQI.stringValue;AQI_list[68]=doc['_fieldsProto']['68'].mapValue.fields.AQI.stringValue;AQI_list[69]=doc['_fieldsProto']['69'].mapValue.fields.AQI.stringValue;AQI_list[70]=doc['_fieldsProto']['70'].mapValue.fields.AQI.stringValue;AQI_list[71]=doc['_fieldsProto']['71'].mapValue.fields.AQI.stringValue;AQI_list[72]=doc['_fieldsProto']['72'].mapValue.fields.AQI.stringValue;AQI_list[73]=doc['_fieldsProto']['73'].mapValue.fields.AQI.stringValue;AQI_list[74]=doc['_fieldsProto']['74'].mapValue.fields.AQI.stringValue;AQI_list[75]=doc['_fieldsProto']['75'].mapValue.fields.AQI.stringValue;AQI_list[76]=doc['_fieldsProto']['76'].mapValue.fields.AQI.stringValue;AQI_list[77]=doc['_fieldsProto']['77'].mapValue.fields.AQI.stringValue;AQI_list[78]=doc['_fieldsProto']['78'].mapValue.fields.AQI.stringValue;AQI_list[79]=doc['_fieldsProto']['79'].mapValue.fields.AQI.stringValue;AQI_list[80]=doc['_fieldsProto']['80'].mapValue.fields.AQI.stringValue;AQI_list[81]=doc['_fieldsProto']['81'].mapValue.fields.AQI.stringValue;
 })});
  db.collection('dataset').get().then((snapshot) => {snapshot.forEach((doc) => {
   Pollutant_list[0]=doc['_fieldsProto']['0'].mapValue.fields.Pollutant.stringValue;Pollutant_list[1]=doc['_fieldsProto']['1'].mapValue.fields.Pollutant.stringValue;Pollutant_list[2]=doc['_fieldsProto']['2'].mapValue.fields.Pollutant.stringValue;Pollutant_list[3]=doc['_fieldsProto']['3'].mapValue.fields.Pollutant.stringValue;Pollutant_list[4]=doc['_fieldsProto']['4'].mapValue.fields.Pollutant.stringValue;Pollutant_list[5]=doc['_fieldsProto']['5'].mapValue.fields.Pollutant.stringValue;Pollutant_list[6]=doc['_fieldsProto']['6'].mapValue.fields.Pollutant.stringValue;Pollutant_list[7]=doc['_fieldsProto']['7'].mapValue.fields.Pollutant.stringValue;Pollutant_list[8]=doc['_fieldsProto']['8'].mapValue.fields.Pollutant.stringValue;Pollutant_list[9]=doc['_fieldsProto']['9'].mapValue.fields.Pollutant.stringValue;Pollutant_list[10]=doc['_fieldsProto']['10'].mapValue.fields.Pollutant.stringValue;Pollutant_list[11]=doc['_fieldsProto']['11'].mapValue.fields.Pollutant.stringValue;Pollutant_list[12]=doc['_fieldsProto']['12'].mapValue.fields.Pollutant.stringValue;Pollutant_list[13]=doc['_fieldsProto']['13'].mapValue.fields.Pollutant.stringValue;Pollutant_list[14]=doc['_fieldsProto']['14'].mapValue.fields.Pollutant.stringValue;Pollutant_list[15]=doc['_fieldsProto']['15'].mapValue.fields.Pollutant.stringValue;Pollutant_list[16]=doc['_fieldsProto']['16'].mapValue.fields.Pollutant.stringValue;Pollutant_list[17]=doc['_fieldsProto']['17'].mapValue.fields.Pollutant.stringValue;Pollutant_list[18]=doc['_fieldsProto']['18'].mapValue.fields.Pollutant.stringValue;Pollutant_list[19]=doc['_fieldsProto']['19'].mapValue.fields.Pollutant.stringValue;Pollutant_list[20]=doc['_fieldsProto']['20'].mapValue.fields.Pollutant.stringValue;Pollutant_list[21]=doc['_fieldsProto']['21'].mapValue.fields.Pollutant.stringValue;Pollutant_list[22]=doc['_fieldsProto']['22'].mapValue.fields.Pollutant.stringValue;Pollutant_list[23]=doc['_fieldsProto']['23'].mapValue.fields.Pollutant.stringValue;Pollutant_list[24]=doc['_fieldsProto']['24'].mapValue.fields.Pollutant.stringValue;Pollutant_list[25]=doc['_fieldsProto']['25'].mapValue.fields.Pollutant.stringValue;Pollutant_list[26]=doc['_fieldsProto']['26'].mapValue.fields.Pollutant.stringValue;Pollutant_list[27]=doc['_fieldsProto']['27'].mapValue.fields.Pollutant.stringValue;Pollutant_list[28]=doc['_fieldsProto']['28'].mapValue.fields.Pollutant.stringValue;Pollutant_list[29]=doc['_fieldsProto']['29'].mapValue.fields.Pollutant.stringValue;Pollutant_list[30]=doc['_fieldsProto']['30'].mapValue.fields.Pollutant.stringValue;Pollutant_list[31]=doc['_fieldsProto']['31'].mapValue.fields.Pollutant.stringValue;Pollutant_list[32]=doc['_fieldsProto']['32'].mapValue.fields.Pollutant.stringValue;Pollutant_list[33]=doc['_fieldsProto']['33'].mapValue.fields.Pollutant.stringValue;Pollutant_list[34]=doc['_fieldsProto']['34'].mapValue.fields.Pollutant.stringValue;Pollutant_list[35]=doc['_fieldsProto']['35'].mapValue.fields.Pollutant.stringValue;Pollutant_list[36]=doc['_fieldsProto']['36'].mapValue.fields.Pollutant.stringValue;Pollutant_list[37]=doc['_fieldsProto']['37'].mapValue.fields.Pollutant.stringValue;Pollutant_list[38]=doc['_fieldsProto']['38'].mapValue.fields.Pollutant.stringValue;Pollutant_list[39]=doc['_fieldsProto']['39'].mapValue.fields.Pollutant.stringValue;Pollutant_list[40]=doc['_fieldsProto']['40'].mapValue.fields.Pollutant.stringValue;Pollutant_list[41]=doc['_fieldsProto']['41'].mapValue.fields.Pollutant.stringValue;Pollutant_list[42]=doc['_fieldsProto']['42'].mapValue.fields.Pollutant.stringValue;Pollutant_list[43]=doc['_fieldsProto']['43'].mapValue.fields.Pollutant.stringValue;Pollutant_list[44]=doc['_fieldsProto']['44'].mapValue.fields.Pollutant.stringValue;Pollutant_list[45]=doc['_fieldsProto']['45'].mapValue.fields.Pollutant.stringValue;Pollutant_list[46]=doc['_fieldsProto']['46'].mapValue.fields.Pollutant.stringValue;Pollutant_list[47]=doc['_fieldsProto']['47'].mapValue.fields.Pollutant.stringValue;Pollutant_list[48]=doc['_fieldsProto']['48'].mapValue.fields.Pollutant.stringValue;Pollutant_list[49]=doc['_fieldsProto']['49'].mapValue.fields.Pollutant.stringValue;Pollutant_list[50]=doc['_fieldsProto']['50'].mapValue.fields.Pollutant.stringValue;Pollutant_list[51]=doc['_fieldsProto']['51'].mapValue.fields.Pollutant.stringValue;Pollutant_list[52]=doc['_fieldsProto']['52'].mapValue.fields.Pollutant.stringValue;Pollutant_list[53]=doc['_fieldsProto']['53'].mapValue.fields.Pollutant.stringValue;Pollutant_list[54]=doc['_fieldsProto']['54'].mapValue.fields.Pollutant.stringValue;Pollutant_list[55]=doc['_fieldsProto']['55'].mapValue.fields.Pollutant.stringValue;Pollutant_list[56]=doc['_fieldsProto']['56'].mapValue.fields.Pollutant.stringValue;Pollutant_list[57]=doc['_fieldsProto']['57'].mapValue.fields.Pollutant.stringValue;Pollutant_list[58]=doc['_fieldsProto']['58'].mapValue.fields.Pollutant.stringValue;Pollutant_list[59]=doc['_fieldsProto']['59'].mapValue.fields.Pollutant.stringValue;Pollutant_list[60]=doc['_fieldsProto']['60'].mapValue.fields.Pollutant.stringValue;Pollutant_list[61]=doc['_fieldsProto']['61'].mapValue.fields.Pollutant.stringValue;Pollutant_list[62]=doc['_fieldsProto']['62'].mapValue.fields.Pollutant.stringValue;Pollutant_list[63]=doc['_fieldsProto']['63'].mapValue.fields.Pollutant.stringValue;Pollutant_list[64]=doc['_fieldsProto']['64'].mapValue.fields.Pollutant.stringValue;Pollutant_list[65]=doc['_fieldsProto']['65'].mapValue.fields.Pollutant.stringValue;Pollutant_list[66]=doc['_fieldsProto']['66'].mapValue.fields.Pollutant.stringValue;Pollutant_list[67]=doc['_fieldsProto']['67'].mapValue.fields.Pollutant.stringValue;Pollutant_list[68]=doc['_fieldsProto']['68'].mapValue.fields.Pollutant.stringValue;Pollutant_list[69]=doc['_fieldsProto']['69'].mapValue.fields.Pollutant.stringValue;Pollutant_list[70]=doc['_fieldsProto']['70'].mapValue.fields.Pollutant.stringValue;Pollutant_list[71]=doc['_fieldsProto']['71'].mapValue.fields.Pollutant.stringValue;Pollutant_list[72]=doc['_fieldsProto']['72'].mapValue.fields.Pollutant.stringValue;Pollutant_list[73]=doc['_fieldsProto']['73'].mapValue.fields.Pollutant.stringValue;Pollutant_list[74]=doc['_fieldsProto']['74'].mapValue.fields.Pollutant.stringValue;Pollutant_list[75]=doc['_fieldsProto']['75'].mapValue.fields.Pollutant.stringValue;Pollutant_list[76]=doc['_fieldsProto']['76'].mapValue.fields.Pollutant.stringValue;Pollutant_list[77]=doc['_fieldsProto']['77'].mapValue.fields.Pollutant.stringValue;Pollutant_list[78]=doc['_fieldsProto']['78'].mapValue.fields.Pollutant.stringValue;Pollutant_list[79]=doc['_fieldsProto']['79'].mapValue.fields.Pollutant.stringValue;Pollutant_list[80]=doc['_fieldsProto']['80'].mapValue.fields.Pollutant.stringValue;Pollutant_list[81]=doc['_fieldsProto']['81'].mapValue.fields.Pollutant.stringValue;
 })});
}


app.intent('預設歡迎語句', (conv) => {

db.collection('dataset').get().then((snapshot) => {snapshot.forEach((doc) => {
	  report=doc['_fieldsProto'].report.stringValue;  wind_direction=doc['_fieldsProto'].wind_direction.stringValue;  report=doc['_fieldsProto'].report.stringValue;  PublishTime=doc['_fieldsProto'].PublishTime.stringValue;});})
  .catch((err) => {console.log('Error getting documents', err);});

report=report.split('。')[0];
report=report.split('日')[1];
report=report+'。';

if(report.indexOf('東北季風')!==-1){wind_direction="東北風";}
else if(report.indexOf('東北風')!==-1){wind_direction="東北風";}
else if(report.indexOf('偏東風')!==-1){wind_direction="偏東風";}
else if(report.indexOf('偏西風')!==-1){wind_direction="偏西風";}
else if(report.indexOf('偏南風')!==-1){wind_direction="偏南風";}
else if(report.indexOf('西南季風')!==-1){wind_direction="西南風";}
else if(report.indexOf('南風')!==-1){wind_direction="偏南風";}
else if(report.indexOf('南南東風')!==-1){wind_direction="偏南風";}
 
    if(conv.screen){
		if (conv.user.last.seen) {  conv.ask(new SimpleResponse({               
              speech: `<speak><p><s>空氣品質概要如下</s><break time="0.3s"/><s>${replaceString(report, '；', '<break time="0.3s"/>')}</s></p></speak>`,
              text: '歡迎回來!'}));}
        else { conv.ask(new SimpleResponse({               
              speech: `<speak><p><s>歡迎使用空汙查詢精靈!</s><s>我能提供環保署的監測站查詢服務，此外，你能將我加入日常安排快速查詢所需站點。</s><s>接下來，是目前的空氣概況<break time="0.5s"/>${replaceString(report, '；', '<break time="0.3s"/>')}</s></p></speak>`,
              text: '歡迎使用!'}));}
    conv.ask(new BasicCard({  
        image: new Image({url:'https://i.imgur.com/DOvpvIe.jpg ',alt:'Pictures',}),
        title:"全台空氣品質概要",
		subtitle:replaceString(report, '；', '。\n'),
		text:"測站資訊發布時間 • "+replaceString(PublishTime, '-', '/'), 
        buttons: new Button({title: '行政院環境保護署',url:'https://airtw.epa.gov.tw/CHT/default.aspx',display: 'CROPPED',}),})); 

		conv.ask(new Suggestions('🌎 最近的測站','🔎依區域查詢','語音指令範例','解釋「'+wind_direction+'」的影響','如何加入日常安排','👋 掰掰'));}
 
 else{conv.ask(new SimpleResponse({               
              speech: `<speak><p><s>空氣品質概要如下</s><s>${replaceString(report, '；', '<break time="0.3s"/>')}</s></p></speak>`,
              text: '歡迎使用'}));  conv.ask(new SimpleResponse({               
              speech: `<speak><p><s>接著，請選擇要查詢的區域!</s><s>選項有以下幾個<break time="0.5s"/>北部地區<break time="0.2s"/>中部地區<break time="0.2s"/>南部地區<break time="0.2s"/>東部地區<break time="0.2s"/>離島地區<break time="1s"/>請選擇。</s></p></speak>`,
	  text: '請輕觸下方卡片來選擇查詢區域!'}));  conv.ask(new Carousel({
	  title: 'Carousel Title',
	  items: {
    'Northen': {
      title: '北部地區',
      description: '北北基、桃園市\n新竹縣市', },
    'Central': {
      title: '中部地區',
      description: '苗栗縣、臺中市\n雲林、彰化、南投', },
    'Southen': {
      title: '南部地區',
     description: '嘉義縣市、台南市、高雄市、屏東縣', },
     'East': {
      title: '東部地區',
      description: '宜蘭、花蓮、台東\n', },
     'Outlying_island': {
      title: '離島地區',
      description: '澎湖縣、金門縣、\n連江縣', },
  },}));
}

if(wind_direction!==""){docRef.update({wind_direction: wind_direction});}

air_report_update();

});

app.intent('依區域查詢', (conv) => {
	
//取得測站更新時間
getJSON('http://opendata.epa.gov.tw/webapi/Data/REWIQA/?$select=PublishTime&$orderby=SiteName&$skip=0&$top=1&format=json').then(function(response) {
	 PublishTime=response[0].PublishTime;})
.catch(function(error) {});
  if(conv.screen){conv.ask('請輕觸下方卡片來選擇查詢區域');}
  else{conv.ask(new SimpleResponse({               
              speech: `<speak><p><s>請選擇要查詢的區域!</s><s>選項有以下幾個<break time="0.5s"/>北部地區<break time="0.2s"/>中部地區<break time="0.2s"/>南部地區<break time="0.2s"/>東部地區<break time="0.2s"/>離島地區<break time="1s"/>請選擇。</s></p></speak>`,
	  text: '請輕觸下方卡片來選擇查詢區域!'}));}
  conv.ask(new Carousel({
	  title: 'Carousel Title',
	  items: {
		'Northen': {
		  title: '北部地區',
		description: '北北基、桃園市\n新竹縣市',},
		'Central': {
		  title: '中部地區',
		description: '苗栗縣、臺中市\n雲林、彰化、南投',},
		'Southen': {
		  title: '南部地區',
		  description: '嘉義縣市、台南市、\n高雄市、屏東縣',},
		'East': {
		  title: '東部地區',
		  description: '宜蘭、花蓮、台東\n',},
		'Outlying_island': {
		  title: '離島地區',
		  description: '澎湖縣、金門縣、\n連江縣',}
	},}));
 conv.ask(new Suggestions('🌎 最近的測站','語音指令範例','👋 掰掰'));
 
if(PublishTime!==""){docRef.update({PublishTime: PublishTime});}
  db.collection('dataset').get().then((snapshot) => {snapshot.forEach((doc) => {
	AQI_list[0]=doc['_fieldsProto']['0'].mapValue.fields.AQI.stringValue;AQI_list[1]=doc['_fieldsProto']['1'].mapValue.fields.AQI.stringValue;AQI_list[2]=doc['_fieldsProto']['2'].mapValue.fields.AQI.stringValue;AQI_list[3]=doc['_fieldsProto']['3'].mapValue.fields.AQI.stringValue;AQI_list[4]=doc['_fieldsProto']['4'].mapValue.fields.AQI.stringValue;AQI_list[5]=doc['_fieldsProto']['5'].mapValue.fields.AQI.stringValue;AQI_list[6]=doc['_fieldsProto']['6'].mapValue.fields.AQI.stringValue;AQI_list[7]=doc['_fieldsProto']['7'].mapValue.fields.AQI.stringValue;AQI_list[8]=doc['_fieldsProto']['8'].mapValue.fields.AQI.stringValue;AQI_list[9]=doc['_fieldsProto']['9'].mapValue.fields.AQI.stringValue;AQI_list[10]=doc['_fieldsProto']['10'].mapValue.fields.AQI.stringValue;AQI_list[11]=doc['_fieldsProto']['11'].mapValue.fields.AQI.stringValue;AQI_list[12]=doc['_fieldsProto']['12'].mapValue.fields.AQI.stringValue;AQI_list[13]=doc['_fieldsProto']['13'].mapValue.fields.AQI.stringValue;AQI_list[14]=doc['_fieldsProto']['14'].mapValue.fields.AQI.stringValue;AQI_list[15]=doc['_fieldsProto']['15'].mapValue.fields.AQI.stringValue;AQI_list[16]=doc['_fieldsProto']['16'].mapValue.fields.AQI.stringValue;AQI_list[17]=doc['_fieldsProto']['17'].mapValue.fields.AQI.stringValue;AQI_list[18]=doc['_fieldsProto']['18'].mapValue.fields.AQI.stringValue;AQI_list[19]=doc['_fieldsProto']['19'].mapValue.fields.AQI.stringValue;AQI_list[20]=doc['_fieldsProto']['20'].mapValue.fields.AQI.stringValue;AQI_list[21]=doc['_fieldsProto']['21'].mapValue.fields.AQI.stringValue;AQI_list[22]=doc['_fieldsProto']['22'].mapValue.fields.AQI.stringValue;AQI_list[23]=doc['_fieldsProto']['23'].mapValue.fields.AQI.stringValue;AQI_list[24]=doc['_fieldsProto']['24'].mapValue.fields.AQI.stringValue;AQI_list[25]=doc['_fieldsProto']['25'].mapValue.fields.AQI.stringValue;AQI_list[26]=doc['_fieldsProto']['26'].mapValue.fields.AQI.stringValue;AQI_list[27]=doc['_fieldsProto']['27'].mapValue.fields.AQI.stringValue;AQI_list[28]=doc['_fieldsProto']['28'].mapValue.fields.AQI.stringValue;AQI_list[29]=doc['_fieldsProto']['29'].mapValue.fields.AQI.stringValue;AQI_list[30]=doc['_fieldsProto']['30'].mapValue.fields.AQI.stringValue;AQI_list[31]=doc['_fieldsProto']['31'].mapValue.fields.AQI.stringValue;AQI_list[32]=doc['_fieldsProto']['32'].mapValue.fields.AQI.stringValue;AQI_list[33]=doc['_fieldsProto']['33'].mapValue.fields.AQI.stringValue;AQI_list[34]=doc['_fieldsProto']['34'].mapValue.fields.AQI.stringValue;AQI_list[35]=doc['_fieldsProto']['35'].mapValue.fields.AQI.stringValue;AQI_list[36]=doc['_fieldsProto']['36'].mapValue.fields.AQI.stringValue;AQI_list[37]=doc['_fieldsProto']['37'].mapValue.fields.AQI.stringValue;AQI_list[38]=doc['_fieldsProto']['38'].mapValue.fields.AQI.stringValue;AQI_list[39]=doc['_fieldsProto']['39'].mapValue.fields.AQI.stringValue;AQI_list[40]=doc['_fieldsProto']['40'].mapValue.fields.AQI.stringValue;AQI_list[41]=doc['_fieldsProto']['41'].mapValue.fields.AQI.stringValue;AQI_list[42]=doc['_fieldsProto']['42'].mapValue.fields.AQI.stringValue;AQI_list[43]=doc['_fieldsProto']['43'].mapValue.fields.AQI.stringValue;AQI_list[44]=doc['_fieldsProto']['44'].mapValue.fields.AQI.stringValue;AQI_list[45]=doc['_fieldsProto']['45'].mapValue.fields.AQI.stringValue;AQI_list[46]=doc['_fieldsProto']['46'].mapValue.fields.AQI.stringValue;AQI_list[47]=doc['_fieldsProto']['47'].mapValue.fields.AQI.stringValue;AQI_list[48]=doc['_fieldsProto']['48'].mapValue.fields.AQI.stringValue;AQI_list[49]=doc['_fieldsProto']['49'].mapValue.fields.AQI.stringValue;AQI_list[50]=doc['_fieldsProto']['50'].mapValue.fields.AQI.stringValue;AQI_list[51]=doc['_fieldsProto']['51'].mapValue.fields.AQI.stringValue;AQI_list[52]=doc['_fieldsProto']['52'].mapValue.fields.AQI.stringValue;AQI_list[53]=doc['_fieldsProto']['53'].mapValue.fields.AQI.stringValue;AQI_list[54]=doc['_fieldsProto']['54'].mapValue.fields.AQI.stringValue;AQI_list[55]=doc['_fieldsProto']['55'].mapValue.fields.AQI.stringValue;AQI_list[56]=doc['_fieldsProto']['56'].mapValue.fields.AQI.stringValue;AQI_list[57]=doc['_fieldsProto']['57'].mapValue.fields.AQI.stringValue;AQI_list[58]=doc['_fieldsProto']['58'].mapValue.fields.AQI.stringValue;AQI_list[59]=doc['_fieldsProto']['59'].mapValue.fields.AQI.stringValue;AQI_list[60]=doc['_fieldsProto']['60'].mapValue.fields.AQI.stringValue;AQI_list[61]=doc['_fieldsProto']['61'].mapValue.fields.AQI.stringValue;AQI_list[62]=doc['_fieldsProto']['62'].mapValue.fields.AQI.stringValue;AQI_list[63]=doc['_fieldsProto']['63'].mapValue.fields.AQI.stringValue;AQI_list[64]=doc['_fieldsProto']['64'].mapValue.fields.AQI.stringValue;AQI_list[65]=doc['_fieldsProto']['65'].mapValue.fields.AQI.stringValue;AQI_list[66]=doc['_fieldsProto']['66'].mapValue.fields.AQI.stringValue;AQI_list[67]=doc['_fieldsProto']['67'].mapValue.fields.AQI.stringValue;AQI_list[68]=doc['_fieldsProto']['68'].mapValue.fields.AQI.stringValue;AQI_list[69]=doc['_fieldsProto']['69'].mapValue.fields.AQI.stringValue;AQI_list[70]=doc['_fieldsProto']['70'].mapValue.fields.AQI.stringValue;AQI_list[71]=doc['_fieldsProto']['71'].mapValue.fields.AQI.stringValue;AQI_list[72]=doc['_fieldsProto']['72'].mapValue.fields.AQI.stringValue;AQI_list[73]=doc['_fieldsProto']['73'].mapValue.fields.AQI.stringValue;AQI_list[74]=doc['_fieldsProto']['74'].mapValue.fields.AQI.stringValue;AQI_list[75]=doc['_fieldsProto']['75'].mapValue.fields.AQI.stringValue;AQI_list[76]=doc['_fieldsProto']['76'].mapValue.fields.AQI.stringValue;AQI_list[77]=doc['_fieldsProto']['77'].mapValue.fields.AQI.stringValue;AQI_list[78]=doc['_fieldsProto']['78'].mapValue.fields.AQI.stringValue;AQI_list[79]=doc['_fieldsProto']['79'].mapValue.fields.AQI.stringValue;AQI_list[80]=doc['_fieldsProto']['80'].mapValue.fields.AQI.stringValue;AQI_list[81]=doc['_fieldsProto']['81'].mapValue.fields.AQI.stringValue;
 })});
  db.collection('dataset').get().then((snapshot) => {snapshot.forEach((doc) => {
   Pollutant_list[0]=doc['_fieldsProto']['0'].mapValue.fields.Pollutant.stringValue;Pollutant_list[1]=doc['_fieldsProto']['1'].mapValue.fields.Pollutant.stringValue;Pollutant_list[2]=doc['_fieldsProto']['2'].mapValue.fields.Pollutant.stringValue;Pollutant_list[3]=doc['_fieldsProto']['3'].mapValue.fields.Pollutant.stringValue;Pollutant_list[4]=doc['_fieldsProto']['4'].mapValue.fields.Pollutant.stringValue;Pollutant_list[5]=doc['_fieldsProto']['5'].mapValue.fields.Pollutant.stringValue;Pollutant_list[6]=doc['_fieldsProto']['6'].mapValue.fields.Pollutant.stringValue;Pollutant_list[7]=doc['_fieldsProto']['7'].mapValue.fields.Pollutant.stringValue;Pollutant_list[8]=doc['_fieldsProto']['8'].mapValue.fields.Pollutant.stringValue;Pollutant_list[9]=doc['_fieldsProto']['9'].mapValue.fields.Pollutant.stringValue;Pollutant_list[10]=doc['_fieldsProto']['10'].mapValue.fields.Pollutant.stringValue;Pollutant_list[11]=doc['_fieldsProto']['11'].mapValue.fields.Pollutant.stringValue;Pollutant_list[12]=doc['_fieldsProto']['12'].mapValue.fields.Pollutant.stringValue;Pollutant_list[13]=doc['_fieldsProto']['13'].mapValue.fields.Pollutant.stringValue;Pollutant_list[14]=doc['_fieldsProto']['14'].mapValue.fields.Pollutant.stringValue;Pollutant_list[15]=doc['_fieldsProto']['15'].mapValue.fields.Pollutant.stringValue;Pollutant_list[16]=doc['_fieldsProto']['16'].mapValue.fields.Pollutant.stringValue;Pollutant_list[17]=doc['_fieldsProto']['17'].mapValue.fields.Pollutant.stringValue;Pollutant_list[18]=doc['_fieldsProto']['18'].mapValue.fields.Pollutant.stringValue;Pollutant_list[19]=doc['_fieldsProto']['19'].mapValue.fields.Pollutant.stringValue;Pollutant_list[20]=doc['_fieldsProto']['20'].mapValue.fields.Pollutant.stringValue;Pollutant_list[21]=doc['_fieldsProto']['21'].mapValue.fields.Pollutant.stringValue;Pollutant_list[22]=doc['_fieldsProto']['22'].mapValue.fields.Pollutant.stringValue;Pollutant_list[23]=doc['_fieldsProto']['23'].mapValue.fields.Pollutant.stringValue;Pollutant_list[24]=doc['_fieldsProto']['24'].mapValue.fields.Pollutant.stringValue;Pollutant_list[25]=doc['_fieldsProto']['25'].mapValue.fields.Pollutant.stringValue;Pollutant_list[26]=doc['_fieldsProto']['26'].mapValue.fields.Pollutant.stringValue;Pollutant_list[27]=doc['_fieldsProto']['27'].mapValue.fields.Pollutant.stringValue;Pollutant_list[28]=doc['_fieldsProto']['28'].mapValue.fields.Pollutant.stringValue;Pollutant_list[29]=doc['_fieldsProto']['29'].mapValue.fields.Pollutant.stringValue;Pollutant_list[30]=doc['_fieldsProto']['30'].mapValue.fields.Pollutant.stringValue;Pollutant_list[31]=doc['_fieldsProto']['31'].mapValue.fields.Pollutant.stringValue;Pollutant_list[32]=doc['_fieldsProto']['32'].mapValue.fields.Pollutant.stringValue;Pollutant_list[33]=doc['_fieldsProto']['33'].mapValue.fields.Pollutant.stringValue;Pollutant_list[34]=doc['_fieldsProto']['34'].mapValue.fields.Pollutant.stringValue;Pollutant_list[35]=doc['_fieldsProto']['35'].mapValue.fields.Pollutant.stringValue;Pollutant_list[36]=doc['_fieldsProto']['36'].mapValue.fields.Pollutant.stringValue;Pollutant_list[37]=doc['_fieldsProto']['37'].mapValue.fields.Pollutant.stringValue;Pollutant_list[38]=doc['_fieldsProto']['38'].mapValue.fields.Pollutant.stringValue;Pollutant_list[39]=doc['_fieldsProto']['39'].mapValue.fields.Pollutant.stringValue;Pollutant_list[40]=doc['_fieldsProto']['40'].mapValue.fields.Pollutant.stringValue;Pollutant_list[41]=doc['_fieldsProto']['41'].mapValue.fields.Pollutant.stringValue;Pollutant_list[42]=doc['_fieldsProto']['42'].mapValue.fields.Pollutant.stringValue;Pollutant_list[43]=doc['_fieldsProto']['43'].mapValue.fields.Pollutant.stringValue;Pollutant_list[44]=doc['_fieldsProto']['44'].mapValue.fields.Pollutant.stringValue;Pollutant_list[45]=doc['_fieldsProto']['45'].mapValue.fields.Pollutant.stringValue;Pollutant_list[46]=doc['_fieldsProto']['46'].mapValue.fields.Pollutant.stringValue;Pollutant_list[47]=doc['_fieldsProto']['47'].mapValue.fields.Pollutant.stringValue;Pollutant_list[48]=doc['_fieldsProto']['48'].mapValue.fields.Pollutant.stringValue;Pollutant_list[49]=doc['_fieldsProto']['49'].mapValue.fields.Pollutant.stringValue;Pollutant_list[50]=doc['_fieldsProto']['50'].mapValue.fields.Pollutant.stringValue;Pollutant_list[51]=doc['_fieldsProto']['51'].mapValue.fields.Pollutant.stringValue;Pollutant_list[52]=doc['_fieldsProto']['52'].mapValue.fields.Pollutant.stringValue;Pollutant_list[53]=doc['_fieldsProto']['53'].mapValue.fields.Pollutant.stringValue;Pollutant_list[54]=doc['_fieldsProto']['54'].mapValue.fields.Pollutant.stringValue;Pollutant_list[55]=doc['_fieldsProto']['55'].mapValue.fields.Pollutant.stringValue;Pollutant_list[56]=doc['_fieldsProto']['56'].mapValue.fields.Pollutant.stringValue;Pollutant_list[57]=doc['_fieldsProto']['57'].mapValue.fields.Pollutant.stringValue;Pollutant_list[58]=doc['_fieldsProto']['58'].mapValue.fields.Pollutant.stringValue;Pollutant_list[59]=doc['_fieldsProto']['59'].mapValue.fields.Pollutant.stringValue;Pollutant_list[60]=doc['_fieldsProto']['60'].mapValue.fields.Pollutant.stringValue;Pollutant_list[61]=doc['_fieldsProto']['61'].mapValue.fields.Pollutant.stringValue;Pollutant_list[62]=doc['_fieldsProto']['62'].mapValue.fields.Pollutant.stringValue;Pollutant_list[63]=doc['_fieldsProto']['63'].mapValue.fields.Pollutant.stringValue;Pollutant_list[64]=doc['_fieldsProto']['64'].mapValue.fields.Pollutant.stringValue;Pollutant_list[65]=doc['_fieldsProto']['65'].mapValue.fields.Pollutant.stringValue;Pollutant_list[66]=doc['_fieldsProto']['66'].mapValue.fields.Pollutant.stringValue;Pollutant_list[67]=doc['_fieldsProto']['67'].mapValue.fields.Pollutant.stringValue;Pollutant_list[68]=doc['_fieldsProto']['68'].mapValue.fields.Pollutant.stringValue;Pollutant_list[69]=doc['_fieldsProto']['69'].mapValue.fields.Pollutant.stringValue;Pollutant_list[70]=doc['_fieldsProto']['70'].mapValue.fields.Pollutant.stringValue;Pollutant_list[71]=doc['_fieldsProto']['71'].mapValue.fields.Pollutant.stringValue;Pollutant_list[72]=doc['_fieldsProto']['72'].mapValue.fields.Pollutant.stringValue;Pollutant_list[73]=doc['_fieldsProto']['73'].mapValue.fields.Pollutant.stringValue;Pollutant_list[74]=doc['_fieldsProto']['74'].mapValue.fields.Pollutant.stringValue;Pollutant_list[75]=doc['_fieldsProto']['75'].mapValue.fields.Pollutant.stringValue;Pollutant_list[76]=doc['_fieldsProto']['76'].mapValue.fields.Pollutant.stringValue;Pollutant_list[77]=doc['_fieldsProto']['77'].mapValue.fields.Pollutant.stringValue;Pollutant_list[78]=doc['_fieldsProto']['78'].mapValue.fields.Pollutant.stringValue;Pollutant_list[79]=doc['_fieldsProto']['79'].mapValue.fields.Pollutant.stringValue;Pollutant_list[80]=doc['_fieldsProto']['80'].mapValue.fields.Pollutant.stringValue;Pollutant_list[81]=doc['_fieldsProto']['81'].mapValue.fields.Pollutant.stringValue;
 })});

});

app.intent('縣市查詢結果', (conv, input, option) => {

if(option_array.indexOf(option)!==-1){
  if (option === "Northen") {
  if(conv.screen){conv.ask('請選擇您在「北部地區」要查詢的縣市');}
  else{conv.ask(new SimpleResponse({               
              speech: `<speak><p><s>請選擇您在北部地區要查詢的縣市!</s><s>選項有以下幾個<break time="0.5s"/>臺北市<break time="0.2s"/>基隆市<break time="0.2s"/>新北市<break time="0.2s"/>桃園市<break time="0.2s"/>新竹縣<break time="0.2s"/>新竹市<break time="1s"/>請選擇。</s></p></speak>`,
  text: '請選擇要查詢的縣市。'}));}
conv.ask(new Carousel({
    items: {
    'Taipei': {
      title: '臺北市',
      description: '士林、大同、中山  \n古亭、松山、陽明  \n萬華',
    },
    '基隆': {
      title: '基隆市',
  description: '基隆\n',
    },
    'New_Taipei1': {
      title: '新北市(一)',
      description: '三重、土城、永和  \n汐止、板橋、林口',
    },
    'New_Taipei2': {
      title: '新北市(二)',
      description: '淡水、富貴角、菜寮  \n新店、新莊、萬里',
    },
	'Taoyuan': {
      title: '桃園市',
      description: '大園、中壢、平鎮  \n桃園、觀音工業區  \n龍潭、觀音',
    },
	'Hsinchu County': {
      title: '新竹縣',
      description: '竹東、湖口\n',
    },
	'Hsinchu City': {
      title: '新竹市',
      description: '新竹、香山\n',
    }
  },
}));  } 
  else if (option === "Central") {

  if(conv.screen){conv.ask('請選擇您在「中部地區」要查詢的縣市');}
  else{conv.ask(new SimpleResponse({               
              speech: `<speak><p><s>請選擇您在中部地區要查詢的縣市!</s><s>選項有以下幾個<break time="0.5s"/>苗栗縣<break time="0.2s"/>台中市<break time="0.2s"/>彰化縣<break time="0.2s"/>南投縣<break time="0.2s"/>雲林縣<break time="1s"/>請選擇。</s></p></speak>`,
              text: '請選擇要查詢的縣市。'}));}

conv.ask(new Carousel({
    items: {
    'Miaoli': {
      title: '苗栗縣',
      description: '三義、苗栗、頭份\n',
    },
    'Taichung': {
      title: '臺中市',
      description: '大里、西屯、沙鹿  \n忠明、豐原',
    },
    'Changhua': {
      title: '彰化縣',
      description: '二林、彰化、大城  \n線西',
    },
	'Nantou': {
      title: '南投縣',
      description: '竹山、南投、埔里\n',
    },
	'Yunlin': {
      title: '雲林縣',
      description: '斗六、崙背、麥寮  \n臺西',
    }
  },
}));  }
  else if (option === "Southen") {
	  
 if(conv.screen){conv.ask('請選擇您在「南部地區」要查詢的縣市');}
  else{conv.ask(new SimpleResponse({               
              speech: `<speak><p><s>請選擇您在南部地區要查詢的縣市!</s><s>選項有以下幾個<break time="0.5s"/>嘉義縣市<break time="0.2s"/>台南市<break time="0.2s"/>北高雄市<break time="0.2s"/>南高雄市<break time="0.2s"/>屏東縣<break time="1s"/>請選擇。</s></p></speak>`,
			  text: '請選擇要查詢的縣市。'}));}
  
  conv.ask(new Carousel({
    items: {
    'Chiayi County': {
      title: '嘉義縣市',
      description: '嘉義、朴子、新港\n',
    },
    'Tainan': {
      title: '台南市',
      description: '安南、善化、新營  \n臺南、麻豆',
    },
    'NKaohsiung': {
      title: '北高雄市',
      description: '美濃、橋頭、楠梓  \n仁武、左營、前金',
    },
    'SKaohsiung': {
      title: '南高雄市',
      description: '鳳山、復興、前鎮  \n小港、大寮、林園',
    },
	'Pingtung': {
      title: '屏東縣',
      description: '屏東、琉球、恆春  \n潮州',
    }
  },
}));  }
  else if (option === "East") {
  
  if(conv.screen){conv.ask('以下是「東部地區」的監測站列表');
  }else{conv.ask(new SimpleResponse({               
              speech: `<speak><p><s>以下是「東部地區」的監測站列表</s><s>選項有以下幾個<break time="0.5s"/>冬山<break time="0.2s"/>宜蘭<break time="0.2s"/>花蓮<break time="0.2s"/>台東<break time="0.2s"/>關山<break time="1s"/>請選擇。</s></p></speak>`,
  text: '以下是「東部地區」的監測站列表'}));}

	AQI1=AQI_list[14];AQI2=AQI_list[26];AQI3=AQI_list[32];AQI4=AQI_list[70];AQI5=AQI_list[80];

  picurl1= picture_generator(parseInt(AQI1));
  picurl2= picture_generator(parseInt(AQI2));
  picurl3= picture_generator(parseInt(AQI3));
  picurl4= picture_generator(parseInt(AQI4));
  picurl5= picture_generator(parseInt(AQI5));
  status1= status_generator(parseInt(AQI1));
  status2= status_generator(parseInt(AQI2));
  status3= status_generator(parseInt(AQI3));
  status4= status_generator(parseInt(AQI4));
  status5= status_generator(parseInt(AQI5));

  conv.ask(new Carousel({
    items: {
    '冬山': {
      title: '冬山',
      description: status1,
      image: new Image({url: picurl1,alt: 'Image alternate text',}),},
    '宜蘭': {
      title: '宜蘭',
      description: status2,
      image: new Image({url: picurl2,alt: 'Image alternate text',}),},
    '花蓮': {
      title: '花蓮',
      description: status3,
      image: new Image({url: picurl3,alt: 'Image alternate text',}),},
    '臺東': {
      title: '臺東',
      description: status4,
      image: new Image({url: picurl4,alt: 'Image alternate text',}),},
    '關山': {
      title: '關山',
      description: status5,
      image: new Image({url: picurl5,alt: 'Image alternate text',}),},
  },
}));  }
  else if (option === "Outlying_island") {
    if(conv.screen){conv.ask('以下是「離島地區」的監測站列表');}
   else{conv.ask(new SimpleResponse({               
              speech: `<speak><p><s>以下是「離島地區」的監測站列表</s><s>選項有以下幾個<break time="0.5s"/>金門<break time="0.2s"/>馬祖<break time="0.2s"/>馬公<break time="1s"/>請選擇。</s></p></speak>`,
              text: '以下是「離島地區」的監測站列表'}));}
	AQI1=AQI_list[33];AQI2=AQI_list[46];AQI3=AQI_list[45];
  picurl1= picture_generator(parseInt(AQI1));
  picurl2= picture_generator(parseInt(AQI2));
  picurl3= picture_generator(parseInt(AQI3));
  status1= status_generator(parseInt(AQI1));
  status2= status_generator(parseInt(AQI2));
  status3= status_generator(parseInt(AQI3));

  conv.ask(new Carousel({
    items: {
    '金門': {
      title: '金門',
      description: status1,
      image: new Image({url: picurl1,alt: 'Image alternate text',}),},
    '馬祖': {
      title: '馬祖',
      description: status2,
      image: new Image({url: picurl2,alt: 'Image alternate text',}),},
    '馬公': {
      title: '馬公',
      description: status3,
      image: new Image({url: picurl3,alt: 'Image alternate text',}),},
  }
}));  }
  else if (option === "Taipei") {

	AQI1=AQI_list[4];AQI2=AQI_list[5];AQI3=AQI_list[10];AQI4=AQI_list[15];AQI5=AQI_list[28];AQI6=AQI_list[56];AQI7=AQI_list[65];

  picurl1= picture_generator(parseInt(AQI1));
  picurl2= picture_generator(parseInt(AQI2));
  picurl3= picture_generator(parseInt(AQI3));
  picurl4= picture_generator(parseInt(AQI4));
  picurl5= picture_generator(parseInt(AQI5));
  picurl6= picture_generator(parseInt(AQI6));
  picurl7= picture_generator(parseInt(AQI7));
  status1= status_generator(parseInt(AQI1));
  status2= status_generator(parseInt(AQI2));
  status3= status_generator(parseInt(AQI3));
  status4= status_generator(parseInt(AQI4));
  status5= status_generator(parseInt(AQI5));
  status6= status_generator(parseInt(AQI6));
  status7= status_generator(parseInt(AQI7));
   
    if(conv.screen){conv.ask('以下是「臺北市」的監測站列表');}
  else{conv.ask(new SimpleResponse({               
              speech: `<speak><p><s>以下是「臺北市」的監測站列表</s><s>選項有以下幾個<break time="0.5s"/>士林<break time="0.2s"/>大同<break time="0.2s"/>中山<break time="0.2s"/>古亭<break time="0.2s"/>松山<break time="0.2s"/>陽明<break time="0.2s"/>萬華<break time="1s"/>請選擇。</s></p></speak>`,
              text: '以下是「臺北市」的監測站列表'}));}
  conv.ask(new Carousel({
  title: 'Carousel Title',
  items: {
    '士林': {
      title: '士林',
      description: status1,
      image: new Image({url: picurl1,alt: 'Image alternate text',}),},
    '大同': {
      title: '大同',
      description: status2,
      image: new Image({url: picurl2,alt: 'Image alternate text',}),},
    '中山': {
      title: '中山',
      description: status3,
      image: new Image({url: picurl3,alt: 'Image alternate text',}),},
    '古亭': {
      title: '古亭',
      description: status4,
      image: new Image({url: picurl4,alt: 'Image alternate text',}),},
    '松山': {
      title: '松山',
      description: status5,
      image: new Image({url: picurl5,alt: 'Image alternate text',}),},
    '陽明': {
      title: '陽明',
      description: status6,
      image: new Image({url: picurl6,alt: 'Image alternate text',}),},
    '萬華': {
      title: '萬華',
      description: status7,
      image: new Image({url: picurl7,alt: 'Image alternate text',}),}
},
}));			  
}
  else if (option === "New_Taipei1") {
    if(conv.screen){conv.ask(new SimpleResponse({               
              speech: `<speak><p><s>以下是「新北市」第一部分的監測站列表</s></p></speak>`,
              text: '以下是「新北市(一)」的監測站列表'}));}
  else{conv.ask(new SimpleResponse({               
              speech: `<speak><p><s>以下是「新北市」第一部分的監測站列表</s><s>選項有以下幾個<break time="0.5s"/>三重<break time="0.2s"/>土城<break time="0.2s"/>永和<break time="0.2s"/>汐止<break time="0.2s"/>板橋<break time="0.2s"/>林口<break time="1s"/>請選擇。</s></p></speak>`,
              text: '以下是「新北市」第一部分的監測站列表'}));}
	AQI1=AQI_list[1];AQI2=AQI_list[3];AQI3=AQI_list[18];AQI4=AQI_list[21];AQI5=AQI_list[29];AQI6=AQI_list[30];
  picurl1= picture_generator(parseInt(AQI1));
  picurl2= picture_generator(parseInt(AQI2));
  picurl3= picture_generator(parseInt(AQI3));
  picurl4= picture_generator(parseInt(AQI4));
  picurl5= picture_generator(parseInt(AQI5));
  picurl6= picture_generator(parseInt(AQI6));
  status1= status_generator(parseInt(AQI1));
  status2= status_generator(parseInt(AQI2));
  status3= status_generator(parseInt(AQI3));
  status4= status_generator(parseInt(AQI4));
  status5= status_generator(parseInt(AQI5));
  status6= status_generator(parseInt(AQI6));
   
  conv.ask(new Carousel({
  title: 'Carousel Title',
  items: {
    '三重': {
      title: '三重',
      description: status1,
      image: new Image({url: picurl1,alt: 'Image alternate text',}),},
    '土城': {
      title: '土城',
      description: status2,
      image: new Image({url: picurl2,alt: 'Image alternate text',}),},
    '永和': {
      title: '永和',
      description: status3,
      image: new Image({url: picurl3,alt: 'Image alternate text',}),},
    '汐止': {
      title: '汐止',
      description: status4,
      image: new Image({url: picurl4,alt: 'Image alternate text',}),},
    '板橋': {
      title: '板橋',
      description: status5,
      image: new Image({url: picurl5,alt: 'Image alternate text',}),},
    '林口': {
      title: '林口',
      description: status6,
      image: new Image({url: picurl6,alt: 'Image alternate text',}),},
},
}));			  
  }
  else if (option === "New_Taipei2") {
  
  if(conv.screen){conv.ask(new SimpleResponse({               
              speech: `<speak><p><s>以下是「新北市」第二部分的監測站列表</s></p></speak>`,
              text: '以下是「新北市(二)」的監測站列表'}));}
  else{conv.ask(new SimpleResponse({               
              speech: `<speak><p><s>以下是「新北市」第二部分的監測站列表</s><s>選項有以下幾個<break time="0.5s"/>淡水<break time="0.2s"/>富貴角<break time="0.2s"/>菜寮<break time="0.2s"/>新店<break time="0.2s"/>新莊<break time="0.2s"/>萬里<break time="1s"/>請選擇。</s></p></speak>`,
              text: '以下是「新北市」第二部分的監測站列表'}));}
	AQI1=AQI_list[49];AQI2=AQI_list[52];AQI3=AQI_list[55];AQI4=AQI_list[59];AQI5=AQI_list[60];AQI6=AQI_list[64];
  picurl1= picture_generator(parseInt(AQI1));
  picurl2= picture_generator(parseInt(AQI2));
  picurl3= picture_generator(parseInt(AQI3));
  picurl4= picture_generator(parseInt(AQI4));
  picurl5= picture_generator(parseInt(AQI5));
  picurl6= picture_generator(parseInt(AQI6));
  status1= status_generator(parseInt(AQI1));
  status2= status_generator(parseInt(AQI2));
  status3= status_generator(parseInt(AQI3));
  status4= status_generator(parseInt(AQI4));
  status5= status_generator(parseInt(AQI5));
  status6= status_generator(parseInt(AQI6));

  conv.ask(new Carousel({
  title: 'Carousel Title',
  items: {
    '淡水': {
      title: '淡水',
      description: status1,
      image: new Image({url: picurl1,alt: 'Image alternate text',}),},
    '富貴角': {
      title: '富貴角',
      description: status2,
      image: new Image({url: picurl2,alt: 'Image alternate text',}),},
    '菜寮': {
      title: '菜寮',
      description: status3,
      image: new Image({url: picurl3,alt: 'Image alternate text',}),},
    '新店': {
      title: '新店',
      description: status4,
      image: new Image({url: picurl4,alt: 'Image alternate text',}),},
    '新莊': {
      title: '新莊',
      description: status5,
      image: new Image({url: picurl5,alt: 'Image alternate text',}),},
    '萬里': {
      title: '萬里',
      description: status6,
      image: new Image({url: picurl6,alt: 'Image alternate text',}),},
},
}));			  
  }
  else if (option === "Taoyuan") {

    if(conv.screen){conv.ask('以下是「桃園市」的監測站列表');}
  else{conv.ask(new SimpleResponse({               
              speech: `<speak><p><s>以下是「桃園市」的監測站列表</s><s>選項有以下幾個<break time="0.5s"/>大園<break time="0.2s"/>中壢<break time="0.2s"/>平鎮<break time="0.2s"/>桃園<break time="0.2s"/>觀音工業區<break time="0.2s"/>龍潭<break time="0.2s"/>觀音<break time="1s"/>請選擇。</s></p></speak>`,
              text: '以下是「桃園市」的監測站列表'}));}
	AQI1=AQI_list[7];AQI2=AQI_list[11];AQI3=AQI_list[17];AQI4=AQI_list[43];AQI5=AQI_list[44];AQI6=AQI_list[78];AQI7=AQI_list[81];
  picurl1= picture_generator(parseInt(AQI1));
  picurl2= picture_generator(parseInt(AQI2));
  picurl3= picture_generator(parseInt(AQI3));
  picurl4= picture_generator(parseInt(AQI4));
  picurl5= picture_generator(parseInt(AQI5));
  picurl6= picture_generator(parseInt(AQI6));
  picurl7= picture_generator(parseInt(AQI7));
  status1= status_generator(parseInt(AQI1));
  status2= status_generator(parseInt(AQI2));
  status3= status_generator(parseInt(AQI3));
  status4= status_generator(parseInt(AQI4));
  status5= status_generator(parseInt(AQI5));
  status6= status_generator(parseInt(AQI6));
  status7= status_generator(parseInt(AQI7));		  
  conv.ask(new Carousel({
    items: {
    '大園': {
      title: '大園',
      description: status1,
      image: new Image({url: picurl1,alt: 'Image alternate text',}),},
    '中壢': {
      title: '中壢',
      description: status2,
      image: new Image({url: picurl2,alt: 'Image alternate text',}),},
    '平鎮': {
      title: '平鎮',
      description: status3,
      image: new Image({url: picurl3,alt: 'Image alternate text',}),},
    '桃園': {
      title: '桃園',
      description: status4,
      image: new Image({url: picurl4,alt: 'Image alternate text',}),},
    '觀音工業區': {
      title: '觀音工業區',
      description: status5,
      image: new Image({url: picurl5,alt: 'Image alternate text',}),},
    '龍潭': {
      title: '龍潭',
      description: status6,
      image: new Image({url: picurl6,alt: 'Image alternate text',}),},
    '觀音': {
      title: '觀音',
      description: status7,
      image: new Image({url: picurl7,alt: 'Image alternate text',}),},
  },
}));  }
  else if (option === "Hsinchu City") {

  if(conv.screen){conv.ask('以下是「新竹市」的監測站列表');}
  else{conv.ask(new SimpleResponse({               
              speech: `<speak><p><s>以下是「新竹市」的監測站列表</s><s>選項有以下幾個<break time="0.5s"/>新竹<break time="0.2s"/>香山<break time="1s"/>請選擇。</s></p></speak>`,
              text: '以下是「新竹市」的監測站列表'}));}
	AQI1=AQI_list[57];AQI2=AQI_list[58];
  picurl1= picture_generator(parseInt(AQI1));
  picurl2= picture_generator(parseInt(AQI2));
  status1= status_generator(parseInt(AQI1));
  status2= status_generator(parseInt(AQI2));
  conv.ask(new Carousel({
    items: {
    '新竹': {
      title: '新竹',
      description: status1,
      image: new Image({url: picurl1,alt: 'Image alternate text',}),},
    '香山': {
      title: '香山',
      description: status2,
      image: new Image({url: picurl2,alt: 'Image alternate text',}),},
  },
}));  }
  else if (option === "Hsinchu County") {
 
  if(conv.screen){conv.ask('以下是「新竹縣」的監測站列表');}
  else{conv.ask(new SimpleResponse({               
              speech: `<speak><p><s>以下是「新竹縣」的監測站列表</s><s>選項有以下幾個<break time="0.5s"/>竹東<break time="0.2s"/>湖口<break time="1s"/>請選擇。</s></p></speak>`,
              text: '以下是「新竹縣」的監測站列表'}));}
	AQI1=AQI_list[23];AQI2=AQI_list[54];
  picurl1= picture_generator(parseInt(AQI1));
  picurl2= picture_generator(parseInt(AQI2));
  status1= status_generator(parseInt(AQI1));
  status2= status_generator(parseInt(AQI2));
  conv.ask(new Carousel({
    items: {
    '竹東': {
      title: '竹東',
      description: status1,
      image: new Image({url: picurl1,alt: 'Image alternate text',}),},
    '湖口': {
      title: '湖口',
      description: status2,
      image: new Image({url: picurl2,alt: 'Image alternate text',}),},
  },
}));  }
  else if (option === "Miaoli") {
 
 if(conv.screen){conv.ask('以下是「苗栗縣」的監測站列表');}
  else{conv.ask(new SimpleResponse({               
              speech: `<speak><p><s>以下是「苗栗縣」的監測站列表</s><s>選項有以下幾個<break time="0.5s"/>三義<break time="0.2s"/>苗栗<break time="0.2s"/>頭份<break time="1s"/>請選擇。</s></p></speak>`,
              text: '以下是「苗栗縣」的監測站列表'}));}
	AQI1=AQI_list[2];AQI2=AQI_list[41];AQI3=AQI_list[77];
  picurl1= picture_generator(parseInt(AQI1));
  picurl2= picture_generator(parseInt(AQI2));
  picurl3= picture_generator(parseInt(AQI3));
  status1= status_generator(parseInt(AQI1));
  status2= status_generator(parseInt(AQI2));
  status3= status_generator(parseInt(AQI3));

  conv.ask(new Carousel({
    items: {
    '三義': {
      title: '三義',
      description: status1,
      image: new Image({url: picurl1,alt: 'Image alternate text',}),},
    '苗栗': {
      title: '苗栗',
      description: status2,
      image: new Image({url: picurl2,alt: 'Image alternate text',}),},
    '頭份': {
      title: '頭份',
      description: status3,
      image: new Image({url: picurl3,alt: 'Image alternate text',}),},
  },
}));  }
  else if (option === "Taichung") {
    
	if(conv.screen){conv.ask('以下是「臺中市」的監測站列表');}
  else{conv.ask(new SimpleResponse({               
              speech: `<speak><p><s>以下是「臺中市」的監測站列表</s><s>選項有以下幾個<break time="0.5s"/>大里<break time="0.2s"/>西屯<break time="0.2s"/>沙鹿<break time="0.2s"/>忠明<break time="0.2s"/>豐原<break time="1s"/>請選擇。</s></p></speak>`,
              text: '以下是「臺中市」的監測站列表'}));}
	AQI1=AQI_list[6];AQI2=AQI_list[24];AQI3=AQI_list[25];AQI4=AQI_list[27];AQI5=AQI_list[79];
  picurl1= picture_generator(parseInt(AQI1));
  picurl2= picture_generator(parseInt(AQI2));
  picurl3= picture_generator(parseInt(AQI3));
  picurl4= picture_generator(parseInt(AQI4));
  picurl5= picture_generator(parseInt(AQI5));
  picurl6= picture_generator(parseInt(AQI6));
  status1= status_generator(parseInt(AQI1));
  status2= status_generator(parseInt(AQI2));
  status3= status_generator(parseInt(AQI3));
  status4= status_generator(parseInt(AQI4));
  status5= status_generator(parseInt(AQI5));
  status6= status_generator(parseInt(AQI6));

  conv.ask(new Carousel({
    items: {
    '大里': {
      title: '大里',
      description: status1,
      image: new Image({url: picurl1,alt: 'Image alternate text',}),},
    '西屯': {
      title: '西屯',
      description: status2,
      image: new Image({url: picurl2,alt: 'Image alternate text',}),},
    '沙鹿': {
      title: '沙鹿',
      description: status3,
      image: new Image({url: picurl3,alt: 'Image alternate text',}),},
    '忠明': {
      title: '忠明',
      description: status4,
      image: new Image({url: picurl4,alt: 'Image alternate text',}),},
    '豐原': {
      title: '豐原',
      description: status5,
      image: new Image({url: picurl5,alt: 'Image alternate text',}),},
  },
}));  }
  else if (option === "Changhua") {
	  
    if(conv.screen){conv.ask('以下是「彰化縣」的監測站列表');}
  else{conv.ask(new SimpleResponse({               
              speech: `<speak><p><s>以下是「彰化縣」的監測站列表</s><s>選項有以下幾個<break time="0.5s"/>二林<break time="0.2s"/>彰化<break time="0.2s"/>大城<break time="0.2s"/>線西<break time="1s"/>請選擇。</s></p></speak>`,
              text: '以下是「彰化縣」的監測站列表'}));}
	AQI1=AQI_list[0];AQI2=AQI_list[67];AQI3=AQI_list[68];AQI4=AQI_list[75];
  picurl1= picture_generator(parseInt(AQI1));
  picurl2= picture_generator(parseInt(AQI2));
  picurl3= picture_generator(parseInt(AQI3));
  picurl4= picture_generator(parseInt(AQI4));
  status1= status_generator(parseInt(AQI1));
  status2= status_generator(parseInt(AQI2));
  status3= status_generator(parseInt(AQI3));
  status4= status_generator(parseInt(AQI4));

  conv.ask(new Carousel({
    items: {
    '二林': {
      title: '二林',
      description: status1,
      image: new Image({url: picurl1,alt: 'Image alternate text',}),},
    '彰化': {
      title: '彰化',
      description: status2,
      image: new Image({url: picurl2,alt: 'Image alternate text',}),},
    '大城': {
      title: '大城',
      description: status3,
      image: new Image({url: picurl3,alt: 'Image alternate text',}),},
    '線西': {
      title: '線西',
      description: status4,
      image: new Image({url: picurl4,alt: 'Image alternate text',}),},
  },
}));  }
  else if (option === "Nantou") {

  if(conv.screen){conv.ask('以下是「南投縣」的監測站列表');}
  else{conv.ask(new SimpleResponse({               
              speech: `<speak><p><s>以下是「南投縣」的監測站列表</s><s>選項有以下幾個<break time="0.5s"/>竹山<break time="0.2s"/>南投<break time="0.2s"/>埔里<break time="1s"/>請選擇。</s></p></speak>`,
              text: '以下是「南投縣」的監測站列表'}));}
	AQI1=AQI_list[22];AQI2=AQI_list[36];AQI3=AQI_list[42];
  picurl1= picture_generator(parseInt(AQI1));
  picurl2= picture_generator(parseInt(AQI2));
  picurl3= picture_generator(parseInt(AQI3));
  status1= status_generator(parseInt(AQI1));
  status2= status_generator(parseInt(AQI2));
  status3= status_generator(parseInt(AQI3));

  conv.ask(new Carousel({
    items: {
    '竹山': {
      title: '竹山',
      description: status1,
      image: new Image({url: picurl1,alt: 'Image alternate text',}),},
    '南投': {
      title: '南投',
      description: status2,
      image: new Image({url: picurl2,alt: 'Image alternate text',}),},
    '埔里': {
      title: '埔里',
      description: status3,
      image: new Image({url: picurl3,alt: 'Image alternate text',}),},
  },
}));  }
  else if (option === "Yunlin") {
   
   if(conv.screen){conv.ask('以下是「雲林縣」的監測站列表');}
  else{conv.ask(new SimpleResponse({               
              speech: `<speak><p><s>以下是「雲林縣」的監測站列表</s><s>選項有以下幾個<break time="0.5s"/>斗六<break time="0.2s"/>崙背<break time="0.2s"/>麥寮<break time="0.2s"/>臺西<break time="1s"/>請選擇。</s></p></speak>`,
              text: '以下是「雲林縣」的監測站列表'}));}
	AQI1=AQI_list[13];AQI2=AQI_list[48];AQI3=AQI_list[50];AQI4=AQI_list[69];
  picurl1= picture_generator(parseInt(AQI1));
  picurl2= picture_generator(parseInt(AQI2));
  picurl3= picture_generator(parseInt(AQI3));
  picurl4= picture_generator(parseInt(AQI4));
  status1= status_generator(parseInt(AQI1));
  status2= status_generator(parseInt(AQI2));
  status3= status_generator(parseInt(AQI3));
  status4= status_generator(parseInt(AQI4));

  conv.ask(new Carousel({
    items: {
    '斗六': {
      title: '斗六',
      description: status1,
      image: new Image({url: picurl1,alt: 'Image alternate text',}),},
    '崙背': {
      title: '崙背',
      description: status2,
      image: new Image({url: picurl2,alt: 'Image alternate text',}),},
    '麥寮': {
      title: '麥寮',
      description: status3,
      image: new Image({url: picurl3,alt: 'Image alternate text',}),},
    '臺西': {
      title: '臺西',
      description: status4,
      image: new Image({url: picurl4,alt: 'Image alternate text',}),},
  },
}));  }
  else if (option === "Chiayi County") {
    if(conv.screen){conv.ask('以下是「嘉義縣市」的監測站列表');}
  else{conv.ask(new SimpleResponse({               
              speech: `<speak><p><s>以下是「嘉義縣市」的監測站列表</s><s>選項有以下幾個<break time="0.5s"/>嘉義<break time="0.2s"/>朴子<break time="0.2s"/>新港<break time="1s"/>請選擇。</s></p></speak>`,
              text: '以下是「嘉義縣市」的監測站列表'}));}

   AQI1=AQI_list[66];
   AQI2=AQI_list[20];
   AQI3=AQI_list[61];

  picurl1= picture_generator(parseInt(AQI1));
  picurl2= picture_generator(parseInt(AQI2));
  picurl3= picture_generator(parseInt(AQI3));
  status1= status_generator(parseInt(AQI1));
  status2= status_generator(parseInt(AQI2));
  status3= status_generator(parseInt(AQI3));

  conv.ask(new Carousel({
    items: {
    '嘉義': {
      title: '嘉義',
      description: status1,
      image: new Image({url: picurl1,alt: 'Image alternate text',}),},
    '朴子': {
      title: '朴子',
      description: status2,
      image: new Image({url: picurl2,alt: 'Image alternate text',}),},
    '新港': {
      title: '新港',
      description: status3,
      image: new Image({url: picurl3,alt: 'Image alternate text',}),},
  },
}));  }
  else if (option === "Tainan") {

  if(conv.screen){conv.ask('以下是「臺南市」的監測站列表');}
  else{conv.ask(new SimpleResponse({               
              speech: `<speak><p><s>以下是「臺南市」的監測站列表</s><s>選項有以下幾個<break time="0.5s"/>安南<break time="0.2s"/>善化<break time="0.2s"/>新營<break time="0.2s"/>臺南<break time="0.2s"/>麻豆<break time="1s"/>請選擇。</s></p></speak>`,
              text: '以下是「臺南市」的監測站列表'}));}
	AQI1=AQI_list[19];AQI2=AQI_list[51];AQI3=AQI_list[62];AQI4=AQI_list[71];AQI5=AQI_list[72];

  picurl1= picture_generator(parseInt(AQI1));
  picurl2= picture_generator(parseInt(AQI2));
  picurl3= picture_generator(parseInt(AQI3));
  picurl4= picture_generator(parseInt(AQI4));
  picurl5= picture_generator(parseInt(AQI5));
  status1= status_generator(parseInt(AQI1));
  status2= status_generator(parseInt(AQI2));
  status3= status_generator(parseInt(AQI3));
  status4= status_generator(parseInt(AQI4));
  status5= status_generator(parseInt(AQI5));
  
  conv.ask(new Carousel({
    items: {
    '安南': {
      title: '安南',
      description: status1,
      image: new Image({url: picurl1,alt: 'Image alternate text',}),},
    '善化': {
      title: '善化',
      description: status2,
      image: new Image({url: picurl2,alt: 'Image alternate text',}),},
    '新營': {
      title: '新營',
      description: status3,
      image: new Image({url: picurl3,alt: 'Image alternate text',}),},
    '臺南': {
      title: '臺南',
      description: status4,
      image: new Image({url: picurl4,alt: 'Image alternate text',}),},
    '麻豆': {
      title: '麻豆',
      description: status5,
      image: new Image({url: picurl5,alt: 'Image alternate text',}),},
  },
}));  }
  else if (option === "NKaohsiung") {

  if(conv.screen){conv.ask('以下是「北高雄」的監測站列表');}
  else{conv.ask(new SimpleResponse({               
              speech: `<speak><p><s>以下是「北高雄」的監測站列表</s><s>選項有以下幾個<break time="0.5s"/>美濃<break time="0.2s"/>橋頭<break time="0.2s"/>楠梓<break time="0.2s"/>仁武<break time="0.2s"/>左營<break time="0.2s"/>前金<break time="1s"/>請選擇。</s></p></speak>`,
              text: '以下是「北高雄」的監測站列表'}));}
	AQI1=AQI_list[40];AQI2=AQI_list[76];AQI3=AQI_list[63];AQI4=AQI_list[12];AQI5=AQI_list[16];AQI6=AQI_list[34];

  picurl1= picture_generator(parseInt(AQI1));
  picurl2= picture_generator(parseInt(AQI2));
  picurl3= picture_generator(parseInt(AQI3));
  picurl4= picture_generator(parseInt(AQI4));
  picurl5= picture_generator(parseInt(AQI5));
  picurl6= picture_generator(parseInt(AQI6));
  status1= status_generator(parseInt(AQI1));
  status2= status_generator(parseInt(AQI2));
  status3= status_generator(parseInt(AQI3));
  status4= status_generator(parseInt(AQI4));
  status5= status_generator(parseInt(AQI5));
  status6= status_generator(parseInt(AQI6));

  conv.ask(new Carousel({
  title: 'Carousel Title',
  items: {
    '美濃': {
      title: '美濃',
      description: status1,
      image: new Image({url: picurl1,alt: 'Image alternate text',}),},
    '橋頭': {
      title: '橋頭',
      description: status2,
      image: new Image({url: picurl2,alt: 'Image alternate text',}),},
    '楠梓': {
      title: '楠梓',
      description: status3,
      image: new Image({url: picurl3,alt: 'Image alternate text',}),},
    '仁武': {
      title: '仁武',
      description: status4,
      image: new Image({url: picurl4,alt: 'Image alternate text',}),},
    '左營': {
      title: '左營',
      description: status5,
      image: new Image({url: picurl5,alt: 'Image alternate text',}),},
    '前金': {
      title: '前金',
      description: status6,
      image: new Image({url: picurl6,alt: 'Image alternate text',}),},
},
  }));}			  
  else if (option === "SKaohsiung") {

  if(conv.screen){conv.ask('以下是「南高雄」的監測站列表');}
  else{conv.ask(new SimpleResponse({               
              speech: `<speak><p><s>以下是「南高雄」的監測站列表</s><s>選項有以下幾個<break time="0.5s"/>鳳山<break time="0.2s"/>復興<break time="0.2s"/>前鎮<break time="0.2s"/>小港<break time="0.2s"/>大寮<break time="0.2s"/>林園<break time="1s"/>請選擇。</s></p></speak>`,
              text: '以下是「南高雄」的監測站列表'}));}
	AQI1=AQI_list[73];AQI2=AQI_list[53];AQI3=AQI_list[35];AQI4=AQI_list[9];AQI5=AQI_list[8];AQI6=AQI_list[31];

  picurl1= picture_generator(parseInt(AQI1));
  picurl2= picture_generator(parseInt(AQI2));
  picurl3= picture_generator(parseInt(AQI3));
  picurl4= picture_generator(parseInt(AQI4));
  picurl5= picture_generator(parseInt(AQI5));
  picurl6= picture_generator(parseInt(AQI6));
  status1= status_generator(parseInt(AQI1));
  status2= status_generator(parseInt(AQI2));
  status3= status_generator(parseInt(AQI3));
  status4= status_generator(parseInt(AQI4));
  status5= status_generator(parseInt(AQI5));
  status6= status_generator(parseInt(AQI6));

     conv.ask(new Carousel({
  title: 'Carousel Title',
  items: {
    '鳳山': {
      title: '鳳山',
      description: status1,
      image: new Image({url: picurl1,alt: 'Image alternate text',}),},
    '復興': {
      title: '復興',
      description: status2,
      image: new Image({url: picurl2,alt: 'Image alternate text',}),},
    '前鎮': {
      title: '前鎮',
      description: status3,
      image: new Image({url: picurl3,alt: 'Image alternate text',}),},
	  '小港': {
      title: '小港',
      description: status4,
      image: new Image({url: picurl4,alt: 'Image alternate text',}),},
    '大寮': {
      title: '大寮',
      description: status5,
      image: new Image({url: picurl5,alt: 'Image alternate text',}),},
    '林園': {
      title: '林園',
      description: status6,
      image: new Image({url: picurl6,alt: 'Image alternate text',}),},
},
  }));}
  else if (option === "Pingtung") {

  if(conv.screen){conv.ask('以下是「屏東縣」的監測站列表');}
  else{conv.ask(new SimpleResponse({               
              speech: `<speak><p><s>以下是「屏東縣」的監測站列表</s><s>選項有以下幾個<break time="0.5s"/>屏東<break time="0.2s"/>琉球<break time="0.2s"/>恆春<break time="0.2s"/>潮州<break time="1s"/>請選擇。</s></p></speak>`,
              text: '以下是「屏東縣」的監測站列表'}));}
	AQI1=AQI_list[37];AQI2=AQI_list[38];AQI3=AQI_list[39];AQI4=AQI_list[74];

  picurl1= picture_generator(parseInt(AQI1));
  picurl2= picture_generator(parseInt(AQI2));
  picurl3= picture_generator(parseInt(AQI3));
  picurl4= picture_generator(parseInt(AQI4));
  status1= status_generator(parseInt(AQI1));
  status2= status_generator(parseInt(AQI2));
  status3= status_generator(parseInt(AQI3));
  status4= status_generator(parseInt(AQI4));

  conv.ask(new Carousel({
  title: 'Carousel Title',
  items: {
    '屏東': {
      title: '屏東',
      description: status1,
      image: new Image({url: picurl1,alt: 'Image alternate text',}),},
    '琉球': {
      title: '琉球',
      description: status2,
      image: new Image({url: picurl2,alt: 'Image alternate text',}),},
    '恆春': {
      title: '恆春',
      description: status3,
      image: new Image({url: picurl3,alt: 'Image alternate text',}),},
    '潮州': {
      title: '潮州',
      description: status4,
      image: new Image({url: picurl4,alt: 'Image alternate text',}),},
},
  }));}
  else{
    conv.ask(new SimpleResponse({               
              speech: `<speak><p><s>糟糕，查詢似乎發生錯誤。請稍後再試。</s></p></speak>`,
	text: '發生錯誤，請稍後再試一次。'}));	   conv.close(new BasicCard({  
				image: new Image({url:"https://dummyimage.com/1037x539/ef2121/ffffff.png&text=錯誤",alt:'Pictures',}),
				title:'數據加載發生問題',
				subtitle:'請過一段時間後再回來查看', display: 'CROPPED',
  })); 
 }
}else if(station_array.indexOf(option)!==-1){
	indexnumber=station_array.indexOf(option); //取得監測站對應的編號
	db.collection('dataset').get()
  .then((snapshot) => {
    snapshot.forEach((doc) => {
	PublishTime=doc['_fieldsProto'].PublishTime.stringValue;
    });
  })
  .catch((err) => {
    console.log('Error getting documents', err);
  });
    AQI=AQI_list[parseInt(indexnumber)];Pollutant=Pollutant_list[parseInt(indexnumber)];
	Status= status_generator(parseInt(AQI));	
	
	if(Status!=="有效數據不足"){

    if(AQI>=0&&AQI<=50){picture= "https://dummyimage.com/1037x539/1e9165/ffffff.png&text="+AQI;}
	else if(AQI>=51&&AQI<=100){picture= "https://dummyimage.com/1037x539/fc920b/ffffff.png&text="+AQI;}
	else if(AQI>=101&&AQI<=150){picture= "https://dummyimage.com/1037x539/ef4621/ffffff.png&text="+AQI;}
	else if(AQI>=151&&AQI<=199){picture= "https://dummyimage.com/1037x539/b71411/ffffff.png&text="+AQI;}
	else if(AQI>=200&&AQI<=300){picture= "https://dummyimage.com/1037x539/5b0e31/ffffff.png&text="+AQI;}
    else if(AQI>301){picture= "https://dummyimage.com/1037x539/4f1770/ffffff.png&text="+AQI;}

    if(AQI>=0&&AQI<=50){info= "對一般民眾身體健康無影響。";}
	else if(AQI>=51&&AQI<=100){info= "可能對極敏感族群產生輕微影響。";}
	else if(AQI>=101&&AQI<=150){info= "若出現眼痛，咳嗽或喉嚨痛等症狀，英減少戶外活動，避免在戶外劇烈運動，敏感族群必要外出時英配戴口罩。";}
	else if(AQI>=151&&AQI<=199){info= "若出現眼痛，咳嗽或喉嚨痛等症狀，英減少體力消耗及戶外活動，在戶外避免長時間劇烈運動，敏感族群建議留在室內並減少體力消耗活動，必要外出英配戴口罩。"}
	else if(AQI>=200&&AQI<=300){info= "對敏感族群會有明顯惡化的現象，建議留在室內並減少體力消耗活動；一般大眾則視身體狀況，可能產生各種不同的症狀。";}
    else if(AQI>301){info= "健康威脅達到緊急，所有人都可能受到影響。";}

    if(AQI>=0&&AQI<=50){info_output= "對一般民眾身體健康無影響。";}
	else if(AQI>=51&&AQI<=100){info_output= "極特殊敏感族群建議注意  \n可能產生的咳嗽或呼吸急促症狀。";}
	else if(AQI>=101&&AQI<=150){info_output= "1.一般民眾如果有不適，應考慮減少戶外活動。  \n2.學生仍可進行戶外活動，但建議減少長時間劇烈運動。  \n3.有心臟、呼吸道及心血管疾病患者、孩童及老年人，建議減少體力消耗活動及戶外活動，外出應配戴口罩。  \n4.具有氣喘的人可能需增加使用吸入劑的頻率。";}
	else if(AQI>=151&&AQI<=199){info_output= "1.一般民眾如果有不適，應減少體力消耗及戶外活動。  \n2.學生應避免長時間劇烈運動並增加休息時間。  \n3.有心臟、呼吸道及心血管疾病患者、孩童及老年人，建議留在室內減少體力消耗活動，外出應配戴口罩。  \n4.具有氣喘的人可能需增加使用吸入劑的頻率。"}
	else if(AQI>=200&&AQI<=300){info_output= "1.一般民眾應減少戶外活動。  \n2.學生應立即停止戶外活動，並將課程調整於室內進行。  \n3.有心臟、呼吸道及心血管疾病患者、孩童及老年人應留在室內並減少體力消耗活動，外出應配戴口罩。  \n4.具有氣喘的人應增加使用吸入劑的頻率。";}
    else if(AQI>301){info_output= "1.一般民眾應避免戶外活動，室內應緊閉門窗，必要外出應配戴口罩等防護用具。  \n2.學生應立即停止戶外活動，並將課程調整於室內進行。  \n3.有心臟、呼吸道及心血管疾病患者、孩童及老年人應留在室內並避免體力消耗活動，外出應配戴口罩。  \n4.具有氣喘的人應增加使用吸入劑的頻率。";}

	
	if(AQI>=0&&AQI<=50){
		conv.ask(new SimpleResponse({               
              speech: `<speak><p><s>根據最新資料顯示，${option}監測站的AQI指數為${AQI}</s><s>您可放心出外活動!</s></p></speak>`,
	          text: '以下為該監測站的詳細資訊，\n您可放心出外活動!'}));	      output_title='「'+option+'」空氣品質'+Status;}
    else if(AQI>50){
		   conv.ask(new SimpleResponse({               
					  speech: `<speak><p><s>根據最新資料顯示，${option}監測站的AQI指數為${AQI}</s><s>主要汙染源來自${replaceString(Pollutant, '八小時', '')}</s><s>${info}</s></p></speak>`,
			          text: '以下為該監測站的詳細資訊。'}));    output_title='「'+option+'」空氣品質'+Status+'\n主要汙染源 '+Pollutant;}
    
		if(conv.screen){
			conv.ask(new BasicCard({  
					image: new Image({url:picture,alt:'Pictures',}),
					title:output_title,display: 'CROPPED',
					text:info_output+'  \n  \n**測站資訊發布時間** • '+replaceString(PublishTime, '-', '/'),})); 
		    conv.ask(new Suggestions('把它加入日常安排'));	}else{conv.close(`<speak><p><s>歡迎你隨時回來查詢，下次見</s></p></speak>`);}
    
  }else{
    conv.ask(new SimpleResponse({               
              speech: `<speak><p><s>由於${option}監測站正處於維修狀態或數據不足。我無法提供你最新資訊。</s></p></speak>`,
	text: '以下為「'+option+'」監測站的詳細資訊'}));	if(conv.screen){
			conv.ask(new BasicCard({  
					image: new Image({url:"https://dummyimage.com/1037x539/232830/ffffff.png&text=NaN",alt:'Pictures',}),
					title:'有效數據不足',
					text:'設備維護、儀器校正、儀器異常、傳輸異常、電力異常 \n或有效數據不足等需查修維護情形，以致資料暫時中斷服務。  \n  \n**測站資訊發布時間** • '+replaceString(PublishTime, '-', '/'), 
					display: 'CROPPED',
     })); 
	 	conv.ask(new Suggestions('把它加入日常安排'));	}else{conv.close(`<speak><p><s>歡迎你隨時回來查詢，下次見</s></p></speak>`);}

  }

 }else{
	 option="undefined";if(conv.input.type==="VOICE"){ //如果輸入是語音，則顯示錯誤處理方法
		conv.ask(new SimpleResponse({               
				  speech: `<speak><p><s>抱歉，我不懂你的意思</s><s>請試著問我<break time="0.2s"/>${word1}空氣品質如何?<break time="0.2s"/>或<break time="0.2s"/>幫我查詢${word2}</s></p></speak>`,
				  text: '試著提問來快速存取縣市列表，\n或點選建議卡片來進行操作!'}));	if(conv.screen){
		 conv.ask(new BasicCard({  
			title:"語音查詢範例",
			subtitle:"以下是你可以嘗試的指令",
			text:" • *「"+word1+"空氣品質如何?」*  \n • *「幫我查詢"+word2+"」*  \n • *「我想知道"+county_array[parseInt(Math.random()*48)]+"狀況怎樣」*  \n • *「幫我找"+county_array[parseInt(Math.random()*48)]+"」*  \n • *「我想看"+county_array[parseInt(Math.random()*48)]+"」*  \n • *「"+county_array[parseInt(Math.random()*48)]+"空氣好嗎?」*  \n • *「我要查"+county_array[parseInt(Math.random()*48)]+"」*", 
		})); }
		else{ conv.ask(`<speak><p><s>或對我說<break time="0.2s"/>區域查詢<break time="0.2s"/>來進行區域查詢</s></p></speak>`);}
	 
	 }else{conv.ask('抱歉，我不懂你的意思，\n請點選建議卡片來進行操作。');}
 }

 if(conv.screen){
	 conv.ask(new Suggestions('🌎 最近的測站'));}
	 if(option!=="undefined"){conv.ask(new Suggestions('回主頁面'));}
	 conv.ask(new Suggestions('👋 掰掰'));
     conv.user.storage.choose_station=option;

});
var county_array=["南投縣","連江縣","馬祖","南投","雲林縣","雲林","金門縣","金門","苗栗縣","苗栗","高雄市","高雄","嘉義市","花蓮縣","花蓮","嘉義縣","台東縣","臺東縣","台東","臺東","嘉義","基隆市","台北市","台南市","臺南市","台南","臺南","臺北市","台北","臺北","基隆","宜蘭縣","台中市","臺中市","台中","澎湖縣","澎湖","桃園市","桃園","新竹縣","新竹市","新竹","新北市","新北","宜蘭","屏東縣","屏東","彰化縣","彰化"];
var word1="";var word2="";var word3="";
app.intent('Default Fallback Intent', (conv) => {
	word1=county_array[parseInt(Math.random()*19)];word2=county_array[20+parseInt(Math.random()*28)];

if(conv.input.type==="VOICE"){ //如果輸入是語音，則顯示錯誤處理方法
	conv.ask(new SimpleResponse({               
              speech: `<speak><p><s>抱歉，我不懂你的意思</s><s>請試著問我<break time="0.2s"/>${word1}空氣品質如何?<break time="0.2s"/>或<break time="0.2s"/>幫我查詢${word2}</s></p></speak>`,
			  text: '試著提問來快速存取縣市列表，\n或點選建議卡片來進行操作!'}));
    if(conv.screen){
	 conv.ask(new BasicCard({  
		title:"語音查詢範例",
		subtitle:"以下是你可以嘗試的指令",
		text:" • *「"+word1+"空氣品質如何?」*  \n • *「幫我查詢"+word2+"」*  \n • *「我想知道"+county_array[parseInt(Math.random()*48)]+"狀況怎樣」*  \n • *「幫我找"+county_array[parseInt(Math.random()*48)]+"」*  \n • *「我想看"+county_array[parseInt(Math.random()*48)]+"」*  \n • *「"+county_array[parseInt(Math.random()*48)]+"空氣好嗎?」*  \n • *「我要查"+county_array[parseInt(Math.random()*48)]+"」*", 
	}));conv.ask(new Suggestions(word1+'空氣品質如何?','幫我查詢'+word2));}
	else{ conv.ask(`<speak><p><s>或對我說<break time="0.2s"/>區域查詢<break time="0.2s"/>來進行區域查詢</s></p></speak>`);}
 }else{
	 conv.ask('抱歉，我不懂你的意思，\n請點選建議卡片來進行操作。');
 }

conv.ask(new Suggestions('🌎 最近的測站','🔎依區域查詢','👋 掰掰'));
});
app.intent('語音指令範例', (conv) => {
    word1=county_array[parseInt(Math.random()*19)];word2=county_array[20+parseInt(Math.random()*28)];word3=county_array[parseInt(Math.random()*48)];

	conv.ask(new SimpleResponse({               
              speech: `<speak><p><s>在任意畫面中，你隨時都能快速查詢縣市列表</s><s>你可以試著問<break time="0.2s"/>${word1}空氣品質如何?<break time="0.2s"/>或<break time="0.2s"/>幫我查詢${word2}</s></p></speak>`,
			  text: '試著提問來快速存取縣市列表，\n以下是你可以嘗試的詢問方式!'})); conv.ask(new BasicCard({  
		title:"語音查詢範例",
		subtitle:"以下是你可以嘗試的指令",
		text:" • *「"+word1+"空氣品質如何?」*  \n • *「幫我查詢"+word2+"」*  \n • *「我想知道"+word3+"狀況怎樣」*  \n • *「幫我找"+county_array[parseInt(Math.random()*48)]+"」*  \n • *「我想看"+county_array[parseInt(Math.random()*48)]+"」*  \n • *「"+county_array[parseInt(Math.random()*48)]+"空氣好嗎?」*  \n • *「我要查"+county_array[parseInt(Math.random()*48)]+"」*", 
	}));conv.ask(new Suggestions(word1+'空氣品質如何?','幫我查詢'+word2,'我想知道'+word3+'狀況怎樣','🌎 最近的測站','🔎依區域查詢','👋 掰掰'));

});

app.intent('直接查詢', (conv,{station}) => {
 db.collection('dataset').get().then((snapshot) => {snapshot.forEach((doc) => {
	AQI_list[0]=doc['_fieldsProto']['0'].mapValue.fields.AQI.stringValue;AQI_list[1]=doc['_fieldsProto']['1'].mapValue.fields.AQI.stringValue;AQI_list[2]=doc['_fieldsProto']['2'].mapValue.fields.AQI.stringValue;AQI_list[3]=doc['_fieldsProto']['3'].mapValue.fields.AQI.stringValue;AQI_list[4]=doc['_fieldsProto']['4'].mapValue.fields.AQI.stringValue;AQI_list[5]=doc['_fieldsProto']['5'].mapValue.fields.AQI.stringValue;AQI_list[6]=doc['_fieldsProto']['6'].mapValue.fields.AQI.stringValue;AQI_list[7]=doc['_fieldsProto']['7'].mapValue.fields.AQI.stringValue;AQI_list[8]=doc['_fieldsProto']['8'].mapValue.fields.AQI.stringValue;AQI_list[9]=doc['_fieldsProto']['9'].mapValue.fields.AQI.stringValue;AQI_list[10]=doc['_fieldsProto']['10'].mapValue.fields.AQI.stringValue;AQI_list[11]=doc['_fieldsProto']['11'].mapValue.fields.AQI.stringValue;AQI_list[12]=doc['_fieldsProto']['12'].mapValue.fields.AQI.stringValue;AQI_list[13]=doc['_fieldsProto']['13'].mapValue.fields.AQI.stringValue;AQI_list[14]=doc['_fieldsProto']['14'].mapValue.fields.AQI.stringValue;AQI_list[15]=doc['_fieldsProto']['15'].mapValue.fields.AQI.stringValue;AQI_list[16]=doc['_fieldsProto']['16'].mapValue.fields.AQI.stringValue;AQI_list[17]=doc['_fieldsProto']['17'].mapValue.fields.AQI.stringValue;AQI_list[18]=doc['_fieldsProto']['18'].mapValue.fields.AQI.stringValue;AQI_list[19]=doc['_fieldsProto']['19'].mapValue.fields.AQI.stringValue;AQI_list[20]=doc['_fieldsProto']['20'].mapValue.fields.AQI.stringValue;AQI_list[21]=doc['_fieldsProto']['21'].mapValue.fields.AQI.stringValue;AQI_list[22]=doc['_fieldsProto']['22'].mapValue.fields.AQI.stringValue;AQI_list[23]=doc['_fieldsProto']['23'].mapValue.fields.AQI.stringValue;AQI_list[24]=doc['_fieldsProto']['24'].mapValue.fields.AQI.stringValue;AQI_list[25]=doc['_fieldsProto']['25'].mapValue.fields.AQI.stringValue;AQI_list[26]=doc['_fieldsProto']['26'].mapValue.fields.AQI.stringValue;AQI_list[27]=doc['_fieldsProto']['27'].mapValue.fields.AQI.stringValue;AQI_list[28]=doc['_fieldsProto']['28'].mapValue.fields.AQI.stringValue;AQI_list[29]=doc['_fieldsProto']['29'].mapValue.fields.AQI.stringValue;AQI_list[30]=doc['_fieldsProto']['30'].mapValue.fields.AQI.stringValue;AQI_list[31]=doc['_fieldsProto']['31'].mapValue.fields.AQI.stringValue;AQI_list[32]=doc['_fieldsProto']['32'].mapValue.fields.AQI.stringValue;AQI_list[33]=doc['_fieldsProto']['33'].mapValue.fields.AQI.stringValue;AQI_list[34]=doc['_fieldsProto']['34'].mapValue.fields.AQI.stringValue;AQI_list[35]=doc['_fieldsProto']['35'].mapValue.fields.AQI.stringValue;AQI_list[36]=doc['_fieldsProto']['36'].mapValue.fields.AQI.stringValue;AQI_list[37]=doc['_fieldsProto']['37'].mapValue.fields.AQI.stringValue;AQI_list[38]=doc['_fieldsProto']['38'].mapValue.fields.AQI.stringValue;AQI_list[39]=doc['_fieldsProto']['39'].mapValue.fields.AQI.stringValue;AQI_list[40]=doc['_fieldsProto']['40'].mapValue.fields.AQI.stringValue;AQI_list[41]=doc['_fieldsProto']['41'].mapValue.fields.AQI.stringValue;AQI_list[42]=doc['_fieldsProto']['42'].mapValue.fields.AQI.stringValue;AQI_list[43]=doc['_fieldsProto']['43'].mapValue.fields.AQI.stringValue;AQI_list[44]=doc['_fieldsProto']['44'].mapValue.fields.AQI.stringValue;AQI_list[45]=doc['_fieldsProto']['45'].mapValue.fields.AQI.stringValue;AQI_list[46]=doc['_fieldsProto']['46'].mapValue.fields.AQI.stringValue;AQI_list[47]=doc['_fieldsProto']['47'].mapValue.fields.AQI.stringValue;AQI_list[48]=doc['_fieldsProto']['48'].mapValue.fields.AQI.stringValue;AQI_list[49]=doc['_fieldsProto']['49'].mapValue.fields.AQI.stringValue;AQI_list[50]=doc['_fieldsProto']['50'].mapValue.fields.AQI.stringValue;AQI_list[51]=doc['_fieldsProto']['51'].mapValue.fields.AQI.stringValue;AQI_list[52]=doc['_fieldsProto']['52'].mapValue.fields.AQI.stringValue;AQI_list[53]=doc['_fieldsProto']['53'].mapValue.fields.AQI.stringValue;AQI_list[54]=doc['_fieldsProto']['54'].mapValue.fields.AQI.stringValue;AQI_list[55]=doc['_fieldsProto']['55'].mapValue.fields.AQI.stringValue;AQI_list[56]=doc['_fieldsProto']['56'].mapValue.fields.AQI.stringValue;AQI_list[57]=doc['_fieldsProto']['57'].mapValue.fields.AQI.stringValue;AQI_list[58]=doc['_fieldsProto']['58'].mapValue.fields.AQI.stringValue;AQI_list[59]=doc['_fieldsProto']['59'].mapValue.fields.AQI.stringValue;AQI_list[60]=doc['_fieldsProto']['60'].mapValue.fields.AQI.stringValue;AQI_list[61]=doc['_fieldsProto']['61'].mapValue.fields.AQI.stringValue;AQI_list[62]=doc['_fieldsProto']['62'].mapValue.fields.AQI.stringValue;AQI_list[63]=doc['_fieldsProto']['63'].mapValue.fields.AQI.stringValue;AQI_list[64]=doc['_fieldsProto']['64'].mapValue.fields.AQI.stringValue;AQI_list[65]=doc['_fieldsProto']['65'].mapValue.fields.AQI.stringValue;AQI_list[66]=doc['_fieldsProto']['66'].mapValue.fields.AQI.stringValue;AQI_list[67]=doc['_fieldsProto']['67'].mapValue.fields.AQI.stringValue;AQI_list[68]=doc['_fieldsProto']['68'].mapValue.fields.AQI.stringValue;AQI_list[69]=doc['_fieldsProto']['69'].mapValue.fields.AQI.stringValue;AQI_list[70]=doc['_fieldsProto']['70'].mapValue.fields.AQI.stringValue;AQI_list[71]=doc['_fieldsProto']['71'].mapValue.fields.AQI.stringValue;AQI_list[72]=doc['_fieldsProto']['72'].mapValue.fields.AQI.stringValue;AQI_list[73]=doc['_fieldsProto']['73'].mapValue.fields.AQI.stringValue;AQI_list[74]=doc['_fieldsProto']['74'].mapValue.fields.AQI.stringValue;AQI_list[75]=doc['_fieldsProto']['75'].mapValue.fields.AQI.stringValue;AQI_list[76]=doc['_fieldsProto']['76'].mapValue.fields.AQI.stringValue;AQI_list[77]=doc['_fieldsProto']['77'].mapValue.fields.AQI.stringValue;AQI_list[78]=doc['_fieldsProto']['78'].mapValue.fields.AQI.stringValue;AQI_list[79]=doc['_fieldsProto']['79'].mapValue.fields.AQI.stringValue;AQI_list[80]=doc['_fieldsProto']['80'].mapValue.fields.AQI.stringValue;AQI_list[81]=doc['_fieldsProto']['81'].mapValue.fields.AQI.stringValue;
 })});
  db.collection('dataset').get().then((snapshot) => {snapshot.forEach((doc) => {
	Pollutant_list[0]=doc['_fieldsProto']['0'].mapValue.fields.Pollutant.stringValue;Pollutant_list[1]=doc['_fieldsProto']['1'].mapValue.fields.Pollutant.stringValue;Pollutant_list[2]=doc['_fieldsProto']['2'].mapValue.fields.Pollutant.stringValue;Pollutant_list[3]=doc['_fieldsProto']['3'].mapValue.fields.Pollutant.stringValue;Pollutant_list[4]=doc['_fieldsProto']['4'].mapValue.fields.Pollutant.stringValue;Pollutant_list[5]=doc['_fieldsProto']['5'].mapValue.fields.Pollutant.stringValue;Pollutant_list[6]=doc['_fieldsProto']['6'].mapValue.fields.Pollutant.stringValue;Pollutant_list[7]=doc['_fieldsProto']['7'].mapValue.fields.Pollutant.stringValue;Pollutant_list[8]=doc['_fieldsProto']['8'].mapValue.fields.Pollutant.stringValue;Pollutant_list[9]=doc['_fieldsProto']['9'].mapValue.fields.Pollutant.stringValue;Pollutant_list[10]=doc['_fieldsProto']['10'].mapValue.fields.Pollutant.stringValue;Pollutant_list[11]=doc['_fieldsProto']['11'].mapValue.fields.Pollutant.stringValue;Pollutant_list[12]=doc['_fieldsProto']['12'].mapValue.fields.Pollutant.stringValue;Pollutant_list[13]=doc['_fieldsProto']['13'].mapValue.fields.Pollutant.stringValue;Pollutant_list[14]=doc['_fieldsProto']['14'].mapValue.fields.Pollutant.stringValue;Pollutant_list[15]=doc['_fieldsProto']['15'].mapValue.fields.Pollutant.stringValue;Pollutant_list[16]=doc['_fieldsProto']['16'].mapValue.fields.Pollutant.stringValue;Pollutant_list[17]=doc['_fieldsProto']['17'].mapValue.fields.Pollutant.stringValue;Pollutant_list[18]=doc['_fieldsProto']['18'].mapValue.fields.Pollutant.stringValue;Pollutant_list[19]=doc['_fieldsProto']['19'].mapValue.fields.Pollutant.stringValue;Pollutant_list[20]=doc['_fieldsProto']['20'].mapValue.fields.Pollutant.stringValue;Pollutant_list[21]=doc['_fieldsProto']['21'].mapValue.fields.Pollutant.stringValue;Pollutant_list[22]=doc['_fieldsProto']['22'].mapValue.fields.Pollutant.stringValue;Pollutant_list[23]=doc['_fieldsProto']['23'].mapValue.fields.Pollutant.stringValue;Pollutant_list[24]=doc['_fieldsProto']['24'].mapValue.fields.Pollutant.stringValue;Pollutant_list[25]=doc['_fieldsProto']['25'].mapValue.fields.Pollutant.stringValue;Pollutant_list[26]=doc['_fieldsProto']['26'].mapValue.fields.Pollutant.stringValue;Pollutant_list[27]=doc['_fieldsProto']['27'].mapValue.fields.Pollutant.stringValue;Pollutant_list[28]=doc['_fieldsProto']['28'].mapValue.fields.Pollutant.stringValue;Pollutant_list[29]=doc['_fieldsProto']['29'].mapValue.fields.Pollutant.stringValue;Pollutant_list[30]=doc['_fieldsProto']['30'].mapValue.fields.Pollutant.stringValue;Pollutant_list[31]=doc['_fieldsProto']['31'].mapValue.fields.Pollutant.stringValue;Pollutant_list[32]=doc['_fieldsProto']['32'].mapValue.fields.Pollutant.stringValue;Pollutant_list[33]=doc['_fieldsProto']['33'].mapValue.fields.Pollutant.stringValue;Pollutant_list[34]=doc['_fieldsProto']['34'].mapValue.fields.Pollutant.stringValue;Pollutant_list[35]=doc['_fieldsProto']['35'].mapValue.fields.Pollutant.stringValue;Pollutant_list[36]=doc['_fieldsProto']['36'].mapValue.fields.Pollutant.stringValue;Pollutant_list[37]=doc['_fieldsProto']['37'].mapValue.fields.Pollutant.stringValue;Pollutant_list[38]=doc['_fieldsProto']['38'].mapValue.fields.Pollutant.stringValue;Pollutant_list[39]=doc['_fieldsProto']['39'].mapValue.fields.Pollutant.stringValue;Pollutant_list[40]=doc['_fieldsProto']['40'].mapValue.fields.Pollutant.stringValue;Pollutant_list[41]=doc['_fieldsProto']['41'].mapValue.fields.Pollutant.stringValue;Pollutant_list[42]=doc['_fieldsProto']['42'].mapValue.fields.Pollutant.stringValue;Pollutant_list[43]=doc['_fieldsProto']['43'].mapValue.fields.Pollutant.stringValue;Pollutant_list[44]=doc['_fieldsProto']['44'].mapValue.fields.Pollutant.stringValue;Pollutant_list[45]=doc['_fieldsProto']['45'].mapValue.fields.Pollutant.stringValue;Pollutant_list[46]=doc['_fieldsProto']['46'].mapValue.fields.Pollutant.stringValue;Pollutant_list[47]=doc['_fieldsProto']['47'].mapValue.fields.Pollutant.stringValue;Pollutant_list[48]=doc['_fieldsProto']['48'].mapValue.fields.Pollutant.stringValue;Pollutant_list[49]=doc['_fieldsProto']['49'].mapValue.fields.Pollutant.stringValue;Pollutant_list[50]=doc['_fieldsProto']['50'].mapValue.fields.Pollutant.stringValue;Pollutant_list[51]=doc['_fieldsProto']['51'].mapValue.fields.Pollutant.stringValue;Pollutant_list[52]=doc['_fieldsProto']['52'].mapValue.fields.Pollutant.stringValue;Pollutant_list[53]=doc['_fieldsProto']['53'].mapValue.fields.Pollutant.stringValue;Pollutant_list[54]=doc['_fieldsProto']['54'].mapValue.fields.Pollutant.stringValue;Pollutant_list[55]=doc['_fieldsProto']['55'].mapValue.fields.Pollutant.stringValue;Pollutant_list[56]=doc['_fieldsProto']['56'].mapValue.fields.Pollutant.stringValue;Pollutant_list[57]=doc['_fieldsProto']['57'].mapValue.fields.Pollutant.stringValue;Pollutant_list[58]=doc['_fieldsProto']['58'].mapValue.fields.Pollutant.stringValue;Pollutant_list[59]=doc['_fieldsProto']['59'].mapValue.fields.Pollutant.stringValue;Pollutant_list[60]=doc['_fieldsProto']['60'].mapValue.fields.Pollutant.stringValue;Pollutant_list[61]=doc['_fieldsProto']['61'].mapValue.fields.Pollutant.stringValue;Pollutant_list[62]=doc['_fieldsProto']['62'].mapValue.fields.Pollutant.stringValue;Pollutant_list[63]=doc['_fieldsProto']['63'].mapValue.fields.Pollutant.stringValue;Pollutant_list[64]=doc['_fieldsProto']['64'].mapValue.fields.Pollutant.stringValue;Pollutant_list[65]=doc['_fieldsProto']['65'].mapValue.fields.Pollutant.stringValue;Pollutant_list[66]=doc['_fieldsProto']['66'].mapValue.fields.Pollutant.stringValue;Pollutant_list[67]=doc['_fieldsProto']['67'].mapValue.fields.Pollutant.stringValue;Pollutant_list[68]=doc['_fieldsProto']['68'].mapValue.fields.Pollutant.stringValue;Pollutant_list[69]=doc['_fieldsProto']['69'].mapValue.fields.Pollutant.stringValue;Pollutant_list[70]=doc['_fieldsProto']['70'].mapValue.fields.Pollutant.stringValue;Pollutant_list[71]=doc['_fieldsProto']['71'].mapValue.fields.Pollutant.stringValue;Pollutant_list[72]=doc['_fieldsProto']['72'].mapValue.fields.Pollutant.stringValue;Pollutant_list[73]=doc['_fieldsProto']['73'].mapValue.fields.Pollutant.stringValue;Pollutant_list[74]=doc['_fieldsProto']['74'].mapValue.fields.Pollutant.stringValue;Pollutant_list[75]=doc['_fieldsProto']['75'].mapValue.fields.Pollutant.stringValue;Pollutant_list[76]=doc['_fieldsProto']['76'].mapValue.fields.Pollutant.stringValue;Pollutant_list[77]=doc['_fieldsProto']['77'].mapValue.fields.Pollutant.stringValue;Pollutant_list[78]=doc['_fieldsProto']['78'].mapValue.fields.Pollutant.stringValue;Pollutant_list[79]=doc['_fieldsProto']['79'].mapValue.fields.Pollutant.stringValue;Pollutant_list[80]=doc['_fieldsProto']['80'].mapValue.fields.Pollutant.stringValue;Pollutant_list[81]=doc['_fieldsProto']['81'].mapValue.fields.Pollutant.stringValue;
 })});

  if(indexnumber=station_array.indexOf(station)===-1){
    conv.ask(new SimpleResponse({               
              speech: `<speak><p><s>抱歉，您所查詢的${station}監測站似乎不存在，我無法提供你最新資訊。</s></p></speak>`,
	text: '以下為「'+station+'」監測站的詳細資訊'}));
   conv.ask(new BasicCard({  
        image: new Image({url:"https://dummyimage.com/1037x539/232830/ffffff.png&text=NaN",alt:'Pictures',}),
        title:'找不到您指定的測站名稱',
		subtitle:'請透過選單查詢來查找您要的測站', display: 'CROPPED',
  })); 
conv.ask(new Suggestions('回主頁面','👋 掰掰'));

 }
 else{
   if((typeof AQI_list[0]==="undefined")!==true){
	indexnumber=station_array.indexOf(station); //取得監測站對應的編號
	db.collection('dataset').get()
  .then((snapshot) => {
    snapshot.forEach((doc) => {
	PublishTime=doc['_fieldsProto'].PublishTime.stringValue;
    });
  })
  .catch((err) => {
    console.log('Error getting documents', err);
  });
    AQI=AQI_list[parseInt(indexnumber)];Pollutant=Pollutant_list[parseInt(indexnumber)];
    Status= status_generator(parseInt(AQI));	
	if(Status!=="有效數據不足"){
    if(AQI>=0&&AQI<=50){picture= "https://dummyimage.com/1037x539/1e9165/ffffff.png&text="+AQI;}
	else if(AQI>=51&&AQI<=100){picture= "https://dummyimage.com/1037x539/fc920b/ffffff.png&text="+AQI;}
	else if(AQI>=101&&AQI<=150){picture= "https://dummyimage.com/1037x539/ef4621/ffffff.png&text="+AQI;}
	else if(AQI>=151&&AQI<=199){picture= "https://dummyimage.com/1037x539/b71411/ffffff.png&text="+AQI;}
	else if(AQI>=200&&AQI<=300){picture= "https://dummyimage.com/1037x539/5b0e31/ffffff.png&text="+AQI;}
    else if(AQI>301){picture= "https://dummyimage.com/1037x539/4f1770/ffffff.png&text="+AQI;}

    if(AQI>=0&&AQI<=50){info= "對一般民眾身體健康無影響。";}
	else if(AQI>=51&&AQI<=100){info= "可能對極敏感族群產生輕微影響。";}
	else if(AQI>=101&&AQI<=150){info= "若出現眼痛，咳嗽或喉嚨痛等症狀，英減少戶外活動，避免在戶外劇烈運動，敏感族群必要外出時英配戴口罩。";}
	else if(AQI>=151&&AQI<=199){info= "若出現眼痛，咳嗽或喉嚨痛等症狀，英減少體力消耗及戶外活動，在戶外避免長時間劇烈運動，敏感族群建議留在室內並減少體力消耗活動，必要外出英配戴口罩。"}
	else if(AQI>=200&&AQI<=300){info= "對敏感族群會有明顯惡化的現象，建議留在室內並減少體力消耗活動；一般大眾則視身體狀況，可能產生各種不同的症狀。";}
    else if(AQI>301){info= "健康威脅達到緊急，所有人都可能受到影響。";}
	
    if(AQI>=0&&AQI<=50){info_output= "對一般民眾身體健康無影響。";}
	else if(AQI>=51&&AQI<=100){info_output= "極特殊敏感族群建議注意  \n可能產生的咳嗽或呼吸急促症狀。";}
	else if(AQI>=101&&AQI<=150){info_output= "1.一般民眾如果有不適，應考慮減少戶外活動。  \n2.學生仍可進行戶外活動，但建議減少長時間劇烈運動。  \n3.有心臟、呼吸道及心血管疾病患者、孩童及老年人，建議減少體力消耗活動及戶外活動，外出應配戴口罩。  \n4.具有氣喘的人可能需增加使用吸入劑的頻率。";}
	else if(AQI>=151&&AQI<=199){info_output= "1.一般民眾如果有不適，應減少體力消耗及戶外活動。  \n2.學生應避免長時間劇烈運動並增加休息時間。  \n3.有心臟、呼吸道及心血管疾病患者、孩童及老年人，建議留在室內減少體力消耗活動，外出應配戴口罩。  \n4.具有氣喘的人可能需增加使用吸入劑的頻率。"}
	else if(AQI>=200&&AQI<=300){info_output= "1.一般民眾應減少戶外活動。  \n2.學生應立即停止戶外活動，並將課程調整於室內進行。  \n3.有心臟、呼吸道及心血管疾病患者、孩童及老年人應留在室內並減少體力消耗活動，外出應配戴口罩。  \n4.具有氣喘的人應增加使用吸入劑的頻率。";}
    else if(AQI>301){info_output= "1.一般民眾應避免戶外活動，室內應緊閉門窗，必要外出應配戴口罩等防護用具。  \n2.學生應立即停止戶外活動，並將課程調整於室內進行。  \n3.有心臟、呼吸道及心血管疾病患者、孩童及老年人應留在室內並避免體力消耗活動，外出應配戴口罩。  \n4.具有氣喘的人應增加使用吸入劑的頻率。";}

	if(AQI>=0&&AQI<=50){
		conv.ask(new SimpleResponse({               
              speech: `<speak><p><s>根據最新資料顯示，${station}監測站的AQI指數為${AQI}</s><s>您可放心出外活動!</s></p></speak>`,
	          text: '以下為該監測站的詳細資訊，\n您可放心出外活動!'}));	      output_title='「'+station+'」空氣品質'+Status;}
    else if(AQI>50){
		   conv.ask(new SimpleResponse({               
					  speech: `<speak><p><s>根據最新資料顯示，${station}監測站的AQI指數為${AQI}</s><s>主要汙染源來自${replaceString(Pollutant, '八小時', '')}</s><s>${info}</s></p></speak>`,
			          text: '以下為該監測站的詳細資訊。'}));    output_title='「'+station+'」空氣品質'+Status+'\n主要汙染源 '+Pollutant;}
    
	conv.close(new BasicCard({  
			image: new Image({url:picture,alt:'Pictures',}),
			title:output_title,display: 'CROPPED',
			text:info_output+'  \n  \n**測站資訊發布時間** • '+replaceString(PublishTime, '-', '/'),})); 

	}
	else{
    conv.ask(new SimpleResponse({               
              speech: `<speak><p><s>由於${station}監測站數據不足或處於維修狀態，我無法提供你最新資訊。</s></p></speak>`,
	text: '以下為「'+station+'」監測站的詳細資訊'}));	   conv.close(new BasicCard({  
        image: new Image({url:"https://dummyimage.com/1037x539/232830/ffffff.png&text=NaN",alt:'Pictures',}),
        title:'有效數據不足',
					title:'有效數據不足',
					text:'設備維護、儀器校正、儀器異常、傳輸異常、電力異常 \n或有效數據不足等需查修維護情形，以致資料暫時中斷服務。  \n  \n**測站資訊發布時間** • '+replaceString(PublishTime, '-', '/'), 
				    display: 'CROPPED',})); 
	}
 }else{
    conv.ask(new SimpleResponse({               
              speech: `<speak><p><s>糟糕，查詢似乎發生錯誤。請稍後再試。</s></p></speak>`,
	text: '發生錯誤，請稍後再試一次。'}));	   conv.close(new BasicCard({  
				image: new Image({url:"https://dummyimage.com/1037x539/ef2121/ffffff.png&text=錯誤",alt:'Pictures',}),
				title:'數據加載發生問題',
				subtitle:'請過一段時間後再回來查看', display: 'CROPPED',
  })); 
 }
}


});
app.intent('日常安排教學', (conv) => {
	
	choose_station=conv.user.storage.choose_station;
	if(station_array.indexOf(choose_station)===-1){choose_station=station_array[parseInt(Math.random()*81)];}
    conv.ask(new SimpleResponse({               
              speech: `<speak><p><s>透過加入日常安排，你可以快速存取要查詢的站點。</s><s>舉例來說，如果你把${choose_station}加入日常安排。你即可隨時呼叫我查詢該站點的最新空氣品質!</s><s>以下為詳細說明</s></p></speak>`,
	text: '以下為詳細說明。'}));

    conv.ask(new BasicCard({  
        image: new Image({url:"https://i.imgur.com/82c8u4T.png",alt:'Pictures',}),
        title:'將「'+choose_station+'」加入日常安排', display: 'CROPPED',
		subtitle:'1.點擊畫面右上方大頭貼 > 點擊[設定]\n2.切換到[Google助理]分頁 > 點擊[日常安排]\n3.點擊[新增日常安排]\n4.「新增指令(必填)」輸入「空氣品質」\n5.「新增動作」輸入\n「叫空汙查詢精靈查詢'+choose_station+'站」\n6.輸入完成後點擊「儲存」\n7.現在，你可以透過說出或輸入「空氣品質」來快速查詢'+choose_station+'的AQI指數!',})); 

		conv.ask(new Suggestions('🌎 最近的測站','🔎依區域查詢','👋 掰掰'));

});

app.intent('從風向看空氣品質', (conv,{Wind_direction}) => {

var explation="";
if(direction_array.indexOf(Wind_direction)!==-1){
	if(Wind_direction==="東北風"){
					explation="此類風向盛行於冬季，且風力相對較強。\n中部以北及東半部擴散條件相對較佳，空氣污染相對集中於高屏地區。"
					picture="https://airtw.epa.gov.tw/images/indexHashtag/indexHashtag_1.jpg";}
	else if(Wind_direction==="偏東風"){
					explation="在高壓出海轉高壓迴流期間，臺灣附近風向逐漸由東北風轉為偏東風。\n該風向容易因臺灣地形產生「地形繞流」。 \n此現象容易在臺灣海峽上產生一背風渦旋， \n它可能將原已擴散至海面上的污染物又再度帶往陸地，易使局部地區空氣污染物濃度上升。"
					picture="https://airtw.epa.gov.tw/images/indexHashtag/indexHashtag_3.jpg";}
	else if(Wind_direction==="偏南風"){
					explation="較常發生於夏半季，當臺灣附近風向為南風、南南東風或偏南風時，高屏及雲嘉南空氣品質通常較中部以北良好。\n此外，當高屏地區在較強的南風吹拂之下，高屏溪易有揚塵現象發生。"
					picture="https://airtw.epa.gov.tw/images/indexHashtag/indexHashtag_5.jpg";}
	else if(Wind_direction==="西南風"){
					explation="夏季盛行的西南風通常夾帶較多水氣。\n普遍來說高屏及雲嘉南位於上風處且易有降水現象，因此空氣品質良好。\n而北部位於下風處，污染物易累積於此，相對之下空氣品質較差。"
					picture="https://airtw.epa.gov.tw/images/indexHashtag/indexHashtag_6.jpg";}
    else{			explation="當臺灣附近風場為西風或偏西風時，\n西半部的空氣污染物不易往海面上移動、擴散，反而往中央山脈及內陸區域堆積，\n因此在此型態風場時，西半部空氣品質相對較差。\n而宜蘭位於背風側且風力通常偏弱不利污染物擴散，空氣品質也略差。"
					picture="https://airtw.epa.gov.tw/images/indexHashtag/indexHashtag_7.jpg";}

	conv.ask(new SimpleResponse({               
              speech: `<speak><p><s>以下是環保署對${Wind_direction}與空氣品質關聯性的說明</s><break time="1s"/><s>${replaceString(explation, '\n', '')}</s></p></speak>`,
			  text: '以下為詳細說明。'}));    conv.ask(new BasicCard({  
        image: new Image({url:picture,alt:'Pictures',}),
        title:Wind_direction,
		subtitle:explation,
		text:"Ⓒ 圖文資訊來自 行政院環境保護署 **《空品小百科》**"})); 
    conv.ask(new Suggestions('說明其他風向','🌎 最近的測站','🔎依區域查詢','👋 掰掰'));

}
else{
		conv.ask(new SimpleResponse({               
              speech: `<speak><p><s>請選擇您要我解釋的風向類別，共有以下五類</s><s>點擊建議卡片來取得說明</s></p></speak>`,
			  text: '請選擇要我解釋的風向類別'}));    conv.ask(new BasicCard({  
        title:"從風向看空氣品質",
		subtitle:"不同季節吹著相異的盛行風，\n在擁有複雜地形的臺灣易受到地形的阻擋。\n從而影響每天臺灣各地的空氣品質!",
		text:"Ⓒ 圖文資訊來自 行政院環境保護署 **《空品小百科》**",
       buttons: new Button({title: '空品小百科',url: 'https://airtw.epa.gov.tw/CHT/Encyclopedia/pedia02/pedia2.aspx',}),
})); 
	    conv.ask(new Suggestions('東北風','偏東風','偏南風','西南風','偏西風'));
}

});

app.intent('取得地點權限', (conv) => {

 conv.data.requestedPermission = 'DEVICE_PRECISE_LOCATION';

    return conv.ask(new Permission({
    context: "在繼續操作前，建議你開啟裝置上的GPS功能來取得精確結果。接著，為了找到最近的測站位置",
    permissions: conv.data.requestedPermission,}));

conv.ask(new Permission(options));
  
});

var sitename="";

app.intent('回傳資訊', (conv, params, permissionGranted)=> {
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
				sitename=(findNearestLocation(myLocation, locations)).location.Sitename; //透過模組找到最近的測站				
						
				conv.ask(new SimpleResponse({speech:`<speak><p><s>查詢完成!</s><s>距離你最近的測站是<break time="0.2s"/>${sitename}。</s></p></speak>`,text:'最近的測站是「'+sitename+'」!'}));                 
				
			   if((typeof AQI_list[0]==="undefined")!==true){
				indexnumber=station_array.indexOf(sitename); //取得監測站對應的編號
				db.collection('dataset').get()
			  .then((snapshot) => {
				snapshot.forEach((doc) => {
				PublishTime=doc['_fieldsProto'].PublishTime.stringValue;			});		  })
			  .catch((err) => {console.log('Error getting documents', err);});
			  AQI=AQI_list[parseInt(indexnumber)];Pollutant=Pollutant_list[parseInt(indexnumber)];
			  Status= status_generator(parseInt(AQI));	
				if(Status!=="有效數據不足"){
				if(AQI>=0&&AQI<=50){picture= "https://dummyimage.com/1037x539/1e9165/ffffff.png&text="+AQI;}
				else if(AQI>=51&&AQI<=100){picture= "https://dummyimage.com/1037x539/fc920b/ffffff.png&text="+AQI;}
				else if(AQI>=101&&AQI<=150){picture= "https://dummyimage.com/1037x539/ef4621/ffffff.png&text="+AQI;}
				else if(AQI>=151&&AQI<=199){picture= "https://dummyimage.com/1037x539/b71411/ffffff.png&text="+AQI;}
				else if(AQI>=200&&AQI<=300){picture= "https://dummyimage.com/1037x539/5b0e31/ffffff.png&text="+AQI;}
				else if(AQI>301){picture= "https://dummyimage.com/1037x539/4f1770/ffffff.png&text="+AQI;}

				if(AQI>=0&&AQI<=50){info= "對一般民眾身體健康無影響。";}
				else if(AQI>=51&&AQI<=100){info= "可能對極敏感族群產生輕微影響。";}
				else if(AQI>=101&&AQI<=150){info= "若出現眼痛，咳嗽或喉嚨痛等症狀，英減少戶外活動，避免在戶外劇烈運動，敏感族群必要外出時英配戴口罩。";}
				else if(AQI>=151&&AQI<=199){info= "若出現眼痛，咳嗽或喉嚨痛等症狀，英減少體力消耗及戶外活動，在戶外避免長時間劇烈運動，敏感族群建議留在室內並減少體力消耗活動，必要外出英配戴口罩。"}
				else if(AQI>=200&&AQI<=300){info= "對敏感族群會有明顯惡化的現象，建議留在室內並減少體力消耗活動；一般大眾則視身體狀況，可能產生各種不同的症狀。";}
				else if(AQI>301){info= "健康威脅達到緊急，所有人都可能受到影響。";}
				
				if(AQI>=0&&AQI<=50){info_output= "對一般民眾身體健康無影響。";}
				else if(AQI>=51&&AQI<=100){info_output= "極特殊敏感族群建議注意  \n可能產生的咳嗽或呼吸急促症狀。";}
				else if(AQI>=101&&AQI<=150){info_output= "1.一般民眾如果有不適，應考慮減少戶外活動。  \n2.學生仍可進行戶外活動，但建議減少長時間劇烈運動。  \n3.有心臟、呼吸道及心血管疾病患者、孩童及老年人，建議減少體力消耗活動及戶外活動，外出應配戴口罩。  \n4.具有氣喘的人可能需增加使用吸入劑的頻率。";}
				else if(AQI>=151&&AQI<=199){info_output= "1.一般民眾如果有不適，應減少體力消耗及戶外活動。  \n2.學生應避免長時間劇烈運動並增加休息時間。  \n3.有心臟、呼吸道及心血管疾病患者、孩童及老年人，建議留在室內減少體力消耗活動，外出應配戴口罩。  \n4.具有氣喘的人可能需增加使用吸入劑的頻率。"}
				else if(AQI>=200&&AQI<=300){info_output= "1.一般民眾應減少戶外活動。  \n2.學生應立即停止戶外活動，並將課程調整於室內進行。  \n3.有心臟、呼吸道及心血管疾病患者、孩童及老年人應留在室內並減少體力消耗活動，外出應配戴口罩。  \n4.具有氣喘的人應增加使用吸入劑的頻率。";}
				else if(AQI>301){info_output= "1.一般民眾應避免戶外活動，室內應緊閉門窗，必要外出應配戴口罩等防護用具。  \n2.學生應立即停止戶外活動，並將課程調整於室內進行。  \n3.有心臟、呼吸道及心血管疾病患者、孩童及老年人應留在室內並避免體力消耗活動，外出應配戴口罩。  \n4.具有氣喘的人應增加使用吸入劑的頻率。";}

				if(AQI>=0&&AQI<=50){
					conv.ask(new SimpleResponse({               
						  speech: `<speak><p><s>根據最新資料顯示，${sitename}監測站的AQI指數為${AQI}</s><s>您可放心出外活動!</s></p></speak>`,
						  text: '以下為該監測站的詳細資訊，\n您可放心出外活動!'}));	      output_title='「'+sitename+'」空氣品質'+Status;}
				else if(AQI>50){
					   conv.ask(new SimpleResponse({               
								  speech: `<speak><p><s>根據最新資料顯示，${sitename}監測站的AQI指數為${AQI}</s><s>主要汙染源來自${replaceString(Pollutant, '八小時', '')}</s><s>${info}</s></p></speak>`,
								  text: '以下為該監測站的詳細資訊。'}));    output_title='「'+sitename+'」空氣品質'+Status+'\n主要汙染源 '+Pollutant;}
				
					if(conv.screen){
						conv.ask(new BasicCard({  
								image: new Image({url:picture,alt:'Pictures',}),
								title:output_title,display: 'CROPPED',
								text:info_output+'  \n  \n**測站資訊發布時間** • '+replaceString(PublishTime, '-', '/'),})); 
						conv.ask(new Suggestions('把它加入日常安排'));	}else{conv.close(`<speak><p><s>歡迎你隨時回來查詢，下次見</s></p></speak>`);}}
				else{
				conv.ask(new SimpleResponse({               
						  speech: `<speak><p><s>由於${sitename}監測站數據不足或處於維修狀態，我無法提供你最新資訊。</s></p></speak>`,
				text: '以下為「'+sitename+'」監測站的詳細資訊'}));				   conv.ask(new BasicCard({  
					image: new Image({url:"https://dummyimage.com/1037x539/232830/ffffff.png&text=NaN",alt:'Pictures',}),
					title:'有效數據不足',
								title:'有效數據不足',
								text:'設備維護、儀器校正、儀器異常、傳輸異常、電力異常 \n或有效數據不足等需查修維護情形，以致資料暫時中斷服務。  \n  \n**測站資訊發布時間** • '+replaceString(PublishTime, '-', '/'), 
								display: 'CROPPED',})); 
				}
			 }else{
				conv.ask(new SimpleResponse({               
						  speech: `<speak><p><s>糟糕，查詢似乎發生錯誤。</s><s>請稍後再試。</s></p></speak>`,
				text: '發生錯誤，請稍後再試一次。'}));				   conv.ask(new BasicCard({  
							image: new Image({url:"https://dummyimage.com/1037x539/ef2121/ffffff.png&text=錯誤",alt:'Pictures',}),
							title:'數據加載發生問題',
							subtitle:'請過一段時間後再回來查看', display: 'CROPPED',
			  })); 
			 }             	           			
		  } else {
                // Note: Currently, precise locaton only returns lat/lng coordinates on phones and lat/lng coordinates
                // and a geocoded address on voice-activated speakers.
                // Coarse location only works on voice-activated speakers.
				conv.ask(new SimpleResponse({speech:`<speak><p><s>糟糕，我無法得知你的目前位置。</s><s>請稍後再試。</s></p></speak>`,text:"發生錯誤，請開啟GPS功能然後再試一次。"}));                 
            }
 
        }
    } else {
				conv.ask(new SimpleResponse({speech:`<speak><p><s>很抱歉，由於未取得你的授權因此查詢失敗。</s><s>不過你隨時可以回來再試一次。</s></p></speak>`,text:"發生錯誤，未取得你的授權。"}));                 
    }
	if(conv.screen){conv.ask(new Suggestions('🔎依區域查詢','👋 掰掰'));}else{conv.close(`<speak><p><s>歡迎你隨時回來查詢，下次見</s></p></speak>`);}
    conv.user.storage.choose_station=sitename;

});

app.intent('直接查詢縣市選單', (conv, {County}) => {

if(conv.input.raw.indexOf('新北')!==-1){County="新北市";}

  if (County === "宜蘭縣") {
  
  if(conv.screen){conv.ask('以下是「宜蘭縣」的監測站列表');
  }else{conv.ask(new SimpleResponse({               
              speech: `<speak><p><s>以下是「宜蘭縣」的監測站列表</s><s>選項有以下幾個<break time="0.5s"/>冬山<break time="0.2s"/>宜蘭<break time="1s"/>請選擇。</s></p></speak>`,
			   text: '以下是「宜蘭縣」的監測站列表'}));}

	AQI1=AQI_list[14];AQI2=AQI_list[26];

  picurl1= picture_generator(parseInt(AQI1));
  picurl2= picture_generator(parseInt(AQI2));
  status1= status_generator(parseInt(AQI1));
  status2= status_generator(parseInt(AQI2));

  conv.ask(new Carousel({
    items: {
    '冬山': {
      title: '冬山',
      description: status1,
      image: new Image({url: picurl1,alt: 'Image alternate text',}),},
    '宜蘭': {
      title: '宜蘭',
      description: status2,
      image: new Image({url: picurl2,alt: 'Image alternate text',}),},
	  },
}));  } 
  else if (County === "臺東縣") {
  
  if(conv.screen){conv.ask('以下是「臺東縣」的監測站列表');
  }else{conv.ask(new SimpleResponse({               
              speech: `<speak><p><s>以下是「臺東縣」的監測站列表</s><s>選項有以下幾個<break time="0.5s"/>台東<break time="0.2s"/>關山<break time="1s"/>請選擇。</s></p></speak>`,
			   text: '以下是「臺東縣」的監測站列表'}));}

	AQI1=AQI_list[70];AQI2=AQI_list[80];
  picurl1= picture_generator(parseInt(AQI1));
  picurl2= picture_generator(parseInt(AQI2));
  status1= status_generator(parseInt(AQI1));
  status2= status_generator(parseInt(AQI2));

  conv.ask(new Carousel({
    items: {
    '臺東': {
      title: '臺東',
      description: status1,
      image: new Image({url: picurl1,alt: 'Image alternate text',}),},
    '關山': {
      title: '關山',
      description: status2,
      image: new Image({url: picurl2,alt: 'Image alternate text',}),},
  },
}));  
}
  else if (County === "臺北市") {

	AQI1=AQI_list[4];AQI2=AQI_list[5];AQI3=AQI_list[10];AQI4=AQI_list[15];AQI5=AQI_list[28];AQI6=AQI_list[56];AQI7=AQI_list[65];

  picurl1= picture_generator(parseInt(AQI1));
  picurl2= picture_generator(parseInt(AQI2));
  picurl3= picture_generator(parseInt(AQI3));
  picurl4= picture_generator(parseInt(AQI4));
  picurl5= picture_generator(parseInt(AQI5));
  picurl6= picture_generator(parseInt(AQI6));
  picurl7= picture_generator(parseInt(AQI7));
  status1= status_generator(parseInt(AQI1));
  status2= status_generator(parseInt(AQI2));
  status3= status_generator(parseInt(AQI3));
  status4= status_generator(parseInt(AQI4));
  status5= status_generator(parseInt(AQI5));
  status6= status_generator(parseInt(AQI6));
  status7= status_generator(parseInt(AQI7));
   
    if(conv.screen){conv.ask('以下是「臺北市」的監測站列表');}
  else{conv.ask(new SimpleResponse({               
              speech: `<speak><p><s>以下是「臺北市」的監測站列表</s><s>選項有以下幾個<break time="0.5s"/>士林<break time="0.2s"/>大同<break time="0.2s"/>中山<break time="0.2s"/>古亭<break time="0.2s"/>松山<break time="0.2s"/>陽明<break time="0.2s"/>萬華<break time="1s"/>請選擇。</s></p></speak>`,
              text: '以下是「臺北市」的監測站列表'}));}
  conv.ask(new Carousel({
  title: 'Carousel Title',
  items: {
    '士林': {
      title: '士林',
      description: status1,
      image: new Image({url: picurl1,alt: 'Image alternate text',}),},
    '大同': {
      title: '大同',
      description: status2,
      image: new Image({url: picurl2,alt: 'Image alternate text',}),},
    '中山': {
      title: '中山',
      description: status3,
      image: new Image({url: picurl3,alt: 'Image alternate text',}),},
    '古亭': {
      title: '古亭',
      description: status4,
      image: new Image({url: picurl4,alt: 'Image alternate text',}),},
    '松山': {
      title: '松山',
      description: status5,
      image: new Image({url: picurl5,alt: 'Image alternate text',}),},
    '陽明': {
      title: '陽明',
      description: status6,
      image: new Image({url: picurl6,alt: 'Image alternate text',}),},
    '萬華': {
      title: '萬華',
      description: status7,
      image: new Image({url: picurl7,alt: 'Image alternate text',}),}
},
}));			  
}
  else if (County === "新北市") {
   conv.ask(new SimpleResponse({               
              speech: `<speak><p><s>由於「新北市」的測站數目較多，分為兩部份顯示，請選擇</s></p></speak>`,
              text: '「新北市」監測站數量較多，\n分為兩部份顯示。'}));
   
  conv.ask(new Carousel({
  title: 'Carousel Title',
  items: {
    'New_Taipei1': {
      title: '新北市(一)',
      description: '三重、土城、永和  \n汐止、板橋、林口',
    },
    'New_Taipei2': {
      title: '新北市(二)',
      description: '淡水、富貴角、菜寮  \n新店、新莊、萬里',
    },	  },}));			  
  }
  else if (County === "桃園市") {

    if(conv.screen){conv.ask('以下是「桃園市」的監測站列表');}
  else{conv.ask(new SimpleResponse({               
              speech: `<speak><p><s>以下是「桃園市」的監測站列表</s><s>選項有以下幾個<break time="0.5s"/>大園<break time="0.2s"/>中壢<break time="0.2s"/>平鎮<break time="0.2s"/>桃園<break time="0.2s"/>觀音工業區<break time="0.2s"/>龍潭<break time="0.2s"/>觀音<break time="1s"/>請選擇。</s></p></speak>`,
              text: '以下是「桃園市」的監測站列表'}));}
	AQI1=AQI_list[7];AQI2=AQI_list[11];AQI3=AQI_list[17];AQI4=AQI_list[43];AQI5=AQI_list[44];AQI6=AQI_list[78];AQI7=AQI_list[81];
  picurl1= picture_generator(parseInt(AQI1));
  picurl2= picture_generator(parseInt(AQI2));
  picurl3= picture_generator(parseInt(AQI3));
  picurl4= picture_generator(parseInt(AQI4));
  picurl5= picture_generator(parseInt(AQI5));
  picurl6= picture_generator(parseInt(AQI6));
  picurl7= picture_generator(parseInt(AQI7));
  status1= status_generator(parseInt(AQI1));
  status2= status_generator(parseInt(AQI2));
  status3= status_generator(parseInt(AQI3));
  status4= status_generator(parseInt(AQI4));
  status5= status_generator(parseInt(AQI5));
  status6= status_generator(parseInt(AQI6));
  status7= status_generator(parseInt(AQI7));		  
  conv.ask(new Carousel({
    items: {
    '大園': {
      title: '大園',
      description: status1,
      image: new Image({url: picurl1,alt: 'Image alternate text',}),},
    '中壢': {
      title: '中壢',
      description: status2,
      image: new Image({url: picurl2,alt: 'Image alternate text',}),},
    '平鎮': {
      title: '平鎮',
      description: status3,
      image: new Image({url: picurl3,alt: 'Image alternate text',}),},
    '桃園': {
      title: '桃園',
      description: status4,
      image: new Image({url: picurl4,alt: 'Image alternate text',}),},
    '觀音工業區': {
      title: '觀音工業區',
      description: status5,
      image: new Image({url: picurl5,alt: 'Image alternate text',}),},
    '龍潭': {
      title: '龍潭',
      description: status6,
      image: new Image({url: picurl6,alt: 'Image alternate text',}),},
    '觀音': {
      title: '觀音',
      description: status7,
      image: new Image({url: picurl7,alt: 'Image alternate text',}),},
  },
}));  }
  else if (County === "新竹縣市") {

  if(conv.screen){conv.ask('以下是「新竹縣市」的監測站列表');}
  else{conv.ask(new SimpleResponse({               
              speech: `<speak><p><s>以下是「新竹縣市」的監測站列表</s><s>選項有以下幾個<break time="0.5s"/>新竹<break time="0.2s"/>香山<break time="0.2s"/>竹東<break time="0.2s"/>湖口<break time="1s"/>請選擇。</s></p></speak>`,
              text: '以下是「新竹縣市」的監測站列表'}));}
	AQI1=AQI_list[57];AQI2=AQI_list[58];AQI3=AQI_list[23];AQI4=AQI_list[54];
  picurl1= picture_generator(parseInt(AQI1));
  picurl2= picture_generator(parseInt(AQI2));
  picurl3= picture_generator(parseInt(AQI3));
  picurl4= picture_generator(parseInt(AQI4));
  status1= status_generator(parseInt(AQI1));
  status2= status_generator(parseInt(AQI2));
  status3= status_generator(parseInt(AQI3));
  status4= status_generator(parseInt(AQI4));
  conv.ask(new Carousel({
    items: {
    '新竹': {
      title: '新竹',
      description: status1,
      image: new Image({url: picurl1,alt: 'Image alternate text',}),},
    '香山': {
      title: '香山',
      description: status2,
      image: new Image({url: picurl2,alt: 'Image alternate text',}),},
    '竹東': {
      title: '竹東',
      description: status1,
      image: new Image({url: picurl3,alt: 'Image alternate text',}),},
    '湖口': {
      title: '湖口',
      description: status2,
      image: new Image({url: picurl4,alt: 'Image alternate text',}),},	  
  },
}));  }
  else if (County === "苗栗縣") {
 
 if(conv.screen){conv.ask('以下是「苗栗縣」的監測站列表');}
  else{conv.ask(new SimpleResponse({               
              speech: `<speak><p><s>以下是「苗栗縣」的監測站列表</s><s>選項有以下幾個<break time="0.5s"/>三義<break time="0.2s"/>苗栗<break time="0.2s"/>頭份<break time="1s"/>請選擇。</s></p></speak>`,
              text: '以下是「苗栗縣」的監測站列表'}));}
	AQI1=AQI_list[2];AQI2=AQI_list[41];AQI3=AQI_list[77];
  picurl1= picture_generator(parseInt(AQI1));
  picurl2= picture_generator(parseInt(AQI2));
  picurl3= picture_generator(parseInt(AQI3));
  status1= status_generator(parseInt(AQI1));
  status2= status_generator(parseInt(AQI2));
  status3= status_generator(parseInt(AQI3));

  conv.ask(new Carousel({
    items: {
    '三義': {
      title: '三義',
      description: status1,
      image: new Image({url: picurl1,alt: 'Image alternate text',}),},
    '苗栗': {
      title: '苗栗',
      description: status2,
      image: new Image({url: picurl2,alt: 'Image alternate text',}),},
    '頭份': {
      title: '頭份',
      description: status3,
      image: new Image({url: picurl3,alt: 'Image alternate text',}),},
  },
}));  }
  else if (County === "臺中市") {
    
	if(conv.screen){conv.ask('以下是「臺中市」的監測站列表');}
  else{conv.ask(new SimpleResponse({               
              speech: `<speak><p><s>以下是「臺中市」的監測站列表</s><s>選項有以下幾個<break time="0.5s"/>大里<break time="0.2s"/>西屯<break time="0.2s"/>沙鹿<break time="0.2s"/>忠明<break time="0.2s"/>豐原<break time="1s"/>請選擇。</s></p></speak>`,
              text: '以下是「臺中市」的監測站列表'}));}
	AQI1=AQI_list[6];AQI2=AQI_list[24];AQI3=AQI_list[25];AQI4=AQI_list[27];AQI5=AQI_list[79];
  picurl1= picture_generator(parseInt(AQI1));
  picurl2= picture_generator(parseInt(AQI2));
  picurl3= picture_generator(parseInt(AQI3));
  picurl4= picture_generator(parseInt(AQI4));
  picurl5= picture_generator(parseInt(AQI5));
  picurl6= picture_generator(parseInt(AQI6));
  status1= status_generator(parseInt(AQI1));
  status2= status_generator(parseInt(AQI2));
  status3= status_generator(parseInt(AQI3));
  status4= status_generator(parseInt(AQI4));
  status5= status_generator(parseInt(AQI5));
  status6= status_generator(parseInt(AQI6));

  conv.ask(new Carousel({
    items: {
    '大里': {
      title: '大里',
      description: status1,
      image: new Image({url: picurl1,alt: 'Image alternate text',}),},
    '西屯': {
      title: '西屯',
      description: status2,
      image: new Image({url: picurl2,alt: 'Image alternate text',}),},
    '沙鹿': {
      title: '沙鹿',
      description: status3,
      image: new Image({url: picurl3,alt: 'Image alternate text',}),},
    '忠明': {
      title: '忠明',
      description: status4,
      image: new Image({url: picurl4,alt: 'Image alternate text',}),},
    '豐原': {
      title: '豐原',
      description: status5,
      image: new Image({url: picurl5,alt: 'Image alternate text',}),},
  },
}));  }
  else if (County === "彰化縣") {
	  
    if(conv.screen){conv.ask('以下是「彰化縣」的監測站列表');}
  else{conv.ask(new SimpleResponse({               
              speech: `<speak><p><s>以下是「彰化縣」的監測站列表</s><s>選項有以下幾個<break time="0.5s"/>二林<break time="0.2s"/>彰化<break time="0.2s"/>大城<break time="0.2s"/>線西<break time="1s"/>請選擇。</s></p></speak>`,
              text: '以下是「彰化縣」的監測站列表'}));}
	AQI1=AQI_list[0];AQI2=AQI_list[67];AQI3=AQI_list[68];AQI4=AQI_list[75];
  picurl1= picture_generator(parseInt(AQI1));
  picurl2= picture_generator(parseInt(AQI2));
  picurl3= picture_generator(parseInt(AQI3));
  picurl4= picture_generator(parseInt(AQI4));
  status1= status_generator(parseInt(AQI1));
  status2= status_generator(parseInt(AQI2));
  status3= status_generator(parseInt(AQI3));
  status4= status_generator(parseInt(AQI4));

  conv.ask(new Carousel({
    items: {
    '二林': {
      title: '二林',
      description: status1,
      image: new Image({url: picurl1,alt: 'Image alternate text',}),},
    '彰化': {
      title: '彰化',
      description: status2,
      image: new Image({url: picurl2,alt: 'Image alternate text',}),},
    '大城': {
      title: '大城',
      description: status3,
      image: new Image({url: picurl3,alt: 'Image alternate text',}),},
    '線西': {
      title: '線西',
      description: status4,
      image: new Image({url: picurl4,alt: 'Image alternate text',}),},
  },
}));  }
  else if (County === "南投縣") {

  if(conv.screen){conv.ask('以下是「南投縣」的監測站列表');}
  else{conv.ask(new SimpleResponse({               
              speech: `<speak><p><s>以下是「南投縣」的監測站列表</s><s>選項有以下幾個<break time="0.5s"/>竹山<break time="0.2s"/>南投<break time="0.2s"/>埔里<break time="1s"/>請選擇。</s></p></speak>`,
              text: '以下是「南投縣」的監測站列表'}));}
	AQI1=AQI_list[22];AQI2=AQI_list[36];AQI3=AQI_list[42];
  picurl1= picture_generator(parseInt(AQI1));
  picurl2= picture_generator(parseInt(AQI2));
  picurl3= picture_generator(parseInt(AQI3));
  status1= status_generator(parseInt(AQI1));
  status2= status_generator(parseInt(AQI2));
  status3= status_generator(parseInt(AQI3));

  conv.ask(new Carousel({
    items: {
    '竹山': {
      title: '竹山',
      description: status1,
      image: new Image({url: picurl1,alt: 'Image alternate text',}),},
    '南投': {
      title: '南投',
      description: status2,
      image: new Image({url: picurl2,alt: 'Image alternate text',}),},
    '埔里': {
      title: '埔里',
      description: status3,
      image: new Image({url: picurl3,alt: 'Image alternate text',}),},
  },
}));  }
  else if (County === "雲林縣") {
   
   if(conv.screen){conv.ask('以下是「雲林縣」的監測站列表');}
  else{conv.ask(new SimpleResponse({               
              speech: `<speak><p><s>以下是「雲林縣」的監測站列表</s><s>選項有以下幾個<break time="0.5s"/>斗六<break time="0.2s"/>崙背<break time="0.2s"/>麥寮<break time="0.2s"/>臺西<break time="1s"/>請選擇。</s></p></speak>`,
              text: '以下是「雲林縣」的監測站列表'}));}
	AQI1=AQI_list[13];AQI2=AQI_list[48];AQI3=AQI_list[50];AQI4=AQI_list[69];
  picurl1= picture_generator(parseInt(AQI1));
  picurl2= picture_generator(parseInt(AQI2));
  picurl3= picture_generator(parseInt(AQI3));
  picurl4= picture_generator(parseInt(AQI4));
  status1= status_generator(parseInt(AQI1));
  status2= status_generator(parseInt(AQI2));
  status3= status_generator(parseInt(AQI3));
  status4= status_generator(parseInt(AQI4));

  conv.ask(new Carousel({
    items: {
    '斗六': {
      title: '斗六',
      description: status1,
      image: new Image({url: picurl1,alt: 'Image alternate text',}),},
    '崙背': {
      title: '崙背',
      description: status2,
      image: new Image({url: picurl2,alt: 'Image alternate text',}),},
    '麥寮': {
      title: '麥寮',
      description: status3,
      image: new Image({url: picurl3,alt: 'Image alternate text',}),},
    '臺西': {
      title: '臺西',
      description: status4,
      image: new Image({url: picurl4,alt: 'Image alternate text',}),},
  },
}));  }
  else if (County === "嘉義縣市") {
    if(conv.screen){conv.ask('以下是「嘉義縣市」的監測站列表');}
  else{conv.ask(new SimpleResponse({               
              speech: `<speak><p><s>以下是「嘉義縣市」的監測站列表</s><s>選項有以下幾個<break time="0.5s"/>嘉義<break time="0.2s"/>朴子<break time="0.2s"/>新港<break time="1s"/>請選擇。</s></p></speak>`,
              text: '以下是「嘉義縣市」的監測站列表'}));}

   AQI1=AQI_list[66];
   AQI2=AQI_list[20];
   AQI3=AQI_list[61];

  picurl1= picture_generator(parseInt(AQI1));
  picurl2= picture_generator(parseInt(AQI2));
  picurl3= picture_generator(parseInt(AQI3));
  status1= status_generator(parseInt(AQI1));
  status2= status_generator(parseInt(AQI2));
  status3= status_generator(parseInt(AQI3));

  conv.ask(new Carousel({
    items: {
    '嘉義': {
      title: '嘉義',
      description: status1,
      image: new Image({url: picurl1,alt: 'Image alternate text',}),},
    '朴子': {
      title: '朴子',
      description: status2,
      image: new Image({url: picurl2,alt: 'Image alternate text',}),},
    '新港': {
      title: '新港',
      description: status3,
      image: new Image({url: picurl3,alt: 'Image alternate text',}),},
  },
}));  }
  else if (County === "臺南市") {

  if(conv.screen){conv.ask('以下是「臺南市」的監測站列表');}
  else{conv.ask(new SimpleResponse({               
              speech: `<speak><p><s>以下是「臺南市」的監測站列表</s><s>選項有以下幾個<break time="0.5s"/>安南<break time="0.2s"/>善化<break time="0.2s"/>新營<break time="0.2s"/>臺南<break time="0.2s"/>麻豆<break time="1s"/>請選擇。</s></p></speak>`,
              text: '以下是「臺南市」的監測站列表'}));}
	AQI1=AQI_list[19];AQI2=AQI_list[51];AQI3=AQI_list[62];AQI4=AQI_list[71];AQI5=AQI_list[72];

  picurl1= picture_generator(parseInt(AQI1));
  picurl2= picture_generator(parseInt(AQI2));
  picurl3= picture_generator(parseInt(AQI3));
  picurl4= picture_generator(parseInt(AQI4));
  picurl5= picture_generator(parseInt(AQI5));
  status1= status_generator(parseInt(AQI1));
  status2= status_generator(parseInt(AQI2));
  status3= status_generator(parseInt(AQI3));
  status4= status_generator(parseInt(AQI4));
  status5= status_generator(parseInt(AQI5));
  
  conv.ask(new Carousel({
    items: {
    '安南': {
      title: '安南',
      description: status1,
      image: new Image({url: picurl1,alt: 'Image alternate text',}),},
    '善化': {
      title: '善化',
      description: status2,
      image: new Image({url: picurl2,alt: 'Image alternate text',}),},
    '新營': {
      title: '新營',
      description: status3,
      image: new Image({url: picurl3,alt: 'Image alternate text',}),},
    '臺南': {
      title: '臺南',
      description: status4,
      image: new Image({url: picurl4,alt: 'Image alternate text',}),},
    '麻豆': {
      title: '麻豆',
      description: status5,
      image: new Image({url: picurl5,alt: 'Image alternate text',}),},
  },
}));  }
  else if (County === "高雄市") {

   conv.ask(new SimpleResponse({               
              speech: `<speak><p><s>由於「高雄市」的測站數目較多，分為兩部份顯示，請選擇</s></p></speak>`,
              text: '「高雄市」監測站數量較多，\n分為兩部份顯示。'}));
   
  conv.ask(new Carousel({
  title: 'Carousel Title',
  items: {
    'NKaohsiung': {
      title: '北高雄市',
      description: '美濃、橋頭、楠梓  \n仁武、左營、前金',
    },
    'SKaohsiung': {
      title: '南高雄市',
      description: '鳳山、復興、前鎮  \n小港、大寮、林園',
    },	  },}));			  
}
  else if (County === "屏東縣") {

  if(conv.screen){conv.ask('以下是「屏東縣」的監測站列表');}
  else{conv.ask(new SimpleResponse({               
              speech: `<speak><p><s>以下是「屏東縣」的監測站列表</s><s>選項有以下幾個<break time="0.5s"/>屏東<break time="0.2s"/>琉球<break time="0.2s"/>恆春<break time="0.2s"/>潮州<break time="1s"/>請選擇。</s></p></speak>`,
              text: '以下是「屏東縣」的監測站列表'}));}
	AQI1=AQI_list[37];AQI2=AQI_list[38];AQI3=AQI_list[39];AQI4=AQI_list[74];

  picurl1= picture_generator(parseInt(AQI1));
  picurl2= picture_generator(parseInt(AQI2));
  picurl3= picture_generator(parseInt(AQI3));
  picurl4= picture_generator(parseInt(AQI4));
  status1= status_generator(parseInt(AQI1));
  status2= status_generator(parseInt(AQI2));
  status3= status_generator(parseInt(AQI3));
  status4= status_generator(parseInt(AQI4));

  conv.ask(new Carousel({
  title: 'Carousel Title',
  items: {
    '屏東': {
      title: '屏東',
      description: status1,
      image: new Image({url: picurl1,alt: 'Image alternate text',}),},
    '琉球': {
      title: '琉球',
      description: status2,
      image: new Image({url: picurl2,alt: 'Image alternate text',}),},
    '恆春': {
      title: '恆春',
      description: status3,
      image: new Image({url: picurl3,alt: 'Image alternate text',}),},
    '潮州': {
      title: '潮州',
      description: status4,
      image: new Image({url: picurl4,alt: 'Image alternate text',}),},
},
  }));}
  else if(station_array.indexOf(County)!==-1){
	indexnumber=station_array.indexOf(County); //取得監測站對應的編號
	db.collection('dataset').get()
  .then((snapshot) => {
    snapshot.forEach((doc) => {
	PublishTime=doc['_fieldsProto'].PublishTime.stringValue;
    });
  })
  .catch((err) => {
    console.log('Error getting documents', err);
  });
    AQI=AQI_list[parseInt(indexnumber)];Pollutant=Pollutant_list[parseInt(indexnumber)];
    Status= status_generator(parseInt(AQI));	
	
	if(Status!=="有效數據不足"){

    if(AQI>=0&&AQI<=50){picture= "https://dummyimage.com/1037x539/1e9165/ffffff.png&text="+AQI;}
	else if(AQI>=51&&AQI<=100){picture= "https://dummyimage.com/1037x539/fc920b/ffffff.png&text="+AQI;}
	else if(AQI>=101&&AQI<=150){picture= "https://dummyimage.com/1037x539/ef4621/ffffff.png&text="+AQI;}
	else if(AQI>=151&&AQI<=199){picture= "https://dummyimage.com/1037x539/b71411/ffffff.png&text="+AQI;}
	else if(AQI>=200&&AQI<=300){picture= "https://dummyimage.com/1037x539/5b0e31/ffffff.png&text="+AQI;}
    else if(AQI>301){picture= "https://dummyimage.com/1037x539/4f1770/ffffff.png&text="+AQI;}

    if(AQI>=0&&AQI<=50){info= "對一般民眾身體健康無影響。";}
	else if(AQI>=51&&AQI<=100){info= "可能對極敏感族群產生輕微影響。";}
	else if(AQI>=101&&AQI<=150){info= "若出現眼痛，咳嗽或喉嚨痛等症狀，英減少戶外活動，避免在戶外劇烈運動，敏感族群必要外出時英配戴口罩。";}
	else if(AQI>=151&&AQI<=199){info= "若出現眼痛，咳嗽或喉嚨痛等症狀，英減少體力消耗及戶外活動，在戶外避免長時間劇烈運動，敏感族群建議留在室內並減少體力消耗活動，必要外出英配戴口罩。"}
	else if(AQI>=200&&AQI<=300){info= "對敏感族群會有明顯惡化的現象，建議留在室內並減少體力消耗活動；一般大眾則視身體狀況，可能產生各種不同的症狀。";}
    else if(AQI>301){info= "健康威脅達到緊急，所有人都可能受到影響。";}

    if(AQI>=0&&AQI<=50){info_output= "對一般民眾身體健康無影響。";}
	else if(AQI>=51&&AQI<=100){info_output= "極特殊敏感族群建議注意  \n可能產生的咳嗽或呼吸急促症狀。";}
	else if(AQI>=101&&AQI<=150){info_output= "1.一般民眾如果有不適，應考慮減少戶外活動。  \n2.學生仍可進行戶外活動，但建議減少長時間劇烈運動。  \n3.有心臟、呼吸道及心血管疾病患者、孩童及老年人，建議減少體力消耗活動及戶外活動，外出應配戴口罩。  \n4.具有氣喘的人可能需增加使用吸入劑的頻率。";}
	else if(AQI>=151&&AQI<=199){info_output= "1.一般民眾如果有不適，應減少體力消耗及戶外活動。  \n2.學生應避免長時間劇烈運動並增加休息時間。  \n3.有心臟、呼吸道及心血管疾病患者、孩童及老年人，建議留在室內減少體力消耗活動，外出應配戴口罩。  \n4.具有氣喘的人可能需增加使用吸入劑的頻率。"}
	else if(AQI>=200&&AQI<=300){info_output= "1.一般民眾應減少戶外活動。  \n2.學生應立即停止戶外活動，並將課程調整於室內進行。  \n3.有心臟、呼吸道及心血管疾病患者、孩童及老年人應留在室內並減少體力消耗活動，外出應配戴口罩。  \n4.具有氣喘的人應增加使用吸入劑的頻率。";}
    else if(AQI>301){info_output= "1.一般民眾應避免戶外活動，室內應緊閉門窗，必要外出應配戴口罩等防護用具。  \n2.學生應立即停止戶外活動，並將課程調整於室內進行。  \n3.有心臟、呼吸道及心血管疾病患者、孩童及老年人應留在室內並避免體力消耗活動，外出應配戴口罩。  \n4.具有氣喘的人應增加使用吸入劑的頻率。";}

	
	if(AQI>=0&&AQI<=50){
		conv.ask(new SimpleResponse({               
              speech: `<speak><p><s>根據最新資料顯示，${County}監測站的AQI指數為${AQI}</s><s>您可放心出外活動!</s></p></speak>`,
	          text: '以下為該監測站的詳細資訊，\n您可放心出外活動!'}));	   output_title='「'+County+'」空氣品質'+Status;}
    else if(AQI>50){
		   conv.ask(new SimpleResponse({               
					  speech: `<speak><p><s>根據最新資料顯示，${County}監測站的AQI指數為${AQI}</s><s>主要汙染源來自${replaceString(Pollutant, '八小時', '')}</s><s>${info}</s></p></speak>`,
			          text: '以下為該監測站的詳細資訊。'}));    output_title='「'+County+'」空氣品質'+Status+'\n主要汙染源 '+Pollutant;}
    
		if(conv.screen){
			conv.ask(new BasicCard({  
					image: new Image({url:picture,alt:'Pictures',}),
					title:output_title,display: 'CROPPED',
					text:info_output+'  \n  \n**測站資訊發布時間** • '+replaceString(PublishTime, '-', '/'),})); 
		    conv.ask(new Suggestions('把它加入日常安排'));	}else{conv.close(`<speak><p><s>歡迎你隨時回來查詢，下次見</s></p></speak>`);}
    
  }else{
    conv.ask(new SimpleResponse({               
              speech: `<speak><p><s>由於${County}監測站正處於維修狀態或數據不足。我無法提供你最新資訊。</s></p></speak>`,
	text: '以下為「'+County+'」監測站的詳細資訊'}));	if(conv.screen){
			conv.ask(new BasicCard({  
					image: new Image({url:"https://dummyimage.com/1037x539/232830/ffffff.png&text=NaN",alt:'Pictures',}),
					title:'有效數據不足',
					text:'設備維護、儀器校正、儀器異常、傳輸異常、電力異常 \n或有效數據不足等需查修維護情形，以致資料暫時中斷服務。  \n  \n**測站資訊發布時間** • '+replaceString(PublishTime, '-', '/'), 
					display: 'CROPPED',
     })); 
	 	conv.ask(new Suggestions('把它加入日常安排'));	}else{conv.close(`<speak><p><s>歡迎你隨時回來查詢，下次見</s></p></speak>`);}

  }

 }else{
  
  County="undefined";
  if(conv.screen){conv.ask('我不懂你的意思，\n請輕觸下方卡片來進行區域查詢。');}
  else{conv.ask(new SimpleResponse({               
              speech: `<speak><p><s>我不懂你的意思，請試著透過區域查詢!</s><s>選項有以下幾個<break time="0.5s"/>北部地區<break time="0.2s"/>中部地區<break time="0.2s"/>南部地區<break time="0.2s"/>東部地區<break time="0.2s"/>離島地區<break time="1s"/>請選擇。</s></p></speak>`,
	  text: '請輕觸下方卡片來選擇查詢區域!'}));}

  conv.ask(new Carousel({
  title: 'Carousel Title',
  items: {
    'Northen': {
      title: '北部地區',
	description: '北北基、桃園市\n新竹縣市',},
    'Central': {
      title: '中部地區',
	description: '苗栗縣、臺中市\n雲林、彰化、南投',},
    'Southen': {
      title: '南部地區',
	  description: '嘉義縣市、台南市、\n高雄市、屏東縣',},
	'East': {
      title: '東部地區',
	  description: '宜蘭、花蓮、台東\n',},
		'Outlying_island': {
      title: '離島地區',
	  description: '澎湖縣、金門縣、\n連江縣',}
},}));
 }
 if(conv.screen){
	 conv.ask(new Suggestions('🌎 最近的測站'));}
	 if(County!=="undefined"){conv.ask(new Suggestions('回主頁面'));}
	 conv.ask(new Suggestions('👋 掰掰'));
     conv.user.storage.choose_station=County;
});


app.intent('結束對話', (conv) => {
    conv.user.storage = {}; //離開同時清除暫存資料
    conv.ask('希望能幫到一點忙!');
    conv.ask(new SimpleResponse({speech: '下次見',text: '下次見 👋',}));
    conv.close(new BasicCard({   
        title: '感謝您的使用!', 
        text:'如果有任何需要改進的地方，  \n歡迎到簡介頁面評分或給予反饋，謝謝!', 
        buttons: new Button({title: '開啟本程式的商店頁面',url: 'https://assistant.google.com/services/a/uid/000000fa049fc5e5',}),
  })); 
});

// Set the DialogflowApp object to handle the HTTPS POST request.
exports.air_pullute = functions.https.onRequest(app);