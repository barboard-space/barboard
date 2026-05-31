# Changelog — Barboard 官网

所有重要更新记录于此，按日期倒序排列。

---

## [2026-05-31 session 10] — barvision/2026/events.html 移动端优化 + section 顺序 + 排版规范

### Changed
- `barvision/2026/events.html` section 顺序调整：参赛要求提前至歌曲报名后；规则摘要与投票方式互换；TOC 和 hero CTA 按钮顺序同步
- `barvision/2026/events.html` 移动端全面优化：新增 `@media (max-width: 768px)` 块（section/hero padding 压缩、CTA 按钮 2×2、投票 % 字号缩小）；扩充 `@media (max-width: 480px)`（CTA 竖排全宽、deadline bar 竖排、提交面板 padding 收紧、倒计时 full-width）；平台表格 `overflow-x: auto`
- `barvision/2026/events.html` 条目样式重构：`ev-req-item` / `ev-crit-item` 由 `display: flex` 改为 `display: block`，bullet `·` 改为 inline `::before`，消除 bold 关键词与描述文字的视觉割裂
- `barvision/2026/events.html` 间距调整：`ev-req-list` / `ev-crit-list` gap 3→4px；`ev-req-block` margin-top 28→24px；条目 padding 10→6px；`line-height` 1.6→1.5
- `barvision/2026/events.html` 标题与文字：section title `clamp(32px,5vw,64px)` → `clamp(24px,3.5vw,48px)`；subtitle 统一 14px；submit 标题 "SUBMIT YOUR SONG" 改为一行，YOUR/SONG 紫色
- `barvision.html`：meta 文案更新（"第十六届即将开赛" → "欧美流行音乐个人榜吧歌曲大赛"；"已举办十五届" → "第十六届正在进行中"；"历经数年停办后" → "历经两年停办后"）；"进行中"呼吸灯改为 `ripple-out` 样式（与首页 edition-card--active 一致），上移 1px

### Fixed
- 移除两处 `white-space:nowrap` 防内容在移动端溢出屏幕
- `<strong>` 行内加粗文本前后补全空格（文字字符相邻处），消除中英文混排粘连

### Docs
- CLAUDE.md 注意事项 #121：行内 `<strong>` 前后空格规范（文字字符相邻加空格，标点/句首句末不加）

---

## [2026-05-31 session 9] — 数据架构规范化 + CSV→JSON 同步脚本 + BBL 日期修复

### Added
- **`scripts/sync_hof_data.py`**：BBL HOF CSV→JSON 同步脚本（bbl_02–11 共 11 个字段，dry-run/--write 模式，保留人工字段 champions/owner_map/note/show）
- **`scripts/sync_bv_hof_data.py`**：Barvision HOF CSV→JSON 同步脚本（records.val 更新 + awards 标题一致性检查）
- **`data/barvision/bv_hof_data.json`**：新建 Barvision HOF 展示数据（pioneer/records/awards 三节）
- **CLAUDE.md**：新增「数据架构原则」章节（动态加载、CSV→JSON 流程、sync 脚本规范、CSV 编码要求）

### Changed
- **`barvision/hof.html`**：移除硬编码 RECORDS/AWARDS/pioneer 数据，改为 async fetch `bv_hof_data.json`，fadeObserver 移入 async 回调
- **`data/bbl/bbl-record/hof_data.json`**：`most_points` 从 20 条扩展到 62 条（全部 2000+ pt 记录）；`charted_records` top5 补入 Sabrina Carpenter — Taste；artists_weeks 同步最新数据
- **`data/main-page/updates.json`**：修正 Vol.125 条目日期（2026-05-22→2026-05-30）及统计周期描述（5.22-5.28→5.15-5.21）

### Fixed
- **`scripts/fetch_bbl.py`** `fmt_week_range_cn`：修正日期计算方向（API date 为下一周期起始周五，统计周期为 date-7 到 date-1）；`update_updates` 改用实际更新日期而非 API chart date
- **`bbl.html` / `index.html`** `fmtWeekRange`：同步修正（旧逻辑产生 May 16-22，现正确输出 May 15-21）
- **CSV 数据质量**：bbl_04 日期 2024-04-11→2024-04-05（Vol.14）；bbl_05/06 ROSÉ 字符修复；bbl_06 n=17 空白字段补全、n=3 QWER 韩文编码修复；barvision_04 最长连续前十 metric 补单位（8→8场）

