from sqlalchemy.orm import Session
from app.models.study_session import StudySession

def create_study_session(db: Session, session_data):
    session = StudySession(**session_data.dict())
    db.add(session)
    db.commit()
    db.refresh(session)
    return session