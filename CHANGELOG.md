# Changelog — Barboard 官网

所有重要更新记录于此，按日期倒序排列。

---

## [2026-05-29] — bbl.html 重命名 & sticky sidebar 完整修复

### Changed
- **`barboardlab.html` → `bbl.html`**：文件重命名，全站链接同步更新（`nav.js` 3处、`index.html`、`partials/footer.html`、`partials/nav.html`）
- **`partials/footer.html`**：与 `nav.js` 统一，使用"始于2013年5月21日"

### Fixed
- **`bbl.html` 本期亮点 sticky 失效**：CSS `position: sticky` 在 grid cell 子元素上部分浏览器不可靠（scroll range 按内容高度而非 stretch 高度计算）→ 改为 JS rAF + lerp 实现（`align-self: start` + `will-change: transform`，scroll/resize/ResizeObserver 三路触发）
- **sticky 方向**：从顶端（`top: navH+24`）改为底端（`past = (innerHeight−24) − (gr.top+sh)`）
- **sticky 上限超出回弹**：原用 `lastItem.getBoundingClientRect().bottom` 作上限，该值含 fade-up `translateY(24px)` 偏移，IntersectionObserver 触发后突变导致回弹 → 改用 `#bblFullList.getBoundingClientRect().bottom`（容器无 transform，纯布局底边）
- **丝滑动画**：从直接写 transform 改为 rAF + lerp（因子 0.22），`|diff| < 0.5px` 时停止循环，ResizeObserver 处理"显示全部"后的高度扩展

---

## [2026-05-29] — barboardlab.html 创建 & 首页杂项修复

### Added
- **`barboardlab.html`**：BBL 专题页，含三大板块：
  - **Hero**：大标题 + 介绍文字 + BBL Hall of Fame / 完整历史榜单按钮；右侧 sticky Bilibili 视频嵌入窗口（从 `data/bbl-latest.json` 读 `bilibili` 字段填入 iframe）
  - **本期亮点**（右侧 sticky 侧栏）：4 张竖排卡片，数据全部客户端计算——最高空降（NEW 条目最低 rank）/ 最长在榜（max weeks）/ 最大涨幅（max positive change）/ 最大跌幅（max negative change）；颜色紫/金/绿/红
  - **本期完整榜单**：默认显示前 50，"显示全部 N 首"按钮展开全部；每条三列横排统计（最高排名 / 在榜周数 / 本周点数，各 72px 等宽，10px label + 12px val，border-left 分隔）；medal 色覆盖、峰值高亮（紫/粉）
  - 双列布局：左榜单自由滚动，右亮点 `position: sticky; top: calc(var(--nav-h) + 24px)` 吸顶跟随

### Changed
- **`.github/workflows/update-bbl.yml`**：新增周一 12:00 BJ 备用抓取（`0 4 * * 1`）；备用触发时先 `git log --since="2 days ago"` 判断主抓是否已提交，成功则跳过，避免羊妈延迟更新后漏抓
- **`scripts/nav.js` footer**："成立于2013年5月21日" → "始于2013年5月21日"
- **`index.html`** BarboardLab meta："成立于2024年3月13日" → "创立于2024年3月13日"
- **`index.html`** BarboardLab 按钮："关于BarboardLab" → "关于 BarboardLab"（中英文间加空格）

### Fixed
- **BarboardLab 三按钮 hover 动画消失**：`.fade-up` 的 `transition` 规则晚于 `.btn`/`.btn--primary`，覆盖了按钮的 transition 属性，导致 hover 无动画 → 在 `.btn.fade-up.visible` / `.btn--primary.fade-up.visible` 加更高特异度规则还原正确 transition
- **BarboardLab 三按钮 hover 延迟约 0.5s**：按钮的 inline `style="transition-delay:0.4–0.6s"` 用于入场错排，`.visible` 添加后这个 delay 一直保留影响 hover → 在 fadeObserver 回调中用 `transitionend` 事件清除 `style.transitionDelay`

---

## [2026-05-29] — 成员主页系统完整实现

### Added
- **`scripts/member-render.js`**：成员页共享模板，统一管理所有 CSS 与 HTML 渲染逻辑；读取 `window.MEMBER_DATA` 动态生成 hero（头像、昵称、handle、team 标签、外链）+ Works 区（Works label / 代表成绩标题 / 即将上线占位，三元素各自 fade-up 带阶梯 delay 0.05/0.15/0.25s）
- **`scripts/gen_member_pages.py`**：批量生成脚本，读取 `data/barboard_members.csv` 生成全部 117 个 `member/N.html`（每页仅含 MEMBER_DATA 数据壳）
- **`member/7.html … member/770.html`**：全体117位成员个人主页（含 `member/7.html` 重构）

