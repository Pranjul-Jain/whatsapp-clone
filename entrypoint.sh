/opt/venv/bin/python manage.py createsuperuser --username $USERNAME --noinput
/opt/venv/bin/python manage.py makemigrations --no-input
/opt/venv/bin/python manage.py migrate --no-input
/opt/venv/bin/python manage.py collectstatic --no-input

/opt/venv/bin/daphne --bind $DJANGO_HOST --port $DJANGO_PORT main.asgi:application