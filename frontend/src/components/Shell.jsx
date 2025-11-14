import { useState } from "react";
import Navbar from "./Navbar";
import Sidebar from "./sidebar";
import ChatInterface from "./chat/ChatInterface";

export default function Shell() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-full w-full">
      <div className={`transition-all duration-300 bg-[#0e0e0e] border-r border-[#1f1f1f] ${sidebarOpen ? 'w-64' : 'w-16'}`}>
        <Sidebar isCollapsed={!sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      </div>
      <div className="flex-1 flex flex-col">
        <Navbar />
        <div className="flex-1 overflow-hidden">
          <ChatInterface />
        </div>
      </div>
    </div>
  );
}
