# app/routes.py

from flask import render_template, request, redirect, url_for
from app import app

@app.route('/')
@app.route('/index')
def index():
    ...
