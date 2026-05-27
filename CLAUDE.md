# Barboard Website — Claude Code 工作交接文档

## 项目概览

**网站名称**：Barboard 官网（barboard.space）
**性质**：欧美流行音乐个人榜吧（简称榜吧）社区官网，前端静态部署（HTML/CSS/JS），无自建后端，交互功能通过前端 JS + 第三方服务实现
**主要受众**：社区内部成员（中国大陆为主）+ 对欧美音乐感兴趣的外部访客

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
- `index.html` — 首页（基本完成，存在字体问题待修复，见下方）
- `style.css` — 全站样式（1381行，含完整设计系统）
- `fonts.css` — 本地字体声明

### 待建页面
- `about.html` — 关于榜吧完整历史
- `barboardlab.html` — BBL 活动介绍 + 最新榜单
- `barboardlab/hall-of-fame.html` — BBL 荣誉殿堂
- `barboardlab/charts/` — 年度榜单存档（按年）
- `barvision.html` — Barvision 总览 + Hall of Fame
- `barvision/2026/events.html` — 2026届赛事详情（**最紧迫，6月1日开启提交通道**）
- `barvision/2026/results.html` — 2026届赛果（赛后填充）
- `barvision/2026/news.html` — 2026届公告
- `barvision/2025/events.html` 等历届页面
- `archive.html` — 存档中心总览
- `archive/barammy.html` — 吧莱美存档
- `archive/esc-voting-party.html` — ESC Voting Party 存档

---

## 文件结构

```
barboard-space/
├── index.html              ← 唯一主页
├── style.css               ← 全站样式
├── fonts.css               ← 本地字体 @font-face
├── about.html
├── barboardlab.html
├── barvision.html
├── archive.html
│
├── barboardlab/
│   ├── hall-of-fame.html
│   └── charts/
│       ├── 2026.html
│       └── 2025.html
│
├── barvision/
│   ├── 2026/
│   │   ├── events.html     ← 最紧迫
│   │   ├── results.html
│   │   └── news.html
│   └── 2025/
│       ├── events.html
│       ├── results.html
│       └── news.html
│
├── archive/
│   ├── barammy.html
│   └── esc-voting-party.html
│
├── data/                   ← 未来 JSON 数据层
│
└── assets/
    ├── fonts/
    │   ├── Bebas_Neue/BebasNeue-Regular.ttf
    │   ├── DM_Mono/DMMono-Regular.ttf
    │   └── DM_Sans/static/
    │       ├── DMSans-Regular.ttf
    │       ├── DMSans-Medium.ttf
    │       ├── DMSans-SemiBold.ttf
    │       └── DMSans-Bold.ttf
    ├── images/
    │   └── logo_center.png   ← 注意：实际文件名为小写
    ├── banners/
    │   ├── barvision/
    │   └── barammy/
    └── icons/
```

---

## 设计系统

### 品牌色彩（CSS 变量，定义于 style.css :root）

```css
/* 背景层 */
--clr-bg:         #080812;   /* 极深午夜蓝黑，主背景 */
--clr-bg-2:       #0c0c18;
--clr-bg-3:       #10101e;
--clr-surface:    #141422;   /* 卡片/面板背景 */
--clr-surface-2:  #1a1a2e;

/* 描边 */
--clr-border:     rgba(180,160,255,0.14);
--clr-border-2:   rgba(180,160,255,0.26);

/* 主强调色 — 电蓝 */
--clr-accent:       #00b4ff;
--clr-accent-light: #33c6ff;

/* 次强调色 — 霓虹粉 */
--clr-pink:         #e040a0;
--clr-pink-light:   #f060b8;

/* 中间调 — 软紫 */
--clr-violet:       #a855f7;
--clr-violet-light: #c084fc;

/* 金色（排名/奖项）*/
--clr-gold:       #c8982a;
--clr-gold-light: #e0b040;

/* 文字 */
--clr-text:       #f0eeff;   /* 主文字 */
--clr-text-2:     #8880a8;   /* 次要文字 */
--clr-text-3:     #8880a8;   /* 弱化文字（与 text-2 相同，部分场景硬编码 #6a6488）*/
```

**配色来源**：Barvision 2026 opening credits 视频——极深蓝黑背景，蓝→紫→粉霓虹线条，克制的四角光晕漫反射。

**整体视觉风格**：赛博朋克/霓虹风，契合 Barvision 2026 举办地重庆（主题 Echoing Confluence）。体现在：`text-shadow` 辉光、多层 `radial-gradient` 背景光晕、渐变按钮默认发光、字幕条 `#4c18a0→#6F9EC3` 紫蓝渐变。

### 字体
- **Bebas Neue**（`var(--font-display)`）：所有大标题、Logo、展示性数字
- **DM Sans**（`var(--font-body)`）：正文、导航、按钮、描述文字
- **DM Mono**（`var(--font-mono)`）：日期、期数、数据等等宽场景

字体通过 `fonts.css` 本地加载（不用 Google Fonts，因为用户主要在中国大陆）。

