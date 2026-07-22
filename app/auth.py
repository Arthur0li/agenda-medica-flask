from werkzeug.security import check_password_hash
from .db import get_user_by_identifier, log_login_attempt

def authenticate_user(identifier, password):
    user = get_user_by_identifier(identifier)
    if not user:
        log_login_attempt(identifier, False)
        return None

    if not check_password_hash(user["password_hash"], password):
        log_login_attempt(identifier, False)
        return None

    log_login_attempt(identifier, True)
    return user
