#!/usr/bin/env bash
set -euo pipefail

if [[ $# -ne 1 || ! -f "$1" ]]; then
  echo 'Uso: bash scripts/render-e2e-diagrams.sh /ruta/a/plantuml.jar' >&2
  exit 1
fi

diagram_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)/docs/diagrams/e2e"
java -Djava.awt.headless=true -jar "$1" -charset UTF-8 --check-before-run --svg "$diagram_root"/*.puml
java -Djava.awt.headless=true -jar "$1" -charset UTF-8 --check-before-run --png "$diagram_root"/*.puml
