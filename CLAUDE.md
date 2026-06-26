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
- `barvision/2026/events.html` — Barvision 2026 赛事详情页（**已重做完成**；对标 barvision.html 视觉风格；含 hero（← Barvision 眉链 + CSS 动画 + watermark + 倒计时 + 更新日期）+ 歌曲报名（locked/open 面板 + deadline bar grid）+ SCHEDULE 三阶段表格时间线 + VOTING（Jury 评分格 + Tele + Approval）+ ELIGIBILITY（平台数据表 + 歌曲/艺人/专辑要求）+ RULEBOOK（6卡）+ TOC（5项，紫色，IO suppression）；**hero 已改用 2026 主视觉 `poster.png` 作背景 + 单列文字（移除右列 SVG logo，见 #159）**；详见开发注意事项 #108–111、#159）
- `barvision/2019/regular-01.html` — **Barvision 历届详情页（第一届，已完成，模板基准）**；薄壳 + 共享 `scripts/bv-results-render.js` + `data/barvision/barvision-2019/regular-01.json`；板块 赛制/结果概览/Scoreboard 矩阵/12 Points + 页内 TOC；可点表头排序、桌面+手机两端已打磨；解析脚本 `scripts/parse_bv_edition.py`；详见开发注意事项 **#130**。barvision.html 届次卡 Ⅰ 已接入链接（`BUILT_EDITIONS`）

