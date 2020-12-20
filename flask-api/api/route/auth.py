from flask import Blueprint, request
from flask_jwt_extended import create_access_token, create_refresh_token, \
    jwt_refresh_token_required, get_jwt_identity, \
    jwt_required, get_raw_jwt
from sqlalchemy import exc

from api.app import app
from api.model.User import User
from api.utils.errors import ServerError
from api.model.TokenBlacklist import TokenBlacklist

auth_blueprint = Blueprint('auth', __name__)


@auth_blueprint.route('/auth/login', methods=["POST"])
def login():
    try:
        data = request.get_json()
        user = User.get_user(data)
        if user and User.verify_hash(data, user.password):
            access_token = create_access_token(user.userid)
            refresh_token = create_refresh_token(user.userid)
            return {'access_token': access_token,
                    'refresh_token': refresh_token}, 201
        return {'message': 'Invalid User ID / Password.'}
    except exc.SQLAlchemyError as e:
        raise ServerError(e.args[0])


@auth_blueprint.route('/auth/refresh', methods=['POST'])
@jwt_refresh_token_required
def refresh():
    current_user = get_jwt_identity()
    return {
        'access_token': create_access_token(current_user)
    }


@app.route('/auth/access_revoke', methods=['DELETE'])
@jwt_required
def revoke_access_token():
    try:
        TokenBlacklist.blacklist_token(get_raw_jwt(), get_jwt_identity())
        return {'message': "Successfully logout"}
    except exc.SQLAlchemyError as e:
        raise ServerError(e.args[0])


@app.route('/auth/refresh_revoke', methods=['DELETE'])
@jwt_refresh_token_required
def revoke_refresh_token():
    try:
        TokenBlacklist.blacklist_token(get_raw_jwt(), get_jwt_identity())
        return {'message': "Successfully logout"}
    except exc.SQLAlchemyError as e:
        raise ServerError(e.args[0])
