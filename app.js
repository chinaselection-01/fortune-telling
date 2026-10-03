/* ============================================================
 * 命理测算 · 应用逻辑（中英双语版）
 * 依赖：lib/lunar.js（浏览器暴露 Lunar/Solar/EightChar）
 *       data.js / guanyin.js / guanyin_en.js / i18n.js
 * ============================================================ */

/* ---------- 术语随语言显示 ---------- */
function G(zh) { return (I18N_LANG === 'en') ? tt(zh) : zh; }
function GZ(zh) { return (I18N_LANG === 'en') ? tt(zh) : zh; }

/* ---------- 全局开关：是否开启会员付费 ----------
 * 路线 C（纯免费引流）已设为 false：流年/小六壬深度解析直接免费展示，
 * 不调用后端 /api，不弹付费窗。要重新开付费 → 改成 true，并把 backend/
 * 部署到一台可跑 Node 的主机（详见 README.md）。 */
const CONFIG = { paymentEnabled: false };

/* ---------- 干支 <-> 纳音索引 ---------- */
const JIAZI = [];
for (let i = 0; i < 60; i++) JIAZI.push(GAN[i % 10] + ZHI[i % 12]);
const JIAZI_INDEX = {};
JIAZI.forEach((v, i) => { JIAZI_INDEX[v] = i; });

/* 公历小时 -> 时辰序号（子=1 … 亥=12，23点与0点均作子时） */
function hourToZhiSeq(h) {
  const map = [1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12];
  return map[((h % 24) + 24) % 24];
}

/* ============================================================
 * 一、生辰综合测算（八字 + 称骨 + 小六壬 + 大运 + 流年）
 * ============================================================ */
function computeShengChen(y, m, d, hh, mm) {
  const sol = Solar.fromYmdHms(y, m, d, hh, mm, 0);
  const lun = Lunar.fromSolar(sol);
  const ec = lun.getEightChar();

  const pillars = ['年', '月', '日', '时'].map((label, i) => {
    const gz = [ec.getYear(), ec.getMonth(), ec.getDay(), ec.getTime()][i];
    const gan = gz[0], zhi = gz[1];
    const hide = (ZHI_HIDE[zhi] || []).map(g => ({ g, wx: GAN_WX[g] }));
    return {
      label, gz, gan, zhi,
      ganWx: GAN_WX[gan], zhiWx: ZHI_WX[zhi],
      nayin: NAYIN[JIAZI_INDEX[gz]],
      shishen: shiShen(ec.getDayGan(), gan),
      hide
    };
  });

  const dayGan = ec.getDayGan();
  const dayZhi = ec.getDayZhi();
  const dayWx = GAN_WX[dayGan];

  const wxCount = { 木: 0, 火: 0, 土: 0, 金: 0, 水: 0 };
  pillars.forEach(p => { wxCount[p.ganWx]++; wxCount[p.hide[0].wx]++; });
  const tongQi = wxCount[dayWx] + (function () {
    let s = 0;
    pillars.forEach(p => {
      if (isSheng(p.ganWx, dayWx)) s++;
      if (isSheng(p.hide[0].wx, dayWx)) s++;
    });
    return s;
  })();
  let strength = '中和';
  if (tongQi >= 5) strength = '偏强';
  else if (tongQi <= 3) strength = '偏弱';

  /* 称骨 */
  const yearGZ = lun.getYearInGanZhi();
  const cgYear = CHENGGU_YEAR[JIAZI_INDEX[yearGZ]];
  const lm = Math.abs(lun.getMonth());
  const cgMonth = CHENGGU_MONTH[lm] || 0;
  const ld = lun.getDay();
  const cgDay = CHENGGU_DAY[ld] || 0;
  const zhi = lun.getTimeZhi();
  const cgHour = CHENGGU_HOUR[zhi] || 0;
  const cgTotal = Math.round((cgYear + cgMonth + cgDay + cgHour) * 10) / 10;
  const cgKey = cgTotal.toFixed(1);
  const cgSong = CHENGGU_SONG[cgKey] || '（称骨歌暂无此重量对应，请核对生辰。）';

  /* 小六壬 */
  const xlMonth = lm;
  const xlDay = ld;
  const xlHour = hourToZhiSeq(hh);
  let idx = (xlMonth - 1) % 6;
  idx = (idx + xlDay - 1) % 6;
  idx = (idx + xlHour - 1) % 6;
  const xl = XLRC[((idx % 6) + 6) % 6];

  return {
    sol, lun, ec, pillars, dayGan, dayZhi, dayWx,
    wxCount, tongQi, strength,
    yearGZ,
    lunarText: `${G(t('lunar_prefix'))} ${lun.getYearInGanZhi()} ${G('年')} ${lun.getMonthInGanZhi()} ${G('月')} ${lun.getDayInGanZhi()} ${G('日')} ${zhi} ${G('时')}`,
    chengu: { cgYear, cgMonth, cgDay, cgHour, cgTotal, cgKey, cgSong },
    xiao: { xl, xlMonth, xlDay, xlHour, zhiName: zhi }
  };
}

