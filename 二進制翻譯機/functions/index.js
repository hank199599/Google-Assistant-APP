'use strict';

// Import the Dialogflow module from the Actions on Google client library.
const {
    dialogflow,
    Permission,
    Suggestions,
    SimpleResponse,
    Button,
    Image,
    BasicCard,
    LinkOutSuggestion,
    BrowseCarousel,
    BrowseCarouselItem,
    items,
    Table
} = require('actions-on-google');

// Import the firebase-functions package for deployment.
const functions = require('firebase-functions');
var binstring = require('binstring');
const replaceString = require('replace-string');
const i18n = require('i18n');

// Instantiate the Dialogflow client.
const app = dialogflow({ debug: true });

var name = "";
var temperate = '';
var example = ["臘八", "占卜", "怎不", "等比", "背包", "敗北", "事倍功半", "瀑布", "諒必", "保本", "刨冰", "半百", "女伴", "秣馬厲兵", "班別", "酒吧", "假扮", "拜把", "踱步", "寶貝", "盟邦", "吞併", "謙卑", "飛奔", "恐怖", "合抱", "涼拌", "提拔", "貪杯", "面板", "淡泊", "奔波", "盜版", "附表", "糞便", "擔保", "膜拜", "把柄", "扁柏", "彪炳", "刀疤", "芒刺在背", "蒙胞", "百倍", "斑剝", "嗷嗷待哺", "逮捕", "編班", "痲瘋病", "針砭", "籬笆", "糌粑", "那般", "獵豹", "駕崩", "腐敗", "凋敝", "愚笨", "羈絆", "托缽", "船舶", "疊被", "本部", "封閉", "報備", "賭博", "碉堡", "播報", "輔弼", "可悲", "雀斑", "棍棒", "烘焙", "粉筆", "褒貶", "題跋", "相搏", "墓碑", "綑綁", "彌補", "復辟", "進逼", "冰雹", "標靶", "中飽", "劣幣驅逐良幣", "利弊", "放榜", "鋁箔", "胳膊", "來賓", "卑鄙", "糕餅", "辯駁", "隆鼻", "調撥", "導播", "抗暴", "目標", "瞎編", "也罷", "矇蔽", "襁褓", "泛泛之輩", "戈壁", "幫辦", "思辨", "穿幫", "巨擘", "凍斃", "緊繃", "菲薄", "誹謗", "躲避", "鐘擺", "引爆", "顛簸", "帳簿", "北邊", "甜八寶", "髮辮", "詭辯", "波霸", "甕中捉鱉", "丕變", "堤壩", "雲鬢", "枇杷", "釘耙", "琵琶", "害怕", "陡坡", "雞婆", "急迫", "體魄", "爆破", "節拍", "並排", "盾牌", "奉派", "捏坏", "栽培", "索賠", "嬪妃", "許配", "豐沛", "感佩", "燈泡", "鳴炮", "旗袍", "偷跑", "解剖", "高不可攀", "涅槃", "崩盤", "審判", "期盼", "聚寶盆", "過磅", "依傍", "臂膀", "肥胖", "蓆棚", "狹路相逢", "吹捧", "雷劈", "剝皮", "能否", "雅痞", "孤僻", "綁票", "薄片", "詩篇", "擺不平", "誆騙", "效顰", "舶來品", "續聘", "考評", "奶瓶", "任憑", "店鋪", "菖蒲", "奴僕", "儉樸", "泵浦", "苗圃", "歌譜", "舅媽", "達摩", "蓖麻", "駙馬", "砝碼", "謾罵", "捉摸", "甚麼", "消磨", "侈糜", "楷模", "描摹", "瓣膜", "塗抹", "芥末", "泯沒", "仿冒", "綻放", "命脈", "筆墨", "約莫", "寂寞", "緘默", "購買", "蕎麥", "販賣", "豪邁", "楊梅", "濃眉", "靈媒", "媲美", "胞妹", "昏昧", "透明", "魑魅", "諂媚", "熊貓", "汗毛", "繁茂", "戴高帽", "形貌", "共謀", "綢繆", "藤蔓", "撥發", "刁蠻", "飽滿", "瀰漫", "怠慢", "煩悶", "賁門", "憤懣", "慌忙", "鋒芒", "鹵莽", "締盟", "啟蒙", "迅猛", "舴艋", "論孟", "託夢", "痴迷", "猜謎", "奢靡", "胚芽米", "奧祕", "祕密", "蜂蜜", "寧謐", "尋覓", "幻滅", "豆苗", "掃描", "浩渺", "玄妙", "孔廟", "乖謬", "冬眠", "纏綿", "罷免", "黽勉", "冠冕", "滇緬", "避不見面", "牧民", "米飯", "聰敏", "憐憫", "慕名", "鸞鳳和鳴", "謀財害命", "褓母", "伐木", "薰沐", "瞑目", "畜牧", "召募", "墳墓", "簾幕", "戀慕", "遲暮", "肅穆", "撻伐", "匱乏", "竹筏", "母法", "刑罰", "燙髮", "是非", "嗎啡", "紛飛", "氮肥", "劫匪", "煮沸", "旅費", "曠廢", "檣帆", "吐蕃", "鬧翻", "但凡", "絮煩", "適得其反", "遣返", "累犯", "典範", "輩分", "繽紛", "澱粉", "備份", "憂憤", "亢奮", "敵方", "磨坊", "芬芳", "謹防", "洞房", "察訪", "攙扶", "誥封", "搬風", "巔峰", "蜜蜂", "裂縫", "侍奉", "薪俸", "嘲諷", "妹夫", "跏趺", "肌膚", "俯伏", "懸浮", "桃符", "嘆服", "寬幅", "洪福", "束縛", "迂腐", "闔府", "蹲俯", "臟腑", "叔父", "兌付", "康復", "辜負", "馮婦", "田賦", "羞答答", "勾搭", "到達", "扭打", "誇大", "了不得", "婦德", "虐待", "歷代", "囊袋", "借貸", "倦怠", "佩帶", "剃刀", "嘮叨", "扳倒", "澎湖群島", "督導", "料到", "誨盜", "霸道", "帝都", "泰斗", "顫抖", "豇豆", "拚鬥", "牡丹", "榜單", "肝膽", "撒旦", "黯淡", "笨蛋", "忌憚", "榴彈", "的當", "褲襠", "鋃鐺", "阻擋", "板蕩", "震盪", "鎂光燈", "次等", "冷板凳", "蹭蹬", "貶低", "孩提", "淚滴", "梆笛", "洗滌", "匹敵", "謎底", "府邸", "爹地", "桿弟", "及第", "皇帝", "嬗遞", "蝴蝶", "匪諜", "鶼鰈", "摺疊", "鴕鳥", "丟不掉", "磯釣", "都馬調", "瘋瘋癲癲", "慶典", "沸點", "飯店", "賀電", "椅墊", "添丁", "鉚釘", "屋頂", "萍蹤不定", "校訂", "胖嘟嘟", "荼毒", "僵冷", "統獨", "褻瀆", "朗讀", "嫉妒", "坡度", "粥少僧多", "褫奪", "懶惰", "啦啦隊", "肇端", "縮短", "階段", "耆老", "壟斷", "懵懵懂懂", "涵洞", "雕梁畫棟", "怦然心動", "踐踏", "蹧蹋", "忐忑", "瓦特", "多胞胎", "西北颱", "塌臺", "吧檯", "淘汰", "富態", "櫻桃", "遁逃", "乞討", "饅頭", "剔透", "窺探", "險灘", "訪談", "棒壇", "慨嘆", "灌迷湯", "池塘", "麥芽糖", "廟堂", "倜儻", "折騰", "扶梯", "防波堤", "例題", "胴體", "碑帖", "津貼", "斬釘截鐵", "鏈條", "窈窕", "蹦蹦跳跳", "蔽天", "丹田", "靦腆", "諦聽", "暫停", "娉婷", "唐突", "宦途", "糊塗", "構圖", "礬土", "嘔吐", "於菟", "襯托", "付託", "掙脫", "滂沱", "蹉跎", "虺隤", "伸腿", "蟬蛻", "斥退", "社團", "鯨吞", "溝通", "苟同", "梧桐", "乩童", "籠統", "聽筒", "疼痛", "剎那", "嗩吶", "欸乃", "俗不可耐", "銘感五內", "懊惱", "愣頭愣腦", "哭鬧", "役男", "罹難", "稚嫩", "窩囊", "逞能", "棗泥", "麟兒", "旖旎", "悖逆", "耽溺", "睥睨", "嚅囁", "憋尿", "犛牛", "彆扭", "樞紐", "暮年", "悼念", "伴娘", "醞釀", "毋寧", "猙獰", "匈奴", "惱怒", "婀娜", "怯懦", "席不暇暖", "佃農", "咕噥", "婢女", "冶煉", "謔而不虐", "啪啦", "嘩喇喇", "段落", "辛辣", "配樂", "否極泰來", "蓓蕾", "堡壘", "涕淚", "醣類", "抓牢", "犬馬之勞", "佝僂", "閣樓", "鄙陋", "紕漏", "暴露", "推波助瀾", "蕙蘭", "伽藍", "瀏覽", "橄欖", "慵懶", "氾濫", "糜爛", "駭浪", "豺狼", "琺瑯", "檳榔", "爽朗", "撲朔迷離", "藩籬", "蒺藜", "鵬程萬里", "答理", "鞭辟入裡", "牲禮", "迤邐", "媚力", "薜荔", "婷婷玉立", "顆粒", "牟利", "瘌痢", "慣例", "悚慄", "淅瀝", "惕勵", "砥礪", "綺麗", "伉儷", "伎倆", "凜冽", "猛烈", "天崩地裂", "拙劣", "涉獵", "幕僚", "鷦鷯", "免不了", "詎料", "湍流", "挽留", "贅瘤", "毗連", "嫁奩", "邦聯", "扮鬼臉", "鍛鍊", "曼陀林", "睦鄰", "麒麟", "瀕臨", "慳吝", "蹂躪", "除暴安良", "漂亮", "沁涼", "棟梁", "膏粱", "估量", "寅吃卯糧", "斤兩", "茯苓", "畸零", "鶺鴒", "丘陵", "勒令", "嘰哩咕嚕", "烤爐", "葫蘆", "俘虜", "鳳毛麟角", "翠綠", "輯錄", "麋鹿", "轂轆", "攔路", "嘍囉", "陀螺", "犍陀羅", "僂儸", "瓔珞", "峰巒", "戡亂", "崑崙", "謬論", "渡輪", "尼龍", "喉嚨", "玲瓏", "朦朧", "樊籠", "襤褸", "蓽路藍縷", "圯橋進履", "旋律", "倍率", "堪慮", "擄掠", "痙攣", "驪歌", "宰割", "聊備一格", "刪改", "梗概", "捲鋪蓋", "俸給", "脣膏", "撰稿", "訃告", "濠溝", "鬣狗", "架構", "若干", "桅杆", "卸貨", "釣竿", "椪柑", "餅乾", "槓桿", "竟敢", "敏感", "慧根", "儒艮", "搪缸", "瀧岡", "塑鋼", "閉門羹", "桔梗", "嘀咕", "翁姑", "肋骨", "矽谷", "屁股", "鑼鼓", "桎梏", "鞏固", "藉故", "惠顧", "哈密瓜", "卜卦", "頗為可觀", "賦歸", "漩渦", "揹黑鍋", "澤國", "巾幗", "醜八怪", "蘋果", "抵不過", "陋規", "餓鬼", "昂貴", "櫥櫃", "際會", "黜官", "桂冠", "潼關", "輸卵管", "籍貫", "易開罐", "廝混", "韜光", "雇工", "緋紅", "鞠躬", "秉公", "黌宮", "梭哈", "介面卡", "茄科", "貝殼", "迪斯可", "望梅止渴", "摩崖石刻", "鏢客", "撬開", "慷慨", "膾炙人口", "紐扣", "倭寇", "荳蔻", "刮目相看", "誠懇", "啼哭", "悽苦", "倉庫", "遼闊", "愉快", "俄羅斯方塊", "腎虧", "慚愧", "貸款", "籮筐", "癲狂", "掏空", "鈾礦", "瞳孔", "惶恐", "吆喝", "媾和", "拌合", "奈何", "汾河", "稽核", "恫嚇", "恭賀", "嬰孩", "璧還", "渤海", "汪洋", "妨害", "漆黑", "茼蒿", "括號", "癖好", "咽喉", "獼猴", "嘶吼", "憨厚", "瞻前顧後", "症候", "顢頇", "蘊含", "酷寒", "吶喊", "揩汗", "驃悍", "門外漢", "疤痕", "憾恨", "步行", "逾恆", "驕橫", "嗚呼", "恍惚", "鄱陽湖", "珊瑚", "漿糊", "足不出戶", "跋扈", "庇護", "孵化", "玫瑰花", "黛綠年華", "擘劃", "琴棋書畫", "喊話", "烽火", "傢伙", "槁木死灰", "抑或", "賈禍", "虜獲", "徘徊", "緬懷", "皮影戲", "駁回", "懺悔", "詆毀", "蘆薈", "菽水承歡", "般桓", "汰換", "炳煥", "饑荒", "徬徨", "燉煌", "硫黃", "炮轟", "霓虹", "簸箕", "錄放影機", "囤積", "痕跡", "雉雞", "噬臍莫及", "晉級", "瞬即", "猴急", "瘧疾", "妒嫉", "跼蹐", "杯盤狼藉", "舟楫", "邏輯", "荊棘", "抨擊", "妲己", "嫖妓", "札記", "旺季", "緩兵之計", "洲際", "磺胺劑", "荸薺", "踵繼", "愈加", "瑜伽", "莊家", "龜甲", "暑假", "棚架", "哄抬物價", "銲接", "癥結", "罵街", "迫在眉睫", "逢年過節", "筋疲力竭", "皎潔", "瞭解", "仲介", "癬疥", "楚河漢界", "齋戒", "八拜之交", "希臘正教", "辣椒", "舌敝脣焦", "咀嚼", "跛腳", "聒聒叫", "錙銖必較", "鶻鳩", "恆久", "啤酒", "窠臼", "仍舊", "歉疚", "拯救", "膚淺", "坊間", "篩檢", "函件", "瞥見", "矯健", "鈞鑒", "弓箭", "諷諫", "綸巾", "迄今", "璞玉渾金", "喜不自禁", "什錦", "加把勁", "躁進", "殆盡", "汨羅江", "悍將", "諾貝爾獎", "臭皮匠", "霜降", "倔強", "炸醬", "瀝青", "蕪菁", "鱗莖", "途經", "處變不驚", "瓶頸", "拍外景", "憧憬", "另闢蹊徑", "綏靖", "窗明几淨", "漫無止境", "凸透鏡", "畢恭畢敬", "況且", "趑趄", "篷車", "徙居", "柑橘", "踰矩", "枚舉", "婉拒", "胼手胝足", "炊具", "蟠踞", "粵劇", "言必有據", "勛爵", "嗅覺", "躋身", "交白卷", "睏倦", "郎君", "叛軍", "黴菌", "娶妻", "荔枝", "尤其", "象棋", "豎白旗", "嶔崎", "枸杞", "迭起", "悶氣", "啜泣", "擯棄", "噴霧器", "剴切", "剽竊", "鵲橋", "夢寐以求", "乒乓球", "鑲嵌", "孟母三遷", "攢錢", "省親", "慇懃", "鏗鏘", "卡賓槍", "踉踉蹌蹌", "鬩牆", "澄清", "咨請", "毫不留情", "誌慶", "奏鳴曲", "郊區", "崎嶇", "亦步亦趨", "擷取", "旨趣", "或缺", "豁拳", "君權", "獒犬", "襖裙", "腕道症候群", "黔驢技窮", "各奔東西", "吮吸", "剖析", "濂溪", "吝惜", "筵席", "棲息", "婆媳", "捻熄", "盥洗", "敝屣", "皆大歡喜", "朝不保夕", "譜系", "裙帶關係", "奸細", "哎呀", "褊狹", "瞞上欺下", "閑暇", "辟邪", "詼諧", "椎心泣血", "摹寫", "螃蟹", "猥褻", "鴟鴞", "彼長我消", "實報實銷", "咆哮", "眇小", "拂曉", "維妙維肖", "倣效", "訕笑", "善罷干休", "噢咻", "摧枯拉朽", "鋌而走險", "攝護腺", "拋物線", "莆田縣", "昧心", "簇新", "釜底抽薪", "寵信", "儐相", "丁香", "枋寮鄉", "禨祥", "翱翔", "遐想", "咯咯作響", "脈象", "肖像", "剋星", "葷腥", "橢圓形", "喚醒", "惰性", "僥倖", "唏噓", "些須", "鬍鬚", "秩序", "銓敘", "叨叨絮絮", "顓頊", "犁庭掃穴", "敦品勵學", "瑞雪", "椿萱", "斡旋", "膺選", "梟雄", "諮詢", "桀驁不馴", "庭訊", "趨吉避凶", "貓熊", "樂不可支", "殊不知", "胭脂", "紡織", "幣值", "鈣質", "瀆職", "戛然而止", "拇指", "吏治", "包班制", "醃製", "睿智", "獃滯", "尉遲", "普查", "吱吱喳喳", "螞蚱", "訛詐", "叱吒", "夭折", "迦葉尊者", "藷蔗", "抉擇", "睡不著", "奎星高照", "朕兆", "一把罩", "湄州", "盪舟", "掣肘", "宇宙", "詛咒", "迍邅", "愁眉不展", "屢敗屢戰", "萎靡不振", "返璞歸真", "指北針", "疱疹", "宋江陣", "篇章", "劍拔弩張", "蜚短流長", "飆漲", "廷杖", "膨脹", "屏障", "邪不勝正", "御駕親征", "鷸蚌相爭", "帕金森氏症", "准考證", "蚌珠", "蜘蛛", "債臺高築", "郡主", "烹煮", "擋不住", "挹注", "斟酌", "駟馬難追", "砌磚", "輾轉", "廬山", "謠傳", "瞄準", "男扮女裝", "理不直氣不壯", "莽莽撞撞", "冥冥之中", "臃腫", "鄭重", "寡不敵眾", "噗哧", "咫尺", "澠池", "矜持", "鑰匙", "恬不知恥", "拊膺切齒", "枒杈", "貿易順差", "茗茶", "劈柴", "鳩占鵲巢", "佳評如潮", "拔得頭籌", "噤若寒蟬", "諫臣", "誕辰", "牝雞司晨", "乏善可陳", "賠償", "捧場", "菩薩心腸", "惆悵", "暱稱", "功敗垂成", "茂盛", "和盤托出", "悔不當初", "鏟除", "躊躇", "踟躕", "恰到好處", "篣楚", "牴觸", "齷齪", "弦歌不輟", "秤錘", "哮喘", "枯木逢春", "鵪鶉", "痘瘡", "銑床", "瓢蟲", "殭屍", "機不可失", "措施", "籤詩", "磐石", "覓食", "昔時", "樸實", "倘使", "爵士", "閼氏", "蔑視", "潘安再世", "蝶式", "舔拭", "嘗試", "董監事", "乃是", "仗勢", "擇肥而噬", "素不相識", "渙然冰釋", "抹煞", "嚼舌", "蟒蛇", "退避三舍", "鍥而不捨", "輻射", "罪不可赦", "褐色", "曝晒", "舍我其誰", "盯梢", "叉燒", "斗杓", "僧多粥少", "崗哨", "嫻熟", "扒手", "恪守", "匕首", "嵩壽", "挑肥揀瘦", "禽獸", "恤衫", "蒲扇", "鄯善", "搢紳", "博大精深", "炯炯有神", "券商", "裹傷", "笛聲", "卯上", "犒賞", "爬升", "痛不欲生", "犧牲", "悲不自勝", "韁繩", "帛書", "溽暑", "袋鼠", "公倍數", "第八藝術", "蚍蜉撼樹", "淝水", "瞌睡", "砒霜", "雋爽", "某日", "猩紅熱", "庸人自擾", "繚繞", "涮羊肉", "驀然", "荏苒", "渲染", "媒人", "荐任", "薏仁", "矢口否認", "闕如", "侏儒", "囁嚅", "醱酵乳", "邁入", "玷辱", "莫若", "羸弱", "蒟蒻", "葳蕤", "雍容", "芙蓉", "雖敗猶榮", "崢嶸", "囡仔", "頻次", "所費不貲", "帽子", "渣滓", "拼音文字", "龐雜", "譴責", "蟊賊", "袍澤", "盆栽", "攆走", "間奏", "頌讚", "骯髒", "殯葬", "瞵視昂藏", "脾臟", "餽贈", "獄卒", "侗族", "嚇阻", "媽祖", "趺坐", "末座", "咧嘴", "判罪", "盲從", "唸唸有詞", "藐不可測", "悱惻", "騙財", "張燈結綵", "買菜", "拈花惹草", "七拼八湊", "尸位素餐", "璀璨", "侷促", "顰蹙", "忙中有錯", "翡翠", "彷徨失措", "鼎邊銼", "憔悴", "薈萃", "軋頭寸", "徇私", "螽斯", "菟絲", "貌似", "万俟", "潑灑", "披薩", "茅塞", "阮囊羞澀", "徑賽", "癟三", "妻離子散", "歐巴桑", "貧僧", "滴粉搓酥", "氯黴素", "餐風露宿", "罌粟", "窸窣", "囉唆", "枷鎖", "硼酸", "掐指一算", "蓬鬆", "嵯峨", "姮娥", "匾額", "怒不可遏", "默哀", "罣礙", "煎熬", "倨傲", "布偶", "惴惴不安", "馬鞍", "滅門血案", "蕞爾", "毛衣", "憑依", "蠻夷", "便宜", "朵頤", "穴診儀", "逼不得已", "還可以", "逶迤", "八一三之役", "裨益", "十八般武藝", "求同存異", "人本主義", "評議", "愜意", "薑母鴨", "佶屈聱牙", "堅壁清野", "肘腋", "扉頁", "兢兢業業", "虎背熊腰", "揶揄", "屹立不搖", "逍遙", "闢謠", "敷藥", "炫耀", "俳優", "煤油", "遨遊", "朋友", "威逼利誘", "哽咽", "妙不可言", "鼻竇炎", "頁岩", "蔓延", "蜿蜒", "赧顏", "柴米油鹽", "瞇眼", "瀲灩", "噪音", "呻吟", "賣淫", "蚯蚓", "簞食瓢飲", "捺印", "羚羊", "徜徉", "飄揚", "豢養", "模樣", "紮營", "泡影", "家破人亡", "咿唔", "南無", "晌午", "窮兵黷武", "狐步舞", "棘皮動物", "井底之蛙", "有把握", "排外", "氛圍", "睽違", "崴嵬", "薔薇", "闌尾", "厥功甚偉", "讖緯", "品味", "每位", "捍衛", "睪丸", "傍晚", "億萬", "駢文", "捫心自問", "魔王", "熙來攘往", "盼望", "痰盂", "賸餘", "茱萸", "瑾瑜", "鰻魚", "眉宇", "梅雨", "片語", "民胞物與", "培育", "沐浴", "馥郁", "譬喻", "痊癒", "畛域", "沽名釣譽", "蓊鬱", "丰姿綽約", "滿月", "攀越", "批閱", "踴躍", "埋怨", "美元", "斷壁殘垣", "狄斯耐樂園", "燎原", "票源", "蠑螈", "派員", "搓湯圓", "偏遠", "遂其所願", "卷雲", "霉運", "平庸", "驍勇", "慢用"];

