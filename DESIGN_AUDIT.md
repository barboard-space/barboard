# 设计值审计报告（自动生成）

扫描 12 个文件（style.css + 生产页面；已排除 member/N stub 与 styleguide*）。

> 只读分析。`→ var(--x)` = 可替换为现有令牌；`❓` = 无对应令牌、待拍板。


## ① :root 令牌 — 同值合并候选

（无）


## ②a 颜色 · HEX（品牌色 — 主要 tokenize 目标）

| 值 | 次数 | 对应令牌 | 位置示例 |
|---|---|---|---|
| `#6a6488` | 3 | ❓ 无 token | style.css:2205 · style.css:2223 · style.css:2229 |
| `#0a0820` | 2 | ❓ 无 token | barvision.html:91 · barvision.html:260 |
| `#16104a` | 2 | ❓ 无 token | barvision.html:91 · barvision.html:260 |
| `#0c0a32` | 2 | ❓ 无 token | barvision.html:91 · barvision.html:260 |
| `#7ea4bc` | 1 | ❓ 无 token | style.css:930 |
| `#ccdde8` | 1 | ❓ 无 token | style.css:939 |
| `#d09068` | 1 | ❓ 无 token | style.css:955 |
| `#fde8d0` | 1 | ❓ 无 token | style.css:964 |
| `#080818` | 1 | ❓ 无 token | style.css:1172 |
| `#12103a` | 1 | ❓ 无 token | style.css:1172 |
| `#0e0a28` | 1 | ❓ 无 token | style.css:1172 |
| `#0c0a26` | 1 | ❓ 无 token | barvision.html:130 |
| `#1d1558` | 1 | ❓ 无 token | barvision.html:130 |
| `#110e38` | 1 | ❓ 无 token | barvision.html:130 |
| `#0d0b1a` | 1 | ❓ 无 token | barvision.html:191 |
| `#130f28` | 1 | ❓ 无 token | barvision.html:191 |
| `#0f0c20` | 1 | ❓ 无 token | barvision.html:191 |
| `#000000` | 1 | ❓ 无 token | bbl.html:160 |
| `#a8a3c8` | 1 | ❓ 无 token | member.html:151 |

## ②b 颜色 · rgba（发光/阴影/半透明 — 多为一次性效果）

