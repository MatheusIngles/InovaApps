import os
basedir = os.path.abspath(os.path.dirname(__file__))

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'voce-nunca-saberah'
    API_KEY = os.environ.get("""curl "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent"
    -H 'Content-Type: application/json'
    -H 'X-goog-api-key: GEMINI_API_KEY'
    -X POST
    -d '{
        "contents": [
        {
            "parts": [
            {
                "text": "Explain how AI works in a few words"
            }
            ]
        }
        ]
    }""")

    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or \
        'sqlite:///' + os.path.join(basedir, 'app.db')
    