import os
import re

BASE = r'E:\21306_index_export (需求)'
files = [f for f in os.listdir(BASE) if f.endswith('.html')]
files.sort(key=lambda f: f.split('-')[1][:14])  # sort by timestamp

# Create mapping: old_name -> new_name
renames = []
for i, f in enumerate(files, 1):
    # v0002 should become v0001, v0003 -> v0002, etc.
    old_name = f
    # get the timestamp part after the first dash
    timestamp = f.split('-', 1)[1]
    new_name = 'v%04d-%s' % (i-1, timestamp)
    renames.append((os.path.join(BASE, f), os.path.join(BASE, new_name)))

# Perform renames
for old_path, new_path in renames:
    os.rename(old_path, new_path)
    print('renamed: %s -> %s' % (old_path, new_path))

print('done')