# app/routes.py

from urllib.parse import urlsplit
from flask import render_template, flash, redirect, url_for, request
import sqlalchemy as sa
from app import app, db
from datetime import datetime, timezone

@app.route('/')
def index():
    return render_template('chat.html')

@app.route('/chat')
def landing():
    return render_template('chat.html')

@app.route('/chamados')
def landing():
    return render_template('chamados.html')

@app.route('/dashboard')
def landing():
    return render_template('dashboard.html')

@app.route('/custom')
def landing():
    return render_template('custom.html')