(function () {
  'use strict';

  /* ══════════════════════════════════════════════════════════════════════════
     DEV GATE ─ 开发期密码保护
     上线时将 DEV_GATE 改为 false 即可完全关闭，无需删除任何代码
     ══════════════════════════════════════════════════════════════════════════ */
  var DEV_GATE = false;
  var DEV_PASS  = 'waitaminute';

  /* 若守门已关 或 本 session 已通过 → 立即还原 <html> 可见性（配合各页面 head 内联脚本） */
  if (!DEV_GATE || sessionStorage.getItem('barboard_dev') === '1') {
    document.documentElement.style.visibility = '';
  }

  /* ── Shared HTML ─────────────────────────────────────────────────────────
     修改 nav 或 footer 样式时，在此处统一编辑，所有页面自动生效。
     同步更新 partials/nav.html 和 partials/footer.html 作为可读备份。
  ──────────────────────────────────────────────────────────────────────── */
  var NAV_HTML = [
    '<nav class="nav" id="nav">',
    '  <div class="nav__inner">',
    '    <a href="/" class="nav__logo"><img src="/assets/images/logo_center.png" alt="" class="nav__logo-img" aria-hidden="true" /><span>BAR<span class="nav__logo-board">BOARD</span></span></a>',
    '    <ul class="nav__links">',
    '      <li><a href="/barvision.html">Barvision</a></li>',
    '      <li><a href="/bbl.html">BarboardLab</a></li>',
    '      <li><a href="/archive.html">Archive</a></li>',
    '      <li><a href="/member.html">Members</a></li>',
    '      <li><a href="https://musictrack.cn" target="_blank" rel="noopener">Musictrack<svg class="ext-icon" xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 10 10" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2 8L8 2M8 2H4M8 2v4"/></svg></a></li>',
    '      <li><a href="/barvision/2026/events.html" class="nav__cta"><span class="nav__cta-title">Barvision 2026</span><span class="nav__cta-sub">歌曲报名</span></a></li>',
    '    </ul>',
    '    <button class="nav__menu-btn" id="navMenuBtn" aria-label="打开菜单" aria-expanded="false">',
    '      <svg class="icon-menu" width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true"><line x1="3" y1="6" x2="19" y2="6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><line x1="3" y1="11" x2="19" y2="11" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><line x1="3" y1="16" x2="19" y2="16" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>',
    '      <svg class="icon-close" width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true"><line x1="4" y1="4" x2="18" y2="18" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><line x1="18" y1="4" x2="4" y2="18" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>',
    '    </button>',
    '  </div>',
    '  <div class="nav__drawer" id="navDrawer" aria-hidden="true">',
    '    <ul class="nav__drawer-links">',
    '      <li><a href="/barvision.html">Barvision</a></li>',
    '      <li><a href="/bbl.html">BarboardLab</a></li>',
    '      <li><a href="/archive.html">Archive</a></li>',
    '      <li><a href="/member.html">Members</a></li>',
    '      <li><a href="https://musictrack.cn" target="_blank" rel="noopener">Musictrack<svg class="ext-icon" xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 10 10" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2 8L8 2M8 2H4M8 2v4"/></svg></a></li>',
    '      <li><a href="/barvision/2026/events.html" class="nav__cta"><span class="nav__cta-title">Barvision 2026</span><span class="nav__cta-sub">歌曲报名</span></a></li>',
    '    </ul>',
    '  </div>',
    '</nav>',
    '<button class="back-to-top" id="backToTop" aria-label="返回顶部">',
    '  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 10L8 5L13 10"/></svg>',
    '</button>'
  ].join('\n');

  var FOOTER_HTML = [
    '<footer class="footer">',
    '  <div class="section__inner">',
    '    <div class="footer__grid">',
    '      <div>',
    '        <a href="/" class="nav__logo footer__logo"><img src="/assets/images/logo_center.png" alt="" class="nav__logo-img" aria-hidden="true" /><span>BAR<span class="nav__logo-board">BOARD</span></span></a>',
    '        <p style="font-size:12px;color:var(--clr-text);margin-bottom:8px;">欧美流行音乐个人榜吧</p>',
    '        <p class="footer__tagline"><span>始于2013年5月21日</span><span>UNITED BY MUSIC</span></p>',
    '      </div>',
    '      <div>',
    '        <div class="footer__col-title">BarboardLab</div>',
    '        <ul class="footer__links">',
    '          <li><a href="/bbl.html">关于 BarboardLab</a></li>',
    '          <li><a href="/bbl/hof.html">Hall of Fame</a></li>',
    '          <li><a href="https://musictrack.cn/chart/3045/" target="_blank" rel="noopener">本周单曲合榜<svg class="ext-icon" xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 10 10" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2 8L8 2M8 2H4M8 2v4"/></svg></a></li>',
    '          <li><a href="https://space.bilibili.com/11254817/lists" target="_blank" rel="noopener">历史榜单视频<svg class="ext-icon" xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 10 10" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2 8L8 2M8 2H4M8 2v4"/></svg></a></li>',
    '        </ul>',
    '      </div>',
    '      <div>',
    '        <div class="footer__col-title">Barvision</div>',
    '        <ul class="footer__links">',
    '          <li><a href="/barvision/2026/events.html">Barvision 2026</a></li>',
    '          <li style="display:none"><a href="/barvision/2025/events.html">Barvision 2025</a></li>',
    '          <li><a href="/barvision/hof.html">Hall of Fame</a></li>',
    '          <li><a href="/barvision.html">历届回顾</a></li>',
    '        </ul>',
    '      </div>',
    '      <div>',
    '        <div class="footer__col-title">更多</div>',
    '        <ul class="footer__links">',
    '          <li><a href="/about.html">关于 Barboard</a></li>',
    '          <li><a href="/archive.html">Archive</a></li>',
    '          <li><a href="/member.html">Members</a></li>',
    '        </ul>',
    '      </div>',
    '    </div>',
    '    <div class="footer__bottom">',
    '      <span class="footer__copy">© 2013–2026 Barboard. All Rights Reserved.</span>',
    '      <span class="footer__notice">Designed & Built by <a class="member" href="/member/7.html" data-nickname="威妈">@williw_</a></span>',
    '    </div>',
    '  </div>',
    '</footer>'
  ].join('\n');

  /* ── 注入 ──────────────────────────────────────────────────────────────── */
  function inject(el, html) {
    if (!el || !html) return;
    el.insertAdjacentHTML('afterend', html);
    el.remove();
  }

  inject(document.getElementById('site-nav'),    NAV_HTML);
  inject(document.getElementById('site-footer'), FOOTER_HTML);

  /* ── Dev Gate ───────────────────────────────────────────────────────────── */
  function initDevGate() {
    if (!DEV_GATE) return;
    if (sessionStorage.getItem('barboard_dev') === '1') return;

    var st = document.createElement('style');
    st.textContent = [
      '#dev-gate{position:fixed;inset:0;z-index:9999;display:flex;align-items:center;justify-content:center;padding-top:10vh;background:var(--clr-bg);transition:opacity .45s ease;}',
      '#dev-gate.dg-out{opacity:0;pointer-events:none;}',
      '.dg-bg{position:absolute;inset:0;pointer-events:none;background:radial-gradient(ellipse 70% 55% at 50% 38%,rgba(0,180,255,.07) 0%,transparent 65%),radial-gradient(ellipse 40% 40% at 80% 70%,rgba(168,85,247,.05) 0%,transparent 60%);}',
      '.dg-card{position:relative;display:flex;flex-direction:column;align-items:center;width:min(380px,90vw);padding:0 0 8px;}',
      '.dg-logo{font-family:var(--font-display);font-size:54px;letter-spacing:.04em;line-height:1;color:var(--clr-text);margin-bottom:10px;}',
      '.dg-logo-b{color:#6F9EC3;}',
      '.dg-notice{font-family:var(--font-body);font-size:13px;color:var(--clr-text-2);margin:10px 0 3px;}',
      '.dg-sub{font-family:var(--font-mono);font-size:10px;letter-spacing:.14em;color:var(--clr-text-2);opacity:.65;margin:0 0 40px;}',
      '.dg-row{display:flex;flex-direction:column;gap:10px;width:100%;}',
      '.dg-inp{width:100%;height:44px;background:var(--clr-surface);border:1px solid var(--clr-border-2);border-radius:4px;color:var(--clr-text);font-family:var(--font-mono);font-size:14px;padding:0 14px;outline:none;-webkit-appearance:none;appearance:none;box-sizing:border-box;transition:border-color .2s,box-shadow .2s;}',
      '.dg-inp:focus{border-color:#6F9EC3;box-shadow:0 0 0 2px rgba(111,158,195,.18);}',
      '.dg-inp.dg-shake{animation:dg-shake .35s ease;border-color:#e04060;}',
      '.dg-btn{align-self:center;height:44px;padding:0 22px;background:#6F9EC3;color:#000;border:none;border-radius:4px;cursor:pointer;font-family:var(--font-display);font-size:15px;letter-spacing:.06em;transition:background .2s;}',
      '.dg-btn:hover{background:#8ab4d4;}',
      '.dg-err{min-height:20px;margin:10px 0 0;font-family:var(--font-body);font-size:12px;color:#e04060;}',
      '@keyframes dg-shake{0%,100%{transform:translateX(0)}20%{transform:translateX(-7px)}40%{transform:translateX(7px)}60%{transform:translateX(-4px)}80%{transform:translateX(4px)}}',
      '@media(max-width:400px){.dg-logo{font-size:46px;}}'
    ].join('\n');
    document.head.appendChild(st);

    var ov = document.createElement('div');
    ov.id = 'dev-gate';
    ov.innerHTML = [
      '<div class="dg-bg"></div>',
      '<div class="dg-card">',
      '  <div class="dg-logo">BAR<span class="dg-logo-b">BOARD</span></div>',
      '  <p class="dg-notice">敬请期待</p>',
      '  <p class="dg-sub">STAY TUNED</p>',
      '  <div class="dg-row">',
      '    <input class="dg-inp" id="dgInp" type="password" placeholder="Access code" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" />',
      '    <button class="dg-btn" id="dgBtn">ENTER</button>',
      '  </div>',
      '  <p class="dg-err" id="dgErr"></p>',
      '</div>'
    ].join('\n');
    document.body.insertBefore(ov, document.body.firstChild);
    /* restore html visibility now that the gate covers the page */
    document.documentElement.style.visibility = '';

    document.body.style.overflow = 'hidden';

    var inp = document.getElementById('dgInp');
    var btn = document.getElementById('dgBtn');
    var err = document.getElementById('dgErr');

    function unlock() {
      sessionStorage.setItem('barboard_dev', '1');
      document.body.style.overflow = '';
      document.documentElement.style.visibility = '';
      ov.classList.add('dg-out');
      setTimeout(function () { ov.remove(); }, 500);
    }

    function fail() {
      err.textContent = '密码错误 · Wrong access code';
      inp.classList.remove('dg-shake');
      void inp.offsetWidth;
      inp.classList.add('dg-shake');
      inp.value = '';
      setTimeout(function () { err.textContent = ''; inp.classList.remove('dg-shake'); }, 2000);
    }

    function attempt() {
      if (inp.value === DEV_PASS) { unlock(); } else { fail(); }
    }

    btn.addEventListener('click', attempt);
    inp.addEventListener('keydown', function (e) { if (e.key === 'Enter') attempt(); });

    /* auto-focus only on desktop (avoids keyboard popup on mobile) */
    if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
      setTimeout(function () { inp.focus(); }, 80);
    }
  }

  /* ── Nav 初始化 ────────────────────────────────────────────────────────── */
  function initNav() {
    var nav = document.getElementById('nav');
    if (!nav) return;

    window.addEventListener('scroll', function () {
      nav.classList.toggle('scrolled', window.scrollY > 40);
    }, { passive: true });

    var btn = document.getElementById('navMenuBtn');
    var drawer = document.getElementById('navDrawer');
    if (!btn || !drawer) return;

    var savedScrollY = 0;

    function openDrawer() {
      savedScrollY = window.scrollY;
      nav.classList.add('nav--open');
      btn.setAttribute('aria-expanded', 'true');
      drawer.setAttribute('aria-hidden', 'false');
      requestAnimationFrame(function () {
        document.body.style.position = 'fixed';
        document.body.style.top = '-' + savedScrollY + 'px';
        document.body.style.width = '100%';
        document.body.style.overflow = 'hidden';
      });
    }

    function closeDrawer() {
      nav.classList.remove('nav--open');
      btn.setAttribute('aria-expanded', 'false');
      drawer.setAttribute('aria-hidden', 'true');
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
      document.documentElement.style.scrollBehavior = 'auto';
      window.scrollTo(0, savedScrollY);
      document.documentElement.style.scrollBehavior = '';
    }

    btn.addEventListener('click', function () {
      if (nav.classList.contains('nav--open')) { closeDrawer(); } else { openDrawer(); }
    });
    drawer.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', closeDrawer);
    });
  }

  /* ── Back-to-top 初始化 ────────────────────────────────────────────────── */
  function initBackToTop() {
    var btn = document.getElementById('backToTop');
    if (!btn) return;
    window.addEventListener('scroll', function () {
      btn.classList.toggle('visible', window.scrollY > 320);
    }, { passive: true });
    btn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ── Member tooltip (event delegation — works on dynamic content) ──────── */
  function initMemberTooltips() {
    var tip = document.createElement('div');
    tip.className = 'member-tooltip';
    tip.setAttribute('aria-hidden', 'true');
    document.body.appendChild(tip);

    function pos(e) {
      tip.style.left = (e.clientX + 16) + 'px';
      tip.style.top  = e.clientY + 'px';
    }

    function nearest(t) {
      return t.closest ? t.closest('.member[data-nickname]') : null;
    }

    document.addEventListener('mouseover', function(e) {
      var el = nearest(e.target);
      if (!el) return;
      tip.textContent = el.getAttribute('data-nickname');
      pos(e);
      tip.classList.add('member-tooltip--visible');
    });

    document.addEventListener('mousemove', function(e) {
      if (tip.classList.contains('member-tooltip--visible')) pos(e);
    });

    document.addEventListener('mouseout', function(e) {
      if (!nearest(e.target)) return;
      var rel = e.relatedTarget;
      if (rel && nearest(rel)) return;
      tip.classList.remove('member-tooltip--visible');
    });
  }

  /* ── Generic data-tooltip (event delegation) ──────────────────────────── */
  function initDataTooltips() {
    var tip = document.createElement('div');
    tip.className = 'member-tooltip';
    tip.setAttribute('aria-hidden', 'true');
    document.body.appendChild(tip);

    function pos(e) {
      tip.style.left = (e.clientX + 16) + 'px';
      tip.style.top  = e.clientY + 'px';
    }

    function nearest(t) {
      return t.closest ? t.closest('[data-tooltip]') : null;
    }

    document.addEventListener('mouseover', function(e) {
      var el = nearest(e.target);
      if (!el) return;
      tip.textContent = el.getAttribute('data-tooltip');
      pos(e);
      tip.classList.add('member-tooltip--visible');
    });

    document.addEventListener('mousemove', function(e) {
      if (tip.classList.contains('member-tooltip--visible')) pos(e);
    });

    document.addEventListener('mouseout', function(e) {
      if (!nearest(e.target)) return;
      var rel = e.relatedTarget;
      if (rel && nearest(rel)) return;
      tip.classList.remove('member-tooltip--visible');
    });
  }

  initDevGate();
  initNav();
  initBackToTop();
  initMemberTooltips();
  initDataTooltips();
})();
