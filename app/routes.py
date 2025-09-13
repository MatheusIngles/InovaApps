# app/routes.py

from urllib.parse import urlsplit
from flask import render_template, flash, redirect, url_for, request, abort, jsonify
import sqlalchemy as sa
from app.IA import responder_usuario, UsarGemini, CriarChamadoParaBanco
from app import app, db
from datetime import datetime, timezone
from app.models import Ticket, Chat, Message, ApplicationSettings

import tempfile

@app.route('/')
@app.route('/index')
@app.route('/chat', methods=["GET", "POST"])
def chat():
    if request.method == "POST":
        data = request.json
        text = data.get("message", "")
        Resposta = responder_usuario(text)
        if Resposta:
            text = Resposta
            return jsonify({"status": "ok", "text": text, "encontrado": True})
        else:
            return jsonify({"text": "Desculpe, Não encontrei informações específicas sobre isso na base de conhecimento. Quer que eu pense para te responder ou já abrir um chamado com base no chat?", "encontrado": False})     
    else:
        return render_template('chat.html', render_sidebar=True)

@app.route('/chat_preview')
def chat_preview():
    return render_template('chat.html', render_sidebar=False)

@app.route('/respostaIA', methods=["GET","POST"])
def respostaIA():
    data = request.json
    text = data.get("text", "")
    Resposta = UsarGemini(text)
    return jsonify({"status": "ok", "text": Resposta})

@app.route('/criar_chamado', methods=["GET","POST"])
def criar_chamado():
    data = request.json
    text = data.get("message", "")
    Resposta = CriarChamadoParaBanco(text)
    return jsonify({"status": "ok", "text": Resposta})

@app.route('/add_ticket_database', methods=["POST"])
def add_ticket_database():
    
    redirect(url_for('/chamados'))

@app.route('/chamados')
def chamados():
    tickets = Ticket.query.all()

    tickets_data = [
        {
            "code": t.code,
            "title": t.title,
            "description": t.description,
            "status": t.status,
            "priority": t.priority,
            "date": t.created_at.strftime("%d-%m-%Y"),
            "time": t.created_at.strftime("%H:%M"),
        }
        for t in tickets
    ]

    return render_template('chamados.html', render_sidebar=True, tickets=tickets_data)

@app.route('/chamados_preview')
def chamados_preview():
    return render_template('chamados.html', render_sidebar=False)

@app.route('/dashboard')
def dashboard():
    return render_template('dashboard.html', render_sidebar=True)

@app.route('/dashboard_preview')
def dashboard_preview():
    return render_template('dashboard.html', render_sidebar=False)

@app.route('/custom')
def custom():
    return render_template('custom.html')


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