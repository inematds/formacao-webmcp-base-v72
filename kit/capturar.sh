#!/usr/bin/env bash
# capturar.sh — roda cada bloco "Terminal" do curso (kit/blocos/*.sh, em ordem alfabética = ordem de execução)
# e grava a saída em kit/saidas/. É daqui que saem as abas "Saída capturada" das aulas.
# Nenhum bloco chama modelo nem gasta cota. Uso: bash capturar.sh [bloco ...]
set -uo pipefail
K=$(cd "$(dirname "$0")" && pwd)
T=${CAPTURA_TMP:-$(mktemp -d)}
mkdir -p "$K/saidas"
alvos=("$@"); [ ${#alvos[@]} -eq 0 ] && alvos=($(cd "$K/blocos" && ls *.sh | sed 's/\.sh$//'))
for b in "${alvos[@]}"; do
  ( cd /tmp && TMPDIR="$T" bash "$K/blocos/$b.sh" ) 2>&1 | sed "s#$T#/tmp#g" > "$K/saidas/$b.txt"
  echo "$b: $(wc -l < "$K/saidas/$b.txt") linhas"
done