### 间距系统
```css
--gap-xs: 8px
--gap-sm: 16px
--gap-md: 32px
--gap-lg: 64px
--gap-xl: 96px
--max-width: 1200px
--nav-h: 72px
```

### 按钮样式
- **`.btn--primary`**（渐变填充）：紫→深紫渐变（`background-size: 250%`，`background-position: right`），hover 时滑到左侧粉色区，`transition: 0.35s`；默认带紫色 glow
- **`.btn--outline`**：透明背景，白色描边；文字带 65% 透明度，hover 时恢复不透明
- **Nav CTA**（`.nav__cta`）：同 btn--primary 的 background-position 滑动方案

### 主题语（Barvision 2026）
- 中文：**声汇两江**
- 英文：**Echoing Confluence**

---

## 首页结构说明（index.html）

```
<nav>                         导航栏（fixed）
  Logo | About Barvision BarboardLab Archive Musictrack | [Barvision 2026 渐变按钮]

<div class="ticker">          WHAT'S NOW 滚动字幕条（在 hero 内部，absolute bottom:0）

<section class="hero">        第一屏（height: 100vh）
  左侧 .hero__left            eyebrow + BAR/BOARD 大标题 + 描述 + 按钮
  右侧 .hero__right           最新动态 UPDATES 标题 + 5条动态列表

  .hero__scroll-hint          向下滚动查看更多（双箭头动画，滚动时渐隐）

<section class="lab">         BarboardLab 版块
  BBL 介绍 + 按钮 | BBL #124 Top 10 榜单

<section class="barvision">   Barvision 版块
  赛事介绍 + 历届列表 | Barvision 2026 赛事卡片 + 赛程 + 倒计时

<footer>                      页脚
```

---

## Barvision 2026 关键信息

- **届次**：第十六届
- **主办**：@williw（Bilibili 用户名）
- **主题语**：声汇两江 · Echoing Confluence
- **主办城市**：重庆（Chongqing）
- **歌曲提交通道**：2026年6月1日00:00开启，7月19日24:00截止
- **赛程**：
  - 歌曲提交：6/1 - 7/19
  - Semi-Final 1 投票：7/25 - 7/31
  - 附加赛投票：7/25 - 8/7
  - Semi-Final 2 投票：8/1 - 8/7
  - SF 直播：8/8 晚
  - Grand Final 投票：8/8 - 8/16
  - Grand Final 直播：8/22 晚
- **投票方式**：评委票（Jury Vote，Top 10，12/10/8/7/6/5/4/3/2/1分）+ 观众票（Tele Vote，20票自由分配）各占50%
- **附加赛**：认可票（Approval Vote），每人3票，现场实时投票
- **晋级规则**：每场半决赛前8名晋级，东道主直通，附加赛胜者1名，决赛共18首
- **冠军奖励**：获得 Barvision 2027 主办权
- **参赛规则文件**：Rulebook Ver. 260305（已完整读取，见 PDF）
- **表单邮件接收**：liu.zhuoq@northeastern.edu

---

## 外部链接

- **Musictrack**：https://musictrack.cn — 成员发布个人周榜的平台
- **BBL 完整榜单**：https://musictrack.cn/chart/3045/
- **原 Notion 网站**（参考）：https://barboard.notion.site/23e014c223f980de9956f37802553188

---

## 开发注意事项

1. **字体**：使用本地 `fonts.css` 加载，不使用 Google Fonts CDN（用户在中国大陆）
2. **图片路径**：注意 `logo_center.png` 实际文件名全小写，但代码里有时写成 `Logo_Center.png`，Windows 不区分大小写，部署到 Linux 服务器时会出问题，建议统一为小写
3. **CSS 变量**：所有颜色、间距都用变量，不要硬编码色值；Nav logo Bebas Neue 字体通过 `!important` + 完整 fallback 链强制指定（这是正式方案，不是临时硬编码）
4. **语言**：网站内容中英文混合，中文内容面向社区成员，英文用于品牌和活动名称
5. **可扩展性**：`data/` 目录预留给 JSON 数据层，用 JS `fetch` 在前端动态渲染榜单、赛果、搜索过滤等交互，无需后端
6. **Nav Logo HTML 结构**：文字部分必须包在单个 `<span>` 内（`<span>BAR<span class="nav__logo-board">BOARD</span></span>`），避免 flex container 将文字节点拆成多个匿名 flex item 产生额外间距
7. **字幕条（Ticker）**：使用 2 份内容拼接（而非 4 份），动画位移精确为 `translateX(-50%)`，确保首尾无缝衔接；`will-change: transform` 启用 GPU 合成

8. **计划中的交互功能**：
   - 歌曲提交表单 → Tally.so / Formspree 接收，发送至 liu.zhuoq@northeastern.edu
   - 榜单/赛果搜索过滤 → 前端 JS 读取 data/*.json 实现
   - 数据可视化（榜单走势、投票数据图表）→ ECharts（国内访问友好）或 D3.js
   - 地图交互（如参赛城市分布）→ ECharts Map
   - 实时投票功能如需防作弊存储 → 届时接入 Supabase 或类似 BaaS 服务
9. **SEO**：每个页面需要独立的 `<title>` 和 `<meta description>`
