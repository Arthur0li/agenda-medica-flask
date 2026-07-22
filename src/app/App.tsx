import { useState, useMemo } from "react";
import { LogOut, Search, X, AlertCircle, ClipboardList, RefreshCw, Activity, WifiOff, ServerCrash } from "lucide-react";

// ─── TimeSaver Logo SVG ───────────────────────────────────────────────────────

function TimeSaverLogo({ size = 36 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Gear body */}
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M27.2 4l-1.6 5.6A20 20 0 0 0 18 13.6L12.4 12 4 20.4l1.6 5.6A20 20 0 0 0 4 32c0 2.1.3 4.2.8 6.1L3.2 44l8.4 8.4 5.6-1.6A20 20 0 0 0 24 54.4l1.6 5.6h11.6L39 54a20 20 0 0 0 7-4.1l5.6 1.6L60 43.1l-1.6-5.6A20 20 0 0 0 60 32c0-2.1-.3-4.2-.8-6.1L60.8 20 52.4 11.6l-5.6 1.6A20 20 0 0 0 40 9.6L38.4 4H27.2z"
        fill="currentColor"
        opacity="0.18"
      />
      <path
        d="M26.4 5.6 24.8 11A21.6 21.6 0 0 0 16.8 15L11.2 13.4 4.4 20.2l1.6 5.6A21.6 21.6 0 0 0 4.8 32c0 2.2.3 4.3.9 6.3L4.1 44l6.8 6.8 5.6-1.6A21.6 21.6 0 0 0 24.4 53l1.6 5.4h12L39.6 53A21.6 21.6 0 0 0 47.6 49L53.2 50.6 60 43.8l-1.6-5.6A21.6 21.6 0 0 0 59.2 32c0-2.2-.3-4.3-.9-6.3L59.9 20l-6.8-6.8-5.6 1.6A21.6 21.6 0 0 0 39.6 11L38 5.6H26.4z"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
      />
      {/* Inner circle */}
      <circle cx="32" cy="32" r="12" fill="currentColor" opacity="0.12" stroke="currentColor" strokeWidth="2" />
      {/* Checkmark */}
      <path
        d="M24.5 32l5.5 5.5 9.5-9.5"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function TimeSaverLogoSimple({ size = 36 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="40" height="40" rx="10" fill="currentColor" />
      {/* Gear teeth suggestion via clipped circle with bumps */}
      <circle cx="20" cy="20" r="9" fill="white" fillOpacity="0.2" />
      {/* Checkmark */}
      <path
        d="M13 20.5l5 5 9-9"
        stroke="white"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Gear indicator dots */}
      <rect x="18.5" y="4" width="3" height="4" rx="1.5" fill="white" fillOpacity="0.7" />
      <rect x="18.5" y="32" width="3" height="4" rx="1.5" fill="white" fillOpacity="0.7" />
      <rect x="4" y="18.5" width="4" height="3" rx="1.5" fill="white" fillOpacity="0.7" />
      <rect x="32" y="18.5" width="4" height="3" rx="1.5" fill="white" fillOpacity="0.7" />
      <rect x="7.5" y="7.5" width="3" height="3" rx="1.5" fill="white" fillOpacity="0.5" transform="rotate(45 9 9)" />
      <rect x="29.5" y="7.5" width="3" height="3" rx="1.5" fill="white" fillOpacity="0.5" transform="rotate(45 31 9)" />
      <rect x="7.5" y="29.5" width="3" height="3" rx="1.5" fill="white" fillOpacity="0.5" transform="rotate(45 9 31)" />
      <rect x="29.5" y="29.5" width="3" height="3" rx="1.5" fill="white" fillOpacity="0.5" transform="rotate(45 31 31)" />
    </svg>
  );
}

// ─── Types ────────────────────────────────────────────────────────────────────

type Screen = "login" | "agenda";
type TableState = "loaded" | "empty" | "error" | "api-down" | "no-results";

interface Agendamento {
  id: number;
  data: string;
  horario: string;
  paciente: string;
  cpf: string;
  medico: string;
  especialidade: string;
  convenio: string;
  status: "Confirmado" | "Aguardando" | "Cancelado" | "Realizado";
}

// ─── Mock data ─────────────────────────────────────────────────────────────────

