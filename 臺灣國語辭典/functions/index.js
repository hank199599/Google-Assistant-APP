'use strict';
// Import the Dialogflow module from the Actions on Google client library.
const { dialogflow,Suggestions,SimpleResponse, Button,Image, BasicCard, Table} = require('actions-on-google');

var admin = require('firebase-admin');
const {WebhookClient} = require('dialogflow-fulfillment');
const replaceString = require('replace-string');
var getJSON = require('get-json');

const functions = require('firebase-functions');
const app = dialogflow({debug: true});

var bopomofo="";
var bopomofo_array="";
var input_charactor="";
var example_array="";
var definitions="";
var radical="";      //字首
var stroke_count=""; //筆畫數目
var i=0;var j=0;
var synonyms="";
var antonyms="";
var output="";
var num="";
var radical_output="";

var text_array =["臘八","占卜","怎不","等比","背包","敗北","事倍功半","瀑布","諒必","保本","刨冰","半百","女伴","秣馬厲兵","班別","酒吧","假扮","拜把","踱步","寶貝","盟邦","吞併","謙卑","飛奔","恐怖","合抱","涼拌","提拔","貪杯","面板","淡泊","奔波","盜版","附表","糞便","擔保","膜拜","把柄","扁柏","彪炳","刀疤","芒刺在背","蒙胞","百倍","斑剝","嗷嗷待哺","逮捕","編班","痲瘋病","針砭","籬笆","糌粑","那般","獵豹","駕崩","腐敗","凋敝","愚笨","羈絆","托缽","船舶","疊被","本部","封閉","報備","賭博","碉堡","播報","輔弼","可悲","雀斑","棍棒","烘焙","粉筆","褒貶","題跋","相搏","墓碑","綑綁","彌補","復辟","進逼","冰雹","標靶","中飽","劣幣驅逐良幣","利弊","放榜","鋁箔","胳膊","來賓","卑鄙","糕餅","辯駁","隆鼻","調撥","導播","抗暴","目標","瞎編","也罷","矇蔽","襁褓","泛泛之輩","戈壁","幫辦","思辨","穿幫","巨擘","凍斃","緊繃","菲薄","誹謗","躲避","鐘擺","引爆","顛簸","帳簿","北邊","甜八寶","髮辮","詭辯","波霸","甕中捉鱉","丕變","堤壩","雲鬢","枇杷","釘耙","琵琶","害怕","陡坡","雞婆","急迫","體魄","爆破","節拍","並排","盾牌","奉派","捏坏","栽培","索賠","嬪妃","許配","豐沛","感佩","燈泡","鳴炮","旗袍","偷跑","解剖","高不可攀","涅槃","崩盤","審判","期盼","聚寶盆","過磅","依傍","臂膀","肥胖","蓆棚","狹路相逢","吹捧","雷劈","剝皮","能否","雅痞","孤僻","綁票","薄片","詩篇","擺不平","誆騙","效顰","舶來品","續聘","考評","奶瓶","任憑","店鋪","菖蒲","奴僕","儉樸","泵浦","苗圃","歌譜","舅媽","達摩","蓖麻","駙馬","砝碼","謾罵","捉摸","甚麼","消磨","侈糜","楷模","描摹","瓣膜","塗抹","芥末","泯沒","仿冒","綻放","命脈","筆墨","約莫","寂寞","緘默","購買","蕎麥","販賣","豪邁","楊梅","濃眉","靈媒","媲美","胞妹","昏昧","透明","魑魅","諂媚","熊貓","汗毛","繁茂","戴高帽","形貌","共謀","綢繆","藤蔓","撥發","刁蠻","飽滿","瀰漫","怠慢","煩悶","賁門","憤懣","慌忙","鋒芒","鹵莽","締盟","啟蒙","迅猛","舴艋","論孟","託夢","痴迷","猜謎","奢靡","胚芽米","奧祕","祕密","蜂蜜","寧謐","尋覓","幻滅","豆苗","掃描","浩渺","玄妙","孔廟","乖謬","冬眠","纏綿","罷免","黽勉","冠冕","滇緬","避不見面","牧民","米飯","聰敏","憐憫","慕名","鸞鳳和鳴","謀財害命","褓母","伐木","薰沐","瞑目","畜牧","召募","墳墓","簾幕","戀慕","遲暮","肅穆","撻伐","匱乏","竹筏","母法","刑罰","燙髮","是非","嗎啡","紛飛","氮肥","劫匪","煮沸","旅費","曠廢","檣帆","吐蕃","鬧翻","但凡","絮煩","適得其反","遣返","累犯","典範","輩分","繽紛","澱粉","備份","憂憤","亢奮","敵方","磨坊","芬芳","謹防","洞房","察訪","攙扶","誥封","搬風","巔峰","蜜蜂","裂縫","侍奉","薪俸","嘲諷","妹夫","跏趺","肌膚","俯伏","懸浮","桃符","嘆服","寬幅","洪福","束縛","迂腐","闔府","蹲俯","臟腑","叔父","兌付","康復","辜負","馮婦","田賦","羞答答","勾搭","到達","扭打","誇大","了不得","婦德","虐待","歷代","囊袋","借貸","倦怠","佩帶","剃刀","嘮叨","扳倒","澎湖群島","督導","料到","誨盜","霸道","帝都","泰斗","顫抖","豇豆","拚鬥","牡丹","榜單","肝膽","撒旦","黯淡","笨蛋","忌憚","榴彈","的當","褲襠","鋃鐺","阻擋","板蕩","震盪","鎂光燈","次等","冷板凳","蹭蹬","貶低","孩提","淚滴","梆笛","洗滌","匹敵","謎底","府邸","爹地","桿弟","及第","皇帝","嬗遞","蝴蝶","匪諜","鶼鰈","摺疊","鴕鳥","丟不掉","磯釣","都馬調","瘋瘋癲癲","慶典","沸點","飯店","賀電","椅墊","添丁","鉚釘","屋頂","萍蹤不定","校訂","胖嘟嘟","荼毒","僵冷","統獨","褻瀆","朗讀","嫉妒","坡度","粥少僧多","褫奪","懶惰","啦啦隊","肇端","縮短","階段","耆老","壟斷","懵懵懂懂","涵洞","雕梁畫棟","怦然心動","踐踏","蹧蹋","忐忑","瓦特","多胞胎","西北颱","塌臺","吧檯","淘汰","富態","櫻桃","遁逃","乞討","饅頭","剔透","窺探","險灘","訪談","棒壇","慨嘆","灌迷湯","池塘","麥芽糖","廟堂","倜儻","折騰","扶梯","防波堤","例題","胴體","碑帖","津貼","斬釘截鐵","鏈條","窈窕","蹦蹦跳跳","蔽天","丹田","靦腆","諦聽","暫停","娉婷","唐突","宦途","糊塗","構圖","礬土","嘔吐","於菟","襯托","付託","掙脫","滂沱","蹉跎","虺隤","伸腿","蟬蛻","斥退","社團","鯨吞","溝通","苟同","梧桐","乩童","籠統","聽筒","疼痛","剎那","嗩吶","欸乃","俗不可耐","銘感五內","懊惱","愣頭愣腦","哭鬧","役男","罹難","稚嫩","窩囊","逞能","棗泥","麟兒","旖旎","悖逆","耽溺","睥睨","嚅囁","憋尿","犛牛","彆扭","樞紐","暮年","悼念","伴娘","醞釀","毋寧","猙獰","匈奴","惱怒","婀娜","怯懦","席不暇暖","佃農","咕噥","婢女","冶煉","謔而不虐","啪啦","嘩喇喇","段落","辛辣","配樂","否極泰來","蓓蕾","堡壘","涕淚","醣類","抓牢","犬馬之勞","佝僂","閣樓","鄙陋","紕漏","暴露","推波助瀾","蕙蘭","伽藍","瀏覽","橄欖","慵懶","氾濫","糜爛","駭浪","豺狼","琺瑯","檳榔","爽朗","撲朔迷離","藩籬","蒺藜","鵬程萬里","答理","鞭辟入裡","牲禮","迤邐","媚力","薜荔","婷婷玉立","顆粒","牟利","瘌痢","慣例","悚慄","淅瀝","惕勵","砥礪","綺麗","伉儷","伎倆","凜冽","猛烈","天崩地裂","拙劣","涉獵","幕僚","鷦鷯","免不了","詎料","湍流","挽留","贅瘤","毗連","嫁奩","邦聯","扮鬼臉","鍛鍊","曼陀林","睦鄰","麒麟","瀕臨","慳吝","蹂躪","除暴安良","漂亮","沁涼","棟梁","膏粱","估量","寅吃卯糧","斤兩","茯苓","畸零","鶺鴒","丘陵","勒令","嘰哩咕嚕","烤爐","葫蘆","俘虜","鳳毛麟角","翠綠","輯錄","麋鹿","轂轆","攔路","嘍囉","陀螺","犍陀羅","僂儸","瓔珞","峰巒","戡亂","崑崙","謬論","渡輪","尼龍","喉嚨","玲瓏","朦朧","樊籠","襤褸","蓽路藍縷","圯橋進履","旋律","倍率","堪慮","擄掠","痙攣","驪歌","宰割","聊備一格","刪改","梗概","捲鋪蓋","俸給","脣膏","撰稿","訃告","濠溝","鬣狗","架構","若干","桅杆","卸貨","釣竿","椪柑","餅乾","槓桿","竟敢","敏感","慧根","儒艮","搪缸","瀧岡","塑鋼","閉門羹","桔梗","嘀咕","翁姑","肋骨","矽谷","屁股","鑼鼓","桎梏","鞏固","藉故","惠顧","哈密瓜","卜卦","頗為可觀","賦歸","漩渦","揹黑鍋","澤國","巾幗","醜八怪","蘋果","抵不過","陋規","餓鬼","昂貴","櫥櫃","際會","黜官","桂冠","潼關","輸卵管","籍貫","易開罐","廝混","韜光","雇工","緋紅","鞠躬","秉公","黌宮","梭哈","介面卡","茄科","貝殼","迪斯可","望梅止渴","摩崖石刻","鏢客","撬開","慷慨","膾炙人口","紐扣","倭寇","荳蔻","刮目相看","誠懇","啼哭","悽苦","倉庫","遼闊","愉快","俄羅斯方塊","腎虧","慚愧","貸款","籮筐","癲狂","掏空","鈾礦","瞳孔","惶恐","吆喝","媾和","拌合","奈何","汾河","稽核","恫嚇","恭賀","嬰孩","璧還","渤海","汪洋","妨害","漆黑","茼蒿","括號","癖好","咽喉","獼猴","嘶吼","憨厚","瞻前顧後","症候","顢頇","蘊含","酷寒","吶喊","揩汗","驃悍","門外漢","疤痕","憾恨","步行","逾恆","驕橫","嗚呼","恍惚","鄱陽湖","珊瑚","漿糊","足不出戶","跋扈","庇護","孵化","玫瑰花","黛綠年華","擘劃","琴棋書畫","喊話","烽火","傢伙","槁木死灰","抑或","賈禍","虜獲","徘徊","緬懷","皮影戲","駁回","懺悔","詆毀","蘆薈","菽水承歡","般桓","汰換","炳煥","饑荒","徬徨","燉煌","硫黃","炮轟","霓虹","簸箕","錄放影機","囤積","痕跡","雉雞","噬臍莫及","晉級","瞬即","猴急","瘧疾","妒嫉","跼蹐","杯盤狼藉","舟楫","邏輯","荊棘","抨擊","妲己","嫖妓","札記","旺季","緩兵之計","洲際","磺胺劑","荸薺","踵繼","愈加","瑜伽","莊家","龜甲","暑假","棚架","哄抬物價","銲接","癥結","罵街","迫在眉睫","逢年過節","筋疲力竭","皎潔","瞭解","仲介","癬疥","楚河漢界","齋戒","八拜之交","希臘正教","辣椒","舌敝脣焦","咀嚼","跛腳","聒聒叫","錙銖必較","鶻鳩","恆久","啤酒","窠臼","仍舊","歉疚","拯救","膚淺","坊間","篩檢","函件","瞥見","矯健","鈞鑒","弓箭","諷諫","綸巾","迄今","璞玉渾金","喜不自禁","什錦","加把勁","躁進","殆盡","汨羅江","悍將","諾貝爾獎","臭皮匠","霜降","倔強","炸醬","瀝青","蕪菁","鱗莖","途經","處變不驚","瓶頸","拍外景","憧憬","另闢蹊徑","綏靖","窗明几淨","漫無止境","凸透鏡","畢恭畢敬","況且","趑趄","篷車","徙居","柑橘","踰矩","枚舉","婉拒","胼手胝足","炊具","蟠踞","粵劇","言必有據","勛爵","嗅覺","躋身","交白卷","睏倦","郎君","叛軍","黴菌","娶妻","荔枝","尤其","象棋","豎白旗","嶔崎","枸杞","迭起","悶氣","啜泣","擯棄","噴霧器","剴切","剽竊","鵲橋","夢寐以求","乒乓球","鑲嵌","孟母三遷","攢錢","省親","慇懃","鏗鏘","卡賓槍","踉踉蹌蹌","鬩牆","澄清","咨請","毫不留情","誌慶","奏鳴曲","郊區","崎嶇","亦步亦趨","擷取","旨趣","或缺","豁拳","君權","獒犬","襖裙","腕道症候群","黔驢技窮","各奔東西","吮吸","剖析","濂溪","吝惜","筵席","棲息","婆媳","捻熄","盥洗","敝屣","皆大歡喜","朝不保夕","譜系","裙帶關係","奸細","哎呀","褊狹","瞞上欺下","閑暇","辟邪","詼諧","椎心泣血","摹寫","螃蟹","猥褻","鴟鴞","彼長我消","實報實銷","咆哮","眇小","拂曉","維妙維肖","倣效","訕笑","善罷干休","噢咻","摧枯拉朽","鋌而走險","攝護腺","拋物線","莆田縣","昧心","簇新","釜底抽薪","寵信","儐相","丁香","枋寮鄉","禨祥","翱翔","遐想","咯咯作響","脈象","肖像","剋星","葷腥","橢圓形","喚醒","惰性","僥倖","唏噓","些須","鬍鬚","秩序","銓敘","叨叨絮絮","顓頊","犁庭掃穴","敦品勵學","瑞雪","椿萱","斡旋","膺選","梟雄","諮詢","桀驁不馴","庭訊","趨吉避凶","貓熊","樂不可支","殊不知","胭脂","紡織","幣值","鈣質","瀆職","戛然而止","拇指","吏治","包班制","醃製","睿智","獃滯","尉遲","普查","吱吱喳喳","螞蚱","訛詐","叱吒","夭折","迦葉尊者","藷蔗","抉擇","睡不著","奎星高照","朕兆","一把罩","湄州","盪舟","掣肘","宇宙","詛咒","迍邅","愁眉不展","屢敗屢戰","萎靡不振","返璞歸真","指北針","疱疹","宋江陣","篇章","劍拔弩張","蜚短流長","飆漲","廷杖","膨脹","屏障","邪不勝正","御駕親征","鷸蚌相爭","帕金森氏症","准考證","蚌珠","蜘蛛","債臺高築","郡主","烹煮","擋不住","挹注","斟酌","駟馬難追","砌磚","輾轉","廬山","謠傳","瞄準","男扮女裝","理不直氣不壯","莽莽撞撞","冥冥之中","臃腫","鄭重","寡不敵眾","噗哧","咫尺","澠池","矜持","鑰匙","恬不知恥","拊膺切齒","枒杈","貿易順差","茗茶","劈柴","鳩占鵲巢","佳評如潮","拔得頭籌","噤若寒蟬","諫臣","誕辰","牝雞司晨","乏善可陳","賠償","捧場","菩薩心腸","惆悵","暱稱","功敗垂成","茂盛","和盤托出","悔不當初","鏟除","躊躇","踟躕","恰到好處","篣楚","牴觸","齷齪","弦歌不輟","秤錘","哮喘","枯木逢春","鵪鶉","痘瘡","銑床","瓢蟲","殭屍","機不可失","措施","籤詩","磐石","覓食","昔時","樸實","倘使","爵士","閼氏","蔑視","潘安再世","蝶式","舔拭","嘗試","董監事","乃是","仗勢","擇肥而噬","素不相識","渙然冰釋","抹煞","嚼舌","蟒蛇","退避三舍","鍥而不捨","輻射","罪不可赦","褐色","曝晒","舍我其誰","盯梢","叉燒","斗杓","僧多粥少","崗哨","嫻熟","扒手","恪守","匕首","嵩壽","挑肥揀瘦","禽獸","恤衫","蒲扇","鄯善","搢紳","博大精深","炯炯有神","券商","裹傷","笛聲","卯上","犒賞","爬升","痛不欲生","犧牲","悲不自勝","韁繩","帛書","溽暑","袋鼠","公倍數","第八藝術","蚍蜉撼樹","淝水","瞌睡","砒霜","雋爽","某日","猩紅熱","庸人自擾","繚繞","涮羊肉","驀然","荏苒","渲染","媒人","荐任","薏仁","矢口否認","闕如","侏儒","囁嚅","醱酵乳","邁入","玷辱","莫若","羸弱","蒟蒻","葳蕤","雍容","芙蓉","雖敗猶榮","崢嶸","囡仔","頻次","所費不貲","帽子","渣滓","拼音文字","龐雜","譴責","蟊賊","袍澤","盆栽","攆走","間奏","頌讚","骯髒","殯葬","瞵視昂藏","脾臟","餽贈","獄卒","侗族","嚇阻","媽祖","趺坐","末座","咧嘴","判罪","盲從","唸唸有詞","藐不可測","悱惻","騙財","張燈結綵","買菜","拈花惹草","七拼八湊","尸位素餐","璀璨","侷促","顰蹙","忙中有錯","翡翠","彷徨失措","鼎邊銼","憔悴","薈萃","軋頭寸","徇私","螽斯","菟絲","貌似","万俟","潑灑","披薩","茅塞","阮囊羞澀","徑賽","癟三","妻離子散","歐巴桑","貧僧","滴粉搓酥","氯黴素","餐風露宿","罌粟","窸窣","囉唆","枷鎖","硼酸","掐指一算","蓬鬆","嵯峨","姮娥","匾額","怒不可遏","默哀","罣礙","煎熬","倨傲","布偶","惴惴不安","馬鞍","滅門血案","蕞爾","毛衣","憑依","蠻夷","便宜","朵頤","穴診儀","逼不得已","還可以","逶迤","八一三之役","裨益","十八般武藝","求同存異","人本主義","評議","愜意","薑母鴨","佶屈聱牙","堅壁清野","肘腋","扉頁","兢兢業業","虎背熊腰","揶揄","屹立不搖","逍遙","闢謠","敷藥","炫耀","俳優","煤油","遨遊","朋友","威逼利誘","哽咽","妙不可言","鼻竇炎","頁岩","蔓延","蜿蜒","赧顏","柴米油鹽","瞇眼","瀲灩","噪音","呻吟","賣淫","蚯蚓","簞食瓢飲","捺印","羚羊","徜徉","飄揚","豢養","模樣","紮營","泡影","家破人亡","咿唔","南無","晌午","窮兵黷武","狐步舞","棘皮動物","井底之蛙","有把握","排外","氛圍","睽違","崴嵬","薔薇","闌尾","厥功甚偉","讖緯","品味","每位","捍衛","睪丸","傍晚","億萬","駢文","捫心自問","魔王","熙來攘往","盼望","痰盂","賸餘","茱萸","瑾瑜","鰻魚","眉宇","梅雨","片語","民胞物與","培育","沐浴","馥郁","譬喻","痊癒","畛域","沽名釣譽","蓊鬱","丰姿綽約","滿月","攀越","批閱","踴躍","埋怨","美元","斷壁殘垣","狄斯耐樂園","燎原","票源","蠑螈","派員","搓湯圓","偏遠","遂其所願","卷雲","霉運","平庸","驍勇","慢用"];
var idiom_array=["藕斷絲連","萍水相逢","堅壁清野","緣木求魚","快刀斬亂麻","昭然若揭","汗牛充棟","略識之無","鶉衣百結","茅塞頓開","信口雌黃","頓開茅塞","差強人意","北轅適楚","旗鼓相當","忘恩負義","鶴立雞群","露出馬腳","推心置腹","孫山名落","斗量車載","飾非文過","片言九鼎","針鋒相對","司空見慣","腸肥腦滿","幸災樂禍","精益求精","含沙射影","歌功頌德","處心積慮","高枕無憂","濫竽充數","海市蜃樓","尊俎折衝","游刃有餘","切磋琢磨","合浦珠還","優柔寡斷","羽毛未豐","撲朔迷離","呆若木雞","駿馬加鞭","帷幄運籌","松枯石爛","慷慨解囊","石破天驚","按圖索驥","袖手旁觀","秦鏡高懸","脣亡齒寒","水落石出","燃眉之急","甘拜下風","居安思危","杞人憂天","滔滔不絕","偃旗息鼓","裹足不前","土崩瓦解","影不離形","苟且偷安","待價而沽","揭竿而起","欺世盜名","貽笑大方","舉一反三","騎虎難下","牢補羊亡","夜郎自大","秀外慧中","博古通今","入木三分","力不從心","得心應手","蜀犬吠日","行將就木","九牛一毛","拖泥帶水","抱薪救火","喘月吳牛","流芳百世","疑信參半","朝三暮四","浪靜風平","矯枉過正","民不聊生","羊質虎皮","歷歷在目","亭亭玉立","莫逆之交","喋喋不休","恐後爭先","掠影浮光","委曲求全","志同道合","迥然不同","陳陳相因","阿其所好","絕無僅有","醉生夢死","予取予求","槁木死灰","歧路亡羊","嘔心瀝血","飽食豐衣","草木皆兵","趁火打劫","活剝生吞","小巫見大巫","坦腹東床","親痛仇快","大器晚成","依然故我","猶豫不決","全軍覆沒","亡羊補牢","瀝膽披肝","圖窮匕見","啞口無言","臉紅耳赤","畫蛇添足","孑然一身","少不更事","守株待兔","逆來順受","越俎代庖","攸向靡披","一毛不拔","柳暗花明","窮兵黷武","鷸蚌相爭","探囊取物","退避三舍","揠苗助長","爐火純青","妙手回春","從善如流","慣作非為","吉人天相","戶限為穿","輪奐之美","芒刺在背","千方百計","獨當一面","因噎廢食","武偃文修","匪懈夙宵","碧玉小家","無地自容","踣不復振","罄竹難書","沆瀣一氣","聚精會神","言不由衷","指鹿為馬","有備無患","短兵相接","履薄臨深","傷天害理","皓齒明眸","烏合之眾","默化潛移","零丁孤苦","眈眈虎視","驚弓之鳥","鑿空指鹿","多多益善","沾沾自喜","趾高氣揚","望梅止渴","玉石俱焚","標新立異","東窗事發","銜環結草","支吾其詞","撞騙招搖","席不暇暖","負荊請罪","本末倒置","樂不思蜀","簞食瓢飲","欲蓋彌彰","吶喊搖旗","竭澤而漁","江郎才盡","慘不忍睹","置若罔聞","聞雞起舞","花言巧語","岸然道貌","避重就輕","瓦釜雷鳴","良莠不齊","舞文弄墨","炙手可熱","嬌生慣養","遠慮深謀","摩頂放踵","鑄成大錯","蕭規曹隨","頑石點頭","車水馬龍","同舟共濟","張冠李戴","請君入甕","義不容辭","鳥盡弓藏","洗耳恭聽","談虎色變","冥頑不靈","成竹在胸","躁動輕舉","膾炙人口","隋珠暗投","虛張聲勢","倚老賣老","瞻前顧後","格格不入","怪事咄咄","正襟危坐","法無二門","螳臂當車","知難而退","內荏外剛","忠言逆耳","死灰復燃","馮河暴虎","奇貨可居","相敬如賓","口若懸河","揮金如土","清風兩袖","帶水拖泥","杳如黃鶴","忍辱負重","名落孫山","群策群力","文過飾非","棟充牛汗","惱羞成怒","恣心所欲","攢花簇錦","虎頭蛇尾","駕輕就熟","泥牛入海","喜出望外","鴉雀無聲","臨渴掘井","澄源正本","任勞任怨","問道於盲","熟能生巧","悄不聞鴉","神魂顛倒","侃侃而談","繁文縟節","餘音繞梁","劍拔弩張","捷足先登","落井下石","雲翻雨覆","邯鄲學步","咄咄逼人","患得患失","後來居上","即景生情","胡思亂想","攀龍附鳳","粗枝大葉","迫不及待","痛心疾首","拋磚引玉","惜墨如金","盡忠報國","怨聲載道","勞燕分飛","爆燥如雷","黔驢技窮","物以類聚","唱高和寡","魂不附體","雷厲風行","否極泰來","刻舟求劍","疾言厲色","好逸惡勞","易如反掌","走馬看花","吳牛喘月","豢虎貽殃","馬首是瞻","蚍蜉撼樹","囊空如洗","所向披靡","殺身成仁","既往不咎","路不拾遺","理直氣壯","戰戰兢兢","觸類旁通","尋花問柳","眼高手低","防微杜漸","似漆如膠","案舉齊眉","仰人鼻息","積重難返","愛屋及烏","四面楚歌","論定棺蓋","敷衍塞責","恰中下懷","食古不化","遺臭萬年","玩物喪志","買櫝還珠","養精蓄銳","蠢蠢欲動","怒髮衝冠","亦步亦趨","磨杵成針","右盼左顧","香憐玉惜","殘息奄奄","華而不實","桂薪珠米","眾志成城","奪胎換骨","斬草除根","寥若晨星","懷才不遇","溫故知新","搖尾乞憐","焦頭爛額","曇花一現","暮鼓晨鐘","初出茅廬","呼風喚雨","拉朽摧枯","狐假虎威","梁上君子","體貼入微","排難解紛","挈領提綱","燕雀處堂","再接再厲","腹背受敵","奈如之何","孺子可教","臥薪嘗膽","青出於藍","傍人門戶","擲鼠忌器","襟捉肘露","疊床架屋","垂涎三尺","觀止之嘆","蠡測管窺","五體投地","感激涕零","破鏡重圓","巧取豪奪","強弩之末","古道熱腸","雞鳴狗盜","打草驚蛇","衣錦還鄉","平步青雲","回頭是岸","城下之盟","聲東擊西","兵不血刃","刮目相看","向壁虛造","僵李代桃","漸入佳境","旦旦信誓","孤注一擲","手舞足蹈","曲突徙薪","削足適履","涓滴歸公","蛇影杯弓","據經引傳","倒行逆施","首鼠兩端","唾面自乾","背道而馳","匹夫之勇","國色天香","適可而止","李代桃僵","箕裘之紹","威風凜凜","升堂入室","齊眉舉案","殷鑒不遠","兢兢業業","乘風破浪","以訛傳訛","豁然開朗","錙銖必較","米珠薪桂","運籌帷幄","登峰造極","洛陽紙貴","罔知所措","拾人牙慧","波平風靜","棋布星羅","根深蒂固","肝膽相照","捉襟見肘","驢心狗肺","愁眉不展","腰纏萬貫","白駒過隙","剛愎自用","聽天由命","計較錙銖","提綱挈領","發人深省","陸離光怪","才高八斗","枕戈待旦","筆誅口伐","惡貫滿盈","集思廣益","暫勞永逸","沫相濡","止渴望梅","鵬程萬里","軒然大波","現身說法","丹心耿耿","形單影隻","困獸猶鬥","恨相知晚","笑裡藏刀","逐臭之夫","覆水難收","借花獻佛","狽因狼突","尾大不掉","門可羅雀","銖銖較量","肅然起敬","鞭長莫及","模稜兩可","咎由自取","靡靡之音","井井有條","如火如荼","返老還童","伯仲之間","賓至如歸","投筆從戎","胸有成竹","順水推舟","移風易俗","管中窺豹","輾轉反側","鋌而走險","步步為營","結草銜環","姑妄言之","星羅棋布","永垂不朽","喪心病狂","假公濟私","徒有其表","故步自封","各自為政","前倨後恭","盲人摸象","彬彬文質","尸位素餐","南轅北轍","街談巷議","逃之夭夭","招搖過市","咬文嚼字","魯魚亥豕","津津有味","利令智昏","血流漂杵","闇度陳倉","骨瘦如柴","肉袒負荊","加體黃袍","出奇制勝","對牛彈琴","決一雌雄","世外桃源","罪不容誅","欣欣向榮","半途而廢","素餐尸位","揚湯止沸","野心勃勃","畢精竭思","比比皆是","孜孜不倦","墨守成規","求全責備","沈魚落雁","穿鑿附會","僕僕風塵","壽終正寢","玄機妙算","家喻戶曉","西山日薄","休戚相關","目不識丁","秋毫無犯","楊花水性","折衝尊俎","俱傷兩敗","陽奉陰違","寶花亂墜","毛遂自薦","引經據典","腦滿腸肥","圓鑿方枘","冠冕堂皇","生吞活剝","來龍去脈","克紹箕裘","普天同慶","肌無完膚","覺我形穢","敵愾同仇","滄海桑田","施教因材","顧此失彼","器宇軒昂","造極登峰","興高采烈","明察秋毫","智昏菽麥","窺豹一斑","嗤之以鼻","見異思遷","何足掛齒","枉費心機","新陳代謝","噤若寒蟬","六神無主","三令五申","鳳毛麟角","蓋棺論定","節外生枝","耳濡目染","換骨奪胎","萬籟俱寂","勒馬懸崖","緘口如瓶","坎井之蛙","狗尾續貂","髮引千鈞","吐絲自縛","姍姍來遲","截趾適屨","放蕩不羈","危如累卵","史無前例","弄巧成拙","敝帚自珍","上行下效","迷離撲朔","數典忘祖","反覆無常","遇人不淑","攧撲不碎","逢場作戲","沽名釣譽","化險為夷","難兄難弟","雕蟲小技","進退維谷","始作俑者","淋漓盡致","事半功倍","羅雀門庭","終南捷徑","寡廉鮮恥","兔死狗烹","吹毛求疵","不學無術","十惡不赦","當頭棒喝","樹倒猢猻散","身敗名裂","要言不煩","撼樹蚍蜉","滿腹經綸","循循善誘","兄弟鬩牆","寅吃卯糧"];
var compare_array=require('./compare_list.json');

