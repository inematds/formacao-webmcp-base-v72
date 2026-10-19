cd ~/projetos/formacao-webmcp-base-v72/kit
for p in depois antes; do echo "## $p.html"; node tres-jeitos.mjs $p; echo "saída: $?"; done
