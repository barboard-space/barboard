# Changelog — Barboard 官网

所有重要更新记录于此，按日期倒序排列。

---

## [2026-06-26] — 移动端 hero 主视觉透出 + 近届年度卡遮罩调浅

### Fixed
- **手机端 hero 主视觉几乎不可见**（尤其 2025 `bg-orange`，被误认为「没有背景图」）：移动端 `.bvr-hero__scrim` 由 `0.86/0.76/0.90` 调浅至 `0.7/0.52/0.8`，2023/2024/2025 三届手机端主视觉均透出、文字仍可读（bg 文件/配置本就正确，问题在 scrim 过重）。

### Style
- **barvision.html 近届年度卡（XV/XIV/XIII）主视觉遮罩**由 `0.40/0.58` 调浅至 `0.2/0.3`，年度卡主视觉更鲜亮；满宽 XVI 当届大卡遮罩不变（左侧文字需深底）。

---

## [2026-06-26] — 第 15 届(Jinzhong 2025)赛果数据 + 半决赛 20 票制 / 海选 / 三态排序

### Added
- **第 15 届 Jinzhong 2025 赛果数据**：`scripts/parse_bv_edition15.py` → `regular-15.json`（SF1/SF2/GF）。冠 威妈 Boy In Love 357（评151+观206）/亚 S妈 Virus 310 / 季 雨妈 Glitter & Honey 308；overall 1–26 与官方 25-Scoreboard.csv 完全一致。本届半决赛即引入观众分（20 票制，三场均 `tele_mode='votes'`）、东道主 S妈/威妈直通决赛、首届不匿名、狼/芬合报。
- **「海选阶段」section**（`auditionsBlock`，JSON `auditions`）：10 场海选表（海选名称/成员/时间/获胜歌手/获胜歌曲）+ MOLODI 换曲 my sea 注释。
- **Tele Scoreboard 观众分/票数拆两列**（新增冻结列 `.raw`「票数」，不可排序）。
- `regular-15.json` 文案：summary（威妈夺冠）/ visual_design / 结构化 rules（含海选机制）/ per-match summary / links（Recap + Spotify/网易云/QQ 歌单）。

### Changed
- **计分板拆分条件**改为 `isGF || tele_mode==='votes'`：2025 SF1/SF2 也拆 Jury/Tele 两表。`bvRunningOrder` 优先用数据自带 `ro`。总成绩单 host/co-host 显「直通」。
- **排序箭头三态**（结果表 + 计分板）：默认(都不亮) → 降序(下亮) → 升序(上亮) → 默认（恢复初始顺序）。
- **member.html 实心 logo = 2026 参赛名单**（`BV2026_ACTIVE` space_id 集，覆盖原年份判定）；4 位无往届数据的新参赛者补 bv_index 仅点亮 logo。
- **城市加省名**：第 14 届 通化→吉林通化、第 13 届 齐齐哈尔→黑龙江齐齐哈尔。萌艺人沿用现名 MYTCH。

### Fixed
- **冻结窗格横滑轻微抖动**：`stickyMatrixCols`/`stickyResultCols` left 偏移改用分数精度 `getBoundingClientRect().width`（替代整数 `offsetWidth`），消除舍入缝隙（桌面 + 手机）。
- **手机端结果表 R/O 表头排序箭头被截断**：去掉箭头负右边距（原溢出到相邻冻结列下被遮）。

### Docs
- CLAUDE.md #163（第 15 届导入全要点）；更新「待建」（1–15 届已导入，下一步第 16 届 2026）。

---

## [2026-06-25] — 第 15 届(Jinzhong 2025)主题/hero 接入

### Added
- **第 15 届 Jinzhong 2025 主题/hero**（数据未导，仅 hero + 视觉设计 stub）：主视觉素材 `assets/images/barvision/2025/{poster(橙黄+logo右),bg-orange(橙黄无字),bg(深红块状)}.png`；`BV_THEME[2025]`（桌面 poster / 手机 bg-orange，均橙调；c1 橘红 `#df5a2c`、c2 `#5e0f14`、c2l·c3 暖橙 `#f4a259`、橘红+橙 glow）、`BV_STRIPE[2025]`=`['#f4a259','#e0612e']`、`RECENT_BG[2025]`=`bg.png`、`BUILT_EDITIONS`+15.html。
- 薄壳 `barvision/2025/15.html` + stub `data/barvision/barvision-2025/regular-15.json`（hero 元数据 + 威妈视觉设计文案 + 设置型 summary，matches 待 parser 填）。

---

## [2026-06-25] — 第 14 届 hero 改用粉版主视觉

### Changed
- **2024 hero 主视觉统一为粉版**：桌面 `BV_THEME[2024].poster` → `poster-pink.png`（粉版 + logo，3840×2160）；手机 `posterMobile` → `bg-pink.png`（原 bg-blue）。桌面右锚定保 logo、手机居中铺满，深色 scrim 保证文字可读。
- 新增资产 `assets/images/barvision/2024/poster-pink.png`。

---

## [2026-06-25] — 第 14 届(Tonghua 2024)赛果数据 + 20 票观众投票制渲染适配

### Added
- **第 14 届 Tonghua 2024 赛果数据**：`scripts/parse_bv_edition14.py` → `data/barvision/barvision-2024/regular-14.json`（SF1/SF2/GF 三场）。冠 S妈 Pretender 266（评 123+观 143，破纪录、S妈首冠）/亚 雨妈 Eyes Wide 259/季 A妈 Honeycrash 209；overall 1–28；观众总票 520=26×20。半决赛逐票读 `Barvision Tonghua 2024.xlsx`（CSV SF2 漏「雨」列）、语种取自 CSV、GF 读 `24-GF-JURY/TELE.csv`。
- **`regular-14.json` 文案**：summary（叙事）/ visual_design（通化轨道交通导视主视觉，威妈设计）/ 结构化 rules.sections（含 QQ 音乐行 + 20 票观众投票说明）/ SF1/SF2/GF 三段场次概况 / links（直播回放 2 + 赛事回顾 3 + 歌单 Spotify 3 / 网易云 3）。
- **总成绩单 GF VOTERS 拆「评委数 / 观众数」两列**（`bv-results-render.js` `scoreboardBlock`：`stat5→stat6`、`voterCounts(m)` 按 type 计、GF 组 colspan 6 / SF 组 colspan 7 / min-width 1120），对标官方 `Scoreboard 2024.png`（忽略 ODD）。GF TELE 列显示「观众分 + 观众票」（如 `143 55票`）。
- **`linksBlock` 支持 `recaps` 类**（「赛事回顾」组，介于直播回放与歌单之间）。

### Changed
- **20 票观众投票制渲染分流**：GF match 加 `tele_mode:"votes"`；观众投票人无 `top`。`votingMatrixSingle('tele')` 无 12 分金标、`twelveBlock` 排除 tele（12 Points 仅评委）、`gen_member_pages` 12 分次数排除 tele。半决赛 tele 仍 1-12、正常金标。
- **外部投票人**：Watermelonnew → 规范「外部」（`members.external=true`），`memberLink` 外部分支 → `.bvr-ext`（弱化斜体、无 @、无链接、无 tooltip）。
- **CLAUDE.md #157 投票制度更正**：2024 观众分 20 票**无每首上限、可全投一首**（原写"≤15 票"作废）；2025 起每首≤10 票；20 票制仅决赛 GF 观众侧，半决赛仍 1-12。
- **个人主页概览卡「双歌只计较好者」**：年度制同一届有 ≥2 首正式单曲（东道主/协办，如 ed14 羊妈/威妈）→ 概览卡统计（best/avg/top1·3·10/参与场数/twelve/jury_avg + member.html「参加场数」）只计 rank 较好那首；参赛表/走势图仍显示两首（`gen_member_pages.aggregate_barvision` 按 `final` 字段判年度制、按届号去重）。
- **波妈(id101) handle 全局改名** `ww_micro_微波`→`微波子`（=其 B 站名）：members.csv + member/101.html + regular-14.json + editions-index.json + index.html + member.html + hof_data.json 共 7 处；昵称「波妈」不变。

### Style
- **最终赛果计分板 GF Points 字号**与 SF Points 一致（`.bvr-sb-pts` 15px→14px；颜色 `--clr-text`/字重不变；桌面+手机；2023/2024 共用渲染均生效）。

### Fixed
- `gen_member_pages._emit_bv` 的 12 分次数对 `tele_mode==='votes'` 的届排除观众，避免观众原始票数恰为 12 被误计。

### Docs
- CLAUDE.md 新增 #161（第 14 届导入全要点）；更正 #157 投票制度；更新「待建」（1–14 届已导入，下一步第 15 届 Jinzhong 2025）。

---

## [2026-06-25] — 第 14 届(Tonghua 2024)主视觉/主题/hero + 移动端悬浮 TOC + 文案

### Added
- **第 14 届 Tonghua 2024 导入（第一阶段：主题/hero）**：素材 `assets/images/barvision/2024/{poster(蓝版+logo),bg-pink,bg-blue}.png`；`BV_THEME[2024]`（hero 蓝底 + 粉字：c1 深粉 #f13b8d / c2 navy #09184e / c2l·c3 浅粉 #fc91c1 / posterMobile=bg-blue）、`BV_STRIPE[2024]`=[浅粉,中粉]、`RECENT_BG[2024]`=bg-pink、`BUILT_EDITIONS`+14.html；薄壳 `barvision/2024/14.html` + `regular-14.json`（**hero 元数据 stub，matches 空，待 parser 填数据**）。
- **移动端悬浮 TOC（所有吧视详情页通用）**：`bv-results-render.js` 的 TOC 在手机端收为悬浮按钮（对齐 back-to-top 风格，置于其上方），点开弹出 glass 目录面板、点条目滚动定位+收起、点外部收起；桌面端 TOC 不变。

### Changed
- **hero poster 通用机制（2023+2024）**：`BV_THEME` 加 `posterMobile`，poster 背景走 CSS 变量；桌面 `.bvr-hero__poster` `background-position:right center`（裁切优先保右侧 logo）；手机端切无 logo 的 bg 版（2024→bg-blue / 2023→bg.png）居中。
- **文案**：2023+2024 intro「经两场半决赛后共有 18 首进入决赛，并由…共决冠军」+「最终，」加逗号；2024 删「（评审 123 + 观众 143）」及多余空格。2023「匿名」去重（全文留 1 处；参赛与报名第二处删、SF1/SF2「匿名投票与 Top 10 排名制」→「Top 10 排名制」）。⚠️ 用户否决 2023 赛制/summary 大幅精简，只做匿名去重。

---

## [2026-06-25] — 2026 主视觉接入 + 2023 详情页相关链接 / 手机端优化 / 收尾微调

