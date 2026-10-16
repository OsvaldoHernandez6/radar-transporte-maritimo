"""Regenera data.json e index.html. Uso desde la raíz del repo: python3 src/build.py"""
import os, subprocess, sys
HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.dirname(HERE)
subprocess.run([sys.executable, os.path.join(HERE, "build_data.py")], check=True)
head = open(os.path.join(HERE, "head.html"), encoding="utf-8").read()
js = open(os.path.join(HERE, "script.js"), encoding="utf-8").read()
open(os.path.join(ROOT, "index.html"), "w", encoding="utf-8").write(head + "<script>\n" + js + "</script>\n</body>\n</html>\n")
print("OK: index.html y data.json regenerados")
