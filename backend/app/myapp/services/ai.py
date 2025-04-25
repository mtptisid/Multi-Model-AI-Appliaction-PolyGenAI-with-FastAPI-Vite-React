from fastapi import HTTPException
import openai
import anyio
import google.generativeai as genai

# --------------------------
# AI Service: OpenAI GPT
# --------------------------
class AIService:
    def __init__(self):
        openai.api_key = "your-openai-api-key"
        self.model = "gpt-3.5-turbo"

    async def get_response(self, prompt: str) -> str:
        try:
            response = await openai.ChatCompletion.acreate(
                model=self.model,
                messages=[{"role": "user", "content": prompt}],
                temperature=0.7
            )
            return response.choices[0].message['content']
        except Exception as e:
            raise HTTPException(
                status_code=503,
                detail=f"AI service error: {str(e)}"
            )

# --------------------------
# Gemini Service: Google Generative AI
# --------------------------
class GeminiService:
    def __init__(self):
        self.api_key = "your_api_key"
        genai.configure(api_key=self.api_key)
        self.model = genai.GenerativeModel("gemini-2.0-flash")  # or "gemini-1.5-pro"

    async def get_response(self, prompt: str) -> str:
        try:
            # Because `generate_content` is sync, use a worker thread
            response = await anyio.to_thread.run_sync(
                lambda: self.model.generate_content(prompt)
            )
            return response.text
        except Exception as e:
            raise HTTPException(
                status_code=503,
                detail=f"Gemini service error: {str(e)}"
            )

# --------------------------
# Qroq Service: Placeholder or Mock
# --------------------------
class QroqService:
    def __init__(self):
        self.api_key = "your_api_key"
        self.model = "qroq-3.0"

    async def get_response(self, prompt: str) -> str:
        try:
            # TODO: Replace with real API call if Qroq SDK exists
            return f"[Qroq response simulated]: {prompt}"
        except Exception as e:
            raise HTTPException(
                status_code=503,
                detail=f"Qroq service error: {str(e)}"
            )

# --------------------------
# Export service instances
# --------------------------
ai_service = AIService()
gemini_service = GeminiService()
qroq_service = QroqService()