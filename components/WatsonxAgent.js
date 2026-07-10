'use client';

import ChatWindow from './ChatWindow';

export default function WatsonxAgent() {
  return (
    <div style={{ width: '100%', height: '100%', minHeight: 660 }}>
      <ChatWindow isFloating={false} />
    </div>
  );
}
