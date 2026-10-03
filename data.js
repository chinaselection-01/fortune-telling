/* ============================================================
 * 命理数据层（纯数据，供 app.js 使用）
 * 说明：干支/农历/节气换算由 lib/lunar.js 提供；
 *       五行、十神、藏干、纳音等标准对照表在此自维护，
 *       以保证纯前端、无后端、可离线运行。
 * 内容仅供传统文化娱乐参考，不代表任何科学结论。
 * ============================================================ */

/* ---------- 基础天干地支 ---------- */
const GAN = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
const ZHI = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

// 天干五行（甲乙木 丙丁火 戊己土 庚辛金 壬癸水）
const GAN_WX = { 甲: '木', 乙: '木', 丙: '火', 丁: '火', 戊: '土', 己: '土', 庚: '金', 辛: '金', 壬: '水', 癸: '水' };
// 天干阴阳（奇数位阳，偶数位阴）
const GAN_YIN = { 甲: '阳', 乙: '阴', 丙: '阳', 丁: '阴', 戊: '阳', 己: '阴', 庚: '阳', 辛: '阴', 壬: '阳', 癸: '阴' };

// 地支五行
const ZHI_WX = { 子: '水', 丑: '土', 寅: '木', 卯: '木', 辰: '土', 巳: '火', 午: '火', 未: '土', 申: '金', 酉: '金', 戌: '土', 亥: '水' };

/* 五行相生顺序（用于日主强弱：a 生 b） */
const WX_ORDER = ['木', '火', '土', '金', '水'];
function isSheng(a, b) { return WX_ORDER[(WX_ORDER.indexOf(a) + 1) % 5] === b; }
// 地支生肖
const ZHI_SX = { 子: '鼠', 丑: '牛', 寅: '虎', 卯: '兔', 辰: '龙', 巳: '蛇', 午: '马', 未: '羊', 申: '猴', 酉: '鸡', 戌: '狗', 亥: '猪' };

/* ---------- 纳音 六十甲子（顺序：甲子=0） ---------- */
const NAYIN = [
  '海中金', '海中金', '炉中火', '炉中火', '大林木', '大林木', '路旁土', '路旁土', '剑锋金', '剑锋金',
  '山头火', '山头火', '涧下水', '涧下水', '城头土', '城头土', '白蜡金', '白蜡金', '杨柳木', '杨柳木',
  '泉中水', '泉中水', '屋上土', '屋上土', '霹雳火', '霹雳火', '松柏木', '松柏木', '长流水', '长流水',
  '沙中金', '沙中金', '山下火', '山下火', '平地木', '平地木', '壁上土', '壁上土', '金箔金', '金箔金',
  '覆灯火', '覆灯火', '天河水', '天河水', '大驿土', '大驿土', '钗钏金', '钗钏金', '桑柘木', '桑柘木',
  '大溪水', '大溪水', '沙中土', '沙中土', '天上火', '天上火', '石榴木', '石榴木', '大海水', '大海水'
];

/* ---------- 地支藏干（本气/中气/余气） ---------- */
const ZHI_HIDE = {
  子: ['癸'],
  丑: ['己', '癸', '辛'],
  寅: ['甲', '丙', '戊'],
  卯: ['乙'],
  辰: ['戊', '乙', '癸'],
  巳: ['丙', '戊', '庚'],
  午: ['丁', '己'],
  未: ['己', '丁', '乙'],
  申: ['庚', '壬', '戊'],
  酉: ['辛'],
  戌: ['戊', '辛', '丁'],
  亥: ['壬', '甲']
};

/* ---------- 十神：以日干为“我”，对另一天干的关系 ---------- */
// 关系表：键 = 日干+他干，值 = 十神
function shiShen(dayGan, otherGan) {
  if (dayGan === otherGan) return '比肩';
  const de = GAN_WX[dayGan], oe = GAN_WX[otherGan];
  const dy = GAN_YIN[dayGan], oy = GAN_YIN[otherGan];
  const sameYin = (dy === oy);
  // 我克（财）
  if ((de === '木' && oe === '土') || (de === '火' && oe === '金') || (de === '土' && oe === '水') || (de === '金' && oe === '火') || (de === '水' && oe === '木')) {
    return sameYin ? '偏财' : '正财';
  }
  // 克我（官）
  if ((oe === '木' && de === '土') || (oe === '火' && de === '金') || (oe === '土' && de === '水') || (oe === '金' && de === '木') || (oe === '水' && de === '火')) {
    return sameYin ? '七杀' : '正官';
  }
  // 我生（食伤）
  if ((de === '木' && oe === '火') || (de === '火' && oe === '土') || (de === '土' && oe === '金') || (de === '金' && oe === '水') || (de === '水' && oe === '木')) {
    return sameYin ? '食神' : '伤官';
  }
  // 生我（印）
  if ((oe === '木' && de === '火') || (oe === '火' && de === '土') || (oe === '土' && de === '金') || (oe === '金' && de === '水') || (oe === '水' && de === '木')) {
    return sameYin ? '偏印' : '正印';
  }
  // 同五行不同干（劫财/比肩 已在首判断，这里补“劫财”）
  return sameYin ? '比肩' : '劫财';
}

