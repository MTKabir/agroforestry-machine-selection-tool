# Agroforestry — Planning & machine selection

Full-stack rebuild of the `prototype-two.lovable.app` prototype:
a guided 5-step planner that pairs a silvoarable or silvopastoral system
with curated planting, pruning and harvesting machinery.

**Stack:** React 18 + TypeScript + Vite + React Router (frontend) ·
FastAPI + SQLAlchemy 2 + PostgreSQL (backend).

## The 5 steps

1. **Type** — silvoarable or silvopastoral
2. **Species** — "Select your species combination": tree species dropdown + companion crop (silvoarable) or livestock (silvopastoral) dropdown. Species without machines are annotated; selecting them gives an honest empty result (e.g. poplar).
3. **Operation** — planting, pruning or harvesting
4. **Machines** — image-first cards (photo, operation + company type chips, name, company, short description, price, View details). Details open a modal with full specs, suitability, company website and product link. Only machines suitable for the selected species are shown (strict filter).
5. **Company** — manufacturers behind the listed machines, grouped by information transparency: Type 1 (full information incl. price), Type 2 (price on request), Type 3 (tailor-made), with verified websites.

## Quick start

### 1. Database (PostgreSQL via Docker)

```bash
docker compose up -d
```

No Docker? Any local PostgreSQL works — create a `agroforestry` database and
adjust `DATABASE_URL`. For a zero-setup test you can even use SQLite:
`DATABASE_URL=sqlite:///./agroforestry.db`.

### 2. Backend (port 8000)

```bash
cd backend
python -m venv .venv && source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env          # adjust DATABASE_URL if needed
python -m app.seed            # creates tables + loads 12 species, 68 companies, 77 machines + photos
uvicorn app.main:app --reload
```

API docs: http://localhost:8000/docs

### 3. Frontend (port 5173)

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:5173. The frontend expects the API on
`http://localhost:8000` (override with a `VITE_API_URL` env variable).

## API

| Endpoint | Description |
| --- | --- |
| `GET /api/meta` | System types, operations, company types, species grouped by category |
| `GET /api/machines?operation=&system_type=&company_type=&species=` | Filtered machine list; `species` (repeatable) is a strict suitability filter; `company_type` (1/2/3) optional |
| `GET /static/machines/{file}.jpg` | Machine photos extracted from the research documents |
| `GET /api/machines/{id}` | Single machine with company |

## Data model

`species` (name, category: tree/crop/livestock) ·
`company` (name, country) ·
`machine` (operation, method: manual/mechanical/platform-assisted,
**company_type 1/2/3**, system_types, categories, species, specs JSON,
price_indication, product_url, FK company).

`company_type` follows the research documents and sits on the machine
(the same manufacturer can appear under different types per operation):
**1** = published specs and prices · **2** = specs public, price on request ·
**3** = custom built, configuration and price via consultation.
`method` mirrors the Manual / Mechanical / Platform-assisted categorisation.

## About the seed data

Tree machinery (apple, pear, walnut, sweet chestnut — 70 machines) is
extracted from the research documents `AppleAndPearsOperationMachinaries.docx`
and `Chestnut_Walnut.docx`, including prices, specs, Company Types and
product links as written there. Two pruning entries carry the documents' own
"verify suitability for apple trees" note. Poplar has no machines in the
documents yet, and the 7 **crop** machines are clearly marked PLACEHOLDER in
`seed_data.py` — replace or verify them before thesis use.

## Integrating into the thesis app

The backend is structured to drop into the existing FastAPI + PostgreSQL
project as the machinery suggestion module: copy `models.py`, `seed_data.py`
and the two routers from `main.py`, and point them at your existing
`database.py`/`Base`. The JSON columns map directly onto PostgreSQL `JSONB`.

## Verified data corrections (vs. the raw documents)

During extraction these were checked and corrected: FELIX/Z is manufactured by
**Weremczuk Agromachines** (PL); the TYROLEAN platform is the **Billo S.r.l.
"Tirolese"** (IT, not AT); the N.Blosi ZIP 25 is made by **N. Blosi** (Penda kft
is the Hungarian dealer in the doc link); **CWTS is Polish**; **Ben Wye is
Australian**; **Frumaco is German**; "Lotti Caba" is **Lotti, distributed by
Caba Industrie**. Company websites were verified via product pages and web
search; 7 marketplace-only sellers (e.g. Kotumy, Nilson) legitimately have no
official site and show their product link instead.

## What's new in v4

- **Machine photos** — all 70 document machines now have a photo, extracted
  from the two research .docx files and mapped to each machine via document
  order, then visually verified. Served from `backend/app/static/machines/`.
  The 7 placeholder crop machines show a neutral "no photo" graphic.
- **Manufacturer websites** — `Company.website` added. Sources: the documents'
  own Buy-now links where they sit on the manufacturer's domain, web-verified
  domains (Chianchia, Kadıoğlu/kadmec, M-Planter, HUEMER/obstsammler,
  Orizzonti, Organic Tools, GF Costruzioni, Jansen), and well-known
  manufacturer domains. Marketplace-only sellers (AliExpress / eBay /
  Made-in-China) link to their official storefront or have no site.
- **Species is now a hard filter** — `/api/machines?species=` only returns
  machines suitable for at least one selected species. Poplar therefore
  returns nothing (no poplar machinery in the documents) and the UI says so
  explicitly instead of showing unrelated machines.
- **Company types reworded** — Type 1 — Full information · Type 2 — Price on
  request · Type 3 — Tailor-made solutions (manufacturer data transparency,
  as defined in the research documents).
- **Machine card redesign** — photo → operation + type badges → name →
  company → two-line summary → price + "View details" modal (full specs,
  species, product page and company website links).
- Verified data corrections: Organic Tools GmbH is Austrian (not German);
  Ben Wye Engineering is Australian; the "Agrimaglie / Harvest-Agras" Jolly
  1500 is actually manufactured by GF Costruzioni Macchine Agricole
  (gf-srl.it) — the doc named the dealer brand.

