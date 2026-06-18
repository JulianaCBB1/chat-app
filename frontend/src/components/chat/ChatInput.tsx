import { memo, useRef, useState } from 'react';
import { APP_NAME } from '../../constants';
import ChatInputSendButton from './ChatInputSendButton';
import ChatInputTextarea, {
  type ChatInputTextareaHandle,
} from './ChatInputTextarea';

interface Props {
  onSend: (message: string) => void;
  onStop: () => void;
  isStreaming: boolean;
}

function ChatInput({ onSend, onStop, isStreaming }: Props) {
  const textareaRef = useRef<ChatInputTextareaHandle>(null);
  const [canSend, setCanSend] = useState(false);

  const handleSend = () => {
    if (isStreaming) return;
    if (!textareaRef.current) return;
    const value = textareaRef.current.getValue();
    if (!value) return;
    textareaRef.current.clear();
    setCanSend(false);
    onSend(value);
  };

  const handleInput = () => {
    const value = textareaRef.current?.getValue() ?? '';
    setCanSend(value.length > 0);
  };

  return (
    <div className="border-t border-gray-100 bg-white px-4 py-3 pb-[max(12px,env(safe-area-inset-bottom))]">
      <div className="flex items-end gap-2 rounded-2xl bg-gray-50 px-4 py-2 ring-1 ring-gray-200 focus-within:ring-2 focus-within:ring-maya-purple">
        <ChatInputTextarea
          ref={textareaRef}
          onSend={handleSend}
          onInput={handleInput}
          disabled={isStreaming}
        />
        <ChatInputSendButton
          isStreaming={isStreaming}
          canSend={canSend}
          onSend={handleSend}
          onStop={onStop}
        />
      </div>
      <p className="mt-2 text-center text-xs text-gray-300">
        Powered by {APP_NAME}
      </p>
    </div>
  );
}

export default memo(ChatInput);
