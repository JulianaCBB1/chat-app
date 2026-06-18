export default function TypingIndicator() {
  return (
    <div className="flex items-center gap-1 px-1 py-1">
      <span className="h-2 w-2 rounded-full bg-maya-purple opacity-60 animate-bounce [animation-delay:-0.3s]" />
      <span className="h-2 w-2 rounded-full bg-maya-purple opacity-60 animate-bounce [animation-delay:-0.15s]" />
      <span className="h-2 w-2 rounded-full bg-maya-purple opacity-60 animate-bounce" />
    </div>
  );
}
