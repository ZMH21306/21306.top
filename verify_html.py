with open(r'D:\github\21306.top\IQEDU_API_Documentation.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Check script tag balance
script_open = content.count('<script>')
script_close = content.count('</script>')
print('Script tags: open =', script_open, ', close =', script_close)
print('Balance OK:', script_open == script_close)

# Check consent elements
has_overlay = 'consentOverlay' in content
has_consent_text = '请确保您是自愿浏览' in content
has_consent_btn = 'consentBtn' in content
print('Has consent overlay:', has_overlay)
print('Has consent text:', has_consent_text)
print('Has consent button:', has_consent_btn)

# Check overlay div visibility
if has_overlay:
    start_idx = content.find('<div id="consentOverlay"')
    if start_idx != -1:
        end_idx = content.find('</div>', start_idx)
        if end_idx != -1:
            overlay_html = content[start_idx:end_idx+6]
            print()
            print('Overlay HTML found:')
            print('  display: flex:', 'display: flex' in overlay_html)
            print('  position: fixed:', 'position: fixed' in overlay_html)
            print('  inset: 0:', 'inset: 0' in overlay_html)
            print('  z-index: 9999:', 'z-index: 9999' in overlay_html)
            print('  Contains consent text:', '请确保您是自愿浏览，内容由诡异的Y1入制作' in overlay_html)
            if 'display: flex' in overlay_html and 'z-index: 9999' in overlay_html:
                print()
                print('OVERLAY IS VISIBLE BY DEFAULT!')
            else:
                print()
                print('OVERLAY MAY NOT BE VISIBLE')
            print()
            print('Overlay block:')
            print(overlay_html)

# Check structure around the overlay
idx = content.find('consentOverlay')
if idx > 0:
    start = max(0, idx - 200)
    print()
    print('=== Context before consentOverlay ===')
    print(content[start:idx+100])