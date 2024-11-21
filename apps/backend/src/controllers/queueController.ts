import { Request, Response } from 'express';
import { actionsQueueService } from '../main';
import { ACTION_TYPES } from '../services/constants';

export function addAction(req: Request, res: Response) {
  const action = req.body.action;

  if (!action || typeof action !== 'string' || !ACTION_TYPES.includes(action)) {
    return res.status(400).send({ message: 'Bad request' });
  }

  actionsQueueService.enqueue(action);

  res.status(200).json({});
}

export function getState(_req: Request, res: Response) {
  return res.json({
    actions: actionsQueueService.getActions(),
    credits: actionsQueueService.getCredits(),
  });
}
