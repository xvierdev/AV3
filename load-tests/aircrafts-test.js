import http from 'k6/http';
import { check, sleep } from 'k6';
import { Trend } from 'k6/metrics';

// -----------------------------------------------------------
// 1. Definição da Métrica Personalizada (Tempo de Processamento)
// -----------------------------------------------------------
const processingTime = new Trend('tempo_de_processamento_ms');

// Endereço base da sua API (ajuste se necessário)
const API_URL = 'http://localhost:3000/api/aircrafts';

// Duração ajustada para coleta de dados estável
const SCENARIO_DURATION = '10s'; 

// -----------------------------------------------------------
// 2. Configuração dos Cenários Otimizada
// -----------------------------------------------------------
export const options = {
    // Cenários de Load Testing
    scenarios: {
        // Cenário 1: 1 Usuário (Linha de base)
        scenario_1_user: {
            executor: 'constant-vus',
            vus: 1, 
            duration: SCENARIO_DURATION, 
            exec: 'testAircrafts', 
        },
        // Cenário 2: 5 Usuários
        scenario_5_users: {
            executor: 'constant-vus',
            vus: 5, 
            duration: SCENARIO_DURATION, 
            // Começa 1 segundo após o cenário 1 (10s) terminar
            startTime: '11s', 
            exec: 'testAircrafts',
        },
        // Cenário 3: 10 Usuários
        scenario_10_users: {
            executor: 'constant-vus',
            vus: 10, 
            duration: SCENARIO_DURATION,
            // Começa 1 segundo após o cenário 2 (21s) terminar
            startTime: '22s', 
            exec: 'testAircrafts',
        },
    },
    // Você pode manter ou remover os thresholds; eles não afetam a coleta de dados
    thresholds: {
        http_req_failed: ['rate<0.01'], 
        http_req_duration: ['p(95)<2000'], 
        tempo_de_processamento_ms: ['avg<1000'], 
    }
};

// -----------------------------------------------------------
// 3. Função de Teste Principal
// -----------------------------------------------------------
export function testAircrafts() {
    const res = http.get(API_URL);

    // 1. Verificação de Sucesso
    check(res, { 'status is 200': (r) => r.status === 200 });

    // 2. Extração do Tempo de Processamento (TP)
    const tpHeader = res.headers['X-Process-Time'];
    
    if (tpHeader) {
        const tpValue = parseFloat(tpHeader); 
        // Adiciona o TP à métrica personalizada
        processingTime.add(tpValue); 
    }

    // Pausa para simular usuário real
    sleep(1);
}