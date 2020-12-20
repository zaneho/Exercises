from marshmallow.validate import Length

from api.app import db, ma
from marshmallow import fields
from api.utils.errors import BadRequest

DESCRIPTION_MAX_LEN = 255


class Todo(db.Model):
    __tablename__ = 'todo'

    id = db.Column(db.Integer, primary_key=True)
    description = db.Column(db.String(DESCRIPTION_MAX_LEN), nullable=False)

    def __init__(self, description):
        self.description = description

    @staticmethod
    def get_all_todo():
        return Todo.query.all()

    @staticmethod
    def get_one_todo(todo_id):
        return Todo.query.filter_by(id=todo_id).first()

    @staticmethod
    def create_todo(data):
        error = todo_schema.validate(data)
        if not error:
            description = data['description']
            new_todo = Todo(description)
            db.session.add(new_todo)
            db.session.commit()
            return new_todo
        raise BadRequest(error)


# Todo schema
class TodoSchema(ma.Schema):
    description = fields.Str(required=True,
                             validate=Length(min=1, max=DESCRIPTION_MAX_LEN))

    class Meta:
        fields = ("id", "description")


# Init schema
todo_schema = TodoSchema()
todos_schema = TodoSchema(many=True)