/* ---------- 称骨算命（袁天罡） ----------
 * 单位：两（1两 = 10钱）
 * 年柱重量按干支（60甲子顺序，甲子=0）
 */
const CHENGGU_YEAR = [
  1.2, 0.9, 0.6, 0.7, 0.9, 0.5, 0.9, 0.8, 0.7, 0.8, // 甲子..癸酉
  0.9, 0.6, 1.6, 0.8, 0.8, 0.7, 0.9, 0.6, 0.8, 0.7, // 甲戌..癸未
  0.7, 0.9, 0.6, 0.7, 0.9, 0.7, 0.9, 0.8, 0.7, 0.8, // 甲申..癸巳
  1.8, 0.6, 0.5, 1.4, 0.9, 0.9, 0.7, 0.8, 0.9, 0.8, // 甲午..癸卯
  0.8, 0.7, 1.3, 0.5, 1.4, 0.9, 0.9, 0.7, 0.7, 0.7, // 甲辰..癸丑
  1.2, 0.8, 0.8, 0.6, 1.9, 0.6, 0.8, 0.8, 1.0, 0.7  // 甲寅..癸亥
];
// 农历月（正月=1 ... 腊月=12）
const CHENGGU_MONTH = { 1: 0.6, 2: 0.7, 3: 1.8, 4: 0.9, 5: 0.5, 6: 1.6, 7: 0.7, 8: 1.5, 9: 1.8, 10: 0.8, 11: 0.9, 12: 0.5 };
// 农历日（初一=1 ... 三十=30）
const CHENGGU_DAY = {
  1: 0.5, 2: 1.0, 3: 0.8, 4: 1.5, 5: 1.6, 6: 1.0, 7: 0.9, 8: 1.6, 9: 0.8, 10: 1.6,
  11: 0.9, 12: 1.7, 13: 0.8, 14: 1.7, 15: 1.0, 16: 0.8, 17: 0.9, 18: 1.8, 19: 0.5, 20: 1.5,
  21: 1.0, 22: 0.9, 23: 0.8, 24: 0.9, 25: 1.5, 26: 1.8, 27: 0.7, 28: 0.8, 29: 1.6, 30: 0.6
};
// 时辰（子=1 ... 亥=12，顺序与 ZHI 对应：子丑寅卯辰巳午未申酉戌亥）
const CHENGGU_HOUR = { 子: 1.6, 丑: 0.6, 寅: 0.7, 卯: 1.0, 辰: 0.9, 巳: 1.6, 午: 1.0, 未: 0.8, 申: 0.8, 酉: 0.9, 戌: 0.6, 亥: 0.6 };

