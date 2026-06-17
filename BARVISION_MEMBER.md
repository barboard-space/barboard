# Barvision 成员主页「吧视」板块 — 数据导入与样式说明

> 适用：成员个人主页 `member/<space_id>.html`（薄壳，仅含 `MEMBER_DATA`），由共享模板 `scripts/member-render.js` 渲染。本文件聚焦**如何导入新一届赛果**，以及吧视板块各组件的样式/逻辑约定。详情页体系见 `CLAUDE.md #130`、`DESIGN.md §六`；成员页功能起源见 `CLAUDE.md #131`。

---

## 一、整体数据流

```
每届 Excel
  └─ scripts/parse_bv_edition.py ──▶ data/barvision/barvision-<年>/<版本>-NN.json   (单届完整赛果)
                                          │
        ┌─────────────────────────────────┼──────────────────────────────────┐
   详情页(薄壳+bv-results-render.js)   scripts/gen_member_pages.py          barvision.html
   barvision/<年>/<版本>-NN.html          │  load_bv_editions + aggregate_barvision   (BUILT_EDITIONS 加 href)
                                          ▼
                       member/<id>.html  的 MEMBER_DATA.barvision{overview, entries[]}
                       + data/barvision/member-bv-index.json   (member.html 筛选用)
                                          ▼
                       member-render.js 渲染：届数徽章 / 概览卡 / 可排序表 / 场次图例 / 走势图
```

**关键原则**：成员页所有吧视内容都从 `MEMBER_DATA.barvision` 派生，而它由 `gen_member_pages.py` 从各届 JSON 聚合。**改了任何届的赛果 JSON，必须重跑 `python scripts/gen_member_pages.py`**（同时刷新所有成员页 + `member-bv-index.json`）。

---

## 二、导入新一届的步骤

1. **拿到该届 Excel**（赛果 + 逐票矩阵），运行 `scripts/parse_bv_edition.py` 生成 `data/barvision/barvision-<年>/<版本>-NN.json`。各届 Excel 结构可能不同，脚本的分组/列解析需按届微调。
2. **复制详情页薄壳**到 `barvision/<年>/<版本>-NN.html`，改 `var EDITION_SRC` 指向新 JSON。
3. **`barvision.html` 的 `BUILT_EDITIONS`** 集合加入该届 href（届次卡变可点）。
4. **检查 `member-render.js` 的两个常量**（见下「四」）——是否需要为新年份加配色、是否要更新「最新届」号。
5. **重跑** `python scripts/gen_member_pages.py` —— 聚合进各成员页 + 刷新 `member-bv-index.json`。
6. 完成。成员页徽章 / 概览 / 表格 / 走势图全部自动反映新数据。

---

## 三、`entries[]` 关键字段（影响成员页）

聚合后注入 `MEMBER_DATA.barvision.entries[]`，每条 = 该成员参加的**一场**：

| 字段 | 说明 | 用途 |
|------|------|------|
| `rank` | 该场名次（整数；混淆曲可能为 null） | 名次列、前三金银铜、走势 Y、概览 best |
| `edition_no` | 届号（1,2,…,16） | 届次列、徽章数字、走势 X、排序 |
| `year` | 年份（2019/2020/2023…） | 徽章 logo 配色（`BV_YEAR_COLOR`）、详情页链接 |
| `version` | 版本（如 `regular`） | 详情页链接路径 |
| `series` | 场次代码：纯数字=无分组 / 字母 `A B C SF GF E`=组别 | 场次列、走势 X 标签、同届排序 |
| `song` / `artist` | 歌名 / 歌手 | 表格、走势 tooltip |
| `total` | 总分 | 表格、排序 |
| `twelve` | 获得 12 分次数 | 表格、排序、概览 |
| `is_shadow` | 混淆（影子）曲 | 表格灰斜体「混淆」标、走势空心点+虚线、排序末尾、概览不计正式 |

`overview` 字段：`best`（最佳名次）/ `top1`(+`top1_shadow`) 夺冠场数 / `top3`(+`top3_shadow`) 前三场数 / `entries`(+`shadow`) 参与场数 / `twelve` 12分次数 / `debut` 首次届 / `active_in` 最近届 / `active` 是否活跃。

---

## 四、导入新届时**必查/必改**的常量

### `scripts/member-render.js`

- **`LATEST_ED`**（bvSection 内，当前 `16`）：「最新一届」的届号。概览卡「最近参赛」== 此值才正常显示，否则用 `--clr-text-3` 弱化；走势点 `edition_no===16` 用 `--clr-red-light` 标记。**开新一届时改成新的最新届号**（并同步走势点 `is-latest` 判断里的 `16`）。
- **`BV_YEAR_COLOR`**（IIFE 顶部）：徽章 logo 描边色，按 `year` 映射。**2019=`--clr-board`（创始，已定）；2020/2023/2024/2025/2026 当前为占位色，待用户最终确认**。导入到新年份（如 2027）须补一条。缺失年份回退 `--clr-board`。

### `scripts/gen_member_pages.py`

- **`BV_ACTIVE_SINCE_YEAR`**（当前 `2024`）：最近参赛年份 ≥ 此 → `active=true`（member.html 实心徽章），否则空心。规则待用户最终确认。

---

## 五、组件样式 / 逻辑速查（均在 `member-render.js`）