const MOCK: Agendamento[] = [
  { id: 1,  data: "22/07/2026", horario: "08:00", paciente: "Ana Carolina Ferreira",    cpf: "012.345.678-90", medico: "Dr. Rafael Mendes",       especialidade: "Cardiologia",   convenio: "Unimed",          status: "Confirmado" },
  { id: 2,  data: "22/07/2026", horario: "08:30", paciente: "Bruno Henrique Souza",     cpf: "123.456.789-01", medico: "Dra. Patrícia Lima",       especialidade: "Ortopedia",     convenio: "Amil",            status: "Aguardando" },
  { id: 3,  data: "22/07/2026", horario: "09:00", paciente: "Camila Rodrigues",         cpf: "234.567.890-12", medico: "Dr. Rafael Mendes",       especialidade: "Cardiologia",   convenio: "SulAmérica",      status: "Realizado"  },
  { id: 4,  data: "22/07/2026", horario: "09:30", paciente: "Diego Alves Pereira",      cpf: "345.678.901-23", medico: "Dr. Fernando Costa",      especialidade: "Neurologia",    convenio: "Bradesco Saúde",  status: "Confirmado" },
  { id: 5,  data: "22/07/2026", horario: "10:00", paciente: "Elaine Cristina Gomes",   cpf: "456.789.012-34", medico: "Dra. Patrícia Lima",       especialidade: "Ortopedia",     convenio: "Unimed",          status: "Cancelado"  },
  { id: 6,  data: "22/07/2026", horario: "10:30", paciente: "Fábio Luiz Martins",      cpf: "567.890.123-45", medico: "Dra. Juliana Nascimento", especialidade: "Clínica Geral", convenio: "Particular",      status: "Aguardando" },
  { id: 7,  data: "22/07/2026", horario: "11:00", paciente: "Gabriela Santos Oliveira",cpf: "678.901.234-56", medico: "Dr. Fernando Costa",      especialidade: "Neurologia",    convenio: "Amil",            status: "Confirmado" },
  { id: 8,  data: "22/07/2026", horario: "11:30", paciente: "Henrique José Carvalho",  cpf: "789.012.345-67", medico: "Dr. Rafael Mendes",       especialidade: "Cardiologia",   convenio: "SulAmérica",      status: "Realizado"  },
  { id: 9,  data: "22/07/2026", horario: "14:00", paciente: "Isabela Moraes",           cpf: "890.123.456-78", medico: "Dra. Juliana Nascimento", especialidade: "Clínica Geral", convenio: "Unimed",          status: "Confirmado" },
  { id: 10, data: "22/07/2026", horario: "14:30", paciente: "Jorge Eduardo Lima",       cpf: "901.234.567-89", medico: "Dra. Patrícia Lima",       especialidade: "Ortopedia",     convenio: "Bradesco Saúde",  status: "Aguardando" },
  { id: 11, data: "22/07/2026", horario: "15:00", paciente: "Karina Vieira Bispo",     cpf: "012.345.678-91", medico: "Dr. Fernando Costa",      especialidade: "Neurologia",    convenio: "Particular",      status: "Confirmado" },
  { id: 12, data: "22/07/2026", horario: "15:30", paciente: "Lucas Amaral Teixeira",   cpf: "112.233.445-66", medico: "Dr. Rafael Mendes",       especialidade: "Cardiologia",   convenio: "Amil",            status: "Cancelado"  },
  { id: 13, data: "22/07/2026", horario: "16:00", paciente: "Marina Costa Duarte",     cpf: "223.344.556-77", medico: "Dra. Juliana Nascimento", especialidade: "Clínica Geral", convenio: "SulAmérica",      status: "Confirmado" },
  { id: 14, data: "22/07/2026", horario: "16:30", paciente: "Nelson Rodrigues Pinto",  cpf: "334.455.667-88", medico: "Dra. Patrícia Lima",       especialidade: "Ortopedia",     convenio: "Unimed",          status: "Aguardando" },
];

// ─── Status badge ─────────────────────────────────────────────────────────────

const statusConfig: Record<Agendamento["status"], { bg: string; text: string; dot: string }> = {
  Confirmado: { bg: "bg-emerald-50",  text: "text-emerald-700", dot: "bg-emerald-500" },
  Aguardando: { bg: "bg-amber-50",    text: "text-amber-700",   dot: "bg-amber-400"  },
  Cancelado:  { bg: "bg-red-50",      text: "text-red-700",     dot: "bg-red-500"    },
  Realizado:  { bg: "bg-sky-50",      text: "text-sky-700",     dot: "bg-sky-500"    },
};

