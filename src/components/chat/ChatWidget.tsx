import { useState } from 'react';
import ChatWindow from './ChatWindow';

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {isOpen && <ChatWindow onClose={() => setIsOpen(false)} />}

      {!isOpen && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="fixed bottom-4 right-4 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-2xl text-white shadow-lg transition-transform hover:scale-110"
          aria-label="チャットを開く"
        >
          💬
        </button>
      )}
    </>
  );
}
