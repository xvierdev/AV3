import type { Aircraft } from '../types/AircraftTypes';
import type { Task } from '../types/TaskTypes';
import type { Part } from '../types/PartTypes';
import type { Test } from '../types/TestTypes';

const createSection = (title: string, content: string): string => {
    const separator = '='.repeat(60);
    return `\n${separator}\n${title.toUpperCase()}\n${separator}\n${content}`;
};
export const generateAircraftReport = (
    aircraft: Aircraft,
    tasks: Task[],
    parts: Part[],
    tests: Test[]
): string => {
    const mainInfo = [
        `ID do Projeto:    ${aircraft.id}`,
        `Modelo:           ${aircraft.model}`,
        `Tipo:             ${aircraft.type}`,
        `Status Atual:     ${aircraft.status}`,
        `Cliente:          ${aircraft.clientName || 'N/A'}`,
        `Prazo de Entrega: ${aircraft.deliveryDeadline || 'Não definido'}`,
        `Capacidade:       ${aircraft.capacity} passageiros`,
        `Alcance:          ${aircraft.range} km`,
    ].join('\n');

    const tasksInfo = tasks.length > 0
        ? tasks.map(task =>
            `  - [${task.status.padEnd(12)}] #${task.id}: ${task.description} (Resp: ${task.responsibleUserNames}, Prazo: ${task.dueDate})`
        ).join('\n')
        : 'Nenhuma tarefa registrada.';

    const partsInfo = parts.length > 0
        ? parts.map(part =>
            `  - [${part.status.padEnd(15)}] ID #${part.id}: ${part.name} (Forn: ${part.supplier}, Tipo: ${part.type})`
        ).join('\n')
        : 'Nenhuma peça registrada.';

    const testsInfo = tests.length > 0
        ? tests.map(test =>
            `  - [${test.result.padEnd(9)}] ${test.datePerformed}: Teste ${test.type}. ${test.notes ? `Notas: ${test.notes}` : ''}`
        ).join('\n')
        : 'Nenhum teste registrado.';

    const reportContent = [
        createSection('Informações Gerais da Aeronave', mainInfo),
        createSection('Etapas de Produção / Tarefas', tasksInfo),
        createSection('Peças e Componentes', partsInfo),
        createSection('Histórico de Testes', testsInfo),
    ].join('\n');

    const reportHeader = `AEROCODE - Relatório de Produção\nData de Geração: ${new Date().toLocaleString('pt-BR')}`;

    return `${reportHeader}\n${reportContent}`;
};