"""Create tables and load the dataset.  Run:  python -m app.seed"""
from .database import Base, SessionLocal, engine
from .models import Company, Machine, Species
from .seed_data import COMPANY_SITES, MACHINES, SPECIES


def run() -> None:
    Base.metadata.drop_all(engine)
    Base.metadata.create_all(engine)

    db = SessionLocal()
    try:
        for name, category in SPECIES:
            db.add(Species(name=name, category=category))

        companies: dict[str, Company] = {}
        for m in MACHINES:
            key = m["company"]
            if key not in companies:
                c = Company(name=key, country=m.get("country") or "—",
                            website=COMPANY_SITES.get(key))
                companies[key] = c
                db.add(c)
        db.flush()

        for m in MACHINES:
            db.add(
                Machine(
                    name=m["name"],
                    company_id=companies[m["company"]].id,
                    operation=m["operation"],
                    method=m["method"],
                    company_type=m["company_type"],
                    system_types=m["system_types"],
                    categories=m["categories"],
                    species=m["species"],
                    description=m["description"],
                    specs=m["specs"],
                    price_indication=m.get("price_indication"),
                    product_url=m.get("product_url"),
                    image_url=m.get("image_url"),
                )
            )
        db.commit()
        print(f"Seeded {len(SPECIES)} species, {len(companies)} companies, {len(MACHINES)} machines.")
    finally:
        db.close()


if __name__ == "__main__":
    run()
