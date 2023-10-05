from django.conf import settings
from django.core.management.base import BaseCommand
import os
from django.contrib.auth.models import User
from main.admin import User as us

class Command(BaseCommand):
    def handle(self, *args, **options):
        if User.objects.count() == 0:
            User.objects.create_superuser(username=os.getenv("DJANGO_USERNAME"), password=os.getenv("DJANGO_PASSWORD"), email=os.getenv("DJANGO_EMAIL"))
        else:
            print("user already exists")