---

## [2026-05-31 session 8] — BBL Vol.125 数据更新 + workflow 全面修复 + hof.html 动态加载重构

### Added
- **`data/bbl/bbl-record/hof_data.json`**：新增 BBL HOF 全量数据文件（13个板块，原硬编码于 hof.html 的所有 JS 常量数组）；今后更新 HOF 数据只需编辑此 JSON 文件

### Changed
- **`data/bbl/bbl-latest.json`**：更新至 Vol.125（2026-05-22，冠军：Dara — Bangaranga，100首完整数据）
- **`data/main-page/ticker.json`**：BBL 字幕条更新为第 125 期
- **`data/main-page/updates.json`**：BBL 动态条目更新为第 125 期（2026-05-22，统计周期 5/22–5/28）
- **`data/bbl/bbl-vol-index.json`**：新增 `"125": "2026-05-22"`
- **`bbl/hof.html`**：全面重构为动态加载——13个硬编码 JS 常量全部移除，改为空 `let` 声明；底部新增 async IIFE `Promise.all` fetch `bbl-vol-index.json` + `hof_data.json`，填充变量后渲染；`fadeObserver` 移入 async 回调内（确保在 build 函数后执行）；数据截至 Vol.125（VOL_DATES/CHAMPIONS/NO1_RECORDS 三处已更新）
- **`scripts/fetch_bbl.py`**：`import requests` → `from curl_cffi import requests`，`get()` 加 `impersonate="chrome136"` 伪装 Chrome TLS 指纹，绕过 musictrack.cn Cloudflare Bot Management
- **`.github/workflows/update-bbl.yml`**：三项修复——① 顶层加 `permissions: contents: write`（修复 push 403）；② `git add` 补充 `ticker.json` / `updates.json`（修复漏提交）；③ pip install `curl-cffi` 替代 `requests`

### Fixed
- GitHub Actions workflow 显示绿色但数据不更新的问题（根因：Cloudflare TLS 指纹检测 + Actions 缺少 push 权限，均已修复，已验证 `github-actions[bot]` 成功提交）

---

## [2026-05-30 session 7] — events.html Rulebook 更新 + BBL workflow 调整

### Changed
- **`barvision/2026/events.html`** — 按 Rulebook Ver. 260530 全面更新：
  - SCHEDULE：STAGE 2 新增附加赛资格赛 07-25 展播/投票开启、08-07 截止两行；08-08 直播行改为"Semi-Final 暨附加赛直播"；STAGE 3 删除 08-16 补充说明、"决赛票数统计截止"→"结束"
  - 全页"复活赛"/"Second Chance Round" 统一替换为"附加赛"（4 处）
  - Submit：提交方式改为在线表单（移除"私信主办方"），新增"在线表单"主条目；补充 3.1.5 重复提交、3.1.6 一经提交不得更换；海选子条目补 3.5.3（须公布前两名）、3.5.4（胜者不得更换）
  - ELIGIBILITY 歌曲要求：新增"未被选送至 Eurovision Song Contest 参赛"；BBL 峰值规则改为个人榜助攻数 ≤ 5 榜、最高排名 ≤ 50 名（单榜助攻除外）；末条加"须自行举证"
  - VOTING：Tele Vote 补"不得将票数投给自己所选送的参赛歌曲"；Approval Vote 卡拆分为附加赛资格赛（07-25 至 08-07，仅海选第二名）+ 附加赛正赛（直播现场，SF 未晋级 + 资格赛胜者）两段
  - RULEBOOK：卡片 #03 "复活赛晋级"→"附加赛晋级"；底部新增免责声明（左对齐，星号前缀）
  - 细节："单曲排名峰值"→"单曲最高排名"（2 处）；助攻规则行加 `white-space:nowrap`；locked 面板日期格式"北京时间 2026 年 6 月 1 日 18:00"
- **`.github/workflows/update-bbl.yml`**：主抓 cron `0 16 * * 6` → `0 19 * * 6`（北京时间周日 00:00 → 03:00）

## [2026-05-30 session 6] — barvision/2026/events.html 全面重做 + 全站眉链箭头

