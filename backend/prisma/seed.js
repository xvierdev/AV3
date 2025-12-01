const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const prisma = new PrismaClient();

async function main() {
  // Check if data already exists
  const userCount = await prisma.user.count();
  if (userCount > 0) {
    console.log('Database already seeded');
    return;
  }

  const defaultPassword = '123';
  const hashedPassword = await bcrypt.hash(defaultPassword, saltRounds);

  // Seed Users
  const users = [
    {
      id: 1,
      name: 'Admin Master',
      username: 'admin',
      password: hashedPassword,
      level: 'administrador',
      levelName: 'Administrador',
      associatedAircrafts: JSON.stringify([])
    },
    {
      id: 2,
      name: 'Engenheiro Chefe',
      username: 'eng',
      password: hashedPassword,
      level: 'engenheiro',
      levelName: 'Engenheiro',
      associatedAircrafts: JSON.stringify([1, 2])
    },
    {
      id: 3,
      name: 'Operador de Montagem',
      username: 'op',
      password: hashedPassword,
      level: 'operador',
      levelName: 'Operador',
      associatedAircrafts: JSON.stringify([])
    },
    {
      id: 4,
      name: 'Joana Silva',
      username: 'joana',
      password: hashedPassword,
      level: 'engenheiro',
      levelName: 'Engenheiro',
      associatedAircrafts: JSON.stringify([3])
    },
    {
      id: 5,
      name: 'Carlos Mendes',
      username: 'carlos',
      password: hashedPassword,
      level: 'engenheiro',
      levelName: 'Engenheiro',
      associatedAircrafts: JSON.stringify([4, 8])
    },
    {
      id: 6,
      name: 'Ana Paula Santos',
      username: 'ana',
      password: hashedPassword,
      level: 'operador',
      levelName: 'Operador',
      associatedAircrafts: JSON.stringify([1])
    },
    {
      id: 7,
      name: 'Roberto Lima',
      username: 'roberto',
      password: hashedPassword,
      level: 'operador',
      levelName: 'Operador',
      associatedAircrafts: JSON.stringify([2, 7])
    },
    {
      id: 8,
      name: 'Fernanda Costa',
      username: 'fernanda',
      password: hashedPassword,
      level: 'engenheiro',
      levelName: 'Engenheiro',
      associatedAircrafts: JSON.stringify([5, 6])
    },
    {
      id: 9,
      name: 'Marcos Oliveira',
      username: 'marcos',
      password: hashedPassword,
      level: 'operador',
      levelName: 'Operador',
      associatedAircrafts: JSON.stringify([3, 4])
    }
  ];

  for (const user of users) {
    await prisma.user.create({ data: user });
  }

  // Seed Aircrafts
  const aircrafts = [
    {
      id: 1,
      model: 'Airbus A320 Neo',
      type: 'Comercial',
      capacity: 180,
      range: 6300,
      clientName: 'Azul Linhas Aéreas',
      deliveryDeadline: '2026-05-15',
      status: 'Em Produção (Fase 3/6)',
      associatedEngineers: JSON.stringify([2]),
      createdBy: 1
    },
    {
      id: 2,
      model: 'F-35 Lightning II',
      type: 'Militar',
      capacity: 1,
      range: 2200,
      clientName: 'Força Aérea Brasileira',
      deliveryDeadline: '2025-12-01',
      status: 'Testes Finais',
      associatedEngineers: JSON.stringify([2]),
      createdBy: 1
    },
    {
      id: 3,
      model: 'Embraer E-195 E2',
      type: 'Comercial',
      capacity: 146,
      range: 4800,
      clientName: 'TAP Air Portugal',
      deliveryDeadline: '2027-01-20',
      status: 'Pré-produção',
      associatedEngineers: JSON.stringify([4]),
      createdBy: 1
    },
    {
      id: 4,
      model: 'Boeing 737 MAX 8',
      type: 'Comercial',
      capacity: 162,
      range: 6570,
      clientName: 'Gol Linhas Aéreas',
      deliveryDeadline: '2026-08-10',
      status: 'Em Produção (Fase 1/6)',
      associatedEngineers: JSON.stringify([2, 4]),
      createdBy: 1
    },
    {
      id: 5,
      model: 'Cessna Citation X+',
      type: 'Executivo',
      capacity: 12,
      range: 5300,
      clientName: 'Empresa XYZ Ltda',
      deliveryDeadline: '2026-03-25',
      status: 'Pré-produção',
      associatedEngineers: JSON.stringify([4]),
      createdBy: 1
    },
    {
      id: 6,
      model: 'Bombardier Challenger 350',
      type: 'Executivo',
      capacity: 10,
      range: 6400,
      clientName: 'Corporação ABC',
      deliveryDeadline: '2026-11-15',
      status: 'Em Produção (Fase 3/6)',
      associatedEngineers: JSON.stringify([2]),
      createdBy: 1
    },
    {
      id: 7,
      model: 'Embraer Phenom 300',
      type: 'Executivo',
      capacity: 8,
      range: 3650,
      clientName: 'Indústria DEF S.A.',
      deliveryDeadline: '2027-02-28',
      status: 'Testes Finais',
      associatedEngineers: JSON.stringify([4]),
      createdBy: 1
    },
    {
      id: 8,
      model: 'Airbus A350-900',
      type: 'Comercial',
      capacity: 325,
      range: 16100,
      clientName: 'LATAM Airlines',
      deliveryDeadline: '2026-07-05',
      status: 'Em Produção (Fase 1/6)',
      associatedEngineers: JSON.stringify([2, 4]),
      createdBy: 1
    }
  ];

  for (const aircraft of aircrafts) {
    await prisma.aircraft.create({ data: aircraft });
  }

  // Seed Tasks
  const tasks = [
    {
      aircraftId: 1,
      description: 'Verificação da fuselagem principal',
      status: 'Pendente',
      responsibleUserIds: [3],
      dueDate: '2025-12-01',
      creationDate: '2025-10-28',
      completionDate: null,
      creatorId: 1,
    },
    {
      aircraftId: 1,
      description: 'Instalação do sistema elétrico',
      status: 'Em Andamento',
      responsibleUserIds: [2],
      dueDate: '2025-11-20',
      creationDate: '2025-10-25',
      completionDate: null,
      creatorId: 1,
    },
    {
      aircraftId: 2,
      description: 'Inspeção de qualidade do trem de pouso',
      status: 'Concluída',
      responsibleUserIds: [1],
      dueDate: '2025-09-15',
      creationDate: '2025-08-30',
      completionDate: '2025-09-14',
      creatorId: 1,
    },
    {
      aircraftId: 3,
      description: 'Montagem da cabine de comando',
      status: 'Pendente',
      responsibleUserIds: [5],
      dueDate: '2026-02-10',
      creationDate: '2025-11-01',
      completionDate: null,
      creatorId: 1,
    },
  ];

  for (const task of tasks) {
    await prisma.task.create({
      data: {
        ...task,
        responsibleUserIds: JSON.stringify(task.responsibleUserIds),
      },
    });
  }

  // Seed Parts
  const parts = [
    { id: 6, aircraftId: 1, name: 'Painel de Controle Garmin', type: 'Importada', supplier: 'Garmin Aviation', status: 'Em Produção' },
    { id: 7, aircraftId: 2, name: 'Sistema de Armamento Lockheed', type: 'Importada', supplier: 'Lockheed Martin', status: 'Pronta para Uso' },
    { id: 8, aircraftId: 3, name: 'Motores IAE V2500', type: 'Importada', supplier: 'International Aero Engines', status: 'Em Transporte' },
    { id: 9, aircraftId: 4, name: 'Trem de Pouso Messier-Bugatti', type: 'Importada', supplier: 'Safran Landing Systems', status: 'Em Produção' },
    { id: 10, aircraftId: 5, name: 'Interior Premium Acme', type: 'Nacional', supplier: 'Acme Interiors Brasil', status: 'Pronta para Uso' },
    { id: 11, aircraftId: 6, name: 'Sistema Hidráulico Parker', type: 'Importada', supplier: 'Parker Aerospace', status: 'Em Transporte' },
    { id: 12, aircraftId: 7, name: 'Painéis Solares Embraer', type: 'Nacional', supplier: 'Embraer Energia', status: 'Pronta para Uso' },
    { id: 13, aircraftId: 8, name: 'Motores Rolls-Royce Trent XWB', type: 'Importada', supplier: 'Rolls-Royce', status: 'Em Produção' },
    { id: 14, aircraftId: 1, name: 'Asas Compósitas Hexcel', type: 'Importada', supplier: 'Hexcel Corporation', status: 'Pronta para Uso' },
    { id: 15, aircraftId: 2, name: 'Radar AESA Raytheon', type: 'Importada', supplier: 'Raytheon Technologies', status: 'Em Transporte' }
  ];

  for (const part of parts) {
    await prisma.part.create({ data: part });
  }

  console.log('Database seeded successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });