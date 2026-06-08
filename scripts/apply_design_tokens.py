#!/usr/bin/env python3
"""把硬编码颜色批量归并到 :root 令牌（默认 dry-run，--write 才落盘）。

安全策略：
  - 只在 CSS 上下文替换 —— style.css（跳过令牌定义行）、HTML 的 <style> 块、style="" 内联。
    绝不碰 SVG 的 fill/stroke 等属性（属性不认 var()）。
  - 替换为精确 1:1（token 值 == 原硬编码值），零视觉变化，纯重构。
  - --write 时先把缺失的新令牌插入 :root，再做替换（令牌定义行被跳过，不会自引用）。

用法：
  python scripts/apply_design_tokens.py          # dry-run，打印将发生的替换
  python scripts/apply_design_tokens.py --write  # 实际写入
"""
import os, re, sys, glob, collections

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# ── 新令牌（名, 值, 注释）；已存在的会跳过插入 ──
NEW_TOKENS = [
    ("--clr-silver",       "#90b8d0", "排名 No.2 银"),
    ("--clr-bronze",       "#e0a870", "排名 No.3 铜"),
    ("--clr-gold-tint",    "#fff4d6", "金档歌名微调"),
    ("--clr-silver-tint",  "#d4e8f4", "银档歌名微调"),
    ("--clr-bronze-tint",  "#f4dcc0", "铜档歌名微调"),
    ("--clr-up",           "#4ade80", "走势上升 绿"),
    ("--clr-down",         "#f87171", "走势下降 红"),
    ("--clr-re",           "#facc15", "走势重入 黄"),
    ("--clr-team-cun",     "#d49840", "小组 村摇欧共体"),
    ("--clr-esc",          "#4ecca3", "活动 ECVP 青"),
    ("--clr-white",        "#ffffff", "纯白"),
    ("--clr-cta-1",        "#9840f0", "CTA 渐变 stop"),
    ("--clr-cta-2",        "#7030c8", "CTA 渐变 stop"),
    ("--clr-cta-3",        "#4c18a0", "CTA 渐变 stop"),
]
COLOR_MAP = {v.lower(): name for name, v, _ in NEW_TOKENS}

TOKEN_DEF = re.compile(r'^\s*--[\w-]+\s*:')
STYLE_BLOCK = re.compile(r'(<style[^>]*>)(.*?)(</style>)', re.DOTALL | re.IGNORECASE)
STYLE_ATTR = re.compile(r'(style\s*=\s*")([^"]*)(")', re.IGNORECASE)


def short_hex(h):
    """#aabbcc -> #abc（仅当可缩写）"""
    b = h[1:]
    if len(b) == 6 and b[0] == b[1] and b[2] == b[3] and b[4] == b[5]:
        return '#' + b[0] + b[2] + b[4]
    return None


def replace_css(text, counts):
    """在一段 CSS 文本里把映射颜色替换为 var()。"""
    for hexv, tok in COLOR_MAP.items():
        pats = [hexv]
        s = short_hex(hexv)
        if s:
            pats.append(s)
        for pat in pats:
            rx = re.compile(re.escape(pat) + r'\b', re.IGNORECASE)
            text, n = rx.subn(f'var({tok})', text)
            if n:
                counts[tok] += n
    return text


def process_file(path, counts, skipped_attr_white):
    rel = os.path.relpath(path, BASE).replace("\\", "/")
    text = open(path, encoding="utf-8").read()

    if rel == "style.css":
        out = []
        for line in text.splitlines(keepends=True):
            if TOKEN_DEF.match(line):       # 令牌定义行：不动
                out.append(line)
            else:
                out.append(replace_css(line, counts))
        return "".join(out)

    # HTML：仅 <style> 块 + style="" 内联
    # 统计被跳过的 SVG/属性内白色（仅作提示）
    n_white_attr = len(re.findall(r'(?:fill|stroke)\s*=\s*"#(?:fff|ffffff)"', text, re.IGNORECASE))
    skipped_attr_white[rel] = n_white_attr

    def style_block_sub(m):
        return m.group(1) + replace_css(m.group(2), counts) + m.group(3)
    text = STYLE_BLOCK.sub(style_block_sub, text)

    def style_attr_sub(m):
        return m.group(1) + replace_css(m.group(2), counts) + m.group(3)
    text = STYLE_ATTR.sub(style_attr_sub, text)
    return text


