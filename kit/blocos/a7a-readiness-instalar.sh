E=${TMPDIR:-/tmp}/ensaio-formacao-webmcp-base-v72
mkdir -p $E && cd $E
[ -d webmcp-readiness ] || git clone -q https://github.com/inematds/webmcp-readiness
cd webmcp-readiness && git checkout -q 3f3d1c8 && npm ci --no-audit --no-fund --silent
npm test 2>&1 | grep -E '^ℹ (tests|pass|fail) '
