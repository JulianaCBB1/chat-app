import { memo } from 'react';
import { APP_NAME } from '../../../constants';
import type { Message } from '../../../types';
import MessageBubbleContent from './MessageBubbleContent';
import MessageStatusActions from './MessageStatusActions';

interface Props {
  message: Message;
  isActiveAssistant: boolean;
  onResume?: () => void;
  onRetry?: () => void;
}

function MessageBubble({
  message,
  isActiveAssistant,
  onResume,
  onRetry,
}: Props) {
  const isUser = message.role === 'user';

  return (
    <div className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && (
        <div className="mr-2 mt-1 self-start flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-maya-purple">
          <span className="text-xs font-semibold text-white">
            {APP_NAME[0]}
          </span>
        </div>
      )}

      <div className="flex max-w-[85%] flex-col gap-1 md:max-w-[70%]">
        <MessageBubbleContent message={message} />
        <MessageStatusActions
          message={message}
          isActiveAssistant={isActiveAssistant}
          onResume={onResume}
          onRetry={onRetry}
        />
      </div>
    </div>
  );
}

export default memo(MessageBubble);
