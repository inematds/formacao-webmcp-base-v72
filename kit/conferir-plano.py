#!/usr/bin/env python3
"""conferir-plano.py — confere se o plano do seu site para agentes está preenchido.

Cada seção "## " do plano-modelo.md tem de existir, ter texto e não guardar nenhum <marcador>;
o plano inteiro precisa de pelo menos uma data dd/mm/aaaa. Saída 0 = pronto; 1 = falta algo.
Uso: python3 conferir-plano.py meu-plano.md
"""
import re
import sys
from pathlib import Path

SECOES = ["Site e data", "Como os agentes usam o site hoje", "O que o agente enxerga",
          "Quem pode entrar", "Readiness", "WebMCP", "Próximos passos"]


def main():
    if len(sys.argv) < 2:
        print(__doc__.strip())
        return 2
    texto = Path(sys.argv[1]).read_text(encoding="utf-8")
    partes = dict((m.group(1).strip(), m.group(2)) for m in re.finditer(r"^## ([^\n]+)\n(.*?)(?=^## |\Z)", texto, re.M | re.S))
    ok = 0
    for s in SECOES:
        corpo = partes.get(s)
        if corpo is None:
            print(f"  falta a seção: {s}")
        elif re.search(r"<[^>\n]+>", corpo):
            print(f"  ainda tem <marcador> em: {s}")
        elif not corpo.strip():
            print(f"  seção vazia: {s}")
        else:
            ok += 1
    data = re.search(r"\b\d{2}/\d{2}/\d{4}\b", texto)
    if not data:
        print("  nenhuma data dd/mm/aaaa no plano")
    print(f"{ok}/{len(SECOES)} seções preenchidas · data: {data.group(0) if data else 'nenhuma'}")
    return 0 if ok == len(SECOES) and data else 1


if __name__ == "__main__":
    sys.exit(main())
