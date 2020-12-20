import datetime

from decouple import config


class Config(object):
    DEBUG = False
    TESTING = False
    SQLALCHEMY_DATABASE_URI = config('DATABASE_URL')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    JWT_SECRET_KEY = config('ACCESS_TOKEN_SECRET')
    JWT_ACCESS_TOKEN_EXPIRES = datetime.timedelta(seconds=60*5)
    JWT_REFRESH_TOKEN_EXPIRES = datetime.timedelta(seconds=60*60*24)
    JWT_BLACKLIST_ENABLED = True
    JWT_BLACKLIST_TOKEN_CHECKS = ['access', 'refresh']


class ProductionConfig(Config):
    DEBUG = False


class DevelopmentConfig(Config):
    DEVELOPMENT = True
    DEBUG = True


class TestingConfig(Config):
    TESTING = True
