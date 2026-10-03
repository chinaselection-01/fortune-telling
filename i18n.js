/* ============================================================
 * 中英双语框架 i18n
 * 用法：带 data-i18n="key" 的元素在切换语言时自动填充文本；
 *      动态内容通过 t(key) 取串，术语通过 tt(zh) 取英文。
 * ============================================================ */
let I18N_LANG = 'zh';

const I18N = {
  zh: {
    site_title: '周易命理阁',
    subtitle: '八字排盘 · 称骨算命 · 小六壬 · 观音灵签 · 数字能量 · 生肖纳音 · 风水故事',
    tab_shengchen: '生辰综合',
    tab_guanyin: '观音灵签',
    tab_num: '数字能量',
    tab_shengxiao: '生肖纳音',
    tab_fengshui: '风水故事',

    sc_title: '生辰测算（公历）',
    sc_hint: '一次输入，同时排出八字、称骨重量、小六壬、大运与流年。',
    lbl_year: '年', lbl_month: '月', lbl_day: '日', lbl_hour: '时', lbl_min: '分', lbl_gender: '性别',
    gender_male: '男', gender_female: '女',
    btn_calc: '开始测算',
    err_fill: '请完整填写年月日。',
    err_date: '日期不存在，请检查。',
    lunar_prefix: '农历',

    sec_bazi: '一、八字排盘',
    sec_chengu: '二、称骨算命（袁天罡）',
    sec_xl: '三、小六壬',
    sec_dayun: '四、大运（十年一步）',
    sec_liunian: '五、流年运势',

    bz_year: '年柱', bz_month: '月柱', bz_day: '日柱', bz_hour: '时柱',
    lbl_daymaster: '日主（命主）',
    lbl_strength: '强弱简评',
    lbl_tongqi: '同气',
    lbl_wuxing: '五行',
    ss_label: '十神',
    hide_label: '藏干',
    nayin_label: '纳音',
    bz_muted: '五行统计按「天干+地支本气」计，仅供娱乐参考；精准强弱须结合地支藏干旺衰与节气。',

    cg_total: '称骨总重量',
    cg_year_row: '年柱', cg_month_row: '月', cg_day_row: '日', cg_hour_row: '时',
    cg_song_label: '称骨歌',

    xl_calc_label: '测算',
    xl_desc_label: '总诀',
    xl_detail_label: '详解',

    dy_forward: '顺排（阳男阴女）',
    dy_reverse: '逆排（阴男阳女）',
    dy_start: '起运',
    dy_step: '第{n}步',
    dy_age: '岁',
    dy_year: '年',
    dy_current: '（现行大运）',
    dy_tengod: '天干十神',
    dy_note: '起运以出生到最近「节」的日数计：三天为一岁。大运顺/逆排由年干阴阳与性别决定。',

    ln_title: '流年运势',
    ln_cur_year: '今年',
    ln_gan: '天干十神',
    ln_zhi: '地支关系',
    ln_note: '天干十神看当年气运，地支关系看与命主日支的冲/合/刑/害。仅供娱乐。',

    gy_title: '观音灵签',
    gy_hint: '心念所求，诚心抽签。',
    gy_btn: '🙏 求签',
    gy_no: '第 {n} 签',
    gy_name_label: '典故',
    gy_jie_label: '解曰',
    gy_verse_label: '签诗',
    gy_muted: '心诚则灵，签文为民间流传，仅供娱乐参考。',

    num_title: '数字能量 · 手机号吉凶',
    num_hint: '输入手机号，按相邻两位组合（八星）解读。',
    num_btn: '测算',
    num_label: '号码',
    num_verdict: '整体趋势',
    num_pr: '数组', num_star: '星', num_mean: '含义',
    num_muted: '数字能量学为民俗说法，仅供娱乐，不构成任何建议。',

    sx_title: '生肖纳音查询',
    sx_hint: '输入出生年份，查生肖、五行与纳音（以立春为界）。',
    sx_btn: '查询',
    sx_year: '年',
    sx_zodiac: '生肖',
    sx_gzwx: '年干支五行',
    sx_nayin: '纳音五行',
    sx_liuhe: '六合贵人',
    sx_chong: '六冲',
    sx_muted: '生肖以农历立春为界；纳音按六十甲子循环，同一生肖每 60 年纳音不同。',

    fs_title: '风水故事 · 民俗拾遗',
    fs_hint: '闲读几则传统风水小故事，茶余饭后，权作消遣与思考。',
    fs_cta1: '想看自己的八字命盘？',
    fs_cta2: '查查你的生肖纳音？',
    fs_cta3: '摇一签观音灵签？',

    footer: '⚠️ 本网站所有测算均为中国传统民俗文化娱乐参考，<b>不含任何科学或医疗、投资、决策建议</b>。命运在己，诸事理性，切勿迷信。',

    ver_ji: '吉', ver_ping: '平', ver_xiong: '凶',

    premium_badge: '会员专享',
    unlock_btn: '🔓 解锁深度解析',
    deep_teaser: '以下白话解读为会员专享内容——解锁后逐条说清每年/每卦要注意什么。',
    ln_deep_title: '流年白话解读（每年要注意什么）',
    xl_deep_title: '小六壬白话解读',
    deep_ln_hint: '逐条说明：当年天干十神代表什么机遇与压力，地支与您日支的冲/合/害/刑又意味着什么变动。',
    deep_xl_hint: '把卦象翻译成大白话，并说明这件事当前最该注意什么。',

    pay_title: '解锁会员深度解析',
    pay_phone_ph: '请输入手机号',
    pay_tier_label: '选择档位',
    tier_single: '单篇深度解析解锁', tier_month: '月度会员', tier_year: '年度会员',
    pay_amount_label: '应付',
    pay_submit: '去支付',
    pay_close: '关闭',
    pay_err_phone: '手机号格式不正确（11 位）',
    pay_wait: '正在生成订单…',
    pay_err_net: '网络错误：',
    pay_mock_tip: '演示模式（未配置真实支付）：点击下方按钮模拟支付成功，即可看到完整深度解析。上线时填入微信/支付宝商户号即变真收费。',
    pay_mock_btn: '🧪 模拟支付成功',
    pay_scan_wx: '请使用微信扫码支付',
    pay_scan_ali: '请使用支付宝扫码支付',
    pay_scan_msg: '支付成功后本页自动解锁，无需刷新。',
    pay_ok: '✅ 已解锁，深度解析已显示。'
  },
  en: {
    site_title: 'Zhouyi Fortune Pavilion',
    subtitle: 'Bazi Chart · Weight of Bones · Xiao Liu Ren · Guanyin Lottery · Number Energy · Zodiac Na Yin · Feng Shui Tales',
    tab_shengchen: 'Birth Chart',
    tab_guanyin: 'Guanyin Lottery',
    tab_num: 'Number Energy',
    tab_shengxiao: 'Zodiac & Na Yin',
    tab_fengshui: 'Feng Shui Tales',

    sc_title: 'Birth Chart (Gregorian)',
    sc_hint: 'One entry yields Bazi, Weight of Bones, Xiao Liu Ren, Da Yun and Annual Fortune.',
    lbl_year: 'Year', lbl_month: 'Month', lbl_day: 'Day', lbl_hour: 'Hour', lbl_min: 'Min', lbl_gender: 'Gender',
    gender_male: 'Male', gender_female: 'Female',
    btn_calc: 'Calculate',
    err_fill: 'Please fill year, month and day.',
    err_date: 'Invalid date, please check.',
    lunar_prefix: 'Lunar',

    sec_bazi: 'I. Bazi Four Pillars',
    sec_chengu: 'II. Weight of Bones (Yuan Tiangang)',
    sec_xl: 'III. Xiao Liu Ren',
    sec_dayun: 'IV. Da Yun (Decade Luck)',
    sec_liunian: 'V. Annual Fortune',

    bz_year: 'Year', bz_month: 'Month', bz_day: 'Day', bz_hour: 'Hour',
    lbl_daymaster: 'Day Master',
    lbl_strength: 'Strength',
    lbl_tongqi: 'Friendly Qi',
    lbl_wuxing: 'Elements',
    ss_label: 'Ten Gods',
    hide_label: 'Hidden',
    nayin_label: 'Na Yin',
    bz_muted: 'Element count uses stems + branch main qi, for fun only; true strength needs hidden-stem analysis and solar terms.',

    cg_total: 'Total Bone Weight',
    cg_year_row: 'Year', cg_month_row: 'Month', cg_day_row: 'Day', cg_hour_row: 'Hour',
    cg_song_label: 'Bone Song',

    xl_calc_label: 'Calculation',
    xl_desc_label: 'Verse',
    xl_detail_label: 'Detail',

    dy_forward: 'Forward (Yang male / Yin female)',
    dy_reverse: 'Reverse (Yin male / Yang female)',
    dy_start: 'Starts',
    dy_step: 'Step {n}',
    dy_age: 'yrs',
    dy_year: 'AD',
    dy_current: '(current)',
    dy_tengod: 'Stem Ten God',
    dy_note: 'Start age = days from birth to nearest major solar term ÷ 3 (3 days = 1 year). Forward/reverse follows year-stem polarity and gender.',

    ln_title: 'Annual Fortune',
    ln_cur_year: 'This year',
    ln_gan: 'Stem Ten God',
    ln_zhi: 'Branch Relation',
    ln_note: 'The stem Ten God shows the year’s energy; the branch relation shows clash/harmony/punishment with your Day Branch. For fun only.',

    gy_title: 'Guanyin Lottery',
    gy_hint: 'Focus your wish and draw sincerely.',
    gy_btn: '🙏 Draw Lot',
    gy_no: 'Sign No. {n}',
    gy_name_label: 'Allusion',
    gy_jie_label: 'Interpretation',
    gy_verse_label: 'Verse',
    gy_muted: 'Sincerity brings answers. Lottery texts are folk tradition, for entertainment only.',

    num_title: 'Number Energy · Phone Luck',
    num_hint: 'Enter a phone number; read adjacent digit pairs (8 stars).',
    num_btn: 'Analyze',
    num_label: 'Number',
    num_verdict: 'Overall Trend',
    num_pr: 'Pair', num_star: 'Star', num_mean: 'Meaning',
    num_muted: 'Number-energy is folk belief, for fun only, no advice intended.',

    sx_title: 'Zodiac & Na Yin',
    sx_hint: 'Enter a birth year for zodiac, element and na yin (Li Chun boundary).',
    sx_btn: 'Query',
    sx_year: 'Year',
    sx_zodiac: 'Zodiac',
    sx_gzwx: 'Year Stem-Branch Element',
    sx_nayin: 'Na Yin Element',
    sx_liuhe: 'Harmony Noble',
    sx_chong: 'Clash',
    sx_muted: 'Zodiac follows the lunar Li Chun boundary; na yin cycles the 60 stems, so the same animal differs every 60 years.',

    fs_title: 'Feng Shui Tales · Folklore',
    fs_hint: 'A few traditional feng shui vignettes — light reading for thought and amusement.',
    fs_cta1: 'Want your own Bazi chart?',
    fs_cta2: 'Check your zodiac na yin?',
    fs_cta3: 'Draw a Guanyin lot?',

    footer: '⚠️ All readings here are traditional Chinese folk-culture entertainment only, <b>with no scientific, medical, investment or decision-making advice</b>. Your fate is in your hands — stay rational, do not迷信 (blindly believe).',

    ver_ji: 'Auspicious', ver_ping: 'Neutral', ver_xiong: 'Inauspicious',

    premium_badge: 'Premium',
    unlock_btn: '🔓 Unlock Deep Analysis',
    deep_teaser: 'The plain-language reading below is premium content — unlock to see, year by year / sign by sign, what to watch for.',
    ln_deep_title: 'Plain-Language Year Reading (What to Watch)',
    xl_deep_title: 'Plain-Language Sign Reading',
    deep_ln_hint: 'Line by line: what opportunity and pressure the year’s stem Ten God brings, and what change the branch clash/harmony/harm/punishment with your Day Branch means.',
    deep_xl_hint: 'Translates the sign into plain words and tells what to watch for this matter right now.',

    pay_title: 'Unlock Premium Deep Analysis',
    pay_phone_ph: 'Enter phone number',
    pay_tier_label: 'Choose a plan',
    tier_single: 'Single Deep-Analysis Unlock', tier_month: 'Monthly VIP', tier_year: 'Annual VIP',
    pay_amount_label: 'Amount',
    pay_submit: 'Pay',
    pay_close: 'Close',
    pay_err_phone: 'Invalid phone (11 digits)',
    pay_wait: 'Creating order…',
    pay_err_net: 'Network error: ',
    pay_mock_tip: 'Demo mode (no real payment configured): click below to simulate a successful payment and see the full deep analysis. On launch, fill in WeChat/Alipay merchant IDs to charge for real.',
    pay_mock_btn: '🧪 Simulate Payment',
    pay_scan_wx: 'Scan with WeChat Pay',
    pay_scan_ali: 'Scan with Alipay',
    pay_scan_msg: 'This page unlocks automatically after payment — no refresh needed.',
    pay_ok: '✅ Unlocked. Deep analysis is shown.'
  }
};

