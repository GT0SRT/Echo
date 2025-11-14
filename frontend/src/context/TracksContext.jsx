import React, { createContext, useEffect, useState } from "react";

export const TracksContext = createContext({
  tracks: [],
  addTrack: () => {},
  removeTrack: () => {},
  updateTrack: () => {},
});

export function TracksProvider({ children }) {
  const [tracks, setTracks] = useState([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("echo_tracks");
      if (raw) setTracks(JSON.parse(raw));
    } catch (e) {
      setTracks([]);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("echo_tracks", JSON.stringify(tracks));
    } catch (e) {}
  }, [tracks]);

  const addTrack = (track) => {
    setTracks((s) => [...s, track]);
  };

  const removeTrack = (id) => {
    setTracks((s) => s.filter((t) => t.id !== id));
  };

  const updateTrack = (id, patch) => {
    setTracks((s) => s.map((t) => (t.id === id ? { ...t, ...patch } : t)));
  };

  return (
    <TracksContext.Provider value={{ tracks, addTrack, removeTrack, updateTrack }}>
      {children}
    </TracksContext.Provider>
  );
}
