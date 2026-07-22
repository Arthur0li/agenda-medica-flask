import json
import os
from flask import Flask, jsonify

def create_api():
    app = Flask(__name__)
    data_path = os.getenv("APPOINTMENTS_FILE", os.path.join(os.path.dirname(__file__), "appointments.json"))

    @app.get("/appointments")
    def appointments():
        with open(data_path, "r", encoding="utf-8") as f:
            data = json.load(f)
        return jsonify(data)

    @app.get("/health")
    def health():
        return jsonify({"status": "ok"})

    return app

app = create_api()

if __name__ == "__main__":
    port = int(os.getenv("API_PORT", "5001"))
    app.run(host="0.0.0.0", port=port, debug=True)
