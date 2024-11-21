import express from 'express';
import cors from 'cors';
import QueueService from './services/QueueService';
import actionsRouter from './routes/actionsRouter';
import stateRouter from './routes/stateRouter';

const host = process.env.HOST ?? 'localhost';
const port = process.env.PORT ? Number(process.env.PORT) : 3000;

const app = express();

const corsOptions = {
  origin: ['http://localhost:4200'],
};

app.use(express.json());
app.use(cors(corsOptions));

export const actionsQueueService = new QueueService();

setInterval(() => {
  try {
    actionsQueueService.shift();
  } catch (error) {
    // eslint-disable-next-line no-console
  }
}, 15 * 1000);

setInterval(() => {
  actionsQueueService.recalculateCredits();
}, 10 * 60 * 1000);

app.use('/actions', actionsRouter);
app.use('/state', stateRouter);

app.listen(port, host, () => {
  console.log(`[ ready ] http://${host}:${port}`);
});
