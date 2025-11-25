import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Header from './components/Header/Header';
import ProtectedRoute from "./components/ProtectedRoute";
import RootRedirect from "./components/RootRedirect";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import AircraftManagementPage from "./pages/AircraftManagementPage";
import AircraftDetailPage from "./pages/AircraftDetailPage";
import UserManagementPage from "./pages/UserManagementPage";
import ProfilePage from "./pages/ProfilePage";
import NotFoundPage from './pages/NotFoundPage';
import { useAuth } from './context/useAuth';

function AppRoutes() {
  const { user } = useAuth();

  return (
    <>
      {user && <Header />}

      <main style={{ padding: '20px' }}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<RootRedirect />} />
          <Route element={<ProtectedRoute minLevel={'operador'} />}>
            <Route path="/perfil" element={<ProfilePage />} />
            <Route path="/aeronaves" element={<AircraftManagementPage />} />
            <Route path="/aeronaves/:id" element={<AircraftDetailPage />} />
          </Route>
          <Route element={<ProtectedRoute minLevel={'administrador'} />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/usuarios" element={<UserManagementPage />} />
            <Route path="/funcionarios" element={<Navigate to="/usuarios" replace />} />
          </Route>
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
    </>
  );
}
function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;