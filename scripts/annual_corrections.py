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
    # 注：键必须是 find_member_cols 去掉末字「妈」之后的形态（如 "X妈"→"X"、"京东大妈"→"京东大"），
    # 不去妈的简称（如「香草」「院长」）原样即可。
    "2018": {
        "淋檬": 19,       # 柠妈
        "绿萌": 125,      # 萌妈
        "香草": 141,      # 草妈本人当年用的昵称变体（个人榜文件名写「草妈」，与之相符）
        "肥屎": 174,      # 肥妈（文件 handle AzarathTrainor 与其 members.csv 记录一致）
        "可乐": 176,      # 乐妈（文件 handle "Coke" = 乐妈 members.csv 里的 handle）
        "院长": 326,      # 院妈（handle 天神院院长）
        "X": 195,         # 「X妈」去妈后 = X，与「XX妈」(id88) 消歧，沿用 2019/2020 Barvision 已确认的 X妈=id195
        "小": 153,        # 「小妈」去妈后 = 小，与新增「小擦」(id781) 消歧（其名首字也是"小"）
        "京东大": 782,    # 「京东大妈」去妈后 = 京东大；不在活跃名单，按用户指示记为「JD」，id 顺延自当时最大 781
    },
    # 2016（34 榜合并，"Koleies"/"2cm" 已是新成员 members.csv 里的原名，靠 name==a 精确匹配自动解析，无需在此列出）
    "2016": {
        "Lovezedd": 138,  # Z妈（handle lovezedd）
        "冰": 776,        # 「冰妈」去妈后 = 冰
        "Tandiny": 130,   # 麦妈（handle Tandiny）
        "城城": 120,      # 城妈（沿用 Barvision ALIASES 已确认的别名，见 #135）
        "雅俗": 173,      # 俗妈（handle 雅俗的老巢）
        "麻雀": 189,      # 雀妈（沿用 2018 年榜已确认的别名）
        "嘟嘟": 190,      # 嘟妈
        "火火": 129,      # 火妈（沿用 2018 年榜已确认的别名）
        "陈先森": 167,    # 森妈（handle 陈先森Qq）
        "泰坦": 131,      # 泰妈（handle 泰坦crazy）
        "雨雨": 17,       # 雨妈
        "azarath": 174,   # 肥妈（handle AzarathTrainor）
        "BAG": 20,        # 包妈（handle 09BAg / Jeremy_BAg）
        "LEMON": 19,      # 柠妈（handle LemonSheeran）
        "环球": 770,      # 音妈（handle 环球颖音）
        "莫扎特伦苏": 127,  # 苏妈（handle 莫扎特_伦苏）
        "RAZ": 118,       # 兔妈（沿用 2018 年榜已确认的别名）
        "布布": 157,      # 布妈
        "小杰": 156,      # 杰妈（沿用 2018 年榜已确认的别名）
        "小耳": 783,      # 耳妈（用户指认，新成员）
        "滔滔": 784,      # 滔妈（用户指认，新成员）
        "淋淋": 785,      # 淋妈（用户指认，新成员）
        "卡卡": 786,      # 卡妈（用户指认，新成员）
        "小小": 153,      # 小妈（用户指认，即已有成员）
        "恒河猴": 18,     # 猴妈（用户指认，即已有成员）
        "C榜": 780,       # CYF（用户指认）
        "淋脑(风雨淋胖)": 168,  # 胖妈（handle 风宇凌胖，用户后续指认）
        # 「助攻」「数字」身份不明，用户指示暂略去——不加映射，
        # 自动落入 build_abbr2id 的未匹配名单（不计入该年成员统计，总点数/名次不受影响）。
    },
    # 2015（21 人合榜）：列头是英文/拼音网名（非"X妈"简称），build_abbr2id 默认按昵称去妈匹配对不上，
    # 全部 21 人均登记（含本可 name==a 自动解出的"小擦"，此年格式特殊、显式登记更清晰）。
    "2015": {
        "DDDDDope": 190,     # 嘟妈（bilibili_name/handle 均为 DDDDDope）
        "依娜布点": 157,     # 布妈（用户指认）
        "绿荫夏语": 125,     # 萌妈（handle 绿荫夏语）
        "靛冰蓝晓": 776,     # 冰妈（用户指认）
        "lemon心语": 19,     # 柠妈（沿用 2018 已确认的个人榜标题别名）
        "fire_storm": 129,   # 火妈（handle fire_storm）
        "Lee翼雨": 17,       # 雨妈（handle Lee翼雨）
        "城城": 120,         # 城妈（沿用既有别名）
        "小擦": 781,         # 小擦（本身即成员名，name==a 可自动解出，此处显式登记）
        "Rihanavy": 133,     # N妈（handle rihanavy，大小写/尾随 nbsp 已由 strip() 处理）
        "小麻雀": 189,       # 雀妈（用户指认，"麻雀"别名的变体）
        "环球颖音": 770,     # 音妈（handle 环球颖音）
        "Raz": 118,          # 兔妈（沿用既有别名，handle Razbit 前缀）
        "Jh": 156,           # 杰妈（handle jh201013 前缀）
        "卡卡": 786,         # 卡妈（沿用既有别名）
        "小耳": 783,         # 耳妈（沿用既有别名）
        "jdean": 782,        # JD（用户指认）
        "小小": 153,         # 小妈（沿用既有别名）
        "淋淋": 785,         # 淋妈（沿用既有别名）
        "特仑苏": 127,       # 苏妈（用户指认）
        "死心陈": 167,       # 森妈（用户推测确认，handle 陈先森Qq）
    },
    # 2013（13 人合榜）：表头本身可辨认（部分是历年已确认别名，部分是新历史成员），用户要求正常做身份归因。
    # 键均为 find_member_cols 去妈后的形态（如"罐头大妈"结尾是"妈"→键写"罐头大"）。
    "2013": {
        "FAK": 789,          # 新成员（用户指认，新增）
        "小火": 129,         # 火妈（"小X"→X妈 别名规律，用户确认）
        "城城": 120,         # 城妈（沿用既有别名）
        "小风": 154,         # 风妈（"小X"→X妈 别名规律，用户确认）
        "罐头大": 792,       # 罐头（新成员，用户指认；表头"罐头大妈"改名为"罐头"）
        "浮生": 790,         # 新成员（用户指认，新增）
        "KYRK": 791,         # 新成员（用户指认，新增）
        "J.Dean": 782,       # JD（用户确认，与 2015 的"jdean"同一人）
        "小记忆": 793,       # 新成员（用户指认，新增）
        "小杰": 156,         # 杰妈（沿用既有别名）
        "小耳": 783,         # 耳妈（沿用既有别名）
        "dope": 190,         # 嘟妈（沿用既有别名）
        "小雨": 17,          # 雨妈（"小X"→X妈 别名规律，用户确认）
    },
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
    # 2019 年榜（源数据 Title-Case 较乱，逐个纠正官方写法/拼写错）
    "Fka Twigs": "FKA twigs",
    "Lana Del Ray": "Lana Del Rey",              # Ray → Rey 拼写错
    "Juice Wrld": "Juice WRLD",
    "Khaild": "Khalid",                          # 拼写错
    "5Sos": "5SOS",
    "5 Seconds Of Summer": "5 Seconds of Summer",
    "Big Hawke": "Big Hawk",                     # Sicko Mode 采样艺人，拼写错
    "Carly Rae Jepson": "Carly Rae Jepsen",      # 拼写错
    "Gasafflestein": "Gesaffelstein",            # 拼写错
    "A Boogie Wit Da Hoodie": "A Boogie Wit da Hoodie",
    "A Boodie Wit Da Hoodie": "A Boogie Wit da Hoodie",  # Boodie 拼写错 + 大小写
    "Daddy Yonkee": "Daddy Yankee",              # 拼写错
    "Sza": "SZA",
    "Onerepublic": "OneRepublic",
    "Shaed": "SHAED",
    "Rosalia": "Rosalía",
    "Yungblud": "YUNGBLUD",
    "Ilovemakonnen": "iLoveMakonnen",
    "Nicky Minaj": "Nicki Minaj",                # 拼写错
    "Ty Dolla Sign": "Ty Dolla $ign",
    "Ty Dolla $Isn": "Ty Dolla $ign",            # 拼写错
    "P!Nk": "P!nk",
    "Dababy": "DaBaby",
    "Vanjess": "VanJess",
    "Goldlink": "GoldLink",
    "Christine And The Queens": "Christine and the Queens",
    "One Direcion": "One Direction",             # 拼写错
    "U.S. Gilrs": "U.S. Girls",                  # 拼写错
    "Twenty-One Pilots": "Twenty One Pilots",    # 与本站其他处一致，去连字符
    "Anna Of The North": "Anna of the North",
    "Foster The People": "Foster the People",
    "Zayn": "ZAYN",
    "Nao": "NAO",
    "Marc E Bassy": "Marc E. Bassy",
    "Luca Hanni": "Luca Hänni",                  # 缺重音
    "Serpentwithfeet": "serpentwithfeet",
    "Toro Y Moi": "Toro y Moi",
    "How To Dress Well": "How to Dress Well",
    "Tones And I": "Tones and I",
    "The Minds Of 99": "The Minds of 99",
    "The Minds Of 99+102:1": "The Minds of 99",  # 源数据混入类似单元格引用的乱码后缀
    # 2018 年榜（54 位成员各自个人榜原始文件，Title-Case/拼写混乱，逐个纠正）
    "George Erza": "George Ezra",                # 拼写错
    "Ed Sheeeran": "Ed Sheeran",                  # 拼写错
    "Kacey Mursgraves": "Kacey Musgraves",        # 拼写错
    "Rachel Platte": "Rachel Platten",            # 拼写错
    "Janelle Monae": "Janelle Monáe",             # 缺重音
    "Janelle Monàe": "Janelle Monáe",             # 重音方向错
    "Sebastian Yatra": "Sebastián Yatra",         # 缺重音
    "Camila Cebello": "Camila Cabello",           # 拼写错
    "One Republic": "OneRepublic",                # 官方无空格
    "Nick iMinaj": "Nicki Minaj",                 # 源数据断字错误
    "Hailee Steinfiled": "Hailee Steinfeld",      # 拼写错
    "Blocboy JB": "BlocBoy JB",                   # 官方风格化
    "Rosalia（Rosalía）": "Rosalía",               # 源数据两种拼法并列
    "Twenty-one Pilots": "Twenty One Pilots",     # 与本站其他处一致
    "twenty one pilots": "Twenty One Pilots",     # 同上（全小写源数据）
    "benny blanco": "Benny Blanco",               # 大小写
    "lil peep": "Lil Peep",                       # 大小写
    "Xxxtentacion": "XXXTENTACION",               # 官方全大写风格化
    "Craig David &Stefflon Don": "Craig David & Stefflon Don",  # 补空格
    # 2016 年榜（34 榜合并，源表格多处拼写/断句错误）
    "Calvin Harries": "Calvin Harris",            # 拼写错
    "Mike Ponser": "Mike Posner",                 # 拼写错
    "G-eazy": "G-Eazy",                           # 大小写
    "Hailee Stainfield": "Hailee Steinfeld",      # 拼写错
    "Zedd&Grey": "Zedd & Grey",                   # 补空格
    "Gwen Stefeni": "Gwen Stefani",               # 拼写错
    "James Authur": "James Arthur",               # 拼写错
    "Kogo": "Kygo",                                # 拼写错
    "Jason Derülo": "Jason Derulo",               # 误加重音，官方无重音
    "Tory Lanez&Chris Brown": "Tory Lanez & Chris Brown",  # 补空格
    "Marc.E.Bassy": "Marc E. Bassy",              # 句点误代空格
    "ENRIQUE IGLESIAS": "Enrique Iglesias",       # 全大写源数据
    "DESCEMER BUENO&GENTE DE ZONA": "Descemer Bueno & Gente De Zona",  # 全大写 + 补空格
    "M∅": "MØ",                                    # 数学空集符号误代 Ø
    "Philipp Poisel 542": "Philipp Poisel",       # 艺人名混入疑似时长/编号残留
    # 2017 年榜
    "Beyonce": "Beyoncé",                         # 缺重音
    "Ellie Goudling": "Ellie Goulding",           # 拼写错
    "Hailee Steifeld": "Hailee Steinfeld",        # 拼写错
    "Pablo Alboran": "Pablo Alborán",             # 缺重音
    "Marc E.bassy": "Marc E. Bassy",              # 句点误代空格 + 大小写
    "Odesza": "ODESZA",                           # 官方全大写风格化
    # 2013 年榜
    "Charlie XCX": "Charli XCX",                  # 拼写错
    "the Weekend": "The Weeknd",                  # 拼写错（Weeknd 官方无 The Weekend 这个名字）
    "the Neighborhood": "The Neighbourhood",      # 大小写 + 官方英式拼写
    "Emeli Sande": "Emeli Sandé",                 # 缺重音
}

