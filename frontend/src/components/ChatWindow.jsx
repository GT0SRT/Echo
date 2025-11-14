
import useChatStore from "../store/chatStore";

export default function ChatWindow() {
  const messages = useChatStore((s) => s.messages);

  return (
    <div className="p-4 h-[300px] overflow-y-auto bg-gray-900 border border-gray-700 rounded-lg">
      {messages.map((msg, i) => (
        <div key={i} className="mb-3">
          <div className="text-sm text-gray-500">{msg.sender}</div>
          <div className="text-white text-lg">{msg.text}</div>
        </div>
      ))}
    </div>
  );
}