| 值 | 次数 | 对应令牌 | 位置示例 |
|---|---|---|---|
| `rgba(255,255,255,0.016)` | 10 | ❓ 无 token | archive.html:30 · archive.html:31 · barvision.html:29 · barvision.html:30 … (+6) |
| `rgba(168,85,247,0.22)` | 7 | ❓ 无 token | style.css:534 · archive.html:138 · barvision.html:22 · bbl.html:23 … (+3) |
| `rgba(192,132,252,0.4)` | 5 | ❓ 无 token | style.css:1421 · barvision.html:44 · bbl.html:68 · member.html:178 … (+1) |
| `rgba(168,85,247,0.08)` | 5 | ❓ 无 token | archive.html:137 · bbl.html:298 · barvision/hof.html:23 · barvision/2026/events.html:234 … (+1) |
| `rgba(224,64,160,0.1)` | 5 | ❓ 无 token | bbl.html:24 · barvision/2026/events.html:23 · barvision/2026/events.html:256 · barvision/2026/events.html:272 … (+1) |
| `rgba(168,85,247,0.28)` | 4 | ❓ 无 token | style.css:303 · style.css:1784 · style.css:1797 · barvision/hof.html:76 |
| `rgba(212,168,50,0.07)` | 4 | ❓ 无 token | style.css:896 · bbl/hof.html:310 · bbl/hof.html:409 · bbl/hof.html:476 |
| `rgba(255,255,255,0.04)` | 4 | ❓ 无 token | style.css:1184 · style.css:1185 · barvision.html:104 · barvision.html:105 |
| `rgba(168,85,247,0.18)` | 4 | ❓ 无 token | style.css:1369 · barvision.html:84 · barvision.html:205 · member.html:138 |
| `rgba(168,85,247,0.1)` | 4 | ❓ 无 token | style.css:1396 · bbl.html:126 · bbl.html:482 · barvision/2026/events.html:309 |
| `rgba(168,85,247,0.07)` | 4 | ❓ 无 token | archive.html:24 · barvision.html:182 · barvision/2026/events.html:164 · bbl/hof.html:304 |
| `rgba(144,184,208,0.05)` | 4 | ❓ 无 token | bbl/hof.html:130 · bbl/hof.html:311 · bbl/hof.html:410 · bbl/hof.html:477 |
| `rgba(224,168,112,0.05)` | 4 | ❓ 无 token | bbl/hof.html:131 · bbl/hof.html:312 · bbl/hof.html:411 · bbl/hof.html:478 |
| `rgba(192,132,252,0.45)` | 3 | ❓ 无 token | style.css:165 · barvision.html:159 · bbl.html:284 |
| `rgba(168,85,247,0.2)` | 3 | ❓ 无 token | style.css:309 · style.css:1397 · barvision/2026/events.html:91 |
| `rgba(168,85,247,0.25)` | 3 | ❓ 无 token | style.css:540 · style.css:1370 · member.html:138 |
| `rgba(212,168,50,0.22)` | 3 | ❓ 无 token | style.css:896 · barvision/hof.html:22 · bbl/hof.html:129 |
| `rgba(224,176,64,0.85)` | 3 | ❓ 无 token | style.css:918 · style.css:923 · bbl.html:443 |
| `rgba(148,196,220,0.85)` | 3 | ❓ 无 token | style.css:943 · style.css:948 · bbl.html:445 |
| `rgba(224,160,100,0.8)` | 3 | ❓ 无 token | style.css:968 · style.css:973 · bbl.html:447 |
| `rgba(240,96,184,0.0)` | 3 | ❓ 无 token | style.css:1236 · barvision/2026/events.html:181 · barvision/2026/events.html:182 |
| `rgba(192,132,252,0.15)` | 3 | ❓ 无 token | style.css:1858 · barvision.html:154 · barvision.html:262 |
| `rgba(0,180,255,0.06)` | 3 | ❓ 无 token | bbl.html:25 · barvision/2026/events.html:24 · bbl/hof.html:25 |
| `rgba(240,238,255,0.85)` | 3 | ❓ 无 token | bbl.html:434 · bbl.html:1018 · bbl.html:1018 |
| `rgba(245,200,64,0.7)` | 3 | ❓ 无 token | barvision/hof.html:51 · bbl/hof.html:60 · bbl/hof.html:203 |
| `rgba(212,168,50,0.3)` | 3 | ❓ 无 token | barvision/2026/events.html:274 · barvision/2026/events.html:311 · barvision/2026/events.html:345 |
| `rgba(212,168,50,0.13)` | 3 | ❓ 无 token | bbl/hof.html:310 · bbl/hof.html:409 · bbl/hof.html:476 |
| `rgba(144,184,208,0.11)` | 3 | ❓ 无 token | bbl/hof.html:311 · bbl/hof.html:410 · bbl/hof.html:477 |
| `rgba(224,168,112,0.11)` | 3 | ❓ 无 token | bbl/hof.html:312 · bbl/hof.html:411 · bbl/hof.html:478 |
| `rgba(0,0,0,0.3)` | 2 | ❓ 无 token | style.css:451 · style.css:452 |
| `rgba(0,0,0,0.75)` | 2 | ❓ 无 token | style.css:451 · style.css:452 |
| `rgba(255,255,255,0.025)` | 2 | ❓ 无 token | style.css:461 · style.css:462 |
| `rgba(192,132,252,0.5)` | 2 | ❓ 无 token | style.css:487 · member.html:45 |
| `rgba(224,64,160,0.12)` | 2 | → var(--clr-pink-dim) | style.css:534 · barvision.html:23 |
| `rgba(0,0,0,0.35)` | 2 | ❓ 无 token | style.css:680 · member.html:138 |
| `rgba(240,96,184,0.95)` | 2 | ❓ 无 token | style.css:1035 · bbl.html:440 |
| `rgba(200,152,42,0.12)` | 2 | ❓ 无 token | style.css:1104 · style.css:1266 |
| `rgba(240,238,255,0.8)` | 2 | ❓ 无 token | style.css:1124 · index.html:455 |
| `rgba(0,180,255,0.1)` | 2 | ❓ 无 token | style.css:1142 · barvision/2026/events.html:308 |
| `rgba(0,180,255,0.08)` | 2 | ❓ 无 token | style.css:1369 · barvision/2026/events.html:273 |
| `rgba(168,85,247,0.35)` | 2 | ❓ 无 token | style.css:1370 · bbl.html:480 |
| `rgba(0,180,255,0.04)` | 2 | ❓ 无 token | style.css:1396 · member.html:24 |
| `rgba(168,85,247,0.12)` | 2 | → var(--clr-violet-dim) | style.css:1397 · bbl/hof.html:24 |
| `rgba(192,132,252,0.9)` | 2 | ❓ 无 token | style.css:1410 · barvision.html:146 |
| `rgba(192,132,252,0.65)` | 2 | ❓ 无 token | style.css:1769 · style.css:1805 |
| `rgba(111,158,195,0.22)` | 2 | ❓ 无 token | archive.html:22 · archive.html:133 |
| `rgba(224,64,160,0.08)` | 2 | ❓ 无 token | archive.html:23 · barvision/2026/events.html:173 |
| `rgba(111,158,195,0.7)` | 2 | ❓ 无 token | archive.html:47 · member.html:69 |
| `rgba(0,180,255,0.05)` | 2 | ❓ 无 token | barvision.html:24 · barvision/hof.html:24 |
| `rgba(100,140,230,0.55)` | 2 | ❓ 无 token | barvision.html:92 · barvision.html:258 |
| `rgba(120,160,240,0.08)` | 2 | ❓ 无 token | barvision.html:96 · barvision.html:259 |
| `rgba(255,255,255,0.035)` | 2 | ❓ 无 token | barvision.html:199 · barvision.html:200 |
| `rgba(180,120,45,0.1)` | 2 | ❓ 无 token | member.html:71 · member.html:179 |
| `rgba(255,255,255,0.018)` | 2 | ❓ 无 token | barvision/hof.html:30 · barvision/hof.html:31 |
| `rgba(212,168,50,0.035)` | 2 | ❓ 无 token | barvision/hof.html:43 · bbl/hof.html:45 |
| `rgba(245,200,64,0.28)` | 2 | ❓ 无 token | barvision/hof.html:51 · bbl/hof.html:60 |
| `rgba(245,200,64,0.85)` | 2 | ❓ 无 token | barvision/hof.html:65 · bbl/hof.html:77 |
| `rgba(168,85,247,0.04)` | 2 | ❓ 无 token | barvision/2026/events.html:36 · barvision/2026/events.html:286 |
| `rgba(0,180,255,0.28)` | 2 | ❓ 无 token | barvision/2026/events.html:273 · barvision/2026/events.html:323 |
| `rgba(212,168,50,0.1)` | 2 | ❓ 无 token | barvision/2026/events.html:274 · bbl/hof.html:180 |
| `rgba(168,85,247,0.3)` | 2 | → var(--clr-violet-glow) | barvision/2026/events.html:309 · barvision/2026/events.html:322 |
| `rgba(212,168,50,0.28)` | 2 | ❓ 无 token | barvision/2026/events.html:324 · bbl/hof.html:117 |
| `rgba(180,160,255,0.04)` | 2 | ❓ 无 token | bbl/hof.html:179 · bbl/hof.html:463 |
| `rgba(245,200,64,0.62)` | 2 | ❓ 无 token | bbl/hof.html:319 · bbl/hof.html:488 |
| `rgba(144,184,208,0.72)` | 2 | ❓ 无 token | bbl/hof.html:320 · bbl/hof.html:489 |
| `rgba(224,168,112,0.72)` | 2 | ❓ 无 token | bbl/hof.html:321 · bbl/hof.html:490 |
| `rgba(245,200,64,0.32)` | 2 | ❓ 无 token | bbl/hof.html:322 · bbl/hof.html:482 |
| `rgba(212,168,50,0.75)` | 2 | ❓ 无 token | bbl/hof.html:472 · bbl/hof.html:526 |
| `rgba(8,8,18,0.0)` | 1 | ❓ 无 token | style.css:207 |
| `rgba(8,8,18,0.95)` | 1 | ❓ 无 token | style.css:219 |
| `rgba(224,64,160,0.5)` | 1 | ❓ 无 token | style.css:309 |
| `rgba(224,64,160,0.55)` | 1 | ❓ 无 token | style.css:540 |
| `rgba(240,238,255,0.65)` | 1 | ❓ 无 token | style.css:545 |
| `rgba(240,238,255,0.09)` | 1 | ❓ 无 token | style.css:718 |
| `rgba(255,255,255,0.02)` | 1 | ❓ 无 token | style.css:821 |
| `rgba(245,200,64,0.35)` | 1 | ❓ 无 token | style.css:895 |
| `rgba(212,168,50,0.15)` | 1 | ❓ 无 token | style.css:897 |
| `rgba(224,176,64,0.7)` | 1 | ❓ 无 token | style.css:910 |
| `rgba(140,168,188,0.28)` | 1 | ❓ 无 token | style.css:928 |
| `rgba(110,150,178,0.15)` | 1 | ❓ 无 token | style.css:929 |
| `rgba(110,150,178,0.05)` | 1 | ❓ 无 token | style.css:929 |
| `rgba(110,150,178,0.1)` | 1 | ❓ 无 token | style.css:930 |
| `rgba(110,170,204,0.5)` | 1 | ❓ 无 token | style.css:935 |
| `rgba(196,128,74,0.32)` | 1 | ❓ 无 token | style.css:953 |
| `rgba(196,120,68,0.18)` | 1 | ❓ 无 token | style.css:954 |
| `rgba(196,120,68,0.06)` | 1 | ❓ 无 token | style.css:954 |
| `rgba(196,120,68,0.12)` | 1 | ❓ 无 token | style.css:955 |
| `rgba(224,148,84,0.6)` | 1 | ❓ 无 token | style.css:960 |
| `rgba(224,64,160,0.09)` | 1 | ❓ 无 token | style.css:1143 |
| `rgba(240,96,184,0.7)` | 1 | ❓ 无 token | style.css:1235 |
| `rgba(240,96,184,0.45)` | 1 | ❓ 无 token | style.css:1259 |
| `rgba(240,96,184,0.16)` | 1 | ❓ 无 token | style.css:1260 |
| `rgba(240,96,184,0.07)` | 1 | ❓ 无 token | style.css:1260 |
| `rgba(240,96,184,0.14)` | 1 | ❓ 无 token | style.css:1261 |
| `rgba(200,152,42,0.35)` | 1 | ❓ 无 token | style.css:1265 |
| `rgba(224,176,64,0.06)` | 1 | ❓ 无 token | style.css:1266 |
| `rgba(200,152,42,0.1)` | 1 | ❓ 无 token | style.css:1267 |
| `rgba(224,176,64,0.15)` | 1 | ❓ 无 token | style.css:1267 |
| `rgba(0,180,255,0.4)` | 1 | ❓ 无 token | style.css:1307 |
| `rgba(168,85,247,0.4)` | 1 | ❓ 无 token | style.css:1313 |
| `rgba(168,85,247,0.8)` | 1 | ❓ 无 token | style.css:1368 |
| `rgba(168,85,247,0.5)` | 1 | ❓ 无 token | style.css:1395 |
| `rgba(192,132,252,0.7)` | 1 | ❓ 无 token | style.css:1415 |
| `rgba(192,132,252,0.0)` | 1 | ❓ 无 token | style.css:1416 |
| `rgba(255,255,255,0.65)` | 1 | ❓ 无 token | style.css:1699 |
| `rgba(20,20,34,0.5)` | 1 | ❓ 无 token | style.css:1764 |
| `rgba(8,8,18,0.72)` | 1 | ❓ 无 token | style.css:1889 |
| `rgba(192,132,252,0.25)` | 1 | ❓ 无 token | style.css:2109 |
| `rgba(90,50,200,0.38)` | 1 | ❓ 无 token | style.css:2179 |
| `rgba(70,30,160,0.24)` | 1 | ❓ 无 token | style.css:2181 |
| `rgba(0,140,230,0.2)` | 1 | ❓ 无 token | style.css:2183 |
| `rgba(200,40,170,0.3)` | 1 | ❓ 无 token | style.css:2185 |
| `rgba(20,80,220,0.24)` | 1 | ❓ 无 token | style.css:2187 |
| `rgba(220,30,150,0.22)` | 1 | ❓ 无 token | style.css:2189 |
| `rgba(0,180,210,0.07)` | 1 | ❓ 无 token | style.css:2191 |
| `rgba(111,158,195,0.04)` | 1 | ❓ 无 token | archive.html:40 |
| `rgba(111,158,195,0.28)` | 1 | ❓ 无 token | archive.html:47 |
| `rgba(111,158,195,0.85)` | 1 | ❓ 无 token | archive.html:62 |
| `rgba(111,158,195,0.08)` | 1 | ❓ 无 token | archive.html:132 |
| `rgba(136,128,168,0.07)` | 1 | ❓ 无 token | archive.html:142 |
| `rgba(139,52,220,0.09)` | 1 | ❓ 无 token | barvision.html:84 |
| `rgba(100,120,220,0.16)` | 1 | ❓ 无 token | barvision.html:96 |
| `rgba(100,80,200,0.1)` | 1 | ❓ 无 token | barvision.html:96 |
| `rgba(192,132,252,0.1)` | 1 | ❓ 无 token | barvision.html:113 |
| `rgba(255,255,255,0.06)` | 1 | ❓ 无 token | barvision.html:114 |
| `rgba(192,132,252,0.98)` | 1 | ❓ 无 token | barvision.html:125 |
| `rgba(192,132,252,0.22)` | 1 | ❓ 无 token | barvision.html:126 |
| `rgba(168,85,247,0.36)` | 1 | ❓ 无 token | barvision.html:127 |
| `rgba(139,52,220,0.16)` | 1 | ❓ 无 token | barvision.html:128 |
| `rgba(168,85,247,0.05)` | 1 | ❓ 无 token | barvision.html:129 |
| `rgba(100,120,220,0.12)` | 1 | ❓ 无 token | barvision.html:259 |
| `rgba(100,80,200,0.07)` | 1 | ❓ 无 token | barvision.html:259 |
| `rgba(255,255,255,0.022)` | 1 | ❓ 无 token | bbl.html:45 |
| `rgba(0,0,0,0.4)` | 1 | ❓ 无 token | bbl.html:126 |
| `rgba(212,152,64,0.3)` | 1 | ❓ 无 token | bbl.html:327 |
| `rgba(168,85,247,0.13)` | 1 | ❓ 无 token | bbl.html:479 |
| `rgba(168,85,247,0.14)` | 1 | ❓ 无 token | member.html:23 |
| `rgba(111,158,195,0.1)` | 1 | ❓ 无 token | member.html:69 |
| `rgba(200,145,55,0.7)` | 1 | ❓ 无 token | member.html:71 |
| `rgba(212,152,64,0.4)` | 1 | ❓ 无 token | member.html:179 |
| `rgba(240,96,184,0.4)` | 1 | ❓ 无 token | member.html:180 |
| `rgba(168,85,247,0.11)` | 1 | ❓ 无 token | barvision/hof.html:75 |
| `rgba(224,64,160,0.05)` | 1 | ❓ 无 token | barvision/hof.html:75 |
| `rgba(240,96,184,0.3)` | 1 | ❓ 无 token | barvision/hof.html:96 |
| `rgba(192,132,252,0.3)` | 1 | ❓ 无 token | barvision/hof.html:97 |
| `rgba(168,85,247,0.26)` | 1 | ❓ 无 token | barvision/2026/events.html:22 |
| `rgba(139,52,220,0.1)` | 1 | ❓ 无 token | barvision/2026/events.html:91 |
| `rgba(224,64,160,0.35)` | 1 | ❓ 无 token | barvision/2026/events.html:173 |
| `rgba(255,255,255,0.03)` | 1 | ❓ 无 token | barvision/2026/events.html:174 |
| `rgba(240,96,184,0.6)` | 1 | ❓ 无 token | barvision/2026/events.html:177 |
| `rgba(240,96,184,0.55)` | 1 | ❓ 无 token | barvision/2026/events.html:180 |
| `rgba(180,160,255,0.02)` | 1 | ❓ 无 token | barvision/2026/events.html:239 |
| `rgba(224,64,160,0.28)` | 1 | ❓ 无 token | barvision/2026/events.html:272 |
| `rgba(212,168,50,0.04)` | 1 | ❓ 无 token | barvision/2026/events.html:287 |
| `rgba(224,64,160,0.3)` | 1 | → var(--clr-pink-glow) | barvision/2026/events.html:307 |
| `rgba(0,180,255,0.3)` | 1 | → var(--clr-accent-glow) | barvision/2026/events.html:308 |
| `rgba(180,160,255,0.06)` | 1 | ❓ 无 token | barvision/2026/events.html:310 |
| `rgba(212,168,50,0.12)` | 1 | ❓ 无 token | barvision/2026/events.html:311 |
| `rgba(212,168,50,0.05)` | 1 | ❓ 无 token | barvision/2026/events.html:345 |
| `rgba(240,238,255,0.75)` | 1 | ❓ 无 token | barvision/2026/events.html:993 |
| `rgba(212,168,50,0.2)` | 1 | ❓ 无 token | bbl/hof.html:23 |
| `rgba(144,184,208,0.2)` | 1 | ❓ 无 token | bbl/hof.html:118 |
| `rgba(224,168,112,0.18)` | 1 | ❓ 无 token | bbl/hof.html:119 |
| `rgba(212,168,50,0.08)` | 1 | ❓ 无 token | bbl/hof.html:129 |
| `rgba(144,184,208,0.16)` | 1 | ❓ 无 token | bbl/hof.html:130 |
| `rgba(224,168,112,0.14)` | 1 | ❓ 无 token | bbl/hof.html:131 |
| `rgba(180,160,255,0.07)` | 1 | ❓ 无 token | bbl/hof.html:174 |
| `rgba(212,168,50,0.06)` | 1 | ❓ 无 token | bbl/hof.html:181 |
| `rgba(144,184,208,0.06)` | 1 | ❓ 无 token | bbl/hof.html:182 |
| `rgba(224,168,112,0.06)` | 1 | ❓ 无 token | bbl/hof.html:183 |
| `rgba(245,200,64,0.75)` | 1 | ❓ 无 token | bbl/hof.html:202 |
| `rgba(245,200,64,0.42)` | 1 | ❓ 无 token | bbl/hof.html:204 |
| `rgba(144,184,208,0.8)` | 1 | ❓ 无 token | bbl/hof.html:206 |
| `rgba(144,184,208,0.7)` | 1 | ❓ 无 token | bbl/hof.html:207 |
| `rgba(144,184,208,0.42)` | 1 | ❓ 无 token | bbl/hof.html:208 |
| `rgba(224,168,112,0.8)` | 1 | ❓ 无 token | bbl/hof.html:210 |
| `rgba(224,168,112,0.7)` | 1 | ❓ 无 token | bbl/hof.html:211 |
| `rgba(224,168,112,0.42)` | 1 | ❓ 无 token | bbl/hof.html:212 |
| `rgba(168,85,247,0.38)` | 1 | ❓ 无 token | bbl/hof.html:301 |
| `rgba(168,85,247,0.06)` | 1 | ❓ 无 token | bbl/hof.html:303 |
| `rgba(245,200,64,0.65)` | 1 | ❓ 无 token | bbl/hof.html:430 |
| `rgba(144,184,208,0.65)` | 1 | ❓ 无 token | bbl/hof.html:431 |
| `rgba(224,168,112,0.65)` | 1 | ❓ 无 token | bbl/hof.html:432 |
| `rgba(180,160,255,0.03)` | 1 | ❓ 无 token | bbl/hof.html:459 |
| `rgba(212,168,50,0.32)` | 1 | ❓ 无 token | bbl/hof.html:472 |
| `rgba(144,184,208,0.45)` | 1 | ❓ 无 token | bbl/hof.html:473 |
| `rgba(224,168,112,0.4)` | 1 | ❓ 无 token | bbl/hof.html:474 |

