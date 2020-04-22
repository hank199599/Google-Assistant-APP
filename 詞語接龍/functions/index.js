'use strict';

// Import the Dialogflow module from the Actions on Google client library.
const {
  dialogflow,
  Permission,
  Suggestions,
  SimpleResponse,
  Button,
  Image,Carousel,
  BasicCard,
  LinkOutSuggestion,
  BrowseCarousel,BrowseCarouselItem,items,Table
} = require('actions-on-google');

// Import the firebase-functions package for deployment.

//var getJSON = require('get-json')//引用呼叫網路內容之模組
//var parser=require('json-parser');

const functions = require('firebase-functions');
const replaceString = require('replace-string');
const app = dialogflow({debug: true});
var text_library = require('./text_library.json');
var text_start =["臘八","占卜","怎不","等比","背包","敗北","事倍功半","瀑布","諒必","保本","刨冰","半百","女伴","秣馬厲兵","班別","酒吧","假扮","拜把","踱步","寶貝","盟邦","吞併","謙卑","飛奔","恐怖","合抱","涼拌","提拔","貪杯","面板","淡泊","奔波","盜版","附表","糞便","擔保","膜拜","把柄","扁柏","彪炳","刀疤","芒刺在背","蒙胞","百倍","斑剝","嗷嗷待哺","逮捕","編班","痲瘋病","針砭","籬笆","糌粑","那般","獵豹","駕崩","腐敗","凋敝","愚笨","羈絆","托缽","船舶","疊被","本部","封閉","報備","賭博","碉堡","播報","輔弼","可悲","雀斑","棍棒","烘焙","粉筆","褒貶","題跋","相搏","墓碑","綑綁","彌補","復辟","進逼","冰雹","標靶","中飽","劣幣驅逐良幣","利弊","放榜","鋁箔","胳膊","來賓","卑鄙","糕餅","辯駁","隆鼻","調撥","導播","抗暴","目標","瞎編","也罷","矇蔽","襁褓","泛泛之輩","戈壁","幫辦","思辨","穿幫","巨擘","凍斃","緊繃","菲薄","誹謗","躲避","鐘擺","引爆","顛簸","帳簿","北邊","甜八寶","髮辮","詭辯","波霸","甕中捉鱉","丕變","堤壩","雲鬢","枇杷","釘耙","琵琶","害怕","陡坡","雞婆","急迫","體魄","爆破","節拍","並排","盾牌","奉派","捏坏","栽培","索賠","嬪妃","許配","豐沛","感佩","燈泡","鳴炮","旗袍","偷跑","解剖","高不可攀","涅槃","崩盤","審判","期盼","聚寶盆","過磅","依傍","臂膀","肥胖","蓆棚","狹路相逢","吹捧","雷劈","剝皮","能否","雅痞","孤僻","綁票","薄片","詩篇","擺不平","誆騙","效顰","舶來品","續聘","考評","奶瓶","任憑","店鋪","菖蒲","奴僕","儉樸","泵浦","苗圃","歌譜","舅媽","達摩","蓖麻","駙馬","砝碼","謾罵","捉摸","甚麼","消磨","侈糜","楷模","描摹","瓣膜","塗抹","芥末","泯沒","仿冒","綻放","命脈","筆墨","約莫","寂寞","緘默","購買","蕎麥","販賣","豪邁","楊梅","濃眉","靈媒","媲美","胞妹","昏昧","透明","魑魅","諂媚","熊貓","汗毛","繁茂","戴高帽","形貌","共謀","綢繆","藤蔓","撥發","刁蠻","飽滿","瀰漫","怠慢","煩悶","賁門","憤懣","慌忙","鋒芒","鹵莽","締盟","啟蒙","迅猛","舴艋","論孟","託夢","痴迷","猜謎","奢靡","胚芽米","奧祕","祕密","蜂蜜","寧謐","尋覓","幻滅","豆苗","掃描","浩渺","玄妙","孔廟","乖謬","冬眠","纏綿","罷免","黽勉","冠冕","滇緬","避不見面","牧民","米飯","聰敏","憐憫","慕名","鸞鳳和鳴","謀財害命","褓母","伐木","薰沐","瞑目","畜牧","召募","墳墓","簾幕","戀慕","遲暮","肅穆","撻伐","匱乏","竹筏","母法","刑罰","燙髮","是非","嗎啡","紛飛","氮肥","劫匪","煮沸","旅費","曠廢","檣帆","吐蕃","鬧翻","但凡","絮煩","適得其反","遣返","累犯","典範","輩分","繽紛","澱粉","備份","憂憤","亢奮","敵方","磨坊","芬芳","謹防","洞房","察訪","攙扶","誥封","搬風","巔峰","蜜蜂","裂縫","侍奉","薪俸","嘲諷","妹夫","跏趺","肌膚","俯伏","懸浮","桃符","嘆服","寬幅","洪福","束縛","迂腐","闔府","蹲俯","臟腑","叔父","兌付","康復","辜負","馮婦","田賦","羞答答","勾搭","到達","扭打","誇大","了不得","婦德","虐待","歷代","囊袋","借貸","倦怠","佩帶","剃刀","嘮叨","扳倒","澎湖群島","督導","料到","誨盜","霸道","帝都","泰斗","顫抖","豇豆","拚鬥","牡丹","榜單","肝膽","撒旦","黯淡","笨蛋","忌憚","榴彈","的當","褲襠","鋃鐺","阻擋","板蕩","震盪","鎂光燈","次等","冷板凳","蹭蹬","貶低","孩提","淚滴","梆笛","洗滌","匹敵","謎底","府邸","爹地","桿弟","及第","皇帝","嬗遞","蝴蝶","匪諜","鶼鰈","摺疊","鴕鳥","丟不掉","磯釣","都馬調","瘋瘋癲癲","慶典","沸點","飯店","賀電","椅墊","添丁","鉚釘","屋頂","萍蹤不定","校訂","胖嘟嘟","荼毒","僵冷","統獨","褻瀆","朗讀","嫉妒","坡度","粥少僧多","褫奪","懶惰","啦啦隊","肇端","縮短","階段","耆老","壟斷","懵懵懂懂","涵洞","雕梁畫棟","怦然心動","踐踏","蹧蹋","忐忑","瓦特","多胞胎","西北颱","塌臺","吧檯","淘汰","富態","櫻桃","遁逃","乞討","饅頭","剔透","窺探","險灘","訪談","棒壇","慨嘆","灌迷湯","池塘","麥芽糖","廟堂","倜儻","折騰","扶梯","防波堤","例題","胴體","碑帖","津貼","斬釘截鐵","鏈條","窈窕","蹦蹦跳跳","蔽天","丹田","靦腆","諦聽","暫停","娉婷","唐突","宦途","糊塗","構圖","礬土","嘔吐","於菟","襯托","付託","掙脫","滂沱","蹉跎","虺隤","伸腿","蟬蛻","斥退","社團","鯨吞","溝通","苟同","梧桐","乩童","籠統","聽筒","疼痛","剎那","嗩吶","欸乃","俗不可耐","銘感五內","懊惱","愣頭愣腦","哭鬧","役男","罹難","稚嫩","窩囊","逞能","棗泥","麟兒","旖旎","悖逆","耽溺","睥睨","嚅囁","憋尿","犛牛","彆扭","樞紐","暮年","悼念","伴娘","醞釀","毋寧","猙獰","匈奴","惱怒","婀娜","怯懦","席不暇暖","佃農","咕噥","婢女","冶煉","謔而不虐","啪啦","嘩喇喇","段落","辛辣","配樂","否極泰來","蓓蕾","堡壘","涕淚","醣類","抓牢","犬馬之勞","佝僂","閣樓","鄙陋","紕漏","暴露","推波助瀾","蕙蘭","伽藍","瀏覽","橄欖","慵懶","氾濫","糜爛","駭浪","豺狼","琺瑯","檳榔","爽朗","撲朔迷離","藩籬","蒺藜","鵬程萬里","答理","鞭辟入裡","牲禮","迤邐","媚力","薜荔","婷婷玉立","顆粒","牟利","瘌痢","慣例","悚慄","淅瀝","惕勵","砥礪","綺麗","伉儷","伎倆","凜冽","猛烈","天崩地裂","拙劣","涉獵","幕僚","鷦鷯","免不了","詎料","湍流","挽留","贅瘤","毗連","嫁奩","邦聯","扮鬼臉","鍛鍊","曼陀林","睦鄰","麒麟","瀕臨","慳吝","蹂躪","除暴安良","漂亮","沁涼","棟梁","膏粱","估量","寅吃卯糧","斤兩","茯苓","畸零","鶺鴒","丘陵","勒令","嘰哩咕嚕","烤爐","葫蘆","俘虜","鳳毛麟角","翠綠","輯錄","麋鹿","轂轆","攔路","嘍囉","陀螺","犍陀羅","僂儸","瓔珞","峰巒","戡亂","崑崙","謬論","渡輪","尼龍","喉嚨","玲瓏","朦朧","樊籠","襤褸","蓽路藍縷","圯橋進履","旋律","倍率","堪慮","擄掠","痙攣","驪歌","宰割","聊備一格","刪改","梗概","捲鋪蓋","俸給","脣膏","撰稿","訃告","濠溝","鬣狗","架構","若干","桅杆","卸貨","釣竿","椪柑","餅乾","槓桿","竟敢","敏感","慧根","儒艮","搪缸","瀧岡","塑鋼","閉門羹","桔梗","嘀咕","翁姑","肋骨","矽谷","屁股","鑼鼓","桎梏","鞏固","藉故","惠顧","哈密瓜","卜卦","頗為可觀","賦歸","漩渦","揹黑鍋","澤國","巾幗","醜八怪","蘋果","抵不過","陋規","餓鬼","昂貴","櫥櫃","際會","黜官","桂冠","潼關","輸卵管","籍貫","易開罐","廝混","韜光","雇工","緋紅","鞠躬","秉公","黌宮","梭哈","介面卡","茄科","貝殼","迪斯可","望梅止渴","摩崖石刻","鏢客","撬開","慷慨","膾炙人口","紐扣","倭寇","荳蔻","刮目相看","誠懇","啼哭","悽苦","倉庫","遼闊","愉快","俄羅斯方塊","腎虧","慚愧","貸款","籮筐","癲狂","掏空","鈾礦","瞳孔","惶恐","吆喝","媾和","拌合","奈何","汾河","稽核","恫嚇","恭賀","嬰孩","璧還","渤海","汪洋","妨害","漆黑","茼蒿","括號","癖好","咽喉","獼猴","嘶吼","憨厚","瞻前顧後","症候","顢頇","蘊含","酷寒","吶喊","揩汗","驃悍","門外漢","疤痕","憾恨","步行","逾恆","驕橫","嗚呼","恍惚","鄱陽湖","珊瑚","漿糊","足不出戶","跋扈","庇護","孵化","玫瑰花","黛綠年華","擘劃","琴棋書畫","喊話","烽火","傢伙","槁木死灰","抑或","賈禍","虜獲","徘徊","緬懷","皮影戲","駁回","懺悔","詆毀","蘆薈","菽水承歡","般桓","汰換","炳煥","饑荒","徬徨","燉煌","硫黃","炮轟","霓虹","簸箕","錄放影機","囤積","痕跡","雉雞","噬臍莫及","晉級","瞬即","猴急","瘧疾","妒嫉","跼蹐","杯盤狼藉","舟楫","邏輯","荊棘","抨擊","妲己","嫖妓","札記","旺季","緩兵之計","洲際","磺胺劑","荸薺","踵繼","愈加","瑜伽","莊家","龜甲","暑假","棚架","哄抬物價","銲接","癥結","罵街","迫在眉睫","逢年過節","筋疲力竭","皎潔","瞭解","仲介","癬疥","楚河漢界","齋戒","八拜之交","希臘正教","辣椒","舌敝脣焦","咀嚼","跛腳","聒聒叫","錙銖必較","鶻鳩","恆久","啤酒","窠臼","仍舊","歉疚","拯救","膚淺","坊間","篩檢","函件","瞥見","矯健","鈞鑒","弓箭","諷諫","綸巾","迄今","璞玉渾金","喜不自禁","什錦","加把勁","躁進","殆盡","汨羅江","悍將","諾貝爾獎","臭皮匠","霜降","倔強","炸醬","瀝青","蕪菁","鱗莖","途經","處變不驚","瓶頸","拍外景","憧憬","另闢蹊徑","綏靖","窗明几淨","漫無止境","凸透鏡","畢恭畢敬","況且","趑趄","篷車","徙居","柑橘","踰矩","枚舉","婉拒","胼手胝足","炊具","蟠踞","粵劇","言必有據","勛爵","嗅覺","躋身","交白卷","睏倦","郎君","叛軍","黴菌","娶妻","荔枝","尤其","象棋","豎白旗","嶔崎","枸杞","迭起","悶氣","啜泣","擯棄","噴霧器","剴切","剽竊","鵲橋","夢寐以求","乒乓球","鑲嵌","孟母三遷","攢錢","省親","慇懃","鏗鏘","卡賓槍","踉踉蹌蹌","鬩牆","澄清","咨請","毫不留情","誌慶","奏鳴曲","郊區","崎嶇","亦步亦趨","擷取","旨趣","或缺","豁拳","君權","獒犬","襖裙","腕道症候群","黔驢技窮","各奔東西","吮吸","剖析","濂溪","吝惜","筵席","棲息","婆媳","捻熄","盥洗","敝屣","皆大歡喜","朝不保夕","譜系","裙帶關係","奸細","哎呀","褊狹","瞞上欺下","閑暇","辟邪","詼諧","椎心泣血","摹寫","螃蟹","猥褻","鴟鴞","彼長我消","實報實銷","咆哮","眇小","拂曉","維妙維肖","倣效","訕笑","善罷干休","噢咻","摧枯拉朽","鋌而走險","攝護腺","拋物線","莆田縣","昧心","簇新","釜底抽薪","寵信","儐相","丁香","枋寮鄉","禨祥","翱翔","遐想","咯咯作響","脈象","肖像","剋星","葷腥","橢圓形","喚醒","惰性","僥倖","唏噓","些須","鬍鬚","秩序","銓敘","叨叨絮絮","顓頊","犁庭掃穴","敦品勵學","瑞雪","椿萱","斡旋","膺選","梟雄","諮詢","桀驁不馴","庭訊","趨吉避凶","貓熊","樂不可支","殊不知","胭脂","紡織","幣值","鈣質","瀆職","戛然而止","拇指","吏治","包班制","醃製","睿智","獃滯","尉遲","普查","吱吱喳喳","螞蚱","訛詐","叱吒","夭折","迦葉尊者","藷蔗","抉擇","睡不著","奎星高照","朕兆","一把罩","湄州","盪舟","掣肘","宇宙","詛咒","迍邅","愁眉不展","屢敗屢戰","萎靡不振","返璞歸真","指北針","疱疹","宋江陣","篇章","劍拔弩張","蜚短流長","飆漲","廷杖","膨脹","屏障","邪不勝正","御駕親征","鷸蚌相爭","帕金森氏症","准考證","蚌珠","蜘蛛","債臺高築","郡主","烹煮","擋不住","挹注","斟酌","駟馬難追","砌磚","輾轉","廬山","謠傳","瞄準","男扮女裝","理不直氣不壯","莽莽撞撞","冥冥之中","臃腫","鄭重","寡不敵眾","噗哧","咫尺","澠池","矜持","鑰匙","恬不知恥","拊膺切齒","枒杈","貿易順差","茗茶","劈柴","鳩占鵲巢","佳評如潮","拔得頭籌","噤若寒蟬","諫臣","誕辰","牝雞司晨","乏善可陳","賠償","捧場","菩薩心腸","惆悵","暱稱","功敗垂成","茂盛","和盤托出","悔不當初","鏟除","躊躇","踟躕","恰到好處","篣楚","牴觸","齷齪","弦歌不輟","秤錘","哮喘","枯木逢春","鵪鶉","痘瘡","銑床","瓢蟲","殭屍","機不可失","措施","籤詩","磐石","覓食","昔時","樸實","倘使","爵士","閼氏","蔑視","潘安再世","蝶式","舔拭","嘗試","董監事","乃是","仗勢","擇肥而噬","素不相識","渙然冰釋","抹煞","嚼舌","蟒蛇","退避三舍","鍥而不捨","輻射","罪不可赦","褐色","曝晒","舍我其誰","盯梢","叉燒","斗杓","僧多粥少","崗哨","嫻熟","扒手","恪守","匕首","嵩壽","挑肥揀瘦","禽獸","恤衫","蒲扇","鄯善","搢紳","博大精深","炯炯有神","券商","裹傷","笛聲","卯上","犒賞","爬升","痛不欲生","犧牲","悲不自勝","韁繩","帛書","溽暑","袋鼠","公倍數","第八藝術","蚍蜉撼樹","淝水","瞌睡","砒霜","雋爽","某日","猩紅熱","庸人自擾","繚繞","涮羊肉","驀然","荏苒","渲染","媒人","荐任","薏仁","矢口否認","闕如","侏儒","囁嚅","醱酵乳","邁入","玷辱","莫若","羸弱","蒟蒻","葳蕤","雍容","芙蓉","雖敗猶榮","崢嶸","囡仔","頻次","所費不貲","帽子","渣滓","拼音文字","龐雜","譴責","蟊賊","袍澤","盆栽","攆走","間奏","頌讚","骯髒","殯葬","瞵視昂藏","脾臟","餽贈","獄卒","侗族","嚇阻","媽祖","趺坐","末座","咧嘴","判罪","盲從","唸唸有詞","藐不可測","悱惻","騙財","張燈結綵","買菜","拈花惹草","七拼八湊","尸位素餐","璀璨","侷促","顰蹙","忙中有錯","翡翠","彷徨失措","鼎邊銼","憔悴","薈萃","軋頭寸","徇私","螽斯","菟絲","貌似","万俟","潑灑","披薩","茅塞","阮囊羞澀","徑賽","癟三","妻離子散","歐巴桑","貧僧","滴粉搓酥","氯黴素","餐風露宿","罌粟","窸窣","囉唆","枷鎖","硼酸","掐指一算","蓬鬆","嵯峨","姮娥","匾額","怒不可遏","默哀","罣礙","煎熬","倨傲","布偶","惴惴不安","馬鞍","滅門血案","蕞爾","毛衣","憑依","蠻夷","便宜","朵頤","穴診儀","逼不得已","還可以","逶迤","八一三之役","裨益","十八般武藝","求同存異","人本主義","評議","愜意","薑母鴨","佶屈聱牙","堅壁清野","肘腋","扉頁","兢兢業業","虎背熊腰","揶揄","屹立不搖","逍遙","闢謠","敷藥","炫耀","俳優","煤油","遨遊","朋友","威逼利誘","哽咽","妙不可言","鼻竇炎","頁岩","蔓延","蜿蜒","赧顏","柴米油鹽","瞇眼","瀲灩","噪音","呻吟","賣淫","蚯蚓","簞食瓢飲","捺印","羚羊","徜徉","飄揚","豢養","模樣","紮營","泡影","家破人亡","咿唔","南無","晌午","窮兵黷武","狐步舞","棘皮動物","井底之蛙","有把握","排外","氛圍","睽違","崴嵬","薔薇","闌尾","厥功甚偉","讖緯","品味","每位","捍衛","睪丸","傍晚","億萬","駢文","捫心自問","魔王","熙來攘往","盼望","痰盂","賸餘","茱萸","瑾瑜","鰻魚","眉宇","梅雨","片語","民胞物與","培育","沐浴","馥郁","譬喻","痊癒","畛域","沽名釣譽","蓊鬱","丰姿綽約","滿月","攀越","批閱","踴躍","埋怨","美元","斷壁殘垣","狄斯耐樂園","燎原","票源","蠑螈","派員","搓湯圓","偏遠","遂其所願","卷雲","霉運","平庸","驍勇","慢用"];
var Total_Count=0;
var sys_word="";
var input_word="";
var last_word="";
var first_word="";
var number="";
var output_array="";
var menu=false;            //判別是否在歡迎頁面
var end_game=false;        //判別遊戲是否已結束
var question_output=false; //判別是否拿到出題目許可
var answer_input=false;    //判別是否輸入許可的答案
var reported=false;        //判別是否已經說明回報問題機制
var input_list=new Array([]);;
var checker=false;var repeat=false;
var input_init="";var start_game=false;
var error=false;
var sys_suggest="";
var inputarray=["🔄 重新開始","再來一次","再玩一次","再試一次","再來","重新開始","重來","好","OK","可以","再一次","好啊"];
var return_array=["準備接招吧!","小菜一碟 😎","能接的詞顯而易見呢!","這還不簡單?","輕而易舉的問題"];
var wrong_array="";
var jumpcount="";
var subtitle_suggest="";
var wrong_count=0;

