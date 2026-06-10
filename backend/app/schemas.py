from pydantic import BaseModel, ConfigDict


class SpeciesOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    name: str
    category: str
    machine_count: int = 0


class CompanyOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    name: str
    country: str
    website: str | None


class MachineOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    name: str
    operation: str
    method: str
    company_type: int
    system_types: list[str]
    categories: list[str]
    species: list[str]
    description: str
    specs: dict
    price_indication: str | None
    product_url: str | None
    image_url: str | None
    company: CompanyOut


class MetaOut(BaseModel):
    system_types: list[dict]
    operations: list[dict]
    company_types: list[dict]
    species: dict[str, list[SpeciesOut]]
