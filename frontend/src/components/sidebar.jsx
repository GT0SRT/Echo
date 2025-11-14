import React, { useContext } from "react";
import TrackDialog from "./TrackDialog";
import Trackcard from "./Trackcard";
import { TracksContext } from "../context/TracksContext";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";

export default function Sidebar({ isCollapsed, onToggle, selectedTrack, onSelectTrack }) {
  const { tracks, removeTrack, updateTrack } = useContext(TracksContext);

  const handleEdit = (id) => {
    const track = tracks.find(t => t.id === id);
    if (track) {
      const newName = prompt("Edit track name:", track.name || track.title);
      if (newName && newName.trim()) {
        updateTrack(id, { name: newName.trim() });
      }
    }
  };

  const handleDelete = (id) => {
    if (confirm("Are you sure you want to delete this track?")) {
      removeTrack(id);
      if (selectedTrack?.id === id) {
        onSelectTrack(null);
      }
    }
  };

  if (isCollapsed) {
    return (
      <div className="h-full w-full flex flex-col items-center py-4 gap-6">
        <button
          onClick={onToggle}
          className="p-2 hover:bg-[#1f1f1f] rounded-lg transition-colors"
          title="Open sidebar"
        >
          <PanelLeftOpen className="w-6 h-6 text-cyan-400" />
        </button>

        <div className="flex-1 flex flex-col items-center justify-center gap-8">
          <div className="writing-mode-vertical text-cyan-400 text-sm font-semibold tracking-wider" style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}>
            ADD TRACK
          </div>

          {tracks.length > 0 && (
            <>
              <div className="w-8 h-px bg-[#1f1f1f]"></div>
              <div className="writing-mode-vertical text-slate-500 text-xs" style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}>
                LESSONS
              </div>
            </>
          )}
        </div>

        <div className="flex flex-col gap-3 mt-auto">
          {tracks.map((t) => (
            <div
              key={t.id}
              onClick={() => onSelectTrack(t)}
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs cursor-pointer transition-colors ${selectedTrack?.id === t.id
                ? 'bg-cyan-600 text-white'
                : 'bg-cyan-600/20 text-cyan-400 hover:bg-cyan-600/30'
                }`}
              title={t.name || t.title}
            >
              {(t.name || t.language)?.charAt(0) || "T"}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full flex flex-col p-4 gap-4 overflow-y-auto">
      <div className="flex items-center justify-between">
        <button
          onClick={onToggle}
          className="p-2 hover:bg-[#1f1f1f] rounded-lg transition-colors"
          title="Close sidebar"
        >
          <PanelLeftClose className="w-5 h-5 text-cyan-400" />
        </button>
      </div>

      <TrackDialog />

      <div className="flex flex-col gap-2 mt-4">
        {tracks.length === 0 && <div className="text-sm text-slate-500 text-center py-4">No tracks yet</div>}
        {tracks.map((t) => (
          <div key={t.id} onClick={() => onSelectTrack(t)}>
            <Trackcard
              id={t.id}
              name={t.name || t.title}
              onEdit={handleEdit}
              onDelete={handleDelete}
              isSelected={selectedTrack?.id === t.id}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
