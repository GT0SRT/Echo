import { useState } from "react";
import Navbar from "./Navbar";
import Sidebar from "./sidebar";
import ChatInterface from "./chat/ChatInterface";

import Conversation from "./Conversation";   //Agora Component
import ChatWindow from "./ChatWindow";   

export default function Shell() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedTrack, setSelectedTrack] = useState(null);

  const [mode, setMode] = useState("chat"); 

  return (
    <div className="flex h-full w-full">
      <div className={`transition-all duration-300 bg-[#0e0e0e] border-r border-[#1f1f1f] ${sidebarOpen ? 'w-64' : 'w-16'}`}>
        <Sidebar
          isCollapsed={!sidebarOpen}
          onToggle={() => setSidebarOpen(!sidebarOpen)}
          selectedTrack={selectedTrack}
          onSelectTrack={setSelectedTrack}
          mode={mode}
          onModeChange={setMode}
        />
      </div>
      <div className="flex-1 flex flex-col">
        <Navbar />
        <div className="flex-1 overflow-hidden">
          {/* ---------------- CHAT MODE ---------------- */}
          {mode === "chat" && (
            <ChatInterface selectedTrack={selectedTrack} />
          )}

          {/* ---------------- LIVE CALL MODE ---------------- */}
          {mode === "call" && (
            <div className="flex gap-6 w-full h-full">
             
              <div className="flex-1 bg-[#111] rounded-lg p-4 overflow-auto">
                <Conversation />
              </div>

              
              <div className="w-1/3 bg-[#0d0d0d] border border-gray-700 rounded-lg p-4">
                <h2 className="text-xl font-bold mb-3">Live Transcript</h2>
                <ChatWindow />
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
