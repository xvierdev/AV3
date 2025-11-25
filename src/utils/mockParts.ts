import type { Part, PartStatus, NewPartData } from '../types/PartTypes';


// ========================================================================
// Dados Mockados (Simulação de Banco de Dados)
// ========================================================================

// Variável para gerar IDs únicos para novas peças.
let nextPartId = 16;

const mockPartsData: Part[] = [
    // Peças para a Aeronave A320-001
    { id: 1, aircraftId: 'A320-001', name: 'Motor Esquerdo PW1100G', type: 'Importada', supplier: 'Pratt & Whitney', status: 'Pronta para Uso' },
    { id: 2, aircraftId: 'A320-001', name: 'Sistema de Navegação Honeywell', type: 'Importada', supplier: 'Honeywell', status: 'Em Transporte' },
    { id: 3, aircraftId: 'A320-001', name: 'Assentos Recaro SL3710', type: 'Nacional', supplier: 'Recaro Brasil', status: 'Em Produção' },

    // Peças para a Aeronave E195-002
    { id: 4, aircraftId: 'E195-002', name: 'Aviônicos Thales', type: 'Importada', supplier: 'Thales Group', status: 'Pronta para Uso' },
    { id: 5, aircraftId: 'E195-002', name: 'Estrutura da Fuselagem', type: 'Nacional', supplier: 'Embraer Aeroestruturas', status: 'Pronta para Uso' },

    // Peças adicionais aleatórias
    { id: 6, aircraftId: 'A-123', name: 'Painel de Controle Garmin', type: 'Importada', supplier: 'Garmin Aviation', status: 'Em Produção' },
    { id: 7, aircraftId: 'B-456', name: 'Sistema de Armamento Lockheed', type: 'Importada', supplier: 'Lockheed Martin', status: 'Pronta para Uso' },
    { id: 8, aircraftId: 'C-789', name: 'Motores IAE V2500', type: 'Importada', supplier: 'International Aero Engines', status: 'Em Transporte' },
    { id: 9, aircraftId: 'D-234', name: 'Trem de Pouso Messier-Bugatti', type: 'Importada', supplier: 'Safran Landing Systems', status: 'Em Produção' },
    { id: 10, aircraftId: 'E-567', name: 'Interior Premium Acme', type: 'Nacional', supplier: 'Acme Interiors Brasil', status: 'Pronta para Uso' },
    { id: 11, aircraftId: 'F-890', name: 'Sistema Hidráulico Parker', type: 'Importada', supplier: 'Parker Aerospace', status: 'Em Transporte' },
    { id: 12, aircraftId: 'G-345', name: 'Painéis Solares Embraer', type: 'Nacional', supplier: 'Embraer Energia', status: 'Pronta para Uso' },
    { id: 13, aircraftId: 'H-678', name: 'Motores Rolls-Royce Trent XWB', type: 'Importada', supplier: 'Rolls-Royce', status: 'Em Produção' },
    { id: 14, aircraftId: 'A-123', name: 'Asas Compósitas Hexcel', type: 'Importada', supplier: 'Hexcel Corporation', status: 'Pronta para Uso' },
    { id: 15, aircraftId: 'B-456', name: 'Radar AESA Raytheon', type: 'Importada', supplier: 'Raytheon Technologies', status: 'Em Transporte' }
];

// ========================================================================
// Funções de Acesso e Manipulação de Dados
// ========================================================================

/**
 * Retorna todas as peças associadas a um ID de aeronave específico.
 */
export const getPartsByAircraftId = (aircraftId: string): Part[] => {
    return mockPartsData.filter(part => part.aircraftId === aircraftId);
};

/**
 * Adiciona uma nova peça à lista de dados da aeronave correspondente.
 */
export const addPart = (aircraftId: string, partData: NewPartData): Part => {
    const newPart: Part = {
        id: nextPartId++,
        aircraftId,
        ...partData,
    };
    mockPartsData.push(newPart);
    console.log('Peça adicionada:', newPart);
    return newPart;
};

/**
 * Atualiza o status de uma peça específica com base no seu ID.
 */
export const updatePartStatus = (partId: number, newStatus: PartStatus): Part | null => {
    const partIndex = mockPartsData.findIndex(p => p.id === partId);
    if (partIndex !== -1) {
        mockPartsData[partIndex].status = newStatus;
        return { ...mockPartsData[partIndex] };
    }
    return null;
};

/**
 * Deleta uma peça do sistema com base no seu ID.
 * @param partId - O ID da peça a ser deletada.
 * @returns true se a exclusão foi bem-sucedida, false caso contrário.
 */
export const deletePart = (partId: number): boolean => {
    const partIndex = mockPartsData.findIndex(p => p.id === partId);

    if (partIndex !== -1) {
        mockPartsData.splice(partIndex, 1);
        console.log(`Peça com ID ${partId} deletada.`);
        return true;
    }

    console.error(`Peça com ID ${partId} não encontrada para exclusão.`);
    return false;
};

/**
 * Atualiza os dados de uma peça existente (nome, fornecedor, tipo).
 * @param partId - O ID da peça a ser atualizada.
 * @param updatedData - Um objeto parcial com os novos dados.
 * @returns A peça atualizada ou null se não for encontrada.
 */
export const updatePart = (partId: number, updatedData: Partial<Omit<Part, 'id' | 'aircraftId'>>): Part | null => {
    const partIndex = mockPartsData.findIndex(p => p.id === partId);

    if (partIndex !== -1) {
        // Mescla os dados antigos com os novos dados fornecidos
        const part = mockPartsData[partIndex];
        Object.assign(part, updatedData);

        console.log(`Peça com ID ${partId} atualizada.`);
        return { ...part }; // Retorna uma cópia da peça atualizada
    }

    console.error(`Peça com ID ${partId} não encontrada para atualização.`);
    return null;
};