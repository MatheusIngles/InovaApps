# app/routes.py

from urllib.parse import urlsplit
from flask import render_template, flash, redirect, url_for, request
import sqlalchemy as sa
from app import app, db
from datetime import datetime, timezone


img = {'src': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT5wXuP78VDV_ZMEMJG2VUi1bZNEbUBWe630g&s',
        'alt': 'Imagem de um Lapras'}


@app.route('/')
@app.route('/index')
def index():
    return render_template("index.html")

