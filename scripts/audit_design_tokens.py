#!/usr/bin/env python3
"""设计值审计（只读，不改任何代码）。

扫描 style.css + 各页面 <style>/inline 的设计值（颜色 / 字号 / 间距 / 圆角 / 字体），
对照 style.css :root 已有令牌：
  - 能对上现有 token 的 → 标「→ var(--token)」（可后续批量替换）
  - 对不上的硬编码 → 标「❓ 无 token（待定）」交用户决策
  - :root 内同值多 token → 标为「合并候选」
颜色分 HEX（品牌色，主要 tokenize 目标）与 rgba（多为发光/阴影一次性效果）两组。
产出：终端摘要 + 仓库根 DESIGN_AUDIT.md 详表。

用法：python scripts/audit_design_tokens.py
"""
import os, re, sys, glob, json, collections

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

GAP_SCALE   = {4, 8, 12, 16, 24, 32, 48, 64, 96}
TYPE_SCALE  = {10, 11, 12, 13, 14, 15, 16, 18, 22, 24, 26, 28, 32, 40, 44, 52, 64}

HEX  = re.compile(r'#[0-9a-fA-F]{3,8}\b')
RGBA = re.compile(r'rgba?\([^)]*\)')
TOKEN_DEF = re.compile(r'^\s*(--[\w-]+)\s*:\s*([^;]+);')
FONTSIZE  = re.compile(r'font-size\s*:\s*([0-9.]+)px')
RADIUS    = re.compile(r'border-radius\s*:\s*([^;{}]+)')
SPACING_PROP = re.compile(r'(?:^|[\s;{"])((?:margin|padding)(?:-(?:top|bottom|left|right))?|gap|row-gap|column-gap)\s*:\s*([^;{}]+)')
FONTFAMILY = re.compile(r'font-family\s*:\s*([^;{}]+)')
PXNUM = re.compile(r'(-?[0-9.]+)px')


def gather_files():
    files = [os.path.join(BASE, "style.css")]
    for p in glob.glob(os.path.join(BASE, "**", "*.html"), recursive=True):
        r = os.path.relpath(p, BASE).replace("\\", "/")
        if r.startswith("node_modules/"):
            continue
        if re.match(r"member/\d+\.html$", r):                 # 生成的成员 stub（无样式）
            continue
        if r in ("styleguide.html", "styleguide-draft.html"):  # 开发页本身
            continue
        files.append(p)
    return files


def norm_color(v):
    v = v.strip().lower()
    if v.startswith('#'):
        h = v[1:]
        if len(h) == 3:
            h = ''.join(c * 2 for c in h)
        return '#' + h if len(h) in (6, 8) else v
    nums = re.findall(r'-?[0-9.]+', v)
    if v.startswith('rgb') and len(nums) >= 3:
        r, g, b = (int(float(nums[i])) for i in range(3))
        if len(nums) >= 4:
            return f'rgba({r},{g},{b},{float(nums[3])})'
        return f'rgb({r},{g},{b})'
    return v


def rel(path):
    return os.path.relpath(path, BASE).replace("\\", "/")


