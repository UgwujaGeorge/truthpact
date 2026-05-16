#!/usr/bin/env python3
"""Extract prose text from Webflow blog post HTML files."""
import re, html as h, sys, os, glob

def extract(path):
    with open(path) as fh:
        s = fh.read()
    # Find main content
    m = re.search(r'<main[^>]*>(.*?)</main>', s, re.DOTALL)
    if not m:
        return None
    body = m.group(1)
    # Strip script/style
    body = re.sub(r'<script.*?</script>', '', body, flags=re.DOTALL)
    body = re.sub(r'<style.*?</style>', '', body, flags=re.DOTALL)
    # Strip footer and "Latest Updates" CMS section
    body = re.sub(r'<h2[^>]*>\s*Latest Updates.*', '', body, flags=re.DOTALL)
    # Convert tags
    body = re.sub(r'<h1[^>]*>', '\n\n# ', body)
    body = re.sub(r'</h1>', '\n', body)
    body = re.sub(r'<h2[^>]*>', '\n\n## ', body)
    body = re.sub(r'</h2>', '\n', body)
    body = re.sub(r'<h3[^>]*>', '\n\n### ', body)
    body = re.sub(r'</h3>', '\n', body)
    body = re.sub(r'<h4[^>]*>', '\n\n#### ', body)
    body = re.sub(r'</h4>', '\n', body)
    body = re.sub(r'<p[^>]*>', '\n\n', body)
    body = re.sub(r'</p>', '\n', body)
    body = re.sub(r'<li[^>]*>', '\n- ', body)
    body = re.sub(r'<br[^>]*/?>', '\n', body)
    body = re.sub(r'<code[^>]*>', '`', body)
    body = re.sub(r'</code>', '`', body)
    body = re.sub(r'<pre[^>]*>', '\n```\n', body)
    body = re.sub(r'</pre>', '\n```\n', body)
    body = re.sub(r'<a [^>]*href="([^"]*)"[^>]*>([^<]*)</a>', r'[\2](\1)', body)
    body = re.sub(r'<[^>]+>', '', body)
    body = h.unescape(body)
    body = re.sub(r'\n\s*\n\s*\n+', '\n\n', body)
    # Clean lingering nbsp / zero-width
    body = body.replace('‍', '').replace('\xa0', ' ')
    return body.strip()

if __name__ == '__main__':
    for path in sorted(glob.glob('post-*.html')):
        out = path.replace('.html', '.txt')
        text = extract(path)
        if text:
            with open(out, 'w') as fh:
                fh.write(text)
            print(f"{path} -> {out} ({len(text)} chars)")
        else:
            print(f"{path}: NO MATCH")
