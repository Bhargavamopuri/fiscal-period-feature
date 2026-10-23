import os
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

# Configurable database URL: MySQL by default, or SQLite fallback
MYSQL_URL = os.getenv(
    "DATABASE_URL",
    "mysql+pymysql://root:NewPassword123!@localhost:3306/fiscal_period_db"
)

try:
    # Try connecting to MySQL first
    test_engine = create_engine(MYSQL_URL, pool_pre_ping=True)
    with test_engine.connect() as conn:
        pass
    engine = test_engine
    print("Connected to MySQL database successfully.")
except Exception as e:
    # Fallback gracefully to SQLite so backend works anywhere without manual database setup
    print(f"MySQL unavailable ({e}). Initializing local SQLite database 'fiscal_period.db'...")
    engine = create_engine(
        "sqlite:///./fiscal_period.db",
        connect_args={"check_same_thread": False}
    )

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

Base = declarative_base()