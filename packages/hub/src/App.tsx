import { Navigate, Route, Routes } from "react-router-dom";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { DashboardLayout } from "./pages/DashboardLayout";
import { InicioPage } from "./pages/InicioPage";
import { IdeasPage } from "./pages/IdeasPage";
import { CommitmentsPage } from "./pages/CommitmentsPage";
import { ProjectsPage } from "./pages/ProjectsPage";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";

export function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/cadastro" element={<RegisterPage />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path="/" element={<Navigate to="/inicio" replace />} />
          <Route path="/inicio" element={<InicioPage />} />
          <Route path="/projetos" element={<ProjectsPage />} />
          <Route path="/ideias" element={<IdeasPage />} />
          <Route path="/compromissos" element={<CommitmentsPage />} />
        </Route>
      </Route>
    </Routes>
  );
}
