from flask import Flask
from flask_cors import CORS

app = Flask('LawsBrowser')
CORS(app)

from src import routes