### Added
- **`barvision/2026/events.html`**（完整重做）：对标 barvision.html 视觉语言；hero 含 CSS 动画（`ev-hero-in`，7元素依序延迟）+ 紫色 watermark + 倒计时 + "本页上次更新于 2026-05-30"；歌曲报名 locked/open 面板（sticky 右列，deadline bar grid 1fr 1px 1fr）+ 提交方式 + 核心须知；SCHEDULE 三阶段（STAGE 1/2/3，色标标签 + 弹性横线 + 表格式时间线，badges：开启/投票/直播/Deadline）；VOTING（Jury 评分格含金色 #1/#2、Tele 修正上限 5→10、Approval 全宽卡）；ELIGIBILITY（平台数据表 + 歌曲/专辑同列左、艺人右）；RULEBOOK 6 卡；TOC（5项，紫色呼吸点，IO suppression，`scrollY > 400`）
- **全站 eyebrow 箭头回退**：`barvision.html`、`bbl.html`、`archive.html`（← Barboard → `/`）；`barvision/hof.html`（← Barvision）；`bbl/hof.html`（← BarboardLab）均改为 `<a>` 元素，含 `←` 箭头 + hover 白色

### Fixed
- **`style.css`**：`edition-card--active::after` 呼吸点从右上角（`right:12px`）移至左上角（`left:12px`）
- **`barvision/2026/events.html`**：Tele Vote 单曲最多投票数 5→10（Rulebook 4.1.2 修正）；所有中文标签（北京时间等）补 `font-family:var(--font-body)` 防 DM Mono 无法渲染

---

## [2026-05-30 session 5] — barvision.html 卡片动画 + archive.html/nav 细节

### Changed
- **`barvision.html`**：Chongqing 2026 卡加 fancy hover 动画（shimmer 光扫 + 边框/辉光增强 + logo scale/glow）；初始辉光减淡、描边改偏蓝 `rgba(100,140,230,0.55)`；shimmer transition 移至 `:hover::after`（离开时无回退动画）；2019–2020 及娱乐版卡片 `cursor:default` + hover 无变色；届次信息行间距优化（`season-card__name` margin-top 16px，主办行 margin-top 14px）
- **`scripts/nav.js`**：`DEV_GATE = false`（关闭密码保护）；nav CTA 副标题「歌曲报名通道」→「歌曲报名」

---

## [2026-05-30 session 4] — archive.html 新建 + barvision/hof.html 细节打磨

### Added
- **`archive.html`**（新页面）：全站活动存档总览；hero 榜吧蓝主题（`#6F9EC3`）+ `BARBOARD` 水印 + 三层辉光（主光榜吧蓝、左下粉、右紫）；两节——「常规活动」（BBL/Barvision 2列卡）+「过往活动 Legacy Activities」（年榜/吧莱美 Barammy/ESC Voting Party 3列卡）；卡片动画 `cubic-bezier(0.22,1,0.36,1)` 0.55s stagger `i×0.07s`；Legacy 卡 `opacity:0.82` 降调；ACTIVE badge 榜吧蓝、Legacy badge 灰色；Musictrack 外链按钮带 `ext-icon` 箭头；所有链接已验证

### Changed
- **`barvision/hof.html`**：hero 加 `BARVISION` 背景水印（`rgba(212,168,50,0.035)`，右下角 200px）；先驱奖描述文字中「绿荫夏语」改为 `@绿荫夏语` 成员链接；desc 与 name 间距 `margin-top` 8→16px

---

## [2026-05-30 session 3] — barvision/hof.html 深度打磨 + barvision.html 动画优化

