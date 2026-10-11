import os

BASE = r"E:\21306_index_export (需求)"
files = sorted([f for f in os.listdir(BASE) if f.endswith(".html")])

count = 0
for f in files:
    p = os.path.join(BASE, f)
    with open(p, "r", encoding="utf-8-sig") as fh:
        lines = fh.readlines()
    new_lines = []
    skip = False
    for i, line in enumerate(lines):
        # Detect start of version comment block
        if "一·附、版本号标识" in line or ("===" in line and "版本号标识" in line):
            skip = True
            continue
        # Skip lines until we find the next section comment (二、)
        if skip:
            if "二、纸张" in line:
                skip = False
                new_lines.append(line)
            # Skip blank lines and incomplete comment lines
            if line.strip() and not line.strip().startswith("/*"):
                # This might be the closing of a broken comment
                if "*/" in line or line.strip().startswith("/*"):
                    pass  # still skip
                else:
                    skip = False  # stop skipping
                    new_lines.append(line)
            continue
        new_lines.append(line)
    content = "".join(new_lines)
    if content != "".join(lines):
        with open(p, "w", encoding="utf-8-sig") as fh:
            fh.write(content)
        count += 1
        print(f"Fixed: {f}")

print(f"Total fixed: {count}")

# Verify
remaining = []
for f in files:
    p = os.path.join(BASE, f)
    with open(p, "r", encoding="utf-8-sig") as fh:
        content = fh.read()
    if "版本号标识" in content or "version-badge" in content:
        remaining.append(f)
print(f"Remaining: {len(remaining)}")