import { ASSISTANT_MESSAGES } from '../data/messages';

const WORD_INTERVAL_MS = 60;

export type StreamEvent =
  | { type: 'init'; streamId: string }
  | { type: 'word'; data: string }
  | { type: 'done' }
  | { type: 'stopped' };

export interface StreamTransport {
  send: (event: StreamEvent) => void;
  close: () => void;
}

interface Stream {
  interval: NodeJS.Timeout | null;
  transport: StreamTransport;
  words: string[];
  wordIndex: number;
}

class StreamService {
  private streams = new Map<string, Stream>();
  private streamCount = 0;

  create(transport: StreamTransport): string {
    const streamId = crypto.randomUUID();
    const message =
      ASSISTANT_MESSAGES[this.streamCount % ASSISTANT_MESSAGES.length];
    this.streamCount++;

    const stream: Stream = {
      interval: null,
      transport,
      words: message.trim().split(/\s+/),
      wordIndex: 0,
    };

    this.streams.set(streamId, stream);
    transport.send({ type: 'init', streamId });
    this.startStream(streamId);

    return streamId;
  }

  stop(streamId: string): boolean {
    const stream = this.streams.get(streamId);
    if (!stream) return false;

    this.pauseStream(stream);
    stream.transport.send({ type: 'stopped' });

    return true;
  }

  resume(streamId: string): boolean {
    const stream = this.streams.get(streamId);
    if (!stream) return false;
    if (stream.interval) return false;

    this.startStream(streamId);

    return true;
  }

  cleanup(streamId: string): void {
    const stream = this.streams.get(streamId);
    if (!stream) return;

    this.pauseStream(stream);
    stream.transport.close();
    this.streams.delete(streamId);
  }

  private startStream(streamId: string): void {
    const stream = this.streams.get(streamId);
    if (!stream) return;

    stream.interval = setInterval(() => {
      if (stream.wordIndex < stream.words.length) {
        stream.transport.send({
          type: 'word',
          data: stream.words[stream.wordIndex],
        });
        stream.wordIndex++;
      } else {
        stream.transport.send({ type: 'done' });
        this.cleanup(streamId);
      }
    }, WORD_INTERVAL_MS);
  }

  private pauseStream(stream: Stream): void {
    if (stream.interval) {
      clearInterval(stream.interval);
      stream.interval = null;
    }
  }
}

export default new StreamService();