### 待建页面（按优先级）
- **Barvision 历史成绩数据体系（进行中，见 #129–#162）**：**第 1–14 届已全部导入**（2019 五届 + 2020 七届 + 2023 第十三届 + 2024 第十四届「年度制」全部完成，见 #157–#161）。**第 15 届（Jinzhong 2025）主题/hero 已接入**（#162：BV_THEME/BV_STRIPE/RECENT_BG/薄壳 15.html/stub regular-15.json + 橙调 hero + 橘红 c1），**赛果数据待导**。**下一步：导第 15 届赛果数据（SF1/SF2/GF）**——同年度制（SF1/SF2/GF），渲染已通用，按 BARVISION_MEMBER.md §二 SOP + #161 走（产契约 JSON + parser 设 qualified + GF `tele_mode='votes'` 无 top + 补 `BV_THEME[2025]`/`BV_STRIPE[2025]`/`RECENT_BG[2025]` 年度配色 + 跑 recompute/gen 管线）；**2025 观众分每首≤10 票**（见 #161）；源数据在 `D:\Genius\Barvision\Barvision 2025`，intro 备稿见 `data/barvision/edition-intros-2023-2025.md`。剩余：HOF 历届前三改版 + 全量数据核对
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
102. **Barvision 品牌信息**：中文简称**吧视**；全称「欧美流行歌曲个人榜吧歌曲大赛」；主题语格式为中英并列无分隔符「重声交响 Echoing Confluence」（不用 ·）；由 @绿荫夏语（萌妈，space_id:125）于 2019 年创立，`member/125.html` 路径。**⭐ 品牌规则：届次标签「Barvision [城市] 年份」必须纯英文，不得中英混搭**——只能 `Barvision Qiqihar 2023`（含英文城市全称）或 `Barvision 2023`（省去城市），**禁止 `Barvision 齐齐哈尔 2023`**。城市须用英文（详情页 hero 小字由 `edition_name` 提供纯英文全称，勿用中文 `d.city` 拼接）。中文全称 `cn_name`（纯中文）与英文届名分属不同 token、各自统一，不算混搭。`barvision/hof.html` 为独立 HOF 页，路径层级 `../scripts/nav.js`，eyebrow 为返回 `/barvision.html` 的链接（无 breadcrumb）。
103. **`barvision.html` 历届存档 grid 规格**：早期存档（2019–2020，12张）和娱乐版（4张）均使用 `repeat(7, 1fr)`，`gap:12px`；2020 的7张卡自然占满第一行，2019 的5张在第二行，视觉上自然按年份分行。近届存档（2023–2025）独立使用 `repeat(3, 1fr)`，`gap:12px`，各卡含年份 logo。年份显示格式「Barvision 2025」（`font-body; font-weight:700; color:var(--clr-text)`，覆盖 CSS 里的 mono 字体）。
104. **`barvision/hof.html` 成员链接渲染**：页内定义 `MEMBER_MAP`（昵称→`{id, handle}`）+ `fmtMember(nickname)` + `fmtWho(who)`；`fmtWho` 按 ` · ` 分割多人，分隔符加 `opacity:0.35`。先驱奖 `@绿荫夏语` 用 `style="color:var(--clr-text)"` 白色覆盖，其他成员保持 style.css 默认紫色（`rgba(240,238,255,0.62)`）。**坑**：`bv-award` 有自身 `transition: border-color 0.2s`，写在 `<style>` 块（晚于 `style.css`）会覆盖 `.fade-up` 的 `opacity/transform` 过渡，导致卡片无淡入动画。修复：改为 `transition: opacity 0.2s ease, transform 0.2s ease, border-color 0.2s`。
105. **hof.html TOC 阈值设计**：TOC 用 `window.scrollY > 400` 触发显示，back-to-top 用 `> 320`；相差 80px，使 TOC 出现晚于、消失早于 back-to-top，视觉层次更自然。两个 hof.html 均采用此值。
106. **`index.html` 歌曲报名按钮禁用模式**：`href="#" onclick="return false" data-tooltip="暂不可用" style="opacity:0.38;cursor:not-allowed"`；表单 URL 就绪后改回正常链接并移除 disable 样式。歌曲提交开放时间：北京时间 2026-06-01 18:00（`OPEN_DATE = new Date('2026-06-01T18:00:00+08:00')`，index.html 倒计时目标同步）。
108. **`barvision/2026/events.html` 重做要点**：现有页面（850行）结构老旧，需完整重写。路径层级：`../../fonts.css`、`../../style.css`、`../../scripts/nav.js`。保留关键内容：赛程（6/1–8/22 完整时间线）、投票方式（Jury 12分制 + Tele 20票各50%）、附加赛（Approval Vote 3票）、晋级规则（半决赛前8+东道主直通+附加赛1名=18首）、歌曲提交规则；`const FORM_URL = ''` 占位符必须保留（填入后 iframe 自动渲染）；表单开启时间 `OPEN_DATE = new Date('2026-06-01T18:00:00+08:00')`；hero 使用 `barvision_logo_2026.svg`（路径 `../../assets/images/barvision_logo_2026.svg`）；整体风格对标 barvision/hof.html（紫色/金色主题、section 结构、fade-up 动画）。
107. **`archive.html` 设计规范**：全站活动总览页，hero 用榜吧蓝 `#6F9EC3` 作为主题色（eyebrow glow、section-label、section__title、arc-accent、desc 文字 `rgba(111,158,195,0.85)`、watermark `rgba(111,158,195,0.04)`）；顶部辉光仅主光改为榜吧蓝，左下粉色 `rgba(224,64,160,0.08)`，右侧紫色 `rgba(168,85,247,0.07)`；活动卡片 `.arc-card` 用 `--arc-color` CSS 变量控制各卡主色（BBL 紫色、BV 粉色、年榜蓝、吧莱美金、ECVP 青），顶边 3px 色条；Legacy 卡加 `.arc-card--ended`（`opacity:0.82`）降调；卡片动画单独覆盖为 `cubic-bezier(0.22,1,0.36,1)` 0.55s `translateY(28px)`，stagger `i×0.07s`；外链按钮使用全站统一 `ext-icon` SVG；section 标题首词白色 `var(--clr-text)`、次词榜吧蓝。
109. **全站 eyebrow 箭头回退约定**：各页面 hero 顶部 eyebrow 元素统一用 `<a class="xxx-eyebrow" href="父页面路径"><span>←</span><span>父页面名</span></a>` 实现返回提示；eyebrow 本身已有 `display:inline-flex; align-items:center; gap:8px; transition:color 0.2s`，hover 变白（`color:#fff`）。映射关系：`barvision.html`/`bbl.html`/`archive.html` → `← Barboard`（`href="/"`）；`barvision/hof.html` → `← Barvision`；`bbl/hof.html` → `← BarboardLab`；`barvision/2026/events.html` → `← Barvision`；`member/N.html` → `← Members`（`.mp-eyebrow`，`href="/member.html"`，violet-light，已取代原三级面包屑，见 #134）。子页面用相对路径，导航页用绝对路径（`/`）。
110. **`barvision/2026/events.html` 设计实现**：hero CSS animation（`ev-hero-in`，7 个元素依序延迟）+ 紫色 watermark "BARVISION" + 倒计时组件（`ev-countdown`，`ev-cd-unit`）；Submit 面板 `position:sticky; top:calc(var(--nav-h)+20px)` 跟随滚动；deadline bar 用 `grid-template-columns:1fr 1px 1fr`（分割线 `align-self:stretch`）；Schedule 三 STAGE 分组，每 stage 含 `ev-phase__tag` 色标 + `ev-phase__line` 弹性横线；时间列日期 `font-mono`，有补充描述的行 `flex-direction:column; justify-content:center`；Jury 评分格 10 个 `ev-js-cell`，#1/#2 加 `ev-js-cell--top` 金色；TOC 5 项（class `ev-toc`），紫色 `ev-toc-breathe` 呼吸点，IO suppression 同 bbl/hof.html；「本页上次更新于」置于倒计时下方，日期 font-mono，汉字 font-body；DM Mono 无 CJK——所有中文标签（北京时间、通道开启等）必须 inline `font-family:var(--font-body)`。
111. **Tele Vote 上限纠错记录**：Rulebook 4.1.2 规定每首歌最多可投 **10 票**（不是 5 票）。旧版 events.html 写错为 5 票，重做时已修正。
112. **附加赛双阶段结构**：Barvision 2026 的附加赛分两个阶段——①阶段一（与半决赛投票同期，07-25 至 08-07，仅各场海选第二名参与，采用 Approval Vote）；②阶段二（08-08 直播现场，SF 未晋级全部歌曲 + 阶段一胜者，得票最高者晋级决赛）。**⚠️ 公开展示名称已改名（events.html / index.html，勿用旧名）**：阶段一「附加赛资格赛」→**「海选突围赛」**；阶段二「附加赛/附加赛正赛」→**「外卡突围赛」**（含直播名「Semi-Final 暨外卡突围赛」）。即 events.html / index.html 中只用「海选突围赛」「外卡突围赛」，不再出现「附加赛」；早前已统一弃用"复活赛"/"Second Chance Round"。
113. **BBL workflow 触发时间已更新**：主抓改为周六 19:00 UTC（北京时间周日凌晨 03:00），备用周一 04:00 UTC 不变，间隔 33h，`git log --since="2 days ago"` 仍可覆盖。
114. **bbl/hof.html 动态加载架构**：所有 HOF 数据（13个常量）迁移至 `data/bbl/bbl-record/hof_data.json`；hof.html script 只保留空 `let` 声明 + render 函数；底部 async IIFE `Promise.all` 并行 fetch `../data/bbl/bbl-vol-index.json` 和 `../data/bbl/bbl-record/hof_data.json`，填充全局变量后依次调用 build 函数；`fadeObserver` 必须在 async 回调内（build 函数之后）才能观察到动态生成的 `.fade-up` 元素。今后更新 HOF 数据只需编辑 `hof_data.json`，无需改 HTML。
115. **curl_cffi 绕过 Cloudflare TLS 指纹检测**：musictrack.cn 用 Cloudflare Bot Management 检测 TLS 握手指纹（JA3/JA4），Python `requests` 的指纹与浏览器不同，直接被 403。改用 `from curl_cffi import requests`，`requests.get(url, ..., impersonate="chrome136")` 即可伪装 Chrome 指纹，通过率高。workflow 中 `pip install requests` 改为 `pip install curl-cffi`。已在 GitHub Actions 验证通过。
116. **GitHub Actions 推送权限**：默认 `GITHUB_TOKEN` 只有只读权限，`git push` 会 403。在 workflow 顶层加 `permissions: contents: write` 修复。
117. **workflow git add 必须包含所有输出文件**：`fetch_bbl.py` 写 `bbl-latest.json` + `ticker.json` + `updates.json` 三个文件，但 `git add` 若只写第一个，ticker/updates 的变更永远不会提交到远端。已修正为 `git add data/bbl/bbl-latest.json data/main-page/ticker.json data/main-page/updates.json`。
118. **hof_data.json owner_map 缺 `白`**：`no1_records` 中 Dara — Bangaranga（Vol.125）的 owners 含 `白`，但 `owner_map` 没有该 key，`fmtOwners()` 兜底渲染为 `@白` 纯文字（无链接）。待确认该成员 space_id / handle 后补入 `owner_map`。
119. **CSV → JSON 同步规范**：修改任意 `bbl_0X_*.csv` 后，必须运行 `python scripts/sync_hof_data.py --write` 再提交，否则 JSON 与 CSV 数据不一致。脚本 dry-run 默认不写文件，加 `--write` 才生效。CSV 文件须以 UTF-8（含 BOM）保存；禁用"留空=沿用上行"惯例（每行须填完整 artist/song）；特殊字符（ROSÉ、韩文等）须正确录入，损坏为 `?` 后脚本会将错误值写入 JSON。`champions` 和 `owner_map` 不被脚本覆盖，需手动维护。**Barvision HOF 已改为手工维护**：`data/barvision/bv_hof_data.json` 现采用富嵌套结构（pioneer + season + records{regular/unplugged} + achievements{regular/unplugged}，条目含 song/session/old 等字段，源自 Notion 截图），**直接编辑此 json**；旧的扁平 CSV 源（`data/barvision/barvision-record/*.csv`）与同步脚本 `scripts/sync_bv_hof_data.py` **已删除/退役**（2026-06）。
120. **BBL API date 字段含义**：`bbl-latest.json` 的 `date`（如 `2026-05-22`）是该期统计结束后的**下一个周五**（即下一期的起始日），不是统计起始日。统计周期 = `[date-7, date-1]`（上上周五—上周四）。`fmtWeekRange(dateStr)` 和 `fmt_week_range_cn(date_str)` 均按此逻辑实现；切勿改回 `[date, date+6]` 或 `[date-6, date]`，否则显示周期会偏移 7 天或方向反转。`updates.json` 的 BBL 条目 `date` 字段用实际抓取日期（UTC 当天），不用 API chart date。
121. **行内 `<strong>` 前后空格规范**：在所有页面的行内加粗文本（`ev-req-item`、`ev-crit-item` 及类似列表条目）中，若 `<strong>` 前/后紧接**文字字符**（汉字、字母、数字），必须在该侧插入一个 ASCII 空格；若紧接**标点符号**（`，、；。（）【】` 等）或位于**句首/句末**，则不加空格。例：`榜吧 <strong>官方榜单</strong>（含…）`（"吧"后加空格，"（"前不加）；`以上</strong> 其他成员`（"其"前加空格）。目的是避免中英文混排时 bold 关键词与周围文字视觉粘连。
122. **`style.css?v=N` 版本号规则（用户约定，重要）**：`index.html`/`bbl.html`/`bbl/hof.html` 引用 `style.css?v=N` 用于刷新 GitHub Pages/浏览器缓存（固定版本号不变则真机看不到 CSS 改动）。**当前版本 = `v=3.0.13`**（2026-06-25 随手机端 `.btn--primary` 去粉辉光改动升级，4 文件同步）。规则：① **禁止自行升版本号**；② 后续小优化用 `3.0.6`、`3.0.8` 之类递增（补丁位），改 `style.css` 后同步各文件的 `?v=`（index/bbl/bbl·hof/styleguide）；③ 若认为需要升到 `3.1`（次版本）或 `4`（主版本），**必须先与用户确认**再改。背景：之前自行从 v=2 一路升到 v=5 被用户叫停并要求回退；现以 `3.0.x` 补丁位方案递增。
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
    - **页面板块顺序**：Hero → **赛制 Rules** → **结果概览 Results** → **投票详情 Detailed Voting Results**（含 **Scoreboard** 矩阵 + **12 Points**）。歌曲介绍板块已取消（`introsBlock` 函数 + `.bvr-intro*` CSS 已于 2026-06-25 删除——从未被调用、各届均无 `entries[].intro` 字段；如需介绍功能再重建）。右下**页内 TOC 加载即显示**（hero 短，不绑滚动阈值）。
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
    - **「匿名」伪成员**（用户决策：数据层 + 独立详情页 + member.html 弱化卡）。**「匿名」涵盖两种情况：① 正式单曲匿名 ② 混淆单曲匿名**（赛后均无人认领选送者）。`member` 昵称 `匿名`、`member_id 0`，members 映射 `{id:0,handle:'匿名',unclaimed:true}`。`memberLink` 对 `m.unclaimed` 渲染弱化无 @、非斜体、→ `member/0.html`（结果概览用）；矩阵/12分用斜体 `.bvr-anon`。`gen_member_pages.py` 额外生成 `member/0.html`（**注意**：`aggregate_barvision` 旧 `nick=='匿名'` skip 已移除）；`member-render.js` 弱化分支：大名 `.mp-nickname--unclaimed`（font-body+text-3）、handle「参赛歌曲匿名选送者」、section-label「Barvision」、标题「匿名参赛歌曲」、说明「以下参赛歌曲在比赛结束后始终无人认领选送者，统一归档于此。」、无统计卡/走势图、仅混淆曲表。`gen_bv_editions_index.py` roster 跳过 `is_shadow`。**member.html 弱化卡（已建）**：`.ml-card--anon`，**仅 Barvision 筛选时显示、置于最后、不计入计数**（buildGrid 在 members 后追加，不进 visible）；大名「匿名」样式**与正常卡完全一致**（继承 `.ml-card__nickname`：Bebas Neue 26px / line-height:1 / letter-spacing .04em，CJK 走系统字体回退，与薯妈等正常 CJK 昵称同款同高），**仅颜色覆盖为 `--clr-text-3`**（曾用 font-body 22px/lh26 → 与正常卡不一致且不同高，已改为只覆盖颜色）；卡整体 `opacity:0.82` 弱化。
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
141. **详情页 intro（届次 `summary`）文案约定**：第一~四届 intro 已重写为叙事风格（详情页 hero `d.summary`，纯文本经 esc）。**完整约定见 `data/barvision/edition-intros-2023-2025.md`「Intro 文案约定」节**，要点：通顺精简不堆砌规则（规则归 Rules 板块）、只写亮点+冠军（多组写各组冠军、不写亚季军/分数过程细节）、术语统一**「混淆单曲」**、**引号统一中文双引号 “”（不用「」）**、`艺人 — 歌名`+昵称、2019 为一年多届（避「年度」、无城市/主办勿编造）。该文件同时存了第 13–15 届（2023–2025）intro 备稿，供导入时填入。**⚠️ 重大陷阱（勿重跑 ed1/2/3 parser）**：第一~三届的 JSON 含**只存在于 JSON、不在 parser 里的手工修正**——① #141 重写版叙事 summary；② #133/#15 多艺人 lead/feat 正字法修正（如 reg-01 `Calipso (with Dardust)`、reg-02 `Röyksopp & Man Without Country`+`(feat. Susanne Sundfør)`、`VanJess`+`(feat. GoldLink)` 等，parser 里仍是原始堆叠版 `Royksopp/...`）。**重跑 `parse_bv_edition{,2,3}.py` 会把这些手工修正全部覆盖回原始版**——故 ed1/2/3 **不要重跑 parser**（要改其数据只手改 JSON）。ed4 的重写 summary 已同步进 `parse_bv_edition4.py`、且 ed4/5/7/8 无 JSON-only artist 修正，故 ed4/5/7/8 可安全重跑（仅 note 在 parser 内生成）。
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
    - **详情页投票详情段动画逆序根因 = style.css 全局 `:nth-child` 延迟泄漏（重要）**：`section()` 把 body 块作为 `.section__inner` 的**直接子节点**（child 2…N），于是 style.css 为首页 hero 写的 `.fade-up:nth-child(2..6){transition-delay:.1~.5s}` 泄漏进来——但只定义到 child 6，**child 7（12 分表）无规则 → 延迟 0s → 反而最先淡入**，而 注(child5)=.4s、12 Points(child6)=.5s 落后 → 出现「12 分表先、注/12 Points 后」**逆序**。**修复**：注入 `.bvr-sec .section__inner > .fade-up { transition-delay:0s }`（特异度 0,3,0 > 全局 0,1,1，无需 !important；直接子选择器只清 body 块、不动嵌在 `.bvr-sec__hd` 内的 header label/title 错落）→ 全部改由 IO 按滚动位置自上而下逐个触发。子标题 `.bvr-dvr-sub`（Scoreboard/12 Points）+ 两处滚动提示 `.bvr-scroll-hint` 均补 `fade-up`；滚动提示因 `updateScrollHints` 在 observeFades 之后才 `display:block`（IO 对 display:none 不触发），故在其显示时 `classList.toggle('visible', show)` 令其淡入。**通则：bvr/member section body 内块级元素要入场动画必须带 `fade-up`；若多个并列且需严格自上而下，须避免 style.css 的 `:nth-child` 延迟泄漏（清零或显式有序 inline delay）。**
    - **成员页吧视图例归组到表格**：`.mp-bv-legend`（场次代码注释）是参赛表脚注，fade-up 延迟由 `.3s`→`.28s`（紧跟表格 `.25s`），走势图 `.32s`→`.42s`（拉开），`margin-top:14px→8px` 贴紧表格。详见 BARVISION_MEMBER.md §5.4。
    - **手机端 barvision.html 娱乐版竖排修复**：`@media (max-width:465px)` 误把 `.bv-unplugged-grid` 设为 `1fr` → 改回 `repeat(4,1fr)`（4 卡横排，仅 @media 内）。
    - **⚠️ 预览验证陷阱（重要）**：Claude 预览标签页常处于 `document.hidden===true`（后台、未前台绘制），此时**浏览器冻结所有 CSS transition 与 IntersectionObserver**——表现为「全页 fade-up 卡在 opacity:0、IO 不触发、0 元素 visible、截图超时」。**这不代表代码坏**。验证 fade-up 是否生效的可靠方法：① 检查元素是否带 `fade-up` class + computed `transition` 含 `opacity,transform`；② 新建一个 `.fade-up.visible` 临时 div 读 computed opacity（应为 1）验证层叠规则；③ 用 DOM 测量而非截图。`fade-up` 规则全在 `style.css` 的 `@media (prefers-reduced-motion: no-preference)` 内。