// 称骨歌（总重 单位两，key 为保留1位小数后的字符串）
const CHENGGU_SONG = {
  '2.1': '短命非业谓大空，平生灾难事重重；凶祸频临陷逆境，终世困苦事不成。',
  '2.2': '身寒骨冷苦伶仃，此命推来行乞人；劳劳碌碌无度日，终年打拱过平生。',
  '2.3': '此命推来骨格轻，求谋作事事难成；妻儿兄弟应难许，别处他乡作散人。',
  '2.4': '此命推来福禄无，门庭困苦总难荣；六亲骨肉皆无靠，流到他乡作老翁。',
  '2.5': '此命推来祖业微，门庭营度似稀奇；六亲骨肉如冰炭，一世勤劳自把持。',
  '2.6': '平生衣禄苦中求，独自营谋事不休；离祖出门宜早计，晚来衣禄庶无忧。',
  '2.7': '一生作事少商量，难靠祖宗作主张；独马单枪空做去，早年晚岁总无长。',
  '2.8': '一生行事似飘蓬，祖宗产业在梦中；若不过房并改姓，也当移徒二三通。',
  '2.9': '初年运限未曾亨，纵有功名在后成；须过四旬才可立，移居改姓始为良。',
  '3.0': '劳劳碌碌苦中求，东奔西走何日休；若系只身孤且寡，不须劳碌事有周。',
  '3.1': '忙忙碌碌苦中求，何日云开见日头；难得祖基家可立，中年衣禄渐无忧。',
  '3.2': '初年运蹇事难谋，渐有财源如水流；到得中年衣食旺，那时名利一齐收。',
  '3.3': '早年做事事难成，百计徒劳枉费心；半世自如流水去，后来运到得黄金。',
  '3.4': '此命福气果如何，僧道门中衣禄多；离祖出家方为妙，朝钟暮鼓拜弥陀。',
  '3.5': '生平福量不周全，祖业根基觉少传；营事生涯宜保守，时来衣食胜从前。',
  '3.6': '不须劳碌过平生，独自成家福不轻；早有福星常照命，任君行去百般成。',
  '3.7': '此命般般事不成，弟兄少力自孤行；纵然祖业须微有，来得明时去不明。',
  '3.8': '一生骨肉最清高，早入科门姓氏标；待到年将三十六，蓝衣脱去换红袍。',
  '3.9': '此命终身运不通，劳劳作事尽皆空；苦心竭力成家计，到得那时在梦中。',
  '4.0': '平生衣禄是绵长，件件心中自主张；前面风霜多受过，后来必定享安康。',
  '4.1': '此命推来事不同，为人能干异凡庸；中年还有逍遥福，不比前时运未通。',
  '4.2': '得宽怀处且宽怀，何用双眉皱不开；若使中年命运济，那时名利一齐来。',
  '4.3': '为人心性最聪明，作事轩昂近贵人；衣禄一生天注定，不须劳碌是丰亨。',
  '4.4': '来事由天莫苦求，须知福禄赖心修；当年财帛难如意，晚景欣然便不忧。',
  '4.5': '名利推来竟若何，前番辛苦后奔波；命中难养男和女，骨肉扶持也不多。',
  '4.6': '东西南北尽皆通，出入安然志气雄；早有福星相照命，任君行去百般隆。',
  '4.7': '此命推来旺末年，妻荣子贵自怡然；平生原有滔滔福，可卜财源若水泉。',
  '4.8': '初年运道未曾通，几许蹉跎命亦穷；兄弟六亲无依靠，一生事业晚来隆。',
  '4.9': '此命推来福不轻，自成自立显门庭；从来富贵人钦敬，使婢差奴过一生。',
  '5.0': '为利为名终日劳，中年福禄也多遭；老来自有财星照，不比前番目下高。',
  '5.1': '一世荣华事事通，不须劳碌自亨通；兄弟叔侄皆如意，家业成时福禄宏。',
  '5.2': '一世亨通事事能，不须劳苦自然宁；宗族有光欣喜甚，家产丰盈自称心。',
  '5.3': '此格推来福泽宏，兴家立业在其中；一生衣禄安排定，却是人间一福翁。',
  '5.4': '此命推来厚且清，诗书满腹看功成；丰衣足食自然稳，正是人间有福人。',
  '5.5': '策马扬鞭争利名，少年作事费筹论；一朝福禄源源至，富贵荣华显六亲。',
  '5.6': '此命推来礼仪通，一生福禄用无穷；甜酸苦辣皆尝过，滚滚财源稳且丰。',
  '5.7': '福禄丰盈万事全，一世荣华显子孙；名扬威震人争羡，位列朝班近贵尊。',
  '5.8': '平生衣食自然来，名利双全富贵偕；金玉满堂人口旺，荣华得意外人财。',
  '5.9': '细推此命福非轻，富贵文章极贵荣；锦绣珠帘终有分，威权显赫门庭盛。',
  '6.0': '一生衣禄喜绵绵，件件心中自主张；前面风霜多受过，后来必定享安然。',
  '6.1': '不做朝中金榜客，定为世上大财翁；聪明天赋经书熟，名显高科自是荣。',
  '6.2': '此命生来福不穷，读书必定显亲宗；紫衣金带为卿相，富贵荣华孰与同。',
  '6.3': '命主为官福禄长，得来富贵实非常；名题雁塔传金榜，大显门庭天下扬。',
  '6.4': '此格威权不可当，兵权柄印在朝堂；朝野钦仰承恩宠，富贵荣华福寿康。',
  '6.5': '此命推来福不轻，诗书文墨称人心；丰衣足食多安稳，正是人间有福人。',
  '6.6': '时来风送滕王阁，运至何愁不升迁；富贵荣华终有分，功名成就耀门闾。',
  '6.7': '此命生来福自宏，田园家业最高隆；平生衣禄盈丰足，一世荣华万事通。',
  '6.8': '富贵由天莫苦求，万金家计不须谋；十年之后皆如意，富贵荣华步玉楼。',
  '6.9': '君乃人间衣禄星，一生富贵众人钦；总然福禄由天定，安享荣华过一生。',
  '7.0': '此命推来福不轻，不须愁虑苦劳心；一生天定衣禄好，富贵荣华称俊英。',
  '7.1': '此命生成大不同，公侯卿相在其中；一生自有逍遥福，富贵荣华极品隆。',
  '7.2': '此命推来天下隆，文章星宿显威风；荣华富贵人间少，积玉堆金又有名。'
};

