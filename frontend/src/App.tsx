import ChatInput from './components/chat/ChatInput';
import ChatWindow from './components/chat/ChatWindow';
import { APP_NAME, APP_SUBTITLE } from './constants';

export default function App() {
  const handleSend = (message: string) => {
    console.log('send', message);
  };

  const handleStop = () => {
    console.log('stop');
  };

  const handleResume = (messageId: string) => {
    console.log('resume', messageId);
  };

  const handleRetry = (messageId: string) => {
    console.log('retry', messageId);
  };

  return (
    <div className="flex h-dvh flex-col bg-gray-50">
      <header className="flex items-center gap-3 border-b border-gray-100 bg-white px-4 py-3 shadow-sm pt-[max(12px,env(safe-area-inset-top))]">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-maya-purple">
          <span className="text-sm font-bold text-white">{APP_NAME[0]}</span>
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-800">{APP_NAME}</p>
          <p className="text-xs text-gray-400">{APP_SUBTITLE}</p>
        </div>
        <div className="ml-auto flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-green-400" />
          <span className="text-xs text-gray-400">Online</span>
        </div>
      </header>

      <ChatWindow messages={[]} onResume={handleResume} onRetry={handleRetry} />

      <ChatInput onSend={handleSend} onStop={handleStop} isStreaming={false} />
    </div>
  );
}
