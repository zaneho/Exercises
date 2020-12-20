from flask import json
from werkzeug.exceptions import HTTPException

from api.app import app


@app.errorhandler(HTTPException)
def handle_exception(e):
    response = e.get_response()
    response.data = json.dumps({
        "description": e.description,
    })
    response.content_type = "application/json"
    return response


class BadRequest(HTTPException):
    code = 400
    description = 'Bad request'


class ServerError(HTTPException):
    code = 500
    description = 'Server Error'
