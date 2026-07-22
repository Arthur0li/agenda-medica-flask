import logging
from flask import (
    Blueprint, current_app, flash, jsonify, redirect, render_template, request, session, url_for
)
from .auth import authenticate_user
from .services import AppointmentServiceError, fetch_appointments

bp = Blueprint("main", __name__)
logger = logging.getLogger(__name__)

def login_required(view):
    from functools import wraps

    @wraps(view)
    def wrapped(*args, **kwargs):
        if "user_id" not in session:
            return redirect(url_for("main.login"))
        return view(*args, **kwargs)

    return wrapped

@bp.route("/")
def index():
    if "user_id" in session:
        return redirect(url_for("main.agenda"))
    return redirect(url_for("main.login"))

@bp.route("/login", methods=["GET", "POST"])
def login():
    error = None

    if request.method == "POST":
        identifier = request.form.get("identifier", "").strip()
        password = request.form.get("password", "").strip()

        if not identifier or not password:
            error = "Preencha todos os campos."
        else:
            try:
                user = authenticate_user(identifier, password)
            except Exception:
                logger.exception("Erro ao autenticar usuário.")
                error = "Não foi possível acessar o banco de dados."
                user = None

            if user:
                session.clear()
                session["user_id"] = user["id"]
                session["user_name"] = user["username"]
                return redirect(url_for("main.agenda"))
            if error is None:
                error = "Usuário ou senha inválidos."

        flash(error, "error")

    return render_template("login.html")

@bp.route("/logout")
def logout():
    session.clear()
    return redirect(url_for("main.login"))

@bp.route("/agenda")
@login_required
def agenda():
    return render_template(
        "agenda.html",
        user_name=session.get("user_name", "Usuário"),
        api_url=url_for("main.appointments_api"),
    )

@bp.route("/api/appointments")
@login_required
def appointments_api():
    try:
        appointments = fetch_appointments(current_app.config["APPOINTMENTS_API_URL"])
        return jsonify({"appointments": appointments})
    except AppointmentServiceError as exc:
        logger.warning("Falha ao buscar agendamentos: %s", exc)
        return jsonify({"error": str(exc)}), 502
    except Exception:
        logger.exception("Erro inesperado ao buscar agendamentos.")
        return jsonify({"error": "Não foi possível carregar os agendamentos."}), 500
