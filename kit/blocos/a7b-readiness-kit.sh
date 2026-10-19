E=${TMPDIR:-/tmp}/ensaio-formacao-webmcp-base-v72
cd ~/projetos/formacao-webmcp-base-v72/kit
for p in antes depois; do node readiness-local.mjs $E/webmcp-readiness $p; echo "saída: $?"; done
