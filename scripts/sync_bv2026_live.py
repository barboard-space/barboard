#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""把第十六届（Barvision Chongqing 2026）本届实时更新页的动态条目同步到首页 updates。

数据源 = data/barvision/barvision-2026/regular-16.json 顶层 `feed[]`（每条 {date, title, desc,
可选 show_after}）。本脚本只管理自己写入的条目（用 "src": "bv2026live" 标记）：每次运行先删除
旧的 bv2026live 条目，再插入当前 feed，**不触碰**手工里程碑条目与 BBL 自动条目（fetch_bbl.py 维护）。
最后整体按 date 降序排序。

用法：
  python scripts/sync_bv2026_live.py          # dry run，仅显示将写入的条目
  python scripts/sync_bv2026_live.py --write   # 实际写入 updates.json

改 regular-16.json 的 feed 后重跑本脚本，再 git add + commit。
首页 renderUpdates() 会按 show_after 过滤未来条目、按 date 降序取前 5 显示。
"""
import json, os, sys

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
EDITION = os.path.join(BASE, "data", "barvision", "barvision-2026", "regular-16.json")
UPDATES = os.path.join(BASE, "data", "main-page", "updates.json")
SRC_TAG = "bv2026live"

try:
    sys.stdout.reconfigure(encoding="utf-8")
except Exception:
    pass


def load(path, default):
    try:
        with open(path, encoding="utf-8") as f:
            return json.load(f)
    except Exception:
        return default


def main():
    write = "--write" in sys.argv

    edition = load(EDITION, {})
    feed = edition.get("feed", []) or []

    # 由 feed 条目构造首页 updates 条目（带 src 标记）
    new_entries = []
    for it in feed:
        if not it.get("date") or not it.get("title"):
            print("跳过缺 date/title 的 feed 条目：", it)
            continue
        entry = {"date": it["date"], "src": SRC_TAG}
        if it.get("show_after"):
            entry["show_after"] = it["show_after"]
        entry["title"] = it["title"]
        entry["desc"] = it.get("desc", "")
        new_entries.append(entry)

    items = load(UPDATES, [])
    kept = [u for u in items if u.get("src") != SRC_TAG]
    removed = len(items) - len(kept)

    merged = kept + new_entries
    merged.sort(key=lambda u: u.get("date", ""), reverse=True)

    print(f"feed 条目 {len(feed)} → 生成 {len(new_entries)} 条 bv2026live 更新")
    print(f"移除旧 bv2026live 条目 {removed} 条；其余条目保留 {len(kept)} 条")
    for e in new_entries:
        sa = f"（show_after {e['show_after']}）" if e.get("show_after") else ""
        print(f"  + [{e['date']}]{sa} {e['title']}")

    if write:
        with open(UPDATES, "w", encoding="utf-8") as f:
            json.dump(merged, f, ensure_ascii=False, indent=2)
        print(f"\n已写入 {UPDATES}（共 {len(merged)} 条）")
    else:
        print("\n(dry run，未写入；加 --write 落盘)")


if __name__ == "__main__":
    main()