/* ---------- 大运 ---------- */
/* 收集 birth 前后三年农历年表中的“十二节”日期（getJieQiTable 仅含当农历年，
   生于子月/丑月者需向相邻农历年取节，故跨三年取并集） */
function collectJieDates(sol) {
  const names = ['立春', '惊蛰', '清明', '立夏', '芒种', '小暑', '立秋', '白露', '寒露', '立冬', '大雪', '小寒'];
  const out = [];
  const seen = {};
  [sol.getYear() - 1, sol.getYear(), sol.getYear() + 1].forEach(y => {
    const jq = Lunar.fromSolar(Solar.fromYmd(y, 6, 15)).getJieQiTable();
    names.forEach(n => {
      const sj = jq[n];
      if (!sj) return;
      const k = sj.toYmd();
      if (!seen[k]) { seen[k] = 1; out.push(sj); }
    });
  });
  return out;
}
function computeDaYun(d, gender) {
  const ec = d.ec;
  const yearGan = ec.getYearGan();
  const yinYear = GAN_YIN[yearGan] === '阴';
  const male = (gender === '男');
  // 阳男阴女顺；阴男阳女逆
  const forward = male ? !yinYear : yinYear;
  const monthGZ = ec.getMonth();
  const birthJD = d.lun.getSolar().getJulianDay();
  let nextDiff = Infinity, prevDiff = Infinity;
  collectJieDates(d.lun.getSolar()).forEach(sj => {
    const diff = sj.getJulianDay() - birthJD;
    if (diff > 0 && diff < nextDiff) nextDiff = diff;
    if (diff < 0 && -diff < prevDiff) prevDiff = -diff;
  });
  const targetDiff = forward ? nextDiff : prevDiff;
  if (!isFinite(targetDiff)) targetDiff = 0;
  const startYears = targetDiff / 3;            // 三天为一岁
  const startAge = Math.floor(startYears);
  const startMonths = Math.round((startYears - startAge) * 12);
  const baseIdx = JIAZI_INDEX[monthGZ];
  const birthYear = d.sol.getYear();
  const curYear = new Date().getFullYear();
  const curAge = curYear - birthYear;
  const steps = [];
  for (let k = 1; k <= 8; k++) {
    const idx = ((baseIdx + (forward ? k : -k)) % 60 + 60) % 60;
    const gz = JIAZI[idx];
    const age0 = startAge + (k - 1) * 10;
    const age1 = age0 + 9;
    steps.push({
      gz, age0, age1,
      y0: birthYear + age0, y1: birthYear + age1,
      ss: shiShen(d.dayGan, gz[0]),
      current: (curAge >= age0 && curAge <= age1)
    });
  }
  return { forward, startAge, startMonths, steps };
}

/* ---------- 流年 ---------- */
function computeLiuNian(d) {
  const curY = new Date().getFullYear();
  const rows = [];
  for (let y = curY - 1; y <= curY + 11; y++) {
    const gz = Lunar.fromSolar(Solar.fromYmd(y, 6, 15)).getYearInGanZhi();
    const yg = gz[0], yz = gz[1];
    const rel = zhiRelation(d.dayZhi, yz);
    rows.push({
      y, gz,
      ss: shiShen(d.dayGan, yg),
      rel,
      isCur: (y === curY)
    });
  }
  return rows;
}

