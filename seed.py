from app import create_app
from app.db import init_db, seed_default_user

app = create_app()

if __name__ == "__main__":
    with app.app_context():
        init_db()
        seed_default_user()
        print("Banco inicializado e usuário de teste criado (admin/admin).")