/* 术语翻译（用于动态内容：十神/五行/六神/八星/生肖/地支关系/吉凶） */
const TERM_EN = {
  '木': 'Wood', '火': 'Fire', '土': 'Earth', '金': 'Metal', '水': 'Water',
  '比肩': 'Friend', '劫财': 'Robber', '食神': 'Eating God', '伤官': 'Hurting Officer',
  '正财': 'Direct Wealth', '偏财': 'Indirect Wealth', '正官': 'Direct Officer', '七杀': 'Seven Killings',
  '正印': 'Direct Seal', '偏印': 'Indirect Seal',
  '大安': 'Great Peace', '留连': 'Lingering', '速喜': 'Swift Joy', '赤口': 'Red Mouth',
  '小吉': 'Small Luck', '空亡': 'Emptiness',
  '天医': 'Heaven Doctor', '延年': 'Longevity', '生气': 'Life Force', '伏位': 'Still Position',
  '祸害': 'Calamity', '六煞': 'Six Fiends', '五鬼': 'Five Ghosts', '绝命': 'Absolute Fate',
  '鼠': 'Rat', '牛': 'Ox', '虎': 'Tiger', '兔': 'Rabbit', '龙': 'Dragon', '蛇': 'Snake',
  '马': 'Horse', '羊': 'Goat', '猴': 'Monkey', '鸡': 'Rooster', '狗': 'Dog', '猪': 'Pig',
  '冲': 'Clash', '合': 'Harmony', '害': 'Harm', '刑': 'Punishment', '同': 'Same',
  '吉': 'Auspicious', '平': 'Neutral', '凶': 'Inauspicious',
  '上签': 'Upper', '中签': 'Middle', '下签': 'Lower'
};

