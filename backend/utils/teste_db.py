import sys
import os

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from database.connection import SessionLocal
from database.models import Cliente

# abre sessão com banco
db = SessionLocal()

try:
    # consulta todos os clientes
    clientes = db.query(Cliente).all()

    # percorre os resultados
    for cliente in clientes:
        print(cliente.id, cliente.nome, cliente.email)

finally:
    # fecha conexão
    db.close()
