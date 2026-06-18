import { APP_NAME, APP_SUBTITLE } from '../../constants';

export default function ChatEmptyState() {
  return (
    <div className="flex min-h-full flex-col items-center justify-center gap-2 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-maya-purple">
        <span className="text-lg font-bold text-white">{APP_NAME[0]}</span>
      </div>
      <p className="text-sm font-medium text-gray-700">
        Hi, I'm {APP_NAME}. How can I help you today?
      </p>
      <p className="text-xs text-gray-400">{APP_SUBTITLE}</p>
    </div>
  );
}
