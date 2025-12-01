import type { Part, PartStatus, NewPartData } from '../types/PartTypes';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3000/api';

export const getPartsByAircraftId = async (aircraftId: number): Promise<Part[]> => {
    const res = await fetch(`${API_BASE}/parts/aircraft/${aircraftId}`);
    return res.json();
};

export const addPart = async (aircraftId: number, partData: NewPartData): Promise<Part> => {
    const res = await fetch(`${API_BASE}/parts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ aircraftId, ...partData })
    });
    return res.json();
};

export const updatePartStatus = async (partId: number, newStatus: PartStatus): Promise<Part | null> => {
    const res = await fetch(`${API_BASE}/parts/${partId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
    });
    if (res.ok) return res.json();
    return null;
};

export const deletePart = async (partId: number): Promise<boolean> => {
    const res = await fetch(`${API_BASE}/parts/${partId}`, {
        method: 'DELETE'
    });
    return res.ok;
};

export const updatePart = async (partId: number, updatedData: Partial<Omit<Part, 'id' | 'aircraftId'>>): Promise<Part | null> => {
    const res = await fetch(`${API_BASE}/parts/${partId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData)
    });
    if (res.ok) return res.json();
    return null;
};