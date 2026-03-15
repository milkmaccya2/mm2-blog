declare global {
  interface Window {
    dataLayer: Record<string, unknown>[];
  }
}

function pushEvent(data: Record<string, unknown>) {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(data);
}

export function trackChatQuestion(text: string) {
  pushEvent({
    event: 'chat_question',
    chat_question_text: text.slice(0, 100),
  });
}