function isChn(str){
            var reg=/^[\u4E00-\u9FFF]/;
            if(!reg.test(str)){
            return false; //不全是中文
            }
            return true;  //全是中文
            }

function isBrackets(str){
            var reg=/[\（|][0-9]*[\）|]/g ;
            if(!reg.test(str)){
            return false; //不全是中文
            }
            return true;  //全是中文
            }

var countdown=0; 
var take_out=0;
var temp=[];
var suggestion_chip="";
var return_array=[];
var link_array=[];
var input_array=[];
var k=0;
var m=0;
var response_array=["以下是詳細資訊","下面是我找到的對應條目","對應的條目如下","以下是您查閱的資訊","我找到的對應條目如下","對應條目如下顯示"];

	const MultiContexts = {
	  parameter: 'multi',
	}	
	const ResesctContexts = {
	  parameter: 'select',
	}	

app.intent('預設歡迎語句', (conv) => {

	conv.ask(new SimpleResponse({ 
					speech: `<speak><p><s>歡迎，請試著輸入要查詢的詞彙或點擊建議卡片。我會為你提供來自教育部《蟲編國語辭典修訂本》的對應說明內容!</s></p></speak>`,
					text: '歡迎使用!\n查詢服務由《萌典》提供  \n文本內容來自《重編國語辭典修訂本》'}));
	conv.ask(new BasicCard({
			title:'您可以開始進行查詢了!',
			subtitle:'《查詢方式》\n  • 直接輸入要查詢的詞彙\n • 透過對話詢問來查詢',
			text:'**[!]您可以使用下方建議卡片來嘗試**',
			}));

	conv.ask(new Suggestions(text_array[parseInt(Math.random()*1511)],idiom_array[parseInt(Math.random()*599)],'說明'+text_array[parseInt(Math.random()*1511)],text_array[parseInt(Math.random()*1511)]+'是甚麼','定義'+idiom_array[parseInt(Math.random()*599)],'查詢'+idiom_array[parseInt(Math.random()*599)]));
	conv.ask(new Suggestions('關於這部辭典','➥結束查詢'));

});