## ③ 字号 Font-size

| px | 次数 | 在档? | 位置示例 |
|---|---|---|---|
| 7px | 1 | 🔸 离散 | style.css:635 |
| 9px | 6 | 🔸 离散 | style.css:1077 · style.css:1293 · member.html:165 · barvision/hof.html:147 · barvision/2026/events.html:304 … (+1) |
| 10px | 40 | ✅ | style.css:313 · style.css:320 · style.css:673 · style.css:1019 · style.css:1027 … (+35) |
| 11px | 57 | ✅ | style.css:135 · style.css:160 · style.css:578 · style.css:604 · style.css:1284 … (+52) |
| 12px | 37 | ✅ | style.css:482 · style.css:621 · style.css:997 · style.css:1072 · style.css:1201 … (+32) |
| 12.5px | 4 | ✅ | barvision/2026/events.html:130 · barvision/2026/events.html:261 · barvision/2026/events.html:391 · barvision/2026/events.html:992 |
| 13px | 36 | ✅ | style.css:241 · style.css:511 · style.css:795 · style.css:856 · style.css:1117 … (+31) |
| 13.5px | 1 | ✅ | barvision/2026/events.html:299 |
| 14px | 11 | ✅ | style.css:787 · style.css:989 · style.css:1501 · style.css:1683 · bbl.html:261 … (+6) |
| 15px | 9 | ✅ | style.css:372 · style.css:401 · style.css:409 · archive.html:62 · barvision.html:59 … (+4) |
| 16px | 13 | ✅ | style.css:109 · style.css:722 · style.css:839 · style.css:1157 · style.css:1542 … (+8) |
| 17px | 1 | 🔸 离散 | style.css:494 |
| 18px | 2 | ✅ | style.css:744 · bbl/hof.html:308 |
| 20px | 1 | 🔸 离散 | barvision/2026/events.html:348 |
| 21px | 1 | 🔸 离散 | barvision/2026/events.html:276 |
| 22px | 4 | ✅ | style.css:902 · bbl.html:501 · member.html:232 · barvision/2026/events.html:189 |
| 24px | 7 | ✅ | barvision/2026/events.html:166 · barvision/2026/events.html:254 · barvision/2026/events.html:349 · bbl/hof.html:135 · bbl/hof.html:289 … (+2) |
| 26px | 4 | ✅ | bbl.html:321 · member.html:144 · barvision/2026/events.html:331 · bbl/hof.html:496 |
| 28px | 5 | ✅ | style.css:778 · style.css:1375 · style.css:1632 · barvision/2026/events.html:408 · bbl/hof.html:309 |
| 30px | 2 | 🔸 离散 | archive.html:153 · barvision/2026/events.html:451 |
| 32px | 3 | ✅ | index.html:120 · barvision/hof.html:119 · barvision/2026/events.html:202 |
| 34px | 1 | 🔸 离散 | barvision/hof.html:88 |
| 36px | 3 | 🔸 离散 | style.css:572 · barvision/2026/events.html:435 · bbl/hof.html:564 |
| 40px | 2 | ✅ | style.css:1604 · barvision/2026/events.html:335 |
| 42px | 1 | 🔸 离散 | member.html:215 |
| 44px | 2 | ✅ | barvision/2026/events.html:450 · bbl/hof.html:90 |
| 52px | 2 | ✅ | style.css:1918 · barvision/2026/events.html:434 |
| 64px | 2 | ✅ | style.css:1900 · barvision/2026/events.html:332 |
| 80px | 1 | 🔸 离散 | barvision/hof.html:84 |
| 200px | 4 | 🔸 离散 | archive.html:39 · barvision/hof.html:40 · barvision/2026/events.html:35 · bbl/hof.html:42 |
| 220px | 1 | 🔸 离散 | bbl.html:42 |
| 280px | 1 | 🔸 离散 | style.css:818 |

