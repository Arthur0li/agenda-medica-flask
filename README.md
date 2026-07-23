<img src="https://capsule-render.vercel.app/api?type=waving&height=300&color=0F766E&text=Agenda%20Médica&fontColor=FFFFFF"/>

# 🩺 Agenda Médica com Flask

Uma aplicação web desenvolvida como parte do **Desafio Técnico do Estágio em Desenvolvimento de Software da TimeSaver**.

O projeto simula um sistema de agendamento médico no qual usuários autenticados podem acessar uma lista de consultas médicas obtidas de uma API HTTP externa.

A aplicação foi construída utilizando **Flask**, **SQLite**, **Docker** e uma API *mock* (simulada) separada, seguindo uma arquitetura modular e implementando tratamento de erros, registro de logs, testes automatizados e uma interface responsiva. ---

# 📸 Prévia

> Login

*(Captura de tela)*

> Agenda Médica

*(Captura de tela)*

---

# ✨ Funcionalidades

- 🔐 Autenticação de usuário utilizando SQLite
- 👤 Login com nome de usuário ou e-mail
- 📅 Painel de agendamentos médicos
- 🌐 Integração HTTP com uma API externa simulada
- 📊 Tabela de agendamentos construída com Tabulator
- 🔎 Busca de agendamentos por paciente, CPF ou médico
- ⚠️ Tratamento de erros amigável
- 📝 Registro de logs da aplicação
- ✅ Testes automatizados

---

# 🚀 Tecnologias

<div align="center">

![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white) ![Flask](https://img.shields.io/badge/Flask-000000?style=for-the-badge&logo=flask&logoColor=white) ![SQLite](https://img.shields.io/badge/SQLite-003B57?style=for-the-badge&logo=sqlite&logoColor=white) ![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)

![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black) ![HTML5](https://img.shields.io/badge/HTML-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS-1572B6?style=for-the-badge&logo=css3&logoColor=white) ![Tabulator](https://img.shields.io/badge/Tabulator-4B5563?style=for-the-badge)

</div>

---

# 👤 Usuário de Teste

```
Nome de usuário: admin

Senha: admin
```

---

# 🛠 Executando localmente

Clone o repositório

```bash
git clone https://github.com/Arthur0li/timesaver-medical-scheduler.git

cd timesaver-medical-scheduler
```

Crie o ambiente virtual

```bash
python -m venv .venv
```

Ative-o

Windows

```bash
.venv\Scripts\activate
```

Linux

```bash
source .venv/bin/activate
```

Instale as dependências

```bash
pip install -r requirements.txt
```

Execute a API simulada (mock API)

```bash
python api/app.py
```

Em outro terminal

```bash
python run.py
```

Abra

```
http://127.0.0.1:5000
```

---

# 🐳 Executando com Docker

```bash
docker compose up --build
```

A aplicação criará automaticamente o banco de dados SQLite, registrará o usuário padrão e iniciará tanto a aplicação Flask quanto a API simulada.

---

# 🧪 Testes Automatizados

Execute

```bash
pytest
```

O projeto inclui testes automatizados que cobrem comportamentos importantes da aplicação, como autenticação e respostas de serviços.

---

# ⚙ Decisões Técnicas

- Foi utilizado o Figma para prototipar o frontend
- O Flask foi escolhido por estar alinhado à stack solicitada no desafio.
- O SQLite é utilizado para armazenar dados de autenticação.
- Os agendamentos médicos são obtidos de uma API externa simulada.
- A API foi separada em seu próprio serviço para simular uma arquitetura do mundo real.
- O Tabulator foi utilizado para exibir os dados dos agendamentos.
- O sistema de logs foi implementado para registrar erros inesperados e facilitar a depuração. - Variáveis ​​de ambiente são utilizadas para configurar definições sensíveis.

---

# ⚠ Tratamento de Erros

A aplicação trata:

- Credenciais inválidas
- Lista de agendamentos vazia
- Respostas da API inválidas
- API indisponível
- Erros de conexão com o banco de dados

Em todos os cenários, são exibidas mensagens amigáveis ​​ao usuário, enquanto informações detalhadas são registradas nos logs da aplicação.

---

# 👨‍💻 Autor

Desenvolvido por **Arthur Oliveira**

💼 LinkedIn

https://www.linkedin.com/in/arthur-oliveira-21ab8a236/

🐙 GitHub

https://github.com/Arthur0li

---

<img src="https://capsule-render.vercel.app/api?type=waving&height=100&color=0F766E&section=footer"/>
