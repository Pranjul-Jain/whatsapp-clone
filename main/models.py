from djongo import models
from datetime import datetime
import uuid

class User(models.Model):
    _id = models.ObjectIdField()
    username = models.CharField(max_length=200,null=False,blank=False)
    number = models.CharField(max_length=13,null=False,blank=False,unique=True)
    upload_image = models.ImageField(upload_to="images/")
    password = models.CharField(max_length=200,null=False,blank=False)
    objects = models.DjongoManager()

class Messages(models.Model):
    _id = models.CharField(max_length=30,primary_key=True,default=uuid.uuid4().hex)
    user_id = models.CharField(max_length=30,null=False,blank=False)
    ref_id = models.CharField(max_length=30)
    message = models.TextField(null=False,blank=False)
    message_timestamp = models.CharField(max_length=100,null=False,blank=False)

class Connection(models.Model):
    _id = models.ObjectIdField()
    user = models.ForeignKey(User,models.CASCADE,related_name="user_id")
    name = models.CharField(max_length=200,null=False,blank=False)
    receiver = models.ForeignKey(User,models.CASCADE,related_name="receiver_id")
    message_timestamp = models.CharField(max_length=100,null=False,blank=False)
    messages = models.ArrayField(model_container=Messages)
    objects = models.DjongoManager()

class MemberDetails(models.Model):
    _id = models.CharField(max_length=30,primary_key=True,default=uuid.uuid4().hex)
    user_id = models.CharField(max_length=30,null=False,blank=False)
    message_timestamp = models.CharField(max_length=100,null=False,blank=False)

class Admin(models.Model):
     _id = models.CharField(max_length=30,primary_key=True,default=uuid.uuid4().hex)
     user_id = models.CharField(max_length=30,null=False,blank=False)

class Group(models.Model):
    _id = models.ObjectIdField()
    name = models.CharField(max_length=200,null=False,blank=False)
    upload_image = models.ImageField(upload_to="images/")
    creator_id = models.ForeignKey(User,on_delete=models.CASCADE)
    members = models.ArrayField(model_container=MemberDetails)
    admin = models.ArrayField(model_container=Admin)
    timestamp = models.CharField(max_length=100,null=False,blank=False)
    restriction = models.BooleanField(default=False)
    messages = models.ArrayField(model_container=Messages)
    objects = models.DjongoManager()