### Changed
- **`barvision/hof.html`**：全面对标 bbl/hof.html——hero padding/margin/eyebrow/title/desc 间距与字号对齐；hero 金色主题（glow/eyebrow/title accent/desc 改为 gold）；移除 breadcrumb，eyebrow 改为跳回 `/barvision.html` 链接；入场动画补全（eyebrow 0s → title 0.1s → desc 0.2s）；section header 间距规则补全；content margin-top 改为 `var(--gap-md)`；「先驱奖」→「吧视先锋奖」；去除奖杯 emoji 和 Pioneer label；desc 文字增加「*本页正在更新中」；MEMBER_MAP + fmtMember/fmtWho 将所有成员名渲染为 `@handle` 链接（先驱白色，其余紫色）；Special Awards title 改为紫色；`bv-award` transition 修复（补 opacity/transform 防被覆盖）；stagger 优化为 `i × 0.07s`；页内 TOC（紫色呼吸点，阈值 > 400，IO suppression）
- **`bbl/hof.html`**：hero desc 颜色改为金色 `rgba(245,200,64,0.85)`；TOC 阈值 `> 200` → `> 400`
- **`barvision.html`**：移除 hero 背景 BV 水印；近届存档（2023–2025）年份改为「Barvision 202X」格式（bold white font-body）；早期存档 grid 改为 `repeat(7, 1fr)`、gap 统一 12px；娱乐版 grid 同步 `repeat(7, 1fr)`；娱乐版罗马数字改为紫色；第二部分动画全面优化（XVI 卡拆分 left/right 独立 fade-up，近届 0.10s stagger，早期 0.06s stagger，娱乐版 0.14s base + 0.08s stagger，`clearDelayAfterAnim` 替换 `transitionend`）
- **`scripts/nav.js`**：footer Barvision 2025 链接由 disabled tooltip → `display:none` 隐藏（href 改为 `/barvision/2025/events.html`）；Hall of Fame 链接 `/barvision.html` → `/barvision/hof.html`
- **`index.html`**：歌曲报名按钮 disable（`href="#"`, `onclick="return false"`, `data-tooltip="暂不可用"`, opacity 0.38）；开放时间 12:00 → 18:00（文案 + 倒计时目标 `T18:00:00+08:00`）
- **`barvision/2026/events.html`**：开放时间 `00:00` → `北京时间 18:00`（文案 + `OPEN_DATE`）

---

## [2026-05-30 session 2] — barvision.html 全面重设计 + barvision/hof.html 新建

### Added
- **`barvision/hof.html`**（新页面）：从 `barvision.html` 迁出 Hall of Fame 板块，独立成页；含 hero（breadcrumb + 标题 + 描述）+ 先驱奖 + 数据纪录（6卡三列）+ 特别奖项（6卡三列）；接入 `../scripts/nav.js`
- **`assets/images/barvision_logo_2023/2024/2025.svg`**：确认已入库，用于历届存档卡首排

### Changed
- **`barvision.html` hero 右列**：近三届冠单卡 → `barvision_logo_2026.svg`（465px，深紫辉光，`align-items:stretch` 垂直居中）
- **`barvision.html` XVI 当届卡**：重设计为 `1fr auto` 网格；左列用 `season-card__edition/name` 文字样式；右列放 logo；背景换深紫渐变+方格纹；紫色多层发光边框；padding 48px；去掉按钮；整卡可点击跳转 events.html
- **`barvision.html` 历届大赛**：2023–2025 独立首排含各年 logo（opacity 0.85，深紫背景，edition-card 样式信息）；2020 及之前 + Unplugged 全部改为 `edition-card` 类，不显示冠单结果；删除 `buildMatchHtml/buildArchCard` 等已废弃函数
- **`barvision.html` HOF**：板块完全移除，按钮 href 改为 `/barvision/hof.html`
- **`barvision/2026/events.html` hero**：eyebrow+h1+edition+tagline 替换为 `barvision_logo_2026.svg`（460px）
- **主题语**：全站「声汇两江」→「重声交响 Echoing Confluence」（无分隔符）
- **`barvision.html` eyebrow**：改为「欧美流行歌曲个人榜吧歌曲大赛」
- **`barvision.html` hero meta**：改为「第十六届即将开赛 / 始于 2019 年 / 已举办十五届」
- **`barvision.html` hero desc**：萌妈改为 `@绿荫夏语` member link（space_id:125）
- **`barvision.html` hero 按钮**：「Barvision 2026 大赛」→「Barvision Chongqing 2026」；「荣誉殿堂」→「Barvision Hall of Fame」
- **`index.html` XVI edition-card**：绑定点击跳转 `/barvision/2026/events.html`

### Content
- Barvision 中文简称确认为「吧视」
- `barvision.html` Unplugged 标题简化为「Barvision 娱乐版」

---

## [2026-05-30] — barvision.html 新建 + 零散文案/功能修订

### Added
- **`barvision.html`**（新页面）：Barvision 总览 + Hall of Fame。三大板块：Hero（全白大标题 + 右列近三届冠单卡）、历届大赛（XVI 当届大卡 + I–XV 四列存档格 + Unplugged 四列）、荣誉殿堂（先驱奖 + 数据纪录 + 特别奖项）；所有数据硬编码 JS 常量数组
- **`nav.js` `initDataTooltips()`**：通用 `[data-tooltip]` JS tooltip，复用 `.member-tooltip` 样式，与 member tooltip 并列独立运行
- **footer `.footer__link--disabled`**（style.css）：禁用链接样式，`opacity:0.38 + cursor:not-allowed`；当前用于 Barvision 2025 链接，配合 `data-tooltip="暂不可用"` 显示 tooltip

