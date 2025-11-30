const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const { PrismaClient, Prisma } = require('@prisma/client');
require('dotenv').config();

const dbHost = process.env.DB_HOST || 'localhost';
const dbPort = process.env.DB_PORT || '3306';
const dbUser = process.env.DB_USER || 'aluno';
const dbPass = process.env.DB_PASS || 'fatec';
const dbName = process.env.DB_NAME || 'aerocode';
process.env.DATABASE_URL = `mysql://${dbUser}:${dbPass}@${dbHost}:${dbPort}/${dbName}`;

const prisma = new PrismaClient();
const app = express();
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || 'localhost';
const saltRounds = 10;

app.use(cors());
app.use(express.json());

// Middleware de Instrumentação (Medição do Tempo de Processamento)
app.use((req, res, next) => {
  // Início da medição com alta precisão (em nanosegundos)
  const start = process.hrtime.bigint(); 

  // 1. Armazena o método original de envio de resposta
  const originalSend = res.send;

  // 2. Sobrescreve res.send com nossa função de interceptação
  res.send = function (body) {
    // 3. O cronômetro para no momento em que a rota decide enviar a resposta
    const end = process.hrtime.bigint();
    const durationNs = end - start;
    const durationMs = Number(durationNs) / 1000000;
    
    // 4. Define o cabeçalho X-Process-Time ANTES de chamar o método original
    // toFixed(6) para precisão máxima
    res.setHeader('X-Process-Time', durationMs.toFixed(6)); 
    
    // 5. Chama o método original res.send() para enviar a resposta ao cliente
    originalSend.call(this, body);
  };

  // Continua para a lógica da rota
  next();
});

const LEVEL_LABEL = {
  administrador: 'Administrador',
  engenheiro: 'Engenheiro',
  operador: 'Operador',
};

const ADMIN_MASTER_ID = 1;
const ADMIN_MASTER_USERNAME = 'admin';

const today = () => new Date().toISOString().split('T')[0];

const parseArrayField = (value) => {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    return [];
  }
};

const serializeArrayField = (value = []) => JSON.stringify(Array.isArray(value) ? value : []);

const formatUser = (user) => ({
  id: user.id,
  name: user.name,
  username: user.username,
  level: user.level,
  levelName: user.levelName,
  associatedAircrafts: parseArrayField(user.associatedAircrafts),
});

const formatAircraft = (aircraft) => ({
  ...aircraft,
  associatedEngineers: parseArrayField(aircraft.associatedEngineers),
});

const buildTaskResponses = async (tasks) => {
  if (!tasks.length) return [];
  const userIds = [
    ...new Set(
      tasks.flatMap((task) => parseArrayField(task.responsibleUserIds)),
    ),
  ];
  const users = userIds.length
    ? await prisma.user.findMany({ where: { id: { in: userIds } }, select: { id: true, name: true } })
    : [];
  const userMap = new Map(users.map((user) => [user.id, user.name]));

  return tasks.map((task) => {
    const responsibleUserIds = parseArrayField(task.responsibleUserIds);
    return {
      id: task.id,
      aircraftId: task.aircraftId,
      description: task.description,
      status: task.status,
      responsibleUserIds,
      responsibleUserNames: responsibleUserIds.map((id) => userMap.get(id) || 'Equipe Geral'),
      dueDate: task.dueDate,
      creationDate: task.creationDate,
      completionDate: task.completionDate,
      creatorId: task.creatorId,
    };
  });
};

const isNotFoundError = (error) =>
  error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025';

const handleServerError = (res, error) => {
  console.error(error);
  res.status(500).json({ error: 'Erro interno no servidor' });
};

app.get('/api/users', async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users.map(formatUser));
  } catch (error) {
    handleServerError(res, error);
  }
});

app.post('/api/users', async (req, res) => {
  const { name, username, level } = req.body;
  if (!name || !username || !level) {
    return res.status(400).json({ error: 'Nome, usuário e nível são obrigatórios.' });
  }

  try {
    const hashedPassword = await bcrypt.hash('123', saltRounds);
    const user = await prisma.user.create({
      data: {
        name,
        username,
        password: hashedPassword,
        level,
        levelName: LEVEL_LABEL[level] || LEVEL_LABEL.operador,
        associatedAircrafts: '[]',
      },
    });
    res.json(formatUser(user));
  } catch (error) {
    handleServerError(res, error);
  }
});

app.put('/api/users/:id', async (req, res) => {
  const { name, level } = req.body;
  const userId = Number(req.params.id);
  const data = {};
  if (name !== undefined) data.name = name;
  if (level !== undefined) {
    data.level = level;
    data.levelName = LEVEL_LABEL[level] || LEVEL_LABEL.operador;
  }

  try {
    const existingUser = await prisma.user.findUnique({ where: { id: userId } });
    if (!existingUser) {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }

    const isAdminMaster = existingUser.id === ADMIN_MASTER_ID || existingUser.username === ADMIN_MASTER_USERNAME;
    if (isAdminMaster) {
      if (level !== undefined && level !== existingUser.level) {
        return res.status(403).json({ error: 'O nível do Admin Master não pode ser alterado.' });
      }
      delete data.level;
      delete data.levelName;
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data,
    });
    res.json(formatUser(user));
  } catch (error) {
    if (isNotFoundError(error)) {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }
    handleServerError(res, error);
  }
});

