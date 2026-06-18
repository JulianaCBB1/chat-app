import { useCallback, useEffect, useReducer, useRef } from 'react';
import type { Message } from '../types';
import { chatReducer, initialState } from './chatReducer';

const API_URL = import.meta.env.VITE_API_URL ?? '';

export function useChat() {
  const [state, dispatch] = useReducer(chatReducer, initialState);
  const eventSourceRef = useRef<EventSource | null>(null);
  const streamIdRef = useRef<string | null>(null);

  const closeEventSource = useCallback(() => {
    eventSourceRef.current?.close();
    eventSourceRef.current = null;
  }, []);

  const attachEventHandlers = useCallback(
    (es: EventSource, assistantId: string) => {
      es.onmessage = (e: MessageEvent) => {
        const event = JSON.parse(e.data as string);

        if (event.type === 'init') {
          streamIdRef.current = event.streamId;
          dispatch({ type: 'SET_STREAM_ID', streamId: event.streamId });
        } else if (event.type === 'word') {
          dispatch({ type: 'APPEND_WORD', id: assistantId, word: event.data });
        } else if (event.type === 'done') {
          dispatch({ type: 'SET_STATUS', id: assistantId, status: 'complete' });
          dispatch({ type: 'SET_STREAM_ID', streamId: null });
          dispatch({ type: 'SET_ACTIVE_ASSISTANT', id: null });
          streamIdRef.current = null;
          closeEventSource();
        } else if (event.type === 'stopped') {
          dispatch({ type: 'SET_STATUS', id: assistantId, status: 'stopped' });
          dispatch({ type: 'SET_STREAM_ID', streamId: null });
        }
      };

      es.onerror = () => {
        closeEventSource();
        dispatch({ type: 'SET_STATUS', id: assistantId, status: 'error' });
        dispatch({ type: 'SET_STREAM_ID', streamId: null });
        dispatch({ type: 'SET_ACTIVE_ASSISTANT', id: null });
        streamIdRef.current = null;
      };
    },
    [closeEventSource]
  );

  const sendMessage = useCallback(
    (text: string) => {
      closeEventSource();
      streamIdRef.current = null;

      const userMessage: Message = {
        id: crypto.randomUUID(),
        role: 'user',
        content: text,
        status: 'complete',
      };

      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: '',
        status: 'streaming',
      };

      const assistantId = assistantMessage.id;

      dispatch({ type: 'ADD_MESSAGE', payload: userMessage });
      dispatch({ type: 'ADD_MESSAGE', payload: assistantMessage });
      dispatch({ type: 'SET_STATUS', id: assistantId, status: 'streaming' });
      dispatch({ type: 'SET_ACTIVE_ASSISTANT', id: assistantId });

      const es = new EventSource(
        `${API_URL}/stream?message=${encodeURIComponent(text)}`
      );
      eventSourceRef.current = es;
      attachEventHandlers(es, assistantId);
    },
    [closeEventSource, attachEventHandlers]
  );

  const stopStream = useCallback(async () => {
    const streamId = streamIdRef.current;
    if (!streamId) return;

    try {
      await fetch(`${API_URL}/stream/${streamId}/stop`, { method: 'POST' });
    } catch {
      // server will clean up on disconnect anyway
    }
  }, []);

  const resumeStream = useCallback(async (messageId: string) => {
    const streamId = streamIdRef.current;
    if (!streamId) return;

    try {
      await fetch(`${API_URL}/stream/${streamId}/resume`, { method: 'POST' });
      dispatch({ type: 'SET_STATUS', id: messageId, status: 'streaming' });
      dispatch({ type: 'SET_STREAM_ID', streamId });
      dispatch({ type: 'SET_ACTIVE_ASSISTANT', id: messageId });
    } catch {
      dispatch({ type: 'SET_STATUS', id: messageId, status: 'error' });
    }
  }, []);

  const retryStream = useCallback(
    (messageId: string) => {
      closeEventSource();
      streamIdRef.current = null;

      dispatch({ type: 'RESET_MESSAGE', id: messageId });
      dispatch({ type: 'SET_ACTIVE_ASSISTANT', id: messageId });

      const es = new EventSource(`${API_URL}/stream?message=retry`);
      eventSourceRef.current = es;
      attachEventHandlers(es, messageId);
    },
    [closeEventSource, attachEventHandlers]
  );

  useEffect(() => {
    return () => closeEventSource();
  }, [closeEventSource]);

  const stoppedMessageId =
    state.activeAssistantId &&
    state.messages.find((m) => m.id === state.activeAssistantId)?.status ===
      'stopped'
      ? state.activeAssistantId
      : null;

  return {
    messages: state.messages,
    isStreaming: state.isStreaming,
    canStop: state.streamId !== null,
    stoppedMessageId,
    activeAssistantId: state.activeAssistantId,
    sendMessage,
    stopStream,
    resumeStream,
    retryStream,
  };
}
