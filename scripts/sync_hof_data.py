#!/usr/bin/env python3
"""
sync_hof_data.py — Syncs BBL CSV records to data/bbl/bbl-record/hof_data.json

CSV files are the source of truth; hof_data.json is the presentation cache
fetched by bbl/hof.html. Run this script after updating any bbl_0X CSV.

Usage:
    python scripts/sync_hof_data.py          # dry run, show diff only
    python scripts/sync_hof_data.py --write  # apply changes and write file

Fields synced from CSV:
    charted_full, charted_records  ← bbl_02
    most_points                    ← bbl_03  (all 2000+ pt entries)
    uncrowned                      ← bbl_04  (date→vol via bbl-vol-index.json)
    most_charts                    ← bbl_05
    single_chart                   ← bbl_06
    no1_records                    ← bbl_07
    albums                         ← bbl_08
    artists_peak                   ← bbl_09
    artists_songs                  ← bbl_10
    artists_weeks                  ← bbl_11

Fields NOT touched (manually maintained):
    champions   — requires aggregation across bbl_01 rows, human-curated
    owner_map   — hand-maintained member key→id/handle/nickname mapping
    charted_full[].note  — preserved from existing JSON
    charted_records[].show — preserved from existing JSON
"""

import argparse
import csv
import json
import sys
from copy import deepcopy
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DATA = ROOT / 'data' / 'bbl' / 'bbl-record'
HOF_JSON = DATA / 'hof_data.json'
VOL_INDEX = ROOT / 'data' / 'bbl' / 'bbl-vol-index.json'

CATEGORY_TITLES = {
    'top3':  'Top 3 周数',
    'top5':  'Top 5 周数',
    'top10': 'Top 10 周数',
    'top20': 'Top 20 周数',
    'top50': 'Top 50 周数',
}


# ── helpers ──────────────────────────────────────────────────────────────────

def read_csv(name):
    path = DATA / name
    with open(path, encoding='utf-8-sig') as f:
        return list(csv.DictReader(f))


def load_json(path):
    with open(path, encoding='utf-8') as f:
        return json.load(f)


def write_json(path, data):
    with open(path, 'w', encoding='utf-8', newline='\n') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
        f.write('\n')


def build_vol_reverse(vol_index):
    """date string → vol number (int)"""
    return {v: int(k) for k, v in vol_index.items()}


def canonical(obj):
    """Stable JSON string for diffing (sort keys, ensure_ascii=False)."""
    return json.dumps(obj, ensure_ascii=False, sort_keys=True)


def diff_section(name, old, new):
    if canonical(old) != canonical(new):
        print(f'  [CHANGED] {name}: {len(old)} → {len(new)} entries')
        return True
    print(f'  [OK]      {name}: {len(old)} entries, up to date')
    return False


# ── per-field sync functions ─────────────────────────────────────────────────

def sync_charted_full(rows, existing):
    """charted rows from bbl_02; preserve manually added 'note' fields."""
    note_map = {(e['artist'], e['song']): e['note']
                for e in existing if 'note' in e}
    result = []
    for r in rows:
        if r['Category'] != 'charted':
            continue
        entry = {'artist': r['Artist(s)'], 'song': r['Song'], 'val': r['Weeks']}
        key = (r['Artist(s)'], r['Song'])
        if key in note_map:
            entry['note'] = note_map[key]
        result.append(entry)
    return result


def sync_charted_records(rows, existing):
    """non-charted category rows from bbl_02; preserve manually set 'show' flags."""
    show_map = {e['title']: e.get('show', True) for e in existing}
    groups: dict[str, list] = {}
    for r in rows:
        cat = r['Category']
        if cat == 'charted' or cat not in CATEGORY_TITLES:
            continue
        groups.setdefault(cat, []).append(
            {'artist': r['Artist(s)'], 'song': r['Song'], 'val': int(r['Weeks'])}
        )
    result = []
    for cat, title in CATEGORY_TITLES.items():
        if cat not in groups:
            continue
        result.append({
            'title': title,
            'show': show_map.get(title, True),
            'items': groups[cat],
        })
    return result


def sync_most_points(rows):
    return [
        {'pts': float(r['Points']), 'artist': r['Artist(s)'],
         'song': r['Song'], 'date': r['Volume'], 'rank': int(r['Ranking'])}
        for r in rows
    ]


def sync_uncrowned(rows, vol_rev):
    result = []
    for r in rows:
        date = r['Volume']
        vol = vol_rev.get(date)
        if vol is None:
            print(f'  [WARN]    uncrowned: date {date!r} not found in vol-index, vol=0')
            vol = 0
        result.append({
            'artist': r['Artist(s)'], 'song': r['Song'],
            'pts': float(r['Points']), 'rank': int(r['Ranking']), 'vol': vol,
        })
    return result


def sync_most_charts(rows):
    return [
        {'n': int(r['Number']), 'artist': r['Artist(s)'],
         'song': r['Song'], 'date': r['Volume'], 'rank': int(r['Ranking'])}
        for r in rows
    ]


def sync_single_chart(rows):
    return [
        {'n': int(r['Number']), 'artist': r['Artist(s)'],
         'song': r['Song'], 'date': r['Volume'], 'pts': float(r['Points'])}
        for r in rows
    ]