# ── 艺人整串预修正（在按逗号拆分前替换）：修名字内含逗号的写法 → 统一规范，再靠 KEEP 保护不被拆 ──
ARTIST_RAW_FIX = {
    "Tyler, The Creater": "Tyler, The Creator",  # 拼写错 Creater
    "Tyler,The Creator": "Tyler, The Creator",   # 内部逗号无空格
    "Earth, Wind, Fire": "Earth, Wind & Fire",   # 乐队名内部应为 &，源数据误写成逗号（改后无逗号，天然不会被拆）
    "Anderson ,Paak": "Anderson .Paak",          # 艺人本名 Anderson .Paak（句点），源数据误写成逗号
    "裘德/魏如萱": "裘德, 魏如萱",                 # 斜杠分隔改为站内统一的逗号分隔格式
    # 2019 年榜：多艺人用 "/" 或 "&" 拼接（无逗号，_keep_split 不会拆开），
    # 含拼写错/大小写需修正的整串在此按完整原文替换（不改变分隔符风格，除非源数据本身已损坏）
    "Grimes Hana": "Grimes, HANA",                       # 缺分隔符 + 官方全大写
    "Benny Blanco /Halsey&Khaild)": "Benny Blanco, Halsey, Khalid",  # 源数据格式损坏（多余括号+拼写错）
    "Marshmello The Bastille": "Marshmello, Bastille",   # 缺分隔符 + 乐队名无 "The"
    "Halsey/Juice Wrld": "Halsey/Juice WRLD",
    "The Chainsmokers/5Sos": "The Chainsmokers/5SOS",
    "Travis Scott/Drake/Swae Lee/Big Hawke": "Travis Scott/Drake/Swae Lee/Big Hawk",
    "Gasafflestein/The Weeknd": "Gesaffelstein/The Weeknd",
    "Lil Nas X/Dababy": "Lil Nas X/DaBaby",
    "Shaed/Zayn": "SHAED/ZAYN",
    "Rosalia/J Balvin/El Guincho": "Rosalía/J Balvin/El Guincho",
    "Megan Thee Stallion/Nicky Minaj/Ty Dolla Sign": "Megan Thee Stallion/Nicki Minaj/Ty Dolla $ign",
    "Vanjess / Goldlink": "VanJess / GoldLink",
    "Lil Peep/Ilovemakonnen/Fall Out Boy": "Lil Peep/iLoveMakonnen/Fall Out Boy",
    "Bring Me To Horizon/Rahzel": "Bring Me the Horizon/Rahzel",
    "Bring Me The Horizon & Grimes": "Bring Me the Horizon & Grimes",
    "Ari Lennox  / J. Cole": "Ari Lennox / J. Cole",     # 多余空格
    "Dreamvile / J.I.D, Bas, J.Cole, Earthgang & Young Nudy": "Dreamville, JID, Bas, J. Cole, EARTHGANG, Young Nudy",
    "Calvin Harris/Rag'N'Bone Man": "Calvin Harris/Rag'n'Bone Man",
    "Juice Wrld/Seezyn": "Juice WRLD/Seezyn",
    "Yungblud/Halsey/Travis Barker": "YUNGBLUD/Halsey/Travis Barker",
    "Marc E Bassy / Blackbear": "Marc E. Bassy / Blackbear",
    # 2018 年榜：无逗号的整串组合，含拼写/缺分隔符问题
    "Lady Gaga Brandley Cooper": "Lady Gaga, Bradley Cooper",  # 缺逗号 + Brandley 拼写错
    "Maroon 5 Cardi B": "Maroon 5, Cardi B",                    # 缺逗号
    "Hailee Steinfeld/Alesso/Florida Georgia Li...": "Hailee Steinfeld/Alesso/Florida Georgia Line",  # 源数据截断
    # 2016 年榜：无逗号的整串组合
    "Justin Bieber&MO": "Justin Bieber & MØ",           # 补空格 + Ø 缺失
    "Gnash&Olivia O'Brien": "Gnash & Olivia O'Brien",   # 补空格
    "Justin Bieber(feat. Big Sean)": "Justin Bieber (feat. Big Sean)",  # 补空格
    # 2015 年榜：无逗号的整串组合
    "Ariana Grande & The Weekend": "Ariana Grande & The Weeknd",  # Weeknd 拼写错（另有正确的 Vampire Weekend 乐队名，不可混淆）
    # 2014 年榜：feat 前无空格（_FEAT_RE 需要前置空格才能识别，故此类需手动整串修正）
    "Ariana Grande(Feat,The Weeknd)": "Ariana Grande (feat. The Weeknd)",  # 缺空格 + 逗号误代句点
    "Disclosure(Feat.Sam Smith)": "Disclosure (feat. Sam Smith)",  # 缺空格
    # 2013 年榜
    "Pet Shop Boys ＆ Dusty Springfield": "Pet Shop Boys & Dusty Springfield",  # 全角 &
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
    "We Appriciate Power": "We Appreciate Power",  # Grimes ft. HANA；拼写错
    "It's Not Living(If It's Not With You)": "It's Not Living (If It's Not with You)",  # The 1975；补空格 + With → with
    "Messy (Accoustic)": "Messy (Acoustic)",  # serpentwithfeet；拼写错
    "Imi": "iMi",  # Bon Iver；官方拼写 iMi
    "Dancing With Our Hards Tied": "Dancing With Our Hands Tied",  # Taylor Swift；Hards → Hands 拼写错
    # 2016 年榜
    "Make me…": "Make Me...",  # Britney Spears
    "CAN't STOP THE FELLING!": "Can't Stop the Feeling!",  # Justin Timberlake；全大写 + Felling 拼写错
    "Send My Love(To Your New Lover)": "Send My Love (To Your New Lover)",  # 补空格
    "Up&Up": "Up & Up",  # Coldplay；补空格
    "All In My Head(Flex)(Feat.Fetty Wap)": "All In My Head (Flex) (feat. Fetty Wap)",  # 补空格
    "Chantaje (feat.Maluma)": "Chantaje (feat. Maluma)",  # 补空格
    "Ghostbusters(I’m Not Afraid)": "Ghostbusters (I'm Not Afraid)",  # 补空格 + 弯引号规范
    "Mom(Feat.Kelli Trainor)": "Mom (feat. Kelli Trainor)",  # 补空格
    "Better(Feat.Yo Gotti)": "Better (feat. Yo Gotti)",  # 补空格
    "Father Streches My Hand, Pts 1 & 2 (feat. KiD CuDi & Desiigner)": "Father Stretches My Hand, Pts. 1 & 2 (feat. Kid Cudi & Desiigner)",  # Streches 拼写错 + KiD CuDi 大小写
    "John Wayne Gacy. Jr.": "John Wayne Gacy, Jr.",  # Sufjan Stevens；句读符号错
    "True Colours": "True Colors",  # Anna Kendrick & Justin Timberlake；官方美式拼写
    "Me,Myself&I": "Me, Myself & I",  # G-Eazy, Bebe Rexha；补空格
    # 2015 年榜
    "Runnin'（Lose it All）": "Runnin' (Lose It All)",  # Naughty Boy；全角括号 + 大小写规范
    "All Of Me (Live）": "All of Me (Live)",  # John Legend；全角括号 + Of→of
    "Watch Me (Whip/Nae Nae）": "Watch Me (Whip/Nae Nae)",  # Silento；全角括号
    "Up ＆ Down(위아래)": "Up & Down (위아래)",  # EXID；全角 & + 补空格
    "I’m Yours": "I'm Yours",  # 弯引号规范
    "Should’ve Been Us": "Should've Been Us",  # 弯引号规范
    "You Should Know Where I’m Coming From": "You Should Know Where I'm Coming From",  # 弯引号规范
    # 2014 年榜
    "Don't Be Gone Too Long (feat.Ariana Grande)": "Don't Be Gone Too Long (feat. Ariana Grande)",  # 补空格
    "Somebody To You(feat.Demi Lovato)": "Somebody to You (feat. Demi Lovato)",  # 补空格 + To→to
    "Prayer In C(Remix)": "Prayer in C (Remix)",  # 补空格 + In→in
    # 2013 年榜
    "Can’t Hold Us": "Can't Hold Us",  # 弯引号规范
    "Almost Is Never Enough(feat. Nathan Sykes)": "Almost Is Never Enough (feat. Nathan Sykes)",  # 补空格
}

