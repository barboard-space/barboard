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
  - **BarboardLab（BBL）**：2024年3月13日创立，每周六更新，成员提交完整个人周榜合并积分，当前已到第125期，完整榜单在 [musictrack.cn/chart/3045/](https://musictrack.cn/chart/3045/)
  - **Barvision**：年度歌曲大赛，灵感来自 Eurovision，成员选送小众歌曲参赛，2019年创立（当年办了5届），2020年7届，2021-2022停办，2023年恢复改为一年一届，当前为**第十六届 Barvision Chongqing 2026**
- **已停办活动**（存档保留）：吧年榜/半年榜（2013-2024）、吧莱美（2021-2024）、Eurovision China Voting Party（2022-2025）

---

## 当前网站状态

### 已完成
- `index.html` — 首页（完成，经过多轮 session 深度打磨，详见开发注意事项）
- `style.css` — 全站样式（含完整设计系统）
- `fonts.css` — 本地字体声明
- `CHANGELOG.md` — 版本更新日志
- `barvision/2026/events.html` — Barvision 2026 赛事页（已完成；**歌曲报名通道已上线**：自定义表单 + EmailJS 发邮件，非问卷星，详见 #127；已接入 nav.js；已按 Rulebook Ver. 260530 全面更新：附加赛资格赛双阶段结构、在线表单提交方式、ELIGIBILITY 新增 Eurovision 排除条款 + 个人榜助攻规则、全站"复活赛"→"附加赛"）
- `member.html` — Members 总览页（119位成员，**动态 fetch `data/members/members.csv`** 渲染，4档过滤 + 名称搜索框，卡片含 Bilibili·Musictrack 外链，hover 紫色光效，完整入场动画序列）
- `member/7.html` — @williw_（威妈）成员主页（头像"威"占位、BarboardLab+村摇欧共体标签、Bilibili/Musictrack 右上角竖排按钮、"代表成绩"区）
- `member/N.html``member/N.html`（119个）— 全体成员个人主页，由 `scripts/gen_member_pages.py` 从 CSV 批量生成，每页仅含 `MEMBER_DATA` 数据对象，样式与逻辑全部由 `scripts/member-render.js` 注入
- `scripts/member-render.js` — 成员页共享模板：注入 CSS、读取 `window.MEMBER_DATA`、渲染 hero+Works 两节、处理 CJK/ASCII 头像字体、设置 fade-up 动画
- `scripts/gen_member_pages.py` — 成员页批量生成脚本：读 CSV → 输出 119 个 `member/N.html`；数据变动时重新运行
- `data/bbl/bbl-latest.json` — BBL 最新榜单数据（真实 API 数据，自动更新）
- `data/bbl/bbl-vol-index.json` — Vol.1–125 期号→日期索引（对象格式，`{"1":"2024-01-05",...}`，供 bbl/charts 等页面引用）
- `data/bbl/bbl-record/hof_data.json` — BBL HOF 全部数据（13个板块：champions/charted_full/charted_records/artists_peak/artists_songs/artists_weeks/albums/most_points/single_chart/most_charts/uncrowned/owner_map/no1_records）；今后更新 HOF 数据只需编辑此文件
- `data/members/members.csv` — 全体成员信息（昵称、ID名、小组、B站ID、Musictrack）
- `scripts/fetch_bbl.py` — BBL 抓取脚本（label 映射已修正；使用 `curl_cffi` 伪装 Chrome TLS 指纹绕过 Cloudflare）
- `.github/workflows/update-bbl.yml` — 每周六自动更新 BBL 数据（已修复：`permissions: contents: write`；`git add` 包含 ticker/updates；curl_cffi 已验证可正常 fetch + push）
- **Dev Gate** — `scripts/nav.js` 顶部 `DEV_GATE`/`DEV_PASS` 控制，各页面 `<head>` 含防闪内联脚本（详见开发注意事项 #48–50）
- `bbl.html` — BBL 专题页（已完成，含 hero + Bilibili 视频自适应尺寸 + 亮点 JS-sticky 侧栏 + 完整榜单 + 搜索，详见开发注意事项 #64–69, #76–80）
- `bbl/hof.html` — BBL 荣誉殿堂（已完成，**9大板块**（顺序）：冠单名录 → 在榜周数纪录 → 点数纪录 → 无冕高分 → 助攻纪录 → 最强N榜 → 个人榜冠军纪录 → 单周专辑进榜纪录 → 艺人进榜纪录，数据截至第125期；**数据已迁移至 `data/bbl/bbl-record/hof_data.json` 动态加载**，HTML 内只有空 `let` 声明；async IIFE `Promise.all` fetch `bbl-vol-index.json` + `hof_data.json` 后渲染；页内 TOC（右侧固定，呼吸点指示器，IO suppression）；各板块卡片/条目均有 `fade-up` 错落入场动画；详见开发注意事项 #80–97, #114）
- `barvision.html` — Barvision 总览（已完成，大幅重设计，详见开发注意事项 #100–102）
- `barvision/hof.html` — Barvision Hall of Fame（数据已按 Notion 截图全面补全；hero 金色主题 + 4 section：吧视先锋奖 / 赛季纪录 / 数据纪录 / 特别奖项；每 section 分**常规版 / 娱乐版**两组（`.bv-ver` 小标题）；卡片 `.bv-card`（label/val/who + `.bv-card__entries` 条目，条目含 `@member` 链接 + 歌曲 + `.bv-session` 场次徽章 + `.bv-entry--old`「旧」划线保留被刷新的旧纪录）；数据纪录区有**场次代码图例**（A 小众/B 中众/C 大众/SF/GF/E 娱乐；如 7A=第7届小众组）；MEMBER_MAP + fmtMember/fmtWho；页内 TOC 四项；数据源 `data/barvision/bv_hof_data.json`（富嵌套，手工维护，见 #119）；渲染函数 `renderEntry/renderRecordCard/renderAwardCard/buildVersioned` 均全局）
- `archive.html` — 活动存档总览（已完成；hero 榜吧蓝主题 + `BARBOARD` 水印；两节：常规活动（BBL/Barvision 2列卡）+ 过往活动 Legacy（年榜/吧莱美/ECVP 3列卡）；卡片动画 `cubic-bezier(0.22,1,0.36,1)` 0.55s stagger `i×0.07s`；Legacy 卡 opacity 0.82 降调；详见开发注意事项 #107）
- `barvision/2026/events.html` — Barvision 2026 赛事详情页（**已重做完成**；对标 barvision.html 视觉风格；含 hero（← Barvision 眉链 + CSS 动画 + watermark + 倒计时 + 更新日期）+ 歌曲报名（locked/open 面板 + deadline bar grid）+ SCHEDULE 三阶段表格时间线 + VOTING（Jury 评分格 + Tele + Approval）+ ELIGIBILITY（平台数据表 + 歌曲/艺人/专辑要求）+ RULEBOOK（6卡）+ TOC（5项，紫色，IO suppression）；`const FORM_URL = ''` 待填入；详见开发注意事项 #108–111）
- `barvision/2019/regular-01.html` — **Barvision 历届详情页（第一届，已完成，模板基准）**；薄壳 + 共享 `scripts/bv-results-render.js` + `data/barvision/barvision-2019/regular-01.json`；板块 赛制/结果概览/Scoreboard 矩阵/12 Points + 页内 TOC；可点表头排序、桌面+手机两端已打磨；解析脚本 `scripts/parse_bv_edition.py`；详见开发注意事项 **#130**。barvision.html 届次卡 Ⅰ 已接入链接（`BUILT_EDITIONS`）

### 待建页面（按优先级）
- **Barvision 历史成绩数据体系（进行中，见 #129）**：完整赛果表（逐届录入）+ 历届详情页（从 barvision.html 届次卡片点入）+ 成员主页「吧视」板块 + HOF 历届前三改版 + 数据核对
- `about.html` — 关于榜吧完整历史
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
├── DESIGN.md               ← 设计系统（令牌/配色地图/字号间距阶梯/断点/组件命名速查）
├── styleguide.html         ← 设计标准（noindex）：Foundation 审计可视化 + Elements + Components
├── styleguide-data.js      ← styleguide Foundation 渲染数据（audit 脚本生成）
├── DESIGN_AUDIT.md         ← 设计值审计详表（audit 脚本生成）
├── CNAME                   ← barboard.space（GitHub Pages 自定义域名，勿删）
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
│   ├── gen_member_pages.py ← 批量生成 member/N.html（读CSV，运行一次）
│   ├── bv-results-render.js ← Barvision 历届详情页共享渲染（见 #130）
│   └── parse_bv_edition.py  ← 解析每届 Excel → 详情页 JSON（见 #130）
│
├── partials/
│   ├── nav.html            ← nav HTML 可读备份（与 nav.js 内容同步）
│   └── footer.html         ← footer HTML 可读备份（与 nav.js 内容同步）
│
├── data/
│   ├── bbl/
│   │   ├── bbl-latest.json     ← BBL 最新榜单（自动更新，含真实数据）
│   │   ├── bbl-vol-index.json  ← Vol.1–125 期号→日期索引
│   │   └── bbl-record/
│   │       └── hof_data.json   ← BBL HOF 全部数据（13板块，动态加载）
│   │   └── bbl-record/         ← BBL 原始数据文件（CSV 等）
│   ├── main-page/
│   │   ├── ticker.json         ← 字幕条目（字符串数组，BBL条目由fetch_bbl.py维护）
│   │   └── updates.json        ← 动态条目（对象数组，BBL条目由fetch_bbl.py维护）
│   ├── members/
│   │   └── members.csv         ← 全体成员信息
│   └── barvision/
│       ├── barvision-archive/  ← Barvision 历届存档（领奖台 only CSV，见 #129）
│       ├── barvision-2019/     ← 详情页每届 JSON（regular-01.json…，见 #130）
│       └── bv_hof_data.json    ← Barvision HOF 数据（富嵌套，手工维护，见 #119）
│
├── bbl/
│   └── hof.html            ← BBL 荣誉殿堂（已完成）
│
├── member/
│   ├── 7.html              ← @williw_（威妈）成员主页（已完成）
│   ├── 12.html … 770.html  ← 全部119位成员主页（gen_member_pages.py 生成）
│   └── …
│
├── barvision/
│   ├── 2026/
│   │   ├── events.html     ← 已完成，已接入 nav.js，待填表单 URL
│   │   ├── results.html
│   │   └── news.html
│   ├── 2019/
│   │   └── regular-01.html ← 第一届详情页薄壳（已完成，模板基准，见 #130）
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
    │   ├── logo_center.png          ← 全小写，Linux 大小写敏感
    │   ├── barvision_logo_2026.svg  ← 全白路径+蓝渐变钻石徽章（1557×660，2.36:1）；已放置于 barvision.html hero右列 + XVI卡右列 + events.html hero
    │   ├── barvision_logo_2025.svg  ← 已用于 barvision.html 2023-2025 存档卡
    │   ├── barvision_logo_2024.svg
    │   └── barvision_logo_2023.svg
    ├── banners/
    └── icons/
```

---

## BBL 数据层

- **API**：`https://6api.musictrack.cn/api/charts/3045`（React SPA 后端接口，直接返回 JSON）
- **注意**：有反爬限制（X-Anticrawler-Limit: 420），每周只抓一次，不要频繁请求
- **workflow 触发时间**：周六 19:00 UTC（北京时间周日 03:00）主抓 + 周一 04:00 UTC（北京时间 12:00）备用；备用触发时先检查 `git log --since="2 days ago"` 判断主抓是否已提交，成功则跳过
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

## 数据架构原则

本网站是榜吧社区统一门户，涉及大量数据归档与查询，数据更新频繁。**所有涉及数据的页面设计必须遵循以下原则：**

### 核心原则
1. **动态加载，不硬编码**：所有数据（榜单、成员、赛果等）必须从数据文件动态 fetch，不在 HTML/JS 中硬编码。数据更新时只改数据文件，无需改页面代码。
2. **CSV 为原始数据源，JSON 为展示缓存**：原始数据以 CSV 维护（易手动编辑、可版本对比），前端 fetch 的 JSON 由脚本从 CSV 生成，不允许绕过脚本直接手动编辑 JSON 的纯数据字段。
3. **更新 CSV 后必须运行同步脚本**：`python scripts/sync_hof_data.py --write`，然后 git add + commit。跳过此步会导致 CSV 与 JSON 不一致（正是 bbl_11 未同步的根因）。
4. **新数据模块同理**：日后添加 Barvision 赛果、成员统计等数据模块，同样遵循「CSV → 同步脚本 → JSON → 前端 fetch」流程。

### `scripts/sync_hof_data.py` 使用说明

```
python scripts/sync_hof_data.py           # dry run，只显示 diff
python scripts/sync_hof_data.py --write   # 写入 hof_data.json
```

**自动同步的字段**（来自 CSV，脚本全量覆盖）：

| JSON 字段 | 来源 CSV | 说明 |
|-----------|----------|------|
| `charted_full` | bbl_02（Category=charted 行） | 保留已有 `note` 字段 |
| `charted_records` | bbl_02（其他 category 行） | 保留已有 `show` 开关 |
| `most_points` | bbl_03 | 全部 2000 分以上记录 |
| `uncrowned` | bbl_04 | 日期通过 bbl-vol-index.json 转换为 vol 号 |
| `most_charts` | bbl_05 | |
| `single_chart` | bbl_06 | |
| `no1_records` | bbl_07 | |
| `albums` | bbl_08 | |
| `artists_peak` | bbl_09 | |
| `artists_songs` | bbl_10 | |
| `artists_weeks` | bbl_11 | |

**不被脚本覆盖的字段**（人工维护）：

| JSON 字段 | 原因 |
|-----------|------|
| `champions` | 需跨 bbl_01 多行聚合计算，人工整理 |
| `owner_map` | 成员 key→id/handle/nickname 手动映射 |
| `charted_full[].note` | 手动添加的备注说明 |
| `charted_records[].show` | 控制各分组是否在 HOF 页显示 |

### CSV 数据质量规范
- 文件编码：**UTF-8（含 BOM）**，禁止 Windows-1252/GBK（会导致 É、Ó、韩文等特殊字符损坏）
- 不得用"留空=沿用上行"的电子表格惯例——每行必须填写完整的 artist/song 字段
- 艺人名中的特殊字符（ROSÉ、ROSALÍA、Sigríður 等）必须正确录入 UTF-8，不得简化为 `?` 或 ASCII 替代

---

## 设计系统

> **权威文档 = `DESIGN.md`**（设计令牌 / 配色用途地图 / 字号·间距阶梯 / 屏幕断点 / 组件与命名速查）。`styleguide.html` 为开发用实时组件库 + 可视化。以下只留速记，详值与用法以 DESIGN.md 为准——改令牌只改一处、勿在本文件复制。

### 速记
- **令牌**（`style.css :root`）：颜色 `--clr-*`（电蓝 accent / 霓虹粉 pink / 软紫 violet / 金 gold + bg/surface/border/text）、字体 `--font-display`(Bebas Neue 大标题数字) / `--font-body`(DM Sans 正文+中文) / `--font-mono`(DM Mono 日期数字，无 CJK)、间距 `--gap-xs/sm/md/lg/xl`(8/16/32/64/96)、`--max-width:1200px`、`--nav-h:72px`（移动端 56px）。字体本地 `fonts.css` 加载（不用 Google Fonts）。
- **整体风格**：赛博朋克/霓虹风，契合 Barvision 2026 重庆主题。
- **断点**（详见 #124）：手机 ≤768 / 平板 769–1024（继承桌面）/ 桌面 ≥1025。

### 主题语（Barvision 2026）
- 中文：**重声交响**　英文：**Echoing Confluence**

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

- **届次**：第十六届　**主办**：@williw_　**主题语**：重声交响 Echoing Confluence（中文简称"吧视"）
- **主办城市**：重庆（Chongqing）
- **赛程**：
  - 歌曲提交：6/1（北京时间 18:00 开启）— 7/19
  - 附加赛资格赛投票：7/25 — 8/7
  - Semi Final 1 投票：7/25 — 7/31
  - Semi Final 2 投票：8/1 — 8/7
  - Semi Final 暨附加赛直播：8/8 晚
  - Grand Final 投票：8/8 — 8/16
  - Grand Final 直播：8/22 晚
- **投票方式**：Jury Vote（Top 10，12分制）+ Tele Vote（20票自由分配）各50%
- **附加赛**：Approval Vote，每人3票
- **晋级规则**：每场半决赛前8名晋级，东道主直通，附加赛胜者1名，决赛共18首
- **歌曲提交表单（已上线）**：events.html 自定义表单 + **EmailJS** 发邮件，报名发到 **william115zq@gmail.com**（设在 EmailJS 模板 To Email）。详见 #127。

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
15. **歌曲引用格式**：全站统一使用「艺人 — 歌名」格式，不使用书名号。**多艺人合作曲规范**（已与用户确认）：① **lead + feat**：feat 歌手以 `(feat. X)` 写进**歌名**，主歌手放艺人位（例：`Charlie Charles` — `Calipso (with Dardust) (feat. Sfera Ebbasta, Mahmood & Fabri Fibra)`；非 feat 的合作者用 `(with X)`）；② **多位 lead，或 feat 含多位**：2 位用 `A & B`，>2 位用牛津式 `A, B, C & D`（末位 `&`，其余逗号）；③ **原始数据常用 `/` 堆叠艺人、无 lead/feat 之分**——遇同一首歌多位艺人**必须先向用户确认** lead/feat 归属再录入，不可擅自判定。正字法须正确（Röyksopp / Susanne Sundfør / VanJess / GoldLink 等，禁 ASCII 简化，参 #119）。改赛果 JSON 后重跑 `gen_member_pages.py` + `gen_bv_editions_index.py` 同步。
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
27. **GitHub Actions fetch**：fetch_bbl.py 遇到 403 时 exit 0（保留旧数据，workflow 不报红）；Actions 用 `FORCE_JAVASCRIPT_ACTIONS_TO_NODE24: true` + `actions/checkout@v4.2.2` + `actions/setup-python@v5.6.0`。**验证自动更新是否真正成功**：看远端是否出现 `chore: update BBL chart data [skip ci]` 且 author 为 `github-actions[bot]`，workflow 显示绿色不代表数据有变化（可能是 403 后 exit 0 + No changes）
28. **nav-enter 动画禁用 transform**：`@keyframes nav-enter` 只能用 `opacity` 过渡，不能含 `transform`。因为 `animation-fill-mode: both` 会使末态 `transform: translateY(0)` 永久保留在 `.nav` 上，nav 成为 fixed 子元素的 containing block，`.nav__drawer` 从此相对 nav 而非 viewport 定位，永久无法正常展开
29. **backdrop-filter 激活陷阱**：`::before` 的毛玻璃过渡必须用 `background` 属性过渡（`rgba(x,x,x,0)→rgba(x,x,x,0.88)`），不能用 `opacity: 0→1`——部分浏览器在 `opacity:0` 时完全不激活 `backdrop-filter`
30. **Ticker JS 化**：`.ticker__track` 由 JS `requestAnimationFrame` 驱动（每帧 `x += speed * dt; if (x >= halfWidth) x -= halfWidth`）。`buildTicker(items)` 从 `data/main-page/ticker.json` 读取条目，生成 ×2 复制后写入 track，调用 `_tickerUpdateHalfWidth()` 更新宽度
31. **UPDATES 数据来源**：`data/main-page/updates.json` 含静态条目 + BV里程碑（`show_after` 字段）+ BBL条目（fetch_bbl.py自动维护）。`renderUpdates()` 过滤 `show_after` 和1年前内容，排序取前5。不再有 `STATIC_UPDATES`/`BV_MILESTONES` 硬编码数组
32. **fade-up-right**：右列大卡片（`.barvision__card`、`.chart-header`）使用专属 class，对应 `rightObserver`（`rootMargin: '0px 0px -80px 0px'`），触发时机晚于普通 `.fade-up`
33. **移动端抽屉滚动锁**：`openDrawer()` 保存 `scrollY`，设 `body { position:fixed; top:-scrollY; width:100%; overflow:hidden }`；`closeDrawer()` 还原并 `window.scrollTo(0, scrollY)`。纯 `overflow:hidden` 在 iOS 无效
34. **BarboardLab 标题三段配色**：`Bar`（白色）+ `board`（`#6F9EC3`，`.bbl-board-accent`，与 nav logo BOARD 一致）+ `Lab`（`var(--clr-violet-light)`，`.lab-accent`）
35. **BBL 榜单条目动画**：不使用容器级 `listObserver`，改为逐条接入全局 `fadeObserver`，`transitionDelay: 0s`，随滚动自然逐一触发
36. **Scroll hint CSS 顺序陷阱**：`.hero__scroll-hint` 基础样式（含 `display:flex`）定义在 `@media (max-width:768px)` 块之后，导致同特异度下媒体查询的 `display:none` 被层叠覆盖、移动端隐藏失效。**现行解法（已采用）**：移动端规则用 `.hero .hero__scroll-hint { display:none }`（特异度 0,2,0 > 全局 0,1,0），无视源顺序都胜出（commit 7a0af27）。同理可不调整源顺序而靠提升特异度修此类层叠问题。
37. **Nav logo mix-blend-mode 移除**：`.nav__logo-img` 曾有 `mix-blend-mode:screen`，`openDrawer()` 时 `body{position:fixed}` 触发全页 reflow，GPU 合成层重建导致 logo 闪烁；PNG 已有透明背景，直接移除 mix-blend-mode 无视觉影响
38. **openDrawer() rAF 分帧**：body scroll lock (`position:fixed` 等) 包入 `requestAnimationFrame`，与 `nav--open` class 切换分帧执行，防止同帧 reflow 导致视觉闪烁
39. **closeDrawer() scrollBehavior 陷阱**：`html { scroll-behavior:smooth }` 全局生效，`window.scrollTo(0, savedScrollY)` 会触发平滑动画造成页面跳滚；还原前须临时设 `document.documentElement.style.scrollBehavior = 'auto'`，还原后清除
40. **共享 nav/footer 方案**：`scripts/nav.js` 内嵌 `NAV_HTML` / `FOOTER_HTML` 字符串，同步调用 `inject()` (`insertAdjacentHTML('afterend',...) + remove()`) 替换占位符。不用 `fetch` 是因为 Chrome/Edge 在 `file://` 协议下 CORS 屏蔽跨文件 fetch，本地开发无需起 server。新页面模板：`<div id="site-nav"></div>`…内容…`<div id="site-footer"></div><script src="../scripts/nav.js"></script>`（路径按层级调整）
41. **nav.js 中的链接用绝对路径**：`/about.html`、`/barvision.html` 等，在 GitHub Pages 自定义域名下从根解析，子目录页面（如 `barvision/2026/events.html`）也能正确跳转
42. **updates.json show_after 字段**：BV 里程碑条目加 `"show_after":"YYYY-MM-DD"`，JS 过滤 `new Date(show_after) <= now`；普通条目不加此字段（始终显示）；文件整体按 `date` 降序排列
43. **装饰性 `::before`/`::after` overlay 必须加 `pointer-events: none`**：`position:absolute; inset:0` 的伪元素在 z-order 上覆盖内容区，若无 `pointer-events:none` 会拦截所有点击（包括子元素的 `<a>` 链接）。典型案例：`.season-card__banner::before` 网格层漏掉此属性，导致 `.member` 链接无法点击
44. **Member tooltip 用 JS 事件委托**：`initMemberTooltips()` 监听 `document` 的 `mouseover/mousemove/mouseout`，用 `e.target.closest('.member[data-nickname]')` 匹配；tooltip div 挂在 `<body>`，`position:fixed`，跟随鼠标坐标 `(e.clientX+16, e.clientY)`，opacity 0.85，10px 字体；事件委托自动覆盖动态渲染元素，无需重新绑定
45. **成员页编号规则**：`member/space_id.html`，与 CSV 的 `space_id` 字段一一对应；全部119个已由 `gen_member_pages.py` 生成。`member.html` 为总览入口（已完成）
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
98. **`initDataTooltips()` 通用 data-tooltip**：`nav.js` 中新增独立函数（与 `initMemberTooltips` 并列，各自创建独立 `.member-tooltip` div），事件委托监听所有 `[data-tooltip]` 元素（`closest('[data-tooltip]')` 匹配），复用完全相同的样式与行为（`position:fixed`，`clientX+16` 跟随，0.18s fade）。两个 tooltip 使用各自独立的 div 实例互不干扰。
99. **`.footer__link--disabled` 禁用链接模式**：`href="#"` + `onclick="return false"` 禁止跳转，加 `data-tooltip="暂不可用"` 配合 `initDataTooltips()` 显示 tooltip；CSS 只需 `opacity:0.38; cursor:not-allowed` + hover 颜色锁定不变。当前用于 footer Barvision 2025 链接。
100. **`barvision.html` 当前页面结构（已大幅重设计）**：两大板块——① Hero（大标题 + meta + desc + 按钮，右列为 `.bv-recent-card` 放置 `barvision_logo_2026.svg`，480px 宽，`align-items:stretch` 垂直居中）；② 历届大赛（XVI 当届大卡：`1fr auto` 网格，左列文字信息 season-card banner 样式，右列 logo，深紫背景+方格纹+紫色发光边框，padding 48px；2023–2025 三张独立首排含 logo；2020 及之前 + Unplugged 均用 `edition-card` 类，无结果展示）。HOF 已迁出至 `barvision/hof.html`。`buildRecentArchiveGrid/buildArchiveGrid/buildUnpluggedGrid` 三个函数在 `fadeObserver` 前运行。
101. **`barvision_logo_202X.svg` 放置情况**：`barvision_logo_2026.svg`（1557×660，2.36:1）已放置于 ① `barvision.html` hero 右列（465px，深紫辉光）② `barvision.html` XVI 当届卡右列（`season-card__edition/name` 文字在左）③ `barvision/2026/events.html` hero 区（460px，替换文字标题，保留 breadcrumb + ev-meta + 倒计时/按钮）；`index.html` season-card 已**还原为文字**。`barvision_logo_2023/2024/2025.svg` 分别用于历届存档卡首排（opacity 0.85，深紫背景，`max-width:200px`）。
102. **Barvision 品牌信息**：中文简称**吧视**；全称「欧美流行歌曲个人榜吧歌曲大赛」；主题语格式为中英并列无分隔符「重声交响 Echoing Confluence」（不用 ·）；由 @绿荫夏语（萌妈，space_id:125）于 2019 年创立，`member/125.html` 路径。`barvision/hof.html` 为独立 HOF 页，路径层级 `../scripts/nav.js`，eyebrow 为返回 `/barvision.html` 的链接（无 breadcrumb）。
103. **`barvision.html` 历届存档 grid 规格**：早期存档（2019–2020，12张）和娱乐版（4张）均使用 `repeat(7, 1fr)`，`gap:12px`；2020 的7张卡自然占满第一行，2019 的5张在第二行，视觉上自然按年份分行。近届存档（2023–2025）独立使用 `repeat(3, 1fr)`，`gap:12px`，各卡含年份 logo。年份显示格式「Barvision 2025」（`font-body; font-weight:700; color:var(--clr-text)`，覆盖 CSS 里的 mono 字体）。
104. **`barvision/hof.html` 成员链接渲染**：页内定义 `MEMBER_MAP`（昵称→`{id, handle}`）+ `fmtMember(nickname)` + `fmtWho(who)`；`fmtWho` 按 ` · ` 分割多人，分隔符加 `opacity:0.35`。先驱奖 `@绿荫夏语` 用 `style="color:var(--clr-text)"` 白色覆盖，其他成员保持 style.css 默认紫色（`rgba(240,238,255,0.62)`）。**坑**：`bv-award` 有自身 `transition: border-color 0.2s`，写在 `<style>` 块（晚于 `style.css`）会覆盖 `.fade-up` 的 `opacity/transform` 过渡，导致卡片无淡入动画。修复：改为 `transition: opacity 0.2s ease, transform 0.2s ease, border-color 0.2s`。
105. **hof.html TOC 阈值设计**：TOC 用 `window.scrollY > 400` 触发显示，back-to-top 用 `> 320`；相差 80px，使 TOC 出现晚于、消失早于 back-to-top，视觉层次更自然。两个 hof.html 均采用此值。
106. **`index.html` 歌曲报名按钮禁用模式**：`href="#" onclick="return false" data-tooltip="暂不可用" style="opacity:0.38;cursor:not-allowed"`；表单 URL 就绪后改回正常链接并移除 disable 样式。歌曲提交开放时间：北京时间 2026-06-01 18:00（`OPEN_DATE = new Date('2026-06-01T18:00:00+08:00')`，index.html 倒计时目标同步）。
108. **`barvision/2026/events.html` 重做要点**：现有页面（850行）结构老旧，需完整重写。路径层级：`../../fonts.css`、`../../style.css`、`../../scripts/nav.js`。保留关键内容：赛程（6/1–8/22 完整时间线）、投票方式（Jury 12分制 + Tele 20票各50%）、附加赛（Approval Vote 3票）、晋级规则（半决赛前8+东道主直通+附加赛1名=18首）、歌曲提交规则；`const FORM_URL = ''` 占位符必须保留（填入后 iframe 自动渲染）；表单开启时间 `OPEN_DATE = new Date('2026-06-01T18:00:00+08:00')`；hero 使用 `barvision_logo_2026.svg`（路径 `../../assets/images/barvision_logo_2026.svg`）；整体风格对标 barvision/hof.html（紫色/金色主题、section 结构、fade-up 动画）。
107. **`archive.html` 设计规范**：全站活动总览页，hero 用榜吧蓝 `#6F9EC3` 作为主题色（eyebrow glow、section-label、section__title、arc-accent、desc 文字 `rgba(111,158,195,0.85)`、watermark `rgba(111,158,195,0.04)`）；顶部辉光仅主光改为榜吧蓝，左下粉色 `rgba(224,64,160,0.08)`，右侧紫色 `rgba(168,85,247,0.07)`；活动卡片 `.arc-card` 用 `--arc-color` CSS 变量控制各卡主色（BBL 紫色、BV 粉色、年榜蓝、吧莱美金、ECVP 青），顶边 3px 色条；Legacy 卡加 `.arc-card--ended`（`opacity:0.82`）降调；卡片动画单独覆盖为 `cubic-bezier(0.22,1,0.36,1)` 0.55s `translateY(28px)`，stagger `i×0.07s`；外链按钮使用全站统一 `ext-icon` SVG；section 标题首词白色 `var(--clr-text)`、次词榜吧蓝。
109. **全站 eyebrow 箭头回退约定**：各页面 hero 顶部 eyebrow 元素统一用 `<a class="xxx-eyebrow" href="父页面路径"><span>←</span><span>父页面名</span></a>` 实现返回提示；eyebrow 本身已有 `display:inline-flex; align-items:center; gap:8px; transition:color 0.2s`，hover 变白（`color:#fff`）。映射关系：`barvision.html`/`bbl.html`/`archive.html` → `← Barboard`（`href="/"`）；`barvision/hof.html` → `← Barvision`；`bbl/hof.html` → `← BarboardLab`；`barvision/2026/events.html` → `← Barvision`；`member/N.html` → `← Members`（`.mp-eyebrow`，`href="/member.html"`，violet-light，已取代原三级面包屑，见 #134）。子页面用相对路径，导航页用绝对路径（`/`）。
110. **`barvision/2026/events.html` 设计实现**：hero CSS animation（`ev-hero-in`，7 个元素依序延迟）+ 紫色 watermark "BARVISION" + 倒计时组件（`ev-countdown`，`ev-cd-unit`）；Submit 面板 `position:sticky; top:calc(var(--nav-h)+20px)` 跟随滚动；deadline bar 用 `grid-template-columns:1fr 1px 1fr`（分割线 `align-self:stretch`）；Schedule 三 STAGE 分组，每 stage 含 `ev-phase__tag` 色标 + `ev-phase__line` 弹性横线；时间列日期 `font-mono`，有补充描述的行 `flex-direction:column; justify-content:center`；Jury 评分格 10 个 `ev-js-cell`，#1/#2 加 `ev-js-cell--top` 金色；TOC 5 项（class `ev-toc`），紫色 `ev-toc-breathe` 呼吸点，IO suppression 同 bbl/hof.html；「本页上次更新于」置于倒计时下方，日期 font-mono，汉字 font-body；DM Mono 无 CJK——所有中文标签（北京时间、通道开启等）必须 inline `font-family:var(--font-body)`。
111. **Tele Vote 上限纠错记录**：Rulebook 4.1.2 规定每首歌最多可投 **10 票**（不是 5 票）。旧版 events.html 写错为 5 票，重做时已修正。
112. **附加赛双阶段结构**：Barvision 2026 的附加赛分两个阶段——①**附加赛资格赛**（与半决赛投票同期，07-25 至 08-07，仅各场海选第二名参与，采用 Approval Vote）；②**附加赛正赛**（08-08 直播现场，SF 未晋级全部歌曲 + 资格赛胜者，得票最高者晋级决赛）。全站统一使用"附加赛"，不再使用"复活赛"/"Second Chance Round"。
113. **BBL workflow 触发时间已更新**：主抓改为周六 19:00 UTC（北京时间周日凌晨 03:00），备用周一 04:00 UTC 不变，间隔 33h，`git log --since="2 days ago"` 仍可覆盖。
114. **bbl/hof.html 动态加载架构**：所有 HOF 数据（13个常量）迁移至 `data/bbl/bbl-record/hof_data.json`；hof.html script 只保留空 `let` 声明 + render 函数；底部 async IIFE `Promise.all` 并行 fetch `../data/bbl/bbl-vol-index.json` 和 `../data/bbl/bbl-record/hof_data.json`，填充全局变量后依次调用 build 函数；`fadeObserver` 必须在 async 回调内（build 函数之后）才能观察到动态生成的 `.fade-up` 元素。今后更新 HOF 数据只需编辑 `hof_data.json`，无需改 HTML。
115. **curl_cffi 绕过 Cloudflare TLS 指纹检测**：musictrack.cn 用 Cloudflare Bot Management 检测 TLS 握手指纹（JA3/JA4），Python `requests` 的指纹与浏览器不同，直接被 403。改用 `from curl_cffi import requests`，`requests.get(url, ..., impersonate="chrome136")` 即可伪装 Chrome 指纹，通过率高。workflow 中 `pip install requests` 改为 `pip install curl-cffi`。已在 GitHub Actions 验证通过。
116. **GitHub Actions 推送权限**：默认 `GITHUB_TOKEN` 只有只读权限，`git push` 会 403。在 workflow 顶层加 `permissions: contents: write` 修复。
117. **workflow git add 必须包含所有输出文件**：`fetch_bbl.py` 写 `bbl-latest.json` + `ticker.json` + `updates.json` 三个文件，但 `git add` 若只写第一个，ticker/updates 的变更永远不会提交到远端。已修正为 `git add data/bbl/bbl-latest.json data/main-page/ticker.json data/main-page/updates.json`。
118. **hof_data.json owner_map 缺 `白`**：`no1_records` 中 Dara — Bangaranga（Vol.125）的 owners 含 `白`，但 `owner_map` 没有该 key，`fmtOwners()` 兜底渲染为 `@白` 纯文字（无链接）。待确认该成员 space_id / handle 后补入 `owner_map`。
119. **CSV → JSON 同步规范**：修改任意 `bbl_0X_*.csv` 后，必须运行 `python scripts/sync_hof_data.py --write` 再提交，否则 JSON 与 CSV 数据不一致。脚本 dry-run 默认不写文件，加 `--write` 才生效。CSV 文件须以 UTF-8（含 BOM）保存；禁用"留空=沿用上行"惯例（每行须填完整 artist/song）；特殊字符（ROSÉ、韩文等）须正确录入，损坏为 `?` 后脚本会将错误值写入 JSON。`champions` 和 `owner_map` 不被脚本覆盖，需手动维护。**Barvision HOF 已改为手工维护**：`data/barvision/bv_hof_data.json` 现采用富嵌套结构（pioneer + season + records{regular/unplugged} + achievements{regular/unplugged}，条目含 song/session/old 等字段，源自 Notion 截图），**直接编辑此 json**；旧的扁平 CSV 源（`data/barvision/barvision-record/*.csv`）与同步脚本 `scripts/sync_bv_hof_data.py` **已删除/退役**（2026-06）。
120. **BBL API date 字段含义**：`bbl-latest.json` 的 `date`（如 `2026-05-22`）是该期统计结束后的**下一个周五**（即下一期的起始日），不是统计起始日。统计周期 = `[date-7, date-1]`（上上周五—上周四）。`fmtWeekRange(dateStr)` 和 `fmt_week_range_cn(date_str)` 均按此逻辑实现；切勿改回 `[date, date+6]` 或 `[date-6, date]`，否则显示周期会偏移 7 天或方向反转。`updates.json` 的 BBL 条目 `date` 字段用实际抓取日期（UTC 当天），不用 API chart date。
121. **行内 `<strong>` 前后空格规范**：在所有页面的行内加粗文本（`ev-req-item`、`ev-crit-item` 及类似列表条目）中，若 `<strong>` 前/后紧接**文字字符**（汉字、字母、数字），必须在该侧插入一个 ASCII 空格；若紧接**标点符号**（`，、；。（）【】` 等）或位于**句首/句末**，则不加空格。例：`榜吧 <strong>官方榜单</strong>（含…）`（"吧"后加空格，"（"前不加）；`以上</strong> 其他成员`（"其"前加空格）。目的是避免中英文混排时 bold 关键词与周围文字视觉粘连。
122. **`style.css?v=N` 版本号规则（用户约定，重要）**：`index.html`/`bbl.html`/`bbl/hof.html` 引用 `style.css?v=N` 用于刷新 GitHub Pages/浏览器缓存（固定版本号不变则真机看不到 CSS 改动）。**当前版本 = `v=3.0.10`**。规则：① **禁止自行升版本号**；② 后续小优化用 `3.0.6`、`3.0.8` 之类递增（补丁位），改 `style.css` 后同步各文件的 `?v=`（index/bbl/bbl·hof/styleguide）；③ 若认为需要升到 `3.1`（次版本）或 `4`（主版本），**必须先与用户确认**再改。背景：之前自行从 v=2 一路升到 v=5 被用户叫停并要求回退；现以 `3.0.x` 补丁位方案递增。
123. **设计系统文档 `DESIGN.md`（组件与命名速查）**：根目录 `DESIGN.md` 是全站组件库与命名速查表——含设计令牌、**中文俗名 ↔ class 对照表**（用户用俗名描述需求，据此定位元素）、命名规范（BEM + 页面前缀）、「待统一清单」（9+ 处同物多套的重复实现，供阶段三逐个去重）。新增/改名组件须同步更新。组件展示页分两个（均根目录、`noindex`、不进导航，加载真实 `style.css`）：① **`styleguide.html`** = **精选「已确认标准」展示**，逐项精修确认后才搬入，是全站权威基准 + 视觉回归参考（**建设中，逐个搬入**）；② `styleguide-draft.html` **已删除**（其「页面专属组件索引表」已并入 styleguide.html Components；令牌/阶梯/配色可视化由 #128 审计可视化取代）。**用户约定**：多页面复用的组件不再加页面前缀，直接放 `style.css` 全局用通用名；页面前缀（`bbl-`/`bv-`/`arc-`/`ml-`/`mp-`/`hof-`/`ev-`）只留给页面独有组件。
124. **屏幕断点标准（已与用户确认）**：3 档设备模型——**手机 ≤768 / 平板 769–1024 / 桌面 ≥1025**，仅用 `max-width:768px` + `max-width:1024px` 两个断点（桌面为基础样式逐级收窄）+ `min-width:769px` 写桌面专属。**桌面不再细分**（MacBook 与显示器同布局，`--max-width:1200px` 居中）。**平板 = 继承桌面（方案 A，已定）**：不主动写平板规则，仅当某块在平板上确实难看时再在 `max-width:1024px` 加局部单列收窄（已否决"平板当大号手机"，因需主动铺规则、与忽略平板矛盾）。**`480px` 是手机内"极小屏"可选子档**（SE 类，仅需要时用），非主分界。功能查询 `prefers-reduced-motion` / `hover-pointer` 保留。**一次性断点 465/540/600/700/960 待精修各页时逐个看、能就近归并才归并**（内容驱动确有必要的保留）。详见 DESIGN.md §一·补3。
125. **阶段三去重工作流（用户主导）**：用户逐个 HTML 精修去重，**从 index.html 开始**。规则：用户主导、AI 辅助提醒+只读审计+预览验证，**不擅自改代码、不擅自 push**。每元素对照「精修基准准则」：①硬编码 hex→`--clr-*`/配色地图 ②inline 字号→字号阶梯（中文+Bebas 数字配对 +30~40%）③inline 间距→间距阶梯 ④内联且与全局重复的组件→复用全局 class ⑤复用组件不加页面前缀 ⑥层级间距与全站统一。注：index.html 组件大多已全局，去重主要是 inline px→阶梯、零散硬编码→令牌。
126. **设计流程（用户习惯）**：① **桌面端为基准**（先精修桌面 base）；② 之后**手机端定点微调**（`@media max-width:768px`）；③ **平板基本忽略**，继承桌面 base。含义：**预览验证只用桌面 + 手机（≤768）两个视口、跳过平板**；`max-width:1024px`（平板）档低优先、不主动加新的；手机端改动严格锁 `@media` 不回灌桌面。
127. **歌曲报名通道（自定义表单 + EmailJS，已上线）**：`barvision/2026/events.html` 用**自定义表单**（非问卷星/无 iframe）收报名，前端 **EmailJS** 直发邮件到 **william115zq@gmail.com**（收件地址设在 EmailJS 模板 To Email）。
    - **EmailJS**：SDK `@emailjs/browser@4` CDN；配置 `EMAILJS = {publicKey:'M2tBv7vRh3TY2MAeA', serviceId:'service_cqbstn7', templateId:'template_d75xg0c'}`；模板仅用 `{{submitter}}` + `{{message}}`（`buildMessage()` 拼全字段为文本）。未设域名白名单（付费）。
    - **表单字段**（`#subForm`）：提交者（必填，**不校验** members.csv，仅蜜罐 `#subHp` 防机器人）/ 联系方式（QQ·微信号，选填）/ 报名方式（内部选择(内定)·公开选拔(海选)）/ 海选名称（海选时，填了解锁歌曲②）/ 歌曲字段：歌名·艺人·发行国家·语种·发行日期（日期填了校验 2023-07-01~2026-06-30）。**歌曲①** 歌名+艺人必填；**歌曲②（海选亚军）全部选填**（海选可只报冠军，空的歌曲②不计入邮件）。新增**备注**（选填，随报名邮件发出）。**已移除**：专辑、歌曲链接、选送理由、成员校验。
    - **首页 index.html 赛季卡已同步「已开启」态**：season-status「歌曲征集正在进行中」、倒计时「距离…关闭还有」目标 7/20 00:00、歌曲提交阶段 `.phase__status--live`「正在进行」+ `.phase--active` 增强高亮（粉色渐变/左条/辉光）。
    - **数量逻辑**：内定 1 首 / 海选 2 首（歌曲①=冠军→Semi-Final，歌曲②=亚军→附加赛资格赛）。
    - **localStorage 持久化**：key `barvision2026_submission`，提交成功存本设备；**刷新/重进若有记录→自动显示「您已提交报名」态**（「查看报名详情」回显、「重新报名」清空表单，**再次成功提交才覆盖**本地记录）。仅本设备/浏览器，非云端。
    - **三态随时间自动切换**（`updateAll` 每秒）：`OPEN_DATE`=6/1 18:00、`CLOSE_DATE`=**2026-07-20T00:00**(=7/19 24:00，**勿写 24:00 会 Invalid Date**)、`VOTE1_DATE`=7/25 22:00。hero 倒计时按阶段：开启前→倒数开启 / 开启中→倒数关闭 / 关闭后→**倒数 Semi-Final 1+附加赛资格赛投票（7/25 22:00）**。面板：锁定（倒计时）/ 表单 / 关闭（「歌曲征集已结束」）；badge：即将开启 / **已开启（粉色呼吸点 `.sp-badge__dot`）** / 已关闭。倒计时数字均粉色。
    - 首页 index.html「歌曲报名」按钮已 enable → `barvision/2026/events.html#submit`。重复提交靠人工核（前端无法真正跨设备防重，权威记录=邮箱邮件）。
128. **设计系统：令牌归并 + styleguide 可视化（现状）**：
    - **Logo 已定稿并写回** `style.css`：令牌 `--logo-fs-en` 26 / `--logo-fs-cjk` 12 / `--logo-gap-cjk` 8 / `--logo-gap-icon` 4；nav 图标↔字标 gap 5→4；footer 中文名抽成 `.footer__name`（tagline 不计入 logo）。沙箱 `--sgl-*` 已废弃。
    - **审计/替换工具**（handle）：`scripts/audit_design_tokens.py` 扫全站设计值 → `DESIGN_AUDIT.md`（详表）+ `styleguide-data.js`（可视化数据）；`scripts/apply_design_tokens.py` 把硬编码批量换成 `var(--token)`（默认 dry-run，`--write` 落盘；仅 CSS 上下文替换，**不碰 SVG fill/stroke**）。
    - **已 tokenize**：14 个新令牌入 `:root`（`--clr-silver/-bronze/-up/-down/-re/-team-cun/-esc/-white/-cta-1~3` + 金银铜 `-tint`），66 处硬编码已替换（零视觉变化）。仍硬编码：深色 hero bg 族（~13 HEX，待手动并簇）+ 大量 rgba 发光/阴影（多为一次性）。`--clr-text-2` = `#A299C8`。
    - **`styleguide.html` 结构**（取代旧沙箱版）：基础 Foundation = **审计数据驱动的可视化**（JS 读 `styleguide-data.js` 渲染色块/字号样例/间距条/圆角；离散值金标、移动端青色 📱）+ 元素 Elements（Logo 手工条目）+ 组件 Components（占位）。**章节 Sections 层已移除**；Components 含「页面专属组件待迁移索引」表（原 styleguide-draft.html 的索引，draft 已删除）。重跑审计即刷新 Foundation。
    - **建设规则**（Elements/Components 手工条目）：①记录名称+class名 ②记录所用地方（不省略）③只追加不改既有，改既有先确认。新令牌确认后并入 `style.css` 再重跑审计。
129. **Barvision 历史成绩数据体系（规划已与用户确认，进行中）**：把 Barvision 历届赛果建成一个完整数据层，逐届录入，上层 4 个产出面全部从**一份「每场完整排名表」**派生。
    - **唯一真相源 = 完整赛果表**（schema 已锁定，每首参赛曲一行）：`year, edition_no, edition_name, version, match, venue, rank, is_shadow, member, artist, song, score, note`。`rank`=该场**完整名次**（1,2,3,4,5…，不只前三）；`is_shadow`=混淆曲标记。升级/取代现有领奖台 only 的 `barvision_results_regular.csv`。
    - **现有存档数据**（`data/barvision/barvision-archive/`）：`barvision_results_regular.csv`（87 行，1–15 届，**仅领奖台 冠/亚/季+Shadow Track**）、`_unplugged.csv`（15 行，1–4 届）、`_freestyle.csv`（仅参与人数）、`barvision_data_dictionary.md`（字段字典）。⚠️ 字典提到的 `barvision_member_profiles.csv` **目录内不存在**。完整排名/分数由用户**逐届上传**（CSV/Excel/截图），AI 解析进表、回读核对。
    - **4 个产出面**：① HOF 改版——展示「历届每场前三」（场次/选送者/歌手/歌名/得分）；② **历届详情页**（新建 HTML，从 `barvision.html` 的届次卡片点入，看该届完整得分表，23–26 年对标 Eurovision wiki 的 content/scoreboard 风格，19–20 年不规范按实际数据呈现）；③ **成员主页「吧视」板块**（概览：最好成绩/Top1/Top3/参加场数/首次参赛/最近参赛(是否活跃) + 个人参赛表按名次分组，参考用户 Excel：场次/歌名/歌手/得分，含混淆曲 `*` 灰条）；④ 用真实数据**核对** `bv_hof_data.json` 列疑点。
    - **已发现疑点**：现 `bv_hof_data.json`「最多冠军单曲选送数=4（雨妈）」含一条 `5C` 实为 **Shadow Track（混淆曲）非冠军**；用户 Excel 同样标 `5C*`。雨妈真正常规版冠军为 3 首（5C/7A/8A）。待数据齐后统一核对修正。
    - **术语决定（已确认）**：组别名用「**组**」（小众组/中众组/大众组；半决赛/决赛），计数量词统一用「**场**」（"参加 26 场"、"前三 9 场"）——即现有「最多单组前三场数」的用法，全站统一。「**中众**」保留（小-中-大对仗自解释，不改）。
    - **规则要点**：混淆曲(`is_shadow`)默认不计正式成绩，**唯独闯进前三的特例计入**；2025 前为匿名选送（投票只见歌手-歌名），但现在公开展示历史选送者 OK，2025 起明牌；每届规则略有不同，用字段表达差异。
    - **待用户确认**：成员概览 Excel 表头括号语义（`Best:1st(3)(1)`、`Top1:3(1)`、`Top3:9(1)`、`Entry:26(5)`——首括号疑为正式次数、末 `(1)` 疑为混淆曲数、`(5)` 疑为娱乐版场数，需用户给准确定义）；历史得分是否含支持率/票数（决定"最高支持率"类记录能否反推）。
130. **Barvision 历届详情页体系（已建第一届，进行中）**：每届一个 HTML 详情页，对标 Eurovision wiki 的 content/scoreboard，沿用全站版式。
    - **三件套架构**（类似成员页）：① 薄壳 HTML `barvision/<年>/<版本>-<NN>.html`（仅 `<head>` + `var EDITION_SRC='...json'` + 两个 `<script>`：`bv-results-render.js` 先于 `nav.js`，路径 `../../`）；② 共享渲染 `scripts/bv-results-render.js`（注入全部 CSS + fetch JSON + 渲染 + 页内 TOC + 交互排序）；③ 每届 JSON `data/barvision/barvision-<年>/<版本>-<NN>.json`。**新增一届 = 录 JSON + 复制薄壳改 EDITION_SRC + 把 href 加进 `barvision.html` 的 `BUILT_EDITIONS` 集合**（卡片自动可点；`romanToInt`+`editionHref` 算路径）。
    - **数据来源 / 解析**：`scripts/parse_bv_edition.py` 读每届 Excel（`pip install openpyxl`，pandas）→ JSON。第一届 Excel 有 4 sheet：**参赛信息**（赛果汇总）/ **投票**（19 人×14 首逐票矩阵）/ 歌曲展示 / Sheet1。脚本从矩阵交叉校验 jury/tele（自动对比汇总，14/14 OK）；`ALIASES` 把昵称变体（Bag→包妈/dope→嘟妈/Lemon·淋檬→柠妈/绿萌→萌妈/锴→锴妈/城城→城妈/肥屎→肥妈）归一；`seen` 收集 members 映射（昵称→{id,handle}）。docx 用 `python-docx` 提取主题/规则进 meta。
    - **JSON schema**：`{year, edition_no, edition_name, cn_name, version, city, host, motto, summary, rules{submission,niche_standard[],format,voting}, source, members{昵称:{id,handle}}, vote_rule{scale,jury,tele,note}, matches[{match, venue, entries[], votes{voters[]}}]}`。`entries[]`：`rank, member, member_id, language, artist, song, jury_vote, tele_vote, score, support_rate, high_rate, is_shadow`。`votes.voters[]`：`voter, type(jury|tele), points{选送者:分}`。**第一届投票规则**：14 位选送者互投（去自投）= **评委票 Jury**；其余 5 位非选送者 = **观众票 Tele**；总分=Jury+Tele；Top10 给 12/10/8/7/6/5/4/3/2/1 分。
    - **页面板块顺序**：Hero → **赛制 Rules** → **结果概览 Results** → **投票详情 Detailed Voting Results**（含 **Scoreboard** 矩阵 + **12 Points**）。歌曲介绍板块已取消（`intro` 字段/`introsBlock` 函数保留备用）。右下**页内 TOC 加载即显示**（hero 短，不绑滚动阈值）。
    - **Hero**（对标 2026 events.html）：标题=`edition_name`（去罗马数字、序数词 `1st` 染粉 `--clr-pink-light`），下方 meta = `cn_name｜Barvision <城市?> <年>`（DM Sans 12px `--clr-text-3`，城市仅 2023 起），再下 `summary` 作 intro；section header 复用全局 `.section-label`(渐变横杠)+`.section__title`(Bebas)+`.section__subtitle`。
    - **配色（全表统一）**：Jury=`--clr-accent-light`(浅蓝) / Tele=`--clr-pink-light`(粉) / Total·Points=`--clr-text`(白) / 12 分单元格=`--clr-gold-light`(金)。分数字体 **DM Sans**。
    - **① 结果概览表**（`.bvr-tbl`）：列 名次 / 选送者@ / 歌手 / 歌名 / 语种 / Jury / Tele / Points。名次用 Bebas 20px（套 bbl `.chart-rank` 样式，前三金银铜渐变底+左 3px 光条+歌名歌手染色，`translateY(2px)` 内层 span 微调）；分数居中、Jury/Tele 下方带**竞赛式 #名次**（`compRank`，绝对定位不撑动数值；jury #0.55 / tele #0.7 透明度）；**表头可点排序**（`wireSortable`，读 `data-v`，↑↓ 实心三角 SVG mask + currentColor 跟随列色，全大写表头，三角 `margin-right:-10px` 使文字居中对齐数值，JURY 因结尾 Y 单独 `margin-left:0` 补偿）。
    - **② Scoreboard 矩阵**（`.bvr-mtx`）：评委+观众**合并一表**（评委列在前、观众附后，`.vsep` 分隔线；分组表头 **Jury Vote**(colspan) / **Tele Vote**(colspan)）。行=选送者（**默认按评委列顺序排→自投格连成主对角线**），列=选送者/Total/Jury/Tele（`rowspan=2` 合并到分组行、消除左上空角）+ 全部投票人。前 4 列**可排序**（`wireMatrixSort`，选送者=默认对角线序、其余数值降序）。自投格斜纹（`.self`）；12 分金色；汇总分 DM Sans 13px；`.bvr-mw` 用 `display:inline-block;max-width:100%` 收缩包裹（无右侧空白、超宽横向滚动）。
    - **③ 12 Points 表**（`.bvr-12`）：三列容器 grid `max-content 1fr 1fr`——选送者（前置 **Bebas 数字**=该行 12 分个数，weight 400 防假粗，`--clr-text`）/ **Jury** 组 / **Tele** 组；无 Jury 时 Tele 占第二列；给分者 @名（`.member` 10px 间距、无顿号）；评委/观众用蓝/粉 `Jury`/`Tele` 小标签区分。
    - **手机适配**（`@media max-width:768px`）：结果表 + 矩阵横向滚动 + 上方「⟷ 左右滑动」提示（`.bvr-scroll-hint`）；12 Points 改**单列堆叠**（选送者/Jury/Tele 各占整行、空 Tele 格隐藏、条目 border-top 分隔）；TOC 隐藏。桌面零影响。
    - **已确认决策**：2019–2020 的「X妈」= space_id **195**（@没有XX不科学）；城市仅 **2023 起**（=主办大妈所在城市）；详情页**每届一个 HTML**（非单页+参数）；歌曲介绍文案由用户**逐条提供**（非每届都有）；23–26 年一年一届不细分场次。
    - **完整设计 Guideline（桌面 + 手机，三表样式）见 `DESIGN.md §六`**。本次精修补充：名次 Bebas **18px**；结果表列头 `Points → PTS`；**手机端 @名一律用昵称（X妈 格式）**省空间（`.member{font-size:0}` + `::before content:attr(data-nickname)`）；宽表**隐藏滚动条**（`scrollbar-width:none`/`::-webkit-scrollbar`）；结果表手机压缩间距 + 分数 13px + 名次列缩窄且表头同步对齐；**12 Points 每条目改对称 padding 块**（`.bvr-12e`，桌面 `display:contents` 保持三列对齐、手机对称内边距）+ 接收者 @名白色；**矩阵粘性列改 `border-collapse:separate`** 修复滚动漏光；**nav.js 触屏（`hover:none`/`pointer:coarse`）禁用 hover tooltip**（`initMemberTooltips/initDataTooltips` 早返回）。曾试过手机端卡片/合并列布局，已回退为横滚表。
131. **Barvision 成绩 → 成员页「吧视」板块 + member.html 徽章/筛选（已建，第一届）**：
    - **数据聚合**：`gen_member_pages.py` 读所有 `data/barvision/barvision-*/*.json`（`load_bv_editions`+`aggregate_barvision`）→ 按规范昵称聚合每位大妈参赛记录 + 概览（`best/top1/top3/entries/shadow/twelve/debut/active_in/active`）+ **12 分次数**（该场多少投票人给该曲 12 分）→ 注入各 `member/N.html` 的 `MEMBER_DATA.barvision{overview,entries[]}`；同时输出 `data/barvision/member-bv-index.json`（`space_id→{editions,active,count,best,active_in}`）供 member.html 用。**改赛果数据后须重跑 `python scripts/gen_member_pages.py`**（会同时刷新成员页 + 索引）。
    - **活跃判定**：脚本常量 `BV_ACTIVE_SINCE_YEAR=2024`（最近参赛年份 ≥ 此 → active=实心 logo，否则空心）。当前只有 2019 第一届 → **全部空心**，录入近届后自动转实心。括号 = 混淆(影子)曲选送次数（第一届无 → 不显示）。
    - **成员页「吧视」板块**（`member-render.js` `bvSection()`，仅 `MEMBER_DATA.barvision` 存在时渲染，取代「代表成绩 即将上线」）：概览 stat 卡（最好名次/夺冠/前三/参加场数/12分次数/首次/最近）+ 参赛表（名次金银铜 / 届次=`.mp-bv-ed` 链接到详情页 / 场次 / 歌名 / 歌手 / 总分 / 12分；混淆曲灰斜体 +「混淆」标）。
    - **member.html**：筛选按钮 Indienation 后加 **Barvision**（`data-filter=bv`，金色激活态）；选中时显示**届数子筛选** `.ml-subfilters`（全部届 + 第N届，从 `BV_INDEX` 动态生成，状态 `currentBvEdition`）；数据加载改 `Promise.all([members.csv, member-bv-index.json])`；member 元组加 `spaceId`(m[6])；大名后 `.ml-bv-logo`（实心 `logo_center.png` / 空心 `logo_hollow.png`）。
    - **范围**：仅 14 位选送者有记录（只投票未选送的 5 位无）；先建结构 + 只填第一届，后续逐届累加（重跑脚本即更新）。**待确认**：活跃判定规则（现全空心）。
    - **后续精修（徽章 SVG 化 / 概览配色 / 可排序表 / 场次图例 / 响应式走势图）+ 导入新届流程 + 各组件样式速查 → 详见 `BARVISION_MEMBER.md`**（含导入须改的常量：`member-render.js` 的 `LATEST_ED`/`BV_YEAR_COLOR`、`gen_member_pages.py` 的 `BV_ACTIVE_SINCE_YEAR`）。
132. **Barvision 第二届导入 + 详情页扩展（成员变动 / 上下届导航 / 多场 header / editions-index）**：
    - **第二届（The 2nd Barvision，2019）已导入**：`scripts/parse_bv_edition2.py`（第二届 Excel 结构 = `2SF`/`2GF` 两 sheet 一体逐票矩阵，与第一届分离式不同）→ `data/barvision/barvision-2019/regular-02.json`（**SF 半决赛 + GF 决赛两场**，`matches[]` 双元素）。半决赛分数=评委会票(选送者互投)+评审团票(观众)，16 首全校验；决赛分数取 Excel 最终值（含半决赛加成、逐人公式不同，直接用、按分排名），jury/tele 为逐票和（观众=泰妈+草妈）。`LANG` 映射补语种、归一 `\xa0` 不间断空格、`院长→院妈`/`瑞玛→瑞妈`/`绿萌→萌妈`/`淋檬→柠妈`/`肥屎→肥妈`。`barvision/2019/regular-02.html` 薄壳、`barvision.html` BUILT_EDITIONS 加 Ⅱ。
    - **届次索引** `scripts/gen_bv_editions_index.py` → `data/barvision/editions-index.json`（各届 `roster:[{name,id,handle}]` + 序列）。**改/加任意届 JSON 后须重跑**（供下两项）。
    - **详情页成员变动 section**（`bv-results-render.js`，「赛制」后）：对比上一届 + 历史届 → 继续参赛 / 首次加入 / 回归（间隔后回来，连续参赛不算）/ 退出；`memberChangesBlock()`，状态色 继续蓝·首次紫·回归金·退出粉。
    - **详情页上一届/下一届导航**（底部）：`navBlock()`，默认整体灰、hover 整组 `--clr-red-light` + 边框粉；届名 13px。
    - **多场 header/TOC**：`matchEng(m)` → section-label 前缀 `SEMI-FINAL`/`GRAND FINAL`（title 保留「结果概览/投票详情」）；TOC 用「半决赛/决赛 + 结果概览/投票详情」。`bv-results-render.js` boot 改 `Promise.all([EDITION_SRC, editions-index.json])`。
    - **来源** JSON `source` 省略文件格式（只保留文档名）；总分（含决赛小数）`fmtScore()` 一律四舍五入显示。
133. **Barvision 详情页 + 成员页若干精修（本次）**：
    - **Scoreboard 小分字体**：`.bvr-mtx td.pt`（每位投票人给出的小分，含金色 `pt--12`）显式 `font-size:12px`（原继承 11px，+1px）；Total/Jury/Tele（`.tot/.sj/.st` 13px）不受影响。
    - **Scoreboard 对角线修复（重要）**：`votingMatrix()` 原假设 `m.votes.voters` 已「评委在前、观众在后」（`firstTele=juryN` + 分组 colspan + 对角线 `orderIdx` 都依赖此）；第二届按 Excel 原始列序输出导致评委/观众**交错**，分组表头错列 + 自投格不成对角线。修复：渲染时先 `voters.slice().sort((a,b)=>(a.type==='tele')-(b.type==='tele'))` 稳定分组（评委前/观众后），对第一届为 no-op。纯渲染健壮性修复、不动数据。
    - **12 Points 数字配色**：`.bvr-12__n` 由 `--clr-text` → `--clr-text-3`，与结果表「4 名及以后」名次同色。
    - **上下届导航对齐修复**：`.bvr-nav` 原 `padding:52px 0 12px` 的水平 `0` 覆盖了 `.section__inner` 的 `var(--gap-md)` 内边距，使导航比正文每侧宽 32px（桌面）/20px（手机）→ 按钮戳出内容边缘。修复：水平内边距改 `var(--gap-md)`（自动随断点 32/20）。**手机端导航**最终形态见 #134（grid 两等分、单按钮占半边）。
    - **个人主页吧视徽章**：数字色全届统一 `var(--clr-text)`（原第一届 `--clr-board`/其余 `#fff`）；**创始届（`ed.no===1`）特殊态** class `mp-bv-badge--first`：五边形染金 `--clr-gold`（覆盖 `BV_YEAR_COLOR`）+ 金色双层 `drop-shadow` 光晕 + `mpBvFirstGlow` 3.2s 呼吸动画（`prefers-reduced-motion` 关闭），title 加「· 创始届」。详见 BARVISION_MEMBER.md。
    - **多艺人合作曲数据修正**：按 #15 新规范修正 reg-01（Calipso 补 `(with Dardust)`）+ reg-02 六条 `/` 堆叠艺人（双 lead 用 `&`、feat 进歌名、正字法 Röyksopp/Sundfør/VanJess/GoldLink），重跑 `gen_member_pages.py` + `gen_bv_editions_index.py` 同步。
134. **详情页/成员页/BBL 又一批精修（本次）**：
    - **详情页上下届导航·手机半边**：`.bvr-nav` 手机端改 `display:grid; grid-template-columns:minmax(0,1fr) minmax(0,1fr)`，单按钮（仅上一届或仅下一届）占半边、缺届的 `bvr-nav__spacer` 占住另一半（视觉＝另一半被隐藏）；届名 `white-space:nowrap;text-overflow:ellipsis` 兜底。⚠️ 该 `@media` 块位于基础 `.bvr-nav` 定义之前，同特异度会被后写规则盖掉（参 #36），故选择器提权为 `.bvr-nav.section__inner` / `.bvr-nav .bvr-nav__btn`。
    - **详情页导航拉近正文**：`.bvr-nav` 加 `margin-top:calc(48px - var(--gap-xl))` 抵消上一 `.section` 的底部 padding（桌面 96 / 手机 64），`padding-top:0`，使距正文约 48px（原 148px）。
    - **成员页页眉改 eyebrow**：移除三级面包屑，改 `.mp-eyebrow`「← Members」（violet-light、大写、字距 .32em、`href="/member.html"`、fade-up），与 barvision 详情页 eyebrow 统一（见 #109）。
    - **footer logo 点击区收窄**：`.footer__logo` 加 `width:fit-content`，点击跳首页的热区仅限 logo+字标（原撑满整列含右侧空白）。
    - **概览卡**：「夺冠场数」→「冠军场数」；括号 `(次数)`/混淆曲 `(n)` 与大数字间距用 `.mp-bv-rep`/`.sh` 的 `margin-left:3px`（flex 容器折叠字面空格，故用 margin，详见 BARVISION_MEMBER.md）。
    - **吧视徽章间距**：`.mp-bv-badge` `margin-left` 桌面 9→7px、手机 7→5px。
    - **BBL 亮点高亮淡入淡出（变黑根因 + 修复）**：旧淡出给条目加 `.bbl-rank-fading` 强制 `background:transparent !important` 过渡 0.8s，把条目自身背景（奖牌渐变 / `--clr-surface`）顶掉露出深色页底 →「闪黑」+ `transitionend` 末端跳变；且渐变↔纯色无法插值。**改为叠加层方案**：`.bbl-chart-list .chart-item::after`（紫色 bg+box-shadow，`opacity:0`），`.bbl-rank-active::after{opacity:1}`，只过渡 `opacity 0.4s` → 淡入淡出都平滑、不触碰条目自身背景、无黑。JS 只 add/remove `bbl-rank-active`（删除 `bbl-rank-fading` 那套）。
135. **Barvision 第三届导入 + 混淆曲 / 未认领伪成员体系（本次）**：
    - **第三届（2019，分 A/B 两组）已导入**：源为两个 CSV（`Barvision_3A.csv` 小众组 / `Barvision_3B.csv` 中众组，无 Excel），`scripts/parse_bv_edition3.py` 读 CSV → `data/barvision/barvision-2019/regular-03.json`（`matches:[{match:'A',venue:'小众组'},{match:'B',venue:'中众组'}]`）。校验和「各票之和=总分」42 行全过；`荫语=萌妈`、`BAG=包妈`、`Navy=N妈`（CSV 已规范）。薄壳 `barvision/2019/regular-03.html`、barvision.html BUILT_EDITIONS 加 Ⅲ、`matchEng` 加 `A→GROUP A / B→GROUP B`。
    - **名次规则（parse 计算，覆盖 CSV 名次）**：正式曲按 **总分↓、同分则观众分(tele)↓**（欧视并列打破规则）赋 1..N；混淆曲取**并排名次** = `不低于其分的正式曲数 + 1`（同分时排正式后面），例 Omar 85→5、Daughtry 45→18；展示顺序按 总分↓、同分正式在前混淆在后、正式内部 tele↓。
    - **混淆曲（is_shadow）**：本届起出现，非正式、不计排名。报名者「X（混淆）」= X 的混淆曲（计入 X、如 Daughtry→包妈）；报名者「混淆」= 赛后无人认领 → 归伪成员「匿名」(id 0)。**三处呈现（用户细化）**：① **结果概览** `resultTable`——灰行弱化（**不斜体**，成员链接也染灰）、歌名后「混淆」标、名次 `N*`（`.bvr-num-shadow` 用 **Bebas、比正常名次小 2px=16px**、非斜体，加 `position:relative;top:-3px` 使字形中心与正常名次对齐）、**Jury/Tele 用 `--clr-text-3`（同歌名色，不再用 opacity，避免单元格背景异常带）、总分用 `--clr-text-2`**；② **Scoreboard 矩阵**——recips **含混淆曲**（弱化行末尾），选送者显示**斜体昵称**（`.bvr-anon`：有已知选送者显示真实昵称如「包妈」，匿名者显示「匿名」；**无「混淆」标**），矩阵后附注「注：斜体昵称为混淆歌曲选送者」；③ **12 Points**——**含混淆曲**，混淆选送者同样斜体昵称（包妈/匿名）。混淆曲的票存于 `votes.voters.points`。**成员页**：参赛表名次 `N*`（**不加粗、比正常小 2px=13px**；值包 `.rk-sh` span 并 `translateX(2px)` 右移——只移值不移单元格背景）、行**不斜体、统一 `--clr-text-3`**（含届次链接），走势图含混淆点且 rank 与表一致（均用 parse 的并排名次）。**成员页 overview 12 分次数仍排除混淆**（`aggregate_barvision` 只 sum official）。
    - **Jury/Tele 判定（重要）**：某大妈在该组**有 ≥1 首正式（非混淆）曲**→ Jury（选送者互投）；**只报混淆曲或未报**→ Tele（观众）。例：包妈 B 组仅 Daughtry(混淆)→ B 组按 Tele。
    - **「匿名」伪成员**（用户决策：数据层 + 独立详情页 + member.html 弱化卡）。**「匿名」涵盖两种情况：① 正式单曲匿名 ② 混淆单曲匿名**（赛后均无人认领选送者）。`member` 昵称 `匿名`、`member_id 0`，members 映射 `{id:0,handle:'匿名',unclaimed:true}`。`memberLink` 对 `m.unclaimed` 渲染弱化无 @、非斜体、→ `member/0.html`（结果概览用）；矩阵/12分用斜体 `.bvr-anon`。`gen_member_pages.py` 额外生成 `member/0.html`（**注意**：`aggregate_barvision` 旧 `nick=='匿名'` skip 已移除）；`member-render.js` 弱化分支：大名 `.mp-nickname--unclaimed`（font-body+text-3）、handle「参赛歌曲匿名选送者」、section-label「Barvision」、标题「匿名参赛歌曲」、说明「以下参赛歌曲在比赛结束后始终无人认领选送者，统一归档于此。」、无统计卡/走势图、仅混淆曲表。`gen_bv_editions_index.py` roster 跳过 `is_shadow`。**member.html 弱化卡（已建）**：`.ml-card--anon`，**仅 Barvision 筛选时显示、置于最后、不计入计数**（buildGrid 在 members 后追加，不进 visible）；大名「匿名」用 font-body 22px 但 `line-height:26px`（与正常卡 Bebas 26px 同高，使副标题「参赛歌曲匿名选送者」与其他卡「@handle」行等高）。
    - **新增一届流程（CSV 版）**：录 CSV → 改/写 `parse_bv_edition*.py` → 生成 JSON → 复制薄壳改 EDITION_SRC → barvision.html BUILT_EDITIONS + EDITIONS 卡 → 重跑 `gen_member_pages.py` + `gen_bv_editions_index.py`。语种 LANG 为人工/猜测（非英语需用户核对）。**⭐ 权威导入 SOP + JSON schema 硬契约 + 导入后自查清单见 `BARVISION_MEMBER.md §二`**——已固化 `eid` 键规范（#140）、必改常量（`BV_SLOTS`/`LATEST_ED`/`BV_YEAR_COLOR`/`BV_ACTIVE_SINCE_YEAR`）、人工核对项；**只要 JSON 合契约，导入零渲染/布局改动**（详情页/成员页全数据驱动）。
136. **Barvision 第四届导入（A/B 双组）+ 投票折算 / 联合选送（本次）**：
    - **第四届（2019）已导入**：`scripts/parse_bv_edition4.py` 读两 CSV（`Barvision_4A.csv` 小众 / `Barvision_4B.csv` 中众）→ `regular-04.json`；薄壳 `barvision/2019/regular-04.html`、barvision.html BUILT_EDITIONS 加 Ⅳ。可妈=member 123。
    - **泰妈 50% 折算（A 组）**：泰妈仅给前五喜好（12/10/8/7/6），计分按 50% 折算 → 数据层总分含 .5（如 94.5），全 A 组满足「总分 = 各票和 − 0.5×泰妈」。故 parse **score 直接取 CSV 总分**（不重算为 sum）；`jury_vote = sum(评委票)`、`tele_vote = score − jury`（自动反映折算，jury+tele=score）。**展示一律四舍五入到整数**（`fmtScore` 仍 `Math.round`，94.5→95）。说明 match 加 `note` 字段，**渲染在计分板矩阵之后**（与「斜体昵称」注合并为 `注1/注2`，见下）。
    - **计分板矩阵注释（合并编号）**：`votingMatrix` 收集注释——A 组的泰妈折算 `m.note` + 有混淆曲时的「斜体昵称为混淆歌曲选送者」；1 条用「注：…」，≥2 条用「注1：… / 注2：…」（`<br>` 分隔）。`resultTable` 不再带注释。
    - **冻结窗格（横滑固定列）**：① **计分板矩阵** `.bvr-mtx`——**桌面+手机均冻结「选送者+Total+Jury+Tele」前四列**（`position:sticky`，`tot/sj/st` 的 `left` 偏移由 `stickyMatrixCols()` 量表头列宽写入 CSS 变量 `--mtx-l-tot/sj/st`）；② **结果概览** `.bvr-tbl`——**仅手机**冻结「名次/选送者/歌手」前三列（`@media max-width:768px` 内 `border-collapse:separate` + `nth-child(-n+3)` sticky；`left` 偏移 `--tbl-l-mem/art` 由 `stickyResultCols()` 写入；奖牌/混淆行冻结列补近似纯色底覆盖行渐变，选择器需 `.bvr-tbl tbody .bvr-row--N td:nth-child(-n+3)` 提权盖过默认 bg）。两者 resize 均重算。
    - **混淆曲选送者在计分板/12分的显示**：用 `memberLink`（外裹 `.bvr-anon` 斜体弱化）→ **桌面显 @handle、手机显昵称「X妈」**（靠既有 `.bvr-mtx .member::before`/`.bvr-12 .member::before` 移动端昵称规则）；有已知选送者显真名（如包妈混淆曲显 @包妈），匿名（id 0）显「匿名」。
    - **联合选送「A/B」**（如 B 组 `麦妈/苏妈` 合报「Ride - Jump Jet」，投票也是一个联合列）：entry `member` 保留斜杠串（矩阵自投格、投票列匹配靠它）、`member_id=null`。`memberLink` 遇 `/` 拆分各自渲染（`.bvr-joint-sep` 斜杠分隔，用于矩阵/12分）；**结果表**用 `.bvr-joint`（flex 列）**两人上下排列**。聚合 `gen_member_pages.aggregate_barvision` 与 `gen_bv_editions_index` roster 均**按 `/` 拆分计入各自**（该曲同时进两人吧视、两人各入名册）。
    - **第四届混淆命名**：rank「混淆N」+ 报名者「X2」（去尾数字得选送者，如 `雨妈2`→雨妈），**均有已知选送者（无匿名）**；名次自算并排（同 #135，`N*`）。**同并排名次的多首混淆曲**按分降序连续编号（如 B 组 Puddles 17→`23*`、Cheregazzina 12→`24*`）。
    - **歌名分隔兼容**：`split_song` 同时支持 ` - ` 与 ` – `（en-dash，如「Iglooghost… – Lockii」）。
137. **Barvision 详情页第二批微调（本次，部分仍待续调）**：
    - **`votes.points` 改按条目 `eid` 作键**（不再按昵称）——修复第四届「同名成员同组既有正式曲又有混淆曲」（如 B 组晕妈 Josh Wilson 正式 + Ashley McBryde 混淆）的小分**串台** bug。parse 给每条 entry 加 `eid`（data 行索引），points `{eid:分}`；`votingMatrix` 用 `v.points[e.eid]`、`twelveBlock` 建 `byEid` 映射后 `memberLink(entry.member)`。
    - **混淆曲位置（已与用户确认）**：**结果概览 = 交错**在名次位置（parse `entries` 按 `-score, 正式在前, -tele` 排，混淆曲 `N*` 落在其分数位）；**Scoreboard 矩阵 = 一律排在最后**（recips 排序 `is_shadow` 优先级最低、再 orderIdx、混淆组内按分降序）。12 分表也含混淆曲（eid 聚合）。
    - **混淆行背景**：`rgba(255,255,255,.06)`（偏亮）→ 纯深灰实色 **`#181820`**（详情表/手机冻结列/成员页统一）；实色顺带修复手机冻结列**漏光**（半透明会透出滚动内容）。
    - **手机冻结表头底色**：冻结表头由 `--clr-bg` 改 `--clr-surface`，与滚动表头一致（消除冻结/滚动窗格色差）。
    - **泰妈折算注用 memberLink**：`m.note` 用 `{m:泰妈}` token，`fmtNote()` 渲染为 memberLink → 桌面 `@泰坦crazy`、手机 `泰妈`（`.bvr-mtx-note .member` 移动端昵称规则）。注：泰妈 handle=泰坦crazy(id131)，@Jeremy_BAg 实为包妈(id20)。
    - **「混淆」标签防断行**：`.bvr-shadow-tag`/`.mp-bv-sh` 加 `display:inline-block; white-space:nowrap`。
    - **成员变动表字号**：`.bvr-mc__badge`/`.bvr-mc__mem` 值字号统一为表头 `11px`。
    - **桌面 Scoreboard 滚动提示**：`updateScrollHints()` 检测 `.bvr-mw`/`.bvr-tw` 溢出（`scrollWidth>clientWidth`）→ 桌面也显示「左右滑动…」提示（手机常显），render + resize 调用。
    - ⚠️ **本批仍待用户进一步微调**（下一会话继续）；语种「器乐」已统一为「纯音乐」。
138. **详情页微调收尾 + 混淆配色令牌化 + 成员页走势图重写（本次）**：
    - **详情页（`bv-results-render.js`）**：① `Scoreboard`/`12 Points` 子标题 `.bvr-dvr-sub` 字号 12→**18px**（手机 `@media` 内 16px）；② 「左右滑动…」提示 `.bvr-scroll-hint` 视觉样式（11px/`--clr-text-3`/mb7）移到 base，与「注」`.bvr-mtx-note` 一致（手机 media 仅留 `display:block`）；③ 混淆曲在 **Scoreboard 矩阵内一律按总分降序**（`votingMatrix` recips 排序：shadow 间 `return b.score-a.score`，不受 orderIdx 干扰）；④ 混淆行**不显示自投斜杠格**（`if(!e.is_shadow && v.voter===e.member)`）；⑤ **12 Points 混淆选送者**保留斜体、色弱化 `--clr-text-3`（新增 `.bvr-12__r .bvr-anon .member` 0,3,0 覆盖 `.bvr-12__r .member` 白）。
    - **混淆背景令牌 `--clr-shadow-bg`**（`style.css :root`，值 `#0c0a18`，背景族）：取代 `#181820`，详情页结果表 + 手机冻结列 + 成员页吧视表混淆行统一引用（不透明实色、冻结列不漏光）。值经多轮微调定为 `#0c0a18`。
    - **最弱化文字令牌 `--clr-text-4`**（`style.css :root`，值 `#6a6488`，文字阶梯）：① 原首页 hero 下滑提示三处硬编码 `#6a6488`（`.hero__scroll-hint`/`.scroll-hint-text`/`.scroll-chevrons`）改用此令牌；② 混淆单曲在**结果概览 + 个人主页记录**的字体颜色（整行含名次 `N*`、语种、「混淆」标签）统一 `--clr-text-4`（结果概览名次/语种需各加 `.bvr-row--shadow .num/.lang` 覆盖 `.bvr-tbl .num/.lang` 的 0,2,0）；③ 成员页走势图混淆点描边/连接虚线/弱化 `#N`/legend 空心圈也用之。
    - **成员页历届排名走势图 `drawBvTrend` 完整重写**（详见 `BARVISION_MEMBER.md §五.5`）：全局场次轴 `BV_SLOTS`（含缺席留位+竖虚线）、占满全宽（场次多才横滚）、同 X 多 Y（正式实心/混淆空心；**特例**：同选送者 1 正式+1 混淆且名次相同 → 实心(正式)不变 + 外套混淆圆环 `.mp-bv-trend__shadow-ring`，tooltip 两行，一~五届仅 5C 雨妈双第一 1 例）、连续参赛才连线（实线 `--clr-accent-glow`/混淆段虚线）、点配色 金>粉(最近)>蓝、`#N` 同名次去重+弱化 10.5px、legend（SVG circle 与图内逐项一致）、自建 tooltip（桌面 hover 跟随光标右下 / 手机点击）。H=320。⚠️ 预览 resize 不模拟触屏，手机点击 tooltip 仅真机可验。
139. **计分板手机端文字膨胀修复 + 联合投票人表头简化 + 走势图轴标签字号（本次）**：
    - **计分板「Jury Vote」比「Tele Vote」字号大（仅真机手机端）**：根因 = 移动端 `text-size-adjust` **文字自动膨胀**——「Jury Vote」跨很多列(宽 colspan)被浏览器判为正文放大，「Tele Vote」窄列不放大；**桌面/预览模拟器不触发，故 computed 测得一致、查不出**。修复：`table.bvr-mtx` 与 `table.bvr-tbl` 加 `-webkit-text-size-adjust:100%; text-size-adjust:100%` 禁用膨胀。**此类「真机大小不一致但桌面测得一致」问题优先怀疑 text-size-adjust**。
    - **联合投票人横向表头简化**：`votingMatrix` 的 `colRow` 中，含 `/` 的联合投票人列（如 `麦妈/苏妈`）显示时去各段末尾「妈」→ `麦/苏`（省空间）；单人投票人保持全名。纵向选送者列(rcp) 仍用 `memberLink` 拆分不变。
    - **走势图 X/Y 轴标签字号** `.mp-bv-trend__ylab,.mp-bv-trend__xlab` 13→**12px**（先试 11 偏小、最终 12；桌面手机同值，无端侧 override）。
    - **详情页上/下届导航按钮（手机端）箭头与文字成组**：`.bvr-nav .bvr-nav__btn` 手机端 `justify-content` 由 `space-between`（把箭头/文字推到按钮两端）改 **`center`**——箭头+文字以 `gap:8px` 成组居中，文字紧贴箭头（prev `← 名`、next `名 →`）。
    - ⚠️ 详情页 `bv-results-render.js` 无 `?v=`，浏览器会缓存旧 JS——预览验证改动需 `location.reload()` 仍可能用缓存，必要时注入 `<script src=...?cb=时间戳>` 重新执行 IIFE 验证。
140. **`votes.points` 键「混合」导致的 12 分 / 计分板 bug（本次修复）**：⚠️ **各届 JSON 的 `votes.voters[].points` 键不统一**——**第一、二届按选送者昵称作键、entry 无 `eid`**；**第三、四届按 `eid`(字符串) 作键、entry 有 `eid`**（#137 只改了三四届的解析）。由此两个潜伏 bug：
    - **gen_member_pages.py 的 12 分次数**：`aggregate_barvision` 旧用 `v.points.get(nick)`，对三四届（eid 键）恒取不到 → **twelve=0**（如包妈 3A 第一名应 1 显示 0）。修复：`_pk = str(e["eid"]) if e.get("eid") is not None else nick`，再 `points.get(_pk)`。
    - **bv-results-render.js 计分板**：`votingMatrix` 的 `v.points[e.eid]` 与 `twelveBlock` 的 `byEid[e.eid]`，对一二届（无 eid）→ `e.eid=undefined` → **矩阵分数格全空**。修复：两处改 `e.eid != null ? e.eid : e.member` 回退（有 eid 用 eid、否则用昵称键）。
    - **通用规则**：任何读 `votes.points` 的代码都必须用「`eid` 优先、回退 `member` 昵称」的取键方式，兼容混合数据。改后已重跑 `gen_member_pages.py`，并全量核对 **143 条记录 twelve 与 JSON 权威值 0 不匹配**；一二届详情页矩阵恢复（ed1 190 格有值 / 19 个 12 分）。
141. **详情页 intro（届次 `summary`）文案约定**：第一~四届 intro 已重写为叙事风格（详情页 hero `d.summary`，纯文本经 esc）。**完整约定见 `data/barvision/edition-intros-2023-2025.md`「Intro 文案约定」节**，要点：通顺精简不堆砌规则（规则归 Rules 板块）、只写亮点+冠军（多组写各组冠军、不写亚季军/分数过程细节）、术语统一**「混淆单曲」**、**引号统一中文双引号 “”（不用「」）**、`艺人 — 歌名`+昵称、2019 为一年多届（避「年度」、无城市/主办勿编造）。该文件同时存了第 13–15 届（2023–2025）intro 备稿，供导入时填入。
142. **第五届（2019，A/B/C 三组）已导入**：`scripts/parse_bv_edition5.py`（三 CSV `Barvision_5A/5B/5C.csv`）→ `regular-05.json`；薄壳 `barvision/2019/regular-05.html`；barvision.html BUILT_EDITIONS 加 Ⅴ。按 §二 SOP 走，**零渲染/布局改动**（详情页/成员页全数据驱动）。本届三个新点：
    - **混淆再投机制**：投票人投给混淆单曲的票，因混淆曲不计正式，可**等额再投一正式曲**。原始矩阵已包含再投的票（投正式曲那票就在矩阵里），故正式曲分=该列各票和、直接读即可、无需特殊处理。
    - **70% 折算（选送未投票惩罚）**：选送了歌却未投出评委票者（昵称不在该组投票人列），按欧视自限原则其曲 `score=round(各票和×0.7)`；**Jury/Tele 显原始票（和≠score）、总分显折算后**，计分板 `note` 写明三人原始总分。本届为 5C 的 麦妈/X妈/草妈。识别：CSV「总分」≈各票和×0.7。`parse_bv_edition5.py` 自动检测。
    - **源 CSV 标题损坏 → `OVERRIDE` 覆盖**：Excel 把过宽数字显示成 `#######`、gbk 丢失重音/特殊字符（`?`）。改用 `OVERRIDE` 表（按各组 CSV **数据行顺序**一一对应、用户核对版）覆盖 artist/song/language——含重音（Árstíðir/Julien Doré/déjà vu）、feat 规范（#15）、多语言空格分隔（如 `日语 英语`）。score/成员/投票仍取自矩阵。**这是异构/脏源 CSV 的通用兜底法**：行序对齐 + 整表覆盖文本字段。
    - 5B「Sakima — God Fearing Men」CSV 总分 55 系漏加（应 58）；parser 一律按各票和算 → 自动修正。
143. **详情页三表术语 + 0 分/Tele 列/计分板排序规则（本次，全局）**：⚠️ **用户术语约定**：「**计分板**」=Scoreboard 矩阵(`.bvr-mtx`)、「**结果概览**」=Results 表(`.bvr-tbl`)、「**12 分**」=12 Points 表(`.bvr-12`)——以后据此定位，勿改错表。本次 `bv-results-render.js` 改（**所有届详情页生效**）：
    - **0 分显示**：仅**计分板的每格小分(`.pt`)** 的 0 不显示；计分板 Total/Jury/Tele 冻结列、**结果概览所有列**的 0 **照常显示**。
    - **Tele 列隐藏**：某场 **tele 投票人数=0**（`hasTele=teleN>0`）时，**计分板与结果概览的 Tele 列整列隐藏**（表头+单元格；计分板连 `.st` 冻结列）。tele 人数>0 的场（如 ed5 A 组有观众薯妈、ed1/2 等）Tele 列照常显示（含 0 值 + #N）。
    - **计分板默认排序**：**正式曲按结果概览名次在前**（`m.entries` 官方序，total↓/tele↓；**取代**原先按投票人列序 `orderIdx` 的排法），**混淆曲一律排其后、内部按总分降序**（统一规则，不再交错）；**投票人列按其官方曲名次升序重排**（`idxOf[member]`，评委在前观众在后）→ 自投格沿主对角线（已验证 ed5 三组列下标连续、ed2 SF/GF 单调对角）。混淆行无自投格。
144. **名次平局规则（Eurovision 级联）+ `recompute_bv_ranks.py`（全局，本次）**：正式曲名次同 total 分时逐级打破——① tele 总分↓ ② 给分人数(jury+tele)↓ ③ 12/10/8/7/6/5/4/3/2/1 分布↓ ④ running order(eid)↑。**实现为 `scripts/recompute_bv_ranks.py`**（在各届 JSON 上重算名次+并排混淆名次+展示序；幂等；默认 dry-run、`--write` 落盘）——**导入新届 SOP 第 5 步必跑**（取代 parse 内的临时名次；parse 的 rank 仅临时）。一二届无 eid，④ 用当前 entries 顺序兜底（本次未用到④）。
    - 本次对一~五届应用，10 条名次变化：ed5 三组同分互换（73/64/76，均判据②给分人数打破）+ ed2 SF Contagious/The Feeling（49 同分，判据②）+ **ed2 SF 顺带修正一处旧错**（Per Sempre 71 分原被错排在 Part Of Growing Up 70 分之后 → 按分纠正为 #8/#9）。已重跑 gen_member_pages，全 10 条 JSON 与成员页一致。
145. **第六届（2020，A/B/C 三组）已导入**：`scripts/parse_bv_edition6.py`（三 CSV）→ **`data/barvision/barvision-2020/regular-06.json`**（⚠️ 2020 年起新目录 `barvision-2020/`；薄壳 `barvision/2020/regular-06.html`）；barvision.html BUILT_EDITIONS 加 Ⅵ（EDITIONS 卡 VI/2020 本就有）。**editions 6–12 均 2020 年**。本届格式特点（与五届不同）：
    - **歌曲列「艺人 - 歌名」合并**需拆分（`split_song` 正则 ` - `/` -`/`- `，避开 `P3GI-13` 等内部连字符）；**语种由 CSV 提供**（不再猜/不需 OVERRIDE）；**6A 空缺用 `0`、6B/6C 留空**——均视无票（只取正分，自投也 0）。
    - **无折算**（三组总分=各正分和，已校验）；混淆曲 6A 2 首 / 6B 2 首 / 6C 0 首。昵称归一加 `柠檬→柠妈`（与 `淋檬→柠妈` 并存）；新成员 威妈/鹿妈/蛋妈/奶妈/嘟妈 均在册（0 未解析）。
    - 导入后跑 `recompute_bv_ranks.py --write`：ed6 4 条平局变化（A53/B60 判据②给分人数打破；A88/C62/C54 判据① tele）。ed6 12 分次数交叉核对 53 条 0 不匹配；详情页/成员页正常、零渲染改动。
146. **第七届（2020，A/B/C 三组）已导入**：`scripts/parse_bv_edition7.py`（三 CSV）→ **`data/barvision/barvision-2020/regular-07.json`**；薄壳 `barvision/2020/regular-07.html`；BUILT_EDITIONS 加 Ⅶ（VII 卡本就有）。**零渲染/布局改动**（详情页/成员页全数据驱动）。本届格式特点（与六届不同 + 两个新数据特征，均与用户确认）：
    - **列布局每组不同**：7A=`选送评委/歌手/歌名/语种/[投票人]/总评分`（**无「最终得分」列**、无折算、无并列）；7B·7C=`名次/歌手/歌名/选送评委/语种/[投票人]/总评分/最终得分`。歌手/歌名已独立两列（无需拆分）。→ parse 用列名 `index()` 通用定位，投票人列 = `语种` 右侧至 `总评分` 之间。语种由 CSV 提供。
    - **混淆仅 7A 3 首**（选送评委含「混淆」）；7B/7C 无混淆。
    - **70% 折算检测改用「最终得分 < raw×0.95」**（不再靠「选送者是否在投票列」——因 7C **蛋妈未投票但未折算**，旧法会误判）。折算行：score=最终得分(折算值)、Jury/Tele 显原始票、计分板 note 写原始总分。本届 7B 苏妈(80→56)/蛋妈(47→32.9)、7C 鹿妈(54→37.8)。
    - **⭐ 7C「最终得分」带支持率小数**（约半数行，如 Highwire 83→83.1、Belong to You 81→81.9；本质≈支持率/票数决胜，整数部分=总评分票数和；7B 另有官方并列名次如 The Hails/FIDLAR 并列第10）。**用户决策（#143/#144 既有哲学）**：**总分显示=真实票数和（整数），名次由全局 `recompute_bv_ranks.py` Eurovision 级联决定、小数丢弃**（个别官方并列/小数决胜名次可能与官方公布微异——如并列第10被拆 10/11，已接受）。故 parse **非折算行 score=raw 整数（丢 7C 小数）、折算行 score=折算值**。
    - **⭐ 联合投票人「雨&布」**（雨妈+布妈 合投一票，一整列；此前只见联合*选送*第四届，联合*投票*头一次）。**用户决策**：登记为联合投票人 `雨妈/布妈`（type=Jury，因雨妈是 7C 选送者），**且该首 Belong to You（CSV 选送者仅写"雨妈"）改登记为 雨妈/布妈 合报**（`member_id=null`，下游按 `/` 拆分计入两人吧视、两人各入 roster）。parse 用 `JOINT_VOTER={'雨&布':'雨妈/布妈'}` + `SUBMIT_JOINT={('C','雨妈'):'雨妈/布妈'}`，自投格靠两者归一同串匹配。
    - **feat 规范化** `(ft.X)→(feat. X)`（#15，`FEAT_RE`）。
    - 导入后 `recompute_bv_ranks.py --write`：ed7 仅 2 条平局变化（A 组 音妈/奶妈 同分 48 按判据②给分人数打破，奶妈10人>音妈9人→#18）。`gen_member_pages.py`（第七届 roster 25 人）+ `gen_bv_editions_index.py`（届数 7）。自查：eid 全 OK、raw 全==总评分、12 分次数交叉核对 **308 条 0 不匹配**、详情页预览无报错。
    - **源 CSV typo 已按用户核对修正**（parse 脚本 `TEXT_FIX` 表，键 `(artist, song)`）：`Decoraion→Decoration`、`Ben Haziewood→Ben Hazlewood`、`Talerich-Conquistas→Conquistas`(去歌名艺人冗余)、`The Rubens, Vic Mensa→The Rubens & Vic Mensa`(双 lead)。
147. **合报单曲「合报」标签（全局，本次）**：所有联合选送（member 含 `/`，如 雨妈/布妈、麦妈/苏妈）的单曲，在**结果概览**（详情页 `bv-results-render.js` `resultTable`）和**个人主页参赛表**（`member-render.js` `renderBvRows`）的**歌名后**加「合报」标签——样式同「混淆」标签（`.bvr-joint-tag` / `.mp-bv-joint`：9px、`border-2`、`radius:2px`），仅**颜色改为 `--clr-text-3`**（混淆标是 `--clr-text-4`）。判定：结果概览用 `e.member.indexOf('/')>-1`；成员页用聚合时新增的 `e.joint` 字段（`gen_member_pages.py` 的 `rec["joint"]="/" in nick`，故**改聚合后须重跑 `gen_member_pages.py`**）。当前命中 4 条记录（ed4「Jump Jet」麦妈/苏妈 + ed7「Belong to You」雨妈/布妈，各 2 人）。
148. **动画/布局微调 + 预览验证要点（本次）**：
    - **详情页「Scoreboard」「12 Points」子标题需 `fade-up`**：`.bvr-dvr-sub` 原缺 `fade-up` class → 瞬现（下方表格淡入、不协调）。已加 `fade-up`（每场 2 个、三组共 6），随 `observeFades` 的 IO 滚动触发。`.bvr-dvr-sub` 自身无 `transition`、不覆盖 fade-up 过渡。**通则：detail/member 页 section body 内新加的块级元素若要入场动画，必须带 `fade-up` class**（本页 body 内 fade-up 都不带 inline delay、靠滚动逐个触发）。
    - **成员页吧视图例归组到表格**：`.mp-bv-legend`（场次代码注释）是参赛表脚注，fade-up 延迟由 `.3s`→`.28s`（紧跟表格 `.25s`），走势图 `.32s`→`.42s`（拉开），`margin-top:14px→8px` 贴紧表格。详见 BARVISION_MEMBER.md §5.4。
    - **手机端 barvision.html 娱乐版竖排修复**：`@media (max-width:465px)` 误把 `.bv-unplugged-grid` 设为 `1fr` → 改回 `repeat(4,1fr)`（4 卡横排，仅 @media 内）。
    - **⚠️ 预览验证陷阱（重要）**：Claude 预览标签页常处于 `document.hidden===true`（后台、未前台绘制），此时**浏览器冻结所有 CSS transition 与 IntersectionObserver**——表现为「全页 fade-up 卡在 opacity:0、IO 不触发、0 元素 visible、截图超时」。**这不代表代码坏**。验证 fade-up 是否生效的可靠方法：① 检查元素是否带 `fade-up` class + computed `transition` 含 `opacity,transform`；② 新建一个 `.fade-up.visible` 临时 div 读 computed opacity（应为 1）验证层叠规则；③ 用 DOM 测量而非截图。`fade-up` 规则全在 `style.css` 的 `@media (prefers-reduced-motion: no-preference)` 内。

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
