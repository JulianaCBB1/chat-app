import { Request, Response, Router } from 'express';
import streamService, { StreamEvent } from '../services/streamService';

const router = Router();

const setSSEHeaders = (res: Response): void => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.flushHeaders();
};

router.get('/', (req: Request, res: Response) => {
  const userMessage = (req.query.message as string)?.trim();

  if (!userMessage) {
    res.status(400).json({ error: 'message query param is required' });
    return;
  }

  setSSEHeaders(res);

  const streamId = streamService.create({
    send: (event: StreamEvent) =>
      res.write(`data: ${JSON.stringify(event)}\n\n`),
    close: () => res.end(),
  });

  req.on('close', () => streamService.cleanup(streamId));
});

router.post('/:streamId/stop', (req: Request, res: Response) => {
  const stopped = streamService.stop(req.params.streamId);

  if (!stopped) {
    res.status(404).json({ error: 'stream not found' });
    return;
  }

  res.json({ stopped: true });
});

router.post('/:streamId/resume', (req: Request, res: Response) => {
  const resumed = streamService.resume(req.params.streamId);

  if (!resumed) {
    res.status(404).json({ error: 'stream not found or already streaming' });
    return;
  }

  res.json({ resumed: true });
});

export default router;
