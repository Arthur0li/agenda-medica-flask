import sqlite3
from flask import current_app, g
from werkzeug.security import generate_password_hash

def get_db():
    if "db" not in g:
        g.db = sqlite3.connect(current_app.config["DATABASE"])
        g.db.row_factory = sqlite3.Row
    return g.db

def close_db(e=None):
    db = g.pop("db", None)
    if db is not None:
        db.close()

def init_db():
    db = get_db()
    db.executescript(
        """
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL UNIQUE,
            email TEXT NOT NULL UNIQUE,
            password_hash TEXT NOT NULL,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS login_logs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_identifier TEXT NOT NULL,
            success INTEGER NOT NULL,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP
        );
        """
    )
    db.commit()


def seed_default_user():
    db = get_db()
    existing = db.execute("SELECT id FROM users WHERE username = ?", ("admin",)).fetchone()
    if existing:
        return
    db.execute(
        """
        INSERT INTO users (username, email, password_hash)
        VALUES (?, ?, ?)
        """,
        ("admin", "admin@timesaver.com.br", generate_password_hash("admin")),
    )
    db.commit()

def get_user_by_identifier(identifier):
    db = get_db()
    return db.execute(
        """
        SELECT * FROM users
        WHERE lower(username) = lower(?) OR lower(email) = lower(?)
        """,
        (identifier, identifier),
    ).fetchone()

def log_login_attempt(user_identifier, success):
    db = get_db()
    db.execute(
        "INSERT INTO login_logs (user_identifier, success) VALUES (?, ?)",
        (user_identifier, 1 if success else 0),
    )
    db.commit()
