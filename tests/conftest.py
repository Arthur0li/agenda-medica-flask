import os
import sys
import tempfile
from pathlib import Path

import pytest

ROOT = Path(__file__).resolve().parents[1]
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

from app import create_app
from app.db import init_db, seed_default_user

@pytest.fixture()
def app():
    db_fd, db_path = tempfile.mkstemp()
    try:
        app = create_app({
            "TESTING": True,
            "DATABASE": db_path,
            "SECRET_KEY": "test-secret",
            "APPOINTMENTS_API_URL": "http://example.test/appointments",
        })
        with app.app_context():
            init_db()
            seed_default_user()
        yield app
    finally:
        os.close(db_fd)
        os.unlink(db_path)

@pytest.fixture()
def client(app):
    return app.test_client()
