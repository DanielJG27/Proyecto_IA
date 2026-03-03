from sqlalchemy.orm import Session
from app.models.user import User

def create_user(db: Session, user_data):
    user = User(**user_data.dict())
    db.add(user)
    db.commit()
    db.refresh(user)
    return user