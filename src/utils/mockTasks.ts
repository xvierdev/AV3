import { type Task, type TaskStatus } from '../types/TaskTypes';
import { getAllUsers } from './mockUsers';

// ========================================================================
// Dados Mockados (Simulação de Banco de Dados)
// ========================================================================

const mockTasksData: Task[] = [
    {
        id: 101,
        aircraftId: 'A-123',
        description: 'Verificação da fuselagem principal',
        responsibleUserIds: [3],
        responsibleUserNames: ['Operador de Montagem'],
        dueDate: '2025-11-15',
        status: 'Pendente',
        creationDate: '2025-10-28',
        completionDate: null,
    },
    {
        id: 102,
        aircraftId: 'A-123',
        description: 'Instalação do sistema elétrico',
        responsibleUserIds: [2, 4],
        responsibleUserNames: ['Engenheiro Chefe', 'Joana Silva'],
        dueDate: '2025-11-30',
        status: 'Em Andamento',
        creationDate: '2025-10-25',
        completionDate: null,
    },
    {
        id: 103,
        aircraftId: 'B-456',
        description: 'Inspeção de qualidade do trem de pouso',
        responsibleUserIds: [],
        responsibleUserNames: [],
        dueDate: '2025-11-10',
        status: 'Concluída',
        creationDate: '2025-10-20',
        completionDate: '2025-11-05',
    },
    {
        id: 104,
        aircraftId: 'C-789',
        description: 'Montagem da cabine de comando',
        responsibleUserIds: [5, 6],
        responsibleUserNames: ['Carlos Mendes', 'Ana Paula Santos'],
        dueDate: '2025-12-05',
        status: 'Pendente',
        creationDate: '2025-11-01',
        completionDate: null,
    },
    {
        id: 105,
        aircraftId: 'D-234',
        description: 'Instalação dos motores CFM56',
        responsibleUserIds: [2, 8],
        responsibleUserNames: ['Engenheiro Chefe', 'Fernanda Costa'],
        dueDate: '2025-12-15',
        status: 'Em Andamento',
        creationDate: '2025-10-30',
        completionDate: null,
    },
    {
        id: 106,
        aircraftId: 'E-567',
        description: 'Configuração do sistema de entretenimento',
        responsibleUserIds: [4],
        responsibleUserNames: ['Joana Silva'],
        dueDate: '2025-11-25',
        status: 'Pendente',
        creationDate: '2025-11-05',
        completionDate: null,
    },
    {
        id: 107,
        aircraftId: 'F-890',
        description: 'Teste de pressurização da cabine',
        responsibleUserIds: [7],
        responsibleUserNames: ['Roberto Lima'],
        dueDate: '2025-12-01',
        status: 'Concluída',
        creationDate: '2025-10-15',
        completionDate: '2025-11-20',
    },
    {
        id: 108,
        aircraftId: 'G-345',
        description: 'Instalação do sistema de combustível',
        responsibleUserIds: [5, 9],
        responsibleUserNames: ['Carlos Mendes', 'Marcos Oliveira'],
        dueDate: '2025-12-10',
        status: 'Pendente',
        creationDate: '2025-11-10',
        completionDate: null,
    },
    {
        id: 109,
        aircraftId: 'H-678',
        description: 'Verificação final dos sistemas aviônicos',
        responsibleUserIds: [2, 4, 8],
        responsibleUserNames: ['Engenheiro Chefe', 'Joana Silva', 'Fernanda Costa'],
        dueDate: '2025-12-20',
        status: 'Em Andamento',
        creationDate: '2025-11-01',
        completionDate: null,
    },
    {
        id: 110,
        aircraftId: 'A-123',
        description: 'Pintura externa da aeronave',
        responsibleUserIds: [3, 6],
        responsibleUserNames: ['Operador de Montagem', 'Ana Paula Santos'],
        dueDate: '2025-11-28',
        status: 'Pendente',
        creationDate: '2025-11-15',
        completionDate: null,
    },
    {
        id: 111,
        aircraftId: 'B-456',
        description: 'Calibração dos instrumentos de voo',
        responsibleUserIds: [4],
        responsibleUserNames: ['Joana Silva'],
        dueDate: '2025-11-18',
        status: 'Concluída',
        creationDate: '2025-10-25',
        completionDate: '2025-11-12',
    },
    {
        id: 112,
        aircraftId: 'C-789',
        description: 'Instalação das luzes de navegação',
        responsibleUserIds: [7],
        responsibleUserNames: ['Roberto Lima'],
        dueDate: '2025-12-08',
        status: 'Pendente',
        creationDate: '2025-11-20',
        completionDate: null,
    },
    {
        id: 113,
        aircraftId: 'D-234',
        description: 'Teste de resistência estrutural',
        responsibleUserIds: [5, 8],
        responsibleUserNames: ['Carlos Mendes', 'Fernanda Costa'],
        dueDate: '2025-12-25',
        status: 'Em Andamento',
        creationDate: '2025-11-05',
        completionDate: null,
    },
    {
        id: 114,
        aircraftId: 'E-567',
        description: 'Montagem do trem de pouso dianteiro',
        responsibleUserIds: [9],
        responsibleUserNames: ['Marcos Oliveira'],
        dueDate: '2025-11-30',
        status: 'Pendente',
        creationDate: '2025-11-12',
        completionDate: null,
    },
    {
        id: 115,
        aircraftId: 'F-890',
        description: 'Instalação do sistema anti-gelo',
        responsibleUserIds: [2],
        responsibleUserNames: ['Engenheiro Chefe'],
        dueDate: '2025-12-12',
        status: 'Pendente',
        creationDate: '2025-11-18',
        completionDate: null,
    },
    {
        id: 116,
        aircraftId: 'G-345',
        description: 'Configuração do autopilot',
        responsibleUserIds: [4, 6],
        responsibleUserNames: ['Joana Silva', 'Ana Paula Santos'],
        dueDate: '2025-12-05',
        status: 'Em Andamento',
        creationDate: '2025-11-08',
        completionDate: null,
    },
    {
        id: 117,
        aircraftId: 'H-678',
        description: 'Teste de performance dos motores',
        responsibleUserIds: [5, 7],
        responsibleUserNames: ['Carlos Mendes', 'Roberto Lima'],
        dueDate: '2025-12-18',
        status: 'Pendente',
        creationDate: '2025-11-22',
        completionDate: null,
    },
    {
        id: 118,
        aircraftId: 'A-123',
        description: 'Instalação dos flaps',
        responsibleUserIds: [3, 9],
        responsibleUserNames: ['Operador de Montagem', 'Marcos Oliveira'],
        dueDate: '2025-12-02',
        status: 'Concluída',
        creationDate: '2025-10-28',
        completionDate: '2025-11-25',
    },
    {
        id: 119,
        aircraftId: 'B-456',
        description: 'Verificação do sistema de oxigênio',
        responsibleUserIds: [8],
        responsibleUserNames: ['Fernanda Costa'],
        dueDate: '2025-11-22',
        status: 'Pendente',
        creationDate: '2025-11-14',
        completionDate: null,
    },
    {
        id: 120,
        aircraftId: 'C-789',
        description: 'Calibração do altímetro',
        responsibleUserIds: [6],
        responsibleUserNames: ['Ana Paula Santos'],
        dueDate: '2025-12-15',
        status: 'Em Andamento',
        creationDate: '2025-11-25',
        completionDate: null,
    }
];

