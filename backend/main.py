import os
import json
import google.generativeai as genai
from fastapi import File, UploadFile
import mimetypes
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from pydantic import BaseModel, Field
from typing import List
import re
import time
import httpx
from agora_token_builder import RtcTokenBuilder, RtmTokenBuilder

load_dotenv()

app = FastAPI()

# Basic CORS to allow frontend calls during development
allowed_origins = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[o.strip() for o in allowed_origins if o.strip()],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class OnboardingRequest(BaseModel):
    """Data model for the user's goal selection."""
    language: str = Field(..., example="English")
    goal: str = Field(..., example="A doctor needing medical terminology")

class OnboardingResponse(BaseModel):
    """Data model for the generated learning track."""
    system_prompt: str = Field(..., example="You are Dr. Mateo, a senior doctor...")
    initial_topics: List[str] = Field(..., example=["Greeting a patient", "Asking about symptoms"])

@app.get("/")
def read_root():
    return {"message": "Echo API is running!"}

def generate_learning_track(language: str, goal: str) -> str:
    prompt = f"""
You are an expert curriculum designer for an AI language tutor.
A user wants to learn {language} to achieve a specific goal: {goal}.
Generate a JSON object with keys:\n1. \"system_prompt\" - persona, role, accent (if any), constrained vocabulary tailored to the goal.\n2. \"initial_topics\" - 3-5 short starter topics. Return ONLY JSON.
Example format: {{\n  \"system_prompt\": \"You are 'Pierre'...\",\n  \"initial_topics\": [\"Ordering a coffee\", \"Asking for the menu\"]\n}}
"""
    model = genai.GenerativeModel("gemini-1.5-pro")
    response = model.generate_content(prompt)
    return response.text if response and response.text else "{}"

@app.post("/onboarding/generate-track", response_model=OnboardingResponse)
async def generate_track(request: OnboardingRequest):
    """
    Generates a new learning track (AI persona and topics) 
    based on the user's goals.
    """
    raw = generate_learning_track(request.language, request.goal)
    json_match = re.search(r'\{.*\}', raw, re.DOTALL)
    try:
        if not json_match:
            raise ValueError("No JSON object found in AI response.")
        data = json.loads(json_match.group(0))
        return OnboardingResponse(**data)

    except (json.JSONDecodeError, ValueError) as e:
        print(f"--- FAILED TO PARSE JSON: {e} ---")
        print("AI Response (raw) was:")
        print(repr(raw))
        print("-----------------------------------")
        
        return OnboardingResponse(
            system_prompt=f"Error: Could not parse AI response. {e}",
            initial_topics=[]
        )
    except Exception as e:
        return OnboardingResponse(
            system_prompt=f"An unexpected error occurred: {str(e)}",
            initial_topics=[]
        )
    
# --- Pydantic Models for Chat 
class ChatMessage(BaseModel):
    """A single chat message."""
    role: str = Field(..., example="human")
    content: str = Field(..., example="Hello, who are you?")

class ChatRequest(BaseModel):
    """Data model for a chat request."""
    system_prompt: str = Field(..., example="You are a helpful assistant.")
    history: List[ChatMessage]
    user_message: str = Field(..., example="What's the weather like?")

class ChatResponse(BaseModel):
    """Data model for a chat response."""
    ai_message: str = Field(..., example="The weather is sunny today.")

# --- Logic for Conversation Chain ---
def build_chat_prompt(system_prompt: str, history: List['ChatMessage'], user_message: str) -> str:
    history_lines = []
    for m in history:
        prefix = "User" if m.role == "human" else "AI"
        history_lines.append(f"{prefix}: {m.content}")
    history_block = "\n".join(history_lines)
    return f"System: {system_prompt}\n{history_block}\nUser: {user_message}\nAI:"

@app.post("/chat/text", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """
    Holds a text-based conversation with the AI.
    """
    
    try:
        prompt = build_chat_prompt(request.system_prompt, request.history, request.user_message)
        model = genai.GenerativeModel("gemini-1.5-pro")
        response = model.generate_content(prompt)
        ai_text = response.text.strip() if response and response.text else "[No response]"
        return ChatResponse(ai_message=ai_text)
    
    except Exception as e:
        return ChatResponse(ai_message=f"Error in AI response: {str(e)}")
    
try:
    genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))
