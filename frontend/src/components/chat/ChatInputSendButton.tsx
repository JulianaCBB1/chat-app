interface Props {
  isStreaming: boolean;
  canStop: boolean;
  canSend: boolean;
  stoppedMessageId: string | null;
  onSend: () => void;
  onStop: () => void;
  onResume: () => void;
}

export default function ChatInputSendButton({
  isStreaming,
  canStop,
  canSend,
  stoppedMessageId,
  onSend,
  onStop,
  onResume,
}: Props) {
  if (isStreaming) {
    return (
      <button
        onClick={onStop}
        disabled={!canStop}
        aria-label="Stop"
        className="mb-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-red-500 transition-colors hover:bg-red-600 active:scale-95 disabled:opacity-40"
      >
        <span className="h-3 w-3 rounded-sm bg-white" />
      </button>
    );
  }

  if (stoppedMessageId && !canSend) {
    return (
      <button
        onClick={onResume}
        aria-label="Resume"
        className="mb-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-maya-purple transition-colors hover:bg-maya-purple-dark active:scale-95"
      >
        <svg
          className="h-4 w-4 text-white"
          fill="none"
          stroke="currentColor"
          strokeWidth={2.5}
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z"
          />
        </svg>
      </button>
    );
  }

  return (
    <button
      onClick={onSend}
      disabled={!canSend}
      aria-label="Send"
      className="mb-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-maya-purple transition-colors hover:bg-maya-purple-dark active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
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
