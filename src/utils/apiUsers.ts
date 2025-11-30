import { type User, type UserLevel, type UserWithoutPassword } from "../types/UserTypes";

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3000/api';

export const getAllUsers = async (): Promise<UserWithoutPassword[]> => {
    const res = await fetch(`${API_BASE}/users`);
    return res.json();
};

export const login = async (username: string, password: string): Promise<UserWithoutPassword | null> => {
    const res = await fetch(`${API_BASE}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    });
    if (res.ok) {
        return res.json();
    }
    return null;
};

export const verifyPassword = async (username: string, password: string): Promise<boolean> => {
    const res = await fetch(`${API_BASE}/verify-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    });
    if (res.ok) {
        const data = await res.json();
        return data.valid;
    }
    return false;
};

export const createNewUser = async (name: string, username: string, level: UserLevel): Promise<UserWithoutPassword> => {
    const res = await fetch(`${API_BASE}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, username, level })
    });
    return res.json();
};

export const updateUser = async (userId: number, updatedData: { name?: string; level?: UserLevel }): Promise<User | null> => {
    const res = await fetch(`${API_BASE}/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData)
    });
    if (res.ok) {
        return res.json();
    }
    return null;
};

export const updatePassword = async (userId: number, oldPassword: string, newPassword: string): Promise<boolean> => {
    const res = await fetch(`${API_BASE}/users/${userId}/password`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ oldPassword, newPassword })
    });
    return res.ok;
};

export const deleteUser = async (userId: number): Promise<boolean> => {
    const res = await fetch(`${API_BASE}/users/${userId}`, {
        method: 'DELETE'
    });
    return res.ok;
};