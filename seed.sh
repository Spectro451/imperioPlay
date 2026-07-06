#!/usr/bin/env bash
# seed.sh — Datos de prueba para ImperioPlay.
# Uso: bash seed.sh
# Req: curl, backend corriendo en localhost:3000

BASE="http://localhost:3000"
ADMIN_EMAIL="seed@imperio.com"
ADMIN_PASS="seedpass123"

echo "Creando usuario admin..."
curl -s -X POST "$BASE/usuario" \
  -H "Content-Type: application/json" \
  -d "{\"nombre\":\"Seed Admin\",\"correo\":\"$ADMIN_EMAIL\",\"password\":\"$ADMIN_PASS\",\"rol\":\"admin\"}" \
  -o /dev/null

echo "Login..."
TOKEN=$(curl -s -X POST "$BASE/auth/login" \
  -H "Content-Type: application/json" \
  -d "{\"correo\":\"$ADMIN_EMAIL\",\"password\":\"$ADMIN_PASS\"}" \
  | grep -o '"access_token":"[^"]*"' | cut -d'"' -f4)

if [[ -z "$TOKEN" ]]; then
  echo "ERROR: no se pudo obtener el token. ¿Está corriendo el backend?"
  exit 1
fi

echo "Token obtenido. Creando juegos y consolas..."

J() {
  curl -s -X POST "$BASE/juego" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $TOKEN" \
    -d "$1" -o /dev/null
  echo "  juego: $2"
}

C() {
  curl -s -X POST "$BASE/consola" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $TOKEN" \
    -d "$1" -o /dev/null
  echo "  consola: $2"
}

# ── JUEGOS ────────────────────────────────────────────────────────────────────

echo ""
echo "[A] Mismo título, distintas plataformas"
J '{"producto":{"nombre":"God of War","tipo":"juego","sku":"GOW-001"},"juego":{"consola":"Ps4","estado":"usado","stock":3,"precio_base":15000}}' \
  "God of War · Ps4 · usado"
J '{"producto":{"nombre":"God of War","tipo":"juego","sku":"GOW-001"},"juego":{"consola":"Ps5","estado":"nuevo","stock":5,"precio_base":30000}}' \
  "God of War · Ps5 · nuevo"

echo ""
echo "[B] Mismo título + plataforma, distinto estado"
J '{"producto":{"nombre":"The Last of Us Part I","tipo":"juego","sku":"TLOU-001"},"juego":{"consola":"Ps4","estado":"nuevo","stock":4,"precio_base":25000}}' \
  "The Last of Us · Ps4 · nuevo"
J '{"producto":{"nombre":"The Last of Us Part I","tipo":"juego","sku":"TLOU-001"},"juego":{"consola":"Ps4","estado":"usado","stock":7,"precio_base":9000}}' \
  "The Last of Us · Ps4 · usado"

echo ""
echo "[C] Mismo trío repetido → upsert suma stock (3 + 5 = 8)"
J '{"producto":{"nombre":"Halo Infinite","tipo":"juego","sku":"HALO-001"},"juego":{"consola":"XboxSeries","estado":"nuevo","stock":3,"precio_base":18000}}' \
  "Halo Infinite · XboxSeries · nuevo (stock 3)"
J '{"producto":{"nombre":"Halo Infinite","tipo":"juego","sku":"HALO-001"},"juego":{"consola":"XboxSeries","estado":"nuevo","stock":5,"precio_base":18000}}' \
  "Halo Infinite · XboxSeries · nuevo (suma +5 → stock 8)"

echo ""
echo "[D] Descuento porcentual — 25000 -20% = 20000 tier 2"
J '{"producto":{"nombre":"FIFA 25","tipo":"juego","sku":"FIFA25-001"},"juego":{"consola":"Ps5","estado":"nuevo","stock":10,"precio_base":25000,"descuento_porcentaje":20}}' \
  "FIFA 25 · Ps5 · nuevo · 20% off"

echo ""
echo "[E] Descuento fijo — 12000 - 3000 = 9000 tier 1"
J '{"producto":{"nombre":"Minecraft","tipo":"juego","sku":"MC-001"},"juego":{"consola":"Switch","estado":"usado","stock":6,"precio_base":12000,"descuento_fijo":3000}}' \
  "Minecraft · Switch · usado · -3000 fijo"

echo ""
echo "[F] Un título en 3 plataformas"
J '{"producto":{"nombre":"Mortal Kombat 11","tipo":"juego","sku":"MK11-001"},"juego":{"consola":"XboxOne","estado":"usado","stock":2,"precio_base":8000}}' \
  "Mortal Kombat 11 · XboxOne · usado"
J '{"producto":{"nombre":"Mortal Kombat 11","tipo":"juego","sku":"MK11-001"},"juego":{"consola":"Ps4","estado":"usado","stock":3,"precio_base":8000}}' \
  "Mortal Kombat 11 · Ps4 · usado"
J '{"producto":{"nombre":"Mortal Kombat 11","tipo":"juego","sku":"MK11-001"},"juego":{"consola":"Switch","estado":"nuevo","stock":1,"precio_base":14000}}' \
  "Mortal Kombat 11 · Switch · nuevo"

echo ""
echo "[G] Bordes exactos de tier (10000 = tier 1, 35000 = tier 3)"
J '{"producto":{"nombre":"Sonic Frontiers","tipo":"juego","sku":"SONIC-001"},"juego":{"consola":"Switch2","estado":"nuevo","stock":5,"precio_base":10000}}' \
  "Sonic Frontiers · Switch2 · nuevo · \$10000 tier 1"
J '{"producto":{"nombre":"Returnal","tipo":"juego","sku":"RET-001"},"juego":{"consola":"Ps5","estado":"nuevo","stock":2,"precio_base":35000}}' \
  "Returnal · Ps5 · nuevo · \$35000 tier 3"

