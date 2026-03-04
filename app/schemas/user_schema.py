from pydantic import BaseModel, EmailStr

class UserCreate(BaseModel):
    nombre: str
    email: EmailStr
    password: str
    role: str
    carrera: str
    nivel_academico: str


class UserResponse(BaseModel):
    id: int
    nombre: str
    email: EmailStr
    role: str
    carrera: str
    nivel_academico: str

    class Config:
        from_attributes = True