/* ---------- 小六壬（李淳风六壬掌） ---------- */
// 六神顺序：大安、留连、速喜、赤口、小吉、空亡
const XLRC = [
  { name: '大安', s: '吉', desc: '大安事事昌，求谋兴中良；婚姻官事吉，疾病得安康。失物去不远，宅舍保平安；行人身未动，病者主无妨。', detail: '百事平安，宜静守。谋事成，求财有，婚姻合，出行不失。' },
  { name: '留连', s: '凶', desc: '留连事难成，求谋日未明；官事只宜缓，去者未回程。失物南方见，急讨方称心；更宜防口舌，人口且平平。', detail: '办事拖延，宜缓。婚姻未合，出行有阻，病者反复，失物难寻。' },
  { name: '速喜', s: '吉', desc: '速喜喜来临，求财向南行；失物申未午，逢人路上寻。官事有福德，病者无祸侵；田宅六畜吉，行人有信音。', detail: '喜事将至，快速有成。求财南方，婚姻可成，行人将至。' },
  { name: '赤口', s: '凶', desc: '赤口主口舌，官非切要防；失物速速讨，行人有惊慌。六畜多作怪，病者出西方；更须防诅咒，诚恐染瘟皇。', detail: '口舌官非，宜防争吵。出行不利，病防凶，失物在南方。' },
  { name: '小吉', s: '吉', desc: '小吉最吉昌，路上好商量；阴人来报喜，失物在坤方。行人即便至，交关甚是强；凡事皆和合，病者祈福祥。', detail: '和合吉利，诸事可成。婚姻合，求财有，行人至，失物可寻。' },
  { name: '空亡', s: '凶', desc: '空亡事不长，阴人多乖张；求财无利益，行人有灾殃。失物寻不见，官事有刑伤；病人逢暗鬼，禳解保安康。', detail: '落空无成，谋事难就。宜守不宜进，病者凶，失物难回。' }
];

/* ---------- 数字能量（八星） ----------
 * 两组数字组合 -> 星
 */
const NUM_STAR = {
  '13': '天医', '31': '天医', '68': '天医', '86': '天医',
  '19': '延年', '91': '延年', '78': '延年', '87': '延年',
  '14': '生气', '41': '生气', '67': '生气', '76': '生气',
  '11': '伏位', '22': '伏位', '33': '伏位', '44': '伏位', '66': '伏位', '77': '伏位', '88': '伏位', '99': '伏位',
  '17': '祸害', '71': '祸害', '89': '祸害', '98': '祸害',
  '16': '六煞', '61': '六煞', '47': '六煞', '74': '六煞',
  '18': '五鬼', '81': '五鬼', '79': '五鬼', '97': '五鬼',
  '12': '绝命', '21': '绝命', '69': '绝命', '96': '绝命'
};
const NUM_STAR_INFO = {
  '天医': { lv: '吉', meaning: '财运、正财、婚姻、贵人。代表聪明善良，易得财富与良缘。', tip: '天医数组越多，正财婚姻运越强。' },
  '延年': { lv: '吉', meaning: '事业、领导力、责任心、健康。代表有主见、能扛事。', tip: '延年利事业与健康，但压力偏大。' },
  '生气': { lv: '吉', meaning: '贵人、乐观、人缘、化解困境。代表逢凶化吉。', tip: '生气主贵人运，遇事有人帮。' },
  '伏位': { lv: '平', meaning: '平稳、守成、等待。代表延续与潜伏，蓄势待发。', tip: '伏位宜守不宜攻，蓄力待时。' },
  '祸害': { lv: '凶', meaning: '口舌、是非、体弱、付出多回报少。代表言语招祸。', tip: '祸害主口舌病灾，注意沟通与咽喉。' },
  '六煞': { lv: '凶', meaning: '情感纠葛、人际关系烦、偏桃花。代表多思多虑。', tip: '六煞主感情烦恼与人际是非。' },
  '五鬼': { lv: '凶', meaning: '变动、反复、暗疾、心血方面。代表不稳定与灵感。', tip: '五鬼主变动与暗疾，注意心脑血。' },
  '绝命': { lv: '凶', meaning: '大起大落、冲动、破财、肾与膀胱。代表极端与冒险。', tip: '绝命主大破大立，慎用冲动决策。' }
};

