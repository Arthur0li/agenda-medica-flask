def test_login_valid(client):
    response = client.post("/login", data={
        "identifier": "admin",
        "password": "admin",
    }, follow_redirects=False)
    assert response.status_code == 302
    assert "/agenda" in response.headers["Location"]

def test_login_invalid(client):
    response = client.post("/login", data={
        "identifier": "admin",
        "password": "wrong",
    }, follow_redirects=True)
    assert response.status_code == 200
    assert "Usuário ou senha inválidos." in response.get_data(as_text=True)
