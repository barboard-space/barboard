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

**已导入届次**：第一届 `regular-01`（单场综合赛）、第二届 `regular-02`（SF 半决赛 + GF 决赛两场）。

**⚠️ 各届 Excel 结构不同，可能需要各自的解析脚本**：
- `scripts/parse_bv_edition.py` = 第一届（「参赛信息」+「投票」两 sheet 分离）。
- `scripts/parse_bv_edition2.py` = 第二届（`2SF`/`2GF` 两 sheet，每 sheet 自带「报名者/歌手/歌名/分数 + 逐票矩阵 + 支持率/高位率」一体）。**多场**写成 `matches:[{venue:'半决赛',…},{venue:'决赛',…}]`（`bv-results-render.js` 已支持 `matches.length>1`）。
- **GF 决赛总分含半决赛加成**（逐人公式不同），直接取 Excel「分数」列、按它排名；`jury_vote/tele_vote` 仅为逐票和供展示，**不要求 jury+tele==score**（半决赛则要求并已校验）。
- 选送者互投=评委会票(jury)，非选送投票人=评审团票(tele/观众)。Excel 里若另有「观众总分」等汇总列，用我们自己的逐票加总即可。

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
- **`BV_YEAR_COLOR`**（IIFE 顶部）：徽章 logo 描边色，按 `year` 映射。**2019=`--clr-board`；2020/2023/2024/2025/2026 当前为占位色，待用户最终确认**。导入到新年份（如 2027）须补一条。缺失年份回退 `--clr-board`。**注**：第一届（`ed.no===1`）在 `bvBadges()` 内被硬覆盖为金色 `--clr-gold` + 光晕（创始届特殊态），不走 `BV_YEAR_COLOR`。

### `scripts/gen_member_pages.py`

- **`BV_ACTIVE_SINCE_YEAR`**（当前 `2024`）：最近参赛年份 ≥ 此 → `active=true`（member.html 实心徽章），否则空心。规则待用户最终确认。

---

## 五、组件样式 / 逻辑速查（均在 `member-render.js`）

### 1. 大名届数徽章 `bvBadges()`
- 大名右上角，**每参加一届一个徽章**并排（数字=届号）；空心五边形 logo（inline SVG，path 同 `logo_hollow.svg`），`fill` 用 `BV_YEAR_COLOR[year]`（`currentColor`）。
- 数字色：**全届统一 `--clr-text`**；两位数届号自动缩小字号（fs 360→300）并下移 baseline 居中。
- **创始届（第一届）特殊态**（class `mp-bv-badge--first`）：五边形 logo 染金 `--clr-gold`（覆盖 `BV_YEAR_COLOR[2019]`）+ 金色双层 `drop-shadow` 光晕 + `mpBvFirstGlow` 3.2s 缓慢呼吸动画（`prefers-reduced-motion` 关闭），title 追加「· 创始届」。仅 `ed.no === 1` 命中。
- **尺寸**：桌面 30×29px；**手机端缩小 15%**（≈21.25×20.4）、`margin-left` 离大名 **7px**（桌面 9px）。
- 仅 `MEMBER_DATA.barvision` 存在且有 `edition_no` 时渲染。

### 2. 概览卡 `stats`（`.mp-bv-stat`，flex 居中）
7 项：最佳名次 / 冠军场数 / 前三场数 / 参与场数 / 12 分次数 / 首次参赛 / 最近参赛。配色规则：
- **最佳名次**：前三 → 金 `--clr-gold-light` / 银 `--clr-silver` / 铜 `--clr-bronze`；该名次出现 >1 次，数字后加 `(次数)`（`.mp-bv-rep`，小一号、`opacity .85`、跟随数字色）。
- **括号与大数字间距**：`.mp-bv-rep`（次数）和 `.sh`（混淆曲次数）均 `margin-left:3px`。⚠️ `.mp-bv-stat__v` 是 `display:flex`，会折叠纯空白文本节点，**字面空格无效，必须用 margin**。
- **冠军场数**：>0 金色，==0 弱化 `--clr-text-3`。
- **计数值为 0** 的项一律 `--clr-text-3` 弱化。
- **最近参赛**：== `LATEST_ED` 正常白，否则 `--clr-text-3` 弱化。
- 「第 N 届」格式：**数字前后留空格**；含中文的值自动用 DM Sans（`.mp-bv-stat__v--cjk`，20px/600），纯数字用 Bebas 26px。
- **值区等高对齐**：`.mp-bv-stat__v` 固定 `min-height`（桌面 26 / 手机 21）+ flex 居中——数字(Bebas 行高=字号)与「第 N 届」(DM Sans 行高更矮)值区等高、**标签水平对齐**（否则矮值卡标签偏上）。卡内 `padding` 上多下少（桌面 `15px 10px 11px`、手机 `12px 6px 8px`），内容视觉**下移 2px** 居中。
- **手机端（≤600px）**：整体缩小一档（数字 26→21px、「第 N 届」20→16px、标签 11→10px、`grid` `minmax(72px)`、`gap` 8px）；卡内 `padding:12px 6px 8px`（上 12 / 下 8）使内容视觉略偏下、居中更舒服。

