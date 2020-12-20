from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required
from sqlalchemy import exc
from api.model.Todo import Todo, todo_schema, todos_schema
from api.utils.errors import ServerError

todo_blueprint = Blueprint('todo', __name__)


@todo_blueprint.route('/todo', methods=["GET"])
@jwt_required
def get_todo():
    try:
        todo = Todo.get_all_todo()
        result = todos_schema.dump(todo)
        return jsonify(result)
    except exc.SQLAlchemyError as e:
        raise ServerError(e.args[0])


@todo_blueprint.route('/todo/<int:todo_id>', methods=["GET"])
@jwt_required
def get_todo_by_id(todo_id):
    try:
        todo = Todo.get_one_todo(todo_id)
        return todo_schema.jsonify(todo)
    except exc.SQLAlchemyError as e:
        raise ServerError(e.args[0])


@todo_blueprint.route('/todo', methods=["POST"])
@jwt_required
def add_todo():
    try:
        data = request.get_json()
        result = Todo.create_todo(data)
        return todo_schema.jsonify(result), 201
    except exc.SQLAlchemyError as e:
        raise ServerError(e.args[0])
