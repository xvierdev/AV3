import { type Task, type TaskStatus } from '../types/TaskTypes';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3000/api';

export const getAllTasks = async (): Promise<Task[]> => {
    const res = await fetch(`${API_BASE}/tasks`);
    return res.json();
};

export const getTasksByAircraftId = async (aircraftId: number): Promise<Task[]> => {
    const res = await fetch(`${API_BASE}/tasks/aircraft/${aircraftId}`);
    return res.json();
};

export const createNewTask = async (aircraftId: number, description: string, responsibleUserIds: number[], dueDate: string, creatorId: number): Promise<Task> => {
    const res = await fetch(`${API_BASE}/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ aircraftId, description, responsibleUserIds, dueDate, creatorId })
    });
    return res.json();
};

export const updateTaskStatus = async (taskId: number, newStatus: TaskStatus): Promise<Task | undefined> => {
    const res = await fetch(`${API_BASE}/tasks/${taskId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
    });
    if (res.ok) return res.json();
    return undefined;
};

export const updateTask = async (taskId: number, updatedData: Partial<Pick<Task, 'description' | 'dueDate' | 'responsibleUserIds'>>): Promise<Task | null> => {
    const res = await fetch(`${API_BASE}/tasks/${taskId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData)
    });
    if (res.ok) return res.json();
    return null;
};

export const deleteTask = async (taskId: number): Promise<boolean> => {
    const res = await fetch(`${API_BASE}/tasks/${taskId}`, {
        method: 'DELETE'
    });
    return res.ok;
};