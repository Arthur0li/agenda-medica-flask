import requests
from requests import RequestException

REQUIRED_FIELDS = {"patient", "cpf", "doctor", "specialty", "date", "time", "plan", "status"}

class AppointmentServiceError(RuntimeError):
    pass

def fetch_appointments(api_url, timeout=8):
    try:
        response = requests.get(api_url, timeout=timeout)
        response.raise_for_status()
    except RequestException as exc:
        raise AppointmentServiceError("API temporariamente indisponível.") from exc

    try:
        payload = response.json()
    except ValueError as exc:
        raise AppointmentServiceError("Resposta inválida da API.") from exc

    if not isinstance(payload, list):
        raise AppointmentServiceError("Resposta inválida da API.")

    validated = []
    for idx, item in enumerate(payload, start=1):
        if not isinstance(item, dict):
            raise AppointmentServiceError("Resposta inválida da API.")
        missing = REQUIRED_FIELDS - set(item.keys())
        if missing:
            raise AppointmentServiceError("Campos obrigatórios ausentes na resposta recebida.")
        validated.append(item)

    return validated
