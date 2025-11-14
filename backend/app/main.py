import os
import json
import re
import mimetypes
from typing import List
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from pydantic import BaseModel, Field
import google.generativeai as genai

# Load environment variables
load_dotenv()

# Initialize FastAPI app
app = FastAPI(title="Echo API", version="1.0.0")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure Gemini API
api_key = os.getenv("GOOGLE_API_KEY")
if not api_key:
    print("could not get api key")
else:
    try:
        genai.configure(api_key=api_key)
        print("Gemini API configured successfully")
    except Exception as e:
        print(f"ERROR: {e}")

stt_model = genai.GenerativeModel("gemini-1.5-pro")

class OnboardingRequest(BaseModel):
    """Data model for the user's goal selection."""
    language: str = Field(..., example="English")
    goal: str = Field(..., example="A doctor needing medical terminology")


class OnboardingResponse(BaseModel):
    """Data model for the generated learning track."""
    system_prompt: str = Field(..., example="You are Dr. Mateo, a senior doctor...")
    initial_topics: List[str] = Field(..., example=["Greeting a patient", "Asking about symptoms"])


class ChatMessage(BaseModel):
    """A single chat message."""
    role: str = Field(..., example="human")
    content: str = Field(..., example="Hello, who are you?")


class ChatRequest(BaseModel):
    """Data model for a chat request."""
    system_prompt: str = Field(..., example="You are a helpful assistant.")
    history: List[ChatMessage] = Field(default_factory=list)
    user_message: str = Field(..., example="What's the weather like?")


class ChatResponse(BaseModel):
    """Data model for a chat response."""
    ai_message: str = Field(..., example="The weather is sunny today.")


class TranscriptionResponse(BaseModel):
    """Data model for a transcription response."""
    transcription: str = Field(..., example="Hello, what's the weather today?")


# helper functions
def generate_learning_track(language: str, goal: str) -> str:
    """Generate a learning track using Gemini API."""
    prompt = f"""
        You are an expert curriculum designer for an AI language tutor.
        A user wants to learn {language} to achieve a specific goal: {goal}.

        Generate a JSON object with the following keys:
        1. "system_prompt" - A detailed persona description including role, accent (if any), teaching style, and constrained vocabulary tailored to the goal.
        2. "initial_topics" - An array of 3-5 short starter topics relevant to the goal.

        Return ONLY valid JSON in this exact format:
        {{
        "system_prompt": "You are 'Name', a [role description]...",
        "initial_topics": ["Topic 1", "Topic 2", "Topic 3"]
        }}
    """
    try:
        model = genai.GenerativeModel("gemini-1.5-pro")
        response = model.generate_content(prompt)
        return response.text if response and response.text else "{}"
    except Exception as e:
        print(f"Error generating learning track: {e}")
        return "{}"


def build_chat_prompt(system_prompt: str, history: List[ChatMessage], user_message: str) -> str:
    """Build a formatted chat prompt from system prompt, history, and new message."""
    history_lines = []
    for msg in history:
        prefix = "User" if msg.role == "human" else "AI"
        history_lines.append(f"{prefix}: {msg.content}")
    
    history_block = "\n".join(history_lines)
    return f"System: {system_prompt}\n{history_block}\nUser: {user_message}\nAI:"

# API Endpoints
@app.get("/")
def read_root():
    """Health check endpoint."""
    return {
        "message": "Echo API is running!",
        "version": "1.0.0",
        "status": "healthy"
    }


@app.get("/health")
def health_check():
    """Detailed health check endpoint."""
    api_configured = bool(os.getenv("GOOGLE_API_KEY"))
    return {
        "status": "healthy",
        "api_configured": api_configured,
        "endpoints": ["/", "/health", "/onboarding/generate-track", "/chat/text", "/speech-to-text"]
    }