// ========================================================================
// Funções de Leitura (Getters)
// ========================================================================

/**
 * Retorna todas as tarefas cadastradas no sistema.
 */
export const getAllTasks = (): Task[] => {
    return mockTasksData;
};

/**
 * 💡 FUNÇÃO CORRIGIDA: Retorna todas as tarefas de uma aeronave específica.
 */
export const getTasksByAircraftId = (aircraftId: string): Task[] => {
    return mockTasksData.filter(task => task.aircraftId === aircraftId);
};

// ========================================================================
// Funções de Criação e Atualização
// ========================================================================

/**
 * Cria uma nova tarefa e a adiciona à lista de dados.
 */
export const createNewTask = (aircraftId: string, description: string, responsibleUserIds: number[], dueDate: string): Task => {
    const allUsers = getAllUsers();
    const responsibleUserNames = allUsers.filter(u => responsibleUserIds.includes(u.id)).map(u => u.name);
    const newId = Math.max(...mockTasksData.map(t => t.id), 0) + 1;

    const newTask: Task = {
        id: newId, aircraftId, description, responsibleUserIds, responsibleUserNames, dueDate,
        status: 'Pendente', creationDate: new Date().toISOString().split('T')[0], completionDate: null,
    };
    mockTasksData.push(newTask);
    return newTask;
};

/**
 * 💡 FUNÇÃO CORRIGIDA: Atualiza o status de uma tarefa e a data de conclusão.
 */
export const updateTaskStatus = (taskId: number, newStatus: TaskStatus): Task | undefined => {
    const taskIndex = mockTasksData.findIndex(t => t.id === taskId);
    if (taskIndex !== -1) {
        const task = mockTasksData[taskIndex];
        task.status = newStatus;
        task.completionDate = (newStatus === 'Concluída') ? new Date().toISOString().split('T')[0] : null;
        return { ...task };
    }
    return undefined;
};

/**
 * Atualiza os dados de uma tarefa (descrição, prazo, responsáveis).
 */
export const updateTask = (taskId: number, updatedData: Partial<Pick<Task, 'description' | 'dueDate' | 'responsibleUserIds'>>): Task | null => {
    const taskIndex = mockTasksData.findIndex(t => t.id === taskId);
    if (taskIndex === -1) return null;

    const task = mockTasksData[taskIndex];
    Object.assign(task, updatedData);

    if (updatedData.responsibleUserIds) {
        const allUsers = getAllUsers();
        task.responsibleUserNames = allUsers.filter(u => updatedData.responsibleUserIds!.includes(u.id)).map(u => u.name);
    }

    return { ...task };
};

// ========================================================================
// Funções de Exclusão
// ========================================================================

/**
 * Deleta uma tarefa do sistema.
 */
export const deleteTask = (taskId: number): boolean => {
    const taskIndex = mockTasksData.findIndex(t => t.id === taskId);
    if (taskIndex !== -1) {
        mockTasksData.splice(taskIndex, 1);
        return true;
    }
    return false;
};