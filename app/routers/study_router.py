from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.schemas.study_session_schema import StudySessionCreate, StudySessionResponse
from app.services.study_service import create_study_session

router = APIRouter(prefix="/study", tags=["Study Sessions"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/", response_model=StudySessionResponse)
def register_session(session: StudySessionCreate, db: Session = Depends(get_db)):
    return create_study_session(db, session)