function StatusBadge({ status }: { status: Agendamento["status"] }) {
  const cfg = statusConfig[status];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${cfg.bg} ${cfg.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {status}
    </span>
  );
}

// ─── Login screen ─────────────────────────────────────────────────────────────

function LoginScreen({ onLogin }: { onLogin: (user: string) => void }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState<string | null>(null);
  const [loading, setLoading]   = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!username.trim() || !password.trim()) {
      setError("Preencha todos os campos.");
      return;
    }

    setLoading(true);
    await new Promise((r) => setTimeout(r, 900));
    setLoading(false);

    if (username === "admin" && password === "admin") {
      onLogin(username);
    } else {
      setError("Usuário ou senha inválidos.");
    }
  };

  return (
    <div
      className="min-h-screen w-full flex flex-col items-center justify-center bg-background px-4"
      style={{ fontFamily: "'Figtree', sans-serif" }}
    >
      {/* Top brand stripe */}
      <div className="fixed top-0 inset-x-0 h-1 bg-primary" />

      <div className="w-full max-w-[380px]">
        {/* Brand mark */}
        <div className="flex flex-col items-center mb-8">
          <div className="text-primary mb-3">
            <TimeSaverLogoSimple size={52} />
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground tracking-tight leading-none">
              Time<span className="text-primary">Saver</span>
            </h1>
            <p className="text-sm text-muted-foreground mt-1 font-medium tracking-wide uppercase" style={{ letterSpacing: "0.08em" }}>
              Agenda Médica
            </p>
          </div>
        </div>

        {/* Card */}
        <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
          {/* Card header strip */}
          <div className="px-8 pt-7 pb-5 border-b border-border">
            <h2 className="text-base font-semibold text-foreground">Acesse sua conta</h2>
            <p className="text-sm text-muted-foreground mt-0.5">
              Entre com suas credenciais para continuar.
            </p>
          </div>

          <form onSubmit={handleSubmit} noValidate className="px-8 pt-6 pb-7 space-y-4">
            {/* Error */}
            {error && (
              <div className="flex items-start gap-2.5 bg-red-50 border border-red-200 text-red-700 text-sm px-3.5 py-3 rounded-lg">
                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Username */}
            <div className="space-y-1.5">
              <label htmlFor="username" className="text-sm font-medium text-foreground block">
                Usuário ou e-mail
              </label>
              <input
                id="username"
                type="text"
                autoComplete="username"
                value={username}
                onChange={(e) => { setUsername(e.target.value); setError(null); }}
                placeholder="usuario ou email@empresa.com"
                className="w-full px-3.5 py-2.5 rounded-lg border border-border bg-input-background text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary/60 transition-all"
              />
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label htmlFor="password" className="text-sm font-medium text-foreground block">
                Senha
              </label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(null); }}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 rounded-lg border border-border bg-input-background text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary/60 transition-all"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-1 py-2.5 px-4 bg-primary text-white rounded-lg text-sm font-semibold hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Entrando…
                </>
              ) : "Entrar"}
            </button>
          </form>
        </div>

        {/* Demo hint */}
        <div className="mt-5 text-center">
          <p className="text-xs text-muted-foreground">
            Acesso de demonstração:{" "}
            <span className="font-semibold text-foreground">admin</span>
            {" / "}
            <span className="font-semibold text-foreground">admin</span>
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer className="fixed bottom-5 text-xs text-muted-foreground">
        timersaver.com.br
      </footer>
    </div>
  );
}

// ─── Agenda screen ────────────────────────────────────────────────────────────

const STATE_LABELS: Record<TableState, string> = {
  loaded:     "Com dados",
  empty:      "Sem dados",
  error:      "Erro geral",
  "api-down": "API offline",
  "no-results": "Sem resultado",
};