app.put('/api/users/:id/password', async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  if (!oldPassword || !newPassword) {
    return res.status(400).json({ error: 'Informe a senha atual e a nova senha.' });
  }
  try {
    const user = await prisma.user.findUnique({ where: { id: Number(req.params.id) } });
    if(!user) {
      return res.status(400).json({ error: 'Usuário não encontrado.'});
    }
    const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Senha atual inválida.' });
    }
    const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedNewPassword },
    });
    res.json({ success: true });
  } catch (error) {
    handleServerError(res, error);
  }
});

app.delete('/api/users/:id', async (req, res) => {
  const userId = Number(req.params.id);
  try {
    const existingUser = await prisma.user.findUnique({ where: { id: userId } });
    if (!existingUser) {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }
    const isAdminMaster = existingUser.id === ADMIN_MASTER_ID || existingUser.username === ADMIN_MASTER_USERNAME;
    if (isAdminMaster) {
      return res.status(403).json({ error: 'O Admin Master não pode ser excluído.' });
    }
    await prisma.user.delete({ where: { id: userId } });
    res.json({ success: true });
  } catch (error) {
    if (isNotFoundError(error)) {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }
    handleServerError(res, error);
  }
});

app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Usuário e senha são obrigatórios.' });
  }
  try {
    const user = await prisma.user.findUnique({ where: { username } });
    if (!user) {
      return res.status(401).json({ error: 'Credenciais inválidas.'});
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Credenciais inválidas.' });
    }
    const { password: _, ...safeUser } = user;
    res.json(formatUser(safeUser));
  } catch (error) {
    handleServerError(res, error);
  }
});

app.post('/api/verify-password', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Usuário e senha são obrigatórios.' });
  }
  try {
    const user = await prisma.user.findUnique({ where: { username } });
    if (!user) {
      return res.json({ valid: false });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    res.json({ valid: isPasswordValid });
  } catch (error) {
    handleServerError(res, error);
  }
});

app.get('/api/aircrafts', async (req, res) => {
  try {
    const aircrafts = await prisma.aircraft.findMany();
    res.json(aircrafts.map(formatAircraft));
  } catch (error) {
    handleServerError(res, error);
  }
});

app.get('/api/aircrafts/:id', async (req, res) => {
  try {
    const aircraft = await prisma.aircraft.findUnique({ where: { id: req.params.id } });
    if (!aircraft) {
      return res.status(404).json({ error: 'Aeronave não encontrada.' });
    }
    res.json(formatAircraft(aircraft));
  } catch (error) {
    handleServerError(res, error);
  }
});

app.post('/api/aircrafts', async (req, res) => {
  const {
    model,
    type,
    capacity,
    range,
    clientName,
    deliveryDeadline,
    status,
    associatedEngineers = [],
    creatorId,
  } = req.body;

  if (!model || !type || typeof capacity !== 'number' || typeof range !== 'number' || !creatorId) {
    return res.status(400).json({ error: 'Modelo, tipo, capacidade, alcance e criador são obrigatórios.' });
  }

  try {
    const aircraft = await prisma.aircraft.create({
      data: {
        model,
        type,
        capacity,
        range,
        clientName: clientName || null,
        deliveryDeadline: deliveryDeadline || null,
        status: status || 'Pré-produção',
        associatedEngineers: serializeArrayField(associatedEngineers),
        createdBy: creatorId,
      },
    });

    res.json(formatAircraft(aircraft));
  } catch (error) {
    handleServerError(res, error);
  }
});

app.put('/api/aircrafts/:id', async (req, res) => {
  const {
    model,
    type,
    capacity,
    range,
    clientName,
    deliveryDeadline,
    status,
    associatedEngineers,
  } = req.body;

  const data = {};
  if (model !== undefined) data.model = model;
  if (type !== undefined) data.type = type;
  if (capacity !== undefined) data.capacity = capacity;
  if (range !== undefined) data.range = range;
  if (clientName !== undefined) data.clientName = clientName;
  if (deliveryDeadline !== undefined) data.deliveryDeadline = deliveryDeadline;
  if (status !== undefined) data.status = status;
  if (associatedEngineers !== undefined) {
    data.associatedEngineers = serializeArrayField(associatedEngineers);
  }

  try {
    const aircraft = await prisma.aircraft.update({
      where: { id: req.params.id },
      data,
    });
    res.json(formatAircraft(aircraft));
  } catch (error) {
    if (isNotFoundError(error)) {
      return res.status(404).json({ error: 'Aeronave não encontrada.' });
    }
    handleServerError(res, error);
  }
});