def insert_tokens(css_text):
    """把缺失的 NEW_TOKENS 插入第一个 :root{} 末尾。"""
    missing = [(n, v, c) for n, v, c in NEW_TOKENS if not re.search(r'^\s*' + re.escape(n) + r'\s*:', css_text, re.MULTILINE)]
    if not missing:
        return css_text, []
    block = "\n  /* ── 语义色 / 排名 / 走势 / CTA（由 audit 归并）── */\n"
    block += "".join(f"  {n}: {v}; /* {c} */\n" for n, v, c in missing)
    # 插到第一个 :root { ... } 的最后一个 } 前
    m = re.search(r':root\s*\{', css_text)
    if not m:
        return css_text, missing
    depth = 0
    for i in range(m.end() - 1, len(css_text)):
        if css_text[i] == '{':
            depth += 1
        elif css_text[i] == '}':
            depth -= 1
            if depth == 0:
                return css_text[:i] + block + css_text[i:], missing
    return css_text, missing


def gather_files():
    files = [os.path.join(BASE, "style.css")]
    for p in glob.glob(os.path.join(BASE, "**", "*.html"), recursive=True):
        r = os.path.relpath(p, BASE).replace("\\", "/")
        if r.startswith("node_modules/") or re.match(r"member/\d+\.html$", r):
            continue
        if r in ("styleguide.html", "styleguide-draft.html"):
            continue
        files.append(p)
    return files


def main():
    try:
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    except Exception:
        pass
    write = "--write" in sys.argv
    files = gather_files()
    counts = collections.defaultdict(int)
    skipped_attr_white = {}
    file_changes = {}

    for path in files:
        new_text = process_file(path, counts, skipped_attr_white)
        orig = open(path, encoding="utf-8").read()
        if new_text != orig:
            file_changes[os.path.relpath(path, BASE).replace("\\", "/")] = True
            if write:
                open(path, "w", encoding="utf-8", newline="").write(new_text)

    # 插入令牌（仅 write）
    css_path = os.path.join(BASE, "style.css")
    css = open(css_path, encoding="utf-8").read()
    css2, missing = insert_tokens(css)
    if write and missing:
        open(css_path, "w", encoding="utf-8", newline="").write(css2)

    mode = "WRITE ✅" if write else "DRY-RUN（未写盘）"
    print(f"=== apply_design_tokens [{mode}] ===\n")
    print("将插入的新令牌:" if not write else "已插入的新令牌:")
    for n, v, c in (missing if not write else missing):
        print(f"  {n}: {v}   /* {c} */")
    if not missing:
        print("  （全部已存在）")
    print("\n每令牌替换次数:")
    total = 0
    for n, v, c in NEW_TOKENS:
        if counts.get(n):
            print(f"  {n:<20} x{counts[n]}")
            total += counts[n]
    print(f"  合计替换: {total}")
    print(f"\n受影响文件 ({len(file_changes)}):")
    for f in sorted(file_changes):
        print(f"  {f}")
    sw = {k: v for k, v in skipped_attr_white.items() if v}
    if sw:
        print("\n[已跳过] SVG fill/stroke 内的白色（保留不动）:")
        for f, n in sorted(sw.items()):
            print(f"  {f}: {n} 处")
    if not write:
        print("\n确认无误后运行：python scripts/apply_design_tokens.py --write")


if __name__ == "__main__":
    main()
