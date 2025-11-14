import React from "react";
import { cn } from "../../lib/utils";

export default function MessageBubble({ sender = "echo", children }) {
  const classes = sender === "user"
    ? "bg-gradient-to-r from-cyan-500 to-purple-600 text-white shadow-[0_0_12px_#0ff] rounded-2xl px-4 py-2 max-w-[70%] ml-auto"
    : "bg-slate-800 border border-cyan-500/30 text-cyan-200 rounded-2xl px-4 py-2 max-w-[70%] mr-auto";
  return <div className={cn(classes)}>{children}</div>;
}
