interface Props {
  isStreaming: boolean;
  canSend: boolean;
  onSend: () => void;
  onStop: () => void;
}

export default function ChatInputSendButton({
  isStreaming,
  canSend,
  onSend,
  onStop,
}: Props) {
  if (isStreaming) {
    return (
      <button
        onClick={onStop}
        aria-label="Stop"
        className="mb-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-red-500 transition-colors hover:bg-red-600 active:scale-95"
      >
        <span className="h-3 w-3 rounded-sm bg-white" />
      </button>
    );
  }

  return (
    <button
      onClick={onSend}
      disabled={!canSend}
      aria-label="Send"
      className="mb-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-maya-purple transition-colors hover:bg-maya-purple-dark active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
    >
      <svg
        className="h-4 w-4 -rotate-45 text-white"
        fill="none"
        stroke="currentColor"
        strokeWidth={2.5}
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.269 20.876L5.999 12zm0 0h7.5"
        />
      </svg>
    </button>
  );
}
