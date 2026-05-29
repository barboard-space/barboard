# Barboard Website — Claude Code 工作交接文档

## 项目概览

**网站名称**：Barboard 官网（barboard.space）
**性质**：欧美流行音乐个人榜吧（简称榜吧）社区官网，前端静态部署（HTML/CSS/JS），无自建后端，交互功能通过前端 JS + 第三方服务实现
**主要受众**：社区内部成员（中国大陆为主）+ 对欧美音乐感兴趣的外部访客
**部署**：GitHub Pages（barboard-space/barboard），自定义域名 barboard.space，HTTPS 已启用
**Git remote**：`git push origin main` → `https://github.com/barboard-space/barboard.git`（推送后 Pages 自动重新部署）

---

## 社区背景

- **榜吧**（欧美流行音乐个人榜吧）：2013年5月21日创建于百度贴吧，成员效仿 Billboard 形式制作个人音乐周榜/年榜
- **Barboard**：榜吧的英文品牌名
- **当前活跃活动**：
  - **BarboardLab（BBL）**：2024年3月13日创立，每周六更新，成员提交完整个人周榜合并积分，当前已到第124期，完整榜单在 [musictrack.cn/chart/3045/](https://musictrack.cn/chart/3045/)
  - **Barvision**：年度歌曲大赛，灵感来自 Eurovision，成员选送小众歌曲参赛，2019年创立（当年办了5届），2020年7届，2021-2022停办，2023年恢复改为一年一届，当前为**第十六届 Barvision Chongqing 2026**
- **已停办活动**（存档保留）：吧年榜/半年榜（2013-2024）、吧莱美（2021-2024）、Eurovision China Voting Party（2022-2025）

---

## 当前网站状态

### 已完成
- `index.html` — 首页（完成，经过多轮 session 深度打磨，详见开发注意事项）
- `style.css` — 全站样式（含完整设计系统）
- `fonts.css` — 本地字体声明
- `CHANGELOG.md` — 版本更新日志
- `barvision/2026/events.html` — Barvision 2026 赛事页（已完成，已接入 nav.js，`const FORM_URL = ''` 待填入）
- `member.html` — Members 总览页（117位成员，**动态 fetch `data/barboard_members.csv`** 渲染，4档过滤 + 名称搜索框，卡片含 Bilibili·Musictrack 外链，hover 紫色光效，完整入场动画序列）
- `member/7.html` — @williw_（威妈）成员主页（头像占位、标签、外链、代表榜单 TODO 区，作为成员页模板）
- `data/bbl-latest.json` — BBL 最新榜单数据（真实 API 数据，自动更新）
- `data/barboard_members.csv` — 全体成员信息（昵称、ID名、小组、B站ID、Musictrack）
- `scripts/fetch_bbl.py` — BBL 抓取脚本（label 映射已修正）
- `.github/workflows/update-bbl.yml` — 每周六自动更新 BBL 数据
- **Dev Gate** — `scripts/nav.js` 顶部 `DEV_GATE`/`DEV_PASS` 控制，各页面 `<head>` 含防闪内联脚本（详见开发注意事项 #48–50）

### 待建页面（按优先级）
- `barvision/2026/events.html` 中的表单 URL — **6月1日前填入**（`const FORM_URL = ''` 占位符）
- 其余成员主页 — `member/1.html`…`member/10.html` 预留，其他从 11 起；@williw_ = 7，其余编号待定；建好后将 `space_id` 加入 `member.html` 的 `BUILT_PAGES` Set，并在 `index.html` MEMBER_MAP 同步更新 `page` 字段和 href
- `barvision.html` — Barvision 总览 + Hall of Fame
- `barboardlab.html` — BBL 活动介绍
- `about.html` — 关于榜吧完整历史
- `archive.html` — 存档中心总览
- `barvision/2026/results.html` — 2026届赛果（赛后填充）
- `barvision/2026/news.html` — 2026届公告
- `barvision/2025/events.html` 等历届页面
- `barboardlab/hall-of-fame.html`、`barboardlab/charts/`
- `archive/barammy.html`、`archive/esc-voting-party.html`

---

## 文件结构

```
barboard-space/
├── index.html              ← 首页（已完成）
├── style.css               ← 全站样式
├── fonts.css               ← 本地字体 @font-face
├── CNAME                   ← barboard.space
├── about.html
├── barboardlab.html
├── barvision.html
├── archive.html
│
├── .github/
│   └── workflows/
│       └── update-bbl.yml  ← 每周六自动抓取 BBL 数据
│
├── scripts/
│   ├── fetch_bbl.py        ← BBL 抓取脚本（同时更新 ticker.json / updates.json）
│   └── nav.js              ← 全站共享 nav/footer 组件 + 所有 nav JS
│
├── partials/
│   ├── nav.html            ← nav HTML 可读备份（与 nav.js 内容同步）
│   └── footer.html         ← footer HTML 可读备份（与 nav.js 内容同步）
│
├── data/
│   ├── bbl-latest.json     ← BBL 最新榜单（自动更新，含真实数据）
│   ├── ticker.json         ← 字幕条目（字符串数组，BBL条目由fetch_bbl.py维护）
│   └── updates.json        ← 动态条目（对象数组，BBL条目由fetch_bbl.py维护）
│
├── barboardlab/
│   ├── hall-of-fame.html
│   └── charts/
│
├── member/
│   ├── 7.html              ← @williw_（威妈）成员主页（已完成，含 TODO 占位）
│   └── …                   ← 其他成员页（1-10 预留，其余从 11 起）
│
├── barvision/
│   ├── 2026/
│   │   ├── events.html     ← 已完成，已接入 nav.js，待填表单 URL
│   │   ├── results.html
│   │   └── news.html
│   └── 2025/
│
├── archive/
│   ├── barammy.html
│   └── esc-voting-party.html
│
└── assets/
    ├── fonts/
    │   ├── Bebas_Neue/BebasNeue-Regular.ttf
    │   ├── DM_Mono/DMMono-Regular.ttf
    │   └── DM_Sans/static/DMSans-{Regular,Medium,SemiBold,Bold}.ttf
    ├── images/
    │   └── logo_center.png   ← 全小写，Linux 大小写敏感
    ├── banners/
    └── icons/
```

---

## BBL 数据层

- **API**：`https://6api.musictrack.cn/api/charts/3045`（React SPA 后端接口，直接返回 JSON）
- **注意**：有反爬限制（X-Anticrawler-Limit: 420），每周只抓一次，不要频繁请求
- **workflow 触发时间**：周六 16:00 UTC（北京时间 00:00）+ 周日 04:00 UTC 备用
- **前端渲染**：`loadChart()` 函数 fetch `data/bbl-latest.json`，动态生成 Top 10 列表并更新所有相关 UI

### API 顶层字段
- `record`：当期元信息
- `prev_chart` / `next_chart`：上/下一期日期字符串（YYYYMMDD），`next_chart=null` 表示已是最新期
- `details[]`：100首歌曲列表
- `chart_out[]`：本周跌出榜单的歌曲
- `chart_info`、`interaction`：图表元数据和互动数据（不使用）

### record 字段
| 字段 | 说明 | 示例 |
|------|------|------|
| `record.date` | 期数日期 YYYYMMDD | `"20260515"` |
| `record.summary` | 期数说明，含 Vol. 号 | `"Vol. 124\n(5.8-5.14)"` |
| `record.video` | B站 BV 号 | `"BV1QZGB6cE6r"` → `https://www.bilibili.com/video/BV1QZGB6cE6r` |

### details[] 每条字段
| 字段 | 说明 |
|------|------|
| `rank` | 当前排名（整数） |
| `item_name` | 歌曲名称 |
| `artists` | 艺人字符串，多人逗号分隔 |
| `artists_list` | 艺人名数组 |
| `point` | 当期积分（**浮点数**，存为 `points` 取 round()） |
| `weeks` | 在榜周数 |
| `peak` | 历史最高排名 |
| `change` | 排名变化字符串，如 `"+5"`、`"-2"`、`"0"`；新入榜为字符串 `"NEW"` |
| `label` | `"3"=PEAK`、`"4"=RE-ENTRY`、`"6"=NEW`、`"0"=无标签新入榜`、`null=正常在榜` |
| `cover` | 封面图 URL（Spotify CDN，国内可能加载失败，前端有 onerror 兜底） |
| `note` | 备注，通常为 null |

**⚠️ label 映射注意**：`"3"=PEAK`、`"6"=NEW`（历史文档写反了，已修正）。label=`"0"` 的新入榜条目 API 不打标签，但 `change` 字段为 `"NEW"`，JS 需额外判断 `t.change === 'NEW'`。

**PEAK 判断**：不依赖 API label（API 不标记所有 peak），改用 `t.rank === t.peak` 直接比较。

### 历史期榜单
获取方式待确认，可能通过 `/api/charts/3045?date=YYYYMMDD` 参数查询。

---

## 设计系统

### 品牌色彩（CSS 变量，定义于 style.css :root）

```css
--clr-bg:         #080812;   /* 极深午夜蓝黑，主背景 */
--clr-bg-2:       #0c0c18;
--clr-bg-3:       #10101e;
--clr-surface:    #141422;
--clr-surface-2:  #1a1a2e;
--clr-border:     rgba(180,160,255,0.14);
--clr-border-2:   rgba(180,160,255,0.26);
--clr-accent:       #00b4ff;   /* 电蓝 */
--clr-accent-light: #33c6ff;
--clr-pink:         #e040a0;   /* 霓虹粉 */
--clr-pink-light:   #f060b8;
--clr-violet:       #a855f7;   /* 软紫 */
--clr-violet-light: #c084fc;
--clr-gold:       #d4a832;
--clr-gold-light: #f5c840;
--clr-text:       #f0eeff;
--clr-text-2:     #8880a8;
--clr-text-3:     #8880a8;
```

**整体视觉风格**：赛博朋克/霓虹风，契合 Barvision 2026 举办地重庆（主题 Echoing Confluence）。

### 字体
- **Bebas Neue**（`var(--font-display)`）：大标题、Logo、展示性数字
- **DM Sans**（`var(--font-body)`）：正文、导航、按钮、中文标签（DM Mono 无 CJK 字形）
- **DM Mono**（`var(--font-mono)`）：日期、期数、数字数据

字体通过 `fonts.css` 本地加载（不用 Google Fonts，用户主要在中国大陆）。

### 间距系统
```css
--gap-xs:8px  --gap-sm:16px  --gap-md:32px  --gap-lg:64px  --gap-xl:96px
--max-width:1200px  --nav-h:72px  /* 移动端 @media(max-width:768px) 覆盖为 56px */
```

### 主题语（Barvision 2026）
- 中文：**声汇两江**　英文：**Echoing Confluence**

---

## 首页结构说明（index.html）

```
<nav>           固定导航，Logo | About Barvision BarboardLab Archive Musictrack | [Barvision 2026 CTA]
                移动端：汉堡按钮 → .nav__drawer 全屏抽屉（nav--open class 切换）
<section.hero>  第一屏，左：eyebrow+标题+描述+按钮（2个），右：榜吧动态 5条，底部 ticker 字幕条
<section.barvision>  Barvision 版块（在 BBL 前面）
  左：section-label + 标题 + 简介 + 历届大赛 editions-grid（XVI 高亮）+ bv-archive-link
  右：season-card（BARVISION CHONGQING 2026 + 赛程 + 倒计时）
<section.lab>   BarboardLab 版块
  左：section-label + 标题 + 描述 + meta + 按钮（关于BarboardLab / 本周单曲合榜 / 历史榜单视频回顾）
  右：chart-header（动态）+ chart-list（动态，从 bbl-latest.json 渲染）
<footer>        Logo + 简介 + 4列链接 + 版权
  列1：BarboardLab（关于BarboardLab / Hall of Fame / 本周单曲合榜 / 历史榜单视频）
  列2：Barvision（Barvision 2026 / Barvision 2025 / Hall of Fame / 历届回顾）
  列3：更多（关于Barboard / Archive / 榜吧成员）
```

### BBL 动态更新架构

**职责分离**：Python 脚本写数据，浏览器只读渲染。

| 文件 | 更新者 | 内容 |
|------|--------|------|
| `data/bbl-latest.json` | fetch_bbl.py | 完整榜单（100首） |
| `data/ticker.json` | fetch_bbl.py | BBL 字幕条目自动置顶（`BarboardLab 第 N 期已更新 · 本周冠军：...`） |
| `data/updates.json` | fetch_bbl.py | BBL 动态条目自动替换并按日期排序 |

**页面加载流程**：
1. `Promise.all([fetch ticker.json, fetch updates.json])` → `buildTicker()` + `renderUpdates()`
2. `loadChart()` → 只更新 `#chartTitle`、`#chartDate`、`#chartList`（不再触及 ticker/updates）

**`loadChart()` 更新的 DOM 元素**：

| 元素 | ID | 更新内容 |
|------|----|---------|
| chart header 期号 | `#chartTitle` | `#124 · BARBOARDLAB SINGLES CHART` |
| chart header 日期 | `#chartDate` | 周期区间，如 `May 9–15, 2026` |
| 榜单列表 | `#chartList` | Top 10 条目（含金/银/铜 medal 样式） |

### BBL chart item 渲染逻辑

每条 `.chart-item` 为 CSS grid `44px 42px 1fr auto`：
- **列1**：`.chart-rank-col`（排名数字 + 走势变化指示器，叠排）
- **列2**：`.chart-cover`（42×42px 封面，onerror 淡出）
- **列3**：`.chart-song`（歌名 + 歌手）
- **列4**：`.chart-stats`（最高排名 / 在榜周数，`display:contents` 共享双列网格）

**走势变化颜色**：
- NEW：紫色 `chart-change--new`
- RE-ENTRY：黄色 `chart-change--re`
- 上升：绿色 `chart-change--up` + SVG 三角箭头
- 下降：红色 `chart-change--down` + SVG 三角箭头
- 持平：`—` 符号

**Medal 样式**（金/银/铜，class 加在 `.chart-item` 上）：
- rank = 1：`.chart-item--top`（金色，`--clr-gold-light`，歌名 `#fff4d6`）
- rank = 2：`.chart-item--silver`（冷蓝，rank `#90b8d0`，艺人/stat `rgba(148,196,220,0.85)`）
- rank = 3：`.chart-item--bronze`（暖橙，rank `#e0a870`，艺人/stat `rgba(224,160,100,0.8)`）

**统计栏高亮逻辑**（基于 `rank === peak` 直接判断，不信任 API label）：
- rank > 1 且 `rank === peak`（本周新高）：亮紫 `chart-stat__label--violet` / `--val--violet`
- rank > 1 且 `peak === 1`（曾登顶）：粉色 `chart-stat__label--pink` / `--val--pink`（`rgba(240,96,184,0.95)`）
- Medal 样式的 stat 颜色覆盖上述高亮，rank 1/2/3 使用各自 medal 色

**加载动画**：逐条接入全局 `fadeObserver`，`transitionDelay: 0s`，随滚动自然逐一触发。

---

## Barvision 2026 关键信息

- **届次**：第十六届　**主办**：@williw_　**主题语**：声汇两江 · Echoing Confluence
- **主办城市**：重庆（Chongqing）
- **赛程**：
  - 歌曲提交：6/1 — 7/19
  - 附加赛资格赛投票：7/25 — 8/7
  - Semi Final 1 投票：7/25 — 7/31
  - Semi Final 2 投票：8/1 — 8/7
  - Semi Final 暨附加赛直播：8/8 晚
  - Grand Final 投票：8/8 — 8/16
  - Grand Final 直播：8/22 晚
- **投票方式**：Jury Vote（Top 10，12分制）+ Tele Vote（20票自由分配）各50%
- **附加赛**：Approval Vote，每人3票
- **晋级规则**：每场半决赛前8名晋级，东道主直通，附加赛胜者1名，决赛共18首
- **表单邮件接收**：liu.zhuoq@northeastern.edu
- **歌曲提交表单**：需选用国内可访问的服务（问卷星/金数据），避免 Tally.so/Formspree（国内不稳定）
- **events.html 表单占位符**：`const FORM_URL = ''`，填入后表单 iframe 自动渲染，6/1前完成

---

## 外部链接

- **Musictrack**：https://musictrack.cn
- **BBL 完整榜单**：https://musictrack.cn/chart/3045/
- **BBL API**：https://6api.musictrack.cn/api/charts/3045
- **历史榜单视频**：https://space.bilibili.com/11254817/lists
- **GitHub 仓库**：https://github.com/barboard-space/barboard
- **原 Notion 网站**（参考）：https://barboard.notion.site/23e014c223f980de9956f37802553188

---

## 开发注意事项

1. **响应式原则**：**PC 优先**——先实现桌面端完整效果，移动端自然继承；之后再针对移动端做局部微调（`@media (max-width: 768px)` override）。不要为了移动端一致性反过来影响桌面端默认值。
2. **字体**：本地 `fonts.css` 加载，禁止使用 Google Fonts CDN
3. **图片路径**：`logo_center.png` 全小写，GitHub Pages（Linux）大小写敏感，HTML 里必须用小写
4. **CSS 变量**：所有颜色/间距用变量，不硬编码；Nav logo Bebas Neue 通过 `!important` 强制指定（正式方案）
5. **中国用户**：避免所有 Google 服务（Analytics/Fonts/reCAPTCHA）；表单用国内替代；数据可视化用 ECharts
6. **Nav Logo HTML 结构**：`<span>BAR<span class="nav__logo-board">BOARD</span></span>` 单 span 包裹防止 flex 间距问题
7. **字幕条（Ticker）**：2份内容拼接，`translateX(-50%)` 无缝滚动，`will-change: transform` GPU 加速
8. **Phase 行布局**：CSS grid `1fr auto auto 76px`（名称/状态/标签/日期四列），空状态用 `visibility:hidden` 占位 badge 保持列宽
9. **BBL 数据自动化**：GitHub Actions 每周六抓取，`[skip ci]` 防止循环触发；`fetch_bbl.py` 同时更新 `data/bbl-latest.json`、`data/ticker.json`（BBL条目置顶）、`data/updates.json`（BBL条目替换并按date排序）；前端只读不写
10. **SEO**：每个页面需独立 `<title>` 和 `<meta description>`
11. **Section 锚点定位**：`.section` 统一设置 `scroll-margin-top: calc(var(--nav-h) - 2px)`，`-2px` 使 nav 完全覆盖 `.section--bordered` 的 `border-top: 1px`（nav 自身含 border-box 内的 border-bottom，两条线完全重合）
12. **Section 高度**：`.barvision` 和 `.lab` 设置 `min-height: calc(100vh - 2 * var(--gap-xl))`，使 section 总高度约为 100vh（padding 由 `.section` 类统一提供，上下各 `var(--gap-xl)`）
13. **DM Mono 无 CJK**：中文标签（如"最高排名"）必须用 `var(--font-body)`，否则字符不渲染
14. **BBL label 映射**：`fetch_bbl.py` 中 `LABEL_MAP = {"3": "peak", "4": "re-entry", "6": "new"}`（原始文档 3/6 写反，已修正）
15. **歌曲引用格式**：全站统一使用「艺人 — 歌名」格式，不使用书名号
16. **成员提及**：榜吧成员名统一用 `<a class="member" href="[相对路径]/member/7.html" data-nickname="昵称">@username</a>`。href 用**相对路径**（file:// 兼容），不用绝对路径（绝对路径在 file:// 下解析到磁盘根）。`data-nickname` 由 nav.js 的 `initMemberTooltips()` 读取，显示 JS tooltip（挂在 `<body>`，`position:fixed`，`transform:translate(-50%,calc(-100% - 7px))`，opacity fade 0.18s）。PC hover 色变 `--clr-violet-light`，移动端点击跳转。当前成员：`@williw_`（威妈）→ `member/7.html`
17. **移动端 Nav**：`nav--open` class 加在 `<nav>` 上控制 `.nav__drawer` 显隐；汉堡/X 图标用 `opacity + transform` 过渡（不用 `display:none/block`），两图标均 `position:absolute`，按钮设 `width:30px; height:30px` 撑容器；drawer 用 `opacity/visibility/transform` 过渡（0.32s）
18. **Nav scrolled backdrop-filter 陷阱**：`.nav.scrolled` 的毛玻璃效果必须用 `::before` 伪元素实现，不能直接在 `.nav` 上写 `backdrop-filter`——否则 nav 建立新 stacking context，内部 `position:fixed` 的 drawer 会相对 nav 而非 viewport 定位，导致滚动后无法正确展开
19. **back-to-top Z 轴陷阱**：`.nav`（`position:fixed; z-index:100`）建立独立 stacking context，drawer（z-index:1000）在全局层级等同 z-index:100；`.back-to-top`（z-index:200）全局高于 nav，drawer 无法直接遮盖它。解法：`body:has(.nav--open) .back-to-top { opacity:0; visibility:hidden }`
20. **Touch hover 抑制**：用 `@media (hover: none), (pointer: coarse)` 双条件（不只 `hover: none`，因部分 Android Chrome 误报 `hover: hover`）重置所有 `:hover` 样式
21. **Hero 移动端**：`height: auto; min-height: 100svh; overflow-x: clip`（clip 只裁横向，不影响纵向 ticker 显示）；`html` 和 `body` 都设 `overflow-x: hidden` 防横向滚动
22. **返回顶部按钮**：`.back-to-top`，固定右下角，滚动 320px 后显示，紫色（`--clr-violet-light`）风格，`background: rgba(20,20,34,0.5)` + `backdrop-filter: blur(12px)`；移动端 `bottom:16px; right:20px`
23. **标题 accent**：Barvision 标题用 `.bv-accent`（violet），BarboardLab 标题「Lab」用 `.lab-accent`（pink-light）
24. **Ticker 入场动画**：必须用纯 opacity（`@keyframes ticker-fade-in`），不能带 `translateY`——`.hero` 有 `overflow:hidden`，ticker 在 `bottom:0`，translateY 初始位置会被裁出边界，动画不可见
25. **Ticker 移动端**：隐藏 `.ticker__label`（WHAT'S NOW），动画时长从 42s 改为 55s
26. **BBL 日期格式**：`fmtWeekRange()` 同月输出 `May 9–15, 2026`，跨月输出 `May 30–Jun 5, 2026`（省略重复月份）
27. **GitHub Actions fetch**：fetch_bbl.py 遇到 403 时 exit 0（保留旧数据，workflow 不报红）；Actions 用 `FORCE_JAVASCRIPT_ACTIONS_TO_NODE24: true` + `actions/checkout@v4.2.2` + `actions/setup-python@v5.6.0`
28. **nav-enter 动画禁用 transform**：`@keyframes nav-enter` 只能用 `opacity` 过渡，不能含 `transform`。因为 `animation-fill-mode: both` 会使末态 `transform: translateY(0)` 永久保留在 `.nav` 上，nav 成为 fixed 子元素的 containing block，`.nav__drawer` 从此相对 nav 而非 viewport 定位，永久无法正常展开
29. **backdrop-filter 激活陷阱**：`::before` 的毛玻璃过渡必须用 `background` 属性过渡（`rgba(x,x,x,0)→rgba(x,x,x,0.88)`），不能用 `opacity: 0→1`——部分浏览器在 `opacity:0` 时完全不激活 `backdrop-filter`
30. **Ticker JS 化**：`.ticker__track` 由 JS `requestAnimationFrame` 驱动（每帧 `x += speed * dt; if (x >= halfWidth) x -= halfWidth`）。`buildTicker(items)` 从 `data/ticker.json` 读取条目，生成 ×2 复制后写入 track，调用 `_tickerUpdateHalfWidth()` 更新宽度
31. **UPDATES 数据来源**：`data/updates.json` 含静态条目 + BV里程碑（`show_after` 字段）+ BBL条目（fetch_bbl.py自动维护）。`renderUpdates()` 过滤 `show_after` 和1年前内容，排序取前5。不再有 `STATIC_UPDATES`/`BV_MILESTONES` 硬编码数组
32. **fade-up-right**：右列大卡片（`.barvision__card`、`.chart-header`）使用专属 class，对应 `rightObserver`（`rootMargin: '0px 0px -80px 0px'`），触发时机晚于普通 `.fade-up`
33. **移动端抽屉滚动锁**：`openDrawer()` 保存 `scrollY`，设 `body { position:fixed; top:-scrollY; width:100%; overflow:hidden }`；`closeDrawer()` 还原并 `window.scrollTo(0, scrollY)`。纯 `overflow:hidden` 在 iOS 无效
34. **BarboardLab 标题三段配色**：`Bar`（白色）+ `board`（`#6F9EC3`，`.bbl-board-accent`，与 nav logo BOARD 一致）+ `Lab`（`var(--clr-violet-light)`，`.lab-accent`）
35. **BBL 榜单条目动画**：不使用容器级 `listObserver`，改为逐条接入全局 `fadeObserver`，`transitionDelay: 0s`，随滚动自然逐一触发
36. **Scroll hint CSS 顺序陷阱**：`.hero__scroll-hint` 基础样式（含 `display:flex`）必须放在 `@media (max-width:768px)` 块之前；若放在其后，媒体查询的 `display:none` 被层叠覆盖，移动端无法隐藏
37. **Nav logo mix-blend-mode 移除**：`.nav__logo-img` 曾有 `mix-blend-mode:screen`，`openDrawer()` 时 `body{position:fixed}` 触发全页 reflow，GPU 合成层重建导致 logo 闪烁；PNG 已有透明背景，直接移除 mix-blend-mode 无视觉影响
38. **openDrawer() rAF 分帧**：body scroll lock (`position:fixed` 等) 包入 `requestAnimationFrame`，与 `nav--open` class 切换分帧执行，防止同帧 reflow 导致视觉闪烁
39. **closeDrawer() scrollBehavior 陷阱**：`html { scroll-behavior:smooth }` 全局生效，`window.scrollTo(0, savedScrollY)` 会触发平滑动画造成页面跳滚；还原前须临时设 `document.documentElement.style.scrollBehavior = 'auto'`，还原后清除
40. **共享 nav/footer 方案**：`scripts/nav.js` 内嵌 `NAV_HTML` / `FOOTER_HTML` 字符串，同步调用 `inject()` (`insertAdjacentHTML('afterend',...) + remove()`) 替换占位符。不用 `fetch` 是因为 Chrome/Edge 在 `file://` 协议下 CORS 屏蔽跨文件 fetch，本地开发无需起 server。新页面模板：`<div id="site-nav"></div>`…内容…`<div id="site-footer"></div><script src="../scripts/nav.js"></script>`（路径按层级调整）
41. **nav.js 中的链接用绝对路径**：`/about.html`、`/barvision.html` 等，在 GitHub Pages 自定义域名下从根解析，子目录页面（如 `barvision/2026/events.html`）也能正确跳转
42. **updates.json show_after 字段**：BV 里程碑条目加 `"show_after":"YYYY-MM-DD"`，JS 过滤 `new Date(show_after) <= now`；普通条目不加此字段（始终显示）；文件整体按 `date` 降序排列
43. **装饰性 `::before`/`::after` overlay 必须加 `pointer-events: none`**：`position:absolute; inset:0` 的伪元素在 z-order 上覆盖内容区，若无 `pointer-events:none` 会拦截所有点击（包括子元素的 `<a>` 链接）。典型案例：`.season-card__banner::before` 网格层漏掉此属性，导致 `.member` 链接无法点击
44. **Member tooltip 用 JS 事件委托**：`initMemberTooltips()` 监听 `document` 的 `mouseover/mousemove/mouseout`，用 `e.target.closest('.member[data-nickname]')` 匹配；tooltip div 挂在 `<body>`，`position:fixed`，跟随鼠标坐标 `(e.clientX+16, e.clientY)`，opacity 0.85，10px 字体；事件委托自动覆盖动态渲染元素，无需重新绑定
45. **成员页编号规则**：`member/数字.html`，1–10 为预留位，其他成员从 11 起；当前已建：`member/7.html`（@williw_）。`member.html` 为总览入口（已完成）
46. **`@username` 自动解析**：`index.html` 中 `MEMBER_MAP`（键为 handle/B站ID，值为 `{nickname, href}`）+ `parseMentions(raw)` 函数；`buildTicker()` 和 `renderUpdates()` 均调用，JSON 文件只需写纯文本 `@username`，在 MEMBER_MAP 中的自动转为带 tooltip 的 `.member` 链接，不在则保留纯文本。新增成员时在 MEMBER_MAP 和 `member.html` 的 MEMBERS 数组里各加一行即可
47. **`member.html` 数据维护**：成员数据从 `data/barboard_members.csv` 动态加载（已废弃硬编码 MEMBERS 数组）。新增/修改成员只需编辑 CSV；建好个人主页后将对应 `space_id` 加入 `BUILT_PAGES` Set（见 #52），对应卡片自动变为可点击链接。
48. **Dev Gate 开关**：`scripts/nav.js` 第8行 `var DEV_GATE = true`，上线时改为 `false` 即完全关闭（无需删代码）。各页面 `<head>` 含防闪内联脚本（sessionStorage key `barboard_dev`，值 `'1'` 表示已通过，关 tab 失效）。gate CSS/HTML/JS 全部封装在 `initDevGate()` 函数内
49. **Dev Gate `visibility` 继承陷阱**：防闪脚本设 `document.documentElement.style.visibility='hidden'`（作用于 `<html>`），子元素全部继承，包括 gate overlay 本身。`initDevGate()` 注入 overlay 后必须立即调用 `document.documentElement.style.visibility=''` 还原，否则 overlay 也不可见
50. **新页面接入 Dev Gate**：新建 HTML 页在 `<meta name="viewport">` 后加一行：`<script>if(sessionStorage.getItem('barboard_dev')!=='1')document.documentElement.style.visibility='hidden'</script>`；nav.js 已自动处理后续逻辑，无需其他改动
51. **member.html CSV 动态加载**：页面通过 `fetch('data/barboard_members.csv')` 运行时读取成员数据，JS 解析 CSV（含带引号字段处理）。新增/修改成员只需编辑 CSV，无需动 HTML。`parseCSVLine()` 处理引号内逗号；多个 bilibili_id 取第一个；空字段安全跳过。
52. **BUILT_PAGES Set 管理成员页链接**：`member.html` 顶部 `var BUILT_PAGES = new Set([7])` 存放已建成员页的 `space_id`。新建 `member/N.html` 后将 `N` 加入此 Set，对应卡片自动变为可点击链接，其余卡片保持不可点击。无需改动 CSV 或其他逻辑。
53. **嵌套锚点陷阱**：卡片外层若为 `<a>`，内部不能再有 `<a>`（Musictrack/Bilibili 链接），浏览器会自动断开外层锚点导致游离元素出现在 grid 中。解法：外层一律用 `<div>` + `onclick="location.href='...'"` 处理导航，内部链接加 `onclick="event.stopPropagation()"` 防冒泡。
54. **member.html 小组色彩系统**：筛选按钮与成员标签 badge 颜色一一对应——全部/无分组：榜吧蓝 `#6F9EC3`；BBL：紫色 `--clr-violet-light`；村摇欧：棕黄 `#D49840`；Indienation：粉色 `--clr-pink-light`。badge 简称：BBL / 村摇欧 / Indie。
55. **member.html 入场动画架构**：hero 元素用 CSS `@keyframes ml-hero-in`（eyebrow 0.05s → 标题 0.16s → 筛选按钮 0.28–0.46s → 搜索框 0.52s）；卡片用自定义 `ml-card-enter`（`opacity:0; translateY(12px); cubic-bezier(0.22,1,0.36,1)`）+ IntersectionObserver。首屏卡片：850ms 后再注册 observer（通过 `getBoundingClientRect().top < vh` 判断）；屏外卡片：立即注册，滚入时触发。计数器：函数顶部 `transition:none; opacity:0` 禁用过渡静默写入内容，双 rAF 后重启过渡，550ms 后淡入。
56. **CSV 异步加载期间 footer 上浮问题**：`fetch('data/barboard_members.csv')` 为异步操作，加载完成前 `#mlGrid` 为空，页面高度极短，footer 出现在视口内。解法：给 `.ml-section` 加 `min-height: 80vh`，确保 grid 区域未填充时也足够高，footer 始终在视口外。
57. **member.html 搜索框**：`.ml-search` 置于 `.ml-filters` 末尾，`margin-left: auto` 推到行右侧；初始宽 180px，focus 扩展至 220px（`transition: width 0.25s ease`）；placeholder focus 时 `opacity:0` 淡出，光标颜色 `caret-color: var(--clr-violet)`；搜索与分组筛选取交集，`currentSearch` 全局状态与 `currentFilter` 联动，`buildGrid(members, filter, search)` 三参数调用。移动端 `width:100%; margin-left:0`。
58. **member.html 成员排序架构**：CSV 加载完成后按三级键排序——主键 `getRowScore`（0–7，信息行数：有handle+team+foot=7，有handle+foot=6，有handle+team=5，有foot+team=4，仅handle=3，仅foot=2，仅team=1，仅昵称=0），次键 `getMemberScore`（字段完善度各+1），三键 `getTeamPriority`（BBL=4/村摇欧=2/Indie=1 叠加）。`PINNED_NAMES=['雨妈','威妈','羊妈','S妈']` 先提取后置顶，不参与排序。筛选时 hidden class 控制显隐，排序顺序不变。
59. **member.html 计数器 label 动画**：`transform: translateX` 绝对不能直接作用在 flex item 的 label span 本身——会使整个元素偏移压入数字区域。最终方案：旧文字 `transition opacity+transform` 向左滑出淡出（120ms），`setTimeout` 内换文字、snap 到右侧（双 rAF），再 `transition` 向左滑入归位（200ms）。
60. **member.html 计数器数字固定宽度**：`.ml-count__num` 加 `min-width: 3ch; text-align: right`，Bebas Neue 数字宽度一致，3ch 足够容纳最大三位数（117），切换时右侧 label 位置不跳变。

---

## 对话交接工作流

**触发时机**：每次对话即将被 compact（上下文压缩）之前，或用户主动要求生成交接 prompt 时。

### 执行步骤

1. **更新 CLAUDE.md 和 CHANGELOG.md**
   - 将本次对话中完成的页面/功能追加到「已完成」列表
   - 将本次对话中发现的新技术要点追加到「开发注意事项」（编号续接）
   - 更新「待建页面」优先级列表（移除已完成项，调整顺序）
   - 若有新的设计决策或约定，更新对应章节
   - 在 `CHANGELOG.md` 顶部追加本次改动（`## [YYYY-MM-DD]`，按 Added / Changed / Fixed / Style / Content / Docs 分类）

2. **生成交接 Prompt**
   输出一段可直接粘贴到下一个 session 开头的 prompt，格式如下：

   ```
   继续 Barboard 官网（barboard.space）开发。项目在 D:\Genius\barboard-space，请先读取 CLAUDE.md 了解完整背景。

   当前状态（截至 YYYY-MM-DD，本 session 已完成）：
   [本次 session 完成的工作，逐条列出，含关键实现细节和踩坑记录]

   下一步优先任务（按优先级）：
   [待办事项，最多5条，附简要说明]

   设计原则：PC 优先，移动端继承后单独微调。所有新页面复用 style.css 设计系统（CSS 变量、字体、组件类），参考 index.html 的 nav/footer/section 结构。

   阅读完成后请先告知理解情况，不要自行开始任务。
   ```

### 注意事项
- CLAUDE.md 只记录**跨 session 有价值**的信息（技术约定、已知陷阱、设计决策）；单次 session 的临时调试过程不写入
- 交接 prompt 的「已完成」部分要写**足够细节**，让下一个 session 无需重读代码即可理解上下文
- 若某个技术问题在本次 session 反复出现，必须在「开发注意事项」中新增一条，防止下次重踩
