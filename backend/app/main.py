from pathlib import Path

from fastapi import Depends, FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqlalchemy import select
from sqlalchemy.orm import Session, joinedload

from .database import get_db
from .models import Company, Machine, Species
from .schemas import MachineOut, MetaOut, SpeciesOut
import os

app = FastAPI(title="Agroforestry API", version="0.3.0",
              description="Agroforestry planning & machine selection — proof of concept")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
allow_origins=os.environ.get(
    "CORS_ORIGINS", "http://localhost:5173,http://127.0.0.1:5173"
).split(","),

# Machine photos extracted from the research documents
app.mount("/static", StaticFiles(directory=Path(__file__).parent / "static"), name="static")

SYSTEM_TYPES = [
    {"id": "silvoarable", "label": "Silvoarable",
     "blurb": "Trees combined with crops."},
    {"id": "silvopastoral", "label": "Silvopastoral",
     "blurb": "Trees combined with livestock."},
]

OPERATIONS = [
    {"id": "planting", "label": "Planting", "blurb": "Establish trees or transplant crops."},
    {"id": "pruning", "label": "Pruning", "blurb": "Formative cuts, hedging and crown lifting."},
    {"id": "harvesting", "label": "Harvesting", "blurb": "Pick, shake, sweep or lift the produce."},
]

# Company types follow the research documents: manufacturers are segmented by
# how much machine information they publish on their own website.
COMPANY_TYPES = [
    {"id": "1", "label": "Type 1 — Full information",
     "blurb": "The manufacturer publishes complete machine information online: specifications and prices."},
    {"id": "2", "label": "Type 2 — Price on request",
     "blurb": "Specifications are published, but the price is missing: contact the manufacturer or a dealer."},
    {"id": "3", "label": "Type 3 — Tailor-made solutions",
     "blurb": "The manufacturer builds customized machines: specifications and price follow from a consultation."},
]

# Placeholder crop machines (not from the research documents) — hidden everywhere.
PLACEHOLDER_COMPANIES = {
    "Checchi & Magli", "Ferrari Costruzioni Meccaniche", "Sfoggia",
    "Grimme", "Guaresi", "ASA-LIFT", "Moty",
}


@app.get("/api/meta", response_model=MetaOut)
def get_meta(db: Session = Depends(get_db)) -> MetaOut:
    species = db.scalars(select(Species).order_by(Species.id)).all()

    # Machines store the species they suit as a JSON list of names, so count
    # by name rather than via a foreign key. Placeholder machines are excluded.
    counts: dict[str, int] = {}
    rows = db.execute(
        select(Machine.species)
        .where(Machine.company.has(Company.name.notin_(PLACEHOLDER_COMPANIES)))
    ).all()
    for (names,) in rows:
        for name in names or []:
            counts[name.lower()] = counts.get(name.lower(), 0) + 1

    grouped: dict[str, list[SpeciesOut]] = {"tree": [], "crop": [], "livestock": []}
    for s in species:
        out = SpeciesOut.model_validate(s)
        out.machine_count = counts.get(s.name.lower(), 0)
        grouped[s.category].append(out)
    return MetaOut(system_types=SYSTEM_TYPES, operations=OPERATIONS,
                   company_types=COMPANY_TYPES, species=grouped)


@app.get("/api/machines", response_model=list[MachineOut])
def list_machines(
    operation: str = Query(..., pattern="^(planting|pruning|harvesting)$"),
    system_type: str = Query(..., pattern="^(silvoarable|silvopastoral)$"),
    company_type: int | None = Query(None, ge=1, le=3),
    species: list[str] | None = Query(
        None,
        description="Species names. When given, only machines suitable for at "
                    "least one of these species are returned (best matches first).",
    ),
    db: Session = Depends(get_db),
) -> list[MachineOut]:
    stmt = (
        select(Machine)
        .options(joinedload(Machine.company))
        .where(Machine.operation == operation)
        .where(Machine.company.has(Company.name.notin_(PLACEHOLDER_COMPANIES)))
        .order_by(Machine.company_type, Machine.name)
    )
    if company_type is not None:
        stmt = stmt.where(Machine.company_type == company_type)
    rows = db.scalars(stmt).all()

    result = [m for m in rows if system_type in (m.system_types or [])]

    if species:
        wanted = {s.lower() for s in species}
        # Hard filter: a machine must suit at least one selected species.
        result = [m for m in result if wanted & {x.lower() for x in (m.species or [])}]
        result.sort(key=lambda m: (-len(wanted & {x.lower() for x in (m.species or [])}),
                                   m.company_type, m.name))

    return [MachineOut.model_validate(m) for m in result]


@app.get("/api/machines/{machine_id}", response_model=MachineOut)
def get_machine(machine_id: int, db: Session = Depends(get_db)) -> MachineOut:
    m = db.get(Machine, machine_id, options=[joinedload(Machine.company)])
    if m is None:
        raise HTTPException(status_code=404, detail="Machine not found")
    return MachineOut.model_validate(m)