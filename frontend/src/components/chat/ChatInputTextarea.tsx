import {
  forwardRef,
  type KeyboardEvent,
  useImperativeHandle,
  useRef,
} from 'react';

interface Props {
  onSend: () => void;
  onInput: () => void;
  disabled: boolean;
}

export interface ChatInputTextareaHandle {
  getValue: () => string;
  clear: () => void;
  focus: () => void;
}

const ChatInputTextarea = forwardRef<ChatInputTextareaHandle, Props>(
  ({ onSend, onInput, disabled }, ref) => {
    const inputRef = useRef<HTMLTextAreaElement>(null);

    useImperativeHandle(ref, () => ({
      getValue: () => inputRef.current?.value.trim() ?? '',
      clear: () => {
        if (!inputRef.current) return;
        inputRef.current.value = '';
        inputRef.current.style.height = 'auto';
      },
      focus: () => inputRef.current?.focus(),
    }));

    const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        onSend();
      }
    };

    const handleInput = () => {
      if (!inputRef.current) return;
      inputRef.current.style.height = 'auto';
      inputRef.current.style.height = `${Math.min(inputRef.current.scrollHeight, 160)}px`;
    };

    return (
      <textarea
        ref={inputRef}
        rows={1}
        placeholder="Ask me anything..."
        onKeyDown={handleKeyDown}
        onInput={() => {
          handleInput();
          onInput();
        }}
        className={`flex-1 resize-none bg-transparent py-1.5 text-sm text-gray-800 placeholder-gray-400 outline-none transition-opacity ${
          disabled ? 'cursor-not-allowed opacity-50' : ''
        }`}
      />
    );
  }
);

ChatInputTextarea.displayName = 'ChatInputTextarea';

export default ChatInputTextarea;