/* ---------- 生肖五行配对（简表，供生肖纳音查询） ---------- */
// 生肖宜忌配对（三合/六冲，简要）
const SX_LIUHE = { 鼠: '牛', 牛: '鼠', 虎: '猪', 猪: '虎', 兔: '狗', 狗: '兔', 龙: '鸡', 鸡: '龙', 蛇: '猴', 猴: '蛇', 马: '羊', 羊: '马' };
const SX_CHONG = { 鼠: '马', 牛: '羊', 虎: '猴', 兔: '鸡', 龙: '狗', 蛇: '猪', 马: '鼠', 羊: '牛', 猴: '虎', 鸡: '兔', 狗: '龙', 猪: '蛇' };

/* ---------- 小六壬 英文（与 XLRC 顺序对应） ---------- */
const XLRC_EN = {
  '大安': { name: 'Great Peace', desc: 'Great Peace: all affairs prosper; marriage and lawsuits auspicious; illness heals. Lost items nearby; home safe.', detail: 'Everything settles well. Plans succeed, wealth comes, marriage matches, travel safe.' },
  '留连': { name: 'Lingering', desc: 'Lingering: matters hard to complete; lawsuits should wait; lost items far. Beware gossip; household unsettled.', detail: 'Delays and drag. Marriage unmatched, travel blocked, illness lingers, lost things hard to find.' },
  '速喜': { name: 'Swift Joy', desc: 'Swift Joy: good news approaches; seek wealth to the south; lost items found; lawsuits blessed; illness safe.', detail: 'Joy comes quickly with success. Wealth to the south, marriage forms, traveler arrives.' },
  '赤口': { name: 'Red Mouth', desc: 'Red Mouth: quarrels and lawsuits to guard; lost items retrieved fast; traveler alarmed. Beware curses and illness.', detail: 'Quarrels and legal risk; avoid arguments. Travel unfavorable, illness risky, lost items to the south.' },
  '小吉': { name: 'Small Luck', desc: 'Small Luck: most auspicious; easy counsel on the road; a woman brings good news; all things harmonize.', detail: 'Harmony and success. Marriage matches, wealth appears, traveler arrives, lost items found.' },
  '空亡': { name: 'Emptiness', desc: 'Emptiness: matters come to nothing; strangers err; wealth no gain; traveler in trouble; illness meets dark spirits.', detail: 'Fizzles out, plans fail. Hold, do not advance; illness inauspicious, lost things unrecoverable.' }
};

/* ---------- 数字能量 八星 英文含义（与 NUM_STAR_INFO 对应） ---------- */
const NUM_STAR_EN = {
  '天医': 'Wealth, rightful money, marriage, noble help. Kind and able, easy to gain wealth and good union.',
  '延年': 'Career, leadership, responsibility, health. Strong-willed and dependable, but pressure runs high.',
  '生气': 'Noble help, optimism, popularity, gets through trouble. Turns bad luck into good.',
  '伏位': 'Stable, hold and wait. Continuation and latent power; gather strength for the right time.',
  '祸害': 'Gossip, disputes, weak health, much effort little return. Words bring trouble; mind throat.',
  '六煞': 'Emotional entanglements, social annoyance, peach-blossom trouble. Overthinking and worry.',
  '五鬼': 'Change, reversal, hidden illness, heart/blood issues. Unstable yet inspired.',
  '绝命': 'Extreme ups and downs, impulse, lost wealth, kidney/bladder. Radical and risky; decide with care.'
};

/* ---------- 称骨歌 英文分级梗概（按重量区间，不逐签直译） ---------- */
function chenguEn(key) {
  const w = parseFloat(key);
  if (w < 3.0) return 'Heavy hardship: many setbacks in life; self-reliance and endurance are needed.';
  if (w < 4.0) return 'Early hardship, later ease: fortune turns after middle age with effort.';
  if (w < 5.0) return 'Moderate fate: build steadily by your own hands; peace in later years.';
  if (w < 6.0) return 'Prosperous: wealth and rank come; family and fortune flourish.';
  if (w < 7.0) return 'Very prosperous: riches and honour, widely admired and supported.';
  return 'Extremely prosperous: the highest fortune, near the peak of wealth and rank.';
}

