import React, { useState, useRef, useEffect } from "react";
import MessageBubble from "./MessageBubble";
import MicBlob from "../MicBlob";
import { startSession, stopSession } from "../../lib/api";
import useChatStore from "../../store/chatStore";
import AgoraRTC from "agora-rtc-sdk-ng";

const APP_ID = import.meta.env.VITE_AGORA_APP_ID || "";

export default function ChatInterface({ selectedTrack }) {
  const messages = useChatStore((state) => state.messages);
  const addMessage = useChatStore((state) => state.addMessage);

  const [listening, setListening] = useState(false);
  const [session, setSession] = useState(null);
  const boxRef = useRef();
  const clientRef = useRef(null);
  const micTrackRef = useRef(null);

  useEffect(() => {
    if (boxRef.current) boxRef.current.scrollTop = boxRef.current.scrollHeight;
  }, [messages]);

  const handleMicClick = async () => {
    try {
      if (!listening) {
        if (!selectedTrack) {
          return;
        }

        // Start Agora session via backend
        const resp = await startSession({
          trackId: selectedTrack.id,
          language: selectedTrack.language,
        });
        setSession(resp);

        // Initialize Agora RTC client if not exists
        if (!clientRef.current && APP_ID) {
          clientRef.current = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });

          // Listen for remote user published (Bot audio)
          clientRef.current.on("user-published", async (user, mediaType) => {
            await clientRef.current.subscribe(user, mediaType);
            if (mediaType === "audio") {
              user.audioTrack?.play();
            }
          });

          // Listen for data stream messages (transcripts from Bot)
          clientRef.current.on("stream-message", (uid, data) => {
            try {
              const text = new TextDecoder().decode(data);
              addMessage({
                sender: "bot",
                text,
                trackId: selectedTrack.id,
              });
            } catch (e) {
              console.error("Failed to decode stream message:", e);
            }
          });
        }

        // Join channel with token from backend (tokenless if empty)
        if (clientRef.current && resp.channel && resp.uid) {
          const tokenOrNull = resp.rtcToken ? resp.rtcToken : null;
          await clientRef.current.join(APP_ID, resp.channel, tokenOrNull, resp.uid);

          // Create and publish microphone track
          micTrackRef.current = await AgoraRTC.createMicrophoneAudioTrack();
          await clientRef.current.publish([micTrackRef.current]);

          setListening(true);
        }
      } else {
        // Stop: leave channel and clean up
        if (micTrackRef.current) {
          micTrackRef.current.close();
          micTrackRef.current = null;
        }
        if (clientRef.current) {
          await clientRef.current.leave();
        }
        if (session?.channel) {
          await stopSession({ channel: session.channel });
        }
        setSession(null);
        setListening(false);
      }
    } catch (e) {
      console.error("Mic/session error:", e);
      setListening(false);
    }
  };

  const getPromptText = () => {
    if (!selectedTrack) {
      return "Select a track to start learning";
    }
    return `Click the microphone to practice ${selectedTrack.name || selectedTrack.title}`;
  };

  return (
    <div className="h-full w-full flex flex-col p-6">
      <div ref={boxRef} className="flex-1 overflow-y-auto space-y-3 mb-4">
        {messages.length === 0 && (
          <div className="text-center text-slate-500">
            {getPromptText()}
          </div>
        )}
        {messages
          .filter((m) => !selectedTrack || m.trackId === selectedTrack.id)
          .map((m) => (
            <div key={m.id} className="flex">
              <MessageBubble sender={m.sender}>{m.text}</MessageBubble>
            </div>
          ))}
      </div>

      <div className="flex items-center justify-center">
        <div onClick={handleMicClick} className="cursor-pointer">
          <MicBlob listening={listening} />
        </div>
      </div>
    </div>
  );
}
