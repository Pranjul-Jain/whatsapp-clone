from django.contrib import admin
from .models import User, Connection,Group , MemberDetails

admin.site.register(User)
admin.site.register(Connection)
admin.site.register(Group)
admin.site.register(MemberDetails)