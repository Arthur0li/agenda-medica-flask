document.addEventListener("DOMContentLoaded", () => {
  const config = window.TIMESAVER_CONFIG || {};
  const searchInput = document.getElementById("searchInput");
  const messageBox = document.getElementById("table-messages");
  const currentDate = document.getElementById("current-date");

  if (currentDate) {
    const date = new Date().toLocaleDateString("pt-BR", {
      weekday: "long",
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
    currentDate.textContent = date.charAt(0).toUpperCase() + date.slice(1);
  }

  const fields = ["patient", "cpf", "doctor", "specialty", "plan", "status", "date", "time"];
  let allData = [];
  let table = null;
  let currentStatus = "all";

  const statMap = {
    total: document.getElementById("stat-total"),
    confirmado: document.getElementById("stat-confirmado"),
    aguardando: document.getElementById("stat-aguardando"),
    cancelado: document.getElementById("stat-cancelado"),
  };

  function setMessage(type, text) {
    if (!messageBox) return;
    if (!text) {
      messageBox.textContent = "";
      messageBox.className = "table-message hidden";
      return;
    }
    messageBox.textContent = text;
    messageBox.className = `table-message ${type}`;
  }

  function normalize(value) {
    return String(value || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
  }

  function updateStats(data) {
    const countBy = (status) => data.filter((item) => item.status === status).length;
    if (statMap.total) statMap.total.textContent = data.length;
    if (statMap.confirmado) statMap.confirmado.textContent = countBy("Confirmado");
    if (statMap.aguardando) statMap.aguardando.textContent = countBy("Aguardando");
    if (statMap.cancelado) statMap.cancelado.textContent = countBy("Cancelado");
  }

  function applyFilters() {
    const q = normalize(searchInput ? searchInput.value : "");
    let filtered = [...allData];

    if (currentStatus === "empty") {
      filtered = [];
      renderEmptyState("Nenhum agendamento encontrado.", "Não há agendamentos disponíveis.");
      return;
    }

    if (currentStatus === "error") {
      renderErrorState("Não foi possível carregar os agendamentos.");
      return;
    }

    if (currentStatus === "api-down") {
      renderErrorState("Serviço temporariamente indisponível. Tente novamente em alguns instantes.");
      return;
    }

    if (q) {
      filtered = filtered.filter((item) => {
        return fields.some((field) => normalize(item[field]).includes(q));
      });
    }

    if (!table) return;
    table.setData(filtered);

    if (filtered.length === 0) {
      setMessage("info", q ? "Nenhum registro foi encontrado." : "Nenhum agendamento encontrado.");
    } else {
      setMessage("", "");
    }
    updateStats(filtered);
  }

  function renderEmptyState(title, description) {
    if (table) table.clearData();
    setMessage("info", `${title} ${description}`.trim());
    updateStats([]);
  }

  function renderErrorState(text) {
    if (table) table.clearData();
    setMessage("error", text);
    updateStats([]);
  }

  function makeStatusBadge(cell) {
    const value = cell.getValue();
    const cls = {
      Confirmado: "badge-confirmado",
      Aguardando: "badge-aguardando",
      Cancelado: "badge-cancelado",
      Realizado: "badge-realizado",
    }[value] || "badge-realizado";

    return `<span class="badge ${cls}">${value}</span>`;
  }

  function initTable() {
    table = new Tabulator("#appointments-table", {
      data: [],
      layout: "fitColumns",
      responsiveLayout: "collapse",
      height: "calc(100vh - 420px)",
      placeholder: `<div class="no-results-placeholder"><strong>Nenhum agendamento disponível.</strong>Os dados aparecerão aqui quando a API retornar registros.</div>`,
      columns: [
        { title: "Data", field: "date", width: 120 },
        { title: "Horário", field: "time", width: 100 },
        { title: "Paciente", field: "patient", widthGrow: 2 },
        { title: "CPF", field: "cpf", width: 150 },
        { title: "Médico", field: "doctor", widthGrow: 2 },
        { title: "Especialidade", field: "specialty", widthGrow: 1.3 },
        { title: "Convênio", field: "plan", widthGrow: 1.1 },
        { title: "Status", field: "status", formatter: makeStatusBadge, width: 150 },
      ],
    });
  }

  async function loadData() {
    setMessage("info", "Carregando agendamentos...");
    try {
      const response = await fetch(config.appointmentsApi, { headers: { "Accept": "application/json" } });
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.error || "Não foi possível carregar os agendamentos.");
      }

      if (!payload || !Array.isArray(payload.appointments)) {
        throw new Error("Resposta inválida da API.");
      }

      allData = payload.appointments;
      updateStats(allData);
      if (allData.length === 0) {
        setMessage("info", "Nenhum agendamento disponível.");
      } else {
        setMessage("", "");
      }
      table.setData(allData);
    } catch (error) {
      console.error(error);
      allData = [];
      table.clearData();
      setMessage("error", error.message || "Não foi possível carregar os agendamentos.");
      updateStats([]);
    }
  }

  initTable();
  loadData();

  if (searchInput) {
    searchInput.addEventListener("input", applyFilters);
  }

  document.querySelectorAll(".filter-chip").forEach((button) => {
    button.addEventListener("click", () => {
      document.querySelectorAll(".filter-chip").forEach((b) => b.classList.remove("active"));
      button.classList.add("active");
      currentStatus = button.dataset.status || "all";
      if (currentStatus === "all") {
        setMessage("", "");
        table.setData(allData);
        updateStats(allData);
        applyFilters();
      } else {
        applyFilters();
      }
    });
  });
});
