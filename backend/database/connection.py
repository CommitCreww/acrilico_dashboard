import psycopg2

#CRIA CONEXÃO COM BANCO
def get_connection():
    conn = psycopg2.connect(
        host="localhost",
        database="acrilico",
        user="admin"
        password="admin"
        port="5432"
    )
    return conn