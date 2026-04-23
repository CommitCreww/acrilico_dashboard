from flask import Flask
from flask_cors import CORS
from config import CORS_ORIGINS, DEBUG, HOST, PORT, SECRET_KEY
from routes.clientes_routes import clientes_bp
from routes.auth_routes import auth_bp
from routes.material_routes import materiais_bp
from routes.pedidos_routes import pedidos_bp
from routes.dashboard_routes import dashboard_bp
from routes.colaboradores_routes import colaboradores_bp


app = Flask(__name__)
app.config["SECRET_KEY"] = SECRET_KEY
CORS(
    app,
    resources={r"/*": {"origins": CORS_ORIGINS}},
    supports_credentials=False,
)

app.register_blueprint(clientes_bp)
app.register_blueprint(auth_bp)
app.register_blueprint(materiais_bp)
app.register_blueprint(pedidos_bp)
app.register_blueprint(dashboard_bp)
app.register_blueprint(colaboradores_bp)

@app.route("/")
def home():
    return "API Dashboard Acrilico"

if __name__ == "__main__":
    app.run(host=HOST, port=PORT, debug=DEBUG)
