import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    PROJECT_NAME: str = "Sistema Inteligente de Hábitos de Estudio"
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./control_habitos.db")
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")

settings = Settings()