function isChn(str){
            var reg=/^[\u4E00-\u9FA5]+$/;
            if(!reg.test(str)){
            return false; //不全是中文
            }
            return true;  //全是中文
            }

app.intent('預設歡迎語句', (conv) => {
	
if(conv.user.verification === 'VERIFIED'){
  if(conv.screen){
	 menu=true;question_output=false;end_game=false;Total_Count=0;input_list=[];start_game=false;
	 input_word=""; last_word=""; first_word="";reported=false; 

	conv.ask(new SimpleResponse({               
		speech: `<speak><p><s>想和我一較高下嗎?</s><s>在遊戲過程中，詞彙不能重複!</s><s>與此同時，你隨時都能退出挑戰結算成績!</s><s>來挑戰看看八!</s></p></speak>`,
		text: '歡迎來挑戰!',}));

	conv.ask(new BasicCard({   
			image: new Image({url:'https://imgur.com/yTy9fks.jpg',alt:'Pictures',}),
			title: '遊戲規則',
			subtitle:'  • 前後詞彙的字尾與字首必須相同\n  • 在遊戲過程中，詞彙不能重複!\n  • 隨時都能跳過詞彙，共有三次機會。\n  • 你隨時都能退出結算成績。',
			text:'Ⓒ 創用CC 台灣3.0版授權',
			buttons: new Button({title:'《教育部重編國語辭典修訂本》',
								 url: 'http://dict.revised.moe.edu.tw/cbdic/',}), 
	}));
   conv.ask(new Suggestions('🎮 開始挑戰','👋 掰掰'));
  }else{

	   menu=false;question_output=true;end_game=false;Total_Count=0;input_list=[];start_game=true;
	   input_word=""; last_word=""; first_word="";
        
		 if (conv.user.last.seen) {
	  	conv.ask(`<speak><p><s>歡迎回來!</s><break time="0.3s"/><s>在你開始接龍前，可以說<break time="0.2s"/>重新開始<break time="0.2s"/>讓我重新想一個詞彙作為開頭。</s><s>當你接不下去時，可以對我說<break time="0.2s"/>跳ㄍㄨㄛˋ<break time="0.2s"/>讓我幫你想一個詞彙</s><break time="0.3s"/><s>準備好了嗎?<break time="1s"/></s></p></speak>`);}
		else{
	  	conv.ask(`<speak><p><s>在開始遊戲前，我需要跟您進行說明。本服務的語音辨識由Google執行。</s><s>碰到同音詞或雜音等問題時，可能會發生辨識錯誤。僅此知會你一聲!</s><break time="0.5s"/><s>此外，在你開始接龍前，你可以說<break time="0.2s"/>重新開始<break time="0.2s"/>讓我重新想一個詞彙作為開頭。</s><s>當你接不下去時，可以對我說<break time="0.2s"/>跳過<break time="0.2s"/>讓我幫你想一個詞彙</s><break time="0.3s"/><s>準備好了嗎?<break time="1s"/></s>`);}

		number=parseInt(Math.random()*1511)
		sys_word=text_start[number];   
        last_word=sys_word.split('');
		last_word=last_word.pop();
		
        input_list.push(sys_word);//將詞彙存入佇列
		
	   	conv.ask(new SimpleResponse({               
			speech: `<speak><p><s>第一個詞彙是<break time="0.2s"/>${sys_word}</s></p></speak>`,
			text: '開始啦🏁\n若輸入重複的詞彙直接結束。',}));
	    conv.noInputs = ["我剛剛說的是"+sys_word+"，請說以"+last_word+"為開頭的詞彙","遊戲已經開始囉，請說以"+last_word+"為開頭的詞彙","抱歉，由於您沒有回應因此遊戲到此結束。下次見。"];	   
	
		}
	}else{
		conv.ask(new SimpleResponse({               
                      speech: "在開始前，您需要啟用Google助理，我才能提供你個人化體驗喔!",
                       text: '請進行相關設定，才能進行遊戲!',}));
	   conv.close(new BasicCard({   
			image: new Image({url:'https://www.gstatic.com/images/branding/product/2x/assistant_48dp.png',alt:'Pictures',}),
			title: '錯誤：您需要進行設定',
			subtitle:'Google 助理需要授權(請點擊畫面右下方的「開始使用」)。\n授權後我才能為你儲存個人對話狀態，\n藉此提升你的使用體驗!\n', 
			display: 'CROPPED',
		}));}
		
 conv.user.storage.menu=menu;
 conv.user.storage.end_game=end_game;
 conv.user.storage.question_output=question_output;
 conv.user.storage.sys_word=sys_word;
 conv.user.storage.last_word=last_word;
 conv.user.storage.input_list=input_list;
 conv.user.storage.Total_Count=Total_Count;
 conv.user.storage.start_game=start_game;
 conv.user.storage.reported=reported;
 conv.user.storage.jumpcount=0;
 conv.user.storage.wrong_count=0;

});

