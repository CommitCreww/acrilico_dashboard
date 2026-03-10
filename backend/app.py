from flask import Flask
from routes.clientes_routes import clientes_bp

app = Flask(__name__)

app.register_blueprint(clientes_bp)

@app.route("/")
def home():
    return "API Dashboard Acrilico"

if __name__ == "__main__":
    app.run(debug=True)