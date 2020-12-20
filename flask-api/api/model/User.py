from marshmallow import fields
from marshmallow.validate import Length
from passlib.hash import pbkdf2_sha256 as sha256

from api.app import db, ma
from api.utils.errors import BadRequest

USERID_MAX_LENGTH = 128
PASSWORD_MAX_LENGTH = 255


class User(db.Model):
    __tablename__ = 'user_account'

    userid = db.Column(db.String(USERID_MAX_LENGTH), primary_key=True)
    password = db.Column(db.String(PASSWORD_MAX_LENGTH), nullable=False)

    def __init__(self, userid, password):
        self.userid = userid
        self.password = password

    @staticmethod
    def get_user(data):
        error = user_schema.validate(data, partial=("password",))
        if not error:
            userid = data['userid']
            return User.query.filter_by(userid=userid).first()
        raise BadRequest(error)

    @staticmethod
    def generate_hash(password):
        return sha256.hash(password)

    @staticmethod
    def verify_hash(data, hashed_password):
        error = user_schema.validate(data, partial=("userid",))
        if not error:
            password = data['password']
            return sha256.verify(password, hashed_password)
        raise BadRequest(error)


class UserSchema(ma.Schema):
    userid = fields.Str(required=True, validate=Length(min=1, max=USERID_MAX_LENGTH))
    password = fields.Str(required=True, validate=Length(min=1, max=PASSWORD_MAX_LENGTH))

    class Meta:
        fields = ("userid", "password")


user_schema = UserSchema()