function t(key) {
  const v = I18N[I18N_LANG][key];
  return (v !== undefined) ? v : (I18N.zh[key] !== undefined ? I18N.zh[key] : key);
}
function tt(term) { return TERM_EN[term] || term; }

/* 用 {n} 占位符格式化 */
function tf(key, obj) {
  let s = t(key);
  if (obj) for (const k in obj) s = s.split('{' + k + '}').join(obj[k]);
  return s;
}

function applyStaticI18n() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const k = el.getAttribute('data-i18n');
    if (I18N[I18N_LANG][k] !== undefined) {
      if (k === 'footer') el.innerHTML = I18N[I18N_LANG][k];
      else el.textContent = I18N[I18N_LANG][k];
    }
  });
  document.documentElement.lang = (I18N_LANG === 'en') ? 'en' : 'zh-CN';
  const toggle = document.getElementById('lang-toggle');
  if (toggle) toggle.textContent = (I18N_LANG === 'en') ? '中文' : 'EN';
  const titleEl = document.getElementById('site-title');
  if (titleEl) titleEl.textContent = t('site_title');
  const subEl = document.getElementById('site-sub');
  if (subEl) subEl.textContent = t('subtitle');
}

function setLang(lang) {
  I18N_LANG = (lang === 'en') ? 'en' : 'zh';
  applyStaticI18n();
  if (window.__rerender) window.__rerender();
}
