(function () {
  'use strict';

  /* ── CSS ── */
  var css = [
    '.mp-hero{padding:calc(var(--nav-h) + 56px) 0 64px;position:relative;overflow:hidden}',
    '.mp-hero__glow{position:absolute;inset:0;background:radial-gradient(ellipse 70% 60% at 30% 0%,rgba(168,85,247,.18) 0%,transparent 60%),radial-gradient(ellipse 50% 40% at 80% 80%,rgba(0,180,255,.07) 0%,transparent 55%);pointer-events:none}',
    '.mp-hero__inner{position:relative;z-index:1}',
    '.breadcrumb{font-size:12px;color:var(--clr-text-3);display:flex;align-items:center;gap:6px;margin-bottom:40px}',
    '.breadcrumb a{color:var(--clr-text-3);transition:color .2s}',
    '.breadcrumb a:hover{color:var(--clr-text-2)}',
    '.breadcrumb__sep{opacity:.35}',
    '.mp-card{display:grid;grid-template-columns:auto 1fr auto;gap:40px;align-items:start}',
    '.mp-avatar{width:120px;height:120px;border-radius:50%;overflow:hidden;border:2px solid var(--clr-border-2);background:var(--clr-surface-2);flex-shrink:0;position:relative}',
    '.mp-avatar img{width:100%;height:100%;object-fit:cover;display:block}',
    '.mp-avatar__placeholder{width:100%;height:100%;display:flex;align-items:center;justify-content:center;color:var(--clr-violet-light);background:linear-gradient(135deg,var(--clr-surface) 0%,var(--clr-surface-2) 100%);letter-spacing:0}',
    '.mp-avatar__ring{position:absolute;inset:-3px;border-radius:50%;background:linear-gradient(135deg,var(--clr-violet),var(--clr-accent));z-index:-1;opacity:.6}',
    '.mp-info{padding-top:8px}',
    '.mp-nickname{font-family:var(--font-display);font-size:48px;line-height:1;color:var(--clr-text);letter-spacing:.04em;margin-bottom:6px}',
    '.mp-handle{font-size:15px;color:var(--clr-text-2);margin-bottom:20px}',
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
    '.mp-bv-stat{background:var(--clr-surface);border:1px solid var(--clr-border);border-radius:8px;padding:13px 10px;text-align:center}',
    '.mp-bv-stat__v{font-family:var(--font-display);font-size:26px;line-height:1;color:var(--clr-text)}',
    '.mp-bv-stat__v .sh{font-family:var(--font-body);font-size:13px;color:var(--clr-text-3);margin-left:1px}',
    '.mp-bv-stat__k{font-size:11px;color:var(--clr-text-2);margin-top:7px}',
    '.mp-bv-stat--active .mp-bv-stat__v{color:var(--clr-violet-light)}',
    '.mp-bv-tw{overflow-x:auto;border:1px solid var(--clr-border);border-radius:8px;scrollbar-width:none}',
    '.mp-bv-tw::-webkit-scrollbar{display:none}',
    'table.mp-bv-tbl{width:100%;border-collapse:collapse;font-size:13px;min-width:460px}',
    '.mp-bv-tbl th{font-size:11px;font-weight:700;letter-spacing:.05em;text-transform:uppercase;color:var(--clr-text-2);text-align:left;padding:10px 12px;background:var(--clr-surface);border-bottom:1px solid var(--clr-border-2);white-space:nowrap}',
    '.mp-bv-tbl td{padding:9px 12px;border-bottom:1px solid var(--clr-border);vertical-align:middle;white-space:nowrap}',
    '.mp-bv-tbl tr:last-child td{border-bottom:none}',
    '.mp-bv-tbl .rk{font-family:var(--font-display);font-size:18px;line-height:1;color:var(--clr-text-3);text-align:center;width:42px}',
    '.mp-bv-tbl .num2{font-family:var(--font-body);text-align:center;color:var(--clr-text)}',
    '.mp-bv-tbl .song{color:var(--clr-text);white-space:normal}',
    '.mp-bv-tbl .artist{color:var(--clr-text-2);white-space:normal}',
    '.mp-bv-ed{color:var(--clr-board-light);text-decoration:none}',
    '.mp-bv-ed:hover{color:var(--clr-violet-light)}',
    '.mp-bv-row--1 .rk{color:var(--clr-gold-light)}',
    '.mp-bv-row--2 .rk{color:var(--clr-silver)}',
    '.mp-bv-row--3 .rk{color:var(--clr-bronze)}',
    '.mp-bv-row--shadow td{color:var(--clr-text-3);font-style:italic;background:rgba(255,255,255,.02)}',
    '.mp-bv-sh{font-size:9px;border:1px solid var(--clr-border-2);border-radius:2px;padding:0 4px;font-style:normal;color:var(--clr-text-3);margin-left:5px}',
    '@media (max-width:600px){',
    '  .mp-card{grid-template-columns:auto 1fr;gap:24px;grid-template-rows:auto auto}',
    '  .mp-links{grid-column:1/-1;flex-direction:row}',
    '  .mp-link{flex:1}',
    '  .mp-avatar{width:96px;height:96px}',
    '  .mp-avatar__placeholder{font-size:38px !important}',
    '  .mp-nickname{font-size:36px}',
    '}'
  ].join('\n');

  var styleEl = document.createElement('style');
  styleEl.textContent = css;
  document.head.appendChild(styleEl);

  /* ── Icons ── */
  var BILI_SVG = '<svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" style="display:block;flex-shrink:0" aria-hidden="true"><path d="M17.813 4.653h.854c1.51.054 2.769.578 3.773 1.574 1.004.995 1.524 2.249 1.56 3.76v7.36c-.036 1.51-.556 2.769-1.56 3.773s-2.262 1.524-3.773 1.56H5.333c-1.51-.036-2.769-.556-3.773-1.56S.036 18.858 0 17.347v-7.36c.036-1.511.556-2.765 1.56-3.76 1.004-.996 2.262-1.52 3.773-1.574h.774l-1.174-1.12a1.234 1.234 0 0 1-.373-.906c0-.356.124-.658.373-.907l.027-.027c.267-.249.573-.373.92-.373.347 0 .653.124.92.373L9.653 4.44c.071.071.134.142.187.213h4.267a.836.836 0 0 1 .16-.213l2.853-2.747c.267-.249.573-.373.92-.373.347 0 .662.151.929.4.267.249.391.551.391.907 0 .355-.124.657-.373.906zM5.333 7.24c-.746.018-1.373.276-1.88.773-.506.498-.769 1.13-.786 1.894v7.52c.017.764.28 1.395.786 1.893.507.498 1.134.756 1.88.773h13.334c.746-.017 1.373-.275 1.88-.773.506-.498.769-1.129.786-1.893v-7.52c-.017-.765-.28-1.396-.786-1.894-.507-.497-1.134-.755-1.88-.773zM8 11.107c.373 0 .684.124.933.373.25.249.383.569.4.96v1.173c-.017.391-.15.711-.4.96-.249.25-.56.374-.933.374s-.684-.125-.933-.374c-.25-.249-.383-.569-.4-.96V12.44c0-.373.129-.689.386-.947.258-.257.574-.386.947-.386zm8 0c.373 0 .684.124.933.373.25.249.383.569.4.96v1.173c-.017.391-.15.711-.4.96-.249.25-.56.374-.933.374s-.684-.125-.933-.374c-.25-.249-.383-.569-.4-.96V12.44c.017-.391.15-.711.4-.96.249-.249.56-.373.933-.373z"/></svg>';

  var MT_SVG = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="display:block;flex-shrink:0" aria-hidden="true"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>';

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
  function bvSection(bv) {
    var ov = bv.overview;
    function shadow(n) { return n ? '<span class="sh">(' + n + ')</span>' : ''; }
    var stats = [
      { v: (ov.best == null ? '—' : ov.best), k: '最好名次' },
      { v: ov.top1, sh: ov.top1_shadow, k: '夺冠场数' },
      { v: ov.top3, sh: ov.top3_shadow, k: '前三场数' },
      { v: ov.entries, sh: ov.shadow, k: '参加场数' },
      { v: ov.twelve, k: '12 分次数' },
      { v: '第' + ov.debut + '届', k: '首次参赛' },
      { v: '第' + ov.active_in + '届', k: '最近参赛', active: ov.active }
    ];
    var statsHtml = stats.map(function (s) {
      return '<div class="mp-bv-stat' + (s.active ? ' mp-bv-stat--active' : '') + '">' +
        '<div class="mp-bv-stat__v">' + s.v + (s.sh ? shadow(s.sh) : '') + '</div>' +
        '<div class="mp-bv-stat__k">' + s.k + '</div></div>';
    }).join('');
    var rows = bv.entries.map(function (e) {
      var cls = e.is_shadow ? 'mp-bv-row--shadow' : (e.rank && e.rank <= 3 ? 'mp-bv-row--' + e.rank : '');
      var nn = e.edition_no < 10 ? '0' + e.edition_no : e.edition_no;
      var href = '../barvision/' + e.year + '/' + e.version + '-' + nn + '.html';
      return '<tr class="' + cls + '">' +
        '<td class="rk">' + (e.is_shadow ? '·' : (e.rank == null ? '—' : e.rank)) + '</td>' +
        '<td><a class="mp-bv-ed" href="' + href + '">第' + e.edition_no + '届</a></td>' +
        '<td class="num2">' + esc(e.series) + '</td>' +
        '<td class="song">' + esc(e.song) + (e.is_shadow ? '<span class="mp-bv-sh">混淆</span>' : '') + '</td>' +
        '<td class="artist">' + esc(e.artist) + '</td>' +
        '<td class="num2">' + (e.total == null ? '—' : e.total) + '</td>' +
        '<td class="num2">' + (e.twelve ? e.twelve : '—') + '</td>' +
        '</tr>';
    }).join('');
    return '<section class="mp-section">' +
      '<div class="section__inner">' +
        '<div class="mp-section-label fade-up" style="transition-delay:.05s">Barvision</div>' +
        '<div class="mp-section-title fade-up" style="transition-delay:.15s">吧视参赛记录</div>' +
        '<div class="mp-bv-stats fade-up" style="transition-delay:.2s">' + statsHtml + '</div>' +
        '<div class="mp-bv-tw fade-up" style="transition-delay:.25s"><table class="mp-bv-tbl"><thead><tr>' +
          '<th>名次</th><th>届次</th><th>场次</th><th>歌名</th><th>歌手</th><th>总分</th><th>12分</th>' +
        '</tr></thead><tbody>' + rows + '</tbody></table></div>' +
      '</div>' +
    '</section>';
  }

  /* ── Render ── */
  var root = document.getElementById('mp-root');
  if (!root) return;

  root.innerHTML =
    '<section class="mp-hero">' +
      '<div class="mp-hero__glow" aria-hidden="true"></div>' +
      '<div class="mp-hero__inner section__inner">' +
        '<nav class="breadcrumb" aria-label="导航路径">' +
          '<a href="/">Barboard</a>' +
          '<span class="breadcrumb__sep">/</span>' +
          '<a href="/member.html">Members</a>' +
          '<span class="breadcrumb__sep">/</span>' +
          '<span>' + nickname + '</span>' +
        '</nav>' +
        '<div class="mp-card fade-up">' +
          '<div style="position:relative;display:inline-block;margin-top:8px">' +
            '<div class="mp-avatar__ring" style="position:absolute;inset:-3px;border-radius:50%;background:linear-gradient(135deg,var(--clr-violet),var(--clr-accent));opacity:.5;z-index:0"></div>' +
            '<div class="mp-avatar">' +
              '<div class="mp-avatar__placeholder" style="' + phStyle + '">' + ph + '</div>' +
            '</div>' +
          '</div>' +
          '<div class="mp-info">' +
            '<div class="mp-nickname">' + nickname + '</div>' +
            (handle ? '<div class="mp-handle">@' + handle + '</div>' : '') +
            (badges ? '<div class="mp-tags">' + badges + '</div>' : '') +
          '</div>' +
          (links ? '<div class="mp-links">' + links + '</div>' : '') +
        '</div>' +
      '</div>' +
    '</section>' +
    (d.barvision ? bvSection(d.barvision) :
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
})();
