# Changelog — Barboard 官网

所有重要更新记录于此，按日期倒序排列。

---

## [2026-05-29] — member.html 重构 & CSV 动态加载

### Changed
- **`member.html` 数据层**：MEMBERS 硬编码数组改为运行时 `fetch('data/barboard_members.csv')` 动态加载，`parseCSVLine()` 处理带引号字段；`BUILT_PAGES = new Set([7])` 控制哪些 space_id 有成员页链接，新建页面只需往 Set 里加数字
- **`data/barboard_members.csv`**：更新至完整 117 位成员，新增 bilibili_id 字段，修正多处 barboard_id 拼写（Lee冀雨→Lee翼雨、iTAP II→iTAP_II 等）

### Fixed
- 嵌套锚点 bug：威妈卡片外层 `<a>` 内含 Musictrack/Bilibili `<a>` 导致浏览器拆解元素、出现残缺游离 grid item；改为外层统一 `<div>` + `onclick`，内部链接加 `stopPropagation`

### Style
- 卡片大字显示 space_name（威妈），小字显示 `@barboard_id`；新增 Bilibili 外链（排在 Musictrack 前），移除丑陋箭头图标，链接字号统一 11px
- 全卡片 hover 效果：紫色边框 + 光晕 `box-shadow` + 上浮 2px
- Hero 标题：MEMBERS 纯白 `#fff`，字间距收至 `0.01em`，移除 `<span>` 紫色；「榜吧成员名录」eyebrow 移至标题上方，样式与首页 hero__eyebrow 一致（紫色光晕 + `0.32em` 字间距）
- 筛选按钮与成员 badge 色彩统一：全部=榜吧蓝 `#6F9EC3`，BBL=紫色，村摇欧=棕黄 `#D49840`，Indie=粉色；「村摇欧共体」简称改为「村摇欧」

---

## [2026-05-29] — Dev Gate & Refactor

### Added
- **Dev Gate 密码保护系统**（`scripts/nav.js`）：顶部 `DEV_GATE = true` / `DEV_PASS = 'waitaminute'`，上线改 `false` 即关闭，无需删代码
- 各 HTML `<head>` 加防闪内联脚本：`if(sessionStorage.getItem('barboard_dev')!=='1')document.documentElement.style.visibility='hidden'`（4个页面：index / member / member/7 / barvision/2026/events）
- Gate UI：BARBOARD 大字 logo（BAR 白 / BOARD `#6F9EC3`）+ 「敬请期待 / STAY TUNED」+ 密码输入框 + ENTER 按钮；颜色全部使用 `#6F9EC3`（`.bbl-board-accent` 同色）
- sessionStorage 持久化：同 tab session 内跳转页面无需重复输入，关闭 tab 后失效

### Changed
- Gate 卡片改为 flexbox column + `align-items:center`，确保内容真正居中（原 `text-align:center` 对 flex 子元素无效）
- 输入框与 ENTER 按钮改为上下堆叠布局；按钮居中，`padding:0 28px`，`align-self:center`
- Gate 整体加 `padding-top:10vh`，视觉重心略低于几何中心

### Fixed
- `visibility:hidden` 设在 `<html>` 上时 gate overlay 继承了隐藏不可见；`initDevGate()` 注入 overlay 后立即还原 `document.documentElement.style.visibility=''`

### Refactor
- `style.css`：合并两个独立 `html {}` 规则块；删除空 `.ticker__track {}` 规则（仅注释无 CSS）；清理多余空行
- `index.html`：删除 `parseMentions` 内重复声明的 `esc` 函数（复用外部全局版本）；删除未被调用的 `fmtWeekRangeCN` 函数

---

## [2026-05-29]

### Added
- `data/ticker.json`：字幕条目数据文件（字符串数组，fetch_bbl.py 每周自动更新 BBL 条目至首位）
- `data/updates.json`：动态条目数据文件（对象数组，含 `show_after` 字段替代原 BV_MILESTONES，fetch_bbl.py 自动更新并按日期排序）
- `scripts/nav.js`：全站共享 nav/footer 组件（NAV_HTML + FOOTER_HTML 内嵌为 JS 字符串，同步注入，无需 fetch，file:// 本地和 https:// 线上均可用）
- `partials/nav.html`、`partials/footer.html`：可读参考备份文件，与 nav.js 内容保持一致
- BBL chart 银色（rank 2，`chart-item--silver`，冷蓝 `#90b8d0`）和铜色（rank 3，`chart-item--bronze`，暖橙 `#e0a870`）medal 样式
- scroll-hint 专属入场动画 `scroll-hint-enter`：从上方滑下（`translateY(-12px) → 0`），延迟 0.65s
- **Member 系统**：`.member` 从 `<span>` 升级为 `<a>`，加 `cursor:pointer`、`data-nickname`、相对路径 href；`initMemberTooltips()` 加入 nav.js，在 `<body>` 末挂载 `position:fixed` JS tooltip（`transform:translate(-50%,calc(-100%-7px))`，opacity fade 0.18s）
- `member/7.html`：@williw_（威妈）成员主页（编号 #007，头像占位、职位 tag、外链按钮、代表榜单 TODO 区，作为全站成员页模板）