# ── 歌名：子串替换（品牌/缩写/加空格；对任意歌名生效）──────────────
SONG_FIX_SUB = {
    "Bzrp": "BZRP",         # Quevedo: BZRP Music Sessions
    "T'Aime": "T'aime",     # Bruxelles Je T'aime（法语，A 也该小写）
    "F.N.F.(": "F.N.F. (",  # 补空格
    "`": "'",               # 反引号误代撇号（2016 年榜多处，如 Ain`t My Fault）
    "THat Part": "That Part",  # ScHoolboy Q；随手误按大写键，歌名后面还带 "(feat. ...)" 用 SUB 而非 EXACT
}

# ── 封面：(艺人, 歌名) → 手动指定的 iTunes 封面 URL（600x600bb）─────
# iTunes 搜索按相关度排序，短/生僻歌名有时会匹配到风马牛不相及的曲目
# （如 "Lana Del Rey A&W" 第一条结果曾是 The Weeknd 的 Stargirl Interlude）。
# 这里用同一专辑里能搜到的其它曲目的封面（同专辑封面一致）手动纠正，
# 优先级最高（parser 里先查这张表，查到就不再搜 iTunes、也不受缓存影响）。
COVER_OVERRIDE = {
    ("Lana Del Rey", "A&W"): "https://is1-ssl.mzstatic.com/image/thumb/Music113/v4/7c/c4/e5/7cc4e501-6b09-b379-bb54-a40de4615aa3/22UM1IM33313.rgb.jpg/600x600bb.jpg",  # 专辑 Did you know that there's a tunnel under Ocean Blvd
}