/* ============================================================
 * 二、渲染
 * ============================================================ */
function renderBaZi(el, d) {
  const wxColor = { 木: '#2e7d32', 火: '#c62828', 土: '#8d6e63', 金: '#f9a825', 水: '#1565c0' };
  const lab = ['bz_year', 'bz_month', 'bz_day', 'bz_hour'].map(k => G(t(k)));
  let rows = d.pillars.map((p, i) => `
    <div class="bz-pillar">
      <div class="bz-label">${lab[i]}</div>
      <div class="bz-gz">${p.gz}</div>
      <div class="bz-detail">
        <span class="tag" style="color:${wxColor[p.ganWx]}">${p.gan}·${G(p.ganWx)}</span>
        <span class="ss">${G(t('ss_label'))}：${G(p.shishen)}</span><br>
        <span class="tag" style="color:${wxColor[p.zhiWx]}">${p.zhi}·${G(p.zhiWx)}</span>
        <span class="hide">${G(t('hide_label'))}：${p.hide.map(h => h.g + G(h.wx)).join(' ')}</span><br>
        <span class="ny">${G(t('nayin_label'))}：${p.nayin}</span>
      </div>
    </div>`).join('');

  const wxBar = ['木', '火', '土', '金', '水'].map(w =>
    `<div class="wx-item"><span class="wx-dot" style="background:${wxColor[w]}"></span>${G(w)} ${d.wxCount[w]}</div>`).join('');

  el.innerHTML = `
    <div class="bz-grid">${rows}</div>
    <div class="bz-summary">
      <p><b>${G(t('lbl_daymaster'))}：</b>${d.dayGan}（${G(d.dayWx)}）&nbsp;·&nbsp;${G(t('lbl_strength'))}：<b>${G(d.strength)}</b>（${G(t('lbl_tongqi'))} ${d.tongQi}）</p>
      <div class="wx-bar">${wxBar}</div>
      <p class="muted">${t('bz_muted')}</p>
    </div>`;
}

function renderChengu(el, d) {
  const c = d.chengu;
  const song = (I18N_LANG === 'en')
    ? `<div class="cg-song"><b>${t('cg_song_label')}：</b>${c.cgSong}<br><span class="en-gloss">${chenguEn(c.cgKey)}</span></div>`
    : `<div class="cg-song"><b>${t('cg_song_label')}：</b>${c.cgSong}</div>`;
  el.innerHTML = `
    <div class="cg-box">
      <div class="cg-total">${t('cg_total')}：<b>${c.cgKey} ${G('两')}</b></div>
      <table class="cg-tbl">
        <tr><td>${t('cg_year_row')} ${d.yearGZ}</td><td>${c.cgYear} ${G('两')}</td></tr>
        <tr><td>${t('cg_month_row')}（${G(t('lunar_prefix'))}${Math.abs(d.lun.getMonth())}${G('月')}）</td><td>${c.cgMonth} ${G('两')}</td></tr>
        <tr><td>${t('cg_day_row')}（${G(t('lunar_prefix'))}${d.lun.getDay()}${G('日')}）</td><td>${c.cgDay} ${G('两')}</td></tr>
        <tr><td>${t('cg_hour_row')}（${d.xiao.zhiName}${G('时')}）</td><td>${c.cgHour} ${G('两')}</td></tr>
      </table>
      ${song}
    </div>`;
}

