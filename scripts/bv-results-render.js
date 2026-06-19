/* ============================================================================
 * bv-results-render.js — Barvision 历届详情页共享渲染
 * 薄壳 HTML 仅需：<div id="bvr-root"></div> + var EDITION_SRC='...json' + 本脚本
 * 渲染：Hero → (每 match) 结果表 → 得分拆分(Combined/Jury/Tele) → 评委/观众矩阵
 *       → 12 分汇总 → 歌曲介绍 → 赛制规则 ；右下页内 TOC（沿用 hof 版式）
 * 对标 Eurovision wiki 的 content / scoreboard。
 * ==========================================================================*/
(function () {
  'use strict';

  /* ---------- helpers ---------- */
  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
  var ROMAN = [[1000,'M'],[900,'CM'],[500,'D'],[400,'CD'],[100,'C'],[90,'XC'],
               [50,'L'],[40,'XL'],[10,'X'],[9,'IX'],[5,'V'],[4,'IV'],[1,'I']];
  function roman(n) {
    var r = '';
    ROMAN.forEach(function (p) { while (n >= p[0]) { r += p[1]; n -= p[0]; } });
    return r;
  }
  function fmtScore(v) {
    if (v == null || v === '') return '';
    return String(Math.round(Number(v)));
  }
  // 多歌手：换行归一为空格、逗号后补空格（提供手机端换行机会）
  function fmtArtist(a) {
    return String(a == null ? '' : a).replace(/\s*[\r\n]+\s*/g, ' ').replace(/\s*,\s*/g, ', ');
  }

  var DATA = null;             // edition JSON
  var EDIDX = { editions: [] }; // 届次索引（成员变动 / 上下届导航）
  function memberLink(nick, opts) {
    opts = opts || {};
    // 联合选送「A/B」：拆分各自渲染，斜杠分隔
    if (nick && nick.indexOf('/') > -1) {
      return nick.split('/').map(function (n) { return memberLink(n.trim(), opts); })
        .join('<span class="bvr-joint-sep">/</span>');
    }
    var m = DATA && DATA.members && DATA.members[nick];
    // 未认领（混淆曲赛后无人认领）：弱化、无 @、链接到伪成员页 member/0.html
    if (m && m.unclaimed) {
      return '<a class="member member--unclaimed" href="../../member/' + m.id + '.html" data-nickname="'
        + esc(nick) + '">' + esc(nick) + '</a>';
    }
    var label = opts.nick ? esc(nick) : ('@' + esc(m ? m.handle : nick));
    if (!m) return '<span class="member">' + label + '</span>';
    return '<a class="member" href="../../member/' + m.id + '.html" data-nickname="'
      + esc(nick) + '">' + label + '</a>';
  }
  // 用届次索引 roster 项（{name,id,handle}）渲染链接（不依赖当前届 members）
  function memberLinkR(r) {
    var label = '@' + esc(r.handle || r.name);
    if (!r.id) return '<span class="member">' + label + '</span>';
    return '<a class="member" href="../../member/' + r.id + '.html" data-nickname="' + esc(r.name) + '">' + label + '</a>';
  }
  function curIndex(d) {
    var eds = (EDIDX && EDIDX.editions) || [];
    for (var i = 0; i < eds.length; i++) if (eds[i].no === d.edition_no) return i;
    return -1;
  }
  // 成员变动：对比上一届 + 历史届 → 继续/首次/回归/退出
  function memberChangesBlock(d) {
    var eds = (EDIDX && EDIDX.editions) || [];
    var ci = curIndex(d);
    if (ci < 0) return '';
    var cur = eds[ci].roster || [];
    var prevSet = {}, earlierSet = {}, curNames = {};
    if (ci > 0) (eds[ci - 1].roster || []).forEach(function (r) { prevSet[r.name] = r; });
    for (var j = 0; j < ci - 1; j++) (eds[j].roster || []).forEach(function (r) { earlierSet[r.name] = 1; });
    var first = [], cont = [], ret = [], left = [];
    cur.forEach(function (r) {
      curNames[r.name] = 1;
      if (prevSet[r.name]) cont.push(r);
      else if (earlierSet[r.name]) ret.push(r);
      else first.push(r);
    });
    Object.keys(prevSet).forEach(function (nm) { if (!curNames[nm]) left.push(prevSet[nm]); });
    var rows = [
      { cls: 'cont', label: '继续参赛', list: cont },
      { cls: 'first', label: '首次加入', list: first },
      { cls: 'ret', label: '回归', list: ret },
      { cls: 'left', label: '退出', list: left },
    ].filter(function (r) { return r.list.length; });
    if (!rows.length) return '';
    var body = rows.map(function (r) {
      return '<tr class="bvr-mc--' + r.cls + '"><td><span class="bvr-mc__badge">' + r.label + '</span></td>' +
        '<td class="bvr-mc__mem">' + r.list.map(memberLinkR).join('') + '</td>' +
        '<td class="bvr-mc__n">' + r.list.length + '</td></tr>';
    }).join('');
    return '<div class="bvr-mc-wrap fade-up"><table class="bvr-mc"><thead><tr>' +
      '<th>状态</th><th>成员</th><th>总计</th></tr></thead><tbody>' + body + '</tbody></table></div>';
  }
  // 上一届 / 下一届导航
  function navBlock(d) {
    var eds = (EDIDX && EDIDX.editions) || [];
    var ci = curIndex(d);
    if (ci < 0) return '';
    var prev = ci > 0 ? eds[ci - 1] : null, next = ci < eds.length - 1 ? eds[ci + 1] : null;
    if (!prev && !next) return '';
    function nm(e) { return esc(e.name || ('第' + e.no + '届')); }
    var L = prev ? '<a class="bvr-nav__btn bvr-nav__btn--prev" href="' + prev.href + '"><span class="bvr-nav__arrow">←</span><span><span class="bvr-nav__lbl">上一届</span><span class="bvr-nav__name">' + nm(prev) + '</span></span></a>' : '<span class="bvr-nav__spacer"></span>';
    var R = next ? '<a class="bvr-nav__btn bvr-nav__btn--next" href="' + next.href + '"><span><span class="bvr-nav__lbl">下一届</span><span class="bvr-nav__name">' + nm(next) + '</span></span><span class="bvr-nav__arrow">→</span></a>' : '<span class="bvr-nav__spacer"></span>';
    return '<nav class="bvr-nav section__inner fade-up">' + L + R + '</nav>';
  }

  /* ---------- CSS ---------- */
  function injectCSS() {
    var css = `
    .bvr-hero { position:relative; padding:var(--nav-h) 0 56px; overflow:hidden; }
    .bvr-hero__glow { position:absolute; inset:0; pointer-events:none; background:
      radial-gradient(ellipse 75% 55% at 50% 0%, rgba(168,85,247,0.20) 0%, transparent 60%),
      radial-gradient(ellipse 40% 45% at 100% 90%, rgba(240,96,184,0.10) 0%, transparent 55%); }
    .bvr-hero__grid { position:absolute; inset:0; pointer-events:none; background-image:
      linear-gradient(rgba(255,255,255,0.018) 1px,transparent 1px),
      linear-gradient(90deg,rgba(255,255,255,0.018) 1px,transparent 1px); background-size:48px 48px; }
    .bvr-hero__wm { position:absolute; right:-14px; bottom:-26px; font-family:var(--font-display);
      font-size:200px; line-height:1; color:rgba(168,85,247,0.045); pointer-events:none; user-select:none; }
    .bvr-hero__inner { position:relative; z-index:2; margin-top:36px; }
    .bvr-eyebrow { font-size:11px; font-weight:600; letter-spacing:0.32em; text-transform:uppercase;
      color:var(--clr-violet-light); margin-bottom:24px; display:inline-flex; align-items:center; gap:8px;
      transition:color 0.2s; }
    .bvr-eyebrow:hover { color:var(--clr-white); text-decoration:none; }
    .bvr-title { font-family:var(--font-display); font-size:clamp(44px,7vw,92px); line-height:0.98;
      letter-spacing:0.01em; text-transform:uppercase; }
    .bvr-title .bvr-ord { color:var(--clr-pink-light); }
    .bvr-meta { display:flex; flex-wrap:wrap; align-items:center; gap:6px 12px; margin-top:22px;
      font-family:var(--font-body); font-size:12px; color:var(--clr-text-3); }
    .bvr-meta__sep { color:var(--clr-text-3); opacity:0.55; }
    .bvr-meta__motto { color:var(--clr-violet-light); }
    .bvr-desc { margin-top:18px; font-size:15px; line-height:1.7; color:var(--clr-text-2); max-width:620px; }

    .bvr-sec__hd { margin-bottom:40px; }
    .bvr-sec__sub { font-size:13px; color:var(--clr-text-2); margin-bottom:20px; line-height:1.6; max-width:680px; }
    .bvr-dvr-sub { font-family:var(--font-body); font-weight:700; font-size:18px; letter-spacing:0.03em;
      margin:48px 0 12px; }
    .bvr-dvr-sub:first-child { margin-top:0; }
    .bvr-mtx-cap { font-family:var(--font-body); font-size:11px; font-weight:700; letter-spacing:0.08em;
      margin:8px 0 6px; }

    /* ----- result table ----- */
    .bvr-tw { overflow-x:auto; border:1px solid var(--clr-border); border-radius:8px; }
    /* 隐藏横向滚动条（保留滑动；靠「左右滑动」提示引导） */
    .bvr-tw, .bvr-mw { scrollbar-width:none; -ms-overflow-style:none; }
    .bvr-tw::-webkit-scrollbar, .bvr-mw::-webkit-scrollbar { display:none; }
    table.bvr-tbl { width:100%; border-collapse:collapse; font-size:13px; min-width:560px;
      -webkit-text-size-adjust:100%; text-size-adjust:100%; }
    .bvr-tbl th { font-family:var(--font-body); font-weight:700; font-size:11px; letter-spacing:0.06em;
      text-transform:uppercase; color:var(--clr-text-2); text-align:left; padding:11px 14px;
      background:var(--clr-surface); border-bottom:1px solid var(--clr-border-2); white-space:nowrap; }
    .bvr-tbl th.th-jury { color:var(--clr-accent-light); }
    .bvr-tbl th.th-tele { color:var(--clr-pink-light); }
    .bvr-tbl th.th-pts  { color:var(--clr-text); }
    .bvr-th-sort { cursor:pointer; user-select:none; }
    .bvr-th-sort:hover { filter:brightness(1.25); }
    .bvr-th-sort::after { content:''; display:inline-block; width:9px; height:14px;
      margin-left:1px; vertical-align:middle; transform:translateY(-1px);
      background-color:currentColor; opacity:0.5;
      mask-repeat:no-repeat; mask-position:center; mask-size:contain;
      -webkit-mask-repeat:no-repeat; -webkit-mask-position:center; -webkit-mask-size:contain;
      mask-image:url("data:image/svg+xml,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%208%2014'%3E%3Cpath%20fill='%23000'%20d='M4%201%200.6%205.8%207.4%205.8%20Z'/%3E%3Cpath%20fill='%23000'%20d='M4%2013%200.6%208.2%207.4%208.2%20Z'/%3E%3C/svg%3E");
      -webkit-mask-image:url("data:image/svg+xml,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%208%2014'%3E%3Cpath%20fill='%23000'%20d='M4%201%200.6%205.8%207.4%205.8%20Z'/%3E%3Cpath%20fill='%23000'%20d='M4%2013%200.6%208.2%207.4%208.2%20Z'/%3E%3C/svg%3E"); }
    .bvr-th-sort[data-sort]::after { opacity:1; }
    /* 结果表：抵消三角宽度，使表头文字居中对齐数值 */
    .bvr-tbl th.bvr-th-sort::after { margin-right:-10px; }
    /* JURY 结尾字母 Y 右侧留白多，三角间距单独收紧一点 */
    .bvr-tbl th.th-jury.bvr-th-sort::after { margin-left:0; }
    .bvr-th-sort[data-sort="desc"]::after {
      mask-image:url("data:image/svg+xml,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%208%2014'%3E%3Cpath%20fill='%23000'%20fill-opacity='0.3'%20d='M4%201%200.6%205.8%207.4%205.8%20Z'/%3E%3Cpath%20fill='%23000'%20d='M4%2013%200.6%208.2%207.4%208.2%20Z'/%3E%3C/svg%3E");
      -webkit-mask-image:url("data:image/svg+xml,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%208%2014'%3E%3Cpath%20fill='%23000'%20fill-opacity='0.3'%20d='M4%201%200.6%205.8%207.4%205.8%20Z'/%3E%3Cpath%20fill='%23000'%20d='M4%2013%200.6%208.2%207.4%208.2%20Z'/%3E%3C/svg%3E"); }
    .bvr-th-sort[data-sort="asc"]::after {
      mask-image:url("data:image/svg+xml,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%208%2014'%3E%3Cpath%20fill='%23000'%20d='M4%201%200.6%205.8%207.4%205.8%20Z'/%3E%3Cpath%20fill='%23000'%20fill-opacity='0.3'%20d='M4%2013%200.6%208.2%207.4%208.2%20Z'/%3E%3C/svg%3E");
      -webkit-mask-image:url("data:image/svg+xml,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%208%2014'%3E%3Cpath%20fill='%23000'%20d='M4%201%200.6%205.8%207.4%205.8%20Z'/%3E%3Cpath%20fill='%23000'%20fill-opacity='0.3'%20d='M4%2013%200.6%208.2%207.4%208.2%20Z'/%3E%3C/svg%3E"); }
    .bvr-tbl tbody td { padding-top:12px; padding-bottom:12px; }
    .bvr-tbl .pts-v { display:block; line-height:1.1; }
    /* 数值 + #排名 作为整体在行内垂直居中 */
    .bvr-tbl .pts-rank { display:block; font-size:10px; line-height:1; font-weight:600; opacity:0.55; margin-top:2px; }
    .bvr-tbl .pts--tele .pts-rank { opacity:0.7; }
    .bvr-tbl td { padding:10px 14px; border-bottom:1px solid var(--clr-border); vertical-align:middle; }
    .bvr-tbl tr:last-child td { border-bottom:none; }
    .bvr-tbl .num { font-family:var(--font-display); font-size:18px; line-height:1; text-align:center;
      color:var(--clr-text-3); width:48px; }
    .bvr-tbl .num span { display:inline-block; transform:translateY(2px); }
    .bvr-tbl .pts { font-family:var(--font-body); text-align:center; white-space:nowrap; font-size:15px; }
    .bvr-tbl .pts--total { color:var(--clr-text); font-size:16px; }
    .bvr-tbl .song { color:var(--clr-text); }
    .bvr-tbl .artist { color:var(--clr-text); overflow-wrap:break-word; }
    .bvr-tbl .lang { font-size:11px; color:var(--clr-text-3); }
    /* 前三名：参考 bbl 本期完整榜单卡片（渐变底 + 左侧光条 + 染色） */
    .bvr-row--1 { background:linear-gradient(90deg, rgba(212,168,50,0.20) 0%, rgba(212,168,50,0.06) 50%, transparent 85%); }
    .bvr-row--2 { background:linear-gradient(90deg, rgba(110,150,178,0.15) 0%, rgba(110,150,178,0.05) 50%, transparent 85%); }
    .bvr-row--3 { background:linear-gradient(90deg, rgba(196,120,68,0.16) 0%, rgba(196,120,68,0.05) 50%, transparent 85%); }
    .bvr-row--1 td:first-child { box-shadow:inset 3px 0 0 var(--clr-gold-light); }
    .bvr-row--2 td:first-child { box-shadow:inset 3px 0 0 #7ea4bc; }
    .bvr-row--3 td:first-child { box-shadow:inset 3px 0 0 #d09068; }
    .bvr-row--1 .num { color:var(--clr-gold-light); text-shadow:0 0 18px rgba(224,176,64,0.7); }
    .bvr-row--2 .num { color:var(--clr-silver);     text-shadow:0 0 18px rgba(110,170,204,0.5); }
    .bvr-row--3 .num { color:var(--clr-bronze);     text-shadow:0 0 18px rgba(224,148,84,0.6); }
    .bvr-row--1 .song { color:var(--clr-gold-tint); }
    .bvr-row--2 .song { color:#ccdde8; }
    .bvr-row--3 .song { color:#fde8d0; }
    .bvr-row--1 .artist { color:var(--clr-gold-tint); }
    .bvr-row--2 .artist { color:#ccdde8; }
    .bvr-row--3 .artist { color:#fde8d0; }
    .bvr-row--1 .lang { color:rgba(224,176,64,0.85); }
    .bvr-row--2 .lang { color:rgba(148,196,220,0.85); }
    .bvr-row--3 .lang { color:rgba(224,160,100,0.8); }
    .bvr-tbl .pts--jury  { color:var(--clr-accent-light); }
    .bvr-tbl .pts--tele  { color:var(--clr-pink-light); }
    .bvr-row--shadow td { background:var(--clr-shadow-bg); color:var(--clr-text-4); }
    .bvr-num-shadow { font-family:var(--font-display); font-size:16px; font-weight:400; font-style:normal; position:relative; top:-4px; }
    .bvr-row--shadow .pts--jury, .bvr-row--shadow .pts--tele { color:var(--clr-text-4); }
    .bvr-row--shadow .pts--total { color:var(--clr-text-4); }
    .bvr-row--shadow .song, .bvr-row--shadow .artist { color:var(--clr-text-4); }
    .bvr-row--shadow .member { color:var(--clr-text-4); }
    .bvr-row--shadow .num { color:var(--clr-text-4); }  /* 覆盖 .bvr-tbl .num 默认 text-3，使名次与整行一致弱化 */
    .bvr-row--shadow .lang { color:var(--clr-text-4); }  /* 覆盖 .bvr-tbl .lang 默认 text-3 */
    .bvr-shadow-tag { display:inline-block; white-space:nowrap; font-size:9px; border:1px solid var(--clr-border-2); border-radius:2px;
      padding:0 4px; margin-left:6px; color:var(--clr-text-4); font-style:normal; }
    .bvr-joint-tag { display:inline-block; white-space:nowrap; font-size:9px; border:1px solid var(--clr-border-2); border-radius:2px;
      padding:0 4px; margin-left:6px; color:var(--clr-text-3); font-style:normal; }
    .member--unclaimed { color:var(--clr-text-3); }
    .member--unclaimed:hover { color:var(--clr-text-2); }
    /* 计分板内的混淆曲行：弱化（仍显示其得票），选送者显示斜体「匿名」 */
    .bvr-mtx tbody tr.bvr-mtx-row--shadow td { color:var(--clr-text-3) !important; }
    .bvr-anon, .bvr-anon .member { font-style:italic; }
    .bvr-anon .member { color:var(--clr-text-3); }
    .bvr-mtx tbody tr.bvr-mtx-row--shadow .rcp .member { color:var(--clr-text-3) !important; font-style:italic; }
    .bvr-mtx-note { font-size:11px; color:var(--clr-text-3); margin-top:8px; }
    .bvr-tbl-note { font-size:11px; color:var(--clr-text-3); margin-top:10px; }
    /* 联合选送：结果表内两人上下排列；矩阵/12分内斜杠分隔 */
    .bvr-joint { display:inline-flex; flex-direction:column; gap:1px; vertical-align:middle; }
    .bvr-joint-sep { opacity:0.4; margin:0 1px; }

    /* ----- matrix ----- */
    .bvr-mw { overflow-x:auto; border:1px solid var(--clr-border); border-radius:8px;
      display:inline-block; max-width:100%; vertical-align:top; }
    table.bvr-mtx { border-collapse:separate; border-spacing:0; font-size:11px; font-family:var(--font-mono);
      -webkit-text-size-adjust:100%; text-size-adjust:100%; }  /* 禁移动端文字自动膨胀：防宽 colspan 的「Jury Vote」比窄「Tele Vote」被放大 */
    /* 单元格只画右/下边框（左/上边框由 .bvr-mw 外框提供）——避免折叠边框被粘性列盖不住而漏光 */
    .bvr-mtx th, .bvr-mtx td { border-right:1px solid var(--clr-border); border-bottom:1px solid var(--clr-border);
      padding:5px 7px; text-align:center; white-space:nowrap; }
    .bvr-mtx thead th { background:var(--clr-surface); color:var(--clr-text-2); font-weight:700;
      font-family:var(--font-body); }
    .bvr-mtx .mtx-grp { letter-spacing:0.06em; }
    .bvr-mtx .mtx-grp--jury { color:var(--clr-accent-light); }
    .bvr-mtx .mtx-grp--tele { color:var(--clr-pink-light); }
    .bvr-mtx .mtx-corner { background:var(--clr-bg); }
    .bvr-mtx .rcp { text-align:left; font-family:var(--font-body); color:var(--clr-text);
      position:sticky; left:0; background:var(--clr-bg); z-index:3; }
    .bvr-mtx .tot { color:var(--clr-text); font-weight:700; background:var(--clr-surface); }
    .bvr-mtx .sj  { color:var(--clr-accent-light); background:var(--clr-surface); }
    .bvr-mtx .st  { color:var(--clr-pink-light);    background:var(--clr-surface); }
    /* 计分板冻结窗格：桌面与手机均冻结 选送者+Total+Jury+Tele（left 偏移由 JS 量列宽写入） */
    .bvr-mtx .tot { position:sticky; left:var(--mtx-l-tot,0); z-index:2; }
    .bvr-mtx .sj  { position:sticky; left:var(--mtx-l-sj,0);  z-index:2; }
    .bvr-mtx .st  { position:sticky; left:var(--mtx-l-st,0);  z-index:2; }
    .bvr-mtx thead .rcp, .bvr-mtx thead .tot, .bvr-mtx thead .sj, .bvr-mtx thead .st { z-index:5; }
    .bvr-mtx tbody .tot, .bvr-mtx tbody .sj, .bvr-mtx tbody .st { font-family:var(--font-body); font-size:13px; }
    .bvr-mtx .vsep { border-left:2px solid var(--clr-border-2); }
    .bvr-mtx td.pt { color:var(--clr-text-2); font-size:12px; }
    .bvr-mtx td.pt--12 { color:var(--clr-gold-light); font-weight:700; }
    .bvr-mtx td.self { background-color:rgba(255,255,255,0.05);
      background-image:repeating-linear-gradient(45deg,
        rgba(255,255,255,0.13),rgba(255,255,255,0.13) 2px,transparent 2px,transparent 5px); }

    /* ----- 12-points（三列：选送者 | Jury 组 | Tele 组，跨行对齐） ----- */
    .bvr-12 { display:grid; grid-template-columns:max-content minmax(0,1fr) minmax(0,1fr);
      border:1px solid var(--clr-border); border-radius:8px; overflow:hidden; }
    .bvr-12e { display:contents; }
    .bvr-12__r, .bvr-12__c { padding:8px 14px; border-bottom:1px solid var(--clr-border); font-size:12px; }
    .bvr-12e:last-child .bvr-12__r, .bvr-12e:last-child .bvr-12__c { border-bottom:none; }
    .bvr-12__r { display:flex; align-items:center; font-weight:600; white-space:nowrap; }
    .bvr-12__r .member { color:var(--clr-text); }
    .bvr-12__r .bvr-anon .member { color:var(--clr-text-3); }  /* 混淆选送者：保留斜体、颜色弱化为 text-3 */
    .bvr-12__n { font-family:var(--font-display); font-weight:400; font-size:17px; line-height:1;
      color:var(--clr-text-3); margin-right:10px; }  /* 与结果表「4 名及以后」名次同色 */
    .bvr-12__c { color:var(--clr-text-2); line-height:1.9; }
    .bvr-12__c .member { margin-right:10px; }
    .bvr-12tag { font-size:10px; font-weight:700; letter-spacing:0.04em; margin-right:6px; }
    .bvr-12tag--jury { color:var(--clr-accent-light); }
    .bvr-12tag--tele { color:var(--clr-pink-light); }

    /* ----- intros / rules ----- */
    .bvr-intro { border:1px solid var(--clr-border); border-radius:8px; padding:16px 18px; margin-bottom:10px; }
    .bvr-intro__hd { display:flex; align-items:baseline; gap:10px; flex-wrap:wrap; margin-bottom:6px; }
    .bvr-intro__song { font-size:14px; font-weight:700; color:var(--clr-text); }
    .bvr-intro__artist { font-size:12px; color:var(--clr-text-2); }
    .bvr-intro__by { font-size:11px; color:var(--clr-text-3); margin-left:auto; }
    .bvr-intro__txt { font-size:13px; color:var(--clr-text-2); line-height:1.7; white-space:pre-wrap; }
    .bvr-empty { font-size:13px; color:var(--clr-text-3); border:1px dashed var(--clr-border-2);
      border-radius:8px; padding:18px; text-align:center; }
    .bvr-rules { border:1px solid var(--clr-border); border-radius:8px; padding:18px 20px; }
    .bvr-rules dl { display:grid; grid-template-columns:auto 1fr; gap:8px 18px; margin:0; }
    .bvr-rules dt { font-size:11px; font-weight:700; letter-spacing:0.06em; text-transform:uppercase;
      color:var(--clr-violet-light); white-space:nowrap; }
    .bvr-rules dd { margin:0; font-size:13px; color:var(--clr-text-2); line-height:1.65; }
    .bvr-rules dd .niche { display:flex; flex-wrap:wrap; gap:4px 8px; }
    .bvr-rules dd .niche code { font-family:var(--font-body); font-size:11px; color:var(--clr-text-2);
      background:var(--clr-surface); padding:1px 6px; border-radius:3px; }
    .bvr-src { margin-top:12px; font-size:11px; color:var(--clr-text-3); }

    /* ----- TOC (沿用 hof) ----- */
    .bvr-toc { position:fixed; right:19px; bottom:90px; z-index:90; display:flex; flex-direction:column;
      gap:1px; opacity:0; visibility:hidden; transition:opacity 0.25s,visibility 0.25s; }
    .bvr-toc--visible { opacity:1; visibility:visible; }
    .bvr-toc__item { font-family:var(--font-body); font-size:11px; color:var(--clr-text-3); cursor:pointer;
      padding:3px 13px 3px 0; position:relative; transition:color 0.15s; line-height:1.5; white-space:nowrap;
      user-select:none; text-align:right; }
    .bvr-toc__item::after { content:''; position:absolute; right:3px; top:50%; transform:translateY(-50%);
      width:5px; height:5px; border-radius:50%; background:var(--clr-violet-light); opacity:0; transition:opacity 0.2s; }
    .bvr-toc__item:not(.bvr-toc__item--active):hover { color:var(--clr-text); }
    .bvr-toc__item--active { color:var(--clr-violet-light); }
    .bvr-toc__item--active::after { opacity:1; animation:bvr-breathe 3s ease-in-out infinite; }
    @keyframes bvr-breathe { 0%,100%{opacity:1;transform:translateY(-50%) scale(1);} 50%{opacity:0.35;transform:translateY(-50%) scale(0.65);} }

    /* 宽表横向滚动提示（手机常显 / 桌面溢出时由 JS 显示）——格式与「注」(.bvr-mtx-note) 一致 */
    .bvr-scroll-hint { display:none; font-size:11px; color:var(--clr-text-3); margin-bottom:7px; }
    /* section body 内的 fade-up（.section__inner 直接子节点）清零 style.css 泄漏的 :nth-child 错落延迟，
       使其纯靠 IntersectionObserver 按滚动位置自上而下逐个淡入（header 的 label/title 嵌在 .bvr-sec__hd 内、不受影响、保留错落） */
    .bvr-sec .section__inner > .fade-up { transition-delay: 0s; }

    @media (max-width:768px) {
      .bvr-toc { display:none; }
      .bvr-scroll-hint { display:block; }
      /* Scoreboard / 12 Points 子标题：手机端略收字号 + 上间距（桌面 18px / 48px） */
      .bvr-dvr-sub { font-size:16px; margin-top:36px; }

      /* 结果概览：保留横向滚动表，手机端压缩间距 + 分数字号统一为歌手/歌名大小(13px，#除外) */
      .bvr-tbl tbody td { padding-top:8px; padding-bottom:8px; }
      .bvr-tbl th, .bvr-tbl td { padding-left:9px; padding-right:9px; }
      .bvr-tbl .pts { font-size:13px; }
      .bvr-tbl .pts--total { font-size:13px; }
      /* 名次列缩窄 + 收紧与选送者间距（手机省空间）；表头同步对齐 */
      .bvr-tbl tbody .num { width:28px; padding-right:5px; }
      .bvr-tbl tbody .num + td { padding-left:5px; }
      .bvr-tbl thead th:first-child { width:28px; padding-right:5px; text-align:center; }
      .bvr-tbl thead th:nth-child(2) { padding-left:5px; }
      /* 手机省空间：@名改用昵称（X妈 格式），链接/tooltip 仍有效；桌面不变 */
      .bvr-tbl .member, .bvr-mtx .member, .bvr-12 .member { font-size:0; }
      .bvr-tbl .member::before { content:attr(data-nickname); font-size:13px; }
      .bvr-mtx .member::before { content:attr(data-nickname); font-size:11px; }
      .bvr-12 .member::before  { content:attr(data-nickname); font-size:12px; }
      /* 结果概览：手机端横滑时冻结 名次/选送者/歌手 前三列（left 偏移由 JS 量列宽写入） */
      table.bvr-tbl { border-collapse:separate; border-spacing:0; }
      .bvr-tbl thead th:nth-child(-n+3), .bvr-tbl tbody td:nth-child(-n+3) { position:sticky; z-index:2; }
      .bvr-tbl tbody td:nth-child(-n+3) { background:var(--clr-bg); }       /* 正文冻结列底＝行底色(透明=bg) */
      .bvr-tbl thead th:nth-child(-n+3) { background:var(--clr-surface); z-index:4; }  /* 表头冻结列底＝表头 surface（与滚动表头一致） */
      .bvr-tbl th:nth-child(1), .bvr-tbl td:nth-child(1) { left:0; }
      .bvr-tbl th:nth-child(2), .bvr-tbl td:nth-child(2) { left:var(--tbl-l-mem,28px); }
      .bvr-tbl th:nth-child(3), .bvr-tbl td:nth-child(3) { left:var(--tbl-l-art,90px); }
      /* 奖牌/混淆行：行渐变在固定列不可用，冻结列补纯色底（提权盖过默认 bg），与滚动列一致、完全不透明防漏光 */
      .bvr-tbl tbody .bvr-row--1 td:nth-child(-n+3) { background:linear-gradient(rgba(212,168,50,0.14),rgba(212,168,50,0.14)),var(--clr-bg); }
      .bvr-tbl tbody .bvr-row--2 td:nth-child(-n+3) { background:linear-gradient(rgba(110,150,178,0.11),rgba(110,150,178,0.11)),var(--clr-bg); }
      .bvr-tbl tbody .bvr-row--3 td:nth-child(-n+3) { background:linear-gradient(rgba(196,120,68,0.12),rgba(196,120,68,0.12)),var(--clr-bg); }
      .bvr-tbl tbody .bvr-row--shadow td:nth-child(-n+3) { background:var(--clr-shadow-bg); }
      /* 注释里的 @名在手机端也显示昵称 */
      .bvr-mtx-note .member { font-size:0; }
      .bvr-mtx-note .member::before { content:attr(data-nickname); font-size:11px; }
      /* 12 Points 改单列堆叠：每条目为对称 padding 块，内部行紧凑 */
      .bvr-12 { display:block; }
      .bvr-12e { display:block; border-top:1px solid var(--clr-border); padding:10px 14px; }
      .bvr-12e:first-child { border-top:none; }
      .bvr-12__r, .bvr-12__c { border-bottom:none; padding:1px 0; }
      .bvr-12__r { padding-bottom:3px; }
      .bvr-12__c { display:block; line-height:1.45; }
      .bvr-12__c + .bvr-12__c { margin-top:2px; }
      .bvr-12__c:empty { display:none; }

      /* 上一届/下一届：手机用 grid 两等分（各占半边）；缺一侧时占位 spacer 占住另一半格（视觉＝另一半按钮被隐藏）。
         选择器加 .section__inner / 后代提权——media 块位于基础 .bvr-nav 定义之前，同特异度会被后写的基础规则盖掉（参 #36） */
      .bvr-nav.section__inner { display:grid; grid-template-columns:minmax(0,1fr) minmax(0,1fr); gap:10px; }
      .bvr-nav .bvr-nav__btn { min-width:0; gap:8px; justify-content:center; padding:11px 12px; }
      .bvr-nav .bvr-nav__btn > span:not(.bvr-nav__arrow) { min-width:0; }  /* 文本块可收缩 */
      .bvr-nav .bvr-nav__name { white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }  /* 超长届名省略号兜底 */
    }
    .bvr-mc-wrap { overflow-x:auto; border:1px solid var(--clr-border); border-radius:10px; margin-top:8px; scrollbar-width:none; }
    .bvr-mc-wrap::-webkit-scrollbar { display:none; }
    .bvr-mc { width:100%; border-collapse:collapse; font-size:14px; min-width:340px; }
    .bvr-mc th { text-align:left; font-size:11px; font-weight:700; letter-spacing:0.05em; text-transform:uppercase; color:var(--clr-text-2); padding:12px 16px; background:var(--clr-surface); border-bottom:1px solid var(--clr-border-2); white-space:nowrap; }
    .bvr-mc td { padding:12px 16px; border-bottom:1px solid var(--clr-border); vertical-align:middle; }
    .bvr-mc tr:last-child td { border-bottom:none; }
    .bvr-mc__badge { display:inline-block; font-size:11px; font-weight:600; padding:3px 12px; border-radius:5px; white-space:nowrap; }
    .bvr-mc--cont  .bvr-mc__badge { color:var(--clr-board-light); background:rgba(111,158,195,0.12); }
    .bvr-mc--first .bvr-mc__badge { color:var(--clr-violet-light); background:var(--clr-violet-dim); }
    .bvr-mc--ret   .bvr-mc__badge { color:var(--clr-gold-light); background:rgba(245,200,64,0.12); }
    .bvr-mc--left  .bvr-mc__badge { color:var(--clr-pink-light); background:var(--clr-pink-dim); }
    .bvr-mc__mem { line-height:2.1; font-size:12px; }
    .bvr-mc__mem .member { margin-right:14px; }
    .bvr-mc__n { font-family:var(--font-display); font-size:20px; color:var(--clr-text); text-align:center; width:60px; }
    /* margin-top 负值抵消上一 .section 的底部 padding(var(--gap-xl))，使距正文约 48px（桌面/手机一致） */
    .bvr-nav { display:flex; justify-content:space-between; gap:16px; margin-top:calc(48px - var(--gap-xl)); padding:0 var(--gap-md) 12px; }
    .bvr-nav__btn { display:inline-flex; align-items:center; gap:14px; padding:8px 18px; line-height:1.25; border:1px solid var(--clr-border); border-radius:8px; background:var(--clr-surface); color:var(--clr-text-2); text-decoration:none; transition:border-color .2s,color .2s,background .2s; }
    .bvr-nav__btn:hover { border-color:var(--clr-pink-light); color:var(--clr-text); background:var(--clr-surface-2); }
    .bvr-nav__btn:hover .bvr-nav__arrow { color:var(--clr-pink-light); }
    .bvr-nav__btn:hover .bvr-nav__name, .bvr-nav__btn:hover .bvr-nav__lbl { color:var(--clr-red-light); }
    .bvr-nav__btn--next { text-align:right; }
    .bvr-nav__arrow { font-size:18px; color:var(--clr-text-3); transition:color .2s; }
    .bvr-nav__lbl { display:block; font-size:10px; letter-spacing:0.1em; text-transform:uppercase; color:var(--clr-text-3); transition:color .2s; }
    .bvr-nav__name { display:block; font-size:13px; font-weight:600; color:var(--clr-text-3); transition:color .2s; }
    `;
    var st = document.createElement('style');
    st.textContent = css;
    document.head.appendChild(st);
  }

  /* ---------- section builders ---------- */
  function buildHero(d) {
    // 标题去掉罗马数字后缀；序数词（1st/2nd…）染粉色
    var name = esc(d.edition_name).replace(/(\d+(?:st|nd|rd|th))/i, '<span class="bvr-ord">$1</span>');
    var bits = [];
    if (d.cn_name) bits.push(esc(d.cn_name));
    bits.push('Barvision ' + (d.city ? esc(d.city) + ' ' : '') + esc(d.year));
    if (d.host) bits.push('主办：' + esc(d.host));
    if (d.motto) bits.push('<span class="bvr-meta__motto">' + esc(d.motto) + '</span>');
    var meta = bits.map(function (b) { return '<span>' + b + '</span>'; })
      .join('<span class="bvr-meta__sep">｜</span>');
    return '' +
      '<section class="bvr-hero">' +
      '<div class="bvr-hero__glow"></div><div class="bvr-hero__grid"></div>' +
      '<div class="bvr-hero__wm">' + roman(d.edition_no) + '</div>' +
      '<div class="bvr-hero__inner section__inner">' +
      '<a class="bvr-eyebrow fade-up" href="/barvision.html"><span>←</span><span>Barvision</span></a>' +
      '<h1 class="bvr-title fade-up" style="transition-delay:0.08s;">' + name + '</h1>' +
      '<div class="bvr-meta fade-up" style="transition-delay:0.16s;">' + meta + '</div>' +
      (d.summary ? '<p class="bvr-desc fade-up" style="transition-delay:0.22s;">' + esc(d.summary) + '</p>' : '') +
      '</div></section>';
  }

  // header 复用全站全局类（渐变横杠 section-label + Bebas section__title + subtitle），对标 2026 events.html
  function section(id, cnLabel, enTitle, subtitle, bodyHtml) {
    return '<section class="section section--bordered bvr-sec" id="' + id + '" ' +
      'style="scroll-margin-top:calc(var(--nav-h) - 2px)"><div class="section__inner">' +
      '<div class="bvr-sec__hd">' +
        '<p class="section-label fade-up">' + esc(cnLabel) + '</p>' +
        '<h2 class="section__title fade-up" style="margin-top:24px;font-size:clamp(24px,3.5vw,48px);">' + esc(enTitle) + '</h2>' +
        (subtitle ? '<p class="section__subtitle fade-up" style="margin-top:24px;font-size:14px;">' + subtitle + '</p>' : '') +
      '</div>' +
      bodyHtml + '</div></section>';
  }

  function matchTitle(m) {
    if (m.venue) return esc(m.venue) + (m.match ? ' <span style="color:var(--clr-text-3)">(' + esc(m.match) + ')</span>' : '');
    if (m.match) return esc(m.match);
    return '';
  }
  // 场次英文段名（用于 multi 场次的 section-label 前缀）
  function matchEng(m) {
    // 场次代码 → section-label 英文前缀（多场次时用）；新增组别在此补，保持「GROUP X」一致
    var MAP = { SF: 'SEMI-FINAL', GF: 'GRAND FINAL', A: 'GROUP A', B: 'GROUP B', C: 'GROUP C', E: 'ENTERTAINMENT' };
    return MAP[m.match] || m.match || esc(m.venue || '');
  }

  // 竞赛式名次（同分同名次，如 1,2,2,4）
  function compRank(arr, key, val) {
    var n = 0, v = val || 0;
    for (var i = 0; i < arr.length; i++) if ((arr[i][key] || 0) > v) n++;
    return n + 1;
  }
  function ptsCell(cls, val, rankArr, key, e) {
    var rank = (e.is_shadow || val == null) ? '' : '<span class="pts-rank">#' + compRank(rankArr, key, val) + '</span>';
    return '<td class="pts ' + cls + '" data-v="' + (val == null ? -1 : val) + '">' +
      '<span class="pts-v">' + fmtScore(val) + '</span>' + rank + '</td>';
  }
  function resultTable(m) {
    var pool = m.entries.filter(function (e) { return !e.is_shadow; });  // 排名只在正式曲目间统计
    var hasTele = (m.votes.voters || []).some(function (v) { return v.type === 'tele'; });  // 该场有无观众分
    var rows = m.entries.map(function (e) {
      var cls = e.is_shadow ? 'bvr-row--shadow' : (e.rank <= 3 ? 'bvr-row--' + e.rank : '');
      return '<tr class="' + cls + '">' +
        '<td class="num"><span>' + (e.is_shadow ? '<span class="bvr-num-shadow">' + esc(e.rank) + '*</span>' : esc(e.rank)) + '</span></td>' +
        '<td>' + (e.member.indexOf('/') > -1 ? '<span class="bvr-joint">' + e.member.split('/').map(function (n) { return memberLink(n.trim()); }).join('') + '</span>' : memberLink(e.member)) + '</td>' +
        '<td class="artist">' + esc(fmtArtist(e.artist)) + '</td>' +
        '<td class="song">' + esc(e.song) + (e.is_shadow ? '<span class="bvr-shadow-tag">混淆</span>' : '') + (e.member.indexOf('/') > -1 ? '<span class="bvr-joint-tag">合报</span>' : '') + '</td>' +
        '<td class="lang">' + esc(e.language || '') + '</td>' +
        ptsCell('pts--jury', e.jury_vote, pool, 'jury_vote', e) +
        (hasTele ? ptsCell('pts--tele', e.tele_vote, pool, 'tele_vote', e) : '') +
        '<td class="pts pts--total" data-v="' + (e.score == null ? -1 : e.score) + '">' + fmtScore(e.score) + '</td>' +
        '</tr>';
    }).join('');
    return '<div class="bvr-scroll-hint fade-up">左右滑动查看完整结果</div>' +
      '<div class="bvr-tw fade-up"><table class="bvr-tbl"><thead><tr>' +
      '<th>名次</th><th>选送者</th><th>歌手</th><th>歌名</th><th>语种</th>' +
      '<th class="th-jury" style="text-align:center">Jury</th>' +
      (hasTele ? '<th class="th-tele" style="text-align:center">Tele</th>' : '') +
      '<th class="th-pts" style="text-align:center">PTS</th>' +
      '</tr></thead><tbody>' + rows + '</tbody></table></div>';
  }

  // 合并矩阵：分组表头(Jury Vote/Tele Vote) + 可排序前 4 列；默认按选送者排（自投格成主对角线）
  function votingMatrix(m, label) {
    // 行顺序：正式曲按结果概览名次在前（m.entries 已按 total↓/tele↓ 排），混淆曲一律排其后、内部按总分降序
    var recips = m.entries.filter(function (e) { return !e.is_shadow; })
      .concat(m.entries.filter(function (e) { return e.is_shadow; })
        .sort(function (a, b) { return (b.score || 0) - (a.score || 0); }));
    // 每位选送者(其官方曲)在 Results 中的位置 → 给评委投票人列排序，使列序与行序一致（对角线）
    var idxOf = {};
    m.entries.forEach(function (e, i) { if (!e.is_shadow && idxOf[e.member] == null) idxOf[e.member] = i; });
    // 投票人列：评委在前(按其官方曲 Results 名次升序)、观众在后 → 自投格沿对角线
    var voters = m.votes.voters.slice().sort(function (a, b) {
      var ta = (a.type === 'tele') ? 1 : 0, tb = (b.type === 'tele') ? 1 : 0;
      if (ta !== tb) return ta - tb;
      var ia = idxOf[a.voter] != null ? idxOf[a.voter] : 9999;
      var ib = idxOf[b.voter] != null ? idxOf[b.voter] : 9999;
      return ia - ib;
    });
    if (!voters.length) return '';
    var juryN = voters.filter(function (v) { return v.type === 'jury'; }).length;
    var teleN = voters.length - juryN;
    var firstTele = juryN;
    var hasTele = teleN > 0;  // 观众投票人数为 0 → 隐藏 Tele 列（计分板 + 结果概览）
    function vsep(i) { return (i === 0 || i === firstTele) ? ' vsep' : ''; }
    var grpRow = '<tr>' +
      '<th class="rcp bvr-th-sort" rowspan="2" data-msort="rcp">' + esc(label) + '</th>' +
      '<th class="tot bvr-th-sort" rowspan="2" data-msort="tot">Total</th>' +
      '<th class="sj bvr-th-sort" rowspan="2" data-msort="sj">Jury</th>' +
      (hasTele ? '<th class="st bvr-th-sort" rowspan="2" data-msort="st">Tele</th>' : '') +
      (juryN ? '<th class="mtx-grp mtx-grp--jury vsep" colspan="' + juryN + '">Jury Vote</th>' : '') +
      (teleN ? '<th class="mtx-grp mtx-grp--tele vsep" colspan="' + teleN + '">Tele Vote</th>' : '') +
      '</tr>';
    var colRow = '<tr>' +
      voters.map(function (v, i) {
        // 合报投票人「A妈/B妈」→「A/B」（去各段末尾「妈」省空间）；单人保持全名
        var lbl = v.voter.indexOf('/') > -1
          ? v.voter.split('/').map(function (s) { return esc(s.trim().replace(/妈$/, '')); }).join('/')
          : esc(v.voter);
        return '<th class="' + (v.type === 'tele' ? 'vt' : 'vj') + vsep(i) + '">' + lbl + '</th>';
      }).join('') + '</tr>';
    var body = recips.map(function (e) {
      var cells = voters.map(function (v, i) {
        var sep = vsep(i);
        // 混淆曲匿名弱化，不显示「禁自投」斜杠格（正常格处理，无票则空）
        if (!e.is_shadow && v.voter === e.member) return '<td class="self' + sep + '"></td>';
        var p = v.points[e.eid != null ? e.eid : e.member];  // eid 键(三四届)兼容昵称键(一二届)
        if (p == null || p === 0) return '<td class="pt' + sep + '"></td>';  // 0 分不显示
        return '<td class="pt' + (p === 12 ? ' pt--12' : '') + sep + '">' + p + '</td>';
      }).join('');
      return '<tr' + (e.is_shadow ? ' class="bvr-mtx-row--shadow"' : '') + '><td class="rcp">' + (e.is_shadow ? '<span class="bvr-anon">' + memberLink(e.member) + '</span>' : memberLink(e.member)) + '</td>' +
        '<td class="tot">' + fmtScore(e.score) + '</td>' +
        '<td class="sj">' + fmtScore(e.jury_vote) + '</td>' +
        (hasTele ? '<td class="st">' + fmtScore(e.tele_vote) + '</td>' : '') + cells + '</tr>';
    }).join('');
    var notes = [];
    if (m.note) notes.push(fmtNote(m.note));
    if (m.entries.some(function (e) { return e.is_shadow; })) notes.push('斜体昵称为混淆歌曲选送者');
    var noteHtml = notes.length === 1 ? '<p class="bvr-mtx-note fade-up">注：' + notes[0] + '</p>'
      : notes.length > 1 ? '<div class="bvr-mtx-note fade-up">' + notes.map(function (n, i) { return '注' + (i + 1) + '：' + n; }).join('<br>') + '</div>' : '';
    return '<div class="bvr-scroll-hint fade-up">左右滑动查看完整计分板</div>' +
      '<div class="bvr-mw fade-up"><table class="bvr-mtx">' +
      '<thead>' + grpRow + colRow + '</thead><tbody>' + body + '</tbody></table></div>' +
      noteHtml;
  }
  // 注释里的 {m:昵称} 渲染为 memberLink（桌面 @名 / 手机昵称）；其余文本转义
  function fmtNote(s) {
    return String(s).split(/(\{m:[^}]+\})/).map(function (part) {
      var mm = part.match(/^\{m:([^}]+)\}$/);
      return mm ? memberLink(mm[1]) : esc(part);
    }).join('');
  }

  // 12 分合并表：每首获 12 分的歌一行（按条目 eid 聚合，避免同名成员官方/混淆串台），区分评委/观众给分
  function twelveBlock(m) {
    var byEid = {};
    (m.entries || []).forEach(function (e) { byEid[e.eid != null ? e.eid : e.member] = e; });  // eid 键(三四届)兼容昵称键(一二届)
    var got = {};  // eid -> {jury:[], tele:[]}
    m.votes.voters.forEach(function (v) {
      Object.keys(v.points).forEach(function (r) {
        if (v.points[r] === 12) { (got[r] = got[r] || { jury: [], tele: [] })[v.type].push(v.voter); }
      });
    });
    var recips = Object.keys(got).sort(function (a, b) {
      return (got[b].jury.length + got[b].tele.length) - (got[a].jury.length + got[a].tele.length);
    });
    if (!recips.length) return '<div class="bvr-empty fade-up">本场无 12 分记录。</div>';
    function givers(arr) { return arr.map(function (g) { return memberLink(g); }).join(''); }
    function grp(type, arr) {
      return '<span class="bvr-12tag bvr-12tag--' + type + '">' + (type === 'jury' ? 'Jury' : 'Tele') + '</span>' + givers(arr);
    }
    function recipLabel(eid) {
      var e = byEid[eid]; if (!e) return memberLink(eid);
      var lk = memberLink(e.member);
      return e.is_shadow ? '<span class="bvr-anon">' + lk + '</span>' : lk;
    }
    // 三列：选送者 | Jury 组 | Tele 组；无 Jury 时 Tele 占第二列
    var cells = recips.map(function (r) {
      var j = got[r].jury, t = got[r].tele, c2 = '', c3 = '';
      if (j.length) { c2 = grp('jury', j); if (t.length) c3 = grp('tele', t); }
      else if (t.length) { c2 = grp('tele', t); }
      return '<div class="bvr-12e"><span class="bvr-12__r"><span class="bvr-12__n">' + (j.length + t.length) + '</span>' + recipLabel(r) + '</span>' +
        '<span class="bvr-12__c">' + c2 + '</span>' +
        '<span class="bvr-12__c">' + c3 + '</span></div>';
    }).join('');
    return '<div class="bvr-12 fade-up">' + cells + '</div>';
  }

  function introsBlock(m) {
    var withIntro = m.entries.filter(function (e) { return e.intro; });
    if (!withIntro.length) {
      return '<div class="bvr-empty fade-up">本届歌曲介绍待补充。</div>';
    }
    return withIntro.map(function (e) {
      return '<div class="bvr-intro fade-up"><div class="bvr-intro__hd">' +
        '<span class="bvr-intro__song">' + esc(e.song) + '</span>' +
        '<span class="bvr-intro__artist">' + esc(e.artist) + '</span>' +
        '<span class="bvr-intro__by">' + memberLink(e.member, { nick: true }) + '</span></div>' +
        '<div class="bvr-intro__txt">' + esc(e.intro) + '</div></div>';
    }).join('');
  }

  function rulesBlock(d) {
    var r = d.rules || {};
    var dl = '';
    if (r.submission) dl += '<dt>报名</dt><dd>' + esc(r.submission) + '</dd>';
    if (r.niche_standard) dl += '<dt>要求</dt><dd><span class="niche">' +
      r.niche_standard.map(function (x) { return '<code>' + esc(x) + '</code>'; }).join('') + '</span></dd>';
    if (r.format) dl += '<dt>赛制</dt><dd>' + esc(r.format) + '</dd>';
    if (r.voting) dl += '<dt>投票</dt><dd>' + esc(r.voting) + '</dd>';
    if (!dl) return '';
    return '<div class="bvr-rules fade-up"><dl>' + dl + '</dl>' +
      (d.source ? '<div class="bvr-src">来源：' + esc(d.source) + '</div>' : '') + '</div>';
  }

  /* ---------- TOC ---------- */
  function buildTOC(items) {
    var nav = document.createElement('nav');
    nav.className = 'bvr-toc';
    nav.setAttribute('aria-label', '页内目录');
    nav.innerHTML = items.map(function (it) {
      return '<div class="bvr-toc__item" data-target="' + it.id + '">' + esc(it.label) + '</div>';
    }).join('');
    document.body.appendChild(nav);
    nav.classList.add('bvr-toc--visible');  // hero 较短，目录加载即显示（不绑定滚动阈值）

    var els = Array.prototype.slice.call(nav.querySelectorAll('.bvr-toc__item'));
    var navH = 72, suppress = false, timer = null;
    window.addEventListener('scroll', function () {
      if (suppress) { clearTimeout(timer); timer = setTimeout(function () { suppress = false; }, 200); }
    }, { passive: true });
    var obs = new IntersectionObserver(function (entries) {
      if (suppress) return;
      entries.forEach(function (e) {
        if (e.isIntersecting) els.forEach(function (it) {
          it.classList.toggle('bvr-toc__item--active', it.dataset.target === e.target.id);
        });
      });
    }, { rootMargin: '-' + navH + 'px 0px -55% 0px' });
    els.forEach(function (it) {
      var t = document.getElementById(it.dataset.target);
      if (t) obs.observe(t);
      it.addEventListener('click', function () {
        var t = document.getElementById(it.dataset.target);
        if (!t) return;
        suppress = true; clearTimeout(timer);
        els.forEach(function (x) { x.classList.toggle('bvr-toc__item--active', x === it); });
        window.scrollTo({ top: t.getBoundingClientRect().top + window.scrollY - navH + 2, behavior: 'smooth' });
      });
    });
  }

  /* ---------- fade-up observer ---------- */
  function observeFades() {
    if (!('IntersectionObserver' in window)) {
      document.querySelectorAll('.fade-up').forEach(function (el) { el.classList.add('visible'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); }
      });
    }, { threshold: 0.06 });
    document.querySelectorAll('.fade-up').forEach(function (el) { io.observe(el); });
  }

  /* ---------- 交互式排序：点击 Jury/Tele/Points 表头按该列排序 ---------- */
  function wireSortable() {
    document.querySelectorAll('.bvr-tbl').forEach(function (tbl) {
      var tbody = tbl.tBodies[0];
      if (!tbody) return;
      var state = { cls: null, dir: -1 };
      tbl.querySelectorAll('thead th.th-jury, thead th.th-tele, thead th.th-pts').forEach(function (th) {
        th.classList.add('bvr-th-sort');
        var cls = th.classList.contains('th-jury') ? 'pts--jury'
          : th.classList.contains('th-tele') ? 'pts--tele' : 'pts--total';
        th.addEventListener('click', function () {
          if (state.cls === cls) state.dir = -state.dir; else { state.cls = cls; state.dir = -1; }
          var rows = Array.prototype.slice.call(tbody.rows);
          rows.sort(function (a, b) {
            var va = parseFloat((a.querySelector('.' + cls) || {}).getAttribute('data-v')) || 0;
            var vb = parseFloat((b.querySelector('.' + cls) || {}).getAttribute('data-v')) || 0;
            return (va - vb) * state.dir;
          });
          rows.forEach(function (r) { tbody.appendChild(r); });
          tbl.querySelectorAll('thead th').forEach(function (h) { h.removeAttribute('data-sort'); });
          th.setAttribute('data-sort', state.dir < 0 ? 'desc' : 'asc');
        });
      });
    });
  }

  /* ---------- 矩阵排序：选送者(默认对角线) / Total / Jury / Tele ---------- */
  function wireMatrixSort() {
    document.querySelectorAll('.bvr-mtx').forEach(function (tbl) {
      var tbody = tbl.tBodies[0]; if (!tbody) return;
      var defaultOrder = Array.prototype.slice.call(tbody.rows);
      var heads = Array.prototype.slice.call(tbl.querySelectorAll('thead th[data-msort]'));
      var state = { col: 'rcp', dir: 1 };
      function indicate() {
        heads.forEach(function (h) { h.removeAttribute('data-sort'); });
        var th = heads.find(function (h) { return h.dataset.msort === state.col; });
        if (th) th.setAttribute('data-sort', state.dir < 0 ? 'desc' : 'asc');
      }
      indicate();  // 默认选送者排序
      heads.forEach(function (th) {
        th.addEventListener('click', function () {
          var col = th.dataset.msort;
          if (state.col === col) state.dir = -state.dir;
          else { state.col = col; state.dir = (col === 'rcp') ? 1 : -1; }
          var rows;
          if (col === 'rcp') {
            rows = defaultOrder.slice();
            if (state.dir < 0) rows.reverse();
          } else {
            rows = Array.prototype.slice.call(tbody.rows).sort(function (a, b) {
              var va = parseFloat((a.querySelector('.' + col) || {}).textContent) || 0;
              var vb = parseFloat((b.querySelector('.' + col) || {}).textContent) || 0;
              return (va - vb) * state.dir;
            });
          }
          rows.forEach(function (r) { tbody.appendChild(r); });
          indicate();
        });
      });
    });
  }

  /* ---------- render ---------- */
  function render(d, idx) {
    DATA = d;
    EDIDX = idx || { editions: [] };
    document.title = d.edition_name + ' | Barvision';
    var root = document.getElementById('bvr-root');
    var html = buildHero(d);
    var toc = [];

    // 1) 赛制
    var rb = rulesBlock(d);
    if (rb) { html += section('rules', '赛制', 'Rules', '', rb); toc.push({ id: 'rules', label: '赛制' }); }

    // 1.5) 成员变动
    var mc = memberChangesBlock(d);
    if (mc) { html += section('changes', '成员变动', 'Roster Changes', '', mc); toc.push({ id: 'changes', label: '成员变动' }); }

    // 2) 每个 match：结果概览 + Detailed voting results（Split / 矩阵 / 12 分）
    var multi = d.matches.length > 1;
    d.matches.forEach(function (m, mi) {
      var pfx = multi ? (matchEng(m) + ' ') : '';
      var venue = esc(m.venue || '');

      var rid = 'result' + (multi ? mi : '');
      html += section(rid, pfx + '结果概览', 'Results', '', resultTable(m));
      toc.push({ id: rid, label: (multi ? venue + '结果概览' : '结果概览') });

      var mtx = votingMatrix(m, '选送者');
      var dvr = '';
      if (mtx) dvr += '<div class="bvr-dvr-sub bvr-dvr-sub--matrix fade-up">Scoreboard</div>' + mtx;
      dvr += '<div class="bvr-dvr-sub bvr-dvr-sub--12 fade-up">12 Points</div>' + twelveBlock(m);

      var did = 'dvr' + (multi ? mi : '');
      html += section(did, pfx + '投票详情', 'Detailed Voting Results', '', dvr);
      toc.push({ id: did, label: (multi ? venue + '投票详情' : '投票详情') });
    });

    // 3) 上一届 / 下一届
    html += navBlock(d);

    root.innerHTML = html;
    buildTOC(toc);
    observeFades();
    wireSortable();
    wireMatrixSort();
    stickyMatrixCols();
    stickyResultCols();
    updateScrollHints();
    var _smt;
    window.addEventListener('resize', function () { clearTimeout(_smt); _smt = setTimeout(function () { stickyMatrixCols(); stickyResultCols(); updateScrollHints(); }, 150); });
  }

  // 「左右滑动…」提示：手机端常显；桌面端仅当表格确实溢出（需横滑）时显示
  function updateScrollHints() {
    var mobile = window.matchMedia('(max-width:768px)').matches;
    document.querySelectorAll('.bvr-mw, .bvr-tw').forEach(function (wrap) {
      var hint = wrap.previousElementSibling;
      if (!hint || !hint.classList.contains('bvr-scroll-hint')) return;
      var overflow = wrap.scrollWidth > wrap.clientWidth + 1;
      var show = mobile || overflow;
      hint.style.display = show ? 'block' : 'none';
      // 提示带 fade-up（opacity:0），显示时补 visible 令其淡入（IO 对 display:none 不触发）
      hint.classList.toggle('visible', show);
    });
  }

  // 结果概览冻结（仅手机）：量出 名次/选送者 列宽，写入 left 偏移，冻结 名次/选送者/歌手 三列
  function stickyResultCols() {
    if (window.matchMedia('(min-width:769px)').matches) return;
    document.querySelectorAll('.bvr-tbl').forEach(function (tbl) {
      var row = tbl.tBodies[0] && tbl.tBodies[0].rows[0]; if (!row || row.cells.length < 2) return;
      var lMem = row.cells[0].offsetWidth, lArt = lMem + row.cells[1].offsetWidth;
      tbl.style.setProperty('--tbl-l-mem', lMem + 'px');
      tbl.style.setProperty('--tbl-l-art', lArt + 'px');
    });
  }

  // 计分板冻结（桌面+手机统一）：量出 选送者/Total/Jury 列宽，写入 left 偏移，冻结至 Tele 列
  function stickyMatrixCols() {
    document.querySelectorAll('.bvr-mtx').forEach(function (tbl) {
      var hr = tbl.tHead && tbl.tHead.rows[0]; if (!hr) return;
      var rcp = hr.querySelector('.rcp'), tot = hr.querySelector('.tot'), sj = hr.querySelector('.sj');
      if (!rcp || !tot || !sj) return;
      var lTot = rcp.offsetWidth, lSj = lTot + tot.offsetWidth, lSt = lSj + sj.offsetWidth;
      tbl.style.setProperty('--mtx-l-tot', lTot + 'px');
      tbl.style.setProperty('--mtx-l-sj', lSj + 'px');
      tbl.style.setProperty('--mtx-l-st', lSt + 'px');
    });
  }

  /* ---------- boot ---------- */
  injectCSS();
  var src = (typeof EDITION_SRC !== 'undefined') ? EDITION_SRC : null;
  if (!src) { console.error('bv-results-render: EDITION_SRC 未定义'); return; }
  Promise.all([
    fetch(src).then(function (r) { return r.json(); }),
    fetch('../../data/barvision/editions-index.json').then(function (r) { return r.json(); }).catch(function () { return { editions: [] }; })
  ]).then(function (res) { render(res[0], res[1]); })
    .catch(function (e) { console.error('bv-results-render: 加载失败', e);
      var root = document.getElementById('bvr-root');
      if (root) root.innerHTML = '<section class="section"><div class="section__inner">' +
        '<p style="color:var(--clr-text-2)">赛果数据加载失败。</p></div></section>'; });
})();
