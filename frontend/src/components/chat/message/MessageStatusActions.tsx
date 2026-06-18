import type { Message } from '../../../types';

interface Props {
  message: Message;
  isActiveAssistant: boolean;
  onResume?: () => void;
  onRetry?: () => void;
}

export default function MessageStatusActions({
  message,
  isActiveAssistant,
  onResume,
  onRetry,
}: Props) {
  if (message.status === 'stopped') {
    return (
      <div className="flex items-center gap-2 pl-1">
        <span className="text-xs text-gray-400">Stopped</span>
        {isActiveAssistant && onResume && (
          <button
            onClick={onResume}
            className="min-h-[44px] min-w-[44px] px-2 py-1 text-xs font-medium text-maya-purple hover:underline"
          >
            Resume
          </button>
        )}
      </div>
    );
  }

  if (message.status === 'error') {
    return (
      <div className="flex items-center gap-2 pl-1">
        <span className="text-xs text-red-400">Connection lost</span>
        {onRetry && (
          <button
            onClick={onRetry}
            className="min-h-[44px] min-w-[44px] px-2 py-1 text-xs font-medium text-maya-purple hover:underline"
          >
            Retry
          </button>
        )}
      </div>
    );
  }

  return null;
}
