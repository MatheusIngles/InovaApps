# app/routes.py

from urllib.parse import urlsplit
from flask import render_template, flash, redirect, url_for, request, abort, jsonify
import sqlalchemy as sa
from app import app, db
from datetime import datetime, timezone

import speech_recognition as sr
import tempfile

@app.route('/')
@app.route('/index')
def index():
    return render_template('chat.html')

@app.route('/chat')
def chat():
    return render_template('chat.html')

@app.route('/chamados')
def chamados():
    return render_template('chamados.html')

@app.route('/dashboard')
def dashboard():
    return render_template('dashboard.html')

@app.route('/custom')
def custom():
    return render_template('custom.html')

@app.route("/speech", methods=["POST"])
def speech_to_text():
    audio_file = request.files["audio"]
    with tempfile.NamedTemporaryFile(delete=True, suffix=".wav") as tmp:
        audio_file.save(tmp.name)
        r = sr.Recognizer()
        with sr.AudioFile(tmp.name) as source:
            audio = r.record(source)
            text = r.recognize_google(audio, language="pt-BR")
    return jsonify({"text": text})

@app.route("/erro_404")
def erro_404():
    abort(404)

@app.route("/erro_500")
def erro_500():
    abort(500)

@app.route("/erro_403")
def erro_403():
    abort(403)

@app.route("/erro_generico")
def erro_418():
    abort(418)