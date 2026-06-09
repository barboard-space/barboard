# 设计值审计报告（自动生成）

扫描 11 个文件（style.css + 生产页面；已排除 member/N stub 与 styleguide*）。

> 只读分析。`→ var(--x)` = 可替换为现有令牌；`❓` = 无对应令牌、待拍板。


## ① :root 令牌 — 同值合并候选

（无）


## ②a 颜色 · HEX（品牌色 — 主要 tokenize 目标）

| 值 | 次数 | 对应令牌 | 位置示例 |
|---|---|---|---|
| `#6a6488` | 3 | ❓ 无 token | style.css:2204 · style.css:2222 · style.css:2228 |
| `#0a0820` | 2 | ❓ 无 token | barvision.html:91 · barvision.html:249 |
| `#16104a` | 2 | ❓ 无 token | barvision.html:91 · barvision.html:249 |
| `#0c0a32` | 2 | ❓ 无 token | barvision.html:91 · barvision.html:249 |
| `#7ea4bc` | 1 | ❓ 无 token | style.css:929 |
| `#ccdde8` | 1 | ❓ 无 token | style.css:938 |
| `#d09068` | 1 | ❓ 无 token | style.css:954 |
| `#fde8d0` | 1 | ❓ 无 token | style.css:963 |
| `#080818` | 1 | ❓ 无 token | style.css:1171 |
| `#12103a` | 1 | ❓ 无 token | style.css:1171 |
| `#0e0a28` | 1 | ❓ 无 token | style.css:1171 |
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
| `rgba(168,85,247,0.22)` | 7 | ❓ 无 token | style.css:533 · archive.html:138 · barvision.html:22 · bbl.html:23 … (+3) |
| `rgba(192,132,252,0.4)` | 5 | ❓ 无 token | style.css:1420 · barvision.html:44 · bbl.html:68 · member.html:178 … (+1) |
| `rgba(168,85,247,0.08)` | 5 | ❓ 无 token | archive.html:137 · bbl.html:298 · barvision/hof.html:23 · barvision/2026/events.html:234 … (+1) |
| `rgba(224,64,160,0.1)` | 5 | ❓ 无 token | bbl.html:24 · barvision/2026/events.html:23 · barvision/2026/events.html:256 · barvision/2026/events.html:272 … (+1) |
| `rgba(168,85,247,0.28)` | 4 | ❓ 无 token | style.css:302 · style.css:1783 · style.css:1796 · barvision/hof.html:76 |
| `rgba(212,168,50,0.07)` | 4 | ❓ 无 token | style.css:895 · bbl/hof.html:310 · bbl/hof.html:409 · bbl/hof.html:476 |
| `rgba(255,255,255,0.04)` | 4 | ❓ 无 token | style.css:1183 · style.css:1184 · barvision.html:104 · barvision.html:105 |
| `rgba(168,85,247,0.18)` | 4 | ❓ 无 token | style.css:1368 · barvision.html:84 · barvision.html:205 · member.html:138 |
| `rgba(168,85,247,0.1)` | 4 | ❓ 无 token | style.css:1395 · bbl.html:126 · bbl.html:482 · barvision/2026/events.html:309 |
| `rgba(168,85,247,0.07)` | 4 | ❓ 无 token | archive.html:24 · barvision.html:182 · barvision/2026/events.html:164 · bbl/hof.html:304 |
| `rgba(144,184,208,0.05)` | 4 | ❓ 无 token | bbl/hof.html:130 · bbl/hof.html:311 · bbl/hof.html:410 · bbl/hof.html:477 |
| `rgba(224,168,112,0.05)` | 4 | ❓ 无 token | bbl/hof.html:131 · bbl/hof.html:312 · bbl/hof.html:411 · bbl/hof.html:478 |
| `rgba(192,132,252,0.45)` | 3 | ❓ 无 token | style.css:164 · barvision.html:159 · bbl.html:284 |
| `rgba(168,85,247,0.2)` | 3 | ❓ 无 token | style.css:308 · style.css:1396 · barvision/2026/events.html:91 |
| `rgba(168,85,247,0.25)` | 3 | ❓ 无 token | style.css:539 · style.css:1369 · member.html:138 |
| `rgba(212,168,50,0.22)` | 3 | ❓ 无 token | style.css:895 · barvision/hof.html:22 · bbl/hof.html:129 |
| `rgba(224,176,64,0.85)` | 3 | ❓ 无 token | style.css:917 · style.css:922 · bbl.html:443 |
| `rgba(148,196,220,0.85)` | 3 | ❓ 无 token | style.css:942 · style.css:947 · bbl.html:445 |
| `rgba(224,160,100,0.8)` | 3 | ❓ 无 token | style.css:967 · style.css:972 · bbl.html:447 |
| `rgba(240,96,184,0.0)` | 3 | ❓ 无 token | style.css:1235 · barvision/2026/events.html:181 · barvision/2026/events.html:182 |
| `rgba(192,132,252,0.15)` | 3 | ❓ 无 token | style.css:1857 · barvision.html:154 · barvision.html:251 |
| `rgba(0,180,255,0.06)` | 3 | ❓ 无 token | bbl.html:25 · barvision/2026/events.html:24 · bbl/hof.html:25 |
| `rgba(240,238,255,0.85)` | 3 | ❓ 无 token | bbl.html:434 · bbl.html:1018 · bbl.html:1018 |
| `rgba(245,200,64,0.7)` | 3 | ❓ 无 token | barvision/hof.html:51 · bbl/hof.html:60 · bbl/hof.html:203 |
| `rgba(212,168,50,0.3)` | 3 | ❓ 无 token | barvision/2026/events.html:274 · barvision/2026/events.html:311 · barvision/2026/events.html:345 |
| `rgba(212,168,50,0.13)` | 3 | ❓ 无 token | bbl/hof.html:310 · bbl/hof.html:409 · bbl/hof.html:476 |
| `rgba(144,184,208,0.11)` | 3 | ❓ 无 token | bbl/hof.html:311 · bbl/hof.html:410 · bbl/hof.html:477 |
| `rgba(224,168,112,0.11)` | 3 | ❓ 无 token | bbl/hof.html:312 · bbl/hof.html:411 · bbl/hof.html:478 |
| `rgba(0,0,0,0.3)` | 2 | ❓ 无 token | style.css:450 · style.css:451 |
| `rgba(0,0,0,0.75)` | 2 | ❓ 无 token | style.css:450 · style.css:451 |
| `rgba(255,255,255,0.025)` | 2 | ❓ 无 token | style.css:460 · style.css:461 |
| `rgba(192,132,252,0.5)` | 2 | ❓ 无 token | style.css:486 · member.html:45 |
| `rgba(224,64,160,0.12)` | 2 | → var(--clr-pink-dim) | style.css:533 · barvision.html:23 |
| `rgba(0,0,0,0.35)` | 2 | ❓ 无 token | style.css:679 · member.html:138 |
| `rgba(240,96,184,0.95)` | 2 | ❓ 无 token | style.css:1034 · bbl.html:440 |
| `rgba(200,152,42,0.12)` | 2 | ❓ 无 token | style.css:1103 · style.css:1265 |
| `rgba(240,238,255,0.8)` | 2 | ❓ 无 token | style.css:1123 · index.html:455 |
| `rgba(0,180,255,0.1)` | 2 | ❓ 无 token | style.css:1141 · barvision/2026/events.html:308 |
| `rgba(0,180,255,0.08)` | 2 | ❓ 无 token | style.css:1368 · barvision/2026/events.html:273 |
| `rgba(168,85,247,0.35)` | 2 | ❓ 无 token | style.css:1369 · bbl.html:480 |
| `rgba(0,180,255,0.04)` | 2 | ❓ 无 token | style.css:1395 · member.html:24 |
| `rgba(168,85,247,0.12)` | 2 | → var(--clr-violet-dim) | style.css:1396 · bbl/hof.html:24 |
| `rgba(192,132,252,0.9)` | 2 | ❓ 无 token | style.css:1409 · barvision.html:146 |
| `rgba(192,132,252,0.65)` | 2 | ❓ 无 token | style.css:1768 · style.css:1804 |
| `rgba(111,158,195,0.22)` | 2 | ❓ 无 token | archive.html:22 · archive.html:133 |
| `rgba(224,64,160,0.08)` | 2 | ❓ 无 token | archive.html:23 · barvision/2026/events.html:173 |
| `rgba(111,158,195,0.7)` | 2 | ❓ 无 token | archive.html:47 · member.html:69 |
| `rgba(0,180,255,0.05)` | 2 | ❓ 无 token | barvision.html:24 · barvision/hof.html:24 |
| `rgba(100,140,230,0.55)` | 2 | ❓ 无 token | barvision.html:92 · barvision.html:247 |
| `rgba(120,160,240,0.08)` | 2 | ❓ 无 token | barvision.html:96 · barvision.html:248 |
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
| `rgba(8,8,18,0.0)` | 1 | ❓ 无 token | style.css:206 |
| `rgba(8,8,18,0.95)` | 1 | ❓ 无 token | style.css:218 |
| `rgba(224,64,160,0.5)` | 1 | ❓ 无 token | style.css:308 |
| `rgba(224,64,160,0.55)` | 1 | ❓ 无 token | style.css:539 |
| `rgba(240,238,255,0.65)` | 1 | ❓ 无 token | style.css:544 |
| `rgba(240,238,255,0.82)` | 1 | ❓ 无 token | style.css:659 |
| `rgba(240,238,255,0.09)` | 1 | ❓ 无 token | style.css:717 |
| `rgba(255,255,255,0.02)` | 1 | ❓ 无 token | style.css:820 |
| `rgba(245,200,64,0.35)` | 1 | ❓ 无 token | style.css:894 |
| `rgba(212,168,50,0.15)` | 1 | ❓ 无 token | style.css:896 |
| `rgba(224,176,64,0.7)` | 1 | ❓ 无 token | style.css:909 |
| `rgba(140,168,188,0.28)` | 1 | ❓ 无 token | style.css:927 |
| `rgba(110,150,178,0.15)` | 1 | ❓ 无 token | style.css:928 |
| `rgba(110,150,178,0.05)` | 1 | ❓ 无 token | style.css:928 |
| `rgba(110,150,178,0.1)` | 1 | ❓ 无 token | style.css:929 |
| `rgba(110,170,204,0.5)` | 1 | ❓ 无 token | style.css:934 |
| `rgba(196,128,74,0.32)` | 1 | ❓ 无 token | style.css:952 |
| `rgba(196,120,68,0.18)` | 1 | ❓ 无 token | style.css:953 |
| `rgba(196,120,68,0.06)` | 1 | ❓ 无 token | style.css:953 |
| `rgba(196,120,68,0.12)` | 1 | ❓ 无 token | style.css:954 |
| `rgba(224,148,84,0.6)` | 1 | ❓ 无 token | style.css:959 |
| `rgba(224,64,160,0.09)` | 1 | ❓ 无 token | style.css:1142 |
| `rgba(240,96,184,0.7)` | 1 | ❓ 无 token | style.css:1234 |
| `rgba(240,96,184,0.45)` | 1 | ❓ 无 token | style.css:1258 |
| `rgba(240,96,184,0.16)` | 1 | ❓ 无 token | style.css:1259 |
| `rgba(240,96,184,0.07)` | 1 | ❓ 无 token | style.css:1259 |
| `rgba(240,96,184,0.14)` | 1 | ❓ 无 token | style.css:1260 |
| `rgba(200,152,42,0.35)` | 1 | ❓ 无 token | style.css:1264 |
| `rgba(224,176,64,0.06)` | 1 | ❓ 无 token | style.css:1265 |
| `rgba(200,152,42,0.1)` | 1 | ❓ 无 token | style.css:1266 |
| `rgba(224,176,64,0.15)` | 1 | ❓ 无 token | style.css:1266 |
| `rgba(0,180,255,0.4)` | 1 | ❓ 无 token | style.css:1306 |
| `rgba(168,85,247,0.4)` | 1 | ❓ 无 token | style.css:1312 |
| `rgba(168,85,247,0.8)` | 1 | ❓ 无 token | style.css:1367 |
| `rgba(168,85,247,0.5)` | 1 | ❓ 无 token | style.css:1394 |
| `rgba(192,132,252,0.7)` | 1 | ❓ 无 token | style.css:1414 |
| `rgba(192,132,252,0.0)` | 1 | ❓ 无 token | style.css:1415 |
| `rgba(255,255,255,0.65)` | 1 | ❓ 无 token | style.css:1698 |
| `rgba(20,20,34,0.5)` | 1 | ❓ 无 token | style.css:1763 |
| `rgba(8,8,18,0.72)` | 1 | ❓ 无 token | style.css:1888 |
| `rgba(192,132,252,0.25)` | 1 | ❓ 无 token | style.css:2108 |
| `rgba(90,50,200,0.38)` | 1 | ❓ 无 token | style.css:2178 |
| `rgba(70,30,160,0.24)` | 1 | ❓ 无 token | style.css:2180 |
| `rgba(0,140,230,0.2)` | 1 | ❓ 无 token | style.css:2182 |
| `rgba(200,40,170,0.3)` | 1 | ❓ 无 token | style.css:2184 |
| `rgba(20,80,220,0.24)` | 1 | ❓ 无 token | style.css:2186 |
| `rgba(220,30,150,0.22)` | 1 | ❓ 无 token | style.css:2188 |
| `rgba(0,180,210,0.07)` | 1 | ❓ 无 token | style.css:2190 |
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
| `rgba(100,120,220,0.12)` | 1 | ❓ 无 token | barvision.html:248 |
| `rgba(100,80,200,0.07)` | 1 | ❓ 无 token | barvision.html:248 |
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
| 7px | 1 | 🔸 离散 | style.css:634 |
| 9px | 6 | 🔸 离散 | style.css:1076 · style.css:1292 · member.html:165 · barvision/hof.html:147 · barvision/2026/events.html:304 … (+1) |
| 10px | 40 | ✅ | style.css:312 · style.css:319 · style.css:672 · style.css:1018 · style.css:1026 … (+35) |
| 11px | 57 | ✅ | style.css:134 · style.css:159 · style.css:577 · style.css:603 · style.css:1283 … (+52) |
| 12px | 37 | ✅ | style.css:481 · style.css:620 · style.css:996 · style.css:1071 · style.css:1200 … (+32) |
| 12.5px | 4 | ✅ | barvision/2026/events.html:130 · barvision/2026/events.html:261 · barvision/2026/events.html:391 · barvision/2026/events.html:992 |
| 13px | 36 | ✅ | style.css:240 · style.css:510 · style.css:794 · style.css:855 · style.css:1116 … (+31) |
| 13.5px | 1 | ✅ | barvision/2026/events.html:299 |
| 14px | 11 | ✅ | style.css:786 · style.css:988 · style.css:1500 · style.css:1682 · bbl.html:261 … (+6) |
| 15px | 9 | ✅ | style.css:371 · style.css:400 · style.css:408 · archive.html:62 · barvision.html:59 … (+4) |
| 16px | 13 | ✅ | style.css:108 · style.css:721 · style.css:838 · style.css:1156 · style.css:1541 … (+8) |
| 17px | 1 | 🔸 离散 | style.css:493 |
| 18px | 2 | ✅ | style.css:743 · bbl/hof.html:308 |
| 20px | 1 | 🔸 离散 | barvision/2026/events.html:348 |
| 21px | 1 | 🔸 离散 | barvision/2026/events.html:276 |
| 22px | 4 | ✅ | style.css:901 · bbl.html:501 · member.html:232 · barvision/2026/events.html:189 |
| 24px | 7 | ✅ | barvision/2026/events.html:166 · barvision/2026/events.html:254 · barvision/2026/events.html:349 · bbl/hof.html:135 · bbl/hof.html:289 … (+2) |
| 26px | 4 | ✅ | bbl.html:321 · member.html:144 · barvision/2026/events.html:331 · bbl/hof.html:496 |
| 28px | 5 | ✅ | style.css:777 · style.css:1374 · style.css:1631 · barvision/2026/events.html:408 · bbl/hof.html:309 |
| 30px | 2 | 🔸 离散 | archive.html:153 · barvision/2026/events.html:451 |
| 32px | 3 | ✅ | index.html:120 · barvision/hof.html:119 · barvision/2026/events.html:202 |
| 34px | 1 | 🔸 离散 | barvision/hof.html:88 |
| 36px | 3 | 🔸 离散 | style.css:571 · barvision/2026/events.html:435 · bbl/hof.html:564 |
| 40px | 2 | ✅ | style.css:1603 · barvision/2026/events.html:335 |
| 42px | 1 | 🔸 离散 | member.html:215 |
| 44px | 2 | ✅ | barvision/2026/events.html:450 · bbl/hof.html:90 |
| 52px | 2 | ✅ | style.css:1917 · barvision/2026/events.html:434 |
| 64px | 2 | ✅ | style.css:1899 · barvision/2026/events.html:332 |
| 80px | 1 | 🔸 离散 | barvision/hof.html:84 |
| 200px | 4 | 🔸 离散 | archive.html:39 · barvision/hof.html:40 · barvision/2026/events.html:35 · bbl/hof.html:42 |
| 220px | 1 | 🔸 离散 | bbl.html:42 |
| 280px | 1 | 🔸 离散 | style.css:817 |

