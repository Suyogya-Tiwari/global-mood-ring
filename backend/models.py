from sqlalchemy import Column, Integer, String, Float, DateTime
from datetime import datetime, timezone
from database import Base

class Headline(Base):
    __tablename__ = "headlines"

    id = Column(Integer, primary_key=True, index=True)
    country_code = Column(String, index=True)
    title = Column(String)
    
    # 7-dimensional emotions
    joy = Column(Float)
    anger = Column(Float)
    fear = Column(Float)
    surprise = Column(Float)
    sadness = Column(Float)
    disgust = Column(Float)
    neutral = Column(Float)
    
    # Time-series support
    timestamp = Column(DateTime, default=lambda: datetime.now(timezone.utc), index=True)
