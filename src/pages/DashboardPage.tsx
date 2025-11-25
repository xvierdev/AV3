import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import { getAllAircrafts } from '../utils/mockAircrafts';
import { getAllUsers } from '../utils/mockUsers';
import { getAllTasks } from '../utils/mockTasks';
import type { AircraftStatus, Aircraft } from '../types/AircraftTypes';
import type { User } from '../types/UserTypes';
import type { Task } from '../types/TaskTypes';
import pageStyles from './DashboardPage.module.css';

// -----------------------------------------------------------
// 1. Definições de Tipos Auxiliares
// -----------------------------------------------------------

interface DashboardStats {
    totalAircrafts: number;
    totalUsers: number;
    aircraftsByStatus: Record<AircraftStatus, number>;
    totalTasks: number;
    tasksPending: number;
    tasksCompleted: number;
    usersByRole: Record<string, number>;
}

// -----------------------------------------------------------
// 2. Componente Principal
// -----------------------------------------------------------

function DashboardPage() {
    // Hooks padrão
    const navigate = useNavigate();
    const { user, USER_LEVELS } = useAuth();

    const [allUsers, setAllUsers] = useState<User[]>([]);
    const [allAircrafts, setAllAircrafts] = useState<Aircraft[]>([]);
    const [allTasks, setAllTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            const users = await getAllUsers();
            const aircrafts = await getAllAircrafts();
            const tasks = await getAllTasks();
            setAllUsers(users);
            setAllAircrafts(aircrafts);
            setAllTasks(tasks);
            setLoading(false);
        };
        loadData();
    }, []);

    // --- Hooks de Estado (Apenas useMemo, sem useState/useEffect para simplicidade) ---

    // Função para calcular todas as estatísticas (otimizada com useMemo)
    const stats: DashboardStats = useMemo(() => {
        // 1. Estatísticas de Aeronaves
        const aircraftsByStatus = allAircrafts.reduce((acc, aircraft) => {
            const status = aircraft.status;
            acc[status] = (acc[status] || 0) + 1;
            return acc;
        }, {} as Record<AircraftStatus, number>);

        // 2. Estatísticas de Tarefas
        const tasksPending = allTasks.filter(t => t.status === 'Pendente' || t.status === 'Em Andamento').length;
        const tasksCompleted = allTasks.filter(t => t.status === 'Concluída').length;

        // 3. Estatísticas de Usuários
        const usersByRole = allUsers.reduce((acc, u) => {
            const role = u.levelName;
            acc[role] = (acc[role] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);


        return {
            totalAircrafts: allAircrafts.length,
            totalUsers: allUsers.length,
            aircraftsByStatus,
            totalTasks: allTasks.length,
            tasksPending,
            tasksCompleted,
            usersByRole,
        };
    }, [allUsers, allAircrafts, allTasks]);

    // -----------------------------------------------------------
    // 3. Lógica de Permissão e Retorno Condicional
    // -----------------------------------------------------------

    // ⛔ Verificação de Nulidade (Regra dos Hooks: sempre depois de todos os Hooks)
    if (!user || loading) {
        return <div className={pageStyles.container} style={{ textAlign: 'center' }}>Acesso negado ou carregando...</div>;
    }

    // 🚫 Restrição de Acesso: Apenas Administradores
    if (user.level !== USER_LEVELS.ADMIN) {
        return (
            <div className={pageStyles.container} style={{ textAlign: 'center', color: '#dc3545' }}>
                <h2>Acesso Negado</h2>
                <p>⚠️ Esta página é restrita apenas a Administradores.</p>
                <button onClick={() => navigate('/')} className={pageStyles.logoutButton}>
                    Voltar para a Página Principal
                </button>
            </div>
        );
    }

    // --- Renderização Principal (Apenas para ADMIN) ---

    // Função auxiliar para obter a classe de estilo para o badge
    const getRoleClass = (roleName: string) => {
        if (roleName.includes('Administrador')) return pageStyles.admin;
        if (roleName.includes('Engenheiro')) return pageStyles.engineer;
        if (roleName.includes('Operador')) return pageStyles.operator;
        return '';
    };

    return (
        <div className={pageStyles.container}>
            <header className={pageStyles.header}>
                <h1>📊 Dashboard do Sistema</h1>
                <div className={pageStyles.userInfo}>
                    <span className={pageStyles.userRole}>Nível: <strong>{user.levelName}</strong></span>
                    <button onClick={() => navigate('/aeronaves')} className={pageStyles.actionButton} style={{ backgroundColor: '#6c757d', color: 'white' }}>
                        Ver Aeronaves
                    </button>
                </div>
            </header>

            {/* Cartões de Estatísticas */}
            <h2 className={pageStyles.sectionHeader}>Estatísticas Chave</h2>
            <div className={pageStyles.statsGrid}>
                {/* Cartão 1: Total de Aeronaves */}
                <div className={pageStyles.statCard} style={{ borderLeftColor: '#007bff' }}>
                    <h3>Total de Aeronaves</h3>
                    <div className={pageStyles.statValue}>{stats.totalAircrafts}</div>
                    <div className={pageStyles.statDetail}>
                        Em produção: {(stats.aircraftsByStatus['Em Produção (Fase 1/6)'] || 0) + (stats.aircraftsByStatus['Em Produção (Fase 3/6)'] || 0)}
                    </div>
                </div>

                {/* Cartão 2: Tarefas Pendentes */}
                <div className={pageStyles.statCard} style={{ borderLeftColor: '#ffc107' }}>
                    <h3>Tarefas Pendentes/Em Andamento</h3>
                    <div className={pageStyles.statValue}>{stats.tasksPending}</div>
                    <div className={pageStyles.statDetail}>De um total de {stats.totalTasks} tarefas</div>
                </div>

                {/* Cartão 3: Tarefas Concluídas */}
                <div className={pageStyles.statCard} style={{ borderLeftColor: '#28a745' }}>
                    <h3>Tarefas Concluídas</h3>
                    <div className={pageStyles.statValue}>{stats.tasksCompleted}</div>
                    <div className={pageStyles.statDetail}>Taxa de Conclusão: {stats.totalTasks > 0 ? Math.round((stats.tasksCompleted / stats.totalTasks) * 100) : 0}%</div>
                </div>

                {/* Cartão 4: Total de Usuários */}
                <div className={pageStyles.statCard} style={{ borderLeftColor: '#dc3545' }}>
                    <h3>Total de Usuários</h3>
                    <div className={pageStyles.statValue}>{stats.totalUsers}</div>
                    <div className={pageStyles.statDetail}>Engenheiros: {stats.usersByRole['Engenheiro'] || 0} | Administradores: {stats.usersByRole['Administrador'] || 0}</div>
                </div>
            </div>

            {/* Tabela de Usuários */}
            <h2 className={pageStyles.sectionHeader}>Gestão de Usuários e Funções</h2>
            <table className={pageStyles.userTable}>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nome</th>
                        <th>Função</th>
                        <th>Nível</th>
                    </tr>
                </thead>
                <tbody>
                    {allUsers.map(userItem => (
                        <tr key={userItem.id}>
                            <td>{userItem.id}</td>
                            <td>{userItem.name}</td>
                            <td>
                                <span className={`${pageStyles.roleBadge} ${getRoleClass(userItem.levelName)}`}>
                                    <strong>{userItem.levelName}</strong>
                                </span>
                            </td>
                            <td>{userItem.level}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default DashboardPage;