149. **第八届（2020，A/B 两组）已导入**：`scripts/parse_bv_edition8.py`（两 CSV）→ **`data/barvision/barvision-2020/regular-08.json`**；薄壳 `barvision/2020/regular-08.html`；BUILT_EDITIONS 加 Ⅷ（VIII 卡本就有）。**仅 A/B 两组（无 C）**。歌曲列「艺人 - 歌名」合并需拆分、语种由 CSV 提供。混淆仅 8A 2 首。**零渲染/布局改动**。本届两个新点（均与用户确认）：
    - **⭐ 神妈 = 匿名大妈**（id 0 unclaimed；选送 Deafheaven 8A#10、Peggy Gou 8B#3 + Foxing 混淆）：parser 保留 persona（`ANON_PERSONAS`），经 `number_anon.py` 全局编号为 **匿名#1(8A)/匿名#2(8B)**（详见 #150；早期曾误用 `ALIASES 神妈→匿名` 并入通用匿名，已改回）。**与 ed3/4 不同：本届匿名有正式曲**，归档进 `member/0.html`。**`gen_bv_editions_index.py` 已加：roster/成员变动跳过 `unclaimed`**（否则匿名正式曲会误入名册「首次加入」）。
    - **⭐ 8B 合报 + 50% 投票折算**：雨妈/兔妈 合报 Foals — Exits、包妈/泰妈 合报 Sylar — All or Nothing（member 含 `/`，计入两人吧视）。这 4 人在 B 组可**分别投票**（各自独立列）但每人投票 ×50% —— **CSV 里这 4 人的投票格已是 ×0.5 半值**（如兔妈 0.5/1.5/4/6=1/3/8/12 的一半）。处理（**复用 ed5/ed7 折算渲染模式，无需改渲染**）：① score=含半值的各票和（=CSV 分数，带 .5 小数）、jury/tele 同为半值和；② **`votes.points` 存「折算前 12 分原始版」**（这 4 人的格 ×2 还原成标准 12 分，其余原值）→ 计分板格内显示 12 分原始版（已验证 max=12 无小数）、Total 显折算后 score、加 `注：` 说明；③ 排名按 score 原始小数比较（`recompute_bv_ranks`），显示 `fmtScore` 四舍五入（如 Foals 86.5→87）。`HALVED_B={雨妈,兔妈,包妈,泰妈}` 仅 B 组生效（8A 这些人投票不折算）。
    - 导入后 `recompute_bv_ranks.py --write`（ed8 0 条变化，分数多为不同小数）+ `gen_member_pages.py`（118 文件含 member/0）+ `gen_bv_editions_index.py`（第八届 roster 22 人，匿名/合报已正确处理）。自查：eid 全 OK、raw 全==分数、12 分次数交叉核对 **350 条 0 不匹配**、详情页预览无报错。
    - 脏字符：8B 布妈行 X妈 列源 CSV 有 `·`（`num()` 按 0 处理）。源 CSV typo 已按用户核对修正（parse 脚本 `TEXT_FIX` 表）：`Cali Y EI Dandee → Cali Y El Dandee`（El 被写成 EI）。
150. **第九届（2020，A/B 两组）已导入 + 三个新通用机制**：`scripts/parse_bv_edition9.py` → `data/barvision/barvision-2020/regular-09.json`；薄壳 `barvision/2020/regular-09.html`；BUILT_EDITIONS 加 Ⅸ。**本届非常混乱、无规则书（rules 设 `{}` → 跳过赛制板块）、折算规则多不可考**——按用户决策「只标注能推理的信息与分数、模糊处理」。列：排名/选送妈/歌手/歌曲/语种/[投票人小分]/总分（歌手歌名已分列、语种由 CSV 提供）。**小分全是任意小数**（非欧视 12/10/8），`总分`为权威 score、jury/tele 由小分求和。本届引入的**三个新机制（均向后兼容、可供 10–12 届复用）**：
    - **⭐ 多身份匿名 + 全局编号「匿名#N」**：匿名大妈共用 id 0 unclaimed，但用编号区分。**parser 阶段**：`ANON_PERSONAS={神妈,隐妈,神隐妈,匿名}`，entry.member/voter 保留各自别名（神妈/隐妈），`members` 映射 `{id:0,handle:别名,unclaimed:true}`，`resolve/mid_of` 特判 id 0（ed8、ed9 parser 均如此；ed8 早期曾误并入通用「匿名」，已改回保留 persona）。**编号阶段 `scripts/number_anon.py`**（全局、幂等、`--write`）：按 **(届号↑→场次→同场首现序) 枚举每个 (届,场,具名身份) 占用，全局计数 匿名#1、#2…**（用户决策：无法确认不同届/场同名是否同一人，故**每场每届每次出现 +1**；通用「匿名」即第3/4届真正无人认领的、**不编号**）。它把该场内该身份的 entry.member/voter 改写成「匿名#N」，members 加 `匿名#N→{id:0,handle:匿名#N,unclaimed:true,alias:原别名}`（alias 仅供幂等重算、不展示）。当前：ed8 神妈=匿名#1(8A)/#2(8B)、ed9 神妈=匿名#3(9A)/隐妈=匿名#4(9B)。**因 member 串已是「匿名#N」→ 详情页 memberLink/计分板投票列/12分/成员页 persona 标签直接显示，零渲染改动**。`gen_member_pages` 把 unclaimed 身份统一路由进「匿名」桶、加 `persona=匿名#N`；`member-render.js` `renderBvRows` 对 `e.persona && !=='匿名'` 显示紫色 `.mp-bv-persona` 标签区分；member.html 仍只一张 匿名 卡。**⚠️ 导入新届 SOP 新增第 5.5 步：`number_anon.py --write`（recompute 之后、gen 之前）**。
    - **⭐ max 模式 12 分**：本届小分非 12 分制，故 **12 分 = 每位投票人投票列中数值最高的一首正式歌曲**（混淆不计）。parser 给每个 `votes.voters[]` 算并存 `top=<该正式曲 eid>`（并列取 score 高、eid 小）。下游按 `top` 统计：`bv-results-render.js` 计分板金标 `v.top!=null ? e.eid===v.top : p===12`、`twelveBlock` `maxMode=voters.some(v=>v.top!=null)`；`gen_member_pages` twelve 同理。无 `top` 的届走原 `points==12` 逻辑（向后兼容）。
    - **9A 合报+50% 投票折算**：奶妈/雨妈 合报 Alex Sampson，二人各自投票、投票 ×0.5（CSV 已半值）；计分板该二人列 **×2 还原显示**（`points` 存还原值，`score/jury/tele` 用 CSV 半值，同 ed8 模式）。**9B 70% 折算**：晕妈未投票 → 其歌 `总分`=各小分和×0.7（已在 CSV 总分、score 直接取，jury+tele≠score）。
    - 显示（renderer 既有行为已满足，无需为本届改）：总分/Jury/Tele/计分板 Total 用 `fmtScore` 四舍五入；计分板各投票人小分栏显原始小数。**渲染器健壮化**：`rulesBlock` 的 `if(r.niche_standard)` → 加 `&& .length`（空数组不再渲染空「要求」行）。
    - 自查：eid OK、12 分次数交叉核对 **385 条 0 不匹配**、合报双计入、member/0 含神妈/隐妈各带 persona、详情页预览无报错（小数小分 / argmax 金标 / 跳过赛制 / 注无「」）。源 CSV typo/规范已按用户核对修正（parse 脚本 `TEXT_FIX`）：`Jon Mclaufhin→Jon McLaughlin`、`Dizzy Dizzo ft.ESO→Dizzy Dizzo`+歌名补 `(feat. ESO)`、`Ravanna/Кэш→Ravanna & Кэш`。
151. **第十届（2020，A/B 两组）已导入**：`scripts/parse_bv_edition10.py` → `regular-10.json` + 薄壳 + BUILT_EDITIONS Ⅹ。**同第九届**：无规则书（rules `{}` 跳过赛制）、小分多为任意值（10A 含 11/13/8.5）、score=总分、**max 模式 12 分**（voter.top）、显示总分/Jury/Tele 取整·小分留小数。本届格式/机制特点：
    - **列 `歌名-歌手`（反序！）**：parse `split_sa` 返回 `(artist=后段, song=前段)`，与 ed6/8（艺人-歌名）相反。语种由 CSV 提供。
    - **10A 合报+50%**：雨妈/包妈 合报（1 正式 Get Back Up + 1 混淆 Paris Tx），二人各自投票 ×0.5（CSV 半值，计分板 ×2 还原）；混淆票可再投（再投票已在矩阵、直接求和，无需特殊处理）。**70% 折算**（选送未投票，sum×0.7 自动检测）：苏妈/晕妈/麦妈。混淆：雨妈/包妈、瑞妈、城妈。洛妈的 13 分不可考、按原值留。
    - **10B 匿名多身份**：CSV 用「匿名1」(选送 Little Help + 投票=jury)、「匿名2」(仅观众投票=tele)。parser `is_anon` 识别 `神妈/隐妈/神隐妈 + 匿名\d*`（含「匿名」「匿名1」「匿名2」）→ id 0 unclaimed 保留别名；`number_anon.py` 全局续编为 **匿名#5(=匿名1)、匿名#6(=匿名2)**（接 ed8/9 的 #1–#4）。4 混淆：田/团/雨/猴。10B 无折算/无半值、小分为标准欧视值。
    - **⚠️ summary 不引用匿名编号**（编号由 number_anon 后定，parser 阶段未知）：parser `cstr` 对匿名冠军用「一位匿名成员」泛称（否则会把临时别名「匿名1」写死进 summary）。
    - 季风→季妈(170) 笔误已并入（ALIASES）；苏妈/晕妈/麦妈 70% 折算系数据自动检测、用户未明示（已加注，可校正）。自查：12 分次数交叉核对 **424 条 0 不匹配**、合报双计入、member/0 含匿名#5、详情页无 匿名1/2 残留与报错。
152. **第十一届（2020，A/B 两组）已导入**：`scripts/parse_bv_edition11.py` → `regular-11.json` + 薄壳 + BUILT_EDITIONS Ⅺ。同九/十届框架（无规则书 rules `{}`、score=总分、max 模式 12 分）。本届特点：
    - **列 `选送者 / Artist(s) / Title / 语种`**：artist/song 为**独立两列**（不拆分、不反序，区别于 ed10 的「歌名-歌手」合并反序）。**无混淆、无折算、无半值**，小分接近标准欧视值（仍按 max 模式 12 分）。
    - **11A 联合「雨妈 雀妈」合报（空格分隔）= 合体给分**：一个联合投票列、**100% 计入、不折算**（区别于 ed10 分开投票×0.5）。`norm_name` 把空格/&// 分隔的名字归一为 `A/B`（member 与 voter 同）；`jury_set` 额外加完整串「雨妈/雀妈」以匹配联合投票列（voter `v in jury_set` 判 jury）。
    - **匿名身份**：`is_anon` 扩为 **含「匿名」/含「隐妈」/∈{神妈,神隐妈}**（覆盖 神妈/隐妈/隐妈三号/匿名N）；`ALIASES` 加 `隐妈3号→隐妈三号`（投票列与选送列归一为同一身份）。number_anon 续编：11A 匿名1=#7/匿名2=#8、11B **神妈=#9（选送 Best To You #4，先出现）、隐妈三号=#10（Girls #11）**。⚠️ 神妈在 11B 是**选送者**（非仅投票）——首问误判已更正。
    - Z妈(138)/A妈(132)/虎妈(111)/圈妈(108)/雪妈(109) 均在册真成员。自查：12 分次数交叉核对 **470 条 0 不匹配**、合报双计入、详情页匿名#7–#10 正常、无原始匿名名残留与报错。
