from fastapi import HTTPException
import openai
import anyio
import google.generativeai as genai
from typing import List, Dict


# --------------------------
# OpenAI GPT Service
# --------------------------
class OpenAIService:
    def __init__(self):
        openai.api_key = "your-openai-api-key"
        self.model = "gpt-3.5-turbo"

    async def get_response(self, messages: List[Dict[str, str]]) -> str:
        try:
            response = await openai.ChatCompletion.acreate(
                model=self.model,
                messages=messages,
                temperature=0.7
            )
            return response.choices[0].message['content']
        except Exception as e:
            raise HTTPException(
                status_code=503,
                detail=f"OpenAI error: {str(e)}"
            )


# --------------------------
# Gemini Service
# --------------------------
class GeminiService:
    def __init__(self):
        self.api_key = "your_gemini_key"
        genai.configure(api_key=self.api_key)
        self.model = genai.GenerativeModel("gemini-2.0-flash")

    async def get_response(self, messages: List[Dict[str, str]]) -> str:
        try:
            parts = [msg["content"] for msg in messages]
            response = await anyio.to_thread.run_sync(
                lambda: self.model.generate_content(parts)
            )
            return response.text
        except Exception as e:
            raise HTTPException(
                status_code=503,
                detail=f"Gemini error: {str(e)}"
            )


# --------------------------
# Qroq Service (Mock)
# --------------------------
class GroqService:
    def __init__(self):
        self.api_key = "your_groq_key"
        self.model = "qroq-3.0"

    async def get_response(self, messages: List[Dict[str, str]]) -> str:
        try:
            last_msg = messages[-1]["content"]
            return f"[Qroq response simulated]: {last_msg}"
        except Exception as e:
            raise HTTPException(
                status_code=503,
                detail=f"Qroq error: {str(e)}"
            )


# --------------------------
# Unified AI Router
# --------------------------
class AIManager:
    def __init__(self):
        self.services = {
            "openai": OpenAIService(),
            "gemini": GeminiService(),
            "groq": GroqService()
        }

    async def get_response(self, model: str, messages: List[Dict[str, str]]) -> str:
        if model not in self.services:
            raise HTTPException(status_code=400, detail=f"Unsupported model: {model}")
        return await self.services[model].get_response(messages)


# Export singleton
ai_manager = AIManager()