# ── 「最多榜冠」看点卡人工覆盖：源数据缺各成员个人榜逐曲名次（无法自动统计
#    「被多少位大妈排在其个人榜第 1」），改由用户人工提供该年真实数值 ──
# 年份 → {artist, song（须与该条目规范化后的写法完全一致）, no1（榜冠数）}
CHAMP_OVERRIDE = {
    "2017": {"artist": "The Chainsmokers & Coldplay", "song": "Something Just Like This", "no1": 3},
}

# ── 「N 榜合榜」人工覆盖：该数字是源数据里参与合并的个人榜总数（官方事实），
#    与「实际成功识别出真实成员身份的数量」是两回事——如 2016 源表 34 榜合并，
#    其中「助攻」「数字」两列身份不明被跳过，成功识别 32 人，但页面仍应显示官方的 34。
#    未在此登记的年份，前端沿用旧行为：按 member-annual-index.json 里已识别的成员数动态算。
BOARD_COUNT = {
    "2016": 34,
    "2017": 43,
    # 2014：用户确认官方 24 榜合榜；源表实际可辨识的匿名成员列只有 21 个（无表头，见 ANON_MEMBER_COLS），
    # 两者不一致按用户提供的官方数字为准，纯展示用，不影响管线（该年本就不产出可归因的成员数据）。
    "2014": 24,
    # 2013：用户确认官方 10 榜合榜；源表实际有 13 个非空成员列（同类不一致，见 2014 先例）。
    "2013": 10,
}