## ④ 间距 Spacing（margin/padding/gap 内各 px）

| px | 次数 | 在档? | 位置示例 |
|---|---|---|---|
| 0px | 2 | 🔸 离散 | style.css:2257 · bbl.html:359 |
| 1px | 20 | 🔸 离散 | style.css:272 · style.css:291 · style.css:1009 · style.css:2271 · bbl.html:410 … (+15) |
| 2px | 29 | 🔸 离散 | style.css:581 · style.css:675 · style.css:866 · style.css:1005 · style.css:1058 … (+24) |
| 3px | 21 | 🔸 离散 | style.css:1092 · style.css:1296 · style.css:1296 · style.css:1496 · style.css:2091 … (+16) |
| 4px | 32 | ✅ | style.css:138 · style.css:271 · style.css:332 · style.css:365 · style.css:790 … (+27) |
| 5px | 14 | 🔸 离散 | style.css:1296 · style.css:1430 · style.css:2266 · archive.html:177 · archive.html:177 … (+9) |
| 6px | 37 | 🔸 离散 | style.css:285 · style.css:854 · style.css:885 · style.css:1006 · style.css:1241 … (+32) |
| 7px | 15 | 🔸 离散 | style.css:285 · style.css:396 · style.css:675 · style.css:1251 · bbl.html:233 … (+10) |
| 8px | 55 | ✅ | style.css:168 · style.css:509 · style.css:1092 · style.css:1205 · style.css:1217 … (+50) |
| 9px | 7 | 🔸 离散 | archive.html:120 · barvision/2026/events.html:217 · barvision/2026/events.html:229 · barvision/2026/events.html:270 · barvision/2026/events.html:382 … (+2) |
| 10px | 31 | 🔸 离散 | style.css:138 · style.css:877 · style.css:1851 · style.css:2162 · archive.html:127 … (+26) |
| 11px | 3 | 🔸 离散 | archive.html:109 · barvision/2026/events.html:230 · bbl/hof.html:366 |
| 12px | 38 | ✅ | style.css:513 · style.css:716 · style.css:884 · style.css:1336 · style.css:1699 … (+33) |
| 13px | 4 | 🔸 离散 | style.css:2063 · barvision/hof.html:179 · barvision/2026/events.html:481 · bbl/hof.html:541 |
| 14px | 46 | 🔸 离散 | style.css:374 · style.css:387 · style.css:885 · style.css:1211 · style.css:1242 … (+41) |
| 16px | 43 | ✅ | style.css:285 · style.css:724 · style.css:762 · style.css:1333 · style.css:1355 … (+38) |
| 18px | 15 | 🔸 离散 | archive.html:104 · archive.html:149 · barvision.html:57 · bbl.html:89 · bbl.html:557 … (+10) |
| 20px | 32 | 🔸 离散 | style.css:561 · style.css:602 · style.css:763 · style.css:1159 · style.css:1623 … (+27) |
| 22px | 6 | 🔸 离散 | style.css:1172 · archive.html:164 · barvision.html:190 · barvision/2026/events.html:405 · barvision/2026/events.html:405 … (+1) |
| 23px | 1 | 🔸 离散 | bbl.html:464 |
| 24px | 41 | ✅ | style.css:235 · style.css:487 · style.css:513 · style.css:841 · style.css:1686 … (+36) |
| 25px | 3 | 🔸 离散 | bbl.html:464 · member.html:15 · member.html:110 |
| 26px | 1 | 🔸 离散 | barvision/2026/events.html:447 |
| 28px | 14 | 🔸 离散 | style.css:848 · style.css:1172 · style.css:1211 · style.css:1333 · style.css:1567 … (+9) |
| 30px | 5 | 🔸 离散 | bbl.html:233 · bbl.html:503 · member.html:95 · barvision/2026/events.html:448 · bbl/hof.html:511 |
| 32px | 11 | ✅ | style.css:870 · barvision.html:63 · barvision.html:94 · bbl.html:102 · bbl.html:451 … (+6) |
| 36px | 9 | 🔸 离散 | style.css:623 · barvision.html:90 · member.html:35 · member.html:46 · barvision/2026/events.html:73 … (+4) |
| 38px | 1 | 🔸 离散 | style.css:1907 |
| 40px | 10 | 🔸 离散 | style.css:496 · archive.html:43 · barvision.html:39 · bbl.html:58 · barvision/hof.html:47 … (+5) |
| 44px | 1 | 🔸 离散 | barvision/2026/events.html:445 |
| 48px | 9 | ✅ | style.css:807 · barvision.html:94 · barvision.html:219 · member.html:15 · barvision/2026/events.html:110 … (+4) |
| 52px | 2 | 🔸 离散 | style.css:602 · barvision/2026/events.html:264 |
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
| `0` | 2 | style.css:386 · barvision/2026/events.html:136 |
| `2px` | 6 | style.css:1093 · style.css:1297 · member.html:170 · barvision/hof.html:148 · barvision/2026/events.html:270 … (+1) |
| `3px` | 9 | style.css:139 · style.css:1044 · archive.html:128 · archive.html:179 · bbl.html:339 … (+4) |
| `4px` | 18 | style.css:286 · style.css:514 · style.css:888 · style.css:1253 · style.css:1354 … (+13) |
| `50%` | 10 | style.css:863 · style.css:1227 · style.css:1407 · barvision.html:144 · barvision/hof.html:187 … (+5) |
| `5px` | 1 | style.css:676 |
| `6px` | 12 | style.css:766 · style.css:1566 · barvision.html:177 · bbl.html:292 · barvision/2026/events.html:77 … (+7) |
| `8px` | 14 | style.css:1166 · archive.html:79 · barvision.html:93 · bbl.html:124 · member.html:123 … (+9) |
| `8px 8px 0 0` | 1 | archive.html:88 |

## ⑥ 硬编码字体栈（未用 var(--font-*)）

- `'Bebas Neue', Impact, 'Arial Black', Arial, sans-serif !important` × 1 — style.css:2250