app.intent('問題產生器', (conv,{input}) => {

 menu=conv.user.storage.menu;
 end_game=conv.user.storage.end_game;
 question_output=conv.user.storage.question_output;
 last_word=conv.user.storage.last_word;
 sys_word=conv.user.storage.sys_word;
 input_list=conv.user.storage.input_list;
 Total_Count=conv.user.storage.Total_Count;
 start_game=conv.user.storage.start_game;
 reported=conv.user.storage.reported;
 jumpcount=conv.user.storage.jumpcount;
 wrong_count=conv.user.storage.wrong_count;


 if(input==='開始挑戰'){
 menu=true;question_output=false;end_game=false;Total_Count=0;input_list=[];start_game=false;
 input_word=""; last_word=""; first_word="";reported=false; jumpcount=0;wrong_count=0;
}

//「開始遊戲」啟動詞判斷
  if(menu===true&&end_game===false&&question_output===false&&reported===false){
      if(input!=='開始挑戰'){input='開始挑戰';}
      if(input==='開始挑戰'){ menu=false;question_output=true;end_game=false;}
  }

  //結算畫面防呆判斷
  if(menu===false&&end_game===true&&question_output===false&&reported===false){
     if(inputarray.indexOf(input)!==-1){
	  menu=false;question_output=true;end_game=false;Total_Count=0;input_list=[];start_game=false;reported=false;}
      jumpcount=0;}
	  
if(conv.user.verification === 'VERIFIED'){
  if(menu===false&&end_game===false&&question_output===true&&reported===false){
	  
  if((input==='重新開始'||input==='🔄 重新開始')&&Total_Count===0){input_list=[];start_game=false;reported=false;jumpcount=0;wrong_count=0;}

	if(start_game===false){
		start_game=true;

		//選出最一開始的詞，同時執行驗證看是否能接下去
       //若是不行則重新挑選一個字	   
		number=parseInt(Math.random()*1511)
		sys_word=text_start[number];   
        last_word=sys_word.split('');
		last_word=last_word.pop();
		
        input_list.push(sys_word);//將詞彙存入佇列
		
	   	conv.ask(new SimpleResponse({               
			speech: `<speak><p><s>開始啦!</s><s>第一個詞彙是<break time="0.2s"/>${sys_word}</s></p></speak>`,
			text: '開始啦🏁\n若輸入重複的詞彙直接結束。',}));
			
	 conv.ask(new BasicCard({   
		title: '『'+sys_word+'』',
		subtitle:'請輸入以「'+last_word+'」開頭的詞彙',
		text:'_若開頭詞太難，可以說「重新開始」_  \n或跳過它讓我幫你想一個詞彙，每回合共三次機會',}));
	conv.ask(new Suggestions('🔄 重新開始','跳過這個詞','放棄本回合'));
	
	}else{
		//轉換字串中的異體字
        if(last_word==="溼"){input=replaceString(input, '濕', '溼');}
        else if(last_word==="台"){input=replaceString(input, '臺', '台');}
        else if(last_word==="臺"){input=replaceString(input, '台', '臺');}
        else if(last_word==="暮"){input=replaceString(input, '目', '暮');}
        else if(last_word==="剝"){input=replaceString(input, '剝離', '玻璃');}
        else if(last_word==="刻"){input=replaceString(input, '可', '刻');}
        else if(last_word==="刻"){input=replaceString(input, '科', '刻');}
        else if(last_word==="例"){input=replaceString(input, '栗', '例');}
        else if(last_word==="由"){input=replaceString(input, '魷魚', '由於');}
        else if(last_word==="寢"){input=replaceString(input, '請示', '寢室');}
        else if(last_word==="利"){input=replaceString(input, 'Z1', '利益');}
        else if(last_word==="州"){input=replaceString(input, '周', '州');}
        else if(last_word==="斗"){input=replaceString(input, '鬥', '斗');}
        else if(last_word==="輩"){input=replaceString(input, '備', '輩');}
        else if(last_word==="豔"){input=replaceString(input, '豔', '艷');}
		else if(last_word==="源"){input=replaceString(input, '圓', '源');}
		else if(last_word==="詞"){input=replaceString(input, '慈惠', '詞彙');}
        
		input=replaceString(input, '0', '零');
		input=replaceString(input, '1', '一');
		input=replaceString(input, '2', '二');
		input=replaceString(input, '3', '三');
		input=replaceString(input, '4', '四');
		input=replaceString(input, '5', '五');
		input=replaceString(input, '6', '六');
		input=replaceString(input, '7', '七');
		input=replaceString(input, '8', '八');
		input=replaceString(input, '9', '九');
		
		input=replaceString(input, 'UB', '務必');

		input_init=input.split('');
		first_word=input_init[0];
		
		checker=input_init.length;
	    conv.noInputs = ["我剛剛說的是"+sys_word+"，請說以"+last_word+"為開頭的詞彙","現在的詞彙是"+sys_word+"，請繼續接下去","抱歉，由於您一直沒有回應。因此遊戲到此結束。你在這回合進行"+Total_Count+"次接龍，我們下次見。"];	   

		if(isChn(input)===false){	
		wrong_count++;
		wrong_array=[`<speak><p><s>錯誤!</s><s>不能將中文以外的字符作為輸入!</s></p></speak>`,
			`<speak><p><s>${input}包含非法字元，母湯喔!</s></p></speak>`,
			`<speak><p><s>安ㄋㄟˉ母湯，請換一個詞來試看看</s></p></speak>`,
			`<speak><p><s>${input}裡亂混入怪怪的東西，請換一個!</s></p></speak>`,						
			`<speak><p><s>這個詞彙裡有怪怪的東西，請換一個。</s></p></speak>`,];

		conv.ask(new SimpleResponse({               
				speech:wrong_array[parseInt(Math.random()*4)],
				text: '你的輸入包含中文外的字符',}));		
		if(conv.screen){
		 conv.ask(new BasicCard({   
			title: '『'+sys_word+'』',
			subtitle:'請輸入以「'+last_word+'」開頭的詞彙',
			text:'_[!]非法輸入，不能加入英文等非法符號!_',}));
   	     if(jumpcount<=2){conv.ask(new Suggestions('跳過這個詞'));}
   	     conv.ask(new Suggestions('放棄本回合'));
		}else{
			if(wrong_count<=2){conv.ask(`<speak><p><s>現在接到<break time="0.2s"/>${sys_word}<break time="0.2s"/>請試著繼續接下去</s></p></speak>`);}
			else if(wrong_count<5){conv.ask(`<speak><p><s>現在接到<break time="0.2s"/>${sys_word}<break time="0.2s"/>如果仍想不到可以接甚麼詞彙，可以對我說<break time="0.2s"/>跳過它</s></p></speak>`);}
			else{conv.close(`<speak><p><s>由於我們的對話無法繼續，遊戲先到這裡八<break time="0.2s"/>在這回合中你進行${Total_Count}次接龍，下次見!</s></p></speak>`);}
		}		}
		else{	
		if(checker===1){
		wrong_count++;
		wrong_array=[`<speak><p><s>錯誤!</s><s>不能只輸入一個字!</s></p></speak>`,
			`<speak><p><s>${input}只有一個字，母湯喔!</s></p></speak>`,
			`<speak><p><s>安ㄋㄟˉ母湯，請說至少有兩的字的詞彙</s></p></speak>`,
			`<speak><p><s>${input}只有一個字，這樣是不行的!</s></p></speak>`,						
			`<speak><p><s>這個詞彙只有一個字，我是不會上當的。</s></p></speak>`,];

		conv.ask(new SimpleResponse({               
		speech:wrong_array[parseInt(Math.random()*4)],
			text: '「'+input+'」只有一個字是不行的',}));
		if(conv.screen){
		conv.ask(new BasicCard({   
			title: '『'+sys_word+'』',
			subtitle:'請輸入以「'+last_word+'」開頭的詞彙',
			text:'_[!]你至少要輸入由兩個字構成的詞語。_',}));
   	     if(jumpcount<=2){conv.ask(new Suggestions('跳過這個詞'));}
   	     conv.ask(new Suggestions('放棄本回合'));
		 
		}else{
			if(wrong_count<=2){conv.ask(`<speak><p><s>現在接到<break time="0.2s"/>${sys_word}<break time="0.2s"/>請試著繼續接下去</s></p></speak>`);}
			else if(wrong_count<5){conv.ask(`<speak><p><s>現在接到<break time="0.2s"/>${sys_word}<break time="0.2s"/>如果仍想不到可以接甚麼詞彙，可以對我說<break time="0.2s"/>跳過它</s></p></speak>`);}
			else{conv.close(`<speak><p><s>由於我們的對話無法繼續，遊戲先到這裡八<break time="0.2s"/>在這回合中你進行${Total_Count}次接龍，下次見!</s></p></speak>`);}
			}
		}
		else{		
		if(last_word!==first_word){
		wrong_count++;		
		repeat=false;
		
		wrong_array=[`<speak><p><s>想的好，但是${input}的自首不是${last_word}喔!再想一個八!</s></p></speak>`,
			`<speak><p><s>${input}的字首好像ㄅㄨˊ太對喔，試著換一個八!</s></p></speak>`,
			`<speak><p><s>${input}的字首對ㄅㄨˊ上呢，再想一想後頭可以接什麼詞彙!</s></p></speak>`,
			`<speak><p><s>${input}的字首ㄅㄨˊ太對，換一個試看看!</s></p></speak>`,						
			`<speak><p><s>這個成語的字首不是我要的，請換一個。</s></p></speak>`,];

		conv.ask(new SimpleResponse({               
		speech:wrong_array[parseInt(Math.random()*4)],
		text: '不好意思，請再講一次好嗎？',})); 
		
		if(conv.screen){	 
		if(conv.input.type==="VOICE"){  //如果輸入是語音，則顯示錯誤處理方法
		conv.ask(new BasicCard({
				title: '『'+sys_word+'』',
				subtitle:'請輸入以「'+last_word+'」開頭的詞彙',
				text:'*〈錯誤說明〉*  \n*Google語音辨識可能發生錯誤，你可以嘗試：*  \n• 試著再說一次  \n• 若錯誤源自同音詞辨識，請試著加長詞彙長度  \n• 透過鍵盤輸入欲表達的詞彙  \n• 向Google回報該錯誤改善其辨識能力'})); 
   	     conv.ask(new Suggestions('我要進行回報'));
	    }
	    else{ //輸入方式不是語音則顯示輸入錯誤

        conv.ask(new BasicCard({   
				title: '『'+sys_word+'』',
				subtitle:'請輸入以「'+last_word+'」開頭的詞彙',
				text:'_[!]請輸入正確的開頭詞才能繼續進行喔!_',}));
		  }
   	     if(jumpcount<=2){conv.ask(new Suggestions('跳過這個詞'));}
   	     conv.ask(new Suggestions('放棄本回合'));
		}else{
			if(wrong_count<=2){conv.ask(`<speak><p><s>現在接到<break time="0.2s"/>${sys_word}<break time="0.2s"/>請試著繼續接下去</s></p></speak>`);}
			else if(wrong_count<5){conv.ask(`<speak><p><s>現在接到<break time="0.2s"/>${sys_word}<break time="0.2s"/>如果仍想不到可以接甚麼詞彙，可以對我說<break time="0.2s"/>跳過它</s></p></speak>`);}
			else{conv.close(`<speak><p><s>由於我們的對話無法繼續，遊戲先到這裡八<break time="0.2s"/>在這回合中你進行${Total_Count}次接龍，下次見!</s></p></speak>`);}
		  }	
	  }
		else{
		Total_Count++;
		wrong_count=0;

	   if(input_list.indexOf(input)===-1){   //檢查輸入的詞彙是否已重複
 
        input_list.push(input);//將詞彙存入佇列
		input_word=input_init.pop();
		output_array=text_library[input_word]; //進入詞彙庫取得對應詞彙
		
		if(typeof output_array==="undefined"){
	 	menu=false;question_output=false;end_game=true;reported=false; 
		conv.ask(new SimpleResponse({               
			speech: `<speak><p><s>可<break time="0.2s"/>可<break time="0.2s"/>可惡<break time="0.2s"/></s><s>我竟然找不到可以接下去的詞，你贏我了呢!</s></p></speak>`,
			text: '我輸了 😱',}));
		if(conv.screen){	
		conv.ask(new BasicCard({   
			title: '我不知道『'+input+'』後面該接什麼...',
			subtitle:'本回合已結束',
			text:'共進行'+Total_Count+'次接龍(不計入跳過的詞彙)',}));
		conv.ask(new Suggestions('🔄 重新開始','👋 掰掰'));
        Total_Count=0;input_list=[];start_game=false;}
		else{
		conv.close(`<speak><p><s>在這回合中你進行${Total_Count}次接龍，下次見!</s></p></speak>`);
		conv.user.storage = {}; //離開同時清除暫存資料
		 }	
		}
		else{
		sys_word=output_array[parseInt(Math.random()*(output_array.length-1))];
        last_word=sys_word.split('');
		last_word=last_word.pop();
        
		if(input_list.indexOf(sys_word)!==-1){
	 	menu=false;question_output=false;end_game=true;reported=false; 
		conv.ask(new SimpleResponse({               
			speech: `<speak><p><s>可惡</s><s>我不小心說了曾經說過的詞，你贏我了呢!</s></p></speak>`,
			text: '我輸了 😱',}));
		if(conv.screen){	
		conv.ask(new BasicCard({   
			title: '沒想到『'+sys_word+'』已經說過了',
			subtitle:'本回合已結束',
			text:'共進行'+Total_Count+'次接龍(不計入跳過的詞彙)',}));
		conv.ask(new Suggestions('🔄 重新開始','👋 掰掰'));
		Total_Count=0;input_list=[];start_game=false;
		}else{
		conv.close(`<speak><p><s>在這回合中你進行${Total_Count}次接龍，下次見!</s></p></speak>`);
		conv.user.storage = {}; //離開同時清除暫存資料
	   	 }
		}
		else{
		
		input_list.push(sys_word);//將詞彙存入佇列
        output_array=text_library[last_word]; //進入詞彙庫取得對應詞彙
		 
	 if(typeof output_array==="undefined"){
	 	menu=false;question_output=false;end_game=true;reported=false; 

		conv.ask(new SimpleResponse({               
			speech: `<speak><p><s>糟糕<break time="0.2s"/>我所想的${sys_word}是沒辦法接下去的!回合結束!</s></p></speak>`,
			text: '我所想的詞是接不下去的，\n因此回合結束拉!',}));

		if(conv.screen){	
		conv.ask(new BasicCard({   
            title: '我想的『'+sys_word+'』接不下去拉!',
			subtitle:'本回合已結束',
			text:'你共進行'+Total_Count+'次接龍(不計入跳過的詞彙)',}));
		conv.ask(new Suggestions('🔄 重新開始','👋 掰掰'));
		Total_Count=0;input_list=[];start_game=false;
		}else{
		conv.close(`<speak><p><s>在這回合中你進行${Total_Count}次接龍，下次見!</s></p></speak>`);
		conv.user.storage = {}; //離開同時清除暫存資料
		}	
	   }
		   else{
	     conv.ask(new SimpleResponse({               
						speech: `<speak><p><s>${sys_word}</s></p></speak>`,
						text: return_array[parseInt(Math.random()*4)],}));

		 conv.noInputs = ["我剛剛說的是"+sys_word+"，請說以"+last_word+"為開頭的詞彙","現在的詞彙是"+sys_word+"，請繼續接下去","抱歉，由於您一直沒有回應。因此遊戲到此結束。你在這回合進行"+Total_Count+"次接龍，我們下次見。"];	   

		 conv.ask(new BasicCard({   
			title: '『'+sys_word+'』',
			subtitle:'請輸入以「'+last_word+'」開頭的詞彙',
			text:'_[!]你目前剩下'+(3-jumpcount)+'次跳過機會_',}));
	   
   	     if(jumpcount<=2){conv.ask(new Suggestions('跳過這個詞'));}
   	     conv.ask(new Suggestions('放棄本回合'));
       } 		
      }
	 }
	}else{
	 	menu=false;question_output=false;end_game=true;reported=false; 
        
		last_word=input.split('');
		last_word=last_word[0];
        output_array=text_library[last_word]; //進入詞彙庫取得對應詞彙
		sys_suggest=output_array[parseInt(Math.random()*(output_array.length-1))];

		   if(typeof output_array==="undefined"){subtitle_suggest='我找不到...';}
										    else{subtitle_suggest='有『'+sys_suggest+'』。';}

        conv.ask(new SimpleResponse({               
					speech: `<speak><p><s>居居<break time="0.2s"/>你輸入的${input}重複囉!</s><s>回合結束!</s></p></speak>`,
					text: '你輸入重複的詞，因此回合結束拉!',}));
		if(conv.screen){	
		conv.ask(new BasicCard({   
			title: '『'+input+'』已經輸入過囉!',
			subtitle:'本回合已結束 • 共進行'+Total_Count+'次接龍\n\n✮增強功力：\n以「'+last_word+'」開頭的詞彙'+subtitle_suggest, 
			buttons: new Button({title:'在《萌典》上看「'+last_word+'」的用法',
								 url: 'https://www.moedict.tw/'+last_word,}), 		
			}));
		conv.ask(new Suggestions('🔄 重新開始','👋 掰掰'));
		Total_Count=0;input_list=[];start_game=false;
		}else{
		conv.user.storage = {}; //離開同時清除暫存資料	
		conv.close(`<speak><p><s>在這回合中你進行${Total_Count}次接龍，下次見!</s></p></speak>`);}
       }	
	  } 
	 }
	} 
   }
  }
  else if(menu===false&&end_game===false&&question_output===true&&reported===true){
    reported=false;
        conv.ask(new SimpleResponse({               
			speech: `<speak><p><s>好的!我剛剛說的是<break time="0.2s"/>${sys_word}，繼續接下去八!</s></p></speak>`,
			text: 'OK，我們繼續進行!',}));
			
		 conv.ask(new BasicCard({   
			title: '『'+sys_word+'』',
			subtitle:'請輸入以「'+last_word+'」開頭的詞彙',
			text:'_[!]你目前剩下'+(3-jumpcount)+'次跳過機會_',}));
	   
   	     if(jumpcount<=2){conv.ask(new Suggestions('跳過這個詞'));}
   	     conv.ask(new Suggestions('放棄本回合'));
	  }
  else if(menu===false&&end_game===true&&question_output===true&&reported===true){
	 	menu=false;question_output=false;end_game=true;reported=false; 
     conv.ask(new SimpleResponse({               
			speech: `<speak><p><s>你的回合已經結束了，請問你還要再玩一次嗎?</s></p></speak>`,
			text: '請問你還要再玩一次嗎?',}));
     conv.ask(new Suggestions('🔄 重新開始','👋 掰掰'));
  }
  else if(menu===false&&end_game===true&&question_output===false&&reported===false){
    conv.ask(new SimpleResponse(
	{speech:`<speak><p><s>不好意思，我沒聽清楚。\n</s><s>請試著說<break time="0.2s"/>重新開始<break time="0.2s"/>或<break time="0.2s"/>掰掰<break time="0.2s"/>來確認你的操作。</s></p></speak>`,
	text: '抱歉，我不懂你的意思。\n請點擊建議卡片來確認你的操作。'}));
	conv.ask(new Suggestions('🔄 重新開始','👋 掰掰'));
  }else{ 	 conv.ask(new SimpleResponse({               
                      speech: "本服務需要您進一步進行設定才能繼續進行，請依照下述步驟開啟「網路與應用程式」功能。才能獲得個人化體驗喔!",
                       text: '請進行相關設定，才能進行遊戲!',}));
	   conv.close(new BasicCard({   
			image: new Image({url:'https://i.imgur.com/P5FWCbe.png',alt:'Pictures',}),
			title: '錯誤：您需要進行設定',
			subtitle:'為了給您個人化的遊戲體驗，請進行設定。\n\n1. 點擊下方按鈕前往Google帳戶設定\n2.	開啟「網路和應用程式活動」功能\n3.	開啟「包括 Chrome 瀏覽記錄以及採用 Google 服務的網站、應用程式和裝置中的活動記錄」\n', 
			buttons: new Button({title: 'Google活動控制項',url:"https://myaccount.google.com/activitycontrols?pli=1",}),
			display: 'CROPPED',
		}));
}
	}else{
		conv.ask(new SimpleResponse({               
                      speech: "在開始前，您需要啟用Google助理，我才能提供你個人化體驗喔!",
                       text: '請進行相關設定，才能進行遊戲!',}));
	   conv.close(new BasicCard({   
			image: new Image({url:'https://www.gstatic.com/images/branding/product/2x/assistant_48dp.png',alt:'Pictures',}),
			title: '錯誤：您需要進行設定',
			subtitle:'Google 助理需要授權(請點擊「開始使用」)。\n授權後我才能為你儲存個人對話狀態，\n藉此提升你的使用體驗!\n', 
			display: 'CROPPED',
		}));}

 conv.user.storage.menu=menu;
 conv.user.storage.end_game=end_game;
 conv.user.storage.question_output=question_output;
 conv.user.storage.sys_word=sys_word;
 conv.user.storage.last_word=last_word;
 conv.user.storage.input_list=input_list;
 conv.user.storage.Total_Count=Total_Count;
 conv.user.storage.start_game=start_game;
 conv.user.storage.reported=reported;
 conv.user.storage.jumpcount=jumpcount;
 conv.user.storage.wrong_count=wrong_count;

});