function renderXiao(el, d, unlocked) {
  const x = d.xiao;
  const en = XLRC_EN[x.xl.name];
  const sCls = x.xl.s === '吉' ? 'ji' : (x.xl.s === '凶' ? 'xiong' : 'ping');
  const nameTxt = (I18N_LANG === 'en') ? `${x.xl.name} · ${en.name}` : x.xl.name;
  const desc = (I18N_LANG === 'en') ? en.desc : x.xl.desc;
  const detail = (I18N_LANG === 'en') ? en.detail : x.xl.detail;

  let deep;
  const interp = XLRC_INTERP[x.xl.name];
  const showDeep = interp && (CONFIG.paymentEnabled ? unlocked : true);
  if (showDeep) {
    const txt = (I18N_LANG === 'en') ? interp.en : interp.zh;
    deep = `<div class="deep-analysis open">
      <div class="deep-head">🔓 ${t('xl_deep_title')}</div>
      <p class="deep-hint">${t('deep_xl_hint')}</p>
      <div class="deep-text xl-deep">${txt}</div>
    </div>`;
  } else {
    deep = `<div class="deep-analysis locked">
      <span class="premium-badge">${t('premium_badge')}</span>
      <div class="deep-head">🔒 ${t('xl_deep_title')}</div>
      <p class="deep-hint">${t('deep_teaser')}</p>
      <button class="unlock-btn" type="button" data-unlock="xl">${t('unlock_btn')}</button>
    </div>`;
  }

  el.innerHTML = `
    <div class="xl-box">
      <div class="xl-result ${sCls}">${nameTxt}（${G(x.xl.s)}）</div>
      <p class="xl-calc">${G(t('xl_calc_label'))}：${G(t('lunar_prefix'))} ${x.xlMonth} ${G('月')} + ${x.xlDay} ${G('日')} + ${x.zhiName}${G('时')}（${G(t('lunar_prefix'))} ${x.xlHour}）→ ${x.xl.name}</p>
      <p class="xl-desc"><b>${G(t('xl_desc_label'))}：</b>${desc}</p>
      <p class="xl-detail"><b>${G(t('xl_detail_label'))}：</b>${detail}</p>
      ${deep}
    </div>`;
}

function renderDaYun(el, d, dy) {
  const dir = dy.forward ? t('dy_forward') : t('dy_reverse');
  const steps = dy.steps.map((s, i) => `
    <div class="dy-row ${s.current ? 'cur' : ''}">
      <div class="dy-step">${tf('dy_step', { n: i + 1 })}</div>
      <div class="dy-gz">${s.gz}</div>
      <div class="dy-ss">${G(t('dy_tengod'))}：${G(s.ss)}</div>
      <div class="dy-age">${s.age0}–${s.age1} ${t('dy_age')}（${s.y0}–${s.y1} ${t('dy_year')}）${s.current ? ' ' + t('dy_current') : ''}</div>
    </div>`).join('');
  el.innerHTML = `
    <div class="dy-box">
      <p>${dir} · ${t('dy_start')} ${dy.startAge} ${t('dy_age')}${dy.startMonths ? ' ' + dy.startMonths + ' ' + (I18N_LANG === 'en' ? 'mo' : '个月') : ''}</p>
      <div class="dy-list">${steps}</div>
      <p class="muted">${t('dy_note')}</p>
    </div>`;
}

/* 流年深度解读（会员专享）：把当年十神 + 地支关系翻成大白话 */
function yearInterpretation(r) {
  const lang = I18N_LANG;
  const sg = SHISHEN_YEAR[r.ss] || { zh: '', en: '' };
  const relNote = LIUNIAN_NOTE[lang][r.rel] || LIUNIAN_NOTE[lang][''];
  if (lang === 'zh') {
    const relPart = r.rel ? `地支与您日支「${r.rel}」：${relNote}` : `地支平顺：${relNote}`;
    return `天干属「${r.ss}」。${sg.zh} ${relPart}`;
  }
  const relLabel = r.rel ? G(r.rel) : 'smooth';
  const relPart = r.rel ? `Branch is "${relLabel}" with your Day Branch: ${relNote}` : `Branch is smooth: ${relNote}`;
  return `Stem is "${r.ss}". ${sg.en} ${relPart}`;
}

