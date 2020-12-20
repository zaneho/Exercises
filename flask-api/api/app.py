from decouple import config as env_config
from flask import Flask
from flask_jwt_extended import JWTManager
from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow

app = Flask(__name__)
app.config.from_object(env_config('APP_SETTINGS'))
db = SQLAlchemy(app)
jwt = JWTManager(app)
ma = Marshmallow(app)

from api.route.auth import auth_blueprint
from api.route.todo import todo_blueprint
import api.utils.jwt

app.register_blueprint(auth_blueprint)
app.register_blueprint(todo_blueprint)


@app.route('/')
def hello_world():
    return 'hello world'

# curl -i -H "Content-Type: application/json" -X POST -d '{"userid":"bob","password":"123"}' 127.0.0.1:5000/auth/login
# curl -i -H "Authorization: Bearer <>" 127.0.0.1:5000/todo
# curl -i -H "Authorization: Bearer <>" -H "Content-Type: application/json" -X POST -d '{"description":"water"}' 127.0.0.1:5000/todo

# curl -i -H "Authorization: Bearer <>" -X POST 127.0.0.1:5000/auth/refresh
# curl -i -H "Authorization: Bearer <>" -X DELETE 127.0.0.1:5000/auth/access_revoke
