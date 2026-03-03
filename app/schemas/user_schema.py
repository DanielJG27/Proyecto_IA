from pydantic import BaseModel

class UserCreate(BaseModel):
    nombre: str
    carrera: str
    nivel_academico: str

class UserResponse(UserCreate):
    id: int

    class Config:
        orm_mode = True