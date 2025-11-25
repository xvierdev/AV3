import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';

/**
 * Componente que redireciona a rota "/" para o local apropriado baseado na autenticação.
 * - Não autenticado: redireciona para /login
 * - Autenticado (admin): redireciona para / (que mostra o dashboard)
 * - Autenticado (não-admin): redireciona para /aeronaves
 */
const RootRedirect = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div style={{ padding: '20px', textAlign: 'center' }}>Carregando...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.level === 'administrador') {
    return <Navigate to="/dashboard" replace />;
  }

  return <Navigate to="/aeronaves" replace />;
};

export default RootRedirect;