var inital = '';
var array = '';
var output_2 = [];
var output_16 = [];
var talk_2 = '';
var number = 0;
var i = 1;
var single = [];

i18n.configure({
    locales: ['zh-TW', 'zh-HK'],
    directory: __dirname + '/locales',
    defaultLocale: 'zh-TW',
});

app.middleware((conv) => {

    i18n.setLocale(conv.user.locale);
});


app.intent('預設歡迎語句', (conv) => {
    name = example[parseInt(Math.random() * 1511)];
    name = name.replace(/[\w|]/g, "");
    name = name.replace(/[\ㄦ|\ㄢ|\ㄞ|\ㄚ|\ㄧ|\ㄗ|\ㄓ|\ㄐ|\ㄍ|\ㄉ|\ㄅ|\ㄣ|\ㄟ|\ㄛ|\ㄨ|\ㄘ|\ㄔ|\ㄑ|\ㄎ|\ㄊ|\ㄆ|\ㄤ|\ㄠ|\ㄜ|\ㄩ|\ㄙ|\ㄕ|\ㄒ|\ㄏ|\ㄋ|\ㄇ|\ㄥ|\ㄡ|\ㄝ|\ㄖ|\ㄌ|\ㄈ|\ˇ|\ˋ|\˙|]/g, "");
    name = name.replace(/[A-Za-z]/g, "");
    name = name.replace(/[\○|\；|\．|\！|\：|\『|\』|\。|\、|\（|\）|\──|\，|\「|\？|\」|\~|\ |\~|\`|\!|\@|\#|\$|\%|\^|\&|\*|\(|\)|\-|\_|\+|\=|\||\\|\[|\]|\{|\}|\;|\:|\"|\'|\,|\<|\.|\>|\/|\?]/g, "");
    single = name.split('');
    inital = String(binstring(name, { out: 'bytes' }));
    array = inital.split(',');
    output_2 = [];
    output_16 = [];
    talk_2 = "";

    for (i = 0; i < array.length; i++) {
        output_2.push(parseInt(array[i]).toString(2));
        output_16.push(parseInt(array[i]).toString(16));
        talk_2 = talk_2 + '<say-as interpret-as="characters">' + parseInt(array[i]).toString(2) + '</say-as><break time="0.2s"/>';
    }

    var rowsarray = [];

    for (i = 0; i < array.length; i++) {
        rowsarray.push({ cells: [single[i], output_2[i], output_16[i], array[i]], dividerAfter: false, });
    }


    conv.ask(new SimpleResponse({
        speech: `<speak><p><s>${i18n.__('intro',name)}${talk_2}</s></p></speak>`,
        text: i18n.__('intro_out')
    }));

    conv.ask(new Table({
        title: name,
        columns: [{ header: '文字', align: 'CENTER', }, { header: '二進制', align: 'CENTER', }, { header: '十六進制', align: 'CENTER', }, { header: '十進制', align: 'CENTER', }],
        rows: rowsarray,
    }));

    conv.ask(new Suggestions(example[parseInt(Math.random() * 1511)], example[parseInt(Math.random() * 1511)], i18n.__('explains'), '👋 ' + i18n.__('Bye')));
});

app.intent('翻譯器', (conv, { input }) => {

    input = input.replace(/[\w|]/g, "");
    input = input.replace(/[\ㄦ|\ㄢ|\ㄞ|\ㄚ|\ㄧ|\ㄗ|\ㄓ|\ㄐ|\ㄍ|\ㄉ|\ㄅ|\ㄣ|\ㄟ|\ㄛ|\ㄨ|\ㄘ|\ㄔ|\ㄑ|\ㄎ|\ㄊ|\ㄆ|\ㄤ|\ㄠ|\ㄜ|\ㄩ|\ㄙ|\ㄕ|\ㄒ|\ㄏ|\ㄋ|\ㄇ|\ㄥ|\ㄡ|\ㄝ|\ㄖ|\ㄌ|\ㄈ|\ˇ|\ˋ|\˙|]/g, "");
    input = input.replace(/[\○|\；|\．|\！|\：|\『|\』|\。|\、|\（|\）|\──|\，|\「|\？|\」|\~|\ |\~|\`|\!|\@|\#|\$|\%|\^|\&|\*|\(|\)|\-|\_|\+|\=|\||\\|\[|\]|\{|\}|\;|\:|\"|\'|\,|\<|\.|\>|\/|\?]/g, "");

    if (input.length > 0) {
        single = input.split('');
        inital = String(binstring(input, { out: 'bytes' }));
        array = inital.split(",");
        output_2 = [];
        output_16 = [];
        talk_2 = "";

        for (i = 0; i < array.length; i++) {
            output_2.push(parseInt(array[i]).toString(2));
            output_16.push(parseInt(array[i]).toString(16));
            talk_2 = talk_2 + '<say-as interpret-as="characters">' + parseInt(array[i]).toString(2) + '</say-as><break time="0.2s"/>';
        }

        var rowsarray = [];

        for (i = 0; i < array.length; i++) {
            rowsarray.push({ cells: [single[i], output_2[i], output_16[i], array[i]], dividerAfter: false, });
        }

        conv.ask(new SimpleResponse({
            speech: `<speak><p><s>${i18n.__('translator')}<break time="0.15s"/>${input}</s><s>${i18n.__('binary')}${talk_2}</s></p></speak>`,
            text: '翻譯完成!'
        }));

        conv.ask(new Table({
            title: input,
            columns: [{ header: '文字', align: 'CENTER', }, { header: '二進制', align: 'CENTER', }, { header: '十六進制', align: 'CENTER', }, { header: '十進制', align: 'CENTER', }],
            rows: rowsarray,
        }));
    } else {
        const hasWebBrowser = conv.surface.capabilities.has('actions.capability.WEB_BROWSER');
        conv.ask(new SimpleResponse({
            speech: `<speak><p><s>我無法翻譯你輸入的詞彙</s><s>請換一個試試看。</s></p></speak>`,
            text: "翻譯發生錯誤!"
        }));
        if (hasWebBrowser) {
            conv.ask(new Image({ url: 'https://github.com/hank199599/Google-Assistant-APP/blob/master/%E8%87%BA%E7%81%A3%E5%9C%8B%E8%AA%9E%E8%BE%AD%E5%85%B8/assets/RrqFkIp.png?raw=true', alt: 'Pictures', }));
        } else {
            conv.ask(new BasicCard({
                title: '查詢不到你輸入的詞彙',
                image: new Image({ url: 'https://github.com/hank199599/Google-Assistant-APP/blob/master/%E8%87%BA%E7%81%A3%E5%9C%8B%E8%AA%9E%E8%BE%AD%E5%85%B8/assets/RrqFkIp.png?raw=true', alt: 'Pictures', }),
            }));
        }
    }
    conv.ask(new Suggestions(example[parseInt(Math.random() * 1511)], example[parseInt(Math.random() * 1511)], i18n.__('explains'), '👋 ' + i18n.__('Bye')));
});

app.intent('二進制', (conv) => {
    conv.ask(new SimpleResponse({
        speech: `<speak><p><s>${i18n.__('binary_intro')}</s></p></speak>`,
        text: '說明如下!'
    }));

    conv.ask(new BasicCard({
        title: '二進制(Binary)',
        subtitle: i18n.__('binary_subtitle'),
        buttons: new Button({ title: '維基百科:二進制', url: 'https://zh.wikipedia.org/zh-tw/%E4%BA%8C%E8%BF%9B%E5%88%B6', }),
    }));
    conv.ask(new Suggestions(example[parseInt(Math.random() * 1511)], example[parseInt(Math.random() * 1511)], example[parseInt(Math.random() * 1511)], example[parseInt(Math.random() * 1511)], '👋 ' + i18n.__('Bye')));

});


app.intent('結束對話', (conv) => {
    conv.ask(new SimpleResponse({ speech: i18n.__('EndTalk'), text: i18n.__('EndTalk') + ' 👋', }));
    conv.close(new BasicCard({
        title: i18n.__('EndTitle'),
        text: i18n.__('EndText'),
        buttons: new Button({ title: i18n.__('EndButton'), url: 'https://assistant.google.com/services/a/uid/000000974738914a', }),
    }));

});
exports.Binary_translator = functions.https.onRequest(app);