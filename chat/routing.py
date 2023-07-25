from django.urls import re_path 
from . import views

url_patterns = [
    re_path(r"socket-server/(?P<room_name>\w+)/$",views.Consumer.as_asgi()),
]