153. **第十二届（2020 收官届，A 办/B 取消）已导入**：`scripts/parse_bv_edition12.py` → `regular-12.json` + 薄壳 + BUILT_EDITIONS Ⅻ。**2020 全部 7 届（6–12）导入完毕**。**有规则书**（rules 已填：A/B 阈值、本届取消混淆、Top10、未提交扣分、合报可减半、匿名≤2/组"隐妈X号"）。
    - **12A（已办，列 排名/选送者/艺人/歌曲/语种/[投票人]/总分）**：score=总分、max 模式 12 分。**萌妈/雨妈 合报、分开投票各 ×0.5**（计分板 ×2 还原）。**Z妈 只投前 8 → 投票 ×0.8 折算**：CSV 已折，`disp` 把她**最大值那格设为 12**、其余原样小数（计分板显折算小数+最高格 12；score 用 CSV 实际值）。**苏妈/晕妈 未提交完整排名 → 得分折算**（数据约 ×0.7；⚠️ 规则书写「扣 50%」但数据是 70%，以 总分 为准，已加注）。匿名 神妈=匿名#11、裸名「匿名」(塔尔Tar 正式曲)=匿名#12。
    - **⭐ 12B（报名后取消，列 选送者/艺人/歌曲/语种，无投票/分数/名次）**：match `canceled:true`，entries 仅 member/artist/song/lang/eid，**parser 按选送者大名排序**（中文拼音 A-Z 在前、字母名 A-Z 在后、匿名按「匿」ni 位；脚本内 `PY` 小型拼音表，因无 pypinyin）。12B 匿名 神妈(100 Gecs)=匿名#13。**双重呈现**：① 详情页 `canceledList()` 渲染『选送名单』section（选送者/歌手/歌名/语种，跳过结果/计分板/12分）；② 成员页参赛表 `mp-bv-row--shadow` 灰行 + `.mp-bv-canceled`「取消」标 + 名次/总分/12分 均「—」。**不计入走势/统计/名册**。
    - **配套通用改动（向后兼容）**：`recompute_bv_ranks.py` 跳过 `canceled` 匹配；`number_anon.py` 的 `alias_of` 加 `is_shadow` 参数——**裸名「匿名」非混淆→编号（ed12 塔尔Tar=#12），混淆→不编号（ed3 无人认领的保持裸名）**；`gen_member_pages` 聚合加 `canceled` 字段、统计(best/top1/3/entries/twelve/debut/active)全部排除 canceled（仅有取消条目者 debut/active 兜底用全部）；`member-render` renderBvRows canceled 分支 + `.mp-bv-canceled` CSS；`bv-results-render` boot 加 canceled 分支 + `canceledList()`。
    - 自查：12 分次数交叉核对 **488 条 0 不匹配**、合报双计入、ed12 编号 #11/#12/#13、ed3 裸名匿名未被重编、12B 取消行/名单正常、全 data 无「」、详情页/成员页预览无报错。⚠️ 两处数据自动检测/与规则书出入（已加注、可校正）：苏妈/晕妈 折算系数（数据 70% vs 规则书 50%）、12B 神妈编为 #13（取消组的匿名仍按规则 +1）。