app.intent('回報辨識錯誤', (conv) => {
 menu=conv.user.storage.menu;
 end_game=conv.user.storage.end_game;
 question_output=conv.user.storage.question_output;
 last_word=conv.user.storage.last_word;
 sys_word=conv.user.storage.sys_word;
 input_list=conv.user.storage.input_list;
 Total_Count=conv.user.storage.Total_Count;
 start_game=conv.user.storage.start_game;
 reported=conv.user.storage.reported;
     
     reported=true;
  if(menu===false&&end_game===true&&question_output===false){question_output=true;}

      conv.ask(new SimpleResponse({               
					speech: `<speak><p><s>本服務的語音辨識由Google執行，若發生錯誤請依照下方說明進行反饋!</s></p></speak>`,
					text: '請依照下方說明進行反饋。',}));

      conv.ask(new BasicCard({   
			image: new Image({url:'https://www.gstatic.com/myactivity/udc/vaa-720x300-22c8ffadc520f71278ef6a567753598f.png',alt:'Pictures',}),
			title: '反饋流程說明',
			subtitle:'1. 前往Google帳戶設定(下方按鈕)\n2.	查看輸入紀錄，查找辨識錯誤的項目\n3.選取右方的「更多」圖示 > [詳細資訊] \n4.選取右方的「更多」圖示 > [提供意見] \n5.撰寫您的意見並提交給Google', 
			buttons: new Button({title:'Google 助理活動',
								 url: 'https://myactivity.google.com/item?restrict=assist&hl=zh_TW&utm_source=privacy-advisor-assistant&embedded=1&pli=1',}), 		
            display: 'CROPPED',
			}));
      conv.ask(new Suggestions('繼續進行接龍','放棄本回合'));

 conv.user.storage.menu=menu;
 conv.user.storage.end_game=end_game;
 conv.user.storage.question_output=question_output;
 conv.user.storage.sys_word=sys_word;
 conv.user.storage.last_word=last_word;
 conv.user.storage.input_list=input_list;
 conv.user.storage.Total_Count=Total_Count;
 conv.user.storage.start_game=start_game;
 conv.user.storage.reported=reported;

});

