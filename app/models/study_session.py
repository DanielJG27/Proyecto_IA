from sqlalchemy import Column, Integer, String, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base

class StudySession(Base):
    __tablename__ = "study_sessions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    tema = Column(String)
    duracion_minutos = Column(Integer)
    cumplio_objetivo = Column(Boolean)
    estado_animo = Column(String)

    user = relationship("User") 