import { User } from "lucide-react";

export default function Navbar() {
  return (
    <div className="h-14 w-full bg-[#0f0f0f] border-b border-[#1f1f1f] flex items-center justify-between px-4">
      <div></div>

      <div className="text-xl font-bold drop-shadow-[0_0_6px_#00f0ff] text-cyan-400">
        Echo
      </div>

      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center cursor-pointer hover:from-cyan-400 hover:to-blue-500 transition-all">
        <User className="w-5 h-5 text-white" />
      </div>
    </div>
  );
}
