// src/store/chatStore.js
import { create } from "zustand";
import { persist } from "zustand/middleware";

const useChatStore = create(
  persist(
    (set) => ({
      messages: [],

      addMessage: (msg) =>
        set((state) => ({
          messages: [
            ...state.messages,
            {
              ...msg,
              id: msg.id || Date.now() + Math.random(),
              timestamp: msg.timestamp || Date.now(),
            },
          ],
        })),

      clearMessages: () => set({ messages: [] }),

      clearTrackMessages: (trackId) =>
        set((state) => ({
          messages: state.messages.filter((m) => m.trackId !== trackId),
        })),
    }),
    {
      name: "echo-chat-storage",
    }
  )
);

export default useChatStore;
