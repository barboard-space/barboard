#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""为「具名匿名身份」（神妈/隐妈/神隐妈…，非通用『匿名』）分配全局编号「匿名#N」。

规则（与用户确认）：
- **全局计数器，每个匿名大妈在每场/每届的每次出现 +1**（因无法确认不同届/场的同名身份是否同一人）。
  即按 (届号升序 → 场次顺序 → 同场内首次出现顺序) 枚举每个 (届,场,身份) 占用，依次赋 匿名#1、匿名#2…
- 同一场内同一身份的多首歌/兼投票共用一个编号；同一身份在不同场/届各自 +1。
- **通用「匿名」**（第3/4届赛后真正无人认领、身份未知）**不编号**，保持「匿名」。
- 数据层改写：把该场内该身份的所有 entry.member / votes.voter 改成「匿名#N」，并在 members 映射加
  `匿名#N -> {id:0,handle:匿名#N,unclaimed:true,alias:原别名}`（alias 仅供本脚本幂等重算，不展示）。
- 下游（详情页 memberLink / 计分板投票列 / 12分 / 成员页 persona 标签）直接显示该 member 串，无需改渲染。

幂等：已编号的 `匿名#N` 通过 members[label].alias 反查原身份重算，可安全重跑。
**导入新届 SOP：parse → recompute_bv_ranks → number_anon → gen_member_pages → gen_bv_editions_index。**

用法：python scripts/number_anon.py [--write]
"""
import json, glob, os, re, sys
try: sys.stdout.reconfigure(encoding='utf-8')
except Exception: pass

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
WRITE = '--write' in sys.argv
LABEL_RE = re.compile(r'^匿名#\d+$')

def alias_of(members, s, is_shadow=False):
    """member/voter 串 s 的可编号匿名身份别名；不可编号(非匿名/混淆裸名)返回 None。
    - 已编号『匿名#N』→ 存的原别名（幂等重算）；神妈/隐妈… → s 本身。
    - 裸名『匿名』：**非混淆**(正式选送/投票)→ 视作具名身份『匿名』编号；**混淆**(第3/4届无人认领)→ None 不编号。"""
    info = members.get(s, {}) or {}
    if not info.get('unclaimed'): return None
    if LABEL_RE.match(s): return info.get('alias', s)
    if s == '匿名': return None if is_shadow else '匿名'
    return info.get('alias', s)

def main():
    eds = []
    for f in sorted(glob.glob(os.path.join(BASE, 'data/barvision/barvision-*/*.json'))):
        d = json.load(open(f, encoding='utf-8'))
        if 'edition_no' in d and 'matches' in d: eds.append((f, d))
    eds.sort(key=lambda t: t[1]['edition_no'])
    counter = 0; total = 0
    for f, d in eds:
        members = d.get('members', {}) or {}
        label_alias = {}  # 新 匿名#N -> 原别名
        for m in d.get('matches', []):
            order = []; seen = set()  # 同场内身份首次出现顺序（先 entries 后 voters）
            for e in m.get('entries', []):
                a = alias_of(members, e.get('member', ''), e.get('is_shadow', False))
                if a and a not in seen: seen.add(a); order.append(a)
            for v in m.get('votes', {}).get('voters', []):
                a = alias_of(members, v.get('voter', ''))
                if a and a not in seen: seen.add(a); order.append(a)
            a2lab = {}
            for a in order:
                counter += 1; lab = '匿名#%d' % counter
                a2lab[a] = lab; label_alias[lab] = a
            for e in m.get('entries', []):
                a = alias_of(members, e.get('member', ''), e.get('is_shadow', False))
                if a in a2lab: e['member'] = a2lab[a]; e['member_id'] = 0
            for v in m.get('votes', {}).get('voters', []):
                a = alias_of(members, v.get('voter', ''))
                if a in a2lab: v['voter'] = a2lab[a]
        # 重建 members：去掉具名匿名(旧别名/旧编号)，保留普通成员 + 通用『匿名』，加入新编号
        new_members = {k: val for k, val in members.items()
                       if not ((val or {}).get('unclaimed') and k != '匿名')}
        for lab in sorted(label_alias, key=lambda x: int(x.split('#')[1])):
            new_members[lab] = {'id': 0, 'handle': lab, 'unclaimed': True, 'alias': label_alias[lab]}
        d['members'] = new_members
        if label_alias:
            total += len(label_alias)
            print('第%s届：%s' % (d['edition_no'], '、'.join('%s=%s' % (label_alias[l], l)
                  for l in sorted(label_alias, key=lambda x: int(x.split('#')[1])))))
        if WRITE:
            json.dump(d, open(f, 'w', encoding='utf-8', newline='\n'), ensure_ascii=False, indent=1)
    print('\n%s：共 %d 个匿名编号' % ('已写入' if WRITE else 'DRY-RUN(加 --write 落盘)', total))

if __name__ == '__main__':
    main()
