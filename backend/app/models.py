from sqlalchemy import String, Integer, Text, ForeignKey, JSON
from sqlalchemy.orm import Mapped, mapped_column, relationship

from .database import Base


class Species(Base):
    __tablename__ = "species"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    name: Mapped[str] = mapped_column(String(60), unique=True, nullable=False)
    category: Mapped[str] = mapped_column(String(20), nullable=False)  # tree | crop | livestock


class Company(Base):
    __tablename__ = "company"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    name: Mapped[str] = mapped_column(String(120), unique=True, nullable=False)
    country: Mapped[str] = mapped_column(String(60), nullable=False)
    website: Mapped[str] = mapped_column(Text, nullable=True)

    machines: Mapped[list["Machine"]] = relationship(back_populates="company")


class Machine(Base):
    __tablename__ = "machine"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    name: Mapped[str] = mapped_column(String(160), nullable=False)
    company_id: Mapped[int] = mapped_column(ForeignKey("company.id"), nullable=False)
    operation: Mapped[str] = mapped_column(String(20), nullable=False)  # planting | pruning | harvesting
    method: Mapped[str] = mapped_column(String(30), nullable=False)  # manual | mechanical | platform-assisted
    # Company type per the research documents (data transparency):
    # 1 = published specs + prices, 2 = price on request, 3 = custom built / consultation
    company_type: Mapped[int] = mapped_column(Integer, nullable=False)
    system_types: Mapped[list] = mapped_column(JSON, nullable=False)  # ["silvoarable", "silvopastoral"]
    categories: Mapped[list] = mapped_column(JSON, nullable=False)  # ["tree"] / ["crop"]
    species: Mapped[list] = mapped_column(JSON, nullable=False, default=list)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    specs: Mapped[dict] = mapped_column(JSON, nullable=False, default=dict)
    price_indication: Mapped[str] = mapped_column(String(120), nullable=True)
    product_url: Mapped[str] = mapped_column(Text, nullable=True)
    image_url: Mapped[str] = mapped_column(Text, nullable=True)
    image_url: Mapped[str] = mapped_column(Text, nullable=True)

    company: Mapped[Company] = relationship(back_populates="machines")