function renderLiuNian(el, d, rows, unlocked) {
  const list = rows.map(r => {
    const relTxt = r.rel ? `${G(r.rel)}` : '—';
    const note = LIUNIAN_NOTE[I18N_LANG][r.rel] || '';
    return `<div class="ln-row ${r.isCur ? 'cur' : ''}">
      <div class="ln-year">${r.y}${r.isCur ? ' · ' + t('ln_cur_year') : ''}</div>
      <div class="ln-gz">${r.gz}</div>
      <div class="ln-ss">${G(t('ln_gan'))}：${G(r.ss)}</div>
      <div class="ln-rel">${G(t('ln_zhi'))}：${relTxt}</div>
      <div class="ln-note">${note}</div>
    </div>`;
  }).join('');

  let deep;
  const showDeep = CONFIG.paymentEnabled ? unlocked : true;
  if (showDeep) {
    const deepList = rows.map(r => `<div class="deep-row${r.isCur ? ' cur' : ''}">
      <div class="deep-year">${r.y}${r.isCur ? ' <span class="deep-cur">★ ' + t('ln_cur_year') + '</span>' : ''}</div>
      <div class="deep-text">${yearInterpretation(r)}</div>
    </div>`).join('');
    deep = `<div class="deep-analysis open">
      <div class="deep-head">🔓 ${t('ln_deep_title')}</div>
      <p class="deep-hint">${t('deep_ln_hint')}</p>
      <div class="deep-list">${deepList}</div>
    </div>`;
  } else {
    deep = `<div class="deep-analysis locked">
      <span class="premium-badge">${t('premium_badge')}</span>
      <div class="deep-head">🔒 ${t('ln_deep_title')}</div>
      <p class="deep-hint">${t('deep_teaser')}</p>
      <button class="unlock-btn" type="button" data-unlock="ln">${t('unlock_btn')}</button>
    </div>`;
  }

  el.innerHTML = `
    <div class="ln-box">
      <div class="ln-list">${list}</div>
      <p class="muted">${t('ln_note')}</p>
      ${deep}
    </div>`;
}

/* ---------- 观音灵签 ---------- */
function drawGuanyin(el) {
  const n = Math.floor(Math.random() * 100) + 1;
  const q = GUANYIN[n - 1];
  const lvCls = q.lv === '上签' ? 'ji' : (q.lv === '下签' ? 'xiong' : 'ping');
  const lvEn = G(q.lv);
  const nameTxt = (I18N_LANG === 'en') ? `${q.name} · ${GUANYIN_EN_NAMES[n]}` : q.name;
  const jie = (I18N_LANG === 'en') ? translateJie(q.j) : q.j;
  el.innerHTML = `
    <div class="gy-box">
      <div class="gy-head">
        <span class="gy-no">${tf('gy_no', { n })}</span>
        <span class="gy-lv ${lvCls}">${lvEn}</span>
        <span class="gy-name">${nameTxt}</span>
      </div>
      <div class="gy-verse-label">${G(t('gy_verse_label'))}</div>
      <div class="gy-verse">${q.v.map(l => `<div>${l}</div>`).join('')}</div>
      <div class="gy-jie"><b>${G(t('gy_jie_label'))}：</b>${jie}</div>
      <p class="muted">${t('gy_muted')}</p>
    </div>`;
  el.classList.remove('shake'); void el.offsetWidth; el.classList.add('shake');
}

/* ---------- 数字能量 ---------- */
function computeNum(el, phone) {
  phone = (phone || '').replace(/\D/g, '');
  if (phone.length < 2) { el.innerHTML = `<p class="warn">${I18N_LANG === 'en' ? 'Enter at least 2 digits.' : '请输入至少 2 位号码。'}</p>`; return; }
  const pairs = [];
  for (let i = 0; i < phone.length - 1; i++) {
    const pr = phone.substr(i, 2);
    if (NUM_STAR[pr]) pairs.push({ pr, star: NUM_STAR[pr] });
  }
  const ji = ['天医', '延年', '生气'], xiong = ['祸害', '六煞', '五鬼', '绝命'];
  let jScore = 0, xScore = 0;
  pairs.forEach(p => { if (ji.includes(p.star)) jScore++; else if (xiong.includes(p.star)) xScore++; });
  let verdict = (I18N_LANG === 'en') ? 'Mixed: balanced fortune.' : '吉凶参半，平稳之号。';
  if (jScore > xScore) verdict = (I18N_LANG === 'en') ? 'Overall auspicious: more good stars, wealth and friendship.' : '整体偏吉：多现吉星，利财运人缘。';
  else if (xScore > jScore) verdict = (I18N_LANG === 'en') ? 'Overall inauspicious: more bad stars, mind gossip and change.' : '整体偏凶：凶星偏多，宜留意口舌与变动。';

  const list = pairs.length
    ? pairs.map(p => {
        const info = NUM_STAR_INFO[p.star];
        const en = NUM_STAR_EN[p.star];
        const mean = (I18N_LANG === 'en') ? en : info.meaning;
        const c = info.lv === '吉' ? 'ji' : (info.lv === '凶' ? 'xiong' : 'ping');
        return `<div class="num-row"><span class="num-pr">${p.pr}</span><span class="num-star ${c}">${G(p.star)}</span><span class="num-mean">${mean}</span></div>`;
      }).join('')
    : `<p class="warn">${I18N_LANG === 'en' ? 'No standard arrays matched (energy reads adjacent digit pairs).' : '未匹配到标准数组（数字能量看相邻两位组合）。'}</p>`;

  el.innerHTML = `
    <div class="num-box">
      <p><b>${t('num_label')}：</b>${phone}</p>
      <div class="num-verdict"><b>${t('num_verdict')}：</b>${verdict}</div>
      <div class="num-list">${list}</div>
      <p class="muted">${t('num_muted')}</p>
    </div>`;
}

