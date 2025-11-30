import type { Test, NewTestData } from '../types/TestTypes';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3000/api';

export const getTestsByAircraftId = async (aircraftId: string): Promise<Test[]> => {
    const res = await fetch(`${API_BASE}/tests/aircraft/${aircraftId}`);
    return res.json();
};

export const recordNewTest = async (aircraftId: string, testData: NewTestData): Promise<Test> => {
    const res = await fetch(`${API_BASE}/tests`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ aircraftId, ...testData })
    });
    return res.json();
};