### Changed
- **`member/7.html`**：大幅精修——填入真实 Bilibili（6594528）/ Musictrack（chart/25）链接；team 标签改为 BarboardLab（紫）+ 村摇欧共体（金棕，新增 `.mp-tag--cun`）；外链移至右上角三列网格竖排等宽；图标统一 13×13px（Bilibili fill、Musictrack stroke-width 2.5）；头像占位改为"威"（CJK 用 body font）、向下移 8px；按钮字号 12px + padding 3px；移除 `MEMBER · #007` 和 `Barvision 主办` 标签；"代表榜单"→"代表成绩"，占位文字"即将上线"
- **`member.html`**：`BUILT_PAGES` 从 `Set([7])` 更新为全部117个 space_id，所有成员卡片均可点击跳转
- **`index.html` MEMBER_MAP**：从2条扩展至全量（75+ 条），覆盖所有有 ASCII handle 的成员及所有中文 handle 成员；`SeafishYANG` href 从 `member.html` 修正为 `member/100.html`
- **`index.html` parseMentions**：正则从 `[\w]+` 升级为 `[\p{L}\p{N}_-]+`（`u` flag），原生支持 Unicode 字母数字；含尾部连字符 handle（`健Jian-`）通过 `.replace(/-+$/, '')` 截断后查表；中文 handle（`哈哈哈时光机` 等）以完整字符串为 key 直接命中

---

## [2026-05-29] — member.html 链接 hover

### Style
- **member.html**：`.ml-card__mt`（Bilibili / Musictrack 链接）hover 颜色改为 `--clr-violet-light`（`#c084fc`）

---

## [2026-05-30] — member.html 排序系统 & 计数器动画

### Added
- **成员名片排序系统**：`PINNED_NAMES`（雨妈→威妈→羊妈→S妈）固定前四位；`getRowScore`（0–7分，按信息行数完善度）为主键，`getMemberScore`（字段完善度）为次键，`getTeamPriority`（BBL>村摇欧>Indie）为三级打破平局
- **计数器数字动画**：`animateCounterTo` ease-out cubic 曲线，时长按差值动态调整（最长480ms）；支持 `onDone` 回调
- **计数器文字动画**：筛选切换时旧文字向左滑出+淡出（120ms），新文字从右侧滑入+淡入（200ms）
- **数字固定宽度**：`.ml-count__num` 加 `min-width: 3ch; text-align: right`，防止两位数↔三位数切换时右侧文字位置跳变

### Changed
- **筛选按钮**："村摇欧" → "村摇欧共体"
- **hero/section 间距**：`.ml-hero` 底部 padding 40→25px，`.ml-section` 顶部 padding 40→25px
- **成员卡片 badges div**：只在有 team 时渲染，无 team 不渲染空 div（原 `min-height:20px` 空 div 导致"大字+小字+foot"卡片比"大字+小字+team"高）

---

## [2026-05-29] — member.html UI 精修 & 动画系统

### Added
- **成员名称搜索框**（`member.html`）：与分组筛选联动，同时匹配昵称和 barboard_id，`margin-left:auto` 右对齐，focus 展开 180→220px，placeholder 淡出，光标紫色
- **member.html 完整入场动画序列**：eyebrow(0.05s)→标题(0.16s)→筛选按钮4个(0.28–0.46s)→搜索框(0.52s)→计数器(0.55s)→首屏卡片(0.85s起按列错位)；自定义 `ml-card-enter` class（`cubic-bezier(0.22,1,0.36,1)`，`translateY(12px)`），`getBoundingClientRect` 判断首屏/屏外分开处理
- **`section-label` 横线**：`榜吧成员名录` eyebrow 加 `section-label` class，与首页各 section label 保持一致

### Changed
- **Nav 顺序**（`scripts/nav.js`）：移除 About，加入 Members；新顺序 Barvision → BarboardLab → Archive → Members → Musictrack → 报名通道（桌面+移动抽屉同步）
- **Footer 文案**：`关于BarboardLab` / `关于Barboard` 中英文中间加空格
- **index.html BarboardLab 三按钮**：从容器整体 fade-up 改为各自独立 fade-up，delay 0.4s / 0.5s / 0.6s 按序触发
- **member.html badge 样式**：对齐 `phase__badge`（`border-radius:2px`、`padding:4px 5px 3px 6px`、`letter-spacing:0.08em`、border 用 `rgba(color,0.4)`）
- **Bilibili·Musictrack 分隔**：两个链接之间加 `·`（`.ml-card__sep`），gap 调整为 6px
- **计数器样式**：Bebas 42px 白色 + 13px 小字，opacity 0.85，`117位成员` / `X / 117 位成员` 格式
- **卡片 handle 颜色**：`--clr-text-3` → `#a8a3c8`（调亮）
- **卡片 grid gap**：12px → 8px
- **背景蓝色辉光**：位置 `80%80%` → `80%62%`，opacity 0.04，transparent 扩至 75%

### Fixed
- **footer 上浮闪现**：CSV 异步加载期间 grid 为空导致 footer 在视口内；`ml-section` 加 `min-height:80vh` 修复
- **计数器动画闪烁**：先出现再消失再出现的问题；改为函数顶部 `transition:none; opacity:0` 静默写入内容，双 rAF 后重启过渡
- **卡片动画只有两排**：`i < 12` 硬编码改为 `getBoundingClientRect().top < vh` 动态判断，所有首屏卡片均延迟 850ms observe

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
