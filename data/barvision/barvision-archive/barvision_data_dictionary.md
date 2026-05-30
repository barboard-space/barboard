# Barvision 数据字典 (Data Dictionary)

适用于 Barboard 网站 Barvision 板块的归档数据。所有 CSV 均为 UTF-8 (含 BOM)，可直接被 Excel、Pandas、PapaParse 读取。

建议存放路径：`/data/barvision/`

---

## 文件总览

| 文件 | 内容 | 行数 | 主键 |
|---|---|---|---|
| `barvision_results_regular.csv` | 常规版赛果 (第 1–15 届) | 87 | edition_no + match + place |
| `barvision_results_unplugged.csv` | 娱乐版赛果 (第 1–4 届) | 15 | edition_no + match + place |
| `barvision_results_freestyle.csv` | 自由版参与记录 (第 1–2 届) | 2 | edition_no |
| `barvision_member_profiles.csv` | 成员档案汇总 | 63 | 昵称 |
| ~~`barvision_database_members.csv`~~ | **已弃用**，被 member_profiles 取代 | 63 | — |

> `barvision_database_members.csv` 是早期未清理版本，请勿使用；保留仅作追溯。

---

## 1. barvision_results_regular.csv / _unplugged.csv

两个文件结构完全相同，仅 `version` 不同。每场比赛的每个名次占一行。

| 字段 | 类型 | 说明 | 取值范围 |
|---|---|---|---|
| `year` | int | 举办年份 | 2019–2025 |
| `edition_no` | int | 届次序号 (主键之一) | 1–15 |
| `edition_name` | string | 届次全称 | 如 `The 15th Barvision` |
| `version` | enum | 版本 | `regular` / `unplugged` |
| `match` | string | 场次代码，综合赛留空 | `A` `B` `C` `SF` `GF` `E` `E Mini` |
| `venue` | string | 场次中文名 | 见下方对照 |
| `place` | enum | 名次 | `冠军` `亚军` `季军` `Shadow Track` |
| `member` | string | 选送成员 (匿名作 `匿名`) | 与 member_profiles.昵称 对应 |
| `artist` | string | 歌曲艺人 | 自由文本 |
| `song` | string | 歌曲名 | 自由文本 |
| `score` | float | 得分 | 如 `109.9` |
| `note` | string | 备注，正常为空 | 如 `赛事取消` |

### match → venue 对照

常规版：`A` = 小众场，`B` = 中众场，`C` = 大众场，`SF` = 半决赛，`GF` = 决赛。
娱乐版：`E` = 常规娱乐版，`E Mini` = 迷你娱乐版。

综合赛 (第 13–15 届) 无分场，`match` 与 `venue` 均为空。

### 特殊行约定

- **Shadow Track (影子曲目)**：`place = Shadow Track`，是某届的非正式补充曲目，不计入冠/亚/季正式名次。出现在第 5 届 C 场、第 10 届 B 场。
- **赛事取消**：podium 为空，仅保留一行占位，`note = 赛事取消`。见第 12 届 B 场。
- **匿名**：`member = 匿名`，表示该名次选送者未公开。

---

## 2. barvision_results_freestyle.csv

自由版只记录了参与规模，无名次数据，故单独成表。

| 字段 | 类型 | 说明 |
|---|---|---|
| `year` | int | 年份 (均为 2020) |
| `edition_no` | int | 届次 (1–2) |
| `edition_name` | string | 如 `The 2nd Barvision Unlimited` |
| `members` | string | 参与人数，如 `24位` |
| `songs` | string | 参赛曲数，如 `24首` |

---

## 3. barvision_member_profiles.csv

成员生涯汇总，按总场数降序。

| 字段 | 类型 | 说明 |
|---|---|---|
| `昵称` | string | 成员昵称 (主键) |
| `常规场数` | int | 常规版参赛场数 |
| `娱乐场数` | int | 娱乐版参赛场数 |
| `总场数` | int | 常规 + 娱乐合计 |
| `常规最佳` | string | 见下方说明 (两种含义) |
| `冠军场数` | int | 夺冠次数 |
| `前三场数` | int | 进入前三的次数 |
| `前五场数` | int | 进入前五的次数 |
| `前十场数` | int | 进入前十的次数 |
| `首次登场` | string | 届次+场地代码，如 `1` `3A` `2SF` |
| `最近活跃` | string | 届次+场地代码，如 `15` `12A` `4E` |

### `常规最佳` 字段说明 (重要)

该列在源数据中**混用两种含义**：

- 拿过名次的成员 → 显示最好名次：`1st` / `2nd` / `3rd`
- 从未拿过名次的成员 → 显示其参赛过的最好届次：`4th` `12th` `14th` 等
- 仅参加娱乐版的成员 → 为空

如需规整，可结合赛果表交叉计算，拆为 `最佳名次` + `最佳届次` 两列。

### `首次登场` / `最近活跃` 编码

格式为「届次 + 场地代码」，可与赛果表关联：

- 纯数字 (如 `1` `15`) → 对应 `edition_no`，该届为综合赛或泛指
- 数字+字母 (如 `12A` `8B`) → `edition_no` + `match`，例 `12A` = 第 12 届 A 场
- `2SF` `2GF` → 第 2 届半决赛 / 决赛
- `4E` `1E` → 娱乐版届次 + E 场

---

## 表间关联 (Relationships)

```
member_profiles.昵称  ←→  results_*.member
   (一位成员对应其在各届赛果中的多条记录)

results_*.edition_no + match
   ←→  member_profiles.首次登场 / 最近活跃  (编码后)
```

典型查询：
- **某成员的全部参赛史** → 用 `昵称` 在三个 results 文件中筛 `member`。
- **某届完整赛果** → 在 results 文件中筛 `edition_no`，按 `match` + `place` 排序。
- **历届冠军榜** → results 中筛 `place = 冠军`。

---

## 备注

- 第 6–12 届在原始页面归于 "Barvision 2020" 折叠组，统一标 `year = 2020`；若某届实际为 2019 年举办，需人工修正。
- 第 13–15 届为综合赛，无分场数据。
- 分数标度因版本/年份不同而异 (早期约 70–150，近年综合赛可达 300+)，跨届比较分数需谨慎。