### 3. 可排序参赛表 `.mp-bv-tbl`（`renderBvRows` + `sortBvEntries`）
- 列：**名次 / 届次 / 场次 / 歌手 / 歌名 / 总分 / 12分**（歌手在歌名前）。
- **可点表头排序**：名次 / 届次 / 总分 / 12分（双三角 `▲▼` 指示，当前方向高亮）；默认按**届次升序**。混淆曲在名次排序时恒置末尾。
- **表头对齐**：歌手/歌名**左对齐**；名次/届次/场次/总分/12分**居中**（`ta-c`）。带排序三角的列（名次/届次/总分/12分）用左侧透明占位 `::before` 平衡右侧三角，使**表头文字本身**精确居中、与数据列中心对齐（数据列同样：歌手歌名左、其余 center）。
- **同届内场次顺序**：`BV_SERIES_ORDER = {A:1,B:2,C:3,SF:4,GF:5,E:6}`（始终此序，不受升降影响）。
- **场次列**：无组别（数字 series）显示 `-`，有组别显字母；色 `--clr-text-3`。**12分列**色 `--clr-text-3`。
- **名次前三**：行加 `mp-bv-row--1/2/3` → 名次金/银/铜。
- **所有数字用 DM Sans**（名次 `.rk` 15px/600，其余 `.num2`）。
- **列宽（桌面）**：名次/届次/场次/总分/12分 `width:1px`（收缩到内容）；**歌手列固定 `width:400px`**；**歌名列吸收剩余**。`.artist` 必须 `white-space:nowrap`（否则收缩列会竖排）。
- **列宽（手机 ≤600px）**：`table` 改 `min-width:588px`（覆盖全局 `width:100%`/`min-width:460`，须用 `table.mp-bv-tbl` 提特异度），**歌手/歌名各 `width:150px`**、歌手 `white-space:normal`；表格整体横向滚动。
- 微调：名次左移（首列 `padding-left:4px`）、场次 `padding-left:11px`、歌手 `padding-left:14px`、歌名 `padding-left:8px`；表头数字列居中靠 `.ta-c` + `::before` 占位平衡三角。

### 4. 场次代码图例 `.mp-bv-legend`
表格之后、走势之前，紧贴表格（`margin-top:14px`）。文案：`注：A 小众 · B 中众 · C 大众 · SF 半决赛 · GF 决赛 · E 娱乐版` + `.mp-bv-legend__ex`「（如 7A = 第 7 届小众组）」**（手机隐藏）**；**无句号**。`barvision/hof.html` 的 `.bv-legend` 用同样改法（「场次代码」→「注」、括号补充包 `.bv-legend__ex` 手机隐藏、`· ` 替代原句号分隔「划线条目」说明）——两处文案保持一致。

### 5. 历届排名走势图 `bvTrend()` + `drawBvTrend()` + `initBvTip()`（全宽 SVG，重写版）

> 2026-06 重写：从「每场一点、按屏宽自适应」改为 **全局场次轴 + 占满全宽（场次多才横滚）+ 缺席留位**。

**(a) X 轴 = 全局场次序列 `BV_SLOTS`**（模块常量，**X 轴轴序**，`12B` 报名但比赛取消故排除）：
`1 2SF 2GF 3A 3B 4A 4B 5A 5B 5C 6A 6B 6C 7A 7B 7C 8A 8B 9A 9B 10A 10B 11A 11B 12A 13 14 15 16`。
每个 entry 的场次代码 = `bvXLabel(e)`（无组别=纯届号 `1`/`13`，有组别=届+组 `7A`/`2GF`）。按代码 `byCode` 分组（**同一场次代码可有多首**）。

