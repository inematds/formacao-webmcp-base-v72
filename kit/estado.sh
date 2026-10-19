#!/usr/bin/env bash
# estado.sh — lê, nas fontes primárias, em que pé o WebMCP está HOJE e imprime com a data da leitura.
# Fontes: a spec (W3C Web Machine Learning CG), o implementation-status.md do repositório da spec
# e as posições de Mozilla e WebKit (issues públicas, lidas pela API pública do GitHub, sem login).
# Uso: bash estado.sh      (precisa de curl; nenhuma chave, nenhum modelo)
set -uo pipefail
SPEC=https://webmachinelearning.github.io/webmcp/
STATUS=https://raw.githubusercontent.com/webmachinelearning/webmcp/main/implementation-status.md

pagina=$(curl -fsSL "$SPEC") || { echo "não consegui ler $SPEC"; exit 1; }
data=$(grep -o 'dt-updated" datetime="[0-9-]*"' <<<"$pagina" | grep -o '[0-9-]\{10\}' | head -1)
texto=$(sed 's/<[^>]*>//g' <<<"$pagina")
echo "spec WebMCP · versão de ${data:-?} · $(grep -o 'not a W3C Standard' <<<"$texto" | head -1)"
echo "  document.modelContext: $(grep -o 'document\.modelContext' <<<"$texto" | wc -l) menções · navigator.modelContext: $(grep -o 'navigator\.modelContext' <<<"$texto" | wc -l)"

status=$(curl -fsSL "$STATUS") || { echo "não consegui ler $STATUS"; exit 1; }
for nav in Chrome Edge; do
  linha=$(grep -o "An \[Origin Trial\]([^)]*) is live in $nav [0-9]*" <<<"$status" | sed 's/(\([^)]*\))//; s/\[//; s/\]//')
  echo "$nav · ${linha:-sem linha de origin trial no implementation-status.md}"
done

for par in "Firefox mozilla 1412" "Safari WebKit 670"; do
  set -- $par
  pos=$(curl -fsSL "https://api.github.com/repos/$2/standards-positions/issues/$3" | grep -o '"name": *"position: [a-z-]*"' | grep -o 'position: [a-z-]*')
  echo "$1 · $2/standards-positions #$3 · ${pos:-sem rótulo de posição}"
done
echo "lido em $(date +%d/%m/%Y)"
