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
- `index.html` — 首页（完成，BBL 数据全动态，移动端响应式已修复）
- `style.css` — 全站样式（含完整设计系统）
- `fonts.css` — 本地字体声明
- `barvision/2026/events.html` — Barvision 2026 赛事页（已完成，`const FORM_URL = ''` 待填入）
- `data/bbl-latest.json` — BBL 最新榜单数据（真实 API 数据，自动更新）
- `scripts/fetch_bbl.py` — BBL 抓取脚本（label 映射已修正）
- `.github/workflows/update-bbl.yml` — 每周六自动更新 BBL 数据

### 待建页面（按优先级）
- `barvision/2026/events.html` 中的表单 URL — **6月1日前填入**（`const FORM_URL = ''` 占位符）
- `barvision.html` — Barvision 总览 + Hall of Fame
- `barboardlab.html` — BBL 活动介绍
- `about.html` — 关于榜吧完整历史（含 `#members` 锚点，供 footer 链接跳转）
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
│   └── fetch_bbl.py        ← BBL 抓取脚本
│
├── data/
│   └── bbl-latest.json     ← BBL 最新榜单（自动更新，含真实数据）
│
├── barboardlab/
│   ├── hall-of-fame.html
│   └── charts/
│
├── barvision/
│   ├── 2026/
│   │   ├── events.html     ← 已完成，待填表单 URL
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

### BBL 动态更新（loadChart() 驱动的 DOM 元素）

`loadChart()` fetch JSON 后更新以下所有元素，**无需每周手动改 HTML**：

| 元素 | ID / 选择器 | 更新内容 |
|------|------------|---------|
| chart header 期号 | `#chartTitle` | `#124 · BARBOARDLAB SINGLES CHART` |
| chart header 日期 | `#chartDate` | 周期区间，同月如 `May 9–15, 2026`，跨月如 `May 30–Jun 5, 2026` |
| ticker 字幕条 | `[data-bbl-ticker]`（×2份） | `BarboardLab 第 N 期已更新 — 本周冠军：艺人 — 歌名` |
| hero 动态时间 | `#bblHeroTime` | `datetime` 属性 + 显示文本 |
| hero 动态标题 | `#bblHeroTitle` | `BBL 第 N 期已更新` |
| hero 动态描述 | `#bblHeroDesc` | `本周冠军：艺人 — 歌名。` |

**注意**：`#bblFooterLabel` 已移除，footer BBL 链接文字固定为「本周单曲合榜」。

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

**统计栏高亮逻辑**（基于 `rank === peak` 直接判断，不信任 API label）：
- rank = 1：整条目金色（`.chart-item--top` 全覆盖，歌名 `#fff4d6`）
- rank > 1 且 `rank === peak`（本周新高）：亮紫 `chart-stat__label--violet` / `--val--violet`
- rank > 1 且 `peak === 1`（曾登顶）：粉色 `chart-stat__label--pink` / `--val--pink`（`rgba(240,96,184,0.95)`）

**加载动画**：不用全局 fadeObserver 逐条观察，改为观察 `#chartList` 容器，容器进入视口时批量给所有条目加 `visible`，每条 `transition-delay: index × 0.05s`。

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
9. **BBL 数据自动化**：GitHub Actions 每周六抓取，`[skip ci]` 防止循环触发；前端 `loadChart()` 异步 fetch JSON 渲染，所有硬编码 BBL 引用均已动态化
10. **SEO**：每个页面需独立 `<title>` 和 `<meta description>`
11. **Section 锚点定位**：`.section` 统一设置 `scroll-margin-top: var(--nav-h)`，防止固定 nav 遮挡锚点目标
12. **Section 高度**：`.barvision` 和 `.lab` 设置 `min-height: calc(100vh - 2 * var(--gap-xl))`，使 section 总高度约为 100vh（padding 由 `.section` 类统一提供，上下各 `var(--gap-xl)`）
13. **DM Mono 无 CJK**：中文标签（如"最高排名"）必须用 `var(--font-body)`，否则字符不渲染
14. **BBL label 映射**：`fetch_bbl.py` 中 `LABEL_MAP = {"3": "peak", "4": "re-entry", "6": "new"}`（原始文档 3/6 写反，已修正）
15. **歌曲引用格式**：全站统一使用「艺人 — 歌名」格式，不使用书名号
16. **成员提及**：榜吧成员名（如 `@williw_`、`@SeafishYANG`）统一用 `<span class="member">` 包裹（`color: rgba(240,238,255,0.62); font-weight:500`），预留日后改 `<a>` 跳转成员主页
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

---

## 对话交接工作流

**触发时机**：每次对话即将被 compact（上下文压缩）之前，或用户主动要求生成交接 prompt 时。

### 执行步骤

1. **更新 CLAUDE.md**
   - 将本次对话中完成的页面/功能追加到「已完成」列表
   - 将本次对话中发现的新技术要点追加到「开发注意事项」（编号续接）
   - 更新「待建页面」优先级列表（移除已完成项，调整顺序）
   - 若有新的设计决策或约定，更新对应章节

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
