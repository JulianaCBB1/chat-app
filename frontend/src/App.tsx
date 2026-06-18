import ChatHeader from './components/chat/ChatHeader';
import ChatInput from './components/chat/ChatInput';
import ChatWindow from './components/chat/ChatWindow';
import { useChat } from './hooks/useChat';

export default function App() {
  const {
    messages,
    isStreaming,
    canStop,
    stoppedMessageId,
    activeAssistantId,
    sendMessage,
    stopStream,
    resumeStream,
    retryStream,
  } = useChat();

  return (
    <div className="flex h-dvh flex-col bg-gray-50">
      <ChatHeader />

      <ChatWindow
        messages={messages}
        activeAssistantId={activeAssistantId}
        onResume={resumeStream}
        onRetry={retryStream}
      />

      <ChatInput
        onSend={sendMessage}
        onStop={stopStream}
        onResume={resumeStream}
        isStreaming={isStreaming}
        canStop={canStop}
        stoppedMessageId={stoppedMessageId}
      />
    </div>
  );
}
