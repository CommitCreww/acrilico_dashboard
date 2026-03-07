import psycopg2

#CRIA CONEXÃO COM BANCO
def get_connection():
    db_name = "acrilico"
    conn = psycopg2.connect(
        host="localhost",
        database=db_name,
        user="admin",
        password="admin",
        port="5432"
    )
    return conn