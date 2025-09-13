import sqlalchemy as sa
import sqlalchemy.orm as so
#from app import app, db
from app import app
from app.models import User, Post

@app.shell_context_processor
def make_shell_context():
    return {'sa': sa, 'so': so, 'User': User, 'Post': Post}