app.intent('繼續進行', (conv) => {
 menu=conv.user.storage.menu;
 end_game=conv.user.storage.end_game;
 question_output=conv.user.storage.question_output;
 last_word=conv.user.storage.last_word;
 sys_word=conv.user.storage.sys_word;
 input_list=conv.user.storage.input_list;
 Total_Count=conv.user.storage.Total_Count;
 start_game=conv.user.storage.start_game;
 reported=conv.user.storage.reported;

  if(menu===false&&end_game===false&&question_output===true&&reported===true){
    reported=false;
	    conv.noInputs = ["我剛剛說的是"+sys_word+"，請說以"+last_word+"為開頭的詞彙","現在的詞彙是"+sys_word+"，請繼續接下去","抱歉，由於您一直沒有回應。因此遊戲到此結束。你在這回合進行"+Total_Count+"次接龍，我們下次見。"];	   

		conv.ask(new SimpleResponse({               
			speech: `<speak><p><s>好的!我剛剛說的是<break time="0.2s"/>${sys_word}，繼續接下去八!</s></p></speak>`,
			text: 'OK，我們繼續進行!',}));
			
		 conv.ask(new BasicCard({   
			title: '『'+sys_word+'』',
			subtitle:'請輸入以「'+last_word+'」開頭的詞彙',
			text:'_[!]你目前剩下'+(3-jumpcount)+'次跳過機會_',}));
	   
   	     if(jumpcount<=2){conv.ask(new Suggestions('跳過這個詞'));}
   	     conv.ask(new Suggestions('放棄本回合'));
  }
 else if(menu===false&&end_game===true&&question_output===true&&reported===true){
	 	menu=false;question_output=false;end_game=true;reported=false; 
     conv.ask(new SimpleResponse({               
			speech: `<speak><p><s>你的回合已經結束了，請問你還要再玩一次嗎?</s></p></speak>`,
			text: '請問你還要再玩一次嗎?',})); 
     conv.ask(new Suggestions('🔄 重新開始','👋 掰掰'));

  }else{ 	 conv.ask(new SimpleResponse({               
                      speech: "本服務需要您進一步進行設定才能繼續進行，請依照下述步驟開啟「網路與應用程式」功能。才能獲得個人化體驗喔!",
                       text: '請進行相關設定，才能進行遊戲!',}));
	   conv.close(new BasicCard({   
			image: new Image({url:'https://i.imgur.com/P5FWCbe.png',alt:'Pictures',}),
			title: '錯誤：您需要進行設定',
			subtitle:'為了給您個人化的遊戲體驗，請進行下述設定：\n\n1. 前往Google帳戶設定\n2.	開啟「網路和應用程式活動」功能\n3.	開啟「包括 Chrome 瀏覽記錄以及採用 Google 服務的網站、應用程式和裝置中的活動記錄」\n', 
			buttons: new Button({title: 'Google活動控制項',url:"https://myaccount.google.com/activitycontrols?pli=1",}),
			display: 'CROPPED',
		}));

}
 conv.user.storage.menu=menu;
 conv.user.storage.end_game=end_game;
 conv.user.storage.question_output=question_output;
 conv.user.storage.sys_word=sys_word;
 conv.user.storage.last_word=last_word;
 conv.user.storage.input_list=input_list;
 conv.user.storage.Total_Count=Total_Count;
 conv.user.storage.start_game=start_game;
 conv.user.storage.reported=reported;

});

