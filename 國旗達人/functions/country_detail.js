var country="";var country_english=""; var picture_url="";var discribe="";
var number=0;
module.exports = {
corrector: function(number) {
if(number===0){return ["阿富汗","Afghanistan ","https://i.imgur.com/rzqW1UQ.png","位於亞洲中南部的內陸國家，坐落在亞洲的心臟地區。因戰亂導致的經濟困難延續，是世界上最低度開發國家。"];}
else if(number===1){return ["奧蘭群島","Aland","https://i.imgur.com/5zMOUPN.png","位於波羅的海、波的尼亞灣入口處的一個群島，也是芬蘭的一個自治區，通用瑞典語。"];}
else if(number===2){return ["阿爾巴尼亞","Albania ","https://i.imgur.com/eQgZwLw.png","是一個位於歐洲東南部，巴爾幹半島西南部的國家。"];}
else if(number===3){return ["阿爾及利亞","Algeria ","https://i.imgur.com/Rj0zQIJ.png","是非洲北部阿拉伯馬格里布的一個國家，國土濱臨地中海，陸地面積居非洲國家之冠。"];}
else if(number===4){return ["美屬薩摩亞","American Samoa ","https://i.imgur.com/Q54tTOx.png","是在南太平洋的美國非合併非建制領土。最早自公元前1000年就有人定居，歐洲探險家在18世紀到達薩摩亞。"];}
else if(number===5){return ["安道爾","Andorra ","https://i.imgur.com/Wb4BPUq.png","也譯作安道拉親王國，中文通稱安道爾，為一袖珍國家，國土面積468平方公里。"];}
else if(number===6){return ["安哥拉","Angola ","https://i.imgur.com/kHm2h4C.png","為位於非洲西南部的國家，首都羅安達，西濱大西洋，北及東北鄰剛果民主共和國。"];}
else if(number===7){return ["安圭拉","Anguilla ","https://i.imgur.com/y2FTYS1.png","是英國十四個海外領土之一，位於小安地列斯群島北部，以伊麗莎白二世為元首。"];}
else if(number===8){return ["安地卡及巴布達","Antigua & Barbuda ","https://i.imgur.com/WeoWl21.png","是中美洲的一個島國，位於加勒比海和大西洋之間。"];}
else if(number===9){return ["阿根廷","Argentina ","https://i.imgur.com/lHW5kkf.png","由23個省和布宜諾斯艾利斯自治市組成的聯邦共和國，位於南美洲南部。"];}
else if(number===10){return ["亞美尼亞","Armenia ","https://i.imgur.com/U23C8Qu.png","是一個位於西亞或外高加索地區的共和制國家，有時也會被視為是東歐的一部分。"];}
else if(number===11){return ["阿魯巴","Aruba ","https://i.imgur.com/adRyFJe.png","是一個位於加勒比海地區的島嶼，目前是荷蘭王國四個構成國之一。"];}
else if(number===12){return ["澳大利亞","Australia ","https://i.imgur.com/Gqigku3.png","是一個位於南半球中北部、東半球東部的議會制君主立憲制國家。"];}
else if(number===13){return ["奧地利","Austria ","https://i.imgur.com/4jeRsjT.png","是一個位於中歐的內陸國家，但在歷史上也被分類成西歐或者東歐的主權國家。"];}
else if(number===14){return ["阿塞拜疆","Azerbaijan ","https://i.imgur.com/TNRCXBR.png","是一個位於西亞外高加索東部的跨大陸的總統制、憲法共和制的國家，所處地區是連接東歐和西亞的十字路口。"];}
else if(number===15){return ["巴哈馬","Bahamas","https://i.imgur.com/qRKZamV.png","是位於大西洋西側廬卡雅群島上的一個島國，全國包含700座島嶼和珊瑚礁。"];}
else if(number===16){return ["巴林","Bahrain ","https://i.imgur.com/eOdvW3x.png","是一個位於西亞、鄰近波斯灣西岸的島國。"];}
else if(number===17){return ["孟加拉國","Bangladesh ","https://i.imgur.com/y6GnYjC.png","該國98%的人口使用孟加拉語，國教為伊斯蘭教；信仰人口排名為伊斯蘭國家第三。"];}
else if(number===18){return ["巴貝多","Barbados ","https://i.imgur.com/ix45cZq.png","是位於加勒比海與大西洋邊界上的島國，是西印度群島最東端的島嶼，"];}
else if(number===19){return ["白俄羅斯","Belarus ","https://i.imgur.com/LcjXWXP.png","是位於東歐的內陸國家，首都為明斯克。"];}
else if(number===20){return ["比利時","Belgium ","https://i.imgur.com/N0q38gv.png","為歐洲聯盟的創始會員國之一，首都布魯塞爾是歐盟與北大西洋公約組織等大型國際組織的總部所在地。"];}
else if(number===21){return ["貝里斯","Belize ","https://i.imgur.com/UVejlYR.png","前身為英屬宏都拉斯，是中美洲東海岸的一個獨立國家。"];}
else if(number===22){return ["貝南","Benin ","https://i.imgur.com/FMhZImi.png","是非洲西部國家，舊名達荷美。貝南南瀕幾內亞灣。"];}
else if(number===23){return ["百慕達","Bermuda ","https://i.imgur.com/Jpeh8GX.png","法律文件中也作百慕達群島或薩默斯群島，位於北大西洋屬北美，是英國的自治海外領地。"];}
else if(number===24){return ["不丹","Bhutan ","https://i.imgur.com/iGd1mww.png","清朝史籍稱布魯克巴，是位於中國和印度之間喜馬拉雅山脈東段南坡的一個南亞內陸國。"];}
else if(number===25){return ["玻利維亞","Bolivia ","https://i.imgur.com/kGeV0jG.png","是南美洲的一個內陸國家，為南美洲國家聯盟的成員國。"];}
else if(number===26){return ["波士尼亞與赫塞哥維納","Bosnia & Herzegovina ","https://i.imgur.com/lOjQh81.png","是歐洲南部巴爾幹半島西部的多山國家，首都塞拉耶佛。 波赫為組成原南斯拉夫的六個社會主義共和國之一。"];}
else if(number===27){return ["波札那","Botswana ","https://i.imgur.com/v6PPYTN.png","是位於非洲南部的內陸國，全國國境皆為乾燥的台地地形。"];}
else if(number===28){return ["巴西","Brazil ","https://i.imgur.com/OsVLIeG.png","是拉丁美洲最大的國家。人口數略多於2億，居世界第五。"];}
else if(number===29){return ["英屬維京群島","British Virgin Is. ","https://i.imgur.com/35BNO1M.png","是英國海外領土，位於加勒比海地區，處於波多黎各以東。"];}
else if(number===30){return ["汶萊","Brunei ","https://i.imgur.com/q1qHDzi.png","也作汶萊和平之國，簡稱汶萊或文萊，舊亦稱婆羅乃，是一個位於婆羅洲北岸的東南亞國家。"];}
else if(number===31){return ["保加利亞","Bulgaria ","https://i.imgur.com/eYarg1h.png","是位於歐洲東南部巴爾幹半島上的一個國家，東部濱臨黑海。"];}
else if(number===32){return ["布吉納法索","Burkina Faso ","https://i.imgur.com/SEFku5v.png","布吉納法索為全球識字率最低的國家之一，只有約兩成三的國民識字。低度開發國家之一。"];}
else if(number===33){return ["緬甸","Burma ","https://i.imgur.com/hbIaD6r.png","是一個東南亞國家，位於中南半島西部，國土面積約67.65萬平方公里，是世界上第40大國家、東南亞第二大國。"];}
else if(number===34){return ["蒲隆地","Burundi ","https://i.imgur.com/zRwQqpr.png","是一個位於東部非洲的小型內陸國家，其中與剛果民主共和國的邊界有超過一半是座落在著名的坦噶尼喀湖湖面上。"];}
else if(number===35){return ["柬埔寨","Cambodia ","https://i.imgur.com/Y7Caqob.png","位於東南亞中南半島，境內有湄公河和東南亞最大的淡水湖－洞里薩湖。"];}
else if(number===36){return ["喀麥隆","Cameroon ","https://i.imgur.com/CIeymBP.png","是位於非洲中西部的單一制共和國。"];}
else if(number===37){return ["新喀里多尼亞","Caledonia","https://i.imgur.com/AIxsbnf.png","是法國在大洋洲西南部的一個特別集體。該地區整體主要由新喀里多尼亞島和洛亞蒂群島組成。"];}
else if(number===38){return ["加拿大","Canada ","https://i.imgur.com/aTQld44.png","加拿大的領土面積達998萬4670平方公里，為全球面積第二大國家。加拿大素有「楓葉之國」的美譽，渥太華為該國首都。"];}
else if(number===39){return ["維德角","Cape Verde ","https://i.imgur.com/8KSUmgs.png","是一個位於非洲西岸的大西洋島國。它橫跨大西洋中部的10個火山島，距離西非海岸線570公里。"];}
else if(number===40){return ["開曼群島","Cayman Islands ","https://i.imgur.com/tvWhyq6.png","是英國在美洲加勒比海西印度群島的一塊海外屬地，由大開曼、小開曼和開曼布拉克3個島嶼組成。開曼群島是世界第四大離岸金融中心，並是著名的潛水勝地。"];}
else if(number===41){return ["中非共和國","Central African Rep. ","https://i.imgur.com/YfeQ6hF.png","位於中部非洲的國家，其前身為法屬烏班基-夏利領地，是法國位於非洲的殖民地之一。"];}
else if(number===42){return ["查德","Chad ","https://i.imgur.com/3MRfwoA.png","是非洲中部的一個內陸國家，由於地處非洲中心，遠離海洋，全年高溫炎熱，且國土大部為沙漠地區，又被稱「非洲死亡之心」。"];}
else if(number===43){return ["智利","Chile ","https://i.imgur.com/56YANUU.png","是位於南美洲的一個國家，西和南瀕太平洋，由於地處美洲大陸的最南端，與南極洲隔海相望，智利人常稱自己的國家為「天涯之國」。"];}
else if(number===44){return ["聖誕島","Christmas Island","https://i.imgur.com/hiPPSK9.png","是澳大利亞位於印度洋東北部的海外領地，為火山島，面積135平方公里。"];}
else if(number===45){return ["中國","China ","https://i.imgur.com/X0AYlD8.png","是位於東亞的社會主義國家，首都位於北京。被視為亞洲地區重要地域大國，也被視為當今潛在超級大國之一。"];}
else if(number===46){return ["哥倫比亞","Colombia ","https://i.imgur.com/ih5TVn7.png","是南美洲西北部的一個國家，為南美洲國家聯盟的成員國。"];}
else if(number===47){return ["葛摩","Comoros ","https://i.imgur.com/EruvC5d.png","是非洲阿拉伯國家島國，位於印度洋莫三比克海峽北部，莫三比克和馬達加斯加之間。"];}
else if(number===48){return ["剛果民主共和國","Congo, Dem. Rep. ","https://i.imgur.com/BFoXoY2.png","是位於非洲中部的國家，簡稱民主剛果、剛果。陸地面積約234.5萬平方公里，是非洲第2大、暨世界第11大的國家。"];}
else if(number===49){return ["剛果共和國","Congo, Repub. of the ","https://i.imgur.com/KGHuHf7.png","簡稱剛果或剛果，是非洲中部的一個國家。首都為布拉薩市。"];}
else if(number===50){return ["庫克群島","Cook Islands ","https://i.imgur.com/prxewUq.png","是一個位在南太平洋上，介於法屬玻里尼西亞與斐濟之間，由15個島嶼組成的群島，其命名起源於遠征探索南太平洋，發現了許多島嶼的詹姆斯·庫克船長。"];}
else if(number===51){return ["象牙海岸","Ivory ","https://i.imgur.com/CVoXnLG.png","是位於西非的國家在冷戰時期曾是最繁盛的西非熱帶國家之一，但1985年後因政治腐敗及缺乏改革致使經濟一蹶不振。"];}
else if(number===52){return ["哥斯大黎加","Costa Rica ","https://i.imgur.com/OjmpWlb.png","哥斯大黎加是當今世界上第一個裁撤軍隊的國家。哥斯大黎加首都在聖荷西。"];}
else if(number===53){return ["科科斯群島","Cocos Islands","https://i.imgur.com/p6FIlo7.png","是澳洲位於印度洋的海外領地，位於澳大利亞本土與印尼之間。"];}
else if(number===54){return ["克羅埃西亞","Croatia ","https://i.imgur.com/tsLFqSl.png","是一個位於中歐、地中海和巴爾幹半島交會處的單一議會共和制國家，首都為札格瑞布。"];}
else if(number===55){return ["庫拉索","Curacao","https://i.imgur.com/bBv6Iks.png","原為荷屬安地列斯群島的一部分，2010年10月10日後改制為荷蘭王國的構成國。"];}
else if(number===56){return ["古巴","Cuba ","https://i.imgur.com/fG7t2x9.png","是美洲加勒比海北部的一個群島國家。"];}
else if(number===57){return ["賽普勒斯","Cyprus ","https://i.imgur.com/TwlFa3X.png","是位於歐洲與亞洲之間的一個島國，位於地中海東部，面積9,251平方公里。 "];}
else if(number===58){return ["捷克","Czech Republic ","https://i.imgur.com/f1Ce851.png","是一個位在於中歐的內陸國家，但在歷史上也被分類成西歐或者東歐的國家。"];}
else if(number===59){return ["丹麥","Denmark ","https://i.imgur.com/5Ss87JT.png","是一個丹麥本土、法羅群島和格陵蘭三者的合稱，三者依照「王國邦聯」的原則組成統一的君主立憲制的國家。"];}
else if(number===60){return ["吉布提","Djibouti ","https://i.imgur.com/ScNLg02.png","位於非洲東北部亞丁灣西岸的國家，位在亞丁灣與紅海交界處。戰略位置十分重要。"];}
else if(number===61){return ["多明尼克","Dominica","https://i.imgur.com/Q6ZjDBL.png","是一個位於中美洲加勒比海的島國，西印度群島之一，首都為羅索。"];}
else if(number===62){return ["多明尼加","Dominicana","https://i.imgur.com/jIF2yqw.png","是位於加勒比海的島國，首都與最大都市為聖多明哥。"];}
else if(number===63){return ["東帝汶","East Timor ","https://i.imgur.com/emvR2xg.png","是位於東南亞地區帝汶島東端的國家，曾是葡萄牙在遠東僅有的兩個殖民地之一。"];}
else if(number===64){return ["厄瓜多","Ecuador ","https://i.imgur.com/49QBQYH.png","是一個位於南美洲西北部的國家，於1809年8月10日時脫離西班牙的統治獨立建國。"];}
else if(number===65){return ["埃及","Egypt ","https://i.imgur.com/4cZGhFP.png","是東北非洲人口最多的國家，該國大部分國土位於北非地區。伊斯蘭教為國教。"];}
else if(number===66){return ["薩爾瓦多","El Salvador ","https://i.imgur.com/0ijqvtU.png","是位於中美洲北部國家，為中美洲唯一不靠大西洋之國家，首都為聖薩爾瓦多。"];}
else if(number===67){return ["赤道幾內亞","Equatorial Guinea ","https://i.imgur.com/s2VYwTq.png","是中非西部的國家之一，雖然國名中帶有赤道字樣，但赤道只通過國土之間的海域，並未直接穿過該國領土。"];}
else if(number===68){return ["厄利垂亞","Eritrea ","https://i.imgur.com/9xkfNbt.png","是位於非洲東北部的國家，瀕臨紅海，面積12.5萬平方公里，人口約650萬人，首都為阿斯瑪拉。"];}
else if(number===69){return ["英格蘭","England","https://i.imgur.com/sfcKeCm.png","是大不列顛及北愛爾蘭聯合王國的一個構成國，英國面積最大，人口最多，經濟最發達的一個部分。"];}
else if(number===70){return ["愛沙尼亞","Estonia ","https://i.imgur.com/YrY06is.png","位於歐洲東北部，其國土由大陸部分和波羅的海的2222個島嶼組成。"];}
else if(number===71){return ["歐盟","EU","https://i.imgur.com/Cp1R5Pv.png","是根據1993年生效的《馬斯垂克條約》所建立的政治經濟聯盟，現擁有28個成員國。"];}
else if(number===72){return ["衣索比亞","Ethiopia ","https://i.imgur.com/JHEhOOO.png","是全球人口最多的內陸國家，以及繼奈及利亞以後，人口最多的非洲國家，有超過1億居民。"];}
else if(number===73){return ["法羅群島","Faroe Islands ","https://i.imgur.com/21T2jcE.png","是丹麥王國的自治領地，但不是歐盟的一部分。"];}
else if(number===74){return ["斐濟","Fiji ","https://i.imgur.com/kve7wBW.png","位於南太平洋，國家名稱是源自東加語中的「島嶼」，並且轉為斐濟文中的「Viti」。"];}
else if(number===75){return ["芬蘭","Finland ","https://i.imgur.com/4V64Ukb.png","是北歐國家，是世界高度的已開發國家和福利國家，國民享有極高標準的生活品質。"];}
else if(number===76){return ["聖赫倫那","Saint Helena","https://i.imgur.com/Vrag7uC.png","是大西洋島嶼，主權屬於英國，離非洲西岸1900公里，"];}
else if(number===77){return ["法國","France ","https://i.imgur.com/bHlwWpr.png","是本土位於西歐並具有海外大區及領地的主權國家，首都為歐洲大陸最大的文化與金融中心巴黎。"];}
else if(number===78){return ["法屬圭亞那","French Guiana ","https://i.imgur.com/YaoUE9u.png","是法國的一個海外大區和單一領土集體，下轄一個海外省，即圭亞那省。"];}
else if(number===79){return ["法屬波利尼西亞","French Polynesia ","https://i.imgur.com/0zbxjUd.png","是法國在南太平洋的海外集體和自治國，由幾組玻里尼西亞群島組成。"];}
else if(number===80){return ["加彭","Gabon ","https://i.imgur.com/U2hYh2I.png","是位於非洲中西部的一個國家。首都和最大城市是利伯維爾。"];}
else if(number===81){return ["甘比亞","Gambia, The ","https://i.imgur.com/ni2uBXu.png","是位於西非的國家，陸上被塞內加爾環繞，是非洲大陸最小的國家。"];}
else if(number===82){return ["喬治亞","Georgia ","https://i.imgur.com/rLltSji.png","是一個位於西亞外高加索西南隅的歐亞邊界國家。它曾經是蘇聯加盟共和國，1991年4月9日正式獨立。"];}
else if(number===83){return ["德國","Germany ","https://i.imgur.com/vHnAVaU.png","是位於中西歐的聯邦議會共和制國家，，由16個邦組成，首都與最大城市為柏林。"];}
else if(number===84){return ["迦納","Ghana ","https://i.imgur.com/GbVNHVZ.png","是非洲西部的國家，首都阿克拉。"];}
else if(number===85){return ["直布羅陀","Gibraltar ","https://i.imgur.com/BAaUIQz.png","是14個英國海外領土之一，也是最小的一個，位於伊比利亞半島的末端，是通往地中海的入口。 "];}
else if(number===86){return ["希臘","Greece ","https://i.imgur.com/QRDKO3C.png","是位於歐洲東南部的跨大洲國家。雅典為希臘首都及最大城市，塞薩洛尼基為第二大城市。"];}
else if(number===87){return ["格陵蘭","Greenland ","https://i.imgur.com/Yjlartx.png","是世界第一大島，在丹麥王國框架內的自治國。"];}
else if(number===88){return ["格瑞那達","Grenada ","https://i.imgur.com/TDmqHsM.png","是美洲西印度群島中向風群島南部國家。主要宗教為天主教，大英國協成員國。"];}
else if(number===89){return ["瓜地洛普","Guadeloupe ","https://i.imgur.com/1sNmBct.png","群島位於小安的列斯群島中部、東加勒比海上。是法國26個大區中的一員和法蘭西共和國整體的一部分。"];}
else if(number===90){return ["關島","Guam ","https://i.imgur.com/tE6rdjG.png","為美國的非合併建制屬地，位於西太平洋的島嶼。"];}
else if(number===91){return ["瓜地馬拉","Guatemala ","https://i.imgur.com/9erdrrk.png","位於中美洲，境內有數個湖泊，其中最大湖泊為伊薩瓦爾湖。"];}
else if(number===92){return ["根息","Guernsey ","https://i.imgur.com/4Bimmzb.png","是英國的皇家屬地之一，位於英吉利海峽靠近法國海岸線的海峽群島之中。"];}
else if(number===93){return ["幾內亞","Guinea ","https://i.imgur.com/gDwbhBy.png","是位於西非的國家，國名源於柏柏爾語，意思是「黑人的國家」。"];}
else if(number===94){return ["幾內亞比索","Guinea-Bissau ","https://i.imgur.com/eclZWYL.png","是在北大西洋岸的西非國家，曾為葡屬幾內亞。是世界上最低度開發國家之一。"];}
else if(number===95){return ["圭亞那","Guyana ","https://i.imgur.com/xjms17R.png","位於南美洲北部，是南美洲唯一以英語為官方語言的國家，也是大英國協成員國。"];}
else if(number===96){return ["海地","Haiti ","https://i.imgur.com/HZgz6Yj.png","位於加勒比海的島國。是美洲唯一以黑人為主體民族的共和國。"];}
else if(number===97){return ["宏都拉斯","Honduras ","https://i.imgur.com/DkbIQgH.png","中美洲共和制國家，首都德古西加巴。"];}
else if(number===98){return ["香港","Hong Kong ","https://i.imgur.com/4IVaXYK.png","位於中國東南方，早期為英國的殖民地。是全球金融重鎮與主要港口。"];}
else if(number===99){return ["匈牙利","Hungary ","https://i.imgur.com/Oe5GvNC.png","位於中歐的內陸國家，首都為布達佩斯。"];}
else if(number===100){return ["冰島","Iceland ","https://i.imgur.com/ueRLoRn.png","北大西洋中的一個島國，位於北大西洋和北冰洋的交匯處，通常被視為北歐五國之一。"];}
else if(number===101){return ["印度","India ","https://i.imgur.com/xqyNSmB.png","是位於南亞印度次大陸上的國家，印度面積位列世界第七，印度人口眾多，位列世界第二。"];}
else if(number===102){return ["印度尼西亞","Indonesia ","https://i.imgur.com/iKYTUej.png","由17,508個島嶼組成，是世界上最大的群島國家，疆域橫跨亞洲及大洋洲，別稱「萬島之國」。"];}
else if(number===103){return ["伊朗","Iran ","https://i.imgur.com/nRYsWXy.png","位於西亞，為中東國家，501年之前很長一段歷史時間稱波斯。"];}
else if(number===104){return ["伊拉克","Iraq ","https://i.imgur.com/PEL1Roo.png","位於西亞—中東地區的共和國，在歷史上曾被稱為美索不達米亞，是人類文明的主要發源地之一。"];}
else if(number===105){return ["愛爾蘭","Ireland ","https://i.imgur.com/gqOorOv.png","是一個西歐國家，歐盟成員國之一，位於歐洲大陸西北海岸外的愛爾蘭島，約占該島南部的5/6面積。"];}
else if(number===106){return ["曼島","Isle of Man ","https://i.imgur.com/Ww8vl4f.png","位於英格蘭與愛爾蘭之間的海上島嶼，曼島是英國皇家屬地，嚴格來說在法律上並不是英國的一部分。"];}
else if(number===107){return ["以色列","Israel ","https://i.imgur.com/zt1SMlI.png","是位於西亞的主權國家，其領土範圍不大，但地形和氣候相當多樣。"];}
else if(number===108){return ["義大利","Italy ","https://i.imgur.com/PnqgNam.png","是一個歐洲主權國家，主要由位於南歐的靴型亞平寧半島及兩個地中海島嶼西西里島和撒丁島所組成。"];}
else if(number===109){return ["牙買加","Jamaica ","https://i.imgur.com/dbW8zAv.png","是加勒比海地區的一個島國。 原本是印第安人阿拉瓦克語系泰諾族的居住地。"];}
else if(number===110){return ["日本","Japan ","https://i.imgur.com/aNAJqeP.png","是位於東亞的島嶼國家，當中逾3,500萬人居住於首都東京及周邊數縣構成的首都圈，為世界最大的都市圈。"];}
else if(number===111){return ["澤西島","Jersey ","https://i.imgur.com/X5CDWal.png","是英國王冠屬地，位於諾曼地半島外海20公里處的海面上。"];}
else if(number===112){return ["約旦","Jordan ","https://i.imgur.com/HAh9RNe.png","是位於西亞的中東的國家。"];}
else if(number===113){return ["哈薩克","Kazakhstan ","https://i.imgur.com/TDet9PS.png","為跨洲國家，地跨歐亞兩洲，為世界上最大的內陸國家，世界第九大國。"];}
else if(number===114){return ["肯亞","Kenya ","https://i.imgur.com/5sbZqMM.png","位於東非，瀕臨印度洋，首都為奈洛比。 肯亞曾是英國殖民地，1963年12月12日從英國獨立。"];}
else if(number===115){return ["吉里巴斯","Kiribati ","https://i.imgur.com/EEaerFM.png","是位於太平洋上的島嶼國家，國名源自於該國三大群島當中最大的吉爾伯特群島之密克羅尼西亞語音譯。"];}
else if(number===116){return ["北韓","Korea, North ","https://i.imgur.com/vpMxUhl.png","是位於東亞朝鮮半島北部的共和國，於第二次世界大戰後的1948年9月9日成立。"];}
else if(number===117){return ["南韓","Korea, South ","https://i.imgur.com/33Tjzo3.png","是位於東亞朝鮮半島南部的民主共和國，首都為首爾。"];}
else if(number===118){return ["科沃索"," Kosovo","https://i.imgur.com/8idb0kf.png","是一個主權爭端地區及有限承認國家，位於歐洲東南部巴爾幹半島。"];}
else if(number===119){return ["科威特","Kuwait ","https://i.imgur.com/XceyNt3.png","是位於西亞阿拉伯半島東北部、波斯灣西北岸的君主制國家。該國首都科威特城與該國名稱同名。"];}
else if(number===120){return ["吉爾吉斯","Kyrgyzstan ","https://i.imgur.com/KMT3fQ7.png","是一個位於中亞的內陸國家。 作為中亞古國，吉爾吉斯歷史達兩千年，經歷各種王朝與文化。"];}
else if(number===121){return ["寮國","Laos ","https://i.imgur.com/mMBpDR8.png","是東南亞國家中唯一的內陸國家。"];}
else if(number===122){return ["拉脫維亞","Latvia ","https://i.imgur.com/hWy8apy.png","是位於波羅的海東岸的歐洲國家，是波羅的海國家之一。"];}
else if(number===123){return ["黎巴嫩","Lebanon ","https://i.imgur.com/4x0dUG5.png","是位於亞洲西南部、地中海東岸，習慣上稱為中東國家。"];}
else if(number===124){return ["賴索托","Lesotho ","https://i.imgur.com/D4f2UsH.png","位處非洲南部，是全世界最大國中國，全境完全被南非共和國包圍，因地處高原，賴索托也被稱為「天空王國」。"];}
else if(number===125){return ["賴比瑞亞","Liberia ","https://i.imgur.com/lHj1Ox0.png","位於西非，西南瀕大西洋的總統制共和國家。 "];}
else if(number===126){return ["利比亞","Libya ","https://i.imgur.com/Dt4nx16.png","是北非的一個阿拉伯國家。"];}
else if(number===127){return ["列支敦士登","Liechtenstein ","https://i.imgur.com/etRBMUe.png","歐洲中部的內陸小國，夾在瑞士與奧地利兩國間，為世界上僅有的兩個雙重內陸國之一。"];}
else if(number===128){return ["立陶宛","Lithuania ","https://i.imgur.com/NESqT1R.png","位於歐洲東北部，是波羅的海三國之一，首都維爾紐斯。 "];}
else if(number===129){return ["盧森堡","Luxembourg ","https://i.imgur.com/6oEm2D9.png","是一個位於歐洲的內陸國家，也是現今歐洲大陸僅存的大公國，首都盧森堡市。"];}
else if(number===130){return ["荷屬聖馬丁","Sint Maarten","https://i.imgur.com/DJFxBdL.png","為荷蘭王國的4個構成國之一，首府菲利普斯堡。"];}
else if(number===131){return ["澳門","Macau ","https://i.imgur.com/jnu0PqG.png","是中國兩個特別行政區之一，重要產業為旅遊業與博彩業。為世界上人口密度最高的地區，每平方公里人口超過2萬。"];}
else if(number===132){return ["馬其頓","Macedonia ","https://i.imgur.com/oJguVo3.png","是位於東南歐的巴爾幹半島南部的內陸國家，首都與最大都市是史高比耶。"];}
else if(number===133){return ["馬達加斯加","Madagascar ","https://i.imgur.com/0uTxipz.png","是一個位於非洲東南部近海的印度洋島嶼國家。"];}
else if(number===134){return ["馬拉威","Malawi ","https://i.imgur.com/n9vQ3GS.png","是一個位於非洲東南部的內陸國家，首都利隆圭位於馬拉威的中部。"];}
else if(number===135){return ["馬來西亞","Malaysia ","https://i.imgur.com/Y75BWxE.png","位於東南亞的國家，實行聯邦制、議會民主制、選舉君主制和君主立憲制國家，"];}
else if(number===136){return ["馬爾地夫","Maldives ","https://i.imgur.com/GWGkxbd.png","位於斯里蘭卡及印度西南偏南對出的印度洋水域約500公里處"];}
else if(number===137){return ["馬利","Mali ","https://i.imgur.com/wQD2Tfs.png","是位於西非的內陸國家，西非面積第二大的國家。它的北部邊界在撒哈拉沙漠的中心，大多數人集中在南部，尼日河和塞內加爾河源於這裡。"];}
else if(number===138){return ["馬爾他","Malta ","https://i.imgur.com/sxRbgLS.png","位於南歐的共和制的一個微型國家，首都法勒他。"];}
else if(number===139){return ["馬紹爾群島","Marshall Islands ","https://i.imgur.com/2ldNovK.png","是位於北太平洋的島嶼國家。馬紹爾群島是密克羅尼西亞群島的一部分。"];}
else if(number===140){return ["馬丁尼克","Martinique ","https://i.imgur.com/Z87fN7a.png","是法國的一個海外大區。下轄一個省，即馬丁尼克省。面積1,130平方公里，首府法蘭西堡。"];}
else if(number===141){return ["毛里塔尼亞","Mauritania ","https://i.imgur.com/XpF8Coo.png","是西非阿拉伯國家之一。"];}
else if(number===142){return ["模里西斯","Mauritius ","https://i.imgur.com/xJmENvy.png","位於印度洋的西南方，距非洲大陸2,200公里。"];}
else if(number===143){return ["馬約特島","Mayotte ","https://i.imgur.com/kRGOAAd.png","是法國的海外大區，下轄一個省，即馬約特省。"];}
else if(number===144){return ["墨西哥","Mexico ","https://i.imgur.com/Xv4RIpm.png","是中美洲的一個聯邦共和制主權國家，為世界第十人口大國與西班牙語世界第一人口大國。"];}
else if(number===145){return ["密克羅尼西亞","Federated States of Micronesia","https://i.imgur.com/bLf6cm2.png","是一個西太平洋島國，屬於加羅林群島，全國有607個島嶼。"];}
else if(number===146){return ["摩爾多瓦","Moldova ","https://i.imgur.com/hggQnVh.png","是位於東歐的內陸國家，首都是基西紐。"];}
else if(number===147){return ["摩納哥","Monaco ","https://i.imgur.com/OjYBmwh.png","是一個位於歐洲的城邦國家。主要由摩納哥舊城和隨後建立起來的週遭地區組成。"];}
else if(number===148){return ["蒙古","Mongolia ","https://i.imgur.com/zsWcZFk.png","是一個東亞的單一半總統制共和國，首都與最大城市為烏蘭巴托。"];}
else if(number===149){return ["蒙哲臘","Montserrat ","https://i.imgur.com/FiFu7Kk.png","是英國海外領土，為西印度群島中背風群島南部的火山島。"];}
else if(number===150){return ["蒙特內哥羅","Crna Gora","https://i.imgur.com/QqZ0heP.png","是位於巴爾幹半島西南部、亞得里亞海東岸上的一個多山國家。"];}
else if(number===151){return ["摩洛哥","Morocco ","https://i.imgur.com/Ac1yoVp.png","是北非西端的一個君主立憲制國家。"];}
else if(number===152){return ["莫三比克","Mozambique ","https://i.imgur.com/13gTKOQ.png","位於非洲南部，臨印度洋，隔莫三比克海峽與馬達加斯加相望。"];}
else if(number===153){return ["納米比亞","Namibia ","https://i.imgur.com/rSq8c3t.png","是位於南部非洲西面的共和國。"];}
else if(number===154){return ["諾魯","Nauru ","https://i.imgur.com/Am6E94R.png","是位於南太平洋密克羅尼西亞群島的島國。亦是世界上最小的島國，"];}
else if(number===155){return ["尼泊爾","Nepal ","https://i.imgur.com/brbgY9S.png","是南亞喜馬拉雅山脈地區的一個內陸國家，世界上最高的十座山峰中有八座位於尼泊爾境內。"];}
else if(number===156){return ["荷蘭","Netherlands ","https://i.imgur.com/5xpfmzo.png","直譯低地之國，是主權國家荷蘭王國下的主要構成國。"];}
else if(number===157){return ["荷屬安地列斯","Netherlands Antilles ","https://i.imgur.com/7f5RXll.png","位於加勒比海之中，原稱荷屬西印度。"];}
else if(number===158){return ["紐西蘭","New Zealand ","https://i.imgur.com/fFlRZ4d.png","是主權島國紐西蘭王國的主要領域，首都為威靈頓，但最大的城市為奧克蘭都會區。"];}
else if(number===159){return ["尼加拉瓜","Nicaragua ","https://i.imgur.com/WdDWm7b.png","是位於中美洲的一個國家，為中美地峽面積最大的國家。"];}
else if(number===160){return ["尼日","Niger ","https://i.imgur.com/lQLhCjk.png","是西非內陸國家之一，因尼日河得名，首都尼阿美。"];}
else if(number===161){return ["奈及利亞","Nigeria ","https://i.imgur.com/xP1FE4S.png","是西非國家，位於非洲的幾內亞灣西岸頂點。"];}
else if(number===162){return ["紐埃","Niuē","https://i.imgur.com/vZaVvc0.png","是位於太平洋中南部島國，國土爲一橢圓形島嶼以及周圍的珊瑚礁環繞組成，面積260平方公里。"];}
else if(number===163){return ["北馬里亞納群島","N. Mariana Islands ","https://i.imgur.com/Lsvd17N.png","是美國的一個自由邦，位於西太平洋上的戰略要地。"];}
else if(number===164){return ["挪威","Norway ","https://i.imgur.com/cirrUmz.png","位於斯堪地那維亞半島的西部，東與瑞典接壤。"];}
else if(number===165){return ["巴勒斯坦","Palestine","https://i.imgur.com/er4qxkZ.png","是一個由居住在西亞－巴勒斯坦地區的約旦河西岸以及加薩走廊的阿拉伯人所建立的國家。"];}
else if(number===166){return ["阿曼","Oman ","https://i.imgur.com/zA8M08K.png","是位於西南亞，阿拉伯半島東南沿海的國家。在上古時代稱作「馬乾」。"];}
else if(number===167){return ["巴基斯坦","Pakistan ","https://i.imgur.com/H3eI5Yp.png","位於南亞，是大英國協成員國。"];}
else if(number===168){return ["帛琉","Palau ","https://i.imgur.com/rS3waKI.png","位於西太平洋的島嶼國家。全國有約340座島嶼。"];}
else if(number===169){return ["巴拿馬","Panama ","https://i.imgur.com/bRPSOPg.png","是中美洲最南部的國家，連接大西洋及太平洋的巴拿馬運河位於國家的中央，擁有重要的戰略與經濟地位。"];}
else if(number===170){return ["巴布亞紐幾內亞","Papua New Guinea ","https://i.imgur.com/CmWdB1J.png","是位於太平洋西南部的一個島嶼國家。"];}
else if(number===171){return ["巴拉圭","Paraguay ","https://i.imgur.com/sVTtD49.png","是南美洲內陸國家，國名在西班牙語中是「鸚鵡」的意思。"];}
else if(number===172){return ["秘魯","Peru ","https://i.imgur.com/HFqLAL3.png","是南美洲西部一個實行總統制議會的民主共和國，官方語言是西班牙語。"];}
else if(number===173){return ["菲律賓","Philippines ","https://i.imgur.com/1Bv84oe.png","是位於東南亞的一個群島國家。"];}
else if(number===174){return ["波蘭","Poland ","https://i.imgur.com/lx5cb84.png","位於中歐的民主共和國。絕大部分地區位於東歐平原，首都是華沙。"];}
else if(number===175){return ["聖皮埃與密克隆群島","Saint Pierre and Miquelon","https://i.imgur.com/PRPQFZI.png","是法國的一個海外屬地之一，亦是歐盟的一部分，"];}
else if(number===176){return ["法屬玻里尼西亞","Polynésie française","https://i.imgur.com/pgqpJ9m.png","是法國在南太平洋的海外集體和自治國，由幾組玻里尼西亞群島組成。"];}
else if(number===177){return ["葡萄牙","Portugal ","https://i.imgur.com/tSStx8l.png","是西南歐伊比利亞半島上的共和國，實行單一制和半總統制，首都為里斯本。"];}
else if(number===178){return ["波多黎各","Puerto Rico ","https://i.imgur.com/mhXp7Z9.png","是美國在加勒比海地區的一個自治邦，在西班牙語裡波多黎各的意思是「富裕海港」。"];}
else if(number===179){return ["卡達","Qatar ","https://i.imgur.com/8PUWB8y.png","是位於西亞的君主專制國，屬於遜尼派的阿拉伯國家。"];}
else if(number===180){return ["留尼旺","Reunion ","https://i.imgur.com/2n37t0E.png","是一座印度洋西部馬斯克林群島中的火山島。為法國的海外大區之一。"];}
else if(number===181){return ["羅馬尼亞","Romania ","https://i.imgur.com/lvA5v7c.png","位於歐洲東部的一個雙首長制議會國家， 多瑙河幾乎佔了南邊與保加利亞之間的國界大半。"];}
else if(number===182){return ["俄羅斯","Russia ","https://i.imgur.com/YbcZ0NU.png","是位於歐亞大陸北部的聯邦共和國，國土橫跨歐亞兩大洲，為世界上土地面積最大的國家。"];}
else if(number===183){return ["盧安達","Rwanda ","https://i.imgur.com/2gvIiUa.png","是位於中非東部的主權國家。"];}
else if(number===184){return ["聖克里斯多福及尼維斯","Saint Kitts & Nevis ","https://i.imgur.com/I0hvv0O.png","是一個由聖克里斯多福島和尼維斯島組成的聯邦制島國，位於中美洲加勒比海地區。"];}
else if(number===185){return ["聖盧西亞","Saint Lucia ","https://i.imgur.com/v3O5lXN.png","是東加勒比海鄰近大西洋的島國。"];}
else if(number===186){return ["聖文森及格瑞那丁","Saint Vincent and the Grenadines ","https://i.imgur.com/pGTcIcu.png","是拉丁美洲的一個國家，位於加勒比海的小安的列斯群島中的向風群島南部。"];}
else if(number===187){return ["薩摩亞","Samoa ","https://i.imgur.com/Znajfo5.png","是一個南太平洋島國，約位於夏威夷與紐西蘭的中間。"];}
else if(number===188){return ["聖馬利諾","San Marino ","https://i.imgur.com/nCkeiIX.png","位於義大利半島的亞平寧山脈東北側，處於被義大利包圍的國中國狀態。"];}
else if(number===189){return ["聖多美和普林西比","Sao Tome & Principe ","https://i.imgur.com/fjYVfNP.png","位於中非西部的幾內亞灣，面積1001平方公里。"];}
else if(number===190){return ["沙烏地阿拉伯","Saudi Arabia ","https://i.imgur.com/BLYAVkB.png","是一個位於西亞阿拉伯半島的阿拉伯人國家。在阿拉伯世界中地理面積第二大的國家。"];}
else if(number===191){return ["蘇格蘭","Scotland","https://i.imgur.com/cjdzijH.png","是大不列顛及北愛爾蘭聯合王國下屬的構成國之一，位於大不列顛島北部。"];}
else if(number===192){return ["塞內加爾","Senegal ","https://i.imgur.com/JQVxPGo.png","西非國家，位於塞內加爾河的南岸，首都達卡。"];}
else if(number===193){return ["塞爾維亞","Serbia ","https://i.imgur.com/MKRZaQ1.png","是一個巴爾幹半島的國家，位於歐洲東南部，巴爾幹半島中部的內陸國。"];}
else if(number===194){return ["塞席爾","Seychelles ","https://i.imgur.com/EoAI2a5.png","是位於南非東部，印度洋中西部一個群島國家。為大英國協成員國。"];}
else if(number===195){return ["獅子山","Sierra Leone ","https://i.imgur.com/YIZvSGi.png","位於西非大西洋岸，首都自由城。"];}
else if(number===196){return ["新加坡","Singapore ","https://i.imgur.com/M3reYm0.png","是東南亞馬來半島南端的一個城市國家，扼守馬六甲海峽最南端出口，是全球最國際化的國家之一。"];}
else if(number===197){return ["斯洛伐克","Slovakia ","https://i.imgur.com/VyfN2Ru.png","是中歐的一個內陸國家，實行議會民主制。"];}
else if(number===198){return ["斯洛維尼亞","Slovenia ","https://i.imgur.com/kn6DCZy.png","是一個位於中歐的，毗鄰阿爾卑斯山的小國。"];}
else if(number===199){return ["所羅門群島","Solomon Islands ","https://i.imgur.com/GV403Hj.png","是南太平洋的一個島國，是大英國協成員之一。"];}
else if(number===200){return ["索馬利亞","Somalia ","https://i.imgur.com/vtlkXNW.png","位於索馬利亞半島上的一個東非國家。"];}
else if(number===201){return ["南蘇丹","South Sudan","https://i.imgur.com/cpHv9Af.png","是非洲東北部一個內陸國家，2011年從蘇丹獨立。"];}
else if(number===202){return ["南非","South Africa ","https://i.imgur.com/c3Hda27.png","是位於非洲南端、南大西洋和南印度洋交會處的共和國。"];}
else if(number===203){return ["西班牙","Spain ","https://i.imgur.com/aUrJIdj.png","是位於歐洲西南部的君主立憲國家，與葡萄牙同處於伊比利半島。"];}
else if(number===204){return ["斯里蘭卡","Sri Lanka ","https://i.imgur.com/HNgQxQZ.png","是一個位於南亞－印度次大陸東南方外海的島國，屬於亞洲。"];}
else if(number===205){return ["蘇丹","Sudan ","https://i.imgur.com/FlEWuW0.png","爲非洲面積第三大國、世界面積第16大國。首都喀土穆。"];}
else if(number===206){return ["蘇利南","Suriname ","https://i.imgur.com/NXmAamb.png","位於南美洲北部，1954年成為荷蘭王國海外自治省，1975年時獨立。"];}
else if(number===207){return ["史瓦帝尼","Swaziland ","https://i.imgur.com/1q7H78V.png","是非洲南部的一個內陸國家，北、西、南三面為南非共和國所包圍。"];}
else if(number===208){return ["瑞典","Sweden ","https://i.imgur.com/Byw3mOM.png","是一個位於斯堪地納維亞半島的北歐國家，首都為斯德哥爾摩。"];}
else if(number===209){return ["瑞士","Switzerland ","https://i.imgur.com/t09x6Ff.png","為聯邦制國家，為紅十字國際委員會的發源地且為許多國際性組織總部所在地，如聯合國日內瓦辦事處。"];}
else if(number===210){return ["敘利亞","Syria ","https://i.imgur.com/0qhrcpf.png","位於西亞，地中海東岸，屬於中東阿拉伯國家。"];}
else if(number===211){return ["台灣","Taiwan ","https://i.imgur.com/AhEFVI4.png","是位於東亞、太平洋西北側，存在主權爭議的共和制國家。"];}
else if(number===212){return ["塔吉克","Tajikistan ","https://i.imgur.com/fDptKdD.png","中亞國家之一，在中亞國家之中國土面積最小。"];}
else if(number===213){return ["坦尚尼亞","Tanzania ","https://i.imgur.com/7IeC0Wl.png","是位於赤道以南的東非國家，首都為杜篤瑪。"];}
else if(number===214){return ["泰國","Thailand ","https://i.imgur.com/QHhVz1F.png","是東南亞的君主立憲制國家，首都及最大城市為曼谷。"];}
else if(number===215){return ["托克勞","Tokelau","https://i.imgur.com/yrCZMCq.png","是位於南太平洋一個紐西蘭屬地，由三個珊瑚島環礁組成。"];}
else if(number===216){return ["多哥","Togo ","https://i.imgur.com/kN7QT8v.png","西非國家之一，首都及最大城市為洛美。"];}
else if(number===217){return ["東加","Tonga ","https://i.imgur.com/HFzoGPf.png","是一個位於太平洋西南部由172個大小不等的島嶼組成島嶼國家。"];}
else if(number===218){return ["千里達及托巴哥","Trinidad & Tobago ","https://i.imgur.com/sRKMXM5.png","位於中美洲加勒比海南部、緊鄰委內瑞拉外海的島國。"];}
else if(number===219){return ["突尼西亞","Tunisia ","https://i.imgur.com/0yc5j9N.png","位於北非、隸屬於馬格里布地區。"];}
else if(number===220){return ["土耳其","Turkey ","https://i.imgur.com/Eul38jG.png","是一個橫跨歐亞兩洲的國家。"];}
else if(number===221){return ["土庫曼","Turkmenistan ","https://i.imgur.com/2zISAQT.png","是一個中亞國家。"];}
else if(number===222){return ["土克斯及開科斯群島","Turks & Caicos Is ","https://i.imgur.com/azVMMOF.png","位於中美洲巴哈馬群島東南的英國屬地，屬西印度群島內盧卡亞群島的一部份。"];}
else if(number===223){return ["圖瓦盧","Tuvalu ","https://i.imgur.com/nz8WlKQ.png","由九個環形珊瑚島群組成的島國，位於南太平洋。"];}
else if(number===224){return ["烏干達","Uganda ","https://i.imgur.com/BwZiYUR.png","位於東非的內陸國家，為伊斯蘭會議組織成員。"];}
else if(number===225){return ["烏克蘭","Ukraine ","https://i.imgur.com/w5Bu6Pm.png","是歐洲面積第二大的國家，僅次於俄羅斯。"];}
else if(number===226){return ["阿拉伯聯合大公國","United Arab Emirates ","https://i.imgur.com/pBn39XQ.png","由阿布達比、夏爾迦、杜拜、阿吉曼、富吉拉、歐姆古溫、哈伊馬角七個酋長國組成的邦聯制君主國。"];}
else if(number===227){return ["英國","United Kingdom ","https://i.imgur.com/kLLVMV9.png","是本土位於西歐並具有海外領地的主權國家。"];}
else if(number===228){return ["美國","United States ","https://i.imgur.com/YOX4cKg.png","是由其下轄50個州、華盛頓哥倫比亞特區、五個自治領土及外島共同組成的聯邦共和國。"];}
else if(number===229){return ["烏拉圭","Uruguay ","https://i.imgur.com/vBelFVU.png","南美洲東南部國家，近180萬居於其首都和最大城市蒙特維多及其都市區。"];}
else if(number===230){return ["烏茲別克","Uzbekistan ","https://i.imgur.com/or8T8Tf.png","，是一個位於中亞的內陸國家，1991年從原蘇聯獨立。是世上兩個雙重內陸國之一。"];}
else if(number===231){return ["萬那杜","Vanuatu ","https://i.imgur.com/15X3O4O.png","是位於太平洋西南部，於1980年獨立建國，由80多個島嶼組成。"];}
else if(number===232){return ["梵蒂岡","Vatican","https://i.imgur.com/X9bLjxH.png","是位於義大利首都羅馬西北角高地的內陸城邦國家，為天主教會最高權力機構聖座的所在地。"];}
else if(number===233){return ["委內瑞拉","Venezuela ","https://i.imgur.com/sG11Obm.png","是一個位於南美洲北部的熱帶國家，為南美洲國家聯盟的成員國。首都為卡拉卡斯。"];}
else if(number===234){return ["越南","Vietnam ","https://i.imgur.com/KG2voQZ.png","是位於東南亞的印度支那半島東端的社會主義國家，實行一黨制。"];}
else if(number===235){return ["瓦利斯和富圖納群島","Wallis and Futuna ","https://i.imgur.com/54dmdzE.png","於斐濟和薩摩亞群島之間，首府馬塔烏圖。"];}
else if(number===236){return ["威爾斯","Wales","https://i.imgur.com/QL0yupN.png","位於大不列顛島西南部，為大不列顛與北愛爾蘭聯合王國構成國之一。"];}
else if(number===237){return ["葉門","Yemen ","https://i.imgur.com/sX4W8cR.png","為西南亞國家，阿拉伯海和紅海邊緣，首都為沙那。"];}
else if(number===238){return ["贊比亞","Zambia ","https://i.imgur.com/6JSpxpg.png","是中非的一個內陸國家。"];}
else if(number===239){return ["津巴布韋","Zimbabwe ","https://i.imgur.com/pnz17K6.png","是位於非洲南部的內陸國家，最大城市和首都為哈拉雷。"];}
else if(number===240){return ["聯合國","UN","https://i.imgur.com/m9mRut5.png","是一個由主權國家組成的政府間國際組織，致力於促進各國在實現持久世界和平方面的合作。"];}
else if(number===241){return ["魁北克","Québec","https://i.imgur.com/Y4T9zBT.png","是加拿大一個高度自治的省份，官方語言為法語，北美的法語人口主要集中在此。"];}
else if(number===242){return ["北賽普勒斯","Kuzey Kıbrıs Türk Cumhuriyeti","https://i.imgur.com/MjKQNNU.png","是一個位於西亞賽普勒斯島北部、地中海東部，屬於未受到國際承認的國家。在國際法上被認為是傀儡國家。 "];}
else if(number===243){return ["聶斯特河沿岸","Transnistria","https://i.imgur.com/IN5IrA0.png","1990年從摩爾多瓦獨立並引發內戰。在摩爾多瓦官方編制的行政區劃中是「具有特殊法律地位的聶斯特河沿岸自治領土單位」。"];}
else if(number===244){return ["阿布哈茲","Kuzey Kıbrıs Türk Cumhuriyeti","https://i.imgur.com/mFBqIiL.png","位於西亞高加索山附近，是一個備受爭議而事實上獨立的政治實體，但只被極少數國家承認。"];}
else if(number===245){return ["北愛爾蘭","NorthernIreland","https://i.imgur.com/0Gk6Yf5.png","是英國的政治實體之一，位於愛爾蘭島東北部。此為過去曾使用的「紅手旗」，目前沒有正式的官方旗幟。"];}
else if(number===246){return ["索馬利蘭","Somaliland","https://i.imgur.com/9qTvbDq.png","位於非洲之角，一個事實上獨立的共和國，曾受英國殖民統治，但未曾獲其他國家和國際組織承認。"];}
else if(number===247){return ["頓內次克人民共和國","Donetsk","https://i.imgur.com/Qb8ozgj.png","由烏克蘭東部與親俄武裝分子在攻佔當地的行政大樓後宣布成立的國家。但沒有得到國際社會普遍承認。"];}
else if(number===248){return ["盧干斯克人民共和國","Lugansk","https://imgur.com/3BAIzqi","是盧干斯克州的親俄武裝分子於2014年4月27日攻占當地安全部門大樓後宣布成立的獨立國家，但沒有得到國際社會普遍承認。"];}
else if(number===249){return ["阿爾札赫","Artsakh","https://i.imgur.com/KOGIYPU.png","是外高加索地區的一個共和國，聯合國和世界上的大部分國家均將其視為亞塞拜然的一部分。"];}
else if(number===250){return ["南奧塞提亞","South Ossetia","https://i.imgur.com/rK4DQHC.png","是位於西亞南高加索的一個未受國際普遍承認國家，首都茲辛瓦利。"];}
else if(number===251){return ["西撒拉威"," Saharaui","https://i.imgur.com/AyuTpcn.png","是一個位於北非西撒拉威地區的阿拉伯國家。聲稱擁有整個西撒拉威地區的主權，但目前只能控制有關領土的20%。"];}
else if(number===252){return ["馬爾他騎士團","Malta","https://i.imgur.com/E05HYj5.png","前身為十字軍東征之後成立之軍事組織，其主權地位受到爭論。現在以宗教慈善醫療組織的形式運作，為全球最小的政治實體。"];}
else if(number===253){return ["美屬維京群島","U.S. Virgin Islands","https://i.imgur.com/ApbzrCG.png","是美國在加勒比海的一個建制非合併屬地群島，在地理方面，屬於維京群島的一部份。"];}
else if(number===254){return ["諾福克島","Norfolk Island","https://i.imgur.com/p3FZUI3.png","是澳洲的一個島嶼，隸屬於新南威爾斯省。"];}
else if(number===255){return ["休達","Ceuta","https://i.imgur.com/Gf9pqV9.png","是西班牙兩個海外自治市之一，位於馬格里布的最北部，直布羅陀海峽附近的地中海沿岸，與摩洛哥接壤。面積約18.5km²。"];}
else if(number===256){return ["梅利利亞","Melilla","https://i.imgur.com/iBEJwhU.png","是西班牙兩個自治市之一，為西班牙位於北非的海外屬地，它位於地中海沿岸和馬格里布的最北部。"];}
else if(number===257){return ["華盛頓哥倫比亞特區","Washington, D.C.","https://i.imgur.com/MOGFPSN.png","是美國的首都，也是世界銀行、國際貨幣基金、美洲國家組織等國際組織總部的所在地，並擁有為數眾的博物館與文化史蹟。"];}

}}