**(b) 绘制区间 + 缺席**：在 `BV_SLOTS` 中定位该成员**首场→最近一场**的 index 区间，`slots = BV_SLOTS.slice(first, last+1)`（含中间未参赛场次）。
- 未参赛场次：X 标签弱化 `--clr-text-4`（`.is-absent`）+ 该 x 处一条竖直细虚线 `.mp-bv-trend__absent`（`stroke:var(--clr-border)` 与横向网格同色、`stroke-dasharray:6 5`）。
- **跨缺席不连线**（仅相邻两 slot **均参赛**才连）。

**(c) 几何 / 占满全宽 / 滚动**：`padL42 padR24 padT36 padB48 H320 minSlotW56`。`W = max(容器clientWidth, padL+padR+(n-1)*minSlotW)` → **少场次占满容器全宽**（点 `lo+(hi-lo)*i/(n-1)` 均匀分布、两端内缩 6%、单点居中），**每格挤到 < 56px（手机窄屏 / 未来 20+ 场）才扩宽** → 外层 `.mp-bv-trend__sc`（`overflow-x:auto`）横向滚动。`svg width/height/viewBox` 均设为像素值 1:1（字号恒定）。监听 `window resize` 重绘。Y 轴倒置（第 1 名在顶），范围 `1 → maxRank+1`，3 条参考线（1/中/max）。X/Y 轴标签（`.mp-bv-trend__xlab` / `.mp-bv-trend__ylab`）**12px mono**（桌面手机同值）。

**(d) 同一场次多首歌（一个 X 多个 Y）**：
- **正式曲**：实心 `r4`（`.mp-bv-trend__dot`）；同场多首正式时**较差者**（rank 大）加 `.is-dim`（`opacity .65`）。
- **混淆曲**：空心 `r3`（`.mp-bv-trend__shadow`）——**`fill:var(--clr-bg)`（不透明，遮住穿过的连线）+ `stroke:var(--clr-text-4)` `stroke-width:1.6`**。
- **正式+混淆同一首歌**（同 artist+song，如 5C 同曲既正式又混淆夺冠）：实心点 + 内嵌空心小圈 `.mp-bv-trend__inner`（`r2 fill:none stroke:var(--clr-bg)`），单点单 tooltip。

**(e) 点配色**（仅正式/实心点）：`rank===1` → 金 `.is-champ`；否则该成员**最近场次**（`code===BV_SLOTS[lastIdx]`）→ 粉 `.is-latest`（`--clr-pink-light`）；否则蓝 `--clr-accent-light`。混淆空心点恒 `--clr-text-4` 描边。

**(f) 连线**：仅连相邻**均参赛**的两 slot 的「代表点」（多 Y 时代表点 = 有正式则取最好正式，否则取混淆）。
- 两端代表点均实心 → **实线** `.mp-bv-trend__edge`：`stroke:var(--clr-accent-glow)`（= `rgba(0,180,255,0.30)`，**不再叠 opacity**）、`stroke-width:2`。
- 任一端为空心（纯混淆场次）→ **虚线** `.is-dashed`：`stroke:var(--clr-text-4)` `stroke-width:1.5` `stroke-dasharray:5 4` `opacity:.65`。

**(g) `#N` 名次标签**（点上方）：
- 正常（最好的正式点）：`.mp-bv-trend__rank` 12px `--clr-text-2`。
- **弱化**（混淆曲 / 较差的正式曲）：`.is-weak` **10.5px `--clr-text-4`**。
- **同场次相同名次只画一个 `#N`**（按 slot 内 rank 去重；该 rank 有任一非弱化点则用正常样式，否则弱化）。

**(h) 图例 `.mp-bv-trend__legend`**（标题行右侧，`.mp-bv-trend__hd` 两端对齐）：`● 正式单曲` / `○ 混淆单曲`，圆点用 **inline SVG circle**（非 CSS border——border 会被取整成 1px）以与图内点**逐项一致**：正式 `r4 fill accent-light`；混淆 `r3.2 stroke text-4 stroke-width1.6 fill bg`（外径 3.2+0.8=4，与正式 r4 **同大**）。文字包 `.mp-bv-lg__t`（`position:relative;top:1px` 下移 1px 与圆点视觉对齐）。