/* ---------- 生肖纳音 ---------- */
function computeShengXiao(el, y) {
  y = parseInt(y, 10);
  if (!y || y < 1900 || y > 2100) { el.innerHTML = `<p class="warn">${I18N_LANG === 'en' ? 'Enter a year between 1900–2100.' : '请输入 1900–2100 之间的年份。'}</p>`; return; }
  const sol = Solar.fromYmd(y, 6, 15);
  const lun = Lunar.fromSolar(sol);
  const gz = lun.getYearInGanZhi();
  const gan = gz[0], zhi = gz[1];
  const sx = ZHI_SX[zhi];
  const nayin = NAYIN[JIAZI_INDEX[gz]];
  const he = SX_LIUHE[sx] || '—';
  const chong = SX_CHONG[sx] || '—';
  el.innerHTML = `
    <div class="sx-box">
      <div class="sx-head">${y} ${G(t('sx_year'))}（${gz}）</div>
      <div class="sx-row"><span>${G(t('sx_zodiac'))}</span><b>${G(sx)}</b></div>
      <div class="sx-row"><span>${G(t('sx_gzwx'))}</span><b>${gan}（${G(GAN_WX[gan])}）· ${zhi}（${G(ZHI_WX[zhi])}）</b></div>
      <div class="sx-row"><span>${G(t('sx_nayin'))}</span><b>${nayin}</b></div>
      <div class="sx-row"><span>${G(t('sx_liuhe'))}</span><b>${G(he)}</b></div>
      <div class="sx-row"><span>${G(t('sx_chong'))}</span><b>${G(chong)}</b></div>
      <p class="muted">${t('sx_muted')}</p>
    </div>`;
}

/* ---------- 风水故事 ---------- */
function renderFengShui(el) {
  const arr = FENGSHUI_STORIES.map((s, i) => {
    const c = I18N_LANG === 'en' ? s.en : s.zh;
    return `<div class="fs-card">
      <div class="fs-no">${i + 1}</div>
      <div class="fs-body">
        <div class="fs-title">${c.title}</div>
        <div class="fs-text">${c.body}</div>
      </div>
    </div>`;
  }).join('');
  const cta = `<div class="fs-cta">
      <span>${t('fs_cta1')}</span> <a href="#" data-jump="shengchen">${G(t('tab_shengchen'))}</a> ·
      <span>${t('fs_cta2')}</span> <a href="#" data-jump="shengxiao">${G(t('tab_shengxiao'))}</a> ·
      <span>${t('fs_cta3')}</span> <a href="#" data-jump="guanyin">${G(t('tab_guanyin'))}</a>
    </div>`;
  el.innerHTML = `<div class="fs-list">${arr}</div>${cta}`;
  el.querySelectorAll('[data-jump]').forEach(a => {
    a.addEventListener('click', e => {
      e.preventDefault();
      const id = a.getAttribute('data-jump');
      document.querySelector(`.tab-btn[data-tab="${id}"]`).click();
    });
  });
}

/* ============================================================
 * 三、事件绑定 + 重渲染
 * ============================================================ */
const STATE = { sc: null, num: null, sx: null, gy: false, member: { phone: null, token: null, unlocked: false, tier: null, expire: null } };

