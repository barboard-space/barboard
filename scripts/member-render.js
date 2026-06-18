(function () {
  'use strict';

  /* ── CSS ── */
  var css = [
    '.mp-hero{padding:calc(var(--nav-h) + 56px) 0 64px;position:relative;overflow:hidden}',
    '.mp-hero__glow{position:absolute;inset:0;background:radial-gradient(ellipse 70% 60% at 30% 0%,rgba(168,85,247,.18) 0%,transparent 60%),radial-gradient(ellipse 50% 40% at 80% 80%,rgba(0,180,255,.07) 0%,transparent 55%);pointer-events:none}',
    '.mp-hero__inner{position:relative;z-index:1}',
    '.mp-eyebrow{font-size:11px;font-weight:600;letter-spacing:.32em;text-transform:uppercase;color:var(--clr-violet-light);margin-bottom:40px;display:inline-flex;align-items:center;gap:8px;transition:color .2s;text-decoration:none}',
    '.mp-eyebrow:hover{color:var(--clr-white)}',
    '.mp-card{display:grid;grid-template-columns:auto 1fr auto;gap:40px;align-items:start}',
    '.mp-avatar{width:120px;height:120px;border-radius:50%;overflow:hidden;border:2px solid var(--clr-border-2);background:var(--clr-surface-2);flex-shrink:0;position:relative}',
    '.mp-avatar img{width:100%;height:100%;object-fit:cover;display:block}',
    '.mp-avatar__placeholder{width:100%;height:100%;display:flex;align-items:center;justify-content:center;color:var(--clr-violet-light);background:linear-gradient(135deg,var(--clr-surface) 0%,var(--clr-surface-2) 100%);letter-spacing:0}',
    '.mp-avatar__ring{position:absolute;inset:-3px;border-radius:50%;background:linear-gradient(135deg,var(--clr-violet),var(--clr-accent));z-index:-1;opacity:.6}',
    '.mp-info{padding-top:8px}',
    '.mp-nickname{font-family:var(--font-display);font-size:48px;line-height:1;color:var(--clr-text);letter-spacing:.04em;margin-bottom:6px;display:flex;align-items:flex-start}',
    '.mp-bv-badge{display:inline-block;flex-shrink:0;width:30px;height:29px;margin-left:7px}',
    '.mp-bv-badge__mark{display:block;width:100%;height:100%}',
    '.mp-bv-badge__mark path{fill:currentColor}',
    '.mp-bv-badge__num{font-family:var(--font-display)}',
    /* 创始届（第一届）金色光晕 + 缓慢呼吸，凸显其特别 */
    '.mp-bv-badge--first{filter:drop-shadow(0 0 3px rgba(212,168,50,.5)) drop-shadow(0 0 8px rgba(212,168,50,.28));animation:mpBvFirstGlow 3.2s ease-in-out infinite}',
    '@keyframes mpBvFirstGlow{0%,100%{filter:drop-shadow(0 0 3px rgba(212,168,50,.42)) drop-shadow(0 0 7px rgba(212,168,50,.2))}50%{filter:drop-shadow(0 0 5px rgba(212,168,50,.72)) drop-shadow(0 0 13px rgba(212,168,50,.42))}}',
    '@media (prefers-reduced-motion:reduce){.mp-bv-badge--first{animation:none}}',
    '.mp-handle{font-size:15px;color:var(--clr-text-2);margin-bottom:20px}',
    '.mp-nickname--unclaimed{font-family:var(--font-body);font-size:34px;font-weight:700;color:var(--clr-text-3);letter-spacing:.02em}',
    '.mp-bv-note{font-size:13px;color:var(--clr-text-3);line-height:1.65;margin-bottom:22px;max-width:680px}',
    '.mp-tags{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:24px}',
    '.mp-tag{font-size:10px;font-weight:600;letter-spacing:.12em;text-transform:uppercase;padding:4px 10px;border-radius:4px;border:1px solid var(--clr-border-2);color:var(--clr-text-2);background:var(--clr-surface)}',
    '.mp-tag--violet{border-color:rgba(168,85,247,.4);color:var(--clr-violet-light);background:rgba(168,85,247,.08)}',
    '.mp-tag--cun{border-color:rgba(200,145,55,.4);color:#D49840;background:rgba(180,120,45,.1)}',
    '.mp-tag--indie{border-color:rgba(240,96,184,.4);color:var(--clr-pink-light);background:var(--clr-pink-dim)}',
    '.mp-links{display:flex;flex-direction:column;gap:8px;padding-top:8px}',
    '.mp-link{display:inline-flex;align-items:center;justify-content:center;gap:6px;font-size:12px;font-weight:500;color:var(--clr-text-2);padding:3px 14px;border-radius:6px;border:1px solid var(--clr-border);background:var(--clr-surface);text-decoration:none;transition:border-color .2s,color .2s,background .2s;width:100%;box-sizing:border-box}',
    '.mp-link:hover{border-color:var(--clr-border-2);color:var(--clr-text);background:var(--clr-surface-2)}',
    '@media (hover:none),(pointer:coarse){.mp-link:hover{border-color:var(--clr-border);color:var(--clr-text-2);background:var(--clr-surface)}}',
    '.mp-section{padding:56px 0 64px;border-top:1px solid var(--clr-border)}',
    '.mp-section-label{font-family:var(--font-mono);font-size:10px;letter-spacing:.32em;text-transform:uppercase;color:var(--clr-violet-light);margin-bottom:12px}',
    '.mp-section-title{font-family:var(--font-display);font-size:28px;letter-spacing:.06em;color:var(--clr-text);margin-bottom:28px}',
    '.mp-works-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:16px}',
    '.mp-work-card{background:var(--clr-surface);border:1px solid var(--clr-border);border-radius:8px;padding:20px;text-decoration:none;display:block;transition:border-color .2s,background .2s}',
    '.mp-work-card:hover{border-color:var(--clr-border-2);background:var(--clr-surface-2)}',
    '.mp-work-card__type{font-size:10px;font-family:var(--font-mono);letter-spacing:.2em;text-transform:uppercase;color:var(--clr-text-3);margin-bottom:8px}',
    '.mp-work-card__title{font-size:15px;font-weight:600;color:var(--clr-text);margin-bottom:4px}',
    '.mp-work-card__desc{font-size:12px;color:var(--clr-text-2);line-height:1.5}',
    '.mp-todo{font-size:13px;color:var(--clr-text-3);padding:32px;border:1px dashed var(--clr-border);border-radius:8px;text-align:center}',
    /* 吧视 板块 */
    '.mp-bv-stats{display:grid;grid-template-columns:repeat(auto-fit,minmax(88px,1fr));gap:10px;margin-bottom:26px}',
    '.mp-bv-stat{background:var(--clr-surface);border:1px solid var(--clr-border);border-radius:8px;padding:15px 10px 11px;text-align:center;display:flex;flex-direction:column;align-items:center;justify-content:center}',
    '.mp-bv-stat__v{font-family:var(--font-display);font-size:26px;line-height:1;color:var(--clr-text);min-height:26px;display:flex;align-items:center;justify-content:center}',
    '.mp-bv-stat__v--cjk{font-family:var(--font-body);font-size:20px;font-weight:600;letter-spacing:.02em}',
    '.mp-bv-stat__v .sh{font-family:var(--font-body);font-size:13px;color:var(--clr-text-3);margin-left:3px}',
    '.mp-bv-stat__v .mp-bv-rep{font-family:var(--font-body);font-size:14px;opacity:.85;margin-left:3px}',
    '.mp-bv-stat__k{font-size:11px;color:var(--clr-text-2);margin-top:7px}',
    '.mp-bv-stat--active .mp-bv-stat__v{color:var(--clr-violet-light)}',
    '.mp-bv-trend{margin-top:52px}',
    '.mp-bv-trend__title{font-size:13px;font-weight:600;color:var(--clr-text-2);margin-bottom:8px}',
    '.mp-bv-trend__rank{fill:var(--clr-text-2);font-family:var(--font-mono);font-size:12px}',
    '.mp-bv-trend__svg{width:100%;height:auto;display:block;overflow:visible}',
    '.mp-bv-trend__grid{stroke:var(--clr-border);stroke-width:1}',
    '.mp-bv-trend__ylab,.mp-bv-trend__xlab{fill:var(--clr-text-3);font-family:var(--font-mono);font-size:13px}',
    '.mp-bv-trend__edge{stroke:var(--clr-accent-line);stroke-width:2;fill:none}',
    '.mp-bv-trend__edge.is-dim{stroke:var(--clr-text-3);stroke-width:2;stroke-dasharray:5 4;opacity:.6}',
    '.mp-bv-trend__dot{fill:var(--clr-accent-light)}',
    '.mp-bv-trend__dot.is-champ{fill:var(--clr-gold-light)}',
    '.mp-bv-trend__dot.is-latest{fill:var(--clr-red-light)}',
    '.mp-bv-trend__dot.is-shadow{fill:var(--clr-bg);stroke:var(--clr-text-3);stroke-width:1.6;opacity:.7}',
    '.mp-bv-tw{overflow-x:auto;border:1px solid var(--clr-border);border-radius:8px;scrollbar-width:none}',
    '.mp-bv-tw::-webkit-scrollbar{display:none}',
    'table.mp-bv-tbl{width:100%;border-collapse:collapse;font-size:13px;min-width:460px}',
    '.mp-bv-tbl th{font-size:11px;font-weight:700;letter-spacing:.05em;text-transform:uppercase;color:var(--clr-text-2);text-align:left;padding:10px 12px;background:var(--clr-surface);border-bottom:1px solid var(--clr-border-2);white-space:nowrap}',
    '.mp-bv-tbl th.ta-c{text-align:center}',
    '.mp-bv-tbl th.sortable{cursor:pointer;user-select:none;transition:color .15s}',
    '.mp-bv-tbl th.sortable:hover{color:var(--clr-text)}',
    '.mp-bv-tri{display:inline-block;width:7px;height:10px;margin-left:5px;vertical-align:middle}',
    '.mp-bv-tri path{fill:currentColor;opacity:.28}',
    '.mp-bv-tbl th.ta-c.sortable::before{content:"";display:inline-block;width:12px}',
    '.mp-bv-tbl th.is-asc{color:var(--clr-text)}',
    '.mp-bv-tbl th.is-desc{color:var(--clr-text)}',
    '.mp-bv-tbl th.is-asc .mp-bv-tri .up{opacity:1}',
    '.mp-bv-tbl th.is-desc .mp-bv-tri .dn{opacity:1}',
    '.mp-bv-tbl td{padding:9px 12px;border-bottom:1px solid var(--clr-border);vertical-align:middle;white-space:nowrap}',
    '.mp-bv-tbl th:nth-child(-n+3),.mp-bv-tbl td:nth-child(-n+3){padding-left:6px;padding-right:6px}',
    '.mp-bv-tbl th:first-child,.mp-bv-tbl td:first-child{padding-left:4px}',
    '.mp-bv-tbl th:nth-child(-n+3),.mp-bv-tbl td:nth-child(-n+3),.mp-bv-tbl th:nth-child(n+6),.mp-bv-tbl td:nth-child(n+6){width:1px}',
    '.mp-bv-tbl td:nth-child(2){text-align:center}',
    '.mp-bv-tbl td:nth-child(3),.mp-bv-tbl td:nth-child(7){color:var(--clr-text-3)}',
    '.mp-bv-tbl th:nth-child(3),.mp-bv-tbl td:nth-child(3){padding-left:11px}',
    '.mp-bv-tbl th:nth-child(4),.mp-bv-tbl td:nth-child(4){padding-left:14px;width:400px}',
    '.mp-bv-tbl th:nth-child(5),.mp-bv-tbl td:nth-child(5){padding-left:8px}',
    '.mp-bv-legend{font-size:11px;color:var(--clr-text-3);line-height:1.8;margin-top:14px}',
    '.mp-bv-legend code{font-family:var(--font-mono);color:var(--clr-text-2);background:var(--clr-surface);padding:0 5px;border-radius:3px;margin:0 1px}',
    '.mp-bv-tbl tr:last-child td{border-bottom:none}',
    '.mp-bv-tbl .rk{font-family:var(--font-body);font-size:15px;font-weight:600;line-height:1;color:var(--clr-text-3);text-align:center;width:42px}',
    '.mp-bv-tbl .num2{font-family:var(--font-body);text-align:center;color:var(--clr-text)}',
    '.mp-bv-tbl .song{color:var(--clr-text-2);white-space:normal}',
    '.mp-bv-tbl .artist{color:var(--clr-text);white-space:nowrap}',
    '.mp-bv-ed{color:var(--clr-board-light);text-decoration:none}',
    '.mp-bv-ed:hover{color:var(--clr-violet-light)}',
    '.mp-bv-row--1 .rk{color:var(--clr-gold-light)}',
    '.mp-bv-row--2 .rk{color:var(--clr-silver)}',
    '.mp-bv-row--3 .rk{color:var(--clr-bronze)}',
    '.mp-bv-tbl .mp-bv-row--shadow td{color:var(--clr-text-3);background:rgba(255,255,255,.02)}',
    '.mp-bv-row--shadow .mp-bv-ed{color:var(--clr-text-3)}',
    '.mp-bv-row--shadow .rk{font-weight:400;font-size:13px}',
    '.mp-bv-row--shadow .rk .rk-sh{display:inline-block;transform:translateX(2px)}',
    '.mp-bv-sh{font-size:9px;border:1px solid var(--clr-border-2);border-radius:2px;padding:0 4px;font-style:normal;color:var(--clr-text-3);margin-left:5px}',
    '@media (max-width:600px){',
    '  .mp-card{grid-template-columns:auto 1fr;gap:24px;grid-template-rows:auto auto}',
    '  .mp-links{grid-column:1/-1;flex-direction:row}',
    '  .mp-link{flex:1}',
    '  .mp-avatar{width:96px;height:96px}',
    '  .mp-avatar__placeholder{font-size:38px !important}',
    '  .mp-nickname{font-size:36px}',
    '  .mp-bv-badge{width:21.25px;height:20.4px;margin-left:5px}',
    '  .mp-bv-stats{gap:8px;grid-template-columns:repeat(auto-fit,minmax(72px,1fr))}',
    '  .mp-bv-stat{padding:12px 6px 8px}',
    '  .mp-bv-stat__v{font-size:21px;min-height:21px}',
    '  .mp-bv-stat__v--cjk{font-size:16px}',
    '  .mp-bv-stat__k{font-size:10px;margin-top:5px}',
    '  table.mp-bv-tbl{min-width:588px}',
    '  .mp-bv-tbl th:nth-child(4),.mp-bv-tbl td:nth-child(4),.mp-bv-tbl th:nth-child(5),.mp-bv-tbl td:nth-child(5){width:150px}',
    '  .mp-bv-tbl td:nth-child(4){white-space:normal}',
    '  .mp-bv-legend__ex{display:none}',
    '}'
  ].join('\n');

  var styleEl = document.createElement('style');
  styleEl.textContent = css;
  document.head.appendChild(styleEl);

  /* ── Icons ── */
  var BILI_SVG = '<svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" style="display:block;flex-shrink:0" aria-hidden="true"><path d="M17.813 4.653h.854c1.51.054 2.769.578 3.773 1.574 1.004.995 1.524 2.249 1.56 3.76v7.36c-.036 1.51-.556 2.769-1.56 3.773s-2.262 1.524-3.773 1.56H5.333c-1.51-.036-2.769-.556-3.773-1.56S.036 18.858 0 17.347v-7.36c.036-1.511.556-2.765 1.56-3.76 1.004-.996 2.262-1.52 3.773-1.574h.774l-1.174-1.12a1.234 1.234 0 0 1-.373-.906c0-.356.124-.658.373-.907l.027-.027c.267-.249.573-.373.92-.373.347 0 .653.124.92.373L9.653 4.44c.071.071.134.142.187.213h4.267a.836.836 0 0 1 .16-.213l2.853-2.747c.267-.249.573-.373.92-.373.347 0 .662.151.929.4.267.249.391.551.391.907 0 .355-.124.657-.373.906zM5.333 7.24c-.746.018-1.373.276-1.88.773-.506.498-.769 1.13-.786 1.894v7.52c.017.764.28 1.395.786 1.893.507.498 1.134.756 1.88.773h13.334c.746-.017 1.373-.275 1.88-.773.506-.498.769-1.129.786-1.893v-7.52c-.017-.765-.28-1.396-.786-1.894-.507-.497-1.134-.755-1.88-.773zM8 11.107c.373 0 .684.124.933.373.25.249.383.569.4.96v1.173c-.017.391-.15.711-.4.96-.249.25-.56.374-.933.374s-.684-.125-.933-.374c-.25-.249-.383-.569-.4-.96V12.44c0-.373.129-.689.386-.947.258-.257.574-.386.947-.386zm8 0c.373 0 .684.124.933.373.25.249.383.569.4.96v1.173c-.017.391-.15.711-.4.96-.249.25-.56.374-.933.374s-.684-.125-.933-.374c-.25-.249-.383-.569-.4-.96V12.44c.017-.391.15-.711.4-.96.249-.249.56-.373.933-.373z"/></svg>';

  var MT_SVG = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="display:block;flex-shrink:0" aria-hidden="true"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>';

  /* 空心五边形 logo path（与 member.html 按钮 / 卡片徽章同形，用于届数徽章） */
  var LOGO_HOLLOW_PATH = 'M387.903 15.0204C392.208 12.8947 396.69 11.9405 400.817 14.3965C542.26 98.5777 620.627 159.145 757.684 286.872C761.672 290.589 759.482 299.875 758.121 305.154C714.812 473.06 687.145 567.802 618.062 716.07C614.305 724.133 609.258 730.2 600.368 730.494C425.028 736.292 334.86 733.788 159.125 720.458C152.268 719.938 148.169 715.598 145.55 709.239C95.0684 586.7 53.9544 473.223 16.2905 287.844C15.0382 281.679 14.3152 274.906 19.0353 270.748C121.283 180.687 230.374 92.803 387.903 15.0204ZM424.598 105.424C416.477 105.566 360.587 161.078 315.693 181.587C271.949 201.571 247.272 205.77 205.087 226.451C168.273 244.498 114.733 272.121 114.296 276.77C113.86 281.419 148.411 370.162 151.625 421.162C154.63 468.86 156.579 507.647 160.795 547.479C164.963 586.858 170.699 622.729 176.09 626.116C179.611 628.328 219.957 623.412 248.01 624.86C297.951 627.438 334.568 630.879 380.655 645.752C402.827 652.907 438.892 658.335 469.199 666.253C491.864 672.175 530.178 679.797 533.218 677.899C538.956 674.316 546.585 609.472 563.815 569.453C582.773 525.418 595.4 504.773 623.471 463.981C646.101 431.096 677.494 367.89 680.709 352.749C681.946 346.925 598.662 305.446 544.106 237.938C489.551 170.43 430.401 105.325 424.598 105.424Z';

  /* ── Data ── */
  var d = window.MEMBER_DATA || {};
  var nickname  = d.nickname  || '';
  var handle    = d.handle    || '';
  var groups    = d.groups    || [];
  var biliId    = d.bilibili_id || '';
  var chartId   = d.chart_id  || '';

  if (!nickname) return;

  /* ── Title & meta ── */
  document.title = nickname + (handle ? ' · @' + handle : '') + ' | Barboard 成员';
  var metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc) metaDesc.setAttribute('content', 'Barboard 成员主页 — ' + nickname + (handle ? ' (@' + handle + ')' : ''));

  /* ── Avatar placeholder ── */
  var ph = nickname.charAt(0);
  var phIsCJK = ph.charCodeAt(0) > 127;
  var phStyle = phIsCJK
    ? 'font-family:var(--font-body);font-size:42px;font-weight:700'
    : 'font-family:var(--font-display);font-size:48px';

  /* ── Group badges ── */
  var GROUP_LABEL = { bbl: 'BarboardLab', cun: '村摇欧共体', indie: 'Indienation' };
  var GROUP_CLS   = { bbl: 'mp-tag--violet', cun: 'mp-tag--cun', indie: 'mp-tag--indie' };
  var badges = groups.map(function (g) {
    return '<span class="mp-tag ' + (GROUP_CLS[g] || '') + '">' + (GROUP_LABEL[g] || g) + '</span>';
  }).join('');

  /* ── External links ── */
  var links = '';
  if (biliId)  links += '<a class="mp-link" href="https://space.bilibili.com/' + biliId + '" target="_blank" rel="noopener">' + BILI_SVG + 'Bilibili</a>';
  if (chartId) links += '<a class="mp-link" href="https://musictrack.cn/chart/' + chartId + '/" target="_blank" rel="noopener">' + MT_SVG + 'Musictrack</a>';

  /* ── 吧视 板块 ── */
  function esc(s) {
    return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
  /* 各年/赛季 logo 描边色（2019 创始＝榜吧蓝；其余暂定，待确认） */
  var BV_YEAR_COLOR = {
    2019: 'var(--clr-board)',
    2020: 'var(--clr-violet-light)',
    2023: 'var(--clr-pink-light)',
    2024: 'var(--clr-gold-light)',
    2025: 'var(--clr-team-cun)',
    2026: 'var(--clr-accent)'
  };
  function bvBadges(bv) {
    var seen = {}, list = [];
    (bv.entries || []).forEach(function (e) {
      if (e.edition_no != null && !seen[e.edition_no]) { seen[e.edition_no] = 1; list.push({ no: e.edition_no, year: e.year }); }
    });
    if (!list.length) return '';
    list.sort(function (a, b) { return a.no - b.no; });
    return list.map(function (ed) {
      var first = ed.no === 1;  // 创始届：金色 + 光晕
      var logoColor = first ? 'var(--clr-gold)' : (BV_YEAR_COLOR[ed.year] || 'var(--clr-board)');
      var numColor = 'var(--clr-text)';  // 徽章数字全站统一为 --clr-text
      var two = ed.no >= 10;
      var fs = two ? 300 : 360;
      var x = 382;
      var y = two ? 497 : 518;
      return '<span class="mp-bv-badge' + (first ? ' mp-bv-badge--first' : '') + '" title="第' + ed.no + '届 Barvision' + (first ? ' · 创始届' : '') + '" style="color:' + logoColor + '">' +
        '<svg class="mp-bv-badge__mark" viewBox="0 0 770 746" aria-hidden="true">' +
          '<path d="' + LOGO_HOLLOW_PATH + '"/>' +
          '<text class="mp-bv-badge__num" x="' + x + '" y="' + y + '" text-anchor="middle" style="fill:' + numColor + ';font-size:' + fs + 'px">' + ed.no + '</text>' +
        '</svg>' +
      '</span>';
    }).join('');
  }
  function renderBvRows(list) {
    return list.map(function (e) {
      var cls = e.is_shadow ? 'mp-bv-row--shadow' : (e.rank && e.rank <= 3 ? 'mp-bv-row--' + e.rank : '');
      var nn = e.edition_no < 10 ? '0' + e.edition_no : e.edition_no;
      var href = '../barvision/' + e.year + '/' + e.version + '-' + nn + '.html';
      var seriesLabel = /^[0-9]+$/.test(String(e.series)) ? '-' : esc(e.series);
      return '<tr class="' + cls + '">' +
        '<td class="rk">' + (e.rank == null ? '—' : (e.is_shadow ? '<span class="rk-sh">' + e.rank + '*</span>' : e.rank)) + '</td>' +
        '<td class="ed"><a class="mp-bv-ed" href="' + href + '">第 ' + e.edition_no + ' 届</a></td>' +
        '<td class="num2">' + seriesLabel + '</td>' +
        '<td class="artist">' + esc(e.artist) + '</td>' +
        '<td class="song">' + esc(e.song) + (e.is_shadow ? '<span class="mp-bv-sh">混淆</span>' : '') + '</td>' +
        '<td class="num2">' + (e.total == null ? '—' : Math.round(e.total)) + '</td>' +
        '<td class="num2">' + (e.twelve ? e.twelve : '—') + '</td>' +
        '</tr>';
    }).join('');
  }
  var BV_SERIES_ORDER = { A: 1, B: 2, C: 3, SF: 4, GF: 5, E: 6 };
  function bvSeriesRank(s) { var k = String(s).toUpperCase(); return BV_SERIES_ORDER[k] != null ? BV_SERIES_ORDER[k] : (parseInt(s, 10) || 99); }
  function sortBvEntries(list, key, dir) {
    var arr = list.slice();
    var sign = dir === 'desc' ? -1 : 1;
    arr.sort(function (a, b) {
      if (key === 'rank') {
        var as = a.is_shadow || a.rank == null, bs = b.is_shadow || b.rank == null;
        if (as !== bs) return as ? 1 : -1;
        return sign * ((a.rank || 0) - (b.rank || 0));
      }
      if (key === 'edition') return sign * (a.edition_no - b.edition_no) || (bvSeriesRank(a.series) - bvSeriesRank(b.series));
      if (key === 'total') {
        var at = a.total == null ? -Infinity : a.total, bt = b.total == null ? -Infinity : b.total;
        return sign * (at - bt);
      }
      if (key === 'twelve') return sign * ((a.twelve || 0) - (b.twelve || 0));
      return 0;
    });
    return arr;
  }
  function bvXLabel(e) {
    return /^[0-9]+$/.test(String(e.series)) ? String(e.edition_no) : (e.edition_no + String(e.series));
  }
  function bvTrend(bv) {
    var has = (bv.entries || []).some(function (e) { return e.rank != null; });
    if (!has) return '';
    return '<div class="mp-bv-trend fade-up" style="transition-delay:.32s">' +
      '<div class="mp-bv-trend__title">历届排名走势</div>' +
      '<svg class="mp-bv-trend__svg" role="img" aria-label="历届排名走势"></svg>' +
    '</div>';
  }
  function drawBvTrend() {
    var svg = document.querySelector('.mp-bv-trend__svg');
    if (!svg || !d.barvision) return;
    var list = sortBvEntries(d.barvision.entries || [], 'edition', 'asc').filter(function (e) { return e.rank != null; });
    if (!list.length) return;
    var n = list.length;
    var maxRank = Math.max.apply(null, list.map(function (e) { return e.rank; }));
    var yMax = maxRank + 1;
    var W = Math.round(svg.clientWidth || svg.getBoundingClientRect().width) || 600;
    var H = 180, padL = 36, padR = 20, padT = 28, padB = 38;
    var plotW = W - padL - padR, plotH = H - padT - padB;
    function xAt(i) { var ins = plotW * 0.08, lo = padL + ins, hi = W - padR - ins; return n === 1 ? padL + plotW / 2 : lo + (hi - lo) * i / (n - 1); }
    function yAt(r) { return padT + plotH * (r - 1) / (yMax - 1); }
    var out = '';
    var yvals = [1]; if (yMax >= 4) yvals.push(Math.round(yMax / 2)); yvals.push(yMax);
    yvals = yvals.filter(function (v, i, a) { return a.indexOf(v) === i; });
    yvals.forEach(function (r) {
      out += '<line x1="' + padL + '" y1="' + yAt(r).toFixed(1) + '" x2="' + (W - padR) + '" y2="' + yAt(r).toFixed(1) + '" class="mp-bv-trend__grid"/>';
      out += '<text x="' + (padL - 9) + '" y="' + (yAt(r) + 5).toFixed(1) + '" text-anchor="end" class="mp-bv-trend__ylab">' + r + '</text>';
    });
    for (var i = 0; i < n - 1; i++) {
      var a = list[i], b = list[i + 1], dim = a.is_shadow || b.is_shadow;
      out += '<line x1="' + xAt(i).toFixed(1) + '" y1="' + yAt(a.rank).toFixed(1) + '" x2="' + xAt(i + 1).toFixed(1) + '" y2="' + yAt(b.rank).toFixed(1) + '" class="mp-bv-trend__edge' + (dim ? ' is-dim' : '') + '"/>';
    }
    list.forEach(function (e, i) {
      var cx = xAt(i).toFixed(1), cy = yAt(e.rank);
      var tip = esc((e.artist || '') + ' — ' + (e.song || ''));
      out += '<text x="' + cx + '" y="' + (cy - 11).toFixed(1) + '" text-anchor="middle" class="mp-bv-trend__rank">#' + e.rank + '</text>';
      var dotCls = e.is_shadow ? ' is-shadow' : (e.rank === 1 ? ' is-champ' : (e.edition_no === 16 ? ' is-latest' : ''));
      out += '<circle cx="' + cx + '" cy="' + cy.toFixed(1) + '" r="4" class="mp-bv-trend__dot' + dotCls + '"/>';
      out += '<circle cx="' + cx + '" cy="' + cy.toFixed(1) + '" r="12" fill="transparent" data-tooltip="' + tip + '"/>';
      out += '<text x="' + cx + '" y="' + (H - padB + 15) + '" text-anchor="middle" class="mp-bv-trend__xlab">' + esc(bvXLabel(e)) + '</text>';
    });
    svg.setAttribute('viewBox', '0 0 ' + W + ' ' + H);
    svg.innerHTML = out;
  }
  function bvSection(bv) {
    var ov = bv.overview;
    function shadow(n) { return n ? '<span class="sh">(' + n + ')</span>' : ''; }
    var bestN = ov.best;
    var bestRep = 0;
    if (bestN != null) (bv.entries || []).forEach(function (e) { if (!e.is_shadow && e.rank === bestN) bestRep++; });
    var bestColor = bestN === 1 ? 'var(--clr-gold-light)' : bestN === 2 ? 'var(--clr-silver)' : bestN === 3 ? 'var(--clr-bronze)' : '';
    var DIM = 'var(--clr-text-3)';
    var LATEST_ED = 16;
    function dim0(val, color) { return val === 0 ? DIM : (color || ''); }
    var stats = [
      { v: (bestN == null ? '—' : bestN), rep: (bestRep > 1 ? bestRep : 0), k: '最佳名次', color: bestColor },
      { v: ov.top1, sh: ov.top1_shadow, k: '冠军场数', color: dim0(ov.top1, ov.top1 > 0 ? 'var(--clr-gold-light)' : '') },
      { v: ov.top3, sh: ov.top3_shadow, k: '前三场数', color: dim0(ov.top3) },
      { v: ov.entries, sh: ov.shadow, k: '参与场数', color: dim0(ov.entries) },
      { v: ov.twelve, k: '12 分次数', color: dim0(ov.twelve) },
      { v: '第 ' + ov.debut + ' 届', k: '首次参赛' },
      { v: '第 ' + ov.active_in + ' 届', k: '最近参赛', color: (ov.active_in === LATEST_ED ? '' : DIM) }
    ];
    var statsHtml = stats.map(function (s) {
      var rep = s.rep ? '<span class="mp-bv-rep">(' + s.rep + ')</span>' : '';
      var vStyle = s.color ? ' style="color:' + s.color + '"' : '';
      var vCls = /[一-鿿]/.test(String(s.v)) ? ' mp-bv-stat__v--cjk' : '';
      return '<div class="mp-bv-stat' + (s.active ? ' mp-bv-stat--active' : '') + '">' +
        '<div class="mp-bv-stat__v' + vCls + '"' + vStyle + '>' + s.v + (s.sh ? shadow(s.sh) : '') + rep + '</div>' +
        '<div class="mp-bv-stat__k">' + s.k + '</div></div>';
    }).join('');
    var rows = renderBvRows(sortBvEntries(bv.entries, 'edition', 'asc'));
    var TRI = '<svg class="mp-bv-tri" viewBox="0 0 10 14" aria-hidden="true"><path class="up" d="M5 0L9 5H1Z"/><path class="dn" d="M5 14L1 9H9Z"/></svg>';
    var unclaimed = arguments[1];
    var label = 'Barvision';
    var title = unclaimed ? '匿名参赛歌曲' : '吧视参赛记录';
    var topBlock = unclaimed
      ? '<p class="mp-bv-note fade-up" style="transition-delay:.2s">以下参赛歌曲在比赛结束后始终无人认领选送者，统一归档于此。</p>'
      : '<div class="mp-bv-stats fade-up" style="transition-delay:.2s">' + statsHtml + '</div>';
    return '<section class="mp-section">' +
      '<div class="section__inner">' +
        '<div class="mp-section-label fade-up" style="transition-delay:.05s;font-family:var(--font-body);font-weight:700">' + label + '</div>' +
        '<div class="mp-section-title fade-up" style="transition-delay:.15s">' + title + '</div>' +
        topBlock +
        '<div class="mp-bv-tw fade-up" style="transition-delay:.25s"><table class="mp-bv-tbl"><thead><tr>' +
          '<th class="sortable ta-c" data-sort="rank">名次' + TRI + '</th><th class="sortable ta-c" data-sort="edition">届次' + TRI + '</th><th class="ta-c">场次</th><th>歌手</th><th>歌名</th><th class="sortable ta-c" data-sort="total">总分' + TRI + '</th><th class="sortable ta-c" data-sort="twelve">12分' + TRI + '</th>' +
        '</tr></thead><tbody>' + rows + '</tbody></table></div>' +
        '<p class="mp-bv-legend fade-up" style="transition-delay:.3s">注：<code>A</code> 小众 · <code>B</code> 中众 · <code>C</code> 大众 · <code>SF</code> 半决赛 · <code>GF</code> 决赛 · <code>E</code> 娱乐版<span class="mp-bv-legend__ex">（如 <code>7A</code> = 第 7 届小众组）</span></p>' +
        (unclaimed ? '' : bvTrend(bv)) +
      '</div>' +
    '</section>';
  }

  /* ── Render ── */
  var root = document.getElementById('mp-root');
  if (!root) return;

  // 未认领伪成员：大名弱化、无头像/标签/外链；否则正常 hero
  var heroHtml = d.unclaimed
    ? '<section class="mp-hero mp-hero--unclaimed">' +
        '<div class="mp-hero__inner section__inner">' +
          '<a class="mp-eyebrow fade-up" href="/member.html"><span>←</span><span>Members</span></a>' +
          '<div class="mp-card fade-up"><div class="mp-info">' +
            '<div class="mp-nickname mp-nickname--unclaimed">匿名</div>' +
            '<div class="mp-handle">参赛歌曲匿名选送者</div>' +
          '</div></div>' +
        '</div>' +
      '</section>'
    : '<section class="mp-hero">' +
        '<div class="mp-hero__glow" aria-hidden="true"></div>' +
        '<div class="mp-hero__inner section__inner">' +
          '<a class="mp-eyebrow fade-up" href="/member.html"><span>←</span><span>Members</span></a>' +
          '<div class="mp-card fade-up">' +
            '<div style="position:relative;display:inline-block;margin-top:8px">' +
              '<div class="mp-avatar__ring" style="position:absolute;inset:-3px;border-radius:50%;background:linear-gradient(135deg,var(--clr-violet),var(--clr-accent));opacity:.5;z-index:0"></div>' +
              '<div class="mp-avatar">' +
                '<div class="mp-avatar__placeholder" style="' + phStyle + '">' + ph + '</div>' +
              '</div>' +
            '</div>' +
            '<div class="mp-info">' +
              '<div class="mp-nickname">' + nickname + (d.barvision ? bvBadges(d.barvision) : '') + '</div>' +
              (handle ? '<div class="mp-handle">@' + handle + '</div>' : '') +
              (badges ? '<div class="mp-tags">' + badges + '</div>' : '') +
            '</div>' +
            (links ? '<div class="mp-links">' + links + '</div>' : '') +
          '</div>' +
        '</div>' +
      '</section>';

  root.innerHTML = heroHtml +
    (d.barvision ? bvSection(d.barvision, d.unclaimed) :
      '<section class="mp-section">' +
        '<div class="section__inner">' +
          '<div class="mp-section-label fade-up" style="transition-delay:.05s">Works</div>' +
          '<div class="mp-section-title fade-up" style="transition-delay:.15s">代表成绩</div>' +
          '<div class="mp-works-grid fade-up" style="transition-delay:.25s">' +
            '<div class="mp-todo">即将上线</div>' +
          '</div>' +
        '</div>' +
      '</section>');

  /* ── Fade-up animations ── */
  if ('IntersectionObserver' in window) {
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); }
      });
    }, { threshold: 0.08 });
    document.querySelectorAll('.fade-up').forEach(function (el) { obs.observe(el); });
  } else {
    document.querySelectorAll('.fade-up').forEach(function (el) { el.classList.add('visible'); });
  }

  /* ── 吧视参赛表：点表头排序 ── */
  if (d.barvision) {
    var bvTable = document.querySelector('.mp-bv-tbl');
    if (bvTable) {
      var bvBody = bvTable.querySelector('tbody');
      var bvData = d.barvision.entries || [];
      var bvDefDir = { rank: 'asc', edition: 'asc', total: 'desc', twelve: 'desc' };
      var bvCur = { key: 'edition', dir: 'asc' };
      var bvApply = function () {
        bvBody.innerHTML = renderBvRows(sortBvEntries(bvData, bvCur.key, bvCur.dir));
        bvTable.querySelectorAll('th.sortable').forEach(function (th) {
          th.classList.remove('is-asc', 'is-desc');
          if (th.dataset.sort === bvCur.key) th.classList.add(bvCur.dir === 'asc' ? 'is-asc' : 'is-desc');
        });
      };
      bvTable.querySelectorAll('th.sortable').forEach(function (th) {
        th.addEventListener('click', function () {
          var k = th.dataset.sort;
          if (bvCur.key === k) bvCur.dir = (bvCur.dir === 'asc' ? 'desc' : 'asc');
          else { bvCur.key = k; bvCur.dir = bvDefDir[k]; }
          bvApply();
        });
      });
      bvApply();
    }
    drawBvTrend();
    var _bvtt;
    window.addEventListener('resize', function () { clearTimeout(_bvtt); _bvtt = setTimeout(drawBvTrend, 150); });
  }
})();