def sync_no1_records(rows):
    return [
        {'n': int(r['number']), 'artist': r['artist'],
         'song': r['song'], 'date': r['volumes'], 'owners': r['owners']}
        for r in rows
    ]


def sync_albums(rows):
    return [
        {'artist': r['artist'], 'album': r['album'],
         'songs': int(r['number']), 'rate': r['rate']}
        for r in rows
    ]


def sync_artists_peak(rows):
    return [
        {'artist': r['artist'], 'val': int(r['number']), 'date': r['volume']}
        for r in rows
    ]


def sync_artists_songs(rows):
    return [{'artist': r['Artist'], 'val': int(r['Singles'])} for r in rows]


def sync_artists_weeks(rows):
    return [{'artist': r['Artist'], 'val': int(r['Weeks'])} for r in rows]


# ── main ─────────────────────────────────────────────────────────────────────

def main():
    parser = argparse.ArgumentParser(description='Sync BBL CSVs → hof_data.json')
    parser.add_argument('--write', action='store_true',
                        help='Write changes (default: dry run)')
    args = parser.parse_args()

    hof = load_json(HOF_JSON)
    vol_index = load_json(VOL_INDEX)
    vol_rev = build_vol_reverse(vol_index)
    new_hof = deepcopy(hof)
    any_changed = False

    print('Checking hof_data.json against CSV sources...\n')

    # bbl_02 → charted_full + charted_records
    rows02 = read_csv('bbl_02_weeks_records.csv')
    for key, fn, existing_key in [
        ('charted_full',    lambda: sync_charted_full(rows02, hof['charted_full']),    'charted_full'),
        ('charted_records', lambda: sync_charted_records(rows02, hof['charted_records']), 'charted_records'),
    ]:
        new_val = fn()
        if diff_section(key, hof[existing_key], new_val):
            new_hof[key] = new_val
            any_changed = True

    # bbl_03 → most_points
    rows03 = read_csv('bbl_03_most_points.csv')
    new_mp = sync_most_points(rows03)
    if diff_section('most_points', hof['most_points'], new_mp):
        new_hof['most_points'] = new_mp
        any_changed = True
        if len(new_mp) != len(hof['most_points']):
            print(f'         NOTE: entry count changed {len(hof["most_points"])} → {len(new_mp)} '
                  f'(hof.html will now render all {len(new_mp)} entries)')

    # bbl_04 → uncrowned
    rows04 = read_csv('bbl_04_top_uncrowned_pts.csv')
    new_un = sync_uncrowned(rows04, vol_rev)
    if diff_section('uncrowned', hof['uncrowned'], new_un):
        new_hof['uncrowned'] = new_un
        any_changed = True

    # bbl_05 → most_charts
    rows05 = read_csv('bbl_05_most_charts.csv')
    new_mc = sync_most_charts(rows05)
    if diff_section('most_charts', hof['most_charts'], new_mc):
        new_hof['most_charts'] = new_mc
        any_changed = True

    # bbl_06 → single_chart
    rows06 = read_csv('bbl_06_single_chart.csv')
    new_sc = sync_single_chart(rows06)
    if diff_section('single_chart', hof['single_chart'], new_sc):
        new_hof['single_chart'] = new_sc
        any_changed = True

    # bbl_07 → no1_records
    rows07 = read_csv('bbl_07_most_weekly_no1.csv')
    new_nr = sync_no1_records(rows07)
    if diff_section('no1_records', hof['no1_records'], new_nr):
        new_hof['no1_records'] = new_nr
        any_changed = True

    # bbl_08 → albums
    rows08 = read_csv('bbl_08_albums_most_charted.csv')
    new_al = sync_albums(rows08)
    if diff_section('albums', hof['albums'], new_al):
        new_hof['albums'] = new_al
        any_changed = True

    # bbl_09 → artists_peak
    rows09 = read_csv('bbl_09_artists_peak_songs.csv')
    new_ap = sync_artists_peak(rows09)
    if diff_section('artists_peak', hof['artists_peak'], new_ap):
        new_hof['artists_peak'] = new_ap
        any_changed = True

    # bbl_10 → artists_songs
    rows10 = read_csv('bbl_10_artists_total_songs.csv')
    new_as = sync_artists_songs(rows10)
    if diff_section('artists_songs', hof['artists_songs'], new_as):
        new_hof['artists_songs'] = new_as
        any_changed = True

    # bbl_11 → artists_weeks
    rows11 = read_csv('bbl_11_artists_total_weeks.csv')
    new_aw = sync_artists_weeks(rows11)
    if diff_section('artists_weeks', hof['artists_weeks'], new_aw):
        new_hof['artists_weeks'] = new_aw
        any_changed = True

    print()
    if not any_changed:
        print('All sections up to date. hof_data.json unchanged.')
        return

    if args.write:
        write_json(HOF_JSON, new_hof)
        print(f'Written: {HOF_JSON}')
        print('Next step: git add data/bbl/bbl-record/hof_data.json && git commit')
    else:
        print('Dry run complete. Run with --write to apply changes.')


if __name__ == '__main__':
    main()
