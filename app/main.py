from fastapi import FastAPI
from app.routers import user_router, study_router
from app.database import Base, engine
from app.models import user, study_session 
from fastapi.middleware.cors import CORSMiddleware




app = FastAPI(title="Sistema Inteligente de Hábitos de Estudio")

Base.metadata.create_all(bind=engine)

app.include_router(user_router.router)
app.include_router(study_router.router)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"mensaje": "API funcionando correctamente"}

