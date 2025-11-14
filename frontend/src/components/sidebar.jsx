import React, { useContext } from "react";
import TrackDialog from "./TrackDialog";
import Trackcard from "./Trackcard";
import { TracksContext } from "../context/TracksContext";

export default function Sidebar() {
  const { tracks, removeTrack } = useContext(TracksContext);

  return (
    <div className="h-full w-full flex flex-col p-4 gap-4 overflow-y-auto">
      <TrackDialog />

      <div className="flex flex-col gap-3 mt-4">
        {tracks.length === 0 && <div className="text-sm text-slate-500">No tracks yet</div>}
        {tracks.map((t) => (
          <div key={t.id} className="flex items-center gap-3">
            <Trackcard id={t.id} title={t.title} level={t.level} />
            <button onClick={() => removeTrack(t.id)} className="text-sm px-2 py-1 rounded-md border border-slate-700">Remove</button>
          </div>
        ))}
      </div>
    </div>
  );
}
