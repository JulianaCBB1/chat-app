import type { Message } from '../../../types';
import TypingIndicator from './TypingIndicator';

interface Props {
  message: Message;
}

export default function MessageBubbleContent({ message }: Props) {
  const isUser = message.role === 'user';
  const isWaitingForFirstWord =
    !isUser && message.content.length === 0 && message.status === 'streaming';
  const isStopped = message.status === 'stopped';

  return (
    <div
      className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${
        isUser
          ? 'rounded-tr-sm bg-maya-purple text-white'
          : `rounded-tl-sm bg-white text-gray-800 shadow-sm ring-1 ${
              isStopped ? 'ring-gray-300 opacity-75' : 'ring-gray-100'
            }`
      }`}
    >
      {isWaitingForFirstWord ? (
        <TypingIndicator />
      ) : (
        <p className="whitespace-pre-wrap break-words">{message.content}</p>
      )}
    </div>
  );
}
