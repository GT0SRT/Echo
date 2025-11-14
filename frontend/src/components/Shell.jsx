import { useState } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import ChatInterface from "./chat/ChatInterface";

export default function Shell() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex h-full w-full">
      {sidebarOpen && (
        <div className="w-64 bg-[#0e0e0e] border-r border-[#1f1f1f]">
          <Sidebar />
        </div>
      )}
      <div className="flex-1 flex flex-col">
        <Navbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        <div className="flex-1 overflow-hidden">
          <ChatInterface />
        </div>
      </div>
    </div>
  );
}
