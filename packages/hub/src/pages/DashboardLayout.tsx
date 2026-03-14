import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

function initialFromEmail(email: string): string {
  const part = email.split("@")[0] ?? "";
  return part.slice(0, 2).toUpperCase();
}

export function DashboardLayout() {
  const { signOut, session } = useAuth();

  return (
    <div className="layout">
      <header className="header">
        <h1>
          <span>Hub</span>
          <span className="accent">.</span>
        </h1>
        <div className="header-right">
          <div className="user-pill">
            <span className="avatar" aria-hidden>
              {session?.email ? initialFromEmail(session.email) : "?"}
            </span>
            <span className="user-email">{session?.email ?? "Usuário"}</span>
          </div>
          <button type="button" onClick={() => void signOut()}>
            Sair
          </button>
        </div>
      </header>

      <nav className="nav">
        <NavLink to="/inicio">Início</NavLink>
        <NavLink to="/projetos">Projetos</NavLink>
        <NavLink to="/ideias">Ideias</NavLink>
        <NavLink to="/compromissos">Compromissos</NavLink>
      </nav>

      <main className="content">
        <Outlet />
      </main>
    </div>
  );
}
