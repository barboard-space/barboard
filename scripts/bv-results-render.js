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

  // 按届主题（2023+ 年度制）：海报 + 双色。无主题年份回退通用紫色 hero。
  // 通用：导入新年份补一条即可（poster 等路径用绝对路径 /，详情页深度不一、依赖服务器访问；c1/c2 主色用于 hero 辉光 / 徽章 / 大计分板场次徽章）。
  var BV_THEME = {
    2023: {
      poster: '/assets/images/barvision/2023/poster.png',
      posterMobile: '/assets/images/barvision/2023/bg.png',  // 手机端 hero 底（无 logo；cover 裁切下完整 logo 显示不全）
      c1: '#f84d39',   // 珊瑚红（主）
      c2: '#1b2f31',   // 墨绿（深，结构 / hero 辉光）
      c2l: '#fbb1a9',  // 浅珊瑚（徽章 / SF2 标识——海报浅红色，取代原墨绿）
      c3: '#fbb1a9',   // 浅珊瑚
      glow: 'radial-gradient(ellipse 78% 58% at 50% 0%, rgba(248,77,57,0.17) 0%, transparent 60%),' +
            'radial-gradient(ellipse 46% 52% at 100% 96%, rgba(60,122,107,0.15) 0%, transparent 55%)'
    },
    2024: {
      poster: '/assets/images/barvision/2024/poster-pink.png',  // 粉版 + logo（桌面 hero 背景，用户试粉版）
      posterMobile: '/assets/images/barvision/2024/bg-pink.png',  // 手机端 hero 底（粉色无 logo，用户指定）
      c1: '#f13b8d',   // 深粉（主：eyebrow / 年份 / meta）
      c2: '#09184e',   // 深 navy（辅助次选 / hero 辉光底）
      c2l: '#fc91c1',  // 浅粉（徽章 / 次要）
      c3: '#fc91c1',   // 浅粉（hero 简介正文）
      glow: 'radial-gradient(ellipse 78% 58% at 50% 0%, rgba(241,59,141,0.16) 0%, transparent 60%),' +
            'radial-gradient(ellipse 46% 52% at 0% 100%, rgba(36,53,115,0.22) 0%, transparent 55%)'
    },
    2025: {
      poster: '/assets/images/barvision/2025/poster.png',  // 橙黄渐变 + logo 右（桌面 hero 背景）
      posterMobile: '/assets/images/barvision/2025/bg-orange.png',  // 手机端 hero 底（橙黄渐变无 logo）
      c1: '#df5a2c',   // 橘红（主：eyebrow / 年份 / meta，由纯红往橘调、降饱和）
      c2: '#5e0f14',   // 深酒红（hero 辉光底）
      c2l: '#f4a259',  // 暖橙（徽章 / 次要）
      c3: '#f4a259',   // 暖橙（hero 简介正文，橙黄渐变）
      glow: 'radial-gradient(ellipse 78% 58% at 50% 0%, rgba(223,90,44,0.18) 0%, transparent 60%),' +
            'radial-gradient(ellipse 46% 52% at 100% 96%, rgba(244,162,89,0.16) 0%, transparent 55%)'
    },
    2026: {
      poster: '/assets/images/barvision/2026/poster.png',  // 蓝/青/紫流光 + logo（桌面 hero 背景）
      posterMobile: '/assets/images/barvision/2026/bg.png',  // 手机端 hero 底（无 logo）
      c1: '#c084fc',   // 软紫（=--clr-violet-light）：eyebrow / 年份 / meta，与 events.html hero 一致（紫色）
      c2: '#1a0f3a',   // 深紫（hero 辉光底）
      c2l: '#c9b3f0',  // 浅紫（次要）
      c3: '#cdbbf3',   // 浅紫（hero 简介正文）
      glow: 'radial-gradient(ellipse 78% 58% at 50% 0%, rgba(168,85,247,0.20) 0%, transparent 60%),' +
            'radial-gradient(ellipse 46% 52% at 100% 96%, rgba(192,132,252,0.14) 0%, transparent 55%)'
    }
  };
  function theme(d) { return (d && BV_THEME[d.year]) || null; }
  function isAnnual(d) {  // 2023+ 两轮半决赛 + 决赛
    var codes = {};
    (d.matches || []).forEach(function (m) { codes[m.match] = 1; });
    return codes.SF1 && codes.SF2 && codes.GF;
  }
  function memberLink(nick, opts) {
    opts = opts || {};
    // 联合选送「A/B」：拆分各自渲染，斜杠分隔
    if (nick && nick.indexOf('/') > -1) {
      return nick.split('/').map(function (n) { return memberLink(n.trim(), opts); })
        .join('<span class="bvr-joint-sep">/</span>');
    }
    var m = DATA && DATA.members && DATA.members[nick];
    // 外部投票人（非榜吧成员，如 Watermelonnew）：弱化、无 @、无链接、无 tooltip
    if (m && m.external) {
      return '<span class="bvr-ext">' + esc(nick) + '</span>';
    }
    // 未认领（混淆曲赛后无人认领）：弱化、无 @、链接到伪成员页 member/0.html
    if (m && m.unclaimed) {
      return '<a class="member member--unclaimed" href="/member/' + m.id + '.html" data-nickname="'
        + esc(nick) + '">' + esc(nick) + '</a>';
    }
    var label = opts.nick ? esc(nick) : ('@' + esc(m ? m.handle : nick));
    if (!m) return '<span class="member">' + label + '</span>';
    return '<a class="member" href="/member/' + m.id + '.html" data-nickname="'
      + esc(nick) + '">' + label + '</a>';
  }
  // 用届次索引 roster 项（{name,id,handle}）渲染链接（不依赖当前届 members）
  function memberLinkR(r) {
    var label = '@' + esc(r.handle || r.name);
    if (!r.id) return '<span class="member">' + label + '</span>';
    return '<a class="member" href="/member/' + r.id + '.html" data-nickname="' + esc(r.name) + '">' + label + '</a>';
  }
  // ── 正文「X妈」提及自动链接 ───────────────────────────────────
  // 用全届花名册(EDIDX) + 本届 members 建全局 昵称→{id,handle} 映射，
  // 仅匹配已知昵称（避免误伤普通文字），单次回调替换、不重复扫描。
  var MENTIONS = {}, MENTION_RE = null;
  function buildMentions(d) {
    MENTIONS = {};
    ((EDIDX && EDIDX.editions) || []).forEach(function (ed) {
      (ed.roster || []).forEach(function (r) {
        if (r.name && r.id != null && !MENTIONS[r.name]) MENTIONS[r.name] = { id: r.id, handle: r.handle || r.name };
      });
    });
    Object.keys((d && d.members) || {}).forEach(function (k) {
      var m = d.members[k];
      if (m && m.id != null && !MENTIONS[k]) MENTIONS[k] = { id: m.id, handle: m.handle || k, unclaimed: m.unclaimed };
    });
    var keys = Object.keys(MENTIONS).sort(function (a, b) { return b.length - a.length; })  // 长昵称优先
      .map(function (s) { return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); });
    MENTION_RE = keys.length ? new RegExp(keys.join('|'), 'g') : null;
  }
  // useNick：显示中文昵称（如「雨妈」）而非 @handle，减少正文中英穿插（仍是可点链接）
  function mentionLink(nick, useNick) {
    var m = MENTIONS[nick];
    if (!m) return esc(nick);
    var label = useNick ? esc(nick) : ('@' + esc(m.handle));
    var cls = m.unclaimed ? 'member member--unclaimed' : 'member';
    return '<a class="' + cls + '" href="/member/' + m.id + '.html" data-nickname="' + esc(nick) + '">' + (m.unclaimed ? esc(nick) : label) + '</a>';
  }
  // 在已转义文本上把已知「X妈」昵称替换成成员链接（单次 replace、回调内不再被扫描）
  function linkMentions(escd, useNick) {
    if (!MENTION_RE) return escd;
    MENTION_RE.lastIndex = 0;
    return escd.replace(MENTION_RE, function (mtch) { return mentionLink(mtch, useNick); });
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
    /* 外部投票人（非榜吧成员）：弱化斜体、无链接、无 tooltip */
    .bvr-ext { color:var(--clr-text-3); font-style:italic; }
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

    /* ----- 年度制 Results：R/O + PLACE 列、晋级高亮 ----- */
    .bvr-tbl .ro { font-family:var(--font-mono); font-size:13px; color:var(--clr-text-3); text-align:center;
      width:1px; padding-left:16px; padding-right:10px; }
    .bvr-tbl .place { font-family:var(--font-display); font-size:18px; text-align:center; color:var(--clr-text-2);
      width:1px; white-space:nowrap; }
    .bvr-tbl .place { line-height:1; }
    .bvr-tbl .place > span:first-child { display:block; }
    /* 「晋级」标在名次下方、贴紧（上下两行、紧凑） */
    .bvr-tbl .place-q { display:block; font-family:var(--font-body); font-size:9px; font-weight:700;
      letter-spacing:0.04em; color:var(--clr-violet-light); line-height:1; margin-top:3px; }
    /* 结果概览 SF：JURY/TELE 分数若其本列名次未进晋级名额（如第 10 名起）→ 弱化（亮度居中、仍可辨） */
    .bvr-tbl .pts--jury.pts--nq { color:var(--clr-accent-soft); }
    .bvr-tbl .pts--tele.pts--nq { color:var(--clr-pink-soft); }
    /* GF 前三名牌色作用到 PLACE 列 */
    .bvr-row--1 .place { color:var(--clr-gold-light); text-shadow:0 0 18px rgba(224,176,64,0.7); }
    .bvr-row--2 .place { color:var(--clr-silver);     text-shadow:0 0 18px rgba(110,170,204,0.5); }
    .bvr-row--3 .place { color:var(--clr-bronze);     text-shadow:0 0 18px rgba(224,148,84,0.6); }
    /* SF 晋级行：淡紫高亮 + 左侧光条（不用金银铜） */
    .bvr-row--q { background:linear-gradient(90deg, rgba(168,85,247,0.11) 0%, rgba(168,85,247,0.035) 45%, transparent 80%); }
    .bvr-row--q td:first-child { box-shadow:inset 3px 0 0 var(--clr-violet); }
    .bvr-row--q .place { color:var(--clr-violet-light); }

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
    .bvr-mtx .ro  { font-family:var(--font-mono); font-size:12px; color:var(--clr-text-3);
      position:sticky; left:0; background:var(--clr-bg); z-index:3; }
    .bvr-mtx .rcp { text-align:left; font-family:var(--font-body); color:var(--clr-text);
      position:sticky; left:var(--mtx-l-rcp,0); background:var(--clr-bg); z-index:3; }
    .bvr-mtx .tot { color:var(--clr-text); font-weight:700; background:var(--clr-surface); }
    .bvr-mtx .sj  { color:var(--clr-accent-light); background:var(--clr-surface); }
    .bvr-mtx .st  { color:var(--clr-pink-light);    background:var(--clr-surface); }
    .bvr-mtx .raw { color:var(--clr-text-3); background:var(--clr-surface); }  /* 观众原始票数（独立列） */
    /* 计分板冻结窗格：桌面与手机均冻结 R/O+选送者+Total+Jury/Tele(+票数)（left 偏移由 JS 量列宽写入） */
    .bvr-mtx .tot { position:sticky; left:var(--mtx-l-tot,0); z-index:2; }
    .bvr-mtx .sj  { position:sticky; left:var(--mtx-l-sj,0);  z-index:2; }
    .bvr-mtx .st  { position:sticky; left:var(--mtx-l-st,0);  z-index:2; }
    .bvr-mtx .raw { position:sticky; left:var(--mtx-l-raw,0); z-index:2; }
    .bvr-mtx thead .ro, .bvr-mtx thead .rcp, .bvr-mtx thead .tot, .bvr-mtx thead .sj, .bvr-mtx thead .st, .bvr-mtx thead .raw { z-index:5; }
    .bvr-mtx tbody .tot, .bvr-mtx tbody .sj, .bvr-mtx tbody .st { font-family:var(--font-body); font-size:13px; }
    .bvr-mtx tbody .raw { font-family:var(--font-mono); font-size:12px; }
    .bvr-mtx .vsep { border-left:2px solid var(--clr-border-2); }
    .bvr-mtx td.pt { color:var(--clr-text-2); font-size:12px; }
    .bvr-mtx td.pt--12 { color:var(--clr-gold-light); font-weight:700; }
    /* SF 计分板未晋级行：透明度 0.65（仅文字，冻结列底仍不透明）。选送者保持榜吧蓝、仅降透明度 */
    .bvr-mtx-row--nq .rcp .member { opacity:0.75; }
    .bvr-mtx-row--nq .tot { color:color-mix(in srgb, var(--clr-text) 65%, transparent); }
    .bvr-mtx-row--nq .sj  { color:color-mix(in srgb, var(--clr-accent-light) 65%, transparent); }
    .bvr-mtx-row--nq .st  { color:color-mix(in srgb, var(--clr-pink-light) 65%, transparent); }
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

    /* ----- empty state ----- */
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

    /* ----- TOC：网页端 Notion 风格右侧缩略目录（默认短横线指示，hover 从右侧推出文字标签 + 过渡；移动端见 @media 改悬浮按钮面板） ----- */
    .bvr-toc { position:fixed; right:14px; top:50%; transform:translateY(-50%); z-index:90;
      display:flex; flex-direction:column; align-items:flex-end; gap:0;
      opacity:0; visibility:hidden; transition:opacity 0.25s,visibility 0.25s; }
    .bvr-toc--visible { opacity:1; visibility:visible; }
    .bvr-toc__toggle { display:none; }  /* 网页端不用悬浮按钮（移动端 @media 启用） */
    .bvr-toc__list { display:flex; flex-direction:column; align-items:flex-end; gap:2px;
      padding:8px 10px; border-radius:8px; background:transparent;
      transition:background 0.25s, -webkit-backdrop-filter 0.25s, backdrop-filter 0.25s; }
    .bvr-toc:hover .bvr-toc__list { background:rgba(20,20,34,0.55); -webkit-backdrop-filter:blur(10px); backdrop-filter:blur(10px); }
    .bvr-toc__item { display:flex; align-items:center; justify-content:flex-end; gap:9px;
      cursor:pointer; user-select:none; padding:2px 0; }
    .bvr-toc__dash { flex:none; width:14px; height:2px; border-radius:2px; background:var(--clr-text-3);
      opacity:0.4; transition:width 0.25s, background 0.25s, opacity 0.25s; }
    .bvr-toc__label { order:-1; font-family:var(--font-body); font-size:10.5px; letter-spacing:0.01em;
      color:var(--clr-text-3); white-space:nowrap; max-width:0; opacity:0; transform:translateX(6px); overflow:hidden;
      transition:max-width 0.3s ease, opacity 0.25s, transform 0.3s ease, color 0.15s; }
    .bvr-toc:hover .bvr-toc__label { max-width:220px; opacity:1; transform:translateX(0); }
    .bvr-toc__item:hover .bvr-toc__dash { opacity:0.85; background:var(--clr-text-2); }
    .bvr-toc__item:hover .bvr-toc__label { color:var(--clr-text); }
    .bvr-toc__item--active .bvr-toc__dash { width:22px; background:var(--clr-violet-light); opacity:1; }
    .bvr-toc__item--active .bvr-toc__label { color:var(--clr-violet-light); }

    /* 宽表横向滚动提示（手机常显 / 桌面溢出时由 JS 显示）——格式与「注」(.bvr-mtx-note) 一致 */
    .bvr-scroll-hint { display:none; font-size:11px; color:var(--clr-text-3); margin-bottom:7px; }
    /* section body 内的 fade-up（.section__inner 直接子节点）清零 style.css 泄漏的 :nth-child 错落延迟，
       使其纯靠 IntersectionObserver 按滚动位置自上而下逐个淡入（header 的 label/title 嵌在 .bvr-sec__hd 内、不受影响、保留错落） */
    .bvr-sec .section__inner > .fade-up { transition-delay: 0s; }

    @media (max-width:768px) {
      /* 移动端：缩略目录不适合触屏 → 改为悬浮按钮 + 展开面板（对齐 back-to-top 风格，置于其上方） */
      .bvr-toc { right:20px; bottom:66px; top:auto; transform:none; z-index:210; gap:10px; }
      .bvr-toc__toggle { display:flex; align-items:center; justify-content:center; width:42px; height:42px;
        background:rgba(20,20,34,0.5); -webkit-backdrop-filter:blur(12px); backdrop-filter:blur(12px);
        border:1px solid var(--clr-border-2); border-radius:4px; color:rgba(192,132,252,0.65); cursor:pointer;
        padding:0; transition:color 0.25s,border-color 0.25s; }
      .bvr-toc__toggle svg { width:18px; height:18px; }
      .bvr-toc--open .bvr-toc__toggle { color:var(--clr-violet-light); border-color:var(--clr-violet-light); }
      .bvr-toc__list { display:none; gap:1px; min-width:152px; max-height:62vh; overflow-y:auto;
        background:rgba(20,20,34,0.72); -webkit-backdrop-filter:blur(14px); backdrop-filter:blur(14px);
        border:1px solid var(--clr-border-2); border-radius:6px; padding:6px; box-shadow:0 8px 28px rgba(0,0,0,0.4); }
      .bvr-toc:hover .bvr-toc__list { background:rgba(20,20,34,0.72); }  /* 取消桌面 hover 推出行为 */
      .bvr-toc--open .bvr-toc__list { display:flex; }
      .bvr-toc__item { justify-content:flex-start; gap:0; padding:9px 13px; border-radius:4px; }
      .bvr-toc__item:hover { background:rgba(255,255,255,0.04); }
      .bvr-toc__dash { display:none; }
      .bvr-toc__label { order:0; max-width:none; opacity:1; transform:none; overflow:visible; font-size:13px; }
      .bvr-toc__item--active { background:rgba(168,85,247,0.12); }
      .bvr-scroll-hint { display:block; }
      /* Scoreboard / 12 Points 子标题：手机端略收字号 + 上间距（桌面 18px / 48px） */
      .bvr-dvr-sub { font-size:16px; margin-top:36px; }

      /* 结果概览：保留横向滚动表，手机端压缩间距 + 分数字号统一为歌手/歌名大小(13px，#除外) */
      .bvr-tbl tbody td { padding-top:8px; padding-bottom:8px; }
      .bvr-tbl th, .bvr-tbl td { padding-left:9px; padding-right:9px; }
      .bvr-tbl .pts { font-size:13px; }
      .bvr-tbl .pts--total { font-size:13px; }
      /* 名次列缩窄 + 收紧与选送者间距（手机省空间）；表头同步对齐 */
      .bvr-tbl tbody .num, .bvr-tbl tbody .ro { width:28px; padding-right:5px; }
      .bvr-tbl tbody .num + td, .bvr-tbl tbody .ro + td { padding-left:5px; }
      .bvr-tbl thead th:first-child { width:28px; padding-right:5px; text-align:center; }
      .bvr-tbl thead th:nth-child(2) { padding-left:5px; }
      /* R/O 表头排序箭头去掉负边距——否则箭头右半溢出到相邻冻结的「选送者」列背景下被遮住、显示不全 */
      .bvr-tbl thead th.th-ro.bvr-th-sort::after { margin-right:0; margin-left:2px; }
      .bvr-tbl thead th.th-ro { padding-right:7px; }
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
      /* 参赛名单（.bvr-el）/ 海选表（.bvr-aud）/ 报名名单（.bvr-su）：不冻结，完全左右滑动（覆盖上面 .bvr-tbl 前三列 sticky） */
      .bvr-el thead th:nth-child(-n+3), .bvr-el tbody td:nth-child(-n+3),
      .bvr-aud thead th:nth-child(-n+3), .bvr-aud tbody td:nth-child(-n+3),
      .bvr-su thead th:nth-child(-n+3), .bvr-su tbody td:nth-child(-n+3) { position:static; }
      /* 报名名单手机端：取消桌面 table-layout:fixed 的固定列宽 → 改 auto，列宽随内容 + 横滑（与 2025 参赛名单 .bvr-el 一致）；
         否则固定 % 把选送者/歌手列挤窄、长歌手名强制换行致表头与内容叠挤。table.bvr-su 提权盖过文件下方基础 nth-child 列宽规则 */
      table.bvr-su { table-layout:auto; }
      table.bvr-su th:nth-child(1), table.bvr-su th:nth-child(2), table.bvr-su th:nth-child(3),
      table.bvr-su th:nth-child(4), table.bvr-su th:nth-child(5), table.bvr-su th:nth-child(6) { width:auto; }
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

    /* ===== 2023+ 主题届：海报作背景的 hero（经典模板 + 海报底图 + 渐变遮罩） ===== */
    .bvr-hero--bg { position:relative; overflow:hidden; padding:var(--nav-h) 0 48px;
      min-height:72vh; display:flex; align-items:center; }  /* 海报 16:9，给足视口高度并垂直居中内容 */
    .bvr-hero__poster { position:absolute; inset:0; background-image:var(--bvt-poster);
      background-size:cover; background-position:right center; pointer-events:none;
      opacity:0; transition:opacity 0.55s ease; }  /* 右锚定：缩放裁切时优先保右侧 logo；初始透明，海报预解码完成后淡入（消除弹出/卡顿） */
    .bvr-hero__poster.loaded { opacity:1; }
    /* 左侧深、右侧透出海报；底部加深，保证文字可读 */
    .bvr-hero__scrim { position:absolute; inset:0; pointer-events:none; background:
      linear-gradient(90deg, rgba(8,8,18,0.88) 0%, rgba(8,8,18,0.72) 26%, rgba(8,8,18,0.18) 66%, rgba(8,8,18,0.05) 100%),
      linear-gradient(0deg, rgba(8,8,18,0.72) 0%, transparent 40%); }
    .bvr-hero--bg .bvr-hero__inner { position:relative; z-index:2; margin-top:0; width:100%; }
    /* 配色统一到当年主题色（eyebrow / 年份 / 简介成员链接），仅 2023+ 主题 hero */
    .bvr-hero--bg .bvr-eyebrow { color:var(--bvt-c1, var(--clr-violet-light)); }
    .bvr-hero--bg .bvr-eyebrow:hover { color:var(--clr-white); }
    /* hero 简介/meta 内 @名沿用 .member 全局默认样式（榜吧蓝），不套主题色 */
    /* 城市/年份标题（参考 events.html：城市换行 + 年份强调为主题色） */
    .bvr-hero--bg .bvr-title { margin-bottom:0; }
    .bvr-hero__yr { color:var(--bvt-c1, var(--clr-pink-light)); }
    /* meta：竖分隔线（参考 events.html .ev-meta） */
    .bvr-hero__meta { display:flex; flex-wrap:wrap; align-items:center; margin-top:20px; }
    .bvr-hero__mi { font-size:12px; color:color-mix(in srgb, var(--bvt-c1, var(--clr-text-3)) 85%, transparent); padding-right:14px; margin-right:14px;
      border-right:1px solid var(--clr-border); white-space:nowrap; }
    .bvr-hero__mi:last-child { border-right:none; margin-right:0; padding-right:0; }
    .bvr-hero__desc { margin-top:18px; }
    .bvr-hero__p { font-size:15px; line-height:1.75; color:var(--bvt-c3, var(--clr-text-2)); max-width:680px; margin:0 0 12px; }
    .bvr-hero__p:last-child { margin-bottom:0; }

    /* ===== 简介 / 视觉设计 正文 ===== */
    .bvr-prose p { font-size:15px; line-height:1.85; color:var(--clr-text-2); max-width:760px; margin:0 0 14px; }
    .bvr-prose p:last-child { margin-bottom:0; }
    /* 每场结果概览上方的本场概况 */
    .bvr-stage-intro { margin-bottom:22px; }
    .bvr-stage-intro p { font-size:14px; line-height:1.8; color:var(--clr-text-2); max-width:760px; margin:0 0 12px; }
    .bvr-stage-intro p:last-child { margin-bottom:0; }

    /* ===== 结构化规则（2023+） ===== */
    .bvr-rules--rich { padding:6px 0 0; border:none; }
    .bvr-rule { padding:0 0 28px; }
    .bvr-rule:last-child { padding-bottom:0; }
    .bvr-rule__h { font-family:var(--font-body); font-size:16px; font-weight:700; color:var(--clr-text);
      margin:0 0 12px; padding-left:11px; border-left:3px solid var(--clr-violet-light); line-height:1.3; }
    .bvr-rule__p { font-size:14px; line-height:1.8; color:var(--clr-text-2); margin:0 0 10px; max-width:780px; }
    .bvr-rule__list { list-style:none; margin:6px 0 4px; padding:0; }
    .bvr-rule__list > li { margin-bottom:10px; font-size:14px; line-height:1.7; color:var(--clr-text-2); }
    .bvr-rule__k { font-weight:700; color:var(--clr-violet-light); margin-right:10px; }
    .bvr-rule__sub { margin:6px 0 0; padding-left:22px; }
    .bvr-rule__sub li { font-size:13px; line-height:1.7; color:var(--clr-text-2); margin-bottom:3px; }
    .bvr-rule__cap { font-size:13px; font-weight:700; letter-spacing:0.04em; color:var(--clr-violet-light);
      margin:14px 0 8px; }
    .bvr-rule__tw { overflow-x:auto; border:1px solid var(--clr-border); border-radius:8px; margin:6px 0 4px;
      scrollbar-width:none; }
    .bvr-rule__tw::-webkit-scrollbar { display:none; }
    .bvr-rule__tbl, .bvr-rule__score { width:100%; border-collapse:collapse; font-size:13px;
      -webkit-text-size-adjust:100%; text-size-adjust:100%; }  /* 禁移动端真机文字自动膨胀（#139）：赛程表字号锁 13px、与小标题一致 */
    .bvr-rule__tbl th, .bvr-rule__tbl td { padding:9px 14px; text-align:left; border-bottom:1px solid var(--clr-border);
      border-right:1px solid var(--clr-border); white-space:nowrap; }
    .bvr-rule__tbl tr:last-child th, .bvr-rule__tbl tr:last-child td { border-bottom:none; }
    .bvr-rule__tbl td:last-child, .bvr-rule__tbl th:last-child { border-right:none; }
    .bvr-rule__tbl th { font-family:var(--font-body); font-weight:700; color:var(--clr-text-2);
      background:var(--clr-surface); }
    .bvr-rule__tbl td { color:var(--clr-text-2); }
    /* 赛程三表：日期列统一固定宽，使三表左列对齐（日期含「晚间」CJK，不可用 DM Mono，#13） */
    #schedule .bvr-rule__tbl th { width:120px; }
    /* 赋分表：两行（排名 / 分数），居中 */
    .bvr-rule__score th, .bvr-rule__score td { padding:8px 0; text-align:center; border:1px solid var(--clr-border);
      font-family:var(--font-mono); font-size:13px; min-width:38px; }
    .bvr-rule__score th { font-family:var(--font-body); font-weight:700; color:var(--clr-text-2);
      background:var(--clr-surface); min-width:56px; }
    .bvr-rule__score tr:first-child td { color:var(--clr-text-3); }
    .bvr-rule__score .bvr-rule__sc { color:var(--clr-text); font-weight:700; }
    .bvr-rule__score .bvr-rule__sc--top { color:var(--clr-gold-light); }
    .bvr-rule__foot { font-size:12px; line-height:1.7; color:var(--clr-text-3); margin:10px 0 0; max-width:780px; }
    .bvr-rule__foot + .bvr-rule__foot { margin-top:4px; }
    .bvr-rules--rich .bvr-src { margin-top:18px; }

    /* ===== 参赛名单：流派列 ===== */
    .bvr-el__by .member { font-weight:600; }
    .bvr-el__genre { font-size:11px; color:var(--clr-text-3); white-space:nowrap; }
    /* ===== 海选阶段表 ===== */
    .bvr-aud__name { color:var(--clr-text); font-weight:600; }
    .bvr-aud__time { font-family:var(--font-mono); font-size:11px; color:var(--clr-text-3); white-space:nowrap; }
    .bvr-aud__tbd { color:var(--clr-text-4); }
    .bvr-aud-st { display:inline-block; white-space:nowrap; font-size:10px; font-weight:600; letter-spacing:0.02em;
      padding:2px 8px; border-radius:3px; border:1px solid var(--clr-border-2); }
    .bvr-aud-st--live { color:var(--clr-up); border-color:color-mix(in srgb, var(--clr-up) 50%, transparent);
      background:color-mix(in srgb, var(--clr-up) 12%, transparent); }
    .bvr-aud-st--done { color:var(--clr-text-3); }
    .bvr-aud-st--prep { color:var(--clr-gold-light); border-color:color-mix(in srgb, var(--clr-gold-light) 45%, transparent); }

    /* ===== 进行中（live）：报名名单 ===== */
    .bvr-su__by { white-space:nowrap; }  /* 选送者昵称不换行（防真机字号膨胀把「X妈」拆成两行，#168） */
    .bvr-su__by .member { font-weight:600; }
    .bvr-su__genre { font-size:11px; color:var(--clr-text-3); white-space:nowrap; }
    /* Candidates / Wildcards 两表固定列宽，使列对齐一致（table-layout:fixed，长歌名自动换行） */
    .bvr-su { table-layout:fixed; }
    .bvr-su th:nth-child(1) { width:15%; }  /* 选送者 */
    .bvr-su th:nth-child(2) { width:21%; }  /* 歌手 */
    .bvr-su th:nth-child(3) { width:26%; }  /* 歌曲名 */
    .bvr-su th:nth-child(4) { width:9%; }   /* 语言 */
    .bvr-su th:nth-child(5) { width:14%; }  /* 流派 */
    .bvr-su th:nth-child(6) { width:15%; }  /* 报名方式 */
    /* 结构化规则：纯项目符号列表（资格/投票条目） */
    .bvr-rule__items { margin:10px 0 0; padding-left:20px; list-style:disc; }
    .bvr-rule__items li { font-size:13.5px; line-height:1.7; color:var(--clr-text-2); margin:5px 0; }
    .bvr-rule__items li::marker { color:var(--clr-violet); }
    .bvr-mode { display:inline-block; white-space:nowrap; font-size:10px; font-weight:600; padding:2px 8px;
      border-radius:3px; border:1px solid var(--clr-border-2); }
    .bvr-mode--internal { color:var(--clr-accent-light); border-color:color-mix(in srgb, var(--clr-accent-light) 45%, transparent); }
    .bvr-mode--open { color:var(--clr-pink-light); border-color:color-mix(in srgb, var(--clr-pink-light) 45%, transparent); }

    /* ===== 总成绩单（年度制） ===== */
    .bvr-sb { width:100%; border-collapse:separate; border-spacing:0; font-size:13px; min-width:1120px; }
    .bvr-sb th { font-family:var(--font-body); font-weight:700; font-size:11px; letter-spacing:0.04em;
      text-transform:uppercase; color:var(--clr-text-2); padding:8px 12px; background:var(--clr-surface);
      border-bottom:1px solid var(--clr-border); white-space:nowrap; text-align:center; }
    .bvr-sb thead tr:first-child th { border-bottom:1px solid var(--clr-border-2); }
    .bvr-sb-grp--gf { color:var(--clr-text); }
    .bvr-sb-grp--sf { color:var(--clr-text-2); }
    .bvr-sb td { padding:10px 12px; border-bottom:1px solid var(--clr-border); text-align:center;
      vertical-align:middle; white-space:nowrap; }
    .bvr-sb tbody tr:last-child td { border-bottom:none; }
    .bvr-sb-rank { font-family:var(--font-display); font-size:20px; color:var(--clr-text-3); width:1px;
      padding-left:16px; padding-right:8px; }
    .bvr-sb-rank span { display:inline-block; transform:translateY(2px); }
    th.bvr-sb-by, th.bvr-sb-song { text-align:left; }
    td.bvr-sb-song { text-align:left; white-space:normal; min-width:200px; line-height:1.35; }
    /* 选送者列：样式同歌手（粗体、--clr-text） */
    td.bvr-sb-by { text-align:left; white-space:nowrap; font-weight:700; color:var(--clr-text); }
    .bvr-sb-by .member { color:var(--clr-text); font-weight:700; }
    /* 歌手（上，主行）/ 歌名（下，--clr-text-2） */
    .bvr-sb-artist { display:block; font-weight:700; color:var(--clr-text); }
    .bvr-sb-title { display:block; font-size:12px; color:var(--clr-text-2); margin-top:1px; }
    .bvr-sb-pts { font-family:var(--font-body); font-weight:700; font-size:14px; color:var(--clr-text); }  /* GF points 字号与 SF(.is-sf 14px) 一致；颜色/字重不变 */
    .bvr-sb-rate { font-family:var(--font-mono); font-size:12px; color:var(--clr-text-2); }
    .bvr-sb-vot { font-family:var(--font-mono); font-size:12px; color:var(--clr-text-3); }
    /* 观众票（20 票制届：观众分右侧的原始票数） */
    .bvr-sb-raw { margin-left:6px; font-family:var(--font-mono); font-size:10px; color:var(--clr-text-3); }
    .bvr-sb-pts.is-sf { color:var(--clr-text-2); font-weight:600; font-size:14px; }
    .bvr-sb-rate.is-sf, .bvr-sb-vot.is-sf { color:var(--clr-text-3); }
    /* Jury/Tele 与 Rate 同色（GF=text-2 / SF=text-3），不透明 */
    .bvr-sb-jury, .bvr-sb-tele { font-family:var(--font-mono); font-size:12px; color:var(--clr-text-2); }
    .bvr-sb-jury.is-sf, .bvr-sb-tele.is-sf { color:var(--clr-text-3); }
    /* Jury/Tele/Voters 各列最大值高亮（覆盖 is-sf，故置于其后） */
    .bvr-sb-jury.is-max, .bvr-sb-tele.is-max, .bvr-sb-vot.is-max { color:var(--clr-text); font-weight:700; }
    /* GF / SF 组分隔线（粗细与其余 1px 边框一致，仅用 border-2 颜色区分） */
    .bvr-sb th.bvr-sb-grp--gf, .bvr-sb-gfh:first-of-type, .bvr-sb td.bvr-sb-pts.is-gf,
    .bvr-sb th.bvr-sb-grp--sf, .bvr-sb-sfh, .bvr-sb td.bvr-sb-sf { border-left:1px solid var(--clr-border-2); }
    /* 半决赛场次徽章（主题双色：SF1=c1 / SF2=c2l） */
    .bvr-sb-badge { display:inline-flex; flex-direction:column; align-items:center; justify-content:center;
      min-width:34px; padding:3px 7px; border-radius:5px; line-height:1; color:var(--clr-text); }
    .bvr-sb-badge__n { font-family:var(--font-display); font-size:15px; }
    .bvr-sb-badge__t { font-size:8px; font-weight:700; letter-spacing:0.06em; opacity:0.9; margin-top:2px; }
    .bvr-sb-badge--sf1 { background:var(--clr-pink-deep); }  /* SF1 深玫红 */
    .bvr-sb-badge--sf2 { background:var(--clr-cta-3); }      /* SF2 深紫 */
    .bvr-sb-direct { font-size:10px; font-weight:700; letter-spacing:0.04em; color:var(--clr-text-3); }  /* 东道主直通决赛 */
    /* 前三名牌色 */
    .bvr-sb-row--1 { background:linear-gradient(90deg, rgba(212,168,50,0.16) 0%, transparent 72%); }
    .bvr-sb-row--2 { background:linear-gradient(90deg, rgba(110,150,178,0.13) 0%, transparent 72%); }
    .bvr-sb-row--3 { background:linear-gradient(90deg, rgba(196,120,68,0.13) 0%, transparent 72%); }
    .bvr-sb-row--1 .bvr-sb-rank { color:var(--clr-gold-light); text-shadow:0 0 16px rgba(224,176,64,0.6); }
    .bvr-sb-row--2 .bvr-sb-rank { color:var(--clr-silver); }
    .bvr-sb-row--3 .bvr-sb-rank { color:var(--clr-bronze); }
    /* 前三名：选送者 / 歌手 / 歌名 随金银铜上色 */
    .bvr-sb-row--1 .bvr-sb-by, .bvr-sb-row--1 .bvr-sb-by .member, .bvr-sb-row--1 .bvr-sb-artist, .bvr-sb-row--1 .bvr-sb-title { color:var(--clr-gold-tint); }
    .bvr-sb-row--2 .bvr-sb-by, .bvr-sb-row--2 .bvr-sb-by .member, .bvr-sb-row--2 .bvr-sb-artist, .bvr-sb-row--2 .bvr-sb-title { color:var(--clr-silver-tint); }
    .bvr-sb-row--3 .bvr-sb-by, .bvr-sb-row--3 .bvr-sb-by .member, .bvr-sb-row--3 .bvr-sb-artist, .bvr-sb-row--3 .bvr-sb-title { color:var(--clr-bronze-tint); }
    .bvr-sb-poll { display:flex; flex-wrap:wrap; align-items:center; gap:10px 22px; margin-top:16px;
      padding-top:14px; border-top:1px solid var(--clr-border); font-family:var(--font-body); }
    .bvr-sb-poll__lbl { font-size:11px; font-weight:700; letter-spacing:0.08em; text-transform:uppercase;
      color:var(--clr-text-3); }
    .bvr-sb-poll__it { display:inline-flex; align-items:baseline; gap:7px; }
    .bvr-sb-poll__t { font-size:12px; color:var(--clr-text-2); }
    .bvr-sb-poll__n { font-family:var(--font-display); font-size:18px; line-height:1; color:var(--clr-text-2); }

    /* ===== 相关链接（直播回放 / 歌单） ===== */
    .bvr-links__grp { margin-bottom:26px; }
    .bvr-links__grp:last-child { margin-bottom:0; }
    .bvr-links__h { font-family:var(--font-body); font-size:16px; font-weight:700; color:var(--clr-text);
      margin:0 0 14px; padding-left:11px; border-left:3px solid var(--clr-violet); }
    .bvr-links__sub { margin:0 0 16px; }
    .bvr-links__sub:last-child { margin-bottom:0; }
    .bvr-links__subh { font-family:var(--font-body); font-size:13px; font-weight:700;
      color:var(--clr-violet-light); letter-spacing:0.02em; margin:0 0 9px; }
    .bvr-links__list { display:flex; flex-direction:column; gap:8px; align-items:flex-start; }
    .bvr-link { font-size:14px; color:var(--clr-text-2); text-decoration:underline;
      text-decoration-color:var(--clr-border-2); text-underline-offset:3px;
      transition:color 0.18s, text-decoration-color 0.18s; }
    .bvr-link:hover { color:var(--clr-violet-light); text-decoration-color:var(--clr-violet-light); }

    @media (max-width:768px) {
      /* 总成绩单：不冻结，完全左右滑动；#/选送者/参赛作品 值字号收小 */
      td.bvr-sb-song { min-width:150px; }
      .bvr-sb-rank { font-size:16px; padding-left:12px; padding-right:6px; }
      .bvr-sb-rank span { transform:translateY(1px); }
      td.bvr-sb-by, .bvr-sb-by .member { font-size:12px; }
      .bvr-sb-artist { font-size:12px; }
      .bvr-sb-title { font-size:11px; }

      /* 主题届 hero（poster）：收高、标题收小、遮罩改竖向（整体加深保证密集流光底图上文字可读，中段略透出底图） */
      /* 手机屏放不下完整背景 logo → 改用无 logo 的 bg 版（posterMobile），居中铺满 */
      .bvr-hero__poster { background-image:var(--bvt-poster-m); background-position:center; }
      .bvr-hero--bg { min-height:auto; padding:calc(var(--nav-h) + 30px) 0 40px; }
      .bvr-hero--bg .bvr-title { font-size:clamp(34px,10.5vw,52px); line-height:1.02; }
      .bvr-hero__scrim { background:
        linear-gradient(180deg, rgba(8,8,18,0.7) 0%, rgba(8,8,18,0.52) 48%, rgba(8,8,18,0.8) 100%); }
      .bvr-hero__meta { margin-top:16px; }
      .bvr-hero__desc { margin-top:14px; }
      .bvr-hero__p { font-size:14px; line-height:1.7; }
    }
    `;
    var st = document.createElement('style');
    st.textContent = css;
    document.head.appendChild(st);
  }

  /* ---------- section builders ---------- */
  function metaBits(d) {
    var bits = [];
    if (d.cn_name) bits.push(esc(d.cn_name));
    // 吧视品牌规则：「Barvision [城市] 年份」标签须**纯英文**，不中英混搭。
    // edition_name 本就是纯英文全称（如 Barvision Qiqihar 2023）→ 直接用；旧届回退「Barvision <年>」。
    bits.push(/^Barvision/i.test(d.edition_name || '') ? esc(d.edition_name) : ('Barvision ' + esc(d.year)));
    if (d.host) bits.push('主办：' + linkMentions(esc(d.host)));  // 「X妈」自动链接
    if (d.motto) bits.push('<span class="bvr-meta__motto">' + esc(d.motto) + '</span>');
    return bits.map(function (b) { return '<span>' + b + '</span>'; })
      .join('<span class="bvr-meta__sep">｜</span>');
  }
  function buildHero(d) {
    var th = theme(d);
    var eyebrow = '<a class="bvr-eyebrow fade-up" href="/barvision.html"><span>←</span><span>Barvision</span></a>';
    var name = esc(d.edition_name).replace(/(\d+(?:st|nd|rd|th))/i, '<span class="bvr-ord">$1</span>');
    // 主题届（2023+）：内容布局参考 2026/events.html hero（eyebrow + 城市/年份标题 + 竖分隔 meta + 简介），海报作背景铺底
    if (th) {
      var vars = '--bvt-c1:' + th.c1 + ';--bvt-c2:' + th.c2 + ';--bvt-c2l:' + th.c2l + ';--bvt-c3:' + th.c3 +
        ";--bvt-poster:url('" + th.poster + "');--bvt-poster-m:url('" + (th.posterMobile || th.poster) + "');";
      // 城市英文名：从 edition_name 去掉「Barvision」前缀与年份（如 Barvision Qiqihar 2023 → Qiqihar）
      var cityEn = (d.edition_name || '').replace(/^Barvision\s+/i, '').replace(/\s*\d{4}\s*$/, '').trim() || esc(d.city || '');
      var mi = [];
      if (d.cn_name) mi.push('<span class="bvr-hero__mi">' + esc(d.cn_name) + '</span>');
      mi.push('<span class="bvr-hero__mi">Barvision ' + esc(cityEn) + ' ' + esc(d.year) + '</span>');
      if (d.host) mi.push('<span class="bvr-hero__mi">主办：' + linkMentions(esc(d.host)) + '</span>');
      if (d.motto) mi.push('<span class="bvr-hero__mi">' + esc(d.motto) + '</span>');
      return '<section class="bvr-hero bvr-hero--bg" style="' + vars + '">' +
        '<div class="bvr-hero__poster"></div>' +
        '<div class="bvr-hero__scrim"></div>' +
        '<div class="bvr-hero__inner section__inner">' + eyebrow +
        '<h1 class="bvr-title fade-up" style="transition-delay:0.08s;">' + esc(cityEn) + '<br><span class="bvr-hero__yr">' + esc(d.year) + '</span></h1>' +
        '<div class="bvr-hero__meta fade-up" style="transition-delay:0.16s;">' + mi.join('') + '</div>' +
        (d.summary ? '<div class="bvr-hero__desc fade-up" style="transition-delay:0.22s;">' + paras(d.summary, 'bvr-hero__p') + '</div>' : '') +
        '</div></section>';
    }
    // 通用届：标题 + meta + summary（去罗马数字、序数词染粉）
    return '<section class="bvr-hero">' +
      '<div class="bvr-hero__glow"></div><div class="bvr-hero__grid"></div>' +
      '<div class="bvr-hero__wm">' + roman(d.edition_no) + '</div>' +
      '<div class="bvr-hero__inner section__inner">' + eyebrow +
      '<h1 class="bvr-title fade-up" style="transition-delay:0.08s;">' + name + '</h1>' +
      '<div class="bvr-meta fade-up" style="transition-delay:0.16s;">' + metaBits(d) + '</div>' +
      (d.summary ? '<p class="bvr-desc fade-up" style="transition-delay:0.22s;">' + esc(d.summary) + '</p>' : '') +
      '</div></section>';
  }
  // 段落文本（\n\n 分段）→ 多个 <p>；正文内「X妈」自动转成员链接（useNick：显中文昵称）
  function paras(txt, cls, useNick) {
    return String(txt || '').split(/\n\n+/).map(function (p) {
      return '<p class="' + (cls || '') + '">' + linkMentions(esc(p), useNick) + '</p>';
    }).join('');
  }
  // 简介 / 视觉设计 正文块（fade-up 段落）
  function proseBlock(txt) {
    return '<div class="bvr-prose fade-up">' + paras(txt) + '</div>';
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
    var MAP = { SF: 'SEMI-FINAL', SF1: 'SEMI-FINAL 1', SF2: 'SEMI-FINAL 2', GF: 'GRAND FINAL', A: 'GROUP A', B: 'GROUP B', C: 'GROUP C', E: 'ENTERTAINMENT' };
    return MAP[m.match] || m.match || esc(m.venue || '');
  }
  // 目录(TOC)用的场次名（SF1/SF2 用英文、GF 用「决赛」；其余用中文 venue）
  function tocVenue(m) {
    var MAP = { SF1: 'SEMI-FINAL 1', SF2: 'SEMI-FINAL 2', GF: '决赛' };
    return MAP[m.match] || esc(m.venue || m.match || '');
  }

  // 竞赛式名次（同分同名次，如 1,2,2,4）
  function compRank(arr, key, val) {
    var n = 0, v = val || 0;
    for (var i = 0; i < arr.length; i++) if ((arr[i][key] || 0) > v) n++;
    return n + 1;
  }
  // 取消组（12B）：选送名单（选送者 / 歌手 / 歌名 / 语种），entries 已按选送者大名排序
  function canceledList(m) {
    var rows = m.entries.map(function (e) {
      return '<tr><td class="canc-by">' + memberLink(e.member) + '</td>' +
        '<td class="artist">' + esc(fmtArtist(e.artist)) + '</td>' +
        '<td class="song">' + esc(e.song) + (e.member.indexOf('/') > -1 ? '<span class="bvr-joint-tag">合报</span>' : '') + (e.is_shadow ? '<span class="bvr-shadow-tag">混淆</span>' : '') + '</td>' +
        '<td class="lang">' + esc(e.language || '') + '</td></tr>';
    }).join('');
    return '<div class="bvr-scroll-hint fade-up">左右滑动查看完整名单</div>' +
      '<div class="bvr-tw fade-up"><table class="bvr-tbl bvr-canc"><thead><tr>' +
      '<th>选送者</th><th>歌手</th><th>歌名</th><th>语种</th></tr></thead><tbody>' + rows + '</tbody></table></div>';
  }

  // cutoff（年度制 SF）：该列竞赛名次 > cutoff（即第 cutoff+1 位起）→ 该分数弱化 .pts--nq（按各列自身名次，与行总排名无关）
  function ptsCell(cls, val, rankArr, key, e, cutoff) {
    var cr = (e.is_shadow || val == null) ? null : compRank(rankArr, key, val);
    var rank = cr == null ? '' : '<span class="pts-rank">#' + cr + '</span>';
    var dim = (cutoff != null && cr != null && cr > cutoff) ? ' pts--nq' : '';
    return '<td class="pts ' + cls + dim + '" data-v="' + (val == null ? -1 : val) + '">' +
      '<span class="pts-v">' + fmtScore(val) + '</span>' + rank + '</td>';
  }
  function resultTable(m, annual) {
    var pool = m.entries.filter(function (e) { return !e.is_shadow; });  // 排名只在正式曲目间统计
    var hasTele = (m.votes.voters || []).some(function (v) { return v.type === 'tele'; });  // 该场有无观众分
    if (annual) return resultTableAnnual(m, pool, hasTele);
    // —— 旧版（2019/2020 分组制）——
    var rows = m.entries.map(function (e) {
      var cls = e.is_shadow ? 'bvr-row--shadow' : (e.rank <= 3 ? 'bvr-row--' + e.rank : '');
      return '<tr class="' + cls + '">' +
        '<td class="num"><span>' + (e.is_shadow ? '<span class="bvr-num-shadow">' + esc(e.rank) + '*</span>' : esc(e.rank)) + '</span></td>' +
        '<td>' + (e.member.indexOf('/') > -1 ? '<span class="bvr-joint">' + e.member.split('/').map(function (n) { return memberLink(n.trim()); }).join('') + '</span>' : memberLink(e.member)) + '</td>' +
        '<td class="artist">' + esc(fmtArtist(e.artist)) + '</td>' +
        '<td class="song">' + esc(e.song) + (e.member.indexOf('/') > -1 ? '<span class="bvr-joint-tag">合报</span>' : '') + (e.is_shadow ? '<span class="bvr-shadow-tag">混淆</span>' : '') + '</td>' +
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
  // 年度制(2023+) Results：列 R/O | 选送者 | 歌手 | 歌名 | 语种 | PTS | JURY | TELE | PLACE
  // SF1/SF2 不用金银铜，改「晋级（前九）」高亮；GF 用金银铜。
  // R/O（出场顺序）映射 eid→序号：半决赛按艺人名字母 A–Z（官方约定）；其余（决赛/旧届）按 eid+1
  function bvRunningOrder(m) {
    var map = {};
    // 优先用数据自带的 ro（2025+ CSV 含真实出场顺序）
    if (m.entries.some(function (e) { return e.ro != null; })) {
      m.entries.forEach(function (e) { if (e.ro != null) map[e.eid] = e.ro; });
      return map;
    }
    if (m.match === 'SF1' || m.match === 'SF2') {
      m.entries.slice().sort(function (a, b) {
        return String(a.artist || '').toLowerCase().localeCompare(String(b.artist || '').toLowerCase(), 'en');
      }).forEach(function (e, i) { map[e.eid] = i + 1; });
    } else {
      m.entries.forEach(function (e) { if (e.eid != null) map[e.eid] = e.eid + 1; });
    }
    return map;
  }
  function resultTableAnnual(m, pool, hasTele) {
    var isSF = m.match === 'SF1' || m.match === 'SF2';
    var roMap = bvRunningOrder(m);
    function roOf(e) { return roMap[e.eid]; }
    // SF 晋级名额数（=该场 qualified 数，本届 9）→ JURY/TELE 列名次超出此数的分数弱化
    var qCut = isSF ? m.entries.filter(function (e) { return e.qualified; }).length : null;
    var rows = m.entries.map(function (e) {
      var cls = isSF ? (e.qualified ? 'bvr-row--q' : '') : (e.rank <= 3 ? 'bvr-row--' + e.rank : '');
      var joint = e.member.indexOf('/') > -1;
      return '<tr class="' + cls + '">' +
        '<td class="ro" data-v="' + roOf(e) + '">' + roOf(e) + '</td>' +
        '<td>' + (joint ? '<span class="bvr-joint">' + e.member.split('/').map(function (n) { return memberLink(n.trim()); }).join('') + '</span>' : memberLink(e.member)) + '</td>' +
        '<td class="artist">' + esc(fmtArtist(e.artist)) + '</td>' +
        '<td class="song">' + esc(e.song) + (joint ? '<span class="bvr-joint-tag">合报</span>' : '') + '</td>' +
        '<td class="lang">' + esc(e.language || '') + '</td>' +
        ptsCell('pts--jury', e.jury_vote, pool, 'jury_vote', e, qCut) +
        (hasTele ? ptsCell('pts--tele', e.tele_vote, pool, 'tele_vote', e, qCut) : '') +
        '<td class="pts pts--total" data-v="' + (e.score == null ? -1 : e.score) + '">' + fmtScore(e.score) + '</td>' +
        '<td class="place" data-v="' + e.rank + '"><span>' + esc(e.rank) + '</span>' +
          (isSF && e.qualified ? '<span class="place-q">晋级</span>' : '') + '</td>' +
        '</tr>';
    }).join('');
    return '<div class="bvr-scroll-hint fade-up">左右滑动查看完整结果</div>' +
      '<div class="bvr-tw fade-up"><table class="bvr-tbl bvr-tbl--annual"><thead><tr>' +
      '<th class="th-ro" style="text-align:center">R/O</th><th>选送者</th><th>歌手</th><th>歌名</th><th>语种</th>' +
      '<th class="th-jury" style="text-align:center">JURY</th>' +
      (hasTele ? '<th class="th-tele" style="text-align:center">TELE</th>' : '') +
      '<th class="th-pts" style="text-align:center">PTS</th>' +
      '<th class="th-place" style="text-align:center">PLACE</th>' +
      '</tr></thead><tbody>' + rows + '</tbody></table></div>';
  }

  // 合并矩阵：分组表头(Jury Vote/Tele Vote) + 可排序前 4 列；默认按选送者排（自投格成主对角线）
  function votingMatrix(m, label, roMap) {  // roMap：年度制传入则加 R/O 列（可排序）、选送者列取消排序
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
      (roMap ? '<th class="ro bvr-th-sort" rowspan="2" data-msort="ro">R/O</th>' : '') +
      '<th class="rcp' + (roMap ? '' : ' bvr-th-sort') + '" rowspan="2"' + (roMap ? '' : ' data-msort="rcp"') + '>' + esc(label) + '</th>' +
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
        // 金标：常规届=该格 12 分；max 模式(九届，小分为任意小数)=该投票人最高正式曲(v.top)
        var hi = (v.top != null) ? (e.eid === v.top) : (p === 12);
        return '<td class="pt' + (hi ? ' pt--12' : '') + sep + '">' + p + '</td>';
      }).join('');
      var rcls = e.is_shadow ? ' class="bvr-mtx-row--shadow"' : (e.qualified === false ? ' class="bvr-mtx-row--nq"' : '');  // SF 未晋级行弱化
      return '<tr' + rcls + '>' +
        (roMap ? '<td class="ro">' + (roMap[e.eid] != null ? roMap[e.eid] : '') + '</td>' : '') +
        '<td class="rcp">' + (e.is_shadow ? '<span class="bvr-anon">' + memberLink(e.member) + '</span>' : memberLink(e.member)) + '</td>' +
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
  // 单类型计分板（年度制 2023+：评委 / 观众 分两张表）。only='jury'|'tele'。
  // 行=正式曲（按结果概览名次），列=该类型投票人；rcp + Total + 本类型小计 三列冻结。
  function votingMatrixSingle(m, only, roMap) {
    var recips = m.entries.filter(function (e) { return !e.is_shadow; });  // 年度制无混淆曲
    var voters = (m.votes.voters || []).filter(function (v) { return v.type === only; });
    if (!voters.length || !recips.length) return '';
    // 列序：评委按其官方曲名次升序（自投格连成对角线）；观众保持原序
    var idxOf = {};
    m.entries.forEach(function (e, i) { if (idxOf[e.member] == null) idxOf[e.member] = i; });
    if (only === 'jury') voters.sort(function (a, b) {
      return (idxOf[a.voter] != null ? idxOf[a.voter] : 9999) - (idxOf[b.voter] != null ? idxOf[b.voter] : 9999);
    });
    var subCls = only === 'jury' ? 'sj' : 'st';
    var subLbl = only === 'jury' ? 'Jury' : 'Tele';
    var grpLbl = only === 'jury' ? 'Jury Vote' : 'Tele Vote';
    var grpCls = only === 'jury' ? 'mtx-grp--jury' : 'mtx-grp--tele';
    // 观众表（20 票制）：观众分(Tele) 之后单列「票数」(原始票数)
    var hasRaw = (only === 'tele' && recips.some(function (e) { return e.tele_raw != null; }));
    var grpRow = '<tr>' +
      (roMap ? '<th class="ro bvr-th-sort" rowspan="2" data-msort="ro">R/O</th>' : '') +
      '<th class="rcp" rowspan="2">选送者</th>' +
      '<th class="tot bvr-th-sort" rowspan="2" data-msort="tot">Total</th>' +
      '<th class="' + subCls + ' bvr-th-sort" rowspan="2" data-msort="' + subCls + '">' + subLbl + '</th>' +
      (hasRaw ? '<th class="raw" rowspan="2">票数</th>' : '') +
      '<th class="mtx-grp ' + grpCls + ' vsep" colspan="' + voters.length + '">' + grpLbl + '</th></tr>';
    var colRow = '<tr>' + voters.map(function (v, i) {
      var lbl = v.voter.indexOf('/') > -1
        ? v.voter.split('/').map(function (s) { return esc(s.trim().replace(/妈$/, '')); }).join('/')
        : esc(v.voter);
      return '<th class="' + (only === 'tele' ? 'vt' : 'vj') + (i === 0 ? ' vsep' : '') + '">' + lbl + '</th>';
    }).join('') + '</tr>';
    var voteMode = (only === 'tele' && m.tele_mode === 'votes');  // 观众 20 票制：无 12 分金标，仅显票数
    var body = recips.map(function (e) {
      var cells = voters.map(function (v, i) {
        var sep = i === 0 ? ' vsep' : '';
        if (only === 'jury' && v.voter === e.member) return '<td class="self' + sep + '"></td>';  // 自投格
        var p = v.points[e.eid != null ? e.eid : e.member];
        if (p == null || p === 0) return '<td class="pt' + sep + '"></td>';
        var hi = voteMode ? false : ((v.top != null) ? (e.eid === v.top) : (p === 12));
        return '<td class="pt' + (hi ? ' pt--12' : '') + sep + '">' + p + '</td>';
      }).join('');
      var sub = only === 'jury' ? e.jury_vote : e.tele_vote;
      return '<tr>' +
        (roMap ? '<td class="ro">' + (roMap[e.eid] != null ? roMap[e.eid] : '') + '</td>' : '') +
        '<td class="rcp">' + memberLink(e.member) + '</td>' +
        '<td class="tot">' + fmtScore(e.score) + '</td>' +
        '<td class="' + subCls + '">' + fmtScore(sub) + '</td>' +
        (hasRaw ? '<td class="raw">' + (e.tele_raw != null ? e.tele_raw : '') + '</td>' : '') +
        cells + '</tr>';
    }).join('');
    return '<div class="bvr-scroll-hint fade-up">左右滑动查看完整计分板</div>' +
      '<div class="bvr-mw fade-up"><table class="bvr-mtx">' +
      '<thead>' + grpRow + colRow + '</thead><tbody>' + body + '</tbody></table></div>';
  }

  // 注释里的 {m:昵称} 渲染为 memberLink（桌面 @名 / 手机昵称）；其余文本转义
  function fmtNote(s) {
    return String(s).split(/(\{m:[^}]+\})/).map(function (part) {
      var mm = part.match(/^\{m:([^}]+)\}$/);
      return mm ? memberLink(mm[1]) : linkMentions(esc(part));  // 非 token 部分：自动链接「X妈」
    }).join('');
  }

  // 12 分合并表：每首获 12 分的歌一行（按条目 eid 聚合，避免同名成员官方/混淆串台），区分评委/观众给分
  function twelveBlock(m) {
    var byEid = {};
    (m.entries || []).forEach(function (e) { byEid[e.eid != null ? e.eid : e.member] = e; });  // eid 键(三四届)兼容昵称键(一二届)
    var got = {};  // eid -> {jury:[], tele:[]}
    var maxMode = (m.votes.voters || []).some(function (v) { return v.top != null; });  // 九届：12 分=投票人最高正式曲
    var voteMode = m.tele_mode === 'votes';  // 2024+ 决赛观众 20 票制：观众不设 12 分，仅评委计入
    m.votes.voters.forEach(function (v) {
      if (voteMode && v.type === 'tele') return;
      if (maxMode) {
        if (v.top != null) { (got[v.top] = got[v.top] || { jury: [], tele: [] })[v.type].push(v.voter); }
      } else {
        Object.keys(v.points).forEach(function (r) {
          if (v.points[r] === 12) { (got[r] = got[r] || { jury: [], tele: [] })[v.type].push(v.voter); }
        });
      }
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

  function rulesBlock(d) {
    var r = d.rules || {};
    // 结构化规则（2023+）：分节 + 列表 + 平台数据表 + 赋分表
    if (r.sections && r.sections.length) {
      var secs = r.sections.map(rulesSection).join('');
      return '<div class="bvr-rules bvr-rules--rich fade-up">' + secs + '</div>';  // 不写来源
    }
    // 旧扁平规则（2019–2022）
    var dl = '';
    if (r.submission) dl += '<dt>报名</dt><dd>' + esc(r.submission) + '</dd>';
    if (r.niche_standard && r.niche_standard.length) dl += '<dt>要求</dt><dd><span class="niche">' +
      r.niche_standard.map(function (x) { return '<code>' + esc(x) + '</code>'; }).join('') + '</span></dd>';
    if (r.format) dl += '<dt>赛制</dt><dd>' + esc(r.format) + '</dd>';
    if (r.voting) dl += '<dt>投票</dt><dd>' + esc(r.voting) + '</dd>';
    if (!dl) return '';
    return '<div class="bvr-rules fade-up"><dl>' + dl + '</dl></div>';  // 不写来源
  }
  function rulesSection(s) {
    var h = s.title ? '<h3 class="bvr-rule__h">' + esc(s.title) + '</h3>' : '';
    var body = (s.body || []).map(function (p) { return '<p class="bvr-rule__p">' + linkMentions(esc(p)) + '</p>'; }).join('');
    var list = '';
    if (s.list && s.list.length) {
      list = '<ul class="bvr-rule__list">' + s.list.map(function (it) {
        var sub = (it.sublist && it.sublist.length)
          ? '<ol class="bvr-rule__sub">' + it.sublist.map(function (x) { return '<li>' + linkMentions(esc(x)) + '</li>'; }).join('') + '</ol>' : '';
        return '<li><span class="bvr-rule__k">' + esc(it.k) + '</span>' +
          (it.v ? '<span class="bvr-rule__v">' + linkMentions(esc(it.v)) + '</span>' : '') + sub + '</li>';
      }).join('') + '</ul>';
    }
    var items = '';
    if (s.items && s.items.length) {  // 纯项目符号列表（无 k/v 结构，如资格/投票条目）
      items = '<ul class="bvr-rule__items">' + s.items.map(function (x) {
        return '<li>' + linkMentions(esc(x)) + '</li>';
      }).join('') + '</ul>';
    }
    var tbl = '';
    if (s.table) {
      var cap = s.table.caption ? '<div class="bvr-rule__cap">' + esc(s.table.caption) + '</div>' : '';
      var rows = (s.table.rows || []).map(function (row) {
        return '<tr><th>' + esc(row[0]) + '</th>' +
          row.slice(1).map(function (c) { return '<td>' + esc(c) + '</td>'; }).join('') + '</tr>';
      }).join('');
      tbl = cap + '<div class="bvr-rule__tw"><table class="bvr-rule__tbl"><tbody>' + rows + '</tbody></table></div>';
    }
    var scoring = '';
    if (s.scoring) {
      var rk = s.scoring.ranks.map(function (x) { return '<td>' + x + '</td>'; }).join('');
      var sc = s.scoring.scores.map(function (x, i) { return '<td class="bvr-rule__sc' + (i === 0 ? ' bvr-rule__sc--top' : '') + '">' + x + '</td>'; }).join('');
      scoring = '<div class="bvr-rule__tw"><table class="bvr-rule__score"><tbody>' +
        '<tr><th>排名</th>' + rk + '</tr><tr><th>分数</th>' + sc + '</tr></tbody></table></div>';
    }
    var foot = (s.foot ? (Array.isArray(s.foot) ? s.foot : [s.foot]) : [])
      .map(function (p) { return '<p class="bvr-rule__foot">' + esc(p) + '</p>'; }).join('');
    return '<div class="bvr-rule">' + h + body + items + list + tbl + scoring + foot + '</div>';
  }
  // info_sections（本届实时更新页：把 events 的 资格/赛程/投票/规则/关于 等静态内容做成数据驱动板块，
  // 复用结构化 rulesSection 渲染；每项 = 一个独立 section，排在「海选进展」之后）
  function infoSectionsBlocks(d) {
    return (d.info_sections || []).map(function (sec) {
      var inner = '<div class="bvr-rules bvr-rules--rich fade-up">' +
        (sec.sections || []).map(rulesSection).join('') + '</div>';
      return { id: sec.id, cn: sec.cn, en: sec.en, subtitle: sec.subtitle || '', html: inner };
    });
  }
  // 参赛名单（年度制）：合并各场参赛曲，按选送者拼音排序；列 选送者/歌手/歌曲名/语言/流派
  function entryListBlock(d) {
    var seen = {}, all = [];
    (d.matches || []).forEach(function (m) {
      if (m.canceled) return;
      (m.entries || []).forEach(function (e) {
        var key = e.member + '|' + e.song;
        if (seen[key]) return; seen[key] = 1; all.push(e);
      });
    });
    if (!all.length || !all.some(function (e) { return e.genre; })) return '';
    // 排序：ASCII 名（E/N/S…）在前，CJK 名按拼音（与官方名单一致）
    all.sort(function (a, b) {
      var aa = /^[\x00-\x7F]/.test(a.member), ba = /^[\x00-\x7F]/.test(b.member);
      if (aa !== ba) return aa ? -1 : 1;
      return String(a.member).localeCompare(String(b.member), 'zh');
    });
    var rows = all.map(function (e) {
      var by = e.member.indexOf('/') > -1
        ? '<span class="bvr-joint">' + e.member.split('/').map(function (n) { return memberLink(n.trim()); }).join('') + '</span>'
        : memberLink(e.member);
      return '<tr><td class="bvr-el__by">' + by + '</td>' +
        '<td class="artist">' + esc(fmtArtist(e.artist)) + '</td>' +
        '<td class="song">' + esc(e.song) + (e.member.indexOf('/') > -1 ? '<span class="bvr-joint-tag">合报</span>' : '') + '</td>' +
        '<td class="lang">' + esc(e.language || '') + '</td>' +
        '<td class="bvr-el__genre">' + esc(e.genre || '') + '</td></tr>';
    }).join('');
    return '<div class="bvr-scroll-hint fade-up">左右滑动查看完整名单</div>' +
      '<div class="bvr-tw fade-up"><table class="bvr-tbl bvr-el"><thead><tr>' +
      '<th>选送者</th><th>歌手</th><th>歌曲名</th><th>语言</th><th>流派</th>' +
      '</tr></thead><tbody>' + rows + '</tbody></table></div>';
  }
  // 海选阶段（2025+：部分成员举办海选选出参赛曲）。表：海选名称/成员/[时间]/[状态]/获胜歌手/获胜歌曲 + note
  // 时间列仅当有 period 时出现；状态列仅当有 status 时出现（进行中海选用，赛果届 ed15 无 status→不显示，向后兼容）。
  function auditionsBlock(d) {
    var a = d.auditions;
    if (!a || !a.list || !a.list.length) return '';
    var hasPeriod = a.list.some(function (it) { return it.period; });
    var hasStatus = a.list.some(function (it) { return it.status; });
    var ST = { '进行中': 'live', '已结束': 'done', '筹备中': 'prep' };
    function tbd(v, cls) {  // 空值（进行中海选尚无获胜曲）→「—」弱化
      return v ? '<td class="' + cls + '">' + v + '</td>' : '<td class="' + cls + '"><span class="bvr-aud__tbd">—</span></td>';
    }
    var rows = a.list.map(function (it) {
      var st = it.status ? '<span class="bvr-aud-st bvr-aud-st--' + (ST[it.status] || 'done') + '">' + esc(it.status) + '</span>' : '';
      // 获胜曲：已公布→歌手/歌名两列；未公布→单元格合并占两列（已结束「等待宣布」/ 进行中「—」）
      var winCells = (it.artist || it.song)
        ? tbd(it.artist ? esc(fmtArtist(it.artist)) : '', 'artist') + tbd(it.song ? esc(it.song) : '', 'song')
        : '<td colspan="2" class="bvr-aud__tbd">' + (it.status === '已结束' ? '等待宣布' : '—') + '</td>';
      return '<tr><td class="bvr-aud__name">' + esc(it.name) + '</td>' +
        '<td>' + memberLink(it.member) + '</td>' +
        (hasPeriod ? '<td class="bvr-aud__time">' + esc(it.period || '') + '</td>' : '') +
        (hasStatus ? '<td>' + st + '</td>' : '') +
        winCells + '</tr>';
    }).join('');
    var note = a.note ? '<p class="bvr-tbl-note fade-up">注：' + linkMentions(esc(a.note)) + '</p>' : '';
    return '<div class="bvr-scroll-hint fade-up">左右滑动查看完整海选</div>' +
      '<div class="bvr-tw fade-up"><table class="bvr-tbl bvr-aud"><thead><tr>' +
      '<th>海选名称</th><th>成员</th>' + (hasPeriod ? '<th>时间</th>' : '') + (hasStatus ? '<th>状态</th>' : '') +
      '<th>获胜歌手</th><th>获胜歌曲</th>' +
      '</tr></thead><tbody>' + rows + '</tbody></table></div>' + note;
  }

  // ── 进行中（live）报名 ─────────────────────────────────────────
  // 报名名单：Candidates（直通半决赛）+ Wildcards（海选突围赛）两组表；按 JSON 顺序呈现（= 报名顺序）
  function signupRow(s) {
    var joint = s.member.indexOf('/') > -1;
    var by = joint
      ? '<span class="bvr-joint">' + s.member.split('/').map(function (n) { return memberLink(n.trim()); }).join('') + '</span>'
      : memberLink(s.member);
    var modeCls = s.mode === '内部选送' ? 'bvr-mode--internal' : 'bvr-mode--open';
    return '<tr><td class="bvr-su__by">' + by + '</td>' +
      '<td class="artist">' + esc(fmtArtist(s.artist)) + '</td>' +
      '<td class="song">' + esc(s.song) + (joint ? '<span class="bvr-joint-tag">合报</span>' : '') + '</td>' +
      '<td class="lang">' + esc(s.language || '') + '</td>' +
      '<td class="bvr-su__genre">' + esc(s.genre || '') + '</td>' +
      '<td>' + (s.mode ? '<span class="bvr-mode ' + modeCls + '">' + esc(s.mode) + '</span>' : '') + '</td></tr>';
  }
  function signupTable(list) {
    return '<div class="bvr-scroll-hint fade-up">左右滑动查看完整名单</div>' +
      '<div class="bvr-tw fade-up"><table class="bvr-tbl bvr-su"><thead><tr>' +
      '<th>选送者</th><th>歌手</th><th>歌曲名</th><th>语言</th><th>流派</th><th>报名方式</th>' +
      '</tr></thead><tbody>' + list.map(signupRow).join('') + '</tbody></table></div>';
  }
  function signupListBlock(d) {
    var su = d.signups || [];
    if (!su.length) return '';
    var cand = su.filter(function (s) { return s.role === 'candidate'; });
    var wild = su.filter(function (s) { return s.role === 'wildcard'; });
    var out = '';
    if (cand.length) out += '<div class="bvr-dvr-sub fade-up">Candidates · Semi-Final</div>' + signupTable(cand);
    if (wild.length) out += '<div class="bvr-dvr-sub fade-up">Wildcards · 海选突围赛</div>' + signupTable(wild);
    return out;
  }
  // 相关链接（直播回放 + 歌单链接，分平台）；任意届 d.links 存在即渲染
  function linksBlock(d) {
    var L = d.links;
    if (!L) return '';
    function row(it) {
      return '<a class="bvr-link" href="' + esc(it.url) + '" target="_blank" rel="noopener">' + esc(it.label) + '</a>';
    }
    var out = '';
    if (L.replays && L.replays.length) {
      out += '<div class="bvr-links__grp fade-up"><h3 class="bvr-links__h">直播回放</h3>' +
        '<div class="bvr-links__list">' + L.replays.map(row).join('') + '</div></div>';
    }
    if (L.recaps && L.recaps.length) {
      out += '<div class="bvr-links__grp fade-up"><h3 class="bvr-links__h">赛事回顾</h3>' +
        '<div class="bvr-links__list">' + L.recaps.map(row).join('') + '</div></div>';
    }
    if (L.playlists && L.playlists.length) {
      var subs = L.playlists.map(function (p) {
        return '<div class="bvr-links__sub"><h4 class="bvr-links__subh">' + esc(p.platform) + '</h4>' +
          '<div class="bvr-links__list">' + (p.items || []).map(row).join('') + '</div></div>';
      }).join('');
      out += '<div class="bvr-links__grp fade-up"><h3 class="bvr-links__h">歌单链接</h3>' + subs + '</div>';
    }
    return out;
  }
  // 总成绩单（年度制）：每首一行，合并 GF + 各自半决赛（得分 / 得票率 / 票数），对标官方 Final Results
  function scoreboardBlock(d) {
    if (!isAnnual(d)) return '';
    var gf = null, sf = {};
    (d.matches || []).forEach(function (m) {
      if (m.match === 'GF') gf = m; else if (m.match === 'SF1' || m.match === 'SF2') sf[m.match] = m;
    });
    if (!gf || !sf.SF1 || !sf.SF2) return '';
    var semiOf = {};  // 选送者 → {code, e}（其半决赛场次 + 该场名次/数据）
    ['SF1', 'SF2'].forEach(function (code) {
      sf[code].entries.forEach(function (e) { semiOf[e.member] = { code: code, e: e }; });
    });
    var rows = [];
    gf.entries.forEach(function (e) {
      rows.push({ ov: e.overall_rank, member: e.member, song: e.song, artist: e.artist, gf: e, sf: semiOf[e.member] });
    });
    ['SF1', 'SF2'].forEach(function (code) {
      sf[code].entries.forEach(function (e) {
        if (!e.qualified) rows.push({ ov: e.overall_rank, member: e.member, song: e.song, artist: e.artist, gf: null, sf: { code: code, e: e } });
      });
    });
    rows.sort(function (a, b) { return a.ov - b.ov; });

    // 每场每首歌的评委/观众投票人数（给正分的人数，按 type 计）→ 计分板「评委数 / 观众数」两列
    function voterCounts(m) {
      var map = {};
      (m.entries || []).forEach(function (e) { map[String(e.eid)] = { j: 0, t: 0 }; });
      (m.votes.voters || []).forEach(function (v) {
        Object.keys(v.points || {}).forEach(function (k) {
          if ((v.points[k] || 0) > 0 && map[k]) { if (v.type === 'tele') map[k].t++; else map[k].j++; }
        });
      });
      return map;
    }
    var gfVC = voterCounts(gf), sfVC = { SF1: voterCounts(sf.SF1), SF2: voterCounts(sf.SF2) };
    function vcOf(r, which) {  // 该行 GF / 半决赛该首的 {j,t}（无则 null）
      if (which === 'gf') return r.gf ? gfVC[String(r.gf.eid)] : null;
      return r.sf ? sfVC[r.sf.code][String(r.sf.e.eid)] : null;
    }
    // 各列最大值（Jury / Tele / 评委数 / 观众数，GF 与 SF 各自统计）→ 高亮为 --clr-text
    function maxOf(fn) {
      var m = null;
      rows.forEach(function (r) { var v = fn(r); if (v != null && (m === null || v > m)) m = v; });
      return m;
    }
    var gfMax = {
      jury: maxOf(function (r) { return r.gf ? r.gf.jury_vote : null; }),
      tele: maxOf(function (r) { return r.gf ? r.gf.tele_vote : null; }),
      jvot: maxOf(function (r) { var c = vcOf(r, 'gf'); return c ? c.j : null; }),
      tvot: maxOf(function (r) { var c = vcOf(r, 'gf'); return c ? c.t : null; }),
    };
    var sfMax = {
      jury: maxOf(function (r) { return r.sf ? r.sf.e.jury_vote : null; }),
      tele: maxOf(function (r) { return r.sf ? r.sf.e.tele_vote : null; }),
      jvot: maxOf(function (r) { var c = vcOf(r, 'sf'); return c ? c.j : null; }),
      tvot: maxOf(function (r) { var c = vcOf(r, 'sf'); return c ? c.t : null; }),
    };

    function rate(v) { return v == null ? '–' : (Number(v).toFixed(2) + '%'); }
    // 一组 6 列：Points / Rate / Jury / 评委数 / Tele(+观众票) / 观众数（数值列最大值加 is-max 高亮）
    function stat6(e, cls, mx, vc) {
      if (!e) return ['bvr-sb-pts', 'bvr-sb-rate', 'bvr-sb-jury', 'bvr-sb-vot', 'bvr-sb-tele', 'bvr-sb-vot']
        .map(function (c) { return '<td class="' + c + ' ' + cls + '">–</td>'; }).join('');
      function mc(val, key) { return (mx && val != null && val === mx[key]) ? ' is-max' : ''; }
      // 观众分（20 票制届）右侧附「观众票」原始票数（左观众分、右票数）
      var teleRaw = (e.tele_raw != null) ? '<span class="bvr-sb-raw">' + e.tele_raw + '票</span>' : '';
      var jv = vc ? vc.j : null, tv = vc ? vc.t : null;
      return '<td class="bvr-sb-pts ' + cls + '">' + fmtScore(e.score) + '</td>' +
        '<td class="bvr-sb-rate ' + cls + '">' + rate(e.support_rate) + '</td>' +
        '<td class="bvr-sb-jury ' + cls + mc(e.jury_vote, 'jury') + '">' + fmtScore(e.jury_vote) + '</td>' +
        '<td class="bvr-sb-vot ' + cls + mc(jv, 'jvot') + '">' + (jv != null ? jv : '–') + '</td>' +
        '<td class="bvr-sb-tele ' + cls + mc(e.tele_vote, 'tele') + '">' + fmtScore(e.tele_vote) + teleRaw + '</td>' +
        '<td class="bvr-sb-vot ' + cls + mc(tv, 'tvot') + '">' + (tv != null ? tv : '–') + '</td>';
    }
    var body = rows.map(function (r) {
      var medal = r.ov <= 3 ? ' bvr-sb-row--' + r.ov : '';
      var sfb = '';
      if (r.sf) sfb = '<span class="bvr-sb-badge bvr-sb-badge--' + r.sf.code.toLowerCase() + '">' +
        '<span class="bvr-sb-badge__n">' + r.sf.e.rank + '</span>' +
        '<span class="bvr-sb-badge__t">' + r.sf.code + '</span></span>';
      else sfb = '<span class="bvr-sb-direct">直通</span>';  // 东道主/协办直通决赛、无半决赛
      return '<tr class="bvr-sb-row' + medal + '">' +
        '<td class="bvr-sb-rank">' + r.ov + '</td>' +
        '<td class="bvr-sb-by">' + memberLink(r.member, { nick: true }) + '</td>' +
        '<td class="bvr-sb-song">' +
        '<span class="bvr-sb-artist">' + esc(fmtArtist(r.artist)) + '</span>' +
        '<span class="bvr-sb-title">' + esc(r.song) + '</span></td>' +
        stat6(r.gf, 'is-gf', gfMax, vcOf(r, 'gf')) +
        '<td class="bvr-sb-sf">' + sfb + '</td>' +
        stat6(r.sf ? r.sf.e : null, 'is-sf', sfMax, vcOf(r, 'sf')) + '</tr>';
    }).join('');
    var head = '<thead>' +
      '<tr><th class="bvr-sb-rank" rowspan="2">#</th><th class="bvr-sb-by" rowspan="2">选送者</th><th class="bvr-sb-song" rowspan="2">参赛作品</th>' +
      '<th class="bvr-sb-grp bvr-sb-grp--gf" colspan="6">Grand Final</th>' +
      '<th class="bvr-sb-grp bvr-sb-grp--sf" colspan="7">Semi-Final</th></tr>' +
      '<tr><th class="bvr-sb-gfh">Points</th><th class="bvr-sb-gfh">Rate</th><th class="bvr-sb-gfh">Jury</th><th class="bvr-sb-gfh">Voters</th><th class="bvr-sb-gfh">Tele</th><th class="bvr-sb-gfh">Voters</th>' +
      '<th class="bvr-sb-sfh"></th><th>Points</th><th>Rate</th><th>Jury</th><th>Voters</th><th>Tele</th><th>Voters</th></tr></thead>';
    var t = theme(d) || {};
    var vars = '--bvt-c1:' + (t.c1 || '#f0609c') + ';--bvt-c2l:' + (t.c2l || '#fbb1a9') + ';';
    function pollItem(label, n) { return '<span class="bvr-sb-poll__it"><span class="bvr-sb-poll__t">' + esc(label) + '</span><span class="bvr-sb-poll__n">' + n + '</span></span>'; }
    var poll = '<div class="bvr-sb-poll fade-up"><span class="bvr-sb-poll__lbl">总投票人数</span>' +
      pollItem('Grand Final', gf.votes.voters.length) +
      pollItem('Semi-Final 1', sf.SF1.votes.voters.length) +
      pollItem('Semi-Final 2', sf.SF2.votes.voters.length) + '</div>';
    return '<div class="bvr-scroll-hint fade-up">左右滑动查看完整成绩单</div>' +
      '<div class="bvr-tw bvr-sb-tw fade-up" style="' + vars + '"><table class="bvr-sb">' + head + '<tbody>' + body + '</tbody></table></div>' +
      poll;
  }

  /* ---------- TOC ---------- */
  function buildTOC(items) {
    var nav = document.createElement('nav');
    nav.className = 'bvr-toc';
    nav.setAttribute('aria-label', '页内目录');
    var ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 6h12M8 12h12M8 18h12"/><circle cx="4" cy="6" r="1"/><circle cx="4" cy="12" r="1"/><circle cx="4" cy="18" r="1"/></svg>';
    nav.innerHTML = '<div class="bvr-toc__list">' + items.map(function (it) {
      return '<div class="bvr-toc__item" data-target="' + it.id + '">' +
        '<span class="bvr-toc__dash"></span><span class="bvr-toc__label">' + esc(it.label) + '</span></div>';
    }).join('') + '</div>' +
      '<button class="bvr-toc__toggle" type="button" aria-label="页内目录">' + ICON + '</button>';
    document.body.appendChild(nav);
    // 顶部（hero）时隐藏目录，下滚一定距离后再显示

    // 移动端悬浮按钮：点击展开/收起目录面板；点条目或点面板外部自动收起（桌面端 toggle 隐藏、list 常显，--open 无副作用）
    var toggle = nav.querySelector('.bvr-toc__toggle');
    toggle.addEventListener('click', function (e) { e.stopPropagation(); nav.classList.toggle('bvr-toc--open'); });
    document.addEventListener('click', function (e) { if (!nav.contains(e.target)) nav.classList.remove('bvr-toc--open'); });

    var els = Array.prototype.slice.call(nav.querySelectorAll('.bvr-toc__item'));
    var navH = 72, suppress = false, timer = null;
    function updateTocVisible() { nav.classList.toggle('bvr-toc--visible', window.scrollY > 300); }
    updateTocVisible();
    window.addEventListener('scroll', function () {
      updateTocVisible();
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
        nav.classList.remove('bvr-toc--open');  // 移动端：点条目后收起面板
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
      var defaultOrder = Array.prototype.slice.call(tbody.rows);  // 默认顺序（第三态恢复用）
      var state = { cls: null, dir: 0 };  // dir：-1 降序(下亮) / 1 升序(上亮) / 0 默认(都不亮)
      tbl.querySelectorAll('thead th.th-ro, thead th.th-jury, thead th.th-tele, thead th.th-pts, thead th.th-place').forEach(function (th) {
        th.classList.add('bvr-th-sort');
        var cls = th.classList.contains('th-ro') ? 'ro'
          : th.classList.contains('th-jury') ? 'pts--jury'
          : th.classList.contains('th-tele') ? 'pts--tele'
          : th.classList.contains('th-place') ? 'place' : 'pts--total';
        th.addEventListener('click', function () {
          // 三态循环：默认 → 降序 → 升序 → 默认
          if (state.cls !== cls) { state.cls = cls; state.dir = -1; }
          else state.dir = state.dir === -1 ? 1 : (state.dir === 1 ? 0 : -1);
          var rows;
          if (state.dir === 0) { rows = defaultOrder.slice(); state.cls = null; }
          else {
            rows = Array.prototype.slice.call(tbody.rows).sort(function (a, b) {
              var va = parseFloat((a.querySelector('.' + cls) || {}).getAttribute('data-v')) || 0;
              var vb = parseFloat((b.querySelector('.' + cls) || {}).getAttribute('data-v')) || 0;
              return (va - vb) * state.dir;
            });
          }
          rows.forEach(function (r) { tbody.appendChild(r); });
          tbl.querySelectorAll('thead th').forEach(function (h) { h.removeAttribute('data-sort'); });
          if (state.dir !== 0) th.setAttribute('data-sort', state.dir < 0 ? 'desc' : 'asc');
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
      var state = { col: null, dir: 0 };  // 默认：无排序（初始顺序、都不亮）。dir：-1 降序 / 1 升序 / 0 默认
      function indicate() {
        heads.forEach(function (h) { h.removeAttribute('data-sort'); });
        if (!state.col || !state.dir) return;
        var th = heads.find(function (h) { return h.dataset.msort === state.col; });
        if (th) th.setAttribute('data-sort', state.dir < 0 ? 'desc' : 'asc');
      }
      heads.forEach(function (th) {
        th.addEventListener('click', function () {
          var col = th.dataset.msort;
          // 三态循环：默认 → 降序 → 升序 → 默认
          if (state.col !== col) { state.col = col; state.dir = -1; }
          else state.dir = state.dir === -1 ? 1 : (state.dir === 1 ? 0 : -1);
          var rows;
          if (state.dir === 0) { rows = defaultOrder.slice(); state.col = null; }
          else if (col === 'rcp') {
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

  // 海报背景预解码 → 淡入（消除大图弹出 + 主线程解码卡顿）；仅主题届（2023+ bvr hero），live 页 2026 由薄壳自处理
  function revealPoster(d) {
    var th = theme(d);
    if (!th) return;
    var el = document.querySelector('.bvr-hero--bg .bvr-hero__poster');
    if (!el) return;
    var url = window.matchMedia('(max-width:768px)').matches ? (th.posterMobile || th.poster) : th.poster;
    var im = new Image();
    function done() { el.classList.add('loaded'); }
    im.onload = done; im.onerror = done;
    im.src = url;
    if (im.decode) { im.decode().then(done).catch(function () {}); }
  }

  /* ---------- render ---------- */
  function render(d, idx) {
    DATA = d;
    EDIDX = idx || { editions: [] };
    buildMentions(d);  // 正文「X妈」自动链接映射（全届花名册 + 本届 members）
    document.title = d.edition_name + ' | Barvision';
    var root = document.getElementById('bvr-root');
    // live（本届实时更新页）的 hero 由页面自身静态提供（复用 events 风格 + 倒计时），渲染器不再生成
    var html = d.live ? '' : buildHero(d);
    var toc = [];
    var th = theme(d);
    var annual = isAnnual(d);

    // 0) 视觉设计（简介已并入主题届 hero，不再单列）
    if (d.visual_design) {
      html += section('visual', '视觉设计', 'Visual Design', '', proseBlock(d.visual_design));
      toc.push({ id: 'visual', label: '视觉设计' });
    }

    // 1) 赛制
    var rb = rulesBlock(d);
    if (rb) { html += section('rules', '赛制', 'Rules', '', rb); toc.push({ id: 'rules', label: '赛制' }); }

    // 1.3) 参赛名单（含流派；仅 entries 带 genre 时出现）
    var el = entryListBlock(d);
    if (el) { html += section('entries', '参赛名单', 'Entries', '', el); toc.push({ id: 'entries', label: '参赛名单' }); }

    // 1.35) 进行中（live，本届实时更新页）：报名名单（Candidates / Wildcards）
    if (d.live) {
      var sl = signupListBlock(d);
      if (sl) { html += section('signups', '选送名单', 'Submissions', '', sl); toc.push({ id: 'signups', label: '选送名单' }); }
    }

    // 1.4) 海选阶段（仅 d.auditions 存在时；本届起不匿名、部分成员办海选选曲；进行中则标题用「海选进展」）
    var ab = auditionsBlock(d);
    if (ab) {
      var audLabel = d.live ? '海选进展' : '海选阶段';
      html += section('auditions', audLabel, 'Auditions', '', ab); toc.push({ id: 'auditions', label: audLabel });
    }

    // 1.45) 信息板块（本届实时更新页：赛程 / 投票 / 资格 / 规则 / 关于，数据驱动，排在海选之后）
    infoSectionsBlocks(d).forEach(function (s) {
      html += section(s.id, s.cn, s.en, s.subtitle, s.html);
      toc.push({ id: s.id, label: s.cn });
    });

    // 1.5) 成员变动（live 进行中报名阶段名单未定，跳过——否则上届全员会被误判为「退出」）
    if (!d.live) {
      var mc = memberChangesBlock(d);
      if (mc) { html += section('changes', '成员变动', 'Roster Changes', '', mc); toc.push({ id: 'changes', label: '成员变动' }); }
    }

    // 2) 每个 match：结果概览 + Detailed voting results（计分板 / 12 分）
    var multi = d.matches.length > 1;
    d.matches.forEach(function (m, mi) {
      var pfx = multi ? (matchEng(m) + ' ') : '';
      var venue = esc(m.venue || '');

      // 取消的组（如 12B）：仅展示选送名单（已按选送者排序），无结果/计分板/12分
      if (m.canceled) {
        var cid = 'canceled' + (multi ? mi : '');
        html += section(cid, pfx + '选送名单', 'Submissions · Canceled',
          '本组报名后因故未举办，仅存档选送名单（按选送者大名排序）。', canceledList(m));
        toc.push({ id: cid, label: (multi ? venue : '') + '选送名单' });
        return;
      }

      var tv = tocVenue(m);  // 目录用场次名（SF1/SF2 英文 / 决赛 / 旧届中文 venue）
      var isGF = m.match === 'GF';

      // 结果概览（含本场概况 + 折算注；折算注仅年度制在此渲染，旧届仍随计分板）
      var stageIntro = m.summary ? '<div class="bvr-stage-intro fade-up">' + paras(m.summary) + '</div>' : '';
      var rt = stageIntro + resultTable(m, annual);
      if (annual && m.note) rt += '<p class="bvr-tbl-note fade-up">注：' + fmtNote(m.note) + '</p>';
      // 年度制 TOC：每场合并为一条（标题式英文），指向结果概览节；旧届保留「概览/详情」两条
      var ANNUAL_TOC = { SF1: 'Semi-Final 1', SF2: 'Semi-Final 2', GF: 'Grand Final' };
      var rid = 'result' + (multi ? mi : '');
      html += section(rid, pfx + '结果概览', 'Results', '', rt);
      if (annual) toc.push({ id: rid, label: ANNUAL_TOC[m.match] || tv });
      else toc.push({ id: rid, label: (multi ? tv + ' 概览' : '概览') });

      // 投票详情：年度制(2023+) 决赛拆评委/观众两张计分板；半决赛合并一张；旧届合并一张
      var dvr = '';
      var ro = annual ? bvRunningOrder(m) : null;  // 年度制：计分板加 R/O 列（可排序）
      // 拆评委/观众两张：GF（所有年度制）+ 任何 20 票制观众场（2025 起 SF 也是 20 票制 → 也拆）
      if (annual && (isGF || m.tele_mode === 'votes')) {
        var mj = votingMatrixSingle(m, 'jury', ro), mt = votingMatrixSingle(m, 'tele', ro);
        if (mj) dvr += '<div class="bvr-dvr-sub fade-up">Jury Scoreboard</div>' + mj;
        if (mt) dvr += '<div class="bvr-dvr-sub fade-up">Tele Scoreboard</div>' + mt;
      } else {
        var mtx = votingMatrix(m, '选送者', ro);
        if (mtx) dvr += '<div class="bvr-dvr-sub bvr-dvr-sub--matrix fade-up">Scoreboard</div>' + mtx;
      }
      dvr += '<div class="bvr-dvr-sub bvr-dvr-sub--12 fade-up">12 Points</div>' + twelveBlock(m);

      var did = 'dvr' + (multi ? mi : '');
      html += section(did, pfx + '投票详情', 'Detailed Voting Results', '', dvr);
      if (!annual) toc.push({ id: did, label: (multi ? tv + ' 详情' : '详情') });  // 年度制已合并进上面一条
    });

    // 2.5) 最终赛果（年度制：合并 SF + GF 的完整成绩）
    var sb = scoreboardBlock(d);
    if (sb) { html += section('scoreboard', '最终赛果', 'Scoreboard', '', sb); toc.push({ id: 'scoreboard', label: '最终赛果' }); }

    // 2.6) 相关链接（直播回放 / 歌单）——任意届 d.links 存在即渲染
    var lk = linksBlock(d);
    if (lk) { html += section('links', '相关链接', 'Related Links', '', lk); toc.push({ id: 'links', label: '相关链接' }); }

    // 3) 上一届 / 下一届
    html += navBlock(d);

    root.innerHTML = html;  // 主题色仅作用于 hero（hero 自带内联 --bvt-* 变量），其余板块保持默认
    revealPoster(d);  // 海报背景预解码完成后淡入（消除弹出/解码卡顿）
    buildTOC(toc);
    observeFades();
    wireSortable();
    wireMatrixSort();
    stickyMatrixCols();
    stickyResultCols();
    stickyScoreboardCols();
    updateScrollHints();
    var _smt;
    window.addEventListener('resize', function () { clearTimeout(_smt); _smt = setTimeout(function () { stickyMatrixCols(); stickyResultCols(); stickyScoreboardCols(); updateScrollHints(); }, 150); });
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
      var lMem = colW(row.cells[0]), lArt = lMem + colW(row.cells[1]);
      tbl.style.setProperty('--tbl-l-mem', lMem + 'px');
      tbl.style.setProperty('--tbl-l-art', lArt + 'px');
    });
  }

  // 总成绩单冻结（仅手机）：量出 # 列宽 → 参赛作品列 left 偏移
  function stickyScoreboardCols() {
    if (window.matchMedia('(min-width:769px)').matches) return;
    document.querySelectorAll('.bvr-sb').forEach(function (tbl) {
      var row = tbl.tBodies[0] && tbl.tBodies[0].rows[0]; if (!row || row.cells.length < 2) return;
      var c0 = row.cells[0].offsetWidth, c1 = row.cells[1].offsetWidth;  // # 列 / 选送者 列
      tbl.style.setProperty('--sb-l-by', c0 + 'px');
      tbl.style.setProperty('--sb-l-song', (c0 + c1) + 'px');
    });
  }
  // 计分板冻结（桌面+手机统一）：量出 选送者/Total/Jury 列宽，写入 left 偏移，冻结至 Tele 列
  // 用 getBoundingClientRect().width（分数精度）而非 offsetWidth（整数）累加 left 偏移——
  // 整数舍入会使后续冻结列的 left 与其静止位置差零点几 px，横滑时冻结窗格出现轻微抖动/缝隙。
  function colW(el) { return el ? el.getBoundingClientRect().width : 0; }
  function stickyMatrixCols() {
    document.querySelectorAll('.bvr-mtx').forEach(function (tbl) {
      var hr = tbl.tHead && tbl.tHead.rows[0]; if (!hr) return;
      var ro = hr.querySelector('.ro'), rcp = hr.querySelector('.rcp'),
          tot = hr.querySelector('.tot'), sj = hr.querySelector('.sj'), st = hr.querySelector('.st'),
          raw = hr.querySelector('.raw');
      if (!rcp || !tot) return;
      var lRcp = colW(ro);                         // R/O 列宽（无则 0）
      var lTot = lRcp + colW(rcp);
      var lSj = lTot + colW(tot);                  // Jury 小计列位置
      var lSt = sj ? lSj + colW(sj) : lSj;         // Tele 小计：有 sj 在其后，否则紧随 tot
      var lRaw = lSt + (st ? colW(st) : 0);        // 票数列（观众表）：Tele 之后
      tbl.style.setProperty('--mtx-l-rcp', lRcp + 'px');
      tbl.style.setProperty('--mtx-l-tot', lTot + 'px');
      tbl.style.setProperty('--mtx-l-sj', lSj + 'px');
      tbl.style.setProperty('--mtx-l-st', lSt + 'px');
      tbl.style.setProperty('--mtx-l-raw', lRaw + 'px');
    });
  }

  /* ---------- boot ---------- */
  injectCSS();
  var src = (typeof EDITION_SRC !== 'undefined') ? EDITION_SRC : null;
  if (!src) { console.error('bv-results-render: EDITION_SRC 未定义'); return; }
  Promise.all([
    fetch(src).then(function (r) { return r.json(); }),
    fetch('/data/barvision/editions-index.json').then(function (r) { return r.json(); }).catch(function () { return { editions: [] }; })
  ]).then(function (res) { render(res[0], res[1]); })
    .catch(function (e) { console.error('bv-results-render: 加载失败', e);
      var root = document.getElementById('bvr-root');
      if (root) root.innerHTML = '<section class="section"><div class="section__inner">' +
        '<p style="color:var(--clr-text-2)">赛果数据加载失败。</p></div></section>'; });
})();
