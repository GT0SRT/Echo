const BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";

async function http(path, options = {}) {
    const res = await fetch(`${BASE_URL}${path}`, {
        headers: { "Content-Type": "application/json", ...(options.headers || {}) },
        ...options,
    });
    if (!res.ok) {
        const text = await res.text();
        throw new Error(`HTTP ${res.status}: ${text}`);
    }
    return res.json();
}

export async function startSession({ trackId, voice, language }) {
    return http("/session/start", {
        method: "POST",
        body: JSON.stringify({ trackId, voice, language }),
    });
}

export async function stopSession({ channel }) {
    return http("/session/stop", {
        method: "POST",
        body: JSON.stringify({ channel }),
    });
}

export async function generateTrack({ language, goal }) {
    return http("/onboarding/generate-track", {
        method: "POST",
        body: JSON.stringify({ language, goal }),
    });
}
