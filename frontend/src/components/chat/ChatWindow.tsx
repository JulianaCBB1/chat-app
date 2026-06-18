import { useEffect, useRef } from 'react';
import type { Message } from '../../types';
import ChatEmptyState from './ChatEmptyState';
import MessageBubble from './message/MessageBubble';

interface Props {
  messages: Message[];
  activeAssistantId: string | null;
  onResume: (messageId: string) => void;
  onRetry: (messageId: string) => void;
}

export default function ChatWindow({
  messages,
  activeAssistantId,
  onResume,
  onRetry,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const distanceFromBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight;

    if (distanceFromBottom < 100) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  return (
    <div ref={containerRef} className="flex-1 overflow-y-auto px-4 py-6">
      {messages.length === 0 ? (
        <ChatEmptyState />
      ) : (
        <div className="flex flex-col gap-4 pb-4">
          {messages.map((message) => (
            <MessageBubble
              key={message.id}
              message={message}
              isActiveAssistant={message.id === activeAssistantId}
              onResume={
                message.status === 'stopped'
                  ? () => onResume(message.id)
                  : undefined
              }
              onRetry={
                message.status === 'error'
                  ? () => onRetry(message.id)
                  : undefined
              }
            />
          ))}
        </div>
      )}
      <div ref={bottomRef} />
    </div>
  );
}