### Added
- **2026 主视觉接入**：`barvision/2026/events.html` hero 用 `poster.png` 作背景（`.ev-hero__poster` + `.ev-hero__scrim`，移除右列 SVG logo 改单列、去 grid/水印、留辉光）；`barvision.html` XVI 当届大卡用 `bg.png` 作底图（cover + `background-clip:padding-box`，`::before` 改暗罩渐变去网格纹）。素材 `assets/images/barvision/2026/{poster,bg}.png`。
- **2023 详情页「相关链接」section**（数据驱动，任意届 `d.links` 存在即渲染，2024/2025 复用）：`regular-13.json` 顶层加 `links{replays[], playlists[{platform,items[]}]}`；`bv-results-render.js` 新增 `linksBlock(d)`（直播回放 + 歌单链接分平台），section 置于最终赛果后、TOC 加「相关链接」；CSS `.bvr-links__*`。

### Changed
- **Hero scrim 调浅**（2023 详情页 `.bvr-hero__scrim` + events.html `.ev-hero__scrim` 同值）：左 0.94/0.80→0.88/0.72、右 0.30/0.14→0.18/0.05（logo 更明显）、底 0.78→0.72。
- **2023 hero meta**：@名（meta + 简介）回归 `.member` 全局榜吧蓝 #8FBEE3（删 hero 3 条主题色覆盖）；meta 文字 `.bvr-hero__mi` 由 c3 浅珊瑚改 c1 珊瑚红 #f84d39（与 eyebrow 同色）@ 0.85（color-mix）。
- **赛制赋分表**：分数 12 保留金色（`.bvr-rule__sc--top`），10–1 改白色 `--clr-text`。
- **全站「Top10」→「Top 10」**（投票排名类）：regular-01/02/03/04/05/06/07/12 voting + regular-13 rules/SF1/SF2/GF summary 加空格；资格门槛类（Top100/50/20/「无 Top10 单曲」）保留不动。

### Style（手机端，均锁 `@media max-width:768px`）
- **参赛名单选送者**：桌面 @handle / 手机 X妈（`entryListBlock` 去 `{nick:true}`）。
- **参赛名单 + 总成绩单**：手机端取消冻结列（`position:static`），完全左右滑动。
- **总成绩单值字号收小**：#16px / 选送者12px / 歌手12px / 歌名11px。
- **手机 hero(poster)**：`min-height:auto`、标题 `clamp(34,10.5vw,52)`、scrim 改竖向加深保证可读。
- **barvision.html 主按钮**：去掉粉色辉光（box-shadow 紫色 only），修右侧"露底粉色"（根因=box-shadow 粉色分量，非渐变末端）。

### Content
- 狼妈选送 Thomas Headon 歌名修正为 `not saying goodbye :(`（SF1 + GF 两处；重跑 `gen_member_pages.py` 同步成员页）。
- 2023 intro 标点微调：「发起承办、…包装宣传，27 位」→「发起承办，…包装宣传。27 位」。

### Investigated（非 bug）
- 「ed13 缺成员变动 + 上下届导航」经查为**预览端浏览器缓存假象**：boot 无 cache-bust fetch `editions-index.json`，预览 http.server 不发 Cache-Control → 浏览器缓存了 ed13 加入前的旧索引（12 届）→ `curIndex(ed13)=-1` → 两块返回空。磁盘文件实为 13 届含 ed13、代码正确，**线上 fresh 访问正常、无需改代码**。

### Removed / Chore（精简清理）
- `style.css?v=` 升 **3.0.13**（index/bbl/bbl·hof/styleguide 4 文件，同步手机端 `.btn--primary` 去粉辉光改动）。
- 删除死代码 `bv-results-render.js` 的 `introsBlock()` 函数 + `.bvr-intro*` CSS（6 条）——从未被调用、各届无 `entries[].intro` 字段（CLAUDE.md #130「保留备用」决定作废）。`.bvr-empty` 保留（twelveBlock 共用）。
- 只读审计（Explore 代理）确认项目已较精简：无备份/临时文件、无重复 CSS class 定义、结构合理；`data/barvision/barvision-archive/`（领奖台 CSV，已被各届 JSON 取代）+ 4 个 git 未跟踪空目录为可清候选，待用户确认是否删 archive 数据。

### Docs
- CLAUDE.md #159（本次综述，部分修订 #158）、#122 版本号更新为 3.0.13、#130 标注 introsBlock 已删；memory 新增「events.html 更新日期自动同步」约定 + 更正 ed13「非 bug」。

---

## [2026-06-25] — 第十三届详情页设计定稿（hero / 各表 / 配色 多轮精修）

### Changed
- **Hero 重设计**：海报作整屏背景（`.bvr-hero--bg`，72vh + 渐变遮罩，遮罩左移露出右侧 logo）+ events.html 内容布局（城市/年份标题、竖分隔 meta、简介）；hero 配色全部主题色（`--bvt-c1/c3`，仅 hero，下方板块保持默认）；简介精简为 2 段并入 hero（移除独立 Intro 板块）。
- **结果概览 Results**：列序改 `R/O｜选送者｜歌手｜歌名｜语种｜JURY｜TELE｜PTS｜PLACE`；SF 不用金银铜、改「前 9 晋级」紫色高亮 + 行内「晋级」标；JURY/TELE 分按各列名次弱化（`--clr-accent-soft`/`--clr-pink-soft`）。
- **计分板**：GF 拆评委/观众两表、SF 合并一表；三表加可排序 R/O 列、选送者列取消排序、Total/Jury/Tele 可排序；SF 未晋级行弱化。
- **总成绩单 Scoreboard**：参赛作品拆「选送者｜歌手/歌名」两列；加 Jury/Tele/Voters 列（各列最大值高亮白）；前三名金银铜 tint；SF 徽章 SF1=`--clr-pink-deep`#8a2548 / SF2=`--clr-cta-3`；边框统一 1px；poll 行优化为 Bebas 数字。
- **赛制**：去掉来源；平台数据表 caption 与平台名样式对调（caption 更醒目）。
- **路径命名**：详情页改 `barvision/<年>/<届号>.html`（去 `regular-` + 前导零；娱乐版 `<届号>e`）。
- **成员页**：Jury 均分改统计「广义 12 分」（2024 起才有独立观众分）；徽章 60° 双色斜条纹（下移 1px）；字号统一；`@名`字距 .02em；走势未进决赛点用 soft 色。
- **barvision.html**：2023 卡上半用主视觉 `bg.png`（`background-clip:padding-box` 修底部亮边）；近届卡 hover 增强；前 12 届 hover 改粉色 `--clr-pink-light`；修复 fade-up 覆盖卡片 hover 过渡（#64）。
- 简介/概况文案精简、成员统一写「X妈」（自动转 @handle）。

### Added
- style.css 令牌 `--clr-accent-soft`/`--clr-pink-soft`/`--clr-pink-deep`。
- 详情页完整设计规范见 CLAUDE.md #158（各表/板块样式·配色，2024/2025 复用基准）。

---

## [2026-06-25] — 第十三届（Qiqihar 2023）详情页 + 成员页 + 总成绩单（2023+ 年度制通用）

### Added
- **2023+ 年度制详情页（通用，2024/2025 复用）** `scripts/bv-results-render.js`：① `BV_THEME[year]` 主题表 → 主题届渲染**海报 banner hero**（珊瑚红 #f84d39 / 墨绿）+ 独立**简介/视觉设计** section；② 结构化 `rules.sections`（参赛报名 / 资格含**平台数据表** / **赋分表**）；③ **参赛名单**板块（含流派列，按选送者 ASCII→拼音排序）；④ **计分板 jury/tele 拆两张**（年度制每场评委矩阵 + 观众矩阵；旧届仍合并单表）；⑤ **总成绩单 Scoreboard**（合并 GF+SF 每首一行：得分/得票率/票数 + SF 场次徽章 SF1 珊瑚红/SF2 墨绿 + TOTAL POLL）；⑥ 每场概况 + GF 折算注；`matchEng` 补 SF1/SF2。
- **派生字段进 `recompute_bv_ranks.py`**（管线 step 5）：`support_rate`（得票率，分母=Σ折前 jury+tele）+ `voters`（给分人数）对所有届算；`overall_rank`（年度制：GF 1–18 + 半决赛淘汰按得票率降序 19–N）。与官方计分板逐项精确吻合。
- **成员页**：`gen_member_pages.py` 年度制 **SF→GF 收敛**（每人一条记录、rank=overall_rank）；`member-render.js` 2023+ 徽章 logo 改 **45° 双色斜条纹**（主题双色，SVG `<pattern>` + 导出 PNG canvas 同步）。
- 薄壳 `barvision/2023/regular-13.html`；`barvision.html` BUILT_EDITIONS 加 ⅩⅢ、`buildRecentArchiveGrid` 补链接逻辑（XIII 卡可点）。

### Changed
- **详情页路径命名规范**：薄壳 HTML 改为 `barvision/<年>/<届号>.html`（去 `regular-` 前缀 + 去前导零，如 `regular-13.html`→`13.html`；娱乐版将用 `<届号>e.html`）。已重命名 1–13 届全部薄壳，`editionHref`/`gen_bv_editions_index`/`member-render` 链接同步；JSON 数据文件名不变。
- SF 结果概览微调：列序改 `R/O…JURY TELE PTS PLACE`；TOC 每场合并一条英文标题（Semi-Final 1/2、Grand Final）；晋级配色改紫；计分板未晋级行弱化（选送者 0.75 / 分数 0.65）；结果概览 JURY/TELE 分按各列名次弱化为新令牌 `--clr-accent-soft`/`--clr-pink-soft`；徽章斜条纹 60° + 浅珊瑚双色。
- `aggregate_barvision` **改为按 space_id 聚合**（经各届 members 映射解析 id）——修复 ed13 单字昵称（萌/羊/S）与早期「X妈」不合并；对未来年度制通用。
- `regular-13.json` 转为手工维护：`summary` 改 3 段叙事、新增 `visual_design`、`rules` 结构化、每 match 加 `summary`、genre 规范展示态、多艺人/正字法按 #15/#119 修正、狼 GF score 存真实折算 55.5。

### Verified
- 桌面 + 手机预览：主题 hero / 规则表 / 参赛名单 / SF1·SF2·GF 拆分计分板（含冻结列）/ 总成绩单（与官方 Final Results 一致）/ 成员页收敛 + 斜条纹徽章 + 走势单点。旧届（ed5 三组制）零回归。

---

## [2026-06-25] — 第十三届（Qiqihar 2023）数据层导入

