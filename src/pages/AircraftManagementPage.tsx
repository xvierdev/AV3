import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AddAircraftModal } from '../components/AddAircraftModal/AddAircraftModal';
import { useAuth } from '../context/useAuth';
import type { AircraftWithPermission, NewAircraftData } from '../types/AircraftTypes';
import { getAircraftsForUser, addAircraft } from '../utils/apiAircrafts';
import { getAllUsers } from '../utils/apiUsers';
import pageStyles from './AircraftManagementPage.module.css';

// Mapeamento para as cores
const statusClassMap: { [key: string]: string } = {
    'Pré-produção': pageStyles['status-PreProducao'], // Crie esta classe se precisar de cor
    'Em Produção (Fase 1/6)': pageStyles['status-EmProducao'],
    'Em Produção (Fase 3/6)': pageStyles['status-EmProducao'],
    'Testes Finais': pageStyles['status-TestesFinais'],
    'Concluído / Entregue': pageStyles['status-Concluido'],
};

function AircraftManagementPage() {
    const { user, USER_LEVELS } = useAuth();
    const navigate = useNavigate();

    const [aircrafts, setAircrafts] = useState<AircraftWithPermission[]>([]);
    const [engineers, setEngineers] = useState<any[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const loadData = async () => {
            if (user) {
                const aircraftsData = await getAircraftsForUser(user);
                const usersData = await getAllUsers();
                const engineersData = usersData.filter(u => u.level === USER_LEVELS.ENGINEER);
                setAircrafts(aircraftsData);
                setEngineers(engineersData);
            }
        };
        loadData();
    }, [user, USER_LEVELS.ENGINEER]);

    const isAdmin = user?.level === USER_LEVELS.ADMIN;

    const handleAddAircraft = async (data: NewAircraftData) => {
        if (!user) return;

        try {
            const addedAircraft = await addAircraft(data, user.id);
            const newAircraftWithPermissions = { ...addedAircraft, canEdit: true };
            setAircrafts(prevAircrafts => [...prevAircrafts, newAircraftWithPermissions]);
            alert(`Aeronave "${addedAircraft.model}" adicionada com sucesso!`);
        } catch (error) {
            alert("Ocorreu um erro ao adicionar a aeronave. Consulte o console.");
            console.error(error);
        }
    };

    const handleSelectAircraft = (id: string) => {
        navigate(`/aeronaves/${id}`);
    };

    const handleManageUsers = () => {
        if (isAdmin) {
            navigate('/usuarios');
        }
    };

    if (!user) {
        return <div className={pageStyles.container}>Carregando informações...</div>;
    }

    return (
        <div className={pageStyles.container}>
            <header className={pageStyles.header}>
                <h1>✈️ Aerocode - Gerenciamento de Aeronaves</h1>
                <div className={pageStyles.userInfo}>
                    <span className={pageStyles.userName}>Usuário: {user.name}</span>
                </div>
            </header>

            <div className={pageStyles.actionsBar}>
                {isAdmin && (
                    <>
                        <button onClick={handleManageUsers} className={pageStyles.actionButton} style={{ backgroundColor: '#17a2b8' }}>
                            Gerenciar Funcionários
                        </button>
                        <button onClick={() => setIsModalOpen(true)} className={pageStyles.actionButton}>
                            + Nova Aeronave
                        </button>
                    </>
                )}
            </div>

            <main className={pageStyles.content}>
                <h2>Lista de Projetos Ativos</h2>
                <div className={pageStyles.cardContainer}>
                    {aircrafts.map((a) => (
                        <div key={a.id} className={pageStyles.card} onClick={() => handleSelectAircraft(a.id)}>
                            <h3 className={pageStyles.cardTitle}>{a.model} ({a.id})</h3>
                            <p><strong>Tipo:</strong> {a.type}</p>
                            <p><strong>Cliente:</strong> {a.clientName || 'N/A'}</p>
                            <p><strong>Status:</strong> <span className={`${pageStyles.statusBadge} ${statusClassMap[a.status] || ''}`}>{a.status}</span></p>

                            {a.canEdit && user.level !== 'operador' && (
                                <span className={pageStyles.editTag}>Pode Editar</span>
                            )}
                            {!a.canEdit && user.level === 'engenheiro' && (
                                <span className={pageStyles.editTag} style={{ backgroundColor: '#6c757d' }}>Apenas Consulta</span>
                            )}
                        </div>
                    ))}
                </div>
            </main>

            {isAdmin && (
                <AddAircraftModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSubmit={handleAddAircraft}
                    engineers={engineers}
                />
            )}
        </div>
    );
}

export default AircraftManagementPage;