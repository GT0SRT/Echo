import { useState, useCallback } from "react";
import axios from "axios";

import { createClient, createMicrophoneAndCameraTracks } from "agora-rtc-react";
import useChatStore from "../store/chatStore";

const APP_ID = import.meta.env.VITE_AGORA_APP_ID;

const useClient = createClient({ mode: "rtc", codec: "vp8" });

export default function Conversation() {
  const client = useClient();
  const [joined, setJoined] = useState(false);
  const [tracks, setTracks] = useState(null);

  const addMessage = useChatStore((s) => s.addMessage);

  const getToken = async () => {
    const res = await axios.get("http://localhost:8000/agora-token");
    return res.data;
  };

  const handleJoin = useCallback(async () => {
    try {
      const { token, uid, channel_name } = await getToken();

      const [micTrack, camTrack] = await createMicrophoneAndCameraTracks();
      setTracks([micTrack, camTrack]);

      await client.join(APP_ID, channel_name, token, uid);
      await client.publish([micTrack, camTrack]);

      console.log("Joined", channel_name);
      setJoined(true);

      client.on("stream-message", (senderUid, msg) => {
        const text = String(msg);
        console.log("Transcript:", text);

        addMessage({
          sender: "ai",
          text,
          timestamp: Date.now(),
        });
      });
    } catch (err) {
      console.error(err);
    }
  }, [client, addMessage]);

  const handleLeave = async () => {
    if (tracks) {
      tracks.forEach((t) => {
        try {
          t.stop();
          t.close();
        } catch {}
      });
    }
    await client.leave();
    setJoined(false);
  };

  return (
    <div className="p-5">
      <h2 className="text-xl font-bold mb-3">Conversation</h2>

      {!joined ? (
        <button
          onClick={handleJoin}
          className="px-4 py-2 bg-green-600 rounded"
        >
          Join Call
        </button>
      ) : (
        <button
          onClick={handleLeave}
          className="px-4 py-2 bg-red-600 rounded"
        >
          Leave Call
        </button>
      )}

      <div className="mt-4">
        {tracks && tracks[1] && (
          <video
            ref={(el) => el && tracks[1].play(el)}
            style={{ width: "320px", borderRadius: "10px" }}
          />
        )}
      </div>
    </div>
  );
}
