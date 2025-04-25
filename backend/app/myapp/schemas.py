from typing import List, Optional
from pydantic import BaseModel, EmailStr
from datetime import datetime

class User(BaseModel):
    email: EmailStr
    password: str

class ShowUser(BaseModel):
    email: EmailStr
    class Config:
        from_attributes = True

class ShowallUser(BaseModel):
    id: int
    email: EmailStr

    class Config:
        from_attributes = True

class Login(BaseModel):
    email: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

class MessageCreate(BaseModel):
    content: str
    session_id: Optional[int] = None

class MessageResponse(BaseModel):
    content: str
    is_bot: bool
    session_id: int
    timestamp: datetime

class ChatSessionResponse(BaseModel):
    chat_id: int
    title: str
    created_at: datetime
    messages: List[MessageResponse]

    class Config:
        from_attributes = True