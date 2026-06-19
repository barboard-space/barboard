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
    '.mp-bv-trend__hd{display:flex;align-items:center;justify-content:space-between;gap:8px 16px;flex-wrap:wrap;margin-bottom:12px}',
    '.mp-bv-trend__title{font-size:13px;font-weight:600;color:var(--clr-text-2)}',
    '.mp-bv-trend__legend{display:flex;gap:14px;font-size:11px;color:var(--clr-text-3)}',
    '.mp-bv-lg{display:inline-flex;align-items:center;gap:5px}',
    '.mp-bv-lg__ic{width:15px;height:15px;flex-shrink:0;display:block}',
    '.mp-bv-lg__t{position:relative;top:1px}',
    '.mp-bv-trend__sc{overflow-x:auto;overflow-y:hidden;-webkit-overflow-scrolling:touch;scrollbar-width:thin}',
    '.mp-bv-trend__sc::-webkit-scrollbar{height:6px}',
    '.mp-bv-trend__sc::-webkit-scrollbar-thumb{background:var(--clr-border-2);border-radius:3px}',
    '.mp-bv-trend__svg{display:block;overflow:visible}',
    '.mp-bv-trend__rank{fill:var(--clr-text-2);font-family:var(--font-mono);font-size:12px}',
    '.mp-bv-trend__rank.is-weak{font-size:10.5px;fill:var(--clr-text-4)}',
    '.mp-bv-trend__grid{stroke:var(--clr-border);stroke-width:1}',
    '.mp-bv-trend__ylab,.mp-bv-trend__xlab{fill:var(--clr-text-3);font-family:var(--font-mono);font-size:12px}',
    '.mp-bv-trend__xlab.is-absent{fill:var(--clr-text-4)}',
    '.mp-bv-trend__absent{stroke:var(--clr-border);stroke-width:1;stroke-dasharray:6 5}',
    '.mp-bv-trend__edge{stroke:var(--clr-accent-glow);stroke-width:2;fill:none}',
    '.mp-bv-trend__edge.is-dashed{stroke:var(--clr-text-4);stroke-width:1.5;stroke-dasharray:5 4;opacity:.65}',
    '.mp-bv-trend__dot{fill:var(--clr-accent-light)}',
    '.mp-bv-trend__dot.is-champ{fill:var(--clr-gold-light)}',
    '.mp-bv-trend__dot.is-latest{fill:var(--clr-pink-light)}',
    '.mp-bv-trend__dot.is-dim{opacity:.65}',
    '.mp-bv-trend__shadow{fill:var(--clr-bg);stroke:var(--clr-text-4);stroke-width:1.6}',
    '.mp-bv-trend__shadow-ring{fill:none;stroke:var(--clr-text-4);stroke-width:1.6}',
    '.mp-bv-trend__hit{fill:transparent;cursor:pointer}',
    '.mp-bv-tip{position:fixed;z-index:200;pointer-events:none;background:var(--clr-surface-2);border:1px solid var(--clr-border-2);border-radius:6px;padding:7px 10px;font-size:12px;line-height:1.55;color:var(--clr-text);box-shadow:0 6px 20px rgba(0,0,0,.4);opacity:0;transition:opacity .15s;white-space:nowrap}',
    '.mp-bv-tip.is-on{opacity:1}',
    '.mp-bv-tip__row--sh{color:var(--clr-text-3)}',
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
    '.mp-bv-legend{font-size:11px;color:var(--clr-text-3);line-height:1.8;margin-top:8px}',
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
    '.mp-bv-tbl .mp-bv-row--shadow td{color:var(--clr-text-4);background:var(--clr-shadow-bg)}',
    '.mp-bv-row--shadow .mp-bv-ed{color:var(--clr-text-4)}',
    '.mp-bv-row--shadow .rk{font-weight:400;font-size:13px}',
    '.mp-bv-row--shadow .rk .rk-sh{display:inline-block;transform:translate(2px,-1px)}',
    '.mp-bv-sh{display:inline-block;white-space:nowrap;font-size:9px;border:1px solid var(--clr-border-2);border-radius:2px;padding:0 4px;font-style:normal;color:var(--clr-text-4);margin-left:5px}',
    '.mp-bv-joint{display:inline-block;white-space:nowrap;font-size:9px;border:1px solid var(--clr-border-2);border-radius:2px;padding:0 4px;font-style:normal;color:var(--clr-text-3);margin-left:5px}',
    '.mp-bv-persona{display:inline-block;white-space:nowrap;font-size:9px;border:1px solid var(--clr-violet);border-radius:2px;padding:0 4px;font-style:normal;color:var(--clr-violet-light);margin-left:5px}',
    '.mp-bv-canceled{display:inline-block;white-space:nowrap;font-size:9px;border:1px solid var(--clr-border-2);border-radius:2px;padding:0 4px;font-style:normal;color:var(--clr-text-4);margin-left:5px}',
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
      var cls = (e.is_shadow || e.canceled) ? 'mp-bv-row--shadow' : (e.rank && e.rank <= 3 ? 'mp-bv-row--' + e.rank : '');
      var nn = e.edition_no < 10 ? '0' + e.edition_no : e.edition_no;
      var href = '../barvision/' + e.year + '/' + e.version + '-' + nn + '.html';
      var seriesLabel = /^[0-9]+$/.test(String(e.series)) ? '-' : esc(e.series);
      return '<tr class="' + cls + '">' +
        '<td class="rk">' + (e.rank == null ? '—' : (e.is_shadow ? '<span class="rk-sh">' + e.rank + '*</span>' : e.rank)) + '</td>' +
        '<td class="ed"><a class="mp-bv-ed" href="' + href + '">第 ' + e.edition_no + ' 届</a></td>' +
        '<td class="num2">' + seriesLabel + '</td>' +
        '<td class="artist">' + esc(e.artist) + '</td>' +
        '<td class="song">' + esc(e.song) + (e.canceled ? '<span class="mp-bv-canceled">取消</span>' : '') + (e.is_shadow ? '<span class="mp-bv-sh">混淆</span>' : '') + (e.joint ? '<span class="mp-bv-joint">合报</span>' : '') + (e.persona && e.persona !== '匿名' ? '<span class="mp-bv-persona">' + esc(e.persona) + '</span>' : '') + '</td>' +
        '<td class="num2">' + (e.total == null ? '—' : Math.round(e.total)) + '</td>' +
        '<td class="num2">' + (e.canceled ? '—' : (e.twelve || 0)) + '</td>' +
        '</tr>';
    }).join('');
  }
  var BV_SERIES_ORDER = { A: 1, B: 2, C: 3, SF: 4, GF: 5, E: 6 };
  // 全局场次序列（X 轴轴序）：1=首届单场；2 起 SF/GF；3–11 分组 A/B(/C)；12 仅 A（12B 报名但比赛取消）；13–16 单场（16 即将举办）
  var BV_SLOTS = ['1', '2SF', '2GF', '3A', '3B', '4A', '4B', '5A', '5B', '5C', '6A', '6B', '6C', '7A', '7B', '7C', '8A', '8B', '9A', '9B', '10A', '10B', '11A', '11B', '12A', '13', '14', '15', '16'];
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
    return '<div class="mp-bv-trend fade-up" style="transition-delay:.42s">' +
      '<div class="mp-bv-trend__hd">' +
        '<span class="mp-bv-trend__title">历届排名走势</span>' +
        '<span class="mp-bv-trend__legend">' +
          '<span class="mp-bv-lg"><svg class="mp-bv-lg__ic" viewBox="0 0 15 15" aria-hidden="true"><circle cx="7.5" cy="7.5" r="4" fill="var(--clr-accent-light)"/></svg><span class="mp-bv-lg__t">正式单曲</span></span>' +
          '<span class="mp-bv-lg"><svg class="mp-bv-lg__ic" viewBox="0 0 15 15" aria-hidden="true"><circle cx="7.5" cy="7.5" r="3.2" fill="var(--clr-bg)" stroke="var(--clr-text-4)" stroke-width="1.6"/></svg><span class="mp-bv-lg__t">混淆单曲</span></span>' +
        '</span>' +
      '</div>' +
      '<div class="mp-bv-trend__sc"><svg class="mp-bv-trend__svg" role="img" aria-label="历届排名走势"></svg></div>' +
    '</div>';
  }
  function drawBvTrend() {
    var svg = document.querySelector('.mp-bv-trend__svg');
    if (!svg || !d.barvision) return;
    var entries = (d.barvision.entries || []).filter(function (e) { return e.rank != null; });
    if (!entries.length) return;

    // 按场次代码（届号+场次，如 5C / 13）分组——同一 X 可有多首
    var byCode = {};
    entries.forEach(function (e) { var c = bvXLabel(e); (byCode[c] = byCode[c] || []).push(e); });

    // 在全局场次序列中定位该成员参赛区间 [first, last]（含中间缺席场次）
    var part = [];
    BV_SLOTS.forEach(function (code, idx) { if (byCode[code]) part.push(idx); });
    if (!part.length) return;
    var firstIdx = part[0], lastIdx = part[part.length - 1];
    var slots = BV_SLOTS.slice(firstIdx, lastIdx + 1);
    var n = slots.length;
    var latestCode = BV_SLOTS[lastIdx];  // 该成员最近参赛场次（粉色高亮）

    var maxRank = Math.max.apply(null, entries.map(function (e) { return e.rank; }));
    var yMax = maxRank + 1;

    var padL = 42, padR = 24, padT = 36, padB = 48, H = 320, minSlotW = 56;
    // 占满容器全宽；场次多到每格 < minSlotW 时才扩宽 → 横向滚动
    var sc = svg.parentNode;
    var contW = (sc && sc.clientWidth) || 600;
    var W = Math.max(contW, padL + padR + (n > 1 ? (n - 1) * minSlotW : minSlotW));
    var plotH = H - padT - padB;
    function xAt(i) {
      if (n === 1) return W / 2;
      var inset = (W - padL - padR) * 0.06;  // 首尾点距边缘留 6%
      var lo = padL + inset, hi = W - padR - inset;
      return lo + (hi - lo) * i / (n - 1);
    }
    function yAt(r) { return padT + plotH * (r - 1) / (yMax - 1); }
    function dotCls(e, latest) { return e.rank === 1 ? 'is-champ' : (latest ? 'is-latest' : ''); }

    var out = '';
    // Y 网格 + 刻度
    var yvals = [1]; if (yMax >= 4) yvals.push(Math.round(yMax / 2)); yvals.push(yMax);
    yvals = yvals.filter(function (v, i, a) { return a.indexOf(v) === i; });
    yvals.forEach(function (r) {
      out += '<line x1="' + padL + '" y1="' + yAt(r).toFixed(1) + '" x2="' + (W - padR) + '" y2="' + yAt(r).toFixed(1) + '" class="mp-bv-trend__grid"/>';
      out += '<text x="' + (padL - 9) + '" y="' + (yAt(r) + 5).toFixed(1) + '" text-anchor="end" class="mp-bv-trend__ylab">' + r + '</text>';
    });

    // 每个 slot 的数据（正式按名次升序、混淆按名次升序；代表点用于连线）
    var sd = slots.map(function (code, i) {
      var es = byCode[code], o = { code: code, x: xAt(i), part: !!es, latest: code === latestCode };
      if (es) {
        o.official = es.filter(function (e) { return !e.is_shadow; }).sort(function (a, b) { return a.rank - b.rank; });
        o.shadow = es.filter(function (e) { return e.is_shadow; }).sort(function (a, b) { return a.rank - b.rank; });
        var rep = o.official.length ? o.official[0] : o.shadow[0];
        o.repRank = rep.rank; o.repSolid = o.official.length > 0;
      }
      return o;
    });

    // 缺席场次：竖直细虚线
    sd.forEach(function (s) {
      if (!s.part) out += '<line x1="' + s.x.toFixed(1) + '" y1="' + padT + '" x2="' + s.x.toFixed(1) + '" y2="' + (H - padB) + '" class="mp-bv-trend__absent"/>';
    });

    // 连线：仅相邻两 slot 均参赛（连续参赛）才连；端点任一为空心(纯混淆)→虚线
    for (var i = 0; i < n - 1; i++) {
      var s1 = sd[i], s2 = sd[i + 1];
      if (s1.part && s2.part) {
        var dashed = !s1.repSolid || !s2.repSolid;
        out += '<line x1="' + s1.x.toFixed(1) + '" y1="' + yAt(s1.repRank).toFixed(1) + '" x2="' + s2.x.toFixed(1) + '" y2="' + yAt(s2.repRank).toFixed(1) + '" class="mp-bv-trend__edge' + (dashed ? ' is-dashed' : '') + '"/>';
      }
    }

    // X 轴标签（缺席弱化）
    sd.forEach(function (s) {
      out += '<text x="' + s.x.toFixed(1) + '" y="' + (H - padB + 16) + '" text-anchor="middle" class="mp-bv-trend__xlab' + (s.part ? '' : ' is-absent') + '">' + esc(s.code) + '</text>';
    });

    // 点 + 名次 + hit 区
    function tipText(e) { return esc((e.artist || '') + ' — ' + (e.song || '')); }
    function rankLabel(cx, cy, r, weak) { return '<text x="' + cx + '" y="' + (cy - 11).toFixed(1) + '" text-anchor="middle" class="mp-bv-trend__rank' + (weak ? ' is-weak' : '') + '">#' + r + '</text>'; }
    function hit(cx, cy, tip) { return '<circle cx="' + cx + '" cy="' + cy.toFixed(1) + '" r="13" class="mp-bv-trend__hit" data-tip="' + tip + '"/>'; }

    sd.forEach(function (s) {
      if (!s.part) return;
      var cx = s.x.toFixed(1);
      var marks = [];  // 收集本场次各点 {rank,cy,weak}：弱化＝混淆曲 / 较差的正式曲
      // 特例：同一选送者「1 正式 + 1 混淆」名次相同（同 X 同 Y，如 5C 雨妈双第一）→ 实心(正式)不变 + 外套混淆圆环
      var coincide = s.official.length === 1 && s.shadow.length === 1 && s.official[0].rank === s.shadow[0].rank;
      if (coincide) {
        var e = s.official[0], sh = s.shadow[0], cy = yAt(e.rank);
        out += '<circle cx="' + cx + '" cy="' + cy.toFixed(1) + '" r="6.5" class="mp-bv-trend__shadow-ring"/>';  // 外环 = 混淆单曲
        out += '<circle cx="' + cx + '" cy="' + cy.toFixed(1) + '" r="4" class="mp-bv-trend__dot ' + dotCls(e, s.latest) + '"/>';  // 实心 = 正式单曲
        out += hit(cx, cy, tipText(e) + '\n' + tipText(sh));
        marks.push({ rank: e.rank, cy: cy, weak: false });
      } else {
        // 正式曲：实心 4px；多首中较差的点弱化（opacity .65）
        s.official.forEach(function (e, oi) {
          var cy = yAt(e.rank);
          out += '<circle cx="' + cx + '" cy="' + cy.toFixed(1) + '" r="4" class="mp-bv-trend__dot ' + dotCls(e, s.latest) + (oi > 0 ? ' is-dim' : '') + '"/>';
          out += hit(cx, cy, tipText(e));
          marks.push({ rank: e.rank, cy: cy, weak: oi > 0 });
        });
        // 混淆曲：空心 3px（fill 背景色遮线）
        s.shadow.forEach(function (e) {
          var cy = yAt(e.rank);
          out += '<circle cx="' + cx + '" cy="' + cy.toFixed(1) + '" r="3" class="mp-bv-trend__shadow"/>';
          out += hit(cx, cy, tipText(e));
          marks.push({ rank: e.rank, cy: cy, weak: true });
        });
      }
      // #N：同名次只画一个（该名次有任一非弱化点则正常，否则缩小+text-4 弱化）
      var byRank = {};
      marks.forEach(function (m) {
        if (!byRank[m.rank]) byRank[m.rank] = { cy: m.cy, weak: m.weak };
        else byRank[m.rank].weak = byRank[m.rank].weak && m.weak;
      });
      Object.keys(byRank).forEach(function (rk) { out += rankLabel(cx, byRank[rk].cy, rk, byRank[rk].weak); });
    });

    svg.setAttribute('width', W);
    svg.setAttribute('height', H);
    svg.setAttribute('viewBox', '0 0 ' + W + ' ' + H);
    svg.innerHTML = out;
    initBvTip();
  }

  // 走势图 tooltip：桌面 hover、手机点击；元素与事件仅初始化一次（SVG 重绘不重复绑定）
  function initBvTip() {
    var svg = document.querySelector('.mp-bv-trend__svg');
    if (!svg) return;
    var tip = document.querySelector('.mp-bv-tip');
    if (!tip) { tip = document.createElement('div'); tip.className = 'mp-bv-tip'; document.body.appendChild(tip); }
    if (svg.dataset.tipBound) return;
    svg.dataset.tipBound = '1';
    var touch = window.matchMedia('(hover:none),(pointer:coarse)').matches;
    function fill(el) {
      var t = el.getAttribute('data-tip') || '';
      if (t.indexOf('\n') < 0) { tip.textContent = t; return; }
      tip.innerHTML = '';
      t.split('\n').forEach(function (r) { var div = document.createElement('div'); div.textContent = r; tip.appendChild(div); });
    }
    function place(x, y) {
      var w = tip.offsetWidth, h = tip.offsetHeight;
      var L = x + 22; if (L + w > window.innerWidth - 8) L = x - w - 22;  // 右侧放不下→翻到左侧
      if (L < 8) L = 8;
      var T = Math.min(Math.max(8, y - h / 2 + 12), window.innerHeight - h - 8);  // 居中基础上略向下偏移
      tip.style.left = L + 'px'; tip.style.top = T + 'px';
    }
    function show(el, x, y) { fill(el); tip.classList.add('is-on'); place(x, y); }
    function hide() { tip.classList.remove('is-on'); }
    if (touch) {
      document.addEventListener('click', function (ev) {
        var h = ev.target.closest && ev.target.closest('.mp-bv-trend__hit');
        if (h) { var b = h.getBoundingClientRect(); show(h, b.left + b.width / 2, b.top + b.height / 2); ev.stopPropagation(); }
        else hide();
      });
    } else {
      // 跟随鼠标（正右、垂直居中于光标）
      svg.addEventListener('mouseover', function (ev) {
        var h = ev.target.closest && ev.target.closest('.mp-bv-trend__hit');
        if (h) show(h, ev.clientX, ev.clientY);
      });
      svg.addEventListener('mousemove', function (ev) { if (tip.classList.contains('is-on')) place(ev.clientX, ev.clientY); });
      svg.addEventListener('mouseout', function (ev) {
        var h = ev.target.closest && ev.target.closest('.mp-bv-trend__hit');
        if (h) hide();
      });
    }
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
        '<p class="mp-bv-legend fade-up" style="transition-delay:.28s">注：<code>A</code> 小众 · <code>B</code> 中众 · <code>C</code> 大众 · <code>SF</code> 半决赛 · <code>GF</code> 决赛 · <code>E</code> 娱乐版<span class="mp-bv-legend__ex">（如 <code>7A</code> = 第 7 届小众组）</span></p>' +
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
