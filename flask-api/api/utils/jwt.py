from api.app import jwt, db
from api.model.TokenBlacklist import TokenBlacklist
from sqlalchemy import exc
from api.utils.errors import ServerError


@jwt.token_in_blacklist_loader
def check_token_revoked(decoded_token):
    try:
        jti = decoded_token['jti']
        token = TokenBlacklist.get_by_jti(jti)
        return token
    except exc.SQLAlchemyError as e:
        raise ServerError(e.args[0])


def prune_revoked_token():
    try:
        expired = TokenBlacklist.get_all_expired()
        for token in expired:
            db.session.delete(token)
        db.session.commit()
    except exc.SQLAlchemyError as e:
        raise ServerError(e.args[0])