app.intent('結束挑戰', (conv,{end_game}) => {

 menu=conv.user.storage.menu;
 end_game=conv.user.storage.end_game;
 question_output=conv.user.storage.question_output;
 last_word=conv.user.storage.last_word;
 sys_word=conv.user.storage.sys_word;
 input_list=conv.user.storage.input_list;
 Total_Count=conv.user.storage.Total_Count;
 start_game=conv.user.storage.start_game;
 reported=conv.user.storage.reported;
 jumpcount=conv.user.storage.jumpcount;

	menu=false;question_output=false;end_game=true;reported=false; 
	
	output_array=text_library[last_word]; //進入詞彙庫取得對應詞彙
 
   if(typeof output_array==="undefined"){subtitle_suggest='我找不到...';}
   else{
	sys_word=output_array[parseInt(Math.random()*(output_array.length-1))];
	subtitle_suggest='有『'+sys_word+'』。';}

  if(typeof Total_Count!=="undefined"){

	if(conv.screen){	
	  conv.ask(new SimpleResponse({speech:`<speak><p><s>你在這回合一共進行${Total_Count}次接龍。</s><s>你要再試一次嗎?</s></p></speak>`,text: '驗收成果'}));
	  
  conv.ask(new BasicCard({   
        image: new Image({url:'https://imgur.com/2oOhmvs.jpg',alt:'Pictures',}),
        title: '本回合共進行'+Total_Count+'次接龍',
		subtitle:'不計入跳過的詞彙',
        text:'✮增強功力：  \n以「'+last_word+'」開頭的詞彙'+subtitle_suggest, 
		buttons: new Button({title:'在《萌典》上看「'+last_word+'」的用法',
								 url: 'https://www.moedict.tw/'+last_word,}), 
        display: 'CROPPED',//更改圖片顯示模式為自動擴展
       })); 
	conv.ask(new Suggestions('🔄 重新開始','👋 掰掰'));
		}else{
		subtitle_suggest=replaceString(subtitle_suggest, '『', '<break time="0.3s"/>『');
		conv.close(new SimpleResponse({speech:`<speak><p><s>以${last_word}開頭的詞彙${subtitle_suggest}</s><s>你在本回合共進行${Total_Count}次接龍。</s><s>下次見!</s></p></speak>`,text: '驗收成果'}));
  }

  }else{ 	 conv.ask(new SimpleResponse({               
                      speech: "本服務需要您進一步進行設定才能繼續進行，請依照下述步驟開啟「網路與應用程式」功能。才能獲得個人化體驗喔!",
                       text: '請進行相關設定，才能進行遊戲!',}));
	   conv.close(new BasicCard({   
        title: '錯誤：您需要進行設定',
        subtitle:'為了給您個人化的遊戲體驗，請進行設定：\n\n1. 前往Google帳戶設定\n2.	開啟「網路和應用程式活動」功能\n3.	開啟「包括 Chrome 瀏覽記錄以及採用 Google 服務的網站、應用程式和裝置中的活動記錄」\n', 
         buttons: new Button({title: 'Google活動控制項',url:"https://myaccount.google.com/activitycontrols?pli=1",}),

		}));

}
 conv.user.storage.menu=menu;
 conv.user.storage.end_game=end_game;
 conv.user.storage.question_output=question_output;
 conv.user.storage.sys_word=sys_word;
 conv.user.storage.last_word=last_word;
 conv.user.storage.input_list=input_list;
 conv.user.storage.Total_Count=Total_Count;
 conv.user.storage.start_game=start_game;
 conv.user.storage.reported=reported;
 conv.user.storage.jumpcount=jumpcount;

});

app.intent('跳過題目', (conv) => {
	
 menu=conv.user.storage.menu;
 end_game=conv.user.storage.end_game;
 question_output=conv.user.storage.question_output;
 last_word=conv.user.storage.last_word;
 sys_word=conv.user.storage.sys_word;
 input_list=conv.user.storage.input_list;
 Total_Count=conv.user.storage.Total_Count;
 start_game=conv.user.storage.start_game;
 reported=conv.user.storage.reported;
 jumpcount=conv.user.storage.jumpcount;
 
 jumpcount++;

 if(jumpcount<=3){

	if((3-jumpcount)!==0){
    conv.ask(new SimpleResponse({
			speech:`<speak><p><s>好的</s><s>你現在剩下${3-jumpcount}次跳ㄍㄨㄛˋ的機會!</s></p></speak>`,
			text: '好的，你還有'+(3-jumpcount)+'次跳過的機會'}));}
	else{
    conv.ask(new SimpleResponse({
			speech:`<speak><p><s>提醒你</s><s>你已經用完所有跳ㄍㄨㄛˋ的機會!</s></p></speak>`,
			text: '你已經用完所有跳過的機會'}));}
 
		output_array=text_library[last_word]; //進入詞彙庫取得對應詞彙
		
		if(typeof output_array==="undefined"){
	 	menu=false;question_output=false;end_game=true;reported=false; 
		conv.ask(new SimpleResponse({               
			speech: `<speak><p><s>看來這個詞彙是接不下去的，回合結束!</s></p></speak>`,
			text: '這個詞是接不下去的，回合結束',}));
		if(conv.screen){	
		conv.ask(new BasicCard({   
			title: '看來『'+sys_think+'』是接不下去的',
			subtitle:'本回合已結束',
			text:'共進行'+Total_Count+'次接龍(不計入跳過的詞彙)',}));
		conv.ask(new Suggestions('🔄 重新開始','👋 掰掰'));
        Total_Count=0;input_list=[];start_game=false;
		}else{
		conv.user.storage = {}; //離開同時清除暫存資料	
		conv.close(`<speak><p><s>在這回合中你進行${Total_Count}次接龍，下次見!</s></p></speak>`);}
			
		}
		else{
		var pre_word=sys_word;
		sys_word=output_array[parseInt(Math.random()*(output_array.length-1))];
        last_word=sys_word.split('');
		last_word=last_word.pop();
        
		if(input_list.indexOf(sys_word)!==-1){
	 	menu=false;question_output=false;end_game=true;reported=false; 
		conv.ask(new SimpleResponse({               
			speech: `<speak><p><s>糟糕</s><s>我不小心選了曾經說過的詞，回合結束!</s></p></speak>`,
			text: '回合已結束',}));
		if(conv.screen){	
		conv.ask(new BasicCard({   
			title: '『'+sys_word+'』是說過的詞',
			subtitle:'本回合已結束',
			text:'共進行'+Total_Count+'次接龍(不計入跳過的詞彙)',}));
		conv.ask(new Suggestions('🔄 重新開始','👋 掰掰'));
        Total_Count=0;input_list=[];start_game=false;
		}else{
		conv.user.storage = {}; //離開同時清除暫存資料	
		conv.close(`<speak><p><s>在這回合中你進行${Total_Count}次接龍，下次見!</s></p></speak>`);}
		}
		else{
		
		input_list.push(sys_word);//將詞彙存入佇列
        output_array=text_library[last_word]; //進入詞彙庫取得對應詞彙
		 
	 if(typeof output_array==="undefined"){
	 	menu=false;question_output=false;end_game=true;reported=false; 

		conv.ask(new SimpleResponse({               
			speech: `<speak><p><s>糟糕<break time="0.2s"/>我所選的${sys_word}是沒辦法接下去的!回合結束!</s></p></speak>`,
			text: '我所想的詞是接不下去的，\n因此回合結束拉!',}));
		if(conv.screen){	
		conv.ask(new BasicCard({   
            title: '我想的『'+sys_word+'』接不下去拉!',
			subtitle:'本回合已結束',
			text:'你共進行'+Total_Count+'次接龍(不計入跳過的詞彙)',}));
		conv.ask(new Suggestions('🔄 重新開始','👋 掰掰'));
        Total_Count=0;input_list=[];start_game=false;
		}else{
		conv.user.storage = {}; //離開同時清除暫存資料	
		conv.close(`<speak><p><s>在這回合中你進行${Total_Count}次接龍，下次見!</s></p></speak>`);}
		   }
		   else{
	     conv.ask(new SimpleResponse({               
						speech: `<speak><p><s>${pre_word}後頭可以接${sys_word}<break time="0.5s"/>接著，請你繼續接下去</s></p></speak>`,
						text: "「"+pre_word+"」可以接「"+sys_word+"」， \n請試著繼續接下去。",}));
	     conv.noInputs = ["我剛剛說的是"+sys_word+"，請說以"+last_word+"為開頭的詞彙","現在的詞彙是"+sys_word+"，請繼續接下去","抱歉，由於您一直沒有回應。因此遊戲到此結束。你在這回合進行"+Total_Count+"次接龍，我們下次見。"];	   
		
		 conv.ask(new BasicCard({   
			title: '『'+sys_word+'』',
			subtitle:'請輸入以「'+last_word+'」開頭的詞彙',
			text:'_[!]你目前剩下'+(3-jumpcount)+'次跳過機會_',}));
	   
   	     if(jumpcount<=2){conv.ask(new Suggestions('跳過這個詞'));}
   	     conv.ask(new Suggestions('放棄本回合'));
       } 
      }
	 }
 }
 else{
	 
	menu=false;question_output=false;end_game=true;reported=false; 
	
	output_array=text_library[last_word]; //進入詞彙庫取得對應詞彙
  
   if(typeof output_array==="undefined"){subtitle_suggest='我找不到...';}
   else{
	sys_word=output_array[parseInt(Math.random()*(output_array.length-1))];
	subtitle_suggest='有『'+sys_word+'』。';}
	 
	if(conv.screen){	
	  conv.ask(new SimpleResponse({speech:`<speak><p><s>你在這回合一共進行${Total_Count}次接龍。</s><s>你要再試一次嗎?</s></p></speak>`,text: '驗收成果'}));
	  
  conv.ask(new BasicCard({   
        image: new Image({url:'https://imgur.com/2oOhmvs.jpg',alt:'Pictures',}),
        title: '本回合共進行'+Total_Count+'次接龍',
		subtitle:'不計入跳過的詞彙',
        text:'✮增強功力：  \n以「'+last_word+'」開頭的詞彙'+subtitle_suggest, 
		buttons: new Button({title:'在《萌典》上看「'+last_word+'」的用法',
								 url: 'https://www.moedict.tw/'+last_word,}), 
        display: 'CROPPED',//更改圖片顯示模式為自動擴展
       })); 
	conv.ask(new Suggestions('🔄 重新開始','👋 掰掰'));
		}else{
		subtitle_suggest=replaceString(subtitle_suggest, '『', '<break time="0.3s"/>『');
		conv.close(new SimpleResponse({speech:`<speak><p><s>以${last_word}開頭的詞彙${subtitle_suggest}</s><s>你在本回合共進行${Total_Count}次接龍。</s><s>下次見!</s></p></speak>`,text: '驗收成果'}));
  }
 }
 
 conv.user.storage.menu=menu;
 conv.user.storage.end_game=end_game;
 conv.user.storage.question_output=question_output;
 conv.user.storage.sys_word=sys_word;
 conv.user.storage.last_word=last_word;
 conv.user.storage.input_list=input_list;
 conv.user.storage.Total_Count=Total_Count;
 conv.user.storage.start_game=start_game;
 conv.user.storage.reported=reported;
 conv.user.storage.jumpcount=jumpcount;

});

