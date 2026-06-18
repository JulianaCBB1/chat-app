export type MessageRole = 'user' | 'assistant';

export type MessageStatus = 'complete' | 'streaming' | 'stopped' | 'error';

export interface Message {
  id: string;
  role: MessageRole;
  content: string;
  status: MessageStatus;
}
