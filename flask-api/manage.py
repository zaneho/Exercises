from flask.cli import FlaskGroup

from api.app import app, db
from api.model.Todo import Todo
from api.model.User import User
from api.utils.jwt import prune_revoked_token

cli = FlaskGroup(app)


@cli.command("create_db")
def create_db():
    db.drop_all()
    db.create_all()
    db.session.add(User("bob", User.generate_hash("123")))
    db.session.add(User("mary", User.generate_hash("123")))
    db.session.add(Todo("seeded item 1"))
    db.session.add(Todo("seeded item 2"))
    db.session.commit()


@cli.command("prune_db")
def prune_db():
    prune_revoked_token()


if __name__ == "__main__":
    cli()
