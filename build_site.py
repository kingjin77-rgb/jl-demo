#!/usr/bin/env python3
"""단지 설정 하나로 배포용 index.html 을 만듭니다.
사용법 : python3 build_site.py configs/config-<단지>.js out/<단지>/index.html"""
import sys, os

base = os.path.dirname(os.path.abspath(__file__))
cfg_path, out_path = sys.argv[1], sys.argv[2]

html = open(os.path.join(base, 'app.html'), encoding='utf-8').read()
app  = open(os.path.join(base, 'app.js'),   encoding='utf-8').read()
cfg  = open(cfg_path, encoding='utf-8').read()

tag = '<script src="config.js"></script>\n<script src="app.js"></script>'
assert tag in html, 'app.html 의 script 태그를 찾지 못했습니다'
html = html.replace(tag, '<script>\n' + cfg + '\n</script>\n<script>\n' + app + '\n</script>')
assert '<script src=' not in html

os.makedirs(os.path.dirname(out_path), exist_ok=True)
open(out_path, 'w', encoding='utf-8').write(html)
print('%s  →  %s  (%d KB)' % (os.path.basename(cfg_path), out_path, len(html.encode())/1024))
