from fastapi import FastAPI, Depends, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from database import SessionLocal, engine
from models import Base, Headline
from sqlalchemy import func

# Ensure database tables exist
Base.metadata.create_all(bind=engine)

# Initialize the FastAPI app with metadata for the auto-generated Swagger UI
app = FastAPI(
    title="Global Mood Ring API",
    description="Real-time 7-dimensional emotion analytics from global news headlines.",
    version="1.0.0"
)

# Enable CORS so the React frontend can talk to the backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, this should be restricted to the frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dependency to get a database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# --- WebSocket Connection Manager ---
class ConnectionManager:
    def __init__(self):
        self.active_connections: list[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

    async def broadcast(self, message: dict):
        for connection in self.active_connections:
            await connection.send_json(message)

# Global manager instance
manager = ConnectionManager()

# --- REST Endpoints ---
@app.get("/api/emotions/current", tags=["Analytics"])
def get_current_emotions(db: Session = Depends(get_db)):
    """
    Returns the most recent aggregated emotion scores for all tracked countries.
    Used by the 3D Globe to paint the initial state.
    """
    # Find the most recent headline timestamp for each country
    subquery = db.query(
        Headline.country_code, 
        func.max(Headline.timestamp).label('max_time')
    ).group_by(Headline.country_code).subquery()

    # Join back to get the actual headline data
    latest_headlines = db.query(Headline).join(
        subquery,
        (Headline.country_code == subquery.c.country_code) & 
        (Headline.timestamp == subquery.c.max_time)
    ).all()

    results = []
    for h in latest_headlines:
        scores = {
            "Joy": h.joy, "Anger": h.anger, "Fear": h.fear, 
            "Surprise": h.surprise, "Sadness": h.sadness, 
            "Disgust": h.disgust, "Neutral": h.neutral
        }
        # Find the emotion with the highest score
        dominant = max(scores, key=scores.get) if scores else "Neutral"
        
        results.append({
            "country": h.country_code,
            "headline": h.title,
            "dominant_emotion": dominant,
            "scores": scores,
            "timestamp": h.timestamp
        })
        
    return {"status": "success", "data": results}

@app.get("/api/emotions/historical", tags=["Analytics"])
def get_historical_emotions(date: str, db: Session = Depends(get_db)):
    """
    Time-Travel endpoint: Returns the state of global emotions on a specific historical date (YYYY-MM-DD).
    """
    # MVP: Currently mocked. Will be implemented to filter db by timestamp.
    return {"status": "success", "message": f"Historical data for {date} endpoint successfully wired."}

# --- WebSocket Endpoint ---
@app.websocket("/ws/emotions/live")
async def websocket_endpoint(websocket: WebSocket):
    """
    Real-time streaming endpoint for the React 3D Globe.
    When the fetch_news.py scraper finds a new headline, it broadcasts through this manager.
    """
    await manager.connect(websocket)
    try:
        while True:
            # Keep connection alive
            data = await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(websocket)