app.intent('結束對話', (conv) => {
	
 menu=conv.user.storage.menu;
 end_game=conv.user.storage.end_game;
 question_output=conv.user.storage.question_output;
 last_word=conv.user.storage.last_word;
 sys_word=conv.user.storage.sys_word;
 input_list=conv.user.storage.input_list;
 Total_Count=conv.user.storage.Total_Count;
 start_game=conv.user.storage.start_game;
 reported=conv.user.storage.reported;
 jumpcount=conv.user.storage.jumpcount;

 var input=conv.input.raw;
 conv.noInputs = ["我剛剛說的是"+sys_word+"，請說以"+last_word+"為開頭的詞彙","現在的詞彙是"+sys_word+"，請繼續接下去","抱歉，由於您一直沒有回應。因此遊戲到此結束。你在這回合進行"+Total_Count+"次接龍，我們下次見。"];	   
 
  if(menu===false&&end_game===false&&question_output===true&&reported===false){
	  
  if((input==='重新開始'||input==='🔄 重新開始')&&Total_Count===0){input_list=[];start_game=false;reported=false;jumpcount=0;}

	if(start_game===false){
		start_game=true;jumpcount=0;

		//選出最一開始的詞，同時執行驗證看是否能接下去
       //若是不行則重新挑選一個字	   
		number=parseInt(Math.random()*159)
		sys_word=text_start[number];   
        last_word=sys_word.split('');
		last_word=last_word.pop();
		
        input_list.push(sys_word);//將詞彙存入佇列
		
	   	conv.ask(new SimpleResponse({               
			speech: `<speak><p><s>開始啦!</s><s>第一個詞彙是<break time="0.2s"/>${sys_word}</s></p></speak>`,
			text: '開始啦🏁\n若輸入重複的詞彙直接結束。',}));
			
	 conv.ask(new BasicCard({   
		title: '『'+sys_word+'』',
		subtitle:'請輸入以「'+last_word+'」開頭的詞彙',
		text:'_[!]若開頭詞太難，可以說「重新開始」_',}));
	conv.ask(new Suggestions('🔄 重新開始','放棄本回合'));

	}else{       
		input=replaceString(input, '0', '零');
		input=replaceString(input, '1', '一');
		input=replaceString(input, '2', '二');
		input=replaceString(input, '3', '三');
		input=replaceString(input, '4', '四');
		input=replaceString(input, '5', '五');
		input=replaceString(input, '6', '六');
		input=replaceString(input, '7', '七');
		input=replaceString(input, '8', '八');
		input=replaceString(input, '9', '九');

		input_init=input.split('');
		first_word=input_init[0];
		
		checker=input_init.length;

		if(isChn(input)===false){	

		wrong_array=[`<speak><p><s>錯誤!</s><s>不能將中文以外的字符作為輸入!</s></p></speak>`,
			`<speak><p><s>${input}包含非法字元，母湯喔!</s></p></speak>`,
			`<speak><p><s>安ㄋㄟˉ母湯，請換一個詞來試看看</s></p></speak>`,
			`<speak><p><s>${input}裡亂混入怪怪的東西，請換一個!</s></p></speak>`,						
			`<speak><p><s>這個詞彙裡有怪怪的東西，請換一個。</s></p></speak>`,];

		conv.ask(new SimpleResponse({               
		speech:wrong_array[parseInt(Math.random()*4)],
		text: '你的輸入包含中文外的字符',}));
		if(conv.screen){
		conv.ask(new BasicCard({   
			title: '『'+sys_word+'』',
			subtitle:'請輸入以「'+last_word+'」開頭的詞彙',
			text:'_[!]你目前剩下'+(3-jumpcount)+'次跳過機會_',}));
   
   	     if(jumpcount<=2){conv.ask(new Suggestions('跳過這個詞'));}
   	     conv.ask(new Suggestions('放棄本回合'));
		}else{
			if(wrong_count<=2){conv.ask(`<speak><p><s>現在接到<break time="0.2s"/>${sys_word}<break time="0.2s"/>請試著繼續接下去</s></p></speak>`);}
			else if(wrong_count<5){conv.ask(`<speak><p><s>現在接到<break time="0.2s"/>${sys_word}<break time="0.2s"/>如果仍想不到可以接甚麼詞彙，可以對我說<break time="0.2s"/>跳過它</s></p></speak>`);}
			else{conv.close(`<speak><p><s>由於我們的對話無法繼續，遊戲先到這裡八<break time="0.2s"/>在這回合中你進行${Total_Count}次接龍，下次見!</s></p></speak>`);}
			}	
		 }
		else{			
		if(checker===1){

		wrong_array=[`<speak><p><s>錯誤!</s><s>不能只輸入一個字!</s></p></speak>`,
			`<speak><p><s>${input}只有一個字，母湯喔!</s></p></speak>`,
			`<speak><p><s>安ㄋㄟˉ母湯，請說至少有兩的字的詞彙</s></p></speak>`,
			`<speak><p><s>${input}只有一個字，這樣是不行的!</s></p></speak>`,						
			`<speak><p><s>這個詞彙只有一個字，我是不會上當的。</s></p></speak>`,];

		conv.ask(new SimpleResponse({
				speech:wrong_array[parseInt(Math.random()*4)],
				text: '「'+input+'」只有一個字是不行的',}));
		if(conv.screen){
		 conv.ask(new BasicCard({   
			title: '『'+sys_word+'』',
			subtitle:'請輸入以「'+last_word+'」開頭的詞彙',
			text:'_[!]你目前剩下'+(3-jumpcount)+'次跳過機會_',}));
 
   	     if(jumpcount<=2){conv.ask(new Suggestions('跳過這個詞'));}
   	     conv.ask(new Suggestions('放棄本回合'));
		}else{
			if(wrong_count<=2){conv.ask(`<speak><p><s>現在接到<break time="0.2s"/>${sys_word}<break time="0.2s"/>請試著繼續接下去</s></p></speak>`);}
			else if(wrong_count<5){conv.ask(`<speak><p><s>現在接到<break time="0.2s"/>${sys_word}<break time="0.2s"/>如果仍想不到可以接甚麼詞彙，可以對我說<break time="0.2s"/>跳過它</s></p></speak>`);}
			else{conv.close(`<speak><p><s>由於我們的對話無法繼續，遊戲先到這裡八<break time="0.2s"/>在這回合中你進行${Total_Count}次接龍，下次見!</s></p></speak>`);}
			}				
		}
		else{		
		if(last_word!==first_word){
		
		repeat=false;
		
		wrong_array=[`<speak><p><s>想的好，但是${input}的自首不是${last_word}喔!再想一個八!</s></p></speak>`,
			`<speak><p><s>${input}的字首好像不太對喔，試著換一個八!</s></p></speak>`,
			`<speak><p><s>${input}的字首對ㄅㄨˊ上呢，再想一想後頭可以接什麼詞彙!</s></p></speak>`,
			`<speak><p><s>${input}的字首不太對，換一個試看看!</s></p></speak>`,						
			`<speak><p><s>這個成語的字首不是我要的，請換一個。</s></p></speak>`,];

		conv.ask(new SimpleResponse({               
		speech:wrong_array[parseInt(Math.random()*4)],
		text: '不好意思，請再講一次好嗎？',}));

		if(conv.screen){
		 
		if(conv.input.type==="VOICE"){  //如果輸入是語音，則顯示錯誤處理方法
		conv.ask(new BasicCard({
				title: '『'+sys_word+'』',
				subtitle:'請輸入以「'+last_word+'」開頭的詞彙',
				text:'*〈錯誤說明〉*  \n*Google語音辨識可能發生錯誤，你可以嘗試：*  \n• 試著再說一次  \n• 若錯誤源自同音詞辨識，請試著加長詞彙長度  \n• 透過鍵盤輸入欲表達的詞彙  \n• 向Google回報該錯誤改善其辨識能力'})); 
   	     conv.ask(new Suggestions('我要進行回報'));
		 }
		else{ //輸入方式不是語音則顯示輸入錯誤

        conv.ask(new BasicCard({   
				title: '『'+sys_word+'』',
				subtitle:'請輸入以「'+last_word+'」開頭的詞彙',
				text:'_[!]你目前剩下'+(3-jumpcount)+'次跳過機會_',}));
		  }

   	     if(jumpcount<=2){conv.ask(new Suggestions('跳過這個詞'));}
   	     conv.ask(new Suggestions('放棄本回合'));
		}else{
			if(wrong_count<=2){conv.ask(`<speak><p><s>現在接到<break time="0.2s"/>${sys_word}<break time="0.2s"/>請試著繼續接下去</s></p></speak>`);}
			else if(wrong_count<5){conv.ask(`<speak><p><s>現在接到<break time="0.2s"/>${sys_word}<break time="0.2s"/>如果仍想不到可以接甚麼詞彙，可以對我說<break time="0.2s"/>跳過它</s></p></speak>`);}
			else{conv.close(`<speak><p><s>由於我們的對話無法繼續，遊戲先到這裡八<break time="0.2s"/>在這回合中你進行${Total_Count}次接龍，下次見!</s></p></speak>`);}
		  }		
	  }
		else{
		Total_Count++;

	   if(input_list.indexOf(input)===-1){   //檢查輸入的詞彙是否已重複
 
        input_list.push(input);//將詞彙存入佇列
		input_word=input_init.pop();
		output_array=text_library[input_word]; //進入詞彙庫取得對應詞彙
		
		if(typeof output_array==="undefined"){
	 	menu=false;question_output=false;end_game=true;reported=false; 
		conv.ask(new SimpleResponse({               
			speech: `<speak><p><s>可<break time="0.2s"/>可<break time="0.2s"/>可惡<break time="0.2s"/></s><s>我竟然找不到可以接下去的詞，你贏我了呢!</s></p></speak>`,
			text: '我輸了 😱',}));
		if(conv.screen){	
		conv.ask(new BasicCard({   
			title: '我不知道『'+input+'』後面該接什麼...',
			subtitle:'本回合已結束',
			text:'共進行'+Total_Count+'次接龍(不計入跳過的詞彙)',}));
		conv.ask(new Suggestions('🔄 重新開始','👋 掰掰'));
        Total_Count=0;input_list=[];start_game=false;		
		}else{
		conv.user.storage = {}; //離開同時清除暫存資料			
		conv.close(`<speak><p><s>在這回合中你進行${Total_Count}次接龍，下次見!</s></p></speak>`);}
		}
		else{
		sys_word=output_array[parseInt(Math.random()*(output_array.length-1))];
        last_word=sys_word.split('');
		last_word=last_word.pop();
        
		if(input_list.indexOf(sys_word)!==-1){
	 	menu=false;question_output=false;end_game=true;reported=false; 
		conv.ask(new SimpleResponse({               
			speech: `<speak><p><s>可惡</s><s>我不小心說了曾經說過的詞，你贏我了呢!</s></p></speak>`,
			text: '我輸了 😱',}));
		if(conv.screen){	
		conv.ask(new BasicCard({   
			title: '沒想到『'+sys_word+'』已經說過了',
			subtitle:'本回合已結束',
			text:'共進行'+Total_Count+'次接龍(不計入跳過的詞彙)',}));
		conv.ask(new Suggestions('🔄 重新開始','👋 掰掰'));
        Total_Count=0;input_list=[];start_game=false;		
		}else{
		conv.user.storage = {}; //離開同時清除暫存資料						
		conv.close(`<speak><p><s>在這回合中你進行${Total_Count}次接龍，下次見!</s></p></speak>`);}
		}
		else{
		
		input_list.push(sys_word);//將詞彙存入佇列
        output_array=text_library[last_word]; //進入詞彙庫取得對應詞彙
		 
	 if(typeof output_array==="undefined"){
	 	menu=false;question_output=false;end_game=true;reported=false; 

		conv.ask(new SimpleResponse({               
			speech: `<speak><p><s>糟糕<break time="0.2s"/>我所想的${sys_word}是沒辦法接下去的!回合結束!</s></p></speak>`,
			text: '我所想的詞是接不下去的，\n因此回合結束拉!',}));
		if(conv.screen){	
		conv.ask(new BasicCard({   
            title: '我想的『'+sys_word+'』接不下去拉!',
			subtitle:'本回合已結束',
			text:'你共進行'+Total_Count+'次接龍(不計入跳過的詞彙)',}));
		conv.ask(new Suggestions('🔄 重新開始','👋 掰掰'));
        Total_Count=0;input_list=[];start_game=false;		
		}else{
		conv.user.storage = {}; //離開同時清除暫存資料						
		conv.close(`<speak><p><s>在這回合中你進行${Total_Count}次接龍，下次見!</s></p></speak>`);}
		   }
		   else{
	     conv.ask(new SimpleResponse({               
						speech: `<speak><p><s>${sys_word}</s></p></speak>`,
						text: return_array[parseInt(Math.random()*4)],}));
		conv.noInputs = ["我剛剛說的是"+sys_word+"，請說以"+last_word+"為開頭的詞彙","現在的詞彙是"+sys_word+"，請繼續接下去","抱歉，由於您一直沒有回應。因此遊戲到此結束。你在這回合進行"+Total_Count+"次接龍，我們下次見。"];	   
		
		 conv.ask(new BasicCard({   
			title: '『'+sys_word+'』',
			subtitle:'請輸入以「'+last_word+'」開頭的詞彙',
			text:'_[!]你目前剩下'+(3-jumpcount)+'次跳過機會_',}));
	   
   	     if(jumpcount<=2){conv.ask(new Suggestions('跳過這個詞'));}
   	     conv.ask(new Suggestions('放棄本回合'));
       } 		
      }
	 }
	}else{
	 	menu=false;question_output=false;end_game=true;reported=false; 
        
		last_word=input.split('');
		last_word=last_word[0];
        output_array=text_library[last_word]; //進入詞彙庫取得對應詞彙
		sys_suggest=output_array[parseInt(Math.random()*(output_array.length-1))];

		   if(typeof output_array==="undefined"){subtitle_suggest='我找不到...';}
										    else{subtitle_suggest='有『'+sys_suggest+'』。';}

        conv.ask(new SimpleResponse({               
					speech: `<speak><p><s>居居<break time="0.2s"/>你輸入的${input}重複囉!</s><s>回合結束!</s></p></speak>`,
					text: '你輸入重複的詞，因此回合結束拉!',}));
		if(conv.screen){	
		conv.ask(new BasicCard({   
			title: '『'+input+'』已經輸入過囉!',
			subtitle:'本回合已結束 • 共進行'+Total_Count+'次接龍\n\n✮增強功力：\n以「'+last_word+'」開頭的詞彙'+subtitle_suggest, 
			buttons: new Button({title:'在《萌典》上看「'+last_word+'」的用法',
								 url: 'https://www.moedict.tw/'+last_word,}), 		
			}));
		conv.ask(new Suggestions('🔄 重新開始','👋 掰掰'));
        Total_Count=0;input_list=[];start_game=false;		
		}else{
		conv.user.storage = {}; //離開同時清除暫存資料
		conv.close(`<speak><p><s>在這回合中你進行${Total_Count}次接龍，下次見!</s></p></speak>`);}
       }	
	  } 
	 }
	}
   }
  }
   else if(menu===false&&end_game===false&&question_output===true&&reported===true){
    reported=false;
        conv.ask(new SimpleResponse({               
			speech: `<speak><p><s>好的!我剛剛說的是<break time="0.2s"/>${sys_word}，繼續接下去八!</s></p></speak>`,
			text: 'OK，我們繼續進行!',}));
			
		 conv.ask(new BasicCard({   
			title: '『'+sys_word+'』',
			subtitle:'請輸入以「'+last_word+'」開頭的詞彙',
			text:'_[!]你隨時都能退出遊戲_',}));
	   
	  conv.ask(new Suggestions('放棄本回合'));}
   else if(menu===false&&end_game===true&&question_output===true&&reported===true){
	 	menu=false;question_output=false;end_game=true;reported=false; 
     conv.ask(new SimpleResponse({               
			speech: `<speak><p><s>你的回合已經結束了，請問你還要再玩一次嗎?</s></p></speak>`,
			text: '請問你還要再玩一次嗎?',}));
     conv.ask(new BasicCard({   
        image: new Image({url:'https://imgur.com/2oOhmvs.jpg',alt:'Pictures',}),
        title: '本回合共進行'+Total_Count+'次接龍',
        subtitle:'✮增強功力：\n以「'+last_word+'」開頭的詞彙'+subtitle_suggest, 
		buttons: new Button({title:'在《萌典》上看「'+last_word+'」的用法',
								 url: 'https://www.moedict.tw/'+last_word,}), 
        display: 'CROPPED',//更改圖片顯示模式為自動擴展
       })); 

     conv.ask(new Suggestions('🔄 重新開始','👋 掰掰'));
  }

   else{
    conv.user.storage = {}; //離開同時清除暫存資料
    conv.ask('希望你玩得愉快!');
    conv.ask(new SimpleResponse({speech: '下次見',text: '下次見 👋',}));
    conv.close(new BasicCard({   
        title: '感謝您的使用!', 
        text:'如果有任何需要改進的地方，  \n歡迎到簡介頁面評分或給予反饋，謝謝!', 
        buttons: new Button({title: '開啟本程式的商店頁面',url: 'https://assistant.google.com/services/a/uid/000000ca4e8b5d65',}),
    })); 
  } 
  if(conv.user.storage !== undefined){
  	 conv.user.storage.menu=menu;
	 conv.user.storage.end_game=end_game;
	 conv.user.storage.question_output=question_output;
	 conv.user.storage.sys_word=sys_word;
	 conv.user.storage.last_word=last_word;
	 conv.user.storage.input_list=input_list;
	 conv.user.storage.Total_Count=Total_Count;
	 conv.user.storage.start_game=start_game;
     conv.user.storage.reported=reported;
	 conv.user.storage.jumpcount=jumpcount;
	}
});



exports.text_solitaire = functions.https.onRequest(app); 
