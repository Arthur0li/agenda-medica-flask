def test_appointments_proxy_success(client, monkeypatch):
    class FakeResponse:
        status_code = 200
        def raise_for_status(self):
            return None
        def json(self):
            return [{
                "patient": "Ana",
                "cpf": "123",
                "doctor": "Dr. X",
                "specialty": "Cardiologia",
                "date": "22/07/2026",
                "time": "08:00",
                "plan": "Unimed",
                "status": "Confirmado",
            }]

    import requests
    monkeypatch.setattr(requests, "get", lambda *args, **kwargs: FakeResponse())
    client.post("/login", data={"identifier": "admin", "password": "admin"})
    response = client.get("/api/appointments")
    assert response.status_code == 200
    assert response.json["appointments"][0]["patient"] == "Ana"

def test_appointments_proxy_down(client, monkeypatch):
    import requests
    def raiser(*args, **kwargs):
        raise requests.RequestException("down")
    monkeypatch.setattr(requests, "get", raiser)
    client.post("/login", data={"identifier": "admin", "password": "admin"})
    response = client.get("/api/appointments")
    assert response.status_code == 502
    assert "indisponível" in response.get_data(as_text=True).lower()
