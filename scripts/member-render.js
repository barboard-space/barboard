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
    '.mp-nickname{font-family:var(--font-display);font-size:48px;line-height:1;color:var(--clr-text);letter-spacing:.04em;margin-bottom:18px;display:flex;align-items:flex-start;flex-wrap:wrap;row-gap:6px}',
    '.mp-nickname__name{white-space:nowrap}',
    '.mp-bv-badges{display:inline-flex;flex-wrap:wrap;align-items:flex-start;row-gap:4px;order:1}',
    /* 桌面：@名 在大名下方自成一行（badges 与大名同行在上） */
    '.mp-nickname .mp-handle{order:2;flex-basis:100%;margin-bottom:0}',
    '.mp-bv-badge{display:inline-block;flex-shrink:0;width:30px;height:29px;margin-left:7px}',
    '.mp-bv-badge__mark{display:block;width:100%;height:100%}',
    '.mp-bv-badge__mark path{fill:currentColor}',
    '.mp-bv-badge__num{font-family:var(--font-display)}',
    /* 创始届（第一届）金色光晕 + 缓慢呼吸，凸显其特别 */
    '.mp-bv-badge--first{filter:drop-shadow(0 0 3px rgba(212,168,50,.5)) drop-shadow(0 0 8px rgba(212,168,50,.28));animation:mpBvFirstGlow 3.2s ease-in-out infinite}',
    '@keyframes mpBvFirstGlow{0%,100%{filter:drop-shadow(0 0 3px rgba(212,168,50,.42)) drop-shadow(0 0 7px rgba(212,168,50,.2))}50%{filter:drop-shadow(0 0 5px rgba(212,168,50,.72)) drop-shadow(0 0 13px rgba(212,168,50,.42))}}',
    '@media (prefers-reduced-motion:reduce){.mp-bv-badge--first{animation:none}}',
    '.mp-handle{font-family:var(--font-body);font-size:15px;color:var(--clr-text-2);margin-bottom:20px;letter-spacing:.02em}',
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
    /* 吧视标题行：标题左 + 导出按钮右 */
    '.mp-bv-titlebar{display:flex;align-items:center;justify-content:space-between;gap:10px 16px;flex-wrap:wrap;margin-bottom:28px}',
    '.mp-bv-titlebar .mp-section-title{margin-bottom:0}',
    '.mp-bv-exports{display:flex;align-items:center;gap:8px;flex-wrap:wrap}',
    '.mp-works-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:16px}',
    '.mp-work-card{background:var(--clr-surface);border:1px solid var(--clr-border);border-radius:8px;padding:20px;text-decoration:none;display:block;transition:border-color .2s,background .2s}',
    '.mp-work-card:hover{border-color:var(--clr-border-2);background:var(--clr-surface-2)}',
    '.mp-work-card__type{font-size:10px;font-family:var(--font-mono);letter-spacing:.2em;text-transform:uppercase;color:var(--clr-text-3);margin-bottom:8px}',
    '.mp-work-card__title{font-size:15px;font-weight:600;color:var(--clr-text);margin-bottom:4px}',
    '.mp-work-card__desc{font-size:12px;color:var(--clr-text-2);line-height:1.5}',
    '.mp-todo{font-size:13px;color:var(--clr-text-3);padding:32px;border:1px dashed var(--clr-border);border-radius:8px;text-align:center}',
    /* 吧视 板块 */
    '.mp-bv-stats{display:grid;grid-template-columns:repeat(8,1fr);gap:10px;margin-bottom:26px}',
    '.mp-bv-stat{background:var(--clr-surface);border:1px solid var(--clr-border);border-radius:8px;padding:15px 10px 11px;text-align:center;display:flex;flex-direction:column;align-items:center;justify-content:center}',
    '.mp-bv-stat__v{font-family:var(--font-display);font-size:26px;line-height:1;color:var(--clr-text);min-height:26px;display:flex;align-items:center;justify-content:center}',
    '.mp-bv-stat__v--cjk{font-family:var(--font-body);font-size:20px;font-weight:600;letter-spacing:.02em}',
    '.mp-bv-stat__v .sh{font-family:var(--font-body);font-size:13px;color:var(--clr-text-3);margin-left:3px}',
    '.mp-bv-stat__v .mp-bv-rep{font-family:var(--font-body);font-weight:400;font-size:14px;color:var(--clr-text-3);margin-left:3px}',
    '.mp-bv-stat__k{font-size:11px;color:var(--clr-text-2);margin-top:7px}',
    '.mp-bv-stat--active .mp-bv-stat__v{color:var(--clr-violet-light)}',
    '.mp-bv-trend{margin-top:52px}',
    '.mp-bv-trend__hd{display:flex;align-items:center;justify-content:space-between;gap:8px 16px;flex-wrap:wrap;margin-bottom:12px}',
    '.mp-bv-trend__title{font-size:13px;font-weight:600;color:var(--clr-text-2)}',
    '.mp-bv-trend__hd-r{display:flex;align-items:center;gap:8px 16px;flex-wrap:wrap}',
    /* 与 .mp-link（Bilibili/Musictrack 按钮）同款样式 */
    '.mp-bv-export{display:inline-flex;align-items:center;gap:6px;font-family:var(--font-body);font-size:12px;font-weight:500;color:var(--clr-text-2);background:var(--clr-surface);border:1px solid var(--clr-border);border-radius:6px;padding:3px 14px;cursor:pointer;transition:border-color .2s,color .2s,background .2s}',
    '.mp-bv-export:hover{border-color:var(--clr-border-2);color:var(--clr-text);background:var(--clr-surface-2)}',
    '.mp-bv-export[disabled]{opacity:.55;cursor:default}',
    '.mp-bv-export svg{display:block}',
    '@media (hover:none),(pointer:coarse){.mp-bv-export:hover{border-color:var(--clr-border);color:var(--clr-text-2);background:var(--clr-surface)}}',
    '.mp-bv-trend__legend{display:flex;gap:14px;font-size:11px;color:var(--clr-text-3)}',
    '.mp-bv-lg{display:inline-flex;align-items:center;gap:5px}',
    '.mp-bv-lg__ic{width:15px;height:15px;flex-shrink:0;display:block}',
    '.mp-bv-lg__t{position:relative;top:1px}',
    '.mp-bv-trend__sc{overflow-x:auto;overflow-y:hidden;-webkit-overflow-scrolling:touch;scrollbar-width:thin}',
    '.mp-bv-trend__sc::-webkit-scrollbar{height:6px}',
    '.mp-bv-trend__sc::-webkit-scrollbar-thumb{background:var(--clr-border-2);border-radius:3px}',
    '.mp-bv-trend__svg{display:block;overflow:visible}',
    '.mp-bv-trend__svg *{pointer-events:none}',  /* 仅 hit 圆可交互，标签/连线/网格不拦截点击 */
    '.mp-bv-trend__avg{stroke:var(--clr-violet-glow);stroke-width:1.5;stroke-dasharray:6 4}',
    '.mp-bv-trend__avglab{fill:var(--clr-violet-light);font-family:var(--font-body);font-size:11px;font-weight:600;opacity:.85}',
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
    '.mp-bv-trend__dot.is-soft{fill:var(--clr-accent-soft)}',  /* 年度制未进决赛的正式曲 */
    '.mp-bv-trend__dot.is-soft.is-latest{fill:var(--clr-pink-soft)}',
    '.mp-bv-trend__dot.is-dim{opacity:.65}',
    '.mp-bv-trend__shadow{fill:var(--clr-bg);stroke:var(--clr-text-4);stroke-width:1.6}',
    '.mp-bv-trend__shadow-ring{fill:none;stroke:var(--clr-text-4);stroke-width:1.6}',
    '.mp-bv-trend__hit{fill:transparent;cursor:pointer;pointer-events:all}',
    '.mp-bv-tip{position:fixed;z-index:200;pointer-events:none;background:var(--clr-surface-2);border:1px solid var(--clr-border-2);border-radius:6px;padding:7px 10px;font-size:12px;line-height:1.55;color:var(--clr-text);box-shadow:0 6px 20px rgba(0,0,0,.4);opacity:0;transition:opacity .15s;white-space:nowrap}',
    '.mp-bv-tip.is-on{opacity:1}',
    '.mp-bv-tip__row--sh{color:var(--clr-text-3)}',
    '.mp-bv-tw{overflow-x:auto;border:1px solid var(--clr-border);border-radius:8px;scrollbar-width:none;position:relative;z-index:1;background:var(--clr-bg)}',
    '.mp-bv-tw::-webkit-scrollbar{display:none}',
    'table.mp-bv-tbl{width:100%;border-collapse:collapse;font-size:13px;min-width:460px}',
    '.mp-bv-tbl th{font-size:11px;font-weight:700;letter-spacing:.05em;text-transform:uppercase;color:var(--clr-text-2);text-align:left;padding:10px 12px;background:var(--clr-surface);border-bottom:1px solid #353050;white-space:nowrap}',
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
    '.mp-bv-tbl th:nth-child(4),.mp-bv-tbl td:nth-child(4){padding-left:14px;width:373px}',
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
    /* 头像随视口自适应（让信息列宽度据此变化，徽章按其宽度算出每行 10 个） */
    '  .mp-avatar{width:clamp(64px,21vw,88px);height:clamp(64px,21vw,88px)}',
    '  .mp-avatar__placeholder{font-size:clamp(26px,8.5vw,36px) !important}',
    '  .mp-nickname{font-size:36px;align-items:baseline}',
    /* 手机：@名 移到大名右边（同行 baseline 对齐），徽章组整组换到大名下方一行 */
    '  .mp-nickname .mp-handle{order:1;flex-basis:auto;margin-left:10px}',
    '  .mp-nickname .mp-bv-badges{order:2;flex-basis:100%;width:100%;gap:4px}',
    /* 每行固定 10 个：徽章宽 =（组宽 − 9×4px 间距）/10，随屏宽缩放；第 11 个换行 */
    '  .mp-bv-badge{width:calc((100% - 36px) / 10);height:auto;aspect-ratio:770 / 746;margin-left:0}',
    '  .mp-bv-stats{gap:8px;grid-template-columns:repeat(4,1fr)}',
    '  .mp-bv-stat{padding:12px 6px 8px}',
    '  .mp-bv-stat__v{font-size:21px;min-height:21px}',
    '  .mp-bv-stat__v--cjk{font-size:16px}',
    '  .mp-bv-stat__k{font-size:10px;margin-top:5px}',
    '  table.mp-bv-tbl{min-width:588px}',
    '  .mp-bv-tbl th:nth-child(4),.mp-bv-tbl td:nth-child(4),.mp-bv-tbl th:nth-child(5),.mp-bv-tbl td:nth-child(5){width:150px}',
    '  .mp-bv-tbl td:nth-child(4){white-space:normal}',
    '  .mp-bv-legend__ex{display:none}',
    '}',
    /* ── 个人年榜 板块 ── */
    '.mp-an-caption{font-size:12px;color:var(--clr-text-3);line-height:1.7;margin-bottom:18px;max-width:640px}',
    '.mp-an-block{margin-top:8px}',
    '.mp-an-subtitle{font-size:13px;font-weight:600;color:var(--clr-text-2);margin:30px 0 12px}',
    '.mp-an-tw{overflow-x:auto;border:1px solid var(--clr-border);border-radius:8px;scrollbar-width:none;position:relative;z-index:1;background:var(--clr-bg)}',
    '.mp-an-tw::-webkit-scrollbar{display:none}',
    'table.mp-an-tbl{width:100%;border-collapse:collapse;font-size:13px}',
    '.mp-an-tbl th{font-size:11px;font-weight:700;letter-spacing:.05em;text-transform:uppercase;color:var(--clr-text-2);text-align:left;padding:10px 14px;background:var(--clr-surface);border-bottom:1px solid #353050;white-space:nowrap}',
    '.mp-an-tbl th.ta-c{text-align:center}',
    '.mp-an-tbl td{padding:9px 14px;border-bottom:1px solid var(--clr-border);white-space:nowrap;vertical-align:middle}',
    '.mp-an-tbl tr:last-child td{border-bottom:none}',
    '.mp-an-tbl .yr{font-family:var(--font-body);color:var(--clr-text);font-size:14px}',
    '.mp-an-tbl .num{font-family:var(--font-body);text-align:center;color:var(--clr-text)}',
    '.mp-an-tbl .num .mp-an-sh{font-size:12px;color:var(--clr-text-3);margin-left:2px}',  /* 亚洲不占位曲计数（括号）*/
    '.mp-an-tbl .rk{font-family:var(--font-body);font-size:15px;font-weight:600;color:var(--clr-text-3);text-align:center;width:48px}',
    '.mp-an-tbl .mp-an-row--1 .rk{color:var(--clr-gold-light)}',
    '.mp-an-tbl .mp-an-row--2 .rk{color:var(--clr-silver)}',
    '.mp-an-tbl .mp-an-row--3 .rk{color:var(--clr-bronze)}',
    /* 前三名金银铜行背景（半透明深色底，同 bbl 奖牌行思路） */
    '.mp-an-tbl .mp-an-row--1 td{background:rgba(212,168,50,.12)}',
    '.mp-an-tbl .mp-an-row--2 td{background:rgba(148,196,220,.11)}',
    '.mp-an-tbl .mp-an-row--3 td{background:rgba(224,160,100,.10)}',
    '.mp-an-tbl .an-name{color:var(--clr-text);white-space:normal}',  /* 歌名列（保持 table-cell，避免 td 设 flex 导致边框亚像素偏移）*/
    '.mp-an-tbl .an-name-in{display:flex;align-items:center;gap:18px}',  /* 内层 flex：封面 + 标题 */
    '.an-cover{width:36px;height:36px;border-radius:3px;object-fit:cover;flex-shrink:0;background:var(--clr-surface-2);display:block}',
    '.an-cover--ph{display:inline-block;position:relative;overflow:hidden}',  /* 封面缺失兜底：沿用背景色 + 榜吧 logo 水印（弱化色调，不抢视觉） */
    '.an-cover--ph::before{content:"";position:absolute;inset:20%;background:var(--clr-text-4);opacity:.5;-webkit-mask-image:url(/assets/images/logo_hollow.svg);mask-image:url(/assets/images/logo_hollow.svg);-webkit-mask-size:contain;mask-size:contain;-webkit-mask-repeat:no-repeat;mask-repeat:no-repeat;-webkit-mask-position:center;mask-position:center}',
    '.mp-an-tbl .an-title{min-width:0}',
    /* 前十表：固定列宽（避免展开后歌手列因内容变化而横向移动）+ 歌名表头缩进到标题位置（td14 + 封面36 + 间距18 = 68）*/
    '.mp-an-block .mp-an-tbl{table-layout:fixed;min-width:600px}',
    '.mp-an-block .mp-an-tbl th:nth-child(1),.mp-an-block .mp-an-tbl td:nth-child(1){width:64px}',  /* 名次；歌手列宽由 JS(alignAnCols) 设为 表宽/2+27 → 左缘对齐居中下拉按钮，歌名列取余 */
    '.mp-an-block .mp-an-tbl td{padding-top:7px;padding-bottom:7px}',  /* 前十行更紧凑（等效原封面 -2px，改用 padding 避免负边距的边框亚像素偏移）*/
    '.mp-an-block .mp-an-tbl .an-artist{white-space:normal}',
    '.mp-an-block .mp-an-tbl thead th:nth-child(2){padding-left:68px}',
    /* 手机端：前十表改 BBL 榜单式（名次 | 封面 | 歌名/歌手上下堆叠），不横滚、不显示右侧列 */
    '@media (max-width:768px){',
    '  .mp-an-block .mp-an-tw{overflow:hidden}',
    '  .mp-an-block .mp-an-tbl{display:block;min-width:0;width:100%;table-layout:auto}',
    '  .mp-an-block .mp-an-tbl thead{display:none}',
    '  .mp-an-block .mp-an-tbl tbody{display:block}',
    /* 注：不用 2 行 grid + rk/cover 跨行 spanning——42px 封面跨行会撑大行高（grid 轨道为容纳
       spanning 项的最小尺寸而增长），导致歌名→歌手间距比声明的 row-gap 明显更大。改用 BBL 同款
       机制：rk/封面脱离文档流用 position:absolute 居中覆盖，歌名/歌手回归纯文档流 margin-top 控距 */
    '  .mp-an-block .mp-an-tbl tr{position:relative;display:block;padding:8px 14px 8px 108px;border-bottom:1px solid var(--clr-border)}',
    '  .mp-an-block .mp-an-tbl tr:last-child{border-bottom:none}',
    '  .mp-an-block .mp-an-tbl .mp-an-row--1{background:rgba(212,168,50,.12)}',
    '  .mp-an-block .mp-an-tbl .mp-an-row--2{background:rgba(148,196,220,.11)}',
    '  .mp-an-block .mp-an-tbl .mp-an-row--3{background:rgba(224,160,100,.10)}',
    '  .mp-an-block .mp-an-tbl td{display:block;padding:0;border:none;width:auto!important;background:none!important}',
    '  .mp-an-block .mp-an-tbl .rk{position:absolute;left:0;top:50%;transform:translateY(-50%);width:54px!important;text-align:center;font-family:var(--font-display);font-size:21px;font-weight:400}',  /* 名次同 BBL .chart-rank；框宽=封面 left 值，使数字在「卡片左边缘→封面」整段可视空间内真正居中（此前框只有 24px 且偏右，数字看起来仍靠右）。上一行 td 重置规则用 !important 强制 width:auto，此前一直悄悄覆盖本行的 width 声明使 text-align:center 从未真正生效——补 !important 抢回控制权 */
    '  .mp-an-block .mp-an-tbl .an-name,.mp-an-block .mp-an-tbl .an-name-in{display:contents}',  /* 拆出封面，标题回归纯文档流 */
    '  .mp-an-block .mp-an-tbl .an-cover{position:absolute;left:54px;top:50%;transform:translateY(-50%);width:38px;height:38px;margin:0}',
    '  .mp-an-block .mp-an-tbl .an-title{display:block;font-size:13px;font-weight:600;line-height:1.2}',
    '  .mp-an-block .mp-an-tbl .an-artist{display:block;font-size:11px;line-height:1.2;color:var(--clr-text-2);white-space:normal;margin-top:2px}',
    '  .mp-an-assist{min-width:0;width:100%;table-layout:fixed}',  /* 助攻表：手机端 6 列等分、一屏内显示不横滚 */
    '  .mp-an-assist th,.mp-an-assist td{padding-left:6px;padding-right:6px}',
    '}',
    '.mp-an-tbl .an-artist{color:var(--clr-text-2);white-space:nowrap}',  /* 歌手（后，secondary） */
    /* 前三名歌名/歌手金银铜配色，同 BBL .chart-item--top/silver/bronze .chart-song__title/__artist；
       置于手机端 @media 块之后以特异度打平后靠源序覆盖其内 .an-artist 默认色（同 0,3,0） */
    '.mp-an-tbl .mp-an-row--1 .an-title{color:var(--clr-gold-tint)}',
    '.mp-an-tbl .mp-an-row--1 .an-artist{color:rgba(224,176,64,.85)}',
    '.mp-an-tbl .mp-an-row--2 .an-title{color:var(--clr-silver-tint)}',
    '.mp-an-tbl .mp-an-row--2 .an-artist{color:rgba(148,196,220,.85)}',
    '.mp-an-tbl .mp-an-row--3 .an-title{color:var(--clr-bronze-tint)}',
    '.mp-an-tbl .mp-an-row--3 .an-artist{color:rgba(224,160,100,.8)}',
    '.mp-an-h{font-size:13px;font-weight:600;color:var(--clr-text-2);margin:0 0 12px}',  /* 「助攻详情」同「历届排名走势」 */
    '.mp-an-subtitle .an-yr{font-family:var(--font-display);font-weight:400;font-size:19px;letter-spacing:.04em;color:var(--clr-text);margin-right:3px}',
    '.mp-an-block.is-collapsed .mp-an-extra{display:none}',
    '.mp-more{display:inline-flex;align-items:center;gap:6px;margin-top:14px;background:transparent;border:1px solid var(--clr-border-2);color:var(--clr-text-2);font-family:var(--font-body);font-size:12px;font-weight:600;letter-spacing:.04em;padding:6px 16px;border-radius:6px;cursor:pointer;transition:border-color .2s,color .2s}',
    '.mp-more:hover{border-color:var(--clr-text);color:var(--clr-text)}',
    /* 展开按钮（个人榜前十 + 吧视表通用）：表格底边居中的小圆角矩形 + 双箭头（展开后翻转朝上）
       重叠部分藏在表格下面（wrap z:0 < table z:1，表格不透明底遮住按钮上半）；箭头默认＝描边色，hover 变紫 */
    '.mp-an-more-wrap{display:flex;justify-content:center;margin-top:-6px;position:relative;z-index:0}',
    '.mp-an-more{display:flex;align-items:center;justify-content:center;width:54px;height:24px;padding:0;background:var(--clr-surface);border:1px solid var(--clr-border-2);border-radius:6px;color:var(--clr-text-4);cursor:pointer}',  /* 箭头(currentColor)=混淆标签色 text-4；描边仍 border-2；无 hover/click 高亮效果 */
    '.mp-an-more svg{width:16px;height:16px;display:block;position:relative;top:2px;transition:transform .25s}',  /* 箭头内部下移 2px */
    '.mp-an-more.is-open svg{transform:rotate(180deg)}',
    /* ── 页内目录（Notion 风格，同吧视详情页 bvr-toc）── */
    '.mp-toc{position:fixed;right:14px;top:50%;transform:translateY(-50%);z-index:90;display:flex;flex-direction:column;align-items:flex-end;gap:0;opacity:0;visibility:hidden;transition:opacity .25s,visibility .25s}',
    '.mp-toc--visible{opacity:1;visibility:visible}',
    '.mp-toc__toggle{display:none}',
    '.mp-toc__list{display:flex;flex-direction:column;align-items:flex-end;gap:2px;padding:8px 10px;border-radius:8px;background:transparent;transition:background .25s,-webkit-backdrop-filter .25s,backdrop-filter .25s}',
    '.mp-toc:hover .mp-toc__list{background:rgba(20,20,34,.55);-webkit-backdrop-filter:blur(10px);backdrop-filter:blur(10px)}',
    '.mp-toc__item{display:flex;align-items:center;justify-content:flex-end;gap:9px;cursor:pointer;user-select:none;padding:2px 0}',
    '.mp-toc__dash{flex:none;width:14px;height:2px;border-radius:2px;background:var(--clr-text-3);opacity:.4;transition:width .25s,background .25s,opacity .25s}',
    '.mp-toc__label{order:-1;font-family:var(--font-body);font-size:10.5px;letter-spacing:.01em;color:var(--clr-text-3);white-space:nowrap;max-width:0;opacity:0;transform:translateX(6px);overflow:hidden;transition:max-width .3s ease,opacity .25s,transform .3s ease,color .15s}',
    '.mp-toc:hover .mp-toc__label{max-width:220px;opacity:1;transform:translateX(0)}',
    '.mp-toc__item:hover .mp-toc__dash{opacity:.85;background:var(--clr-text-2)}',
    '.mp-toc__item:hover .mp-toc__label{color:var(--clr-text)}',
    '.mp-toc__item--active .mp-toc__dash{width:22px;background:var(--clr-violet-light);opacity:1}',
    '.mp-toc__item--active .mp-toc__label{color:var(--clr-violet-light)}',
    '@media (max-width:768px){',
    '  .mp-toc{right:20px;bottom:66px;top:auto;transform:none;z-index:210;gap:10px}',
    '  .mp-toc__toggle{display:flex;align-items:center;justify-content:center;width:42px;height:42px;background:rgba(20,20,34,.5);-webkit-backdrop-filter:blur(12px);backdrop-filter:blur(12px);border:1px solid var(--clr-border-2);border-radius:4px;color:rgba(192,132,252,.65);cursor:pointer;padding:0;transition:color .25s,border-color .25s}',
    '  .mp-toc__toggle svg{width:18px;height:18px}',
    '  .mp-toc--open .mp-toc__toggle{color:var(--clr-violet-light);border-color:var(--clr-violet-light)}',
    '  .mp-toc__list{display:none;gap:1px;min-width:152px;max-height:62vh;overflow-y:auto;background:rgba(20,20,34,.72);-webkit-backdrop-filter:blur(14px);backdrop-filter:blur(14px);border:1px solid var(--clr-border-2);border-radius:6px;padding:6px;box-shadow:0 8px 28px rgba(0,0,0,.4)}',
    '  .mp-toc:hover .mp-toc__list{background:rgba(20,20,34,.72)}',
    '  .mp-toc--open .mp-toc__list{display:flex}',
    '  .mp-toc__item{justify-content:flex-start;gap:0;padding:9px 13px;border-radius:4px}',
    '  .mp-toc__item:hover{background:rgba(255,255,255,.04)}',
    '  .mp-toc__dash{display:none}',
    '  .mp-toc__label{order:0;max-width:none;opacity:1;transform:none;overflow:visible;font-size:13px}',
    '  .mp-toc__item--active{background:rgba(168,85,247,.12)}',
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
  // 2023+ 主题双色：徽章 logo 改 45° 双色斜条纹（与详情页 BV_THEME 一致）。导入新年份补一条。
  var BV_STRIPE = {
    2023: ['#f84d39', '#fbb1a9'],  // 珊瑚红 / 浅珊瑚（海报浅红色）
    2024: ['#fc91c1', '#f961a6'],  // 浅粉 / 中粉
    2025: ['#f4a259', '#e0612e'],  // 暖橙 / 深橙（橙黄渐变）
    2026: ['#3d9bff', '#a855f7']   // 电光蓝 / 紫（蓝紫条纹）
  };
  function bvStripeDefs(id, c1, c2) {
    return '<defs><pattern id="' + id + '" width="240" height="240" patternUnits="userSpaceOnUse" patternTransform="translate(0,26) rotate(60)">' +
      '<rect width="120" height="240" fill="' + c1 + '"/>' +
      '<rect x="120" width="120" height="240" fill="' + c2 + '"/></pattern></defs>';
  }
  // 单枚届徽章（空心五边形 logo + 届号；创始届金 + 光晕，2023+ 双色斜条纹）
  function oneBadge(no, year) {
    var first = no === 1;
    var stripe = !first && BV_STRIPE[year];
    var logoColor = first ? 'var(--clr-gold)' : (BV_YEAR_COLOR[year] || 'var(--clr-board)');
    var pid = 'bvstr-' + no;
    var pathTag = stripe
      ? bvStripeDefs(pid, stripe[0], stripe[1]) + '<path d="' + LOGO_HOLLOW_PATH + '" style="fill:url(#' + pid + ')"/>'
      : '<path d="' + LOGO_HOLLOW_PATH + '"/>';
    return '<span class="mp-bv-badge' + (first ? ' mp-bv-badge--first' : '') + '" title="第' + no + '届 Barvision' + (first ? ' · 创始届' : '') + '" style="color:' + logoColor + '">' +
      '<svg class="mp-bv-badge__mark" viewBox="0 0 770 746" aria-hidden="true">' + pathTag +
        '<text class="mp-bv-badge__num" x="382" y="497" text-anchor="middle" style="fill:var(--clr-text);font-size:300px">' + no + '</text>' +
      '</svg></span>';
  }
  function bvBadges(bv) {
    var seen = {}, list = [];
    (bv.entries || []).forEach(function (e) {
      if (e.canceled) return;  // 仅报名取消组（如 12B）不计入届徽章——须参加正式比赛才获该届徽章
      if (e.edition_no != null && !seen[e.edition_no]) { seen[e.edition_no] = 1; list.push({ no: e.edition_no, year: e.year }); }
    });
    list.sort(function (a, b) { return a.no - b.no; });
    return list.map(function (ed) { return oneBadge(ed.no, ed.year); }).join('');
  }
  function renderBvRows(list) {
    return list.map(function (e) {
      var cls = (e.is_shadow || e.canceled) ? 'mp-bv-row--shadow' : (e.rank && e.rank <= 3 ? 'mp-bv-row--' + e.rank : '');
      // 详情页路径（clean URL 目录化）：2023 起一年一届 → /barvision/<年>/；2019–2020 一年多届 → /barvision/<年>/<两位届数>(e)/
      var href = (e.year >= 2023)
        ? '/barvision/' + e.year + '/'
        : '/barvision/' + e.year + '/' + ('0' + e.edition_no).slice(-2) + (e.version === 'unplugged' ? 'e' : '') + '/';
      var seriesLabel = /^[0-9]+$/.test(String(e.series)) ? '-' : esc(e.series);
      return '<tr class="' + cls + '">' +
        '<td class="rk">' + (e.rank == null ? '—' : (e.is_shadow ? '<span class="rk-sh">' + e.rank + '*</span>' : e.rank)) + '</td>' +
        '<td class="ed"><a class="mp-bv-ed" href="' + href + '">第 ' + e.edition_no + ' 届</a></td>' +
        '<td class="num2">' + seriesLabel + '</td>' +
        '<td class="artist">' + esc(e.artist) + '</td>' +
        '<td class="song">' + esc(e.song) + (e.joint ? '<span class="mp-bv-joint">合报</span>' : '') + (e.persona && e.persona !== '匿名' ? '<span class="mp-bv-persona">' + esc(e.persona) + '</span>' : '') + (e.is_shadow ? '<span class="mp-bv-sh">混淆</span>' : '') + (e.canceled ? '<span class="mp-bv-canceled">取消</span>' : '') + '</td>' +
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
          '<span class="mp-bv-lg"><svg class="mp-bv-lg__ic" viewBox="0 0 15 15" aria-hidden="true"><circle cx="7.5" cy="8.5" r="3.2" fill="var(--clr-bg)" stroke="var(--clr-text-4)" stroke-width="1.6"/></svg><span class="mp-bv-lg__t">混淆单曲</span></span>' +
        '</span>' +
      '</div>' +
      '<div class="mp-bv-trend__sc"><svg class="mp-bv-trend__svg" role="img" aria-label="历届排名走势"></svg></div>' +
    '</div>';
  }
  function drawBvTrend(forceW) {  // forceW：导出时传入固定逻辑宽度，使各设备产出一致的宽幅高清图
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

    var padL = 24, padR = 14, padT = 36, padB = 48, H = 320, minSlotW = 36;
    // 占满容器全宽；场次多到每格 < minSlotW 时才扩宽 → 横向滚动
    var sc = svg.parentNode;
    var contW = forceW || (sc && sc.clientWidth) || 600;
    var W = Math.max(contW, padL + padR + (n > 1 ? (n - 1) * minSlotW : minSlotW));
    var plotH = H - padT - padB;
    function xAt(i) {
      if (n === 1) return W / 2;
      // 网格线/平均线保持全宽（padL..W-padR）。数据点不对称内收：
      // 左侧多收（让「平均 X.XX」标注落在空档、不与首点 #N 标签重合），右侧仅微收（末点更贴右、不浪费宽度）
      var insetL = Math.min(64, (W - padL - padR) * 0.13), insetR = 16;
      var lo = padL + insetL, hi = W - padR - insetR;
      return lo + (hi - lo) * i / (n - 1);
    }
    function yAt(r) { return padT + plotH * (r - 1) / (yMax - 1); }
    // 点配色：冠军金 / 最近场次粉 / 否则蓝；年度制未进决赛的正式曲(final===false) → soft 弱化色
    function dotCls(e, latest) {
      var c = e.rank === 1 ? 'is-champ' : (latest ? 'is-latest' : '');
      if (e.final === false) c = (c + ' is-soft').trim();
      return c;
    }

    var out = '';
    // Y 网格 + 刻度
    var yvals = [1]; if (yMax >= 4) yvals.push(Math.round(yMax / 2)); yvals.push(yMax);
    yvals = yvals.filter(function (v, i, a) { return a.indexOf(v) === i; });
    yvals.forEach(function (r) {
      out += '<line x1="' + padL + '" y1="' + yAt(r).toFixed(1) + '" x2="' + (W - padR) + '" y2="' + yAt(r).toFixed(1) + '" class="mp-bv-trend__grid"/>';
      out += '<text x="' + (padL - 9) + '" y="' + (yAt(r) + 5).toFixed(1) + '" text-anchor="end" class="mp-bv-trend__ylab">' + r + '</text>';
    });

    // 平均排名虚线（仅正式单曲；横线左端上方标注两位小数，紫色调）
    var offRanks = entries.filter(function (e) { return !e.is_shadow; }).map(function (e) { return e.rank; });
    if (offRanks.length) {
      var avg = offRanks.reduce(function (a, b) { return a + b; }, 0) / offRanks.length;
      var ay = yAt(avg);
      out += '<line x1="' + padL + '" y1="' + ay.toFixed(1) + '" x2="' + (W - padR) + '" y2="' + ay.toFixed(1) + '" class="mp-bv-trend__avg"/>';
      out += '<text x="' + (padL + 2) + '" y="' + (ay - 6).toFixed(1) + '" text-anchor="start" class="mp-bv-trend__avglab">平均 ' + avg.toFixed(2) + '</text>';
    }

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
    function rankLabel(cx, cy, r, weak, below) { var ly = below ? (cy + 17) : (cy - 11); return '<text x="' + cx + '" y="' + ly.toFixed(1) + '" text-anchor="middle" class="mp-bv-trend__rank' + (weak ? ' is-weak' : '') + '">#' + r + '</text>'; }
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
      // 同 X 多个名次：相差≤3 时标签上下交替错开，避免重合并露出下方点的 hit 区
      var lab = Object.keys(byRank).map(function (rk) { return { rank: +rk, cy: byRank[rk].cy, weak: byRank[rk].weak }; }).sort(function (a, b) { return a.cy - b.cy; });
      var stagger = lab.length >= 2 && (lab[lab.length - 1].rank - lab[0].rank) <= 3;
      lab.forEach(function (L, li) { out += rankLabel(cx, L.cy, L.rank, L.weak, stagger && (li % 2 === 1)); });
    });

    svg.setAttribute('width', W);
    svg.setAttribute('height', H);
    svg.setAttribute('viewBox', '0 0 ' + W + ' ' + H);
    svg.innerHTML = out;
    initBvTip();
  }

  // 走势图 tooltip：桌面 hover、手机点击；元素与事件仅初始化一次（SVG 重绘不重复绑定）
  /* ── 走势图导出 PNG（纯前端：内联计算样式 + 嵌入字体 + 头部水印；下载或手机 Web Share）── */
  function bvCssVar(name) { return getComputedStyle(document.documentElement).getPropertyValue(name).trim(); }
  var _bvFontCssP = null;
  function bvEmbedFontCss() {  // 把走势图用到的本地字体 base64 内嵌，导出时文字才保真；失败则优雅降级为系统字体
    if (_bvFontCssP) return _bvFontCssP;
    var fonts = [
      ['DM Mono', '400', '/assets/fonts/DM_Mono/DMMono-Regular.ttf'],
      ['DM Sans', '400', '/assets/fonts/DM_Sans/static/DMSans-Regular.ttf'],
      ['DM Sans', '600', '/assets/fonts/DM_Sans/static/DMSans-SemiBold.ttf']
    ];
    _bvFontCssP = Promise.all(fonts.map(function (f) {
      return fetch(f[2]).then(function (r) { return r.arrayBuffer(); }).then(function (buf) {
        var bytes = new Uint8Array(buf), bin = '', CH = 0x8000;
        for (var i = 0; i < bytes.length; i += CH) bin += String.fromCharCode.apply(null, bytes.subarray(i, i + CH));
        return "@font-face{font-family:'" + f[0] + "';font-weight:" + f[1] + ";font-style:normal;src:url(data:font/ttf;base64," + btoa(bin) + ") format('truetype')}";
      }).catch(function () { return ''; });
    })).then(function (parts) { return parts.join(''); });
    return _bvFontCssP;
  }
  var _bvLogoP = null;
  function bvLoadLogo() {  // 预加载站点 logo（同源 PNG，drawImage 不污染 canvas）；失败返回 null 优雅降级
    if (_bvLogoP) return _bvLogoP;
    _bvLogoP = new Promise(function (res) {
      var im = new Image();
      im.onload = function () { res(im); };
      im.onerror = function () { res(null); };
      im.src = '/assets/images/logo_center.png';
    });
    return _bvLogoP;
  }
  function bvInlineStyles(src, dst) {  // 把 class/var() 解析后的实际样式内联到克隆 SVG，使其自包含
    var cs = getComputedStyle(src);
    var props = ['fill', 'stroke', 'stroke-width', 'stroke-dasharray', 'stroke-linecap', 'stroke-linejoin', 'opacity', 'fill-opacity', 'stroke-opacity', 'font-family', 'font-size', 'font-weight', 'font-style', 'text-anchor', 'letter-spacing'];
    var s = '';
    for (var i = 0; i < props.length; i++) { var v = cs.getPropertyValue(props[i]); if (v) s += props[i] + ':' + v + ';'; }
    dst.setAttribute('style', s + (dst.getAttribute('style') || ''));
    var sc = src.children, dc = dst.children;
    for (var j = 0; j < sc.length; j++) if (dc[j]) bvInlineStyles(sc[j], dc[j]);
  }
  function bvShareOrDownload(blob, label) {
    // 文件名：妈名-Barvision-项目（妈名 = 昵称去尾「妈」，如 雨妈→雨）
    var who = (nickname || '').toString().replace(/妈$/, '');
    label = label || '走势';
    var fname = (who ? who + '-' : '') + 'Barvision-' + label + '.png';
    function dl() {
      var url = URL.createObjectURL(blob);
      var a = document.createElement('a'); a.href = url; a.download = fname; document.body.appendChild(a); a.click(); a.remove();
      setTimeout(function () { URL.revokeObjectURL(url); }, 1500);
    }
    // 仅手机/触屏用系统分享（唤起微信/QQ）；桌面（Windows 的 canShare 也为 true）一律直接下载
    var touch = window.matchMedia('(hover:none),(pointer:coarse)').matches;
    if (touch) {
      try {
        var file = new File([blob], fname, { type: 'image/png' });
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          navigator.share({ files: [file], title: (nickname || '') + ' · Barvision ' + label }).catch(function () {});
          return;
        }
      } catch (e) {}
    }
    dl();
  }
  // 走势图克隆为高分辨率 Image（按 forceW 固定宽度重绘后立即恢复响应式；返回 {img,W,H,free}）
  function bvTrendToImage(fontCss, SC, forceW) {
    var svg = document.querySelector('.mp-bv-trend__svg');
    drawBvTrend(forceW);
    var W = svg.viewBox.baseVal.width || forceW, H = svg.viewBox.baseVal.height || 320;
    var clone = svg.cloneNode(true);
    bvInlineStyles(svg, clone);
    drawBvTrend();  // 立即恢复响应式宽度（同一任务内无可见闪烁）
    clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    clone.setAttribute('viewBox', '0 0 ' + W + ' ' + H);
    clone.setAttribute('width', W * SC); clone.setAttribute('height', H * SC);
    if (fontCss) { var st = document.createElementNS('http://www.w3.org/2000/svg', 'style'); st.textContent = fontCss; clone.insertBefore(st, clone.firstChild); }
    var url = URL.createObjectURL(new Blob([new XMLSerializer().serializeToString(clone)], { type: 'image/svg+xml;charset=utf-8' }));
    return new Promise(function (resolve, reject) {
      var img = new Image();
      img.onload = function () { resolve({ img: img, W: W, H: H, free: function () { URL.revokeObjectURL(url); } }); };
      img.onerror = function () { URL.revokeObjectURL(url); reject(new Error('svg')); };
      img.src = url;
    });
  }
  // 图例（正式/混淆）：右端对齐 rightX、垂直居中 cyc（坐标均为设备像素）
  function bvDrawLegend(ctx, rightX, cyc, SC) {
    ctx.font = (13 * SC) + "px 'DM Sans',sans-serif"; ctx.textAlign = 'left';
    var leg = [
      { t: '正式单曲', hollow: false, c: bvCssVar('--clr-accent-light') || '#7fd4ff' },
      { t: '混淆单曲', hollow: true, c: bvCssVar('--clr-bg') || '#080812', s: bvCssVar('--clr-text-4') || '#6a6488' }
    ];
    var lr = 4.5 * SC, ldg = 6 * SC, lig = 18 * SC;
    var lw = leg.map(function (it) { return 2 * lr + ldg + ctx.measureText(it.t).width; });
    var lx = rightX - lw.reduce(function (a, b) { return a + b; }, 0) - lig * (leg.length - 1);
    ctx.textBaseline = 'middle';
    leg.forEach(function (it, i) {
      ctx.beginPath(); ctx.arc(lx + lr, cyc, lr, 0, 2 * Math.PI);
      ctx.fillStyle = it.c; ctx.fill();
      if (it.hollow) { ctx.lineWidth = 1.6 * SC; ctx.strokeStyle = it.s; ctx.stroke(); }
      ctx.fillStyle = bvCssVar('--clr-text-3') || '#A39BC2';
      ctx.fillText(it.t, lx + 2 * lr + ldg, cyc);
      lx += lw[i] + lig;
    });
    ctx.textBaseline = 'alphabetic';
  }
  // 品牌：logo + barboard.space，从 x 起、垂直居中 cyc（设备像素）
  function bvDrawBrand(ctx, x, cyc, SC, logo) {
    var bx = x;
    if (logo && logo.naturalWidth) {
      var lh = 22 * SC, lwd = lh * (logo.naturalWidth / logo.naturalHeight);
      ctx.drawImage(logo, x, cyc - lh / 2, lwd, lh);
      bx = x + lwd + 8 * SC;
    }
    ctx.fillStyle = bvCssVar('--clr-text-2') || '#A299C8'; ctx.font = '600 ' + (14 * SC) + "px 'DM Sans',sans-serif";
    ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
    ctx.fillText('barboard.space', bx, cyc + 1 * SC);
    ctx.textBaseline = 'alphabetic';
  }
  function exportBvTrendPng(btn) {
    var svg = document.querySelector('.mp-bv-trend__svg');
    if (!svg) return;
    var orig = btn.innerHTML, lab = btn.querySelector('span');
    btn.disabled = true; if (lab) lab.textContent = '生成中…';
    function restore() { btn.disabled = false; btn.innerHTML = orig; }
    var SC = 3;
    Promise.all([bvEmbedFontCss(), bvLoadLogo()]).then(function (res) {
      var fontCss = res[0], logo = res[1];
      return bvTrendToImage(fontCss, SC, 1120).then(function (t) {
        var M = 32 * SC, HEAD = 92 * SC, FOOT = 46 * SC, cw = t.W * SC + M * 2, ch = HEAD + t.H * SC + FOOT;
        var cv = document.createElement('canvas'); cv.width = cw; cv.height = ch;
        var ctx = cv.getContext('2d');
        ctx.fillStyle = bvCssVar('--clr-bg') || '#080812'; ctx.fillRect(0, 0, cw, ch);
        var name = (nickname || '').toString();
        ctx.textBaseline = 'alphabetic'; ctx.textAlign = 'left';
        ctx.fillStyle = bvCssVar('--clr-text') || '#fff'; ctx.font = '700 ' + (30 * SC) + "px 'DM Sans','Segoe UI',sans-serif";
        ctx.fillText(name, M, 46 * SC);
        ctx.fillStyle = bvCssVar('--clr-violet-light') || '#c084fc'; ctx.font = '600 ' + (13 * SC) + "px 'DM Sans',sans-serif";
        ctx.fillText('BARVISION · 历届排名走势', M, 70 * SC);
        bvDrawLegend(ctx, cw - M, 38 * SC, SC);
        ctx.drawImage(t.img, M, HEAD, t.W * SC, t.H * SC);
        bvDrawBrand(ctx, M, HEAD + t.H * SC + FOOT / 2, SC, logo);
        t.free();
        cv.toBlob(function (blob) { if (blob) bvShareOrDownload(blob, '走势'); restore(); }, 'image/png');
      });
    }).catch(restore);
  }
  function exportBvCardPng(btn, withTable) {
    var svg = document.querySelector('.mp-bv-trend__svg');
    if (!svg || !d.barvision) return;
    var orig = btn.innerHTML, lab = btn.querySelector('span');
    btn.disabled = true; if (lab) lab.textContent = '生成中…';
    function restore() { btn.disabled = false; btn.innerHTML = orig; }
    var SC = 3;
    function P(v) { return v * SC; }
    function rrect(c, x, y, w, h, r) { c.beginPath(); c.moveTo(x + r, y); c.arcTo(x + w, y, x + w, y + h, r); c.arcTo(x + w, y + h, x, y + h, r); c.arcTo(x, y + h, x, y, r); c.arcTo(x, y, x + w, y, r); c.closePath(); }
    function rcolor(c) { var m = /var\((--[\w-]+)\)/.exec(c); return m ? bvCssVar(m[1]) : c; }
    Promise.all([bvEmbedFontCss(), bvLoadLogo()]).then(function (res) {
      var fontCss = res[0], logo = res[1];
      return bvTrendToImage(fontCss, SC, 1120).then(function (t) {
        var timg = t.img, W = t.W, H = t.H, ov = d.barvision.overview;
        // ── 布局（逻辑 px）──
        var M = 32, GAP = 26, AV = 88, headTop = 32, textX = M + AV + 24;
        var name = (nickname || '').toString(), hdl = handle ? ('@' + handle) : '';
        var seen = {}, badges = [];
        (d.barvision.entries || []).forEach(function (e) { if (e.canceled) return; if (e.edition_no != null && !seen[e.edition_no]) { seen[e.edition_no] = 1; badges.push({ no: e.edition_no, year: e.year }); } });
        badges.sort(function (a, b) { return a.no - b.no; });
        var badgeY = headTop + 56, badgeS = 28, badgeGap = 7;
        var headerBottom = Math.max(headTop + AV, badgeY + badgeS * 746 / 770);
        var statsTop = headerBottom + GAP, cardGap = 10, cardW = (W - cardGap * 7) / 8, cardH = 84;  // 8 张一排
        var statsBottom = statsTop + cardH;
        var trendTop = statsBottom + GAP, trendLabelY = trendTop + 12, chartTop = trendTop + 30, trendBottom = chartTop + H;
        var tblRows = withTable ? sortBvEntries(d.barvision.entries, 'edition', 'asc') : [];
        var TBL_HEAD = 40, TBL_ROW = 38;
        var tableLabelY = trendBottom + 28, tableTop = trendBottom + 46;
        var tableBottom = tableTop + TBL_HEAD + tblRows.length * TBL_ROW;
        var contentBottom = withTable ? tableBottom : trendBottom;
        var footMid = contentBottom + 22 + 16, chL = contentBottom + 22 + 36 + 8, cw = W + M * 2;
        // ── 画布 ──
        var cv = document.createElement('canvas'); cv.width = cw * SC; cv.height = chL * SC;
        var ctx = cv.getContext('2d');
        ctx.fillStyle = bvCssVar('--clr-bg') || '#080812'; ctx.fillRect(0, 0, cv.width, cv.height);
        // ── 头像 ──
        var acx = P(M + AV / 2), acy = P(headTop + AV / 2);
        var grd = ctx.createLinearGradient(acx - P(AV / 2), acy - P(AV / 2), acx + P(AV / 2), acy + P(AV / 2));
        grd.addColorStop(0, bvCssVar('--clr-violet') || '#a855f7'); grd.addColorStop(1, bvCssVar('--clr-accent') || '#00b4ff');
        ctx.beginPath(); ctx.arc(acx, acy, P(AV / 2 + 3), 0, 2 * Math.PI); ctx.fillStyle = grd; ctx.fill();
        ctx.beginPath(); ctx.arc(acx, acy, P(AV / 2), 0, 2 * Math.PI); ctx.fillStyle = bvCssVar('--clr-surface-2') || '#1a1a2e'; ctx.fill();
        ctx.fillStyle = bvCssVar('--clr-violet-light') || '#c084fc'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.font = phIsCJK ? ('700 ' + P(40) + "px 'DM Sans',sans-serif") : (P(46) + "px 'Bebas Neue',sans-serif");
        ctx.fillText(ph, acx, acy + P(phIsCJK ? 2 : 3));
        // ── 名 + @ ──
        ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic';
        ctx.fillStyle = bvCssVar('--clr-text') || '#fff'; ctx.font = '700 ' + P(34) + "px 'DM Sans','Segoe UI',sans-serif";
        ctx.fillText(name, P(textX), P(headTop + 36));
        var nameW = ctx.measureText(name).width;
        if (hdl) { ctx.fillStyle = bvCssVar('--clr-text-2') || '#A299C8'; ctx.font = P(15) + "px 'DM Sans',sans-serif"; ctx.fillText(hdl, P(textX) + nameW + P(12), P(headTop + 36)); }
        // ── 徽章 ──
        badges.forEach(function (ed, i) {
          var stripe = ed.no !== 1 && BV_STRIPE[ed.year];  // 2023+ 双色斜条纹
          var col = rcolor(ed.no === 1 ? 'var(--clr-gold)' : (BV_YEAR_COLOR[ed.year] || 'var(--clr-board)'));
          ctx.save(); ctx.translate(P(textX) + i * P(badgeS + badgeGap), P(badgeY)); var s = P(badgeS) / 770; ctx.scale(s, s);
          if (stripe) {  // 裁剪到 logo 形状 → 条纹整体下移 ≈1px → 60° 旋转后画交替竖带
            ctx.save(); ctx.clip(new Path2D(LOGO_HOLLOW_PATH));
            ctx.translate(0, 26);  // 条纹起点下移 ≈1px（viewBox 746/29px）
            ctx.translate(385, 373); ctx.rotate(Math.PI / 3); ctx.translate(-385, -373);
            for (var bx = -900; bx < 1500; bx += 240) {
              ctx.fillStyle = stripe[0]; ctx.fillRect(bx, -900, 120, 2400);
              ctx.fillStyle = stripe[1]; ctx.fillRect(bx + 120, -900, 120, 2400);
            }
            ctx.restore();
          } else {
            ctx.fillStyle = col; ctx.fill(new Path2D(LOGO_HOLLOW_PATH));
          }
          ctx.fillStyle = bvCssVar('--clr-text') || '#fff';
          ctx.font = "300px 'Bebas Neue',sans-serif"; ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic';  // 一位/两位字号统一
          ctx.fillText(String(ed.no), 382, 497);
          ctx.restore();
        });
        // ── 8 张统计卡 ──
        var GOLD = bvCssVar('--clr-gold-light'), SILVER = bvCssVar('--clr-silver'), BRONZE = bvCssVar('--clr-bronze'), DIM = bvCssVar('--clr-text-3');
        function f2(v) { return v == null ? '—' : Number(v).toFixed(2); }
        var bestN = ov.best, bestColor = bestN === 1 ? GOLD : bestN === 2 ? SILVER : bestN === 3 ? BRONZE : '';
        var bestRep = 0; if (bestN != null) (d.barvision.entries || []).forEach(function (e) { if (!e.is_shadow && e.rank === bestN) bestRep++; });
        var cards = [
          { n: (bestN == null ? '—' : String(bestN)), p: (bestRep > 1 ? bestRep : 0), k: '最佳名次', c: bestColor },
          { n: f2(ov.avg), k: '平均名次' },
          { n: String(ov.twelve), k: '12 分次数', c: ov.twelve === 0 ? DIM : '' },
          { n: f2(ov.jury_avg), k: 'Jury 均分' },
          { n: String(ov.top1), p: ov.top1_shadow, k: '冠军场数', c: ov.top1 > 0 ? GOLD : DIM },
          { n: String(ov.top3), p: ov.top3_shadow, k: '前三场数', c: ov.top3 === 0 ? DIM : '' },
          { n: String(ov.top10), p: ov.top10_shadow, k: '前十场数', c: ov.top10 === 0 ? DIM : '' },
          { n: String(ov.entries), p: ov.shadow, k: '参与场数', c: ov.entries === 0 ? DIM : '' }
        ];
        cards.forEach(function (cd, i) {
          var x = P(M + i * (cardW + cardGap)), y = P(statsTop), w = P(cardW), h = P(cardH);
          rrect(ctx, x, y, w, h, P(8)); ctx.fillStyle = bvCssVar('--clr-surface') || '#12121f'; ctx.fill();
          ctx.lineWidth = P(1); ctx.strokeStyle = bvCssVar('--clr-border') || '#262636'; ctx.stroke();
          var numCJK = /[一-鿿]/.test(cd.n);
          var numFont = numCJK ? ('700 ' + P(20) + "px 'DM Sans',sans-serif") : (P(30) + "px 'Bebas Neue',sans-serif");
          var numX = x + w / 2, numY = y + P(41), labelY = y + h - P(21);  // 数字+标签块整体垂直居中
          // 括号(混淆/达成次数)参与居中：数字+括号作为一组居中，与标签共享中轴
          ctx.font = numFont; var nw = ctx.measureText(cd.n).width;
          var pStr = cd.p ? ('(' + cd.p + ')') : '', pw = 0;
          if (pStr) { ctx.font = P(13) + "px 'DM Sans',sans-serif"; pw = ctx.measureText(pStr).width + P(3); }
          var sx = numX - (nw + pw) / 2;
          ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic';
          ctx.font = numFont; ctx.fillStyle = cd.c || bvCssVar('--clr-text') || '#fff'; ctx.fillText(cd.n, sx, numY);
          if (pStr) { ctx.font = P(13) + "px 'DM Sans',sans-serif"; ctx.fillStyle = DIM; ctx.fillText('(' + cd.p + ')', sx + nw + P(3), numY); }
          ctx.fillStyle = bvCssVar('--clr-text-2') || '#A299C8'; ctx.font = P(12) + "px 'DM Sans',sans-serif"; ctx.textAlign = 'center';
          ctx.fillText(cd.k, numX, labelY);
        });
        // ── 走势图（小标题 + 图例 + 图）──
        ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic';
        ctx.fillStyle = bvCssVar('--clr-text-2') || '#A299C8'; ctx.font = '600 ' + P(13) + "px 'DM Sans',sans-serif";
        ctx.fillText('历届排名走势', P(M), P(trendLabelY + 4));
        bvDrawLegend(ctx, P(M + W), P(trendLabelY), SC);
        ctx.drawImage(timg, P(M), P(chartTop), W * SC, H * SC);
        // ── 历史成绩列表（仅 withTable）──
        if (withTable) {
          ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic';
          ctx.fillStyle = bvCssVar('--clr-text-2') || '#A299C8'; ctx.font = '600 ' + P(13) + "px 'DM Sans',sans-serif";
          ctx.fillText('历届参赛记录', P(M), P(tableLabelY + 4));
          var x0 = P(M), wpx = P(W);
          var cRank = 50, cEd = 78, cSer = 56, cArt = 300, cTot = 84, cTw = 64, cSong = W - (cRank + cEd + cSer + cArt + cTot + cTw);
          var cwid = [cRank, cEd, cSer, cArt, cSong, cTot, cTw], cleft = [0]; for (var ci = 0; ci < 6; ci++) cleft.push(cleft[ci] + cwid[ci]);
          var cenCol = [1, 1, 1, 0, 0, 1, 1];
          function clip(s, maxLg) { s = String(s == null ? '' : s); var mx = P(maxLg); if (ctx.measureText(s).width <= mx) return s; while (s.length > 1 && ctx.measureText(s + '…').width > mx) s = s.slice(0, -1); return s + '…'; }
          function tag(txt, col, x, cy) { ctx.font = P(10) + "px 'DM Sans',sans-serif"; var tw = ctx.measureText(txt).width, px = P(4), h = P(15), w = tw + px * 2, y = cy - h / 2; rrect(ctx, x, y, w, h, P(2)); ctx.lineWidth = P(1); ctx.strokeStyle = (txt && txt.charAt(0) === '匿') ? (bvCssVar('--clr-violet') || '#a855f7') : (bvCssVar('--clr-border-2') || '#444'); ctx.stroke(); ctx.fillStyle = col; ctx.textAlign = 'left'; ctx.textBaseline = 'middle'; ctx.fillText(txt, x + px, cy + P(0.5)); return x + w + P(5); }
          // 表头
          ctx.fillStyle = bvCssVar('--clr-surface') || '#12121f'; ctx.fillRect(x0, P(tableTop), wpx, P(TBL_HEAD));
          ctx.strokeStyle = bvCssVar('--clr-border-2') || '#444'; ctx.lineWidth = P(1);
          ctx.beginPath(); ctx.moveTo(x0, P(tableTop + TBL_HEAD)); ctx.lineTo(x0 + wpx, P(tableTop + TBL_HEAD)); ctx.stroke();
          var heads = ['名次', '届次', '场次', '歌手', '歌名', '总分', '12分'];
          ctx.fillStyle = bvCssVar('--clr-text-2') || '#A299C8'; ctx.font = '700 ' + P(11) + "px 'DM Sans',sans-serif"; ctx.textBaseline = 'middle';
          heads.forEach(function (h, i) { var lx = M + cleft[i]; if (cenCol[i]) { ctx.textAlign = 'center'; ctx.fillText(h, P(lx + cwid[i] / 2), P(tableTop + TBL_HEAD / 2)); } else { ctx.textAlign = 'left'; ctx.fillText(h, P(lx + 10), P(tableTop + TBL_HEAD / 2)); } });
          // 数据行
          tblRows.forEach(function (e, ri) {
            var ry = tableTop + TBL_HEAD + ri * TBL_ROW, midY = P(ry + TBL_ROW / 2), sh = e.is_shadow || e.canceled;
            if (sh) { ctx.fillStyle = bvCssVar('--clr-shadow-bg') || '#0c0a18'; ctx.fillRect(x0, P(ry), wpx, P(TBL_ROW)); }
            ctx.strokeStyle = bvCssVar('--clr-border') || '#262636'; ctx.lineWidth = P(1);
            ctx.beginPath(); ctx.moveTo(x0, P(ry + TBL_ROW)); ctx.lineTo(x0 + wpx, P(ry + TBL_ROW)); ctx.stroke();
            var def = sh ? bvCssVar('--clr-text-4') : bvCssVar('--clr-text'), t3 = sh ? bvCssVar('--clr-text-4') : bvCssVar('--clr-text-3');
            ctx.textBaseline = 'middle';
            // 名次
            var rc = sh ? bvCssVar('--clr-text-4') : (e.rank === 1 ? bvCssVar('--clr-gold-light') : e.rank === 2 ? bvCssVar('--clr-silver') : e.rank === 3 ? bvCssVar('--clr-bronze') : bvCssVar('--clr-text-3'));
            ctx.fillStyle = rc; ctx.textAlign = 'center';
            // 名次为空（—）用固定字体，不随混淆与否变化，避免横杠粗细/长短不一
            var rankTxt, rankFont;
            if (e.rank == null) { rankTxt = '—'; rankFont = '600 ' + P(15) + "px 'DM Sans',sans-serif"; }
            else if (e.is_shadow) { rankTxt = e.rank + '*'; rankFont = '400 ' + P(13) + "px 'DM Sans',sans-serif"; }
            else { rankTxt = String(e.rank); rankFont = '600 ' + P(15) + "px 'DM Sans',sans-serif"; }
            ctx.font = rankFont; ctx.fillText(rankTxt, P(M + cleft[0] + cwid[0] / 2), midY);
            // 届次
            ctx.fillStyle = sh ? bvCssVar('--clr-text-4') : (bvCssVar('--clr-board-light') || '#8fb8d8'); ctx.font = P(13) + "px 'DM Sans',sans-serif"; ctx.textAlign = 'center';
            ctx.fillText('第 ' + e.edition_no + ' 届', P(M + cleft[1] + cwid[1] / 2), midY);
            // 场次
            ctx.fillStyle = t3; ctx.fillText(/^[0-9]+$/.test(String(e.series)) ? '-' : String(e.series), P(M + cleft[2] + cwid[2] / 2), midY);
            // 歌手
            ctx.fillStyle = def; ctx.textAlign = 'left'; ctx.font = P(13) + "px 'DM Sans',sans-serif";
            ctx.fillText(clip(e.artist, cArt - 16), P(M + cleft[3] + 10), midY);
            // 歌名 + 标签
            var songT = clip(e.song, cSong - 96); ctx.fillStyle = def; ctx.fillText(songT, P(M + cleft[4] + 8), midY);
            var tx = P(M + cleft[4] + 8) + ctx.measureText(songT).width + P(6);
            if (e.joint) tx = tag('合报', t3, tx, midY);
            if (e.persona && e.persona !== '匿名') tx = tag(e.persona, bvCssVar('--clr-violet-light') || '#c084fc', tx, midY);
            if (e.is_shadow) tx = tag('混淆', bvCssVar('--clr-text-4') || '#6a6488', tx, midY);
            if (e.canceled) tx = tag('取消', bvCssVar('--clr-text-4') || '#6a6488', tx, midY);
            // 总分
            ctx.fillStyle = def; ctx.textAlign = 'center'; ctx.font = P(13) + "px 'DM Sans',sans-serif";
            ctx.fillText(e.total == null ? '—' : String(Math.round(e.total)), P(M + cleft[5] + cwid[5] / 2), midY);
            // 12分
            ctx.fillStyle = t3; ctx.fillText(e.canceled ? '—' : String(e.twelve || 0), P(M + cleft[6] + cwid[6] / 2), midY);
          });
        }
        // ── 品牌脚 ──
        bvDrawBrand(ctx, P(M), P(footMid), SC, logo);
        t.free();
        cv.toBlob(function (blob) { if (blob) bvShareOrDownload(blob, withTable ? '完整记录' : '走势'); restore(); }, 'image/png');
      });
    }).catch(restore);
  }

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
    function dim0(val, color) { return val === 0 ? DIM : (color || ''); }
    function f2(v) { return v == null ? '—' : Number(v).toFixed(2); }  // 两位小数；空值→—
    // 8 张卡（仅统计正式单曲，不含混淆）：A 组（前 4）名次/分数维度，B 组（后 4）场次计数维度
    var stats = [
      // A 组
      { v: (bestN == null ? '—' : bestN), rep: (bestRep > 1 ? bestRep : 0), k: '最佳名次', color: bestColor },
      { v: f2(ov.avg), k: '平均名次', color: (ov.avg == null ? DIM : '') },
      { v: ov.twelve, k: '12 分次数', color: dim0(ov.twelve) },
      { v: f2(ov.jury_avg), k: 'Jury 均分', color: (ov.jury_avg == null ? DIM : '') },
      // B 组：主数字为正式曲数，混淆曲用括号 (n) 单独标注（不并入主数）
      { v: ov.top1, sh: ov.top1_shadow, k: '冠军场数', color: dim0(ov.top1, ov.top1 > 0 ? 'var(--clr-gold-light)' : '') },
      { v: ov.top3, sh: ov.top3_shadow, k: '前三场数', color: dim0(ov.top3) },
      { v: ov.top10, sh: ov.top10_shadow, k: '前十场数', color: dim0(ov.top10) },
      { v: ov.entries, sh: ov.shadow, k: '参与场数', color: dim0(ov.entries) }
    ];
    var statsHtml = stats.map(function (s) {
      var rep = s.rep ? '<span class="mp-bv-rep">(' + s.rep + ')</span>' : '';
      var vStyle = s.color ? ' style="color:' + s.color + '"' : '';
      var vCls = /[一-鿿]/.test(String(s.v)) ? ' mp-bv-stat__v--cjk' : '';
      return '<div class="mp-bv-stat' + (s.active ? ' mp-bv-stat--active' : '') + '">' +
        '<div class="mp-bv-stat__v' + vCls + '"' + vStyle + '>' + s.v + (s.sh ? shadow(s.sh) : '') + rep + '</div>' +
        '<div class="mp-bv-stat__k">' + s.k + '</div></div>';
    }).join('');
    var rows = renderBvRows(sortBvEntries(bv.entries, 'edition', 'desc').slice(0, 10));  // 默认年份从新到旧、先展示前十
    var TRI = '<svg class="mp-bv-tri" viewBox="0 0 10 14" aria-hidden="true"><path class="up" d="M5 0L9 5H1Z"/><path class="dn" d="M5 14L1 9H9Z"/></svg>';
    var unclaimed = arguments[1];
    var label = 'Barvision';
    var title = unclaimed ? '匿名参赛歌曲' : '吧视参赛记录';
    var hasTrend = !unclaimed && (bv.entries || []).some(function (e) { return e.rank != null; });
    function expBtn(exp, lab) {
      return '<button type="button" class="mp-bv-export" data-exp="' + exp + '" aria-label="' + lab + '为图片">' +
        '<svg viewBox="0 0 16 16" width="13" height="13" aria-hidden="true"><path d="M8 1.5v8m0 0L4.8 6.3M8 9.5l3.2-3.2M2.5 13.5h11" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
        '<span>' + lab + '</span></button>';
    }
    var exportBar = hasTrend ? '<span class="mp-bv-exports">' + expBtn('card', '导出走势图') + expBtn('full', '导出完整记录') + '</span>' : '';
    var topBlock = unclaimed
      ? '<p class="mp-bv-note fade-up" style="transition-delay:.2s">以下参赛歌曲在比赛结束后始终无人认领选送者，统一归档于此。</p>'
      : '<div class="mp-bv-stats fade-up" style="transition-delay:.2s">' + statsHtml + '</div>';
    return '<section class="mp-section" id="mp-sec-bv">' +
      '<div class="section__inner">' +
        '<div class="mp-section-label fade-up" style="transition-delay:.05s;font-family:var(--font-body);font-weight:700">' + label + '</div>' +
        '<div class="mp-bv-titlebar fade-up" style="transition-delay:.15s"><span class="mp-section-title">' + title + '</span>' + exportBar + '</div>' +
        topBlock +
        '<div class="mp-bv-tw fade-up" style="transition-delay:.25s"><table class="mp-bv-tbl"><thead><tr>' +
          '<th class="sortable ta-c" data-sort="rank">名次' + TRI + '</th><th class="sortable ta-c" data-sort="edition">届次' + TRI + '</th><th class="ta-c">场次</th><th>歌手</th><th>歌名</th><th class="sortable ta-c" data-sort="total">总分' + TRI + '</th><th class="sortable ta-c" data-sort="twelve">12分' + TRI + '</th>' +
        '</tr></thead><tbody>' + rows + '</tbody></table></div>' +
        ((bv.entries || []).length > 10 ? '<div class="mp-an-more-wrap fade-up" style="transition-delay:.27s"><button type="button" class="mp-an-more" id="mpBvMore" aria-label="展开全部"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 7l5 5 5-5"/><path d="M7 13l5 5 5-5"/></svg></button></div>' : '') +
        '<p class="mp-bv-legend fade-up" style="transition-delay:.28s">注：<code>A</code> 小众 · <code>B</code> 中众 · <code>C</code> 大众 · <code>SF</code> 半决赛 · <code>GF</code> 决赛 · <code>E</code> 娱乐版<span class="mp-bv-legend__ex">（如 <code>7A</code> = 第 7 届小众组）</span></p>' +
        (unclaimed ? '' : bvTrend(bv)) +
      '</div>' +
    '</section>';
  }

  /* 表格高度平滑动画：调用前先记录 startH，改变内容（行数）后调用，从 startH 过渡到新高度 */
  function animateTwHeight(tw, startH) {
    if (!tw || tw._animating) return;
    var endH = tw.offsetHeight;
    tw._animating = true;
    tw.style.overflow = 'hidden';
    tw.style.height = startH + 'px';
    void tw.offsetHeight;  // 强制回流锁定起始高度
    tw.style.transition = 'height .3s ease';
    tw.style.height = endH + 'px';
    var timer;
    var done = function () {
      if (done._d) return; done._d = true;
      clearTimeout(timer);
      tw.removeEventListener('transitionend', done);
      tw.style.transition = ''; tw.style.height = ''; tw.style.overflow = '';
      tw._animating = false;
    };
    tw.addEventListener('transitionend', done);
    timer = setTimeout(done, 380);  // 兜底
  }

  /* 个人榜前十：歌手列左缘对齐「吧视表歌名列」左缘（无吧视表时回退＝对齐居中下拉按钮 表宽/2−27）。
     fixed 布局下 calc% 不可靠，故 JS 直接设 px 列宽；随 resize 更新 */
  function alignAnCols() {
    var bvSong = document.querySelector('.mp-bv-tbl thead th:nth-child(5)');  // 吧视歌名列（名次/届次/场次/歌手/歌名…）
    var songLeft = bvSong ? bvSong.getBoundingClientRect().left : null;
    Array.prototype.forEach.call(document.querySelectorAll('#mp-sec-annual .mp-an-block .mp-an-tbl'), function (tbl) {
      var w = tbl.offsetWidth;
      if (!w) return;
      var th3 = tbl.querySelector('thead th:nth-child(3)');
      if (!th3) return;
      var col3 = (songLeft != null)
        ? Math.round(w - (songLeft - tbl.getBoundingClientRect().left))  // 歌手列左缘 = 吧视歌名列左缘
        : Math.round(w / 2 + 27);                                         // 回退：对齐居中下拉按钮
      th3.style.width = col3 + 'px';
    });
  }

  /* ── 个人年榜 板块（BARCHARTS）── */
  function annualSection(annual) {
    var years = Object.keys(annual).sort(function (a, b) { return b - a; });  // 年份降序
    if (!years.length) return '';
    var TIERS = [['t10', '前10'], ['t20', '前20'], ['t50', '前50'], ['t100', '前100'], ['t200', '前200']];
    // ① 个人助攻数表格（行=年份，列=前10/20/50/100/200，累计）
    var assistHead = '<th>年份</th>' + TIERS.map(function (t) { return '<th class="ta-c">' + t[1] + '</th>'; }).join('');
    var assistRows = years.map(function (y) {
      var a = annual[y].assists || {}, sh = annual[y].assists_shadow || {};  // 主数=占位曲；括号=亚洲不占位曲
      return '<tr><td class="yr">' + y + '</td>' + TIERS.map(function (t) {
        return '<td class="num">' + (a[t[0]] || 0) + (sh[t[0]] ? '<span class="mp-an-sh">(' + sh[t[0]] + ')</span>' : '') + '</td>';
      }).join('') + '</tr>';
    }).join('');
    var assistTable = '<div class="mp-an-tw fade-up" style="transition-delay:.28s"><table class="mp-an-tbl mp-an-assist">' +
      '<thead><tr>' + assistHead + '</tr></thead><tbody>' + assistRows + '</tbody></table></div>';
    // ② 各年个人榜前十表格（歌名在前 prominent、歌手在后 secondary；默认只展示前三，点击展开前十）
    var TOP_INIT = 3;
    var topBlocks = years.map(function (y, yi) {
      var list = (annual[y].top10 || []).slice(0, 10);
      if (!list.length) return '';
      var rows = list.map(function (e, i) {
        var medal = e.rank <= 3 ? ' mp-an-row--' + e.rank : '';
        var extra = i >= TOP_INIT ? ' mp-an-extra' : '';
        var cov = e.cover
          ? '<img class="an-cover" src="' + esc(e.cover) + '" alt="" loading="lazy" onerror="this.style.visibility=\'hidden\'">'
          : '<span class="an-cover an-cover--ph"></span>';
        return '<tr class="' + (medal + extra).trim() + '"><td class="rk">' + e.rank + '</td>' +
          '<td class="an-name"><span class="an-name-in">' + cov + '<span class="an-title">' + esc(e.song) + '</span></span></td>' +
          '<td class="an-artist">' + esc(e.artist) + '</td></tr>';
      }).join('');
      var more = list.length > TOP_INIT
        ? '<div class="mp-an-more-wrap"><button type="button" class="mp-an-more" data-collapse aria-label="展开前十">' +
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 7l5 5 5-5"/><path d="M7 13l5 5 5-5"/></svg></button></div>' : '';
      return '<div class="mp-an-block is-collapsed fade-up" style="transition-delay:' + (0.34 + yi * 0.06).toFixed(2) + 's">' +
        '<div class="mp-an-subtitle"><span class="an-yr">' + y + '</span>年 个人榜 Top 10</div>' +
        '<div class="mp-an-tw"><table class="mp-an-tbl"><thead><tr><th class="ta-c">名次</th><th>歌名</th><th>歌手</th></tr></thead><tbody>' + rows + '</tbody></table></div>' +
        more +
      '</div>';
    }).join('');
    return '<section class="mp-section" id="mp-sec-annual">' +
      '<div class="section__inner">' +
        '<div class="mp-section-label fade-up" style="transition-delay:.05s;font-family:var(--font-body);font-weight:700">BARCHARTS</div>' +
        '<div class="mp-section-title fade-up" style="transition-delay:.15s">个人年榜</div>' +
        '<div class="mp-an-h fade-up" style="transition-delay:.2s">吧年榜助攻详情</div>' +
        assistTable +
        '<p class="mp-bv-legend fade-up" style="transition-delay:.3s">注：括号内数字为助攻的非占位亚洲单曲数</p>' +
        topBlocks +
      '</div>' +
    '</section>';
  }

  /* ── 页内目录（Notion 风格，同吧视详情页）── */
  function buildMemberTOC(items) {
    var nav = document.createElement('nav');
    nav.className = 'mp-toc';
    nav.setAttribute('aria-label', '页内目录');
    var ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 6h12M8 12h12M8 18h12"/><circle cx="4" cy="6" r="1"/><circle cx="4" cy="12" r="1"/><circle cx="4" cy="18" r="1"/></svg>';
    nav.innerHTML = '<div class="mp-toc__list">' + items.map(function (it) {
      return '<div class="mp-toc__item" data-target="' + it.id + '"><span class="mp-toc__dash"></span><span class="mp-toc__label">' + esc(it.label) + '</span></div>';
    }).join('') + '</div><button class="mp-toc__toggle" type="button" aria-label="页内目录">' + ICON + '</button>';
    document.body.appendChild(nav);
    var toggle = nav.querySelector('.mp-toc__toggle');
    toggle.addEventListener('click', function (e) { e.stopPropagation(); nav.classList.toggle('mp-toc--open'); });
    document.addEventListener('click', function (e) { if (!nav.contains(e.target)) nav.classList.remove('mp-toc--open'); });
    var els = Array.prototype.slice.call(nav.querySelectorAll('.mp-toc__item'));
    var navH = 72, suppress = false, timer = null;
    function updateVisible() { nav.classList.toggle('mp-toc--visible', window.scrollY > 300); }
    updateVisible();
    window.addEventListener('scroll', function () {
      updateVisible();
      if (suppress) { clearTimeout(timer); timer = setTimeout(function () { suppress = false; }, 200); }
    }, { passive: true });
    var obs = new IntersectionObserver(function (entries) {
      if (suppress) return;
      entries.forEach(function (e) {
        if (e.isIntersecting) els.forEach(function (it) { it.classList.toggle('mp-toc__item--active', it.dataset.target === e.target.id); });
      });
    }, { rootMargin: '-' + navH + 'px 0px -55% 0px' });
    els.forEach(function (it) {
      var t = document.getElementById(it.dataset.target);
      if (t) obs.observe(t);
      it.addEventListener('click', function () {
        var tt = document.getElementById(it.dataset.target);
        if (!tt) return;
        nav.classList.remove('mp-toc--open');
        suppress = true; clearTimeout(timer);
        els.forEach(function (x) { x.classList.toggle('mp-toc__item--active', x === it); });
        window.scrollTo({ top: tt.getBoundingClientRect().top + window.scrollY - navH + 2, behavior: 'smooth' });
      });
    });
  }

  /* ── Render ── */
  var root = document.getElementById('mp-root');
  if (!root) return;

  // 未认领伪成员：大名弱化、无头像/标签/外链；否则正常 hero
  // 届徽章 = 往届赛果徽章 + 第 16 届徽章（已报名/办海选第 16 届者，即便暂无赛果）
  var bvBadgeHtml = (d.barvision ? bvBadges(d.barvision) : '') + (d.bv2026 ? oneBadge(16, 2026) : '');
  var heroHtml = d.unclaimed
    ? '<section class="mp-hero mp-hero--unclaimed">' +
        '<div class="mp-hero__inner section__inner">' +
          '<a class="mp-eyebrow fade-up" href="/member/"><span>←</span><span>Members</span></a>' +
          '<div class="mp-card fade-up"><div class="mp-info">' +
            '<div class="mp-nickname mp-nickname--unclaimed">匿名</div>' +
            '<div class="mp-handle">参赛歌曲匿名选送者</div>' +
          '</div></div>' +
        '</div>' +
      '</section>'
    : '<section class="mp-hero">' +
        '<div class="mp-hero__glow" aria-hidden="true"></div>' +
        '<div class="mp-hero__inner section__inner">' +
          '<a class="mp-eyebrow fade-up" href="/member/"><span>←</span><span>Members</span></a>' +
          '<div class="mp-card fade-up">' +
            '<div style="position:relative;display:inline-block;margin-top:8px">' +
              '<div class="mp-avatar__ring" style="position:absolute;inset:-3px;border-radius:50%;background:linear-gradient(135deg,var(--clr-violet),var(--clr-accent));opacity:.5;z-index:0"></div>' +
              '<div class="mp-avatar">' +
                '<div class="mp-avatar__placeholder" style="' + phStyle + '">' + ph + '</div>' +
              '</div>' +
            '</div>' +
            '<div class="mp-info">' +
              '<div class="mp-nickname"><span class="mp-nickname__name">' + nickname + '</span>' + (handle ? '<span class="mp-handle">@' + handle + '</span>' : '') + (bvBadgeHtml ? '<span class="mp-bv-badges">' + bvBadgeHtml + '</span>' : '') + '</div>' +
              (badges ? '<div class="mp-tags">' + badges + '</div>' : '') +
            '</div>' +
            (links ? '<div class="mp-links">' + links + '</div>' : '') +
          '</div>' +
        '</div>' +
      '</section>';

  var annualHtml = (d.annual && !d.unclaimed) ? annualSection(d.annual) : '';
  root.innerHTML = heroHtml +
    (d.barvision ? bvSection(d.barvision, d.unclaimed) :
      (annualHtml ? '' :
      '<section class="mp-section">' +
        '<div class="section__inner">' +
          '<div class="mp-section-label fade-up" style="transition-delay:.05s;font-family:var(--font-body);font-weight:700">UPDATES</div>' +
          '<div class="mp-section-title fade-up" style="transition-delay:.15s">最近动态</div>' +
          '<div class="mp-works-grid fade-up" style="transition-delay:.25s">' +
            '<div class="mp-todo">暂无动态</div>' +
          '</div>' +
        '</div>' +
      '</section>')) +
    annualHtml;

  // 个人榜前十：折叠（前三 ↔ 前十）——平滑高度动画，就地展开、不移动视口
  Array.prototype.forEach.call(document.querySelectorAll('.mp-an-block [data-collapse]'), function (btn) {
    btn.addEventListener('click', function () {
      var block = btn.closest('.mp-an-block');
      var tw = block.querySelector('.mp-an-tw');
      if (tw._animating) return;
      var willExpand = block.classList.contains('is-collapsed');
      var startH = tw.offsetHeight;
      // 量目标高度（切到目标态测量）
      if (willExpand) block.classList.remove('is-collapsed'); else block.classList.add('is-collapsed');
      var endH = tw.offsetHeight;
      if (!willExpand) block.classList.remove('is-collapsed');  // 收起：先恢复显示以便动画，结束再隐藏
      tw._animating = true;
      tw.style.overflow = 'hidden';
      tw.style.height = startH + 'px';
      void tw.offsetHeight;  // 强制回流，锁定起始高度
      tw.style.transition = 'height .3s ease';
      tw.style.height = endH + 'px';
      btn.classList.toggle('is-open', willExpand);
      btn.setAttribute('aria-label', willExpand ? '收起' : '展开前十');
      var timer;
      var done = function () {
        if (done._d) return; done._d = true;              // 去重（transitionend + 超时兜底）
        clearTimeout(timer);
        tw.removeEventListener('transitionend', done);
        tw.style.transition = ''; tw.style.height = ''; tw.style.overflow = '';
        if (!willExpand) block.classList.add('is-collapsed');  // 收起动画结束后真正隐藏额外行
        tw._animating = false;
      };
      tw.addEventListener('transitionend', done);
      timer = setTimeout(done, 380);  // 兜底：transitionend 未触发（如动画被禁用）也能收尾
    });
  });

  // 个人榜前十歌手列对齐居中下拉按钮（初始 + resize）
  if (d.annual && !d.unclaimed) {
    alignAnCols();
    var _anrt;
    window.addEventListener('resize', function () { clearTimeout(_anrt); _anrt = setTimeout(alignAnCols, 120); });
  }

  // 页内目录（存在多个板块时才建；样式同吧视详情页）
  if (!d.unclaimed) {
    var tocItems = [];
    if (d.barvision) tocItems.push({ id: 'mp-sec-bv', label: '吧视参赛记录' });
    if (d.annual) tocItems.push({ id: 'mp-sec-annual', label: '个人年榜' });
    if (tocItems.length >= 2) buildMemberTOC(tocItems);
  }

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
      var bvDefDir = { rank: 'asc', edition: 'desc', total: 'desc', twelve: 'desc' };
      var bvCur = { key: 'edition', dir: 'desc' };  // 默认年份从新到旧
      var BV_INIT = 10, bvCollapsed = true;
      var bvMore = document.getElementById('mpBvMore');
      var bvApply = function () {
        var arr = sortBvEntries(bvData, bvCur.key, bvCur.dir);
        var show = (bvCollapsed && arr.length > BV_INIT) ? arr.slice(0, BV_INIT) : arr;
        bvBody.innerHTML = renderBvRows(show);
        bvTable.querySelectorAll('th.sortable').forEach(function (th) {
          th.classList.remove('is-asc', 'is-desc');
          if (th.dataset.sort === bvCur.key) th.classList.add(bvCur.dir === 'asc' ? 'is-asc' : 'is-desc');
        });
        if (bvMore) { bvMore.classList.toggle('is-open', !bvCollapsed); bvMore.setAttribute('aria-label', bvCollapsed ? ('展开全部 ' + arr.length + ' 项') : '收起'); }
      };
      if (bvMore) bvMore.addEventListener('click', function () {
        var tw = bvTable.closest('.mp-bv-tw');
        if (tw && tw._animating) return;
        var startH = tw ? tw.offsetHeight : 0;
        bvCollapsed = !bvCollapsed; bvApply();
        animateTwHeight(tw, startH);
      });
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
    Array.prototype.forEach.call(document.querySelectorAll('.mp-bv-export'), function (b) {
      b.addEventListener('click', function () {
        if (b.dataset.exp === 'card') exportBvCardPng(b, false);
        else if (b.dataset.exp === 'full') exportBvCardPng(b, true);
        else exportBvTrendPng(b);
      });
    });
    var _bvtt;
    window.addEventListener('resize', function () { clearTimeout(_bvtt); _bvtt = setTimeout(drawBvTrend, 150); });
  }
})();
