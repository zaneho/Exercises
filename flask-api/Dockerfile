FROM python:3.8-slim-buster

WORKDIR /api

COPY ./ ./

RUN pip install -r requirements.txt

EXPOSE 5000

CMD gunicorn --config gunicorn_config.py manage:app




