import React, { useState } from "react";
import { MoreVertical, Edit2, Trash2 } from "lucide-react";

export default function Trackcard({ id, name, onEdit, onDelete }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="relative group w-full">
      <div className="flex items-center justify-between px-4 py-3 bg-[#1a1a1a] hover:bg-[#222] rounded-lg border border-[#2a2a2a] transition-all cursor-pointer">
        <span className="text-sm font-medium text-cyan-100">{name || "Untitled"}</span>

        <div className="relative">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setMenuOpen(!menuOpen);
            }}
            className="p-1.5 hover:bg-[#2a2a2a] rounded-md transition-colors"
          >
            <MoreVertical className="w-4 h-4 text-slate-400" />
          </button>

          {menuOpen && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setMenuOpen(false)}
              />
              <div className="absolute right-0 top-full mt-1 w-36 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg shadow-lg z-20 overflow-hidden">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setMenuOpen(false);
                    onEdit(id);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-300 hover:bg-[#2a2a2a] transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                  Edit
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setMenuOpen(false);
                    onDelete(id);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-[#2a2a2a] transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
