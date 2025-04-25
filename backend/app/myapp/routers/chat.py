from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy.sql import func
from .. import schemas, database, models, oauth2
from datetime import datetime
from typing import Optional
from ..services.ai import gemini_service

router = APIRouter(
    prefix="/api/ai_chat",
    tags=["Chat"],
    dependencies=[Depends(oauth2.get_current_user)]
)

@router.get("/")
async def get_chat_sessions(
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(oauth2.get_current_user)
):
    return {"message": "Welcome to My AI Applications"}

@router.get("/history", response_model=list[schemas.ChatSessionResponse])
async def get_chat_sessions(
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(oauth2.get_current_user)
):
    """Get user's chat session history, including all messages"""
    
    sessions = db.query(
        models.ChatConversation.session_id,
        func.min(models.ChatConversation.title).label('title'),
        func.min(models.ChatConversation.session_created_at).label('created_at')
    ).filter(
        models.ChatConversation.user_id == current_user.id
    ).group_by(
        models.ChatConversation.session_id
    ).order_by(
        func.min(models.ChatConversation.session_created_at).desc()
    ).all()

    session_responses = []
    for session in sessions:
        messages = db.query(models.ChatConversation).filter(
            models.ChatConversation.user_id == current_user.id,
            models.ChatConversation.session_id == session.session_id
        ).order_by(models.ChatConversation.timestamp.asc()).all()

        session_responses.append(schemas.ChatSessionResponse(
            chat_id=session.session_id,
            title=session.title,
            created_at=session.created_at,
            messages=[
                schemas.MessageResponse(
                    content=m.content,
                    is_bot=m.is_bot,
                    session_id=m.session_id,
                    timestamp=m.timestamp
                ) for m in messages
            ]
        ))

    return session_responses


@router.post("/request", response_model=schemas.MessageResponse)
async def send_message(
    message: schemas.MessageCreate,
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(oauth2.get_current_user)
):
    """Send message to AI and save conversation"""

    if not current_user:
        raise HTTPException(status_code=401, detail="User not authenticated")

    if not message.content.strip():
        raise HTTPException(status_code=400, detail="Message content cannot be empty")

    # ✅ Use session_id from frontend, or generate a new one
    session_id = message.session_id
    if not session_id:
        max_session = db.query(func.max(models.ChatConversation.session_id)).scalar()
        session_id = (max_session or 0) + 1

    # Save user message
    user_message = save_message_to_db(
        db,
        current_user.id,
        message.content,
        session_id,
        is_bot=False
    )

    # Get AI response
    try:
        ai_response = await gemini_service.get_response(message.content)
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=503,
            detail=f"Error while getting AI response: {str(e)}"
        )

    # Save AI response
    bot_message = save_message_to_db(
        db,
        current_user.id,
        ai_response,
        session_id,
        is_bot=True
    )

    return schemas.MessageResponse(
        content=bot_message.content,
        is_bot=True,
        session_id=bot_message.session_id,
        timestamp=bot_message.timestamp
    )


def save_message_to_db(
    db: Session,
    user_id: int,
    content: str,
    session_id: int,
    is_bot: bool
) -> models.ChatConversation:
    """Save a message to the chat_conversations table"""

    # For first message in a session, set title and session_created_at
    is_new_session = not db.query(models.ChatConversation).filter(
        models.ChatConversation.user_id == user_id,
        models.ChatConversation.session_id == session_id
    ).first()

    session_title = content[:25] if is_new_session else None
    session_created_at = datetime.utcnow() if is_new_session else None

    new_message = models.ChatConversation(
        user_id=user_id,
        session_id=session_id,
        title=session_title,
        session_created_at=session_created_at,
        content=content,
        is_bot=is_bot,
        timestamp=datetime.utcnow()
    )
    db.add(new_message)
    db.commit()
    db.refresh(new_message)
    return new_message