function AgendaScreen({ user, onLogout }: { user: string; onLogout: () => void }) {
  const [query, setQuery]           = useState("");
  const [tableState, setTableState] = useState<TableState>("loaded");

  const filtered = useMemo(() => {
    if (tableState === "error" || tableState === "api-down" || tableState === "empty") return [];
    const q = query.trim().toLowerCase();
    if (!q) return MOCK;
    return MOCK.filter(
      (a) =>
        a.paciente.toLowerCase().includes(q) ||
        a.cpf.replace(/\D/g, "").includes(q.replace(/\D/g, "")) ||
        a.medico.toLowerCase().includes(q) ||
        a.especialidade.toLowerCase().includes(q) ||
        a.convenio.toLowerCase().includes(q)
    );
  }, [query, tableState]);

  const effectiveState: TableState =
    tableState === "error"    ? "error"    :
    tableState === "api-down" ? "api-down" :
    tableState === "empty"    ? "empty"    :
    filtered.length === 0 && query.trim() ? "no-results" :
    "loaded";

  const today = new Date().toLocaleDateString("pt-BR", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });

  const counts = {
    total:      MOCK.length,
    confirmado: MOCK.filter((a) => a.status === "Confirmado").length,
    aguardando: MOCK.filter((a) => a.status === "Aguardando").length,
    cancelado:  MOCK.filter((a) => a.status === "Cancelado").length,
  };

  return (
    <div className="min-h-screen bg-background flex flex-col" style={{ fontFamily: "'Figtree', sans-serif" }}>

      {/* Top brand stripe */}
      <div className="h-1 bg-primary w-full shrink-0" />

      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-10">
        <div className="max-w-screen-xl mx-auto px-6 py-3.5 flex items-center justify-between">

          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="text-primary">
              <TimeSaverLogoSimple size={34} />
            </div>
            <div className="leading-none">
              <span className="text-base font-bold text-foreground">
                Time<span className="text-primary">Saver</span>
              </span>
              <p className="text-[11px] text-muted-foreground tracking-wider uppercase mt-0.5">
                Agenda Médica
              </p>
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-5">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold text-foreground capitalize leading-tight">{user}</p>
              <p className="text-xs text-muted-foreground leading-tight capitalize">{today}</p>
            </div>
            <button
              onClick={onLogout}
              className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground border border-border rounded-lg px-3 py-2 hover:bg-muted transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sair</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 px-6 py-7">
        <div className="max-w-screen-xl mx-auto space-y-5">

          {/* Page title + stat cards */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-5">
            <div>
              <h1 className="text-xl font-bold text-foreground">Agenda do Dia</h1>
              <p className="text-sm text-muted-foreground mt-0.5">
                Consulte e acompanhe os agendamentos médicos.
              </p>
            </div>

            <div className="flex gap-2 shrink-0 flex-wrap">
              {[
                { label: "Total",       value: counts.total,      color: "text-foreground", border: "border-border" },
                { label: "Confirmados", value: counts.confirmado, color: "text-emerald-600", border: "border-emerald-100" },
                { label: "Aguardando",  value: counts.aguardando, color: "text-amber-600",   border: "border-amber-100"   },
                { label: "Cancelados",  value: counts.cancelado,  color: "text-red-600",     border: "border-red-100"     },
              ].map((s) => (
                <div key={s.label} className={`bg-card border ${s.border} rounded-lg px-3.5 py-2.5 text-center min-w-[70px]`}>
                  <p className={`text-xl font-bold leading-none ${s.color}`}>{s.value}</p>
                  <p className="text-[11px] text-muted-foreground mt-1 whitespace-nowrap">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Toolbar */}
          <div className="bg-card border border-border rounded-xl px-4 py-3 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar por paciente, CPF, médico ou convênio…"
                className="w-full pl-9 pr-8 py-2.5 rounded-lg border border-border bg-input-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all"
              />
              {query && (
                <button
                  onClick={() => setQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* State simulator — represents API/DB states */}
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-xs text-muted-foreground hidden sm:inline">Simular:</span>
              <div className="flex gap-1.5">
                {(["loaded", "empty", "error", "api-down"] as TableState[]).map((s) => (
                  <button
                    key={s}
                    onClick={() => { setTableState(s); setQuery(""); }}
                    title={STATE_LABELS[s]}
                    className={`text-xs px-2.5 py-1.5 rounded-md border transition-colors ${
                      tableState === s
                        ? "bg-primary text-white border-primary"
                        : "border-border text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    {STATE_LABELS[s]}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Table card */}
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            {effectiveState === "loaded" ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm" style={{ fontFamily: "'Figtree', sans-serif" }}>
                  <thead>
                    <tr className="bg-muted/40 border-b border-border">
                      {["Data", "Horário", "Paciente", "CPF", "Médico", "Especialidade", "Convênio", "Status"].map((h) => (
                        <th
                          key={h}
                          className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide whitespace-nowrap"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((row, i) => (
                      <tr
                        key={row.id}
                        className={`border-b border-border last:border-0 hover:bg-primary/[0.03] transition-colors ${
                          i % 2 === 1 ? "bg-muted/[0.15]" : ""
                        }`}
                      >
                        <td
                          className="px-4 py-3 whitespace-nowrap text-foreground font-medium"
                          style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.78rem" }}
                        >
                          {row.data}
                        </td>
                        <td
                          className="px-4 py-3 whitespace-nowrap text-foreground font-semibold"
                          style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.78rem" }}
                        >
                          {row.horario}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap font-semibold text-foreground">
                          {row.paciente}
                        </td>
                        <td
                          className="px-4 py-3 whitespace-nowrap text-muted-foreground"
                          style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.78rem" }}
                        >
                          {row.cpf}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-foreground">{row.medico}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-muted-foreground">{row.especialidade}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-muted-foreground">{row.convenio}</td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <StatusBadge status={row.status} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Table footer */}
                <div className="px-4 py-3 border-t border-border bg-muted/20 flex items-center justify-between">
                  <p className="text-xs text-muted-foreground">
                    {query.trim()
                      ? <>Exibindo <span className="font-semibold text-foreground">{filtered.length}</span> resultado{filtered.length !== 1 ? "s" : ""} para "{query}"</>
                      : <>Total de <span className="font-semibold text-foreground">{filtered.length}</span> agendamentos</>
                    }
                  </p>
                  <div className="flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5 text-primary" />
                    <span className="text-xs text-muted-foreground">Dados atualizados</span>
                  </div>
                </div>
              </div>
            ) : (
              <EmptyState type={effectiveState} onReset={() => { setTableState("loaded"); setQuery(""); }} />
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border px-6 py-3 text-center">
        <p className="text-xs text-muted-foreground">timersaver.com.br</p>
      </footer>
    </div>
  );
}

// ─── Empty / error states ──────────────────────────────────────────────────────

function EmptyState({ type, onReset }: { type: TableState; onReset: () => void }) {
  const configs: Record<Exclude<TableState, "loaded">, {
    icon: React.ReactNode;
    title: string;
    desc: string;
    action: React.ReactNode | null;
  }> = {
    empty: {
      icon: <ClipboardList className="w-9 h-9 text-muted-foreground" strokeWidth={1.4} />,
      title: "Nenhum agendamento encontrado",
      desc: "Não há agendamentos registrados para o período selecionado.",
      action: null,
    },
    "no-results": {
      icon: <Search className="w-9 h-9 text-muted-foreground" strokeWidth={1.4} />,
      title: "Nenhum registro foi encontrado",
      desc: "A busca não retornou resultados. Tente outros termos ou limpe o filtro.",
      action: (
        <button onClick={onReset} className="mt-4 text-sm font-semibold text-primary hover:underline flex items-center gap-1.5 mx-auto">
          <X className="w-3.5 h-3.5" /> Limpar busca
        </button>
      ),
    },
    error: {
      icon: <ServerCrash className="w-9 h-9 text-red-400" strokeWidth={1.4} />,
      title: "Não foi possível carregar os agendamentos",
      desc: "Ocorreu um erro inesperado ao processar a resposta. Verifique os logs da aplicação.",
      action: (
        <button onClick={onReset} className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline mx-auto">
          <RefreshCw className="w-3.5 h-3.5" /> Tentar novamente
        </button>
      ),
    },
    "api-down": {
      icon: <WifiOff className="w-9 h-9 text-amber-400" strokeWidth={1.4} />,
      title: "Serviço temporariamente indisponível",
      desc: "Não foi possível estabelecer conexão com a API de agendamentos. Tente novamente em alguns instantes.",
      action: (
        <button onClick={onReset} className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline mx-auto">
          <RefreshCw className="w-3.5 h-3.5" /> Tentar novamente
        </button>
      ),
    },
  };

  const cfg = configs[type as Exclude<TableState, "loaded">];
  if (!cfg) return null;

  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
      <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
        {cfg.icon}
      </div>
      <p className="text-sm font-semibold text-foreground">{cfg.title}</p>
      <p className="mt-2 text-sm text-muted-foreground max-w-sm leading-relaxed">{cfg.desc}</p>
      {cfg.action}
    </div>
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────────

export default function App() {
  const [screen, setScreen] = useState<Screen>("login");
  const [user, setUser]     = useState("");

  return screen === "login"
    ? <LoginScreen onLogin={(u) => { setUser(u); setScreen("agenda"); }} />
    : <AgendaScreen user={user} onLogout={() => { setUser(""); setScreen("login"); }} />;
}
