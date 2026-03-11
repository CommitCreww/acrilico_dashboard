from flask import Flask
from routes.clientes_routes import clientes_bp
from routes.auth_routes import auth_bp
from routes.material_routes import materiais_bp

app = Flask(__name__)

app.register_blueprint(clientes_bp)
app.register_blueprint(auth_bp)
app.register_blueprint(materiais_bp)

@app.route("/")
def home():
    return "API Dashboard Acrilico"

if __name__ == "__main__":
    app.run(debug=True)