### Content
- `index.html` Barvision 赛事卡：「距离提交通道开启还有」→「距离**歌曲**提交通道开启还有」
- `index.html` 赛事卡描述文案：`2026 年 6 月 1 日 00:00` → `北京时间 2026 年 6 月 1 日 12:00`（「北京时间」同步变蓝）
- `index.html` 倒计时目标时间：`T00:00:00+08:00` → `T12:00:00+08:00`

---

## [2026-05-30] — bbl/hof.html 专辑 + 艺人两大板块重做

### Changed
- **单周专辑进榜纪录**（原「上榜专辑」，调至「艺人进榜纪录」之前）：数据换用 `bbl_08_albums_most_charted.csv`（35条，7首+），布局由双列 `hof-table-card` 全面改为 `hof-group` 瀑布流（`hof-roll` 三列），按进榜数分组，前三组金银铜配色，进榜率以 `hof-group-song__rate` 类显示于行末
- **艺人进榜纪录**（原「艺人版图」）：由双列扩展为三列 `hof-three-col`；数据全部换用最新 CSV（`bbl_09/10/11`）；新增「单周进榜单曲数」列（23条峰值记录，含日期），「累计进榜单曲数」「累计在榜周数」数据同步更新；三列金银铜通过 `nth-child(2/3/4)` 统一实现；动画错排 `0s / 0.12s / 0.24s`
- 板块顺序调整：专辑板块移至艺人板块之前，TOC 同步更新

### Style
- `hof-group-song__rate` 新 CSS 类：进榜率专用，金/银/铜行 rgba 0.65 降饱和配色
- `hof-table-card` 金银铜行：新增 `nth-child(2/3/4)` 背景 + 分隔线 + 文字三段式配色，覆盖旧的 `:first-child` 规则

---

## [2026-05-30] — bbl/hof.html 新增三个板块 + 个人榜冠军纪录动画精修

### Added
- **点数纪录板块**（单周最高点数纪录，前20）：来自 `bbl_03_most_points.csv`，hof-uncrowned 双列样式，badge `#rank` 金色，插入在「在榜周数纪录」和「无冕高分」之间
- **助攻纪录板块**（单周助攻数纪录）：来自 `bbl_05_most_charts.csv`（25条），`.hof-group` 分组（金银铜 n=19/18/17）+ `.hof-no1-entry` 条目；同组同曲去重合并，多条出现记录以 `.hof-charts-occs`（flex nowrap，固定宽 170px）横排，名次内联色彩紧随日期；新 CSS 类 `.hof-charts-occs` / `.hof-charts-occ` / `.hof-charts-rank`；插入在「无冕高分」和「个人榜冠军纪录」之间
- **最强N榜板块**（单周N榜助攻纪录）：来自 `bbl_06_single_chart.csv`（19条，N=1–19），hof-uncrowned 双列，badge「N榜」前置无序号，`#hofSingleChart` grid 覆盖，无金银铜；插入在「助攻纪录」和「个人榜冠军纪录」之间

### Changed
- **单周冠军纪录** → **个人榜冠军纪录**（section-label + TOC 统一更名）
- **个人榜冠军纪录板块动画**：去掉 entry 级 `fade-up`，只保留三个 group 卡整体依次入场
- **点数纪录 / 无冕高分 双列动画**：wrapper 去掉 `fade-up`，改为左列0s / 右列0.07s 卡片级入场，与「在榜周数纪录」卡片动画一致

---

## [2026-05-30] — bbl/hof.html 全面重设计：板块重命名/重排/视觉精修 + 无冕高分新布局

