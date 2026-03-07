import connection
from connection import get_connection

try:
    conn = get_connection()
    print("Funci0onou")
except Exception as e:   #capturar possivel erra e printar
    print("Não Funcionou", e)


conn = get_connection()  #Chama a função do connection 
cursor = conn.cursor() #cursor ajuda a executar query no banco

cursor.execute("SELECT * FROM clientes") 
dados = cursor.fetchall()  #resultado da query e guarda na var dados

print(dados)

conn.close()