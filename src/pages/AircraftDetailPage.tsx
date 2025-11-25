import { useState, useEffect, useMemo, type FormEvent, type ChangeEvent } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

// ------------------- Componentes -------------------
import { AddPartModal } from '../components/AddPartModal/AddPartModal';
import { EditPartModal } from '../components/EditPartModal/EditPartModal'; // Importado
import { EditTaskModal } from '../components/EditTaskModal/EditTaskModal';
import { PartsList } from '../components/PartsList/PartsList';
import { RecordTestModal } from '../components/RecordTestModal/RecordTestModal';
import { TestsList } from '../components/TestsList/TestsList';

// ------------------- Contexto e Hooks -------------------
import { useAuth } from '../context/useAuth';

// ------------------- Tipos de Dados -------------------
import type { Aircraft, EditableAircraftData } from '../types/AircraftTypes';
import type { Task, TaskStatus, NewTaskData } from '../types/TaskTypes';
import type { Part, NewPartData, PartStatus } from '../types/PartTypes';
import type { Test, NewTestData } from '../types/TestTypes';

// ------------------- Lógica de Mock (Dados) -------------------
import { getAircraftById, updateAircraftDetails } from '../utils/mockAircrafts';
import { getAllUsers } from '../utils/mockUsers';
import { getTasksByAircraftId, createNewTask, updateTaskStatus, updateTask, deleteTask } from '../utils/mockTasks';
import { getPartsByAircraftId, addPart, updatePart, updatePartStatus as updatePartMockStatus, deletePart } from '../utils/mockParts';
import { getTestsByAircraftId, recordNewTest } from '../utils/mockTests';
import { generateAircraftReport } from '../utils/reportGenerator';

// ------------------- Estilos -------------------
import pageStyles from './AircraftDetailPage.module.css';
import modalStyles from '../styles/commonModal.module.css';

/**
 * Exibe e gerencia os detalhes de uma aeronave, incluindo suas tarefas, peças e testes.
 */
