import os
import requests
from dotenv import load_dotenv
from database import SessionLocal, engine
from models import Base, Headline
from emotion_engine import emotion_engine

# Ensure database tables are created
Base.metadata.create_all(bind=engine)

load_dotenv()
NEWS_API_KEY = os.getenv("NEWS_API_KEY")

# Target countries to fetch news for
COUNTRIES = ["us", "gb", "de", "fr", "jp"]

def fetch_and_process_news():
    if not NEWS_API_KEY:
        print("Error: NEWS_API_KEY environment variable not set in .env file.")
        return

    db = SessionLocal()
    try:
        for country in COUNTRIES:
            print(f"Fetching news for {country.upper()}...")
            url = f"https://newsapi.org/v2/top-headlines?country={country}&apiKey={NEWS_API_KEY}"
            response = requests.get(url)
            
            if response.status_code != 200:
                print(f"Failed to fetch data for {country}: {response.text}")
                continue
                
            articles = response.json().get('articles', [])
            
            for article in articles:
                title = article.get('title')
                if not title:
                    continue
                    
                # Run the headline through our NLP Emotion Engine
                emotion_scores = emotion_engine.analyze_headline(title)
                
                # Save to database
                headline_entry = Headline(
                    country_code=country,
                    title=title,
                    joy=emotion_scores['joy'],
                    anger=emotion_scores['anger'],
                    fear=emotion_scores['fear'],
                    surprise=emotion_scores['surprise'],
                    sadness=emotion_scores['sadness'],
                    disgust=emotion_scores['disgust'],
                    neutral=emotion_scores['neutral']
                )
                db.add(headline_entry)
                
        db.commit()
        print("Successfully processed and saved news headlines to SQLite database.")
    except Exception as e:
        print(f"An error occurred during processing: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    fetch_and_process_news()