154. **ed1–12 成果微调（标签顺序 / 12B 混淆 / 届徽章 / 滚动条 / 走势图 / 手机端 hero）**：
    - **标签顺序统一 合报 → (匿名#N persona) → 混淆 → 取消**：详情页结果概览 `resultTable`、选送名单 `canceledList`（`bv-results-render.js`）+ 成员页参赛表 `renderBvRows`（`member-render.js`）。
    - **12B 取消组混淆曲恢复「混淆」标**：`parse_bv_edition12.py` `build_12B` 不再剥离「混淆」、改设 `is_shadow=True`（包妈/虎妈/团妈/雨妈 4 首）。`canceledList()` 与成员页参赛表均显示「混淆」标。⚠️ ed12 summary/rules 仍含「本届取消混淆」（对实际举办的 12A 成立，12A 混淆=0；12B 仅存档名单含混淆标）——文案张力待用户定夺。
    - **届徽章规则：仅参加正式比赛才得该届徽章**——`member-render.js` `bvBadges` 收集届号跳过 `e.canceled`；`gen_member_pages.py` 的 member-bv-index `editions` 同步 `if not e.get('canceled')`（只报 12B 的奶妈/柠妈/虎妈无 ed12 徽章；参加 12A 的包妈/雨妈保留）。
    - **滚动条全站主题化**（`style.css`，`body` 后）：`* {scrollbar-width:thin;scrollbar-color:var(--clr-violet-dim) transparent}` + `::-webkit-scrollbar`（10px，thumb `--clr-violet-dim` + `background-clip:content-box`，hover `--clr-violet-glow` + `transition:background-color .25s`）。刻意隐藏滚动条的宽表（`.bvr-tw/.bvr-mw` 等）特异度更高仍隐藏。webkit thumb 过渡仅现代 Chromium/Edge 生效（Firefox `scrollbar-color` 无法过渡）。**`style.css?v=` 升 3.0.12**（index/bbl/bbl·hof/styleguide）。
    - **历届排名走势图 `drawBvTrend`（`member-render.js`）**：① 数据点抵拢两边（`padL=24/padR=14`，`xAt` 不对称内收 `insetL=min(64,宽×.13)` / `insetR=16`——左侧留空档放平均标注、右侧末点贴右）；② 桌面 `minSlotW=36` 使最密成员（25 场次）免横向滚动、填满宽；③ **平均排名虚线**：仅正式单曲均值 `Y=avg`，全宽（=网格线、`x1=padL,x2=W-padR`）、画于连线/圆点**之前**（在折线下层）、`--clr-violet-glow` 配色、左端上方标注「平均 X.XX」（`.mp-bv-trend__avglab` font-body、opacity .65）；④ 同 X 名次相差 ≤3 的 `#N` 标签**上下交替错开**（`rankLabel(...,below)`）；⑤ **`.mp-bv-trend__svg *{pointer-events:none}` + `.mp-bv-trend__hit{pointer-events:all}`** 修复靠下点被标签文本拦截无法 hover/点击。
    - **手机端成员主页 hero 重排**：把 `@名`（`.mp-handle`）移进 `.mp-nickname` flex 容器，与 `.mp-nickname__name` + `.mp-bv-badges` 同级；用 `order`+`flex-basis:100%` 切换——**桌面**（base）徽章组 `order:1` 与名同行、`@名 order:2;flex-basis:100%` 在下行（维持原样）；**手机**（`@media max-width:600px`）`@名 order:1`（与名同行、`align-items:baseline`、`margin-left:10px`）、徽章组 `order:2;flex-basis:100%`（整组换到名下方）。徽章独立 `.mp-bv-badges` 容器可换行不溢出；手机徽章 `20×19.4`、头像 `96→80px`。**坑**：`.mp-handle` 移入 `.mp-nickname`（font-display=Bebas Neue 全大写）后误显「@LEE」→ 须显式 `font-family:var(--font-body)`。
155. **成员页 overview 八卡两组 + 走势图导出 PNG（本次）**：
    - **overview 改 8 卡分 A/B 两组**（`member-render.js` `bvSection` 的 `stats` 数组 + `.mp-bv-stats` grid 桌面 `repeat(8,1fr)` 一排 / 手机 `repeat(4,1fr)` 自然成 A 上 B 下两行）。**A 组**（仅正式单曲）最佳名次/平均名次/12分次数/评委平均分；**B 组** 冠军场数/前三场数/前十场数/参与场数——主数字=正式曲数、**混淆曲用括号 `(n)` 单独标注不并入**（`sh` 渲染沿用）。`gen_member_pages.aggregate_barvision` 新增 overview 字段：`avg`(平均名次,2 位)、`top10`/`top10_shadow`、`jury_avg`(**单评委平均分** = 每曲 `jury_vote/juryN` 再对各正式曲求均值，理想 0–12；rec 新增 `juryN`=该场 type==jury 投票人数)。**改聚合字段须重跑 `gen_member_pages.py`**。「最佳名次」括号 `.mp-bv-rep` 用 `--clr-text-3`+`font-weight:400`（DM Sans 无 300 字重，以弱化配色实现"不加粗"）。
    - **⭐ 走势图导出 PNG（Step 1，纯前端零依赖零外部服务）**：`member-render.js` `exportBvTrendPng()`——① 克隆 `.mp-bv-trend__svg`；② `bvInlineStyles()` 递归把 `getComputedStyle` 的 paint/font 属性（`var()` 已解析为 rgb）内联到克隆，使 SVG 自包含（class 样式独立 SVG 渲染时不生效，故必须内联）；③ `bvEmbedFontCss()` 懒加载 `../assets/fonts/` 的 DM Mono/DM Sans(400/600) base64 内嵌 `@font-face`（否则 SVG-as-img 栅格化时文字用系统字体；失败 try/catch 优雅降级）；④ Blob URL 载入 Image → canvas（2x）画暗底(`--clr-bg`)+头部(canvas fillText 用已加载页面字体：大名/「BARVISION · 历届排名走势」/`barboard.space` 水印)+`drawImage` 走势图；⑤ `toBlob`→`bvShareOrDownload`。按钮 `.mp-bv-export`（默认 `--clr-violet` 与描边同色、hover `--clr-violet-light`），接线在 `drawBvTrend()` 后。**关键细节（已修）**：① **分享仅手机/触屏**（`matchMedia('(hover:none),(pointer:coarse)')`）——桌面 Windows 的 `canShare({files})` 也为 true 会误弹系统分享框，故桌面一律 `<a download>` 直接下载；② **高分辨率**：`SC=3` 且克隆 SVG 设 `width=W*SC`（保留 viewBox）让其**直接以目标像素栅格化**（不设则先 1x 再放大变糊）；③ **设备一致宽幅**：`drawBvTrend` 加 `forceW` 参数，导出时 `drawBvTrend(1120)` 按固定逻辑宽度重绘→克隆→`drawBvTrend()` 即刻恢复（同一同步任务内无闪烁），使手机也产出桌面级宽幅高清（3552×1302）。**坑**：SVG 自包含必须内联计算样式（不能靠页面 class/`var()`）；canvas 直绘文字用页面字体即可、但 SVG 内文字须嵌入字体；同源 Blob+内嵌字体不污染 canvas。
    - **⭐ 完整记录分享卡（Step 2，已完成，纯 canvas 合成，未用 html-to-image）**：`exportBvCardPng()`——共享 helper `bvTrendToImage(fontCss,SC,forceW)`（走势图→高清 Image，复用于 Step 1/2）、`bvDrawLegend(ctx,rightX,cyc,SC)`、`bvDrawBrand(ctx,x,cyc,SC,logo)`。卡片自上而下 canvas 直绘：① 头部＝头像（`createLinearGradient` 渐变环 + `ph` 昵称首字，CJK 用 DM Sans 700 / ASCII 用 Bebas）+ 大名 + `@handle` + 届徽章行（`new Path2D(LOGO_HOLLOW_PATH)` 画五边形、`BV_YEAR_COLOR` 按年配色 via `rcolor()` 解析 `var()`、创始届金、内嵌编号 Bebas）；② 8 张统计卡（`rrect` 圆角，复算 overview，含 best/B 组混淆括号；**8 卡一排、数字+括号组水平居中+整体垂直居中**）；③ 走势图（小标题「历届排名走势」+ `bvDrawLegend` + `drawImage(timg)`）；④ `withTable=true` 时在走势图与脚之间 canvas 手绘**完整参赛表**（表头/奖牌色名次/混淆灰行 text-4「N*」/歌名后标签/省略号截断；名次为空「—」固定 600·15px 避免粗细不一）；⑤ 左下 `bvDrawBrand`。产出 3552×2274（card）/ 含表更高。**按钮**：两个，放在「吧视参赛记录」标题行最右（`.mp-bv-titlebar`/`.mp-bv-exports`，`.mp-link` 同款样式）——**导出走势图**=`exportBvCardPng(b,false)`、**导出完整记录**=`exportBvCardPng(b,true)`（`exportBvTrendPng` 仍在但已无按钮触发）。**坑**：badge 的 `Path2D` 在 `ctx.scale(S/770)` 后绘制，字号用 viewBox 单位（300/360）；`BV_YEAR_COLOR` 值是 `var(--clr-x)` 字符串，canvas 须 `rcolor()` 提取 token 再 `bvCssVar()`。全站「评委平均分」已改「Jury 均分」（网页+导出）。**后续可微调版式/徽章大小/加冠军曲目等。**
156. **第十三届（Qiqihar 2023）导入 — 2023+ 新格式（⚠️ 数据层已完成 commit，详情页/渲染待建）**：
    - **2023 起＝重启「年度赛」新格式**，与 2019/2020（A/B/C 分组）根本不同：三场 **SF1/SF2/GF**（27 首→两半决赛各前 9 晋级→决赛 18 首）、有城市、有主视觉 Key Visual。**用户要求 2023+ 详情页做「按年主题化 hero（海报+年度配色）+ 沿用数据组件」**（不是前 12 届统一薄壳表）；每年独立 Key Visual（2023 = 珊瑚红 `#f84d39` / 墨绿 `#1b2f31` / 浅珊瑚 `#fbb1a9` / 米白，等距 3D 方块，QIQIHAR 2023）。
    - **数据层已完成（commit `0ffd670`）**：`scripts/parse_bv_edition13.py` → `data/barvision/barvision-2023/regular-13.json`，`matches:[SF1,SF2,GF]` 每场 jury+tele 逐票（eid 键）。**数据源**：SF 读 `D:\Genius\Barvision\Barvision 2023\23-SF1.csv`/`23-SF2.csv`（干净逐票，row0 voters 从 col5；col0序/1选送/2歌手/3歌名/4总分/5+各票）；GF 读 `Grand Final.xlsx「总表」`（voters cols7-32 = 前 20 jury + 后 6 public，col33/34/35=JURY/TELE/TOTAL 原始/折前）；genre 读 `计分表.xlsx「Sheet1」`(col0选送/col3 genre)；language 在 parser `LANG` 表（来自 Notion）。⚠️ **`计分表.xlsx` 的 Semi/Grand Final pts 较乱**（选送列与总分列错位、韩 GF jury=88 glitch）→ **已弃用，改用干净 CSV + 总表**。
    - **关键建模规则**：① 半决赛 **jury=本场选送者、tele=其余投票人**（jury/tele 分由矩阵按此求和）；② 决赛 **观众 6 人=音/城/布/兔/T/鸽**(type tele)，其余 20 jury；③ **狼/锴 GF 50% 折算**：entry `jury_vote`/`tele_vote` 存**折前原始**（狼83/28、锴36/18，计分板显示原始+「注」），`score` 存**折后**（狼56/锴27）；④ 84/84 并列按**观众分高者靠前**（recompute tele 降序 tiebreak → 星#6/韩#7）；⑤ **时=S妈**（ALIASES）；⑥ **成员该届成绩=总排名 1–27**：GF 1–18 + 半决赛淘汰 9 首按各自半决赛总分降序 19–27（存于 GF entries 的 `overall_rank`：N/霜/文/松/E/麦/鲤/奶/萌）；⑦ 新字段 entry.`genre`、match `SF1/SF2`、entry `qualified`(Q/NQ)。冠军 羊/Best Frenz & Joywave — Flatline 159(评124+观35)、亚 猴 121、季 风 105。12 分数据已逐项对齐 Notion 12 分摘要。
    - **Notion 页面结构（详情页对标）**：Hero(海报+标题)→Intro(3段)→参赛名单(选送/歌手/歌曲/语言/流派)→比赛规则→SF1/SF2(参赛者表含位次+Q/NQ→详细投票矩阵→12分摘要)→GF(参赛者表 总分/位次/评委分/位次1/观众分/位次2→折算说明→评委矩阵→观众矩阵→12分)→Scoreboard 图。Notion 私有+JS 渲染，WebFetch 读不到（参考用截图）。
    - **✅ 详情页/渲染已全部完成（见 #157）**：第十三届详情页、成员页收敛、总成绩单、徽章斜条纹均已落地并预览验证，barvision.html XIII 卡已可点。下游全部做成 `year>=2023`/年度制(SF1/SF2/GF) 分流的**通用**机制，2024/2025 复用见 #157。
157. **Barvision 2023+ 年度制详情页 + 成员页（已完成，通用机制，2024/2025 复用）**：第十三届（Qiqihar 2023）详情页/成员页/总成绩单全部落地、桌面+手机预览验证、旧届(2019/2020)零回归。**新增机制全部按 `year>=2023` 或「年度制」(`isAnnual`=matches 含 SF1+SF2+GF) 分流，旧分组制(A/B/C、ed2 的 SF/GF)走原路径不变。** 导入第 14/15 届只需产出符合契约的 JSON + 补主题色，渲染零改动。
    - **数据层（`regular-13.json` 现手工维护，勿重跑 parser）**：① 顶层新增 `visual_design`（视觉设计段）；`summary` 改 3 段叙事（`\n\n` 分段）；`rules` 升级为**结构化** `rules.sections[]`（每节 `title`/`body[]`/`list[{k,v,sublist[]}]`/`table{caption,rows[][]}`/`scoring{ranks[],scores[]}`/`foot[]`），旧扁平 `rules{submission,niche_standard,format,voting}` 仍兼容。② 每 `match` 加 `summary`（本场概况，渲染在结果概览上方）。③ entry 新增 `genre`（展示态 Title-Case：`Alternative/Pop/R&B/Soul/Hip-Hop/Rap` 等）、`qualified`(Q/NQ)；GF entry 有 `overall_rank`。④ 多艺人/正字法已按 #15/#119 修正（`Cri & Half Moon Run`、`See You Next Year, EKKSTACY & Mike Dean`、`Jack Kays & Travis Barker`、`Seotud Käed`、`Susanne Sundfør`）。⑤ **狼 GF `score` 存真实折算值 55.5**（jury83+tele28=111÷2；展示四舍五入 56），使得票率与官方 3.68% 精确吻合。⑥ **昵称已规范为「X妈」形式**（members 键 + entries.member + voters.voter，按 members.csv 权威昵称由 id 反查；points 键是 eid 不动）——原 parser 产出单字（萌/羊/S）会导致 tooltip/手机显示单字 + 成员变动跨届姓名匹配失败（ed12「萌妈」≠ ed13「萌」）。**第 14/15 届 parser 应直接输出「X妈」规范昵称**（或导入后同样用 id→CSV 昵称批量规范）。
    - **派生字段进 `recompute_bv_ranks.py`（管线 step 5，通用、向后兼容）**：新增 `derive_rates`（**所有届**算 `support_rate`=该曲 score ÷ 本场 Σ(jury+tele)（折前为分母，故 GF 折算曲分母仍计折前）+ `voters`=给该曲投正分的人数）+ `derive_overall`（**仅年度制**：GF `overall_rank`=GF 名次 1–18；半决赛淘汰曲跨两场按 `support_rate` 降序排 19–N；晋级 SF 条目不带 overall_rank）。已与官方计分板逐项核对：GF rate%/voters 全中、淘汰 19–27=N/文/霜/松/E/麦/鲤/奶/萌。
    - **详情页 `bv-results-render.js`（通用）**：① `BV_THEME[year]`={poster,c1,c2,c2l,c3,glow}（2023=珊瑚红#f84d39/墨绿#1b2f31,c2l=#3c7a6b）→ `buildHero` 主题届渲染**海报 banner**（图内已含标题，无 H1）+ 紧凑 meta，summary 移到独立**简介 Intro** section；无主题年份走原紫色文字 hero。② 新板块：简介/视觉设计（`proseBlock`）、**参赛名单**`entryListBlock`（含 genre 列、按选送者排序：ASCII 名 E/N/S 在前再 CJK 拼音 localeCompare('zh')）、**总成绩单**`scoreboardBlock`（合并 GF+SF 每首一行：overall/选送者+歌/GF(pts·rate%·voters)/SF 徽章(场次位次,SF1=c1 珊瑚红/SF2=c2l 墨绿)·pts·rate%·voters + TOTAL POLL）。③ `rulesBlock` 支持 `rules.sections`（含平台数据表 `.bvr-rule__tbl` + 赋分表 `.bvr-rule__score`）。④ `matchEng` 补 `SF1/SF2`。⑤ **计分板拆块**：年度制每场渲染 `votingMatrixSingle(m,'jury')` + `(m,'tele')` 两张（评委矩阵/观众矩阵，rcp+Total+本类型小计三列冻结）；旧届仍用 `votingMatrix` 合并单表。⑥ GF 折算 `m.note` 渲染在结果概览下（`.bvr-tbl-note`，仅年度制；旧届 note 仍随计分板）。⑦ 每场 `summary` 作 `.bvr-stage-intro`。⑧ `stickyScoreboardCols()` 手机冻结 #+参赛作品两列。⑨ **正文「X妈」自动链接**：`buildMentions(d)` 用全届花名册(EDIDX roster) + 本届 members 建全局 昵称→{id,handle} 映射；`linkMentions(escd)` 在已转义正文上把**已知**昵称（仅 map 内的「X妈」，避免误伤普通字）单次回调替换为 `@handle` 成员链接（`data-nickname` 保留「X妈」→ tooltip 显 X妈）。已接入 `paras`（简介/视觉设计/各场概况）、`rulesSection`(body/foot/list)、`fmtNote`（注释非 token 部分）。**故正文/注释务必用「X妈」形式**（GF 折算注已从「狼/锴」改「狼妈/锴妈」），跨届成员（如 A妈 id132）经 EDIDX 也能解析。
    - **年度制详情页用户微调（本批，已确认）**：① **TOC 文案**：`tocVenue` 把 SF1/SF2→「SEMI-FINAL 1/2」、GF→「决赛」；「结果概览/投票详情」TOC 简化为「概览/详情」；总成绩单 section 抬头(cnLabel)+TOC 均「最终赛果」（enTitle 仍 Scoreboard）。② **计分板**：**仅 GF 拆评委/观众两张**（`votingMatrixSingle`）；**SF1/SF2 合并一张**（`votingMatrix`，评委+观众小分拼一起）。③ **Results 列序（年度制 `resultTableAnnual`）= R/O｜选送者｜歌手｜歌名｜语种｜PTS｜JURY｜TELE｜PLACE**：首列 R/O=`eid+1`（running order）、末列 PLACE=名次；R/O 与 PTS/JURY/TELE/PLACE 均可排序（`wireSortable` 加 `th-ro`/`th-place`）。④ **SF1/SF2 不用金银铜**，改「前 9 晋级」高亮（`.bvr-row--q` 淡蓝底+左条 + PLACE 下「晋级」标 `.place-q`）；**GF 仍金银铜**（作用到 `.place` 列）。⑤ **2023 徽章双色绿→海报浅珊瑚 `#fbb1a9`**（`BV_STRIPE[2023]=['#f84d39','#fbb1a9']` + `BV_THEME[2023].c2l='#fbb1a9'`；计分板 SF2 徽章浅底配深字 `#3a0f08`）。
    - **详情页路径命名规范（已改，全局）**：详情页**薄壳 HTML** 命名 = `barvision/<年>/<届号>.html`——常规版去届号前导零（`regular-01.html`→`1.html`、`regular-13.html`→`13.html`），**娱乐版**=届号+`e`（如 `1e.html`）。`editionHref()`(barvision.html)、`gen_bv_editions_index.py` 的 href、`member-render.js` 的 `renderBvRows` 详情链接均按此（`版本==='unplugged'?'e':''`）。⚠️ **JSON 数据文件名不变**（仍 `data/barvision/barvision-<年>/<版本>-NN.json`，薄壳 `EDITION_SRC` 指向它）。已重命名 1–13 届全部薄壳并重跑 `gen_bv_editions_index.py`。
    - **⭐ 投票制度沿革（重要领域规则，影响 2024/2025 导入与统计）**：**2024 年起吧视才正式引入「观众分」= 20 票自由分配制**（⚠️ 更正：**2024 无每首上限、可 20 票全投一首；2025 起每首≤10 票**——原写"2024≤15票"系误记，已作废，见 #161）；且 **20 票制仅用于决赛 GF 的观众侧**，半决赛 SF1/SF2 的观众仍是 1-12 制（见 #161）；**2024 之前（含 2019/2020/2023）所有投票均为 1-12 分制**，jury/tele 之分仅在于投票人是否选送歌曲。故成员页 **「Jury 均分」改统计「广义 12 分」**（所有 1-12 制投票）：`gen_member_pages.py` 常量 `BV_TELE_SINCE_YEAR=2024`——`year<2024` 的曲目 jury+tele 合并算 `(jury+tele)/(juryN+teleN)`、`2024+` 仅 jury。年度制收敛后该曲已带其进/未进决赛对应阶段(GF/SF)数据（点1规则），故均分自动取对应阶段。rec 新增 `teleN`。改后重跑 `gen_member_pages.py`。⚠️ **导入 2024/2025 时 tele 不是 1-12 分**（是 20 票制），其 support_rate/计分板小分建模需另行处理。
    - **SF 结果概览微调（本批）**：① 列序 `R/O｜选送者｜歌手｜歌名｜语种｜JURY｜TELE｜PTS｜PLACE`（PTS 移到 PLACE 左侧）；② 名次/「晋级」标上下两行贴紧（`line-height:1`、晋级行与未晋级行近等高）；③ 晋级配色紫色调（`.bvr-row--q` 淡紫 + `.place-q` violet-light）；④ TOC 每场合并一条、英文标题（`Semi-Final 1/2`、`Grand Final`），点击跳概览；⑤ 计分板(`votingMatrix`)未晋级行 `.bvr-mtx-row--nq`：选送者 `opacity:0.75`、Total/Jury/Tele 文字 `color-mix … 65%`；⑥ **结果概览 JURY/TELE 分数按各列自身竞赛名次**判定弱化——名次>晋级名额(本届 9)→ 用令牌 `--clr-accent-soft`/`--clr-pink-soft`（=对应 light 色 0.55 alpha，新增于 style.css `:root` 的 light/glow/line/dim/**soft** 梯度），进前 9 则满色（与行总排名解耦）。**CSS 全在 injectCSS 内，无 `?v=`——预览改动需 reload；编辑后浏览器内存缓存顽固（JSON/JS 都可能），用 `fetch(...?cb=)` 重取验证。**
    - **成员页（通用）**：`gen_member_pages.py` 的 `aggregate_barvision` ⚠️ **改为按 space_id 聚合**（经各届 `members[nick].id` 解析）——修复 ed13 单字昵称（萌/羊/S）与早期「X妈」不合并的问题，且对 2024/2025 通用；`main()` 用 `bv_by_id.get(str(space_id))` 匹配，匿名仍键 "匿名"。**年度制收敛**：每位成员合并为**一条**记录（`series`=届号"13"、`rank`=overall_rank）——进决赛者取 GF 数据、淘汰者取 SF 数据（`is_annual_ed`+`_emit_bv` 分流）。`member-render.js` `bvBadges` 2023+ 用 `BV_STRIPE[year]`→徽章 logo 填 **45° 双色斜条纹 `<pattern>`**（inline `style="fill:url(#bvstr-N)"` 覆盖 CSS currentColor）；导出 PNG canvas 同步（clip 到 logo path → rotate 45° 画交替竖带）。
    - **接卡**：`barvision.html` `BUILT_EDITIONS` 加 `/barvision/2023/regular-13.html`；`buildRecentArchiveGrid`（2023–2025 行）**补 `BUILT_EDITIONS.has(href)` 链接逻辑**（原先该行从不可点）。
    - **导入第 14/15 届 SOP（同 BARVISION_MEMBER.md §二 + 本条）**：产出契约 JSON（含 visual_design/结构化 rules/per-match summary/genre/qualified/overall_rank·或靠 recompute 算 overall）→ 薄壳 `barvision/<年>/regular-NN.html` → barvision.html BUILT_EDITIONS 加该 href → **补 `BV_THEME[年]`（bv-results-render.js）+ `BV_STRIPE[年]`（member-render.js）年度配色** → 跑 `recompute_bv_ranks.py --write`（自动派生 rate/voters/overall）→ `gen_member_pages.py` → `gen_bv_editions_index.py` → 校验。**注**：parser 须输出 `qualified`(SF Q/NQ) 才能让 `derive_overall` 区分晋级/淘汰；折算曲 `score` 存折后、`jury_vote/tele_vote` 存折前。
    - ⚠️ **#157 部分细节已被后续多轮微调取代——2023+ 详情页/总成绩单的「最终」样式·配色规范以 #158 为准。**
158. **⭐ Barvision 2023+ 年度制详情页 — 最终设计规范（精确到各表/板块样式·配色，2024/2025 复用基准）**。全部由 `scripts/bv-results-render.js` 渲染（薄壳 + JSON 驱动），按 `theme(d)`(=`BV_THEME[year]`)/`isAnnual(d)` 分流，旧届零改动。**导入新年度届：只补 `BV_THEME[year]`+`BV_STRIPE[year]` 两处配色，渲染零改。**
    - **路径命名（全局，#157）**：详情页薄壳 = `barvision/<年>/<届号>.html`（去前导零，如 `13.html`；娱乐版 `<届号>e.html`）。JSON 数据文件名仍 `<版本>-NN.json`。`editionHref`/`gen_bv_editions_index`/`member-render` 均按此。
    - **`BV_THEME[2023]`**：`poster:'../../assets/images/barvision/2023/poster.png'`、`c1:#f84d39`(珊瑚红,主)、`c2:#1b2f31`(墨绿)、`c2l:#fbb1a9`(浅珊瑚)、`c3:#fbb1a9`(浅珊瑚)、`glow`。渲染时 `--bvt-c1/c2/c2l/c3` 内联在 `.bvr-hero--bg` 上（**仅 hero 用主题色；hero 以下板块保持站点默认 violet——用户明确**）。
    - **板块顺序**：Hero → 视觉设计 → 赛制 → 参赛名单 → 成员变动 → SF1(结果概览+投票详情) → SF2 → GF → 总成绩单 → 上下届导航。（**简介已并入 hero，无独立 Intro 板块**。）TOC：每场合并一条英文标题（`Semi-Final 1`/`Semi-Final 2`/`Grand Final`）+ 视觉设计/赛制/参赛名单/总成绩单；点击跳该场结果概览。
    - **Hero（`.bvr-hero--bg`，海报作背景 + events.html 内容布局）**：`min-height:72vh; display:flex; align-items:center`（内容垂直居中，inner `width:100%` max-1200）。`.bvr-hero__poster`(海报 `background:cover center`，z 在底) + `.bvr-hero__scrim`(渐变遮罩：`linear-gradient(90deg, rgba(8,8,18,.94) 0%, .80 26%, .30 66%, .14 100%)` 左深右透出 logo + `linear-gradient(0deg, rgba(8,8,18,.78) 0%, transparent 40%)` 底加深)。内容 z-index:2。结构：`.bvr-eyebrow`(← Barvision) + `<h1 class="bvr-title">城市英文<br><span class="bvr-hero__yr">年份</span></h1>`(城市英文 = edition_name 去「Barvision」前缀+年份；城市白色，年份 c1) + `.bvr-hero__meta`(竖分隔 `.bvr-hero__mi`，顺序 = cn_name｜`Barvision <城市> <年>`｜主办：@host) + `.bvr-hero__desc`(简介 `.bvr-hero__p` 段落)。**配色全主题色**：eyebrow→c1、年份→c1、meta 文字→c3、meta 内 @host 链接→c1、简介正文→c3、简介内 @成员链接→c3。简介用 `@handle` 显示（非昵称）。
    - **赛制 Rules（结构化 `rulesBlock`，`rules.sections[]`）**：**不写来源**（已全局移除）。每节 `.bvr-rule`：`.bvr-rule__h`(16px 粗体白 + 左 3px violet 边) / `.bvr-rule__p`(正文 text-2) / `.bvr-rule__list`(k=`.bvr-rule__k` violet-light、v=text-2、sublist 有序) / 平台数据表 `.bvr-rule__tbl`(**caption `.bvr-rule__cap`=violet-light 13px 粗体【醒目标题】；行首 th 平台名=text-2【常规】**) / 赋分表 `.bvr-rule__score`(分数行金色 `.bvr-rule__sc`) / `.bvr-rule__foot`(text-3)。
    - **参赛名单 Entries（`entryListBlock`）**：列 选送者(@nick)｜歌手｜歌曲名｜语言｜流派(`.bvr-el__genre` text-3)。按选送者排序：ASCII 名(E/N/S)在前、CJK 拼音在后。复用 `.bvr-tbl`。
    - **结果概览 Results（年度制 `resultTableAnnual`）**：列 **R/O｜选送者｜歌手｜歌名｜语种｜JURY｜TELE｜PTS｜PLACE**。①`.ro`(R/O=出场顺序：SF 按艺人字母 A–Z、GF 按 eid+1)；②`.place`(末列名次)——**GF 前三金/银/铜**(`.bvr-row--1/2/3 .place`)；**SF 不用金银铜**，晋级(前 9，`qualified`)行=`.bvr-row--q`(淡紫渐变底 `rgba(168,85,247,.11)`+左 3px violet 条)，名次下方贴一行 `.place-q`「晋级」(violet-light 9px，`line-height:1` 紧凑、与未晋级行近等高)；③`JURY/TELE`=`ptsCell`(值+`#`列内竞赛名次)——**SF 专属**：该分数其**本列**名次 > 晋级名额(9) → `.pts--nq` 弱化为 `var(--clr-accent-soft)`(评委)/`var(--clr-pink-soft)`(观众)（按各列自身名次、与行总排名解耦）；④`PTS`=总分。⑤GF 折算注 `m.note` 渲染在结果表下 `.bvr-tbl-note`。
    - **投票详情 计分板**：**GF 拆两张**(`votingMatrixSingle` → Jury Scoreboard + Tele Scoreboard)；**SF1/SF2 合并一张**(`votingMatrix`，评委+观众小分拼一起)。三表均：列首加 `.ro` R/O(12px，**可排序**、首点升序)；**选送者(rcp)列取消排序**；**Total/Jury/Tele 可排序**(`data-msort`+`wireMatrixSort`)。冻结列 = R/O+选送者+Total+(Jury/Tele)(`stickyMatrixCols` 写 `--mtx-l-rcp/tot/sj/st`)。0 分不显示；12 分金标 `.pt--12`。**SF 未晋级行 `.bvr-mtx-row--nq`**：选送者 `opacity:.75`、Total/Jury/Tele 文字 `color-mix(… 65%, transparent)`(各投票人小分 `.pt` 不弱化)。
    - **总成绩单 Scoreboard（`.bvr-sb`，`scoreboardBlock`，每首一行合并 GF+SF）**：列 **#｜选送者｜参赛作品｜Grand Final(Points/Rate/Jury/Tele/Voters)｜Semi-Final(SF徽章+Points/Rate/Jury/Tele/Voters)**。①参赛作品 = `.bvr-sb-artist`(歌手,上,粗体白) + `.bvr-sb-title`(歌名,下,12px text-2)；选送者 `.bvr-sb-by` 样式同歌手(粗体白)；**前三名选送者/歌手/歌名 = `--clr-gold/silver/bronze-tint`**(`.bvr-sb-row--1/2/3`)，# 名次金/银/铜。②`Jury/Tele/Voters` 与 `Rate` 同色(GF=text-2/SF=text-3)；**各列(Jury/Tele/Voters)最大值 → `.is-max` → `var(--clr-text)` 白加粗**。③得票率 `support_rate` 2 位小数；分母 = 该场 Σ(jury+tele 折前)，分子 = score。④**SF 徽章 `.bvr-sb-badge`**：SF1 底=`var(--clr-pink-deep)`(#8a2548 深绛红)、SF2 底=`var(--clr-cta-3)`(#4c18a0 深紫)、文字白(`--clr-text`)。⑤边框统一 1px(组分隔线仅 `--clr-border-2` 色区分)。⑥`min-width:1000px`；手机冻结 #+选送者+参赛作品 三列(`--sb-l-by/song`，class 选择器避开两行表头)。⑦底部 `.bvr-sb-poll`(顶部细分隔线)：`总投票人数` + `Grand Final/Semi-Final 1/Semi-Final 2` 各项 = 阶段名 + Bebas 数字(`.bvr-sb-poll__n` 18px text-2)。
    - **正文 @名自动链接（`buildMentions`/`linkMentions`/`mentionLink(nick,useNick)`）**：用全届花名册 + 本届 members 建昵称→{id,handle} 映射，正文/注释里已知「X妈」→ `@handle` 链接（`linkMentions` 第二参 `useNick=true` 则显中文昵称，仅 hero 简介用过、现已回退为 @handle）。接入 `paras`/`rulesSection`/`fmtNote`/hero meta。**故 JSON 文本里成员一律写「X妈」**（自动转 @handle）。
    - **新增 style.css 令牌**：`--clr-accent-soft:#1e6789`、`--clr-pink-soft:#7c3465`（=accent-light/pink-light 50% 合成于 bg 的不透明等效，用于 Results 弱化 JURY/TELE + 成员页走势未进决赛点）；`--clr-pink-deep:#8a2548`（Scoreboard SF1 徽章）。金银铜 tint：`--clr-gold/silver/bronze-tint`。
    - **成员页（`member-render.js`/`gen_member_pages.py`）**：徽章 2023+ 用 `BV_STRIPE[2023]=['#f84d39','#fbb1a9']` 45°→**60°斜双色条纹**(`patternTransform="translate(0,26) rotate(60)"` 含下移 1px) + 导出 PNG canvas 同步；徽章数字字号统一 300/y497(一两位一致)。`@名`(`.mp-handle`)`letter-spacing:.02em`。**Jury 均分 = 广义 12 分**(2024 起才有独立观众分=20 票制，`BV_TELE_SINCE_YEAR=2024`：<2024 算 jury+tele 合并、2024+ 仅 jury)。走势图未进决赛(`final===false`)正式曲点 = `.is-soft`(accent-soft/pink-soft)；图例混淆圈 `cy=8.5`(下移 1px)。`aggregate_barvision` **按 space_id 聚合**；年度制 SF→GF 收敛(每人一条 rank=overall_rank)。
    - **barvision.html 近届卡(2023–2025)**：上半 logo 区可用主视觉背景图 `RECENT_BG[year]`(2023=`assets/images/barvision/2023/bg.png`，`.bv-arch-card__logo--img` 加暗罩 + **`background-clip:padding-box` 防半透明 border 透出亮边**)。hover 增强(紫边+上浮 3px+发光)；**前 12 届(`.bv-archive-grid`)hover 改 `--clr-pink-light` 粉色**(娱乐版仍紫)；fade-up 覆盖卡片过渡的 bug 已提权恢复(置于 `prefers-reduced-motion` 内，#64 同款)。
159. **2026 主视觉接入 + 2023 详情页收尾（相关链接 / 手机端 / 配色微调；本次，部分修订 #158）**：
    - **2026 主视觉**：`assets/images/barvision/2026/{poster,bg}.png`（均 16:9，蓝/青/紫流光；poster 含 "Barvision SONG CONTEST CHONGQING 2026" logo 文字，bg 无文字）。① **`events.html` hero**：`poster.png` 作背景（`.ev-hero__poster` cover/center + `.ev-hero__scrim` 复用 2023 左深右透渐变），**移除右列 SVG logo → 单列文字**（`.ev-hero__layout` 改 `max-width:620px`，poster 右侧自带 logo 透出），去 `.ev-hero__grid`/`.ev-hero__watermark`、**保留 `.ev-hero__glow`**（DOM 序 poster→scrim→glow→inner，glow 叠 scrim 上）。② **`barvision.html` XVI 当届卡 `.bv-current-card`**：`background:url(bg.png) center/cover` + `background-clip:padding-box`（防半透 border 亮边），`::before` 由网格纹改**暗罩渐变**（`135deg` 左深右浅 0.85/0.66/0.40 + 底 0.45），hover `::before{opacity:0.82}`，`:hover` 去掉原 background 渐变替换。**扁卡(4.46:1)「铺满」与「缩小图案」物理互斥**（缩小必留白/黑边）——用户最终选 **cover 铺满**。
    - **`events.html`「本页上次更新于」**：约定每次改 events.html 内容**顺带把日期改当天**（memory `feedback-events-update-date`）。`.ev-meta-item` 仍 `--clr-text-3`#A39BC2 不透明（偏淡是颜色本身、非降透明度）。
    - **Hero scrim（2023 详情页 `.bvr-hero__scrim` + events.html `.ev-hero__scrim` 同值，修订 #158）**：`linear-gradient(90deg, .88 0%, .72 26%, .18 66%, .05 100%)` + `linear-gradient(0deg,.72,transparent 40%)`（左调浅、右更透出 logo）。
    - **2023 hero @名 + meta（修订 #158）**：hero 简介/meta 内 **@名回归 `.member` 全局榜吧蓝 #8FBEE3**（删原 `.bvr-hero--bg .bvr-hero__desc .member`(c3) / `.bvr-hero__mi .member`(c1) 覆盖）；**meta 文字 `.bvr-hero__mi` = c1 珊瑚红 #f84d39 @ 0.85**（`color-mix(in srgb, var(--bvt-c1) 85%, transparent)`，与 eyebrow/年份同色；`.bvr-hero__mi` 仅 2023+ 主题届渲染，旧届 hero 无此类、不受影响）。
    - **赋分表分数配色**：`.bvr-rule__sc` 默认改 `--clr-text` 白；首位 12（renderer 给 `scores[0]` 加 `.bvr-rule__sc--top`）金色 `--clr-gold-light`。
    - **「Top10」→「Top 10」**：**投票排名语境**全部加空格（regular-01/02/03/04/05/06/07/12 的 `voting` + regular-13 的 rules.body / SF1·SF2·GF 三段 summary）；**资格门槛类**（niche/submission 里 Top100/Top50/Top20/「无 Top10 单曲」=榜单名次门槛）**保留不加空格**。今后录入：排名提交类统一「Top 10」。
    - **「相关链接」section（新增，通用）**：JSON 顶层 `links{ replays:[{label,url}], playlists:[{platform, items:[{label,url}]}] }`；`linksBlock(d)`（**任意届 `d.links` 存在即渲染**，旧届无则跳过）→「直播回放」(replays) +「歌单链接」(各平台分组，如 Spotify / 网易云音乐)；section 置于**最终赛果之后、上下届导航之前**，TOC 末加「相关链接」；样式 `.bvr-links__h`(16px 粗体白 + 左 3px 紫边) / `.bvr-links__subh`(violet-light 13px) / `.bvr-link`(14px 下划线，hover violet-light，`target=_blank`)。
    - **手机端优化（2023/13.html，均 `@media max-width:768px`）**：① **参赛名单选送者**桌面 @handle / 手机 X妈（`entryListBlock` 去 `{nick:true}` 回默认 @handle，靠既有 `.bvr-tbl .member` 移动端 `font-size:0`+`::before` 昵称规则切换；旧 `nick:true` 桌面也显 X妈是 bug）；② **参赛名单(`.bvr-el`) + 总成绩单(`.bvr-sb`) 取消冻结列**（`position:static`，完全左右滑动；参赛名单覆盖 `.bvr-tbl` 前三列 sticky、总成绩单移除 sticky 块）；③ 总成绩单 `#`16px/选送者12px/歌手12px/歌名11px；④ **hero(poster)** `min-height:auto`、标题 `clamp(34px,10.5vw,52px)`、scrim 改竖向 `linear-gradient(180deg,.86,.76 48%,.90)`（整体加深保证密集流光底图上文字可读）。
    - **barvision.html `.btn--primary` 手机端去粉色辉光**（`@media` box-shadow → `0 0 16px rgba(168,85,247,0.2)` 仅紫）：「右侧露底粉色」根因=**box-shadow 粉色分量** `rgba(224,64,160,0.12)` 在深底上的光晕，**非渐变末端**（渐变 100% = cta-3 #4c18a0 深紫）。⚠️ **调试坑**：`.btn--primary` 带 `transition:box-shadow 0.35s`，注入/改规则后**同步读 `getComputedStyle` 永远读到过渡起始帧(旧值)**误判没生效——验证带 transition 的属性须**新建一个干净元素读静态值**，或等过渡结束(>350ms)再读。
    - **狼妈歌名修正**：Thomas Headon — `not saying goodbye :(`（regular-13 SF1+GF 两处，重跑 `gen_member_pages.py`）。
    - ✅ **「ed13 缺成员变动 + 上下届导航」经查为预览端缓存假象，非 bug、无需改代码**：boot（`bv-results-render.js` 末 `Promise.all`）用 `fetch('../../data/barvision/editions-index.json')` **无 cache-bust** 拉索引；预览 Python `http.server` 不发 `Cache-Control` → 浏览器启发式缓存了 **ed13 加入索引前的旧版（仅 12 届、无 ed13）**，boot 拿到旧索引 → `EDIDX` 无 ed13 → `curIndex(ed13)=-1` → `memberChangesBlock`/`navBlock` 开头 `return ''`。**磁盘 `editions-index.json` 实为 13 届含 ed13**（`?cb=` fetch 验证 13 届 / 无 cb 取到 12 届旧缓存，对比确证），代码逻辑正确（ed2 等命中正常）。**GitHub Pages 发 Cache-Control，线上 fresh 访问 / 返客 10 分钟内刷新即正常**。教训：`editions-index.json` 无版本号，预览验证「成员变动/导航」须用真机或清缓存，勿被预览启发式缓存误导。
160. **第 14 届（Tonghua 2024）导入第一阶段：主视觉/主题/hero 通用增强 + 移动端悬浮 TOC（本次；数据未导，详情页仅 hero）**：
    - **2024 主视觉**：`assets/images/barvision/2024/{poster,poster-pink,bg-pink,bg-blue}.png`（均 16:9）——`poster-pink.png`=**粉版 + logo**（桌面 hero 现用，#161 末由蓝版改定）、`poster.png`=蓝版 + logo（深 navy `#09184e` + 通化河流地图，已弃用于 hero）、`bg-pink.png`=粉色无字（手机 hero + 近届卡）、`bg-blue.png`=蓝色无字（弃用）。本届主视觉另含「地铁线网图」(Poster General) 等多版，源在 `D:\Genius\Barvision\Barvision 2024\Graphics`。
    - **主题配色（用户定，#161 末定稿：hero 桌面/手机均粉版 + 粉字）**：`BV_THEME[2024]`={poster:`poster-pink.png`(桌面 粉版+logo), posterMobile:`bg-pink.png`(手机 粉色无 logo), c1:`#f13b8d`(深粉,主), c2:`#09184e`(navy,辅助/辉光), c2l/c3:`#fc91c1`(浅粉), glow(粉+navy)}（取自 Poster Pink 三粉 + Poster Blue 辅助）；`BV_STRIPE[2024]`=`['#fc91c1','#f961a6']`(浅粉/中粉,徽章)；`RECENT_BG[2024]`=`bg-pink.png`(近届卡)；`BUILT_EDITIONS` 加 `/barvision/2024/14.html`。
    - **薄壳 `barvision/2024/14.html` + `data/barvision/barvision-2024/regular-14.json` 当前为 hero 元数据 stub**（`matches:[]`、带 `_stub` 字段、members 仅 4 人）——**仅为「试」hero；下一步 parser 填 SF1/SF2/GF**。summary 为按 intros 备稿草拟版（S妈 Pretender 266 分破纪录 / 雨妈 Eyes Wide / A妈 Honeycrash），**文案待新窗口细化**。
    - **⭐ hero poster 通用机制（2023+2024，修订 #158/#159 hero）**：`BV_THEME` 加 `posterMobile`；poster 背景图改走 CSS 变量——`buildHero` 把 `--bvt-poster:url(poster)` + `--bvt-poster-m:url(posterMobile||poster)` 写进 hero inline vars，`.bvr-hero__poster` 不再 inline bg。① **桌面** `.bvr-hero__poster { background-image:var(--bvt-poster); background-position:right center }`——**右锚定**，cover 缩放裁切时优先保右侧 logo 完整（裁切发生在左侧、被 scrim 压暗）；② **手机**(`@media≤768`) 切 `background-image:var(--bvt-poster-m); background-position:center`——用**无 logo 的 bg 版**（手机屏放不下完整 logo）：2024→`bg-pink.png`（#161 末由 bg-blue 改粉版）、2023→`bg.png`。
    - **⭐ 移动端悬浮 TOC（所有详情页通用；桌面零改动）**：`buildTOC` 把条目包进 `.bvr-toc__list`、加 `.bvr-toc__toggle`（桌面 `display:none`、list 常显＝原样）。`@media≤768`：toggle=42×42 **对齐 back-to-top 风格**（`rgba(20,20,34,.5)`+`blur(12px)`+`border-2`+圆角4+紫色 list 图标，`bottom:66px/right:20px` 在 back-to-top 正上方）；`.bvr-toc__list` 默认 `display:none`，`.bvr-toc--open` 时展开 glass 面板(`rgba(20,20,34,.72)`+blur，在按钮上方，max-height 62vh 可滚)。JS：点 toggle 切 `--open`、点条目→滚动定位+收起、点面板外部(document click 判 `!nav.contains`)→收起；桌面 toggle 隐藏故 `--open` 无副作用。active 高亮沿用原 IntersectionObserver。
    - **文案（本次）**：① 2023+2024 intro「经两场半决赛**后共有** 18 首进入决赛，**并**由评审团与观众投票共决冠军」、「**最终，**」加逗号；2024 删「（评审 123 + 观众 143）」及「最终」后多余空格。② 2023「**匿名」去重**——全文仅留 1 处「采用匿名参赛制」：参赛与报名第二处「比赛全程要求匿名参赛，参赛信息不得提前泄露」→「参赛信息全程不得提前泄露」；SF1/SF2 summary「采用匿名投票与 Top 10 排名制」→「采用 Top 10 排名制」。**⚠️ 用户否决了对 2023 赛制/各场 summary 的大幅精简，只接受「匿名」去重**——后续勿擅自精简这些文案。
161. **第 14 届（Tonghua 2024）赛果数据 + 20 票观众投票制渲染适配（本次，详情页/成员页/总成绩单全数据驱动完成、桌面+手机预览验证）**：
    - **数据层**：`scripts/parse_bv_edition14.py` → `data/barvision/barvision-2024/regular-14.json`（SF1/SF2/GF 三场年度制）。冠 S妈 Pretender 266（评 123+观 143，破纪录、S妈首冠）/亚 雨妈 Eyes Wide 259/季 A妈 Honeycrash 209；overall 1–28；观众总票 520=26×20。**导出后转手工维护、勿重跑覆盖**（同 #141/#157）。
    - **⭐ 数据源**：**半决赛逐票读 `Barvision Tonghua 2024.xlsx「SF1」「SF2」`（完整！）**——⚠️ `data\24-SF2.csv` **漏了「雨」一列**（各行差值之和 = 58 = 雨完整 Top10，由此发现）；语种 Excel 无、取自 `data\24-SF1/SF2.csv` col5（按歌名匹配）；决赛读 `data\24-GF-JURY.csv`（评委票=各 1-12 票和）+ `24-GF-TELE.csv`（观众票 raw + 观众分）。**异构源兜底法**：完整票数据以 Excel 为准、文本/语种从 CSV 补。
    - **⭐ 投票制度（更正 #157）**：**半决赛 SF1/SF2 评委+观众均 1-12 Top10 制**（同 2023，jury=本场选送者、tele=其余，score=各票和）；**仅决赛 GF 观众=20 票自由分配制（可全投一首、无每首上限；2025 才有每首≤10）**。GF entry：`tele_vote`=观众分（CSV 直接给，折算公式 实际观众分=(票/总票)×58×评委人数 无法精确复现 同 55 票→143/140，**故直接采用 CSV 不重算**）、新增 `tele_raw`=观众票原始数、`score`=评委票+观众分（**本届无折算、无混淆、无匿名**）。GF match 加 `tele_mode:"votes"` 标记。
    - **⭐ 决策：决赛观众不设 12 分**——GF 观众投票人**无 `top` 字段**；渲染按 `m.tele_mode==='votes'` 分流：`votingMatrixSingle(...,'tele')` 无金标(`pt--12`)、`twelveBlock` 跳过 tele(12 Points 仅评委)、`gen_member_pages._emit_bv` 的 12 分次数排除 tele(`vote_mode && type==='tele'`)。半决赛 tele 仍 1-12、正常金标统计。
    - **⭐ 总成绩单 GF VOTERS 拆「评委数/观众数」两列**（对标官方 `Graphics\Scoreboard 2024.png`，忽略 ODD 列）：`scoreboardBlock` 的 `stat5→stat6`（6 列 Points/Rate/Jury/**评委数**/Tele(观众分+`观众票`X票)/**观众数**）；投票人数渲染端 `voterCounts(m)` 按 type 数该首 points>0 的人；各数值列 `is-max` 高亮；GF 组 colspan 6、SF 组 colspan 7、`.bvr-sb` min-width 1120。已与官方逐项核对（Pretender 评 123/评委数 18/观 143·55 票/观众数 16）。
    - **外部投票人**：Watermelonnew（非榜吧成员，仅 SF1 观众投票）→ 规范「外部」，`members` 项 `{id:null,handle:'外部',external:true}`；`memberLink` 外部分支 → `.bvr-ext`（弱化斜体、无 @、无链接、无 tooltip）。parser `EXTERNAL` 集合 + `canon1` 归一。
    - **合报**狼妈(113)/芬妈(110)：SF2 联合选送+联合投票（一份票），GF 也合体投票；规范「狼妈/芬妈」（`member_id=null`，`JOINT_CANON` 强制顺序），下游按 `/` 拆分计入两人。**羊妈/威妈各报名 2 首**（分属两半区，规则允许东道主各 2 首）——年度制聚合产生**该届 2 条记录**；走势图 `drawBvTrend` 现有逻辑天然处理（`rep=official[0]`=较好名次连线、两点都画、较差者 `is-dim`，符合「连线取成绩较好者」）。
    - **平局**：包妈/威妈 SF1 同 86 分，全局 #144 规则（观众分高者优先）→ 包妈 overall 22/威妈 23；官方 scoreboard（评委分高者）→ 威妈 22/包妈 23。**沿用全局规则、与官方微异**（用户确认，同 #146「并列名次可能与官方微异，已接受」先例，不为单个平局改全局规则）。
    - **parser 关键**：build_semi **必须按得分 top 9 设 `qualified`**（否则 `derive_overall` 把全部 SF 当淘汰、overall 错到 46）；`recompute_bv_ranks.py --write` 派生 rate/voters/overall；之后 `gen_member_pages.py` + `gen_bv_editions_index.py`。⚠️ recompute --write 会重排版**所有**届 JSON（幂等、仅格式 churn），导入单届后须 `git checkout` 还原非本届 JSON（reg-13 等含手工压缩 links 格式，会被展开）。
    - **links 顶层支持 `recaps` 类**：`linksBlock` 加「赛事回顾」组（介于「直播回放」与「歌单链接」之间）。2024 含直播回放 2 + Recap 3 + 歌单(Spotify 3 + 网易云 3)。
    - **接卡**：BV_THEME[2024]/BV_STRIPE[2024]/RECENT_BG[2024]/薄壳 `barvision/2024/14.html`/BUILT_EDITIONS 均 #160 已建；本次仅填数据 + 文案，**未改主题/hero**。
    - **⭐ 概览卡「双歌只计较好者」（gen_member_pages，本批后续；东道主双歌通用规则，ed15 复用）**：年度制同一届有 ≥2 首正式单曲（东道主/协办，如 ed14 羊妈/威妈）时，**个人主页概览卡统计只计成绩较好(rank 最小)那首**（best/avg/top1/top3/top10/参与场数/twelve/jury_avg + member.html 卡片「参加场数」count 均按去重计）；**参赛表与走势图仍显示全部两首**（用全量 `entries`）。实现：`aggregate_barvision` 用 `x.get("final") is not None` 选年度制记录、按 `edition_no` 保留 rank 最小者；旧分组制（无 `final`、每组独立一「场」）不去重。
    - **总成绩单 GF points 字号**：`.bvr-sb-pts` 15px→**14px**（与 SF `.bvr-sb-pts.is-sf` 一致；颜色 `--clr-text`/字重 700 不变；无 mobile override 故桌面+手机同步）。2023/2024 共用渲染、均生效。
    - **波妈(id101) handle 全局改名**：`ww_micro_微波`→`微波子`（=其 B 站名 `bilibili_name`）；改了 7 文件：members.csv(`space_name`) + member/101.html + regular-14.json + editions-index.json + index.html(MEMBER_MAP) + member.html + hof_data.json(owner_map)。**唯一字符串、全局字面替换**；昵称「波妈」不变。
    - **下一步：第 15 届（Jinzhong 2025）**——见 #162（主题/hero 已接，数据待导）。
162. **第 15 届（Jinzhong 2025）主题/hero 接入（本次；数据未导，详情页仅 hero + 视觉设计 stub）**：
    - **主视觉**（设计=威妈：深红格栅抽象"晋中"笔画 + 橙黄马赛克取自平遥古城剪影/丘陵地貌）：`assets/images/barvision/2025/{poster,bg,bg-orange}.png`（均 16:9，用户放）——`poster.png`=橙黄渐变+logo右（桌面 hero）、`bg-orange.png`=橙黄渐变无 logo（手机 hero）、`bg.png`=深红块状无 logo（近届卡 RECENT_BG；红=主基调）。
    - **主题配色（用户试色定稿：桌面/手机均橙调 + 橘红字）**：`BV_THEME[2025]`={poster:`poster.png`(桌面), posterMobile:`bg-orange.png`(手机), c1:`#df5a2c`(橘红——由初版纯红 `#d4232a` H358° 往橘调降饱和至 H15°), c2:`#5e0f14`(深酒红 glow), c2l/c3:`#f4a259`(暖橙，hero 简介/徽章浅), glow(橘红+暖橙 radial)}；`BV_STRIPE[2025]`=`['#f4a259','#e0612e']`(暖橙/深橙 徽章)；`RECENT_BG[2025]`=`bg.png`(近届卡)。
    - 薄壳 `barvision/2025/15.html` + `BUILT_EDITIONS` 加 `/barvision/2025/15.html`；stub `data/barvision/barvision-2025/regular-15.json`（hero 元数据 + 视觉设计文案 + 设置型 summary[赛果待补]、`matches:[]`、`_stub`）。城市晋中、主办 S妈(上届冠军代表)、协办威妈、`cn_name` 第十五届。
    - **下一步：导 2025 赛果数据**（SF1/SF2/GF）——源 `D:\Genius\Barvision\Barvision 2025`（`Barvision 2025 Semi-Final 1/2.xlsx` + `Barvision 2025.xlsx` + `data/`，另有 `BarVision2025报名总则…docx` 出规则、`GF-Running Order-Jury.png` 等）；GF 18 首名单已知（图3：丁/威/芬狼/邓/S/吃/鸽/奶/杰/汞/萌/羊/X/包/雨/泰/韩/松）；**2025 观众分每首≤10 票**（GF `tele_mode='votes'` 无 top，同 #161）；按 BARVISION_MEMBER.md §二 SOP + #161 走（parser 设 qualified、recompute/gen 管线、东道主双歌概览自动去重）。

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
