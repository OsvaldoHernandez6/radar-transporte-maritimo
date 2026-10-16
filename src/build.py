"""Regenera data.json e index.html a partir de src/.

Uso (desde la raíz del repo):  python3 src/build.py
"""
import json, os, subprocess, sys

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)

subprocess.run([sys.executable, os.path.join(HERE, "build_data.py")], check=True)
scores = json.load(open(os.path.join(HERE, "scores.json"), encoding="utf-8"))
content = json.load(open(os.path.join(HERE, "content.json"), encoding="utf-8"))
data = {**content, "brands": scores["brands"]}

json.dump(data, open(os.path.join(ROOT, "data.json"), "w", encoding="utf-8"), ensure_ascii=False, indent=1)
template = open(os.path.join(HERE, "template.html"), encoding="utf-8").read()
html = template.replace("__DATA__", json.dumps(data, ensure_ascii=False).replace("</", "<\\/"))
open(os.path.join(ROOT, "index.html"), "w", encoding="utf-8").write(html)
print("OK: index.html y data.json regenerados")