/* ---------- 地支关系（冲/合/害/刑） ---------- */
const ZHI_CHONG = { 子: '午', 丑: '未', 寅: '申', 卯: '酉', 辰: '戌', 巳: '亥', 午: '子', 未: '丑', 申: '寅', 酉: '卯', 戌: '辰', 亥: '巳' };
const ZHI_HE = { 子: '丑', 丑: '子', 寅: '亥', 卯: '戌', 辰: '酉', 巳: '申', 午: '未', 未: '午', 申: '巳', 酉: '辰', 戌: '卯', 亥: '寅' };
const ZHI_HAI = { 子: '未', 丑: '午', 寅: '巳', 卯: '辰', 辰: '卯', 巳: '寅', 午: '丑', 未: '子', 申: '亥', 酉: '戌', 戌: '酉', 亥: '申' };
// 三刑（简化：无礼之刑 子卯；恃势 寅巳申；无恩 丑戌未）
const ZHI_XING = {
  '子卯': '刑', '卯子': '刑',
  '寅巳': '刑', '巳寅': '刑', '巳申': '刑', '申巳': '刑', '寅申': '刑', '申寅': '刑',
  '丑戌': '刑', '戌丑': '刑', '丑未': '刑', '未丑': '刑', '戌未': '刑', '未戌': '刑'
};
/* 返回 a 对 b 的关系：冲/合/害/刑/同/空 */
function zhiRelation(a, b) {
  if (a === b) return '同';
  if (ZHI_CHONG[a] === b) return '冲';
  if (ZHI_HE[a] === b) return '合';
  if (ZHI_HAI[a] === b) return '害';
  if (ZHI_XING[a + b]) return '刑';
  return '';
}

/* 流年关系英文/中文短句模板 */
const LIUNIAN_NOTE = {
  zh: {
    '冲': '地支相冲，主变动、奔波，宜稳不宜冒进。',
    '合': '地支相合，主贵人、机遇，合作易成。',
    '害': '地支相害，防小人、口舌与暗耗。',
    '刑': '地支相刑，谨防是非、官非与内心纠结。',
    '同': '地支比同，气场共振，宜守成发力。',
    '': '地支无特殊冲合，流年相对平顺。'
  },
  en: {
    '冲': 'Branch Clash: change and travel; stay steady, avoid rash moves.',
    '合': 'Branch Harmony: noble help and opportunity; teamwork succeeds.',
    '害': 'Branch Harm: guard against petty people, gossip and hidden loss.',
    '刑': 'Branch Punishment: beware disputes, legal trouble and inner conflict.',
    '同': 'Branch Same: resonant energy; hold ground and push forward.',
    '': 'No special branch relation; the year is relatively smooth.'
  }
};

/* ---------- 流年·十神白话解读（会员深度解析用，双语） ----------
 * 以日主为“我”，讲清楚当年天干十神代表什么、要注意什么。
 */