echo ""
echo "[H] Precio sobre el máximo — 50000 → tier 3 (fallback)"
J '{"producto":{"nombre":"Cyberpunk 2077","tipo":"juego","sku":"CP77-001"},"juego":{"consola":"Ps5","estado":"nuevo","stock":3,"precio_base":50000}}' \
  "Cyberpunk 2077 · Ps5 · nuevo · \$50000 tier 3"

echo ""
echo "[I] Soft-delete + recrear (la respuesta incluye advertencia isActive: false)"
JUEGO_RES=$(curl -s -X POST "$BASE/juego" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"producto":{"nombre":"Spider-Man","tipo":"juego","sku":"SPIDEY-001"},"juego":{"consola":"Ps4","estado":"nuevo","stock":2,"precio_base":20000}}')
JUEGO_ID=$(echo "$JUEGO_RES" | grep -o '"juego":{"id":[0-9]*' | grep -o '[0-9]*')
echo "  Spider-Man · Ps4 · nuevo (id=$JUEGO_ID)"
curl -s -X DELETE "$BASE/juego/$JUEGO_ID" \
  -H "Authorization: Bearer $TOKEN" -o /dev/null
echo "  soft-delete id=$JUEGO_ID"
curl -s -X POST "$BASE/juego" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"producto":{"nombre":"Spider-Man","tipo":"juego","sku":"SPIDEY-001"},"juego":{"consola":"Ps4","estado":"nuevo","stock":4,"precio_base":20000}}' \
  | grep -o '"advertencias":\[[^]]*\]' || echo "  (sin advertencias en respuesta)"
echo "  Spider-Man · Ps4 · nuevo recreado"

# ── CONSOLAS ──────────────────────────────────────────────────────────────────

echo ""
echo "[A] Mismo modelo, distinto estado"
C '{"producto":{"nombre":"PlayStation 4","tipo":"consola","sku":"PS4-001"},"consola":{"generacion":"Ps4","estado":"nuevo","stock":2,"precio_base":35000}}' \
  "PlayStation 4 · nueva"
C '{"producto":{"nombre":"PlayStation 4","tipo":"consola","sku":"PS4-001"},"consola":{"generacion":"Ps4","estado":"usado","stock":4,"precio_base":18000}}' \
  "PlayStation 4 · usada"

echo ""
echo "[B] Distintos modelos de consola"
C '{"producto":{"nombre":"PlayStation 5","tipo":"consola","sku":"PS5-001"},"consola":{"generacion":"Ps5","estado":"nuevo","stock":3,"precio_base":120000}}' \
  "PlayStation 5 · nueva"
C '{"producto":{"nombre":"Xbox Series X","tipo":"consola","sku":"XBSX-001"},"consola":{"generacion":"XboxSeries","estado":"nuevo","stock":2,"precio_base":100000}}' \
  "Xbox Series X · nueva"

echo ""
echo "[C] Mismo modelo + estado repetido → upsert suma stock (2 + 3 = 5)"
C '{"producto":{"nombre":"Nintendo Switch","tipo":"consola","sku":"NSW-001"},"consola":{"generacion":"Switch","estado":"usado","stock":2,"precio_base":40000}}' \
  "Nintendo Switch · usada (stock 2)"
C '{"producto":{"nombre":"Nintendo Switch","tipo":"consola","sku":"NSW-001"},"consola":{"generacion":"Switch","estado":"usado","stock":3,"precio_base":40000}}' \
  "Nintendo Switch · usada (suma +3 → stock 5)"

echo ""
echo "[D] Descuento porcentual — 25000 -15% = 21250"
C '{"producto":{"nombre":"Xbox One","tipo":"consola","sku":"XBONE-001"},"consola":{"generacion":"XboxOne","estado":"usado","stock":3,"precio_base":25000,"descuento_porcentaje":15}}' \
  "Xbox One · usada · 15% off"

echo ""
echo "[E] Descuento fijo — 80000 - 5000 = 75000"
C '{"producto":{"nombre":"Nintendo Switch 2","tipo":"consola","sku":"NSW2-001"},"consola":{"generacion":"Switch2","estado":"nuevo","stock":1,"precio_base":80000,"descuento_fijo":5000}}' \
  "Nintendo Switch 2 · nueva · -5000 fijo"

echo ""
echo "[F] Soft-delete + recrear (la respuesta del segundo POST incluye advertencia)"
CONSOLA_RES=$(curl -s -X POST "$BASE/consola" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"producto":{"nombre":"PlayStation 3","tipo":"consola","sku":"PS3-001"},"consola":{"generacion":"Ps3","estado":"usado","stock":1,"precio_base":8000}}')
CONSOLA_ID=$(echo "$CONSOLA_RES" | grep -o '"consola":{"id":[0-9]*' | grep -o '[0-9]*')
echo "  PlayStation 3 · usada (id=$CONSOLA_ID)"
curl -s -X DELETE "$BASE/consola/$CONSOLA_ID" \
  -H "Authorization: Bearer $TOKEN" -o /dev/null
echo "  soft-delete id=$CONSOLA_ID"
curl -s -X POST "$BASE/consola" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"producto":{"nombre":"PlayStation 3","tipo":"consola","sku":"PS3-001"},"consola":{"generacion":"Ps3","estado":"usado","stock":2,"precio_base":8000}}' \
  | grep -o '"advertencias":\[[^]]*\]' || echo "  (sin advertencias en respuesta)"
echo "  PlayStation 3 · usada recreada"

echo ""
echo "Seed completado."
echo "  GET $BASE/juego   — todos los juegos"
echo "  GET $BASE/consola — todas las consolas"
