# Barboard 设计系统 · 组件与命名速查（DESIGN.md）

> **这份文档干什么用的？**
> 1. **沟通词汇**——你想改某个元素时，先在「命名速查表」找到它的**中文俗名**和 **class 名**，直接对我说「改〈赛季卡〉的配色」「〈统计角标〉再紧一点」，我就能精确定位。
> 2. **复用模板**——做新页面时，从这里查到现成组件的 class，直接套用，不用从零调。
> 3. **去重依据**——文末「待统一清单」记录了"同物多套"的重复实现，供后续阶段三逐个收敛。
>
> 维护约定：新增/改名组件时同步更新本文件。配套还有（计划中的）`styleguide.html` 实时渲染所有组件。
> 当前 `style.css` 版本号：`?v=3.0.2`（改 style.css 须按 [CLAUDE.md #122] 同步 index/bbl/bbl-hof 的 `?v=`）。

---

## 一、设计令牌 Tokens（定义于 `style.css :root`）

### 颜色

| 俗名 | 变量 | 值 | 用途 |
|---|---|---|---|
| 主背景 | `--clr-bg` | `#080812` | 全站底色（午夜蓝黑） |
| 次背景 | `--clr-bg-2` / `--clr-bg-3` | `#0c0c18` / `#10101e` | 分层背景 |
| 卡面 | `--clr-surface` / `--clr-surface-2` | `#141422` / `#1a1a2e` | 卡片/输入框表面、hover |
| 弱边框 | `--clr-border` | `rgba(180,160,255,.14)` | 默认边框 |
| 强边框 | `--clr-border-2` | `rgba(180,160,255,.26)` | hover 边框 |
| 电蓝 | `--clr-accent` / `--clr-accent-light` | `#00b4ff` / `#33c6ff` | 主强调色 |
| 霓虹粉 | `--clr-pink` / `--clr-pink-light` | `#e040a0` / `#f060b8` | 副强调色 |
| 软紫 | `--clr-violet` / `--clr-violet-light` | `#a855f7` / `#c084fc` | 眉标、强调、TOC |
| 金 | `--clr-gold` / `--clr-gold-light` | `#d4a832` / `#f5c840` | 奖项、Top 1 |
| 主文字 | `--clr-text` | `#f0eeff` | 正文主色 |
| 次文字 | `--clr-text-2` / `--clr-text-3` | `#8880a8` | 描述、小标签、meta |

> 金/银/铜约定：金 `--clr-gold-light`、银 `#90b8d0`、铜 `#e0a870`（[CLAUDE.md #84]）。

### 字体

| 俗名 | 变量 | 字体 | 用途 |
|---|---|---|---|
| 展示字体 | `--font-display` | Bebas Neue | 大标题、Logo、数字、计数 |
| 正文字体 | `--font-body` | DM Sans | 正文、按钮、**所有中文标签** |
| 等宽字体 | `--font-mono` | DM Mono | 日期、期号、数字数据（**无 CJK 字形**，中文必须改 body） |

### 间距 / 布局

| 变量 | 值 | | 变量 | 值 |
|---|---|---|---|---|
| `--gap-xs` | 8px | | `--gap-lg` | 64px |
| `--gap-sm` | 16px | | `--gap-xl` | 96px |
| `--gap-md` | 32px | | `--max-width` | 1200px |
| | | | `--nav-h` | 72px（移动端 56px） |

---

## 一·补、🎨 配色用途地图（哪里用什么颜色）

> 解决"配色混乱"的关键：把每个颜色的**语义角色**和**使用位置**钉死。
> ⚠️ 标 🔸 的是**游离硬编码色**——不在 `--clr-*` 令牌里、散落在各页，是混乱主因，建议阶段三 tokenize。

### A. 语义功能色（含义固定，全站统一）

| 角色 | 颜色 | class / 位置 |
|---|---|---|
| 排名 No.1（金） | `--clr-gold-light` `#f5c840` | `.chart-item--top`、HOF 第一档 |
| 排名 No.2（银）🔸 | `#90b8d0` | `.chart-item--silver`、HOF 第二档 |
| 排名 No.3（铜）🔸 | `#e0a870` | `.chart-item--bronze`、HOF 第三档 |
| 走势上升 🔸 | `#4ade80` 绿 | `.chart-change--up` |
| 走势下降 🔸 | `#f87171` 红 | `.chart-change--down` |
| 走势新进 | `--clr-violet-light` | `.chart-change--new` |
| 走势重入 🔸 | `#facc15` 黄 | `.chart-change--re` |
| 走势持平 | `--clr-border-2` | `.chart-change--same` |
| 统计·本周新高 | `--clr-violet-light` | `.chart-stat__*--violet` |
| 统计·曾登顶 | `--clr-pink-light` `#f060b8` | `.chart-stat__*--pink` |

### B. 每页主题色（hero eyebrow / glow / 标题 accent / watermark）

| 页面 | 主题色 | 备注 |
|---|---|---|
| 首页 index | 粉 + 紫 | hero eyebrow 粉；Barvision 标题紫、Lab 标题粉 |
| Barvision 总览 / events | 软紫 `--clr-violet-light` | |
| BBL bbl.html | 软紫 `--clr-violet-light` | |
| BBL HOF / Barvision HOF | 金 `--clr-gold-light` | |
| Archive | 榜吧蓝 `#6F9EC3` 🔸 | 整页榜吧蓝主题（[CLAUDE.md #107]） |
| events 投票卡 | Jury 紫 / Tele 蓝(`--clr-accent`) / Approval 金 | 按投票类型分色 |

> **约定**：每页一个"主题强调色"，贯穿该页 eyebrow/glow/标题 accent/watermark；正文/卡片仍用全局令牌。新页面套用此约定即可保持一致。

### C. 成员小组色（member.html，[CLAUDE.md #54]）

| 组 | 颜色 | badge |
|---|---|---|
| 全部 / 无分组 | 榜吧蓝 `#6F9EC3` 🔸 | — |
| BBL | 软紫 `--clr-violet-light` | BBL |
| 村摇欧共体 | 棕黄 `#D49840` 🔸 | 村摇欧 |
| Indienation | 粉 `--clr-pink-light` | Indie |

### D. 🔸 游离硬编码色清单（建议阶段三 tokenize）

| 颜色 | 含义 | 出现于 | 建议令牌 |
|---|---|---|---|
| `#6F9EC3` | 榜吧蓝（品牌第二色） | nav.js（BOARD logo）、archive 主题、member 无分组、bbl board accent | `--clr-board` |
| `#90b8d0` | 银（No.2） | bbl/hof | `--clr-silver` |
| `#e0a870` | 铜（No.3） | bbl/hof | `--clr-bronze` |
| `#4ade80` | 走势绿 | style.css、bbl | `--clr-up` |
| `#f87171` | 走势红 | style.css、bbl | `--clr-down` |
| `#facc15` | 走势黄（重入） | style.css | `--clr-re` |
| `#D49840` | 村摇欧棕黄 | member、bbl | `--clr-team-cun` |
| `#4ecca3` | ECVP 青 | archive | `--clr-esc` |
| `#fff4d6`/`#d4e8f4`/`#f4dcc0` | 金/银/铜档歌名微调色 | bbl/hof | （tier 文字色，可保留） |

> tokenize 后，改一处即可全站统一调色；目前这些散落各页，是"配色混乱"的根因。

---

## 二、🌟 命名速查表（中文俗名 ↔ class）

> 找不到的元素，描述大概位置+功能，我帮你定位后补进此表。

### A. 章节级（页面骨架）

| 中文俗名 | class | 出现页面 | 备注 |
|---|---|---|---|
| 导航栏 | `.nav`（`.nav__logo` / `.nav__links` / `.nav__cta` / `.nav__drawer`） | 全站 | `nav.js` 注入，全站统一 |
| 页脚 | `.footer`（`.footer__grid` / `.footer__col-title` / `.footer__links`） | 全站 | `nav.js` 注入 |
| 首屏英雄区 | `.hero`（`.hero__bg` / `.hero__split` / `.hero__left` / `.hero__right`） | index | 左右分栏 |
| 英雄背景装饰 | `.hero__glow`（辉光）/ `.hero__grid`（网格）/ `.hero__bg-logo`（水印 logo） | index | 各内容页各有一套（见待统一 #2） |
| 通用章节 | `.section` / `.section--bordered` | 全站 | padding + scroll-margin |
| 章节内容容器 | `.section__inner` | 全站 | max-width + 水平 padding |
| 章节眉标（小字标签） | `.section-label` | 全站 | 紫色 + 前置渐变短线 |
| 章节大标题 | `.section__title` | 全站 | clamp 字号 |
| 章节副标题 | `.section__subtitle` | 全站 | |
| 返回眉链（← 上级页） | 各页 `.xx-eyebrow`：`.bbl-eyebrow` / `.bv-eyebrow` / `.arc-eyebrow` / `.hof-eyebrow` | 各内容页 | 同款不同名（见待统一 #1）；规则见 [CLAUDE.md #109] |
| 水印大字 | `.xx-hero__watermark`（如 `BARBOARD`/`BBL`/`BARVISION`） | 各内容页 | 右下角超大半透明字 |

### B. 卡片 / 条目

| 中文俗名 | class | 出现页面 | 备注 |
|---|---|---|---|
| 歌曲条目（榜单行） | `.chart-item`（`.chart-rank` / `.chart-cover` / `.chart-song` / `.chart-stats` / `.chart-change`） | index、bbl | grid `44px 42px 1fr auto` |
| 排名列 | `.chart-rank`（+ `.chart-rank-col`） | index、bbl | Bebas，金银铜变体见下 |
| 封面 | `.chart-cover` | index、bbl | 42×42（移动 34/36） |
| 歌名/歌手 | `.chart-song__title` / `.chart-song__artist` | index、bbl | 可换行、line-height 1.2 |
| 统计角标（最高排名/在榜周数） | `.chart-stats` > `.chart-stat` > `__label`/`__val` | index、bbl 预览区 | 竖排两行 |
| 统计角标（完整榜单版） | `.bbl-item-stats` > `.bbl-stat` > `__label`/`__val` | bbl 完整榜单 | **与 `.chart-stat` 同物两套**（见待统一 #3）；桌面横排+分隔线，移动端已统一为 `.chart-stat` 样式 |
| 名次高亮（金/银/铜） | `.chart-item--top` / `--silver` / `--bronze` | index、bbl | |
| 赛季大卡 | `.season-card`（`__banner` / `__body`；含 `.season-status` / `.season-phases`） | index、barvision | Barvision 当届 |
| 赛程行 | `.phase`（`__name` / `__date` / `__badge` / `__status`；`--active` / `--gold`） | index、events | |
| 历届小卡 | `.edition-card`（`__num` / `__year` / `__winner`；`--active`） | index、barvision | |
| 存档活动卡 | `.arc-card`（`--bbl` / `--bv` / `--year` / `--bmy` / `--esc`；`--ended`） | archive | `--arc-color` 控制主色（[CLAUDE.md #107]） |
| HOF 分组卡 | `.hof-group`（`__head` / `__num` / `__label` / `__count`；`--gold`/`--silver`/`--bronze`） | bbl/hof、barvision/hof | columns 瀑布流 |
| HOF 记录卡 | `.hof-record-card`、`.hof-uncrowned`、`.hof-table-card` 等 | bbl/hof | 板块众多，详见 hof.html |
| 成员列表卡 | `.ml-card`（`__nickname` / `__handle` / `__badges` / `__foot`；`--link`） | member | |
| 成员页信息卡 | `.mp-card`（`.mp-avatar` / `.mp-info` / `.mp-link`） | member/N | `member-render.js` 注入 |
| 成员代表作卡 | `.mp-work-card`（`__type` / `__title` / `__desc`） | member/N | |
| 提交面板 | `.submit-panel`（`.sp-locked` / `.sp-open` / `.sp-badge`） | events | sticky |
| 投票结果卡 | `.ev-vote-card`（`.ev-vc-title` / `.ev-vc-pct` / `.ev-vc-desc`） | events | jury/tele/approval |

### C. 元素 / 控件

| 中文俗名 | class | 出现页面 | 备注 |
|---|---|---|---|
| 主按钮 | `.btn` + `.btn--primary` | 全站 | 渐变+发光 |
| 描边按钮 | `.btn` + `.btn--outline` | 全站 | |
| 搜索框 | `.bbl-search`（`__input` / `__icon` / `__clear`；`--active`） | bbl | 输入框规范见 [CLAUDE.md #74] |
| 搜索框（成员页） | `.ml-search` | member | **与 bbl-search 同物两套**（见待统一 #5） |
| 倒计时 | `#countdown`（index）/ `.ev-countdown`（events，`__label`/`__digits`） | index、events | **同物两套**（见待统一） |
| 页内目录 TOC | `.hof-toc`（`__item` / `__item--active`，紫色呼吸点） | bbl/hof（events 可套用） | IO suppression（[CLAUDE.md #86]） |
| 返回顶部 | `.back-to-top` | 全站 | 滚动 320px 后显示 |
| 字幕跑马灯 | `.ticker`（`__label` / `__track` / `__item`） | index | JS 驱动（[CLAUDE.md #30]） |
| 下滑提示 | `.hero__scroll-hint`（`.scroll-chevrons` / `.scroll-hint-text`） | index | 移动端隐藏 |
| 成员提及 | `.member[data-nickname]` → JS tooltip | 全站 | `initMemberTooltips()`（[CLAUDE.md #16/#44]） |
| 通用悬浮提示 | `[data-tooltip]` → JS tooltip | 全站 | `initDataTooltips()`（[CLAUDE.md #98]） |
| 走势指示器 | `.chart-change`（`--up`/`--down`/`--same`/`--new`/`--re`/`--peak`） | index、bbl | 颜色见 [CLAUDE.md BBL 渲染逻辑] |
| 徽章（榜单 NEW/PEAK） | `.chart-badge` | index、bbl | |
| 徽章（赛程 投票/直播） | `.phase__badge`（`--vote` / `--live`） | index、events | |
| 徽章（提交状态） | `.sp-badge` | events | LOCKED/OPEN/CLOSED |
| 徽章（活动状态） | `.arc-badge` | archive | ACTIVE/ANNUAL/ENDED |
| 徽章（成员身份） | `.ml-badge`（member）/ `.mp-tag`（member/N） | member | **同物两套**（见待统一 #4） |
| 标签（内联） | `.tag`（`--red` / `--gold` / `--dim`） | 通用 | |
| 快速链接 | `.quick-link`（`__arrow`） | index 侧栏 | |
| 动态条目 | `.update-item`（`.update-date` / `.update-title` / `.update-desc`） | index | UPDATES 区 |
| 赛程时间线 | `.ev-tl`（`-row` / `-date` / `-body` / `-name` / `-desc`；徽章 `.tl-b`） | events | |
| 展开更多按钮 | `.bbl-showmore__btn` | bbl | |

---

## 三、命名规范

**BEM 三层制**（已是全站现状，继续沿用）：
- **Block**：`.chart-item`、`.season-card`、`.btn`
- **Element**：`__title`、`__label`、`__badge`、`__inner`（双下划线）
- **Modifier**：`--primary`、`--active`、`--top`、`--gold`（双连字符）

**常用 modifier 语义约定**：
- 名次/等级：`--top` / `--silver` / `--bronze` / `--gold`
- 走势/状态：`--up` / `--down` / `--same` / `--new` / `--re` / `--peak`
- 开关状态：`--active` / `--locked` / `--open` / `--closed` / `--ended` / `--link`

**页面 namespace 前缀**（页面专属组件用）：
`bbl-`（BBL）、`bv-`（Barvision）、`arc-`（Archive）、`ml-`（成员列表）、`mp-`（成员页）、`hof-`（荣誉殿堂）、`ev-`（赛事页）。
> **新规约定**：凡是「多页面会复用」的组件，**不要再加页面前缀**，直接放 `style.css` 全局、用通用名（如未来的 `.hero-eyebrow` / `.stat` / `.search-field`）。页面前缀只留给真正页面独有的东西。

---

## 四、待统一清单（阶段三去重依据，逐个谨慎做，暂不动）

> 原则：每个收敛单独一次改动，改完用本地预览（mobile/desktop 双视口）验证，确认无回归再下一个。

**🔴 高优先（同物多套，最值得统一）**
1. **返回眉链** `.bbl-eyebrow`/`.bv-eyebrow`/`.arc-eyebrow`/`.hof-eyebrow` → 统一为全局 `.hero-eyebrow`，各页仅 inline 调主色。
2. **英雄背景装饰** 各页 `.xx-hero__glow`/`__grid`/`__watermark` → 抽为可复用基类 + 颜色变量。
3. **统计角标** `.chart-stat` ↔ `.bbl-stat` → 统一为 `.stat` + `--grid`/`--flex` 变体（移动端已临时统一，桌面仍两套）。
4. **成员徽章** `.ml-badge` ↔ `.mp-tag` → 合并为全局 `.member-badge`。
5. **搜索框** `.bbl-search__input` ↔ `.ml-search` → 抽为 `.search-field` 基类 + 变体。

**🟡 中优先（结构同、参数微异）**
6. **页面大标题** 各页 `.xx-hero__title` → `.page-title` + `--font-size` 变量。
7. **描述文本** 各页 `.xx-hero__desc` / `.xx-desc` → `.hero-desc`。
8. **meta 信息行** `.lab__meta` / `.ev-meta` → `.meta-row`。
9. **倒计时** `#countdown` ↔ `.ev-countdown` → 统一为 `.countdown`。
10. **hero 进入动画** `@keyframes bbl-hero-in`/`bv-hero-in`/`ev-hero-in` → `page-hero-in`。

**🟢 低优先**
11. tooltip 两套事件监听（`.member` 与 `[data-tooltip]`）样式已共用，逻辑可合并。

---

## 五、阶段路线

- **阶段一（本文件）**：组件清单 + 命名速查表 ✅
- **阶段二**：`styleguide.html` 实时组件库（渲染每个组件 + 标注名字，三用：命名参考 / 模板源 / 视觉回归基准）。
- **阶段三**：按「待统一清单」逐个去重，每个独立改动 + 预览验证。