### Changed
- **板块重命名**：冠军名录→冠单名录；驻榜韧性→在榜周数纪录；未冠之最→无冕高分（section-label）/ 未夺冠单曲单周点数纪录（h2 title）
- **板块顺序调整**：无冕高分移至单周个人榜冠军数之前（新顺序：冠单名录→在榜周数纪录→无冕高分→单周个人榜冠军数→艺人版图→上榜专辑）
- **在榜周数纪录 布局重构**：左列（`1.65fr`）全12条总在榜周数排行，引入金银铜配色（背景/排名/点数/歌名）+ 并列名次计算；右列（`2fr`）改为 2×2 网格展示 Top3/5/10/50（移除 Top20 展示但保留数据 `show:false`）；左卡片紫色边框 + 渐变底色 + 外发光；行背景全宽延伸；歌名末尾星号标注 + hover tooltip（「其中Rex Orange County合作版为13周」）
- **无冕高分 全面重设计**：双列布局（左8右7条）；5字段展示（排名/点数/歌名+歌手/日期+期数/位次）；前三名金银铜配色；位次标签 `#2` 银色 `#3` 铜色；点数整数/小数分体显示；日期两行（ASCII mono + 中文 font-body）；数据从10条扩展至15条并补全 vol 字段
- **单周个人榜冠军数**：FEVER DREAM 四条记录中 @LemonSheeran @Lee翼雨 调至首位；成员 ID 间距加 `word-spacing:1px`

### Style
- 右侧小卡片第一名：歌名改为紫色（`--clr-violet-light`），不再用金色，降低与左主卡视觉竞争
- 在榜周数纪录排名数字统一改为 Bebas Neue 18px（含4名以后，用 `--clr-text-2`）

### Content
- bbl-record 目录重新编号（bbl_01–11），6个在榜周数文件合并为 `bbl_02_weeks_records.csv`（含 Category 列）

---

## [2026-05-30] — bbl/hof.html 新板块 + 页内 TOC + 全局动画精修

### Added
- **bbl/hof.html 单周个人榜冠军数板块**：新增第2板块（冠军名录之后，驻榜韧性之前），基于 `data/bbl/bbl-record/bbl_02_most_weekly_no1.csv`；按同周冠君人数（5/4/3）分三个卡片组，双列 `columns:2` 瀑布流布局；同一首歌的多次记录自动聚合，多次出现显示合并头行 + 缩进子行（日期 · 第N期 | @成员列表）；`OWNER_MAP` 常量映射28位成员简称→`{id, handle, nickname}`，owners 渲染为 `<a class="member">` 链接享受 tooltip；5人组金色，4/3人组 `--clr-text-2`
- **bbl/hof.html 页内 TOC**：右下角固定导航，文字右对齐，active 状态紫色呼吸圆点（`animation: toc-breathe 3s ease-in-out infinite`）；点击立即高亮目标并抑制 IntersectionObserver 更新（防止滚动途经中间 section 时高亮跳动），滚动停止 200ms 后自动恢复；移动端隐藏

### Changed
- **bbl/hof.html 全板块 section title 字号统一**：所有 `h2.section__title` 加 `font-size:clamp(18px, 2.4vw, 28px)`，hof 页内视觉一致
- **bbl/hof.html hof-section-desc 字号统一**：CSS 类默认改为 13px，移除各处冗余 inline override
- **bbl/hof.html 驻榜韧性动画**：6张记录卡片改为逐一错排 `fade-up`（每卡 0.07s 间隔），不再整体同时出现
- **bbl/hof.html 单周个人榜冠军数动画**：组级 0.12s 间隔 + 组内每条 entry 0.06s 间隔错排 `fade-up`，参考 member.html 卡片动画风格
- **bbl/hof.html 冠军名录**：`columns:3` → 保持三列；`hof-group__count`（X首）随金/银/铜 tier 变色，与组内数字色一致；描述文字补充「首次夺冠日期 / 期数已标注。」
- **bbl/hof.html `hof-group-song__vol`**：`font-family` 从 `--font-mono` 改为 `--font-body`，修复 DM Mono 无法渲染「第」「期」中文字符的问题

### Style
- **bbl/hof.html section 顺序调整**：冠军名录 → 单周个人榜冠军数 → 驻榜韧性 → 艺人版图 → 上榜专辑 → 未冠之最

---

## [2026-05-29] — bbl.html hero 动画 + bbl/hof.html 冠军名录重设计

