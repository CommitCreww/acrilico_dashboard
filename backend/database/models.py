from sqlalchemy import Column, Integer, String, ForeignKey, Text, Date, Numeric
from sqlalchemy.orm import relationship
from database.connection import Base


class Role(Base):
    __tablename__ = "roles"

    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String(50), nullable=False)
    nivel_acesso = Column(Integer, nullable=False)

    colaboradores = relationship("Colaborador", back_populates="role")


class Colaborador(Base):
    __tablename__ = "colaboradores"

    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String(100), nullable=False)
    email = Column(String(100), unique=True, nullable=False)
    senha = Column(String(200), nullable=False)
    telefone = Column(String(20), nullable=False)

    role_id = Column(Integer, ForeignKey("roles.id"))

    role = relationship("Role", back_populates="colaboradores")
    pedidos = relationship("Pedido", back_populates="colaborador")


class Cliente(Base):
    __tablename__ = "clientes"

    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String(100), nullable=False)
    email = Column(String(100))
    telefone = Column(String(20))
    cpf_cnpj = Column(String(30), nullable=False)
    endereco = Column(String(100))

    pedidos = relationship("Pedido", back_populates="cliente")


class Material(Base):
    __tablename__ = "materiais"

    id = Column(Integer, primary_key=True, index=True)
    tipo = Column(String(50))
    cor = Column(String(50))
    espessura = Column(String(20))
    preco_m2 = Column(Numeric(10, 2))

    pedidos = relationship("Pedido", back_populates="material")


class Pedido(Base):
    __tablename__ = "pedidos"

    id = Column(Integer, primary_key=True, index=True)

    colaborador_id = Column(Integer, ForeignKey("colaboradores.id"))
    cliente_id = Column(Integer, ForeignKey("clientes.id"))
    material_id = Column(Integer, ForeignKey("materiais.id"))

    descricao = Column(Text)
    quantidade = Column(Integer)
    valor = Column(Numeric(10, 2))

    data_entrada = Column(Date)
    data_entrega = Column(Date)

    status_pedido = Column(String(20))

    colaborador = relationship("Colaborador", back_populates="pedidos")
    cliente = relationship("Cliente", back_populates="pedidos")
    material = relationship("Material", back_populates="pedidos")

    pagamentos = relationship("Pagamento", back_populates="pedido")


class Pagamento(Base):
    __tablename__ = "pagamentos"

    id = Column(Integer, primary_key=True, index=True)

    pedido_id = Column(Integer, ForeignKey("pedidos.id"))

    forma_pagamento = Column(String(20))
    status_pagamento = Column(String(20))
    valor_pago = Column(Numeric(10, 2))
    data_pagamento = Column(Date)

    pedido = relationship("Pedido", back_populates="pagamentos")