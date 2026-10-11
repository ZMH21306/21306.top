import subprocess
import os
import shutil

REPO = r'D:\github\21306.top'
EXPORT = r'E:\21306_index_export'
START = '1e52cffd14828733b47c50b447a584950c551940'


def run(args):
    return subprocess.run(args, cwd=REPO, capture_output=True, text=True, encoding='utf-8')


def runb(args):
    return subprocess.run(args, cwd=REPO, capture_output=True)


# commits touching an index file AFTER START, oldest first; then START itself
res = run(['git', 'log', '--format=%H', '--reverse', f'{START}..HEAD', '--', '*index*'])
commits = [c.strip() for c in res.stdout.split('\n') if c.strip()]

res0 = run(['git', 'log', '--format=%H', '--max-count=1', START, '--', '*index*'])
start_hashes = [c.strip() for c in res0.stdout.split('\n') if c.strip()]
if start_hashes:
    commits = start_hashes + commits
print('commits touching index files (START..HEAD):', len(commits))

pairs = []
seen = set()
for c in commits:
    r = run(['git', 'show', '--name-only', '--format=', c, '--', '*index*'])
    for f in r.stdout.split('\n'):
        f = f.strip()
        if not f:
            continue
        if 'index' not in f.lower():
            continue
        if f.lower().endswith('.vsidx'):
            continue
        if '.vs/' in f.replace('\\', '/'):
            continue
        k = (c, f)
        if k in seen:
            continue
        seen.add(k)
        pairs.append(k)

print('commit/file pairs to export:', len(pairs))

if os.path.exists(EXPORT):
    shutil.rmtree(EXPORT, ignore_errors=True)
os.makedirs(EXPORT, exist_ok=True)


def decode(b):
    try:
        return b.decode('utf-8')
    except UnicodeDecodeError:
        pass
    for enc in ('gb18030', 'big5'):
        try:
            return b.decode(enc)
        except UnicodeDecodeError:
            continue
    return b.decode('utf-8', errors='replace')


ok = 0
skipped = 0
for commit, path in pairs:
    r = runb(['git', 'show', f'{commit}:{path}'])
    safe = path.replace('/', '\\')
    outdir = os.path.join(EXPORT, os.path.dirname(safe))
    os.makedirs(outdir, exist_ok=True)
    base = os.path.splitext(os.path.basename(safe))[0]
    ext = os.path.splitext(safe)[1]
    if r.returncode != 0:
        # this commit deleted the file: no content to export, keep a marker
        out = os.path.join(outdir, f'{base}_{commit[:8]}.deleted.txt')
        d = run(['git', 'show', '-s', '--format=%ad', '--date=short', commit]).stdout.strip()
        s = run(['git', 'show', '-s', '--format=%s', commit]).stdout.strip()
        note = (f'该提交删除了此文件，故无内容可导出。\n'
                f'File deleted in this commit, no content to export.\n'
                f'commit: {commit}\ntime: {d}\nsubject: {s}\n')
        with open(out, 'w', encoding='utf-8-sig', newline='') as fh:
            fh.write(note)
        skipped += 1
        continue
    content = decode(r.stdout)
    out = os.path.join(outdir, f'{base}_{commit[:8]}{ext}')
    with open(out, 'w', encoding='utf-8-sig', newline='') as fh:
        fh.write(content)
    ok += 1

print('exported versions:', ok, '| deletion markers:', skipped,
      '| total slots:', len(pairs))

with open(os.path.join(EXPORT, '_MANIFEST.txt'), 'w', encoding='utf-8-sig') as fh:
    for commit, path in pairs:
        d = run(['git', 'show', '-s', '--format=%ad', '--date=short', commit]).stdout.strip()
        s = run(['git', 'show', '-s', '--format=%s', commit]).stdout.strip()
        fh.write(f'{d}\t{commit[:8]}\t{path}\t{s}\n')
print('manifest done')
