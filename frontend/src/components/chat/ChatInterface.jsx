import React, { useState, useRef, useEffect } from "react";
import MessageBubble from "./MessageBubble";
import MicBlob from "../MicBlob";
import { Button } from "../../ui/button";


export default function ChatInterface() {
  const [messages, setMessages] = useState([]);
  const [value, setValue] = useState("");
  const boxRef = useRef();

  useEffect(() => {
    if (boxRef.current) boxRef.current.scrollTop = boxRef.current.scrollHeight;
  }, [messages]);

  function send() {
    if (!value.trim()) return;
    const userMsg = { id: Date.now().toString(), sender: "user", text: value };
    setMessages((s) => [...s, userMsg]);
    setValue("");
    setTimeout(() => {
      const reply = { id: Date.now().toString(), sender: "echo", text: `Echo: ${userMsg.text}` };
      setMessages((s) => [...s, reply]);
    }, 700);
  }

  return (
    <div className="h-full w-full flex flex-col p-6">
      <div ref={boxRef} className="flex-1 overflow-y-auto space-y-3 mb-4">
        {messages.length === 0 && <div className="text-center text-slate-500">Start a conversation</div>}
        {messages.map((m) => (
          <div key={m.id} className="flex">
            <MessageBubble sender={m.sender}>{m.text}</MessageBubble>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-3">
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder="Type a message..."
          className="flex-1 rounded-full px-4 py-2 bg-slate-900 border border-cyan-500/20 text-cyan-100 focus:outline-none"
        />
        <Button onClick={send} className="btn-neon">Send</Button>
        <div className="ml-2">
          <MicBlob />
        </div>
      </div>
    </div>
  );
}
