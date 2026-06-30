# 工作记忆 / 约定

> 本文件是 Claude Code 本机跨会话记忆（`~/.claude/projects/.../memory/`，**不在仓库**）的**人读镜像**，纳入版本控制方便查阅与编辑。
> 深度技术细节见 `CLAUDE.md`（编号注记）与 `BARVISION_MEMBER.md`；本文件只留约定要点。
> 最后同步：2026-06-30。

---

## 一、工作偏好与约定（如何协作）

### 用中文回复
所有回复用中文叙述；代码、class 名、技术术语、命令可保留英文。（项目面向中文社区）

### 移动端改动严格隔离
「移动端改动」只能动 `@media (max-width:768px)`（或更小断点）内的规则，或用 JS `matchMedia` 做条件操作；**绝不改全局 CSS / 桌面默认值 / HTML 结构**（除非桌面视觉完全不变）。改动前自问：这行在桌面端会不会变？会就是错的。

### 移动端改动不自动 push
任何改动（含移动端）都**不擅自 push**；`git push` 只在用户明确要求时执行。要看移动端效果用本地预览或线上。

### 不用截图验证
**不要用 `preview_screenshot` 给用户看效果**（预览标签常 `document.hidden` 冻结、截图超时）。用 DOM/computed（`getComputedStyle`/`getBoundingClientRect`/`fetch`）做功能自查即可；用户想看视觉效果时自己看 commit+push 后的线上（GitHub Pages）。

### 设计流程：桌面优先 → 手机微调 → 平板忽略
① 桌面端为基准（先精修桌面 base）；② 之后手机端定点微调（`@media≤768`）；③ 平板（769–1024）基本忽略、继承桌面（方案 A）。**验证只用桌面 + 手机两个视口，跳过平板**。断点标准 768/1024（CLAUDE.md #124），1024 档低优先。

### 不擅自还原用户的二进制资源
发现仓库里无法解释的改动（尤其**图片/字体等二进制**），**先指出并问用户、不要 `git checkout` 还原**——`git checkout --` 覆盖未暂存改动后不可恢复，二进制一旦覆盖永久丢失。会话初 clean ≠ 后续改动就是误产生的。破坏性 git 操作涉及用户可能改过的文件前必须确认。

### events 页更新日期自动同步
每次改 `barvision/2026/events/`（events 页）内容时，顺带把 hero `.ev-updated` 的「本页上次更新于 YYYY-MM-DD」改成**当天**（mono 字体那段）；用户不手动维护。没碰该页的会话不用动。

### 多艺人合作曲「艺人 — 歌名」格式
① lead+feat：feat 写进歌名 `(feat. X)`、非 feat 合作者 `(with X)`；② 多 lead 或 feat 多位：2 位 `A & B`、>2 位牛津式 `A, B, C & D`；③ 原始数据常用 `/` 堆叠、不分 lead/feat。**遇多艺人先向用户确认 lead/feat 归属再录入**，正字法须正确（Röyksopp/Susanne Sundfør 等，禁 ASCII 简化）。详见 CLAUDE.md #15/#119。

### styleguide.html 构建规则
排布顺序 基础 Foundation → 元素 Elements → 组件 Components → 章节 Sections；每加元素若引入新规则（令牌/配色/字号/间距/圆角）同步补进 Foundation；每条目记「名称 + class 名 + 所用地方」；**只在末尾新增、改既有先征得同意**。

### 年榜合作串拆分的 KEEP 例外名单
榜吧年榜按艺人统计（如「进百最多」）时，多人合作串按**逗号**拆到各艺人；但**名字本身含逗号的艺人/乐队**（`Tyler, The Creator`、`Black Country, New Road`，未来或 `Earth, Wind & Fire` 等）必须进 `KEEP` 例外名单（在 `archive/annual/<年>/index.html` 内，占位符用 `§`、**勿用 NUL**）。**每导入新年份先扫描该年含逗号的艺人串、把「逗号属于名字本身」的逐个列给用户确认后再更新 KEEP**。

---

## 二、进行中项目

### Barvision 历届赛果导入
- **进度**：第 1–15 届全部导入完成；**下一步第 16 届（Chongqing 2026）赛后导入**；HOF 历届前三改版 + 全量核对待办。
- **权威 SOP**：仓库根 `BARVISION_MEMBER.md §二`（JSON schema 硬契约 + 机械步骤 + 自查清单 + 必改常量 + 零布局改动原则）。背景 CLAUDE.md #129/#130/#157/#163 等。
- **最易踩坑**：`votes.voters[].points` 必须按 entry 的 `eid` 作键；导入后必重跑 `recompute_bv_ranks.py --write` →（有匿名）`number_anon.py --write` → `gen_member_pages.py` + `gen_bv_editions_index.py`。
- 投票制沿革：2024 起才有观众分（20 票制，仅决赛 GF；2024 无每首上限、2025 每首≤10）；2024 前全 1-12 制。

### 榜吧年终榜导入
- **进度**：2022 样板完成（`/archive/annual/2022/`，Top 200 + 展开按钮 + 完整侧栏 + 年份导航 + 分差下标）。详见 CLAUDE.md #174。
- **管线**：`scripts/parse_annual_chart.py` 读 `年终榜/<年>吧年榜.xlsx` 的「总榜」sheet → `data/annual/<年>.json`；封面用 **iTunes Search API** 构建期抓取（600×600，onerror 兜底）；页面类 BBL 榜单 + 右侧悬浮侧栏（搜索/年度看点/sticky）。
- **下一步**：① 排行榜功能细化呈现；② **年榜助攻数据同步到成员个人主页**（年榜是「歌手」维度、成员页是「选送大妈」维度，映射关系待与用户厘清）。剩余：封面命中率优化、铺 2013–2021。
- 见上「KEEP 例外名单」约定。
