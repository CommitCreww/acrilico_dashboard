import psycopg2

try:
    conn = psycopg2.connect(
        host="localhost",
        port=5432,
        user="admin",
        password="admin",
        dbname="acrilico_db"
    )
    print("Conectou com sucesso")
    conn.close()
except Exception as e:
    print(type(e).__name__, e)