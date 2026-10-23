from pydantic import BaseModel
from datetime import date


class FiscalPeriodCreate(BaseModel):
    fiscal_year: str
    period_name: str
    period_number: int
    start_date: date
    end_date: date
    status: str