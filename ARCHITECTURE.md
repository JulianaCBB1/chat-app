# Architecture

## Transport choice

The app uses Server-Sent Events (SSE) rather than WebSockets. SSE is a one-way HTTP stream where the server pushes data and the client listens. The assistant (backend )is always the one speaking, and the client (frontend) only needs to send control signals (stop, resume), not continuous data bidirectionally (in which case WebSockets would be appropriate).

## Message flow

When the user sends a message:

1. The frontend adds the user message to the chat immediately and adds an empty assistant placeholder with a typing indicator.
2. It opens an `EventSource` connection to `GET /stream?message=...`.
3. The server creates a stream, assigns it a UUID, and sends an `init` event with the stream ID back to the client.
4. The server starts a 60ms interval that sends one word at a time as `word` events.
5. The client appends each word to the assistant bubble as it arrives.
6. When all words have been sent, the server sends a `done` event and closes the connection.

The server cycles through all available responses in order, going back to the first after the tenth.

## Stop and resume

When the user clicks stop:

1. The frontend POSTs to `POST /stream/:streamId/stop`.
2. The server clears the interval but keeps the stream object in memory, including the current `wordIndex`.
3. The server sends a `stopped` event. The frontend marks the message as stopped but keeps the `EventSource` connection open.
4. When the user clicks resume, the frontend POSTs to `POST /stream/:streamId/resume`.
5. The server restarts the interval from the saved `wordIndex`, so streaming continues from the exact word it stopped at.
6. The `EventSource` connection was kept open, so no reconnection is needed — the words simply start arriving again.

The stream stays in memory until it finishes naturally, the client disconnects, or a new message is sent. If the client disconnects (page reload, tab close), `req.on('close')` fires and the server calls `cleanup()`, which clears the interval and removes the stream.

## Service layer

The backend separates transport from logic. The `StreamService` class has no knowledge of HTTP or SSE. It accepts a `StreamTransport` object with two callbacks:

```ts
interface StreamTransport {
  send: (event: StreamEvent) => void;
  close: () => void;
}
```

The route wires these up to the Express response object:

```ts
streamService.create({
  send: (event) => res.write(`data: ${JSON.stringify(event)}\n\n`),
  close: () => res.end(),
});
```

This means the service could be adapted to WebSockets or any other transport without changing its internal logic.

## Frontend state

The frontend uses `useReducer` with a `chatReducer` function. State lives in a single `ChatState` object:

```ts
interface ChatState {
  messages: Message[];
  streamId: string | null;
  activeAssistantId: string | null;
  isStreaming: boolean;
}
```

All SSE logic lives in the `useChat` hook. Components receive state and callbacks as props, so they have no direct knowledge of the stream. The `App` component is the only that calls `useChat` and passes the results down.

Word appending is handled by an `APPEND_WORD` reducer action that targets a message by ID. Because `MessageBubble` is wrapped in `React.memo`, only the bubble that changed re-renders on each word, not the entire list.

## Failure cases

**Network drop mid-stream** — `EventSource.onerror` fires. The frontend closes the connection, marks the assistant message as `error`, and shows a retry button. Retry opens a new `EventSource`, which starts a fresh stream into the same message bubble.

**Stop before init event arrives** — the stop button is disabled until the `init` event has been received and `streamId` is known. This prevents a race condition where the client tries to stop a stream before the server has assigned it an ID.

**Rapid sends** — if the user sends a second message before the first stream completes, `sendMessage` calls `closeEventSource()` first, which terminates the existing connection and clears `streamIdRef`. The previous assistant message is left in whatever state it was in.

**Page reload** — the `EventSource` closes, `req.on('close')` fires on the server and cleans up the stream. The conversation history is not persisted, so the chat resets on reload.