except AttributeError as e:
    print("--- ERROR: GOOGLE_API_KEY not found in .env file. ---")
    print("Please make sure your .env file is correct.")
except Exception as e:
    print(f"An unexpected error occurred during genai configuration: {e}")

stt_model = genai.GenerativeModel(
    model_name="gemini-1.5-pro"
)

class TranscriptionResponse(BaseModel):
    """Data model for a transcription response."""
    transcription: str = Field(..., example="Hello, what's the weather today?")

@app.post("/speech-to-text", response_model=TranscriptionResponse)
async def speech_to_text(file: UploadFile = File(...)):
    """
    Accepts an audio file and returns the transcription.
    """    
    audio_bytes = await file.read()
    mime_type = file.content_type
    if not mime_type or not (mime_type.startswith("audio/") or mime_type.startswith("video/")):
         mime_type, _ = mimetypes.guess_type(file.filename)
         if not mime_type:
             mime_type = "application/octet-stream"
    
    audio_blob = {
        'mime_type': mime_type,
        'data': audio_bytes
    }
    
    prompt_parts = [
        "Please transcribe the following audio file.",
        audio_blob
    ]
    
    try:
        response = stt_model.generate_content(prompt_parts)
        
        if response and response.text:
            return TranscriptionResponse(transcription=response.text.strip())
        else:
            return TranscriptionResponse(transcription="[AI did not return a valid response]")

    except Exception as e:
        print(f"--- ERROR during STT: {e} ---")
        return TranscriptionResponse(transcription=f"[Error: {str(e)}]")


# -----------------------------
# Agora Orchestration (Stub)
# -----------------------------

class SessionStartRequest(BaseModel):
    trackId: str
    voice: str | None = None
    language: str | None = None


class SessionStartResponse(BaseModel):
    channel: str
    uid: str
    rtcToken: str
    rtmToken: str
    botStatus: str


class SessionStopRequest(BaseModel):
    channel: str


AGORA_APP_ID = os.getenv("AGORA_APP_ID", "")
AGORA_APP_CERTIFICATE = os.getenv("AGORA_APP_CERTIFICATE", "")
AGORA_TOKEN_TTL = int(os.getenv("AGORA_TOKEN_TTL", "3600"))
AGORA_CUSTOMER_ID = os.getenv("AGORA_CUSTOMER_ID", "")
AGORA_CUSTOMER_SECRET = os.getenv("AGORA_CUSTOMER_SECRET", "")
AGORA_REGION = os.getenv("AGORA_REGION", "ap")


def _generate_rtc_token(channel: str, uid: int) -> str:
    """Generate Agora RTC token using AccessToken2."""
    if not AGORA_APP_ID or not AGORA_APP_CERTIFICATE:
        return ""
    
    expiration_time_in_seconds = AGORA_TOKEN_TTL
    current_timestamp = int(time.time())
    privilege_expired_ts = current_timestamp + expiration_time_in_seconds
    
    token = RtcTokenBuilder.buildTokenWithUid(
        AGORA_APP_ID,
        AGORA_APP_CERTIFICATE,
        channel,
        uid,
        1,  # Role.PUBLISHER
        privilege_expired_ts
    )
    return token


def _generate_rtm_token(uid: str) -> str:
    """Generate Agora RTM token."""
    if not AGORA_APP_ID or not AGORA_APP_CERTIFICATE:
        return ""
    
    expiration_time_in_seconds = AGORA_TOKEN_TTL
    current_timestamp = int(time.time())
    privilege_expired_ts = current_timestamp + expiration_time_in_seconds
    
    token = RtmTokenBuilder.buildToken(
        AGORA_APP_ID,
        AGORA_APP_CERTIFICATE,
        uid,
        privilege_expired_ts
    )
    return token


