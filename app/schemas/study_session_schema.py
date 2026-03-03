from pydantic import BaseModel

class StudySessionCreate(BaseModel):
    user_id: int
    tema: str
    duracion_minutos: int
    cumplio_objetivo: bool
    estado_animo: str

class StudySessionResponse(StudySessionCreate):
    id: int

    class Config:
        orm_mode = True