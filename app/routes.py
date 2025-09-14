# app/routes.py

from urllib.parse import urlsplit
from flask import render_template, flash, redirect, url_for, request, abort, jsonify
import sqlalchemy as sa
from app.IA import responder_usuario, UsarGemini, CriarChamadoParaBanco, recarregarDados
from app import app, db
from datetime import datetime, timezone
from app.models import Ticket, Chat, Message, ApplicationSettings
import random
import string
import tempfile
import json
import os

@app.route('/')
@app.route('/index')
def index():
    return redirect(url_for('chat'))

@app.route('/chat', methods=["GET", "POST"])
def chat():
    if request.method == "POST":
        data = request.json
        text = data.get("message", "")
        Resposta = responder_usuario(text)
        if Resposta:
            text, boaSimilidade = Resposta
            return jsonify({"status": "ok", "text": text, "encontrado": True, "boaSimilidade": True if boaSimilidade >= 0.81 else False})
        else:
            return jsonify({"text": "Desculpe, Não encontrei informações específicas sobre isso na base de conhecimento. Quer que eu pense para te responder ou já abrir um chamado com base no chat?", "encontrado": False})     
    else:
        return render_template('chat.html', render_sidebar=True)

@app.route('/chatDaCuston', methods=["GET"])
def chatDaCuston():
    return render_template('chatDaCuston.html', render_sidebar=True)

@app.route('/chat_preview')
def chat_preview():
    return render_template('chat.html', render_sidebar=False)

@app.route('/respostaIA', methods=["GET","POST"])
def respostaIA():
    data = request.json
    text = data.get("text", "")
    conversas_passadas = data.get("history", [])
    Resposta = UsarGemini(text, conversas_passadas)
    return jsonify({"status": "ok", "text": Resposta})

@app.route('/criar_chamado', methods=["GET","POST"])
def criar_chamado():
    data = request.json
    text = data.get("message", "")
    print(text)
    Resposta = CriarChamadoParaBanco(text)
    return jsonify({"status": "ok", "text": Resposta})

@app.route('/add_ticket_database', methods=["POST"])
def add_ticket_database():
    title = request.form.get("title")
    description = request.form.get("description")
    priority = request.form.get("priority")

    if title == "" or description == "" or priority == "":
        return redirect(url_for("chamados"))

    letters = ''.join(random.choices(string.ascii_uppercase, k=2))
    numbers = ''.join(random.choices(string.digits, k=3))
    code = f"{letters}-{numbers}"

    new_ticket = Ticket(
        title=title,
        description=description,
        status="aberto",
        code=code,
        priority=priority
    )

    db.session.add(new_ticket)

    db.session.commit()

    return redirect(url_for('chamados'))

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
    total_tickets = Ticket.query.count()
    abertos = Ticket.query.filter_by(status="aberto").count()
    pendentes = Ticket.query.filter_by(status="em-andamento").count()
    finalizados = Ticket.query.filter_by(status="resolvido").count()
    fechados = Ticket.query.filter_by(status="fechado").count()
    horas_media = "1 dia"
    ultimos_tickets = Ticket.query.order_by(Ticket.id.desc()).limit(3).all()
    tikets_formatado = []
    for ticket in ultimos_tickets:
        tikets_formatado.append({
            "type": "new" if ticket.status == "aberto" else "update" if ticket.status == "em-andamento" else "close",
            "title": ticket.title,
            "description": ticket.description,
            "time": ticket.created_at
        })
    return render_template('dashboard.html', render_sidebar=True, total_tickets=total_tickets,
                            fechados=fechados, abertos=abertos, pendentes=pendentes, finalizados=finalizados,
                              horas_media=horas_media, ultimos_tickets=tikets_formatado)

@app.route('/dashboard_preview')
def dashboard_preview():
    return render_template('dashboard.html', render_sidebar=False)

@app.route('/kanban')
def kanban():
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

    return render_template('kanban.html', render_sidebar=True, tickets=tickets_data)

@app.route('/kanban_preview')
def kanban_preview():
    return render_template('kanban.html', render_sidebar=False, tickets=[])

@app.route('/update_ticket_status', methods=['POST'])
def update_ticket_status():
    try:
        data = request.json
        ticket_code = data.get('ticket_code')
        new_status = data.get('status')

        if not ticket_code or not new_status:
            return jsonify({'success': False, 'error': 'Código do ticket e status são obrigatórios'})

        # Buscar o ticket pelo código
        ticket = Ticket.query.filter_by(code=ticket_code).first()
        
        if not ticket:
            return jsonify({'success': False, 'error': 'Ticket não encontrado'})

        # Atualizar o status
        ticket.status = new_status
        db.session.commit()

        return jsonify({'success': True, 'message': 'Status atualizado com sucesso'})

    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'error': str(e)})

@app.route('/custom')
def custom():
    return render_template('custom.html')

@app.route('/process-satisfaction', methods=["POST"])
def process_satisfaction():
    try:
        data = request.json
        message = data.get("message", "")
        messagem_bot = data.get("messagem_bot", "")
        
        if not message or not messagem_bot:
            return jsonify({"error": "Message and messagem_bot are required"}), 400
        
        artigo_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'Docs', 'Artigos', 'Artigo_llm.json')
        
        try:
            with open(artigo_path, 'r', encoding='utf-8') as f:
                artigos = json.load(f)
        except (FileNotFoundError, json.JSONDecodeError):
            artigos = []
        
        nova_entrada = {
            "topico": message.lower().strip(),
            "resposta": messagem_bot
        }
        
        artigos.append(nova_entrada)
        
        with open(artigo_path, 'w', encoding='utf-8') as f:
            json.dump(artigos, f, ensure_ascii=False, indent=2)
        
        recarregarDados()

        return jsonify({
            "status": "success", 
            "message": "Feedback registrado com sucesso! A resposta foi adicionada à base de conhecimento."
        })
        
    except Exception as e:
        print(f"Erro ao processar satisfação: {str(e)}")
        return jsonify({"error": "Erro interno do servidor"}), 500


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