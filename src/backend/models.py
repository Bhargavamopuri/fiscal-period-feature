from sqlalchemy import Column, Integer, String, Date
from .database import Base


class FiscalPeriod(Base):
    __tablename__ = "fiscal_period"

    id = Column(Integer, primary_key=True, index=True)
    fiscal_year = Column(String(20), nullable=False)
    period_name = Column(String(50), nullable=False)
    period_number = Column(Integer, nullable=False)
    start_date = Column(Date, nullable=False)
    end_date = Column(Date, nullable=False)
    status = Column(String(20), nullable=False)