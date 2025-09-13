# app/routes.py

from urllib.parse import urlsplit
from flask import render_template, flash, redirect, url_for, request, abort, jsonify
import sqlalchemy as sa
from app import app, db
from datetime import datetime, timezone

import tempfile

@app.route('/')
@app.route('/index')
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

@app.route("/submit_text", methods=["POST"])
def submit_text():
    data = request.json
    text = data.get("text", "")
    print("Texto recebido:", text)
    # aqui você poderia salvar no banco, processar, etc.
    print(jsonify({"status": "ok", "text": text}))

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