### Changed
- **数据架构重构**：Ticker 和 UPDATES 改为从 `data/ticker.json` / `data/updates.json` fetch 读取，浏览器不再动态生成 BBL 文本；`fetch_bbl.py` 每次抓取后同步写入并维护两个文件排序
- **Nav/Footer 共享组件**：所有 HTML 页面用 `<div id="site-nav">` / `<div id="site-footer">` 占位，`scripts/nav.js` 同步注入；Nav JS（滚动检测、drawer、back-to-top）全部集中在 nav.js，index.html 不再含这些逻辑
- `barvision/2026/events.html`：替换硬编码 nav/footer 为 nav.js 占位符，清除内联 nav scroll JS
- `scroll-margin-top` 改为 `calc(var(--nav-h) - 2px)`，使 nav 完全覆盖 section 的 border-top
- Nav scrolled 背景 desktop 0.88 → 0.95，毛玻璃遮挡更明显
- Nav 背景色从 `rgba(14,8,28,...)` 调回 `rgba(8,8,18,...)`，与 footer 颜色一致
- Silver rank 2 艺人/stat 颜色提亮至 `rgba(148,196,220,0.85)`
- scroll-hint 出现时间 1.2s → 0.65s，方向改为向下滑入
- "成员名录" 全站统一改为 "Members"（nav.js、partials/footer.html、member/7.html）

### Fixed
- 移动端"向下滚动查看更多"未隐藏：scroll hint CSS 基础样式误放在 `@media (max-width:768px)` 块之后，被层叠覆盖；移至媒体查询前解决
- 移动端点击 hamburger 时 logo 闪烁：`mix-blend-mode:screen` 在 `body{position:fixed}` reflow 时 GPU 合成层重建导致；移除 mix-blend-mode，改用 rAF 将 body scroll lock 与 class 切换分帧执行
- 移动端关闭抽屉时页面跳滚：`html{scroll-behavior:smooth}` 导致 `window.scrollTo` 触发平滑动画；closeDrawer 时临时设 `scrollBehavior:'auto'`
- `.season-card__banner::before`（`position:absolute;inset:0`）缺少 `pointer-events:none`，覆盖在 `.member` 链接上方拦截所有点击；加上后链接恢复可点
- Member tooltip 初版用 CSS `::before` 伪元素，被父容器 `overflow:hidden` 裁剪不可见；改为 JS tooltip 挂 `<body>` 绕开限制

### Added（续）
- `member.html`：Members 总览页，117位成员全量数据，JS 渲染 + 4档过滤（全部 / BarboardLab / 村摇欧共体 / Indienation），成员卡片含小组徽章和 Musictrack 外链，威妈卡片可跳转个人主页
- `data/barboard_members.csv`：全体成员信息原始数据（昵称、ID名、小组、B站ID、Musictrack）
- `index.html` `MEMBER_MAP` + `parseMentions()`：`@username` 自动转为带 tooltip `.member` 链接；`buildTicker()` 和 `renderUpdates()` 均接入，JSON 写纯文本即可

### Changed（续）
- `initMemberTooltips()` 改为 document 级事件委托（mouseover/mousemove/mouseout），覆盖动态渲染的成员元素，无需重新绑定
- Tooltip 样式：光标跟随定位（`clientX+16, clientY`），10px 字体，3px 9px padding，opacity 0.85
- Footer `@williw_` 包装为 `.member` 链接（hover 高亮 + tooltip）
- Footer Members 链接 `/about.html#members` → `/member.html`
- `updates.json` desc 从内嵌 HTML `<a class="member">` 改为纯文本 `@username`，由 `parseMentions()` 统一处理

---

## [2026-05-28]