app.delete('/api/aircrafts/:id', async (req, res) => {
  try {
    await prisma.aircraft.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (error) {
    if (isNotFoundError(error)) {
      return res.status(404).json({ error: 'Aeronave não encontrada.' });
    }
    handleServerError(res, error);
  }
});

app.get('/api/tasks', async (req, res) => {
  try {
    const tasks = await prisma.task.findMany({ orderBy: { id: 'asc' } });
    const response = await buildTaskResponses(tasks);
    res.json(response);
  } catch (error) {
    handleServerError(res, error);
  }
});

app.get('/api/tasks/aircraft/:aircraftId', async (req, res) => {
  try {
    const tasks = await prisma.task.findMany({
      where: { aircraftId: req.params.aircraftId },
      orderBy: { id: 'asc' },
    });
    const response = await buildTaskResponses(tasks);
    res.json(response);
  } catch (error) {
    handleServerError(res, error);
  }
});

app.post('/api/tasks', async (req, res) => {
  const { aircraftId, description, responsibleUserIds = [], dueDate, creatorId } = req.body;
  if (!aircraftId || !description || !dueDate || !creatorId) {
    return res.status(400).json({ error: 'Aeronave, descrição, prazo e criador são obrigatórios.' });
  }

  try {
    const task = await prisma.task.create({
      data: {
        aircraftId,
        description,
        status: 'Pendente',
        responsibleUserIds: serializeArrayField(responsibleUserIds),
        dueDate,
        creationDate: today(),
        completionDate: null,
        creatorId,
      },
    });
    const [response] = await buildTaskResponses([task]);
    res.json(response);
  } catch (error) {
    handleServerError(res, error);
  }
});

app.put('/api/tasks/:id', async (req, res) => {
  const { description, responsibleUserIds, dueDate, status } = req.body;
  const data = {};
  if (description !== undefined) data.description = description;
  if (dueDate !== undefined) data.dueDate = dueDate;
  if (responsibleUserIds !== undefined) {
    data.responsibleUserIds = serializeArrayField(responsibleUserIds);
  }
  if (status !== undefined) {
    data.status = status;
    data.completionDate = status === 'Concluída' ? today() : null;
  }

  try {
    const task = await prisma.task.update({
      where: { id: Number(req.params.id) },
      data,
    });
    const [response] = await buildTaskResponses([task]);
    res.json(response);
  } catch (error) {
    if (isNotFoundError(error)) {
      return res.status(404).json({ error: 'Tarefa não encontrada.' });
    }
    handleServerError(res, error);
  }
});

app.delete('/api/tasks/:id', async (req, res) => {
  try {
    await prisma.task.delete({ where: { id: Number(req.params.id) } });
    res.json({ success: true });
  } catch (error) {
    if (isNotFoundError(error)) {
      return res.status(404).json({ error: 'Tarefa não encontrada.' });
    }
    handleServerError(res, error);
  }
});

app.get('/api/parts/aircraft/:aircraftId', async (req, res) => {
  try {
    const parts = await prisma.part.findMany({ where: { aircraftId: req.params.aircraftId } });
    res.json(parts);
  } catch (error) {
    handleServerError(res, error);
  }
});

app.post('/api/parts', async (req, res) => {
  const { aircraftId, name, supplier, type, status } = req.body;
  if (!aircraftId || !name || !supplier || !type || !status) {
    return res.status(400).json({ error: 'Todos os campos da peça são obrigatórios.' });
  }

  try {
    const part = await prisma.part.create({
      data: { aircraftId, name, supplier, type, status },
    });
    res.json(part);
  } catch (error) {
    handleServerError(res, error);
  }
});

app.put('/api/parts/:id', async (req, res) => {
  const { name, supplier, type, status } = req.body;
  const data = {};
  if (name !== undefined) data.name = name;
  if (supplier !== undefined) data.supplier = supplier;
  if (type !== undefined) data.type = type;
  if (status !== undefined) data.status = status;

  try {
    const part = await prisma.part.update({
      where: { id: Number(req.params.id) },
      data,
    });
    res.json(part);
  } catch (error) {
    if (isNotFoundError(error)) {
      return res.status(404).json({ error: 'Peça não encontrada.' });
    }
    handleServerError(res, error);
  }
});

app.delete('/api/parts/:id', async (req, res) => {
  try {
    await prisma.part.delete({ where: { id: Number(req.params.id) } });
    res.json({ success: true });
  } catch (error) {
    if (isNotFoundError(error)) {
      return res.status(404).json({ error: 'Peça não encontrada.' });
    }
    handleServerError(res, error);
  }
});

app.get('/api/tests/aircraft/:aircraftId', async (req, res) => {
  try {
    const tests = await prisma.test.findMany({ where: { aircraftId: req.params.aircraftId } });
    res.json(tests);
  } catch (error) {
    handleServerError(res, error);
  }
});

app.post('/api/tests', async (req, res) => {
  const { aircraftId, type, result, notes } = req.body;
  if (!aircraftId || !type || !result) {
    return res.status(400).json({ error: 'Aeronave, tipo e resultado são obrigatórios.' });
  }

  try {
    const test = await prisma.test.create({
      data: {
        aircraftId,
        type,
        result,
        datePerformed: today(),
        notes: notes || null,
      },
    });
    res.json(test);
  } catch (error) {
    handleServerError(res, error);
  }
});

app.listen(PORT, HOST, () => {
  console.log(`Server running on ${HOST}:${PORT}`);
});