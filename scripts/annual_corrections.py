# -*- coding: utf-8 -*-
"""榜吧年终榜 —— 歌手/歌名规范化「修正表」（单一维护源）

parse_annual_chart.py 导入本文件。**这是年榜数据校对的唯一参考表**：
铺新年份 / 发现新错误时，只需在下面对应表加一行，重跑
    python scripts/parse_annual_chart.py <年> --top N
即自动生效——无需再逐条人工校对，也不消耗算力反复核对。

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
一、系统性规则（写死在 parser，对所有年份/所有条目自动生效，无需登记）
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  1. 撇号缩写小写：'S 'T 'M 'D 'Re 'Ve 'Ll → 's 't 'm ...
     （Title-Case 把撇号后误大写；避开 O'Brien / D'Angelo / T'Aime 等名字/外语——其后非缩写词，不匹配）
  2. feat / ft. → 逗号：多艺人统一「A, B, C」格式
  3. 逗号后补空格（半角逗号）：Sam Smith,Kim Petras → Sam Smith, Kim Petras
  4. 封面缓存归一键 ckey：去大小写/空格/标点后匹配，改格式/大小写不让封面失效
  （亚洲不占位曲名次带 * / ** 由 parser 另行处理，与本表无关）

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
二、需登记的修正表（人工维护；下面每张表加一行即可）
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
说明：这些表是**全局**的（官方艺人写法与年份无关；拼写纠错即便跨年重复命中也无害）。
若将来某年需要冲突性的不同修法，再按年份拆分。
"""

# ── 名字本身含逗号、勿当分隔符拆开 ──────────────────────────────
KEEP = [
    "Tyler, The Creator",
    "Black Country, New Road",
]

# ── 个人榜简称 → space_id 的例外（简称非昵称首字者）──────────────
# 默认规则：昵称去「妈」/首字唯一匹配 members.csv；下列为例外
ABBR_OVERRIDE = {
    "2022": {"时": 27},                 # S妈：简称取自 handle「哈哈哈时光机」
    "2021": {"蓝": 169, "姐": 171},     # 蓝=霍妈(handle 霍蓝Horan)、姐=蓝姐（该年两列并存，需消歧）
    "2020": {"淋檬": 19, "绿萌": 125, "菜": 771},  # 淋檬=柠妈、绿萌=萌妈（同 barvision 昵称别名）；菜=菜妈（不在活跃名单，id 顺延自当时最大 770）
}

# ── 艺人：Title-Case → 官方写法 / 拼写纠错（逐个独立艺人精确匹配）──
# 加新条目：键 = 数据里出现的（错误/Title-Case）写法，值 = 正确写法
ARTIST_FIX = {
    # K-POP 官方风格化（全大写 / camelCase / 全小写）
    "(G)I-Dle": "(G)I-DLE",
    "Aespa": "aespa",
    "Blackpink": "BLACKPINK",
    "Fromis_9": "fromis_9",
    "Itzy": "ITZY",
    "Ive": "IVE",
    "Kep1Er": "Kep1er",
    "Le Sserafim": "LE SSERAFIM",
    "Nayeon": "NAYEON",
    "Newjeans": "NewJeans",
    "Nmixx": "NMIXX",
    "Twice": "TWICE",
    # 欧美艺人官方风格化（缩写全大写 / camelCase）
    "Charli Xcx": "Charli XCX",
    "Jid": "JID",
    "Jvke": "JVKE",
    "Tate Mcrae": "Tate McRae",
    "The Kid Laroi": "The Kid LAROI",
    "Wrs": "WRS",
    "Yeule": "yeule",
    # 名称/拼写错误（源数据写错）
    "Bring Me To Horizon": "Bring Me the Horizon",  # To → the
    "Micheal Ray": "Michael Ray",                    # Micheal → Michael
    "dui": "Taylor Swift, Lana Del Rey",             # 源数据艺人栏错填（Snow On The Beach）
    "Zedd(ft.Katy Perry)": "Zedd",                   # feat 无空格粘连艺人名，拆出主唱（歌名见 SONG_FIX_EXACT「365」）
    "Anderson .paak": "Anderson .Paak",               # 大小写：paak → Paak
    "Lana del rey": "Lana Del Rey",                   # 大小写：源数据同集内其他处已是正确写法，此处不一致
    "YOUNG NUDY": "Young Nudy",                       # 全大写源行（该行整体大写，逐个纠正）
    "21 SAVAGE": "21 Savage",                         # 同上
}

# ── 艺人整串预修正（在按逗号拆分前替换）：修名字内含逗号的写法 → 统一规范，再靠 KEEP 保护不被拆 ──
ARTIST_RAW_FIX = {
    "Tyler, The Creater": "Tyler, The Creator",  # 拼写错 Creater
    "Tyler,The Creator": "Tyler, The Creator",   # 内部逗号无空格
    "Earth, Wind, Fire": "Earth, Wind & Fire",   # 乐队名内部应为 &，源数据误写成逗号（改后无逗号，天然不会被拆）
    "Anderson ,Paak": "Anderson .Paak",          # 艺人本名 Anderson .Paak（句点），源数据误写成逗号
    "裘德/魏如萱": "裘德, 魏如萱",                 # 斜杠分隔改为站内统一的逗号分隔格式
}

# ── 歌名：整首替换（键 = 完整错误歌名，值 = 完整正确歌名）──────────
SONG_FIX_EXACT = {
    "Ipad": "iPad",
    "Tv": "TV",
    "Running Up The Hill（A Deal With God）": "Running Up That Hill (A Deal with God)",
    "365": "365 (feat. Katy Perry)",  # Zedd — 365；数据集内唯一一处「365」，无同名歌曲误伤风险
    "My Name Ia Dark": "My Name Is Dark",  # Grimes；Ia → Is 拼写错
    "All Along The Wtachtower": "All Along the Watchtower",  # Lucifer Cast；Wtach → Watch 拼写错 + 大小写规范
    "PEACHES & EGGPLANTS (FEAT. 21 SAVAGE)": "Peaches & Eggplants (feat. 21 Savage)",  # 该行整体全大写源数据
}

# ── 歌名：子串替换（品牌/缩写/加空格；对任意歌名生效）──────────────
SONG_FIX_SUB = {
    "Bzrp": "BZRP",         # Quevedo: BZRP Music Sessions
    "T'Aime": "T'aime",     # Bruxelles Je T'aime（法语，A 也该小写）
    "F.N.F.(": "F.N.F. (",  # 补空格
}

# ── 封面：(艺人, 歌名) → 手动指定的 iTunes 封面 URL（600x600bb）─────
# iTunes 搜索按相关度排序，短/生僻歌名有时会匹配到风马牛不相及的曲目
# （如 "Lana Del Rey A&W" 第一条结果曾是 The Weeknd 的 Stargirl Interlude）。
# 这里用同一专辑里能搜到的其它曲目的封面（同专辑封面一致）手动纠正，
# 优先级最高（parser 里先查这张表，查到就不再搜 iTunes、也不受缓存影响）。
COVER_OVERRIDE = {
    ("Lana Del Rey", "A&W"): "https://is1-ssl.mzstatic.com/image/thumb/Music113/v4/7c/c4/e5/7cc4e501-6b09-b379-bb54-a40de4615aa3/22UM1IM33313.rgb.jpg/600x600bb.jpg",  # 专辑 Did you know that there's a tunnel under Ocean Blvd
}
