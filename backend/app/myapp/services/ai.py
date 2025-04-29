from fastapi import HTTPException
import openai
import aiohttp
import anyio
from groq import Groq
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
        self.api_key = "your Gemini API key"
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
        self.api_key = "your Groq API key"  # your Groq API key
        self.model = "llama3-70b-8192"  # OR whatever model you want by default (you can override per request)
        self.client = Groq(
            api_key=self.api_key
        )

    async def get_response(self, messages: List[Dict[str, str]]) -> str:
        try:
            # Call Groq API
            chat_completion = self.client.chat.completions.create(
                messages=messages,
                model=self.model
            )
            return chat_completion.choices[0].message.content
        except Exception as e:
            raise HTTPException(
                status_code=503,
                detail=f"Groq API error: {str(e)}"
            )



# --------------------------
# Deepseek Service
# --------------------------
class DeepseekService:
    def __init__(self):
        self.api_key = "your Deepseek API key"
        self.model = "deepseek-chat"
        self.base_url = "https://api.deepseek.com/v1/chat/completions"

    async def get_response(self, messages: List[Dict[str, str]]) -> str:
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }
        data = {
            "model": self.model,
            "messages": messages,
            "temperature": 0.7
        }
        try:
            async with aiohttp.ClientSession() as session:
                async with session.post(self.base_url, headers=headers, json=data) as response:
                    response.raise_for_status()
                    result = await response.json()
                    return result['choices'][0]['message']['content']
        except aiohttp.ClientResponseError as e:
            raise HTTPException(
                status_code=e.status,
                detail=f"Deepseek API error: {e.message}"
            )
        except Exception as e:
            raise HTTPException(
                status_code=503,
                detail=f"Deepseek connection error: {str(e)}"
            )


# --------------------------
# Unified AI Router
# --------------------------
class AIManager:
    def __init__(self):
        self.services = {
            "openai": OpenAIService(),
            "gemini": GeminiService(),
            "groq": GroqService(),
            "deepseek": DeepseekService() 
        }

    async def get_response(self, model: str, messages: List[Dict[str, str]]) -> str:
        if model not in self.services:
            raise HTTPException(status_code=400, detail=f"Unsupported model: {model}")
        return await self.services[model].get_response(messages)


# Export singleton
ai_manager = AIManager()