const SHISHEN_YEAR = {
  '比肩': {
    zh: '今年天干与您日主同气（比肩），主同辈、朋友、合作。易得朋友帮衬，但也容易因分利生竞争。注意：账目与分工先讲清楚，合作尽量立字据，别因人情糊涂账。',
    en: 'This year the stem matches your Day Master (Friend): peers, friends, cooperation. Friends help, yet profit-sharing can breed rivalry. Watch: keep accounts and roles clear, put deals in writing, don’t let favors blur the books.'
  },
  '劫财': {
    zh: '今年劫财，人际交往多、花钱处也多，易为朋友或面子破小财。注意：借钱、合伙、担保要三思，别为场面伤了钱袋子。',
    en: 'Robbing Friend year: more socializing and more spending; easy to lose small money over friends or face. Watch: think twice before lending, partnering or guaranteeing; don’t spend for show.'
  },
  '食神': {
    zh: '今年食神，利才艺、表达、享受与放松，心情好、点子多，适合学新技能或培养爱好。注意：别太放纵吃喝玩乐，适度才养运。',
    en: 'Eating God year: good for talent, expression, enjoyment and rest — cheerful mood, flowing ideas; a fine time to learn or pick up hobbies. Watch: don’t overindulge; moderation keeps the luck.'
  },
  '伤官': {
    zh: '今年伤官，才华外露、敢想敢说，利创新突破，但也易言语冲撞、和上级或规矩较劲。注意：管住嘴、留三分余地，别因一时痛快得罪关键人。',
    en: 'Hurting Officer year: talent shows, bold to speak — good for innovation, yet prone to sharp words and clashes with authority. Watch: mind your tongue, leave room, don’t offend key people for a moment’s thrill.'
  },
  '正财': {
    zh: '今年正财，正行收入、工资、踏实攒钱运佳，钱来得名正言顺。注意：量入为出、稳扎稳打；投机偏财宜收手，别贪快钱。',
    en: 'Direct Wealth year: steady income, wages and honest saving go well, money earned fair and square. Watch: live within means and build steadily; ease off speculation, don’t chase fast money.'
  },
  '偏财': {
    zh: '今年偏财，有意外之财、投资或副业机会，来去都快、波动大。注意：见好就收、勿All-in，特别防因贪心把赚到的又吐回去。',
    en: 'Indirect Wealth year: unexpected gains, investment or side-income chances — fast in and out, volatile. Watch: take profit when you have it, don’t go all-in, especially guard against greed giving it back.'
  },
  '正官': {
    zh: '今年正官，事业、名望、规矩运强，利升职、立信、走正道，也容易接更多责任。注意：压力随之而来，别把自己逼太紧，学会分派。',
    en: 'Direct Officer year: career, reputation and rules strengthen — good for promotion, trust and the right path, but more duty comes too. Watch: pressure rises, don’t over-pressure yourself, learn to delegate.'
  },
  '七杀': {
    zh: '今年七杀，挑战与机遇并存，利突破、担当、开拓新局，但竞争与压力陡增。注意：做好风控、莫硬扛，借贵人/团队之力化煞，别孤军蛮干。',
    en: 'Seven Killings year: challenge and chance together — good for breakthroughs and new ground, yet competition and pressure spike. Watch: manage risk, don’t shoulder alone, use noble help or the team to soften it, no lone recklessness.'
  },
  '正印': {
    zh: '今年正印，学习、贵人、庇护运旺，利考试、进修、得长辈或上级提携。注意：宜沉淀积累、少折腾，别把好运用来瞎换赛道。',
    en: 'Direct Seal year: study, noble support and protection flourish — good for exams, further learning and backing from elders/superiors. Watch: accumulate and avoid restless moves; don’t waste good luck hopping tracks.'
  },
  '偏印': {
    zh: '今年偏印，利钻研、冷门技能与独立思考，但易孤僻、多思少动。注意：别钻牛角尖，适当走出去与人交流，想得多也要落行动。',
    en: 'Indirect Seal year: good for deep study, niche skills and independent thinking, yet prone to isolation and overthinking. Watch: don’t get stuck; step out and talk to people; pair thought with action.'
  }
};

/* ---------- 小六壬·六神白话解读（会员深度解析用，双语） ----------
 * 把卦象翻译成大白话，并说明要注意什么。
 */
const XLRC_INTERP = {
  '大安': {
    zh: '白话：整体平顺安稳，像风平浪静的一塘水。谋事多能成，宜守成、稳着来，身体也平安。注意：太求安稳可能错失眼前机会；该出手时也要出手，别把“稳”变成“拖”。',
    en: 'Plain: overall calm and safe, like still water. Plans tend to succeed; hold and proceed steadily, health is fine too. Watch: being too cautious may miss the chance in front of you; strike when you should, don’t let “steady” turn into “stalled”.'
  },
  '留连': {
    zh: '白话：事情卡住、拖延，一时难成，像车轮陷在泥里。宜缓、宜等、宜静。注意：别反复横跳、越拖越乱；定下心来给时间，别今天一个主意明天又一个。',
    en: 'Plain: matters stall and drag, hard to finish for now, like a wheel in mud. Wait, slow down, stay still. Watch: don’t zig-zag and make it messier; settle and give it time, no new idea every day.'
  },
  '速喜': {
    zh: '白话：喜事将近、好消息来得快，向南或主动联络更有利。注意：别高兴太早、冲动答应太快；好事要快确认、快落地，别拖凉了。',
    en: 'Plain: good news comes soon, fast; reaching south or initiating contact helps. Watch: don’t agree on impulse from excitement; confirm and act quickly, don’t let the good turn cold.'
  },
  '赤口': {
    zh: '白话：口舌是非当头，易争吵、遇官非或被人误解。注意：今天少说话多做事，合同文件看清楚再签，绝不主动起争执；出门也防小磕碰。',
    en: 'Plain: quarrels and disputes loom; easy to argue, meet legal trouble or be misunderstood. Watch: talk less, do more today; read contracts before signing, never start a fight; also mind small bumps when out.'
  },
  '小吉': {
    zh: '白话：小顺利、人和，小事能成，像阴天里透出一点光。注意：只能办“小”事，大事仍要谨慎；别把小顺当大胜，也别因为顺就放松风险。',
    en: 'Plain: small luck and harmony; minor things work, like light through clouds. Watch: only small matters; stay careful with big ones; don’t treat small luck as a big win, nor drop your guard.'
  },
  '空亡': {
    zh: '白话：落空、虚浮，谋事多难成，像竹篮打水。注意：今天别投入太多（钱、感情、精力），不宜做重大决定或签字；已有的事放缓，防一场空。',
    en: 'Plain: fizzles out, hollow; plans mostly fail, like drawing water with a bamboo basket. Watch: don’t invest much today (money, feeling, energy); avoid big decisions or signing; slow existing matters, guard against coming up empty.'
  }
};