### Added
- **第 13 届数据层**：`scripts/parse_bv_edition13.py` → `data/barvision/barvision-2023/regular-13.json`。2023 重启新格式：三场 SF1/SF2/GF（27 首→半决赛各前 9 晋级→决赛 18），jury+tele 逐票（eid 键）。SF 读干净 CSV、GF 读 Grand Final 总表；半决赛 jury=本场选送者/tele=其余、决赛 jury20+观众6（音城布兔T鸽）；狼/锴 50% 折算（小分折前、score 折后）；总排名 1–27；含 language/genre、Q-NQ。校验全过（GF 冠军 羊159、12 分摘要对齐 Notion）。收录 2023 主视觉资产。
- **⚠️ 仅数据层**：2023+ 详情页/渲染（主题化 hero + 数据组件 + jury/tele 拆分计分板 + 参赛名单/规则板块 + 成员页 SF→GF 收敛）**待建**，见 CLAUDE.md #156。

---

## [2026-06-25] — 导出按钮整合到标题行 + 完整记录含成绩列表 + 导出卡居中/样式打磨

### Added
- **「导出完整记录」含历史成绩列表**：`exportBvCardPng(btn, withTable)` 加 `withTable`——为 true 时在走势图与品牌脚之间 canvas 手绘完整参赛表（表头 名次/届次/场次/歌手/歌名/总分/12分 + 各行：名次奖牌色、届次榜吧蓝、混淆/取消行灰底 text-4「N*」、歌名后标签 合报/混淆/取消/匿名#N、长文本省略号截断）。

### Changed
- **导出按钮整合到「吧视参赛记录」标题行最右侧**（`.mp-bv-titlebar`/`.mp-bv-exports`），两个：**导出走势图**（=完整卡：头像+8卡+走势图）/ **导出完整记录**（=完整卡+成绩列表）；移除走势图标题栏内的导出按钮与原 trend-only 按钮。
- 导出按钮样式统一为 **Bilibili/Musictrack（`.mp-link`）同款**（中性 surface 底+边框，hover 提亮）。
- 导出卡 **8 张统计卡排成一行**；卡内**数字+括号组水平居中 + 整体上下垂直居中**。
- 全站「评委平均分」→ **「Jury 均分」**（网页 overview + 导出卡）。

### Fixed
- 导出完整列表中名次列为空的「—」粗细/长短不一（混淆/取消行用 13px、普通行用 15px）→ 名次为空时固定 `600/15px`，统一。

---

## [2026-06-19] — 成员页 overview 八卡两组 + 走势图/完整记录导出 PNG（Step 1+2）+ 手机端徽章/走势图续调

### Added
- **完整记录导出（Step 2）**：走势图标题栏新增「导出完整记录」按钮 → `exportBvCardPng()` 纯前端 canvas 合成一张分享卡（3552×2274）：头部（头像渐变环+昵称首字 + 大名 + @handle + 届徽章行 Path2D 五边形按年配色）+ 8 张统计卡（2×4，含混淆括号）+ 走势图（小标题+图例+高清图）+ 左下 logo 品牌。抽出共享 helper `bvTrendToImage`/`bvDrawLegend`/`bvDrawBrand`，Step 1 重构复用。两按钮：导出走势图 / 导出完整记录。
- **走势图导出图片功能（Step 1）**：走势图标题栏「导出图片」按钮 → 纯前端 `exportBvTrendPng()` 把 SVG 走势图导出为 2x PNG（克隆 SVG + 内联计算样式解析 `var()` + 懒加载 base64 嵌入 DM Mono/DM Sans 保真 + canvas 加暗底/头部大名/「BARVISION · 历届排名走势」/`barboard.space` 水印）。手机优先 `navigator.share({files})` 唤起微信/QQ，否则下载；零外部服务。验证生成 2400×868 PNG。**Step 2（完整记录分享卡）待做。**
- 成员页 overview **8 张卡、分 A/B 两组**（桌面一排先 A 后 B、手机 A 上 B 下）：A 组 最佳名次/平均名次/12分次数/评委平均分；B 组 冠军场数/前三场数/前十场数/参与场数。新增聚合字段 `avg`(平均名次)/`top10`+`top10_shadow`(前十)/`jury_avg`(单评委平均分)。

### Fixed
- **导出图片修复**：① 桌面（Windows 的 `canShare({files})` 也为 true，曾误弹系统分享框）改为**仅手机/触屏用 Web Share、桌面一律直接下载**；② 分辨率提升 2x→**3x** 且让克隆 SVG 以 `W*SC` 像素**直接栅格化**（原先先 1x 再放大变糊）；③ 导出时按**固定逻辑宽度 1120** 重绘再截取（之后即刻恢复响应式），使**手机也产出与桌面一致的宽幅高清图**。
- **导出图含图例 + 品牌行**：右上角 canvas 直绘图例（● 正式单曲 / ○ 混淆单曲）；左下角 `bvLoadLogo()` 画站点 logo + `barboard.space`（logo 略大于文字，网址基线微调），图片底部加高至 3552×1374。

### Changed
- **A 组仅正式单曲**；**B 组主数字=正式曲数、混淆曲用括号 `(n)` 单独标注不并入**。**评委平均分 = 单评委平均分**（每曲 `jury_vote/该场评委数` 再对各正式曲求均值，理想 0–12；新增 rec `juryN`），两位小数；平均名次两位小数。
- 「最佳名次」括号 `.mp-bv-rep` 去亮金、改 `--clr-text-3` + `font-weight:400`（不再显粗，与混淆括号统一）。
- 走势图平均标注 `.mp-bv-trend__avglab` opacity .65→.85。
- 手机端徽章**固定每行 10 个**（宽 `calc((100% - 36px)/10)` + `aspect-ratio`，随屏缩放）；头像随视口 `clamp(64px,21vw,88px)` 自适应。

---

## [2026-06-19] — ed1–12 成果微调（标签顺序 / 12B 混淆 / 届徽章 / 滚动条 / 走势图 / 手机端 hero）