## ④ 间距 Spacing（margin/padding/gap 内各 px）

| px | 次数 | 在档? | 位置示例 |
|---|---|---|---|
| 0px | 2 | 🔸 离散 | style.css:2258 · bbl.html:359 |
| 1px | 20 | 🔸 离散 | style.css:273 · style.css:292 · style.css:1010 · style.css:2272 · bbl.html:410 … (+15) |
| 2px | 29 | 🔸 离散 | style.css:582 · style.css:676 · style.css:867 · style.css:1006 · style.css:1059 … (+24) |
| 3px | 21 | 🔸 离散 | style.css:1093 · style.css:1297 · style.css:1297 · style.css:1497 · style.css:2092 … (+16) |
| 4px | 32 | ✅ | style.css:139 · style.css:272 · style.css:333 · style.css:366 · style.css:791 … (+27) |
| 5px | 14 | 🔸 离散 | style.css:1297 · style.css:1431 · style.css:2267 · archive.html:177 · archive.html:177 … (+9) |
| 6px | 37 | 🔸 离散 | style.css:286 · style.css:855 · style.css:886 · style.css:1007 · style.css:1242 … (+32) |
| 7px | 15 | 🔸 离散 | style.css:286 · style.css:397 · style.css:676 · style.css:1252 · bbl.html:233 … (+10) |
| 8px | 55 | ✅ | style.css:169 · style.css:510 · style.css:1093 · style.css:1206 · style.css:1218 … (+50) |
| 9px | 7 | 🔸 离散 | archive.html:120 · barvision/2026/events.html:217 · barvision/2026/events.html:229 · barvision/2026/events.html:270 · barvision/2026/events.html:382 … (+2) |
| 10px | 31 | 🔸 离散 | style.css:139 · style.css:878 · style.css:1852 · style.css:2163 · archive.html:127 … (+26) |
| 11px | 3 | 🔸 离散 | archive.html:109 · barvision/2026/events.html:230 · bbl/hof.html:366 |
| 12px | 38 | ✅ | style.css:514 · style.css:717 · style.css:885 · style.css:1337 · style.css:1700 … (+33) |
| 13px | 4 | 🔸 离散 | style.css:2064 · barvision/hof.html:179 · barvision/2026/events.html:481 · bbl/hof.html:541 |
| 14px | 46 | 🔸 离散 | style.css:375 · style.css:388 · style.css:886 · style.css:1212 · style.css:1243 … (+41) |
| 16px | 43 | ✅ | style.css:286 · style.css:725 · style.css:763 · style.css:1334 · style.css:1356 … (+38) |
| 18px | 15 | 🔸 离散 | archive.html:104 · archive.html:149 · barvision.html:57 · bbl.html:89 · bbl.html:557 … (+10) |
| 20px | 32 | 🔸 离散 | style.css:562 · style.css:603 · style.css:764 · style.css:1160 · style.css:1624 … (+27) |
| 22px | 6 | 🔸 离散 | style.css:1173 · archive.html:164 · barvision.html:190 · barvision/2026/events.html:405 · barvision/2026/events.html:405 … (+1) |
| 23px | 1 | 🔸 离散 | bbl.html:464 |
| 24px | 41 | ✅ | style.css:236 · style.css:488 · style.css:514 · style.css:842 · style.css:1687 … (+36) |
| 25px | 3 | 🔸 离散 | bbl.html:464 · member.html:15 · member.html:110 |
| 26px | 1 | 🔸 离散 | barvision/2026/events.html:447 |
| 28px | 14 | 🔸 离散 | style.css:849 · style.css:1173 · style.css:1212 · style.css:1334 · style.css:1568 … (+9) |
| 30px | 5 | 🔸 离散 | bbl.html:233 · bbl.html:503 · member.html:95 · barvision/2026/events.html:448 · bbl/hof.html:511 |
| 32px | 11 | ✅ | style.css:871 · barvision.html:63 · barvision.html:94 · bbl.html:102 · bbl.html:451 … (+6) |
| 36px | 9 | 🔸 离散 | style.css:624 · barvision.html:90 · member.html:35 · member.html:46 · barvision/2026/events.html:73 … (+4) |
| 38px | 1 | 🔸 离散 | style.css:1908 |
| 40px | 10 | 🔸 离散 | style.css:497 · archive.html:43 · barvision.html:39 · bbl.html:58 · barvision/hof.html:47 … (+5) |
| 44px | 1 | 🔸 离散 | barvision/2026/events.html:445 |
| 48px | 9 | ✅ | style.css:808 · barvision.html:94 · barvision.html:230 · member.html:15 · barvision/2026/events.html:110 … (+4) |
| 52px | 2 | 🔸 离散 | style.css:603 · barvision/2026/events.html:264 |
| 56px | 2 | 🔸 离散 | barvision/2026/events.html:360 · barvision/2026/events.html:428 |
| 60px | 1 | 🔸 离散 | barvision/2026/events.html:429 |
| 64px | 3 | ✅ | bbl.html:209 · barvision/2026/events.html:16 · barvision/2026/events.html:118 |
| 72px | 5 | 🔸 离散 | archive.html:16 · barvision.html:16 · bbl.html:16 · barvision/hof.html:16 · bbl/hof.html:16 |
| 80px | 3 | 🔸 离散 | member.html:110 · barvision/2026/events.html:16 · barvision/2026/events.html:109 |
| 210px | 1 | 🔸 离散 | bbl.html:494 |
| 236px | 1 | 🔸 离散 | bbl.html:368 |

