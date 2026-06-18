import { useCallback, useEffect, useReducer, useRef } from 'react';
import type { Message } from '../types';
import { chatReducer, initialState } from './chatReducer';

export function useChat() {
  const [state, dispatch] = useReducer(chatReducer, initialState);
  const eventSourceRef = useRef<EventSource | null>(null);
  const streamIdRef = useRef<string | null>(null);

  const closeEventSource = useCallback(() => {
    eventSourceRef.current?.close();
    eventSourceRef.current = null;
  }, []);

  const sendMessage = useCallback(
    (text: string) => {
      closeEventSource();

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

      const es = new EventSource(`/stream?message=${encodeURIComponent(text)}`);
      eventSourceRef.current = es;

      es.onmessage = (e: MessageEvent) => {
        const event = JSON.parse(e.data as string);

        if (event.type === 'init') {
          streamIdRef.current = event.streamId;
          dispatch({ type: 'SET_STREAM_ID', streamId: event.streamId });
        } else if (event.type === 'word') {
          dispatch({
            type: 'APPEND_WORD',
            id: assistantId,
            word: event.data,
          });
        } else if (event.type === 'done') {
          dispatch({ type: 'SET_STATUS', id: assistantId, status: 'complete' });
          dispatch({ type: 'SET_STREAM_ID', streamId: null });
          streamIdRef.current = null;
          closeEventSource();
        } else if (event.type === 'stopped') {
          dispatch({ type: 'SET_STATUS', id: assistantId, status: 'stopped' });
          dispatch({ type: 'SET_STREAM_ID', streamId: null });
          streamIdRef.current = null;
          closeEventSource();
        }
      };

      es.onerror = () => {
        closeEventSource();
        dispatch({ type: 'SET_STATUS', id: assistantId, status: 'error' });
        dispatch({ type: 'SET_STREAM_ID', streamId: null });
        streamIdRef.current = null;
      };
    },
    [closeEventSource]
  );

  const stopStream = useCallback(async () => {
    const streamId = streamIdRef.current;
    if (!streamId) return;

    try {
      await fetch(`/stream/${streamId}/stop`, { method: 'POST' });
    } catch {
      // server will clean up on disconnect anyway
    }
  }, []);

  useEffect(() => {
    return () => closeEventSource();
  }, [closeEventSource]);

  return {
    messages: state.messages,
    isStreaming: state.isStreaming,
    canStop: state.streamId !== null,
    sendMessage,
    stopStream,
  };
}