app.intent('查詢字典', (conv,{input}) => {

 	input=input.replace(/[\w|]/g,"");
 	input=input.replace(/[\ㄦ|\ㄢ|\ㄞ|\ㄚ|\ㄧ|\ㄗ|\ㄓ|\ㄐ|\ㄍ|\ㄉ|\ㄅ|\ㄣ|\ㄟ|\ㄛ|\ㄨ|\ㄘ|\ㄔ|\ㄑ|\ㄎ|\ㄊ|\ㄆ|\ㄤ|\ㄠ|\ㄜ|\ㄩ|\ㄙ|\ㄕ|\ㄒ|\ㄏ|\ㄋ|\ㄇ|\ㄥ|\ㄡ|\ㄝ|\ㄖ|\ㄌ|\ㄈ|\ˇ|\ˋ|\˙|]/g,"");
	input=input.replace(/[A-Za-z]/g,"");
	input=input.replace(/[\○|\；|\．|\！|\：|\『|\』|\。|\、|\（|\）|\──|\，|\「|\？|\」|\~|\ |\~|\`|\!|\@|\#|\$|\%|\^|\&|\*|\(|\)|\-|\_|\+|\=|\||\\|\[|\]|\{|\}|\;|\:|\"|\'|\,|\<|\.|\>|\/|\?]/g,""); 

	if(input.length>1&&input.indexOf('台')!==-1){input=replaceString(input, '台', '臺');}

	if(input==="哪裡"){input="那裡";}
	else if(input==="南投"){input="南投縣";}
	else if(input==="基隆"){input="基隆市";}
	else if(input==="宜蘭"){input="宜蘭縣";}
	else if(input==="屏東"){input="屏東縣";}
	else if(input==="彰化"){input="彰化縣";}
	else if(input==="新北"){input="新北市";}
	else if(input==="桃園"){input="桃園市";}
	else if(input==="澎湖"){input="澎湖縣";}
	else if(input==="臺北"){input="臺北市";}
	else if(input==="臺南"){input="臺南市";}
	else if(input==="臺東"){input="臺東縣";}
	else if(input==="花蓮"){input="花蓮縣";}
	else if(input==="苗栗"){input="苗栗縣";}
	else if(input==="連江"){input="連江縣";}
	else if(input==="高雄"){input="高雄市";}

return new Promise(function(resolve,reject){
	getJSON('https://www.moedict.tw/uni/'+encodeURIComponent(input))
		.then(function(response) {
		  var data=response;
		  resolve(data)
		}).catch(function(error) {
		  reject(error)
		});	   
}).then(function (origin_data) {
	
	if (origin_data.heteronyms.length>1){
	conv.contexts.set(MultiContexts.parameter, 1);
	
	bopomofo_array="";
	conv.ask(new SimpleResponse({ 
					speech: `<speak><p><s>您所查詢的<break time="0.25s"/>${input}<break time="0.25s"/>有多個發音方式</s><s>請輕觸下方建議卡片來選擇。</s></p></speak>`,
					text: '您所查詢的「'+input+'」有多種表達方式。\n請點選建議卡片來選擇。'}));
					
					conv.ask(new Table({
                   title: input,
                   columns: [{header: "多音字",align: 'LEADING',},],
                   rows: [{cells: ["一個字有多種讀音。  \n中國文字原為一字一形體，一字音，一字義。  \n後來，社會因時代的遞嬗，語言有了變化，  \n起初的文字不敷應用，原字形也產生變化。  \n其中，文字因不夠使用，或因地域不同，或因訛讀的影響，一字多音就這樣發展起來。"],dividerAfter: false,},],}));
								
	for(i=0;i<origin_data.heteronyms.length;i++){
	 if(origin_data.heteronyms[i].bopomofo!==undefined){
	bopomofo_array=bopomofo_array+origin_data.heteronyms[i].bopomofo+',';
	if(bopomofo_array+origin_data.heteronyms[i].bopomofo!==" "){
	 conv.ask(new Suggestions(origin_data.heteronyms[i].bopomofo.replace(/[\（|\語|\音|\）|\讀|\又|]/g,"")));}}
	else{bopomofo_array=bopomofo_array+' '+',';}	
	}
	bopomofo_array=bopomofo_array.replace(/[\（|\語|\音|\）|\讀|\又|]/g,"");
	conv.user.storage.bopomofo_array=bopomofo_array.split(',');
	conv.user.storage.input_charactor=input;

	 }
	else{
	bopomofo=origin_data.heteronyms[0].bopomofo;
	
	definitions="";synonyms="";antonyms="";example_array="";link_array="";j=1;
	
	for(i=0;i<origin_data.heteronyms[0].definitions.length;i++){

		if(origin_data.heteronyms[0].definitions[i].def.indexOf('同「')!==-1){link_array=link_array+origin_data.heteronyms[0].definitions[i].def+'、';}
		else if(origin_data.heteronyms[0].definitions[i].def.indexOf('通「')!==-1){link_array=link_array+((origin_data.heteronyms[0].definitions[i].def).split('通「')[1]).split('」')[0]+'、';}
		else if(origin_data.heteronyms[0].definitions[i].def.indexOf('見「')!==-1){link_array=link_array+((origin_data.heteronyms[0].definitions[i].def).split('見「')[1]).split('」條')[0]+'、';}

		var temp=origin_data.heteronyms[0].definitions[i].def;
		
		if(temp.indexOf('&nbsp')!==-1){temp=" ";}
		temp=temp.replace(/[\<|\>|\…|\☰|\☰|\○|\；|\．|\！|\：|\『|\』|\。|\、|\（|\）|\──|\，|\「|\？|\」|\~|\ |\~|\`|\!|\@|\#|\$|\%|\^|\&|\*|\(|\)|\-|\_|\+|\=|\||\\|\[|\]|\{|\}|\;|\:|\"|\'|\,|\.|\/|\?]/g,""); 
		temp=temp.replace(/[A-Za-z]/g,"");
		temp=temp.replace(/[\u0000-\u4DFF]/,"");
		temp=temp.replace(/[\u0800-\u4e00]/,"");
		temp=temp.replace(/[\w|]/g,"");
				
		if(isChn(temp)===true){
				
		if(origin_data.heteronyms[0].definitions.length>1){definitions=definitions+(j)+'.**';}else{definitions=definitions+'**';}
			var process=origin_data.heteronyms[0].definitions[i].def;
		   if(isBrackets(process)!==-1){process=process.split('（')[0];}
			process=replaceString(process, '如：', '如')
			process=replaceString(process, '。如', '。**  \n㊟*')
			process=replaceString(process, '<1>', '');
			process=replaceString(process, '<2>', '');
		if(process.indexOf('㊟')!==-1){
			process=replaceString(process, '：(', '：**  \n**(');
			process=replaceString(process, '。(', '。*  \n**(');
			process=replaceString(process, '」(', '」*  \n**(');
			process=process+'*  \n';}	
		else{
			process=replaceString(process, '(', '  \n(')
			process=process+'**  \n';}

			definitions=definitions+process;
		
		if(origin_data.heteronyms[0].definitions[i].example!==undefined){
			var process=origin_data.heteronyms[0].definitions[i].example[0];
				process=replaceString(process, '如：', '㊟');
			definitions=definitions+'*'+process+'*  \n';			
			
			example_array=example_array+origin_data.heteronyms[0].definitions[i].example+'、';
			example_array=example_array.replace(/[\「|\。|\」|]/g,"");}//蒐集範例
			j++;}
		if(origin_data.heteronyms[0].definitions[i].synonyms!==undefined){synonyms=synonyms+origin_data.heteronyms[0].definitions[i].synonyms+',';}     //蒐集同義詞
		if(origin_data.heteronyms[0].definitions[i].antonyms!==undefined){antonyms=antonyms+origin_data.heteronyms[0].definitions[i].antonyms+',';}     //蒐集反義詞
		if(origin_data.heteronyms[0].definitions[i].link!==undefined){
			var k=0;
			for(k=0;k<origin_data.heteronyms[0].definitions[i].link.length;k++){
			link_array=link_array+origin_data.heteronyms[0].definitions[i].link[k]+'、';
			link_array=link_array.replace(/[\同|\通|\見|\條|\「|\。|\」|]/g,"");}}//蒐集深入連結條例
	}
	
	stroke_count=origin_data.stroke_count;
	radical=origin_data.radical;
	stroke_count=origin_data.stroke_count;

	//產生口語輸出的解釋
	output=definitions.split('4.')[0];
	output=replaceString(output, '  \n', '<break time="0.5s"/>');
	output=replaceString(output, '*', '');
	output=replaceString(output, '㊟', '<break time="0.3s"/>例如：');
	output=replaceString(output, '<1>', '');
	output=replaceString(output, '<2>', '');
	output=replaceString(output, '。', '</s><s>');
	output=replaceString(output, input, bopomofo);
	output=output.replace(/[\u0000-\u001F]/,"");

	definitions=replaceString(definitions, '。**  \n**  \n', '。**  \n');

	if(radical!==undefined){
	
    radical_output=radical;
	if(radical_output==="⼴"){radical_output="演";}
	else if(radical_output==="⼁"){radical_output="滾";}
	else if(radical_output==="丶"){radical_output="主";}
	
	conv.ask(new SimpleResponse({speech: `<speak><p><s>${bopomofo}<break time="0.5s"/>${radical_output}部，共${stroke_count}劃</s><break time="0.5s"/><s>${output}</s></p></speak>`,text: response_array[parseInt(Math.random()*5)]}));
	
	conv.ask(new BasicCard({  
		title:input+' '+bopomofo,
		subtitle:'「'+radical+'」部 • 共'+stroke_count+'劃',
		text:definitions,}));
			
	if(radical!==input){conv.ask(new Suggestions(radical));}
				    else{conv.ask(new Suggestions('✎講解「二一四部首」'));}

	example_array=replaceString(example_array, '如：', '');
	example_array=example_array.split('、');
	
	if(example_array.length!==0){
	  for(i=0;i<example_array.length;i++){
	if(example_array[i].length<5&&example_array[i].length>0){conv.ask(new Suggestions(example_array[i]));}
	  }
	 }
	}else{
		
	conv.ask(new SimpleResponse({speech: `<speak><p><s>${bopomofo}</s><break time="0.5s"/><s>${output}</s></p></speak>`,text: response_array[parseInt(Math.random()*5)]}));
	
	conv.ask(new BasicCard({  
		title:input,
		subtitle:bopomofo,
		text:definitions,}));

	for(i=0;i<input.length;i++){
	var temp=input.split('');		
	if(temp[i].length>0){conv.ask(new Suggestions(temp[i]));}}

	}

	if(link_array.length!==0){
	  link_array=replaceString(link_array, '亦稱為', '');
	  link_array=replaceString(link_array, '亦作', '');
	  link_array=replaceString(link_array, '簡稱為', '');
	  link_array=replaceString(link_array, '亦稱為', '');
	  link_array=replaceString(link_array, '或稱為', '');
	  link_array=replaceString(link_array, '或譯作', '');
	  link_array=replaceString(link_array, '或作', '');
      link_array=replaceString(link_array, '<1>', '');
	  link_array=replaceString(link_array, '<2>', '');
	  link_array=link_array.replace(/[\同|\通|\見|\條|\等|\「|\。|\」|]/g,"");//蒐集深入連結條例
	  link_array=link_array.split('、');
	  for(i=0;i<link_array.length;i++){
	  if(link_array[i].length>0){conv.ask(new Suggestions(link_array[i]));}}
	  } 
	
	if(synonyms.length!==0){
	  synonyms=synonyms.split(',');
	  for(i=0;i<synonyms.length;i++){
	 if(synonyms[i]>0){conv.ask(new Suggestions(synonyms[i]));}
	  } }
	if(antonyms.length!==0){
	  antonyms=antonyms.split(',');
	  for(i=0;i<antonyms.length;i++){
		if(antonyms[i]>0){conv.ask(new Suggestions(antonyms[i]));}
	  } }
	  
	conv.ask(new Suggestions('➥結束查詢'));
   
	}
	}).catch(function (error) {
	console.log(error);
			
	if(input.length>0){

	return_array=[];
    return new Promise(function(resolve,reject){
	
	input_array=input.split('');

	for(m=0;m<input_array.length;m++){
		 if(compare_array[input_array[m]+input_array[m+1]+input_array[m+2]+input_array[m+3]]==="true"){
		  return_array.push(input_array[m]+input_array[m+1]+input_array[m+2]+input_array[m+3]);
		  m++;m++;m++;}
	     else if(compare_array[input_array[m]+input_array[m+1]+input_array[m+2]]==="true"){
		  return_array.push(input_array[m]+input_array[m+1]+input_array[m+2]);
		  m++;m++;}
		 else if(compare_array[input_array[m]+input_array[m+1]]==="true"){
		  return_array.push(input_array[m]+input_array[m+1]);
		  m++;}
		  else{return_array.push(input_array[m]);}
	 }
	  console.log(return_array) 
	  resolve(return_array)

	}).then(function (origin_data) {
	
	conv.ask(new SimpleResponse({speech:`<speak><p><s>我找不到你要查詢的詞彙</s><s>你可以試著輸入分拆的詞來查詢各自的意思。</s></p></speak>`,
								 text:"找不到這個詞彙喔!\n可以嘗試輸入單詞來查詢。"}));                 		
	
	const hasWebBrowser =conv.surface.capabilities.has('actions.capability.WEB_BROWSER');
		
	if(hasWebBrowser){
        conv.ask(new BasicCard({
        image: new Image({url:'https://i.imgur.com/RrqFkIp.png',alt:'Pictures',}),
        }));
	}else{
        conv.ask(new BasicCard({
	    title: '查詢不到你輸入的詞彙',
        image: new Image({url:'https://i.imgur.com/RrqFkIp.png',alt:'Pictures',}),
        }));
	}
	for(i=0;i<origin_data.length;i++){
		conv.ask(new Suggestions(origin_data[i]));}
	conv.ask(new Suggestions('➥結束查詢'));
    }).catch(function (error) {
	conv.ask(new SimpleResponse({speech:`<speak><p><s>抱歉，發生一點小錯誤</s></p></speak>`,text:"發生錯誤!"}));                 

		console.log(error)});

	}
	else{
	conv.ask(new SimpleResponse({speech:`<speak><p><s>抱歉，我找不到你要查詢的詞彙</s></p></speak>`,text:"找不到這個詞彙喔!"}));                 
	const hasWebBrowser =conv.surface.capabilities.has('actions.capability.WEB_BROWSER');
		
	if(hasWebBrowser){
        conv.ask(new BasicCard({
        image: new Image({url:'https://i.imgur.com/RrqFkIp.png',alt:'Pictures',}),
        }));
	}else{
        conv.ask(new BasicCard({
	    title: '查詢不到你輸入的詞彙',
        image: new Image({url:'https://i.imgur.com/RrqFkIp.png',alt:'Pictures',}),
        }));
	}
 		
	conv.ask(new Suggestions(text_array[parseInt(Math.random()*1511)],text_array[parseInt(Math.random()*1511)],idiom_array[parseInt(Math.random()*599)],idiom_array[parseInt(Math.random()*599)],text_array[parseInt(Math.random()*1511)],text_array[parseInt(Math.random()*1511)],idiom_array[parseInt(Math.random()*599)],idiom_array[parseInt(Math.random()*599)]));
	conv.ask(new Suggestions('➥結束查詢'));

	}
	});
});

app.intent('多音字查詢', (conv,{character}) => {

	bopomofo_array=conv.user.storage.bopomofo_array;
	var input=conv.user.storage.input_charactor;
	num=parseInt(bopomofo_array.indexOf(conv.input.raw));
    bopomofo=conv.input.raw;

return new Promise(function(resolve,reject){
	getJSON('https://www.moedict.tw/uni/'+encodeURIComponent(input))
		.then(function(response) {
		  var data=response;
		  resolve(data)
		}).catch(function(error) {
		  reject(error)
		});	   
}).then(function (origin_data) {
	conv.contexts.set(ResesctContexts.parameter, 1);

	definitions="";synonyms="";antonyms="";example_array="";link_array="";j=1;
	
	for(i=0;i<origin_data.heteronyms[num].definitions.length;i++){

		if(origin_data.heteronyms[num].definitions[i].def.indexOf('同「')!==-1){link_array=link_array+((origin_data.heteronyms[num].definitions[i].def).split('同「')[1]).split('」')[0]+'、';}
		else if(origin_data.heteronyms[num].definitions[i].def.indexOf('通「')!==-1){link_array=link_array+((origin_data.heteronyms[num].definitions[i].def).split('通「')[1]).split('」')[0]+'、';}
		else if(origin_data.heteronyms[num].definitions[i].def.indexOf('見「')!==-1){link_array=link_array+((origin_data.heteronyms[num].definitions[i].def).split('見「')[1]).split('」條')[0]+'、';}

		var temp=origin_data.heteronyms[num].definitions[i].def;
		
		if(temp.indexOf('&nbsp')!==-1){temp=" ";}
		temp=temp.replace(/[\<|\>|\…|\☰|\☰|\○|\；|\．|\！|\：|\『|\』|\。|\、|\（|\）|\──|\，|\「|\？|\」|\~|\ |\~|\`|\!|\@|\#|\$|\%|\^|\&|\*|\(|\)|\-|\_|\+|\=|\||\\|\[|\]|\{|\}|\;|\:|\"|\'|\,|\.|\/|\?]/g,""); 
		temp=temp.replace(/[A-Za-z]/g,"");
		temp=temp.replace(/[\w|]/g,"");
		temp=temp.replace(/[\ぁ|\あ|\ぃ|\い|\ぅ|\う|\ぇ|\え|\ぉ|\お|\か|\が|\き|\ぎ|\く|\ぐ|\け|\げ|\こ|\ご|\さ|\ざ|\し|\じ|\す|\ず|\せ|\ぜ|\そ|\ぞ|\た|\だ|\ち|\ぢ|\っ|\つ|\づ|\て|\で|\と|\ど|\な|\に|\ぬ|\ね|\の|\は|\ば|\ぱ|\ひ|\び|\ぴ|\ふ|\ぶ|\ぷ|\へ|\べ|\ぺ|\ほ|\ぼ|\ぽ|\ま|\み|\む|\め|\も|\ゃ|\や|\ゅ|\ゆ|\ょ|\よ|\ら|\り|\る|\れ|\ろ|\ゎ|\わ|\ゐ|\ゑ|\を|\ん|\ゔ|\ゕ|\ゖ|\゚|\゛|\゜|\ゝ|\ゞ|\ゟ|\゠|\ァ|\ア|\ィ|\イ|\ゥ|\ウ|\ェ|\エ|\ォ|\オ|\カ|\ガ|\キ|\ギ|\ク|\グ|\ケ|\ゲ|\コ|\ゴ|\サ|\ザ|\シ|\ジ|\ス|\ズ|\セ|\ゼ|\ソ|\ゾ|\タ|\ダ|\チ|\ヂ|\ッ|\ツ|\ヅ|\テ|\デ|\ト|\ド|\ナ|\ニ|\ヌ|\ネ|\ノ|\ハ|\バ|\パ|\ヒ|\ビ|\ピ|\フ|\ブ|\プ|\ヘ|\ベ|\ペ|\ホ|\ボ|\ポ|\マ|\ミ|\ム|\メ|\モ|\ャ|\ヤ|\ュ|\ユ|\ョ|\ヨ|\ラ|\リ|\ル|\レ|\ロ|\ヮ|\ワ|\ヰ|\ヱ|\ヲ|\ン|\ヴ|\ヵ|\ヶ|\ヷ|\ヸ|\ヹ|\ヺ|\・|\ー|\ヽ|\ヾ|\ヿ|\㍐|\㍿]/g,"");

		if(isChn(temp)===true){
				
		if(origin_data.heteronyms[num].definitions.length>1){definitions=definitions+(j)+'.**';}else{definitions=definitions+'**';}
			var process=origin_data.heteronyms[num].definitions[i].def;
	    if(isBrackets(process)!==-1){process=process.split('（')[0];}
			process=replaceString(process, '如：', '如')
			process=replaceString(process, '。如', '。**  \n㊟*')
			process=replaceString(process, '<1>', '');
			process=replaceString(process, '<2>', '');
		if(process.indexOf('㊟')!==-1){
			process=replaceString(process, '：(', '：**  \n**(');
			process=replaceString(process, '。(', '。*  \n**(');
			process=replaceString(process, '」(', '」*  \n**(');
			process=process+'*  \n';}	
		else{
			process=replaceString(process, '(', '  \n(')
			process=process+'**  \n';}

			definitions=definitions+process;
		
		if(origin_data.heteronyms[num].definitions[i].example!==undefined){
			var process=origin_data.heteronyms[num].definitions[i].example[0];
				process=replaceString(process, '如：', '㊟');
			definitions=definitions+'*'+process+'*  \n';
			
			example_array=example_array+origin_data.heteronyms[num].definitions[i].example+'、';
			example_array=example_array.replace(/[\「|\。|\」|]/g,"");}//蒐集範例
			j++;}
		if(origin_data.heteronyms[num].definitions[i].synonyms!==undefined){synonyms=synonyms+origin_data.heteronyms[num].definitions[i].synonyms+',';}     //蒐集同義詞
		if(origin_data.heteronyms[num].definitions[i].antonyms!==undefined){antonyms=antonyms+origin_data.heteronyms[num].definitions[i].antonyms+',';}     //蒐集反義詞
		if(origin_data.heteronyms[num].definitions[i].link!==undefined){
			var k=0;
			for(k=0;k<origin_data.heteronyms[num].definitions[i].link.length;k++){
			link_array=link_array+origin_data.heteronyms[num].definitions[i].link[k]+'、';
			link_array=link_array.replace(/[\同|\通|\見|\條|\「|\。|\」|]/g,"");}}//蒐集深入連結條例
	}
	
	stroke_count=origin_data.stroke_count;
	radical=origin_data.radical;
	stroke_count=origin_data.stroke_count;

	//產生口語輸出的解釋
	output=definitions.split('4.')[0];
	output=replaceString(output, '  \n', '<break time="0.5s"/>');
	output=replaceString(output, '*', '');
	output=replaceString(output, '㊟', '<break time="0.3s"/>例如：');
	output=replaceString(output, '<1>', '');
	output=replaceString(output, '<2>', '');
	output=replaceString(output, input, bopomofo);
	output=output.replace(/[\u0000-\u001F]/,"");
	output=replaceString(output, '。', '</s><s>');
	
	definitions=replaceString(definitions, '。**  \n**  \n', '。**  \n');

	if(radical!==undefined){
	 radical_output=radical;
	if(radical_output==="⼴"){radical_output="演";}
	else if(radical_output==="⼁"){radical_output="滾";}
	else if(radical_output==="丶"){radical_output="主";}
	
	conv.ask(new SimpleResponse({speech: `<speak><p><s>${bopomofo}<break time="0.5s"/>${radical_output}部，共${stroke_count}劃</s><break time="0.5s"/><s>${output}</s></p></speak>`,text: response_array[parseInt(Math.random()*5)]}));
	
	conv.ask(new BasicCard({  
		title:input+' '+bopomofo,
		subtitle:'「'+radical+'」部 • 共'+stroke_count+'劃',
		text:definitions,}));

	if(radical!==input){conv.ask(new Suggestions(radical));}
				    else{conv.ask(new Suggestions('✎講解「二一四部首」'));}
	conv.ask(new Suggestions('查看其他讀音'));

	example_array=replaceString(example_array, '如：', '');
	example_array=example_array.split('、');
	if(example_array.length!==0){
	  for(i=0;i<example_array.length;i++){
	if(example_array[i].length<5&&example_array[i].length>0){conv.ask(new Suggestions(example_array[i]));}
	  } }

	}else{
		
	conv.ask(new SimpleResponse({speech: `<speak><p><s>${bopomofo}</s><break time="0.5s"/><s>${output}</s></p></speak>`,text: response_array[parseInt(Math.random()*5)]}));
	
	conv.ask(new BasicCard({  
		title:input,
		subtitle:bopomofo,
		text:definitions,}));
	
	for(i=0;i<input.length;i++){
	var temp=input.split('');		
	conv.ask(new Suggestions(temp[i]));}
	conv.ask(new Suggestions('查看其他讀音'));

	}

	if(link_array.length!==0){
	  link_array=replaceString(link_array, '亦稱為', '');
	  link_array=replaceString(link_array, '亦作', '');
	  link_array=replaceString(link_array, '簡稱為', '');
	  link_array=replaceString(link_array, '亦稱為', '');
	  link_array=replaceString(link_array, '或稱為', '');
	  link_array=replaceString(link_array, '或譯作', '');
	  link_array=replaceString(link_array, '或作', '');
      link_array=replaceString(link_array, '<1>', '');
	  link_array=replaceString(link_array, '<2>', '');
	  link_array=link_array.replace(/[\同|\通|\見|\條|\等|\「|\。|\」|]/g,"");//蒐集深入連結條例
	  link_array=link_array.split('、');
	  for(i=0;i<link_array.length;i++){
	  if(link_array[i].length>0){conv.ask(new Suggestions(link_array[i]));}}
	  } 
	
	if(synonyms.length!==0){
	  synonyms=synonyms.split(',');
	  for(i=0;i<synonyms.length;i++){
	 if(synonyms[i]>0){conv.ask(new Suggestions(synonyms[i]));}
	  } }
	if(antonyms.length!==0){
	  antonyms=antonyms.split(',');
	  for(i=0;i<antonyms.length;i++){
		if(antonyms[i]>0){conv.ask(new Suggestions(antonyms[i]));}
	  } }
	  
	conv.ask(new Suggestions('➥結束查詢'));

	}).catch(function (error) {
	console.log(error);
	conv.contexts.set(MultiContexts.parameter, 1);

	conv.ask(new SimpleResponse({ 
					speech: `<speak><p><s>${input}有以下幾種發音方式</s><s>請點選下方建議卡片選擇要查看的讀音。</s></p></speak>`,
					text: '請點選下方建議卡片選擇要查看的讀音'}));
	conv.ask(new Table({
			   title: input,
			   columns: [{header: "多音字",align: 'LEADING',},],
			   rows: [{cells: ["一個字有多種讀音。  \n中國文字原為一字一形體，一字音，一字義。  \n後來，社會因時代的遞嬗，語言有了變化，  \n起初的文字不敷應用，原字形也產生變化。  \n其中，文字因不夠使用，或因地域不同，或因訛讀的影響，一字多音就這樣發展起來。"],dividerAfter: false,},],}));

	for(i=0;i<bopomofo_array.length;i++){
	conv.ask(new Suggestions(bopomofo_array[i]));
	}

    });

});

app.intent('查看其他讀音', (conv) => {

	bopomofo_array=conv.user.storage.bopomofo_array;
	var input=conv.user.storage.input_charactor;
	num=parseInt(bopomofo_array.indexOf(conv.input.raw));
    bopomofo=conv.input.raw;

	conv.contexts.set(MultiContexts.parameter, 1);

	conv.ask(new SimpleResponse({ 
					speech: `<speak><p><s>${input}有以下幾種發音方式</s><s>請輕觸下方建議卡片來選擇。</s></p></speak>`,
					text: '您所查詢的「'+input+'」有多種表達方式。'}));
	conv.ask(new Table({
			   title: input,
			   columns: [{header: "多音字",align: 'LEADING',},],
			   rows: [{cells: ["一個字有多種讀音。  \n中國文字原為一字一形體，一字音，一字義。  \n後來，社會因時代的遞嬗，語言有了變化，  \n起初的文字不敷應用，原字形也產生變化。  \n其中，文字因不夠使用，或因地域不同，或因訛讀的影響，一字多音就這樣發展起來。"],dividerAfter: false,},],}));

	for(i=0;i<bopomofo_array.length;i++){
	if(bopomofo_array[i]!==" "){conv.ask(new Suggestions(bopomofo_array[i]));}
	}
});

var Radical_array=["一","丨","丶","丿","乙","亅","二","亠","人","儿","入","八","冂","冖","冫","几","凵","刀","力","勹","匕","匚","匸","十","卜","卩","厂","厶","又","口","囗","土","士","夂","夊","夕","大","女","子","宀","寸","小","尢","尸","屮","山","巛","工","己","巾","干","幺","广","廴","廾","弋","弓","彐","彡","彳","心","戈","戶","手","支","攴","文","斗","斤","方","无","日","曰","月","木","欠","止","歹","殳","毋","比","毛","氏","气","水","火","爪","父","爻","爿","片","牙","牛","犬","玄","玉","瓜","瓦","甘","生","用","田","疋","疒","癶","白","皮","皿","目","矛","矢","石","示","禸","禾","穴","立","竹","米","糸","缶","网","羊","羽","老","而","耒","耳","聿","肉","臣","自","至","臼","舌","舛","舟","艮","色","艸","虍","虫","血","行","衣","襾","見","角","言","谷","豆","豕","豸","貝","赤","走","足","身","車","辛","辰","辵","邑","酉","釆","里","金","長","門","阜","隶","隹","雨","青","非","面","革","韋","韭","音","頁","風","飛","食","首","香","馬","骨","高","髟","鬥","鬯","鬲","鬼","魚","鳥","鹵","鹿","麥","麻","黃","黍","黑","黹","黽","鼎","鼓","鼠","鼻","齊","齒","龍","龜","龠"];

app.intent('二一四部首的解釋', (conv) => {

	conv.ask(new SimpleResponse({ 
					speech: `<speak><p><s>二一四部首</s><s>是明朝萬曆43年時由梅膺祚所編纂之《字彙》創始的。</s><s>《字彙》是第一本部首本身的排列與部首內的文字排列都採用筆劃數順序的跨時代字書。</s><s>之後，《康熙字典》承襲《字彙》的214部首，《康熙字典》亦成為近代字典之標準，稱為「康熙部首」。</s></p></speak>`,
					text: '說明如下。'}));
	conv.ask(new Table({
			   title: '二一四部首',
			   columns: [{header: "以下是來自維基百科的節錄",align: 'LEADING',},],
			   rows: [{cells: ["214部首，是明朝萬曆43年（1615年）時由梅膺祚所編纂之《字彙》創始的。  \n《字彙》是第一本部首本身的排列與部首內的文字排列都採用筆劃數順序的劃時代字書。  \n之後《康熙字典》承襲《字彙》的214部首，《康熙字典》亦成為近代字典之標準，稱為「康熙部首」。  \n"],
			   dividerAfter: false,},],}));
	conv.ask(new Suggestions(Radical_array[parseInt(Math.random()*213)],Radical_array[parseInt(Math.random()*213)],Radical_array[parseInt(Math.random()*213)],Radical_array[parseInt(Math.random()*213)],Radical_array[parseInt(Math.random()*213)],Radical_array[parseInt(Math.random()*213)],Radical_array[parseInt(Math.random()*213)],Radical_array[parseInt(Math.random()*213)],Radical_array[parseInt(Math.random()*213)],Radical_array[parseInt(Math.random()*213)],Radical_array[parseInt(Math.random()*213)]));
			   
			   
});

app.intent('關於《重編國語辭典 修訂本》', (conv) => {
	conv.ask(new SimpleResponse({ 
					speech: `<speak><p><s>《蟲編國語辭典 修訂本》</s><s>是中華民國教育部編纂的大型辭典，其線上版本由國家教育研究院負責維護。</s></p></speak>`,
					text: '說明如下。'}));
	conv.ask(new Table({
			   title: '《重編國語辭典修訂本》',
			   columns: [{header: "以下是官方版權頁的詳細資訊，請查照。",align: 'LEADING',},],
			   rows: [{cells: ["企劃執行：國家教育研究院  \n  \n原 著 者：教育部國語推行委員會  \n　　　　（民國102年1月1日配合行政院組改併入相關單位）  \n  \n發 行 人：吳思華　柯華葳  \n  \n  \n發 行 所：中華民國教育部  \n  \n  \n維護單位：國家教育研究院語文教育及編譯研究中心  \n  \n地　　址：新北市三峽區三樹路2號  \n  \n電　　話：(02)7740-7282  \n  \n傳　　真：(02)7740-7284  \n  \n電子郵件：onile@mail.naer.edu.tw  \n  \n版　　次：中華民國104年11月臺灣學術網路第五版"],
			   dividerAfter: false,},],
			   buttons: new Button({title: '《重編國語辭典 修訂本》',url:'http://dict.revised.moe.edu.tw/cgi-bin/cbdic/gsweb.cgi?ccd=RVR8Qf&o=e0&sec=sec1&index=1',display: 'CROPPED',}),}));
	conv.ask(new Suggestions(text_array[parseInt(Math.random()*1511)],idiom_array[parseInt(Math.random()*599)],'說明'+text_array[parseInt(Math.random()*1511)],text_array[parseInt(Math.random()*1511)]+'是甚麼','定義'+idiom_array[parseInt(Math.random()*599)],'查詢'+idiom_array[parseInt(Math.random()*599)]));
	conv.ask(new Suggestions('➥結束查詢'));

});

app.intent('結束對話', (conv) => {
		conv.user.storage = {}; //離開同時清除暫存資料
		conv.ask('希望能幫上一點忙!');
		conv.ask(new SimpleResponse({speech: '下次見',text: '下次見 👋',}));
		conv.close(new BasicCard({   
			title: '感謝您的使用!', 
			text:'如果有任何需要改進的地方，  \n歡迎到簡介頁面評分或給予反饋，謝謝!', 
			buttons: new Button({title: '開啟本程式的商店頁面',url: 'https://assistant.google.com/services/a/uid/0000008d7409cb2a',}),
	  })); 
});


// Set the DialogflowApp object to handle the HTTPS POST request.
exports.tw_dictionary = functions.https.onRequest(app);