function AircraftDetailPage() {
    // ========================================================================
    // Hooks e Estados
    // ========================================================================

    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { user, USER_LEVELS } = useAuth();

    // Estados de Dados
    const [aircraft, setAircraft] = useState<Aircraft | null>(null);
    const [tasksList, setTasksList] = useState<Task[]>([]);
    const [partsList, setPartsList] = useState<Part[]>([]);
    const [testsList, setTestsList] = useState<Test[]>([]);
    const [allUsers, setAllUsers] = useState<any[]>([]);
    const [error, setError] = useState<string | null>(null);

    // Estados de UI
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState<EditableAircraftData>({});
    const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
    const [isPartModalOpen, setIsPartModalOpen] = useState(false);
    const [isTestModalOpen, setIsTestModalOpen] = useState(false);
    const [isEditTaskModalOpen, setIsEditTaskModalOpen] = useState(false);
    const [isEditPartModalOpen, setIsEditPartModalOpen] = useState(false);
    const [editingTask, setEditingTask] = useState<Task | null>(null);
    const [editingPart, setEditingPart] = useState<Part | null>(null);
    const [newTaskForm, setNewTaskForm] = useState<NewTaskData>({
        description: '', responsibleUserIds: [], dueDate: new Date().toISOString().split('T')[0],
    });

    // ========================================================================
    // Dados Memorizados e Permissões
    // ========================================================================

    const engineers = useMemo(() => allUsers.filter(u => u.level === USER_LEVELS.ENGINEER), [allUsers, USER_LEVELS.ENGINEER]);
    const possibleAssignees = useMemo(() => allUsers.filter(u => u.level !== USER_LEVELS.ADMIN), [allUsers, USER_LEVELS.ADMIN]);

    const permissions = useMemo(() => {
        if (!user || !aircraft) return { canEditDetails: false, canCreateItems: false, canReopenTasks: false, isAdmin: false };
        const isAdmin = user.level === USER_LEVELS.ADMIN;
        const isAssociatedEngineer = aircraft.associatedEngineers.includes(user.id);
        const canEdit = isAdmin || isAssociatedEngineer;
        return { canEditDetails: canEdit, canCreateItems: canEdit, canReopenTasks: canEdit, isAdmin };
    }, [user, aircraft, USER_LEVELS]);

    // ========================================================================
    // Efeito de Carregamento de Dados
    // ========================================================================

    useEffect(() => {
        const loadData = async () => {
            if (!id) { setError("ID da Aeronave não fornecido."); return; }
            try {
                const [foundAircraft, tasks, parts, tests, users] = await Promise.all([
                    getAircraftById(id),
                    getTasksByAircraftId(id),
                    getPartsByAircraftId(id),
                    getTestsByAircraftId(id),
                    getAllUsers()
                ]);
                if (foundAircraft) {
                    setAircraft(foundAircraft);
                    setEditData(foundAircraft);
                    setTasksList(tasks);
                    setPartsList(parts);
                    setTestsList(tests);
                    setAllUsers(users);
                } else {
                    setError(`Aeronave com ID ${id} não encontrada.`);
                }
            } catch (err) {
                setError('Erro ao carregar dados.');
            }
        };
        loadData();
    }, [id]);

    // ========================================================================
    // Handlers: Detalhes da Aeronave
    // ========================================================================

    const handleSaveDetails = async (e: FormEvent) => {
        e.preventDefault();
        if (!id || !permissions.canEditDetails) return;
        const updatedAircraft = await updateAircraftDetails(id, editData);
        if (updatedAircraft) {
            setAircraft(updatedAircraft);
            setEditData(updatedAircraft);
            setIsEditing(false);
        }
    };

    const handleDetailsInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setEditData(prev => ({ ...prev, [name]: value }));
    };

    // ========================================================================
    // Handlers: Tarefas
    // ========================================================================

    const handleCreateTask = async (e: FormEvent) => {
        e.preventDefault();
        if (!newTaskForm.description || !id || !user) return;
        const addedTask = await createNewTask(id, newTaskForm.description, newTaskForm.responsibleUserIds, newTaskForm.dueDate, user.id);
        setTasksList(prev => [...prev, addedTask]);
        setIsTaskModalOpen(false);
        setNewTaskForm({ description: '', responsibleUserIds: [], dueDate: new Date().toISOString().split('T')[0] });
    };

    const handleOpenEditTaskModal = (task: Task) => {
        setEditingTask(task);
        setIsEditTaskModalOpen(true);
    };

    const handleUpdateTask = async (taskId: number, data: Partial<Task>) => {
        const updatedTask = await updateTask(taskId, data);
        if (updatedTask) setTasksList(prev => prev.map(t => (t.id === taskId ? updatedTask : t)));
        setIsEditTaskModalOpen(false);
    };

    const handleDeleteTask = async (taskId: number, taskDescription: string) => {
        if (window.confirm(`Tem certeza que deseja excluir a tarefa "${taskDescription}"?`)) {
            const success = await deleteTask(taskId);
            if (success) setTasksList(prev => prev.filter(t => t.id !== taskId));
        }
    };

    const handleUpdateTaskStatus = async (task: Task) => {
        let newStatus: TaskStatus | null = null;
        switch (task.status) {
            case 'Pendente': newStatus = 'Em Andamento'; break;
            case 'Em Andamento': newStatus = 'Concluída'; break;
            case 'Concluída':
                if (!permissions.canReopenTasks) { alert("Apenas Engenheiros/Administradores podem reabrir tarefas."); return; }
                newStatus = 'Em Andamento';
                break;
        }
        if (newStatus) {
            const updatedTask = await updateTaskStatus(task.id, newStatus);
            if (updatedTask) setTasksList(prev => prev.map(t => (t.id === task.id ? updatedTask : t)));
        }
    };

    // ========================================================================
    // Handlers: Peças
    // ========================================================================

    const handleAddPart = async (partData: NewPartData) => {
        if (!id) return;
        const addedPart = await addPart(id, partData);
        setPartsList(prev => [...prev, addedPart]);
        setIsPartModalOpen(false);
    };

    const handleOpenEditPartModal = (part: Part) => {
        setEditingPart(part);
        setIsEditPartModalOpen(true);
    };

    const handleUpdatePart = async (partId: number, data: Partial<Part>) => {
        const updatedPart = await updatePart(partId, data);
        if (updatedPart) setPartsList(prev => prev.map(p => p.id === partId ? updatedPart : p));
        setIsEditPartModalOpen(false);
    };

    const handleUpdatePartStatus = async (partId: number, newStatus: PartStatus) => {
        const updatedPart = await updatePartMockStatus(partId, newStatus);
        if (updatedPart) setPartsList(prev => prev.map(p => (p.id === partId ? updatedPart : p)));
    };

    const handleDeletePart = async (partId: number, partName: string) => {
        if (window.confirm(`Tem certeza que deseja excluir a peça "${partName}"?`)) {
            const success = await deletePart(partId);
            if (success) setPartsList(prev => prev.filter(p => p.id !== partId));
        }
    };

    // ========================================================================
    // Handlers: Testes e Relatório
    // ========================================================================

    const handleRecordTest = async (testData: NewTestData) => {
        if (!id) return;
        const addedTest = await recordNewTest(id, testData);
        setTestsList(prev => [...prev, addedTest]);
        setIsTestModalOpen(false);
    };

    const handleGenerateReport = () => {
        if (!aircraft) return;
        const reportText = generateAircraftReport(aircraft, tasksList, partsList, testsList);
        const blob = new Blob([reportText], { type: 'text/plain;charset=utf-8' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `Relatorio_Aeronave_${aircraft.id}.txt`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // ========================================================================
    // Funções Auxiliares de Renderização
    // ========================================================================

    const getTaskActionProps = (task: Task) => {
        if (!user) return { text: '', disabled: true };
        const isResponsible = task.responsibleUserIds.includes(user.id) || task.responsibleUserIds.length === 0;
        let text = '', disabled = user.level === 'operador' && !isResponsible;
        switch (task.status) {
            case 'Pendente': text = 'Iniciar'; break;
            case 'Em Andamento': text = 'Finalizar'; break;
            case 'Concluída': text = 'Reabrir'; if (!permissions.canReopenTasks) disabled = true; break;
        }
        return { text, disabled };
    };

    // ========================================================================
    // Renderização Principal
    // ========================================================================

    if (error) return <div className={pageStyles.container}><h2>Erro</h2><p>{error}</p></div>;
    if (!aircraft || !user) return <div className={pageStyles.container}>Carregando...</div>;

    const associatedNames = engineers.filter(eng => aircraft.associatedEngineers.includes(eng.id)).map(eng => eng.name).join(', ') || 'Nenhum';

    return (
        <div className={pageStyles.container}>
            <header className={pageStyles.header}>
                <h1>✈️ Detalhes: {aircraft.model} ({aircraft.id})</h1>
                <button onClick={() => navigate('/aeronaves')} className={pageStyles.actionButton} style={{ backgroundColor: '#6c757d' }}>Voltar</button>
            </header>

            <div className={pageStyles.permissionBar}>
                <span>{permissions.canEditDetails ? '✅ Você pode editar este projeto.' : '🔒 Acesso apenas para visualização.'}</span>
                {permissions.canEditDetails &&
                    <div>
                        <button onClick={handleGenerateReport} className={pageStyles.actionButton} style={{ backgroundColor: '#17a2b8', marginRight: '10px' }}>Gerar Relatório</button>
                        <button onClick={() => setIsEditing(true)} className={pageStyles.actionButton} style={{ backgroundColor: '#17a2b8', marginRight: '10px' }} disabled={isEditing}>Habilitar Edição</button>
                    </div>
                }
            </div>

            <main className={pageStyles.detailsGrid}>
                <section className={pageStyles.card}>
                    <h2>Informações Principais</h2>
                    <p><strong>Modelo:</strong> {aircraft.model}</p>
                    <p><strong>Status:</strong> <span className={pageStyles.statusBadge}>{aircraft.status}</span></p>
                    <p><strong>Engenheiros:</strong> {associatedNames}</p>
                </section>
                {isEditing &&
                    <form onSubmit={handleSaveDetails} className={pageStyles.editForm}>
                        <h2>✏️ Editar Detalhes</h2>
                        <label className={pageStyles.label}>Modelo:</label>
                        <input name="model" value={editData.model || ''} onChange={handleDetailsInputChange} className={pageStyles.input} />
                        <div className={modalStyles.modalActions}>
                            <button type="button" onClick={() => setIsEditing(false)}>Cancelar</button>
                            <button type="submit">Salvar</button>
                        </div>
                    </form>
                }
            </main>

            <section className={pageStyles.tasksSection}>
                <div className={pageStyles.tasksHeader}>
                    <h2>📋 Tarefas ({tasksList.length})</h2>
                    {permissions.canCreateItems && <button onClick={() => setIsTaskModalOpen(true)} className={pageStyles.actionButton}>+ Adicionar Tarefa</button>}
                </div>
                <table className={pageStyles.taskTable}>
                    <thead><tr><th>ID</th><th>Descrição</th><th>Responsáveis</th><th>Prazo</th><th>Status</th><th>Ações</th></tr></thead>
                    <tbody>
                        {tasksList.map(task => {
                            const { text, disabled } = getTaskActionProps(task);
                            return (
                                <tr key={task.id}>
                                    <td>{task.id}</td><td>{task.description}</td><td>{task.responsibleUserNames.join(', ') || 'N/A'}</td><td>{task.dueDate}</td>
                                    <td className={`${pageStyles.td} ${pageStyles[task.status.replace(/ /g, '')]}`}>{task.status}</td>
                                    <td className={pageStyles.td}>
                                        <div className={pageStyles.actionsCell}>
                                            <button onClick={() => handleUpdateTaskStatus(task)} className={pageStyles.taskActionButton} disabled={disabled}>{text}</button>
                                            {permissions.canEditDetails && <>
                                                <button onClick={() => handleOpenEditTaskModal(task)} className={pageStyles.editButton}>Editar</button>
                                                <button onClick={() => handleDeleteTask(task.id, task.description)} className={pageStyles.deleteButton}>Excluir</button>
                                            </>}
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </section>

            <section className={pageStyles.tasksSection}>
                <div className={pageStyles.tasksHeader}>
                    <h2>🔩 Peças ({partsList.length})</h2>
                    {permissions.canCreateItems && <button onClick={() => setIsPartModalOpen(true)} className={pageStyles.actionButton}>+ Adicionar Peça</button>}
                </div>
                <PartsList parts={partsList} canManage={permissions.canEditDetails} onUpdateStatus={handleUpdatePartStatus} onDeletePart={handleDeletePart} onOpenEditModal={handleOpenEditPartModal} />
            </section>

            <section className={pageStyles.tasksSection}>
                <div className={pageStyles.tasksHeader}>
                    <h2>🔬 Testes ({testsList.length})</h2>
                    {permissions.canCreateItems && <button onClick={() => setIsTestModalOpen(true)} className={pageStyles.actionButton}>+ Registrar Teste</button>}
                </div>
                <TestsList tests={testsList} />
            </section>

            {isTaskModalOpen &&
                <div className={modalStyles.modalOverlay}>
                    <form onSubmit={handleCreateTask} className={modalStyles.modalContent}>
                        <h3>Criar Nova Tarefa</h3>
                        <label className={modalStyles.label}>Descrição:</label>
                        <input name="description" value={newTaskForm.description} onChange={e => setNewTaskForm(p => ({ ...p, description: e.target.value }))} className={modalStyles.input} />
                        <label className={modalStyles.label}>Responsáveis:</label>
                        <select multiple value={newTaskForm.responsibleUserIds.map(String)} onChange={e => setNewTaskForm(p => ({ ...p, responsibleUserIds: Array.from(e.target.selectedOptions, opt => Number(opt.value)) }))} className={modalStyles.input} style={{ minHeight: '120px' }}>
                            {possibleAssignees.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                        </select>
                        <label className={modalStyles.label}>Prazo:</label>
                        <input name="dueDate" type="date" value={newTaskForm.dueDate} onChange={e => setNewTaskForm(p => ({ ...p, dueDate: e.target.value }))} className={modalStyles.input} />
                        <div className={modalStyles.modalActions}>
                            <button type="button" onClick={() => setIsTaskModalOpen(false)}>Cancelar</button>
                            <button type="submit">Criar</button>
                        </div>
                    </form>
                </div>
            }
            <EditTaskModal isOpen={isEditTaskModalOpen} onClose={() => setIsEditTaskModalOpen(false)} onSubmit={handleUpdateTask} task={editingTask} possibleAssignees={possibleAssignees} />
            <AddPartModal isOpen={isPartModalOpen} onClose={() => setIsPartModalOpen(false)} onSubmit={handleAddPart} />
            <RecordTestModal isOpen={isTestModalOpen} onClose={() => setIsTestModalOpen(false)} onSubmit={handleRecordTest} />
            <EditPartModal isOpen={isEditPartModalOpen} onClose={() => setIsEditPartModalOpen(false)} onSubmit={handleUpdatePart} part={editingPart} />
        </div>
    );
}

export default AircraftDetailPage;