@app.post("/onboarding/generate-track", response_model=OnboardingResponse)
async def generate_track(request: OnboardingRequest):
    """
    Generates a new learning track (AI persona and topics) 
    based on the user's goals.
    """
    try:
        if not request.language or not request.goal:
            raise HTTPException(status_code=400, detail="Language and goal are required")

        raw_response = generate_learning_track(request.language, request.goal)
        
        # Extract JSON from response
        json_match = re.search(r'\{.*\}', raw_response, re.DOTALL)
        
        if not json_match:
            print(f"No JSON found in response: {raw_response}")
            raise ValueError("No valid JSON object found in AI response")
        
        data = json.loads(json_match.group(0))
        if "system_prompt" not in data or "initial_topics" not in data:
            raise ValueError("Missing required fields in AI response")        
        return OnboardingResponse(**data)
    
    except json.JSONDecodeError as e:
        print(f"JSON parsing error: {e}")
        print(f"Raw response: {raw_response}")
        return OnboardingResponse(
            system_prompt=f"I'm a friendly {request.language} tutor helping you with: {request.goal}",
            initial_topics=["Getting Started", "Basic Conversation", "Practice Exercise"]
        )
    
    except ValueError as e:
        print(f"Validation error: {e}")
        return OnboardingResponse(
            system_prompt=f"I'm a friendly {request.language} tutor helping you with: {request.goal}",
            initial_topics=["Getting Started", "Basic Conversation", "Practice Exercise"]
        )
    
    except Exception as e:
        print(f"Unexpected error in generate_track: {e}")
        raise HTTPException(status_code=500, detail=f"Error generating learning track: {str(e)}")


@app.post("/chat/text", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """
    Holds a text-based conversation with the AI.
    """
    try:
        if not request.user_message:
            raise HTTPException(status_code=400, detail="User message is required")
        
        prompt = build_chat_prompt(request.system_prompt, request.history, request.user_message)
        
        model = genai.GenerativeModel("gemini-1.5-pro")
        response = model.generate_content(prompt)        
        ai_text = response.text.strip() if response and response.text else "[No response generated]"
        return ChatResponse(ai_message=ai_text)
    
    except Exception as e:
        print(f"Error in chat endpoint: {e}")
        return ChatResponse(ai_message=f"I'm sorry, I encountered an error: {str(e)}")


@app.post("/speech-to-text", response_model=TranscriptionResponse)
async def speech_to_text(file: UploadFile = File(...)):
    """
    Accepts an audio file and returns the transcription.
    """
    try:
        if not file:
            raise HTTPException(status_code=400, detail="No file provided")
        
        audio_bytes = await file.read()
        
        if not audio_bytes:
            raise HTTPException(status_code=400, detail="Empty file provided")
        
        mime_type = file.content_type
        
        if not mime_type or not (mime_type.startswith("audio/") or mime_type.startswith("video/")):
            mime_type, _ = mimetypes.guess_type(file.filename)
            if not mime_type:
                mime_type = "audio/wav"
        
        # Create blob for Gemini API
        audio_blob = {
            'mime_type': mime_type,
            'data': audio_bytes
        }
        
        # Create prompt
        prompt_parts = [
            "Please transcribe the following audio file accurately. Return only the transcription text.",
            audio_blob
        ]
        
        # Generate transcription
        response = stt_model.generate_content(prompt_parts)
        
        if response and response.text:
            transcription = response.text.strip()
            return TranscriptionResponse(transcription=transcription)
        else:
            return TranscriptionResponse(transcription="[No transcription available]")
    
    except HTTPException:
        raise
    
    except Exception as e:
        print(f"Error in speech-to-text: {e}")
        return TranscriptionResponse(transcription=f"[Error during transcription: {str(e)}]")

@app.on_event("startup")
async def startup_event():
    """Run on application startup."""
    print("=" * 50)
    print("🚀 Echo API Starting...")
    print("=" * 50)
    print(f"API Key configured: {bool(os.getenv('GOOGLE_API_KEY'))}")
    print("=" * 50)

@app.get("/agora-token")
def agora_token():
    return {
        "token": "",  # empty for testing 
        "channel_name": "echo_test",
        "uid": 1
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)