/* ---------- 风水故事（双语，用于引流/阅读） ---------- */
const FENGSHUI_STORIES = [
  {
    zh: { title: '门对门，谁先富', body: '老街两户人家门对门。东家信风水，把门槛垫高三分，说“水压一头，财不外流”；西家笑他迷信。十年后东家做小买卖发了财，西家却屡遭磕碰。风水先生路过一笑：“门垫三分是借口，真正压人的，是东家天天早起扫门前的那股勤。”' },
    en: { title: 'Door to Door, Who Prospers First', body: 'Two houses on an old street faced each other. The east family believed in feng shui and raised their threshold three fen, saying “hold the head high, keep wealth in.” The west family laughed. Ten years on, the east family’s small business thrived while the west kept stumbling. A feng shui master passed by and smiled: “The threshold was an excuse; what truly pressed down was the east family’s habit of sweeping the doorstep at dawn — diligence.”' }
  },
  {
    zh: { title: '镜子不对床', body: '老辈人常说“镜子不对床，夜半不心慌”。有人嫌麻烦，把大镜正对睡床，结果总睡不踏实、梦多易惊。后来把镜子转了向、用布遮了，竟一夜安睡。是镜子有灵，还是心安则眠？风水之学，多半先安的是人心。' },
    en: { title: 'No Mirror Facing the Bed', body: 'Elders say “a mirror must not face the bed, or the heart races at midnight.” One person, finding it troublesome, set a large mirror opposite the bed and slept fitfully with many dreams. After turning the mirror away and covering it, they slept through the night. Is the mirror spirit, or does calm come from a calm mind? Feng shui, more often than not, soothes the heart first.' }
  },
  {
    zh: { title: '明堂容万马', body: '老宅前有片空地，称作“明堂”。明堂开阔，人便觉得胸襟也开阔，客人来了也舒服。后来空地被堆满杂物，家里人气也淡了。不是地气变了，是“留白”没了。居家风水，常是给自己留一处能喘气的空。' },
    en: { title: 'The Bright Court Holds Ten Thousand Horses', body: 'An old home had an open space in front, called the “bright court.” With it open, people felt open-hearted and guests at ease. When the space filled with clutter, the household’s warmth faded. The earth-energy had not changed; the “emptiness” was gone. Home feng shui is often just leaving yourself room to breathe.' }
  },
  {
    zh: { title: '一棵发财树', body: '有人图吉利，在店铺摆了盆“发财树”，天天浇水盼发财，生意却不见起色。隔壁铺子没摆树，却把门口扫得锃亮、对客笑脸相迎，生意红火。树是引子，人是根本——风水招的是“心思”，不是“运气”本身。' },
    en: { title: 'A Money Tree', body: 'Someone placed a “money tree” in the shop for luck, watering it daily and waiting to get rich, yet business stayed flat. The next shop had no tree, but kept its doorstep spotless and greeted customers with a smile — and thrived. The tree is a trigger; the person is the root. Feng shui invites intention, not luck itself.' }
  },
  {
    zh: { title: '水往哪里流', body: '老话讲“水主财”，于是有人把鱼缸、喷泉摆得满屋都是，反倒潮湿阴冷、家人易病。风水先生摇头：“水要活、要净、要摆在明处，不是越多越好。”凡事过犹不及，旺财的从来是“顺势”，不是“堆砌”。' },
    en: { title: 'Where the Water Flows', body: 'An old saying goes “water governs wealth,” so one filled the house with fish tanks and fountains — only to breed damp cold and frequent illness. The master shook his head: “Water must be living, clean and placed in the light, not piled up.” Excess is as bad as lack; what brings fortune is following the flow, not the clutter.' }
  }
];
