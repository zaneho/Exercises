# gunicorn + flask + postgres + docker

### Build images and run containers
```
docker-compose up -d --build
```

### Create database tables
```
docker-compose exec api python manage.py create_db
```