### Changed
- **bbl.html hero 入场动画**：左列所有元素（eyebrow → 标题 → meta → 描述 → 按钮）新增 CSS `@keyframes bbl-hero-in` 错排入场，easing 换为 `cubic-bezier(0.22,1,0.36,1)`；右侧视频卡从 `fade-up-right`（IntersectionObserver 0.2s）改为 CSS animation（0.7s，0.2s delay）；背景水印缓慢淡入（1.4s ease）
- **bbl/hof.html stats 文案**：「期数」→「期单曲合榜」；「冠军单曲」→「首冠军单曲」；「最长冠军连续周」→「最长冠军周数」；「29 最高参榜人数」→「57 最长在榜周数」（取自 Billie Eilish — BIRDS OF A FEATHER 总在榜纪录）
- **bbl/hof.html 冠军名录完整重设计**：排名平铺列表 → 按冠军周数分组卡片；组内按首次登顶日期升序；CSS `columns: 3` 三列瀑布流（浏览器自动平衡列高）；前三组（15/11/10周）金/银/铜全色系覆盖（head 背景、数字、label、歌名、艺人、日期、期数）；各组 `fade-up` 按 index×0.06s 错排入场；「Vol. N」→「第 N 期」

### Style
- **bbl/hof.html eyebrow 辉光**：单层 0.35 → 双层叠加（内层 `0 0 10px` 强度 0.7 + 外层 `0 0 32px` 扩散 0.28）

---

## [2026-05-29] — bbl/hof.html 精修 + 数据更新至第124期 + data/ 目录重组

### Added
- **`data/bbl/bbl-vol-index.json`**：Vol.1–124 期号→日期索引（JSON 对象格式），供未来 `bbl/charts` 等页面 fetch 引用
- **`bbl/hof.html`**（原 `barboardlab/hall-of-fame.html`）：HOF 页面重命名移位，eyebrow「BarboardLab」加链接返回 `/bbl.html`

### Changed
- **bbl/hof.html Hero 间距**：对齐 bbl.html hero 结构——padding-bottom 80px→72px，content margin-top 加 40px，标题 `clamp(56px,8vw,108px)`，stats margin-top 36px→32px
- **bbl/hof.html Hero 细节**：「of」opacity 0.65；背景水印 HOF→BARBOARDLAB；描述文字换行，更新为「数据截至第 124 期」
- **bbl/hof.html 冠军名录**：标题字号缩小为 `clamp(18px,2.4vw,28px)`；歌曲/艺人顺序改为上歌曲下艺人；描述文字字号 13px；首次登顶日期显示完整日期（Jan 5, 2024）；表头「艺人 — 歌曲」→「歌曲 — 艺人」
- **bbl/hof.html 未冠之最**：同步歌曲/艺人顺序为上歌曲下艺人，表头同步更新
- **bbl/hof.html 数据全量更新至第 124 期**：冠军单曲 20→31 首，新增 Taylor Swift — The Fate of Ophelia（10周/peak 3081.23）、Olivia Dean、Taylor Swift — Opalite、Alex Warren、Olivia Rodrigo、Sabrina Carpenter Tears、Doja Cat、RAYE、After、Harry Styles、Linda Lampenius & Pete Parkkonen；Mariah Carey weeks 1→2（Vol.104 二度登顶）；Hero stats：期数 89→124，冠军单曲 20→31，最高参榜人数 28→29
- **`data/` 目录重组**：
  - `data/bbl/`：`bbl-latest.json`、`bbl-vol-index.json`、`bbl-record/`（原 `bbl-hall-of-fame/`）
  - `data/main-page/`：`ticker.json`、`updates.json`
  - `data/members/`：`members.csv`（原 `barboard_members.csv`）
  - `data/barvision/`：`barvision-archive/`、`barvision-record/`（原 `barvision-hall-of-fame/`）

### Fixed
- 所有受数据目录重组影响的路径同步更新：`index.html`、`bbl.html`、`member.html`、`scripts/fetch_bbl.py`、`scripts/gen_member_pages.py`、`.github/workflows/update-bbl.yml`（3处）

---

## [2026-05-29] — BBL Hall of Fame + bbl.html 视频区精修 + 动画修复 + 项目清理

### Added
- **`barboardlab/hall-of-fame.html`**：BBL 荣誉殿堂页面，5大板块：冠军名录（20首 #1 单曲按周数排行，金/银/铜 medal 样式）、驻榜韧性（6组在榜纪录卡片：总在榜/Top50~3）、艺人版图（总周数+上榜歌曲数各前10）、上榜专辑（19张两列排布含上榜率）、未冠之最（从未登顶但积分最高的10条）；数据硬编码 JS 常量，无 fetch