def main():
    try:
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    except Exception:
        pass

    files = gather_files()

    # ── 1) :root 令牌定义 ──
    token_val = {}
    color_token_by_val = collections.defaultdict(list)
    css_text = open(os.path.join(BASE, "style.css"), encoding="utf-8").read()
    for line in css_text.splitlines():
        m = TOKEN_DEF.match(line)
        if not m:
            continue
        name, val = m.group(1), m.group(2).strip()
        token_val.setdefault(name, val)
        cm = HEX.search(val) or RGBA.search(val)
        if cm and 'var(' not in val:
            nv = norm_color(cm.group(0))
            if name not in color_token_by_val[nv]:
                color_token_by_val[nv].append(name)
    merge_candidates = {v: ts for v, ts in color_token_by_val.items() if len(ts) > 1}

    # ── 2) 使用处 ──
    hexes = collections.defaultdict(list)
    rgbas = collections.defaultdict(list)
    fontsizes = collections.defaultdict(list)
    spacings = collections.defaultdict(list)
    radii = collections.defaultdict(list)
    fontfams = collections.defaultdict(list)
    var_files = collections.defaultdict(set)   # token 名 -> 用到 var(--token) 的文件集合

    for path in files:
        try:
            text = open(path, encoding="utf-8").read()
        except Exception:
            continue
        for i, line in enumerate(text.splitlines(), 1):
            loc = f"{rel(path)}:{i}"
            is_def = bool(TOKEN_DEF.match(line))
            if not is_def:
                for cm in HEX.finditer(line):
                    hexes[norm_color(cm.group(0))].append(loc)
                for cm in RGBA.finditer(line):
                    rgbas[norm_color(cm.group(0))].append(loc)
            for fm in FONTSIZE.finditer(line):
                fontsizes[float(fm.group(1))].append(loc)
            for sm in SPACING_PROP.finditer(line):
                for px in PXNUM.findall(sm.group(2)):
                    spacings[abs(float(px))].append(loc)
            for rm in RADIUS.finditer(line):
                val = rm.group(1).strip()
                if 'var(' not in val:
                    radii[val].append(loc)
            for ff in FONTFAMILY.finditer(line):
                val = ff.group(1).strip()
                if 'var(' not in val:
                    fontfams[val].append(loc)
            for vm in re.finditer(r'var\(\s*(--[\w-]+)', line):
                var_files[vm.group(1)].add(rel(path))

    def fmt_px(x):
        return f"{int(x)}px" if x == int(x) else f"{x}px"

    def locs(lst, n=5):
        s = " · ".join(lst[:n])
        return s + (f" … (+{len(lst) - n})" if len(lst) > n else "")

    o = []
    o.append("# 设计值审计报告（自动生成）\n")
    o.append(f"扫描 {len(files)} 个文件（style.css + 生产页面；已排除 member/N stub 与 styleguide*）。\n")
    o.append("> 只读分析。`→ var(--x)` = 可替换为现有令牌；`❓` = 无对应令牌、待拍板。\n")

    o.append("\n## ① :root 令牌 — 同值合并候选\n")
    o.append("\n".join(
        f"- `{v}` ← {' / '.join('`%s`' % t for t in ts)}（同值，考虑合并，除非语义需区分）"
        for v, ts in sorted(merge_candidates.items())) or "（无）")

    # ②a HEX 颜色（品牌色，主要 tokenize 目标）
    o.append("\n\n## ②a 颜色 · HEX（品牌色 — 主要 tokenize 目标）\n")
    o.append("| 值 | 次数 | 对应令牌 | 位置示例 |")
    o.append("|---|---|---|---|")
    no_token_hex = []
    for v, lst in sorted(hexes.items(), key=lambda kv: -len(kv[1])):
        toks = color_token_by_val.get(v, [])
        if toks:
            tag = " / ".join(f"→ var({t})" for t in toks)
        else:
            tag = "❓ 无 token"
            no_token_hex.append((v, len(lst)))
        o.append(f"| `{v}` | {len(lst)} | {tag} | {locs(lst)} |")

    # ②b rgba（多为发光/阴影一次性效果）
    o.append("\n## ②b 颜色 · rgba（发光/阴影/半透明 — 多为一次性效果）\n")
    o.append("| 值 | 次数 | 对应令牌 | 位置示例 |")
    o.append("|---|---|---|---|")
    no_token_rgba_rep = []  # 高频无 token rgba（≥3 次，值得 tokenize）
    for v, lst in sorted(rgbas.items(), key=lambda kv: -len(kv[1])):
        toks = color_token_by_val.get(v, [])
        tag = (" / ".join(f"→ var({t})" for t in toks)) if toks else "❓ 无 token"
        if not toks and len(lst) >= 3:
            no_token_rgba_rep.append((v, len(lst)))
        o.append(f"| `{v}` | {len(lst)} | {tag} | {locs(lst, 4)} |")

    o.append("\n## ③ 字号 Font-size\n")
    o.append("| px | 次数 | 在档? | 位置示例 |")
    o.append("|---|---|---|---|")
    for x, lst in sorted(fontsizes.items()):
        on = "✅" if int(x) in TYPE_SCALE else "🔸 离散"
        o.append(f"| {fmt_px(x)} | {len(lst)} | {on} | {locs(lst)} |")

    o.append("\n## ④ 间距 Spacing（margin/padding/gap 内各 px）\n")
    o.append("| px | 次数 | 在档? | 位置示例 |")
    o.append("|---|---|---|---|")
    for x, lst in sorted(spacings.items()):
        on = "✅" if int(x) in GAP_SCALE else "🔸 离散"
        o.append(f"| {fmt_px(x)} | {len(lst)} | {on} | {locs(lst)} |")

    o.append("\n## ⑤ 圆角 Radius\n")
    o.append("| 值 | 次数 | 位置示例 |")
    o.append("|---|---|---|")
    for v, lst in sorted(radii.items()):
        o.append(f"| `{v}` | {len(lst)} | {locs(lst)} |")

    o.append("\n## ⑥ 硬编码字体栈（未用 var(--font-*)）\n")
    o.append("\n".join(
        f"- `{v}` × {len(lst)} — {locs(lst, 3)}"
        for v, lst in sorted(fontfams.items(), key=lambda kv: -len(kv[1]))) or "（无）")

    open(os.path.join(BASE, "DESIGN_AUDIT.md"), "w", encoding="utf-8").write("\n".join(o) + "\n")

    # ── 导出 styleguide-data.js（供 styleguide.html 可视化渲染）──
    # 解析 :root 令牌（保留顺序 + 分组注释）
    tokens = []
    group = "其它"
    in_root = False
    depth = 0
    for line in css_text.splitlines():
        if not in_root:
            if re.match(r'\s*:root\s*\{', line):
                in_root = True
                depth = line.count('{') - line.count('}')
            continue
        depth += line.count('{') - line.count('}')
        dm = TOKEN_DEF.match(line)
        cm = re.match(r'\s*/\*\s*[-─\s]*(.+?)\s*[-─\s]*\*/\s*$', line)
        if cm and not dm:  # 整行注释才可能是分组头
            cleaned = re.sub(r'（.*?）|\(.*?\)', '', cm.group(1)).strip()
            # 「── 标题 ──」或 短且无散文标点 才算分组头，跳过散文注释
            if cleaned and ('─' in line or (len(cleaned) <= 22 and not re.search(r'[，。：、]', cleaned))):
                group = cleaned
        if dm:
            mm = re.match(r'\s*(--[\w-]+)\s*:\s*([^;]+);', line)
            if mm:
                name, val = mm.group(1), mm.group(2).strip()
                is_color = bool(HEX.search(val) or RGBA.search(val) or 'var(--clr' in val)
                tokens.append({"name": name, "value": val, "group": group, "color": is_color,
                               "files": sorted(var_files.get(name, []))})
        if depth <= 0:
            break

    def files_of(loclist):                       # loc "file:line" -> 去重文件列表
        return sorted({l.rsplit(':', 1)[0] for l in loclist})

    def color_list(d):
        out = []
        for v, lst in sorted(d.items(), key=lambda kv: -len(kv[1])):
            tks = color_token_by_val.get(v, [])
            out.append({"value": v, "count": len(lst), "token": (tks[0] if tks else None),
                        "files": files_of(lst)})
        return out

    data = {
        "tokens": tokens,
        "hardcodedHex": [x for x in color_list(hexes) if not x["token"]],
        "hardcodedRgba": [x for x in color_list(rgbas) if not x["token"]],
        "fontSizes": [{"px": (int(x) if x == int(x) else x), "count": len(lst),
                       "onScale": int(x) in TYPE_SCALE, "files": files_of(lst)} for x, lst in sorted(fontsizes.items())],
        "spacings": [{"px": (int(x) if x == int(x) else x), "count": len(lst),
                      "onScale": int(x) in GAP_SCALE, "files": files_of(lst)} for x, lst in sorted(spacings.items())],
        "radii": [{"value": v, "count": len(lst), "files": files_of(lst)} for v, lst in sorted(radii.items())],
        "fonts": [{"value": v, "count": len(lst), "files": files_of(lst)} for v, lst in sorted(fontfams.items(), key=lambda kv: -len(kv[1]))],
    }
    js = "/* 自动生成 by scripts/audit_design_tokens.py — 勿手改 */\nwindow.SG_AUDIT = " \
         + json.dumps(data, ensure_ascii=False, indent=2) + ";\n"
    open(os.path.join(BASE, "styleguide-data.js"), "w", encoding="utf-8").write(js)

    # ── 终端摘要 ──
    p = print
    p(f"扫描文件: {len(files)}")
    p(f"HEX 颜色 distinct: {len(hexes)}（无 token: {len(no_token_hex)}）")
    p(f"rgba 颜色 distinct: {len(rgbas)}（高频无 token ≥3次: {len(no_token_rgba_rep)}）")
    p(f"字号 distinct: {len(fontsizes)}（离散: {sum(1 for x in fontsizes if int(x) not in TYPE_SCALE)}）")
    p(f"间距 distinct: {len(spacings)}（离散: {sum(1 for x in spacings if int(x) not in GAP_SCALE)}）")
    p(f"圆角 distinct: {len(radii)} | 合并候选: {len(merge_candidates)} | 硬编码字体栈: {len(fontfams)}")
    p("\n[需你拍板] 无对应 token 的 HEX（按频次）:")
    for v, c in sorted(no_token_hex, key=lambda x: -x[1]):
        p(f"   {v}  x{c}")
    if no_token_rgba_rep:
        p("\n[可选 tokenize] 高频无 token 的 rgba（>=3 次）:")
        for v, c in sorted(no_token_rgba_rep, key=lambda x: -x[1]):
            p(f"   {v}  x{c}")
    p("\n详表 -> DESIGN_AUDIT.md")


if __name__ == "__main__":
    main()
