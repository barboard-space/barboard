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
- `member.html` — Members 总览页（117位成员，**动态 fetch `data/members/members.csv`** 渲染，4档过滤 + 名称搜索框，卡片含 Bilibili·Musictrack 外链，hover 紫色光效，完整入场动画序列）
- `member/7.html` — @williw_（威妈）成员主页（头像"威"占位、BarboardLab+村摇欧共体标签、Bilibili/Musictrack 右上角竖排按钮、"代表成绩"区）
- `member/N.html`（117个）— 全体成员个人主页，由 `scripts/gen_member_pages.py` 从 CSV 批量生成，每页仅含 `MEMBER_DATA` 数据对象，样式与逻辑全部由 `scripts/member-render.js` 注入
- `scripts/member-render.js` — 成员页共享模板：注入 CSS、读取 `window.MEMBER_DATA`、渲染 hero+Works 两节、处理 CJK/ASCII 头像字体、设置 fade-up 动画
- `scripts/gen_member_pages.py` — 成员页批量生成脚本：读 CSV → 输出 117 个 `member/N.html`；数据变动时重新运行
- `data/bbl/bbl-latest.json` — BBL 最新榜单数据（真实 API 数据，自动更新）
- `data/bbl/bbl-vol-index.json` — Vol.1–124 期号→日期索引（对象格式，`{"1":"2024-01-05",...}`，供 bbl/charts 等页面引用）
- `data/members/members.csv` — 全体成员信息（昵称、ID名、小组、B站ID、Musictrack）
- `scripts/fetch_bbl.py` — BBL 抓取脚本（label 映射已修正）
- `.github/workflows/update-bbl.yml` — 每周六自动更新 BBL 数据
- **Dev Gate** — `scripts/nav.js` 顶部 `DEV_GATE`/`DEV_PASS` 控制，各页面 `<head>` 含防闪内联脚本（详见开发注意事项 #48–50）
- `bbl.html` — BBL 专题页（已完成，含 hero + Bilibili 视频自适应尺寸 + 亮点 JS-sticky 侧栏 + 完整榜单 + 搜索，详见开发注意事项 #64–69, #76–80）
- `bbl/hof.html` — BBL 荣誉殿堂（已完成，**9大板块**（顺序）：冠单名录 → 在榜周数纪录 → 点数纪录 → 无冕高分 → 助攻纪录 → 最强N榜 → 个人榜冠军纪录 → 单周专辑进榜纪录 → 艺人进榜纪录，数据截至第124期；数据全部硬编码 JS 常量数组；含 `VOL_DATES` + `OWNER_MAP`（28位成员简称→space_id/handle/nickname）内联常量；页内 TOC（右侧固定，呼吸点指示器，IO suppression）；各板块卡片/条目均有 `fade-up` 错落入场动画；详见开发注意事项 #80–97）

