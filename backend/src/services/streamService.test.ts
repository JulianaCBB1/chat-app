import type { StreamEvent, StreamTransport } from './streamService';
import streamService from './streamService';

const createMockTransport = (): {
  transport: StreamTransport;
  events: StreamEvent[];
  closed: boolean;
} => {
  const events: StreamEvent[] = [];
  let closed = false;

  return {
    transport: {
      send: (event) => events.push(event),
      close: () => {
        closed = true;
      },
    },
    events,
    get closed() {
      return closed;
    },
  };
};

describe('StreamService', () => {
  describe('create', () => {
    it('returns a valid UUID streamId', () => {
      const { transport } = createMockTransport();
      const streamId = streamService.create(transport);
      expect(streamId).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
      );
      streamService.cleanup(streamId);
    });

    it('sends init event with streamId immediately', () => {
      const { transport, events } = createMockTransport();
      const streamId = streamService.create(transport);
      expect(events[0]).toEqual({ type: 'init', streamId });
      streamService.cleanup(streamId);
    });

    it('starts streaming words after init', (done) => {
      const { transport, events } = createMockTransport();
      const streamId = streamService.create(transport);

      setTimeout(() => {
        const wordEvents = events.filter((e) => e.type === 'word');
        expect(wordEvents.length).toBeGreaterThan(0);
        streamService.cleanup(streamId);
        done();
      }, 200);
    });
  });

  describe('stop', () => {
    it('returns false for unknown streamId', () => {
      expect(streamService.stop('unknown-id')).toBe(false);
    });

    it('returns true for a valid streamId', () => {
      const { transport } = createMockTransport();
      const streamId = streamService.create(transport);
      expect(streamService.stop(streamId)).toBe(true);
      streamService.cleanup(streamId);
    });

    it('sends stopped event', () => {
      const { transport, events } = createMockTransport();
      const streamId = streamService.create(transport);
      streamService.stop(streamId);
      expect(events).toContainEqual({ type: 'stopped' });
      streamService.cleanup(streamId);
    });

    it('preserves wordIndex so resume can continue from same position', (done) => {
      const { transport, events } = createMockTransport();
      const streamId = streamService.create(transport);

      setTimeout(() => {
        const wordsBefore = events.filter((e) => e.type === 'word').length;
        streamService.stop(streamId);

        setTimeout(() => {
          const wordsAfter = events.filter((e) => e.type === 'word').length;
          expect(wordsAfter).toBe(wordsBefore);
          streamService.cleanup(streamId);
          done();
        }, 200);
      }, 200);
    });
  });

  describe('resume', () => {
    it('returns false for unknown streamId', () => {
      expect(streamService.resume('unknown-id')).toBe(false);
    });

    it('returns false if stream is already active', () => {
      const { transport } = createMockTransport();
      const streamId = streamService.create(transport);
      expect(streamService.resume(streamId)).toBe(false);
      streamService.cleanup(streamId);
    });

    it('returns true after stop', () => {
      const { transport } = createMockTransport();
      const streamId = streamService.create(transport);
      streamService.stop(streamId);
      expect(streamService.resume(streamId)).toBe(true);
      streamService.cleanup(streamId);
    });

    it('continues streaming words after resume', (done) => {
      const { transport, events } = createMockTransport();
      const streamId = streamService.create(transport);

      setTimeout(() => {
        const wordsBefore = events.filter((e) => e.type === 'word').length;
        streamService.stop(streamId);

        streamService.resume(streamId);

        setTimeout(() => {
          const wordsAfter = events.filter((e) => e.type === 'word').length;
          expect(wordsAfter).toBeGreaterThan(wordsBefore);
          streamService.cleanup(streamId);
          done();
        }, 200);
      }, 200);
    });
  });

  describe('cleanup', () => {
    it('calls close on transport', () => {
      const mock = createMockTransport();
      const streamId = streamService.create(mock.transport);
      streamService.cleanup(streamId);
      expect(mock.closed).toBe(true);
    });

    it('removes stream so subsequent stop returns false', () => {
      const { transport } = createMockTransport();
      const streamId = streamService.create(transport);
      streamService.cleanup(streamId);
      expect(streamService.stop(streamId)).toBe(false);
    });

    it('calling twice does not throw', () => {
      const { transport } = createMockTransport();
      const streamId = streamService.create(transport);
      streamService.cleanup(streamId);
      expect(() => streamService.cleanup(streamId)).not.toThrow();
    });
  });
});
