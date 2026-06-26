#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""扫描各届 regular-*.json → 生成届次索引 editions-index.json（参赛名单 + 顺序）。
供详情页：① 成员变动（当前届名单 vs 历史届对比）② 上一届/下一届导航。
改/加任意届 JSON 后重跑本脚本。"""
import json, glob, os, sys
try: sys.stdout.reconfigure(encoding='utf-8')
except Exception: pass

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(BASE, 'data', 'barvision', 'editions-index.json')

eds = []
for p in sorted(glob.glob(os.path.join(BASE, 'data', 'barvision', 'barvision-*', '*.json'))):
    try:
        d = json.load(open(p, encoding='utf-8'))
    except Exception:
        continue
    if 'edition_no' not in d or 'matches' not in d:
        continue
    members = d.get('members', {})
    seen = {}
    for m in d['matches']:
        for e in m.get('entries', []):
            if e.get('is_shadow'):  # 混淆曲不算正式参赛（含「匿名」伪成员），不计入名册
                continue
            nm = e.get('member')
            if not nm:
                continue
            # 联合选送「A/B」：各自入册
            for part in ([n.strip() for n in nm.split('/')] if '/' in nm else [nm]):
                # 「匿名」伪成员（id 0 unclaimed）不计入名册 / 成员变动（即便其正式曲，如第八届神妈匿名）
                if part == '匿名' or (members.get(part, {}) or {}).get('unclaimed'):
                    continue
                if part not in seen:
                    info = members.get(part, {}) or {}
                    seen[part] = {'name': part, 'id': info.get('id'),
                                  'handle': info.get('handle', part)}
    no = d['edition_no']
    yr = d['year']
    # 路径方案：2019–2020 一年多届 → /barvision/<年>/<两位届数>.html（娱乐版加 e）；2023 起一年一届 → /barvision/<年>.html
    if yr >= 2023:
        href = '/barvision/%d.html' % yr
    else:
        href = '/barvision/%d/%02d%s.html' % (yr, no, 'e' if d['version'] == 'unplugged' else '')
    eds.append({
        'no': no, 'year': yr, 'version': d['version'],
        'name': d.get('edition_name', ''),
        'href': href,
        'roster': list(seen.values()),
    })
eds.sort(key=lambda x: x['no'])
os.makedirs(os.path.dirname(OUT), exist_ok=True)
json.dump({'editions': eds}, open(OUT, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
print('写出', OUT, '；届数', len(eds))
for e in eds:
    print('  第%d届 %s — roster %d 人' % (e['no'], e['name'], len(e['roster'])))
