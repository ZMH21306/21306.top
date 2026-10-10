import os
import subprocess

REPO = r'D:\github\21306.top'
BASE = r'E:\21306_index_export (需求)'
START = '1e52cffd14828733b47c50b447a584950c551940'

# Get all commits with their short hash and timestamp
res = subprocess.run(
    ['git', 'log', '--format=%H %ad', '--date=format:%Y%m%d%H%M%S%z',
     START + '..HEAD', '--', '*index*'],
    cwd=REPO, capture_output=True, text=True, encoding='utf-8')

rows = [l.strip().split() for l in res.stdout.split('\n') if l.strip()]
start_stamp = subprocess.run(
    ['git', 'show', '-s', '--format=%ad', '--date=format:%Y%m%d%H%M%S%z', START],
    cwd=REPO, capture_output=True, text=True, encoding='utf-8').stdout.strip()

all_rows = [(START, start_stamp)] + rows
all_rows.sort(key=lambda x: (x[1], x[0][:8]))

# Build stamp -> short hash map
stamp_to_hash = {s[:14]: h[:8] for h, s in all_rows}

# Read existing manifest to get subject for each timestamp
man_path = os.path.join(BASE, '_MANIFEST.txt')
old_man = open(man_path, encoding='utf-8-sig').read().splitlines()
stamp_to_subj = {}
for line in old_man:
    parts = line.split('\t')
    if len(parts) >= 4:
        stamp_to_subj[parts[1]] = parts[3]

# Get all existing HTML files sorted by timestamp
files = [f for f in os.listdir(BASE) if f.endswith('.html')]
files.sort(key=lambda f: f.split('-')[1][:14])

# Write new manifest
out_lines = []
for i, f in enumerate(files, 1):
    stamp = f.split('-', 1)[1]
    gh = stamp_to_hash.get(stamp, '?')
    subj = stamp_to_subj.get(stamp, 'unknown')
    out_lines.append('v%04d\t%s\t%s\t%s' % (i, stamp, gh, subj))

with open(man_path, 'w', encoding='utf-8-sig') as fh:
    fh.write('\n'.join(out_lines) + '\n')

print('manifest written with %d lines' % len(out_lines))
for l in out_lines[:5]:
    print(' ', l)
