from api.app import db
from api.model.User import USERID_MAX_LENGTH
from datetime import datetime

JTI_MAX_LENGTH = 36
TOKEN_TYPE_MAX_LENGTH = 10


class TokenBlacklist(db.Model):
    __tablename__ = 'token_blacklist'

    id = db.Column(db.Integer, primary_key=True)
    jti = db.Column(db.String(JTI_MAX_LENGTH), nullable=False)
    token_type = db.Column(db.String(TOKEN_TYPE_MAX_LENGTH), nullable=False)
    expires = db.Column(db.DateTime, nullable=False)
    user_identity = db.Column(db.String(USERID_MAX_LENGTH), nullable=False)

    def __init__(self, jti, token_type, expires, user_identity):
        self.jti = jti
        self.token_type = token_type
        self.expires = expires
        self.user_identity = user_identity

    def add(self):
        db.session.add(self)
        db.session.commit()

    @staticmethod
    def get_by_jti(jti):
        return TokenBlacklist.query.filter_by(jti=jti).first()

    @staticmethod
    def get_all_expired():
        now = datetime.utcnow()
        return TokenBlacklist.query.filter(TokenBlacklist.expires < now).all()

    @staticmethod
    def blacklist_token(token, user_identity):
        jti = token['jti']
        expires = datetime.fromtimestamp(token['exp'])
        token_type = token['type']
        token = TokenBlacklist(jti, token_type, expires, user_identity)
        token.add()
