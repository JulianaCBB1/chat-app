import type { Message, MessageStatus } from '../types';

export interface ChatState {
  messages: Message[];
  streamId: string | null;
  isStreaming: boolean;
}

export type ChatAction =
  | { type: 'ADD_MESSAGE'; payload: Message }
  | { type: 'APPEND_WORD'; id: string; word: string }
  | { type: 'SET_STATUS'; id: string; status: MessageStatus }
  | { type: 'SET_STREAM_ID'; streamId: string | null };

export const initialState: ChatState = {
  messages: [],
  streamId: null,
  isStreaming: false,
};

export function chatReducer(state: ChatState, action: ChatAction): ChatState {
  switch (action.type) {
    case 'ADD_MESSAGE':
      return { ...state, messages: [...state.messages, action.payload] };

    case 'APPEND_WORD':
      return {
        ...state,
        messages: state.messages.map((m) =>
          m.id === action.id
            ? {
                ...m,
                content:
                  m.content.length === 0
                    ? action.word
                    : m.content + ' ' + action.word,
              }
            : m
        ),
      };

    case 'SET_STATUS':
      return {
        ...state,
        isStreaming: action.status === 'streaming',
        messages: state.messages.map((m) =>
          m.id === action.id ? { ...m, status: action.status } : m
        ),
      };

    case 'SET_STREAM_ID':
      return { ...state, streamId: action.streamId };

    default:
      return state;
  }
}