async def _start_agora_bot(channel: str, uid: str, language: str | None, voice: str | None) -> dict:
    """Start Agora Conversational AI Bot via REST API."""
    if not AGORA_CUSTOMER_ID or not AGORA_CUSTOMER_SECRET:
        return {"status": "error", "message": "Agora credentials not configured"}
    
    # Map region to API base URL
    region_urls = {
        "us": "https://api.agora.io",
        "eu": "https://api-eu.agora.io",
        "ap": "https://api-ap.agora.io",
        "cn": "https://api-cn.agora.io",
    }
    base_url = region_urls.get(AGORA_REGION, "https://api-ap.agora.io")
    
    # Generate bot RTC token
    bot_uid = 999999  # Fixed UID for bot
    bot_rtc_token = _generate_rtc_token(channel, bot_uid)
    
    # Prepare bot configuration
    bot_config = {
        "appId": AGORA_APP_ID,
        "channel": channel,
        "token": bot_rtc_token,
        "uid": str(bot_uid),
        "enableVoiceChat": True,
        "enableTranscription": True,
        "voice": {
            "language": language or "en-US",
            "voiceType": voice or "female",
        },
        "llm": {
            "provider": "google",
            "apiKey": os.getenv("GOOGLE_API_KEY"),
            "model": "gemini-1.5-pro",
        },
    }
    
    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.post(
                f"{base_url}/v1/projects/{AGORA_APP_ID}/rtc/speech-to-speech/start",
                json=bot_config,
                auth=(AGORA_CUSTOMER_ID, AGORA_CUSTOMER_SECRET),
                headers={"Content-Type": "application/json"},
            )
            response.raise_for_status()
            result = response.json()
            return {"status": "started", "data": result}
    except httpx.HTTPError as e:
        print(f"Failed to start Agora bot: {e}")
        return {"status": "error", "message": str(e)}


@app.get("/agora-token")
async def get_agora_token():
    """Generate Agora RTC token for Conversational AI session.
    
    For now returns placeholder. Replace with real AccessToken2 generation.
    """
    if not AGORA_APP_ID:
        return {"error": "AGORA_APP_ID not configured"}
    
    import uuid
    
    channel_name = f"echo-{uuid.uuid4()}"
    uid = str(uuid.uuid4())[:8]
    
    # Placeholder token
    token = _generate_placeholder_token("rtc", channel_name, uid)
    
    return {
        "token": token,
        "uid": uid,
        "channel_name": channel_name,
    }


@app.post("/session/start", response_model=SessionStartResponse)
async def start_session(req: SessionStartRequest):
    """Create an Agora RTC/RTM session and summon the Bot (stub)."""
    if not AGORA_APP_ID:
        # Return explicit message to guide env setup
        return SessionStartResponse(
            channel="",
            uid="",
            rtcToken="",
            rtmToken="",
            botStatus="error: set AGORA_APP_ID/.env",
        )

    # Simple channel/uid generation for demo
    import uuid

    channel = str(uuid.uuid4())
    uid = str(uuid.uuid4())[:8]

    # Generate real Agora tokens
    uid_int = abs(hash(uid)) % (10 ** 8)  # Convert string uid to int for RTC
    rtc_token = _generate_rtc_token(channel, uid_int)
    rtm_token = _generate_rtm_token(uid)

    # Start the Agora Conversational AI bot
    bot_result = await _start_agora_bot(channel, uid, req.language, req.voice)
    bot_status = bot_result.get("status", "unknown")

    return SessionStartResponse(
        channel=channel,
        uid=uid,
        rtcToken=rtc_token,
        rtmToken=rtm_token,
        botStatus=bot_status,
    )


@app.post("/session/stop")
async def stop_session(req: SessionStopRequest):
    """Stop the Agora Bot and clean up."""
    if not AGORA_CUSTOMER_ID or not AGORA_CUSTOMER_SECRET:
        return {"status": "error", "message": "Agora credentials not configured"}
    
    region_urls = {
        "us": "https://api.agora.io",
        "eu": "https://api-eu.agora.io",
        "ap": "https://api-ap.agora.io",
        "cn": "https://api-cn.agora.io",
    }
    base_url = region_urls.get(AGORA_REGION, "https://api-ap.agora.io")
    
    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.post(
                f"{base_url}/v1/projects/{AGORA_APP_ID}/rtc/speech-to-speech/stop",
                json={"channel": req.channel, "uid": "999999"},
                auth=(AGORA_CUSTOMER_ID, AGORA_CUSTOMER_SECRET),
                headers={"Content-Type": "application/json"},
            )
            return {"status": "stopped", "channel": req.channel}
    except httpx.HTTPError as e:
        print(f"Failed to stop Agora bot: {e}")
        return {"status": "error", "message": str(e)}