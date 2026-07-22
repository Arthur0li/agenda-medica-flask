import os
from flask import Flask, app

from app.logger import setup_logging
from .db import init_db, seed_default_user, close_db


def create_app(test_config=None):
    app = Flask(__name__, instance_relative_config=True)

    app.config.from_mapping(
        SECRET_KEY=os.getenv("FLASK_SECRET_KEY", "dev-secret-key"),
        DATABASE=os.getenv("DATABASE_PATH", os.path.join(app.instance_path, "timesaver.db")),
        APPOINTMENTS_API_URL=os.getenv("APPOINTMENTS_API_URL", "http://127.0.0.1:5001/appointments"),
        API_PORT=int(os.getenv("API_PORT", "5001")),
    )

    if test_config:
        app.config.update(test_config)

    os.makedirs(app.instance_path, exist_ok=True)

    setup_logging(app)
    
    from .routes import bp
    app.register_blueprint(bp)
    app.teardown_appcontext(close_db)

    with app.app_context():
        init_db()
        seed_default_user()
    
    return app
