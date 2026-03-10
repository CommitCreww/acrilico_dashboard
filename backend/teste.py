from backend.database.connection import SessionLocal
from sqlalchemy import text

db = SessionLocal()

try:
    result = db.execute(text("SELECT * FROM materiais "))
    clientes = result.fetchall()
    for cliente in clientes:
        print(cliente)
finally:
    db.close()