### 待建页面（按优先级）
- `barvision/2026/events.html` 中的表单 URL — **6月1日前填入**（`const FORM_URL = ''` 占位符）
- `barvision.html` — Barvision 总览 + Hall of Fame
- `about.html` — 关于榜吧完整历史
- `archive.html` — 存档中心总览
- `barvision/2026/results.html` — 2026届赛果（赛后填充）
- `barvision/2026/news.html` — 2026届公告
- `barvision/2025/events.html` 等历届页面
- `barboardlab/charts/` — 历史榜单归档
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
├── bbl.html
├── barvision.html
├── archive.html
│
├── .github/
│   └── workflows/
│       └── update-bbl.yml  ← 每周六自动抓取 BBL 数据
│
├── scripts/
│   ├── fetch_bbl.py        ← BBL 抓取脚本（同时更新 ticker.json / updates.json）
│   ├── nav.js              ← 全站共享 nav/footer 组件 + 所有 nav JS
│   ├── member-render.js    ← 成员页共享模板（CSS注入 + HTML渲染 + 动画）
│   └── gen_member_pages.py ← 批量生成 member/N.html（读CSV，运行一次）
│
├── partials/
│   ├── nav.html            ← nav HTML 可读备份（与 nav.js 内容同步）
│   └── footer.html         ← footer HTML 可读备份（与 nav.js 内容同步）
│
├── data/
│   ├── bbl/
│   │   ├── bbl-latest.json     ← BBL 最新榜单（自动更新，含真实数据）
│   │   ├── bbl-vol-index.json  ← Vol.1–124 期号→日期索引
│   │   └── bbl-record/         ← BBL 原始数据文件（CSV 等）
│   ├── main-page/
│   │   ├── ticker.json         ← 字幕条目（字符串数组，BBL条目由fetch_bbl.py维护）
│   │   └── updates.json        ← 动态条目（对象数组，BBL条目由fetch_bbl.py维护）
│   ├── members/
│   │   └── members.csv         ← 全体成员信息
│   └── barvision/
│       ├── barvision-archive/  ← Barvision 历届存档
│       └── barvision-record/   ← Barvision 原始数据
│
├── bbl/
│   └── hof.html            ← BBL 荣誉殿堂（已完成）
│
├── member/
│   ├── 7.html              ← @williw_（威妈）成员主页（已完成）
│   ├── 12.html … 770.html  ← 全部117位成员主页（gen_member_pages.py 生成）
│   └── …
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
- **workflow 触发时间**：周六 16:00 UTC（北京时间周日 00:00）主抓 + 周一 04:00 UTC（北京时间 12:00）备用；备用触发时先检查 `git log --since="2 days ago"` 判断主抓是否已提交，成功则跳过
- **前端渲染**：`loadChart()` 函数 fetch `data/bbl/bbl-latest.json`，动态生成 Top 10 列表并更新所有相关 UI

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
| `data/bbl/bbl-latest.json` | fetch_bbl.py | 完整榜单（100首） |
| `data/main-page/ticker.json` | fetch_bbl.py | BBL 字幕条目自动置顶（`BarboardLab 第 N 期已更新 · 本周冠军：...`） |
| `data/main-page/updates.json` | fetch_bbl.py | BBL 动态条目自动替换并按日期排序 |

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
0. **跨页面样式一致性**：可复用元素（搜索框、按钮、标签、卡片等）在多处出现时，必须保持样式完全统一。新增或修改某处组件时，主动检查全站其他使用同类组件的页面并同步更新，不允许同一组件在不同页面有差异样式。**排版间距同理**：eyebrow → 标题、标题 → 描述等层级间距，全站所有 hero/section 头部保持一致（eyebrow `margin-bottom: 24px`，参考 `style.css .hero__eyebrow`）。
2. **字体**：本地 `fonts.css` 加载，禁止使用 Google Fonts CDN
3. **图片路径**：`logo_center.png` 全小写，GitHub Pages（Linux）大小写敏感，HTML 里必须用小写
4. **CSS 变量**：所有颜色/间距用变量，不硬编码；Nav logo Bebas Neue 通过 `!important` 强制指定（正式方案）
5. **中国用户**：避免所有 Google 服务（Analytics/Fonts/reCAPTCHA）；表单用国内替代；数据可视化用 ECharts
6. **Nav Logo HTML 结构**：`<span>BAR<span class="nav__logo-board">BOARD</span></span>` 单 span 包裹防止 flex 间距问题
7. **字幕条（Ticker）**：2份内容拼接，`translateX(-50%)` 无缝滚动，`will-change: transform` GPU 加速
8. **Phase 行布局**：CSS grid `1fr auto auto 76px`（名称/状态/标签/日期四列），空状态用 `visibility:hidden` 占位 badge 保持列宽
9. **BBL 数据自动化**：GitHub Actions 每周六抓取，`[skip ci]` 防止循环触发；`fetch_bbl.py` 同时更新 `data/bbl/bbl-latest.json`、`data/main-page/ticker.json`（BBL条目置顶）、`data/main-page/updates.json`（BBL条目替换并按date排序）；前端只读不写
10. **SEO**：每个页面需独立 `<title>` 和 `<meta description>`
11. **Section 锚点定位**：`.section` 统一设置 `scroll-margin-top: calc(var(--nav-h) - 2px)`，`-2px` 使 nav 完全覆盖 `.section--bordered` 的 `border-top: 1px`（nav 自身含 border-box 内的 border-bottom，两条线完全重合）
12. **Section 高度**：`.barvision` 和 `.lab` 设置 `min-height: calc(100vh - 2 * var(--gap-xl))`，使 section 总高度约为 100vh（padding 由 `.section` 类统一提供，上下各 `var(--gap-xl)`）
13. **DM Mono 无 CJK**：中文标签（如"最高排名"）必须用 `var(--font-body)`，否则字符不渲染。同一父元素内若 ASCII 行用 DM Mono、中文行需另指定字体，在中文子元素加 inline style：`<div style="font-family:var(--font-body);">第 N 期</div>`
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
30. **Ticker JS 化**：`.ticker__track` 由 JS `requestAnimationFrame` 驱动（每帧 `x += speed * dt; if (x >= halfWidth) x -= halfWidth`）。`buildTicker(items)` 从 `data/main-page/ticker.json` 读取条目，生成 ×2 复制后写入 track，调用 `_tickerUpdateHalfWidth()` 更新宽度
31. **UPDATES 数据来源**：`data/main-page/updates.json` 含静态条目 + BV里程碑（`show_after` 字段）+ BBL条目（fetch_bbl.py自动维护）。`renderUpdates()` 过滤 `show_after` 和1年前内容，排序取前5。不再有 `STATIC_UPDATES`/`BV_MILESTONES` 硬编码数组
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
45. **成员页编号规则**：`member/space_id.html`，与 CSV 的 `space_id` 字段一一对应；全部117个已由 `gen_member_pages.py` 生成。`member.html` 为总览入口（已完成）
46. **`@username` 自动解析**：`index.html` 中 `MEMBER_MAP`（键为完整 handle，值为 `{nickname, href}`）+ `parseMentions(raw)` 函数；正则 `/@([\p{L}\p{N}_-]+)/gu` 支持 Unicode 字母数字、下划线、连字符；含尾部连字符的 handle（如 `健Jian-`）用 `.replace(/-+$/, '')` 截断后查表；含中文的 handle（如 `哈哈哈时光机`）直接以完整 handle 为 key；不在 MEMBER_MAP 的保留纯文本
47. **`member.html` 数据维护**：成员数据从 `data/members/members.csv` 动态加载（已废弃硬编码 MEMBERS 数组）。新增/修改成员只需编辑 CSV；建好个人主页后将对应 `space_id` 加入 `BUILT_PAGES` Set（见 #52），对应卡片自动变为可点击链接。
48. **Dev Gate 开关**：`scripts/nav.js` 第8行 `var DEV_GATE = true`，上线时改为 `false` 即完全关闭（无需删代码）。各页面 `<head>` 含防闪内联脚本（sessionStorage key `barboard_dev`，值 `'1'` 表示已通过，关 tab 失效）。gate CSS/HTML/JS 全部封装在 `initDevGate()` 函数内
49. **Dev Gate `visibility` 继承陷阱**：防闪脚本设 `document.documentElement.style.visibility='hidden'`（作用于 `<html>`），子元素全部继承，包括 gate overlay 本身。`initDevGate()` 注入 overlay 后必须立即调用 `document.documentElement.style.visibility=''` 还原，否则 overlay 也不可见
50. **新页面接入 Dev Gate**：新建 HTML 页在 `<meta name="viewport">` 后加一行：`<script>if(sessionStorage.getItem('barboard_dev')!=='1')document.documentElement.style.visibility='hidden'</script>`；nav.js 已自动处理后续逻辑，无需其他改动
51. **member.html CSV 动态加载**：页面通过 `fetch('data/members/members.csv')` 运行时读取成员数据，JS 解析 CSV（含带引号字段处理）。新增/修改成员只需编辑 CSV，无需动 HTML。`parseCSVLine()` 处理引号内逗号；多个 bilibili_id 取第一个；空字段安全跳过。
52. **BUILT_PAGES Set 管理成员页链接**：`member.html` 顶部 `var BUILT_PAGES = new Set([...])` 存放已建成员页的 `space_id`，当前已包含全部117个。运行 `gen_member_pages.py` 后脚本会打印最新 Set 内容，复制粘贴到 member.html 即可。
53. **嵌套锚点陷阱**：卡片外层若为 `<a>`，内部不能再有 `<a>`（Musictrack/Bilibili 链接），浏览器会自动断开外层锚点导致游离元素出现在 grid 中。解法：外层一律用 `<div>` + `onclick="location.href='...'"` 处理导航，内部链接加 `onclick="event.stopPropagation()"` 防冒泡。
54. **member.html 小组色彩系统**：筛选按钮与成员标签 badge 颜色一一对应——全部/无分组：榜吧蓝 `#6F9EC3`；BBL：紫色 `--clr-violet-light`；村摇欧：棕黄 `#D49840`；Indienation：粉色 `--clr-pink-light`。badge 简称：BBL / 村摇欧 / Indie。
55. **member.html 入场动画架构**：hero 元素用 CSS `@keyframes ml-hero-in`（eyebrow 0.05s → 标题 0.16s → 筛选按钮 0.28–0.46s → 搜索框 0.52s）；卡片用自定义 `ml-card-enter`（`opacity:0; translateY(12px); cubic-bezier(0.22,1,0.36,1)`）+ IntersectionObserver。首屏卡片：850ms 后再注册 observer（通过 `getBoundingClientRect().top < vh` 判断）；屏外卡片：立即注册，滚入时触发。计数器：函数顶部 `transition:none; opacity:0` 禁用过渡静默写入内容，双 rAF 后重启过渡，550ms 后淡入。
56. **CSV 异步加载期间 footer 上浮问题**：`fetch('data/members/members.csv')` 为异步操作，加载完成前 `#mlGrid` 为空，页面高度极短，footer 出现在视口内。解法：给 `.ml-section` 加 `min-height: 80vh`，确保 grid 区域未填充时也足够高，footer 始终在视口外。
57. **member.html 搜索框**：`.ml-search` 置于 `.ml-filters` 末尾，`margin-left: auto` 推到行右侧；初始宽 180px，focus 扩展至 220px（`transition: width 0.25s ease`）；placeholder focus 时 `opacity:0` 淡出，光标颜色 `caret-color: var(--clr-violet)`；搜索与分组筛选取交集，`currentSearch` 全局状态与 `currentFilter` 联动，`buildGrid(members, filter, search)` 三参数调用。移动端 `width:100%; margin-left:0`。
58. **member.html 成员排序架构**：CSV 加载完成后按三级键排序——主键 `getRowScore`（0–7，信息行数：有handle+team+foot=7，有handle+foot=6，有handle+team=5，有foot+team=4，仅handle=3，仅foot=2，仅team=1，仅昵称=0），次键 `getMemberScore`（字段完善度各+1），三键 `getTeamPriority`（BBL=4/村摇欧=2/Indie=1 叠加）。`PINNED_NAMES=['雨妈','威妈','羊妈','S妈']` 先提取后置顶，不参与排序。筛选时 hidden class 控制显隐，排序顺序不变。
59. **member.html 计数器 label 动画**：`transform: translateX` 绝对不能直接作用在 flex item 的 label span 本身——会使整个元素偏移压入数字区域。最终方案：旧文字 `transition opacity+transform` 向左滑出淡出（120ms），`setTimeout` 内换文字、snap 到右侧（双 rAF），再 `transition` 向左滑入归位（200ms）。
60. **member.html 计数器数字固定宽度**：`.ml-count__num` 加 `min-width: 3ch; text-align: right`，Bebas Neue 数字宽度一致，3ch 足够容纳最大三位数（117），切换时右侧 label 位置不跳变。
61. **成员页共享模板架构**：CSS 与 HTML 结构统一在 `scripts/member-render.js` 管理；每个 `member/N.html` 仅含 `<head>` 基础引用 + `var MEMBER_DATA = {...}` + 两行 `<script>` 引用（member-render.js 先于 nav.js）。改标题、样式等只需改 member-render.js 一处，所有117页自动更新。`mp-tag--indie` 样式也定义在此文件。
62. **成员页 CJK 头像字体处理**：`member-render.js` 中检测 placeholder 首字符 `charCodeAt(0) > 127`，CJK 字符用 `var(--font-body)` + `font-size:42px; font-weight:700`，ASCII 字符用 `var(--font-display)` + `font-size:48px`，防止 Bebas Neue 无法渲染汉字。
63. **成员页外链按钮布局**：`.mp-card` 三列网格 `auto 1fr auto`；链接列（第三列）`flex-direction:column`，上下等宽排列（width:100%），Bilibili 在上；移动端 `grid-column:1/-1` 跨行横排。
64. **fade-up 与按钮 hover transition 冲突**：`.fade-up` 的 `transition` 规则在 CSS 文件中晚于 `.btn`/`.btn--primary`，同特异度下后者覆盖前者，导致按钮 hover 的 background-position/color/border-color 动画消失。修复：在 media query 内加 `.btn.fade-up.visible { transition: all 0.2s }` 和 `.btn--primary.fade-up.visible { transition: background-position 0.35s ease, box-shadow 0.35s ease }`（三类选择器特异度 30 > 单类 10，精准还原）。
65. **fade-up 入场 transition-delay 污染 hover**：按钮上的 inline `style="transition-delay:0.4s"` 用于入场错排，`.visible` 添加后 delay 持续存在，每次 hover 都要等 0.4–0.6s 才开始动。修复：在 IntersectionObserver 回调中加 `e.target.addEventListener('transitionend', () => { e.target.style.transitionDelay = ''; }, { once: true })`，入场动画结束后立即清除 delay。rightObserver 同理。
66. **sticky sidebar 必须用 align-self: stretch**：sticky 元素的活动范围由其**所在列的高度**决定。若对 grid 列设 `align-self: start`，列高 = 内容高，sticky 元素无活动空间，看起来完全不跟随视口。必须保持默认 `align-self: stretch` 使列高 = grid 行高（= 另一列高度），sticky 才能在整个行范围内跟随滚动。
67. **CSS sticky 在 grid cell 子元素上不可靠**：部分浏览器计算子 sticky 的 scroll range 时，使用父 grid item 的**内容高度**（而非 stretch 后的实际高度），导致 range ≈ 0，sticky 完全失效。`bbl.html` 亮点侧栏改为 JS 实现：`align-self: start` + `will-change: transform`，scroll/resize/ResizeObserver 触发 `computeTarget()` 更新目标位移，rAF + lerp 循环（因子 0.22，`|diff| < 0.5px` 时停止）平滑写入 `transform: translateY`。
68. **`getBoundingClientRect()` 含 CSS transform 偏移**：对有 `fade-up`（`transform: translateY(24px)`）的元素调用 `getBoundingClientRect().bottom`，返回的是视觉位置（含 transform），比布局位置低 24px。用此值计算 sticky 上限，会在 IntersectionObserver 触发 `.visible`（移除 transform）时产生 24px 跳变回弹。**修复**：改用容器 `#bblFullList.getBoundingClientRect().bottom`——容器自身无 transform，返回纯布局底边，稳定不受子条目 fade-up 影响。
69. **bbl.html sticky sidebar 行为设计**：bottom-sticky（`past = (window.innerHeight - 24) − (gr.top + sh)`），sidebar 底边对齐视窗底端 24px 处；上限 `maxTY = listEl.bottom − gr.top − sh + 1`，确保 sidebar 底边不超过 `#bblFullList` 布局底边 +1px；lerp 因子 0.22，rAF 循环仅在有差值时运行，ResizeObserver 监听 grid 高度变化（点击"显示全部"后自动扩展上限）。
70. **bbl.html 亮点卡片点击定位**：`scrollToRank(rank)` 函数——rank > 50 时先展开完整榜单再定位；定位前强制给目标元素加 `.visible`（`transition:none`）以消除 `translateY(24px)` 对 `getBoundingClientRect` 的影响，并确保首次点击 flash 可见；滚动目标 = `el.getBoundingClientRect().top + scrollY - navH`，将条目置于视窗垂直中央（`- (visibleH - el.offsetHeight) / 2`）。
71. **bbl.html 亮点卡片持久高亮**：点击后条目保持高亮（`bbl-rank-active`），下次点击任意处渐出（`bbl-rank-fading` 0.8s）。用持久 document click 监听器 `onDocClickClearHighlight`，在回调里判断 `e.target.closest('.bbl-hl-card--clickable')` 跳过亮点卡自身点击；`_rankListenerAdded` 标志防重复注册；切换不同卡片时旧高亮立即清除（`transition:none`），同一卡片重复点击稳定。
72. **bbl.html 搜索功能**：侧栏顶部搜索框过滤榜单条目（歌名/歌手），`_trackByRank` 映射 O(1) 查找；有输入时自动展开完整 100 首；固定高度 `#bblSearchCount`（`height:14px`）防抖动；DM Mono 无 CJK，count 提示文字必须用 `font-body`。
73. **bbl.html 向上滚动取消动画**：`_scrollingDown` 标志追踪滚动方向，IntersectionObserver 回调中若向上滚则对目标元素 `transition:none` + 强制 `.visible`，rAF 后清除 `transition`，避免向上回滚时条目重新播放入场动画。
74. **全站搜索框统一规范**：`padding: 7px 30px 7px 14px`、`font-weight:500`、`letter-spacing:0.03em`、`border-radius:4px`、focus 时 `border-color: var(--clr-violet)` + `caret-color: var(--clr-violet)`、placeholder focus 时 `opacity:0`。放大镜图标须包在独立 `position:relative` 的 wrapper div 内（而非搜索容器），避免 count/label 子元素影响 `top:50%` 定位。
75. **auto 列中 margin-left 无效**：grid `1fr auto` 中，对 auto 列的 grid item 加 `margin-left` 不会使内容视觉右移——auto 列宽随 margin 同步缩小，内容位置不变。要右移，应减小 chart-item 的 `padding-right`。
76. **fade-up delay 清除正确方案**：`transitionend` + `{ once: true }` 存在竞态——用户在动画完成瞬间 hover 时 delay 尚未清除，且移除 inline style 后 CSS `nth-child` delay 规则重新接管。正确做法：用 `clearDelayAfterAnim(el)` 封装 `setTimeout`，时长 = `parseFloat(el.style.transitionDelay) * 1000 + 250`，到时将 `transitionDelay` 设为 `'0s'`（不是 `''`）。
77. **`.btn--primary.fade-up.visible` 必须包含 opacity/transform**：该规则只写 `background-position` 和 `box-shadow` 时，会以相同特异度覆盖 `.btn.fade-up.visible { transition: all 0.2s }` 中的 opacity/transform，导致 `.btn--primary` 入场动画瞬间跳变而非渐显。必须完整写为 `transition: opacity 0.2s ease, transform 0.2s ease, background-position 0.35s ease, box-shadow 0.35s ease`。
78. **bbl.html 视频框自适应宽高**：`alignVideo()` 用 `getDocTop(el)`（遍历 `offsetTop` 链，不受 CSS transform 影响）测量 h1 顶到 actions 底的高度作为视频框 `height`；再用 `frameH * 16/9 - 4px` 更新 `layout.style.gridTemplateColumns`（`-4px` 补偿视频播放器内部黑边偏差）；`window.load` + `resize` 时触发；768px 以下跳过。
79. **Bilibili iframe 权限与默认静音**：`allow="autoplay; fullscreen; encrypted-media; picture-in-picture; clipboard-write; gyroscope; accelerometer" allowfullscreen`；embed URL 加 `&muted=1` 默认静音。跨域限制下无法从父页面 JS 控制音量/进度，这是平台侧设计，前端无法突破。
80. **HOF 页面数据不 fetch，直接硬编码**：`bbl/hof.html` 的5大板块数据（冠军/纪录/艺人/专辑/未冠）以 JS 常量数组写在 `<script>` 内，无需 fetch CSV，加载即渲染。新页路径层级：`../scripts/nav.js`，`../fonts.css`，`../style.css`。冠军名录含 `VOL_DATES` 内联常量（Vol.1–124 期号→日期），外部索引见 `data/bbl/bbl-vol-index.json`（JSON 对象格式，供 bbl/charts 等页面 fetch）。
81. **文件清理记录**：本次清除 61 个未声明的冗余字体文件（DM Sans 18pt/24pt/36pt 光学尺寸变体、DM Mono 斜体/Light/Medium 变体），`assets/fonts/` 目录从 82 个文件精简至 6 个；同时清除 `about/`、`archive/`、`charts/`、`barboardlab/`（当时空目录）等空目录；清除 `bbl.html` 遗留的 `.breadcrumb` CSS（HTML 已早前移除）。
82. **bbl.html hero CSS animation**：hero 区元素始终在视口内，用 CSS `@keyframes`（非 IntersectionObserver）驱动入场。`cubic-bezier(0.22,1,0.36,1)` 快进慢出，比 `ease` 更有质感。`.bbl-video` 已从 `fade-up-right` 改为 CSS animation，移除了 inline `transition-delay`。各元素延迟：eyebrow 0s → 标题 0.08s → meta 0.18s → 描述 0.26s → 按钮 0.35s → 视频卡 0.20s → 水印 0.30s（1.4s）。
83. **CSS `columns` 多列瀑布流**：`columns: N; column-gap: Xpx` 实现类瀑布流布局，浏览器自动平衡各列高度。子卡片必须加 `break-inside: avoid` 防止跨列截断；子卡片间距用 `margin-bottom`（不能用父容器 `gap`，`columns` 不支持）。移动端用 `columns: 1` 回退。已用于 `bbl/hof.html` 冠军名录三列布局、单周个人榜冠军数双列布局。
84. **HOF 金银铜配色系统**：全站约定金 `var(--clr-gold-light)`、银 `#90b8d0`、铜 `#e0a870`。在 `bbl/hof.html` 中冠军名录前三组（15/11/10周）及对应的 `.hof-group--gold/silver/bronze` class 应用此色系；`hof-group__num` 和 `hof-group__count`（X首）均随 tier 变色；无 tier 的组默认 `var(--clr-text-2)`。
85. **动态渲染元素的 fade-up 错落方案**：`hof.html` build 函数（`buildRecordsGrid`/`buildNo1Groups` 等）在页面底部 `fadeObserver` 设置之前运行，因此在 build 函数内为动态生成的元素加 `class="fade-up"` + inline `transition-delay`，`document.querySelectorAll('.fade-up')` 调用时已能抓到这些元素。容器级 `fade-up` 移除，改为逐条目 `i * 0.06s` 或 `i * 0.07s` 错排，参考 member.html 的 `ml-card-enter` 卡片动画风格（`cubic-bezier(0.22,1,0.36,1)`）。
86. **HOF 页内 TOC 设计**：`bbl/hof.html` 专属，固定右下角 `right: 19px; bottom: 90px`（back-to-top 上方），文字右对齐，`border: none`，active 状态用 5px 紫色呼吸圆点（`::after` 伪元素，`animation: toc-breathe 3s ease-in-out infinite`，scale 0.65→1 + opacity 0.35→1）；非 active hover 变 `--clr-text`；**IO suppression**：点击时立即高亮目标项并设 `suppressIO = true`，scroll 事件停止 200ms 后自动清除，防止滚动途经其他 section 时高亮跳动；移动端隐藏。
87. **hof.html OWNER_MAP**：`bbl_07_most_weekly_no1.csv` 中 owners 字段使用成员昵称首字（如"邓"/"S"/"T"），在 hof.html `<script>` 内定义 `OWNER_MAP` 常量映射至 `{id, handle, nickname}`，渲染时通过 `fmtOwners()` 输出 `<a class="member" href="../member/ID.html" data-nickname="昵称">@handle</a>` 链接，享受 nav.js tooltip 支持。
88. **hof.html section 标题字号统一**：所有 `.section__title` 在 hof.html 内统一加 inline `font-size:clamp(18px, 2.4vw, 28px)`，覆盖 style.css 默认值，保持 HOF 页内各 section 视觉一致。
89. **在榜周数纪录布局设计**：左列（`1.65fr`）为完整总在榜周数排行（`CHARTED_FULL`，12条），前三名金银铜配色；右列（`2fr`）为 `hof-records-right` 2×2 网格（Top3/5/10/50 四张卡片，`show:false` 保留 Top20 数据但不渲染）。左侧主卡片 `.hof-record-card--full`：紫色边框（`rgba(168,85,247,0.38)`）+ 渐变底色 + 外发光 + `overflow:hidden`；行背景全宽通过 `margin: 0 -20px; padding: 9px 20px` 实现（需卡片有 `overflow:hidden`）。周数相同的条目用 `computeRanks()` 计算并列名次。val 末尾 `*` 通过检测 `hasAst` 剥离后以 `<span class="hof-record-ast">` 加到歌名末尾。
90. **data-tooltip 条目级注释**：在数据对象加 `note` 字段，渲染时写入 `data-tooltip` 属性，页底用 IIFE 事件委托实现 tooltip（复用 `.member-tooltip` / `.member-tooltip--visible` CSS）。与 nav.js member tooltip 完全同款，follow 鼠标 `(clientX+16, clientY)`，opacity 0.18s fade。
91. **无冕高分（未夺冠单曲单周点数纪录）板块设计**：`UNCROWNED`（15条）含 `artist/song/pts/rank/vol` 五字段，vol 通过 `VOL_DATES` 查日期再 `fmtDebutDate()` 格式化；双列 `.hof-uncrowned-grid`（`1fr 1fr`，左8右7），各自独立卡片含 border 与 overflow:hidden；行网格 `22px auto 1fr auto auto`（排名/点数/歌曲/日期期数/位次）；点数整数 24px Bebas + 小数 13px 0.6透明；日期两行（ASCII 用 mono，中文「第N期」加 `font-family:var(--font-body)` inline style）；位次标签 `#2` 银色、`#3` 铜色、其余默认。移动端隐藏点数和日期列。
92. **bbl-record CSV 编号规范**（截至当前）：`bbl_01` 冠单名录 / `bbl_02` 在榜周数纪录（合并版，含 Category 列）/ `bbl_03` 2000点以上单曲 / `bbl_04` 无冕高分点数 / `bbl_05` 最多上榜次数（16期+）/ `bbl_06` 单期最强榜 / `bbl_07` 单周个人榜冠军数 / `bbl_08` 单周专辑进榜（7首以上，字段：number/artist/album/rate）/ `bbl_09` 艺人单周进榜单曲峰值（10首以上，字段：number/artist/volume）/ `bbl_10` 艺人累计进榜单曲数（字段：Singles/Artist）/ `bbl_11` 艺人累计在榜周数（字段：Weeks/Artist）。
93. **hof.html 双列板块动画规范**：`.hof-uncrowned-grid` / `.hof-no1-wrap` 容器本身不加 `fade-up`，由 JS 在 `innerHTML` 中给左右两列 `.hof-uncrowned` / `.hof-no1-group` 各自加 `fade-up`（左0s，右0.07s），与 `buildRecordsGrid()` 的 `renderCard` delay 模式一致。点数纪录、无冕高分、单周N榜助攻均采用此模式。
94. **hof.html 助攻纪录（buildMostCharts）**：容器 `.hof-no1-wrap`（columns:2）；`.hof-group` 分组卡（金银铜 n=19/18/17）内部使用 `.hof-no1-entry` 条目样式（歌名+歌手 head + 出现记录行）；同一 n 组内相同歌曲合并，多条出现日期放入 `.hof-charts-occs`（`flex nowrap`，`gap: 2px 12px`），每条为固定宽度 `flex: 0 0 170px` 的 `.hof-charts-occ`，名次用 `.hof-charts-rank` 内联色（金/银/铜）紧随日期文字；`.hof-group .hof-no1-entry__head { padding-bottom: 0 }` 压缩歌名到日期的间距至 1px。
95. **hof.html 最强N榜（buildSingleChart）**：复用 hof-uncrowned 样式，但 badge（「N榜」）移至第一列、去掉序号列，用 `#hofSingleChart .hof-uncrowned-row { grid-template-columns: auto auto 1fr auto }` 覆盖默认 5 列 grid；移动端覆盖为 `auto 1fr`；无金银铜配色；N=17 行 CSV 空白已补填为 Taylor Swift — The Fate of Ophelia（据 pts/date 核实）；QWER 曲目韩文因终端编码乱码，暂用英文副标题「My Name is Malguem」，需核实后更新。
96. **hof.html 单周专辑进榜纪录（buildAlbums）**：数据来自 `bbl_08_albums_most_charted.csv`（35条，7首以上），改用 `hof-group` 瀑布流（容器 `hof-roll`，`columns:3`）而非旧的双列表格；按进榜单曲数分组（共9组，降序），前三组金银铜；卡头显示「X首」（Bebas Neue 数字 + `hof-group__label` 「首」），每行：专辑名 + 歌手（`hof-group-song__title/artist`）+ 进榜率（`hof-group-song__rate`，mono 11px，金/银/铜行各自 rgba 0.65 配色）；`hof-group-song__rate` 为 HOF 专属新类，定义于 `<style>` 块内。
97. **hof.html 艺人进榜纪录（buildArtistCols）**：三列 `.hof-three-col`（`1fr 1fr 1fr`，`align-items:start`，移动端折叠为单列），动画错排 `0s / 0.12s / 0.24s`。列1「单周进榜单曲数」：`.hof-peak-card`，数据来自 `bbl_09`（23条，艺人+峰值+日期），用 `hof-table-row--3col` 行（22px / 1fr / auto / auto），日期+期数合并为单行 `hof-table__rate`（ASCII mono + 中文 font-body span），移动端隐藏日期列；列2「累计进榜单曲数」（`bbl_10`，13条）+ 列3「累计在榜周数」（`bbl_11`，11条）均用 `hof-table-row--2col`。金银铜通过 `hof-table-card .hof-table-row:nth-child(2/3/4)` 实现（`hof-table-card__head` 占 child(1)，数据行从 nth-child(2) 起），覆盖行背景、分隔线色、idx/name/val 三元素颜色。

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
