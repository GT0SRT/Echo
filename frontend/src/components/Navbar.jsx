export default function Navbar({ onToggleSidebar }) {
  return (
    <div className="h-14 w-full bg-[#0f0f0f] border-b border-[#1f1f1f] flex items-center justify-between px-4">
      <button
        onClick={onToggleSidebar}
        className="text-white text-lg"
      >
        ☰
      </button>

      <div className="text-xl font-bold drop-shadow-[0_0_6px_#00f0ff] text-cyan-400">
        Echo
      </div>

      <div className="w-8 h-8 rounded-full bg-gray-700" />
    </div>
  );
}
