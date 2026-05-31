#!/usr/bin/env python3
"""
sync_bv_hof_data.py — Syncs Barvision CSV records to data/barvision/bv_hof_data.json

CSV files are the source of truth; bv_hof_data.json is the presentation cache
fetched by barvision/hof.html. Run this script after updating any barvision CSV.

Usage:
    python scripts/sync_bv_hof_data.py          # dry run, show diff only
    python scripts/sync_bv_hof_data.py --write  # apply changes and write file

Fields synced from CSV:
    records[].val   ← barvision_04_category_records_regular.csv  (metric column)
    awards titles   ← barvision_06 + barvision_07 (checks for added/removed awards)

Fields NOT touched (manually maintained):
    pioneer         — manually curated (founder info rarely changes)
    records[].who   — winner names, manually formatted
    records[].note  — context notes, manually written
    records[].label — display labels (differ from CSV award_title)
    awards[].metric — display description, differs from CSV
    awards[].winners / detail — complex extraction, manually curated

CSV structure note:
    barvision_04: award_title, metric, details
        metric = the record value (number/percentage/etc.)
        details = pipe-separated context (winners | song | round | etc.)
    barvision_06/07: award_title, metric, details
        These are special achievement awards, not numeric records
    barvision_02/03: line_no, content  (free-text, not machine-parseable)
    barvision_01: line_no, content     (pioneer award description)

All Barvision CSVs are UTF-8 with BOM (utf-8-sig). Do NOT save as Windows-1252/GBK.
"""

import argparse
import csv
import json
import sys
from copy import deepcopy
from pathlib import Path

ROOT      = Path(__file__).resolve().parent.parent
BV_DATA   = ROOT / 'data' / 'barvision'
BV_RECORD = BV_DATA / 'barvision-record'
HOF_JSON  = BV_DATA / 'bv_hof_data.json'

# Mapping: CSV barvision_04 award_title → JSON records[].label
# Only rows with a clear 1:1 metric→val relationship are included.
# Rows where CSV metric ≠ display value need manual curation (e.g. 最高单组总分=281 vs display=357).
RECORDS_CSV_MAP = {
    '最多参与场数':     '最多参与场数',
    '最多冠军单曲选送数': '最多冠军选送',
    '最高单组支持率':   '最高单场支持率',
    '最长连续前十场数': '最长连续前十',
}

# award_title values in barvision_06 + barvision_07 that appear in the HOF awards section
AWARDS_SOURCES = {
    'barvision_06_achievements_regular.csv',
    'barvision_07_achievements_unplugged.csv',
}


# ── helpers ──────────────────────────────────────────────────────────────────

def read_csv(path):
    with open(path, encoding='utf-8-sig') as f:
        return list(csv.DictReader(f))


def load_json(path):
    with open(path, encoding='utf-8') as f:
        return json.load(f)


def write_json(path, data):
    with open(path, 'w', encoding='utf-8', newline='\n') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
        f.write('\n')


def canonical(obj):
    return json.dumps(obj, ensure_ascii=False, sort_keys=True)


# ── sync functions ────────────────────────────────────────────────────────────

def sync_records_val(csv_rows, existing_records):
    """
    Update records[].val from barvision_04 metric column where mapping is defined.
    Preserves label, who, note. Warns if CSV metric differs from JSON val.
    Returns (new_records, changed).
    """
    csv_map = {r['award_title']: r['metric'] for r in csv_rows if r.get('metric')}
    new_records = deepcopy(existing_records)
    changed = False

    for rec in new_records:
        label = rec['label']
        # Find matching CSV key
        csv_key = next((k for k, v in RECORDS_CSV_MAP.items() if v == label), None)
        if csv_key is None:
            continue
        csv_val = csv_map.get(csv_key)
        if csv_val is None:
            continue
        if str(rec['val']) != str(csv_val):
            print(f'  [records.{label}] val: {rec["val"]!r} → {csv_val!r}')
            rec['val'] = csv_val
            changed = True

    return new_records, changed


def check_awards_titles(existing_awards):
    """
    Check if award titles in CSVs have changed vs JSON.
    Awards are NOT auto-synced (content too complex); only reports additions/removals.
    Returns changed=True if titles differ.
    """
    csv_titles = set()
    for fname in AWARDS_SOURCES:
        path = BV_RECORD / fname
        if path.exists():
            for r in read_csv(path):
                if r.get('award_title'):
                    csv_titles.add(r['award_title'])

    json_titles = {a['title'] for a in existing_awards}

    # Map CSV titles to HOF display titles (some differ)
    AWARDS_TITLE_MAP = {
        '出道即巅峰': '出道即巅峰',
        '卧薪尝胆':   '卧薪尝胆',
        '实红艺人':   '实红艺人',
        '雨露均沾':   '雨露均沾',
        '全世界都在讲中国话': '全世界都在讲中国话',
        '喜获双学位': '喜获双学位',
    }
    mapped_csv = {AWARDS_TITLE_MAP[t] for t in csv_titles if t in AWARDS_TITLE_MAP}

    added   = mapped_csv - json_titles
    removed = json_titles - mapped_csv

    if added:
        print(f'  [awards] CSV has new awards not in JSON: {added}')
        print(f'           → Add manually to bv_hof_data.json awards array')
    if removed:
        print(f'  [awards] JSON has awards not in CSV: {removed}')
        print(f'           → Verify if they should be removed from bv_hof_data.json')

    return bool(added or removed)


# ── main ─────────────────────────────────────────────────────────────────────

def main():
    parser = argparse.ArgumentParser(description='Sync Barvision CSVs → bv_hof_data.json')
    parser.add_argument('--write', action='store_true',
                        help='Write changes (default: dry run)')
    args = parser.parse_args()

    hof = load_json(HOF_JSON)
    new_hof = deepcopy(hof)
    any_changed = False

    print('Checking bv_hof_data.json against CSV sources...\n')

    # records: sync val from barvision_04
    path04 = BV_RECORD / 'barvision_04_category_records_regular.csv'
    if path04.exists():
        rows04 = read_csv(path04)
        new_records, rec_changed = sync_records_val(rows04, hof['records'])
        if rec_changed:
            new_hof['records'] = new_records
            any_changed = True
            print(f'  [records] {len(hof["records"])} entries updated')
        else:
            print(f'  [OK]      records: {len(hof["records"])} entries, up to date')
    else:
        print(f'  [SKIP]    barvision_04 not found')

    # awards: title consistency check only (no auto-sync)
    print()
    print('Checking awards titles (manual-curation only, no auto-sync):')
    awards_flag = check_awards_titles(hof['awards'])
    if not awards_flag:
        print(f'  [OK]      awards: {len(hof["awards"])} entries, titles consistent')

    print()
    if not any_changed:
        print('All numeric records up to date. bv_hof_data.json unchanged.')
        return

    if args.write:
        write_json(HOF_JSON, new_hof)
        print(f'Written: {HOF_JSON}')
        print('Next step: git add data/barvision/bv_hof_data.json && git commit')
    else:
        print('Dry run complete. Run with --write to apply changes.')


if __name__ == '__main__':
    main()