function runSC() {
  const y = +document.getElementById('sc-y').value;
  const m = +document.getElementById('sc-m').value;
  const d = +document.getElementById('sc-d').value;
  const hh = +document.getElementById('sc-h').value;
  const mm = +document.getElementById('sc-mm').value || 0;
  const gender = document.querySelector('input[name="sc-gender"]:checked').value;
  const scErr = document.getElementById('sc-err');
  if (!y || !m || !d) { scErr.textContent = t('err_fill'); return; }
  scErr.textContent = '';
  try {
    const data = computeShengChen(y, m, d, hh || 0, mm);
    document.getElementById('sc-lunar').textContent = data.lunarText;
    renderBaZi(document.getElementById('sc-bazi'), data);
    renderChengu(document.getElementById('sc-cg'), data);
    renderXiao(document.getElementById('sc-xl'), data, STATE.member.unlocked);
    const dy = computeDaYun(data, gender);
    renderDaYun(document.getElementById('sc-dy'), data, dy);
    renderLiuNian(document.getElementById('sc-ln'), data, computeLiuNian(data), STATE.member.unlocked);
    STATE.sc = { y, m, d, hh: hh || 0, mm, gender };
  } catch (e) {
    scErr.textContent = t('err_date') + ' ' + e.message;
  }
}

function runNum() {
  const v = document.getElementById('num-in').value;
  computeNum(document.getElementById('num-result'), v);
  STATE.num = v;
}
function runSx() {
  const v = document.getElementById('sx-y').value;
  computeShengXiao(document.getElementById('sx-result'), v);
  STATE.sx = v;
}
function runGy() {
  drawGuanyin(document.getElementById('gy-result'));
  STATE.gy = true;
}
function runFs() { renderFengShui(document.getElementById('fs-list')); }

function rerender() {
  if (STATE.sc) {
    const s = STATE.sc;
    // 回填输入
    document.getElementById('sc-y').value = s.y;
    document.getElementById('sc-m').value = s.m;
    document.getElementById('sc-d').value = s.d;
    document.getElementById('sc-h').value = s.hh;
    document.getElementById('sc-mm').value = s.mm;
    document.querySelector(`input[name="sc-gender"][value="${s.gender}"]`).checked = true;
    runSC();
  }
  if (STATE.num !== null) runNum();
  if (STATE.sx !== null) runSx();
  if (STATE.gy) runGy();
  runFs();
}

/* 暴露给 i18n.js 的切换回调 */
window.__rerender = rerender;

