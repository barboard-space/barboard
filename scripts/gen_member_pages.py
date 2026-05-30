#!/usr/bin/env python3
"""Generate member/N.html stub pages from data/barboard_members.csv."""
import csv
import json
import os

TEMPLATE = """\
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <script>if(sessionStorage.getItem('barboard_dev')!=='1')document.documentElement.style.visibility='hidden'</script>
  <title>Barboard 成员</title>
  <meta name="description" content="Barboard 成员主页" />
  <link rel="icon" type="image/png" href="../assets/images/logo_center.png" />
  <link rel="stylesheet" href="../fonts.css" />
  <link rel="stylesheet" href="../style.css" />
</head>
<body>
  <div id="site-nav"></div>
  <div id="mp-root"></div>
  <div id="site-footer"></div>
  <script>var MEMBER_DATA = PLACEHOLDER;</script>
  <script src="../scripts/member-render.js"></script>
  <script src="../scripts/nav.js"></script>
</body>
</html>
"""


def parse_groups(team):
    groups = []
    if "BarboardLab" in team:
        groups.append("bbl")
    if "村摇欧共体" in team:
        groups.append("cun")
    if "Indienation" in team:
        groups.append("indie")
    return groups


def parse_bilibili_id(raw):
    if not raw:
        return None
    first = raw.split(",")[0].strip()
    return first if first else None


def main():
    base = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    csv_path = os.path.join(base, "data", "members", "members.csv")
    member_dir = os.path.join(base, "member")
    os.makedirs(member_dir, exist_ok=True)

    space_ids = []

    with open(csv_path, encoding="utf-8") as f:
        reader = csv.reader(f)
        next(reader)  # skip header
        for row in reader:
            if len(row) < 2:
                continue
            space_id_str = row[0].strip()
            nickname = row[1].strip()
            if not space_id_str or not nickname:
                continue

            space_id = int(space_id_str)
            handle = row[2].strip() if len(row) > 2 else ""
            team = row[3].strip() if len(row) > 3 else ""
            bilibili_raw = row[4].strip() if len(row) > 4 else ""
            chart_raw = row[6].strip() if len(row) > 6 else ""

            groups = parse_groups(team)
            bilibili_id = parse_bilibili_id(bilibili_raw)
            try:
                chart_id = str(int(chart_raw)) if chart_raw else None
            except ValueError:
                chart_id = None

            data = {"nickname": nickname, "groups": groups}
            if handle:
                data["handle"] = handle
            if bilibili_id:
                data["bilibili_id"] = bilibili_id
            if chart_id:
                data["chart_id"] = chart_id

            data_json = json.dumps(data, ensure_ascii=False, separators=(",", ":"))
            html = TEMPLATE.replace("PLACEHOLDER", data_json)

            out_path = os.path.join(member_dir, f"{space_id}.html")
            with open(out_path, "w", encoding="utf-8") as out:
                out.write(html)

            space_ids.append(space_id)
            print(f"  {space_id}.html — {nickname}")

    print(f"\nTotal: {len(space_ids)} files")
    print("\nBUILT_PAGES:")
    print("var BUILT_PAGES = new Set(" + json.dumps(sorted(space_ids)) + ");")


if __name__ == "__main__":
    main()
