# Barboard 设计系统 · 组件与命名速查（DESIGN.md）

> **这份文档干什么用的？**
> 1. **沟通词汇**——你想改某个元素时，先在「命名速查表」找到它的**中文俗名**和 **class 名**，直接对我说「改〈赛季卡〉的配色」「〈统计角标〉再紧一点」，我就能精确定位。
> 2. **复用模板**——做新页面时，从这里查到现成组件的 class，直接套用，不用从零调。
> 3. **去重依据**——文末「待统一清单」记录了"同物多套"的重复实现，供后续阶段三逐个收敛。
>
> 维护约定：新增/改名组件时同步更新本文件。配套展示页：`styleguide.html`（设计标准：Foundation 审计可视化 + Elements + Components 索引；`styleguide-data.js` 由审计脚本生成）。
> 当前 `style.css` 版本号：`?v=3.0.8`（改 style.css 须按 [CLAUDE.md #122] 同步 index/bbl/bbl-hof 的 `?v=`）。

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
| **榜吧蓝（品牌第二色）** | `--clr-board` | `#6F9EC3` | logo BOARD、archive 主题、成员无分组 |
| 主文字 | `--clr-text` | `#f0eeff` | 正文主色 |
| 次文字 | `--clr-text-2` | `#C2BBDF` | 描述、小标签、meta、nav 链接 |
| 次文字（暗） | `--clr-text-3` | `#A39BC2` | 更弱的 meta / 占位 |

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
| Archive | 榜吧蓝 `--clr-board` | 整页榜吧蓝主题（[CLAUDE.md #107]） |
| events 投票卡 | Jury 紫 / Tele 蓝(`--clr-accent`) / Approval 金 | 按投票类型分色 |

> **约定**：每页一个"主题强调色"，贯穿该页 eyebrow/glow/标题 accent/watermark；正文/卡片仍用全局令牌。新页面套用此约定即可保持一致。

### C. 成员小组色（member.html，[CLAUDE.md #54]）

| 组 | 颜色 | badge |
|---|---|---|
| 全部 / 无分组 | 榜吧蓝 `--clr-board` | — |
| BBL | 软紫 `--clr-violet-light` | BBL |
| 村摇欧共体 | 棕黄 `#D49840` 🔸 | 村摇欧 |
| Indienation | 粉 `--clr-pink-light` | Indie |

### D. 🔸 游离硬编码色清单（建议阶段三 tokenize）

| 颜色 | 含义 | 出现于 | 建议令牌 |
|---|---|---|---|
| ~~`#6F9EC3`~~ | 榜吧蓝（品牌第二色） | — | ✅ **已 tokenize 为 `--clr-board`**（全站已替换；nav.js Dev Gate 内仍保留硬编码，dev-only 不影响） |
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

## 一·补2、🔤 字号阶梯 & 📏 间距阶梯（尺度规范）

> 目的：把"拍脑袋填 px"变成"从菜单选档"。**这是规范文档，不改现有代码**——新改动按阶梯走、就近归并零散值即可逐步收敛。
> （注：真正"改一处全站生效"靠组件去重，见待统一清单；阶梯先统一"标准档位"。）

### 字号阶梯 Type Scale（基于全站真实用值归纳）

**文本 / UI（10–16px 区）**

| 档 | px | 典型用途 |
|---|---|---|
| caption | 10 | stat label/val、角标、meta、badge |
| label | 11 | eyebrow、小标签、快链、phase |
| small | 12 | 歌手名、次要描述、footer 链接 |
| body | 13 | 正文、卡片描述、按钮 |
| body-lg | 14 | 歌名、强调正文、footer 标题 |
| lead | 15 | hero 描述 |
| input | 16 | 输入框（iOS ≥16 防缩放）、section 标题基准 |

**标题 / 数字 / 展示**

| 档 | px | 典型用途 |
|---|---|---|
| h-sm | 18 | 小标题 |
| h-md | 22 | 移动端页面标题、子标题 |
| num | 24 | 大数字（点数/期号/分组数）|
| h-lg | 26–28 | section 标题 |
| display-sm | 32 | 倒计时数字 |
| display | 40–44 | HOF 大数字、footer logo |
| display-lg | 52–64 | 超大展示 |
| hero | `clamp(56px, 8vw, 108px)` | 页面 hero 主标题 |
| watermark | 200–280 | 背景水印（纯装饰） |

> ⚠️ **避免新增离散值**：`7 / 9 / 12.5 / 13.5 / 17 / 20 / 21 / 30 / 34 / 36px` 等是历史拍脑袋值，新改动请就近归并到上表档位（如 `12.5→12`、`17→16/18`、`21→22`、`36→32/40`）。`9px` 仅 NEW/RE 徽章可用。

> 🔠 **跨字体视觉等大（重要）**：上表 px 以 **DM Sans（中文/正文）** 为基准。**Bebas Neue（`--font-display`，窄高全大写）在相同 px 下视觉明显偏矮小**。当中文标签（DM Sans）与数字（Bebas Neue）相邻、要"看起来一样大"时，**Bebas 需比 DM Sans 放大约 +30~40%**。常用配对：`12↔16`、`13↔18`、`14↔20`、`16↔22`（DM Sans px ↔ Bebas px）。styleguide「中文 × 数字 视觉等大配对」区有实样，真机微调到顺眼为准。

### 间距阶梯 Spacing Scale（4px 基准；已 token 的标注）

| 档 | px | 令牌 | 典型用途 |
|---|---|---|---|
| 2xs | 4 | — | 紧凑内部 gap（rank-col、stat、badge）|
| xs | 8 | `--gap-xs` | 元素间、卡片内 gap |
| sm | 12 | — | 卡片 gap、小 padding |
| md | 16 | `--gap-sm` | 卡片间距、标准块间距 |
| lg | 24 | — | eyebrow→标题、section 内分块 |
| xl | 32 | `--gap-md` | section 内大块、卡片大 padding |
| 2xl | 48 | — | 大卡 padding、宽分块 |
| 3xl | 64 | `--gap-lg` | section 之间 |
| 4xl | 96 | `--gap-xl` | hero / layout 分栏 |

> 微调档：`2px`（baseline 对齐微移）；卡片内部半档 `6 / 10 / 14 / 20px` 可酌情用。
> ⚠️ **避免**：`5 / 7 / 9 / 11 / 13 / 18 / 22 / 25 / 26 / 28 / 30 / 36 / 52 / 60px` 等零散值，就近归并（如 `18→16`、`22→24`、`28→24/32`、`36→32`、`52→48`、`60→64`）。

> 沟通用法：以后你可以说「这块上下间距用 **lg（24）**」「字号降到 **small（12）**」，我按档位改，不再随手填 px。

---

## 一·补3、📱 屏幕断点（响应式标准）

> **3 档设备模型**——只用 2 个宽度断点实现（桌面为基础样式，逐级收窄）。

| 设备档 | 宽度区间 | 断点写法 | 说明 |
|---|---|---|---|
| **手机** | ≤ 768px | `@media (max-width: 768px)` | **主分界**，"移动端改动"默认指这里 |
| **平板** | 769 – 1024px | `@media (max-width: 1024px)` | **继承桌面（方案 A）**，不主动写平板规则 |
| **桌面** | ≥ 1025px | 基础样式 / `@media (min-width: 769px)` | 桌面专属规则用 769 min |

> **平板策略（已定 = 方案 A）**：平板直接继承桌面布局，**不主动为平板写规则**。内容已被 `--max-width:1200px` 限宽、不会拉伸过头；多列略挤可接受。**仅当某块在平板上确实难看时，再针对那一块**在 `@media (max-width:1024px)` 加局部单列收窄——按需、局部，不预先铺整站平板规则。（曾权衡"平板当大号手机=单列+限宽居中"，因需主动为平板写一套规则、与"忽略平板"矛盾，否决。）

- **桌面不再细分**：MacBook（逻辑宽 1280–1680）与显示器（1920+）共用同一套桌面布局，内容由 `--max-width: 1200px` 居中，再宽只是两侧留白。无需 MacBook/显示器之间的断点。
- **480px = 手机内"极小屏"可选子档**（iPhone SE ~375px 等）：不是主分界，仅当极窄屏某处需额外收紧时才用 `@media (max-width: 480px)`。
- **功能查询**（与宽度无关，保留）：`prefers-reduced-motion: no-preference`（入场动画）、`hover: none, (pointer: coarse)`（触屏抑制 hover）、`hover: hover and (pointer: fine)`（非触屏）。

> ⚠️ **待归并的一次性断点**（精修各页时逐个看，能就近归并到标准档且布局不坏才并；内容驱动确有必要的保留并注明）：
> `465px`（barvision）→ 480 ? · `540px`（bbl/hof）→ 480 ? · `600px`（member）→ 768 ? · `700px`（events）→ 768 ? · `960px`（events ×2）→ 1024 ?

---

## 一·补4、🌊 流体令牌（clamp）标准

> 现行 web 标准 + 最省维护：**大的用 `clamp()` 流体自适应，小的固定**。令牌单一来源，**桌面精修值 = clamp 的 max**（桌面完全可控），小屏自动平滑收缩。

### 规则
| 类型 | 做法 |
|---|---|
| 大字号（标题 / 大数字 / hero） | `clamp(手机值, 流体vw, 桌面值)` |
| 大间距（`--gap-md/lg/xl`、section padding） | `clamp(手机值, 流体vw, 桌面值)` |
| 小字号（10–16px：caption/label/small/body/body-lg/lead/input） | **固定** |
| 小间距（4/8/16：`--gap-xs/sm`、卡内 gap） | **固定** |

### 现状 → 升级路径
- **现状（stepped 梯度，已实现）**：大间距的设备梯度靠 `@media (max-width:768px) :root` 覆盖令牌——`--nav-h:72→56`、`--gap-md:32→20`、`--gap-lg:64→48`、`--gap-xl:96→64`。即"梯度放令牌、维护一处"，不是每元素写多值。
- **升级（fluid，推荐，逐步采用）**：把这些令牌改成 clamp，**删掉 `:root` 覆盖、平滑无突变**。端点对齐现值 → 桌面零变化、手机基本不变：
  - `--gap-md: clamp(20px, 2.6vw, 32px)`
  - `--gap-lg: clamp(48px, 5vw, 64px)`
  - `--gap-xl: clamp(64px, 7vw, 96px)`
  - `--nav-h` 可保持 stepped（高度突变更可预测）
- **标题/大数字**：hero 已 `clamp(56px, 8vw, 108px)`；section 标题、倒计时(32)、HOF 大数字(44) 等可同法 clamp。

### 原则
- clamp **max = 桌面精修值**，**min = 手机值**，中间按 vw 平滑插值。
- **流体管大盘、断点管特例**：特定组件的手机微调仍用 `@media (max-width:768px)` 单独覆盖。
- **小 UI 文字/间距保持固定**——跨设备无需变。
- （可选未来）`px → rem` 利无障碍；因需精确控制 px，暂不做。
- **采用方式：不一次性全改**；精修各页/组件时，遇到该流体的大值就地换 clamp，逐步收敛。

---

## 一·补5、🅱️ Logo 标志规格（全站共享，nav.js 注入）

Logo = 图标 + 文字标 `BAR` + `BOARD`（BOARD 用品牌蓝 `--clr-board`）。两个版本：

**版本 A — nav 版（不带中文，纯文字标）**
`<a class="nav__logo"><img class="nav__logo-img">…<span>BAR<span class="nav__logo-board">BOARD</span></span></a>`

| 部件 | class | 规格 |
|---|---|---|
| 容器 | `.nav__logo` | Bebas Neue **26px**(h-lg) `!important`、weight 400、letter-spacing 0.02em、line-height 1、color `--clr-text`、flex `gap:5px`（⚠️离散→4）|
| 图标 | `.nav__logo-img` | **26×26px**、opacity 0.92、`margin-top:-5px`（视觉对齐微调）|
| BOARD | `.nav__logo-board` | color **`--clr-board`**、margin-left 1px |

**版本 B — footer 版（带中文副标 = 品牌锁定 lockup）**
同 `.nav__logo` + `.footer__logo` modifier，下接中文名 + tagline

| 部件 | class / 内联 | 规格 |
|---|---|---|
| logo | `.nav__logo.footer__logo` | 同版本 A + `margin-top:0!important`、`margin-bottom:8px`(=`--logo-gap-cjk`) |
| 中文名 | 内联 `<p>` | **12px**(small)、color `--clr-text`、margin-bottom 8px、文案「欧美流行音乐个人榜吧」 |
| tagline | `.footer__tagline` | **14px**(body-lg)、`--clr-text-2`、max-width 260、line-height 1.6、margin-top 24px；两行：始于2013年5月21日 / UNITED BY MUSIC |

> - 文字标结构 `<span>BAR<span class="nav__logo-board">BOARD</span></span>`（单 span 包裹防 flex 间距问题，[CLAUDE.md #6]）。
> - 中文名目前是内联 `<p>`（非 class）；若多处复用可抽 `.footer__name`。
> - 移动端 nav 高度 `--nav-h` 72→56，logo 不另调。

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
- **阶段二**：组件展示页 `styleguide.html` ✅——Foundation 由 `scripts/audit_design_tokens.py` 审计自动可视化（色块/字号/间距/圆角）+ Elements（Logo）+ Components（页面专属组件索引）。`styleguide-draft.html` 已删除（内容合并/取代）。
- **阶段三**：按「待统一清单」逐个去重，每个独立改动 + 预览验证；确认定稿的同步搬入 `styleguide.html`。

---

## 六、Barvision 历届详情页 设计 Guideline（桌面 + 手机）

> 适用：`barvision/<年>/<版本>-<NN>.html`（薄壳）+ `scripts/bv-results-render.js`（共享渲染）。对标 Eurovision wiki 的 content/scoreboard，沿用全站令牌。第一届 `regular-01` 为基准；新一届套同款。实现细节见 CLAUDE.md **#130**。

### 6.1 页面整体

| 区块 | 桌面 | 手机（`@media max-width:768px`）|
|---|---|---|
| **Hero**（对标 2026 events.html）| 大标题 = `edition_name`（去罗马数字、序数词 `1st` 染 `--clr-pink-light`）；meta = `cn_name｜Barvision <城市?> <年>`（**DM Sans 12px** `--clr-text-3`，城市仅 2023 起）；`summary` 作 intro（`--clr-text-2` 15px）。section header 复用全局 `.section-label`(渐变横杠)+`.section__title`(Bebas)+`.section__subtitle` | 继承（窄屏自然收窄）|
| **板块顺序** | Hero → **赛制 Rules** → **结果概览 Results** → **投票详情 Detailed Voting Results**（含 Scoreboard 矩阵 + 12 Points）| 同 |
| **页内 TOC** | 右下固定、**加载即显示**（hero 短，不绑滚动阈值）；呼吸点指示 | **隐藏** |

### 6.2 配色（三表统一）

| 语义 | 令牌 |
|---|---|
| Jury（评委）| `--clr-accent-light`（浅蓝 #33c6ff）|
| Tele（观众）| `--clr-pink-light`（粉 #f060b8）|
| Total / Points（总分）| `--clr-text`（白）|
| 12 分单元格 | `--clr-gold-light`（金）|
| 前三名 | 金 `--clr-gold-light` / 银 `#90b8d0` / 铜 `--clr-bronze`（渐变底 + 左 3px 光条，参考 bbl `.chart-item--top/silver/bronze`）|
| @名 `.member` | `--clr-board-light`（亮榜吧蓝 #8FBEE3）；hover `--clr-violet-light`；12 Points 接收者 `.bvr-12__r .member` = `--clr-text`（白）|

分数字体一律 **DM Sans**（非 mono）。

### 6.3 ① 结果概览表 `.bvr-tbl`

- **桌面**：列 名次 / 选送者@ / 歌手 / 歌名 / 语种 / Jury / Tele / Points。名次 **Bebas 18px**（套 bbl `.chart-rank`，前三金银铜渐变底+左光条+歌名歌手染色）；分数 **DM Sans 居中**，Jury/Tele 下方带**竞赛式 #名次**（`compRank`，jury #0.55 / tele #0.7 透明度）；**表头可点排序**（`wireSortable` 读 `data-v`；**实心上下三角 SVG（mask + currentColor 跟随列色）**：默认双向、激活态该向加深另一向淡，全大写表头，三角 `margin-right:-10px` 使文字居中对齐数值，`th.th-jury` 因结尾 Y 单独 `margin-left:0` 补偿）。
- **手机**：保留横向滚动表 + 上方「**左右滑动查看完整结果**」提示；压缩行/列 padding；分数字号统一 **13px**（=歌手/歌名，#名次仍小）；**@名 → 昵称（X妈 格式）**（`.member{font-size:0}` + `::before content:attr(data-nickname)`，链接/`data-nickname` 仍有效）；名次列缩窄 28px + 收紧与选送者间距、**表头同步对齐**（th 缩窄+居中）；列头 **PTS**（`Points` 改）。

### 6.4 ② Scoreboard 矩阵 `.bvr-mtx`

- **结构**：评委+观众**合并一表**（评委列在前、观众附后，`.vsep` 分隔线）；分组表头 **Jury Vote**(colspan) / **Tele Vote**(colspan)；选送者/Total/Jury/Tele 四列 `rowspan=2` 合并到分组行（消除左上空角）+ 全部投票人列。
- **排序**：前 4 列可点（`wireMatrixSort`）——**选送者 = 默认对角线序**（行按评委列顺序排，自投格连成主对角线），Total/Jury/Tele 数值降序。
- **细节**：自投格斜纹（`.self`，base + 45° hatch）；12 分金色；汇总分 DM Sans 13px；`.bvr-mw` 用 `display:inline-block; max-width:100%` 收缩包裹（无右侧空白、超宽横滚）。**粘性「选送者」列 + `border-collapse:separate`**（单元格只画右/下边框，左/上由外框）——避免折叠边框被粘性列盖不住而**滚动漏光**；`.rcp` `z-index:2` + 不透明 `--clr-bg`。
- **手机**：横滚 + 「**左右滑动查看完整计分板**」提示；@名 → 昵称；投票人列头本就用短昵称。

### 6.5 ③ 12 Points 表 `.bvr-12`

- **桌面**：三列 grid `max-content 1fr 1fr`——选送者（前置 **Bebas 数字** = 该行 12 分个数，weight 400 防假粗，`--clr-text`）/ **Jury** 组 / **Tele** 组；无 Jury 时 Tele 占第二列；给分者 @名（`.member`，10px 间距、无顿号）；评委/观众用蓝/粉 `Jury`/`Tele` 小标签区分；接收者 @名白色。每条目用 `.bvr-12e`(桌面 `display:contents` 保持三列跨行对齐)。
- **手机**：单列；每条目 `.bvr-12e` 变**对称 padding 块**（上下各 10px、`border-top` 分隔），内部 选送者/Jury/Tele 各占整行、行间紧凑（Jury↔Tele +2px）；空 Tele 行隐藏。

### 6.6 手机通用约定（详情页）

- **@名一律用昵称（X妈 格式）**省空间（`.bvr-tbl/.bvr-mtx/.bvr-12 .member` → `::before` 昵称）。
- 宽表（结果表 / 矩阵）**横向滚动 + 文字提示**，**隐藏滚动条**（`scrollbar-width:none` + `::-webkit-scrollbar{display:none}`）。
- **触屏禁用 hover tooltip**（nav.js：`(hover:none),(pointer:coarse)` 命中则 `initMemberTooltips/initDataTooltips` 早返回）——避免 tap 触发卡住；桌面不受影响。
- TOC 隐藏。桌面端样式零影响（所有手机改动锁在 `@media max-width:768px`）。

### 6.7 多场次 / 成员变动 / 上下届导航（第二届起）

- **多场次**（如第二届 SF 半决赛 + GF 决赛）：JSON `matches:[{venue,match,entries,votes},…]`，`bv-results-render.js` `matches.forEach` 渲染（`matches.length>1` 即多场）。section-label 前缀用英文段名 `matchEng(m)`：`SF→SEMI-FINAL`、`GF→GRAND FINAL`（title 仍「结果概览/投票详情」）；TOC 用「半决赛/决赛 + 结果概览/投票详情」。
- **成员变动 section**（「赛制」后，`memberChangesBlock()`）：依赖 `data/barvision/editions-index.json`（各届 roster + 序列，`gen_bv_editions_index.py` 生成）。对比上一届 + 历史届分四类：**继续参赛**（蓝 `--clr-board-light`）/ **首次加入**（紫 `--clr-violet-light`）/ **回归**（金 `--clr-gold-light`，间隔后回来、连续参赛不算）/ **退出**（粉 `--clr-pink-light`）；表格 状态 badge + @成员 + 人数；非空分类才显示；第一届全首次。
- **上一届/下一届导航**（详情页底部，`navBlock()`）：`.bvr-nav__btn` 两端分布；默认整体灰（`--clr-text-3`），hover 整组（标签 + 届名 + 箭头）变 `--clr-red-light` + 边框粉；届名 13px / 标签 10px；`line-height:1.25` 收紧高度。**间距**：`.bvr-nav` `margin-top:calc(48px - var(--gap-xl))` 抵消上一 `.section` 底部 padding，距正文约 48px（桌面/手机一致）；水平内边距 `var(--gap-md)` 与正文对齐。**手机端**：`display:grid` 两等分（`minmax(0,1fr) minmax(0,1fr)`），单按钮占半边、缺届的 `.bvr-nav__spacer` 占住另一半；选择器需提权 `.bvr-nav.section__inner`（`@media` 块在基础规则前，参 #36）。
- **boot**：`Promise.all([EDITION_SRC, editions-index.json])` → `render(d, idx)`。
- **来源**：`source` 省略文件格式（只留文档名）；总分 `fmtScore()` 一律 `Math.round` 四舍五入（决赛含加成小数）。
- **多组（第三届起，如 A 小众 / B 中众）**：同 `matches:[{match:'A',venue:'小众组'},…]`，`matchEng` 加 `A→GROUP A / B→GROUP B`；两组独立计分排名。
- **投票折算（第四届 A 组）**：泰妈仅给前五喜好、计分 50% 折算。`score` 取 CSV 总分、`tele=score−jury`；展示四舍五入到整数；说明合并到计分板矩阵后注释（注1/注2）。
- **冻结窗格**：计分板矩阵 `.bvr-mtx` 桌面+手机均冻结「选送者+Total+Jury+Tele」（`stickyMatrixCols` 量列宽写 `--mtx-l-*`）；结果概览 `.bvr-tbl` **仅手机**冻结「名次/选送者/歌手」前三列（`stickyResultCols` 写 `--tbl-l-*`，奖牌/混淆行冻结列补纯色底）。详见 CLAUDE.md #136。
- **联合选送「A/B」（第四届起）**：`member` 保留斜杠串；`memberLink` 遇 `/` 拆分（`.bvr-joint-sep`）；结果表用 `.bvr-joint`（flex 列）两人上下排列；聚合/名册按 `/` 拆分计入各自。详见 CLAUDE.md #136。
- **名次（parse 计算）**：正式曲 总分↓、同分观众分↓（欧视并列打破）；混淆曲并排名次 = 不低于其分的正式曲数+1（同分排正式后），如 Omar 85→5、Daughtry 45→18。
- **混淆曲 `is_shadow`（第三届起）**：非正式、不计排名。① **结果概览**：`.bvr-row--shadow` 灰行（**不斜体**，`.member` 染灰）+「混淆」标 + 名次 `N*`（`.bvr-num-shadow` **Bebas 16px=正常-2px、非斜体**，`top:-3px` 对齐字形中心）+ Jury/Tele 用 `--clr-text-3`（同歌名色，弃用 opacity 防背景带）、总分 `--clr-text-2`；② **Scoreboard 矩阵**：含混淆曲弱化行（末尾），选送者**斜体昵称**（`.bvr-anon`；已知选送者显示真实昵称、匿名者显示「匿名」；无「混淆」标），矩阵后 `.bvr-mtx-note`「注：斜体昵称为混淆歌曲选送者」；③ **12 Points** 含混淆曲（斜体昵称）；④ **成员页** 名次 `N*`（不加粗、比正常小 2px=13px；值包 `.rk-sh` span 右移 2px，不移单元格背景）、行不斜体统一 `--clr-text-3`、走势含混淆点（rank 同表）。overview 12 分次数排除混淆。Jury/Tele：有正式曲=Jury，仅混淆/未报=Tele。
- **「匿名」伪成员**（涵盖①正式单曲匿名②混淆单曲匿名）：昵称`匿名`/id `0`/`unclaimed:true`；结果概览 `.member--unclaimed`（非斜体弱化、无 @、→ `member/0.html`），矩阵/12分用斜体 `.bvr-anon`；member.html `.ml-card--anon`（仅 Barvision 筛选显示、置尾、不计数）。详见 BARVISION_MEMBER.md。
