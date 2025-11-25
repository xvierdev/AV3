import type { Aircraft, AircraftWithPermission, NewAircraftData } from '../types/AircraftTypes';
import type { User } from '../types/UserTypes';

const API_BASE = 'http://localhost:3001/api';

export const getAllAircrafts = async (): Promise<Aircraft[]> => {
    const res = await fetch(`${API_BASE}/aircrafts`);
    return res.json();
};

export const getAircraftById = async (id: string): Promise<Aircraft | undefined> => {
    const res = await fetch(`${API_BASE}/aircrafts/${id}`);
    if (res.ok) return res.json();
    return undefined;
};

export const getAircraftsForUser = async (user: User): Promise<AircraftWithPermission[]> => {
    const aircrafts = await getAllAircrafts();
    const isAdmin = user.level === 'administrador';
    const isEngineer = user.level === 'engenheiro';

    return aircrafts.map(aircraft => {
        let canEdit = false;
        if (isAdmin) {
            canEdit = true;
        } else if (isEngineer) {
            const engineers = aircraft.associatedEngineers;
            canEdit = engineers.includes(user.id);
        }
        return { ...aircraft, canEdit };
    });
};

export const addAircraft = async (aircraftData: NewAircraftData, creatorId: number): Promise<Aircraft> => {
    const res = await fetch(`${API_BASE}/aircrafts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...aircraftData, creatorId })
    });
    return res.json();
};

export const updateAircraftDetails = async (id: string, updatedData: Partial<Aircraft>): Promise<Aircraft | undefined> => {
    const res = await fetch(`${API_BASE}/aircrafts/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData)
    });
    if (res.ok) return res.json();
    return undefined;
};