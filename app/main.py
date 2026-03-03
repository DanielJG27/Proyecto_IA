from fastapi import FastAPI
from app.routers import user_router, study_router
from app.database import engine
from app.models import user, study_session

user.Base.metadata.create_all(bind=engine)
study_session.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Sistema Inteligente de Hábitos de Estudio")

app.include_router(user_router.router)
app.include_router(study_router.router)

@app.get("/")
def root():
    return {"mensaje": "API funcionando correctamente"}

