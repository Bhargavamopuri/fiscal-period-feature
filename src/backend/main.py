from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

try:
    from .database import SessionLocal, engine, Base
    from .models import FiscalPeriod
    from .schemas import FiscalPeriodCreate
except ImportError:
    from database import SessionLocal, engine, Base
    from models import FiscalPeriod
    from schemas import FiscalPeriodCreate

# Automatically create tables if not present
Base.metadata.create_all(bind=engine)

app = FastAPI(title="FICO - Fiscal Period Backend API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:5175",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:5174",
        "http://127.0.0.1:5175",
        "*"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@app.get("/")
def home():
    return {
        "module": "FICO - Financial Accounting",
        "feature": "Fiscal Period API",
        "status": "online"
    }


@app.get("/fiscal-periods")
def get_fiscal_periods(db: Session = Depends(get_db)):
    periods = db.query(FiscalPeriod).order_by(
        FiscalPeriod.fiscal_year.asc(),
        FiscalPeriod.period_number.asc()
    ).all()
    return periods


@app.post("/fiscal-period")
def create_fiscal_period(
    period: FiscalPeriodCreate,
    db: Session = Depends(get_db)
):
    new_period = FiscalPeriod(
        fiscal_year=str(period.fiscal_year),
        period_name=str(period.period_name),
        period_number=int(period.period_number),
        start_date=period.start_date,
        end_date=period.end_date,
        status=str(period.status)
    )

    db.add(new_period)
    db.commit()
    db.refresh(new_period)

    return {
        "message": "Fiscal Period created successfully",
        "id": new_period.id,
        "period": {
            "id": new_period.id,
            "fiscal_year": new_period.fiscal_year,
            "period_name": new_period.period_name,
            "period_number": new_period.period_number,
            "start_date": str(new_period.start_date),
            "end_date": str(new_period.end_date),
            "status": new_period.status
        }
    }


@app.post("/fiscal-periods/bulk")
def create_bulk_fiscal_periods(
    periods: list[FiscalPeriodCreate],
    db: Session = Depends(get_db)
):
    created_ids = []
    for p in periods:
        new_p = FiscalPeriod(
            fiscal_year=str(p.fiscal_year),
            period_name=str(p.period_name),
            period_number=int(p.period_number),
            start_date=p.start_date,
            end_date=p.end_date,
            status=str(p.status)
        )
        db.add(new_p)
        db.flush()
        created_ids.append(new_p.id)

    db.commit()
    return {
        "message": f"Successfully created {len(created_ids)} periods in MySQL",
        "count": len(created_ids),
        "ids": created_ids
    }


@app.put("/fiscal-period/{period_id}")
def update_fiscal_period(
    period_id: int,
    period: FiscalPeriodCreate,
    db: Session = Depends(get_db)
):
    existing_period = db.query(FiscalPeriod).filter(
        FiscalPeriod.id == period_id
    ).first()

    if existing_period is None:
        raise HTTPException(status_code=404, detail="Fiscal Period not found")

    existing_period.fiscal_year = period.fiscal_year
    existing_period.period_name = period.period_name
    existing_period.period_number = period.period_number
    existing_period.start_date = period.start_date
    existing_period.end_date = period.end_date
    existing_period.status = period.status

    db.commit()
    db.refresh(existing_period)

    return {
        "message": "Fiscal Period updated successfully",
        "id": existing_period.id
    }


@app.delete("/fiscal-period/{period_id}")
def delete_fiscal_period(
    period_id: int,
    db: Session = Depends(get_db)
):
    existing_period = db.query(FiscalPeriod).filter(
        FiscalPeriod.id == period_id
    ).first()

    if existing_period is None:
        raise HTTPException(status_code=404, detail="Fiscal Period not found")

    db.delete(existing_period)
    db.commit()

    return {
        "message": "Fiscal Period deleted successfully",
        "id": period_id
    }