### Changed
- **bbl.html 视频框**：视频标签改为「本期榜单视频」；视频 header/footer padding 收窄至 `8px`；移除 `aspect-ratio: 16/9`，改为 JS `alignVideo()` 动态对齐 h1 顶 → 按钮底，列宽 = `frameH * 16/9 - 4px` 实时更新 grid；Bilibili iframe `allow` 属性补全，embed URL 加 `&muted=1` 默认静音
- **bbl.html 外链样式统一**：「在 Bilibili 观看」与「在 Musictrack 查看」字号/间距/opacity/hover 颜色完全对齐；「本期视频」label 字间距还原 0.14em；「Vol. N」改用 font-body，样式与 label 一致；日期 font-body + opacity 0.65，与外链对齐同一基线
- **bbl.html 榜单按钮**：「查看全部 100 首」改为「查看完整 Top 100」；「完整历史榜单」右 padding 收窄至 18px

### Fixed
- **index.html BBL 按钮 hover 延时**：`transitionend + { once: true }` 方案存在竞态且移除 inline style 后 CSS nth-child delay 重新接管。改用 `clearDelayAfterAnim(el)` + `setTimeout(delay*1000+250)` 精确清除，`style.transitionDelay = '0s'` 而非 `''`
- **index.html `.btn--primary` 入场动画失效**：`.btn--primary.fade-up.visible` 规则仅写 `background-position/box-shadow`，覆盖了 `.btn.fade-up.visible { transition: all 0.2s }` 中的 opacity/transform，导致 `.btn--primary` 跳变显示；补全 `opacity 0.2s ease, transform 0.2s ease` 修复入场渐显

### Docs
- **项目清理**：删除 61 个未声明冗余字体文件（DM Sans 光学变体/DM Mono 变体），`assets/fonts/` 从 82 → 6 文件；删除空目录 `about/` `archive/` `charts/`；清除 `bbl.html` 遗留 `.breadcrumb` CSS
- **CLAUDE.md** 新增开发注意事项 #76–81（delay 清除方案、btn--primary transition、视频框自适应、iframe 权限、HOF 架构、清理记录）

---

## [2026-05-29] — bbl.html 大量 UI 精修 & 功能新增

### Added
- **亮点卡片点击定位**：点击本期亮点任意卡片 → 平滑滚动至对应榜单条目并垂直居中；rank > 50 自动展开完整榜单；定位前强制 `.visible` 消除 transform 偏移；持久高亮（`bbl-rank-active` + 紫色辉光），下次任意点击 0.8s 渐出
- **本期亮点 #N 名次显示**：最长在榜/最大涨幅/最大跌幅三条标题行右侧展示当前排名
- **侧栏搜索框**：支持歌名/歌手实时过滤，有输入时自动展开全 100 首，固定高度 count 提示防抖动；样式与 member.html 搜索框统一
- **member.html 搜索框放大镜**：与 bbl.html 同款，wrapper 独立定位防 count 干扰
- **向上回滚取消动画**：`_scrollingDown` 标志，向上滚动时条目直接显示不播入场动画
- **"在 Musictrack 查看" 对齐榜单右边界**：`bbl-chart-header` 加 `padding-right: calc(236px + var(--gap-md))`，响应式断点同步

### Changed
- **本期亮点卡片**：padding/间距/字号压缩；最长在榜改为棕黄色 `#D49840`；最长在榜条目「在榜周数」stat 加 `bbl-stat--pink` 高亮
- **榜单 stats 右移**：`bbl-chart-list .chart-item` `padding-right: 8px`（原 14px），整体右移 6px
- **榜单标题重构**：`BAR`（白）+`BOARD`（`#6F9EC3`）+`LAB`（紫）三段配色；`SINGLES CHART` + `第N期`（`font-body 0.75em`）分段样式；期数/日期动态 fetch
- **Meta 信息**：改用 `lab__meta` / `lab__meta-item` 全局样式（圆点前缀），文案改为「已更新 N 期 · 每周六更新 · 创立于2024年3月13日」
- **Hero 布局**：`padding-top: var(--nav-h)`，eyebrow `margin-top: 0`，chart section `padding-top: 64px`
- **外链箭头统一**：「在 Bilibili 观看」「在 Musictrack 查看」改为 `width="8" height="8" class="ext-icon"`
- **「在 Musictrack 查看」**：`opacity: 0.65`，hover 时 `--clr-violet-light`
- **去除**：面包屑导航、eyebrow 横线装饰

### Style
- **设计原则更新**：跨页面样式一致性原则（含排版间距）写入 CLAUDE.md；eyebrow → 标题间距统一 24px；搜索框规范统一；auto 列 margin-left 无效陷阱记录

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
