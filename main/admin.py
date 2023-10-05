from django.contrib import admin
from django import forms
from .models import User, Connection,Group , MemberDetails

class ConnectionAdminForm(forms.ModelForm):
    messages = forms.CharField(
        widget=forms.Textarea(attrs={'rows': 4, 'cols': 40}),
        label='Message',
        initial='Default Message'
    )

    class Meta:
        model = Connection
        fields = "__all__"

class ConnectionAdmin(admin.ModelAdmin):
    form = ConnectionAdminForm

class GroupAdminForm(forms.ModelForm):
    messages = forms.CharField(
        widget=forms.Textarea(attrs={'rows': 4, 'cols': 40}),
        label='Message',
        initial='Default Message'
    )

    members = forms.CharField(
        widget=forms.Textarea(attrs={'rows': 4, 'cols': 40}),
        label='Message',
        initial='Default Message'
    )

    admin = forms.CharField(
        widget=forms.Textarea(attrs={'rows': 4, 'cols': 40}),
        label='Message',
        initial='Default Message'
    )

    class Meta:
        model = Group
        fields = "__all__"

class GroupAdmin(admin.ModelAdmin):
    form = GroupAdminForm

admin.site.register(User)
admin.site.register(Connection,ConnectionAdmin)
admin.site.register(Group,GroupAdmin)
admin.site.register(MemberDetails)