### Added
- 移动端 drawer Musictrack 条目加外链箭头 SVG
- 智能 UPDATES 系统：`STATIC_UPDATES` 静态数组 + `BV_MILESTONES`（赛程里程碑日期到达后自动出现）+ BBL fetch 动态条目，合并排序取前 5、过滤 1 年前内容
- `fmtWeekRangeCN()` 函数：BBL 周期中文格式（同月 `5月9日-15日`，跨月 `5月30日-6月5日`）
- `CHANGELOG.md` 版本更新日志文件
- Nav 入场动画 `nav-enter`（纯 opacity，0.45s）；Hero scroll-hint 延迟 1.2s 淡入
- `fade-up-right` class：右列大卡片专属 IntersectionObserver（`rootMargin -80px`），触发更晚
- `.bbl-board-accent` (#6F9EC3)：BarboardLab 标题「board」与 nav logo BOARD 同色

### Changed
- BarboardLab section-label：单曲合榜 → 榜吧实验室
- 按钮文案：历史榜单视频回顾 → 历史榜单视频
- Footer「更多」列：榜吧成员 → 成员名录
- Ticker 连接符：`已更新 — 本周冠军` → `已更新 · 本周冠军`
- UPDATES「BarboardLab 成立两周年」文案更新（榜吧实验室 BarboardLab，114期周榜）
- 移动端 drawer `nav__cta-sub` opacity 0.55 → 1；CTA gap 8px → 7px
- BBL 榜单更新标题格式："BarboardLab 单曲合榜第 N 期已更新"，描述含中文统计周期
- UPDATES 由静态 HTML 改为 JS 数据驱动（可扩展，自动排序）
- BarboardLab 标题「Lab」accent：pink-light → violet-light
- BBL 榜单条目动画：容器级批量触发 → 逐条 `fadeObserver`，`transitionDelay: 0s`
- Nav 毛玻璃：background 过渡（`rgba 0→0.88`），blur 增至 24px；scroll-only（不再常驻）
- 移动端 nav scrolled 背景 alpha 0.88 → 0.72（更透明）
- Footer tagline：PC 两行排列，移动端 CSS 伪元素恢复 ` · ` 分隔
- Footer copyright：Title Case（All Rights Reserved. / Designed & Built by @williw_）

### Fixed
- Ticker 无缝循环闪烁：CSS `animation` 全部替换为 JS `requestAnimationFrame` 驱动，循环点瞬移无渲染帧间隙
- 移动端抽屉打开时底层页面仍可滚动：改用 `position:fixed + top:-scrollY`（iOS 兼容）
- `@keyframes nav-enter` 移除 `transform`：原末态 `translateY(0)` 经 `fill-mode:both` 永久残留，导致 `.nav__drawer` 相对 nav 定位而非 viewport，抽屉永久无法正常展开

### Docs
- CLAUDE.md 新增「对话交接工作流」章节
- CLAUDE.md 补充技术注意事项 #28–35

---

## [2026-05-27] — 首期上线

### Added
- `index.html` 首页完整实现
  - Hero 第一屏：eyebrow / 大标题 / 描述 / 双按钮 / 榜吧动态 5 条 / ticker 字幕条
  - Barvision 版块：历届大赛 editions-grid（XVI 高亮）+ 2026 赛事卡片（赛程 + 倒计时）
  - BarboardLab 版块：动态 Top 10 榜单（loadChart() 从 bbl-latest.json 渲染）
  - Footer：4 列链接 + 版权
  - 返回顶部按钮（滚动 320px 后出现，毛玻璃紫色风格）
  - 移动端汉堡抽屉导航（opacity + transform 过渡，0.32s）
- `barvision/2026/events.html` Barvision 2026 赛事详情页（`const FORM_URL = ''` 占位符待填）
- `style.css` 全站设计系统（色彩变量、字体、间距、组件类）
- `fonts.css` 本地字体声明（Bebas Neue / DM Sans / DM Mono）
- BBL 自动化数据管道：
  - `scripts/fetch_bbl.py` 抓取脚本（label 映射修正：`"3"=PEAK`、`"6"=NEW`）
  - `data/bbl-latest.json` 最新榜单数据
  - `.github/workflows/update-bbl.yml` 每周六 16:00 UTC 自动触发
- `CNAME` 配置自定义域名 barboard.space

### Fixed
- Logo 文件名大小写：`Logo_Center.png` → `logo_center.png`（GitHub Pages Linux 大小写敏感）
- 移动端横向滚动：`.hero` 背景 logo 溢出，改用 `overflow-x: clip`
- 移动端 hover 残留：改用 `@media (hover: none), (pointer: coarse)` 双条件重置
- Ticker 入场动画改为纯 opacity（去掉 `translateY`，避免被 `.hero` `overflow:hidden` 裁切）
- GitHub Actions：升级至 Node 24 兼容版本（`actions/checkout@v4.2.2` / `setup-python@v5.6.0`）
- `fetch_bbl.py` 遇 403 时 `exit 0`（保留旧数据，workflow 不报红）

### Style
- BarboardLab 标题「Lab」accent 改为粉色（`--clr-pink-light`）
- Top 1 条目金色高亮增强（歌名 `#fff4d6`）
- 移动端 BOARD 大标题光晕减弱（blur 40→22px，alpha 0.25→0.15）
- 移动端 Nav 高度 56px（桌面端 72px）
- 移动端 chart-list gap 6px
- Footer 链接布局：桌面端单列，gap 10px；col-title margin-bottom 12px
- `.nav.scrolled` 毛玻璃用 `::before` 伪元素实现（避免 stacking context 导致 drawer 定位错误）
- `body caret-color: transparent`（禁止文本光标闪烁）
- 返回顶部按钮加 `backdrop-filter: blur(12px)` + background opacity 0.5

### Content
- 成员名 `@williw` → `@williw_`
- Barvision 历届大赛回顾链接文字确定
- Footer PC 端恢复单列布局（revert 2列 grid 方案）
