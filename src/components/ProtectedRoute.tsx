import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import type { UserLevel } from "../types/UserTypes";

interface ProtectedRouteProps {
    minLevel?: UserLevel;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ minLevel = "operador" }) => {
    const { user, loading, hasPermission } = useAuth();

    if (loading) {
        return <div style={{ padding: '20px', textAlign: 'center' }}>Verificando acesso...</div>;
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (!hasPermission(minLevel)) {
        console.warn(`Acesso negado para o usuário ${user.username} (Nível: ${user.levelName}) tentando acessar a rota de ${minLevel}.`);
        return <Navigate to="/aeronaves" replace />;
    }

    return <Outlet />;
}

export default ProtectedRoute;