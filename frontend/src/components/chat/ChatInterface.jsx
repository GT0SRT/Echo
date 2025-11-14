import React, { useState, useRef, useEffect } from "react";
import MessageBubble from "./MessageBubble";
import MicBlob from "../MicBlob";

export default function ChatInterface() {
  const [messages, setMessages] = useState([]);
  const [listening, setListening] = useState(false);
  const boxRef = useRef();

  useEffect(() => {
    if (boxRef.current) boxRef.current.scrollTop = boxRef.current.scrollHeight;
  }, [messages]);

  const handleMicClick = () => {
    setListening(!listening);
    // TODO: Implement speech recognition
  };

  return (
    <div className="h-full w-full flex flex-col p-6">
      <div ref={boxRef} className="flex-1 overflow-y-auto space-y-3 mb-4">
        {messages.length === 0 && <div className="text-center text-slate-500">Click the microphone to start speaking</div>}
        {messages.map((m) => (
          <div key={m.id} className="flex">
            <MessageBubble sender={m.sender}>{m.text}</MessageBubble>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-center">
        <div onClick={handleMicClick} className="cursor-pointer">
          <MicBlob listening={listening} />
        </div>
      </div>
    </div>
  );
}
