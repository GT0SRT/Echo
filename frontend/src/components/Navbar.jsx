export default function Navbar({ onToggleSidebar }) {
  return (
    <div className="h-14 w-full nav-gradient flex items-center justify-between px-4">
      <button onClick={onToggleSidebar} className="text-white text-lg px-2 py-1 rounded-md bg-transparent">
        ☰
      </button>

      <div className="text-xl font-bold neon-title">
        Echo
      </div>

      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#ffb86b] to-[#ff5a1f] shadow-sm" />
    </div>
  );
}
