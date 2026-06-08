from transformers import pipeline

class EmotionEngine:
    def __init__(self):
        # We use a pipeline for text classification
        # j-hartmann/emotion-english-distilroberta-base predicts 7 emotions:
        # anger, disgust, fear, joy, neutral, sadness, surprise
        self.classifier = pipeline("text-classification", model="j-hartmann/emotion-english-distilroberta-base", top_k=None)

    def analyze_headline(self, text: str):
        """
        Takes a headline and returns a dictionary of the 7 emotion scores.
        """
        # top_k=None returns all scores
        results = self.classifier(text)[0]
        
        # Format the output into a simple dictionary {emotion: score}
        scores = {res['label']: res['score'] for res in results}
        
        return {
            'joy': scores.get('joy', 0.0),
            'anger': scores.get('anger', 0.0),
            'fear': scores.get('fear', 0.0),
            'surprise': scores.get('surprise', 0.0),
            'sadness': scores.get('sadness', 0.0),
            'disgust': scores.get('disgust', 0.0),
            'neutral': scores.get('neutral', 0.0),
        }

# Singleton instance to be used by the scraper
emotion_engine = EmotionEngine()