### Changed
- **标签顺序统一为 合报 → (匿名#N) → 混淆 → 取消**（详情页结果概览 `bv-results-render.js`、成员页参赛表 `member-render.js`；匿名页 persona 标签置于混淆/取消之前）。
- **12B（取消组）混淆曲恢复「混淆」标签**：`parse_bv_edition12.py` `build_12B` 不再剥离「混淆」、改设 `is_shadow`（包妈/虎妈/团妈/雨妈 4 首）；详情页 `canceledList()`（选送名单）与成员页参赛表均显示「混淆」标。重跑全管线。
- **届徽章规则**：仅参加正式比赛才获该届徽章——`member-render.js` `bvBadges` 收集届号时跳过 `canceled`；`gen_member_pages.py` 的 member-bv-index `editions` 同步排除 canceled-only 届（只报 12B 的奶妈/柠妈/虎妈不得 12 届徽章，参加 12A 的包妈/雨妈保留）。
- **历届排名走势图**（`member-render.js` `drawBvTrend`）：数据点抵拢两边（左 inset 大、右仅微收，桌面 `minSlotW 56→36` 免滚动）；新增**平均排名虚线**（仅正式单曲，全宽=网格线、位于折线下层、`--clr-violet-glow` 配色、左端上方标注「平均 X.XX」opacity .65）；同 X 名次相差 ≤3 的 `#N` 标签**上下交替错开**；所有非 hit 元素 `pointer-events:none`（修复靠下点无法 hover/点击）。
- **手机端成员主页 hero**：徽章组移到大名**下方**、`@名` 移到大名**右边**（flex `order` + `flex-basis:100%` 切换桌面/手机两套排布，桌面不变）；徽章可换行不溢出（独立 `.mp-bv-badges` 容器）、手机徽章 20px、头像 96→80px。
- 全站滚动条主题化（`style.css`）：暗色细条 + 软紫滑块（`--clr-violet-dim`），hover → `--clr-violet-glow` 带 `background-color` 过渡；`style.css?v=` 升 3.0.10 → **3.0.12**（index/bbl/bbl·hof/styleguide）。

### Fixed
- `.mp-handle` 移入 `.mp-nickname` 后误继承 Bebas Neue 变全大写「@LEE」→ 显式 `font-family:var(--font-body)` 恢复。

### Notes
- ⚠️ ed12 summary/rules 仍含「本届取消混淆」（对实际举办的 12A 成立，12A 混淆=0）；12B 仅存档名单含 4 首混淆标——文案张力待用户定夺是否改措辞。

---

## [2026-06-19] — Barvision 第十二届导入（2020 收官，A 办/B 取消）— 2020 全部完成

### Added
- `scripts/parse_bv_edition12.py` → `regular-12.json` + 薄壳 + BUILT_EDITIONS Ⅻ。有规则书（rules 已填）。**至此第 1–12 届全部导入**。
- **12A**：萌妈/雨妈 合报分开投票各 ×0.5（计分板 ×2 还原）；Z妈 只投前8 ×0.8 折算（计分板显折算小数、最高格记 12）；苏妈/晕妈 未提交排名得分折算（数据 ~70%，规则书写 50%，以总分为准）；匿名 神妈=#11、裸名匿名=#12；max 模式 12 分。
- **12B（报名后取消）**：match `canceled:true`，仅选送名单（按选送者大名排序：中文拼音 A-Z 前、字母名后）；详情页 `canceledList()` 渲染『选送名单』section；成员页参赛表灰行 + 「取消」标 + 名次/总分/12分「—」；不计走势/统计/名册；匿名 神妈=#13。

### Changed
- `recompute_bv_ranks.py` 跳过 canceled 匹配；`number_anon.py` 裸名「匿名」非混淆→编号、混淆→不编号（ed3 无人认领保持裸名）；`gen_member_pages` 聚合加 canceled 字段并从统计中排除；`member-render` canceled 行 + `.mp-bv-canceled` CSS；`bv-results-render` canceled 分支 + `canceledList()`。

### Fixed
- 自查：12 分次数交叉核对 488 条 0 不匹配、ed12 编号 #11/#12/#13、ed3 裸名匿名未被重编、12B 取消行/名单正常、全 data 无「」、预览无报错。

---

## [2026-06-19] — Barvision 第十一届导入（2020，A/B 两组）

### Added
- `scripts/parse_bv_edition11.py` → `regular-11.json` + 薄壳 + BUILT_EDITIONS Ⅺ。同九/十届框架（无规则书、score=总分、max 模式 12 分）。本届：artist/song 独立两列（Artist(s)/Title，不拆分）；无混淆/无折算/无半值；11A 雨妈/雀妈 合报且**合体给分（联合投票一票 100% 计入、不折算）**；匿名续编 11A 匿名1=#7/匿名2=#8、11B 神妈=#9(选送 Best To You)/隐妈三号=#10(Girls)。
- `is_anon` 扩为「含匿名/含隐妈/∈{神妈,神隐妈}」；`ALIASES` 加 `隐妈3号→隐妈三号`；`norm_name` 处理空格分隔的联合名。

### Fixed
- 自查：12 分次数交叉核对 470 条 0 不匹配、合报双计入、详情页匿名#7–#10 正常、无原始匿名名残留与控制台报错。

---

## [2026-06-19] — Barvision 第十届导入（2020，A/B 两组）

### Added
- `scripts/parse_bv_edition10.py` → `regular-10.json` + 薄壳 + BUILT_EDITIONS Ⅹ。同第九届（无规则书、任意小数、score=总分、max 模式 12 分）。新点：列「歌名-歌手」反序拆分；10A 雨妈/包妈 合报+投票 50% 折算（×2 还原）、苏妈/晕妈/麦妈 未投票 70% 折算、混淆票可再投；10B 匿名多身份（匿名1 选送+投票、匿名2 仅观众投票）经 `number_anon.py` 续编为 匿名#5/#6；4 混淆田/团/雨/猴。
- `number_anon.py` 的 `匿名\d*` 识别覆盖 CSV 的「匿名1/匿名2」；parser `cstr` 对匿名冠军用「一位匿名成员」泛称（summary 不写死临时别名）。

### Fixed
- 季风→季妈(170) 笔误并入。自查：12 分次数交叉核对 424 条 0 不匹配、合报双计入、member/0 含匿名#5、详情页无匿名1/2 残留与控制台报错。

---

## [2026-06-19] — 匿名大妈改为全局编号「匿名#N」

### Added
- `scripts/number_anon.py`（全局、幂等、`--write`）：把具名匿名身份（神妈/隐妈…）按 **(届号↑→场次→同场首现序) 每次出现 +1** 编号为「匿名#N」，改写各届 JSON 的 entry.member/voter/members（members 存 `alias` 供幂等重算）。通用「匿名」（第3/4届真正无人认领）不编号。当前：ed8 神妈=匿名#1(8A)/#2(8B)、ed9 神妈=匿名#3(9A)/隐妈=匿名#4(9B)。

### Changed
- `parse_bv_edition8.py`：改回保留匿名 persona（`ANON_PERSONAS`，不再 `神妈→匿名` 并入通用匿名）→ 重新导入 ed8。
- 因 member 串已是「匿名#N」，详情页/计分板/12分/成员页直接显示，**零渲染改动**；member-render 的 `.mp-bv-persona` 标签现显示「匿名#N」。
- 导入新届 SOP 新增第 5.5 步 `number_anon.py --write`（recompute 之后、gen 之前）。

### Fixed
- 验证：number_anon 幂等、ed8/ed9 JSON 无 神妈/隐妈 残留、详情页显示匿名#1–#4、member/0 各条带 persona 标签、12 分交叉核对 385 条 0 不匹配、预览无报错。

---

## [2026-06-19] — Barvision 第九届导入（2020，A/B 两组）+ 多身份匿名 / max 模式 12 分

### Added
- `scripts/parse_bv_edition9.py` → `data/barvision/barvision-2020/regular-09.json` + 薄壳 + BUILT_EDITIONS Ⅸ。本届无规则书、折算规则多不可考（小分为任意小数，按原始记录呈现，总分为权威 score）。
- **多身份匿名**：9A 神妈、9B 隐妈 均归「匿名」(id 0 unclaimed)，但保留各自别名 + `persona` 标签区分（member/0 合并展示、详情页显别名链 /0）。`gen_member_pages` 路由 unclaimed 身份进「匿名」桶 + persona；`member-render.js` 新增 `.mp-bv-persona` 标签。
- **max 模式 12 分**：本届 12 分 = 每位投票人投票列中数值最高的正式曲（混淆不计）。parser 存 `votes.voters[].top=eid`；`bv-results-render.js`（计分板金标 + twelveBlock）与 `gen_member_pages`（twelve）按 top 统计，向后兼容（无 top 走 points==12）。
- 9A 奶妈/雨妈 合报 + 投票 50% 折算（计分板 ×2 还原显示）；9B 晕妈未投票其歌 70% 折算。

### Changed
- `bv-results-render.js` `rulesBlock`：`if(r.niche_standard)` 加 `&& .length`（空数组不再渲染空「要求」行）→ ed9 rules `{}` 正确跳过赛制板块。
- recompute(0 变化) + gen_member_pages + gen_bv_editions_index（第九届 roster 20 人）。

### Fixed
- 自查：eid OK、12 分次数交叉核对 385 条 0 不匹配、合报双计入、member/0 含神妈/隐妈、详情页预览无报错。

---

## [2026-06-19] — Barvision 2026 附加赛改名（海选突围赛 / 外卡突围赛）

### Content
- `barvision/2026/events.html` + `index.html`：阶段一「附加赛资格赛」→「海选突围赛」（含「资格赛胜者」→「海选突围赛胜者」）；阶段二单独的「附加赛」（正赛/外卡轮）→「外卡突围赛」（含直播名「Semi-Final 暨外卡突围赛」、「认可票·外卡突围赛」、晋级规则等全部约 10 处）。两页已无「附加赛」残留；通用「参赛资格/资格审查」保留。CLAUDE.md #112 记录新旧名映射。

---

## [2026-06-19] — 详情页折算注释语句通顺化（全届）

### Changed
- 检阅并改写各届计分板「注：」折算说明，确保语句通顺、符合中文语法（改 parse 脚本 + 重跑）：
  - ed8 B：「最终得分（Total）为折算后」→「…为折算后分数」；「四人可分别投票但」→「…可分别投票，但…」。
  - ed7 B/C：消除嵌套括号「（苏妈（原始总分 80）…）」→「（苏妈原始总分 80、蛋妈原始总分 47）」；「选送歌曲但」→「选送了歌曲却」「按总分 70%」→「按总分的 70%」。
  - ed5 C / ed4 A：「选送歌曲但」→「选送了歌曲却」；ed4「计分按 50% 折算」→「其投票按 50% 折算计入各曲得分」。
- 修复：重跑 ed4 parser 曾把 #141 手工重写的叙事版 summary 覆盖回旧版 → 已将重写版同步进 `parse_bv_edition4.py`（防再覆盖）。仅 note/ed4-summary 变动，名次/分数/成员页 0 变化。

### Style
- 生成文本标点规范（#141）：ed3 rules「混淆曲」、ed4 rules「混淆项」的方角引号 `「」` → 中文全角双引号 `“”`（JSON + 对应 parser 同步）；intro 备稿 md 约定说明内引述术语的 `「」` 同改 `“”`（仅「不用『「」』」举例处保留）。data JSON 已无 `「」`。

---

## [2026-06-19] — Barvision 第八届导入（2020，A/B 两组）

### Added
- `scripts/parse_bv_edition8.py`（两 CSV）→ `data/barvision/barvision-2020/regular-08.json`；薄壳 `barvision/2020/regular-08.html`；`barvision.html` BUILT_EDITIONS 加 Ⅷ。仅 A/B 两组（无 C）；歌曲列「艺人 - 歌名」拆分、语种由 CSV 提供；混淆仅 8A 2 首。
- **神妈 = 匿名大妈**（神妈/隐妈/神隐妈→「匿名」id 0 unclaimed）；本届匿名含正式曲（Deafheaven 8A#10、Peggy Gou 8B#3 + Foxing 混淆），归档进 `member/0.html`。
- **8B 合报 + 50% 投票折算**：雨妈/兔妈 合报 Foals — Exits、包妈/泰妈 合报 Sylar — All or Nothing；4 人可分别投票但投票 ×50%（CSV 已半值）。score=含半值各票和（带 .5 小数）；`votes.points` 存折算前 12 分原始版（计分板显原始分、Total 显折算后、加注）；排名按小数比较、显示四舍五入。复用 ed5/ed7 折算渲染模式，零渲染改动。

### Changed
- `scripts/gen_bv_editions_index.py`：roster/成员变动跳过「匿名」/unclaimed（避免匿名正式曲误入名册）。
- `recompute_bv_ranks.py --write`（ed8 0 变化）+ `gen_member_pages.py` + `gen_bv_editions_index.py`（第八届 roster 22 人）。

### Fixed
- 导入后自查：eid 全 OK、raw 全 == 分数、12 分次数交叉核对 350 条 0 不匹配、详情页预览无报错。8B 布妈行 X妈 列脏字符 `·` 按 0 处理。源 CSV typo 修正（`TEXT_FIX`）：`Cali Y EI Dandee → Cali Y El Dandee`。

---

## [2026-06-19] — 动画/布局微调（详情页 + 成员页 + barvision.html）

### Fixed
- **详情页投票详情段入场动画逆序**：`section()` 的 body 块为 `.section__inner` 直接子节点，触发 style.css 全局 `.fade-up:nth-child(2..6)` 延迟泄漏；child 7（12 分表）无规则→延迟 0s 最先淡入，注/12 Points（child 5/6，.4/.5s）反而落后 → 逆序。注入 `.bvr-sec .section__inner > .fade-up{transition-delay:0s}` 清零（直接子选择器不动 header 错落），改由 IO 按滚动位置自上而下触发。子标题（Scoreboard/12 Points）+ 两处滚动提示补 `fade-up`；`updateScrollHints` 显示提示时 `toggle('visible')` 令其淡入。
- **手机端 barvision.html 娱乐版竖排**：`@media (max-width:465px)` 把 `.bv-unplugged-grid` 误设为 `1fr` → 4 卡竖排。改回 `repeat(4,1fr)`（仅 @media 内，桌面零影响）。

### Style
- **成员页吧视图例归组到表格**：`.mp-bv-legend`（场次代码注释）是参赛表脚注，原 fade-up 延迟 `.3s` 几乎与走势图 `.32s` 同时。改图例 `.28s`（紧跟表格 `.25s`）、走势图 `.42s`（拉开），`margin-top:14px→8px` 贴紧表格。

---

## [2026-06-19] — Barvision 第七届导入（2020，A/B/C 三组）

### Added
- `scripts/parse_bv_edition7.py`：解析 7A/7B/7C 三 CSV → `data/barvision/barvision-2020/regular-07.json`。本届新数据特征：① 列布局每组不同（7A 无「最终得分」列；7B/7C 有），用列名 `index()` 通用定位；② 70% 折算用「最终得分 < raw×0.95」检测（不靠"是否在投票列"，因 7C 蛋妈未投但未折算）——7B 苏妈/蛋妈、7C 鹿妈；③ 7C「最终得分」带支持率小数（83→83.1 等），按用户决定**丢弃、总分取整数票数和**，名次交全局 `recompute_bv_ranks.py`；④ **联合投票人「雨&布」**登记为 `雨妈/布妈`(Jury)，且 Belong to You 改登记为 雨妈/布妈**合报**（计入两人吧视）；⑤ feat 规范化 `(ft.X)→(feat. X)`；混淆仅 7A 3 首。
- 薄壳 `barvision/2020/regular-07.html`；`barvision.html` BUILT_EDITIONS 加 Ⅶ（VII 卡本就有）。

### Changed
- 重跑 `recompute_bv_ranks.py --write`（ed7 2 条平局变化：A 组 音妈/奶妈 同分 48 按给分人数打破）+ `gen_member_pages.py` + `gen_bv_editions_index.py`（第七届 roster 25 人）。

### Fixed
- 导入后自查：eid 全 OK、raw 全 == 总评分、12 分次数交叉核对 308 条 0 不匹配；详情页预览无控制台报错。
- 源 CSV typo 按用户核对修正（`TEXT_FIX` 表）：Decoraion→Decoration、Ben Haziewood→Ben Hazlewood、Talerich-Conquistas→Conquistas、The Rubens, Vic Mensa→The Rubens & Vic Mensa。

### Style
- **合报单曲「合报」标签（全局，#147）**：联合选送单曲（member 含 `/`）在结果概览（`bv-results-render.js`）和个人主页参赛表（`member-render.js`）歌名后加「合报」标签，样式同「混淆」、颜色改 `--clr-text-3`。`gen_member_pages.py` 聚合新增 `joint` 字段。命中 ed4「Jump Jet」+ ed7「Belong to You」共 4 条记录。

---

## [2026-06-19] — 第五/六届赛制规则补全（据官方报名总则 docx）

### Content
- 据 `第五届吧视报名总则…docx` / `第六届吧视报名总则.docx` 补全两届 `rules`（submission/niche_standard×5/format/voting，替换原占位）：三组小众/中众/大众阈值表（云村/Spotify/YT/榜单）、lead/feat 限制、混淆项名额（五届每组 2 个 / 六届 AB 各 2 个·C 不设）、投票（五届 Top10 / 六届 AB Top12·C Top10）、选送须投票否则取消资格。
- 改 `parse_bv_edition5/6.py` 的 rules → 重跑 parser + `recompute_bv_ranks.py --write`（名次不变，10 条仍为既有平局结果）。

---

## [2026-06-19] — Barvision 第六届导入（2020，A/B/C 三组）

### Added
- **第六届（2020）赛果**：`parse_bv_edition6.py`（三 CSV）→ `data/barvision/barvision-2020/regular-06.json`（2020 起新目录）；薄壳 `barvision/2020/regular-06.html`；barvision.html BUILT_EDITIONS 加 Ⅵ。
- 本届格式：歌曲列「艺人 - 歌名」合并（拆分）、语种由 CSV 提供、6A 空缺用 0（视无票）、无折算。混淆曲 6A/6B 各 2 首。

### Verified
- 22 成员全解析（新增威妈/鹿妈/蛋妈/奶妈/嘟妈在册，柠檬/绿萌归一）；recompute 4 条平局变化；ed6 12 分核对 53 条 0 不匹配；详情页/成员页零渲染改动。

### Docs
- CLAUDE.md #145；BARVISION_MEMBER.md（已导入届次 + 解析脚本 + 年份目录约定）。

---

## [2026-06-19] — 走势图特例：同选送者正式+混淆名次相同 → 外环

### Changed（`member-render.js` 走势图）
- 新增特例：同一选送者「1 正式 + 1 混淆」名次相同（同 X 同 Y，一~五届仅 5C 雨妈双第一）→ **实心点(正式)不变 + 外套混淆圆环** `.mp-bv-trend__shadow-ring`（r6.5/`--clr-text-4`/fill none），tooltip 两行（正式 / 混淆）。取代旧的「同一首歌内嵌空心圈」逻辑（实际无同歌案例，描述已修正）。

### Docs
- CLAUDE.md #138、BARVISION_MEMBER.md §五.5 更新该特例描述。

---

## [2026-06-18] — 修复 12 分次数 / 计分板（votes.points 键混合）

### Fixed
- **成员页 12 分次数对三四届恒为 0**（如包妈 3A 第一名应 1 显示 0）：`aggregate_barvision` 用昵称查 `votes.points`，但三四届已改 `eid` 键。改为「`eid` 优先、回退昵称」取键。
- **第一、二届详情页计分板矩阵分数格全空**：`bv-results-render.js` 用 `v.points[e.eid]`，而一二届无 `eid`（按昵称键）。`votingMatrix`/`twelveBlock` 两处改 `e.eid != null ? e.eid : e.member` 回退。
- 已重跑 `gen_member_pages.py`；全量核对 143 条记录 twelve 与 JSON 0 不匹配；ed1 矩阵恢复（190 格有值 / 19 个 12 分）。

### Docs
- CLAUDE.md #140（记录 `votes.points` 键混合的通用取键规则）。

---

## [2026-06-18] — 名次 Eurovision 平局规则（全局）+ recompute_bv_ranks.py

### Added
- `scripts/recompute_bv_ranks.py`：按 Eurovision 平局级联（① tele↓ ② 给分人数↓ ③ 12/10/8…分布↓ ④ running order↑）在各届 JSON 上重算正式曲名次（幂等、`--write` 落盘）。导入 SOP 新增第 5 步必跑。

### Fixed / Changed
- 对一~五届应用，10 条名次变化：ed5 三组同分互换（73/64/76，均判据②给分人数打破）+ ed2 SF Contagious/The Feeling（49 同分）+ **ed2 SF 修正旧错**（Per Sempre 71 分原被错排在 Part Of Growing Up 70 分之后 → 纠正 #8/#9）。
- 重跑 gen_member_pages：10 条 JSON 与成员页名次一致；幂等校验 0 变化。

### Docs
- CLAUDE.md #144；BARVISION_MEMBER.md（rank 字段说明 + SOP 第 5 步）。

---

## [2026-06-18] — 详情页计分板/结果概览渲染规则（全局）

### Changed（`bv-results-render.js`，所有届详情页生效）
- **计分板小分 0 不显示**：仅计分板每格小分(`.pt`)隐藏 0；计分板 Total/Jury/Tele 列与结果概览所有列的 0 照常显示。
- **Tele 列隐藏**：某场 tele 投票人数=0 时，计分板 + 结果概览的 Tele 列整列隐藏（表头+单元格+计分板 `.st` 冻结列）。
- **计分板默认排序改为结果概览名次顺序**（正式曲 total↓/同分 tele↓ 在前，混淆曲一律排其后、内部按总分降序），投票人列按官方曲名次重排 → 自投格沿主对角线（原先按投票人列序、显得无序）。
- 术语约定记入 CLAUDE.md #143：计分板=Scoreboard / 结果概览=Results / 12 分=12 Points。

### Docs
- CLAUDE.md #143。

---

## [2026-06-18] — Barvision 第五届导入（A/B/C 三组）

### Added
- **第五届（2019，A 小众 / B 中众 / C 大众 三组）赛果**：`parse_bv_edition5.py`（三 CSV）→ `regular-05.json`；薄壳 `barvision/2019/regular-05.html`；barvision.html BUILT_EDITIONS 加 Ⅴ。
- **混淆再投机制**：投混淆曲的票可由投票人等额再投一正式曲（原始矩阵已含再投票，正式曲分=列和直接读）。
- **70% 折算**：选送却未投评委票者（5C 麦妈/X妈/草妈）其曲总分×70%；Jury/Tele 显原始票、总分折算，计分板注释写原始总分（89/41/26）。
- **`OVERRIDE` 文本覆盖**：源 CSV 标题损坏（Excel `#######`、gbk 丢重音/特殊字符），按 CSV 行序整表覆盖 artist/song/language（用户核对版，含重音/feat 规范/多语言空格分隔）。

### Fixed
- 5B「Sakima — God Fearing Men」总分 55（漏加）→ 按各票和修正为 58。

### Verified
- 25 成员全解析；ed5 12 分次数交叉核对 74 条 0 不匹配；详情页三组矩阵/折算注释/混淆曲渲染正常。**零渲染/布局改动**（数据驱动，SOP 兑现）。

### Docs
- CLAUDE.md #142；BARVISION_MEMBER.md 已导入届次/解析脚本清单/第五届新机制。

---

## [2026-06-18] — 第一~四届 intro 重写 + 导入 pipeline 文档固化

### Content
- 重写第一~四届详情页 intro（hero `summary`）：叙事风格、精简通顺、只点亮点+冠军（多组写各组冠军、不写亚季军/折算/联合选送等过程细节）。术语统一「混淆单曲」、引号用中文双引号。

### Changed
- `bv-results-render.js` `matchEng` 改 map 形式并补全 `C→GROUP C`/`E→ENTERTAINMENT`（原仅 SF/GF/A/B）——第 5 届起 C 组导入时 section 前缀不再退化为裸字母，未来导入零微调。

### Docs（导入 pipeline 固化，目标：导入后续届次零渲染/布局微调）
- `BARVISION_MEMBER.md §二` 重写为完整 SOP：**JSON schema 硬契约**（强调 `eid` + eid 键 points，根除 #140 类 bug）+ 机械步骤 + 导入后自查清单（校验命令 + 人工核对项）+ 零布局改动原则；§四补 `BV_SLOTS` 必查常量、修正 `LATEST_ED` 走势描述（latest-pink 现按成员最近场次）。
- `edition-intros-2023-2025.md` 增「Intro 文案约定」节；CLAUDE.md #141 + #135 指针指向权威 SOP。

---

## [2026-06-18] — 走势轴标签字号微调 + 手机端导航按钮箭头/文字成组

### Changed
- 走势图 X/Y 轴标签字号最终定为 **12px**（上一版 11px 偏小）。
- 详情页上/下届导航按钮**手机端**：`justify-content` 由 `space-between` 改 `center`，箭头与文字成组居中（gap 8px），文字紧贴箭头（原先各贴按钮两端）。

### Docs
- CLAUDE.md #139（补充）；BARVISION_MEMBER.md §五.5。

---

## [2026-06-18] — 计分板手机端文字膨胀修复 + 联合投票人表头简化 + 走势轴标签字号

### Fixed
- **计分板「Jury Vote」在真机手机端比「Tele Vote」字号大**：移动端 `text-size-adjust` 文字自动膨胀所致（宽 colspan 被放大）。`table.bvr-mtx`/`table.bvr-tbl` 加 `text-size-adjust:100%` 禁用（桌面/预览不触发，故 computed 测得一致查不出）。

### Changed
- 计分板联合投票人横向表头「麦妈/苏妈」→「麦/苏」（去各段末尾「妈」，仅含 `/` 的联合列；单人保持全名）。
- 走势图 X/Y 轴标签字号 13→11px（桌面手机两端各 -2px）。

### Docs
- CLAUDE.md #139；BARVISION_MEMBER.md §五.5 轴标签字号。

---

## [2026-06-18] — 详情页收尾微调 + 混淆配色令牌化 + 成员页走势图重写

### Added
- **令牌 `--clr-shadow-bg`**（`#0c0a18`）：混淆（影子）单曲行背景，详情页结果表/手机冻结列/成员页吧视表统一引用（不透明实色，冻结列不漏光）。
- **令牌 `--clr-text-4`**（`#6a6488`，文字阶梯最弱化）：用于首页 hero 下滑提示（`.hero__scroll-hint`/`.scroll-hint-text`/`.scroll-chevrons`）+ 混淆单曲字体色 + 走势图混淆元素。

### Changed
- **成员页历届排名走势图重写**（`member-render.js`，详见 `BARVISION_MEMBER.md §五.5`）：全局场次轴 `BV_SLOTS`（缺席留位+竖虚线、跨缺席不连线）、占满容器全宽（场次多才横向滚动）、同 X 多 Y（正式实心 r4 / 混淆空心 r3 fill 背景色 / 同曲同心圆）、连线实线 `--clr-accent-glow`·混淆段虚线、点配色 金(夺冠)>粉(最近)>蓝、`#N` 同名次去重+弱化 10.5px `--clr-text-4`、图例（SVG circle 与图内逐项一致）、自建 tooltip（桌面 hover 跟随光标右下 / 手机点击）、高度 320。
- **详情页**：`Scoreboard`/`12 Points` 子标题 18px（手机 16px）；「左右滑动」提示格式与「注」一致；混淆曲在 Scoreboard 矩阵内按总分降序、不显示自投斜杠格；12 Points 混淆选送者保留斜体+弱化 `--clr-text-3`。
- 混淆单曲在结果概览/个人主页记录的字体色（整行含名次/语种/标签）统一 `--clr-text-4`。

### Docs
- CLAUDE.md #138；BARVISION_MEMBER.md §五.5 走势图整节重写、§六 手机端说明更新。

---

## [2026-06-18] — Barvision 详情页第二批微调（混淆曲小分串台修复等）

### Fixed
- **混淆曲小分串台**：第四届同名成员同组兼有正式曲/混淆曲时，`votes.points` 按昵称作键导致小分串台。改为按条目 `eid` 作键（矩阵/12分均按 eid 查分）。
- **手机冻结列漏光**：混淆行半透明底色改纯深灰实色 `#181820`（不透明）；手机冻结表头底色由 `--clr-bg` 改 `--clr-surface`（与滚动表头一致）。

### Changed
- 混淆曲位置：**结果概览交错**在名次位置（`N*`）；**Scoreboard 矩阵一律排在最后**（按分降序）；12 分表含混淆曲。
- 混淆行背景纯深灰 `#181820`（原偏亮的白色叠加）。
- 泰妈折算注用 memberLink（桌面 @泰坦crazy / 手机 泰妈）。
- 「混淆」标签防中间断行；成员变动表状态/成员字号统一为表头 11px；桌面 Scoreboard 溢出时显示「左右滑动」提示。
- 语种「器乐」统一为「纯音乐」。

### Docs
- CLAUDE.md #137。注：本批仍待进一步微调（下一会话）。

---

## [2026-06-18] — Barvision 第四届导入（A/B 双组）+ 投票折算/联合选送

### Added
- **第四届（2019，A 小众 / B 中众）赛果**：`parse_bv_edition4.py` 读两 CSV → `regular-04.json`；薄壳 `regular-04.html`；BUILT_EDITIONS 加 Ⅳ。
- **泰妈 50% 折算（A 组）**：泰妈仅给前五喜好，计分 50% 折算。score 取 CSV 总分、tele=score−jury；展示四舍五入到整数。说明与「斜体昵称」注合并渲染在**计分板矩阵后**（注1/注2）。
- **冻结窗格**：计分板矩阵桌面+手机均冻结「选送者+Total+Jury+Tele」；结果概览仅手机冻结「名次/选送者/歌手」前三列（横滑固定，奖牌/混淆行冻结列补纯色底）。
- **混淆曲选送者**在计分板/12分：桌面显 @handle、手机显昵称「X妈」（斜体弱化）；有已知选送者显真名、匿名显「匿名」。同并排名次的多首混淆曲按分连续编号（23*/24*）。
- **联合选送「麦妈/苏妈」**：合报曲计入两人吧视、两人各入名册；结果表内两人上下排列（`.bvr-joint`）。
- 第四届混淆曲（rank「混淆N」/报名者「X2」，均有已知选送者）；`split_song` 兼容 en-dash 分隔。

### Docs
- CLAUDE.md #136。

---

## [2026-06-18] — Barvision 第三届导入 + 混淆曲/未认领伪成员

### Added
- **第三届（2019，A 小众组 / B 中众组）赛果**：`scripts/parse_bv_edition3.py` 读两 CSV → `data/barvision/barvision-2019/regular-03.json`（双 match A/B，校验和 42 行全过）；薄壳 `barvision/2019/regular-03.html`；barvision.html BUILT_EDITIONS 加 Ⅲ；`matchEng` 加 GROUP A / GROUP B。
- **混淆曲（is_shadow）体系**：非正式、不计排名。结果概览=灰行弱化（不斜体）+「混淆」标 + 名次 `N*`（DM Mono）+ Jury/Tele `opacity:.65`、总分 `--clr-text-2`；Scoreboard 矩阵 + 12 Points **均纳入混淆曲**，选送者显示**斜体昵称**（已知者真实昵称/匿名者「匿名」），矩阵后附注「斜体昵称为混淆歌曲选送者」；成员页混淆行名次 `N*`、统一 `--clr-text-3`、走势含混淆点。overview 12 分次数排除混淆。Jury/Tele：有正式曲=Jury，仅混淆/未报=Tele。
- **名次打破规则**：正式曲 总分↓、同分观众分↓（欧视并列规则）；混淆曲并排名次（如 Omar 5、Daughtry 18）。
- **「匿名」伪成员**（涵盖①正式单曲匿名②混淆单曲匿名）：id 0、`member/0.html` 独立详情页（大名弱化、文案「匿名参赛歌曲」）；member.html **`.ml-card--anon` 弱化卡**（仅 Barvision 筛选显示、置尾、不计数）；`gen_member_pages.py` 生成 0.html（移除旧 `匿名` skip）、`gen_bv_editions_index.py` roster 跳过 is_shadow。

### Changed
- 第三届已聚合进真实成员页（如包妈：A 组 Bob Moses 冠军 + B 组 Daughtry 混淆曲）；参赛大妈 20 → 26。

### Docs
- CLAUDE.md #135、DESIGN.md §6.7、BARVISION_MEMBER.md §7 记混淆曲/匿名/Jury-Tele/名次规则。

---

## [2026-06-18] — 导航/页眉/高亮交互精修

### Fixed
- **BBL 亮点高亮「闪黑」**：旧淡出强制条目 `background:transparent` 过渡 0.8s，顶掉条目自身背景（奖牌渐变 / surface 底）露出深色页底 → 闪黑 + 末端跳变。改为叠加层伪元素 `.chart-item::after` 只过渡 `opacity 0.4s`，淡入/淡出都平滑、不触碰条目背景、无黑。
- **footer logo 点击区过宽**：`.footer__logo` 加 `width:fit-content`，点击跳首页热区仅限 logo+字标（原撑满整列含右侧空白）。桌面/手机一致。
- **详情页上下届导航离正文太远**：`.bvr-nav` 加 `margin-top:calc(48px - var(--gap-xl))` 抵消上一 section 底部 padding，距正文 148px → 48px（桌面/手机一致）。

### Changed
- **成员页页眉**：三级面包屑 → `.mp-eyebrow`「← Members」（与 barvision 详情页 eyebrow 统一，violet-light、`/member.html`）。
- **详情页导航·手机端**：改 `grid` 两等分，单按钮（仅上一届或仅下一届）占半边、缺届占位 `.bvr-nav__spacer` 占住另一半。
- **概览卡**：「夺冠场数」→「冠军场数」；括号 `(次数)`/混淆曲 `(n)` 与大数字间距改用 `margin-left:3px`（flex 折叠字面空格，须用 margin）。
- **吧视徽章间距**：`.mp-bv-badge` `margin-left` 桌面 9→7px、手机 7→5px。

### Docs
- CLAUDE.md #109（eyebrow 映射加 member）+ #134（本批技术要点）；DESIGN.md §6.7 导航补间距/手机半边；BARVISION_MEMBER.md 概览卡更新。

---

## [2026-06-18] — 详情页计分板/导航修复 + 成员页创始届徽章 + 多艺人格式

### Fixed
- **Scoreboard 对角线**：第二届计分板因 `m.votes.voters` 评委/观众交错（Excel 原始列序），分组表头错列 + 自投格不成对角线。`votingMatrix()` 渲染时先稳定排序 voters（评委前/观众后），第一届为 no-op。SF(16)/GF(19) 对角线全对齐。
- **上下届导航对齐**：`.bvr-nav` 水平内边距 `0` 覆盖了 `.section__inner` 的 `var(--gap-md)`，使按钮戳出正文边缘 32px（桌面）/20px（手机）。改为 `var(--gap-md)`，桌面两届均与内容对齐。
- **导航移动端**：改竖排满宽（`flex-direction:column`），缺届占位 `<span>` 加类 `bvr-nav__spacer` 隐藏，按钮内 `space-between` 把箭头推到外缘。

### Changed
- **Scoreboard 小分字体 +1px**：`.bvr-mtx td.pt`（含金色 12 分）显式 `font-size:12px`；Total/Jury/Tele（13px）不变。
- **12 Points 数字配色**：`.bvr-12__n` `--clr-text` → `--clr-text-3`（与结果表「4 名及以后」名次同色）。
- **个人主页吧视徽章**：数字色全届统一 `--clr-text`；**创始届（第一届）** 五边形染金 `--clr-gold` + 金色光晕 + `mpBvFirstGlow` 3.2s 呼吸动画（`prefers-reduced-motion` 关闭），class `mp-bv-badge--first`，title 加「· 创始届」。

### Content
- **多艺人合作曲格式修正**（按新规范 #15）：reg-01 Calipso 补 `(with Dardust)`；reg-02 六条 `/` 堆叠艺人改为双 lead `A & B` / feat 进歌名（`Agon & The Gitas`、`The Brummies & Kacey Musgraves`、`Röyksopp & Man Without Country — In the End (Lost Tapes) (feat. Susanne Sundfør)`、`VanJess — Through Enough (feat. GoldLink)`、`Little Simz — Selfish (feat. Cleo Sol)`、`Judah & the Lion — Pictures (feat. Kacey Musgraves)`），正字法修正。重跑 `gen_member_pages.py` + `gen_bv_editions_index.py`。

### Docs
- CLAUDE.md #15 补多艺人合作曲格式规范、#133 记本次精修；BARVISION_MEMBER.md 补创始届徽章特殊态。

---

## [2026-06-17] — Barvision 详情页：成员变动 + 上下届导航 + header/TOC

### Added
- **成员变动 section**（详情页「赛制」后）：对比上一届 + 历史届 → 继续参赛 / 首次加入 / 回归（间隔后回归，连续参赛不算）/ 退出；@成员链接 + 人数。第一届全首次 14；第二届继续 13 / 首次 6 / 退出 1。状态色：继续蓝 / 首次紫 / 回归金 / 退出粉。
- **上一届 / 下一届导航**（详情页底部按钮）：默认整体灰（text-3），hover 整组变粉红 `--clr-red-light` + 边框粉；届名 13px。
- **届次索引** `scripts/gen_bv_editions_index.py` → `data/barvision/editions-index.json`（各届参赛名单 roster + 序列），供成员变动对比 + 上下届导航。**改/加任意届数据后须重跑**。

### Changed
- 详情页多场 header：场次段名用英文 **SEMI-FINAL / GRAND FINAL**（section-label），title 保留「结果概览/投票详情」。
- 详情页 TOC：多场用「半决赛/决赛 + 结果概览/投票详情」。
- JSON `source` 省略文件格式（如「来源：第二届贴吧歌曲大赛策划概念书」）。

### Docs
- CLAUDE.md #132 + DESIGN.md §六 补成员变动 / 导航 / header / `editions-index` 约定。

---

## [2026-06-17] — 吧视走势图微调 + 总分取整 + 新令牌

### Changed
- **历届排名走势图**：坐标点两端各内缩 8%（不再贴边，标签随点内移；网格线仍满宽）；连线改用新令牌 `--clr-accent-line`（淡蓝、宽 2px）。
- **总分四舍五入**：详情页 `bv-results-render.js` 的 `fmtScore()` + 成员页参赛表总分列统一 `Math.round` 显示（决赛含加成小数如 140.44 → 140），JSON 数据保留原值。

### Added
- 新令牌 **`--clr-accent-line: rgba(0,180,255,0.24)`**（介于 `--clr-accent-dim` 0.12 与 `--clr-accent-glow` 0.30，专给走势连线）。

### Style
- `style.css?v` **3.0.9 → 3.0.10**（index / bbl / bbl·hof / styleguide，因 `:root` 新增令牌）。

### Docs
- `BARVISION_MEMBER.md` §五 走势图准则补充（点内缩 8% / 连线 `--clr-accent-line` / 总分四舍五入）。

---

## [2026-06-17] — Barvision 第二届赛果导入

### Added
- **第二届（The 2nd Barvision，2019）完整赛果**：`scripts/parse_bv_edition2.py` 解析 `第二届.xlsx`（`2SF` 半决赛 16 首 + `2GF` 决赛 19 首，一体逐票矩阵）→ `data/barvision/barvision-2019/regular-02.json`。
  - 半决赛分数 = 评委会票（选送者互投）+ 评审团票（观众 5 位），**16 首全部交叉校验通过**；决赛分数取 Excel 最终值（含半决赛加成、逐人公式不同，直接取用），jury/tele 为逐票和（观众=泰妈+草妈 2 位，自加总）。
  - 22 位成员全部解析（含麦妈 130 `@Tandiny`/泰妈 131/音妈 770/瑞妈 135/院妈 326/草妈 141）；`院长→院妈`、`瑞玛→瑞妈`、`绿萌→萌妈`、`淋檬→柠妈`、`肥屎→肥妈` 归一。
- `barvision/2019/regular-02.html` 薄壳详情页（**SF + GF 两场**，`bv-results-render.js` 已支持多场）；`barvision.html` `BUILT_EDITIONS` 加入 Ⅱ（卡片可点）。
- 重跑 `gen_member_pages.py`：吧视记录成员 **14 → 20**，`member-bv-index.json` 更新；member.html 届数下拉新增「第二届」。
- 补充 **35 首歌曲语种**（用户提供，详情页结果表语种列；非英语：意大利语 / 俄语 / 冰岛语 ×2 / 葡萄牙语 / 中文），`parse_bv_edition2.py` 加 `LANG` 映射；并清理 Excel 的不间断空格 `\xa0`（歌名/歌手归一）。

### Docs
- `BARVISION_MEMBER.md` 增「已导入届次」+ 第二届(`parse_bv_edition2.py`/SF+GF/GF 加成总分) 处理说明。

---

## [2026-06-17] — Barvision 成绩进成员页「吧视」板块 + member.html 徽章/筛选

### Added
- **成员页「吧视」板块**：`gen_member_pages.py` 聚合各届 JSON → 注入 `MEMBER_DATA.barvision`（概览 + 参赛表 + 12 分次数），`member-render.js` `bvSection()` 渲染（概览 stat 卡 + 参赛表，名次金银铜 / 届次链接详情页 / 总分 / 12分）。
- 新输出 `data/barvision/member-bv-index.json`（space_id→吧视摘要）供 member.html。
- **member.html**：Indienation 后加 **Barvision 筛选**（+ 届数子筛选「全部届/第N届」）；参赛大妈大名后加 **logo 徽章**（活跃实心 `logo_center.png` / 不活跃空心 `logo_hollow.png`，`logo_hollow.png` 新增）。
- 第一届 14 位选送者已有吧视记录；活跃判定 `BV_ACTIVE_SINCE_YEAR=2024`（现仅 2019 数据 → 全部空心，待确认规则）。

### Changed
- **成员页「吧视」板块大幅精修**（均在 `scripts/member-render.js`）：
  - 大名右上角届数徽章改 **inline SVG**（`logo_hollow.svg`，`fill:currentColor`）：每届一个、数字=届号、logo 色按年（`BV_YEAR_COLOR`，2019 创始=`--clr-board`）、第一届数字 `--clr-board` 其余白、两位数自动缩放居中。
  - 概览卡：「最好名次」→「最佳名次」、「参加场数」→「参与场数」；flex 居中；最佳名次前三金银铜 + 重复名次加 `(次数)`；夺冠场数金色（0 弱化）；计数 0 / 最近参赛非最新届 → `--clr-text-3` 弱化；「第 N 届」加空格 + 含中文值用 DM Sans。
  - 参赛表合并为**可点表头排序表**（名次/届次/总分/12分，双三角指示，默认届次升序）；同届场次按 `A→B→C→SF→GF→E`；场次无组别显 `-`；歌手移到歌名前、二者颜色互换；数字统一 DM Sans；前三金银铜；列宽（歌手 400 固定 / 歌名吸收）+ 表头对齐修复。
  - 新增**场次代码图例**（表格后、走势前，复刻 hof.html）。
  - 新增**历届排名走势图**（响应式 SVG：viewBox=实际宽 1:1、resize 重绘、字恒 13px、X 自适应、手机完整不横滚）：每场一点、X 标签届/组、Y 倒置、第一名金 / 第16届 `--clr-red-light` / 混淆空心点+虚线、点上 `#名次`、hover tooltip「歌手 — 歌名」。
- `member.html` Barvision 筛选按钮改蓝 `--clr-accent` + 届数下拉框（替代二级按钮行）。

### Style
- **场次图例文案统一**：成员页与 `barvision/hof.html` 均「场次代码」→「注」、去句号；括号补充 `（如 7A = …）` 包入 `.bv-legend__ex` / `.mp-bv-legend__ex`，**手机端隐藏**。
- **响应式细节**：手机端参赛表歌手/歌名各 150px（`table` 改 `min-width:588px`）；个人主页徽章手机缩小 15%、`margin-left` 离大名 7px（桌面保持 30×29）；`member.html` 卡片 logo 手机缩小 5%。
- **member.html 筛选按钮**：Barvision 改蓝 `--clr-accent` + 届数下拉框；英文按钮（BarboardLab/Indienation/Barvision）内部文字下移 1px（padding 6/8→7/7），Barvision 按钮 logo 手机端再下移 1px。
- 板块标题 Barvision 加粗。
- **手机端概览卡缩小一档**（数字 26→21px、「第 N 届」20→16px、标签 10px、`grid minmax(72px)`、padding 减），并 `padding:12px 6px 8px` 使内容视觉居中偏下 2px。
- **参赛表表头对齐**：届次由左对齐改为居中（与名次/场次/总分/12分一致；歌手/歌名仍左）；带三角列用 `::before` 占位平衡，表头文字精确居中对齐数据。
- **概览卡内容下移 2px**：桌面端也下移（与手机一致，`padding:15px 10px 11px`）；值区 `.mp-bv-stat__v` 固定高度（桌面 26 / 手机 21）+ flex 居中，使「第 N 届」等 DM Sans 矮值卡的**标签与数字卡水平对齐**（修此前标签不齐问题）。

### Docs
- CLAUDE.md 新增 **#131**（吧视成员页功能：聚合 / 概览 / member.html 筛选徽章 / 活跃判定）。
- 新增 **`BARVISION_MEMBER.md`** — 吧视成员页数据导入流程 + 各组件样式/逻辑速查（为后续逐届录入做准备；含 `LATEST_ED`、`BV_YEAR_COLOR`、`BV_ACTIVE_SINCE_YEAR` 等导入须改的常量）；含图例文案、桌面/手机列宽、徽章尺寸等约定。

---

## [2026-06-16] — 新成员 + Barvision 历届详情页（第一届）

### Added
- 新成员 **野妈 `@Tye`**（space_id 196，标签 村摇欧共体，Bilibili 366510550，暂无 Musictrack）；`gen_member_pages.py` 重跑生成 `member/196.html`，`member.html` BUILT_PAGES 加入 196。成员总数 **118 → 119**。
- **Barvision 历届详情页体系（已建第一届）**：
  - `scripts/parse_bv_edition.py`——读每届 Excel（openpyxl/pandas）→ 每届 JSON；从逐票矩阵交叉校验 jury/tele、昵称变体归一 + members 映射。
  - `scripts/bv-results-render.js`——共享渲染脚本（薄壳 HTML 仅需 `var EDITION_SRC` + 本脚本）；注入 CSS + 渲染全部板块 + 页内 TOC + 交互排序。
  - `data/barvision/barvision-2019/regular-01.json`——第一届完整数据（14 首赛果 + 19 人逐票矩阵 + meta/规则）。
  - `barvision/2019/regular-01.html`——第一届薄壳页。
  - 页面板块（对标 Eurovision wiki + 沿用全站版式）：Hero → 赛制 → 结果概览 → 投票详情（Scoreboard 矩阵 + 12 Points）；右下 TOC 加载即显示。
- **新令牌 `--clr-board-light: #8FBEE3`**（@名 `.member` 专用，比品牌蓝 `--clr-board` 更亮）；全局 `.member` 改用之；styleguide 已记录（Foundation 色块 + Elements「@名 成员提及」条目）。
- 安装 `openpyxl` / `python-docx`（读 Excel / docx）。

### Changed
- `barvision.html` 届次卡片接入详情页链接（`BUILT_EDITIONS` 集合 + `romanToInt` + `editionHref`，已建页面的卡自动可点）。
- `style.css?v` 3.0.8 → **3.0.9**（index / bbl / bbl-hof / styleguide 同步）。
- 详情页三表深度精修（桌面 + 手机）：结果表（Bebas 名次 18px、分数 DM Sans 居中 + 竞赛 #名次、可点排序实心三角、前三 bbl 金银铜、列头 PTS）；Scoreboard 矩阵（评委+观众合并、分组表头、四列 rowspan 合并、粘性选送者列 + `border-collapse:separate` 修漏光、可排序对角线默认序）；12 Points（三列 + Bebas 计数 + 接收者白名 + 评委/观众标签）。
- Calipso 歌手/歌名修正（解析脚本手工修正）：歌手 Charlie Charles / 歌名 Calipso (feat. …)。
- **手机适配**：宽表横滚 + 文字提示 + 隐藏滚动条；@名一律用昵称（X妈 格式）省空间；12 Points 单列对称 padding 块；触屏（`hover:none`）禁用 hover tooltip。

### Docs
- CLAUDE.md 成员数 118 → 119；新增 **#129**（Barvision 历史成绩体系规划）、**#130**（详情页实现 + 本次精修）。
- **DESIGN.md 新增 §六「Barvision 历届详情页 设计 Guideline（桌面 + 手机）」**：页面整体 / 配色 / 三表设计 / 手机通用约定。

---

## [2026-06-09] — 报名表单微调 + Barvision HOF 重构 + 全站调色

### Added
- **Barvision HOF（barvision/hof.html）按 Notion 截图全量补全**：`bv_hof_data.json` 改为富嵌套结构（pioneer + season + records + achievements，各分常规/娱乐）；新增「赛季纪录」section；卡片显示 获奖者@链接 + 歌曲 + 场次徽章，旧纪录以「旧」标 + 划线保留；加场次代码图例。
- 歌曲报名表单新增**「备注（选填）」**字段（随报名邮件发出）。
- 新成员 X妈 `@没有XX不科学`（space_id 195，成员总数 → 118）。

### Changed
- 成员数据修正：xjebs(88) 昵称 X妈 → XX妈。
- 报名表单文案：「提交人」→「提交者」、「微信名」→「微信号」、报名方式「直接内定/本届海选」→「内部选择(内定)/公开选拔(海选)」。
- **全站调色（提升黑底可读性）**：`--clr-text-2` `#8880a8`→`#C2BBDF`、`--clr-text-3`→`#A39BC2`；成员 @名 `.member` 改用榜吧蓝 `--clr-board`（不再偏灰）。
- Barvision HOF 配色按版本区分：常规版=粉 / 娱乐版=紫（`--bv-accent`）。
- `style.css?v` 3.0.5 → 3.0.8（多轮调色累计）。

### Fixed
- Members 卡片「大名+标签」与「大名+小名」等高（桌面 84 / 手机 74）。

### Removed
- **退役 Barvision HOF 旧数据流**：删除 `data/barvision/barvision-record/*.csv`（7 个）+ `scripts/sync_bv_hof_data.py`；改为直接维护 `bv_hof_data.json`。

---

## [2026-06-08] — 成员数据修正 + 设计系统统一（令牌归并 / styleguide 可视化）

### Added
- **设计值审计工具**：`scripts/audit_design_tokens.py`（扫全站颜色/字号/间距/圆角 → `DESIGN_AUDIT.md` + `styleguide-data.js`）+ `scripts/apply_design_tokens.py`（硬编码→令牌批量替换，dry-run / `--write`）。
- **14 个新令牌**写入 `style.css :root`：`--clr-silver/-bronze/-up/-down/-re/-team-cun/-esc/-white/-cta-1~3` + 金银铜 `-tint`；`--logo-*`（fs-en 26 / fs-cjk 12 / gap-cjk 8 / gap-icon 4）；`.footer__name` 类。
- 新成员 X妈 `@没有XX不科学`（space_id 195）。

### Changed
- **Logo 定稿写回 `style.css`**：nav 图标↔字标 gap 5→4、footer 中文名抽成 `.footer__name`、去硬编码改令牌。
- **66 处硬编码颜色 → `var(--token)`**（8 文件，精确 1:1、零视觉变化）。
- `--clr-text-2` `#8880a8` → `#A299C8`；`--logo-gap-cjk` 10 → 8（=`--gap-xs`）。
- **`styleguide.html` 重构**：基础 Foundation 改为**审计数据驱动的可视化**（色块 / 字号样例 / 间距条 / 圆角 / 离散金标 / 移动端青色 📱）；保留 Elements·Logo；色块放大。
- 成员 xjebs（space_id 88）昵称 X妈 → XX妈。
- ticker：补「重声交响」中文主题语；Grand Final 文案改冒号格式。

### Fixed
- Members 卡片「大名+标签」与「大名+小名」等高（桌面 84 / 手机 74）。
- `member/109·132·180.html` 随 CSV 同步（B 站 id / handle 修正）。

### Removed
- 废弃 npm 残留：`node_modules/`（空）+ `package.json`（`{}`）+ `package-lock.json`，并加入 `.gitignore`。
- `styleguide.html` 章节 Sections 层（Navbar 记录）+ 相关 demo CSS。

---

## [2026-06-01] — 歌曲报名通道上线 + 设计系统扩充

### Added
- **歌曲报名通道（`barvision/2026/events.html`，已上线）**：弃用问卷星 iframe，改为**自定义表单 + EmailJS** 直发邮件到 william115zq@gmail.com。
  - 字段：提交人（不校验、仅蜜罐防机器人）/ 联系方式（QQ·微信）/ 报名方式（内定 1 首·海选 2 首，海选名称解锁歌曲②）/ 每首歌：歌名·艺人·发行国家·语种·发行日期（选填，范围校验 2023-07-01~2026-06-30）
  - **localStorage 持久化**（key `barvision2026_submission`）：刷新后自动显示「您已提交报名」+「查看报名详情」回显 +「重新报名」覆盖
  - **三态随时间自动切换**：OPEN 6/1 18:00 / CLOSE 7/20 00:00 / 投票 VOTE1 7/25 22:00；hero 倒计时按阶段接力（开启→关闭→Semi-Final 1+附加赛资格赛投票）；badge 即将开启/已开启(粉色呼吸点)/已关闭；倒计时数字粉色
  - 首页 index.html「歌曲报名」按钮 enable → `#submit`
- **设计系统文档扩充**（`DESIGN.md`）：配色用途地图（含游离色清单）、字号/间距阶梯、中文×Bebas 视觉等大配对、屏幕断点标准（手机768/平板1024/桌面，平板继承桌面）、流体令牌（clamp）标准、Logo 规格、彩色/mono 令牌分组
- **`styleguide.html`**：拆为「精选已确认标准」（建设中，逐项搬入）；原全量自动渲染版 → `styleguide-draft.html`

### Changed
- **`--clr-board`（榜吧蓝 #6F9EC3）tokenize** 为品牌色，全站 `#6F9EC3 → var(--clr-board)`（style.css/archive/bbl/member）
- `:root` 颜色令牌按「彩色 / Mono 黑白灰」分组
- `style.css?v=` 版本号方案改补丁位 `3.0.x`（当前 3.0.5）；约定不自行升版本、升 3.1/4 需确认
- 报名通道开放后续修整：ticker「通道将于→已于 6/1 开启」；**首页赛季卡同步「已开启」态**（season-status「正在进行中」、倒计时改「距关闭还有」目标 7/20、歌曲提交阶段 `.phase__status--live`「正在进行」+ `.phase--active` 增强高亮）；events 报名按钮「提交报名→提交歌曲」、成功页「歌曲提交成功/您/查看报名详情·重新报名(tooltip)/粉色icon」、字段调整（专辑→发行国家+语种、去链接/选送理由、发行日期选填、提交人不再校验）、**歌曲②（海选亚军）全部改选填**（空则不计入邮件）

### Fixed
- 关闭态标题原误显示「即将开启」→「歌曲征集已结束」；open→关闭实时切换未隐藏表单 → 修复
- `CLOSE_DATE` `24:00` 改 `2026-07-20T00:00`（避免部分浏览器 Invalid Date）

### Note
- 本 session 早期 chart-stats 移动端实验经 revert 回退至 `d0aec10`；Logo 真实应用亦回滚，现仅在 styleguide 沙箱（`--sgl-*`）待微调定稿后写回

---

## [2026-05-31] — 设计系统文档化 + 移动端精修 + 版本号方案

### Added
- **`DESIGN.md`**：设计系统单一权威文档——设计令牌、🎨配色用途地图（功能色/各页主题色/成员组色/游离硬编码色清单）、🔤字号阶梯 & 📏间距阶梯（基于真实用值归纳）、DM Sans×Bebas Neue 视觉等大配对（+30~40%）、📱屏幕断点标准（手机768/平板1024/桌面，平板=继承桌面）、组件与中文俗名↔class 速查表、待统一清单
- **`styleguide.html`**：开发用实时组件库（`noindex`、不进导航）——加载真实 `style.css` 实时渲染全局组件 + 令牌/字号间距阶梯/配色可视化；页面专属组件以索引表列出。可作视觉回归基准

### Changed
- **`bbl.html`** 完整榜单 `.bbl-stat` 移动端改为与首页 `.chart-stats` 同款（grid 竖排、去分隔线），stats 列 144→66px、歌名获更多空间
- **`style.css`** `.chart-song__title/artist` 允许换行（去 nowrap/ellipsis）+ line-height 1.2，artist margin-top 4px 补偿间隙（PC/移动端）
- **`bbl.html`** 移动端搜索框 `font-size:16px` 防 iOS 聚焦缩放 + placeholder 12px；提示文字 padding 微调
- **`style.css`** 移动端隐藏首页 scroll-hint（`.hero .hero__scroll-hint` 提特异度）
- **版本号方案**：`style.css?v=N` 改用补丁位 `3.0.x`（禁止自行升版本，升 3.1/4 需确认），当前 `v=3.0.2`

### Docs
- CLAUDE.md #122–126：版本号规则 / DESIGN.md 指引 / 屏幕断点标准 / 阶段三去重工作流 / 设计流程（桌面优先·忽略平板）；设计系统节瘦身为指向 DESIGN.md；文件结构补 DESIGN.md+styleguide.html

### Note
- 本 session 早期的 chart-stats 移动端实验经 `git revert` 整体回退到基线 commit `d0aec10`（保留历史），随后重做为上述方案

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