## ⑤ 圆角 Radius

| 值 | 次数 | 位置示例 |
|---|---|---|
| `0` | 2 | style.css:387 · barvision/2026/events.html:136 |
| `2px` | 6 | style.css:1094 · style.css:1298 · member.html:170 · barvision/hof.html:148 · barvision/2026/events.html:270 … (+1) |
| `3px` | 9 | style.css:140 · style.css:1045 · archive.html:128 · archive.html:179 · bbl.html:339 … (+4) |
| `4px` | 18 | style.css:287 · style.css:515 · style.css:889 · style.css:1254 · style.css:1355 … (+13) |
| `50%` | 10 | style.css:864 · style.css:1228 · style.css:1408 · barvision.html:144 · barvision/hof.html:187 … (+5) |
| `5px` | 1 | style.css:677 |
| `6px` | 12 | style.css:767 · style.css:1567 · barvision.html:177 · bbl.html:292 · barvision/2026/events.html:77 … (+7) |
| `8px` | 14 | style.css:1167 · archive.html:79 · barvision.html:93 · bbl.html:124 · member.html:123 … (+9) |
| `8px 8px 0 0` | 1 | archive.html:88 |

## ⑥ 硬编码字体栈（未用 var(--font-*)）

- `'Bebas Neue', Impact, 'Arial Black', Arial, sans-serif !important` × 1 — style.css:2251
