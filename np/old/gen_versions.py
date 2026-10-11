import os
base = r'D:\github\21306.top\np\old'
files = sorted([f for f in os.listdir(base) if f.endswith('.html') and not f.startswith('index')])
lines = ['const versions = [']
for f in files:
    vid = f[:5]
    time_str = f[6:14] + ' ' + f[14:20]
    lines.append(f'  {{"id":"{vid}","file":"{f}","time":"{time_str}"}},')
lines[-1] = lines[-1][:-1]  # remove last comma
lines.append('];')
with open(os.path.join(base, 'timeline.js'), 'w', encoding='utf-8') as out:
    out.write('\n'.join(lines))
print(f'Created timeline.js with {len(files)} versions')
