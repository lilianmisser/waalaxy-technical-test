import express from 'express';
import { ACTION_TYPES, QueueService } from './services/QueueService';
import cors from 'cors';

const host = process.env.HOST ?? 'localhost';
const port = process.env.PORT ? Number(process.env.PORT) : 3000;

const app = express();

const corsOptions = {
  origin: ['http://localhost:4200'],
};

app.use(express.json());
app.use(cors(corsOptions));

const actionsQueue = new QueueService();

setInterval(() => {
  try {
    actionsQueue.shift();
  } catch (error) {
    // eslint-disable-next-line no-console
  }
}, 15 * 1000);

setInterval(() => {
  actionsQueue.recalculateCredits();
}, 10 * 60 * 1000);

app.post('/actions', (req, res) => {
  const action = req.body.action;

  if (!action || typeof action !== 'string' || !ACTION_TYPES.includes(action)) {
    return res.status(400).send({ message: 'Bad request' });
  }

  actionsQueue.enqueue(action);

  res.status(200).json({});
});

app.get('/state', (_req, res) => {
  return res.json({
    actions: actionsQueue.getActions(),
    credits: actionsQueue.getCredits(),
  });
});

app.listen(port, host, () => {
  console.log(`[ ready ] http://${host}:${port}`);
});
