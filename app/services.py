import logging
import requests
from requests import RequestException

logger = logging.getLogger(__name__)

REQUIRED_FIELDS = {"patient", "cpf", "doctor", "specialty", "date", "time", "plan", "status"}


class AppointmentServiceError(RuntimeError):
    pass

def fetch_appointments(api_url, timeout=8):
    try:
        response = requests.get(api_url, timeout=timeout)
        response.raise_for_status()
    except RequestException as exc:
        logger.exception("Erro ao consultar a API de agendamentos.")
        raise AppointmentServiceError("API temporariamente indisponível.") from exc

    try:
        payload = response.json()
    except ValueError as exc:
        logger.exception("A API retornou um JSON inválido.")
        raise AppointmentServiceError("Resposta inválida da API.") from exc

    if not isinstance(payload, list):
        logger.error(
            "Resposta da API deveria ser uma lista, mas recebeu %s",
            type(payload).__name__,
        )
        raise AppointmentServiceError("Resposta inválida da API.")

    validated = []
    for idx, item in enumerate(payload, start=1):
        if not isinstance(item, dict):
            raise AppointmentServiceError("Resposta inválida da API.")
        missing = REQUIRED_FIELDS - set(item.keys())
        if missing:
            logger.error(
                "Campos obrigatórios ausentes: %s | Registro: %s",
                ", ".join(sorted(missing)),
                item,
            )

            raise AppointmentServiceError(
                "Campos obrigatórios ausentes na resposta recebida."
            )

    return validated