**(i) Tooltip `initBvTip()`**（自建 `.mp-bv-tip`，`position:fixed`，**元素+事件仅初始化一次**，SVG 重绘不重复绑定）：
- 内容 = `歌手 — 歌名`（**不再带「（混淆）」后缀**——正式/混淆由图例区分）。透明大热区 `.mp-bv-trend__hit`（`r13`）承载 `data-tip`。
- **桌面**（默认）：`mouseover` 显示 + `mousemove` 跟随光标，`place()` 定位在**光标右下**（右偏 +22、垂直居中后再下移 +12），右侧放不下则翻到左侧。
- **手机**（`(hover:none),(pointer:coarse)`）：**点击**数据点显示（锚定点中心右侧）、点击别处隐藏。
- ⚠️ 预览（resize 模拟手机）不上报 `pointer:coarse`，故预览里走桌面 hover；手机点击路径只能真机验证。

### 6. 总分显示
- **总分（score）一律四舍五入为整数显示**，数据 JSON 保留原值（决赛含加成的小数如 140.44 → 显示 140）。详情页 `bv-results-render.js` 的 `fmtScore()` + 成员页参赛表 `Math.round(e.total)`。

### 7. 混淆曲 `is_shadow` + 「未认领」伪成员（第三届起）
- **混淆曲**：`entries[].is_shadow=true`，非正式项目、不计入排名。成员页参赛表 `renderBvRows` 已弱化（`.mp-bv-row--shadow` 灰斜体 +「混淆」标）；概览 `aggregate_barvision` 把 shadow 与 official 分开统计（`shadow`/`top1_shadow`/`top3_shadow`，参与场数显示 `official(shadow)`），shadow **不计入** best/top1/top3/official/twelve（12 分次数也只 sum official）。成员页参赛表混淆行：名次 `N*`（**不加粗、比正常小 2px=13px**；值包 `.rk-sh` span 并 `translateX(2px)` 右移——只移值不移单元格背景，故 transform 加在 span 而非 td）、**不斜体、统一 `--clr-text-3`**（含届次链接，CSS 用 `.mp-bv-tbl .mp-bv-row--shadow td` 提权盖过 `.song/.artist`）；走势图含混淆点（is-shadow 样式），rank 用 parse 的并排名次（与表一致）。
- **「匿名」伪成员**（涵盖①正式单曲匿名②混淆单曲匿名，赛后无人认领）：昵称 `匿名`、id `0`。`gen_member_pages.py` 额外生成 `member/0.html`（`MEMBER_DATA={nickname:'匿名',unclaimed:true,…}`；⚠️ `aggregate_barvision` 旧 `nick=='匿名'` skip 已移除）；`member-render.js` `d.unclaimed` 分支——大名 `.mp-nickname--unclaimed`（font-body+text-3）、handle「参赛歌曲匿名选送者」、label「Barvision」、标题「匿名参赛歌曲」、说明「以下参赛歌曲在比赛结束后始终无人认领选送者，统一归档于此。」、无统计卡/走势图、仅混淆曲表。`gen_bv_editions_index.py` roster 跳过 is_shadow。**member.html 弱化卡（已建）**：`.ml-card--anon`，buildGrid 在 members 后追加，**仅 Barvision 筛选时显示、置尾、不计入计数**；大名「匿名」font-body 22px + `line-height:26px`（与正常卡 Bebas 26px 同高，副标题与「@handle」行对齐）。
- 详情页侧的混淆/未认领约定见 `DESIGN.md §6.7` 与 `CLAUDE.md #135`。
- **联合选送「A/B」（第四届起）**：`member` 为斜杠串（如 `麦妈/苏妈`）。`aggregate_barvision` 按 `/` 拆分，**该曲计入两人各自的吧视记录**；`gen_bv_editions_index` roster 同样拆分（两人各入名册）。结果表内两人上下排列（详情页 `.bvr-joint`）。见 CLAUDE.md #136。

---

## 六、其它注意

- **改 `.js`（member-render.js）后预览有缓存**：导航 URL 加 `?fresh=时间戳` 让浏览器重取。
- 成员页有 **Dev Gate**：预览前 `sessionStorage.setItem('barboard_dev','1')`。
- 成员页**截图工具常超时**（动画/SVG），验证改用 DOM 测量。
- 手机端：表格 `overflow-x:auto` 横滚、概览卡自适应列、hero 卡片 `@media(max-width:600px)` 单列、**走势图占满全宽、场次多到挤不下时横向滚动**（已验证 375px 下 7 场可左右滑动到底）——均已处理，导入数据不需额外动手机适配。
- 当前仅第一届数据，多数大妈单场 → 走势单点、徽章单个、排序无差异；录入多届后自然成线/多徽章/可排序。