/* ============ 会员付费（真解锁，走后端 /api） ============ */
const MEMBER_KEY = 'ml_member';
function loadMember() {
  try { const m = JSON.parse(localStorage.getItem(MEMBER_KEY)); if (m && m.phone) STATE.member = m; } catch (e) {}
}
function saveMember() {
  try { localStorage.setItem(MEMBER_KEY, JSON.stringify(STATE.member)); } catch (e) {}
}
function refreshMemberStatus(cb) {
  if (!CONFIG.paymentEnabled) { cb && cb(); return; }   // 付费关闭时不请求后端
  if (!STATE.member.phone) return cb && cb();
  fetch('/api/status?phone=' + encodeURIComponent(STATE.member.phone) + '&token=' + encodeURIComponent(STATE.member.token || ''))
    .then(r => r.json()).then(j => {
      if (j.unlocked) { STATE.member.unlocked = true; STATE.member.tier = j.tier; STATE.member.expire = j.expire; saveMember(); }
      cb && cb();
    }).catch(() => cb && cb());
}
function openPayModal() {
  const modal = document.getElementById('pay-modal');
  modal.classList.add('show');
  document.getElementById('pay-phone').value = STATE.member.phone || '';
  document.getElementById('pay-err').textContent = '';
  document.getElementById('pay-qr').innerHTML = '';
  const rb = document.querySelector('input[name="pay-tier"][value="single"]'); if (rb) rb.checked = true;
  updatePayAmount();
}
function closePayModal() { document.getElementById('pay-modal').classList.remove('show'); }
function updatePayAmount() {
  const tier = (document.querySelector('input[name="pay-tier"]:checked') || {}).value || 'single';
  const prices = { single: '¥6.6', month: '¥39', year: '¥299' };
  document.getElementById('pay-amount').textContent = prices[tier] || '';
}
function doOrder() {
  const phone = document.getElementById('pay-phone').value.trim();
  const tier = (document.querySelector('input[name="pay-tier"]:checked') || {}).value || 'single';
  const err = document.getElementById('pay-err');
  if (!/^1\d{10}$/.test(phone)) { err.textContent = t('pay_err_phone'); return; }
  err.textContent = t('pay_wait');
  fetch('/api/order', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ phone, tier }) })
    .then(r => r.json()).then(j => {
      if (j.error) { err.textContent = j.error; return; }
      STATE.member.phone = phone; STATE.member.token = j.token; saveMember();
      showPayQr(j);
    }).catch(e => { err.textContent = t('pay_err_net') + e.message; });
}
function showPayQr(j) {
  const box = document.getElementById('pay-qr');
  const tip = document.getElementById('pay-tip');
  if (j.channel === 'mock') {
    tip.textContent = t('pay_mock_tip');
    box.innerHTML = `<button class="unlock-btn" id="pay-mock" type="button">${t('pay_mock_btn')}</button>`;
    document.getElementById('pay-mock').onclick = () => mockPay(j.orderId);
  } else {
    tip.textContent = (j.channel === 'wechat' ? t('pay_scan_wx') : t('pay_scan_ali')) + ' ' + (j.amount ? '¥' + j.amount : '');
    box.innerHTML = `<div class="qr-box"><div class="qr-code" id="qr-code"></div><p class="muted">${t('pay_scan_msg')}</p></div>`;
    renderQr(j.codeUrl);
    pollOrder(j.orderId, j.token, j.phone);
  }
}
function renderQr(text) {
  // 轻量二维码：用公共 api 生成图片（部署时可换自建）。无网时显示 codeUrl 文本兜底
  const el = document.getElementById('qr-code');
  if (!text) { el.textContent = ''; return; }
  const img = new Image();
  img.src = 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=' + encodeURIComponent(text);
  img.alt = text;
  img.onerror = () => { el.textContent = text; };
  el.innerHTML = ''; el.appendChild(img);
}
function mockPay(orderId) {
  fetch('/api/mock-pay/' + orderId, { method: 'POST' }).then(() => onPaid()).catch(e => { document.getElementById('pay-err').textContent = t('pay_err_net') + e.message; });
}
function pollOrder(orderId, token, phone) {
  const iv = setInterval(() => {
    fetch('/api/status?phone=' + encodeURIComponent(phone) + '&token=' + encodeURIComponent(token))
      .then(r => r.json()).then(j => { if (j.unlocked) { clearInterval(iv); onPaid(); } });
  }, 2000);
  setTimeout(() => clearInterval(iv), 600000);
}
function onPaid() {
  STATE.member.unlocked = true; saveMember();
  closePayModal();
  if (STATE.sc) runSC();
  const tip = document.getElementById('sc-err'); if (tip) tip.textContent = t('pay_ok');
}

document.addEventListener('DOMContentLoaded', function () {
  document.getElementById('lang-toggle').addEventListener('click', () => {
    setLang(I18N_LANG === 'zh' ? 'en' : 'zh');
  });

  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById(btn.dataset.tab).classList.add('active');
    });
  });

  document.getElementById('sc-btn').addEventListener('click', runSC);
  document.getElementById('gy-btn').addEventListener('click', runGy);
  document.getElementById('num-btn').addEventListener('click', runNum);
  document.getElementById('sx-btn').addEventListener('click', runSx);

  /* 深度解析（会员）解锁 —— 真付费 */
  document.getElementById('shengchen').addEventListener('click', e => {
    const btn = e.target.closest('[data-unlock]');
    if (!btn) return;
    if (!CONFIG.paymentEnabled) return;               // 付费关闭时忽略解锁按钮
    if (STATE.member.unlocked) { if (STATE.sc) runSC(); return; }
    openPayModal();
  });

  applyStaticI18n();
  loadMember();
  refreshMemberStatus();
  runFs(); // 风水故事随语言首次渲染
  document.getElementById('pay-close').addEventListener('click', closePayModal);
  document.getElementById('pay-submit').addEventListener('click', doOrder);
  document.querySelectorAll('input[name="pay-tier"]').forEach(r => r.addEventListener('change', updatePayAmount));
});