### 1. 大名届数徽章 `bvBadges()`
- 大名右上角，**每参加一届一个徽章**并排（数字=届号）；空心五边形 logo（inline SVG，path 同 `logo_hollow.svg`），`fill` 用 `BV_YEAR_COLOR[year]`（`currentColor`）。
- 数字色：**第一届 = `--clr-board`，其余届 = 白**；两位数届号自动缩小字号（fs 360→300）并下移 baseline 居中。
- **尺寸**：桌面 30×29px；**手机端缩小 15%**（≈21.25×20.4）、`margin-left` 离大名 **7px**（桌面 9px）。
- 仅 `MEMBER_DATA.barvision` 存在且有 `edition_no` 时渲染。

### 2. 概览卡 `stats`（`.mp-bv-stat`，flex 居中）
7 项：最佳名次 / 夺冠场数 / 前三场数 / 参与场数 / 12 分次数 / 首次参赛 / 最近参赛。配色规则：
- **最佳名次**：前三 → 金 `--clr-gold-light` / 银 `--clr-silver` / 铜 `--clr-bronze`；该名次出现 >1 次，数字后加 `(次数)`（`.mp-bv-rep`，小一号、`opacity .85`、跟随数字色）。
- **夺冠场数**：>0 金色，==0 弱化 `--clr-text-3`。
- **计数值为 0** 的项一律 `--clr-text-3` 弱化。
- **最近参赛**：== `LATEST_ED` 正常白，否则 `--clr-text-3` 弱化。
- 「第 N 届」格式：**数字前后留空格**；含中文的值自动用 DM Sans（`.mp-bv-stat__v--cjk`，20px/600），纯数字用 Bebas 26px。

### 3. 可排序参赛表 `.mp-bv-tbl`（`renderBvRows` + `sortBvEntries`）
- 列：**名次 / 届次 / 场次 / 歌手 / 歌名 / 总分 / 12分**（歌手在歌名前）。
- **可点表头排序**：名次 / 届次 / 总分 / 12分（双三角 `▲▼` 指示，当前方向高亮）；默认按**届次升序**。混淆曲在名次排序时恒置末尾。
- **同届内场次顺序**：`BV_SERIES_ORDER = {A:1,B:2,C:3,SF:4,GF:5,E:6}`（始终此序，不受升降影响）。
- **场次列**：无组别（数字 series）显示 `-`，有组别显字母；色 `--clr-text-3`。**12分列**色 `--clr-text-3`。
- **名次前三**：行加 `mp-bv-row--1/2/3` → 名次金/银/铜。
- **所有数字用 DM Sans**（名次 `.rk` 15px/600，其余 `.num2`）。
- **列宽（桌面）**：名次/届次/场次/总分/12分 `width:1px`（收缩到内容）；**歌手列固定 `width:400px`**；**歌名列吸收剩余**。`.artist` 必须 `white-space:nowrap`（否则收缩列会竖排）。
- **列宽（手机 ≤600px）**：`table` 改 `min-width:588px`（覆盖全局 `width:100%`/`min-width:460`，须用 `table.mp-bv-tbl` 提特异度），**歌手/歌名各 `width:150px`**、歌手 `white-space:normal`；表格整体横向滚动。
- 微调：名次左移（首列 `padding-left:4px`）、场次 `padding-left:11px`、歌手 `padding-left:14px`、歌名 `padding-left:8px`；表头数字列居中靠 `.ta-c` + `::before` 占位平衡三角。

### 4. 场次代码图例 `.mp-bv-legend`
表格之后、走势之前，紧贴表格（`margin-top:14px`）。文案：`注：A 小众 · B 中众 · C 大众 · SF 半决赛 · GF 决赛 · E 娱乐版` + `.mp-bv-legend__ex`「（如 7A = 第 7 届小众组）」**（手机隐藏）**；**无句号**。`barvision/hof.html` 的 `.bv-legend` 用同样改法（「场次代码」→「注」、括号补充包 `.bv-legend__ex` 手机隐藏、`· ` 替代原句号分隔「划线条目」说明）——两处文案保持一致。

### 5. 历届排名走势图 `bvTrend()` + `drawBvTrend()`（响应式 SVG）
- **响应式核心**：`bvTrend()` 只输出空 `<svg>`；`drawBvTrend()` 在渲染后读 `svg.clientWidth` 作为 viewBox 宽度（**viewBox = 实际像素宽，1:1**），高固定 180；监听 `window resize` 重绘。这样字号恒 13px、X 轴点间距按屏宽自适应、桌面手机都完整展示**不横滚**。
- **每场一个点**（`rank != null`）；**X 标签** `bvXLabel`：无组别=纯届号（`1`），有组别=届+组（`7A`、`2GF`）。
- **Y 轴倒置**（第 1 名在顶），范围 1 → `maxRank + 1`。
- **点配色优先级**：混淆曲（空心弱化）> 第一名 `is-champ` 金 > 第 16 届 `is-latest` `--clr-red-light` > 默认 `--clr-accent-light`。
- 点上方显示 `#名次`；hover 透明大热区（r12）+ `data-tooltip="歌手 — 歌名"`（站内 `initDataTooltips`，移动端禁用 hover）。
- 涉及混淆曲的连线用弱化虚线（`.is-dim`）。单点居中。

---

## 六、其它注意

- **改 `.js`（member-render.js）后预览有缓存**：导航 URL 加 `?fresh=时间戳` 让浏览器重取。
- 成员页有 **Dev Gate**：预览前 `sessionStorage.setItem('barboard_dev','1')`。
- 成员页**截图工具常超时**（动画/SVG），验证改用 DOM 测量。
- 手机端：表格 `overflow-x:auto` 横滚、概览卡自适应列、hero 卡片 `@media(max-width:600px)` 单列、走势图响应式不横滚——均已处理，导入数据不需额外动手机适配。
- 当前仅第一届数据，多数大妈单场 → 走势单点、徽章单个、排序无差异；录入多届后自然成线/多徽章/可排序。
