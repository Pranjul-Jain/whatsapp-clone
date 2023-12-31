from django.http import HttpResponse
from django.conf import settings
from rest_framework.decorators import  api_view
from rest_framework.response import Response
from main.admin import Group , User , Connection
import os
import uuid
import json
from bson import ObjectId
from datetime import datetime
import pytz

def GetUserImage(request):
    image_name = request.GET.get('image')
    if(not image_name):
        return HttpResponse(b'',content_type="image/*")
    image_path = os.path.join(settings.MEDIA_ROOT,image_name)
    with open(image_path,"rb") as fp:
        return HttpResponse(fp.read(),content_type="image/*")

def GetUserImageById(request):
    user_id = request.GET.get("user_id")
    user = User.objects.get(_id=ObjectId(user_id))
    if(user.upload_image.name):
        image_path = os.path.join(settings.MEDIA_ROOT,user.upload_image.name)
        with open(image_path,"rb") as fp:
            return HttpResponse(fp.read(),content_type="image/*")
    else:
        return HttpResponse(b'',content_type="image/*")

@api_view(["POST"])
def addGroup(request):
    timestamp = datetime.now(pytz.timezone("Asia/kolkata")).strftime("%a %b %d %Y %H:%M:%S GMT%z (%Z)")
    name = request.data.get("name",None)
    image = request.data.get("image",None)
    members = request.data.get("members",None)
    
    if members:
        members = json.loads(members)
        for member in members:
            member["_id"] = uuid.uuid4().hex
            member['message_timestamp'] = timestamp
    
    if not isinstance(image,str):
        image.name = image.name[:image.name.find(".")] + str(uuid.uuid4()) + image.name[image.name.find("."):]
    else:
        image = ""
    group = Group(name=name,creator_id=User.objects.get(_id=ObjectId(request.session.get("user",None))),upload_image=image,members=[],admin=[]\
                ,timestamp=datetime.now(pytz.timezone("Asia/kolkata")).strftime("%a %b %d %Y %H:%M:%S GMT%z (%Z)"),messages=[],restriction=False)
    group.members = members
    group.admin = [{"_id":uuid.uuid4().hex,"user_id":request.session.get("user",None)}]
    group.save()
    
    return Response({"message":"success"})

@api_view(["GET"])
def getReceiverName(request):
    
    user_id = request.GET.get("user_id")
    receiver_id = request.GET.get("receiver_id")

    data = list(Connection.objects.mongo_find({"user_id":ObjectId(user_id),"receiver_id":ObjectId(receiver_id)},{"name":1}))
    if data:
        return Response({"username":data[0]["name"][2:]})
    
    user = list(User.objects.mongo_find({"_id":ObjectId(user_id)},{"number":1}))

    if user:
        return Response({"username":user[0]["number"]})
    else:
        return Response({"username":None})