# ── 成员年榜聚合人工覆盖：源数据缺各成员详细个人榜（见上 CHAMP_OVERRIDE 同一根因），
#    无法从主榜表算出分档助攻明细 / 个人 Top10，改用用户提供的另一份「各成员助攻贡献」
#    统计图人工登记（仅 Top100 档一个数字；其余档位/Top10 留空、前端显示"—"）──
# 年份 → {space_id: t100 助攻贡献数}
MANUAL_MEMBER_ASSISTS = {
    # 2017（43 榜合榜，用户提供的另一份「助攻贡献」统计截图，简称已与用户逐一核对身份）
    # 「助攻」(24) 系表格损坏泄漏的列标题文字，非真实成员，按 2016 年同类噪声条目先例跳过
    "2017": {
        17: 64,    # 雨妈
        168: 63,   # 淋脑 → 胖妈
        781: 57,   # 小擦
        132: 57,   # AA → A妈
        138: 56,   # Lovezedd → Z妈
        12: 55,    # 锴妈
        19: 53,    # 淋檬 → 柠妈
        776: 52,   # 冰妈
        784: 48,   # WE → 滔妈
        191: 47,   # 土豆 → 薯妈
        173: 44,   # 雅俗 → 俗妈
        154: 44,   # 风鸡 → 风妈
        158: 43,   # 小喳 → 鸣妈（小鸣）
        172: 43,   # 清清 → 清妈
        174: 43,   # 肥屎 → 肥妈
        782: 42,   # JD
        7: 40,     # WillW → 威妈
        775: 39,   # Sunny → 加妈
        779: 37,   # 然然 → 然然君
        167: 37,   # 陈先森 → 森妈
        129: 36,   # 火鸡 → 火妈
        164: 35,   # 亮亮 → 亮妈
        141: 35,   # 香草 → 草妈
        123: 34,   # 可可 → 可妈
        120: 34,   # 城妈
        125: 32,   # 绿萌 → 萌妈
        156: 30,   # 杰妈
        131: 30,   # 泰坦 → 泰妈
        18: 30,    # 猴妈
        189: 27,   # 麻雀 → 雀妈
        124: 26,   # Lolo → 洛妈
        783: 25,   # 小耳 → 耳妈
        770: 23,   # 环球 → 音妈
        118: 23,   # RAZ → 兔妈
        20: 20,    # 包妈
        157: 20,   # 布妈
        119: 18,   # Ocean → 海妈
        153: 17,   # 小妈
        190: 15,   # 嘟嘟 → 嘟妈
        133: 14,   # navy → N妈
        185: 13,   # 蛋妈
        127: 11,   # 苏妈
    },
    # 2014：源表完全无表头、身份无从考证（见 ANON_MEMBER_COLS），但已确认这些成员 2013 年交了榜、
    # 大概率 2014 年也参与了——仅为这些人补一条"数据缺失"占位（值全 None，assists 全部档位显示"—"，
    # 复用 no_detail 机制的 Top10 提示语），不对全站其他成员添加 2014 板块。
    "2014": {sid: None for sid in (
        17, 120, 129, 154, 156, 190, 782, 783, 789, 790, 791, 792, 793,
    )},
}
